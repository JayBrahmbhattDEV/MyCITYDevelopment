import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';


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

  constructor(public accountService: AccountService, public formBuilder: FormBuilder, private commonService: CommonService) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: [],
      email: [],
      phone: [],
      dob: []
    })

    this.accountService.getProfile().subscribe((res: any) =>{
      this.Userdata = res;
      this.userDob = this.Userdata.data.dob
      this.profileForm.patchValue({
        name: this.Userdata.data.name,
        email: this.Userdata.data.email,
        phone: this.Userdata.data.phoneNumber,
        dob: this.Userdata.data.dob
      })
    })
    this.futureDisabled();
  }

  futureDisabled(){
    var date:any = new Date();
    var todayDate:any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year:any = date.getFullYear();
    if(todayDate < 10){
      todayDate = 0 + todayDate;
    }
    if(month < 10){
      month = 0 + month;
    }
    this.maxDate = year + "-" + month + "-" + todayDate;
  }

  save(){
    this.accountService.updateProfile(this.profileForm.value).subscribe((res:any) =>{
      console.log(res);
    })
    this.accountService.getProfile();
  }


  change(data){
   this.dateOfBirth = new Date(data.target.value).toLocaleDateString();
   console.log(this.dateOfBirth);
  }
  
}
