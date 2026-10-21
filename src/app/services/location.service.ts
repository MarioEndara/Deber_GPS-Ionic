import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus, Position, WatchPositionCallback } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  async ensurePermissions(): Promise<PermissionStatus> {
    const perm = await Geolocation.checkPermissions();
    if (perm.location === 'granted' || perm.coarseLocation === 'granted') return perm;
    return Geolocation.requestPermissions();
  }

  async getCurrentPosition(): Promise<Position> {
    return Geolocation.getCurrentPosition({ enableHighAccuracy: true });
  }

  async watchPosition(callback: WatchPositionCallback) {
    return Geolocation.watchPosition({ enableHighAccuracy: true }, callback);
  }

  async clearWatch(watchId: string) {
    return Geolocation.clearWatch({ id: watchId });
  }

}