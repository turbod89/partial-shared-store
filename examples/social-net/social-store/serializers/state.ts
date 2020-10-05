import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel } from '../models';
import { SocialState } from '../state';
import { deserializeUnknownUser, serializeUnknownUser } from './models';

export interface SerializedSocialState {
  users: UserModel[];
}

export const serializeSocialState = (state: DeepReadonly<SocialState>) => ({
  users: Object.keys(state.users)
    .map((key) => state.users[key])
    .map(serializeUnknownUser),
});

export const deserializeSocialState = (state: SerializedSocialState) => ({
  users: state.users.reduce<{ [uuid: string]: UserModel }>(
    (users, serializedUser) => {
      const user = deserializeUnknownUser(serializedUser);
      users[user.uuid] = user;
      return users;
    },
    {},
  ),
});
