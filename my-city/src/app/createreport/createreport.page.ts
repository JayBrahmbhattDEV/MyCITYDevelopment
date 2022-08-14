import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IssueList } from '../constants/constant';
import leaflet from 'leaflet';
import { AlertController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

@Component({
  selector: 'app-createreport',
  templateUrl: './createreport.page.html',
  styleUrls: ['./createreport.page.scss'],
})
export class CreatereportPage implements OnInit {
  @ViewChild('map') mapContainer: ElementRef;
  map: any
  issueList = IssueList;
  constructor(private alertController: AlertController,
    private nativeGeocoder: NativeGeocoder) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loadmap();
  }
  
  loadmap(){
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:16
}).addTo(this.map);
  }

  async addMarker(){
    let prompt = await this.alertController.create({
      header: "Add Marker",
      message: "Enter location",
      inputs: [
        {
          name: 'city',
          placeholder: 'City'
        },
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log('Cancel clicked')
          }
        },
        {
          text: "Save",
          handler: data => {
            this.geoCodeandAdd(data.city);
          }
        },
      ]
    })
    await prompt.present();
  }

  geoCodeandAdd(city){
    this.nativeGeocoder.forwardGeocode(city)
  .then((coordinates: NativeGeocoderResult[]) => {
   let markerGroup = leaflet.featureGroup();
  let marker: any = leaflet.marker([coordinates[0].latitude, coordinates[0].longitude]).
  on('click', () => {
    alert('Marker clicked');
  })
  markerGroup.addLayer(marker);
  this.map.addLayer(markerGroup);
  })
  .catch((error: any) => console.log(error));
  }
}
