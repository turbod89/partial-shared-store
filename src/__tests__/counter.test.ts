import { v4 as uuidv4 } from 'uuid';
import {
  Action,
  ActionRequest,
  CloneRequest,
  CloneResponse,
  Identity,
  IdentityRequest,
  IdentityResponse,
  State,
  VersionRequest,
  VersionResponse,
} from '../definitions';
import { createStore } from '../store';
import {
  createCloneRequest,
  createCloneResponse,
  createIdentity,
  createIdentityRequest,
  createIdentityResponse,
  createVersionRequest,
  createVersionResponse,
  isCloneRequest,
  isCloneResponse,
  isIdentityRequest,
  isIdentityResponse,
  isVersionRequest,
  isVersionResponse,
  IdentityMapping,
} from '../utils';
import {
  WebSocketServer,
  WebSocketClient,
  trafficSumarizer,
} from '../__mocks__/websocket.mock';

type UUID = string;

test('Shared counter', () => {
  // state
  interface CounterState extends State {
    counter: number;
  }
  const createInitialState = (): CounterState => ({
    counter: 0,
  });

  // action requests
  enum ActionRequestTypes {
    Increment = 'Increment',
    Decrement = 'Decrement',
  }
  const isActionRequest = (data: any): boolean =>
    'type' in data && data.type in ActionRequestTypes;

  interface IncrementActionRequest extends ActionRequest {
    type: ActionRequestTypes.Increment;
  }
  interface DecrementActionRequest extends ActionRequest {
    type: ActionRequestTypes.Decrement;
  }

  // actions
  enum ActionTypes {
    Increment = 'Increment',
    Decrement = 'Decrement',
  }
  const isAction = (data: any): boolean =>
    'type' in data && data.type in ActionTypes;

  interface IncrementAction extends Action {
    type: ActionRequestTypes.Increment;
  }
  interface DecrementAction extends Action {
    type: ActionRequestTypes.Decrement;
  }

  // store
  class CounterStore extends createStore<CounterState>() {
    public readonly version = 'v2.0.0';
  }

  // planners
  CounterStore.createPlanner('Increment', (request) => [
    {
      uuid: uuidv4(),
      type: 'Increment',
      request,
    },
  ]);

  CounterStore.createPlanner('Decrement', (request) => [
    {
      uuid: uuidv4(),
      type: 'Decrement',
      request,
    },
  ]);

  // reducers
  CounterStore.createReducer('Increment', (state, action) => ({
    ...state,
    counter: state.counter + 1,
  }));

  CounterStore.createReducer('Decrement', (state, action) => ({
    ...state,
    counter: state.counter - 1,
  }));

  // utils
  //// SRV
  class MyWebSocketServer extends WebSocketServer {
    private idMap = new IdentityMapping<WebSocketClient>();
    public store = new CounterStore(createInitialState());

    public onConnect(ws: WebSocketClient) {}

    public onDisconnect(ws: WebSocketClient) {
      this.idMap.deleteT(ws);
    }

    public onMessage(ws: WebSocketClient, data: any): void {
      if (isActionRequest(data)) {
        this.onActionRequest(ws, data);
      } else if (isVersionRequest(data)) {
        this.onVersionRequest(ws, data);
      } else if (isIdentityRequest(data)) {
        this.onIdentityRequest(ws, data);
      } else if (isCloneRequest(data)) {
        this.onCloneRequest(ws, data);
      } else {
        // other bussiness case
        console.error('Server recived something unexpected.');
      }
    }

    public onVersionRequest(ws: WebSocketClient, data: any): void {
      // Here we would deserialize
      const request: VersionRequest = data as VersionRequest;
      const versionResponse: VersionResponse = createVersionResponse(
        this.store.version,
        request,
      );
      // Here we would serialize
      const versionResponseData = versionResponse;
      this.send(ws, versionResponseData);
    }

    public onIdentityRequest(ws: WebSocketClient, data: any): void {
      const identity: Identity = createIdentity();
      this.idMap.set(identity, ws);
      // Here we would deserialize
      const request: IdentityRequest = data as IdentityRequest;
      const identityResponse: IdentityResponse = createIdentityResponse(
        identity,
        request,
      );
      // Here we would serialize
      const identityResponseData = identityResponse;
      this.send(ws, identityResponseData);
    }

    public onCloneRequest(ws: WebSocketClient, data: any): void {
      const state: CounterState = this.store.state;
      // Here we would deserialize
      const request: CloneRequest = data as CloneRequest;
      const cloneResponse: CloneResponse<CounterState> = createCloneResponse(
        state,
        request,
      );
      // Here we would serialize
      const cloneResponseData = JSON.parse(JSON.stringify(cloneResponse));
      this.send(ws, cloneResponseData);
    }

    public onActionRequest(ws: WebSocketClient, data: any): void {
      // Here we would deserialize
      const request: ActionRequest = data as ActionRequest;
      const id = this.idMap.getId(ws);
      if (id) {
        request.author = id;
        this.planRequest(request);
      }
    }

    public planRequest(request: ActionRequest): void {
      this.store.validate(request);
      const actions = this.store.plan(request);
      actions.forEach((action) => this.dispatchAction(action));
    }

    public dispatchAction(action: Action) {
      this.store.dispatch(action);
      const targets: Identity[] =
        action.targets || this.idMap.getAllIdentities();

      targets.forEach((id) => {
        const ws = this.idMap.getT(id);
        if (ws) {
          // Here we would serialize
          const actionData = action;
          this.send(ws, actionData);
        }
      });
    }
  }

  //// Client
  class MyWebSocketClient extends WebSocketClient {
    public store = new CounterStore(createInitialState());
    public identity: Identity = createIdentity();

    public onConnect(): void {
      const versionRequest: VersionRequest = createVersionRequest();
      // Here we would serialize
      const requestData = versionRequest;
      this.send(requestData);
    }

    public onMessage(data: any): void {
      if (isAction(data)) {
        this.onAction(data);
      } else if (isVersionResponse(data)) {
        this.onVersionResponse(data);
      } else if (isIdentityResponse(data)) {
        this.onIdentityResponse(data);
      } else if (isCloneResponse(data)) {
        this.onCloneResponse(data);
      } else {
        // other bussiness logic
        console.error('Client recived something unexpected.');
      }
    }

    public onVersionResponse(data: any): void {
      // Here we would deserialize
      const response: VersionResponse = data as VersionResponse;
      try {
        this.store.checkVersion(response.version);
      } catch (error) {
        this.disconnect();
      }
      const identityRequest: IdentityRequest = createIdentityRequest();
      // Here we would serialize
      const requestData = identityRequest;
      this.send(requestData);
    }

    public onIdentityResponse(data: any): void {
      // Here we would deserialize
      const response: IdentityResponse = data as IdentityResponse;
      this.identity = response.identity;
      const cloneRequest: CloneRequest = createCloneRequest();
      // Here we would serialize
      const requestData = cloneRequest;
      this.send(requestData);
    }

    public onCloneResponse(data: any): void {
      // Here we would deserialize
      const response: CloneResponse<CounterState> = data as CloneResponse<
        CounterState
      >;
      this.store.clone(response.state);
    }

    public onAction(data: any): void {
      // Here we would deserialize
      const action: Action = data as Action;
      this.store.dispatch(action);
    }
  }

  //// Here we emulate
  const server = new MyWebSocketServer('Server');
  const client1 = new MyWebSocketClient(server, 'Client 1');
  const client2 = new MyWebSocketClient(server, 'Client 2');

  client1.connect();
  expect(server.traffic.map(trafficSumarizer)).toStrictEqual([
    ['received', 'VersionRequest', 'Client 1'],
    ['sent', 'VersionResponse', 'Client 1'],
    ['received', 'IdentityRequest', 'Client 1'],
    ['sent', 'IdentityResponse', 'Client 1'],
    ['received', 'CloneRequest', 'Client 1'],
    ['sent', 'CloneResponse', 'Client 1'],
  ]);
  server.traffic = [];

  client2.connect();
  expect(server.traffic.map(trafficSumarizer)).toStrictEqual([
    ['received', 'VersionRequest', 'Client 2'],
    ['sent', 'VersionResponse', 'Client 2'],
    ['received', 'IdentityRequest', 'Client 2'],
    ['sent', 'IdentityResponse', 'Client 2'],
    ['received', 'CloneRequest', 'Client 2'],
    ['sent', 'CloneResponse', 'Client 2'],
  ]);
  server.traffic = [];

  expect(server.store.state.counter).toBe(0);
  expect(client1.store.state.counter).toBe(0);
  expect(client2.store.state.counter).toBe(0);

  client1.send({
    uuid: uuidv4(),
    author: client1.identity,
    type: 'Increment',
  });

  expect(server.traffic.map(trafficSumarizer)).toStrictEqual([
    ['received', 'Increment', 'Client 1'],
    ['sent', 'Increment', 'Client 1'],
    ['sent', 'Increment', 'Client 2'],
  ]);
  server.traffic = [];

  expect(server.store.state.counter).toBe(1);
  expect(client1.store.state.counter).toBe(1);
  expect(client2.store.state.counter).toBe(1);
});
