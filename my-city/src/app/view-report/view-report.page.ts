import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  report:any;
  isPending: any;
  userId: any;
  isAdmin: any;
  constructor(
    private readonly reportService: ReportsService,
    private readonly router: Router,
    private navController: NavController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.report = this.router.getCurrentNavigation().extras.state;
  }

  ionViewWillEnter(){
    this.isPending = this.report.isPending;
    this.userId = this.report._id;
    this.isAdmin = localStorage.getItem("isAdmin");
  }

  getReportDetails(reportId: string) {
    this.reportService.getReport(reportId).subscribe((report) => {});
  }

  approveReport(){
    this.reportService.approveReport(this.userId, {
      "isPending": false
    }).subscribe((res: any) => {
      console.log(res);
      this.commonService.presentToaster({ message: "Report closed successfully!", color: 'success' });
      this.router.navigateByUrl('/reports');
    });
  }

}
