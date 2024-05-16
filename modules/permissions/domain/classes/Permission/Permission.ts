import type { PermissionDenialReason } from '../../enums';

export class AllowedPermission {
  public isAllowed: true = true;

  public reason?: PermissionDenialReason;
}

export class DenialPermission {
  public isAllowed: false = false;

  public reason: PermissionDenialReason;

  constructor(reason: PermissionDenialReason) {
    this.reason = reason;
  }

  public has = (reason: `${PermissionDenialReason}`) => reason === this.reason;
}

export const createAllowedPermission = () => new AllowedPermission();

export const createDenialPermission = (reason: PermissionDenialReason) =>
  new DenialPermission(reason);
