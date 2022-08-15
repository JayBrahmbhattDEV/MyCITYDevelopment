import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
})
export class SearchLocationPage implements OnInit {
  provider = new OpenStreetMapProvider();
  locations = [];
  constructor(
    private navController: NavController
  ) {}

  ngOnInit() {}

  searchLocation($event: any) {
    const searchTerm = $event.detail.value;

    this.provider
      .search({
        query: searchTerm,
      })
      .then((response) => {
        this.locations = response;
      });
  }

  chooseLocation(location) {
    this.navController.navigateBack('/home',{
      queryParams: {
        lat: location.x,
        lon: location.y,
        address: location.label
      },
    });
  }
}
