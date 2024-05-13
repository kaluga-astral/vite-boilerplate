import { makeAutoObservable } from 'mobx';

import type { CacheMutation, CacheService } from '@example/shared';

import type { CheckPermission } from '../utils';
import { createPermission } from '../utils';

type PrepareData = () => Promise<void>;

export class PolicyStore {
  private preparingDataMutation: CacheMutation<void>;

  constructor(cache: CacheService, prepareData: PrepareData) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.preparingDataMutation = cache.createMutation(prepareData);
  }

  public createPermission = (checkPermission: CheckPermission) =>
    createPermission(this.preparingDataMutation.isSuccess, checkPermission);

  public prepareData = () => ({
    async: this.preparingDataMutation.async,
    sync: this.preparingDataMutation.sync,
  });

  public get preparingDataStatus() {
    return {
      isSuccess: this.preparingDataMutation.isSuccess,
      isLoading: this.preparingDataMutation.isLoading,
      isError: this.preparingDataMutation.isError,
      error: this.preparingDataMutation.error,
    };
  }
}

export const createPolicyStore = (
  cache: CacheService,
  prepareData: PrepareData,
) => new PolicyStore(cache, prepareData);
