import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FormAutocomplete } from '@example/shared';

import { useBookFormContext } from '../hooks';

import { createUIStore } from './UIStore';

export const Genre = observer(() => {
  const [{ genreList, isLoading }] = useState(createUIStore);

  const { control } = useBookFormContext();

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
