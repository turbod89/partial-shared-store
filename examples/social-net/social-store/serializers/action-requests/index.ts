import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import * as User from 'user-store/serializers/action-requests';
import * as FriendshipRequest from './friendship-requests';
import { ActionRequest } from '../../action-requests';
import { isActionRequest as isUserActionRequest } from 'user-store/action-requests';
import { isActionRequest as isFriendshipRequestActionRequest } from '../../action-requests/friendship-request';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { SocialState } from '../../state';

export type SerializedActionRequest =
  | User.SerializedActionRequest
  | FriendshipRequest.SerializedActionRequest;

export const serializeActionRequest = (
  request: ActionRequest,
): SerializedActionRequest => {
  if (isUserActionRequest(request)) {
    return User.serializeActionRequest(request);
  } else if (isFriendshipRequestActionRequest(request)) {
    return FriendshipRequest.serializeActionRequest(request);
  }
  throw new PartiallySharedStoreError('Unknown action request type');
};

export const deserializeActionRequest = (
  request: SerializedActionRequest,
  state: DeepReadonly<SocialState>,
): ActionRequest => {
  if (User.isSerializedActionRequest(request)) {
    return User.deserializeActionRequest(request, state.users);
  } else if (FriendshipRequest.isSerializedActionRequest(request)) {
    return FriendshipRequest.deserializeActionRequest(request, state);
  }
  throw new PartiallySharedStoreError('Unknown action request type');
};

export const isSerializedActionRequest = (
  data: any,
): data is SerializedActionRequest =>
  User.isSerializedActionRequest(data) ||
  FriendshipRequest.isSerializedActionRequest(data);
