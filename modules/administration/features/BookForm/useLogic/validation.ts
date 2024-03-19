import { v } from '@example/shared';

import type { BookFormValues } from './types';

export const validationSchema = v.object<BookFormValues>({
  name: v.string(),
  genre: v.object<BookFormValues['genre']>({
    id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  }),
  pageCount: v.number(),
  author: v.object<BookFormValues['author']>({
    name: v.string(),
    surname: v.string(),
  }),
  isPresentCoAuthor: v.optional(v.boolean()),
  coAuthor: v.when({
    is: (_, ctx) => Boolean((ctx.values as BookFormValues)?.isPresentCoAuthor),
    then: v.object<BookFormValues['author']>({
      name: v.string(),
      surname: v.string(),
    }),
    otherwise: v.any(),
  }),
});
