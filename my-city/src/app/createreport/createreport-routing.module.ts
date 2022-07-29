import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatereportPage } from './createreport.page';

const routes: Routes = [
  {
    path: '',
    component: CreatereportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatereportPageRoutingModule {}
