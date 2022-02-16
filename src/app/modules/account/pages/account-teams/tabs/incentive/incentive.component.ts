import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { environment as env } from '@env/environment';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.scss']
})
export class IncentiveComponent implements OnInit {
  AccountTeamsTable = [];
  tempTabe = []
  tableTotalCount: number;
  isLoading: boolean = false;
  relationplanlist: any;
  accountfunctiondata: any;
  addRowEditable: number = 0;
  accountSysId: any;
  IcentivizeUserListRequeBody =
    {
      Guid: '',
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': ''
    };
  filterConfigData = {
    Username: { data: [], recordCount: 0, NextLink: '' },
    IMSrole: { data: [], recordCount: 0, NextLink: '' },
    SAPcustomercode: { data: [], recordCount: 0, NextLink: '' },
    SAPcustomername: { data: [], recordCount: 0, NextLink: '' },
    Geo: { data: [], recordCount: 0, NextLink: '' },
    isFilterLoading: false

  };
  roleAccess:boolean;
  constructor(public activerequest: AccountService,
    public router: Router,
    public dialog: MatDialog,
    private accountlistService: AccountListService,
    private masterApiService: S3MasterApiService,
    public accservive: DataCommunicationService,
    private EncrDecr: EncrDecrService,
    public errorMessage: ErrorMessage,public envr : EnvService) { }

  ngOnInit(): void {
    this.roleAccess  = this.accservive.getRoleAccess();
    // this.accountSysId = localStorage.getItem("accountSysId")
    this.accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

    // console.log("accountsysid", this.accountSysId);
    this.IcentivizeUserListRequeBody.Guid = this.accountSysId;
    this.isLoading = true;

    const orginalArray1 = this.accountlistService.getincentivizeuserlist(this.IcentivizeUserListRequeBody);
    orginalArray1.subscribe((res: any) => {
      // console.log("Incentive Plan List ", res);
      this.relationplanlist = res.ResponseObject;
      // console.log("relationshiplan reaponse ",this.relationplanlist)
      if (res) {
        if ((res.ResponseObject ? res.ResponseObject.length : 0) > 0) {
          this.isLoading = false;
          this.AccountTeamsTable = this.getTableFilterData(Object.values(res.ResponseObject))
          // console.log("incentive response", this.AccountTeamsTable)
          this.AccountTeamsTable.map((res: any, index) => {
            res.index = index + 1;
          });

          this.tableTotalCount = res.TotalRecordCount;
          this.IcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
        }        else {
          this.GetAllList(this.IcentivizeUserListRequeBody, true)
        }
      } else {
        this.GetAllList(this.IcentivizeUserListRequeBody, true)
      }
      // this.ModificationActiveRequestTable = res;
    });
    this.getaccountfunction()
  }

  getuser(event) {
    const useres = this.masterApiService.Searchuser(event.target.value);
    useres.subscribe((res: any) => {
      // console.log("user name response", res.ResponseObjects);

    });
  }

  getaccountfunction() {
    const accountfunction = this.masterApiService.getaccountfunction();
    accountfunction.subscribe((res: any) => {
      // console.log("account function", res.ResponseObject);
      this.accountfunctiondata = res.ResponseObject;
    });
  }
  //New pagination
  TablePagination(data) {

    this.IcentivizeUserListRequeBody.RequestedPageNumber = this.IcentivizeUserListRequeBody.RequestedPageNumber + 1
    this.GetAllList(this.IcentivizeUserListRequeBody, true);
  }
  getNewTableData(event) {
    // console.log(event)
    if (event.action === 'pagination') {
      this.IcentivizeUserListRequeBody.PageSize = event.itemsPerPage;
      this.IcentivizeUserListRequeBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // this.GetAllList(this.IcentivizeUserListRequeBody, true);
    } else if (event.action === 'search') {
      this.IcentivizeUserListRequeBody = {

        'Guid': this.accountSysId,
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': ''

      };

    }

  }
  //Search list
  // SearchTable(data): void {
  //   this.IcentivizeUserListRequeBody.RequestedPageNumber = 1;
  //   this.IcentivizeUserListRequeBody.OdatanextLink = '';

  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.GetSearchIncentivisedUser(searchData, 1, this.IcentivizeUserListRequeBody.PageSize, this.IcentivizeUserListRequeBody.OdatanextLink, this.IcentivizeUserListRequeBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountTeamsTable.map((res: any) => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.IcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;

  //             // console.log("table count", res);


  //           } else {
  //             // console.log("table count else", res);
  //             this.AccountTeamsTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllList(this.IcentivizeUserListRequeBody, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    const actionRequired = childActionRecieved;
    // debugger;
    // let obj = { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {
        console.log(actionRequired);
        // this.accountlistService.setUrlParamsInStorage('modif_req', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountdetails']);
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
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
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
      case 'search':
        {
          this.IcentivizeUserListRequeBody.OdatanextLink = '';
          this.IcentivizeUserListRequeBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(childActionRecieved);
          // this.SearchTable(childActionRecieved)
          return;
        }
      case 'editdraft':
        {
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
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
        this.IcentivizeUserListRequeBody.OdatanextLink = '';
        this.IcentivizeUserListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllList(this.IcentivizeUserListRequeBody, true);
        break;
      }
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.accservive.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'IncentivizedUserList').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.accservive.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, "_blank");
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
        // console.log('download error source ' + error.source);
        // console.log('download error target ' + error.target);
        // console.log('download error code' + error.code);
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
    this.IcentivizeUserListRequeBody.OdatanextLink = '';
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
        this.IcentivizeUserListRequeBody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        this.IcentivizeUserListRequeBody.OdatanextLink = '';
        this.IcentivizeUserListRequeBody.RequestedPageNumber = 1;
        if (data.filterData.isApplyFilter && this.accservive.CheckFilterFlag(data)) {
          this.CallListDataWithFilters(data);
        } else {
          this.IcentivizeUserListRequeBody.OdatanextLink = '';
          this.IcentivizeUserListRequeBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllList(this.IcentivizeUserListRequeBody, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterAndSort').subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          // this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountTeamsTable = [...this.AccountTeamsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
          }
          let i = 1;
          this.AccountTeamsTable.map(res => {
            res.index = i;
            i = i + 1;
          });
          this.IcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.AccountTeamsTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AccountTeamsTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      Guid: this.IcentivizeUserListRequeBody.Guid,
      'PageSize': IsFilterAPI ? this.IcentivizeUserListRequeBody.PageSize : 10,
      'SearchText': data.filterData.globalSearch,
      'RequestedPageNumber': this.IcentivizeUserListRequeBody.RequestedPageNumber,
      'IncentivisedFilterObject': {
        'Username': {
          'ColumnValue': this.accservive.pluckParticularKey(data.filterData.filterColumn['Username'], 'name')
        },
        'IMSrole': {
          'ColumnValue': this.accservive.pluckParticularKey(data.filterData.filterColumn['IMSrole'], 'name')
        },
        'BuissenessUnit': {
          'ColumnValue': this.accservive.pluckParticularKey(data.filterData.filterColumn['SAPcustomercode'], 'id')
        },
        'GroupCustomerName': {
          'ColumnValue': this.accservive.pluckParticularKey(data.filterData.filterColumn['SAPcustomername'], 'id')
        },
        'Geo': {
          'ColumnValue': this.accservive.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id')
        },
        'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
        'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      },
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],

    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Username") {
        acc.push("IncentivizedUserName");
      }
      else if (d.name == "IMSrole") {
        acc.push("IMSRole");
      }
      else if (d.name == "SAPcustomercode") {
        acc.push("BuissenessUnit");
      }
      else if (d.name == "SAPcustomername") {
        acc.push("GroupCustomerName");
      }
      else {
        acc.push(d.name);
    }
      return acc;
    }, []);
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Username':
        return 0;
      case 'IMSrole':
        return 1;
      case 'SAPcustomercode':
        return 2;
      case 'SAPcustomername':
        return 3;
      case 'Geo':
        return 4;
      default:
        return '';
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      // let headerName = data.filterData.headerName
      // if (isServiceCall) {
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.IcentivizeUserListRequeBody.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      // let dataSet = data;
      // dataSet['Guid'] = this.IcentivizeUserListRequeBody.Guid;
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'Incentivised').subscribe(res => {
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
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
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
  addRowTable() {
    console.log('data : ' + this.addRowEditable++);
    this.addRowEditable++;
  }



  GetAllList(reqBody, isConcat): void {
    this.accountlistService.getincentivizeuserlist(reqBody)
      .subscribe(async (accountcontReques) => {
        // console.log("ssssssssssssssssssssss", accountcontReques)
        if (!accountcontReques.IsError) {
          this.isLoading = false;
          if (accountcontReques.ResponseObject.length > 0) {
            this.AccountTeamsTable = [];
            const ImmutableObject = Object.assign({}, accountcontReques);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            accountcontReques.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            })
            if (accountcontReques.OdatanextLink) {
              this.IcentivizeUserListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            }
            this.IcentivizeUserListRequeBody = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.IcentivizeUserListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountTeamsTable.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountTeamsTable.splice(this.AccountTeamsTable.indexOf(res), 1);
              });
              this.AccountTeamsTable = this.AccountTeamsTable.concat(this.getTableFilterData(accountcontReques.ResponseObject))
            } else {
              this.AccountTeamsTable = this.getTableFilterData(accountcontReques.ResponseObject)
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid)


            //  this.store.dispatch(new AllianceAccountAction({AllianceListModel : ImmutableObject.ResponseObject, count : relationshipReques.TotalRecordCount, OdatanextLink : relationshipReques.OdatanextLink}))


            // this.offlineServices.addActiveCampaignCacheData(this.campaignSerivce.CampaignChacheType.Table, this.campaignTable, campaignList.TotalRecordCount)

            this.tableTotalCount = accountcontReques.TotalRecordCount;

          } else {
            this.isLoading = false;
            this.AccountTeamsTable = [{}];
          }

        } else {
          this.isLoading = false;
          this.AccountTeamsTable = [{}];
          if (reqBody.RequestedPageNumber > 1)
            this.IcentivizeUserListRequeBody.RequestedPageNumber = this.IcentivizeUserListRequeBody.RequestedPageNumber - 1
        }

      },

        error => {
          this.isLoading = false;
        });
  }
  getTableFilterData(tableData): Array<any> {

    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((incenetivised => {
          return {
            id: incenetivised.EMPNO,
            Username: incenetivised.UserName,
            IMSrole: incenetivised.IMSrole,
            SAPcustomercode: incenetivised.BusinessUnit,
            SAPcustomername: incenetivised.GroupCustomerName,
            Geo: incenetivised.GEO,
            PerfomanceDetails: incenetivised.PerfomanceDetails,
            ConsolidatedPerfomanceDashboard: incenetivised.ConsolidatedPerfomanceDashboard,
            index: incenetivised.index,

          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
}


