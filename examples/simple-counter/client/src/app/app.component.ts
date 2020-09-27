import { Component } from '@angular/core';
import { PartiallySharedStoreService } from './psstore.service';
import { map } from 'rxjs/operators';
import { ActionRequestTypes } from 'counter-store/action-requests';
import { CounterState } from 'counter-store/state';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  template: `
    <div>Counter: {{ value$ | async }}</div>
    <button (click)="decrement()">-1</button>
    <button (click)="increment()">+1</button>
  `,
  styles: [],
})
export class AppComponent {
  title = 'client';
  value$: Observable<number>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.value$ = this.psStore.state$.pipe(
      map((state: CounterState) => state.value),
    );
  }

  increment() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Increment,
      author: this.psStore.identity,
    });
  }
  decrement() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Decrement,
      author: this.psStore.identity,
    });
  }
}
