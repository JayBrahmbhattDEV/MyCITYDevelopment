import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  IonSelect,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AccountService } from '../services/account.service';
import { PermissionsPage } from '../shared/modals/permissions/permissions.page';
import { TranslateService } from '@ngx-translate/core';
import { Categories, MESSAGES, SubCategories } from '../utils/constants';

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
  categories = Categories;
  subCategories = SubCategories;
  subCategoriesTemp = [];

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: 1,
  };

  image = './assets/images/add-image.svg';
  reportForm: FormGroup;
  latLon = {
    latitude: '',
    longitude: '',
  };
  area: any;
  isMapLoading = true;
  enablePermissionModal: HTMLIonModalElement;
  isImageCaptured = false;
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
    public modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private translateService: TranslateService
  ) { }

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
        +this.paramsObject.params.lon,
      );
    });
  }

  checkCameraPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA,
          ),
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA,
          ),
      );
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
      } else if (isEnabled?.code === 0 || isEnabled?.code === 1) {
        setTimeout(() => {
          this.getCurrentLocation(true);
        }, 100);
      }
    } catch (error) {
      console.log({ error });
      if (error?.code === 4) {
        this.presentModal();
      }
    }
  }

  reqestGPSPermission() {
    return this.androidPermissions.requestPermission(
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    );
  }

  getSubCategory($event) {
    this.ddSubCategory.value = null;
    this.subCategoriesTemp = this.subCategories.filter(
      (x) => x.parent === $event.detail.value,
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
    }).then((resp) => {
      this.getAddress(location.x, location.y);
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
      .getPicture(this.cameraOptions)
      .then((imageData) => {
        console.log({ imageData });
        this.cropImage(imageData);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  initReportForm() {
    this.reportForm = this.formBuilder.group({
      address: [''],
      description: [''],
      category: ['', Validators.required],
      subCategory: [{ value: '', disable: true }, Validators.required],
    });
  }

  async presentModal() {
    if (this.enablePermissionModal) {
      return;
    }
    this.enablePermissionModal = await this.modalController.create({
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
    return await this.enablePermissionModal.present();
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
              handler: () => { },
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
        },
      );
    } else {
      // if (!this.isImageCaptured) {
      //   this.translateService.get('ADD_REPORT_PAGE. You can add picture by clicking camera').toPromise().then(message => {
      //     this.commonService.presentToaster({
      //       message
      //     });
      //   });
      //   return;
      // }
      let reportData = new FormData();
      if (this.isImageCaptured) {
        const blob = this.convertBase64ToBlob(this.image);
        reportData.append('imgfile', blob, `${new Date().getMilliseconds()}.jpg`);
      }
      reportData.append(
        'location',
        JSON.stringify({
          latitude: this.latLon.latitude,
          longitude: this.latLon.longitude,
        }),
      );
      this.reportForm.value.category = this.categories.find(
        (category) => category.id === this.reportForm.value.category,
      ).text;
      Object.keys(this.reportForm.value).forEach((key) => {
        reportData.append(key, this.reportForm.value[key]);
      });
      this.reportService.addReport(reportData).subscribe(
        (response: any) => {
          if (response.success) {
            this.commonService.presentToaster({
              message: response?.data?.message,
            });
            this.navController.navigateRoot('/add-report-sucess');
          } else {
            this.commonService.presentToaster({
              message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
            });
          }
          this.commonService.hideLoading();
        },
        (e) => {
          console.log(e);
        },
      );
    }
  }

  getCurrentLocation(showLoader = false) {
    if (showLoader) {
      this.commonService.presentLoading();
    }
    this.geolocation
      .getCurrentPosition({
        timeout: 20000,
      })
      .then((response) => {
        setTimeout(() => {
          this.commonService.hideLoading();
        }, 1000);
        this.getAddress(response.coords.latitude, response.coords.longitude);
      })
      .catch((e) => {
        console.log({ e });
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
          address: `${nativeGeocoderResult.thoroughfare
            ? nativeGeocoderResult.thoroughfare + ','
            : nativeGeocoderResult.thoroughfare
            } ${nativeGeocoderResult.subLocality} , ${nativeGeocoderResult.locality
            } , ${nativeGeocoderResult.postalCode} `,
        });
        this.latLon.latitude = nativeGeocoderResult.latitude;
        this.latLon.longitude = nativeGeocoderResult.longitude;
        this.area = nativeGeocoderResult.locality;
        this.latLong = [+this.latLon.latitude, +this.latLon.longitude];
        this.isMapLoading = false;
      })
      .catch((e) => {
        console.error("Error in reverse geocode:", e);
      });
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50, targetHeight: 100 }).then(
      (newPath) => {
        this.showCroppedImage(newPath.split('?')[0]);
      },
      (e) => console.log(e),
    );
  }

  showCroppedImage(imagePath: string) {
    const copyPath = imagePath;
    const splitPath = copyPath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = imagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then((base64) => {
      this.image = base64;
      this.isImageCaptured = true;
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Take photo',
          role: 'button',
          handler: () => {
            this.cameraOptions.sourceType = 1;
            this.openCamera();
          },
        },
        {
          text: 'Add photo',
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }
}
