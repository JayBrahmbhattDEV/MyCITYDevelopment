import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('ionSlids') ionSlids: IonSlides;
  loginForm: FormGroup;
  submitted = false;
  redirectTo: string;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public storage: Storage,
    public navController: NavController,
    private accountService: AccountService,
    public commonService: CommonService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      loginVal: ['', [Validators.required]],
    });
    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe((x: { redirectTo }) => {
        this.redirectTo = x?.redirectTo;
      });
  }

  accCreated() {
    this.navController.navigateForward(`/register`);
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.commonService.presentLoading();
      this.accountService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.commonService.hideLoading();
          if (response.success) {
            const { token, user } = response.data;
            this.storageService.setData(STORAGE_KEYS.USER, user);
            this.storageService.setData(STORAGE_KEYS.TOKEN, token);
            this.accountService.userDetails = user;
            this.accountService.token = token;
            this.navController.navigateForward(this.redirectTo ?? `/dashboard`);
          }
        },
        (e) => {
          this.commonService.hideLoading();
          this.commonService.presentToaster({
            message: e.error.message,
            color: 'danger',
          });
        }
      );
    }
  }

  register() {
    this.ionSlids.slideNext();
  }

  login() {
    this.ionSlids.slidePrev();
  }
}
