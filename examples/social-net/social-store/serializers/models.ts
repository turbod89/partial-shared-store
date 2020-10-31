import { DeepReadonly, Model } from 'partially-shared-store/definitions';
import { copyUserModel, FriendshipRequestModel, UserModel } from '../models';
import { SocialState } from '../state';

export type SerializedKnownUserModel = string;
export interface SerializedUnknownUserModel extends Model {
  screenName: string;
  name?: string;
  status?: string;
  friends?: string[];
}

export type SerializedUserModel =
  | SerializedKnownUserModel
  | SerializedUnknownUserModel;

export const serializeKnownUser = (
  user: DeepReadonly<UserModel>,
): SerializedKnownUserModel => user.uuid;
export const deserializeKnownUser = (
  userUuid: string,
  state: DeepReadonly<SocialState>,
): UserModel => copyUserModel(state.users[userUuid]);

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
  if (user.friends) {
    serializedUser.friends = [...user.friends] as string[];
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
  if (user.friends) {
    newUserModel.friends = new Set<string>(user.friends);
  }
  return newUserModel;
};

export const deserializeUser = (
  user: SerializedUserModel,
  state: DeepReadonly<SocialState>,
) =>
  typeof user === 'string'
    ? deserializeKnownUser(user, state)
    : deserializeUnknownUser(user);

export type SerializedFriendshipRequestModel = {
  from: string;
  to: string;
};

export const serializeFriendshipRequestModel = (
  fr: DeepReadonly<FriendshipRequestModel>,
): SerializedFriendshipRequestModel => ({
  from: fr.from.uuid,
  to: fr.to.uuid,
});

export const deserializeFriendshipRequestModel = (
  sfr: DeepReadonly<SerializedFriendshipRequestModel>,
  state: DeepReadonly<SocialState>,
): FriendshipRequestModel => {
  const from: UserModel = deserializeKnownUser(sfr.from, state);
  const to: UserModel = deserializeKnownUser(sfr.to, state);
  return { from, to };
};
