import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AccountService } from 'src/services/account.service';
import { Storage } from '@ionic/storage-angular';

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
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      loginVal: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  get errorCtr() {
    return this.LoginForm.controls;
  }

  submitForm() {
    if (this.LoginForm.controls.loginVal.value !== '') {
      this.submitted = true;
      this.accountService.login(this.LoginForm.value).subscribe(
        (response) => {
          this.router.navigateByUrl(`/dashboard`);
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }
}
