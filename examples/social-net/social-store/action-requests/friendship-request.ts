import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { FriendshipRequestModel, UserModel } from '../models';

interface ActionRequestBase extends DefaultActionRequestBase {
  author: UserModel;
}

export enum ActionRequestTypes {
  ChangeOwnField = 'ChangeOwnField',
  RequestFriendship = 'RequestFriendship',
  AcceptFriendshipRequest = 'AcceptFriendshipRequest',
  DenyFriendshipRequest = 'DenyFriendshipRequest',
  CancelFriendshipRequest = 'CancelFriendshipRequest',
}

export enum ActionRequestChangeOwnFieldTypes {
  Name = 'Name',
  ScreenName = 'ScreenName',
  Status = 'Status',
}

export interface ChangeOwnFieldActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.ChangeOwnField;
  field: ActionRequestChangeOwnFieldTypes;
  value: string;
}

export interface RequestFriendshipActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.RequestFriendship;
  to: UserModel;
}

export interface AcceptFriendshipRequestActionRequest
  extends ActionRequestBase {
  type: ActionRequestTypes.AcceptFriendshipRequest;
  request: FriendshipRequestModel;
}

export interface DenyFriendshipRequestActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.DenyFriendshipRequest;
  request: FriendshipRequestModel;
}

export interface CancelFriendshipRequestActionRequest
  extends ActionRequestBase {
  type: ActionRequestTypes.CancelFriendshipRequest;
  request: FriendshipRequestModel;
}

export type ActionRequest =
  | ChangeOwnFieldActionRequest
  | RequestFriendshipActionRequest
  | AcceptFriendshipRequestActionRequest
  | DenyFriendshipRequestActionRequest
  | CancelFriendshipRequestActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
