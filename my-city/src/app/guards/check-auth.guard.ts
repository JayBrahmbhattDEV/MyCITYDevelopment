import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CheckAuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private accountService: AccountService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.checkAuthentication();
    return true;
  }

  async checkAuthentication() {
    try {
      const token = await this.storageService.getData(STORAGE_KEYS.TOKEN);
      if (token) {
        this.accountService.token = token;
        this.accountService.userDetails = await this.storageService.getData(
          STORAGE_KEYS.USER
        );
      }
    } catch (error) {
      console.log({ error });
    }
  }
}
