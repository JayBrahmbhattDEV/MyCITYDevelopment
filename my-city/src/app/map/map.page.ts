import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon, Map, Marker, TileLayer } from 'leaflet';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: Map;
  latLong = [23.030357, 72.517845];
  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private commonService: CommonService
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

    const marker = new Marker(this.latLong, {
      icon: new Icon({
        iconUrl: './assets/images/marker-icon.png',
      }),
      draggable: true,
    }).addTo(this.map);

    marker.addEventListener('dragend', (e) => {
      console.log(marker.getLatLng().lat);
      console.log(marker.getLatLng().lng);
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((response) => {
        this.latLong = [];
        this.latLong.push(response.coords.latitude);
        this.latLong.push(response.coords.longitude);
        this.map.flyTo(
          [response.coords.latitude, response.coords.longitude],
          13
        );

        console.log(this.latLong);
      })
      .catch((e) => 
      this.commonService.presentToaster({message:"Something went wrong!"})
      );
  }
}
