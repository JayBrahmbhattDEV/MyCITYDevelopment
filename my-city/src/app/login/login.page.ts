import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  LoginForm: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public storage: Storage,
    public navController: NavController,
    private accountService: AccountService,
    public commonService: CommonService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      loginVal: ['', [Validators.required]],
    });
  }

  get errorCtr() {
    return this.LoginForm.controls;
  }

  submitForm() {
    if (this.LoginForm.valid) {
      this.submitted = true;
      this.commonService.presentLoading();
      this.accountService.login(this.LoginForm.value).subscribe(
        (response: any) => {
          this.commonService.hideLoading();
          if (response.success) {
            const { token, user } = response.data;
            this.storageService.setData(STORAGE_KEYS.USER,user);
            this.storageService.setData(STORAGE_KEYS.TOKEN,token);
            // localStorage.setItem("name", response.data.user.name);
            // localStorage.setItem("email", response.data.user.email);
            // localStorage.setItem("dob", response.data.user.dob);
            // localStorage.setItem("phone", response.data.user.phoneNumber);
            // localStorage.setItem("token", response.data.token);
            this.accountService.userDetails = user;
            this.accountService.token = token;
            this.navController.navigateRoot(`/dashboard`);
          }
        },
        (e) => {
          this.commonService.hideLoading();
          this.commonService.presentToaster({message:e.error.message, color:'danger'});
        }
      );
    }
  }
}
