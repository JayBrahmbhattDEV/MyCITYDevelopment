import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddReportPageRoutingModule } from './add-report-routing.module';

import { AddReportPage } from './add-report.page';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReportPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [AddReportPage],
  providers: [
    Geolocation,
    NativeGeocoder,
    AndroidPermissions,
    Crop,
    File,
  ],
})
export class AddReportPageModule {}
