import type {
  AdministrationRepositoryDTO,
  BookRepositoryDTO,
} from '@example/data';

export type BookFormValues = {
  name: string;
  genre: BookRepositoryDTO.GenreDTO;
  pageCount: string;
  author: AdministrationRepositoryDTO.CreateBookInputDTO['author'];
  coAuthor?: AdministrationRepositoryDTO.CreateBookInputDTO['coAuthor'];
  isPresentCoAuthor: boolean;
};
