import { DeepReadonly, Model } from 'partially-shared-store/definitions';
import { copyUserModel, UserModel, UserModelStatus } from '../models';
import { UserState } from '../state';

export type SerializedKnownUserModel = string;
export interface SerializedUnknownUserModel extends Model {
  screenName: string;
  name?: string;
  status?: UserModelStatus;
  friends?: string[];
  imageUrl?: string;
}

export type SerializedUserModel =
  | SerializedKnownUserModel
  | SerializedUnknownUserModel;

export const serializeKnownUser = (
  user: DeepReadonly<UserModel>,
): SerializedKnownUserModel => user.uuid;
export const deserializeKnownUser = (
  userUuid: string,
  state: DeepReadonly<UserState>,
): UserModel => copyUserModel(state[userUuid]);

export const serializeUnknownUser = (
  user: DeepReadonly<UserModel>,
): SerializedUnknownUserModel => {
  const serializedUser: SerializedUnknownUserModel = {
    uuid: user.uuid,
    screenName: user.screenName,
  };
  if (user.name) {
    serializedUser.name = user.name;
  }
  if (user.status) {
    serializedUser.status = user.status;
  }
  if (user.imageUrl) {
    serializedUser.imageUrl = user.imageUrl;
  }
  return serializedUser;
};
export const deserializeUnknownUser = (
  user: DeepReadonly<SerializedUnknownUserModel>,
) => {
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

export const deserializeUser = (
  user: SerializedUserModel,
  state: DeepReadonly<UserState>,
) =>
  typeof user === 'string'
    ? deserializeKnownUser(user, state)
    : deserializeUnknownUser(user);
