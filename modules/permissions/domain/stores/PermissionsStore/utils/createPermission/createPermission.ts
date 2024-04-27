import { CommonPermissionsReason } from '../../enums';
import type { Permission } from '../../types';

export const createPermission = (
  isDataAvailable: boolean,
  checkPermission: () => Permission,
): Permission => {
  if (!isDataAvailable) {
    return {
      isAllowed: false,
      reasons: [
        {
          id: CommonPermissionsReason.NoData,
          advice: 'Недостаточно данных для получения доступа к функционалу',
        },
      ],
    };
  }

  return checkPermission();
};
