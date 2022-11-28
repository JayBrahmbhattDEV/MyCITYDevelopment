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
  registerForm: FormGroup;
  submitted = false;
  redirectTo: string;
  isAdmin: boolean;
  isLoading = false;
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

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      number: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  accCreated() {
    this.navController.navigateForward(`/register`);
  }

  submitForm() {
    this.submitted = this.loginForm.valid;
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.commonService.hideLoading();
          if (response.success) {
            const { token, user } = response.data;
            this.storageService.setData(STORAGE_KEYS.USER, user);
            this.storageService.setData(STORAGE_KEYS.TOKEN, token);
            this.accountService.userDetails = user;
            this.accountService.token = token;
            this.submitted = false;
            if(response.data.user.isAdmin){
              localStorage.setItem("isAdmin", response.data.user.isAdmin);
            }
            this.navController.navigateForward(this.redirectTo ?? `/dashboard`);
          }
        },
        (e) => {
          this.submitted = false;
          this.commonService.presentToaster({
            message: e.error.message,
            color: 'danger',
          });
        }
      );
    }
  }

  submitRegisterForm() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.accountService.register(this.registerForm.value).subscribe(
        (res: any) => {
          console.log({ res });
          if (res.success) {
            this.commonService.presentToaster({
              message: 'You have been registered successfully!',
              color: 'success',
            });
            this.isLoading = false;
            this.ionSlids.slidePrev();
          } else {
            this.commonService
              .presentToaster({
                message: res.message,
                color: 'danger',
              })
              .then();
          }
        },
        (e) => {
          console.log(e);
          this.isLoading = false;
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
