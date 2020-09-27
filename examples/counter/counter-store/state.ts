import { State } from 'partially-shared-store';
import { CounterModel } from './models';

export interface CounterState extends State {
  counters: {
    [uuid: string]: CounterModel;
  };
}
export const createInitialState = (): CounterState => ({
  counters: {},
});
