import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../types/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  public searchByCapital(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${environment.API_URL}/capital/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
        tap(countries => this.queryCacheCapital.set(query, countries)),
        catchError((error) => {
          return throwError(() => new Error(`Not found any country with this term: ${query}`));
        })
      );
  }

  public searchByCountry(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${environment.API_URL}/name/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
        tap(countries => this.queryCacheCountry.set(query, countries)),
        catchError((error) => {
          return throwError(() => new Error(`Not found any country with this term: ${query}`));
        })
      );
  }

  public searchByRegion(region: Region) {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${environment.API_URL}/region/${region}`)
      .pipe(
        map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
        tap(countries => this.queryCacheCountry.set(region, countries)),
        catchError((error) => {
          return throwError(() => new Error(`Not found any country with this region: ${region}`));
        })
      );
  }

  public searchCountryByAlphaCode(code: string) {
    return this.http.get<RESTCountry[]>(`${environment.API_URL}/alpha/${code}`)
      .pipe(
        map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
        map((countries) => countries.at(0)),
        catchError((error) => {
          return throwError(() => new Error(`Not found any country with this code: ${code}`));
        })
      );
  }
}
