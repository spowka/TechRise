import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  map,
  Observable,
  repeat,
  repeatWhen,
  retry,
  retryWhen,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { ICountry } from 'src/app/shared/models/country.model';
import { SignUpDto, SignUpFormDto } from 'src/app/shared/models/sign-up.model';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [CountriesService],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private _signUp$: Subject<boolean> = new BehaviorSubject(true);
  private unSubscribe$: Subject<void> = new Subject();
  private timerStart: Subject<void> = new Subject();
  private timerStop: Subject<void> = new Subject();

  public signUp!: boolean;
  public form: FormGroup<SignUpFormDto>;
  public countries$: Observable<ICountry[]>;
  public filteredCountries$: Observable<ICountry[]>;
  public timer = 120;
  public currentTime: number = this.timer;
  public timerEnd: boolean = true;
  public verify!: FormControl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private countriesService: CountriesService,
    private router: Router
  ) {
    this.verify = new FormControl('', [
      Validators.required,
      Validators.pattern(`^[0-9]*$`),
      Validators.maxLength(4),
    ]);
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
    this._signUp$.pipe(takeUntil(this.unSubscribe$)).subscribe((val) => {
      this.signUp = val;
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    // this.authService.signUp(this.form.value as SignUpDto);
    this._signUp$.next(false);

    const source = timer(1000, 1000);
    source
      .pipe(
        takeUntil(this.timerStop),
        repeatWhen(() => this.timerStart)
      )
      .subscribe((val) => {
        this.timerEnd = true;
        this.currentTime = this.timer - val;
        if (this.currentTime === 0) {
          this.timerStop.next();
          this.timerEnd = false;
        }
      });
  }

  sendCodeAgain() {
    this.timerStart.next();
  }

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

  onNavigateUserProfile() {
    const users = JSON.parse(<string>localStorage.getItem('users'));
    this.authService.signUp({
      ...this.form.value,
      id: users ? users.length + 1 : 1,
    } as SignUpDto);

    if (this.verify.valid) {
      this.router.navigate([
        '/user-profile',
        { queryParams: users ? users.length + 1 : 1 },
      ]);
      return;
    }
    this.verify.markAsTouched();
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }
}
