import type { Rule } from '../../types';
import { PermissionDenialReason } from '../../../../enums';
import {
  createAllowedPermission,
  createDenialPermission,
} from '../../../../entities';
import type { Permission } from '../../../../types';

export const createRule = (rule: Rule): Permission => {
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
