import { faker } from '@example/shared';

import { makeFakeSourceRes } from '../utils';

import type { UserNetworkSources } from './userNetworkSources';
import { userNetworkSources } from './userNetworkSources';
import type { UserNetworkSourcesDTO } from './dto';

export const userNetworkSourcesFaker = {
  makeRoles(
    roles: UserNetworkSourcesDTO.CurrentRoles = ['user'],
  ): UserNetworkSourcesDTO.CurrentRoles {
    return roles;
  },
  makePersonInfo(
    data?: Partial<UserNetworkSourcesDTO.PersonDTO>,
  ): UserNetworkSourcesDTO.PersonDTO {
    return {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      displayName: faker.internet.userName(),
      birthday: faker.date.birthdate().toISOString(),
      ...data,
    };
  },
};

export const fakeUserNetworkSources: UserNetworkSources = {
  ...userNetworkSources,
  getRoles: async () => makeFakeSourceRes(userNetworkSourcesFaker.makeRoles()),
};
