import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Region } from '../../types/region.type';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';

function validateQueryParam(queryParam: string): Region {
  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'app-by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region.component.html',
})
export class ByRegionComponent {
  public countryService = inject(CountryService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);

  public queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';
  public selectedRegion = linkedSignal<Region>(() => validateQueryParam(this.queryParam));

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  public selectRegion(region: Region): void {
    this.selectedRegion.set(region);
  }

  public countryResource = rxResource({
    request: () => ({region: this.selectedRegion()}),
    loader: ({request}) => {
      if(!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: request.region,
        },
      });

      return this.countryService.searchByRegion(request.region);
    },
  });
}
