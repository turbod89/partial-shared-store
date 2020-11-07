import * as User from 'user-store/actions';
import * as FriendshipRequest from './friendship-requests';

// export ActionTypes
export const ActionTypes = Object.assign(
  {},
  User.ActionTypes,
  FriendshipRequest.ActionTypes,
);
export type ActionTypes = typeof ActionTypes;

// export Action type
export type Action = User.Action | FriendshipRequest.Action;

// export isAction
export const isAction = (data: any): data is Action =>
  User.isAction(data) || FriendshipRequest.isAction(data);

// export actions
export { CreateUserAction, UpdateUserAction, DeleteUserAction } from './user';
export {
  CreateFriendshipRequestAction,
  DeleteFriendshipRequestAction,
  AddFriendAction,
  DeleteFriendAction,
} from './friendship-requests';
