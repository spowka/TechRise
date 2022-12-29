import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormDto } from 'src/app/shared/models/login.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginFormDto>;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService
  ) {
    this.form = this._fb.nonNullable.group({
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.required,
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const user = this._authService.login(
      <{ email: string; password: string }>this.form.value
    );
    if (user) {
      this._router.navigate(['/user-profile', { queryParams: user.id }]);
    } else {
      this._router.navigate(['/sign-up']);
    }
  }
}
