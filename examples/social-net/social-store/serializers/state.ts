import { DeepReadonly } from 'partially-shared-store/definitions';
import { FriendshipRequestModel, UserModel } from '../models';
import { SocialState } from '../state';
import {
  deserializeUnknownUser,
  SerializedUnknownUserModel,
  serializeKnownUser,
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
): SerializedSocialState => ({
  users: Object.keys(state.users)
    .map((key) => state.users[key])
    .map(serializeUnknownUser),
  friendshipRequests: [...state.friendshipRequests.from.entries()].reduce(
    (friendshipRequests: { [uuid: string]: string[] }, [fromUuid, tos]) => {
      friendshipRequests[fromUuid] = tos.map((fr) => serializeKnownUser(fr.to));
      return friendshipRequests;
    },
    {},
  ),
});

export const deserializeSocialState = (state: SerializedSocialState) => {
  const users = state.users.reduce<{ [uuid: string]: UserModel }>(
    (users, serializedUser) => {
      const user = deserializeUnknownUser(serializedUser);
      users[user.uuid] = user;
      return users;
    },
    {},
  );

  const frsFrom = new Map<string, FriendshipRequestModel[]>();
  const frsTo = new Map<string, FriendshipRequestModel[]>();
  for (let fromUuid of Object.keys(state.friendshipRequests)) {
    const localFrs = state.friendshipRequests[fromUuid].map((toUuid) => ({
      from: users[fromUuid],
      to: users[toUuid],
    }));
    frsFrom.set(fromUuid, localFrs);
    localFrs.forEach((fr) => {
      const v = frsTo.get(fr.to.uuid) || [];
      v.push(fr);
      if (!frsTo.has(fr.to.uuid)) {
        frsTo.set(fr.to.uuid, v);
      }
    });
  }

  const friendshipRequests = {
    from: frsFrom,
    to: frsTo,
  };

  return { users, friendshipRequests };
};
