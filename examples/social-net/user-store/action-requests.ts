import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { UserModel } from './models';

interface ActionRequestBase extends DefaultActionRequestBase {
  author: UserModel;
}

export enum ActionRequestTypes {
  UpdateOwn = 'UpdateOwn',
  ConnectUser = 'ConnectUser',
  DisconnectUser = 'DisconnectUser',
}

export enum ActionRequestUpdateOwnTypes {
  Name = 'Name',
  ScreenName = 'ScreenName',
  ImageUrl = 'ImageUrl',
}

export interface UpdateOwnActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.UpdateOwn;
  updates: {
    field: ActionRequestUpdateOwnTypes;
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
  | UpdateOwnActionRequest
  | ConnectUserActionRequest
  | DisconnectUserActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
