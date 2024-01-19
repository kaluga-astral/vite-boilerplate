import { makeAutoObservable } from 'mobx';

import type { NavigateHandler, RouterService } from '../RouterService';

/**
 * параметры для инициализации
 */
type RouterParams = {
  navigate: NavigateHandler;
};

/**
 * реализация RouterService, предназначенная для того,
 * чтобы адаптировать реакт роутер к апи версии,
 * и иметь возможность использовать роутер в доменной логике
 */
export class AdaptableRouterService implements RouterService {
  private navigateHandler?: NavigateHandler;

  private currentPathname: string;

  constructor() {
    this.currentPathname = globalThis.location?.pathname ?? '';
    makeAutoObservable(this);
  }

  public navigate: NavigateHandler = (path, params) => {
    this.navigateHandler?.(path, params);
  };

  /**
   * метод установки параметров необходимых для корректной работы
   */
  public init = (params: RouterParams) => {
    this.navigateHandler = params.navigate;
  };

  public get pathname() {
    return this.currentPathname;
  }

  /**
   * метод для установки текущего адреса
   */
  public updatePathname = (pathname: string) => {
    this.currentPathname = pathname;
  };
}

export const router = new AdaptableRouterService();
