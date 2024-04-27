import { makeAutoObservable } from 'mobx';

import type { UserRepository } from '@example/data';
import { UserRepositoryDTO, userRepository } from '@example/data';

import type { Permission } from '../types';
import { createPermission } from '../utils';

import { AdministrationPermissionsReason } from './enums';

export class AdministrationPermissionsStore {
  constructor(private readonly userRepo: UserRepository) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get userRolesQuery() {
    return this.userRepo.getRolesQuery();
  }

  public prepareData = async (): Promise<void> => {
    await Promise.all([this.userRolesQuery.async()]);
  };

  public get administrationActions(): Permission {
    return createPermission(this.userRolesQuery.isSuccess, () => {
      if (this.userRolesQuery.data?.includes(UserRepositoryDTO.Role.Admin)) {
        return { isAllowed: true };
      }

      return {
        isAllowed: false,
        reasons: [
          {
            id: AdministrationPermissionsReason.NoAdmin,
            advice: 'Функционал доступен только администратору',
          },
        ],
      };
    });
  }
}

export const createAdministrationPermissionsStore = () =>
  new AdministrationPermissionsStore(userRepository);
