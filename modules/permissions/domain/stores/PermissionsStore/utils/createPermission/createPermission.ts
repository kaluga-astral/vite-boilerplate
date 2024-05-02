import { DenialReason } from '../../enums';
import type { Permissions } from '../../types';

export const createPermission = (
  isDataAvailable: boolean,
  checkPermission: (
    allow: () => void,
    deny: (reason: DenialReason) => void,
  ) => void,
): Permissions.Permission => {
  if (!isDataAvailable) {
    return {
      isAllowed: false,
      reason: DenialReason.NoData,
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
