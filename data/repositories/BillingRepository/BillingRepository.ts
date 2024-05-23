import { type CacheService, cacheService } from '@example/shared';

import type { BillingNetworkSources } from '../../sources';
import { fakeBillingNetworkSources } from '../../sources';

import type { BillingRepositoryDTO } from './dto';

export class BillingRepository {
  constructor(
    private readonly cache: CacheService,
    private readonly billingSources: BillingNetworkSources,
  ) {}

  public getBillingInfoQuery = () =>
    this.cache.createQuery<BillingRepositoryDTO.BillingInfo>(
      ['billing-info'],
      () => this.billingSources.getBillingInfo().then(({ data }) => data),
    );
}

export const billingRepository = new BillingRepository(
  cacheService,
  fakeBillingNetworkSources,
);
