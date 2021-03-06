import {
  ActionRequest,
  Request as RequestBase,
  Response as ResponseBase,
} from 'partially-shared-store';
import { Action } from './actions';
import { SerializedAction, SerializedActionRequest } from './serializers';
import { SocialState } from './state';

export type Request = RequestBase | ActionRequest | SerializedActionRequest;
export type Response = ResponseBase<SocialState> | Action | SerializedAction;
