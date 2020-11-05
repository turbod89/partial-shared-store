import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { UserModel } from '../models';

interface ActionRequestBase extends DefaultActionRequestBase {
  author: UserModel;
}

export enum ActionRequestTypes {
  RequestFriendship = 'RequestFriendship',
  Unfriend = 'Unfriend',
  AcceptFriendshipRequest = 'AcceptFriendshipRequest',
  DenyFriendshipRequest = 'DenyFriendshipRequest',
  CancelFriendshipRequest = 'CancelFriendshipRequest',
}

export interface UnfriendActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Unfriend;
  to: UserModel;
}

export interface RequestFriendshipActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.RequestFriendship;
  to: UserModel;
}

export interface AcceptFriendshipRequestActionRequest
  extends ActionRequestBase {
  type: ActionRequestTypes.AcceptFriendshipRequest;
  from: UserModel;
}

export interface DenyFriendshipRequestActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.DenyFriendshipRequest;
  from: UserModel;
}

export interface CancelFriendshipRequestActionRequest
  extends ActionRequestBase {
  type: ActionRequestTypes.CancelFriendshipRequest;
  to: UserModel;
}

export type ActionRequest =
  | RequestFriendshipActionRequest
  | UnfriendActionRequest
  | AcceptFriendshipRequestActionRequest
  | DenyFriendshipRequestActionRequest
  | CancelFriendshipRequestActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
