import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mc-report-card',
  templateUrl: './mc-report-card.component.html',
  styleUrls: ['./mc-report-card.component.scss'],
})
export class McReportCardComponent implements OnInit {
  @Input() report: Report;
  @Input() userReport: UserReport;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  viewReport() {
    this.navController.navigateForward('/view-report', {
      state: this.report,
    });
  }

  onLoaded() {
    this.report.imageLoaded = true;
  }
}

export interface Report {
  _id: string;
  address: string;
  location: string;
  date: string;
  time: string;
  isOpen: boolean;
  description: string;
  userId: string;
  category: string;
  subCategory: string;
  imgUrl: string;
  imageLoaded: boolean;
  isClosed: boolean;
  isPending: boolean;
}

export interface UserReport {
  _id: string;
  address: string;
  location: string;
  date: string;
  time: string;
  isOpen: boolean;
  description: string;
  userId: string;
  category: string;
  subCategory: string;
  imgUrl: string;
}
