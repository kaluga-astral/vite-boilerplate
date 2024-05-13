import { makeAutoObservable } from 'mobx';

import { permissionsStore } from '../../../domain';
import type { PermissionsStore, Policies } from '../../../domain';

export class UIStore {
  constructor(
    private readonly policies: Policies[],
    private readonly permissions: PermissionsStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public prepareData = () => {
    this.permissions.preparePolicies(this.policies).sync();
  };

  public get status() {
    return this.permissions.preparePolicies(this.policies).status;
  }
}

export const createUIStore = (policies: Policies[]) =>
  new UIStore(policies, permissionsStore);
