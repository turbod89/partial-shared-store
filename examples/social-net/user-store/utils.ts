import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import { v4 as uuidv4 } from 'uuid';
import { IdentityRequest, IdentityResponse } from './definitions';
import { copyUserModel, UserModel } from './models';
import { serializeUnknownUser } from './serializers';
import { UserState } from './state';

export const getUserByUuid = (
  uuid: string,
  state: DeepReadonly<UserState>,
): UserModel => {
  const user = state[uuid] || null;
  if (!user) {
    throw new PartiallySharedStoreError(`No user with uuid ${uuid}.`);
  }
  return copyUserModel(user);
};

export const isIdentityRequest = (data: any): data is IdentityRequest =>
  'type' in data && data.type === 'IdentityRequest';

export const isIdentityResponse = (data: any): data is IdentityResponse =>
  'type' in data && data.type === 'IdentityResponse';

export const createIdentityRequest = (token?: string): IdentityRequest => {
  const request: IdentityRequest = {
    uuid: uuidv4(),
    type: 'IdentityRequest',
  };
  if (token) {
    request.token = token;
  }
  return request;
};

export const createIdentityResponse = (
  token: string,
  user: UserModel,
): IdentityResponse => ({
  uuid: uuidv4(),
  type: 'IdentityResponse',
  user: serializeUnknownUser(user),
  token,
});
