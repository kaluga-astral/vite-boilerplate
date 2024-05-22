import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';

import { calcAcceptableAge } from '../../rules';
import type { PolicyManagerStore } from '../../PolicyManagerStore';
import type { Policy } from '../../types';

export class PaymentPolicyStore {
  private readonly policy: Policy;

  constructor(
    policyManager: PolicyManagerStore,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = policyManager.createPolicy({
      name: 'payment',
      prepareData: async () => {
        await Promise.all([userRepo.getPersonInfoQuery().async()]);
      },
    });
  }

  /**
   * Возможность оплатить товар
   */
  public calcPayment = (acceptableAge: number) =>
    this.policy.createPermission((allow, deny) => {
      const agePermission = calcAcceptableAge(
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
