import { makeAutoObservable } from 'mobx';

import type { AppNotifyStoreStore } from '@example/modules/appNotify/domain/AppNotifyStoreStore';

export class SedoErrorStore {
  constructor(private readonly appNotify: AppNotifyStoreStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private showNotify = (info) => {
    this.appNotify.showSedoError(info);
  };

  public addMessage = (message) => {
    this.showNotify(getInfo(message));
  };
}

export const createSedoErrorStore = () => new SedoErrorStore();
