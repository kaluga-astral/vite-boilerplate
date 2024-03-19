import { useEffect } from 'react';

import type { DeepPartial, UseFormReturn } from '@example/shared';
import { useForm } from '@example/shared';

import type { UIStore } from '../UIStore';

import { validationSchema } from './validation';
import type { BookFormValues } from './types';

type Params = {
  onSubmit: (values: BookFormValues) => Promise<void>;
  initialValues?: DeepPartial<BookFormValues>;
};

type Result = {
  form: UseFormReturn<BookFormValues>;
  isPresentCoAuthor: boolean;
  submit: ReturnType<UseFormReturn<BookFormValues>['handleSubmit']>;
};

export const useLogic = (
  store: UIStore,
  {
    onSubmit,
    initialValues = { author: {}, isPresentCoAuthor: false },
  }: Params,
): Result => {
  const form = useForm<BookFormValues>({
    validationSchema,
    defaultValues: initialValues,
  });

  const isPresentCoAuthor = form.watch('isPresentCoAuthor');

  const name = form.watch('name');

  useEffect(() => {
    store.onAutocompleteByName((data) => {
      form.setValue('genre', data.genre);
      form.setValue('author', data.author);
    });
  }, []);

  useEffect(() => {
    store.findBook(name);
  }, [name]);

  return { form, isPresentCoAuthor, submit: form.handleSubmit(onSubmit) };
};
