import { Action as ActionBase } from 'partially-shared-store';

export enum ActionTypes {
  Increment = 'Increment',
  Decrement = 'Decrement',
}
export const dataIsAction = (data: any): boolean =>
  'type' in data && data.type in ActionTypes;

export interface IncrementAction extends ActionBase {
  type: ActionTypes.Increment;
}
export interface DecrementAction extends ActionBase {
  type: ActionTypes.Decrement;
}

export type Action = IncrementAction | DecrementAction;
