import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
