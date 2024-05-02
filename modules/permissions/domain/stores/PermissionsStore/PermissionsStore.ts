import { makeAutoObservable } from 'mobx';

import { cacheService } from '@example/shared';
import type { CacheService } from '@example/shared';
import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';

import type { IPermissionStore } from './types';
import type { AdministrationPermissionsStore } from './AdministrationPermissionsStore';
import { createAdministrationPermissionsStore } from './AdministrationPermissionsStore';
import type { BooksPermissionsStore } from './BooksPermissionsStore';
import { createBooksPermissionsStore } from './BooksPermissionsStore';

export class PermissionsStore implements IPermissionStore {
  public readonly administration: AdministrationPermissionsStore;

  public readonly books: BooksPermissionsStore;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly billingRepo: BillingRepository,
    private readonly cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.administration = createAdministrationPermissionsStore(userRepo);
    this.books = createBooksPermissionsStore(billingRepo, userRepo);
  }

  /**
   Запрашивает данные, которые необходимы для формирования базовых permissions
  **/
  public getPrepareDataMutation = () =>
    this.cache.createMutation(async () => {
      await Promise.all([this.userRepo.getRolesQuery().async()]);
    });
}

export const permissionsStore = new PermissionsStore(
  userRepository,
  billingRepository,
  cacheService,
);
