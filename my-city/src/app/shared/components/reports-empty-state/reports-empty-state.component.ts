import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-empty-state',
  templateUrl: './reports-empty-state.component.html',
  styleUrls: ['./reports-empty-state.component.scss'],
})
export class ReportsEmptyStateComponent implements OnInit {
  @Input()
  message = `It's look like you dont have added any reports yet your report just one
  tap away`;

  @Input() url = `/add-report`;

  constructor() {}

  ngOnInit() {}
}
