import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel, copyUserModel, FriendshipRequestModel } from '../models';
import { SocialState } from '../state';
import { hasUserFriend } from '../utils';

export const shadowUserModel = (
  user: DeepReadonly<UserModel>,
  to: DeepReadonly<UserModel>,
  state: DeepReadonly<SocialState>,
): UserModel => {
  if (user.uuid === to.uuid || hasUserFriend(to.uuid, user.uuid, state)) {
    return copyUserModel(user);
  }
  return {
    uuid: user.uuid,
    screenName: user.screenName,
  };
};

export const shadowFriendshipRequestModel = (
  fr: DeepReadonly<FriendshipRequestModel>,
  to: DeepReadonly<UserModel>,
  state: DeepReadonly<SocialState>,
): FriendshipRequestModel => ({
  from: shadowUserModel(fr.from, to, state),
  to: shadowUserModel(fr.to, to, state),
});
