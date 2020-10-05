import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserListItemComponent } from './components/user-list/user-list-item/user-list-item.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [UserListComponent, UserListItemComponent, ButtonComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    UserListComponent,
    UserListItemComponent,
    ButtonComponent,
  ],
})
export class SharedModule {}
