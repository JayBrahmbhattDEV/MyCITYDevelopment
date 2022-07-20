import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activePageTitle = 'Dashboard';
  Pages = [
    {
      title: 'Dashboard',
      url: '',
      icon: 'albums'
    },
    {
      title: 'Profile',
      url: '/login',
      icon: 'person'
    },
    {
      title: 'About Us',
      url: '/about',
      icon: 'information'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy',
      icon: 'document-lock'
    }
  ];
  constructor() {}
}
