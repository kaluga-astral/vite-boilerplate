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
  NoData,
  NotForYourAge,
}
