import {
  ActionRequest,
  Request as RequestBase,
  Response as ResponseBase,
} from 'partially-shared-store';
import { Action } from './actions';
import { UserState } from './state';
import { SerializedAction, SerializedActionRequest } from './serializers';

export * from './store';

export type Request = RequestBase | ActionRequest | SerializedActionRequest;
export type Response = ResponseBase<UserState> | Action | SerializedAction;
