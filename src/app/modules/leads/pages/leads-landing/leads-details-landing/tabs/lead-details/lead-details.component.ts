import { Component, OnInit, Inject, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ContactleadService } from '@app/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { checkLimit, removeSpaces, specialCharacter } from '@app/shared/pipes/white-space.validator';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadLeadDetails, UpdateLeadDetails, ClearArchivedLeadState, ClearOpenLeadState, ClearMyopenlead, UpdateHistoryflag, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { OfflineService, routes, ErrorMessage } from '@app/core/services';
import { getLeadsDetails } from '@app/core/state/selectors/lead/lead.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { MyOpenLeadsService, LeadCustomErrorMessages, leadAdvnHeaders, leadAdvnNames } from '@app/core/services/myopenlead.service';
import { Subscription } from 'rxjs';
import { ClearActivity, ClearMeetingList, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { Location } from '@angular/common';
import { environment as env } from '@env/environment';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import { ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified"
}
export interface selectedCustomerContact {
  FullName: string,
  Designation: string,
  isKeyContact: boolean,
  SysGuid: string,
  MapGuid: string,
  Email: string,
  LinkActionType: number
}
export interface selectedOpportunity {
  Type: string,
  MapGuid: string,
  Guid: string,
  Title: string
  LinkActionType: number
}

export const ServiceLineTable: any[] = [
  { id: 1, name: 'serviceLines', title: 'Service line', place: 'Search service line', controltype: 'autocomplete', closePopUp: '@serviceLines', serviceData: [], reqFildId: 'Guid', isRequired: true, IsRelation: ["practice", "slbdm"] },
  { id: 1, name: 'practice', title: 'Practice', place: 'Search practice', controltype: 'autocomplete', closePopUp: '@practice', serviceData: [], reqFildId: 'practiceGuid', isRequired: false },
  { id: 1, name: 'slbdm', title: 'SL BDM', place: 'Search service line BDM', controltype: 'autocomplete', closePopUp: '@slbdm', serviceData: [], reqFildId: 'bdmidGuid', isRequired: true, submit: true },
]

const ArchivedStatus = ['Rejected']  // 'Archived', 'Disqualified',
@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss'],

})
export class LeadDetailsComponent implements OnInit {
  consent: boolean = false;
  id: any;
  leadId: any;
  leadDetails: any = [];
  edit: boolean = true;
  firstleadDetailsArr: any = [];
  serviceLines: any = [];
  linkedLeadDetails: any = [];
  leadInformation: any = [];
  leadOriginator: any = [];
  overviewObject: {};
  customers: any = [];
  serviceLine: any = [];
  Edit_Wipro_serviceline = [];
  Account: any
  LeadDetailsEditForm: FormGroup;
  leadguId: any;
  leaddetailsview: {};
  companyNameSearch: any = [];
  Vertical: any = [];
  LeadSource: any = [];
  agpSearchArr: any = [];
  CampaignSearch: any = [];
  Conversationsoppo: any = [];
  Conversationssbu: any = [];
  enquiryType: any = [];
  ConversationsserviceLine: any = [];
  AcivityGroupsearch: any = [];
  customerContactDetails: any = [];
  wiproContactsearch: any = [];
  wiproContactowner: any = [];
  getCountry: any = [];
  selectedOpportunity: selectedOpportunity[] = [];
  AccountcompanyDetails: any;
  servicelineSysGuid: any;
  isLoading: boolean = false;
  campaignId: any;
  linkagpGuid: any;
  selectedLeadSource: any = [];
  dealvalueInUSD: any;
  Iscurrency: Boolean;
  leadName: any;
  selectedCustomerContact: selectedCustomerContact[] = [];
  selectedServiceLine: any = [];
  opp: any;
  leadDetailsopp: any = [];
  EditleadDetails: any = [];
  currencyres: any;
  currencyId: string = "";
  currencyRateValue: any;
  showConversationleadsrc: boolean = false;
  Conversationleadsrc: string = "";
  leadSourceSwitch: boolean = false;
  leadSourceId: string = "";
  showConversationvertical: boolean = false;
  Conversationvrtcl: string = "";
  ConversationNameSwitchvertical: boolean = false;
  verticalId: any;
  selectedvertical: any = [];
  Conversationsbu: string = "";
  sbuSwitch: boolean = false;
  sbuId: any;
  selectedsbu: any = [];
  AccountCompanyName: string;
  AccountshowCompany: boolean = false;
  wiproProspectAccount: any = '';
  customerAccount: any = '';
  accntCompany: any;
  enquiryId: any;
  countryId: any;
  serviceLineName: string;
  serviceLineShowName: boolean;
  servicelisList: any = [];
  activityGroupName: string;
  currencySwitch: boolean = false
  activityGroupSwitch: boolean = false;
  selectedActivityGroup: any[] = [];
  conversationId: any;
  conversationList: any = [];
  campaignName: string;
  campignSwitch: boolean = false;
  selectedCampaign = [];
  campList: any = [];
  oppName: string;
  wiproSolutionName: string;
  opportunitySwitch: boolean = false;
  oppArr: any = [];
  agpName: string;
  agpNameSwitch: boolean = false;
  selectedAgp: any = [];
  UnsubscribeLeadDetails$: Subscription
  ownerName: string;
  leadOwnerswitch: boolean;
  selectedOwner: any[] = [];
  leadOwnerId: any;
  companyName6: string;
  customerContactSwitch: boolean;
  companyName7: string;
  showCompany7: boolean;
  CampMapGuid: any;
  convMapGuid: any;
  autooverlay = false
  selectedservicelineauto: {}[] = [];
  servicelineGuid: any;
  leadType: any;
  leadOwnerName: any;
  ServiceTable = [];
  notArchived: boolean
  ServiceMapGuid: any;
  leadIdentityFrom: number
  LeadName: any;
  sixMonthDate: any;
  StartDate: any;
  RequestFlag: boolean = true;
  isVertical: boolean = true;
  AdvisorAccountArr: any = [];
  AllianceAccountArr: any = [];
  AdvisorsAccount: boolean;
  AllianceAccount: boolean;
  AdvisorAccountguid: string = "";
  AdvisorName: string = "";
  AdvisorAccountSwitch: boolean;
  allianceAccountSwitch: boolean;
  AllianceAccountguid: string = "";
  AllianceName: string = "";
  requestCamp: boolean;
  wiproSolutionArr: any = [];
  selectedwiproSolutionArr: any = [];
  selectedCountry: any;
  countrySearch: any = [];
  wiproSolutionsearch: any = [];
  customerContactdetails: any = [];
  editLeadDetails: any
  texeareaPatch: any;
  AccName: any;
  wiproSolutionSwitch: boolean = false;
  leadDetailsForm: any;
  AllianceData: any;
  AdvisorData: any;
  enqiuryTypedata: any;
  isLeadSourceSearchLoading = false;
  isAccountNameSearchLoading = false;
  isSBUSearchLoading = false;
  isLinkedActivitiesSearchLoading = false;
  isLinkedCampaignSearchLoading = false;
  isOpportunityOrderSearchLoading = false;
  isLeadAGPSearchLoading = false;
  isLeadOwnerSearchLoading = false;
  isCustomContactsSearchLoading = false;
  descriptionLength: boolean = false;
  disableSbu: boolean = true;
  disabledealvalue: boolean = false
  disablecurrency: boolean = false
  dealValueError: boolean = false
  searchitem = ""
  searchPractice = ""
  searchSlbdm = ""
  addComments = true;
  commentId: any;
  showservicelineauto: boolean = false;
  servicelineauto: string;
  servicelineautoSwitch: boolean = true;
  servicelineTable_Data: any = [];
  selectedAll: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  leadSourceName: any;
  verticalName: any;
  sbuName: any;
  LeadSourceAllianceAcount: any;
  AdvisorsInflunce: boolean = false;
  Alliance_Partner: boolean = false;
  iswiprosolution: boolean;
  isServicelines: boolean;
  countrySwitch: boolean;
  moduleTypeStateData: any
  leadGuid: any;
  selectedWiproSolution = [];
  ExistingWiproSolutionData = []
  finalWiproSolutionGroup = []
  ExistingActivityData = []
  finalActivityGroup = []
  ExistingCampaignData = [];
  finalCampaignGroup = [];
  ExistingOpportunityData = [];
  finalOppotunityGroup = [];
  ExistingAgpData = [];
  finalAgpGroup = [];
  ExistingContactData = [];
  ExistingAttachmentList = []
  finalContactGroup = [];
  leadSourceSelected: any;
  leadSrcName: string = "";
  countryName: string = "";
  isSwitch: boolean;
  equiryName: any;
  currencyType: any;
  currencyTypeData: any;
  currencyName: string = "";
  TempLeadDetails: any = []
  Switch: any
  LeadStateDetails: any
  tableInValid: boolean;
  VerticalSelected: any;
  disableVertical: boolean = true;
  showOpprtunityDropdown: boolean
  AccountId: any;
  ProspectBool: any;
  isProspect: boolean
  showArchivedremarks: boolean
  showHistorybtn: boolean
  isLeadSourceNameSearchLoading: boolean = false
  isAccountSearchLoader: boolean = false
  isSbuLoder: boolean = false
  isVerticalLoader: boolean = false
  isAllianceLoader: boolean = false
  enquiryTypeAria: any = "";
  isAdvisorLoader: boolean = false
  isCountryLoading: boolean = false
  iswiproSolutionLoader: boolean = false
  isAcivityGroupLoader: boolean = false
  isCampaignLoading: boolean = false
  isOpportunityLoader: boolean = false
  isAgpLoader: boolean = false
  isLeadOwnerLoader: boolean = false
  isLeadCurrencyLoader: boolean = false
  isServicelineLoader: boolean = false
  isCustometContactLoader: boolean = false
  arrowkeyLocation = 0;
  currency = []
  RequestAlliance: boolean = false;
  saveclicked: boolean = false;
  OriginatorDetails: any
  userID: any;
  CountryDetails: any;
  disabledAccount: boolean = true
  showEditBtn$: Subscription
  selctedCurrency
  CurrencyArrayList: any[];
  uddatedLeadsDetails: any
  sendCampaignToAdvance = []
  sendAccountToAdvance: any = []
  sendAllianceToAdvance: any = []
  sendOwnerToAdvance: any = []
  sendWiproSolutionToAdvance: any = []
  sendActivityToAdvance: any = []
  sendOppToAdvance: any = []
  sendAdvisorToAdvance: any = []
  sendCustomerToAdvance: any = []
  AccountSelected: any = []
    //advance look up data
    ActivityAdvanceData: any=[];
    CampaignAdvanceData: any=[];
    OppAdvanceData: any=[];
    WiproSolAdvanceData: any=[];
    customerAdvanceData: any=[];
  isToRemoveAllianceAccount: boolean = false
  isToRemoveAdvisoryAccount: boolean = false
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
    }
  };
  customFilter: any = { isDeleted: false };
  isMobileDevice: boolean = false;
  nurtureRemarks: any;
  ArchiveAndDisqualifyRemarks:any;
  IdentifyAppendFunc = {
    'accountSearch': (data) => { this.appendAccountName(data.Name, data, true, true) },
    'allianceSearch': (data) => { this.appendalliance(data.Name, data, 0) },
    'advisorSearch': (data) => { this.appendadvisor(data.Name, data, 0) },
    'ownerSearch': (data) => { this.appendLeadOwner(data.FullName, data, 0) },
    'wiproSoluSearch': (data) => { this.appendWiproSolutions(data.Name, data, true, 0) },
    'activitySearch': (data) => { this.appendActivityGroup(data.Name, data, true, 0) },
    'campaignSearch': (data) => { this.appendCampaign(data.Name, data, true, 0) },
    'oppoSearch': (data) => { this.appendOpportunity(data.Name, data, true, 0) },
    'agpSearch': (data) => { this.appendAgp(data.Name, data, 0) },
    'contactSearch': (data) => { this.appendCustomerContact(data.FullName, data, true, 0) }
  }

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendAccountToAdvance.length > 0) ? this.sendAccountToAdvance : [] }
      case 'allianceSearch': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
      case 'advisorSearch': { return (this.sendAdvisorToAdvance.length > 0) ? this.sendAdvisorToAdvance : [] }
      case 'ownerSearch': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : [] }
      case 'wiproSoluSearch': { return (this.sendWiproSolutionToAdvance.length > 0) ? this.sendWiproSolutionToAdvance : [] }
      case 'activitySearch': { return (this.sendActivityToAdvance.length > 0) ? this.sendActivityToAdvance : [] }
      case 'campaignSearch': { return (this.selectedCampaign.length > 0) ? this.selectedCampaign : [] }
      case 'oppoSearch': { return (this.sendOppToAdvance.length > 0) ? this.sendOppToAdvance : [] }
      case 'contactSearch': { return (this.selectedCustomerContact.length > 0) ? this.selectedCustomerContact : [] }
    }
  }
  // duplicates removed from advance lookup
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountSearch': { return this.AccountSelected = [], this.sendAccountToAdvance = [] }
      case 'allianceSearch': { return this.AllianceData = [], this.sendAllianceToAdvance = [] }
      case 'advisorSearch': { return this.AdvisorData = [], this.sendAdvisorToAdvance = [] }
      case 'ownerSearch': { return this.selectedOwner = [], this.sendOwnerToAdvance = [] }
      case 'wiproSoluSearch': { return this.selectedWiproSolution = [], this.sendWiproSolutionToAdvance = [] }
      case 'activitySearch': { return this.selectedActivityGroup = [], this.sendActivityToAdvance = [] }
      case 'campaignSearch': { return this.selectedCampaign = [] }
      case 'oppoSearch': { return this.selectedOpportunity = [], this.sendOppToAdvance = [] }
      case 'contactSearch': { return this.selectedCustomerContact = [] }
    }
  }

  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public router: Router,
    public service: DataCommunicationService,
    private encrDecrService: EncrDecrService,
    private contactleadservice: ContactleadService,
    private leadFormBuilder: FormBuilder,
    public contactLeadService: ContactleadService,
    private masterApi: MasterApiService,
    public matSnackBar: MatSnackBar,
    private datepipe: DatePipe,
    public errorMessage: ErrorMessage,
    private store: Store<AppState>,
    private errPopup: ErrorMessage,
    private meetingService: MeetingService,
    private myOpenLeadService: MyOpenLeadsService,
    private offlineService: OfflineService,
    private meetingApi: MeetingService,
    public daService: DigitalAssistantService,
    private fileService: FileUploadService,public envr : EnvService) {

    this.contactLeadService.attachmentList = []
    this.showEditBtn$ = this.service.getLeadParentActionBtn().subscribe(res => {
      if (res != null && res != undefined) {
        if (res.status == 'cancel' && this.edit == false) {
          this.opencancelpop()
        } else if (res.status == 'save' && this.edit == false) {
          this.save()
        } else if (res.status == 'edit') {
          this.edited()
        }
      }
    })
  }
  servicelineautoclick() {
    this.LeadDetailsEditForm.value.serviceLine = true;
    this.autooverlay = true;
  }
  practiceswitchauto() {
    this.LeadDetailsEditForm.value.practice = true;
    this.autooverlay = true;
  }
  solutionswitchauto() {
    this.LeadDetailsEditForm.value.slbdm = true;
    this.autooverlay = true;
  }
  closeoverlayauto() {
    this.autooverlay = false;
    this.LeadDetailsEditForm.value.serviceLine = false;
    this.LeadDetailsEditForm.value.practice = false;
    this.LeadDetailsEditForm.value.slbdm = false;
  }

  edited() {
    this.edit = false;
    this.ResetAllSelectedGroups()
    this.ResetAllFinalGroups()
    this.ServiceTable = []
    this.setTheDetails(this.editLeadDetails)
    this.LoadLeadDetailsToDom()
    this.service.sendLeadCancelSave(false) // show cancle and save btn

  }
  ResetAllFinalGroups() {
    this.finalActivityGroup = []
    this.finalAgpGroup = []
    this.finalCampaignGroup = []
    this.finalContactGroup = []
    this.finalOppotunityGroup = []
    this.finalWiproSolutionGroup = []
  }
  ResetAllSelectedGroups() {
    this.selectedCustomerContact = []
    this.selectedActivityGroup = []
    this.selectedCampaign = []
    this.selectedWiproSolution = []
    this.selectedAgp = []
    this.selectedOpportunity = []
  }
  ResetTheLablesName() {
    this.AllianceAccount = false
    this.AdvisorsAccount = false
  }
  maxlength(event) {
    if (event.target.value.length > 5) {
      return true
    }
  }
  navigateToHistory() {
    let changes = { isHistory: true }
    const historyChange = {
      id: this.id,
      changes
    }
    this.store.dispatch(new UpdateHistoryflag({ Historyflag: historyChange }))
    this.router.navigate(['leads/leadDetails/leadHistory'])
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

  performSaveAction() {
    console.log("perform save action")
  }
  performCancleAction() {
    console.log("perform cancle action")
  }
  isLeadFromArchivedList(res: any): boolean {
    return ArchivedStatus.some(x => x == res.Status.status)
  }
  wiproSolutionData(data: string) {
    return data.replace(/ *\([^)]*\) */g, "");
  }

  ngOnInit() {
    this.isLoading = true;
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem('LeadId')), 'DecryptionDecrip')
    this.userID = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.contactLeadService.attachmentList = [];
    this.servicelineTable_Data = ServiceLineTable;
    this.InitializeDetailsForm()
    this.setValidatorsForContact(false)
    // this.OnChange()
    this.leadIdentityFrom = JSON.parse(sessionStorage.getItem('navigationfromlist'))
    this.UnsubscribeLeadDetails$ = this.store.pipe(select(getLeadsDetails(this.id))).subscribe(res => {
      if (res) {
        console.log('res', res)
        this.decidedisableDealValue(res)
        this.decideShowHistoryBtn(res)
        this.ServiceTable = []
        this.isLoading = false
        this.contactLeadService.attachmentList = []
        this.leadDetails = { ...res}
        this.nurtureRemarks = decodeURIComponent(this.leadDetails.wipro_nurtureremarks)
        this.ArchiveAndDisqualifyRemarks = decodeURIComponent(this.leadDetails.remarks)
        this.ProspectBool = this.leadDetails.Account.isProspect
        if (this.leadDetails.Attachments.length > 0) {
          let Comments = []
          this.leadDetails.Attachments.forEach(data => {
            Comments = []
            if (data.Comments.length === 0) {
              Comments = [{ Description: '' }]
            } else {
              Comments.push({ Id: data.Comments[0].Id, Description: data.Comments[0].Description ? data.Comments[0].Description : '' })
            }
            this.contactLeadService.attachmentList.push({ Name: data.Name, Url: data.Url, Comments: Comments, MapGuid: data.Guid, LinkActionType: data.LinkActionType,downloadFileName : data.Name })
          })
        }
        this.showArchivedremarks = this.ArchiveRemarks(this.leadDetails)
        if (sessionStorage.getItem('TempEditLeadDetails')) {
          let LeadTempDetails = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'))
          this.moduleTypeStateData = (LeadTempDetails.moduletype) ? LeadTempDetails.moduletype : null
          this.setTheDetails(LeadTempDetails)
          this.edit = false
          this.service.sendLeadCancelSave(false)
          this.leadIdentityFrom = JSON.parse(LeadTempDetails.navigation)
          sessionStorage.setItem('navigationfromlist', JSON.stringify(LeadTempDetails.navigation))
        } else {
          this.setTheDetails({ ...res })
        }
      }
      else {
        this.GetLeadDetails(this.id, this.userID)
      }
    })
  }

  InitialServiceCall(){
    this.LeadDetailsEditForm.controls.leadSource.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.leadSourceSwitch) {
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

    // this.LeadDetailsEditForm.controls.accountOrCompanyName.valueChanges.subscribe(val => {
    //   if (val !== "" && val != null && this.AccountshowCompany && val.length >= 3) {
    //     this.isAccountSearchLoader = true
    //     this.companyNameSearch = []
    //     this.contactLeadService.getsearchAccountCompanyNew(val).subscribe(res => {
    //       this.isAccountSearchLoader = false
    //       this.isLoading = false;
    //       if (res.IsError === false) {
    //         this.companyNameSearch = res.ResponseObject;
    //       } else {
    //         this.errPopup.throwError(res.Message);
    //         this.companyNameSearch = []
    //       }
    //       console.log("getsearchAccName", res)
    //     }, error => {
    //       this.isAccountSearchLoader = false;
    //       this.companyNameSearch = []
    //     });
    //   }
    // })

    // this.LeadDetailsEditForm.controls.sbu.valueChanges.subscribe(val => {
    //   if (val !== "" && val != null && this.sbuSwitch) {
    //     this.isSbuLoder = true
    //     this.Conversationssbu = []
    //     this.contactLeadService.getsearchSBUbyName(val, this.AccountId, this.isProspect).subscribe(res => {
    //       this.isSbuLoder = false
    //       if (res.IsError === false) {
    //         this.Conversationssbu = res.ResponseObject;
    //       } else {
    //         this.errPopup.throwError(res.Message);
    //         this.Conversationssbu = []
    //       }
    //       console.log("getsearchsbu", res)
    //     }, error => {
    //       this.isSbuLoder = false;
    //       this.Conversationssbu = []
    //     });
    //   } else {
    //     this.ResetValidatorsVerticalInput()
    //     this.LoadLeadDetailsToDom()
    //   }
    // })

    // this.LeadDetailsEditForm.controls.vertical.valueChanges.subscribe(val => {
    //   if (val !== "" && val != null && this.ConversationNameSwitchvertical) {
    //     this.isVerticalLoader = true
    //     this.Vertical = []
    //     let verticalSearchreqBody = {
    //       SearchText: "",
    //       Guid: this.AccountId,
    //       SBUGuid: this.sbuId,
    //       isProspect: this.isProspect,
    //       PageSize: 10,
    //       OdatanextLink: "",
    //       RequestedPageNumber: 1
    //     }
    //     this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
    //       this.isVerticalLoader = false
    //       if (res.IsError === false) {
    //         this.Vertical = res.ResponseObject;
    //       } else {
    //         this.errPopup.throwError(res.Message);
    //         this.Vertical = []
    //       }
    //     }, error => {
    //       this.isVerticalLoader = false;
    //       this.Vertical = []
    //     });
    //   }
    // })

    this.LeadDetailsEditForm.controls.allianceAccount.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.allianceAccountSwitch) {
        this.isAllianceLoader = true
        this.AllianceAccountArr = []
        this.contactLeadService.GetAllianceAccount(val).subscribe(
          data => {
            this.isAllianceLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
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

    this.LeadDetailsEditForm.controls.advisorAccount.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.AdvisorAccountSwitch) {
        this.isAdvisorLoader = true
        this.AdvisorAccountArr = []
        this.contactLeadService.GetAdvisorAccount(val).subscribe(
          data => {
            this.isAdvisorLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
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

    this.LeadDetailsEditForm.controls.country.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.countrySwitch) {
        this.isCountryLoading = true
        this.countrySearch = []
        this.contactLeadService.getCoutry(val).subscribe(
          data => {
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

    this.LeadDetailsEditForm.controls.wiproSolutions.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.wiproSolutionSwitch) {
        this.iswiproSolutionLoader = true
        this.wiproSolutionsearch = []
        this.contactLeadService.getWiproSolutions(val).subscribe(
          data => {
            this.iswiproSolutionLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
              this.WiproSolAdvanceData = data.ResponseObject;
              if (this.selectedWiproSolution.length > 0 && data.ResponseObject.length > 0) {
                this.wiproSolutionsearch = this.CompareRemoveSelected(data.ResponseObject, this.selectedWiproSolution, 'SysGuid')
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

    this.LeadDetailsEditForm.controls.linkedActivityGroup.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.activityGroupSwitch) {
        this.isAcivityGroupLoader = true
        this.AcivityGroupsearch = []
        this.contactLeadService.getSearchActivityGroup(val, this.AccountId, this.isProspect).subscribe(res => {
          this.isAcivityGroupLoader = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            this.ActivityAdvanceData = res.ResponseObject;
            if (this.selectedActivityGroup.length > 0 && res.ResponseObject.length > 0) {
              this.AcivityGroupsearch = this.CompareRemoveSelected(res.ResponseObject, this.selectedActivityGroup, "Guid")
            } else {
              this.AcivityGroupsearch = res.ResponseObject;
            }
          } else {
            this.errPopup.throwError(res.Message)
            this.AcivityGroupsearch = []
          }
        }, error => {
          this.isAcivityGroupLoader = false;
          this.AcivityGroupsearch = []
        });
      }
    })

    this.LeadDetailsEditForm.controls.linkedcampaign.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.campignSwitch) {
        this.isCampaignLoading = true
        this.CampaignSearch = []
        this.contactLeadService.getsearchCampaign(val, this.AccountId, this.isProspect).subscribe(res => {
          this.isCampaignLoading = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.CampaignAdvanceData = res.ResponseObject;
            if (this.selectedCampaign.length > 0 && res.ResponseObject.length > 0) {
              this.CampaignSearch = this.CompareRemoveSelected(res.ResponseObject, this.selectedCampaign, "Id")
            } else {
              this.CampaignSearch = res.ResponseObject;
            }
          } else {
            this.errPopup.throwError(res.Message);
            this.CampaignSearch = []
          }
        }, error => {
          this.isCampaignLoading = false;
          this.CampaignSearch = []
        });
      }
    })

    this.LeadDetailsEditForm.controls.linkedopportunity.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.showOpprtunityDropdown) {
        this.isOpportunityLoader = true
        this.Conversationsoppo = []
        this.contactLeadService.searchOpportunityOrder(val, this.AccountId, this.isProspect).subscribe(res => {
          this.isOpportunityLoader = false
          if (res.IsError === false) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount
            this.OppAdvanceData = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            if (this.selectedOpportunity.length > 0 && res.ResponseObject.length > 0) {
              this.Conversationsoppo = this.CompareRemoveSelected(res.ResponseObject, this.selectedOpportunity, "Guid")
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

    this.LeadDetailsEditForm.controls.linkAgp.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.agpNameSwitch) {
        this.isAgpLoader = true
        this.agpSearchArr = []
        this.contactLeadService.getsearchLinkAGP(val).subscribe(res => {
          this.isAgpLoader = false
          if (res.IsError === false) {
            this.agpSearchArr = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
            this.agpSearchArr = []
          }
        }, error => {
          this.isAgpLoader = false;
          this.agpSearchArr = []
        });
      }
    })

    // this.LeadDetailsEditForm.controls.leadowner.valueChanges.subscribe(val => {
    //   if (val !== "" && val != null && this.leadOwnerswitch) {
    //     this.isLeadOwnerLoader = true
    //     this.wiproContactowner = []
    //     this.contactLeadService.getsearchLeadOwner(val).subscribe(
    //       data => {
    //         this.isLeadOwnerLoader = false
    //         if (data.IsError === false) {
    //           this.lookupdata.TotalRecordCount = data.TotalRecordCount
    //           this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
    //           this.wiproContactowner = data.ResponseObject;
    //         } else {
    //           this.errPopup.throwError(data.Message);
    //           this.wiproContactowner = []
    //         }
    //       }, error => {
    //         this.isLeadOwnerLoader = false;
    //         this.wiproContactowner = []
    //       });
    //   }
    // })

    this.LeadDetailsEditForm.controls.currency.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.currencySwitch) {
        this.isLeadCurrencyLoader = true
        this.CurrencyArrayList = []
        this.contactLeadService.getsearchCurrency(val).subscribe(
          data => {
            this.isLeadCurrencyLoader = false
            if (data.IsError === false) {
              this.CurrencyArrayList = data.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
            } else {
              this.errPopup.throwError(data.Message);
              this.CurrencyArrayList = []
            }
          }, error => {
            this.isLeadCurrencyLoader = false;
            this.CurrencyArrayList = []
          });
      }
    })

    this.LeadDetailsEditForm.controls.customerContact.valueChanges.subscribe(val => {
      if (val !== "" && val != null && this.customerContactSwitch) {
        this.isCustometContactLoader = true
        this.customerContactdetails = []
        this.meetingApi.searchCustomerparticipants(val, this.AccountId, this.isProspect).subscribe(
          data => {
            this.isCustometContactLoader = false
            if (data.IsError === false) {
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
              this.customerAdvanceData = data.ResponseObject;
              if (this.selectedCustomerContact.length > 0 && data.ResponseObject.length > 0) {
                this.customerContactdetails = this.CompareRemoveSelected(data.ResponseObject, this.selectedCustomerContact, 'Guid')
              } else {
                this.customerContactdetails = data.ResponseObject;
              }
              this.customerContactdetails = data.ResponseObject
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
  commentindex = -1
  nonEditcommmentView: boolean = false
  nonEditViweComment(index) {
    this.commentindex = index
    this.nonEditcommmentView = true
  }
  nonEditViewComment() {
    this.nonEditcommmentView = false;
  }

  editCommnetIndex = -1
  editcommmentView: boolean = false;
  flagC = ""
  onEditCommentPopUp(index, comment, flagC) {
    this.editCommnetIndex = index
    this.flagC = flagC
    if (comment) {
      this.LeadDetailsEditForm.patchValue({
        comments: comment
      })
    } else {
      this.LeadDetailsEditForm.patchValue({
        comments: ''
      })
    }

    this.editcommmentView = true
  }
  closeEditCommentPopup() {
    this.editCommnetIndex = -1
    this.editcommmentView = false
  }

  getComments(comment) {
    if (comment) {
      return comment
    } return 'NA'
  }

  saveEditCommentPopup(index) {
    this.editCommnetIndex = -1
    this.editcommmentView = false;
    if (this.flagC == "ADD") {
      if (this.contactleadservice.attachmentList[index].MapGuid === "") {
        // this.contactleadservice.attachmentList[index].Comments.push({ "Description": "" })
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
      } else {
        // this.contactleadservice.attachmentList[index].Comments.push({ "Description": "", "Id": "" })
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
        this.contactleadservice.attachmentList[index].LinkActionType = 4
        console.log("getter setter", this.contactleadservice.attachmentList)
      }
      return;
    }
    if (this.flagC === "VIEW") {
      if (this.contactleadservice.attachmentList[index].LinkActionType === 1) {
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
        return;
      }
      if (this.contactleadservice.attachmentList[index].LinkActionType === 2 && this.contactleadservice.attachmentList[index].Comments[0].Id !== '') {
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
        this.contactleadservice.attachmentList[index].LinkActionType = 4
        return;
      }
      if (this.contactleadservice.attachmentList[index].LinkActionType === 2 && this.contactleadservice.attachmentList[index].Comments[0].Id === '') {
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
        this.contactleadservice.attachmentList[index].LinkActionType = 4
        return;
      }
      if (this.contactleadservice.attachmentList[index].LinkActionType === 4) {
        this.contactleadservice.attachmentList[index].Comments[0].Description = this.LeadDetailsEditForm.value.comments
      }
      return;
    }
  }

  decideShowHistoryBtn(res: any) {
    this.showHistorybtn = this.isLeadFromArchivedList(res)
  }

  CompareRemoveSelected(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  // Enable deal value if status is only Unqualified!
  decidedisableDealValue(res) {
    if (res) {
      if (res.Status) {
        if (res.Status.status) {
          if (res.Status.status == "Qualified" || res.Status.status == "Disqualified") {
            this.disabledealvalue = true
            this.disablecurrency = true
          } else {
            this.disabledealvalue = false
            this.disablecurrency = false
          }
        }
      }
    }
  }

  ArchiveRemarks(data): boolean {
    if (data.Status) {
      if (data.Status.Id != undefined) {
        if ((data.Status.Id != IdentifyLeadstype.unqualified) && (data.Status.Id != IdentifyLeadstype.qualified)) {
          return true
        }
      } else {
        return false
      }
    }
  }

  setTheDetails(data) {
    if (data) {
      this.editLeadDetails = data
      this.leadGuid = this.editLeadDetails.LeadGuid
      this.patchLeadDetails(this.filterGroupid(this.editLeadDetails))
    }
  }

  /**
   * filtering coz, api response missmatch the Guid,Sysguid from Dropdown value becarefull.
   * @param data -filtering all the links
   */
  filterGroupid(data) {
    if (data.LinkActivityGroupLead) {
      (data.LinkActivityGroupLead.length > 0)
      data.LinkActivityGroupLead = data.LinkActivityGroupLead.map(x => {
        return x = { ...x, Guid: (x.SysGuid != undefined) ? x.SysGuid : x.Guid }
      });
    }

    if (data.OpportunitiesOrOrders) {
      (data.OpportunitiesOrOrders.length > 0)
      data.OpportunitiesOrOrders = data.OpportunitiesOrOrders.map(x => {
        return x = { ...x, Guid: x.SysGuid, Title: x.Name }
      });
    }

    if (!this.isEmpty(data.Agp)) {
      data.Agp = [{ Name: data.Agp.Name, Guid: data.Agp.Guid, SysGuid: data.Agp.Guid }]
    }

    if (data.CustomerContacts) {
      (data.CustomerContacts.length > 0)
      data.CustomerContacts = data.CustomerContacts.map(x => {
        return x = { ...x, SysGuid: x.Guid }
      })
    }
    return data
  }

  get f() {
    return this.LeadDetailsEditForm.controls;
  }

  InitializeDetailsForm() {
    this.LeadDetailsEditForm = this.leadFormBuilder.group({
      leadName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      leadSource: ['', Validators.required],
      allianceAccount: [''],
      advisorAccount: [''],
      accountOrCompanyName: ['', Validators.required],
      accountOrProspect: new FormControl({ value: 'accountOrProspect', disabled: true }, Validators.required),
      vertical: ['', { disabled: this.disableVertical }],
      sbu: [''],
      wiproSolutions: [''],
      serviceLineToggle: [false],
      WiproSolutionToggle: [false],
      dateCreated: [''],
      enquiryType: [''],
      country: [''],
      enquerydescription: [''],
      linkedActivityGroup: [''],
      linkedopportunity: [''],
      linkedcampaign: [''],
      linkAgp: [''],
      dealValue: ['', Validators.required],
      currency: ['', Validators.required],
      timeline: [''],
      leadOriginator: new FormControl({ value:'', disabled: true }),
      customerContact: [''],
      leadowner: new FormControl({ value: '', disabled: true }),
      wiproContact: [''],
      comments: ['']
    });
    this.InitialServiceCall();
  }

  leadNameChanges : string = "";
  leadInputChange(event) {
    this.leadNameChanges = event.target.value;
  }

  // added autocommas to Estimated deal value
  dealValuewithComma(val){
    if(val != ''){
    var x = val.split('.')
    var diffentiateComma = x[0].replace(/\D/g,"")
    if(diffentiateComma.length > 10){
      this.LeadDetailsEditForm.get('dealValue').setErrors({"dealValueInvalid" : true}) 
    }
    else{
      var b = Number(diffentiateComma).toLocaleString('en-US') 
      var b = Number(diffentiateComma).toLocaleString('en-US')
      if(x[1]){
      var diffentiateDot = x[1].replace(/\D/g,"")
        this.LeadDetailsEditForm.patchValue({
          dealValue:`${b}.${x[1]}`
        })
        } else {
          this.LeadDetailsEditForm.patchValue({
            dealValue:`${b}.00`
          })
        }
      }
    }else{
      this.LeadDetailsEditForm.patchValue({
        dealValue:''
      })
    }
  }

  removeCommas(number){
    number = number.replace(/[.,\s]/g, '');
    number = number.substring(0, number.length - 2)
      this.LeadDetailsEditForm.patchValue({
        dealValue: number
      })
  }

  GetLeadDetails(id, userID) {
    this.contactleadservice.getLeadDetails(id, userID).subscribe(data => {
      console.log('detailsPage', data)
      if (!data.IsError) {
        this.masterApi.getEnquiryType().subscribe(res => {
          if (res.IsError === false) {
            this.isLoading = false;
            this.enquiryType = res.ResponseObject;
            // this.offlineService.addMasterApiCache(routes.enquirytype, res)
            const ImmutabelObj = { ...data.ResponseObject, id: data.ResponseObject.LeadGuid, isHistory: false, enquirydata: this.enquiryType }
            this.store.dispatch(new LoadLeadDetails({ details: ImmutabelObj }))
          } else {
            this.errPopup.throwError(res.Message)
          }
        },
          error => {
            this.isLoading = false;
          })
      } else {
        this.isLoading = false;
        this.errPopup.throwError(data.Message)
      }
    }, error => {
      this.isLoading = false;
    })
  }

  patchLeadDetails(data) {
    if (data.enquirydata) {
      if (data.enquirydata.length > 0) {
        this.enquiryId = data.EnquiryType.Id
        this.enquiryType = data.enquirydata
        let enquiryLable = data.enquirydata.filter(x => x.Id == this.enquiryId)
        if (enquiryLable.length > 0) {
          this.enquiryTypeAria = enquiryLable[0].Value
        }
      }
    }
    console.log('decodeURIComponent', decodeURIComponent(data.Account.Name))
    // var accName = decodeURIComponent(data.Account.Name)
    this.leadNameChanges = data.Title;
    this.LeadDetailsEditForm.patchValue({
      leadName: data.Title,
      leadSource: data.wipro_LeadSource ? data.wipro_LeadSource.Name : "",
      accountOrCompanyName: this.DecodeAccount(data.Account),
      allianceAccount: data.AllianceAccountName ? data.AllianceAccountName : "",
      advisorAccount: data.AdvisoryAccountName ? data.AdvisoryAccountName : "",
      sbu: data.SBU ? data.SBU.Name : "",
      vertical: data.Vertical ? data.Vertical.Name : "",
      serviceLineToggle: data.isServiceLineInvolved,
      WiproSolutionToggle: data.isSolutionInvolved,
      country: data.Country ? data.Country.Name : '',
      dateCreated: data.CreatedOn ? data.CreatedOn : "",
      wiproSolutions: "",
      linkLeadactivity: "",
      linkedcampaign: "",
      linkOpportunity: "",
      linkAgp: "",
      enquiryType: data.EnquiryType ? data.EnquiryType.Id : "",
      enquerydescription: data.EnquiryDesc ? decodeURIComponent(data.EnquiryDesc): "",
      dealValue: data.DealValue ? this.formatter.format(data.DealValue) : ".00",
      currency: data.Currency ? data.Currency.Desc : "",
      estimatedRateValue: "",
      timeline: data.EstimatedCloseDate ? data.EstimatedCloseDate : "",
      leadOriginator : data.Originator,
      leadowner: data.Owner ? data.Owner.FullName : "",
      customerContact: "",
    })
    this.StartDate = new Date(data.EstimatedCloseDate)
    var month = (this.StartDate.getMonth() + 6);
    var date = this.StartDate.getDate();
    var year = this.StartDate.getFullYear();
    this.sixMonthDate = new Date(year, month, date)

    if (data.wipro_LeadSource) {
      this.appendleadSourceName(data.wipro_LeadSource.Name, data.wipro_LeadSource, 0)
    }
    if (data.Account) {
      this.appendAccountName(data.Account.Name, data.Account, false, true)// sbuvertical flag will be false because no need to auto populate sbu and vertical in edit mode,since it was already selected while creating lead..
    }
    if (data.SBU) {
      this.appendsbuName(data.SBU.Name, data.SBU, 0)
    }
    if (data.Vertical) {
      this.appendVertical(data.Vertical.Name, data.Vertical, 0)
    }
    if (data.AllianceAccountName) {
      this.appendalliance(data.AllianceAccountName, { Name: data.AllianceAccountName, Guid: data.AllianceAccountGuid }, 0)
    }
    if (data.AdvisoryAccountName) {
      this.appendadvisor(data.AdvisoryAccountName, {Name:data.AdvisoryAccountName, Guid: data.AdvisorAccountGuid}, 0)
    }
    if (!this.isEmpty(data.Country)) {
      this.appendCountry(data.Country.Name, data.Country, 0)
    }
    if (data.ServiceLine.length > 0) {
      this.createTableNewRow(data.ServiceLine)
    } else {
      if (this.ServiceTable.length == 0) {
        this.createTableNewRow()
      }
    }
    if (data.Owner) {
      this.appendLeadOwner(data.Owner.FullName, data.Owner, 0)
    }
    if (data.Agp) {
      if (data.Agp.length > 0) {
        this.appendAgp(data.Agp[0].Name, data.Agp[0], 0)
      }
    }
    this.wiprosolutionevent()
    this.servicelinesevent()
    if (data.Solutions) {
      data.Solutions.forEach(x => {
        this.appendWiproSolutions(x.Name, x, false, 0)
      })
    }
    if (!this.isEmpty(data.Currency)) {
      this.appendCurrency(data.Currency.Desc, data.Currency, 0)
    }
    this.CreateFinalGroups(data)
    this.LoadLeadDetailsToDom()
  }

  CreateFinalGroups(data) {
    if (data.Switch) {
      this.ExistingActivityData = (data.ExistingActivityData) ? data.ExistingActivityData : []
      this.ExistingCampaignData = (data.ExistingCampaignData) ? data.ExistingCampaignData : []
      this.ExistingOpportunityData = (data.ExistingOpportunityData) ? data.ExistingOpportunityData : []
      this.ExistingContactData = (data.ExistingContactData) ? data.ExistingContactData : []
      this.ExistingWiproSolutionData = (data.ExistingWiproSolutionData) ? data.ExistingWiproSolutionData : []
      this.finalCampaignGroup = (this.finalCampaignGroup) ? data.finalCampaignGroup : []
      this.finalActivityGroup = (this.finalActivityGroup) ? data.finalActivityGroup : []
      this.finalOppotunityGroup = (this.finalOppotunityGroup) ? data.finalOppotunityGroup: [],
      this.finalAgpGroup = (this.finalAgpGroup) ? this.finalAgpGroup : []
      this.finalContactGroup = (this.finalContactGroup) ? data.finalContactGroup : []
    } else {
      this.ExistingActivityData = (data.LinkActivityGroupLead) ? data.LinkActivityGroupLead : []
      this.ExistingCampaignData = (data.Campaign) ? data.Campaign : []
      this.ExistingOpportunityData = (data.OpportunitiesOrOrders) ? data.OpportunitiesOrOrders : []
      this.ExistingContactData = (data.CustomerContacts) ? data.CustomerContacts : []
      this.ExistingWiproSolutionData = (data.Solutions) ? data.Solutions : []
      // this.ExistingAttachmentList = (data.Attachments)?(data.Attachments.length>0)?data.Attachments:[]:[]
    }
    if (data.LinkActivityGroupLead) {
      data.LinkActivityGroupLead.forEach(x => {
        this.appendActivityGroup(x.Name, x, false, 0)
      })
    }
    if (data.Campaign) {
      data.Campaign.forEach(x => {
        this.appendCampaign(x.Name, x, false, 0)
      })
    }
    if (data.OpportunitiesOrOrders) {
      data.OpportunitiesOrOrders.forEach(x => {
        this.appendOpportunity(x.Name, x, false, 0)
      })
    }
    if (data.CustomerContacts) {
      data.CustomerContacts.forEach(x => {
        this.appendCustomerContact(x.FullName, x, false, 0)
      })
    }
  }

  DecodeAccount(data){
    if(data.account){
      if(data.account.Name){
        return decodeURIComponent(data.account.Name)
      }else{
        return ""
      }
    }
  }

  //service call
  OnChange() {
    this.isLoading = true;
    this.getCurrencyType()
  }

  getCurrencyType() {
    this.masterApi.getCurrency().subscribe(res => {
      if (!res.IsError) {
        this.currency = res.ResponseObject;
        this.offlineService.addMasterApiCache(routes.getCurrency, res)
      } else {
        this.errPopup.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    });
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

  // end service call
  wiprosolutionevent() {
    if (this.LeadDetailsEditForm.controls.WiproSolutionToggle.value == true) {
      this.iswiprosolution = true;
      (this.selectedWiproSolution.length > 0) ? this.removeValidatorsWiproSolution() : this.setValidatorsWiproSolution()
    } else if (this.LeadDetailsEditForm.controls.WiproSolutionToggle.value == false) {
      this.iswiprosolution = false
      this.selectedWiproSolution=this.selectedWiproSolution.filter(x => x.SysGuid != "").map(x=>{       
        x.LinkActionType= 3;
        return x;
    });
      this.removeValidatorsWiproSolution()
    }
    this.LoadLeadDetailsToDom()
  }

  servicelinesevent() {
    if (this.LeadDetailsEditForm.controls.serviceLineToggle.value == true) {
      this.MakeServiceLineLablesMandatory()
      this.isServicelines = true
      if(!this.ServiceTable.some(x=>x.isDeleted==false))
      {
        this.createTableNewRow();
      }
      // this.createTableNewRow()
    } else if (this.LeadDetailsEditForm.controls.serviceLineToggle.value == false) {
      this.MakeServiceLineLablesNonMandatory()
      this.isServicelines = false
      this.ServiceTable=this.ServiceTable.filter(x => x.apiId != "0").map(x=>{       
          x.isDeleted=true;
          x.LinkActionType= 3;
          return x;
      });
    }
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

  //serviceline
  pushToTableData(resp) {
    if(sessionStorage.getItem('TempEditLeadDetails')){
      this.ServiceTable.push(resp)
    }else{
      this.ServiceTable.push({
        id: resp.MapGuid,
        apiId: resp.MapGuid,
        MapGuid: resp.MapGuid,
        '@serviceLines': false,
        '@practice': false,
        '@slbdm': false,
        serviceLines: {
          Name: resp.Name ? resp.Name : '',
          Guid: resp.Guid,
          IsError: false
        }, practice: {
          Name: resp.practice.Name ? resp.practice.Name : '',
          practiceGuid: resp.practice.practiceGuid,
          IsError: false
        },
        slbdm: {
          Name: resp.SLBDM.Name ? resp.SLBDM.Name : '',
          bdmidGuid: resp.SLBDM.bdmidGuid,
          serviceLineBDMid: resp.Guid,
          IsError: false
        },
        isDeleted: false,
        LinkActionType: 2
      })
    }
  }

  createTableNewRow(tableData?) {
    if (tableData) {
      tableData.forEach(resp => {
        var checkDuplicate = this.ServiceTable.length > 0 ? false : true;
        if (checkDuplicate) {
          this.pushToTableData(resp)
        }
        else {
          var datajCheck = this.ServiceTable.filter(x => x.id == resp.MapGuid);
          if (datajCheck.length == 0) {
            this.pushToTableData(resp)
          }
        }
      });
    } else {
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
          IsError: false
        }, practice: {
          Name: "",
          practiceGuid: "",
          IsError: false
        },
        slbdm: {
          Name: "",
          bdmidGuid: "",
          serviceLineBDMid: "",
          IsError: false
        },
        isDeleted: false,
        LinkActionType: 1
      })
    }
  }

  onKeyUp(formData, colData, searchitem, i) {
    colData.serviceData = []
    switch (colData.name) {
      case 'serviceLines':
        // console.log(event.key);
        // if (event.key !== "Backspace") {
        //   this.searchitem = this.searchitem + event.key
        // }
        // else {
        //   this.searchitem = this.searchitem.slice(0, -1)
        // }
      //  if (this.searchitem.length > 0) {
          this.isServicelineLoader = true
          colData.serviceData = []
          var ServicelineReqBody = {
            "SearchText": searchitem,
            "Account": {
              "SysGuid": this.AccountId,
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
        return

      case 'practice':
        // if (event.key !== "Backspace") {
        //   this.searchPractice = this.searchPractice + event.key
        // }
        // else {
        //   this.searchPractice = this.searchPractice.slice(0, -1)
        // }
        if (formData.serviceLines.Guid != '') {
          this.isServicelineLoader = true
          colData.serviceData = []
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
          colData.closePopUp = false
          formData.serviceLines.IsError = true;
        }
        return

      case 'slbdm':
        // if (event.key !== "Backspace") {
        //   this.searchSlbdm = this.searchSlbdm + event.key
        // }
        // else {
        //   this.searchSlbdm = this.searchSlbdm.slice(0, -1)
        // }
        if (formData.serviceLines.Guid != '') {
          this.isServicelineLoader = true
          colData.serviceData = []
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
          colData.closePopUp = false
          formData.serviceLines.IsError = true;
        }
        return
    }
  }

  // ---------------------------------------------------------------------- APPEND ------------------------------------------------------------------------
  appendleadSourceName(value: string, item, i) {
    this.leadSourceSelected = item
    this.leadSourceId = item.SysGuid;
    this.leadSrcName = item.Name;
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
    this.leadSourceId = item.SysGuid;
    this.selectedLeadSource.push(item)
    this.leadSourceSwitch = false;
    this.leadSourceName = value;
    this.LeadDetailsEditForm.patchValue({
      leadSource: value
    })
    this.LoadLeadDetailsToDom()
  }

  appendalliance(value: string, item, i) {
    this.AllianceData = item
    this.sendAllianceToAdvance.push({ ...item, Id: item.Guid })
    this.AllianceAccountguid = item.Guid;
    this.AllianceName = item.Name;
    this.LeadDetailsEditForm.patchValue({
      allianceAccount: value
    })
    //  this.AdvisorAccountguid = ""
  }

  appendadvisor(value: string, item, i) {
    this.AdvisorData = item
    this.sendAdvisorToAdvance.push({ ...item, Id: item.Guid })
    this.AdvisorAccountguid = item.Guid;
    this.AdvisorName = item.Name;
    this.LeadDetailsEditForm.patchValue({
      advisorAccount: value
    })
    // this.AllianceAccountguid = ""
  }

  appendsbuName(value: string, item, i) {
    this.sbuId = item.Id;
    this.sbuName = value;
    // let verticalSearchreqBody = {
    //   SearchText: "",
    //   Guid: this.AccountId,
    //   SBUGuid: this.sbuId,
    //   isProspect: this.isProspect,
    //   PageSize: 10,
    //   OdatanextLink: "",
    //   RequestedPageNumber: 1
    // }
    // this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
    //   if (!res.IsError) {
    //     if (res.ResponseObject.length > 0) {
    //       this.appendVertical(res.ResponseObject[0].Name, res.ResponseObject[0], 0)
    //       this.disableVertical = true
    //     }
    //   }
    // })
    this.LeadDetailsEditForm.patchValue({ sbu: value })
    this.sbuSwitch = false;
    this.isVertical = false;
    this.SBUclose()
    this.LoadLeadDetailsToDom()
  }

  appendVertical(value: string, item, i) {
    if (this.LeadDetailsEditForm.value.sbu != '') {
      this.VerticalSelected = item
      this.verticalId = item.Id
      this.LeadDetailsEditForm.patchValue({ vertical: value })
      this.verticalName = value;
      this.ConversationNameSwitchvertical = true;
    } else {
      this.ResetValidatorsVerticalInput()
    }
  }

  /**
   * 
   * @param value - value(name) which was selected
   * @param item  - full item which was clicked
   * @param sbuverticalFlag - To auto bind the sbu and vertical value based on accid
   * @param AccLinkedFlag - To clear the linked data(link activity,campaign,opp,contacts) if account is changed
   */
  appendAccountName(value: string, item, sbuverticalFlag, AccLinkedFlag) {
    this.AccName = decodeURIComponent(item.Name)
    this.AccountCompanyName = decodeURIComponent(value);
    this.accntCompany = '';
    this.AccountSelected = item
    this.sendAccountToAdvance.push({ ...item, Id: item.SysGuid })
    this.AccountId = item.SysGuid ? item.SysGuid : this.leadDetails.Account.SysGuid
    if (AccLinkedFlag) {
      if (this.AccountId != '' || this.AccountId != null || this.AccountId != undefined) {
        this.delinkAccountChanges()
      }
    }
    var name = ""
    if (item.isProspect === true) {
      name = "Prospect"
      this.wiproProspectAccount = item.SysGuid;
      this.customerAccount = ''
      this.isProspect = item.SysGuid ? true : this.leadDetails.Account.isProspect
    }
    if (item.isProspect !== true) {
      name = "Account"
      this.customerAccount = item.SysGuid;
      this.wiproProspectAccount = ''
      this.isProspect = item.SysGuid ? false : this.leadDetails.Account.isProspect
    }
    this.LeadDetailsEditForm.patchValue({
      accountOrCompanyName: value
    })
    this.LeadDetailsEditForm.patchValue({ accountOrProspect: name })
    this.LeadDetailsEditForm.patchValue({ accountOrCompanyName: value })
    // auto populate SBU & Vertical from ACC ID if flag is true
    // let SbuReqParam = {
    //   Guid: this.AccountId,
    //   isProspect: this.isProspect
    // }

    // this.myOpenLeadService.GetSbuAccountdata(SbuReqParam).subscribe(res => {
    //   if (!res.IsError) {
    //     if (res.ResponseObject.length > 0) {
    //       this.appendsbuName(res.ResponseObject[0].Name, res.ResponseObject[0], 0)
    //       this.disableSbu = true
    //       this.disableVertical = true
    //     } else {
    //       this.resetSbuVerAccount()
    //     }
    //   } else {
    //     this.errPopup.throwError(res.Message)
    //     this.resetSbuVerAccount()
    //   }
    // }, error => {
    //   this.resetSbuVerAccount()
    // })
  }

  resetSbuVerAccount() {
    this.LeadDetailsEditForm.controls.sbu.reset()
    this.ResetValidatorsVerticalInput()
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
  }

  appendCountry(value: string, item, i) {
    this.selectedCountry = item
    this.countryId = item.SysGuid
    this.countryName = item.Name
    this.CountryDetails = {
      SysGuid: this.countryId,
      LinkActionType: 2
    }
    this.LeadDetailsEditForm.patchValue({
      country: value
    })
    this.countrySwitch = false
  }

  appendservicelineauto(item, i, hederData, rowData) {
    if ( rowData[hederData.name].Name != item.Name) {
      if (this.ServiceTable.filter(x=>x.isDeleted == false).filter(x => x.slbdm["bdmidGuid"] == item.bdmidGuid && x.practice["practiceGuid"]==rowData.practice["practiceGuid"]&& x.serviceLines["Guid"]== rowData.serviceLines["Guid"]).length != 0){
        let val;
        let Message = "The identified combination is already available";
        this.matSnackBar.open(Message, val, {
          duration: 3000
        })
        rowData[hederData.name] = {
          Name: "",
          bdmidGuid: "",
          serviceLineBDMid: "",
          IsError: false
        }
      }
      else {
        rowData[hederData.name] = item;
        if (hederData.IsRelation) {
          rowData[hederData.IsRelation[0]] = {
            Name: "",
            practiceGuid: "",
            IsError: false
          },
          rowData[hederData.IsRelation[1]] = {
              Name: "",
              bdmidGuid: "",
              serviceLineBDMid: "",
              IsError: false
            }
        }
      }
    }
  }

  appendActivityGroup(value: string, item, checkDuplicateItem, i) {
    this.activityGroupName = value;
    this.conversationId = item.Guid;
    const result = this.myOpenLeadService.genarateLinkActionType(item, this.ExistingActivityData, this.finalActivityGroup, "LinkActionType", "Guid")
    item = result.item,
      this.finalActivityGroup = result.data
    if (checkDuplicateItem && this.selectedActivityGroup.some(x => x.Guid == item.Guid)) {
      this.throwDuplicationError(LeadCustomErrorMessages.ActivityDuplicateError)
    }
    this.selectedActivityGroup.push(item)
    this.sendActivityToAdvance.push({ ...item, Id: item.Guid })
    this.selectedActivityGroup = this.service.removeDuplicates(this.selectedActivityGroup, "Guid");
    this.LeadDetailsEditForm.patchValue({
      linkedActivityGroup: ""
    })
    this.activityGroupSwitch = false;
  }

  appendWiproSolutions(value: string, item, checkDuplicateItem, i) {
    if (value) {
      this.wiproSolutionName = value;
      this.LeadDetailsEditForm.patchValue({
        wiproSolutions: ""
      })
      const result = this.myOpenLeadService.genarateLinkActionType(item, this.ExistingWiproSolutionData, this.finalWiproSolutionGroup, "LinkActionType", "SysGuid")
      item = result.item,
        this.finalWiproSolutionGroup = result.data
      if (checkDuplicateItem && this.selectedWiproSolution.some(x => x.SysGuid == item.SysGuid)) {
        this.throwDuplicationError(LeadCustomErrorMessages.WiproSolutionDuplicateError)
      }
      this.selectedWiproSolution.push(item)
      this.sendWiproSolutionToAdvance.push({ ...item, Id: item.SysGuid })
      this.activityGroupSwitch = false
      this.selectedWiproSolution = this.service.removeDuplicates(this.selectedWiproSolution, "SysGuid");
      if (this.selectedWiproSolution.length > 0) {
        this.removeValidatorsWiproSolution()
      }
      this.wiproSolutionSwitch = false
    }
  }

  appendCampaign(value: string, item, checkDuplicateItem, i) {
    this.campaignId = item.Id;
    this.campaignName = value;
    const result = this.myOpenLeadService.genarateLinkActionType(item, this.ExistingCampaignData, this.finalCampaignGroup, "LinkActionType", "Id")
    item = result.item,
    this.finalCampaignGroup = result.data
    if (checkDuplicateItem && this.selectedCampaign.some(x => x.Id == item.Id)) {
      this.throwDuplicationError(LeadCustomErrorMessages.CampaignDuplicateError)
    }
    this.selectedCampaign.push(item)
    this.campignSwitch = false
    this.selectedCampaign = this.service.removeDuplicates(this.selectedCampaign, "Id");
    this.LeadDetailsEditForm.patchValue({
      linkedcampaign: ""
    })
    if (this.selectedCampaign.length > 0) {
      this.LeadDetailsEditForm.controls['linkedcampaign'].clearValidators()
      this.LeadDetailsEditForm.controls['linkedcampaign'].reset()
      this.LeadDetailsEditForm.updateValueAndValidity()
    }
  }

  appendOpportunity(value: string, item, checkDuplicateItem, i) {
    this.oppName = value;
    let json = { Guid: item.Guid, MapGuid: (item.MapGuid) ? item.MapGuid : '', Title: item.Title, Type: item.Type, LinkActionType: 1 }
    let json1 = { Guid: item.Guid, MapGuid: (item.MapGuid) ? item.MapGuid : '', Title: item.Title, Type: item.Type, LinkActionType: 1, Id: item.Guid }
    this.LeadDetailsEditForm.patchValue({ linkOpportunity: value })
    const result = this.myOpenLeadService.genarateLinkActionType(json, this.ExistingOpportunityData, this.finalOppotunityGroup, "LinkActionType",  "Guid")
    item = result.item,
      this.finalOppotunityGroup = result.data
    if (checkDuplicateItem && this.selectedOpportunity.some(x => x.Guid == json.Guid)) {
      this.throwDuplicationError(LeadCustomErrorMessages.OpportunityDuplicateError)
    }
    this.selectedOpportunity.push(json);
    this.sendOppToAdvance.push(json1)
    this.selectedOpportunity = this.service.removeDuplicates(this.selectedOpportunity, "Guid");
    this.showOpprtunityDropdown = false
    this.LeadDetailsEditForm.controls.linkedopportunity.reset();
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  appendAgp(value: string, item, i) {
    if (value) {
      this.linkagpGuid = item.SysGuid;
      this.agpName = value;
      if (this.ExistingAgpData.some(x => x.SysGuid == item.SysGuid)) {
        item = { ...item, LinkActionType: 2 }
        this.finalAgpGroup = []
        this.finalAgpGroup.push({ ...item, LinkActionType: 2 })
      } else if (!this.ExistingAgpData.some(x => x.SysGuid == item.SysGuid)) {
        item = { ...item, LinkActionType: 4 }
        this.finalAgpGroup = []
        this.finalAgpGroup.push({ ...item, LinkActionType: 4 })
      }
      this.selectedAgp = []
      this.selectedAgp.push(item)
      this.LeadDetailsEditForm.patchValue({
        linkAgp: ""
      })
      this.agpNameSwitch = false
      this.LeadDetailsEditForm.controls.linkAgp.reset();
      this.LeadDetailsEditForm.updateValueAndValidity()
    }
  }

  appendLeadOwner(value: string, item, i) {
    this.leadOwnerName = value
    this.leadOwnerId = item.ownerId;
    this.ownerName = value;
    this.selectedOwner = [{ FullName: item.FullName, ownerId: item.ownerId }];
    this.sendOwnerToAdvance.push({ ...item, Id: item.ownerId })
    this.selectedOwner = this.service.removeDuplicates(this.selectedOwner, "ownerId");
    this.leadOwnerswitch = false
    // if (this.selectedOwner.length > 0) {
    //   this.LeadDetailsEditForm.controls.leadowner.clearValidators();
    //   this.LeadDetailsEditForm.controls.leadowner.reset();
    //   this.LeadDetailsEditForm.controls.leadowner.updateValueAndValidity();
    // }
  }

  appendCurrency(value, item, i) {
    this.selctedCurrency = item
    this.currencyId = item.Id
    this.currencyName = this.getSymbol(item.Desc)
    this.LeadDetailsEditForm.patchValue({
      currency: this.currencyName
    })
    this.currencySwitch = false
  }

  appendCustomerContact(value: string, item, checkDuplicateItem, i) {
    let json = { FullName: item.FullName, LinkActionType: 1, Designation: (item.Designation) ? item.Designation : "", isKeyContact: (item.isKeyContact) ? (item.isKeyContact) : false, MapGuid: (item.MapGuid) ? item.MapGuid : '', Guid: item.Guid, SysGuid: item.Guid, Id: item.Guid, Email: item.Email };
    //let json1 = { FullName: item.FullName, LinkActionType: 1, Designation: (item.Designation) ? item.Designation : "", isKeyContact: (item.isKeyContact) ? (item.isKeyContact) : false, MapGuid: (item.MapGuid) ? item.MapGuid : '', Guid: item.Guid, SysGuid: item.Guid, Id: item.Guid};
    const result = this.myOpenLeadService.genarateLinkActionType(item, this.ExistingContactData, this.finalContactGroup, "LinkActionType", "SysGuid")
    item = result.item,
      this.finalContactGroup = result.data
    if (checkDuplicateItem && this.selectedCustomerContact.some(x => x.SysGuid == json.SysGuid)) {
      this.throwDuplicationError(LeadCustomErrorMessages.ContactDuplicateError)
    }
    this.selectedCustomerContact.push(json);
    this.selectedCustomerContact = this.service.removeDuplicates(this.selectedCustomerContact, "SysGuid");
    this.customerContactSwitch = false
    if (this.selectedCustomerContact.length > 0) {
      this.removeValidatorsForCustomer();
    }
  }

  removeValidatorsForCustomer() {
    this.LeadDetailsEditForm.controls.customerContact.clearValidators();
    this.LeadDetailsEditForm.controls.customerContact.reset();
    this.LeadDetailsEditForm.controls.customerContact.updateValueAndValidity();
  }

  dealValueMandatory() {
    this.LeadDetailsEditForm.controls.dealValue.setValidators([Validators.required])
    this.LeadDetailsEditForm.controls.dealValue.markAsTouched()
    this.LeadDetailsEditForm.patchValue({
      currency: ""
    })
  }

  // ------------------------------------------------------------------- SYNC VALIDATORS --------------------------------------------------------------------
  showAllianceAccount() {
    this.RequestAlliance = true
    this.AdvisorsAccount = false;
    // this.AdvisorAccountguid = "";
    this.AdvisorName = "";
    this.LeadDetailsEditForm.controls.allianceAccount.setValidators([Validators.required])
    this.LeadDetailsEditForm.controls.linkedcampaign.clearValidators()
    this.LeadDetailsEditForm.controls.linkedcampaign.reset()
    this.LeadDetailsEditForm.controls.advisorAccount.clearValidators()
    this.LeadDetailsEditForm.controls.advisorAccount.reset(this.LeadDetailsEditForm.controls.advisorAccount.value)
    this.LeadDetailsEditForm.controls.advisorAccount.reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  showAdvisorAccount() {
    this.RequestAlliance = false
    this.AdvisorsAccount = true;
    // this.AllianceAccountguid = "";
    // this.AllianceName = "";
    this.AdvisorName = "";
    this.LeadDetailsEditForm.controls.advisorAccount.setValidators([Validators.required])
    this.LeadDetailsEditForm.controls.linkedcampaign.clearValidators()
    this.LeadDetailsEditForm.controls.allianceAccount.clearValidators()
    this.LeadDetailsEditForm.controls.linkedcampaign.reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  clearAllianceAdvisorValidators() {
    this.RequestAlliance = false
    this.requestCamp = false
    this.AdvisorsAccount = false;
    // this.AdvisorAccountguid = "";
    this.AdvisorName = "";
    this.LeadDetailsEditForm.controls.linkedcampaign.clearValidators()
    this.LeadDetailsEditForm.controls.allianceAccount.clearValidators()
    this.LeadDetailsEditForm.controls.advisorAccount.clearValidators()
    this.LeadDetailsEditForm.controls.advisorAccount.reset()
    this.LeadDetailsEditForm.controls.allianceAccount.reset(this.LeadDetailsEditForm.controls.allianceAccount.value)
    this.LeadDetailsEditForm.controls.advisorAccount.reset(this.LeadDetailsEditForm.controls.advisorAccount.value)
    this.LeadDetailsEditForm.controls.linkedcampaign.reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  makeRequestCampaignValidators() {
    if (this.selectedCampaign.length > 0) {
      this.requestCamp = false
      this.removeValidatorsForCampaign()
    } else {
      this.setValidatorsForCampaign()
      this.requestCamp = true
    }
  }

  removeValidatorsForCampaign() {
    this.LeadDetailsEditForm.controls.linkedcampaign.clearValidators()
    this.LeadDetailsEditForm.controls.linkedcampaign.reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  setValidatorsForCampaign() {
    this.LeadDetailsEditForm.controls.linkedcampaign.setValidators([Validators.required])
    this.LeadDetailsEditForm.patchValue({
      linkedcampaign: ""
    })
    this.LeadDetailsEditForm.updateValueAndValidity()
    this.LoadLeadDetailsToDom()
  }

  setValidatorsForContact(loadtodom) {
    this.LeadDetailsEditForm.controls.customerContact.setValidators([Validators.required])
    this.LeadDetailsEditForm.patchValue({
      customerContact: ""
    })
    this.LeadDetailsEditForm.updateValueAndValidity();
    (loadtodom) ? this.LoadLeadDetailsToDom() : null
  }

  removeValidatorsWiproSolution() {
    this.LeadDetailsEditForm.controls['wiproSolutions'].clearValidators()
    this.LeadDetailsEditForm.controls['wiproSolutions'].reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  setValidatorsWiproSolution() {
    this.LeadDetailsEditForm.controls['wiproSolutions'].setValidators([Validators.required])
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  SetValidatorsVerticalInput() {
    this.LeadDetailsEditForm.controls.vertical.setValidators([Validators.required])
    this.LeadDetailsEditForm.patchValue({
      vertical: null
    })
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  ResetValidatorsVerticalInput() {
    this.disableVertical = true
    this.VerticalSelected = ""
    this.verticalId = null
    this.verticalName = null
    this.LeadDetailsEditForm.controls.vertical.clearValidators()
    this.LeadDetailsEditForm.controls.vertical.reset()
    this.LeadDetailsEditForm.updateValueAndValidity()
  }

  MakeServiceLineLablesNonMandatory() {
    ServiceLineTable[0].title = 'Service line'
    ServiceLineTable[0].isRequired = false
    ServiceLineTable[0].IsRelation = []
    ServiceLineTable[2].title = 'SL BDM'
    ServiceLineTable[2].isRequired = false
  }

  MakeServiceLineLablesMandatory() {
    ServiceLineTable[0].isRequired = true
    ServiceLineTable[0].IsRelation = ["practice", "slbdm"]
    ServiceLineTable[2].isRequired = true
  }

  // -------------------------------------------------------------  DELINK -------------------------------------------------------------------------
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
  }

  delinkAttach(item, i) {
    const dialogRef = this.dialog.open(deleteAttachPopUp1, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.OK === true) {
        if (item.MapGuid !== "") {
          // this.contactLeadService.attachmentList = this.contactLeadService.attachmentList.filter(res => res.MapGuid !== item.MapGuid)
          let index = this.contactLeadService.attachmentList.findIndex(k => k.MapGuid === item.MapGuid)
          this.contactLeadService.attachmentList[i].LinkActionType = 3
        } else {
          this.contactLeadService.attachmentList = this.contactLeadService.attachmentList.filter(res => res.Name !== item.Name)
        }
      }
    })
  }

  delinkActivityGroup(item) {
    if (this.selectedActivityGroup.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingActivityData, this.finalActivityGroup, "Guid")
      item = result.item,
      this.finalActivityGroup = result.data
      this.ExistingActivityData = this.finalActivityGroup
      this.selectedActivityGroup = this.selectedActivityGroup.filter(x => x.Guid != item.Guid)
      this.sendActivityToAdvance = this.sendActivityToAdvance.filter(x => x.Guid != item.Guid)
    }
  }

  delinkCampaign(item) {
    if (this.selectedCampaign.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingCampaignData, this.finalCampaignGroup, "Id")
      item = result.item,
      this.finalCampaignGroup = result.data
      this.ExistingCampaignData = this.finalCampaignGroup
      this.selectedCampaign = this.selectedCampaign.filter(x => x.Id != item.Id)
    }
    if (this.selectedCampaign.length == 0 && this.setCampaignForLeadSource()) {
      this.requestCamp = true
      this.setValidatorsForCampaign()
    }
  }

  setCampaignForLeadSource() {
    if (this.LeadDetailsEditForm.controls.leadSource.value == "Advertisement" ||
      this.LeadDetailsEditForm.controls.leadSource.value == "M&CI - iProfile" ||
      this.LeadDetailsEditForm.controls.leadSource.value == "Events" ||
      this.LeadDetailsEditForm.controls.leadSource.value == "Conference") {
      return true
    } else {
      return false
    }
  }

  delinkOpp(item) {
    if (this.selectedOpportunity.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingOpportunityData, this.finalOppotunityGroup, "Guid")
      item = result.item,
      this.finalOppotunityGroup = result.data
      this.selectedOpportunity = this.selectedOpportunity.filter(x => x.Guid != item.Guid)
      this.sendOppToAdvance = this.sendOppToAdvance.filter(x => x.Guid != item.Guid)
    }
  }

  delinkAgp(item) {
    if (this.selectedAgp.length > 0) {
      this.selectedAgp = this.selectedAgp.filter(x => x.SysGuid != item.SysGuid)
    }
  }

  delinkCustomerContacts(item) {
    if (this.selectedCustomerContact.length > 0) {
      const result = this.myOpenLeadService.generateDelinkLinkActionType(item, this.ExistingContactData, this.finalContactGroup, "SysGuid")
      item = result.item,
      this.finalContactGroup = result.data
      this.selectedCustomerContact = this.selectedCustomerContact.filter(x => x.SysGuid != item.SysGuid)
      if (this.selectedCustomerContact.length == 0) {
        this.setValidatorsForContact(true)
      }
    }
  }

  /**
   * Delinking all the links according to the account selection
   */
  delinkAccountChanges() {
    if (this.AccountId)
      if (this.selectedActivityGroup.length > 0) {
        this.delinkActivityGroupbyAccountChanges()
      }
    if (this.selectedCampaign.length > 0) {
      this.delinkCampaignbyAccountChanges()
    }
    if (this.selectedOpportunity.length > 0) {
      this.delinkOpportunitybyAccountChanges()
    }
    if (this.selectedCustomerContact.length > 0) {
      this.delinkCustomerContactbyAccountChanges()
    }
  }

  delinkActivityGroupbyAccountChanges() {
    this.finalActivityGroup = this.finalActivityGroup.filter(res => res.LinkActionType !== 1)
    this.finalActivityGroup = this.ChangeExistingToDelete(this.finalActivityGroup)
    this.selectedActivityGroup = []
  }

  delinkOpportunitybyAccountChanges() {
    this.finalOppotunityGroup = this.finalOppotunityGroup.filter(res => res.LinkActionType !== 1)
    this.finalOppotunityGroup = this.ChangeExistingToDelete(this.finalOppotunityGroup)
    this.selectedOpportunity = []
  }

  delinkCampaignbyAccountChanges() {
    this.finalCampaignGroup = this.finalCampaignGroup.filter(res => res.LinkActionType !== 1)
    this.finalCampaignGroup = this.ChangeExistingToDelete(this.finalCampaignGroup)
    this.selectedCampaign = []
  }

  delinkCustomerContactbyAccountChanges() {
    this.finalContactGroup = this.finalContactGroup.filter(res => res.LinkActionType !== 1)
    this.finalContactGroup = this.ChangeExistingToDelete(this.finalContactGroup)
    this.selectedCustomerContact = []
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

  // ---------------------------------------------------------------------CLOSE FUNCTION-------------------------------------------------------------

  servicelineautoleadclose() {
    this.servicelineautoSwitch = false;
  }

  leadSourceClose() {
    this.leadSourceSwitch = false;
    if (this.leadSrcName == "") {
      this.LeadDetailsEditForm.patchValue({
        leadSource: ""
      })
    }

    if (this.leadSrcName !== "") {
      this.LeadDetailsEditForm.patchValue({
        leadSource: this.leadSrcName
      })
    }
  }

  Leadadvisorclose() {
    this.AdvisorAccountSwitch = false;
    if (this.AdvisorName == "") {
      this.LeadDetailsEditForm.patchValue({
        advisorAccount: ""
      })
    }
  }

  Leadallianceclose() {
    this.allianceAccountSwitch = false;
    if (this.AllianceName == "") {
      this.LeadDetailsEditForm.patchValue({
        allianceAccount: ""
      })
    }

    if (this.AllianceName != "") {
      this.LeadDetailsEditForm.patchValue({
        allianceAccount: this.AllianceName
      })
    }
  }

  countryclose() {
    this.countrySwitch = false
    if (this.countryName == "") {
      this.LeadDetailsEditForm.patchValue({
        country: ""
      })
    }

    if (this.countryName != "") {
      this.LeadDetailsEditForm.patchValue({
        country: this.countryName
      })
    }
  }

  Leadverticalclose() {
    this.ConversationNameSwitchvertical = false;
  }

  SBUclose() {
    this.sbuSwitch = false;
    if (this.sbuName == "") {
      this.LeadDetailsEditForm.patchValue({
        sbu: ""
      })
    }

    if (this.sbuName != "") {
      this.LeadDetailsEditForm.patchValue({
        sbu: this.sbuName
      })
    }
  }

  AccountCompanyNameClose() {
    this.AccountshowCompany = false;
    if (this.AccName === "") {
      this.leadDetailsForm.patchValue({
        accountOrCompanyName: ""
      })
    }
    if (this.AccName !== "") {
      this.LeadDetailsEditForm.patchValue({
        accountOrCompanyName: this.AccName
      })
    }
  }

  wiproSolutionClose() {
    this.wiproSolutionSwitch = false;
    this.LeadDetailsEditForm.patchValue({
      wiproSolutions: ''
    })
  }
  ServiceLineNameClose() {
    this.serviceLineShowName = false;

  }
  activityGroupClose() {
    this.activityGroupSwitch = false;
    this.LeadDetailsEditForm.patchValue({
      linkedActivityGroup: ''
    })

  }

  campaignClose() {
    this.campignSwitch = false;
    this.LeadDetailsEditForm.patchValue({
      linkedcampaign: ''
    })
  }

  opportunityClose() {
    this.showOpprtunityDropdown = false;
    this.LeadDetailsEditForm.patchValue({
      linkedOpportunity: ''
    })
  }

  agpClose() {
    this.agpNameSwitch = false;
    this.LeadDetailsEditForm.patchValue({
      linkAgp: ''
    })
  }

  currencyclose() {
    this.currencySwitch = false;
  }

  leadOwnerClose() {
    this.leadOwnerswitch = false;
  }

  customerContactClose() {
    this.customerContactSwitch = false;
    this.LeadDetailsEditForm.patchValue({
      customerContact: ''
    })
  }

  //------------------------------------------------CLEAR FUNCTIONS START---------------------------------------------------------------------//
  clearCuurencyName() {
    this.LeadDetailsEditForm.patchValue({
      currency: ""
    });
    this.currencyId = '';
    this.currencyName = ''
  }

  clearCountry() {
    this.LeadDetailsEditForm.patchValue({
      country: ""
    });
    this.countryName = "";
    this.CountryDetails = {
      SysGuid: this.countryId,
      LinkActionType: 3
    }
  }

  clearLeadSource(value) {
    this.LeadDetailsEditForm.patchValue({
      leadSource: ""
    });
    this.leadSrcName = "";
    this.leadSourceId = "";
    this.leadSourceClearDependencyFunctions(value)
  }

  leadSourceClearDependencyFunctions(value) {
    if (value === "Advisors ( Influencers )" || value === "Analysts") {
      this.AdvisorsAccount = false;
      // this.AdvisorAccountguid = "";
      this.AdvisorName = "";
      this.LeadDetailsEditForm.controls.advisorAccount.clearValidators()
      this.LeadDetailsEditForm.controls.advisorAccount.reset()
    } else if (value === "Alliance/Partner") {
      this.LeadDetailsEditForm.controls.allianceAccount.clearValidators()
      this.LeadDetailsEditForm.controls.allianceAccount.reset()
      this.RequestAlliance = false
      this.LeadDetailsEditForm.controls.allianceAccount.reset(this.LeadDetailsEditForm.controls.allianceAccount.value)
    } else if (value == "Advertisement" || value == "M&CI - iProfile" || value == "Events" || value == "Conference" || value == "Campaign") {
      this.LeadDetailsEditForm.controls.campaign.reset()
      this.LeadDetailsEditForm.controls.campaign.clearValidators()
      this.requestCamp = false
    }
  }

  clearAdvisor() {
    this.LeadDetailsEditForm.patchValue({
      advisorAccount: ""
    });
    this.AdvisorName = '';
  }

  clearAlliance() {
    this.LeadDetailsEditForm.patchValue({
      allianceAccount: ""
    });
    this.AllianceName = '';
  }
  //------------------------------------------------CLEAR FUNCTIONS END---------------------------------------------------------------------//

  throwDuplicationError(message) {
    this.errPopup.throwError(message)
  }

  LoadLeadDetailsToDom() {
    this.firstleadDetailsArr = [
      { label: 'Lead name', content: this.leadDetails.Title, show: true, isRequiredman: true },
      // { label: 'Lead ID', content: this.leadDetails.LeadGuid, show: true, isRequiredman: true },
      { label: 'Lead source', content: this.leadDetails.wipro_LeadSource.Name, show: true, isRequiredman: true },
      { label: 'Account name', content: this.leadDetails.Account ? decodeURIComponent(this.leadDetails.Account.Name) : 'NA', show: true, isRequiredman: true },
      { label: 'Account/Prospect', content: this.leadDetails.Account.isProspect === true ? "Prospect" : "Account", show: true, isRequiredman: false },
      { label: 'SBU', content: this.leadDetails.SBU.Name ? this.leadDetails.SBU.Name : 'NA', show: true, isRequiredman: false },
      { label: 'Vertical', content: this.leadDetails.Vertical.Name ? this.leadDetails.Vertical.Name : 'NA', show: true, isRequiredman: !this.disableVertical },
      { label: 'Date created', content: this.datepipe.transform(this.leadDetails.CreatedOn, 'dd-MMM-yyyy'), show: true, isRequiredman: false },
      { label: 'Country', content: this.leadDetails.Country.Name ? this.leadDetails.Country.Name : 'NA', show: true },
      { label: 'Enquiry type', content: this.leadDetails.EnquiryType.Name ? this.leadDetails.EnquiryType.Name : 'NA', show: true, isRequiredman: true },
      { label: 'Alliance account', content: this.leadDetails.AllianceAccountName ? this.leadDetails.AllianceAccountName : 'NA', show: true, isRequiredman: true },
      { label: 'Advisor account', content: this.leadDetails.AdvisoryAccountName ? this.leadDetails.AdvisoryAccountName : 'NA', show: this.AdvisorsAccount, isRequiredman: true },
      { label: 'Solution involved', content: this.leadDetails.isSolutionInvolved ? 'Yes' : 'No', show: true, isRequiredman: false },
      { label: 'Wipro solutions', content: (this.leadDetails.Solutions) ? (this.leadDetails.Solutions.length > 0) ? this.leadDetails.Solutions.map(x => x = x.Name) : [] : [], show: this.iswiprosolution, isRequiredman: true },
      { label: 'Service line involved', content: this.leadDetails.isServiceLineInvolved ? 'Yes' : 'No', show: true, isRequiredman: false },
    ]
    this.linkedLeadDetails = [
      { label: 'Linked meeting activities', routing: 'linkedactivity', content: (this.leadDetails.LinkActivityGroupLead.length > 0) ? this.leadDetails.LinkActivityGroupLead.map(x => { return { Name: x.Name, Guid: x.SysGuid } }) : [] },
      { label: 'Linked campaign', routing: 'linkedcampaign', content: (this.leadDetails.Campaign.length > 0) ? this.leadDetails.Campaign.map(x => { return { Name: x.Name, Id: x.Id } }) : [], isRequiredman: this.requestCamp },
      { label: 'Linked opportunities', routing: 'linkedOppAndOrder', content: (this.leadDetails.OpportunitiesOrOrders.length > 0) ? this.leadDetails.OpportunitiesOrOrders.map(x => { return { Name: x.Name, Guid: x.Guid } }) : [] },
      { label: 'Linked AGP (s)', Agp: this.leadDetails.Agp.Name ? this.leadDetails.Agp.Name : 'NA' },
    ]
    this.leadInformation = [
      { label: 'Estimated deal value', content: this.leadDetails.DealValue ? this.formatter.format(this.leadDetails.DealValue) : ".00" },
      { label: 'Currency', content: this.leadDetails.Currency.Desc ? this.leadDetails.Currency.Desc : 'NA' },
      { label: 'Lead timeline', content: this.datepipe.transform(this.leadDetails.EstimatedCloseDate, 'dd-MMM-yyyy') ? this.datepipe.transform(this.leadDetails.EstimatedCloseDate, 'dd-MMM-yyyy') : 'NA' },
    ]
    this.leadOriginator = [
      { label1: 'Lead originator', name: this.leadDetails.Originator },
    ]
    this.texeareaPatch = decodeURIComponent(this.leadDetails.EnquiryDesc)
  }

  formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD',
    minimumFractionDigits: 2
  })

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getSymbol(data) {
    if (data) {
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    } else {
        return '';
    }
}

  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = leadAdvnHeaders[controlName]
    this.lookupdata.lookupName = leadAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = leadAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = leadAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.myOpenLeadService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
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
      this.myOpenLeadService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.message = ''
          if (x.action == "loadMore") {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = (this.lookupdata.tabledata.length > 0) ? this.lookupdata.tabledata.concat(res.ResponseObject) : res.ResponseObject;
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
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emptyArray(result.controlName)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
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
      guid: this.leadGuid,
      isProspect: this.isProspect,
      AccId: this.AccountId,
      SbuId: this.sbuId,
      VerticalId: this.verticalId
    }
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

  callTempCurrency() {
    this.isLeadCurrencyLoader = true
    this.CurrencyArrayList = []
    this.contactLeadService.getsearchCurrency("").subscribe(
      data => {
        this.isLeadCurrencyLoader = false
        if (data.IsError === false) {
          this.CurrencyArrayList = data.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
        } else {
          this.errPopup.throwError(data.Message);
          this.CurrencyArrayList = []
        }
      }, error => {
        this.isLeadCurrencyLoader = false;
        this.CurrencyArrayList = []
      });
  }

  callTempAdvisor() {
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

  callTempAccount() {
    this.isAccountSearchLoader = true
    this.companyNameSearch = []
    this.contactLeadService.getsearchAccountCompany("").subscribe(res => {
      this.isAccountSearchLoader = false
      this.isLoading = false;
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
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

  // callTempSbu() {
  //   this.isSbuLoder = true
  //   this.Conversationssbu = []
  //   this.contactLeadService.getsearchSBUbyName("", this.AccountId, this.isProspect).subscribe(res => {
  //     this.isSbuLoder = false
  //     if (res.IsError === false) {
  //       this.lookupdata.TotalRecordCount = res.TotalRecordCount
  //       this.Conversationssbu = res.ResponseObject;
  //     } else {
  //       this.errPopup.throwError(res.Message);
  //       this.Conversationssbu = []
  //     }
  //   }, error => {
  //     this.isSbuLoder = false;
  //     this.Conversationssbu = []
  //   });
  // }

  // callTempVertical() {
  //   this.isVerticalLoader = true
  //   this.Vertical = []
  //   let verticalSearchreqBody = {
  //     SearchText: "",
  //     Guid: this.AccountId,
  //     SBUGuid: this.sbuId,
  //     isProspect: this.isProspect,
  //     PageSize: 10,
  //     OdatanextLink: "",
  //     RequestedPageNumber: 1
  //   }
  //   this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
  //     this.isVerticalLoader = false
  //     if (res.IsError === false) {
  //       this.Vertical = res.ResponseObject;
  //     } else {
  //       this.errPopup.throwError(res.Message);
  //       this.Vertical = []
  //     }
  //   }, error => {
  //     this.isVerticalLoader = false;
  //     this.Vertical = []
  //   });
  // }

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
          // this.wiproSolutionsearch = this.wiproSolutionsearch.filter(x=>x.Name!=this.leadDetailsForm.value.WiproSolutions)
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
    this.AcivityGroupsearch = []
    this.contactLeadService.getSearchActivityGroup("", this.AccountId, this.isProspect).subscribe(res => {
      this.isAcivityGroupLoader = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.ActivityAdvanceData = res.ResponseObject;
        if (this.selectedActivityGroup.length > 0 && res.ResponseObject.length > 0) {
          this.AcivityGroupsearch = this.CompareRemoveSelected(res.ResponseObject, this.selectedActivityGroup, "Guid")
        } else {
          this.AcivityGroupsearch = res.ResponseObject;
        }
      } else {
        this.errPopup.throwError(res.Message)
        this.AcivityGroupsearch = []
      }
    }, error => {
      this.isAcivityGroupLoader = false;
      this.AcivityGroupsearch = []
    });
  }

  callTempCampaign() {
    this.isCampaignLoading = true
    this.CampaignSearch = []
    this.contactLeadService.getsearchCampaign("", this.AccountId, this.isProspect).subscribe(res => {
      this.isCampaignLoading = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.CampaignAdvanceData = res.ResponseObject;
        if (this.selectedCampaign.length > 0 && res.ResponseObject.length > 0) {
          this.CampaignSearch = this.CompareRemoveSelected(res.ResponseObject, this.selectedCampaign, "Id")
        } else {
          this.CampaignSearch = res.ResponseObject;
        }
      } else {
        this.errPopup.throwError(res.Message);
        this.CampaignSearch = []
      }
    }, error => {
      this.isCampaignLoading = false;
      this.CampaignSearch = []
    });
  }

  callTempOpportunity() {
    this.isOpportunityLoader = true
    this.Conversationsoppo = []
    this.contactLeadService.searchOpportunityOrder("", this.AccountId, this.isProspect).subscribe(res => {
      this.isOpportunityLoader = false
      if (res.IsError === false) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount
        this.OppAdvanceData = res.ResponseObject;
        if (this.selectedOpportunity.length > 0 && res.ResponseObject.length > 0) {
          this.Conversationsoppo = this.CompareRemoveSelected(res.ResponseObject, this.selectedOpportunity, "Guid")
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
    this.agpSearchArr = []
    this.contactLeadService.getsearchLinkAGP("").subscribe(res => {
      this.isAgpLoader = false
      if (res.IsError === false) {
        this.agpSearchArr = res.ResponseObject;
      } else {
        this.errPopup.throwError(res.Message);
        this.agpSearchArr = []
      }
    }, error => {
      this.isAgpLoader = false;
      this.agpSearchArr = []
    });
  }

  callTempContact() {
    this.isCustometContactLoader = true
    this.customerContactdetails = []
    this.meetingApi.searchCustomerparticipants("", this.AccountId, this.isProspect).subscribe(data => {
      this.isCustometContactLoader = false
      if (data.IsError === false) {
        this.lookupdata.TotalRecordCount = data.TotalRecordCount
        this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
        this.customerAdvanceData = data.ResponseObject;
        if (this.selectedCustomerContact.length > 0 && data.ResponseObject.length > 0) {
          this.customerContactdetails = this.CompareRemoveSelected(data.ResponseObject, this.selectedCustomerContact, "Guid")
        } else {
          this.customerContactdetails = data.ResponseObject;
        }
      } else {
        this.errPopup.throwError(data.Message);
        this.customerContactdetails = []
      }
    }, error => {
      this.isCustometContactLoader = false;
      this.customerContactdetails = []
    });
  }

  // callTempOwner() {
  //   this.isLeadOwnerLoader = true
  //   this.wiproContactowner = []
  //   this.contactLeadService.getsearchLeadOwner("").subscribe(data => {
  //     this.isLeadOwnerLoader = false
  //     if (data.IsError === false) {
  //       this.lookupdata.TotalRecordCount = data.TotalRecordCount
  //       this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
  //       this.wiproContactowner = data.ResponseObject;
  //     } else {
  //       this.errPopup.throwError(data.Message);
  //       this.wiproContactowner = []
  //     }
  //   }, error => {
  //     this.isLeadOwnerLoader = false;
  //     this.wiproContactowner = []
  //   });
  // }
  // end close function

  // delete and add
  addrow(event) {
    event.preventDefault()
    this.searchitem = ""
    this.searchPractice = ""
    this.searchSlbdm = ""
    this.createTableNewRow();
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
  
  canceleditcommnets(): void {
    const dialogRef = this.dialog.open(cancelpopcommentComponent, {
      width: '400px',
    });
  }

  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelleadComponent, {
      width: '400px',
    }).afterClosed().subscribe(res => {
      if (res == 'OK') {
        this.ServiceTable = []
        this.contactLeadService.attachmentList=[]
        this.myOpenLeadService.clearLeadAddContactSessionStore()
        this.service.sendLeadCancelSave(true) // hide cancle and save btn
        this.setTheDetails(this.editLeadDetails)
        //this.ResetTheLablesName()
        this.LoadLeadDetailsToDom()
        this.store.dispatch(new ClearAllLeadDetails())
        this.edit = true;
        this.ServiceTable = this.ServiceTable.filter(x => x.apiId != "0");
        this.service.windowScroll();
      }
    });
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
        let body = this.contactLeadService.attachmentList.map(x=>{
          if(x.downloadFileName) 
          return {Name : x.downloadFileName}
          else 
          return {Name : x.Name}
        });
        this.filesToDownloadDocument64(body);
        // this.contactLeadService.attachmentList.forEach(
        //   item => {
        //     downloadUrls.push(item.Url);
        //   })
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
        });
      }, idx * 2500)
    });
  }

  downloadFile(i) {
    let body = [this.contactLeadService.attachmentList[i]].map(x=>{
      if(x.downloadFileName) 
      return {Name : x.downloadFileName}
      else 
      return {Name : x.Name}
    });
    this.filesToDownloadDocument64(body);
    // this.contactLeadService.attachmentList[i];
    // const response = {
    //   file: this.contactLeadService.attachmentList[i].Url,
    // };
    // var a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
  }

  AddCustomerContact() {
    if (this.AccName == undefined) {
      this.errPopup.throwError('Select account')
    } else {
      const dialogRef = this.dialog.open(CustomerpopupComponent, {
        width: '800px',
        data: (this.AccountSelected) ? ({ Name: decodeURIComponent(this.AccountSelected['Name']), SysGuid: this.AccountSelected['SysGuid'], isProspect: this.AccountSelected['isProspect'] }) : ''
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != '') {
          let json = { FullName: (res['FName'] + ' ' + res['LName']), Designation: res['Designation'] ? res['Designation'] : "", isKeyContact: res['isKeyContact'] ? res['isKeyContact'] : false, MapGuid: "", Guid: res['Guid'], SysGuid: res['Guid'], Email: res['Email'] };
          let json1 = { FullName: (res['FName'] + ' ' + res['LName']), LinkActionType: 1, Designation: res['Designation'] ? res['Designation'] : "", isKeyContact: res['isKeyContact'] ? res['isKeyContact'] : false, MapGuid: "", Guid: res['Guid'], SysGuid: res['Guid'], Email: res['Email'], Id: res['Guid'] };
          this.appendCustomerContact(json.FullName, json, true, 0)
          this.removeValidatorsForCustomer();
        }
      })
    }
  }

  setCurrentFormDetails(data) {
    this.isSwitch = true;
    sessionStorage.setItem("TempEditLeadDetails", JSON.stringify({...this.createTempData(),isMeetingCreate:data}))
  }

  RequestCampaign() {
    this.isSwitch = true
    sessionStorage.setItem('RequestCampaign', JSON.stringify({ Account: this.AccountCompanyName, AccountSysGuid: this.AccountId, isProspect: this.ProspectBool, Name: this.leadDetails.Title,isAccountPopulate : true }))
    this.setCurrentFormDetails(false)
    sessionStorage.setItem('leadRoute', JSON.stringify('L2'))
    this.router.navigate(['/campaign/RequestCampaign'])
  }

  createTempData() {
    return {
      Title: this.leadNameChanges.trim(),
      LeadGuid: this.leadGuid,
      Account: {
        SysGuid: this.customerAccount,
        Name: this.AccountCompanyName,
        isProspect : this.isProspect
      },
      Vertical: {
        Id: this.verticalId,
        Name: this.verticalName
      },
      wipro_LeadSource: {
        SysGuid: this.leadSourceId,
        Name: this.leadSourceName
      },
      SBU: {
        Id: this.sbuId,
        Name: this.sbuName
      },
      EnquiryType: {
        Id: this.enquiryId,
        Name: ""
      },
      Currency: {
        Id: this.currencyId,
        Desc: this.currencyName
      },
      Agp: {
        Guid: this.linkagpGuid,
        Name: this.agpName
      },
      Country: {
        SysGuid: this.countryId,
        Name: this.countryName
      },
      AllianceAccountGuid: this.AllianceAccountguid,
      AllianceAccountName: this.AllianceName,
      AdvisoryAccountName: this.AdvisorName,
      AdvisoraccountGuid: this.AdvisorAccountguid,
      ServiceLine: (this.ServiceTable.some(x => x.apiId == '0')) ? [] : this.ServiceTable,
      isServiceLineInvolved: this.LeadDetailsEditForm.value.serviceLineToggle,
      isSolutionInvolved: this.LeadDetailsEditForm.value.WiproSolutionToggle,
      LinkActivityGroupLead: this.selectedActivityGroup,
      linkedOpportunity: this.selectedOpportunity,
      Campaign: this.selectedCampaign,
      CustomerContacts: this.selectedCustomerContact,
      linkOpportunity: this.selectedOpportunity,
      Solutions: this.selectedWiproSolution,
      Attachments: this.contactLeadService.attachList,
      Owner: {
        FullName: this.leadOwnerName,
        ownerId: this.leadOwnerId
      },
      Originator: this.editLeadDetails.Originator,
      EnquiryDesc: encodeURIComponent(this.LeadDetailsEditForm.value.enquerydescription),
      DealValue: Number(this.LeadDetailsEditForm.value.dealValue.replace(/\,/g, "")),
      CreatedOn: this.LeadDetailsEditForm.value.dateCreated,
      EstimatedCloseDate: this.LeadDetailsEditForm.value.timeline,
      ExistingActivityData: this.editLeadDetails.LinkActivityGroupLead ? this.editLeadDetails.LinkActivityGroupLead : [],
      ExistingCampaignData: this.editLeadDetails.Campaign ? this.editLeadDetails.Campaign : [],
      ExistingOpportunityData: this.editLeadDetails.OpportunitiesOrOrders ? this.editLeadDetails.OpportunitiesOrOrders : [],
      ExistingContactData: this.editLeadDetails.CustomerContacts ? this.editLeadDetails.CustomerContacts : [],
      ExistingAgpData: this.editLeadDetails.Agp ? this.editLeadDetails.Agp : {},
      ExistingWiproSolutionData: this.editLeadDetails.selectedWiproSolution,
      enquirydata: this.enquiryType,
      Switch: this.isSwitch,
      navigation: this.leadIdentityFrom, // to cancel and back arrow to work in contact switch.
      finalCampaignGroup:this.finalCampaignGroup,
      finalActivityGroup:this.finalActivityGroup,
      finalOppotunityGroup:this.finalOppotunityGroup,
      finalAgpGroup:this.finalAgpGroup,
      finalContactGroup:this.finalContactGroup
    }
  }

  serviceLineValidationCheck() {
    if (this.LeadDetailsEditForm.controls['serviceLineToggle'].value) {
      this.tableInValid = false
      this.ServiceTable.forEach((x) => {
        if (!x.isDeleted) {
          this.servicelineTable_Data.forEach(y => {
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
          })
        }
      });
      return this.tableInValid
    } else {
      return false
    }
  }

  getservicelineCount(){
    return this.ServiceTable.filter(x=>x.isDeleted == false).length

  }
  getservicelinedelete(){
    return this.ServiceTable.filter(x=>x.isDeleted == false).length>1?true:false
  }

  clearAllLeadListState(data) {
    if (data.Owner.ownerId == this.uddatedLeadsDetails.Owner.ownerId) {
      this.store.dispatch(new ClearArchivedLeadState())
      this.store.dispatch(new ClearOpenLeadState())
      this.store.dispatch(new ClearMyopenlead())
    }
  }

  save() {
    var contactLeadServiceAttachments;
    if (this.leadNameChanges.trim() == "") {
      this.LeadDetailsEditForm.patchValue({leadName : ""})
      this.LeadDetailsEditForm.controls['leadName'].setValidators(Validators.required);
      this.LeadDetailsEditForm.controls['leadName'].markAsTouched();
      this.LeadDetailsEditForm.controls['leadName'].updateValueAndValidity();
    }
    if (this.LeadDetailsEditForm.valid && !this.serviceLineValidationCheck() && this.leadNameChanges.trim() !== "") {
      this.isLoading = true;
      this.myOpenLeadService.clearLeadAddContactSessionStore()
      contactLeadServiceAttachments = this.contactLeadService.attachmentList;
      let body = this.generateEditReqParam();
      this.contactLeadService.getEditLeadDetails(body).subscribe(
        res => {
          this.isLoading = false;
          if (res.IsError === false) {
            // this.daService.iframePage = 'NA';
            // let bodyDA = {
            //   page: 'NA',
            // };
            // this.daService.postMessageData = bodyDA;
            // this.daService.postMessage(bodyDA);
            this.saveclicked = true;
            sessionStorage.removeItem
            const changes = res.ResponseObject
            this.uddatedLeadsDetails = res.ResponseObject
            this.myOpenLeadService.clearLeadAddContactSessionStore()
            let updateleadDetais = {
              id: this.id,
              changes
            }
            // this.service.sendLeadCancelSave(true) // hide cancle and save btn
            this.store.dispatch(new UpdateLeadDetails({ updateleadDetais }))
            this.clearAllLeadListState(this.leadDetails)
            this.store.dispatch(new ClearRelationshipCount());
            this.contactLeadService.setLeadNameForDetails(this.LeadDetailsEditForm.value.leadName)
            this.ModuleSwitchStateLogic(this.moduleTypeStateData)
            let message = res.Message
            let action;
            this.matSnackBar.open(message, action, {
              duration: 2000
            });
            if (this.edit == false) {
              this.service.sendLeadCancelSave(true)
            }
            this.edit = true;
          }
          if (res.IsError === true) {
            this.contactLeadService.attachmentList = contactLeadServiceAttachments;
            let message = res.Message
            let action;
            this.matSnackBar.open(message, action, {
              duration: 2000
            });
          }
        }, error => {
          this.contactLeadService.attachmentList = contactLeadServiceAttachments;
          this.isLoading = false;
        })
    } else {
      this.service.validateAllFormFields(this.LeadDetailsEditForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
    this.service.windowScroll();
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

  generateEditReqParam() {

    this.contactLeadService.attachmentList = this.contactLeadService.attachmentList.map(x =>{
      return { 'Name' : x.Name, 'Url': x.Url,"MapGuid": x.MapGuid,"LinkActionType": x.LinkActionType,"Comments" : x.Comments }
    });

    return {
      "LeadGuid": this.leadGuid,
      "Title": this.leadNameChanges.trim(),
      "wipro_LeadSource": {
        "sysGuid": this.leadSourceId
      },
      "AllianceAccountGuid": this.AllianceAccountguid ? this.AllianceAccountguid : "",
      "AdvisoryAccountGuid": this.AdvisorAccountguid ? this.AdvisorAccountguid : "",
      "Prospect": {
        "Guid": this.wiproProspectAccount ? this.wiproProspectAccount : ""
      },
      "Account": {
        "SysGuid": this.customerAccount ? this.customerAccount : ""
      },
      "Vertical": {
        "Id": this.verticalId ? this.verticalId : ""
      },
      "SBU": {
        "Id": this.sbuId ? this.sbuId : ""
      },
      "EnquiryType": {
        "Id": this.enquiryId ? Number(this.enquiryId) : ""
      },
      "EnquiryDesc": this.LeadDetailsEditForm.value.enquerydescription === "" ? "" : encodeURIComponent(this.LeadDetailsEditForm.value.enquerydescription),
      "Agp": this.filterAgpData(this.finalAgpGroup),
      "Country": this.CountryDetails,
      "isSolutionInvolved": this.LeadDetailsEditForm.value.WiproSolutionToggle,
      "isServiceLineInvolved": this.LeadDetailsEditForm.value.serviceLineToggle,
      "Solutions": this.filterWiproSolution(this.finalWiproSolutionGroup),
      "wipro_remarks": "",
      "DealValue": Number(this.LeadDetailsEditForm.value.dealValue.replace(/\,/g, "")),
      "DealValueInUSD": (this.LeadDetailsEditForm.value.estimatedRateValue) ? this.LeadDetailsEditForm.value.estimatedRateValue : "",
      "Currency": {
        "Id": (this.currencyId) ? this.currencyId : ""
      },
      "EstimatedCloseDate": this.datepipe.transform(this.LeadDetailsEditForm.value.timeline, 'yyyy-MM-dd'),
      "Owner": {
        "ownerId": this.leadOwnerId
      },
      "ServiceLine": this.filterServiceBdm(this.ServiceTable),
      "ActivityGroups": this.filterActivityGroup(this.finalActivityGroup),
      "OpportunitiesOrOrders": this.filterOppotunityGroup(this.finalOppotunityGroup),
      "CustomerContacts": this.filterContactGroup(this.finalContactGroup),
      "Campaign": this.filterCampaignGroup(this.finalCampaignGroup),
      "Attachments": this.contactLeadService.attachmentList,
      "isToRemoveAllianceAccount": this.ToRemoveAllianceAccount(this.LeadDetailsEditForm.value.allianceAccount),
      "isToRemoveAdvisoryAccount": this.ToRemoveAdvisoryAccount(this.LeadDetailsEditForm.value.advisorAccount)
    }
  }

  ToRemoveAllianceAccount(Val){
    if(Val == "" && this.leadDetails.AllianceAccountGuid !== ""){
      return  true
    }if(Val == "" && this.leadDetails.AllianceAccountGuid == ""){
      return false
    }
  }

  ToRemoveAdvisoryAccount(Val){
    if(Val == "" && Val == null && this.leadDetails.AdvisoryAccountGuid !== "" && this.AdvisorName ==""){
      return  true
    }if(Val == "" && Val == null && this.leadDetails.AdvisoryAccountGuid == ""){
      return false
    }
  }

  filterAgpData(data) {
    if (data.length > 0) {
      return {
        Guid: data[0].SysGuid,
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
        data = data.filter(x => x.LinkActionType != 1)
      }
      return data.map(x => {
        return {
          SysGuid: x.SysGuid,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          LinkActionType: (!this.iswiprosolution) ? 3 : x.LinkActionType
        }
      })
    } else {
      return []
    }
  }

  filteAgpGroup(data) {
    if (data.length > 0) {
      return data.map(x => {
        return {
          Guid: x.SysGuid,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return [{ SysGuid: '' }]
    }
  }

  filterContactGroup(data) {
    if (data.length > 0) {
      return data.map(x => {
        return {
          Guid: (x.SysGuid) ? x.SysGuid : x.Guid,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return []
    }
  }

  filterOppotunityGroup(data) {
    if (data.length > 0) {
      return data.map(x => {
        return {
          SysGuid: x.Guid,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          Type: x.Type,
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return []
    }
  }

  filterServiceBdm(data) {
    if (this.isServicelines) {
      if (data) {
        if (data.length > 0) {
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
                LinkActionType: x.LinkActionType,
                MapGuid: (x.MapGuid) ? x.MapGuid : ""
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
      return this.DeleteServiceLines(data)
    }
  }

  DeleteServiceLines(data) {
    if (data) {
      if (data.length > 0) {
        if (data.some(x => x.serviceLines.Guid != '')) {
          data = data.filter(x => x.LinkActionType != 3)
          return data.map(x => {
            return {
              Guid: x.serviceLines.Guid,
              practice: {
                practiceGuid: x.practice.practiceGuid
              },
              SLBDM: {
                bdmidGuid: x.slbdm.bdmidGuid
              },
              LinkActionType: 3,
              MapGuid: (x.MapGuid) ? x.MapGuid : ""
            }
          })
        } else {
          return []
        }
      } else {
        return []
      }
    }
  }

  filterActivityGroup(data) {
    if (data.length > 0) {
      return data.map(x => {
        return {
          Guid: x.Guid,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return []
    }
  }

  filterCampaignGroup(data) {
    if (data.length > 0) {
      return data.map(x => {
        return {
          Id: x.Id,
          MapGuid: (x.MapGuid) ? x.MapGuid : '',
          LinkActionType: x.LinkActionType
        }
      })
    } else {
      return []
    }
  }

  openactivitypop(): void {
    this.setCurrentFormDetails(true);
    this.router.navigate(['activities/newmeeting']);
    // let Data = {
    //   Account: {
    //     SysGuid: this.customerAccount,
    //     Name: this.AccountCompanyName,
    //     isProspect: this.ProspectBool
    //   }
    // }
    // //Add new activity group
    // const dialogRef = this.dialog.open(activitypop, {
    //   width: '500px',
    //   data: Data
    // });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res !== undefined) {
    //     let dialogdata = res
    //     let CretedActivity = { Guid: dialogdata.data.id, SysGuid: dialogdata.data.id, Name: dialogdata.data.name }
    //     this.appendActivityGroup(dialogdata.data.name, CretedActivity, false, 0)
    //     this.store.dispatch(new ClearActivity())
    //   }
    // })
  }

  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 1000
    });
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
        })
      },
        () => this.isLoading = false
      )}
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.UnsubscribeLeadDetails$.unsubscribe()
    this.showEditBtn$.unsubscribe()
  }
}
@Component({
  selector: 'activity-pop',
  templateUrl: './activity-pop.html',
  // styleUrls: ['./']
})

export class activitypop implements OnInit, OnDestroy {
  ActivityTypeForm: FormGroup;
  ActivityType: any = [];
  companyDetails: any = [];
  isLoading: boolean;
  AccountSysGuid: any;
  activityId: any;
  Name: any;
  AccName: any;
  isvalidation: boolean = false;
  create: boolean = false;
  DisableAccount: boolean = true
  AccountName
  companyName: string;
  showCompany: boolean;
  showCompanySwitch: boolean = true;
  subscription: Subscription
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<activitypop>,
    public fb: FormBuilder,
    private newconversationService: newConversationService,
    private contactleadService: ContactleadService,
    public errPopup: ErrorMessage,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public location: Location,
    public offlineservices: OfflineService,
    public store: Store<AppState>) {
    this.CreateActivityType()
  }

  ngOnInit(): void {
    this.create = false;
    this.ActivityTypeForm.patchValue({
      accountName: this.data.Account.Name
    })
    this.AccountName = this.data.Account.Name
    history.pushState(null, null, window.location.href);
    this.subscription = <Subscription>this.location.subscribe((x) => {
      history.pushState(null, null, window.location.href);
    })
  }
  
  ngOnDestroy() {
    //this.dialogRef.close();
    this.subscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.ActivityTypeForm.controls
  }

  CreateActivityType() {
    this.ActivityTypeForm = this.fb.group({
      newActivityGroup: ['', Validators.compose([Validators.required, removeSpaces, specialCharacter])], //this.noWhitespaceValidator
      // activityType: ['', Validators.required],
      accountName: [this.data.Account.Name, { disabled: true }, Validators.required]
    })
    this.OnChanges()
  }

  OnChanges() {
    this.ActivityTypeForm.get('accountName').valueChanges.subscribe(val => {
      if (val.trim() !== "" && this.ActivityTypeForm.get('accountName').dirty) {
        this.contactleadService.getsearchAccountCompanyNew(val).subscribe(res => {
          this.isLoading = false;
          if (res.IsError === false) {
            this.companyDetails = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message);
          }
        });
      }
    })
  }

  CreateActivity() {
    if (this.ActivityTypeForm.valid === false) {
      this.service.validateAllFormFields(this.ActivityTypeForm);
    }
    if (this.ActivityTypeForm.valid === true) {
      this.create = true;
      const body = {
        "Name": this.ActivityTypeForm.value.newActivityGroup.trim(),
        "ActivityType": { "Id": 0 },
        "Account": { "SysGuid": this.data.Account.SysGuid, "Name": this.data.Account.Name, "isProspect": this.data.Account.isProspect },
      }
      this.newconversationService.getCreateActivityGroup(body).subscribe(async res => {
        if (res.IsError === false) {
          this.isvalidation = false;
          this.errPopup.throwError(res.Message)
          this.dialogRef.close({ data: { id: res.ResponseObject.Guid, name: res.ResponseObject.Name } });
        }
        this.isLoading = false;
        if (res.IsError === true) {
          this.errPopup.throwError(res.Message)
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
  }

  appendAccontName(value: string, item) {
    this.AccountSysGuid = item.SysGuid;
    this.AccName = item.Name;
    this.companyName = value;
    this.ActivityTypeForm.patchValue({
      accountName: value
    })
  }
}
/****************** add-view-comments popup END  */
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
})
export class cancelpopcommentComponent {
  constructor(private dialogRef: MatDialog, ) {
  }
  closeallpop() {
    this.dialogRef.closeAll();
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-lead.html',
})
export class cancelleadComponent {
  constructor( public dialog: MatDialogRef<cancelleadComponent>) { }

  onClickCancel(data) {
    this.dialog.close(data);
  }
}
@Component({
  selector: 'delete-attach-pop',
  templateUrl: './delete-attach-pop.html',
  styleUrls: ['./lead-details.component.scss'],
})

export class deleteAttachPopUp1 {
  constructor(private dialogRef: MatDialog, public dialog: MatDialogRef<deleteAttachPopUp1>) {
  }
  okClicked() {
    this.dialog.close({ 'OK': true });
  }
  closeallpop() {
    this.dialog.close({ 'OK': false });
  }
}
