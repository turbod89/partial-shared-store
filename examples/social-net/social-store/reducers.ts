import { DeepReadonly } from 'partially-shared-store/definitions';
import {
  CreateUserReducer as CreateUserReducerBase,
  UpdateUserReducer as UpdateUserReducerBase,
  DeleteUserReducer as DeleteUserReducerBase,
} from 'user-store/reducers';
import {
  ActionTypes,
  AddFriendAction,
  CreateFriendshipRequestAction,
  CreateUserAction,
  DeleteFriendAction,
  DeleteFriendshipRequestAction,
  DeleteUserAction,
  UpdateUserAction,
} from './actions';
import { copyState, SocialState } from './state';
import { SocialStore } from './store';

export const CreateUserReducer = (
  state: DeepReadonly<SocialState>,
  action: CreateUserAction,
): SocialState => {
  const newState = copyState(state);
  newState.users = CreateUserReducerBase(state.users, action);
  return newState;
};

export const UpdateUserReducer = (
  state: DeepReadonly<SocialState>,
  action: UpdateUserAction,
): SocialState => {
  const newState = copyState(state);
  newState.users = UpdateUserReducerBase(state.users, action);
  return newState;
};

export const DeleteUserReducer = (
  state: DeepReadonly<SocialState>,
  action: DeleteUserAction,
): SocialState => {
  const newState = copyState(state);
  newState.users = DeleteUserReducerBase(state.users, action);
  return newState;
};

export const CreateFriendshipRequestReducer = (
  state: DeepReadonly<SocialState>,
  action: CreateFriendshipRequestAction,
): SocialState => {
  const newState = copyState(state);
  const from = newState.friendshipRequests.from;
  const to = newState.friendshipRequests.to;

  from[action.request.from.uuid] = from[action.request.from.uuid] || [];
  to[action.request.to.uuid] = to[action.request.to.uuid] || [];

  const fromExists =
    from[action.request.from.uuid].findIndex(
      (uuid) => uuid === action.request.to.uuid,
    ) >= 0;
  if (!fromExists) {
    from[action.request.from.uuid].push(action.request.to.uuid);
  }

  const toExists =
    to[action.request.to.uuid].findIndex(
      (uuid) => uuid === action.request.from.uuid,
    ) >= 0;
  if (!toExists) {
    to[action.request.to.uuid].push(action.request.from.uuid);
  }

  return newState;
};

export const DeleteFriendshipRequestReducer = (
  state: DeepReadonly<SocialState>,
  action: DeleteFriendshipRequestAction,
): SocialState => {
  const newState = copyState(state);
  const from = newState.friendshipRequests.from;
  const to = newState.friendshipRequests.to;

  if (from[action.request.from.uuid]) {
    const index = from[action.request.from.uuid].findIndex(
      (uuid) => uuid === action.request.to.uuid,
    );
    if (index >= 0) {
      from[action.request.from.uuid].splice(index, 1);
    }
    if (from[action.request.from.uuid].length === 0) {
      delete from[action.request.from.uuid];
    }
  }

  if (to[action.request.to.uuid]) {
    const index = to[action.request.to.uuid].findIndex(
      (uuid) => uuid === action.request.from.uuid,
    );
    if (index >= 0) {
      to[action.request.to.uuid].splice(index, 1);
    }
    if (to[action.request.to.uuid].length === 0) {
      delete to[action.request.to.uuid];
    }
  }

  return newState;
};

export const AddFriendReducer = (
  state: DeepReadonly<SocialState>,
  action: AddFriendAction,
): SocialState => {
  const newState = copyState(state);

  action.users.forEach((user, i) => {
    newState.friendships[user.uuid] =
      newState.friendships[user.uuid] || new Set<string>();
    newState.friendships[user.uuid].add(action.users[1 - i].uuid);
  });

  return newState;
};

export const DeleteFriendReducer = (
  state: DeepReadonly<SocialState>,
  action: DeleteFriendAction,
): SocialState => {
  const newState = copyState(state);

  action.users.forEach((user, i) => {
    if (newState.friendships[user.uuid]) {
      newState.friendships[user.uuid].delete(action.users[1 - i].uuid);
    }
  });

  return newState;
};

export const addReducers = function (store: SocialStore) {
  store.createReducer(ActionTypes.CreateUser, CreateUserReducer);
  store.createReducer(ActionTypes.UpdateUser, UpdateUserReducer);
  store.createReducer(ActionTypes.DeleteUser, DeleteUserReducer);

  store.createReducer(
    ActionTypes.CreateFriendshipRequest,
    CreateFriendshipRequestReducer,
  );

  store.createReducer(
    ActionTypes.DeleteFriendshipRequest,
    DeleteFriendshipRequestReducer,
  );

  store.createReducer(ActionTypes.AddFriend, AddFriendReducer);
  store.createReducer(ActionTypes.DeleteFriend, DeleteFriendReducer);
};
