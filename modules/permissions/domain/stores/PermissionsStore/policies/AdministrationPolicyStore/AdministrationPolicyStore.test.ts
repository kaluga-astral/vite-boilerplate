import { describe, expect, it } from 'vitest';
import { when } from 'mobx';

import { createCacheService } from '@example/shared';
import { mock } from '@example/shared/_tests';
import type { UserRepository } from '@example/data';
import { userRepository } from '@example/data';

import type { PolicyManagerStore } from '../../PolicyManagerStore';
import { createPolicyManagerStore } from '../../PolicyManagerStore';

import { AdministrationPolicyStore } from './AdministrationPolicyStore';

describe('AdministrationPolicyStore', () => {
  it('Действия администратора доступны только пользователю с ролью администратор', async () => {
    const cacheService = createCacheService();
    const userRepositoryMock = mock<UserRepository>({
      getRolesQuery: () =>
        cacheService.createQuery(['roles'], async () => ({
          isAdmin: true as boolean,
        })),
    });
    const policyManager = createPolicyManagerStore(cacheService);

    const sut = new AdministrationPolicyStore(
      policyManager,
      userRepositoryMock,
    );

    policyManager.prepareData();
    await when(() => policyManager.preparingDataStatus.isSuccess);
    expect(sut.administrationActions.isAllowed).toBeTruthy();
  });
});
