import { Component, Input, OnInit } from '@angular/core';
import { ReportActions } from 'src/app/constants/enums';

@Component({
  selector: 'app-mc-dashboard-button',
  templateUrl: './mc-dashboard-button.component.html',
  styleUrls: ['./mc-dashboard-button.component.scss'],
})
export class McDashboardButtonComponent implements OnInit {
  @Input() text: string;
  @Input() image: string;
  reportActions: any;


  constructor() { }

  ngOnInit() {
    this.reportActions = ReportActions;
  }

}
