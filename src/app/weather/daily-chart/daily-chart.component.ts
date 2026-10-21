import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { inject } from '@angular/core';

@Component({
  selector: 'app-daily-chart',
  imports: [],
  templateUrl: './daily-chart.component.html',
  styleUrl: './daily-chart.component.scss',
})
export class DailyChartComponent {
  lineChartData!: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };
}
