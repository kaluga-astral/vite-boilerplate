import { makeAutoObservable } from 'mobx';

import { cacheService } from '@example/shared';
import type { CacheMutation, CacheService } from '@example/shared';
import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';

import type { AdministrationPolicyStore } from './AdministrationPolicyStore';
import { createAdministrationPolicyStore } from './AdministrationPolicyStore';
import type { BooksPolicyStore } from './BooksPolicyStore';
import { createBooksPolicyStore } from './BooksPolicyStore';
import type { PaymentPolicyStore } from './PaymentPolicyStore';
import { createPaymentPolicyStore } from './PaymentPolicyStore';

export class PermissionsStore {
  public readonly administration: AdministrationPolicyStore;

  public readonly books: BooksPolicyStore;

  public readonly payment: PaymentPolicyStore;

  private readonly preparingDataMutation: CacheMutation<void, Error>;

  constructor(
    billingRepo: BillingRepository,
    userRepo: UserRepository,
    cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.administration = createAdministrationPolicyStore(cache, userRepo);
    this.books = createBooksPolicyStore(cache, billingRepo, userRepo);
    this.payment = createPaymentPolicyStore(userRepo, cache);

    this.preparingDataMutation = cache.createMutation(async () => {
      await Promise.all([
        this.administration.prepareData(),
        this.books.prepareData(),
        this.payment.prepareData(),
      ]);
    });
  }

  public prepareData = () => this.preparingDataMutation.sync();

  public get preparingDataStatus() {
    const { isError, error, isLoading, isSuccess } = this.preparingDataMutation;

    return {
      isError,
      error: error?.message,
      isLoading,
      isSuccess,
    };
  }
}

export const permissionsStore = new PermissionsStore(
  billingRepository,
  userRepository,
  cacheService,
);
