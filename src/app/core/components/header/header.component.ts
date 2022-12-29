import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/shared/models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditDialogComponent } from 'src/app/user-profile/components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _unSub$: Subject<void> = new Subject<void>();
  public userLogined!: boolean;
  public user?: User;
  public imageUrl?: any;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _authService: AuthService,
    private _domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._authService.logined$
      .pipe(takeUntil(this._unSub$))
      .subscribe((boolean) => {
        this.userLogined = boolean;
        this.imageUrl = this._domSanitizer.bypassSecurityTrustUrl(
          this.user?.image
        );
      });

    this._authService.user$.pipe(takeUntil(this._unSub$)).subscribe((user) => {
      this.user = user;
    });
  }

  onLogOut() {
    this._authService.logOut();
    if (this.user) {
      this.user.image = '';
    }
  }

  openEditPopup() {
    const dialogRef = this._dialog.open(EditDialogComponent, {
      data: { user: this.user },
    });
    this._router.navigate(['/user-profile']);
  }

  ngOnDestroy(): void {
    this._unSub$.next();
  }
}
