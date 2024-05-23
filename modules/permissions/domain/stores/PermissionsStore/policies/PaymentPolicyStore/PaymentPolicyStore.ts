import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type {
  PermissionsPolicy,
  PermissionsPolicyManagerStore,
} from '@example/shared';

import { calcAcceptableAge } from '../../rules';

export class PaymentPolicyStore {
  private readonly policy: PermissionsPolicy;

  constructor(
    policyManager: PermissionsPolicyManagerStore,
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
  policyManager: PermissionsPolicyManagerStore,
  userRepo: UserRepository,
) => new PaymentPolicyStore(policyManager, userRepo);
