import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/modules/shared/shared.module';

import { BriefReportViewPageRoutingModule } from './brief-report-view-routing.module';

import { BriefReportViewPage } from './brief-report-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BriefReportViewPageRoutingModule,
    SharedModule
  ],
  declarations: [BriefReportViewPage]
})
export class BriefReportViewPageModule {}
