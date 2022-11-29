import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';
import { MESSAGES } from '../utils/constants';
import { ReportsService } from '../services/reports.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isReportLoaded = false;
  isAdmin: any;
  pages = [
    {
      text: 'Add Report',
      image: './assets/icon/add-report.svg',
    },
    {
      text: 'My Reports',
      image: './assets/icon/my-reports.svg',
    },
    {
      text: 'Recent Reports',
      image: './assets/icon/recent-reports.svg',
    },
    {
      text: 'Goverment Alerts',
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
    this.getReports();
  }

  ionViewWillEnter(){
    this.isAdmin = localStorage.getItem("isAdmin");  
  }

  addReport(pageType: any) {
    if (pageType === 'Recent Reports') {
      this.router.navigateByUrl('/recent-reports');
    }
    else if(pageType === 'Add Report'){
      this.router.navigateByUrl('/add-report');
    }
    else if (pageType === 'My Reports') {
      if(this.accountService.token){
        this.router.navigateByUrl('/reports');
      }
      else {
        this.commonService.presentAlert(
          `Oops, it looks like you aren't logged in yet, do you want to login?`,
          'Information',
          {
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {},
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
    }
  }

  adminPanel(){
    this.router.navigateByUrl('/reports');
  }

  getReports() {
    this.reports.geRecentReports().subscribe((response: any) => {
      this.allReports = response.data;
      this.isReportLoaded = true;
    });
  }
}
