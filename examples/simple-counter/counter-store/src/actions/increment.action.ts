import { Action } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionTypes as AR } from './types';

export type IncrementAction = Action<Identificable, AR> & {
  type: AR.Increment;
};
