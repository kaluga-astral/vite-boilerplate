import { makeAutoObservable } from 'mobx';

import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';
import type { CacheService } from '@example/shared';
import { cacheService } from '@example/shared';

import {
  createAdministrationPolicyStore,
  createBooksPolicyStore,
  createPaymentPolicyStore,
} from './policies';
import type {
  AdministrationPolicyStore,
  BooksPolicyStore,
  PaymentPolicyStore,
} from './policies';
import type { PolicyManagerStore } from './PolicyManagerStore';
import { createPolicyManagerStore } from './PolicyManagerStore';

/**
 * Содержит все доступы приложения
 */
export class PermissionsStore {
  private readonly policyManager: PolicyManagerStore;

  public readonly administration: AdministrationPolicyStore;

  public readonly books: BooksPolicyStore;

  public readonly payment: PaymentPolicyStore;

  constructor(
    cache: CacheService,
    billingRepo: BillingRepository,
    userRepo: UserRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.policyManager = createPolicyManagerStore(cache);

    this.administration = createAdministrationPolicyStore(
      this.policyManager,
      userRepo,
    );

    this.books = createBooksPolicyStore(
      this.policyManager,
      billingRepo,
      userRepo,
    );

    this.payment = createPaymentPolicyStore(this.policyManager, userRepo);
  }

  /**
   * Подготавливает данные для формирования доступов
   */
  public prepareData = () => this.policyManager.prepareData();

  public get preparingDataStatus() {
    return this.policyManager.preparingDataStatus;
  }
}

export const permissionsStore = new PermissionsStore(
  cacheService,
  billingRepository,
  userRepository,
);
