import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createCacheService } from '@example/shared';
import { mock } from '@example/shared/_tests';
import { billingRepositoryFaker, userRepositoryFaker } from '@example/data';
import type {
  BillingRepository,
  BillingRepositoryDTO,
  UserRepository,
  UserRepositoryDTO,
} from '@example/data';

import { createPolicyManagerStore } from '../../PolicyManagerStore';
import { PermissionDenialReason } from '../../../../enums';

import { BooksPolicyStore } from './BooksPolicyStore';

describe('BooksPolicyStore', () => {
  const setup = async ({
    isAdmin,
    personInfo,
    billingInfo,
  }: {
    isAdmin: boolean;
    personInfo?: Partial<UserRepositoryDTO.UserPersonDTO>;
    billingInfo?: Partial<BillingRepositoryDTO.BillingInfo>;
  }) => {
    const policyManager = createPolicyManagerStore();
    const cacheService = createCacheService();

    const userRepoMock = mock<UserRepository>({
      getRolesQuery: () =>
        cacheService.createQuery(['roles'], async () => ({
          isAdmin,
        })),
      getPersonInfoQuery: () =>
        cacheService.createQuery(['person'], async () =>
          userRepositoryFaker.makePersonInfo(personInfo),
        ),
    });
    const billingRepoMock = mock<BillingRepository>({
      getBillingInfoQuery: () =>
        cacheService.createQuery(['billing'], async () =>
          billingRepositoryFaker.makeBillingInfo(billingInfo),
        ),
    });

    const sut = new BooksPolicyStore(
      policyManager,
      billingRepoMock,
      userRepoMock,
    );

    await policyManager.prepareDataAsync();

    return { sut };
  };

  describe('Добавление книги на полку', () => {
    it('Доступно администратору', async () => {
      const { sut } = await setup({ isAdmin: true });

      expect(sut.addingToShelf.isAllowed).toBeTruthy();
    });

    it('Недоступно, если аккаунт не оплачен', async () => {
      const { sut } = await setup({
        isAdmin: false,
        billingInfo: { paid: false },
      });

      expect(sut.addingToShelf.isAllowed).toBeFalsy();

      expect(sut.addingToShelf.reason).toBe(
        PermissionDenialReason.NoPayAccount,
      );
    });

    it('Недоступно, если превышено количество добавлений', async () => {
      const { sut } = await setup({
        isAdmin: false,
        billingInfo: {
          paid: true,
          info: billingRepositoryFaker.makeBillingDetails({
            shelf: { currentCount: 2, allowedCount: 1 },
          }),
        },
      });

      expect(sut.addingToShelf.isAllowed).toBeFalsy();

      expect(sut.addingToShelf.reason).toBe(
        PermissionDenialReason.ExceedShelfCount,
      );
    });

    it('Недоступно, если достигнуто максимальное количество добавлений', async () => {
      const { sut } = await setup({
        isAdmin: false,
        billingInfo: {
          paid: true,
          info: billingRepositoryFaker.makeBillingDetails({
            shelf: { currentCount: 2, allowedCount: 2 },
          }),
        },
      });

      expect(sut.addingToShelf.isAllowed).toBeFalsy();

      expect(sut.addingToShelf.reason).toBe(
        PermissionDenialReason.ExceedShelfCount,
      );
    });
  });

  describe('Чтение книги онлайн', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('11-11-2024'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('Доступно администратору', async () => {
      const { sut } = await setup({ isAdmin: true });

      expect(sut.calcReadingOnline().isAllowed).toBeTruthy();
    });

    it('Недоступно пользователям не достигшим необходимого возраста', async () => {
      const { sut } = await setup({
        isAdmin: false,
        personInfo: { birthday: '11-11-2012' },
      });

      const permission = sut.calcReadingOnline(18);

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.NotForYourAge);
    });

    it('Недоступно с не оплаченным аккаунтом', async () => {
      const { sut } = await setup({
        isAdmin: false,
        personInfo: { birthday: '11-11-2000' },
        billingInfo: { paid: false },
      });

      const permission = sut.calcReadingOnline(18);

      console.log(permission);
      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.NoPayAccount);
    });

    it('Недоступно, если превышено максимальное количество прочтений', async () => {
      const { sut } = await setup({
        isAdmin: false,
        personInfo: { birthday: '11-11-2000' },
        billingInfo: {
          paid: true,
          info: billingRepositoryFaker.makeBillingDetails({
            onlineReading: { allowedCount: 2, currentCount: 3 },
          }),
        },
      });

      const permission = sut.calcReadingOnline(18);

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.ExceedReadingCount);
    });

    it('Недоступно, если достигнуто максимальное количество прочтений', async () => {
      const { sut } = await setup({
        isAdmin: false,
        personInfo: { birthday: '11-11-2000' },
        billingInfo: {
          paid: true,
          info: billingRepositoryFaker.makeBillingDetails({
            onlineReading: { allowedCount: 2, currentCount: 2 },
          }),
        },
      });

      const permission = sut.calcReadingOnline(18);

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.ExceedReadingCount);
    });
  });
});
