import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
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
  public get avatarUrl() {
    const url = this.user.imageUrl;
    return url || '/assets/default-avatar-icon.svg';
  }

  constructor(
    private router: Router,
    private psStore: PartiallySharedStoreService,
  ) {
    this.isMe$ = this.psStore.user$.pipe(
      map((me) => !!me && me.uuid === this.user.uuid),
      //tap((isMe) => console.log(`Is me: ${isMe}`)),
    );
    this.isFriend$ = this.psStore.user$.pipe(
      map((me) => !!me && !!me.friends && me.friends.has(this.user.uuid)),
      //tap((isFriend) => console.log(`Is friend: ${isFriend}`)),
    );
    this.isFriendshipRequestFrom$ = this.psStore.state$.pipe(
      withLatestFrom(this.psStore.user$),
      map(
        ([state, me]) =>
          this.user.uuid in state.friendshipRequests.from &&
          state.friendshipRequests.from[this.user.uuid].findIndex(
            (toUuid) => toUuid === me.uuid,
          ) >= 0,
      ),
      //tap((_) => console.log(`There is friendship request from: ${_}`)),
    );
    this.isFriendshipRequestTo$ = this.psStore.state$.pipe(
      withLatestFrom(this.psStore.user$),
      map(
        ([state, me]) =>
          this.user.uuid in state.friendshipRequests.to &&
          state.friendshipRequests.to[this.user.uuid].findIndex(
            (fromUuid) => fromUuid === me.uuid,
          ) >= 0,
      ),
      //tap((_) => console.log(`There is friendship request to: ${_}`)),
    );
  }

  public ngOnInit(): void {}

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }

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

  public unfriend() {
    this.psStore.dispatch({
      type: ActionRequestTypes.Unfriend,
      to: copyUserModel(this.user),
    });
  }
}
