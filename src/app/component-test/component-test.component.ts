import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonButton, IonLoading } from '@ionic/angular/standalone';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Dialog } from '@capacitor/dialog';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-component-test',
  imports: [IonButton, IonLoading, MatButtonModule, MatDividerModule],
  standalone: true,
  templateUrl: './component-test.component.html',
  styleUrl: './component-test.component.scss',
})
export class ComponentTestComponent implements OnInit, OnDestroy {
  isDisabled = false;
  isLoading = false;
  lat: number | null = null;
  lng: number | null = null;
  watchId: string | null = null;
  city: string | null = null;

  constructor( private locationService: LocationService) {}


  async ngOnInit() {
  // Get initial location
    const pos = await this.locationService.getCurrentLocation();
    this.lat = pos.lat;
    this.lng = pos.lng;
    this.city = await this.locationService.getCityFromCoordinates(this.lat, this.lng);

    // Start watching
    this.watchId = await this.locationService.watchLocation((lat, lng) => {
      this.lat = lat;
      this.lng = lng;
    });
  }

  ngOnDestroy() {
    console.log(`ComponentTestComponent destroyed`);
  }

  onClick() {
    this.isLoading = true;
    console.log(`Button  clicked!`);
  }

  onLoadingDismissed() {
    this.isLoading = false;
  }

  async onPromptDialog() {
    const result = await Dialog.prompt( {
      message: 'Please enter your name',
    });
    console.log(`User entered: ${result}`);
  }
}
