import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel } from '../models';
import { SocialState } from '../state';
import { shadowUserModel } from './models';

export const shadowSocialState = (
  state: DeepReadonly<SocialState>,
  to: DeepReadonly<UserModel>,
): DeepReadonly<SocialState> => {
  //const friends = to.friends ? [...to.friends] : [];
  const users = Object.keys(state.users).reduce(
    (users: { [uuid: string]: DeepReadonly<UserModel> }, userUuid) => {
      users[userUuid] = shadowUserModel(state.users[userUuid], to);
      return users;
    },
    {
      [to.uuid]: to,
    },
  );
  const friendshipRequestsFrom: { [uuid: string]: string[] } = {};
  for (const uuid in state.friendshipRequests.from) {
    const toUuids = state.friendshipRequests.from[uuid];
    if (to.uuid === uuid) {
      friendshipRequestsFrom[uuid] = toUuids.slice();
    } else {
      const index = toUuids.findIndex((uuid) => to.uuid === uuid);
      if (index >= 0) {
        friendshipRequestsFrom[uuid] = [to.uuid];
      }
    }
  }
  const friendshipRequestsTo: { [uuid: string]: string[] } = {};
  for (const uuid in state.friendshipRequests.from) {
    const toUuids = state.friendshipRequests.from[uuid];
    if (to.uuid === uuid) {
      friendshipRequestsTo[uuid] = toUuids.slice();
    } else {
      const index = toUuids.findIndex((uuid) => to.uuid === uuid);
      if (index >= 0) {
        friendshipRequestsTo[uuid] = [to.uuid];
      }
    }
  }
  const friendshipRequests = {
    from: friendshipRequestsFrom,
    to: friendshipRequestsTo,
  };
  const newState = { users, friendshipRequests };
  return newState;
};
