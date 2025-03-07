import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReportSucessPageRoutingModule } from './add-report-sucess-routing.module';

import { AddReportSucessPage } from './add-report-sucess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReportSucessPageRoutingModule
  ],
  declarations: [AddReportSucessPage]
})
export class AddReportSucessPageModule {}
