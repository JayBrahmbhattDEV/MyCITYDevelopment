import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';
import { NativeGeocoder, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { getLatLong } from '../utils/constants';
import { PermissionService } from '../enable-permission/permission.service';
import { ModalController, NavController } from '@ionic/angular';
import { PermissionsPage } from '../shared/modals/permissions/permissions.page';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

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
  enablePermissionModal: HTMLIonModalElement;
  paramsObject: any;
  latLon = {
    latitude: '',
    longitude: '',
  };

  constructor(
    private readonly reportService: ReportsService,
    private readonly router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.report = this.router.getCurrentNavigation().extras.state;
    const locationCoords = getLatLong(this.report.location);
    if (!this.paramsObject) this.checkLocationPermission();
    this.getAddress(locationCoords.latitude, locationCoords.longitude);
  }

  ionViewWillEnter() {
    this.isPending = this.report.isPending;
    this.userId = this.report._id;
    this.isAdmin = localStorage.getItem("isAdmin");
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

  async checkLocationPermission() {
    try {
      console.log('check permission');
      const permission = await this.permissionService.checkGPSPermission();
      const enablePermission = await this.permissionService.reqestGPSPermission();
      if (!permission.hasPermission || !enablePermission.hasPermission) {
        this.presentModal();
        return;
      }

      const isEnabled = await this.permissionService.enableGPS();
      if (isEnabled?.code === 4) {
        this.presentModal();
      }
    } catch (error) {
      console.log({ error });
      if (error?.code === 4) {
        this.presentModal();
      }
    }
  }


  async presentModal() {
    if (this.enablePermissionModal) {
      return;
    }
    this.enablePermissionModal = await this.modalController.create({
      component: PermissionsPage,
      componentProps: {
        message:
          'Please turn on your GPS to view location details',
        type: 'gps',
        redirectTo: '',
        handleClick: () => this.enableLocation(),
        buttonText: `Enable Location`,
      },
    });
    return await this.enablePermissionModal.present();
  }

  async enableLocation() {
    try {
      const response = await this.permissionService.enableGPS();
      if (response?.code === 1 || response?.code === 0) {
        this.modalController.dismiss(null, 'cancel');
      }
    } catch (error) {
      console.log({ error });
    }
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

}
