import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(
    private menuController: MenuController,
    public router: Router
    ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  newReport(){
    this.router.navigateByUrl(`/newreport`);
  }
}
