import { Component, OnInit } from '@angular/core';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserModel } from 'social-store/models';
import { PartiallySharedStoreService } from '../psstore.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  public user$: Observable<DeepReadonly<UserModel>>;
  public users$: Observable<DeepReadonly<UserModel[]>>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.user$ = this.psStore.user$;
    this.users$ = this.psStore.state$.pipe(
      map((state) => Object.values(state.users)),
    );
  }

  ngOnInit(): void {}
}
