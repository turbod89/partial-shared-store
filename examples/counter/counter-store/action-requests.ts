import { ActionRequest as ActionRequestBase } from 'partially-shared-store';
import { CounterModel } from './models';

// action requests
export enum ActionRequestTypes {
  Increment = 'Increment',
  Decrement = 'Decrement',
  Publish = 'Publish',
  Unpublish = 'Unpublish',
  Remove = 'Remove',
  Create = 'Create',
}
export const isActionRequest = (data: any): boolean =>
  'type' in data && data.type in ActionRequestTypes;

export interface IncrementActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Increment;
  counter: CounterModel;
}
export interface DecrementActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Decrement;
  counter: CounterModel;
}
export interface PublishActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Publish;
  counter: CounterModel;
}
export interface UnpublishActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Unpublish;
  counter: CounterModel;
}
export interface RemoveActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Remove;
  counter: CounterModel;
}
export interface CreateActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Create;
}

export type ActionRequest =
  | IncrementActionRequest
  | DecrementActionRequest
  | PublishActionRequest
  | UnpublishActionRequest
  | RemoveActionRequest
  | CreateActionRequest;
