import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCityMapPageRoutingModule } from './admin-city-map-routing.module';

import { AdminCityMapPage } from './admin-city-map.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCityMapPageRoutingModule,
    TranslateModule
  ],
  declarations: [AdminCityMapPage]
})
export class AdminCityMapPageModule {}
