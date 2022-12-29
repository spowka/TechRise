import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SignUpDto, SignUpFormDto } from 'src/app/shared/models/sign-up.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private _user$: Subject<User | undefined> = new Subject<User | undefined>();
  private _loginedSub$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public users$: Observable<User[] | undefined> = this._users$.asObservable();
  public user$: Observable<User | undefined> = this._user$.asObservable();
  public logined$: Observable<boolean> = this._loginedSub$.asObservable();

  constructor(private _router: Router) {}

  getUser() {
    const userJson: string = <string>localStorage.getItem('activatedUser');
    const user = JSON.parse(userJson);
    if (user) {
      this._user$.next(user);
      this._loginedSub$.next(true);
    } else {
      this._user$.next(undefined);
      this._loginedSub$.next(false);
    }
  }

  login(currentUser: { email: string; password: string }) {
    let user;
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      user = users.find((user) => {
        return (
          user.email === currentUser.email &&
          atob(user.password) === currentUser.password //atob()
        );
      });
    }
    if (user) {
      localStorage.setItem('activatedUser', JSON.stringify(user));
    }
    return user;
  }

  signUp(data: SignUpDto) {
    const user = new User(
      data.id,
      data.username,
      data.email,
      data.birthDate,
      data.country,
      data.phone,
      data.website,
      btoa(data.password), //btoa()
      data.image
    );
    const users = localStorage.getItem('users');
    localStorage.setItem('activatedUser', JSON.stringify(user));
    if (!users) {
      localStorage.setItem('users', JSON.stringify([user]));
    } else {
      localStorage.setItem(
        'users',
        JSON.stringify([...JSON.parse(users), user])
      );
    }
  }

  editUser(formValue: any, userData: User) {
    let users: User[] = JSON.parse(<string>localStorage.getItem('users'));
    users = users.map((user: User) => {
      if (user.id === userData.id) {
        localStorage.setItem(
          'activatedUser',
          JSON.stringify({ ...userData, ...formValue })
        );
        return { ...userData, ...formValue };
      }
    });
    localStorage.setItem('users', JSON.stringify(users));
    this.getUser();
  }

  logOut() {
    this._router.navigate(['/user-profile', { queryParams: '' }]);
    localStorage.removeItem('activatedUser');
  }
}
