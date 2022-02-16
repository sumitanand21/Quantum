import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog } from '@angular/material';
import { OpportunitiesService, } from '@app/core';
import { IfStmt } from '@angular/compiler';
import { Subject, Observable } from 'rxjs';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-landing-opportunity',
  templateUrl: './landing-opportunity.component.html',
  styleUrls: ['./landing-opportunity.component.scss']
})
export class LandingOpportunityComponent implements OnInit {

 constructor( private EncrDecr: EncrDecrService,  public router: Router,private allopportunities: OpportunitiesService, public service: DataCommunicationService,public dialog: MatDialog) { 

  this.rolebasedmethode = this.rolebasedmethode.bind(this);
  this.eventSubscriber9(this.allopportunities.subscriptionUser, this.rolebasedmethode);

 }

 subscriptionUser;
 eventSubscriber9(action: Subject<any>, handler: () => void, off: boolean = false) {
  if (off && this.subscriptionUser) {
    this.subscriptionUser.unsubscribe();
  } else {
    this.subscriptionUser = action.subscribe(() => handler());
  }
}

ngOnDestroy(): void {
  this.eventSubscriber9(this.allopportunities.subscriptionUser, this.rolebasedmethode, true);
 }
//  mobile buttons starts here
 showmore;
 createshowmore;
//  mobile buttons ends here
 CreateOppTab:boolean=false;
 accountCreateTab = false;
 CreateTabFinder = false
// CreateOppTab2=false;
sidebar:boolean;
accountName='';
   


    

getSymbol(data) {
if (data) {
return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    } else {
return'';
    }
 
}


  ngOnInit() {
// this.rolebasedmethode();
if (this.router.url.includes('accounts/accountopportunity/allopportunity')) {
  this.sidebar=true;
  this.accountName = this.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));

}
  }

  accountNav(){
    this.router.navigate(['/accounts/accountdetails']);

}
accountListNav(){
 const routeId =  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeValue'), 'DecryptionDecrip');
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
 
    default:
      this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
      break;

  }
}

  rolebasedmethode() {
 

    
var response = this.allopportunities.getSession('userobjj')
console.log(response,'responseeeee')
    if((response.ResponseObject.IsMarketingFunctionAndRole!=true || response.ResponseObject.IsMarketingFunctionAndRole==true)&& (
  response.ResponseObject.IsDeliveryFunction==true ||
  response.ResponseObject.IsPpsFunction==true ||
  response.ResponseObject.IsAdvisorFunction==true||
  response.ResponseObject.IsSalesEMKTAndSLBDMRole==true ||
  response.ResponseObject.IsPreSaleAndRole==true ||
  response.ResponseObject.IsSaleSLFunction==true ||
  response.ResponseObject.IsHelpRoleFullAccess==true || response.ResponseObject.IsGainAccessRole==true
) ){
    this.CreateOppTab=false;

}
 if(response.ResponseObject.IsMarketingFunctionAndRole==true || response.ResponseObject.IsSalesCoordinatorIndiaDealsRole ){
  this.CreateOppTab=true;
}


//     this.allopportunities.roleApi().subscribe(response => {
//       console.log("usrerole",response);
//       console.log("usrerole",response.ResponseObject);
//       if (!response.IsError) {

// if((response.ResponseObject.IsMarketingFunctionAndRole!=true || response.ResponseObject.IsMarketingFunctionAndRole==true)&& (
//   response.ResponseObject.IsDeliveryFunction==true ||
//   response.ResponseObject.IsPpsFunction==true ||
//   response.ResponseObject.IsAdvisorFunction==true||
//   response.ResponseObject.IsSalesEMKTAndSLBDMRole==true ||
//   response.ResponseObject.IsPreSaleAndRole==true ||
//   response.ResponseObject.IsSaleSLFunction==true ||
//   response.ResponseObject.IsHelpRoleFullAccess==true || response.ResponseObject.IsGainAccessRole==true
// ) ){
//     this.CreateOppTab=true;

// }
//  if(response.ResponseObject.IsMarketingFunctionAndRole==true || response.ResponseObject.IsSalesCoordinatorIndiaDealsRole ){
//   this.CreateOppTab=false;
// }

//       }
//       else {

//         this.allopportunities.displayMessageerror(response.Message);
//       }

//        } ,
//       err => {
//         this.allopportunities.displayerror(err.status);

//       });
  
if(this.router.url.includes('/opportunity/allopportunity')){

}
else{
  var detailsFromAccount = this.allopportunities.getSession('accountDetails');
  
  var accountType =  detailsFromAccount && detailsFromAccount.accountDetails && detailsFromAccount.accountDetails.Type && detailsFromAccount.accountDetails.Type.Value?detailsFromAccount.accountDetails.Type.Value:''
  console.log(detailsFromAccount.accountDetails.Type,'detailsdetails')

  var accountTypeId = null;
  var accountClassificationId = null;
  if(detailsFromAccount && detailsFromAccount.accountDetails) {
    accountTypeId = detailsFromAccount.accountDetails.Type ? detailsFromAccount.accountDetails.Type.Id : null;
    accountClassificationId = detailsFromAccount.accountDetails.AccountClassification ? detailsFromAccount.accountDetails.AccountClassification.Id : null;
  }
    if( accountType.toUpperCase() =='RESERVE' || (accountTypeId == 3 && accountClassificationId == 2)){
      this.accountCreateTab = true
    }
}

}

     // MORE ACTION STARTS **************
     showContent: boolean = false;

     contentArray = [
       { className: 'mdi mdi-close', value: 'Disqualify' },
       { className: 'mdi mdi-crop-square', value: 'Nurture' },
       // { className: 'mdi mdi-bullhorn', value: 'Request campaign' }
     ]
   
     additem(item) {
   
       this.showContent = false;
     }
   
     closeContent() {
       this.showContent = false;
     }
   
     toggleContent() {
       this.showContent = !this.showContent;
     }
   // MORE ACTION ENDS *******************

  more_clicked:boolean;
  action_clicked:boolean;
  all_lead: boolean;

  open_lead: boolean;

 myopen_lead: boolean;

  all(){
 
    this.all_lead = true;
 
    this.open_lead = false;
 
    this.myopen_lead = false;
  }
 
 
open(){
    
    this.all_lead = false;
 
    this.open_lead = true;
 
    this.myopen_lead = false;
  }
 
myopen(){
 
    this.all_lead = false;
 
    this.open_lead = false;
 
    this.myopen_lead = true;
    }

      finderNavigateTo(page) {
       this.isLoading = true;
      this.allopportunities.setSession('path',this.router.url);
      }
      isLoading = false;
    navigateTo(page) {
      this.isLoading=true;
      this.allopportunities.setSession('path',this.router.url);
      switch(page) {
        case 'new': this.router.navigate(['/opportunity/newopportunity']);
                     return;
        case 'renewal': this.router.navigate(['/opportunity/createopp/renewal']);
         return;
        case 'incremental' : this.router.navigate(['/opportunity/createopp/incremental']);
         return;
      }
    }
}





 