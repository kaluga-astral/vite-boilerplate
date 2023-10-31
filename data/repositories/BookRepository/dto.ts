import {
  BookByNameNetworkDTO,
  BookListItemNetworkDTO,
  BookListNetworkDTO,
  BookListNetworkInputDTO,
  GenreListNetworkDTO,
  GenreNetworkDTO,
} from '../../sources';

export namespace BookRepositoryDTO {
  export type GenreListDTO = GenreListNetworkDTO;
  export type GenreDTO = GenreNetworkDTO;

  export type BookByNameDTO = Omit<BookByNameNetworkDTO, 'genreID'> & {
    genre: GenreDTO;
  };

  export type BookListDTO = BookListNetworkDTO;
  export type BookListItemDTO = BookListItemNetworkDTO;
  export type BookListInputDTO = BookListNetworkInputDTO;
}