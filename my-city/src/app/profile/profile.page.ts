import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;

  constructor(public accountService: AccountService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    const userName = localStorage.getItem("name");
    const emailId = localStorage.getItem("email");
    const contact = localStorage.getItem("phone");
    this.profileForm = this.formBuilder.group({
      name: [userName],
      email: [emailId],
      phone: [contact],
      dob: []
    })
  }

  
}
