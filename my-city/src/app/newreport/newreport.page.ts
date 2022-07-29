import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-newreport',
  templateUrl: './newreport.page.html',
  styleUrls: ['./newreport.page.scss'],
})
export class NewreportPage implements OnInit {
  radioForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.radioForm = this.formBuilder.group({
      
    })
  }

}
