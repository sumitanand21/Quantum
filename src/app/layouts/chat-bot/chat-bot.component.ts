import { Component, AfterViewInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env/environment';

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}
@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements AfterViewInit {

  wittyParrotIframe = envADAL.wittyParrotIframe;
  baseurl: string
  iframe: any
  devEnv = false;

  // public wittyParrotIframe : string
  public digitalAssistantUrl: string;

  constructor(public service: DataCommunicationService,
    public daService: DigitalAssistantService,
    public envr : EnvService) {
  }

  ngOnInit() {

    // if (this.envr.envName == 'DEV' || this.envr.envName == 'PROD' || this.envr.envName == 'PREUAT' || this.envr.envName == 'MOBILEQA' || this.envr.envName == 'UAT') {
    //   this.devEnv = true;
    //   this.digitalAssistantUrl = this.envr.daUrl;
    // }
  }

  // public iframeLoaded(): void {
  //   console.log("iframe has loaded");
  //   let iframeWin = (<HTMLIFrameElement>document.getElementById("useriframe"));
  //   if (iframeWin) {
  //     console.log("this is where we post message");
  //     let body;
  //     // let deal;
  //     if (this.daService.postMessageData) {
  //       body = this.daService.postMessageData;
  //       body['token'] = localStorage.getItem('token');
  //       body['UserName'] = localStorage.getItem('upn');
  //       iframeWin.contentWindow.postMessage(body, this.envr.daUrl);

  //       // deal=this.daService.postMessageData;
  //       // deal['dealData'] = localStorage.getItem('Dealoverview');
  //       // iframeWin.contentWindow.postMessage(deal, environment.daUrl);
  //       // console.log('Dealoverview')
  //     } else {
  //       this.daService.postMessageData = undefined;
  //       iframeWin.contentWindow.postMessage({
  //         token: localStorage.getItem('token'),
  //         page: this.daService.iframePage,
  //         UserName: localStorage.getItem('upn')
  //         // dealData:this.daService.iframePage // Vijay
  //       }, this.envr.daUrl);
  //     }
  //   }
  // }


  // ngOnInit() {
  //   this.iframe=this.DaService.WittyIframe.subscribe(res=>{
  //     console.log(res)
  //     this.wittyParrotIframe=this.wittyParrotIframe+this.iframe+res
  //   })
  //   console.log(this.iframe);
  //   this.wittyParrotIframe=this.wittyParrotIframe+this.iframe
  // }

  ngAfterViewInit() {
    console.log('wittyParrotIframe', this.wittyParrotIframe)
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EnvService } from '@app/core/services/env.service';

@Pipe({
  name: 'chatBotsafe'
})
export class chatBotSafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
