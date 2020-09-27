import { State } from 'partially-shared-store';

export interface CounterState extends State {
  value: number;
}
export const createInitialState = (): CounterState => ({
  value: 0,
});
