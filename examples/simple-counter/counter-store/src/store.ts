import { PartiallySharedStore } from 'partially-shared-store/store';
import { State, createInitialState } from './state';
import { Identificable } from './identificable';
import { ActionRequestTypes } from './action-requests';
import { ActionTypes } from './actions';
import { addPlanners } from './planners';
import { addReducers } from './reducers';
import { addValidators } from './validators';

export class Store extends PartiallySharedStore<
  State,
  Identificable,
  ActionRequestTypes,
  ActionTypes
> {}

export const createStore = function (initialState?: State): Store {
  initialState = initialState || createInitialState();
  const store = new Store(initialState);
  addPlanners(store);
  addReducers(store);
  addValidators(store);
  return store;
};
