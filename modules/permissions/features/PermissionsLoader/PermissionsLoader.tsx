import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import type { ContentStateProps } from '@example/shared';
import { ContentState } from '@example/shared';

import type { Policies } from '../../domain';

import { createUIStore } from './UIStore';

type Props = {
  policies: Policies[];
  children: ReactNode;
} & Pick<ContentStateProps, 'loadingContent'>;

export const PermissionsLoader = observer(
  ({ children, policies, loadingContent }: Props) => {
    const [{ prepareData, status }] = useState(() => createUIStore(policies));

    useEffect(() => {
      prepareData();
    }, []);

    return (
      <ContentState
        isLoading={status.isLoading}
        isError={status.isError}
        loadingContent={loadingContent}
      >
        {children}
      </ContentState>
    );
  },
);
