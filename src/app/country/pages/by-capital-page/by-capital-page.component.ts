import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  public countryService = inject(CountryService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  public queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  public query = linkedSignal(() => this.queryParam);

  public cleanQueryParams() {
    this.router.navigate(['/country/by-capital'], {
      queryParams: { },
    });
  }

  public countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if(!request.query) {
        this.cleanQueryParams();
        return of([]);
      }

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: request.query,
        },
      });

      return this.countryService.searchByCapital(request.query);
    },
  });
}
