import { describe, expect, it } from 'vitest';
import { when } from 'mobx';

import type { BookRepository } from '@example/data';
import { bookRepositoryFaker } from '@example/data';
import { mock, mockDeep } from '@example/shared/_tests';
import type { Notify } from '@example/shared';
import {
  createAllowedPermission,
  createCacheService,
  createDenialPermission,
} from '@example/shared';

import { PermissionDenialReason } from '../../../external';
import type { PermissionsStore } from '../../../external';

import { UIStore } from './UIStore';

describe('GoodsListStore', () => {
  it('Список книг форматируется для отображения', async () => {
    const cacheService = createCacheService();
    const fakeBookList = bookRepositoryFaker.makeBookList(2, { price: 1000 });
    const fakeBookListItem = fakeBookList.data[0];

    const bookRepositoryMock = mock<BookRepository>({
      getBookListQuery: () =>
        cacheService.createQuery(['id'], async () => fakeBookList),
    });
    const permissionsStoreMock = mock<PermissionsStore>();
    const notifyMock = mock<Notify>();
    const sut = new UIStore(
      bookRepositoryMock,
      permissionsStoreMock,
      notifyMock,
    );

    // ждем автоматической загрузки данных
    await when(() => Boolean(sut.list?.length));

    expect(sut.list[0]).toMatchObject({
      id: fakeBookListItem.id,
      name: fakeBookListItem.name,
      price: '1 000 руб.',
    });
  });

  describe('Добавление книги на полку', () => {
    const setup = (permissionsStoreMock: PermissionsStore) => {
      const bookRepositoryMock = mock<BookRepository>();
      const notifyMock = mock<Notify>();
      const sut = new UIStore(
        bookRepositoryMock,
        permissionsStoreMock,
        notifyMock,
      );

      sut.addToShelf('id');

      return { notifyMock, sut };
    };

    it('Показывает информационное уведомление, если книга была успешно добавлена', () => {
      const permissionsStoreMock = mockDeep<PermissionsStore>({
        books: {
          addingToShelf: createAllowedPermission(),
        },
      });
      const { notifyMock } = setup(permissionsStoreMock);

      expect(notifyMock.info).toBeCalledWith('Книга id добавлена на полку');
    });

    it('Открывает модалку оплаты, если было отказано в доступе с соответствующей причиной', () => {
      const permissionsStoreMock = mockDeep<PermissionsStore>({
        books: {
          addingToShelf: createDenialPermission(
            PermissionDenialReason.NoPayAccount,
          ),
        },
      });
      const { sut } = setup(permissionsStoreMock);

      expect(sut.isOpenAccountPayment).toBeTruthy();
    });

    it('Показывает уведомление с ошибкой, если было превышено максимальное количество прочтений', () => {
      const permissionsStoreMock = mockDeep<PermissionsStore>({
        books: {
          addingToShelf: createDenialPermission(
            PermissionDenialReason.ExceedReadingCount,
          ),
        },
      });
      const { notifyMock } = setup(permissionsStoreMock);

      expect(notifyMock.error).toBeCalledWith(
        'Достигнуто максимальное количество книг на полке',
      );
    });

    it('Показывает уведомление с ошибкой, если было произошла непредвиденная ошибка при вычислении доступа', () => {
      const permissionsStoreMock = mockDeep<PermissionsStore>({
        books: {
          addingToShelf: createDenialPermission(
            PermissionDenialReason.InternalError,
          ),
        },
      });
      const { notifyMock } = setup(permissionsStoreMock);

      expect(notifyMock.error).toBeCalledWith(
        'Добавить книгу на полку нельзя. Попробуйте перезагрузить страницу',
      );
    });
  });
});
