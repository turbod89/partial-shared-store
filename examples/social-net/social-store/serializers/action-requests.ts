import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  AcceptFriendshipRequestActionRequest,
  ActionRequestChangeOwnFieldTypes,
  ActionRequestTypes,
  ChangeOwnFieldActionRequest,
  RequestFriendshipActionRequest,
  DenyFriendshipRequestActionRequest,
  CancelFriendshipRequestActionRequest,
  ActionRequest,
  ConnectUserActionRequest,
  DisconnectUserActionRequest,
} from '../action-requests';
import { SocialState } from '../state';
import {
  deserializeFriendshipRequestModel,
  deserializeKnownUser,
  deserializeUnknownUser,
  deserializeUser,
  SerializedFriendshipRequestModel,
  SerializedKnownUserModel,
  SerializedUnknownUserModel,
  SerializedUserModel,
  serializeFriendshipRequestModel,
  serializeKnownUser,
  serializeUnknownUser,
} from './models';

export type SerializedActionRequestChangeOwnFieldTypes =
  | 'name'
  | 'display-name'
  | 'status';
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
    default: {
      return 'status';
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
    default: {
      return ActionRequestChangeOwnFieldTypes.Status;
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

export interface SerializedRequestFriendshipActionRequest {
  uuid: string;
  author: string;
  type: 'RequestFriendship';
  to: string;
}
export const serializeRequestFriendshipActionRequest = (
  request: RequestFriendshipActionRequest,
): SerializedRequestFriendshipActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'RequestFriendship',
  to: serializeKnownUser(request.to),
});
export const deserializeRequestFriendshipActionRequest = (
  data: SerializedRequestFriendshipActionRequest,
  state: DeepReadonly<SocialState>,
): RequestFriendshipActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.RequestFriendship,
  to: deserializeKnownUser(data.to, state),
});

export interface SerializedAcceptFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'AcceptFriendshipRequest';
  request: SerializedFriendshipRequestModel;
}
export const serializeAcceptFriendshipRequestActionRequest = (
  request: AcceptFriendshipRequestActionRequest,
): SerializedAcceptFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'AcceptFriendshipRequest',
  request: serializeFriendshipRequestModel(request.request),
});
export const deserializeAcceptFriendshipRequestActionRequest = (
  data: SerializedAcceptFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): AcceptFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.AcceptFriendshipRequest,
  request: deserializeFriendshipRequestModel(data.request, state),
});

export interface SerializedDenyFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'DenyFriendshipRequest';
  request: SerializedFriendshipRequestModel;
}
export const serializeDenyFriendshipRequestActionRequest = (
  request: DenyFriendshipRequestActionRequest,
): SerializedDenyFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'DenyFriendshipRequest',
  request: serializeFriendshipRequestModel(request.request),
});
export const deserializeDenyFriendshipRequestActionRequest = (
  data: SerializedDenyFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): DenyFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.DenyFriendshipRequest,
  request: deserializeFriendshipRequestModel(data.request, state),
});

export interface SerializedCancelFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'CancelFriendshipRequest';
  request: SerializedFriendshipRequestModel;
}
export const serializeCancelFriendshipRequestActionRequest = (
  request: CancelFriendshipRequestActionRequest,
): SerializedCancelFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'CancelFriendshipRequest',
  request: serializeFriendshipRequestModel(request.request),
});
export const deserializeCancelFriendshipRequestActionRequest = (
  data: SerializedCancelFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): CancelFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.CancelFriendshipRequest,
  request: deserializeFriendshipRequestModel(data.request, state),
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
  | SerializedRequestFriendshipActionRequest
  | SerializedAcceptFriendshipRequestActionRequest
  | SerializedDenyFriendshipRequestActionRequest
  | SerializedCancelFriendshipRequestActionRequest
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
    case ActionRequestTypes.RequestFriendship:
      return serializeRequestFriendshipActionRequest(
        request as RequestFriendshipActionRequest,
      );
    case ActionRequestTypes.AcceptFriendshipRequest:
      return serializeAcceptFriendshipRequestActionRequest(
        request as AcceptFriendshipRequestActionRequest,
      );
    case ActionRequestTypes.DenyFriendshipRequest:
      return serializeDenyFriendshipRequestActionRequest(
        request as DenyFriendshipRequestActionRequest,
      );
    case ActionRequestTypes.CancelFriendshipRequest:
      return serializeCancelFriendshipRequestActionRequest(
        request as CancelFriendshipRequestActionRequest,
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
  throw new PartiallySharedStoreError('Unknown request type');
};

export const deserializeActionRequest = (
  request: SerializedActionRequest,
  state: DeepReadonly<SocialState>,
): ActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.ChangeOwnField:
      return deserializeChangeOwnFieldActionRequest(
        request as SerializedChangeOwnFieldActionRequest,
        state,
      );
    case ActionRequestTypes.RequestFriendship:
      return deserializeRequestFriendshipActionRequest(
        request as SerializedRequestFriendshipActionRequest,
        state,
      );
    case ActionRequestTypes.AcceptFriendshipRequest:
      return deserializeAcceptFriendshipRequestActionRequest(
        request as SerializedAcceptFriendshipRequestActionRequest,
        state,
      );
    case ActionRequestTypes.DenyFriendshipRequest:
      return deserializeDenyFriendshipRequestActionRequest(
        request as SerializedDenyFriendshipRequestActionRequest,
        state,
      );
    case ActionRequestTypes.CancelFriendshipRequest:
      return deserializeCancelFriendshipRequestActionRequest(
        request as SerializedCancelFriendshipRequestActionRequest,
        state,
      );
    case ActionRequestTypes.ConnectUser:
      return deserializeConnectUserActionRequest(
        request as SerializedConnectUserActionRequest,
        state,
      );
    case ActionRequestTypes.DisconnectUser:
      return deserializeDisconnectUserActionRequest(
        request as SerializedDisconnectUserActionRequest,
        state,
      );
  }
  throw new PartiallySharedStoreError('Unknown request type');
};

export const isSerializedActionRequest = (
  data: any,
): data is SerializedActionRequest =>
  'type' in data && data['type'] in ActionRequestTypes;
