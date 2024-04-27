import { useEffect } from 'react';
import {
  enableStaticRendering as enableMobxStaticRendering,
  observer,
} from 'mobx-react-lite';
import { useRoutes } from 'react-router-dom';

import { authStore } from '@example/modules/auth';
import { CriticalPermissionsGate } from '@example/modules/permissions';
import { MainLayout } from '@example/modules/layout';
import {
  ConfigProvider,
  NotificationContainer,
  RouterServiceAdapter,
  ThemeProvider,
  apiHttpClient,
  configService,
  initApiHttpClient,
  monitoringErrorService,
  noDataImgSrc,
  outdatedReleaseImgSrc,
  placeholderImgSrc,
  theme,
} from '@example/shared';

import { routes } from './routes';

configService.init({
  apiUrl: import.meta.env.VITE_API_URL,
  monitoringDsn: import.meta.env.VITE_SENTRY_DSN,
  monitoringStand: import.meta.env.VITE_SENTRY_ENV,
  monitoringRelease: import.meta.env.VITE_RELEASE,
});

initApiHttpClient();
enableMobxStaticRendering(typeof window === 'undefined');

export const App = observer(() => {
  const renderRoutes = useRoutes(routes);

  useEffect(() => {
    authStore.addProtectedHttpClients([apiHttpClient]);
    authStore.signIn('token');
  }, []);

  return (
    <ConfigProvider
      imagesMap={{
        noDataImgSrc: noDataImgSrc,
        defaultErrorImgSrc: placeholderImgSrc,
        outdatedReleaseErrorImgSrc: outdatedReleaseImgSrc,
      }}
      captureException={monitoringErrorService.captureException}
    >
      <RouterServiceAdapter />
      <ThemeProvider theme={theme}>
        <NotificationContainer />
        <CriticalPermissionsGate>
          <MainLayout>{renderRoutes}</MainLayout>
        </CriticalPermissionsGate>
      </ThemeProvider>
    </ConfigProvider>
  );
});

export default App;
