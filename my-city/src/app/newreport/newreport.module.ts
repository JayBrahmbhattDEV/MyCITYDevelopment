import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreportPageRoutingModule } from './newreport-routing.module';

import { NewreportPage } from './newreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreportPageRoutingModule
  ],
  declarations: [NewreportPage]
})
export class NewreportPageModule {}
