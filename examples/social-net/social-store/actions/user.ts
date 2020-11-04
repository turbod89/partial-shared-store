import { Action as ActionBase } from 'partially-shared-store';
import { UserModel } from '../models';

export enum ActionTypes {
  CreateUser = 'CreateUser',
  UpdateUser = 'UpdateUser',
  DeleteUser = 'DeleteUser',
}

export interface CreateUserAction extends ActionBase {
  type: ActionTypes.CreateUser;
  user: UserModel;
  onlyTo?: UserModel[];
}

export interface UpdateUserAction extends ActionBase {
  type: ActionTypes.UpdateUser;
  user: UserModel;
  onlyTo?: UserModel[];
}

export interface DeleteUserAction extends ActionBase {
  type: ActionTypes.DeleteUser;
  user: UserModel;
  onlyTo?: UserModel[];
}

export type Action = CreateUserAction | UpdateUserAction | DeleteUserAction;

export const isAction = (data: any): data is Action =>
  'type' in data && data['type'] in ActionTypes;
