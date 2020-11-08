import { createIdentity, Identity } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';

export enum UserModelStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export interface UserModel extends Identity {
  screenName: string;
  name?: string;
  status?: UserModelStatus;
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
  if (user.imageUrl) {
    newUserModel.imageUrl = user.imageUrl;
  }
  return newUserModel;
};
