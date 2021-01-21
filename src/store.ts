import {
  Action,
  ActionRequest,
  DeepReadonly,
  Planner,
  Reducer,
  Validator,
} from './definitions';
import { deepFreeze } from './utils';

export class PartiallySharedStore<
  CustomState,
  Identificable,
  ActionRequestTypes = any,
  ActionTypes = any
> {
  protected validatorMapping = new Map<
    ActionRequestTypes,
    Validator<CustomState, any>
  >();
  protected plannerMapping = new Map<
    ActionRequestTypes,
    Planner<CustomState, any>
  >();
  protected reducerMapping = new Map<ActionTypes, Reducer<CustomState, any>>();
  // protected static serializerMapping = new Map<string, Validator>();
  // protected static deserializerMapping = new Map<string, Validator>();

  public statePromise: Promise<
    IteratorResult<DeepReadonly<CustomState>>
  > = new Promise(() => {});
  protected stateResolve: (
    iteration: IteratorResult<DeepReadonly<CustomState>>,
  ) => void = (_) => {};
  protected stateReject: () => void = () => {};

  constructor(protected _state: DeepReadonly<CustomState>) {
    this.setStatePromise();
  }

  protected setStatePromise() {
    this.statePromise = new Promise<IteratorResult<DeepReadonly<CustomState>>>(
      (resolve, reject) => {
        this.stateResolve = resolve;
        this.stateReject = reject;
      },
    ).then((result) => {
      if (result.done) {
        return result;
      }
      this._state = result.value;
      this.setStatePromise();
      return result;
    });
  }

  protected async stateNext(state: DeepReadonly<CustomState>): Promise<void> {
    return Promise.all([
      this.statePromise,
      this.stateResolve({ done: false, value: state }),
    ]).then((_) => {});
  }

  protected async stateDone(): Promise<void> {
    return Promise.all([
      this.statePromise,
      this.stateResolve({ done: true, value: this._state }),
    ]).then((_) => {});
  }

  get state(): AsyncIterable<DeepReadonly<CustomState>> {
    const self = this;
    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => await self.statePromise,
      }),
    };
  }

  get currentState(): DeepReadonly<CustomState> {
    return this._state;
  }

  public clone(state: DeepReadonly<CustomState>): void {
    this.stateNext(state);
  }

  public validate<
    CustomActionRequest extends ActionRequest<Identificable, ActionRequestTypes>
  >(request: CustomActionRequest, state?: DeepReadonly<CustomState>): void {
    const validator = this.validatorMapping.get(request.type);
    if (!validator) {
      return;
    }
    state = state || this._state;
    validator.call(this, state, request);
  }

  public plan<
    CustomAction extends Action<Identificable, ActionTypes>,
    CustomActionRequest extends ActionRequest<Identificable, ActionRequestTypes>
  >(
    request: CustomActionRequest,
    state?: DeepReadonly<CustomState>,
  ): CustomAction[] {
    const planner = this.plannerMapping.get(request.type);
    if (!planner) {
      return [];
    }
    state = state || this._state;
    return planner.call(this, state, request);
  }

  public async dispatch<
    CustomAction extends Action<Identificable, ActionTypes>
  >(
    action: CustomAction,
    state?: DeepReadonly<CustomState>,
  ): Promise<DeepReadonly<CustomState>> {
    const reducer = this.reducerMapping.get(action.type);
    if (!reducer) {
      return this.currentState;
    }
    state = state || this._state;
    await this.stateNext(reducer.call(this, state, action));
    return this.currentState;
  }

  public createValidator<
    CustomActionRequest extends ActionRequest<Identificable, ActionRequestTypes>
  >(
    actionRequestType: ActionRequestTypes,
    validator: Validator<CustomState, CustomActionRequest>,
  ): void {
    this.validatorMapping.set(actionRequestType, validator);
  }

  public createPlanner<
    CustomActionRequest extends ActionRequest<Identificable, ActionRequestTypes>
  >(
    actionRequestType: ActionRequestTypes | ActionRequestTypes[],
    planner: Planner<CustomState, CustomActionRequest>,
  ): void {
    if (!Array.isArray(actionRequestType)) {
      this.plannerMapping.set(actionRequestType, planner);
    } else {
      actionRequestType.map((actionRequestType) =>
        this.plannerMapping.set(actionRequestType, planner),
      );
    }
  }

  public createReducer<CustomAction extends Action<Identificable, ActionTypes>>(
    actionType: ActionTypes | ActionTypes[],
    reducer: Reducer<CustomState, CustomAction>,
  ): void {
    if (!Array.isArray(actionType)) {
      this.reducerMapping.set(actionType, reducer);
    } else {
      actionType.map((actionType) =>
        this.reducerMapping.set(actionType, reducer),
      );
    }
  }
}

export const createStore = function <
  CustomState,
  Identificable,
  ActionRequestTypes = any,
  ActionTypes = any
>(
  state: CustomState,
): PartiallySharedStore<
  CustomState,
  Identificable,
  ActionRequestTypes,
  ActionTypes
> {
  return new PartiallySharedStore<
    CustomState,
    Identificable,
    ActionRequestTypes,
    ActionTypes
  >(deepFreeze(state));
};
