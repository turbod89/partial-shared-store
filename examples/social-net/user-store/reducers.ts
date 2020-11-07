import { DeepReadonly } from 'partially-shared-store/definitions';
import {
  ActionTypes,
  CreateUserAction,
  DeleteUserAction,
  UpdateUserAction,
} from './actions';
import { UserModel } from './models';
import { copyState, UserState } from './state';
import { UserStore } from './store';

const setUser = (state: UserState, user: UserModel): UserState => {
  state[user.uuid] = user;
  return state;
};

export const CreateUserReducer = (
  state: DeepReadonly<UserState>,
  action: CreateUserAction,
): UserState => setUser(copyState(state), action.user);

export const UpdateUserReducer = (
  state: DeepReadonly<UserState>,
  action: UpdateUserAction,
): UserState => setUser(copyState(state), action.user);

export const DeleteUserReducer = (
  state: DeepReadonly<UserState>,
  action: DeleteUserAction,
): UserState => {
  const newState = copyState(state);
  delete newState[action.user.uuid];
  return newState;
};

export const addReducers = function (store: UserStore) {
  store.createReducer(ActionTypes.CreateUser, CreateUserReducer);
  store.createReducer(ActionTypes.UpdateUser, UpdateUserReducer);
  store.createReducer(ActionTypes.DeleteUser, DeleteUserReducer);
};
