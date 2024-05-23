import { observer } from 'mobx-react-lite';

import { CreateBookScreen } from '@example/screens';
import { AdminRouteGuard } from '@example/modules/permissions';

const CreateBookPage = observer(() => {
  return (
    <AdminRouteGuard>
      <CreateBookScreen />
    </AdminRouteGuard>
  );
});

export default CreateBookPage;
