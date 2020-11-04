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
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup = this.fb.group({
    imageUrl: [''],
    name: [''],
    screenName: [''],
  });

  public user$: Observable<DeepReadonly<UserModel>>;

  public get avatarUrl() {
    const url = this.profileForm.get('imageUrl').value;
    return url || '/assets/default-avatar-icon.svg';
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private psStore: PartiallySharedStoreService,
  ) {
    this.user$ = this.psStore.user$.pipe(
      filter((user) => !!user),
      tap((user) => this.profileForm.patchValue(user)),
    );
  }

  ngOnInit(): void {}

  updateProfile() {
    console.log(this.profileForm);
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
        {
          field: ActionRequestChangeOwnFieldTypes.ImageUrl,
          value: profileFormValues.imageUrl,
        },
      ],
    });
    this.router.navigate(['/']);
  }
}
