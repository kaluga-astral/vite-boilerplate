import { getDateYearDiff } from '@example/shared';

import { PermissionDenialReason } from '../../../../enums';
import { createRule } from '../../utils';

export const calcAcceptableAge = (
  acceptableAge?: number,
  userBirthday?: string,
) =>
  createRule((allow, deny) => {
    if (!acceptableAge) {
      return deny(PermissionDenialReason.MissingData);
    }

    if (!userBirthday) {
      return deny(PermissionDenialReason.MissingUserAge);
    }

    if (getDateYearDiff(new Date(userBirthday), new Date()) < acceptableAge) {
      return deny(PermissionDenialReason.NotForYourAge);
    }

    allow();
  });
