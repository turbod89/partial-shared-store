import { DeepReadonly } from 'partially-shared-store';
import { State } from '../state';
import { ActionRequest, ActionRequestTypes as ART } from '../action-requests';
import { Action, ActionTypes as AT, createAction } from '../actions';

export const decrementPlanner = (
  state: DeepReadonly<State>,
  request: ActionRequest<ART.Decrement>,
): [Action<AT.Decrement>] => [createAction(AT.Decrement)({})];
