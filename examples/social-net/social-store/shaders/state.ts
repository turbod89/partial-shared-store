import { DeepReadonly } from 'partially-shared-store/definitions';
import { copyFriendshipRequestModel, UserModel } from '../models';
import { SocialState } from '../state';
import { shadowFriendshipRequestModel, shadowUserModel } from './models';

export const shadowSocialState = (
  state: DeepReadonly<SocialState>,
  to: UserModel,
): DeepReadonly<SocialState> => {
  const friends = to.friends ? [...to.friends] : [];
  const users = friends.reduce(
    (users: { [uuid: string]: DeepReadonly<UserModel> }, friendUuid) => {
      users[friendUuid] = shadowUserModel(state.users[friendUuid], to);
      return users;
    },
    {
      [to.uuid]: to,
    },
  );
  const friendshipRequestsFrom = new Map().set(
    to.uuid,
    (state.friendshipRequests.from.get(to.uuid) || []).map((fr) =>
      shadowFriendshipRequestModel(fr, to),
    ),
  );
  const friendshipRequestsTo = new Map().set(
    to.uuid,
    (state.friendshipRequests.to.get(to.uuid) || []).map((fr) =>
      shadowFriendshipRequestModel(fr, to),
    ),
  );
  const friendshipRequests = {
    from: friendshipRequestsFrom,
    to: friendshipRequestsTo,
  };
  const newState = { users, friendshipRequests };
  return newState;
};
