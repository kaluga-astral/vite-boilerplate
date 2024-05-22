import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PermissionDenialReason } from '../../../../enums';

import { calcAcceptableAge } from './calcAcceptableAge';

describe('calcAcceptableAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('11-11-2024'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Доступа нет', () => {
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

  it('Доступ открыт, если есть доступный возраст + день рождения пользователя и возраст соответствует допустимому', () => {
    const permission = calcAcceptableAge(18, '11-11-2000');

    expect(permission.isAllowed).toBeTruthy();
  });
});
