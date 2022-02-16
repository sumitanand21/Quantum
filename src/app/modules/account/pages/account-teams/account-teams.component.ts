import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Component, OnInit,HostListener } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog,MatDialogRef} from '@angular/material';
import { DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-teams',
  templateUrl: './account-teams.component.html',
  styleUrls: ['./account-teams.component.scss']
})
export class AccountTeamsComponent implements OnInit {
  constructor(public service:AccountService,private EncrDecr: EncrDecrService, public dialog:MatDialog,public userdat: DataCommunicationService,public router: Router) { }

  account_name;
  ngOnInit() {
    // this.account_name = localStorage.getItem('accountName');
    this.account_name = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip');
  }
  incen:boolean;
  nonincen:boolean;
  incen1()
  {
    this.incen=true;
    this.nonincen=false;
  }
  nonincen1()
    {
      this.incen=false;
      this.nonincen=true;
    }
    opensubaccounts()
    {
      {
        const dialogRef = this.dialog.open(SubAccounts,
          {
            disableClose:true,
            width:'400px'
          });
       }
    }
}


@Component({
  selector: 'sub_accounts',
  templateUrl: './sub_accounts.html',
})
export class SubAccounts {
constructor(public accservive:DataCommunicationService,private dialogRef: MatDialogRef<SubAccounts>)
{

}
@HostListener('window:keyup.esc') onKeyUp() {
  this.dialogRef.close();
}
  Apple_account=[
  
  {"heading":'Apple Inc-India',
   "Select":[{"option":'Apple. Inc- India', "id":1,"isExpand":false,
              "Suboption":[{"name":'Apple. Inc- India 1'},
                           {"name":'Apple. Inc- India 2'},
                           {"name":'Apple. Inc- India 3'}]
               },

               {"option":'Apple. Inc- US', "id":2,"isExpand":false,
               "Suboption":[{"name":'Apple. Inc- US 1'},
                            {"name":'Apple. Inc- US 2'},
                            {"name":'Apple. Inc- US 3'}]
               },

               {"option":'Apple. Inc- UAE', "id":3,"isExpand":false,
               "Suboption":[{"name":'Apple. Inc- UAE 1'},
                            {"name":'Apple. Inc- UAE 2'},
                            {"name":'Apple. Inc- UAE 3'}]
               },

               {"option":'Apple. Inc- Singapore', "id":4,"isExpand":false,
               "Suboption":[{"name":'Apple. Inc- Singapore 1'},
                            {"name":'Apple. Inc- Singapore 2'},
                            {"name":'Apple. Inc- Singapore 3'}]
              }]
  }
  ]
  getInitial(name){
    return name[0]
  }

  ExpandCollapse(collection,item){
     collection.map(x=>{
       if(x.id==item.id)
       {
         x.isExpand=!x.isExpand;
       }
       else{
         x.isExpand=false;
       }
       return x;
     })
   }



}


