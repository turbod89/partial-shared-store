import { State } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { copyUserModel, UserModel } from './models';

export interface UserState extends State {
  [uuid: string]: UserModel;
}

export const copyState = (state: DeepReadonly<UserState>): UserState => {
  const newState: UserState = {};
  for (const uuid in state.users) {
    newState[uuid] = copyUserModel(state[uuid]);
  }
  return newState;
};

export const createInitialState = (): UserState => ({});
