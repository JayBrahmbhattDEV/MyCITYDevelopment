import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';
import { MESSAGES } from '../utils/constants';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isReportLoaded = false;
  totalReports: any = 0;
  pages = [
    {
      text: 'DASHBOARD_PAGE.Add Report',
      url: '/add-report',
      image: './assets/icon/add-report.svg',
    },
    {
      text: 'DASHBOARD_PAGE.My Reports',
      url: '/reports',
      image: './assets/icon/my-reports.svg',
    },
    {
      text: 'DASHBOARD_PAGE.Recent Reports',
      url: '/recent-reports',
      image: './assets/icon/recent-reports.svg',
    },
    {
      text: 'DASHBOARD_PAGE.Government suggestions',
      url: '/all-users',
      image: './assets/icon/goverments-alerts.svg',
    },
  ];

  slideOpts = {
    slidesPerView: 1.5,
  };

  allReports: Array<any> = [];
  constructor(
    public router: Router,
    private accountService: AccountService,
    private storage: Storage,
    private navController: NavController,
    private commonService: CommonService,
    private readonly reports: ReportsService
  ) {}

  ngOnInit() {
    this.storage.create();
  }

  ionViewWillEnter() {
    this.getReports();
  }

  addReport(url: string) {
    if (url === 'My Reports') {
      if (this.accountService.token) {
        this.router.navigateByUrl('/reports');
      } else {
        this.commonService.presentAlert(
          `Oops, it looks like you aren't logged in yet, do you want to login?`,
          'Information',
          {
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => { },
              },
              {
                text: 'Login Now',
                cssClass: 'alert-button-confirm',
                handler: () =>
                  this.navController.navigateRoot('/login', {
                    queryParams: {
                      redirectTo: '/add-report',
                    },
                  }),
              },
            ],
          }
        );
      }
      return;
    }
    this.router.navigateByUrl(url, { state: { fromGtSugg: url === '/all-users' ? 'gt-sugg' : undefined } });
  }

  getReports() {
    this.reports.geRecentReports().subscribe((response: any) => {
      this.allReports = response.data;
      this.isReportLoaded = true;      
    });
  }
}
