import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { Badge, CartOutlineMd, IconButton } from '@example/shared';

import { createUIStore } from './UIStore';

export const CartBadge = observer(() => {
  const [{ isAccessCount, count, redirectToCart }] =
    useState(createUIStore);

  return (
    <Badge color="error" badgeContent={isAccessCount ? count : undefined}>
      <IconButton onClick={redirectToCart}>
        <CartOutlineMd />
      </IconButton>
    </Badge>
  );
});
