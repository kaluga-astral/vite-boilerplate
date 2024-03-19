import { useFormContext } from '@example/shared';

import type { BookFormValues } from '../../useLogic';

type Result = {
  name: BookFormValues['name'];
  authorFullName: string;
};

export const useLogic = (): Result => {
  const { watch } = useFormContext<BookFormValues>();

  const { name, author } = watch();

  return {
    name,
    authorFullName: `${author.name} ${author.surname}`,
  };
};
