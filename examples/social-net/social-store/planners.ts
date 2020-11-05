import { DeepReadonly } from 'partially-shared-store/definitions';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateOwnPlanner as UpdateOwnPlannerBase,
  ConnectUserPlanner as ConnectUserPlannerBase,
  DisconnectUserPlanner as DisconnectUserPlannerBase,
} from 'user-store/planners';
import {
  AcceptFriendshipRequestActionRequest,
  ActionRequestTypes,
  CancelFriendshipRequestActionRequest,
  ConnectUserActionRequest,
  DenyFriendshipRequestActionRequest,
  DisconnectUserActionRequest,
  RequestFriendshipActionRequest,
  UnfriendActionRequest,
  UpdateOwnActionRequest,
} from './action-requests';
import {
  ActionTypes,
  AddFriendAction,
  CreateFriendshipRequestAction,
  DeleteFriendAction,
  DeleteFriendshipRequestAction,
  UpdateUserAction,
} from './actions';
import { UserModel } from './models';
import { SocialState } from './state';
import { SocialStore } from './store';
import { getUserFriends } from './utils';

export const UpdateOwnPlanner = (
  state: DeepReadonly<SocialState>,
  request: UpdateOwnActionRequest,
) => UpdateOwnPlannerBase(state.users, request);

export const ConnectUserPlanner = (
  state: DeepReadonly<SocialState>,
  request: ConnectUserActionRequest,
) => ConnectUserPlannerBase(state.users, request);

export const DisconnectUserPlanner = (
  state: DeepReadonly<SocialState>,
  request: DisconnectUserActionRequest,
) => DisconnectUserPlannerBase(state.users, request);

export const RequestFriendshipPlanner = (
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
];

export const DenyFriendshipRequestPlanner = (
  state: DeepReadonly<SocialState>,
  request: DenyFriendshipRequestActionRequest,
): [DeleteFriendshipRequestAction] => {
  const fsRequest = {
    from: request.from,
    to: request.author,
  };
  return [
    {
      uuid: uuidv4(),
      type: ActionTypes.DeleteFriendshipRequest,
      request: fsRequest,
      onlyTo: [fsRequest.from, fsRequest.to],
    },
  ];
};

export const CancelFriendshipRequestPlanner = (
  state: DeepReadonly<SocialState>,
  request: CancelFriendshipRequestActionRequest,
): [DeleteFriendshipRequestAction] => {
  const fsRequest = {
    from: request.author,
    to: request.to,
  };
  return [
    {
      uuid: uuidv4(),
      type: ActionTypes.DeleteFriendshipRequest,
      request: fsRequest,
      onlyTo: [fsRequest.from, fsRequest.to],
    },
  ];
};

export const AcceptFriendshipRequestPlanner = (
  state: DeepReadonly<SocialState>,
  request: AcceptFriendshipRequestActionRequest,
): [
  AddFriendAction,
  DeleteFriendshipRequestAction,
  UpdateUserAction,
  UpdateUserAction,
] => {
  const users: [UserModel, UserModel] = [request.from, request.author];
  const fromFriends: UserModel[] = getUserFriends(request.from, state);
  const toFriends: UserModel[] = getUserFriends(request.author, state);
  return [
    {
      uuid: uuidv4(),
      type: ActionTypes.AddFriend,
      users,
      onlyTo: [...users, ...fromFriends, ...toFriends],
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.DeleteFriendshipRequest,
      request: {
        from: request.from,
        to: request.author,
      },
      onlyTo: users,
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.UpdateUser,
      user: users[0],
      onlyTo: [users[1]],
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.UpdateUser,
      user: users[1],
      onlyTo: [users[0]],
    },
  ];
};

export const UnfriendPlanner = (
  state: DeepReadonly<SocialState>,
  request: UnfriendActionRequest,
): [DeleteFriendAction, UpdateUserAction, UpdateUserAction] => {
  const users: [UserModel, UserModel] = [request.to, request.author];
  const fromFriends: UserModel[] = getUserFriends(request.author, state);
  const toFriends: UserModel[] = getUserFriends(request.to, state);
  return [
    {
      uuid: uuidv4(),
      type: ActionTypes.DeleteFriend,
      users,
      onlyTo: [...users, ...fromFriends, ...toFriends],
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.UpdateUser,
      user: users[0],
      onlyTo: [users[1]],
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.UpdateUser,
      user: users[1],
      onlyTo: [users[0]],
    },
  ];
};

export const addPlanners = function (store: SocialStore) {
  store.createPlanner(ActionRequestTypes.UpdateOwn, UpdateOwnPlanner);
  store.createPlanner(ActionRequestTypes.ConnectUser, ConnectUserPlanner);
  store.createPlanner(ActionRequestTypes.DisconnectUser, DisconnectUserPlanner);

  store.createPlanner(
    ActionRequestTypes.RequestFriendship,
    RequestFriendshipPlanner,
  );

  store.createPlanner(
    ActionRequestTypes.DenyFriendshipRequest,
    DenyFriendshipRequestPlanner,
  );

  store.createPlanner(
    ActionRequestTypes.CancelFriendshipRequest,
    CancelFriendshipRequestPlanner,
  );

  store.createPlanner(
    ActionRequestTypes.AcceptFriendshipRequest,
    AcceptFriendshipRequestPlanner,
  );

  store.createPlanner(ActionRequestTypes.Unfriend, UnfriendPlanner);
};
