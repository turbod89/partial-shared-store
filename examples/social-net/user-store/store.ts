import { PartiallySharedStore } from 'partially-shared-store/store';
import { addValidators } from './validators';
import { addPlanners } from './planners';
import { addReducers } from './reducers';
import { createInitialState, UserState } from './state';

export class UserStore extends PartiallySharedStore<UserState> {
  public readonly version = 'v1.0.0';
}

export const createStore = function (
  initialState: UserState | null = null,
): UserStore {
  initialState = initialState || createInitialState();
  const store = new UserStore(initialState);
  addValidators(store);
  addPlanners(store);
  addReducers(store);
  return store;
};
