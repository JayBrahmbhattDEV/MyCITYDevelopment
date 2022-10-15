import { Component } from '@angular/core';
import { AccountService } from './services/account.service';
import { NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activePageTitle = 'Dashboard';
  userName;
  Pages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'albums',
      isAuthRequired: true,
      show: false,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person',
      isAuthRequired: true,
      show: false,
    },
    {
      title: 'About Us',
      url: '/about',
      icon: 'information',
      isAuthRequired: false,
      show: true,
    },
    {
      title: 'Privacy Policy',
      url: '/privacy',
      icon: 'document-lock',
      isAuthRequired: false,
      show: true,
    },
  ];

  constructor(
    public readonly accountService: AccountService,
    private readonly platform: Platform,
    private readonly location: Location,
    private readonly navController: NavController
  ) {
    this.accountService.userDetails.subscribe((user: any) => {
      if (!user) {
        return;
      }
      this.userName = user.name;
      this.Pages.filter((x) => x.isAuthRequired).map((x) => {
        x.show = user;
      });
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      const url = this.location.path();
      console.log(url);
      if (url === '/enable-permission' || url === '/add-report') {
        this.navController.navigateRoot('/dashboard');
        return;
      } else if (url === '/login' || url === '/dashboard') {
        navigator['app'].exitApp();
      } else if (url === '/privacy' || url === '/about') {
        this.navController.back();
      }
      processNextHandler();
    });
  }
}
