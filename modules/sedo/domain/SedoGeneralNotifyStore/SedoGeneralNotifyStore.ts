import { makeAutoObservable } from 'mobx';

import type { AppNotifyStoreStore } from '@example/modules/appNotify/domain/AppNotifyStoreStore';

type NotificationHandlers = {
  notify999Error: (title, id) => void;
};

export class SedoGeneralNotifyStore {
  private handlers: NotificationHandlers = {} as NotificationHandlers;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public init = (handlers: NotificationHandlers) => {
    this.handlers = handlers;
  };

  private showNotify = (info) => {
    this.handlers.notify999Error(info);
  };

  public addMessage = (message) => {
    this.showNotify(getInfo(message));
  };
}
