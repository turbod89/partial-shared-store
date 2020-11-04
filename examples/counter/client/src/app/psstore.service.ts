import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { createStore, Request, Response } from 'counter-store';
import { Action, isAction } from 'counter-store/actions';
import { ActionRequest } from 'counter-store/action-requests';
import { CounterState } from 'counter-store/state';
import {
  createCloneRequest,
  createIdentity,
  createIdentityRequest,
  isCloneResponse,
  isIdentityResponse,
  isVersionResponse,
  CloneRequest,
  CloneResponse,
  Identity,
  IdentityRequest,
  IdentityResponse,
  VersionResponse,
} from 'partially-shared-store';
import { environment } from 'src/environments/environment';
import { CounterStore } from 'counter-store/store';
import { Observable, Subject } from 'rxjs';
import {
  deserializeAction,
  serializeActionRequest,
  SerializedAction,
  SerializedActionRequest,
} from 'counter-store/serializers';

type Message = Request | Response;

@Injectable({
  providedIn: 'root',
})
export class PartiallySharedStoreService {
  private socket$: WebSocketSubject<string>;
  private responses$: Observable<Message>;
  private store: CounterStore = createStore();
  private stateSource: Subject<CounterState> = new Subject();
  public state$: Observable<CounterState> = this.stateSource.asObservable();
  public identity: Identity = createIdentity();

  constructor() {
    this.stateToSource();
    this.connect();
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<string>(
        `ws://localhost:${environment.serverPort}`,
      );
      this.responses$ = this.socket$.pipe(
        map((data: string): Message => (data as unknown) as Message),
      );
      this.responses$.subscribe((data: object) => {
        console.log(data);
        if (isAction(data)) {
          this.onAction(data as SerializedAction);
        } else if (isVersionResponse(data)) {
          this.onVersionResponse(data);
        } else if (isIdentityResponse(data)) {
          this.onIdentityResponse(data);
        } else if (isCloneResponse(data)) {
          this.onCloneResponse(data);
        }
      });

      this.send({
        uuid: uuidv4(),
        type: 'VersionRequest',
      });
    }
  }

  private async stateToSource(): Promise<void> {
    for await (let state of this.store.state) {
      console.log('Here');
      this.stateSource.next(state);
    }
    this.stateSource.complete();
  }

  private onVersionResponse(data: any): void {
    // Here we would deserialize
    const response: VersionResponse = data as VersionResponse;
    try {
      this.store.checkVersion(response.version);
    } catch (error) {
      throw Error('Versions do not match');
    }
    const identityRequest: IdentityRequest = createIdentityRequest();
    // Here we would serialize
    const requestData = identityRequest;
    this.send(requestData);
  }

  private onIdentityResponse(data: any): void {
    // Here we would deserialize
    const response: IdentityResponse = data as IdentityResponse;
    this.identity = response.identity;
    const cloneRequest: CloneRequest = createCloneRequest();
    // Here we would serialize
    const requestData = cloneRequest;
    this.send(requestData);
  }

  private onCloneResponse(data: any): void {
    // Here we would deserialize
    const response: CloneResponse<CounterState> = data as CloneResponse<
      CounterState
    >;
    console.log('About clone');
    this.store.clone(response.state);
  }

  private onAction(data: SerializedAction): void {
    // Here we would deserialize
    const action: Action = deserializeAction(data, this.store.currentState);
    this.store.dispatch(action);
  }

  public send(data: Message) {
    const parsedData = JSON.stringify(data);
    this.socket$.next(parsedData);
  }

  public dispatch(request: ActionRequest) {
    const serializedActionRequest: SerializedActionRequest = serializeActionRequest(
      request,
    );
    this.send(serializedActionRequest);
  }

  close() {
    this.socket$.complete();
  }
}
