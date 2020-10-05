import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel } from '../models';
import { SocialState } from '../state';

export const shadowSocialState = (
  state: DeepReadonly<SocialState>,
  to: UserModel,
): DeepReadonly<SocialState> => {
  const users = [...to.friends.values()].reduce(
    (users: { [uuid: string]: DeepReadonly<UserModel> }, friendUuid) => {
      users[friendUuid] = state.users[friendUuid];
      return users;
    },
    {
      [to.uuid]: to,
    },
  );
  const newState = { users };
  return newState;
};
