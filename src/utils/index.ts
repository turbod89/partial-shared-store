import { v4 as uuidv4 } from 'uuid';
import {
  CloneRequest,
  CloneResponse,
  DeepReadonly,
  Identity,
  IdentityRequest,
  IdentityResponse,
  State,
  VersionRequest,
  VersionResponse,
} from '../definitions';

export { IdentityMapping } from './identityMapping';
export { TaskQueuer } from './taskQueuer';

export const createVersionRequest = (): VersionRequest => ({
  uuid: uuidv4(),
  type: 'VersionRequest',
});

export const createVersionResponse = (
  version: string,
  request: VersionRequest,
): VersionResponse => ({
  uuid: uuidv4(),
  type: 'VersionResponse',
  version,
  request,
});

export const createIdentityRequest = (): IdentityRequest => ({
  uuid: uuidv4(),
  type: 'IdentityRequest',
});

export const createIdentityResponse = (
  identity: Identity,
  request: IdentityRequest,
): IdentityResponse => ({
  uuid: uuidv4(),
  type: 'IdentityResponse',
  identity,
  request,
});

export const createCloneRequest = (): CloneRequest => ({
  uuid: uuidv4(),
  type: 'CloneRequest',
});

export const createCloneResponse = <CustomState extends State>(
  state: DeepReadonly<CustomState>,
  request: DeepReadonly<CloneRequest>,
): CloneResponse<CustomState> => ({
  uuid: uuidv4(),
  type: 'CloneResponse',
  state,
  request,
});

export const createIdentity = (): Identity => ({
  uuid: uuidv4(),
});

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

export const isCloneResponse = <CustomState extends State>(
  data: any,
): data is CloneResponse<CustomState> =>
  'type' in data && data.type === 'CloneResponse';
