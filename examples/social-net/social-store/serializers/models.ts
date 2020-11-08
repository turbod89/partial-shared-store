import { DeepReadonly } from 'partially-shared-store/definitions';
import { deserializeKnownUser } from 'user-store/serializers';
import { FriendshipRequestModel, UserModel } from '../models';
import { SocialState } from '../state';

export * from 'user-store/serializers/models';

export type SerializedFriendshipRequestModel = {
  from: string;
  to: string;
};

export const serializeFriendshipRequestModel = (
  fr: DeepReadonly<FriendshipRequestModel>,
): SerializedFriendshipRequestModel => ({
  from: fr.from.uuid,
  to: fr.to.uuid,
});

export const deserializeFriendshipRequestModel = (
  sfr: DeepReadonly<SerializedFriendshipRequestModel>,
  state: DeepReadonly<SocialState>,
): FriendshipRequestModel => {
  const from: UserModel = deserializeKnownUser(sfr.from, state.users);
  const to: UserModel = deserializeKnownUser(sfr.to, state.users);
  return { from, to };
};
