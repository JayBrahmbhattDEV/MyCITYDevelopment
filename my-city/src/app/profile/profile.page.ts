import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  Userdata: any;
  dateOfBirth: any;
  maxDate: any;
  userDob: any;

  constructor(
    public accountService: AccountService,
    public formBuilder: FormBuilder,
    private commonService: CommonService,
    private storageService: StorageService,
    private navController: NavController,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: [],
      email: [],
      phone: [],
      dob: [],
      address: new FormControl(),
    });

    this.accountService.getProfile().subscribe((res: any) => {
      this.Userdata = res;
      this.userDob = this.Userdata.data.dob;
      this.profileForm.patchValue({
        name: this.Userdata.data.name,
        email: this.Userdata.data.email,
        phone: this.Userdata.data.phoneNumber,
        dob: this.Userdata.data.dob,
      });
    });
    this.futureDisabled();
  }

  logOut(){
    this.commonService.presentAlert(
      `Are you sure you want to log-out?`,
      'Alert',
      {
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
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
        if(res.success){
          this.commonService.presentToaster({message: res.message + `😄`, color:'success'})
        }
      });
    this.accountService.getProfile();
  }

  change(data) {
    this.dateOfBirth = new Date(data.target.value).toLocaleDateString();
    console.log(this.dateOfBirth);
  }
}
