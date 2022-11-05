import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Icon, LatLngExpression, Map, Marker, TileLayer } from 'leaflet';

@Component({
  selector: 'app-mc-map',
  templateUrl: './mc-map.component.html',
  styleUrls: ['./mc-map.component.scss'],
})
export class McMapComponent implements OnInit {
  @Input() latLong = [];
  @Input() disabled = false;
  @Output() mapChange = new EventEmitter();
  private map: Map;
  private marker: Marker;

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 2000);
  }

  initMap() {
    this.map = new Map('map').setView(this.latLong as LatLngExpression, 15);
    this.map.removeControl(this.map.zoomControl);
    if (this.disabled) {
      this.map.dragging.disable();
    }
    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.addMarkder();
  }

  addMarkder() {
    this.marker = new Marker(this.latLong, {
      icon: new Icon({
        iconUrl: './assets/images/marker-icon.png',
      }),
      draggable: !this.disabled,
    }).addTo(this.map);
    this.marker.addEventListener('dragend', (_: any) => {
      this.latLong = [
        ...[+this.marker.getLatLng().lat, +this.marker.getLatLng().lng],
      ];
      this.mapChange.emit(this.latLong);
    });
  }
}
