import { captureException, init } from '@sentry/browser';

import { configService } from '@example/shared';

class MonitoringErrorService {
  public captureException = captureException;

  constructor(dsn: string, stand: string) {
    this.init(dsn, stand);
  }

  private init = (dsn: string, stand: string) => {
    init({
      dsn,
      release: '1.0.0',
      dist: stand,
      tracesSampleRate: 1.0,
    });
  };
}

export const monitoringErrorService = new MonitoringErrorService(
  configService.config.sentryDsn,
  configService.config.sentryStand,
);
