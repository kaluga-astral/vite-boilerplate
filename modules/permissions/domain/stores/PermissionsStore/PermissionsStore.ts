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
 * Реализация паттерна доступов: https://kaluga-astral.github.io/guides/docs/category/permissions-%D0%BF%D0%B0%D1%82%D1%82%D0%B5%D1%80%D0%BD-%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B5
 *  */
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
