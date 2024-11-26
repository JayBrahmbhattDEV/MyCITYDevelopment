import { Component, inject, OnInit } from '@angular/core';
import L from 'leaflet';
import { ReportsService } from '../services/reports.service';

@Component({
    selector: 'cc-admin-city-map',
    templateUrl: './admin-city-map.page.html',
    styleUrls: ['./admin-city-map.page.scss'],
})
export class AdminCityMapPage implements OnInit {
    map: any;
    pinsArray: any[] = [];
    pinsDefData: any[] = [];
    reportService = inject(ReportsService);
    pinUrl: string = './assets/icon/pin.svg';
    pendingPin: string = './assets/icon/pending-pin.svg';

    private markersLayer: L.LayerGroup = L.layerGroup();

    ngOnInit() { }

    ionViewWillEnter() {
        this.getAllPins();
    }

    ngAfterViewInit() {
        this.initializeMap();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }

    initializeMap() {
        const abadBounds = L.latLngBounds(
            L.latLng(22.1290, 71.4850),
            L.latLng(23.9690, 73.6350)
        );

        this.map = L.map('map', {
            center: [23.049736, 72.511726],
            zoom: 12,
            maxBounds: abadBounds,
            minZoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.markersLayer.addTo(this.map);
    }

    getAllPins() {
        this.reportService.getAllAdminPins().subscribe((res: any) => {
            this.pinsArray = res.data;
            this.pinsDefData = res.data;
            if (this.pinsArray) this.addPinsToMap(this.pinsArray);
        });
    }

    addPinsToMap(pins: any[]) {
        this.markersLayer.clearLayers();

        pins.forEach(pin => {
            const iconUrl = pin.isPending ? this.pendingPin : this.pinUrl;

            const customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [30, 50],
                iconAnchor: [15, 50],
                popupAnchor: [0, -50]
            });

            const marker = L.marker([pin.location.latitude, pin.location.longitude], { icon: customIcon })
                .addTo(this.markersLayer)
                .bindPopup(`<b>Location</b><br>Lat: ${pin.location.latitude}<br>Lng: ${pin.location.longitude}`);
        });
    }

    pinViewToggle(eve: any) {
        if (eve.target.value == 'Pending') {
            const pendingPins = this.pinsArray.filter((x: any) => x.isPending);
            this.addPinsToMap(pendingPins);
        }
        else {
            this.addPinsToMap(this.pinsDefData);
        }
    }
}
