import { DenialReason } from '../../enums';
import type { Permission, Rule } from '../../types';

export const createPermission = (
  isDataAvailable: boolean,
  rule: Rule,
): Permission => {
  if (!isDataAvailable) {
    console.warn('При вычислении доступа не было получено необходимых данных');

    return {
      isAllowed: false,
      reason: DenialReason.MissingData,
    };
  }

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
