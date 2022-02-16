import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AccountListService } from '@app/core/services/accountlist.service';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ModificationHistoryActions } from '@app/core/state/actions/modification-history-list.actions';
import { ModificationHistoryRequestState } from '@app/core/state/selectors/account/modificationHistoryList';
import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { environment as env } from '@env/environment';
import { DateModifier } from '@app/core/services/date-modifier';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-modification-history',
  templateUrl: './modification-history.component.html',
  styleUrls: ['./modification-history.component.scss']
})
export class ModificationHistoryComponent implements OnInit {
  tableTotalCount: number = 0;
  headerData: any;
  isLoading: boolean = false;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  ModificationHistoryRequestBody =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };
  ModificationHistoryTable = [];
  filterConfigData = {
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requesttype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestor: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Requestdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  roleAccess:boolean;//chethana added for bule patch alignments
  constructor(public history: AccountService,
    public router: Router, public dialog: MatDialog,
    private datepipe: DatePipe,
    private accountlistService: AccountListService,
    private store: Store<AppState>,
    private onlineOfflineService: OnlineOfflineService,
    private EncrDecr: EncrDecrService, public accservive: DataCommunicationService, public errorMessage: ErrorMessage,public envr : EnvService) { }

  async ngOnInit(): Promise<void> {
    this.roleAccess  = this.accservive.getRoleAccess();//chethana added for bule patch alignments
    this.isLoading = true;
      if (this.history.loggedin_user === 'sbu') {
      let orginalArray = this.history.getAllModificationActiveRequestsSBU();

      orginalArray.subscribe((x: any[]) => {
        this.ModificationHistoryTable = x;

      });
    }
    if (this.history.loggedin_user === 'cso') {
      var orginalArray = this.history.getAllModificationActiveRequestsCSO();

      orginalArray.subscribe((x: any[]) => {
        this.ModificationHistoryTable = x;

      });
    }
    else {
      // var orginalArray1 = this.accountlistService.getModificationCreationHistoryRequest(this.ModificationHistoryRequestBody);
      // orginalArray1.subscribe((res: any) => {
      //   if (res && !res.IsError && res.ResponseObject) {
      //     if (res.ResponseObject.length > 0) {
      //       this.isLoading = false;
      //       this.ModificationHistoryTable = this.getTableFilterData(Object.values(res.ResponseObject))
      //       this.ModificationHistoryTable.map((res, index) => {
      //         res.index = index + 1;
      //       });
      //       this.tableTotalCount = res.TotalRecordCount;
      //       this.ModificationHistoryRequestBody.OdatanextLink = res.OdatanextLink;
      //     }
      //     else {
      //        this.GetAllHistory(this.ModificationHistoryRequestBody,  true)
      //     }
      //   } else {
      //     // this.GetAllhistorys(this.ActivehistoryRequestbody, true)
      //   }
      //   //  this.ModificationActiveRequestTable = res;
      // });
      // this.store.pipe(select(ModificationHistoryRequestState)).subscribe(

      //   res => {
      //     this.isLoading = true;
      //     if (res) {
      //       if (res.ids.length > 0) {
      //         console.log('response from store ', res);
      //         this.isLoading = false;
      //         this.ModificationHistoryTable = this.getTableFilterData(Object.values(res.entities));
      //         this.ModificationHistoryTable.map((res, index) => {
      //           res.index = index + 1;
      //         });
      //         this.tableTotalCount = res.count;
      //         this.ModificationHistoryRequestBody.OdatanextLink = res.OdatanextLink;
      //       } else {
      //         this.GetAllHistory(this.ModificationHistoryRequestBody, true);
      //       }
      //     } else {
            this.GetAllHistory(this.ModificationHistoryRequestBody, true);
      //     }

      //   }
      // );
      // if (!this.onlineOfflineService.isOnline) {
      //   const CacheRes = await this.accountlistService.getCachedCreationHistory();
      //   if (CacheRes) {
      //     if (CacheRes.data.length > 0) {
      //       this.isLoading = false;
      //       this.ModificationHistoryTable = this.getTableFilterData(CacheRes.data);
      //       this.tableTotalCount = CacheRes.count;
      //       this.ModificationHistoryRequestBody.OdatanextLink = CacheRes.OdatanextLink;
      //     }
      //   }
      // }
    }


  }

  TablePagination(data) {

    this.ModificationHistoryRequestBody.RequestedPageNumber = this.ModificationHistoryRequestBody.RequestedPageNumber + 1;

    this.GetAllHistory(this.ModificationHistoryRequestBody, true);

  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ModificationHistoryRequestBody.PageSize = event.itemsPerPage;
      this.ModificationHistoryRequestBody.RequestedPageNumber = event.currentPage;
      // if (this.accservive.checkFilterListApiCall(event)) {

      //   //filter api call
        this.CallListDataWithFilters(event,true);
      // }
      // else {

      //   //list api call
      //   this.GetAllHistory(this.ModificationHistoryRequestBody, true);
      // }
    } else if (event.action === 'search') {
      this.ModificationHistoryRequestBody = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }

  // SearchTable(data): void {
  //   this.ModificationHistoryRequestBody.RequestedPageNumber = 1;
  //   this.ModificationHistoryRequestBody.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.accountSearch(searchData, 7, this.ModificationHistoryRequestBody.PageSize, this.ModificationHistoryRequestBody.OdatanextLink, this.ModificationHistoryRequestBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.ModificationHistoryTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.ModificationHistoryTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.ModificationHistoryRequestBody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.ModificationHistoryTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.ModificationHistoryRequestBody, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
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
        this.ModificationHistoryRequestBody.OdatanextLink = '';
        this.ModificationHistoryRequestBody.RequestedPageNumber = 1;
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
        this.ModificationHistoryRequestBody.OdatanextLink = '';
        this.ModificationHistoryRequestBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.ModificationHistoryRequestBody, true);
        break;
      }
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'CreationHistoryModification').subscribe(res => {

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
    this.ModificationHistoryRequestBody.OdatanextLink = '';
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
        this.ModificationHistoryRequestBody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
          this.ModificationHistoryRequestBody.OdatanextLink = '';
          this.ModificationHistoryRequestBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.ModificationHistoryRequestBody.OdatanextLink = '';
          this.ModificationHistoryRequestBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllHistory(this.ModificationHistoryRequestBody, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterModificationCreationHistory').subscribe(res => {
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
              this.ModificationHistoryTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.ModificationHistoryTable = [...this.ModificationHistoryTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.ModificationHistoryTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.ModificationHistoryTable = this.getTableFilterData(res.ResponseObject);
          this.ModificationHistoryRequestBody.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.ModificationHistoryTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.ModificationHistoryTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'UserGuid': this.ModificationHistoryRequestBody.Guid ? this.ModificationHistoryRequestBody.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.ModificationHistoryRequestBody.PageSize : 10,
      'RequestedPageNumber': this.ModificationHistoryRequestBody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'AccountNumber': this.accservive.pluckParticularKey(data.filterData.filterColumn['Number'], 'name'),
      'RequestType': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requesttype'], 'id'),
      'Owner': this.accservive.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
      'Name': this.accservive.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname'),
      'Type': this.accservive.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      'Status': this.accservive.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      'RequestedBy': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requestor'], 'id'),
      // 'RequestDate': this.accservive.pluckParticularKey(data.filterData.filterColumn['Requestdate'], 'date'),
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['Requestdate'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Requestdate'][0].filterEndDate) : '' : '',
      'Geo': this.accservive.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      'Vertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id'),
      'SBU': this.accservive.pluckParticularKey(data.filterData.filterColumn['Sbu'], 'id'),
      'SubVertical': this.accservive.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],
    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Requestdate") {
        acc.push("RequestDate");
      }
      else if (d.name == "Requesttype") {
        acc.push("RequestType");
      }
      else if (d.name == "Sbu") {
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
        return 2;
      case 'Vertical':
        return 2;
      case 'Sbu':
        return 2;
      case 'Subvertical':
        return 2;
      case 'Requestor':
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
        guid: this.ModificationHistoryRequestBody.Guid,
        statusCode: 0,
        Searchtype: this.getSearchType(headerName)
      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'modificationCreateHistory').subscribe(res => {
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
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    let reqbody;
    reqbody = {
      "UserGuid":reqBody.Guid,
      "SortBy":"",
      "IsDesc":false,
      "PageSize":reqBody.PageSize,
      "RequestedPageNumber":reqBody.RequestedPageNumber,
      "SearchText":"",
      "Name":[],
      "Status":[],
      "Type":[],"Owner":[],
      "RequestType":[],
      "Geo":[],"Vertical":[],
      "SBU":[],"SubVertical":[],
      "Guid":reqBody.Guid,
      "ColumnSearchText":"",
      "OdatanextLink":reqBody.OdatanextLink,
      "SearchType":""
    }
    this.accountlistService.getModificationCreationHistoryRequest(reqbody)
      .subscribe(async (modificationactive) => {

        if (!modificationactive.IsError) {
          this.isLoading = false;
          if (modificationactive.ResponseObject.length > 0) {
            this.ModificationHistoryTable = [];
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
            console.log(modificationactive);

            if (modificationactive.OdatanextLink) {
              this.ModificationHistoryRequestBody.OdatanextLink = modificationactive.OdatanextLink;
            }
            this.ModificationHistoryRequestBody = reqBody;

            //    await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.ModificationHistoryRequestBody.OdatanextLink = modificationactive.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.ModificationHistoryTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.ModificationHistoryTable.splice(this.ModificationHistoryTable.indexOf(res), 1);
              });
              this.ModificationHistoryTable = this.ModificationHistoryTable.concat(this.getTableFilterData(modificationactive.ResponseObject));
            } else {
              this.ModificationHistoryTable = this.getTableFilterData(modificationactive.ResponseObject);

            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);

            this.store.dispatch(new ModificationHistoryActions({ ModificationHistoryModel: ImmutableObject.ResponseObject, count: modificationactive.TotalRecordCount, OdatanextLink: modificationactive.OdatanextLink }));

            // this.offlineServices.addActiveCampaignCacheData(this.campaignSerivce.CampaignChacheType.Table, this.campaignTable, campaignList.TotalRecordCount)
            this.tableTotalCount = modificationactive.TotalRecordCount;
          } else {
            this.tableTotalCount = 0;
            this.isLoading = false;
            this.ModificationHistoryTable = [{}];
          }

        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.ModificationHistoryRequestBody.RequestedPageNumber = this.ModificationHistoryRequestBody.RequestedPageNumber - 1;
        }
      },
        error => {
          this.isLoading = false;
        });

  }
  getTableFilterData(tableData): Array<any> {

    if (tableData) {

      if (tableData.length > 0) {
        return tableData.map((modificationhistory => {
          console.log(modificationhistory);

          return {
            id: modificationhistory.SysGuid,
            Name: this.accountlistService.getSymbol(modificationhistory.Name) || '',
            Number: modificationhistory.Number || '',
            // Type: modificationhistory.Type? modificationhistory.Type.Value:'NA',
            Requesttype: (modificationhistory.RequestType && modificationhistory.RequestType.Value) ? modificationhistory.RequestType.Value : '',
            Requestdate: modificationhistory.RequestDate ? modificationhistory.RequestDate : '',
            // Requestdate: this.datepipe.transform(modificationhistory.RequestDate, 'd-MMM-y') || 'NA',
            Status: (modificationhistory.Status && modificationhistory.Status.Value) ? modificationhistory.Status.Value : '',
            Type: modificationhistory.Type.Value ? modificationhistory.Type.Value : '',
            Owner: (modificationhistory.Owner && modificationhistory.Owner.FullName) ? modificationhistory.Owner.FullName : '',
            Sbu: (modificationhistory.SBU && modificationhistory.SBU.Name) ? modificationhistory.SBU.Name : '',
            Vertical: (modificationhistory.Vertical && modificationhistory.Vertical.Name) ? modificationhistory.Vertical.Name : '',
            Requestor: (modificationhistory.CreatedBy && modificationhistory.CreatedBy.FullName) ? modificationhistory.CreatedBy.FullName : '',
            Subvertical: modificationhistory.SubVertical ? (modificationhistory.SubVertical.Name ? modificationhistory.SubVertical.Name : '') : '',
            Geo: (modificationhistory.Geo && modificationhistory.Geo.Name) ? modificationhistory.Geo.Name : '',
            ApprovedRejStatus: modificationhistory.Status.Value + ' By: ' + modificationhistory.ApprovedRejectedBy.FullName,
            viewBtnVisibility: false,
            // statusclass: 'reworkfromsbu',
            statusclass: this.getStatus(modificationhistory.Status ? modificationhistory.Status.Value : ''),
            OverAllComments: modificationhistory.OverAllComments,
            index: modificationhistory.index,

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
