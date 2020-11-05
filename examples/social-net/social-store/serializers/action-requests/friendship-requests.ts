import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  ActionRequest,
  ActionRequestTypes,
  AcceptFriendshipRequestActionRequest,
  RequestFriendshipActionRequest,
  UnfriendActionRequest,
  DenyFriendshipRequestActionRequest,
  CancelFriendshipRequestActionRequest,
} from '../../action-requests/friendship-request';
import { SocialState } from '../../state';
import {
  deserializeKnownUser,
  deserializeUser,
  SerializedUnknownUserModel,
  SerializedUserModel,
  serializeKnownUser,
  serializeUnknownUser,
} from '../models';

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

export interface SerializedUnfriendActionRequest {
  uuid: string;
  author: string;
  type: 'Unfriend';
  to: string;
}
export const serializeUnfriendActionRequest = (
  request: UnfriendActionRequest,
): SerializedUnfriendActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'Unfriend',
  to: serializeKnownUser(request.to),
});
export const deserializeUnfriendActionRequest = (
  data: SerializedUnfriendActionRequest,
  state: DeepReadonly<SocialState>,
): UnfriendActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.Unfriend,
  to: deserializeKnownUser(data.to, state),
});

export interface SerializedAcceptFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'AcceptFriendshipRequest';
  from: SerializedUserModel;
}
export const serializeAcceptFriendshipRequestActionRequest = (
  request: AcceptFriendshipRequestActionRequest,
): SerializedAcceptFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'AcceptFriendshipRequest',
  from: serializeKnownUser(request.from),
});
export const deserializeAcceptFriendshipRequestActionRequest = (
  data: SerializedAcceptFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): AcceptFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.AcceptFriendshipRequest,
  from: deserializeUser(data.from, state),
});

export interface SerializedDenyFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'DenyFriendshipRequest';
  from: SerializedUserModel;
}
export const serializeDenyFriendshipRequestActionRequest = (
  request: DenyFriendshipRequestActionRequest,
): SerializedDenyFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'DenyFriendshipRequest',
  from: serializeKnownUser(request.from),
});
export const deserializeDenyFriendshipRequestActionRequest = (
  data: SerializedDenyFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): DenyFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.DenyFriendshipRequest,
  from: deserializeUser(data.from, state),
});

export interface SerializedCancelFriendshipRequestActionRequest {
  uuid: string;
  author: string;
  type: 'CancelFriendshipRequest';
  to: SerializedUserModel;
}
export const serializeCancelFriendshipRequestActionRequest = (
  request: CancelFriendshipRequestActionRequest,
): SerializedCancelFriendshipRequestActionRequest => ({
  uuid: request.uuid,
  author: request.author.uuid,
  type: 'CancelFriendshipRequest',
  to: serializeKnownUser(request.to),
});
export const deserializeCancelFriendshipRequestActionRequest = (
  data: SerializedCancelFriendshipRequestActionRequest,
  state: DeepReadonly<SocialState>,
): CancelFriendshipRequestActionRequest => ({
  uuid: data.uuid,
  author: deserializeKnownUser(data.author, state),
  type: ActionRequestTypes.CancelFriendshipRequest,
  to: deserializeUser(data.to, state),
});

export type SerializedActionRequest =
  | SerializedRequestFriendshipActionRequest
  | SerializedUnfriendActionRequest
  | SerializedAcceptFriendshipRequestActionRequest
  | SerializedDenyFriendshipRequestActionRequest
  | SerializedCancelFriendshipRequestActionRequest;

export const serializeActionRequest = (
  request: ActionRequest,
): SerializedActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.RequestFriendship:
      return serializeRequestFriendshipActionRequest(
        request as RequestFriendshipActionRequest,
      );
    case ActionRequestTypes.Unfriend:
      return serializeUnfriendActionRequest(request as UnfriendActionRequest);
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
};

export const deserializeActionRequest = (
  request: SerializedActionRequest,
  state: DeepReadonly<SocialState>,
): ActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.RequestFriendship:
      return deserializeRequestFriendshipActionRequest(
        request as SerializedRequestFriendshipActionRequest,
        state,
      );
    case ActionRequestTypes.Unfriend:
      return deserializeUnfriendActionRequest(
        request as SerializedUnfriendActionRequest,
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

export const isSerializedActionRequest = (
  data: any,
): data is SerializedActionRequest =>
  'type' in data && data['type'] in ActionRequestTypes;
