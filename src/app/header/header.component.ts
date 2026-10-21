import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
   title: string = 'Weather App';
}
