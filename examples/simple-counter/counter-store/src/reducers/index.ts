import { Store } from '../store';
import { ActionTypes as AT } from '../actions';
import { cloneReducer } from './clone.reducer';
import { incrementReducer } from './increment.reducer';
import { decrementReducer } from './decrement.reducer';

export const addReducers = function (store: Store) {
  store.createReducer(AT.Clone, cloneReducer);
  store.createReducer(AT.Increment, incrementReducer);
  store.createReducer(AT.Decrement, decrementReducer);
};
