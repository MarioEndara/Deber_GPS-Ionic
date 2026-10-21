import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonText, IonIcon
} from '@ionic/angular';
import { LocationService } from '../services/location.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton,
    IonIcon
  ]
})
export class Tab1Page implements OnInit, OnDestroy {
  private loc = inject(LocationService);

  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  // NUEVO: URLs requeridas por el deber para los puntos 1 y 2
  get siteUrl(): string {
    const lat = this.latitude() ?? -0.2025464;
    const lng = this.longitude() ?? -78.4941719;
    return `https://www.google.com/maps/@${lat},${lng}`;
  }

  public routeUrl: string = "https://www.google.com/maps/dir/?api=1&origin=-0.180653,-78.467838&destination=-0.229415,-78.524581&waypoints=-0.201452,-78.498124%7C-0.220164,-78.512328";

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.iniciarSeguimiento();
  }

  async iniciarSeguimiento() {
    try {
      this.watchId = await this.loc.watchPosition((position, err) => {
        if (err) {
          this.errorMsg.set(err.message);
          return;
        }
        if (position) {
          this.latitude.set(position.coords.latitude);
          this.longitude.set(position.coords.longitude);
          this.errorMsg.set(null);
        }
      });
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al iniciar el seguimiento en tiempo real');
    }
  }

  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.latitude.set(pos.coords.latitude);
      this.longitude.set(pos.coords.longitude);
      this.errorMsg.set(null);
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al obtener la ubicación actual');
    }
  }

  getCurrentPosition() {
    this.obtenerUbicacionActual();
  }

  clearPosition() {
    this.latitude.set(null);
    this.longitude.set(null);
    this.errorMsg.set(null);
    if (this.watchId) {
      this.loc.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // NUEVO: Métodos 3 y 4 para guardar los archivos .txt usando Capacitor
  async guardarUbicacionTxt() {
    try {
      await Filesystem.writeFile({
        path: 'mi_ubicacion_gps.txt',
        data: `Ubicacion GPS actual:\n${this.siteUrl}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert('¡Ubicación guardada en Documentos/mi_ubicacion_gps.txt!');
    } catch (error) {
      console.error('Error al guardar ubicación', error);
      alert('Error al guardar el archivo de ubicación');
    }
  }

  async guardarRutaTxt() {
    try {
      await Filesystem.writeFile({
        path: 'mi_ruta_interes.txt',
        data: `Enlace de Ruta:\n${this.routeUrl}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert('¡Ruta guardada en Documentos/mi_ruta_interes.txt!');
    } catch (error) {
      console.error('Error al guardar ruta', error);
      alert('Error al guardar el archivo de ruta');
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      this.loc.clearWatch(this.watchId);
    }
  }
}