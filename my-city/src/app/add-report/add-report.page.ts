import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import { Router } from '@angular/router';

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
      text: 'Health hazards',
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
  constructor(
    private camera: Camera,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initReportForm();
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
      address: ' Zydus Hospital , Thaltej , Ahemdabad - 360059',
      description: '',
      category: '',
      subCategory: '',
      // location: { latitude: 1111, longitude: 122121 },
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
    reportData.append('imgFile', blob, 'problem.jpg');
    reportData.append('location',JSON.stringify({
      latitude: '123',
      longitude: '123',
    }));
    Object.keys(this.reportForm.value).forEach((key) => {
      reportData.append(key, this.reportForm.value[key]);
    });
    this.reportService.addReport(reportData).subscribe(
      (response) => {
        console.log(response);
      },
      (e) => {
        console.log(e);
      }
    );
  }

  changeLocation(){
    this.router.navigateByUrl(`/home`)
  }
}
