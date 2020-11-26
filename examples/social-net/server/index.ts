import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import {
  CloneRequest,
  CloneResponse,
  IdentityMapping,
  VersionRequest,
  VersionResponse,
  createCloneResponse,
  createVersionResponse,
  isCloneRequest,
  isVersionRequest,
} from 'partially-shared-store';
import {
  createIdentityResponse,
  isIdentityRequest,
  IdentityRequest,
  IdentityResponse,
} from 'social-store/definitions';
import { SocialStore, createStore } from 'social-store/store';
import {
  ActionRequest,
  ActionRequestTypes,
} from 'social-store/action-requests';
import { Action } from 'social-store/actions';
import { SocialState } from 'social-store/state';
import {
  deserializeActionRequest,
  SerializedAction,
  SerializedActionRequest,
  serializeAction,
  serializeSocialState,
  SerializedSocialState,
} from 'social-store/serializers';
import { shadowSocialState, shadowAction } from 'social-store/shaders';
import { isSerializedActionRequest } from 'social-store/serializers';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel, createUserModel } from 'social-store/models';
import { TaskQueuer } from 'partially-shared-store/utils';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const taskQueuer = new TaskQueuer();

const store: SocialStore = createStore();
const idMap: IdentityMapping<WebSocket, UserModel> = new IdentityMapping<
  WebSocket,
  UserModel
>();
const createToken = (): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(chars.length * Math.random())];
  }
  return token;
};
const mapTokenUsers = new Map<string, UserModel>();

const send = (ws: WebSocket, data: any) => {
  const to: UserModel | undefined = idMap.getId(ws);
  if (to) {
    console.log(`SENT to ${to.uuid}:`);
  } else {
    console.log('SENT:');
  }
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

const onIdentityRequest = (ws: WebSocket, data: IdentityRequest) => {
  const token: string = data.token || createToken();
  const user: UserModel = mapTokenUsers.get(token) || createUserModel();
  if (!mapTokenUsers.has(token)) {
    mapTokenUsers.set(token, user);
  }
  idMap.set(user, ws);
  // Here we would deserialize
  const identityResponse: IdentityResponse = createIdentityResponse(
    token,
    user,
  );
  // Here we would serialize
  const identityResponseData = identityResponse;
  send(ws, identityResponseData);
};

const onCloneRequest = (ws: WebSocket, data: any) => {
  const state: DeepReadonly<SocialState> = store.currentState;
  // Here we would deserialize
  const id = idMap.getId(ws);
  if (!id) {
    return;
  }
  const request: CloneRequest = data as CloneRequest;
  const cloneResponse: CloneResponse<SerializedSocialState> = createCloneResponse<
    SerializedSocialState
  >(serializeSocialState(shadowSocialState(state, id)), request);
  // Here we would serialize
  const cloneResponseData = JSON.parse(JSON.stringify(cloneResponse));
  send(ws, cloneResponseData);
};

const onActionRequest = async (
  ws: WebSocket,
  data: SerializedActionRequest,
) => {
  const id = idMap.getId(ws);
  if (!id) {
    return;
  }

  if (data.author != id.uuid) {
    return;
  }

  const request: ActionRequest = deserializeActionRequest(
    data,
    store.currentState,
  );
  await planRequest(request);
};

const planRequest = async function (request: ActionRequest): Promise<void> {
  store.validate(request);
  const actions: Action[] = store.plan<Action>(request);
  for (const action of actions) {
    await dispatchAction(action);
  }
};

const dispatchAction = async function (action: Action) {
  console.log(`DISPATCH ACTION ${action.type}`);
  console.log(action);
  await store.dispatch(action);
  console.log(`STATE`);
  console.log(store.currentState);
  const targets: UserModel[] = action.onlyTo || idMap.getAllIdentities();

  targets.forEach((user) => {
    const ws = idMap.getT(user);
    if (ws) {
      const actionData: SerializedAction = serializeAction(
        shadowAction(action, user, store.currentState),
      );
      send(ws, actionData);
    }
  });
};

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (rawData: string) => {
    const data = JSON.parse(JSON.parse(rawData));
    console.log('RECEIVED:');
    console.log(data);
    taskQueuer.queue(async () => {
      if (isVersionRequest(data)) {
        onVersionRequest(ws, data);
      } else if (isIdentityRequest(data)) {
        onIdentityRequest(ws, data);
      } else if (isCloneRequest(data)) {
        onCloneRequest(ws, data);
      } else if (isSerializedActionRequest(data)) {
        await onActionRequest(ws, data);
      }
    });
  });

  ws.on('close', (code, reason) => {
    const user = idMap.getId(ws);
    idMap.deleteT(ws);
    if (user) {
      taskQueuer.queue(
        async () =>
          await planRequest({
            uuid: uuidv4(),
            type: ActionRequestTypes.DisconnectUser,
            user,
            author: user,
          }),
      );
    }
  });
});

//start our server
server.listen(process.env.SERVER_PORT || 8080, () => {
  const address = server.address() as WebSocket.AddressInfo;
  console.log(`Server started at ${address.port}.`);
  taskQueuer.start();
});
