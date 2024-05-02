export enum DenialReason {
  /**
   * При расчете доступа произошла ошибка
   * **/
  InternalError,
  NoAdmin,
  NoPayAccount,
  /**
   * Превышено доступное количество чтений
   * **/
  ExceedReadingCount,
  /**
   * Недостаточно данных для формирования доступа
   * **/
  MissingData,
  NotForYourAge,
  /**
   * Пользователь не указал дату рождения
   * **/
  MissingUserAge,
}
