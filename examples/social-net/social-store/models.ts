import { Identity } from 'partially-shared-store';
import { DeepReadonly } from 'partially-shared-store/definitions';

export interface UserModel extends Identity {
  name: string;
  screenName: string;
  friends: Set<string>;
}

export const copyUserModel = (user: DeepReadonly<UserModel>): UserModel => ({
  ...user,
  friends: new Set<string>([...user.friends]),
});
