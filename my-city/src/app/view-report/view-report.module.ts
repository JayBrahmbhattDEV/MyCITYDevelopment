import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ViewReportPageRoutingModule } from './view-report-routing.module';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ViewReportPage } from './view-report.page';
import { SharedModule } from '../shared/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewReportPageRoutingModule,
    SharedModule
  ],
  declarations: [ViewReportPage],
  providers: [Geolocation]
})
export class ViewReportPageModule {}
