  



import { Component, OnInit,Output, EventEmitter, Inject, Input } from '@angular/core';
import { suspendheader,suspendAccountheader, terminatedAccountheader,terminatedheader, allopportunitiesOwnerList,allopportunitiesOwnerAccountList, wonAccountHeader,allopportunitiesAccountListheader,overdueTabAccountheader,allopportunityAccountheader, OpportunitiesService, allopportunityService, DataCommunicationService,allopportunityheader,overdueTabheader,allopportunitiesListheader,wonHeader,OrderService } from '@app/core';
import { AccountListService } from '@app/core/services/accountList.service';

import { Observable, of , forkJoin} from 'rxjs';
import { Router } from '@angular/router';
import { ReactivateopprtuntyComponent } from '@app/shared/components/single-table/sprint4Modal/reactivateopprtunty/reactivateopprtunty.component';
import { assignpopComponent } from '@app/shared/modals/assign-popup/assign-popup.component';
import { suspendedpopComponent } from '@app/shared/modals/suspend-popup/suspend-popup.component';
import { DatePipe } from "@angular/common";
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
// import { EncrDecrService } from '@app/core/services/encr-decr.service';
declare let FileTransfer: any;
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { SharePopupComponent } from '../all-opportunities/share-popup/share-popup.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-all-opportunities',
  templateUrl: './all-opportunities.component.html',
  styleUrls: ['./all-opportunities.component.scss']
})
export class AllOpportunitiesComponent implements OnInit {
  


  tableTotalCount: number = 0;

 datePipe1 = new DatePipe("en-US");
 IsActionFixed=true
 IsFreezedColumn=true
 tableName = "allopportunitiesList"
  // custom-tab-dropdown start
@Input() IsTabList:string;
@Output() selectedValue = new EventEmitter<any>();
@Input() TabValueSelected;
isLoading =false;
AllContactsRequestbody = {
    "PageSize": this.OpportunitiesService.sendPageSize || 10,
    "RequestedPageNumber": this.OpportunitiesService.sendPageNumber || 1,
    "OdatanextLink": "",
    // "FilterData": this.OpportunitiesService.sendConfigData || []
  }

paginationPageNo = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": ""
}



 


constructor(   public accountListService: AccountListService, private EncrDecr: EncrDecrService,public OrderService: OrderService,  private OpportunitiesService: OpportunitiesService, public dialog:MatDialog, private allopportunities: allopportunityService, private router: Router,public service: DataCommunicationService, public envr : EnvService,public daService: DigitalAssistantService) { }
AllOpportunityTableTab = [];
statusCode:any= 2;
allBtnLabel=['assignBtnVisibility','shareBtnVisibility']
searchText = ""


tabList:any = [
  {
    GroupLabel: '   ',
    GroupData: [
    ]
  }
]

dropDownData=[]

DaAPi(){
   this.OpportunitiesService.DaAPi().subscribe(response => {
      if( !response.IsError){
     
       }
    else{
    
    } }
    ,  err => {
  });
 }
listingApi(){
console.log( this.router.url,'routerurl'  )  ;
this.statusCode = localStorage.getItem('searchText')?localStorage.getItem('searchText'):this.statusCode
  console.log(  'formated',this.OpportunitiesService.getSession('ab')  );
   this.isLoading = true
 this.OpportunitiesService.opportunityStatusViewData().subscribe(res=>{
   
 if( !res.IsError){
    if (res.ResponseObject  ){
      this.dropDownData = res.ResponseObject.statusLists
   res.ResponseObject.statusLists.map ((it)=>{
    {      this.tabList[0].GroupData.push( {SysGuid:it.SysGuid, id:it.attributevalue ,title :it.Value, PinId:it.PinId, isPinned:it.IsPinned  })
     }
     return it;
   })

      var defaultView = this.tabList[0].GroupData.filter( (it)=> it.isPinned == true )
      defaultView.length==0?this.tabList[0].GroupData[1].isPinned=true:this.tabList[0].GroupData

   var selectedView = this.tabList[0].GroupData.filter( (it)=> it.isPinned ==true )
   this.statusCode =selectedView.length>0?selectedView[0].id:this.statusCode
  this.statusCode = localStorage.getItem('searchText')?localStorage.getItem('searchText'):this.statusCode
  this.statusCode = sessionStorage.getItem('searchText')?sessionStorage.getItem('searchText'):this.statusCode
  localStorage.removeItem('searchText');
  sessionStorage.removeItem('searchText')

  if(sessionStorage.getItem('pinStatusFlag')){
    this.statusCode = sessionStorage.getItem('pinStatus')?sessionStorage.getItem('pinStatus'):1
    sessionStorage.removeItem('pinStatusFlag')
  }
   this.statusData()

     this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
     }
  else{}
 }
   else{ 
      this.OpportunitiesService.displayMessageerror(res.Message);   
   }
 }  ,
     err => {
         this.isLoading = false
   this.OpportunitiesService.displayerror(err.status);
  }
  )


 
}

IsPreSaleAndRole=false;
IsHelpRoleFullAccess=false;
exportFlag= false
gainRoleApi(){

       this.isLoading = true;
     this.OpportunitiesService.roleApi().subscribe(response => {
       
      if( !response.IsError){
        this.exportFlag = response.ResponseObject.IsExportExcel?true:false
        this.OpportunitiesService.setSession('userobjj',response)
         this.OpportunitiesService.setSession( 'IsGainAccessRole', response.ResponseObject.IsGainAccessRole?response.ResponseObject.IsGainAccessRole:false)
         this.OpportunitiesService.setSession( 'IsMarketingFunctionAndRole', response.ResponseObject.IsMarketingFunctionAndRole?response.ResponseObject.IsMarketingFunctionAndRole:false)
         this.OpportunitiesService.setSession( 'IsHelpRoleFullAccess', response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false)
         this.OpportunitiesService.setSession( 'IsHelpDesk', response.ResponseObject.IsHelpDesk?response.ResponseObject.IsHelpDesk:false)
         this.IsPreSaleAndRole = response.ResponseObject.IsPreSaleAndRole?response.ResponseObject.IsPreSaleAndRole:false
        //  this.IsHelpRoleFullAccess= true
         this.IsHelpRoleFullAccess = response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false
         this.OpportunitiesService.userDataa()
         this.listingApi()
    
    
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

ngOnInit() {

this.gainRoleApi()
// this.daService.iframePage = 'OPPORTUNITY_LIST';
// let bodyDA = {
//   page: 'OPPORTUNITY_LIST',
//   userGuid: this.EncrDecr.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
// };
// // this.daService.postMessageData = bodyDA;
// // this.daService.postMessage(bodyDA);
}
fullAccessFlag;

    getTcv(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }

getListData(){
 return {
    
    "IsOverDue":     "true"
}
}


getSymbol(data) {
  data = this.escapeSpecialChars(data);
  return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
}

escapeSpecialChars(jsonString) {
  return jsonString.replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");

}

getOpportunityLandingData(statusCode,paginationPageNo,searchText){
  debugger;
var AccountGuid = undefined
  if(this.router.url.includes('/opportunity/allopportunity')){
   localStorage.setItem('accountRoute','2')
   AccountGuid = undefined
   this.OpportunitiesService.setSession('accountGuidDownload', "");
  }
  else{
    AccountGuid =  (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    localStorage.setItem('accountRoute','1')
    console.log('AccountGuid',AccountGuid)
    this.OpportunitiesService.setSession('accountGuidDownload', AccountGuid);
  }


var statusListCode=undefined;
var IsOverDue=undefined;
var UserGuid =undefined;
var myOwned = undefined
var helpRole = this.IsHelpRoleFullAccess
  if(statusCode==1){ 
   statusListCode= undefined;
  
    this.tableCollection(["allopportunitiesList",'allopportunitiesAccountList'])
  }
  else if(statusCode==2){ 
   statusListCode= undefined;
   myOwned = true
   
    this.tableCollection(["allopportunitiesOwnerList",'allopportunitiesOwnerAccountList'])
    
  }
  else if(statusCode==3){ 
    myOwned = true
    statusListCode= '1';
     this.tableName = ""
    this.tableCollection(["allopportunitiesTab",'allopportunitiesAccountTab'])
     
  }
 else if(statusCode==4){
   statusListCode=1;
    
    this.tableCollection(["allopportunitiesTab",'allopportunitiesAccountTab'])
    
  }
 else if(statusCode==5){ 
   statusListCode= '5';
   
    this.tableCollection(["terminatedheader",'terminatedAccountheader'])
    
  }
 else if(statusCode==6){ 
   statusListCode= '3';
   
    this.tableCollection(["wonTab",'wonAccountTab'])
    
  }
 else if(statusCode==7){ 
   statusListCode= '184450000';
   
    this.tableCollection(["terminatedheader",'terminatedAccountheader'])
     
  }
 else if(statusCode==8){ 
   statusListCode= '2';
  
    this.tableCollection(["suspendheader",'suspendAccountheader'])
   
  }
 else if(statusCode==9){ 
   statusListCode= undefined;
    IsOverDue ="true"
     
    this.tableCollection(["overdueTab",'overdueAccountTab'])
      
  }
    this.isLoading = true
   this.OpportunitiesService.setSession('newOpportunity',false);
  
      

  let OpportunityBodyObj = {  
     "MyOwned": myOwned,
     'UserGuid': this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') ,
    "Statuscode": statusListCode,
        "IsOverDue":IsOverDue,
        "AccountGuid":AccountGuid,
        'ContactGUID':JSON.parse(localStorage.getItem("contactEditId"))?JSON.parse(localStorage.getItem("contactEditId")):undefined,
        IsPreSaleAndRole:this.IsPreSaleAndRole,
    "PageSize": paginationPageNo.PageSize.toString(),"RequestedPageNumber": paginationPageNo.RequestedPageNumber.toString(),"SearchText": searchText}
 
    let getAllOpportunitiesLanding =this.allopportunities.getAllOpportunitiesLanding(OpportunityBodyObj)
    let getListCount = this.allopportunities.getListCount(OpportunityBodyObj);
    forkJoin([getAllOpportunitiesLanding,getListCount]).subscribe(response => {
 
    // this.allopportunities.getAllOpportunitiesLanding(OpportunityBodyObj).subscribe(res=>{
this.isLoading=false 

  // if( !res.IsError){
    if (response && response[0] && response[1] && !response[0].IsError && !response[1].IsError ) {
      var res = response[0]

    if (res.ResponseObject && (Array.isArray(res.ResponseObject)?res.ResponseObject.length>0:false) ){
    
   console.log("asd",this.paginationPageNo);
  //  this.tableTotalCount = res.TotalRecordCount;
  this.tableTotalCount = response[1].ResponseObject;

   console.log("orginalArray12",res);
 
 const startIndex = ((paginationPageNo.RequestedPageNumber - 1) * paginationPageNo.PageSize) + 1;
   
 var estDate =[]
 var hardDate=[]
 var ActuDate =[]
 for(var i=0; i< res.ResponseObject.length;i++){
  
  estDate[i]= res.ResponseObject[i].EstimatedCloseDate?this.getFormatDate(res.ResponseObject[i].EstimatedCloseDate):"NA"
  hardDate[i]=  res.ResponseObject[i].HardClosedDate?this.getFormatDate(res.ResponseObject[i].HardClosedDate):"NA"
  ActuDate[i]=res.ResponseObject[i].ActualClosedDate? this.getFormatDate(res.ResponseObject[i].ActualClosedDate):'NA'
   }
console.log(estDate,hardDate,ActuDate,'estactualhar')
   var tableCollection= res.ResponseObject.map(function(addColumn,index) {
    
    
  
     let newColumn = Object.assign({"OpportunityName":addColumn.OpportunityName?( addColumn.OpportunityName ) :"NA",
    "ID":addColumn.OpportunityNumber ? addColumn.OpportunityNumber:"NA",
     "Type": !(addColumn.OpportunityType)?"NA":addColumn.OpportunityType.Value?addColumn.OpportunityType.Value:'NA',
     "Account": !(addColumn.Account)?"NA":addColumn.Account.Name?addColumn.Account.Name:'NA',
       "AccountId": !(addColumn.Account)?"NA":addColumn.Account.AccountId?addColumn.Account.AccountId:'NA',
    'AccountTypeId':addColumn.AccountTypeId?addColumn.AccountTypeId:"",
     "Owner":addColumn.OpportunityOwnerName?addColumn.OpportunityOwnerName:"NA",
     "Stage":addColumn.Stage?addColumn.Stage:"NA",
   "StageId":addColumn.StageId?addColumn.StageId:"",
  
     "Estclosuredate":estDate[index],
     "Vertical": !(addColumn.Vertical) ?"NA": addColumn.Vertical.Name? addColumn.Vertical.Name:'NA',
     "Currency":addColumn.TransactionCurrencyValue ? addColumn.TransactionCurrencyValue:"NA",
     "ProposalType":addColumn.ProposalTypeName?addColumn.ProposalTypeName:"NA",
     "Status":addColumn.StatusName ? addColumn.StatusName:"NA",
      "OpportunityId":addColumn.OpportunityId?addColumn.OpportunityId:"",
     "OpportunityOwnerId":addColumn.OpportunityOwnerId?addColumn.OpportunityOwnerId:'',
     "AccountOwnerId" :addColumn.Account.OwnerId?addColumn.Account.OwnerId:'',
     "ServiceLineCount":addColumn.ServiceLineCount,
     "SuspendedDuration":addColumn.SuspendedDuration,
       "SuspendCount":addColumn.SuspendCount,
       "IsOAR":addColumn.IsOAR,
      "IsFullAccess"  :addColumn.IsFullAccess,
      "IsOppOwner" : addColumn.IsOppOwner?addColumn.IsOppOwner:'',
          'staffingDetails': !addColumn.StaffingDetails?false:addColumn.StaffingDetails.IsStaffingInitiated?addColumn.StaffingDetails.IsStaffingInitiated:false,
     "SuspendStartDate":addColumn.SuspendStartDate?addColumn.SuspendStartDate:"",
    "NextReviewDate":addColumn.NextReviewDate?addColumn.NextReviewDate:"",
     "SbuId":addColumn.SbuId?addColumn.SbuId:'',
     'WiproIsAutoClose':addColumn.WiproIsAutoClose,
     "index":startIndex + index,
     'AdvisorOwnerId': addColumn.AdvisorOwnerId?addColumn.AdvisorOwnerId:'',
    "VerticalSalesOwner":addColumn.VerticalSalesOwner?addColumn.VerticalSalesOwner:'', 
      "PrimaryAccountOwnerId":addColumn.PrimaryAccountOwnerId?addColumn.PrimaryAccountOwnerId:'',
      'StatusId':addColumn.StatusId || addColumn.StatusId===0 || addColumn.StatusId==='0'?addColumn.StatusId:'',
      'statusReason': addColumn.StateCode?addColumn.StateCode:'-', 
      'manualProb':addColumn.ManualProbability?addColumn.ManualProbability:'-',
      'isHardClose':addColumn.HardClosed?addColumn.HardClosed:'-' ,
      'geoId':addColumn.GeographyName?addColumn.GeographyName:'-',
      // 'geoId':addColumn.GeographyId?addColumn..GeographyId:'-',
      // 'actualRev':'-',
          EstimatedTCV:addColumn.EstimatedTCV,
   ActualRevenue:addColumn.ActualRevenue,
   
      'hardCloseDate':addColumn.HardClosedDate && (addColumn.HardClosed?addColumn.HardClosed.toUpperCase()=='YES':false)? hardDate[index] :'NA',
  
      'actualCloseDate':ActuDate[index] ,
      oppForecast:addColumn.Forecast?addColumn.Forecast:'-',
      'IsAppirioFlag': addColumn.IsAppirioFlag?addColumn.IsAppirioFlag:false,
      'RequestedReopen':addColumn.RequestedReopen?addColumn.RequestedReopen:false,
      





             
   });

   if( addColumn.StatusId == 1){
    newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = false;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = false;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "proposed";
    newColumn.reactivateBtnVisibility =true
    
  

   }
   else if(addColumn.StatusId == 3){
     newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
     newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "approved";
    newColumn.reactivateBtnVisibility =true

  
   }else if(addColumn.StatusId == 2){
    newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
     newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "low";
    newColumn.reactivateBtnVisibility =false
   
   }else if(addColumn.StatusId == 184450000){
    newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "rejected";
    newColumn.reactivateBtnVisibility =true
    if(  addColumn.WiproIsAutoClose ){
    newColumn.reopenOpportunityBtnVisibility = false;      
    }
  
  
   
   }else{
     newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    // newColumn.shareBtnVisibility = true;
   newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "rejected";
   newColumn.reactivateBtnVisibility =true
  
   if(  addColumn.StatusId == 5 && addColumn.WiproIsAutoClose  ){
    newColumn.reopenOpportunityBtnVisibility = false;     
   }
     

   }


   if( !newColumn.helpRoleAccess && !addColumn.IsFullAccess &&  addColumn.IsPartialAccess  ){
         if( addColumn.StatusId == 1 ){
          newColumn.estimatedateBtnVisibility = false;
         }
         else{
          newColumn.estimatedateBtnVisibility = true;
         }
         
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = true;
    newColumn.reactivateBtnVisibility =true
    
   }

   else if( !newColumn.helpRoleAccess && !addColumn.IsFullAccess &&  !addColumn.IsPartialAccess){
             newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = true;
    newColumn.reactivateBtnVisibility =true
     }
  

     return newColumn;
   });
    if(paginationPageNo.RequestedPageNumber == 1){
        this.AllOpportunityTableTab = []
       this.AllOpportunityTableTab = tableCollection
     }
     else{
      this.AllOpportunityTableTab = this.AllOpportunityTableTab.concat(tableCollection)  
     
     }
    
     for(let i=(startIndex-1) ; i<this.AllOpportunityTableTab.length  ; i++){
console.log (this.AllOpportunityTableTab[i].EstimatedTCV,'tcvtcvtcv')
  var tcv = this.getTcv(  this.AllOpportunityTableTab[i].EstimatedTCV)
  var acv = this.getTcv( this.AllOpportunityTableTab[i].ActualRevenue)
  var oppName =  this.AllOpportunityTableTab[i].OpportunityName?this.getTcv(this.AllOpportunityTableTab[i].OpportunityName):'NA'
 this.AllOpportunityTableTab[i].EstTCV =  tcv  || tcv==='0' ?tcv:'NA'
  this.AllOpportunityTableTab[i].actualRev =  acv  || acv==='0' ?acv:'NA'
  this.AllOpportunityTableTab[i].OpportunityName = oppName ? oppName :'NA'
  } 


     this.IsActionFixed= true
      this.IsFreezedColumn= true
       var count=0;
    
   
     for(let j=(startIndex-1) ; j<  this.AllOpportunityTableTab.length   ; j++){
   
    if(this.AllOpportunityTableTab[j].IsAppirioFlag){
     this.AllOpportunityTableTab[j].estimatedateBtnVisibility =true
    this.AllOpportunityTableTab[j].assignBtnVisibility=true
    this.AllOpportunityTableTab[j].supendBtnVisibility=true
    this.AllOpportunityTableTab[j].reopenOpportunityBtnVisibility =true
    this.AllOpportunityTableTab[j].shareBtnVisibility =true
    this.AllOpportunityTableTab[j].reactivateBtnVisibility=true 
    }
  

   }

   for(let j=(startIndex-1) ; j< this.AllOpportunityTableTab.length  ; j++){

    if(this.AllOpportunityTableTab[j].estimatedateBtnVisibility &&
    this.AllOpportunityTableTab[j].assignBtnVisibility&&
    this.AllOpportunityTableTab[j].supendBtnVisibility&&
    this.AllOpportunityTableTab[j].reopenOpportunityBtnVisibility &&
    this.AllOpportunityTableTab[j].shareBtnVisibility &&
    this.AllOpportunityTableTab[j].reactivateBtnVisibility  ){
     
      count++
      this.AllOpportunityTableTab[j].actionButton =false;
    }
    else{
      this.AllOpportunityTableTab[j].actionButton =true;
    }
    if(count==tableCollection.length){
      this.IsActionFixed= false
      this.IsFreezedColumn= false
    }
  

   }


}

else{
this.AllOpportunityTableTab=[{}] 
 this.tableTotalCount = 0;
}
  }
else{
  if( response[0].IsError){
    this.OpportunitiesService.displayMessageerror(response[0].Message);   

  }
  else{
    this.OpportunitiesService.displayMessageerror(response[1].Message);   
  }
 
  // this.OpportunitiesService.displayMessageerror("Oops! There seems to be some technical snag! Could you raise a Helpline ticket? ");   

  // this.OpportunitiesService.displayMessageerror(res.Message);   
 this.AllOpportunityTableTab=[] 
  this.tableTotalCount = 0;
}
this.isLoading=false  


},
err=>{
    this.isLoading = false
  this.tableTotalCount = 0;
  this.AllOpportunityTableTab = [];
   this.OpportunitiesService.displayerror(err.status);
});



}


isLoaderNav = false;

accountNav(childActionRecieved){
       const accountcontacts = {
          'Name': childActionRecieved.objectRowData[0].Account,
          'SysGuid': childActionRecieved.objectRowData[0].AccountId,
          'isProspect': false,
          'accType': childActionRecieved.objectRowData[0].AccountTypeId
        };

  const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
        localStorage.setItem('accType', childActionRecieved.objectRowData[0].AccountTypeId);
        localStorage.setItem('selAccountObj', temp);
        sessionStorage.setItem('selAccountObj', temp);
        this.service.setSideBarData('1');
        this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': childActionRecieved.objectRowData[0].AccountId });
        this.isLoaderNav = true;
        this.router.navigate(['/accounts/accountdetails']);
        return;

      

 
}

getNewTableData(event) {
  debugger;
  console.log("event",event);
  if (event.action == 'pagination') {
    this.paginationPageNo.PageSize = event.itemsPerPage;
    this.paginationPageNo.RequestedPageNumber = event.currentPage;
       this.AllContactsRequestbody = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber":  event.currentPage,
      "OdatanextLink": ""
    };

 if (this.service.checkFilterListApiCall(event)) {
        // filter api call
        this.CallListDataWithFilters(event);
      } else {
        // list api call
     this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
      }
   
  } else if (event.action == 'search') {
    this.paginationPageNo = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    };
  }

}

emitSelected(e){
  this.selectedValue.emit(e);
}

suspendPopup(actionRequired){
    if(actionRequired.objectRowData[0].StageId.toString()=='184450004'){
 this.OpportunitiesService.displayMessageerror("You can't suspend opportunity in close stage")
  }
  else{
   this.OpportunitiesService.setSession('SuspendCount',true)
    this.OpportunitiesService.setSession('IsOAR',true)
    this.OpportunitiesService.setSession('SuspendedDuration',true)
     if(actionRequired.objectRowData[0].staffingDetails ){
   this.OpportunitiesService.displayMessageerror("This Opportunity can't be suspended as staffing is initiated already");
    }

  else if(actionRequired.objectRowData[0].SuspendCount>1 ){
   this.OpportunitiesService.displayMessageerror("It can't be done more than twice");
    this.OpportunitiesService.setSession('SuspendCount',false)
  }

  
    else  if(actionRequired.objectRowData[0].IsOAR ){
     this.OpportunitiesService.setSession('IsOAR',false)
     this.OpportunitiesService.displayMessageerror(	"Suspend can’t happen if staffing has been initiated or if it is in OAR")
   }


else{
    const dialogRef = this.dialog.open(suspendedpopComponent,
    {
        width: '396px',
              data: { data:actionRequired.objectRowData[0]  }

      });
  dialogRef.afterClosed().subscribe(result => {
    console.log("result",result )
if(result=='close' ){
       }

else if( result =='save'){
 
  this.callFilterAPI(actionRequired)
 
  }
 });
}
}}
estimatePopup(actionRequired){
 if(actionRequired.objectRowData[0].StageId.toString()=='184450004'){
 this.OpportunitiesService.displayMessageerror("You can't modify estimate closure date in close stage")
  }
  else{
   const dialogRef = this.dialog.open(modifypopComponent,
      {
        width: '450px',
          data: { data:actionRequired.objectRowData[0]}
      });
        dialogRef.afterClosed().subscribe(result => {
      
   if(result=='close' ){
  }          
  else if(result == 'save'){     
       
    this.callFilterAPI(actionRequired)
        }
   });
}
}
assignOpportunity(actionRequired){
//    if(actionRequired.objectRowData[0].StageId.toString()=='184450004' && actionRequired.objectRowData[0].StatusId!= 3  ){
//  this.OpportunitiesService.displayMessageerror("You can't assign opportunity in close stage")
//   }
//  else{
     const dialogRef = this.dialog.open(assignpopComponent,
      {
        width: '396px',
       data: { data:    JSON.parse(JSON.stringify (actionRequired.objectRowData))  }
      });
        dialogRef.afterClosed().subscribe(result => {

          if(result=='close' ){

          }
      else if(result =='save')   {   
        this.callFilterAPI(actionRequired)
      
        }
     });
// }
}

callFilterAPI(data) {
    if (data.filterData.order.length > 0 ||  data.filterData.sortColumn ) {
      this.CallListDataWithFilters(data);
    }
    else {
       this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
    
    }
  }

reopenPopup(actionRequired){
  if(actionRequired.objectRowData[0].StageId.toString()=='184450004'){
 this.OpportunitiesService.displayMessageerror("You can't reopen opportunity in close stage")
  }
  else if( actionRequired.objectRowData[0].RequestedReopen){
    this.OpportunitiesService.displayMessageerror("Your reopen request is pending with helpdesk.")
  }
  else{
    const dialogRef = this.dialog.open(ReopenOpportunityPopComponent,
      {
        width: '396px',
         data: { data: actionRequired.objectRowData}
      });
         dialogRef.afterClosed().subscribe(result => {
           
  if(result=='close' ){
         }
           else if(result =='save'){
     this.callFilterAPI(actionRequired)
         }
     });
}
}
// custom-tab-dropdown ends
  getAllContactsList(reqBody, isConcat, isSearch, isLoader) {
     this.getOpportunityLandingData(this.statusCode,reqBody,this.searchText);
  }

  getFormatDate(str){
    var arr = str.split('-');
               var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
               var i = 0;
              var month=months.findIndex(x=>x==arr[1])+1
             var  monthss = month<=9?'0'+month:month
                  return  monthss + '/' + arr[0] + '/' + arr[2];
             
  }

  getTableFilterData(tableData, statusCode,start,pageNo,pageSize): Array<any> {
 var helpRole = this.IsHelpRoleFullAccess
    if (tableData) {
      console.log("contacts table data", tableData);
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);

           this.IsActionFixed= true
      this.IsFreezedColumn= true
       var count=0;

  //  for(let j=0; j<tableData.length;j++){
   
  //   if(!tableData[j].WiproIsAutoClose && (statusCode== 184450000 || statusCode==5 ) ){
     
  //     count++
  //   }
  //   if(count==tableData.length){
  //     this.IsActionFixed= false
  //     this.IsFreezedColumn= false
  //   }
  

  //  }

  var estDate=[]
  var hardDate=[]
  var ActuDate=[]
  for(var i=0; i< tableData.length;i++){
  
    estDate[i]= tableData[i].EstimatedCloseDate? this.getFormatDate(tableData[i].EstimatedCloseDate):"NA"
    hardDate[i]=  tableData[i].HardClosedDate? this.getFormatDate(tableData[i].HardClosedDate):"NA"
    ActuDate[i]=tableData[i].ActualClosedDate? this.getFormatDate(tableData[i].ActualClosedDate) :'NA'
     }
  

        var tableCollection = tableData.map(function(addColumn,index) {
    
    
     let newColumn = Object.assign({"OpportunityName":addColumn.OpportunityName?(addColumn.OpportunityName) :"NA",
    "ID":addColumn.OpportunityNumber ? addColumn.OpportunityNumber:"NA",
     "Type": !(addColumn.OpportunityType)?"NA":addColumn.OpportunityType.Value?addColumn.OpportunityType.Value:'NA',
     "Account": !(addColumn.Account)?"NA":addColumn.Account.Name?addColumn.Account.Name:'NA',
     "AccountId": !(addColumn.Account)?"NA":addColumn.Account.AccountId?addColumn.Account.AccountId:'NA',
    'AccountTypeId':addColumn.AccountTypeId?addColumn.AccountTypeId:"",
     
     "Owner":addColumn.OpportunityOwnerName?addColumn.OpportunityOwnerName:"NA",
     "Stage":addColumn.Stage?addColumn.Stage:"NA",
      "StageId":addColumn.StageId?addColumn.StageId:"",
      
     "Estclosuredate":estDate[index],
     "Vertical": !(addColumn.Vertical) ?"NA": addColumn.Vertical.Name? addColumn.Vertical.Name:'NA',
     "Currency":addColumn.TransactionCurrencyValue ? addColumn.TransactionCurrencyValue:"NA",
     "ProposalType":addColumn.ProposalTypeName?addColumn.ProposalTypeName:"NA",
     "Status":addColumn.StatusName ? addColumn.StatusName:"NA",
      "OpportunityId":addColumn.OpportunityId?addColumn.OpportunityId:"",
     "OpportunityOwnerId":addColumn.OpportunityOwnerId?addColumn.OpportunityOwnerId:'',
     "AccountOwnerId" :addColumn.Account.OwnerId,
     "ServiceLineCount":addColumn.ServiceLineCount,
     "SuspendedDuration":addColumn.SuspendedDuration,
       "SuspendCount":addColumn.SuspendCount,
        'staffingDetails': !addColumn.StaffingDetails?false:addColumn.StaffingDetails.IsStaffingInitiated?addColumn.StaffingDetails.IsStaffingInitiated:false,
       "IsOAR":addColumn.IsOAR,
      "IsFullAccess"  :addColumn.IsFullAccess,
      "IsOppOwner" : addColumn.IsOppOwner?addColumn.IsOppOwner:'',
  "SuspendStartDate":addColumn.SuspendStartDate?addColumn.SuspendStartDate:"",
    "NextReviewDate":addColumn.NextReviewDate?addColumn.NextReviewDate:"",
     "SbuId":addColumn.SbuId?addColumn.SbuId:'',
     'WiproIsAutoClose':addColumn.WiproIsAutoClose,
     "index":addColumn.index,
     'AdvisorOwnerId': addColumn.AdvisorOwnerId?addColumn.AdvisorOwnerId:'',
    "VerticalSalesOwner":addColumn.VerticalSalesOwner?addColumn.VerticalSalesOwner:'', 
      "PrimaryAccountOwnerId":addColumn.PrimaryAccountOwnerId?addColumn.PrimaryAccountOwnerId:'',
      'StatusId':addColumn.StatusId || addColumn.StatusId===0 || addColumn.StatusId==='0'?addColumn.StatusId:'',

       'statusReason': addColumn.StateCode?addColumn.StateCode:'-', 
      'manualProb':addColumn.ManualProbability?addColumn.ManualProbability:'-',
      'isHardClose':addColumn.HardClosed?addColumn.HardClosed:'-' ,
      'geoId':addColumn.GeographyName?addColumn.GeographyName:'-',
      // 'geoId':addColumn.GeographyId?addColumn..GeographyId:'-',
      // 'actualRev':'-',
    EstimatedTCV:addColumn.EstimatedTCV,
   ActualRevenue:addColumn.ActualRevenue,

   
       'hardCloseDate':addColumn.HardClosedDate && (addColumn.HardClosed?addColumn.HardClosed.toUpperCase()=='YES':false)?hardDate[index]:'NA',
    
      'actualCloseDate': ActuDate[index] ,
      oppForecast:addColumn.Forecast?addColumn.Forecast:'-',
      'IsAppirioFlag': addColumn.IsAppirioFlag?addColumn.IsAppirioFlag:false,
          'RequestedReopen':addColumn.RequestedReopen?addColumn.RequestedReopen:false,
     
    
   });

   if(addColumn.StatusId == 1){
   newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = false;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = false;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "proposed";
    newColumn.reactivateBtnVisibility =true
    
  

   }
   else if(addColumn.StatusId == 3){
     newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
     newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "approved";
    newColumn.reactivateBtnVisibility =true

  
   }else if( addColumn.StatusId == 2){
newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = false;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
     newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "low";
    newColumn.reactivateBtnVisibility =false
   
   }else if(addColumn.StatusId == 184450000){
 newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "rejected";
    newColumn.reactivateBtnVisibility =true
    if(  addColumn.WiproIsAutoClose ){
    newColumn.reopenOpportunityBtnVisibility = false;      
    }
  
  
   
   }else{
     newColumn.helpRoleAccess = helpRole
    newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
      newColumn.shareBtnVisibility = false;
    newColumn.statusclass = "rejected";
   newColumn.reactivateBtnVisibility =true
  
   if(  addColumn.StatusId == 5 && addColumn.WiproIsAutoClose  ){
      newColumn.reopenOpportunityBtnVisibility = false;     
   }
     

   }

     if(!newColumn.helpRoleAccess && !addColumn.IsFullAccess &&  addColumn.IsPartialAccess  ){
      if( addColumn.StatusId == 1 ){
        newColumn.estimatedateBtnVisibility = false;
       }
       else{
        newColumn.estimatedateBtnVisibility = true;
       }
        newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = true;
    newColumn.reactivateBtnVisibility =true
    
   }

   else if( !newColumn.helpRoleAccess  && !addColumn.IsFullAccess &&  !addColumn.IsPartialAccess){
             newColumn.estimatedateBtnVisibility = true;
    newColumn.assignBtnVisibility = true;
    newColumn.supendBtnVisibility = true;
    newColumn.reopenOpportunityBtnVisibility = true;
    newColumn.shareBtnVisibility = true;
    newColumn.reactivateBtnVisibility =true
     }



     return newColumn;
   });
     if(pageNo == 1){
        this.AllOpportunityTableTab = []
       this.AllOpportunityTableTab = tableCollection
     }
     else{
      this.AllOpportunityTableTab = this.AllOpportunityTableTab.concat(tableCollection)  
     
     }
    

  this.IsActionFixed= true
      this.IsFreezedColumn= true
       var count=0;
    
   
   for(let j=(start-1) ; j< this.AllOpportunityTableTab.length  ; j++){
   
    if(this.AllOpportunityTableTab[j].IsAppirioFlag){
     this.AllOpportunityTableTab[j].estimatedateBtnVisibility =true
    this.AllOpportunityTableTab[j].assignBtnVisibility=true
    this.AllOpportunityTableTab[j].supendBtnVisibility=true
    this.AllOpportunityTableTab[j].reopenOpportunityBtnVisibility =true
    this.AllOpportunityTableTab[j].shareBtnVisibility =true
    this.AllOpportunityTableTab[j].reactivateBtnVisibility=true 
    }
  

   }


   for(let j=(start-1) ; j< this.AllOpportunityTableTab.length  ; j++){

    if(this.AllOpportunityTableTab[j].estimatedateBtnVisibility &&
    this.AllOpportunityTableTab[j].assignBtnVisibility&&
    this.AllOpportunityTableTab[j].supendBtnVisibility&&
    this.AllOpportunityTableTab[j].reopenOpportunityBtnVisibility &&
    this.AllOpportunityTableTab[j].shareBtnVisibility &&
    this.AllOpportunityTableTab[j].reactivateBtnVisibility  ){
     
      count++
      this.AllOpportunityTableTab[j].actionButton =false;
    }
    else{
      this.AllOpportunityTableTab[j].actionButton =true;
    }
    if(count==tableCollection.length){
      this.IsActionFixed= false
      this.IsFreezedColumn= false
    }
  

   }

   for(let i=(start-1) ; i< this.AllOpportunityTableTab.length ; i++){
     
  var tcv = this.getTcv( this.AllOpportunityTableTab[i].EstimatedTCV)
   var acv = this.getTcv( this.AllOpportunityTableTab[i].ActualRevenue)
   var oppName =  this.AllOpportunityTableTab[i].OpportunityName?this.getTcv(this.AllOpportunityTableTab[i].OpportunityName):'NA'
  
 this.AllOpportunityTableTab[i].EstTCV =  tcv  || tcv==='0' ?tcv:'NA'
 this.AllOpportunityTableTab[i].actualRev =  acv  || acv==='0' ?acv:'NA'
 this.AllOpportunityTableTab[i].OpportunityName = oppName ? oppName :'NA'


  } 
  


      } else {
        return [{}]
      }
    } else {
      return [{}]
    }
console.log(this.paginationPageNo) 

 }



  tableCollection(tableName){ 
 if(this.router.url.includes('/opportunity/allopportunity')){
  this.tableName = tableName[0]
   }
  else{
   this.tableName = tableName[1] 
  }
 }


  GetAppliedFilterData(data) {
 var allHeader;
  if(this.router.url.includes('/opportunity/allopportunity')){
  if(  this.tableName == 'allopportunitiesTab'){
allHeader = allopportunityheader
  }
  if(  this.tableName == 'suspendheader'){
    allHeader = suspendheader
      }

  if(  this.tableName == 'terminatedheader'){
    allHeader = terminatedheader
      }
  if(  this.tableName == 'allopportunitiesOwnerList'){
    allHeader = allopportunitiesOwnerList
      }
  if(  this.tableName == 'overdueTab'){
allHeader = overdueTabheader
  }
    if(  this.tableName == 'allopportunitiesList'){
allHeader = allopportunitiesListheader
  }
    if(  this.tableName == 'wonTab'){
allHeader = wonHeader
  }
  }
   else{
if(  this.tableName == 'allopportunitiesAccountTab'){
allHeader = allopportunityAccountheader
  }
  if(  this.tableName == 'suspendAccountheader'){
    allHeader = suspendAccountheader
      }
  if(  this.tableName == 'terminatedAccountheader'){
    allHeader = terminatedAccountheader
      }
  if(  this.tableName == 'allopportunitiesOwnerAccountList'){
    allHeader = allopportunitiesOwnerAccountList
      }
  if(  this.tableName == 'overdueAccountTab'){
allHeader = overdueTabAccountheader
  }
    if(  this.tableName == 'allopportunitiesAccountList'){
allHeader = allopportunitiesAccountListheader
  }
    if(  this.tableName == 'wonAccountTab'){
allHeader = wonAccountHeader
  }


   }

   var AccountGuidd
   if(this.router.url.includes('/opportunity/allopportunity')){
     AccountGuidd = undefined
    }
    else{
     AccountGuidd =  (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    }
   
   
    return {
      "AccountGuid": AccountGuidd,
 
    "UserGuid":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
    "PageSize": this.AllContactsRequestbody.PageSize,
     "RequestedPageNumber": this.AllContactsRequestbody.RequestedPageNumber,
     "SearchText": this.searchText ,
      "IsDesc":(data.filterData.sortColumn!='')?!data.filterData.sortOrder:false,
      "SortBy": this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]? this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[],
   
      // "SortBy": this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0] || this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]==='0' || this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0] === 0 ? this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[],
      "OpportunityNames": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
      "OpportunityIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ID'], 'name'),
      "OpportunityType": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
          "AccountIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Account'], 'name'),
      "OwnerIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Owner'], 'name'),
      "PipelineStages": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Stage'], 'id'),
    
      "VerticalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'name'),
      "TCVValues": [],
     
          "CurrencyIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Currency'], 'name'),
      "ProposalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ProposalType'], 'id'),
       "StartFromDate": this.startFilterDate?(this.datePipe1.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe1.transform(this.endFilterDate, "yyyy-MM-dd")):undefined ,


    "ACVValues": [], 
    "GeoValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['geoId'], 'name'),
    "ForecastValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['oppForecast'], 'id'),
    "StatusReasonValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['statusReason'], 'id'),
    "ProbabilityValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['manualProb'], 'id'),
    "IsHardClosedValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['isHardClose'], 'name'),
    "StatusValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
   

     "HardClosedStartDate": this.HardClosedStartDate?(this.datePipe1.transform(this.HardClosedStartDate, "yyyy-MM-dd")):undefined,
  "HardClosedEndDate": this.HardClosedEndDate?(this.datePipe1.transform(this.HardClosedEndDate, "yyyy-MM-dd")):undefined,
  "ActualClosedStartDate": this.ActualClosedStartDate?(this.datePipe1.transform(this.ActualClosedStartDate, "yyyy-MM-dd")):undefined,
  "ActualClosedEndDate":  this.ActualClosedEndDate?(this.datePipe1.transform(this.ActualClosedEndDate, "yyyy-MM-dd")):undefined,
    "Statuscode": this.selectedStatusCode,
     "IsOverDue": this.IsOverDuee,
        "MyOwned" : this.MyOwnedd,

        




        "SuspendStartDate": this.suspendStartDate?(this.datePipe1.transform(this.suspendStartDate, "yyyy-MM-dd")):undefined,
        "SuspendEndDate": this.suspendEndDate?(this.datePipe1.transform(this.suspendEndDate, "yyyy-MM-dd")):undefined,
        "NextReviewStartDate": this.nextReviewStartDate?(this.datePipe1.transform(this.nextReviewStartDate, "yyyy-MM-dd")):undefined,
        "NextReviewEndDate":  this.nextReviewEndDate?(this.datePipe1.transform(this.nextReviewEndDate, "yyyy-MM-dd")):undefined

    }
  }














   
  GetAppliedColumnFilterData(data) {
    var AccountGuidd
    if(this.router.url.includes('/opportunity/allopportunity')){
      AccountGuidd = undefined
     }
     else{
      AccountGuidd =  (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
     }
   return{
    
    
    "AccountGuid": AccountGuidd,
     "OpportunityNames": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
      "OpportunityIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ID'], 'name'),
      "OpportunityType": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
          "AccountIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Account'], 'name'),
      "OwnerIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Owner'], 'name'),
      "PipelineStages": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Stage'], 'id'),
          // "EstimatedCloseDates": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Estclosuredate'], 'Name'),
      "VerticalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'name'),
       "TCVValues": [],
      // "TCVValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['EstTCV'], 'namee'),
          "CurrencyIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Currency'], 'name'),
      "ProposalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ProposalType'], 'id'),
       "StartFromDate": this.startFilterDate?(this.datePipe1.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe1.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,

          "ACVValues": [], 
    "GeoValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['geoId'], 'name'),
    "ForecastValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['oppForecast'], 'id'),
    
    "StatusReasonValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['statusReason'], 'id'),
    "ProbabilityValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['manualProb'], 'id'),
    "IsHardClosedValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['isHardClose'], 'name'),
    "StatusValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
   

    "HardClosedStartDate": this.HardClosedStartDate?(this.datePipe1.transform(this.HardClosedStartDate, "yyyy-MM-dd")):undefined,
  "HardClosedEndDate": this.HardClosedEndDate?(this.datePipe1.transform(this.HardClosedEndDate,"yyyy-MM-dd")):undefined,
  "ActualClosedStartDate": this.ActualClosedStartDate?(this.datePipe1.transform(this.ActualClosedStartDate, "yyyy-MM-dd")):undefined,
  "ActualClosedEndDate":  this.ActualClosedEndDate?(this.datePipe1.transform(this.ActualClosedEndDate, "yyyy-MM-dd")):undefined,
  "SuspendStartDate": this.suspendStartDate?(this.datePipe1.transform(this.suspendStartDate, "yyyy-MM-dd")):undefined,
  "SuspendEndDate": this.suspendEndDate?(this.datePipe1.transform(this.suspendEndDate, "yyyy-MM-dd")):undefined,
  "NextReviewStartDate": this.nextReviewStartDate?(this.datePipe1.transform(this.nextReviewStartDate, "yyyy-MM-dd")):undefined,
  "NextReviewEndDate":  this.nextReviewEndDate?(this.datePipe1.transform(this.nextReviewEndDate, "yyyy-MM-dd")):undefined
    
    }  }

  CallListDataWithFilters(data) {

    console.log(data)

 
    let reqparam = this.GetAppliedFilterData({ ...data })
    let filterLisingApi = this.OpportunitiesService.filterLisingApi(reqparam)
    let getListCount = this.allopportunities.getListCount(reqparam);
    forkJoin([filterLisingApi,getListCount]).subscribe(response => {
 
      if (response && response[0] && response[1] && !response[0].IsError && !response[1].IsError ) {
        var res = response[0]
  

    // this.OpportunitiesService.filterLisingApi(reqparam).subscribe(res => {
      // console.log(res)
      // if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
         this.getTableFilterData(res.ResponseObject, this.statusCode,start,reqparam.RequestedPageNumber,reqparam.PageSize)
          this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink?res.OdatanextLink:''
           this.tableTotalCount = response[1].ResponseObject;

          // this.tableTotalCount = res.TotalRecordCount
        } else {
          this.AllOpportunityTableTab = [{}]
          this.tableTotalCount = 0
        }
      } else {
        if( response[0].IsError){
          this.OpportunitiesService.displayMessageerror(response[0].Message);   
      
        }
        else{
          this.OpportunitiesService.displayMessageerror(response[1].Message);   
        }
       
        // this.OpportunitiesService.displayMessageerror("Oops! There seems to be some technical snag! Could you raise a Helpline ticket? ");   

        this.AllOpportunityTableTab = [{}]
        this.tableTotalCount = 0
        // this.errorMessage.throwError(res.Message)
      }
    });
  }
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

 generateFilterConfigData(data, headerName,isConcat, isServiceCall?) {
   
   if(  data.filterData.headerName=='NextReviewDate' || data.filterData.headerName=='SuspendStartDate' || data.filterData.headerName=='Estclosuredate'  || data.filterData.headerName=='hardCloseDate' || data.filterData.headerName=='actualCloseDate'){

   }
   else{
    if (isServiceCall) {
      let useFulldata = {
        headerName:headerName,
        SearchText:  this.searchText || this.searchText==='0'?this.searchText:'',
        RequestedPageNumber:this.filterConfigData[headerName].PageNo,
        PageSize:10,
        OdatanextLink:this.filterConfigData[headerName].NextLink,
        FilterSearchText:    data.filterData.columnSerachKey || data.filterData.columnSerachKey===0 || data.filterData.columnSerachKey==='0'?data.filterData.columnSerachKey:'',
        
        "IsOverDue": this.IsOverDuee,
        "MyOwned" : this.MyOwnedd



 




      }
      this.OpportunitiesService.getListConfigData({ ...data,useFullData:useFulldata, columnFIlterJson: this.GetAppliedColumnFilterData(data) , isService:true , userGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') , Statuscode:this.selectedStatusCode }).subscribe(res => {
        this.filterConfigData.isFilterLoading=false;
        this.filterConfigData[headerName] = {
          data:(isConcat)?this.filterConfigData[headerName]["data"].concat(res.ResponseObject):res.ResponseObject,
             recordCount: res.TotalRecordCount,
             NextLink:  res.OdatanextLink?res.OdatanextLink:'',
             PageNo:res.CurrentPageNumber?res.CurrentPageNumber:res.PageSize
          }
       
          data.filterData.filterColumn[headerName].forEach(res => {
          let index;
          if (headerName == 'EstTCV') {
            index = this.filterConfigData[headerName].data.findIndex(x => x.namee == res.namee);
          } 
          else if (headerName == 'Estclosuredate') {
            index = this.filterConfigData[headerName].data.findIndex(x => x.Name == res.Name);
          }
          else {
            index = this.filterConfigData[headerName].data.findIndex(x => x.name == res.name);
          }
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true
          }
        });

      });
    } else {
      this.filterConfigData.isFilterLoading=false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }
}
  CheckFilterServiceFlag(data, headerName): boolean {

    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
        return true
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
        return true
      } else {
        return false
      }
    } else {

      return false
    }
  }

GetColumnFilters(data) {

    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].PageNo=1
        this.filterConfigData[headerName].data=[]
        this.filterConfigData[headerName].NextLink=''
        
        this.generateFilterConfigData(data, headerName,false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllContactsRequestbody.OdatanextLink=''
          this.AllContactsRequestbody.RequestedPageNumber=1
          this.AllContactsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.CallListDataWithFilters(data)
        } else {
          this.AllContactsRequestbody.OdatanextLink=''
          this.AllContactsRequestbody.RequestedPageNumber=1
          this.AllContactsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.getAllContactsList(this.AllContactsRequestbody, true, false, false);
        }
      }
    }
  }

  
 GetColumnSearchFilters(data){
  
    let headerName = data.filterData.headerName
    this.AllContactsRequestbody.OdatanextLink=''
    this.filterConfigData[headerName].PageNo=1
    this.filterConfigData[headerName].NextLink=''
    this.generateFilterConfigData(data,headerName,false,true)

  }

  LoadMoreColumnFilter(data){

    let headerName = data.filterData.headerName
     this.filterConfigData[headerName].PageNo=this.filterConfigData[headerName].PageNo+1
    this.generateFilterConfigData(data,headerName,true,true)
  }



  
  downloadList(data): void {

    this.isLoading = true
 var allHeader;
  if(this.router.url.includes('/opportunity/allopportunity')){
  if(  this.tableName == 'allopportunitiesTab'){
allHeader = allopportunityheader
  }
  if(  this.tableName == 'suspendheader'){
    allHeader = suspendheader
      }

  if(  this.tableName == 'terminatedheader'){
    allHeader = terminatedheader
      }
  if(  this.tableName == 'allopportunitiesOwnerList'){
    allHeader = allopportunitiesOwnerList
      }
  if(  this.tableName == 'overdueTab'){
allHeader = overdueTabheader
  }
    if(  this.tableName == 'allopportunitiesList'){
allHeader = allopportunitiesListheader
  }
    if(  this.tableName == 'wonTab'){
allHeader = wonHeader
  }
  }
   else{
    if(  this.tableName == 'suspendAccountheader'){
      allHeader = suspendAccountheader
        }
    if(  this.tableName == 'allopportunitiesOwnerAccountList'){
      allHeader = allopportunitiesOwnerAccountList
        }
        if(  this.tableName == 'terminatedAccountheader'){
          allHeader = terminatedAccountheader
            }
if(  this.tableName == 'allopportunitiesAccountTab'){
allHeader = allopportunityAccountheader
  }
  if(  this.tableName == 'overdueAccountTab'){
allHeader = overdueTabAccountheader
  }
    if(  this.tableName == 'allopportunitiesAccountList'){
allHeader = allopportunitiesAccountListheader
  }
    if(  this.tableName == 'wonAccountTab'){
allHeader = wonAccountHeader
  }


   }

   var accGuid=this.OpportunitiesService.getSession('accountGuidDownload');
   console.log("AccountGuidDownload",accGuid);
   this.dataCheck = this.dataCheck.map(function(el) {
    var o = Object.assign({}, el);
    o.nameCol=""
    return o;
   });
   console.log("Column Order 0", this.dataCheck);
   for(let x=0;x<this.dataCheck.length;x++){
      if(this.dataCheck[x].name==="OpportunityName"){
        this.dataCheck[x].nameCol="OpportunityName";
      }
      if(this.dataCheck[x].name==="ID"){
        this.dataCheck[x].nameCol="OpportunityNumber";
      }
      if(this.dataCheck[x].name==="Account"){
        this.dataCheck[x].nameCol="Account";
      }   
      if(this.dataCheck[x].name==="Vertical"){
        this.dataCheck[x].nameCol="Vertical";
      }
      if(this.dataCheck[x].name==="Estclosuredate"){
        this.dataCheck[x].nameCol="EstimatedCloseDate";
      }
      if(this.dataCheck[x].name==="EstTCV"){
        this.dataCheck[x].nameCol="EstimatedTCVPlain";
      }
      if(this.dataCheck[x].name==="actualRev"){
        this.dataCheck[x].nameCol="ActualRevenue";
      }
      if(this.dataCheck[x].name==="Status"){
        this.dataCheck[x].nameCol="StatusName";
      }
      if(this.dataCheck[x].name==="statusReason"){
        this.dataCheck[x].nameCol="StateCode";
      }
      if(this.dataCheck[x].name==="manualProb"){
        this.dataCheck[x].nameCol="ManualProbability";
      }
      if(this.dataCheck[x].name==="oppForecast"){
        this.dataCheck[x].nameCol="Forecast";
      }
      if(this.dataCheck[x].name==="isHardClose"){
        this.dataCheck[x].nameCol="HardClosed";
      }
      if(this.dataCheck[x].name==="geoId"){
        this.dataCheck[x].nameCol="GeographyName";
      }
      if(this.dataCheck[x].name==="ProposalType"){
        this.dataCheck[x].nameCol="ProposalTypeName";
      }
      if(this.dataCheck[x].name==="Stage"){
        this.dataCheck[x].nameCol="Stage";
      }
      if(this.dataCheck[x].name==="Type"){
        this.dataCheck[x].nameCol="OpportunityType";
      }
      if(this.dataCheck[x].name==="Owner"){
        this.dataCheck[x].nameCol="OpportunityOwnerName";
      }
      if(this.dataCheck[x].name==="Currency"){
        this.dataCheck[x].nameCol="TransactionCurrencyValue";
      }
      if(this.dataCheck[x].name==="hardCloseDate"){
        this.dataCheck[x].nameCol="HardClosedDate";
      }
      if(this.dataCheck[x].name==="actualCloseDate"){
        this.dataCheck[x].nameCol="ActualClosedDate";
      }
      if(this.dataCheck[x].name==="NextReviewDate"){
        this.dataCheck[x].nameCol="NextReviewDate";
      }
      if(this.dataCheck[x].name==="SuspendStartDate"){
        this.dataCheck[x].nameCol="SuspendStartDate";
      }
   }
   console.log("Column Order1", this.dataCheck);
   console.log("Column Order2", data.objectRowData[1]);
   
   var colName=[];
   for(var i=0;i<this.dataCheck.length;i++){
      colName[i]=this.dataCheck[i].nameCol;
   }
   console.log("Column Order3", colName);
   

    let isDownloadReqBody = {

    "UserGuid":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
    "PageSize": 1,
     "RequestedPageNumber": 1,
     "SearchText": this.searchText ,
      "IsDesc":(data.filterData.sortColumn!='')?!data.filterData.sortOrder:false,
      "IsOverDue": this.IsOverDuee,
        "MyOwned" : this.MyOwnedd,
   
      "SortBy": this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]? this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[],
  //  "SortBy": this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0] || this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]==='0' || this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0] === 0 ? this.OpportunitiesService.pluckParticularKey(allHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[],
      
      "OpportunityNames": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
      "OpportunityIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ID'], 'name'),
      "OpportunityType": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
          "AccountIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Account'], 'name'),
      "OwnerIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Owner'], 'name'),
      "PipelineStages": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Stage'], 'id'),
          // "EstimatedCloseDates": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Estclosuredate'], 'Name'),
      "VerticalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'name'),
       "TCVValues": [],
      // "TCVValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['EstTCV'], 'namee'),
          "CurrencyIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Currency'], 'name'),
      "ProposalIds": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['ProposalType'], 'id'),
       "StartFromDate": this.startFilterDate?(this.datePipe1.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe1.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,


          "ACVValues": [], 
    "GeoValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['geoId'], 'name'),
    "ForecastValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['oppForecast'], 'id'),
   
    "StatusReasonValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['statusReason'], 'id'),
    "ProbabilityValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['manualProb'], 'id'),
    "IsHardClosedValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['isHardClose'], 'name'),
    "StatusValues": this.OpportunitiesService.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
    "AccountGuid":accGuid,

  "HardClosedStartDate": this.HardClosedStartDate?(this.datePipe1.transform(this.HardClosedStartDate, "yyyy-MM-dd")):undefined,
  "HardClosedEndDate": this.HardClosedEndDate?(this.datePipe1.transform(this.HardClosedEndDate, "yyyy-MM-dd")):undefined,
  "ActualClosedStartDate": this.ActualClosedStartDate?(this.datePipe1.transform(this.ActualClosedStartDate, "yyyy-MM-dd")):undefined,
  "ActualClosedEndDate":  this.ActualClosedEndDate?(this.datePipe1.transform(this.ActualClosedEndDate, "yyyy-MM-dd")):undefined,
  "Statuscode": this.selectedStatusCode,
  "ColumnOrder": colName
    }

    this.OpportunitiesService.downloadOpportunities(isDownloadReqBody).subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          this.service.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false
         this.OpportunitiesService.displayMessageerror(res.Message)
      }
    }, error => {
      this.isLoading = false
    })

  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
     this.OpportunitiesService.displayMessageerror(`${fileInfo.Name} downloaded`)
    fileTransfer.download(
      uri, fileURL, function (entry) {
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
    );
  }

  startFilterDate='';
  endFilterDate='';

  clearAllFilter(pageSize){
 
 this.AllContactsRequestbody = {
    "PageSize": pageSize,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    // "FilterData": this.OpportunitiesService.sendConfigData || []
  }
   this.paginationPageNo = {
  "PageSize": pageSize,
  "RequestedPageNumber": 1,
  "OdatanextLink": "",
 
  
}
     // "FilterData": this.OpportunitiesService.sendConfigData || []
  
     this.AllOpportunityTableTab =[]
    this.getAllContactsList(this.AllContactsRequestbody, true, false, false);
  }

     filterConfigData1:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Type: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Stage: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Currency: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    ProposalType: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    manualProb: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    oppForecast: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false,
  };


  filterConfigSuspendData:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Type: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Stage: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Currency: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    ProposalType: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    NextReviewDate: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    SuspendStartDate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
   isFilterLoading:false,
  };


  filterConfigDataTL:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Type: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Stage: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Currency: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    ProposalType: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    manualProb: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    oppForecast: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    actualCloseDate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    statusReason: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
isFilterLoading:false,
  };

     filterConfigData:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Type: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Stage: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Currency: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    ProposalType: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false,
  };
 


 filterConfigListData:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    actualRev: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Status: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    statusReason: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    manualProb: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    oppForecast: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    isHardClose: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
     geoId: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
     Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
     Stage: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false,
  };


  filterConfigOwnerListData:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Estclosuredate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    EstTCV: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    actualRev: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Status: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    statusReason: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    manualProb: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    oppForecast: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    isHardClose: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
     geoId: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
     Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false,
  };
 

 filterConfigWonData:any = {
       
    OpportunityName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Type: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isHardClose: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    hardCloseDate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    actualCloseDate: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Vertical: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    EstTCV: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Currency: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ProposalType: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false,
  };




   filterConfigOverdueData:any = {
       
   OpportunityName : { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   ID: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
   Account: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   Vertical : { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   Estclosuredate : { data: [], recordCount: 0, PageNo:1,NextLink: '' },
   EstTCV : { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   Status : { data: [], recordCount: 0, PageNo:1,NextLink: '' },
   manualProb : { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   oppForecast : { data: [], recordCount: 0,PageNo:1, NextLink: '' },
   Owner: { data: [], recordCount: 0, PageNo:1,NextLink: '' },

  
    isFilterLoading:false,
  };


  HardClosedStartDate=''
HardClosedEndDate=''
ActualClosedStartDate=''
ActualClosedEndDate=''

selectedStatusCode;


MyOwnedd = undefined
Statuscodee = undefined
IsOverDuee = undefined


statusData(){
  
   if(this.statusCode==1){ 
     this.tabList[0].GroupData

     this.filterConfigData = this.filterConfigListData
   
  }
  else if(this.statusCode==2){ 
    
     this.filterConfigData = this.filterConfigOwnerListData
   
  }
  else if(this.statusCode==3){ 
     
     
      this.filterConfigData = this.filterConfigData1
   
  }
 else if(this.statusCode== 4){
  
    this.filterConfigData = this.filterConfigData1

  }
 else if(this.statusCode== 5){ 
   
    this.filterConfigData = this.filterConfigDataTL
   
  }
 else if(this.statusCode==6){ 
    
    this.filterConfigData = this.filterConfigWonData
  
  }
 else if(this.statusCode==7){ 
     
     this.filterConfigData = this.filterConfigDataTL
 
  }
 else if(this.statusCode==8){ 
   this.filterConfigData = this.filterConfigSuspendData
 
  }
 else if(this.statusCode==9){ 
   
      this.filterConfigData = this.filterConfigOverdueData
    
  }

}
  dataCheck:any=[];

 suspendStartDate=''
 suspendEndDate=''
 nextReviewStartDate=''
 nextReviewEndDate=''
  performTableChildAction(childActionRecieved): Observable<any> {
    debugger;

    this.suspendStartDate=''
    this.suspendEndDate=''
    this.nextReviewStartDate=''
    this.nextReviewEndDate=''
     this.startFilterDate = ''
     this.endFilterDate =''
     this.HardClosedStartDate=''
     this.HardClosedEndDate=''
     this.ActualClosedStartDate=''
     this.ActualClosedEndDate=''
    //  this.filterConfigData ={}

     var selectedArr =  this.dropDownData.filter( (it)=>{
           if(it.attributevalue == this.statusCode){
              return it;
           }
       }
      
      
      
      );
     this.selectedStatusCode = selectedArr[0].StatusId?selectedArr[0].StatusId:undefined

   if(this.statusCode==1){ 
     this.tabList[0].GroupData

     this.tableCollection(["allopportunitiesList",'allopportunitiesAccountList'])
    //  this.filterConfigData = this.filterConfigListData
     this.MyOwnedd = undefined
     this.Statuscodee = undefined
     this.IsOverDuee = undefined

  }
  else if(this.statusCode==2){ 
   
     this.tableCollection(["allopportunitiesOwnerList",'allopportunitiesOwnerAccountList'])
    
    //  this.filterConfigData = this.filterConfigListData
     this.MyOwnedd = true
     this.Statuscodee = undefined
     this.IsOverDuee = undefined

  }
  else if(this.statusCode==3){ 
     
     this.tableCollection(["allopportunitiesTab",'allopportunitiesAccountTab'])
     
      // this.filterConfigData = this.filterConfigData1
      this.MyOwnedd = true
      this.Statuscodee = '1'
      this.IsOverDuee = undefined

  }
 else if(this.statusCode== 4){

     this.tableCollection(["allopportunitiesTab",'allopportunitiesAccountTab'])
    
    // this.filterConfigData = this.filterConfigData1
    this.MyOwnedd = undefined
    this.Statuscodee = '1'
    this.IsOverDuee = undefined

  }
 else if(this.statusCode== 5){ 
  
     this.tableCollection(["terminatedheader",'terminatedAccountheader'])
    
    // this.filterConfigData = this.filterConfigData1
    this.MyOwnedd = undefined
    this.Statuscodee = '5'
    this.IsOverDuee = undefined

  }
 else if(this.statusCode==6){ 
   
     this.tableCollection(["wonTab",'wonAccountTab'])
    
    // this.filterConfigData = this.filterConfigWonData
    this.MyOwnedd = undefined
    this.Statuscodee = '3'
    this.IsOverDuee = undefined

  }
 else if(this.statusCode==7){ 
    
     this.tableCollection(["terminatedheader",'terminatedAccountheader'])
     
    //  this.filterConfigData = this.filterConfigData1
     this.MyOwnedd = undefined
     this.Statuscodee = '184450000'
     this.IsOverDuee = undefined

  }
 else if(this.statusCode==8){ 
 
     this.tableCollection(["suspendheader",'suspendAccountheader'])
   
  //  this.filterConfigData = this.filterConfigData1
   this.MyOwnedd = undefined
   this.Statuscodee = '2'
   this.IsOverDuee = undefined

  }
 else if(this.statusCode==9){ 
   
     this.tableCollection(["overdueTab",'overdueAccountTab'])
      
      // this.filterConfigData = this.filterConfigOverdueData
      this.MyOwnedd = undefined
      this.Statuscodee = undefined
      this.IsOverDuee = 'true'

  }



if(!childActionRecieved.filterData.filterColumn.NextReviewDate?false:childActionRecieved.filterData.filterColumn.NextReviewDate.length>0?true:false){
 this.suspendStartDate =  childActionRecieved.filterData.filterColumn.NextReviewDate?childActionRecieved.filterData.filterColumn.NextReviewDate[0].filterStartDate.toLocaleString():''
 this.suspendEndDate =  childActionRecieved.filterData.filterColumn.NextReviewDate?childActionRecieved.filterData.filterColumn.NextReviewDate[0].filterEndDate.toLocaleString():''
}

if(!childActionRecieved.filterData.filterColumn.SuspendStartDate?false:childActionRecieved.filterData.filterColumn.SuspendStartDate.length>0?true:false){
  this.nextReviewStartDate =  childActionRecieved.filterData.filterColumn.SuspendStartDate?childActionRecieved.filterData.filterColumn.SuspendStartDate[0].filterStartDate.toLocaleString():''
  this.nextReviewEndDate =  childActionRecieved.filterData.filterColumn.SuspendStartDate?childActionRecieved.filterData.filterColumn.SuspendStartDate[0].filterEndDate.toLocaleString():''
 }

 if(!childActionRecieved.filterData.filterColumn.Estclosuredate?false:childActionRecieved.filterData.filterColumn.Estclosuredate.length>0?true:false){
  this.startFilterDate =  childActionRecieved.filterData.filterColumn.Estclosuredate?childActionRecieved.filterData.filterColumn.Estclosuredate[0].filterStartDate.toLocaleString():''
  this.endFilterDate =  childActionRecieved.filterData.filterColumn.Estclosuredate?childActionRecieved.filterData.filterColumn.Estclosuredate[0].filterEndDate.toLocaleString():''
 }


if(!childActionRecieved.filterData.filterColumn.hardCloseDate?false:childActionRecieved.filterData.filterColumn.hardCloseDate.length>0?true:false){
 this.HardClosedStartDate =  childActionRecieved.filterData.filterColumn.hardCloseDate?childActionRecieved.filterData.filterColumn.hardCloseDate[0].filterStartDate.toLocaleString():''
 this.HardClosedEndDate =  childActionRecieved.filterData.filterColumn.hardCloseDate?childActionRecieved.filterData.filterColumn.hardCloseDate[0].filterEndDate.toLocaleString():''
}

 

if(!childActionRecieved.filterData.filterColumn.actualCloseDate?false:childActionRecieved.filterData.filterColumn.actualCloseDate.length>0?true:false){
 this.ActualClosedStartDate =  childActionRecieved.filterData.filterColumn.actualCloseDate?childActionRecieved.filterData.filterColumn.actualCloseDate[0].filterStartDate.toLocaleString():''
 this.ActualClosedEndDate =  childActionRecieved.filterData.filterColumn.actualCloseDate?childActionRecieved.filterData.filterColumn.actualCloseDate[0].filterEndDate.toLocaleString():''
}
    var actionRequired = childActionRecieved;
        console.log("performtablechild",actionRequired.objectRowData);

    switch (actionRequired.action) {

        case 'pinChange': {
        this.pinChange(childActionRecieved);
        return;
      }
     case 'Account': {
        this.accountNav(childActionRecieved);
        return
      }
      
        case 'ClearAllFilter': {
        this.clearAllFilter(childActionRecieved.pageData.itemsPerPage);
        return
      }
      case 'share': {
         this.accessApi(actionRequired, 'share')
     
        return;
      
      }
       case 'DownloadCSV': {
        console.log("downloafing")
        this.dataCheck=childActionRecieved.objectRowData[1];
        this.downloadList(childActionRecieved);
        return
      }
          case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case "columnSearchFilter":{
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData':{
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
       case 'sortHeaderBy' :{
        this.AllContactsRequestbody.OdatanextLink=''
        this.AllContactsRequestbody.RequestedPageNumber=1
        this.AllContactsRequestbody.PageSize = childActionRecieved.pageData.itemsPerPage

        this.paginationPageNo.RequestedPageNumber=1
        this.paginationPageNo.PageSize = childActionRecieved.pageData.itemsPerPage
        
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'tabNavigation':
      debugger;
        {
          this.OpportunitiesService.setSession('path',this.router.url);
          this.statusCode= actionRequired.objectRowData.id;
          this.statusData()
          this.searchText =''
          this.AllOpportunityTableTab =[]
          this.tableTotalCount=0
          this.statusCode= actionRequired.objectRowData.id;
     this.paginationPageNo={
       
            RequestedPageNumber:1,
            PageSize:childActionRecieved.pageData.itemsPerPage,
            OdatanextLink:''
          }

    if(this.statusCode != -1)
    {
      this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
    }
    else
    {
      this.router.navigateByUrl('opportunity/allopportunityview');
    }
        
          //updated custom-tab dropdown navigation to be given here
          return;
        }
      case 'search':
      {
            this.AllContactsRequestbody.RequestedPageNumber=1
        this.AllContactsRequestbody.PageSize = childActionRecieved.pageData.itemsPerPage
             this.searchText= actionRequired.objectRowData
              this.paginationPageNo = {
      "PageSize": actionRequired.pageData.itemsPerPage,
      "RequestedPageNumber":  1,
      "OdatanextLink": ""
    };
     
         
          if (this.service.checkFilterListApiCall(childActionRecieved)) {
        // filter api call
        this.CallListDataWithFilters(childActionRecieved);
             return;
        
      } else {
        // list api call
     this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
             return;
     
      }

            //  this.getOpportunityLandingData(this.statusCode,this.paginationPageNo,this.searchText);
            //  return;
      }


      case 'assignOpportunity':
      {
         this.accessApi(actionRequired, 'assign')
     
        return;
      }
      
      case 'suspend':
      {
        this.accessApi(actionRequired, 'suspend')
      
       return;
      }

      case 'estimateDate':
      {
      this.accessApi(actionRequired, 'estimateDate')
        return; 
     } 

     case 'reopen':
     {
         this.accessApi(actionRequired, 'reopen')
      //  this.reopenPopup(actionRequired);
       return;
     }

       case 'multipleAssign':
     {

       this.accessApi(actionRequired, 'assign')
       return;
     }
      
      case 'reactivate':
        {
     this.accessApi(actionRequired, 'reactivate')
        
       return;


        }
      case 'convertOpportunity': {
        return of('nurture Trigger');
      }

      case 'OpportunityName': {
        debugger;
        // this.OpportunitiesService.setSession('sbuId', actionRequired.objectRowData[0].SbuId?actionRequired.objectRowData[0].SbuId:'') 
        this.OpportunitiesService.setSession('opportunityName', actionRequired.objectRowData[0].OpportunityName ?this.getSymbol(  actionRequired.objectRowData[0].OpportunityName.toString() ): "");  
        this.OpportunitiesService.setSession('WiproIsAutoClose', actionRequired.objectRowData[0].WiproIsAutoClose ? actionRequired.objectRowData[0].WiproIsAutoClose: "");  
        this.accessApi(actionRequired, 'accessApi');
                
        //get the sbu and set in session for DA before page loads
        if(actionRequired.objectRowData[0].AccountId){ 
          this.getSbuName(childActionRecieved.objectRowData[0].AccountId);
        }
      
         if(actionRequired.objectRowData[0].statusText == 'Nurtured'){
            this.service.leadNuture = true;
        }
        else{
          this.service.leadNuture = false;
        }
      }
    }
  }
  /************Select Tabs dropdown code starts */

  pinChange(childActionRecieved) {
    const reqbody = {
      'SysGuid': childActionRecieved.objectRowData.SysGuid ? childActionRecieved.objectRowData.SysGuid : undefined,
      'OpportunityViewType': childActionRecieved.objectRowData.PinId
    };
    this.OpportunitiesService.pinChangeApi(reqbody).subscribe((res: any) => {
     
      this.tabList[0].GroupData.forEach(element => {
        if (childActionRecieved.objectRowData.id === element.id) {
          element.isPinned = true;
        } else {
          element.isPinned = false;
        }
      });
    });
  }

      reactivatePopup(actionRequired){

      debugger;
      if(actionRequired.objectRowData[0].StageId.toString()=='184450004'){
 this.OpportunitiesService.displayMessageerror("You can't reactivate opportunity in close stage")
  }
  else{
      console.log("actionRequired",actionRequired)
      const dialogRef = this.dialog.open(ReactivateopprtuntyComponent,
      {
        width: '396px',
         data: { data:actionRequired.objectRowData[0] }
      });
         dialogRef.afterClosed().subscribe(result => {
          
     if(result=='close' ){

          }
   else if(result =='save'){
       
  this.callFilterAPI(actionRequired)
     
 
         }
     });
}}
// AccountTemplateid(actionRequired,templateId){
//   this.isLoading = true;
// this.OpportunitiesService.getTemplate("Account (Read)").subscribe(response => {
//   if( !response.IsError){
//     this.isLoading = false;
//    var accountTmplateId =response.ResponseObject.Teamtemplateid
//    this.sharePopup(actionRequired,templateId,accountTmplateId)
    
//    }
// else{
//  this.OpportunitiesService.displayMessageerror(response.Message);
// } 
// }
// ,
//    err => {
//         this.isLoading = false;
// this.OpportunitiesService.displayerror(err.status);
// }
// );
// }
// getShareTemplateAPi(actionRequired){
//       this.isLoading = true;
//      this.OpportunitiesService.getTemplate('Opportunity (Read - Write)').subscribe(response => {
//       if( !response.IsError){
//         this.isLoading = false;
//        var templateId =response.ResponseObject.Teamtemplateid
//        this.AccountTemplateid(actionRequired,templateId)
    
//        }
//   else{
//      this.OpportunitiesService.displayMessageerror(response.Message);
//   } 
//  }
//     ,
//        err => {
//             this.isLoading = false;
//     this.OpportunitiesService.displayerror(err.status);
//   }
//   );
 

// }

getSbuName(accId) { ////to get the latest sbuNam
  if(accId){
    let accountFields = {
      "AccountId": accId,
      "SearchType": 1,
      "UserGuid": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    }
    this.OpportunitiesService.getAccountRelatedFiels(accountFields).subscribe(accountData => {
      if (!accountData.IsError) {
        let sbuName = accountData.ResponseObject.SBU ? accountData.ResponseObject.SBU.Name : null;
        this.OpportunitiesService.setSession('sbuStoredValue', sbuName);
        console.log("sbuNameDA", this.OpportunitiesService.getSession('sbuStoredValue'));
      }
    }, error => {
      console.log("DA accID", error);
    });
  }
}

sharePopup(actionRequired,templateId,accountTemplateId){
//   if(actionRequired.objectRowData[0].StageId.toString()=='184450004' && actionRequired.objectRowData[0].StatusId!= 3 ){
//  this.OpportunitiesService.displayMessageerror("You can't share opportunity in close stage")
//   }
// else{
const dialogRef = this.dialog.open(SharePopupComponent,
      {
        width: '480px',
          data: { data:    JSON.parse(JSON.stringify (actionRequired.objectRowData))  ,templateId:templateId,accountTemplateId:accountTemplateId   }
      });
        dialogRef.afterClosed().subscribe(result => {

          if(result=='success' ){
        this.callFilterAPI(actionRequired)
      
          }
      else   {   
       
        }
     });
// }
}

      accessApi(actionRequired,action){
      
 

          this.OpportunitiesService.setSession('opportunityId', actionRequired.objectRowData[0].OpportunityId!='NA'?actionRequired.objectRowData[0].OpportunityId:'' ) 
//         actionRequired.objectRowData[0].IsFullAccess =false
//         if(actionRequired.objectRowData[0].IsFullAccess){
//           if(action=='estimateDate'){
//          this.estimatePopup(actionRequired); 
//          return;  
//           }
//          else if(action=='share'){
//          this.getShareTemplateAPi(actionRequired); 
//          return;  
//           }
//           else if(action=='assign'){
//            this.assignOpportunity(actionRequired);
//            return;
//           }
//            else if(action=='reopen'){
//           this.reopenPopup(actionRequired);
//           return;
//           }
//            else if(action=='reactivate'){
//              this.reactivatePopup(actionRequired);
//              return;
//           }
        
         
        
//            else if(action=='suspend'  ){
//              this.suspendPopup(actionRequired);
//              return;
//           }
          
//           else{
//           this.OpportunitiesService.setSession('FullAccess',actionRequired.objectRowData[0].IsFullAccess?actionRequired.objectRowData[0].IsFullAccess:false);
   
//        this.OpportunitiesService.setSession('statusCode',actionRequired.objectRowData[0].StatusId?actionRequired.objectRowData[0].StatusId:'');  
//           this.OpportunitiesService.setSession('opportunityStatus', actionRequired.objectRowData[0].StatusId?actionRequired.objectRowData[0].StatusId:'');
 
// this.OpportunitiesService.setSession('SuspendCount',true)
//     this.OpportunitiesService.setSession('IsOAR',true)
//     this.OpportunitiesService.setSession('SuspendedDuration',true)
//    if(actionRequired.objectRowData[0].SuspendCount>1 ){
//     this.OpportunitiesService.setSession('SuspendCount',false)
//   }

  
//     else  if(actionRequired.objectRowData[0].IsOAR ){
//      this.OpportunitiesService.setSession('IsOAR',false)
//    }

//     else  if(actionRequired.objectRowData[0].SuspendedDuration> 180 ){
//        this.OpportunitiesService.setSession('SuspendedDuration',false)
//    }

// this.OpportunitiesService.setSession('AdvisorOwnerId',actionRequired.objectRowData[0].AdvisorOwnerId?actionRequired.objectRowData[0].AdvisorOwnerId:'')
// this.OpportunitiesService.setSession('IsStaffingInitiated',actionRequired.objectRowData[0].staffingDetails?actionRequired.objectRowData[0].staffingDetails:"")
// this.OpportunitiesService.clearSession("smartsearchData");
// this.OpportunitiesService.setSession('orderId','');
// this.OpportunitiesService.setSession('IsAmendment', false);
// this.OrderService.newAmendmentDetails = "";
// this.OrderService.parentOrderId = "";
// this.OrderService.amendmentInProcess = false;
// this.OpportunitiesService.restTab=false;
// this.OpportunitiesService.summaryOppTab=true;
// this.OpportunitiesService.initiateObButton=false;
// this.OpportunitiesService.winreasonNavigate2=false;
// this.OpportunitiesService.winreasonNavigate1=false;
// this.OrderService.BFMNavagationFlag = false;
// this.OpportunitiesService.setSession('BFMNavagationFlag',false);
//    this.OpportunitiesService.setSession('IsAppirioFlag',actionRequired.objectRowData[0].IsAppirioFlag);
//  this.DaAPi()
//  this.isLoaderNav = true;
//  if(this.router.url.includes('/opportunity/allopportunity')){
//   sessionStorage.setItem('routePage','opportunity');
//  }
//  else{
//   sessionStorage.setItem('routePage','account');
//  }
//  sessionStorage.setItem('pinStatus',this.statusCode);
//  this.router.navigate(['/opportunity/opportunityview']);


//           }
        
//         }
         
if(action=='estimateDate'){
  this.estimatePopup(actionRequired);
 }
 else if(action=='assign'){
  this.assignOpportunity(actionRequired);

//   }
//   else{

//         this.isLoading = true;
//         let body={
// "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),           
// "OpportunityOwnerId": actionRequired.objectRowData[0].OpportunityOwnerId ,
// "VerticalSalesOwner": actionRequired.objectRowData[0].VerticalSalesOwner ,
// "PrimaryAccountOwnerId":actionRequired.objectRowData[0].PrimaryAccountOwnerId,
// "OpportunityId": actionRequired.objectRowData[0].OpportunityId
//         }
// this.OpportunitiesService.checkSupervisor(body).subscribe(response => {
// if( !response.IsError){
// if(response.ResponseObject){
// this.assignOpportunity(actionRequired);
// }
// else{
//  this.OpportunitiesService.displayMessageerror("You don't have permission to assign opportunity");
// }
// }
// else{
// this.OpportunitiesService.displayMessageerror(response.Message);
// } 
// }
// ,
// err => {
//    this.isLoading = false;
// this.OpportunitiesService.displayerror(err.status);
// }
// );


//   }
 }
else  if(action=='reopen'){
    this.reopenPopup(actionRequired);
  }
 
  else if(action=='reactivate'){
     this.reactivatePopup(actionRequired);
  }
  




   else if(action=='suspend'){
     this.suspendPopup(actionRequired);
  }
  

   else if(action=='share'){
    this.sharePopup(actionRequired,'','')
   }
  
         
        else{
          this.OpportunitiesService.setSession('FullAccess',actionRequired.objectRowData[0].IsFullAccess?actionRequired.objectRowData[0].IsFullAccess:false);
  
         this.isLoading = true;
        
            this.OpportunitiesService.accessModifyApi(actionRequired.objectRowData[0].AdvisorOwnerId,localStorage.getItem('userEmail')).subscribe(res => {
                  this.isLoading = false;
              if (!res.IsError) {
                this.OpportunitiesService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
                this.OpportunitiesService.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
                this.OpportunitiesService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
                this.OpportunitiesService.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false);
              
                 
          
        this.OpportunitiesService.setSession('accessData',res.ResponseObject); 
          this.OpportunitiesService.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
          console.log('access',this.OpportunitiesService.getSession('accessData'));
                 this.OpportunitiesService.setSession('opportunityId', actionRequired.objectRowData[0].OpportunityId!='NA'?actionRequired.objectRowData[0].OpportunityId:'' )
 
 this.OpportunitiesService.setSession('statusCode',actionRequired.objectRowData[0].StatusId?actionRequired.objectRowData[0].StatusId:'');  
          this.OpportunitiesService.setSession('opportunityStatus', actionRequired.objectRowData[0].StatusId?actionRequired.objectRowData[0].StatusId:'');
 this.OpportunitiesService.setSession('SuspendCount',true)
    this.OpportunitiesService.setSession('IsOAR',true)
    this.OpportunitiesService.setSession('SuspendedDuration',true)
   if(actionRequired.objectRowData[0].SuspendCount>1 ){
    this.OpportunitiesService.setSession('SuspendCount',false)
  }

  
    else  if(actionRequired.objectRowData[0].IsOAR ){
     this.OpportunitiesService.setSession('IsOAR',false)
   }

    else  if(actionRequired.objectRowData[0].SuspendedDuration> 180 ){
       this.OpportunitiesService.setSession('SuspendedDuration',false)
   }
   

   this.OpportunitiesService.setSession('AdvisorOwnerId',actionRequired.objectRowData[0].AdvisorOwnerId?actionRequired.objectRowData[0].AdvisorOwnerId:'')
 this.OpportunitiesService.setSession('roleObj',res.ResponseObject);
   this.OpportunitiesService.setSession('IsOppOwner',actionRequired.objectRowData[0].IsOppOwner?actionRequired.objectRowData[0].IsOppOwner:false)
   this.OpportunitiesService.setSession('IsStaffingInitiated',actionRequired.objectRowData[0].staffingDetails?actionRequired.objectRowData[0].staffingDetails:'')
    this.OpportunitiesService.setSession('opportunityId',actionRequired.objectRowData[0].OpportunityId!='NA'?actionRequired.objectRowData[0].OpportunityId:'' )
   this.OpportunitiesService.setSession('orderId','');
   this.OpportunitiesService.setSession('IsAmendment', false);
   this.OpportunitiesService.restTab=false;
   this.OpportunitiesService.summaryOppTab=true;
   this.OpportunitiesService.initiateObButton=false;
   this.OpportunitiesService.winreasonNavigate2=false;
   this.OpportunitiesService.winreasonNavigate1=false;
   this.OrderService.BFMNavagationFlag = false;
   this.OpportunitiesService.setSession('BFMNavagationFlag',false);
   this.OpportunitiesService.setSession('IsAppirioFlag',actionRequired.objectRowData[0].IsAppirioFlag);
    this.DaAPi()
 this.isLoaderNav = true;
 if(this.router.url.includes('/opportunity/allopportunity')){
  sessionStorage.setItem('routePage','opportunity');
 }
 else{
  sessionStorage.setItem('routePage','account');
 }
 sessionStorage.setItem('pinStatus',this.statusCode);
 this.router.navigate(['/opportunity/opportunityview']);
   

            }
              else {
                 this.isLoading = false;
                this.OpportunitiesService.displayMessageerror(res.Message);
              }
         
          this.isLoading = false;
        }
              ,
              err => {
                this.isLoading = false;
                this.OpportunitiesService.displayerror(err.status);
              }
            )
        
         
        
        
            }  
          
        }
  selectedTabValue: string = "My Open";
  appendConversation(e) {
    debugger;
    console.log("e",e);
    if(!e.showView){
    this.selectedTabValue = e.name;
    this.statusCode = e.id;
   }
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
 // old custom-tab dropdown starts here 
  // tabList: {}[] = [
  //   {
  //     view: 'System views',
  //     groups: [
  //       // { name: 'My owned', router: 'opportunity/allopportunity' },
  //     { id: 1,name: 'My Open', router: '' },
  //     { id: 2,name: 'On Hold', router: '' },
  //     { id: 3,name: 'Won', router: '' },
  //     { id: 4,name: 'Suspended', router: '' },
  //     { id: 5,name: 'Terminated', router: '' },
  //     { id: 184450000,name: 'Lost', router: '' },
  //     { name: 'My open', router: 'opportunity/myopenopportunity' },
  //     // { name: 'Won', router: 'opportunity/allopportunity' },
  //     // { name: 'Lost', router: 'opportunity/allopportunity' },
  //     { name: 'Inavtive', router: 'opportunity/allopportunity' },
  //     { name: 'Create new view', router: 'opportunity/allopportunityview',showView:true },
  //     { name: 'Show all opportunity views', router: 'opportunity/showOpportunity',showAllView:true }
  //     ]
  //   },
  //   {
  //     view: 'Custom views',
  //     groups: [{ name: 'Wipro mobility conversation groups' },
  //     { name: 'Wipro commerce conversation groups' }
  //     ]
  //   }

  // ]
// old custom-tab dropdown ends here 

// updated custom-tab dropdown starts here 


	
		


// updated custom-tab dropdown ends here 
}

@Component({
  selector: 'modify-pop',
  templateUrl: './../../../../../../shared/components/single-table/sprint4Modal/modify-pop.html',
    styles:[`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }  
  .boldclass{
font-weight: bold;
  }
  `]
})
export class modifypopComponent {
  opportunityId;
  opportunityName;
  Estclosuredate;
  isLoading =false;
 datePipe1 = new DatePipe("en-US");

 constructor(public dialogRef: MatDialogRef<modifypopComponent>,public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService, public service: DataCommunicationService) { 
   debugger;
    this.opportunityId =data.data.OpportunityId;
      this.opportunityName= data.data.OpportunityName?data.data.OpportunityName:""
      this.Estclosuredate=   data.data.Estclosuredate? (this.datePipe1.transform(data.data.Estclosuredate, "dd-MMM-yyyy")):""
      }
  dateVal='';
  datePipe = new DatePipe("en-US");
  startDate = new Date();

closeIcon(){

  this.dialogRef.close('close');
}
estimate(){
 
  var selectedDate = (this.datePipe.transform(this.dateVal, "dd-MMM-yyyy"))
    var finalDate =   (this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate()), "dd-MMM-yyyy" ) )
    if ( new Date(selectedDate) > new Date(finalDate) ) {
      this.allopportunities.displayMessageerror('Estimated closure date cannot be more than 36 months from current date');
    }
 else{
  let body=  {
    "OpportunityId":this.opportunityId ,
    "EstimatedClosureDate": this.datePipe.transform(this.dateVal, "yyyy-MM-dd")
  }
    this.isLoading = true
   this.allopportunities.estimate(body).subscribe(response => {
   
     if( !response.IsError){
        if(response.Message=="success"){
      //auto save in overview page code
      this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {
      console.log("redis", res)
      if (!res.IsError && res.ResponseObject) {
        console.log("parsed data", JSON.parse(res.ResponseObject))
        let dataFromRedis = JSON.parse(res.ResponseObject);
        if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
          let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == this.opportunityId)
          if (currentOpportunityData.length) {
            dataFromRedis.map(data => {
              if (data.opportunityId == this.opportunityId) {
                data.estimatedclosedate = this.dateVal;
              }
            })
            this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
              if (!res.IsError) {
                console.log("SUCESS FULL AUTO SAVE")
              }
            }, error => {
              console.log(error)
            })
          }
        }
      }
    })
    //auto save in overview page code end
       this.allopportunities.displayMessageerror('Estimated closure date modified successfully'); 
       this.dialogRef.close('save');
        }
        else{
    this.allopportunities.displayMessageerror(response.Message); 
        }
      }
     else{
    this.allopportunities.displayMessageerror(response.Message); 
     }
  this.isLoading = false
     },
       err => {
           this.isLoading = false
    this.allopportunities.displayerror(err.status);
  }
  );
} 
}



}



@Component({
  selector: 'reopenopportunity-pop',
  templateUrl: './../../../../../../shared/components/single-table/sprint4Modal/reopenOpportunity-pop.html',
  styles:[`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }  
  `]
})
export class ReopenOpportunityPopComponent {
opportunityID='';
opportunityName='';
reopenData=[];
filterData=[];
panelOpenState:boolean;
isLoading =false;
datePipe = new DatePipe("en-US");
 constructor(public dialogRef: MatDialogRef<ReopenOpportunityPopComponent>,public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService,public service: DataCommunicationService) { 
 debugger;
console.log(data.data.objectRowData,'reopem');
  // this.reopenData=data.data.objectRowData;
  this.opportunityID= data.data[0].OpportunityId;
    this.reopenData= data.data.filter  ( (it)=> it.isCheccked= true );
    this.filterData= this.reopenData.filter( (it)=>it.isCheccked==true )
    console.log(this.opportunityID);


}

selectCheck(){
  this.filterData= this.reopenData.filter( (it)=>it.isCheccked==true )
}

 currDate= new Date().toLocaleDateString()
confirm(){

        
debugger;

      let body= { "OpportunityId" : this.opportunityID,
      "RequestedReOpenOn": (this.datePipe.transform( this.currDate ,"yyyy-MM-dd"))
   }
        this.isLoading = true
       this.allopportunities.reopenSave(body).subscribe(response => {
             if( !response.IsError){
             if(response.Message=="success"){
        this.allopportunities.displayMessageerror("Your request for reopen opportunity has been sent to helpdesk.");
          this.dialogRef.close('save');
             }
             else{
       this.allopportunities.displayMessageerror(response.Message);
             }
         }

        else{
       this.allopportunities.displayMessageerror(response.Message);
       }
       this.isLoading = false
     },
       err => {
       this.isLoading = false    
     this.allopportunities.displayerror(err.status);
  }
  );

}


}



