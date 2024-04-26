import { makeAutoObservable } from 'mobx';

export class PermissionsStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createPermissionsStore = () => new PermissionsStore();
