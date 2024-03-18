import { makeAutoObservable } from 'mobx';

export class UIStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createUIStore = () => new UIStore();
