import { EncrDecrService } from './../../../../core/services/encr-decr.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ErrorMessage, SyncActivityService, OfflineService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { OthersListService, otherActivityAdvnHeaders, otherActivityAdvnNames } from '@app/core/services/others-list.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { checkLimit } from '@app/shared/pipes/white-space.validator';
import { InsertOtherActivity, ClearOtherListdata, ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { map, tap, filter, debounceTime, switchMap } from 'rxjs/operators';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import moment from 'moment';

@Component({
  selector: 'app-create-other',
  templateUrl: './create-other.component.html',
  styleUrls: ['./create-other.component.scss']
})
export class CreateOtherComponent implements OnInit {
  CachekeyId = "CreateOtherActivity|";
  activityTypeList: any;
  participants: any;
  linkedLeads: any;
  linkedOpportunity: any;
  searchActivityGroupList: any;
  contactaccount: string;
  contactconversationtag: string = "";
  customerName: string = "";
  contactName: string = "";
  contactlead: string;
  contactleadcamp: string;
  contactopportunity: string;
  consent: boolean = false;
  agendaview: boolean = true;
  emailview: boolean = false;
  noneditpart: boolean = false;
  editpart: boolean = true;
  myEditSavePart: boolean = false;
  showCustomer: boolean = false;
  customerNameSwitch: boolean = false;
  showaccount: boolean = false;
  contactaccountSwitch: boolean = false;
  showconversationtag: boolean = false;
  contactconversationtagSwitch: boolean = false;
  showContact: boolean = false;
  contactNameSwitch: boolean = false;
  showlead: boolean = false;
  contactleadSwitch: boolean = false;
  showleadcamp: boolean = false;
  contactleadSwitchcamp: boolean = false;
  showopportunity: boolean = false;
  contactopportunitySwitch: boolean = false;
  endStartDatesFirst: boolean = false;
  endStartTimes: boolean = false;
  isLoading: boolean = false;
  wiproconversationtag: {}[] = [];
  accountContact: {}[] = [];
  selectedaccount: {}[] = [];
  customerContact: {}[] = [];
  selectedCustomer: {}[] = [];
  selectedContact: string = "";
  selectedleadcamp: {}[] = [];
  selectedopportunity = [];
  selectedlead = [];
  selectedParticipant = [];
  createOtherActivityForm: FormGroup;
  localStorageData: any;
  activityGroupName: any;
  hideIf = false;
  minDate: any;
  ConvetStartDate: any;
  ConvertEndDate: any;
  saveButtonDisable: boolean = false;
  isDisabled: boolean = false;
  parentId: string = '';
  durationToBind: any = "00";
  durationToCkeckMaxdays: boolean = false;
  totalMinutesToSend: any;
  descriptionLength: boolean = false;
  linkedMarketing: any;
  AccountsName: any;
  activityId: any;
  isProspect: any;
  accountDetails: any;
  isActivityGroupSearchLoading: boolean = false;
  isParticipantsSearchLoading: boolean = false;
  isLinkedLeadsSearchLoading: boolean = false;
  isLinkedOpportunitiesSearchLoading: boolean = false;
  isLinkedMarketingTrainingSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  ActivityId: any;
  yearDateValidation: any;
  activityTypeName: any;
  IsLeadreq: boolean = false;
  IsOpporeq: boolean = false;
  sendFinalStartDate: any;
  sendFinalEndDate: any;
  newStartDateToValidate: any;
  newEndDateToValidate: any;
  selectStartTime: boolean = false;
  startChangeDateSelected: any;
  editEndDateTime: string;
  constStartDate: any;
  selectEndTime: boolean = false;
  endChangeDateSelected: any;
  constEndDate: any;
  endDateTimeGreater: boolean = false;
  activitygrpChanged: string = '';
  sendSelectedLeadGuid: any = [];
  selectedLeadMarketing: any = [];
  linkCampaign = [];
  linkMarketing = [];
  linkWiproEvent = [];
  sendSelectedOpporGuid: any = [];
  sendSelectedParticipantSysGuid: any = [];
  participantMessage: string;
  sendSelectedAccountSysGuid: string = '';
  LeadGuid: any;
  maxDate: any;
  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private masterApiService: MasterApiService,
    public newconversationService: newConversationService,
    private OthersListService: OthersListService,
    private errPopup: ErrorMessage,
    private offlineService: OfflineService,
    private store: Store<AppState>,
    private PopUp: ErrorMessage,
    private syncActivity: SyncActivityService,
    private encrdecr: EncrDecrService,
    private routeer: Router,
    private cacheDataService: CacheDataService
  ) { }
  ngOnInit() {
    this.yearDateValidation = new Date(1980, 1, 1);
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year + 1, month, currentDate);
    this.isLoading = true;
    this.otherActivityForm();
    this.parentId = sessionStorage.getItem('conversationParentId');
    this.AutoFillData();
    this.isLoading = false;
    this.getActivityApi();
  }

  appendCacheData(data) {
    if (data.CreateOtherActivityCacheData.StartDate != "" && data.CreateOtherActivityCacheData.StartTime != "" && data.CreateOtherActivityCacheData.EndTime != "" && data.CreateOtherActivityCacheData.EndDate != "") {
      let srartDateValue = this.service.mergeDateTimeModifier(data.CreateOtherActivityCacheData.StartDate, data.CreateOtherActivityCacheData.StartTime);
      let endDateValue = this.service.mergeDateTimeModifier(data.CreateOtherActivityCacheData.EndDate, data.CreateOtherActivityCacheData.EndTime);
      this.dateConverterValues(srartDateValue, endDateValue);
    }
    if (data.CreateOtherActivityCacheData.StartDate != "") {
      var finalStartDate = new Date(data.CreateOtherActivityCacheData.StartDate);
      finalStartDate.setMinutes(finalStartDate.getMinutes() + finalStartDate.getTimezoneOffset());
      this.createOtherActivityForm.patchValue({ StartDate: finalStartDate });
    }
    if (data.CreateOtherActivityCacheData.EndTime != "") {
      var finalEndTime = new Date(data.CreateOtherActivityCacheData.EndTime);
      finalEndTime.setMinutes(finalEndTime.getMinutes() + finalEndTime.getTimezoneOffset());
      this.createOtherActivityForm.patchValue({ endTime: finalEndTime });
    }
    if (data.CreateOtherActivityCacheData.EndDate != "") {
      var finalEndDate = new Date(data.CreateOtherActivityCacheData.EndDate);
      finalEndDate.setMinutes(finalEndDate.getMinutes() + finalEndDate.getTimezoneOffset());
      this.createOtherActivityForm.patchValue({ EndDate: finalEndDate })
    }
    if (data.CreateOtherActivityCacheData.StartTime != "") {
      var finalStartTime = new Date(data.CreateOtherActivityCacheData.StartTime)
      finalStartTime.setMinutes(finalStartTime.getMinutes() + finalStartTime.getTimezoneOffset());
      this.createOtherActivityForm.patchValue({ startTime: finalStartTime })
    }
    this.otherActivityGroupName = data.CreateOtherActivityCacheData.Name
    this.createOtherActivityForm.patchValue({
      OtherName: data.CreateOtherActivityCacheData.Name,
      ActivityType: data.CreateOtherActivityCacheData.ActivityType.Id,
      Duration: this.durationToBind,
      Notes: data.CreateOtherActivityCacheData.Notes,
    });

    if (data.CreateOtherActivityCacheData.LinkMarketingTraining.length > 0) {
      data.CreateOtherActivityCacheData.LinkMarketingTraining.forEach(element => {
        if (element.Type === "Campaign") {
          let campaign = { "Id": element.SysGuid, LinkActionType: 1 };
          this.linkCampaign.push(campaign);
        } else if (element.Type === "Marketing") {
          let marketing = { "MarketingGuid": element.SysGuid, LinkActionType: 1 };
          this.linkMarketing.push(marketing);
        }
        this.selectedLeadMarketing.push(element)
      });
    }
    if (data.CreateOtherActivityCacheData.OpportunitiesOrOrders.length > 0) {
      data.CreateOtherActivityCacheData.OpportunitiesOrOrders.forEach(element => {
        let myObj1 = { "Title": element.Title, "SysGuid": element.SysGuid, "MapGuid": "", "isExists": true, "Type": element.Type, Id: element.SysGuid }
        let myObj = { "SysGuid": element.SysGuid, "MapGuid": "", "Type": element.Type }
        this.selectedopportunity.push(myObj1);
        this.sendSelectedOpporGuid.push(myObj);
      });
    }
    if (data.CreateOtherActivityCacheData.Lead.length > 0) {
      data.CreateOtherActivityCacheData.Lead.forEach(element => {
        let myObj1 = { "Title": element.Title, "LeadGuid": element.LeadGuid, "MapGuid": "", "isExists": true, Id: element.LeadGuid }
        let myObj = { "LeadGuid": element.LeadGuid, "MapGuid": "" }
        this.selectedlead.push(myObj1);
        this.sendSelectedLeadGuid.push(myObj);
      });
    }
    if (data.CreateOtherActivityCacheData.WiproParticipant.length > 0) {
      data.CreateOtherActivityCacheData.WiproParticipant.forEach(element => {
        let myObj1 = { "FullName": element.FullName, "SysGuid": element.SysGuid, "MapGuid": "", "isExists": true, Id: element.SysGuid };
        let myObj = { "SysGuid": element.SysGuid, "MapGuid": "" };
        this.selectedParticipant.push(myObj1);
        this.sendSelectedParticipantSysGuid.push(myObj);
      });
      this.createOtherActivityForm.get('Participants').markAsUntouched();
      this.createOtherActivityForm.get('Participants').clearValidators();
      this.createOtherActivityForm.get('Participants').updateValueAndValidity();
    }

    if (data.CreateOtherActivityCacheData.ActivityGroup != "" && data.CreateOtherActivityCacheData.Account != "") {
      this.activitygrpChanged = data.CreateOtherActivityCacheData.ActivityGroup.Name;
      this.createOtherActivityForm.patchValue({
        ActivityGroup: data.CreateOtherActivityCacheData.ActivityGroup.Name,
        AccountName: this.service.getSymbol(data.CreateOtherActivityCacheData.Account.Name),
      })
      this.sendSelectedAccountSysGuid = data.CreateOtherActivityCacheData.Account.SysGuid;
      this.contactName = data.CreateOtherActivityCacheData.ActivityGroup.Name;
      this.selectedContact = data.CreateOtherActivityCacheData.ActivityGroup.Guid;
      this.AccountsName = data.CreateOtherActivityCacheData.Account.Name;
      this.accountDetails = data.CreateOtherActivityCacheData.Account;
      this.contactNameSwitch = false;
      this.isProspect = data.CreateOtherActivityCacheData.Account.isProspect;
      this.activityGroupCache = {
        "Guid": data.CreateOtherActivityCacheData.ActivityGroup.Guid
        , "Name": data.CreateOtherActivityCacheData.ActivityGroup.Name
      };
    }
  }

  JSONDATA() {
    let activityGroup: any;
    let account: any;
    this.accountDetails
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      activityGroup = "";
      account = "";
    } else {
      activityGroup = { "Name": (this.contactName != undefined) ? this.contactName : "", "Guid": (this.selectedContact != '') ? this.selectedContact : "" }
      account = { "Name": (this.AccountsName != undefined) ? this.AccountsName : "", "SysGuid": (this.sendSelectedAccountSysGuid != '') ? this.sendSelectedAccountSysGuid : "", "isProspect": (this.isProspect != undefined) ? this.isProspect : "" }
    }
    return {
      "ActivityGroup": (this.activityGroupCache != undefined) ? this.activityGroupCache : "",
      "Account": (this.accountDetails != undefined) ? this.accountDetails : "",
      "WiproParticipant": (this.selectedParticipant.length > 0) ? this.selectedParticipant : [],
      "Name": (this.otherActivityGroupName.trim() != "") ? this.otherActivityGroupName.trim() : "",
      "ActivityType": { Id: (Number(this.createOtherActivityForm.value.ActivityType) != 0) ? Number(this.createOtherActivityForm.value.ActivityType) : "" },
      "Duration": (this.totalMinutesToSend != undefined) ? this.totalMinutesToSend : "00",
      "StartDate": (this.createOtherActivityForm.value.StartDate != "") ? this.service.dateModifier(this.createOtherActivityForm.value.StartDate).toString() : "",
      "EndDate": (this.createOtherActivityForm.value.EndDate != "") ? this.service.dateModifier(this.createOtherActivityForm.value.EndDate).toString() : "",
      "StartTime": (this.createOtherActivityForm.value.startTime != "") ? this.service.dateModifier(this.createOtherActivityForm.value.startTime).toString() : "",
      "EndTime": (this.createOtherActivityForm.value.endTime != "") ? this.service.dateModifier(this.createOtherActivityForm.value.endTime).toString() : "",
      "Notes": (this.createOtherActivityForm.value.Notes != "") ? this.createOtherActivityForm.value.Notes : "",
      "Lead": (this.selectedlead.length > 0) ? this.selectedlead : [],
      "OpportunitiesOrOrders": (this.selectedopportunity.length > 0) ? this.selectedopportunity : [],
      "LinkMarketingTraining": (this.selectedLeadMarketing.length > 0) ? this.selectedLeadMarketing : [],
    }
  }

  autoSaveRedishCache() {
    let body = {
      "CreateOtherActivityCacheData": { ...this.JSONDATA() }
    }
    var Key;
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      if (this.selectedContact != '') {
        Key = this.CachekeyId + this.selectedContact
      } else {
        Key = this.CachekeyId
      }
    } else {
      Key = this.CachekeyId
    }
    this.service.SetRedisCacheData(body, Key).subscribe(res => {
      console.log(JSON.stringify(res.ResponseObject));
    });
  }

  nameChaneEvent() {
    if (this.createOtherActivityForm.value.OtherName.trim() != '') {
      this.autoSaveRedishCache()
    }
  }
  notesChangeEvent() {
    if (this.createOtherActivityForm.value.Notes.trim() != '') {
      this.autoSaveRedishCache()
    }
  }

  scrollTo(element: Element) {
    if (element) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - 150
      });
    }
  }
  AutoFillData() {
    if (sessionStorage.getItem('selAccountObj')) {
      this.appendAccountOnly();
    } else {
      this.appendActivityGroupAndAccount();
    }
    if (localStorage.getItem('AccountModuePopulateData')) {
      this.appendActivityGroupAndAccount();
    }
  }

  activityGroupCache: any;
  appendAccountOnly() {
    this.activityGroupName = JSON.parse(this.encrdecr.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"));
    // this.newconversationService.ValidateAccount(this.activityGroupName.SysGuid, this.activityGroupName.isProspect, 2).subscribe(res => {
    //   if (res.IsError) {
    //     this.sendSelectedAccountSysGuid = undefined;
    //     this.createOtherActivityForm.patchValue({
    //       ActivityGroup: "",
    //       AccountName: "",
    //     })
    //     this.PopUp.throwError(res.Message)
    //   } else {
    console.log("storage", this.activityGroupName)

    this.selectedContact = '';
    this.contactName = "";
    this.parentId = "";
    this.AccountsName = this.activityGroupName.Name;
    this.activityGroupCache = undefined;
    this.accountDetails = { Name: this.activityGroupName.Name, SysGuid: this.activityGroupName.SysGuid, isProspect: this.activityGroupName.isProspect };
    this.createOtherActivityForm.patchValue({
      AccountName: this.service.getSymbol(this.activityGroupName.Name),
    })
    this.contactNameSwitch = false;
    //   }
    // })
  }
  otherActivityGroupName: string = '';
  inputChange(event) {
    this.otherActivityGroupName = event.target.value;
  }

  appendActivityGroupAndAccount() {
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      this.activityGroupName = JSON.parse(localStorage.getItem("forMeetingCreation"));
      // this.newconversationService.ValidateAccount(this.activityGroupName.Account.SysGuid, this.activityGroupName.Account.isProspect, 2).subscribe(res => {
      //   if (res.IsError) {
      //     this.sendSelectedAccountSysGuid = undefined;
      //     this.createOtherActivityForm.patchValue({
      //       ActivityGroup: "",
      //       AccountName: "",
      //     })
      //     this.PopUp.throwError(res.Message)
      //   } else {
      console.log("storage", this.activityGroupName)
      this.activityGroupCache = { "Guid": this.activityGroupName.Guid, "Name": this.activityGroupName.Name };
      this.selectedContact = this.activityGroupName.Guid;
      this.contactName = this.activityGroupName.Name;
      this.activitygrpChanged = this.activityGroupName.Name;
      this.AccountsName = this.activityGroupName.Account.Name;
      this.sendSelectedAccountSysGuid = this.activityGroupName.Account.SysGuid;
      this.accountDetails = this.activityGroupName.Account
      this.isProspect = this.activityGroupName.Account.isProspect
      this.createOtherActivityForm.patchValue({
        ActivityGroup: this.activityGroupName.Name,
        AccountName: this.service.getSymbol(this.activityGroupName.Account.Name),
      })
      this.contactNameSwitch = false;
      this.getRedishCacheData();
      //   }
      // })
    } else {
      this.resetCacheData();
      this.getRedishCacheData();
    }
  }

  getRedishCacheData() {
    var Key;
    if (this.selectedContact != '') {
      Key = this.CachekeyId + this.selectedContact;
      console.log("Key", Key);
    } else {
      Key = this.CachekeyId
    }
    this.isLoading = true;
    this.service.GetRedisCacheData(Key).subscribe(res => {
      this.isLoading = false;
      if (res.IsError == false) {
        if (res.ResponseObject) {
          if (res.ResponseObject != '') {
            if (res.ResponseObject != "empty") {
              this.appendCacheData(JSON.parse(res.ResponseObject));
            }
            console.log(res.ResponseObject)
          }
        } else {
          this.clearAppendCacheData();
        }
      }
    }, error => {
      this.isLoading = false;
    });
  }

  clearAppendCacheData() {
    this.otherActivityGroupName = ''
    this.createOtherActivityForm.patchValue({
      OtherName: '',
      ActivityType: '',
      Duration: '00',
      Notes: '',
      StartDate: '',
      startTime: '',
      EndDate: '',
      endTime: '',
    });
  }
  formError(field) {
    return this.createOtherActivityForm.get(field).touched && !this.createOtherActivityForm.get(field).valid
  }
  switchError(field) {
    switch (field) {
      case 'OtherName': {
        return 'Enter other activity'
      }
      case 'ActivityGroup': {
        return 'Search activity group'
      }
      case 'ActivityType': {
        return 'Select activity type'
      }
      case 'StartDate': {
        return 'Select start date'
      }
      case 'startTime': {
        return 'Select start time'
      }
      case 'EndDate': {
        return 'Select end date'
      }
      case 'endTime': {
        return 'Select end time'
      }
    }
  }

  resetCacheData() {
    this.linkCampaign = [];
    this.linkMarketing = [];
    this.selectedLeadMarketing = [];
    this.selectedopportunity = [];
    this.sendSelectedOpporGuid = [];
    this.selectedlead = [];
    this.sendSelectedLeadGuid = [];
    this.selectedParticipant = [];
    this.sendSelectedParticipantSysGuid = [];
    this.cacheDataService.cacheDataMultiReset(['activityGroup', 'wiproParticipants', 'linkedLeads', 'linkedOpportunitiesOrder', 'linkedMarketingTraining'])
  }

  getErrorEmail(field) {
    return this.createOtherActivityForm.get(field).hasError('required') ? 'Enter other activity' : '';
  }
  getActivityApi() {
    this.masterApiService.getActivity().subscribe(res => {
      this.isLoading = false;
      this.activityTypeList = res.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Name) });
    })
  }
  activitySelectWeb(event) {
    this.activityTypeValidation(event.value);
    this.activityTypeList.filter(val => {
      if (val.Id === event.value) {
        this.activityTypeName = val.Name;
      }
    })
    this.autoSaveRedishCache()
  }
  activitySelect(event) {
    this.activityTypeValidation(event.target.value);
    this.autoSaveRedishCache()
  }
  activityTypeValidation(id) {
    if (id != '') {
      this.isLoading = true;
      this.newconversationService.GetValidations(id).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          this.EnableValidations(res.ResponseObject)
        } else {
          this.errPopup.throwError(res.Message)
        }
      })
    }
  }
  EnableValidations(data) {
    if (data.IsLeadReq) {
      this.IsLeadreq = true
      if (this.selectedlead.length > 0) {
        this.removeLeadValidators()
      } else {
        this.setLeadValidators()
      }
    } else {
      this.IsLeadreq = false
      this.removeLeadValidators()
    }
    if (data.IsOpportunityReq) {
      this.IsOpporeq = true
      if (this.selectedopportunity.length > 0) {
        this.removeOppoValidators()
      } else {
        this.setOppoValidators()
      }
    } else {
      this.IsOpporeq = false
      this.removeOppoValidators()
    }
  }
  setLeadValidators() {
    this.createOtherActivityForm.controls['Linkedleads'].setValidators([Validators.required]);
    this.createOtherActivityForm.controls['Linkedleads'].markAsTouched();
    this.createOtherActivityForm.controls['Linkedleads'].updateValueAndValidity();
  }
  removeLeadValidators() {
    this.createOtherActivityForm.controls['Linkedleads'].markAsUntouched();
    this.createOtherActivityForm.controls['Linkedleads'].clearValidators();
    this.createOtherActivityForm.controls['Linkedleads'].updateValueAndValidity();
  }
  setOppoValidators() {
    this.createOtherActivityForm.controls['LinkedOpportunity'].setValidators([Validators.required]);
    this.createOtherActivityForm.controls['LinkedOpportunity'].markAsTouched();
    this.createOtherActivityForm.controls['LinkedOpportunity'].updateValueAndValidity();
  }
  removeOppoValidators() {
    this.createOtherActivityForm.controls['LinkedOpportunity'].markAsUntouched();
    this.createOtherActivityForm.controls['LinkedOpportunity'].clearValidators();
    this.createOtherActivityForm.controls['LinkedOpportunity'].updateValueAndValidity();
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '-');
  }
  get f() {
    return this.createOtherActivityForm.controls
  }
  //------------------------------------advance lookup ts file starts--------------------------------//
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: 'account',
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
  };
  IdentifyAppendFunc = {
    'participants': (data) => { this.appendconversationtag(data, 0) },
    'linkedLeads': (data) => { this.appendlead(data, 0) },
    'linkedOpportunityOrder': (data) => { this.appendopportunity(data, 0) },
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'participants': { return (this.selectedParticipant.length > 0) ? this.selectedParticipant : [] }
      case 'linkedLeads': { return (this.selectedlead.length > 0) ? this.selectedlead : [] }
      case 'linkedOpportunityOrder': { return (this.selectedopportunity.length > 0) ? this.selectedopportunity : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'participants': { return this.selectedParticipant = [], this.sendSelectedParticipantSysGuid = [] }
      case 'linkedLeads': { return this.selectedlead = [], this.sendSelectedLeadGuid = [] }
      case 'linkedOpportunityOrder': { return this.selectedopportunity = [], this.sendSelectedOpporGuid = [] }
    }
  }
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = otherActivityAdvnHeaders[controlName]
    this.lookupdata.lookupName = otherActivityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = otherActivityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = otherActivityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.OthersListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x);
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      this.OthersListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
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
        } else {
          this.lookupdata.errorMsg.isError = true;
          this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
        }
      }, error => {
        this.lookupdata.isLoader = false;
      })
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emptyArray(result.controlName)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
      this.contactopportunitySwitch = false;
      this.contactleadSwitch = false;
      this.contactconversationtagSwitch = false;
    });
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
  getCommonData() {
    return {
      guid: (this.accountDetails) ? (this.accountDetails.SysGuid) ? this.accountDetails.SysGuid : '' : '',
      isProspect: (this.accountDetails) ? (this.accountDetails.isProspect) ? this.accountDetails.isProspect : '' : '',
    }
  }
  /*****************Advance search popup ends*********************/
  otherActivityForm() {
    this.createOtherActivityForm = this.fb.group({
      OtherName: ['', Validators.compose([Validators.required, checkLimit(101)])],
      ActivityGroup: ['', Validators.required],
      ActivityType: ['', Validators.required],
      AccountName: ['', Validators.required],
      Duration: ['00'],
      StartDate: ['', Validators.required],
      startTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      endTime: ['', Validators.required],
      Notes: [''],
      Participants: ['', Validators.required],
      Linkedleads: [''],
      LinkedOpportunity: [''],
      LinkedMarketing: ['']
    }, { validator: this.dateLessThan('StartDate', 'EndDate', 'startTime', 'endTime') });
    this.createOtherActivityForm.controls.Duration.disable();
    this.createOtherActivityForm.get('OtherName').valueChanges.subscribe(val => {
      if (val.trim() === '') {
        this.createOtherActivityForm.get('OtherName').patchValue('', { emitEvent: false })
      }
    })
    this.searchApi();
  }
  ParticipantLookUpApiLoader(val, isValueChanges) {
    if (isValueChanges == false) {
      this.createOtherActivityForm.patchValue({
        Participants: ''
      })
    }
    this.isParticipantsSearchLoading = true;
    this.participants = [];
    this.newconversationService.searchUser(val).subscribe(res => {
      this.isParticipantsSearchLoading = false;
      if (!res.IsError) {
        this.participants = res.ResponseObject;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      } else {
        this.errPopup.throwError(res.Message);
        this.participants = [];
      }
    }, error => {
      this.isParticipantsSearchLoading = false;
      this.participants = [];
    })
  }
  LinkLeadsLookUpApiLoader(val, isValueChanges) {
    if (isValueChanges == false) {
      this.createOtherActivityForm.patchValue({
        Linkedleads: ''
      })
    }
    this.isLinkedLeadsSearchLoading = true;
    this.linkedLeads = [];
    if (this.accountDetails != undefined) {
      this.meetingService.SearchLeadBasedOnAccount(this.accountDetails.SysGuid, val, this.accountDetails.isProspect).subscribe(res => {
        this.isLinkedLeadsSearchLoading = false;
        if (!res.IsError) {
          this.linkedLeads = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.errPopup.throwError(res.Message);
          this.linkedLeads = [];
        }
      }, error => {
        this.isLinkedLeadsSearchLoading = false;
        this.linkedLeads = [];
      })
    } else {
      this.isLinkedLeadsSearchLoading = false;
      this.errPopup.throwError("Select activity group");
    }
  }
  LinkedOpportunityLookUpApiLoader(val, isValueChanges) {
    if (isValueChanges == false) {
      this.createOtherActivityForm.patchValue({
        LinkedOpportunity: ''
      })
    }
    this.isLinkedOpportunitiesSearchLoading = true;
    this.linkedOpportunity = [];
    if (this.accountDetails != undefined) {
      this.meetingService.SearchOrderAndOppBasedOnAccount(this.sendSelectedAccountSysGuid, val, this.accountDetails.isProspect).subscribe(res => {
        this.isLinkedOpportunitiesSearchLoading = false;
        if (res.IsError === false) {
          this.linkedOpportunity = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.errPopup.throwError(res.Message);
          this.linkedOpportunity = [];
        }
      }, error => {
        this.isLinkedOpportunitiesSearchLoading = false;
        this.linkedOpportunity = [];
      })
    } else {
      this.isLinkedOpportunitiesSearchLoading = false;
      this.errPopup.throwError("Select activity group");
    }
  }
  LinkedMarketTrainingLookUpApiLoader(val, isValueChanges) {
    if (isValueChanges == false) {
      this.createOtherActivityForm.patchValue({
        LinkedMarketing: ''
      })
    }
    this.isLinkedMarketingTrainingSearchLoading = true;
    this.linkedMarketing = [];
    this.syncActivity.searchMarketingTraining(val).subscribe(res => {
      this.isLinkedMarketingTrainingSearchLoading = false;
      if (res.IsError === false) {
        this.linkedMarketing = res.ResponseObject;
        console.log("linked marketing", this.linkedMarketing)
      } else {
        this.errPopup.throwError(res.Message);
        this.linkedMarketing = [];
      }
    }, error => {
      this.isLinkedMarketingTrainingSearchLoading = false;
      this.linkedMarketing = [];
    })
  }
  clickActivityGroupData() {
    this.createOtherActivityForm.patchValue({
      ActivityGroup: ''
    })
    this.isActivityGroupSearchLoading = true;
    this.searchActivityGroupList = [];
    this.meetingService.searchActivityGroup("").subscribe(res => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError) {
        this.searchActivityGroupList = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.searchActivityGroupList = []
        this.selectedlead = [];
        this.selectedopportunity = [];
        this.sendSelectedAccountSysGuid = '';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.searchActivityGroupList = [];
      this.selectedlead = [];
      this.selectedopportunity = [];
      this.sendSelectedAccountSysGuid = '';
    })
  }
  clickParticipantData() {
    this.ParticipantLookUpApiLoader('', false);
  }
  clickLinkLeadsData() {
    this.LinkLeadsLookUpApiLoader('', false);
  }
  clickLinkedOpportunityData() {
    this.LinkedOpportunityLookUpApiLoader('', false);
  }
  clickLinkedMarketTraining() {
    this.LinkedMarketTrainingLookUpApiLoader('', false);

  }
  searchApi() {
    this.createOtherActivityForm.get('ActivityGroup').valueChanges.pipe(
      tap(text => this.searchActivityGroupList = []),
      map((query: string) => query ? query.trim() : ''),
      filter(text => {
        if (text.trim() !== '' && this.contactNameSwitch) {
          this.isActivityGroupSearchLoading = true;
          this.searchActivityGroupList = []
          return true
        }
      }),
      debounceTime(500),
      switchMap((query: string) => this.meetingService.searchActivityGroup(query).pipe(
        map(res => res)
      ))
    ).subscribe(data => {
      this.isActivityGroupSearchLoading = false;
      if (data.IsError === false) {
        this.searchActivityGroupList = data.ResponseObject;
      } else {
        this.errPopup.throwError(data.Message);
        this.searchActivityGroupList = []
        this.selectedlead = [];
        this.selectedopportunity = [];
        this.sendSelectedAccountSysGuid = '';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.searchActivityGroupList = [];
      this.selectedlead = [];
      this.selectedopportunity = [];
      this.sendSelectedAccountSysGuid = '';
    })
    this.createOtherActivityForm.get('Participants').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('Participants').dirty && this.contactconversationtagSwitch) {
        this.ParticipantLookUpApiLoader(val, true);
      }
    })
    this.createOtherActivityForm.get('Linkedleads').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('Linkedleads').dirty && this.contactleadSwitch) {
        this.LinkLeadsLookUpApiLoader(val, true);
      }
    })
    this.createOtherActivityForm.get('LinkedOpportunity').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('LinkedOpportunity').dirty && this.contactopportunitySwitch) {
        this.LinkedOpportunityLookUpApiLoader(val, true);
      }
    });
    this.createOtherActivityForm.get('LinkedMarketing').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('LinkedMarketing').dirty && this.contactleadSwitchcamp) {
        this.LinkedMarketTrainingLookUpApiLoader(val, true);
      }
    });
    this.createOtherActivityForm.get('Notes').valueChanges.subscribe(val => {
      if (val.length >= 2000) {
        this.descriptionLength = true
      } else {
        this.descriptionLength = false
      }
    })
  }
  dateConverterValues(srartDateValue, endDateValue) {
    var finalStartDate = this.service.dateModifier(srartDateValue)
    var finalEndDate = this.service.dateModifier(endDateValue)
    var date1 = new Date(finalEndDate)
    var date2 = new Date(finalStartDate)
    this.sendFinalStartDate = srartDateValue;
    this.sendFinalEndDate = endDateValue;
    var difference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
    var diffSeconds = Math.floor(difference) % 60 < 10 ? "0" + Math.floor(difference) % 60 : Math.floor(difference) % 60;
    var diffMinutes = Math.floor(difference / 60) % 60 < 10 ? "0" + Math.floor(difference / 60) % 60 : Math.floor(difference / 60) % 60;
    var diffHours = Math.floor(difference / 3600) % 24 < 10 ? "0" + Math.floor(difference / 3600) % 24 : Math.floor(difference / 3600) % 24;
    var diffDays = Math.floor(difference / 86400) < 10 ? "0" + Math.floor(difference / 86400) : Math.floor(difference / 86400);
    
    this.durationToBind = this.service.getDuration(diffDays,diffHours,diffMinutes)
        if (this.durationToBind == '') {
      this.durationToBind = "00"
    }
    //converting days hours and minutes ends
    //converting total minutes to days hours and minutes starts
    var today = new Date(finalStartDate);
    var Christmas = new Date(finalEndDate);
    var diffMs = (Christmas.getTime() - today.getTime()) / 1000;
    diffMs /= 60;
    var minutesese = Math.abs(Math.round(diffMs));
    var minToDays = Math.floor(minutesese / 1440);
    var minToHours = Math.floor((minutesese % 1440) / 60);
    var minToMins = Math.floor(minutesese % 60)
    //converting total minutes to days hours and minutes ends
    this.totalMinutesToSend = minutesese;
  }
  dateLessThan(from: string, to: string, startT: string, endT: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let startDate = group.controls[from];
      let enDate = group.controls[to];
      let starTime = group.controls[startT];
      let endTime = group.controls[endT];
      if (startDate.value != '' && enDate.value != '' && starTime.value != '' && endTime.value != '') {
        let srartDateValue = this.service.mergeDateTimeModifier(startDate.value, starTime.value);
        let endDateValue = this.service.mergeDateTimeModifier(enDate.value, endTime.value);
        this.dateConverterValues(srartDateValue, endDateValue);
        if (new Date(srartDateValue).getTime() > new Date(endDateValue).getTime()) {
          this.durationToBind = "00";
          return { 'endDate': 'End date time should be greater than start date time' }
        }
      }
    }
  }
  focusOutFunctionForStartDate(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
    this.autoSaveRedishCache()
  }
  focusOutFunctionForStartTime(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
    this.autoSaveRedishCache()
  }
  focusOutFunctionForEndDate(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
    this.autoSaveRedishCache()
  }
  focusOutFunctionForEndTime(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
    this.autoSaveRedishCache()
  }
  /****************** customer contact autocomplete code start ****************** */
  customerNameclose() {
    this.customerNameSwitch = false;
  }
  appendcustomer(value: string, i) {
    this.customerName = value;
    this.selectedCustomer.push(this.customerContact[i])
  }
  /****************** customer contact autocomplete code end ****************** */
  /****************** wipro contact autocomplete code start ****************** */
  contactNameclose() {
    this.contactNameSwitch = false;
    if (this.selectedContact == '') {
      this.createOtherActivityForm.patchValue({
        ActivityGroup: ""
      })
    } else {
      this.createOtherActivityForm.patchValue({
        ActivityGroup: this.contactName
      })
    }

  }
  onClickLinkedLeads() {
    if (this.sendSelectedAccountSysGuid == '') {
      this.errPopup.throwError('Select activity group')
    }
  }
  appendcontact(item) {
    // this.newconversationService.ValidateAccount(item.Account.SysGuid, item.Account.isProspect, 2).subscribe(res => {
    //   if (res.IsError) {
    //     this.sendSelectedAccountSysGuid = undefined;
    //     this.createOtherActivityForm.patchValue({
    //       ActivityGroup: "",
    //       AccountName: "",
    //     })
    //     this.PopUp.throwError(res.Message)
    //   } else {
    this.activityGroupCache = { "Guid": item.Guid, "Name": item.Name };
    this.activitygrpChanged = item.Name;
    this.createOtherActivityForm.patchValue({
      ActivityGroup: item.Name,
      AccountName: this.service.getSymbol(item.Account.Name),
    })
    this.sendSelectedAccountSysGuid = item.Account.SysGuid
    this.contactName = item.Name;
    this.selectedContact = item.Guid;
    this.AccountsName = item.Account.Name;
    this.accountDetails = item.Account
    this.parentId = item.Guid;
    this.selectedlead = [];
    this.selectedopportunity = [];
    this.sendSelectedLeadGuid = [];
    this.sendSelectedOpporGuid = [];
    this.resetCacheData();
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      let data = JSON.parse(localStorage.getItem('forMeetingCreation'));
      if (data.Guid) {
        if (data.Guid == this.selectedContact) {
          this.getRedishCacheData();
        }
      }
    }
    // if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
    //   this.resetCacheData();
    //   this.getRedishCacheData();
    // } else {
    //   this.autoSaveRedishCache();
    // }
    //   }
    // })
    this.contactNameSwitch = false;
  }

  clearActivityGroup() {
    this.createOtherActivityForm.patchValue({
      ActivityGroup: "",
      AccountName: ""
    });
    this.contactName = '';
    this.selectedContact = '';
    this.parentId = '';
    this.activitygrpChanged = '';
    this.sendSelectedAccountSysGuid = '';
    this.AccountsName = '';
    this.accountDetails = undefined;
    this.createOtherActivityForm.get('ActivityGroup').setValidators([Validators.required])
    this.createOtherActivityForm.get('ActivityGroup').markAsTouched();
    this.createOtherActivityForm.get('ActivityGroup').updateValueAndValidity();
    this.selectedlead = [];
    this.selectedopportunity = [];
    this.sendSelectedLeadGuid = [];
    this.sendSelectedOpporGuid = [];
  }
  /****************** wipro contact autocomplete code end ****************** */
  /******************Link leads  autocomplete code start ****************** */
  contactleadclose() {
    this.contactleadSwitch = false;
    if (this.createOtherActivityForm.get('Linkedleads').dirty) {
      this.createOtherActivityForm.patchValue({ Linkedleads: '' });
    }
  }
  appendlead(item, i) {
    if (i > this.linkedLeads.length) {
      this.openadvancetabs('linkedLeads', this.linkedLeads, this.createOtherActivityForm.get('Linkedleads').value)
    } else {
      this.contactlead = item;
      let myObj1 = { "Title": item.Title, "LeadGuid": item.LeadGuid, "MapGuid": "", "isExists": true, Id: item.LeadGuid }
      let myObj = { "LeadGuid": item.LeadGuid, "MapGuid": "" }
      this.selectedlead.push(myObj1)
      let beforeLength = this.selectedlead.length;
      this.selectedlead = this.service.removeDuplicates(this.selectedlead, "LeadGuid");
      let afterLength = this.selectedlead.length;
      if (beforeLength === afterLength) {
        console.log(this.selectedlead)
        this.sendSelectedLeadGuid.push(myObj)
      } else {
        this.errPopup.throwError("Selected linked leads already exists")
      }
      this.createOtherActivityForm.patchValue({ Linkedleads: '' });
      if (this.selectedlead.length > 0 && this.IsLeadreq) {
        this.removeLeadValidators();
      }
    }
    this.contactleadSwitch = false;
    this.autoSaveRedishCache()
  }

  delinkLead(id) {
    console.log(id, this.selectedlead)
    if (id.MapGuid === "") {
      this.selectedlead = this.selectedlead.filter(res => res.LeadGuid !== id.LeadGuid)
      this.sendSelectedLeadGuid = this.sendSelectedLeadGuid.filter(res => res.LeadGuid !== id.LeadGuid)
      if (this.selectedlead.length == 0 && this.IsLeadreq) {
        this.setLeadValidators()
      }
      this.autoSaveRedishCache();
      return;
    }
    if (id.MapGuid !== "") {
      this.selectedlead = this.selectedlead.filter(res => res.LeadGuid !== id.LeadGuid)
      this.sendSelectedLeadGuid = this.sendSelectedLeadGuid.filter(res => res.LeadGuid !== id.LeadGuid)
      if (this.selectedlead.length == 0 && this.IsLeadreq) {
        this.setLeadValidators()
      }
      this.autoSaveRedishCache();
      return;
    }
  }
  /****************** Link leads  autocomplete code end ****************** */
  /******************Link campaign  autocomplete code start ****************** */
  contactleadclosecamp() {
    this.contactleadSwitchcamp = false;
    if (this.createOtherActivityForm.get('LinkedMarketing').dirty) {
      this.createOtherActivityForm.patchValue({ LinkedMarketing: "" })
    }
  }
  appendleadcamp(item) {
    this.selectedLeadMarketing.push(item);
    let beforeLength = this.selectedLeadMarketing.length;
    this.selectedLeadMarketing = this.service.removeDuplicates(this.selectedLeadMarketing, "SysGuid");
    let afterLength = this.selectedLeadMarketing.length;
    if (beforeLength === afterLength) {
      if (item.Type === "Campaign") {
        let campaign = { "Id": item.SysGuid, LinkActionType: 1 };
        this.linkCampaign.push(campaign);
      } else if (item.Type === "Marketing") {
        let marketing = { "MarketingGuid": item.SysGuid, LinkActionType: 1 };
        this.linkMarketing.push(marketing);
      }
    } else {
      this.errPopup.throwError("Selected linked marketing already exists")
    }
    this.contactleadSwitchcamp = false;
    this.createOtherActivityForm.patchValue({ LinkedMarketing: "" })
    this.autoSaveRedishCache()
  }

  dlinkLadMarketing(id) {
    if (id.SysGuid === "") {
      this.selectedLeadMarketing = this.selectedLeadMarketing.filter(res => res.SysGuid !== id.SysGuid)
      this.linkCampaign = this.linkCampaign.filter(res => res.Id !== id.SysGuid)
      this.linkMarketing = this.linkMarketing.filter(res => res.MarketingGuid !== id.SysGuid)
      this.autoSaveRedishCache();
      return;
    }
    if (id.MapGuid !== "") {
      this.selectedLeadMarketing = this.selectedLeadMarketing.filter(res => res.SysGuid !== id.SysGuid)
      this.linkCampaign = this.linkCampaign.filter(res => res.Id !== id.SysGuid)
      this.linkMarketing = this.linkMarketing.filter(res => res.MarketingGuid !== id.SysGuid)
      this.autoSaveRedishCache();
      return;
    }
  }
  /****************** Link campaign  autocomplete code end ****************** */
  /******************Link opportunity  autocomplete code start ****************** */
  contactopportunityclose() {
    this.contactopportunitySwitch = false;
    if (this.createOtherActivityForm.get('LinkedOpportunity').dirty) {
      this.createOtherActivityForm.patchValue({ LinkedOpportunity: '' })
    }
  }
  appendopportunity(item, i) {
    if (i > this.linkedOpportunity.length) {
      this.openadvancetabs('linkedOpportunityOrder', this.linkedOpportunity, this.createOtherActivityForm.get('LinkedOpportunity').value)
    } else {
      this.contactopportunity = item;
      let myObj1 = { "Title": item.Title, "SysGuid": item.Guid, "MapGuid": "", "isExists": true, "Type": item.Type, Id: item.Guid }
      let myObj = { "SysGuid": item.Guid, "MapGuid": "", "Type": item.Type }
      this.selectedopportunity.push(myObj1)
      let beforeLength = this.selectedopportunity.length;
      this.selectedopportunity = this.service.removeDuplicates(this.selectedopportunity, "SysGuid");
      let afterLength = this.selectedopportunity.length;
      if (beforeLength === afterLength) {
        console.log(this.selectedopportunity)
        this.sendSelectedOpporGuid.push(myObj)
      } else {
        this.errPopup.throwError("Selected linked opportunity already exists")
      }
      this.createOtherActivityForm.patchValue({ LinkedOpportunity: '' })
      if (this.selectedopportunity.length > 0 && this.IsOpporeq) {
        this.removeOppoValidators();
      }
    }
    this.contactopportunitySwitch = false;
    this.autoSaveRedishCache()
  }
  delinkOpportunity(id) {
    console.log(id, this.selectedopportunity)
    if (id.MapGuid === "") {
      this.selectedopportunity = this.selectedopportunity.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedOpporGuid = this.sendSelectedOpporGuid.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedOpporGuid = this.sendSelectedOpporGuid.filter(res => res.SysGuid !== id.SysGuid)
      if (this.selectedopportunity.length == 0 && this.IsOpporeq) {
        this.setOppoValidators();
      }
      this.autoSaveRedishCache();
      return;
    }
    if (id.MapGuid !== "") {
      this.selectedopportunity = this.selectedopportunity.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedOpporGuid = this.sendSelectedOpporGuid.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedOpporGuid = this.sendSelectedOpporGuid.filter(res => res.SysGuid !== id.SysGuid)
      if (this.selectedopportunity.length == 0 && this.IsOpporeq) {
        this.setOppoValidators();
      }
      this.autoSaveRedishCache();
      return;
    }
  }
  /****************** Link opportunity  autocomplete code end ****************** */
  /******************account  autocomplete code start ****************** */
  contactaccountclose() {
    this.contactaccountSwitch = false;
  }
  appendaccount(value: string, i) {
    this.contactaccount = value;
    this.selectedaccount.push(this.accountContact[i])
  }
  /****************** Account name  autocomplete code end ****************** */
  /****************** Tag contacts to view conversation autocomplete code start ****************** */
  contactconversationtagclose() {
    this.contactconversationtagSwitch = false;
    if (this.createOtherActivityForm.get('Participants').dirty) {
      this.createOtherActivityForm.patchValue({ Participants: '' })
    }
  }
  appendconversationtag(item, i) {
    if (i > this.participants.length) {
      this.openadvancetabs('participants', this.participants, this.createOtherActivityForm.get('Participants').value)
    } else {
      console.log(item);
      let myObj1 = { "FullName": item.FullName, "SysGuid": item.SysGuid, "MapGuid": "", "isExists": true, Id: item.SysGuid }
      let myObj = { "SysGuid": item.SysGuid, "MapGuid": "" }
      this.selectedParticipant.push(myObj1)
      this.contactconversationtag = item.FullName;
      let beforeLength = this.selectedParticipant.length;
      this.selectedParticipant = this.service.removeDuplicates(this.selectedParticipant, "SysGuid");
      let afterLength = this.selectedParticipant.length;
      if (beforeLength === afterLength) {
        this.sendSelectedParticipantSysGuid.push(myObj)
      } else {
        this.errPopup.throwError("Selected participant already exists")
      }
      if (this.selectedParticipant.length > 0) {
        this.createOtherActivityForm.get('Participants').markAsUntouched();
        this.createOtherActivityForm.get('Participants').clearValidators();
        this.createOtherActivityForm.get('Participants').updateValueAndValidity();
      }
      this.createOtherActivityForm.patchValue({ Participants: '' })
    }
    this.contactconversationtagSwitch = false;
    this.autoSaveRedishCache()
  }
  delinkWiproParticipant(id) {
    console.log(id, this.selectedParticipant)
    if (id.MapGuid === "") {
      this.selectedParticipant = this.selectedParticipant.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedParticipantSysGuid = this.sendSelectedParticipantSysGuid.filter(res => res.SysGuid !== id.SysGuid)
      if (this.selectedParticipant.length == 0) {
        this.createOtherActivityForm.get('Participants').setValidators([Validators.required])
        this.createOtherActivityForm.get('Participants').markAsTouched()
        this.createOtherActivityForm.get('Participants').updateValueAndValidity()
      }
      this.autoSaveRedishCache();
      return;
    }
    if (id.MapGuid !== "") {
      this.selectedParticipant = this.selectedParticipant.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedParticipantSysGuid = this.sendSelectedParticipantSysGuid.filter(res => res.SysGuid !== id.SysGuid)
      if (this.selectedParticipant.length == 0) {
        this.createOtherActivityForm.get('Participants').setValidators([Validators.required])
        this.createOtherActivityForm.get('Participants').markAsTouched()
        this.createOtherActivityForm.get('Participants').updateValueAndValidity()
      }
      this.autoSaveRedishCache();
      return;
    }
  }
  /****************** Tag contacts to view conversation autocomplete code end ****************** */
  Save() {
    if (this.otherActivityGroupName.trim() === '') {
      this.createOtherActivityForm.patchValue({ OtherName: '' });
      this.createOtherActivityForm.controls['OtherName'].setValidators(Validators.required);
      this.createOtherActivityForm.controls['OtherName'].markAsTouched();
      this.createOtherActivityForm.controls['OtherName'].updateValueAndValidity();
    }
    if (this.selectedParticipant.length == 0) {
      this.createOtherActivityForm.get('Participants').setValidators([Validators.required])
      this.createOtherActivityForm.get('Participants').markAsTouched()
      this.createOtherActivityForm.get('Participants').updateValueAndValidity()
    }
    if (this.createOtherActivityForm.valid === false) {
      this.service.validateAllFormFields(this.createOtherActivityForm)
      this.saveButtonDisable = false;
    }
    console.log(this.createOtherActivityForm.value)
    if (this.createOtherActivityForm.valid === true && this.sendSelectedParticipantSysGuid.length > 0 && this.createOtherActivityForm.get('OtherName').errors == null) {
      var objectValue = {
        "Name": this.otherActivityGroupName.trim(),
        "Owner": { "AdId": "PA32258T" },
        "Duration": this.totalMinutesToSend.toString(),
        "ScheduleStart": this.UtcConversation(this.sendFinalStartDate.toString()),
        "Description": this.createOtherActivityForm.value.Notes,
        "Account": this.accountDetails,
        "Potential": { "SysGuid": "" },
        "Conversation": { "Type": "" },
        "EndDate": this.UtcConversation(this.sendFinalEndDate.toString()),
        "MOM": "",
        "MeetingType": { "Id": Number(this.createOtherActivityForm.value.ActivityType) },
        "ActivityGroup": (this.selectedContact !== '') ? { "Guid": this.selectedContact } : "",
        "Lead": (this.sendSelectedLeadGuid.length > 0) ? this.sendSelectedLeadGuid : [],
        "OpportunitiesOrOrders": (this.sendSelectedOpporGuid.length > 0) ? this.sendSelectedOpporGuid : [],
        "Marketing": [{ "SysGuid": "" }],
        "MarketingEvent": { "marketing": (this.linkMarketing.length > 0) ? this.linkMarketing : [], "campaign": (this.linkCampaign.length > 0) ? this.linkCampaign : [] },
        "Participant": (this.sendSelectedParticipantSysGuid.length > 0) ? this.sendSelectedParticipantSysGuid : []
      }
      console.log(JSON.stringify(objectValue));
      this.saveButtonDisable = true;
      this.isDisabled = true;
      this.isLoading = true;
      this.OthersListService.CreateOtherActivity(objectValue).subscribe(async res => {
        this.isLoading = false;
        if (!res.IsError) {
          let InsertAction = {
            id: this.parentId,
            data: res.ResponseObject
          }
          this.store.dispatch(new InsertOtherActivity({ CreateOther: InsertAction }))
          this.store.dispatch(new ClearOtherListdata({ clearotherlist: this.selectedContact }))
          this.store.dispatch(new ClearActivity())
          this.store.dispatch(new ClearActivityDetails());
          var Key;
          if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
            if (this.selectedContact != '') {
              Key = this.CachekeyId + this.selectedContact
            } else {
              Key = this.CachekeyId
            }
          } else {
            Key = this.CachekeyId
          }
          this.service.SetRedisCacheData("empty", Key).subscribe(res => {
            console.log(res);
          })
          let id = this.encrdecr.set("EncryptionEncryptionEncryptionEn", this.selectedContact, "DecryptionDecrip");
          sessionStorage.setItem("ActivityListRowId", JSON.stringify(id));
          sessionStorage.setItem("ActivityGroupName", this.contactName);
          let json1 = {
            Guid: res.ResponseObject.ActivityGroup.Guid,
            Name: res.ResponseObject.ActivityGroup.Name,
            Account: {
              Name: res.ResponseObject.Account.Name,
              SysGuid: res.ResponseObject.Account.SysGuid,
              isProspect: res.ResponseObject.Account.isProspect
            },
          }
          let json = {
            Account: res.ResponseObject.Account.Name,
            AccountSysGuid: res.ResponseObject.Account.SysGuid,
            isProspect: res.ResponseObject.Account.isProspect,
            isAccountPopulate: true
          }
          if (sessionStorage.getItem('selAccountObj')) {
            localStorage.setItem('AccountModuePopulateData', JSON.stringify(true))
          }
          localStorage.setItem("forMeetingCreation", JSON.stringify(json1));
          sessionStorage.setItem("RequestCampaign", JSON.stringify(json));
          this.newconversationService.setActivityGroupName(this.contactName);
          this.isDisabled = true;
          this.resetCacheData();
          this.errPopup.onSuccessMessage(res.Message).afterDismissed().subscribe(()=>{
            this.routeer.navigate(['/activities/activitiesthread/othersList']);
          })
        } else {
          this.isLoading = false;
          this.saveButtonDisable = false;
          this.isDisabled = false;
          this.errPopup.throwError(res.Message)
        }
      }, error => {
        this.isLoading = false;
        this.saveButtonDisable = false;
      })
    } else {
      this.service.validateAllFormFields(this.createOtherActivityForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }

  UtcConversation(data) {
    return moment( data.split(':00')[0], "YYYY-MM-DDTHH:mm:mm").utc()
  }

  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopotherComponent, {
      width: '400px',
      data: this.selectedContact
    });
    dialogRef.componentInstance.selectedContact = this.selectedContact;
    dialogRef.componentInstance.CachekeyId = this.CachekeyId;
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop-other.html',
  styleUrls: ['./create-other.component.scss']

})
export class cancelpopotherComponent {
  selectedContact: any;
  CachekeyId;
  constructor(private routingState: RoutingState, public router: Router, private cacheDataService: CacheDataService, public service: DataCommunicationService, ) { }
  navTo() {
    this.cacheDataService.cacheDataMultiReset(['activityGroup', 'wiproParticipants', 'linkedLeads', 'linkedOpportunitiesOrder', 'linkedMarketingTraining'])
    if (sessionStorage.getItem('selAccountObj')) {
      this.accountSprintThreeModuleBack();
    } else {
      this.activityModuleBack();
    }
  }

  accountSprintThreeModuleBack() {
    var Key;
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      if (this.selectedContact != '') {
        Key = this.CachekeyId + this.selectedContact
      } else {
        Key = this.CachekeyId
      }
    } else {
      Key = this.CachekeyId
    }
    this.service.SetRedisCacheData("empty", Key).subscribe(res => {
      console.log(res);
    })
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/accounts/accountactivities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/accounts/accountactivities/list']);
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/othersList']);
    }
  }

  activityModuleBack() {
    var Key;
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      if (this.selectedContact != '') {
        Key = this.CachekeyId + this.selectedContact
      } else {
        Key = this.CachekeyId
      }
    } else {
      Key = this.CachekeyId
    }
    this.service.SetRedisCacheData("empty", Key).subscribe(res => {
      console.log(res);
    })
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/activities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/activities/list']);
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/othersList']);
    }
  }
}
