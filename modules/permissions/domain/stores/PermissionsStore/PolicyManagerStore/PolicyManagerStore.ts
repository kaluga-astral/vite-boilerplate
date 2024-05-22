import { makeAutoObservable, runInAction } from 'mobx';

import {
  createAllowedPermission,
  createDenialPermission,
} from '../../../entities';
import type { PermissionStrategy, Policy } from '../types';
import type { Permission } from '../../../types';
import { PermissionDenialReason } from '../../../enums';
type PrepareData = () => Promise<void>;

type PreparingDataStatus = {
  isIdle: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
};

type PolicyMeta = {
  name: string;
  prepareData: PrepareData;
};

/**
 * Оркестрирует policy приложения: создает доступы, контролирует подготовку данных для формирования доступов
 */
export class PolicyManagerStore {
  public preparingDataStatus: PreparingDataStatus = {
    isIdle: true,
    isSuccess: false,
    isLoading: false,
    isError: false,
  };

  private policies: PolicyMeta[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private calcPermission = (
    policyName: string,
    strategy: PermissionStrategy,
  ) => {
    if (!this.preparingDataStatus.isSuccess) {
      console.warn(
        `${policyName}: При вычислении доступа не было получено необходимых данных`,
      );

      return createDenialPermission(PermissionDenialReason.MissingData);
    }

    let result: Permission | null = null;

    const allow = () => {
      result = createAllowedPermission();
    };

    const deny = (reason: PermissionDenialReason) => {
      result = createDenialPermission(reason);
    };

    strategy(allow, deny);

    if (result === null) {
      result = createDenialPermission(PermissionDenialReason.InternalError);
    }

    if (result?.reason === PermissionDenialReason.InternalError) {
      console.error(new Error('Результат проверки доступа не был получен'));
    }

    return result;
  };

  private startPreparingData = () => {
    this.preparingDataStatus.isIdle = false;
    this.preparingDataStatus.isLoading = true;
    this.preparingDataStatus.isSuccess = false;
    this.preparingDataStatus.isError = false;
    this.preparingDataStatus.error = undefined;
  };

  private successPreparingData = () => {
    this.preparingDataStatus.isLoading = false;
    this.preparingDataStatus.isSuccess = true;
  };

  private failPreparingData = (err: Error) => {
    this.preparingDataStatus.isLoading = false;
    this.preparingDataStatus.isError = true;
    this.preparingDataStatus.error = err;
  };

  public prepareDataSync = () => {
    this.startPreparingData();

    Promise.all(this.policies.map(({ prepareData }) => prepareData()))
      .then(() => {
        this.successPreparingData();
      })
      .catch((err) => {
        this.failPreparingData(err);
      });
  };

  public prepareDataAsync = async () => {
    this.startPreparingData();

    try {
      await Promise.all(this.policies.map(({ prepareData }) => prepareData()));
      this.successPreparingData();
    } catch (err) {
      this.failPreparingData(err as Error);
    }
  };

  /**
   * Позволяет централизованно подготавливать данные для всех policy приложения
   */
  public createPolicy = (policyMeta: PolicyMeta): Policy => {
    this.policies.push(policyMeta);

    return {
      name: policyMeta.name,
      /**
       * Создает доступ, учитывая статус успешности подготовки данных
       */
      createPermission: (strategy: PermissionStrategy) =>
        this.calcPermission(policyMeta.name, strategy),
    };
  };
}

export const createPolicyManagerStore = () => new PolicyManagerStore();
