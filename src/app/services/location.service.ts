import { inject, Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private platformService = inject(PlatformService);

  async getCurrentLocation() {
    if (this.platformService.isAndroid()) {
      const permResult = await Geolocation.requestPermissions();
      if (permResult.location !== 'granted') {
        throw new Error('Location permission not granted');
      }
    }
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true, // Uses GPS hardware/mock location directly
      timeout: 15000,           // 15 seconds (default is often too short for emulator)
      maximumAge: 3000          // Accepts a cached position up to 3 seconds old
    });
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
  }

  watchLocation(callback: (lat: number, lng: number) => void) {
    const id = Geolocation.watchPosition({}, (pos, err) => {
      if (pos) {
        callback(pos.coords.latitude, pos.coords.longitude);
      }
    });
    return id;
  }

  async getCityFromCoordinates(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || data.address.county;
  }

  clearWatch(id: string) {
    Geolocation.clearWatch({ id });
  }
}
