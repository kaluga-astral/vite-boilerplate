import { makeAutoObservable } from 'mobx';

import { bookRepository } from '@example/data';
import type { BookRepository } from '@example/data';

export class UIStore {
  constructor(
    private readonly bookId: string,
    private readonly bookRepo: BookRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get bookQuery() {
    return this.bookRepo.getBookByNameQuery();
  }
}

export const createUIStore = (bookId: string) =>
  new UIStore(bookId, bookRepository);
