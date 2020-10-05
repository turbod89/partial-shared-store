import { ActionRequest as ActionRequestBase } from 'partially-shared-store';

export enum ActionRequestTypes {
  Increment = 'Increment',
  Decrement = 'Decrement',
}
export const isActionRequest = (data: any): boolean =>
  'type' in data && data.type in ActionRequestTypes;

export interface IncrementActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Increment;
}
export interface DecrementActionRequest extends ActionRequestBase {
  type: ActionRequestTypes.Decrement;
}

export type ActionRequest = IncrementActionRequest | DecrementActionRequest;
