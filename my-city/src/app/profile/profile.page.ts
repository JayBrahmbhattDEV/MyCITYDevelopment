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

  constructor(public accountService: AccountService, public formBuilder: FormBuilder, private commonService: CommonService) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: [],
      email: [],
      phone: [],
      dob: []
    })
    
    this.accountService.getProfile().subscribe((res: any) =>{
      this.profileForm.controls.name.setValue(res.data.user.name);
      this.profileForm.controls.email.setValue(res.data.user.email);
      this.profileForm.controls.phone.setValue(res.data.user.phoneNumber);
    })
  }

  IonViewWillEnter(){
    
  }

  save(){
    this.accountService.updateProfile(this.profileForm.value).subscribe((res:any) =>{
      console.log(res);
    })
  }


  change(data){
   let temp = new Date(data.target.value).toLocaleDateString();
   console.log(temp);
  }

  
}
