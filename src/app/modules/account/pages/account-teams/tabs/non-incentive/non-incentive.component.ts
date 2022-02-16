import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-non-incentive',
  templateUrl: './non-incentive.component.html',
  styleUrls: ['./non-incentive.component.scss']
})
export class NonIncentiveComponent implements OnInit {
  AccountTeamsTable = [];
  tempTabe = [];
  tableTotalCount: number;
  isLoading: boolean = false;
  relationplanlist: any;
  accountfunctiondata: any;
  addRowEditable: number = 0;
  accountSysId: any;
  addobj: any;
  loggedin_user: any;
  isShowDeleteAddButton = false;
  NonIcentivizeUserListRequeBody =
    {
      'Guid': '',
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'LoggedinUser': { 'SysGuid': '' }
    };
  configData = {
    'Username': [],
    'IMSrole': [],
    isFilterLoading: false
  };

  filterConfigData = {
    Username: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    IMSrole: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Addedby: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false

  };
  roleAccess:boolean;
  constructor(public activerequest: AccountService,
    public router: Router,
    public dialog: MatDialog,
    private accountlistService: AccountListService,
    private masterApiService: S3MasterApiService,
    private EncrDecr: EncrDecrService,
    private snackBar: MatSnackBar, public errorMessage: ErrorMessage, public userdat: DataCommunicationService,public envr : EnvService) { }

  ngOnInit(): void {
    this.roleAccess  = this.userdat.getRoleAccess();
    // console.log("Hihihihihihihih");
    this.accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    // let accountOwnerGuid = (localStorage.getItem('accountOwnerGuid')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountOwnerGuid'), 'DecryptionDecrip') : '';
    // let logggedInType = (localStorage.getItem('loggedin_user')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip') : '';
    // this.accountSysId = localStorage.getItem("accountSysId")
    this.NonIcentivizeUserListRequeBody.Guid = this.accountSysId;
    //  this.isLoading = true;
    this.loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.NonIcentivizeUserListRequeBody.LoggedinUser.SysGuid = this.loggedin_user;
    this.getnonincentivizeuserlist();
    let Visibilty = (localStorage.getItem('Visibilty')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('Visibilty'), 'DecryptionDecrip') : '';
    // this.restrictAddDeleteButton(logggedInType, this.loggedin_user, accountOwnerGuid);
    this.restrictAddDeleteButton(JSON.parse(Visibilty));


  }
  // restrictAddDeleteButton(userType, userSysId, ownerSysId) {
  //   if (userType === 'sbu' || userSysId === ownerSysId) {
  //     this.isShowDeleteAddButton = true;
  //   } else {
  //     this.isShowDeleteAddButton = false;
  //   }
  // }
  restrictAddDeleteButton(Visibilty) {
    if (Visibilty.AddNonIncentivizeUser ? Visibilty.AddNonIncentivizeUser : '') {
      this.isShowDeleteAddButton = true;
    } else {
      this.isShowDeleteAddButton = false;
    }
  }
  getnonincentivizeuserlist() {
    const orginalArray1 = this.accountlistService.getnonincentivizeuserlist(this.NonIcentivizeUserListRequeBody);
    orginalArray1.subscribe((res: any) => {
      // console.log("NonIncentive Plan List ", res);
      this.relationplanlist = res.ResponseObject;
      // console.log("NonIncentive Plan reaponse ", this.relationplanlist)
      if (res) {
        this.tableTotalCount = res.TotalRecordCount;
        if (res.ResponseObject && res.ResponseObject.length > 0) {
          this.isLoading = false;
          this.AccountTeamsTable = this.getTableFilterData(Object.values(res.ResponseObject));
          this.AccountTeamsTable.map((res, index) => {
            res.index = index + 1;
          });

          this.tableTotalCount = res.TotalRecordCount;
          this.NonIcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
        } else {
          this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
        }
      } else {
        this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
      }
      // this.ModificationActiveRequestTable = res;
    });
    this.getaccountfunction();
  }

  getaccountfunction() {
    const accountfunction = this.masterApiService.getaccountfunction();
    accountfunction.subscribe((res: any) => {
      // console.log("account function", res.ResponseObject);
      // const myData = [];
      // res.ResponseObject.forEach(x => {
      //   myData.push({"id":x.Id,"name":x.Value})
      // });
      this.configData.IMSrole = res.ResponseObject.map(x => {
        return {
          id: x.Id,
          name: x.Value
        };
      });
      this.accountfunctiondata = res.ResponseObject;
    });
  }
  //New pagination
  TablePagination(data) {

    this.NonIcentivizeUserListRequeBody.RequestedPageNumber = this.NonIcentivizeUserListRequeBody.RequestedPageNumber + 1;
    this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
  }



  //pagenation
  //pagenation
  getNewTableData(event) {
    // console.log(event)
    if (event.action === 'pagination') {
      this.NonIcentivizeUserListRequeBody.PageSize = event.itemsPerPage;
      this.NonIcentivizeUserListRequeBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.userdat.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
      //   this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
      // }

    } else if (event.action === 'search') {
      this.NonIcentivizeUserListRequeBody = {

        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.accountSysId,
        'LoggedinUser': { 'SysGuid': this.loggedin_user }

      };

    }

  }

  //Search Table
  // SearchTable(data): void {
  //   this.NonIcentivizeUserListRequeBody.RequestedPageNumber = 1;
  //   this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.GetSearchNonincentivisedUser(searchData, 1, this.NonIcentivizeUserListRequeBody.PageSize, this.NonIcentivizeUserListRequeBody.OdatanextLink, this.NonIcentivizeUserListRequeBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           this.isLoading = false;
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountTeamsTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.NonIcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
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
  //       this.GetAllList(this.NonIcentivizeUserListRequeBody, false);
  //     }
  //   }
  // }

  performTableChildAction(childActionRecieved): Observable<any> {
    const actionRequired = childActionRecieved;

    //let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    console.log(actionRequired);
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
      case 'Username':
        {
          this.getusername(actionRequired.objectRowData);
          // this.configData.Username=[]; 
          return;
        }
      case 'delete':
        {
          this.deleterequest(actionRequired.objectRowData);
          // console.log("delete user", actionRequired.objectRowData);
          return;
        }
      case 'pagination': {

        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
        this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
        this.NonIcentivizeUserListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'update':
        {
          this.updaterequest(actionRequired.objectRowData);
          // console.log("update data ", actionRequired.objectRowData);
          return;
        }
      case 'addNewRow':
        {
          this.getrequestpayload(actionRequired.objectRowData);
          // console.log("add new row", actionRequired);

          // console.log('row in parent  ' + JSON.stringify(actionRequired))

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
        this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
        this.NonIcentivizeUserListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
        break;
      }
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.userdat.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'NonIncentivisedUsersList').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.userdat.Base64Download(res.ResponseObject);
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
        // console.log("download error target " + error.target);
        // console.log("download error code" + error.code);
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
    this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
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
        this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
          this.NonIcentivizeUserListRequeBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.NonIcentivizeUserListRequeBody.OdatanextLink = '';
          this.NonIcentivizeUserListRequeBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
          }

        }

      }
    }
  }

  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterNonIncentivizedUsers').subscribe(res => {
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
              this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountTeamsTable = [...this.AccountTeamsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.AccountTeamsTable = this.getTableFilterData(res.ResponseObject);
          this.NonIcentivizeUserListRequeBody.OdatanextLink = res.OdatanextLink;
          // debugger
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
      'AccountGuid': this.NonIcentivizeUserListRequeBody.Guid ? this.NonIcentivizeUserListRequeBody.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.NonIcentivizeUserListRequeBody.PageSize : 10,
      'RequestedPageNumber': this.NonIcentivizeUserListRequeBody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'NonIncentivizedUser': this.userdat.pluckParticularKey(data.filterData.filterColumn['Username'], 'id'),
      'Function': this.userdat.pluckParticularKey(data.filterData.filterColumn['IMSrole'], 'id'),
      'AddedBy': this.userdat.pluckParticularKey(data.filterData.filterColumn['Addedby'], 'id'),
      // 'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],

    };
  }


  // filterHeaderName(data) {
  //   return data.reduce((acc, d) => {
  //     if (d.name == "Username") {
  //       acc.push("NonIncentivizeUser");
  //     }
  //     else if (d.name == "IMSrole") {
  //       acc.push("Function");
  //     }
  //     else if (d.name == "Addedby") {
  //       acc.push("AddedBy");
  //     }
  //     else {
  //       acc.push(d.name);
  //   }
  //     return acc;
  //   }, []);
  // }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Username':
        return 16;
      case 'IMSrole':
        return 17;
      case 'Addedby':
        return 18;
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
        guid: this.NonIcentivizeUserListRequeBody.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'nonIncentivized').subscribe(res => {
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
  getrequestpayload(objectRowData) {
    this.addobj = objectRowData;
    const obj = {
      'CustomerAccount': {
        'SysGuid': this.accountSysId
      },
      'NonIcentivizeUser': {
        'SysGuid': this.addobj.Username.id,
        'Function': {
          'Id': this.addobj.IMSrole.id
        }
      }
    };
    this.addincentiveuser(obj);

  }
  addincentiveuser(reqbody) {
    // console.log("request boddy", reqbody);
    const adduser = this.accountlistService.AddNonIncentivizeUser(reqbody);
    adduser.subscribe((res: any) => {

      // console.log("add response ", res.ResponseObject);

      if (!res.IsError && res.ResponseObject) {
        this.snackBar.open(res['Message'], '',
          {
            duration: 3000
          });
        this.NonIcentivizeUserListRequeBody = {

          'PageSize': 50,
          'RequestedPageNumber': 1,
          'OdatanextLink': '',
          'Guid': this.accountSysId,
          'LoggedinUser': { 'SysGuid': this.loggedin_user }

        };
        this.GetAllList(this.NonIcentivizeUserListRequeBody, true);
      } else if (res.IsError) {
        // console.log(' add error response ', res)
        this.isLoading = false;
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }
      // console.log("add user response", res)
    });
  }
  updaterequest(data) {
    const updateobj = {
      'NonIcentivizeUser': {
        'MapGuid': data.id,
        'SysGuid': data.Username.id,
        'Function': {
          'Id': data.IMSrole.id,
        }
      },
      'CustomerAccount': {
        'SysGuid': this.accountSysId,
      }
    };
    // console.log("requet object ", updateobj)
    this.updateuser(updateobj);
  }
  updateuser(reqbody) {
    const updateuser = this.accountlistService.UpdateNonIncentivizeUser(reqbody);
    updateuser.subscribe((res: any) => {
      // console.log("update response", res.ResponseObject)
      if (!res.IsError && res.ResponseObject) {
        this.snackBar.open(res['Message'], '',
          {
            duration: 3000
          });
        this.getnonincentivizeuserlist();
      } else if (res.IsError) {
        // console.log(" add error response ", res)
        this.isLoading = false;
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }
    });
  }
  deleterequest(reqbody) {
    // console.log("deleteresuest",reqbody[0].Listid.id)
    const deleteobj = {
      'NonIcentivizeUser':
        { 'MapGuid': reqbody.id }
    };
    // console.log("deleteobject", deleteobj);
    this.deleteuser(deleteobj);
  }
  deleteuser(reqbody) {
    const deleteuser = this.accountlistService.Deletenoninctivizeuser(reqbody);
    deleteuser.subscribe((res: any) => {
      // console.log("deleteuser ", res.ResponseObject);
      const deleteResponse = this.AccountTeamsTable.filter(val => {
        return val.id !== reqbody.NonIcentivizeUser.MapGuid;

      });
      if (deleteResponse.length === 0) {
        this.getnonincentivizeuserlist();
      }
      this.AccountTeamsTable = deleteResponse;
      this.tableTotalCount = this.tableTotalCount - 1;
      if (!res.IsError && res.ResponseObject) {
        this.snackBar.open(res['Message'], '',
          {
            duration: 3000
          });
      } else if (res.IsError) {
        // console.log(" add error response ", res)
        this.isLoading = false;
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }

    });
  }

  getusername(objectRowData) {
    const username = this.masterApiService.getusername(objectRowData);
    username.subscribe((res: any) => {
      // console.log("username reasyhs", res.ResponseObject);
      this.configData.isFilterLoading = false;
      this.configData.Username = res.ResponseObject.map(x => {
        return {
          id: x.SysGuid,
          name: x.FullName
        };
      });

    });

  }
  addRowTable() {
    console.log('data : ' + this.addRowEditable++);
    this.addRowEditable++;
  }



  GetAllList(reqBody, isConcat) {
    this.isLoading = true;
    this.accountlistService.getnonincentivizeuserlist(reqBody)
      .subscribe(async (accountcontReques) => {
        // console.log("hello hello hello", accountcontReques)
        //  this.AccountTeamsTable = []
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
            });
            if (accountcontReques.OdatanextLink) {
              this.NonIcentivizeUserListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            }
            this.NonIcentivizeUserListRequeBody = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.NonIcentivizeUserListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountTeamsTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountTeamsTable.splice(this.AccountTeamsTable.indexOf(res), 1);
              });
              this.AccountTeamsTable = this.AccountTeamsTable.concat(this.getTableFilterData(accountcontReques.ResponseObject));
            } else {
              this.AccountTeamsTable = this.getTableFilterData(accountcontReques.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);


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
            this.NonIcentivizeUserListRequeBody.RequestedPageNumber = this.NonIcentivizeUserListRequeBody.RequestedPageNumber - 1;
        }

      },

        error => {
          this.isLoading = false;
        });
  }
  //Mapping here

  getTableFilterData(tableData): Array<any> {

    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((incenetivised => {
          return {
            index: incenetivised.index,
            id: incenetivised.NonIcentivizeUser.MapGuid,
            Username: { 'id': incenetivised.NonIcentivizeUser.SysGuid, 'name': incenetivised.NonIcentivizeUser.FullName },
            IMSrole: { 'id': incenetivised.NonIcentivizeUser.Function.Id, 'name': incenetivised.NonIcentivizeUser.Function.Value },
            Addedby: incenetivised.CustomerAccount.CreatedBy.FullName,
            deleteBtnVisibility: !this.isShowDeleteAddButton



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


