import { FormTextField, Grid } from '@example/shared';
import { useFormContext } from '@example/shared';

import type { BookFormValues } from '../useLogic';

export const Author = () => {
  const { control } = useFormContext<BookFormValues>();

  return (
    <Grid component="fieldset" spacing={2} columns={2}>
      <FormTextField
        required
        label="Имя автора"
        control={control}
        name="author.name"
      />
      <FormTextField
        required
        label="Фамилия автора"
        control={control}
        name="author.surname"
      />
    </Grid>
  );
};
