import { CustomerBusinessUnitDetails } from './../../../../../../core/interfaces/get-account-details';
// import { Component, OnInit, Input } from '@app/modules/account/pages/assingment-ref/tabs/assig-active-requests/node_modules/@angular/core';
// import { AccountService } from '@app/core/services/account.service';
// import { Observable, of, concat, from } from '@app/modules/account/pages/assingment-ref/tabs/assig-active-requests/node_modules/rxjs';
// import { Router } from '@app/modules/account/pages/assingment-ref/tabs/assig-active-requests/node_modules/@angular/router';
// import { DatePipe } from '@app/modules/account/pages/assingment-ref/tabs/assig-active-requests/node_modules/@angular/common';
// import { AccountListService } from '@app/core/services/accountlist.service';
// import { AppState } from '@app/core/state';
// import { Store, select } from '@app/modules/account/pages/assingment-ref/tabs/assig-active-requests/node_modules/@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AccountListService } from '@app/core/services/accountList.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { Observable } from 'rxjs';

import { ActiveRequestState } from '@app/core/state/selectors/account/ActiveRequestsList.selector';
import { OfflineService, OnlineOfflineService } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
} from '@angular/material';
import { assignmentRefActiveRequestsclear, assignmentRefActiveRequestList } from '@app/core/state/actions/assignmentRef.action';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-assig-active-requests',
  templateUrl: './assig-active-requests.component.html',
  styleUrls: ['./assig-active-requests.component.scss']
})
export class AssigActiveRequestsComponent implements OnInit {
  MapGuid;
  sbuChanged: boolean;
  isGCP: boolean;
  ischangesprimaryvalue: boolean;
  isviewcso_sbu;
  isview;
  isviewmore;
  review;
  reject;
  approve;
  iseditdraft;
  approvewithswap;
  CreationActiveRequestTable = [];
  tableTotalCount: number = 0;
  isLoading: boolean = false;
  loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip')
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  Activerequest =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };
  configData = {
    'account': [],
    'rejectReason': [{
      id: 1, name: 'Reason1'
    },
    {
      id: 2, name: 'Reason1'
    },
    {
      id: 3, name: 'Reason1'
    }]
  };
  assignListData: any;
  assignListDataObject: any;
  reworkStatus: any = '';
  filterConfigData = {
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requesttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Region: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    // Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  constructor(public activerequest: AccountService,
    public router: Router,
    private datapipe: DatePipe,
    private accountlistService: AccountListService,
    private store: Store<AppState>
    , private offlineServices: OfflineService,
    private onlineService: OnlineOfflineService,
    private EncrDecr: EncrDecrService,
    public accservive: DataCommunicationService, private snackBar: MatSnackBar, public errorMessage: ErrorMessage,public envr : EnvService) { }

  async ngOnInit() {
    this.isLoading = true;    
    // this.store.pipe(select(ActiveRequestState)).subscribe(
    //   res => {
    //     if (res) {
    //       if (res.ids.length > 0) {
    //         console.log("response from store ", res);
    //         this.isLoading = false;
    //         this.CreationActiveRequestTable = this.getTableFilterData(Object.values(res.entities))
    //         this.CreationActiveRequestTable.map((res, index) => {
    //           res.index = index + 1;
    //         });
    //         this.tableTotalCount = res.count;
    //         this.Activerequest.OdatanextLink = res.OdatanextLink;
    //       } else {
    //         this.GetAllHistory(this.Activerequest, false);
    //       }
    //     } else {
          this.GetAllHistory(this.Activerequest, false);
    //     }

    //   }
    // );
    // }
    // if (!this.onlineService.isOnline) {
    //   const CacheRes = await this.accountlistService.getCachedActiveRequests();
    //   if (CacheRes) {
    //     if (CacheRes.data.length > 0) {
    //       this.isLoading = false;
    //       this.CreationActiveRequestTable = this.getTableFilterData(CacheRes.data);
    //       this.tableTotalCount = CacheRes.count;
    //       this.Activerequest.OdatanextLink = CacheRes.OdatanextLink;
    //     }
    //   }
    // }

  }


  TablePagination(data) {

    this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber + 1

    this.GetAllHistory(this.Activerequest, true);

  }
  postObjValidator(obj) {
    const keys = Object.keys(obj);
    keys.map(function (k) {
      if (typeof obj[k] !== 'boolean') {
        if (!obj[k])
          delete obj[k];
        if (obj[k] && obj[k] == 'NA')
          delete obj[k];
      }
    })
    return obj;
  }


  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.Activerequest.PageSize = event.itemsPerPage;
      this.Activerequest.RequestedPageNumber = event.currentPage;
      // this.GetAllHistory(this.Activerequest, true);
      // if (this.accservive.checkFilterListApiCall(event)) {

      //   //filter api call
        this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
      //   this.GetAllHistory(this.Activerequest, true);
      // }
    } else if (event.action === 'search') {
      this.Activerequest = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }

  // SearchTable(data): void {
  //   this.Activerequest.RequestedPageNumber = 1;
  //   this.Activerequest.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.accountSearch(searchData, 8, this.Activerequest.PageSize, this.Activerequest.OdatanextLink, this.Activerequest.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject)
  //             let i = 1;
  //             this.CreationActiveRequestTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             })
  //             this.Activerequest.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //             // console.log("table count", res);
  //           } else {
  //             console.log("table count else", res);
  //             this.CreationActiveRequestTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       })
  //     } else {
  //       this.GetAllHistory(this.Activerequest, false);
  //     }
  //   }
  // }
  reviewAssignPayload(data) {
    // if (this.MapGuid) {
    //   this.accountlistService.FetchReferenceAccountDetails(this.MapGuid).subscribe(res => {
    //     if (!res["IsError"] && res["ResponseObject"]) {
    //       let accountDetails = res["ResponseObject"];
    //       if (accountDetails) {
    //         let data1 = accountDetails;
    //         if(data1.SBU.Id !== data.SBU.Id){
    //           this.sbuChanged =true;
    //         }
    //         else {
    //           this.sbuChanged=false;
    //         }
    //          if ((data1.SBU.Id !== data.SBU.Id || data1.SubVertical.Id != data.SubVertical.Id ||
    //           data1.Vertical.Id != data.Vertical.Id || data1.Geo.SysGuid != data.Geo.SysGuid ||
    //            data1.Region.SysGuid != data.Region.SysGuid || data1.Address.Country.SysGuid != data.Address.Country.SysGuid)) 
    //           {
    //           this.ischangesprimaryvalue = true;
    //         } else {
    //           this.ischangesprimaryvalue = false;
    //         }
    //       }
    //     }
    //   })
    // }
    console.log(data);
    let totalCBUs;
    const CBUArray: any = [];
    const oldCBUArray: any = [];
    totalCBUs = data.CustomerBusinessUnit;
    if (totalCBUs.length !== 0) {
      totalCBUs.map((data) => {
        if (data.MapGuid) {
          CBUArray.push({ 'name': data.Name, 'id': data.SysGuid })
        }
      });
    }
    let payload = {
      'assignmentReference': {
        'assignmentReferenceId': data.SysGuid,
        'ownerid': (data.Owner && data.Owner.SysGuid) ? data.Owner.SysGuid : '',
        'sbu': (data.SBU && data.SBU.Id) ? data.SBU.Id : '',
        'subvertical': (data.SubVertical && data.SubVertical.Id) ? data.SubVertical.Id : '',
        // 'cbu': (data.CustomerBusinessUnit.length != 0 && data.CustomerBusinessUnit[0].SysGuid) ? data.CustomerBusinessUnit[0].SysGuid : '',
        'vertical': (data.Vertical && data.Vertical.Id) ? data.Vertical.Id : '',
        //'parentaccount': (data.ParentAccount && data.ParentAccount.SysGuid) ? data.ParentAccount.SysGuid : '',
        'ultimateparent': (data.UltimateParentAccount && data.UltimateParentAccount.SysGuid) ? data.UltimateParentAccount.SysGuid : '',
        'geography': (data.Geo && data.Geo.SysGuid) ? data.Geo.SysGuid : '',
        'region': (data.Region && data.Region.SysGuid) ? data.Region.SysGuid : '',
        'country': (data.Address && data.Address.Country && data.Address.Country.SysGuid) ? data.Address.Country.SysGuid : '',
        // 'state': (data.Address && data.Address.State && data.Address.State.SysGuid) ? data.Address.State.SysGuid : '',
        //'city': (data.Address && data.Address.City && data.Address.City.SysGuid) ? data.Address.City.SysGuid : '',
        'comments': data.Comment,
        // 'accountid': data.MapGuid,
        'rrquesttpe': 184450000,
        'statuscode': this.reworkStatus,
        'CBUCustomerContact': '',
        'activebuyerorganization': 'Genpact',
        'cbuownerfromwipro': (data.Owner && data.Owner.SysGuid) ? data.Owner.SysGuid : '',
        'isprimary': true,
        'issecondary': data.IsSecondary ? data.IsSecondary : false,
        'territoryflag': true,
        'territoryflagid': 1,
        'ischangesprimaryvalue': this.ischangesprimaryvalue
      },
      'attribute_comments': [],
      'processinstanceid': data.ProcessGuid || '',
      'status': this.reworkStatus,
      'requestedby': this.userId,
      'isSbuChanged': false
    }
    if (this.reworkStatus === 184450001 && this.loggedin_user === 'sbu') {
      payload['isSbuChanged'] = true;
    }
    console.log("this is payload", payload);
    payload['assignmentReference'] = this.postObjValidator(payload['assignmentReference']);
    payload['assignmentReference']["cbu"] = CBUArray; //"733CD4E0-2E76-E911-A830-000D3AA058CB",
    payload['assignmentReference']["oldcbu"] = oldCBUArray;
    this.assignListDataObject = payload;
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;


    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].id, 'DecryptionDecrip');

    switch (actionRequired.action) {
      case 'Name': {
        // this.accountlistService.setUrlParamsInStorage('assign_ref', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        // this.router.navigate(['/accounts/accountdetails', this.MapGuid]);
        return;
      }
      case 'Number': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
          return;
        }
      case 'review':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'editdraft':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return
      }
      case 'search': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return
      }
      case 'Approve':
        {

          if (typeof (actionRequired.objectRowData) == "object") {
            //confirm popup data
            console.log("confirm approve popup active request", actionRequired);
          } else {
            //Auto Complete Data
            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: "xyz", designation: "b1" }]
          }
          if (actionRequired.action == "Approve") {
            // do not alter the flow of this code//
            //changes made by divya on 3rd october//
            this.MapGuid = actionRequired.objectRowData.rowData.MapGuid;
            this.isGCP = actionRequired.objectRowData.rowData.isGCP;
            console.log("printing is gcp", this.isGCP);
            let popupdata = actionRequired.objectRowData.popupData ? actionRequired.objectRowData.popupData : '';
            let rowdata = actionRequired.objectRowData.rowData
            if (popupdata.toLowerCase() == 'no') { }
            else this.checkPrimaryChanges(rowdata, popupdata);
            //   if(this.isGCP){
            //   if (this.accservive.searchFieldValidator(actionRequired.objectRowData.popupData))
            //     this.ApproveAccount(actionRequired.objectRowData.popupData, actionRequired.objectRowData.rowData);}
          }

          return;
        }
      case 'reject':
        {

          if (typeof (actionRequired.objectRowData) === "object") {
            //confirm popup data
            console.log("confirm approve popup active request", actionRequired);
          } else {
            //Auto Complete Data
            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: "xyz", designation: "b1" }]
          }

          if (actionRequired.action === "reject") {
            let popupdata = actionRequired.objectRowData.popupData ? actionRequired.objectRowData.popupData : '';
            this.isGCP = actionRequired.objectRowData.rowData.isGCP;
            if (popupdata.toLowerCase() === 'no') { }
            else if (this.accservive.searchFieldValidator(actionRequired.objectRowData.popupData))
              this.RejectAccount(popupdata, actionRequired.objectRowData.rowData);
          }
          return;
        }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
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
      case 'sortHeaderBy': {
        this.Activerequest.OdatanextLink = '';
        this.Activerequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
       this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.Activerequest, true);
        break;
      }
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'ActiveRequestsAssignmentReference').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.isLoading = false;
    })

  }
  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf('?'));
    var uri = encodeURI(newUrl);
    var fileURL = '///storage/emulated/0/DCIM/' + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo.Name} downloaded`);
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log('download complete: ' + entry.toURL());
      },
      function (error) {
        console.log('download error source ' + error.source);
        console.log('download error target ' + error.target);
        console.log('download error code' + error.code);
      },
      null, {
      //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //  } headers: {
      // 
    }
    );
  }
  checkPrimaryChanges(data, popupdata) {
    console.log("came here", data);
    if (this.MapGuid) {
      this.accountlistService.FetchReferenceAccountDetails(this.MapGuid).subscribe(res => {
        if (!res["IsError"] && res["ResponseObject"]) {
          let accountDetails = res["ResponseObject"];
          if (accountDetails) {
            let data1 = accountDetails;
            console.log("came here too", data1);
            if ((data1.SBU.Id !== data.SBU.Id || data1.SubVertical.Id != data.Subvertical1.Id ||
              data1.Vertical.Id != data.Vertical1.Id || data1.Geo.SysGuid != data.Geo1.SysGuid ||
              data1.Region.SysGuid != data.Region1.SysGuid || data1.Address.Country.SysGuid != data.Country.SysGuid)) {
              this.ischangesprimaryvalue = true;
            } else {
              this.ischangesprimaryvalue = false;
            }
            if (data1.SBU.Id !== data.SBU.Id) {
              this.sbuChanged = true;
              console.log("came here2");
              if (this.accservive.searchFieldValidator(popupdata))
                this.ApproveAccount(popupdata, data);
            }
            else {
              this.sbuChanged = false;
              console.log("came here3");
              if (this.accservive.searchFieldValidator(popupdata))
                this.ApproveAccount(popupdata, data);
            }
          }
        }
      })
    }

  }
  LoadMoreColumnFilter(data) {
    const headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
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
        // debugger
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
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
            this.GetAllHistory(this.Activerequest, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterAssignmentReferenceActiveRequests').subscribe(res => {
      if (!res.IsError) {
        // debugger
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

          this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
          this.Activerequest.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.CreationActiveRequestTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.CreationActiveRequestTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'UserGuid': this.Activerequest.Guid ? this.Activerequest.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.Activerequest.PageSize : 10,
      'RequestedPageNumber': this.Activerequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'AccountNumber': this.accservive.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      'Status': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      // 'RequestDate': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requestdate'], 'date'),
      'StartDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterStartDate),
      'EndDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterEndDate),
      'Geo': this.accservive.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Region': this.accservive.pluckParticularKey(data.filterData.filterColumn['Region'], 'id'),
      'Vertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SubVertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),

    };
  }
  getLocaleDateFormat(date) {
    if (date) {
      return date._i.year + '-' + date._i.month + '-' + date._i.date;
    } else {
      return '';
    }
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Number':
        return 7;
      case 'Requestdate':
        return 5;
      case 'Requesttype':
        return 6;
      default:
        return '';
    }
  }
  getSearchType(columName) {
    // debugger;
    switch (columName) {
      case 'Owner':
        return 1;
      case 'Geo':
        return 4;
      case 'Vertical':
        return 4;
      // case 'Sbu':
      //   return 4;
      case 'Subvertical':
        return 4;
        case 'Region':
          return 1;
      default:
        return '';
    }
  }
  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      // let headerName = data.filterData.headerName
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.Activerequest.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'assignActiveRequest').subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,

          // data: (isConcat) ? res.ResponseObject.concat(this.filterConfigData[headerName]['data']) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        };
        data.filterData.filterColumn[headerName].forEach(res => {
          const index = this.filterConfigData[headerName].data.findIndex(x => x.id === res.id);
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
  RemoveSelectedItems(array1, array2, key) {
    // return array1;
    // debugger;
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }
  /* API for Approve, Reject,Rowork from SBU ** START ** KKN ** */
  reference_reviewGcp() {
    this.isLoading = true;
    this.accountlistService.reference_reviewGcp(this.assignListDataObject).subscribe(result => {
      this.isLoading = false;
      if (result['status'] == "success") {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      } else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        })
      }

      if (result['status'] == "success") {
        this.store.dispatch(new assignmentRefActiveRequestsclear({ AssignclearActiveRequestModel: {} }))
        this.GetAllHistory(this.Activerequest, false);
      }
    }, error => {
      this.isLoading = false;
    });
  }

  reference_sbuReview() {
    this.isLoading = true;
    this.accountlistService.reference_sbuReview(this.assignListDataObject).subscribe(result => {
      this.isLoading = false;
      if (result['status'] == "success") {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      }
      else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        });
      }
      if (result['status'] == "success") {
        this.store.dispatch(new assignmentRefActiveRequestsclear({ AssignclearActiveRequestModel: {} }))
        this.GetAllHistory(this.Activerequest, false);
      }
    }, error => {
      this.isLoading = false;
    });
  }
  /* API for Approve, Reject,Rowork from SBU * END * KKN ** */

  /* API for Approve, Reject,Rowork from CSO ** START ** KKN ** */
  reference_reviewCso() {
    this.isLoading = true;
    this.accountlistService.reference_reviewCso(this.assignListDataObject).subscribe(result => {
      this.isLoading = false;
      if (result['status'] == "success") {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      }
      else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        });
      }
      if (result['status'] == "success") {
        this.store.dispatch(new assignmentRefActiveRequestsclear({ AssignclearActiveRequestModel: {} }))
        this.GetAllHistory(this.Activerequest, false);
      }
    }, error => {
      this.isLoading = false;
    });
  }


  RejectAccount(comment, ids) {
    // let obj = {
    //   assignmentReference:{
    //     assignmentReferenceId:""
    //   },  
    //   "overall_comments": {
    //     "assignmentReferenceId": ids.id,
    //     "overallcomments": comment,
    //     "requestedby": this.userId,
    //     "status": 184450002
    //   },
    //   "processinstanceid": ids.ProcessGuid,
    //   "ischangerequired": false,
    //   "attribute_comments": [],
    //   "requestedby": this.userId,
    //   "isSbuChanged": false
    // };
    // obj['assignmentReference']['assignmentReferenceId'] = ids.id;
    // if (this.loggedin_user == "cso") {
    //   obj['overall_comments']['status'] = 184450004;
    //   obj['status'] = 184450004;      
    // }
    // else if (this.loggedin_user == "sbu") {
    //   obj['overall_comments']['status'] = 184450004;
    //   obj['status'] = 184450004;
    // } else { }
    this.reworkStatus = 184450004;
    this.reviewAssignPayload(this.assignListData[ids.index - 1]);
    if (this.loggedin_user == "cso") {
      this.reference_reviewCso();
    }
    else if (this.loggedin_user == "sbu") {
      this.reference_sbuReview();
    }
    else if (this.isGCP) {
      this.reference_reviewGcp();
    }
  }
  ApproveAccount(comment, ids) {
    // let obj = {
    //   assignmentReference:{
    //     assignmentReferenceId:""
    //   },
    //   "overall_comments": {
    //     "assignmentReferenceId": ids.id,
    //     "overallcomments": comment,
    //     "requestedby": this.userId,
    //   },
    //   "processinstanceid": ids.ProcessGuid,
    //   "ischangerequired": false,
    //   "attribute_comments": [],
    //   "requestedby": this.userId,
    //   "isSbuChanged": false
    // };
    // obj.assignmentReference.assignmentReferenceId = ids.id;
    // this.assignListDataObject = this.assignListData[ids.index - 1];
    if (this.isGCP === true) {
      console.log("the gcp");
      this.reworkStatus = 184450003;
      this.reviewAssignPayload(this.assignListData[ids.index - 1]);
      this.reference_reviewGcp();
    }
    if (this.loggedin_user === "cso") {
      // obj['overall_comments']['status'] = 184450001;
      this.reworkStatus = 184450003;
      this.reviewAssignPayload(this.assignListData[ids.index - 1]);
      this.reference_reviewCso();
    }
    else if (this.loggedin_user === "sbu") {
      if (this.sbuChanged === true) {
        console.log("came here4");
        this.reworkStatus = 184450001
        this.reviewAssignPayload(this.assignListData[ids.index - 1]);
        this.reference_sbuReview();
      }
      // obj['overall_comments']['status'] = 184450000;
      else {
        console.log("came here5");
        this.reworkStatus = 184450003;
        this.reviewAssignPayload(this.assignListData[ids.index - 1])
        this.reference_sbuReview();
      }
    }
  }


  GetAllHistory(reqBody, isConcat): void {
    console.log('get all data');

    //this.CreationActiveRequestTable = [];
    //this.isLoading = true;
    this.accountlistService.getassignactiverequest(reqBody)
      .subscribe(async (accountList) => {
        console.log("Ameer", accountList);
        if (!accountList.IsError) {
          console.log("response from get all", accountList)
          if (accountList.ResponseObject.length > 0) {
            this.CreationActiveRequestTable = [];
            const ImmutableObject = Object.assign({}, accountList)
            this.isLoading = false;
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            this.assignListData = accountList.ResponseObject;
            accountList.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            })
            // console.log("got response - ")
            // console.log(accountList)
            this.Activerequest = reqBody;
            await this.offlineServices.ClearActiveRequestsIndexTableData();
            if (accountList.OdatanextLink) {
              this.Activerequest.OdatanextLink = accountList.OdatanextLink;
            }
            if (isConcat) {
              const spliceArray = [];
              this.CreationActiveRequestTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.CreationActiveRequestTable.splice(this.CreationActiveRequestTable.indexOf(res), 1);
              })
              this.CreationActiveRequestTable = this.CreationActiveRequestTable.concat(this.getTableFilterData(accountList.ResponseObject))
              // console.log("campaing table final")
              // console.log(this.CreationActiveRequestTable)
            } else {
              this.CreationActiveRequestTable = this.getTableFilterData(accountList.ResponseObject)
            }
            // const immutableObject = Object.assign(this.CreationActiveRequestTable)
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid)
            this.store.dispatch(new assignmentRefActiveRequestList({ AssignActiveRequestModel: ImmutableObject.ResponseObject, count: accountList.TotalRecordCount, OdatanextLink: accountList.OdatanextLink }))
            // this.offlineServices.addAllCampaignCacheData(this.campaign.CampaignChacheType.Table, this.campaignTable, accountList.TotalRecordCount)
            this.tableTotalCount = accountList.TotalRecordCount
          } else {
            this.isLoading = false;
            this.tableTotalCount = 0;
            this.CreationActiveRequestTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber - 1
        }
      },
        error => {
          this.isLoading = false;
        });
  }



  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((activerequest => {
          // this.MapGuid = activerequest.MapGuid;
          // this.isGCP = activerequest.isGCP ? activerequest.isGCP :false;
          return {
            id: activerequest.SysGuid || '',
            Name: activerequest.Name || "NA",
            Number: activerequest.Number || "NA",
            HuntingRatio: (activerequest.Owner && activerequest.Owner.HuntingRatio) ? activerequest.Owner.HuntingRatio : "NA",
            Vertical: (activerequest.Vertical && activerequest.Vertical.Name) ? activerequest.Vertical.Name : "NA",
            Subvertical: (activerequest.SubVertical && activerequest.SubVertical.Name) ? activerequest.SubVertical.Name : "NA",
            Geo: (activerequest.Geo && activerequest.Geo.Name) ? activerequest.Geo.Name : "NA",
            Region: (activerequest.Region && activerequest.Region.Name) ? activerequest.Region.Name : "NA",
            Requesttype: (activerequest.Status && activerequest.Status.Value) ? activerequest.Status.Value : "NA",
            Requestdate: activerequest.CreatedOn ? activerequest.CreatedOn : "NA",
            //Requestdate: this.datapipe.transform(activerequest.CreatedOn, 'dd-MMM-y') || "NA",
            Swapaccount: (activerequest.SwapAccount && activerequest.SwapAccount.Name) ? activerequest.SwapAccount.Name : "NA",
            Status: (activerequest.Status && activerequest.Status.Value) ? activerequest.Status.Value : "NA",
            // Pendingwith: activerequest.PendingWith ? activerequest.PendingWith.FullName : "NA",
            Classification: (activerequest.Type && activerequest.Type.Value) ? activerequest.Type.Value : "NA",
            Owner: (activerequest.Owner && activerequest.Owner.FullName) ? activerequest.Owner.FullName : "NA",

            index: activerequest.index,
            OverAllComments: activerequest.Comment,
            viewBtnVisibility: !activerequest.ActionButtons.IsView,
            reviewBtnVisibility: !activerequest.ActionButtons.IsReview,
            //reviewBtnVisibility: false,

            //  viewmoreBtnVisibility: false,
            rejectBtnVisibility: !activerequest.ActionButtons.IsReject,
            approveBtnVisibility: !activerequest.ActionButtons.IsAccept,
            editdraftBtnVisibility: !activerequest.ActionButtons.IsEdit,
            ProcessGuid: activerequest.ProcessGuid || '',
            statusclass: this.getStatus(activerequest.Status ? activerequest.Status.Value : "NA"),
            redirect_from: 'assign_ref',
            MapGuid: activerequest.MapGuid,
            isGCP: activerequest.IsGCP ? activerequest.IsGCP : false,
            IsSecondary: activerequest.IsSecondary ? activerequest.IsSecondary : false,
            SBU: (activerequest.SBU) ? activerequest.SBU : '',
            Vertical1: (activerequest.Vertical) ? activerequest.Vertical : '',
            Subvertical1: (activerequest.SubVertical) ? activerequest.SubVertical : '',
            Geo1: activerequest.Geo ? activerequest.Geo : '',
            Region1: activerequest.Region ? activerequest.Region : '',
            Country: activerequest.Address && activerequest.Address.Country ? activerequest.Address.Country : '',
            RequestdateFOrAssignmentStaus: activerequest.CreatedOn ? activerequest.CreatedOn : "NA"
          };

        }));

      }
    }
  }
  getStatus(statusrecieved) {
    // var statusclass = statusrecieved;
    console.log("status recived", statusrecieved)
    switch (statusrecieved) {
      case 'Approval Pending with GCP': {
        return 'approvalstatus';
      }
      case 'Rework from CSO': {
        return 'reworkfromsbu';
      }
      case 'Rework from SE SPOC': {
        return 'reworkfromsbu';
      }
      case 'Approval Pending with CSO': {
        return 'approvalstatus';
      }
      case 'Approval Pending with SE SPOC': {
        return 'approvalstatus';
      }
    }
  }
}


