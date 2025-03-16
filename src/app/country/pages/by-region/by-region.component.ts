import { Component, inject, signal } from '@angular/core';
import { Region } from '../../types/region.type';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region.component.html',
})
export class ByRegionComponent {
  public countryService = inject(CountryService);
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  public selectedRegion = signal<Region | null>(null);

  public selectRegion(region: Region): void {
    this.selectedRegion.set(region);
  }

  public countryResource = rxResource({
    request: () => ({region: this.selectedRegion()}),
    loader: ({request}) => {
      if(!request.region) return of([]);
      return this.countryService.searchByRegion(request.region);
    },
  });
}
