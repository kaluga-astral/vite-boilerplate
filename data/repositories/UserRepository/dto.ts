import type { UserNetworkSourcesDTO } from '../../sources';

export namespace UserRepositoryDTO {
  export type UserContactDTO = UserNetworkSourcesDTO.ContactDTO;

  export type UserPersonDTO = UserNetworkSourcesDTO.PersonDTO;

  export type UserFullInfoDTO = UserNetworkSourcesDTO.PersonDTO &
    UserNetworkSourcesDTO.ContactDTO;

  export enum Role {
    Admin = 'admin',
    User = 'user',
  }

  export type CurrentRoles = Role[];
}
