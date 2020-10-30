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
      map((me) => !!me && me.uuid === this.user.uuid),
      //tap((isMe) => console.log(`Is me: ${isMe}`)),
    );
    this.isFriend$ = this.psStore.user$.pipe(
      map((me) => !!me && !!me.friends && me.friends.has(this.user.uuid)),
      //tap((isFriend) => console.log(`Is friend: ${isFriend}`)),
    );
    this.isFriendshipRequestFrom$ = this.psStore.state$.pipe(
      map((state) => this.user.uuid in state.friendshipRequests.from),
      //tap((_) => console.log(`There is friendship request from: ${_}`)),
    );
    this.isFriendshipRequestTo$ = this.psStore.state$.pipe(
      map((state) => this.user.uuid in state.friendshipRequests.to),
      //tap((_) => console.log(`There is friendship request to: ${_}`)),
    );
  }

  public ngOnInit(): void {}

  public requestFriendship() {
    this.psStore.dispatch({
      type: ActionRequestTypes.RequestFriendship,
      to: copyUserModel(this.user),
    });
  }

  public cancelFriendshipRequest() {
    this.psStore.dispatch({
      type: ActionRequestTypes.CancelFriendshipRequest,
      to: copyUserModel(this.user),
    });
  }

  public denyFriendshipRequest() {
    this.psStore.dispatch({
      type: ActionRequestTypes.DenyFriendshipRequest,
      from: copyUserModel(this.user),
    });
  }

  public acceptFriendshipRequest() {
    this.psStore.dispatch({
      type: ActionRequestTypes.AcceptFriendshipRequest,
      from: copyUserModel(this.user),
    });
  }
}
