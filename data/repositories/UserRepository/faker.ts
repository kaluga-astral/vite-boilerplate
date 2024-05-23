import { userNetworkSourcesFaker } from '../../sources';

import type { UserRepositoryDTO } from './dto';

export const userRepositoryFaker = {
  makeRoles(
    data?: UserRepositoryDTO.CurrentRoles,
  ): UserRepositoryDTO.CurrentRoles {
    return {
      isAdmin: false,
      ...data,
    };
  },
  makePersonInfo(
    data?: Partial<UserRepositoryDTO.UserPersonDTO>,
  ): UserRepositoryDTO.UserPersonDTO {
    return userNetworkSourcesFaker.makePersonInfo(data);
  },
};
