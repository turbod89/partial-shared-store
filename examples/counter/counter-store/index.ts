import {
  ActionRequest,
  Request as RequestBase,
  Response as ResponseBase,
} from 'partially-shared-store';
import { CounterStore } from './store';
import { addPlanners } from './planners';
import { addReducers } from './reducers';
import { Action } from './actions';
import { CounterState, createInitialState } from './state';
import { SerializedAction, SerializedActionRequest } from './serializers';

export const createStore = function (
  initialState: CounterState | null = null,
): CounterStore {
  initialState = initialState || createInitialState();
  const store = new CounterStore(initialState);
  addPlanners(store);
  addReducers(store);
  return store;
};

export type Request = RequestBase | ActionRequest | SerializedActionRequest;
export type Response = ResponseBase<CounterState> | Action | SerializedAction;
