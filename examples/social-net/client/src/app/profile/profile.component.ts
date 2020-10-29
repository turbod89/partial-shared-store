import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeepReadonly } from 'partially-shared-store/definitions';
import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { UserModel } from 'social-store/models';
import { PartiallySharedStoreService } from '../psstore.service';
import {
  ActionRequestChangeOwnFieldTypes,
  ActionRequestTypes,
} from 'social-store/action-requests';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup = this.fb.group({
    name: [''],
    screenName: [''],
  });

  public user$: Observable<DeepReadonly<UserModel>>;

  constructor(
    private fb: FormBuilder,
    private psStore: PartiallySharedStoreService,
  ) {
    this.user$ = this.psStore.user$.pipe(
      tap(console.log),
      filter((user) => user),
      tap((user) => this.profileForm.patchValue(user)),
    );
  }

  ngOnInit(): void {}

  updateProfile() {
    const profileFormValues = this.profileForm.value;

    this.psStore.dispatch({
      type: ActionRequestTypes.ChangeOwnField,
      updates: [
        {
          field: ActionRequestChangeOwnFieldTypes.Name,
          value: profileFormValues.name,
        },
        {
          field: ActionRequestChangeOwnFieldTypes.ScreenName,
          value: profileFormValues.screenName,
        },
      ],
    });
  }
}
