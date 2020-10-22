import { DeepReadonly } from 'partially-shared-store/definitions';
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
import { FriendshipRequestModel } from './models';
import { copyState, SocialState } from './state';
import { SocialStore } from './store';

export const addReducers = function (store: SocialStore) {
  store.createReducer(
    ActionTypes.CreateFriendshipRequest,
    (
      state: DeepReadonly<SocialState>,
      action: CreateFriendshipRequestAction,
    ): SocialState => {
      const newState = copyState(state);
      const from = newState.friendshipRequests.from;
      const to = newState.friendshipRequests.to;

      from[action.request.from.uuid] = from[action.request.from.uuid] || [];
      to[action.request.to.uuid] = to[action.request.to.uuid] || [];

      from[action.request.from.uuid].push(action.request.to.uuid);
      to[action.request.to.uuid].push(action.request.from.uuid);

      return newState;
    },
  );

  store.createReducer(
    ActionTypes.DeleteFriendshipRequest,
    (
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
      }

      if (to[action.request.to.uuid]) {
        const index = to[action.request.to.uuid].findIndex(
          (uuid) => uuid === action.request.from.uuid,
        );
        if (index >= 0) {
          to[action.request.to.uuid].splice(index, 1);
        }
      }

      return newState;
    },
  );

  store.createReducer(
    ActionTypes.AddFriend,
    (
      state: DeepReadonly<SocialState>,
      action: AddFriendAction,
    ): SocialState => {
      const newState = copyState(state);
      const fromUser = newState.users[action.request.from.uuid];
      const toUser = newState.users[action.request.to.uuid];

      fromUser.friends = fromUser.friends || new Set<string>();
      fromUser.friends.add(action.request.to.uuid);

      toUser.friends = toUser.friends || new Set<string>();
      toUser.friends.add(action.request.from.uuid);

      return newState;
    },
  );

  store.createReducer(
    ActionTypes.DeleteFriend,
    (
      state: DeepReadonly<SocialState>,
      action: DeleteFriendAction,
    ): SocialState => {
      const newState = copyState(state);
      const fromUser = newState.users[action.request.from.uuid];
      const toUser = newState.users[action.request.to.uuid];

      if (fromUser.friends) {
        fromUser.friends.delete(action.request.to.uuid);
      }

      if (toUser.friends) {
        toUser.friends.delete(action.request.from.uuid);
      }

      return newState;
    },
  );

  store.createReducer(
    [ActionTypes.CreateUser, ActionTypes.UpdateUser],
    (
      state: DeepReadonly<SocialState>,
      action: CreateUserAction | UpdateUserAction,
    ): SocialState => {
      const newState = copyState(state);
      newState.users[action.user.uuid] = action.user;
      return newState;
    },
  );

  store.createReducer(
    ActionTypes.DeleteUser,
    (
      state: DeepReadonly<SocialState>,
      action: DeleteUserAction,
    ): SocialState => {
      const newState = copyState(state);
      delete newState.users[action.user.uuid];
      return newState;
    },
  );
};
