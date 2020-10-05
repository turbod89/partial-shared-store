import { Component, OnInit, Input } from '@angular/core';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { UserModel } from 'social-store/models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input('users') public users: DeepReadonly<UserModel[]>;

  ngOnInit(): void {}
}
