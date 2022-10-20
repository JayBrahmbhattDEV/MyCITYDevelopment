import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BriefReportViewPage } from './brief-report-view.page';

const routes: Routes = [
  {
    path: '',
    component: BriefReportViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BriefReportViewPageRoutingModule {}
