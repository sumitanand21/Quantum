import { Component, OnInit, Input, Inject } from '@angular/core';
import { SyncActivityService, accountHeader, SyncAdvNames, DnbSyncAccountHeader } from '@app/core/services/sync-activity.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA, MatSnackBarConfig } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MasterApiService, ErrorMessage } from '@app/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ClearMeetingList, ClearActivity, ClearMeetingDetails } from '@app/core/state/actions/activities.actions';
import { Navigationroutes, ActivityService } from '@app/core/services/activity.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { SyncgenericpopComponent } from '../syncgenericpop/syncgenericpop.component';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import moment from 'moment';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  configSuccess: MatSnackBarConfig = {
    duration: 5000,
  };
  syncActivityTable = [];
  syncFilterTable = [];
  newActivityAccountName: {}[] = []
  MeetingType: {}[] = []
  configData = {
    name: "Accounts",
    recordsCount: 5,
    Participant: [],
    Opportunity: [],
    Marketing: [],
    ActivityGroup: [],
    ActivateType: [],
    MeetingType: this.MeetingType,
    activityAccountName: this.newActivityAccountName
  };
  bsValue = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
  bsRangeValue: Date[];
  maxDate = new Date();
  today = new Date();
  maxAccessDate = new Date();
  totalCount: number = 0
  isLoading: boolean = false;
  AllSyncActivityRequestBody = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "FromDate": "",
    "ToDate": "",
    "Guid": ""
  };
  paginationPageNo = {
    "PageSize": 5,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  };
  dateTitle = '';
  isMakeSync: boolean = false;
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: '',
    errorMsg: {
      isError: false,
      message: ""
    },
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    }
  };
  constructor(
    public service: DataCommunicationService,
    public routingState: RoutingState,
    private userdat: SyncActivityService,
    private newConversationService: newConversationService,
    private meetingService: MeetingService,
    private datepipe: DatePipe,
    private encrDecrService: EncrDecrService,
    private router: Router,
    private masterApi: MasterApiService,
    public matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private activityService: ActivityService,
    private S3MasterApiService: S3MasterApiService,
    public errorMessage: ErrorMessage,
    public store: Store<AppState>) {
    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate]
    this.dateTitle = `From ${this.datepipe.transform(this.bsValue, 'd-MMM-y')} to From ${this.datepipe.transform(this.maxDate, 'd-MMM-y')}`;
    this.AllSyncActivityRequestBody.Guid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), "DecryptionDecrip")
  }

  ngOnInit(): void {
    console.log(this.bsRangeValue)
    this.getMeetingType();
    this.getActivityType();
    var today = new Date();
    this.maxAccessDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    console.log(this.maxAccessDate)
    var fromDate = new Date(this.bsRangeValue[0]);
    var toDate = new Date(this.bsRangeValue[1]);
    var month = (fromDate.getMonth() + 1) < 10 ? ("0" + (fromDate.getMonth() + 1)) : (fromDate.getMonth() + 1);
    var date = fromDate.getDate() < 10 ? "0" + fromDate.getDate() : fromDate.getDate();
    var start = fromDate.getFullYear() + '-' + month + '-' + date;
    var hours = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
    var getStartTime = '00' + ':' + '01' + ':' + "00";
    var finalStartDate = start + 'T' + getStartTime + '.000Z';
    var month1 = (toDate.getMonth() + 1) < 10 ? ("0" + (toDate.getMonth() + 1)) : (toDate.getMonth() + 1);
    var date1 = toDate.getDate() < 10 ? "0" + toDate.getDate() : toDate.getDate();
    var end = toDate.getFullYear() + '-' + month1 + '-' + date1;
    var getEndTime = 23 + ':' + 59 + ':' + "00";
    var finalEndDate = end + 'T' + getEndTime + '.000Z';
    this.AllSyncActivityRequestBody.FromDate = finalStartDate
    this.AllSyncActivityRequestBody.ToDate = finalEndDate
    this.getUnsyncActivityList(this.AllSyncActivityRequestBody);
    // this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
    //   localStorage.setItem('dNBToken', res.ResponseObject.access_token)
    // })
  }

  getMeetingType() {
    this.newConversationService.getConversationType().subscribe(data => {
      if (!data.IsError) {
        this.configData.MeetingType = data.ResponseObject.map(res => { return { "id": res.Id, "name": res.Value } })
      }
    })
  }

  getActivityType() {
    this.masterApi.getActivity().subscribe(res => {
      console.log('Activity type', res)
      if (!res.IsError) {
        this.configData.ActivateType = res.ResponseObject.map(res => { return { "id": res.Id, "name": res.Value } })
      }
    })
  }

  navTo() {
    console.log("clicked back arrow")
    console.log('Previous url-->', this.routingState.getPreviousUrl());
    if (this.routingState.getPreviousUrl() == "/home/dashboard") {
      this.router.navigate(['/activities/list'])
    }
    else if (this.routingState.getPreviousUrl().includes("meetingList")) {
      this.router.navigate(['/activities/activitiesthread'])
    } else {
      let routeId = JSON.parse(sessionStorage.getItem('navigation'))
      debugger
      this.router.navigate([Navigationroutes[routeId]])
    }
  }

  performTableChildAction(childActionRecieved) {
    var actionRequired = childActionRecieved;
    console.log(actionRequired)
    switch (actionRequired.action) {
      case 'createActivty':
        {
          this.onCreateNewActivityGroup(actionRequired.objectRowData)
          break;
        }
      case 'ActivateType': {
        this.onBasedActivityTypeValidations(actionRequired.objectRowData.data.ActivateType, actionRequired.objectRowData.data.id, actionRequired.objectRowData.data)
        break;
      }
      case 'advanceLookUp': {
        this.advanceLookupAccount(actionRequired.objectRowData.isSearch, actionRequired.rowData);
        break;
      }
      case 'Participant':
        {
          if (actionRequired.rowData.Account.id !== '') {
            this.createCustomerData = [];
            this.openSyncpop(actionRequired, false)
          } else {
            this.errorMessage.throwError('Select the account name')
          }
          break;
        }
      case 'Opportunity':
        {
          if (actionRequired.rowData.Account.id !== '') {
            const dialogRef = this.dialog.open(SyncgenericpopComponent, {
              width: '850px',
              data: {
                actionName: actionRequired.action,
                account: actionRequired.rowData.Account,
                isSearch: actionRequired.objectRowData.isSearch,
                data: (actionRequired.rowData.Opportunity[0] === "NA") ? [] : actionRequired.rowData.Opportunity,
                selectedData: (actionRequired.rowData.Opportunity[0] === "NA") ? [] : actionRequired.rowData.Opportunity
              }
            });
            dialogRef.afterClosed().subscribe(res => {
              console.log(res)
              if (res !== undefined) {
                if (res.data.length > 0) {
                  actionRequired.rowData.Opportunity = res.data;
                  let names = ''
                  names = Array.prototype.map.call(res.data, s => s.name).toString()
                  actionRequired.rowData._Opportunity = [names];
                  actionRequired.rowData['&Opportunity'] = false;
                } else {
                  actionRequired.rowData.Opportunity = ['NA'];
                  actionRequired.rowData._Opportunity = [undefined];
                  if (actionRequired.rowData.isLeadRequired) {
                    actionRequired.rowData['&Opportunity'] = true;
                  }
                }
              }
            })
          } else {
            this.errorMessage.throwError('Select the account name')
          }
          break;
        }
      case 'ActivityGroup':
        {
          console.log(actionRequired);
          if (actionRequired.rowData !== null) {
            if (actionRequired.rowData.Account.id === '') {
              this.getActivityGroup(actionRequired.objectRowData, actionRequired.rowData);
            } else {
              this.searchActivityGroupBasedOnAccount(actionRequired.rowData.Account.id, actionRequired.rowData)
            }
          } else {
            this.appendAccount(actionRequired.objectRowData.itemData, actionRequired.objectRowData.rowData)
          }
          break;
        }
      case 'Account': {
        if (actionRequired.rowData !== null) {
          this.userdat.getsearchAccountCompany(actionRequired.objectRowData).subscribe(res => {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            let data = res.ResponseObject.map(x => {
              return {
                ...x,
                'Name': (x.Name) ? x.Name : 'NA',
                'Owner': (x.Owner) ? x.Owner.FullName : 'NA',
                'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                'accnumber': (x.Number) ? x.Number : 'NA',
                'type': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA'
              }
            })
            this.lookupdata.tabledata = data;
            actionRequired.rowData['$Account'] = res.ResponseObject.map(data => {
              return {
                id: data.SysGuid,
                name: (data.Name) ? data.Name : 'NA',
                isProspect: data.isProspect
              }
            })
          })
          this.lookupdata.inputValue = actionRequired.objectRowData;
          //  this.onSearchAccount(actionRequired.objectRowData, actionRequired.rowData)
        } else {
          actionRequired.objectRowData.rowData['@Account'] = false
          actionRequired.objectRowData.rowData['@ActivityGroup'] = true
          this.searchActivityGroupBasedOnAccount(actionRequired.objectRowData.itemData.id, actionRequired.objectRowData.rowData)
        }
        break;
      }
      case 'createActivity':
        {
          this.configData.activityAccountName = this.newActivityAccountName;
          break;
        }
      case 'Marketing':
        {
          if (actionRequired.objectRowData.rowData === undefined) {
            if (actionRequired.rowData.Account.id === "") {
              this.configData.Marketing = []
              this.errorMessage.throwError("Please select account name")
            } else {
              this.configData.Marketing = []
              this.getCampaign(actionRequired.objectRowData, actionRequired.rowData.Account)
            }
          } else {
            console.log(actionRequired.objectRowData.rowData)
            if (actionRequired.objectRowData.rowData.isMarketingRequired) {
              actionRequired.objectRowData.rowData['&Marketing'] = false;
            }
          }
          break;
        }
      case 'copy':
        {
          let copyData = this.syncActivityTable.find(data => data.id == actionRequired.objectRowData.from)
          switch (actionRequired.objectRowData.colName) {
            case "All": {
              this.OnCopyRow(copyData, actionRequired.objectRowData.to)
              break;
            }
            case "Participant": {
              this.onCopyParticipant(copyData, actionRequired.objectRowData.to);
              break;
            }
            case "Opportunity": {
              this.onCopyOpportunityLead(copyData, actionRequired.objectRowData.to);
              break;
            }
            case "MeetingType": {
              this.onCopyMeetingType(copyData, actionRequired.objectRowData.to);
              break;
            }
            case "ActivityGroup": {
              this.onCopyActivityGroup(copyData, actionRequired.objectRowData.to)
              break;
            }
            case "Account": {
              this.onCopyAccount(copyData, actionRequired.objectRowData.to)
              break;
            }
            case "Marketing": {
              this.onCopyMarketing(copyData, actionRequired.objectRowData.to)
              break;
            }
            case "ActivateType": {
              this.onCopyActivityType(copyData, actionRequired.objectRowData.to)
              break;
            }
          }
          break;
        }
      case 'sync':
        {
          this.onMakeSync(actionRequired.objectRowData)
          break;
        }
      case 'multiSync': {
        this.onMultipleSync(actionRequired.objectRowData)
        break
      }
      case 'MeetingType':
        {
          console.log(JSON.stringify(actionRequired))
          break;
        }
      case 'meetingFilter': {
        console.log(JSON.stringify(actionRequired.filterData))
        this.onMeetingFilter(actionRequired)
        break;
      }
      case 'search': {
        this.onSearch(actionRequired)
        break;
      }
      case 'autoClose': {
        var res = actionRequired.objectRowData
        if (actionRequired.rowData != "Marketing") {

          res['ActivityGroup'] = {
            id: "",
            name: "",
            ActivateType: "",
            ActivityTypeId: 0,
            Account: "",
            AccountSysId: ""
          }
          res['Account'] = { id: '', name: '', isProspect: false };
          res["Participant"] = ['NA'];
          res["Opportunity"] = ["NA"];
          res['Marketing'] = null
        } else {
          res['Marketing'] = null
        }
        break;
      }
    }
  }

  onMeetingFilter(actionRequired) {
    if (actionRequired.filterData.length > 0) {
      if (actionRequired.filterData.length === 1) {
        if (actionRequired.objectRowData) {
          this.syncFilterTable = this.syncFilterTable.filter(res => (res.Meeting == actionRequired.filterData[0].name && res.Subject.includes(actionRequired.objectRowData)))
            .map((x, index) => {
              x.index = index + 1;
              return x
            })
        } else {
          this.syncFilterTable = this.syncActivityTable.filter(res =>
            res.Meeting == actionRequired.filterData[0].name
          )
            .map((x, index) => { x.index = index + 1; return x })
        }
        this.totalCount = this.syncFilterTable.length;
        if (this.syncFilterTable.length === 0) {
          this.syncFilterTable = [{}]
        }
      } else {
        if (actionRequired.objectRowData === undefined || actionRequired.objectRowData === "") {
          this.syncFilterTable = this.syncActivityTable;
          this.totalCount = this.syncFilterTable.length;
        } else {
          this.syncFilterTable = this.syncActivityTable.filter(res => {
            return res.Subject.includes(actionRequired.objectRowData)
          })
            .map((x, index) => {
              x.index = index + 1;
              return x
            })
        }
      }
    } else {
      if (actionRequired.objectRowData === undefined || actionRequired.objectRowData === "") {
        this.syncFilterTable = this.syncActivityTable;
        this.totalCount = this.syncFilterTable.length;
      } else {
        this.syncFilterTable = this.syncActivityTable.filter(res => {
          return res.Subject.includes(actionRequired.objectRowData)
        })
          .map((x, index) => {
            x.index = index + 1;
            return x
          })
      }
    }
  }

  onSearch(actionRequired) {
    if (actionRequired.objectRowData) {
      if (actionRequired.filterData.length === 0 || actionRequired.filterData.length === 2) {
        this.syncFilterTable = this.syncActivityTable.filter(res => {
          return res.Subject.includes(actionRequired.objectRowData)
        })
          .map((x, index) => {
            x.index = index + 1;
            return x
          })
      } else {
        this.syncFilterTable = this.syncFilterTable.filter(res => (res.Meeting == actionRequired.filterData[0].name && res.Subject.includes(actionRequired.objectRowData)))
          .map((x, index) => {
            x.index = index + 1;
            return x
          })
      }
      this.totalCount = this.syncFilterTable.length;
      if (this.syncFilterTable.length === 0) {
        this.syncFilterTable = [{}]
      }
    } else {
      if (actionRequired.filterData.length === 0 || actionRequired.filterData.length === 2) {
        this.syncFilterTable = this.syncActivityTable;
        this.totalCount = this.syncFilterTable.length;
      } else {
        this.syncFilterTable = this.syncActivityTable.filter(res =>
          res.Meeting == actionRequired.filterData[0].name
        )
          .map((x, index) => { x.index = index + 1; return x })
        this.totalCount = this.syncFilterTable.length;
      }
    }
  }

  openSyncpop(actionRequired, isfromCustomer) {
    const dialogRef = this.dialog.open(SyncgenericpopComponent, {
      width: '850px',
      data: {
        actionName: actionRequired.action,
        account: actionRequired.rowData.Account,
        isSearch: actionRequired.objectRowData.isSearch,
        data: (actionRequired.rowData.Participant[0] === "NA") ? [] : actionRequired.rowData.Participant,
        selectedData: isfromCustomer ? this.createCustomerData : this.participantMappingData(actionRequired)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res)
      if (res !== undefined) {
        if (res.isCreateCustomer) {
          this.createCustomer(actionRequired, res.data)
        }
        else {
          if (res.data.length > 0) {
            actionRequired.rowData.Participant = res.data;
            let names = ''
            names = Array.prototype.map.call(res.data, s => s.name).toString()
            actionRequired.rowData._Participant = [names];
            actionRequired.rowData['&Participant'] = false;
          } else {
            actionRequired.rowData.Participant = ['NA'];
            actionRequired.rowData._Participant = [undefined]
            if (actionRequired.rowData.isParticipantRequired) {
              actionRequired.rowData['&Participant'] = true;
            }
          }
        }
      }
    })
  }

  participantMappingData(actionRequired) {
    return (actionRequired.rowData.Participant[0] === "NA") ? [] : actionRequired.rowData.Participant
  }

  createCustomer(actionRequired, selectedData) {
    this.createCustomerData = selectedData
    const cusomerDialogRef = this.dialog.open(CustomerpopupComponent, {
      width: '800px',
      data: {
        Name: actionRequired.rowData.Account.name,
        SysGuid: actionRequired.rowData.Account.id,
        isProspect: actionRequired.rowData.Account.isProspect
      }
    });
    cusomerDialogRef.afterClosed().subscribe(data => {
      if (data != '') {
        let cust = {
          id: data.Guid,
          name: `${data.FName} ${data.LName}`,
          accountName: data.CustomerAccount.Name,
          designation: data.Designation ? data.Designation : 'NA',
          email: data.Email ? data.Email : 'NA',
          isChecked: true,
          isCustomer: true
        }
        this.createCustomerData.push(cust)
      }
      this.openSyncpop(actionRequired, true);
    })
  }

  createCustomerData = []
  lookupHeaders() {
    this.lookupdata.headerdata = accountHeader['AccountSearch'];
    this.lookupdata.lookupName = SyncAdvNames['AccountSearch']['name'];
    this.lookupdata.isCheckboxRequired = SyncAdvNames['AccountSearch']['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = false;
  }

  lookupDnbHeaders() {
    this.lookupdata.controlName = 'AccountSearch';
    this.lookupdata.headerdata = DnbSyncAccountHeader;
    this.lookupdata.lookupName = SyncAdvNames['AccountSearch']['name'];
    this.lookupdata.isCheckboxRequired = SyncAdvNames['AccountSearch']['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = false;
  }

  advanceLookupAccount(value, rowData) {
    this.lookupHeaders();
    const advanceDialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: '952px',
      data: this.lookupdata
    })
    advanceDialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,
        pageNo: x.currentPage
      }
      if (x.objectRowData.wiprodb) {
        this.userdat.getLookUpFilterData({ data: null, controlName: 'AccountSearch', isService: true, useFullData: dialogData }).subscribe(res => {
          console.log("data check", res)
          this.lookupdata.isLoader = false;
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = '';
          if (res.IsError == false) {
            if (x.action == "loadMore") {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            } else if (x.action == "search") {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
          } else {
            this.lookupdata.errorMsg.isError = true;
            this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
          }
        })
      } else {
        this.lookupDnbHeaders();
        this.dnBDataBase(x);
      }
    })
    advanceDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.selectedData);
        let data = result.selectedData
        rowData['Account'] = { id: data[0].Id, name: data[0].Name, isProspect: data[0].isProspect }
        rowData['&Account'] = false;
        this.userdat.searchBasedOnUserandAccount("", data[0].Id).subscribe(res => {
          if (!res.IsError) {
            rowData['$ActivityGroup'] = res.ResponseObject.map(res => {
              return {
                "id": res.Guid,
                "name": res.Name,
                "ActivateType": "NA",
                "ActivityTypeId": "",
                "Account": res.Account.Name,
                "AccountSysId": res.Account.SysGuid,
                "isProspect": res.Account.isProspect
              }
            })
            if (res.ResponseObject.length === 1) {
              let index = this.syncActivityTable.findIndex(k => k.id == rowData.id);
              this.syncActivityTable[index].ActivityGroup.id = res.ResponseObject[0].Guid
              this.syncActivityTable[index].ActivityGroup.name = res.ResponseObject[0].Name
              this.syncActivityTable[index]['&ActivityGroup'] = false;
            }
            if (res.ResponseObject.length === 0) {
              let index = this.syncActivityTable.findIndex(k => k.id == rowData.id);
              this.syncActivityTable[index].ActivityGroup.id = ""
              this.syncActivityTable[index].ActivityGroup.name = this.syncActivityTable[index].Subject
              this.createNewActivty(index)
            }
          }
        })
      }
    })
  }

  dnBDataBase(action) {
    this.lookupdata.otherDbData.isLoader = true;
    this.lookupdata.isLoader = true;
    if (action.action == "dbAutoSearch") {
      this.activityService.getCountryData({ isService: true, searchKey: action.objectRowData.searchKey }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
        this.lookupdata.errorMsg.message = '';
        if (res.IsError == false) {
          this.lookupdata.otherDbData.countryvalue = res.ResponseObject;
        }
        if (res.IsError == true) {
          this.lookupdata.tabledata = [];
          this.lookupdata.TotalRecordCount = 0;
          this.lookupdata.nextLink = ''
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
      })
    }
    if (action.action == "dbSearch") {
      let body = {
        "CustomerAccount": {
          "Name": action.objectRowData.dbSerachData.accountname.value,
          "Address": { "CountryCode": action.objectRowData.dbSerachData.countryvalue.id }
        }
      }
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
        this.lookupdata.errorMsg.message = ''
        if (res.IsError == false) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        if (res.IsError == true) {
          this.lookupdata.tabledata = [];
          this.lookupdata.TotalRecordCount = 0;
          this.lookupdata.nextLink = ''
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    }
  }

  onCreateNewActivityGroup(newActivityData) {
    debugger
    let index = this.syncActivityTable.findIndex(k => k.id == newActivityData.rowData.itemData[0].id)
    var body1 = {
      "id": newActivityData.data.Guid,
      "name": newActivityData.data.Name,
      "ActivateType": "NA",
      "ActivityTypeId": 0,
      "Account": newActivityData.data.Account.Name,
      "AccountSysId": newActivityData.data.Account.SysGuid
    }
    this.syncActivityTable[index].ActivityGroup = body1;
    //this.syncActivityTable[index].ActivateType = "NA"
    this.syncActivityTable[index].Account.name = newActivityData.data.Account.Name
    this.syncActivityTable[index].Account.id = newActivityData.data.Account.SysGuid
    this.syncActivityTable[index].Account.isProspect = newActivityData.data.Account.isProspect
  }

  getActivityGroup(searchText, rowData): any {
    this.userdat.activityGroupSearchBasedOnUser(searchText).subscribe(data => {
      if (!data.IsError) {
        rowData['$ActivityGroup'] = data.ResponseObject.map(res => {
          return {
            "id": res.Guid,
            "name": res.Name,
            "ActivateType": "NA",
            "ActivityTypeId": "",
            "Account": res.Account.Name,
            "AccountSysId": res.Account.SysGuid,
            "isProspect": res.Account.isProspect
          }
        })
      }
    })
  }

  appendAccount(itemData, rowData) {
    rowData['Account'].id = itemData.AccountSysId
    rowData['Account'].name = itemData.Account
    rowData['Account'].isProspect = itemData.isProspect
    rowData['_Account'] = itemData.Account
    rowData['&Account'] = false

  }

  searchActivityGroupBasedOnAccount(id, rowData) {
    this.userdat.searchBasedOnUserandAccount("", id).subscribe(res => {
      if (!res.IsError) {
        rowData['$ActivityGroup'] = res.ResponseObject.map(res => {
          return {
            "id": res.Guid,
            "name": res.Name,
            "ActivateType": "NA",
            "ActivityTypeId": "",
            "Account": res.Account.Name,
            "AccountSysId": res.Account.SysGuid,
            "isProspect": res.Account.isProspect
          }
        })
        if (res.ResponseObject.length === 1) {
          let index = this.syncActivityTable.findIndex(k => k.id == rowData.id);
          this.syncActivityTable[index].ActivityGroup.id = res.ResponseObject[0].Guid
          this.syncActivityTable[index].ActivityGroup.name = res.ResponseObject[0].Name
          this.syncActivityTable[index]['&ActivityGroup'] = false;
        }
        if (res.ResponseObject.length === 0) {
          let index = this.syncActivityTable.findIndex(k => k.id == rowData.id);
          this.syncActivityTable[index].ActivityGroup.id = ""
          this.syncActivityTable[index].ActivityGroup.name = this.syncActivityTable[index].Subject
          this.createNewActivty(index)
        }
      }
    })
  }

  // create new Activity Group if Account have no Activity group
  createNewActivty(index) {
    this.isMakeSync = true;
    let body = {
      "Name": this.syncActivityTable[index].Subject,
      "ActivityType": { "Id": 0 },
      "Account": { "SysGuid": this.syncActivityTable[index].Account.id, "Name": this.syncActivityTable[index].Account.name, "isProspect": this.syncActivityTable[index].Account.isProspect },
    }
    this.newConversationService.getCreateActivityGroup(body).subscribe(res => {
      this.isMakeSync = false;
      if (res.IsError === false) {
        this.syncActivityTable[index]['&ActivityGroup'] = false;
        this.syncActivityTable[index]['&Account'] = false;
        this.syncActivityTable[index].ActivityGroup.id = res.ResponseObject.Guid
      } else {
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isMakeSync = false;
    })
  }

  onSearchAccount(searchData, rowData) {
    this.newConversationService.getsearchAccountCompany(searchData).subscribe(res => {
      rowData['$Account'] = res.ResponseObject.map(data => {
        return {
          id: data.SysGuid,
          name: data.Name,
          isProspect: data.isProspect
        }
      })
    })
  }

  getCampaign(searchText, account) {
    this.userdat.searchCampaignBasedOnAccount(searchText, account.id, account.isProspect).subscribe(data => {
      console.log(data)
      if (!data.IsError) {
        this.configData.Marketing = data.ResponseObject.map(res => {
          return {
            name: res.Name, id: res.Id
          }
        })
      } else {
        this.errorMessage.throwError(data.Message);
      }
    })
  }

  // Based on Activity type Validation
  onBasedActivityTypeValidations(id, rowid, rowData) {
    this.newConversationService.GetValidations(id).subscribe(res => {
      if (!res.IsError) {
        let isLeadRequired = false
        if (res.ResponseObject.IsLeadReq) {
          isLeadRequired = true
        }
        if (res.ResponseObject.IsOpportunityReq) {
          isLeadRequired = true
        }
        this.syncActivityTable.filter(x => x.id === rowid).forEach(y => {
          y.isLeadRequired = isLeadRequired,
            rowData['&Opportunity'] = (rowData.Opportunity[0] === "NA") ? isLeadRequired : false
          y.isParticipantRequired = res.ResponseObject.IsCustReq,
            rowData['&Participant'] = (rowData.Participant[0] === "NA") ? res.ResponseObject.IsCustReq : false
          y.isMarketingRequired = res.ResponseObject.IsCampaignReq
          rowData['&Marketing'] = res.ResponseObject.IsCampaignReq
          rowData['#Participant'] = 'Please select participant'
          rowData['#Marketing'] = 'Please select campaign'
          rowData['#Opportunity'] = 'Please select Opportunity/Lead'
        })

      } else {
        this.errorMessage.throwError(res.Message)
      }
    },
      error => {

      })
  }

  // Make sync 
  onMakeSync(data) {
    console.log("Makesync", data)
    var body
    this.isMakeSync = true;
    if (data.Meeting == false) {
      body = [{
        "OutlookId": data.id,
        "Name": data.Subject,
        "Owner": {
          "AdId": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip')
        },
        // "ScheduleStart": data.MeetingDate + "Z",
        "ScheduleStart": data.MeetingDate,
        "IsPrivate": true,
        "IsLiveMeeting": true,
        "Description": "",
        "MOM": "",
        "Account": {
          "SysGuid": data.Account.id,
          "Name": data.Account.name,
          "isProspect": data.Account.isProspect
        },
        "HasConsentToRecord": true,
        "Conversation": (data.MeetingType == "-1") ? {} : { "Type": data.MeetingType },
        "IsMeeting": data.Meeting,
        "EndDate": data.EndDate,
        "MeetingType": { "Id": data.ActivateType },
        "ActivityGroup": {
          "Guid": data.ActivityGroup.id
        },
        "WiproParticipant": data.Participant[0] === "NA" ? [] : this.WiproParticipantFilter(data.Participant),
        "Attachments": [],
        "TagUserToView": [],
        "WiproPotentialSolution": [],
        "Campaign": data.Marketing === null ? [] : this.CampaignFilterData(data.Marketing),
        "OpportunitiesOrOrders": data.Opportunity[0] === "NA" ? [] : this.OpportunityFilterData(data.Opportunity),
        "Lead": data.Opportunity[0] === "NA" ? [] : this.LeadFilterData(data.Opportunity),
        "CustomerContacts": data.Participant[0] === "NA" ? [] : this.customerParticipantFilter(data.Participant),
      }]
    } else {
      body = [this.unMeetingBody(data)]
    }
    console.log("Final data", body)
    this.userdat.makeSync(body).subscribe(meetingData => {
      console.log(meetingData)
      debugger
      this.isMakeSync = false;
      if (!meetingData.IsError) {
        if (data.Meeting == true) {
          this.errorMessage.throwError(meetingData.Message)
        } else {
          this.matSnackBar.openFromComponent(SyncMessageComponent, {
            data: data.Subject,
            ...this.configSuccess
          });
        }
        this.syncActivityTable = this.syncActivityTable.filter(res => res.id !== data.id).map((x, index) => {
          x.index = index + 1;
          return x
        })
        this.syncFilterTable = this.syncFilterTable.filter(res => res.id !== data.id).map((x, index) => {
          x.index = index + 1;
          return x
        })
        this.totalCount = this.syncFilterTable.length
        if (this.syncActivityTable.length === 0) {
          this.syncActivityTable = [{}]
        }
        if (this.syncFilterTable.length === 0) {
          this.syncFilterTable = [{}]
        }
        if (data.Meeting == false) {
          this.store.dispatch(new ClearMeetingDetails())
          this.store.dispatch(new ClearActivity())
          this.store.dispatch(new ClearMeetingList({ cleardetails: meetingData.ResponseObject[0].ActivityGroup.Guid }))
        }
        if (data.meeting == true) {
          this.store.dispatch(new ClearActivity())
        }
      } else {
        this.errorMessage.throwError(meetingData.Message)
      }
    },
      error => {
        this.isMakeSync = false
      })
  }

  unMeetingBody(data) {
    return {
      "OutlookId": data.id,
      "Name": data.Subject,
      "Owner": {
        "AdId": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip')
      },
      "ScheduleStart": data.MeetingDate,
      "IsPrivate": true,
      "IsLiveMeeting": true,
      "Description": "",
      "MOM": "",
      "Account": {},
      "HasConsentToRecord": true,
      "Conversation": {},
      "IsMeeting": true,
      "EndDate": data.EndDate,
      "MeetingType": {},
      "ActivityGroup": { "Guid": "" },
      "WiproParticipant": [],
      "Attachments": [],
      "TagUserToView": [],
      "WiproPotentialSolution": [],
      "Campaign": [],
      "OpportunitiesOrOrders": [],
      "Lead": [],
      "CustomerContacts": []
    }
  }

  onMultipleSync(userData) {
    console.log('multiplesyn', userData)
    this.isMakeSync = true;
    let body = []
    userData.forEach(data => {
      if (data.Meeting == false) {
        body.push({
          "OutlookId": data.id,
          "Name": data.Subject,
          "Owner": {
            "AdId": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip')
          },
          "ScheduleStart": data.MeetingDate,
          "IsPrivate": true,
          "IsLiveMeeting": true,
          "Description": "",
          "MOM": "",
          "Account": {
            "SysGuid": data.Account.id,
            "Name": data.Account.name,
            "isProspect": data.Account.isProspect
          },
          "HasConsentToRecord": true,
          "Conversation": (data.MeetingType == "-1") ? {} : { "Type": data.MeetingType },
          "IsMeeting": data.Meeting,
          "EndDate": data.EndDate,
          "MeetingType": { "Id": data.ActivateType },
          "ActivityGroup": {
            "Guid": data.ActivityGroup.id
          },
          "WiproParticipant": data.Participant[0] === "NA" ? [] : this.WiproParticipantFilter(data.Participant),
          "Attachments": [],
          "TagUserToView": [],
          "WiproPotentialSolution": [],
          "Campaign": data.Marketing === null ? [] : this.CampaignFilterData(data.Marketing),
          "OpportunitiesOrOrders": data.Opportunity[0] === "NA" ? [] : this.OpportunityFilterData(data.Opportunity),
          "Lead": data.Opportunity[0] === "NA" ? [] : this.LeadFilterData(data.Opportunity),
          "CustomerContacts": data.Participant[0] === "NA" ? [] : this.customerParticipantFilter(data.Participant),
        })
      } else {
        body.push(this.unMeetingBody(data))
      }
    });
    this.userdat.makeSync(body).subscribe(meetingData => {
      console.log(meetingData)
      debugger
      this.isMakeSync = false;
      if (!meetingData.IsError) {
        let message = `${body.length} number of activities has been synced and meeting created`
        this.errorMessage.throwError(message)
        userData.forEach(data => {
          this.syncActivityTable = this.syncActivityTable.filter(res => res.id !== data.id).map((x, index) => {
            x.index = index + 1;
            return x
          })
          this.syncFilterTable = this.syncFilterTable.filter(res => res.id !== data.id).map((x, index) => {
            x.index = index + 1;
            return x
          })
          this.totalCount = this.syncFilterTable.length
          if (this.syncActivityTable.length === 0) {
            this.syncActivityTable = [{}]
          }
          if (this.syncFilterTable.length === 0) {
            this.syncFilterTable = [{}]
          }
          if (data.Meeting == false) {
            this.store.dispatch(new ClearMeetingDetails())
            this.store.dispatch(new ClearActivity())
            this.store.dispatch(new ClearMeetingList({ cleardetails: data.ActivityGroup.id }))
          }
          if (data.meeting == true) {
            this.store.dispatch(new ClearActivity())
          }
        })
      } else {
        this.errorMessage.throwError(meetingData.Message)
      }
    },
      error => {
        this.isMakeSync = false
      })
  }


  UtcConversation(data) {
    return moment(data.split(':00')[0], "YYYY-MM-DDTHH:mm:mm").utc()
  }

  WiproParticipantFilter(data): Array<any> {
    try {
      let wiproArry = []
      let wiproData = []
      wiproData = data.filter(res => res.isCustomer === false)
      if (wiproData.length > 0) {
        wiproData.map(x => wiproArry.push({ "SysGuid": x.id, "MapGuid": "", "LinkActionType": 1 }))
      }
      return wiproArry
    }
    catch (error) {
      return []
    }
  }

  customerParticipantFilter(data): Array<any> {
    debugger
    try {
      let customerArry = []
      let customerData = []
      customerData = data.filter(res => res.isCustomer === true)
      if (customerData.length > 0) {
        customerData.map(x => customerArry.push({ "Guid": x.id, "MapGuid": "", "LinkActionType": 1 }))
      }
      return customerArry
    }
    catch (error) {
      return []
    }
  }

  LeadFilterData(data): Array<any> {
    try {
      let LeadArry = []
      let LeadData = []
      LeadData = data.filter(res => res.isLead == true)
      if (LeadData.length > 0) {
        LeadData.map(x => LeadArry.push({ MapGuid: "", LeadGuid: x.id }))
      }
      return LeadArry
    }
    catch (error) {
      return []
    }
  }

  CampaignFilterData(data): Array<any> {
    try {
      let campainArry = []
      if (data.id !== '') {
        campainArry = [{ Id: data.id, MapGuid: "", Name: data.name }]
      }
      return campainArry
    }
    catch (error) {
      return []
    }
  }

  OpportunityFilterData(data): Array<any> {
    try {
      let OppArry = []
      let OppData = []
      OppData = data.filter(k => k.isLead === false)
      if (OppData.length > 0) {
        OppData.map(x => OppArry.push({ SysGuid: x.id, MapGuid: "", Title: x.name, Type: x.Type }))
      }
      return OppArry
    }
    catch (error) {
      return []
    }
  }

  // copy rown data
  OnCopyRow(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      this.syncActivityTable[index].isParticipantRequired = copyData.isParticipantRequired
      this.syncActivityTable[index].isLeadRequired = copyData.isLeadRequired
      this.syncActivityTable[index].isMarketingRequired = copyData.isMarketingRequired
      if (copyData.ActivityGroup.id !== '') {

        this.syncActivityTable[index].ActivityGroup = copyData.ActivityGroup
      }
      if (copyData.Account.id !== '') {
        this.syncActivityTable[index].Account = copyData.Account
      }
      if (copyData.ActivateType != -1) {
        this.syncActivityTable[index].ActivateType = copyData.ActivateType
      }
      if (copyData.MeetingType != -1) {
        this.syncActivityTable[index].MeetingType = copyData.MeetingType
      }
      this.syncActivityTable[index].Meeting = copyData.Meeting

      if (copyData.Participant[0] !== "NA") {
        if (this.syncActivityTable[index].Participant[0] === "NA") {
          this.syncActivityTable[index].Participant = copyData.Participant
        } else {
          this.syncActivityTable[index].Participant = this.service.removeDuplicates(this.syncActivityTable[index].Participant.concat(copyData.Participant), "id");
        }
      }
      if (copyData.Marketing !== null) {
        this.syncActivityTable[index].Marketing = copyData.Marketing
      }
      console.log(this.syncActivityTable[index])
      if (copyData.Opportunity[0] !== "NA") {
        if (this.syncActivityTable[index].Opportunity[0] === "NA") {
          this.syncActivityTable[index].Opportunity = copyData.Opportunity
        } else {
          this.syncActivityTable[index].Opportunity = this.service.removeDuplicates(this.syncActivityTable[index].Opportunity.concat(copyData.Opportunity), "id");
        }
      }
      // if (this.syncActivityTable[index].Opportunity[0] === "NA") {
      //   this.syncActivityTable[index].Opportunity = copyData.Opportunity
      // } if (this.syncActivityTable[index].Opportunity[0] !== "NA") {
      //   this.syncActivityTable[index].Opportunity = this.service.removeDuplicates(this.syncActivityTable[index].Opportunity.concat(copyData.Opportunity), "id");
      // }
    })
  }

  // copy Participant 
  onCopyParticipant(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      console.log(this.syncActivityTable[index].Participant)
      console.log(copyData.Participant)
      if (this.syncActivityTable[index].Account.id !== '') {
        if (this.syncActivityTable[index].Account.id === copyData.Account.id) {
          if (copyData.Participant[0] !== "NA") {
            if (this.syncActivityTable[index].Participant[0] === "NA") {
              this.syncActivityTable[index].Participant = copyData.Participant
            } else {
              this.syncActivityTable[index].Participant = this.service.removeDuplicates(this.syncActivityTable[index].Participant.concat(copyData.Participant), "id");
            }
          }
        }
        else {
          this.errorMessage.throwError('Please select same account to copy opportunity/lead')
        }
      } else {
        this.errorMessage.throwError('Please select same account to copy opportunity/lead')
      }
    })
    // copyids.forEach(id => {
    //   let index = this.syncActivityTable.findIndex(k => k.id == id)
    //   console.log(this.syncActivityTable[index].Participant)
    //   console.log(copyData.Participant)
    //   debugger
    //   if (copyData.Participant[0] !== "NA") {
    //     if (this.syncActivityTable[index].Participant[0] === "NA") {
    //       this.syncActivityTable[index].Participant = copyData.Participant
    //     } else {
    //       this.syncActivityTable[index].Participant = this.service.removeDuplicates(this.syncActivityTable[index].Participant.concat(copyData.Participant), "id");
    //     }
    //   }
    // })
  }

  copiedWiproParticipantFilter(data): Array<any> {
    try {
      let ParticipantArray = []
      data.map(x => ParticipantArray.push({ "MapGuid": x.MapGuid, "id": x.SysGuid, "name": x.FullName, "subname": "" }))
      return ParticipantArray
    } catch (error) {
      return ["NA"]
    }
  }

  // On copy Marketing
  onCopyMarketing(copyData, copyids) {
    console.log("copyData", copyData);
    console.log("copyids", copyids)
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      console.log(this.syncActivityTable[index].Marketing)
      console.log(copyData.Marketing)
      if (copyData.Marketing !== null) {
        this.syncActivityTable[index].Marketing = copyData.Marketing
      }
    })
  }

  // copy Activity type
  onCopyActivityType(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      if (copyData.ActivateType != -1) {
        this.syncActivityTable[index].ActivateType = copyData.ActivateType
        this.syncActivityTable[index].isParticipantRequired = copyData.isParticipantRequired
        this.syncActivityTable[index].isLeadRequired = copyData.isLeadRequired
        this.syncActivityTable[index].isMarketingRequired = copyData.isMarketingRequired
      }
    })
  }

  // copy Opportunity and Lead
  onCopyOpportunityLead(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      console.log(this.syncActivityTable[index].Opportunity)
      console.log(copyData.Opportunity)
      if (this.syncActivityTable[index].Account.id !== '') {
        if (this.syncActivityTable[index].Account.id === copyData.Account.id) {
          if (copyData.Opportunity[0] !== "NA") {
            if (this.syncActivityTable[index].Opportunity[0] === "NA") {
              this.syncActivityTable[index].Opportunity = copyData.Opportunity
            } else {
              this.syncActivityTable[index].Opportunity = this.service.removeDuplicates(this.syncActivityTable[index].Opportunity.concat(copyData.Opportunity), "id");
            }
          }
        }
        else {
          this.errorMessage.throwError('Please select same account to copy opportunity/lead')
        }
      } else {
        this.errorMessage.throwError('Please select same account to copy opportunity/lead')
      }
    })
  }

  // copy Meeting Type 
  onCopyMeetingType(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      if (copyData.MeetingType != -1) {
        this.syncActivityTable[index].MeetingType = copyData.MeetingType
      }
    })
  }

  // on copy Activiy group
  onCopyActivityGroup(copyData, copyids) {
    console.log("copyData", copyData)
    console.log("copyids", copyids)
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      if (copyData.ActivityGroup.id !== '') {
        this.syncActivityTable[index].Account = copyData.Account
        this.syncActivityTable[index].ActivityGroup = copyData.ActivityGroup
      }
    })
  }

  // on copy Account 
  onCopyAccount(copyData, copyids) {
    copyids.forEach(id => {
      let index = this.syncActivityTable.findIndex(k => k.id == id)
      if (copyData.Account.id !== '') {
        this.syncActivityTable[index].Account = copyData.Account
        this.syncActivityTable[index].ActivityGroup = copyData.ActivityGroup
      }
    })
  }

  onDateChange(e) {
    console.log(new Date(this.bsRangeValue[0]))
    this.paginationPageNo = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    };

    var today = new Date();
    var fromDate = new Date(e[0]);
    var toDate = new Date(e[1]);
    this.dateTitle = `From ${this.datepipe.transform(fromDate, 'd-MMM-y')} to ${this.datepipe.transform(toDate, 'd-MMM-y')}`
    var month = (fromDate.getMonth() + 1) < 10 ? ("0" + (fromDate.getMonth() + 1)) : (fromDate.getMonth() + 1);
    var date = fromDate.getDate() < 10 ? "0" + fromDate.getDate() : fromDate.getDate();
    var start = fromDate.getFullYear() + '-' + month + '-' + date;
    var hours = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
    var getStartTime = '00' + ':' + '01' + ':' + "00";
    var finalStartDate = start + 'T' + getStartTime + '.000Z';
    var month1 = (toDate.getMonth() + 1) < 10 ? ("0" + (toDate.getMonth() + 1)) : (toDate.getMonth() + 1);
    var date1 = toDate.getDate() < 10 ? "0" + toDate.getDate() : toDate.getDate();
    var end = toDate.getFullYear() + '-' + month1 + '-' + date1;
    var getEndTime = 23 + ':' + 59 + ':' + "00";
    var finalEndDate = end + 'T' + getEndTime + '.000Z';
    var firstDate = new Date(start);
    var SecondDate = new Date(end);
    var Difference_In_Time = SecondDate.getTime() - firstDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 29) {
      this.errorMessage.throwError("maximum allowed date range is 30 days Only")
    } else {
      this.syncActivityTable = []
      this.AllSyncActivityRequestBody.FromDate = finalStartDate
      this.AllSyncActivityRequestBody.ToDate = finalEndDate
      this.AllSyncActivityRequestBody.PageSize = 10;
      this.AllSyncActivityRequestBody.RequestedPageNumber = 1;
      this.AllSyncActivityRequestBody.OdatanextLink = ""
      this.getUnsyncActivityList(this.AllSyncActivityRequestBody)
    }

  }
  getUnsyncActivityList(reqBody) {
    this.isLoading = true
    this.userdat.getUnsyncActivity(reqBody).subscribe(data => {
      this.isLoading = false;
      if (!data.IsError) {
        if (data.ResponseObject.length > 0) {
          let filterData = this.filterTableData(data.ResponseObject)
          this.syncActivityTable = filterData;
          this.syncFilterTable = filterData;
          this.totalCount = data.ResponseObject.length
        } else {
          this.onErrorOrNoData()
        }
      } else {
        this.onErrorOrNoData()
        this.errorMessage.throwError(data.Message)
      }
    },
      error => {
        this.onErrorOrNoData()
        this.isLoading = false
      }
    )
  }

  onErrorOrNoData() {
    this.syncActivityTable = [{}]
    this.syncFilterTable = [{}]
    this.totalCount = 0
  }

  filterTableData(data: Array<any>) {
    if (data) {
      return data.map((res, index) => {
        return {
          "id": (res.Guid) ? res.Guid : 'Na',
          "Subject": res.Subject,
          "Date": moment(`${res.ScheduleStart}`).local().format('DD-MMM-YYYY') + ';' + moment(`${res.ScheduleStart}`).local().format("hh:mm A"),
          "MeetingDate": `${res.ScheduleStart}`,
          "isExpanded": false,
          "ActivityGroup": this.activityGroupFilter(res.ActivityGroup),
          "ActivateType": -1,
          "Account": { id: '', name: '', isProspect: false },
          "Meeting": false,
          "MeetingType": -1,
          "Participant": ['NA'],
          "Opportunity": ["NA"],
          "Marketing": null,
          "ScheduleStart": `${res.ScheduleStart}`,
          "EndDate": `${res.EndDate}`,
          "isLeadRequired": false,
          "$ActivityGroup": [],
          "$Account": [],
          "isParticipantRequired": false,
          "isMarketingRequired": false,
          "index": index + 1
        }
      })
    } else {
      return [{}]
    }
  }

  datetimeFilter(data) {
    var time = data.slice(11, 16)
    var amorpm = time[0] + "" + time[1]
    var period = Number(amorpm) >= 12 ? 'PM' : 'AM';
    return this.datepipe.transform(data, 'd-MMM-y') + '; ' + time.slice(0, 5) + " " + period
  }

  activityGroupFilter(data) {
    let activityGroupObject = {
      "id": "",
      "name": "",
      "ActivateType": "",
      "ActivityTypeId": 0,
      "Account": "",
      "AccountSysId": ""
    }
    if (data) {
      if (data !== {}) {
        activityGroupObject.id = data.Guid;
        activityGroupObject.name = data.Name;
        activityGroupObject.Account = "";
        activityGroupObject.AccountSysId = data.Account.SysGuid;
        activityGroupObject.ActivateType = "NA";
        activityGroupObject.ActivityTypeId = -1
      }
      return activityGroupObject
    } else {
      return activityGroupObject
    }
  }
}

@Component({
  templateUrl: 'sync-message.html',
  styleUrls: ['./activity.component.scss']
})
export class SyncMessageComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SyncMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
