import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.page.html',
  styleUrls: ['./permissions.page.scss'],
})
export class PermissionsPage implements OnInit {
  @Input() message: string;
  @Input() type: keyof ImageTypes;
  @Input() redirectTo: string;
  @Input() handleClick: any;
  @Input() buttonText: any;
  imageType = '';
  constructor() {}

  ngOnInit() {
    if (this.type === 'internet') {
      this.imageType = `./assets/icon/no-internet.svg`;
    } else if (this.type === 'camera') {
      this.imageType = `./assets/icon/camera.svg`;
    } else if (this.type === 'gps') {
      this.imageType = `./assets/icon/enable-gps.svg`;
    }
  }

  handleClickEvnet() {
    this.handleClick();
  }
}

export type ImageTypes = {
  internet: 'no-internet';
  camera: 'camera';
  gps: 'gps';
};
