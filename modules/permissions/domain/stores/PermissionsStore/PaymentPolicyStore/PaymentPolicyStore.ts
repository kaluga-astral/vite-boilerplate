import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';

import { createUserAgePermission } from '../utils';
import type { PolicyManagerStore } from '../PolicyManagerStore';

export class PaymentPolicyStore {
  constructor(
    private readonly policyManager: PolicyManagerStore,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    policyManager.registerPolicy({
      name: 'payment',
      prepareData: async () => {
        await Promise.all([userRepo.getPersonInfoQuery().async()]);
      },
    });
  }

  /**
   * Возможность оплатить товар
   */
  public checkPayment = (acceptableAge: number) =>
    createUserAgePermission(
      this.policyManager.preparingDataStatus.isSuccess,
      acceptableAge,
      this.userRepo.getPersonInfoQuery().data?.birthday,
    );
}

export const createPaymentPolicyStore = (
  policyManager: PolicyManagerStore,
  userRepo: UserRepository,
) => new PaymentPolicyStore(policyManager, userRepo);
