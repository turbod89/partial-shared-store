import { State } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';
import {
  UserState,
  copyState as copyUserState,
  createInitialState as createInitialUserState,
} from 'user-store/state';

export interface SocialState extends State {
  users: UserState;
  friendshipRequests: {
    from: { [uuid: string]: string[] };
    to: { [uuid: string]: string[] };
  };
  friendships: {
    [uuid: string]: Set<string>;
  };
}

export const copyState = (state: DeepReadonly<SocialState>): SocialState => {
  const copyFRMMap = (
    map: DeepReadonly<{ [uuid: string]: string[] }>,
  ): { [uuid: string]: string[] } => {
    const newMap: { [uuid: string]: string[] } = {};
    for (const uuid in map) {
      newMap[uuid] = map[uuid].slice();
    }
    return newMap;
  };

  const friendshipRequests = {
    from: copyFRMMap(state.friendshipRequests.from),
    to: copyFRMMap(state.friendshipRequests.to),
  };

  const friendships: { [uuid: string]: Set<string> } = {};
  for (let uuid in state.friendships) {
    friendships[uuid] = new Set([...state.friendships[uuid].values()]);
  }

  return {
    users: copyUserState(state.users),
    friendshipRequests,
    friendships,
  };
};

export const createInitialState = (): SocialState => ({
  users: createInitialUserState(),
  friendshipRequests: {
    from: {},
    to: {},
  },
  friendships: {},
});
