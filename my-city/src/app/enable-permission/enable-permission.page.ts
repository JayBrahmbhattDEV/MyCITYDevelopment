import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { PermissionService } from './permission.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-enable-permission',
  templateUrl: './enable-permission.page.html',
  styleUrls: ['./enable-permission.page.scss'],
})
export class EnablePermissionPage {
  @ViewChild(IonModal) modal: IonModal;
  constructor(
    private permissionService: PermissionService,
    private commonService: CommonService,
    private navContoller: NavController
  ) {}
  async enableLocation() {
    try {
      const response = await this.permissionService.enableGPS();
      if (response?.code === 1 || response?.code === 0) {
        this.navContoller.navigateRoot('/add-report');
      }
      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  }

  
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
}
