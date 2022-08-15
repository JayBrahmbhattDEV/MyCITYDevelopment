import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchLocationPageRoutingModule } from './search-location-routing.module';

import { SearchLocationPage } from './search-location.page';
import { LocationPipe } from '../pipes/location.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchLocationPageRoutingModule
  ],
  declarations: [SearchLocationPage,LocationPipe]
})
export class SearchLocationPageModule {}
