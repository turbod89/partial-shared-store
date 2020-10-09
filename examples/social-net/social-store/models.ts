import { Identity } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';

export interface UserModel extends Identity {
  screenName: string;
  name?: string;
  status?: string;
  friends?: Set<string>;
}

export const copyUserModel = (user: DeepReadonly<UserModel>): UserModel => {
  const newUserModel: UserModel = {
    uuid: user.uuid,
    screenName: user.screenName,
  };
  if (user.name) {
    newUserModel.name = user.name;
  }
  if (user.status) {
    newUserModel.status = user.status;
  }
  if (user.friends) {
    newUserModel.friends = new Set<string>([...user.friends]);
  }
  return newUserModel;
};

export interface FriendshipRequestModel {
  from: UserModel;
  to: UserModel;
}

export const copyFriendshipRequestModel = (
  friendshipRequest: DeepReadonly<FriendshipRequestModel>,
): FriendshipRequestModel => ({
  from: copyUserModel(friendshipRequest.from),
  to: copyUserModel(friendshipRequest.to),
});
