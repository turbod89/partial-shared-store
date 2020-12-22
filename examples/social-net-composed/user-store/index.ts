import {
  ActionRequest,
  Request as RequestBase,
  Response as ResponseBase,
} from 'partially-shared-store';
import { SocialStore } from './store';
//import { addPlanners } from './planners';
//import { addReducers } from './reducers';
//import { Action } from './actions';
//import { SocialState, createInitialState } from './state';
//import { SerializedAction, SerializedActionRequest } from './serializers';

/*
export const createStore = function (
  initialState: SocialState | null = null,
): SocialStore {
  initialState = initialState || createInitialState();
  const store = new SocialStore(initialState);
  addPlanners(store);
  addReducers(store);
  return store;
};
*/

//export type Request = RequestBase | ActionRequest | SerializedActionRequest;
//export type Response = ResponseBase<SocialState> | Action | SerializedAction;
//export * from './definitions';
