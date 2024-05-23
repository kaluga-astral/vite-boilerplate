import { faker } from '@example/shared';

import { makeFakeSourceRes } from '../utils';

import type { BookNetworkSources } from './bookNetworkSources';
import { bookNetworkSources } from './bookNetworkSources';
import type { BookNetworkSourcesDTO } from './dto';

export const bookNetworkSourcesFaker = {
  makeBookByName: (
    data?: Partial<BookNetworkSourcesDTO.BookByNameDTO>,
  ): BookNetworkSourcesDTO.BookByNameDTO => ({
    name: faker.lorem.word(6),
    genreID: faker.string.uuid(),
    pageCount: 3,
    author: {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
    },
    coAuthor: {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
    },
    ...data,
  }),

  makeBookById: (
    data?: Partial<BookNetworkSourcesDTO.BookByIdDTO>,
  ): BookNetworkSourcesDTO.BookByIdDTO => ({
    name: faker.lorem.word(6),
    genreID: faker.string.uuid(),
    pageCount: 3,
    author: {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
    },
    coAuthor: {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
    },
    acceptableAge: faker.number.int(100),
    ...data,
  }),

  makeBookList: (
    length: number = 10,
    item?: Partial<BookNetworkSourcesDTO.BookListItemDTO>,
  ): BookNetworkSourcesDTO.BookListDTO => ({
    data: Array.from({ length }).map(() => ({
      name: faker.commerce.productName(),
      id: faker.string.uuid(),
      price: faker.number.int(100000),
      acceptableAge: faker.number.int(100),
      ...item,
    })),
    meta: { totalCount: 100 },
  }),

  makeGenre: (
    data?: Partial<BookNetworkSourcesDTO.GenreDTO>,
  ): BookNetworkSourcesDTO.GenreDTO => ({
    id: faker.string.uuid(),
    name: 'Мужской',
    description: faker.lorem.sentence(),
    ...data,
  }),
};

export const fakeBookNetworkSources: BookNetworkSources = {
  ...bookNetworkSources,
  getBookList: async ({ count }) =>
    makeFakeSourceRes(bookNetworkSourcesFaker.makeBookList(count)),
  getBookById: async () =>
    makeFakeSourceRes(bookNetworkSourcesFaker.makeBookById()),
};
