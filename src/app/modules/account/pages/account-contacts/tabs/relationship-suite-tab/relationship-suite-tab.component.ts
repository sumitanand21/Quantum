import { Component, OnInit, ElementRef } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';

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
  selector: 'app-relationship-suite-tab',
  templateUrl: './relationship-suite-tab.component.html',
  styleUrls: ['./relationship-suite-tab.component.scss']
})
export class RelationshipSuiteTabComponent implements OnInit {

  tasklistdetails:any;
  accountId:any = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip'); //localStorage.getItem('accountSysId');
  rsbaseurl = envADAL.toolkitUrl;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  frameUrl:any = this.rsbaseurl+`RsRelationship/Pages/RelSuiteAnalysis.aspx?id=${this.accountId}&ptype=1&status=0&userid=${this.userId}`;
  
  constructor(public service: DataCommunicationService, public EncrDecr: EncrDecrService, private hostElement: ElementRef) {
      
    this.tasklistdetails=[{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },
    {
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    },{
      name : 'Score card test RS 200616',
      no : '200616-02',
      creation : '23/08/2019',
      modification : '23/08/2018'
    }];
  }
  ngOnInit() {
    const iframe = this.hostElement.nativeElement.querySelector('iframe');
    iframe.src = this.frameUrl;
  }
  viewRelationSuite(){
    var url = this.rsbaseurl+`RsRelationship/Pages/ContactTaggingPage.aspx?userid=${this.userId}&ptype=1&id=${this.accountId}`; 
    console.log("url for iframe", url);
    var myWindow = window.open(url, "_blank");
  }
}
