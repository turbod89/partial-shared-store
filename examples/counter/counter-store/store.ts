import { PartiallySharedStore } from 'partially-shared-store/store';
import { CounterState } from './state';

export class CounterStore extends PartiallySharedStore<CounterState> {
  public readonly version = 'v1.0.0';
}
