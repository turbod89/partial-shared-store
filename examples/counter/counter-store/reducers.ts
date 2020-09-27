import {
  CreateAction,
  DecrementAction,
  IncrementAction,
  PublishAction,
  RemoveAction,
  UnpublishAction,
} from './actions';
import { CounterState } from './state';
import { CounterStore } from './store';

export const addReducers = function (store: CounterStore) {
  store.createReducer('Increment', (state, action: IncrementAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    newState.counters[action.counter.uuid] = {
      ...action.counter,
      value: action.counter.value + 1,
    };
    return newState;
  });

  store.createReducer('Decrement', (state, action: DecrementAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    newState.counters[action.counter.uuid] = {
      ...action.counter,
      value: action.counter.value - 1,
    };
    return newState;
  });

  store.createReducer('Publish', (state, action: PublishAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    newState.counters[action.counter.uuid] = {
      ...action.counter,
      isPublic: true,
    };
    return newState;
  });

  store.createReducer('Unpublish', (state, action: UnpublishAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    newState.counters[action.counter.uuid] = {
      ...action.counter,
      isPublic: false,
    };
    return newState;
  });

  store.createReducer('Remove', (state, action: RemoveAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    delete newState.counters[action.counter.uuid];
    return newState;
  });

  store.createReducer('Create', (state, action: CreateAction) => {
    const newState: CounterState = {
      ...state,
      counters: { ...state.counters },
    };
    newState.counters[action.counter.uuid] = action.counter;
    return newState;
  });
};
