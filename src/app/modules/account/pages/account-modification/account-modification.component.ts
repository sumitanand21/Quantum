import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { DataCommunicationService } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-account-modification',
  templateUrl: './account-modification.component.html',
  styleUrls: ['./account-modification.component.scss']
})
export class AccountModificationComponent implements OnInit {
  roleAccess:boolean;
  constructor(public service:AccountService, public userdat: DataCommunicationService,private EncrDecr: EncrDecrService,public router: Router) { }

  ngOnInit() {
    this.roleAccess  = this.userdat.getRoleAccess();
  }
  modificationactiverequest:boolean;
  modificationcreationhistory:boolean;
  modificationactiverequest1()
  {
    this.modificationactiverequest=true;
    this.modificationcreationhistory=false;
  }
  modificationcreationhistory1()
    {
      this.modificationactiverequest=false;
      this.modificationcreationhistory=true;
    }
    goBack() {
      // let url;
      // this.router.events.filter(e => e instanceof NavigationEnd)
      //   .pairwise().subscribe((e) => {
      //       // console.log("previous url"+e);
      //       url
      //   });
     const routeId =  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeValue'), 'DecryptionDecrip');
      // const  url = '/accounts/accountlist/farming';
      //  this.accountListService.goBack(url);
       // this.router.navigate(['/accounts/accountdetails']);
       // this.location.back();
       this.redirectPage(routeId);
     }
     redirectPage(data) {
      switch (data ? data : '') {
        case "10":
          this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
          break;
        case "11":
          this.router.navigate(['/accounts/accountlist/farming']);
          break;
        case "12":
          this.router.navigate(['/accounts/accountlist/alliance']);
          break;
        case "14":
          this.router.navigate(['/accounts/accountlist/reserve']);
          break;
        case "13":
          this.router.navigate(['/accounts/accountlist/AnalystAdvisor']);
          break;
          case "15":
            this.router.navigate(['/accounts/accountsearch']);
            break;
        // case 'More views':
        //   this.router.navigate(['/accounts/accountlist/moreview']);
        //   break;
  
        default:
          this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
          break;
  
      }
    }
  
}
