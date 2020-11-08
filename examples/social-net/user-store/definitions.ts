import { Identificable } from 'partially-shared-store/definitions';
import { SerializedUnknownUserModel } from './serializers';

export * from 'partially-shared-store/definitions';

export interface IdentityRequest extends Identificable {
  type: 'IdentityRequest';
  token?: string;
}
export interface IdentityResponse extends Identificable {
  type: 'IdentityResponse';
  token: string;
  user: SerializedUnknownUserModel;
}
