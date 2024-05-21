import { makeAutoObservable } from 'mobx';

import type { BillingRepository, UserRepository } from '@example/data';

import type { Policy } from '../../types';
import type { PolicyManagerStore } from '../../PolicyManagerStore';
import { PermissionDenialReason } from '../../../../enums';
import { checkAcceptableAge } from '../../rules';

export class BooksPolicyStore {
  private readonly policy: Policy;

  constructor(
    policyManager: PolicyManagerStore,
    private readonly billingRepo: BillingRepository,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = policyManager.createPolicy({
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
    return this.policy.createPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const billingInfo = this.billingRepo.getBillingInfoQuery()?.data;

      if (!billingInfo?.paid) {
        return deny(PermissionDenialReason.NoPayAccount);
      }

      if (
        billingInfo.info.shelf.allowedCount ===
        billingInfo.info.shelf.currentCount
      ) {
        return deny(PermissionDenialReason.ExceedShelfCount);
      }

      allow();
    });
  }

  /**
   * Возможность прочитать книгу онлайн
   */
  public checkReadingOnline = (acceptableAge?: number) => {
    return this.policy.createPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const agePermission = checkAcceptableAge(
        acceptableAge,
        this.userRepo.getPersonInfoQuery().data?.birthday,
      );

      if (!agePermission.isAllowed) {
        return deny(agePermission.reason);
      }

      const billingInfo = this.billingRepo.getBillingInfoQuery().data;

      if (!billingInfo?.paid) {
        return deny(PermissionDenialReason.NoPayAccount);
      }

      if (
        billingInfo.info.onlineReading.allowedCount ===
        billingInfo.info.onlineReading.currentCount
      ) {
        return deny(PermissionDenialReason.ExceedReadingCount);
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
