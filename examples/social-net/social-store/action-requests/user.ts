import { ActionRequest as DefaultActionRequestBase } from 'partially-shared-store';
import { UserModel } from '../models';

interface ActionRequestBase extends DefaultActionRequestBase {
  author: UserModel;
}

export enum ActionRequestTypes {
  ConnectUser = 'ConnectUser',
  DisconnectUser = 'DisconnectUser',
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
  | ConnectUserActionRequest
  | DisconnectUserActionRequest;

export const isActionRequest = (data: any): data is ActionRequest =>
  'type' in data && data.type in ActionRequestTypes;
