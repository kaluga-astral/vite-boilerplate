import type { DenialReason } from './enums';

type AllowedPermission = {
  isAllowed: true;
  reason: null;
};

export type DenialPermission<
  TDenialReason extends DenialReason = DenialReason,
> = {
  isAllowed: false;
  /**
     Причина, из-за которой отказано в доступе. На основе причин система сможет реагировать в соответствии с потребностями бизнеса.
     Например, отобразить тултип с причиной отказа в доступе или просто не рендерить компонент
     **/
  reason: TDenialReason;
};

export type Permission<TDenialReason extends DenialReason = DenialReason> =
  | AllowedPermission
  | DenialPermission<TDenialReason>;

export type Rule = (
  allow: () => void,
  deny: (denialReason: DenialReason) => void,
) => void;
