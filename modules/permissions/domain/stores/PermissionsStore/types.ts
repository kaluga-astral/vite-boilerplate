import type { PermissionDenialReason } from '../../enums';

export type Rule = (
  allow: () => void,
  deny: (reason: PermissionDenialReason) => void,
) => void;
