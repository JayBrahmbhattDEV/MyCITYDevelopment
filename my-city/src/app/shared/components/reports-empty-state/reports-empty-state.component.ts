import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-empty-state',
  templateUrl: './reports-empty-state.component.html',
  styleUrls: ['./reports-empty-state.component.scss'],
})
export class ReportsEmptyStateComponent implements OnInit {
  @Input()
  message = `It looks like you haven't created any reports yet. Creating a report is just one
  tap away!`;

  @Input() url = `/add-report`;

  constructor() {}

  ngOnInit() {}
}
