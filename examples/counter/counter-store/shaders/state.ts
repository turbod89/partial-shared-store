import { DeepReadonly, Identity } from 'partially-shared-store/definitions';
import { CounterModel } from '../models';
import { CounterState } from '../state';

export const shadowCounterState = (
  state: DeepReadonly<CounterState>,
  to: Identity,
): CounterState => {
  const counters = Object.keys(state.counters)
    .map((key) => state.counters[key])
    .filter((counter) => counter.isPublic || counter.owner.uuid === to.uuid)
    .reduce((counters: { [uuid: string]: CounterModel }, counter) => {
      counters[counter.uuid] = counter;
      return counters;
    }, {});
  const newState = { counters };
  return newState;
};
