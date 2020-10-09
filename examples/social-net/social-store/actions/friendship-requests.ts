import { Action as ActionBase } from 'partially-shared-store';
import { FriendshipRequestModel, UserModel } from '../models';

export enum ActionTypes {
  CreateFriendshipRequest = 'CreateFriendshipRequest',
  DeleteFriendshipRequest = 'DeleteFriendshipRequest',
  AddFriend = 'AddFriend',
  DeleteFriend = 'DeleteFriend',
}

export interface CreateFriendshipRequestAction extends ActionBase {
  type: ActionTypes.CreateFriendshipRequest;
  request: FriendshipRequestModel;
  onlyTo?: UserModel[];
}

export interface DeleteFriendshipRequestAction extends ActionBase {
  type: ActionTypes.DeleteFriendshipRequest;
  request: FriendshipRequestModel;
  onlyTo?: UserModel[];
}

export interface AddFriendAction extends ActionBase {
  type: ActionTypes.AddFriend;
  user: UserModel;
  onlyTo?: UserModel[];
}

export interface DeleteFriendAction extends ActionBase {
  type: ActionTypes.DeleteFriend;
  user: UserModel;
  onlyTo?: UserModel[];
}

export type Action =
  | CreateFriendshipRequestAction
  | DeleteFriendshipRequestAction
  | AddFriendAction
  | DeleteFriendAction;

export const isAction = (data: any): data is Action =>
  'type' in data && data['type'] in ActionTypes;
