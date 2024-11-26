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
    pinsArray: any[];
    reportService = inject(ReportsService);
    pinUrl: string = './assets/icon/pin.svg'

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
        this.map = L.map('map', {
            center: [23.049736, 72.511726],
            zoom: 12,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
    }

    getAllPins() {
        this.reportService.getAllAdminPins().subscribe((res: any) => {
            this.pinsArray = res.data;
            if (this.pinsArray) this.addPinsToMap();
        });
    }

    addPinsToMap() {
        this.pinsArray.forEach(pin => {
            const customIcon = L.icon({
                iconUrl: this.pinUrl,
                iconSize: [30, 50],
                iconAnchor: [15, 50],
                popupAnchor: [0, -50]
            });

            const marker = L.marker([pin.latitude, pin.longitude], { icon: customIcon }).addTo(this.map)
                .bindPopup(`<b>Location</b><br>Lat: ${pin.latitude}<br>Lng: ${pin.longitude}`);
        });

        document.querySelector('.leaflet-pane .leaflet-popup-pane')!.addEventListener('click', event => {
            event.preventDefault();
        });
    }

}
