import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { sedoGeneralNotifyStore } from '../../domain/SedoGeneralNotifyStore';

import { useLogic } from './useLogic';

export const SedoNotifyProvider = observer(() => {
  const { notifyOnSedoError } = useLogic();

  useEffect(() => {
    sedoGeneralNotifyStore.init({ notifyOnSedoError });
  }, []);

  return null;
});
