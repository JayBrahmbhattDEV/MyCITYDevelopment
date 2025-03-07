import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McDashboardButtonComponent } from '../../components/mc-dashboard-button/mc-dashboard-button.component';
import { McReportCardComponent } from '../../components/mc-report-card/mc-report-card.component';
import { IonicModule } from '@ionic/angular';
import { McButtonComponent } from '../../components/mc-button/mc-button.component';
import { McMapComponent } from '../../components/mc-map/mc-map.component';
import { ReportsEmptyStateComponent } from '../../components/reports-empty-state/reports-empty-state.component';
import { RouterModule } from '@angular/router';
import { ReportCardSkeletonComponent } from '../../components/report-card-skeleton/report-card-skeleton.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    McDashboardButtonComponent,
    McReportCardComponent,
    McButtonComponent,
    McMapComponent,
    ReportsEmptyStateComponent,
    ReportCardSkeletonComponent,
  ],
  imports: [CommonModule, IonicModule, RouterModule, TranslateModule],
  exports: [
    McDashboardButtonComponent,
    McReportCardComponent,
    McButtonComponent,
    McMapComponent,
    ReportsEmptyStateComponent,
    ReportCardSkeletonComponent,
    TranslateModule
  ],
})
export class SharedModule { }
