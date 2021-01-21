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

export type ActionRequest<
  Identificable = any,
  ActionRequestTypes = any
> = Identificable & {
  type: ActionRequestTypes;
};

export type Action<Identificable = any, ActionTypes = any> = Identificable & {
  type: ActionTypes;
};

export type Validator<
  CustomState,
  CustomActionRequest extends ActionRequest
> = (
  state: DeepReadonly<CustomState>,
  actionRequest: CustomActionRequest,
) => void;

export type Planner<CustomState, CustomActionRequest extends ActionRequest> = (
  state: DeepReadonly<CustomState>,
  actionRequest: CustomActionRequest,
) => Action[];

export type Reducer<CustomState, CustomAction extends Action> = (
  state: DeepReadonly<CustomState>,
  action: CustomAction,
) => DeepReadonly<CustomState>;
