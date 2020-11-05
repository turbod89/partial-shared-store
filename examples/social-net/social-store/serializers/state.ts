import { DeepReadonly } from 'partially-shared-store/definitions';
import {
  deserializeUserState,
  serializeUserState,
  SerializedUserState,
} from 'user-store/serializers';
import { SocialState } from '../state';

export interface SerializedSocialState {
  users: SerializedUserState;
  friendshipRequests: {
    [uuid: string]: string[];
  };
  friendships: {
    [uuid: string]: string[];
  };
}

export const serializeSocialState = (
  state: DeepReadonly<SocialState>,
): SerializedSocialState => {
  const friendshipRequests: { [uuid: string]: string[] } = {};
  const friendships: { [uuid: string]: string[] } = {};

  for (const uuid in state.friendshipRequests.from) {
    friendshipRequests[uuid] = state.friendshipRequests.from[uuid].slice();
  }

  for (const uuid in state.friendships) {
    friendships[uuid] = [...state.friendships[uuid].values()];
  }

  return {
    users: serializeUserState(state.users),
    friendshipRequests,
    friendships,
  };
};

export const deserializeSocialState = (
  serializedState: DeepReadonly<SerializedSocialState>,
) => {
  const frsFrom: { [uuid: string]: string[] } = {};
  const frsTo: { [uuid: string]: string[] } = {};

  for (const fromUuid in serializedState.friendshipRequests) {
    serializedState.friendshipRequests[fromUuid].forEach((toUuid) => {
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

  const friendships: { [uuid: string]: Set<string> } = {};
  for (const uuid in serializedState.friendships) {
    friendships[uuid] = new Set(serializedState.friendships[uuid]);
  }

  return {
    users: deserializeUserState(serializedState.users),
    friendshipRequests,
    friendships,
  };
};
