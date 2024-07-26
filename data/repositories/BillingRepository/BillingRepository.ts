import { type CacheService, cacheService } from '@example/shared';

import type { BillingNetworkSources } from '../../sources';
import { fakeBillingNetworkSources } from '../../sources';

import type { BillingRepositoryDTO } from './dto';

export class BillingRepository {
  private billingCacheKey = 'billingCacheKey';
}

export const billingRepository = new BillingRepository(
  cacheService,
  fakeBillingNetworkSources,
);
