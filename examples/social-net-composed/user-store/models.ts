import { createIdentity, Identity } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';

export enum UserModelStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export interface UserModel extends Identity {
  screenName: string;
  name?: string;
  status?: string;
  friends?: Set<string>;
  imageUrl?: string;
}

export const createUserModel = (): UserModel => ({
  ...createIdentity(),
  screenName: 'Guest',
});

export const copyUserModel = (user: DeepReadonly<UserModel>): UserModel => {
  const newUserModel: UserModel = {
    uuid: user.uuid,
    screenName: user.screenName,
  };
  if (user.name) {
    newUserModel.name = user.name;
  }
  if (user.status) {
    newUserModel.status = user.status;
  }
  if (user.friends) {
    newUserModel.friends = new Set<string>([...user.friends]);
  }
  if (user.imageUrl) {
    newUserModel.imageUrl = user.imageUrl;
  }
  return newUserModel;
};
