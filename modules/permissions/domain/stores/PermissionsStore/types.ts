import type { CacheMutation } from '@example/shared';

import type { DenialReason } from './enums';

export namespace Permissions {
  type AllowedPermission = {
    isAllowed: true;
    reason?: DenialReason;
  };

  export type DenyPermission = {
    isAllowed: false;
    /**
     Причина, из-за которой отказано в доступе. На основе причин система сможет реагировать в соответствии с потребностями бизнеса.
     Например, отобразить тултип с причиной отказа в доступе или просто не рендерить компонент
     **/
    reason: DenialReason;
  };

  export type Permission = AllowedPermission | DenyPermission;
}

export interface IPermissionStore<TPreparingData = unknown> {
  getPrepareDataMutation: () => CacheMutation<TPreparingData>;
}
