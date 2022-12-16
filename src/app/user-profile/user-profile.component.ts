import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditDialogComponent } from '../core/components/edit-dialog/edit-dialog.component';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  openEditDialog(): void {
    const usersJson = localStorage.getItem('users');
    let user;
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      let id: string;
      this.activatedRoute.params.subscribe((params: any) => {
        id = params.queryParams;
      });
      user = users.filter((user) => user.id != id);
      console.log(user);
    }

    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { user: user },
    });
    console.log(dialogRef);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
