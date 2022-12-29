import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from '../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICountry } from 'src/app/shared/models/country.model';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { SignUpDto, SignUpFormDto } from 'src/app/shared/models/sign-up.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  map,
  Observable,
  repeatWhen,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { SignUpService } from '../../services/sign-up.service';

type currentUserType = Omit<User, 'id'>;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [CountriesService],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private _timerStop$: Subject<void> = new Subject();
  private _timerStart$: Subject<void> = new Subject();
  private _unSubscribe$: Subject<void> = new Subject();
  private _signUp$: Subject<boolean> = new BehaviorSubject(true);
  private _timer: number = 120;

  public imageUrl: any;
  public currentTime: number = this._timer;
  public timerEnd: boolean = true;
  public signUp!: boolean;
  public users: User[] = [];
  public form: FormGroup<SignUpFormDto>;
  public verify!: FormControl;
  public countries$: Observable<ICountry[]>;
  public filteredCountries$: Observable<ICountry[]>;
  public emailAlreadyExist: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _countriesService: CountriesService,
    private _signUpService: SignUpService
  ) {
    this.verify = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern(`^[0-9]*$`),
    ]);
    this.form = this._fb.nonNullable.group(
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
              /[-a-zA-Z0-9@:%._\+~#=]{1,5}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
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
        image: [''],
      },
      {
        validators: this._signUpService.confirmedValidatorFn(
          'password',
          'confirmPassword'
        ),
      }
    );

    this.countries$ = this._countriesService.countries$;

    this.countries$.pipe(take(1)).subscribe((countries) => {
      if (!countries.length) this._countriesService.fetchCountries();
    });

    this.filteredCountries$ = this.form.controls.country.valueChanges.pipe(
      startWith(''),
      switchMap((value) =>
        this._signUpService.filter(value || '', this.countries$)
      )
    );
  }

  ngOnInit(): void {
    this._signUp$.pipe(takeUntil(this._unSubscribe$)).subscribe((val) => {
      this.signUp = val;
    });
  }

  onSubmit() {
    const currentUser: User = <User>this.form.value;
    this.emailAlreadyExist = this._signUpService.emailAlreadyExist(currentUser);
    if (!this.form.valid) {
      return;
    }

    if (this.imageUrl) {
      this.form.value.image = this.imageUrl;
    }

    this._signUp$.next(false);

    timer(1000, 1000)
      .pipe(
        takeUntil(this._timerStop$),
        repeatWhen(() => this._timerStart$)
      )
      .subscribe((val) => {
        this.timerEnd = true;
        this.currentTime = this._timer - val;
        if (this.currentTime === 0) {
          this._timerStop$.next();
          this.timerEnd = false;
        }
      });
  }

  sendCodeAgain() {
    this._timerStart$.next();
  }

  onNavigateUserProfile() {
    let randomId = this.getRandomId();
    const currentUser = this.form.value;

    this._authService.signUp({
      ...this.form.value,
      id: this.users ? randomId + (this.users.length + 1) : randomId + 1,
    } as SignUpDto);

    if (this.verify.valid) {
      this._router.navigate([
        '/user-profile',
        {
          queryParams: this.users
            ? randomId + (this.users.length + 1)
            : randomId + 1,
        },
      ]);
      return;
    }
    this.verify.markAsTouched();
  }

  getRandomId() {
    let randomId = '';
    for (let i = 0; i < 5; i++) {
      randomId += Math.floor(Math.random() * 10);
      randomId += String.fromCharCode(Math.floor(Math.random() * 25 + 65));
    }
    return randomId;
  }

  readURL(event: Event): void {
    if (
      (<HTMLInputElement>event.target).files &&
      (<FileList>(<HTMLInputElement>event.target)?.files)[0]
    ) {
      const file = (<FileList>(<HTMLInputElement>event.target).files)[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
    this._unSubscribe$.next();
  }
}
