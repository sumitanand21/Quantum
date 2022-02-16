import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { AccountListService } from '@app/core/services/accountList.service';
import { DatePipe } from '@angular/common';
import { OfflineService, OnlineOfflineService } from '@app/core/services';
import { Action } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { CreationHistoryState } from '@app/core/state/selectors/account/Creation-History.selector';
import { creationHistoryLists } from '@app/core/state/actions/Creation-History-List.action';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { environment as env } from '@env/environment';
import { DateModifier } from '@app/core/services/date-modifier';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-creation-history',
  templateUrl: './creation-history.component.html',
  styleUrls: ['./creation-history.component.scss']
})
export class CreationHistoryComponent implements OnInit {
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

  historyDataReq =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };
  tableTotalCount = 0;
  headerData: any;
  isLoading = false;
  CreationHistoryTable = [];
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestor: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requesttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Decisiondate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  roleAccess:boolean;//chethana added for bule patch alignments
  constructor(private offlineServices: OfflineService,
    public history: AccountService, public accListService: AccountListService,
    public router: Router, private datepipe: DatePipe, private onlineService: OnlineOfflineService,
    private store: Store<AppState>,
    private EncrDecr: EncrDecrService, public service: DataCommunicationService, public errorMessage: ErrorMessage,public envr : EnvService) { }

  async ngOnInit() {
    this.roleAccess  = this.service.getRoleAccess();//chethana added for bule patch alignments
    this.isLoading = true;

    this.GetAllHistory(this.historyDataReq, true);

    if (!this.onlineService.isOnline) {
      const CacheRes = await this.accListService.getCachedCreationHistory();
      if (CacheRes) {
        if (CacheRes.data.length > 0) {
          this.isLoading = false;
          this.CreationHistoryTable = this.getTableFilterData(CacheRes.data);
          this.tableTotalCount = CacheRes.count;
          this.historyDataReq.OdatanextLink = CacheRes.OdatanextLink;
        }
      }
    }
  }

  TablePagination(data) {
    this.historyDataReq.RequestedPageNumber = this.historyDataReq.RequestedPageNumber + 1;
    this.GetAllHistory(this.historyDataReq, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.historyDataReq.PageSize = event.itemsPerPage;
      this.historyDataReq.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.service.checkFilterListApiCall(event)) {
      //   this.CallListDataWithFilters(event);
      // } else {
      //   this.GetAllHistory(this.historyDataReq, true);

      // }
    } else if (event.action === 'search') {
      this.historyDataReq = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }

  // SearchTable(data): void {
  //   this.historyDataReq.RequestedPageNumber = 1;
  //   this.historyDataReq.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accListService.accountSearch(searchData, 4, this.historyDataReq.PageSize,
  //         this.historyDataReq.OdatanextLink, this.historyDataReq.RequestedPageNumber).subscribe(res => {
  //           if (!res.IsError) {
  //             if (res.ResponseObject.length > 0) {
  //               this.CreationHistoryTable = this.getTableFilterData(res.ResponseObject);
  //               let i = 1;
  //               this.CreationHistoryTable.map(res => {
  //                 res.index = i;
  //                 i = i + 1;
  //               });
  //               this.historyDataReq.OdatanextLink = res.OdatanextLink;
  //               this.tableTotalCount = res.TotalRecordCount;
  //             } else {
  //               this.CreationHistoryTable = [{}];
  //               this.tableTotalCount = 0;
  //             }
  //           }
  //         });
  //     } else {
  //       this.GetAllHistory(this.historyDataReq, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ?
        this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    var actionRequired = childActionRecieved;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    // let obj = { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {
      case 'Name': {
        console.log(actionRequired);
        // this.accListService.setUrlParamsInStorage('acc_req', actionRequired.objectRowData[0].id);
        this.accListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id })
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        // this.router.navigate(['/accounts/accountdetails',actionRequired.objectRowData[0].id]);
        return;
      }
      case 'view modification': {
        this.accListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id })
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id })
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
          return;
        }
      case 'review':
        {
          this.accListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id })
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
        this.historyDataReq.OdatanextLink = '';
        this.historyDataReq.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
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
        this.historyDataReq.OdatanextLink = '';
        this.historyDataReq.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.historyDataReq, true);
        break;
      }

    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    reqparam['IsFilterApplied'] = this.service.checkFilterListApiCall(data) ? true : false;
    this.accListService.getFilterList(reqparam, true, 'CreationHistory').subscribe(res => {

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
    this.historyDataReq.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.historyDataReq.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.historyDataReq.OdatanextLink = '';
          this.historyDataReq.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.historyDataReq.OdatanextLink = '';
          this.historyDataReq.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllHistory(this.historyDataReq, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accListService.getFilterList(reqparam, false, 'FilterCreationHistory').subscribe(res => {
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
              this.CreationHistoryTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.CreationHistoryTable = [...this.CreationHistoryTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.CreationHistoryTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.CreationHistoryTable = this.getTableFilterData(res.ResponseObject);
          this.historyDataReq.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.CreationHistoryTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.CreationHistoryTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'UserGuid': this.historyDataReq.Guid ? this.historyDataReq.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.historyDataReq.PageSize : 10,
      'RequestedPageNumber': this.historyDataReq.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'Status': this.service.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      'RequestedBy': this.service.pluckParticularKey(data.filterData.filterColumn['Requestor'], 'id'),
      'RequestType': this.service.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      'Owner': this.service.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      'Type': this.service.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      'AccountNumber': this.service.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      // 'RequestDate': this.service.pluckParticularKey(data.filterData.filterColumn['Requestdate'], 'date'),
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterEndDate) : '' : '',
      'Geo': this.service.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Vertical': this.service.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SBU': this.service.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.service.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),
      'DecissionStartDate': (data.filterData) ? (data.filterData.filterColumn['Decisiondate'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Decisiondate'][0].filterStartDate) : '' : '',
      'DecissionEndDate': (data.filterData) ? (data.filterData.filterColumn['Decisiondate'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Decisiondate'][0].filterEndDate) : '' : '',
      // 'DecissionStartDate': this.getLocaleDateFormat(data.filterData.filterColumn.Decisiondate[0].filterStartDate),
      // 'DecissionEndDate': this.getLocaleDateFormat(data.filterData.filterColumn.Decisiondate[0].filterEndDate),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Requesttype") {
        acc.push("RequestType");
      }
      else if (d.name == "Requestdate") {
        acc.push("RequestedDate");
      }
      else if (d.name == "Decisiondate") {
        acc.push("DecisionDate");
      }
      else if(d.name == "Sbu") {
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
      case 'Requestor':
        return 2;


      default:
        return '';
    }
  }
  getSearchType(columName) {

    switch (columName) {

      case 'Geo':
        return 3;
      case 'Vertical':
        return 3;
      case 'Sbu':
        return 3;
      case 'Subvertical':
        return 3;
      case 'Requestor':
        return 3;
      case 'Owner':
        return 2;
      case 'Type':
        return 2;
      case 'Requesttype':
        return 2;
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
        guid: this.historyDataReq.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      this.accListService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'AccountcreateHistory').subscribe(res => {
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
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]['data'],
          data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (data.action === 'columnFilter' &&
        data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]['data'].length <= 0) {
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
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    let reqbody;
    reqbody = {
      "UserGuid":reqBody.Guid,
      "Guid": reqBody.Guid,
      "SortBy": "",
      "IsDesc": false,
      "PageSize": reqBody.PageSize,
      "RequestedPageNumber": reqBody.RequestedPageNumber,
      "SearchText": "",
      "Name": [],
      "Status": [],
      "RequestedBy": [],
      "RequestType": [],
      "Owner": [],
      "Type": [],
      "AccountNumber": [],
      "StartDate": "",
      "EndDate": "",
      "Geo": [],
      "Vertical": [],
      "SBU": [],
      "SubVertical": [],
      "DecissionStartDate": "",
      "DecissionEndDate": ""
    }
    this.accListService.getALLAccountList(reqbody)
      .subscribe(async (accountHistory) => {
        if (!accountHistory.IsError) {
          this.isLoading = false;
          if (accountHistory.ResponseObject.length > 0) {
            this.CreationHistoryTable = [];
            const ImmutableObject = Object.assign({}, accountHistory);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            accountHistory.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (accountHistory.OdatanextLink) {
              this.historyDataReq.OdatanextLink = accountHistory.OdatanextLink;
            }
            this.historyDataReq = reqBody;
            await this.offlineServices.ClearCreationHistoryIndexTableData();
            this.historyDataReq.OdatanextLink = accountHistory.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.CreationHistoryTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.CreationHistoryTable.splice(this.CreationHistoryTable.indexOf(res), 1);
              });
              this.CreationHistoryTable = this.CreationHistoryTable.concat(this.getTableFilterData(accountHistory.ResponseObject));
            } else {
              this.CreationHistoryTable = this.getTableFilterData(accountHistory.ResponseObject);
            }

            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            console.log('Immutable object is', ImmutableObject.ResponseObject,
              accountHistory.TotalRecordCount, accountHistory.OdatanextLink);
            this.store.dispatch(new creationHistoryLists({
              CreationHistoryModel: ImmutableObject.ResponseObject,
              count: accountHistory.TotalRecordCount, OdatanextLink: accountHistory.OdatanextLink
            }));
            this.tableTotalCount = accountHistory.TotalRecordCount;
          } else {
            this.tableTotalCount = 0;
            this.isLoading = false;
            this.CreationHistoryTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1) {
            this.historyDataReq.RequestedPageNumber = this.historyDataReq.RequestedPageNumber - 1;
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
        return tableData.map((history => {
          return {
            id: history.SysGuid,
            Name: this.accListService.getSymbol(history.Name) || 'NA',
            Requesttype: history.RequestType.Value || 'NA',
            Number: history.Number || 'NA',
            Requestdate: history.RequestDate ? history.RequestDate : 'NA',
            Status: (history.Status && history.Status.Value) ? history.Status.Value : 'NA',
            Type: history.Type.Value || 'NA',
            Owner: (history.Owner && history.Owner.FullName) ? history.Owner.FullName : 'NA',
            Sbu: (history.SBU && history.SBU.Name) ? history.SBU.Name : 'NA',
            Vertical: (history.Vertical && history.Vertical.Name) ? history.Vertical.Name : 'NA',
            Requestor: (history.CreatedBy && history.CreatedBy.FullName) ? history.CreatedBy.FullName : 'NA',
            Subvertical: (history.SubVertical && history.SubVertical.Name) ? history.SubVertical.Name : 'NA',
            Geo: history.Geo ? history.Geo.Name : 'NA',
            isCheccked: false,
            isExpanded: false,
            overviewBtnVisibility: true,
            viewBtnVisibility: false,
            historyBtnVisibility: false,
            ApprovedRejStatus: history.Status.Value + ' By: ' + history.ApprovedRejectedBy.FullName,
            statusclass: this.getStatus(history.Status ? history.Status.Value : 'NA'),
            OverAllComments: history.OverAllComments,
            index: history.index,
            Decisiondate: history.DecissionDate ? history.DecissionDate : 'NA'
          };
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
    }
  }
}
