import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { UserRepository, UserRepositoryDTO } from '@example/data';
import { userRepositoryFaker } from '@example/data';
import {
  createCacheService,
  createPermissionsPolicyManagerStore,
} from '@example/shared';
import { mock } from '@example/shared/_tests';

import { PermissionDenialReason } from '../../../../enums';

import { PaymentPolicyStore } from './PaymentPolicyStore';

describe('PaymentPolicyStore', () => {
  const setup = async ({
    personInfo,
  }: {
    personInfo?: Partial<UserRepositoryDTO.UserPersonDTO>;
  }) => {
    const policyManager = createPermissionsPolicyManagerStore();
    const cacheService = createCacheService();

    const userRepoMock = mock<UserRepository>({
      getPersonInfoQuery: () =>
        cacheService.createQuery(['person'], async () =>
          userRepositoryFaker.makePersonInfo(personInfo),
        ),
    });

    const sut = new PaymentPolicyStore(policyManager, userRepoMock);

    await policyManager.prepareDataAsync();

    return { sut };
  };

  describe('Оплата товара', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('11-11-2024'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('Доступно, если пользователь достиг требуемого возраста', async () => {
      const { sut } = await setup({
        personInfo: { birthday: '11-11-2000' },
      });

      const permission = sut.calcPayment(18);

      expect(permission.isAllowed).toBeTruthy();
    });

    it('Недоступно пользователям не достигшим необходимого возраста', async () => {
      const { sut } = await setup({
        personInfo: { birthday: '11-11-2012' },
      });

      const permission = sut.calcPayment(18);

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.NotForYourAge);
    });
  });
});
