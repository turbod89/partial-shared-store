export class IdentityMapping<T, Identificable, ID = string> {
  protected idToType = new Map<ID, T>();
  protected typeToId = new Map<T, ID>();
  protected identities = new Map<ID, Identificable>();

  constructor(
    protected extractIdentinty: (identificable: Identificable) => ID,
  ) {}

  getAllIdentities(): Identificable[] {
    return Array.from(this.identities.values());
  }

  getId(t: T): Identificable | undefined {
    const id: ID | undefined = this.typeToId.get(t);
    if (id === undefined) {
      return undefined;
    }
    return this.identities.get(id);
  }

  public getT(identificable: Identificable): T | undefined {
    return this.idToType.get(this.extractIdentinty(identificable));
  }

  public set(identificable: Identificable, type: T) {
    this.idToType.set(this.extractIdentinty(identificable), type);
    this.identities.set(this.extractIdentinty(identificable), identificable);
    this.typeToId.set(type, this.extractIdentinty(identificable));
  }

  public deleteId(identificable: Identificable) {
    const t: T | undefined = this.getT(identificable);
    if (!t) {
      return;
    }
    this.typeToId.delete(t);
    this.identities.delete(this.extractIdentinty(identificable));
    this.idToType.delete(this.extractIdentinty(identificable));
  }

  public deleteT(t: T) {
    const uuid: ID | undefined = this.typeToId.get(t);
    if (!uuid) {
      return;
    }
    this.typeToId.delete(t);
    this.identities.delete(uuid);
    this.idToType.delete(uuid);
  }
}
