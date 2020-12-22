import { v4 as uuidv4 } from 'uuid';
import { DeepReadonly, Identificable, Identity, State } from './definitions';

// Interfaces
export interface VersionRequest extends Identificable {
  type: 'VersionRequest';
}
export interface VersionResponse extends Identificable {
  type: 'VersionResponse';
  version: string;
}

export interface IdentityRequest extends Identificable {
  type: 'IdentityRequest';
}
export interface IdentityResponse extends Identificable {
  type: 'IdentityResponse';
  identity: Identity;
}

export interface CloneRequest extends Identificable {
  type: 'CloneRequest';
}
export interface CloneResponse<CustomState extends State>
  extends Identificable {
  type: 'CloneResponse';
  state: DeepReadonly<CustomState>;
}

// Create
export const createVersionRequest = (): VersionRequest => ({
  uuid: uuidv4(),
  type: 'VersionRequest',
});

export const createVersionResponse = (version: string): VersionResponse => ({
  uuid: uuidv4(),
  type: 'VersionResponse',
  version,
});

export const createIdentityRequest = (): IdentityRequest => ({
  uuid: uuidv4(),
  type: 'IdentityRequest',
});

export const createIdentityResponse = (
  identity: Identity,
): IdentityResponse => ({
  uuid: uuidv4(),
  type: 'IdentityResponse',
  identity,
});

export const createCloneRequest = (): CloneRequest => ({
  uuid: uuidv4(),
  type: 'CloneRequest',
});

export const createCloneResponse = <CustomState extends State>(
  state: DeepReadonly<CustomState>,
): CloneResponse<CustomState> => ({
  uuid: uuidv4(),
  type: 'CloneResponse',
  state,
});

export const createIdentity = (): Identity => ({
  uuid: uuidv4(),
});

// checking

export const isVersionRequest = (data: any): data is VersionRequest =>
  'type' in data && data.type === 'VersionRequest';

export const isVersionResponse = (data: any): data is VersionResponse =>
  'type' in data && data.type === 'VersionResponse';

export const isIdentityRequest = (data: any): data is IdentityRequest =>
  'type' in data && data.type === 'IdentityRequest';

export const isIdentityResponse = (data: any): data is IdentityResponse =>
  'type' in data && data.type === 'IdentityResponse';

export const isCloneRequest = (data: any): data is CloneRequest =>
  'type' in data && data.type === 'CloneRequest';

export const isCloneResponse = <CustomState extends State = State>(
  data: any,
): data is CloneResponse<CustomState> =>
  'type' in data && data.type === 'CloneResponse';
