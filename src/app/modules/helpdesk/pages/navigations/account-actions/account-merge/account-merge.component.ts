import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DateModifier } from '@app/core/services/date-modifier';

@Component({
  selector: 'app-account-merge',
  templateUrl: './account-merge.component.html',
  styleUrls: ['./account-merge.component.scss']
})
export class AccountMergeComponent implements OnInit {
  mergeReqSingleTableData = [{}];
 allBtnsLable = ['mergeDeleteBtnVisibility'];
  mergedAccountTableRequest =
  {
    'RequestedPageNumber': 1,
    'PageSize': 50,
    "SearchText": "",
    'OdatanextLink': ''
  };

  filterConfigData = {
    ReferenceNumber: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    MergeRequestName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    RequestedDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    RequestedBy: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  isLoading: boolean = false;

  constructor(public errorMessage: ErrorMessage, public snackBar: MatSnackBar, public router: Router, private datepipe: DatePipe, public accountListServ: AccountListService, public AccountService: AccountService, public service: DataCommunicationService, public dialog: MatDialog) { }

  ngOnInit() {
    // var sampleArray = this.AccountService.get_merge_req_singleTable();
    // sampleArray.subscribe((x: any[]) =>
    // {
    //   this.mergeReqSingleTableData = x;
    // }

    // );
    this.GetAllMergeTableData(this.mergedAccountTableRequest, true);
  }
  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }
  Activerequest = {
    'Guid': '',
    'PageSize': 10,
    'RequestedPageNumber': 1,
    'OdatanextLink': '',
    'LoggedinUser': { 'SysGuid': '' }
  };

  tableTotalCount = 5;

  TablePagination(data) {
    this.mergedAccountTableRequest.RequestedPageNumber = this.mergedAccountTableRequest.RequestedPageNumber + 1;
    this.GetAllMergeTableData(this.mergedAccountTableRequest, true);
  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.mergedAccountTableRequest.PageSize = event.itemsPerPage;
      this.mergedAccountTableRequest.RequestedPageNumber = event.currentPage;
      // if (this.userdat.checkFilterListApiCall(event)) {

      //filter api call
        this.CallListDataWithFilters(event, true);
      // } else {

      //list api call
      // this.GetAllMergeTableData(this.mergedAccountTableRequest, true);
      // }

    } 
    // else if (event.action === 'search') {
    //   this.mergedAccountTableRequest = {
    //     'PageSize': event.itemsPerPage,
    //     'RequestedPageNumber': 1,
    //     'OdatanextLink': '',
    //     "SearchText": "",
    //   };
    // }
  }
  GetAllMergeTableData(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountListServ.getMergeList(reqBody)
      .subscribe(async (modificationactive) => {

        if (!modificationactive.IsError) {
          this.isLoading = false;
          if (modificationactive.ResponseObject.length > 0) {
            this.mergeReqSingleTableData = [];
            const ImmutableObject = Object.assign({}, modificationactive);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            modificationactive.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (modificationactive.OdatanextLink) {
              this.mergedAccountTableRequest.OdatanextLink = modificationactive.OdatanextLink;
            }
            this.mergedAccountTableRequest = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.mergedAccountTableRequest.OdatanextLink = modificationactive.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.mergeReqSingleTableData.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.mergeReqSingleTableData.splice(this.mergeReqSingleTableData.indexOf(res), 1);
              });
              this.mergeReqSingleTableData = this.mergeReqSingleTableData.concat(this.getTableFilterData(modificationactive.ResponseObject));
              console.log("this.mergeReqSingleTableData 125", this.mergeReqSingleTableData)
            } else {
              this.mergeReqSingleTableData = this.getTableFilterData(modificationactive.ResponseObject);
              console.log("this.mergeReqSingleTableData 128", this.mergeReqSingleTableData)
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Id);
            this.tableTotalCount = modificationactive.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.mergeReqSingleTableData = [{}];
          }

        } else {
          this.isLoading = false;
          this.mergeReqSingleTableData = [{}];
          if (reqBody.RequestedPageNumber > 1)
            this.mergedAccountTableRequest.RequestedPageNumber = this.mergedAccountTableRequest.RequestedPageNumber - 1;
        }
      },
      error => {
        this.isLoading = false;
      });
  }
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((mergeData => {
          return {
            index: mergeData.index,
            ReferenceNumber: mergeData.ReferenceNumber || '',
            MergeRequestName: mergeData.Name || '',
            RequestedDate: this.datepipe.transform(mergeData.RequestedOn, 'd MMM y') || '',
            RequestedBy: (mergeData.RequestedBy && mergeData.RequestedBy.FullName) ? mergeData.RequestedBy.FullName : '',
            RequestStage: (mergeData.RequestStage && mergeData.RequestStage.Id) ? mergeData.RequestStage.Id : '',
            SysGuid: mergeData.SysGuid,
            Status: (mergeData.Status && mergeData.Status.Value) ? mergeData.Status.Value : '',
            statusclass: this.getStatus(mergeData.Status && mergeData.Status.Value ? mergeData.Status.Value : 'NA'),
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
      case 'ReferenceNumber': {
        localStorage.setItem("accSysGuid", actionRequired.objectRowData[0].SysGuid);
        localStorage.setItem("RequestStage", actionRequired.objectRowData[0].RequestStage);        
        this.router.navigate(["/helpdesk/accActions/mergelanding/requestdetails"]);
        break;
      }
      case 'deleteMerge': {
        this.deleteMergeData(actionRequired.objectRowData.data);
        break;
      }
      case 'search': {
        this.Activerequest.OdatanextLink = '';
        this.Activerequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }

      case 'columnFilter': {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case 'columnSearchFilter': {
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
      case 'sortHeaderBy': {
        this.Activerequest.OdatanextLink = '';
        this.Activerequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]["data"].length <= 0) {
        return true;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey !== '' && !data.filterData.isApplyFilter) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  GetColumnSearchFilters(data) {
    const headerName = data.filterData.headerName;
    this.Activerequest.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.Activerequest.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.Activerequest.OdatanextLink = '';
          this.Activerequest.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.Activerequest.OdatanextLink = '';
          this.Activerequest.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllMergeTableData(this.Activerequest, true);
          }

        }

      }
    }
  }
  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.Activerequest.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      // let dataSet = data;
      // dataSet['Guid'] = this.IcentivizeUserListRequeBody.Guid;
      this.accountListServ.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'accountMerge').subscribe(res => {

        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,

          // data: (isConcat) ? res.ResponseObject.concat(this.filterConfigData[headerName]['data']) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        };
        data.filterData.filterColumn[headerName].forEach(resp => {
          const index = this.filterConfigData[headerName].data.findIndex(x => x.id === resp.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true;
          }
        });
      });
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListServ.getFilterList(reqparam, false, 'MergeList').subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {

          const ImmutabelObj = Object.assign({}, res);
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;

          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.mergeReqSingleTableData = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.mergeReqSingleTableData = [...this.mergeReqSingleTableData, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.mergeReqSingleTableData = this.getTableFilterData(res.ResponseObject);
          }

          // this.mergeReqSingleTableData = this.getTableFilterData(res.ResponseObject);
          this.Activerequest.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
          // this.filterConfigData.Type['data'] = [];
        } else {
          this.mergeReqSingleTableData = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.mergeReqSingleTableData = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'MergeRequestName':
        return 37;
      case 'ReferenceNumber':
        return 36;
      case 'RequestedDate ':
        return 5;
      case 'RequestedBy':
        return 34; 
      case 'Status':
        return 6;
      default:
        return '';
    }
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      // 'UserGuid': this.Activerequest.LoggedinUser ? this.Activerequest.LoggedinUser : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.mergedAccountTableRequest.PageSize : 10,
      'RequestedPageNumber': this.mergedAccountTableRequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'ReferenceNumber':  this.service.pluckParticularKey(data.filterData.filterColumn['ReferenceNumber'], 'name'),
      'CreatedBy':  this.service.pluckParticularKey(data.filterData.filterColumn['RequestedBy'], 'id'),
      'Name':  this.service.pluckParticularKey(data.filterData.filterColumn['MergeRequestName'], 'name'),
      'Status':  this.service.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['RequestedDate'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['RequestedDate'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['RequestedDate'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['RequestedDate'][0].filterEndDate) : '' : '',
    };
  }
  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  deleteMergeData(data) {
    let arrayData = [];
    let dataSysGuid = data;
    dataSysGuid.map((res) => arrayData.push(res.SysGuid)); 
    let payload = { "SourceGuids": arrayData }
    this.accountListServ.deleteMergeDetails(payload)
      .subscribe(async (res) => {
        if (!res.IsError) {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
          this.GetAllMergeTableData(this.mergedAccountTableRequest, true);
        }
      })
  }
  openmergereq(): void {
    const dialogRef = this.dialog.open(mergereqcomponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "save") {
        this.GetAllMergeTableData(this.mergedAccountTableRequest, true);
      }
    })
  }

  getStatus(statusrecieved) {
   
    switch (statusrecieved) {
      case 'Pending': {
        return 'Pending-merge';
      }
      case 'Submitted': {
        return 'Submitted';
      }
      case 'Success': {
        return 'Success';
      }
      case 'New': {
        return 'New';
      }  
    }
  }
}
@Component({
  selector: 'app-merge-req-pop',
  templateUrl: './merge-req-popup.html',
  styleUrls: ['./account-merge.component.scss']
})
export class mergereqcomponent {
  isSaveSubmitted: boolean = false;
  requestName: string = "";
  mergeDesc: string = "";

  constructor(public dialogRef: MatDialogRef<mergereqcomponent>, public router: Router, public accountListServ: AccountListService, public snackBar: MatSnackBar) { }
  navtonext(data) {
    if (this.requestName && this.mergeDesc) {
      this.isSaveSubmitted = false;
      let reqBody = {
        "Name": this.requestName,
        "Description": this.mergeDesc,
        "RequestedOn": new Date()
      }
      this.accountListServ.createMergeRequest(reqBody)
        .subscribe(async (createRes) => {
          if (!createRes.IsError) {
            this.snackBar.open(createRes['Message'], '', {
              duration: 3000
            });
            if (data == "next") {
              this.dialogRef.close(data);
              localStorage.setItem("accSysGuid", createRes.ResponseObject.SysGuid);
              this.router.navigate(["/helpdesk/accActions/mergelanding/requestdetails"]);
            } else {
              this.dialogRef.close(data);
            }
          }
        })
    } else {
      this.isSaveSubmitted = true;
    }
  }
}



