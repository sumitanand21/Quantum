
import { Component, OnInit,Inject } from '@angular/core';
import { DataCommunicationService, OrderService,OrderAdvndHeaders, OrderAdvndNames, ChildOrderAdvnHeaders, ChildOrderAdvnNames } from '@app/core';
import { OpportunitiesService } from '@app/core';
import { Router } from '@angular/router';
import { ConfirmPopUp} from '@app/modules/opportunity/pages/retag-order/retag-order.component';
import{ SubmitPopUp } from '@app/modules/opportunity/pages/retag-order/retag-order.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

//import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-order-amd-transfer',
  templateUrl: './order-amd-transfer.component.html',
  styleUrls: ['./order-amd-transfer.component.scss']
})
export class OrderAMDTransferComponent implements OnInit {
  
  selectedAdvisorName : any = [];
  selectedAdvisorOwnerObj = {  Name: "",Id: "", Ownername:"" };
  dataHeaderAmendmentOrder = { name: 'OrderNumber', Id:'OrderBookingId' };
  dataHeaderOneAmendmentOrder={ name: 'OrderNumber', Id:'OrderId'};

  selectedOneAdvisorOwnerObj = { Name: "", Id: "" ,Ownername: ""};
  selectedOneAdvisorName: any=[];
  
  //advisorOwner : any;
  favoriteSeason: string = "Order to Amendment";
  seasons: string[] = ['Order to Amendment', 'One Amendment to Other'];
  selection: string;

  // lookupdata
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
    pageNo: 1,
    nextLink: '',
    isLoader: false
  };
// amendment to order
  defaultpageNumber = 1;
  totalRecordCount = 0 ;
  OdatanextLink = null;
  pageSize = 10;
  MyOwned=true;
  isSearchLoader=false;
  orderBookingId ='';
  cancreateamendment: boolean;
  OrderTypeId: any;
  
 
  // defaultObject
  defaultAmend: any = {
    OrderbookingId: '',
    Startdate : '',
    Pricingid: '',
    Currencyid: '',
    Countryid: '',
    Accountid: '',
    SapCodeid: '',
  }    

  AmendmentObject  : any = Object.assign({}, this.defaultAmend )
  
  AmendmentOrderName: string = "";
  AmendmentOrderSysGuid: string = "";
  OneAmendmentOrderName: string = "";
  OneAmendmentOrderSysGuid: string = "";
  
  //  order to amend
  ChildOrder : any =[];
  dataHeaderChildOrder  = { name: 'OrderNumber', Id: 'OrderBookingId' };
  selectedChildOrderObj : any = { Id: "", Name: "", OrderOwner: "" };
  ChildOrderNumber: string = "";
  ChildOrderId: string = "";
  ChildOrderAccount: string = "";

  defaultOrderResponse: any = {
    OrderId: '',
    SapcodeId: '',
    AccountId: '',
    CountryId: '',
    CurrencyId: '',
    PricingId: '',
    Startdate: '',
    Ordertype:'',
  }
  OrderObject : any = Object.assign({}, this.defaultOrderResponse )
  Myowned: boolean = false;

  
    
  constructor(public service : DataCommunicationService,public projectService: OpportunitiesService,public snackBar:MatSnackBar,
  public orderservice: OrderService, public orderService: OrderService, public dialog: MatDialog, public router:Router ) { }

  ngOnInit() {
  }
  goback(){
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }

  toggleInit(){
    this.AmendmentOrderName="";
    this.OneAmendmentOrderName="";
    this.selectedChildOrderObj.Name="";
    this.selectedParentOrderObj.Name="";
    this.ChildOrderNumber="";
    this.ParentOrderNumber="";
    this.ChildOrderId="";
    this.ParentOrderId="";
    this.AmendmentOrderSysGuid="";
    this.OneAmendmentOrderSysGuid="";
    this.selection="";
  }

 
 // amendment to order
 getAmemdmentOrderData(data) {
    this.isSearchLoader = true;
    this.orderservice.getAmendmenttoOrder(data.searchValue, this.MyOwned, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.selectedAdvisorName = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
      console.log("DAAtaVSO",this.selectedAdvisorName);
    },
      err => {
        this.selectedAdvisorName = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
    }
    
    selectedRetag(selectedData)
    {
      this.OdatanextLink = null;
      this.OneAmendmentOrderName="";
      if (Object.keys(selectedData).length > 0) { 
        this.AmendmentOrderName = selectedData.OrderNumber ? selectedData.OrderNumber :'' ;
        this.AmendmentOrderSysGuid = selectedData.Id ? selectedData.Id : '';
        this.selectedAdvisorOwnerObj= Object.assign({}, selectedData);   
        this.getAmemdmentReferenceData();
        console.log("selecteddata:",selectedData);
      } 
      else {
        console.log("selectedDataSAP", selectedData);
        this.AmendmentOrderName = "";
        this.AmendmentOrderSysGuid = "";
        this.selectedAdvisorOwnerObj = Object.assign({  Name: "",Id: "", Ownername:"" });
      } 
    }

    // selecteddata
    selectedAmendmentOrder(selectedData) {
      // console.log("Isorderselected:",selectedData);
      this.OrderTypeId = selectedData.OrderTypeId;
      this.AmendmentOrderSysGuid = selectedData.Id;
      if(this.OrderTypeId == '184450005' ){
        let paydata={
          "Guid": this.AmendmentOrderSysGuid
        }
        this.orderservice.getStatusForRetag(paydata).subscribe( (res:any) => {
          console.log("retagwala",res);
          if(res && !res.IsError){
            if(res && res.ResponseObject){
              this.selectedRetag(selectedData);
            }else{
                  this.projectService.displayMessageerror("There is project tagged to this order “Order Number”, hence cannot be converted into amendment");
            }
          }   
        },err =>{
             this.projectService.displayerror(err.Message);
        });

      } else{
        this.selectedRetag(selectedData);
      }
    }

    // OneAmendmentother
  getAmemdmentReferenceData()
  {
     let amendment=
     {
      "SearchText": this.AmendmentOrderName,
      "MyOwned": true,  
      "PageSize": 1,     
      "RequestedPageNumber": 1,  
      "OdatanextLink": "" 
    }
   
    this.isSearchLoader = true;
    this.orderservice.getdataforAmendment(amendment).subscribe(
       (res:any) => {
         console.log("hellooo:",res);
      if(res && res.ResponseObject)
      {

        this.AmendmentObject.OrderbookingId = res.ResponseObject[0].OrderBookingId ? res.ResponseObject[0].OrderBookingId : '';
        this.AmendmentObject.Startdate = res.ResponseObject[0].StartDate ? res.ResponseObject[0].StartDate : '';
        this.AmendmentObject.Pricingid = res.ResponseObject[0].PricingTypeId ? res.ResponseObject[0].PricingTypeId : '';
        this.AmendmentObject.Currencyid = res.ResponseObject[0].Currency &&  res.ResponseObject[0].Currency.SysGuid ? res.ResponseObject[0].Currency.SysGuid : '';
        this.AmendmentObject.Countryid =res.ResponseObject[0].Country &&  res.ResponseObject[0].Country.SysGuid? res.ResponseObject[0].Country.SysGuid : '';   
        this.AmendmentObject.Accountid = res.ResponseObject[0].Account && res.ResponseObject[0].Account.SysGuid ? res.ResponseObject[0].Account.SysGuid : '';
        this.AmendmentObject.SapCodeid = res.ResponseObject[0].SapCode && res.ResponseObject[0].SapCode.SysGuid ? res.ResponseObject[0].SapCode.SysGuid : ''; 
      }    
      else
      {
        this.AmendmentObject = Object.assign({}, this.defaultAmend )
      }
    },
    err => {
      this.AmendmentObject = Object.assign({}, this.defaultAmend )
      this.service.loaderhome = false;
    }   );         
    console.log("reference1Api:",this.AmendmentObject);
  }

  //advanced:any=[];
  targetObject: any={};
  pagenumber=1;
  searchcount=10;
 

  getOneAmendmentOrderData(data) {

     this.targetObject={
      "SearchOrder": {
        "SearchText":data.searchValue,
          "page": this.pagenumber,
          "count": this.searchcount
      },
      "OrderBookingId": this.AmendmentObject.OrderbookingId,
      "StartDate": this.AmendmentObject.Startdate,
      "PricingTypeId": this.AmendmentObject.Pricingid,
      "Currency": {
          "SysGuid":  this.AmendmentObject.Currencyid
      },
      "Country": {
          "SysGuid":this.AmendmentObject.Countryid
      },
      "Account": {
          "SysGuid": this.AmendmentObject.Accountid
      },
      "SapCode": {
          "SysGuid": this.AmendmentObject.SapCodeid
      },
      "CanCreateAmendment":true
    }

    this.isSearchLoader = true;
    this.orderservice.getOneAmendmenttoOrder(this.targetObject).subscribe(res => {
      this.selectedOneAdvisorName = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount= (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;

      if(this.totalRecordCount==1){
        this.OneAmendmentOrderName= (res && res.ResponseObject[0].OrderNumber)?res.ResponseObject[0].OrderNumber:'';
        this.OneAmendmentOrderSysGuid= (res && res.ResponseObject[0].OrderId)?res.ResponseObject[0].OrderId:'';
      }
      console.log("DAAtaVSO",this.OneAmendmentOrderName);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
      console.log("DAAtaVSO",this.selectedOneAdvisorName);
    },
      err => {
        this.selectedOneAdvisorName = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  selectedOneAmendmentOrder(selectedData) {
    this.OdatanextLink = null;
   
    if (Object.keys(selectedData).length > 0) {
      this.OneAmendmentOrderName = selectedData.OrderNumber;
      this.OneAmendmentOrderSysGuid = selectedData.Id;
      this.selectedOneAdvisorOwnerObj= Object.assign({}, selectedData);   
      
    } 
    else {
      console.log("selectedDataSAP", selectedData);
      this.OneAmendmentOrderName = "";
      this.OneAmendmentOrderSysGuid = "";
      this.selectedOneAdvisorOwnerObj = Object.assign({Name: "", Id: "" ,Ownername: ""});
    }
  }

    // Advanced LookUp for amendments
   advanceLookUpSearch(lookUpData) {
      let selecteddata = [];
      let labelName = lookUpData.labelName;
      selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
      //this.openadvancetabs(labelName, this.selectedAdvisorName, selecteddata, lookUpData.inputVal)
        console.log("selecteteddata lookup",selecteddata);
      switch(labelName) {
          case 'Amendment' :{
            this.openadvancetabs('Amendment', this.selectedAdvisorName, selecteddata, lookUpData.inputVal)
            return
          }
          case 'TargetAmendment' :{
            this.openadvancetabs('TargetAmendment', this.selectedOneAdvisorName, selecteddata, lookUpData.inputVal)
            return
          }
        }
     }

       // amendments adv look
       openadvancetabs(controlName, initialLookupData,selecteddata, value): void {
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.nextLink= this.OdatanextLink;
        this.lookupdata.TotalRecordCount= this.totalRecordCount;
       this.lookupdata.controlName = controlName
       this.lookupdata.headerdata = OrderAdvndHeaders[controlName]
       this.lookupdata.lookupName = OrderAdvndNames[controlName]['name']
       this.lookupdata.isCheckboxRequired = OrderAdvndNames[controlName]['isCheckbox']
       this.lookupdata.Isadvancesearchtabs = OrderAdvndNames[controlName]['isAccount']
       this.lookupdata.inputValue = value;
       this.lookupdata.selectedRecord = selecteddata;
       this.lookupdata.tabledata = initialLookupData;
       this.lookupdata.isLoader = false;
  
       const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
         width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
         data: this.lookupdata
       });
  
       dialogRef.componentInstance.modelEmiter.subscribe((x) => {
         let controlNameLoaded = x.objectRowData.controlName;
         if(x.action == 'loadMore') {
          if(controlName =='Amendment'){
           this.getAmendmentOrderPushToLookUp(controlName, initialLookupData,selecteddata, value, x);
          }
         else if(controlName =='TargetAmendment') 
         {
          this.getOneAmendmentOrderPushToLookUp(controlName, initialLookupData,selecteddata, value, x);
          } // else if(controlName == 'ChildOrder' ) {
        //   this.getChildOrderPushToLookUp ( controlName, initialLookupData, selecteddata, value, x);
        // }   else if(controlName == 'ParentOrder' ) {
        //   this.getParentOrderPushToLookUp ( controlName, initialLookupData, selecteddata, value, x);
        // }
        }
         else if(x.action == 'search') {
           this.OdatanextLink = null;
           if (controlName == 'Amendment') {
             this.getAmendmentOrderOnSearch(controlName, initialLookupData,selecteddata, value, x);
           }
           else if(controlName == 'TargetAmendment') 
           {
            this.getOneAmendmentOrderOnSearch(controlName, initialLookupData,selecteddata, value, x);
          } // else if (controlName =='ChildOrder')  {
          //   this.getChildOrderOnSearch(controlName, initialLookupData, selecteddata, value, x);
          // }  else if( controlName == 'ParentOrder' )  {
          //   this.getParentOrderOnSearch(controlName, initialLookupData, selecteddata, value, x);
          // }
         }  
        
       });
    
       dialogRef.afterClosed().subscribe(result => {
         this.totalRecordCount = 0;
           if (controlName == 'Amendment') {
           this.OnCloseOfAmendmentOrder(controlName, initialLookupData,selecteddata, value,result);
           }
           if (controlName == 'TargetAmendment') {
            this.OnCloseOfOneAmendmentOrder(controlName, initialLookupData,selecteddata, value,result);
             }  // else if (controlName == 'ChildOrder') {
            //   this.OnCloseOfChildOrder( controlName, initialLookupData, selecteddata, value, result );
            // } else if ( controlName == 'ParentOrder' ) {
            //   this.OnCloseOfParentOrder( controlName, initialLookupData, selecteddata, value, result );
            // }
           });
  
     }
  
     getAmendmentOrderPushToLookUp(controlName, lookUpData, selectedData, value, emittedevt){
      this.isSearchLoader = true;
      this.orderservice.getAmendmenttoOrder(emittedevt.objectRowData.searchKey, this.MyOwned,this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
        this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.lookupdata.pageNo = emittedevt.currentPage;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      },
        err => {
          this.OdatanextLink = null;
          this.totalRecordCount = 0;
          this.lookupdata.pageNo = this.defaultpageNumber;
          this.lookupdata.TotalRecordCount = this.totalRecordCount;
          this.lookupdata.nextLink = this.OdatanextLink;
          this.lookupdata.tabledata = [];
          this.lookupdata.isLoader = false;
          this.isSearchLoader = false;
        });
  
    }
  
    getAmendmentOrderOnSearch( controlName, lookUpData, selectedData, value, emittedevt){
      this.isSearchLoader = true;
      this.orderservice.getAmendmenttoOrder(emittedevt.objectRowData.searchKey, this.MyOwned,this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      },
        err => {
          this.OdatanextLink = null;
          this.totalRecordCount = 0;
          this.lookupdata.pageNo = this.defaultpageNumber;
          this.lookupdata.TotalRecordCount = this.totalRecordCount;
          this.lookupdata.nextLink = null;
          this.lookupdata.tabledata = [];
          this.lookupdata.isLoader = false;
          this.isSearchLoader = false;
        });
    }
  
    OnCloseOfAmendmentOrder(controlName, lookUpData, selectedData, value, emittedevt)
    {
      this.OdatanextLink = null;
      if (emittedevt) {
  
        this.AmendmentOrderName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
        this.AmendmentOrderSysGuid = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
        this.selectedAdvisorOwnerObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Ownername:"" };
      } else {
        if (this.selectedAdvisorOwnerObj.Name != this.AmendmentOrderName || this.selectedAdvisorOwnerObj.Id != this.AmendmentOrderSysGuid) {
          this.AmendmentOrderName = "";
          this.AmendmentOrderSysGuid = "";
          this.selectedAdvisorOwnerObj = { Name: "", Id: "" ,Ownername: "" };
        }
      }
    }
  
    //AdvancedLookUpfor-one amendment to other
  
  
    getOneAmendmentOrderPushToLookUp(controlName, lookUpData, selectedData, value, emittedevt){
      this.isSearchLoader = true;
      this.orderservice.getOneAmendmenttoOrder(this.targetObject).subscribe(res => {
        this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.lookupdata.pageNo = emittedevt.currentPage;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      },
        err => {
          this.OdatanextLink = null;
          this.totalRecordCount = 0;
          this.lookupdata.pageNo = this.defaultpageNumber;
          this.lookupdata.TotalRecordCount = this.totalRecordCount;
          this.lookupdata.nextLink = this.OdatanextLink;
          this.lookupdata.tabledata = [];
          this.lookupdata.isLoader = false;
          this.isSearchLoader = false;
        });
    }
  
    getOneAmendmentOrderOnSearch( controlName, lookUpData, selectedData, value, emittedevt){
      this.isSearchLoader = true;
      const body = {
        ...this.targetObject
      };
      body.SearchOrder.SearchText=emittedevt.objectRowData.searchKey;
      this.orderservice.getOneAmendmenttoOrder(body).subscribe(res => {
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      },
        err => {
          this.OdatanextLink = null;
          this.totalRecordCount = 0;
          this.lookupdata.pageNo = this.defaultpageNumber;
          this.lookupdata.TotalRecordCount = this.totalRecordCount;
          this.lookupdata.nextLink = null;
          this.lookupdata.tabledata = [];
          this.lookupdata.isLoader = false;
          this.isSearchLoader = false;
        });
    }
    OnCloseOfOneAmendmentOrder(controlName, lookUpData, selectedData, value, emittedevt)
    {
      this.OdatanextLink = null;
      if (emittedevt) {
        this.OneAmendmentOrderName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
        this.OneAmendmentOrderSysGuid = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
        this.selectedOneAdvisorOwnerObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Ownername:"" };
      } else {
        if (this.selectedOneAdvisorOwnerObj.Name != this.OneAmendmentOrderName || this.selectedOneAdvisorOwnerObj.Id != this.OneAmendmentOrderSysGuid) {
          this.OneAmendmentOrderName = "";
          this.OneAmendmentOrderSysGuid = "";
          this.selectedOneAdvisorOwnerObj = { Name: "", Id: "" ,Ownername: "" };
        }
      }
    }

       // child order
  getChildOrderData(data){
    this.isSearchLoader = true;
    this.orderService.getOrderNumber(data.searchValue, this.Myowned, this.pageSize, this.defaultpageNumber, this.OdatanextLink ).subscribe( res => {
      this.ChildOrder = ( res && res.ResponseObject ) ? res.ResponseObject : [];
      console.log("child",this.ChildOrder);
      this.totalRecordCount = ( res && res.TotalRecordCount ) ? res.TotalRecordCount : 0;
      this.OdatanextLink = ( res && res.OdatanextLink ) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.ChildOrder = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  selectedChildOrder(selectedData) {
    this.OrderTypeId = selectedData.OrderTypeId ? selectedData.OrderTypeId: '';
    this.ChildOrderId = selectedData.Id ? selectedData.Id: '' ;
    if(this.OrderTypeId == '184450005' ){
      let paydata={
        "Guid": this.ChildOrderId
      }
      this.orderservice.getStatusForRetag(paydata).subscribe( (res:any) => {
        console.log("retagwala",res);
        if(res && !res.IsError){
          if(res && res.ResponseObject){
            this.selectedchildRetag(selectedData);
          }else{
                this.projectService.displayMessageerror("There is project tagged to this order “Order Number”,  hence cannot be converted into amendment");
          }
        }   
      },err =>{
           this.projectService.displayerror(err.Message);
      });
  
    } else{
      this.selectedchildRetag(selectedData);
    }

  }
  

     selectedchildRetag(selectedData){
      this.ParentOrderNumber = null;
      this.OdatanextLink = null;
      console.log("number3",selectedData);
      if (Object.keys(selectedData).length > 0) {
        // let selctedData={
        //   Id:selectedData.OrderBookingId?selectedData.OrderBookingId:"", 
        //   Name: selectedData.OrderNumber?selectedData.OrderNumber:"",
        //   OrderOwner: selectedData.OrderOwner?selectedData.OrderOwner:""
        // }
        this.selectedChildOrderObj = selectedData;
        this.ChildOrderNumber = this.selectedChildOrderObj.OrderNumber;
        console.log("number",this.ChildOrderNumber);
        this.ChildOrderId = this.selectedChildOrderObj.OrderBookingId;
        this.getorderData();
      } else {
        console.log("selectedDataS", selectedData);
        this.ChildOrderNumber = "";
        this.ChildOrderId = "";
        this.selectedChildOrderObj = { Id: "", Name: "", OrderOwner: ""};
      }
     }
     

  // binding datas of child order
  getorderData(){
    let orderdata = { 
    "SearchText": this.selectedChildOrderObj.Name,  // entered text from lookup
    "MyOwned": false,  // true for Amendments   /  flase for source orders
    "PageSize": 1,     // requested record count
    "RequestedPageNumber": 1,  
    "OdatanextLink": ""
    }
    this.isSearchLoader = true;
    this.orderService.getOrderDetail(orderdata).subscribe(
      (data: any) => {
        this.isSearchLoader = false;
        
        if ( data && data.ResponseObject )  {
           this.OrderObject.Ordertype = data.ResponseObject[0].OrderType ? data.ResponseObject[0].OrderType : '';
           console.log("kirtitype",this.OrderObject.Ordertype)
          this.OrderObject.OrderId = data.ResponseObject[0].OrderBookingId ? data.ResponseObject[0].OrderBookingId : '';
          this.OrderObject.SapcodeId = data.ResponseObject[0].SapCode && data.ResponseObject[0].SapCode.SysGuid ? data.ResponseObject[0].SapCode.SysGuid : '';
          this.OrderObject.AccountId = data.ResponseObject[0].Account && data.ResponseObject[0].Account.SysGuid ? data.ResponseObject[0].Account.SysGuid : '';
          this.OrderObject.CountryId = data.ResponseObject[0].Country && data.ResponseObject[0].Country.SysGuid ? data.ResponseObject[0].Country.SysGuid : '';
          this.OrderObject.CurrencyId = data.ResponseObject[0].Currency && data.ResponseObject[0].Currency.SysGuid ? data.ResponseObject[0].Currency.SysGuid : '';
          this.OrderObject.PricingId = data.ResponseObject[0].PricingTypeId ? data.ResponseObject[0].PricingTypeId : '';
          this.OrderObject.Startdate = data.ResponseObject[0].StartDate ? data.ResponseObject[0].StartDate : '';
        } else {
                  this.OrderObject = ( this.defaultOrderResponse )
        }
        console.log("data",this.OrderObject);
      },  err =>  {
                    this.OrderObject = ( this.defaultOrderResponse )
                    this.isSearchLoader = false;
      }    
    );
  }

  // parent order request
  parentObject : Object={};
  page = 1 ;
  count = 10 ;
  Orderparent : any =[];
  dataHeaderParentOrder = { name: 'OrderNumber', Id: 'OrderId'};
  selectedParentOrderObj : any = { Id: "", Name: "", OrderOwner: "" };
  ParentOrderNumber: string ="";
  ParentOrderId: string ="";
  getParentOrder(number) {
     this.parentObject = {
      "SearchOrder": {
        "SearchText": number.searchValue,
          "page": this.page,
          "count": 10,
      },
      "OrderBookingId": this.OrderObject.OrderId,
      "StartDate": this.OrderObject.Startdate,
      "PricingTypeId": this.OrderObject.PricingId,
      "Currency": {
          "SysGuid": this.OrderObject.CurrencyId
      },
      "Country": {
          "SysGuid": this.OrderObject.CountryId
      },
      "Account": {
          "SysGuid": this.OrderObject.AccountId
      },
      "SapCode": {
          "SysGuid": this.OrderObject.SapcodeId
      },
      "CanCreateAmendment":true
    }
    console.log("sauravpayload1", this.parentObject)
    this.isSearchLoader = true;
    this.orderService.getParentOrderNumber(this.parentObject).subscribe( res => {
      this.Orderparent = ( res && res.ResponseObject ) ? res.ResponseObject : [];
      console.log(this.Orderparent);
      this.count = ( res && res.TotalRecordCount ) ? res.TotalRecordCount : 0;
      if ( this.count == 1) {
        this.ParentOrderNumber = ( res.ResponseObject[0].OrderNumber ) ? res.ResponseObject[0].OrderNumber : "" ;
        this.ParentOrderId = ( res.ResponseObject[0].OrderId ) ? res.ResponseObject[0].OrderId : "" ;
       // this.selectedParentOrderObj = (res.ResponseObject) ? res.ResponseObject : { Id: "", Name: "", OrderOwner:""} ;
      }
      this.OdatanextLink = ( res && res.OdatanextLink ) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },  err => {
            this.Orderparent = [];
            this.count = 0;
            this.OdatanextLink = null;
            this.isSearchLoader = false;
    });
  }
  selectedParentOrder(selectedData) {
    console.log("parent",selectedData)
    this.isSearchLoader = true;
    this.OdatanextLink = null;
    if (Object.keys(selectedData).length > 0) {
      this.ParentOrderNumber = selectedData.OrderNumber;
      this.ParentOrderId = selectedData.Id;
      this.selectedParentOrderObj = (selectedData);
      this.isSearchLoader = false;
    } else {
      this.ParentOrderNumber = "";
      this.ParentOrderId = "";
      this.selectedParentOrderObj = { Id: "", Name: "", OrderOwner:""};
      this.isSearchLoader = false;
    }
  }
    // advanced lookup for orders
    advancelookupSearch(lookUpData) {
      let selecteddata = [];
      let labelName = lookUpData.labelName;
      selecteddata = (Object.keys( lookUpData.selectedData).length > 0 ) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
        switch(labelName) {
          case 'Childorder' : {
            this.OpenAdvancetabs( 'ChildOrder', this.ChildOrder, selecteddata, lookUpData.inputVal)
            return
          }
          case 'ParentOrder' : {
            this.OpenAdvancetabs( 'ParentOrder', this.Orderparent, selecteddata, lookUpData.inputVal)
            return
          }
        }
      }

     // orders adv look
     OpenAdvancetabs(controlName, initialLookupData, selecteddata, value): void {
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.controlName = controlName;
      this.lookupdata.headerdata = ChildOrderAdvnHeaders[controlName];
      this.lookupdata.lookupName = ChildOrderAdvnNames[controlName]['name'];
      this.lookupdata.isCheckboxRequired = ChildOrderAdvnNames[controlName]['isCheckbox'];
      this.lookupdata.Isadvancesearchtabs = ChildOrderAdvnNames[controlName]['isAccount'];
      this.lookupdata.inputValue = value;
      this.lookupdata.selectedRecord = selecteddata;
      this.lookupdata.tabledata = initialLookupData;
      this.lookupdata.isLoader = false;
      
      const dialogRef = this.dialog.open( AdvancelookuptabsComponent, {
        width: this.service.setHeaderPixes( this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
        data: this.lookupdata
      });
      dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let controlNameLoaded = x.objectRowData.controlName;
      if(x.action == 'loadMore' ) {
        if(controlName == 'ChildOrder' ) {
          this.getChildOrderPushToLookUp ( controlName, initialLookupData, selecteddata, value, x);
        }   else if(controlName == 'ParentOrder' ) {
          this.getParentOrderPushToLookUp ( controlName, initialLookupData, selecteddata, value, x);
        }
      }
      else if (x.action == 'search' ) {
        this.OdatanextLink = null;
        if (controlName =='ChildOrder')  {
          this.getChildOrderOnSearch(controlName, initialLookupData, selecteddata, value, x);
        }  else if( controlName == 'ParentOrder' )  {
          this.getParentOrderOnSearch(controlName, initialLookupData, selecteddata, value, x);
        }
      }

    });
    dialogRef.afterClosed().subscribe( result => {
      this.totalRecordCount = 0;
      if (controlName == 'ChildOrder') {
        this.OnCloseOfChildOrder( controlName, initialLookupData, selecteddata, value, result );
      } else if ( controlName == 'ParentOrder' ) {
        this.OnCloseOfParentOrder( controlName, initialLookupData, selecteddata, value, result );
      }
    });
}
   

  // child order lookups
  getChildOrderPushToLookUp( controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getOrderNumber (emittedevt.objectRowData.searchKey, this.Myowned, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe ( res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    }, err => {
      this.OdatanextLink = null;
      this.totalRecordCount = 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    });
  }
  
  getChildOrderOnSearch ( controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getOrderNumber (emittedevt.objectRowData.searchKey, this.Myowned, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe ( res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;  
  }, err => {
    this.OdatanextLink = null;
    this.totalRecordCount = 0;
    this.lookupdata.pageNo = this.defaultpageNumber;
    this.lookupdata.TotalRecordCount = this.totalRecordCount;
    this.lookupdata.nextLink = null;
    this.lookupdata.tabledata = [];
    this.lookupdata.isLoader = false;
    this.isSearchLoader = false;
   });
  }
  
    OnCloseOfChildOrder( controlName, lookUpData, selectedData, value, emittedevt ) {
       this.OdatanextLink = null;
      if (emittedevt) {
        this.ChildOrderNumber = ( emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OrderNumber : "";
        this.ChildOrderId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
        this.selectedChildOrderObj = ( emittedevt.selectedData.length > 0) ?(emittedevt.selectedData[0]) : {  Id: "", Name: "", OrderOwner: "" };
    } else {
      if ( this.selectedChildOrderObj.Name != this.ChildOrderNumber || this.selectedChildOrderObj.Id != this.ChildOrderId) {
        this.ChildOrderNumber = "";
        this.ChildOrderId = "";
        this.selectedChildOrderObj = { Id: "", Name: "",  OrderOwner: ""};
      }
    }
  
  }
  // parent lookup
  getParentOrderPushToLookUp( controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getParentOrderNumber(this.parentObject).subscribe ( res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.count = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.count;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.lookupdata.isLoader = false;
    }, err => { 
      this.OdatanextLink = null;
      this.count = 0;
      this.lookupdata.pageNo = this.page;
      this.lookupdata.TotalRecordCount = this.count;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    });
  }
  getParentOrderOnSearch(  controlName, lookUpData, selectedData, value, emittedevt ) {
    this.isSearchLoader = true;
    this.parentObject = {
      "SearchOrder": {
        "SearchText": emittedevt.objectRowData.searchKey,
          "page": this.page,
          "count": this.count
      },
      "OrderBookingId": this.OrderObject.OrderId,
      "StartDate": this.OrderObject.Startdate,
      "PricingTypeId": this.OrderObject.PricingId,
      "Currency": {
          "SysGuid": this.OrderObject.CurrencyId
      },
      "Country": {
          "SysGuid": this.OrderObject.CountryId
      },
      "Account": {
          "SysGuid": this.OrderObject.AccountId
      },
      "SapCode": {
          "SysGuid": this.OrderObject.SapcodeId
      },
      "CanCreateAmendment":true
    }
  //emittedevt.objectRowData.searchKey;
    this.orderService.getParentOrderNumber( this.parentObject ).subscribe ( res => {
      this.count = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.page;
      this.lookupdata.TotalRecordCount = this.count;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;  
  }, err => {
    this.OdatanextLink = null;
    this.count = 0;
    this.lookupdata.pageNo = this.page;
    this.lookupdata.TotalRecordCount = this.count;
    this.lookupdata.nextLink = null;
    this.lookupdata.tabledata = [];
    this.lookupdata.isLoader = false;
    this.isSearchLoader = false;
  });
  }
  OnCloseOfParentOrder( controlName, lookUpData, selectedData, value, emittedevt ) {
    this.OdatanextLink = null;
    if (emittedevt) {
      this.ParentOrderNumber = ( emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Number : "";
      this.ParentOrderId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedParentOrderObj = ( emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : {  Id: "", Name: "", OrderOwner: ""};
  } else {
          if ( this.selectedParentOrderObj.Name != this.ParentOrderNumber || this.selectedParentOrderObj.Id != this.ParentOrderId) {
          this.ParentOrderNumber = "";
          this.ParentOrderId = "";
          this.selectedParentOrderObj = { Id: "", Name: "", OrderOwner: "" };
          }
        }
    }

  //convertamendment-to-order
  convertamendmentorder(){
    let amendmentdata={}
    if(this.favoriteSeason=="Order to Amendment")
    {
        amendmentdata={
        "ConversionType" :1,
        "OldOpportunityClass": this.selection,
        "PrimaryOrderNumber":  this.ChildOrderId,
        "SelectedOrderNumber": this.ParentOrderId,
      }
    }
    else if(this.favoriteSeason=="Amendment to Order"){
      amendmentdata={
        "ConversionType" :3,
        "PrimaryOrderNumber":  this.AmendmentOrderSysGuid,
      }
    }
    else if(this.favoriteSeason=="One Amendment to Other"){
      amendmentdata={
        "ConversionType" :2,
        "OldOpportunityClass": "",
        "PrimaryOrderNumber":  this.AmendmentOrderSysGuid,
        "SelectedOrderNumber": this.OneAmendmentOrderSysGuid,
      }
    } 
    this.service.loaderhome =  true;
    console.log("pay",this.favoriteSeason);
    this.orderservice.getamendmentorderconvert(amendmentdata).subscribe(
      (data: any) => {
      this.service.loaderhome = false;
      //console.log("data",data);

      if(data && !data.IsError){
        if(data && data.ResponseObject)  {
          if(this.favoriteSeason=="Order to Amendment")
            this.projectService.displayMessageerror("Order "+data.ResponseObject.OldOrderNumber+" is converted to amendment "+data.ResponseObject.NewOrderNumber);
          else if(this.favoriteSeason=="Amendment to Order")
            this.projectService.displayMessageerror("Amendment "+data.ResponseObject.OldOrderNumber+" is converted to order "+data.ResponseObject.NewOrderNumber);
          else if(this.favoriteSeason=="One Amendment to Other")
          this.projectService.displayMessageerror("Amendment "+data.ResponseObject.OldOrderNumber+" is converted to amendment "+data.ResponseObject.NewOrderNumber);
        }   
        else
           this.projectService.displayMessageerror("This conversion can not be done");
          }
      else{
        this.projectService.displayMessageerror(data.Message); }
      },
      error =>{
        console.log(error);
      }
    );
    this.AmendmentOrderName="";
    this.OneAmendmentOrderName="";
    this.selectedChildOrderObj.Name="";
    this.selectedParentOrderObj.Name="";
    this.ChildOrderNumber="";
    this.ParentOrderNumber="";
    this.ChildOrderId="";
    this.ParentOrderId="";
    this.AmendmentOrderSysGuid="";
    this.OneAmendmentOrderSysGuid="";
  }
    public openConfirmPopup() {
    const dialogRef = this.dialog.open(ConfirmPopUp, {
      width: '450px',
      
      data: {
        
        currentOrderType: this.OrderObject.Ordertype,
        newOrderType: this.selection
      }

    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res == 'YES') {
        let body = {
          "ConversionType" :1,
        "OldOpportunityClass": this.selection,
        "PrimaryOrderNumber":  this.ChildOrderId,
        "SelectedOrderNumber": this.ParentOrderId,
        }
        this.orderService.getamendmentorderconvert(body).subscribe(res => {
          if (res && !res.IsError && res.ResponseObject) {
            const SuccessdialogRef = this.dialog.open(SubmitPopUp, {
              width: '800px',
              data: {
                retagedOrder: res
              }
            });

            SuccessdialogRef.afterClosed().subscribe(res => {

              this.router.navigate(['/helpdesk/orderBookings/orderTransfer']);

            })
          } else {

          }
        }, err => {

        });

      }
    });

  }

 


}

