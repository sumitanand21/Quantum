import { Component, OnInit, Inject, Output, EventEmitter, HostListener, ViewChildren } from '@angular/core';
import { ProjectService, ArchivedLeadsService } from '@app/core';
import { AccountService } from '@app/core/services/account.service';
import { Location } from '@angular/common';
import { AddParametersComponent } from '@app/shared/modals/add-parameters/add-parameters.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { FirstWordPipe } from '@app/shared/pipes/first-word.pipe';
import { Observable, of, concat, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { reserveAccountClear } from '@app/core/state/actions/resereve-account-list.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-account-finder',
  templateUrl: './account-finder.component.html',
  styleUrls: ['./account-finder.component.scss']
})
export class AccountFinderComponent implements OnInit {
  @ViewChildren('tooltip') tooltips;
  more_clicked;
  AccountCreationActiveRequestsTable = [];
  dynamicInputControl = [];
  isModalUpdated: boolean = false;
  isLoading: boolean = false;
  tableTotalCount: number;
  contactName2Obj: any;
  contactName3Obj: any;
  contactName4Obj: any;
  contactName5Obj: any;
  parentSysId: any;
  regionSysId: any;
  territorySysId: boolean;
  proposedSysId: any;
  classificationSysId: any;
  proposeTypeClassData: any = [];
  loggedin_user: string = '';
  sub_and_vertical: any = [];
  location_temp: any = [];
  accountClassiData: any = [];
  showContent: boolean;
  arrowkeyLocation = 0;
  FinderAccountName;
  FinderAccountNumber;
  FinderAccountOwner;
  FinderAccountVerticalName;
  FinderAccountSubVerticalName;
  FinderAccountGeoName;
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  // isAccessActivation: boolean = false;
  Activerequest =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId,
      'LoggedinUser': this.userId
    };
  isActivityGroupSearchLoading: boolean;
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    // Regionrefernce: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    SBU: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Subvertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    AccountCategory: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false

  };
  wiproContact1: any = [];
  selectedContact1: any = [];
  showContact2: boolean = false;
  contactName2: string = '';
  contactNameSwitch2: boolean = true;
  wiproContact2: any = [];
  selectedContact2: any = [];
  showContact3: boolean = false;
  contactName3: string = '';
  contactNameSwitch3: boolean = true;
  wiproContact3: any = [];
  selectedContact3: any = [];
  showContact4: boolean = false;
  contactName4: string = '';
  contactNameSwitch4: boolean = true;
  wiproContact4: any = [];
  selectedContact4: any = [];
  showContact5: boolean = false;
  contactName5: string = '';
  contactNameSwitch5: boolean = true;
  wiproContact5: any = [];
  selectedContact5: any = [];
  showContact6: boolean = false;
  contactName6: string = '';
  contactNameSwitch6: boolean = true;
  wiproContact7: any = [];
  selectedContact7: any = [];
  showContact8: boolean = false;
  contactName8: string = '';
  contactNameSwitch8: boolean = true;
  wiproContact8: any = [];
  selectedContact8: any = [];
  contactName6Obj: string = '';
  wiproContact6: any = [];
  selectedContact6: any = [];
  showContact7: boolean = false;
  contactName7: string = '';
  contactNameSwitch7: boolean = true;
  proposedType: any = '';
  proposedClassType: any = '';
  FinderAccountSbu;
  IsHelpDesk: any;
  accountClassificationSelected = '';
  accountClassifications: {}[];
  contentArray = [
    { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Account creation', router: '/accounts/accountcreation/activerequest' },
    { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Helpdesk Account creation', router: '/accounts/helpdeskaccountcreation' },
    { className: 'list_names border_property', mdi: 'mdi mdi-screwdriver', action: 'modification', value: 'Account modification', router: '/accounts/accountmodification/modificationactiverequest' },
    // { className: 'list_names border_property', mdi: 'mdi mdi-folder-search-outline', action: 'search', value: 'Account finder', router: '/accounts/accountsearch' },
    { className: 'list_names border_property', mdi: 'mdi mdi-account', action: 'search', value: 'Ownership history', router: '/accounts/accountownershiphistory' },
    // { className: 'list_names border_property', mdi:'mdi mdi-folder-multiple', action:'search', value: 'Assignment ref.creation', router: '/accounts/assignmentRef/assigactiverequest'},
    // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Assignment ref.modification'},
    { className: 'list_names border_property', mdi: 'mdi mdi-file-chart', action: 'search', value: 'Create prospect', router: '/activities/prospectAccount' },
    // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Create prospect', router: ''},
    // { className: 'list_names border_property', mdi:'mdi mdi-database', action:'search', value: 'SAP system'}
  ]
  constructor(private store: Store<AppState>, public projectService: ProjectService, public searchaccount: AccountService, private EncrDecr: EncrDecrService,
    public location: Location, public dialog: MatDialog, public userdat: DataCommunicationService,
    private masterService: S3MasterApiService, public accountListServ: AccountListService, public snackBar: MatSnackBar, public router: Router, public errorMessage: ErrorMessage,public envr : EnvService) { }

  ngOnInit() {
    localStorage.setItem('routeValue', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 15, 'DecryptionDecrip'))
    this.accountType();
    this.accountClassification('');
    this.proposeTypeDropdown();
    this.proposeClassSearch();
    this.loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
    this.IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
    if (this.IsHelpDesk == 'false') {
      this.contentArray.splice(1, 1);
    }
    // var orginalArray = this.searchaccount.getAccountdata();

    // orginalArray.subscribe((x: any[]) => {
    // console.log(x);
    //   this.AccountCreationActiveRequestsTable = x;

    // });

  }

  ngOnchanges() {
    // this.dynamicInputControl[];
    // this.isModalUpdated;
  }
  setPostObj() {
    /* 184450000=> for approval pending with sbu (RoleType: 1),  184450005=> for Draft (RoleType: 1) ==> */
    /* 184450001=> for approval pending with CSO (RoleType: 2),  184450005=> for Draft (RoleType: 2) ==> */

    const payload = {
      'name': this.contactName,
      'accountnumber': this.contactName1,
      'accountcategorycode': this.accountTypeId,    //1 reserve
      'wipro_geography': this.contactName6Obj, //'c705ad56-ca95-e611-80d9-000d3a803bd6',    //ME
      'ownerid': this.contactName2Obj, //'444a8208-4c5f-e911-a830-000d3aa058cb', //Ameer Khan
      'wipro_sbu': this.contactName3Obj, //'4a629410-ddde-e611-80e0-000d3a803bd6',  //Consumer
      'wipro_vertical': this.contactName4Obj, //'48f72292-266f-e011-bcf9-001a643446e0',//Automotive, Aerospace & Defense
      'wipro_subvertical': this.contactName5Obj, //'28aad6a5-2f6f-e011-bcf9-001a643446e0',//Aerospace
      'wipro_region': this.regionSysId, //canada
      'parentaccountid': this.parentSysId,//Goldman Sachs
      'wipro_proposedclassification': this.proposedClassType, //Mega-gama
      'wipro_proposedaccounttype': this.proposedType,  //reserve
      'wipro_newclassification': this.accountClassificationSelected, //potential customer
      'wipro_territoryflag': this.territorySysId,
      'PageSize': this.Activerequest.PageSize,
      'RequestedPageNumber': this.Activerequest.RequestedPageNumber,
      'OdatanextLink': this.Activerequest.OdatanextLink,
      'LoggedinUser': this.Activerequest.LoggedinUser
    };
    console.log(payload);

    const postObj = this.postObjValidator(payload);
    // postObj["prospectid"] = '';
    return postObj;
    // return this.payload;
  }
  postObjValidator(obj) {
    const keys = Object.keys(obj);
    keys.map(function (k) {
      if ((obj[k] === '' || obj[k] == null) && (typeof obj[k] !== 'boolean'))
        delete obj[k];
    });
    return obj;
  }

  // clearForData(){
  //   if(this.contactName != '' || this.contactName1 != '' || this.contactName2 != '' ||
  //   this.contactName3 != '' || this.contactName4 != '' || this.contactName5 != '' ||
  //   this.contactName6 != '' || this.contactName7 != '' || this.contactName8 != '' ||
  //   this.accountTypeId != '' || this.accountClassificationSelected != '' ||
  //   this.proposedType != '' || this.proposedClassType != ''){
  //     return false;
  //   }else{
  //     return true
  //   }
  // }
  resetFields() {
    this.AccountCreationActiveRequestsTable = [{}];
    this.Activerequest.OdatanextLink = '';
    this.contactName3Obj = '';
    this.contactName4Obj = '';
    this.contactName5Obj = '';
    this.contactName2Obj = '';
    this.contactName6Obj = '';
    this.contactName2Obj = '';
    this.contactName = '';
    this.contactName1 = '';
    this.contactName2 = '';
    this.contactName3 = '';
    this.contactName4 = '';
    this.contactName5 = '';
    this.contactName6 = '';
    this.contactName7 = '';
    this.contactName8 = '';
    this.accountTypeId = '';
    this.accountClassificationSelected = '';
    this.proposedType = '';
    this.proposedClassType = '';
  }

  searchAccount() {
    // console.log("search account finder", this.setPostObj());
    if (Object.entries(this.setPostObj()).length <= 3 && this.setPostObj().constructor === Object) {
      this.snackBar.open("Select atleast one field to search!", '', {
        duration: 3000
      });
      this.AccountCreationActiveRequestsTable = [{}];
    } else {
      this.Activerequest.OdatanextLink = '';
      this.GetAllAccounts(this.setPostObj(), true);
    }
    // this.accountListServ.accountFinderApi(this.setPostObj()).subscribe(res => {
    // console.log("search account finder result", res);
    // this.AccountCreationActiveRequestsTable = res.ResponseObject;
    // })
  }
  // SearchTable(data): void {
  //   this.Activerequest.RequestedPageNumber = 1;
  //   this.Activerequest.OdatanextLink = '';
  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountListServ.accountSearch(this.setPostObj(), 3, this.Activerequest.PageSize, this.Activerequest.OdatanextLink, this.Activerequest.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.AccountCreationActiveRequestsTable.map((res: any) => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.Activerequest.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;
  //           } else {
  //             this.AccountCreationActiveRequestsTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllAccounts(this.Activerequest, false);
  //     }
  //   }
  // }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // let obj = { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].SysGuid }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');

    // console.log('approve reject action', incId)

    switch (actionRequired.action) {
      case 'Name': {
        // this.router.navigate(['/accounts/accountmodification/viewmodificationdetails', 'acc_req', actionRequired.objectRowData[0].id]);
        // if (this.loggedin_user=='sbu')
        if (actionRequired.objectRowData[0].IsAccess === true) {
          // this.accountListServ.setUrlParamsInStorage('acc_req',actionRequired.objectRowData[0].SysGuid);
          this.accountListServ.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].SysGuid });
          this.userdat.setSideBarData(1);
          this.router.navigate(['/accounts/accountdetails']);
        } else {
          this.snackBar.open('Access Denied!', '', {
            duration: 3000
          });
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
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'gain': {
        const isAccess = childActionRecieved.objectRowData.length > 0 ? childActionRecieved.objectRowData[0].IsAccess : null;
        if (isAccess) {
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
            const dialogRef = this.dialog.open(RequestAccesspopup,
              {
                disableClose: true,
                width: '380px',
                data: {
                  'SysGuid': actionRequired.objectRowData[0].SysGuid,
                  'accountName': actionRequired.objectRowData[0].Name,
                  'accountNumber': actionRequired.objectRowData[0].Number,
                  'objectRowData': actionRequired.objectRowData[0]
                }
              });
          //   dialogRef.afterClosed().subscribe(result => {
          //     if (result === 'success' || result === 'failed')
          //       this.isLoading = true;
          //     else
          //       this.isLoading = false;
          //   });

          //   const dialogSubmitSubscription = dialogRef.componentInstance.submitClicked.subscribe(result => {
          //     console.log(result);
          //     this.isLoading = false;
          //     if (result === 'success') {
          //       this.store.dispatch(new reserveAccountClear({ ReserveListModel: {} }));
          //       this.router.navigate(['/accounts/accountmodification/modificationactiverequest']);
          //     }

          //     dialogSubmitSubscription.unsubscribe();
          //   });
          // }
        } else {
          this.snackBar.open("Access Denied, You Don't have access to activate this account", '', { duration: 3000 });
        }
        // const dialogRef = this.dialog.open(RequestAccesspopup,
        //   {
        //     width: '380px',
        //     data: {
        //       'SysGuid': actionRequired.objectRowData[0].SysGuid,
        //       'accountName': actionRequired.objectRowData[0].Name,
        //       'accountNumber': actionRequired.objectRowData[0].Number
        //     }
        //   });
        return;
      }
      case 'share': {
        this.gainAccessCall(actionRequired.objectRowData[0].SysGuid);
        return;
      }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        return;
      }
      case 'columnFilter': {
        if (childActionRecieved.filterData.headerName === 'Type') {
          this.filterConfigData.Type['data'] = [];
          this.accountTypes.filter((res: any) => {
            // console.log("res filtered data", res);
            if (res.Id === this.accountTypeId) {
              return this.filterConfigData.Type['data'].push({ 'id': res.Id, 'name': res.Value });
            }
          });
          // console.log("res filtered data1", this.filterConfigData.Type['data'])
        }
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
        // this.GetAllAccounts(this.Activerequest, true);
        break;
      }
    }
  }

  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.userdat.checkFilterListApiCall(data) ? true : false;
    this.accountListServ.getFilterList(reqparam, true).subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          window.open(res.ResponseObject.Url, '_blank');
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
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
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
            this.GetAllAccounts(this.Activerequest, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListServ.getFilterList(reqparam, false, 'FilterAccountFinderList').subscribe(res => {
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
              this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.AccountCreationActiveRequestsTable = [...this.AccountCreationActiveRequestsTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.AccountCreationActiveRequestsTable = this.getTableFilterData(res.ResponseObject);
          this.Activerequest.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
          // this.filterConfigData.Type['data'] = [];
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
      'UserGuid': this.Activerequest.LoggedinUser ? this.Activerequest.LoggedinUser : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.Activerequest.PageSize : 10,
      'RequestedPageNumber': this.Activerequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Name': data.filterData.filterColumn['Name'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Name'], 'encodedname') : this.contactName ? [this.contactName] : [],
      'AccountNumber': data.filterData.filterColumn['Number'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Number'], 'name') : this.contactName1 ? [this.contactName1] : [],
      'Owner': data.filterData.filterColumn['Owner'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id') : this.contactName2Obj ? [this.contactName2Obj] : [],
      'Type': data.filterData.filterColumn['Type'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Type'], 'id') : this.accountTypeId ? [parseInt(this.accountTypeId)] : [],
      'Geo': data.filterData.filterColumn['Geo'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id') : this.contactName6Obj ? [this.contactName6Obj] : [],
      // 'Region':  this.userdat.pluckParticularKey(data.filterData.filterColumn['Regionrefernce'], 'id'),
      'Vertical': data.filterData.filterColumn['Vertical'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Vertical'], 'id') : this.contactName4Obj ? [this.contactName4Obj] : [],
      'SBU': data.filterData.filterColumn['SBU'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['SBU'], 'id') : this.contactName3Obj ? [this.contactName3Obj] : [],
      'SubVertical': data.filterData.filterColumn['Subvertical'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Subvertical'], 'id') : this.contactName5Obj ? [this.contactName5Obj] : [],
      'Category': data.filterData.filterColumn['AccountCategory'].length > 0 ? this.userdat.pluckParticularKey(data.filterData.filterColumn['AccountCategory'], 'id') : [],
      
    };
  }

  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Name':
        return 123;
      case 'Type':
        return 1;
      case 'Owner':
        return 4;
      case 'Status':
        return 6;
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
        Searchtype: ''
      };
      // let dataSet = data;
      // dataSet['Guid'] = this.IcentivizeUserListRequeBody.Guid;
      this.accountListServ.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'accountfinder').subscribe(res => {

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
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }



  gainAccessCall(Id) {
    const payload = {
      'LoggedInUser':
      {
        'SysGuid': this.userId
      },
      'SysGuid': Id
    };
    this.accountListServ.gainAccessApi(payload).subscribe((resp) => {
      if (!resp.IsError) {
        this.snackBar.open(resp.Message, '', {
          duration: 3000
        });
        setTimeout(() => {
          this.searchAccount()
          // this.GetAllAccounts(this.Activerequest, true);
        }, 5000);
      }
    });
  }
  TablePagination(data) {
    this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber + 1;
    this.GetAllAccounts(this.Activerequest, true);
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.Activerequest.PageSize = event.itemsPerPage;
      this.Activerequest.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event, true);
      // if (this.userdat.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // } else {

      //   //list api call
      //   this.GetAllAccounts(this.Activerequest, true);
      // }
    } else if (event.action === 'search') {
      this.Activerequest = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId,
        'LoggedinUser': this.userId
      };
    }
  }
  GetAllAccounts(reqBody, isConcat): void {

    this.isLoading = true;
    this.accountListServ.accountFinderApi(reqBody)
      .subscribe(async (accountList) => {
        if (!accountList.IsError) {
          // console.log("response from get all accounts finder", accountList)
          if (accountList.ResponseObject.length > 0) {
            this.AccountCreationActiveRequestsTable = [];
            const ImmutableObject = Object.assign({}, accountList);
            this.isLoading = false;
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            accountList.ResponseObject.map(res => {
              // if (res.Type.Id === 1) {
              //   this.isAccessActivation = true;
              // } else { this.isAccessActivation = false; }
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            // console.log(accountList)
            this.Activerequest = reqBody;
            // await this.offlineServices.ClearActiveRequestsIndexTableData()
            if (accountList.OdatanextLink) {
              this.Activerequest.OdatanextLink = accountList.OdatanextLink;
            }
            if (isConcat) {
              const spliceArray = [];
              this.AccountCreationActiveRequestsTable.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.AccountCreationActiveRequestsTable.splice(this.AccountCreationActiveRequestsTable.indexOf(res), 1);
              });
              this.AccountCreationActiveRequestsTable = this.AccountCreationActiveRequestsTable.concat(this.getTableFilterData(accountList.ResponseObject));
              // console.log("account finder table final")
              // console.log(this.AccountCreationActiveRequestsTable)
            } else {
              this.AccountCreationActiveRequestsTable = this.getTableFilterData(accountList.ResponseObject);
            }
            // const immutableObject = Object.assign(this.AccountCreationActiveRequestsTable)
            ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
            // this.store.dispatch(new activeRequestList({ ActiveRequestModel: ImmutableObject.ResponseObject, count: accountList.TotalRecordCount, OdatanextLink: accountList.OdatanextLink }))
            // this.offlineServices.addAllCampaignCacheData(this.campaign.CampaignChacheType.Table, this.campaignTable, accountList.TotalRecordCount)
            this.tableTotalCount = accountList.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.AccountCreationActiveRequestsTable = [{}];
          }
        } else {
          this.isLoading = false;
          this.snackBar.open(accountList.Message, '', {
            duration: 3000
          });
          if (reqBody.RequestedPageNumber > 1)
            this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber - 1;
        }
      },
        error => {
          this.isLoading = false;
        });
  }


  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((activerequest => {
          return {
            index: activerequest.index,
            SysGuid: activerequest.SysGuid,
            Name: this.accountListServ.getSymbol(activerequest.Name) || '',
            Status: (activerequest.Status && activerequest.Status.Value) ? activerequest.Status.Value : '',
            Type: (activerequest.Type && activerequest.Type.Value) ? activerequest.Type.Value : '',
            Owner: (activerequest.Owner && activerequest.Owner.FName) ? activerequest.Owner.FName : '',
            OwnerId: (activerequest.Owner && activerequest.Owner.SysGuid) ? activerequest.Owner.SysGuid : '',
            HuntingRatio: activerequest.Owner && activerequest.Owner.HuntingRatio ? activerequest.Owner.HuntingRatio : 0,
            ExistingRatio: activerequest.Owner && activerequest.Owner.ExistingRatio ? activerequest.Owner.ExistingRatio : 0,
            SBU: (activerequest.SBU && activerequest.SBU.Name) ? activerequest.SBU.Name : '',
            Vertical: (activerequest.Vertical && activerequest.Vertical.Name) ? activerequest.Vertical.Name : '',
            Subvertical: (activerequest.SubVertical && activerequest.SubVertical.Name) ? activerequest.SubVertical.Name : '',
            Geo: (activerequest.Geo && activerequest.Geo.Name) ? activerequest.Geo.Name : '',
            Number: activerequest.Number || '',
            accessactivationBtnVisibility: !activerequest.IsGainAccess,
            ownerSysguid: (activerequest.Owner && activerequest.Owner.SysGuid) ? activerequest.Owner.SysGuid : '',
            accessShareBtnVisibility: !(activerequest.Type.Id === 1 && !activerequest.IsRequestRaised),
            IsAccess: activerequest.IsAccess,
            AccountCategory: (activerequest.AccountCategory && activerequest.AccountCategory.Value) ? activerequest.AccountCategory.Value: ''
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
  accountOwnerSearch(data) {
    // if (data) {
    const reqBody = {
      'SearchText': data ? data : '',
      'OdatanextLink': '',
      'PageSize': 10,
      'RequestedPageNumber': 1
    };
    if (data === '') {
      this.contactName2Obj = '';
    }
    this.wiproContact2 = [];
    this.isActivityGroupSearchLoading = true;
    console.log('req body for owner search', reqBody);
    this.masterService.accountOwnerSearch(reqBody).subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.wiproContact2 = this.getFilterData(res.ResponseObject);
        if (res.ResponseObject.length === 0) {
          this.wiproContact2 = [];
          this.wiproContact2['message'] = 'No record found';
          // this.contactName2 = '';
        }
      } else {
        this.wiproContact2 = [];
        this.wiproContact2['message'] = 'No record found';
        this.contactName2 = '';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.wiproContact2 = [];
      this.wiproContact2['message'] = 'No record found';
      this.contactName2 = '';
    });
    // } else {
    //   this.contactName2Obj = '';
    // }
  }
  accountOwnerSearch1(data, controls) {
    const reqBody = {
      'SearchText': data ? data : '',
      'OdatanextLink': '',
      'PageSize': 10,
      'RequestedPageNumber': 1
    };
    if (controls) {
      if (controls.name === 'Parent') {
        this.masterService.getparentaccount(data ? data : '').subscribe((res) => {
          this.isActivityGroupSearchLoading = false;
          this.wiproContact7 = this.getParentFilterData(res.ResponseObject);
          if (!res.IsError && res.ResponseObject) {
            this.wiproContact7 = this.getParentFilterData(res.ResponseObject);
            if (res.ResponseObject.length === 0) {
              this.wiproContact7 = [];
              this.wiproContact7['message'] = 'No record found';
              // this.contactName7 = '';
            }
          } else {
            this.wiproContact7 = [];
            this.wiproContact7['message'] = 'No record found';
            this.contactName7 = '';
          }
        }, error => {
          this.isActivityGroupSearchLoading = false;
          this.wiproContact7 = [];
          this.wiproContact7['message'] = 'No record found';
          this.contactName7 = '';
        });
      }
      if (controls.name === 'Region') {
        this.masterService.getregionByName(data).subscribe((res) => {
          // console.log("proposed classification type", res);
          this.wiproContact8 = this.getFilterRegion(res.ResponseObject);
        });
      }
    }
  }
  proposeTypeDropdown() {
    this.masterService.GetProposedAccountType().subscribe((res) => {
      // console.log("proposed type", res);
      this.proposeTypeData = this.getFilterProposeType(res.ResponseObject);
    });
  }
  getFilterProposeType(res) {
    if (res.length !== 0) {
      return res.map((data) => {
        return {
          Id: data.Id,
          Value: data.Value,
        };
      });
    }
  }
  proposeClassSearch() {
    this.masterService.GetProposedAccountClassification().subscribe((res) => {
      // console.log("proposed classification type", res);
      this.proposeTypeClassData = this.getFilterProposeClassification(res.ResponseObject);
    });
  }
  getFilterProposeClassification(res) {
    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.Value,
          contact: data.Value,
          SysGuid: data.Id,
          // designation: data.Designation
        };
      });
    }
  }
  getFilterRegion(res) {
    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.Name,
          contact: data.Name,
          SysGuid: data.SysGuid,
          // designation: data.Designation
        };
      });
    }
  }
  getFilterData(res) {
    //    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.FullName,
          contact: data.FullName,
          SysGuid: data.SysGuid,
          designation: data.Designation
        };
      });
    }
  }
  getParentFilterData(res) {
    //    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: this.getdecodevalue(data.Name),
          contact: this.getdecodevalue(data.Name),
          SysGuid: data.SysGuid,
          
        };
      });
    }
  }
  contactSBUclose() {
    this.contactNameSwitch3 = false;
  }
  // sbu by name 
  getSbuByName(event) {
    this.wiproContact3 = [];
    this.wiproContact4 = [];
    this.wiproContact5 = [];
    // this.contactName3 = '';
    // this.contactName3Obj = '';
    if (event === '') {
      this.contactName3Obj = '';
      // this.contactName4 = '';
      // this.contactName4Obj = '';
      // this.contactName5 = '';
      // this.contactName5Obj = '';
    }
    // this.IsSubVerticalExist = true;
    // if (!this.userdat.searchFieldValidator(event.target.value)) {
    //event.target.value = '';
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      this.contactSBUclose();
      this.contactName3 = '';
      this.contactName3Obj = '';
    } else {
      this.isActivityGroupSearchLoading = true;
      // if (event.target.value !== '') {
      const sbubyname = this.masterService.getSBUByName(event);
      sbubyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("sbuby name response", res.ResponseObject)
        if (!res.IsError && res.ResponseObject) {
          this.wiproContact3 = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            // this.contactName3 = '';
            this.wiproContact3 = [];
            this.wiproContact3['message'] = 'No record found';
          }
        } else {
          // this.OwnDetailsForm.controls['sbu'].setValue('');
          this.contactName3 = '';
          this.wiproContact3 = [];
          this.wiproContact3['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.contactName3 = '';
        this.wiproContact3 = [];
        this.wiproContact3['message'] = 'No record found';
      });
    }
  }

  // vertical  by passing sbuid
  getVerticalbySBUID(event) {
    console.log('event-----' + event);
    this.isActivityGroupSearchLoading = true;
    this.wiproContact4 = [];
    // this.contactName4 = '';
    // this.contactName4Obj = '';
    // this.wiproContact5 = [];
    // this.contactName5 = '';
    // this.contactName5Obj = '';
    // this.IsSubVerticalExist = true;
    if (event === '') {
      this.contactName4Obj = '';
    }
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      // if (event.target.value == '') {
      this.contactNameclose();
      // this.accountCreationObj['sbu'] = '';
      this.contactName4 = '';
      this.contactName4Obj = '';
      this.contactName5 = '';
      this.contactName5Obj = '';
    }
    else {
      let vertical;
      // if (event.target.value !== '') {
      if (this.userdat.searchFieldValidator(this.contactName3Obj))
        // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
        vertical = this.masterService.getVerticalbySBUID(this.contactName3Obj, event);
      else
        vertical = this.masterService.SearchVerticalAndSBU(event);

      vertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("verticalby sbuid ", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.contactName3Obj)) {
            this.wiproContact4 = res.ResponseObject;
          } else {
            this.sub_and_vertical = res.ResponseObject;
            this.contactName3 = '';
            this.contactName3Obj = '';
            this.wiproContact4 = [];
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            res.ResponseObject.map(data => {
              this.wiproContact4.push(data.Vertical);
            });
          }

          if (res.ResponseObject.length === 0) {
            // this.contactName4 = '';
            this.wiproContact4 = [];
            this.wiproContact4['message'] = 'No record found';
          }
        } else {
          // this.OwnDetailsForm.controls['vertical'].setValue('');
          this.contactName4 = '';
          this.wiproContact4 = [];
          this.wiproContact4['message'] = 'No record found';
        }

      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.wiproContact4 = [];
        this.contactName4 = '';
        this.wiproContact4['message'] = 'No record found';
      });
    }
  }
  showTooltip(){
    this.tooltips._results.forEach(item => item.disabled = false);
  }
  filterClassificationData(accTypeId) {
    this.tooltips._results.forEach(item => item.disabled = true);
    this.accountClassification(accTypeId);
    // let valueFor: any;
    // if (accTypeId === '3') {
    //   valueFor = [13, 100000000, 15, 16, 17];
    //   this.getFilterClasData(valueFor);
    // } else if (accTypeId === '12') {
    //   valueFor = [10, 11];
    //   this.getFilterClasData(valueFor);
    // } else if (accTypeId === '1') {
    //   valueFor = [100];
    //   this.getFilterClasData(valueFor);
    // } else {
    //   this.accountClassiData = [];
    // }
  }
  // getFilterClasData(array) {
  //   this.accountClassiData = [];
  //   this.accountClassifications.map((data: any) => {
  //     array.map((value: any) => {
  //       if (data.Id === value) {
  //         this.accountClassiData.push(data);
  //       }
  //     });
  //   });
  // }
  getSubVerticalByVertical(event) {
    this.wiproContact5 = [];
    this.sub_and_vertical = [];
    if (event === '') {
      this.contactName5Obj = '';
    }
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      this.contactName5 = '';
      this.contactName5Obj = '';
    } else {
      let subvertical;
      // console.log(this.accountCreationObj['vertical']);
      this.isActivityGroupSearchLoading = true;

      if (this.userdat.searchFieldValidator(this.contactName4Obj))

        subvertical = this.masterService.getSubVerticalByVertical(this.contactName4Obj, event);
      else
        subvertical = this.masterService.SearchAllBySubVertical(event);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("response for subvertical", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.contactName4Obj)) {
            this.wiproContact5 = res.ResponseObject;
          } else {
            this.sub_and_vertical = res.ResponseObject;
            // this.accountCreationObj['sbu'] = '';
            // this.accountCreationObj['vertical'] = '';
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            // this.OwnDetailsForm.controls['vertical'].setValue('');
            // this.contactName4 = '';
            // this.contactName4Obj = '';
            // this.contactName3 = '';
            // this.contactName3Obj = '';
            this.wiproContact5 = [];
            res.ResponseObject.map(data => {
              this.wiproContact5.push(data.SubVertical);
            });
            console.log(this.wiproContact5);
          }
          if (res.ResponseObject.length === 0) {
            // this.OwnDetailsForm.controls['subvertical'].setValue('');
            // this.contactName5 = '';
            this.wiproContact5 = [];
            this.wiproContact5['message'] = 'No record found';
          }
        } else {
          this.contactName5 = '';
          this.wiproContact5 = [];
          this.wiproContact5['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.wiproContact5 = [];
        this.contactName5 = '';
        this.wiproContact5['message'] = 'No record found';
      });
    }
  }
  getGeo(event) {
    // this.wiproContact2 = [];
    this.wiproContact6 = [];
    this.contactName8 = '';
    this.regionSysId = '';
    let orginalArray;
    if (event === '') {
      this.contactName6Obj = '';
    }
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      // let temp = ['geography', 'region'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
      // this.getAllSwapAccount(this.accountCreationObj['owner'], '');
    } else {
      this.isActivityGroupSearchLoading = true;
      // let formField = ['region'];
      // let temp = ['geography', 'region', 'country', 'state', 'city'];

      // this.clearFormFiled(formField, this.OwnDetailsForm);
      // this.clearPostObject(this.accountCreationObj, temp);

      orginalArray = this.masterService.getgeobyname(event);
      orginalArray.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          // this.wiproContact2 = res.ResponseObject;
          this.wiproContact6 = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            this.wiproContact6 = [];
            // this.OwnDetailsForm.controls['geography'].setValue('');
            // this.contactName6 = '';
            this.wiproContact6['message'] = 'No record found';
            // this.wiproContact2['message'] = 'No record found';
          }
        } else {
          // this.OwnDetailsForm.controls['geography'].setValue('');
          // this.clearFormFiled(temp, this.OwnDetailsForm);
          this.wiproContact6 = [];
          this.contactName6 = '';
          // this.OwnDetailsForm.controls['geography'].setValue('');
          this.wiproContact6['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        // this.clearFormFiled(temp, this.OwnDetailsForm);
        this.wiproContact6 = [];
        this.contactName6 = '';
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.wiproContact6['message'] = 'No record found';
      });
    }
  }

  getregionbygeo(event) {
    this.wiproContact8 = [];
    this.location_temp = [];
    let region;
    if (!this.userdat.searchFieldValidator(event.target.value) && event.target.value !== '') {
      this.isActivityGroupSearchLoading = false;
    } else {
      this.isActivityGroupSearchLoading = true;

      if (this.userdat.searchFieldValidator(this.contactName6Obj))
        region = this.masterService.getregionbygeo(this.contactName6Obj, event.target.value);
      else
        region = this.masterService.GetAllByRegion(event.target.value);
      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("geobyreagion response", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.contactName6Obj)) {
            this.wiproContact8 = res.ResponseObject;
          } else {
            const formField1 = ['geography'];
            this.location_temp = res.ResponseObject;
            this.wiproContact8 = [];
            res.ResponseObject.map(data => {
              this.wiproContact8.push(data.Region);
            });
          }
          if (res.ResponseObject.length === 0) {
            this.wiproContact8 = [];
            this.wiproContact8['message'] = 'No record found';
            // this.contactName8 = '';
          }
        } else {
          this.wiproContact8 = [];
          this.contactName8 = '';
          this.wiproContact8['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.wiproContact8 = [];
        this.contactName8 = '';
        this.wiproContact8['message'] = 'No record found';
      });
    }

  }

  // sbuSearch() {
  //   if (this.contactName3) {
  //     var reqBody = {
  //       "SearchText": this.contactName3,
  //       "OdatanextLink": '',
  //       "PageSize": 10,
  //       "RequestedPageNumber": 1
  //     }
  //     this.wiproContact3 = [];
  //     this.isActivityGroupSearchLoading = true;
  //     console.log('req body for owner search', reqBody);
  //     this.masterService.sbuSearch(reqBody).subscribe((res) => {
  //       this.isActivityGroupSearchLoading = false;
  //       console.log('sbu search', res);
  //       this.wiproContact3 = this.getFilterSBU(res.ResponseObject)
  //     }, error => {
  //       this.isActivityGroupSearchLoading = false;
  //       this.wiproContact3 = [];
  //     })
  //   } else {
  //     this.contactName3Obj = '';
  //   }
  // }

  getFilterSBU(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        const initials = data.Name.split(" ");
        return {
          initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          contact: data.Name,
          SysGuid: data.Id
        };
      });
    }
  }


  // verticalSearch(event) {
  //   if (this.contactName4) {
  //     var reqBody = {
  //       "SearchText": this.contactName4,
  //       "OdatanextLink": '',
  //       "PageSize": 10,
  //       "RequestedPageNumber": 1
  //     }
  //     this.wiproContact4 = [];
  //     this.isActivityGroupSearchLoading = true;
  //     console.log('req body for owner search', reqBody);
  //     this.masterService.getVerticalbySBUID(this.contactName3Obj, event.target.value).subscribe((res) => {
  //       this.isActivityGroupSearchLoading = false;
  //       console.log('vertical search', res);
  //       this.wiproContact4 = this.getFilterVertical(res.ResponseObject)
  //     }, error => {
  //       this.isActivityGroupSearchLoading = false;
  //       this.wiproContact4 = [];
  //     })
  //   } else {
  //     this.contactName4Obj = '';
  //   }
  // }

  getFilterVertical(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        const initials = data.Name.split(" ");
        return {
          initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          contact: data.Name,
          SysGuid: data.Id,
          designation: data.Designation ? data.Designation : ''
        };
      });
    }
  }

  subVerticalSearch(event) {
    if (this.contactName5) {
      const reqBody = {
        'SearchText': this.contactName5 ? this.contactName5 : '',
        'OdatanextLink': '',
        'PageSize': 10,
        'RequestedPageNumber': 1
      };
      this.wiproContact5 = [];
      this.isActivityGroupSearchLoading = true;
      // console.log('req body for owner search', reqBody);
      this.masterService.getSubVerticalByVertical(this.contactName4Obj, event.target.value).subscribe((res) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('sub vertical search', res);
        this.wiproContact5 = this.getFilterSubVertical(res.ResponseObject);
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.wiproContact5 = [];
      });
    } else {
      this.contactName5Obj = '';
    }
  }

  // IsSubVerticalExist: boolean = true;
  appendvertical(item, ind) {
    this.contactName4 = item.Name;
    this.contactName4Obj = item.Id || '';
    this.vericalFieldUpdates(item, ind);
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.contactName3Obj = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) this.contactName3 = this.sub_and_vertical[ind]['SBU']['Name'];
  }
  vericalFieldUpdates(item, ind) {

    this.contactName5 = (item.SubVertical && item.SubVertical.Name) ? item.SubVertical.Name : '';
    this.contactName5Obj = (item.SubVertical && item.SubVertical.Id) ? item.SubVertical.Id : '';


  }
  appendsubvertical(item, ind) {
    console.log(this.sub_and_vertical);
    this.FinderAccountSubVerticalName = item.Name;
    this.contactName5 = item.Name;
    this.contactName5Obj = item.Id || '';

    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.contactName3Obj = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) this.contactName3 = this.sub_and_vertical[ind]['SBU']['Name'];

    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Id'])) this.contactName4Obj = this.sub_and_vertical[ind]['Vertical']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Name'])) this.contactName4 = this.sub_and_vertical[ind]['Vertical']['Name'];

  }
  appendgeo(item) {
    this.FinderAccountGeoName = item.Name;
    this.contactName6 = item.Name;
    this.contactName6Obj = item.SysGuid || '';
  }
  appendregion(item, i) {
    console.log(this.location_temp);
    this.contactName8 = item.Name;
    this.regionSysId = item.SysGuid || '';

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.contactName6Obj = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.contactName6 = this.location_temp[i]['Geo'].Name;

  }

  getFilterSubVertical(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        const initials = data.Name.split(" ");
        return {
          initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          contact: data.Name,
          SysGuid: data.SysGuid,
          designation: data.Designation ? data.Designation : ''
        };
      });
    }
  }

  geoSearch() {
    if (this.contactName6) {
      const reqBody = {
        'SearchText': this.contactName6 ? this.contactName6 : '',
        'OdatanextLink': '',
        'PageSize': 10,
        'RequestedPageNumber': 1
      };
      this.wiproContact6 = [];
      this.isActivityGroupSearchLoading = true;
      // console.log('req body for owner search', reqBody);
      this.masterService.geoSearch(reqBody).subscribe((res) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('geo search', res);
        this.wiproContact6 = this.getFilterGeo(res.ResponseObject);
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.wiproContact6 = [];
      });
    } else {
      this.contactName6Obj = '';
    }
  }

  getFilterGeo(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.Name,
          contact: data.Name,
          SysGuid: data.SysGuid,
          designation: data.Designation ? data.Designation : ''
        };
      });
    }
  }

  accountTypeId = '';
  accountTypes: {}[];
  accountType() {
    this.masterService.accountType({}).subscribe((res) => {
      console.log('account  type', res);
      this.accountTypes = this.getFilterAccountType(res.ResponseObject)
    });
  }

  getFilterAccountType(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          Id: data.Id,
          Value: data.Value,
        };
      });
    }
  }


  accountClassification(isTypePresent) {
    
    let url;
    let reqBody;
    if (isTypePresent) {
      url = 'AccountClassificationByType';
      reqBody =
        { "Id": isTypePresent, "SearchText": '' }

    } else {
      reqBody = {};
      url = 'AccountClassification';
    }
    this.isLoading = true;
    this.accountListServ.commonPostObject(reqBody, url).subscribe((res: any) => {
      this.isLoading = false;
      this.accountClassifications = this.getFilterAccountClassification(res.ResponseObject);
      // this.notesAndDetail = res.ResponseObject;
    });
    // this.masterService.accountClassification({}).subscribe((res) => {
    //   console.log('account  classification', res);
    //   this.accountClassifications = this.getFilterAccountClassification(res.ResponseObject);
    // });
  }
  getdecodevalue(data) {
    return this.accountListServ.getSymbol(data);
  }
  getFilterAccountClassification(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          Id: data.Id,
          Value: data.Value,
        };
      });
    }
  }

  accountName(data) {
    const reqBody = {
      'SearchText': data ? data : '',
      'OdatanextLink': '',
      'PageSize': 10,
      'RequestedPageNumber': 1
    };
    this.wiproContact = [];
    this.isActivityGroupSearchLoading = true;
    // console.log('req body for owner search', reqBody);
    this.masterService.accountNameSearch(reqBody).subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      // console.log('account name search', res);
      if (!res.IsError && res.ResponseObject) {
        if (res.ResponseObject.length === 0) {
          this.wiproContact = [];
          this.wiproContact['message'] = 'No record found';
          // this.contactName = '';
        } else {
          this.wiproContact = this.getFilterAccountName(res.ResponseObject);
        }
      } else {
        this.wiproContact = [];
        this.wiproContact['message'] = 'No record found';
        this.contactName = '';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.wiproContact = [];
      this.wiproContact['message'] = 'No record found';
      this.contactName = '';
    });
  }

  getFilterAccountName(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.Name,
          contact: data.Name,
          designation: data.Designation ? data.Designation : ''
        };
      });
    }
  }


  accountNumber(data) {
    const reqBody = {
      'SearchText': data ? data : '',
      'OdatanextLink': '',
      'PageSize': 10,
      'RequestedPageNumber': 1
    };
    this.wiproContact1 = [];
    this.isActivityGroupSearchLoading = true;
    // console.log('req body for owner search', reqBody);
    this.masterService.accountNumberSearch(reqBody).subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      // console.log('account name search', res);
      if (!res.IsError && res.ResponseObject) {
        this.wiproContact1 = this.getFilterAccountNumber(res.ResponseObject);
        if (res.ResponseObject.length === 0) {
          this.wiproContact1 = [];
          this.wiproContact1['message'] = 'No record found';
          // this.contactName1 = '';
        }
      } else {
        this.wiproContact1 = [];
        this.wiproContact1['message'] = 'No record found';
        this.contactName1 = '';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.wiproContact1 = [];
      this.wiproContact1['message'] = 'No record found';
      this.contactName1 = '';
    });
  }

  getFilterAccountNumber(res) {
    //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },

    if (res.length !== 0) {
      return res.map((data) => {
        return {
          initials: data.Name ? data.Name : '',
          contact: data.Number,
          designation: data.Designation ? data.Designation : ''
        };
      });
    }
  }
  proposeTypeData: {}[];


  goBack() {
    this.router.navigateByUrl('accounts/accountlist/farming');
  }
  /****************** Account name code start ****************** */

  showContact: boolean = false;
  contactName: string = '';
  contactNameSwitch: boolean = true;

  contactNameclose() {
    this.contactNameSwitch = false;
  }
  appendcontact(value: string, i) {
    this.FinderAccountName = this.getdecodevalue(value);
    this.contactName = this.getdecodevalue(value);
    this.selectedContact.push(this.wiproContact[i]);
  }
  wiproContact = [];
  // = [

  //   { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedContact: {}[] = [];

  /****************** Account name code end ****************** */

  /****************** Account number autocomplete code start ****************** */

  showContact1: boolean = false;
  contactName1: string = '';
  contactNameSwitch1: boolean = true;

  contactNameclose1() {
    this.contactNameSwitch1 = false;
    // this.wiproContact1=[];
  }
  appendcontact1(value: string, i) {
    this.FinderAccountNumber = value;
    this.selectedContact1 = [];
    this.contactName1 = value;
    this.selectedContact1.push(this.wiproContact1[i]);
  }

  // = [

  //   { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]



  /****************** Account number  autocomplete code end ****************** */

  /****************** Account owner autocomplete code start ****************** */



  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }
  appendcontact2(value, i) {
    this.FinderAccountOwner = value.contact;
    this.contactName2 = value.contact;
    this.contactName2Obj = value.SysGuid;
    this.selectedContact2.push(this.wiproContact2[i]);
  }


  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]



  // appendcontact3(value, i) {
  //   this.contactName3 = value.Name;
  //   this.contactName3Obj = value.Id;
  //   this.contactName4 = '';
  //   this.contactName4Obj = '';
  //   this.contactName5 = '';
  //   this.contactName5Obj = '';
  //   this.contactSBUclose();
  //   this.selectedContact3.push(this.wiproContact3[i])
  // }
  appendcontact3(value, i) {
    this.FinderAccountSbu = value.Name;
    this.contactName3 = value.Name;
    this.contactName3Obj = value.Id;
    this.validateSBUField(value, i);
    // this.contactSBUclose();

  }

  validateSBUField(value, i) {
    if (this.contactName3 !== value.Name) {
      this.contactName4 = '';
      this.contactName4Obj = '';
      this.contactName5 = '';
      this.contactName5Obj = '';
    }
    this.selectedContact3.push(this.wiproContact3[i]);
  }


  /****************** sbu  autocomplete code end ****************** */
  /****************** Vertical autocomplete code start ****************** */



  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  appendcontact4(value, i) {
    this.contactName4 = value.contact;
    this.contactName4Obj = value.SysGuid;
    this.selectedContact4.push(this.wiproContact4[i]);
  }

  //  = [

  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]



  /****************** Vertical  autocomplete code end ****************** */
  /****************** Sub-vertical autocomplete code start ****************** */



  contactNameclose5() {
    this.contactNameSwitch5 = false;
  }
  appendcontact5(value, i) {
    this.contactName5 = value.contact;
    this.contactName5Obj = value.SysGuid;
    this.selectedContact5.push(this.wiproContact5[i]);
  }


  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]



  /****************** Sub-vertical  autocomplete code end ****************** */
  /****************** Geo autocomplete code start ****************** */


  contactNameclose6() {
    this.contactNameSwitch6 = false;
  }
  appendcontact6(value, i) {
    this.contactName6 = value.contact;
    this.contactName6Obj = value.SysGuid;
    this.selectedContact6.push(this.wiproContact6[i]);
  }


  /****************** Geo  autocomplete code end ****************** */
  /****************** region autocomplete code start ****************** */



  contactNameclose7() {
    this.contactNameSwitch7 = false;
  }
  appendcontact7(value, i, controls) {
    if (controls.name === 'Parent') {
      this.parentSysId = value.SysGuid;
      this.contactName7 = value.contact;
    }
    if (controls.name === 'Region') {
      this.regionSysId = value.SysGuid;
      this.contactName8 = value.contact;
    }
    // if (controls.name == "Terriotory flag") {
    //   this.territorySysId = true;
    // }
    this.selectedContact7.push(this.wiproContact7[i]);
  }


  /****************** region  autocomplete code end ****************** */
  /****************** Parent autocomplete code start ****************** */



  contactNameclose8() {
    this.contactNameSwitch8 = false;
  }
  appendcontact8(value, i) {
    this.contactName8 = value;
    this.selectedContact8.push(this.wiproContact8[i]);
  }


  /****************** Parent  autocomplete code end ****************** */
  openAddParametersPopup() {
    const dialogRef = this.dialog.open(AddParametersComponent,
      {
        disableClose: true,
        width: '660px',
        data: {
          dataKey: this.dynamicInputControl
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined || null) {
        this.isModalUpdated = true;
        this.dynamicInputControl = result;
        // console.log('new val -->', this.dynamicInputControl);
      } else {
        this.isModalUpdated = false;
      }

    });


  }


  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  additem(item) {
    this.showContent = false;
    this.router.navigate([item.router]);
  }

}
// RequestAccessPopup compnent
@Component({
  selector: 'request-access-popup',
  templateUrl: './request-access-popup.html',
  styleUrls: ['./account-finder.component.scss']
})

export class RequestAccesspopup {
  @Output() submitClicked = new EventEmitter<any>();
  fieldSubmitted: boolean = false;
  objectRowData; 
  constructor(public dialog: MatDialog, public router: Router, private EncrDecr: EncrDecrService, public snackBar: MatSnackBar,public userdat:DataCommunicationService,
    public dialogRef: MatDialogRef<RequestAccesspopup>, private accountListService: AccountListService, public accountListServ: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any) {
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
      // this.ReserveAccountActivationReqBody.Comment = activationComment;
      console.log(additionalComment);
      this.dialogRef.close('success');
      // this.ReserveAccountActivationReqBody.Comment = activationComment;
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
      // obj.reserveAccountActivation.accountid = this.SysGuid;
      // obj.overall_comments.accountid = this.SysGuid;
      // obj.overall_comments.overallcomments = activationComment;
      // obj.overall_comments.requestedby = this.userId;
      console.log(obj);

      // this.accountListServ.reserveAccount_activation(obj)
      //   .subscribe(
      //   (data) => {
      //     console.log('account activated', data);
      //     this.snackBar.open(data.Status, '', {
      //       duration: 1000
      //     });
      //     this.router.navigate(['/accounts/accountlist/farming']);
      //   },
      //   (error) => {
      //     console.log("Error in Activating account", error);
      //     this.snackBar.open(error.message, '', {
      //       duration: 3000
      //     });
      //   }
      //   );
      this.accountListService.account_modification(obj).subscribe(res => {
        this.isLoading = true;
        if (res.processInstanceId) {
        }
        const obj: any = {
          'SysGuid': res.data[0].modificationrequestid,
          'ProcessGuid': res.data[0].processInstanceId
        };
        this.accountListService.ModificationActiverequest_UpdateCamundatoCRM(obj).subscribe(result => {
          // this.snackBar.open("The request to create new Assignment Reference has been successfully placed, the request will now be pending with the SE SPOC for approval. Details are available in the 'Assignment Reference Active Request' view.", '', {
          //   duration: 5000
          // });
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
        // }
        //  else {
        //   this.isLoading = false;
        // }

        // result ==> success
        // this.getAccountDetails();
      }, err => {
        this.submitClicked.emit('error');
        console.log(err);
        this.dialogRef.close('failed');
        this.isLoading = false;
      });
    }
  }
}