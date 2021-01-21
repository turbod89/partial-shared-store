import { State } from '../state';
import {
  DeepReadonly,
  PartiallySharedStoreError,
} from 'partially-shared-store';
import { ActionTypes as AT, Action } from '../actions';
import { VERSION } from '../version';

export const cloneReducer = (
  state: DeepReadonly<State>,
  action: Action<AT.Clone>,
): DeepReadonly<State> => {
  if (action.version !== VERSION) {
    throw new PartiallySharedStoreError('Server and client versions missmatch');
  }
  return action.state;
};
