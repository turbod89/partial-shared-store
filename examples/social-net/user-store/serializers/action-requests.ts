import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  ActionRequest,
  ActionRequestTypes,
  ActionRequestUpdateOwnTypes,
  UpdateOwnActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from '../action-requests';
import { UserState } from '../state';
import {
  deserializeKnownUser,
  deserializeUser,
  SerializedUnknownUserModel,
  SerializedUserModel,
  serializeKnownUser,
  serializeUnknownUser,
} from './models';

export type SerializedActionRequestUpdateOwnTypes =
  | 'name'
  | 'display-name'
  | 'image-url';
const serializeActionRequestUpdateOwnType = (
  field: ActionRequestUpdateOwnTypes,
): SerializedActionRequestUpdateOwnTypes => {
  switch (field) {
    case ActionRequestUpdateOwnTypes.Name: {
      return 'name';
    }
    case ActionRequestUpdateOwnTypes.ScreenName: {
      return 'display-name';
    }
    case ActionRequestUpdateOwnTypes.ImageUrl: {
      return 'image-url';
    }
    default: {
      return 'name';
    }
  }
};
const deserializeActionRequestUpdateOwnType = (
  field: SerializedActionRequestUpdateOwnTypes,
): ActionRequestUpdateOwnTypes => {
  switch (field) {
    case 'name': {
      return ActionRequestUpdateOwnTypes.Name;
    }
    case 'display-name': {
      return ActionRequestUpdateOwnTypes.ScreenName;
    }
    case 'image-url': {
      return ActionRequestUpdateOwnTypes.ImageUrl;
    }
    default: {
      return ActionRequestUpdateOwnTypes.Name;
    }
  }
};

export interface SerializedUpdateOwnActionRequest {
  uuid: string;
  author: string;
  type: 'UpdateOwn';
  updates: {
    field: SerializedActionRequestUpdateOwnTypes;
    value: string;
  }[];
}
export const serializeUpdateOwnActionRequest = (
  request: UpdateOwnActionRequest,
): SerializedUpdateOwnActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'UpdateOwn',
  updates: request.updates.map(({ field, value }) => ({
    field: serializeActionRequestUpdateOwnType(field),
    value: value,
  })),
});
export const deserializeUpdateOwnActionRequest = (
  data: SerializedUpdateOwnActionRequest,
  state: DeepReadonly<UserState>,
): UpdateOwnActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.UpdateOwn,
  updates: data.updates.map(({ field, value }) => ({
    field: deserializeActionRequestUpdateOwnType(field),
    value: value,
  })),
});

export interface SerializedConnectUserActionRequest {
  uuid: string;
  author: SerializedUserModel;
  type: 'ConnectUser';
  user: SerializedUnknownUserModel;
}
export const serializeConnectUserActionRequest = (
  request: ConnectUserActionRequest,
): SerializedConnectUserActionRequest => ({
  uuid: request.uuid,
  author: serializeKnownUser(request.author),
  type: 'ConnectUser',
  user: serializeUnknownUser(request.user),
});
export const deserializeConnectUserActionRequest = (
  data: SerializedConnectUserActionRequest,
  state: DeepReadonly<UserState>,
): ConnectUserActionRequest => ({
  uuid: data.uuid,
  author: deserializeUser(data.user, state),
  type: ActionRequestTypes.ConnectUser,
  user: deserializeUser(data.user, state),
});

export interface SerializedDisconnectUserActionRequest {
  uuid: string;
  author: string;
  type: 'DisconnectUser';
  user: SerializedUserModel;
}
export const serializeDisconnectUserActionRequest = (
  request: DisconnectUserActionRequest,
): SerializedDisconnectUserActionRequest => ({
  uuid: request.uuid,
  author: serializeKnownUser(request.author),
  type: 'DisconnectUser',
  user: serializeUnknownUser(request.user),
});
export const deserializeDisconnectUserActionRequest = (
  data: SerializedDisconnectUserActionRequest,
  state: DeepReadonly<UserState>,
): DisconnectUserActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.DisconnectUser,
  user: deserializeUser(data.user, state),
});

export type SerializedActionRequest =
  | SerializedUpdateOwnActionRequest
  | SerializedConnectUserActionRequest
  | SerializedDisconnectUserActionRequest;

export const serializeActionRequest = (
  request: ActionRequest,
): SerializedActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.UpdateOwn:
      return serializeUpdateOwnActionRequest(request as UpdateOwnActionRequest);
    case ActionRequestTypes.ConnectUser:
      return serializeConnectUserActionRequest(
        request as ConnectUserActionRequest,
      );
    case ActionRequestTypes.DisconnectUser:
      return serializeDisconnectUserActionRequest(
        request as DisconnectUserActionRequest,
      );
  }
};

export const deserializeActionRequest = (
  serializedRequest: SerializedActionRequest,
  state: DeepReadonly<UserState>,
): ActionRequest => {
  switch (serializedRequest.type) {
    case ActionRequestTypes.UpdateOwn:
      return deserializeUpdateOwnActionRequest(
        serializedRequest as SerializedUpdateOwnActionRequest,
        state,
      );
    case ActionRequestTypes.ConnectUser:
      return deserializeConnectUserActionRequest(
        serializedRequest as SerializedConnectUserActionRequest,
        state,
      );
    case ActionRequestTypes.DisconnectUser:
      return deserializeDisconnectUserActionRequest(
        serializedRequest as SerializedDisconnectUserActionRequest,
        state,
      );
  }
  throw new PartiallySharedStoreError('Unknown request type');
};

export const isSerializedActionRequest = (
  data: any,
): data is SerializedActionRequest =>
  'type' in data && data['type'] in ActionRequestTypes;
