import { makeAutoObservable } from 'mobx';

import type { BillingRepository } from '@example/data';
import type { UserRepository } from '@example/data';

import type { PolicyManagerStore } from '../PolicyManagerStore';
import { DenialReason } from '../enums';

export class BooksPolicyStore {
  constructor(
    private readonly policyManager: PolicyManagerStore,
    private readonly billingRepo: BillingRepository,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policyManager.registerPolicy({
      name: 'books',
      prepareData: async () => {
        await Promise.all([
          this.userRepo.getRolesQuery().async(),
          this.billingRepo.getBillingInfoQuery().async(),
        ]);
      },
    });
  }

  /**
   * Возможность прочитать книгу онлайн
   */
  public get readingOnline() {
    return this.policyManager.createPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const billingInfo = this.billingRepo.getBillingInfoQuery()?.data;

      if (!billingInfo?.paid) {
        return deny(DenialReason.NoPayAccount);
      }

      if (
        billingInfo.info.onlineReading.allowedCount ===
        billingInfo.info.onlineReading.currentCount
      ) {
        return deny(DenialReason.ExceedReadingCount);
      }

      allow();
    });
  }
}

export const createBooksPolicyStore = (
  policyManager: PolicyManagerStore,
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BooksPolicyStore(policyManager, billingRepo, userRepo);
