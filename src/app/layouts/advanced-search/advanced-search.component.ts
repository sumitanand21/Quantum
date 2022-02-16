import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { HomeService } from '@app/core/services/home.service';
import { MatSnackBar } from '@angular/material';
import { stat } from 'fs';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { AccountListService } from '@app/core/services/accountList.service';
import{ OpportunitiesService } from '@app/core/services/opportunities.service';
import { OrderService } from '@app/core/services';
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  recentResults: any;
  accountDetails: any;
  leadDetails: any;
  isLoading: boolean = false;
  activityDetails: any;
  campaignDetails: any;
  contactDetails: any;
  reportDetails: any;
  allcampaigns: any;
  allActivities: any;
  getFilteredData: any = [];
  getFilteredDataLength: any;
  IsActivityGroup: boolean = false;
  IsCampaign: boolean = false;
  IsLead: boolean = false;
  IsContact: boolean = false;
  IsAccounts: boolean = false;
  mainArray: any = [];
  totalresults: any = null;
  searchString: any = "";
  isSearch = false;

  helpLineRoleFlag: boolean= false;

  constructor(
    public OpportunitiesService:  OpportunitiesService,
    public OrderService: OrderService,
    public service: DataCommunicationService,
    public homeService: HomeService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    private encrDecrService: EncrDecrService,
    private newConversationService: newConversationService,
    public accountListService: AccountListService,
    private EncrDecr: EncrDecrService,

    public router: Router) {

    this.recentResults = [{
      name: "Ranjith Ravi",
      company: "Apple digital solution | Activities"
    }, {
      name: "Singtel",
      company: "Singtel procurement process | Leads"
    }, {
      name: "Akash Sharma",
      company: "Ranjith Ravi | Contacts"
    },

    {
      name: "Apple pvt.ltd",
      company: "Apple digital solution | Opportunities"
    }, {
      name: "Anubhav Jain",
      company: "Reimagine singtel procurement | Activities"
    }, {
      name: "Singtel",
      company: "Singtel procurement process | Leads"
    }];

  }

  ngOnInit() {
    // console.log("saved Data", this.service.GlobalSearchdata)
    this.getFilterCriteria(this.service.GlobalSearchdata);
    this.gainRoleApi().subscribe(resData => {
      if (!resData.IsError) {
        if (resData.ResponseObject.IsHelpRoleFullAccess) {
          this.helpLineRoleFlag = true;
        } else {
          this.helpLineRoleFlag = false;
        }
      }

    
    })
  }

  gainRoleApi() {
    
        return this.OpportunitiesService.roleApi();
    
      }

  // For Gettign the Filter Criteria

DaAPi(){
   this.OpportunitiesService.DaAPi().subscribe(response => {
      if( !response.IsError){
     
       }
    else{
    
    } }
    ,  err => {
  });
 }
  getFilterCriteria(globalData) {
    this.homeService.getFilterCriteria({}).subscribe(res => {
      if (res.IsError === false) {
        this.getFilteredData = res.ResponseObject;
        if (globalData != undefined && globalData != "" && globalData != null) {
          this.getFilteredData.map(x => {
            // console.log('Yeees', x)
            if (x.Value == globalData.Name) {
              x.checked = true;
            }
            else {
              x.checked = false;
            }
            let data = {
              "name": x.Value,
              "data": []
            }
            this.mainArray.push(data);
          })
          this.searchString = globalData.searchData;
          this.advanceSearch(globalData.searchData);
          this.getFilteredDataLength = res.ResponseObject.length
        } else {
          this.getFilteredData.map(x => {
            x.checked = true;
            let data = {
              "name": x.Value,
              "data": []
            }
            this.mainArray.push(data);
          })
          this.getFilteredDataLength = res.ResponseObject.length
          this.searchString =this.service.seachInputText?this.service.seachInputText:''
          this.advanceSearch(this.service.seachInputText)
        }
      } else {
        let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        let action
        this.matSnackBar.open(message, action, {
          duration: 2000
        })
      }
    })
  }


  // pizzaIng: any;
  // selectAll = false;

  updateCheck(e, val) {
    console.log('event-->', e)
    this.getFilteredData.map(x => x.checked = e.checked);
    this.advanceSearch(val);
  }
  advanceSearch(val) {
    console.log('----->', val);

    this.isLoading = true;
    if (val != '' && val != undefined) {
      var searchObj = {
        "SearchText": val,
        "IsActivityGroup": false,
        "IsCampaign": false,
        "IsLead": false,
        "IsContact": false,
        "IsAccount": false,
        "IsOpportunity":false,
        'IsOrder':false,
      }
      this.getFilteredData.filter(x => {
        if (x.checked == true) {
          if (x.Id == '1') {
            searchObj.IsActivityGroup = true
          }
          if (x.Id == '2') {
            searchObj.IsLead = true
          }
          if (x.Id == '3') {
            searchObj.IsCampaign = true
          }
          if (x.Id == '4') {
            searchObj.IsContact = true
          }
          if (x.Id == '5') {
            searchObj.IsAccount = true
          }
          if (x.Id == '6') {
            searchObj.IsOpportunity = true
          }
          if (x.Id == '7') {
            searchObj.IsOrder = true
          }
        }
      }
      );
      console.log('searchObj', searchObj);
      this.homeService.getAdvancedSearch(searchObj).subscribe(res => {
        this.isSearch = true;
        this.isLoading = false;
        if (res.IsError === false) {
          this.totalresults = null;
          console.log('advanced search res-->', res);
          let result = res.ResponseObject;
          // if(result.length>0){
          for (let index = 0; index < this.mainArray.length; index++) {
            this.mainArray[index].data = [];
            if (this.mainArray[index].name in result) {
              this.mainArray[index].data = result[this.mainArray[index].name]
            }
            this.totalresults = this.totalresults + this.mainArray[index].data.length;
          }
          // }
          // else{
          //   for (let index = 0; index < this.mainArray.length; index++) {
          //   this.mainArray[index].data = [];
          //   }
          // }

          console.log("main array", this.mainArray);
        } else {
         
       

          let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          let action
          this.matSnackBar.open(message, action, {
            duration: 2000
          })
        }
      }, error => {
        this.isLoading = false;
      })
    } else {
      this.isLoading = false;
      let message = "Please enter the search text"
      let action
      this.matSnackBar.open(message, action, {
        duration: 2000
      })
    }

  }
  getcheckedStat() {
    let stat = false;
    for (let index = 0; index < this.getFilteredData.length; index++) {
      if (this.getFilteredData[index].checked == false) {
        stat = false;
        break;
      } else {
        stat = true;
        continue;
      }
    }
    return stat;
  }
  Navigate(item, rec) {
    // console.log("Page name", item, rec);
    this.isLoading = true;
    switch (item.name) {
      case "Contacts":
        localStorage.setItem("singlecontactdetails", JSON.stringify(rec));
        localStorage.setItem("contactEditId", JSON.stringify(rec.Guid));
        this.isLoading = false;
        this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        return;
      case "Campaigns":
        if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
          let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
          sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...reqCamp, Id: rec['Id'], isAccountPopulate: false }));
        } else {
          sessionStorage.setItem('RequestCampaign', JSON.stringify({ Id: rec['Id'], isAccountPopulate: false }));
        }
        //sessionStorage.setItem('campaignId', JSON.stringify(rec.Id));
        rec.CampaignStatus == "Proposed" ? sessionStorage.setItem('tableName', JSON.stringify('campaigns')) : sessionStorage.setItem('tableName', JSON.stringify('completedcampaigns'));
        this.isLoading = false;
        this.router.navigateByUrl('/campaign/RequestCampaign');
        return;
      case "Activities":
        console.log("rec.Guid", rec)
        let id = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", rec.Guid, "DecryptionDecrip");
        sessionStorage.setItem("ActivityListRowId", JSON.stringify(id))
        sessionStorage.setItem('ActivityGroupName', rec.Name)
        this.newConversationService.setActivityGroupName(rec.Name)
        this.isLoading = false;
        this.router.navigateByUrl('/activities/detailsList')
        return;
      case "Leads":
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', rec.LeadGuid, 'DecryptionDecrip')));
        let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", JSON.stringify(rec.LeadGuid), "DecryptionDecrip");
        this.isLoading = false;
        this.router.navigate(['/leads/leadDetails'])
        return;
      case "Opportunities":
        this.getOpportunityDetails(rec);
        return;
        case "Orders":
        console.log("sauravres",rec)
        this.getOrderDetails(rec);
        return;
      case "Accounts":
        console.log('accounts', rec.SysGuid);
        sessionStorage.setItem('accountguid', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', rec.SysGuid, 'DecryptionDecrip')));
        //let accencId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", JSON.stringify(rec.SysGuid), "DecryptionDecrip");
        //this.isLoading = false;
        this.accountListService.setSession('routeParams', { 'route_from': '', 'Id': rec.SysGuid })
        // this.accountListService.setUrlParamsInStorage('', rec.SysGuid);
        this.router.navigate(['/accounts/accountdetails'])
        break;
      default:
        this.isLoading = false;
        break;
    }
  }

  //Session set for order overview
  getOrderDetails(rec){
    this.isLoading = true;
    console.log("respo",rec);
    this.OpportunitiesService.setSession('opportunityId', rec.OpportunityId ? rec.OpportunityId.toString() : '');
    this.OpportunitiesService.setSession('opportunityName', rec.OpportunityIdName ? rec.OpportunityIdName.toString() : '');
      
      this.OpportunitiesService.clearSession("smartsearchData");
      this.OpportunitiesService.setSession('IsAmendment', (rec.IsAmendment && rec.IsAmendment == true) ? rec.IsAmendment : false);
      this.OpportunitiesService.setSession('orderType', rec.OrderType ? rec.OrderType.toString() : '');
      this.OpportunitiesService.setSession('orderName', rec.OrderName ? rec.OrderName.toString() : '');
      this.OpportunitiesService.setSession('orderId', rec.SalesOrderId ? rec.SalesOrderId.toString() : '');
      this.OpportunitiesService.setSession('pricingID', rec.PricingTypeId ? rec.PricingTypeId.toString() : '');
      this.OpportunitiesService.setSession('BFMNavagationFlag', false);
      let UserGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
      if ((UserGuid == rec.OrderOwnerId) || (UserGuid == rec.AccountOwnerId) || (UserGuid == rec.VerticalSalesOwnerId)) {
        if ( this.helpLineRoleFlag == true )
        {
          this.OpportunitiesService.setSession('showAssign', true);
        }
      }
      else {
        this.OpportunitiesService.setSession('showAssign', false);
      }

      this.router.navigate(['/opportunity/opportunityview']);
      this.isLoading = false;
     }

  getOpportunityDetails(rec){
       this.isLoading = true;
          this.OpportunitiesService.setSession('statusCode',rec.StatusId?rec.StatusId:''); 
   this.OpportunitiesService.setSession('opportunityName', rec.OpportunityName?rec.OpportunityName:'' );  
   this.OpportunitiesService.setSession('WiproIsAutoClose',rec.WiproIsAutoClose?rec.WiproIsAutoClose:'' );
   this.OpportunitiesService.setSession('opportunityId',rec.OpportunityId?rec.OpportunityId:'' ) 
   this.OpportunitiesService.setSession('FullAccess',rec.IsFullAccess?rec.IsFullAccess:false);
   this.OpportunitiesService.setSession('opportunityStatus', rec.StatusId?rec.StatusId:''); 
   this.OpportunitiesService.setSession('AdvisorOwnerId',rec.AdvisorOwnerId?rec.AdvisorOwnerId:'')
   this.OpportunitiesService.setSession('IsStaffingInitiated',!rec.StaffingDetails?false:rec.StaffingDetails.IsStaffingInitiated?rec.StaffingDetails.IsStaffingInitiated:false) 
   this.OpportunitiesService.setSession('IsOppOwner',rec.IsOppOwner?rec.IsOppOwner:false)
   

   this.OpportunitiesService.setSession('SuspendCount',true)
    this.OpportunitiesService.setSession('IsOAR',true)
    this.OpportunitiesService.setSession('SuspendedDuration',true)
   if(rec.SuspendCount>1 ){
    this.OpportunitiesService.setSession('SuspendCount',false)
  }

    else  if(rec.IsOAR ){
     this.OpportunitiesService.setSession('IsOAR',false)
   }

    else  if(rec.SuspendedDuration> 180 ){
       this.OpportunitiesService.setSession('SuspendedDuration',false)
   }
     this.OpportunitiesService.roleApi().subscribe(response => {
      if( !response.IsError){
         this.OpportunitiesService.setSession( 'IsGainAccessRole', response.ResponseObject.IsGainAccessRole?response.ResponseObject.IsGainAccessRole:false)
         this.OpportunitiesService.setSession( 'IsMarketingFunctionAndRole', response.ResponseObject.IsMarketingFunctionAndRole?response.ResponseObject.IsMarketingFunctionAndRole:false)
         this.OpportunitiesService.setSession( 'IsHelpRoleFullAccess', response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false)
       

        
       if( !this.OpportunitiesService.getSession('FullAccess')){
         this.getRoleAPi(rec)
       }
       else{
    this.OpportunitiesService.clearSession("smartsearchData");
    this.OpportunitiesService.setSession('orderId','');
   this.OpportunitiesService.setSession('IsAmendment', false);
   this.OpportunitiesService.setSession('BFMNavagationFlag',false);
        this.DaAPi()
         this.router.navigate(['/opportunity/opportunityview']);
       }
      }
  else{
     this.OpportunitiesService.displayMessageerror(response.Message);
  } 
 }
    ,
       err => {
            this.isLoading = false;
    this.OpportunitiesService.displayerror(err.status);
  }
  );
  }
 

  getTcv(data) {
     if(data.EstimatedTCV){
    return unescape(JSON.parse('"' + data.EstimatedTCV + '"')).replace(/\+/g, ' ');
     }
     else{
       return "-"
     }

  }

  


 getOpportunityNumber(rec){
  if(rec.OpportunityNumber){
   return  rec.OpportunityNumber?rec.OpportunityNumber:'-'
  }
  
  else{
  return "-"
  }
}

getAccount(rec){
if(rec.Account){
 return  rec.Account?rec.Account.Name:'-'
}

else{
return "-"
}

}

getRoleAPi(rec){
  
     this.OpportunitiesService.accessModifyApi(rec.AdvisorOwnerId,localStorage.getItem('userEmail')).subscribe(res => {
      if( !res.IsError){
        
       this.OpportunitiesService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
       this.OpportunitiesService.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
       this.OpportunitiesService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
       this.OpportunitiesService.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
       this.OpportunitiesService.setSession('accessData',res.ResponseObject);
       this.OpportunitiesService.setSession('roleObj',res.ResponseObject); 

       this.OpportunitiesService.clearSession("smartsearchData");
   this.OpportunitiesService.setSession('orderId','');
   this.OpportunitiesService.setSession('IsAmendment', false);
   this.OpportunitiesService.setSession('BFMNavagationFlag',false);
      this.DaAPi()
      this.router.navigate(['/opportunity/opportunityview']); 
      }
  else{
     this.OpportunitiesService.displayMessageerror(res.Message);
  } 
 }
    ,
       err => {
            this.isLoading = false;
    this.OpportunitiesService.displayerror(err.status);
  }
  );
 
}
}
