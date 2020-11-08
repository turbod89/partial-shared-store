import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel } from '../models';
import { SocialState } from '../state';
import { shadowUserModel } from './models';

export const shadowSocialState = (
  state: DeepReadonly<SocialState>,
  to: DeepReadonly<UserModel>,
): DeepReadonly<SocialState> => {
  const users = Object.keys(state.users).reduce(
    (users: { [uuid: string]: DeepReadonly<UserModel> }, userUuid) => {
      users[userUuid] = shadowUserModel(state.users[userUuid], to, state);
      return users;
    },
    {},
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

  const friendUuids: DeepReadonly<Set<string>> =
    state.friendships[to.uuid] || new Set<string>();
  const friendships = [...friendUuids.values()].reduce(
    (fs, uuid) => {
      fs[uuid] = state.friendships[uuid];
      return fs;
    },
    {
      [to.uuid]: friendUuids,
    },
  );

  const newState = { users, friendshipRequests, friendships };
  return newState;
};
