import { makeAutoObservable } from 'mobx';

import type { IPermissionStore } from '../types';

export class PaymentPolicyStore implements IPermissionStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createPaymentPolicyStore = () => new PaymentPolicyStore();
