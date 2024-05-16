import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';

import { checkAcceptableAge } from '../rules';
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
    this.policyManager.createPermission((allow, deny) => {
      const agePermission = checkAcceptableAge(
        acceptableAge,
        this.userRepo.getPersonInfoQuery().data?.birthday,
      );

      if (!agePermission.isAllowed) {
        return deny(agePermission.reason);
      }

      allow();
    });
}

export const createPaymentPolicyStore = (
  policyManager: PolicyManagerStore,
  userRepo: UserRepository,
) => new PaymentPolicyStore(policyManager, userRepo);
