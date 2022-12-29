import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ICountry } from 'src/app/shared/models/country.model';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private _users: User[] = JSON.parse(<string>localStorage.getItem('users'));

  emailAlreadyExist(currentUser: User) {
    let alreadyExist: boolean = false;
    for (let i = 0; i < this._users?.length; i++) {
      let user = this._users[i];
      if (user.email === currentUser.email) {
        return (alreadyExist = true);
      }
    }
    return alreadyExist;
  }

  filter(
    value: string,
    countries$: Observable<ICountry[]>
  ): Observable<ICountry[]> {
    const filterValue = value.toLowerCase();
    return countries$.pipe(
      map((countries: ICountry[]) =>
        countries.filter((option: ICountry) =>
          option.name.toLowerCase().includes(filterValue)
        )
      )
    );
  }

  confirmedValidatorFn(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  constructor() {}
}
