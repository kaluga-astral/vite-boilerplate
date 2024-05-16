import type { ReactNode } from 'react';

import { Placeholder } from '@example/shared';

import type { Permission } from '../../domain';
import { DenialPermissionReason } from '../../domain';

type Props = {
  permission: Permission;
  /**
   * Позволяет отредендерить компонент для конкретной причины отказа в доступе
   */
  denialSwitch: Partial<Record<DenialPermissionReason, ReactNode>>;
  children: ReactNode;
};

/**
 * Закрывает доступ к children, обрабатывает дефолтные причины отказа
 */
export const PermissionGuard = ({
  permission,
  denialSwitch,
  children,
}: Props) => {
  if (permission.isAllowed) {
    return children;
  }

  if (denialSwitch[permission.reason]) {
    return denialSwitch[permission.reason];
  }

  if (permission.reason === DenialPermissionReason.NoPayAccount) {
    return <Placeholder title="Необходимо оплатить аккаунт" />;
  }

  if (permission.reason === DenialPermissionReason.MissingUserAge) {
    return <Placeholder title="Необходимо заполнить дату рождения в ЛК" />;
  }

  return <Placeholder title="Нет доступа" />;
};
