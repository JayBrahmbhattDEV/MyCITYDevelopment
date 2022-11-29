import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import { CommonService } from '../services/common.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder';
import { ActivatedRoute } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { PermissionService } from '../enable-permission/permission.service';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { EnablePermissionPage } from '../enable-permission/enable-permission.page';
import { AccountService } from '../services/account.service';
import { PermissionsPage } from '../shared/modals/permissions/permissions.page';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.page.html',
  styleUrls: ['./add-report.page.scss'],
})
export class AddReportPage implements OnInit {
  @ViewChild('subCategory') ddSubCategory: IonSelect;
  provider = new OpenStreetMapProvider();
  locations = [];
  paramsObject: any;
  addressVal: any;
  longitudeVal: any;
  latitudeVal: any;
  combVal: any;
  latLong = [23.049736, 72.511726];
  categories = [
    {
      id: 1,
      text: 'Trash & Issue',
    },
    {
      id: 2,
      text: 'Health hazards',
    },
    {
      id: 3,
      text: 'Street and Park damage',
    },
    {
      id: 4,
      text: 'Vehicle/Parking',
    },
    {
      id: 5,
      text: 'Lights',
    },
    {
      id: 6,
      text: 'Trees',
    },
    {
      id: 7,
      text: 'General',
    },
  ];

  subCategories = [
    {
      parent: 1,
      sId: 1,
      text: 'trash',
    },
    {
      parent: 1,
      sId: 2,
      text: 'litter',
    },
    {
      parent: 2,
      sId: 1,
      text: 'Mosquitoes',
    },
    {
      parent: 2,
      sId: 2,
      text: 'Dead animal pickup',
    },
    {
      parent: 3,
      sId: 1,
      text: 'Pothole',
    },
    {
      parent: 3,
      sId: 2,
      text: 'Damaged sign',
    },
    {
      parent: 3,
      sId: 3,
      text: 'Broken equipments',
    },
    {
      parent: 3,
      sId: 4,
      text: 'Broken sidewalk',
    },
    {
      parent: 4,
      sId: 1,
      text: 'Illegal parking',
    },
    {
      parent: 4,
      sId: 2,
      text: 'Vehicle breakdown',
    },
    {
      parent: 5,
      sId: 1,
      text: 'Street light',
    },
    {
      parent: 5,
      sId: 2,
      text: 'Traffic signal',
    },
    {
      parent: 6,
      sId: 1,
      text: 'Plant new tree request',
    },
    {
      parent: 6,
      sId: 2,
      text: 'Dead tree removal',
    },
    {
      parent: 6,
      sId: 3,
      text: 'Tree pruning',
    },
    {
      parent: 7,
      sId: 1,
      text: 'Other',
    },
  ];

  subCategoriesTemp = [];

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: 1,
  };

  image = './assets/images/add.png';
  reportForm: FormGroup;
  latLon = {
    latitude: '',
    longitude: '',
  };
  area: any;
  isMapLoading = true;
  constructor(
    private camera: Camera,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private navController: NavController,
    private commonService: CommonService,
    private accountService: AccountService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private activatedRoute: ActivatedRoute,
    private androidPermissions: AndroidPermissions,
    private permissionService: PermissionService,
    private file: File,
    private crop: Crop,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.initReportForm();
  }

  ionViewDidEnter() {
    this.checkCameraPermission();
    if (!this.paramsObject) {
      this.checkLocationPermission();
    }
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.longitudeVal = this.paramsObject.params.lat;
      this.latitudeVal = this.paramsObject.params.lon;
      this.getAddress(
        +this.paramsObject.params.lat,
        +this.paramsObject.params.lon
      );
    });
  }

  checkCameraPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) => this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.CAMERA
        ),
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA
          )
      );
  }

  async checkLocationPermission() {
    try {
      const permission = await this.permissionService.checkGPSPermission();
      if (!permission.hasPermission) {
        this.presentModal();
      }
      const enablePermission =
        await this.permissionService.reqestGPSPermission();
      if (!enablePermission.hasPermission) {
        this.presentModal();
      }
      const isEnabled = await this.permissionService.enableGPS();
      if (isEnabled?.code === 4) {
        this.presentModal();
      } else if (isEnabled?.code === 0) {
        setTimeout(() => {
          this.getCurrentLocation(true);
        }, 100);
      }
    } catch (error) {
      if (error?.code === 4) {
        this.presentModal();
      }
    }
  }

  reqestGPSPermission() {
    return this.androidPermissions.requestPermission(
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    );
  }

  getSubCategory($event) {
    this.ddSubCategory.value = null;
    this.subCategoriesTemp = this.subCategories.filter(
      (x) => x.parent === $event.detail.value
    );
  }

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
    this.navController.navigateBack('/add-report', {
      queryParams: {
        lat: location.x,
        lon: location.y,
        address: location.label,
      },
    });
    this.modalController.dismiss(null, 'cancel');
  }

  openMap() {
    this.modalController.dismiss(null, 'cancel');
    this.navController.navigateForward(`/map`, {
      queryParams: {
        ...this.latLon,
      },
    });
  }

  openCamera() {
    this.camera
      .getPicture(this.options)
      .then((imageData) => {
        this.cropImage(imageData);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  initReportForm() {
    this.reportForm = this.formBuilder.group({
      address: '',
      description: '',
      category: '',
      subCategory: '',
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PermissionsPage,
      componentProps: {
        message:
          'Oops! In order to add a report, We need to know your location!',
        type: 'gps',
        redirectTo: '',
        handleClick: () => this.enableLocation(),
        buttonText: `Enable Location`,
      },
    });
    return await modal.present();
  }

  convertBase64ToBlob(base64: string) {
    const info = this.getInfoFromBase64(base64);
    const sliceSize = 512;
    const byteCharacters = window.atob(info.rawBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: info.mime });
  }

  getInfoFromBase64(base64: string) {
    const meta = base64.split(',')[0];
    const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
    const mime = /:([^;]+);/.exec(meta)[1];
    const extension = /\/([^;]+);/.exec(meta)[1];

    return {
      mime,
      extension,
      meta,
      rawBase64,
    };
  }

  addReport() {
    if (!this.accountService.token) {
      this.commonService.presentAlert(
        `Oops, it looks like you aren't logged in yet, do you want to login?`,
        'Information',
        {
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {},
            },
            {
              text: 'Login Now',
              cssClass: 'alert-button-confirm',
              handler: () =>
                this.navController.navigateRoot('/login', {
                  queryParams: {
                    redirectTo: '/add-report',
                  },
                }),
            },
          ],
        }
      );
    } else {
      const blob = this.convertBase64ToBlob(this.image);
      const reportData = new FormData();
      reportData.append('imgfile', blob, `${new Date().getMilliseconds()}.jpg`);
      reportData.append(
        'location',
        JSON.stringify({
          latitude: this.latLon.latitude,
          longitude: this.latLon.longitude,
        })
      );
      this.reportForm.value.category = this.categories.find(
        (category) => category.id === this.reportForm.value.category
      ).text;
      Object.keys(this.reportForm.value).forEach((key) => {
        reportData.append(key, this.reportForm.value[key]);
      });
      this.commonService.presentLoading();
      this.reportService.addReport(reportData).subscribe(
        (response: any) => {
          if (response.success) {
            this.commonService.presentToaster({
              message: response?.data?.message,
            });
            this.navController.navigateRoot('/add-report-sucess');
          } else {
            this.commonService.presentToaster({
              message: 'Something went wrong! Please try again later.',
            });
          }
          this.commonService.hideLoading();
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }

  getCurrentLocation(showLoader = false) {
    if (showLoader) {
      this.commonService.presentLoading();
    }
    this.geolocation
      .getCurrentPosition({
        timeout: 1000,
      })
      .then((response) => {
        setTimeout(() => {
          this.commonService.hideLoading();
        }, 1000);
        this.getAddress(response.coords.latitude, response.coords.longitude);
      })
      .catch((e) => {
        if (e?.code === 1) {
          this.navController.navigateRoot('/enable-permission');
        }
        setTimeout(() => {
          this.commonService.hideLoading();
        }, 1000);
      });
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
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
        this.reportForm.patchValue({
          address: `${
            nativeGeocoderResult.thoroughfare
              ? nativeGeocoderResult.thoroughfare + ','
              : nativeGeocoderResult.thoroughfare
          } ${nativeGeocoderResult.subLocality} , ${
            nativeGeocoderResult.locality
          } , ${nativeGeocoderResult.postalCode} `,
        });
        this.latLon.latitude = nativeGeocoderResult.latitude;
        this.latLon.longitude = nativeGeocoderResult.longitude;
        this.area = nativeGeocoderResult.locality;
        this.latLong = [+this.latLon.latitude, +this.latLon.longitude];
        this.isMapLoading = false;
      })
      .catch((e) => {});
  }

  cropImage(fileUrl) {
    this.crop
      .crop(fileUrl, { quality: 50, targetHeight: 100 })
      .then((newPath) => {
        this.showCroppedImage(newPath.split('?')[0]);
      });
  }

  showCroppedImage(imagePath: string) {
    const copyPath = imagePath;
    const splitPath = copyPath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = imagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then((base64) => {
      this.image = base64;
    });
  }

  async enableLocation() {
    try {
      const response = await this.permissionService.enableGPS();
      if (response?.code === 1 || response?.code === 0) {
        this.cancel();
        setTimeout(() => {
          this.getCurrentLocation(true);
        }, 1000);
      }
    } catch (error) {
      console.log({ error });
    }
  }
}
