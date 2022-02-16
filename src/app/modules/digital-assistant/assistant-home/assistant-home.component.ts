import { Component, OnInit } from '@angular/core';
import { AssistantSocketService } from '../services/assistant-socket.service';
import { AssistantGlobalService } from '../services/assistant-global.service';
import { Router } from '@angular/router';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from '@app/core/services/env.service';
declare let SpeechSDK: any;
@Component({
  selector: 'app-assistant-home',
  templateUrl: './assistant-home.component.html',
  styleUrls: ['./assistant-home.component.scss']
})
export class AssistantHomeComponent implements OnInit {
  decodedTokenJson: any
  signed_request: string;
  loadInterval: NodeJS.Timer;

  // collaborate
  public body = {
    "environment": "",
    "hostApplication": "",
    "appSecret": "",
    "viewMode": "embeded",
    "parentObjectId": "some-external-identifier-899",
    "parentObjectName": "L2O_Group_Chat",
    "authToken": localStorage.getItem('token'),
    "memberlist": [],
    "restrictedMembers": false
  };
  enc: string;
  user: string;
  loginUserId: string = ''
  collaborationUrl: string = ''
  isCollaborationCliked: boolean = false;
  searchKeys = '';
  transactionDate: Date;
  constructor(
    private socketService: AssistantSocketService,
    public globalService: AssistantGlobalService,
    public router: Router,
    private encrDecrService: EncrDecrService,
    public daService: DigitalAssistantService,
    public envService: EnvService
  ) {
    this.body.environment = this.envService.collaborationEnvironment;
    this.body.hostApplication = this.envService.collaborationHostApplication;
    this.body.appSecret = this.envService.collaborationAppSecret;
    this.collaborationUrl = this.envService.collaborationUrl;

    this.decodedTokenJson = JSON.parse(window.atob(localStorage.getItem('token').toString().split(".")[1].replace("-", "+").replace("_", "/")));
    console.log('DA decode');
    console.log(this.decodedTokenJson)
    this.loginUserId = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      localStorage.getItem("userID"),
      "DecryptionDecrip"
    );
    this.globalService.adid = this.decodedTokenJson['upn'];
    this.globalService.userName = this.decodedTokenJson['unique_name'][0]
  
    this.globalService.getEmails().subscribe(res => {
      if (res) {
        res.emails.some(x => x == this.decodedTokenJson['email']) ? this.body.restrictedMembers = true : this.body.restrictedMembers = false;
        this.body.memberlist = res.emails;
        switch (res.page) {
          case 'OPPORTUNITY_DETAILS':
            this.body.parentObjectId = `opp_${res.id}`
            this.body.parentObjectName = `opp_${res.id}`
            break;
          case 'END_SALES_CYCLE':
            this.body.parentObjectId = `order_${res.id}`
            this.body.parentObjectName = `order_${res.id}`
            break;
          case 'ACCOUNT_DETAILS':
            this.body.parentObjectId = `acc_${res.id}`
            this.body.parentObjectName = `acc_${res.id}`
            break;
          case 'ACCOUNT_CREATE_MODIFICATION':
            this.body.parentObjectId = `acc_${res.id}`
            this.body.parentObjectName = `acc_${res.id}`
            break;
        }
        if (this.isCollaborationCliked) {
          this.collaborate()
        }
      } else {
        this.body.memberlist = [];
        this.body.memberlist.push(this.decodedTokenJson['email'])
        this.body.restrictedMembers = false;
        this.body.parentObjectName = "L2O_Group_Chat";
        this.body.parentObjectId = "some-external-identifier-899"
        if (this.isCollaborationCliked) {
          this.collaborate()
        }
      }
    })
    // this.signed_request = 'ewoJImVudmlyb25tZW50IjoiUUEiLAogICAgImhvc3RBcHBsaWNhdGlvbiI6IkwyTyIsCiAgICAiYXBwU2VjcmV0IjoiMWY2NjdjNGItMGVhMC0xMWU1LWIyNjctZjBkZWYxMTc2NDNkIiwKICAgICJ2aWV3TW9kZSI6ImVtYmVkZWQiLAogICAgInBhcmVudE9iamVjdElkIjoic29tZS1leHRlcm5hbC1pZGVudGlmaWVyLTg5OSIsCiAgICAicGFyZW50T2JqZWN0TmFtZSI6IkwyTyBEZWFsIDg5OSIsCiAgICAiYXV0aFRva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJbmR2ZWxnMWRXUmxZbUZ1WTAxc2JYcGlVa3BPVFdGVFNrUnFPQ0o5LmV5SmhkV1FpT2lKb2RIUndjem92TDNGMVlXNTBkVzFrTG5kcGNISnZMbU52YlM5aGNHa3ZaR0YwWVM5Mk9TNHdMeUlzSW1semN5STZJbWgwZEhBNkx5OTNhWEJtYzNWaGRDNTNhWEJ5Ynk1amIyMHZZV1JtY3k5elpYSjJhV05sY3k5MGNuVnpkQ0lzSW1saGRDSTZNVFUxTURrek5qWXlOQ3dpWlhod0lqb3hOVFV3T1RRd01qSTBMQ0p3Y21sdFlYSjVjMmxrSWpvaVV5MHhMVFV0TWpFdE5UYzVPRGs0TkRFdE5qRTJNalE1TXpjMkxURTRNREUyTnpRMU16RXROVGt6TURrNUlpd2lkWEJ1SWpvaVlXNXVkbXhBZDJsd2NtOHVZMjl0SWl3aWRXNXBjWFZsWDI1aGJXVWlPaUpYU1ZCU1QxeGNRVTVPVmt3aUxDSmhjSEIwZVhCbElqb2lRMjl1Wm1sa1pXNTBhV0ZzSWl3aVlYQndhV1FpT2lKbFpqWmtPVEV6TlMxbE5HUXdMVFJsTkdJdFlXTmlZaTFtWkRneFpUVmxORFZqWmpraUxDSmhkWFJvYldWMGFHOWtJam9pZFhKdU9tOWhjMmx6T201aGJXVnpPblJqT2xOQlRVdzZNaTR3T21Gak9tTnNZWE56WlhNNlVHRnpjM2R2Y21SUWNtOTBaV04wWldSVWNtRnVjM0J2Y25RaUxDSmhkWFJvWDNScGJXVWlPaUl5TURFNUxUQXlMVEl6VkRFMU9qUXpPalEwTGpJMk5Wb2lMQ0oyWlhJaU9pSXhMakFpZlEuY0t2bUkzT0d4T09yOFZNQ04zUWd5c3M2ekR1Y1h4VXRjaXB4S01yRW0zVkg3MTV5MFdWbFExVm1WamxmSHJuazRPdWQxWlRzUUhETFZVcXNmZ2pzRzlMQ2dHWkZLRjJoUGRaSjBtZUhwc1hFeUNVVFJHSnRwWE1ZV09Jekp6dS1OVjhrM3drZTRUckJaRTdDS1hnR25sZmU2SzFWb2ZVcDNRUmVRXzlxT3VWcU9fSkZLNmN1RU42NjBuYzNoWFJ3WEYxX0J4WUFJOE5Ud2Zqd0VQWGlQTVZKYWpKRU5UclRCc3JvUE0wT2VsbThkMWdWUDZkLS1lYlVNNzR1TjFIREhoTzJVYm0zUnVaNVBXY3dOb2VrcV9MdlAybHF2ZFg4aVNTZDBkYjNqUFdwbDBoUkl6WGZkbFZmcGU0WFBQVjZqcFc4ZkRIMXpQUXFpV1B0cVI4Q2t3IiwKICAgICJtZW1iZXJsaXN0IjpbImFubnZsQHdpcHJvLmNvbSIsIm1laHJhakB3aXR0eXBhcnJvdC5jb20iLCJ0YWhlckB3aXR0eXBhcnJvdC5jb20iLCJ0YWhlcnlvcHB5QHlvcG1haWwuY29tIl0KfQ==';
  }

  
  ngOnInit() {
    this.user = this.decodedTokenJson['unique_name'][0];
    this.socketService.configFunc();
    this.showFAQ()
    console.log("I am inside home")
  }

  searchList;
  faqSection = false;

  faqQuestion(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      console.log(this.searchKeys);
      this.globalService.chatList.push({
        userType: 'User',
        displayName: this.user,
        dateTime: new Date(),
        data: this.searchKeys,
        qId: '',
        isHelpLine: false,
        isSession: false
      });

      this.socketService.sendMessage(this.searchKeys)
      this.searchKeys = '';
      this.showFAQ();
    }
  }
  recognizer
  isPlay: boolean = false;
  openRecord(): void {
    if (this.isPlay) {
      var subscriptionKey = "50cb684cff5b44abad90aaff3fcb8f22";
      var serviceRegion = "southeastasia"
      var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
      speechConfig.speechRecognitionLanguage = "en-US";
      var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      this.recognizer.startContinuousRecognitionAsync(() => console.log("speech"));
      this.recognizer.recognizing = (s, e) => this.recognizing(s, e);
      this.recognizer.recognized = (s, e) => this.recognized(s, e);
    }
    else {
      this.stop();
    }

  }

  recognizing(s, e) {
    console.log('recognizing text', e.result.text);
  }
  recognized(s, e) {
    console.log('recognized text', e.result.text);
    this.searchKeys += e.result.text;
    console.log(this.searchKeys);
  }
  stop() {
    debugger
    this.globalService.chatList.push({
      userType: 'User',
      displayName: this.user,
      dateTime: new Date(),
      data: this.searchKeys,
      qId: '',
      isHelpLine: false,
      isSession: false
    });
    this.showFAQ();
    this.socketService.sendMessage(this.searchKeys);
    this.searchKeys = ''
    this.recognizer.stopContinuousRecognitionAsync();
  }

  onClickYes(isHelpLine, isSession, index) {
    if (isHelpLine) {
      this.socketService.sendMessage('Yes');
      this.globalService.chatList.push({
        userType: 'User',
        displayName: this.user,
        dateTime: new Date(),
        data: 'Yes',
        qId: '',
        isHelpLine: false,
        isSession: false
      });
      this.globalService.chatList[index].isHelpLine = false
    }
    if (isSession) {
      this.socketService.configFunc();
      this.socketService.sendMessage('hi');
      this.globalService.chatList.push({
        userType: 'User',
        displayName: this.user,
        dateTime: new Date(),
        data: 'Hi',
        qId: '',
        isHelpLine: false,
        isSession: false
      });
      this.globalService.chatList[index].isSession = false
    }
  }

  onClickNo(isHelpLine, isSession, index) {
    console.log(index)
    if (isHelpLine) {
      this.socketService.sendMessage('No');
      this.globalService.chatList.push({
        userType: 'User',
        displayName: this.user,
        dateTime: new Date(),
        data: 'No',
        qId: '',
        isHelpLine: false,
        isSession: false
      });
      this.globalService.chatList[index].isHelpLine = false
    }

    if (isSession) {
      this.globalService.chatList[index].isSession = false
      this.socketService.sendMessage('No');
      this.globalService.chatList.push({
        userType: 'User',
        displayName: this.user,
        dateTime: new Date(),
        data: 'No',
        qId: '',
        isHelpLine: false,
        isSession: false
      });
    }
  }
  openSearchList() {
    this.searchList = true;
  }
  onClickOutside() {
    this.searchList = false;
  }
  closeSearchList(data) {
    this.searchList = false;
    console.log(data);
    this.globalService.chatList.push({
      userType: 'User',
      displayName: this.user,
      dateTime: new Date(),
      data: data,
      qId: '',
      isHelpLine: false,
      isSession: false
    });
    this.socketService.sendMessage(data)
    this.searchKeys = '';
    this.showFAQ();
  }
  showFAQ() {
    this.faqSection = true;
    this.searchList = false;
  }
  getIndex() { // changes made by sudharshan for proposal templates
  }

  getTabIndex(event) {
    
  }
  tabChanged(event) {
    debugger;
    if (event.index == 1) {
      this.isCollaborationCliked = true;
      this.collaborate();
    }
    else {
      this.isCollaborationCliked = false
    }
  }

  collaborate() {
    debugger;
    console.log(JSON.stringify(this.body))
    this.loadInterval = setInterval(() => {
      let ele = (<HTMLFormElement>document.getElementById('wittyChatFormId'));
      if (ele && ele.isConnected) {
        let objJsonStr = JSON.stringify(this.body);
        this.enc = window.btoa(objJsonStr);
        console.log("json encoded to base64");
        console.log(this.enc);
        (<HTMLInputElement>document.getElementById('signed_request')).value = this.enc;
        console.log((<HTMLInputElement>document.getElementById('signed_request')).value);
        ele.submit();
        console.log(ele);
        clearInterval(this.loadInterval);
      } else {
        if (ele) {
          document.body.appendChild(ele);
        }
      }
    }, 500);
  }


}
