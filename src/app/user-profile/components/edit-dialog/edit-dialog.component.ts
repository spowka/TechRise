import { User } from 'src/app/shared/models/user.model';
import { Component, Inject, OnInit } from '@angular/core';
import { ICountry } from 'src/app/shared/models/country.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, Observable, startWith, switchMap, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpFormDto } from 'src/app/shared/models/sign-up.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountriesService } from 'src/app/shared/services/countries.service';

type FormType = Omit<SignUpFormDto, 'password' | 'confirmPassword'>;

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  public form: FormGroup<FormType>;
  public imgSrc?: string | ArrayBuffer | null;
  private _countries$: Observable<ICountry[]>;
  public filteredCountries$: Observable<ICountry[]>;

  constructor(
    private _fb: FormBuilder,
    private countriesService: CountriesService,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.form = this._fb.nonNullable.group({
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
      image: [''],
    });
    this._countries$ = this.countriesService.countries$;
    this._countries$.pipe(take(1)).subscribe((countries) => {
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

  private _filter(value: string): Observable<ICountry[]> {
    const filterValue = value.toLowerCase();
    return this._countries$.pipe(
      map((countries) =>
        countries.filter((option) =>
          option.name.toLowerCase().includes(filterValue)
        )
      )
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.imgSrc) {
        this.form.value.image = this.imgSrc;
      }
      this._authService.editUser(this.form.value, this.data.user);
      this.dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  readURL(event: Event): void {
    if (
      (<HTMLInputElement>event.target).files &&
      (<FileList>(<HTMLInputElement>event.target)?.files)[0]
    ) {
      const file = (<FileList>(<HTMLInputElement>event.target).files)[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  upload(): void {}
}
