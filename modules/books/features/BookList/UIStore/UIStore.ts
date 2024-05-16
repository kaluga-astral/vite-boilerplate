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

    if (this.permissions.books.addingToShelf.reason === 2) {
      this.openPaymentAccount();

      return;
    }

    if (this.permissions.books.addingToShelf.reason === 3) {
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
  ): { isAllow: boolean; reason?: string } => {
    const { isAllowed, reason } =
      this.permissions.payment.checkPayment(acceptableAge);

    if (isAllowed) {
      return { isAllow: true };
    }

    if (reason === 3) {
      return { isAllow: false, reason: `Вы не достигли ${acceptableAge} лет` };
    }

    if (reason === 4) {
      return {
        isAllow: false,
        reason: 'Необходимо указать свой возраст в личном кабинете',
      };
    }

    return { isAllow: false, reason: 'Покупка недоступна' };
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
