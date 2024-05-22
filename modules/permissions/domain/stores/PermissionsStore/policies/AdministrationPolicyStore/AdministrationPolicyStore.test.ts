import { describe, expect, it } from 'vitest';

import { createCacheService } from '@example/shared';
import { mock } from '@example/shared/_tests';
import type { UserRepository } from '@example/data';

import { createPolicyManagerStore } from '../../PolicyManagerStore';
import { PermissionDenialReason } from '../../../../enums';

import { AdministrationPolicyStore } from './AdministrationPolicyStore';

describe('AdministrationPolicyStore', () => {
  describe('Действия администратора', () => {
    const setup = async (isAdmin: boolean) => {
      const cacheService = createCacheService();
      const userRepositoryMock = mock<UserRepository>({
        getRolesQuery: () =>
          cacheService.createQuery(['roles'], async () => ({
            isAdmin,
          })),
      });
      const policyManager = createPolicyManagerStore();

      const sut = new AdministrationPolicyStore(
        policyManager,
        userRepositoryMock,
      );

      await policyManager.prepareDataAsync();

      return { sut };
    };

    it('Доступны пользователю с ролью администратор', async () => {
      const { sut } = await setup(true);

      expect(sut.administrationActions.isAllowed).toBeTruthy();
    });

    it('Не доступны не администраторам', async () => {
      const { sut } = await setup(false);

      expect(sut.administrationActions.isAllowed).toBeFalsy();

      expect(sut.administrationActions.reason).toBe(
        PermissionDenialReason.NoAdmin,
      );
    });
  });
});
