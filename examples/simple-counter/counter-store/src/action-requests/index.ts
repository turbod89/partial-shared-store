import { ActionRequestTypes as ART } from './types';
import { CloneActionRequest } from './clone.action-request';
import { IncrementActionRequest } from './increment.action-request';
import { DecrementActionRequest } from './decrement.action-request';
import { createIdentificable } from '../identificable';

type AnyActionRequest =
  | CloneActionRequest
  | IncrementActionRequest
  | DecrementActionRequest;

export type ActionRequest<T extends ART = ART> = T extends ART.Clone
  ? CloneActionRequest
  : T extends ART.Increment
  ? IncrementActionRequest
  : T extends ART.Decrement
  ? DecrementActionRequest
  : AnyActionRequest;

export const isActionRequest = <T extends ART>(
  obj: any,
  type?: T,
): obj is ActionRequest<T> =>
  typeof obj === 'object' &&
  'type' in obj &&
  obj.type in ART &&
  (type === undefined || obj.type === type);

export const createActionRequest = <T extends ART>(type: T) => (
  obj: Omit<ActionRequest<T>, 'id' | 'type'>,
): ActionRequest<T> =>
  (({
    ...createIdentificable(),
    type,
    ...obj,
  } as unknown) as ActionRequest<T>);

export * from './types';
