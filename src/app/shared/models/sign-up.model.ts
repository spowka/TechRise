import { FormControl } from '@angular/forms';

export interface SignUpDto {
  id: string;
  username: string;
  email: string;
  birthDate: string;
  country: string;
  phone: string;
  website: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpFormDto {
  username: FormControl<string>;
  email: FormControl<string>;
  birthDate: FormControl<string>;
  country: FormControl<string>;
  phone: FormControl<string>;
  website: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
