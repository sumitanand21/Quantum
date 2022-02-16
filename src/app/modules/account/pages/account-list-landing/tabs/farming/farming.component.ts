import { AccountListLandingComponent } from './../../account-list-landing.component';
import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { OfflineService } from '@app/core/services/offline.services';
import { farmingRequestState } from './../../../../../../core/state/selectors/account/FarmingAccounts.selector';
import { farmingAccountAction } from './../../../../../../core/state/actions/farming-account.action';
import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-farming',
  templateUrl: './farming.component.html',
  styleUrls: ['./farming.component.scss']
})

export class FarmingComponent implements OnInit, AfterViewInit {
  selectedTabId;
  tableTotalCount = 0;
  isLoading = false;
  tabList2;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  ActiveAccountRequest =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };
  AccountCreationActiveRequestsTable = [];
  tabList: Array<any>;
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Parentaccount: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Classification: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    City: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Country: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Georeference: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  TypeFilter: any[];
  selectedTabValue = 'Active';
  constructor(public farmingaccount: AccountService,
    private offlineServices: OfflineService,
    public envr : EnvService,
    public router: Router, public dialog: MatDialog,
    public accountListService: AccountListService,
    public accountListLanding: AccountListLandingComponent,
    public store: Store<AppState>,
    private onlineService: OnlineOfflineService,
    public daService: DigitalAssistantService,
    private EncrDecr: EncrDecrService, public accservive: DataCommunicationService, public errorMessage: ErrorMessage) {
    this.tabList = accountListLanding.tablist;
    console.log('in farming', this.tabList);
  }
  ngAfterViewInit() {
  }
  async ngOnInit() {
   localStorage.setItem('routeValue', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 11, 'DecryptionDecrip'))

    const roleguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleGuid'), 'DecryptionDecrip');
    const reqBody = {
      'roleGuid': 'f48b192c-cc22-e911-a94d-000d3aa053b9'
    };
    reqBody.roleGuid = roleguid;
    console.log('roleGuid->', reqBody.roleGuid);
    this.tabList2 = await this.accountListService.getCustomDropdown(reqBody);
    console.log('in farming', this.tabList2);
    if (this.tabList2.length > 0) {
      const locally = this.tabList2[0].GroupData.filter(x => x.PinId === 11)[0];
      this.selectedTabId = locally.id;
      console.log('in oninit farming', this.selectedTabId);
    }
    this.isLoading = true;
    this.GetAllHistory(this.ActiveAccountRequest, true);


    this.tabList2 = await this.accountListService.getCustomDropdown(reqBody);
    console.log('in farming', this.tabList2);
    if (this.tabList2.length > 0) {
      const locally = this.tabList2[0]['GroupData'].filter(x => x.PinId === 11);
      this.selectedTabId = this.tabList2[0].GroupData.filter(x => x.PinId === 11)[0].id;
      console.log('in oninit farming', locally);
    }
    // this.daService.iframePage = 'ACCOUNT_LISTING';
    // let bodyDA = {
    //   page: 'ACCOUNT_LISTING',
    //   userGuid: this.EncrDecr.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
    // };
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
  }
  TablePagination(data) {
    this.ActiveAccountRequest.RequestedPageNumber = this.ActiveAccountRequest.RequestedPageNumber + 1;
    this.GetAllHistory(this.ActiveAccountRequest, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ActiveAccountRequest.PageSize = event.itemsPerPage;
      this.ActiveAccountRequest.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event, true);
      // if (this.accservive.checkFilterListApiCall(event)) {
      //   // filter api call
      //   this.CallListDataWithFilters(event);
      // } else {
      //   this.CallListDataWithFilters(event);
      //   // list api call
      //   // this.GetAllHistory(this.ActiveAccountRequest, true);
      // }
    } else if (event.action === 'search') {
      this.ActiveAccountRequest = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }
  openCreatePopup() {
    const dialogRef = this.dialog.open(SavePopup,
      {
        disableClose: true,
        width: '380px'
      });
  }
  // SearchTable(data): void {
  //   this.ActiveAccountRequest.RequestedPageNumber = 1;
  //   this.ActiveAccountRequest.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountListService.accountSearch(searchData,
  //         1, this.ActiveAccountRequest.PageSize, this.ActiveAccountRequest.OdatanextLink, this.ActiveAccountRequest.RequestedPageNumber)
  //         .subscribe(res => {
  //           if (!res.IsError) {
  //             if (res.ResponseObject.length > 0) {
  //               this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
  //               let i = 1;
  //               this.AccountCreationActiveRequestsTable.map(resp => {
  //                 resp.index = i;
  //                 i = i + 1;
  //               });
  //               this.ActiveAccountRequest.OdatanextLink = res.OdatanextLink;
  //               this.tableTotalCount = res.TotalRecordCount;
  //             } else {
  //               this.AccountCreationActiveRequestsTable = [{}];
  //               this.tableTotalCount = 0;
  //             }
  //           }
  //         });
  //     } else {
  //       this.GetAllHistory(this.ActiveAccountRequest, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('---------->in navi' + childActionRecieved);
    if (childActionRecieved) {
      if (childActionRecieved.parentData) {
        this.tableTotalCount = childActionRecieved.parentData.totalCount;
      } else {
        this.tableTotalCount = this.tableTotalCount;
      }
    }
    const actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'Name': {
        const accountcontacts = {
          'Name': actionRequired.objectRowData[0].Name,
          'SysGuid': actionRequired.objectRowData[0].Id,
          'isProspect': false,
          'accType': actionRequired.objectRowData[0].Type,
          'Classification': actionRequired.objectRowData[0].Classification || "NA",
          'Status': actionRequired.objectRowData[0].Status ? actionRequired.objectRowData[0].Status.Value : "Active"
        };
        const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
        localStorage.setItem('accType', actionRequired.objectRowData[0].Type);
        localStorage.setItem('selAccountObj', temp);
        sessionStorage.setItem('selAccountObj', temp);
        this.accservive.setSideBarData('1');
        this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].Id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].Id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);

        return;
      }
      case 'view':
        {
          this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].Id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'review':
        {
          this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].Id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search':
        {
          this.ActiveAccountRequest.OdatanextLink = '';
          this.ActiveAccountRequest.RequestedPageNumber = 1;
          this.CallListDataWithFilters(childActionRecieved);
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
        this.ActiveAccountRequest.OdatanextLink = '';
        this.ActiveAccountRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {

        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.ActiveAccountRequest, true);
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
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountListService.getFilterList(reqparam, true, 'ActiveAccountsList').subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.accservive.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, ' blank');
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
    this.ActiveAccountRequest.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.ActiveAccountRequest.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
          this.ActiveAccountRequest.OdatanextLink = '';
          this.ActiveAccountRequest.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.ActiveAccountRequest.OdatanextLink = '';
          this.ActiveAccountRequest.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            this.CallListDataWithFilters(data);
          } else {
            this.GetAllHistory(this.ActiveAccountRequest, true);
          }
        }
      }
    }
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListService.getFilterList(reqparam, false, 'FilterActiveAccounts').subscribe(res => {
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
              this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountCreationActiveRequestsTable = [...this.AccountCreationActiveRequestsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
          }

          this.ActiveAccountRequest.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.AccountCreationActiveRequestsTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AccountCreationActiveRequestsTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.ActiveAccountRequest.PageSize : 10,
      'RequestedPageNumber': this.ActiveAccountRequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': this.accservive.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'AccountNumber': this.accservive.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      'ParentAccount': this.accservive.pluckParticularKey(data.filterData.filterColumn['Parentaccount'], 'id'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      'Type': this.accservive.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      'Classification': this.accservive.pluckParticularKey(data.filterData.filterColumn['Classification'], 'id'),
      'City': this.accservive.pluckParticularKey(data.filterData.filterColumn['City'], 'id'),
      'Country': this.accservive.pluckParticularKey(data.filterData.filterColumn['Country'], 'id'),
      'Geo': this.accservive.pluckParticularKey(data.filterData.filterColumn['Georeference'], 'id'),
      'Vertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SBU': this.accservive.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],
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
      else if (d.name == "Georeference") {
        acc.push("Geo");
      }
      else if (d.name == "Parentaccount") {
        acc.push("ParentAccount");
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
        return 1;
      // case 'Status':
      //   return 1;
      case 'Owner':
        return 1;
      case 'Georeference':
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
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.ActiveAccountRequest.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName),
      };
      // tslint:disable-next-line:max-line-length
      this.accountListService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'SearchFilterAPIChange', 'activeAccount')
        .subscribe(res => {
          this.filterConfigData.isFilterLoading = false;
          this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,
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
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(
          this.filterConfigData[headerName]['data'], data.filterData.filterColumn[headerName], 'id')
          .concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (
        data.action === 'columnFilter' && data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]['data'].length <= 0) {
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
    const title = data.objectRowData ? data.objectRowData.title : data.title;
    console.log('----------> custom dropdown data data', data);
    if (data.objectRowData.PinId === 11) {
      return;
    } else if (data.objectRowData.PinId === 12) {
      this.router.navigateByUrl('/accounts/accountlist/alliance');
    } else if (data.objectRowData.PinId === 14) {
      this.router.navigateByUrl('/accounts/accountlist/reserve');
    } else if (data.objectRowData.PinId === 'More views') {
      const url = '/accounts/accountlist/moreview';
      const moreviewurl = this.envr.outlookConfig.redirectUri;
      window.open(moreviewurl + url, '_blank');
    } else if (data.objectRowData.PinId === 13) {
      this.router.navigateByUrl('/accounts/accountlist/AnalystAdvisor');
    }
    else if (data.objectRowData.PinId === 10) {
      this.router.navigateByUrl('/accounts/accountlist/allactiveaccounts');
    }
    else if (this.selectedTabId === -1 || data.objectRowData.title === 'More' || this.selectedTabId === '-1') {
      const url = '/accounts/accountlist/moreview';
      const moreviewurl = this.envr.outlookConfig.redirectUri;
      window.open(moreviewurl + url, '_blank');
    } else {
      const moreviewurl = this.envr.authConfig.url;
      const url = moreviewurl +
        'main.aspx?etn=account&pagetype=entitylist&viewid=' + this.selectedTabId + '&viewtype=4230&navbar=off&cmdbar=false#436148839';
      console.log(url);
      window.open(url, '_blank');
    }
  }
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountListService.getActiveAccount(reqBody)
      .subscribe(async (activeRequest) => {
        console.log('active request response', (activeRequest.ResponseObject));
        if (!activeRequest.IsError) {
          this.isLoading = false;
          if (activeRequest.ResponseObject.length > 0) {
            this.AccountCreationActiveRequestsTable = [];
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
            this.ActiveAccountRequest = reqBody;
            await this.offlineServices.ClearActiveAccountIndexTableData();
            if (activeRequest.OdatanextLink) {
              this.ActiveAccountRequest.OdatanextLink = activeRequest.OdatanextLink;
            }
            await this.offlineServices.ClearActiveCampaignIndexTableData();
            this.ActiveAccountRequest.OdatanextLink = activeRequest.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountCreationActiveRequestsTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountCreationActiveRequestsTable.splice(this.AccountCreationActiveRequestsTable.indexOf(res), 1);
              });
              this.AccountCreationActiveRequestsTable = this.AccountCreationActiveRequestsTable
                .concat(this.getTableFilterData(activeRequest.ResponseObject));
            } else {
              this.AccountCreationActiveRequestsTable = this.getTableFilterData(activeRequest.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            this.store.dispatch(new farmingAccountAction({
              FarmingListModel: ImmutableObject.ResponseObject,
              count: activeRequest.TotalRecordCount,
              OdatanextLink: activeRequest.OdatanextLink
            }));
            this.tableTotalCount = activeRequest.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.tableTotalCount = 0;
            this.AccountCreationActiveRequestsTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1) {
            this.ActiveAccountRequest.RequestedPageNumber = this.ActiveAccountRequest.RequestedPageNumber - 1;
          }
        }
      },
        error => {
          this.isLoading = false;
        });
  }

  getTableFilterData(tabledata): Array<any> {
    if (tabledata) {
      if (tabledata.length > 0) {
        return tabledata.map((data => {
          return {
            Id: data.SysGuid,
            Name: this.accountListService.getSymbol(data.Name) || '',
            Number: data.Number || '',
            RANumber: data.RANumber || '',
            Parentaccount: (data.ParentAccount) ? (data.ParentAccount.Name) ? this.accountListService.getSymbol(data.ParentAccount.Name) : '' : '',
            Owner: (data.Owner && data.Owner.FullName) ? data.Owner.FullName : '',
            City: (data.Address.City && data.Address.City.Name) ? data.Address.City.Name : '',
            Country: (data.Address.Country && data.Address.Country.Name) ? data.Address.Country.Name : '',
            Classification: (data.Classification && data.Classification.Value) ? data.Classification.Value : '',
            Type: data.Type ? (data.Type.Value ? data.Type.Value : '') : '',
            Primary: data.IsPrimary ? 'Yes' : 'No',
            Sbu: (data.SBU && data.SBU.Name) ? data.SBU.Name : '',
            Vertical: (data.Vertical && data.Vertical.Name) ? data.Vertical.Name : '',
            Subvertical: (data.SubVertical && data.SubVertical.Name) ? data.SubVertical.Name : '',
            Countryreference: (data.CountryReference && data.CountryReference.Name) ? data.CountryReference.Name : '',
            Regionrefernce: data.Region ? data.Region.Name : '',
            Georeference: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
            index: data.index ? data.index : '',
            Status: data.Status ? data.Status : {}
          };
        }));
      }
    }
  }  /************Select Tabs dropdown code starts */
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
@Component({
  selector: 'saveview-popup',
  templateUrl: './savepopup.html',
})

export class SavePopup {
  submitted;
  accOwnerSwap;
  wiproContact4: {}[] = [
    { index: 0, contact: 'Wipro new template', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  ];
  selectedContact4: {}[] = [];
  constructor(public dialogRef: MatDialogRef<SavePopup>, public accservive: DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  /****************** List name autocomplete code start ****************** */
  showContact4 = false;
  contactName4 = '';
  contactNameSwitch4 = true;
  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  appendcontact4(value: string, i) {
    this.contactName4 = value;
    this.selectedContact4.push(this.wiproContact4[i]);
  }
  /****************** list name  autocomplete code end ****************** */
}
