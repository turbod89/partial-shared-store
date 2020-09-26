export interface TrafficLog {
  direction: 'sent' | 'received';
  data: any;
  emitter?: WebSocketServer | WebSocketClient;
  target?: WebSocketServer | WebSocketClient;
}

export const trafficSumarizer = (log: TrafficLog): [string, string, string] => [
  log.direction,
  log.data.type,
  (log.target || log.emitter || { label: '' }).label,
];

export abstract class WebSocketClient {
  public traffic: TrafficLog[] = [];

  constructor(
    private ws: WebSocketServer,
    public readonly label: string = 'Client',
  ) {}

  abstract onConnect(): void;
  abstract onMessage(data: any): void;
  public _onMessage(data: any): void {
    this.traffic.push({
      direction: 'received',
      data,
      emitter: this.ws,
    });
    this.onMessage(data);
  }
  public send(data: any) {
    this.traffic.push({
      direction: 'sent',
      data,
      target: this.ws,
    });
    this.ws._onMessage(this, data);
  }
  public connect(): void {
    this.ws.onConnect(this);
    this.onConnect();
  }
  public disconnect(): void {
    this.ws.onDisconnect(this);
  }
}

export abstract class WebSocketServer {
  public traffic: TrafficLog[] = [];
  constructor(public readonly label: string = 'Server') {}
  abstract onConnect(ws: WebSocketClient): void;
  abstract onDisconnect(ws: WebSocketClient): void;
  abstract onMessage(ws: WebSocketClient, data: any): void;
  public _onMessage(ws: WebSocketClient, data: any): void {
    this.traffic.push({
      direction: 'received',
      data,
      emitter: ws,
    });
    this.onMessage(ws, data);
  }
  public send(ws: WebSocketClient, data: any): void {
    this.traffic.push({
      direction: 'sent',
      data,
      target: ws,
    });
    ws._onMessage(data);
  }
}
