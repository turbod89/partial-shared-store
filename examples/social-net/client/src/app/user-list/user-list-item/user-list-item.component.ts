import { Component, OnInit, Input } from '@angular/core';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActionRequestTypes } from 'social-store/action-requests';
import { copyUserModel, UserModel } from 'social-store/models';
import { PartiallySharedStoreService } from 'src/app/psstore.service';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent implements OnInit {
  @Input('user') public user: DeepReadonly<UserModel>;
  public isMe$: Observable<boolean>;
  public isFriend$: Observable<boolean>;
  public isFriendshipRequestFrom$: Observable<boolean>;
  public isFriendshipRequestTo$: Observable<boolean>;

  constructor(private psStore: PartiallySharedStoreService) {
    this.isMe$ = this.psStore.user$.pipe(
      map((me) => me && me.uuid === this.user.uuid),
    );
    this.isFriend$ = this.psStore.user$.pipe(
      map((me) => me && me.friends && me.friends.has(this.user.uuid)),
    );
    this.isFriendshipRequestFrom$ = this.psStore.state$.pipe(
      tap(console.log),
      map((state) => this.user.uuid in state.friendshipRequests.from),
    );
    this.isFriendshipRequestTo$ = this.psStore.state$.pipe(
      map((state) => this.user.uuid in state.friendshipRequests.to),
    );
  }

  public requestFriendship() {
    this.psStore.dispatch({
      type: ActionRequestTypes.RequestFriendship,
      to: copyUserModel(this.user),
    });
  }

  ngOnInit(): void {}
}
