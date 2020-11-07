import { DeepReadonly } from 'partially-shared-store/definitions';
import { getUserByUuid as getUserByUuidBase } from 'user-store/utils';
import { UserModel } from './models';
import { SocialState } from './state';

export const getUserByUuid = (
  uuid: string,
  state: DeepReadonly<SocialState>,
): UserModel => getUserByUuidBase(uuid, state.users);

export const getUserFriends = (
  user: DeepReadonly<UserModel>,
  state: DeepReadonly<SocialState>,
): UserModel[] => {
  if (!state.friendships[user.uuid]) {
    return [];
  }
  return [...state.friendships[user.uuid].values()].map((userUuid: string) =>
    getUserByUuid(userUuid, state),
  );
};

export const hasUserFriend = (
  uuid: string,
  friendUuid: string,
  state: DeepReadonly<SocialState>,
): boolean =>
  state.friendships[uuid] && state.friendships[uuid].has(friendUuid);
