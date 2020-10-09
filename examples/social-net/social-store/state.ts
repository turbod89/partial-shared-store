import { State } from 'partially-shared-store';
import { FriendshipRequestModel, UserModel } from './models';

export interface SocialState extends State {
  users: {
    [uuid: string]: UserModel;
  };
  friendshipRequests: {
    from: Map<string, FriendshipRequestModel[]>;
    to: Map<string, FriendshipRequestModel[]>;
  };
}

export const createInitialState = (): SocialState => ({
  users: {},
  friendshipRequests: {
    from: new Map(),
    to: new Map(),
  },
});
