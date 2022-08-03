import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AccountService } from '../services/account.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  RegForm: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public navController: NavController,
    public storage: Storage,
    private accountService: AccountService,
    private menuController: MenuController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.storage.create();
    this.RegForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  get controls() {
    return this.RegForm.controls;
  }

  loginRoute() {
    this.submitted = true;
    if (this.RegForm.valid) {
      this.commonService.presentLoading();
      this.accountService.register(this.RegForm.value).subscribe(
        (response: any) => {
          if (response.success) {
            this.storage.set('user', response);
            this.commonService.presentToaster({
              message: response.data.message,
            });
            this.commonService.hideLoading();
            this.router.navigateByUrl(`/login`);
          } else {
            this.commonService.presentToaster({
              message: response.data.message,
            });
          }
        },
        (e) => {
          this.commonService.presentToaster({
            message:
              e?.error.message ||
              'Something went wrong please try again later.',
            color: 'danger',
            duration: 3000,
          });
          this.commonService.hideLoading();
        }
      );
    }
  }

  alreadyReg() {
    this.router.navigateByUrl(`/login`);
  }
}
