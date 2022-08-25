import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentReportsPageRoutingModule } from './recent-reports-routing.module';

import { RecentReportsPage } from './recent-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentReportsPageRoutingModule
  ],
  declarations: [RecentReportsPage]
})
export class RecentReportsPageModule {}
