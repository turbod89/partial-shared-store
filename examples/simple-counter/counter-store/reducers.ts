import { Action } from './actions';
import { CounterStore } from './store';

export const addReducers = function (store: CounterStore) {
  store.createReducer('Increment', (state, action: Action) => ({
    ...state,
    value: state.value + 1,
  }));

  store.createReducer('Decrement', (state, action: Action) => ({
    ...state,
    value: state.value - 1,
  }));
};
