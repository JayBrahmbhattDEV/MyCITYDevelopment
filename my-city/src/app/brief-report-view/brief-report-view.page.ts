import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../services/reports.service';
import { CommonService } from '../services/common.service';
import { MESSAGES } from '../utils/constants';

@Component({
  selector: 'app-brief-report-view',
  templateUrl: './brief-report-view.page.html',
  styleUrls: ['./brief-report-view.page.scss'],
})
export class BriefReportViewPage implements OnInit {
  reports = [];
  constructor(
    private readonly reportService: ReportsService,
    private readonly router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.reportService.getReports().subscribe(
      (response: any) => {
        if (response.success) {
          this.reports = response.data;
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
}
