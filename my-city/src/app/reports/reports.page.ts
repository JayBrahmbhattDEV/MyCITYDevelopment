import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  allPendingReports: Array<any> = [];
  isReportLoaded = false;
  adminPanel: any;
  pageNumber: any;
  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.adminPanel = this.router.getCurrentNavigation().extras.state;
  }

  ionViewWillEnter(){
    if (this.adminPanel) {
      this.getAllPendingReports();
    } else {
      this.getReports();
    }
  }

  getReports() {
    this.reportService.getUserReport().subscribe(
      (response: any) => {
        if (response.success) {
          this.allUserReports = response.data;
          console.log(this.allUserReports);
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

  getAllPendingReports(){
    this.commonService.presentLoading();
    this.reportService.getReports().subscribe((response:any) => {
      if (response.success) {
        this.allPendingReports = response.data;
        console.log(this.allPendingReports);
        this.commonService.hideLoading();
      }
    })
  }

  viewReport(report: any) {
    this.navController.navigateForward('/view-report', {
      state: report,
    });
  }

}
