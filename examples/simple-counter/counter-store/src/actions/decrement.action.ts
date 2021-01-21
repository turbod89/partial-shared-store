import { Action } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionTypes as AT } from './types';

export type DecrementAction = Action<Identificable, AT> & {
  type: AT.Decrement;
};
