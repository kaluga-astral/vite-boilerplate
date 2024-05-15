import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { lazy } from 'react';

import { APP_ROUTES } from '@example/shared';
import { NotFoundScreen } from '@example/screens';

const IndexPage = lazy(() => import('./index'));

const CartPage = lazy(() => import('./cart'));

const CreateBookPage = lazy(() => import('./admin/createBook'));

const ReadingBookPage = lazy(() => import('./book/reading'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: '*',
        element: <NotFoundScreen />,
      },
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: APP_ROUTES.cart.route,
        element: <CartPage />,
      },
      {
        path: APP_ROUTES.createBook.route,
        element: <CreateBookPage />,
      },
      {
        path: APP_ROUTES.readingBook.route,
        element: <ReadingBookPage />,
      },
    ],
  },
];
