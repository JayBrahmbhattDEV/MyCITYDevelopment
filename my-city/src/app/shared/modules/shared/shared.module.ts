import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McDashboardButtonComponent } from '../../components/mc-dashboard-button/mc-dashboard-button.component';
import { McReportCardComponent } from '../../components/mc-report-card/mc-report-card.component';
import { IonicModule } from '@ionic/angular';
import { McButtonComponent } from '../../components/mc-button/mc-button.component';
import { McMapComponent } from '../../components/mc-map/mc-map.component';

@NgModule({
  declarations: [
    McDashboardButtonComponent,
    McReportCardComponent,
    McButtonComponent,
    McMapComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    McDashboardButtonComponent,
    McReportCardComponent,
    McButtonComponent,
    McMapComponent,
  ],
})
export class SharedModule {}
