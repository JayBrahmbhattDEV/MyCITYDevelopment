import { Component, inject } from '@angular/core';
import { AccountService } from './services/account.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';
import { PermissionsPage } from './shared/modals/permissions/permissions.page';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';
import { pagesData } from './utils/constants';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activePageTitle = 'Dashboard';
  userName: any;
  setLangForModal: any;
  pages = pagesData;
  modal: HTMLIonModalElement;
  backButtonPriority = 10;
  selectedLanguage: string;
  constructor(
    public readonly accountService: AccountService,
    private readonly platform: Platform,
    private readonly location: Location,
    private readonly navController: NavController,
    private readonly network: Network,
    private readonly modalController: ModalController,
    private readonly translateService: TranslateService,
    private readonly storage: StorageService
  ) {
    this.accountService.userDetails.subscribe((user: any) => {
      this.userName = user?.name;
      this.pages
        .filter((x) => x.isAuthRequired)
        .forEach((x) => {
          x.show = user;
        });
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      const url = this.location.path();
      if (url === '/enable-permission' || url === '/add-report') {
        this.navController.navigateRoot('/dashboard');
        return;
      } else if (url === '/login' || url === '/dashboard') {
        (navigator as any).app.exitApp();
      } else if (url === '/privacy' || url === '/about') {
        this.navController.back();
      }
      processNextHandler();
    });

    this.network.onChange().subscribe((connection: string) => {
      if (connection === 'connected') {
        if (this.modal) {
          this.modal.canDismiss = true;
          this.modal?.dismiss();
          this.backButtonPriority = 10;
        }
      }
      if (connection === 'disconnected') {
        this.backButtonPriority = 0;
        this.openModal();
      }
    });

    this.storage.getData('language').then((language) => {
      if (!language) {
        this.storage.setData('language', 'en');
        this.translateService.setDefaultLang('en');
      } else {
        this.translateService.setDefaultLang(language);
      }
      this.selectedLanguage = language
    });

  }

  async openModal() {
    this.modal = await this.modalController.create({
      component: PermissionsPage,
      backdropDismiss: false,
      canDismiss: false,
      componentProps: {
        message: 'Please turn on mobile data or connect to Wi-Fi',
        type: 'internet',
        redirectTo: '',
      },
    });

    this.modal.present();
  }

  setLanguage(event: any) {
    this.storage.setData('language', event.detail.value);
    this.setLangForModal = event.detail.value;
    this.translateService.setDefaultLang(event.detail.value);
  }
}
