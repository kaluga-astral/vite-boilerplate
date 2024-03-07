import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { CartGoodsList } from '@example/modules/cart';
import { CardPaymentStatus } from '@example/modules/payment';
import { Button, Dialog, Grid, PageLayout } from '@example/shared';

import { createUIStore } from './UIStore';

export const CartScreen = observer(() => {
  const [
    {
      isOpenModal,
      openModal,
      closeModal,
      isErrorPayment,
      isLoadingPayment,
      pay,
      errors,
    },
  ] = useState(createUIStore);

  return (
    <PageLayout
      header={{ title: 'Корзина' }}
      content={{
        children: (
          <Grid rowSpacing={4}>
            <CartGoodsList />
            <Button onClick={openModal}>Оплатить</Button>
            <Dialog
              open={isOpenModal}
              onClose={closeModal}
              title="Оплата картой"
            >
              <CardPaymentStatus
                isLoading={isLoadingPayment}
                isError={isErrorPayment}
                errors={errors}
                onRetry={pay}
              />
            </Dialog>
          </Grid>
        ),
      }}
    />
  );
});
