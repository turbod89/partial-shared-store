import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { IdentityMapping, TaskQueuer } from 'partially-shared-store/utils';
import {
  Store,
  createStore,
  Identificable,
  createIdentificable,
} from 'counter-store';
import { onMessage } from './action-request.event';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const store: Store = createStore();
const idMap: IdentityMapping<
  WebSocket,
  Identificable,
  Identificable['id']
> = new IdentityMapping((identificable: Identificable) => identificable.id);
const taskQueuer = new TaskQueuer();

wss.on('connection', (ws: WebSocket) => {
  // 1. create identity for websocket
  const identificable: Identificable = createIdentificable();
  idMap.set(identificable, ws);
  console.log(`Connected`, identificable);

  // 2. On message
  ws.on('message', onMessage(ws, store, taskQueuer, idMap));

  // 3. On close connection
  ws.on('close', (_) => {
    console.log(`Disconnected`, idMap.getId(ws));
    idMap.deleteT(ws);
  });
});

//start our server
server.listen(process.env.SERVER_PORT || 7001, () => {
  const address = server.address() as WebSocket.AddressInfo;
  console.log(`Server started at ${address.port}.`);
  taskQueuer.start();
});
