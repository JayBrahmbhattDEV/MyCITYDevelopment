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
      this.profileForm.patchValue({
        name: this.Userdata.data.name,
        email: this.Userdata.data.email,
        phone: this.Userdata.data.phoneNumber,
        dob: this.dateOfBirth
      })
      console.log(this.Userdata);
    })
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
