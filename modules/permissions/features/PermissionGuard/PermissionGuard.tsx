import type { ReactNode } from 'react';

import { Typography } from '@example/shared';

import type { DenialReason, Permission } from '../../domain';

type Props = {
  permission: Permission;
  selector: Partial<Record<DenialReason, ReactNode>>;
  children: ReactNode;
};

export const PermissionGuard = ({ permission, selector, children }: Props) => {
  if (permission.isAllowed) {
    return children;
  }

  if (selector[permission.reason]) {
    return selector[permission.reason];
  }

  return <Typography>Нет доступа</Typography>;
};
