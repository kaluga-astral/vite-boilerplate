import { observer } from 'mobx-react-lite';

import { AccessDeniedScreen, CreateBookScreen } from '@example/screens';
import { permissionsStore } from '@example/modules/permissions';

const CreateBookPage = observer(() => {
  if (!permissionsStore.administration.administrationActions.isAllowed) {
    return (
      <AccessDeniedScreen
        advice={
          permissionsStore.administration.administrationActions.reasons[0]
            .advice
        }
      />
    );
  }

  return <CreateBookScreen />;
});

export default CreateBookPage;
