import { makeAutoObservable } from 'mobx';

import type { BillingRepository, UserRepository } from '@example/data';
import type {
  PermissionsPolicy,
  PermissionsPolicyManagerStore,
} from '@example/shared';

import { PermissionDenialReason } from '../../../../enums';
import { calcAcceptableAge } from '../../rules';

export class BooksPolicyStore {
  private readonly policy: PermissionsPolicy;

  constructor(
    policyManager: PermissionsPolicyManagerStore,
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
        billingInfo.info.shelf.currentCount >=
        billingInfo.info.shelf.allowedCount
      ) {
        return deny(PermissionDenialReason.ExceedShelfCount);
      }

      allow();
    });
  }

  /**
   * Возможность прочитать книгу онлайн
   */
  public calcReadingOnline = (acceptableAge?: number) => {
    return this.policy.createPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      const agePermission = calcAcceptableAge(
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
        billingInfo.info.onlineReading.currentCount >=
        billingInfo.info.onlineReading.allowedCount
      ) {
        return deny(PermissionDenialReason.ExceedReadingCount);
      }

      allow();
    });
  };
}

export const createBooksPolicyStore = (
  policyManager: PermissionsPolicyManagerStore,
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BooksPolicyStore(policyManager, billingRepo, userRepo);
