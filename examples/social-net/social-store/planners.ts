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
import { copyUserModel, UserModel, UserModelStatus } from './models';
import { SocialState } from './state';
import { SocialStore } from './store';

export const addPlanners = function (store: SocialStore) {
  store.createPlanner(
    ActionRequestTypes.ChangeOwnField,
    (
      state: DeepReadonly<SocialState>,
      request: ChangeOwnFieldActionRequest,
    ): [UpdateUserAction] => {
      const friends: UserModel[] = Array.from(request.author.friends || [])
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      const action: UpdateUserAction = {
        uuid: uuidv4(),
        type: ActionTypes.UpdateUser,
        user: copyUserModel(request.author),
        //onlyTo: [request.author, ...friends],
      };
      request.updates.forEach(({ field, value }) => {
        if (field == ActionRequestChangeOwnFieldTypes.Name) {
          action.user.name = value;
        } else if (field == ActionRequestChangeOwnFieldTypes.Status) {
          action.user.status = value;
        } else if (field == ActionRequestChangeOwnFieldTypes.ScreenName) {
          action.user.screenName = value;
        }
      });
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
    ActionRequestTypes.ConnectUser,
    (
      state: DeepReadonly<SocialState>,
      request: DisconnectUserActionRequest,
    ): [CreateUserAction | UpdateUserAction] => {
      const friends: UserModel[] = Array.from(request.user.friends || [])
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);

      if (request.user.uuid in state.users) {
        const user = copyUserModel(state.users[request.user.uuid]);
        user.status = UserModelStatus.Connected;
        return [
          {
            uuid: uuidv4(),
            type: ActionTypes.UpdateUser,
            user,
            //onlyTo: [user, ...friends],
          },
        ];
      } else {
        const user: UserModel = {
          uuid: request.user.uuid,
          screenName: request.user.screenName,
          status: UserModelStatus.Connected,
        };
        if (request.user.name) {
          user.name = request.user.name;
        }
        return [
          {
            uuid: uuidv4(),
            type: ActionTypes.CreateUser,
            user,
            //onlyTo: [user, ...friends],
          },
        ];
      }
    },
  );

  store.createPlanner(
    ActionRequestTypes.DisconnectUser,
    (
      state: DeepReadonly<SocialState>,
      request: ConnectUserActionRequest,
    ): [UpdateUserAction] => {
      const friends: UserModel[] = Array.from(request.user.friends || [])
        .map((uuid: string) => state.users[uuid])
        .map(copyUserModel);
      const user = copyUserModel(state.users[request.user.uuid]);
      user.status = UserModelStatus.Disconnected;
      return [
        {
          uuid: uuidv4(),
          type: ActionTypes.UpdateUser,
          user,
          //onlyTo: [request.user, ...friends],
        },
      ];
    },
  );
};
