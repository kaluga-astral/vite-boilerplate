import { DenialReason } from '../../enums';
import type { Permissions } from '../../types';

export type CheckPermission = (
  allow: () => void,
  deny: (reason: DenialReason) => void,
) => void;

export const createPermission = (
  isDataAvailable: boolean,
  checkPermission: CheckPermission,
): Permissions.Permission => {
  if (!isDataAvailable) {
    console.warn('При вычислении доступа не было получено необходимых данных');

    return {
      isAllowed: false,
      reason: DenialReason.MissingData,
    };
  }

  let result: Permissions.Permission | null = null;

  const allow = () => {
    result = { isAllowed: true };
  };

  const deny = (reason: DenialReason) => {
    result = { isAllowed: false, reason };
  };

  checkPermission(allow, deny);

  if (!result) {
    console.error('Результат проверки доступа не получен');
    result = { isAllowed: false, reason: DenialReason.InternalError };
  }

  return result;
};
