import { makeAutoObservable } from 'mobx';

import type {
  BookRepository,
  PaginationInputDTO,
  SortInputDTO,
} from '@example/data';
import { bookRepository as bookRepositoryInstance } from '@example/data';
import type { Notify } from '@example/shared';
import { formatPriceToView, notify } from '@example/shared';

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
  acceptableAge: number;
  store: ProductCartManagerStore;
};

export type AvailableSortField = 'name' | 'price';

type SortData = Required<SortInputDTO<AvailableSortField>>;

export class UIStore {
  public sort?: SortData;

  public pagination: PaginationInputDTO = { count: 10, offset: 0, page: 0 };

  public isOpenAccountPayment = false;

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly permissions: PermissionsStore,
    private readonly notifyService: Notify,
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

    return data.map(({ id, name, price, acceptableAge }) => ({
      id,
      name,
      acceptableAge,
      price: formatPriceToView(price),
      store: createProductCartManagerStore(id),
    }));
  }

  public get isLoading() {
    return this.listQuery.isLoading;
  }

  public addToShelf = (bookId: string) => {
    if (this.permissions.books.addingToShelf.isAllowed) {
      this.notifyService.info(`Книга ${bookId} добавлена на полку`);

      return;
    }

    if (this.permissions.books.addingToShelf.hasReason('no-pay-account')) {
      this.openPaymentAccount();

      return;
    }

    if (
      this.permissions.books.addingToShelf.hasReason('exceed-reading-count')
    ) {
      this.notifyService.error(
        'Достигнуто максимальное количество книг на полке',
      );

      return;
    }

    this.notifyService.error(
      'Добавить книгу на полку нельзя. Попробуйте перезагрузить страницу',
    );
  };

  public checkBuyPermission = (
    acceptableAge: number,
  ): { isAllowed: boolean; message?: string } => {
    const permission = this.permissions.payment.calcPayment(acceptableAge);

    if (permission.isAllowed) {
      return { isAllowed: true };
    }

    if (permission.hasReason('not-for-your-age')) {
      return {
        isAllowed: false,
        message: `Вы не достигли ${acceptableAge} лет`,
      };
    }

    if (permission.hasReason('missing-user-age')) {
      return {
        isAllowed: false,
        message: 'Необходимо указать свой возраст в личном кабинете',
      };
    }

    return { isAllowed: false, message: 'Покупка недоступна' };
  };

  public setSort = (sort: SortData) => {
    this.sort = sort;
  };

  public setPaginationPage = (newPage: number) => {
    this.pagination.page = newPage;
  };

  public openPaymentAccount = () => {
    this.isOpenAccountPayment = true;
  };

  public closePaymentAccount = () => {
    this.isOpenAccountPayment = false;
  };
}

export const createUIStore = () =>
  new UIStore(bookRepositoryInstance, permissionsStore, notify);
