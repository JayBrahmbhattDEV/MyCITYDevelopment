import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [MapPage],
  providers: [Geolocation],
})
export class MapPageModule { }
