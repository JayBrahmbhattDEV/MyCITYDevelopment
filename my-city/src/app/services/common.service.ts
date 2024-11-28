import { Injectable } from '@angular/core';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { ReportsService } from './reports.service';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loading: HTMLIonLoadingElement;
  private toaster: HTMLIonToastElement;
  constructor(
    private loadingController: LoadingController,
    private toasterContrller: ToastController,
    private alertController: AlertController,
    private reportService: ReportsService,
    private storageService: StorageService
  ) { }

  async presentLoading(message = 'Please wait') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
      });
      this.loading.present();

      setTimeout(async () => {
        if (this.loading) {
          await this.loading.dismiss();
        }
      }, 7000);
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = undefined;
    }
  }

  async presentToaster(toastOptions: ToastOptions) {
    if (!this.toaster) {
      this.toaster = await this.toasterContrller.create({
        ...toastOptions,
        duration: 3000,
      });
      this.toaster.present();
      this.toaster = undefined;
    }
  }

  hideToaster() {
    this.toaster.dismiss();
    this.toaster = undefined;
  }

  async presentAlert(message: string, header = 'Information', alertOptions?: AlertOptions) {
    const alert = await this.alertController.create({
      message,
      header,
      ...alertOptions
    });

    alert.present();
  }

  setAdminReportCount(): void {
    this.reportService.getAdminReportCount().subscribe((res: any) => {
      if (res) this.storageService.setData(STORAGE_KEYS.ADMIN_REP_DT, JSON.stringify(res.data));
    });
  }
}
