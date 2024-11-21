import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CommonService } from '../services/common.service';
import { MESSAGES } from '../utils/constants';

@Component({
  selector: 'cc-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  account = inject(AccountService);
  common = inject(CommonService)
  users: any;
  showGovtSugg: boolean;

  govtAlerts = [
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Govt. Alert 1',
      description: 'Important update regarding safety measures.',
    }
  ];

  constructor() { }

  ngOnInit() {
    if (history.state.fromGtSugg) this.showGovtSugg = true;
    else {
      this.showGovtSugg = false;
      this.getAllUsersList();
    }
  }

  getAllUsersList() {
    this.account.getAllUsers().subscribe((res: any) => {
      if (res) this.users = res.data.userList;
      else this.common.presentToaster({ message: res.message || MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER });
      this.common.hideLoading();
    });
  }
}
