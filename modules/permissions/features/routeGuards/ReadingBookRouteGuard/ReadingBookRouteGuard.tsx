import type { ReactNode } from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  ContentState,
  PageLayout,
  Placeholder,
  RouterLink,
} from '@example/shared';

import { PermissionGuard } from '../../PermissionGuard';
import { DenialReason } from '../../../domain';

import { createUIStore } from './UIStore';

type Props = {
  id: string;
  children: ReactNode;
};

export const ReadingBookRouteGuard = observer(({ id, children }: Props) => {
  const [{ permission, pageTitle, backLink, status }] = useState(() =>
    createUIStore(id),
  );

  return (
    <ContentState {...status}>
      <PermissionGuard
        permission={permission}
        denialSwitch={{
          [DenialReason.NotForYourAge]: (
            <PageLayout
              header={{
                title: pageTitle,
                backButton: {
                  component: RouterLink,
                  to: backLink,
                },
              }}
              content={{
                children: (
                  <Placeholder title="Недоступна для вашего возраста" />
                ),
              }}
            />
          ),
        }}
      >
        {children}
      </PermissionGuard>
    </ContentState>
  );
});
