import { DeepReadonly } from 'partially-shared-store/definitions';
import { CounterModel } from '../models';
import { CounterState } from '../state';

export type SerializedCounterModel = string | CounterModel;

export const serializeKnownCounter = (
  counter: CounterModel,
): SerializedCounterModel => counter.uuid;
export const deserializeKnownCounter = (
  counterUuid: string,
  state: DeepReadonly<CounterState>,
): CounterModel => state.counters[counterUuid];

export const serializeUnknownCounter = (counter: CounterModel): CounterModel =>
  counter;
export const deserializeUnknownCounter = (
  counter: CounterModel,
  state: DeepReadonly<CounterState>,
) => counter;

export const deserializeCounter = (
  counter: SerializedCounterModel,
  state: DeepReadonly<CounterState>,
): CounterModel =>
  typeof counter === 'string'
    ? deserializeKnownCounter(counter, state)
    : deserializeUnknownCounter(counter, state);
