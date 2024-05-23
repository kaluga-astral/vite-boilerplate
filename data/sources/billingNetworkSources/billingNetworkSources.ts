import type { HttpServiceResponse } from '@example/shared';
import { apiHttpClient } from '@example/shared';

import type { BillingNetworkSourcesDTO } from './dto';

export const billingNetworkSources = {
  getBillingInfo: () =>
    apiHttpClient.get<
      void,
      HttpServiceResponse<BillingNetworkSourcesDTO.BillingInfo>
    >('/billing'),
};

export type BillingNetworkSources = typeof billingNetworkSources;
