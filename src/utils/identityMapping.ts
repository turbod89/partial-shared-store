import { Identity, UUID } from '../definitions';

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
