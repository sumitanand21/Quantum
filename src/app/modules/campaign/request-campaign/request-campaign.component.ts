import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { DataCommunicationService } from '@app/core/services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService, CampaignHeaders, CampaignAdvNames, CampaignNav, DnBAccountHeader } from '@app/core/services/campaign.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { Router } from '@angular/router';
import { ErrorMessage, ContactleadService } from '@app/core/services';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { EditAllCampaign, EditActiveCampaign, ClearCampaign } from '@app/core/state/actions/campaign-List.action';
import { Update } from '@ngrx/entity';
import { CampaignList } from '@app/core/state/state.models/campaign/Campaign-AllList.interface';
import { UpdateLeadCampaign } from '@app/core/state/actions/leads.action';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { ActivityService } from '@app/core/services/activity.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-request-campaign',
  templateUrl: './request-campaign.component.html',
  styleUrls: ['./request-campaign.component.scss'],
})
export class RequestCampaignComponent implements OnInit {
  @ViewChild('accountlist')
  acc: ElementRef;
  campaignDetailsForm: FormGroup;
  channelDetailsForm: FormGroup;
  leadinfo = true;
  dealinfo = false;
  twoactive = false;
  consent = false;
  ConversationNameSwitch: boolean = false;
  ConversationSBUNameSwitch: boolean = false;
  ConversationVerticalNameSwitch: boolean = false;
  InterestNameSwitch: boolean = false;
  interestChange: boolean = false;
  IndustryNameSwitch: boolean = false;
  FunctionNameSwitch: boolean = false;
  industryChange: boolean = false;
  isLoading: boolean = false;
  updateCampaign: boolean = false;
  completedCampaign: boolean = false;
  okClickedinPopUp: boolean = false;
  SBUValidation: boolean = false;
  verticalValidation: boolean = false;
  saveClicked: boolean = false;
  subActDisabled: boolean = true;
  getSubActivity: any;
  subActivity: any;
  purpose: any;
  searchAccountCompany: any;
  convresationName: any;
  accountSysgiudConversation: string = '';
  getCampaignDetails: any;
  IntersetFromApi: any;
  IndustryFromApi: any;
  sessionStorageObject: any;
  newDeadLineSelected: any;
  newEndDateSelected: any;
  newStartDateSelected: any;
  searchSBUData: any = [];
  searchVerticleData: any;
  getSBUId: string = '';
  getVerticleId: string = '';
  getFunction: Array<any>;
  getPurpose: any[];
  campaignType: any[];
  channelType: any[];
  platformType: any[];
  activity: Array<any> = [];
  selectedInterest = [];
  sendInterest: any = [];
  selectedIndustry: any;
  sendIndustry: any;
  selectedFunction = [];
  sendSelectedFunction = [];
  acclist: any = [];
  selectedAccc: any = [];
  Conversation: string = "";
  accountCompanyName: any = '';
  Interest: string = "";
  Industry: string = "";
  Function: string = "";
  VerticalMessage: string;
  isAccountNameSearchLoading: boolean = false;
  isSBUSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  isVerticalSearchLoading: boolean = false;
  isInterestSearchLoading: boolean = false;
  isIndustrySearchLoading: boolean = false;
  isFunctionSearchLoading: boolean = false;
  minStartDate: any;
  accountCloseDisabled: boolean = true;
  routepath: any = null;
  accountValidation: boolean = false;
  LeadGuid: any;
  successMessage: any;
  selectedSBUValue: any;
  activityName: any;
  sbuName: string = '';
  verticleName: string = '';
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
    TotalRecordCount: 0,
    selectedRecord: [],
    pageNo: 1,
    nextLink: '',
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
  campaignNameChange: string = "";
  maxDate: any;
  isCompleted: boolean = false;
  functionName: string = "";
  functionId: string = "";
  tempFunction = [];
  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public service: DataCommunicationService,
    public campaignService: CampaignService,
    private masterApi: MasterApiService,
    private router: Router,
    private activityService: ActivityService,
    private PopUp: ErrorMessage,
    private encrDecrService: EncrDecrService,
    private store: Store<AppState>,
    public routingState: RoutingState,
    private myOpenLeadService: MyOpenLeadsService,
    public contactLeadService: ContactleadService,
    private S3MasterApiService: S3MasterApiService,
  ) {
    this.campaignFieldForm();
    this.channelFieldForm();
  }
  campaignFieldForm() {
    this.campaignDetailsForm = this.formBuilder.group({
      Name: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      SBU: ['',],
      Vertical: ['',],
      CompanyName: ['', Validators.required],
      Interest: [''],
      Description: [''],
    })
    this.valueChangesForSearchCampaign();
    this.campaignDetailsForm.get('SBU').disable();
    this.campaignDetailsForm.controls['Vertical'].disable();
  }
  channelFieldForm() {
    this.channelDetailsForm = this.formBuilder.group({
      Activity: ['', Validators.required],
      Subactivity: ['', Validators.required],
      TypeOfCampaign: [''],
      Channel: [''],
      Platform: [''],
      Purpose: ['', Validators.required],
      Industry: [''],
      Function: [''],
      Deadline: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    }, { validator: this.dateLessThan('StartDate', 'EndDate', 'Deadline') })
    this.channelDetailsForm.controls['Subactivity'].disable();
    this.channelDetailsForm.controls['Industry'].disable();
    this.valueChangesForChannelForm();
  }
  dateLessThan(from: string, to: string, Deadline: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      let d = group.controls[Deadline];
      if ((d.value) != '' && f.value != '' && t.value != '') {
        if (new Date(f.value).getTime() > new Date(d.value).getTime()) {
          return { 'startDate': 'Start date should be lesser than deadline' }
        }
        if (new Date(t.value).getTime() > new Date(d.value).getTime()) {
          return { 'endDate': 'End date should be lesser than deadline' }
        }
        if (new Date(f.value).getTime() > new Date(t.value).getTime()) {
          return { 'startDate': 'Start date should be lesser than end date' }
        }
      }
    }
  }
  ngOnInit() {
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year + 1, month, currentDate);
    this.minStartDate = new Date();
    this.service.isComplete = false;
    this.saveClicked = false;
    this.isLoading = true;
    this.getMasterDatas();
    this.sessionStorageDatas();
    if (sessionStorage.getItem('campaignCacheData')) {
      this.cacheData();
    } else {
      this.accountPopulateBasedOnConditions();
    }
    this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
      localStorage.setItem('dNBToken', res.ResponseObject.access_token)
    })
  }


  getMasterDatas() {
    this.isLoading = true;
    this.masterApi.getPurpose().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.getPurpose = res.ResponseObject;
      }
    })
    this.masterApi.getSubActivities().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.getSubActivity = res.ResponseObject;
      }
    })
    this.masterApi.getCampaignType().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.campaignType = res.ResponseObject;
      }
    })
    this.masterApi.getChannelType().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.channelType = res.ResponseObject;
      }
    })
    this.masterApi.getPlatofrm().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.platformType = res.ResponseObject
      }
    })
    this.masterApi.getActivities().subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.activity = res.ResponseObject
      }
    })
  }

  getSubActivityDropDownList(guid) {
    this.masterApi.getSubActivitiesBasedOnActivity(guid).subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.getSubActivity = res.ResponseObject;
      }
    })
  }

  sessionStorageDatas() {
    this.sessionStorageObject = {
      "requestCampaign": (JSON.parse(sessionStorage.getItem("RequestCampaign"))) ? JSON.parse(sessionStorage.getItem("RequestCampaign")) : ''
    }
  }
  accountPopulateBasedOnConditions() {
    if (this.sessionStorageObject['requestCampaign'] != '') {
      let campaignRequestData = this.sessionStorageObject['requestCampaign'];
      this.routepath = (campaignRequestData['navigation']) ? campaignRequestData['navigation'] : null;
      this.convresationName = this.sessionStorageObject['requestCampaign']['Name'];
      if (this.sessionStorageObject['requestCampaign']['isAccountPopulate'] == false) {
        if (this.sessionStorageObject['requestCampaign']['isCampaignEdit']) {
          this.allCampaigns();
        }
      }
      if (this.sessionStorageObject['requestCampaign']['fromOpportunity']) {
        this.accountSuuVerticlePopulate();
      }
      if (this.sessionStorageObject['requestCampaign']['isAccountPopulate'] == true) {
        this.accountAutoPopulate();
      }
    }
  }
  inputChange(event) {
    console.log(event.target.value)
    this.campaignNameChange = event.target.value;
  }
  valueChangesForSearchCampaign() {
    this.campaignDetailsForm.get('CompanyName').valueChanges.subscribe(val => {
      if (this.campaignDetailsForm.get('CompanyName').dirty && this.ConversationNameSwitch) {
        this.accountLookUpApiLoader(val, true);
      }
    })
    this.campaignDetailsForm.get('SBU').valueChanges.subscribe(val => {
      if (this.selectedAccc.length > 0 && this.campaignDetailsForm.get('SBU').dirty && this.ConversationSBUNameSwitch) {
        this.sbuLookUpApiLoader(val, true);
      }
    })
    this.campaignDetailsForm.get('Vertical').valueChanges.subscribe(val => {
      if (this.campaignDetailsForm.get('Vertical').dirty && this.getSBUId != '' && this.ConversationVerticalNameSwitch) {
        this.verticleLookUpLoader(val, true);
      }
    })
    this.campaignDetailsForm.get('Interest').valueChanges.subscribe(val => {
      if (this.campaignDetailsForm.get('Interest').dirty && this.InterestNameSwitch) {
        this.intrestLookUpLoader(val, true);
      }
    })
    this.campaignDetailsForm.get('Name').valueChanges.subscribe(val => {
      if (val.trim() === "") { this.campaignDetailsForm.get('Name').patchValue('', { emitEvent: false }) }
    })
    this.campaignDetailsForm.get('Description').valueChanges.subscribe(val => {
      if (val === "") { this.campaignDetailsForm.get('Description').patchValue('', { emitEvent: false }) }
    })
  }
  valueChangesForChannelForm() {
    this.channelDetailsForm.get('Function').valueChanges.subscribe(val => {
      if (this.channelDetailsForm.get('Function').dirty && this.FunctionNameSwitch) {
        this.functionLookUpLoader(val, true);
      }
    })
  }
  clickAccountData() {
    this.accountLookUpApiLoader('', false);
  }
  clickSBUData() {
    this.sbuLookUpApiLoader('', false);
  }
  clickVerticleData() {
    this.verticleLookUpLoader('', false);
  }
  clickInterest() {
    this.intrestLookUpLoader('', false);
  }
  clickFunctionData() {
    this.functionLookUpLoader('', false);
  }
  accountLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.campaignDetailsForm.patchValue({ CompanyName: '' });
    }
    this.isAccountNameSearchLoading = true;
    this.searchAccountCompany = [];
    this.campaignService.getsearchAccountCompany(val).subscribe(res => {
      this.isAccountNameSearchLoading = false;
      if (res.IsError === false) {
        this.searchAccountCompany = res.ResponseObject;
        this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
        this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
      } else {
        this.PopUp.throwError(res.Message);
        this.searchAccountCompany = [];
      }
    }, error => {
      this.isAccountNameSearchLoading = false;
      this.searchAccountCompany = [];
    })
  }
  sbuLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.campaignDetailsForm.patchValue({ SBU: '' })
    }
    this.isSBUSearchLoading = true;
    this.searchSBUData = [];
    this.contactLeadService.getsearchSBUbyName(val, this.selectedAccc[0].SysGuid, this.selectedAccc[0].isProspect).subscribe(res => {
      this.isSBUSearchLoading = false;
      if (res.IsError === false) {
        this.searchSBUData = res.ResponseObject;
      } else {
        this.PopUp.throwError(res.Message);
        this.searchSBUData = [];
      }
    }, error => {
      this.isSBUSearchLoading = false;
      this.searchSBUData = [];
    })
  }
  verticleLookUpLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.campaignDetailsForm.patchValue({ Vertical: '' });
    }
    this.isVerticalSearchLoading = true;
    this.searchVerticleData = [];
    let verticalSearchreqBody = {
      SearchText: val,
      Guid: this.selectedAccc[0]['SysGuid'],
      SBUGuid: this.getSBUId,
      isProspect: this.selectedAccc[0]['isProspect'],
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
      this.isVerticalSearchLoading = false;
      if (res.IsError === false) {
        this.searchVerticleData = res.ResponseObject;
      } else {
        this.PopUp.throwError(res.Message);
        this.searchVerticleData = [];
      }
    }, error => {
      this.isVerticalSearchLoading = false;
      this.searchVerticleData = [];
    })
  }
  intrestLookUpLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.campaignDetailsForm.patchValue({ Interest: '' });
    }
    this.isInterestSearchLoading = true;
    this.IntersetFromApi = [];
    this.campaignService.ProductIntrestByName(val).subscribe(res => {
      this.isInterestSearchLoading = false;
      if (res.IsError === false) {
        var InterestNames = []
        InterestNames = res.ResponseObject;
        InterestNames.forEach(element => {
          let json = { "Id": element.Id, "Name": element.Name.replace("?", "'"), "isExist": element.isExist }
          this.IntersetFromApi.push(json);
        })
      } else {
        this.PopUp.throwError(res.Message);
        this.IntersetFromApi = [];
      }
    }, error => {
      this.isInterestSearchLoading = false;
      this.IntersetFromApi = [];
    })
  }
  functionLookUpLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.channelDetailsForm.patchValue({ Function: '' });
    }
    this.isFunctionSearchLoading = true;
    this.getFunction = [];
    this.campaignService.SearchFunction(val).subscribe((res) => {
      this.isFunctionSearchLoading = false;
      if (res.IsError === false) {
        this.getFunction = res.ResponseObject;
      } else {
        this.PopUp.throwError(res.Message);
        this.getFunction = [];
      }
    }, error => {
      this.isFunctionSearchLoading = false;
      this.getFunction = [];
    })
  }
  accountAutoPopulate() {
    this.updateCampaign = false;
    if (this.sessionStorageObject['requestCampaign'] != '') {
      // this.campaignService.ValidateAccount(this.sessionStorageObject['requestCampaign']['AccountSysGuid'], this.sessionStorageObject['requestCampaign']['isProspect'], 2).subscribe(res => {
      //   if (res.IsError == true) {
      //     this.accountValidation = true;
      //     this.accountSysgiudConversation = '';
      //     this.campaignDetailsForm.patchValue({ CompanyName: "" });
      //     this.acc.nativeElement.value = '';
      //   } else {
      this.accountValidation = false;
      this.accountSysgiudConversation = this.sessionStorageObject['requestCampaign']['AccountSysGuid'];
      this.accountCompanyName = decodeURIComponent(this.sessionStorageObject['requestCampaign']['Account']);
      this.campaignDetailsForm.patchValue({ CompanyName: decodeURIComponent(this.sessionStorageObject['requestCampaign']['Account']) });
      this.industryAutoPopulate(this.sessionStorageObject['requestCampaign']['AccountSysGuid']);
      this.ConversationNameSwitch = false;
      this.campaignDetailsForm.get('CompanyName').markAsUntouched();
      this.campaignDetailsForm.get('CompanyName').clearValidators();
      this.campaignDetailsForm.get('CompanyName').updateValueAndValidity();
      this.campaignDetailsForm.get('CompanyName').disable();
      var object = { "SysGuid": this.sessionStorageObject['requestCampaign']['AccountSysGuid'], "LinkActionType": 1, "isExist": false, isProspect: this.sessionStorageObject['requestCampaign']['isProspect'] }
      var object1 = { "SysGuid": this.sessionStorageObject['requestCampaign']['AccountSysGuid'], "Name": this.sessionStorageObject['requestCampaign']['Account'], "LinkActionType": 1, "isExist": false, isProspect: this.sessionStorageObject['requestCampaign']['isProspect'] }
      this.acclist[0] = object;
      this.selectedAccc[0] = object1;
      let SbuReqParam = {
        SysGuid: this.sessionStorageObject['requestCampaign']['AccountSysGuid'],
        isProspect: this.sessionStorageObject['requestCampaign']['isProspect']
      }
      this.getsbuautopopulate(SbuReqParam);
      //   }
      // }, error => {
      //   this.accountSysgiudConversation = '';
      //   this.campaignDetailsForm.patchValue({ CompanyName: "" });
      //   this.acc.nativeElement.value = ''
      // })
    } else {
      this.acclist = [];
      this.selectedAccc = [];
    }
  }
  accountSuuVerticlePopulate() {
    this.campaignDetailsForm.patchValue({
      CompanyName: decodeURIComponent(this.sessionStorageObject['requestCampaign']['Account']),
      SBU: this.sessionStorageObject['requestCampaign']['sbuName'],
      Vertical: this.sessionStorageObject['requestCampaign']['verticalName']
    });
    this.accountSysgiudConversation = this.sessionStorageObject['requestCampaign']['AccountSysGuid'];
    this.accountCompanyName = decodeURIComponent(this.sessionStorageObject['requestCampaign']['Account']);
    var object = { "SysGuid": this.sessionStorageObject['requestCampaign']['AccountSysGuid'], "LinkActionType": 1, "isExist": false, isProspect: this.sessionStorageObject['requestCampaign']['isProspect'] }
    var object1 = { "SysGuid": this.sessionStorageObject['requestCampaign']['AccountSysGuid'], "Name": this.sessionStorageObject['requestCampaign']['Account'], "LinkActionType": 1, "isExist": false, isProspect: this.sessionStorageObject['requestCampaign']['isProspect'] }
    this.acclist[0] = object;
    this.selectedAccc[0] = object1;
    this.sbuName = this.sessionStorageObject['requestCampaign']['sbuName'];
    this.verticleName = this.sessionStorageObject['requestCampaign']['verticalName'];
    this.getSBUId = this.sessionStorageObject['requestCampaign']['sbuId'];
    this.getVerticleId = this.sessionStorageObject['requestCampaign']['verticalId'];

    this.campaignDetailsForm.get('CompanyName').disable();
    this.campaignDetailsForm.get('SBU').disable();
    this.campaignDetailsForm.get('Vertical').disable();

    this.ConversationSBUNameSwitch = false;
    this.ConversationVerticalNameSwitch = false;
  }
  accountvalidator() {
    this.campaignDetailsForm.get('CompanyName').setValidators(Validators.required);
    this.campaignDetailsForm.get('CompanyName').markAsTouched();
    this.campaignDetailsForm.get('CompanyName').updateValueAndValidity();
  }
  sbuvalidator() {
    this.campaignDetailsForm.get('SBU').setValidators(Validators.required);
    this.campaignDetailsForm.get('SBU').markAsTouched();
    this.campaignDetailsForm.get('SBU').updateValueAndValidity();
  }
  verticlevalidator() {
    this.campaignDetailsForm.get('Vertical').setValidators(Validators.required);
    this.campaignDetailsForm.get('Vertical').markAsTouched();
    this.campaignDetailsForm.get('Vertical').updateValueAndValidity();
  }
  sbuclearnupdate() {
    this.campaignDetailsForm.get('SBU').markAsUntouched();
    this.campaignDetailsForm.get('SBU').clearValidators();
    this.campaignDetailsForm.get('SBU').updateValueAndValidity();
  }
  verticleclearnupdate() {
    this.campaignDetailsForm.get('Vertical').markAsUntouched();
    this.campaignDetailsForm.get('Vertical').clearValidators();
    this.campaignDetailsForm.get('Vertical').updateValueAndValidity();
  }
  campaignNameValidator() {
    this.campaignDetailsForm.get('Name').setValidators(Validators.required);
    this.campaignDetailsForm.get('Name').markAsTouched();
    this.campaignDetailsForm.get('Name').updateValueAndValidity();
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
  lookUpColumn(controlName, value) {
    this.lookupdata.isBackbuttonrequired = true;
    this.lookupdata['controlName'] = controlName;
    this.lookupdata['headerdata'] = CampaignHeaders[controlName];
    this.lookupdata['lookupName'] = CampaignAdvNames[controlName]['name'];
    this.lookupdata['isCheckboxRequired'] = CampaignAdvNames[controlName]['isCheckbox'];
    this.lookupdata['Isadvancesearchtabs'] = CampaignAdvNames[controlName]['isAccount'];
    this.lookupdata['inputValue'] = value;
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookUpColumn(controlName, value);
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.campaignService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata['headerdata'].length, this.lookupdata['Isadvancesearchtabs']),
      data: this.lookupdata,
      disableClose: true
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      if (x['objectRowData']['searchKey'] != '' && x['currentPage'] == 1) { this.lookupdata['nextLink'] = '' }
      let dialogData = {
        searchVal: (x['objectRowData']['searchKey'] != '') ? x['objectRowData']['searchKey'] : '',
        recordCount: this.lookupdata['recordCount'],
        OdatanextLink: this.lookupdata['nextLink'],// need to handel the pagination and search!
        pageNo: x['currentPage']//need to handel from pagination,
      };
      if (x['objectRowData']['wiprodb']) {
        this.lookUpColumn(controlName, value);
        this.campaignService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          if (res.IsError == false) {
            this.lookupdata['errorMsg']['isError'] = false;
            this.lookupdata['errorMsg']['message'] = '';
            if (x.action == "loadMore") {
              this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
              this.lookupdata['tabledata'] = this.lookupdata.tabledata.concat(res.ResponseObject);
              this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
            } else if (x.action == "search") {
              this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
              this.lookupdata['tabledata'] = res.ResponseObject;
              this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
            else if (x.action == "tabSwich") {
              if (x.objectRowData.wiprodb) {
                this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
                this.lookupdata['tabledata'] = res.ResponseObject;
                this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
              }
            }
          } else {
            this.lookupdata['errorMsg']['isError'] = true;
            this.lookupdata['errorMsg']['message'] = JSON.stringify(res.Message);
          }
        }, error => {
          this.lookupdata['isLoader'] = false;
          this.lookupdata['otherDbData']['isLoader'] = false;
        })
      } else {
        this.lookupdata['controlName'] = controlName;
        this.lookupdata['headerdata'] = DnBAccountHeader;
        this.lookupdata['lookupName'] = CampaignAdvNames[controlName]['name'];
        this.lookupdata['isCheckboxRequired'] = CampaignAdvNames[controlName]['isCheckbox'];
        this.lookupdata['Isadvancesearchtabs'] = CampaignAdvNames[controlName]['isAccount'];
        this.lookupdata['inputValue'] = value;
        this.dnBDataBase(x);
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.wiprodb == false) {
          this.service.sendProspectAccount = true;
          this.groupData(result);
          console.log(JSON.stringify(this.JSONDATA()));
          let data = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", JSON.stringify(this.JSONDATA()), "DecryptionDecrip");
          sessionStorage.setItem('campaignCacheData', data);
          this.router.navigateByUrl('/campaign/prospectAccount');
        } else { this.AppendParticularInputFun(result['selectedData'], result['controlName']); }
      }
      this.ConversationNameSwitch = false;
    });
  }
  dnBDataBase(action) {
    if (action.action == "dbAutoSearch") {
      this.lookupdata['otherDbData']['isLoader'] = true;
      this.activityService.getCountryData({ isService: true, searchKey: action['objectRowData']['searchKey'] }).subscribe(res => {
        this.lookupdata['otherDbData']['isLoader'] = false;
        this.lookupdata['isLoader'] = false;
        if (res.IsError == false) {
          this.lookupdata['errorMsg']['isError'] = false;
          this.lookupdata['errorMsg']['message'] = '';
          console.log("country", res.ResponseObject);
          this.lookupdata['otherDbData']['countryvalue'] = res.ResponseObject;
        }
      }, error => {
        this.lookupdata['isLoader'] = false;
        this.lookupdata['otherDbData']['isLoader'] = false;
      })
    }
    if (action.action == "dbSearch") {
      let body = {
        "CustomerAccount": {
          "Name": action['objectRowData']['dbSerachData']['accountname']['value'],
          "Address": { "CountryCode": action['objectRowData']['dbSerachData']['countryvalue']['id'] }
        }
      }
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata['otherDbData']['isLoader'] = false;
        this.lookupdata['isLoader'] = false;
        if (res.IsError == false) {
          this.lookupdata['errorMsg']['isError'] = false;
          this.lookupdata['errorMsg']['message'] = '';
          this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
          this.lookupdata['tabledata'] = res.ResponseObject;
          this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        if (res.IsError == true) {
          this.lookupdata['tabledata'] = [];
          this.lookupdata['TotalRecordCount'] = 0;
          this.lookupdata['nextLink'] = '';
        }
      }, error => {
        this.lookupdata['isLoader'] = false;
        this.lookupdata['otherDbData']['isLoader'] = false;
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
      model: 'Campaign',
      route: this.router.url
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => { this.IdentifyAppendFunc[controlName](data) });
      }
    }
  }
  getCommonData() {
    return { guid: '', isProspect: '' }
  }
  IdentifyAppendFunc = {
    'AccountSearch': (data) => { this.selectedAccc = [], this.acclist = [], this.appendConversation(data, 0); }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AccountSearch': { return (this.selectedAccc.length > 0) ? this.selectedAccc : [] }
    }
  }
  /**************************************************Advance search popup ends*********************************************************/
  get f() {
    return this.campaignDetailsForm.controls;
  }
  get c() {
    return this.channelDetailsForm.controls;
  }
  allCampaigns() {
    this.isLoading = true;
    this.campaignService.getCampaignDetails(this.sessionStorageObject['requestCampaign']['Id']).subscribe(res => {
      if (res.IsError === false) {
        console.log(JSON.stringify(res));
        this.isLoading = false;
        this.getCampaignDetails = res.ResponseObject;
        this.allCampaignPatchValues(res.ResponseObject);
      } else {
        this.PopUp.throwError(res.Message);
      }
    })
  }
  completedCampaignValue() {
    this.campaignDetailsForm.disable();
    this.channelDetailsForm.disable();
    this.campaignDetailsForm.clearValidators();
    this.channelDetailsForm.clearValidators();
    this.campaignDetailsForm.updateValueAndValidity();
    this.channelDetailsForm.updateValueAndValidity();
  }

  JSONDATA() {
    return {
      "Id": (this.sessionStorageObject['requestCampaign']) ? this.sessionStorageObject['requestCampaign']['Id'] : '',
      "Name": (this.campaignDetailsForm.value.Name != '') ? this.campaignDetailsForm.value.Name : '',
      "Activity": (this.channelDetailsForm.value.Activity != '') ? { "Guid": this.channelDetailsForm.value.Activity } : '',
      "Purpose": (this.channelDetailsForm.value.Purpose != '') ? { "Id": Number(this.channelDetailsForm.value.Purpose) } : '',
      "Description": (this.campaignDetailsForm.value.Description != '') ? this.campaignDetailsForm.value.Description : '',
      "SubActivity": (this.channelDetailsForm.value.Subactivity != '') ? { "Guid": this.channelDetailsForm.value.Subactivity } : '',
      "Vertical": (this.getVerticleId != '' && this.verticleName != '') ? { "Code": this.getVerticleId, "Name": this.verticleName } : '',
      "Intrest": (this.sendInterest.length > 0) ? this.sendInterest : [],
      "Accounts": (this.selectedAccc) ? this.selectedAccc : '',
      "SBU": (this.getSBUId != '' && this.sbuName != '') ? { "Code": this.getSBUId, "Name": this.sbuName } : '',
      "Platform": (this.channelDetailsForm.value.Platform != '') ? { "Id": Number(this.channelDetailsForm.value.Platform) } : '',
      "CampaignType": (this.channelDetailsForm.value.TypeOfCampaign != '') ? { "Id": Number(this.channelDetailsForm.value.TypeOfCampaign) } : '',
      "Channel": (this.channelDetailsForm.value.Channel) ? { "Id": Number(this.channelDetailsForm.value.Channel) } : '',
      "Industry": (this.sendIndustry != undefined) ? [this.sendIndustry] : [],
      "Function": (this.sendSelectedFunction.length > 0) ? this.sendSelectedFunction : [],
      "FunctionName": (this.functionName != '') ? this.functionName : '',
      "EndDate": (this.channelDetailsForm.value.EndDate != '') ? this.dateConversion(this.channelDetailsForm.value.EndDate) : '',
      "StartDate": (this.channelDetailsForm.value.StartDate != '') ? this.dateConversion(this.channelDetailsForm.value.StartDate) : '',
      "DeadLine": (this.channelDetailsForm.value.Deadline != '') ? this.dateConversion(this.channelDetailsForm.value.Deadline) : '',
      "CreatedOn": '',
      "fromProspectAccount": true,
      "isCampaignEdit": (this.sessionStorageObject['requestCampaign'] == '') ? false : true,
      "isAccountPopulate": false
    }
  }

  cacheData() {
    if (sessionStorage.getItem('campaignCacheData')) {
      let data = JSON.parse(this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('campaignCacheData'), 'DecryptionDecrip'));
      console.log(data);
      this.campaignDetailsForm.patchValue({
        Name: data.Name,
        SBU: data.SBU.Name,
        Vertical: data.Vertical.Name,
        Description: data.Description
      })
      this.convresationName = data.Name;
      this.campaignNameChange = data.Name;
      if (data.SBU != '') {
        this.selectedSBUValue = data.SBU.Name;
        this.sbuName = data.SBU.Name;
        this.getSBUId = data.SBU.Code;
      }
      if (data.Vertical != '') {
        this.getVerticleId = data.Vertical.Code;
        this.verticleName = data.Vertical.Name;
      }
      if (data.Accounts != '') {
        this.campaignDetailsForm.patchValue({ CompanyName: decodeURIComponent(data.Accounts[0].Name) });
        this.acclist[0] = { SysGuid: data.Accounts[0].SysGuid, LinkActionType: data.Accounts[0].LinkActionType, isExist: data.Accounts[0].isExist, isProspect: data.Accounts[0].isProspect };
        this.selectedAccc[0] = { SysGuid: data.Accounts[0].SysGuid, Name: data.Accounts[0].Name, LinkActionType: data.Accounts[0].LinkActionType, isExist: data.Accounts[0].isExist, isProspect: data.Accounts[0].isProspect };
        this.accountCompanyName = data.Accounts[0].Name;
        this.accountSysgiudConversation = data.Accounts[0].SysGuid;
        this.campaignDetailsForm.get('CompanyName').clearValidators();
        this.campaignDetailsForm.get('CompanyName').updateValueAndValidity();
        this.ConversationNameSwitch = false;
        this.campaignDetailsForm.get('CompanyName').enable();
        this.getsbuautopopulate(data.Accounts[0]);
      }

      if (data.CreateProspect) {
        this.industryAutoPopulate(data.Accounts[0].SysGuid);
      } else {
        if (data.Industry.length > 0) {
          this.channelDetailsForm.patchValue({ Industry: data.Industry[0].Name });
          data.Industry.forEach(item => {
            let json = { Guid: item.Guid, Name: item.Name, isExist: item.isExist, LinkActionType: item.LinkActionType };
            this.selectedIndustry = json;
            this.sendIndustry = json;
          });
        }
      }

      if (data.Intrest.length > 0) {
        data.Intrest.forEach(item => {
          let json = { Id: item.Id, Name: item.Name, isExist: item.isExist, LinkActionType: item.LinkActionType }
          this.selectedInterest.push(json);
          this.sendInterest.push(json);
        });
      }
      this.channelDetailsForm.patchValue({
        Activity: data.Activity.Guid,
        Subactivity: data.SubActivity.Guid,
        TypeOfCampaign: (data.CampaignType) ? (data.CampaignType.Id) ? (data.CampaignType.Id == 0) ? "" : data.CampaignType.Id : "" : "",
        Channel: (data.Channel) ? (data.Channel.Id) ? (data.Channel.Id == 0) ? "" : data.Channel.Id : "" : "",
        Platform: (data.Platform) ? (data.Platform.Id) ? (data.Platform.Id == 0) ? "" : data.Platform.Id : "" : "",
        Purpose: (data.Purpose) ? (data.Purpose.Id) ? (data.Purpose.Id == 0) ? "" : data.Purpose.Id : "" : "",
        Deadline: data.DeadLine,
        StartDate: data.StartDate,
        EndDate: data.EndDate
      })
      if (data.Activity != '') {
        this.getSubActivityDropDownList(data.Activity.Guid);
        this.channelDetailsForm.controls['Subactivity'].enable();
      } else {
        this.channelDetailsForm.controls['Subactivity'].disable();
      }

      if (data.Function.length > 0) {
        this.channelDetailsForm.patchValue({ Function: data.FunctionName });
        data.Function.forEach(item => {
          let json = { Guid: item.Guid, Name: data.FunctionName, LinkActionType: item.LinkActionType };
          let json1 = { Guid: item.Guid, isExist: true, LinkActionType: item.LinkActionType };
          this.selectedFunction[0] = json;
          this.sendSelectedFunction[0] = json1;
          this.tempFunction[0] = json1
          this.functionName = data.FunctionName;
          this.functionId = item.Guid;
        });
      }
      this.dateLessThan(data.StartDate, data.EndDate, data.DeadLine);
    }
  }

  allCampaignPatchValues(VALUES: any) {
    if (VALUES.CampaignStatus) {
      if (VALUES.CampaignStatus == "Completed") {
        this.isCompleted = true;
        this.completedCampaignValue();
        this.channelDetailsForm.updateValueAndValidity();
        this.campaignDetailsForm.updateValueAndValidity();
      } else {
        this.isCompleted = false;
      }
    }
    this.updateCampaign = true;
    this.service.isComplete = false;
    this.convresationName = VALUES['Name'];
    this.minStartDate = new Date(VALUES['CreatedOn']);
    this.campaignNameChange = VALUES['Name'];
    this.campaignDetailsForm.patchValue({
      Name: VALUES['Name'],
      SBU: VALUES['SBU']['Name'],
      Vertical: VALUES['Vertical']['Name'],
      Description: VALUES['Description']
    })
    if (VALUES.SBU.Name != undefined) {
      this.selectedSBUValue = VALUES['SBU']['Name'];
      this.sbuName = VALUES['SBU']['Name'];
      this.getSBUId = VALUES['SBU']['Id'];
    }
    if (VALUES['Vertical']['Name'] !== undefined) {
      this.getVerticleId = VALUES['Vertical']['Id'];
      this.verticleName = VALUES['Vertical']['Name'];
    }
    if (VALUES['Activity']['Guid'] == undefined) {
      this.channelDetailsForm.controls['Subactivity'].disable();
    } else {
      this.getSubActivityDropDownList(VALUES['Activity']['Guid']);
      if (this.sessionStorageObject['requestCampaign']['isCompletedCampaign'] == true || this.getCampaignDetails['CampaignStatus'] === 'Completed') {
        this.channelDetailsForm.controls['Subactivity'].disable();
      } else {
        this.channelDetailsForm.controls['Subactivity'].enable();
      }
    }
    if (VALUES['Intrest'].length > 0) {
      VALUES['Intrest'].forEach(item => {
        if (item['Code'] !== undefined && item['Name'] !== undefined) {
          let json = { Id: item['Code'], Name: item['Name'], isExist: true, LinkActionType: item['LinkActionType'] }
          this.selectedInterest.push(json);
          this.sendInterest.push(json);
        }
      });
    }
    if (VALUES['Industry'].length > 0) {
      this.channelDetailsForm.patchValue({ Industry: VALUES['Industry'][0]['Name'] })
      VALUES['Industry'].forEach(item => {
        if (item['Name'] !== undefined && item['Guid'] !== undefined && item['Name'] !== "" && item['Guid'] !== "") {
          let json = { Guid: item['Guid'], Name: item['Name'], isExist: true, LinkActionType: item['LinkActionType'] };
          this.selectedIndustry = json;
          this.sendIndustry = json;
        }
      });
    }
    if (VALUES['Function'].length > 0) {
      VALUES['Function'].forEach(item => {
        if (item['Guid'] !== undefined && item['Name'] !== undefined) {
          let json = { Guid: item['Guid'], Name: item['Name'], LinkActionType: item['LinkActionType'] };
          let json1 = { Guid: item['Guid'], isExist: true, LinkActionType: item['LinkActionType'] };
          this.selectedFunction[0] = json;
          this.sendSelectedFunction[0] = json1;
          this.tempFunction[0] = json1
          this.functionName = item['Name'];
          this.functionId = item['Guid'];
        }
      });
    }
    this.channelDetailsForm.patchValue({
      Activity: VALUES['Activity']['Guid'],
      Subactivity: VALUES['SubActivity']['Guid'],
      TypeOfCampaign: (VALUES['CampaignType']) ? (VALUES['CampaignType']['Id']) ? (VALUES['CampaignType']['Id'] == 0) ? "" : VALUES['CampaignType']['Id'] : "" : "",
      Channel: (VALUES['Channel']) ? (VALUES['Channel']['Id']) ? (VALUES['Channel']['Id'] == 0) ? "" : VALUES['Channel']['Id'] : "" : "",
      Platform: (VALUES['Platform']) ? (VALUES['Platform']['Id']) ? (VALUES['Platform']['Id'] == 0) ? "" : VALUES['Platform']['Id'] : "" : "",
      Purpose: (VALUES['Purpose']) ? (VALUES['Purpose']['Id']) ? (VALUES['Purpose']['Id'] == 0) ? "" : VALUES['Purpose']['Id'] : "" : "",
      Deadline: VALUES['DeadLine'],
      StartDate: VALUES['StartDate'],
      EndDate: VALUES['EndDate']
    })
    // this.campaignService.ValidateAccount(VALUES['Accounts'][0]['SysGuid'], VALUES['Accounts'][0]['isProspect'], 2).subscribe(res => {
    //   if (res.IsError == true) {
    //     debugger
    //     this.accountValidation = true;
    //     this.accountSysgiudConversation = '';
    //     this.campaignDetailsForm.patchValue({ CompanyName: "" });
    //     this.acc.nativeElement.value = '';
    //   } else {
    this.accountValidation = false;
    if (VALUES['Accounts'].length > 0) {
      VALUES['Accounts'].forEach(item => {
        if (item['SysGuid'] !== undefined && item['Name'] !== undefined) {
          let json = { SysGuid: item['SysGuid'], Name: item['Name'], "LinkActionType": item['LinkActionType'], isProspect: item['isProspect'] };
          var object = { "SysGuid": item['SysGuid'], "isExist": true, "LinkActionType": item['LinkActionType'], isProspect: item['isProspect'], Id: item['SysGuid'] };
          this.acclist[0] = (object);
          this.selectedAccc[0] = (json);
        }
      })
      this.accountCompanyName = decodeURIComponent(VALUES['Accounts'][0]['Name']);
      this.campaignDetailsForm.patchValue({ CompanyName: decodeURIComponent(VALUES['Accounts'][0]['Name']) });
      this.accountSysgiudConversation = VALUES['Accounts'][0]['SysGuid'];
      this.campaignDetailsForm.get('CompanyName').clearValidators();
      this.campaignDetailsForm.get('CompanyName').updateValueAndValidity();
      this.ConversationSBUNameSwitch = false;
    }
    //   }
    // }, error => {
    //   this.accountSysgiudConversation = '';
    //   this.campaignDetailsForm.patchValue({ CompanyName: "" });
    //   this.acc.nativeElement.value = '';
    // })
    this.dateLessThan(VALUES['StartDate'], VALUES['EndDate'], VALUES['DeadLine']);
    this.channelDetailsForm.updateValueAndValidity();
    this.campaignDetailsForm.updateValueAndValidity();
  }
  nav() {
    sessionStorage.removeItem('campaignCacheData');
    if (sessionStorage.getItem('leadRoute')) {
      let leadRoute = JSON.parse(sessionStorage.getItem('leadRoute'));
      this.router.navigate([CampaignNav[leadRoute]]);
    } else if (this.routepath != null) {
      this.router.navigate([this.routepath]);
    } else if (sessionStorage.getItem('navigation')) {
      let routeId = JSON.parse(sessionStorage.getItem('navigation'));
      this.router.navigate([CampaignNav[routeId]]);
    }
  }
  selectActivityChange(event) {
    if (event.target.value === "") {
      this.channelDetailsForm.patchValue({ Subactivity: "" })
      this.channelDetailsForm.controls['Subactivity'].disable();
      this.channelDetailsForm.get('Subactivity').markAsUntouched();
    } else if (event.target.value === "undefined") {
      this.channelDetailsForm.patchValue({ Subactivity: "undefined" });
      this.channelDetailsForm.controls['Subactivity'].disable();
    } else {
      this.getSubActivityDropDownList(event.target.value);
      this.channelDetailsForm.controls['Subactivity'].enable();
    }
    this.subActDisabled = false;

  }
  selectActivityMatChange(event) {
    this.activity.filter(val => {
      if (val.Guid === event.value) {
        this.activityName = val.Name;
      }
    })
    if (event.value === "") {
      this.channelDetailsForm.patchValue({ Subactivity: "" });
      this.channelDetailsForm.controls['Subactivity'].disable();
      this.channelDetailsForm.get('Subactivity').markAsUntouched();
    } else if (event.value === "undefined") {
      this.channelDetailsForm.patchValue({ Subactivity: "undefined" });
      this.channelDetailsForm.controls['Subactivity'].disable();
    } else {
      this.getSubActivityDropDownList(event.value);
      this.channelDetailsForm.controls['Subactivity'].enable();
    }
    this.subActDisabled = false;
  }
  industryAutoPopulate(Guid) {
    this.campaignService.AutoPopulateIndustryByAccount(Guid).subscribe(res => {
      console.log(res)
      if (res.ResponseObject.length > 0) {
        let item = res.ResponseObject[0];
        if (item['Guid'] != '' && item['Name'] != '') {
          this.channelDetailsForm.patchValue({ Industry: item['Name'] });
          let json = { Guid: item['Guid'], Name: item['Name'], isExist: false, LinkActionType: 1 };
          this.sendIndustry = json;
        } else {
          this.channelDetailsForm.patchValue({ Industry: '' });
          this.sendIndustry = undefined;
        }
      }
    })
  }
  stepone() {
    this.leadinfo = true;
    this.dealinfo = false;
    this.twoactive = false;
    this.service.windowScroll();
  }
  steptwo() {
    if (this.campaignNameChange.trim() == "") {
      this.campaignDetailsForm.patchValue({ Name: "" });
      this.campaignNameValidator();
    }
    if (this.campaignDetailsForm.controls['SBU']['status'] == "DISABLED") {
      if (this.campaignDetailsForm.controls['SBU']['value'] == '')
        this.sbuclearnupdate();
    }
    if (this.campaignDetailsForm.controls['Vertical']['status'] == "DISABLED") {
      if (this.campaignDetailsForm.controls['Vertical']['value'] == '')
        this.verticleclearnupdate();
    }
    console.log(this.campaignDetailsForm);
    if (this.sessionStorageObject['requestCampaign'] != '' && this.getCampaignDetails != undefined) {
      if (this.sessionStorageObject['requestCampaign']['isCompletedCampaign'] == true || this.getCampaignDetails['CampaignStatus'] === 'Completed') {
        this.completedCampaignValue();
        this.leadinfo = false;
        this.dealinfo = true;
      } else {
        if (this.campaignDetailsForm.valid) {
          this.leadinfo = false;
          this.dealinfo = true;
          this.service.windowScroll();
        } else {
          this.service.validateAllFormFields(this.campaignDetailsForm);
        }
        if (this.campaignDetailsForm.valid == false) {
          this.service.validateAllFormFields(this.campaignDetailsForm);
          let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
          if (invalidElements.length) {
            this.scrollTo(invalidElements[0]);
            this.service.validationErrorMessage();
          }
          return;
        }
      }
    } else {
      if (this.campaignDetailsForm.valid) {
        this.leadinfo = false;
        this.dealinfo = true;
        this.service.windowScroll();
      } else {
        this.service.validateAllFormFields(this.campaignDetailsForm);
      }
      if (this.campaignDetailsForm.valid == false) {
        this.service.validateAllFormFields(this.campaignDetailsForm);
        let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
        if (invalidElements.length) {
          this.scrollTo(invalidElements[0]);
          this.service.validationErrorMessage();
        }
        return;
      }
    }
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopComponent, {
      width: '400px',
      data: this.routepath
    });
  }
  getsbuautopopulate(item) {
    let SbuReqParam = { Guid: item['SysGuid'], isProspect: item['isProspect'] };
    this.myOpenLeadService.GetSbuAccountdata(SbuReqParam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          if (res.ResponseObject.length == 1) {
            this.campaignDetailsForm.patchValue({
              SBU: res.ResponseObject[0]['Name'],
            })
            this.sbuName = res.ResponseObject[0]['Name'];
            if (res.ResponseObject[0]['Vertical']['Name'] && res.ResponseObject[0]['Vertical']['Id']) {
              this.campaignDetailsForm.patchValue({
                Vertical: res.ResponseObject[0]['Vertical']['Name']
              })
              this.verticleName = res.ResponseObject[0]['Vertical']['Name'];
              this.getVerticleId = res.ResponseObject[0]['Vertical']['Id'];
            }
            this.getSBUId = res.ResponseObject[0]['Id'];
            this.sbuclearnupdate();
            this.verticleclearnupdate();
          }
        }
      } else {
        this.PopUp.throwError(res.Message);
      }
    })
  }
  ConversationNameclose() {
    this.ConversationNameSwitch = false;
    if (this.accountSysgiudConversation == '') {
      this.campaignDetailsForm.patchValue({ CompanyName: "" });
    }
    if (this.accountCompanyName != this.campaignDetailsForm.value.CompanyName) {
      this.campaignDetailsForm.patchValue({ CompanyName: this.accountCompanyName });
    }
  }
  appendConversation(item, i) {
    if (i > this.searchAccountCompany.length) {
      this.openadvancetabs('AccountSearch', this.searchAccountCompany, this.campaignDetailsForm.get('CompanyName').value);
    } else {
      // this.campaignService.ValidateAccount(item['SysGuid'], item['isProspect'], 2).subscribe(res => {
      //   if (res.IsError == true) {
      //     this.accountValidation = true;
      //     this.accountSysgiudConversation = '';
      //     this.campaignDetailsForm.patchValue({ CompanyName: "" });
      //     this.acc.nativeElement.value = '';
      //   } else {
      this.accountValidation = false;
      this.accountSysgiudConversation = item['SysGuid'];
      console.log(this.accountSysgiudConversation);
      let json = { SysGuid: item['SysGuid'], Name: item['Name'], "LinkActionType": 1, isProspect: item['isProspect'], Id: item['SysGuid'] };
      var object = { "SysGuid": item['SysGuid'], "isExist": false, "LinkActionType": 1, isProspect: item['isProspect'] };
      this.selectedAccc[0] = json;
      this.acclist[0] = object;
      this.accountCompanyName = decodeURIComponent(item['Name']);
      this.campaignDetailsForm.patchValue({ CompanyName: decodeURIComponent(item['Name']) });
      this.industryAutoPopulate(item['SysGuid']);
      this.searchVerticleData = [];
      this.searchSBUData = [];
      this.clearSBU();
      this.getsbuautopopulate(item);
      //   }
      // }, error => {
      //   this.searchAccountCompany = [];
      //   this.accountSysgiudConversation = '';
      //   this.campaignDetailsForm.patchValue({ CompanyName: "" });
      //   this.acc.nativeElement.value = '';
      // })
    }
    this.ConversationNameSwitch = false;
  }
  clearAccountName() {
    this.campaignDetailsForm.patchValue({
      CompanyName: "",
      SBU: "",
      Vertical: ""
    });
    this.accountCompanyName = '';
    this.accountSysgiudConversation = '';
    this.getVerticleId = '';
    this.getSBUId = '';
    this.verticleName = '';
    this.sbuName = '';
    this.acclist = []
    this.selectedAccc = [];
  }
  ConversationSBUNameclose() {
    this.ConversationSBUNameSwitch = false;
    if (this.getSBUId === '') {
      this.campaignDetailsForm.patchValue({ SBU: '' });
    }
    if (this.sbuName != this.campaignDetailsForm.value.SBU) {
      this.campaignDetailsForm.patchValue({ SBU: this.sbuName });
    }
  }
  appendSBUConversation(item) {
    this.selectedSBUValue = item;
    this.sbuName = item['Name'];
    this.campaignDetailsForm.patchValue({ SBU: item['Name'] });
    this.ConversationSBUNameSwitch = false;
    if (this.getSBUId != item['Id']) {
      this.campaignDetailsForm.controls['Vertical'].patchValue('');
    }
    this.getSBUId = item['Id'];
    let verticalSearchreqBody = {
      SearchText: "",
      Guid: this.selectedAccc[0]['SysGuid'],
      SBUGuid: this.getSBUId,
      isProspect: this.selectedAccc[0]['isProspect'],
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    this.contactLeadService.getsearchVerticalBySbu(verticalSearchreqBody).subscribe(res => {
      this.isVerticalSearchLoading = false;
      if (res.IsError === false) {
        if (res.ResponseObject.length > 0) {
          if (res.ResponseObject.length === 1) {
            this.searchVerticleData = res.ResponseObject;
            this.campaignDetailsForm.controls['Vertical'].patchValue(res.ResponseObject[0]['Name']);
            this.getVerticleId = res.ResponseObject[0]['Id'];
            this.verticleName = res.ResponseObject[0]['Name'];
            this.campaignDetailsForm.controls['Vertical'].enable();
          } else {
            this.campaignDetailsForm.controls['Vertical'].enable();
            this.verticlevalidator();
          }
        }
      } else {
        this.PopUp.throwError(res.Message);
        this.searchVerticleData = [];
      }
    }, error => {
      this.isVerticalSearchLoading = false;
      this.searchVerticleData = [];
    })
  }
  clearSBU() {
    this.campaignDetailsForm.patchValue({
      SBU: "",
      Vertical: ""
    });
    this.getVerticleId = '';
    this.verticleName = ''
    this.getSBUId = '';
    this.sbuName = '';
    this.sbuvalidator();
  }
  ConversationVerticalNameclose() {
    this.ConversationVerticalNameSwitch = false;
    if (this.getVerticleId === '') {
      this.campaignDetailsForm.patchValue({ Vertical: '' });
    }
    if (this.verticleName != this.campaignDetailsForm.value.Vertical) {
      this.campaignDetailsForm.patchValue({ Vertical: this.verticleName });
    }
  }
  appendVerticalConversation(item) {
    this.campaignDetailsForm.patchValue({ Vertical: item['Name'] });
    this.verticalValidation = false;
    this.ConversationVerticalNameSwitch = false;
    this.getVerticleId = item['Id'];
    this.verticleName = item['Name'];
  }
  clearVertical() {
    this.campaignDetailsForm.patchValue({
      Vertical: ""
    });
    this.getVerticleId = '';
    this.verticleName = '';
    this.verticlevalidator();
  }
  InterestNameclose() {
    this.InterestNameSwitch = false;
    this.campaignDetailsForm.patchValue({ Interest: "" });
  }
  appendInterest(item: any) {
    let json = { Id: item['Id'], Name: item['Name'], isExist: false, LinkActionType: 1 };
    this.selectedInterest.push(json);
    let beforeLength = this.selectedInterest.length;
    this.selectedInterest = this.service.removeDuplicates(this.selectedInterest, "Id");
    let afterLength = this.selectedInterest.length;
    if (beforeLength === afterLength) {
      this.sendInterest.push(json);
      this.campaignDetailsForm.patchValue({ Interest: "", });
    } else {
      this.PopUp.throwError("Selected interest already exists");
    }
    this.InterestNameSwitch = false;
    this.interestChange = true;
    this.campaignDetailsForm.patchValue({ Interest: "" });
  }
  FunctionNameclose() {
    this.FunctionNameSwitch = false;
    if (this.functionName != "") {
      this.channelDetailsForm.patchValue({ Function: this.functionName });
    } else {
      this.channelDetailsForm.patchValue({ Function: "" });
    }
  }
  appendFunction(item: any) {
    let json = { Guid: item['Guid'], Name: item['Name'], LinkActionType: 1 };
    this.functionName = item['Name'];
    this.functionId = item['Guid'];
    this.selectedFunction[0] = json;
    let beforeLength = this.selectedFunction.length;
    this.selectedFunction = this.service.removeDuplicates(this.selectedFunction, "Guid");
    let afterLength = this.selectedFunction.length;
    if (beforeLength === afterLength) {
      let json1 = { Guid: item['Guid'], isExist: false, LinkActionType: 1 };
      this.sendSelectedFunction[0] = json1;
    } else {
      this.PopUp.throwError("Selected function already exists");
    }
    this.FunctionNameSwitch = false;
    this.channelDetailsForm.patchValue({ Function: "" });
    if (this.sendSelectedFunction.length > 0 && this.tempFunction.length > 0) {
      if (this.sendSelectedFunction[0].Guid !== this.tempFunction[0].Guid) {
        this.tempFunction[0].LinkActionType = 3;
      }
      if (this.sendSelectedFunction[0].Guid === this.tempFunction[0].Guid) {
        this.tempFunction[0].LinkActionType = 2;
      }
    }
  }
  clearFunction(item) {
    this.functionName = "";
    this.functionId = "";
    this.channelDetailsForm.patchValue({ Function: "" });
    if (JSON.parse(sessionStorage.getItem("RequestCampaign"))) {
      if (this.sessionStorageObject['requestCampaign']['isAccountPopulate'] == false) {
        if (this.sessionStorageObject['requestCampaign']['isCampaignEdit']) {
          console.log(item);
          if (this.tempFunction.length > 0) {
            if (item == this.tempFunction[0].Guid) {
              this.sendSelectedFunction = [];
              this.tempFunction[0].LinkActionType = 3;
            }
          }
        }
      } else {
        console.log(item);
        this.sendSelectedFunction = [];
      }
    } else {
      console.log(item);
      this.sendSelectedFunction = [];
    }
  }
  dateConversion(dateConvert) {
    var dateToConvert = new Date(dateConvert);
    var getMmonth = (dateToConvert.getMonth() + 1) < 10 ? ("0" + (dateToConvert.getMonth() + 1)) : (dateToConvert.getMonth() + 1);
    var getDate = dateToConvert.getDate() < 10 ? "0" + dateToConvert.getDate() : dateToConvert.getDate();
    var convertedDate = dateToConvert.getFullYear() + '-' + getMmonth + '-' + getDate;
    var timeToConvert = new Date(dateToConvert);
    var getHours = timeToConvert.getHours() < 10 ? "0" + timeToConvert.getHours() : timeToConvert.getHours();
    var getMinutes = timeToConvert.getMinutes() < 10 ? "0" + timeToConvert.getMinutes() : timeToConvert.getMinutes();
    var getStartTime = getHours + ':' + getMinutes + ':' + "00";
    var finalModifiedDate = convertedDate + 'T' + getStartTime + '.000Z';
    return finalModifiedDate;
  }
  finalRequestCampaign() {
    if (this.sessionStorageObject['requestCampaign']['isCampaignEdit']) {
      this.editCampaign();
    } else {
      this.requestCampaign();
    }
    if (this.getCampaignDetails != undefined) {
      if (this.getCampaignDetails['CampaignStatus'] !== 'Completed') {
        if (this.channelDetailsForm.valid === false) {
          this.service.validateAllFormFields(this.channelDetailsForm);
          this.saveClicked = false;
          let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
          if (invalidElements.length) {
            this.scrollTo(invalidElements[0]);
            this.service.validationErrorMessage();
          }
          return;
        }
      }
    }
  }
  requestCampaign() {
    if (this.channelDetailsForm.valid === true) {
      this.saveClicked = true;
      this.isLoading = true;
      var requstObjct = {
        "Name": this.campaignNameChange.trim(),
        "Activity": { "Guid": this.channelDetailsForm.value.Activity },
        "Purpose": { "Id": +this.channelDetailsForm.value.Purpose },
        "Description": this.campaignDetailsForm.value.Description,
        "SubActivity": { "Guid": this.channelDetailsForm.value.Subactivity },
        "Vertical": { "Code": this.getVerticleId },
        "Intrest": (this.sendInterest.length > 0) ? this.sendInterest : [{ "Id": "", "Name": "", "isExist": "", "LinkActionType": "" }],
        "Accounts": this.acclist,
        "SBU": { "Code": this.getSBUId },
        "Platform": { "Id": +(this.channelDetailsForm.value.Platform) },
        "CampaignType": { "Id": +this.channelDetailsForm.value.TypeOfCampaign },
        "Channel": { "Id": +this.channelDetailsForm.value.Channel },
        "Industry": (this.sendIndustry != undefined || this.sendIndustry != null) ? [this.sendIndustry] : [{ "Guid": "" }],
        "Function": this.sendSelectedFunction,
        "EndDate": this.dateConversion(this.channelDetailsForm.value.EndDate),
        "StartDate": this.dateConversion(this.channelDetailsForm.value.StartDate),
        "DeadLine": this.dateConversion(this.channelDetailsForm.value.Deadline)
      }
      this.campaignService.requestCampaign(requstObjct).subscribe(async (res) => {
        if (res.IsError === false) {
          this.successMessage = res.Message;
          setTimeout(() => {
            this.isLoading = false;
            this.opencreate()
          }, 1000);
          if (sessionStorage.getItem("TempEditLeadDetails")) {
            let data = JSON.parse(sessionStorage.getItem("TempEditLeadDetails"));
            data.Campaign.push({ Id: res.ResponseObject.Id, Name: res.ResponseObject.Name });
            let campaignchanges = this.service.removeDuplicates(data.Campaign, "Id");
            let changes = { Campaign: campaignchanges };
            sessionStorage.setItem("TempEditLeadDetails", JSON.stringify(data));
            let updateleadCampaign: Update<any> = { id: data.id, changes };
            this.store.dispatch(new UpdateLeadCampaign({ updateleadCampaign }));
          }
          this.store.dispatch(new ClearCampaign());
          sessionStorage.removeItem('CreateActivityGroup');
          sessionStorage.removeItem('campaignCacheData');
        }
        if (res.IsError === true) {
          this.saveClicked = false;
          this.isLoading = false;
          if (res.status === 403) {
            this.isLoading = false;
            this.PopUp.throwError(res.Message);
            this.isLoading = false;
          } else {
            this.PopUp.throwError(res.Message);
          }
        }
      }, error => {
        this.isLoading = false;
        this.saveClicked = false;
      })
    } else {
      if (this.getCampaignDetails != undefined) {
        if (this.getCampaignDetails['CampaignStatus'] == 'Completed') {
          return;
        }
      } else {
        this.service.validateAllFormFields(this.channelDetailsForm);
        let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
        if (invalidElements.length) {
          this.scrollTo(invalidElements[0]);
          this.service.validationErrorMessage();
        }
      }
      return;
    }
  }
  editCampaign() {
    if (this.channelDetailsForm.valid) {
      this.saveClicked = true;
      this.isLoading = true;
      if (this.sendSelectedFunction.length > 0 && this.tempFunction.length > 0) {
        if (this.sendSelectedFunction[0].Guid === this.tempFunction[0].Guid) {
          this.sendSelectedFunction[0].LinkActionType = 2;
        } else {
          this.sendSelectedFunction = this.sendSelectedFunction.concat(this.tempFunction);
        }
      } else {
        this.sendSelectedFunction = this.sendSelectedFunction.concat(this.tempFunction);
      }
      var value = {
        "Id": this.sessionStorageObject['requestCampaign']['Id'],
        "Name": this.campaignNameChange.trim(),
        "Activity": { "Guid": this.channelDetailsForm.value.Activity },
        "Purpose": { "Id": +this.channelDetailsForm.value.Purpose },
        "Description": this.campaignDetailsForm.value.Description,
        "SubActivity": { "Guid": this.channelDetailsForm.value.Subactivity },
        "Vertical": { "Code": this.getVerticleId },
        "Intrest": (this.sendInterest.length > 0) ? this.sendInterest : [{ "Id": "", "Name": "", "isExist": "" }],
        "Accounts": this.acclist,
        "SBU": { "Code": this.getSBUId },
        "Platform": { "Id": +(this.channelDetailsForm.value.Platform) },
        "CampaignType": { "Id": +this.channelDetailsForm.value.TypeOfCampaign },
        "Channel": { "Id": +this.channelDetailsForm.value.Channel },
        "Industry": (this.sendIndustry != undefined || this.sendIndustry != null) ? [this.sendIndustry] : [{ "Guid": "" }],
        "Function": this.sendSelectedFunction,
        "EndDate": this.dateConversion(this.channelDetailsForm.value.EndDate),
        "StartDate": this.dateConversion(this.channelDetailsForm.value.StartDate),
        "DeadLine": this.dateConversion(this.channelDetailsForm.value.Deadline)
      }
      this.campaignService.updateCampaign(value).subscribe(async res => {
        if (res.IsError === false) {
          const changes = res.ResponseObject;
          const AllCampaignModel: Update<CampaignList> = { id: res.ResponseObject.Id, changes };
          this.store.dispatch(new EditAllCampaign({ EditCampaignModel: AllCampaignModel }));
          this.store.dispatch(new EditActiveCampaign({ EditActiveCampaignModel: AllCampaignModel }));
          this.successMessage = res.Message;
          setTimeout(() => {
            this.isLoading = false;
            this.opencreate();
          }, 1000);
          this.updateCampaign = true;
          sessionStorage.removeItem('CreateActivityGroup');
          sessionStorage.removeItem('campaignCacheData');
        }
        if (res.IsError === true) {
          this.saveClicked = false;
          this.isLoading = false;
          if (res.status === 403) {
            this.isLoading = false;
            this.PopUp.throwError(res.Message);
          } else {
            this.PopUp.throwError(res.Message);
          }
        }
      }, error => {
        this.isLoading = false;
        this.saveClicked = false;
      })
    } else {
      if (this.getCampaignDetails != undefined) {
        if (this.getCampaignDetails['CampaignStatus'] == 'Completed') {
          return;
        }
      } else {
        this.service.validateAllFormFields(this.channelDetailsForm);
        let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
        if (invalidElements.length) {
          this.scrollTo(invalidElements[0]);
          this.service.validationErrorMessage();
        }
      }
      return;
    }
  }
  //-----shiva ts file--------
  accDelinkCheck() {
    this.campaignDetailsForm.get('CompanyName').enable();
    this.accountvalidator();
    this.campaignDetailsForm.get('SBU').disable();
    this.campaignDetailsForm.get('SBU').patchValue('');
    this.sbuvalidator();
    this.campaignDetailsForm.get('Vertical').disable();
    this.campaignDetailsForm.get('Vertical').patchValue('');
    this.verticlevalidator();
  }
  delinkAcc(MapGuid, i) {
    if (MapGuid.LinkActionType === 1) {
      this.selectedAccc = this.selectedAccc.filter(res => res.SysGuid !== MapGuid.SysGuid);
      this.acclist = this.acclist.filter(res => res.SysGuid !== MapGuid.SysGuid);
      if (this.selectedAccc.length === 0) {
        this.accDelinkCheck();
      } else {
      }
      return
    }
    if (MapGuid.LinkActionType === 2) {
      this.selectedAccc = this.selectedAccc.filter(res => res.SysGuid !== MapGuid.SysGuid);
      this.acclist[i].LinkActionType = 3;
      if (this.selectedAccc.length === 0) {
        this.accDelinkCheck();
      }
      return
    }
  }
  delinkIntrest(id, i) {
    if (id.LinkActionType === 1) {
      this.selectedInterest = this.selectedInterest.filter(res => res.Id !== id.Id);
      this.sendInterest = this.sendInterest.filter(res => res.Id !== id.Id);
      return
    }
    if (id.LinkActionType === 2) {
      this.selectedInterest = this.selectedInterest.filter(res => res.Id !== id.Id);
      this.sendInterest[i].LinkActionType = 3;
      return
    }
  }
  delinkFunction(id, i) {
    if (id.LinkActionType === 1) {
      this.selectedFunction = this.selectedFunction.filter(res => res.Guid !== id.Guid);
      this.sendSelectedFunction = this.sendSelectedFunction.filter(res => res.Guid !== id.Guid);
      return
    }
    if (id.LinkActionType === 2) {
      this.selectedFunction = this.selectedFunction.filter(res => res.Guid !== id.Guid);
      this.sendSelectedFunction[i].LinkActionType = 3;
      return
    }
  }
  //-----shiva--------
  opencreate() {
    if (this.channelDetailsForm.valid === true) {
      const dialogRef = this.dialog.open(createpopComponent,
        {
          disableClose: true,
          width: '396px',
        });
      dialogRef.componentInstance.data = this.campaignNameChange.trim();
      dialogRef.componentInstance.updatedCampaign = this.updateCampaign;
      dialogRef.componentInstance.okClickedinPopUp = this.okClickedinPopUp;
      dialogRef.componentInstance.successMessage = this.successMessage;
      dialogRef.afterClosed().subscribe(data => {
        this.okClickedinPopUp = data;
        // this.PopUp.throwError(this.successMessage);
      })
    }
  }
}
@Component({
  selector: 'create-pop',
  templateUrl: './create-pop.html',
})
export class createpopComponent {
  data: any;
  updatedCampaign: any;
  okClickedinPopUp: boolean = false;
  successMessage: any;
  constructor(
    private router: Router,
    private PopUp: ErrorMessage,
    private dialogRef: MatDialogRef<createpopComponent>, ) { }
  ngOnInit() { }
  navTo() {
    if (sessionStorage.getItem('TempEditLeadDetails')) {
      this.router.navigate(['/leads/leadDetails/leadDetailsInfo']);
    } else {
      this.router.navigateByUrl('/campaign/ActiveCampaigns');
    }
    this.dialogRef.close();
  }
  navToOk() {
    this.okClickedinPopUp = true;
    this.PopUp.onSuccessMessage(this.successMessage).afterDismissed().subscribe(() => {
      if (sessionStorage.getItem('TempEditLeadDetails')) {
        this.router.navigate(['/leads/leadDetails/leadDetailsInfo']);
      } else {
        this.router.navigateByUrl('/campaign/ActiveCampaigns');
      }
    })
    this.dialogRef.close(true);
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
})
export class cancelpopComponent {
  constructor(public dialogRef: MatDialogRef<cancelpopComponent>, @Inject(MAT_DIALOG_DATA) public data, public router: Router, private routingState: RoutingState) { }
  clocsecancel(event) {
    sessionStorage.removeItem('CreateActivityGroup');
    sessionStorage.removeItem('campaignCacheData');
    if (sessionStorage.getItem('leadRoute')) {
      let leadRoute = JSON.parse(sessionStorage.getItem('leadRoute'));
      this.router.navigate([CampaignNav[leadRoute]]);
      this.dialogRef.close();
    } else {
      if (this.data != null) {
        this.router.navigate([this.data]);
        this.dialogRef.close();
      } else if (sessionStorage.getItem('navigation')) {
        let routeId = JSON.parse(sessionStorage.getItem('navigation'));
        this.router.navigate([CampaignNav[routeId]]);
        this.dialogRef.close();
      }
    }
  }
}