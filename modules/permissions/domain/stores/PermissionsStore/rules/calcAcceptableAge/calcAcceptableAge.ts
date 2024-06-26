import { createPermissionRule, getDateYearDiff } from '@example/shared';

import { PermissionDenialReason } from '../../../../enums';

export const calcAcceptableAge = (
  acceptableAge?: number,
  userBirthday?: string,
) =>
  createPermissionRule((allow, deny) => {
    if (!acceptableAge) {
      return deny(PermissionDenialReason.MissingData);
    }

    if (!userBirthday) {
      return deny(PermissionDenialReason.MissingUserAge);
    }

    if (
      Math.abs(getDateYearDiff(new Date(userBirthday), new Date())) <
      acceptableAge
    ) {
      return deny(PermissionDenialReason.NotForYourAge);
    }

    allow();
  });
