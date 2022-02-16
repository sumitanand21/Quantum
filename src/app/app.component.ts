import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { RoutingState } from './core/services/navigation.service';
import { OfflineService } from './core/services/offline.services'
import { OnlineOfflineService } from './core/services/online-offline.service'
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Router } from '@angular/router';
declare let FileTransfer: any;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange } from '@angular/material/';
import { dealService } from './core/services/deals.service';
import { environment } from '@env/environment';
import { environment as env } from '@env/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DigitalAssistantService } from './core/services/digital-assistant/digital-assistant.service';
import { CommonService } from './core/services/common.service';
import { FacadeService } from './core/services/facade.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { HomeService } from '@app/core/services/home.service';
import html2canvas from 'html2canvas';
import { Observer, Observable } from 'rxjs';
import { FileUploadService } from './core/services/file-upload.service';
import { EnvService } from './core/services/env.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  scrolltopshow: boolean = false;
  lastScrollTop: number = 0;
  isLoading: boolean;
  help = false;
  isMobileDevice: boolean = false; //stepper tooltip mobile
  constructor(
    public envr : EnvService,
    public encrDecrService: EncrDecrService,
    public homeService: HomeService,
    public service: DataCommunicationService,
    private adalSvc: MsAdalAngular6Service,
    routingState: RoutingState,
    private offlineService: OfflineService,
    public router: Router,
    private readonly OnlineOfflineService: OnlineOfflineService,
    private dealService: dealService,
    public _error: ErrorMessage,
    public dialog: MatDialog,
    public daService: DigitalAssistantService,
    private facadeService: FacadeService,
    public errorMessage: ErrorMessage
  ) {
    // this.facadeService.routingUrl()
    routingState.loadRouting();
    window.onscroll = () => {
      // document.getElementById("scroll").click();
      this.service.dropclicked = false;
      let st = window.pageYOffset;
      let dir = '';
      if (st > this.lastScrollTop && window.pageYOffset > 100) {
        this.service.header = false;
        dir = "down";
      } else if (st < this.lastScrollTop) {
        this.service.header = true;
        dir = "up";
      }

      //scrolltotop
      if (window.pageYOffset > 300) {
        this.service.arrowScrollTop = true;
      }
      else {
        this.service.arrowScrollTop = false;
      }

      //stepper mobile tooltip
      if (this.isMobileDevice) {
        if (window.pageYOffset < 1) {
          this.service.ttip = true;
        } else {
          this.service.ttip = false;
        }
      }

      this.lastScrollTop = st;
      // lc.run(() => {
      //    this.service.header = false;
      //   this.direction = dir;
      // });
      // if(window.pageYOffset > 200){
      //   this.scrolltopshow = true;

      // }
      // else{
      //   this.scrolltopshow = false;
      // }
    };
  }

  async ngOnInit() {
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    // this.facadeService.routerData();
    if (typeof window['DocumentTouch'] === 'undefined') {
      window['DocumentTouch'] = HTMLDocument
    }
    if (this.envr.envName === 'MOBILEQA') {
      if (sessionStorage.getItem('adalAccessToken')) {
        sessionStorage.setItem('SysnToken', JSON.stringify(sessionStorage.getItem('adalAccessToken')))
      }
      await this.offlineService.ClearTablesdata(this.OnlineOfflineService.isOnline)
      await this.offlineService.ClearindexDb(this.OnlineOfflineService.isOnline)
    } else {
      try {
        if (env.production) {
          if (!this.adalSvc.isAuthenticated) { // to get the outlook token for sync activity
            this.adalSvc.login()
          } else {
            this.adalSvc.acquireToken(this.envr.outLookUrl).subscribe((resToken: string) => {
              sessionStorage.setItem('SysnToken', JSON.stringify(resToken))
            })
          }
        }
        await this.offlineService.ClearTablesdata(this.OnlineOfflineService.isOnline)
        await this.offlineService.ClearindexDb(this.OnlineOfflineService.isOnline)
      } catch (error) {
      }
    }

  }

  @HostListener('window:message', ['$event'])
  onMessage(e) {
    e.preventDefault();
    console.log(e.preventDefault(), 'e.preventDefault()')
    console.log('onMessage', e)
    if (e.origin != this.envr.daCommunicationUrl) {
      return false;
    }
    switch (e.data.selectedContent) {
      case 'docx': {
        console.log('yes is docx')
        this.isLoading = true
        let inputTemplate = { "ServerRelativeUrl": e.data.thirdPartyUrl }
        console.log(inputTemplate);
        this.dealService.wpListTemplateInfo1(inputTemplate).subscribe(async res => {
          console.log(res, "resposne download template")
          if (!res.IsError) {
            console.log(this.envr.envName)
            if (this.envr.envName == 'MOBILEQA') {
              console.log("I am inside mobile")
              this.isLoading = true
              this.downloadFile(res.ResponseObject.Base64String, e.data.fileName);
            } else {
              console.log("I am inside desktop")
              this.isLoading = false
              var link = document.createElement('a');
              link.href = res.ResponseObject.Base64String
              document.body.appendChild(link);
              link.click();
            }
          } else {
            this.isLoading = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        }, error => {
          this.isLoading = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        });
      }
        break
      case 'true': {
        console.log('yes is true')
        //  this.wpListTemplate = e.data;
        //   this.Template.setValue(e.data.attachmentDetails[0])
      }
        break
      case 'false': {
        console.log('yes is false')
        const dialogRef = this.dialog.open(previewTemplateDoc,
          {
            width: '1000px',
            data: [{ sPUniqueId: e.data.attachmentDetails[0].thirdPartyUrl }]
          });
      }
        break
      default:
        break;
    }
  }
  downloadFile(url, filename) {
    console.log("Mobile download method");
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    // var fileURL = "///storage/emulated/0/DCIM/" + filename
    var fileURL = "///storage/emulated/0/Download/" + filename
    this.isLoading = false;
    fileTransfer.download(
      uri, fileURL, function (entry) {
        alert("Successfully downloaded...");
        console.log("download complete: " + entry.toURL());
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      null, {
      //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //  } headers: {
      // 
    }
    )
  }

  /** Send token to Digital Assistance
   * Donot delete this
   * 
   * Author : Jithendra
   * Created : 17 Jan 2020
   * 
   */
  globalDataForDa() {
    this.daService.postMessage({ token: localStorage.getItem('token') });
  }

  openFeedbackPop() {
    html2canvas(document.body).then(canvas => {
      var imgData = canvas.toDataURL("image/jpeg", 0.5);
      console.log("mmm>>>>>>", imgData);

      //imageblob to imagefile
      const date = new Date().valueOf();
      let text = '';
      const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length) );
      }
      const imageName = date + '.' + text + '.jpeg';
      let imageBlob;
      this.dataURItoBlob(imgData).subscribe(data => {
        imageBlob = data;
      });
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

      const dialogRef = this.dialog.open(FeedbackComponent,
        {
          disableClose: true,
          width: '410px',
          data: {
            "moduleName": this.moduleName(),
            "feedbackText": "",
            "comment": "",
            "fileName": "",
            "filestorageUrl":"",
            "fileSize": imageFile.size,
            "userId": this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip'),
            "feedbackId": "",
            "addImage": true,
            "snapshot": imageFile
          }
        });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result)
      //  this.SendFeedBackMsgList(result);

      // });
    });
  }

  dataURItoBlob(dataURI): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      var byteString = atob(dataURI.split(',')[1])
      // const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }

  moduleName() {
    const splitString = this.router.url.split("/");
    switch (splitString[1]) {
      case "home":
        return "Home";
      case "accounts":
        return "Accounts";
      case "opportunity":
        return "Opportunities";
      case "order":
        return "Orders";
      case "activities":
        return "Activities";
      case "leads":
        return "Leads";
      case "campaign":
        return "Campaigns";
      case "contacts":
        return "Contacts";
      case "deals":
        return "Deals";
      case "helpdesk":
        return "Helpdesk";
      case "reports":
        return "Reports";
    }
  }
}
@Component({
  selector: 'previewDoc',
  templateUrl: './previewDoc.html',
  styleUrls: ['./app.component.scss']
})
export class previewTemplateDoc implements OnInit {
  urlData: '';
  isLocked: boolean = false;
  sPUniqueId: any;
  docPrevStaticUrl = 'https://devcatnew.wipro.com/publiczone/_layouts/15/WopiFrame.aspx?sourcedoc='
  // https://wipro365.sharepoint.com/sites/L20_WP_COLLAB_DEV/SitePages/preview.aspx
  previewUrl: SafeResourceUrl;

  constructor(
    public envr : EnvService,
    public dialogRef: MatDialogRef<previewTemplateDoc>,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: AnalyserNode) {

  }

  ngOnInit() {
    console.log(this.data, "data in ngonint")
    this.urlData = this.data[0].path
    this.isLocked = this.data[0].isLock
    // this.sPUniqueId = this.data[0].sPUniqueId
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.docPrevStaticUrl + this.data[0].sPUniqueId + '&action=default');
    console.log(this.urlData);
    console.log('previewUrl', this.previewUrl)

  }

  onOpenTab() {
    // window.open( "_blank");
    window.open(this.docPrevStaticUrl, "_blank");
  }
}
@Component({
  selector: 'app-feedback',
  templateUrl: './feedbackpop.html',
  styleUrls: ['./app.component.scss']

})
export class FeedbackComponent implements OnInit{
  Url: any;
  isLoading: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<FeedbackComponent>,
  private fileService: FileUploadService,
  public _error: ErrorMessage,
  public errorMessage: ErrorMessage,
  public homeService: HomeService,
  ){
    console.log(data);
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  SendFeedBackMsgList() {
    this.isLoading = true;
  let reqBody = {
    "moduleName": this.data.moduleName,
    "feedbackText":this.data.feedbackText,
    "comment": "",
    "fileName": "",
    "filestorageUrl": this.Url,
    "fileSize": this.data.fileSize,
  }
  console.log('FeedbackreqBody',reqBody);
    this.homeService.sendFeedbackFunc(reqBody).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        console.log(res);
        this.errorMessage.throwError(res.Message)
        this.dialogRef.close();
      } else {
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    });
  }

ngOnInit(){
  let imageFile = this.data.snapshot;
  console.log(imageFile)
  let fileList = [];
      const fd: FormData = new FormData();
            fd.append('file', imageFile);
            fileList.push(fd)
            this.isLoading = true;
            this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
              this.isLoading = false;
              res.forEach((file, i) => {
                if (file !== '') {
                this.Url= file.ResponseObject.Url
                console.log('Url', this.Url)
                }
              })
            }, error =>{
              this.isLoading = false;
            });
}
}