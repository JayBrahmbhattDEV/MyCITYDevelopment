import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common.service';

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
    public commonService: CommonService
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
            this.accountService.userDetails = user;
            this.router.navigateByUrl(`/dashboard`);
          }
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }
}
