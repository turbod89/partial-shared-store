import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  CreateUserAction,
  DeleteUserAction,
  UpdateUserAction,
} from '../../actions';
import { Action, ActionTypes } from '../../actions/user';
import { SocialState } from '../../state';
import {
  deserializeUser,
  SerializedKnownUserModel,
  SerializedUnknownUserModel,
  serializeKnownUser,
  serializeUnknownUser,
} from '../models';

export interface SerializedCreateUserAction {
  uuid: string;
  type: ActionTypes.CreateUser;
  user: SerializedUnknownUserModel;
}
export const serializeCreateUserAction = (
  action: CreateUserAction,
): SerializedCreateUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: serializeUnknownUser(action.user),
});
export const deserializeCreateUserAction = (
  action: SerializedCreateUserAction,
  state: DeepReadonly<SocialState>,
): CreateUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: deserializeUser(action.user, state),
});

export interface SerializedUpdateUserAction {
  uuid: string;
  type: ActionTypes.UpdateUser;
  user: SerializedUnknownUserModel;
}
export const serializeUpdateUserAction = (
  action: UpdateUserAction,
): SerializedUpdateUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: serializeUnknownUser(action.user),
});
export const deserializeUpdateUserAction = (
  action: SerializedUpdateUserAction,
  state: DeepReadonly<SocialState>,
): UpdateUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: deserializeUser(action.user, state),
});

export interface SerializedDeleteUserAction {
  uuid: string;
  type: ActionTypes.DeleteUser;
  user: SerializedKnownUserModel;
}
export const serializeDeleteUserAction = (
  action: DeleteUserAction,
): SerializedDeleteUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: serializeKnownUser(action.user),
});
export const deserializeDeleteUserAction = (
  action: SerializedDeleteUserAction,
  state: DeepReadonly<SocialState>,
): DeleteUserAction => ({
  uuid: action.uuid,
  type: action.type,
  user: deserializeUser(action.user, state),
});

export type SerializedAction =
  | SerializedCreateUserAction
  | SerializedUpdateUserAction
  | SerializedDeleteUserAction;

export const serializeAction = (action: Action): SerializedAction => {
  switch (action.type) {
    case ActionTypes.CreateUser:
      return serializeCreateUserAction(action as CreateUserAction);
    case ActionTypes.UpdateUser:
      return serializeUpdateUserAction(action as UpdateUserAction);
    case ActionTypes.DeleteUser:
      return serializeDeleteUserAction(action as DeleteUserAction);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const deserializeAction = (
  action: SerializedAction,
  state: DeepReadonly<SocialState>,
): Action => {
  switch (action.type) {
    case ActionTypes.CreateUser:
      return deserializeCreateUserAction(
        action as SerializedCreateUserAction,
        state,
      );
    case ActionTypes.UpdateUser:
      return deserializeUpdateUserAction(
        action as SerializedUpdateUserAction,
        state,
      );
    case ActionTypes.DeleteUser:
      return deserializeDeleteUserAction(
        action as SerializedDeleteUserAction,
        state,
      );
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const isSerializedAction = (data: any): data is SerializedAction =>
  'type' in data && data['type'] in ActionTypes;
