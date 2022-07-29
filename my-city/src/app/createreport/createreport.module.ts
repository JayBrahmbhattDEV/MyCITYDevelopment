import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatereportPageRoutingModule } from './createreport-routing.module';

import { CreatereportPage } from './createreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatereportPageRoutingModule
  ],
  declarations: [CreatereportPage]
})
export class CreatereportPageModule {}
