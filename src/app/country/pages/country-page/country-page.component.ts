import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from "../../../shared/not-found/not-found.component";
import { CountryInformationComponent } from "./country-information/country-information.component";

@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  public countryCode = inject(ActivatedRoute).snapshot.params['code'];
  public countryService = inject(CountryService);

  public countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({request}) => {
      return this.countryService.searchCountryByAlphaCode(request.code);
    },
  });
}
