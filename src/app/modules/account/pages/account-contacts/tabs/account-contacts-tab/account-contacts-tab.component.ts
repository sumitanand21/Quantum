import { AccountContactsRequestState } from './../../../../../../core/state/selectors/account/accountContacts.selector';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataCommunicationService, ErrorMessage, ContactService } from '@app/core';
import { DatePipe } from '@angular/common';
import { AccountListService } from '@app/core/services/accountlist.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AppState } from '@app/core/state';
import { AccountContactsAction } from '@app/core/state/actions/account-contacts.action';
import { DateModifier } from '@app/core/services/date-modifier';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-account-contacts-tab',
  templateUrl: './account-contacts-tab.component.html',
  styleUrls: ['./account-contacts-tab.component.scss']
})
export class AccountContactsTabComponent implements OnInit {
  AccountContactsTable = [];
  tableTotalCount: number;
  isLoading = false;
  deleteobj: any;
  accountSysId: any;
  AccountConactListRequeBody =
    {
      'Guid': '',
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': ''
    };
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    job: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    email: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    cbu: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    manager: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    key: { data: [], recordCount: 2, PageNo: 1, NextLink: ''},

    // key: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    modified: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  roleAccess:boolean;
  constructor(public activerequest: AccountService,
    public router: Router,
    private datapipe: DatePipe,
    private accountlistService: AccountListService,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public encrDecrService: EncrDecrService,
    public contact: ContactService,
    private store: Store<AppState>, public errorMessage: ErrorMessage,public envr : EnvService) { }

  ngOnInit(): void {
    this.roleAccess  = this.service.getRoleAccess();
    this.accountSysId = (sessionStorage.getItem('accountSysId')) ? this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

    // this.accountSysId = localStorage.getItem("accountSysId")
    // console.log("accountsysid", this.accountSysId);
    this.AccountConactListRequeBody.Guid = this.accountSysId;
    // this.AccountConactListRequeBody=
    //   {
    // //     "Guid": this.accountid,
    // //     // "PageSize": 10,
    // //     // "RequestedPageNumber": 1,
    // //     // "OdatanextLink": 
    //    }
    this.isLoading = true;
    // var orginalArray = this.activerequest.getAllAccountContacts();
    // orginalArray.subscribe((x: any[]) => {
    // this.AccountContactsTable = x;

    // });
    //var orginalArray1 = this.accountlistService.GetAccountContactList(this.AccountConactListRequeBody);
    // this.store.pipe(select(AccountContactsRequestState)).subscribe((res: any) => {
    //   // console.log("Account Contact ", res);
    //   if (res) {
    //     if (res.ids.length > 0) {
    //       this.isLoading = false;
    //       this.AccountContactsTable = this.getTableFilterData(Object.values(res.entities));
    //       this.AccountContactsTable.map((res, index) => {
    //         res.index = index + 1;
    //       });
    //       this.tableTotalCount = res.count;
    //       this.AccountConactListRequeBody.OdatanextLink = res.OdatanextLink;
    //     } else {
    //       this.GetAllHistory(this.AccountConactListRequeBody, true);
    //     }
    //   } else {
        this.GetAllHistory(this.AccountConactListRequeBody, true);
    //   }
    //   // this.ModificationActiveRequestTable = res;
    // });

  }

  //New pagination
  TablePagination(data) {

    this.AccountConactListRequeBody.RequestedPageNumber = this.AccountConactListRequeBody.RequestedPageNumber + 1;
    this.GetAllHistory(this.AccountConactListRequeBody, true);
  }
  //pagenation
  getNewTableData(event) {
    // console.log(event)
    if (event.action === 'pagination') {
      this.AccountConactListRequeBody.PageSize = event.itemsPerPage;
      this.AccountConactListRequeBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.service.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
      //   this.GetAllHistory(this.AccountConactListRequeBody, true);
      // }

    } else if (event.action === 'search') {
      this.AccountConactListRequeBody = {
        'Guid': this.accountSysId,
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': ''

      };

    }

  }
  //Search list
  // SearchTable(data): void {
  //   this.AccountConactListRequeBody.RequestedPageNumber = 1;
  //   this.AccountConactListRequeBody.OdatanextLink = '';

  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.GetSearchContactListByAccount(searchData, 1, this.AccountConactListRequeBody.PageSize, this.AccountConactListRequeBody.OdatanextLink, this.AccountConactListRequeBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountContactsTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountContactsTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.AccountConactListRequeBody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;

  //             // console.log("table count", res);


  //           } else {
  //             // console.log("table count else", res);
  //             this.AccountContactsTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.AccountConactListRequeBody, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    const actionRequired = childActionRecieved;
    // let obj ={'route_from':'acc_req', 'Id': actionRequired.objectRowData[0].id}
    // localStorage.setItem('routeParams', this.encrDecrService.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    // debugger;
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    console.log(actionRequired);
    switch (actionRequired.action) {

      case 'Name': {
        console.log(actionRequired);
        this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        //this.router.navigate(['/accounts/accountmodification/viewmodificationdetails', 'acc_req', actionRequired.objectRowData[0].id]);
        // this.router.navigate(['/accounts/accountdetails' ,actionRequired.objectRowData[0].id]);
        localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
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
          this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id });
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          return;
        }
      case 'edit': {
        // this.service.editpart = true;
        // localStorage.setItem("singlecontactdetails", JSON.stringify(actionRequired.objectRowData[0]));
        // localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
        // console.log(" Edit data transfer ", actionRequired);
        // this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        // return;
        this.service.editTheProfile()
        { }
        this.editContact(actionRequired)
        return;
      }
      case 'pagination': {

        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search': {
        this.AccountConactListRequeBody.OdatanextLink = '';
        this.AccountConactListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'isdeleteteammember': {
        // console.log("delete response",actionRequired.objectRowData[0].id);
        this.deteleContact(actionRequired);
        this.deleteobj = actionRequired;
        // console.log("delete obj response ", this.deleteobj)
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
        this.AccountConactListRequeBody.OdatanextLink = '';
        this.AccountConactListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        this.GetAllHistory(this.AccountConactListRequeBody, true);
        break;
      }

    }
  }

  editContact(actionRequired){
    this.contact.getIsUserCanEditContact(actionRequired.objectRowData[0].id).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.isUserCanEdit) {
          this.service.sessionStorageSetItem('ContactRoute',([1]));
          sessionStorage.setItem("contactNameDetailsFlag", JSON.stringify(false))
          localStorage.setItem("singlecontactdetails", JSON.stringify(actionRequired.objectRowData[0]));
          localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
          sessionStorage.setItem('contactEditMode', JSON.stringify(true))
          sessionStorage.setItem('contactEditOrActivate', JSON.stringify(true))
          this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        } else {
          this.errorMessage.throwError("User don't have permission to edit this contact");
        }
      } else {
        this.errorMessage.throwError(res.Message);
      }
    })
  }
  
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.service.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'AccountContactList').subscribe(res => {

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
      // this.errorMessage.throwError(res.Message)
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
      //     'Authorization': "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
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
    this.AccountConactListRequeBody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        // debugger
        const headerName = data.filterData.headerName;
        // if (!this.filterConfigData[headerName].staticData) {
          this.filterConfigData[headerName].data = [];
          this.AccountConactListRequeBody.OdatanextLink = '';
          this.filterConfigData[headerName].PageNo = 1;
          this.filterConfigData[headerName].NextLink = '';
        // }
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AccountConactListRequeBody.OdatanextLink = '';
          this.AccountConactListRequeBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.AccountConactListRequeBody.OdatanextLink = '';
          this.AccountConactListRequeBody.RequestedPageNumber = 1;

          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllHistory(this.AccountConactListRequeBody, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterAccountContactList').subscribe(res => {
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
              this.AccountContactsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountContactsTable = [...this.AccountContactsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountContactsTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.AccountContactsTable = this.getTableFilterData(res.ResponseObject);
          this.AccountConactListRequeBody.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.AccountContactsTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AccountContactsTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {

    return {
      'AccountGuid': this.AccountConactListRequeBody.Guid ? this.AccountConactListRequeBody.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.AccountConactListRequeBody.PageSize : 10,
      'RequestedPageNumber': this.AccountConactListRequeBody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
      'JobTitle': this.service.pluckParticularKey(data.filterData.filterColumn['job'], 'name'),
      'Email': this.service.pluckParticularKey(data.filterData.filterColumn['email'], 'name'),
      'CBU': this.service.pluckParticularKey(data.filterData.filterColumn['cbu'], 'id'),
      'ReportingManager': this.service.pluckParticularKey(data.filterData.filterColumn['manager'], 'name'),
      'KeyContact': this.service.pluckParticularKey(data.filterData.filterColumn['key'], 'value'),
      // 'ModifiedOn': this.service.pluckParticularKey(data.filterData.filterColumn['modified'], 'ModifiedOn'),
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['modified'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['modified'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['modified'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['modified'][0].filterEndDate) : '' : '',
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]

    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "job") {
        acc.push("JobTitle");
      }
      else if (d.name == "email") {
        acc.push("Email");
      }
      else if (d.name == "cbu") {
        acc.push("CBU");
      }
      else if (d.name == "manager") {
        acc.push("Reportingmanager");
      }
      else if (d.name == "key") {
        acc.push("KeyContact");
      }
      else if (d.name == "modified") {
        acc.push("ModifiedOn");
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
      case 'job':
        return 28;
      case 'cbu':
        return 32;
      case 'manager':
        return 33;
      case 'key':
        return 31;
      case 'modified':
        return 30;
      case 'email':
        return 29;
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
        guid: this.AccountConactListRequeBody.Guid,
        statusCode: 0,
        Searchtype: '',

      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'AccountContact').subscribe(res => {
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
  deteleContact(actionRequired) {
    // console.log("is id deleted", actionRequired.objectRowData[0].id);

    this.accountlistService.DeleteAccountcontact(actionRequired.objectRowData[0].id).subscribe(result => {
      const deleteResponse = this.AccountContactsTable.filter(val => {
        return val.id !== actionRequired.objectRowData[0].id;

      });
      this.AccountContactsTable = deleteResponse;
      this.tableTotalCount = this.tableTotalCount - 1;

      this.AccountConactListRequeBody = {
        'Guid': this.accountSysId,
        'PageSize': this.AccountConactListRequeBody.PageSize,
        'RequestedPageNumber': this.AccountConactListRequeBody.RequestedPageNumber,
        'OdatanextLink': ''

      };
      this.GetAllHistory(this.AccountConactListRequeBody, true);

      // this.RelationshipPlanTable = this.getTableFilterData(actionRequired.objectRowData)
      //console.log("relationship plane list delete",this.RelationshipPlanTable)

    });
  }
  //History
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    let reqbody;
    reqbody = {
      "AccountGuid":reqBody.Guid,
    "SortBy":'',
    "IsDesc":false,
    "PageSize":reqBody.PageSize,
    "RequestedPageNumber":reqBody.RequestedPageNumber,
    "SearchText":"",
    "Name":[],
    "JobTitle":[],
    "Email":[],
    "CBU":[],
    "ReportingManager":[],
    "KeyContact":[],
    "StartDate":"",
    "EndDate":""}
    this.accountlistService.GetAccountContactList(reqbody)
      .subscribe(async (accountcontReques) => {
        this.AccountContactsTable = [];
        if (!accountcontReques.IsError) {
          this.isLoading = false;
          if (accountcontReques.ResponseObject.length > 0) {
            this.AccountContactsTable = [];
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
              this.AccountConactListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            }
            this.AccountConactListRequeBody = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.AccountConactListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.AccountContactsTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountContactsTable.splice(this.AccountContactsTable.indexOf(res), 1);
              });
              this.AccountContactsTable = this.AccountContactsTable.concat(this.getTableFilterData(accountcontReques.ResponseObject));
            } else {
              this.AccountContactsTable = this.getTableFilterData(accountcontReques.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Guid);

            this.tableTotalCount = accountcontReques.TotalRecordCount;

          } else {
            this.isLoading = false;
            this.AccountContactsTable = [{}];
          }

        } else {
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.AccountConactListRequeBody.RequestedPageNumber = this.AccountConactListRequeBody.RequestedPageNumber - 1;
        }

      },

        error => {
          this.isLoading = false;
        });
  }
  //Account Contect Mapping

  getTableFilterData(tableData): Array<any> {

    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((accountlist => {
          return {
            id: accountlist.Guid,
            Name: accountlist.FName || '',
            job: accountlist.Designation || '',
            email: accountlist.Email || '',
            cbu: accountlist.CBU ? accountlist.CBU.Name : '',
            manager: accountlist.ReportingManager ? accountlist.ReportingManager.FullName : '',
            //manager:accountlist.ReportingManager || "NA",
            // modified: accountlist.ModifiedOn || "NA",
            modified: (accountlist.ModifiedOn) ? accountlist.ModifiedOn : '',
            // key: false,
            key: accountlist.isKeyContact ? 'yes' : 'No',
            index: accountlist.index,
          };
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}



