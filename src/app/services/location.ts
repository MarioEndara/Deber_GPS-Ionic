import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class LocationService {

  async ensurePermissions(): Promise<PermissionStatus> {
    // Pide permisos si no están concedidos
    const perm = await Geolocation.checkPermissions();
    if (perm.location === 'granted' || perm.coarseLocation === 'granted') return perm;
    return Geolocation.requestPermissions();
  }

  async getCurrentPosition(): Promise<Position> {
    return Geolocation.getCurrentPosition({ enableHighAccuracy: true });
  }

}
