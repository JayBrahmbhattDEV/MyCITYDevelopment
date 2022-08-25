import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private readonly androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private readonly navController: NavController
  ) {}

  checkGPSPermission() {
    return this.androidPermissions.hasPermission(
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    );
  }

  reqestGPSPermission() {
    return this.androidPermissions.requestPermission(
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    );
  }

  enableGPS() {
    return this.locationAccuracy.request(
      this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
    );
  }
}
