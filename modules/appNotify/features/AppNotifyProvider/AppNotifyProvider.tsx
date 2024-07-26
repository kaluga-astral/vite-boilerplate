import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { appNotifyStoreStore } from '../../domain/AppNotifyStoreStore';

import { useLogic } from './useLogic';

export const AppNotifyProvider = observer(() => {
  const { notifyOnSedoError } = useLogic();

  useEffect(() => {
    appNotifyStoreStore.init({ notifyOnSedoError });
  }, []);

  return null;
});
