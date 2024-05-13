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
}

export const permissionsStore = new PermissionsStore(
  billingRepository,
  userRepository,
  cacheService,
);
