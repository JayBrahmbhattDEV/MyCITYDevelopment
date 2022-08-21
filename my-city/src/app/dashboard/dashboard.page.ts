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
  constructor(
    public router: Router,
    private accountService: AccountService,
    private storage: Storage,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.storage.create();
  }

  async addReport() {
    try {
      const token = await this.storage.get(STORAGE_KEYS.TOKEN);
      console.log({ token });
      if (token) {
        this.accountService.token = token;
        const user = await this.storage.get(STORAGE_KEYS.USER);
        this.accountService.userDetails = user;
        this.navController.navigateForward('/add-report');
      } else {
        this.navController.navigateRoot('/login');
      }
    } catch (error) {
      this.navController.navigateRoot('/login');
    }
  }
}
