// import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { AccountService } from '@app/core/services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountListService, AccountHeaders, AccountAdvNames } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Observable, of, concat, from } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
@Component({
  selector: 'app-account-ownership-history',
  templateUrl: './account-ownership-history.component.html',
  styleUrls: ['./account-ownership-history.component.scss']
})
export class AccountOwnershipHistoryComponent implements OnInit {
  ownershiphistoryTable = [];
  tableTotalCount: number;
  contactName: string;
  isLoading: boolean;
  Activerequest: any;
  // filterConfigData: any;
  contactNameSwitch: boolean;
  OwnerShipForm: FormGroup;
  account: any = [];
  AccountCreationActiveRequestsTable = [];
  accountCreationObj = {
    'accSysguid': ''
  };
  arrowkeyLocation;
  AccountName;
  submitted = false;
  error: any = { isError: false, errorMessage: '' };
  today = new Date();
  filterConfigData = {
    Ownershipstartdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Ownershipenddate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false

  };
  isActivityGroupSearchLoading;
  lookupdata = {
    tabledata: [
      { Name: '14 Nov Account Request', Number: 'ACC000023826' },
      { Name: 'acc modif flow test 4:06PM kkn', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },

    ],
    recordCount: 10,
    headerdata: [{ title: 'Name', name: 'Name' }, { title: 'Number', name: 'Number' }],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: ''
  };
  sendAllianceToAdvance = [];
  AllianceToAdvanceSelected = [];
  constructor(private EncrDecr: EncrDecrService,
    public router: Router, public errorMessage: ErrorMessage,
    public snackBar: MatSnackBar, private el: ElementRef,
    public userdat: DataCommunicationService, public accountservice: AccountService, private _fb: FormBuilder, public accountListService: AccountListService, public master3Api: S3MasterApiService,  public dialog: MatDialog ) { }
  get accOwnerSwap() { return this.OwnerShipForm.controls; }
  ngOnInit() {
    this.initializeForm();
    this.Activerequest = {
      'Guid': '',
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'LoggedinUser': { 'SysGuid': '' }
    };

    // this.getAccountApiDetail();
  }
  initializeForm() {

    this.OwnerShipForm = this._fb.group({
      account: ['', Validators.required],
      startDate: [''],
      endDate: [''],

    });
    this.today.setDate(this.today.getDate());
  }



  compareTwoDates(e) {
    // alert("hi");
    if (this.OwnerShipForm.controls['endDate'].value && (new Date(this.OwnerShipForm.controls['endDate'].value) < new Date(this.OwnerShipForm.controls['startDate'].value))) {
      this.error = { isError: true, errorMessage: 'End Date cannot before start date' };
    } else {
      this.error = { isError: false, errorMessage: '' };
    }
  }
  getEncodedData(data) {
    return this.accountListService.getSymbol(data);
  }
  getAccountApiDetail(value) {
    // this.account = [];
    const payload = {
      'SearchText': value,
      //'SearchText': '',
      PageSize: 50,
      OdatanextLink: '',
      RequestedPageNumber: 1
    };
    this.isActivityGroupSearchLoading = true;
    const account = this.accountListService.existAccountSearch(payload);
    account.subscribe((res: any) => {
      if (!res.IsError && res.ResponseObject) {
        this.isActivityGroupSearchLoading = false;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        // this.lookupdata.tabledata = res.ResponseObject;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (res.ResponseObject.length === 0) {
          this.account = [];
          this.account['message'] = 'No record found';
        } else {
          this.account = this.getTenRecords(res.ResponseObject);
        }
      } else {
        this.account = [];
        this.account['message'] = 'No record found';
      }
    }, error => {
      this.account = [];
      this.account['message'] = 'No record found';
    });
    // }
  }

  onSubmit() {
    // console.log('Valid?'); // true or false

    if (this.OwnerShipForm.invalid || this.error.isError) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,select.ng-invalid,input.ng-invalid');
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const reqbody = {
        'AccountGuid': this.accountCreationObj['accSysguid'] ? this.accountCreationObj['accSysguid'] : '',
        'StartDate': this.OwnerShipForm.value.startDate ? this.OwnerShipForm.value.startDate : '',
        'EndDate': this.OwnerShipForm.value.endDate ? this.OwnerShipForm.value.endDate : '',
        'PageSize': 50,
        'RequestedPageNumber': 1,
        'OdatanextLink': ''
      };
      this.GetAllAccounts(reqbody, true);
    }
  }


  removeSeletecedValue(formControlName, accObj) {
    this.accountCreationObj[accObj] = '';
    this.OwnerShipForm.controls[formControlName].setValue('');
  }
  appendAccountDetail(item) {
    this.accountCreationObj['accSysguid'] = item.SysGuid || '';
    this.OwnerShipForm.controls['account'].setValue(this.getEncodedData(item.Name));
    this.AccountName=this.getEncodedData(item.Name);
  }

  GetAllAccounts(reqBody, isConcat): void {

    this.isLoading = true;
    this.accountListService.OwnerShipHistory(reqBody, 'OwnerShipHistory')
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

            accountList.ResponseObject.map(res => {

              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });

            this.Activerequest = reqBody;

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
            this.tableTotalCount = accountList.TotalRecordCount;
            this.AccountCreationActiveRequestsTable = [{}];
          }
        } else {
          this.isLoading = false;
          // this.snackBar.open(accountList.Message, '', {
          //   duration: 3000
          // });
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
            SysGuid: activerequest.Owner.SysGuid,
            Name: this.accountListService.getSymbol(activerequest.Owner.FullName) || 'NA',
            Emailid: (activerequest.Owner && activerequest.Owner.Email) ? activerequest.Owner.Email : 'NA',
            Ownershipstartdate: (activerequest.StartDate) ? this.formatDateData(activerequest.StartDate) : 'NA',
            Ownershipenddate: (activerequest.EndDate) ? this.formatDateData(activerequest.EndDate) : 'NA',
            // startdate: (activerequest.Owner && activerequest.Type.Value) ? activerequest.Type.Value : 'NA',
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
  formatDateData(date) {
    const formatedDate = date.split('-');
    return formatedDate[2] + '-' + formatedDate[1] + '-' + formatedDate[0];
  }
  goBack() {
    // let url;
    // this.router.events.filter(e => e instanceof NavigationEnd)
    //   .pairwise().subscribe((e) => {
    //       // console.log("previous url"+e);
    //       url
    //   });
   const routeId =  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeValue'), 'DecryptionDecrip');
    // const  url = '/accounts/accountlist/farming';
    //  this.accountListService.goBack(url);
     // this.router.navigate(['/accounts/accountdetails']);
     // this.location.back();
     this.redirectPage(routeId);
   }
   redirectPage(data) {
    switch (data ? data : '') {
      case "10":
        this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
        break;
      case "11":
        this.router.navigate(['/accounts/accountlist/farming']);
        break;
      case "12":
        this.router.navigate(['/accounts/accountlist/alliance']);
        break;
      case "14":
        this.router.navigate(['/accounts/accountlist/reserve']);
        break;
      case "13":
        this.router.navigate(['/accounts/accountlist/AnalystAdvisor']);
        break;
        case "15":
          this.router.navigate(['/accounts/accountsearch']);
          break;
      // case 'More views':
      //   this.router.navigate(['/accounts/accountlist/moreview']);
      //   break;

      default:
        this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
        break;

    }
  }
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.Activerequest.PageSize = event.itemsPerPage;
      this.Activerequest.RequestedPageNumber = event.currentPage;
      if (this.userdat.checkFilterListApiCall(event)) {
        // filter api call
        this.GetAllAccounts(this.Activerequest, true);
        // this.CallListDataWithFilters(event);
      }

      else {
        // list api call
        this.GetAllAccounts(this.Activerequest, true);
      }
    }
    // else if (event.action === 'search') {
    //   this.ActiveAccountRequest = {
    //     'PageSize': event.itemsPerPage,
    //     'RequestedPageNumber': 1,
    //     'O    this.GetAllAccounts(this.Activerequest, true);datanextLink': '',
    //     'Guid': this.userId
    //   };
    // }
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;


    switch (actionRequired.action) {
      case 'Name': {

        return;
      }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return;
      }
      // case 'search': {
      //   // this.SearchTable(childActionRecieved);
      //   return;
      // }

    }
  }
  TablePagination(data) {
    this.Activerequest.RequestedPageNumber = this.Activerequest.RequestedPageNumber + 1;
    this.GetAllAccounts(this.Activerequest, true);
  }
  contactNameclose() {
    this.contactNameSwitch = false;
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    // let initalLookupData;
    // initalLookupData = this.remove_duplicates_From_Advanced_Lookup(this.data.SeletectedData, rowinitalLookupData);
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {

          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        else if (x.action == "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
        }
      })

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.emptyArray(controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
        // this.addAlliance();
      }
    });
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountOwnerPageNameSearch': {
        return this.AllianceToAdvanceSelected = [], this.sendAllianceToAdvance = []
      }

    }
  }
  getCommonData() {
    return {
      guid: '',
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountOwnerPageNameSearch': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
    }
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'accountOwnerPageNameSearch': (data) => { this.appendAccountDetail(data) },
  }
  getTenRecords(res) {
    // debugger;
    const resdata = res.slice(0, 9);
    return resdata;
  }
  // searchAccount() {
  //   return;
  // }
  // getNewTableData(e) {
  //   return;
  // }


}
