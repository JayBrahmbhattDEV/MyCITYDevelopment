import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pages = [
    {
      text: 'Add Report',
      image: './assets/icon/add-report.svg'
    },
    {
      text: 'My Reports',
      image: './assets/icon/my-reports.svg'
    },
    {
      text: 'Recent Reports',
      image: './assets/icon/recent-reports.svg'
    },
    {
      text: 'Goverment Alerts',
      image: './assets/icon/goverments-alerts.svg'
    },
  ];

  slideOpts = {
    slidesPerView: 1.5,
  };
  constructor(
    public router: Router,
    private accountService: AccountService,
    private storage: Storage,
    private navController: NavController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.storage.create();
  }


  addReport(pageType: any) {
    if(pageType == "Recent Reports"){
      this.router.navigateByUrl('/recent-reports');
    }
    else{
      if (this.accountService.token) {
        this.navController.navigateForward('/add-report');
      } else {
        this.commonService.presentAlert(
          `Oops, it's look like you are not logged in yet do you want to login?`,
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
}
