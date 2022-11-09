import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { CommonService } from '../services/common.service';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  latLong = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private commonService: CommonService,
    private navController: NavController
  ) {}

  ionViewDidEnter() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((latLong) => {
      this.latLong = [+latLong.latitude, +latLong.longitude];
    });
  }

  getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((response) => {
        this.latLong = [response.coords.latitude, response.coords.longitude];
      })
      .catch((e) =>
        this.commonService.presentToaster({ message: 'Something went wrong!' })
      );
  }

  chooseLocation() {
    this.navController.navigateBack('/add-report', {
      queryParams: {
        lat: this.latLong[0],
        lon: this.latLong[1],
      },
    });
  }

  handleMapChange(event: Array<number>) {
    this.latLong = event;
  }
}
