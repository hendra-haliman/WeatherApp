import { Component, input, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from "@ionic/angular/standalone";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { WeatherIconComponent } from '../../weather-icon/weather-icon.component';

@Component({
  selector: 'app-current-weather',
  imports: [IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent,
     WeatherIconComponent],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent implements OnInit {
  location    = input<string | null>();
  temp        = input<number | null>();
  wind_speed    = input<number | null>();
  weatherCond = input<string | null>();
  icon        = input<string | undefined>();

  // Example hourly data
  hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  temps = [24, 23, 22, 26, 30, 32, 28, 25];

  lineChartData!: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } }
  };

  // Preload the image as a class property
  sunsetIcon!: HTMLImageElement;

  constructor() {
  }

  ngOnInit() {
    this.sunsetIcon = new Image(36, 36);
    this.sunsetIcon.src = 'assets/meteocons/svg/fill/sunset.svg';

    this.lineChartData = {
      labels: this.hours,
        datasets: [
          {
            data: this.temps,
            label: 'Temperature (°C)',
            fill: false,
            // borderColor: '#42A5F5',
            // backgroundColor: 'rgba(66,165,245,0.2)',
            tension: 0.4,
            //pointStyle: new Image(64,64).src = 'assets/meteocons/svg/fill/sunset.svg',
            pointStyle: this.sunsetIcon,
            pointRadius: 30

          }
        ]
    };
  }


}
