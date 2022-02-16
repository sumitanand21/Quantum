import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { renewalService, OpportunitiesService, linkedLeadNames, linkedLeadsHeaders,renewalheader } from '@app/core/services';
import { DatePipe } from "@angular/common";
export interface DialogData {
  oppNumber: string;

}


@Component({
  selector: 'app-renewal-opportunity',
  templateUrl: './renewal-opportunity.component.html',
  styleUrls: ['./renewal-opportunity.component.scss']
})
export class RenewalOpportunityComponent implements OnInit {
    datePipe = new DatePipe("en-US");
   searchOppo='';
  accountId: string = "";
  accountName: string = "";
  AccountnameArray = [];
  header = { name: "Name", Id: "SysGuid" };
  more_clicked;
  all_lead: boolean;
  open_lead: boolean;
  myopen_lead: boolean;
  allopportunity = [];
  toggleTransition: boolean = false;
  changedTxt: string = 'Show more';
    tableTotalCount: number = 0;
  accountNameArray = [];
  orderNumber: string = "";
  oppNameNo: string = "";
  responseObjectArr = [];
  accontNameObjj = { name: 'Name', Id: 'SysGuid' };
  result;
  primOrderId: string = "";
  primOppId: string = "";
  oppNum: string = "";
  action;
  oppNumber: string;
  isLoading: boolean = false;
  userGuid;
  accNameFlag = false;
  isSearchLoader = false;


  wiproContactArray = [];
AllContactsRequestbody = {
    "PageSize": this.projectService.sendPageSize || 10,
    "RequestedPageNumber": this.projectService.sendPageNumber || 1,
    "OdatanextLink": "",
    // "FilterData": this.projectService.sendConfigData || []
  }

   filterConfigData = {
       
    Order: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Name: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    OpportunityID: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Owner: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Pricingtype: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Sap: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Startdate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    enddate: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ProposalType: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    isFilterLoading:false
    
  };
 

  constructor(
    
    public router: Router,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    private renewalsvc: renewalService,
    private snackBar: MatSnackBar,
    public projectService: OpportunitiesService,
    private EncrDecr: EncrDecrService) { }

    paginationPageNo = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": ""
}
 
  paginationPageNoSearch = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": ""
}


getRoleGainApi(rec,opportunityId){
    this.isLoading = true
      this.projectService.roleApi().subscribe(response => {
      if( !response.IsError){
         this.projectService.setSession( 'IsGainAccessRole', response.ResponseObject.IsGainAccessRole?response.ResponseObject.IsGainAccessRole:false)
         this.projectService.setSession( 'IsMarketingFunctionAndRole', response.ResponseObject.IsMarketingFunctionAndRole?response.ResponseObject.IsMarketingFunctionAndRole:false)
         this.projectService.setSession( 'IsHelpRoleFullAccess', response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false)
this.projectService.setSession('opportunityId',opportunityId?opportunityId:'')
       

        
      //  if( response.ResponseObject.FullAccess ){
       
      //  }
  //     //  else{
  //   this.projectService.clearSession("smartsearchData");
  //   this.projectService.setSession('orderId','');
  //  this.projectService.setSession('IsAmendment', false);
  //  this.projectService.setSession('BFMNavagationFlag',false);
     this.getRoleAPi(rec,opportunityId)

    
      //  }
      }
  else{
     this.projectService.displayMessageerror(response.Message);
  } 
 }
    ,
       err => {
        this.projectService.displayerror(err.status);
  }
  );;
}


DaAPi(){
   this.projectService.DaAPi().subscribe(response => {
      if( !response.IsError){
     
       }
    else{
    
    } }
    ,  err => {
  });
 }
getRoleAPi(rec,oppId){
  
           this.projectService.accessModifyApi(rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'',localStorage.getItem('userEmail')).subscribe(res => {
    if( !res.IsError){
         this.isLoading = false
        if(res.ResponseObject.FullAccess){
    this.projectService.setSession('roleObj',res.ResponseObject); 
                 this.projectService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
                 this.projectService.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
       this.projectService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
       this.projectService.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
   

       this.projectService.clearSession("smartsearchData");
   this.projectService.setSession('orderId','');
   this.projectService.setSession('IsAmendment', false);
   this.projectService.setSession('BFMNavagationFlag',false);
  //  this.projectService.setSession('opportunityName',rec.objectRowData[0].OpportunityName?rec.objectRowData[0].OpportunityName:'')
this.projectService.setSession('AdvisorOwnerId',rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'')
  
this.projectService.setSession('opportunityName',rec.objectRowData[0].Name? this.getSymbol( rec.objectRowData[0].Name) :'')
// this.projectService.setSession('opportunityId',rec.objectRowData[0].Opportunity?rec.objectRowData[0].Opportunity:'')
this.projectService.setSession('opportunityId',oppId?oppId:'')
 
//  this.projectService.setSession('opportunityId',rec.objectRowData[0].opportunityId?rec.objectRowData[0].opportunityId:'')
  //  this.projectService.setSession('IsAppirioFlag',rec.objectRowData[0].IsAppirioFlag);
      this.DaAPi()
      this.isLoading = true;
      this.router.navigate(['/opportunity/opportunityview']); 

        }

       else{
           this.projectService.setSession('roleObj',res.ResponseObject); 
 
         this.projectService.setSession('AdvisorOwnerId',rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'')
 
       this.projectService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
       this.projectService.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
       this.projectService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
       this.projectService.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
 this.projectService.setSession('opportunityName',rec.objectRowData[0].Name? this.getSymbol( rec.objectRowData[0].Name ): '')
// this.projectService.setSession('opportunityId',rec.objectRowData[0].Opportunity?rec.objectRowData[0].Opportunity:'')
this.projectService.setSession('opportunityId',oppId?oppId:'')

       this.projectService.clearSession("smartsearchData");
   this.projectService.setSession('orderId','');
   this.projectService.setSession('IsAmendment', false);
   this.projectService.setSession('BFMNavagationFlag',false);

   
          this.projectService.setSession('accessData',res.ResponseObject);
  //  this.projectService.setSession('IsAppirioFlag',rec.objectRowData[0].IsAppirioFlag);
          this.DaAPi()
          this.isLoading = true;
          this.router.navigate(['/opportunity/opportunityview']); 

      }
      }
  else{
     this.projectService.displayMessageerror(res.Message);
  } 
 }
    ,
       err => {
       
    this.projectService.displayerror(err.status);
  }
  );
 
 
}



  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });
  }




  selectedAccObj: any = { SysGuid: "", Name: "" };
  detailsId: string = "";
  details: string = "";


  
  getNewTableData(event) {
  debugger;
  console.log("event",event);
  if (event.action == 'pagination') {
    this.paginationPageNo.PageSize = event.itemsPerPage;
    this.paginationPageNo.RequestedPageNumber = event.currentPage;
    this.paginationPageNoSearch.PageSize =event.itemsPerPage  

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
        this.search(this.paginationPageNo);

      }
  } else if (event.action == 'search') {
    this.paginationPageNo = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    };
  }

}

searchData =false
SearchtableData(paginationPageNo){
 this.searchData= true

   if(this.searchData){
 
        this.searchOppo =''
          this.renewal =[]
      this.tableTotalCount=0
      }
    this.paginationPageNo = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": ""
}
 this.search(paginationPageNo) 
}
  search(paginationPageNo) {
    debugger;
    this.service.loaderhome = true;
    this.primOrderId = "";
    this.primOppId = "";

    console.log(this.orderNumber);

  
    if (this.accountId) {
      this.accNameFlag = false;
      this.projectService.GetBFMApprovedOrderList(this.oppNameNo, this.orderNumber, this.accountId,
     paginationPageNo.RequestedPageNumber,paginationPageNo.PageSize,   this.searchOppo   ).subscribe((res) => {

        if (!res.error) {
          if (res.ResponseObject != null && res.ResponseObject.length > 0) {

            this.service.loaderhome = false;
            this.responseObjectArr = res.ResponseObject;
            this.tableTotalCount = res.TotalRecordCount;
         const startIndex = ((paginationPageNo.RequestedPageNumber - 1) * paginationPageNo.PageSize) + 1    
     var tableCollection   =    this.responseObjectArr.map((item, index) => {
               
               return {
               "index":startIndex + index,

                "Order": item.OrderNumber?item.OrderNumber:'NA',
                "Name": item.OpportunityName? this.getSymbol(  item.OpportunityName ) :'NA',
                "ProposalType": item.OpportunitySource?item.OpportunitySource:'NA',
                "Owner": item.OrderOwner?item.OrderOwner:'NA',
                "Sap": item.SapName?item.SapName:'NA',
                "Startdate": item.EngamentStartDate?item.EngamentStartDate:'NA',
                "enddate": item.EngagementEndDate?item.EngagementEndDate:'NA',
                "OpportunityID": item.OpportunityNumber?item.OpportunityNumber:'NA',
                "OrderId": item.OrderId,
                "Pricingtype": item.PricingType?item.PricingType:'NA',
                "Opportunity": item.OpportunityId




              }

            }
         

            )

if(paginationPageNo.RequestedPageNumber  == 1){
        this.renewal = []
       this.renewal = tableCollection
     }
     else{
      this.renewal = this.renewal.concat(tableCollection)  
     
     }

            
          }

          else {
            this.tableTotalCount = 0;
            this.renewal = [{}];
            this.projectService.displayMessageerror('Data Not Found');
            this.service.loaderhome = false;

          }

        }

        else {
          this.renewal = [{}];
          this.projectService.displayMessageerror('Error Occured');
          this.service.loaderhome = false;
        }

      }, (err) => {
        this.projectService.displayerror(err.status);
        this.service.loaderhome = false;
      })
    }
    else {
      this.accNameFlag = true;
      this.service.loaderhome = false;
    }

  }


OpportunityId =''
  createpop() {
    debugger
    if(this.orderArray.length>0 ){
    this.service.loaderhome = true;
    let numRen = 1;
    let OwnerName = localStorage.getItem('upn');
    let OwnerEmailId = localStorage.getItem('userEmail').replace(/"/g, "");
       
    this.projectService.getRenewalOpp( this.order ,this.primOrderId, this.primOppId, numRen,this.userGuid,OwnerName,OwnerEmailId).subscribe((res) => {
      this.result = res.ResponseObject;
      this.oppNum = (this.result) ? this.result.OpportunityNumber : "";

      if (!res.IsError) {
        this.OpportunityId =  res.ResponseObject.OpportunityId?res.ResponseObject.OpportunityId:''
        if (this.oppNum != "" && this.oppNum != null) {
          this.service.loaderhome = false;
          const dialogRef = this.dialog.open(createpopupcomponent,
            {
              width: '350px',
              data: { oppNumber: this.oppNum }
            });

             dialogRef.afterClosed().subscribe(result => {
   if(result=='ok'){
      this.getRoleGainApi(this.selectedCheckData,this.OpportunityId);
        return
   }
 });

        }

        else {

          this.service.loaderhome = false;
          this.projectService.displayMessageerror('Sorry,could not create/increment opportunity');
        }

      }


      else {
        this.projectService.displayMessageerror(res.Message);   
        console.log('its coming');
        this.service.loaderhome = false;
        // this.projectService.displayMessageerror('Please select Data');
      }




    }, (err) => {
      this.projectService.displayerror(err.status);
      this.service.loaderhome = false;
    });

    }
else
{
this.projectService.displayMessageerror('Please select Data');
}
  }


  // goBack() {
  //   window.history.back();
  // }
  goBack() {
    let path = this.projectService.getSession('path');
    if(path ){
      sessionStorage.removeItem('path');
      this.router.navigate([path]);
    }
  }
  renewal = [];

  SelectedAccountArray: any = []
  selectedAccNameObj: any = { SysGuid: "", Name: "" };
  // selectedAccNameObjTemp: any = { SysGuid: "", Name: "" };

  errorHandling(response, array) {
    debugger;
    if (!response.IsError) {
      if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
        this[array] = response.ResponseObject
      }
      else {
        this[array] = []
      }
    }
    else {
      this[array] = [];
      this.projectService.displayMessageerror(response.Message);
    }
  }

  openadvancetabs(controlName, initalLookupData, value, selectedArray): void {
    debugger;

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    // this.lookupdata.tabledata =[]
    this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      debugger
      console.log(x)
      if (x.action == 'loadMore') {
        var dialogData = {}
     

      if (controlName == 'account') {
          dialogData = {


            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',

            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
            "OdatanextLink": this.lookupdata.nextLink

          }
        }




        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          debugger;
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {
        this.lookupdata.nextLink = ''
        var dialogData = {}
      

       if (controlName == 'account') {
           dialogData = {


            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',

            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
            "OdatanextLink": this.lookupdata.nextLink

          }
        }







        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }






  SelectedAccountNameValue(SelectedAccount: any) {
    debugger
    this.accNameFlag = false;
   
if(Object.keys(SelectedAccount).length){ 
    this.selectedAccNameObj = SelectedAccount;
    this.accountName = this.selectedAccNameObj.Name;
    this.accountId = this.selectedAccNameObj.SysGuid;

    this.SelectedAccountArray = []
    this.SelectedAccountArray.push(this.selectedAccNameObj);

    this.SelectedAccountArray[0].Id = this.selectedAccNameObj.SysGuid;

    console.log("Selected Account", this.selectedAccNameObj);
  }
  else{
    
this.selectedAccNameObj = {SysGuid: "", Name: ""};
this.accountName= '';
this.accountId= '';
this.SelectedAccountArray=[]
  }
  }

  AppendParticularInputFun(selectedData, controlName) {
    debugger
    if (selectedData) {
      if (selectedData.length > 0) {

        if (controlName == 'account') {
          this.accNameFlag = false;
          this.selectedAccNameObj = selectedData[0];
          this.accountName = this.selectedAccNameObj.Name;
          this.accountId = this.selectedAccNameObj.SysGuid;
          // this.selectedAccNameObjTemp.Name = this.selectedAccNameObj.Name;
          // this.selectedAccNameObjTemp.SysGuid = this.selectedAccNameObj.SysGuid;

          this.SelectedAccountArray = []
          this.SelectedAccountArray.push(this.selectedAccNameObj);
          this.SelectedAccountArray[0].Id = this.selectedAccNameObj.SysGuid;
        }


      }
    }
  }

  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false

  };


  //  (this.selectedAllianceNameObj && Object.keys(this.selectedAllianceNameObj).length)
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'account': {
        return this.SelectedAccountArray.length > 0 ? this.SelectedAccountArray : []
      }
    }
  }


  advanceLookUpSearch(lookUpData) {
    debugger;
    console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {

      case 'accountArr': {

        this.openadvancetabs('account', this.AccountnameArray, lookUpData.inputVal, this.SelectedAccountArray)

        return;
      }


    }
  }

  wiproLinkedAGP(data) {
    debugger;
    let body =
      {
        "SearchText": data.searchValue ? data.searchValue : '',
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": this.lookupdata.nextLink
      }



    this.projectService.getAccountSearchData(body).subscribe(response => {
      this.AccountnameArray = response.ResponseObject
      this.AccountnameArray.forEach(x => {
        (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
      })
      this.lookupdata.TotalRecordCount = response.TotalRecordCount

      this.errorHandling(response, 'AccountnameArray')
    },
      err => {
        this.projectService.displayerror(err.status);
      }
    );
  }

order;

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
  ngOnInit() {
   

      if(localStorage.getItem('accountRoute') == '1' ){
    var name =    (sessionStorage.getItem('accountName')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip') : ''
this.selectedAccNameObj = { SysGuid: "(sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : ''" , 
Name: (sessionStorage.getItem('accountName')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip') : '' }
this.accountId =  (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
this.accountName = this.getSymbol(name)?this.getSymbol(name):'';
}
else{
  this.accountId = ''
  this.accountName  = ''
  this.selectedAccNameObj = { SysGuid: '' , Name: ''}
}

    this.userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    console.log('userguidfound', this.userGuid);
  }


orderArray=[]

  getAllContactsList(reqBody, isConcat, isSearch, isLoader) {
     this.search(this.AllContactsRequestbody);
  }

  getTableFilterData(tableData,start,pageNo,pageSize): Array<any> {
 
    if (tableData) {
      if (tableData.length > 0) {
 
         var tableCollection =   tableData.map((item, index) => {
              return {
                "index": index + 1,
                "Order": item.OrderNumber?item.OrderNumber:'NA',
                "Name": item.OpportunityName? this.getSymbol( item.OpportunityName ) :'NA',
                "ProposalType": item.OpportunitySource?item.OpportunitySource:'NA',
                "Owner": item.OrderOwner?item.OrderOwner:'NA',
                "Sap": item.SapName?item.SapName:'NA',
                "Startdate": item.EngamentStartDate?item.EngamentStartDate:'NA',
                "enddate": item.EngagementEndDate?item.EngagementEndDate:'NA',
                "OpportunityID": item.OpportunityNumber?item.OpportunityNumber:'NA',
                "OrderId": item.OrderId,
                "Pricingtype": item.PricingType?item.PricingType:'NA',
                "Opportunity": item.OpportunityId  
              }
           

            }


            )

           if(pageNo == 1){
        this.renewal = []
       this.renewal = tableCollection
     }
     else{
      this.renewal = this.renewal.concat(tableCollection)  
     
     }


       
      } else {
        return [{}]
      }
    } else {
      return [{}]
    }
  }
  GetAppliedFilterData(data) {

    return {
    "OrderNumbers": this.service.pluckParticularKey(data.filterData.filterColumn['Order'], 'name'),
    "OrderStatus": "",
    "OpportunityNumbers":this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityID'], 'name'),
    "OpportunityNames": this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
    "AccountId": this.accountId ,
    "OwnerIds":this.service.pluckParticularKey(data.filterData.filterColumn['Owner'], 'name'),
    "PricingTypes":this.service.pluckParticularKey(data.filterData.filterColumn['Pricingtype'], 'id'),
    "SapCustomerCodes":this.service.pluckParticularKey(data.filterData.filterColumn['Sap'], 'name'),
    // "StartDates":this.service.pluckParticularKey(data.filterData.filterColumn['Startdate'], 'name'),
    // "EndDates":this.service.pluckParticularKey(data.filterData.filterColumn['enddate'], 'name'),
    "PropsalTypes":this.service.pluckParticularKey(data.filterData.filterColumn['ProposalType'], 'id'),
    "AccountIds": "",
    "page": this.AllContactsRequestbody.RequestedPageNumber,
    "count": this.AllContactsRequestbody.PageSize,
    "SearchText": this.searchOppo,
     "SortBy":this.service.pluckParticularKey(renewalheader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]?this.service.pluckParticularKey(renewalheader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[],
    "IsDesc":(data.filterData.sortColumn!='')?!data.filterData.sortOrder:false,
   "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
    "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,
    "EndFromDate": this.startFilterDate1?(this.datePipe.transform(this.startFilterDate1, "yyyy-MM-dd")):undefined,
    "EndToDate ":  this.endFilterDate1?(this.datePipe.transform(this.endFilterDate1, "yyyy-MM-dd")):undefined
}
  }

    GetAppliedRenewalFilterData(data) {

    return {
    "OrderNumbers": this.service.pluckParticularKey(data.filterData.filterColumn['Order'], 'name'),
    "OpportunityNumbers":this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityID'], 'name'),
    "OpportunityNames": this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
    "OwnerIds":this.service.pluckParticularKey(data.filterData.filterColumn['Owner'], 'name'),
    "PricingTypes":this.service.pluckParticularKey(data.filterData.filterColumn['Pricingtype'], 'id'),
    "SapCustomerCodes":this.service.pluckParticularKey(data.filterData.filterColumn['Sap'], 'name'),
    // "StartDates":this.service.pluckParticularKey(data.filterData.filterColumn['Startdate'], 'name'),
    // "EndDates":this.service.pluckParticularKey(data.filterData.filterColumn['enddate'], 'name'),
    "PropsalTypes":this.service.pluckParticularKey(data.filterData.filterColumn['ProposalType'], 'id'),
     "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
    "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,
    "EndFromDate": this.startFilterDate1?(this.datePipe.transform(this.startFilterDate1, "yyyy-MM-dd")):undefined,
    "EndToDate ":  this.endFilterDate1?(this.datePipe.transform(this.endFilterDate1, "yyyy-MM-dd")):undefined

   }
  }

  CallListDataWithFilters(data) {

    console.log(data)
    let reqparam = this.GetAppliedFilterData({ ...data })
    this.projectService.filterLisingFinderApi(reqparam).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqparam.count;
          const start = ((reqparam.page - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
         this.getTableFilterData(res.ResponseObject,start,reqparam.page,reqparam.count)
          this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink?res.OdatanextLink:''
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.renewal = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.renewal = [{}]
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
if(data.filterData.headerName=='enddate' || data.filterData.headerName=='Startdate'){

   }


    else{
    if (isServiceCall) {
      let useFulldata = {
        headerName:headerName,
        SearchText: data.filterData.columnSerachKey || data.filterData.columnSerachKey===0 || data.filterData.columnSerachKey==='0'?data.filterData.columnSerachKey:'',
        RequestedPageNumber:this.filterConfigData[headerName].PageNo,
        PageSize:10,
        OdatanextLink:this.filterConfigData[headerName].NextLink,
      }


      this.projectService.getrenewalListConfigData({ ...data,useFullData:useFulldata, columnFIlterJson: this.GetAppliedRenewalFilterData(data), isService:true , "OrderNumber": this.orderNumber?this.orderNumber:'',"OrderStatus": "","OpportunityNumber": this.oppNameNo?this.oppNameNo:'',
         "OpportunityName": this.oppNameNo?this.oppNameNo:'',"AccountId": this.accountId?this.accountId:'', searchOppo:this.searchOppo?this.searchOppo:'',
         userGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')  }).subscribe(res => {
        this.filterConfigData.isFilterLoading=false;
        this.filterConfigData[headerName] = {
          data:(isConcat)?this.filterConfigData[headerName]["data"].concat(res.ResponseObject):res.ResponseObject,
             recordCount: res.TotalRecordCount,
             NextLink:  res.OdatanextLink?res.OdatanextLink:'',
             PageNo:res.CurrentPageNumber?res.CurrentPageNumber:res.PageSize
          }
        
         
            data.filterData.filterColumn[headerName].forEach(res => {
          let index;
          if (headerName == 'Startdate') {
            index = this.filterConfigData[headerName].data.findIndex(x => x.Name == res.Name);
          } 
         
         else if (headerName == 'enddate') {
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
}}

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
        let headerName = data.filterData.headerName
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
    
    startFilterDate=''
    endFilterDate=''
    startFilterDate1=''
    endFilterDate1=''

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
          this.getAllContactsList(this.AllContactsRequestbody, true, false, false);


}
selectedCheckData;
  performTableChildAction(childActionRecieved) {
    debugger;
     this.searchData =false;
      this.startFilterDate=''
    this.endFilterDate=''
    this.startFilterDate1=''
    this.endFilterDate1=''

    if(childActionRecieved.filterData.filterColumn.Startdate.length>0){
     this.startFilterDate = childActionRecieved.filterData.filterColumn.Startdate?childActionRecieved.filterData.filterColumn.Startdate[0].filterStartDate.toLocaleString():''
 this.endFilterDate =  childActionRecieved.filterData.filterColumn.Startdate?childActionRecieved.filterData.filterColumn.Startdate[0].filterEndDate.toLocaleString():''
    }
 if(childActionRecieved.filterData.filterColumn.enddate.length>0){
  this.startFilterDate1 = childActionRecieved.filterData.filterColumn.enddate?childActionRecieved.filterData.filterColumn.enddate[0].filterStartDate.toLocaleString():''
 this.endFilterDate1 =  childActionRecieved.filterData.filterColumn.enddate?childActionRecieved.filterData.filterColumn.enddate[0].filterEndDate.toLocaleString():''
  }
    console.log("performtablechild", childActionRecieved.objectRowData[0]);
    var actionRequired = childActionRecieved;
    this.primOrderId = childActionRecieved.objectRowData[0]?childActionRecieved.objectRowData[0].OrderId:'';
    this.primOppId = childActionRecieved.objectRowData[0]?childActionRecieved.objectRowData[0].Opportunity:'';
    this.order =   childActionRecieved.objectRowData[0]?childActionRecieved.objectRowData[0].Order:'' ;
    this.orderArray   =  childActionRecieved.objectRowData?childActionRecieved.objectRowData:[]

 
switch (actionRequired.action) {

       case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
       case "Order": {
             this.selectedCheckData = childActionRecieved
           return
     }
         case 'ClearAllFilter': {
        this.clearAllFilter(childActionRecieved.pageData.itemsPerPage);
        return
      }

      
      case 'Name': {
        this.getRoleGainApi(childActionRecieved,childActionRecieved.objectRowData[0].Opportunity?childActionRecieved.objectRowData[0].Opportunity:'');
        return
      }
      case 
      "columnSearchFilter":{
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

       case 'search':
      {
        this.searchOppo= actionRequired.objectRowData
          this.AllContactsRequestbody.RequestedPageNumber=1
        this.AllContactsRequestbody.PageSize = childActionRecieved.pageData.itemsPerPage
       this.paginationPageNo = {
      "PageSize": actionRequired.pageData.itemsPerPage,
      "RequestedPageNumber":  1,
      "OdatanextLink": ""
    }

     if (this.service.checkFilterListApiCall(childActionRecieved)) {
        // filter api call
        this.CallListDataWithFilters(childActionRecieved);
             return;
        
      } else {
        // list api call
  //  this.tableData(this.paginationPageNo);
    this.search(this.paginationPageNo);

             return;
     
      }
            //  return;

    }
  }

  }


}


@Component({
  selector: 'createpopup',
  templateUrl: './create-opportunity.html',
})

export class createpopupcomponent {
  constructor(public router: Router, public dialogRef: MatDialogRef<createpopupcomponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  ngOnInit() { }
  redirect() {
this.dialogRef.close('ok')

    //  this.router.navigate(['/opportunity/allopportunity']);
  }
}