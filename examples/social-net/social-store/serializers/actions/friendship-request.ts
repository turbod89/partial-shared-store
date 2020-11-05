import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import { serializeKnownUser } from 'user-store/serializers';
import {
  CreateFriendshipRequestAction,
  DeleteFriendshipRequestAction,
  AddFriendAction,
  DeleteFriendAction,
} from '../../actions';
import { Action, ActionTypes } from '../../actions';
import { SocialState } from '../../state';
import { UserModel } from '../../models';
import {
  deserializeFriendshipRequestModel,
  deserializeUser,
  SerializedFriendshipRequestModel,
  SerializedUserModel,
  serializeFriendshipRequestModel,
} from '../models';

export interface SerializedCreateFriendshipRequestAction {
  uuid: string;
  type: ActionTypes['CreateFriendshipRequest'];
  request: SerializedFriendshipRequestModel;
}
export const serializeCreateFriendshipRequestAction = (
  action: CreateFriendshipRequestAction,
): SerializedCreateFriendshipRequestAction => ({
  uuid: action.uuid,
  type: action.type,
  request: serializeFriendshipRequestModel(action.request),
});
export const deserializeCreateFriendshipRequestAction = (
  action: SerializedCreateFriendshipRequestAction,
  state: DeepReadonly<SocialState>,
): CreateFriendshipRequestAction => ({
  uuid: action.uuid,
  type: action.type,
  request: deserializeFriendshipRequestModel(action.request, state),
});

export interface SerializedDeleteFriendshipRequestAction {
  uuid: string;
  type: ActionTypes['DeleteFriendshipRequest'];
  request: SerializedFriendshipRequestModel;
}
export const serializeDeleteFriendshipRequestAction = (
  action: DeleteFriendshipRequestAction,
): SerializedDeleteFriendshipRequestAction => ({
  uuid: action.uuid,
  type: action.type,
  request: serializeFriendshipRequestModel(action.request),
});
export const deserializeDeleteFriendshipRequestAction = (
  action: SerializedDeleteFriendshipRequestAction,
  state: DeepReadonly<SocialState>,
): DeleteFriendshipRequestAction => ({
  uuid: action.uuid,
  type: action.type,
  request: deserializeFriendshipRequestModel(action.request, state),
});

export interface SerializedAddFriendAction {
  uuid: string;
  type: ActionTypes['AddFriend'];
  users: [SerializedUserModel, SerializedUserModel];
}
export const serializeAddFriendAction = (
  action: AddFriendAction,
): SerializedAddFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  users: action.users.map(serializeKnownUser) as [
    SerializedUserModel,
    SerializedUserModel,
  ],
});
export const deserializeAddFriendAction = (
  action: SerializedAddFriendAction,
  state: DeepReadonly<SocialState>,
): AddFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  users: action.users.map((user) => deserializeUser(user, state.users)) as [
    UserModel,
    UserModel,
  ],
});

export interface SerializedDeleteFriendAction {
  uuid: string;
  type: ActionTypes['DeleteFriend'];
  users: [SerializedUserModel, SerializedUserModel];
}
export const serializeDeleteFriendAction = (
  action: DeleteFriendAction,
): SerializedDeleteFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  users: action.users.map(serializeKnownUser) as [
    SerializedUserModel,
    SerializedUserModel,
  ],
});
export const deserializeDeleteFriendAction = (
  action: SerializedDeleteFriendAction,
  state: DeepReadonly<SocialState>,
): DeleteFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  users: action.users.map((user) => deserializeUser(user, state.users)) as [
    UserModel,
    UserModel,
  ],
});

export type SerializedAction =
  | SerializedCreateFriendshipRequestAction
  | SerializedDeleteFriendshipRequestAction
  | SerializedAddFriendAction
  | SerializedDeleteFriendAction;

export const serializeAction = (action: Action): SerializedAction => {
  switch (action.type) {
    case ActionTypes.CreateFriendshipRequest:
      return serializeCreateFriendshipRequestAction(
        action as CreateFriendshipRequestAction,
      );
    case ActionTypes.DeleteFriendshipRequest:
      return serializeDeleteFriendshipRequestAction(
        action as DeleteFriendshipRequestAction,
      );
    case ActionTypes.AddFriend:
      return serializeAddFriendAction(action as AddFriendAction);
    case ActionTypes.DeleteFriend:
      return serializeDeleteFriendAction(action as DeleteFriendAction);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const deserializeAction = (
  serializedAction: SerializedAction,
  state: DeepReadonly<SocialState>,
): Action => {
  switch (serializedAction.type) {
    case ActionTypes.CreateFriendshipRequest:
      return deserializeCreateFriendshipRequestAction(
        serializedAction as SerializedCreateFriendshipRequestAction,
        state,
      );
    case ActionTypes.DeleteFriendshipRequest:
      return deserializeDeleteFriendshipRequestAction(
        serializedAction as SerializedDeleteFriendshipRequestAction,
        state,
      );
    case ActionTypes.AddFriend:
      return deserializeAddFriendAction(
        serializedAction as SerializedAddFriendAction,
        state,
      );
    case ActionTypes.DeleteFriend:
      return deserializeDeleteFriendAction(
        serializedAction as SerializedDeleteFriendAction,
        state,
      );
  }
};

export const isSerializedAction = (data: any): data is SerializedAction =>
  'type' in data && data['type'] in ActionTypes;
