import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICountry } from '../models/country.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CountriesService {
  private _countries$: BehaviorSubject<ICountry[]> = new BehaviorSubject<
    ICountry[]
  >([]);
  public countries$: Observable<ICountry[]> = this._countries$.asObservable();

  constructor(private http: HttpClient) {}

  fetchCountries() {
    this.http
      .get<ICountry[]>('assets/countries.json')
      .subscribe((countries) => {
        this._countries$.next(countries);
      });
  }
}
