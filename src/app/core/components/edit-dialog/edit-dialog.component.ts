import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap, take } from 'rxjs';
import { ICountry } from 'src/app/shared/models/country.model';
import { SignUpFormDto } from 'src/app/shared/models/sign-up.model';
import { User } from 'src/app/shared/models/user.model';
import { CountriesService } from 'src/app/shared/services/countries.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  public form: FormGroup<SignUpFormDto>;

  public countries$: Observable<ICountry[]>;
  public filteredCountries$: Observable<ICountry[]>;
  public timer = 120;
  public currentTime: number = this.timer;
  public timerEnd: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {
    this.form = this.fb.nonNullable.group(
      {
        username: [
          '',
          [
            Validators.minLength(5),
            Validators.maxLength(15),
            Validators.required,
          ],
        ],
        email: ['', [Validators.email, Validators.required]],
        birthDate: ['', Validators.required],
        country: ['', Validators.required],
        phone: ['', Validators.required],
        website: [
          '',
          [
            Validators.pattern(
              /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            ),
            Validators.required,
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.confirmedValidator('password', 'confirmPassword'),
      }
    );

    this.countries$ = this.countriesService.countries$;

    this.countries$.pipe(take(1)).subscribe((countries) => {
      if (!countries.length) this.countriesService.fetchCountries();
    });

    this.filteredCountries$ = this.form.controls.country.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter(value || ''))
    );
  }

  ngOnInit(): void {
    console.log(this.data);

    this.form.patchValue(this.data);
  }

  onSubmit() {}

  confirmedValidator(password: string, confirmPassword: string): ValidatorFn {
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

  private _filter(value: string): Observable<ICountry[]> {
    const filterValue = value.toLowerCase();
    return this.countries$.pipe(
      map((countries) =>
        countries.filter((option) =>
          option.name.toLowerCase().includes(filterValue)
        )
      )
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
