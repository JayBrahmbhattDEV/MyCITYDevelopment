import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isSubmitted = false;
  constructor(public formBuilder: FormBuilder, private nativeStorage: NativeStorage) { }

  ngOnInit() {
  }

  LoginForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    contact: ['', Validators.required]
  })

  get errorControl() {
    return this.LoginForm.controls;
  }

  submit(){
    console.log(this.LoginForm.value);
    this.nativeStorage.setItem('name', this.LoginForm.controls.name.value)
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
  }
  
}
