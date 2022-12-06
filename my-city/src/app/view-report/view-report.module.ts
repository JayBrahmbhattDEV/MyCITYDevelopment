import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ViewReportPageRoutingModule } from './view-report-routing.module';

import { ViewReportPage } from './view-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewReportPageRoutingModule
  ],
  declarations: [ViewReportPage]
})
export class ViewReportPageModule {}
