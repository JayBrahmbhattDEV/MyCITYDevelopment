import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';
import { MESSAGES } from '../utils/constants';

@Component({
  selector: 'app-recent-reports',
  templateUrl: './recent-reports.page.html',
  styleUrls: ['./recent-reports.page.scss'],
})
export class RecentReportsPage implements OnInit {
  reports = [];
  allReports: Array<any> = [];
  pageNumber: any;
  loadData: any = true;
  isReportLoaded = false;
  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.pageNumber = 1;
    this.reportService.getReportsWithPagination(this.pageNumber).subscribe(
      (response: any) => {
        if (response.success) {
          this.allReports = response.data;
        } else {
          this.commonService.presentToaster({
            message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
          });
        }
        this.isReportLoaded = true;
      },
      (e) => {
        this.commonService.presentToaster({
          message: 'Something went wrong!',
          color: 'danger',
        });
        this.isReportLoaded = true;
      }
    );
  }

  viewReport(report: any) {
    this.navController.navigateForward('/view-report', {
      state: report,
    });
  }

  loadmore(ev) {
    this.pageNumber += 1;
    this.reportService
      .getReportsWithPagination(this.pageNumber)
      .subscribe((res: any) => {
        if (res.data.length > 0) {
          this.allReports.push(...res.data);
          ev.target.complete();
        } else {
          this.loadData = false;
        }
      });
  }
}
