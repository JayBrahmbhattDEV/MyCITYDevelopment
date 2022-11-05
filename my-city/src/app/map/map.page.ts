import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon, LatLngExpression, Map, Marker, TileLayer } from 'leaflet';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { CommonService } from '../services/common.service';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  map: Map;
  marker: Marker;
  latVal: any;
  longVal: any;
  latLong: LatLngExpression = [23.049736, 72.511726];
  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private commonService: CommonService,
    private navController: NavController // private nativeGeocoder: NativeGeocoder
  ) {}

  ionViewDidEnter() {
    // this.activatedRoute.queryParams.pipe(take(1)).subscribe((latLong) => {
    //   this.latLong = [
    //     +latLong.latitude,
    //     +latLong.longitude,
    //   ] as LatLngExpression;
    //   this.map = new Map('map').setView(this.latLong as LatLngExpression, 15);
    //   this.map.removeControl(this.map.zoomControl);
    //   new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '© OpenStreetMap',
    //   }).addTo(this.map);
    //   this.marker = new Marker(this.latLong, {
    //     icon: new Icon({
    //       iconUrl: './assets/images/marker-icon.png',
    //     }),
    //     draggable: true,
    //   }).addTo(this.map);
    //   this.marker.addEventListener('dragend', (_: any) => {
    //     this.latLong = [
    //       +this.marker.getLatLng().lat,
    //       +this.marker.getLatLng().lng,
    //     ];
    //   });
    // });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((response) => {
        this.latLong = [response.coords.latitude, response.coords.longitude];
        this.marker.setLatLng([
          response.coords.latitude,
          response.coords.longitude,
        ]);
        this.map.flyTo(
          [response.coords.latitude, response.coords.longitude],
          15
        );
      })
      .catch((e) =>
        this.commonService.presentToaster({ message: 'Something went wrong!' })
      );
  }

  chooseLocation() {
    this.navController.navigateBack('/add-report', {
      queryParams: {
        lat: this.latVal,
        lon: this.longVal,
      },
    });
  }

  handleMapChange(event: LatLngExpression) {
    this.latLong = event;
  }

  // async getAddress() {
  //   const address = await this.nativeGeocoder.reverseGeocode(
  //     this.latVal,
  //     this.latLong
  //   );
  //   console.log({ address });
  // }
}
