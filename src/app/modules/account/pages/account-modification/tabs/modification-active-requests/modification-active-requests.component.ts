import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AccountListService } from '@app/core/services/accountlist.service';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { ModificationActiveRequestState } from '@app/core/state/selectors/account/modificationActiveList.selector';
import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ModificationActiveActions, ModificationActiveRequestsClear } from '@app/core/state/actions/modification-active-list.actions';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { MatSnackBar } from '@angular/material';
import { modificationHistoryRequestsClear } from '@app/core/state/actions/modification-history-list.actions';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-modification-active-requests',
  templateUrl: './modification-active-requests.component.html',
  styleUrls: ['./modification-active-requests.component.scss']
})
export class ModificationActiveRequestsComponent implements OnInit {
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Approvalstatus: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Accountowner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Accounttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requesttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    accountnumber : { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  ModificationActiveRequestTable = [];
  tableTotalCount: number = 0;
  isLoading: boolean = false;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  ModificationActiveAccountRequest =
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

  roleAccess:boolean;//chethana added for bule patch alignments
  loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
 IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');


  constructor(public activerequest: AccountService,
    public router: Router,
    private datapipe: DatePipe,
    private accountlistService: AccountListService,
    private store: Store<AppState>,
    private onlineOfflineService: OnlineOfflineService,
    private EncrDecr: EncrDecrService,
    public accservive: DataCommunicationService, public errorMessage: ErrorMessage, private snackBar: MatSnackBar,public envr : EnvService) { }

  async ngOnInit(): Promise<void> {
    this.roleAccess  = this.accservive.getRoleAccess();//chethana added for bule patch alignments
    console.log(this.IsHelpDesk);
    this.isLoading = true;
    // if (this.loggedin_user == 'sbu' || this.loggedin_user == 'cso') {
    //   var orginalArray = this.accountlistService.getModificationActiveRequest(this.ModificationActiveAccountRequest);

    //   orginalArray.subscribe((x: any[]) => {
    //     this.ModificationActiveRequestTable = x;

    //   });
    // }
    // else 
    {
      // var orginalArray1 = this.activerequest.getAllActiveRequests();

      // var orginalArray1 = this.accountlistService.getModificationActiveRequest(this.ModificationActiveAccountRequest);
      // orginalArray1.subscribe((res: any) => {
      //   if (res && !res.IsError && res.ResponseObject) {
      //     if (res.ResponseObject.length > 0) {
      //       this.isLoading = false;
      //       this.ModificationActiveRequestTable = this.getTableFilterData(Object.values(res.ResponseObject))
      //       this.ModificationActiveRequestTable.map((res, index) => {
      //         res.index = index + 1;
      //       });
      //       this.tableTotalCount = res.TotalRecordCount;
      //       this.ModificationActiveAccountRequest.OdatanextLink = res.OdatanextLink;
      //     }
      //     else {
      //        this.GetAllHistory(this.ModificationActiveAccountRequest,  true)
      //     }
      //   } else {
      //     // this.GetAllhistorys(this.ActivehistoryRequestbody, true)
      //   }
      //   //  this.ModificationActiveRequestTable = res;
      // });
      // this.store.pipe(select(ModificationActiveRequestState)).subscribe(
      //   res => {
      //     this.isLoading = true;
      //     if (res) {
      //       if (res.ids.length > 0) {
      //         // console.log("response from store ", res);
      //         this.isLoading = false;
      //         this.ModificationActiveRequestTable = this.getTableFilterData(Object.values(res.entities));
      //         this.ModificationActiveRequestTable.map((res, index) => {
      //           res.index = index + 1;
      //         });
      //         this.tableTotalCount = res.count;
      //         this.ModificationActiveAccountRequest.OdatanextLink = res.OdatanextLink;
      //       } else {
      //         this.GetAllHistory(this.ModificationActiveAccountRequest, false);
      //       }
      //     } else {
            this.GetAllHistory(this.ModificationActiveAccountRequest, false);
      //     }

      //   }
      // );
      // if (!this.onlineOfflineService.isOnline) {
      //   const CacheRes = await this.accountlistService.getCachedActiveRequests();
      //   if (CacheRes) {
      //     if (CacheRes.data.length > 0) {
      //       this.isLoading = false;
      //       this.ModificationActiveRequestTable = this.getTableFilterData(CacheRes.data);
      //       this.tableTotalCount = CacheRes.count;
      //       this.ModificationActiveAccountRequest.OdatanextLink = CacheRes.OdatanextLink;
      //     }
      //   }
      // }
    }

  }

  TablePagination(data) {

    this.ModificationActiveAccountRequest.RequestedPageNumber = this.ModificationActiveAccountRequest.RequestedPageNumber + 1;

    this.GetAllHistory(this.ModificationActiveAccountRequest, true);

  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ModificationActiveAccountRequest.PageSize = event.itemsPerPage;
      this.ModificationActiveAccountRequest.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.accservive.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
      //   this.GetAllHistory(this.ModificationActiveAccountRequest, true);
      // }

    } else if (event.action === 'search') {
      this.ModificationActiveAccountRequest = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }

  // SearchTable(data): void {
  //   this.ModificationActiveAccountRequest.RequestedPageNumber = 1;
  //   this.ModificationActiveAccountRequest.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.accountSearch(searchData, 6, this.ModificationActiveAccountRequest.PageSize, this.ModificationActiveAccountRequest.OdatanextLink, this.ModificationActiveAccountRequest.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.ModificationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.ModificationActiveRequestTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.ModificationActiveAccountRequest.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.ModificationActiveRequestTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.ModificationActiveAccountRequest, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    console.log(actionRequired);
    // let obj = { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {
        console.log(actionRequired);
        // this.accountlistService.setUrlParamsInStorage('modif_req', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        // this.router.navigate(['/accounts/accountdetails',actionRequired.objectRowData[0].id]);
        return;
      }
      case 'view modification': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
          return;
        }
      case 'review':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
        this.ModificationActiveAccountRequest.OdatanextLink = '';
        this.ModificationActiveAccountRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'Approve':
        {
          if (typeof (actionRequired.objectRowData) === 'object') {
            //confirm popup data
            console.log('confirm approve popup active request', actionRequired);
          } else {
            //Auto Complete Data
            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: 'xyz', designation: 'b1' }];
          }
          if (actionRequired.action === 'Approve') {
            if (this.accservive.searchFieldValidator(actionRequired.objectRowData['popupData']) && actionRequired.objectRowData.popupData == 'yes'){
              this.ApproveAccount(actionRequired.objectRowData.popupData, actionRequired.objectRowData.rowData);
            }
          }

          return;
        }
      case 'reject':
        {
          if (typeof (actionRequired.objectRowData) === 'object') {
            //confirm popup data
            console.log('confirm approve popup active request', actionRequired);
          } else {
            //Auto Complete Data
            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: 'xyz', designation: 'b1' }];
          }

          if (actionRequired.action === 'reject') {
            if (this.accservive.searchFieldValidator(actionRequired.objectRowData.popupData) && actionRequired.objectRowData.popupData)
              this.RejectAccount(actionRequired.objectRowData.popupData, actionRequired.objectRowData.rowData);
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
        this.ModificationActiveAccountRequest.OdatanextLink = '';
        this.ModificationActiveAccountRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.ModificationActiveAccountRequest, true);
        break;
      }
      // default:
      //   // {
      //   //   this.GetAllHistory(this.ModificationActiveAccountRequest, true);
      //   // }
      //   return;
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log('reqparam' + reqparam);
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'ActiveModification').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.accservive.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, '_blank');
        }
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.isLoading = false;
    });

  }
  downloadListMobile(fileInfo) {
    const fileTransfer = new FileTransfer();
    const newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf('?'));
    const uri = encodeURI(newUrl);
    const fileURL = '///storage/emulated/0/DCIM/' + fileInfo.Name;
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
  LoadMoreColumnFilter(data) {
    const headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
  }
  GetColumnSearchFilters(data) {
    const headerName = data.filterData.headerName;
    this.ModificationActiveAccountRequest.OdatanextLink = '';
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
        this.ModificationActiveAccountRequest.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
          this.ModificationActiveAccountRequest.OdatanextLink = '';
          this.ModificationActiveAccountRequest.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.ModificationActiveAccountRequest.OdatanextLink = '';
          this.ModificationActiveAccountRequest.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllHistory(this.ModificationActiveAccountRequest, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterModificationActiveRequests').subscribe(res => {
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
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.ModificationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.ModificationActiveRequestTable = [...this.ModificationActiveRequestTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.ModificationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.ModificationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
          this.ModificationActiveAccountRequest.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.ModificationActiveRequestTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.ModificationActiveRequestTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'UserGuid': this.ModificationActiveAccountRequest.Guid ? this.ModificationActiveAccountRequest.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.ModificationActiveAccountRequest.PageSize : 10,
      'RequestedPageNumber': this.ModificationActiveAccountRequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': this.accservive.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'Status': this.accservive.pluckParticularKey(data.filterData.filterColumn['Approvalstatus'], 'id'),
      'Type': this.accservive.pluckParticularKey(data.filterData.filterColumn['Accounttype'], 'id'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Accountowner'], 'id'),
      'RequestType': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      'Geo': this.accservive.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Vertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SBU': this.accservive.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],
      'AccountNumber':this.accservive.pluckParticularKey(data.filterData.filterColumn['accountnumber'], 'id'),
    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Accountowner") {
        acc.push("AccountOwner");
      }
      else if (d.name == "Accounttype") {
        acc.push("AccountType");
      }
      else if (d.name == "Requesttype") {
        acc.push("RequestType");
      }
      else if (d.name == "Approvalstatus") {
        acc.push("ApprovalStatus");
      }
      else if (d.name == "Sbu") {
        acc.push("SBU");
      }
      else if (d.name == "Subvertical") {
        acc.push("SubVertical");
      }
      else if (d.name == "accountnumber") {
        acc.push("Number");
      }
      else {
        acc.push(d.name);
    }
      return acc;
    }, []);
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Name':
        return 123;
      case 'Requesteddate':
        return 5;
      case 'Approvalstatus':
        return 6;
      default:
        return '';
    }
  }
  getSearchType(columName) {
    // debugger;
    switch (columName) {
      case 'Accountowner':
        return 1;
      case 'Geo':
        return 1;
      case 'Vertical':
        return 1;
      case 'Sbu':
        return 1;
      case 'Subvertical':
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
        guid: this.ModificationActiveAccountRequest.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'modificationActiveRequest').subscribe(res => {
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
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]['data'], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }

  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]['data'].length <= 0) {
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
  modification_manualAccountModification(obj) {
    this.isLoading = true;
    this.accountlistService.modification_manualAccountModification(obj).subscribe(result => {
      this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }));

      if (result['status'] === 'success') {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
        this.GetAllHistory(this.ModificationActiveAccountRequest, false); // kkn  --> calling API, temprory fix
      }
    }, error => {
      this.isLoading = false;
    });
  }

  modification_reviewCso(obj) {
    this.isLoading = true;
    this.accountlistService.modification_reviewCso(obj).subscribe(result => {
      this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }));
      if (result['status'] === 'success') {
        this.GetAllHistory(this.ModificationActiveAccountRequest, false); // kkn  --> calling API, temprory fix
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      }
    }, error => {
      this.isLoading = false;
    });
  }
  modification_validateSbu(obj) {
    this.isLoading = true;
    this.accountlistService.modification_validateSbu(obj).subscribe(result => {
      this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }));
      // if (result.Status) {
      //   this.snackBar.open(result.Status, '', {
      //     duration: 3000
      //   })
      // }
      if (result.status.toLowerCase() === 'success') {
        this.GetAllHistory(this.ModificationActiveAccountRequest, false); // kkn  --> calling API, temprory fix
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      }
      this.router.navigate(['/accounts/accountmodification/modificationactiverequest']);
    }, error => {
      this.isLoading = false;
    });
  }

  RejectAccount(comment, ids) {
    console.log(ids);

    const obj = {
      'overall_comments': {
        'accountid': ids.MapGuid,
        'overallcomments': '',
        'requestedby': this.userId
      },
      'account': { 'requesttype': ids.requesttypeId, 'name': ids.Name, 'accountnumber': ids.accountnumber, 'accountid': ids.MapGuid, 'isownermodified': false, 'requestedby': this.userId, 'accounttype': ids.AccounttypeId },
      'attribute_comments': []
    };
    obj['processinstanceid'] = ids.ProcessGuid;
 if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
   console.log(this.IsHelpDesk)
  if( ids.Status == 184450001){   // pending with CSO 
    obj['overall_comments']['status'] = 184450002;
    this.modification_reviewCso(obj);
}
else if( ids.Status == 184450000){   // pending with SE SPOC 
  obj['overall_comments']['status'] = 184450002;
  this.modification_reviewCso(obj);
 }
 if( ids.Status == 184450005){   // pending with Helpdesk
  obj['overall_comments']['status'] = 184450002;
  this.modification_reviewCso(obj);
}
}
else {

  if (this.loggedin_user === 'cso') {
    obj['overall_comments']['status'] = 184450002;
    this.modification_reviewCso(obj);
  }   else if (this.loggedin_user === 'sbu') {
    if (ids.AccounttypeId === 1) {
      obj['ischangerequired'] = false;
      obj['overall_comments']['status'] = 184450002;
      this.modification_validateSbu(obj);
    }    else {
      obj['overall_comments']['status'] = 184450002;
      this.modification_manualAccountModification(obj);
    }
  }    else { }
} 
}
  ApproveAccount(comment, ids) {
    console.log(ids);
    let obj = {
      'overall_comments': {
        'accountid': ids.MapGuid,
        'overallcomments': '',
        'requestedby': this.userId
      },
      'account': { 'requesttype': ids.requesttypeId, 'name': ids.Name, 'accountnumber': ids.accountnumber, 'accountid': ids.MapGuid, 'isownermodified': false, 'requestedby': this.userId, 'accounttype': ids.AccounttypeId },
      'attribute_comments': []
    };
    obj['processinstanceid'] = ids.ProcessGuid;


if(this.IsHelpDesk!=null && this.IsHelpDesk=='true')
{
  console.log(this.IsHelpDesk);
  if( ids.Status == 184450001){   // pending with CSO 
    obj['overall_comments']['status'] = 184450006;
    this.modification_reviewCso(obj);
}
else if( ids.Status == 184450000){   // pending with SE SPOC
  obj['overall_comments']['status'] = 184450001;
  this.modification_reviewCso(obj);
}
else if( ids.Status == 184450005){   // pending with Helpdesk 
  obj['overall_comments']['status'] = 184450006;
  this.modification_reviewCso(obj);
}
}
else{
  if (this.loggedin_user === 'cso') {
    obj['overall_comments']['status'] = 184450006;
    this.modification_reviewCso(obj);
  }    else if (this.loggedin_user === 'sbu') {
    obj['ischangerequired'] = false;
    obj['overall_comments']['status'] = 184450001;
    if (ids.AccounttypeId === 1) {
      this.modification_validateSbu(obj);
    }      else {
      this.modification_manualAccountModification(obj);
    }
  } 
}    
    // if (this.loggedin_user === 'cso') {
    //   obj['overall_comments']['status'] = 184450006;
    //   this.modification_reviewCso(obj);
    // }    else if (this.loggedin_user === 'sbu') {
    //   obj['ischangerequired'] = false;
    //   obj['overall_comments']['status'] = 184450001;
    //   if (ids.AccounttypeId === 1) {
    //     this.modification_validateSbu(obj);
    //   }      else {
    //     this.modification_manualAccountModification(obj);
    //   }
    // }    else if(this.IsHelpDesk) {  
    //        if( ids.Status == 184450001){   // pending with CSO 
    //         obj['overall_comments']['status'] = 184450006;
    //         this.modification_reviewCso(obj);
    //        }
  }

  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    let reqbody;
    reqbody = {
      "Guid":reqBody.Guid,
      "UserGuid":reqBody.Guid,
      "SortBy":"",
      "IsDesc":false,
      "PageSize":reqBody.PageSize,
      "RequestedPageNumber":reqBody.RequestedPageNumber,
      "SearchText":"",
      "Name":[],
      "Status":[],
      "Type":[],
      "Owner":[],
      "RequestType":[],
      "Geo":[],
      "Vertical":[],
      "SBU":[],
      "SubVertical":[],
      "OdatanextLink":reqBody.OdatanextLink,
    }
    this.accountlistService.getModificationActiveRequest(reqbody)
      .subscribe(async (modificationactive) => {
        //this.ModificationActiveRequestTable = [];
        if (!modificationactive.IsError) {
          this.isLoading = false;
          if (modificationactive.ResponseObject.length > 0) {
            this.ModificationActiveRequestTable = [];
            const ImmutableObject = Object.assign({}, modificationactive);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + ' - ' + end);
            modificationactive.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            // console.log("got response - ");
            // console.log(modificationactive);

            if (modificationactive.OdatanextLink) {
              this.ModificationActiveAccountRequest.OdatanextLink = modificationactive.OdatanextLink;
            }
            this.ModificationActiveAccountRequest = reqBody;

            //    await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.ModificationActiveAccountRequest.OdatanextLink = modificationactive.OdatanextLink;
            if (isConcat) {

              const spliceArray = [];
              this.ModificationActiveRequestTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.ModificationActiveRequestTable.splice(this.ModificationActiveRequestTable.indexOf(res), 1);
              });
              this.ModificationActiveRequestTable = this.ModificationActiveRequestTable.concat(this.getTableFilterData(modificationactive.ResponseObject));
              console.log(this.ModificationActiveRequestTable);

            } else {
              this.ModificationActiveRequestTable = this.getTableFilterData(modificationactive.ResponseObject);

            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);

            // this.store.dispatch(new ModificationActiveActions({ ModificationActiveModel: ImmutableObject.ResponseObject, count: modificationactive.TotalRecordCount, OdatanextLink: modificationactive.OdatanextLink }))

            // this.offlineServices.addActiveCampaignCacheData(this.campaignSerivce.CampaignChacheType.Table, this.campaignTable, campaignList.TotalRecordCount)
            this.tableTotalCount = modificationactive.TotalRecordCount;
          } else {
            this.tableTotalCount = 0;
            this.isLoading = false;
            this.ModificationActiveRequestTable = [{}];
          }

        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.ModificationActiveAccountRequest.RequestedPageNumber = this.ModificationActiveAccountRequest.RequestedPageNumber - 1;
        }
      },
        error => {
          this.isLoading = false;
        });

  }




  getTableFilterData(tableData): Array<any> {

    if (tableData) {

      if (tableData.length > 0) {
        return tableData.map((modificationactive => {
          console.log(modificationactive);
          try {
            return {
              id: modificationactive.SysGuid,
              accountnumber: modificationactive.Number || '',
              MapGuid: modificationactive.MapGuid,
              Name: this.accountlistService.getSymbol(modificationactive.Name) || '',
              Accountowner: (modificationactive.Owner && modificationactive.Owner.FullName) ? modificationactive.Owner.FullName : '',
              Accounttype: modificationactive.Type.Value || '',
              AccounttypeId: modificationactive.Type.Id || '',
              Requesttype: (modificationactive.RequestType && modificationactive.RequestType.Name) ? modificationactive.RequestType.Name : '',
              Approvalstatus: (modificationactive.Status && modificationactive.Status.Value) ? modificationactive.Status.Value : '',
              Sbu: (modificationactive.SBU && modificationactive.SBU.Name) ? modificationactive.SBU.Name : '',
              Vertical: (modificationactive.Vertical && modificationactive.Vertical.Name) ? modificationactive.Vertical.Name : '',
              Subvertical: (modificationactive.SubVertical && modificationactive.SubVertical.Name) ? modificationactive.SubVertical.Name : '',
              Geo: (modificationactive.Geo && modificationactive.Geo.Name) ? modificationactive.Geo.Name : '',
              HuntingRatio: (modificationactive.Owner && modificationactive.Owner.HuntingRatio) ? modificationactive.Owner.HuntingRatio : '',
              viewBtnVisibility: !modificationactive.ActionButtons.IsView,
              reviewBtnVisibility: !modificationactive.ActionButtons.IsReview,
              rejectBtnVisibility: !modificationactive.ActionButtons.IsReject,
              approveBtnVisibility: !modificationactive.ActionButtons.IsAccept,
              editdraftBtnVisibility: !modificationactive.ActionButtons.IsEdit,
              viewmoreBtnVisibility: true,
              // statusclass: 'reworkfromsbu',
              statusclass: this.getStatus(modificationactive.Status ? modificationactive.Status.Value : ''),
              index: modificationactive.index,
              ProcessGuid: modificationactive.ProcessGuid,
              // statusclass:  this.getStatus( modificationactive.Status ? modificationactive.Status.Value : 'NA'),
              OverAllComments: modificationactive.OverAllComments,
              requesttypeId: (modificationactive.Type && modificationactive.Type.Id !== 1) ? 1 : 4,
              isActivation: modificationactive.Type && modificationactive.Type.Id === 1 ? 'Activate' : '',
              isSwappedAccount: modificationactive.isSwapAccount && modificationactive.SwapAccount && modificationactive.SwapAccount.SysGuid,
              redirect_from: 'modif_req',
              Status:modificationactive.Status && modificationactive.Status.Id ? modificationactive.Status.Id :''
            };
          } catch (error) {
            console.log('error>>>>', error);
          }
        }));

      } else {

        return [];

      }

    } else {

      return [];

    }

  }
  getStatus(statusrecieved) {
    // var statusclass = statusrecieved;
    switch (statusrecieved) {
      case 'Approved': {
        return 'Approved';
      }
      case 'Rejected': {
        return 'Rejected';
      }
      case 'Pending': {
        return 'Pending';
      }
      case 'Rework from CSO': {
        return 'unqualified';
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
