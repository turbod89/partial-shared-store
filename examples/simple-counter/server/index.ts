import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {
  CloneRequest,
  CloneResponse,
  Identity,
  IdentityMapping,
  IdentityRequest,
  IdentityResponse,
  VersionRequest,
  VersionResponse,
  createCloneResponse,
  createIdentity,
  createIdentityResponse,
  createVersionResponse,
  dataIsCloneRequest,
  dataIsIdentityRequest,
  dataIsVersionRequest,
} from 'partially-shared-store';
import { createStore } from 'counter-store';
import { CounterStore } from 'counter-store/store';
import {
  ActionRequest,
  dataIsActionRequest,
} from 'counter-store/action-requests';
import { CounterState } from 'counter-store/state';
import { Action } from 'counter-store/actions';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const store: CounterStore = createStore();
const idMap: IdentityMapping<WebSocket> = new IdentityMapping<WebSocket>();

const send = (ws: WebSocket, data: any) => {
  console.log('SENT:');
  console.log(data);
  return ws.send(JSON.stringify(data));
};

const onVersionRequest = (ws: WebSocket, data: any) => {
  const request: VersionRequest = data as VersionRequest;
  const versionResponse: VersionResponse = createVersionResponse(
    store.version,
    request,
  );
  // Here we would serialize
  const versionResponseData = versionResponse;
  send(ws, versionResponseData);
};

const onIdentityRequest = (ws: WebSocket, data: any) => {
  const identity: Identity = createIdentity();
  idMap.set(identity, ws);
  // Here we would deserialize
  const request: IdentityRequest = data as IdentityRequest;
  const identityResponse: IdentityResponse = createIdentityResponse(
    identity,
    request,
  );
  // Here we would serialize
  const identityResponseData = identityResponse;
  send(ws, identityResponseData);
};

const onCloneRequest = (ws: WebSocket, data: any) => {
  const state: CounterState = store.currentState;
  // Here we would deserialize
  const request: CloneRequest = data as CloneRequest;
  const cloneResponse: CloneResponse<CounterState> = createCloneResponse(
    state,
    request,
  );
  // Here we would serialize
  const cloneResponseData = JSON.parse(JSON.stringify(cloneResponse));
  send(ws, cloneResponseData);
};

const onActionRequest = (ws: WebSocket, data: any) => {
  // Here we would deserialize
  const request: ActionRequest = data as ActionRequest;
  const id = idMap.getId(ws);
  if (id) {
    request.author = id;
    planRequest(request);
  }
};

const planRequest = function (request: ActionRequest): void {
  store.validate(request);
  const actions: Action[] = store.plan(request);
  actions.forEach((action) => dispatchAction(action));
};

const dispatchAction = function (action: Action) {
  store.dispatch(action);
  const targets: Identity[] = idMap.getAllIdentities();

  targets.forEach((id) => {
    const ws = idMap.getT(id);
    if (ws) {
      // Here we would serialize
      const actionData = action;
      send(ws, actionData);
    }
  });
};

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (rawData: string) => {
    const data = JSON.parse(JSON.parse(rawData));
    console.log('RECEIVED:');
    console.log(data);
    if (dataIsVersionRequest(data)) {
      onVersionRequest(ws, data);
    } else if (dataIsIdentityRequest(data)) {
      onIdentityRequest(ws, data);
    } else if (dataIsCloneRequest(data)) {
      onCloneRequest(ws, data);
    } else if (dataIsActionRequest(data)) {
      onActionRequest(ws, data);
    }
  });

  ws.on('close', (code, reason) => {
    idMap.deleteT(ws);
  });
});

//start our server
server.listen(process.env.SERVER_PORT || 8080, () => {
  const address = server.address() as WebSocket.AddressInfo;
  console.log(`Server started at ${address.port}.`);
});
