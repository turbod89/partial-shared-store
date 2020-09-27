import { DeepReadonly, Identity } from 'partially-shared-store/definitions';
import { CounterModel } from '../models';
import { CounterState } from '../state';
import { serializeUnknownCounter } from './models';

type FrozenState = DeepReadonly<CounterState>;
type SerializedCounterState = { counters: CounterModel[] };

export const serializeCounterState = (
  state: FrozenState,
  to: Identity,
): SerializedCounterState => {
  const counters = Object.keys(state.counters)
    .map((key) => state.counters[key])
    .map(serializeUnknownCounter);
  const newState = { counters };
  return newState;
};

export const deserializeCounterState = (
  state: SerializedCounterState,
): CounterState => ({
  counters: state.counters.reduce<{ [uuid: string]: CounterModel }>(
    (acc, counter) => {
      acc[counter.uuid] = counter;
      return acc;
    },
    {},
  ),
});
