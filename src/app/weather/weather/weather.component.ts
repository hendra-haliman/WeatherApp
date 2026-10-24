import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';

type InstantWeatherData = {
  time: string;
  temperature: number | null;
  wind_speed: number | null;
  cloud_cover: number | undefined;
  is_day: number | undefined;
  condition: string | null;
  weather_code: number | undefined;
  icon: string | null;
};

type WeatherData = {
  current: InstantWeatherData;
  weekly: Record<string, InstantWeatherData[]>;
};

@Component({
  selector: 'app-weather',
  imports: [IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CurrentWeatherComponent,
    BaseChartDirective,
    DatePipe
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  private httpClient = inject(HttpClient);
  lat: number | null = null;
  lng: number | null = null;
  watchId: string | null = null;
  // weatherData: any = null;
  weatherData: WeatherData | null = null;
  location: string | null = null;
  temp: number | null = null;
  cloudCover: number | undefined;
  isDay: number | undefined;



  lineChartData!: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  sunsetIcon!: HTMLImageElement;

  isLoading = true;

  constructor(private locationService: LocationService) { }

  async ngOnInit() {
    this.sunsetIcon = new Image(36, 36);
    this.sunsetIcon.src = 'assets/meteocons/svg/fill/sunset.svg';

    const pos = await this.locationService.getCurrentLocation();
    this.lat = pos.lat;
    this.lng = pos.lng;

    // Start watching
    this.watchId = await this.locationService.watchLocation((lat : number, lng : number) => {
      this.lat = lat;
      this.lng = lng;
    });

    this.httpClient
      .get(
        'https://api.open-meteo.com/v1/forecast?timezone=Asia%2FBangkok&latitude=' +
        this.lat +
        '&longitude=' +
        this.lng +
        '&current=weather_code,temperature_2m,wind_speed_10m,cloud_cover,is_day&hourly=weather_code,temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,is_day',
      )
      .subscribe((data: any) => {
        console.log('Data from API:', data);

        this.weatherData = {
          current: {
            time: data.current?.time ?? null,
            temperature: data.current?.temperature_2m ?? null,
            wind_speed: data.current?.wind_speed_10m ?? null,
            cloud_cover: data.current?.cloud_cover ?? null,
            is_day: data.current?.is_day ?? null,
            weather_code: data.current?.weather_code ?? null,
            condition: this.getWeatherCondition(
              data.current?.weather_code,
              data.current?.cloud_cover,
              data.current?.is_day,
            ).label,
            icon: this.getWeatherCondition(
              data.current?.weather_code,
              data.current?.cloud_cover,
              data.current?.is_day,
            ).icon,
          },
          weekly: this.groupHourlyByDay(data),
        };

        console.log('Processed weatherData:', this.weatherData);
        // Get the first day’s key from weekly
        const firstDayKey = this.weatherData?.weekly
          ? Object.keys(this.weatherData.weekly)[0]
          : null;

        const firstDayData = firstDayKey
          ? this.weatherData!.weekly[firstDayKey]
          : [];

        this.lineChartData = {
          labels: firstDayData.map((d) => d.time.split('T')[1]), // hours of the day
          datasets: [
            {
              data: firstDayData.map((d) => d.temperature),
              label: `Temperature (°C) - ${firstDayKey}`,
              fill: false,
              tension: 0.4,
              pointStyle: firstDayData.map((d) => {
                const iconName = this.getWeatherCondition(
                  d.weather_code,
                  d.cloud_cover,
                  d.is_day
                ).icon;

                // Create an <img> for each condition
                const img = new Image(24, 24);
                img.src = `assets/meteocons/svg/fill/${iconName}.svg`;
                // console.log(`Point style for ${d.time}: ${iconName}`);
                return img;
              }),
              pointRadius: 10,
            },
            {
              data: firstDayData.map((d) => d.wind_speed),
              label: `Wind speed (km/h) - ${firstDayKey}`,
              fill: false,
              tension: 0.4,

            },
          ],
        };
      });

    this.httpClient
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lng}`,
      )
      .subscribe((data: any) => {
        console.log('Location data from API:', data);
        this.location =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          null;
      });

      this.isLoading = false; // Set loading to false after data is fetched
  }

  onWeeklyItemClick(item: [string, InstantWeatherData[]]) {
    const [date, hourlyData] = item;
    alert(`Clicked on ${date}. Hourly data: ${JSON.stringify(hourlyData)}`);
  }

  getWeatherCondition(
    weathercode?: number,
    cloudcover?: number,
    is_day?: number,
  ): { label: string; icon: string } {
    // First priority: use weathercode if available
    if (weathercode !== undefined) {
      const weatherMap: Record<number,
                                { day: string;
                                  night: string;
                                  iconDay: string;
                                  iconNight: string }> = {
        0: {
          day: 'Sunny',
          night: 'Clear Night',
          iconDay: 'clear-day',
          iconNight: 'clear-night',
        },
        1: {
          day: 'Mostly Sunny',
          night: 'Mostly Clear',
          iconDay: 'mostly-clear-day',
          iconNight: 'mostly-clear-night',
        },
        2: {
          day: 'Partly Cloudy',
          night: 'Partly Cloudy Night',
          iconDay: 'partly-cloudy-day',
          iconNight: 'partly-cloudy-night',
        },
        3: {
          day: 'Cloudy',
          night: 'Cloudy',
          iconDay: 'cloudy',
          iconNight: 'cloudy',
        },
        45: {
          day: 'Foggy',
          night: 'Foggy',
          iconDay: 'fog-day',
          iconNight: 'fog-night',
        },
        48: {
          day: 'Rime Fog',
          night: 'Rime Fog',
          iconDay: 'fog-day',
          iconNight: 'fog-night',
        },
        51: {
          day: 'Light Drizzle',
          night: 'Light Drizzle',
          iconDay: 'drizzle',
          iconNight: 'drizzle',
        },
        53: {
          day: 'Drizzle',
          night: 'Drizzle',
          iconDay: 'drizzle',
          iconNight: 'drizzle',
        },
        55: {
          day: 'Heavy Drizzle',
          night: 'Heavy Drizzle',
          iconDay: 'extreme-drizzle',
          iconNight: 'extreme-drizzle',
        },
        61: {
          day: 'Light Rain',
          night: 'Light Rain',
          iconDay: 'rain',
          iconNight: 'rain',
        },
        63: { day: 'Rain', night: 'Rain', iconDay: 'rain', iconNight: 'rain' },
        65: {
          day: 'Heavy Rain',
          night: 'Heavy Rain',
          iconDay: 'extreme-day-rain',
          iconNight: 'extreme-night-rain',
        },
        71: {
          day: 'Light Snow',
          night: 'Light Snow',
          iconDay: 'snow',
          iconNight: 'snow',
        },
        73: { day: 'Snow', night: 'Snow', iconDay: 'snow', iconNight: 'snow' },
        75: {
          day: 'Heavy Snow',
          night: 'Heavy Snow',
          iconDay: 'extreme-day-snow',
          iconNight: 'extreme-night-snow',
        },
        80: {
          day: 'Light Showers',
          night: 'Light Showers',
          iconDay: 'raindrops',
          iconNight: 'raindrops',
        },
        81: {
          day: 'Showers',
          night: 'Showers',
          iconDay: 'raindrops',
          iconNight: 'raindrops',
        },
        82: {
          day: 'Heavy Showers',
          night: 'Heavy Showers',
          iconDay: 'raindrops',
          iconNight: 'raindrops',
        },
        95: {
          day: 'Thunderstorm',
          night: 'Thunderstorm',
          iconDay: 'thunderstorm-day',
          iconNight: 'thunderstorm-night',
        },
        96: {
          day: 'Thunderstorm (hail)',
          night: 'Thunderstorm (hail)',
          iconDay: 'thunderstorm-day-hail',
          iconNight: 'thunderstorm-day-hail',
        },
        99: {
          day: 'Severe Thunderstorm',
          night: 'Severe Thunderstorm',
          iconDay: 'thunderstorm-extreme-day',
          iconNight: 'thunderstorm-extreme-night',
        },
      };

      const mapping = weatherMap[weathercode];
      if (mapping) {
        return is_day === 1
          ? { label: mapping.day, icon: mapping.iconDay }
          : { label: mapping.night, icon: mapping.iconNight };
      }
      return { label: 'Unknown', icon: 'unknown' };
    }

    // Fallback: cloudcover
    if (cloudcover !== undefined) {
      if (cloudcover <= 20)
        return is_day === 1
          ? { label: 'Sunny', icon: 'clear-day' }
          : { label: 'Clear Night', icon: 'clear-night' };
      if (cloudcover <= 50)
        return {
          label: 'Partly Cloudy',
          icon: is_day === 1 ? 'partly-cloudy-day' : 'partly-cloudy-night',
        };
      if (cloudcover <= 80) return { label: 'Mostly Cloudy', icon: 'cloudy' };
      return { label: 'Overcast', icon: 'cloudy' };
    }

    return { label: 'Unknown', icon: 'unknown' };
  }

  groupHourlyByDay(data: any): Record<string, InstantWeatherData[]> {
    const grouped: Record<string, any[]> = {};

    data.hourly.time.forEach((time: string, index: number) => {
      const dateKey = data.hourly.time[index].split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push({
        time: data.hourly.time[index],
        temperature: data.hourly.temperature_2m[index],
        wind_speed: data.hourly.wind_speed_10m[index],
        cloud_cover: data.hourly.cloud_cover?.[index] ?? null,
        is_day: data.hourly.is_day[index],
        condition: this.getWeatherCondition(
          data.hourly.weather_code?.[index],
          data.hourly.cloud_cover?.[index],
          data.hourly.is_day[index],
        ).label,
      });
    });

    return grouped; // array of 7 arrays (one per day)
  }

  get weeklyEntries() {
    return this.weatherData ? Object.entries(this.weatherData.weekly) : [];
  }

  get currentHourlyData() {
    if (!this.weatherData) return [];
    const today = new Date().toISOString().split('T')[0];
    return this.weatherData.weekly[today] || [];
  }

  onUpdateChartForDay(date: string) {
    if (!this.weatherData) return;
    const firstDayData = this.weatherData.weekly[date] || [];

    this.lineChartData = {
      labels: firstDayData.map((d) => d.time.split('T')[1]), // hours of the day
      datasets: [
        {
          data: firstDayData.map((d) => d.temperature),
          label: `Temperature (°C) - ${date}`,
          fill: false,
          tension: 0.4,
          pointStyle: firstDayData.map((d) => {
            const iconName = this.getWeatherCondition(
              d.weather_code,
              d.cloud_cover,
              d.is_day
            ).icon;

            // Create an <img> for each condition
            const img = new Image(24, 24);
            img.src = `assets/meteocons/svg/fill/${iconName}.svg`;
            // console.log(`Point style for ${d.time}: ${iconName}`);
            return img;
          }),
          pointRadius: 10,
        },
        {
              data: firstDayData.map((d) => d.wind_speed),
              label: `Wind speed (km/h) - ${date}`,
              fill: false,
              tension: 0.4,

            },
      ],
    };

  }
}
