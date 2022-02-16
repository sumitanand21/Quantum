import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OrderService, OpportunitiesService, OrderAdvnHeaders, OrderAdvnNames } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Observable } from 'rxjs';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-vertical-owner-change',
  templateUrl: './vertical-owner-change.component.html',
  styleUrls: ['./vertical-owner-change.component.scss']
})
export class VerticalOwnerChangeComponent implements OnInit {
  //search Current Vertical Owner starts 
  verticalOwner: any = [];
  dataHeaderVerticalOwner = { name: 'Name', Id: 'Id' };
  selectedVerticalOwnerObj: any = { Id: "", Name: "", EmailID: "" };
  VerticalOwnerName: string = "";
  VerticalOwnerSysGuid: string = "";
  isSearchLoader = false;
  defaultpageNumber = 1;
  totalRecordCount = 0;
  OdatanextLink = null;
  pageSize = 10;
  TotalRecordCount = 0;
  disableInputField: boolean = true;
  disableSummit: boolean = true;

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
  //search Vertical Owner ends

  //Search btn starts
  VerticalOwnerTable: any = [{}];
  //Search btn ends
  //new vertical owner
  newVerticalOwner: any = [];
  newSelectedVerticalOwnerObj: any = { Id: "", Name: "", EmailID: "" };
  newVerticalOwnerName: string = '';
  newVerticalOwnerSysGuid: string = '';
  UpdatedData: any = [{}];
  changeOn = new DatePipe("en-US");

  Message1: string = '';
  Message: string = '';
  newTotalRecordCount = 0;
  newOdatanextLink = null;

  selectedOpp = false
  selectedName = [];
  OrderBookingId: string ='';

  AccId: string = '';
  AccountId: string = '';
  expandordertable: boolean = false;
  expandorder: boolean = false;

  searchorder: string = '';
  showtable: boolean = false;
  showScrolltable: boolean = false;
  showresults: boolean = false;
  showordertable: boolean = false;
  tableCount = 0;
  tableCount1 = 0;
  userArray = [
    { "index": 1, "Ordernumber": "AC123124323", "Ordername": "Transformation", "Vertical": "Information", "Currentverticalowner": "Satish Kaushik" },
    { "index": 2, "Ordernumber": "AC123124323", "Ordername": "Transformation", "Vertical": "Information", "Currentverticalowner": "Satish Kaushik" },
  ];
  headernonsticky1 = [{ name: "Ordernumber", title: "Order number" },
  { name: "OpportunityNumber", title: "Opportunity number" },
  { name: "AccountName", title: "Account name" },
  { name: "Vertical", title: "Vertical" },
  { name: "Currentverticalowner", title: "Current vertical owner" }

  ];
  userArray2 = [
    { "index": 1, "Ordernumber": "AC123124323", "Previousverticalowner": "Satish Kaushik", "Newverticalowner": "Rajpal Yadav", "Changedon": "23-Dec-2019" },
    { "index": 1, "Ordernumber": "AC123124323", "Previousverticalowner": "Satish Kaushik", "Newverticalowner": "Rajpal Yadav", "Changedon": "23-Dec-2019" },

  ]
  headernonsticky2 = [{ name: "Ordernumber", title: "Order number" },
  { name: "Previousverticalowner", title: "Previous vertical owner" },
  { name: "Newverticalowner", title: "New vertical owner" },
  { name: "Changedon", title: "Changed on" }
    // { name: "Status" }

  ];

  constructor(public service: DataCommunicationService, public orderService: OrderService, public projectService: OpportunitiesService, public dialog: MatDialog, ) { }


  ngOnInit() {
  }
  checktable() {
    if (this.searchorder != '') {
      this.showtable = true;
      this.showScrolltable = true;
    }
  }
  checkresultstable() {
    this.showresults = true;
  }
  onChange(event) {
    this.showordertable = !this.showordertable;
  }
  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }

  //Validations starts
  checkOrderNum() {
    this.disableSummit = true;
    if (this.searchorder) {
      this.disableSummit = false;
    }
  }

  getValidateUpdate() {
    if (this.VerticalOwnerTable.length > 1) {
      if (this.newVerticalOwnerName != '' && this.selectedName.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.newVerticalOwnerName != '') {
        return false;
      } else {
        return true;
      }
    }
  }
  //(this.VerticalOwnerTable>1)?((AccountId!='' && selectedName.length>0)?false:true):false;
  // validation ends

  //Current vertical owner starts
  getVerticalOwnerData(data) {
    this.isSearchLoader = true;
    this.orderService.getVerticalOwner(data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.verticalOwner = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.TotalRecordCount = data.TotalRecordCount;
      this.lookupdata.nextLink = '';
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
     // this.newVerticalOwnerName = '';
      this.isSearchLoader = false;
      console.log("DAAtaVSO", this.verticalOwner);
    },
      err => {
        this.verticalOwner = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  selectedVerticalOwner(selectedData) {
    this.OdatanextLink = null;
    if (Object.keys(selectedData).length > 0) {
      this.VerticalOwnerName = selectedData.Name;
      this.VerticalOwnerSysGuid = selectedData.Id;
      this.disableSummit = false;
      this.selectedVerticalOwnerObj = Object.assign({}, selectedData);
    } else {
      console.log("selectedDataSAP", selectedData);
      this.VerticalOwnerName = "";
      this.VerticalOwnerSysGuid = "";
      this.selectedVerticalOwnerObj = Object.assign({ Id: "", Name: "", EmailID: "" });
      if (this.searchorder) {
        this.disableSummit = false;
      } else {
        this.disableSummit = true;
      }
    }

  }

  advanceLookUpSearch(lookUpData) {
    let selecteddata = [];
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'CurrentVerticalOwner': {
        selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
        this.openadvancetabs('CurrentVerticalOwner', this.verticalOwner, selecteddata, lookUpData.inputVal)
        return
      }
      case 'Childorder': {
        selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
        this.openadvancetabs('Childorder', this.newVerticalOwner, selecteddata, lookUpData.inputVal)
        return
      }
    }

  }
  /****************Advance search popup starts**********************/

  openadvancetabs(controlName, initalLookupData, selecteddata, value): void {
    this.lookupdata.pageNo = this.defaultpageNumber;
    this.lookupdata.nextLink = this.OdatanextLink;
    this.lookupdata.TotalRecordCount = this.totalRecordCount;
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = OrderAdvnHeaders[controlName]
    this.lookupdata.lookupName = OrderAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = OrderAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = OrderAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = selecteddata;
    this.lookupdata.tabledata = initalLookupData;
    this.lookupdata.isLoader = false;



    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let controlNameLoaded = x.objectRowData.controlName;
      if (x.action == 'loadMore') {
        if (controlName == 'CurrentVerticalOwner') {
          this.getVerticalOwnerPushToLookUp(controlName, initalLookupData, selecteddata, value, x);
        } else if (controlName == 'Childorder') {
          this.getNewVerticalOwnerPushToLookUp(controlName, initalLookupData, selecteddata, value, x);
        }
      }
      else if (x.action == 'search') {
        this.OdatanextLink = null;
        if (controlName == 'CurrentVerticalOwner') {
          this.getVerticalOwnerOnSearch(controlName, initalLookupData, selecteddata, value, x);
        } else if (controlName == 'Childorder') {
          this.getNewVerticalOwnerOnSearch(controlName, initalLookupData, selecteddata, value, x);
        }
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      if (controlName == 'CurrentVerticalOwner') {
        this.OnCloseOfVerticalOwner(controlName, initalLookupData, selecteddata, value, result);
      } else if (controlName == 'Childorder') {
        this.OnCloseOfNewVerticalOwner(controlName, initalLookupData, selecteddata, value, result);
      }
    });
  }

  getVerticalOwnerPushToLookUp(controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getVerticalOwner(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
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

  getVerticalOwnerOnSearch(controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getVerticalOwner(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
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

  OnCloseOfVerticalOwner(controlName, lookUpData, selectedData, value, emittedevt) {

    this.OdatanextLink = null;
    if (emittedevt) {

      this.VerticalOwnerName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.VerticalOwnerSysGuid = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.disableSummit = false;
      this.selectedVerticalOwnerObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", EmailID: "" };
    } else {
      if (this.selectedVerticalOwnerObj.Name != this.VerticalOwnerName || this.selectedVerticalOwnerObj.Id != this.VerticalOwnerSysGuid) {
        this.VerticalOwnerName = "";
        this.VerticalOwnerSysGuid = "";
        this.disableSummit = true;
        this.selectedVerticalOwnerObj = { Id: "", Name: "", EmailID: "" };

      }
    }

  }
  //Current vertical owner ends

  //Search btn starts
  checkTableOnSearch() {

    let data = {
      "SearchText": this.searchorder,
      "RequestedPageNumber": 1,
      "PageSize": 5000,
      "OwnerId": this.VerticalOwnerSysGuid
    }
    this.orderService.getVerticalOwnerSearchBtn(data).subscribe((data: any) => {
      var VerticalOwnerTableObj = [];
      if (data && data.ResponseObject && data.ResponseObject.length > 0) {
        console.log("verticaldata", data);
        this.tableCount = data.TotalRecordCount;
        let temp = data.ResponseObject.map((vso, index) => {
          VerticalOwnerTableObj.push({
            "index": index + 1,
            "Ordernumber": (vso.OrderNumber) ? vso.OrderNumber : '-',
            "Ordername": (vso.OrderName) ? vso.OrderName : '-',
            "OpportunityNumber": (vso.OpportunityNumber) ? vso.OpportunityNumber : '-',
            "OpportunityName": (vso.OpportunityName)? vso.OpportunityName : '-',
            "Vertical": (vso.Vertical) ? vso.Vertical : '-',
            "AccountName": (vso.Account.Name) ? vso.Account.Name : '-',
            "Currentverticalowner": (vso.VerticalSalesOwner.OwnerName) ? vso.VerticalSalesOwner.OwnerName : '-',
            "Ischecked": false,
            "AccountId": (vso.Account.SysGuid) ? vso.Account.SysGuid : '-',
            "OrderBookingId": (vso.OrderBookingId) ? vso.OrderBookingId : '-'
          })
        });
        this.VerticalOwnerTable = [...VerticalOwnerTableObj]

        
        this.newVerticalOwnerName='';
        this.newVerticalOwnerSysGuid = '';
      this.newSelectedVerticalOwnerObj =Object.assign({ Id: "", Name: "", EmailID: "" });
        

        console.log("verticaltable", this.VerticalOwnerTable);
        if (this.VerticalOwnerTable.length > 1) {
          this.showScrolltable = true;
          this.showtable = false;
          this.showresults = false;
          this.expandorder = true;
          this.disableInputField = true;
          this.selectedName = [];

        } else {
          this.AccId = this.VerticalOwnerTable[0].AccountId;
          this.OrderBookingId = this.VerticalOwnerTable[0].OrderBookingId;
          this.disableInputField = false;
          console.log("accId", this.AccId)
          this.showtable = true;
          this.showScrolltable = false;
          this.showresults = false;
          this.expandorder = false;
          this.selectedName = [];
        }

      }

      else {
        this.VerticalOwnerTable = [{}];
      }
    }, err => {
      this.VerticalOwnerTable = [{}];
    })
  }
  //Search btn ends

  //new vertical owner starts
  isSearchLoaderVerticalOwner: boolean = false;
  getNewVerticalOwnerData(data) {

    this.isSearchLoaderVerticalOwner = true;
    this.orderService.getNewVerticalOwner(data.searchValue, this.pageSize, this.defaultpageNumber, this.AccId, null).subscribe(res => {
      console.log("newOwners", res);
      this.newVerticalOwner = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = '';
      // this.lookupdata.TotalRecordCount= (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.newTotalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.newOdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.Message = (res && res.Message) ? res.Message : '';
      this.isSearchLoaderVerticalOwner = false;
    }, err => {
      this.newVerticalOwner = [];
      this.newOdatanextLink = 0;
      this.newOdatanextLink = null;
      this.Message = '';
      this.isSearchLoaderVerticalOwner = false;
    });
  }

  newSelectedVerticalOwner(newSelectedData) {
    this.newOdatanextLink = null;
    if (Object.keys(newSelectedData).length > 0) {
      this.newVerticalOwnerName = newSelectedData.Name;
      this.newVerticalOwnerSysGuid = newSelectedData.SysGuid;
      this.newSelectedVerticalOwnerObj = Object.assign({}, newSelectedData);
    } else {
      this.newVerticalOwnerName = "";
      this.newVerticalOwnerSysGuid = "";
      this.newSelectedVerticalOwnerObj = Object.assign({ Id: "", Name: "", EmailID: "" });
    }
  }
  getNewVerticalOwnerPushToLookUp(controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getNewVerticalOwner(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.AccId, this.OdatanextLink).subscribe(res => {
      this.newOdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.newTotalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.newTotalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.Message = (res && res.Message) ? res.Message : '';
      this.isSearchLoader = false;
    },
      err => {
        this.newOdatanextLink = null;
        this.newTotalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.newTotalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.Message = '';
        this.isSearchLoader = false;
      });
  }
  getNewVerticalOwnerOnSearch(controlName, lookUpData, selectedData, value, emittedevt) {
    this.isSearchLoader = true;
    this.orderService.getNewVerticalOwner(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.AccId, this.OdatanextLink).subscribe(res => {
      this.newTotalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.newTotalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.Message = (res && res.Message) ? res.Message : '';
      this.isSearchLoader = false;
    },
      err => {
        this.newOdatanextLink = null;
        this.newTotalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.newTotalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.Message = '';
        this.isSearchLoader = false;
      });
  }
  OnCloseOfNewVerticalOwner(controlName, lookUpData, selectedData, value, emittedevt) {
    this.newOdatanextLink = null;
    if (emittedevt) {
      this.newVerticalOwnerName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.newVerticalOwnerSysGuid = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.newSelectedVerticalOwnerObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", EmailID: "" };
    } else {
      if (this.newSelectedVerticalOwnerObj.Name != this.newVerticalOwnerName || this.newSelectedVerticalOwnerObj.Id != this.newVerticalOwnerSysGuid) {
        this.newVerticalOwnerName = "";
        this.newVerticalOwnerSysGuid = "";
        this.newSelectedVerticalOwnerObj = { Id: "", Name: "", EmailID: "" };

      }
    }

  }
  //new vertical owner ends


  // update btn starts
  checkTableOnUpdate() {
    let OrderNums = [];
    if (this.VerticalOwnerTable.length == 1) {
      OrderNums[0] = this.OrderBookingId;
    } else {
      this.selectedName.map(orderDetails => {
        OrderNums.push(orderDetails["OrderBookingId"]);
      });
    }

    let data = {
      "UserGuid": this.newVerticalOwnerSysGuid,
      "OrderNumbers": OrderNums
    }
    this.orderService.getVerticalOwnerUpdateBtn(data).subscribe((data: any) => {
      console.log("update", data);

      if (!data.IsError) {
        if (data.ResponseObject) {
          this.Message1 = data.Message;
          var UpdatedDataObj = [];
          var date = new Date().toLocaleDateString();
          this.tableCount1 = this.selectedName.length;
          let temp = this.selectedName.map((res, index) => {
            // console.log("map",);
            console.log("map", res);
            UpdatedDataObj.push({
              "index": index + 1,
              "Ordernumber": (res.Ordernumber) ? res.Ordernumber : '',
              "Previousverticalowner": (res.Currentverticalowner) ? res.Currentverticalowner : '',
              "Newverticalowner": (this.newVerticalOwnerName)? this.newVerticalOwnerName: '',
              "Changedon": (this.changeOn.transform(date, "dd-MMM-yyyy"))
            })
          });
          this.UpdatedData = [...UpdatedDataObj];
          console.log("responedata", this.UpdatedData);
          let updated = [];
          if (this.VerticalOwnerTable.length == 1) {

            let tempvar = [];
            tempvar.push({
              "index": 1,
              "Ordernumber": (this.VerticalOwnerTable[0].Ordernumber) ? (this.VerticalOwnerTable[0].Ordernumber) : '',
              "Previousverticalowner": (this.VerticalOwnerTable[0].Currentverticalowner) ? this.VerticalOwnerTable[0].Currentverticalowner : '',
              "Newverticalowner": (this.newVerticalOwnerName) ? this.newVerticalOwnerName : '',
              "Changedon": (this.changeOn.transform(date, "dd-MMM-yyyy"))
            })
            this.UpdatedData = [...tempvar];
            this.showScrolltable = false;
            this.showresults = true;
          }
          this.showresults = true;
          if (this.Message1 != "success") {
            this.showresults = false;
            this.projectService.displayMessageerror(this.Message1);
          } else {
            this.showresults = true;
            this.Message1 = "Vertical owner has successfully changed";
            this.projectService.displayMessageerror(this.Message1);
            this.searchorder ='';
            this.showtable = false;
            this.showScrolltable = false;
            this.VerticalOwnerName = '';
            this.VerticalOwnerName = '';
            this.VerticalOwnerSysGuid ='';
            this.selectedVerticalOwnerObj ={Id: "", Name: "", EmailID: ""};
            this.VerticalOwnerTable = [{}];
            this.selectedName = [];
            this.newSelectedVerticalOwnerObj ={Id: "", Name: "", EmailID: ""};
            this.newVerticalOwner='';
            this.newVerticalOwnerName ='';
            this.newVerticalOwnerSysGuid ='';
          //   this.orderService.getVerticalOwnerSearchBtn(data).subscribe((data: any) => {
          //     for(let i=0; i < this.selectedName.length; i++){
          //       for(let j=0; j<data.ResponseObject.length; j++){
          //             if(this.selectedName[i].Ordernumber == data.ResponseObject[j].Ordernumber){
          //               this.selectedName[i] = data.ResponseObject[j];
          //               console.log("selected", this.selectedName);
          //             }
          //       }
          //     }
        
          // });
          }
        } else {
          this.showresults = false;
          this.UpdatedData = [{}];
        }
      }
    }, err => {
      this.orderService.displayerror(err.status);
      this.UpdatedData = [{}];

    })

  }
  //update btn ends

  //check box for autocomplete starts
  performTableChildAction(childActionRecieved): Observable<any> {
    switch (childActionRecieved.action) {
      case 'checkbox': {
        this.selectedOppName();
        return
      }
      case 'selectAll': {
        this.selectedOppName();
        return
      }
    }
  }

  selectedOppName() {

    this.selectedName = this.VerticalOwnerTable.filter((it) => (it.isCheccked ? 'true' : 'false') == 'true')
    console.log(this.selectedName)
    if (this.selectedName) {
      if (this.selectedName.length > 0) {
        for (let j = 0; j < this.selectedName.length; j++) {
          this.selectedName[j].index = j + 1;
        }
        this.selectedOpp = true
      }
      else {
        this.selectedOpp = false
      }
    }
    else {
      this.selectedOpp = false
    }
    this.AccountIdCheck(this.selectedName);
  }

  AccountIdCheck(selectedName) {
    let AccountIds = [];
    if (selectedName.length == 1) {
      this.AccId = (selectedName[0].AccountId) ? selectedName[0].AccountId : '';
      this.disableInputField = false;
    } else {
      AccountIds = selectedName.filter((obj, pos, selectedName) => {
        return selectedName.map(mapObj => {
          return mapObj.AccountId;
        }).indexOf(obj.AccountId) === pos;
      });
      if (AccountIds.length == 1) {
        this.AccId = AccountIds[0].AccountId;
        this.disableInputField = false;
      } else {
        this.AccId = '';
        this.disableInputField = true;
        if(this.selectedName.length>=1){
        this.projectService.displayMessageerror("Orders of Different Account Id's can not be seleted");
        }else{
          this.projectService.displayMessageerror("Select atleast one order");
        }
      }
    }
  }
  //check box ends

}