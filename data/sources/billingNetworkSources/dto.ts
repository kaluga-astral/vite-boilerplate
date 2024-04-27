export namespace BillingNetworkSourcesDTO {
  export type SubscriptionPeriod = 'month' | 'year';

  export type SubscriptionInfo = {
    startDate: string;
    period: SubscriptionPeriod;
    onlineReading: {
      allowedCount: number;
      currentCount: number;
    };
  };

  export type BillingInfo = {
    paid: boolean;
    info: SubscriptionInfo;
  };
}
