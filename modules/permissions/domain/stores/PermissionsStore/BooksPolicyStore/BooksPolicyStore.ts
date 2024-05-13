import { makeAutoObservable } from 'mobx';

import type { BillingRepository } from '@example/data';
import type { CacheService } from '@example/shared';
import type { UserRepository } from '@example/data';

import type { PolicyStore } from '../PolicyStore';
import { createPolicyStore } from '../PolicyStore';
import type { Policy } from '../types';
import { DenialReason } from '../enums';

export class BooksPolicyStore implements Policy {
  private readonly policy: PolicyStore;

  constructor(
    cache: CacheService,
    private readonly billingRepo: BillingRepository,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = createPolicyStore(cache, async () => {
      await Promise.all([
        this.userRolesQuery.async(),
        this.billingInfoQuery.async(),
      ]);
    });
  }

  private get billingInfoQuery() {
    return this.billingRepo.getBillingInfoQuery();
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public prepareData = () => this.policy.prepareData();

  public get preparingDataStatus() {
    return this.policy.preparingDataStatus;
  }

  public get readingOnline() {
    return this.policy.createPermission((allow, deny) => {
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
    });
  }
}

export const createBooksPolicyStore = (
  cacheService: CacheService,
  billingRepo: BillingRepository,
  userRepo: UserRepository,
) => new BooksPolicyStore(cacheService, billingRepo, userRepo);
