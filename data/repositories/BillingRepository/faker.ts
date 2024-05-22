import { billingNetworkSourcesFaker } from '../../sources';

import type { BillingRepositoryDTO } from './dto';

export const billingRepositoryFaker = {
  makeBillingInfo(
    data?: Partial<BillingRepositoryDTO.BillingInfo>,
  ): BillingRepositoryDTO.BillingInfo {
    return billingNetworkSourcesFaker.makeBillingInfo(data);
  },
  makeBillingDetails(
    data?: Partial<BillingRepositoryDTO.BillingInfo['info']>,
  ): BillingRepositoryDTO.BillingInfo['info'] {
    return billingNetworkSourcesFaker.makeBillingDetails(data);
  },
};
