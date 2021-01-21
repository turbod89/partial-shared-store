import { State, copyState } from '../state';
import { DeepReadonly } from 'partially-shared-store';
import { ActionTypes as AT, Action } from '../actions';

export const decrementReducer = (
  state: DeepReadonly<State>,
  action: Action<AT.Decrement>,
): State => {
  const newState = copyState(state);
  newState.value--;
  return newState;
};
