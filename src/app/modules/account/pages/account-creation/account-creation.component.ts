import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog} from '@angular/material';
import { SearchAccountPopupComponent } from '@app/shared/modals/search-account-popup/search-account-popup.component';
import { DataCommunicationService } from '@app/core';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.scss']
})
export class AccountCreationComponent implements OnInit {
  dnbtoken: any;
  IsHelpDesk: string;
    constructor(public service:AccountService,  public master3Api: S3MasterApiService , public dialog:MatDialog,public userdat: DataCommunicationService, public router: Router, private EncrDecr: EncrDecrService) { }

  ngOnInit() {
      this.IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
    console.log(" helpdesk-->",this.IsHelpDesk);
  }
  activerequest:boolean = true;
  creationhistory:boolean = false;
  activerequest1()
  {
    this.activerequest=true;
    this.creationhistory=false;
  }
  creationhistory1()
    {
      this.activerequest=false;
      this.creationhistory=true;
    }
    getdnbtoken()
    {
      
        this.master3Api.getdnbtoken("code").subscribe((res:any) => {
        console.log(" dnb token ", res);
        this.dnbtoken = res.ResponseObject.access_token
        localStorage.setItem('dNBToken',this.dnbtoken)
      },
      error => console.log("error ::: ", error))
    }
    accountnavigate()
    {
      if(this.IsHelpDesk == "true")
      {
        this.router.navigate(['/accounts/helpdeskaccountcreation'])
       
      }
      else{
        this.router.navigate(['/accounts/accountcreation/createnewaccount'])
      }
    }
    openaccountsearch()
    {
      const dialogRef = this.dialog.open(SearchAccountPopupComponent,
        {
          disableClose: true,
          width:'380px',
          data: { openDnB: false }
        }
        );
    }
    navigateBack(){
      switch(this.userdat.selectedTabValue) { 
        case  'My active accounts':
        this.router.navigateByUrl('/accounts/accountlist/allactiveaccounts');
        break;

        case  'All accounts':
        this.router.navigateByUrl('/accounts/accountlist/farming');
        break;

        case  'All advisor accounts':
        this.router.navigateByUrl('/accounts/accountlist/AnalystAdvisor');
        break;

        case  'All alliance accounts':
        this.router.navigateByUrl('/accounts/accountlist/alliance');
        break;

        case 'All reserve accounts':
        this.router.navigateByUrl('/accounts/accountlist/reserve');
        break;

        case 'NA':
        this.router.navigateByUrl('/accounts/accountlist/farming');
        break;

        default:
        this.router.navigateByUrl('/accounts/accountlist/farming');

        }
    }
   
}
