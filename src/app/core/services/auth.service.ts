import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SignUpDto } from 'src/app/shared/models/sign-up.model';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _users$: Subject<User> = new Subject();
  public users$: Observable<User> = this._users$.asObservable();

  constructor() {}

  login(data: any) {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: any[] = JSON.parse(usersJson);
      const user = users.filter((el) => {
        el.email === data.email && atob(el.password) === data.password;
      });
    }
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
      btoa(data.password)
    );
    const users = localStorage.getItem('users');
    if (!users) {
      localStorage.setItem('users', JSON.stringify([user]));
    } else {
      localStorage.setItem(
        'users',
        JSON.stringify([...JSON.parse(users), user])
      );
    }
  }
}
