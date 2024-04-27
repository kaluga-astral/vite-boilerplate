import { makeAutoObservable } from 'mobx';

import { cacheService } from '@example/shared';
import type { CacheService } from '@example/shared';
import { userRepository } from '@example/data';
import type { UserRepository } from '@example/data';

import { AdministrationPermissionsStore } from './AdministrationPermissionsStore';

export class PermissionsStore {
  public readonly administration: AdministrationPermissionsStore;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.administration = new AdministrationPermissionsStore(userRepo);
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
  cacheService,
);
