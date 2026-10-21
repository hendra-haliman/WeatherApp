// platform.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  getPlatform(): string {
    return Capacitor.getPlatform(); // 'android', 'ios', 'web'
  }

  isAndroid(): boolean {
    return this.getPlatform() === 'android';
  }

  isIOS(): boolean {
    return this.getPlatform() === 'ios';
  }

  isWeb(): boolean {
    return this.getPlatform() === 'web';
  }

  // Optional: combine with Ionic's Platform for finer checks
  isMobile(): boolean {
    return this.platform.is('mobile');
  }

  constructor(private platform: Platform) {}
}
