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
} from '../action-requests';
import { SocialState } from '../state';
import {
  deserializeFriendshipRequestModel,
  deserializeKnownUser,
  SerializedFriendshipRequestModel,
  serializeFriendshipRequestModel,
  serializeKnownUser,
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
    case ActionRequestChangeOwnFieldTypes.DisplayName: {
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
      return ActionRequestChangeOwnFieldTypes.DisplayName;
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
  field: SerializedActionRequestChangeOwnFieldTypes;
  value: string;
}
export const serializeChangeOwnFieldActionRequest = (
  request: ChangeOwnFieldActionRequest,
): SerializedChangeOwnFieldActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'ChangeOwnField',
  field: serializeActionRequestChangeOwnFieldType(request.field),
  value: request.value,
});
export const deserializeChangeOwnFieldActionRequest = (
  data: SerializedChangeOwnFieldActionRequest,
  state: DeepReadonly<SocialState>,
): ChangeOwnFieldActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.ChangeOwnField,
  field: deserializeActionRequestChangeOwnFieldType(data.field),
  value: data.value,
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

export type SerializedActionRequest =
  | SerializedChangeOwnFieldActionRequest
  | SerializedRequestFriendshipActionRequest
  | SerializedAcceptFriendshipRequestActionRequest
  | SerializedDenyFriendshipRequestActionRequest
  | SerializedCancelFriendshipRequestActionRequest;

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
  }
  throw new PartiallySharedStoreError('Unknown request type');
};
