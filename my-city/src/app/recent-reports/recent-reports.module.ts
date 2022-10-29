import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { RecentReportsPageRoutingModule } from './recent-reports-routing.module';

import { RecentReportsPage } from './recent-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentReportsPageRoutingModule,
    SharedModule
  ],
  declarations: [RecentReportsPage]
})
export class RecentReportsPageModule {}
