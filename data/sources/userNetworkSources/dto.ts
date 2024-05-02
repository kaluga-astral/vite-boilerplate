export namespace UserNetworkSourcesDTO {
  export type ContactDTO = {
    email?: string;
    phone: string;
  };

  export type PersonDTO = {
    name: string;
    surname: string;
    displayName: string;
    birthday?: string;
  };

  export type Role = 'admin' | 'user';

  export type CurrentRoles = Role[];
}
