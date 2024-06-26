import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PageLayout, Placeholder } from '@example/shared';

import { PermissionDenialReason, permissionsStore } from '../../../domain';
import { PermissionGuard } from '../../PermissionGuard';

type Props = {
  children: ReactNode;
};

export const AdminRouteGuard = observer(({ children }: Props) => {
  return (
    <PermissionGuard
      permission={permissionsStore.administration.administrationActions}
      denialSwitch={{
        [PermissionDenialReason.NoAdmin]: (
          <PageLayout
            header={{ title: 'Панель администратора' }}
            content={{
              children: (
                <Placeholder title="Доступно только для администраторов" />
              ),
            }}
          />
        ),
      }}
    >
      {children}
    </PermissionGuard>
  );
});
