import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { createBookRouteGuardStore } from './store';

export const BookRouteGuard = observer(() => {
  const [store] = useState(createBookRouteGuardStore);
  
  return ();
});
