import { Action as ActionBase, Identity } from 'partially-shared-store';
import { CounterModel } from './models';

// actions
export enum ActionTypes {
  Increment = 'Increment',
  Decrement = 'Decrement',
  Publish = 'Publish',
  Unpublish = 'Unpublish',
  Remove = 'Remove',
  Create = 'Create',
}
export const isAction = (data: any): boolean =>
  'type' in data && data.type in ActionTypes;

export interface IncrementAction extends ActionBase {
  type: ActionTypes.Increment;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}
export interface DecrementAction extends ActionBase {
  type: ActionTypes.Decrement;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}
export interface PublishAction extends ActionBase {
  type: ActionTypes.Publish;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}
export interface UnpublishAction extends ActionBase {
  type: ActionTypes.Unpublish;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}
export interface RemoveAction extends ActionBase {
  type: ActionTypes.Remove;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}
export interface CreateAction extends ActionBase {
  type: ActionTypes.Create;
  counter: CounterModel;
  onlyTo?: Identity[];
  exceptFor?: Set<Identity>;
}

export type Action =
  | IncrementAction
  | DecrementAction
  | PublishAction
  | UnpublishAction
  | RemoveAction
  | CreateAction;
