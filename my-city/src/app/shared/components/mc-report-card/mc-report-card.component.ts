import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { ReportsService } from 'src/app/services/reports.service';
import { MESSAGES } from 'src/app/utils/constants';

@Component({
  selector: 'app-mc-report-card',
  templateUrl: './mc-report-card.component.html',
  styleUrls: ['./mc-report-card.component.scss'],
})
export class McReportCardComponent implements OnInit {
  reports = [];
  address:any;
  constructor(private reportService: ReportsService,
    private commonService: CommonService,
    private navController: NavController) { }

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.commonService.presentLoading(MESSAGES.FETHCHING_REPORTS);
    this.reportService.getReports().subscribe(
      (response: any) => {
        if (response.success) {
          this.reports = response.data;
          for(let i = 0; i < this.reports.length; i++){
            this.address = response.data[i].address;
            console.log(this.address);
          }
        } else {
          this.commonService.presentToaster({
            message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
          });
        }
        this.commonService.hideLoading();
      },
      (e) => {
        this.commonService.presentToaster({message:"Something went wrong!", color:'danger'})
        this.commonService.hideLoading();
      }
    );
  }

  viewReport(report: any) {
    this.navController.navigateForward('/view-report', {
      state: report,
    });
  }

}
