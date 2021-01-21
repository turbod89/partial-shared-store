import { State, copyState } from '../state';
import { DeepReadonly } from 'partially-shared-store';
import { ActionTypes as AT, Action } from '../actions';

export const incrementReducer = (
  state: DeepReadonly<State>,
  action: Action<AT.Increment>,
): State => {
  const newState = copyState(state);
  newState.value++;
  return newState;
};
