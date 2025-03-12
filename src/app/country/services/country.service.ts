import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  public searchByCapital(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    return this.http.get<RESTCountry[]>(`${environment.API_URL}/capital/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRestCountryToCountryArray(resp)),
        catchError(error => {
          return throwError(() => new Error(`Not found any country with this term: ${query}`));
        })
      );
  }
}
