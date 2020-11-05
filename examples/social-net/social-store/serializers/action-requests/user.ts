import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  ActionRequest,
  ActionRequestTypes,
  ActionRequestChangeOwnFieldTypes,
  ChangeOwnFieldActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from '../../action-requests/user';
import { SocialState } from '../../state';
import {
  deserializeKnownUser,
  deserializeUser,
  SerializedUnknownUserModel,
  SerializedUserModel,
  serializeKnownUser,
  serializeUnknownUser,
} from '../models';

export type SerializedActionRequestChangeOwnFieldTypes =
  | 'name'
  | 'display-name'
  | 'image-url';
const serializeActionRequestChangeOwnFieldType = (
  field: ActionRequestChangeOwnFieldTypes,
): SerializedActionRequestChangeOwnFieldTypes => {
  switch (field) {
    case ActionRequestChangeOwnFieldTypes.Name: {
      return 'name';
    }
    case ActionRequestChangeOwnFieldTypes.ScreenName: {
      return 'display-name';
    }
    case ActionRequestChangeOwnFieldTypes.ImageUrl: {
      return 'image-url';
    }
    default: {
      return 'name';
    }
  }
};
const deserializeActionRequestChangeOwnFieldType = (
  field: SerializedActionRequestChangeOwnFieldTypes,
): ActionRequestChangeOwnFieldTypes => {
  switch (field) {
    case 'name': {
      return ActionRequestChangeOwnFieldTypes.Name;
    }
    case 'display-name': {
      return ActionRequestChangeOwnFieldTypes.ScreenName;
    }
    case 'image-url': {
      return ActionRequestChangeOwnFieldTypes.ImageUrl;
    }
    default: {
      return ActionRequestChangeOwnFieldTypes.Name;
    }
  }
};

export interface SerializedChangeOwnFieldActionRequest {
  uuid: string;
  author: string;
  type: 'ChangeOwnField';
  updates: {
    field: SerializedActionRequestChangeOwnFieldTypes;
    value: string;
  }[];
}
export const serializeChangeOwnFieldActionRequest = (
  request: ChangeOwnFieldActionRequest,
): SerializedChangeOwnFieldActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'ChangeOwnField',
  updates: request.updates.map(({ field, value }) => ({
    field: serializeActionRequestChangeOwnFieldType(field),
    value: value,
  })),
});
export const deserializeChangeOwnFieldActionRequest = (
  data: SerializedChangeOwnFieldActionRequest,
  state: DeepReadonly<SocialState>,
): ChangeOwnFieldActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.ChangeOwnField,
  updates: data.updates.map(({ field, value }) => ({
    field: deserializeActionRequestChangeOwnFieldType(field),
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
  state: DeepReadonly<SocialState>,
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
  state: DeepReadonly<SocialState>,
): DisconnectUserActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.DisconnectUser,
  user: deserializeUser(data.user, state),
});

export type SerializedActionRequest =
  | SerializedChangeOwnFieldActionRequest
  | SerializedConnectUserActionRequest
  | SerializedDisconnectUserActionRequest;

export const serializeActionRequest = (
  request: ActionRequest,
): SerializedActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.ChangeOwnField:
      return serializeChangeOwnFieldActionRequest(
        request as ChangeOwnFieldActionRequest,
      );
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
  state: DeepReadonly<SocialState>,
): ActionRequest => {
  switch (serializedRequest.type) {
    case ActionRequestTypes.ChangeOwnField:
      return deserializeChangeOwnFieldActionRequest(
        serializedRequest as SerializedChangeOwnFieldActionRequest,
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
