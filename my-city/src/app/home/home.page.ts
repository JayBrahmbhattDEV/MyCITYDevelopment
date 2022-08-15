import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon, Map, Marker, TileLayer } from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: Map;
  latLong: any = { lat: 23.030357, lon: 72.517845 };
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((response) => {
      if (response.lat) {
        this.latLong = response;
      }
    });
  }

  ionViewDidEnter() {
    this.map = new Map('map').setView([this.latLong.lon, this.latLong.lat], 15);
    this.map.removeControl(this.map.zoomControl);
    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const marker = new Marker([this.latLong.lon, this.latLong.lat], {
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
}
