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

type FormType = Omit<SignUpFormDto, 'password' | 'confirmPassword'>;

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  public form: FormGroup<FormType>;

  public countries$: Observable<ICountry[]>;
  public filteredCountries$: Observable<ICountry[]>;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {
    this.form = this.fb.nonNullable.group({
      username: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.required,
        ],
      ],
      email: [
        { value: '', disabled: true },
        [Validators.email, Validators.required],
      ],
      birthDate: ['', Validators.required],
      country: ['', Validators.required],
      phone: [{ value: '', disabled: true }, Validators.required],
      website: [
        '',
        [
          Validators.pattern(
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
          ),
          Validators.required,
        ],
      ],
    });

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
    this.form.patchValue(this.data.user);
  }

  onSubmit() {}

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

  onUpdate(): void {
    if (this.form.valid) {
      let users = JSON.parse(<any>localStorage.getItem('users'));
      users = users.map((user: User) => {
        if (user.id === this.data.user.id) {
          return { ...this.data.user, ...this.form.getRawValue() };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(users));
      this.dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
