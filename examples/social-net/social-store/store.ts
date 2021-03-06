import { PartiallySharedStore } from 'partially-shared-store/store';
import { SocialState, createInitialState } from './state';
import { addPlanners } from './planners';
import { addReducers } from './reducers';

export class SocialStore extends PartiallySharedStore<SocialState> {
  public readonly version = 'v1.0.0';
}

export const createStore = function (
  initialState: SocialState | null = null,
): SocialStore {
  initialState = initialState || createInitialState();
  const store = new SocialStore(initialState);
  addPlanners(store);
  addReducers(store);
  return store;
};
