import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McButtonComponent } from '../../components/mc-button/mc-button.component';
import { McReportCardComponent } from '../../components/mc-report-card/mc-report-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [McButtonComponent, McReportCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [McButtonComponent, McReportCardComponent],
})
export class SharedModule {}
