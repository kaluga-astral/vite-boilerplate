import { makeAutoObservable } from 'mobx';

import type { BillingRepository, UserRepository } from '@example/data';

import type { PolicyManagerStore } from '../PolicyManagerStore';
import { DenialReason } from '../enums';
import { createUserAgePermission } from '../utils';

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
          this.userRepo.getPersonInfoQuery().async(),
          this.billingRepo.getBillingInfoQuery().async(),
        ]);
      },
    });
  }

  /**
   * Возможность добавить на полку книгу
   */
  public get addingToShelf() {
    return this.policyManager.createPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const billingInfo = this.billingRepo.getBillingInfoQuery()?.data;

      if (!billingInfo?.paid) {
        return deny(DenialReason.NoPayAccount);
      }

      if (
        billingInfo.info.shelf.allowedCount ===
        billingInfo.info.shelf.currentCount
      ) {
        return deny(DenialReason.ExceedShelfCount);
      }

      allow();
    });
  }

  /**
   * Возможность прочитать книгу онлайн
   */
  public checkReadingOnline = (acceptableAge?: number) => {
    return this.policyManager.createPermission((allow, deny) => {
      if (!acceptableAge) {
        return deny(DenialReason.MissingData);
      }

      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const userQuery = this.userRepo.getPersonInfoQuery();

      const agePermission = createUserAgePermission(
        userQuery.isSuccess,
        acceptableAge,
        userQuery?.data?.birthday,
      );

      if (!agePermission.isAllowed) {
        return deny(agePermission.reason);
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
  };
}

export const createBooksPolicyStore = (
  policyManager: PolicyManagerStore,
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BooksPolicyStore(policyManager, billingRepo, userRepo);
