import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Icon, LatLngExpression, Map, Marker, TileLayer } from 'leaflet';

@Component({
  selector: 'app-mc-map',
  templateUrl: './mc-map.component.html',
  styleUrls: ['./mc-map.component.scss'],
})
export class McMapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @Input() latLong = [];
  @Input() disabled = false;
  @Output() mapChange = new EventEmitter();
  mapZoom = 15;
  private map: Map;
  private marker: Marker;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.latLong.firstChange && this.map && this.latLong.length) {
      this.marker.setLatLng(this.latLong);
      this.map.flyTo(this.latLong, this.mapZoom);
    }
  }

  initMap() {
    this.mapContainer.nativeElement.style.height = '100%';
    this.map = new Map(this.mapContainer.nativeElement).setView(
      this.latLong as LatLngExpression,
      this.mapZoom
    );
    this.map.removeControl(this.map.zoomControl);
    if (this.disabled) {
      this.map.dragging.disable();
      this.map.zoomControl = false;
    }
    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      zoomControl: false,
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
