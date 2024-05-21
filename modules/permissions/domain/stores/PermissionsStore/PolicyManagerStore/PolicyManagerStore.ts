import { makeAutoObservable } from 'mobx';

import type { CacheMutation, CacheService } from '@example/shared';

import type { PermissionStrategy, Policy } from '../types';
import { createPermission } from '../utils';

type PrepareData = () => Promise<void>;

type PolicyMeta = {
  name: string;
  prepareData: PrepareData;
};

/**
 * Оркестрирует policy приложения: создает доступы, контролирует подготовку данных для формирования доступов
 */
export class PolicyManagerStore {
  private preparingDataMutation: CacheMutation<void>;

  private policies: PolicyMeta[] = [];

  constructor(cache: CacheService) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.preparingDataMutation = cache.createMutation(async () => {
      await Promise.all(this.policies.map(({ prepareData }) => prepareData()));
    });
  }

  public prepareData = () => {
    this.preparingDataMutation.sync();
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
        createPermission(this.preparingDataMutation.isSuccess, strategy),
    };
  };

  public get preparingDataStatus() {
    return {
      isSuccess: this.preparingDataMutation.isSuccess,
      isLoading: this.preparingDataMutation.isLoading,
      isError: this.preparingDataMutation.isError,
      error: this.preparingDataMutation.error,
    };
  }
}

export const createPolicyManagerStore = (cache: CacheService) =>
  new PolicyManagerStore(cache);
