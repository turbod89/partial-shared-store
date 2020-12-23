import {
  Action,
  ActionId,
  ActionRequest,
  ActionRequestId,
  deepFreeze,
  DeepReadonly,
  Planner,
  Reducer,
  State,
  Validator,
} from './definitions';
import { PartiallySharedStoreError } from './errors';

export class PartiallySharedStore<CustomState extends State = State> {
  private validatorMapping = new Map<
    ActionRequestId,
    Validator<CustomState, any>
  >();
  private plannerMapping = new Map<
    ActionRequestId,
    Planner<CustomState, any>
  >();
  private reducerMapping = new Map<ActionId, Reducer<CustomState, any>>();
  // private static serializerMapping = new Map<string, Validator>();
  // private static deserializerMapping = new Map<string, Validator>();

  public statePromise: Promise<
    IteratorResult<DeepReadonly<CustomState>>
  > = new Promise(() => {});
  private stateResolve: (
    iteration: IteratorResult<DeepReadonly<CustomState>>,
  ) => void = (iteration) => {};
  private stateReject: () => void = () => {};

  public version: string = 'v0.0.0';

  constructor(private _state: DeepReadonly<CustomState>) {
    this.setStatePromise();
  }

  private setStatePromise() {
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

  private async stateNext(state: DeepReadonly<CustomState>): Promise<void> {
    return Promise.all([
      this.statePromise,
      this.stateResolve({ done: false, value: state }),
    ]).then((_) => {});
  }

  private async stateDone(): Promise<void> {
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

  // utils to be overloaded

  public checkVersion(version: string) {
    if (version !== this.version) {
      throw new PartiallySharedStoreError(
        `Store versions missmatch.\nLocal version: '${this.version}'\nRemote version: '${version}'`,
      );
    }
  }

  public clone(state: DeepReadonly<CustomState>): void {
    this.stateNext(state);
  }

  public validate(
    request: ActionRequest,
    state: DeepReadonly<CustomState> | null = null,
  ): void {
    const validator = this.validatorMapping.get(request.type);
    if (!validator) {
      return;
    }
    state = state || this._state;
    validator.call(this, state, request);
  }

  public plan<CustomAction = any>(
    request: ActionRequest,
    state: DeepReadonly<CustomState> | null = null,
  ): CustomAction[] {
    const planner = this.plannerMapping.get(request.type);
    if (!planner) {
      return [];
    }
    state = state || this._state;
    return (planner.call(this, state, request) as unknown[]) as CustomAction[];
  }

  public async dispatch(
    action: Action,
    state: DeepReadonly<CustomState> | null = null,
  ): Promise<DeepReadonly<CustomState>> {
    const reducer = this.reducerMapping.get(action.type);
    if (!reducer) {
      return this.currentState;
    }
    state = state || this._state;
    await this.stateNext(reducer.call(this, this._state, action));
    return this.currentState;
  }

  public createValidator<
    CustomActionRequest extends ActionRequest = ActionRequest
  >(
    actionRequestType: ActionRequestId,
    validator: Validator<CustomState, CustomActionRequest>,
  ): void {
    this.validatorMapping.set(actionRequestType, validator);
  }

  public createPlanner<
    CustomActionRequest extends ActionRequest = ActionRequest
  >(
    actionRequestType: ActionRequestId | ActionRequestId[],
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

  public createReducer<CustomAction extends Action = Action>(
    actionType: ActionId | ActionId[],
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

export const createStore = function <CustomState extends State = State>(
  state: CustomState,
): PartiallySharedStore<CustomState> {
  return new PartiallySharedStore<CustomState>(deepFreeze(state));
};
