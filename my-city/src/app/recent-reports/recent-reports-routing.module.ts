import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentReportsPage } from './recent-reports.page';

const routes: Routes = [
  {
    path: '',
    component: RecentReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentReportsPageRoutingModule {}
