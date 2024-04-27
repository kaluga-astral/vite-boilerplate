import { makeAutoObservable } from 'mobx';

import type {
  BookRepository,
  PaginationInputDTO,
  SortInputDTO,
} from '@example/data';
import { bookRepository as bookRepositoryInstance } from '@example/data';
import { formatPriceToView } from '@example/shared';

import type {
  PermissionsStore,
  ProductCartManagerStore,
} from '../../../external';
import {
  createProductCartManagerStore,
  permissionsStore,
} from '../../../external';

export type ListItem = {
  id: string;
  name: string;
  price: string;
  store: ProductCartManagerStore;
};

export type AvailableSortField = 'name' | 'price';

type SortData = Required<SortInputDTO<AvailableSortField>>;

export class UIStore {
  public sort?: SortData;

  public isShowPay = false;

  public isShowExeed = false;

  public pagination: PaginationInputDTO = { count: 10, offset: 0, page: 0 };

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly permissions: PermissionsStore,
  ) {
    makeAutoObservable(this);
  }

  private get listQuery() {
    return this.bookRepository.getBookListQuery({
      ...this.sort,
      ...this.pagination,
    });
  }

  public get totalCount() {
    return this.listQuery.data?.meta.totalCount || 0;
  }

  public get list(): ListItem[] {
    const data = this.listQuery.data?.data || [];

    return data.map(({ id, name, price }) => ({
      id,
      name,
      price: formatPriceToView(price),
      store: createProductCartManagerStore(id),
    }));
  }

  public get isLoading() {
    return this.listQuery.isLoading;
  }

  public get readingPermission() {
    return {
      isAllowed: this.permissions.book.readingOnline.isAllowed,
      isNeedSubscription: this.permissions.book.readingOnline.reasons?.find(
        ({ id }) => id === 'no-pay',
      ),
      isExeedReadingCount: this.permissions.book.readingOnline.reasons?.find(
        ({ id }) => id === 'exeed-count',
      ),
    };
  }

  public openReadingOnline = (bookId: string) => {
    if (this.permissions.book.readingOnline.isAllowed) {
      window.open(`/${bookId}`, '_blank');

      return;
    }

    if (this.permissions.book.readingOnline.reasons?.includes('no-pay')) {
      this.isShowPay = true;

      return;
    }

    if (this.permissions.book.readingOnline.reasons?.includes('exeed')) {
      this.isShowExeed = true;
    }
  };

  public setSort = (sort: SortData) => {
    this.sort = sort;
  };

  public setPaginationPage = (newPage: number) => {
    this.pagination.page = newPage;
  };
}

export const createUIStore = () =>
  new UIStore(bookRepositoryInstance, permissionsStore);
