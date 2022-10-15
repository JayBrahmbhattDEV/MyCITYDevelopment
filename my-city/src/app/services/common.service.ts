import { Injectable } from '@angular/core';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  LoadingOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loading: HTMLIonLoadingElement;
  private toaster: HTMLIonToastElement;
  constructor(
    private loadingController: LoadingController,
    private toasterContrller: ToastController,
    private alertController: AlertController
  ) {}

  async presentLoading(message = 'Please wait') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
      });
      this.loading.present();
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
}
