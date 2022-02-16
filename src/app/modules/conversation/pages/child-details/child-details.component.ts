import { ResponseObject } from './../../../../core/interfaces/wipro-contacts';
import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { threadListService, ConversationService, OfflineService, OnlineOfflineService, ErrorMessage, ContactleadService, actionListService } from '@app/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MasterApiService, } from '@app/core/services/master-api.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { newConversationService, NewActivityHeaders, NewActivityAdvNames } from '@app/core/services/new-conversation.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { removeSpaces, DescrLimit, checkLimit } from '@app/shared/pipes/white-space.validator';
import { MeetingFavorite, MeetingDetailsEdit, LoadMeetingDetailsById, UpdateMeetingDetails, ClearActivity, ClearActivityDetails, ClearMeetingList } from '@app/core/state/actions/activities.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getMeetingDetailsById } from '@app/core/state/selectors/activity/activity.selector';
import { ActivityService, activityAdvnHeaders, activityAdvnNames, Navigationroutes } from '@app/core/services/activity.service';
import { SpeechRecognitionService } from '@app/core/services/speech-recognition-service';
import { NewMeetingService } from '@app/core/services/new-meeting.service';
import { environment as env } from '@env/environment';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import moment from 'moment';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
declare let SpeechSDK: any;
export interface CustomerContacts {
  FullName: string,
  Email: string,
  isKeyContact: boolean,
  Guid: string,
  MapGuid: string,
  LinkActionType: number
}
export interface WiproContact {
  FullName: string,
  Designation: string,
  MapGuid: string,
  SysGuid: string
  LinkActionType: number
}
export interface ConversationTag {
  SysGuid: string,
  MapGuid: string,
  FullName: string
  Designation: string
  LinkActionType: number
}
export interface Opportunity {
  MapGuid: string,
  OpporGuid: string
  Title: string
  LinkActionType: string
}

export interface Lead {
  MapGuid: string,
  LeadGuid: string,
  Title: string
  LinkActionType: number
}

export interface Attachment {
  Guid: string,
  Name: string,
  Url: string
}

export interface Campaign {
  Id: string,
  MapGuid: string,
  Name: string
  LinkActionType: number
}

export interface Potential {
  MapGuid: string,
  SysGuid: string,
  Name: string,
  LinkActionType: number
}

export interface OrderOpp {
  SysGuid: string,
  Title: string,
  MapGuid: string,
  Type: string,
  LinkActionType: number
}

@Component({
  selector: 'app-child-details',
  templateUrl: './child-details.component.html',
  styleUrls: ['./child-details.component.scss']
})
export class ChildDetailsComponent implements OnInit, OnDestroy {
  noneditpart = true;
  editpart = false;
  conversationType: any;
  customerContactSearch: any;
  id: any;
  consent = true;
  wiprocontactsearch: any = [];
  tagContactSearch: any;
  linkedLeads: any = [];
  showmore: boolean = false;
  linkedOpportunity: any = [];
  agendaview = true;
  emailview = false;
  childDetails: any = [];
  companyNameSearch: Array<any>;
  wiproSolution: any = [];
  value: any;
  childConversationEditForm: FormGroup;
  MeetingDetailsSate$: Subscription
  selectedCustomer: CustomerContacts[] = [];
  selectedContact: WiproContact[] = [];
  selectedTag: ConversationTag[] = [];
  selectedLinkedLeads: Lead[] = [];
  selectedLinkedOpp: OrderOpp[] = [];
  Appointment_Guid: any;
  showContact: boolean = false;
  contactNameSwitch: boolean = false;
  selectedAccount: any;
  isFormSaved: boolean = false;
  showCustomer: boolean = false;
  customerNameSwitch: boolean = false;
  showTag: boolean = false;
  contactTagSwitch: boolean = false;
  attachments: Attachment[] = [];
  showConversationaccount: boolean = false;
  Conversationaccount: string = "";
  showContacttag: boolean = false;
  contactNameSwitchtag: boolean = false;
  selectedsolution: Potential[] = [];
  today = new Date();
  MeetingDetails: any;
  momToBind: any;
  activityTypeList: any;
  campaignContact: any = [];
  selectedcampaign = [];
  archived: string;
  isLoading: boolean = false;
  searchConversationList: any = [];
  selectedGroupId: string = ""
  showConversation: boolean = false;
  Conversation: string = "";
  ConversationNameSwitch: boolean = false;
  accntCompanyDetails: any;
  activityTypeId: any;
  activityGroupId: string = ""
  isCustomerParticipantLoading: boolean = false;
  editedCustomerContact: Array<any> = [];
  editedWiproParticiapnt: Array<any> = [];
  editedTagUser: Array<any> = [];
  editedWiproSolution: Array<any> = [];
  editedCampaign: Array<any> = [];
  editedLead: Array<any> = [];
  editOppOrder: Array<any> = [];
  editedAttachment: Array<any> = []
  isDetailsLoading: boolean = false
  isWiproParticipantLoading: boolean = false;
  isTagContactToViewMeetingSearchLoading: boolean = false;
  isPotentialWiproSoluctionSearchLoading: boolean = false;
  isLinkedCampaignsSearchLoading: boolean = false;
  isLinkedOpportunitySearchLoading: boolean = false;
  isLinkedLeadsSearchLoading: boolean = false;
  isActivityGroupNameLoading: boolean = false;
  TempMeetingDetails: any
  arrowkeyLocation = 0;
  yearDateValidation: any;
  activityTypeName: any = ''
  IsPivotal: boolean = false;
  status: boolean = false;
  showContent: boolean = false;
  sendFinalStartDate: any;
  sendFinalEndDate: any;
  durationToBind: any = '00';
  totalMinutesToSend: any;
  isProspectAccount: boolean = false;
  isMobileDevice : boolean = false;
  accountType: string ='';
  maxDate : any;
  Orinator: any;
  activityGroupName : string = '';
  startDetail : any;
  endDetail : any;
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    isBackbuttonrequired: false,
    IsProspectAccount : false,
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
  LeadGuid: any;
  commentindex = -1
  nonEditcommmentView: boolean = false;
  editCommnetIndex = -1
  editcommmentView: boolean = false;
  flagC = "";
  isCommentEmpty = false;
  accountValidation: boolean = false;
  startDateandtime: any;
  endDateandtime: any;
  IsAccountreq: boolean = false;
  IsCampaignreq: boolean = false;
  IsCustomerreq: boolean = false;
  IsLeadreq: boolean = false;
  IsOpporeq: boolean = false;
  IsPotentialreq: boolean = false;
  customerMessage: boolean = false;
  wiproMessage: boolean = false;
  play: boolean = false;
  recordingPoPUp: boolean = false;
  recognizer;
  selectedActivities: {}[] = [];
  contactcampaign: string;
  linkedcampaignSwitch: boolean = true;
  solutionSwitch: boolean = true;
  sendSolnToAdvance = [];
  sendCustomerToAdvance = [];
  sendwiproToAdvance = [];
  sendTagToAdvance = [];
  sendLeadToAdvance = [];
  sendOppToAdvance = [];
  contactopportunity: string;
  contactopportunityswitch: boolean = false;
  textareaData: boolean = false;
  speechData: string = '';
  addComments = true;
  isDadateChangerequired: boolean = false;

  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public encrDecrService: EncrDecrService,
    public masterApi: MasterApiService,
    private router: Router,
    private fb: FormBuilder,
    private conversationService: ConversationService,
    private newconversationService: newConversationService,
    public actionListService: actionListService,
    public matSnackBar: MatSnackBar,
    public routingState: RoutingState,
    private onlineofflineService: OnlineOfflineService,
    private snackBar: MatSnackBar,
    private ErrorMessage: ErrorMessage,
    private offlineService: OfflineService,
    private meetingService: threadListService,
    private meetingApi: MeetingService,
    private ActivityDetails: ActivityService,
    private speechRecognitionService: SpeechRecognitionService,
    public datepipe: DatePipe,
    private leadservice: ContactleadService,
    private newMeetingService: NewMeetingService,
    public store: Store<AppState>,
    private fileService: FileUploadService,
    private cacheDataService: CacheDataService,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService,public envr : EnvService) {
    this.createEditMeetingForm();
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
    this.yearDateValidation = new Date(1980, 1, 1);
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year+1, month, currentDate);
    this.leadservice.attachList = []
    this.archived = sessionStorage.getItem('archivedStatus')
    if (this.archived == "true") {
      this.status = true
    }
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem("MeetingListRowId")), 'DecryptionDecrip');
    this.Orinator = localStorage.getItem('upn')
    
    this.conversationService.setEmailSubject = '';
    this.conversationService.shareToSend = '';
    this.checkForStoreData()
    if (sessionStorage.getItem('CreateActivityGroup')) { 
      var data = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
      if (data.model == "Edit activity") {
        this.onclickCreateActivityGroup();
      }
      if (data.isEditMeeting == true) {
        this.onclickCreateActivityGroup();
      }
    }
  }

  createEditMeetingForm() {
    this.childConversationEditForm = this.fb.group({
      conversationName: ['', Validators.compose([Validators.required])],
      conversationType: ['', Validators.required],
      activityType: ['', Validators.required],
      meetingId: new FormControl({ value: '', disabled: true }),
      // datecreated: ['', Validators.required],
      Duration: new FormControl({ value: '00', disabled: true }),
      StartDate: ['', Validators.required],
      startTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      endTime: ['', Validators.required],
      accountCompanyname: new FormControl({ value: 'account', disabled: true }),
      potentialWiproSolutions: [''],
      access: [true, Validators.required],
      agenda: ['', Validators.compose([Validators.required, checkLimit(101), removeSpaces])],
      haveConsent: [false],
      recordTypeSubject: ['', Validators.compose([DescrLimit(2001)])],
      customerParticipant: ['', Validators.required],
      wiproParticipant: ['', Validators.required],
      tagToView: [''],
      linkLeads: [''],
      linkCampaign: [''],
      attachment: [''],
      linkOpportunity: ['', { disabled: this.isProspectAccount }],
      comments: ['']
    }, { validator: this.dateLessThan('StartDate', 'EndDate', 'startTime', 'endTime') })
    this.childConversationEditForm.get('recordTypeSubject').valueChanges.subscribe(res => {
      if (res.trim() === "") {
        console.log("MOM")
        this.childConversationEditForm.get('recordTypeSubject').patchValue('', { emitEvent: false });
      }
    })
    this.childConversationEditForm.get('comments').valueChanges.subscribe(res => {
      if (res.trim() === "") {
        console.log("comments")
        this.childConversationEditForm.get('comments').patchValue('', { emitEvent: false });
      }
    })
    this.onChnages();
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
        this.dateConverterValues(srartDateValue, endDateValue)
        if (new Date(srartDateValue).getTime() > new Date(endDateValue).getTime()) {
          this.durationToBind = "00";
          return { 'endDate': 'End date time should be greater than start date time' }
        }
      }
    }
  }

  inputChange(event) {
    this.activityGroupName = event.target.value;
  }

  dateConverterValues(srartDateValue, endDateValue) {
    var finalStartDate = moment(srartDateValue).local().format();
    var finalEndDate = moment(endDateValue).local().format();
    var date1 = new Date(finalEndDate)
    var date2 = new Date(finalStartDate)
 
    console.log("this.startDetail",this.startDetail);
    console.log("this.endDetail",this.endDetail);
    this.sendFinalStartDate = srartDateValue;
    this.sendFinalEndDate = endDateValue;
    var difference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
    var diffSeconds = Math.floor(difference) % 60 < 10 ? "0" + Math.floor(difference) % 60 : Math.floor(difference) % 60;
    var diffMinutes = Math.floor(difference / 60) % 60 < 10 ? "0" + Math.floor(difference / 60) % 60 : Math.floor(difference / 60) % 60;
    var diffHours = Math.floor(difference / 3600) % 24 < 10 ? "0" + Math.floor(difference / 3600) % 24 : Math.floor(difference / 3600) % 24;
    var diffDays = Math.floor(difference / 86400) < 10 ? "0" + Math.floor(difference / 86400) : Math.floor(difference / 86400);

    this.durationToBind = this.service.getDuration(diffDays,diffHours,diffMinutes);
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

  focusOutFunctionForStartDate(event) {
    this.childConversationEditForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForEndDate(event) {
    this.childConversationEditForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForStartTime(event) {
    this.childConversationEditForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForEndTime(event) {
    this.childConversationEditForm.patchValue({ Duration: this.durationToBind })
  }

  onChnages() {
    this.childConversationEditForm.get('conversationName').valueChanges.subscribe(val => {
        if (this.childConversationEditForm.get('conversationName').dirty) {
          this.isActivityGroupNameLoading = true;
          this.searchConversationList = []
          this.meetingApi.searchActivityGroup(val).subscribe(data => {
            this.isActivityGroupNameLoading = false;
            if (data.IsError === false) {
              this.searchConversationList = data.ResponseObject
            } else {
              this.ErrorMessage.throwError(data.Message);
              this.searchConversationList = []
            }
          }, error => {
            this.isActivityGroupNameLoading = false;
            this.searchConversationList = []
          })
        }
    })
    this.childConversationEditForm.get('potentialWiproSolutions').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('potentialWiproSolutions').dirty && this.solutionSwitch) { 
        this.isPotentialWiproSoluctionSearchLoading = true;
        this.wiproSolution = []
        this.newconversationService.getWiproSolution(val).subscribe(res => {
          this.isPotentialWiproSoluctionSearchLoading = false;
          if (res.IsError === false) {
            this.wiproSolution = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else {
            this.ErrorMessage.throwError(res.Message);
            this.wiproSolution = []
          }
        }, error => {
          this.isPotentialWiproSoluctionSearchLoading = false;
          this.wiproSolution = []
        })
      }
    });

    this.childConversationEditForm.get('customerParticipant').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('customerParticipant').dirty && this.customerNameSwitch) { 
      this.isCustomerParticipantLoading = true;
      this.customerContactSearch = [];
        this.meetingApi.searchCustomerparticipants(val, this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(
          data => {
            this.isCustomerParticipantLoading = false;
            if (data.IsError === false) {
              this.customerContactSearch = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.ErrorMessage.throwError(data.Message)
            }
          }
        )
        }
    });

    this.childConversationEditForm.get('wiproParticipant').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('wiproParticipant').dirty && this.contactNameSwitch) { 
        this.isWiproParticipantLoading = true;
        this.wiprocontactsearch = []
        this.newconversationService.searchUser(val).subscribe(data => {
          this.isWiproParticipantLoading = false;
          if (data.IsError === false) {
            this.wiprocontactsearch = data.ResponseObject;
            this.lookupdata.TotalRecordCount = data.TotalRecordCount;
            this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
          } else {
            this.ErrorMessage.throwError(data.Message);
            this.wiprocontactsearch = []
          }
        }, error => {
          this.isWiproParticipantLoading = false;
          this.wiprocontactsearch = []
        })
      }
    });

    this.childConversationEditForm.get('tagToView').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('tagToView').dirty && this.contactTagSwitch) { 
        this.isTagContactToViewMeetingSearchLoading = true;
        this.tagContactSearch = []
        this.newconversationService.searchUser(val).subscribe(
          data => {
            if (data.IsError === false) {
              this.isTagContactToViewMeetingSearchLoading = false;
              this.tagContactSearch = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.ErrorMessage.throwError(data.Message);
              this.tagContactSearch = []
            }
          }, error => {
            this.isTagContactToViewMeetingSearchLoading = false;
            this.tagContactSearch = []
          })
        }
    });

    this.childConversationEditForm.get('linkLeads').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('linkLeads').dirty && this.contactTagSwitch) { 
        this.isLinkedLeadsSearchLoading = true;
        this.linkedLeads = []
        this.meetingApi.SearchLeadBasedOnAccount(this.accntCompanyDetails.SysGuid, val, this.accntCompanyDetails.isProspect).subscribe(
          data => {
            this.isLinkedLeadsSearchLoading = false;
            if (data.IsError === false) {
              this.linkedLeads = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.ErrorMessage.throwError(data.Message)
              this.linkedLeads = []
            }
          }, error => {
            this.isLinkedLeadsSearchLoading = false;
            this.linkedLeads = []
          })
        }
    });

    this.childConversationEditForm.get('linkOpportunity').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('linkOpportunity').dirty && this.contactopportunityswitch) { 
        this.isLinkedOpportunitySearchLoading = true;
        this.linkedOpportunity = []
        this.meetingApi.SearchOrderAndOppBasedOnAccount(this.accntCompanyDetails.SysGuid, val, this.accntCompanyDetails.isProspect).subscribe(
          data => {
            this.isLinkedOpportunitySearchLoading = false;
            if (data.IsError === false) {
              this.linkedOpportunity = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.ErrorMessage.throwError(data.Message);
              this.linkedOpportunity = []
            }
          }, error => {
            this.isLinkedOpportunitySearchLoading = false;
            this.linkedOpportunity = []
          })
        }
    });

    this.childConversationEditForm.get('linkCampaign').valueChanges.subscribe(val => {
      if (this.childConversationEditForm.get('linkCampaign').dirty && this.linkedcampaignSwitch) { 
      if (this.activityGroupId != '') {
        this.isLinkedCampaignsSearchLoading = true;
        this.campaignContact = []
        this.newconversationService.campaignBasedOnAccount(val, this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(data => {
          this.isLinkedCampaignsSearchLoading = false;
          if (data.IsError === false) {
            this.campaignContact = data.ResponseObject;
            this.lookupdata.TotalRecordCount = data.TotalRecordCount;
            this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
          } else {
            this.ErrorMessage.throwError(data.Message);
            this.campaignContact = []
          }
        }, error => {
          this.isLinkedCampaignsSearchLoading = false;
          this.campaignContact = []
        })
      }
    }
    });
  }

  get f() {
    return this.childConversationEditForm.controls
  }

  getActivityType() {
    this.masterApi.getActivity().subscribe(res => {
      if (!res.Error) {
        this.activityTypeList = res.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Name) });
      } else {
        this.ErrorMessage.throwError(res.Message)
      }
    }, error => {
      console.log(error)
    })
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

  utcToLocalDate(data) {
    return this.datepipe.transform(moment(data).local().format().toString(), 'dd-MMM-y')
  }

  UtcToLocalTime(data) {
    return moment(data).local().format("hh:mm A")
  }

  async checkForStoreData() {
    this.MeetingDetailsSate$ = this.store.pipe(select(getMeetingDetailsById(this.id))).subscribe(res => {
      this.actionListService.meetingDetailsInfo = res // Getting the meeting details info
      if (res) {
        console.log("im insid ethe edit details!!!!")
        this.TempMeetingDetails = res
        this.startDateandtime = this.UtcToLocalTime(res.ScheduleStart);
        this.endDateandtime = this.UtcToLocalTime(res.EndDate);
        this.MeetingDetails = { ...res,Account : {Name : decodeURIComponent(res.Account.Name),SysGuid: res.Account.SysGuid,isProspect: res.Account.isProspect} },
        this.status = this.MeetingDetails.IsArchived;
        this.accntCompanyDetails = this.MeetingDetails.Account;
        this.Conversation = this.MeetingDetails.ActivityGroup.Name;
        this.startDetail =this.utcToLocalDate(this.MeetingDetails.ScheduleStart);
        this.endDetail = this.utcToLocalDate(this.MeetingDetails.EndDate);
        this.dateConverterValues(res.ScheduleStart, res.EndDate);
        this.accountValidation = this.MeetingDetails.isUserCanEdit
        this.IsPivotal = this.MeetingDetails.IsPivotal
        // this.daService.iframePage = 'MEETING_DETAILS';
    let bodyDA = {
      page: 'MEETING_DETAILS',
      meetingGuid: this.id,
      accountId: this.MeetingDetails.Account.SysGuid
    };
    this.assistantGlobalService.setMeetingDetails(bodyDA)
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
        sessionStorage.setItem("shareConversation", JSON.stringify(this.shareobject(this.MeetingDetails)));
      } else {
        this.getChildconversationDetails();
      }
    })
    if (!this.onlineofflineService.isOnline) {
      const CacheResponse = await this.ActivityDetails.getActivityDetailsOfflineById(this.id)
      if (CacheResponse) {
        this.startDateandtime = this.UtcToLocalTime(CacheResponse.data.ScheduleStart);
        this.endDateandtime = this.UtcToLocalTime(CacheResponse.data.EndDate);
        this.MeetingDetails = { ...CacheResponse.data }
        this.status = this.MeetingDetails.IsArchived;
        this.startDetail =this.utcToLocalDate(this.MeetingDetails.ScheduleStart);
        this.endDetail = this.utcToLocalDate(this.MeetingDetails.EndDate);
        this.dateConverterValues(CacheResponse.data.ScheduleStart, CacheResponse.data.EndDate);
        sessionStorage.setItem("shareConversation", JSON.stringify(this.shareobject(this.MeetingDetails)));
      } else {
        this.getChildconversationDetails();
      }
    }
  }

  wiproSolutionData(data: string) {
    return data.replace(/ *\([^)]*\) */g, "");
  }

  IdentifyAppendFunc = {
    'CustomerContactSearch': (data) => { this.appendCustomerParticipant(data, 0) },
    'LinkedLeadsSearch': (data) => { this.appendLinkedLead(data, 0) },
    'LinkedOpportunityOrderSearch': (data) => { this.appendOpportunitiesOrder(data, 0) },
    'WiproParticipantSearch': (data) => { this.appendWiproParticipant(data, 0) },
    'TaggedUserSearch': (data) => { this.appendPrivateAccess(data, 0) },
    'PotentialWiproSolutionSearch': (data) => { this.appnedWiproSolution(data, 0) },
    'LinkedCampaignSearch': (data) => { this.appendLinkedCampaign(data, 0) }
  }

  clickToCampaign() {
    if (sessionStorage.getItem('RequestCampaign')) {
      let data = JSON.parse(sessionStorage.getItem('RequestCampaign'));
      sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...data, navigation: this.router.url }));
      sessionStorage.removeItem('campaignCacheData');
    } else {
      sessionStorage.setItem('RequestCampaign', JSON.stringify({ Account: this.accntCompanyDetails.Name ,AccountSysGuid: this.accntCompanyDetails.SysGuid,Name: this.Conversation,isAccountPopulate: true,isProspect:this.accntCompanyDetails.isProspect, navigation: this.router.url }));
    }
    this.router.navigateByUrl('/campaign/RequestCampaign');
  }

  clickToAction() {
    var data = JSON.parse(sessionStorage.getItem('shareConversation'));
    sessionStorage.setItem('shareConversation', JSON.stringify({...data,detailChild: true}));
    sessionStorage.setItem('actlist',JSON.stringify(10));
    this.router.navigate(['/activities/newaction'])
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
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = NewActivityHeaders[controlName]
    this.lookupdata.lookupName = NewActivityAdvNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = NewActivityAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = NewActivityAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(controlName);
    this.newconversationService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
      this.lookupdata.tabledata = res 
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
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
      this.contactTagSwitch = false;
      this.solutionSwitch = false;
      this.linkedcampaignSwitch = false;
      this.contactNameSwitchtag = false;
      this.arrowkeyLocation = 0;
      this.contactopportunityswitch = false;
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
      guid: (this.accntCompanyDetails) ? (this.accntCompanyDetails.SysGuid) ? this.accntCompanyDetails.SysGuid : '' : '',
      isProspect: (this.accntCompanyDetails) ? (this.accntCompanyDetails.isProspect) ? this.accntCompanyDetails.isProspect : false : false,
    }
  }
  /*****************Advance search popup ends*********************/
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '-');
  }

  getChildconversationDetails() {
    let meetingDetaislReq = {
      "Guid": this.id
    }
    this.isDetailsLoading = true
    this.meetingService.GetMeetingDetails(meetingDetaislReq).subscribe(data => {
      this.isDetailsLoading = false
      if (!data.IsError) {
        let MeetingDetailsState = { ...data.ResponseObject, id: data.ResponseObject.Guid }
        this.accountValidation = data.ResponseObject.isUserCanEdit;
        this.store.dispatch(new LoadMeetingDetailsById({ Load_Meetingdetails: MeetingDetailsState }))
      } else {
        this.ErrorMessage.throwError(data.Message)
      }
    }, error => {
      this.isDetailsLoading = false
    })
  }

  additem(item) {
    this.showContent = false;
  }

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  onClickCancel(): void {
    const dialogRef = this.dialog.open(cancelpopComponent1, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("after close", res)
      if (res === true) {
        this.checkForStoreData();
        this.showContent = false;
        this.service.windowScroll()
        this.resetCacheData()
        this.noneditdetails()
      }
    })
  }

  openopportunity() {
    const dialogRef = this.dialog.open(opportunityconvercomponent,
      {
        width: '396px',
        height: 'auto',
        data: this.MeetingDetails
      });
    dialogRef.afterClosed().subscribe(res => {
      console.log('res', res)
      if (res != '') {
        if (res.includes('prospectAccount')) {
          localStorage.setItem('prospectaccountid', this.MeetingDetails.Account.SysGuid)
        }
        else {
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(this.MeetingDetails));
        }
        this.router.navigateByUrl(res)
      }
    })
  }

  markAsPivotal(bool: boolean) {
    let pivotalObject = {
      "Appointment_Guid": this.MeetingDetails.Guid,
      "IsPivotal": (bool) ? false : true
    }
    this.conversationService.markConversationAsPivotal(pivotalObject).subscribe((res) => {
      console.log('Meeting is marked as pivotal', res);
      this.IsPivotal = !bool
      let favourite = {
        child_id: this.MeetingDetails.Guid,
        parent_id: this.MeetingDetails.ActivityGroup.Guid,
        changes: this.IsPivotal
      }
      this.MeetingDetails.IsPivotal = this.IsPivotal
      let updateMeetingDetails = {
        id: this.MeetingDetails.Guid,
        changes: { ...this.MeetingDetails }
      }
      this.store.dispatch(new UpdateMeetingDetails({ Update_Meetingdetails: updateMeetingDetails }))
      this.store.dispatch(new MeetingFavorite({ updateFavorite: favourite }))
      if (bool === true) {
        let message: string = res.Message
        let action;
        this.snackBar.open(message, action, {
          duration: 1000
        })
      }
      if (bool === false) {
        let message: string = res.Message
        let action;
        this.snackBar.open(message, action, {
          duration: 1000
        })
      }
    });
  }
  //on click search call service and get 10 records 
  callTempconversationName() {
    this.childConversationEditForm.patchValue({
      conversationName: ''
    })
    this.isActivityGroupNameLoading = true;
    this.searchConversationList = [];
        this.meetingApi.searchActivityGroup("").subscribe(data => {
          this.isActivityGroupNameLoading = false;
          if (data.IsError === false) {
            this.searchConversationList = data.ResponseObject;
          } else {
            this.ErrorMessage.throwError(data.Message);
            this.searchConversationList = [];
          }
        }, error => {
          this.isActivityGroupNameLoading = false;
          this.searchConversationList = [];
        })
  }

  nonEditViweComment(index) {
    console.log(index)
    this.commentindex = index
    this.nonEditcommmentView = true
  }

  nonEditViewComment() {
    this.nonEditcommmentView = false;
  }

  onEditCommentPopUp(index, comment, flagC) {
    this.isCommentEmpty = false
    this.editCommnetIndex = index
    this.flagC = flagC
    if (comment) {
      this.childConversationEditForm.patchValue({
        comments: comment
      })
    } else {
      this.childConversationEditForm.patchValue({
        comments: ''
      })
    }
    this.editcommmentView = true
  }

  closeEditCommentPopup() {
    this.editCommnetIndex = -1
    this.editcommmentView = false
    this.isCommentEmpty = false
  }

  getComments(comment) {
    if (comment) {
      return comment
    } return 'NA'
  }

  saveEditCommentPopup(index) {
    this.editCommnetIndex = -1
    this.editcommmentView = false
    if (this.flagC == "ADD") {
      if (this.newconversationService.attachmentList[index].MapGuid === "") {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
      } else {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newconversationService.attachmentList[index].LinkActionType = 4
        this.newMeetingService.attachmentList[index].LinkActionType = 4
      }
      return;
    }
    if (this.flagC === "VIEW") {
      if (this.newconversationService.attachmentList[index].LinkActionType === 1) {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        return;
      }
      if (this.newconversationService.attachmentList[index].LinkActionType === 2 && this.newconversationService.attachmentList[index].Comments[0].Id !== '') {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newconversationService.attachmentList[index].LinkActionType = 4
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].LinkActionType = 4
        return;
      }
      if (this.newconversationService.attachmentList[index].LinkActionType === 2 && this.newconversationService.attachmentList[index].Comments[0].Id === '') {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newconversationService.attachmentList[index].LinkActionType = 4
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].LinkActionType = 4
        return;
      }
      if (this.newconversationService.attachmentList[index].LinkActionType === 4) {
        this.newconversationService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
        this.newMeetingService.attachmentList[index].Comments[0].Description = this.childConversationEditForm.value.comments
      }
      return;
    }
  }

  callTemppotentialWiproSolutions() {
    this.childConversationEditForm.patchValue({
      potentialWiproSolutions: ''
    })
    this.isPotentialWiproSoluctionSearchLoading = true;
    this.wiproSolution = [];
      this.newconversationService.getWiproSolution("").subscribe(res => {
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

  callTempcustomerParticipant() {
    this.childConversationEditForm.patchValue({
      customerParticipant: ''
    })
    this.customerContactSearch = [];
    this.isCustomerParticipantLoading = true;
    if (this.onNoActivitySelectedToCustomerContacts()) {
        this.meetingApi.searchCustomerparticipants("", this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(
          data => {
            this.isCustomerParticipantLoading = false;
            if (data.IsError === false) {
              this.customerContactSearch = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.customerContactSearch = [];
              this.ErrorMessage.throwError(data.Message)
            }
          }, error => {
            this.customerContactSearch = [];
          }
        )
    }
  }

  callTemplinkOpportunity() {
    this.childConversationEditForm.patchValue({
      linkOpportunity: ''
    })
    this.isLinkedOpportunitySearchLoading = true;
    this.linkedOpportunity = [];
    if (this.onNoActivitySelectedToOppOrder()) {
        this.meetingApi.SearchOrderAndOppBasedOnAccount(this.accntCompanyDetails.SysGuid, "", this.accntCompanyDetails.isProspect).subscribe(
          data => {
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

  callTemptagToView() {
    this.childConversationEditForm.patchValue({
      tagToView: ''
    })
    this.isTagContactToViewMeetingSearchLoading = true;
    this.tagContactSearch = [];
      this.newconversationService.searchUser("").subscribe(
        data => {
          if (data.IsError === false) {
            this.isTagContactToViewMeetingSearchLoading = false;
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

  callTempwiproParticipant() {
    this.contactNameSwitch = true;
    console.log(this.childConversationEditForm.get('wiproParticipant').value)
    this.childConversationEditForm.patchValue({
      wiproParticipant: ''
    })
    this.isWiproParticipantLoading = true;
    this.wiprocontactsearch = [];
      this.newconversationService.searchUser("").subscribe(data => {
        this.isWiproParticipantLoading = false;
        if (data.IsError === false) {
          this.wiprocontactsearch = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        } else {
          this.ErrorMessage.throwError(data.Message);
          this.wiprocontactsearch = [];
        }
      }, error => {
        this.isWiproParticipantLoading = false;
        this.wiprocontactsearch = [];
      })
  }

  callTemplinkLeads() {
    this.childConversationEditForm.patchValue({
      linkLeads: ''
    })
    this.isLinkedLeadsSearchLoading = true;
    this.linkedLeads = [];
    if (this.onNoActivitySelectedToLead()) {
        this.meetingApi.SearchLeadBasedOnAccount(this.accntCompanyDetails.SysGuid, "", this.accntCompanyDetails.isProspect).subscribe(
          data => {
            this.isLinkedLeadsSearchLoading = false;
            if (data.IsError === false) {
              this.linkedLeads = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            } else {
              this.ErrorMessage.throwError(data.Message)
              this.linkedLeads = [];
            }
          }, error => {
            this.isLinkedLeadsSearchLoading = false;
            this.linkedLeads = [];
          })
    }
  }

  callTemplinkCampaign() {
    this.childConversationEditForm.patchValue({
      linkCampaign: ''
    })
    this.isLinkedCampaignsSearchLoading = true;
    this.campaignContact = [];
    if (this.onNoActivitySelectedToCampaign()) {
        this.newconversationService.campaignBasedOnAccount("", this.accntCompanyDetails.SysGuid, this.accntCompanyDetails.isProspect).subscribe(data => {
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

  onNoActivitySelectedToCustomerContacts() {
    if (this.activityGroupId === '') {
      this.isCustomerParticipantLoading = true;
      this.customerNameSwitch = false
      this.childConversationEditForm.get('customerParticipant').clearValidators();
      this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }

  onNoActivitySelectedToLead() {
    if (this.activityGroupId === '') {
      this.contactTagSwitch = false
      this.isLinkedLeadsSearchLoading = false
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }

  onNoActivitySelectedToCampaign() {
    if (this.activityGroupId === '') {
      this.linkedcampaignSwitch = false;
      this.isLinkedCampaignsSearchLoading = false
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }

  onNoActivitySelectedToOppOrder() {
    if (this.activityGroupId === '') {
      this.contactopportunityswitch = false;
      this.isLinkedOpportunitySearchLoading = false;
      this.ErrorMessage.throwError('Select activity group')
      return false
    }
    return true
  }
  shareEmail() {
    if (JSON.parse(sessionStorage.getItem('shareConversation'))) {
      let data = JSON.parse(sessionStorage.getItem('shareConversation'));
      sessionStorage.setItem('shareConversation', JSON.stringify({ ...data, navigation: this.router.url }));
      this.router.navigateByUrl('/activities/sharemeeting');
    }
  }

  onEditClick(event) {
    this.value = event.target.value;
    if (this.value === "Email") {
      this.agendaview = !this.agendaview;
      this.emailview = !this.emailview;
    }
    else {
      this.agendaview = true;
      this.emailview = false;
    }
  }

  editdetails() {
    this.showContent = false;
    this.editpart = true;
    this.noneditpart = false;
    this.editCommnetIndex = -1
    this.editcommmentView = false;
    this.commentindex = -1
    this.nonEditcommmentView = false
    this.patchMeetingEditForm()
  }

  patchMeetingEditForm() {
    this.childConversationEditForm.patchValue({
      conversationName: this.MeetingDetails.ActivityGroup.Name,
      activityType: this.MeetingDetails.ActivityGroup.ActivityType.Id === 0 ? '' : this.MeetingDetails.ActivityGroup.ActivityType.Id,
      accountCompanyname: this.service.getSymbol(this.MeetingDetails.Account.Name),
      meetingId: this.MeetingDetails.Code,
      access: this.MeetingDetails.IsPrivate,
      Duration: this.durationToBind,
      StartDate: moment(this.MeetingDetails.ScheduleStart).local().format(),
      startTime: moment(this.MeetingDetails.ScheduleStart).local().format(),
      EndDate: moment(this.MeetingDetails.EndDate).local().format(),
      endTime: moment(this.MeetingDetails.EndDate).local().format(),
      haveConsent: this.MeetingDetails.HasConsentToRecord,
      recordTypeSubject: this.MeetingDetails.MOM,
      agenda: this.MeetingDetails.Name,
      conversationType: this.MeetingDetails.MeetingType.Id
    })
    this.activityGroupName = this.MeetingDetails.Name;
    console.log(JSON.stringify(this.MeetingDetails));
    if (this.MeetingDetails.ActivityGroup.ActivityType.Id !== 0) {
      this.newconversationService.GetValidations(this.MeetingDetails.ActivityGroup.ActivityType.Id).subscribe(res => {
        console.log("got the result now!!1")
        console.log(res)
        if (!res.IsError) {
          this.EnableValidations(res.ResponseObject)
        } else {
          this.ErrorMessage.throwError(res.Message)
        }

      })
    }
    this.Conversation = this.MeetingDetails.ActivityGroup.Name
    this.activityGroupId = this.MeetingDetails.ActivityGroup.Guid;
    this.accntCompanyDetails = this.MeetingDetails.Account
    this.accountType = this.MeetingDetails.AccountType;
    this.OppOrderEnabledisable()
    this.speechData = this.MeetingDetails.MOM
    //this.consent = this.MeetingDetails.HasConsentToRecord
    sessionStorage.setItem("shareConversation", JSON.stringify(this.shareobject(this.MeetingDetails)));
    console.log("line 1179", JSON.parse(sessionStorage.getItem("shareConversation")))
    if (this.MeetingDetails.CustomerContacts.length > 0) {
      this.customerMessage = false;
      this.childConversationEditForm.get('customerParticipant').clearValidators();
      this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
      this.MeetingDetails.CustomerContacts.forEach(data => {
        this.selectedCustomer.push({ FullName: data.FullName, Email: data.Email, isKeyContact: data.isKeyContact, Guid: data.Guid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
        this.sendCustomerToAdvance.push({ FullName: data.FullName, Email: data.Email, isKeyContact: data.isKeyContact, Guid: data.Guid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType, Id: data.Guid })
        this.editedCustomerContact.push({ Guid: data.Guid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.WiproParticipant.length > 0) {
      this.MeetingDetails.WiproParticipant.forEach(data => {
        this.selectedContact.push({ FullName: data.FullName, Designation: data.Designation, MapGuid: data.MapGuid, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType })
        this.sendwiproToAdvance.push({ FullName: data.FullName, Designation: data.Designation, MapGuid: data.MapGuid, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType, Id: data.SysGuid })
        this.editedWiproParticiapnt.push({ SysGuid: data.SysGuid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
      this.childConversationEditForm.get('wiproParticipant').clearValidators();
      this.childConversationEditForm.get('wiproParticipant').updateValueAndValidity();
    }
    if (this.MeetingDetails.TagUserToView.length > 0) {
      this.MeetingDetails.TagUserToView.forEach(data => {
        this.selectedTag.push({ MapGuid: data.MapGuid, SysGuid: data.SysGuid, FullName: data.FullName, Designation: data.Designation, LinkActionType: data.LinkActionType })
        this.sendTagToAdvance.push({ MapGuid: data.MapGuid, SysGuid: data.SysGuid, FullName: data.FullName, Designation: data.Designation, LinkActionType: data.LinkActionType, Id: data.SysGuid })
        this.editedTagUser.push({ SysGuid: data.SysGuid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.Campaign.length > 0) {
      this.MeetingDetails.Campaign.forEach(data => {
        this.selectedcampaign.push({ Name: data.Name, MapGuid: data.MapGuid, Id: data.Id, LinkActionType: data.LinkActionType })
        this.editedCampaign.push({ Id: data.Id, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.Lead.length > 0) {
      this.MeetingDetails.Lead.forEach(data => {
        this.selectedLinkedLeads.push({ LeadGuid: data.LeadGuid, MapGuid: data.MapGuid, Title: data.Title, LinkActionType: data.LinkActionType })
        this.sendLeadToAdvance.push({ LeadGuid: data.LeadGuid, MapGuid: data.MapGuid, Title: data.Title, LinkActionType: data.LinkActionType, Id: data.LeadGuid })
        this.editedLead.push({ LeadGuid: data.LeadGuid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.OpportunitiesOrOrders.length > 0) {
      this.MeetingDetails.OpportunitiesOrOrders.forEach(data => {
        this.selectedLinkedOpp.push({ MapGuid: data.MapGuid, Title: data.Name, Type: data.Type, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType })
        this.sendOppToAdvance.push({ MapGuid: data.MapGuid, Title: data.Name, Type: data.Type, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType, Id: data.SysGuid })
        this.editOppOrder.push({ SysGuid: data.SysGuid, MapGuid: data.MapGuid, Type: data.Type, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.WiproPotentialSolution.length > 0) {
      this.MeetingDetails.WiproPotentialSolution.forEach(data => {
        this.selectedsolution.push({ MapGuid: data.MapGuid, Name: data.Name, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType })
        this.sendSolnToAdvance.push({ MapGuid: data.MapGuid, Name: data.Name, SysGuid: data.SysGuid, LinkActionType: data.LinkActionType, Id: data.SysGuid })
        this.editedWiproSolution.push({ SysGuid: data.SysGuid, MapGuid: data.MapGuid, LinkActionType: data.LinkActionType })
      })
    }
    if (this.MeetingDetails.Attachments.length > 0) {
      let Comments = []
      this.MeetingDetails.Attachments.forEach(data => {
        Comments = []
        if (data.Comments.length === 0) {
          Comments = [{Description: '', id: ''}]
        } else {
          Comments.push({ Id: data.Comments[0].Id, Description: data.Comments[0].Description ? data.Comments[0].Description :'' })
        }
        this.newconversationService.attachmentList.push({ Name: data.Name, Url: data.Url, Comments: Comments, MapGuid: data.Guid, LinkActionType: data.LinkActionType, Base64String : data.Base64String,MimeType : data.MimeType,downloadFileName : data.Name })
        this.newMeetingService.attachmentList.push({ Name: data.Name, Url: data.Url, Comments: Comments, Guid: data.Guid, MapGuid: data.Guid, LinkActionType: data.LinkActionType })
      })
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

  activityTypeValidation(id) {
    if (id != '') {
      this.isLoading = true;
      console.log("activity type", id);
      this.newconversationService.GetValidations(id).subscribe(res => {
        console.log("got the result now!!1")
        this.isLoading = false;
        console.log(res)
        if (!res.IsError) {
          this.EnableValidations(res.ResponseObject)
        } else {
          this.ErrorMessage.throwError(res.Message)
        }
      })
    }
  }

  activitySelect(event) {
    this.activityTypeValidation(event.target.value)
  }

  activitySelectWeb(event) {
    this.activityTypeValidation(event.value);
    this.activityTypeList.filter(val => {
      if (val.Id == event.value) {
        this.activityTypeName = val.Name;
      }
    })
  }

  EnableValidations(data) {
    if (data) {
      if (data.IsAccountReq) {
        this.IsAccountreq = true
        this.setAccountValidators()
      } else {
        this.IsAccountreq = false
        this.removeAccountValidators()
      }
      if (data.IsCampaignReq) {
        this.IsCampaignreq = true;
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
          if(this.accountType !== 'Prospect') {
            this.OppOrderEnabledisable()
          }
        } else {
          this.setOppoValidators()
          if(this.accountType !== 'Prospect') {
            this.OppOrderEnabledisable()
          }
        }
      } else {
        this.IsOpporeq = false
        this.removeOppoValidators()
      }
      if (data.IsWiproSolnReq) {
        this.IsPotentialreq = true
        if (this.selectedContact.length > 0) {
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
    this.childConversationEditForm.controls['potentialWiproSolutions'].markAsUntouched();
    this.childConversationEditForm.controls['potentialWiproSolutions'].clearValidators();
    this.childConversationEditForm.controls['potentialWiproSolutions'].updateValueAndValidity();
  }
  setPotentialValidators() {
    this.childConversationEditForm.controls['potentialWiproSolutions'].setValidators([Validators.required]);
    this.childConversationEditForm.controls['potentialWiproSolutions'].markAsTouched();
    this.childConversationEditForm.controls['potentialWiproSolutions'].updateValueAndValidity();
  }
  removeOppoValidators() {
    this.childConversationEditForm.controls['linkOpportunity'].markAsUntouched();
    this.childConversationEditForm.controls['linkOpportunity'].clearValidators();
    this.childConversationEditForm.controls['linkOpportunity'].updateValueAndValidity();
  }
  setOppoValidators() {
    this.childConversationEditForm.controls['linkOpportunity'].setValidators([Validators.required]);
    this.childConversationEditForm.controls['linkOpportunity'].markAsTouched();
    this.childConversationEditForm.controls['linkOpportunity'].updateValueAndValidity();
  }
  removeLeadValidators() {
    this.childConversationEditForm.controls['linkLeads'].markAsUntouched();
    this.childConversationEditForm.controls['linkLeads'].clearValidators();
    this.childConversationEditForm.controls['linkLeads'].updateValueAndValidity();
  }
  setLeadValidators() {
    this.childConversationEditForm.controls['linkLeads'].setValidators([Validators.required])
    this.childConversationEditForm.controls['linkLeads'].markAsTouched();
    this.childConversationEditForm.controls['linkLeads'].updateValueAndValidity();
  }
  removeCustomerValidatos() {
    this.childConversationEditForm.controls['customerParticipant'].markAsUntouched();
    this.childConversationEditForm.controls['customerParticipant'].clearValidators();
    this.childConversationEditForm.controls['customerParticipant'].updateValueAndValidity();
  }
  setCustomerValidatos() {
    this.childConversationEditForm.controls['customerParticipant'].setValidators([Validators.required]);
    this.childConversationEditForm.controls['customerParticipant'].markAsTouched();
    this.childConversationEditForm.controls['customerParticipant'].updateValueAndValidity();
  }
  removeCampValidators() {
    this.childConversationEditForm.controls['linkCampaign'].markAsUntouched();
    this.childConversationEditForm.controls['linkCampaign'].clearValidators();
    this.childConversationEditForm.controls['linkCampaign'].updateValueAndValidity();
  }
  setCampValidators() {
    this.childConversationEditForm.controls['linkCampaign'].setValidators([Validators.required]);
    this.childConversationEditForm.controls['linkCampaign'].markAsTouched();
    this.childConversationEditForm.controls['linkCampaign'].updateValueAndValidity();
  }
  removeAccountValidators() {
    this.childConversationEditForm.controls['accountCompanyname'].markAsUntouched();
    this.childConversationEditForm.controls['accountCompanyname'].clearValidators();
    this.childConversationEditForm.controls['accountCompanyname'].updateValueAndValidity();
  }
  setAccountValidators() {
    this.childConversationEditForm.controls['accountCompanyname'].setValidators([Validators.required]);
    this.childConversationEditForm.controls['accountCompanyname'].markAsTouched();
    this.childConversationEditForm.controls['accountCompanyname'].updateValueAndValidity();
  }

  noneditdetails() {
    this.selectedCustomer = [];
    this.editedCustomerContact = [];
    this.editedWiproParticiapnt = [];
    this.selectedContact = [];
    this.selectedTag = [];
    this.editedTagUser = [];
    this.selectedsolution = [];
    this.editedWiproSolution = [];
    this.selectedcampaign = [];
    this.editedCampaign = [];
    this.selectedLinkedLeads = [];
    this.editedLead = [];
    this.editOppOrder = [];
    this.selectedLinkedOpp = [];
    this.newconversationService.attachmentList = [];
    this.newMeetingService.attachmentList = [];
    this.sendCustomerToAdvance = [];
    this.sendLeadToAdvance = [];
    this.sendOppToAdvance = [];
    this.sendwiproToAdvance = [];
    this.sendTagToAdvance = [];
    this.sendSolnToAdvance = [];
    this.noneditpart = true;
    this.editpart = false;
  }

  UtcConversation(data) {
    return moment( data.split(':00')[0], "YYYY-MM-DDTHH:mm:mm").utc()
  }
  onClickSave() {
    if (this.activityGroupName.trim() === '') {
      this.childConversationEditForm.patchValue({agenda :''});
      this.childConversationEditForm.controls['agenda'].setValidators(Validators.required);
      this.childConversationEditForm.controls['agenda'].markAsTouched();
      this.childConversationEditForm.controls['agenda'].updateValueAndValidity();
    }
    if (this.play === true && this.childConversationEditForm.valid) {
      this.onError("Stop the recording before save ");
      return
    }
    if (this.childConversationEditForm.valid && this.play === false) {
      var body = {
        "Guid": this.MeetingDetails.Guid,
        "Name": this.activityGroupName.trim(),
        "Owner": {
          "AdId": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip')
        },
        "ScheduleStart":this.UtcConversation(this.sendFinalStartDate.toString()),
        "IsPrivate": this.childConversationEditForm.value.access,
        "IsLiveMeeting": true,
        "Description": "",
        "MOM": this.childConversationEditForm.value.recordTypeSubject,
        "Account": this.accntCompanyDetails,
        "HasConsentToRecord": this.childConversationEditForm.value.haveConsent,
        "Conversation": {
          "Type": this.childConversationEditForm.value.conversationType
        },
        "EndDate":this.UtcConversation(this.sendFinalEndDate.toString()),
        "Duration": this.totalMinutesToSend.toString(),
        "MeetingType": {
          "Id": this.childConversationEditForm.value.activityType
        },
        "ActivityGroup": {
          "Guid": this.activityGroupId
        },
        "WiproParticipant": this.editedWiproParticiapnt,
        "Attachments": this.newMeetingService.attachmentList,
        "TagUserToView": this.editedTagUser,
        "WiproPotentialSolution": this.editedWiproSolution,
        "Campaign": this.editedCampaign,
        "OpportunitiesOrOrders": this.editOppOrder,
        "Lead": this.editedLead,
        "CustomerContacts": this.editedCustomerContact
      }
      this.isLoading = true;
      this.newMeetingService.editMeeting(body).subscribe(
        async res => {
          console.log(res)
          this.isLoading = false;
          if (res.IsError === false) {
            // this.daService.iframePage = 'NA';
            // let bodyDA = {
            //   page: 'NA',
            // };
            // this.daService.postMessageData = bodyDA;
            // this.daService.postMessage(bodyDA);
            this.ErrorMessage.throwError(res.Message)
            this.isFormSaved = true;
            let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", this.activityGroupId, "DecryptionDecrip");
            sessionStorage.setItem("ActivityListRowId", JSON.stringify(encId))
            sessionStorage.setItem("ActivityGroupName", res.ResponseObject.ActivityGroup.Name)
            this.newconversationService.setActivityGroupName(res.ResponseObject.ActivityGroup.Name)
            await this.offlineService.ClearTablesdata(this.onlineofflineService.isOnline);
            let editChange = {
              Subject: this.childConversationEditForm.value.agenda,
              // MeetingDate: this.childConversationEditForm.value.datecreated,
              MeetingType: {
                Id: res.ResponseObject.MeetingType.Id,
                Value: res.ResponseObject.MeetingType.Description
              },
              WiproParticipant: res.ResponseObject.WiproParticipant,
              Lead: res.ResponseObject.Lead,
              OrdersAndOpportunity: res.ResponseObject.OpportunitiesOrOrders,
              CustomerContacts: res.ResponseObject.CustomerContacts,
              TagUserToView: res.ResponseObject.TagUserToView,
              Attachments: res.ResponseObject.Attachments,
              ScheduleStart: res.ResponseObject.ScheduleStart,
              EndDate: res.ResponseObject.EndDate,
              Duration: res.ResponseObject.Duration
            }
            let meetingEdit = {
              child_id: res.ResponseObject.Guid,
              parent_id: res.ResponseObject.ActivityGroup.Guid,
              changes: editChange
            }
            let updateMeetingDetails = {
              id: res.ResponseObject.Guid,
              changes: { ...res.ResponseObject }
            }
            this.editCommnetIndex = -1
            this.editcommmentView = false;
            this.commentindex = -1
            this.nonEditcommmentView = false
            this.selectedCustomer = [];
            this.editedCustomerContact = [];
            this.editedWiproParticiapnt = [];
            this.selectedContact = [];
            this.selectedTag = [];
            this.editedTagUser = [];
            this.selectedsolution = [];
            this.editedWiproSolution = [];
            this.selectedcampaign = [];
            this.editedCampaign = [];
            this.selectedLinkedLeads = [];
            this.editedLead = [];
            this.editOppOrder = [];
            this.selectedLinkedOpp = [];
            this.newconversationService.attachmentList = []
            this.newMeetingService.attachmentList = []
            this.MeetingDetails = res.ResponseObject;
            this.sendCustomerToAdvance = []
            this.sendLeadToAdvance = [];
            this.sendOppToAdvance = [];
            this.sendwiproToAdvance = [];
            this.sendTagToAdvance = [];
            this.sendSolnToAdvance = [];
            this.resetCacheData()
            sessionStorage.setItem("shareConversation", JSON.stringify(this.shareobject(this.MeetingDetails)));
            console.log("line 1559", JSON.parse(sessionStorage.getItem("shareConversation")))
            this.store.dispatch(new MeetingDetailsEdit({ meetingEdit: meetingEdit })) //updating the meeting list listand activity also
            this.store.dispatch(new UpdateMeetingDetails({ Update_Meetingdetails: updateMeetingDetails }))
            this.store.dispatch(new ClearMeetingList({ cleardetails: this.activityGroupId}))
            this.store.dispatch(new ClearActivityDetails())
            this.store.dispatch(new ClearActivity());
            let json = {
              Guid: res.ResponseObject.ActivityGroup.Guid,
              Name: res.ResponseObject.ActivityGroup.Name,
              Account: res.ResponseObject.Account,
              ActivityType: res.ResponseObject.ActivityGroup.ActivityType
            }
            localStorage.setItem("forMeetingCreation", JSON.stringify(json))
            this.noneditpart = true;
            this.editpart = false;
            this.service.windowScroll()
          } else {
            this.ErrorMessage.throwError(res.Message)
          }
        }, error => {
          this.isLoading = false
        })
    }
    else {
      this.service.validateAllFormFields(this.childConversationEditForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }

  onClickAddCustomerContacts() {
    if (this.Conversation === '') {
      this.ErrorMessage.throwError('Select activity group')
    } else {
      const dialogRef = this.dialog.open(CustomerpopupComponent, {
        width: '800px',
        data: (this.accntCompanyDetails) ? ({ Name: this.accntCompanyDetails['Name'], SysGuid: this.accntCompanyDetails['SysGuid'], isProspect: this.accntCompanyDetails['isProspect'] }) : ''
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        if (res != '') {
          this.editedCustomerContact.push({ Guid: res['Guid'], MapGuid: "", LinkActionType: 1 })
          this.selectedCustomer.push({ FullName: (res['FName'] + ' ' + res['LName']), Email: res['Email'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "", LinkActionType: 1 });
          this.sendCustomerToAdvance.push({ FullName: (res['FName'] + ' ' + res['LName']), Email: res['Email'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "", Id: res['Guid'], LinkActionType: 1 })
          this.childConversationEditForm.get('customerParticipant').clearValidators();
          this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
        }
      });
    }
  }

  consentStatus(e) {
    this.consent = e.checked;
    if (e.checked == false) {
      this.play = false;
    }
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
      // this.fileService.filesToUpload(fileList).subscribe((res) => {
        this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
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
            this.newMeetingService.attachmentList.push({
              "Name": fileNames[i],
              "Url": file.ResponseObject.Url,
              "MapGuid": "",
              "LinkActionType": 1,
              "Comments": [{ Description: '' }]
            })
          }
        })
        console.log(this.newconversationService.attachmentList)
      },
        () => this.isLoading = false
      )
    }
  }

  openRecordMomPopup(): void {
    this.play = true;
    var subscriptionKey = "50cb684cff5b44abad90aaff3fcb8f22";
    var serviceRegion = "southeastasia"
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = "en-US";
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    this.recognizer.startContinuousRecognitionAsync(() => console.log("speech"));
    this.recognizer.recognizing = (s, e) => this.recognizing(s, e);
    this.recognizer.recognized = (s, e) => this.recognized(s, e);
  }

  recognizing(s, e) {
    console.log('recognizing text', e.result.text);
  }
  recognized(s, e) {
    console.log('recognized text', e.result.text);
    this.speechData += e.result.text;
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

  downloadAll(isDetails) {
    let downloadUrls = []
    if (isDetails === true) {
      if (this.envr.envName === 'MOBILEQA') {
        this.MeetingDetails.Attachments.forEach(
          item => {
            downloadUrls.push({ Url: item.Url, Name: item.Name })
          })
        this.downloadAllInMobile(downloadUrls)
        return
      } else {
        let body = this.MeetingDetails.Attachments.map(x=>{
          if(x.downloadFileName) 
          return {Name : x.downloadFileName}
          else 
          return {Name : x.Name}
        });
        this.filesToDownloadDocument64(body);
        // this.MeetingDetails.Attachments.forEach(item => {
        //   this.service.Base64Download(item);
        //   // downloadUrls.push(item.Url);
        // })
      }
    } else {
      if (this.envr.envName === 'MOBILEQA') {
        this.newconversationService.attachmentList.forEach(
          item => {
            downloadUrls.push({ Url: item.Url, Name: item.Name })
          })
        this.downloadAllInMobile(downloadUrls)
        return
      } else {
        let body = this.newconversationService.attachmentList.map(x=>{
          if(x.downloadFileName) 
          return {Name : x.downloadFileName}
          else 
          return {Name : x.Name}
        });
      this.filesToDownloadDocument64(body);
        // this.newconversationService.attachmentList.forEach(item => {
        //   this.service.Base64Download(item);
        //     // downloadUrls.push(item.Url);
        //   })
      }
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
        }
        );
      }, idx * 2500)
    });
  }

  downloadsingle(i) {
    let body = [this.newconversationService.attachmentList[i]].map(x=>{
      if(x.downloadFileName) 
      return {Name : x.downloadFileName}
      else 
      return {Name : x.Name}
    });
    this.filesToDownloadDocument64(body);
    // this.service.Base64Download(item);
    // this.newconversationService.attachmentList[i]
    // const response = { file: this.newconversationService.attachmentList[i].Url };
    // var a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
    // console.log(i, this.newconversationService.attachmentList);
  }

  downloadDetails(Url) {
   let body = [Url].map(x=>{
    if(x.downloadFileName) 
    return {Name : x.downloadFileName}
    else 
    return {Name : x.Name}
  });
  this.filesToDownloadDocument64(body);
  //  this.service.Base64Download(Url);
    // const response = { file: Url };
    // var a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
  }

  linkedCampaignClose() {
    this.linkedcampaignSwitch = false;
    this.childConversationEditForm.patchValue({ linkCampaign: '' })
  }
  // Linked campaigns
  delinkCampaign(item, i) {
    if (item.MapGuid !== "") {
      this.selectedcampaign = this.selectedcampaign.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedCampaign.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedCampaign[index].LinkActionType = 3
    } else {
      this.selectedcampaign = this.selectedcampaign.filter(res => res.Id !== item.Id)
      this.editedCampaign = this.editedCampaign.filter(res => res.Id !== item.Id)
    }
    if (this.selectedcampaign.length == 0 && this.IsCampaignreq == true) {
      this.setCampValidators()
    }
  }

  wiproSolutionsClose() {
    this.solutionSwitch = false;
    this.childConversationEditForm.patchValue({
      potentialWiproSolutions: ''
    })
  }

  delinkWiproSolution(item, i) {
    if (item.MapGuid !== "") {
      this.selectedsolution = this.selectedsolution.filter(res => res.MapGuid !== item.MapGuid)
      this.sendSolnToAdvance = this.sendSolnToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedWiproSolution.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedWiproSolution[index].LinkActionType = 3
    } else {
      this.selectedsolution = this.selectedsolution.filter(res => res.SysGuid !== item.SysGuid)
      this.sendSolnToAdvance = this.sendSolnToAdvance.filter(res => res.SysGuid !== item.SysGuid)
      this.editedWiproSolution = this.editedWiproSolution.filter(res => res.SysGuid !== item.SysGuid)
    }
    if (this.selectedsolution.length == 0 && this.IsPotentialreq == true) {
      this.setPotentialValidators()
    }
  }

  // Activity group
  activityGroupClose() {
    this.ConversationNameSwitch = false;
    if (this.Conversation === "" && this.childConversationEditForm.get('conversationName').dirty) {
      this.childConversationEditForm.patchValue({
        conversationName: ''
      })
    }
    if (this.Conversation !== "") {
      this.childConversationEditForm.patchValue({
        conversationName: this.Conversation
      })
    }
  }

  appendActivityGroup(item, i) {
    if (i > this.searchConversationList.length) {
      this.onclickCreateActivityGroup()
      this.ConversationNameSwitch = false;
    }
    else {
      // this.newconversationService.ValidateAccount(item.Account.SysGuid, item.Account.isProspect, 0).subscribe(res => {
      //   if (res.IsError) {
      //     this.Conversation = "";
      //     this.childConversationEditForm.patchValue({
      //       conversationName: "",
      //       accountcompanyName: ""
      //     })
      //   } else {
          this.Conversation = item.Name;
          this.ConversationNameSwitch = false;
          this.activityGroupId = item.Guid;
          this.accntCompanyDetails = item.Account
          this.accountType = item.AccountType;
          this.OppOrderEnabledisable()
          if (item.Account.isProspect) {
            this.isProspectAccount = item.Account.isProspect;
            this.removeOppoValidators()
          } else {
            this.isProspectAccount = item.Account.isProspect;
          }
          this.childConversationEditForm.patchValue({
            conversationName: item.Name,
            accountCompanyname: this.service.getSymbol(item.Account.Name)
          })
      //   }
      // })
    }
    if (this.activityGroupId !== this.selectedGroupId) {
      this.delinkAfterGroupChanges()
      this.selectedGroupId = this.activityGroupId
    }
  }

  OppOrderEnabledisable() {
    debugger;
    if(this.accountType == 'Prospect') {
      this.removeOppoValidators();
      this.IsOpporeq = false;
    }
  }

  clearActivityGroup() {
    this.childConversationEditForm.patchValue({
      conversationName: '',
      accountCompanyname: ''
    })
    this.delinkAfterGroupChanges()
    this.activityGroupId = '';
    this.Conversation = '';
    this.accntCompanyDetails = undefined;
    this.resetCacheData();
  }

  resetCacheData() {
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

  appnedWiproSolution(item, i) {
    if (i > this.wiproSolution.length) {
      this.openadvancetabs('PotentialWiproSolutionSearch', this.wiproSolution, this.childConversationEditForm.get('potentialWiproSolutions').value)
    } else {
      let json = { Name: item.Name, SysGuid: item.SysGuid, MapGuid: "", LinkActionType: 1 }
      let json1 = { Name: item.Name, SysGuid: item.SysGuid, MapGuid: "", LinkActionType: 1, Id: item.SysGuid }
      this.selectedsolution.push(json)
      let beforeLength = this.selectedsolution.length
      this.selectedsolution = this.service.removeDuplicates(this.selectedsolution, "SysGuid");
      let afterLength = this.selectedsolution.length;
      if (beforeLength == afterLength) {
        this.sendSolnToAdvance.push(json1)
      }
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected  potential wipro solution exists")
      } else {
        this.editedWiproSolution.push({ SysGuid: item.SysGuid, MapGuid: "", LinkActionType: 1 })
      }
      if (this.selectedsolution.length > 0 && this.IsPotentialreq) {
        this.removePotentialValidators()
      }
    }
    this.wiproSolutionsClose()
  }

  appendLinkedCampaign(item, i) {
    if (i > this.campaignContact.length) {
      this.openadvancetabs('LinkedCampaignSearch', this.campaignContact, this.childConversationEditForm.get('linkCampaign').value)
      this.linkedCampaignClose()
    } else {
      let json = { Name: item.Name, MapGuid: "", Id: item.Id, LinkActionType: 1 };
      this.selectedcampaign.push(json)
      let beforeLength = this.selectedcampaign.length
      this.selectedcampaign = this.service.removeDuplicates(this.selectedcampaign, "Id");
      let afterLength = this.selectedcampaign.length
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected  linked campaign exists")
      } else {
        this.editedCampaign.push({ Id: item.Id, MapGuid: "", LinkActionType: 1 })
      }
      if (this.selectedcampaign.length > 0) {
        this.childConversationEditForm.get('linkCampaign').clearValidators();
        this.childConversationEditForm.get('linkCampaign').updateValueAndValidity();
      }
      this.linkedCampaignClose()
    }
  }

  appendCustomerParticipant(item, i) {
    if (i > this.wiprocontactsearch.length) {
      this.openadvancetabs('CustomerContactSearch', this.customerContactSearch, this.childConversationEditForm.get('customerParticipant').value)
      this.customerParticipantClose()
    } else {
      let json = { FullName: item.FullName, Email: item.Email, isKeyContact: item.isKeyContact, Guid: item.Guid, MapGuid: "", LinkActionType: 1 }
      let json1 = { FullName: item.FullName, Email: item.Email, isKeyContact: item.isKeyContact, Guid: item.Guid, MapGuid: "", LinkActionType: 1, Id: item.Guid }
      this.selectedCustomer.push(json);
      let beforeLength = this.selectedCustomer.length
      this.selectedCustomer = this.service.removeDuplicates(this.selectedCustomer, "Guid");
      let afterLength = this.selectedCustomer.length
      if (beforeLength == afterLength) {
        this.sendCustomerToAdvance.push(json1);
      }
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected contact participant already exists")
      } else {
        this.editedCustomerContact.push({ Guid: item.Guid, MapGuid: '', LinkActionType: 1 })
      }
      this.customerMessage = false;
      if (this.selectedCustomer.length > 0) {
        this.childConversationEditForm.get('customerParticipant').clearValidators();
        this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
      }
      this.customerParticipantClose();
    }
  }

  appendWiproParticipant(item: any, i) {
    if (i > this.wiprocontactsearch.length) {
      this.openadvancetabs('WiproParticipantSearch', this.wiprocontactsearch, this.childConversationEditForm.get('wiproParticipant').value)
      this.wiproParticipantsClose();
    } else {
      var json = { FullName: item.FullName, Designation: item.Designation, MapGuid: "", SysGuid: item.SysGuid, LinkActionType: 1 };
      var json1 = { FullName: item.FullName, Designation: item.Designation, MapGuid: "", SysGuid: item.SysGuid, LinkActionType: 1, Id: item.SysGuid };
      this.selectedContact.push(json);
      let beforeLength = this.selectedContact.length
      this.selectedContact = this.service.removeDuplicates(this.selectedContact, "SysGuid");
      let afterLength = this.selectedContact.length
      if (beforeLength == afterLength) {
        this.sendwiproToAdvance.push(json1)
      }
      //this.wiprocontactsearch = []
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected wipro contact already exists")
      } else {
        this.editedWiproParticiapnt.push({ SysGuid: item.SysGuid, MapGuid: "", LinkActionType: 1 })
      }
      this.wiproMessage = false;
      if (this.selectedContact.length > 0) {
        this.childConversationEditForm.get('wiproParticipant').clearValidators();
        this.childConversationEditForm.get('wiproParticipant').updateValueAndValidity();
      }
      this.wiproParticipantsClose()
    }
  }

  appendPrivateAccess(item: any, i) {
    if (i > this.tagContactSearch.length) {
      this.openadvancetabs('TaggedUserSearch', this.tagContactSearch, this.childConversationEditForm.get('tagToView').value)
    } else {
      var json = { SysGuid: item.SysGuid, MapGuid: "", FullName: item.FullName, Designation: item.Designation, LinkActionType: 1 }
      var json1 = { SysGuid: item.SysGuid, MapGuid: "", FullName: item.FullName, Designation: item.Designation, LinkActionType: 1, Id: item.SysGuid }
      this.selectedTag.push(json);
      let beforeLength = this.selectedTag.length
      this.selectedTag = this.service.removeDuplicates(this.selectedTag, "SysGuid");
      let afterLength = this.selectedTag.length
      if (beforeLength == afterLength) {
        this.sendTagToAdvance.push(json1)
      }
      //this.tagContactSearch = []
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected tag contact already exists")
      } else {
        this.editedTagUser.push({ SysGuid: item.SysGuid, MapGuid: '', LinkActionType: 1 })
      }
    }
    this.privateAccessClose();
  }

  appendLinkedLead(item: any, i) {
    if (i > this.linkedLeads.length) {
      this.openadvancetabs('LinkedLeadsSearch', this.linkedLeads, this.childConversationEditForm.get('linkLeads').value)
    } else {
      var json = { MapGuid: "", LeadGuid: item.LeadGuid, Title: item.Title, LinkActionType: 1 }
      var json1 = { MapGuid: "", LeadGuid: item.LeadGuid, Title: item.Title, LinkActionType: 1, Id: item.LeadGuid }
      this.selectedLinkedLeads.push(json);
      let beforeLength = this.selectedLinkedLeads.length
      this.selectedLinkedLeads = this.service.removeDuplicates(this.selectedLinkedLeads, "LeadGuid");
      let afterLength = this.selectedLinkedLeads.length
      if (beforeLength == afterLength) {
        this.sendLeadToAdvance.push(json1);
      }
      //this.linkedLeads = []
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected linked lead already exists")
      } else {
        this.editedLead.push({ LeadGuid: item.LeadGuid, MapGuid: "", LinkActionType: 1 })
      }
      if (this.selectedLinkedLeads.length > 0) {
        this.childConversationEditForm.get('linkLeads').clearValidators();
        this.childConversationEditForm.get('linkLeads').updateValueAndValidity();
      }
    }
    this.linkedLeadsClose()
  }

  appendOpportunitiesOrder(item: any, i) {
    if (i > this.linkedOpportunity.length) {
      this.openadvancetabs('LinkedOpportunityOrderSearch', this.linkedOpportunity, this.childConversationEditForm.get('linkOpportunity').value)
    } else {
      var json = { SysGuid: item.Guid, MapGuid: "", Title: item.Title, Type: item.Type, LinkActionType: 1 }
      var json1 = { SysGuid: item.Guid, MapGuid: "", Title: item.Title, Type: item.Type, LinkActionType: 1, Id: item.Guid }
      this.selectedLinkedOpp.push(json);
      let beforeLength = this.selectedLinkedOpp.length
      this.selectedLinkedOpp = this.service.removeDuplicates(this.selectedLinkedOpp, "SysGuid");
      let afterLength = this.selectedLinkedOpp.length
      if (beforeLength == afterLength) {
        this.sendOppToAdvance.push(json1)
      }
      if (beforeLength !== afterLength) {
        this.ErrorMessage.throwError("Selected opportunity already exists")
      } else {
        this.editOppOrder.push({ SysGuid: item.Guid, MapGuid: "", Type: item.Type, LinkActionType: 1 })
      }
      if (this.selectedLinkedOpp.length > 0 && this.IsOpporeq) {
        this.removeOppoValidators();
      }
    }
    this.linkedOpportunitiesOrderClose()
  }

  delinkAfterGroupChanges() {
    if (this.accntCompanyDetails)
      if (this.selectedCustomer.length > 0) {
        this.childConversationEditForm.get('customerParticipant').setValidators([Validators.required]);
        this.childConversationEditForm.get('customerParticipant').markAsTouched();
        this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
        this.delinkCustomerAfterGroupChanges()
      }
    if (this.selectedLinkedLeads.length > 0) {
      this.delinkLeadAfterGroupChanges()
    }
    if (this.selectedLinkedOpp.length > 0) {
      this.delinkOpportunityOrderAfterGroupChanges()
    }
    if (this.selectedcampaign.length > 0) {
      this.delinkCampaignAfterGroupChanges()
    }
  }

  delinkCustomerAfterGroupChanges() {
    this.selectedCustomer = this.selectedCustomer.filter(res => res.LinkActionType !== 1)
    this.sendCustomerToAdvance = this.sendCustomerToAdvance.filter(res => res.LinkActionType !== 1)
    this.editedCustomerContact = this.editedCustomerContact.filter(res => res.LinkActionType !== 1)
    let customer = [];
    customer = this.editedCustomerContact.filter(res => res.LinkActionType === 2)
    customer.forEach(res => {
      let index = this.editedCustomerContact.findIndex(k => k.Guid == res.Guid);
      this.editedCustomerContact[index].LinkActionType = 3
    })
    this.selectedCustomer = [];
    this.sendCustomerToAdvance = [];
  }

  delinkLeadAfterGroupChanges() {
    this.selectedLinkedLeads = this.selectedLinkedLeads.filter(res => res.LinkActionType !== 1)
    this.editedLead = this.editedLead.filter(res => res.LinkActionType !== 1)
    let lead = [];
    lead = this.editedLead.filter(res => res.LinkActionType === 2)
    lead.forEach(res => {
      let index = this.editedLead.findIndex(k => k.LeadGuid == res.LeadGuid)
      this.editedLead[index].LinkActionType = 3
    })
    this.selectedLinkedLeads = [];
    this.sendLeadToAdvance = [];
  }

  delinkOpportunityOrderAfterGroupChanges() {
    this.selectedLinkedOpp = this.selectedLinkedOpp.filter(res => res.LinkActionType !== 1)
    this.editOppOrder = this.editOppOrder.filter(res => res.LinkActionType !== 1)
    let oppOrder = [];
    oppOrder = this.editOppOrder.filter(res => res.LinkActionType === 2)
    oppOrder.forEach(res => {
      let index = this.editOppOrder.findIndex(k => k.SysGuid == res.SysGuid)
      this.editOppOrder[index].LinkActionType = 3
    })
    this.selectedLinkedOpp = [];
    this.sendOppToAdvance = [];
  }

  delinkCampaignAfterGroupChanges() {
    this.selectedcampaign = this.selectedcampaign.filter(res => res.LinkActionType !== 1)
    this.editedCampaign = this.editedCampaign.filter(res => res.LinkActionType !== 1)
    let campaign = []
    campaign = this.editedCampaign.filter(res => res.LinkActionType === 2)
    campaign.forEach(res => {
      let index = this.editedCampaign.findIndex(k => k.Id == res.Id)
      this.editedCampaign[index].LinkActionType = 3
    })
    this.selectedcampaign = [];
    this.selectedcampaign = [];
  }

  onclickCreateActivityGroup(): void {
    const dialogRef = this.dialog.open(meetingeditactivitypop, {
      disableClose: true,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        console.log("Activity created" + JSON.stringify(res))
        this.activityGroupId = res.Guid;
        this.Conversation = res.Name;
        this.accntCompanyDetails = res.Account;
        this.childConversationEditForm.patchValue({
          conversationName: res.Name,
          accountCompanyname: this.service.getSymbol(res.Account.Name)
        })
        this.accountType = res.AccountType;
        this.OppOrderEnabledisable()
        if (res.Account.isProspect) {
          this.isProspectAccount = res.Account.isProspect;
          this.removeOppoValidators()
        } else {
          this.isProspectAccount = res.Account.isProspect;
        }
        this.selectedGroupId = this.activityGroupId
        this.delinkAfterGroupChanges();
        this.resetCacheData()
      }
      this.ConversationNameSwitch = false;
    })
  }

  customerParticipantClose() {
    this.customerNameSwitch = false;
    this.childConversationEditForm.patchValue({
      customerParticipant: ''
    })
  }

  delinkCustomerContacts(item, i) {
    if (item.MapGuid !== '') {
      this.selectedCustomer = this.selectedCustomer.filter(res => res.MapGuid !== item.MapGuid)
      this.sendCustomerToAdvance = this.sendCustomerToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedCustomerContact.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedCustomerContact[index].LinkActionType = 3
      if (this.selectedCustomer.length == 0) {
        this.customerMessage = true
      }
    } else {
      this.selectedCustomer = this.selectedCustomer.filter(res => res.Guid !== item.Guid)
      this.sendCustomerToAdvance = this.sendCustomerToAdvance.filter(res => res.Guid !== item.Guid)
      this.editedCustomerContact = this.editedCustomerContact.filter(res => res.Guid !== item.Guid)
      if (this.selectedCustomer.length == 0) {
        this.customerMessage = true
      }
    }
    if (this.selectedCustomer.length === 0 && this.IsCustomerreq == true) {
      this.childConversationEditForm.get('customerParticipant').setValidators([Validators.required]);
      this.childConversationEditForm.get('customerParticipant').markAsTouched();
      this.childConversationEditForm.get('customerParticipant').updateValueAndValidity();
    }
  }

  wiproParticipantsClose() {
    this.contactNameSwitch = false;
    this.childConversationEditForm.patchValue({
      wiproParticipant: ''
    })
  }

  delinkWiproParticipant(item, i) {
    if (item.MapGuid !== "") {
      this.selectedContact = this.selectedContact.filter(res => res.MapGuid !== item.MapGuid)
      this.sendwiproToAdvance = this.sendwiproToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedWiproParticiapnt.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedWiproParticiapnt[index].LinkActionType = 3
    } else {
      this.selectedContact = this.selectedContact.filter(res => res.SysGuid !== item.SysGuid)
      this.sendwiproToAdvance = this.sendwiproToAdvance.filter(res => res.SysGuid !== item.SysGuid)
      this.editedWiproParticiapnt = this.editedWiproParticiapnt.filter(res => res.SysGuid !== item.SysGuid)
    }
    if (this.selectedContact.length === 0) {
      this.childConversationEditForm.get('wiproParticipant').setValidators([Validators.required]);
      this.childConversationEditForm.get('wiproParticipant').markAsTouched();
      this.childConversationEditForm.get('wiproParticipant').updateValueAndValidity();
    }
  }

  delinkAttach(item, i) {
    const dialogRef = this.dialog.open(deleteeditAttachPopUp, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.OK === true) {
        if (item.MapGuid !== "") {
          this.newconversationService.attachmentList = this.newconversationService.attachmentList.filter(res => res.MapGuid !== item.MapGuid)
          let index = this.newMeetingService.attachmentList.findIndex(k => k.MapGuid === item.MapGuid)
          this.newMeetingService.attachmentList[index].LinkActionType = 3
        } else {
          this.newconversationService.attachmentList = this.newconversationService.attachmentList.filter(res => res.Name !== item.Name)
          this.newMeetingService.attachmentList = this.newMeetingService.attachmentList.filter(res => res.Name !== res.Name)
        }
      }
    })
  }

  privateAccessClose() {
    this.contactNameSwitchtag = false;
    this.childConversationEditForm.patchValue({
      tagToView: ''
    })
  }

  delinkTag(item, i) {
    if (item.MapGuid !== "") {
      this.selectedTag = this.selectedTag.filter(res => res.MapGuid !== item.MapGuid)
      this.sendTagToAdvance = this.sendTagToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedTagUser.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedTagUser[index].LinkActionType = 3
    } else {
      this.selectedTag = this.selectedTag.filter(res => res.SysGuid !== item.SysGuid)
      this.sendTagToAdvance = this.sendTagToAdvance.filter(res => res.SysGuid !== item.SysGuid)
      this.editedTagUser = this.editedTagUser.filter(res => res.SysGuid !== item.SysGuid)
    }
  }

  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }

  linkedLeadsClose() {
    this.contactTagSwitch = false;
    this.childConversationEditForm.patchValue({
      linkLeads: ''
    })
  }

  delinkLead(item, i) {
    if (item.MapGuid !== "") {
      this.selectedLinkedLeads = this.selectedLinkedLeads.filter(res => res.MapGuid !== item.MapGuid)
      this.sendLeadToAdvance = this.sendLeadToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editedLead.findIndex(k => k.MapGuid === item.MapGuid)
      this.editedLead[index].LinkActionType = 3
    } else {
      this.selectedLinkedLeads = this.selectedLinkedLeads.filter(res => res.LeadGuid !== item.LeadGuid)
      this.sendLeadToAdvance = this.sendLeadToAdvance.filter(res => res.LeadGuid !== item.LeadGuid)
      this.editedLead = this.editedLead.filter(res => res.LeadGuid !== item.LeadGuid)
    }
    if (this.selectedLinkedLeads.length == 0 && this.IsLeadreq == true) {
      this.setLeadValidators()
    }
  }

  linkedOpportunitiesOrderClose() {
    this.contactopportunityswitch = false;
    this.childConversationEditForm.patchValue({
      linkOpportunity: ''
    })
  }

  delinkOpportunity(item, i) {
    if (item.MapGuid !== "") {
      this.selectedLinkedOpp = this.selectedLinkedOpp.filter(res => res.MapGuid !== item.MapGuid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.editOppOrder.findIndex(k => k.MapGuid === item.MapGuid)
      this.editOppOrder[index].LinkActionType = 3
    } else {
      this.selectedLinkedOpp = this.selectedLinkedOpp.filter(res => res.SysGuid !== item.SysGuid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(res => res.SysGuid !== item.SysGuid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(res => res.SysGuid !== item.SysGuid)
      this.editOppOrder = this.editOppOrder.filter(res => res.SysGuid !== item.SysGuid)
    }
    if (this.selectedLinkedOpp.length == 0 && this.IsOpporeq) {
      this.setOppoValidators();
    }
  }

  navTo() {
    if (this.editpart == true) {
      this.noneditdetails();
    } else {
      if (this.routingState.getPreviousUrl().includes("meetingList")) {
        this.router.navigate(['/activities/activitiesthread'])
      } else if (this.routingState.getPreviousUrl().includes('/leads/leadDetails/leadDetailsInfo')) {
        this.router.navigate(['/leads/leadDetails/leadDetailsInfo'])
      }
      if (JSON.parse(sessionStorage.getItem('navigationfromMeeting'))) {
        let nav = JSON.parse(sessionStorage.getItem('navigationfromMeeting'));
        switch (nav) {
           case 4 : {
            this.router.navigate(['/activities/activitiesthread']);
            return
           }
           case 7 : {
            this.router.navigate(['/home/dashboard']);
            return
           }
           case 8 : {
            this.router.navigate(['/home/approvaltask/task']);
            return
           }
        }
        
      }
      else {
        let routeId = JSON.parse(sessionStorage.getItem('navigation'))
        this.router.navigate([Navigationroutes[routeId]])
      }
    }
  }

  updateTextarea(value: string) {
    console.log(this.childConversationEditForm)
    console.log(value)
    this.textareaData = true;
    if (value.trim() === "") {
      this.childConversationEditForm.patchValue({
        recordTypeSubject: ''
      })
    } else {
      this.childConversationEditForm.patchValue({
        recordTypeSubject: value
      })
    }
  }

  activateSpeechSearchMovie(): void {
    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.speechData += value + " ";
          console.log(value);
        },
        //errror
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
          //   this.activateSpeechSearchMovie();
        });
  }

  stop() {
    this.play = false;
    this.recognizer.stopContinuousRecognitionAsync();
  }
  /********  add view comment popup file code starts *****************/
  ngOnDestroy(): void {
    this.MeetingDetailsSate$.unsubscribe()
  }
  /********  add view comment popup file code end *****************/

  createLead() {
    sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createLeadTempDetails(this.TempMeetingDetails)))
    this.router.navigateByUrl("/leads/createlead")
  }

  createLeadTempDetails(data) {
    console.log("seeing ten lead deatusl!!!")
    console.log(data)
    return {
      leadName: null,
      leadSource: null,
      accountName: { Name: decodeURIComponent(data.Account.Name), SysGuid: data.Account.SysGuid, isProspect: data.Account.isProspect },
      sbu: null,
      vertical: null,
      alliance: null,
      advisor: null,
      enquirytype: null,
      country: null,
      serviceLineToggle: false,
      WiproSolutionToggle: false,
      desc: null,
      id: "",
      links: {
        wiprosolution: null,
        activitygroup: this.filterActivitydata(data),
        campaign: (data.Campaign) ? data.Campaign : null,
        opportunity: this.filterOpportunitydata(data),
        agp: null
      },
      leadInfo: {
        dealValue: null,
        currency: null,
        timeline: null
      },
      ownerDetails: {
        originator: this.Orinator,
        oiginatorlist: null,
        owner: null,
        customers: this.filterCustomerdata(data)
      },
      serviceline: null,
      attachments: null,
      finalActivityGroup: null,
      finalCampaignGroup: null,
      finalOpportunityGroup: null,
      finalCustomerGroup: null,
      moduleSwitch: true,
      moduletype: {
        name: "Meeting details",
        data: null,
        Moduleroute: '/activities/meetingInfo'
      }
    }
  }

  filterCustomerdata(data) {
    console.log("data**********************")
    console.log(data)
    if (data) {
      if (data.CustomerContacts) {
        if (data.CustomerContacts.length > 0) {
          return data.CustomerContacts.map(x => x = { ...x, SysGuid: x.Guid })
        } else {
          return null
        }
      } else {
        return null
      }
    } else {
      return null
    }
  }

  filterOpportunitydata(data: any) {
    if (data.OpportunitiesOrOrders) {
      if (data.OpportunitiesOrOrders.length > 0) {
        return data.OpportunitiesOrOrders.map(x => x = { ...x, Guid: x.SysGuid, Title: x.Name })
      } else {
        return null
      }
    } else {
      return null
    }
  }

  filterActivitydata(data: any) {
    if (data) {
      if (!this.isEmpty(data)) {
        return [{ Name: data.Name, Guid: data.Guid, SysGuid: data.Guid }]
      } else {
        return null
      }
    } else {
      return null
    }
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  shareobject(object) {
    return {
      Attachments: object.Attachments,
      Agenda: object.Name,
      DateCreated: object.CreatedOn,
      MOM: object.MOM,
      WiproAttendeesGuid: object.WiproParticipant,
      CustomerContactsGuid: object.CustomerContacts,
      TagUserToViewGuid: object.TagUserToView,
      Name: object.Name,
      SysGuid: object.Guid
    }
  }
}

@Component({
  selector: 'activity-pop',
  templateUrl: './activity-pop.html',

})

export class meetingeditactivitypop implements OnInit {
  @ViewChild('accountlist')
  acc: ElementRef;
 /*****************Advance search popup ends*********************/
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
   IsProspectAccount : true,
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
 activityGroupName : string = '';
 companyName: string;
 showCompany: boolean;
 showCompanySwitch: boolean = true;

  ngOnInit(): void {
      this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
        localStorage.setItem('dNBToken', res.ResponseObject.access_token)
      })
    this.create = false;
    this.prospectAccountNavigation();
  }

  prospectAccountNavigation() {
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
      var sessiondata = JSON.parse(sessionStorage.getItem('CreateActivityGroup'))
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
        this.ActivityTypeForm.patchValue({ accountName: "" })
        this.AccountSysGuid = "";
        this.AccName = "";
        this.isProspect = false;
        this.companyName = ""
      }
    } else {
      this.showCompanySwitch = false;
    }
  }

  inputChange(event) {
    this.activityGroupName = event.target.value;
  }
 
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
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<meetingeditactivitypop>,
    public fb: FormBuilder,
    private newconversationService: newConversationService,
    public ErrorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public activityService: ActivityService,
    public service: DataCommunicationService,
    public offlineservices: OfflineService,
    private S3MasterApiService: S3MasterApiService,
    public router: Router,
    public store: Store<AppState>) {
    this.CreateActivityType()
  }

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
      this.lookupdata.isLoader = false;
      this.lookupdata.tabledata = res 
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
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
      model: 'Edit activity',
      route: 'activities/meetingInfo'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
    this.dialog.open(meetingeditactivitypop, {
      disableClose: true,
      width: '500px',
    });
  }

  dnBDataBase(action) {
    if (action.action == "dbAutoSearch") {
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getCountryData({ isService: true, searchKey: action.objectRowData.searchKey }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
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
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
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
      model: 'Edit activity',
      route: 'activities/meetingInfo'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
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
        // this.showCompanySwitch = true;
        this.isLoading = false;
        if (res.IsError === false) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.companyDetails = res.ResponseObject;
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
      this.ActivityTypeForm.patchValue({newActivityGroup :''});
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
          sessionStorage.removeItem('CreateActivityGroup');
          await this.offlineservices.ClearActivityIndexTableData()
          await this.offlineservices.ClearMyactivityIndexTableData()
          this.store.dispatch(new ClearActivity())
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
        this.AccountSysGuid = item.SysGuid;
        this.AccName = item.Name;
        this.isProspect = item.isProspect;
        this.companyName = item.Name;
        this.AccountSelected = item
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
    this.showCompanySwitch = true;
  }
  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
  styleUrls: ['./child-details.component.scss'],
})
export class cancelpopComponent1 {
  constructor(
    public dialogRef: MatDialogRef<cancelpopComponent1>,
    public service: DataCommunicationService) { }
  noneditdetails() {
    this.dialogRef.close(true)
  }
}
@Component({
  selector: 'delete-attach-pop',
  templateUrl: './delete-attach-pop.html',
  styleUrls: ['./child-details.component.scss'],
})

export class deleteeditAttachPopUp {
  constructor(private dialogRef: MatDialog, public dialog: MatDialogRef<deleteeditAttachPopUp>) { }
  okClicked() {
    this.dialog.close({ 'OK': true });
  }
  closeallpop() {
    this.dialog.close({ 'OK': false });
  }
}

@Component({
  selector: 'opportunity',
  templateUrl: './opportunity.html',
})
export class opportunityconvercomponent {
  oppPopDataIndex = 0;
  oppPopData = []

  constructor(public dialogRef: MatDialogRef<opportunityconvercomponent>, @Inject(MAT_DIALOG_DATA) public data, public globalService: DataCommunicationService) {
    data.AccountType === 'Prospect' ? this.oppPopDataIndex = 1 : data.AccountType === 'Reserve' ? this.oppPopDataIndex = 2 : this.oppPopDataIndex = 0
    this.oppPopData = this.globalService.leadToOpp();
    this.oppPopData[this.oppPopDataIndex].name = this.data.Title
  }

  Createopp(val) {
    if (val == 'OK' && this.oppPopData[this.oppPopDataIndex].routerLink != '') {
        this.dialogRef.close(this.oppPopData[this.oppPopDataIndex].routerLink);
    }
    else {
      this.dialogRef.close()
    }
  }
}