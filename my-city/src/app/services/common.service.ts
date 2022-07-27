import { Injectable } from '@angular/core';
import {
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
    private toasterContrller: ToastController
  ) {}

  async presentLoading(message = 'Please wait') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message: 'Please wait',
      });
      this.loading.present();
    }
  }

  hideLoading() {
    this.loading.dismiss();
    this.loading = undefined;
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
}
