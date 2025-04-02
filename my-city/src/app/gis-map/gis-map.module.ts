import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GisMapPageRoutingModule } from './gis-map-routing.module';

import { GisMapPage } from './gis-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GisMapPageRoutingModule
  ],
  declarations: [GisMapPage]
})
export class GisMapPageModule {}
