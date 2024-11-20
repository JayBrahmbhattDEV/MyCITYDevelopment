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

  constructor() { }

  ngOnInit() {
    this.getAllUsersList();
  }

  getAllUsersList() {
    this.account.getAllUsers().subscribe((res: any) => {
      if (res) this.users = res.data.userList;
      else this.common.presentToaster({ message: res.message || MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER });
    });
  }
}
