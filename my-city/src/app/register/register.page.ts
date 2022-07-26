import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AccountService } from 'src/services/account.service';

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
    private menuController: MenuController
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

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  get controls() {
    return this.RegForm.controls;
  }

  loginRoute() {
    this.submitted = true;
    if (this.RegForm.valid) {
      this.accountService.register(this.RegForm.value).subscribe(
        (response) => {
          this.storage.set('user', response);
          this.router.navigateByUrl(`/login`);
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }
}
