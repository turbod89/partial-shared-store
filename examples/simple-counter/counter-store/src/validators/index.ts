import { Store } from '../store';
import { ActionRequestTypes as ART } from '../action-requests';
import { decrementValidator } from './decrement.validator';

export const addValidators = function (store: Store) {
  store.createValidator(ART.Decrement, decrementValidator);
};
