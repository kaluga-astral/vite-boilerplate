import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PermissionDenialReason } from '../../../../enums';

import { calcAcceptableAge } from './calcAcceptableAge';

describe('calcAcceptableAge', () => {
  describe('Доступа нет', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('11-11-2024'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('Если нет данных о доступном возрасте', () => {
      const permission = calcAcceptableAge();

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.MissingData);
    });

    it('Если у пользователя не заполнена дата рождения', () => {
      const permission = calcAcceptableAge(18);

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.MissingUserAge);
    });

    it('Если возраст пользователя не соответствует допустимому', () => {
      const permission = calcAcceptableAge(18, '11-11-2012');

      expect(permission.isAllowed).toBeFalsy();
      expect(permission.reason).toBe(PermissionDenialReason.NotForYourAge);
    });
  });
});
