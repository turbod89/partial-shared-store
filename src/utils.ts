import { v4 as uuidv4 } from 'uuid';
import {
  CloneRequest,
  CloneResponse,
  DeepReadonly,
  Identity,
  IdentityRequest,
  IdentityResponse,
  State,
  UUID,
  VersionRequest,
  VersionResponse,
} from './definitions';

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

export class IdentityMapping<T, I extends Identity = Identity> {
  private idToType = new Map<UUID, T>();
  private typeToId = new Map<T, UUID>();
  private identities = new Map<UUID, I>();

  getAllIdentities(): I[] {
    return Array.from(this.identities.values());
  }

  getId(t: T): I | undefined {
    const id: UUID | undefined = this.typeToId.get(t);
    if (!id) {
      return undefined;
    }
    return this.identities.get(id);
  }

  public getT(id: I): T | undefined {
    return this.idToType.get(id.uuid);
  }

  public set(id: I, type: T) {
    this.idToType.set(id.uuid, type);
    this.identities.set(id.uuid, id);
    this.typeToId.set(type, id.uuid);
  }

  public deleteId(id: I) {
    const t: T | undefined = this.getT(id);
    if (!t) {
      return;
    }
    this.typeToId.delete(t);
    this.identities.delete(id.uuid);
    this.idToType.delete(id.uuid);
  }

  public deleteT(t: T) {
    const uuid: UUID | undefined = this.typeToId.get(t);
    if (!uuid) {
      return;
    }
    this.typeToId.delete(t);
    this.identities.delete(uuid);
    this.idToType.delete(uuid);
  }
}
