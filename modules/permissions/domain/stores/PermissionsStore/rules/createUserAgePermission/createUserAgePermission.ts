import { getDateYearDiff } from '@example/shared';

import { DenialReason } from '../../enums';
import { createPermission } from '../../utils';

export const createUserAgePermission = (
  hasLoadedUserBirthday: boolean,
  acceptableAge: number,
  userBirthday?: string,
) =>
  createPermission(hasLoadedUserBirthday, (allow, deny) => {
    if (!userBirthday) {
      return deny(DenialReason.MissingUserAge);
    }

    if (getDateYearDiff(new Date(userBirthday), new Date()) < acceptableAge) {
      return deny(DenialReason.NotForYourAge);
    }

    allow();
  });
