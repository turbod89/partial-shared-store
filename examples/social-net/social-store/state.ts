import { State } from 'partially-shared-store';
import { UserModel } from './models';

export interface SocialState extends State {
  users: {
    [uuid: string]: UserModel;
  };
}

export const createInitialState = (): SocialState => ({
  users: {},
});
