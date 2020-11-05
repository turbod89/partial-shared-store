import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserState } from '../state';
import {
  deserializeUnknownUser,
  SerializedUnknownUserModel,
  serializeUnknownUser,
} from './models';

export type SerializedUserState = SerializedUnknownUserModel[];

export const serializeUserState = (
  state: DeepReadonly<UserState>,
): SerializedUserState =>
  Object.keys(state)
    .map((key) => state[key])
    .map(serializeUnknownUser);

export const deserializeUserState = (
  serializedState: DeepReadonly<SerializedUserState>,
) =>
  serializedState.reduce<UserState>((users, serializedUser) => {
    const user = deserializeUnknownUser(serializedUser);
    users[user.uuid] = user;
    return users;
  }, {});
