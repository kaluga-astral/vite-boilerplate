import { makeAutoObservable } from 'mobx';

type NotificationHandlers = {
  notifySedoError: (title, id) => void;
};

export class AppNotifyStoreStore {
  private handlers: NotificationHandlers = {} as NotificationHandlers;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public init = (handlers: NotificationHandlers) => {
    this.handlers = handlers;
  };

  public showSedoError999 = (info) => {
    this.handlers.notifySedoError(info);
  };
}

export const createAppNotifyStoreStore = () => new AppNotifyStoreStore();
