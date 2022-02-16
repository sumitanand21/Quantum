import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { AccountListService } from '@app/core/services/accountlist.service';
import { AppState } from '@app/core/state';
import { Store } from '@ngrx/store';
import { activeRequestList } from '@app/core/state/actions/Creation-History-List.action';
import { OfflineService, OnlineOfflineService } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { environment as env } from '@env/environment';
import { DateModifier } from '@app/core/services/date-modifier';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-active-requests',
  templateUrl: './active-requests.component.html',
  styleUrls: ['./active-requests.component.scss']
})
export class ActiveRequestsComponent implements OnInit {
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    // Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requesttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Swapaccount: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false


  };
  isviewcso_sbu;
  isview;
  isviewmore;
  review;
  reject;
  approve;
  iseditdraft;
  popupContent;
  route_from;
  approvewithswap;
  CreationActiveRequestTable = [];
  tableTotalCount = 0;
  isLoading = false;
  loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
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
  roleAccess:boolean; //chethana added for bule patch alignments
  constructor(public activerequest: AccountService,
    public router: Router,
    private datapipe: DatePipe,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private accountlistService: AccountListService,
    private store: Store<AppState>
    , private offlineServices: OfflineService,
    private onlineService: OnlineOfflineService,
    private EncrDecr: EncrDecrService,
    public accservive: DataCommunicationService,
    private route: ActivatedRoute, public errorMessage: ErrorMessage,public envr : EnvService) {
    // console.log("route in active request component", route);
    if (route && route.snapshot && route.snapshot.params) {
      this.route_from = route.snapshot.params.name;
    } else {
      this.route_from = 'acc_req';
    }
    // console.log("this is my route_from", this.route_from);
  }

  async ngOnInit() {
    this.roleAccess  = this.accservive.getRoleAccess();//chethana added for bule patch alignments
    this.isLoading = true;
    this.GetAllHistory(this.Activerequest, false);
    if (!this.onlineService.isOnline) {
      const CacheRes = await this.accountlistService.getCachedActiveRequests();
      if (CacheRes) {
        if (CacheRes.data.length > 0) {
          this.isLoading = false;
          this.CreationActiveRequestTable = this.getTableFilterData(CacheRes.data);
          this.tableTotalCount = CacheRes.count;
          this.Activerequest.OdatanextLink = CacheRes.OdatanextLink;
        }
      }
    }
  }


  TablePagination(data) {

    this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber + 1;

    this.GetAllHistory(this.Activerequest, true);

  }



  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.Activerequest.PageSize = event.itemsPerPage;
      this.Activerequest.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.accservive.checkFilterListApiCall(event)) {

      //   this.CallListDataWithFilters(event);
      // } else {

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
  //       this.accountlistService.accountSearch(searchData, 3, this.Activerequest.PageSize, this.Activerequest.OdatanextLink, this.Activerequest.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.CreationActiveRequestTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.Activerequest.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.CreationActiveRequestTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.Activerequest, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // const obj ={'route_from':'acc_req', 'Id': actionRequired.objectRowData[0].id};
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {
        // this.accountlistService.setUrlParamsInStorage('acc_req', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        // this.router.navigate(['/accounts/accountdetails', actionRequired.objectRowData[0].id]);
        return;
      }
      case 'view modification': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
          return;
        }
      case 'review':
        {
          this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'editdraft':
        {
          localStorage.setItem('draftId', actionRequired.objectRowData[0].id);
          if (actionRequired.objectRowData[0].dunsid) {
            this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          } else {
            this.router.navigate(['/accounts/accountcreation/createprospectaccount']);
          }

          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
        this.Activerequest.OdatanextLink = '';
        this.Activerequest.RequestedPageNumber = 1;
        // this.SearchTable(childActionRecieved);
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'Approve':
        {
          if (typeof (actionRequired.objectRowData) === 'object') {

            // console.log("confirm approve popup active request", actionRequired);
          } else {

            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: 'xyz', designation: 'b1' }];
          }
          if (actionRequired.action === 'Approve') {
            // console.log("inside confirm approve ", actionRequired);
            if (this.accservive.searchFieldValidator(actionRequired.objectRowData.popupData) && actionRequired.objectRowData.popupData === 'yes')
              this.ApproveAccount(actionRequired.objectRowData.popupData, actionRequired.objectRowData.rowData, actionRequired);
          }

          return;
        }
      case 'reject':
        {
          if (typeof (actionRequired.objectRowData) === 'object') {

            // console.log("confirm approve popup active request", actionRequired);
          } else {

            console.log(actionRequired);
            this.configData.account = [{ id: 1, name: 'xyz', designation: 'b1' }];
          }

          if (actionRequired.action === 'reject') {
            if (this.accservive.searchFieldValidator(actionRequired.objectRowData.popupData) && actionRequired.objectRowData.popupData !== 'no')
              this.RejectAccount(actionRequired.objectRowData.popupData, actionRequired.objectRowData.rowData, actionRequired);
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
      
      // default:
      //   // {
      //   //   this.GetAllHistory(this.Activerequest, true);
      //   // }
      //   return;


    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);

    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'ActiveRequests').subscribe(res => {

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
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterActiveRequests').subscribe(res => {
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

          // this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.CreationActiveRequestTable = [...this.CreationActiveRequestTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.CreationActiveRequestTable = this.getTableFilterData(res.ResponseObject);
          }
          this.Activerequest.OdatanextLink = res.OdatanextLink;
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
      'Name': this.accservive.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'Status': this.accservive.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      'SwapAccount': this.accservive.pluckParticularKey(data.filterData.filterColumn['Swapaccount'], 'id'),
      'RequestType': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      // 'Type': this.accservive.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      // 'RequestDate': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requestdate'], 'date'),filterStartDate
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterEndDate) : '' : '',
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
    };
  }
  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Requesttype") {
        acc.push("RequestType");
      }
      else if (d.name == "Swapaccount") {
        acc.push("SwapAccount");
      }
      else if (d.name == "Requestdate") {
        acc.push("RequestedDate");
      }
      else {
        acc.push(d.name);
    }
      return acc;
    }, []);
  }
  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Name':
        return 123;
      case 'Requestdate':
        return 5;
      case 'Status':
        return 6;
      default:
        return '';
    }
  }
  getSearchType(columName) {
    switch (columName) {
      // case 'Geo':
      //   return 3;
      // case 'Vertical':
      //   return 3;
      // case 'Sbu':
      //   return 3;
      // case 'Subvertical':
      //   return 3;
      case 'Type':
        return 1;
      case 'Requesttype':
        return 1;
      case 'Owner':
        return 1;
      default:
        return '';
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
        Searchtype: this.getSearchType(headerName)
      };
      // this.GetAppliedFilterData({ ...data })
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'AccountActiveRequest').subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,
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

    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }
  callFilterAPI(data) {
    if (data.filterData.order.length > 0 ? data.filterData.order.length > 0 : '' || data.filterData.globalSearch ? data.filterData.globalSearch : '' || data.filterData.sortColumn ? data.filterData.sortColumn : '') {
      this.CallListDataWithFilters(data);
    } else {
      this.GetAllHistory(this.Activerequest, true);

    }
  }


  validateSbu(obj, data) {

    console.log(obj,data);
    this.isLoading = true;
    this.accountlistService.validateSbu(obj).subscribe(res => {
      this.isLoading = false;
      console.log('response for approve reject', res);
      if (res.data && res.data[0].Status) {
        this.snackBar.open(res.data[0].Status, '', {
          duration: 5000
        });
      }
      else {
        this.snackBar.open(res.message, '', {
          duration: 5000
        });
    }
      if (res['status'] === 'success') {
        this.callFilterAPI(data);
        this.accservive.accounttoast(res.data[0].Status);
      }
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.snackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  /* API for Approve, Reject,Rowork from SBU * END * KKN ** */

  /* API for Approve, Reject,Rowork from CSO ** START ** KKN ** */
  reviewCso(obj, data) {
    this.isLoading = true;
    this.accountlistService.reviewCso(obj).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      if (res.data && res.data[0].Status) {
        this.snackBar.open(res.data[0].Status, '', {
          duration: 5000
        });
      }
      else {
        this.snackBar.open(res.message, '', {
          duration: 5000
        });
    }
      if (res['status'] === 'success') {
        this.callFilterAPI(data);
      }
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.snackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  redirectForFilter(data) {

  }

  RejectAccount(comment, ids, data) {
    const obj = {
      'overall_comments': {
        'prospectid': ids.id,
        'overallcomments': comment,
        'requestedby': this.userId
      },
      'processinstanceid': ids.ProcessGuid,
      'ischangerequired': false,
      'prospect': { 'name': ids.Name },
      'attribute_comments': []
    };
   if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
      if(ids.statusCode == 184450001){
        obj['overall_comments']['status'] = 184450005;
        obj['prospect']['statuscode'] = 184450004;
        obj['prospect']['createby'] = this.userId;
        this.reviewCso(obj, data);
      }
      if(ids.statusCode == 184450000){
        obj['overall_comments']['status'] = 184450005;
        obj['prospect']['statuscode'] = 184450004;
        obj['prospect']['createby'] = this.userId;
        this.validateSbu(obj, data);
      }
   }
   else {
    if (this.loggedin_user === 'cso') {
      obj['overall_comments']['status'] = 184450005;
      obj['prospect']['statuscode'] = 184450004;
      obj['prospect']['createby'] = this.userId;
    } else if (this.loggedin_user === 'sbu') {
      obj['overall_comments']['status'] = 184450005;
      obj['prospect']['statuscode'] = 184450004;
      obj['prospect']['createby'] = this.userId;
    } else { }

    if (this.loggedin_user === 'cso') {
      this.reviewCso(obj, data);
    } else if (this.loggedin_user === 'sbu') {
      this.validateSbu(obj, data);
    }
   }
  }
  ApproveAccount(comment, ids, data) {
    // debugger
    const obj = {
      'overall_comments': {
        'prospectid': ids.id,
        'overallcomments': '',
        'requestedby': this.userId
      },
      'processinstanceid': ids.ProcessGuid,
      'ischangerequired': false,
      'prospect': { 'name': ids.Name },
      'attribute_comments': []
    };
    if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
       console.log('status code', ids.statusCode);
       if(ids.statusCode == 184450001){
        obj['overall_comments']['status'] = 184450003;
        obj['prospect']['statuscode'] = 184450002;
        obj['prospect']['prospecttype'] = 2;
        obj['prospect']['createby'] = this.userId;
        this.reviewCso(obj, data);
       }
       if(ids.statusCode == 184450000){
        obj['overall_comments']['status'] = 184450002;
        obj['prospect']['statuscode'] = 184450001;
        obj['prospect']['createby'] = this.userId;
        this.validateSbu(obj, data);
       }
    }
    else {
      if (this.loggedin_user === 'cso') {
        obj['overall_comments']['status'] = 184450003;
        obj['prospect']['statuscode'] = 184450002;
        obj['prospect']['prospecttype'] = 2;
        obj['prospect']['createby'] = this.userId;
      } else if (this.loggedin_user === 'sbu') {
        obj['overall_comments']['status'] = 184450002;
        obj['prospect']['statuscode'] = 184450001;
        obj['prospect']['createby'] = this.userId;
      } else { console.log('something wrong1...'); }

      if (this.loggedin_user === 'cso') {
        this.reviewCso(obj, data);
      } else if (this.loggedin_user === 'sbu') {
        this.validateSbu(obj, data);
      } else { console.log('something wrong2...'); }
    }
  }


  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    let reqbody;
    reqbody = {"SortBy":"",
    "IsDesc":false,
    "PageSize":reqBody.PageSize,
    "RequestedPageNumber":reqBody.RequestedPageNumber,
    "SearchText":"",
    "Name":[],
    "AccountNumber":[],
    "ParentAccount":[],
    "Owner":[],
    // "Type":[],
    "Classification":[],
    "City":[],
    "Country":[],
    "Geo":[],
    "Vertical":[],
    "SBU":[],
    "SubVertical":[],
    "UserGuid":reqBody.Guid,
    "Guid":reqBody.Guid,
    "ColumnSearchText":"",
    "OdatanextLink":reqBody.OdatanextLink,
    "SearchType":""}
    this.accountlistService.getactiverequest(reqbody)
      .subscribe(async (accountList) => {
        if (!accountList.IsError) {
          // console.log("response from get all", accountList)
          if (accountList.ResponseObject.length > 0) {
            this.CreationActiveRequestTable = [];
            const ImmutableObject = Object.assign({}, accountList);
            this.isLoading = false;
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            accountList.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
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
              });
              this.CreationActiveRequestTable = this.CreationActiveRequestTable.concat(this.getTableFilterData(accountList.ResponseObject));
              // console.log("campaing table final")
              // console.log("===> CreationActiveRequestTable is ", this.CreationActiveRequestTable)
            } else {
              this.CreationActiveRequestTable = this.getTableFilterData(accountList.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            this.store.dispatch(new activeRequestList({ ActiveRequestModel: ImmutableObject.ResponseObject, count: accountList.TotalRecordCount, OdatanextLink: accountList.OdatanextLink }));
            this.tableTotalCount = accountList.TotalRecordCount;
          } else {
            this.isLoading = false;

            this.tableTotalCount = 0;
            this.CreationActiveRequestTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber - 1;
        }
      },
        error => {
          this.isLoading = false;
        });
  }





  // getSymbol(data) {
  //   return decodeURIComponent(data).replace('+', ' ');
  // }
  getTableFilterData(tableData): Array<any> {
    console.log(tableData);

    if (tableData) {

      if (tableData.length > 0) {
        return tableData.map((activerequest => {
          return {
            id: activerequest.SysGuid,
            Name: this.accountlistService.getSymbol(activerequest.Name) || 'NA',
            Number: activerequest.Number || 'NA',
            RequesttypeId: activerequest.RequestType.Id ? activerequest.RequestType.Id : 0,
            Requesttype: activerequest.RequestType.Value ? activerequest.RequestType.Value : 'NA',
            Requestdate: activerequest.RequestDate ? activerequest.RequestDate : 'NA',
            Swapaccount: (activerequest.SwapAccount && activerequest.SwapAccount.Name) ? this.accountlistService.getSymbol(activerequest.SwapAccount.Name) : 'NA',
            Status: activerequest.Status ? activerequest.Status.Value : 'NA',
            statusclass: this.getStatus(activerequest.Status ? activerequest.Status.Value : 'NA'),
            Type: activerequest.Type.Value ? activerequest.Type.Value : 'NA',
            Owner: activerequest.Owner && activerequest.Owner.FullName ? activerequest.Owner.FullName : 'NA',
            HuntingRatio: activerequest.Owner && activerequest.Owner.HuntingRatio ? activerequest.Owner.HuntingRatio : 0,
            ExistingRatio: activerequest.Owner && activerequest.Owner.ExistingRatio ? activerequest.Owner.ExistingRatio : 0,
            index: activerequest.index,
            OverAllComments: activerequest.OverAllComments,
            dunsid: activerequest.DUNSID.SysGuid,
            StatusButtonVisibility: activerequest.Owner && activerequest.Owner.isExists ? activerequest.Owner.isExists : false,
            viewBtnVisibility: !activerequest.ActionButtons.IsView,
            reviewBtnVisibility: !activerequest.ActionButtons.IsReview,
            viewmoreBtnVisibility: false,
            rejectBtnVisibility: !activerequest.ActionButtons.IsReject,
            approveBtnVisibility: !activerequest.ActionButtons.IsAccept,
            editdraftBtnVisibility: !activerequest.ActionButtons.IsEdit,
            ProcessGuid: activerequest.ProcessGuid || 'NA',
            redirect_from: 'acc_req',
            statusCode : activerequest.Status ? activerequest.Status.Id : 'NA',

          };

        }));

      }
    }
  }
  getStatus(statusrecieved) {
    // var statusclass = statusrecieved;
    // console.log("status recived", statusrecieved)
    switch (statusrecieved) {
      case 'Draft': {
        return 'Draft';
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


