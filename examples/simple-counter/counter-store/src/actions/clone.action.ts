import { Action } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionTypes as AT } from './types';
import { State } from '../state';

export interface CloneAction extends Action<Identificable, AT> {
  type: AT.Clone;
  state: State;
  version: string;
  target: Identificable;
}
