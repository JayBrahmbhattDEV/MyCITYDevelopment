import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';
import { MESSAGES } from '../utils/constants';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  reports = [];
  isAdmin: any;
  allUserReports: Array<any> = [];
  isReportLoaded = false;
  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
    private navController: NavController
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.isAdmin = localStorage.getItem("isAdmin");  
    this.getReports();
  }

  getReports() {
    this.commonService.presentLoading(MESSAGES.FETHCHING_REPORTS);
    this.reportService.getUserReport().subscribe(
      (response: any) => {
        if (response.success) {
          this.allUserReports = response.data;
        } else {
          this.commonService.presentToaster({
            message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
          });
        }
        this.isReportLoaded = true;
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
