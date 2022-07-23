import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  LoginForm: FormGroup;
  submitted = false;

  constructor(public formBuilder: FormBuilder, public router: Router, public navController: NavController) { }

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    })
  }

  get errorCtr() {
    return this.LoginForm.controls;
  }

  onSub() {
    this.submitted = true;
    console.log(this.LoginForm.value);
  }

  dashRoute(){
    if(this.LoginForm.valid){
      this.router.navigateByUrl(`/dashboard`)
    }
  }
}
