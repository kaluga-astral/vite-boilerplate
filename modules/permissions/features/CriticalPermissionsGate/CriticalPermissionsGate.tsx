import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { ContentState } from '@example/shared';

import { createUIStore } from './UIStore';

type Props = { children: ReactNode };

export const CriticalPermissionsGate = observer(({ children }: Props) => {
  const [{ getCriticalData, isLoading, errorInfo }] = useState(createUIStore);

  useEffect(() => {
    getCriticalData();
  }, []);

  return (
    <ContentState
      isLoading={isLoading}
      isError={errorInfo.isError}
      errorState={
        errorInfo.error
          ? {
              errorList: [errorInfo.error],
              onRetry: getCriticalData,
            }
          : undefined
      }
    >
      {children}
    </ContentState>
  );
});
