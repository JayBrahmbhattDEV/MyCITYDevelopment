import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { STORAGE_KEYS } from '../utils/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
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
  constructor(
    public router: Router,
    private accountService: AccountService,
    private storage: Storage,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.storage.create();
  }

  addReport() {
    if (this.accountService.token) {
      this.navController.navigateForward('/add-report');
    } else {
      this.navController.navigateRoot('/login');
    }
  }
}
