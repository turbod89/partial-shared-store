import { Component } from '@angular/core';
import { PartiallySharedStoreService } from './psstore.service';
import { map } from 'rxjs/operators';
import { ActionRequestTypes } from 'social-store/action-requests';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from 'social-store/models';
import { DeepReadonly } from 'partially-shared-store/definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'client';
  users$: Observable<DeepReadonly<UserModel[]>>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.users$ = this.psStore.state$.pipe(
      map((state) => Object.values(state.users)),
    );
  }
}
