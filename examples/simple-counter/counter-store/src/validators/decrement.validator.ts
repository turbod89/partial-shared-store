import { DeepReadonly } from 'partially-shared-store';
import { ValidationError } from 'partially-shared-store/errors';
import { State } from '../state';
import { ActionRequest, ActionRequestTypes as ART } from '../action-requests';

export const decrementValidator = (
  state: DeepReadonly<State>,
  request: ActionRequest<ART.Decrement>,
): void => {
  if (state.value === 0) {
    throw new ValidationError('Cannot decrement counter below 0');
  }
};
