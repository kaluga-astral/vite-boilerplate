import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type {
  PermissionsPolicy,
  PermissionsPolicyManagerStore,
} from '@example/shared';

import { PermissionDenialReason } from '../../../../enums';

export class AdministrationPolicyStore {
  private readonly policy: PermissionsPolicy;

  constructor(
    private readonly policyManager: PermissionsPolicyManagerStore,
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
  policyManager: PermissionsPolicyManagerStore,
  userRepo: UserRepository,
) => new AdministrationPolicyStore(policyManager, userRepo);
