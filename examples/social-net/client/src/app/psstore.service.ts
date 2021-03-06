import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { map, withLatestFrom } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'social-store';
import {
  createIdentityRequest,
  isIdentityResponse,
  IdentityResponse,
  IdentityRequest,
} from 'social-store/definitions';
import { Action } from 'social-store/actions';
import {
  ActionRequest,
  ActionRequestTypes,
} from 'social-store/action-requests';
import { createInitialState, SocialState } from 'social-store/state';
import {
  createCloneRequest,
  isCloneResponse,
  isVersionResponse,
  CloneRequest,
  CloneResponse,
  VersionResponse,
} from 'partially-shared-store';
import { environment } from 'src/environments/environment';
import { SocialStore, createStore } from 'social-store/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  deserializeAction,
  isSerializedAction,
  serializeActionRequest,
  SerializedAction,
  SerializedActionRequest,
  deserializeUnknownUser,
  SerializedSocialState,
  deserializeSocialState,
} from 'social-store/serializers';
import { copyUserModel, createUserModel, UserModel } from 'social-store/models';
import { DeepReadonly } from 'partially-shared-store/definitions';

type Message = Request | Response;

type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

@Injectable({
  providedIn: 'root',
})
export class PartiallySharedStoreService {
  private socket$: WebSocketSubject<string>;
  private responses$: Observable<Message>;
  private store: SocialStore = createStore();
  private stateSource: Subject<DeepReadonly<SocialState>> = new BehaviorSubject(
    createInitialState(),
  );
  public state$: Observable<
    DeepReadonly<SocialState>
  > = this.stateSource.asObservable();
  private userSource: BehaviorSubject<DeepReadonly<
    UserModel
  > | null> = new BehaviorSubject(null);
  public user$: Observable<
    DeepReadonly<UserModel>
  > = this.userSource.asObservable();

  constructor() {
    this.stateToSource();
    this.connect();
    this.state$
      .pipe(
        withLatestFrom(this.user$),
        map(([state, user]) => {
          console.groupCollapsed('State');
          console.log(state);
          console.groupEnd();
          if (!user || !user.uuid || !(user.uuid in state.users)) {
            return;
          }
          this.userSource.next(state.users[user.uuid]);
        }),
      )
      .subscribe();
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
        // console.log(data);
        if (isSerializedAction(data)) {
          this.onAction(data);
        } else if (isVersionResponse(data)) {
          this.onVersionResponse(data);
        } else if (isIdentityResponse(data)) {
          this.onIdentityResponse(data);
        } else if (isCloneResponse<SerializedSocialState>(data)) {
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
      this.stateSource.next(state);
    }
    this.stateSource.complete();
  }

  private onVersionResponse(data: VersionResponse): void {
    // Here we would deserialize
    const response: VersionResponse = data;
    try {
      this.store.checkVersion(response.version);
    } catch (error) {
      throw Error('Versions do not match');
    }
    const token = localStorage.getItem('user-token');
    const identityRequest: IdentityRequest = createIdentityRequest(token);
    // Here we would serialize
    const requestData = identityRequest;
    this.send(requestData);
  }

  private onIdentityResponse(data: IdentityResponse): void {
    // Here we would deserialize
    const response: IdentityResponse = data;
    this.userSource.next(deserializeUnknownUser(response.user));
    localStorage.setItem('user-token', response.token);
    const cloneRequest: CloneRequest = createCloneRequest();
    // Here we would serialize
    const requestData = cloneRequest;
    this.send(requestData);
  }

  private onCloneResponse(data: CloneResponse<SerializedSocialState>): void {
    // Here we would deserialize
    const response: CloneResponse<SerializedSocialState> = data;
    const serializedSocialState: DeepReadonly<SerializedSocialState> =
      response.state;
    const socialState: SocialState = deserializeSocialState(
      serializedSocialState,
    );
    this.store.clone(socialState);
    // connect user
    const user = copyUserModel(this.userSource.getValue() as UserModel);
    this.send(
      serializeActionRequest({
        uuid: uuidv4(),
        type: ActionRequestTypes.ConnectUser,
        user,
        author: user,
      }),
    );
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

  public dispatch(
    request: DistributiveOmit<
      DistributiveOmit<ActionRequest, 'uuid'>,
      'author'
    >,
  ) {
    const serializedActionRequest: SerializedActionRequest = serializeActionRequest(
      {
        uuid: uuidv4(),
        author: this.userSource.getValue() || createUserModel(),
        ...request,
      } as ActionRequest,
    );
    this.send(serializedActionRequest);
  }

  close() {
    this.socket$.complete();
  }
}
