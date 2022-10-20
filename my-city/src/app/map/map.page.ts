import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon, LatLngExpression, Map, Marker, TileLayer } from 'leaflet';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { CommonService } from '../services/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: Map;
  marker: Marker;
  latVal: any;
  longVal: any;
  latLong: LatLngExpression = [23.030357, 72.517845];
  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private commonService: CommonService,
    private navController: NavController
  ) {}

  ngOnInit(): void {}

  ionViewDidEnter() {
    this.getCurrentLocation();
    this.map = new Map('map').setView([0, 0], 15);
    this.map.removeControl(this.map.zoomControl);
    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.marker = new Marker(this.latLong, {
      icon: new Icon({
        iconUrl: './assets/images/marker-icon.png',
      }),
      draggable: true,
    }).addTo(this.map);
    this.marker.addEventListener('dragend', (e) => {
      this.latVal = this.marker.getLatLng().lat;
      this.longVal = this.marker.getLatLng().lng;
    });
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
          13
        );
        this.marker;
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
}
