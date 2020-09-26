import {
  Action,
  ActionRequest,
  Planner,
  Reducer,
  State,
  Validator,
} from './definitions';
import { SharedStoreError } from './errors';

export const createStore = function <CustomState extends State>() {
  return class SharedStore {
    public static validatorMapping = new Map<string, Validator>();
    public static plannerMapping = new Map<string, Planner>();
    public static reducerMapping = new Map<string, Reducer<CustomState>>();
    // private static serializerMapping = new Map<string, Validator>();
    // private static deserializerMapping = new Map<string, Validator>();
    public version: string = 'v0.0.0';

    constructor(public state: CustomState) {}

    // utils to be overloaded

    public checkVersion(version: string) {
      if (version !== this.version) {
        throw new SharedStoreError(
          `Store versions missmatch.\nLocal version: '${this.version}'\nRemote version: '${version}'`,
        );
      }
    }

    public clone(state: CustomState): void {
      this.state = state;
    }

    // Magic

    public validate(request: ActionRequest): void {
      const validator = SharedStore.validatorMapping.get(request.type);
      if (!validator) {
        return;
      }
      validator.call(this, request);
    }

    public plan(request: ActionRequest): Action[] {
      const planner = SharedStore.plannerMapping.get(request.type);
      if (!planner) {
        return [];
      }
      return planner.call(this, request);
    }

    public dispatch(action: Action): void {
      const reducer = SharedStore.reducerMapping.get(action.type);
      if (!reducer) {
        return;
      }
      this.state = reducer.call(this, this.state, action);
    }

    public static createValidator(
      actionRequestType: string,
      validator: Validator,
    ): void {
      SharedStore.validatorMapping.set(actionRequestType, validator);
    }

    public static createPlanner(actionType: string, planner: Planner): void {
      SharedStore.plannerMapping.set(actionType, planner);
    }

    public static createReducer(
      actionType: string,
      reducer: Reducer<CustomState>,
    ): void {
      SharedStore.reducerMapping.set(actionType, reducer);
    }
  };
};
