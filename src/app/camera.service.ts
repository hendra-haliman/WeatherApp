import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePhoto(): Promise<string | undefined> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl, // returns base64 data URL
      source: CameraSource.Camera
    });
    return photo.dataUrl;
  }

  async pickFromGallery(): Promise<string | undefined> {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    return photo.dataUrl;
  }
}
