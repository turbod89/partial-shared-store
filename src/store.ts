import {
  Action,
  ActionRequest,
  DeepReadonly,
  Planner,
  Reducer,
  State,
  Validator,
} from './definitions';
import { PartiallySharedStoreError } from './errors';

export class PartiallySharedStore<CustomState extends State = State> {
  private validatorMapping = new Map<string, Validator<CustomState, any>>();
  private plannerMapping = new Map<string, Planner<CustomState, any>>();
  private reducerMapping = new Map<string, Reducer<CustomState, any>>();
  // private static serializerMapping = new Map<string, Validator>();
  // private static deserializerMapping = new Map<string, Validator>();

  public statePromise: Promise<
    IteratorResult<CustomState>
  > = new Promise(() => {});
  private stateResolve: (iteration: IteratorResult<CustomState>) => void = (
    iteration,
  ) => {};
  private stateReject: () => void = () => {};

  public version: string = 'v0.0.0';

  constructor(private _state: CustomState) {
    this.setStatePromise();
  }

  private setStatePromise() {
    this.statePromise = new Promise<IteratorResult<CustomState>>(
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

  private stateNext(state: CustomState): void {
    this.stateResolve({ done: false, value: state });
  }

  private stateDone(): void {
    this.stateResolve({ done: true, value: this._state });
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

  public clone(state: CustomState): void {
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

  public dispatch(
    action: Action,
    state: DeepReadonly<CustomState> | null = null,
  ): void {
    const reducer = this.reducerMapping.get(action.type);
    if (!reducer) {
      return;
    }
    state = state || this._state;
    this.stateNext(reducer.call(this, this._state, action));
  }

  public createValidator<
    CustomActionRequest extends ActionRequest = ActionRequest
  >(
    actionRequestType: string,
    validator: Validator<CustomState, CustomActionRequest>,
  ): void {
    this.validatorMapping.set(actionRequestType, validator);
  }

  public createPlanner<
    CustomActionRequest extends ActionRequest = ActionRequest
  >(
    actionRequestType: string,
    planner: Planner<CustomState, CustomActionRequest>,
  ): void {
    this.plannerMapping.set(actionRequestType, planner);
  }

  public createReducer<CustomAction extends Action = Action>(
    actionType: string,
    reducer: Reducer<CustomState, CustomAction>,
  ): void {
    this.reducerMapping.set(actionType, reducer);
  }
}

export const createStore = function <CustomState extends State = State>(
  state: CustomState,
): PartiallySharedStore<CustomState> {
  return new PartiallySharedStore<CustomState>(state);
};
