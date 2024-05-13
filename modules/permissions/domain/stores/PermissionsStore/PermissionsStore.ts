import { makeAutoObservable } from 'mobx';

import { cacheService } from '@example/shared';
import type { CacheService } from '@example/shared';
import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';

import type { AdministrationPolicyStore } from './AdministrationPolicyStore';
import { createAdministrationPolicyStore } from './AdministrationPolicyStore';
import type { BooksPolicyStore } from './BooksPolicyStore';
import { createBooksPolicyStore } from './BooksPolicyStore';
import type { PaymentPolicyStore } from './PaymentPolicyStore';
import { createPaymentPolicyStore } from './PaymentPolicyStore';
import type { Policy } from './types';

export type Policies = 'administration' | 'books' | 'payment';

class PreparingStatusStore {
  constructor(
    private readonly preparingStatuses: Array<Policy['preparingDataStatus']>,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isLoading() {
    return this.preparingStatuses.every(({ isLoading }) => isLoading);
  }

  public get isSuccess() {
    return this.preparingStatuses.every(({ isSuccess }) => isSuccess);
  }

  public get isError() {
    return this.preparingStatuses.every(({ isError }) => isError);
  }
}

export class PermissionsStore {
  public readonly administration: AdministrationPolicyStore;

  public readonly books: BooksPolicyStore;

  public readonly payment: PaymentPolicyStore;

  constructor(
    billingRepo: BillingRepository,
    userRepo: UserRepository,
    cache: CacheService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.administration = createAdministrationPolicyStore(cache, userRepo);
    this.books = createBooksPolicyStore(cache, billingRepo, userRepo);
    this.payment = createPaymentPolicyStore(userRepo, cache);
  }

  /**
   * @example permissions.preparePolicies([permissions.administration, permissions.books])
   */
  public preparePolicies = (policies: Policies[]) => {
    return {
      sync: () =>
        policies.forEach((policyName) => this[policyName].prepareData.sync()),
      async: () =>
        Promise.all(
          policies.map((policyName) => this[policyName].prepareData.async()),
        ),
      status: new PreparingStatusStore(
        policies.map((policyName) => this[policyName].preparingDataStatus),
      ),
    };
  };
}

export const permissionsStore = new PermissionsStore(
  billingRepository,
  userRepository,
  cacheService,
);
