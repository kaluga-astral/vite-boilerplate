import { getDateYearDiff } from '@example/shared';

import { DenialReason } from '../../enums';
import { createRule } from '../createRule';

export const checkAcceptableAge = (
  acceptableAge?: number,
  userBirthday?: string,
) =>
  createRule((allow, deny) => {
    if (!acceptableAge) {
      return deny(DenialReason.MissingData);
    }

    if (!userBirthday) {
      return deny(DenialReason.MissingUserAge);
    }

    if (getDateYearDiff(new Date(userBirthday), new Date()) < acceptableAge) {
      return deny(DenialReason.NotForYourAge);
    }

    allow();
  });
