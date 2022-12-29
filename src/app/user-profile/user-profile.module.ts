import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../shared/material.module';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDirective } from '../shared/directives/dragDrop.directive';

@NgModule({
  declarations: [UserProfileComponent, EditDialogComponent, DragDirective],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class UserProfileModule {}
