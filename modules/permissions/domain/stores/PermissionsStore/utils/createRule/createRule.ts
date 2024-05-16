import type { Permission, Rule } from '../../types';
import { DenialReason } from '../../enums';

export const createRule = (rule: Rule): Permission => {
  let result: Permission | null = null;

  const allow = () => {
    result = { isAllowed: true, reason: null };
  };

  const deny = (reason: DenialReason) => {
    result = { isAllowed: false, reason };
  };

  rule(allow, deny);

  if (result === null) {
    console.error(new Error('Результат проверки доступа не был получен'));
    result = { isAllowed: false, reason: DenialReason.InternalError };
  }

  return result;
};
