import { makeAutoObservable } from 'mobx';

import type { PermissionsStore } from '../../../external';
import { permissionsStore } from '../../../external';

export class UIStore {
  constructor(private readonly permissions: PermissionsStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public permissions
}

export const createUIStore = () => new UIStore(permissionsStore);
