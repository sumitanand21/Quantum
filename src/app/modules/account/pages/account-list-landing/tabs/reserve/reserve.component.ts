import { Component, OnInit, Inject, Output, EventEmitter, HostListener, ViewChildren } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AccountListService } from '@app/core/services/accountlist.service';
import { Store, select } from '../../../../../../../../node_modules/@ngrx/store';
import { AppState } from '@app/core/state';
import { reserveAccountAction, reserveAccountClear } from '@app/core/state/actions/resereve-account-list.actions';
import { ReserveRequestState } from '@app/core/state/selectors/account/reserveAccount.selector';
import { OfflineService } from '@app/core/services/offline.services';
import { DataCommunicationService, OnlineOfflineService, ErrorMessage } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RequestActivated } from '../../../account-details/account-details.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent implements OnInit {
  selectedTabValue = 'Reserve';
  tabList: {}[] = [
    {
      view: 'System views',
      groups: [{ name: 'Active', router: 'accounts/accountlist/farming' },
      { name: 'Alliance', router: 'accounts/accountlist/alliance' },
      { name: 'Reserve', router: 'accounts/accountlist/reserve' },
      { name: 'More views', router: 'accounts/accountlist/moreview' },
      ]
    },
  ];
  selectedTabId;
  AccountCreationReserveRequestsTable = [];
  tabList2;
  loggedin_user = '';
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  ReserveListbody = {
    'PageSize': 50,
    'OdatanextLink': '',
    'RequestedPageNumber': 1,
    'Guid': this.userId
  };
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  isLoading = false;
  tableTotalCount: number;
  constructor(public reserveaccount: AccountService,
    public router: Router,
    public envr : EnvService,
    public accountListService: AccountListService,
    private store: Store<AppState>,
    private onlineService: OnlineOfflineService,
    private offlineServices: OfflineService,
    private dialog: MatDialog,
    private EncrDecr: EncrDecrService,
    private service: DataCommunicationService,
    public errorMessage: ErrorMessage,
    public snackBar: MatSnackBar
  ) { }
  async ngOnInit() {
    localStorage.setItem('routeValue', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 14, 'DecryptionDecrip'))
    this.loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
    const roleguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleGuid'), 'DecryptionDecrip');
    const reqBody = {
      'roleGuid': 'f48b192c-cc22-e911-a94d-000d3aa053b9'
    };
    reqBody.roleGuid = roleguid;
    this.tabList2 = await this.accountListService.getCustomDropdown(reqBody);
    console.log('in farming', this.tabList2);
    if (this.tabList2.length > 0) {
      const local = this.tabList2[0].GroupData.filter(x => x.PinId === 14)[0];
      this.selectedTabId = local.id;
      console.log('in oninit farming', this.selectedTabId);
    }
    // this.store.pipe(select(ReserveRequestState)).subscribe(
    //   res => {
    //     if (res) {
    //       if (res.ids.length > 0) {
    //         this.isLoading = false;
    //         this.AccountCreationReserveRequestsTable = this.getTableFilterData(Object.values(res.entities));
    //         this.AccountCreationReserveRequestsTable.map((resp, index) => {
    //           resp.index = index + 1;
    //         });
    //         this.tableTotalCount = res.count;
    //         this.ReserveListbody.OdatanextLink = res.OdatanextLink;
    //       } else {
    //         this.GetAllHistory(this.ReserveListbody, true);
    //       }
    //     } else {
          this.GetAllHistory(this.ReserveListbody, true);
    //     }
    //   }
    // );
    // if (!this.onlineService.isOnline) {
    //   const CacheResponse = await this.accountListService.getCachedActiveAccount();
    //   if (CacheResponse) {
    //     if (CacheResponse.data.length > 0) {
    //       this.isLoading = false;
    //       this.AccountCreationReserveRequestsTable = this.getTableFilterData(CacheResponse.data);
    //       this.tableTotalCount = CacheResponse.count;
    //       this.ReserveListbody.OdatanextLink = CacheResponse.OdatanextLink;
    //     }
    //   }
    // }
  }
  TablePagination(data) {
    this.ReserveListbody.RequestedPageNumber = this.ReserveListbody.RequestedPageNumber + 1;
    this.GetAllHistory(this.ReserveListbody, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ReserveListbody.PageSize = event.itemsPerPage;
      this.ReserveListbody.RequestedPageNumber = event.currentPage;
      // this.GetAllHistory(this.ReserveListbody, true);
      this.CallListDataWithFilters(event, true);
    } else if (event.action === 'search') {
      this.ReserveListbody = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      // tslint:disable-next-line:max-line-length
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'Name': {
        console.log(actionRequired);
        const accountcontacts = {
          'Name': actionRequired.objectRowData[0].Name,
          'SysGuid': actionRequired.objectRowData[0].Id,
          'isProspect': false,
          'Classification': actionRequired.objectRowData[0].Classification || "NA",
          'Status': actionRequired.objectRowData[0].Status ? actionRequired.objectRowData[0].Status: "Active"
        };
        const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
        localStorage.setItem('selAccountObj', temp);
        sessionStorage.setItem('selAccountObj', temp);
        // tslint:disable-next-line:max-line-length
        this.accountListService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].Id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.accountListService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].Id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accountListService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].Id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'review':
        {
          this.accountListService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].Id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search':
        {
          this.ReserveListbody.OdatanextLink = '';
          this.ReserveListbody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(childActionRecieved);
          // this.SearchTable(childActionRecieved);
          return;
        }
      case 'Activate':
        {
          // tslint:disable-next-line:max-line-length
          const IsRequestRaised = childActionRecieved.objectRowData.length > 0 ? childActionRecieved.objectRowData[0].IsRequestRaised : null;
          if (!IsRequestRaised) {
            const dialogRef = this.dialog.open(RequestAccespopup,
              {
                disableClose: true,
                width: '380px',
                data: {
                  'SysGuid': actionRequired.objectRowData[0].Id,
                  'accountName': actionRequired.objectRowData[0].Name,
                  'accountNumber': actionRequired.objectRowData[0].Number,
                  'objectRowData': actionRequired.objectRowData[0]
                }
              });
          
            // if (actionRequired.objectRowData[0].HuntingRatio >= 8 && actionRequired.objectRowData[0].OwnerId !== this.userId) {
            //   const dialogRef = this.dialog.open(OpenOverview,
            //     {
            //       disableClose: true,
            //       width: '380px',
            //       data: {
            //         'HuntingRatio': actionRequired.objectRowData[0].HuntingRatio,
            //         'Owner': actionRequired.objectRowData[0].Owner,
            //         'OverAllComments': '',
            //         'Requesttype': actionRequired.objectRowData[0].Type,
            //         'Status': actionRequired.objectRowData[0].Status
            //       }
            //     });
            // } else {
            //   const dialogRef = this.dialog.open(RequestActivated,
            //     {
            //       disableClose: true,
            //       width: '380px',
            //       data: {
            //         'SysGuid': actionRequired.objectRowData[0].Id,
            //         'accountName': actionRequired.objectRowData[0].Name,
            //         'accountNumber': actionRequired.objectRowData[0].Number
            //       }
            //     });
            //   dialogRef.afterClosed().subscribe(result => {
            //     if (result === 'success') {
            //       this.isLoading = true;
            //     } else {
            //       this.isLoading = false;
            //     }
            //   });
            //   const dialogSubmitSubscription = dialogRef.componentInstance.submitClicked.subscribe(result => {
            //     console.log(result);
            //     this.isLoading = false;
            //     this.router.navigate(['/accounts/accountmodification/modificationactiverequest']);
            //     this.store.dispatch(new reserveAccountClear({ ReserveListModel: {} }));
            //     dialogSubmitSubscription.unsubscribe();
            //   });
            // }
          } 
          else {
            this.snackBar.open('An activation request has already been raised for this account.', '', { duration: 3000 });
          }
          return;
        }
      case 'tabNavigation':
        {
          console.log('in navi', childActionRecieved);
          // Navigation
          this.CustomDropdown(childActionRecieved);
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
        this.ReserveListbody.OdatanextLink = '';
        this.ReserveListbody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.ReserveListbody, true);
        break;
      }
      case 'pinChange': {
        this.pinChange(childActionRecieved);
        return;
      }
    }
  }
  pinChange(childActionRecieved) {
    const reqbody = {
      'SysGuid': childActionRecieved.objectRowData.SysGuid ? childActionRecieved.objectRowData.SysGuid : '',
      'AccountViewType': childActionRecieved.objectRowData.PinId
    };
    this.accountListService.commonPostObject(reqbody, 'PinView').subscribe((res: any) => {
      console.log('res' + res.ResponseObject);
      this.tabList2[0].GroupData.forEach(element => {
        if (childActionRecieved.objectRowData.id === element.id) {
          element.isPinned = true;
        } else {
          element.isPinned = false;
        }
      });
    });
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    reqparam['IsFilterApplied'] = this.service.checkFilterListApiCall(data) ? true : false;
    this.accountListService.getFilterList(reqparam, true, 'ReserveAccountsList').subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.service.Base64Download(res.ResponseObject);
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
    this.ReserveListbody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.ReserveListbody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.ReserveListbody.OdatanextLink = '';
          this.ReserveListbody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.ReserveListbody.OdatanextLink = '';
          this.ReserveListbody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);
          } else {
            this.GetAllHistory(this.ReserveListbody, true);
          }
        }
      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListService.getFilterList(reqparam, false, 'FilterReserveAccounts').subscribe(res => {
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
              this.AccountCreationReserveRequestsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountCreationReserveRequestsTable = [...this.AccountCreationReserveRequestsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountCreationReserveRequestsTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.AccountCreationReserveRequestsTable = this.getTableFilterData(res.ResponseObject);
          this.ReserveListbody.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.AccountCreationReserveRequestsTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AccountCreationReserveRequestsTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.ReserveListbody.PageSize : 10,
      'RequestedPageNumber': this.ReserveListbody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'Status': this.service.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      'AccountNumber': this.service.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      'Owner': this.service.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      'Type': this.service.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      'Geo': this.service.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Vertical': this.service.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SBU': this.service.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.service.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Sbu") {
        acc.push("SBU");
      }
      else if (d.name == "Subvertical") {
        acc.push("SubVertical");
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
      case 'Type':
        return 1;
      case 'Classification':
        return 2;
      case 'Country':
        return 3;
      case 'Owner':
        return 4;
      default:
        return '';
    }
  }
  getSearchType(columName) {
    switch (columName) {
      case 'Type':
        return 4;
      case 'Status':
        return 4;
      case 'Owner':
        return 4;
      case 'Geo':
        return 4;
      case 'Vertical':
        return 4;
      case 'Sbu':
        return 4;
      case 'Subvertical':
        return 4;
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
        guid: this.ReserveListbody.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName),
      };
      // tslint:disable-next-line:max-line-length
      this.accountListService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'SearchFilterAPIChange', 'reserve').subscribe(res => {
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
        // tslint:disable-next-line:max-line-length
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]['data'], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
        // tslint:disable-next-line:max-line-length
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
  CustomDropdown(data) {
    this.selectedTabId = data.objectRowData ? data.objectRowData.id : data.id;
    if (data.objectRowData.PinId === 11) {
      this.router.navigateByUrl('/accounts/accountlist/farming');
    } else if (data.objectRowData.PinId === 12) {
      this.router.navigateByUrl('/accounts/accountlist/alliance');
    } else if (data.objectRowData.PinId === 14) {
      return;
    } else if (data.objectRowData.title === 'More views') {
      const url = '/accounts/accountlist/moreview';
      const moreviewurl = this.envr.outlookConfig.redirectUri;
      window.open(moreviewurl + url, '_blank');
    } else if (data.objectRowData.PinId === 13) {
      this.router.navigateByUrl('/accounts/accountlist/AnalystAdvisor');
    } else if (data.objectRowData.PinId === 10) {
      this.router.navigateByUrl('/accounts/accountlist/allactiveaccounts');
    } else if (this.selectedTabId === -1 || data.objectRowData.title === 'More' || this.selectedTabId === '-1') {
      const url = '/accounts/accountlist/moreview';
      const moreviewurl = this.envr.outlookConfig.redirectUri;
      window.open(moreviewurl + url, '_blank');
    } else {
      const moreviewurl = this.envr.authConfig.url;
      // tslint:disable-next-line:max-line-length
      const url = moreviewurl + 'main.aspx?etn=account&pagetype=entitylist&viewid=' + this.selectedTabId + '&viewtype=4230&navbar=off&cmdbar=false#436148839';
      console.log(url);
      window.open(url, '_blank');
    }
  }

  // SearchTable(data): void {
  //   this.ReserveListbody.RequestedPageNumber = 1;
  //   this.ReserveListbody.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       // tslint:disable-next-line:max-line-length
  //       this.accountListService.accountSearch(searchData, 5, this.ReserveListbody.PageSize, this.ReserveListbody.OdatanextLink, this.ReserveListbody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountCreationReserveRequestsTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountCreationReserveRequestsTable.map(resp => {
  //               resp.index = i;
  //               i = i + 1;
  //             });
  //             this.ReserveListbody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.AccountCreationReserveRequestsTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.ReserveListbody, false);
  //     }
  //   }
  // }
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountListService.getAllReserve(reqBody)
      .subscribe(async (activeRequest) => {
        console.log('reserve response', activeRequest);
        if (!activeRequest.IsError) {
          this.isLoading = false;
          if (activeRequest.ResponseObject.length > 0) {
            this.AccountCreationReserveRequestsTable = [];
            const ImmutableObject = Object.assign({}, activeRequest);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            activeRequest.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (activeRequest.OdatanextLink) {
              this.ReserveListbody.OdatanextLink = activeRequest.OdatanextLink;
            }
            this.ReserveListbody = reqBody;
            await this.offlineServices.ClearReserveAccountIndexTableData();
            this.ReserveListbody.OdatanextLink = activeRequest.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountCreationReserveRequestsTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountCreationReserveRequestsTable.splice(this.AccountCreationReserveRequestsTable.indexOf(res), 1);
              });
              // tslint:disable-next-line:max-line-length
              this.AccountCreationReserveRequestsTable = this.AccountCreationReserveRequestsTable.concat(this.getTableFilterData(activeRequest.ResponseObject));
            } else {
              this.AccountCreationReserveRequestsTable = this.getTableFilterData(activeRequest.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            // tslint:disable-next-line:max-line-length
            this.store.dispatch(new reserveAccountAction({ ReserveListModel: ImmutableObject.ResponseObject, count: activeRequest.TotalRecordCount, OdatanextLink: activeRequest.OdatanextLink }));
            this.tableTotalCount = activeRequest.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.AccountCreationReserveRequestsTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1) {
            this.ReserveListbody.RequestedPageNumber = this.ReserveListbody.RequestedPageNumber - 1;
          }
        }
      },
        error => {
          this.isLoading = false;
        });
  }
  getSymbol(data) {
    return data;
  }
  getTableFilterData(tableData): Array<any> {
    console.log(tableData);
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((reserveAccount => {
          return {
            Id: reserveAccount.SysGuid,
            Name: this.accountListService.getSymbol(reserveAccount.Name),
            Number: reserveAccount.Number || '',
            Status: (reserveAccount.Status && reserveAccount.Status.Value) ? reserveAccount.Status.Value : '',
            Type: reserveAccount.Type.Value || '',
            Owner: (reserveAccount.Owner && reserveAccount.Owner.FullName) ? reserveAccount.Owner.FullName : '',
            OwnerId: (reserveAccount.Owner && reserveAccount.Owner.SysGuid) ? reserveAccount.Owner.SysGuid : '',
            HuntingRatio: reserveAccount.Owner && reserveAccount.Owner.HuntingRatio ? reserveAccount.Owner.HuntingRatio : 0,
            ExistingRatio: reserveAccount.Owner && reserveAccount.Owner.ExistingRatio ? reserveAccount.Owner.ExistingRatio : 0,
            Sbu: (reserveAccount.SBU && reserveAccount.SBU.Name) ? reserveAccount.SBU.Name : '',
            Vertical: (reserveAccount.Vertical && reserveAccount.Vertical.Name) ? reserveAccount.Vertical.Name : '',
            Subvertical: (reserveAccount.SubVertical && reserveAccount.SubVertical.Name) ? reserveAccount.SubVertical.Name : '',
            Geo: (reserveAccount.Geo && reserveAccount.Geo.Name) ? reserveAccount.Geo.Name : '',
            isCheccked: false,
            activateBtnVisibility: reserveAccount.IsRequestRaised,
            index: reserveAccount.index,
            IsRequestRaised: reserveAccount.IsRequestRaised,
            Classification: (reserveAccount.Classification && reserveAccount.Classification.Value) ? reserveAccount.Classification.Value : '',
          };
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  /************Select Tabs dropdown code starts */
  appendConversation(e) {
    if (!e.showView) {
      this.selectedTabValue = e.name;
    }
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
  /************Select Tabs dropdown code ends */
}

// RequestAccesPopup compnent
@Component({
  selector: 'request-access-popup',
  templateUrl: '../../../account-finder/request-access-popup.html',
  styleUrls: ['../../../account-finder/account-finder.component.scss']
})

export class RequestAccespopup {
  @Output() submitClicked = new EventEmitter<any>();
  fieldSubmitted: boolean = false;
  objectRowData; 
  constructor( public envr : EnvService,public dialog: MatDialog, public router: Router, private EncrDecr: EncrDecrService, public snackBar: MatSnackBar,public userdat:DataCommunicationService,
    public dialogRef: MatDialogRef<RequestAccespopup>, private accountListService: AccountListService, public accountListServ: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.SysGuid = data.SysGuid;
    this.accountName = data.accountName;
    this.accountNumber = data.accountNumber;
    this.objectRowData = data.objectRowData;
    console.log(this.SysGuid, "sys guid");
    const accountcontacts = {
      'Name': this.objectRowData.Name,
      'SysGuid': this.objectRowData.Id,
      'isProspect': false,
      'accType': this.objectRowData.Type,
      'Classification': this.objectRowData.Classification || "NA",
      'Status': this.objectRowData.Status ? this.objectRowData.Status.Value : "Active"
    };
    const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
    localStorage.setItem('accType', this.objectRowData.Type);
    localStorage.setItem('selAccountObj', temp);
    sessionStorage.setItem('selAccountObj', temp);
    this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': this.SysGuid });
    this.userdat.setSideBarData(1);
   };
   
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  roleType: any = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip');
  IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  SysGuid: string;
  accountName: any;
  accountNumber: any;
  isLoading: boolean = false;
  additionalComment: string = '';

  assignStatus() {
    if (this.roleType === 2) return 184450001;  // sbu
    else if (this.roleType === 3) return 184450006; //cso
    else if (this.roleType === 1) return 184450000; // account owner
  }
  ReserveRequestActivation(additionalComment) {
    this.fieldSubmitted = true;
    if (additionalComment) {
      console.log(additionalComment);
      this.dialogRef.close('success');
      const obj: any = {
        'account': {
          'accountnumber': this.accountNumber,
          'name': this.accountName,
          'accountid': this.SysGuid,
          'accounttype': 1,
          'requesttype': 4,
          'requestedby': this.userId,
          'isownermodified': false,
        },
        'overall_comments': {
          'accountid': this.SysGuid,
          'overallcomments': additionalComment,
          'requestedby': this.userId,
          'status': this.assignStatus()
        },
        'attribute_comments': []
      };
      
      this.accountListService.account_modification(obj).subscribe(res => {
        this.isLoading = true;
        if (res.processInstanceId) {
        }
        const obj: any = {
          'SysGuid': res.data[0].modificationrequestid,
          'ProcessGuid': res.data[0].processInstanceId
        };
        this.accountListService.ModificationActiverequest_UpdateCamundatoCRM(obj).subscribe(result => {
          this.submitClicked.emit('success');
          this.snackBar.open(res.data[0].Status, '', {
            duration: 5000
          });
          this.isLoading = false;
          // this.router.navigate(['/accounts/accountlist/farming']);
          // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
        }, error => {
          this.submitClicked.emit('error');
          this.isLoading = false;
          this.dialogRef.close('failed');
        });

      }, err => {
        this.submitClicked.emit('error');
        console.log(err);
        this.dialogRef.close('failed');
        this.isLoading = false;
      });
    }
  }
}

