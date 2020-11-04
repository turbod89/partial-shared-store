import { State } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { copyUserModel, UserModel } from './models';

export interface SocialState extends State {
  users: {
    [uuid: string]: UserModel;
  };
  friendshipRequests: {
    from: { [uuid: string]: string[] };
    to: { [uuid: string]: string[] };
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

  const users: { [uuid: string]: UserModel } = {};
  for (const uuid in state.users) {
    users[uuid] = copyUserModel(state.users[uuid]);
  }

  return {
    users,
    friendshipRequests,
  };
};

export const createInitialState = (): SocialState => ({
  users: {},
  friendshipRequests: {
    from: {},
    to: {},
  },
});
