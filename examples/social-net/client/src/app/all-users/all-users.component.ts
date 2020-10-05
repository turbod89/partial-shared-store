import { Component, OnInit } from '@angular/core';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from 'social-store/models';
import { PartiallySharedStoreService } from '../psstore.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit {
  public users$: Observable<DeepReadonly<UserModel[]>>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.users$ = this.psStore.state$.pipe(
      map((state) => Object.values(state.users)),
    );
  }

  ngOnInit(): void {}
}
