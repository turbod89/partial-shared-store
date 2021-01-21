import { ActionRequest } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionRequestTypes as ART } from './types';

export type DecrementActionRequest = ActionRequest<Identificable, ART> & {
  type: ART.Decrement;
  author: Identificable;
};
