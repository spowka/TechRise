import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFormDto } from 'src/app/shared/models/login.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginFormDto>;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.nonNullable.group({
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
    this.authService.login(this.form.value);
  }
}
