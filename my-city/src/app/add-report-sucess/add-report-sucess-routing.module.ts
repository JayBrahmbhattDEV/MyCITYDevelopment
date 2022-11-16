import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddReportSucessPage } from './add-report-sucess.page';

const routes: Routes = [
  {
    path: '',
    component: AddReportSucessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddReportSucessPageRoutingModule {}
