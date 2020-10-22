import { DeepReadonly } from 'partially-shared-store/definitions';
import { FriendshipRequestModel, UserModel } from '../models';
import { SocialState } from '../state';
import {
  deserializeUnknownUser,
  SerializedUnknownUserModel,
  serializeUnknownUser,
} from './models';

export interface SerializedSocialState {
  users: SerializedUnknownUserModel[];
  friendshipRequests: {
    [uuid: string]: string[];
  };
}

export const serializeSocialState = (
  state: DeepReadonly<SocialState>,
): SerializedSocialState => {
  const users: SerializedUnknownUserModel[] = Object.keys(state.users)
    .map((key) => state.users[key])
    .map(serializeUnknownUser);
  const friendshipRequests: { [uuid: string]: string[] } = {};

  for (const uuid in state.friendshipRequests.from) {
    friendshipRequests[uuid] = state.friendshipRequests.from[uuid].slice();
  }

  return { users, friendshipRequests };
};

export const deserializeSocialState = (state: SerializedSocialState) => {
  const users = state.users.reduce<{ [uuid: string]: UserModel }>(
    (users, serializedUser) => {
      const user = deserializeUnknownUser(serializedUser);
      users[user.uuid] = user;
      return users;
    },
    {},
  );

  const frsFrom: { [uuid: string]: string[] } = {};
  const frsTo: { [uuid: string]: string[] } = {};

  for (const fromUuid in state.friendshipRequests) {
    state.friendshipRequests[fromUuid].forEach((toUuid) => {
      frsFrom[fromUuid] = frsFrom[fromUuid] || ([] as string[]);
      frsTo[toUuid] = frsTo[toUuid] || ([] as string[]);

      frsFrom[fromUuid].push(toUuid);
      frsTo[toUuid].push(fromUuid);
    });
  }

  const friendshipRequests = {
    from: frsFrom,
    to: frsTo,
  };

  return { users, friendshipRequests };
};
