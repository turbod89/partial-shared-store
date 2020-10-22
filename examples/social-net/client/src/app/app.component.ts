import { Component } from '@angular/core';
import { PartiallySharedStoreService } from './psstore.service';
import { map } from 'rxjs/operators';
import { ActionRequestTypes } from 'social-store/action-requests';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
        Object.values(state.socials).filter((social) => social.isPublic),
      ),
    );
    this.privateCounters$ = this.psStore.state$.pipe(
      map((state) =>
        Object.values(state.socials).filter((social) => !social.isPublic),
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
