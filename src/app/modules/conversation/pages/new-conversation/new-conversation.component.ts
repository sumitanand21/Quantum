import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material/';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ContactconversationService } from '@app/core/services/contactconversation.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpeechRecognitionService } from '@app/core/services/speech-recognition-service';
import { ConversationService } from '@app/core/services/conversation.service';
import { newConversationService, NewActivityHeaders, NewActivityAdvNames } from '@app/core/services/new-conversation.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { threadListService, OfflineService, OnlineOfflineService, ErrorMessage, ContactleadService } from '@app/core';
import { MeetingService } from '@app/core/services/meeting.service';
import { AppState } from '@app/core/state';
import { Store } from '@ngrx/store';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { ClearMeetingList, ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { debounceTime, map, filter, switchMap, tap } from 'rxjs/operators';
import { NewMeetingService } from '@app/core/services/new-meeting.service';
import { ClearTaskList } from '@app/core/state/actions/home.action';
import { environment as env } from '@env/environment';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { ActivityService, activityAdvnHeaders, activityAdvnNames } from '@app/core/services/activity.service';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import moment from 'moment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
declare let SpeechSDK: any;
export interface Meeting {
  value: string;
  viewValue: string;
}
export interface CustomerContacts {
  FullName: string,
  Email: string,
  isKeyContact: boolean,
  Guid: string,
  MapGuid: string,
}

export interface potentialWiproSolution {
  Name: string,
  SysGuid: string,
  MapGuid: string
}
export interface WiproContact {
  FullName: string,
  Designation: string,
  MapGuid: string,
  SysGuid: string
}

export interface Lead {
  MapGuid: string,
  LeadGuid: string,
  Title: string
}

export interface Opportunity {
  MapGuid: string,
  Guid: string,
  Title: string,
  Type: string,
}

export interface ConversationTag {
  Guid: string,
  MapGuid: string,
  FullName: string
  Designation: string
}

export interface Campaign {
  Id: string,
  MapGuid: string,
  Name: string
}

export interface attachmetList {
  Name: string,
  Url: string,
  Guid: string,
  addComments: string
}

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss'],
})
export class NewConversationComponent implements OnInit {
  CachekeyId = "MeetingCreation|";
  addcommmentpopover: boolean = false;
  viewcommentpopover: boolean
  wiprocontactsearch: any;
  companyNameSearch: Array<any>;
  customerContactSearch: any;
  play: boolean = false;
  term: string;
  suggestion: boolean = false;
  consent: boolean = true;
  newConversationForm: FormGroup;
  createAppointmentData: any;
  autofilledId: string = "";
  linkedLeads: any;
  linkedOpportunity: any;
  conversationType: any;
  tagContactSearch: any;
  Appointment_Guid: any;
  Conversation_Guid: any;
  SysGuid: any
  isFormValid: boolean = false
  accntCompanyDetails: any;
  newAccountCompanyName: any;
  id: any;
  name: string;
  parentId: any;
  child: boolean = false;
  converstationName: any;
  selectedCustomer = [];
  showConversation: boolean = false;
  Conversation: string = "";
  ConversationNameSwitch: boolean = false;
  selectedContact = [];
  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = false;
  companyName: string = "";
  showCompany: boolean;
  companyNameSwitch: boolean = false;
  ConversationLinkOppNameSwitch: boolean = false;
  ConversationLinkLeadNameSwitch: boolean = false;
  selectedLinkedLeads = [];
  selectedLinkedOpp = [];
  singleHitLinkLead: any;
  singleHitLinkOpp: any;
  showopportunity: boolean = false;
  contactopportunity: string;
  contactopportunitySwitch: boolean = false;
  selectedTag = [];
  showlead: boolean = false;
  contactlead: string;
  contactleadSwitch: boolean = false;
  isCreateAppointment: boolean = false;
  solutionArr: {}[] = []
  selectedsolution = [];
  showsolution: boolean = false;
  solution: string;
  solutionSwitch: boolean = false;
  selectedcampaign = [];
  campaignContact: any;
  today = new Date();
  searchConversationList: any;
  isPrivate: boolean = false;
  isConversationSearched: boolean = false;
  clicked: boolean = false;
  linkedcampaignSwitch: boolean = false;
  priviousUrl: any;
  patchConversationType: any;
  commentId: any;
  showTag: boolean = false;
  contactTag: string;
  contactTagSwitch: boolean = false;
  isActivityGroupSearchLoading: boolean = false;
  isCustomerParticipantsSearchLoading: boolean = false;
  isLinkedLeadsSearchLoading: boolean = false;
  isWiproParticipantsSearchLoading: boolean = false;
  isTagContactToViewMeetingSearchLoading: boolean = false;
  isPotentialWiproSoluctionSearchLoading: boolean = false;
  isLinkedCampaignsSearchLoading: boolean = false;
  isLinkedOpportunitySearchLoading: boolean = false;
  IsAccountreq = false
  IsCampaignreq = false
  arrowkeyLocation = 0;
  wiproSolution: any;
  // new UI
  activityTypeList: any;
  conversationName: string = ""
  activityGroupId: string = ""
  activityTypeId: any;
  meetingGuid: any;
  activityInfo: any;
  isLoading: boolean = false;
  IsPotentialreq: boolean;
  IsOpporeq: boolean;
  IsLeadreq: boolean;
  IsCustomerreq: boolean;
  yearDateValidation: any;
  activityTypeName: any;
  meetingTypeAria: any = ''
  sendFinalStartDate: any;
  sendFinalEndDate: any;
  durationToBind: any = "00";
  totalMinutesToSend: any;
  isMobileDevice: boolean = false;
  accountType: string = '';
  maxDate: any;
  recordButton = {
    name: "Record",
    Tooltip: "Capture minutes of meeting using speech to text assistance",
    iconClass: "mdi mdi-microphone record-icon"
  }
  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    private masterApi: MasterApiService,
    public searchuser: ContactconversationService,
    private router: Router,
    private fb: FormBuilder,
    private speechRecognitionService: SpeechRecognitionService,
    public newconversationService: newConversationService,
    public matSnackBar: MatSnackBar,
    private encrDecrService: EncrDecrService,
    private ErrorMessage: ErrorMessage,
    private meetingService: MeetingService,
    private store: Store<AppState>,
    private leadservice: ContactleadService,
    private newMeetingService: NewMeetingService,
    private fileService: FileUploadService,
    private cacheDataService: CacheDataService,
    public envr :EnvService 
  ) {
    this.createMeetingForm();
    this.getActivityType();
    this.getMeetingType();
    this.cacheDataService.cacheDataMultiReset(
      [
        'activityGroup',
        'customerParticipants',
        'wiproParticipants',
        'potentialWiproSolutions',
        'linkedCampaigns',
        'linkedLeads',
        'linkedOpportunitiesOrder'
      ]
    )
  }

  ngOnInit() {
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    this.yearDateValidation = new Date(1980, 0, 1);
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year + 1, month, currentDate);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 700)
    this.leadservice.attachList = []
    this.clicked = false;
    this.syncActivityInfo()
    if (sessionStorage.getItem('CreateActivityGroup')) {
      var data = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
      if (data.model == "Add meeting") {
        this.openactivitypop();
      }
      if (data.isMeeting == true) {
        this.openactivitypop();
      }
    }
  }
  autoSaveRedishCache() {
    let body = {
      "MeetingCacheData": { ...this.JSONDATA() }
    }
    var Key;
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      if (this.activityGroupId != '') {
        Key = this.CachekeyId + this.activityGroupId;
      } else {
        Key = this.CachekeyId;
      }
    } else {
      Key = this.CachekeyId;
    }
    this.service.SetRedisCacheData(body, Key).subscribe(res => {
      console.log(JSON.stringify(res.ResponseObject));
    });
  }
  getRedishCacheData() {
    var Key;
    if (this.activityGroupId != '') {
      Key = this.CachekeyId + this.activityGroupId;
    } else {
      Key = this.CachekeyId;
    }
    this.isLoading = true;
    this.service.GetRedisCacheData(Key).subscribe(res => {
      this.isLoading = false;
      if (res.IsError == false) {
        if (res.ResponseObject) {
          if (res.ResponseObject != '') {
            if (res.ResponseObject != "empty") {
              this.appendCacheData(JSON.parse(res.ResponseObject));
              console.log(JSON.parse(res.ResponseObject))
            }
          }
        } else {
          this.clearAppendCacheData();
        }
      } else {
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
    });
  }
  clearAppendCacheData() {
    this.activityGroupName = ''
    this.newConversationForm.patchValue({
      activityType: '',
      conversationType: '',
      meetingSubject: '',
      recordMom: '',
      access: true,
      Duration: '00',
      endTime: "",
      StartDate: '',
      EndDate: '',
      startTime: ''
    });
  }
  JSONDATA() {
    return {
      "ActivityGroup": (this.activityGroupCache != undefined) ? this.activityGroupCache : "",
      "AccountType": (this.accountType != '') ? this.accountType : "",
      "Account": (this.accntCompanyDetails != undefined) ? this.accntCompanyDetails : "",
      "ActivityType": { Id: (Number(this.newConversationForm.value.activityType) != 0) ? Number(this.newConversationForm.value.activityType) : "" },
      "MeetingType": { Id: (Number(this.newConversationForm.value.conversationType) != 0) ? Number(this.newConversationForm.value.conversationType) : "" },
      "StartDate": (this.newConversationForm.value.StartDate != "") ? this.service.dateModifier(this.newConversationForm.value.StartDate).toString() : "",
      "EndDate": (this.newConversationForm.value.EndDate != "") ? this.service.dateModifier(this.newConversationForm.value.EndDate).toString() : "",
      "StartTime": (this.newConversationForm.value.startTime != "") ? this.service.dateModifier(this.newConversationForm.value.startTime).toString() : "",
      "EndTime": (this.newConversationForm.value.endTime != "") ? this.service.dateModifier(this.newConversationForm.value.endTime).toString() : "",
      "Duration": this.totalMinutesToSend,
      "isPrivatePublic": (this.newConversationForm.value.access == false) ? false : true,
      "Agenda": (this.activityGroupName.trim() != "") ? this.activityGroupName.trim() : "",
      "RecordMOM": this.newConversationForm.value.recordMom,
      "Attachment": this.newconversationService.attachmentList,
      "CustomerParticipants": (this.selectedCustomer.length > 0) ? this.selectedCustomer : [],
      "WiproParticipants": (this.selectedContact.length > 0) ? this.selectedContact : [],
      "PrivateAccess": (this.selectedTag.length > 0) ? this.selectedTag : [],
      "PotentialWiproSolutions": (this.selectedsolution.length > 0) ? this.selectedsolution : [],
      "LinkedCampaigns": (this.selectedcampaign.length > 0) ? this.selectedcampaign : [],
      "LinkedLeads": (this.selectedLinkedLeads.length > 0) ? this.selectedLinkedLeads : [],
      "LinkedOpportunities": (this.selectedLinkedOpp.length > 0) ? this.selectedLinkedOpp : []
    }
  }
  activityGroupName: string = '';
  inputChange(event) {
    this.activityGroupName = event.target.value;
  }
  radioChange(event) {
    this.newConversationForm.value.acccess = event.value
    this.autoSaveRedishCache();
  }
  appendCacheData(data) {
    if (data.MeetingCacheData.StartDate != "" && data.MeetingCacheData.StartTime != "" && data.MeetingCacheData.EndTime != "" && data.MeetingCacheData.EndDate != "") {
      let srartDateValue = this.service.mergeDateTimeModifier(data.MeetingCacheData.StartDate, data.MeetingCacheData.StartTime);
      let endDateValue = this.service.mergeDateTimeModifier(data.MeetingCacheData.EndDate, data.MeetingCacheData.EndTime);
      this.dateConverterValues(srartDateValue, endDateValue);
    }
    if (data.MeetingCacheData.StartDate != "") {
      var finalStartDate = new Date(data.MeetingCacheData.StartDate);
      finalStartDate.setMinutes(finalStartDate.getMinutes() + finalStartDate.getTimezoneOffset());
      this.newConversationForm.patchValue({ StartDate: finalStartDate });
    }
    if (data.MeetingCacheData.EndTime != "") {
      var finalEndTime = new Date(data.MeetingCacheData.EndTime);
      finalEndTime.setMinutes(finalEndTime.getMinutes() + finalEndTime.getTimezoneOffset());
      this.newConversationForm.patchValue({ endTime: finalEndTime });
    }
    if (data.MeetingCacheData.EndDate != "") {
      var finalEndDate = new Date(data.MeetingCacheData.EndDate);
      finalEndDate.setMinutes(finalEndDate.getMinutes() + finalEndDate.getTimezoneOffset());
      this.newConversationForm.patchValue({ EndDate: finalEndDate })
    }
    if (data.MeetingCacheData.StartTime != "") {
      var finalStartTime = new Date(data.MeetingCacheData.StartTime)
      finalStartTime.setMinutes(finalStartTime.getMinutes() + finalStartTime.getTimezoneOffset());
      this.newConversationForm.patchValue({ startTime: finalStartTime })
    }
    this.activityGroupName = data.MeetingCacheData.Agenda;
    this.newConversationForm.patchValue({
      activityType: data.MeetingCacheData.ActivityType.Id,
      conversationType: data.MeetingCacheData.MeetingType.Id,
      meetingSubject: data.MeetingCacheData.Agenda,
      recordMom: data.MeetingCacheData.RecordMOM,
      access: data.MeetingCacheData.isPrivatePublic,
      Duration: this.durationToBind,
    });
    if (data.MeetingCacheData.Attachment.length > 0) {
      data.MeetingCacheData.Attachment.forEach(element => {
        this.newconversationService.attachmentList.push(element);
      });
    }
    if (data.MeetingCacheData.ActivityType.Id != '') {
      this.activityTypeValidation(data.MeetingCacheData.ActivityType.Id);
    }
    if (data.MeetingCacheData.WiproParticipants.length > 0) {
      data.MeetingCacheData.WiproParticipants.forEach(element => {
        var json = { FullName: element.FullName, Designation: element.Designation, MapGuid: "", SysGuid: element.SysGuid };
        var json1 = { FullName: element.FullName, Designation: element.Designation, MapGuid: "", SysGuid: element.SysGuid, Id: element.SysGuid };
        this.selectedContact.push(json);
        this.sendwiproToAdvance.push(json1);
      });
      this.newConversationForm.get('WiproContacts').clearValidators();
      this.newConversationForm.get('WiproContacts').updateValueAndValidity();
    }
    if (data.MeetingCacheData.CustomerParticipants.length > 0) {
      data.MeetingCacheData.CustomerParticipants.forEach(element => {
        let json = { FullName: element.FullName, Email: element.Email, isKeyContact: element.isKeyContact, Guid: element.Guid, MapGuid: "" }
        let json1 = { FullName: element.FullName, Email: element.Email, isKeyContact: element.isKeyContact, Guid: element.Guid, MapGuid: "", Id: element.Guid }
        this.selectedCustomer.push(json);
        this.sendCustomerToAdvance.push(json1);
      });
    }
    if (data.MeetingCacheData.PrivateAccess.length > 0) {
      data.MeetingCacheData.PrivateAccess.forEach(element => {
        var json = { Guid: element.Guid, MapGuid: "", FullName: element.FullName, Designation: element.Designation }
        var json1 = { SysGuid: element.Guid, MapGuid: "", FullName: element.FullName, Designation: element.Designation, Id: element.Guid }
        this.selectedTag.push(json);
        this.sendTagToAdvance.push(json1);
      });
    }
    if (data.MeetingCacheData.PotentialWiproSolutions.length > 0) {
      data.MeetingCacheData.PotentialWiproSolutions.forEach(element => {
        let json = { Name: element.Name, SysGuid: element.SysGuid, MapGuid: "" }
        let json1 = { Name: element.Name, SysGuid: element.SysGuid, MapGuid: "", Id: element.SysGuid }
        this.selectedsolution.push(json);
        this.sendSolnToAdvance.push(json1);
      });
    }
    if (data.MeetingCacheData.LinkedCampaigns.length > 0) {
      data.MeetingCacheData.LinkedCampaigns.forEach(element => {
        var json = { Id: element.Id, MapGuid: "", Name: element.Name };
        this.selectedcampaign.push(json);
      });
    }
    if (data.MeetingCacheData.LinkedLeads.length > 0) {
      data.MeetingCacheData.LinkedLeads.forEach(element => {
        var json = { MapGuid: "", LeadGuid: element.LeadGuid, Title: element.Title }
        var json1 = { MapGuid: "", LeadGuid: element.LeadGuid, Title: element.Title, Id: element.LeadGuid }
        this.selectedLinkedLeads.push(json);
        this.sendLeadToAdvance.push(json1);
      });
    }
    if (data.MeetingCacheData.LinkedOpportunities.length > 0) {
      data.MeetingCacheData.LinkedOpportunities.forEach(element => {
        var json = { Guid: element.Guid, MapGuid: "", Title: element.Title, Type: element.Type }
        var json1 = { Guid: element.Guid, MapGuid: "", Title: element.Title, Type: element.Type, Id: element.Guid }
        this.selectedLinkedOpp.push(json);
        this.sendOppToAdvance.push(json1)
      });
    }
    if (data.MeetingCacheData.ActivityGroup != "" && data.MeetingCacheData.Account != "") {
      this.activityGroupId = data.MeetingCacheData.ActivityGroup.Guid;
      this.conversationName = data.MeetingCacheData.ActivityGroup.Name;
      this.activityGroupCache = data.MeetingCacheData.ActivityGroup
      this.accntCompanyDetails = data.MeetingCacheData.Account;
      this.newConversationForm.patchValue({
        conversationName: data.MeetingCacheData.ActivityGroup.Name,
        accountcompanyName: this.service.getSymbol(data.MeetingCacheData.Account.Name)
      })
      this.accountType = data.MeetingCacheData.AccountType
      this.OppOrderEnabledisable()
      this.ConversationNameSwitch = false;
    }
  }
  meetingSubjuctCache() {
    this.autoSaveRedishCache();
  }
  createMeetingForm() {
    this.newConversationForm = this.fb.group({
      liveMeeting: [false],
      conversationName: ['', Validators.compose([Validators.required])],
      activityType: ['', Validators.required],
      conversationType: ['', Validators.required],
      // dateCreated: ['', Validators.required],
      accountcompanyName: new FormControl({ value: 'Select account name', disabled: true }),
      potentialWiproSolution: [''],
      access: [true, Validators.required],
      Duration: new FormControl({ value: '00', disabled: true }),
      StartDate: ['', Validators.required],
      startTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingSubject: ['', Validators.compose([Validators.required, checkLimit(101)])],
      haveConsent: [false],
      recordMom: ['', Validators.compose([checkLimit(2001)])],
      customerContacts: [''],
      WiproContacts: ['', Validators.required],
      contacttag: [''],
      linkLead: [''],
      linkOpportunity: [''],
      linkCampaign: [''],
      comments: ['']
    }, { validator: this.dateLessThan('StartDate', 'EndDate', 'startTime', 'endTime') });
    this.newConversationForm.get('meetingSubject').valueChanges.subscribe(res => {
      if (res.trim() === "") {
        console.log("meeting")
        this.newConversationForm.get('meetingSubject').patchValue('', { emitEvent: false });
      }
    })
    this.newConversationForm.get('comments').valueChanges.subscribe(res => {
      if (res.trim() === "") {
        console.log("comments")
        this.newConversationForm.get('comments').patchValue('', { emitEvent: false });
      }
    })
    this.newConversationForm.get('recordMom').valueChanges.subscribe(res => {
      if (res.trim() === "") {
        console.log("MOM")
        this.newConversationForm.get('recordMom').patchValue('', { emitEvent: false });
        this.speechData = ''
      }
    })
    this.onChanges()
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
    console.log(this.durationToBind)
    this.newConversationForm.patchValue({ Duration: (this.durationToBind).toString() });
    this.autoSaveRedishCache();
  }
  focusOutFunctionForStartTime(event) {
    console.log(this.durationToBind)
    this.newConversationForm.patchValue({ Duration: (this.durationToBind).toString() });
    this.autoSaveRedishCache();
  }
  focusOutFunctionForEndDate(event) {
    console.log(this.durationToBind)
    this.newConversationForm.patchValue({ Duration: (this.durationToBind).toString() });
    this.autoSaveRedishCache();
  }
  focusOutFunctionForEndTime(event) {
    console.log(this.durationToBind)
    this.newConversationForm.patchValue({ Duration: (this.durationToBind).toString() });
    this.autoSaveRedishCache();
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
    // console.log("days ",diffDays, "  hours " ,diffHours, "  minutes",diffMinutes)
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
  
  onChanges() {
    this.newConversationForm.get('conversationName').valueChanges.pipe(
      tap(text => this.searchConversationList = []),
      map((query: string) => query ? query.trim() : ''),
      filter(text => {
        if (text.trim() !== '' && this.ConversationNameSwitch) {
          this.isActivityGroupSearchLoading = true;
          this.searchConversationList = []
          return true
        } else {
          this.isActivityGroupSearchLoading = false;
        }
      }),
      debounceTime(500),
      switchMap((query: string) => this.meetingService.searchActivityGroup(query).pipe(
        map(res => res)
      ))
    ).subscribe(data => {
      this.isActivityGroupSearchLoading = false;
      if (data.IsError === false) {
        this.searchConversationList = data.ResponseObject
      } else {
        this.ErrorMessage.throwError(data.Message);
        this.searchConversationList = []
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.searchConversationList = []
    });
    this.newConversationForm.get('potentialWiproSolution').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('potentialWiproSolution').dirty && this.solutionSwitch) {
        this.PotentialWiproSoluctionLookUpApiLoader(val, true);
      }
    });

    this.newConversationForm.get('WiproContacts').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('WiproContacts').dirty && this.contactNameSwitch) {
        this.WiproContactsLookUpApiLoader(val, true);
      }
    });
    this.newConversationForm.get('contacttag').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('contacttag').dirty && this.contactTagSwitch) {
        this.contacttagLookUpApiLoader(val, true);
      }
    });

    this.newConversationForm.get('customerContacts').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('customerContacts').dirty && this.customerNameSwitch) {
        this.customerContactsLookUpApiLoader(val, true);
      }
    });
    this.newConversationForm.get('linkLead').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('linkLead').dirty && this.contactleadSwitch) {
        this.linkLeadLookUpApiLoader(val, true);
      }
    });
    this.newConversationForm.get('linkOpportunity').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('linkOpportunity').dirty && this.contactopportunitySwitch) {
        this.OpportunityOrderLookUpApiLoader(val, true);
      }
    });
    this.newConversationForm.get('linkCampaign').valueChanges.subscribe(val => {
      if (this.newConversationForm.get('linkCampaign').dirty && this.linkedcampaignSwitch) {
        this.linkCampaignLookUpApiLoader(val, true);
      }
    });
  }
  get f() {
    return this.newConversationForm.controls
  }
  getMeetingType() {
    this.newconversationService.getConversationType().subscribe(res => {
      if (!res.Error) {
        this.conversationType = res.ResponseObject
      } else {
        this.ErrorMessage.throwError(res.Message)
      }
    }, error => {
      console.log(error)
    })
  }
  getActivityType() {
    this.masterApi.getActivity().subscribe(res => {
      this.isLoading = false;
      if (!res.Error) {
        this.activityTypeList = res.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Name) });
      } else {
        this.ErrorMessage.throwError(res.Message)
      }
    }, error => {
      console.log(error)
    })
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '-');
  }
  clickActivityGroup() {
    this.newConversationForm.patchValue({
      conversationName: ''
    })
    if (this.newConversationForm.value.conversationName == "" && this.ConversationNameSwitch) {
      this.isActivityGroupSearchLoading = true;
      this.searchConversationList = []
      this.meetingService.searchActivityGroup('').subscribe(data => {
        this.isActivityGroupSearchLoading = false;
        if (data.IsError === false) {
          this.searchConversationList = data.ResponseObject;
        } else {
          this.ErrorMessage.throwError(data.Message);
          this.searchConversationList = []
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.searchConversationList = []
      })
    }
  }
  PotentialWiproSoluctionLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        potentialWiproSolution: ''
      })
    }
    this.isPotentialWiproSoluctionSearchLoading = true;
    this.wiproSolution = [];
      this.newconversationService.getWiproSolution(val).subscribe(res => {
        this.isPotentialWiproSoluctionSearchLoading = false;
        if (res.IsError === false) {
          this.wiproSolution = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(res.Message);
          this.wiproSolution = [];
        }
      }, error => {
        this.isPotentialWiproSoluctionSearchLoading = false;
        this.wiproSolution = [];
      })
  }
  WiproContactsLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        WiproContacts: ''
      })
    }
    this.isWiproParticipantsSearchLoading = true;
    this.wiprocontactsearch = [];
    this.newconversationService.searchUser(val).subscribe(data => {
      this.isWiproParticipantsSearchLoading = false;
      if (data.IsError === false) {
        this.wiprocontactsearch = data.ResponseObject;
        this.lookupdata.TotalRecordCount = data.TotalRecordCount;
        this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
      } else {
        this.ErrorMessage.throwError(data.Message);
        this.wiprocontactsearch = [];
      }
    }, error => {
      this.isWiproParticipantsSearchLoading = false;
      this.wiprocontactsearch = [];
    })
  }
  contacttagLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        contacttag: ''
      })
    }
    this.isTagContactToViewMeetingSearchLoading = true;
    this.tagContactSearch = [];
    this.newconversationService.searchUser(val).subscribe(data => {
      this.isTagContactToViewMeetingSearchLoading = false;
      if (data.IsError === false) {
        this.tagContactSearch = data.ResponseObject;
        this.lookupdata.TotalRecordCount = data.TotalRecordCount;
        this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
      } else {
        this.ErrorMessage.throwError(data.Message);
        this.tagContactSearch = [];
      }
    }, error => {
      this.isTagContactToViewMeetingSearchLoading = false;
      this.tagContactSearch = [];
    })
  }
  customerContactsLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        customerContacts: ''
      })
    }
    this.isCustomerParticipantsSearchLoading = true;
    this.customerContactSearch = [];
    if (this.onNoActivitySelectedToCustomerContacts()) {
      this.meetingService.searchCustomerparticipants(val, this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(data => {
        this.isCustomerParticipantsSearchLoading = false;
        if (data.IsError === false) {
          this.customerContactSearch = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(data.Message);
        }
      }, error => {
        this.isCustomerParticipantsSearchLoading = false;
      })
    }
  }
  linkLeadLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        linkLead: ''
      })
    }
    this.isLinkedLeadsSearchLoading = true;
    this.linkedLeads = [];
    if (this.onNoActivitySelectedToLead()) {
      this.meetingService.SearchLeadBasedOnAccount(this.accntCompanyDetails.SysGuid, val, this.accntCompanyDetails.isProspect).subscribe(data => {
        this.isLinkedLeadsSearchLoading = false;
        if (data.IsError === false) {
          this.linkedLeads = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(data.Message);
          this.linkedLeads = [];
        }
      }, error => {
        this.isLinkedLeadsSearchLoading = false;
        this.linkedLeads = [];
      })
    }
  }
  OpportunityOrderLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        linkOpportunity: ''
      })
    }
    this.isLinkedOpportunitySearchLoading = true;
    this.linkedOpportunity = [];
    if (this.onNoActivitySelectedToOppOrder()) {
      this.meetingService.SearchOrderAndOppBasedOnAccount(this.accntCompanyDetails.SysGuid, val, this.accntCompanyDetails.isProspect).subscribe(data => {
        this.isLinkedOpportunitySearchLoading = false;
        if (data.IsError === false) {
          this.linkedOpportunity = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(data.Message);
          this.linkedOpportunity = [];
        }
      }, error => {
        this.isLinkedOpportunitySearchLoading = false;
        this.linkedOpportunity = [];
      })
    }
  }
  linkCampaignLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.newConversationForm.patchValue({
        linkCampaign: ''
      })
    }
    this.isLinkedCampaignsSearchLoading = true;
    this.campaignContact = [];
    if (this.onNoActivitySelectedToCampaign()) {
      this.newconversationService.campaignBasedOnAccount(val, this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(data => {
        this.isLinkedCampaignsSearchLoading = false;
        if (data.IsError === false) {
          this.campaignContact = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(data.Message);
          this.campaignContact = [];
        }
      }, error => {
        this.isLinkedCampaignsSearchLoading = false;
        this.campaignContact = [];
      })
    }
  }
  callTempPotentialWiproSoluction() {
    this.PotentialWiproSoluctionLookUpApiLoader('', false);
  }
  callTempWiproContacts() {
    this.WiproContactsLookUpApiLoader('', false);
  }
  callTempcontacttag() {
    this.contacttagLookUpApiLoader('', false);
  }
  callTempcustomerContacts() {
    this.customerContactsLookUpApiLoader('', false);
  }
  callTemplinkLead() {
    this.linkLeadLookUpApiLoader('', false);
  }
  clickLinkedOpportunityOrder() {
    this.OpportunityOrderLookUpApiLoader('', false);
  }
  callTemplinkCampaign() {
    this.linkCampaignLookUpApiLoader('', false);
  }
  onNoActivitySelectedToCustomerContacts(): boolean {
    if (this.activityGroupId === '') {
      this.customerNameSwitch = false
      this.isCustomerParticipantsSearchLoading = false;
      this.newConversationForm.get('customerContacts').clearValidators();
      this.newConversationForm.get('customerContacts').updateValueAndValidity();
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }
  onNoActivitySelectedToLead(): boolean {
    if (this.activityGroupId === '') {
      this.isLinkedLeadsSearchLoading = false;
      this.contactleadSwitch = false
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }
  onNoActivitySelectedToOppOrder() {
    if (this.activityGroupId === '') {
      this.isLinkedOpportunitySearchLoading = false;
      this.contactopportunitySwitch = false;
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }
  onNoActivitySelectedToCampaign() {
    if (this.activityGroupId === '') {
      this.linkedcampaignSwitch = false;
      this.isLinkedCampaignsSearchLoading = false;
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    isBackbuttonrequired: false,
    IsProspectAccount: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: '',
    errorMsg: {
      isError: false,
      message: ""
    }
  };
  IdentifyAppendFunc = {
    'CustomerContactSearch': (data) => { this.appendCustometParticipants(data, 0) },
    'LinkedLeadsSearch': (data) => { this.appendLinkedLead(data, 0) },
    'LinkedOpportunityOrderSearch': (data) => { this.appendLinkedOpportunity(data, 0) },
    'WiproParticipantSearch': (data) => { this.appendWiproParticipants(data, 0) },
    'TaggedUserSearch': (data) => { this.appendPrivateAccess(data, 0) },
    'PotentialWiproSolutionSearch': (data) => { this.appendWiproSolution(data, 0) },
    'LinkedCampaignSearch': (data) => { this.appendLinkedCampaign(data, 0) }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'CustomerContactSearch': { return (this.sendCustomerToAdvance.length > 0) ? this.sendCustomerToAdvance : [] }
      case 'LinkedLeadsSearch': { return (this.sendLeadToAdvance.length > 0) ? this.sendLeadToAdvance : [] }
      case 'LinkedOpportunityOrderSearch': { return (this.sendOppToAdvance.length > 0) ? this.sendOppToAdvance : [] }
      case 'WiproParticipantSearch': { return (this.sendwiproToAdvance.length > 0) ? this.sendwiproToAdvance : [] }
      case 'TaggedUserSearch': { return (this.sendTagToAdvance.length > 0) ? this.sendTagToAdvance : [] }
      case 'PotentialWiproSolutionSearch': { return (this.sendSolnToAdvance.length > 0) ? this.sendSolnToAdvance : [] }
      case 'LinkedCampaignSearch': { return (this.selectedcampaign.length > 0) ? this.selectedcampaign : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'CustomerContactSearch': { return this.selectedCustomer = [], this.sendCustomerToAdvance = [] }
      case 'LinkedLeadsSearch': { return this.selectedLinkedLeads = [], this.sendLeadToAdvance = [] }
      case 'LinkedOpportunityOrderSearch': { return this.selectedLinkedOpp = [], this.sendOppToAdvance = [] }
      case 'WiproParticipantSearch': { return this.selectedContact = [], this.sendwiproToAdvance = [] }
      case 'TaggedUserSearch': { return this.selectedTag = [], this.sendTagToAdvance = [] }
      case 'PotentialWiproSolutionSearch': { return this.selectedsolution = [], this.sendSolnToAdvance = [] }
      case 'LinkedCampaignSearch': { return this.selectedcampaign = [] }
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = NewActivityHeaders[controlName]
    this.lookupdata.lookupName = NewActivityAdvNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = NewActivityAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = NewActivityAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.newconversationService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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
      this.newconversationService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
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
        console.log(result)
        this.emptyArray(result.controlName)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
      this.contactNameSwitch = false;
      this.customerNameSwitch = false;
      this.contactopportunitySwitch = false;
      this.contactTagSwitch = false;
      this.solutionSwitch = false;
      this.linkedcampaignSwitch = false;
      this.contactleadSwitch = false;
      this.arrowkeyLocation = 0;
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
  LeadGuid: any;
  getCommonData() {
    return {
      guid: (this.accntCompanyDetails) ? (this.accntCompanyDetails.SysGuid) ? this.accntCompanyDetails.SysGuid : '' : '',
      isProspect: (this.accntCompanyDetails) ? (this.accntCompanyDetails.isProspect) ? this.accntCompanyDetails.isProspect : false : false,
    }
  }
  /*****************Advance search popup ends*********************/
  closepopover(index) {
    console.log('attach close');
    // this.newconversationService.attachmentList[index].Comments[0].Description = '';
    this.autoSaveRedishCache();
    this.addcommmentpopover = false;
    this.isCommentEmpty = false
  }
  isCommentEmpty = false
  savepopover(index) {
    // if (this.newConversationForm.value.comments !== '') {
    this.viewcommentpopover = true;
    this.addcommmentpopover = false;
    console.log(`comments ${this.newConversationForm.value.comments}`)
    this.newconversationService.attachmentList[index].Comments[0].Description = this.newConversationForm.value.comments;
    this.autoSaveRedishCache();
    // } else {
    //   this.isCommentEmpty = true
    // }
  }
  // inputCommentSave(index) {
  //   this.newconversationService.attachmentList[index].Comments[0].Description = this.newConversationForm.value.comments;
  //   this.autoSaveRedishCache();
  // }
  commentindex = -1
  onAddCommentPopup(index) {
    console.log(index)
    this.commentindex = index
    this.isCommentEmpty = false
    this.newConversationForm.patchValue({
      comments: ''
    })
    this.addcommmentpopover = true
  }
  onViewCommentPopUp(index) {
    this.commentindex = index
    this.isCommentEmpty = false
    this.newConversationForm.patchValue({
      comments: this.newconversationService.attachmentList[index].Comments[0].Description
    })
    this.addcommmentpopover = true
  }

  syncActivityInfo() {
    let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
    if (lead) {
      if (lead.isMeetingCreate && lead.isMeetingCreate == true) { 
        this.appendAccountOnly(lead.Account.Name,lead.Account.SysGuid,lead.Account.isProspect,'');
      } else {
        this.appendActivityAndAccount();
      }
    } else {
      this.appendActivityAndAccount();
    }
  }

  appendActivityAndAccount() {
    if (sessionStorage.getItem('selAccountObj')) {
      let accountObj =  JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"));
      this.appendAccountOnly(accountObj.Name,accountObj.SysGuid,accountObj.isProspect,accountObj.AccountType);
    } else {
      this.appendActivityGroupAndAccount();
    }
    if (localStorage.getItem('AccountModuePopulateData')) {
      this.appendActivityGroupAndAccount();
    }
  }
  appendActivityGroupAndAccount() {
    if (JSON.parse(localStorage.getItem('forMeetingCreation')) !== null) {
      this.activityInfo = JSON.parse(localStorage.getItem('forMeetingCreation'))
      this.activityGroupId = this.activityInfo.Guid;
      this.conversationName = this.activityInfo.Name;
      this.activityGroupCache = { "Guid": this.activityInfo.Guid, "Name": this.activityInfo.Name };
      this.accntCompanyDetails = this.activityInfo.Account;
      this.newConversationForm.patchValue({
        conversationName: this.activityInfo.Name,
        accountcompanyName: this.service.getSymbol(this.activityInfo.Account.Name)
      })
      this.accountType = this.activityInfo.AccountType
      this.OppOrderEnabledisable()
      this.ConversationNameSwitch = false;
      this.getRedishCacheData();
    } else {
      this.clearActivityGroup();
      this.getRedishCacheData();
    }
  }
  appendAccountOnly(Name,SysGuid,isProspect,accType) {
      this.activityGroupId = '';
      this.conversationName = "";
      this.activityGroupCache = undefined;
      this.accntCompanyDetails = { Name: Name, SysGuid: SysGuid, isProspect: isProspect };
      this.newConversationForm.patchValue({
        accountcompanyName: this.service.getSymbol(Name)
      })
      this.accountType = accType
      this.OppOrderEnabledisable()
      this.ConversationNameSwitch = false;
  }
  OppOrderEnabledisable() {
    debugger;
    if (this.accountType == 'Prospect') {
      this.removeOppoValidators();
      this.IsOpporeq = false;
    }
  }
  wiproSolutionData(data: string) {
    return data.replace(/ *\([^)]*\) */g, "");
  }
  autofill() {
    this.meetingService.meetingDetails = {
      activityGroupId: this.activityGroupId,
      conversationName: this.conversationName,
      activityType: this.newConversationForm.value.activityType,
      conversationType: this.newConversationForm.value.conversationType,
      // meetingDate: new Date(this.newConversationForm.value.dateCreated),
      meetingSubject: this.newConversationForm.value.meetingSubject,
      MoM: this.newConversationForm.value.recordMom,
      access: this.newConversationForm.value.access,
      accountDetails: this.accntCompanyDetails,
      selectedCustomer: this.selectedCustomer,
      selectedContact: this.selectedContact,
      selectedTag: this.selectedTag,
      selectedsolution: this.selectedsolution,
      selectedcampaign: this.selectedcampaign,
      selectedLinkedLeads: this.selectedLinkedLeads,
      selectedLinkedOpp: this.selectedLinkedOpp,
      HasConsentToRecord: this.newConversationForm.value.haveConsent,
      // activityTypeList: this.activityTypeList
    }
  }
  canceleditcommnet(): void {
    const dialogRef = this.dialog.open(cancelpopeditComponent, {
      width: '400px',
    });
  }
  /********  add view comment popup file code starts *****************/
  addComments = true;
  updatecomments: any;
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map(conversation => {
          let accountInfo;
          accountInfo = { SysGuid: conversation.Account.SysGuid, isProspect: false, Name: conversation.Account.Name }
          return {
            Conversation_Guid: conversation.Conversation_Guid,
            Name: conversation.Name,
            isPrivate: conversation.IsPrivate,
            account: accountInfo
          };
        });
      } else {
        return []
      }
    } else {
      return []
    }
  }
  filesToDownloadDocument64(body) {
    console.log("body",body);
    this.isLoading = true;
    this.fileService.filesToDownloadDocument64(body).subscribe((res) =>{
      this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.service.Base64Download(res);
        })
      } else {
         this.ErrorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
  }
  downloadAll() {
    let downloadUrls = []
    if (this.envr.envName === 'MOBILEQA') {
      this.newconversationService.attachmentList.forEach(item => {
        downloadUrls.push({ Url: item.Url, Name: item.Name })
      })
      this.downloadAllInMobile(downloadUrls)
      return;
    } else {
      let body = this.newconversationService.attachmentList.map(x=>{return {Name : x.downloadFileName}});
      this.filesToDownloadDocument64(body);
      // this.newconversationService.attachmentList.forEach(res => {
      //   this.service.Base64Download(res);
      //   // downloadUrls.push(res.Url);
      // })
    }
    // For downloading multiple files
    // downloadUrls.forEach(function (value, idx) {
    //   const response = {
    //     file: value,
    //   };
    //   setTimeout(() => {
    //     var a = document.createElement('a');
    //     a.href = response.file;
    //     a.download = response.file;
    //     document.body.appendChild(a);
    //     a.click();
    //   }, idx * 2500)
    // });
  }
  downloadAllInMobile(fileInfo) {
    fileInfo.forEach(function (value, idx) {
      const response = value;
      setTimeout(() => {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(response.Url);
        var fileURL = "///storage/emulated/0/DCIM/" + response.Name;
        fileTransfer.download(
          uri, fileURL, function (entry) {
            console.log("download complete: " + entry.toURL());
          },
          function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
          },
          null, {
          //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          //  } headers: {
          // 
        }
        );
      }, idx * 2500)
    });
  }
  downloadsingle(i) {
    let body = [this.newconversationService.attachmentList[i]].map(x=>{return {Name : x.downloadFileName}});
    this.filesToDownloadDocument64(body);
    // this.service.Base64Download(res);
    // this.newconversationService.attachmentList[i]
    // const response = {
    //   file: this.newconversationService.attachmentList[i].Url,
    // };
    // var a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
    // console.log(i, this.newconversationService.attachmentList);
  }
  downloadSingleAttachment(item) {
    this.newconversationService.DownloadSingleAttachment(item).subscribe(res => {
      if (res.IsError === false) {
        window.open(res.ResponseObject.Url, '_blank')
      }
    })
  }
  delinkAttach(id) {
    const dialogRef = this.dialog.open(deleteAttachPopUp, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.OK === true) {
        this.newconversationService.attachList = this.newconversationService.attachList.filter(res => res.downloadFileName !== id);
        this.autoSaveRedishCache();
      }
    })
  }
  onClickAddCustomerContacts() {
    if (this.activityGroupId === '') {
      this.ErrorMessage.throwError('Select activity group')
    } else {
      const dialogRef = this.dialog.open(CustomerpopupComponent, {
        width: '800px',
        data: (this.accntCompanyDetails) ? ({ Name: this.accntCompanyDetails['Name'], SysGuid: this.accntCompanyDetails['SysGuid'], isProspect: this.accntCompanyDetails['isProspect'] }) : ''
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        if (res != '') {
          this.selectedCustomer.push({ FullName: (res['FName'] + ' ' + res['LName']), Email: res['Email'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "" });
          this.sendCustomerToAdvance.push({ FullName: (res['FName'] + ' ' + res['LName']), Email: res['Email'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "", Id: res['Guid'] });
          this.removeCustomerValidatos()
        }
      });
    }
  }
  onClick() {
    console.log("onClick")
    if (this.meetingGuid == undefined) {
      this.onError("Kindly fill all mandatory fields")
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

  UtcConversation(data) {
    return moment( data.split(':00')[0], "YYYY-MM-DDTHH:mm:mm").utc()
  }
  
  save() {
    var newconversationServiceAttachment;
    if (this.activityGroupName.trim() === '') {
      this.newConversationForm.patchValue({ meetingSubject: '' });
      this.newConversationForm.controls['meetingSubject'].setValidators(Validators.required);
      this.newConversationForm.controls['meetingSubject'].markAsTouched();
      this.newConversationForm.controls['meetingSubject'].updateValueAndValidity();
    }
    if (this.selectedContact.length == 0) {
      this.newConversationForm.get('WiproContacts').setValidators([Validators.required])
      this.newConversationForm.get('WiproContacts').markAsTouched();
      this.newConversationForm.get('WiproContacts').updateValueAndValidity();
    }
    this.customerNameclose();
    this.wiproParticipantClose();
    if (this.play === true && this.newConversationForm.valid) {
      this.onError("Stop the recording before save ")
      return
    }
    if (this.newConversationForm.valid && this.play === false) {
      console.log('conversation form-->', this.newConversationForm)
      newconversationServiceAttachment = this.newconversationService.attachmentList;
      this.newconversationService.attachmentList = this.newconversationService.attachmentList.map(x =>{
        return { 'Name' : x.Name, 'Url': x.Url,"MapGuid": x.MapGuid,"LinkActionType": x.LinkActionType,"Comments" : x.Comments }
      });
      this.clicked = true
      var meetingBody = {
        "Name": this.activityGroupName.trim(),
        "Owner": {
          "AdId": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip')
        },
        "ScheduleStart": this.UtcConversation(this.sendFinalStartDate.toString()),
        "IsPrivate": this.newConversationForm.value.access,
        "IsLiveMeeting": true,
        "Description": "",
        "MOM": this.newConversationForm.value.recordMom,
        "Account": this.accntCompanyDetails,
        "HasConsentToRecord": this.newConversationForm.value.haveConsent,
        "Conversation": {
          "Type": this.newConversationForm.value.conversationType
        },
        "EndDate":  this.UtcConversation(this.sendFinalEndDate.toString()),
        "MeetingType": {
          "Id": Number(this.newConversationForm.value.activityType)
        },
        "Duration": this.totalMinutesToSend.toString(),
        "ActivityGroup": {
          "Guid": this.activityGroupId
        },
        "WiproParticipant": this.selectedContact.length > 0 ? this.wiproParticipantFilter(this.selectedContact) : [],
        "Attachments": this.newconversationService.attachmentList.length > 0 ? this.newconversationService.attachmentList : [],
        "TagUserToView": this.selectedTag.length > 0 ? this.TagUserToViewFilter(this.selectedTag) : [],
        "WiproPotentialSolution": this.selectedsolution.length > 0 ? this.WiproPotentialSolutionFilter(this.selectedsolution) : [],
        "Campaign": this.selectedcampaign.length > 0 ? this.CampaignFilter(this.selectedcampaign) : [],
        "OpportunitiesOrOrders": this.selectedLinkedOpp.length > 0 ? this.OpportunitiesOrOrdersFilter(this.selectedLinkedOpp) : [],
        "Lead": this.selectedLinkedLeads.length > 0 ? this.LeadsFilter(this.selectedLinkedLeads) : [],
        "CustomerContacts": this.selectedCustomer.length > 0 ? this.CustomerContactsFilter(this.selectedCustomer) : []
      }
      this.isLoading = true;
      this.newMeetingService.createMeeting(meetingBody).subscribe(data => {
        this.isLoading = false;
        if (!data.IsError) {
          let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", this.activityGroupId, "DecryptionDecrip");
          sessionStorage.setItem("ActivityListRowId", JSON.stringify(encId))
          sessionStorage.setItem("ActivityGroupName", this.conversationName)
          this.newconversationService.setActivityGroupName(this.converstationName)
          this.store.dispatch(new ClearMeetingList({ cleardetails: this.activityGroupId }))
          this.store.dispatch(new ClearActivity())
          this.store.dispatch(new ClearActivityDetails())
          this.store.dispatch(new ClearTaskList())
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearRelationshipCount());
          this.resetCacheData();
          let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
          if (lead) {
            if (lead.isMeetingCreate && lead.isMeetingCreate == true) { 
              lead.LinkActivityGroupLead.push({Guid: data.ResponseObject.Guid, SysGuid: data.ResponseObject.Guid, Name: data.ResponseObject.Name})
              sessionStorage.setItem('TempEditLeadDetails',JSON.stringify({...lead}));
            } 
          }
          let json = {
            Guid: data.ResponseObject.ActivityGroup.Guid,
            Name: data.ResponseObject.ActivityGroup.Name,
            Account: data.ResponseObject.Account,
            AccountType: data.ResponseObject.AccountType
          }
          let json1 = {
            Account: data.ResponseObject.Account.Name,
            AccountSysGuid: data.ResponseObject.Account.SysGuid,
            isProspect: data.ResponseObject.Account.isProspect,
            isAccountPopulate: true
          }
          if (sessionStorage.getItem('selAccountObj')) {
            localStorage.setItem('AccountModuePopulateData', JSON.stringify(true))
          }
          var Key
          if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
            if (this.activityGroupId != '') {
              Key = this.CachekeyId + this.activityGroupId;
            } else {
              Key = this.CachekeyId;
            }
          } else {
            Key = this.CachekeyId;
          }
          this.service.SetRedisCacheData("empty", Key).subscribe(res => {
            console.log(res);
          })
          sessionStorage.setItem('archivedStatus', "false");
          localStorage.setItem("forMeetingCreation", JSON.stringify(json))
          sessionStorage.setItem("RequestCampaign", JSON.stringify(json1));
          sessionStorage.setItem('AccountNameForChildConversation', data.ResponseObject.Account)
          sessionStorage.setItem('ActivityGroupName', data.ResponseObject.ActivityGroup.Name)
          this.opencreate();
        } else {
          this.newconversationService.attachmentList = newconversationServiceAttachment
          this.onError(data.Message)
          this.clicked = false
        }
      },
        error => {
          this.newconversationService.attachmentList = newconversationServiceAttachment
          this.isLoading = false;
          this.clicked = false
        }
      )
    } else {
      this.service.validateAllFormFields(this.newConversationForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }
  wiproParticipantFilter(data): Array<any> {
    try {
      let ParticipantArray = []
      data.map(x => ParticipantArray.push({ "MapGuid": "", "SysGuid": x.SysGuid, "LinkActionType": 1 }))
      return ParticipantArray
    } catch (error) {
      return []
    }
  }
  LeadsFilter(data): Array<any> {
    try {
      let LeadArray = [];
      data.map(x => LeadArray.push({ "LeadGuid": x.LeadGuid, "MapGuid": "", "LinkActionType": 1 }))
      return LeadArray
    } catch (error) {
      return []
    }
  }
  OpportunitiesOrOrdersFilter(data): Array<any> {
    try {
      let OpportunitiesOrderArray = [];
      data.map(x => OpportunitiesOrderArray.push({ "Type": x.Type, "SysGuid": x.Guid, "MapGuid": "", "LinkActionType": 1 }))
      return OpportunitiesOrderArray
    } catch (error) {
      return []
    }
  }
  CampaignFilter(data): Array<any> {
    try {
      let CampaignArray = [];
      data.map(x => CampaignArray.push({ "Id": x.Id, "MapGuid": "", "LinkActionType": 1 }))
      return CampaignArray
    } catch (error) {
      return []
    }
  }
  WiproPotentialSolutionFilter(data): Array<any> {
    try {
      let SolutionArray = [];
      data.map(x => SolutionArray.push({ "SysGuid": x.SysGuid, "MapGuid": "", "LinkActionType": 1 }))
      return SolutionArray
    } catch (error) {
      return []
    }
  }
  TagUserToViewFilter(data): Array<any> {
    try {
      let TagUser = [];
      data.map(x => TagUser.push({ "SysGuid": x.Guid, "MapGuid": "", "LinkActionType": 1 }))
      return TagUser
    } catch (error) {
      return []
    }
  }
  CustomerContactsFilter(data): Array<any> {
    try {
      let CustomerArray = [];
      data.map(x => CustomerArray.push({ "Guid": x.Guid, "MapGuid": "", "LinkActionType": 1 }))
      return CustomerArray
    } catch (error) {
      return []
    }
  }
  onCancel() {
    localStorage.removeItem('replicateId')
    this.newconversationService.conversationAppointId = undefined
  }
  opencreate() {
    const dialogRef = this.dialog.open(createConversationpopComponent,
      {
        disableClose: true,
        width: '396px',
      });
    dialogRef.componentInstance.data = this.activityGroupName.trim();
    dialogRef.componentInstance.child = "Meeting created successfully!"
  }
  //new conversation code end
  append(text) {
    this.term = text;
    this.suggestion = false;
  }
  consentStatus(e) {
    this.consent = e.checked;
    if (e.checked == false) {

      this.play = false;
    }
  }
  // RECORD MOM POP UP CALL START 
  recordingPoPUp: boolean = false;
  recognizer
  openRecordMomPopup(recordButton): void {
    if(recordButton==='Record') {
      this.play = true;
      this.recordButton = {
        name: "Pause",
        Tooltip: "Pause",
        iconClass: "mdi mdi-pause record-icon"
      }
        var subscriptionKey = "50cb684cff5b44abad90aaff3fcb8f22";
        var serviceRegion = "southeastasia"
        var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.speechRecognitionLanguage = "en-US";
        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        this.recognizer.startContinuousRecognitionAsync(() => console.log("speech"));
        this.recognizer.recognizing = (s, e) => this.recognizing(s, e);
        this.recognizer.recognized = (s, e) => this.recognized(s, e);
    }else{
      this.stop();
    }
  };
  recognizing(s, e) {
    console.log('recognizing text', e.result.text);
  }
  recognized(s, e) {
    console.log('recognized text', e.result.text);
    this.speechData += e.result.text;
  }
  stop() {
    this.play = false;
    this.recordButton = {
      name: "Record",
      Tooltip: "Capture minutes of meeting using speech to text assistance",
      iconClass: "mdi mdi-microphone record-icon"
    }
    this.recognizer.stopContinuousRecognitionAsync();
  }
  accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  fileChangeEvent(e) {
    let files = [].slice.call(e.target.files);
    let uploadingFileList = [];
    let fileNames = [];
    if (files.length > 0) {
      files.forEach(res => {
        let file: File = res;
        let canditionAction = this.fileValidation(file)
        switch (canditionAction) {
          case 'FileSize': {
            this.ErrorMessage.throwError("Not able to upload the file because filesize is greater than 5mb.");
            break;
          }
          case 'InvalidFormat': {
            this.ErrorMessage.throwError("File format not supported!")
            break;
          }
          case 'FileExist': {
            this.ErrorMessage.throwError("File is already exist!")
            break;
          }
          case 'Upload': {
            const fd: FormData = new FormData();
            fd.append('file', file);
            fileNames.push(file.name)
            uploadingFileList.push(fd)
            break;
          }
        }
      })
      this.fileUplaod(uploadingFileList, fileNames)
    }
  }
  fileValidation(file) {
    if (file.size > 5242880) {
      return 'FileSize'
    }
    if (!this.accept.includes(file.type)) {
      return 'InvalidFormat'
    }
    if (this.newconversationService.attachmentList.length == 0) {
      if (this.accept.includes(file.type)) {
        return 'Upload'
      }
      if (!this.accept.includes(file.type)) {
        return 'InvalidFormat'
      }
    }
    if (this.newconversationService.attachmentList.length > 0) {
      let index = this.newconversationService.attachmentList.findIndex(k => k.Name == file.name);
      if (index === -1) {
        if (this.accept.includes(file.type)) {
          return 'Upload'
        }
      } else {
        return 'FileExist'
      }
    }
  }
  fileUplaod(fileList, fileNames) {
    if (fileList.length > 0) {
      this.isLoading = true
      console.log(fileList)
      // this.fileService.filesToUpload(fileList).subscribe((res) => {
        this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
          console.log(res);
        this.isLoading = false;
        res.forEach((file, i) => {
          if (file !== '') {
            this.newconversationService.attachmentList.push({
              "Name": fileNames[i],
              "Url": file.ResponseObject.Url,
              "MapGuid": "",
              "LinkActionType": 1,
              "Comments": [{ "Description": "" }],
              downloadFileName: file.ResponseObject.Name
            })
          }
        })
        console.log(this.newconversationService.attachmentList)
        this.autoSaveRedishCache()
      },
        () => this.isLoading = false
      )
    }
  }
  openactivitypop(): void {
    const dialogRef = this.dialog.open(activitypop, {
      disableClose: true,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        debugger
        console.log("Activity created" + JSON.stringify(res))
        this.activityGroupId = res.Guid;
        this.conversationName = res.Name;
        this.accntCompanyDetails = res.Account;
        this.newConversationForm.patchValue({
          conversationName: res.Name,
          accountcompanyName: this.service.getSymbol(res.Account.Name)
        })
        this.accountType = res.AccountType
        this.ConversationNameSwitch = false;
        this.OppOrderEnabledisable()
        this.resetCacheData();
      }
    })
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpop, {
      width: '400px',
    });
    dialogRef.componentInstance.activityGroupId = this.activityGroupId;
    dialogRef.componentInstance.CachekeyId = this.CachekeyId;
  }
  custominputclose() { };
  // company name code start 
  // Account/Company name
  appendName(value: string, item) {
    this.accntCompanyDetails = item;
    console.log(this.accntCompanyDetails);
    this.newConversationForm.patchValue({ accountcompanyName: value })
    this.companyName = value;
  }
  companyNameClose() {
    this.companyNameSwitch = false;
    // if(this.accntCompanyDetails===undefined) {
    //   this.newConversationForm.patchValue({ accountcompanyName: '' })
    // }
  }
  contactActivities: string;
  linkedOppSwitch: boolean;
  linkedOppClose() {
    this.linkedOppSwitch = false;
  }
  appendactivity(value: string, i) {
    this.contactActivities = value;
    this.selectedActivities.push(this.activitiesContact[i])
  }
  activitiesContact: {}[] = [
    { index: 0, contact: 'Singtel opportunity 01 name', initials: 'SO', value: true },
    { index: 1, contact: 'Singtel opportunity 01 name', initials: 'SO', value: false },
    { index: 2, contact: 'Singtel opportunity 01 name', initials: 'SO', value: false },
    { index: 3, contact: 'Singtel opportunity 01 name', initials: 'SO', value: false },
  ]
  selectedActivities: {}[] = [];
  // Linked campaigns
  linkedCampaignClose() {
    this.linkedcampaignSwitch = false;
    this.newConversationForm.patchValue({
      linkCampaign: ''
    })
  }
  appendLinkedCampaign(item, i) {
    if (i > this.campaignContact.length) {
      this.openadvancetabs('LinkedCampaignSearch', this.campaignContact, this.newConversationForm.get('linkCampaign').value);
      this.linkedCampaignClose();
    } else {
      var json = { Id: item.Id, MapGuid: "", Name: item.Name };
      this.selectedcampaign.push(json)
      let beforeLength = this.selectedcampaign.length
      this.selectedcampaign = this.service.removeDuplicates(this.selectedcampaign, "Id");
      let afterLength = this.selectedcampaign.length
      // this.newConversationForm.patchValue({
      //   linkCampaign: ''
      // })
      //this.campaignContact = []

      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected  linked campaign exists")
      }
      if (this.selectedcampaign.length > 0 && this.IsCampaignreq) {
        this.removeCampValidators()
      }
      this.linkedCampaignClose()
    }
    this.autoSaveRedishCache();
  }
  delinkCampaign(id) {
    this.selectedcampaign = this.selectedcampaign.filter(res => res.Id !== id);
    if (this.selectedcampaign.length == 0 && this.IsCampaignreq) {
      this.setCampValidators()
    }
    this.autoSaveRedishCache();
  }
  showContact: boolean = false;
  contactNameSwitch: boolean = false;
  wiproParticipantClose() {
    this.contactNameSwitch = false;
    this.newConversationForm.patchValue({
      WiproContacts: ''
    })
  }
  wiprocustomerHit: any;
  sendwiproToAdvance = [];
  // Wipro contacts
  appendWiproParticipants(item, i) {
    if (i > this.wiprocontactsearch.length) {
      this.openadvancetabs('WiproParticipantSearch', this.wiprocontactsearch, this.newConversationForm.get('WiproContacts').value)
      this.wiproParticipantClose()
    } else {
      var json = { FullName: item.FullName, Designation: item.Designation, MapGuid: "", SysGuid: item.SysGuid };
      var json1 = { FullName: item.FullName, Designation: item.Designation, MapGuid: "", SysGuid: item.SysGuid, Id: item.SysGuid };
      this.selectedContact.push(json);
      let beforeLength = this.selectedContact.length
      this.selectedContact = this.service.removeDuplicates(this.selectedContact, "SysGuid");
      let afterLength = this.selectedContact.length
      if (beforeLength == afterLength) {
        this.sendwiproToAdvance.push(json1);
      }
      this.wiproParticipantClose()
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected wipro participant already exists")
      }
      if (this.selectedContact.length > 0) {
        this.newConversationForm.get('WiproContacts').clearValidators();
        this.newConversationForm.get('WiproContacts').updateValueAndValidity();
      }
    }
    this.autoSaveRedishCache();
  }
  delinkWiproParticipant(id) {
    this.selectedContact = this.selectedContact.filter(res => res.SysGuid !== id)
    this.sendwiproToAdvance = this.sendwiproToAdvance.filter(res => res.SysGuid !== id)
    if (this.selectedContact.length == 0) {
      this.newConversationForm.get('WiproContacts').setValidators([Validators.required])
      this.newConversationForm.get('WiproContacts').markAsTouched()
      this.newConversationForm.get('WiproContacts').updateValueAndValidity()
    }
    this.autoSaveRedishCache();
  }
  customerNameclose() {
    this.customerNameSwitch = false;
    this.newConversationForm.patchValue({
      customerContacts: ''
    })
  }
  singleCustomerHit: any;
  sendCustomerToAdvance = []
  // Customer contacts
  appendCustometParticipants(item, i) {
    if (i > this.customerContactSearch.length) {
      this.openadvancetabs('CustomerContactSearch', this.customerContactSearch, this.newConversationForm.get('customerContacts').value);
      this.customerNameclose();
    } else {
      this.customerName = item.FullName;
      let json = { FullName: item.FullName, Email: item.Email, isKeyContact: item.isKeyContact, Guid: item.Guid, MapGuid: "" }
      let json1 = { FullName: item.FullName, Email: item.Email, isKeyContact: item.isKeyContact, Guid: item.Guid, MapGuid: "", Id: item.Guid }
      this.selectedCustomer.push(json);
      let beforeLength = this.selectedCustomer.length
      this.selectedCustomer = this.service.removeDuplicates(this.selectedCustomer, "Guid");
      let afterLength = this.selectedCustomer.length;
      if (beforeLength == afterLength) {
        this.sendCustomerToAdvance.push(json1)
      }
      this.customerNameclose()
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected customer participant already exists")
      }
      if (this.selectedCustomer.length > 0) {
        this.removeCustomerValidatos()
      }
      this.customerNameclose()
    }
    this.autoSaveRedishCache();
  }
  delinkCustomerContacts(id) {
    this.selectedCustomer = this.selectedCustomer.filter(res => res.Guid !== id)
    this.sendCustomerToAdvance = this.sendCustomerToAdvance.filter(res => res.Guid !== id)

    if (this.selectedCustomer.length == 0 && this.IsCustomerreq) {
      this.setCustomerValidatos()
    }
    this.autoSaveRedishCache();
  }
  removeSpecialChar(val) {
    var k;
    k = val.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  ConversationNameclose() {
    this.ConversationNameSwitch = false;
    if (this.conversationName === "" && this.newConversationForm.get('conversationName').dirty) {
      this.newConversationForm.patchValue({
        conversationName: ''
      })
    }
    if (this.conversationName !== "") {
      this.newConversationForm.patchValue({
        conversationName: this.conversationName
      })
    }
  }
  // conversationName
  activityGroupCache: any;
  accountCache: any;
  appendActivityGroup(item, i) {
    if (i > this.searchConversationList.length) {
      this.openactivitypop()
      this.contactNameSwitch = false;
    }
    else {
      // this.newconversationService.ValidateAccount(item.Account.SysGuid, item.Account.isProspect, 0).subscribe(res => {
      //   if (res.IsError) {
      //     this.clearActivityGroup();
      //     this.ErrorMessage.throwError(res.Message)
      //   } else {
      this.activityGroupCache = { "Guid": item.Guid, "Name": item.Name };
      this.activityGroupId = item.Guid;
      this.conversationName = item.Name;
      this.accntCompanyDetails = item.Account;
      this.accountType = item.AccountType;
      this.ConversationNameSwitch = false;
      this.newConversationForm.patchValue({
        conversationName: item.Name,
        accountcompanyName: this.service.getSymbol(item.Account.Name)
      })
      this.resetCacheData();
      if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
        let data = JSON.parse(localStorage.getItem('forMeetingCreation'));
        if (data.Guid) {
          if (data.Guid == this.activityGroupId) {
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
      this.OppOrderEnabledisable()
      //   }
      // }, error => {
      //   this.clearActivityGroup();
      //   this.ConversationNameSwitch = false;
      // })
    }
  }
  resetCacheData() {
    this.selectedCustomer = [];
    this.selectedLinkedLeads = [];
    this.selectedLinkedOpp = [];
    this.selectedcampaign = [];
    this.sendCustomerToAdvance = [];
    this.sendLeadToAdvance = [];
    this.sendOppToAdvance = [];
    this.selectedContact = [];
    this.sendwiproToAdvance = [];
    this.selectedCustomer = [];
    this.sendCustomerToAdvance = [];
    this.selectedTag = [];
    this.sendTagToAdvance = [];
    this.selectedsolution = [];
    this.sendSolnToAdvance = [];
    this.selectedcampaign = [];
    this.selectedLinkedLeads = [];
    this.sendLeadToAdvance = [];
    this.selectedLinkedOpp = [];
    this.sendOppToAdvance = [];
    this.cacheDataService.cacheDataMultiReset(
      [
        'activityGroup',
        'customerParticipants',
        'wiproParticipants',
        'potentialWiproSolutions',
        'linkedCampaigns',
        'linkedLeads',
        'linkedOpportunitiesOrder'
      ]
    )
  }
  clearActivityGroup() {
    let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
    if (lead && lead.isMeetingCreate == true) {
      this.newConversationForm.patchValue({
        conversationName: '',
      })
      this.activityGroupId = '';
      this.conversationName = '';
      this.resetCacheData();
      this.removeOppoValidators();
      this.IsOpporeq = false;
      return
      }
    this.newConversationForm.patchValue({
      conversationName: '',
      accountcompanyName: ''
    })
    this.activityGroupId = '';
    this.conversationName = '';
    this.accountType = ''
    this.accntCompanyDetails = undefined;
    this.resetCacheData();
    this.removeOppoValidators();
    this.IsOpporeq = false;
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
        console.log("got the result now!!1")
        console.log(res)
        if (!res.IsError) {
          this.EnableValidations(res.ResponseObject)
        } else {
          this.ErrorMessage.throwError(res.Message)
        }
      })
    }
  }
  activitySelectWeb(event) {
    this.activityTypeValidation(event.value);
    this.activityTypeList.filter(val => {
      if (val.Id === event.value) {
        this.activityTypeName = val.Name;
      }
    })
    this.autoSaveRedishCache();
  }
  meetingSelectWeb(event) {
    this.conversationType.filter(val => {
      if (val.Id === event.value) {
        this.meetingTypeAria = val.Value;
      }
    });
    this.autoSaveRedishCache()
  }
  meetingSelect(event) {
    this.autoSaveRedishCache()
  }
  EnableValidations(data) {
    // throw new Error("Method not implemented.");
    console.log("->>>>>")
    console.log(data)
    if (data) {
      if (data.IsAccountReq) {
        this.IsAccountreq = true
        this.setAccountValidators()
      } else {
        this.IsAccountreq = false
        this.removeAccountValidators()
      }
      if (data.IsCampaignReq) {
        this.IsCampaignreq = true
        if (this.selectedcampaign.length > 0) {
          this.removeCampValidators()
        } else {
          this.setCampValidators()
        }
      } else {
        this.IsCampaignreq = false
        this.removeCampValidators()
      }
      if (data.IsCustReq) {
        this.IsCustomerreq = true
        if (this.selectedCustomer.length > 0) {
          this.removeCustomerValidatos()
        } else {
          this.setCustomerValidatos()
        }
      } else {
        this.IsCustomerreq = false
        this.removeCustomerValidatos()
      }
      if (data.IsLeadReq) {
        this.IsLeadreq = true
        if (this.selectedLinkedLeads.length > 0) {
          this.removeLeadValidators()
        } else {
          this.setLeadValidators()
        }
      } else {
        this.IsLeadreq = false
        this.removeLeadValidators()
      }
      if (data.IsOpportunityReq) {
        this.IsOpporeq = true;
        if (this.selectedLinkedOpp.length > 0) {
          this.removeOppoValidators()
          if (this.accountType !== 'Prospect') {
            this.OppOrderEnabledisable()
          }
        } else {
          this.setOppoValidators()
          if (this.accountType !== 'Prospect') {
            this.OppOrderEnabledisable()
          }
        }
      }
      else {
        this.IsOpporeq = false
        this.removeOppoValidators()
      }
      if (data.IsWiproSolnReq) {
        this.IsPotentialreq = true
        if (this.selectedsolution.length > 0) {
          this.removePotentialValidators()
        } else {
          this.setPotentialValidators()
        }
      } else {
        this.IsPotentialreq = false
        this.removePotentialValidators()
      }
    }
  }
  removePotentialValidators() {
    this.newConversationForm.controls['potentialWiproSolution'].markAsUntouched();
    this.newConversationForm.controls['potentialWiproSolution'].clearValidators();
    this.newConversationForm.controls['potentialWiproSolution'].updateValueAndValidity();
  }
  setPotentialValidators() {
    this.newConversationForm.controls['potentialWiproSolution'].setValidators([Validators.required]);
    this.newConversationForm.controls['potentialWiproSolution'].markAsTouched();
    this.newConversationForm.controls['potentialWiproSolution'].updateValueAndValidity();
  }
  removeOppoValidators() {
    this.newConversationForm.controls['linkOpportunity'].markAsUntouched();
    this.newConversationForm.controls['linkOpportunity'].clearValidators();
    this.newConversationForm.controls['linkOpportunity'].updateValueAndValidity();
  }
  setOppoValidators() {
    this.newConversationForm.controls['linkOpportunity'].setValidators([Validators.required]);
    this.newConversationForm.controls['linkOpportunity'].markAsTouched();
    this.newConversationForm.controls['linkOpportunity'].updateValueAndValidity();
  }
  removeLeadValidators() {
    this.newConversationForm.controls['linkLead'].markAsUntouched();
    this.newConversationForm.controls['linkLead'].clearValidators();
    this.newConversationForm.controls['linkLead'].updateValueAndValidity();
  }
  setLeadValidators() {
    this.newConversationForm.controls['linkLead'].setValidators([Validators.required]);
    this.newConversationForm.controls['linkLead'].markAsTouched();
    this.newConversationForm.controls['linkLead'].updateValueAndValidity();
  }
  removeCustomerValidatos() {
    this.newConversationForm.controls['customerContacts'].markAsUntouched();
    this.newConversationForm.controls['customerContacts'].clearValidators();
    this.newConversationForm.controls['customerContacts'].updateValueAndValidity();
  }
  setCustomerValidatos() {
    this.newConversationForm.controls['customerContacts'].setValidators([Validators.required]);
    this.newConversationForm.controls['customerContacts'].markAsTouched();
    this.newConversationForm.controls['customerContacts'].updateValueAndValidity();
  }
  removeCampValidators() {
    this.newConversationForm.controls['linkCampaign'].markAsUntouched();
    this.newConversationForm.controls['linkCampaign'].clearValidators();
    this.newConversationForm.controls['linkCampaign'].updateValueAndValidity();
  }
  setCampValidators() {
    this.newConversationForm.controls['linkCampaign'].setValidators([Validators.required]);
    this.newConversationForm.controls['linkCampaign'].markAsTouched();
    this.newConversationForm.controls['linkCampaign'].updateValueAndValidity();
  }
  removeAccountValidators() {
    this.newConversationForm.controls['accountcompanyName'].markAsUntouched();
    this.newConversationForm.controls['accountcompanyName'].clearValidators();
    this.newConversationForm.controls['accountcompanyName'].updateValueAndValidity();
  }
  setAccountValidators() {
    this.newConversationForm.controls['accountcompanyName'].setValidators([Validators.required])
    this.newConversationForm.controls['accountcompanyName'].markAsTouched();
    this.newConversationForm.controls['accountcompanyName'].updateValueAndValidity();
  }
  conversationFocusout(event) {
    if (event.srcElement.value !== "") {
      if (this.isConversationSearched === true) {
        if (event.srcElement.value === this.conversationName) {
          this.child = true
          this.isConversationSearched = true
        } else {
          this.Conversation_Guid = undefined;
          this.isPrivate = false
          this.child = false
          this.isConversationSearched = false
        }
      }
    }
  }
  privateAccessClose() {
    this.contactTagSwitch = false;
    this.newConversationForm.patchValue({
      contacttag: ''
    })
  }
  // Tag contacts to view conversation
  sendTagToAdvance = []
  appendPrivateAccess(item: any, i) {
    if (i > this.tagContactSearch.length) {
      this.openadvancetabs('TaggedUserSearch', this.tagContactSearch, this.newConversationForm.get('contacttag').value);
      this.privateAccessClose();
    } else {
      var wiproParticipant = item
      var json = { Guid: item.SysGuid, MapGuid: "", FullName: item.FullName, Designation: item.Designation }
      var json1 = { SysGuid: item.SysGuid, MapGuid: "", FullName: item.FullName, Designation: item.Designation, Id: item.SysGuid }
      this.selectedTag.push(json);
      let beforeLength = this.selectedTag.length;
      this.selectedTag = this.service.removeDuplicates(this.selectedTag, "Guid");
      let afterLength = this.selectedTag.length;
      if (beforeLength == afterLength) {
        this.sendTagToAdvance.push(json1)
      }
      this.privateAccessClose()
      // this.newConversationForm.patchValue({
      //   contacttag: ''
      // });
      //this.tagContactSearch = []
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected tag contact already exists")
      }
    }
    this.autoSaveRedishCache();
  }
  delinkTag(id) {
    this.selectedTag = this.selectedTag.filter(res => res.Guid !== id)
    this.sendTagToAdvance = this.sendTagToAdvance.filter(res => res.Guid !== id)
    this.autoSaveRedishCache();
  }
  linkedLeadClose() {
    this.contactleadSwitch = false;
    this.newConversationForm.patchValue({
      linkLead: ''
    })
  }
  // Link leads
  sendLeadToAdvance = [];
  appendLinkedLead(item: any, i) {
    if (i > this.linkedLeads.length) {
      this.openadvancetabs('LinkedLeadsSearch', this.linkedLeads, this.newConversationForm.get('linkLead').value);
      this.linkedLeadClose();
    } else {
      var json = { MapGuid: "", LeadGuid: item.LeadGuid, Title: item.Title }
      var json1 = { MapGuid: "", LeadGuid: item.LeadGuid, Title: item.Title, Id: item.LeadGuid }
      this.selectedLinkedLeads.push(json);
      let beforeLength = this.selectedLinkedLeads.length;
      this.selectedLinkedLeads = this.service.removeDuplicates(this.selectedLinkedLeads, "LeadGuid");
      let afterLength = this.selectedLinkedLeads.length;
      if (beforeLength === afterLength) {
        this.sendLeadToAdvance.push(json1);
      }
      this.linkedLeadClose()
      // this.newConversationForm.patchValue({
      //   linkLead: ''
      // });
      //this.linkedLeads = []
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected lead already exists")
      }
      if (this.selectedLinkedLeads.length > 0 && this.IsLeadreq) {
        this.removeLeadValidators()
      }
    }
    this.autoSaveRedishCache();
  }
  delinkLead(id) {
    this.selectedLinkedLeads = this.selectedLinkedLeads.filter(res => res.LeadGuid !== id)
    this.sendLeadToAdvance = this.sendLeadToAdvance.filter(res => res.LeadGuid !== id)
    if (this.selectedLinkedLeads.length == 0 && this.IsLeadreq) {
      this.setLeadValidators()
    }
    this.autoSaveRedishCache();
  }
  wiproSolutionClose() {
    this.solutionSwitch = false;
    this.newConversationForm.patchValue({
      potentialWiproSolution: ''
    })
  }
  // Potential wipro solutions 
  sendSolnToAdvance = []
  appendWiproSolution(item, i) {
    if (i > this.wiproSolution.length) {
      this.openadvancetabs('PotentialWiproSolutionSearch', this.wiproSolution, this.newConversationForm.get('potentialWiproSolution').value);
      this.wiproSolutionClose();
    } else {
      console.log("inside the event appenfd")
      console.log(item)
      this.solution = item.name;
      let json = { Name: item.Name, SysGuid: item.SysGuid, MapGuid: "" }
      let json1 = { Name: item.Name, SysGuid: item.SysGuid, MapGuid: "", Id: item.SysGuid }
      this.selectedsolution.push(json);
      let beforeLength = this.selectedsolution.length
      this.selectedsolution = this.service.removeDuplicates(this.selectedsolution, "SysGuid");
      let afterLength = this.selectedsolution.length
      if (beforeLength == afterLength) {
        this.sendSolnToAdvance.push(json1);
      }
      this.wiproSolutionClose()
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected  potential wipro solution exists")
      }
      if (this.selectedsolution.length > 0 && this.IsPotentialreq) {
        this.removePotentialValidators()
      }
    }
    this.autoSaveRedishCache();
  }
  linkedOpportunitiesOrderClose() {
    this.contactopportunitySwitch = false;
    this.newConversationForm.patchValue({
      linkOpportunity: ''
    })
  }
  //Link opportunity
  sendOppToAdvance = []
  appendLinkedOpportunity(item, i) {
    if (i > this.linkedOpportunity.length) {
      this.openadvancetabs('LinkedOpportunityOrderSearch', this.linkedOpportunity, this.newConversationForm.get('linkOpportunity').value);
      this.linkedOpportunitiesOrderClose();
    } else {
      var json = { Guid: item.Guid, MapGuid: "", Title: item.Title, Type: item.Type }
      var json1 = { Guid: item.Guid, MapGuid: "", Title: item.Title, Type: item.Type, Id: item.Guid }
      this.selectedLinkedOpp.push(json);
      let beforeLength = this.selectedLinkedOpp.length
      this.selectedLinkedOpp = this.service.removeDuplicates(this.selectedLinkedOpp, "Guid");
      let afterLength = this.selectedLinkedOpp.length
      if (beforeLength == afterLength) {
        this.sendOppToAdvance.push(json1)
      }
      this.linkedOpportunitiesOrderClose()
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected link opportunity already exists")
      }
      if (this.selectedLinkedOpp.length > 0 && this.IsOpporeq) {
        this.removeOppoValidators()
      }
    }
    this.autoSaveRedishCache();
  }
  delinkOpportunity(item) {
    this.selectedLinkedOpp = this.selectedLinkedOpp.filter(res => res.Guid !== item.Guid)
    this.sendOppToAdvance = this.sendOppToAdvance.filter(res => res.Guid !== item.Guid)
    if (this.selectedLinkedOpp.length == 0 && this.IsOpporeq) {
      this.setOppoValidators()
    }
    this.autoSaveRedishCache();
  }
  removeUploadFiles(i) {
    this.service.filesList.splice(i, 1);
  }
  /********  remove upload file code end *****************/
  textareaData: boolean = false
  updateTextarea(value: string) {
    console.log("asdfguagsdufgyuasgdyfgas")
    console.log(this.newConversationForm)
    console.log(value)
    this.autoSaveRedishCache();
    this.textareaData = true;
    if (value.trim() === "") {
      this.newConversationForm.patchValue({ recordMom: '' })
    } else {
      this.newConversationForm.patchValue({ recordMom: value })
    }
  }
  /** SpeechRecognition audio to text Shankar**/
  speechData: string = '';
  activateSpeechSearchMovie(): void {
    this.speechRecognitionService.record()
      .subscribe(
        (value) => {
          this.speechData += value + " ";
          console.log(value);
        },
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            this.activateSpeechSearchMovie();
          }
        },
        //completion
        () => {
          console.log("--complete--");
          console.log("this.speechData", this.speechData);
        });
  }
  /** SpeechRecognition audio to text End**/
  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }
  deleteicon(id) {
    this.selectedsolution = this.selectedsolution.filter(res => res.SysGuid !== id)
    this.sendSolnToAdvance = this.sendSolnToAdvance.filter(res => res.SysGuid !== id)
    if (this.selectedsolution.length == 0 && this.IsPotentialreq) {
      this.setPotentialValidators()
    }
    this.autoSaveRedishCache();
  }
}
@Component({
  selector: 'cancel-pop',
  templateUrl: './cancel-popup.html',
  styleUrls: ['./new-conversation.component.scss']

})
export class cancelpop {
  constructor(
    public dialogRef: MatDialogRef<cancelpop>,
    public newConversationService: newConversationService,
    public routingState: RoutingState,
    private router: Router,
    public service: DataCommunicationService,
    public meetingService: MeetingService) { }
  CachekeyId: string = '';
  activityGroupId: string = ''
  onCancel() {
    this.dialogRef.close();
    var Key
    if (JSON.parse(localStorage.getItem('forMeetingCreation'))) {
      if (this.activityGroupId != '') {
        Key = this.CachekeyId + this.activityGroupId;
      } else {
        Key = this.CachekeyId;
      }
    } else {
      Key = this.CachekeyId;
    }
    this.service.SetRedisCacheData("empty", Key).subscribe(res => {
      console.log(res);
    })
    sessionStorage.removeItem('CreateActivityGroup');
    if (sessionStorage.getItem('selAccountObj')) {
      this.accountSprintThreeModuleBack()
    } else {
      this.activityModuleBack();
    }
  }

  accountSprintThreeModuleBack() {
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/accounts/accountactivities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/accounts/accountactivities/list']);
      } else if (data == 3) {
        this.router.navigate(['/accounts/accountactivities/myactivities']);
      } else if (data == 4) {
        this.router.navigate(['/accounts/accountactivities/Archivedlist']);
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/meetingList']);
    }
  }
  activityModuleBack() {
    let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
    if (lead) {
      if (lead.isMeetingCreate && lead.isMeetingCreate == true) {  
        this.router.navigate(['leads/leadDetails/leadDetailsInfo']);
      } else {
        if (sessionStorage.getItem('actlist')) {
          let data = JSON.parse(sessionStorage.getItem('actlist'))
          if (data == 1) {
            this.router.navigate(['/activities/myactivities']);
          } else if (data == 2) {
            this.router.navigate(['/activities/list']);
          } else if (data == 3) {
            this.router.navigate(['/activities/myactivities']);
          } else if (data == 4) {
            this.router.navigate(['/activities/Archivedlist']);
          }
        } else {
          this.router.navigate(['/activities/activitiesthread/meetingList']);
        }
      }
    } else {
      if (sessionStorage.getItem('actlist')) {
        let data = JSON.parse(sessionStorage.getItem('actlist'))
        if (data == 1) {
          this.router.navigate(['/activities/myactivities']);
        } else if (data == 2) {
          this.router.navigate(['/activities/list']);
        } else if (data == 3) {
          this.router.navigate(['/activities/myactivities']);
        } else if (data == 4) {
          this.router.navigate(['/activities/Archivedlist']);
        }
      } else {
        this.router.navigate(['/activities/activitiesthread/meetingList']);
      }
    }
  }

}

@Component({
  selector: 'activity-pop',
  templateUrl: './activity-pop.html',
})

export class activitypop implements OnInit {
  @ViewChild('accountlist')
  acc: ElementRef;
  ngOnInit(): void {
    this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
      localStorage.setItem('dNBToken', res.ResponseObject.access_token)
    })
    this.create = false;
    this.prospectAccountNavigation();
    this.accountPopulateFromLead();
  }

  accountPopulateFromLead(){
    let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
    if (lead && lead.isMeetingCreate == true) {
      this.ActivityTypeForm.patchValue({ accountName: lead.Account.Name })
      this.AccountSysGuid = lead.Account.SysGuid;
      this.AccName = lead.Account.Name;
      this.isProspect = lead.Account.isProspect;
      this.companyName = lead.Account.Name;
      this.ActivityTypeForm.controls['accountName'].disable();
      this.companyNameClose();
    }
  }
  
  prospectAccountNavigation() {
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
      var sessiondata = JSON.parse(sessionStorage.getItem('CreateActivityGroup'))
      console.log(sessiondata);
      this.ActivityTypeForm.patchValue({ newActivityGroup: sessiondata.activityGroupName, })
      this.activityGroupName = sessiondata.activityGroupName;
      if (sessiondata.account) {
        this.ActivityTypeForm.patchValue({ accountName: sessiondata.account.Name })
        this.AccountSysGuid = sessiondata.account.SysGuid;
        this.AccName = sessiondata.account.Name;
        this.isProspect = sessiondata.account.isProspect;
        this.companyName = sessiondata.account.Name;
        this.companyNameClose();
      } else {
        this.ActivityTypeForm.patchValue({ accountName: "" });
        this.AccountSysGuid = "";
        this.AccName = "";
        this.isProspect = false;
        this.companyName = "";
      }
    } else {
      this.showCompanySwitch = false;
    }
  }

  activityGroupName: string = '';
  inputChange(event) {
    this.activityGroupName = event.target.value;
  }

  arrowkeyLocation = 0;
  ActivityTypeForm: FormGroup;
  ActivityType: any = [];
  companyDetails: any = [];
  isLoading: boolean = false;
  AccountSysGuid: any;
  activityId: any;
  Name: any;
  AccName: any;
  isvalidation: boolean = false;
  create: boolean = false;
  isProspect: boolean = false;
  isAccountNameSearchLoading = false;
  sendAccountToAdvance: any = []
  AccountSelected: any = []

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<activitypop>,
    public fb: FormBuilder,
    private activityService: ActivityService,
    private newconversationService: newConversationService,
    public matSnackBar: MatSnackBar,
    public service: DataCommunicationService,
    public offlineservices: OfflineService,
    public ErrorMessage: ErrorMessage,
    private router: Router,
    private S3MasterApiService: S3MasterApiService,
    public store: Store<AppState>) {
    this.CreateActivityType()
  }
  //------------------------------------advance lookup ts file starts--------------------------------//

  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    isBackbuttonrequired: false,
    IsProspectAccount: true,
    inputValue: '',
    pageNo: 1,
    nextLink: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    errorMsg: {
      isError: false,
      message: ""
    },
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    }
  };
  IdentifyAppendFunc = {
    'accountSearch': (data) => { this.appendAccontName(data) },
  }

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendAccountToAdvance.length > 0) ? this.sendAccountToAdvance : [] }
    }
  }

  // duplicates removed from advance lookup
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountSearch': {
        return this.AccountSelected = [], this.sendAccountToAdvance = []
      }
    }
  }

  //---------------------------------advance lookup ts file ends-------------------------------//
  /****************Advance search popup starts**********************/

  lookUpColumn(controlName, value) {
    this.lookupdata.isBackbuttonrequired = true;
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = activityAdvnHeaders[controlName]
    this.lookupdata.lookupName = activityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = activityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = activityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookUpColumn(controlName, value)
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.activityService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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
      if (x.objectRowData.wiprodb) {
        this.lookUpColumn(controlName, value)
        this.activityService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
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
          this.lookupdata.otherDbData.isLoader = false;
        })
      } else {
        this.lookupdata.controlName = controlName
        this.lookupdata.headerdata = activityAdvnHeaders['DnBAccountHeader']
        this.lookupdata.lookupName = activityAdvnNames[controlName]['name']
        this.lookupdata.isCheckboxRequired = activityAdvnNames[controlName]['isCheckbox']
        this.lookupdata.Isadvancesearchtabs = activityAdvnNames[controlName]['isAccount']
        this.lookupdata.inputValue = value;
        this.dnBDataBase(x);
      }
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 100);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result != 'backclicked') {
          if (result.wiprodb == false) {
            this.service.sendProspectAccount = true;
            this.groupData(result);
            this.router.navigateByUrl('/activities/prospectAccount');
            this.dialogRef.close();
          } else {
            console.log(result)
            this.populateActivityCreate(result.selectedData[0].Name, result.selectedData[0].SysGuid, result.selectedData[0].isProspect);
            this.emptyArray(result.controlName);
            this.AppendParticularInputFun(result.selectedData, result.controlName)
          }
        }
        if (result == 'backclicked') {
          this.populateActivityCreate(this.AccName, this.AccountSysGuid, this.isProspect)
        }
      }
      if (result == "") {
        sessionStorage.removeItem('CreateActivityGroup');
      }
    });
  }
  populateActivityCreate(accntName, sysGuid, isProspect) {
    var object = {
      activityGroupName: (this.ActivityTypeForm.value.newActivityGroup) ? this.ActivityTypeForm.value.newActivityGroup != "" ? this.ActivityTypeForm.value.newActivityGroup : "" : "",
      account: {
        Name: (accntName) ? accntName == undefined ? "" : accntName : "",
        SysGuid: (sysGuid) ? sysGuid == undefined ? "" : sysGuid : "",
        isProspect: (isProspect) ? this.isProspect : false
      },
      model: 'Add meeting',
      route: 'activities/newmeeting'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
    this.dialog.open(activitypop, {
      disableClose: true,
      width: '500px',
    });
  }
  dnBDataBase(action) {
    if (action.action == "dbAutoSearch") {
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getCountryData({ isService: true, searchKey: action.objectRowData.searchKey }).subscribe(res => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
          console.log("country", res.ResponseObject)
          this.lookupdata.otherDbData.countryvalue = res.ResponseObject;
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    }
    if (action.action == "dbSearch") {
      let body = {
        "CustomerAccount": {
          "Name": action.objectRowData.dbSerachData.accountname.value,
          "Address": { "CountryCode": action.objectRowData.dbSerachData.countryvalue.id }
        }
      }
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
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
        this.lookupdata.otherDbData.isLoader = false;
      })
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

  getCommonData() {
    return {
      isProspect: this.isProspect,
    }
  }

  groupData(result) {
    console.log("prospect account", result)
    var object = {
      activityGroupName: (this.ActivityTypeForm.value.newActivityGroup) ? this.ActivityTypeForm.value.newActivityGroup != "" ? this.ActivityTypeForm.value.newActivityGroup : "" : "",
      account: {
        Name: (result.selectedData.length != 0) ? (result.selectedData[0].Name) ? result.selectedData[0].Name : "" : "",
        Id: (result.selectedData.length != 0) ? (result.selectedData[0].Id) ? result.selectedData[0].Id : "" : "",
        Industry: (result.selectedData.length != 0) ? (result.selectedData[0].Industry) ? result.selectedData[0].Industry : "" : "",
        Region: (result.selectedData.length != 0) ? (result.selectedData[0].Region) ? result.selectedData[0].Region : "" : ""
      },
      model: 'Add meeting',
      route: 'activities/newmeeting'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }

  /*****************Advance search popup ends*********************/
  onNoClick(): void {
    sessionStorage.removeItem('CreateActivityGroup');
    document.getElementsByTagName('body')[0].classList.remove("active");
    this.dialogRef.close();
  }
  get f() {
    return this.ActivityTypeForm.controls
  }
  CreateActivityType() {
    this.ActivityTypeForm = this.fb.group({
      newActivityGroup: ['', Validators.compose([Validators.required, removeSpaces, , checkLimit(101)])], //this.noWhitespaceValidator
      accountName: ['', Validators.required]
    })
  }

  clickAccountData() {
    if ((this.ActivityTypeForm.value.accountName == "" || this.ActivityTypeForm.value.accountName == undefined) && this.showCompanySwitch) {
      this.isAccountNameSearchLoading = true;
      this.companyDetails = []
      this.newconversationService.getsearchAccountCompany('').subscribe(res => {
        this.isAccountNameSearchLoading = false;
        this.isLoading = false;
        if (res.IsError === false) {
          this.companyDetails = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(res.Message);
          this.companyDetails = []
        }
        console.log("getsearchAccName", res)
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.companyDetails = []
      });
    }
  }

  getAccountName(val) {
    if (val != "") {
      this.isAccountNameSearchLoading = true;
      this.companyDetails = []
      this.newconversationService.getsearchAccountCompany(val).subscribe(res => {
        this.isAccountNameSearchLoading = false;
        this.companyDetails = [];
        this.isLoading = false;
        if (res.IsError === false) {
          this.companyDetails = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(res.Message);
          this.companyDetails = []
        }
        console.log("getsearchAccName", res)
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.companyDetails = []
      });
    } else {
      this.AccountSysGuid = undefined;
      this.showCompanySwitch = false;
      this.companyDetails = [];
    }
  }

  CreateActivity() {
    if (this.activityGroupName.trim() === '') {
      this.ActivityTypeForm.patchValue({ newActivityGroup: '' });
      this.ActivityTypeForm.controls['newActivityGroup'].setValidators(Validators.required);
      this.ActivityTypeForm.controls['newActivityGroup'].markAsTouched();
      this.ActivityTypeForm.controls['newActivityGroup'].updateValueAndValidity();
    }
    if (this.AccName != this.ActivityTypeForm.value.accountName) { this.companyNameClose() }
    if (this.ActivityTypeForm.valid === false) {
      this.service.validateAllFormFields(this.ActivityTypeForm);
    }
    if (this.ActivityTypeForm.valid === true && this.ActivityTypeForm.get('newActivityGroup').errors == null) {
      this.create = true;
      const body = {
        "Name": this.activityGroupName.trim(),
        "ActivityType": { "Id": 0 },
        "Account": { "SysGuid": this.AccountSysGuid, "Name": this.AccName, "isProspect": this.isProspect },
      }
      console.log(body);
      this.newconversationService.getCreateActivityGroup(body).subscribe(async res => {
        console.log('createactiviyugroup', res);
        if (res.IsError === false) {
          this.isvalidation = false;
          console.log('create activity', res);
          this.ErrorMessage.throwError(res.Message)
          await this.offlineservices.ClearActivityIndexTableData()
          await this.offlineservices.ClearMyactivityIndexTableData()
          this.store.dispatch(new ClearActivity())
          sessionStorage.removeItem('CreateActivityGroup');
          this.dialogRef.close(res.ResponseObject);
        }
        if (res.IsError === true) {
          this.ErrorMessage.throwError(res.Message)
        }
      })
    }
  }

  appendActivityType(event: Event) {
    let selectElementValue = event.target['options']
    [event.target['options'].selectedIndex].text;
    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.activityId = +selectElementId;
    this.Name = selectElementValue

    console.log(this.activityId);
  }
  appendActivityWebType(event) {
    this.activityId = event.value;
    this.Name = event.triggerValue
    console.log(this.activityId);
  }
  companyName: string;
  showCompany: boolean;
  showCompanySwitch: boolean = true;
  companyNameClose() {
    this.showCompanySwitch = false;
    if (this.AccountSysGuid === undefined) {
      this.ActivityTypeForm.patchValue({ accountName: '' })
    }
    if (this.AccName != '') { this.ActivityTypeForm.patchValue({ accountName: this.AccName }) }
  }

  appendAccontName(item) {
    // this.newconversationService.ValidateAccount(item.SysGuid, item.isProspect, 0).subscribe(res => {
    //   console.log(res.ResponseObject);
    //   if (res.IsError) {
    //     this.ErrorMessage.throwError(res.Message)
    //     this.AccountSysGuid = undefined;
    //     this.ActivityTypeForm.patchValue({
    //       accountName: ""
    //     })
    //     this.acc.nativeElement.value = ''
    //   } else {
    // this.ValidateAccount = res.ResponseObject.IsAccess;
    this.AccountSysGuid = item.SysGuid;
    this.AccName = item.Name;
    this.isProspect = item.isProspect;
    this.companyName = item.Name;
    this.ActivityTypeForm.patchValue({
      accountName: this.companyName
    })
    this.showCompanySwitch = false;
    //   }
    // }, error => {
    //   this.companyDetails = []
    //   this.AccountSysGuid = undefined;
    //   this.ActivityTypeForm.patchValue({
    //     accountName: ""
    //   })
    //   this.acc.nativeElement.value = ''
    // })
  }

  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }
}



@Component({
  selector: 'create-pop',
  templateUrl: './create-conversation-pop.html',
})
export class createConversationpopComponent {

  data: any;
  child: string;
  post: boolean;
  id: any;
  name: any;
  constructor(private offlineService: OfflineService,
    private dialog: MatDialog,
    private threadListService: threadListService,
    private onlineOfflineService: OnlineOfflineService,
    private router: Router,
    public dialogRef: MatDialogRef<createConversationpopComponent>,
    private routingState: RoutingState,
    private conversationService: ConversationService,
    public service: DataCommunicationService,
    private encrDecrService: EncrDecrService) {
  }
  ngOnInit() {
  }
  async onOkClick() {
    sessionStorage.removeItem('CreateActivityGroup');
    let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
    if (lead) {
      if (lead.isMeetingCreate && lead.isMeetingCreate == true) {  
        this.router.navigate(['leads/leadDetails/leadDetailsInfo']);
      }  else {
        this.router.navigate(['/activities/activitiesthread/meetingList']);
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/meetingList']);
    }
    this.dialogRef.close();
  }
  close() {
    sessionStorage.removeItem('CreateActivityGroup');
    console.log(this.post);
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/activities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/activities/list']);
      } else if (data == 3) {
        this.router.navigate(['/home/dashboard']);
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/meetingList']);
    }
  }
}

@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
})
export class cancelpopeditComponent {

  constructor(private dialogRef: MatDialog, ) {

  }
  closeallpop() {
    this.dialogRef.closeAll();
  }
}


@Component({
  selector: 'delete-attach-pop',
  templateUrl: './delete-attach-pop.html',
  styleUrls: ['./new-conversation.component.scss'],
})

export class deleteAttachPopUp {
  constructor(private dialogRef: MatDialog, public dialog: MatDialogRef<deleteAttachPopUp>) {

  }
  okClicked() {
    this.dialog.close({ 'OK': true });
  }
  closeallpop() {
    this.dialog.close({ 'OK': false });
  }
}