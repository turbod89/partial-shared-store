import { DeepReadonly } from 'partially-shared-store';

export interface State {
  value: number;
}

export const copyState = (state: DeepReadonly<State>): State => ({
  value: state.value,
});

export const createInitialState = (): State => ({
  value: 0,
});
