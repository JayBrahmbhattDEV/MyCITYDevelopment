import { Component } from '@angular/core';
import { AccountService } from './services/account.service';

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

  constructor(public readonly accountService: AccountService) {
    this.accountService.userDetails.subscribe((user: any) => {
      if (!user) {
        return;
      }
      this.userName = user.name;
      this.Pages.filter((x) => x.isAuthRequired).map((x) => {
        x.show = user;
      });
    });
  }
}
