import { Component } from '@angular/core';
import { PartiallySharedStoreService } from './psstore.service';
import { map } from 'rxjs/operators';
import { ActionRequestTypes } from 'counter-store/action-requests';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CounterModel } from 'counter-store/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'client';
  publicCounters$: Observable<CounterModel[]>;
  privateCounters$: Observable<CounterModel[]>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.publicCounters$ = this.psStore.state$.pipe(
      map((state) =>
        Object.values(state.counters).filter((counter) => counter.isPublic),
      ),
    );
    this.privateCounters$ = this.psStore.state$.pipe(
      map((state) =>
        Object.values(state.counters).filter((counter) => !counter.isPublic),
      ),
    );
  }
  create() {
    this.psStore.dispatch({
      uuid: uuidv4(),
      type: ActionRequestTypes.Create,
      author: this.psStore.identity,
    });
  }
}
