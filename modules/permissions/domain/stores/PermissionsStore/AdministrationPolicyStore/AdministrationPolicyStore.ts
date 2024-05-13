import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type { CacheService } from '@example/shared';

import type { Policy } from '../types';
import { DenialReason } from '../enums';
import type { PolicyStore } from '../PolicyStore';
import { createPolicyStore } from '../PolicyStore';

export class AdministrationPolicyStore implements Policy {
  private readonly policy: PolicyStore;

  constructor(
    cache: CacheService,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = createPolicyStore(cache, async (): Promise<void> => {
      await Promise.all([this.userRolesQuery.async()]);
    });
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public prepareData = () => this.policy.prepareData();

  public get preparingDataStatus() {
    return this.policy.preparingDataStatus;
  }

  public get administrationActions() {
    return this.policy.createPermission((allow, deny) => {
      if (this.userRolesQuery.data?.isAdmin) {
        return allow();
      }

      deny(DenialReason.NoAdmin);
    });
  }
}

export const createAdministrationPolicyStore = (
  cacheService: CacheService,
  userRepo: UserRepository,
) => new AdministrationPolicyStore(cacheService, userRepo);
