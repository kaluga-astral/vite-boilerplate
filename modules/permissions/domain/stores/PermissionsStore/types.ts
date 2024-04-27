export namespace Permissions {
  type AllowedPermission = {
    isAllowed: true;
    reasons?: [];
  };

  export type DenyReason = string;

  export type DenyPermission = {
    isAllowed: false;
    /**
     Причины, из-за которых отказано в доступе. На основе этих причин система сможет реагировать в соответствии с потребностями бизнеса.
     Например, отобразить тултип с причиной отказа в доступе или просто не рендерить компонент
     **/
    reasons: DenyReason[];
  };

  export type Permission = AllowedPermission | DenyPermission;
}
