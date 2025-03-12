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
  allPendingReports: Array<any> = [];
  isReportLoaded = false;
  adminPanel: any;
  pageNumber: any;
  loadData: any = true;

  filters = [
    { label: 'Health Dept', name: 'Health', value: 2 },
    { label: 'Electric Dept', name: 'Electricity', value: 5 },
    { label: 'Road Dept', name: 'Roads', value: 3 }
  ];

  selectedFilter = '';
  pendingReports = [];

  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.adminPanel = history.state.isAdmin;
  }

  ionViewWillEnter() {
    if (this.adminPanel) {
      this.getAllPendingReports();
    } else {
      this.getReports();
    }
  }

  applyFilter(event: any) {
    this.pendingReports = this.allPendingReports;
    this.pendingReports = this.pendingReports.filter(report => {
      switch (this.selectedFilter.toString()) {
        case '2':
          return report.category === 'Health hazards';
        case '5':
          return report.category === 'Lights';
        case '3':
          return report.category === 'Street and Park damage';
        default:
          return true;
      }
    });
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
        this.commonService.presentToaster({ message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER, color: 'danger' })
        this.commonService.hideLoading();
      }
    );
  }

  getAllPendingReports() {
    this.pageNumber = 1;
    this.reportService.getReports().subscribe((response: any) => {
      if (response.success) {
        this.allPendingReports = response.data;
        console.log(this.allPendingReports);
        this.pendingReports = this.allPendingReports
        this.isReportLoaded = true;
        this.commonService.hideLoading();
      }
    })
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
          this.allPendingReports.push(...res.data);
          ev.target.complete();
        } else {
          this.loadData = false;
        }
      });
  }

}
