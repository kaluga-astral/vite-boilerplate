import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import type { CacheService } from '@example/shared';

import { createUserAgePermission } from '../utils';
import type { Policy } from '../types';
import type { PolicyStore } from '../PolicyStore';
import { createPolicyStore } from '../PolicyStore';

export class PaymentPolicyStore implements Policy {
  private readonly policy: PolicyStore;

  constructor(
    private readonly userRepo: UserRepository,
    cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.policy = createPolicyStore(cache, async () => {
      await Promise.all([userRepo.getPersonInfoQuery().async()]);
    });
  }

  public prepareData = () => this.policy.prepareData();

  public get preparingDataStatus() {
    return this.policy.preparingDataStatus;
  }

  public checkPayment = (acceptableAge: number) =>
    createUserAgePermission(
      this.preparingDataStatus.isSuccess,
      acceptableAge,
      this.userRepo.getPersonInfoQuery().data?.birthday,
    );
}

export const createPaymentPolicyStore = (
  userRepo: UserRepository,
  cache: CacheService,
) => new PaymentPolicyStore(userRepo, cache);
