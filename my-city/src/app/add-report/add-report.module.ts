import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReportPageRoutingModule } from './add-report-routing.module';

import { AddReportPage } from './add-report.page';


import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReportPageRoutingModule,
  ],
  declarations: [AddReportPage],
  providers: [Camera]
})
export class AddReportPageModule {}
