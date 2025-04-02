import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-kml';

@Component({
  selector: 'cc-gis-map',
  templateUrl: './gis-map.page.html',
  styleUrls: ['./gis-map.page.scss'],
})
export class GisMapPage implements OnInit, AfterViewInit {
  map: any;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initializeMap();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  initializeMap() {
    const abadBounds = L.latLngBounds(
      L.latLng(22.2840, 71.6850),
      L.latLng(23.6640, 73.4100)
    );

    this.map = L.map('map', {
      center: [23.049736, 72.511726],
      zoom: 12,
      setMaxmaxBounds: abadBounds,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.loadKML()
  }

  loadKML() {
    const kmlUrl = './assets/ahmedabad_wards_map_2024.kml';
  
    fetch(kmlUrl)
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        const kmlLayer = new L.KML(kml);
        this.map.addLayer(kmlLayer);
  
        const kmlBounds = kmlLayer.getBounds();
        if (kmlBounds.isValid()) {
          this.map.fitBounds(kmlBounds);
        }
  
        setTimeout(() => {
          this.map.setView([23.0225, 72.5714], 11);
        }, 1000);
      })
      .catch((err) => console.error('Error loading KML:', err));
  }
  

}
