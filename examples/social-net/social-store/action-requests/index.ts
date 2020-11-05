import * as FriendshipRequest from './friendship-request';
import * as User from 'user-store/action-requests';

// merge action request types
export const ActionRequestTypes = Object.assign(
  {},
  FriendshipRequest.ActionRequestTypes,
  User.ActionRequestTypes,
);

// merge action request type
export type ActionRequest =
  | FriendshipRequest.ActionRequest
  | User.ActionRequest;

// merge data is action
export const isActionRequest = (data: any): data is ActionRequest =>
  FriendshipRequest.isActionRequest(data) || User.isActionRequest(data);

// export action requests
export {
  RequestFriendshipActionRequest,
  UnfriendActionRequest,
  AcceptFriendshipRequestActionRequest,
  DenyFriendshipRequestActionRequest,
  CancelFriendshipRequestActionRequest,
} from './friendship-request';

export {
  UpdateOwnActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from 'user-store/action-requests';

// export specific
export { ActionRequestUpdateOwnTypes } from 'user-store/action-requests';
