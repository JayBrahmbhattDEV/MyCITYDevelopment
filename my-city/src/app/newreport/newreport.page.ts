import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newreport',
  templateUrl: './newreport.page.html',
  styleUrls: ['./newreport.page.scss'],
})
export class NewreportPage implements OnInit {
  newReport: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.newReport = this.formBuilder.group({
      issue: new FormControl(''),
      descrip: new FormControl('', Validators.required),
      location: new FormControl()
    });
  }

  selectedIssue(item){
    console.log(item.detail.value);
  }

}
