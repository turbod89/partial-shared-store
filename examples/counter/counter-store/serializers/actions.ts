import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import {
  Action,
  ActionTypes,
  CreateAction,
  DecrementAction,
  IncrementAction,
  PublishAction,
  RemoveAction,
  UnpublishAction,
} from '../actions';
import { CounterState } from '../state';
import {
  deserializeCounter,
  SerializedCounterModel,
  serializeKnownCounter,
  serializeUnknownCounter,
} from './models';

export interface SerializedIncrementAction {
  uuid: string;
  type: 'Increment';
  counter: SerializedCounterModel;
}
export const serializeIncrementAction = (
  action: IncrementAction,
): SerializedIncrementAction => ({
  uuid: action.uuid,
  type: 'Increment',
  counter: serializeKnownCounter(action.counter),
});
export const deserializeIncrementAction = (
  data: SerializedIncrementAction,
  state: DeepReadonly<CounterState>,
): IncrementAction => ({
  ...data,
  type: ActionTypes.Increment,
  counter: deserializeCounter(data.counter, state),
});

export interface SerializedDecrementAction {
  uuid: string;
  type: 'Decrement';
  counter: SerializedCounterModel;
}
export const serializeDecrementAction = (
  action: DecrementAction,
): SerializedDecrementAction => ({
  uuid: action.uuid,
  type: 'Decrement',
  counter: serializeKnownCounter(action.counter),
});
export const deserializeDecrementAction = (
  data: SerializedDecrementAction,
  state: DeepReadonly<CounterState>,
): DecrementAction => ({
  ...data,
  type: ActionTypes.Decrement,
  counter: deserializeCounter(data.counter, state),
});

export interface SerializedPublishAction {
  uuid: string;
  type: 'Publish';
  counter: SerializedCounterModel;
}
export const serializePublishAction = (
  action: PublishAction,
): SerializedPublishAction => ({
  uuid: action.uuid,
  type: 'Publish',
  counter: serializeUnknownCounter(action.counter),
});
export const deserializePublishAction = (
  data: SerializedPublishAction,
  state: DeepReadonly<CounterState>,
): PublishAction => ({
  ...data,
  type: ActionTypes.Publish,
  counter: deserializeCounter(data.counter, state),
});

export interface SerializedUnpublishAction {
  uuid: string;
  type: 'Unpublish';
  counter: SerializedCounterModel;
}
export const serializeUnpublishAction = (
  action: UnpublishAction,
): SerializedUnpublishAction => ({
  uuid: action.uuid,
  type: 'Unpublish',
  counter: serializeKnownCounter(action.counter),
});
export const deserializeUnpublishAction = (
  data: SerializedUnpublishAction,
  state: DeepReadonly<CounterState>,
): UnpublishAction => ({
  ...data,
  type: ActionTypes.Unpublish,
  counter: deserializeCounter(data.counter, state),
});

export interface SerializedRemoveAction {
  uuid: string;
  type: 'Remove';
  counter: SerializedCounterModel;
}
export const serializeRemoveAction = (
  action: RemoveAction,
): SerializedRemoveAction => ({
  uuid: action.uuid,
  type: 'Remove',
  counter: serializeKnownCounter(action.counter),
});
export const deserializeRemoveAction = (
  data: SerializedRemoveAction,
  state: DeepReadonly<CounterState>,
): RemoveAction => ({
  ...data,
  type: ActionTypes.Remove,
  counter: deserializeCounter(data.counter, state),
});

export interface SerializedCreateAction {
  uuid: string;
  type: 'Create';
  counter: SerializedCounterModel;
}
export const serializeCreateAction = (
  action: CreateAction,
): SerializedCreateAction => ({
  uuid: action.uuid,
  type: 'Create',
  counter: serializeUnknownCounter(action.counter),
});
export const deserializeCreateAction = (
  data: SerializedCreateAction,
  state: DeepReadonly<CounterState>,
): CreateAction => ({
  ...data,
  type: ActionTypes.Create,
  counter: deserializeCounter(data.counter, state),
});

export type SerializedAction =
  | SerializedCreateAction
  | SerializedDecrementAction
  | SerializedIncrementAction
  | SerializedPublishAction
  | SerializedUnpublishAction
  | SerializedRemoveAction;

export const serializeAction = (action: Action): SerializedAction => {
  switch (action.type) {
    case ActionTypes.Create:
      return serializeCreateAction(action as CreateAction);
    case ActionTypes.Decrement:
      return serializeDecrementAction(action as DecrementAction);
    case ActionTypes.Increment:
      return serializeIncrementAction(action as IncrementAction);
    case ActionTypes.Publish:
      return serializePublishAction(action as PublishAction);
    case ActionTypes.Unpublish:
      return serializeUnpublishAction(action as UnpublishAction);
    case ActionTypes.Remove:
      return serializeRemoveAction(action as RemoveAction);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};

export const deserializeAction = (
  action: SerializedAction,
  state: DeepReadonly<CounterState>,
): Action => {
  switch (action.type) {
    case ActionTypes.Create:
      return deserializeCreateAction(action as SerializedCreateAction, state);
    case ActionTypes.Decrement:
      return deserializeDecrementAction(
        action as SerializedDecrementAction,
        state,
      );
    case ActionTypes.Increment:
      return deserializeIncrementAction(
        action as SerializedIncrementAction,
        state,
      );
    case ActionTypes.Publish:
      return deserializePublishAction(action as SerializedPublishAction, state);
    case ActionTypes.Unpublish:
      return deserializeUnpublishAction(
        action as SerializedUnpublishAction,
        state,
      );
    case ActionTypes.Remove:
      return deserializeRemoveAction(action as SerializedRemoveAction, state);
  }
  throw new PartiallySharedStoreError('Unknown action type');
};
