import { Component, input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-icon',
  imports: [],
  templateUrl: './weather-icon.component.html',
  styleUrl: './weather-icon.component.scss'
})
export class WeatherIconComponent implements OnChanges {
  slug = input<string>();
  size = input<number>();
  style = input<'fill' | 'flat' | 'line' | 'monochrome'>('fill');
  src = '';

  async ngOnChanges() {
    // const mod = await import(`@meteocons/svg/${this.style}/${this.slug}.svg`);
    // this.src = mod.default;
    // console.log(this.src);
    this.src = `assets/meteocons/svg/${this.style()}/${this.slug()}.svg`;
  }
}
