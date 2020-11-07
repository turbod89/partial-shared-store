import { DeepReadonly } from 'partially-shared-store/definitions';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import { ActionRequestTypes, UpdateOwnActionRequest } from './action-requests';
import { UserState } from './state';
import { UserStore } from './store';

export const UpdateOwnValidator = (
  state: DeepReadonly<UserState>,
  request: UpdateOwnActionRequest,
): void => {
  if (request.updates.length === 0) {
    throw new PartiallySharedStoreError();
  }
};

export const addValidators = function (store: UserStore) {
  store.createValidator(ActionRequestTypes.UpdateOwn, UpdateOwnValidator);
};
