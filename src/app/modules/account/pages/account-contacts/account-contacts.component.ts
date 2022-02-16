import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog,MatDialogRef} from '@angular/material';
import { DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-account-contacts',
  templateUrl: './account-contacts.component.html',
  styleUrls: ['./account-contacts.component.scss']
})
export class AccountContactsComponent implements OnInit {
roleAccess:boolean;
  constructor(public router: Router,
  public service:AccountService,
   public dialog:MatDialog,
   public userdat: DataCommunicationService,
   private EncrDecr: EncrDecrService,
   public accountListService: AccountListService) { }
   accountypeLoc : string = "";
   showrelSuit:boolean = true;
   showrelPlan:boolean = true;

  ngOnInit() {
    this.roleAccess  = this.userdat.getRoleAccess();
    this.accountListService.getAccountName().subscribe(res => {
      console.log("subject res of contact --- >>>>", JSON.stringify(res)) 
      this.accountypeLoc = JSON.stringify(res);
    })
    if(this.accountypeLoc == ""){
      this.accountypeLoc =  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accNumRef'), 'DecryptionDecrip')
      console.log('get account type from local--->',this.accountypeLoc);
    }
    let accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

    // let accountSysId = localStorage.getItem("accountSysId");
    let accountName  = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip');

    // let accountName = localStorage.getItem("accountName");
    let accountcontacts = { "Name": accountName, "SysGuid": accountSysId, "isProspect": false }
    let temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
    //localStorage.setItem("selAccountObj", temp);
    //sessionStorage.setItem('selAccountObj', temp);
     /**
      Advisor/ Consultant = 7
      Analyst type = 10
      Alliance/Partner = 6
      * 
      */
    switch (+this.accountypeLoc) {
      case 6:
          console.log("Alliance/Partner");
          this.showrelSuit = false;
          this.showrelPlan = false;
          break;
      case 7:
          console.log("Advisor/ Consultant");
          this.showrelSuit = false;
          this.showrelPlan = false;
          break;
      case 10:
          console.log("Analyst type");
          this.showrelSuit = false;
          this.showrelPlan = false;
          break;
      default:
          console.log("All");
          break;
  }
  }
  accountcontacts:boolean;
  relationshipsuite:boolean;
  relationshipplan:boolean;

  accountcontacts1()
  {
    this.accountcontacts=true;
    this.relationshipsuite=false;
    this.relationshipplan=false;

  }
  relationshipsuite1()
  {
    this.accountcontacts=false;
    this.relationshipsuite=true;
    this.relationshipplan=false;
  }

  relationshipplan1()
    {
    this.accountcontacts=false;
    this.relationshipsuite=false;
    this.relationshipplan=true;
  }
  createredirect(){
   //let accountcontacts = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem("selAccountObj"), 'DecryptionDecrip');
    //console.log("data passing ",JSON.parse(accountcontacts));
    //console.log("aaaaaaaaaaaaaaaaaaaa",accountcontacts)
    //localStorage.removeItem("selAccountObj");
    sessionStorage.setItem("Module",JSON.stringify(1));
    this.router.navigate(['/contacts/CreateContactComponent']);
  }

}
