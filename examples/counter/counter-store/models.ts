import { Identity, Model } from 'partially-shared-store';

export interface CounterModel extends Model {
  value: number;
  isPublic: boolean;
  owner: Identity;
}
