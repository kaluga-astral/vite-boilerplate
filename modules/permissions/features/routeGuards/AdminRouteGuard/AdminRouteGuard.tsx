import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PageLayout } from '@example/shared';

import { DenialReason, permissionsStore } from '../../../domain';
import { PermissionGuard } from '../../PermissionGuard';
import { NoAdminPlaceholder } from '../../NoAdminPlaceholder';

type Props = {
  children: ReactNode;
};

export const AdminRouteGuard = observer(({ children }: Props) => {
  return (
    <PermissionGuard
      permission={permissionsStore.administration.administrationActions}
      selector={{
        [DenialReason.NoAdmin]: (
          <PageLayout
            header={{ title: 'Панель администратора' }}
            content={{ children: <NoAdminPlaceholder /> }}
          />
        ),
      }}
    >
      {children}
    </PermissionGuard>
  );
});
