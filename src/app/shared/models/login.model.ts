import { FormControl } from '@angular/forms';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginFormDto {
  email: FormControl<string>;
  password: FormControl<string>;
}
