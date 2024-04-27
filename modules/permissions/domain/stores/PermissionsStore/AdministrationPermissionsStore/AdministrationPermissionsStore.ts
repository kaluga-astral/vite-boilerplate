import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';

import type { Permissions } from '../types';
import { createPermission } from '../utils';
import { REASONS } from '../enums';

export class AdministrationPermissionsStore {
  constructor(private readonly userRepo: UserRepository) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public prepareData = async (): Promise<void> => {
    await Promise.all([this.userRolesQuery.async()]);
  };

  public get administrationActions(): Permissions.Permission {
    return createPermission(this.userRolesQuery.isSuccess, (allow, deny) => {
      if (this.userRolesQuery.data?.isAdmin) {
        return allow();
      }

      deny(REASONS.admin.noAdmin);
    });
  }
}

export const createAdministrationPermissionsStore = (
  userRepo: UserRepository,
) => new AdministrationPermissionsStore(userRepo);
