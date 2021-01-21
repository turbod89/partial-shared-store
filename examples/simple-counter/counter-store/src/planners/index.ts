import { ActionRequestTypes as ART } from '../action-requests';
import { Store } from '../store';
import { clonePlanner } from './clone.planner';
import { incrementPlanner } from './increment.planner';
import { decrementPlanner } from './decrement.planner';

export const addPlanners = function (store: Store) {
  store.createPlanner(ART.Clone, clonePlanner);
  store.createPlanner(ART.Increment, incrementPlanner);
  store.createPlanner(ART.Decrement, decrementPlanner);
};
