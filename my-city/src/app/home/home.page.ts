import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { STORAGE_KEYS } from '../utils/constants';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  token: any;
  constructor(
    public readonly accountService: AccountService,
    private readonly storageService: StorageService
  ) {}

  ionViewDidEnter() {
    this.getToken();
  }

  async getToken() {
    this.token = await this.storageService.getData(STORAGE_KEYS.TOKEN);
  }
}
