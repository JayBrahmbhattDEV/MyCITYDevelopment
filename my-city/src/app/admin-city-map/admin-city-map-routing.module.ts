import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCityMapPage } from './admin-city-map.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCityMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCityMapPageRoutingModule {}
