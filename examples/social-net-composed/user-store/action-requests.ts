import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { UserModel } from './models';

export enum ActionRequestTypes {
  UpdateField = 'UpdateField',
  ConnectUser = 'ConnectUser',
  DisconnectUser = 'DisconnectUser',
}

export enum ActionRequestUpdateFieldTypes {
  Name = 'Name',
  ScreenName = 'ScreenName',
  ImageUrl = 'ImageUrl',
}

export interface UpdateFieldActionRequest extends DefaultActionRequestBase {
  type: ActionRequestTypes.UpdateField;
  updates: {
    field: ActionRequestUpdateFieldTypes;
    value: string;
  }[];
}

export interface ConnectUserActionRequest extends DefaultActionRequestBase {
  type: ActionRequestTypes.ConnectUser;
  user: UserModel;
}

export interface DisconnectUserActionRequest extends DefaultActionRequestBase {
  type: ActionRequestTypes.DisconnectUser;
  user: UserModel;
}

export type ActionRequest =
  | UpdateFieldActionRequest
  | ConnectUserActionRequest
  | DisconnectUserActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
