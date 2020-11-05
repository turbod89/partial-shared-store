import * as FriendshipRequest from './friendship-request';
import * as User from './user';

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
  ChangeOwnFieldActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from './user';

// export specific
export { ActionRequestChangeOwnFieldTypes } from './user';
