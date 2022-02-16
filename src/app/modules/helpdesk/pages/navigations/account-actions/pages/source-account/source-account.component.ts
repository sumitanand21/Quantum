import { Component, OnInit, OnDestroy } from '@angular/core';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountService } from '@app/core/services/account.service'
import { AccountListService, AccountHeaders, AccountAdvNames } from '@app/core/services/accountList.service';
import { ErrorMessage, DataCommunicationService } from '@app/core';
// import {  } from '../../../../../../core/services/accountList.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
@Component({
  selector: 'app-source-account',
  templateUrl: './source-account.component.html',
  styleUrls: ['./source-account.component.scss']
})
export class SourceAccountComponent implements OnInit, OnDestroy {

  sourceAccountData = [];
  newverticalOwner: any = [];
  selectedVerticalOwnerObj: any = [];
  isActivityGroupSearchLoading: boolean = false;
  newVerticalOwnerName: string = "";
  ownerSysGuid: string = "";
  isLoading: boolean = false;
  isSearchLoader:boolean = false;
  newVerticalOwnerSysGuid;
  // advanceLookUpSearch(e){
  //   return
  // }
  dataHeaderVerticalOwner = { name: 'Name', Id: 'Id' }
  sourceAccountTableRequest =
  {
    "SearchText": "",
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "Guid": this.ownerSysGuid,  //Vertical Guid
    "OdatanextLink": " "
  }

  selectedAdvisorName = [];
  selectedSourceVerticalObj = {};
  SourceVertical: any;
  allData:any;
  srcAccountData:any; 


  // filterConfigData = {
  //   AccountName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // MergeRequestName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // RequestedDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // RequestedBy: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  //   isFilterLoading: false
  // };

  tableTotalCount = 5;
  lookupdata = {
    tabledata: [
      { Name: '14 Nov Account Request', Number: 'ACC000023826' },
      { Name: 'acc modif flow test 4:06PM kkn', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },

    ],
    recordCount: 10,
    headerdata: [{ title: 'Name', name: 'Name' }, { title: 'Number', name: 'Number' }],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: ''
  };
  sendAllianceToAdvance = [];
  AllianceToAdvanceSelected = [];
  constructor(public accservive: DataCommunicationService, public AccountService: AccountService, private masterService: S3MasterApiService, public accountListServ: AccountListService, public errorMessage: ErrorMessage,public dialog: MatDialog) { }

  ngOnInit() {
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.reqDetails(reqSysGuid);    
  }
  ngOnDestroy() {
    // this.sendDatatoSave();
    // this.accountListServ.sendparentaccountdetails(filteredData);
  }
  // ngOnChanges(){
  //   this.sendDatatoSave();
  // }
  reqDetails(reqSysGuid) {
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListServ.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          if (details.ResponseObject.SourceAccounts) {
            this.srcAccountData = this.getTableFilterData(details.ResponseObject.SourceAccounts);
            this.sourceAccountData = this.srcAccountData;
            this.accountListServ.changeSourceData(this.srcAccountData)            
            // this.accountListServ.sourceAccountData = this.srcAccountData;
          }
          if(details.ResponseObject.Vertical && details.ResponseObject.Vertical.Id){
            localStorage.setItem("verticalDataId", JSON.stringify(details.ResponseObject.Vertical.Id));
            this.sourceAccountTableRequest.Guid = (details.ResponseObject.Vertical)?details.ResponseObject.Vertical.Id: ""; 
            this.newVerticalOwnerName = (details.ResponseObject.Vertical)?details.ResponseObject.Vertical.Name: ""; 
            this.GetAllSrcAccTableData(this.sourceAccountTableRequest, true); 
          } else {
            this.accountListServ.sourceAccountData = [{}];
          }    
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
  sendDatatoSave(){
    let filteredData = [];
    this.accountListServ.sourceAccountData.filter((res: any) => {
      if (res.isCheccked) {
        filteredData.push(res.SysGuid);
        this.allData={
          vertical: this.selectedVerticalOwnerObj,
          checkedData:filteredData
        } 
        // this.accountListServ.sendparentaccountdetails(allData);
        this.accountListServ.changeSourceData(this.allData);
        // localStorage.setItem("mergeDataSave", JSON.stringify(this.allData));
      } else{
        filteredData = [];
      }
    })
  }
  // newgetVerticalOwnerData(data) {
  //   this.newverticalOwner = [];
  //   this.isActivityGroupSearchLoading = true;
  //   this.masterService.SearchVerticalAndSBU(data.searchValue).subscribe((res: any) => {
  //     this.isActivityGroupSearchLoading = false;
  //     // console.log("verticalby sbuid ", res.ResponseObject);
  //     if (!res.IsError && res.ResponseObject) {
  //       // if (this.userdat.searchFieldValidator(this.contactName3Obj)) {
  //       res.ResponseObject.map(data => {
  //         this.newverticalOwner.push(data.Vertical);
  //       });
  //       // this.newverticalOwner = res.ResponseObject;
  //       console.log(this.newverticalOwner);
  //       console.log(res.ResponseObject);
  //       // } else {

  //       // }
  //     }
  //   })
  // }
  newgetVerticalOwnerData(data) {
    // this.newverticalOwner = [];
    this.isActivityGroupSearchLoading = true;
    this.masterService.SearchVerticalAndSBU(data.searchValue).subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      // console.log("verticalby sbuid ", res.ResponseObject);
      if (!res.IsError && res.ResponseObject) {
        // if (this.userdat.searchFieldValidator(this.contactName3Obj)) {
       this.newverticalOwner= res.ResponseObject.map(data => {
         return  data.Vertical;
        });
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        // this.newverticalOwner = res.ResponseObject;
        // console.log(this.newverticalOwner);
        // console.log(res.ResponseObject);
        // } else {

        // }
      }
    })
  }

  newselectedVerticalOwner(verticalObj: Object) {
    // let data = verticalObj;
    // this.sourceAccountTableRequest.Guid = (data?data.Id:"")
    this.selectedVerticalOwnerObj = Object.keys(verticalObj).length ? verticalObj : { Guid: "", Name: "" };
    if (verticalObj && typeof verticalObj === 'object' && Object.keys(verticalObj).length) {
      this.newVerticalOwnerName = this.selectedVerticalOwnerObj.Name;
      this.ownerSysGuid = this.selectedVerticalOwnerObj.Id;
      this.sourceAccountTableRequest.Guid = this.selectedVerticalOwnerObj.Id;
      localStorage.setItem("verticalDataId", JSON.stringify(this.selectedVerticalOwnerObj.Id));
      this.GetAllSrcAccTableData(this.sourceAccountTableRequest, true);
    }
    else {
      this.newVerticalOwnerName = "";
      this.ownerSysGuid = "";
      this.accountListServ.sourceAccountData = [{}];
    }
  }
  TablePagination(data) {
    this.sourceAccountTableRequest.RequestedPageNumber = this.sourceAccountTableRequest.RequestedPageNumber + 1;
    this.GetAllSrcAccTableData(this.sourceAccountTableRequest, true);
  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.sourceAccountTableRequest.PageSize = event.itemsPerPage;
      this.sourceAccountTableRequest.RequestedPageNumber = event.currentPage;
      // if (this.userdat.checkFilterListApiCall(event)) {

      //filter api call
        this.CallListDataWithFilters(event, true);
      // } else {

      //list api call
      // this.GetAllSrcAccTableData(this.sourceAccountTableRequest, true);
      // }

    }
    //  else if (event.action === 'search') {
    //   this.sourceAccountTableRequest = {
    //     'PageSize': event.itemsPerPage,
    //     'RequestedPageNumber': 1,
    //     'OdatanextLink': '',
    //     "SearchText": "",
    //     Guid: this.ownerSysGuid
    //   };
    // }
  }
  GetAllSrcAccTableData(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountListServ.sourceMergeDetails(reqBody)
      .subscribe(async (srcAccList) => {

        if (!srcAccList.IsError) {
          this.isLoading = false;
          if (srcAccList.ResponseObject.length > 0) {
            this.accountListServ.sourceAccountData = [];
            const ImmutableObject = Object.assign({}, srcAccList);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            srcAccList.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (srcAccList.OdatanextLink) {
              this.sourceAccountTableRequest.OdatanextLink = srcAccList.OdatanextLink;
            }
            this.sourceAccountTableRequest = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.sourceAccountTableRequest.OdatanextLink = srcAccList.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.accountListServ.sourceAccountData.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.accountListServ.sourceAccountData.splice(this.accountListServ.sourceAccountData.indexOf(res), 1);
              });
              this.accountListServ.sourceAccountData = this.accountListServ.sourceAccountData.concat(this.getTableFilterData(srcAccList.ResponseObject));
              if(this.srcAccountData){
                this.srcAccountData.map((res)=>{
                  this.accountListServ.sourceAccountData.map((res1, ind)=>{
                    if(res.SysGuid == res1.SysGuid){
                      this.accountListServ.sourceAccountData[ind].isCheccked = true;
                      console.log(this.accountListServ.sourceAccountData, "91");
                    }
                  })
                })
              }  
              console.log("this.accountListServ.sourceAccountData 125", this.accountListServ.sourceAccountData)
            } else {
              this.accountListServ.sourceAccountData = this.getTableFilterData(srcAccList.ResponseObject);
              console.log("this.accountListServ.sourceAccountData 128", this.accountListServ.sourceAccountData)
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Id);
            this.tableTotalCount = srcAccList.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.accountListServ.sourceAccountData = [{}];
          }

        } else {
          this.isLoading = false;
          this.accountListServ.sourceAccountData = [{}];
          if (reqBody.RequestedPageNumber > 1)
            this.sourceAccountTableRequest.RequestedPageNumber = this.sourceAccountTableRequest.RequestedPageNumber - 1;
        }
      },
      error => {
        this.isLoading = false;
      });
  }
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((srcAccData => {
          return {
            index: srcAccData.index,
            AccountNumber: srcAccData.Number || '',
            AccountName: this.getSymbol(srcAccData.Name) || '',
            AccountOwner: (srcAccData.Owner && srcAccData.Owner.FullName) ? srcAccData.Owner.FullName : '',
            Region: (srcAccData.Region && srcAccData.Region.Name) ? srcAccData.Region.Name : '',
            AccountClassification: (srcAccData.Classification && srcAccData.Classification.Value) ? srcAccData.Classification.Value : '',
            Isittop66: "No",//(srcAccData.Status && srcAccData.Status.Value) ? srcAccData.Status.Value : '',
            Hassubaccounts: srcAccData.HasSubAccounts ? "Yes" : "No",//(srcAccData.Status && srcAccData.Status.Value) ? srcAccData.Status.Value : '',
            SysGuid: srcAccData.SysGuid,
            isCheccked: false
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }

  performTableChildAction(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'DeleteCal': {
        // this.dialog.open(DeleteMergePop, {
        //   width: '250px',
        //   data: {name: this.name, animal: this.animal}
        // });
        break;
      }
      case 'checkBox': {
        if(this.sourceAccountData.length > 0){
          // this.sourceAccountData.filter((res)=>{
          for(let i=0; i<=this.sourceAccountData.length; i++){
            if(actionRequired.objectRowData.SysGuid != this.sourceAccountData[i].SysGuid && actionRequired.objectRowData.isCheccked){
              this.sourceAccountData.push(actionRequired.objectRowData);
              break;
            } else if(!actionRequired.objectRowData.isCheccked && actionRequired.objectRowData.SysGuid == this.sourceAccountData[i].SysGuid){
              this.sourceAccountData.splice(i, 1);
              break;
            }          
          }
        }else if(actionRequired.objectRowData.isCheccked){
          this.sourceAccountData.push(actionRequired.objectRowData);
        } 
        console.log(this.sourceAccountData, "291");
        this.accountListServ.changeSourceData(this.sourceAccountData)
        return;
      }
      case 'sortHeaderBy': {
        this.sourceAccountTableRequest.OdatanextLink = '';
        this.sourceAccountTableRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'search': {
        this.sourceAccountTableRequest.OdatanextLink = '';
        this.sourceAccountTableRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
    }
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListServ.getFilterList(reqparam, false, 'sourceAccMergeDetails').subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res);
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(resp => {
            if (!resp.index) {
              resp.index = i;
              i = i + 1;
            }
          });
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.accountListServ.sourceAccountData = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.accountListServ.sourceAccountData = [...this.accountListServ.sourceAccountData, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.accountListServ.sourceAccountData = this.getTableFilterData(res.ResponseObject);
          }
          // this.accountListServ.sourceAccountData = this.getTableFilterData(res.ResponseObject);
          this.sourceAccountTableRequest.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.accountListServ.sourceAccountData = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.accountListServ.sourceAccountData = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'Guid' : this.sourceAccountTableRequest.Guid ? this.sourceAccountTableRequest.Guid : '' ,
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.sourceAccountTableRequest.PageSize : 10,
      'RequestedPageNumber': this.sourceAccountTableRequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      };
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'AccountName':
        return 123;
      case 'AccountNumber':
        return 7;
      case 'AccountClassification':
        return 2;
      case 'Region':
        return 38;
      case 'AccountOwner':
        return 4;
      default:
        return '';
    }
  }
  getSymbol(data) {
    // console.log(data)
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
  advanceLookUpSearch(lookUpData) {
    let selecteddata = [];
    let labelName = lookUpData.labelName;
    selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
    //this.openadvancetabs(labelName, this.selectedAdvisorName, selecteddata, lookUpData.inputVal)
      console.log("selecteteddata lookup",selecteddata);
    switch(labelName) {
        case 'CurrentVerticalOwner' :{
          this.openadvancetabs('CurrentVerticalOwner', this.newverticalOwner, '')
          return
        }
        // case 'TargetAmendment' :{
        //   this.openadvancetabs('TargetAmendment', this.selectedOneAdvisorName, selecteddata, lookUpData.inputVal)
        //   return
        // }
      }
   }
   openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    // let initalLookupData;
    // initalLookupData = this.remove_duplicates_From_Advanced_Lookup(this.data.SeletectedData, rowinitalLookupData);
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListServ.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListServ.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }

      this.accountListServ.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {

          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        else if (x.action == "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
        }
      })

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.emptyArray(controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
        // this.addAlliance();
      }
    });
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'CurrentVerticalOwner': {
        return this.AllianceToAdvanceSelected = [], this.sendAllianceToAdvance = []
      }

    }
  }
  getCommonData() {
    return {
      guid: '',
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'CurrentVerticalOwner': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
    }
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'CurrentVerticalOwner': (data) => {
      //  this.appendalliance(data)
      this.newselectedVerticalOwner(data)
      
      },
  }
}
