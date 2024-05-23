import { makeAutoObservable } from 'mobx';

import { billingRepository, userRepository } from '@example/data';
import type { BillingRepository, UserRepository } from '@example/data';
import type { PermissionsPolicyManagerStore } from '@example/shared';
import { createPermissionsPolicyManagerStore } from '@example/shared';

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

/**
 * Содержит все доступы приложения
 */
export class PermissionsStore {
  private readonly policyManager: PermissionsPolicyManagerStore;

  public readonly administration: AdministrationPolicyStore;

  public readonly books: BooksPolicyStore;

  public readonly payment: PaymentPolicyStore;

  constructor(billingRepo: BillingRepository, userRepo: UserRepository) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.policyManager = createPermissionsPolicyManagerStore();

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
  public prepareData = () => this.policyManager.prepareDataSync();

  public get preparingDataStatus() {
    return this.policyManager.preparingDataStatus;
  }
}

export const permissionsStore = new PermissionsStore(
  billingRepository,
  userRepository,
);
