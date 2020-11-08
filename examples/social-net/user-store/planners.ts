import { DeepReadonly } from 'partially-shared-store/definitions';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionRequestUpdateOwnTypes,
  ActionRequestTypes,
  UpdateOwnActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from './action-requests';
import { ActionTypes, CreateUserAction, UpdateUserAction } from './actions';
import { copyUserModel, UserModel, UserModelStatus } from './models';
import { UserState } from './state';
import { UserStore } from './store';

export const UpdateOwnPlanner = (
  state: DeepReadonly<UserState>,
  request: UpdateOwnActionRequest,
): [UpdateUserAction] => {
  const action: UpdateUserAction = {
    uuid: uuidv4(),
    type: ActionTypes.UpdateUser,
    user: copyUserModel(request.author),
  };
  request.updates.forEach(({ field, value }) => {
    if (field == ActionRequestUpdateOwnTypes.Name) {
      action.user.name = value;
    } else if (field == ActionRequestUpdateOwnTypes.ImageUrl) {
      action.user.imageUrl = value;
    } else if (field == ActionRequestUpdateOwnTypes.ScreenName) {
      action.user.screenName = value;
    }
  });
  return [action];
};

export const ConnectUserPlanner = (
  state: DeepReadonly<UserState>,
  request: ConnectUserActionRequest,
): [CreateUserAction | UpdateUserAction] => {
  if (request.user.uuid in state) {
    const user = copyUserModel(state[request.user.uuid]);
    user.status = UserModelStatus.Connected;
    return [
      {
        uuid: uuidv4(),
        type: ActionTypes.UpdateUser,
        user,
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
      },
    ];
  }
};

export const DisconnectUserPlanner = (
  state: DeepReadonly<UserState>,
  request: DisconnectUserActionRequest,
): [UpdateUserAction] => {
  const user = copyUserModel(state[request.user.uuid]);
  user.status = UserModelStatus.Disconnected;
  return [
    {
      uuid: uuidv4(),
      type: ActionTypes.UpdateUser,
      user,
    },
  ];
};

export const addPlanners = function (store: UserStore) {
  store.createPlanner(ActionRequestTypes.UpdateOwn, UpdateOwnPlanner);
  store.createPlanner(ActionRequestTypes.ConnectUser, ConnectUserPlanner);
  store.createPlanner(ActionRequestTypes.DisconnectUser, DisconnectUserPlanner);
};
