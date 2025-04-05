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
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.loadWards()

  }

  loadWards() {
    fetch('./assets/ahmedabad_wards_map_2024.geojson')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load GeoJSON file');
        return response.json();
      })
      .then(geojsonData => {
        const getRandomColor = () => {
          return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        };

        L.geoJSON(geojsonData, {
          style: () => ({
            color: getRandomColor(),
            weight: 2,
            fillColor: getRandomColor(),
            fillOpacity: 0.6
          }),
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              const wardName = feature.properties.ward_lgd_name || 'Unknown';
              layer.bindPopup(wardName, {
                closeButton: true
              }).openPopup(e.latlng);
            });

            this.map.on('popupopen', (e) => {
              const closeBtn = document.querySelector('.leaflet-popup-close-button') as HTMLAnchorElement;
              if (closeBtn) {
                closeBtn.removeAttribute('href');
              }
            });
          }
        }).addTo(this.map);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }


}
