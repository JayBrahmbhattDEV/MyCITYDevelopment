import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ReportsService } from '../services/reports.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  report:any;
  constructor(
    private readonly reportService: ReportsService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.report = this.router.getCurrentNavigation().extras.state;
  }

  getReportDetails(reportId: string) {
    this.reportService.getReport(reportId).subscribe((report) => {});
  }

  initReportForm(report:any) {
    // this.reportForm = this.formBuilder.group({
    //   address: report.address,
    //   description: report.description,
    //   category:  report.      category,
    //   subCategory: report.subCategory,
    //   imgUrl: report.imgUrl,
    //   location: report.location,
    // });
  }
}
