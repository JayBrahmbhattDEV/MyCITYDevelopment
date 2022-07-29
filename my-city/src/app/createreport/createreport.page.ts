import { Component, OnInit } from '@angular/core';
import { IssueList } from '../constants/constant';

@Component({
  selector: 'app-createreport',
  templateUrl: './createreport.page.html',
  styleUrls: ['./createreport.page.scss'],
})
export class CreatereportPage implements OnInit {
  issueList = IssueList;
  constructor() { }

  ngOnInit() {
  }
  
}
