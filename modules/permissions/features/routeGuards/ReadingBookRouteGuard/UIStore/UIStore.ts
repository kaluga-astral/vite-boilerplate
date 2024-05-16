import { makeAutoObservable } from 'mobx';

import { bookRepository } from '@example/data';
import type { BookRepository } from '@example/data';
import { APP_ROUTES } from '@example/shared';

import type { PermissionsStore } from '../../../../domain';
import { permissionsStore } from '../../../../domain';

export class UIStore {
  public backLink = APP_ROUTES.books.route;

  constructor(
    private readonly permissions: PermissionsStore,
    private readonly bookRepo: BookRepository,
    private readonly bookId: string,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get bookQuery() {
    return this.bookRepo.getBookByIdQuery(this.bookId);
  }

  public get status() {
    const { isLoading, isSuccess, isError, error } = this.bookQuery;

    return { isLoading, isSuccess, isError, error };
  }

  public get permission() {
    return this.permissions.books.checkReadingOnline(
      this.bookQuery.data?.acceptableAge,
    );
  }

  public get pageTitle() {
    return this.bookQuery.data?.name;
  }
}

export const createUIStore = (bookId: string) =>
  new UIStore(permissionsStore, bookRepository, bookId);
