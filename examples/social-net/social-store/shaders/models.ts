import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel, copyUserModel, FriendshipRequestModel } from '../models';

export const shadowUserModel = (
  user: DeepReadonly<UserModel>,
  to: DeepReadonly<UserModel>,
): UserModel => {
  if (user.uuid === to.uuid || (user.friends && user.friends.has(to.uuid))) {
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
): FriendshipRequestModel => ({
  from: shadowUserModel(fr.from, to),
  to: shadowUserModel(fr.to, to),
});
