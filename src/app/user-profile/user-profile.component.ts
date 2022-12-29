import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user?: User;
  public imageUrl?: any = null;
  private _unSubscription: Subscription = new Subscription();

  constructor(
    private _dialog: MatDialog,
    private _authService: AuthService,
    private _domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._unSubscription = this._authService.user$.subscribe((user) => {
      this.user = user;
      this.imageUrl = this._domSanitizer.bypassSecurityTrustUrl(
        this.user?.image
      );
    });
    this._authService.getUser();
  }

  openEditDialog(): void {
    this._dialog.open(EditDialogComponent, {
      data: { user: this.user },
    });
  }

  ngOnDestroy(): void {
    this._unSubscription.unsubscribe();
    this._authService.getUser();
  }
}
