import { makeAutoObservable } from 'mobx';

import type { PermissionsStore } from '../../../domain';
import { permissionsStore } from '../../../domain';

export class UIStore {
  constructor(private readonly permissions: PermissionsStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get preparingCriticalDataMutation() {
    return this.permissions.getPrepareCriticalDataMutation();
  }

  public get isLoading() {
    return this.preparingCriticalDataMutation.isLoading;
  }

  public get errorInfo() {
    return {
      isError: this.preparingCriticalDataMutation.isError,
      error: this.preparingCriticalDataMutation.error,
    };
  }

  public getCriticalData = () => {
    this.preparingCriticalDataMutation.sync();
  };
}

export const createUIStore = () => new UIStore(permissionsStore);
