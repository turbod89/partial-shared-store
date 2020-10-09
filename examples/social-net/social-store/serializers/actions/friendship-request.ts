import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  CreateFriendshipRequestAction,
  DeleteFriendshipRequestAction,
  AddFriendAction,
  DeleteFriendAction,
} from '../../actions';
import { Action, ActionTypes } from '../../actions/friendship-requests';
import { UserModel } from '../../models';
import { SocialState } from '../../state';
import {
  deserializeFriendshipRequestModel,
  SerializedFriendshipRequestModel,
  serializeFriendshipRequestModel,
  SerializedUserModel,
  serializeKnownUser,
  SerializedKnownUserModel,
  deserializeUser,
} from '../models';

export interface SerializedCreateFriendshipRequestAction {
  uuid: string;
  type: ActionTypes.CreateFriendshipRequest;
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
  type: ActionTypes.DeleteFriendshipRequest;
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
  type: ActionTypes.AddFriend;
  user: SerializedKnownUserModel;
}
export const serializeAddFriendAction = (
  action: AddFriendAction,
): SerializedAddFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  user: serializeKnownUser(action.user),
});
export const deserializeAddFriendAction = (
  action: SerializedAddFriendAction,
  state: DeepReadonly<SocialState>,
): AddFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  user: deserializeUser(action.user, state),
});

export interface SerializedDeleteFriendAction {
  uuid: string;
  type: ActionTypes.DeleteFriend;
  user: SerializedKnownUserModel;
}
export const serializeDeleteFriendAction = (
  action: DeleteFriendAction,
): SerializedDeleteFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  user: serializeKnownUser(action.user),
});
export const deserializeDeleteFriendAction = (
  action: SerializedDeleteFriendAction,
  state: DeepReadonly<SocialState>,
): DeleteFriendAction => ({
  uuid: action.uuid,
  type: action.type,
  user: deserializeUser(action.user, state),
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
  action: SerializedAction,
  state: DeepReadonly<SocialState>,
): Action => {
  switch (action.type) {
    case ActionTypes.CreateFriendshipRequest:
      return deserializeCreateFriendshipRequestAction(
        action as SerializedCreateFriendshipRequestAction,
        state,
      );
    case ActionTypes.DeleteFriendshipRequest:
      return deserializeDeleteFriendshipRequestAction(
        action as SerializedDeleteFriendshipRequestAction,
        state,
      );
    case ActionTypes.AddFriend:
      return deserializeAddFriendAction(
        action as SerializedAddFriendAction,
        state,
      );
    case ActionTypes.DeleteFriend:
      return deserializeDeleteFriendAction(
        action as SerializedDeleteFriendAction,
        state,
      );
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const isSerializedAction = (data: any): data is SerializedAction =>
  'type' in data && data['type'] in ActionTypes;
