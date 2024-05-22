import { describe, it } from 'vitest';

import { createCacheService } from '@example/shared';
import { mock } from '@example/shared/_tests';
import type { BillingRepository, UserRepository } from '@example/data';

import { createPolicyManagerStore } from '../../PolicyManagerStore';

import { BooksPolicyStore } from './BooksPolicyStore';

describe('BooksPolicyStore', () => {
  const setup = async () => {
    const cacheService = createCacheService();
    const userRepositoryMock = mock<UserRepository>({
      getRolesQuery: () =>
        cacheService.createQuery(['roles'], async () => ({
          isAdmin: true as boolean,
        })),
    });
    const billingRepositoryMock = mock<BillingRepository>();
    const policyManager = createPolicyManagerStore();
    const sut = new BooksPolicyStore(
      policyManager,
      billingRepositoryMock,
      userRepositoryMock,
    );


  };

  it('Добавить кнопку на полку может администратор', () => {
    const cacheService = createCacheService();
    const userRepositoryMock = mock<UserRepository>({
      getRolesQuery: () =>
        cacheService.createQuery(['roles'], async () => ({
          isAdmin: true as boolean,
        })),
    });
    const billingRepositoryMock = mock<BillingRepository>();
    const policyManager = createPolicyManagerStore();
    const sut = new BooksPolicyStore(
      policyManager,
      billingRepositoryMock,
      userRepositoryMock,
    );
  });
});
