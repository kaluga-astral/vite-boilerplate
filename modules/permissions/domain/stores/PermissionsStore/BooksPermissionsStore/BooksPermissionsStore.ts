import { makeAutoObservable } from 'mobx';

import type { BillingRepository } from '@example/data';
import type { CacheService } from '@example/shared';
import type { UserRepository } from '@example/data';

import { createPermission } from '../utils';
import type { IPermissionStore } from '../types';
import { DenialReason } from '../enums';

export class BooksPermissionsStore implements IPermissionStore {
  constructor(
    private readonly cache: CacheService,
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

  public getPrepareDataMutation = () =>
    this.cache.createMutation(async () => {
      await Promise.all([
        this.userRolesQuery.async(),
        this.billingInfoQuery.async(),
      ]);
    });

  public get readingOnline() {
    return createPermission(
      this.billingInfoQuery.isSuccess && this.userRolesQuery.isSuccess,
      (allow, deny) => {
        if (this.userRolesQuery.data?.isAdmin) {
          return allow();
        }

        if (!this.billingInfoQuery.data?.paid) {
          return deny(DenialReason.NoPayAccount);
        }

        if (
          this.billingInfoQuery.data.info.onlineReading.allowedCount ===
          this.billingInfoQuery.data.info.onlineReading.currentCount
        ) {
          return deny(DenialReason.ExceedReadingCount);
        }

        allow();
      },
    );
  }
}

export const createBooksPermissionsStore = (
  cacheService: CacheService,
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BooksPermissionsStore(cacheService, billingRepo, userRepo);
