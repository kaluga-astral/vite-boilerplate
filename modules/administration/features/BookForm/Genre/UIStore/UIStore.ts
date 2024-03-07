import { makeAutoObservable } from 'mobx';

import type { BookRepository } from '@example/data';
import { bookRepository as bookRepositoryInstance } from '@example/data';

export class UIStore {
  constructor(private readonly bookRepository: BookRepository) {
    makeAutoObservable(this);
  }

  private get genreListQuery() {
    return this.bookRepository.getGenreListQuery();
  }

  public get genreList() {
    return this.genreListQuery.data?.list || [];
  }

  public get isLoading() {
    return this.genreListQuery.isLoading;
  }
}

export const createUIStore = () => new UIStore(bookRepositoryInstance);
