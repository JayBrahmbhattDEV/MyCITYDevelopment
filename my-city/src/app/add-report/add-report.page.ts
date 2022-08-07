import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';


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
    mediaType: this.camera.MediaType.PICTURE
  }
  
  image= 'https://i0.wp.com/www.opindia.com/wp-content/uploads/2021/02/Ahmedabad-630x381-1.jpg?fit=630%2C381&ssl=1';

  constructor(
    private camera: Camera
  ) {}

  ngOnInit() {}

  getSubCategory($event) {
    this.ddSubCategory.value = null;
    this.subCategoriesTemp = this.subCategories.filter(
      (x) => x.parent === $event.detail.value
    );
  }
  openCamera() {
    this.camera.getPicture  (this.options).then(imageData => {
      this.image = 'data:image/jpeg;base64,' + imageData;
    }).catch(e => {
      console.log(e);
    });
  }
}
