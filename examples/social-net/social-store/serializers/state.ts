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
}

export const serializeSocialState = (
  state: DeepReadonly<SocialState>,
): SerializedSocialState => {
  const friendshipRequests: { [uuid: string]: string[] } = {};

  for (const uuid in state.friendshipRequests.from) {
    friendshipRequests[uuid] = state.friendshipRequests.from[uuid].slice();
  }

  return { users: serializeUserState(state.users), friendshipRequests };
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

  return {
    users: deserializeUserState(serializedState.users),
    friendshipRequests,
  };
};
