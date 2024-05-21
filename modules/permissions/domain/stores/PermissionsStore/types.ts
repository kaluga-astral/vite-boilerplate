import type { PermissionDenialReason } from '../../enums';
import type { Permission } from '../../types';

export type Rule = (
  allow: () => void,
  deny: (reason: PermissionDenialReason) => void,
) => void;

export type PermissionStrategy = Rule;

export type Policy = {
  name: string;
  createPermission: (strategy: PermissionStrategy) => Permission;
};
