import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  ActionRequest,
  ActionRequestTypes,
  CreateActionRequest,
  DecrementActionRequest,
  IncrementActionRequest,
  PublishActionRequest,
  RemoveActionRequest,
  UnpublishActionRequest,
} from '../action-requests';
import { CounterState } from '../state';
import {
  deserializeCounter,
  SerializedCounterModel,
  serializeKnownCounter,
  serializeUnknownCounter,
} from './models';

export interface SerializedIncrementActionRequest {
  uuid: string;
  type: 'Increment';
  author: string;
  counter: SerializedCounterModel;
}
export const serializeIncrementActionRequest = (
  request: IncrementActionRequest,
): SerializedIncrementActionRequest => ({
  uuid: request.uuid,
  type: 'Increment',
  author: request.author.uuid,
  counter: serializeKnownCounter(request.counter),
});
export const deserializeIncrementActionRequest = (
  data: SerializedIncrementActionRequest,
  state: DeepReadonly<CounterState>,
): IncrementActionRequest => ({
  ...data,
  type: ActionRequestTypes.Increment,
  counter: deserializeCounter(data.counter, state),
  author: { uuid: data.author },
});

export interface SerializedDecrementActionRequest {
  uuid: string;
  type: 'Decrement';
  author: string;
  counter: SerializedCounterModel;
}
export const serializeDecrementActionRequest = (
  request: DecrementActionRequest,
): SerializedDecrementActionRequest => ({
  uuid: request.uuid,
  type: 'Decrement',
  author: request.author.uuid,
  counter: serializeKnownCounter(request.counter),
});
export const deserializeDecrementActionRequest = (
  data: SerializedDecrementActionRequest,
  state: DeepReadonly<CounterState>,
): DecrementActionRequest => ({
  ...data,
  type: ActionRequestTypes.Decrement,
  counter: deserializeCounter(data.counter, state),
  author: { uuid: data.author },
});

export interface SerializedPublishActionRequest {
  uuid: string;
  type: 'Publish';
  author: string;
  counter: SerializedCounterModel;
}
export const serializePublishActionRequest = (
  request: PublishActionRequest,
): SerializedPublishActionRequest => ({
  uuid: request.uuid,
  type: 'Publish',
  author: request.author.uuid,
  counter: serializeUnknownCounter(request.counter),
});
export const deserializePublishActionRequest = (
  data: SerializedPublishActionRequest,
  state: DeepReadonly<CounterState>,
): PublishActionRequest => ({
  ...data,
  type: ActionRequestTypes.Publish,
  counter: deserializeCounter(data.counter, state),
  author: { uuid: data.author },
});

export interface SerializedUnpublishActionRequest {
  uuid: string;
  type: 'Unpublish';
  author: string;
  counter: SerializedCounterModel;
}
export const serializeUnpublishActionRequest = (
  request: UnpublishActionRequest,
): SerializedUnpublishActionRequest => ({
  uuid: request.uuid,
  type: 'Unpublish',
  author: request.author.uuid,
  counter: serializeKnownCounter(request.counter),
});
export const deserializeUnpublishActionRequest = (
  data: SerializedUnpublishActionRequest,
  state: DeepReadonly<CounterState>,
): UnpublishActionRequest => ({
  ...data,
  type: ActionRequestTypes.Unpublish,
  counter: deserializeCounter(data.counter, state),
  author: { uuid: data.author },
});

export interface SerializedRemoveActionRequest {
  uuid: string;
  type: 'Remove';
  author: string;
  counter: SerializedCounterModel;
}
export const serializeRemoveActionRequest = (
  request: RemoveActionRequest,
): SerializedRemoveActionRequest => ({
  uuid: request.uuid,
  type: 'Remove',
  author: request.author.uuid,
  counter: serializeKnownCounter(request.counter),
});
export const deserializeRemoveActionRequest = (
  data: SerializedRemoveActionRequest,
  state: DeepReadonly<CounterState>,
): RemoveActionRequest => ({
  ...data,
  type: ActionRequestTypes.Remove,
  counter: deserializeCounter(data.counter, state),
  author: { uuid: data.author },
});

export interface SerializedCreateActionRequest {
  uuid: string;
  type: 'Create';
  author: string;
}
export const serializeCreateActionRequest = (
  request: CreateActionRequest,
): SerializedCreateActionRequest => ({
  uuid: request.uuid,
  type: 'Create',
  author: request.author.uuid,
});
export const deserializeCreateActionRequest = (
  data: SerializedCreateActionRequest,
  state: DeepReadonly<CounterState>,
): CreateActionRequest => ({
  ...data,
  type: ActionRequestTypes.Create,
  author: { uuid: data.author },
});

export type SerializedActionRequest =
  | SerializedCreateActionRequest
  | SerializedDecrementActionRequest
  | SerializedIncrementActionRequest
  | SerializedPublishActionRequest
  | SerializedUnpublishActionRequest
  | SerializedRemoveActionRequest;

export const serializeActionRequest = (
  request: ActionRequest,
): SerializedActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.Create:
      return serializeCreateActionRequest(request as CreateActionRequest);
    case ActionRequestTypes.Decrement:
      return serializeDecrementActionRequest(request as DecrementActionRequest);
    case ActionRequestTypes.Increment:
      return serializeIncrementActionRequest(request as IncrementActionRequest);
    case ActionRequestTypes.Publish:
      return serializePublishActionRequest(request as PublishActionRequest);
    case ActionRequestTypes.Unpublish:
      return serializeUnpublishActionRequest(request as UnpublishActionRequest);
    case ActionRequestTypes.Remove:
      return serializeRemoveActionRequest(request as RemoveActionRequest);
  }
  throw new PartiallySharedStoreError('Unknown request type');
};
export const deserializeActionRequest = (
  request: SerializedActionRequest,
  state: DeepReadonly<CounterState>,
): ActionRequest => {
  switch (request.type) {
    case ActionRequestTypes.Create:
      return deserializeCreateActionRequest(
        request as SerializedCreateActionRequest,
        state,
      );
    case ActionRequestTypes.Decrement:
      return deserializeDecrementActionRequest(
        request as SerializedDecrementActionRequest,
        state,
      );
    case ActionRequestTypes.Increment:
      return deserializeIncrementActionRequest(
        request as SerializedIncrementActionRequest,
        state,
      );
    case ActionRequestTypes.Publish:
      return deserializePublishActionRequest(
        request as SerializedPublishActionRequest,
        state,
      );
    case ActionRequestTypes.Unpublish:
      return deserializeUnpublishActionRequest(
        request as SerializedUnpublishActionRequest,
        state,
      );
    case ActionRequestTypes.Remove:
      return deserializeRemoveActionRequest(
        request as SerializedRemoveActionRequest,
        state,
      );
  }
  throw new PartiallySharedStoreError('Unknown request type');
};
