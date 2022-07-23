import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  RegForm: FormGroup;
  submitted = false;

  constructor(public formBuilder: FormBuilder, public router: Router, public navController: NavController, public storage: Storage) { }

  ngOnInit() {
    this.storage.create();
    this.RegForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    })
  }

  get errorCtr() {
    return this.RegForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.RegForm.value, "WOkes");
  }
  
  loginRoute(){
    this.storage.set("email", this.RegForm.controls.email.value)
    if(this.RegForm.valid){
      this.router.navigateByUrl(`/login`)
    }
  }

}
