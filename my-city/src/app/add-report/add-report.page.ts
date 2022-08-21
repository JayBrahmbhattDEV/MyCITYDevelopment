import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import { CommonService } from '../services/common.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.page.html',
  styleUrls: ['./add-report.page.scss'],
})
export class AddReportPage implements OnInit {
  @ViewChild('subCategory') ddSubCategory: IonSelect;
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
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  };

  image =
    'https://i0.wp.com/www.opindia.com/wp-content/uploads/2021/02/Ahmedabad-630x381-1.jpg?fit=630%2C381&ssl=1';
  reportForm: FormGroup;
  latLon = {
    latitude: '',
    longitude: '',
  };
  constructor(
    private camera: Camera,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private navController: NavController,
    private commonService: CommonService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {}

  ngOnInit() {
    this.initReportForm();
  }

  ionViewDidEnter() {
    this.getCurrentLocation();
  }

  getSubCategory($event) {
    this.ddSubCategory.value = null;
    this.subCategoriesTemp = this.subCategories.filter(
      (x) => x.parent === $event.detail.value
    );
  }

  openCamera() {
    this.camera
      .getPicture(this.options)
      .then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
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

  private convertBase64ToBlob(base64: string) {
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

  private getInfoFromBase64(base64: string) {
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
          this.navController.back();
        } else {
          this.commonService.presentToaster({
            message: 'Oops something went wrong please try again later.',
          });
        }
        this.commonService.hideLoading();
      },
      (e) => {
        console.log(e);
      }
    );
  }

  getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((response) => {
        console.log({ response });
        this.nativeGeocoder
          .reverseGeocode(response.coords.latitude, response.coords.longitude, {
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
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => console.log(e));
  }
}
