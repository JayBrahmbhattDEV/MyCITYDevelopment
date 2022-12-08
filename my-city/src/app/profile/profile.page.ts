import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  userdata: any;
  dateOfBirth: any;
  maxDate: any;
  userDob: any;
  selectedLanguage: string;
  constructor(
    public accountService: AccountService,
    public formBuilder: FormBuilder,
    private commonService: CommonService,
    private storageService: StorageService,
    private navController: NavController,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [],
      phone: [],
      dob: [],
      address: new FormControl(),
    });

    this.storageService.getData('language').then(language => {
      this.selectedLanguage = language;
    });

    this.accountService.getProfile().subscribe((res: any) => {
      this.userdata = res;
      this.userDob = this.userdata.data.dob;
      this.profileForm.patchValue({
        name: this.userdata.data.name,
        email: this.userdata.data.email,
        phone: this.userdata.data.phoneNumber,
        dob: this.userdata.data.dob,
      });
    });
    this.futureDisabled();
  }

  logOut() {
    this.commonService.presentAlert(
      `Are you sure you want to log-out?`,
      'Alert',
      {
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { },
          },
          {
            text: 'Log Out',
            cssClass: 'log-out-confirmed',
            handler: () => {
              this.navController.navigateRoot('/login');
              this.storageService.clearData();
              localStorage.clear();
              this.accountService.userDetails = null;
              this.accountService.token = null;
            }
          },
        ],
      }
    );
  }

  futureDisabled() {
    const date: any = new Date();
    let todayDate: any = date.getDate();
    let month: any = date.getMonth() + 1;
    const year: any = date.getFullYear();
    if (todayDate < 10) {
      todayDate = 0 + todayDate;
    }
    if (month < 10) {
      month = 0 + month;
    }
    this.maxDate = year + '-' + month + '-' + todayDate;
  }

  save() {
    this.accountService
      .updateProfile(this.profileForm.value)
      .subscribe((res: any) => {
        if (res.success) {
          this.commonService.presentToaster({ message: res.message + `😄`, color: 'success' });
        }
      });
    this.accountService.getProfile();
  }

  change(data) {
    this.dateOfBirth = new Date(data.target.value).toLocaleDateString();
  }

  setLanguage(event: any) {
    this.storageService.setData('language', event.detail.value);
    this.translateService.setDefaultLang(event.detail.value);
  }

}
