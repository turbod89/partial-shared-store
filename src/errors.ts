export class PartiallySharedStoreError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = PartiallySharedStoreError.name;
  }
}

export class ValidationError extends PartiallySharedStoreError {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ValidationError.name;
  }
}
