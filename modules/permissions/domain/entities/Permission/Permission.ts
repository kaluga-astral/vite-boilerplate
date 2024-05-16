import type { PermissionDenialReason } from '../../enums';

export class AllowedPermission {
  public isAllowed: true = true;

  /**
   * По факту в AllowedPermission причины никогда не будет. Тип нужен для обратной совместимости с DenialPermission
   */
  public reason?: PermissionDenialReason;
}

export class DenialPermission {
  public isAllowed: false = false;

  /**
   * Причина отказа в доступе
   */
  public reason: PermissionDenialReason;

  constructor(reason: PermissionDenialReason) {
    this.reason = reason;
  }

  /**
   * Позволяет определить по какой причине было отказано в доступе
   * @example permission.hasReason('no-admin')
   */
  public hasReason = (reason: `${PermissionDenialReason}`) =>
    reason === this.reason;
}

export const createAllowedPermission = () => new AllowedPermission();

export const createDenialPermission = (reason: PermissionDenialReason) =>
  new DenialPermission(reason);
