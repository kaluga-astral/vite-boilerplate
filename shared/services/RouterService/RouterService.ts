type NavigateHandlerParams = {
  /**
   * строка квери параметров, которые необходимо добавить для к адресу
   */
  search?: string;
};

/**
 * метод для навигации
 */
export type NavigateHandler = (
  /**
   * путь для навигации
   */
  path: string,
  /**
   * параметры для навигации
   */
  params?: NavigateHandlerParams,
) => void;

/**
 * абстрактная сущность для навигации по приложению
 */
export abstract class RouterService {
  /**
   * метод для навигации на указанный адрес
   */
  public abstract navigate: NavigateHandler;

  /**
   * текущий адрес
   */
  public abstract pathname: string;
}
