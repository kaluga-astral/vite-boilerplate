import { makeAutoObservable, runInAction } from 'mobx';

import type { UserRepository } from '@example/data';

import { PermissionDenialReason } from '../../../../enums';
import type { Policy } from '../../types';
import type { PolicyManagerStore } from '../../PolicyManagerStore';

export class AdministrationPolicyStore {
  private readonly policy: Policy;

  constructor(
    private readonly policyManager: PolicyManagerStore,
    private readonly userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = this.policyManager.createPolicy({
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
    return this.policy.createPermission((allow, deny) => {
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
