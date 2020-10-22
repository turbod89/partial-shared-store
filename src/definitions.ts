export type UUID = string;
export const uuidRegex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g;
export const isUuid = (s: string): boolean => uuidRegex.test(s);

/*
export type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
*/
type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | Function | Date | Error | RegExp;
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : T extends {}
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : Readonly<T>;

export function deepFreeze(o: any) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}
/*
export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
*/
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
  type: string;
}

export type Validator<
  CustomState extends State = State,
  CustomActionRequest extends ActionRequest = ActionRequest
> = (
  state: DeepReadonly<CustomState>,
  actionRequest: CustomActionRequest,
) => void;

export type Planner<
  CustomState extends State = State,
  CustomActionRequest extends ActionRequest = ActionRequest
> = (
  state: DeepReadonly<CustomState>,
  actionRequest: CustomActionRequest,
) => Action[];

export type Reducer<
  CustomState extends State = State,
  CustomAction extends Action = Action
> = (
  state: DeepReadonly<CustomState>,
  action: CustomAction,
) => DeepReadonly<CustomState>;

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
  state: DeepReadonly<CustomState>;
}

export type Request =
  | ActionRequest
  | VersionRequest
  | IdentityRequest
  | CloneRequest;

export type Response<CustomState extends State> =
  | Action
  | VersionResponse
  | IdentityResponse
  | CloneResponse<CustomState>;
