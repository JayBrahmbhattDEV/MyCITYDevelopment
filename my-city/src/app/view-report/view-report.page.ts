import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';
import { NativeGeocoder, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { getLatLong, STORAGE_KEYS } from '../utils/constants';
import { PermissionService } from '../enable-permission/permission.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  report: any;
  isPending: any;
  userId: any;
  isAdmin: any;
  isMapLoading = true;
  latLong = [23.049736, 72.511726];
  nativeGeocoder = inject(NativeGeocoder);
  permissionService = inject(PermissionService);
  modalController = inject(ModalController);
  navController = inject(NavController);
  geolocation = inject(Geolocation);
  storageService = inject(StorageService);
  platform = inject(Platform);
  enablePermissionModal: HTMLIonModalElement;
  paramsObject: any;
  latLon = {
    latitude: '',
    longitude: '',
  };
  platformType: string;
  locationCoords: any;

  constructor(
    private readonly reportService: ReportsService,
    private readonly router: Router,
    private commonService: CommonService
  ) {
    this.platformType = this.platform.is('ios') ? 'ios' : 'android';
  }

  ngOnInit() {
    this.report = this.router.getCurrentNavigation().extras.state;
    this.locationCoords = getLatLong(this.report.location);
    this.getAddress(this.locationCoords.latitude, this.locationCoords.longitude);
  }

  ionViewWillEnter() {
    this.isPending = this.report.isPending;
    this.userId = this.report._id;
    this.isAdmin = this.storageService.getData(STORAGE_KEYS.IS_ADMIN);
  }

  getReportDetails(reportId: string) {
    this.reportService.getReport(reportId).subscribe((report) => { });
  }

  approveReport() {
    this.reportService.approveReport(this.userId, {
      "isPending": false
    }).subscribe((res: any) => {
      console.log(res);
      this.commonService.presentToaster({ message: "Report closed successfully!", color: 'success' });
      this.router.navigateByUrl('/reports');
    });
  }

  getAddress(latitude: number, longitude: number) {
    this.nativeGeocoder
      .reverseGeocode(latitude, longitude, {
        useLocale: true,
        maxResults: 1,
        defaultLocale: 'en_IN',
      })
      .then((locations: NativeGeocoderResult[]) => {
        const nativeGeocoderResult = locations[0];
        this.latLon.latitude = nativeGeocoderResult.latitude;
        this.latLon.longitude = nativeGeocoderResult.longitude;
        this.latLong = [+this.latLon.latitude, +this.latLon.longitude];
        this.isMapLoading = false;
      })
      .catch((e) => {
        console.error("Error in reverse geocode:", e);
      });
  }

  openInMaps() {
    const { latitude, longitude } = this.locationCoords;
    let url = '';

    if (this.platformType === 'ios') {
      url = `maps:${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    window.open(url, '_system');
  }

}
