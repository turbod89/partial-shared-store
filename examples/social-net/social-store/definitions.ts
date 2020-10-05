import { Identificable } from 'partially-shared-store/definitions';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from './models';
import {
  SerializedUnknownUserModel,
  serializeUnknownUser,
} from './serializers';

export interface IdentityRequest extends Identificable {
  type: 'IdentityRequest';
  token?: string;
}
export interface IdentityResponse extends Identificable {
  type: 'IdentityResponse';
  token: string;
  user: SerializedUnknownUserModel;
}

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
