import { ActionRequest } from 'partially-shared-store';
import { Identificable } from '../identificable';
import { ActionRequestTypes as ART } from './types';

export type CloneActionRequest = ActionRequest<Identificable, ART> & {
  type: ART.Clone;
  author: Identificable;
};
