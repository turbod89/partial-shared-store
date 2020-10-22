import { DeepReadonly } from 'partially-shared-store/definitions';
import { v4 as uuidv4 } from 'uuid';
import {
  AcceptFriendshipRequestActionRequest,
  ActionRequestChangeOwnFieldTypes,
  ActionRequestTypes,
  ChangeOwnFieldActionRequest,
  ConnectUserActionRequest,
  DenyFriendshipRequestActionRequest,
  DisconnectUserActionRequest,
  RequestFriendshipActionRequest,
} from './action-requests';
import {
  ActionTypes,
  AddFriendAction,
  CreateFriendshipRequestAction,
  CreateUserAction,
  DeleteFriendshipRequestAction,
  DeleteUserAction,
  UpdateUserAction,
} from './actions';
import { copyUserModel, UserModel } from './models';
import { SocialState } from './state';
import { SocialStore } from './store';

export const addPlanners = function (store: SocialStore) {
  store.createPlanner(
    ActionRequestTypes.ChangeOwnField,
    (
      state: DeepReadonly<SocialState>,
      request: ChangeOwnFieldActionRequest,
    ): [UpdateUserAction] => {
      const action: UpdateUserAction = {
        uuid: uuidv4(),
        type: ActionTypes.UpdateUser,
        user: copyUserModel(request.author),
      };
      if (request.field == ActionRequestChangeOwnFieldTypes.Name) {
        action.user.name = request.value;
      } else if (request.field == ActionRequestChangeOwnFieldTypes.Status) {
        action.user.status = request.value;
      } else if (request.field == ActionRequestChangeOwnFieldTypes.ScreenName) {
        action.user.screenName = request.value;
      }
      return [action];
    },
  );

  store.createPlanner(
    ActionRequestTypes.RequestFriendship,
    (
      state: DeepReadonly<SocialState>,
      request: RequestFriendshipActionRequest,
    ): [CreateFriendshipRequestAction] => [
      {
        uuid: uuidv4(),
        type: ActionTypes.CreateFriendshipRequest,
        request: {
          from: request.author,
          to: request.to,
        },
        onlyTo: [request.author, request.to],
      },
    ],
  );

  store.createPlanner(
    [
      ActionRequestTypes.DenyFriendshipRequest,
      ActionRequestTypes.CancelFriendshipRequest,
    ],
    (
      state: DeepReadonly<SocialState>,
      request: DenyFriendshipRequestActionRequest,
    ): [DeleteFriendshipRequestAction] => [
      {
        uuid: uuidv4(),
        type: ActionTypes.DeleteFriendshipRequest,
        request: request.request,
        onlyTo: [request.request.from, request.request.to],
      },
    ],
  );

  store.createPlanner(
    ActionRequestTypes.AcceptFriendshipRequest,
    (
      state: DeepReadonly<SocialState>,
      request: AcceptFriendshipRequestActionRequest,
    ): [AddFriendAction, DeleteFriendshipRequestAction] => {
      const fromFriends: UserModel[] = Array.from(
        request.request.from.friends || [],
      )
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      const toFriends: UserModel[] = Array.from(
        request.request.to.friends || [],
      )
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      return [
        {
          uuid: uuidv4(),
          type: ActionTypes.AddFriend,
          request: request.request,
          onlyTo: [
            request.request.from,
            request.request.to,
            ...fromFriends,
            ...toFriends,
          ],
        },
        {
          uuid: uuidv4(),
          type: ActionTypes.DeleteFriendshipRequest,
          request: request.request,
          onlyTo: [request.request.from, request.request.to],
        },
      ];
    },
  );

  store.createPlanner(
    ActionRequestTypes.DisconnectUser,
    (
      state: DeepReadonly<SocialState>,
      request: DisconnectUserActionRequest,
    ): [CreateUserAction] => {
      const friends: UserModel[] = Array.from(request.user.friends || [])
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      return [
        {
          uuid: uuidv4(),
          type: ActionTypes.CreateUser,
          user: request.user,
          onlyTo: [request.user, ...friends],
        },
      ];
    },
  );

  store.createPlanner(
    ActionRequestTypes.ConnectUser,
    (
      state: DeepReadonly<SocialState>,
      request: ConnectUserActionRequest,
    ): [DeleteUserAction] => {
      const friends: UserModel[] = Array.from(request.user.friends || [])
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      return [
        {
          uuid: uuidv4(),
          type: ActionTypes.DeleteUser,
          user: request.user,
          onlyTo: [request.user, ...friends],
        },
      ];
    },
  );
};
