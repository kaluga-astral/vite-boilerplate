export enum PermissionDenialReason {
  /**
   * При расчете доступа произошла ошибка
   * **/
  InternalError = 'internal-error',
  /**
   * Не является администратором
   * **/
  NoAdmin = 'no-admin',
  /**
   * Аккаунт не оплачен
   * **/
  NoPayAccount = 'no-pay-account',
  /**
   * Превышено доступное количество чтений
   * **/
  ExceedReadingCount = 'exceed-reading-count',
  /**
   * Превышено доступное количество книг на полке
   * **/
  ExceedShelfCount = 'exceed-shelf-count',
  /**
   * Недостаточно данных для формирования доступа
   * **/
  MissingData = 'missing-data',
  /**
   * Недоступно для вашего возраста
   * **/
  NotForYourAge = 'not-for-your-age',
  /**
   * Пользователь не указал дату рождения
   * **/
  MissingUserAge = 'missing-user-age',
}
