import { faker } from '@example/shared';

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
      info: { startDate: faker.date.recent().toISOString(), period: 'month' },
      ...data,
    };
  },
};

export const fakeBillingNetworkSources: BillingNetworkSources = {
  ...billingNetworkSources,
  getBillingInfo: async () =>
    makeFakeSourceRes(billingNetworkSourcesFaker.makeBillingInfo()),
};
