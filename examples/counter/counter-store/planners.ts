import { v4 as uuidv4 } from 'uuid';
import {
  ActionTypes,
  DecrementAction,
  IncrementAction,
  RemoveAction,
} from './actions';

import {
  CreateActionRequest,
  DecrementActionRequest,
  IncrementActionRequest,
  PublishActionRequest,
  RemoveActionRequest,
  UnpublishActionRequest,
} from './action-requests';

import { CounterStore } from './store';

export const addPlanners = function (store: CounterStore) {
  store.createPlanner('Increment', (state, request: IncrementActionRequest) => {
    const action: IncrementAction = {
      uuid: uuidv4(),
      type: ActionTypes.Increment,
      counter: request.counter,
    };

    if (!request.counter.isPublic) {
      action.onlyTo = [request.author];
    }

    return [action];
  });

  store.createPlanner('Decrement', (state, request: DecrementActionRequest) => {
    const action: DecrementAction = {
      uuid: uuidv4(),
      type: ActionTypes.Decrement,
      counter: request.counter,
    };

    if (!request.counter.isPublic) {
      action.onlyTo = [request.author];
    }

    return [action];
  });

  store.createPlanner('Publish', (state, request: PublishActionRequest) => [
    {
      uuid: uuidv4(),
      type: ActionTypes.Publish,
      counter: request.counter,
    },
  ]);

  store.createPlanner('Unpublish', (state, request: UnpublishActionRequest) => [
    {
      uuid: uuidv4(),
      type: ActionTypes.Unpublish,
      counter: request.counter,
      onlyTo: [request.author],
    },
    {
      uuid: uuidv4(),
      type: ActionTypes.Remove,
      counter: request.counter,
      exceptFor: new Set([request.author]),
    },
  ]);

  store.createPlanner('Remove', (state, request: RemoveActionRequest) => {
    const action: RemoveAction = {
      uuid: uuidv4(),
      type: ActionTypes.Remove,
      counter: request.counter,
    };

    if (!request.counter.isPublic) {
      action.onlyTo = [request.author];
    }

    return [action];
  });

  store.createPlanner('Create', (state, request: CreateActionRequest) => [
    {
      uuid: uuidv4(),
      type: 'Create',
      counter: {
        uuid: uuidv4(),
        value: 0,
        isPublic: false,
        owner: request.author,
      },
      onlyTo: [request.author],
    },
  ]);
};
