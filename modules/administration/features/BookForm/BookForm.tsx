import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FormCheckbox, FormProvider, FormTextField } from '@example/shared';

import type { BookFormValues } from './useLogic';
import { useLogic } from './useLogic';
import { Genre } from './Genre';
import { Author } from './Author';
import { createUIStore } from './UIStore';
import { StyledPreview, Wrapper } from './styles';

export type BookFormProps = {
  onSubmit: (values: BookFormValues) => Promise<void>;
};

export const BookForm = observer(({ onSubmit }: BookFormProps) => {
  const [store] = useState(createUIStore);

  const { form, isPresentCoAuthor } = useLogic(store, { onSubmit });

  return (
    <FormProvider {...form}>
      <Wrapper noValidate>
        <FormTextField
          required
          control={form.control}
          name="name"
          label="Название книги"
        />
        <Genre />
        <FormTextField
          required
          control={form.control}
          name="pageCount"
          label="Количество страниц"
        />
        <Author />
        <FormCheckbox
          title="Есть соавтор"
          control={form.control}
          name="isPresentCoAuthor"
        />
        {isPresentCoAuthor && (
          <fieldset>
            <FormTextField
              required
              label="Имя автора"
              control={form.control}
              name="coAuthor.name"
            />
            <FormTextField
              required
              label="Фамилия автора"
              control={form.control}
              name="coAuthor.surname"
            />
          </fieldset>
        )}
        <StyledPreview />
      </Wrapper>
    </FormProvider>
  );
});
