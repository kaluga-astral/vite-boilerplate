import type { ApiDataError, CacheService } from '@example/shared';
import { cacheService } from '@example/shared';

import type { BookNetworkSources } from '../../sources';
import { fakeBookNetworkSources } from '../../sources';

import type { BookRepositoryDTO } from './dto';

/**
 * @description Работает с данными о книгах
 * */
export class BookRepository {
  private bookListBaseKey = 'book-list';

  constructor(
    private readonly bookNetworkSources: BookNetworkSources,
    private readonly cache: CacheService,
  ) {}

  public getGenreByIDQuery = (id: string) =>
    this.cache.createQuery(
      ['genre', id],
      (): Promise<BookRepositoryDTO.GenreDTO> =>
        this.bookNetworkSources.getGenreByID(id).then(({ data }) => data),
    );

  public getGenreListQuery = () =>
    this.cache.createQuery(
      ['genre-list'],
      (): Promise<BookRepositoryDTO.GenreListDTO> =>
        this.bookNetworkSources.getGenreList().then(({ data }) => data),
    );

  public getBookByNameQuery = (name: string) =>
    this.cache.createQuery<BookRepositoryDTO.BookByNameDTO, ApiDataError>(
      ['book-by-name', name],
      async () => {
        const { data } = await this.bookNetworkSources.getBookByName({
          name,
        });

        const { genreID, ...book } = data;

        const genre = await this.getGenreByIDQuery(genreID).async();

        return { ...book, genre };
      },
    );

  public getBookByIdQuery = (id: string) =>
    this.cache.createQuery<BookRepositoryDTO.BookByIdDTO, ApiDataError>(
      ['book-by-id', id],
      async () => {
        const { data } = await this.bookNetworkSources.getBookById({
          id,
        });

        const { genreID, ...book } = data;

        const genre = await this.getGenreByIDQuery(genreID).async();

        return { ...book, genre };
      },
    );

  public getBookListQuery = (params: BookRepositoryDTO.BookListInputDTO) =>
    this.cache.createQuery<BookRepositoryDTO.BookListDTO>(
      [this.bookListBaseKey, params],
      async () =>
        this.bookNetworkSources.getBookList(params).then(({ data }) => data),
    );
}

export const bookRepository = new BookRepository(
  fakeBookNetworkSources,
  cacheService,
);
