export type UUID = string;
export const uuidRegex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g;
export const isUuid = (s: string): boolean => uuidRegex.test(s);

export interface Identificable {
  uuid: UUID;
}

export const isIdentificable = (obj: any): boolean =>
  'uuid' in obj && isUuid(obj['uuid']);

export interface State {}
export interface Model extends Identificable {}
export interface Identity extends Identificable {}

export interface IdentityRequest extends Identificable {}
export interface StateRequest extends Identificable {}

export interface ActionRequest extends Identificable {
  type: string;
  author: Identity;
}

export interface Action extends Identificable {
  request: ActionRequest;
  type: string;
  targets?: Identity[];
}

export type Validator = (actionRequest: ActionRequest) => void;

export type Planner = (actionRequest: ActionRequest) => Action[];

export type Reducer<CustomState extends State> = (
  state: CustomState,
  action: Action,
) => CustomState;

// special types
export interface VersionRequest extends Identificable {
  type: 'VersionRequest';
}
export interface VersionResponse extends Identificable {
  type: 'VersionResponse';
  request: VersionRequest;
  version: string;
}

export interface IdentityRequest extends Identificable {
  type: 'IdentityRequest';
}
export interface IdentityResponse extends Identificable {
  type: 'IdentityResponse';
  request: IdentityRequest;
  identity: Identity;
}

export interface CloneRequest extends Identificable {
  type: 'CloneRequest';
}
export interface CloneResponse<CustomState extends State>
  extends Identificable {
  type: 'CloneResponse';
  request: CloneRequest;
  state: CustomState;
}
