import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { OpportunitiesService, OrderService } from '@app/core';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  encId
  IsDirectAmendment
  isLoading: boolean = false;
  IsAmendment: boolean = false;
    directamend: boolean = false;
  constructor(private route: ActivatedRoute,
    public projectService: OpportunitiesService,
    private encrDecrService: EncrDecrService,
    private accountlistService: AccountListService,
    public orderService: OrderService,
    private router: Router, ) { }

  ngOnInit() {
    console.log("im insid et teh navugation usrl")
    console.log(this.router)
    console.log(this.route.snapshot.params.module)
    console.log(this.route.snapshot.params.sysid)

    if (this.route.snapshot.params.module == 4) {
      sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.route.snapshot.params.sysid, 'DecryptionDecrip')));
      this.router.navigate(['/leads/leadDetails'])
    }


    //order page navigation by saurav starts

    if (this.route.snapshot.params.module == 1088) {
      this.projectService.setSession("orderId", this.route.snapshot.params.sysid)
      console.log("guid", this.route.snapshot.params.sysid);

      const bookingIdPayload = {
        Guid: this.route.snapshot.params.sysid,
        FilterSearchText: this.orderService.newAmendmentDetails.WiproAmendmentType
      }
      console.log("sauravgetguid", bookingIdPayload.Guid)

      this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((res: any) => {
        console.log("getsalesresponse", res);
        this.projectService.setSession('opportunityId', res && res.ResponseObject && res.ResponseObject.OpportunityId ? res.ResponseObject.OpportunityId.toString() : '');
        this.projectService.clearSession("smartsearchData");
        this.projectService.setSession('opportunityName', res && res.ResponseObject && res.ResponseObject.name ? res.ResponseObject.name.toString() : '');
        this.projectService.setSession('orderType', res && res.ResponseObject && res.ResponseObject.OrderType ? res.ResponseObject.OrderType.toString() : '');
        this.projectService.setSession('orderName', res && res.ResponseObject && res.ResponseObject.OrderName ? res.ResponseObject.OrderName.toString() : '');
        this.projectService.setSession('orderId', res && res.ResponseObject && res.ResponseObject.OrderBookingId ? res.ResponseObject.OrderBookingId.toString() : '');
        this.projectService.setSession('pricingID', res && res.ResponseObject && res.ResponseObject.PricingTypeId ? res.ResponseObject.PricingTypeId : ''); 
         this.IsDirectAmendment = res && res.ResponseObject && res.ResponseObject.IsDirectAmendment ? res.ResponseObject.IsDirectAmendment : '';
         if(this.IsDirectAmendment == true ){
           this.directamend = true;
           this.projectService.setSession('IsDirectAmendment', this.directamend);
         } 
        this.projectService.setSession('BFMNavagationFlag', false);
        if (res.ResponseObject.OrderTypeId != '184450005') {
          this.IsAmendment = true;
          this.projectService.setSession('IsAmendment', this.IsAmendment);
        }
         this.router.navigate(['/opportunity/opportunityview']);
      }, err => {

      });
     
    }

    //order page navigation by saurav end
    //opportunity navigation code start
    if (this.route.snapshot.params.module == 3) {
      //this.projectService.setSession("opportunityId",'700b0999-a196-ea11-a84a-000d3aa058cb');
      //this.projectService.setSession("opportunityId",'1191f882-6585-ea11-a849-000d3aa058cb');
      this.projectService.setSession("opportunityId", this.route.snapshot.params.sysid)
      let oppId = this.route.snapshot.params.sysid;
      this.projectService.accessModifyApi('', localStorage.getItem('userEmail')).subscribe(res => {
        debugger;
        if (!res.IsError) {

          if (res.ResponseObject.FullAccess) {
            this.projectService.setSession('roleObj', res.ResponseObject);
            this.projectService.setSession('IsPreSaleAndRole', res.ResponseObject.UserRoles ? res.ResponseObject.UserRoles.IsPreSaleAndRole : false)
            this.projectService.setSession('IsGainAccess', res.ResponseObject.IsGainAccess ? res.ResponseObject.IsGainAccess : false)
            this.projectService.setSession('FullAccess', res.ResponseObject.FullAccess ? res.ResponseObject.FullAccess : false);
            this.projectService.clearSession("smartsearchData");
            this.projectService.setSession('orderId', '');
            this.projectService.setSession('IsAmendment', false);
            this.projectService.setSession('BFMNavagationFlag', false);
            //this.projectService.setSession('opportunityName',res.ResponseObject.OpportunityName? res.ResponseObject.OpportunityName:'')
            this.projectService.setSession('AdvisorOwnerId', '');
            this.projectService.setSession('opportunityId', oppId);
            //this.projectService.setSession('IsAppirioFlag',res.ResponseObject.IsAppirioFlag);
            this.DaAPi();
            this.router.navigate(['/opportunity/opportunityview/overview']);
          }
          else {
            this.projectService.setSession('roleObj', res.ResponseObject);
            this.projectService.setSession('AdvisorOwnerId', '')
            this.projectService.setSession('IsPreSaleAndRole', res.ResponseObject.UserRoles ? res.ResponseObject.UserRoles.IsPreSaleAndRole : false)
            this.projectService.setSession('IsGainAccess', res.ResponseObject.IsGainAccess ? res.ResponseObject.IsGainAccess : false)
            this.projectService.setSession('FullAccess', res.ResponseObject.FullAccess ? res.ResponseObject.FullAccess : false);
            this.projectService.setSession('opportunityId', oppId);
            //this.projectService.setSession('opportunityName',res.ResponseObject.OpportunityName?res.ResponseObject.OpportunityName :'')
            this.projectService.clearSession("smartsearchData");
            this.projectService.setSession('orderId', '');
            this.projectService.setSession('IsAmendment', false);
            this.projectService.setSession('BFMNavagationFlag', false);
            this.projectService.setSession('accessData', res.ResponseObject);
            //this.projectService.setSession('IsAppirioFlag',res.ResponseObject.IsAppirioFlag);
            this.DaAPi()
            this.router.navigate(['/opportunity/opportunityview/overview']);
          }
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }
      }
        ,
        err => {

          this.projectService.displayerror(err.status);
        }
      );
      //this.router.navigate(['opportunity/opportunityview/overview'])
    }
    //opportunity navigation code end
    if (this.route.snapshot.params.module == 5) {
      sessionStorage.setItem('ActivityListRowId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.route.snapshot.params.sysid, 'DecryptionDecrip')));
      this.router.navigate(['/activities/detailsList'])
    }
    if (this.route.snapshot.params.module == 6) {
      sessionStorage.setItem('RequestCampaign', JSON.stringify({
        Id: this.route.snapshot.params.sysid,
        isAccountPopulate: false,
        isCompletedCampaign: false,
        isCampaignEdit: true
      }
      ));
      this.router.navigate(['/campaign/RequestCampaign'])
    } if (this.route.snapshot.params.module == 7) {
      localStorage.setItem('contactEditId', JSON.stringify(this.route.snapshot.params.sysid));
      this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild'])
    } else if (this.route.snapshot.params.module == 1) {
      //accountSysId
      // let obj = { 'route_from': '', 'Id':  this.accountSysId };
      // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

      let accountcontacts = { "Name": "", "SysGuid": this.route.snapshot.params.sysid, "isProspect": false }
      let temp = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
      localStorage.setItem("selAccountObj", temp);
      sessionStorage.setItem('selAccountObj', temp);
      // localStorage.setItem('accountSysId',this.route.snapshot.params.sysid);
      let accountSysId = this.encrDecrService.set(
        "EncryptionEncryptionEncryptionEn",
        this.route.snapshot.params.sysid,
        "DecryptionDecrip"
      );
      // this.accountlistService.setUrlParamsInStorage('acc_req', this.route.snapshot.params.sysid);

      this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': this.route.snapshot.params.sysid });
      localStorage.setItem('accountSysId', accountSysId);
      sessionStorage.setItem('accountSysId', accountSysId);
      this.router.navigate(['/accounts/accountdetails'])
    }
    else {
      console.log("else condition!!!!")
      console.log(this.encId)
    }

  }
  DaAPi() {
    this.projectService.DaAPi().subscribe(response => {
      if (!response.IsError) {

      }
      else {

      }
    }
      , err => {
      });
  }

}
