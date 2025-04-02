import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GisMapPage } from './gis-map.page';

const routes: Routes = [
  {
    path: '',
    component: GisMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GisMapPageRoutingModule {}
