import {
  CreateUserAction as CreateUserActionBase,
  UpdateUserAction as UpdateUserActionBase,
  DeleteUserAction as DeleteUserActionBase,
} from 'user-store/actions';
import { UserModel } from 'user-store/models';

export interface CreateUserAction extends CreateUserActionBase {
  onlyTo?: UserModel[];
}

export interface UpdateUserAction extends UpdateUserActionBase {
  onlyTo?: UserModel[];
}

export interface DeleteUserAction extends DeleteUserActionBase {
  onlyTo?: UserModel[];
}
