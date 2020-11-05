import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { UserModel } from '../models';

interface ActionRequestBase extends DefaultActionRequestBase {
  author: UserModel;
}

export enum ActionRequestTypes {
  ChangeOwnField = 'ChangeOwnField',
  ConnectUser = 'ConnectUser',
  DisconnectUser = 'DisconnectUser',
}

export enum ActionRequestChangeOwnFieldTypes {
  Name = 'Name',
  ScreenName = 'ScreenName',
  ImageUrl = 'ImageUrl',
}

export interface ChangeOwnFieldActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.ChangeOwnField;
  updates: {
    field: ActionRequestChangeOwnFieldTypes;
    value: string;
  }[];
}

export interface ConnectUserActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.ConnectUser;
  user: UserModel;
}

export interface DisconnectUserActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.DisconnectUser;
  user: UserModel;
}

export type ActionRequest =
  | ChangeOwnFieldActionRequest
  | ConnectUserActionRequest
  | DisconnectUserActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
