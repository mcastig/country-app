import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  public searchByCapital(query: string) {
    query = query.toLocaleLowerCase();

    return this.http.get(`${environment.API_URL}/capital/${query}`);
  }
}
