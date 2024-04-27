import { makeFakeSourceRes } from '../utils';

import type { UserNetworkSources } from './userNetworkSources';
import { userNetworkSources } from './userNetworkSources';
import type { UserNetworkSourcesDTO } from './dto';

export const userNetworkSourcesFaker = {
  makeRoles(
    roles: UserNetworkSourcesDTO.Role[] = ['user'],
  ): UserNetworkSourcesDTO.CurrentRoles {
    return roles;
  },
};

export const fakeUserNetworkSources: UserNetworkSources = {
  ...userNetworkSources,
  getRoles: async () => makeFakeSourceRes(userNetworkSourcesFaker.makeRoles()),
};
