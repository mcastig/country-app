import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { CountryListComponent } from "../../components/country-list/country-list.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  public countryService = inject(CountryService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  public queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  public query = linkedSignal(() => this.queryParam);

  public countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if(!request.query) return of([]);

      this.router.navigate(['/country/by-country'], {
        queryParams: {
          query: request.query,
        },
      });

      return this.countryService.searchByCountry(request.query);
    },
  });
}
