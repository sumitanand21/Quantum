import { Popup } from '@syncfusion/ej2-popups';
import { Component, OnInit, Inject, ElementRef, Optional, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ContactleadService } from '@app/core/services/contactlead.service';
import { ConversationService } from '@app/core';
import { MasterApiService, OfflineService, routes, ErrorMessage } from '@app/core/services';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { DatePipe } from '@angular/common';
import { RoutingState } from '@app/core/services/navigation.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ClearMyopenlead, ClearOpenLeadState, } from '@app/core/state/actions/leads.action';
import { removeSpaces, checkLimit, specialCharacter } from '@app/shared/pipes/white-space.validator';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { MyOpenLeadsService, LeadCustomErrorMessages, leadAdvnHeaders, leadAdvnNames, DnBAccountHeader } from '@app/core/services/myopenlead.service';
import { ClearMeetingList, ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { environment as env } from '@env/environment';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { ActivityService } from '@app/core/services/activity.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import { EnvService } from '@app/core/services/env.service';

declare let FileTransfer: any;
export interface selectedCustomer {
  FullName: string,
  Designation: string,
  isKeyContact: boolean,
  SysGuid: string,
  MapGuid: string,
  Email:string,
  LinkActionType: number
}
export interface selectedContact {
  FullName: string,
  Designation: string,
  MapGuid: string,
  SysGuid: string
}
export interface selectedOppertunity {
  Type: string,
  MapGuid: string,
  Guid: string,
  Title: string,
  LinkActionType: number
}

export const ServiceLineTable: any[] = [
  { id: 1, name: 'serviceLines', title: 'Service line', place: 'Search service line', controltype: 'autocomplete', closePopUp: "@serviceLines", serviceData: [], reqFildId: 'Guid', isRequired: true, IsRelation: ["practice", "slbdm"], ErrMsg: "Please search service line name" },
  { id: 1, name: 'practice', title: 'Practice', place: 'Search practice', controltype: 'autocomplete', closePopUp: "@practice", serviceData: [], reqFildId: 'practiceGuid', isRequired: false },
  { id: 1, name: 'slbdm', title: 'SL BDM', place: 'Search service line BDM', controltype: 'autocomplete', closePopUp: "@slbdm", serviceData: [], reqFildId: 'bdmidGuid', isRequired: true, submit: true, ErrMsg: "Please search SL BDM name" },
]
@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit, OnDestroy {
  addcommmentpopover: boolean = false;
  viewcommentpopover: boolean
  autooverlay = false
  leadDetailsForm: FormGroup;
  leadDealOwnerForm: FormGroup; leadinfo = true;
  dealinfo = false;
  twoactive = false;
  items: any;
  lists: any;
  check: any;
  checking: any;
  listing: any;
  term;
  term1;
  term2;
  term3;
  term4;
  consent = false;
  agendaview = true;
  emailview = false;
  suggestion = false;
  suggestion1 = false;
  suggestion2 = false;
  suggestion3 = false;
  suggestion4 = false;
  enquiry: any;
  enquiryType: any[]
  leadType: any[];
  leadData;
  ServiceTable = [];
  LeadSource: Array<any>;
  companyNameSearch: any = [];
  Vertical: Array<any>;
  Conversationsagp: Array<any>;
  Conversationscamp: Array<any>;
  Conversationsoppo: Array<any>;
  Conversationssbu: Array<any>;
  ConversationsserviceLine: Array<any>;
  Conversationslead: Array<any>
  accntCompany: any;
  enquiryId: any;
  verticalId: string = "";
  serviceline: any;
  leadSource: any
  linkGuid = '';
  campaignId: any;
  leadSourceId: string = "";
  sbuId: string = "";
  servicelineSysGuid: any;
  selectedCustomer: selectedCustomer[] = [];
  customerContactdetails: Array<any>;
  wiproContactdetails: Array<any>;
  wiproContactowner: Array<any>;
  currency: Array<any>;
  currencyId: string = "";
  currencyRateValue: any;
  leadOwnerId: string = '';
  leadguId: any;
  cantactName: any;
  selectedOppertunity: selectedOppertunity[] = [];
  selectedContact: selectedContact[] = [];
  selectedContactowner: {}[] = [];
  initialVal: any;
  isLoading: boolean = false;
  conversationId: any;
  CreateLeadDetails: any = [];
  selectedConversation: any = []
  IsChildLead: boolean = false;
  conversationArr: any;
  ActivitiesLeadArr: any;
  tableName: any;
  Isprospect: any;
  Account: any;
  allcampaigndetails: any = [];
  ActiveCampaignDetails: any = [];
  isvalidation: boolean = false;
  disableOpportunity: boolean = true;
  userSysGuid: any;
  LeadGuid: any;
  isCreateLead: boolean = false;
  autofilledId: string = "";
  isFormValid: boolean = true
  currencyres: any;
  showConversationsbu: boolean = false;
  Conversationsbu: string = "";
  ConversationNameSwitchsbu: boolean = false;
  showConversationleadsrc: boolean = false;
  Conversationleadsrc: string = "";
  ConversationNameSwitchleadSource: boolean = false;
  showConversationserviceline: boolean = false;
  Conversationserviceline: string = "";
  ConversationNameSwitchserviceline: boolean = true;
  selectedServiceLine: any = [];
  servicelisList: any = [];
  showConversationvertical: boolean = false;
  Conversationvrtcl: string = "";
  ConversationNameSwitchvertical: boolean = false;
  showConversation: boolean = false;
  Conversation: string = "";
  ConversationNameSwitch: boolean = false;
  wiproProspectAccount: any = '';
  customerAccount: any = '';
  nameAutoFill = '';
  showConversationlead: boolean = false;
  Conversationlead: string = "";
  ConversationNameSwitchlead: boolean = false;
  conversationList: any = [];
  showConversationcamp: boolean = false;
  Conversationcamp: string = "";
  ConversationNameSwitchcamp: boolean = false;
  selectedCamp: any = [];
  campList: any = [];
  showConversationoppo: boolean = false;
  Conversationoppo: string = "";
  ConversationNameSwitchoppo: boolean = false;
  oppArr: any = [];
  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = false;
  showConversationagp: boolean = false;
  Conversationagp: string = "";
  ConversationNameSwitchagp: boolean = false;
  selectedAgp: any = [];
  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = true;
  showContactorigin: boolean = false;
  contactNameorigin: string = "";
  contactNameSwitchorigin: boolean = true;
  selectedContactorigin: {}[] = [];
  showContactowner: boolean = false;
  contactNameowner: string = "";
  contactNameSwitchowner: boolean = false;
  addComments = true;
  IsOwnerChildLead: boolean = false;
  commentId: any;
  verticalName: any;
  leadSourceName: any;
  sbuName: any;
  selectedservicelineauto: {}[] = [];
  servicelineautoArr: any = [];
  servicelineTable_Data: any[];
  servicelinesitems: FormArray;
  id: any;
  serviceTabledata: any = [];
  serviceTableName: any = [];
  Orinator: any;
  isdelete: boolean = false;
  descriptionLength: boolean = false;
  createClicked: boolean = false;
  sixMonthDate: any;
  StartDate: any;
  userId: any;
  submit: any;
  disableSbu: boolean = true;
  disableCurrency: boolean = true;
  disableVertical: boolean = true;
  AllianceAccountArr: any = [];
  AdvisorAccountArr: any = [];
  addLeadContactFlag: any;
  TempFomData: any;
  AccountSelected: any;
  VerticalSelected: any;
  SbuSelected: any;
  leadSourceSelected: any;
  enqiuryTypedata: any;
  tempSevicelineData: [];
  AllianceData: any;
  AdvisorData: any;
  leadSrcName: string = "";
  createleadId: any;
  tableInValid: boolean = false;
  dontGoNextStep: boolean = false;
  selectedAll: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  showservicelineauto: boolean = false;
  servicelineauto: string;
  servicelineautoSwitch: boolean = true;
  ServiceMapGuid: any;
  createId: any;
  servicelinesguid: any;
  practiceGuid: any;
  bdmGuid: any;
  SGuid: any;
  searchitem = ""
  searchPractice = ""
  searchSlbdm = ""
  AdvisorsInflunce: boolean = false;
  Alliance_Partner: boolean = false;
  isCampaign: boolean = false;
  isAnalyst: boolean = false;
  isAdvertisementCampaign: Boolean = false;
  isMCICampaign: boolean = false;
  AllianceAccountguid: string = "";
  AllianceName: string = "";
  allianceAccountSwitch: boolean = false;
  Verticaldetails: any;
  equiryName: any;
  AccName: string = '';
  ConversationName: any;
  activicityMapguid: any;
  linkName: any;
  AdvisorAccountguid: string = "";
  AdvisorName: string = "";
  CurrencySwitch: boolean = false
  AdvisorAccountSwitch: boolean = false;
  disableAccount: boolean
  disableActivityGroup: boolean = true;
  disableCampaign: boolean = true;
  // disableLeadOwner: boolean
  disableContacts: boolean
  AdvisorsAccount: boolean;
  AllianceAccount: boolean;
  requestCamp: boolean;
  countrySwitch: boolean = false;
  leadOwnerName: string = '';
  ExistingActivityData = []
  finalActivityGroup = []
  ExistingCampaignData = []
  finalCampaignGroup = [];
  ExistingOpportunityData = []
  finalOppotunityGroup = []
  ExistingContactData = []
  finalContactGroup = []
  ExistingAgpData = []
  finalAgpGroup = []
  ExistingWiproSolutionData = []
  finalWiproSolutionGroup = []
  TempLeadDetails
  IsModuleSwitch
  ModuleSwitch
  countrySearch: any;
  iswiprosolution: boolean;
  isServicelines: boolean;
  wiproSolustionSwitch: boolean = false;
  selectedWiproSolution = [];
  wiproSolutionsearch: any;
  selectedCountry: any;
  countryId: string = "";
  countryName: string = "";
  currencySelected
  currencyName: string = "";
  isCurrencySearchLoading: boolean = false
  isLeadSourceNameSearchLoading: boolean = false
  isAccountSearchLoader: boolean = false
  isSbuLoder: boolean = false
  isVerticalLoader: boolean = false
  isAllianceLoader: boolean = false
  isAdvisorLoader: boolean = false
  isCountryLoading: boolean = false
  iswiproSolutionLoader: boolean = false
  isServicelineLoader: boolean = false
  isAcivityGroupLoader: boolean = false
  isCampaignLoading: boolean = false
  isOpportunityLoader: boolean = false
  isAgpLoader: boolean = false
  isLeadOwnerLoader: boolean = false
  isCustometContactLoader: boolean = false
  arrowkeyLocation = 0;
  AccId: string = "";
  isProspect: boolean;
  testingarray = ["1", "2"]
  disabledOriginator: boolean = true
  showFormMode: number = 0
  showFirstForm: boolean;
  moduleTypeStateData
  dealValueError: boolean = false;
  isCurrencyMandatory: boolean = false
  OriginatorDetails: any = [];
  CurrencyArrayList: any = []
  RequestAlliance: boolean;
  accountdetails = [];
  headerdb = [];
  enquiryTypeAria: any = ''
  sendCampaignToAdvance = []
  sendAccountToAdvance: any = []
  sendAllianceToAdvance: any = []
  sendOwnerToAdvance: any = []
  sendWiproSolutionToAdvance: any = []
  sendActivityToAdvance: any = []
  sendOppToAdvance: any = []
  sendCustomerToAdvance: any = []
  sendAdvisorToAdvance: any = []
  isFromMeeting: boolean = false;
  dalaValue: any;
  // accountModuleRouting : any;
  //advance look up data
  ActivityAdvanceData: any=[];
  CampaignAdvanceData: any=[];
  OppAdvanceData: any=[];
  WiproSolAdvanceData: any=[];
  customerAdvanceData: any=[];
  @ViewChild('searchAccountNameList')
  acc: ElementRef
  //------------------------------------advance lookup ts file starts--------------------------------//
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
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
  isMobileDevice : boolean = false;
  IdentifyAppendFunc = {
    'accountSearch': (data) => { this.appendAccountName(data.Name, data, true, true, true, 0) },
    'allianceSearch': (data) => { this.appendalliance(data.Name, data, true, 0) },
    'advisorSearch': (data) => { this.appendadvisor(data.Name, data, true, 0) },
    'ownerSearch': (data) => { this.appendOwner(data.FullName, data, true, 0) },
    'wiproSoluSearch': (data) => { this.appendWiproSolutions(data.Name, data, true, true, 0) },
    'activitySearch': (data) => { this.appendActivityGroup(data.Name, data, true, true, 0) },
    'campaignSearch': (data) => { this.appendCampaignGroup(data.Name, data, true, true, 0) },
    'oppoSearch': (data) => { this.appendOpportunityGroup(data.Name, data, true, true, 0) },
    'agpSearch': (data) => { this.appendAgpGroup(data.Name, data, true, 0) },
    'contactSearch': (data) => { this.appendCustomerGroup(data.FullName, data, true, true, 0) },
    'serviceLines': (data) => { this.appendservicelineauto(data, data.rowIndex, data.rowData, data.rowLine, true) },
    'practice': (data) => { this.appendservicelineauto(data, data.rowIndex, data.rowData, data.rowLine, true) },
    'slbdm': (data) => { this.appendservicelineauto(data, data.rowIndex, data.rowData, data.rowLine, true) }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendAccountToAdvance.length > 0) ? this.sendAccountToAdvance : [] }
      case 'allianceSearch': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
      case 'advisorSearch': { return (this.sendAdvisorToAdvance.length > 0) ? this.sendAdvisorToAdvance : [] }
      case 'ownerSearch': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : [] }
      case 'wiproSoluSearch': { return (this.sendWiproSolutionToAdvance.length > 0) ? this.sendWiproSolutionToAdvance : [] }
      case 'activitySearch': { return (this.sendActivityToAdvance.length > 0) ? this.sendActivityToAdvance : [] }
      case 'campaignSearch': { return (this.selectedCamp.length > 0) ? this.selectedCamp : [] }
      case 'oppoSearch': { return (this.sendOppToAdvance.length > 0) ? this.sendOppToAdvance : [] }
      case 'contactSearch': { return (this.sendCustomerToAdvance.length > 0) ? this.sendCustomerToAdvance : [] }
      default: { return [] }
    }
  }
  ngOnDestroy(): void {
  }

  //  cache current form details entered and push to redis 
  //  1)if he clicks save the clear the caches.
  //  2)if he clicks cancel clear the cache.
  //  3)if user creates lead from other modules , no need to bind the cache data but we have to update the cache
  //  4)if user tries to create contact and activity ,then we have to update the cache.
  CreateRedisCache() {
    if (!this.createClicked) {
      this.showFirstForm = this.checkShowFirstformOrSecond()
      this.AppendRedisCache()
    }
  }
  AppendRedisCache(data?) {
    this.service.SetRedisCacheData((data) ? (data) : (this.createTempData()), 'createLead').subscribe(res => {
      if (!res.IsError) {
        console.log("SUCESS FULL AUTO SAVE")
      }
    }, error => {
      console.log(error)
    })
  }
  checkShowFirstformOrSecond(): boolean {
    if (this.leadDealOwnerForm.value.dealName != '') {
      return false
    } else {
      return true
    }
  }
  // duplicates removed from advance lookup
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountSearch': {
        return this.AccountSelected = [], this.sendAccountToAdvance = []
      }
      case 'allianceSearch': {
        return this.AllianceData = [], this.sendAllianceToAdvance = []
      }
      case 'advisorSearch': {
        return this.AdvisorData = [], this.sendAdvisorToAdvance = []
      }
      case 'ownerSearch': {
        return this.selectedContactowner = [], this.sendOwnerToAdvance = []
      }
      case 'wiproSoluSearch': {
        return this.selectedWiproSolution = [], this.sendWiproSolutionToAdvance = []
      }
      case 'activitySearch': {
        return this.selectedConversation = [], this.sendActivityToAdvance = []
      }
      case 'campaignSearch': {
        return this.selectedCamp = []
      }
      case 'oppoSearch': {
        return this.selectedOppertunity = [], this.sendOppToAdvance = []
      }
      case 'contactSearch': {
        return this.selectedCustomer = [], this.sendCustomerToAdvance = []
      }
    }
  }
  //---------------------------------advance lookup ts file ends-------------------------------//
  constructor(
    public el: ElementRef,
    public router: Router,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public contactLeadService: ContactleadService,
    public conversationService: ConversationService,
    public leadFormBuilder: FormBuilder,
    private masterApi: MasterApiService,
    private newconversationService: newConversationService,
    private routingState: RoutingState,
    public matSnackBar: MatSnackBar,
    private datepipe: DatePipe,
    private offlineService: OfflineService,
    private EncrDecr: EncrDecrService,
    private store: Store<AppState>,
    private myOpenLeadService: MyOpenLeadsService,
    private errPopup: ErrorMessage,
    private meetingApi: MeetingService,
    private activityService: ActivityService,
    private S3MasterApiService: S3MasterApiService,
    private fileService: FileUploadService,
    private cacheDataService: CacheDataService,public envr : EnvService) {
    this.contactLeadService.attachmentList = []
    this.items = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
    this.lists = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
    this.listing = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
    this.check = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
    this.checking = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
    this.StartDate = new Date();
    var month = (this.StartDate.getMonth() + 6);
    var date = this.StartDate.getDate();
    var year = this.StartDate.getFullYear();
    this.sixMonthDate = new Date(year, month, date)
  }
  servicelineautoclick() {
    this.servicelineautoSwitch = true;
    this.leadDetailsForm.value.serviceLine = true;
    this.autooverlay = true;
  }
  practiceswitchauto() {
    this.leadDetailsForm.value.practice = true;
    this.autooverlay = true;
  }
  solutionswitchauto() {
    this.leadDetailsForm.value.slbdm = true;
    this.autooverlay = true;
  }
  closeoverlayauto() {
    this.autooverlay = false;
    this.leadDetailsForm.value.serviceLine = false;
    this.leadDetailsForm.value.practice = false;
    this.leadDetailsForm.value.slbdm = false;
    this.servicelineautoSwitch = false;
  }
  wiproSolutionData(data: string) {
    return data.replace(/ *\([^)]*\) */g, "");
  }

  ngOnInit() {
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    this.newconversationService.attachmentList = [];
    this.createClicked = false;
      this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
        localStorage.setItem('dNBToken', res.ResponseObject.access_token)
      })
    this.Orinator = localStorage.getItem('upn')
    let userID = localStorage.getItem('userID')
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', userID, 'DecryptionDecrip')
    this.OriginatorDetails = [{ FullName: this.Orinator, ownerId: this.userId }]
    this.servicelineTable_Data = ServiceLineTable;
    this.InitializeCreateForm()
    this.setValidatorsForCustomer()
    this.OnChange()
    this.appendOwner(this.OriginatorDetails[0].FullName, this.OriginatorDetails[0], 0, false)
    if (!sessionStorage.getItem('TempLeadDetails')) {
      // this.accountModuleRouting = undefined;
      this.servicelinesevent(false)
       // Auto save ,conditions - it shd not have any sesssion data to populate.
      this.service.GetRedisCacheData('createLead').subscribe(res => {
        this.isLoading = false
        if (!res.IsError) {
          if (res.ResponseObject) {
            if (res.ResponseObject != '') {
              this.TempLeadDetails = JSON.parse(res.ResponseObject)
              this.AppendTheFormData(this.TempLeadDetails)
              if (this.TempLeadDetails.attachments.length > 0) {
                this.contactLeadService.attachmentList = this.TempLeadDetails.attachments
              }
            } else {
              this.getenquiryType()
              //  this.createTableNewRow();
            }
          } else {
             this.getenquiryType()
            //  this.createTableNewRow();
          }
        }
      })
      this.getenquiryType()
      this.servicelinesevent(false)
      //  this.createTableNewRow();
    } else if (sessionStorage.getItem('TempLeadDetails')) { // module switch flow
      debugger
      console.log("APPENDING THE LOCAL TEMP MODULE SWITCH!!!")
      this.isLoading = false
      this.TempLeadDetails = JSON.parse(sessionStorage.getItem('TempLeadDetails'))
      // if create module is switched, we need to update cache
      this.AppendTheFormData(this.TempLeadDetails)
      this.AppendRedisCache(this.TempLeadDetails)
      // this.accountModuleRouting = (this.TempLeadDetails.moduletype.Moduleroute) ? this.TempLeadDetails.moduletype.Moduleroute : undefined;
    } else {
      this.getenquiryType()
      // this.createTableNewRow();
    }

    this.leadDetailsForm.controls.leadSource.valueChanges.subscribe(val => {
      if (this.ConversationNameSwitchleadSource) {
        this.isLeadSourceNameSearchLoading = true
        this.LeadSource = []
        this.contactLeadService.getsearchLeadSource(val).subscribe(res => {
          this.isLeadSourceNameSearchLoading = false
          if (res.IsError === false) {
            this.LeadSource = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.LeadSource = []
          }
        }, error => {
          this.isLeadSourceNameSearchLoading = false;
          this.LeadSource = []
        });
      }
    })

    this.leadDetailsForm.controls.accountOrCompanyName.valueChanges.subscribe(val => {
      if (this.ConversationNameSwitch) {
        this.isAccountSearchLoader = true
        this.companyNameSearch = []
        this.contactLeadService.getsearchAccountCompanyNew(val).subscribe(res => {
          this.isAccountSearchLoader = false
          this.isLoading = false;
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            this.companyNameSearch = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.companyNameSearch = []
          }
        }, error => {
          this.isAccountSearchLoader = false;
          this.companyNameSearch = []
        });
      }
    })

    this.leadDetailsForm.controls.sbu.valueChanges.subscribe(val => {
      if (val != "" && val != null && this.ConversationNameSwitchsbu) {
        this.isSbuLoder = true
        this.Conversationssbu = []
        this.contactLeadService.getsearchSBUbyName(val, this.AccId, this.isProspect).subscribe(res => {
          this.isSbuLoder = false
          if (res.IsError === false) {
            this.Conversationssbu = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.Conversationssbu = []
          }
        }, error => {
          this.isSbuLoder = false;
          this.Conversationssbu = []
        });
      }
      else {
        this.ResetValidatorsVerticalInput()
      }
    })

    this.leadDetailsForm.controls.vertical.valueChanges.subscribe(val => {
      if (val != "" && val != null && this.ConversationNameSwitchvertical) {
        this.isVerticalLoader = true
        this.Vertical = []
        let verticalSearchreqBody = {
          SearchText: "",
          Guid: this.AccId,
          SBUGuid: this.sbuId,
          isProspect: this.isProspect,
          PageSize: 10,
          OdatanextLink: "",
          RequestedPageNumber: 1
        }
        this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
          this.isVerticalLoader = false
          if (res.IsError === false) {
            this.Vertical = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.Vertical = []
          }
        }, error => {
          this.isVerticalLoader = false;
          this.Vertical = []
        });
      }
    })

    this.leadDetailsForm.controls.allianceAccount.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.allianceAccountSwitch) {
        this.isAllianceLoader = true
        this.AllianceAccountArr = []
        this.contactLeadService.GetAllianceAccount(val).subscribe(
          data => {
            this.isAllianceLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
              this.AllianceAccountArr = data.ResponseObject;
            } else {
              this.errPopup.throwError(data.Message);
              this.isAllianceLoader = false
            }
          }, error => {
            this.isAllianceLoader = false;
            this.AllianceAccountArr = []
          });
      }
    })

    this.leadDetailsForm.controls.advisorAccount.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.AdvisorAccountSwitch) {
        this.isAdvisorLoader = true
        this.AdvisorAccountArr = []
        this.contactLeadService.GetAdvisorAccount(val).subscribe(
          data => {
            this.isAdvisorLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
              this.AdvisorAccountArr = data.ResponseObject;
            } else {
              this.errPopup.throwError(data.Message);
              this.AdvisorAccountArr = []
            }
          }, error => {
            this.isAdvisorLoader = false;
            this.AdvisorAccountArr = []
          });
      }
    })

    this.leadDetailsForm.controls.country.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.countrySwitch) {
        this.isCountryLoading = true
        this.countrySearch = []
        this.contactLeadService.getCoutry(val).subscribe(data => {
          this.isCountryLoading = false
          if (data.IsError === false) {
            this.countrySearch = data.ResponseObject;
          } else {
            this.errPopup.throwError(data.Message);
            this.countrySearch = []
          }
        }, error => {
          this.isCountryLoading = false;
          this.countrySearch = []
        });
      }
    })

    this.leadDetailsForm.controls.WiproSolutions.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.wiproSolustionSwitch) {
        this.iswiproSolutionLoader = true
        this.wiproSolutionsearch = []
        this.contactLeadService.getWiproSolutions(val).subscribe(
          data => {
            this.iswiproSolutionLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
              this.WiproSolAdvanceData = data.ResponseObject;
              if (this.selectedWiproSolution.length > 0 && data.ResponseObject.length > 0) {
                this.wiproSolutionsearch = this.CompareRemoveSelected(data.ResponseObject, this.selectedWiproSolution, "SysGuid")
              } else {
                this.wiproSolutionsearch = data.ResponseObject;
              }
            } else {
              this.errPopup.throwError(data.Message);
              this.wiproSolutionsearch = []
            }
          }, error => {
            this.iswiproSolutionLoader = false;
            this.wiproSolutionsearch = []
          });
      }
    })

    this.leadDetailsForm.controls.activityGroup.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.ConversationNameSwitchlead) {
        this.isAcivityGroupLoader = true
        this.Conversationslead = []
        this.contactLeadService.getSearchActivityGroup(val, this.AccId, this.isProspect).subscribe(res => {
          this.isAcivityGroupLoader = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            this.ActivityAdvanceData = res.ResponseObject;
            if (this.selectedConversation.length > 0 && res.ResponseObject.length > 0) {
              this.Conversationslead = this.CompareRemoveSelected(res.ResponseObject, this.selectedConversation, "Guid")
            } else {
              this.Conversationslead = res.ResponseObject;
            }
          } else {
            this.errPopup.throwError(res.Message)
            this.Conversationslead = []
          }
        }, error => {
          this.isAcivityGroupLoader = false;
          this.Conversationslead = []
        });
      }
    })

    this.leadDetailsForm.controls.campaign.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.ConversationNameSwitchcamp) {
        this.isCampaignLoading = true
        this.Conversationscamp = []
        this.contactLeadService.getsearchCampaign(val, this.AccId, this.isProspect).subscribe(res => {
          this.isCampaignLoading = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            this.CampaignAdvanceData = res.ResponseObject
            if (this.selectedCamp.length > 0 && res.ResponseObject.length > 0) {
              this.Conversationscamp = this.CompareRemoveSelected(res.ResponseObject, this.selectedCamp, "Id")
            } else {
              this.Conversationscamp = res.ResponseObject;
            }
          } else {
            this.errPopup.throwError(res.Message);
            this.Conversationscamp = []
          }
        }, error => {
          this.isCampaignLoading = false;
          this.Conversationscamp = []
        });
      }
    })

    this.leadDetailsForm.controls.opportunity.valueChanges.subscribe(val => {
      if (val !== "" && this.ConversationNameSwitchoppo) {
        this.isOpportunityLoader = true
        this.Conversationsoppo = []
        this.contactLeadService.searchOpportunityOrder(val, this.AccId, this.isProspect).subscribe(res => {
          this.isOpportunityLoader = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            this.OppAdvanceData = res.ResponseObject;
            if (this.selectedOppertunity.length > 0 && res.ResponseObject.length > 0) {
              this.Conversationsoppo = this.CompareRemoveSelected(res.ResponseObject, this.selectedOppertunity, "Guid")
            } else {
              this.Conversationsoppo = res.ResponseObject;
            }
          } else {
            this.errPopup.throwError(res.Message);
            this.Conversationsoppo = []
          }
        }, error => {
          this.isOpportunityLoader = false;
          this.Conversationsoppo = []
        });
      }
    })

    this.leadDetailsForm.controls.link.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.ConversationNameSwitchagp) {
        this.isAgpLoader = true
        this.Conversationsagp = []
        this.contactLeadService.getsearchLinkAGP(val).subscribe(res => {
          this.isAgpLoader = false
          if (res.IsError === false) {
            this.Conversationsagp = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.Conversationsagp = []
          }
        }, error => {
          this.isAgpLoader = false;
          this.Conversationsagp = []
        });
      }
    })

    this.leadDetailsForm.controls.leadOwner.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.contactNameSwitchowner) {
        this.isLeadOwnerLoader = true
        this.wiproContactowner = []
        this.contactLeadService.getsearchLeadOwner(val).subscribe(data => {
          this.isLeadOwnerLoader = false
          if (data.IsError === false) {
            this.lookupdata.TotalRecordCount = data.TotalRecordCount
            this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            this.wiproContactowner = data.ResponseObject;
          } else {
            this.errPopup.throwError(data.Message);
            this.wiproContactowner = []
          }
        }, error => {
          this.isLeadOwnerLoader = false;
          this.wiproContactowner = []
        });
      }
    })

    this.leadDealOwnerForm.controls.currency.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.CurrencySwitch) {
        this.isCurrencySearchLoading = true
        this.CurrencyArrayList = []
        this.contactLeadService.getsearchCurrency(val).subscribe(res => {
          this.isCurrencySearchLoading = false
          if (res.IsError === false) {
            this.CurrencyArrayList = res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
          } else {
            this.errPopup.throwError(res.Message);
            this.CurrencyArrayList = []
          }
        }, error => {
          this.isCurrencySearchLoading = false;
          this.CurrencyArrayList = []
        });
      }
    })

    this.leadDealOwnerForm.controls.customerContact.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.customerNameSwitch) {
        this.isCustometContactLoader = true
        this.customerContactdetails = []
        this.contactLeadService.searchCustomerparticipants(val, this.AccId, this.isProspect).subscribe(data => {
          this.isCustometContactLoader = false
          if (data.IsError === false) {
            this.lookupdata.TotalRecordCount = data.TotalRecordCount
            this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            this.customerAdvanceData =data.ResponseObject;
            if (this.selectedCustomer.length > 0 && data.ResponseObject.length > 0) {
              this.customerContactdetails = this.CompareRemoveSelected(data.ResponseObject, this.selectedCustomer, "Guid")
            } else {
              this.customerContactdetails = data.ResponseObject;
            }
            this.customerContactdetails = data.ResponseObject;
          } else {
            this.errPopup.throwError(data.Message);
            this.customerContactdetails = []
          }
        }, error => {
          this.isCustometContactLoader = false;
          this.customerContactdetails = []
        });
      }
    })
  }

  AppendTheFormData(data) {
    this.ModuleSwitch = data.moduleSwitch
    this.showFirstForm = data.showFirstForm
    this.moduleTypeStateData = (data.moduletype) ? data.moduletype : null
    this.populateCreateLeadForm(data)
    if (!this.ModuleSwitch) {
      this.LeadNameValidation();
      if (!this.showFirstForm) {
        this.steptwo()
      }
    }
    this.ServiceTable.forEach(res => {
      ServiceLineTable.forEach(item => {
        res[item.closePopUp] = false
      })
    })
  }

  closepopover() {
    this.addcommmentpopover = false;
  }
  LeadNameChange() {
    this.CreateRedisCache()
  }
  savepopover(index) {
    this.viewcommentpopover = true;
    this.addcommmentpopover = false;
    console.log(`comments ${this.leadDetailsForm.value.comments}`)
    this.contactLeadService.attachmentList[index].Comments[0].Description = this.leadDetailsForm.value.comments
  }
  commentindex = -1
  onAddCommentPopup(index) {
    this.commentindex = index
    this.leadDetailsForm.patchValue({
      comments: ''
    })
    this.addcommmentpopover = true
  }
  onViewCommentPopUp(index) {
    this.commentindex = index
    this.leadDetailsForm.patchValue({
      comments: this.contactLeadService.attachmentList[index].Comments[0].Description
    })
    this.addcommmentpopover = true
  }
  CompareRemoveSelected(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }
  SbuVerticalreset(val) {
    if (val == '') {
      this.AccId = undefined;
      this.disableSbu = true;
      this.disableVertical = true;
      this.sbuId = undefined;
      this.verticalId = undefined;
      this.leadDetailsForm.controls.sbu.patchValue('')
      this.leadDetailsForm.controls.vertical.patchValue('')
    }
  }

  get f() {
    return this.leadDetailsForm.controls
  }
  get F() {
    return this.leadDealOwnerForm.controls
  }
  get lines() {
    return this.leadDetailsForm.get("lines") as FormArray;
  }

  InitializeCreateForm() {
    this.leadDetailsForm = this.leadFormBuilder.group({
      leadName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      leadSource: ['', Validators.required],
      allianceAccount: [''],
      advisorAccount: [''],
      accountOrCompanyName: ['', { validators: Validators.required }, { disabled: this.disableAccount }],
      accountOrProspect: new FormControl({ value: '', disabled: true }, Validators.required),
      vertical: ['', { disabled: this.disableVertical }],
      sbu: ['', { disabled: this.disableSbu }],
      activityGroup: ['', { disabled: this.disableActivityGroup }],
      campaign: ['', { disabled: this.disableCampaign }],
      opportunity: ['', { disabled: this.disableOpportunity }],
      link: [''],
      enquiryType: [''],
      description: [''],
      serviceLineToggle: [false],
      WiproSolutionToggle: [false],
      country: [''],
      WiproSolutions: [''],
      leadOriginator: new FormControl({ value: this.Orinator, disabled: true }),
      leadOwner: ['', Validators.required ],
      comments: ['']
    });
    this.leadDealOwnerForm = this.leadFormBuilder.group({
      dealName: ['', Validators.required],
      currency: ['', Validators.required],
      estimatedRateValue: [''],
      timeline: ['', Validators.required],
      customerContact: ['', { disabled: this.disableContacts }],
      wiproContact: ['']
    });
  }
  leadNameChanges : string = "";

  leadInputChange(event) {
    this.leadNameChanges = event.target.value;
  }

  dealValuewithComma(val, isRedisCache){
    if(val != ''){
      var x = val.split('.')
      var diffentiateComma = x[0].replace(/\D/g,"")
      if(diffentiateComma.length > 10){
        this.leadDealOwnerForm.get('dealName').setErrors({"dealValueInvalid" : true}) 
      }
      else{
        var b = Number(diffentiateComma).toLocaleString('en-US')
        if(x[1]){
          this.leadDealOwnerForm.patchValue({
            dealName:`${b}.${x[1]}`
          })
     
          } else {
              this.leadDealOwnerForm.patchValue({
                dealName:`${b}.00`
              })
          }
      }
    }else{
        this.leadDealOwnerForm.patchValue({
          dealName:''
        })
    }
    if(isRedisCache){
      this.CreateRedisCache()
    }
  }

  removeCommas(number){
    number = number.replace(/[.,\s]/g, '');
    number = number.substring(0, number.length - 2)
      this.leadDealOwnerForm.patchValue({
        dealName: number
      })
  }

  appendleadSource(value, item, isRedisCache, i) {
    this.leadSourceSelected = item
    this.leadSourceId = item.SysGuid;
    this.leadSrcName = item.Name;
    this.leadDetailsForm.patchValue({
      leadSource: value
    })
    this.ConversationNameSwitchleadSource = false;
    this.leadSourceDependencyFunctions(value)
    this.AdvisorName=''
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  leadSourceDependencyFunctions(value) {
    if (value === "Advisors ( Influencers )" || value === "Analysts") {
      this.requestCamp = false
      this.showAdvisorAccount()
    } else if (value === "Alliance/Partner") {
      this.requestCamp = false
      this.showAllianceAccount()
    } else if (value == "Advertisement" || value == "M&CI - iProfile" || value == "Events" || value == "Conference" || value == "Campaign") {
      this.clearAllianceAdvisorValidators()
      this.makeRequestCampaignValidators()
    } else {
      this.requestCamp = false
      this.clearAllianceAdvisorValidators()
    }
  }

  leadSourceClearDependencyFunctions(value) {
    if (value === "Advisors ( Influencers )" || value === "Analysts") {
      this.AdvisorsAccount = false;
      this.AdvisorAccountguid = "";
      this.AdvisorName = "";
      this.leadDetailsForm.controls.advisorAccount.clearValidators()
      this.leadDetailsForm.controls.advisorAccount.reset()
    } else if (value === "Alliance/Partner") {
      this.leadDetailsForm.controls.allianceAccount.clearValidators()
      this.RequestAlliance = false
      this.leadDetailsForm.controls.allianceAccount.reset(this.leadDetailsForm.controls.allianceAccount.value)
    } else if (value == "Advertisement" || value == "M&CI - iProfile" || value == "Events" || value == "Conference" || value == "Campaign") {
      this.leadDetailsForm.controls.campaign.reset()
      this.leadDetailsForm.controls.campaign.clearValidators()
      this.requestCamp = false
    }
  }

  appendCurrency(value, item, isRedisCache, i) {
    this.currencySelected = item
    this.currencyId = item.Id;
    this.currencyName = item.Desc;
    this.leadDealOwnerForm.patchValue({
      currency: value
    })
    this.CurrencySwitch = false;
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  makeRequestCampaignValidators() {
    if (this.selectedCamp.length > 0) {
      this.requestCamp = false
      this.removeValidatorsForCampaign()
    } else {
      this.setValidatorsForCampaign()
      this.requestCamp = true
    }
  }
  removeValidatorsForCampaign() {
    this.leadDetailsForm.controls.campaign.clearValidators()
    this.leadDetailsForm.controls.campaign.reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  setValidatorsForCampaign() {
    this.leadDetailsForm.controls.campaign.setValidators([Validators.required])
    this.leadDetailsForm.patchValue({
      campaign: ""
    })
    this.leadDetailsForm.updateValueAndValidity()
  }
  /**
   * 
   * @param value - value(name) which was selected
   * @param item  - full item which was clicked
   * @param sbuverticalFlag - To auto bind the sbu and vertical value based on accid
   * @param AccLinkedFlag - To clear the linked data(link activity,campaign,opp,contacts) if account is changed
   */
  appendAccountName(value: string, item, sbuverticalFlag, AccLinkedFlag, isRedisCache, i) {
    // if (i > this.companyNameSearch.length) {
    //   this.openadvancetabs('accountSearch', this.companyNameSearch, this.leadDetailsForm.get('accountOrCompanyName').value);
    //   this.AccountNameclose();
    // } else {
      this.accntCompany = '';
      this.AccName = item.Name;
      this.AccountSelected = item
      this.sendAccountToAdvance.push({ ...item, Id: item.SysGuid })
      this.AccId = item.SysGuid
      this.isProspect = item.isProspect

      // this.contactLeadService.GetValidAccount(item.SysGuid, item.isProspect, 1).subscribe(res => {
      //   if (res.IsError == false) {
          if (this.AccId != '' || this.AccId != null || this.AccId != undefined) {
            this.disableCampaign = false
            this.disableActivityGroup = false
            this.disableOpportunity = false
          }
          // linked leads are enabled when account is present
          if (AccLinkedFlag) {
            this.delinkAccountChanges()
          }
          if (item.isProspect) {
            this.leadDetailsForm.patchValue({ accountOrProspect: "Prospect" })
            this.wiproProspectAccount = item.SysGuid;
            this.customerAccount = ''
            this.isProspect = true
          } else {
            this.leadDetailsForm.patchValue({ accountOrProspect: "Account" })
            this.customerAccount = item.SysGuid;
            this.wiproProspectAccount = ''
            this.isProspect = false
          }
          this.leadDetailsForm.patchValue({
            accountOrCompanyName: value
          })

          if (isRedisCache) {
            this.CreateRedisCache()
          }
          // 1)auto populate SBU & Vertical from ACC ID if flag is true
          // 2)SBU & Vertical disabled when auto populate SBU & vertical from ACC
            let SbuReqParam = {
              Guid: this.AccId,
              isProspect: item.isProspect
            }
            this.myOpenLeadService.GetSbuAccountdata(SbuReqParam).subscribe(res => {
              if (!res.IsError) {
                if (res.ResponseObject.length > 0) {
                    this.appendConversationsbu(res.ResponseObject[0].Name, res.ResponseObject[0], true, 0)
                    this.disableSbu = true
                    this.disableVertical = true
                } else {
                  this.ConversationNameSwitchsbu = false
                  this.resetSbuVerAccount()
                }
              } else {
                this.ConversationNameSwitchsbu = false
                this.errPopup.throwError(res.Message)
                this.resetSbuVerAccount()
              }
            }, error => {
              this.ConversationNameSwitchsbu = false
              this.resetSbuVerAccount()
            })
      //   } else if (res.IsError == true) {
      //     this.errPopup.throwError(res.Message)
      //     this.leadDetailsForm.patchValue({
      //       accountOrCompanyName: ""
      //     })
      //     this.AccId = ""
      //     this.acc.nativeElement.value = '';
      //     this.resetSbuVerAccount()
      //   }
      // }, error => {
      //   this.companyNameSearch = [];
      //   this.leadDetailsForm.patchValue({
      //     accountOrCompanyName: ""
      //   })
      //   this.acc.nativeElement.value = '';
      // });
      this.ConversationNameSwitch = false
    // }
  }
  resetSbuVerAccount() {
    this.sbuId = ""
    this.leadDetailsForm.controls.sbu.reset()
    this.ResetValidatorsVerticalInput()
    this.isServicelines = false
    this.leadDetailsForm.patchValue({
      serviceLineToggle: false
    })
    this.ServiceTable = [];
    this.createTableNewRow()
  }
  appendConversationsbu(value: string, item, isRedisCache, i) {
    this.SbuSelected = item
    this.sbuId = item.Id;
    this.sbuName = value;
    this.leadDetailsForm.patchValue({
      sbu: value
    })
    let verticalSearchreqBody = {
      SearchText: "",
      Guid: this.AccId,
      SBUGuid: this.sbuId,
      isProspect: this.isProspect,
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
      if (!res.IsError) {
            this.appendVertical(res.ResponseObject[0].Name, res.ResponseObject[0], true)
            this.disableVertical = true
      }
    })
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendVertical(value: string, item, isRedisCache) {
    if (this.leadDetailsForm.value.sbu != '') {
      this.VerticalSelected = item
      this.verticalId = item.Id;
      this.verticalName = value;
      this.leadDetailsForm.patchValue({
        vertical: value
      })
      this.ConversationNameSwitchvertical = false;
    } else {
      this.ResetValidatorsVerticalInput()
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendalliance(value: string, item, isRedisCache, i) {
    this.AllianceData = item
    this.AllianceAccountguid = item.Guid;
    this.AllianceName = item.Name;
    this.sendAllianceToAdvance.push({ ...item, Id: item.Guid })
    this.leadDetailsForm.patchValue({
      allianceAccount: value
    })
    this.allianceAccountSwitch = false;
    this.AdvisorAccountguid = ""
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendadvisor(value: string, item, isRedisCache, i) {
    if (i > this.AdvisorAccountArr.length) {
      this.openadvancetabs('advisorSearch', this.AdvisorAccountArr, this.leadDetailsForm.get('advisorAccount').value);
      this.Leadadvisorclose();
    } else {
      this.AdvisorData = item
      this.AdvisorAccountguid = item.Guid;
      this.AdvisorName = item.Name;
      this.sendAdvisorToAdvance.push({ ...item, Id: item.Guid })
      this.leadDetailsForm.patchValue({
        advisorAccount: value
      })
      this.AdvisorAccountSwitch = false
      this.AllianceAccountguid = ""

      if (isRedisCache) {
        this.CreateRedisCache()
      }
    }
  }

  appendEnquiryTypeMOb(event) {
    if (!this.isEmpty(event)) {
      this.enquiryId = event.target.value;
      this.enquiryType.forEach(element => {
        if (element.Id == this.enquiryId) {
          this.equiryName = element.Value
          this.enquiryTypeAria = this.equiryName
        }
      })
      this.enqiuryTypedata = { Id: this.enquiryId, Name: this.equiryName }
    }
    this.CreateRedisCache()
  }
  appendEnquiryType(event) {
    if (!this.isEmpty(event)) {
      this.enquiryId = event.value;
      this.enquiryType.forEach(element => {
        if (element.Id == this.enquiryId) {
          this.equiryName = element.Value
          this.enquiryTypeAria = this.equiryName
        }
      })
      this.enqiuryTypedata = { Id: this.enquiryId, Name: this.equiryName }
    }
    this.CreateRedisCache()
  }

  appendCountry(value: string, item, isRedisCache, i) {
    this.selectedCountry = item
    this.countryId = item.SysGuid
    this.countryName = item.Name
    this.leadDetailsForm.patchValue({
      country: value
    })
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendWiproSolutions(value: string, item, checkDuplicateItem, isRedisCache, i) {
    this.leadDetailsForm.patchValue({
      WiproSolutions: ""
    })
    const result = this.myOpenLeadService.GenerateLinkActionType(item, this.ExistingWiproSolutionData, this.finalWiproSolutionGroup, "SysGuid")
    item = result.item,
      this.finalWiproSolutionGroup = result.data
    if (checkDuplicateItem && this.selectedWiproSolution.some(x => x.SysGuid == item.SysGuid)) {
      this.errPopup.throwError(LeadCustomErrorMessages.WiproSolutionDuplicateError)
    }
    this.selectedWiproSolution.push(item)
    this.sendWiproSolutionToAdvance.push({ ...item, Id: item.SysGuid })
    this.selectedWiproSolution = this.service.removeDuplicates(this.selectedWiproSolution, "SysGuid");
    if (this.selectedWiproSolution.length > 0) {
      this.removeValidatorsWiproSolution()
    }
    this.wiproSolustionSwitch = false
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendActivityGroup(value: string, item, checkDuplicateItem, isRedisCache, i) {
    this.leadDetailsForm.patchValue({
      activityGroup: ""
    })
    const result = this.myOpenLeadService.GenerateLinkActionType(item, this.ExistingActivityData, this.finalActivityGroup, "Guid")
    item = result.item,
      this.finalActivityGroup = result.data
      this.sendActivityToAdvance.push({ ...item, Id: item.Guid })
    if (checkDuplicateItem && this.selectedConversation.some(x => x.Guid == item.Guid)) {
      this.errPopup.throwError(LeadCustomErrorMessages.ActivityDuplicateError)
    }
    this.selectedConversation.push(item)
    this.selectedConversation = this.service.removeDuplicates(this.selectedConversation, "Guid");
    this.ConversationNameSwitchlead = false;
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendCampaignGroup(value: string, item, checkDuplicateItem, isRedisCache, i) {
    this.campaignId = item.Id;
    const result = this.myOpenLeadService.GenerateLinkActionType(item, this.ExistingCampaignData, this.finalCampaignGroup, "Id")
    item = result.item,
      this.finalCampaignGroup = result.data
    if (checkDuplicateItem && this.selectedCamp.some(x => x.Id == item.Id)) {
      this.errPopup.throwError(LeadCustomErrorMessages.CampaignDuplicateError)
    }
    this.selectedCamp.push(item)
    this.selectedCamp = this.service.removeDuplicates(this.selectedCamp, "Id");
    this.leadDetailsForm.patchValue({
      campaign: ""
    })
    this.ConversationNameSwitchcamp = false;
    if (this.selectedCamp.length > 0) {
      this.leadDetailsForm.controls['campaign'].clearValidators()
      this.leadDetailsForm.controls['campaign'].reset()
      this.leadDetailsForm.updateValueAndValidity()
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }


  appendOpportunityGroup(value: string, item, checkDuplicateItem, isRedisCache, i) {
    this.leadDetailsForm.patchValue({ opportunity: value })
    let json = { Guid: item.Guid, MapGuid: (item.MapGuid) ? item.MapGuid : "", Title: item.Title, Type: item.Type, LinkActionType: 1 }
    let json1 = { Guid: item.Guid, MapGuid: (item.MapGuid) ? item.MapGuid : "", Title: item.Title, Type: item.Type, LinkActionType: 1, Id: item.Guid }
    const result = this.myOpenLeadService.GenerateLinkActionType(json, this.ExistingOpportunityData, this.finalOppotunityGroup, "Guid")
    item = result.item,
    this.finalOppotunityGroup = result.data
    if (checkDuplicateItem && this.selectedOppertunity.some(x => x.Guid == json.Guid)) {
      this.errPopup.throwError(LeadCustomErrorMessages.OpportunityDuplicateError)
    }
    this.selectedOppertunity.push(json);
    this.sendOppToAdvance.push(json1)
    this.ConversationNameSwitchoppo = false
    this.selectedOppertunity = this.service.removeDuplicates(this.selectedOppertunity, "Guid");
    this.leadDetailsForm.controls.opportunity.reset();
    this.leadDetailsForm.updateValueAndValidity()
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendAgpGroup(value: string, item, isRedisCache, i) {
    this.linkGuid = item.SysGuid;
    this.linkName = item.Name
    const result = this.myOpenLeadService.GenerateLinkActionType(item, this.ExistingAgpData, this.finalAgpGroup, "SysGuid")
    item = result.item,
    this.finalAgpGroup = result.data
    this.selectedAgp = []
    this.selectedAgp.push(item)
    this.selectedAgp = this.service.removeDuplicates(this.selectedAgp, "SysGuid");
    this.leadDetailsForm.controls.link.reset();
    this.leadDetailsForm.updateValueAndValidity()
    this.ConversationNameSwitchagp = false;
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendOwner(value: string, item, i, isRedisCache) {
    this.leadOwnerId = item.ownerId;
    this.leadOwnerName = value
    this.selectedContactowner = [{ FullName: item.FullName, ownerId: item.ownerId }];
    this.sendOwnerToAdvance.push({ ...item, Id: item.ownerId })
    // this.selectedContactowner = this.service.removeDuplicates(this.selectedContactowner, "ownerId");
    this.leadDetailsForm.patchValue({
      leadOwner:  item.FullName
    });
    this.contactNameSwitchowner = false
    this.leadDetailsForm.controls.leadOwner.clearValidators();
    this.leadDetailsForm.controls.leadOwner.updateValueAndValidity();
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  appendCustomerGroup(value: string, item, checkDuplicateItem, isRedisCache, i) {
    let json = { FullName: item.FullName, LinkActionType: 1, Designation: (item.Designation) ? item.Designation : "", isKeyContact: (item.isKeyContact) ? (item.isKeyContact) : false, MapGuid: (item.MapGuid) ? item.MapGuid : "", Guid: item.Guid, SysGuid: item.Guid, Email:item.Email };
    let json1 = { FullName: item.FullName, LinkActionType: 1, Designation: (item.Designation) ? item.Designation : "", isKeyContact: (item.isKeyContact) ? (item.isKeyContact) : false, MapGuid: (item.MapGuid) ? item.MapGuid : "", Guid: item.Guid, SysGuid: item.Guid, Email:item.Email, Id: item.Guid };
    const result = this.myOpenLeadService.GenerateLinkActionType(json, this.ExistingContactData, this.finalContactGroup, "SysGuid")
    item = result.item,
    this.finalContactGroup = result.data
    if (checkDuplicateItem && this.selectedCustomer.some(x => x.SysGuid == json.SysGuid)) {
      this.errPopup.throwError(LeadCustomErrorMessages.ContactDuplicateError)
    }
    this.selectedCustomer.push(json);
    this.sendCustomerToAdvance.push(json1)
    this.selectedCustomer = this.service.removeDuplicates(this.selectedCustomer, "SysGuid");
    this.leadDealOwnerForm.patchValue({
      customerContact: ""
    })
    this.customerNameSwitch = false
    if (this.selectedCustomer.length > 0) {
      this.removeValidatorsForCustomer()
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  removeValidatorsForCustomer() {
    this.leadDealOwnerForm.controls.customerContact.clearValidators();
    this.leadDealOwnerForm.controls.customerContact.reset();
    this.leadDealOwnerForm.controls.customerContact.updateValueAndValidity()
  }
  setValidatorsForCustomer() {
    this.leadDealOwnerForm.controls.customerContact.setValidators([Validators.required])
    this.leadDealOwnerForm.patchValue({
      customerContact: null
    })
    this.leadDealOwnerForm.updateValueAndValidity()
  }

  wiprosolutionevent(isRedisCache) {
    if (this.leadDetailsForm.controls.WiproSolutionToggle.value == true) {
      this.iswiprosolution = true;
      (this.selectedWiproSolution.length > 0) ? this.removeValidatorsWiproSolution() : this.setValidatorsWiproSolution()
    } else if (this.leadDetailsForm.controls.WiproSolutionToggle.value == false) {
      this.iswiprosolution = false
      this.removeValidatorsWiproSolution()
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  servicelinesevent(isRedisCache) {
    if (this.leadDetailsForm.controls.serviceLineToggle.value == true) {
      this.MakeServiceLineLablesMandatory()
      this.isServicelines = true
    } else if (this.leadDetailsForm.controls.serviceLineToggle.value == false) {
      this.MakeServiceLineLablesNonMandatory()
      this.isServicelines = false
      this.ServiceTable=this.ServiceTable.filter(x => x.apiId != "0").map(x=>{
        return x;
    });
    this.createTableNewRow();
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  showAllianceAccount() {
    this.RequestAlliance = true
    this.AdvisorsAccount = false;
    // this.AdvisorAccountguid = null;
    this.AdvisorName = "";
    this.leadDetailsForm.controls.allianceAccount.setValidators([Validators.required])
    this.leadDetailsForm.controls.campaign.clearValidators()
    this.leadDetailsForm.controls.campaign.reset()
    this.leadDetailsForm.controls.advisorAccount.clearValidators()
    this.leadDetailsForm.controls.advisorAccount.reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  showAdvisorAccount() {
    this.RequestAlliance = false
    this.AdvisorsAccount = true;
    this.leadDetailsForm.controls.advisorAccount.setValidators([Validators.required])
    this.leadDetailsForm.controls.campaign.clearValidators()
    this.leadDetailsForm.controls.allianceAccount.clearValidators()
    // this.leadDetailsForm.controls.allianceAccount.reset(this.leadDetailsForm.controls.allianceAccount.value)
    this.leadDetailsForm.controls.campaign.reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  clearAllianceAdvisorValidators() {
    this.RequestAlliance = false
    this.requestCamp = false
    this.AdvisorsAccount = false;
    // this.AdvisorAccountguid = "";
    this.AdvisorName = "";
    this.leadDetailsForm.controls.campaign.clearValidators()
    this.leadDetailsForm.controls.allianceAccount.clearValidators()
    this.leadDetailsForm.controls.advisorAccount.clearValidators()
    this.leadDetailsForm.controls.advisorAccount.reset()
    // this.leadDetailsForm.controls.allianceAccount.reset(this.leadDetailsForm.controls.allianceAccount.value)
    this.leadDetailsForm.controls.campaign.reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  SetValidatorsVerticalInput() {
    this.leadDetailsForm.controls.vertical.setValidators([Validators.required])
    this.leadDetailsForm.patchValue({
      vertical: null
    })
    this.leadDetailsForm.updateValueAndValidity()
  }
  ResetValidatorsVerticalInput() {
    this.disableVertical = true
    this.VerticalSelected = ""
    this.verticalId = null
    this.verticalName = null
    this.leadDetailsForm.controls.vertical.clearValidators()
    this.leadDetailsForm.controls.vertical.reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  setValidatorsWiproSolution() {
    this.leadDetailsForm.controls.WiproSolutions.setValidators([Validators.required])
    this.leadDetailsForm.patchValue({
      WiproSolutions: null
    })
    this.leadDetailsForm.updateValueAndValidity()
  }
  removeValidatorsWiproSolution() {
    this.leadDetailsForm.controls['WiproSolutions'].clearValidators()
    this.leadDetailsForm.controls['WiproSolutions'].reset()
    this.leadDetailsForm.updateValueAndValidity()
  }
  MakeServiceLineLablesNonMandatory() {
    ServiceLineTable[0].title = 'Service line'
    ServiceLineTable[0].isRequired = false
    ServiceLineTable[0].IsRelation = []
    ServiceLineTable[2].title = 'SL BDM'
    ServiceLineTable[2].isRequired = false
  }
  MakeServiceLineLablesMandatory() {
    ServiceLineTable[0].title = 'Service line*'
    ServiceLineTable[0].isRequired = true
    ServiceLineTable[0].IsRelation = ["practice", "slbdm"]
    ServiceLineTable[2].title = 'SL BDM*'
    ServiceLineTable[2].isRequired = true
  }
    /**
   * Delinking all the links according to the account selection
   */
  delinkAccountChanges() {
    if (this.AccId)
      if (this.selectedConversation.length > 0) {
        this.delinkActivityGroupbyAccountChanges()
      }
    if (this.selectedCamp.length > 0) {
      this.delinkCampaignbyAccountChanges()
    }
    if (this.selectedOppertunity.length > 0) {
      this.delinkOpportunitybyAccountChanges()
    }
    if (this.selectedOppertunity.length > 0) {
      this.delinkCustomerContactbyAccountChanges()
    }
  }
  delinkActivityGroupbyAccountChanges() {
    this.finalActivityGroup = this.finalActivityGroup.filter(res => res.LinkActionType !== 1)
    this.finalActivityGroup = this.ChangeExistingToDelete(this.finalActivityGroup)
    this.selectedConversation = []
  }
  delinkOpportunitybyAccountChanges() {
    this.finalOppotunityGroup = this.finalOppotunityGroup.filter(res => res.LinkActionType !== 1)
    this.finalOppotunityGroup = this.ChangeExistingToDelete(this.finalOppotunityGroup)
    this.selectedOppertunity = []
  }
  delinkCampaignbyAccountChanges() {
    this.finalCampaignGroup = this.finalCampaignGroup.filter(res => res.LinkActionType !== 1)
    this.finalCampaignGroup = this.ChangeExistingToDelete(this.finalCampaignGroup)
    this.selectedCamp = []
  }
  delinkCustomerContactbyAccountChanges() {
    this.finalContactGroup = this.finalContactGroup.filter(res => res.LinkActionType !== 1)
    this.finalContactGroup = this.ChangeExistingToDelete(this.finalContactGroup)
    this.selectedCustomer = []
  }
  ChangeExistingToDelete(filterExistingdata: any[]) {
    if (filterExistingdata) {
      if (filterExistingdata.length > 0) {
        filterExistingdata = filterExistingdata.map(res => {
          return { ...res, LinkActionType: 3 }
        })
        return filterExistingdata
      }
      else {
        return []
      }
    } else {
      return []
    }
  }

  delinkWiproSolutions(item) {
    if (this.selectedWiproSolution.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingWiproSolutionData, this.finalWiproSolutionGroup, "SysGuid")
      item = result.item,
        this.finalWiproSolutionGroup = result.data
      this.selectedWiproSolution = this.selectedWiproSolution.filter(x => x.SysGuid != item.SysGuid)
      this.sendWiproSolutionToAdvance = this.sendWiproSolutionToAdvance.filter(x => x.SysGuid != item.SysGuid)
    }
    if (this.selectedWiproSolution.length == 0 && this.iswiprosolution) {
      this.setValidatorsWiproSolution()
    }
    this.CreateRedisCache()
  }

  delinkOpp(item, i) {
    if (this.selectedOppertunity.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingOpportunityData, this.finalOppotunityGroup, "Guid")
      item = result.item,
      this.finalOppotunityGroup = result.data
      this.selectedOppertunity = this.selectedOppertunity.filter(x => x.Guid != item.Guid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(x => x.Guid != item.Guid)
    }
    this.CreateRedisCache()
  }

  delinkConv(item, i) {
    if (this.selectedConversation.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingActivityData, this.finalActivityGroup, "Guid")
      item = result.item,
        this.finalOppotunityGroup = result.data
      this.selectedConversation = this.selectedConversation.filter(x => x.Guid != item.Guid)
      this.sendActivityToAdvance = this.sendActivityToAdvance.filter(x => x.Guid != item.Guid)
    }
    this.CreateRedisCache()
  }

  delinkCampaign(item, i) {
    this.campList.splice(i, 1)
    if (this.selectedCamp.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingCampaignData, this.finalCampaignGroup, "Id")
      item = result.item,
      this.finalCampaignGroup = result.data
      this.selectedCamp = this.selectedCamp.filter(x => x.Id != item.Id)
    }
    if (this.selectedCamp.length == 0 && this.setCampaignForLeadSource()) {
      this.setValidatorsForCampaign()
    }
    this.CreateRedisCache()
  }

  setCampaignForLeadSource() {
    if (this.leadDetailsForm.controls.leadSource.value == "Advertisement" ||
      this.leadDetailsForm.controls.leadSource.value == "M&CI - iProfile" ||
      this.leadDetailsForm.controls.leadSource.value == "Events" ||
      this.leadDetailsForm.controls.leadSource.value == "Conference") {
      return true
    } else {
      return false
    }
  }

  delinkAgp(item, i) {
    if (this.selectedAgp.length > 0) {
      this.selectedAgp = this.selectedAgp.filter(x => x.SysGuid != item.SysGuid)
    }
    this.CreateRedisCache()
  }

  // delinkLeadOwner(item, i) {
  //   if (this.selectedContactowner.length > 0) {
  //     this.selectedContactowner = this.selectedContactowner.filter(x => x.ownerId != item.ownerId)
  //   }
  //   this.CreateRedisCache()
  // }

  delinkCustomerContacts(item) {
    if (this.selectedCustomer.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingContactData, this.finalContactGroup, "Id")
      item = result.item,
        this.finalContactGroup = result.data
      this.selectedCustomer = this.selectedCustomer.filter(x => x.SysGuid != item.SysGuid)
     this.sendCustomerToAdvance = this.sendCustomerToAdvance.filter(x => x.SysGuid != item.SysGuid)
    }
    if (this.selectedCustomer.length == 0) {
      this.setValidatorsForCustomer()
    }
    this.CreateRedisCache()
  }

  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopComponent, {
      width: '400px',
      data: this.moduleTypeStateData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.createClicked = true
        this.ClearRedisCache()
      } else {
        this.createClicked = false
      }
    })
  }

  //------------------------------------------------CLOSE FUNCTIONS START---------------------------------------------------------------------//
  LeadSourceclose() {
    this.ConversationNameSwitchleadSource = false;
    if (this.leadSrcName == "") {
      this.leadDetailsForm.patchValue({
        leadSource: ""
      })
    }
    if (this.leadSrcName !== "") {
      this.leadDetailsForm.patchValue({
        leadSource: this.leadSrcName
      })
    }
  }
  Currencyclose() {
    this.CurrencySwitch = false;
    if (this.currencyId == "") {
      this.leadDetailsForm.patchValue({
        currency: ""
      })
    }
  }
  ConversationSBUclose() {
    this.ConversationNameSwitchsbu = false;
    if (this.sbuId === "") {
      this.leadDetailsForm.patchValue({
        sbu: ""
      })
    }
  }
  Leadverticalclose() {
    this.ConversationNameSwitchvertical = false;
    if (this.verticalId === "") {
      this.leadDetailsForm.patchValue({
        vertical: ""
      })
    }
  }
  AccountNameclose() {
    this.ConversationNameSwitch = false
    if (this.AccName === "") {
      this.leadDetailsForm.patchValue({
        accountOrCompanyName: ""
      })
    }
    if (this.AccName != "") {
      this.leadDetailsForm.patchValue({
        accountOrCompanyName: this.AccName
      })
    }
  }
  Leadadvisorclose() {
    this.AdvisorAccountSwitch = false;
    if (this.AdvisorName === "") {
      this.leadDetailsForm.patchValue({
        advisorAccount: ""
      })
    } 
    if (this.AdvisorName != "") {
      this.leadDetailsForm.patchValue({
        advisorAccount: this.AdvisorName
      })
    }
  }
  Leadallianceclose() {
    this.allianceAccountSwitch = false;
    if (this.AllianceName === "") {
      this.leadDetailsForm.patchValue({
        allianceAccount: ""
      })
    }
    if (this.AllianceName != "") {
      this.leadDetailsForm.patchValue({
        allianceAccount: this.AllianceName
      })
    }
  }
  CampaignClose() {
    this.ConversationNameSwitchcamp = false;
    this.leadDetailsForm.patchValue({
      campaign: ""
    })
  }
  ActivityGoupclose() {
    this.ConversationNameSwitchlead = false;
    this.leadDetailsForm.patchValue({
      activityGroup: ""
    })
  }
  Oppotunityclose() {
    this.ConversationNameSwitchoppo = false;
    this.leadDetailsForm.patchValue({
      opportunity: ""
    })
  }
  Agpclose() {
    this.ConversationNameSwitchagp = false;
    this.leadDetailsForm.patchValue({
      link: ""
    })
  }
  countryclose() {
    this.countrySwitch = false;
    if (this.countryName === "") {
      this.leadDetailsForm.patchValue({
        country: ""
      })
    }
  }
  wiproSoltionclose() {
    this.wiproSolustionSwitch = false;
    this.leadDetailsForm.patchValue({
      WiproSolutions: ""
    })
  }
  //------------------------------------------------CLOSE FUNCTIONS END---------------------------------------------------------------------//

  //------------------------------------------------CLEAR FUNCTIONS START---------------------------------------------------------------------//
  clearCuurencyName() {
    this.leadDealOwnerForm.patchValue({
      currency: ""
    });
    this.currencyId = '';
    this.currencyName = '';
  }
  clearCountry() {
    this.leadDetailsForm.patchValue({
      country: ""
    });
    this.countryName = "";
    this.countryId = "";
  }
  clearLeadSource(value) {
    this.leadDetailsForm.patchValue({
      leadSource: ""
    });
    this.leadSrcName = "";
    this.leadSourceId = "";
    this.leadSourceClearDependencyFunctions(value)
  }
  clearAccount() {
    this.leadDetailsForm.patchValue({
      accountOrCompanyName: "",
      sbu: "",
      vertical: ""
    });
    this.AccName = '';
    this.AccId = '';
    this.verticalId = '';
    this.sbuId = '';
    this.isServicelines = false
    this.leadDetailsForm.patchValue({
      serviceLineToggle: false
    })
    this.ServiceTable = [];
    this.createTableNewRow()
    this.disableActivityGroup = true
    this.disableCampaign = true
    this.disableOpportunity = true;
    this.AccountSelected.Name =''
    this.AccountSelected.SysGuid=''
    this.SbuSelected=undefined
    this.VerticalSelected=undefined
  }

  clearAdvisor() {
    this.leadDetailsForm.patchValue({
      advisorAccount: ""
    });
    this.AdvisorName = '';
    // this.AdvisorAccountguid = "";
  }
  clearAlliance() {
    this.leadDetailsForm.patchValue({
      allianceAccount: ""
    });
    this.AllianceName = '';
    // this.AllianceAccountguid = "";
  }
  clearLeadOwner() {
    this.leadDetailsForm.patchValue({
      leadOwner: ""
    });
    this.leadOwnerName = "";
    this.leadOwnerId = "";
    this.leadDetailsForm.controls['leadOwner'].setValidators(Validators.required);
    this.leadDetailsForm.controls['leadOwner'].updateValueAndValidity();
  }
  //------------------------------------------------CLEAR FUNCTIONS ENDS---------------------------------------------------------------------//
  CreateLeadNext() {
    this.tableInValid = false;
      this.ServiceTable.forEach((x) => {
        this.servicelineTable_Data.forEach(y => {
          if (this.leadDetailsForm.controls['serviceLineToggle'].value) {
            if (y.isRequired) {
              if (x[y.name].Name.trim().length == 0) {
                this.tableInValid = true;
                x[y.name].IsError = true;
                setTimeout(() => {
                  let t = document.getElementsByClassName('error')[0];
                  document.getElementById(t.id).focus()
                  document.getElementById(t.id).blur()
                  x[y.name].IsError = true;
                }, 500)
              }
            }
          }
        })
      })
      this.LeadNameValidation();
      if (!this.tableInValid && this.leadDetailsForm.valid) {

        this.steptwo()
      } else {
      this.service.windowScroll();
      this.service.validateAllFormFields(this.leadDetailsForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }

  /****************Advance search popup starts**********************/
  lookUpColumn(controlName, value) {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = leadAdvnHeaders[controlName]
    this.lookupdata.lookupName = leadAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = leadAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = leadAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value
  }
  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    this.lookUpColumn(controlName, value)
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.myOpenLeadService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null, rowData: headerdata, rowIndex: index, rowLine: line }).subscribe(res => {
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
        this.myOpenLeadService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.errorMsg.isError = false;
          if (res.IsError == false) {
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
            this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
          }
        }, error => {
          this.lookupdata.isLoader = false;
          this.lookupdata.errorMsg.isError = false;
        })
      } else {
        this.lookupdata.controlName = controlName
        this.lookupdata.headerdata = DnBAccountHeader
        this.lookupdata.lookupName = leadAdvnNames[controlName]['name']
        this.lookupdata.isCheckboxRequired = leadAdvnNames[controlName]['isCheckbox']
        this.lookupdata.Isadvancesearchtabs = leadAdvnNames[controlName]['isAccount']
        this.lookupdata.inputValue = value;
        this.dnBDataBase(x);
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.wiprodb == false) {
          this.service.sendProspectAccount = false;
          this.IsModuleSwitch = false
          this.showFirstForm = false;
          this.groupData(result);
          sessionStorage.setItem("TempLeadDetails", JSON.stringify(this.createTempData()))
          this.router.navigateByUrl('/leads/prospectAccount')
        } else {
          this.emptyArray(result.controlName);
          this.AppendParticularInputFun(result.selectedData, result.controlName)
        }
      }
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
          this.lookupdata.otherDbData.countryvalue = res.ResponseObject;
        }
      }, error => {
        this.lookupdata.isLoader = false;
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
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
        }
        if (res.IsError == true) {
          this.lookupdata.tabledata = [];
          this.lookupdata.TotalRecordCount = 0;
          this.lookupdata.nextLink = ''
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
      })
    }
  }

  groupData(result) {
    var object = {
      activityGroupName: "",
      account: {
        Name: (result.selectedData.length != 0) ? (result.selectedData[0].Name) ? result.selectedData[0].Name : "" : "",
        Id: (result.selectedData.length != 0) ? (result.selectedData[0].Id) ? result.selectedData[0].Id : "" : "",
        Industry: (result.selectedData.length != 0) ? (result.selectedData[0].Industry) ? result.selectedData[0].Industry : "" : "",
        Region: (result.selectedData.length != 0) ? (result.selectedData[0].Region) ? result.selectedData[0].Region : "" : ""
      },
      model: 'Create lead',
      route: 'leads/createlead'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }
  /*****************Advance search popup ends*********************/

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
      guid: this.LeadGuid,
      isProspect: this.isProspect,
      AccId: this.AccId,
      SbuId: this.sbuId,
      VerticalId: this.verticalId
    }
  }
  LeadNameValidation(){
    if (this.leadNameChanges.trim() == "") {
      this.leadDetailsForm.patchValue({leadName : ""})
      this.leadDetailsForm.controls['leadName'].setValidators(Validators.required);
      this.leadDetailsForm.controls['leadName'].markAsTouched();
      this.leadDetailsForm.controls['leadName'].updateValueAndValidity();
    }
  }
  stepone() {
      this.leadinfo = true;
      this.dealinfo = false;
      this.twoactive = false;
    }
  steptwo() {
    debugger
    this.LeadNameValidation();
    if (this.leadDetailsForm.valid && this.leadNameChanges.trim() !== "") {
    this.isLoading = false;
    this.leadinfo = false;
    this.dealinfo = true;
    } else {
      this.service.validateAllFormFields(this.leadDetailsForm);
    }
    this.service.windowScroll();
  }

  populateCreateLeadForm(data) {
    if (data.enquiryData) {
      this.enquiryType = data.enquiryData
      this.enqiuryTypedata = data.enquirytype
      this.enquiryId = (data.enquirytype) ? data.enquirytype.Id : ""
      this.enquiryTypeAria = (data.enquirytype) ? data.enquirytype.Name : ""
    } else {
      this.getenquiryType()
    }
    this.leadNameChanges = (data.leadName == null || data.leadName == undefined)? "" : data.leadName
    console.log('leadNameChanges', this.leadNameChanges)
    this.leadDetailsForm.patchValue({
      leadName: data.leadName,
      leadSource: (data.leadSource) ? data.leadSource.Name : "",
      accountOrCompanyName: (data.accountName) ? data.accountName.Name : "",
      // accountOrProspect:data.leadName ,
      allianceAccount: (data.alliance) ? data.alliance.Name : "",
      advisorAccount: (data.advisor) ? data.advisor.Name : "",
      sbu: (data.sbu) ? data.sbu.Name : "",
      vertical: (data.vertical) ? data.vertical.Name : "",
      serviceLineToggle: data.serviceLineToggle,
      WiproSolutionToggle: data.WiproSolutionToggle,
      country: (data.country) ? data.country.Name : '',
      WiproSolutions: "",
      activityGroup: "",
      campaign: "",
      opportunity: "",
      link: "",
      enquiryType: (data.enquirytype) ? JSON.parse(data.enquirytype.Id) : '',
      description: (data.desc) ? data.desc : "",
      leadOriginator: (data.ownerDetails) ? data.ownerDetails.originator : "",
      leadOwner: "",
    })
    this.leadDealOwnerForm.patchValue({
      dealName: (data.leadInfo) ? data.leadInfo.dealValue : "",
      currency: (data.leadInfo) ? (data.leadInfo.currency) ? data.leadInfo.currency.Desc : "" : "",
      estimatedRateValue: "",
      timeline: (data.leadInfo) ? data.leadInfo.timeline : "",
      customerContact: "",
      wiproContact: ""
    })

    this.isFromMeeting = (data.moduleSwitch)? true: false
    this.Orinator= data.ownerDetails.originator
    this.showFirstForm = data.showFirstForm

    if (data.leadSource) {
      this.appendleadSource(data.leadSource.Name, data.leadSource, false, 0)
    }
    //so,why appendAccountName delinkdata is always false 4th param ?
    //1) when doing a module switch we dont have to clear the any linked data ;just see delinkAccountChanges() .
    //2) when trying to create contact or activity inside create then no need to clear the lined data ;just see delinkAccountChanges().
    if (data.accountName) {
      this.appendAccountName(data.accountName.Name, data.accountName, true, false, false, 0)
    }
    if (data.sbu) {
      this.appendConversationsbu(data.sbu.Name, data.sbu, false, 0)
    }
    if (data.vertical) {
      this.appendVertical(data.vertical.Name, data.vertical, false)
    }
    if (data.alliance) {
      this.appendalliance(data.alliance.Name, data.alliance, false, 0)
    }
    if (data.advisor) {
      this.appendadvisor(data.advisor.Name, data.advisor, false, 0)
    }
    if (data.country) {
      this.appendCountry(data.country.Name, data.country, false, 0)
    }
    if (!data.moduleSwitch) {
      if (data.links.campaign) {
        data.links.campaign.forEach(x => {
          this.appendCampaignGroup(x.Name, x, false, false, 0)
        })
      }
    }
    this.wiprosolutionevent(false)
    this.servicelinesevent(false)
    this.sbuId = (data.sbu)? (data.sbu.sbuId)? data.sbu.sbuId : '': ''
    if (!data.moduleSwitch) {
      if (data.links.wiprosolution && this.iswiprosolution) {
        if (data.links.wiprosolution.length > 0) {
          data.links.wiprosolution.forEach(x => {
            this.appendWiproSolutions(x.Name, x, false, false, 0)
          })
        }
      }
    }
    if (data.ownerDetails) {
      if (data.ownerDetails.owner) {
        if (data.ownerDetails.owner.length > 0) {
          this.appendOwner(data.ownerDetails.owner[0].FullName, data.ownerDetails.owner[0], 0, false)
        }
      }
    }
    if (!data.moduleSwitch) {
      if (data.leadInfo.currency) {
        this.appendCurrency(data.leadInfo.currency.Desc, data.leadInfo.currency, false, 0)
      }
    }
    if (!data.moduleSwitch) {
      console.log("yes modulae switch is false!!!1")
      // trying to append data (i.e, if you create a contact from "+" )
      this.selectedWiproSolution = (data.links.wiprosolution) ? data.links.wiprosolution : []
      this.ServiceTable = (data.serviceline) ? data.serviceline : []
      this.selectedConversation = (data.links) ? (data.links.activitygroup) ? data.links.activitygroup : [] : []
      this.selectedCamp = (data.links) ? (data.links.campaign) ? data.links.campaign : [] : []
      this.selectedOppertunity = (data.links) ? (data.links.opportunity) ? data.links.opportunity : [] : []
      this.selectedAgp = (data.links) ? (data.links.agp) ? data.links.agp : [] : []
      this.selectedCustomer = (data.ownerDetails) ? (data.ownerDetails.customers) ? data.ownerDetails.customers : [] : []
      this.finalActivityGroup = (data.finalActivityGroup) ? data.finalActivityGroup : []
      this.finalCampaignGroup = (data.finalCampaignGroup) ? data.finalCampaignGroup : []
      this.finalOppotunityGroup = (data.finalOpportunityGroup) ? data.finalOpportunityGroup : []
      this.finalContactGroup = (data.finalCustomerGroup) ? data.finalCustomerGroup : []
      this.finalAgpGroup = (data.finalAgpGroup) ? data.finalAgpGroup : []
      this.selectedContactowner = (data.ownerDetails) ? (data.ownerDetails.owner) ? data.ownerDetails.owner : [] : []
      // to remove the validators for the customer contact.
      if (data.ownerDetails.customers) {
        data.ownerDetails.customers.forEach(x => {
          this.appendCustomerGroup(x.FullName, x, false, false, 0)
        })
      }
      //below if condition -
      //1) if user module sitch to create lead ,now module switch is TRUE,
      // then when he create contact now it will FALSE,
      // To handel this we have done below if
      if (!this.isEmpty(this.moduleTypeStateData)) {
        console.log("we ahve the meeitng from lead!!!!")
        if (this.moduleTypeStateData.name == "Meeting") {
          this.disableAccount = true // need to disable accouint input
          this.createExistingLinks(data)
        }
      }

    } else {
      // trying to create a LEAD from other modules.
      console.log("coming from module swith!!@@@")
      this.disableAccount = (data.accountName) ? true : false
      this.disableActivityGroup = (data.links.activitygroup) ? false : false
      this.disableCampaign = (data.links.campaign) ? false : false // as per requirement , not disabling the input if swithcing fom module
      this.disableOpportunity = (data.links.opportunity) ? false : false // as per requirement , not disabling the input if swithcing fom module
      this.disableContacts = (data.ownerDetails.customers) ? false : false // as per requirement , not disabling the input if swithcing fom module
      this.selectedConversation = (data.links) ? (data.links.activitygroup) ? data.links.activitygroup : [] : []
      this.selectedCamp = (data.links) ? (data.links.campaign) ? data.links.campaign : [] : []
      this.selectedOppertunity = (data.links) ? (data.links.opportunity) ? data.links.opportunity : [] : []
      this.selectedAgp = (data.links) ? (data.links.agp) ? data.links.agp : [] : []
      this.selectedCustomer = (data.ownerDetails) ? (data.ownerDetails.customers) ? data.ownerDetails.customers : [] : []
      // this.createTableNewRow()
      this.CreateFinalGroups(data)
      this.linkedLeaddisabled(data)
    }
  }
  // linked leads enable when account is present
  linkedLeaddisabled(data) {
    this.disableActivityGroup = (data.accountName) ? false : true
    this.disableCampaign = (data.accountName) ? false : true
    this.disableOpportunity = (data.accountName) ? false : true
  }
  CreateFinalGroups(data) {
    this.ExistingActivityData = (data.links) ? (data.links.activitygroup) ? data.links.activitygroup : [] : []
    this.ExistingCampaignData = (data.links) ? (data.links.campaign) ? data.links.campaign : [] : []
    this.ExistingOpportunityData = (data.links) ? (data.links.opportunity) ? data.links.opportunity : [] : []
    this.ExistingAgpData = (data.links) ? (data.links.agp) ? data.links.agp : [] : []
    this.ExistingContactData = (data.ownerDetails) ? (data.ownerDetails.customers) ? data.ownerDetails.customers : [] : []
    if (data.links.activitygroup) {
      data.links.activitygroup.forEach(x => {
        this.appendActivityGroup(x.Name, x, false, false, 0)
      })
    }
    if (data.links.campaign) {
      data.links.campaign.forEach(x => {
        this.appendCampaignGroup(x.Name, x, false, false, 0)
      })
    }
    if (data.links.opportunity) {
      data.links.opportunity.forEach(x => {
        this.appendOpportunityGroup(x.Name, x, false, false, 0)
      })
    }
    if (data.links.agp) {
      data.links.agp.forEach(x => {
        this.appendAgpGroup(x.Name, x, false, 0)
      })
    }
    if (data.ownerDetails.customers) {
      data.ownerDetails.customers.forEach(x => {
        this.appendCustomerGroup(x.FullName, x, false, false, 0)
      })
    }
  }

  createTempData() {
    return {
      leadName: this.leadNameChanges.trim(),
      leadSource: this.leadSourceSelected,
      accountName: this.AccountSelected,
      sbu: this.SbuSelected,
      vertical: this.VerticalSelected,
      alliance: this.AllianceData,
      advisor: this.AdvisorData,
      enquirytype: this.enqiuryTypedata,
      country: this.selectedCountry,
      serviceLineToggle: this.leadDetailsForm.value.serviceLineToggle,
      WiproSolutionToggle: this.leadDetailsForm.value.WiproSolutionToggle,
      desc: this.leadDetailsForm.value.description,
      id: "",
      links: {
        wiprosolution: this.selectedWiproSolution,
        activitygroup: this.selectedConversation,
        campaign: this.selectedCamp,
        opportunity: this.selectedOppertunity,
        agp: this.selectedAgp
      },
      leadInfo: {
        dealValue: this.leadDealOwnerForm.value.dealName,
        currency: this.currencySelected,
        timeline: this.leadDealOwnerForm.value.timeline
      },
      ownerDetails: {
        originator: this.Orinator,
        oiginatorlist: this.Orinator,
        owner: this.selectedContactowner,
        customers: this.selectedCustomer
      },
      Existinglinks: {
        wiprosolution: this.ExistingWiproSolutionData,
        activitygroup: this.ExistingActivityData,
        campaign: this.ExistingCampaignData,
        opportunity: this.ExistingOpportunityData,
        agp: this.ExistingAgpData,
        customers: this.ExistingContactData
      },
      serviceline: this.ServiceTable,
      attachments: this.contactLeadService.attachmentList,
      finalActivityGroup: this.finalActivityGroup,
      finalCampaignGroup: this.finalCampaignGroup,
      finalOpportunityGroup: this.finalOppotunityGroup,
      finalCustomerGroup: this.finalContactGroup,
      finalAgpGroup: this.finalAgpGroup,
      enquiryData: this.enquiryType,
      moduleSwitch: this.IsModuleSwitch,
      showFirstForm: this.showFirstForm,
      moduletype: this.moduleTypeStateData,
      model: 'Create lead',
      route: 'leads/createlead'
    }
  }

  deleterow(rowData) {
    if (this.ServiceTable.length > 1) {
      if (rowData.apiId == "0") {
        this.ServiceTable = this.ServiceTable.filter(x => x.id != rowData.id);
      }
      else {
        rowData.isDeleted = true;
        rowData.LinkActionType = 3;
      }
    }
  }

  createExistingLinks(data: any) {
    this.ExistingActivityData = (data.Existinglinks) ? (data.Existinglinks.activitygroup) ? data.Existinglinks.activitygroup : [] : []
    this.ExistingCampaignData = (data.Existinglinks) ? (data.Existinglinks.campaign) ? data.Existinglinks.campaign : [] : []
    this.ExistingOpportunityData = (data.Existinglinks) ? (data.Existinglinks.opportunity) ? data.Existinglinks.opportunity : [] : []
    this.ExistingAgpData = (data.Existinglinks) ? (data.Existinglinks.agp) ? data.Existinglinks.agp : [] : []
    this.ExistingContactData = (data.Existinglinks) ? (data.Existinglinks.customers) ? data.Existinglinks.customers : [] : []
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  /*****************  autocomplete code start ****************** */
  servicelineautoleadclose() {
    this.servicelineautoSwitch = false;
  }
  clearData(inputValue, headerName, line) {
    if (inputValue == '') {
      line[headerName].Name = '';
    }
    else {
      if (line[headerName].seletedValue != '') {
      }
    }
    this.searchitem = '';
    this.searchPractice = '';
    this.searchSlbdm = ''
  }
  appendservicelineauto(item, i, hederData, rowData, isRedisCache) {
    if (this.ServiceTable[i][hederData.name].Name != item.Name) {
      if (this.ServiceTable.filter(x => x.slbdm["bdmidGuid"] == item.bdmidGuid && x.practice["practiceGuid"]==rowData.practice["practiceGuid"]&& x.serviceLines["Guid"]== rowData.serviceLines["Guid"]).length != 0) {
        let Message = "The identified combination is already available";
        this.errPopup.throwError(Message)
        this.ServiceTable[i][hederData.name] = {
          Name: "",
          bdmidGuid: "0",
          serviceLineBDMid: "",
          seletedValue: '',
          IsError: false
        }
      } else {
        this.ServiceTable[i][hederData.name] = item;
        if (hederData.IsRelation) {
          //Unique Service line Selector
          this.ServiceTable[i][hederData.IsRelation[0]] = {
            Name: "",
            practiceGuid: "",
            seletedValue: '',
            IsError: false
          },
            this.ServiceTable[i][hederData.IsRelation[1]] = {
              Name: "",
              bdmidGuid: "0",
              serviceLineBDMid: "",
              seletedValue: '',
              IsError: false
            }
        }
      }
    }
    if (isRedisCache) {
      this.CreateRedisCache()
    }
  }

  textAreaaChange() {
    this.CreateRedisCache()
  }

  OnChange() {
    //create for leadDetailsForm
    this.leadDetailsForm.get('description').valueChanges.subscribe(val => {
      if (val.length >= 2001) {
        this.descriptionLength = true
      } else {
        this.descriptionLength = false
      }
    })
    this.masterApi.getCurrency().subscribe(res => {
      if (!res.IsError) {
        this.offlineService.addMasterApiCache(routes.getCurrency, res)
        this.currency = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    });
    // this.leadDealOwnerForm.get('dealName').valueChanges.subscribe(val => {

    // })
  }

  addrow(event) {
    event.preventDefault()
    this.searchitem = ""
    this.searchPractice = ""
    this.searchSlbdm = ""
    this.createTableNewRow();
  }

  createTableNewRow() {
    var timestamp = "serviceline" + Math.floor(Date.now());
    this.ServiceTable.push({
      id: timestamp,
      apiId: "0",
      '@serviceLines': false,
      '@practice': false,
      '@slbdm': false,
      serviceLines: {
        Name: "",
        Guid: "",
        seletedValue: "",
        IsError: false
      }, practice: {
        Name: "",
        practiceGuid: "",
        seletedValue: "",
        IsError: false
      },
      slbdm: {
        Name: "",
        bdmidGuid: "0",//Validation
        serviceLineBDMid: "",
        seletedValue: "",
        IsError: false
      }
    })
  }

  ResetSlbdm(i, hederData) {
    if (hederData.IsRelation) {
      //Unique Service line Selector
      this.ServiceTable[i][hederData.IsRelation[0]] = {
        Name: "",
        practiceGuid: "",
        seletedValue: '',
        IsError: false
      },
        this.ServiceTable[i][hederData.IsRelation[1]] = {
          Name: "",
          bdmidGuid: "0",
          serviceLineBDMid: "",
          seletedValue: '',
          IsError: true
        },
        this.ServiceTable[i][hederData.name] = {
          Code: "",
          Guid: "0",
          Name: "",
          IsError: true
        }
    } else {
      this.ClearPartiularServiceLineInput(i, hederData)
    }
  }

  onKeyUp(event, formData, colData, searchitem, byPassFlag) {
    colData.serviceData = []
    this.isServicelineLoader = true
    switch (colData.name) {
      case 'serviceLines':
        if (event.key !== "Backspace") {
          this.searchitem = this.searchitem + event.key
        }
        else {
          this.searchitem = this.searchitem.slice(0, -1)
        }
        if (this.searchitem.length > 0 || byPassFlag) {
          var ServicelineReqBody = {
            "SearchText": searchitem,
            "Account": {
              "SysGuid": this.AccId,
              "isProspect": this.isProspect
            },
            "SBU": {
              "Id": this.sbuId
            }
          }
          this.contactLeadService.getsearchServiceLine(ServicelineReqBody).subscribe(
            data => {
              this.isServicelineLoader = false
              if (data.IsError === false) {
                colData.serviceData = data.ResponseObject;
              } else {
                colData.serviceData = []
                this.errPopup.throwError(data.Message)
              }
            }, error => {
              colData.serviceData = []
              this.isServicelineLoader = false;
            })
        }
        return
      case 'practice':
        if (event.key !== "Backspace") {
          this.searchPractice = this.searchPractice + event.key
        }
        else {
          this.searchPractice = this.searchPractice.slice(0, -1)
        }
        if (formData.serviceLines.Guid != '') {
          this.contactLeadService.getPractice(searchitem, formData.serviceLines.Guid).subscribe(
            data => {
              this.isServicelineLoader = false
              if (data.IsError === false) {
                colData.serviceData = data.ResponseObject;
              } else {
                colData.serviceData = []
                this.errPopup.throwError(data.Message)
              }
            }, error => {
              colData.serviceData = []
              this.isServicelineLoader = false;
            })
        }
        else {
          formData.serviceLines.IsError = true;
        }
        return
      case 'slbdm':
        if (event.key !== "Backspace") {
          this.searchSlbdm = this.searchSlbdm + event.key
        }
        else {
          this.searchSlbdm = this.searchSlbdm.slice(0, -1)
        }
        if (formData.serviceLines.Guid != '') {
          this.contactLeadService.getSLBDM(searchitem, formData.serviceLines.Guid, formData.practice.practiceGuid, this.sbuId, this.verticalId).subscribe(
            data => {
              this.isServicelineLoader = false
              if (data.IsError === false) {
                colData.serviceData = data.ResponseObject;
              } else {
                colData.serviceData = []
                this.errPopup.throwError(data.Message)
              }
            }, error => {
              colData.serviceData = []
              this.isServicelineLoader = false;
            })
        }
        else {
          formData.serviceLines.IsError = true;
        }
        return
    }
  }

  ClearPartiularServiceLineInput(i, hederData) {
    switch (hederData.name) {
      case 'serviceLines':
        this.ServiceTable[i][hederData.name] = {
          Code: "",
          Guid: "0",
          Name: "",
          IsError: true
        }
        return
      case 'practice':
        this.ServiceTable[i][hederData.name] = {
          Name: "",
          practiceGuid: "",
          seletedValue: '',
          IsError: true
        }
        return
      case 'slbdm':
        this.ServiceTable[i][hederData.name] = {
          Name: "",
          bdmidGuid: "0",
          serviceLineBDMid: "",
          seletedValue: '',
          IsError: true
        }
    }
  }

  AddCustomerContact() {
    if (this.AccName == '') {
      this.errPopup.throwError('Select account')
    } else {
      const dialogRef = this.dialog.open(CustomerpopupComponent, {
        width: '800px',
        data: (this.AccountSelected) ? ({ Name: this.AccountSelected['Name'], SysGuid: this.AccountSelected['SysGuid'], isProspect: this.AccountSelected['isProspect'] }) : ''
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != '') {
          let json = { FullName: (res['FName'] + ' ' + res['LName']), LinkActionType: 1, Designation: res['Designation'] ? res['Designation'] : "", isKeyContact: res['isKeyContact'] ? res['isKeyContact'] : false, MapGuid: "", Guid: res['Guid'], SysGuid: res['Guid'], Email:res['Email'] };
          this.appendCustomerGroup(json.FullName, json, true, true, 0)
          this.removeValidatorsForCustomer()
        }
      })
    }
  }

  setCurrentFormDetails() {
    sessionStorage.setItem("TempLeadDetails", JSON.stringify(this.createTempData()))
  }

  getenquiryType() {
    this.masterApi.getEnquiryType().subscribe(res => {
      if (res.IsError === false) {
        this.isLoading = false;
        this.offlineService.addMasterApiCache(routes.enquirytype, res)
        this.enquiryType = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message)
      }
    },
      error => {
        this.isLoading = false;
      })
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
         this.errPopup.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
  }


  downloadAll() {
    let downloadUrls = []
    if (this.envr.envName === 'MOBILEQA') {
      this.contactLeadService.attachmentList.forEach(
        item => {
          downloadUrls.push({ Url: item.Url, Name: item.Name })
        })
      this.downloadAllInMobile(downloadUrls)
      return;
    } else {
      let body = this.contactLeadService.attachmentList.map(x=>{return {Name : x.downloadFileName}});
      this.filesToDownloadDocument64(body);
      // this.contactLeadService.attachmentList.forEach(res => {
      //   this.service.Base64Download(res);
      //   // downloadUrls.push(res.Url);
      // })

    }
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

  downloadFile(i) {
    let body = [this.contactLeadService.attachmentList[i]].map(x=>{return {Name : x.downloadFileName}});
    this.filesToDownloadDocument64(body);
    // this.service.Base64Download(res);
    // const response = {
    //   file: this.contactLeadService.attachmentList[i].Url,
    // };
    // var a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
  }

  delinkAttach(Name) {
    const dialogRef = this.dialog.open(deleteAttachPopUp, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.OK === true) {
        this.contactLeadService.attachmentList = this.contactLeadService.attachmentList.filter(res => res.downloadFileName !== Name)
        this.CreateRedisCache()
      }
    })
  }

  custominputclose() {
    this.suggestion = false;
  }
  custominputclose1() {
    this.suggestion1 = false;
  }
  custominputclose2() {
    this.suggestion2 = false;
  }
  custominputclose3() {
    this.suggestion3 = false;
  }
  custominputclose4() {
    this.suggestion4 = false;
  }
  append(text) {
    this.term = text;
    this.suggestion = false;
  }
  append1(text) {
    this.term1 = text;
    this.suggestion1 = false;
  }
  append2(text) {
    this.term2 = text;
    this.suggestion2 = false;
  }
  append3(text) {
    this.term3 = text;
    this.suggestion3 = false;
  }
  append4(text) {
    this.term4 = text;
    this.suggestion4 = false;
  }
  consentStatus(e) {
    this.consent = e.checked;
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
  /****************** Conversation Name autocomplete code start ****************** */
  customerNameclose() {
    this.customerNameSwitch = false;
    this.leadDealOwnerForm.patchValue({
      customerContact: ''
    })
  }
  contactNamecloseorigin() {
    this.contactNameSwitchorigin = false;
  }
  appendcontactorigin(value: string, item, i) {
    this.leadDetailsForm.patchValue({
      leadOriginator: value
    });
    this.contactNameorigin = value;
    this.selectedContactorigin.push(item)
  }
  contactNamecloseowner() {
    this.contactNameSwitchowner = false;
    if (this.leadOwnerName == "") {
      this.leadDetailsForm.patchValue({
        leadOwner: ""
      })
    }
    if(this.leadOwnerName != "") {
      this.leadDetailsForm.patchValue({
        leadOwner: this.leadOwnerName
      })
    }
  }

  onSubmit() {
    var contactLeadServiceAttachments;
    if (this.leadDealOwnerForm.valid && this.selectedContactowner.length > 0 && this.selectedCustomer.length > 0) {
      contactLeadServiceAttachments = this.contactLeadService.attachmentList;
      let body = this.generateCreateReqParam();
      this.isLoading = true;
      this.createClicked = true;
      this.contactLeadService.CreateLead(body).subscribe(
        res => {
          if (res.IsError === false) {
            // making this empty ,so that on destroy it shd not update cache .
            this.ClearRedisCache()
            this.isvalidation = false;
            this.isLoading = false;
            this.createClicked = true;
            this.ModuleSwitchStateLogic(this.moduleTypeStateData)
            this.myOpenLeadService.clearLeadAddContactSessionStore()
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearContactList())
            this.store.dispatch(new ClearRelationshipCount());
            let val
            this.matSnackBar.open(res.Message, val, {
              duration: 2000
            }).afterDismissed().subscribe(() => {
              this.isLoading = false;
              this.oppArr = [];
                if (sessionStorage.getItem('selAccountObj')) {
                  this.router.navigate(['/accounts/accountleads/unqalified']);
                } else {
                  if (this.userId === this.leadOwnerId) {
                    this.router.navigate(['/leads/unqalified']);
                  } else {
                    this.router.navigate(['/leads/qualified']);
                  }
                } 
            });
          } else {
            this.contactLeadService.attachmentList = contactLeadServiceAttachments
            this.errPopup.throwError(res.Message)
            this.isLoading = false;
            this.createClicked = false;
          }
        }, error => {
          this.isLoading = false;
          this.createClicked = false;
          this.contactLeadService.attachmentList = contactLeadServiceAttachments
          this.errPopup.throwError("User doesn't have sufficient permissions to complete the task")
        })
    } else {
      this.service.validateAllFormFields(this.leadDealOwnerForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }
  ClearRedisCache() {
    this.service.SetRedisCacheData("empty", 'createLead').subscribe(res => console.log(res))
    this.service.deleteRedisCacheData('createlead').subscribe(res => console.log(res))
  }

  generateCreateReqParam() {
    this.contactLeadService.attachmentList = this.contactLeadService.attachmentList.map(x =>{
      return { 'Name' : x.Name, 'Url': x.Url,"MapGuid": x.MapGuid,"LinkActionType": x.LinkActionType,"Comments" : x.Comments }
    });
    return {
      "Title": this.leadNameChanges.trim(),
      "wipro_LeadSource": {"sysGuid": this.leadSourceId},
      "AllianceAccountGuid": this.AllianceAccountguid ? this.AllianceAccountguid : "",
      "AdvisoryAccountGuid": this.AdvisorAccountguid ? this.AdvisorAccountguid : "",
      "Prospect": {"Guid": this.wiproProspectAccount ? this.wiproProspectAccount : ""},
      "Account": {"SysGuid": this.customerAccount ? this.customerAccount : ""},
      "Vertical": {"Id": this.verticalId ? this.verticalId : ""},
      "SBU": {"Id": this.sbuId ? this.sbuId : ""},
      "EnquiryType": {"Id": this.enquiryId ? (this.enquiryId) : ""},
      "EnquiryDesc": this.leadDetailsForm.value.description === "" ? "" : encodeURIComponent(this.leadDetailsForm.value.description),
      "Agp": this.filterAgpData(this.finalAgpGroup),
      "Country": { "SysGuid": this.countryId },
      "isSolutionInvolved": this.leadDetailsForm.value.WiproSolutionToggle,
      "isServiceLineInvolved": this.leadDetailsForm.value.serviceLineToggle,
      "Solutions": this.filterWiproSolution(this.finalWiproSolutionGroup),
      "wipro_remarks": "",
      "DealValue": Number(this.leadDealOwnerForm.value.dealName.replace(/\,/g, "")),
      "DealValueInUSD": (this.leadDealOwnerForm.value.estimatedRateValue) ? this.leadDealOwnerForm.value.estimatedRateValue : "",
      "Currency": {"Id": (this.currencyId) ? this.currencyId : ""},
      "EstimatedCloseDate": this.datepipe.transform(this.leadDealOwnerForm.value.timeline, 'yyyy-MM-dd'),
      "Owner": {"ownerId": this.leadOwnerId},
      "ServiceLine": this.filterServiceBdm(this.ServiceTable),
      "ActivityGroups": this.filterActivityGroup(this.finalActivityGroup),
      "OpportunitiesOrOrders": this.filterOppotunityGroup(this.finalOppotunityGroup),
      "CustomerContacts": this.filterContactGroup(this.finalContactGroup),
      "Campaign": this.filterCampaignGroup(this.finalCampaignGroup),
      "Attachments": this.contactLeadService.attachmentList,
      "isFromMeeting" : this.isFromMeeting
    }
  }

  ModuleSwitchStateLogic(data) {
    if (data) {
      if (data.name == "Meeting") {
        this.store.dispatch(new ClearMeetingList({ cleardetails: data.data.Activityid }))
        this.store.dispatch(new ClearActivity())
        this.store.dispatch(new ClearActivityDetails())
      }
    }
  }

  filterAgpData(data) {
    if (data.length > 0) {
      return {
        Guid: data[0].SysGuid,
        MapGuid: (data[0].MapGid) ? data[0].MapGid : "",
        LinkActionType: data[0].LinkActionType
      }
    } else {
      return {
        Guid: ""
      }
    }
  }
  filterWiproSolution(data) {
    if (data.length > 0) {
      if (!this.iswiprosolution) {
        return []
      }
      return data.map(x => {
        return {
          SysGuid: x.SysGuid,
          MapGuid: (x.MapGuid) ? x.MapGuid : "",
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return []
    }
  }
  filterContactGroup(data) {
    return data.map(x => {
      return {
        Guid: (x.SysGuid) ? x.SysGuid : x.Guid,
        LinkActionType: x.LinkActionType
      }
    })
  }
  filterOppotunityGroup(data) {
    return data.map(x => {
      return {
        SysGuid: x.Guid,
        Type: x.Type,
        MapGuid: (x.MapGuid) ? x.MapGuid : "",
        LinkActionType: x.LinkActionType
      }
    })
  }
  filterServiceBdm(data) {
    if (this.isServicelines) {
      if (data) {
        if (data.length > 0) {
          data = data.filter(x => x.serviceLines.Guid != '')
          if (data.some(x => x.serviceLines.Guid != '')) {
            return data.map(x => {
              return {
                Guid: x.serviceLines.Guid,
                practice: {
                  practiceGuid: x.practice.practiceGuid
                },
                SLBDM: {
                  bdmidGuid: x.slbdm.bdmidGuid
                },
                LinkActionType: 1
              }
            })
          } else {
            return []
          }
        } else {
          return []
        }
      } else {
        return []
      }
    } else {
      return []
    }
  }

  filterActivityGroup(data) {
    return data.map(x => {
      return {
        Guid: x.Guid,
        MapGuid: (x.MapGuid) ? x.MapGuid : "",
        LinkActionType: x.LinkActionType
      }
    })
  }

  filterCampaignGroup(data) {
    return data.map(x => {
      return {
        Id: x.Id,
        LinkActionType: x.LinkActionType
      }
    })
  }

  callTempCurrency() {
    this.isCurrencySearchLoading = true
    this.CurrencyArrayList = []
    this.contactLeadService.getsearchCurrency("").subscribe(res => {
      this.isCurrencySearchLoading = false
      if (res.IsError === false) {
        this.CurrencyArrayList = res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
      } else {
        this.errPopup.throwError(res.Message);
        this.CurrencyArrayList = []
      }
    }, error => {
      this.isCurrencySearchLoading = false;
      this.CurrencyArrayList = []
    });
  }

  callTempSource() {
    this.isLeadSourceNameSearchLoading = true
    this.LeadSource = []
    this.contactLeadService.getsearchLeadSource("").subscribe(res => {
      this.isLeadSourceNameSearchLoading = false
      if (res.IsError === false) {
        this.LeadSource = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.LeadSource = []
      }
    }, error => {
      this.isLeadSourceNameSearchLoading = false;
      this.LeadSource = []
    });
  }

  callTempAdvisor() {
    this.leadDetailsForm.patchValue({
      advisorAccount: ''
    })
    this.isAdvisorLoader = true;
    this.AdvisorAccountArr = [];
    if (this.cacheDataService.cacheDataGet('advisorAcc').length > 0) {
      this.AdvisorAccountArr = this.cacheDataService.cacheDataGet('advisorAcc');
      this.isAdvisorLoader = false;
    } else {
      this.isAdvisorLoader = true
      this.AdvisorAccountArr = []
      this.contactLeadService.GetAdvisorAccount("").subscribe(
        data => {
          this.isAdvisorLoader = false
          if (data.IsError === false) {
            this.lookupdata.TotalRecordCount = data.TotalRecordCount
            this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
            this.AdvisorAccountArr = data.ResponseObject;
          } else {
            this.errPopup.throwError(data.Message);
            this.AdvisorAccountArr = []
          }
        }, error => {
          this.isAdvisorLoader = false;
          this.AdvisorAccountArr = []
        });
    }
  }

  callTempAccount() {
    this.leadDetailsForm.patchValue({
      accountOrCompanyName: ''
    })
    this.isAccountSearchLoader = true;
    this.companyNameSearch = [];
    if (this.cacheDataService.cacheDataGet('accountCompany').length > 0) {
      this.companyNameSearch = this.cacheDataService.cacheDataGet('accountCompany');
      this.isAccountSearchLoader = false;
    } else {
      this.isAccountSearchLoader = true
      this.companyNameSearch = []
      this.contactLeadService.getsearchAccountCompanyNew("").subscribe(res => {
        this.isAccountSearchLoader = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.companyNameSearch = res.ResponseObject;
        } else {
          this.errPopup.throwError(res.Message);
          this.companyNameSearch = []
        }
      }, error => {
        this.isAccountSearchLoader = false;
        this.companyNameSearch = []
      });
    }
  }

  callTempSbu() {
    this.isSbuLoder = true
    this.Conversationssbu = []
    this.contactLeadService.getsearchSBUbyName("", this.AccId, this.isProspect).subscribe(res => {
      this.isSbuLoder = false
      if (res.IsError === false) {
        this.Conversationssbu = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.Conversationssbu = []
      }
    }, error => {
      this.isSbuLoder = false;
      this.Conversationssbu = []
    });
  }

  callTempVertical() {
    this.isVerticalLoader = true
    this.Vertical = []
    let verticalSearchreqBody = {
      SearchText: "",
      Guid: this.AccId,
      SBUGuid: this.sbuId,
      isProspect: this.isProspect,
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
      this.isVerticalLoader = false
      if (res.IsError === false) {
        this.Vertical = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.Vertical = []
      }
    }, error => {
      this.isVerticalLoader = false;
      this.Vertical = []
    });
  }

  callTempCountry() {
    this.isCountryLoading = true
    this.countrySearch = []
    this.contactLeadService.getCoutry("").subscribe(data => {
      this.isCountryLoading = false
      if (data.IsError === false) {
        this.countrySearch = data.ResponseObject;
      } else {
        this.errPopup.throwError(data.Message);
        this.countrySearch = []
      }
    }, error => {
      this.isCountryLoading = false;
      this.countrySearch = []
    });
  }

  callTempAlliance() {
    this.isAllianceLoader = true
    this.AllianceAccountArr = []
    this.contactLeadService.GetAllianceAccount("").subscribe(
      data => {
        this.isAllianceLoader = false
        if (data.IsError === false) {
          this.lookupdata.TotalRecordCount = data.TotalRecordCount
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
          this.AllianceAccountArr = data.ResponseObject;
        } else {
          this.errPopup.throwError(data.Message);
          this.isAllianceLoader = false
        }
      }, error => {
        this.isAllianceLoader = false;
        this.AllianceAccountArr = []
      });
  }

  getServiceLineData(event, formData, colData, searchitem, flag) {
    this.onKeyUp(event, formData, colData, searchitem, (searchitem == '') ? true : false)
  }

  callTempWipro() {
    this.iswiproSolutionLoader = true
    this.wiproSolutionsearch = []
    this.contactLeadService.getWiproSolutions("").subscribe(
      data => {
        this.iswiproSolutionLoader = false
        if (data.IsError === false) {
          this.lookupdata.TotalRecordCount = data.TotalRecordCount
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
          this.WiproSolAdvanceData = data.ResponseObject;
          if (this.selectedWiproSolution.length > 0 && data.ResponseObject.length > 0) {
            this.wiproSolutionsearch = this.CompareRemoveSelected(data.ResponseObject, this.selectedWiproSolution, "SysGuid")
          } else {
            this.wiproSolutionsearch = data.ResponseObject;
          }
        } else {
          this.errPopup.throwError(data.Message);
          this.wiproSolutionsearch = []
        }
      }, error => {
        this.iswiproSolutionLoader = false;
        this.wiproSolutionsearch = []
      });
  }
  
  callTempActivity() {
    this.isAcivityGroupLoader = true
    this.Conversationslead = []
    this.contactLeadService.getSearchActivityGroup("", this.AccId, this.isProspect).subscribe(res => {
      this.isAcivityGroupLoader = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.ActivityAdvanceData = res.ResponseObject;
        if (this.selectedConversation.length > 0 && res.ResponseObject.length > 0) {
          this.Conversationslead = this.CompareRemoveSelected(res.ResponseObject, this.selectedConversation, "Guid")
        } else {
          this.Conversationslead = res.ResponseObject;
        }
      } else {
        this.errPopup.throwError(res.Message)
        this.Conversationslead = []
      }
    }, error => {
      this.isAcivityGroupLoader = false;
      this.Conversationslead = []
    });
  }

  callTempCampaign() {
    this.isCampaignLoading = true
    this.Conversationscamp = []
    this.contactLeadService.getsearchCampaign("", this.AccId, this.isProspect).subscribe(res => {
      this.isCampaignLoading = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.CampaignAdvanceData = res.ResponseObject;
        if (this.selectedCamp.length > 0 && res.ResponseObject.length > 0) {
          this.Conversationscamp = this.CompareRemoveSelected(res.ResponseObject, this.selectedCamp, "Id")
        } else {
          this.Conversationscamp = res.ResponseObject;
        }
      } else {
        this.errPopup.throwError(res.Message);
        this.Conversationscamp = []
      }
    }, error => {
      this.isCampaignLoading = false;
      this.Conversationscamp = []
    });
  }

  callTempOpportunity() {
    this.isOpportunityLoader = true
    this.Conversationsoppo = []
    this.contactLeadService.searchOpportunityOrder("", this.AccId, this.isProspect).subscribe(res => {
      this.isOpportunityLoader = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.OppAdvanceData = res.ResponseObject;
        if (this.selectedOppertunity.length > 0 && res.ResponseObject.length > 0) {
          this.Conversationsoppo = this.CompareRemoveSelected(res.ResponseObject, this.selectedOppertunity, "Guid")
        } else {
          this.Conversationsoppo = res.ResponseObject;
        }
      } else {
        this.errPopup.throwError(res.Message);
        this.Conversationsoppo = []
      }
    }, error => {
      this.isOpportunityLoader = false;
      this.Conversationsoppo = []
    });
  }

  callTempAgp() {
    this.isAgpLoader = true
    this.Conversationsagp = []
    this.contactLeadService.getsearchLinkAGP("").subscribe(res => {
      this.isAgpLoader = false
      if (res.IsError === false) {
        this.Conversationsagp = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.Conversationsagp = []
      }
    }, error => {
      this.isAgpLoader = false;
      this.Conversationsagp = []
    });
  }

  callTempContact() {
    this.isCustometContactLoader = true
    this.customerContactdetails = []
    this.contactLeadService.searchCustomerparticipants("", this.AccId, this.isProspect).subscribe(data => {
      this.isCustometContactLoader = false
      if (data.IsError === false) {
        this.lookupdata.TotalRecordCount = data.TotalRecordCount
        this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        this.customerAdvanceData = data.ResponseObject;
        if (this.selectedCustomer.length > 0 && data.ResponseObject.length > 0) {
          this.customerContactdetails = this.CompareRemoveSelected(data.ResponseObject, this.selectedCustomer, "Guid")
        } else {
          this.customerContactdetails = data.ResponseObject;
        }
        this.customerContactdetails = data.ResponseObject;
      } else {
        this.errPopup.throwError(data.Message);
        this.customerContactdetails = []
      }
    }, error => {
      this.isCustometContactLoader = false;
      this.customerContactdetails = []
    });
  }

  callTempOwner() {
    this.isLeadOwnerLoader = true
    this.wiproContactowner = []
    this.contactLeadService.getsearchLeadOwner("").subscribe(data => {
      this.isLeadOwnerLoader = false
      if (data.IsError === false) {
        this.lookupdata.TotalRecordCount = data.TotalRecordCount
        this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        this.wiproContactowner = data.ResponseObject;
      } else {
        this.errPopup.throwError(data.Message);
        this.wiproContactowner = []
      }
    }, error => {
      this.isLeadOwnerLoader = false;
      this.wiproContactowner = []
    });
  }
  accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  fileChangeEvent(e) {
    debugger
    let files = [].slice.call(e.target.files);
    let uploadingFileList = [];
    let fileNames = [];
    if (files.length > 0) {
      files.forEach(res => {
        let file: File = res;
        let canditionAction = this.fileValidation(file)
        switch (canditionAction) {
          case 'FileSize': {
            this.errPopup.throwError("Not able to upload the file because filesize is greater than 5mb.");
            break;
          }
          case 'InvalidFormat': {
            this.errPopup.throwError("File format not supported!")
            break;
          }
          case 'FileExist': {
            this.errPopup.throwError("File is already exist!")
            break;
          }
          case 'Upload': {
            debugger
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
    if (this.contactLeadService.attachmentList.length == 0) {
      if (this.accept.includes(file.type)) {
        return 'Upload'
      }
      if (!this.accept.includes(file.type)) {
        return 'InvalidFormat'
      }
    }
    if (this.contactLeadService.attachmentList.length > 0) {
      let index = this.contactLeadService.attachmentList.findIndex(k => k.Name == file.name);
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
    debugger
    if (fileList.length > 0) {
      this.isLoading = true
      // this.fileService.filesToUpload(fileList).subscribe((res) => {
        this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
        this.isLoading = false;
        res.forEach((file, i) => {
          if (file !== '') {
            this.contactLeadService.attachmentList.push({
              "Name": fileNames[i],
              "Url": file.ResponseObject.Url,
              "MapGuid": "",
              "LinkActionType": 1,
              "Comments": [{ "Description": "" }],
              downloadFileName: file.ResponseObject.Name
            })
          }
          this.CreateRedisCache();
        })
      },
        () => this.isLoading = false
      )}
  }
  
  previousPage() {
    if (this.routingState.getPreviousUrl().includes('/activities/list')) {
      this.router.navigateByUrl('/activities/list');
    }
    else {
      this.routingState.backClicked();
    }
    this.myOpenLeadService.clearLeadAddContactSessionStore()
  }
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}

@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
  styleUrls: ['./create-lead.component.scss'],
})
export class cancelpopComponent {
  leadIdentityFrom: any;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<cancelpopComponent>, public router: Router, private myOpenLeadService: MyOpenLeadsService, private routingState: RoutingState, )
  { }

  noneditdetails() {
    this.dialogRef.close(true)
    this.leadIdentityFrom = JSON.parse(sessionStorage.getItem('navigationfromlist'))
    if (this.data != null) {
      // if user is trying to create lead from other modules!!! to navigate back this below routes
      this.router.navigate([this.data.Moduleroute])
    }else if (this.leadIdentityFrom == 2) {
      this.router.navigate(['leads/unqalified'])
    } else if (this.leadIdentityFrom == 1) {
      this.router.navigate(['leads/qualified'])
    } else if (this.leadIdentityFrom == 3) {
      this.router.navigate(['leads/archived'])
    } else if (this.leadIdentityFrom == 4) {
      this.router.navigate(['leads/diqualified'])
    }
    this.myOpenLeadService.clearLeadAddContactSessionStore()
  }
}
@Component({
  selector: 'delete-attach-pop',
  templateUrl: './delete-attach-pop.html',
  styleUrls: ['./create-lead.component.scss'],
})
export class deleteAttachPopUp {
  constructor(private dialogRef: MatDialog, public dialog: MatDialogRef<deleteAttachPopUp>) { }
  okClicked() {
    this.dialog.close({ 'OK': true });
  }
  closeallpop() {
    this.dialog.close({ 'OK': false });
  }
}

