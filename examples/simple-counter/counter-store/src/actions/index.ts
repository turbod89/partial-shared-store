import { ActionTypes as AT } from './types';
import { CloneAction } from './clone.action';
import { IncrementAction } from './increment.action';
import { DecrementAction } from './decrement.action';
import { createIdentificable } from '../identificable';

type AnyAction = CloneAction | IncrementAction | DecrementAction;

export type Action<T extends AT = AT> = T extends AT.Clone
  ? CloneAction
  : T extends AT.Increment
  ? IncrementAction
  : T extends AT.Decrement
  ? DecrementAction
  : AnyAction;

export const isAction = <T extends AT>(obj: any, type?: T): obj is Action<T> =>
  typeof obj === 'object' &&
  'type' in obj &&
  obj.type in AT &&
  (type === undefined || obj.type === type);

export const createAction = <T extends AT>(type: T) => (
  obj: Omit<Action<T>, 'id' | 'type'>,
): Action<T> =>
  (({
    ...createIdentificable(),
    type,
    ...obj,
  } as unknown) as Action<T>);

export * from './types';
