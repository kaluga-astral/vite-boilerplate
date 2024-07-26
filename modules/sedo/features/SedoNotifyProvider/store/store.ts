import { makeAutoObservable } from 'mobx';

export class SedoGeneralNotifyStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createSedoGeneralNotifyStore = () => new SedoGeneralNotifyStore();
