import { PermissionDenialReason } from '../../../../enums';
import type { Rule } from '../../types';
import {
  createAllowedPermission,
  createDenialPermission,
} from '../../../../classes';
import type { Permission } from '../../../../types';

export const processPermission = (
  isDataAvailable: boolean,
  rule: Rule,
): Permission => {
  if (!isDataAvailable) {
    console.warn('При вычислении доступа не было получено необходимых данных');

    return createDenialPermission(PermissionDenialReason.MissingData);
  }

  let result: Permission | null = null;

  const allow = () => {
    result = createAllowedPermission();
  };

  const deny = (reason: PermissionDenialReason) => {
    result = createDenialPermission(reason);
  };

  rule(allow, deny);

  if (result === null) {
    console.error(new Error('Результат проверки доступа не был получен'));
    result = createDenialPermission(PermissionDenialReason.InternalError);
  }

  return result;
};
