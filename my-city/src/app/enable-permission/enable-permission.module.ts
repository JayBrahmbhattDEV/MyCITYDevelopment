import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnablePermissionPageRoutingModule } from './enable-permission-routing.module';

import { EnablePermissionPage } from './enable-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnablePermissionPageRoutingModule
  ],
  declarations: [EnablePermissionPage],
})
export class EnablePermissionPageModule {}
