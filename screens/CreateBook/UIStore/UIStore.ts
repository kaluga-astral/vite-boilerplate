import { makeAutoObservable } from 'mobx';

import type { AdministrationRepository } from '@example/data';
import { administrationRepository as administrationRepositoryInstance } from '@example/data';
import { APP_ROUTES, notify, router } from '@example/shared';
import type { BookFormValues } from '@example/modules/administration';
import type { RouterService } from '@example/shared';

export class UIStore {
  constructor(
    private readonly administrationRepository: AdministrationRepository,
    private readonly routerService: RouterService,
    private readonly notifyService: typeof notify,
  ) {
    makeAutoObservable<UIStore, 'routerService'>(this, {
      routerService: false,
    });
  }

  private get creationBookMutation() {
    return this.administrationRepository.createBookMutation();
  }

  public createBook = ({
    genre,
    pageCount,
    isPresentCoAuthor,
    ...data
  }: BookFormValues) =>
    this.creationBookMutation
      .async({ ...data, genreID: genre.id, pageCount: Number(pageCount) })
      .then(() => {
        this.notifyService.success(`${data.name} успешно создана`);
        this.routerService.navigate(APP_ROUTES.books.getRedirectPath());
      });
}

export const createUIStore = () =>
  new UIStore(administrationRepositoryInstance, router, notify);
