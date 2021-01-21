import { ActionRequest } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionRequestTypes as ART } from './types';

export type IncrementActionRequest = ActionRequest<Identificable, ART> & {
  type: ART.Increment;
  author: Identificable;
};
