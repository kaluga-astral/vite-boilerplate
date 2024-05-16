import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';

import { PermissionDenialReason } from '../../../enums';
import type { PolicyManagerStore } from '../PolicyManagerStore';

export class AdministrationPolicyStore {
  constructor(
    private readonly policyManager: PolicyManagerStore,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policyManager.registerPolicy({
      name: 'administration',
      prepareData: async (): Promise<void> => {
        await Promise.all([this.userRepo.getRolesQuery().async()]);
      },
    });
  }

  /**
   * Доступ к действиям администратора
   */
  public get administrationActions() {
    return this.policyManager.processPermission((allow, deny) => {
      if (this.userRepo.getRolesQuery().data?.isAdmin) {
        return allow();
      }

      deny(PermissionDenialReason.NoAdmin);
    });
  }
}

export const createAdministrationPolicyStore = (
  policyManager: PolicyManagerStore,
  userRepo: UserRepository,
) => new AdministrationPolicyStore(policyManager, userRepo);
