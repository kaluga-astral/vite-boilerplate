import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type { CacheService } from '@example/shared';

import type { IPermissionStore, Permissions } from '../types';
import { createPermission } from '../utils';
import { DenialReason } from '../enums';

export class AdministrationPermissionsStore implements IPermissionStore {
  constructor(
    private readonly cache: CacheService,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public getPrepareDataMutation = () =>
    this.cache.createMutation(async (): Promise<void> => {
      await Promise.all([this.userRolesQuery.async()]);
    });

  public get administrationActions(): Permissions.Permission {
    return createPermission(this.userRolesQuery.isSuccess, (allow, deny) => {
      if (this.userRolesQuery.data?.isAdmin) {
        return allow();
      }

      deny(DenialReason.NoAdmin);
    });
  }
}

export const createAdministrationPermissionsStore = (
  cacheService: CacheService,
  userRepo: UserRepository,
) => new AdministrationPermissionsStore(cacheService, userRepo);
