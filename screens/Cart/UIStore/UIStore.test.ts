import { describe, expect, it } from 'vitest';
import { createRouterMock, mock } from '@example/shared/_tests';
import type { CardPaymentStore } from '@example/modules/payment';
import { APP_ROUTES } from '@example/shared';

import { UIStore } from './UIStore';

describe('CartScreenStore', () => {
  it('Процесс оплаты запускается фоном при открытии модалки', () => {
    const cartPaymentStoreMock = mock<CardPaymentStore>();
    const sut = new UIStore(cartPaymentStoreMock, createRouterMock());

    sut.openModal();
    expect(cartPaymentStoreMock.pay).toBeCalled();
  });

  it('Успешная оплата редиректит на страницу корзины', () => {
    const cartPaymentStoreMock = mock<CardPaymentStore>({
      pay: (params) => {
        params?.onSuccess();
      },
    });
    const routerMock = createRouterMock();
    const sut = new UIStore(cartPaymentStoreMock, routerMock);

    sut.pay();
    expect(routerMock.pathname).toBe(APP_ROUTES.cart.getRedirectPath());
  });
});
