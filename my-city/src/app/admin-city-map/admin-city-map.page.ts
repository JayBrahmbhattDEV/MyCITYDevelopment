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
    isAdminMode: boolean;

    private markersLayer: L.LayerGroup = L.layerGroup();

    ngOnInit() { }

    ionViewWillEnter() {
        if (history.state.uId) this.getUserPins();
        else this.getAllPins();
    }

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
            maxBounds: abadBounds,
            minZoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.markersLayer.addTo(this.map);

        const returnControl = L.control({ position: 'topright' });

        returnControl.onAdd = () => {
            const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
            button.innerHTML = '<ion-icon name="locate-sharp" color="citiconn" size="large"></ion-icon>';
            button.style.backgroundColor = 'white';
            button.style.border = 'none';

            button.onclick = () => {
                this.map.setView([23.049736, 72.511726], 12);
            };

            return button;
        };

        returnControl.addTo(this.map);
    }

    getAllPins() {
        this.reportService.getAllAdminPins().subscribe((res: any) => {
            this.pinsArray = res.data;
            this.pinsDefData = res.data;
            this.isAdminMode = true;
            if (this.pinsArray) this.addPinsToMap(this.pinsArray);
        });
    }

    getUserPins() {
        this.reportService.getPinsByUser(history.state.uId).subscribe((res: any) => {
            this.pinsArray = res.data;
            this.isAdminMode = false;
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
