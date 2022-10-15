import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mc-button',
  templateUrl: './mc-button.component.html',
  styleUrls: ['./mc-button.component.scss'],
})
export class McButtonComponent implements OnInit {

  @Input() text: string;
  @Input() image: string;
  constructor() { }

  ngOnInit() {}

}
