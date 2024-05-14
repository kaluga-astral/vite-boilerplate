import { makeAutoObservable } from 'mobx';

export class BookRouteGuardStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createBookRouteGuardStore = () => new BookRouteGuardStore();
