import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type { CacheService } from '@example/shared';

import { createUserAgePermission } from '../rules';
import type { IPermissionStore } from '../types';

export class PaymentPolicyStore implements IPermissionStore {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public getPrepareDataMutation = () =>
    this.cache.createMutation(async () => {
      await Promise.all([this.userRepo.getPersonInfoQuery().async()]);
    });

  public checkPaymentPermission = (acceptableAge: number) =>
    createUserAgePermission(
      this.userRepo.getPersonInfoQuery().isSuccess,
      acceptableAge,
      this.userRepo.getPersonInfoQuery().data?.birthday,
    );
}

export const createPaymentPolicyStore = (
  userRepo: UserRepository,
  cache: CacheService,
) => new PaymentPolicyStore(userRepo, cache);
