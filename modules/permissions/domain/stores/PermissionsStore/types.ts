type DenyReasonId = string;

export type DenyReason = {
  /**
     id необходим для того, чтобы на него можно было кастомно реагировать в логике или в UI
    **/
  id: DenyReasonId;
  /**
     Рекомендации для пользователя. Прочитав их он должен понять что ему необходимо сделать, чтобы получить доступ.
     @example 'Для получения доступа к редактированию заявления необходимо оформить подписку'
    **/
  advice: string;
};

type AllowedPermission = {
  isAllowed: true;
  reasons?: [];
};

type DenyPermission = {
  isAllowed: false;
  /**
     Причины, из-за которых отказано в доступе. На основе этих причин система сможет реагировать в соответствии с потребностями бизнеса.
     Например, отобразить тултип с причиной отказа в доступе или просто не рендерить компонент
    **/
  reasons: DenyReason[];
};

export type Permission = AllowedPermission | DenyPermission;
