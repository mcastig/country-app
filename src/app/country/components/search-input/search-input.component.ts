import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  public placeholder = input<string>('Search...');
  public searchValue = output<string>();
  public debounceTime = input<number>(1000);
  public initialValue = input<string>();
  public inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  public debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.searchValue.emit(value);
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
