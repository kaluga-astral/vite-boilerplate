import { DenialReason } from '../../enums';
import type { Permission } from '../../types';

export type CheckPermission = (
  allow: () => void,
  deny: (reason: DenialReason) => void,
) => void;

export const createPermission = (
  isDataAvailable: boolean,
  checkPermission: CheckPermission,
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

  checkPermission(allow, deny);

  if (result === null) {
    console.error(new Error('Результат проверки доступа не был получен'));
    result = { isAllowed: false, reason: DenialReason.InternalError };
  }

  return result;
};
