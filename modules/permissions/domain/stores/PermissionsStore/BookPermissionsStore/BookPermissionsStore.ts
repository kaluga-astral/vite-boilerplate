import { makeAutoObservable } from 'mobx';

import type { BillingRepository } from '@example/data';
import type { UserRepository } from '@example/data';

import { createPermission } from '../utils';

import { BookDenyPermissionsReason } from './enums';

export class BookPermissionsStore {
  constructor(
    private readonly billingRepo: BillingRepository,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get billingInfoQuery() {
    return this.billingRepo.getBillingInfoQuery();
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public prepareData = async () => {
    await Promise.all([
      this.userRolesQuery.async(),
      this.billingInfoQuery.async(),
    ]);
  };

  public get readingOnline() {
    return createPermission(
      this.billingInfoQuery.isSuccess && this.userRolesQuery.isSuccess,
      (allow, deny) => {
        if (this.userRolesQuery.data?.isAdmin) {
          return allow();
        }

        if (!this.billingInfoQuery.data?.paid) {
          return deny(BookDenyPermissionsReason.NoSubscription);
        }

        if (
          this.billingInfoQuery.data.info.onlineReading.allowedCount ===
          this.billingInfoQuery.data.info.onlineReading.currentCount
        ) {
          return deny(BookDenyPermissionsReason.ExceededOnlineReading);
        }

        allow();
      },
    );
  }
}

export const createBookPermissionsStore = (
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BookPermissionsStore(billingRepo, userRepo);
