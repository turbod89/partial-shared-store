import { CounterStore } from './store';
import {
  ActionRequest,
  DecrementActionRequest,
  IncrementActionRequest,
  PublishActionRequest,
  RemoveActionRequest,
  UnpublishActionRequest,
} from './action-requests';
import { PartiallySharedStoreError } from 'partially-shared-store/errors';
import { Identity } from 'partially-shared-store';

const validateOwnership = (
  request: ActionRequest,
  target: { owner: Identity },
) => {
  if (request.author.uuid != target.owner.uuid) {
    throw new PartiallySharedStoreError('Forbidden Action Request.');
  }
};

export const addValidators = function (store: CounterStore) {
  store.createValidator(
    'Increment',
    (state, request: IncrementActionRequest) =>
      request.counter.isPublic || validateOwnership(request, request.counter),
  );
  store.createValidator(
    'Decrement',
    (state, request: DecrementActionRequest) =>
      request.counter.isPublic || validateOwnership(request, request.counter),
  );
  store.createValidator('Publish', (state, request: PublishActionRequest) =>
    validateOwnership(request, request.counter),
  );
  store.createValidator('Unpublish', (state, request: UnpublishActionRequest) =>
    validateOwnership(request, request.counter),
  );
  store.createValidator('Remove', (state, request: RemoveActionRequest) =>
    validateOwnership(request, request.counter),
  );
};
