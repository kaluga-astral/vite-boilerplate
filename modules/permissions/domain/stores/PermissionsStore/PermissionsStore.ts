import { makeAutoObservable } from 'mobx';

import { cacheService } from '@example/shared';
import type { CacheService } from '@example/shared';
import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';

import type { AdministrationPermissionsStore } from './AdministrationPermissionsStore';
import { createAdministrationPermissionsStore } from './AdministrationPermissionsStore';
import type { BookPermissionsStore } from './BookPermissionsStore';
import { createBookPermissionsStore } from './BookPermissionsStore';

export class PermissionsStore {
  public readonly administration: AdministrationPermissionsStore;

  public readonly book: BookPermissionsStore;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly billingRepo: BillingRepository,
    private readonly cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.administration = createAdministrationPermissionsStore(userRepo);
    this.book = createBookPermissionsStore(billingRepo, userRepo);
  }

  /**
   Запрашивает данные, которые необходимы для формирования базовых permissions
  **/
  public getPrepareCriticalDataMutation = () =>
    this.cache.createMutation(async () => {
      await Promise.all([this.userRepo.getRolesQuery().async()]);
    });
}

export const permissionsStore = new PermissionsStore(
  userRepository,
  billingRepository,
  cacheService,
);
