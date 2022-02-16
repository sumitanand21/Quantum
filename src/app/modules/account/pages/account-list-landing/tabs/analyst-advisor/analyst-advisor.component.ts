import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { AccountListService } from '@app/core/services/accountList.service';
import { AppState } from '@app/core/state';
import { Store } from '../../../../../../../../node_modules/@ngrx/store';
import { AllianceAccountAction } from '@app/core/state/actions/alliance-account-list.action';
import { AllianceRequestState } from '@app/core/state/selectors/account/allianceAccount.selector';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-analyst-advisor',
  templateUrl: './analyst-advisor.component.html',
  styleUrls: ['./analyst-advisor.component.scss']
})
export class AnalystAdvisorComponent implements OnInit {
  selectedTabValue = 'Alliance';
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
  AccountCreationAllianceTable = [];
  tableTotalCount: number;
  tabList2;
  isLoading = false;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  allianceReqBody = {
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
  constructor(public alliance: AccountService,
    public router: Router,
    public envr : EnvService,
    private AccountAllianceServ: AccountListService,
    private store: Store<AppState>,
    private onlineOfflineService: OnlineOfflineService,
    public service: DataCommunicationService,
    private EncrDecr: EncrDecrService, public errorMessage: ErrorMessage) { }
  // api call to here
  async ngOnInit() {
    localStorage.setItem('routeValue', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 13, 'DecryptionDecrip'))
    const roleguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleGuid'), 'DecryptionDecrip');
    const reqBody = {
      'roleGuid': 'f48b192c-cc22-e911-a94d-000d3aa053b9'
    };
    reqBody.roleGuid = roleguid;
    this.tabList2 = await this.AccountAllianceServ.getCustomDropdown(reqBody);
    console.log('in farming', this.tabList2);
    if (this.tabList2.length > 0) {
      const local = this.tabList2[0].GroupData.filter(x => x.PinId === 13)[0];
      this.selectedTabId = local.id;
      console.log('in oninit farming', this.selectedTabId);
    }
    const orginalArray = this.AccountAllianceServ.getAdvisoryRAnalystAccounts(this.allianceReqBody);
    orginalArray.subscribe((res: any) => {
      if (res) {
        if (res.ResponseObject.length > 0) {
          this.AccountCreationAllianceTable = this.getTableFilterData(Object.values(res.ResponseObject));
          this.AccountCreationAllianceTable.map((resp, index) => {
            resp.index = index + 1;
          });
          this.tableTotalCount = res.TotalRecordCount;
          this.allianceReqBody.OdatanextLink = res.OdatanextLink;
        } else {
          this.GetAllHistory(this.allianceReqBody, true);
        }
      } else {
        this.GetAllHistory(this.allianceReqBody, true);
      }
    });
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.AccountAllianceServ.getCachedAllianceAccount();
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.AccountCreationAllianceTable = this.getTableFilterData(CacheResponse.data);
          this.tableTotalCount = CacheResponse.count;
          this.allianceReqBody.OdatanextLink = CacheResponse.OdatanextLink;
        }
      }
    }
  }
  TablePagination(data) {
    this.allianceReqBody.RequestedPageNumber = this.allianceReqBody.RequestedPageNumber + 1;
    this.GetAllHistory(this.allianceReqBody, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.allianceReqBody.PageSize = event.itemsPerPage;
      this.allianceReqBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.service.checkFilterListApiCall(event)) {
      //   // filter api call
      //   this.CallListDataWithFilters(event);
      // } else {
      //   // list api call
      //   this.GetAllHistory(this.allianceReqBody, true);
      // }
    } else if (event.action === 'search') {
      this.allianceReqBody = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }
  // SearchTable(data): void {
  //   this.allianceReqBody.RequestedPageNumber = 1;
  //   this.allianceReqBody.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       // tslint:disable-next-line:max-line-length
  //       this.AccountAllianceServ.accountSearch(searchData, 10, this.allianceReqBody.PageSize, this.allianceReqBody.OdatanextLink, this.allianceReqBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountCreationAllianceTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountCreationAllianceTable.map(resp => {
  //               resp.index = i;
  //               i = i + 1;
  //             });
  //             this.allianceReqBody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.AccountCreationAllianceTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.allianceReqBody, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      // tslint:disable-next-line:max-line-length
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'Name': {
        // tslint:disable-next-line:max-line-length
        const accountcontacts = {
          'Name': actionRequired.objectRowData[0].Name,
          'SysGuid': actionRequired.objectRowData[0].id,
          'isProspect': false,
          'Classification': actionRequired.objectRowData[0].Classification || "NA",
          'Status': actionRequired.objectRowData[0].Status ? actionRequired.objectRowData[0].Status: "Active"
        };
        const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
        localStorage.setItem('selAccountObj', temp);
        sessionStorage.setItem('selAccountObj', temp);
        this.AccountAllianceServ.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'review':
        {
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search':
        {
          this.allianceReqBody.OdatanextLink = '';
          this.allianceReqBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(childActionRecieved);
          // this.SearchTable(childActionRecieved);
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
        this.allianceReqBody.OdatanextLink = '';
        this.allianceReqBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.allianceReqBody, true);
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
    this.AccountAllianceServ.commonPostObject(reqbody, 'PinView').subscribe((res: any) => {
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
    this.AccountAllianceServ.getFilterList(reqparam, true, 'AdvisorRAnalystAccountsList').subscribe(res => {
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
    this.allianceReqBody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.allianceReqBody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.allianceReqBody.OdatanextLink = '';
          this.allianceReqBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.allianceReqBody.OdatanextLink = '';
          this.allianceReqBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);
          } else {
            this.GetAllHistory(this.allianceReqBody, true);
          }
        }
      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.AccountAllianceServ.getFilterList(reqparam, false, 'FilterAdvisorRAnalystAccounts').subscribe(res => {
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
          // this.AccountCreationAllianceTable = this.getTableFilterData(res.ResponseObject);
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.AccountCreationAllianceTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountCreationAllianceTable = [...this.AccountCreationAllianceTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountCreationAllianceTable = this.getTableFilterData(res.ResponseObject);
          }
          this.allianceReqBody.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.AccountCreationAllianceTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AccountCreationAllianceTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.allianceReqBody.PageSize : 10,
      'RequestedPageNumber': this.allianceReqBody.RequestedPageNumber,
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
        return 0;
    }
  }
  getSearchType(columName) {
    switch (columName) {
      case 'Type':
        return 3;
      case 'Status':
        return 3;
      case 'Owner':
        return 3;
      case 'Geo':
        return 3;
      case 'Vertical':
        return 3;
      case 'Sbu':
        return 3;
      case 'Subvertical':
        return 3;
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
        guid: this.allianceReqBody.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      // tslint:disable-next-line:max-line-length
      this.AccountAllianceServ.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'SearchFilterAPIChange', 'advisor').subscribe(res => {
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
    const title = data.objectRowData ? data.objectRowData.title : data.title;
    if (data.objectRowData.PinId === 11) {
      this.router.navigateByUrl('/accounts/accountlist/farming');
    } else if (data.objectRowData.PinId === 12) {
      this.router.navigateByUrl('/accounts/accountlist/alliance');
    } else if (data.objectRowData.PinId === 14) {
      this.router.navigateByUrl('/accounts/accountlist/reserve');
    } else if (data.objectRowData.title === 'More views') {
      const url = '/accounts/accountlist/moreview';
      const moreviewurl = this.envr.outlookConfig.redirectUri;
      window.open(moreviewurl + url, '_blank');
    } else if (data.objectRowData.PinId === 13) {
      return;
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
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.AccountAllianceServ.getAdvisoryRAnalystAccounts(reqBody)
      .subscribe(async (activeRequest) => {
        if (!activeRequest.IsError) {
          this.isLoading = false;
          if (activeRequest.ResponseObject.length > 0) {
            this.AccountCreationAllianceTable = [];
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
              this.allianceReqBody.OdatanextLink = activeRequest.OdatanextLink;
            }
            this.allianceReqBody = reqBody;
            this.allianceReqBody.OdatanextLink = activeRequest.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountCreationAllianceTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountCreationAllianceTable.splice(this.AccountCreationAllianceTable.indexOf(res), 1);
              });
              // tslint:disable-next-line:max-line-length
              this.AccountCreationAllianceTable = this.AccountCreationAllianceTable.concat(this.getTableFilterData(activeRequest.ResponseObject));
            } else {
              this.AccountCreationAllianceTable = this.getTableFilterData(activeRequest.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            this.tableTotalCount = activeRequest.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.AccountCreationAllianceTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1) {
            this.allianceReqBody.RequestedPageNumber = this.allianceReqBody.RequestedPageNumber - 1;
          }
        }
      },
        error => {
          this.isLoading = false;
        });
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((alliance => {
          return {
            id: alliance.SysGuid,
            Name: (alliance.Name) ? this.AccountAllianceServ.getSymbol(alliance.Name) : '',
            Number: alliance.Number || '',
            Status: (alliance.Status && alliance.Status.Value) ? alliance.Status.Value : '',
            Type: (alliance.Type && alliance.Type.Value) ? alliance.Type.Value : '',
            Owner: (alliance.Owner && alliance.Owner.FullName) ? alliance.Owner.FullName : '',
            Sbu: (alliance.SBU && alliance.SBU.Name) ? alliance.SBU.Name : '',
            Vertical: (alliance.Vertical && alliance.Vertical.Name) ? alliance.Vertical.Name : '',
            Subvertical: (alliance.SubVertical && alliance.SubVertical.Name) ? alliance.SubVertical.Name : '',
            Geo: (alliance.Geo && alliance.Geo.Name) ? alliance.Geo.Name : '',
            index: alliance.index,
            Classification: (alliance.Classification && alliance.Classification.Value) ? alliance.Classification.Value : '',
          };
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  // End
  // End Here
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
