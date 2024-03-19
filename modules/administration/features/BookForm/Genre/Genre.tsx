import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FormAutocomplete } from '@example/shared';
import { useFormContext } from '@example/shared';

import type { BookFormValues } from '../useLogic';

import { createUIStore } from './UIStore';

export const Genre = observer(() => {
  const [{ genreList, isLoading }] = useState(createUIStore);

  const { control } = useFormContext<BookFormValues>();

  return (
    <FormAutocomplete
      required
      options={genreList}
      control={control}
      name="genre"
      loading={isLoading}
    />
  );
});
