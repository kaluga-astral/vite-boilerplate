import { makeAutoObservable } from 'mobx';

import { permissionsStore } from '../../../../external';
import type { PermissionsStore } from '../../../../external';

export class UIStore {
  constructor(private readonly permissions: PermissionsStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isAllowBookCreation() {
    console.log(this.permissions.administration.administrationActions);

    return this.permissions.administration.administrationActions.isAllowed;
  }
}

export const createUIStore = () => new UIStore(permissionsStore);
