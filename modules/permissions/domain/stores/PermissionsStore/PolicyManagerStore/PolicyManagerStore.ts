import { makeAutoObservable } from 'mobx';

import type { CacheMutation, CacheService } from '@example/shared';

import type { Rule } from '../types';
import { processPermission } from '../utils';

type PrepareData = () => Promise<void>;

type Policy = {
  name: string;
  prepareData: PrepareData;
};

/**
 * Оркестрирует policy приложения: создает доступы, контролирует подготовку данных для формирования доступов
 */
export class PolicyManagerStore {
  private preparingDataMutation: CacheMutation<void>;

  private policies: Policy[] = [];

  constructor(private readonly cache: CacheService) {
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
  public registerPolicy = (policy: Policy) => {
    this.policies.push(policy);
  };

  /**
   * Создает доступ, учитывая статус успешности подготовки данных
   */
  public processPermission = (rule: Rule) =>
    processPermission(this.preparingDataMutation.isSuccess, rule);

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
