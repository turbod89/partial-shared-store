import { DeepReadonly } from 'partially-shared-store/definitions';
import { copyUserModel, UserModel } from '../models';
import { SocialState } from '../state';

export type SerializedUserModel = string | UserModel;

export const serializeKnownUser = (user: DeepReadonly<UserModel>): string =>
  user.uuid;
export const deserializeKnownUser = (
  userUuid: string,
  state: DeepReadonly<SocialState>,
): UserModel => copyUserModel(state.users[userUuid]);

export const serializeUnknownUser = (
  user: DeepReadonly<UserModel>,
): UserModel => copyUserModel(user);
export const deserializeUnknownUser = (user: UserModel) => user;

export const deserializeUser = (
  user: SerializedUserModel,
  state: DeepReadonly<SocialState>,
) =>
  typeof user === 'string'
    ? deserializeKnownUser(user, state)
    : deserializeUnknownUser(user);
