import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { AccountListService } from '@app/core/services/accountList.service';
import { DatePipe } from '@angular/common';
import { OfflineService, OnlineOfflineService } from '@app/core/services';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { assignmentRefCreationHistoryLists } from '@app/core/state/actions/assignmentRef.action';
import { AssignmentRefHistoryState } from '@app/core/state/selectors/account/assignmentRef.selector';
import { DataCommunicationService, ErrorMessage } from '@app/core';
// import { CreationHistory } from '../state.models/accounts/creationHistory.interface';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-assig-creation-history',
  templateUrl: './assig-creation-history.component.html',
  styleUrls: ['./assig-creation-history.component.scss']
})
export class AssigCreationHistoryComponent implements OnInit {
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

  historyDataReq =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };


  tableTotalCount: number = 0;
  headerData: any;
  isLoading: boolean = false;
  // OdatanextLink;
  assignmentRefHistoryTable = [];
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

  constructor(private offlineServices: OfflineService,
    public history: AccountService, public accListService: AccountListService,
    public router: Router, private datepipe: DatePipe, private onlineService: OnlineOfflineService,
    private store: Store<AppState>,
    private EncrDecr: EncrDecrService, public accservive: DataCommunicationService, public errorMessage: ErrorMessage,public envr : EnvService) { }

  async ngOnInit() {
    // console.log('input test-->', this.historyDataReq)
    this.isLoading = true;
    // this.store.pipe(select(AssignmentRefHistoryState)).subscribe(res => {
    //   // console.log("creation history response", res);
    //   if (res) {
    //     if (res.ids.length > 0) {
    //       this.isLoading = false;
    //       this.assignmentRefHistoryTable = this.getTableFilterData(Object.values(res.entities));
    //       this.assignmentRefHistoryTable.map((res, index) => {
    //         res.index = index + 1;
    //       });
    //       this.tableTotalCount = res.count;
    //       this.historyDataReq.OdatanextLink = res.OdatanextLink;
    //     } else {
    //       console.log('length issue');
    //       this.GetAllHistory(this.historyDataReq, true);
    //     }
    //   } else {
    //     console.log('store empty');
        this.GetAllHistory(this.historyDataReq, true);
    //   }
    // });
    // if (!this.onlineService.isOnline) {
    //   const CacheRes = await this.accListService.getCachedCreationHistory();
    //   if (CacheRes) {
    //     if (CacheRes.data.length > 0) {
    //       this.isLoading = false;
    //       this.assignmentRefHistoryTable = this.getTableFilterData(CacheRes.data);
    //       this.tableTotalCount = CacheRes.count;
    //       this.historyDataReq.OdatanextLink = CacheRes.OdatanextLink;
    //     }
    //   }
    // }
  }

  TablePagination(data) {
    this.historyDataReq.RequestedPageNumber = this.historyDataReq.RequestedPageNumber + 1;
    this.GetAllHistory(this.historyDataReq, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.historyDataReq.PageSize = event.itemsPerPage;
      this.historyDataReq.RequestedPageNumber = event.currentPage;
      // this.GetAllHistory(this.historyDataReq, true);
      this.CallListDataWithFilters(event);
      // if (this.accservive.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
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
  //       this.accListService.accountSearch(searchData, 4, this.historyDataReq.PageSize, this.historyDataReq.OdatanextLink, this.historyDataReq.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.assignmentRefHistoryTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.assignmentRefHistoryTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.historyDataReq.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.assignmentRefHistoryTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.historyDataReq, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    // let obj = { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {
      case 'Name': {
        console.log(actionRequired);
        // this.accListService.setUrlParamsInStorage('assign_ref', actionRequired.objectRowData[0].id);
        this.accListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        // this.router.navigate(['/accounts/accountdetails',actionRequired.objectRowData[0].id]);
        return;
      }
      case 'Number': {
        this.accListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.accListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.accListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
          return;
        }
      case 'review':
        {
          this.accListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
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
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accListService.getFilterList(reqparam, true, 'CreationHistoryAssignmentReference').subscribe(res => {

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
        // debugger
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.historyDataReq.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        this.historyDataReq.OdatanextLink = '';
        this.historyDataReq.RequestedPageNumber = 1;
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
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
  CallListDataWithFilters(data) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accListService.getFilterList(reqparam, false, 'FilterAssignmentReferenceHistory').subscribe(res => {
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

          this.assignmentRefHistoryTable = this.getTableFilterData(res.ResponseObject);
          this.historyDataReq.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.assignmentRefHistoryTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.assignmentRefHistoryTable = [{}];
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
      'AccountNumber': this.accservive.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      'Status': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      // 'RequestDate': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requestdate'], 'date'),
      'StartDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterStartDate),
      'EndDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterEndDate),
      'Geo': this.accservive.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Region': this.accservive.pluckParticularKey(data.filterData.filterColumn['Region'], 'id'),
      'Vertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      // 'SBU':  this.accservive.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id')



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
        return 2;
      case 'Geo':
        return 5;
      case 'Vertical':
        return 5;
      // case 'Sbu':
      //   return 4;
      case 'Subvertical':
        return 5;
        case 'Region':
          return 2;
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
        guid: this.historyDataReq.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      this.accListService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'assignCreateHistory').subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,

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
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.accListService.getAllAssignmentRefList(reqBody)
      .subscribe(async (accountHistory) => {
        console.log('assignment reference response..', accountHistory);
        if (!accountHistory.IsError) {
          this.isLoading = false;
          if (accountHistory.ResponseObject.length > 0) {
            this.assignmentRefHistoryTable = [];
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
            //    await this.offlineServices.ClearCreationHistoryIndexTableData()
            this.historyDataReq.OdatanextLink = accountHistory.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.assignmentRefHistoryTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.assignmentRefHistoryTable.splice(this.assignmentRefHistoryTable.indexOf(res), 1);
              });
              this.assignmentRefHistoryTable = this.assignmentRefHistoryTable.concat(this.getTableFilterData(accountHistory.ResponseObject));
              console.log('assignment history table if concat', this.assignmentRefHistoryTable);

            } else {
              this.assignmentRefHistoryTable = this.getTableFilterData(accountHistory.ResponseObject);
            }
            console.log('assignment history table', this.assignmentRefHistoryTable);

            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            console.log('Immutable object is', ImmutableObject.ResponseObject, accountHistory.TotalRecordCount, accountHistory.OdatanextLink);
            this.store.dispatch(new assignmentRefCreationHistoryLists({ AssignmentCreationHistoryModel: ImmutableObject.ResponseObject, count: accountHistory.TotalRecordCount, OdatanextLink: 'abcd' }));
            // this.offlineServices.addActiveCampaignCacheData(this.campaignSerivce.CampaignChacheType.Table, this.campaignTable, campaignList.TotalRecordCount)
            this.tableTotalCount = accountHistory.TotalRecordCount;
          } else {
            this.tableTotalCount = 0;
            this.isLoading = false;
            this.assignmentRefHistoryTable = [{}];
          }
        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.historyDataReq.RequestedPageNumber = this.historyDataReq.RequestedPageNumber - 1;
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
            index: history.index,
            id: history.SysGuid,
            Number: history.Number || 'NA',
            Requesttype: history.Status.Value || 'NA',
            // Requestdate: this.datepipe.transform(history.CreatedOn, 'd-MMM-y') || 'NA',
            Requestdate: history.CreatedOn ? history.CreatedOn : 'NA',
            Owner: history.Owner ? history.Owner.FullName : 'NA',
            Vertical: history.Vertical ? history.Vertical.Name : 'NA',
            Subvertical: history.SubVertical ? history.SubVertical.Name : 'NA',
            Geo: history.Geo ? history.Geo.Name : 'NA',
            Region: history.Region ? history.Region.Name : 'NA',


            Status: history.Status ? history.Status.Value : "NA",
            // Classification: history.Type.Value || "NA",
            // Sbu: history.SBU ? history.SBU.Name : "NA",
            Requestor: history.CreatedBy ? history.CreatedBy.FullName : "NA",

            isCheccked: false,
            isExpanded: false,
            overviewBtnVisibility: true,
            viewBtnVisibility: false,
            historyBtnVisibility: false,
            // ApprovedRejectedBy : history.ApprovedRejectedBy &&  history.ApprovedRejectedBy.FullName ? history.ApprovedRejectedBy.FullName : "NA",
            ApprovedRejectedBy: history.Status.Value + " By: " + history.ApprovedRejectedBy.FullName,
            // statusclass:  "approved||rejected||pending",
            statusclass: this.getStatus(history.Status ? history.Status.Value : "NA"),
            OverAllComments: history.Comment,
            MapGuid: history.MapGuid,
            RequestdateFOrAssignmentStaus: history.CreatedOn ? history.CreatedOn : "NA"
            //toolTip: 'ApprovedRejStatus'
            // index:history.index,

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
