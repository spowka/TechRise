import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from '../shared/models/user.model';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user?: User;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUser();
    });
  }

  getUser() {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      let id: number;
      this.activatedRoute.params.subscribe((params: any) => {
        id = +params.queryParams;
      });

      this.user = users.find((user) => user.id === id);
    }
  }
}
