import * as WebSocket from 'ws';
import { IdentityMapping, TaskQueuer } from 'partially-shared-store/utils';
import { Identificable, Store } from 'counter-store';
import { isActionRequest, ActionRequest } from 'counter-store/action-requests';
import { Action, isAction, ActionTypes } from 'counter-store/actions';

const send = (ws: WebSocket, data: any) => {
  console.log('SENT:', data);
  return ws.send(JSON.stringify(data));
};

export const onMessage = (
  ws: WebSocket,
  store: Store,
  taskQueuer: TaskQueuer,
  idMap: IdentityMapping<WebSocket, Identificable, Identificable['id']>,
) => {
  const planRequest = function (request: ActionRequest): void {
    try {
      store.validate(request);
    } catch (e) {
      console.error('ValidationError', e.message);
      return;
    }
    const actions: Action[] = store.plan(request);
    actions.forEach(dispatchAction);
  };

  const dispatchAction = function (action: Action) {
    if (!isAction(action, ActionTypes.Clone)) {
      store.dispatch(action);
    }

    const targets: Identificable[] =
      'target' in action ? [action.target] : idMap.getAllIdentities();

    targets.forEach((target) => {
      const ws = idMap.getT(target);
      if (ws) {
        const actionData = action;
        send(ws, actionData);
      }
    });
  };

  const onActionRequest = (ws: WebSocket, request: ActionRequest) => {
    const author = idMap.getId(ws);
    if (author) {
      request.author = author;
      planRequest(request);
    }
  };

  return (rawData: string) => {
    taskQueuer.queue(async () => {
      const data = JSON.parse(JSON.parse(rawData));
      console.log('RECEIVED:', data);
      if (isActionRequest(data)) {
        onActionRequest(ws, data);
      } else {
        console.log('it is NOT an action request');
      }
    });
  };
};
