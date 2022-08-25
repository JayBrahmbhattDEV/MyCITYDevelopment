import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnablePermissionPage } from './enable-permission.page';

const routes: Routes = [
  {
    path: '',
    component: EnablePermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnablePermissionPageRoutingModule {}
