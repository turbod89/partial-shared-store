import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

import { TaskQueuer } from 'partially-shared-store/utils';
import { Action, isAction } from 'counter-store/actions';
import {
  Store as CounterStore,
  createStore,
  State as CounterState,
  Identificable,
  createIdentificable,
} from 'counter-store';
import {
  ActionRequest,
  createActionRequest,
  ActionRequestTypes as ART,
} from 'counter-store/action-requests';

type Message = ActionRequest | Action;

@Injectable({
  providedIn: 'root',
})
export class PartiallySharedStoreService {
  private socket$: WebSocketSubject<string>;
  private responses$: Observable<Message>;
  private store: CounterStore = createStore();
  private stateSource: Subject<CounterState> = new Subject();
  public state$: Observable<CounterState> = this.stateSource.asObservable();
  public identity: Identificable = createIdentificable();
  private taskQueuer: TaskQueuer = new TaskQueuer();

  constructor() {
    this.stateToSource();
    this.connect();
    this.requestClone();
    this.taskQueuer.start();
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
        this.taskQueuer.queue(async () => {
          if (isAction(data)) {
            await this.store.dispatch(data);
          }
        });
      });
    }
  }

  private requestClone(): void {
    const actionRequest = createActionRequest(ART.Clone)({
      author: this.identity,
    });
    this.dispatch(actionRequest);
  }

  private async stateToSource(): Promise<void> {
    for await (let state of this.store.state) {
      this.stateSource.next(state);
    }
    this.stateSource.complete();
  }

  public send(data: Message) {
    const parsedData = JSON.stringify(data);
    this.socket$.next(parsedData);
  }

  public dispatch(actionRequest: ActionRequest) {
    this.send(actionRequest);
  }

  close() {
    this.socket$.complete();
  }
}
