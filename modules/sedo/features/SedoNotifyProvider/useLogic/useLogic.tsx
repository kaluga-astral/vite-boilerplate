import type { Notify } from '@example/shared';

import { SedoErrorMessage } from '../messages/SedoErrorMessage';

export const useLogic = (notify: Notify) => {
  const notify999Error = (title, id) => {
    notify.warning(<SedoErrorMessage title={title} id={id} />);
  };

  return {
    notify999Error,
  };
};
