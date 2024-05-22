import { faker } from '@example/shared';
import type { DeepPartial } from '@example/shared';

import { makeFakeSourceRes } from '../utils';

import type { BillingNetworkSources } from './billingNetworkSources';
import { billingNetworkSources } from './billingNetworkSources';
import type { BillingNetworkSourcesDTO } from './dto';

export const billingNetworkSourcesFaker = {
  makeBillingInfo(
    data?: Partial<BillingNetworkSourcesDTO.BillingInfo>,
  ): BillingNetworkSourcesDTO.BillingInfo {
    return {
      paid: true,
      ...data,
      info: this.makeBillingDetails(data?.info),
    };
  },
  makeBillingDetails(
    data?: Partial<BillingNetworkSourcesDTO.BillingInfo['info']>,
  ): BillingNetworkSourcesDTO.BillingInfo['info'] {
    return {
      startDate: faker.date.recent().toISOString(),
      period: 'month',
      shelf: { allowedCount: 3, currentCount: 1 },
      onlineReading: { allowedCount: 3, currentCount: 1 },
      ...data,
    };
  },
};

export const fakeBillingNetworkSources: BillingNetworkSources = {
  ...billingNetworkSources,
  getBillingInfo: async () =>
    makeFakeSourceRes(billingNetworkSourcesFaker.makeBillingInfo()),
};
