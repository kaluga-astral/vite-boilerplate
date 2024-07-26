import type { Notify } from '@example/shared';

import { SedoErrorMessage } from '../messages/SedoErrorMessage';

export const useLogic = (notify: Notify) => {
  const notifyOnSedo999Error = (title, id) => {
    notify.warning(<SedoErrorMessage title={title} id={id} />);
  };

  return {
    notifyOnSedo999Error,
  };
};
