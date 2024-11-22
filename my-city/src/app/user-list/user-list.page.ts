import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CommonService } from '../services/common.service';
import { MESSAGES } from '../utils/constants';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'cc-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  account = inject(AccountService);
  common = inject(CommonService);
  actionSheetCtrl = inject(ActionSheetController)
  users: any;
  showGovtSugg: boolean;
  result: string;

  govtAlerts = [
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Govt. Alert 1',
      description: 'Important update regarding safety measures.',
    }
  ];


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

  async presentActionSheet(id: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Manage user',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.openDeleteAlert(id);
          },
          data: {
            action: 'delete',
          },
        },
        {
          text: 'View pins',
          data: {
            action: 'view',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    this.result = JSON.stringify(result, null, 2);
  }

  openDeleteAlert(userId: string) {
    this.common.presentAlert(MESSAGES.DELETE_USER, 'Alert',
      {
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { },
          },
          {
            text: 'Delete',
            handler: () => {
              this.deleteUser(userId);
            }
          },
        ],
      }
    )
  }

  deleteUser(id: string) {
    this.account.deleteUser(id).subscribe((res: any) => {
      if (res.success) {
        this.common.presentToaster({ message: MESSAGES.USER_DELETED_SUCCESS, color: 'success' });
        this.getAllUsersList();
      }
      else {
        this.common.presentToaster({message: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER, color: 'danger'})
      }
    });
  }
}
