import { v4 as uuidv4 } from 'uuid';
import { ActionRequest, ActionRequestTypes } from './action-requests';
import { CounterStore } from './store';

export const addPlanners = function (store: CounterStore) {
  store.createPlanner('Increment', (state, request: ActionRequest) => [
    {
      uuid: uuidv4(),
      type: ActionRequestTypes.Increment,
    },
  ]);

  store.createPlanner('Decrement', (state, request: ActionRequest) => [
    {
      uuid: uuidv4(),
      type: ActionRequestTypes.Decrement,
    },
  ]);
};
