import type { ReactNode } from 'react';

import { Placeholder } from '@example/shared';

import type { Permission } from '../../domain';
import { DenialReason } from '../../domain';

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

  if (permission.reason === DenialReason.NoPayAccount) {
    return <Placeholder title="Необходимо оплатить аккаунт" />;
  }

  return <Placeholder title="Нет доступа" />;
};
