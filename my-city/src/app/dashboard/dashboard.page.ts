import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AccountService } from '../services/account.service';
import { ChatService } from '../services/chat.service';
import { CommonService } from '../services/common.service';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isReportLoaded = false;
  totalReports: any = 0;
  pages = [
    {
      text: 'DASHBOARD_PAGE.Add Report',
      url: '/add-report',
      image: './assets/icon/add-report.svg',
    },
    {
      text: 'DASHBOARD_PAGE.My Reports',
      url: '/reports',
      image: './assets/icon/my-reports.svg',
    },
    {
      text: 'DASHBOARD_PAGE.Recent Reports',
      url: '/recent-reports',
      image: './assets/icon/recent-reports.svg',
    },
    {
      text: 'DASHBOARD_PAGE.Government suggestions',
      url: '/all-users',
      image: './assets/icon/goverments-alerts.svg',
    },
  ];

  slideOpts = {
    slidesPerView: 1.5,
  };

  allReports: Array<any> = [];
  showChat = false;
  newMessage = '';
  chatMessages: any[] = [

    {
      text: 'Hi',
      sender: 'user',
      timestamp: new Date(),
      isStreaming: false,
    },
    {
      text: ' <think>Okay Hi How can i help you Okay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help youOkay Hi How can i help you',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: false,
    },
  ];

  @ViewChild('messageList') messageListRef: ElementRef;

  constructor(
    public router: Router,
    private accountService: AccountService,
    private storage: Storage,
    private navController: NavController,
    private commonService: CommonService,
    private readonly reports: ReportsService,
    private http: HttpClient,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.storage.create();
  }

  ionViewWillEnter() {
    this.getReports();
  }

  addReport(url: string) {
    if (url === 'My Issues') {
      if (this.accountService.token) {
        this.router.navigateByUrl('/reports');
      } else {
        this.commonService.presentAlert(
          `Oops, it looks like you aren't logged in yet, do you want to login?`,
          'Information',
          {
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {},
              },
              {
                text: 'Login Now',
                cssClass: 'alert-button-confirm',
                handler: () =>
                  this.navController.navigateRoot('/login', {
                    queryParams: {
                      redirectTo: '/add-report',
                    },
                  }),
              },
            ],
          }
        );
      }
      return;
    }
    this.router.navigateByUrl(url, {
      state: { fromGtSugg: url === '/all-users' ? 'gt-sugg' : undefined },
    });
  }

  getReports() {
    this.reports.geRecentReports().subscribe((response: any) => {
      this.allReports = response.data;
      this.isReportLoaded = true;
    });
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatMessages = [
      ...this.chatMessages,
      {
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
        isStreaming: false,
      },
    ];
    const userMessage = this.newMessage;
    this.newMessage = '';

    const botMessage = {
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true,
    };
    this.chatMessages = [...this.chatMessages, botMessage];

    try {
      const subscription = this.chatService
        .sendMessageStream(userMessage)
        .subscribe({
          next: (chunk) => {
            this.chatMessages = this.chatMessages.map((msg, index) => {
              if (index === this.chatMessages.length - 1) {
                return { ...msg, text: msg.text + chunk };
              }
              return msg;
            });
            this.scrollToBottom();
          },
          error: (error) => {
            console.error('Chat error:', error);
            this.showError();
          },
          complete: () => {
            this.chatMessages = this.chatMessages.map((msg) =>
              msg.isStreaming ? { ...msg, isStreaming: false } : msg
            );
          },
        });
    } catch (error) {
      this.showError();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageListRef?.nativeElement) {
        this.messageListRef.nativeElement.scrollTop =
          this.messageListRef.nativeElement.scrollHeight;
      }
    }, 50);
  }

  private showError() {
    this.chatMessages = [
      ...this.chatMessages,
      {
        text: 'Sorry, there was an error connecting to the chat service.',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: false,
      },
    ];
    this.scrollToBottom();
  }
}
