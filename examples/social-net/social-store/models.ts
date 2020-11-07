import { DeepReadonly } from 'partially-shared-store/definitions';
import { copyUserModel, UserModel } from 'user-store/models';

export * from 'user-store/models';

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
