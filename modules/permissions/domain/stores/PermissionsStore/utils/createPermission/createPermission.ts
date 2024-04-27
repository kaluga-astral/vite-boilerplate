import { CommonPermissionsReason } from '../../enums';
import type { Permissions } from '../../types';

export const createPermission = (
  isDataAvailable: boolean,
  checkPermission: (
    allow: () => void,
    deny: (...reasons: Permissions.DenyReason[]) => void,
  ) => void,
): Permissions.Permission => {
  if (!isDataAvailable) {
    return {
      isAllowed: false,
      reasons: [CommonPermissionsReason.NoData],
    };
  }

  let result: Permissions.Permission | null = null;

  const allow = () => {
    result = { isAllowed: true };
  };

  const deny = (...reasons: Permissions.DenyReason[]) => {
    result = { isAllowed: false, reasons };
  };

  checkPermission(allow, deny);

  if (!result) {
    console.error('Результат проверки доступа не получен');
    result = { isAllowed: false, reasons: [] };
  }

  return result;
};
