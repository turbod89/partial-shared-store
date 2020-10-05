import * as User from './user';
import * as FriendshipRequest from './friendship-request';
import { Action } from '../../actions';
import { isAction as isUserAction } from '../../actions/user';
import { isAction as isFriendshipRequestAction } from '../../actions/friendship-requests';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { SocialState } from '../../state';

export type SerializedAction =
  | User.SerializedAction
  | FriendshipRequest.SerializedAction;

export const serializeAction = (action: Action): SerializedAction => {
  if (isUserAction(action)) {
    return User.serializeAction(action);
  } else if (isFriendshipRequestAction(action)) {
    return FriendshipRequest.serializeAction(action);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const deserializeAction = (
  action: SerializedAction,
  state: DeepReadonly<SocialState>,
): Action => {
  if (User.isSerializedAction(action)) {
    return User.deserializeAction(action, state);
  } else if (FriendshipRequest.isSerializedAction(action)) {
    return FriendshipRequest.deserializeAction(action, state);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const isSerializedAction = (data: any): data is SerializedAction =>
  User.isSerializedAction(data) || FriendshipRequest.isSerializedAction(data);
