import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';

import {
  APP_ROUTES,
  AddOutlineMd,
  DashboardLayout,
  type NavMenuProps,
  RouterLink,
  useRouterLocation,
} from '@example/shared';

import { CartBadge } from '../../../external';

import { createUIStore } from './UIStore';

export const Sidebar = observer(() => {
  const { pathname } = useRouterLocation();
  const [{ isAllowBookCreation }] = useState(createUIStore);

  const menuItems = useMemo<NavMenuProps['items']>(() => {
    const items: NavMenuProps['items'] = [
      [
        APP_ROUTES.cart.route,
        {
          icon: <CartBadge />,
          text: 'Корзина',
          active: pathname?.includes(APP_ROUTES.cart.route),
          component: ({ children, ...props }) => (
            <RouterLink {...props} to={APP_ROUTES.cart.getRedirectPath()}>
              {children}
            </RouterLink>
          ),
        },
      ],
    ];

    if (isAllowBookCreation) {
      items.push([
        APP_ROUTES.createBook.route,
        {
          icon: <AddOutlineMd />,
          text: 'Добавить книгу',
          active: pathname?.includes(APP_ROUTES.createBook.route),
          component: ({ children, ...props }) => (
            <RouterLink {...props} to={APP_ROUTES.createBook.getRedirectPath()}>
              {children}
            </RouterLink>
          ),
        },
      ]);
    }

    return items;
  }, [isAllowBookCreation]);

  return (
    <DashboardLayout.Sidebar
      menu={{
        items: menuItems,
      }}
    />
  );
});
