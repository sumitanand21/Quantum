import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ContactService, OfflineService, routes, ErrorMessage, CampaignService, ConversationService, contactAdvnHeaders, contactAdvnNames } from '@app/core/services';
import { MasterApiService } from '@app/core/services/master-api.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ClearContactList } from '@app/core/state/actions/contact.action';
import { removeSpaces, checkLimit, specialCharacter, leadDecimalDealValue } from '@app/shared/pipes/white-space.validator';
import { RoutingState } from '@app/core/services/navigation.service';
import { HttpClientModule } from '@angular/common/http';
import { MeetingService } from '@app/core/services/meeting.service';
import { ClearTaskList } from '@app/core/state/actions/home.action';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { AutoSaveServiceClass } from '@app/shared/services/autoSave.service';
import { ActivityService, activityAdvnNames, activityAdvnHeaders } from '@app/core/services/activity.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import { AccountListService } from '@app/core/services/accountList.service';
import { FileUploadService } from '@app/core/services/file-upload.service';
export interface Meeting {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit, OnDestroy {
  @ViewChild('accountlist')
  acc: ElementRef;
  AccountZunkdata: any;
  ReportingZunkdata: any;
  CBUZunkdata: any;
  CountryZunkdata: any;
  StateZunkdata: any;
  CityZunkdata: any;
  imageSrc: string = '';
  leadinfo = true;
  dealinfo = false;
  twoactive = false;
  function: any;
  functionType: any;
  phoneContactType: Array<any>;
  newCustomerContactForm1: FormGroup;
  newCustomerContactForm2: FormGroup;
  getCity: any;
  getState: any;
  getCountry: any;
  getReportingManager: any;
  getsearchCompany: any;
  getCBU: any;
  getAccountCompany: any;
  salutation: any;
  ContactReferenceType: any;
  ContactReferenceMode: any;
  relationship: any;
  categoryData: any;
  getIndustry: any;
  SelectedIndustry: any;
  SendSelectedIndustry: any;
  selectedCompany: any;
  selectedCBUId: any;
  selectedAccountName: any;
  selectedCityname: any;
  selectedStatename: any;
  selectedCountryname: any;
  selectedCity: any;
  selectedCountry: any;
  getIntrest: any;
  getReferenceType: any;
  SelectedIntrest: any;
  SelectedReferenceType: any;
  SelectedReportingManager: any;
  img = true;
  isLoading: boolean = false;
  img1 = true;
  imageSrc1: any;
  TwitterUrldata: string = '';
  LinkendUrldata: string = '';
  ngclass: boolean = false;
  profileUrl: any;
  businessCardUrl: string;
  isAccountNameSearchLoading: boolean = false;
  isReportingManagerSearchLoading: boolean = false;
  isCBUSearchLoading: boolean = false;
  isCitySearchLoading: boolean = false;
  isIndustrySearchLoading: boolean = false;
  isInterestSearchLoading: boolean = false;
  isReferenceTypeSearchLoading: boolean = false;
  isStateSearchLoading: boolean = false;
  isCountrySearchLoading: boolean = false;
  disabled: boolean = false;
  isProspect: boolean;
  arrowkeyLocation = 0;
  accountName: any;
  savePopUpShow: any;
  contactIndex = -1;
  Module: any;
  ContactGuid: any;
  sendIndustry = []
  TempCreateContactDetails: any;
  LeadCustomerAccountdata: any;
  designationErrorMessage: any;
  createcontactjsondatadummy: any;

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
  IdentifyAppendFunc = {
    'accountSearch': (data) => { this.appendAccountName(data) },
    'countrySearch': (data) => { this.appendCountryname(data) },
    'reportingSearch': (data) => { this.appendReportingManager(data) },
    'cbuSearch': (data) => { this.appendCBU(data) },
    'industrySearch': (data) => { this.appendIndustry(data) },
    'interestSearch': (data) => { this.appendIntrestName(data) },
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendToAdvanceLookup.length > 0) ? this.sendToAdvanceLookup : [] }
      case 'reportingSearch': { return (this.sendReportingToAdvanceLookup.length > 0) ? this.sendReportingToAdvanceLookup : [] }
      case 'cbuSearch': { return (this.sendCbuToAdvanceLookup.length > 0) ? this.sendCbuToAdvanceLookup : [] }
      case 'interestSearch': { return (this.sendInterestToAdvanceLookup.length > 0) ? this.sendInterestToAdvanceLookup : [] }
    }
  }

  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public contactService: ContactService,
    private masterApi: MasterApiService,
    private accountListServ: AccountListService,
    private fb: FormBuilder,
    private router: Router,
    private newconversationService: newConversationService,
    public matSnackBar: MatSnackBar,
    private offlineService: OfflineService,
    private campaignService: CampaignService,
    public errorMessage: ErrorMessage,
    public conversationService: ConversationService,
    public meetingService: MeetingService,
    private http: HttpClientModule,
    private encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    public routingState: RoutingState,
    public autoSaveService: AutoSaveServiceClass,
    private activityService: ActivityService,
    private S3MasterApiService: S3MasterApiService,
    private cacheDataService: CacheDataService,
    private fileService: FileUploadService,
  ) {
    this.CreateContactDetails();
  }

  ACCOUNTROUTING: boolean = false;
  async ngOnInit() {
    if (JSON.parse(sessionStorage.getItem("Module"))) {
      this.Module = JSON.parse(sessionStorage.getItem("Module"))
    }
    this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
      localStorage.setItem('dNBToken', res.ResponseObject.access_token)
    });
    this.marketingInformation();
    this.getMasterDatas();
    this.imageSrc = null;
    this.imageSrc1 = null;
    this.autoSaveForm();

    //Fatching Account name from Account module (FSD 3)
    if (sessionStorage.getItem('selAccountObj') !== null) {
      let accountInfo = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"))
      console.log('account details from Account FSD3', accountInfo)
      // this.contactService.getValidAccount(accountInfo.SysGuid, accountInfo.isProspect, 3).subscribe(res => {
      //   if (res.IsError) {
      //     this.errorMessage.throwError(res.Message);
      //     this.selectedAccountName = undefined;
      //     this.newCustomerContactForm1.patchValue({ accountName: "" })
      //   } else {
      this.newCustomerContactForm1.patchValue({
        // accountName: this.getSymbol(accountInfo.Name)
        accountName: this.accountListServ.getSymbol(accountInfo.Name)
      });
      this.ACCOUNTROUTING = true
      // if (accountInfo.isProspect == false) {
      //   this.industryAutoPopulate(accountInfo.SysGuid);
      // }
      this.industryAutoPopulate(accountInfo.SysGuid);
      this.newCustomerContactForm1.controls['CBU'].enable();
      this.newCustomerContactForm1.controls['reportingManager'].enable();
      this.selectedAccountName = accountInfo.SysGuid
      this.isProspect = accountInfo.isProspect
      this.ngclass = false;
      this.disabled = true
      //   }
      // }, error => {
      //   this.getAccountCompany = []
      //   this.selectedAccountName = undefined;
      //   this.newCustomerContactForm1.patchValue({ accountName: "" });
      //   this.acc.nativeElement.value = ''
      // });
    } else {
      this.ACCOUNTROUTING = false
    }
    //Fatching Account name from Prospect account
    var accountObj = (JSON.parse(sessionStorage.getItem('CreateActivityGroup')))
    console.log("Account name from Prospect", accountObj);
    if (accountObj) {
      this.newCustomerContactForm1.patchValue({
        accountName: this.getSymbol(accountObj.account.Name)
      });
      // if (accountObj.isProspect == false) {
      //   this.industryAutoPopulate(accountObj.SysGuid);
      // }
      this.industryAutoPopulate(accountObj.SysGuid);
      this.selectedAccountName = accountObj.account.SysGuid;
      this.isProspect = accountObj.account.isProspect;
    }
    //Fatching Account name from create lead
    this.LeadCustomerAccountdata = sessionStorage.getItem('AccountDetailsFromCreateLead');
    if (this.LeadCustomerAccountdata !== null) {
      console.log("Lead Customer Account name", this.LeadCustomerAccountdata);
      let accountInfo = JSON.parse(sessionStorage.getItem('AccountDetailsFromCreateLead'))
      // this.contactService.getValidAccount(accountInfo.SysGuid, accountInfo.isProspect, 3).subscribe(res => {
      //   if (res.IsError) {
      //     this.errorMessage.throwError(res.Message);
      //     this.selectedAccountName = undefined;
      //     this.newCustomerContactForm1.patchValue({ accountName: "" })
      //   } else {
      this.newCustomerContactForm1.patchValue({
        accountName: this.getSymbol(accountInfo.Name)
      })
      // if (accountInfo.isProspect == false) {
      //   this.industryAutoPopulate(accountInfo.SysGuid);
      // }
      this.industryAutoPopulate(accountInfo.SysGuid);
      this.selectedAccountName = accountInfo.SysGuid
      this.isProspect = accountInfo.isProspect
      this.disabled = true
      //   }
      // });
    }

    this.createcontactjsondatadummy = JSON.parse(sessionStorage.getItem('CreateContactJsondata'));
    console.log("json data", this.createcontactjsondatadummy);
    if (this.createcontactjsondatadummy) {
      this.newCustomerContactForm1.patchValue({
        salutation: this.createcontactjsondatadummy.Salutation.Id,
        firstName: this.createcontactjsondatadummy.FName,
        lastName: this.createcontactjsondatadummy.LName,
        designation: this.createcontactjsondatadummy.Designation,
        emailAddress: this.createcontactjsondatadummy.Email,
        reportingManager: this.createcontactjsondatadummy.ReportingManager.FullName,
        CBU: this.createcontactjsondatadummy.CBU.Name,
        relationship: this.createcontactjsondatadummy.Relationship.Id,
        keyContact: this.createcontactjsondatadummy.isKeyContact,
        category: this.createcontactjsondatadummy.Category.Id,
        keyContactcategory: this.createcontactjsondatadummy.keyContactcategory,
        referenceable: this.createcontactjsondatadummy.Referenceable,
        referenceType: '',
        referenceMode: this.createcontactjsondatadummy.ReferenceMode.Id,
        // country: this.createcontactjsondatadummy.CustomerAddress.Country.Name,
        // stateProvince: this.createcontactjsondatadummy.CustomerAddress.State.Name,
        // City: this.createcontactjsondatadummy.CustomerAddress.City.Name,
        address1: this.createcontactjsondatadummy.CustomerAddress.Address1,
        address2: this.createcontactjsondatadummy.CustomerAddress.Address2,
        streetName: this.createcontactjsondatadummy.CustomerAddress.streetName,
        zipPostalCode: this.createcontactjsondatadummy.CustomerAddress.ZipCode,

      });
      //Phone number patching value sss
      const PhoneNumberArrayFGs = this.createcontactjsondatadummy.Contact.map(number => this.fb.group(number));
      const phoneArray = this.fb.array(PhoneNumberArrayFGs);
      this.newCustomerContactForm1.setControl("contacts", phoneArray)
      this.imageSrc1 = this.createcontactjsondatadummy.profile;
      this.imageSrc = this.createcontactjsondatadummy.BusinessCardImage;
      this.selectedAccountName = this.createcontactjsondatadummy.CustomerAccount.SysGuid;
      this.accountName = this.createcontactjsondatadummy.CustomerAccount.Name;
      this.isProspect = this.createcontactjsondatadummy.CustomerAccount.isProspect;
      this.SelectedReportingManager = this.createcontactjsondatadummy.ReportingManager.SysGuid;
      this.reportingmanagerName = this.createcontactjsondatadummy.ReportingManager.FullName
      this.selectedCBUId = this.createcontactjsondatadummy.CBU.SysGuid;
      this.cbuName = this.createcontactjsondatadummy.CBU.Name
      this.sendReferenceType = this.createcontactjsondatadummy.ReferenceType;
      this.selectedCountryname = this.createcontactjsondatadummy.CustomerAddress.Country.SysGuid;
      this.countryName = this.createcontactjsondatadummy.CustomerAddress.Country.Name;
      this.selectedStatename = this.createcontactjsondatadummy.CustomerAddress.State.SysGuid;
      this.stateName = this.createcontactjsondatadummy.CustomerAddress.State.Name;
      this.selectedCityname = this.createcontactjsondatadummy.CustomerAddress.City.SysGuid;
      this.cityName = this.createcontactjsondatadummy.CustomerAddress.City.Name;
      this.TwitterUrldata = this.createcontactjsondatadummy.TwitterUrl;
      this.LinkendUrldata = this.createcontactjsondatadummy.LinkedinUrl
      this.newCustomerContactForm1.controls['accountName'].enable();
      this.newCustomerContactForm1.controls['reportingManager'].enable();
      this.newCustomerContactForm1.controls['CBU'].enable();
      this.newCustomerContactForm1.controls['stateProvince'].enable();
      this.newCustomerContactForm1.controls['City'].enable();
      this.ngclass = false;
    }

  }

  getMasterDatas() {
    this.masterApi.getFunction().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.function, res)
        this.functionType = res.ResponseObject;
      }
    });
    this.masterApi.getSalutation().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.salutation, res)
        this.salutation = res.ResponseObject;
      }
    });
    this.masterApi.getRelationship().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.relationship, res)
        this.relationship = res.ResponseObject;
      }
    });
    this.masterApi.getCategory().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.categoryapi, res)
        this.categoryData = res.ResponseObject.map(x => x = { ...x, Value: this.getSymbol(x.Value) });;
        console.log("category Masterdata", this.categoryData);
      }
    });
    this.masterApi.getContactType().subscribe(data => {
      if (data.IsError === false) {
        this.offlineService.addMasterApiCache(routes.getContactType, data)
        this.phoneContactType = data.ResponseObject;
      } else {
        this.errorMessage.throwError(data.Message)
      }
    });
    this.masterApi.getContactReferenceMode().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.contactReferenceMode, res)
        this.ContactReferenceMode = res.ResponseObject;
        console.log("ContactReferenceMode", this.ContactReferenceMode);
      }
    });
  }
  get f() {
    return this.newCustomerContactForm1.controls;
  }
  get f1() {
    return this.newCustomerContactForm2.controls;
  }
  get fa() {
    return this.newCustomerContactForm1.get('contacts') as FormArray;
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '/');
  }
  CreateContactDetails() {
    this.newCustomerContactForm1 = this.fb.group({
      salutation: ['', [Validators.required]],
      firstName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      lastName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      designation: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101), leadDecimalDealValue])],
      emailAddress: ['', Validators.compose([Validators.required])],
      contacts: this.fb.array([this.addformArray()]),
      accountName: ['', [Validators.required]],
      reportingManager: [''],
      CBU: [''],
      relationship: ['', [Validators.required]],
      keyContact: [false],
      category: ['', [Validators.required]],
      keyContactcategory: [''],
      referenceable: ['', [Validators.required]],
      referenceType: ['', [Validators.required]],
      referenceMode: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      streetName: [''],
      City: [''],
      stateProvince: [''],
      country: ['', [Validators.required]],
      zipPostalCode: [''],
      linkedinProfileAvail: [''],
    });
    this.newCustomerContactForm1.get('contacts').valueChanges.subscribe(res => {
      res.forEach(element => {
        if (element.ContactNo != "") {
          this.phoneValidation = false
          console.log(element.ContactNo.length)
        }
      })
      console.log(res)
    });
    this.newCustomerContactForm1.controls['stateProvince'].disable();
    this.newCustomerContactForm1.controls['City'].disable();
    this.newCustomerContactForm1.controls['CBU'].disable();
    this.newCustomerContactForm1.controls['reportingManager'].disable();
    this.ngclass = true;
    this.onChanges();
  }

  marketingInformation() {
    this.newCustomerContactForm2 = this.fb.group({
      industry: [''],
      GDPR: [false],
      functions: [''],
      intrest: [''],
      solicit: [false],
    });
    this.onChanges1();
  }
  onChanges1() {
    this.newCustomerContactForm2.get('industry').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm2.get('industry').dirty && this.IndustrySwitch) {
        this.isIndustrySearchLoading = true;
        this.getIndustry = []
        this.contactService.getsearchSicIndustry(val).subscribe(data => {
          this.isIndustrySearchLoading = false;
          if (!data.IsError) {
            this.getIndustry = data.ResponseObject;
            this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          } else {
            this.errorMessage.throwError(data.Message);
            this.getIndustry = []
          }
        }, error => {
          this.isIndustrySearchLoading = false;
          this.getIndustry = []
        });
      }
    });
    this.newCustomerContactForm2.get('intrest').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm2.get('intrest').dirty && this.IntrestNameSwitch) {
        this.isInterestSearchLoading = true;
        this.getIntrest = []
        this.campaignService.getSearchInterestByname(val).subscribe(res => {
          this.isInterestSearchLoading = false;
          if (!res.IsError) {
            this.getIntrest = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            console.log("getIntrest", this.getIntrest);
          } else {
            this.errorMessage.throwError(res.Message);
            this.getIntrest = []
          }
        }, error => {
          this.isInterestSearchLoading = false;
          this.getIntrest = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactInterest').length > 0) {
          this.isInterestSearchLoading = false;
          this.getIntrest = this.cacheDataService.cacheDataGet('contactInterest')
        }
      }
    });
  }

  //-------------Auto Saved functionality -------------------------------------
  isModuleSwitch(): boolean {
    if (sessionStorage.getItem('TempLeadDetails') || sessionStorage.getItem('TempEditLeadDetails') || sessionStorage.getItem('selAccountObj') || sessionStorage.getItem('CreateActivityGroup') || this.meetingService.customerContactAccountFromMeeting) {
      return true
    } else {
      return false
    }
  }
  autoSaveForm() {
    if (!this.isModuleSwitch()) {
      this.service.GetRedisCacheData('L2O_CREATE_CONTACT').subscribe(res => {
        console.log("Get Redis CacheData contact", res);
        this.isLoading = false
        if (!res.IsError) {
          if (!this.isEmpty(res.ResponseObject)) {
            this.TempCreateContactDetails = JSON.parse(res.ResponseObject)
            console.log("tem data", this.TempCreateContactDetails);
            if (res.ResponseObject != 'empty') {
              this.cacheDataPatchValuesForAutoSaved()
            }
          }
        }
      });
    }
  }
  cacheDataPatchValuesForAutoSaved() {
    this.newCustomerContactForm1.patchValue({
      salutation: this.TempCreateContactDetails['step1'].salutation,
      firstName: this.TempCreateContactDetails['step1'].firstName,
      lastName: this.TempCreateContactDetails['step1'].lastName,
      designation: this.TempCreateContactDetails['step1'].designation,
      emailAddress: this.TempCreateContactDetails['step1'].emailAddress,
      accountName: this.TempCreateContactDetails['step1'].accountName,
      reportingManager: this.TempCreateContactDetails['step1'].reportingManager,
      CBU: this.TempCreateContactDetails['step1'].CBU,
      relationship: this.TempCreateContactDetails['step1'].relationship,
      keyContact: this.TempCreateContactDetails['step1'].keyContact,
      category: this.TempCreateContactDetails['step1'].category,
      keyContactcategory: this.TempCreateContactDetails['step1'].keyContactcategory,
      referenceable: this.TempCreateContactDetails['step1'].referenceable,
      address1: this.TempCreateContactDetails['step1'].address1,
      address2: this.TempCreateContactDetails['step1'].address2,
      streetName: this.TempCreateContactDetails['step1'].streetName,
      City: this.TempCreateContactDetails['step1'].City,
      stateProvince: this.TempCreateContactDetails['step1'].stateProvince,
      country: this.TempCreateContactDetails['step1'].country,
      zipPostalCode: this.TempCreateContactDetails['step1'].zipPostalCode,
    });
    //Phone number cache patching value
    const PhoneNumberArrayFGs = this.TempCreateContactDetails['step1'].contacts.map(number => this.fb.group(number));
    const phoneArray = this.fb.array(PhoneNumberArrayFGs)
    this.newCustomerContactForm1.setControl("contacts", phoneArray)
    //marketing data patching value
    this.newCustomerContactForm2.patchValue(this.TempCreateContactDetails['step2']);
    this.imageSrc1 = this.TempCreateContactDetails.profile;
    this.imageSrc = this.TempCreateContactDetails.businessPhoto;
    this.businessCardUrl = this.TempCreateContactDetails.businessCardUrl;
    this.profileUrl = this.TempCreateContactDetails.profileUrl;
    let temp = this.TempCreateContactDetails['step1']
    let temp2 = this.TempCreateContactDetails['step2']

    this.accountNamevalue = this.TempCreateContactDetails.accountName;
    this.accountName = this.TempCreateContactDetails.accountName;
    this.isProspect = this.TempCreateContactDetails.isProspect;
    this.selectedAccountName = temp.selectedAccountName;
    let json = { Name: this.TempCreateContactDetails.accountName, SysGuid: temp.selectedAccountName, isProspect: this.TempCreateContactDetails.isProspect, Id: temp.selectedAccountName }
    this.sendToAdvanceLookup.push(json);
    this.lookupdata.selectedRecord = this.sendToAdvanceLookup;

    this.selectedCBUId = temp.selectedCBUId;
    this.selectedCountryname = temp.selectedCountryname;
    this.selectedStatename = temp.selectedStatename;
    this.selectedCityname = temp.selectedCityname;
    this.SelectedReportingManager = temp.SelectedReportingManager;
    this.SelectedIntrest = temp2.SelectedIntrest;

    this.newCustomerContactForm1.controls['CBU'].enable();
    this.newCustomerContactForm1.controls['reportingManager'].enable();
    this.newCustomerContactForm1.controls['stateProvince'].enable();
    this.newCustomerContactForm1.controls['City'].enable();
    this.clearReferenceValidator();
    this.ngclass = false;

  }
  autoSaveChangedData(validity: boolean) {
    if (validity && !this.isModuleSwitch()) {
      let body = {
        "step1": {
          ...this.newCustomerContactForm1.value
        },
        "step2": {
          ...this.newCustomerContactForm2.value
        },
        isProspect: this.isProspect,
        profile: this.imageSrc1,
        businessPhoto: this.imageSrc,
        accountName: this.accountName,
        selectedAccountName: this.selectedAccountName,
        businessCardUrl : this.businessCardUrl,
        profileUrl : this.profileUrl
      }
      console.log("step1", this.newCustomerContactForm1.value);
      console.log("step2", this.newCustomerContactForm2.value);
      this.service.SetRedisCacheData(body, 'L2O_CREATE_CONTACT').subscribe(res => {
        console.log("Set auto save contact", res);
      });
    }
  }
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  //---------------- Auto saved end ----------------------------------------

  addPhoneArray: FormArray;
  addformArray() {
    return this.fb.group({
      ContactNo: [''],
      ContactType: [''],
      MapGuid: ['']
    })
  }
  get getContacts() {
    return this.addPhoneArray = <FormArray>this.newCustomerContactForm1.get('contacts') as FormArray;
  }
  PhoneNumberValidation(value) {
    if (value === "") {
      this.errorMessage.throwError("Please select phone number type")
    }
  }
  addContactss($event, valid, value) {
    this.contactIndex = this.contactIndex + 1
    console.log("valid value", valid, value)
    console.log(this.newCustomerContactForm1.get('contacts').value.length)
    console.log("ccc", this.newCustomerContactForm1.controls.contacts[this.newCustomerContactForm1.value.contacts.length - 1])
    if (this.newCustomerContactForm1.value.contacts.length >= 5) {
      this.errorMessage.throwError("Maximum 5 contact numbers can be added");
    } else {
      console.log("newCustomerContactForm1 phone number1", this.newCustomerContactForm1.value)
      if (this.newCustomerContactForm1.value.contacts[this.newCustomerContactForm1.value.contacts.length - 1].ContactNo === "") {
        this.errorMessage.throwError("Please enter phone number");
      } else {
        if (this.addPhoneArray.value.some(x => x.ContactNo.length < 8)) {
          console.log("newCustomerContactForm1 phone number2", this.newCustomerContactForm1.value)
          this.errorMessage.throwError("Please enter the phone number ");
        }
        else {
          $event.preventDefault();
          this.addPhoneArray.push(this.addformArray());
          console.log("addPhoneArray", this.addPhoneArray);
          this.newCustomerContactForm1;
          console.log("newCustomerContactForm1", this.newCustomerContactForm1);
        }
      }
    }
  }

  deleteContact(i) {
    if (i > 0) {
      this.addPhoneArray.removeAt(i);
    } else {
      return null;
    }
  }

  contactTypeChanges1($event, i) {
    $event.preventDefault();
    console.log('Value -->', $event.target.value)
    let contactType = $event.target.value
    const facontrol = (<FormArray>this.newCustomerContactForm1.controls['contacts']).at(i)
    console.log('fdf', this.newCustomerContactForm1.controls)
    if (contactType == '') {
      this.phoneValidation = false
      console.log("Form control value", facontrol);
      facontrol['controls'].ContactNo.setValue("");
    }
    let val = !!facontrol['controls'].ContactNo.value;
    let validityVal = facontrol['controls'].ContactNo.valid;
    this.autoSaveChangedData(val && validityVal);
  }

  onChanges() {
    this.newCustomerContactForm1.get('accountName').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('accountName').dirty && this.AccountNameSwitch === true) {
        this.getAccountCompany = []
        this.isAccountNameSearchLoading = true;
        this.contactService.getsearchAccountCompany(val).subscribe(data => {
          this.isAccountNameSearchLoading = false;
          if (!data.IsError) {
            this.getAccountCompany = data.ResponseObject;
            this.lookupdata.TotalRecordCount = data.TotalRecordCount;
            this.lookupdata.tabledata = data.ResponseObject;
            console.log("account search data", this.getAccountCompany)
          } else {
            this.errorMessage.throwError(data.Message);
            this.getAccountCompany = []
          }
        }, error => {
          this.isAccountNameSearchLoading = false;
          this.getAccountCompany = []
        });
      } 
    });
    this.newCustomerContactForm1.get('reportingManager').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('reportingManager').dirty && this.ReportingManagerSwitch) {
        if (this.selectedAccountName !== undefined) {
          this.isReportingManagerSearchLoading = true;
          this.getReportingManager = []
          this.contactService.searchReportingManagerByAccountName(this.selectedAccountName, this.isProspect, val).subscribe(data => {
            this.isReportingManagerSearchLoading = false;
            if (!data.IsError) {
              this.getReportingManager = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.tabledata = data.ResponseObject;
              console.log("reporting manager search data", this.getReportingManager);
            } else {
              this.errorMessage.throwError(data.Message);
              this.getReportingManager = []
            }
          }, error => {
            this.isReportingManagerSearchLoading = false
            this.getReportingManager = []
          });
        }
      } else {
        if (this.cacheDataService.cacheDataGet('contactReportingManager').length > 0) {
          this.getReportingManager = this.cacheDataService.cacheDataGet('contactReportingManager')
        }
        this.isReportingManagerSearchLoading = false;
      }
    });
    this.newCustomerContactForm1.get('CBU').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('CBU').dirty && this.CBUSwitch) {
        if (this.selectedAccountName !== undefined) {
          this.isCBUSearchLoading = true;
          this.getCBU = []
          this.contactService.cbuByAccountName(this.selectedAccountName, this.isProspect, val).subscribe(data => {
            this.isCBUSearchLoading = false;
            if (!data.IsError) {
              this.getCBU = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.tabledata = data.ResponseObject;
              console.log("CBU search data", this.getCBU)
            } else {
              this.errorMessage.throwError(data.Message);
              this.getCBU = []
            }
          }, error => {
            this.isCBUSearchLoading = false;
            this.getCBU = []
          });
        }
      } else {
        if (this.cacheDataService.cacheDataGet('contactCBU').length > 0) {
          this.getCBU = this.cacheDataService.cacheDataGet('contactCBU')
        }
        this.isCBUSearchLoading = false;
      }
    });
    this.newCustomerContactForm1.get('country').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('country').dirty && this.CountrynameSwitch) {
        this.isCountrySearchLoading = true;
        this.getCountry = []
        this.contactService.getAllCountry(val).subscribe(data => {
          this.isCountrySearchLoading = false;
          if (!data.IsError) {
            this.getCountry = data.ResponseObject;
            console.log("Country search data", this.getCountry)
          } else {
            this.errorMessage.throwError(data.Message);
            this.getCountry = []
          }
        }, error => {
          this.isCountrySearchLoading = false;
          this.getCountry = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactCountry').length > 0) {
          this.getCountry = this.cacheDataService.cacheDataGet('contactCountry')
        }
        this.isCountrySearchLoading = false;
      }
    });
    this.newCustomerContactForm1.get('stateProvince').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('stateProvince').dirty && this.StatenameSwitch) {
        this.isStateSearchLoading = true;
        this.getState = []
        this.contactService.searchStateByCountry(this.selectedCountryname, val).subscribe(data => {
          this.isStateSearchLoading = false;
          if (!data.IsError) {
            this.getState = data.ResponseObject;
            console.log("State search data", this.getState)
          } else {
            this.errorMessage.throwError(data.Message);
            this.getState = []
          }
        }, error => {
          this.isStateSearchLoading = false;
          this.getState = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactState').length > 0) {
          this.getState = this.cacheDataService.cacheDataGet('contactState');
        }
        this.isStateSearchLoading = false;
      }
    });
    this.newCustomerContactForm1.get('City').valueChanges.subscribe(val => {
      if (this.newCustomerContactForm1.get('City').dirty && this.CitynameSwitch) {
        if (this.selectedStatename !== undefined) {
          this.isCitySearchLoading = true;
          this.getCity = []
          this.contactService.SearchCityByState(this.selectedStatename, val).subscribe(data => {
            this.isCitySearchLoading = false;
            if (!data.IsError) {
              this.getCity = data.ResponseObject;
              console.log("city search data", this.getCity)
            } else {
              this.errorMessage.throwError(data.Message);
              this.getCity = []
            }
          }, error => {
            this.isCitySearchLoading = false;
            this.getCity = []
          });
        }
      } else {
        if (this.cacheDataService.cacheDataGet('contactCity').length > 0) {
          this.getCity = this.cacheDataService.cacheDataGet('contactCity');
        }
        this.isCitySearchLoading = false;
      }
    });
    this.newCustomerContactForm1.get('referenceType').valueChanges.subscribe(val => {
      this.isReferenceTypeSearchLoading = true;
      this.getReferenceType = []
      if (this.newCustomerContactForm1.get('referenceType').dirty && this.ReferenceTypeSwitch) {
        this.contactService.getSearchReferenceTypeByID(val).subscribe(res => {
          this.isReferenceTypeSearchLoading = false;
          if (!res.IsError) {
            this.getReferenceType = res.ResponseObject;
            console.log("get ReferenceType", this.getReferenceType);
          } else {
            this.errorMessage.throwError(res.Message);
            this.getReferenceType = []
          }
        }, error => {
          this.isReferenceTypeSearchLoading = false;
          this.getReferenceType = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactReferenceType').length > 0) {
          this.isReferenceTypeSearchLoading = false;
          this.getReferenceType = this.cacheDataService.cacheDataGet('contactReferenceType')
        }
      }
    });
  }

  //-------- Clear search lookup ----------
  clearAccounName() {
    this.newCustomerContactForm1.patchValue({
      accountName: ""
    });
    this.selectedAccountName = ''
    this.accountNamevalue = ''
    this.reportingmanagerName = ''
    this.cbuName = ''
    this.acc.nativeElement.value = ''
    this.getAccountCompany = []
    this.selectedAccountName = undefined;
    this.SelectedReportingManager = undefined;
    this.newCustomerContactForm1.controls['CBU'].disable();
    this.newCustomerContactForm1.controls['reportingManager'].disable();
    this.newCustomerContactForm1.controls['CBU'].reset();
    this.newCustomerContactForm1.controls['reportingManager'].reset();
    this.ngclass = true;
    this.accountResetCacheData();
  }
  clearReportingManagerName() {
    this.newCustomerContactForm1.patchValue({
      reportingManager: ""
    });
    this.SelectedReportingManager = ''
    this.reportingmanagerName = ''
  }
  clearCBUName() {
    this.newCustomerContactForm1.patchValue({
      CBU: ""
    });
    this.selectedCBUId = ''
    this.cbuName = ''
  }
  clearCountryName() {
    this.newCustomerContactForm1.patchValue({
      country: "",
      stateProvince: "",
      City: ""
    });
    this.countryName = ''
    this.selectedCountryname = ''
    this.stateName = ''
    this.cityName = ''
    this.getCountry = []
    this.selectedCountryname = undefined;
    this.newCustomerContactForm1.controls['stateProvince'].disable();
    this.newCustomerContactForm1.controls['City'].disable();
    this.ngclass = true;
    this.CountryResetCacheData();
  }
  clearStateName() {
    this.newCustomerContactForm1.patchValue({
      stateProvince: "",
      City: ""
    });
    this.selectedStatename = ''
    this.stateName = ''
    this.selectedCityname = ''
    this.cityName = ''
    this.getState = []
    this.selectedStatename = undefined;
    this.newCustomerContactForm1.controls['City'].disable();
    this.StateResetCacheData();
  }
  clearCityName() {
    this.newCustomerContactForm1.patchValue({
      City: ""
    });
    this.selectedCityname = ''
    this.cityName = ''
  }
  clearInterestName() {
    this.newCustomerContactForm2.patchValue({
      intrest: ""
    });
    this.SelectedIntrest = ''
    this.interestName = ''
  }
  clearReferenceType() {
    this.newCustomerContactForm1.patchValue({
      referenceType: ""
    });
    this.SelectedReferenceType = ''
    this.referenceTypeName = ''
  }
  accountResetCacheData() {
    this.cacheDataService.cacheDataMultiReset(
      [
        'contactAccountname',
        'contactReportingManager',
        'contactCBU',
      ]
    )
  }
  CountryResetCacheData() {
    this.cacheDataService.cacheDataMultiReset(
      [
        'contactCountry',
        'contactState',
        'contactCity',
      ]
    )
  }
  StateResetCacheData() {
    this.cacheDataService.cacheDataMultiReset(
      [
        'contactState',
        'contactCity',
      ]
    )
  }

  industryAutoPopulate(Guid) {
    this.contactService.AutoPopulateIndustryByAccount(Guid).subscribe(res => {
      console.log("AutoPopulate IndustryByAccount", res);
      if (res.ResponseObject.length > 0) {
        let item = res.ResponseObject[0];
        console.log("indusrty", item);
        if (item['Guid'] != '' && item['Name'] != '') {
          this.newCustomerContactForm2.patchValue({
            industry: item['Name']
          })
          let json = item.Guid;
          this.SendSelectedIndustry = json;

        } else {
          this.newCustomerContactForm2.patchValue({
            industry: ''
          })
          this.SendSelectedIndustry = undefined;
        }
      }
    });
  }

  accountNameAddressCopy: any;
  validateAccountname: boolean = true;
  sendToAdvanceLookup = []
  accountNamevalue: string = ''
  appendAccountName(item: any) {
    // this.contactService.getValidAccount(item.SysGuid, item.isProspect, 3).subscribe(res => {
    //   if (res.IsError == true) {
    //     this.errorMessage.throwError(res.Message);
    //     this.selectedAccountName = undefined;
    //     this.newCustomerContactForm1.patchValue({ accountName: "" });
    //     this.acc.nativeElement.value = ''
    //   } else {
    let json = { Name: item.Name, SysGuid: item.SysGuid, isProspect: item.isProspect, Id: item.SysGuid }
    this.sendToAdvanceLookup = [json]
    // this.AccountNameSwitch = false;
    this.selectedAccountName = item.SysGuid;
    this.accountName = item.Name
    this.accountNamevalue = item.Name
    this.isProspect = item.isProspect;
    // if (item.isProspect == false) {
    //   console.log("industry pop");
    //   debugger
    //   this.industryAutoPopulate(item.SysGuid);
    // }
    this.industryAutoPopulate(item.SysGuid);
    console.log("selectedAccountName ", this.selectedAccountName);
    this.newCustomerContactForm1.patchValue({ reportingManager: '' })
    this.newCustomerContactForm1.patchValue({ accountName: item.Name })
    if (!this.newCustomerContactForm1.get('selectedAccountName')) {
      this.newCustomerContactForm1.addControl('selectedAccountName', new FormControl(this.selectedAccountName))
    } else {
      this.newCustomerContactForm1.patchValue({
        'selectedAccountName': this.selectedAccountName
      });
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('accountName').valid);
    this.SelectedReportingManager = undefined;
    this.newCustomerContactForm1.controls['CBU'].reset();
    this.newCustomerContactForm1.controls['CBU'].enable();
    this.newCustomerContactForm1.controls['reportingManager'].enable();
    this.cacheDataService.cacheDataReset("contactReportingManager");
    this.cacheDataService.cacheDataReset("contactCBU");
    this.ngclass = false;
    // Address Based On Account name start
    this.contactService.getAddressBasedOnAccountapi(this.selectedAccountName).subscribe(res => {
      console.log("accountNameAddressCopy1", res);
      if (res.IsError === false) {
        this.accountNameAddressCopy = res.ResponseObject;
        console.log("AccountName Address ", this.accountNameAddressCopy);
        if (this.accountNameAddressCopy != undefined) {
          this.openCopyPopup(this.accountNameAddressCopy);
        }
      }
    });
    //end
    //   }
    // }, error => {
    //   this.getAccountCompany = []
    //   this.selectedAccountName = undefined;
    //   this.newCustomerContactForm1.patchValue({ accountName: "" });
    //   this.acc.nativeElement.value = ''
    //   this.errorMessage.throwError("User don't have permission to access this account")
    // });
  }

  countryStateCityAutoPopulate() {
    if (this.accountNameAddressCopy.CustomerAddress) {
      console.log("Aaa.Country", this.accountNameAddressCopy.CustomerAddress.Country)
      if (this.accountNameAddressCopy.CustomerAddress.Country) {
        if (this.accountNameAddressCopy.CustomerAddress.Country.Name == "") {
          this.countryName = ""
          this.newCustomerContactForm1.controls['stateProvince'].disable();
          this.newCustomerContactForm1.controls['City'].disable();
        } else {
          this.newCustomerContactForm1.patchValue({ country: this.accountNameAddressCopy.CustomerAddress.Country.Name });
          this.countryName = this.accountNameAddressCopy.CustomerAddress.Country.Name
          this.selectedCountryname = this.accountNameAddressCopy.CustomerAddress.Country.SysGuid;
          this.newCustomerContactForm1.controls['stateProvince'].enable();
          this.newCustomerContactForm1.controls['City'].disable();
        }
      }
      if (this.accountNameAddressCopy.CustomerAddress.State) {
        if (this.accountNameAddressCopy.CustomerAddress.Country.Name == "") {
          this.newCustomerContactForm1.controls['City'].disable();
        } else {
          this.newCustomerContactForm1.patchValue({ stateProvince: this.accountNameAddressCopy.CustomerAddress.State.Name });
          this.selectedStatename = this.accountNameAddressCopy.CustomerAddress.State.SysGuid;
          this.newCustomerContactForm1.controls['City'].enable();
        }
      }
      if (this.accountNameAddressCopy.CustomerAddress.City) {
        this.newCustomerContactForm1.patchValue({ City: this.accountNameAddressCopy.CustomerAddress.City.Name });
        this.selectedCityname = this.accountNameAddressCopy.CustomerAddress.City.SysGuid;
      }
      this.newCustomerContactForm1.patchValue({
        address1: this.accountNameAddressCopy.CustomerAddress.Address1,
        address2: this.accountNameAddressCopy.CustomerAddress.Address2,
        zipPostalCode: this.accountNameAddressCopy.CustomerAddress.ZipCode
      });
    }
  }
  AccountNameSwitch: boolean = false;
  AccountNameclose() {
    this.AccountNameSwitch = false;
    if (this.selectedAccountName === undefined && this.newCustomerContactForm1.get('accountName').dirty) {
      this.newCustomerContactForm1.patchValue({ accountName: '' })
    }
  }

  CBUSwitch: boolean = false;
  sendCbuToAdvanceLookup = []
  cbuName: string = ''
  appendCBU(item: any) {
    this.newCustomerContactForm1.patchValue({ CBU: item.Name })
    this.CBUSwitch = false;
    this.selectedCBUId = item.Id;
    this.cbuName = item.Name
    console.log(this.selectedCBUId.Id);
    let json = { Name: item.Name, SysGuid: item.Id, Id: item.Id }
    this.sendCbuToAdvanceLookup = [json]
    if (!this.newCustomerContactForm1.get('selectedCBUId')) {
      this.newCustomerContactForm1.addControl('selectedCBUId', new FormControl(this.selectedCBUId))
    } else {
      this.newCustomerContactForm1.patchValue({
        'selectedCBUId': this.selectedCBUId
      })
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('CBU').valid);
  }
  CBUclose() {
    this.CBUSwitch = false;
    if (this.selectedCBUId === undefined && this.newCustomerContactForm1.get('CBU').dirty) {
      this.newCustomerContactForm1.patchValue({ CBU: '' })
    }
  }

  CountrynameSwitch: boolean = false;
  countryName: string = ''
  appendCountryname(item: any) {
    this.newCustomerContactForm1.patchValue({ country: item.Name, stateProvince: "", City: "" })
    this.CountrynameSwitch = false;
    this.countryName = item.Name
    this.selectedCountryname = item.SysGuid
    this.getCountry = [];
    console.log("selectedCountryname", this.selectedCountryname);
    this.newCustomerContactForm1.controls['stateProvince'].enable();
    this.newCustomerContactForm1.controls['City'].disable();
    this.selectedStatename = undefined;
    this.selectedCityname = undefined;
    this.ngclass = false;
    if (!this.newCustomerContactForm1.get('selectedCountryname')) {
      this.newCustomerContactForm1.addControl('selectedCountryname', new FormControl(this.selectedCountryname))
    } else {
      this.newCustomerContactForm1.patchValue({
        'selectedCountryname': this.selectedCountryname
      });
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('country').valid);
    this.cacheDataService.cacheDataMultiReset(['contactState', 'contactCity'])
    this.selectedStatename = '';
    this.stateName = '';
    this.selectedCityname = '';
    this.cityName = ''
  }
  Countrynameclose() {
    this.CountrynameSwitch = false;
    if (this.selectedCountryname === undefined && this.newCustomerContactForm1.get('country').dirty) {
      this.newCustomerContactForm1.patchValue({ country: '' })
    }
    if (this.countryName !== "") {
      this.newCustomerContactForm1.patchValue({
        country: this.countryName
      })
    }
  }

  StatenameSwitch: boolean = false;
  Statenameclose() {
    this.StatenameSwitch = false;
    if (this.selectedStatename === undefined && this.newCustomerContactForm1.get('stateProvince').dirty) {
      this.newCustomerContactForm1.patchValue({ stateProvince: '' })
    }
  }
  stateName: string = ''
  appendStatename(item: any) {
    this.newCustomerContactForm1.patchValue({ stateProvince: item.Name })
    this.StatenameSwitch = false;
    this.selectedStatename = item.SysGuid
    this.stateName = item.Name
    this.getState = [];
    console.log("selectedStatename", this.selectedStatename);
    this.newCustomerContactForm1.controls['City'].enable();
    this.ngclass = false;
    if (!this.newCustomerContactForm1.get('selectedStatename')) {
      this.newCustomerContactForm1.addControl('selectedStatename', new FormControl(this.selectedStatename))
    } else {
      this.newCustomerContactForm1.patchValue({
        'selectedStatename': this.selectedStatename
      })
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('stateProvince').valid);
    this.newCustomerContactForm1.patchValue({
      City: ''
    });
    this.selectedCityname = ''
    this.cityName = ''
    this.cacheDataService.cacheDataReset('contactCity');
  }

  CitynameSwitch: boolean = false;
  Citynameclose() {
    this.CitynameSwitch = false;
    if (this.selectedCityname === undefined && this.newCustomerContactForm1.get('City').dirty) {
      this.newCustomerContactForm1.patchValue({ City: '' })
    }
  }
  cityName: string = ''
  appendCityname(item: any) {
    this.newCustomerContactForm1.patchValue({ City: item.Name })
    this.CitynameSwitch = false;
    this.selectedCityname = item.SysGuid
    this.cityName = item.Name
    this.getCity = []
    console.log("selectedCityname", this.selectedCityname);
    if (!this.newCustomerContactForm1.get('selectedCityname')) {
      this.newCustomerContactForm1.addControl('selectedCityname', new FormControl(this.selectedCityname))
    } else {
      this.newCustomerContactForm1.patchValue({
        'selectedCityname': this.selectedCityname
      });
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('City').valid);
  }

  IndustrySwitch: boolean = true;
  Industryclose() {
    this.IndustrySwitch = false;
    if (this.SelectedIndustry === undefined && this.newCustomerContactForm2.get('industry').dirty) {
      this.newCustomerContactForm2.patchValue({ industry: '' })
    }
  }

  appendIndustry(item: any) {
    this.newCustomerContactForm2.patchValue({ industry: item.Name })
    this.IndustrySwitch = false;
    this.SelectedIndustry = item.wipro_sicindustryclassificationid
  }

  IntrestNameSwitch: boolean = true;
  sendInterestToAdvanceLookup = []
  IntrestNameclose() {
    this.IntrestNameSwitch = false;
    if (this.SelectedIntrest === undefined && this.newCustomerContactForm2.get('intrest').dirty) {
      this.newCustomerContactForm2.patchValue({ intrest: '' })
    }
  }

  ReferenceTypeSwitch: boolean = false;
  ReferenceTypeclose() {
    this.ReferenceTypeSwitch = false;
    if (this.SelectedReferenceType === undefined && this.newCustomerContactForm1.get('referenceType').dirty) {
      this.newCustomerContactForm1.patchValue({ referenceType: '' })
    }
  }

  interestName: string = ''
  selectedInterest = [];
  sendInterest: any = [];
  interestChange: boolean = false;
  appendIntrestName(item: any) {
    let json = { Id: item.Id, Name: item.Name, LinkActionType: 1 }
    let json1 = { Guid: item.Id, LinkActionType: 1 }
    this.selectedInterest.push(json);
    let beforeLength = this.selectedInterest.length;
    this.selectedInterest = this.service.removeDuplicates(this.selectedInterest, "Id");
    let afterLength = this.selectedInterest.length
    if (beforeLength === afterLength) {
      this.sendInterest.push(json1)
      this.newCustomerContactForm2.patchValue({ intrest: "", });
    } else {
      this.errorMessage.throwError("Selected interest already exists")
    }
    this.IntrestNameSwitch = false;
    this.interestChange = true;
    this.newCustomerContactForm2.patchValue({ Interest: "" });
    this.autoSaveChangedData(this.newCustomerContactForm2.get('intrest').valid);
  }
  delinkIntrest(id) {
    this.selectedInterest = this.selectedInterest.filter(res => res.Id !== id)
    this.sendInterest = this.sendInterest.filter(res => res.Guid !== id)
  }

  matReferencable(event) {
    console.log(event.value)
    if (event.value == true) {
      if (this.sendReferenceType.length == 0) {
        this.setReferenceValidator();
      }
      return
    } else {
      this.clearReferenceValidator();
      // this.selectedReferenceType = [];
      this.sendReferenceType = []
      this.newCustomerContactForm1.patchValue({
        referenceMode: ''
      })
      return
    }
  }
  setReferenceValidator() {
    this.newCustomerContactForm1.get('referenceType').markAsTouched();
    this.newCustomerContactForm1.get('referenceType').setValidators(Validators.required);
    this.newCustomerContactForm1.get('referenceType').updateValueAndValidity();
    this.newCustomerContactForm1.get('referenceMode').markAsTouched();
    this.newCustomerContactForm1.get('referenceMode').setValidators(Validators.required);
    this.newCustomerContactForm1.get('referenceMode').updateValueAndValidity();
  }
  clearReferenceValidator() {
    this.newCustomerContactForm1.get('referenceType').clearValidators();
    this.newCustomerContactForm1.get('referenceType').markAsUntouched();
    this.newCustomerContactForm1.get('referenceType').updateValueAndValidity();
    this.newCustomerContactForm1.get('referenceMode').clearValidators();
    this.newCustomerContactForm1.get('referenceMode').markAsUntouched();
    this.newCustomerContactForm1.get('referenceMode').updateValueAndValidity();
  }

  referenceTypeName: string = ''
  // selectedReferenceType = [];
  sendReferenceType = [];
  referenceTypeChange: boolean = false;
  appendReferenceType(item: any) {
    let json = { Id: item.Id, Name: item.Name, LinkActionType: 1, MapGuid: "" }
    // let json1 = {Id: item.Id, LinkActionType: 1, MapGuid:"" ,Name: item.Name,}
    this.sendReferenceType.push(json);
    let beforeLength = this.sendReferenceType.length;
    this.sendReferenceType = this.service.removeDuplicates(this.sendReferenceType, "Id");
    let afterLength = this.sendReferenceType.length
    if (beforeLength === afterLength) {
      this.newCustomerContactForm1.patchValue({ referenceType: "", });
    } else {
      this.errorMessage.throwError("Selected reference type already exists")
    }
    this.ReferenceTypeSwitch = false;
    this.referenceTypeChange = true;
    this.newCustomerContactForm1.patchValue({ referenceType: "" });
    if (this.sendReferenceType.length > 0) {
      this.refernceTypeValidator(false)
    }
    // this.autoSaveChangedData(this.newCustomerContactForm2.get('intrest').valid);
  }

  delinkReferenceType(id, i) {
    console.log("delink ReferenceType", id, i);
    this.sendReferenceType = this.sendReferenceType.filter(res => res.Id !== id.Id)
    if (this.sendReferenceType.length == 0) {
      this.refernceTypeValidator(true)
    } else {
      this.refernceTypeValidator(false)
    }
  }

  refernceTypeValidator(value) {
    if (value) {
      this.newCustomerContactForm1.get('referenceType').markAsTouched();
      this.newCustomerContactForm1.get('referenceType').setValidators(Validators.required);
      this.newCustomerContactForm1.get('referenceType').updateValueAndValidity();
    } else {
      this.newCustomerContactForm1.get('referenceType').clearValidators();
      this.newCustomerContactForm1.get('referenceType').markAsUntouched();
      this.newCustomerContactForm1.get('referenceType').updateValueAndValidity();
    }
  }


  ReportingManagerSwitch: boolean = false;
  sendReportingToAdvanceLookup = []
  ReportingManagerclose() {
    this.ReportingManagerSwitch = false;
    if (this.SelectedReportingManager === undefined && this.newCustomerContactForm1.get('reportingManager').dirty) {
      this.newCustomerContactForm1.patchValue({ reportingManager: '' })
    }
  }

  reportingmanagerName: string = ''
  appendReportingManager(item: any) {
    this.newCustomerContactForm1.patchValue({ reportingManager: item.FullName })
    this.ReportingManagerSwitch = false;
    this.SelectedReportingManager = item.Guid
    this.reportingmanagerName = item.FullName
    console.log("append ReportingManager data", item);
    let json = { Name: item.FullName, SysGuid: item.Guid, isProspect: item.isProspect, Id: item.Guid }
    this.sendReportingToAdvanceLookup = [json]
    if (!this.newCustomerContactForm1.get('SelectedReportingManager')) {
      this.newCustomerContactForm1.addControl('SelectedReportingManager', new FormControl(this.SelectedReportingManager))
    } else {
      this.newCustomerContactForm1.patchValue({
        'SelectedReportingManager': this.SelectedReportingManager
      });
    }
    this.autoSaveChangedData(this.newCustomerContactForm1.get('reportingManager').valid);
  }

  EmailChecksConatctGuild: any;
  isDisabled: boolean = false;
  emailValidationChecksOnSave() {
    var emailValue = this.newCustomerContactForm1.value.emailAddress
    console.log("emailValue", emailValue);
    if (this.newCustomerContactForm1.valid) {
      this.contactService.getEmailValidation(true, emailValue, "").subscribe(res => {
        if (res.IsError === false) {
          if (res.ResponseObject.isExists === true) {
            console.log("email Validation isExists", res.IsError);
            this.EmailChecksConatctGuild = res.ResponseObject.Guid;
            localStorage.setItem("contactEditId", JSON.stringify(this.EmailChecksConatctGuild));
            this.openduplicatepop();
          } else {

            this.isDisabled = true;
            this.save();
            // this.isLoading = true;
          }
        } else {
          this.isLoading = false;
          this.isDisabled = false;
          this.errorMessage.throwError(res.IsError)
        }
      });
    }
  }

  save() {
    console.log(this.newCustomerContactForm1);
    console.log(this.newCustomerContactForm2, "contacts");
    const createContactSave =
    {
      "BusinessCardImage": this.businessCardUrl == undefined ? "" : this.businessCardUrl,
      "ProfileImage": this.profileUrl,
      "Salutation": (Number(this.newCustomerContactForm1.value.salutation === undefined)) ? { "Id": "" } : { "Id": Number(this.newCustomerContactForm1.value.salutation) },
      "FName": this.newCustomerContactForm1.value.firstName,
      "LName": this.newCustomerContactForm1.value.lastName,
      "Email": this.newCustomerContactForm1.value.emailAddress,
      "Designation": (this.newCustomerContactForm1.value.designation === undefined) ? "" : this.newCustomerContactForm1.value.designation,
      "Relationship": Number(this.newCustomerContactForm1.value.relationship === undefined) ? { "Id": "" } : { "Id": Number(this.newCustomerContactForm1.value.relationship) },
      "Account": (this.selectedAccountName === undefined) ? { "SysGuid": "", "isProspect": "" } : { "SysGuid": this.selectedAccountName, "isProspect": this.isProspect },
      "ReportingManager": (this.SelectedReportingManager === undefined) ? { "SysGuid": "" } : { "SysGuid": this.SelectedReportingManager },
      "Contact": ((this.newCustomerContactForm1.value.contacts[0].ContactNo === "" || this.newCustomerContactForm1.value.contacts[0].ContactNo === null) && this.newCustomerContactForm1.value.contacts[0].ContactType === "") ? [] : this.newCustomerContactForm1.value.contacts,
      "isKeyContact": (this.newCustomerContactForm1.value.keyContact === undefined) ? "" : this.newCustomerContactForm1.value.keyContact,
      "Category": (this.newCustomerContactForm1.value.category === undefined) ? { "Id": "" } : { "Id": this.newCustomerContactForm1.value.category },
      "isPrivate": true,
      "isLinkedinProfileAvail": true,
      "LinkedinUrl": this.LinkendUrldata,
      "TwitterUrl": this.TwitterUrldata,
      "CBU": (this.selectedCBUId === undefined) ? { "sysGuid": "" } : { "sysGuid": this.selectedCBUId },
      "IsBusinessContact": true,
      "CustomerAddress": {
        "Address1": (this.newCustomerContactForm1.value.address1 === undefined) ? "" : this.newCustomerContactForm1.value.address1,
        "Address2": (this.newCustomerContactForm1.value.address2 === undefined) ? "" : this.newCustomerContactForm1.value.address2,
        "Street": (this.newCustomerContactForm1.value.streetName === undefined) ? "" : this.newCustomerContactForm1.value.streetName,
        "City": (this.selectedCityname === undefined) ? { "SysGuid": "" } : { "SysGuid": this.selectedCityname },
        "Country": (this.selectedCountryname === undefined) ? { "SysGuid": "" } : { "SysGuid": this.selectedCountryname },
        "State": (this.selectedStatename === undefined) ? { "SysGuid": "" } : { "SysGuid": this.selectedStatename },
        "ZipCode": (this.newCustomerContactForm1.value.zipPostalCode === undefined) ? "" : this.newCustomerContactForm1.value.zipPostalCode
      },
      "MeetingDetails": {
        "Owner": { "SysGuid": "" },
        "MeetingFrequency": 0
      },
      "MarketingDetail": {
        "Function": (this.newCustomerContactForm2.value.functions === undefined) ? { "Id": "" } : { "Id": this.newCustomerContactForm2.value.functions },
        "Solicit": (this.newCustomerContactForm2.value.solicit === undefined) ? "" : this.newCustomerContactForm2.value.solicit,
        "GDPR": (this.newCustomerContactForm2.value.GDPR === undefined) ? "" : this.newCustomerContactForm2.value.GDPR,
        "Industry": (this.SendSelectedIndustry == undefined || this.SendSelectedIndustry == null) ? { "wipro_sicindustryclassificationid": "" } : { "wipro_sicindustryclassificationid": this.SendSelectedIndustry },
        "InterestList": (this.sendInterest.length > 0) ? this.sendInterest : []
      },
      "Module": (this.Module == undefined) ? 2 : this.Module,
      "Referenceable": (this.newCustomerContactForm1.value.referenceable === undefined) ? "" : this.newCustomerContactForm1.value.referenceable,
      "ReferenceType": (this.sendReferenceType.length > 0) ? this.sendReferenceType : [],
      "ReferenceMode": this.newCustomerContactForm1.value.referenceMode === '' ? { "Id": "" } : { "Id": Number(this.newCustomerContactForm1.value.referenceMode) }
    }
    console.log(this.newCustomerContactForm1.value);
    console.log(this.newCustomerContactForm2.value);
    console.log("Create contact done", createContactSave);
    this.isLoading = true;
    this.isDisabled = true;
    this.contactService.getCreateContactEnrichment(createContactSave).subscribe(async data => {
      if (data.IsError === false) {
        if (!this.isModuleSwitch()) {
          this.ClearRedisCache();
        }
        this.isLoading = false;
        // sessionStorage.removeItem('selAccountObj');
        this.store.dispatch(new ClearContactList());
        this.store.dispatch(new ClearTaskList());
        sessionStorage.removeItem('CreateActivityGroup');
        sessionStorage.removeItem('CreateContactJsondata');
        sessionStorage.removeItem("Module");
        this.isReplace = true;
        await this.offlineService.clearContactListData();
        this.savePopUpShow = data.Message;
        if (sessionStorage.getItem("TempLeadDetails")) {
          let contactTemp = JSON.parse(sessionStorage.getItem("TempLeadDetails"))
          contactTemp.ownerDetails.customers.push({
            Designation: data.ResponseObject.Designation,
            FullName: data.ResponseObject.FName + ' ' + data.ResponseObject.LName,
            LinkActionType: 1,
            MapGuid: "",
            SysGuid: data.ResponseObject.Guid,
            Guid: data.ResponseObject.Guid,
            isKeyContact: data.ResponseObject.isKeyContact
          })
          contactTemp.finalCustomerGroup.push({
            Designation: data.ResponseObject.Designation,
            FullName: data.ResponseObject.FName + ' ' + data.ResponseObject.LName,
            LinkActionType: 1,
            MapGuid: "",
            SysGuid: data.ResponseObject.Guid,
            Guid: data.ResponseObject.Guid,
            isKeyContact: data.ResponseObject.isKeyContact
          })
          sessionStorage.setItem('TempLeadDetails', JSON.stringify(contactTemp))
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearTaskList());
          sessionStorage.removeItem("Module");
          this.offlineService.clearContactListData();
          sessionStorage.removeItem('CreateActivityGroup');
        }
        else if (sessionStorage.getItem("TempEditLeadDetails")) {
          let tempContact = JSON.parse(sessionStorage.getItem("TempEditLeadDetails"))
          tempContact.CustomerContacts.push({
            Designation: data.ResponseObject.Designation,
            FullName: data.ResponseObject.FName + ' ' + data.ResponseObject.LName,
            MapGuid: "",
            Guid: data.ResponseObject.Guid,
            SysGuid: data.ResponseObject.Guid,
            isKeyContact: data.ResponseObject.isKeyContact
          })
          sessionStorage.setItem('TempEditLeadDetails', JSON.stringify(tempContact))
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearTaskList());
          this.offlineService.clearContactListData();
          this.errorMessage.throwError(data.Message)
        } else {
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearTaskList());
          this.offlineService.clearContactListData();
          this.errorMessage.throwError(data.Message)
        }
        console.log("after create contact with state", data);
        let json = { FullName: this.newCustomerContactForm1.controls.firstName.value, Designation: this.newCustomerContactForm1.controls.designation.value, isKeyContact: this.newCustomerContactForm1.controls.keyContact.value, Guid: data.ResponseObject.Guid }
        this.newconversationService.customerContact = json
        let val
        // this.errorMessage.throwError(data.Message);
        this.matSnackBar.open(data.Message, val, {
          duration: 2000
        }).afterDismissed().subscribe(() => {
          if (JSON.parse(sessionStorage.getItem("TempLeadDetails"))) {
            this.router.navigateByUrl('/leads/createlead')
          }
          else if (sessionStorage.getItem("TempEditLeadDetails")) {
            this.router.navigateByUrl('leads/leadDetails/leadDetailsInfo')
          }
          else if (this.ACCOUNTROUTING == true) {
            this.router.navigate(['../accounts/contacts/accountcontacts'])
          }
          else {
            this.router.navigate(['../contacts']);
          }
        })

      } else {
        this.isLoading = false;
        this.isDisabled = false;
        this.errorMessage.throwError(data.Message);
      }
    });
  }

  createContactTempJsonData() {
    return {
      "Salutation": {
        "Id": Number(this.newCustomerContactForm1.value.salutation)
      },
      "FName": this.newCustomerContactForm1.value.firstName,
      "LName": this.newCustomerContactForm1.value.lastName,
      "Contact": this.newCustomerContactForm1.value.contacts,
      "Email": this.newCustomerContactForm1.value.emailAddress,
      "isKeyContact": this.newCustomerContactForm1.value.keyContact,
      "Referenceable": this.newCustomerContactForm1.value.referenceable,
      "ReferenceType": (this.sendReferenceType.length > 0) ? this.sendReferenceType : [],
      "ReferenceMode": this.newCustomerContactForm1.value.referenceMode === '' ? { "Id": "" } : { "Id": Number(this.newCustomerContactForm1.value.referenceMode) },
      "Category": {
        "Id": Number(this.newCustomerContactForm1.value.category),
      },
      "Designation": this.newCustomerContactForm1.value.designation,
      "Relationship": {
        "Id": Number(this.newCustomerContactForm1.value.relationship),
      },
      "LinkedinUrl": this.LinkendUrldata,
      "TwitterUrl": this.TwitterUrldata,
      "CBU": {
        SysGuid: this.selectedCBUId,
        Name: this.cbuName
      },
      "ReportingManager": {
        SysGuid: this.SelectedReportingManager,
        FullName: this.reportingmanagerName
      },
      "CustomerAddress": {
        "City": {
          SysGuid: this.selectedCityname,
          Name: this.cityName
        },
        "Country": {
          "SysGuid": this.selectedCountryname,
          "Name": this.countryName
        },
        "State": {
          "SysGuid": this.selectedStatename,
          "Name": this.stateName
        },
        "Address1": this.newCustomerContactForm1.value.address1,
        "Address2": this.newCustomerContactForm1.value.address2,
        "Street": this.newCustomerContactForm1.value.streetName,
        "ZipCode": this.newCustomerContactForm1.value.zipPostalCode
      },
      "BusinessCardImage": this.imageSrc,
      "profile": this.imageSrc1,
    }
  }

  //----------- Selection chnages for dropdown for type aria ---------------
  salutationId: any;
  salutaionName: any;
  salutationTypeAria: any
  relationId: any;
  relationName: any;
  relationTypeAria: any
  referenceModeAria: any
  referenceModeName: any;
  referenceModeId: any;
  categoryId: any;
  categoryName: any;
  categoryTypeAria: any
  functionId: any;
  functionName: any;
  functionTypeAria: any
  appendSalutationType(event) {
    console.log("appendSalutationType", event)
    if (!this.isEmpty(event)) {
      this.salutationId = event.value;
      this.salutation.forEach(element => {
        if (element.Id == this.salutationId) {
          this.salutaionName = element.Value
          this.salutationTypeAria = this.salutaionName
        }
      });
    }
  }
  appendRelationshipType(event) {
    console.log("appendRelationshipType", event);
    if (!this.isEmpty(event)) {
      this.relationId = event.value;
      this.relationship.forEach(element => {
        if (element.Id == this.relationId) {
          this.relationName = element.Value
          this.relationTypeAria = this.relationName
        }
      });
    }
  }
  appendReferenceMode(event) {
    console.log("appendReferenceMode", event);
    if (!this.isEmpty(event)) {
      this.referenceModeId = event.value;
      this.ContactReferenceMode.forEach(element => {
        if (element.Id == this.referenceModeId) {
          this.referenceModeName = element.Value
          this.referenceModeAria = this.referenceModeName
          console.log("referenceModeAria", this.referenceModeAria);
        }
      });
    }
  }
  appendCategoryType(event) {
    console.log("appendCategoryType", event);
    if (!this.isEmpty(event)) {
      this.categoryId = event.value;
      this.categoryData.forEach(element => {
        if (element.Id == this.categoryId) {
          this.categoryName = element.Value
          this.categoryTypeAria = this.categoryName
        }
      });
    }
  }
  appendFunctionType(event) {
    console.log("appendCategoryType", event);
    if (!this.isEmpty(event)) {
      this.functionId = event.value;
      this.functionType.forEach(element => {
        if (element.Id == this.functionId) {
          this.functionName = element.Value
          this.functionTypeAria = this.functionName
        }
      });
    }
  }
  //----------Selection chanange end ----------------------

  /**************** Lookup on click of input data will AutoPopulate **********************/
  callTempAccountname() {
    // if (this.newCustomerContactForm1.value.accountName == '') {
    this.isAccountNameSearchLoading = true;
    this.getAccountCompany = []
    // if(this.cacheDataService.cacheDataGet('contactAccountname').length > 0) {
    //   this.isAccountNameSearchLoading = false;
    //   this.getAccountCompany = this.cacheDataService.cacheDataGet('contactAccountname')
    // } else {
    this.contactService.getsearchAccountCompany("").subscribe(res => {
      this.isAccountNameSearchLoading = false
      this.isLoading = false;
      if (res.IsError === false) {
        this.getAccountCompany = res.ResponseObject;
        //this.cacheDataService.cacheDataSet('contactAccountname', res.ResponseObject)
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.tabledata = res.ResponseObject;
      } else {
        this.errorMessage.throwError(res.Message);
        // this.cacheDataService.cacheDataReset("contactAccountname")
      }
    }, error => {
      this.isAccountNameSearchLoading = false;
      // this.cacheDataService.cacheDataReset("contactAccountname")
    });
    //  }
    // }
    //  else {
    //   this.isAccountNameSearchLoading = false;
    // }
  }
  callTempReportingManager() {
    if (this.newCustomerContactForm1.value.reportingManager == '') {
      this.isReportingManagerSearchLoading = true
      this.getReportingManager = []
      // if(this.cacheDataService.cacheDataGet('contactReportingManager').length > 0){
      //   this.isReportingManagerSearchLoading = false;
      //   this.getReportingManager = this.cacheDataService.cacheDataGet('contactReportingManager')
      // }else{
      this.contactService.searchReportingManagerByAccountName(this.selectedAccountName, this.isProspect, "").subscribe(res => {
        this.isReportingManagerSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getReportingManager = res.ResponseObject;
          // this.cacheDataService.cacheDataSet('contactReportingManager', res.ResponseObject)
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          // this.cacheDataService.cacheDataReset("contactReportingManager")
        }
      }, error => {
        this.isReportingManagerSearchLoading = false;
        // this.cacheDataService.cacheDataReset("contactReportingManager")
      });
    }
    // } else {
    //   this.isReportingManagerSearchLoading = false;
    // }
  }
  callTempCBU() {
    if (!this.newCustomerContactForm1.value.CBU && this.CBUSwitch) {
      this.isCBUSearchLoading = true
      this.getCBU = []
      // if(this.cacheDataService.cacheDataGet('contactCBU').length > 0){
      //   this.isCBUSearchLoading = false
      //   this.getCBU = this.cacheDataService.cacheDataGet('contactCBU');
      // }else{
      this.contactService.cbuByAccountName(this.selectedAccountName, this.isProspect, "").subscribe(res => {
        this.isCBUSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getCBU = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactCBU', res.ResponseObject);
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactCBU');
        }
      }, error => {
        this.isCBUSearchLoading = false;
        this.cacheDataService.cacheDataReset('contactCBU');
      });
    }
    // } else {
    //   this.isCBUSearchLoading = false;
    // }
  }
  callTempCountry() {
    this.newCustomerContactForm1.patchValue({
      country: ''
    })
    this.isCountrySearchLoading = true
    this.getCountry = []
    if (this.cacheDataService.cacheDataGet('contactCountry').length > 0) {
      this.isCountrySearchLoading = false
      this.getCountry = this.cacheDataService.cacheDataGet('contactCountry');
    } else {
      this.contactService.getAllCountry("").subscribe(res => {
        this.isCountrySearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getCountry = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactCountry', res.ResponseObject);
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactCountry');
        }
      }, error => {
        this.isCountrySearchLoading = false;
        this.cacheDataService.cacheDataReset('contactCountry');
      });
    }
  }
  callTempState() {
    this.newCustomerContactForm1.patchValue({
      stateProvince: ''
    })
    this.isStateSearchLoading = true
    this.getState = []
    if (this.cacheDataService.cacheDataGet('contactState').length > 0) {
      this.isStateSearchLoading = false
      this.getState = this.cacheDataService.cacheDataGet('contactState');
    } else {
      this.contactService.searchStateByCountry(this.selectedCountryname, "").subscribe(res => {
        this.isStateSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getState = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactState', res.ResponseObject);
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactState');
        }
      }, error => {
        this.isStateSearchLoading = false;
        this.cacheDataService.cacheDataReset('contactState');
      });
    }
  }
  callTempCity() {
    this.newCustomerContactForm1.patchValue({
      City: ''
    })
    this.isCitySearchLoading = true
    this.getCity = []
    if (this.cacheDataService.cacheDataGet('contactCity').length > 0) {
      this.isCitySearchLoading = false
      this.getCity = this.cacheDataService.cacheDataGet('contactCity');
    } else {
      this.contactService.SearchCityByState(this.selectedStatename, "").subscribe(res => {
        this.isCitySearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getCity = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactCity', res.ResponseObject);
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactCity');
        }
      }, error => {
        this.isCitySearchLoading = false;
        this.cacheDataService.cacheDataReset('contactCity');
      });
    }
  }
  callTempInterest() {
    this.newCustomerContactForm2.patchValue({
      intrest: ''
    })
    this.isInterestSearchLoading = true
    this.getIntrest = []
    if (this.cacheDataService.cacheDataGet('contactInterest').length > 0) {
      this.isInterestSearchLoading = false
      this.getIntrest = this.cacheDataService.cacheDataGet('contactInterest');
    } else {
      this.contactService.getSearchInterestByname("").subscribe(res => {
        this.isInterestSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getIntrest = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactInterest', res.ResponseObject);
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactInterest');
        }
      }, error => {
        this.isInterestSearchLoading = false;
        this.cacheDataService.cacheDataReset('contactInterest');
      });
    }
  }
  callTempReferenceType() {
    this.newCustomerContactForm1.patchValue({
      referenceType: ''
    })
    this.isReferenceTypeSearchLoading = true
    this.getReferenceType = []
    if (this.cacheDataService.cacheDataGet('contactReferenceType').length > 0) {
      this.isReferenceTypeSearchLoading = false
      this.getReferenceType = this.cacheDataService.cacheDataGet('contactReferenceType');
    } else {
      this.contactService.getSearchReferenceTypeByID("").subscribe(res => {
        this.isReferenceTypeSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getReferenceType = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactReferenceType', res.ResponseObject);
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactReferenceType');
        }
      }, error => {
        this.isReferenceTypeSearchLoading = false;
        this.cacheDataService.cacheDataReset('contactReferenceType');
      });
    }
  }
  /****************Lookup on click of input data ending**********************/

  /****************Advance search popup starts**********************/
  lookUpColumn(controlName, value, isTyping?) {
    if (controlName == 'accountSearch') {
      this.lookupdata.isBackbuttonrequired = true;
    }
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = contactAdvnHeaders[controlName]
    this.lookupdata.lookupName = contactAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = contactAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = contactAdvnNames[controlName]['isAccount']
    // this.lookupdata.inputValue = isTyping ? isTyping == "-1" ? '' : value : value;
    this.lookupdata.inputValue = value;
  }
  openadvancetabs(controlName, initalLookupData, value, isTyping?): void {
    this.lookUpColumn(controlName, value, isTyping)
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    if (this.lookupdata.controlName == 'accountSearch') {
      this.lookupdata.Isadvancesearchtabs = true;
    } else {
      this.lookupdata.Isadvancesearchtabs = false;
    }
    this.contactService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
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
        this.contactService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.errorMsg.isError = false;
          if (res.IsError == false) {
            this.lookupdata.errorMsg.message = ''
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
          } else {
            this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
          }
        }, error => {
          this.lookupdata.isLoader = false;
          this.lookupdata.errorMsg.isError = false;
        });
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
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        if (result.wiprodb == false) {
          this.service.sendProspectAccount = true;
          this.groupData(result);
          //setting session data for creating prospect account
          sessionStorage.setItem('CreateContactJsondata', JSON.stringify(this.createContactTempJsonData()))
          this.router.navigateByUrl('/contacts/prospectAccount');
        } else {
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
          console.log("country", res.ResponseObject)
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
        this.lookupdata.errorMsg.isError = false;
      })
    }
  }

  groupData(result) {
    console.log("prospect account", result)
    var object = {
      activityGroupName: "",
      account: {
        Name: (result.selectedData.length != 0) ? (result.selectedData[0].Name) ? result.selectedData[0].Name : "" : "",
        Id: (result.selectedData.length != 0) ? (result.selectedData[0].Id) ? result.selectedData[0].Id : "" : "",
        Industry: (result.selectedData.length != 0) ? (result.selectedData[0].Industry) ? result.selectedData[0].Industry : "" : "",
        Region: (result.selectedData.length != 0) ? (result.selectedData[0].Region) ? result.selectedData[0].Region : "" : ""
      },
      model: 'Create contact enrich',
      route: 'contacts/CreateContactComponent'
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
      guid: this.ContactGuid,
      accountGuid: this.selectedAccountName,
      isProspect: this.isProspect,
    }
  }
  /*****************Advance search popup ends*********************/

  onkeypress(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode == 43 || event.charCode == 45) || event.charCode >= 48 && event.charCode <= 57
  }
  removeNumbers(event) {
    var k = event.charCode;
    if (k == 32 && event.target.value.length === 0) {
      if ((k > 47 && k < 58) || (k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8)) {
        this.designationErrorMessage = null;
        return ((k > 47 && k < 58) || k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8);
      } else {
        this.designationErrorMessage = "Special characters are not allowed";
      }
    } else if ((k > 47 && k < 58) || (k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32)) {
      this.designationErrorMessage = null;
      return ((k > 47 && k < 58) || k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32);
    } else {
      this.designationErrorMessage = "Special characters are not allowed";
    }
  }

  zipCodeValidate(event) {
    var k = event.charCode;
    if (k == 32 && event.target.value.length === 0) {
      return ((k > 47 && k < 58) || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 47 || k == 45)
    } else {
      return ((k > 47 && k < 58) || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 47 || k == 45)
    }
  }

  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopComponent, {
      disableClose: true,
      width: '400px',
      data: ""
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      //  if (this.ACCOUNTROUTING == true) {
      //   this.router.navigate(['../accounts/contacts/accountcontacts'])
      // }
      // else {
      //   this.router.navigate(['../contacts']);
      // }

      if (res) {
        if (!this.isModuleSwitch()) {
          this.ClearRedisCache();
          this.isReplace = true;
        }
        this.navTo();
      }
    })
  }

  navTo() {
    sessionStorage.removeItem('CreateActivityGroup');
    sessionStorage.removeItem('CreateContactJsondata');
    if (sessionStorage.getItem('Module')) {
      this.routingState.backClicked()
    }
    sessionStorage.removeItem("Module");
    console.log('get Two Previous url-->', this.routingState.getTwoPreviousUrl())
    if (sessionStorage.getItem('TempLeadDetails')) {
      this.routingState.backClicked()
    } else if (sessionStorage.getItem("TempEditLeadDetails")) {
      this.routingState.backClicked()
    }
    else if (this.routingState.getTwoPreviousUrl().includes('newmeeting')) {
      this.router.navigate(['/activities/newmeeting'])
    } if (this.ACCOUNTROUTING == true) {
      this.router.navigateByUrl('/accounts/contacts/accountcontacts')
    } else {
      this.router.navigate(['../contacts'])
    }
    this.contactService.AbridgedInfo = undefined
    this.contactService.EnrichedInfo = undefined
  }

  opensocial(condition, sData) {
    switch (condition) {
      case 'twitter': {
        const dialogRef = this.dialog.open(socialpopComponent,
          {
            disableClose: true,
            width: '396px',
            data: { name: "Link twitter account", isTwitter: true, socialData: sData }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.TwitterUrldata = result.url;
          }
        });
        return;
      }
      case 'linkedin': {
        const dialogRef = this.dialog.open(socialpopComponent,
          {
            disableClose: true,
            width: '396px',
            data: { name: "Link linkedin account", isTwitter: false, socialData: sData }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.LinkendUrldata = result.url;
          }
        });
        return;
      }
    }
  }

  //----------- Profile pic upload start -------------------
  accept = ['image/jpg', 'image/jpeg', 'image/png', 'image/PJP', 'image/gif'];
  detectFiles(e) {
    let fileList: FileList = e.target.files
    let uploadingFileList = [];
    if (fileList.length > 0) {
      var file: File = fileList[0]
      // var pattern = /image-*/;
      var reader = new FileReader();
      const fd: FormData = new FormData();
      fd.append('file', file);
      console.log('formData after appending-->', fd)
      uploadingFileList.push(fd)
      this.isLoading = true;
      if (!this.accept.includes(file.type)) {
        this.isLoading = false;
        this.errorMessage.throwError('Please upload a valid image format');
        return
      }
      else {
        if (file.size > 5242880) {
          this.isLoading = false;
          this.errorMessage.throwError("Not able to upload the file because filesize is greater than 5mb")
        } else {
          this.fileService.filesToUploadDocument64(uploadingFileList).subscribe((res) => {
            this.isLoading = false;
            if (res) {
              console.log('res-->', res)
              var data = "data:" + res[0].ResponseObject.MimeType + ";base64," + res[0].ResponseObject.Base64String;
              this.profileUrl = res[0].ResponseObject.Url;
              this.imageSrc1 = data;
              this.autoSaveChangedData(true);
            }
          },error => {this.isLoading = false;})
        }
      }
    }
  }

  deleteprofileImage(): void {
    this.img = true;
    const dialogRef = this.dialog.open(deleteprofilecontactComponent, {
      disableClose: true,
      width: '400px',
      data: { image: this.imageSrc1 }
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("res", res);
      if (res) {
        this.imageSrc1 = null;
      }
    });
  }
  //-------------profile upload finish---------

  //----------------- Business card  upload--------------

  isReplace: boolean = true
  public detectFilesRead(e, eleId: string): void | boolean {
    console.log("ee", e)
    var data = <HTMLInputElement>document.getElementById(eleId);
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    if (!this.accept.includes(file.type)) {
      this.isLoading = false;
      this.errorMessage.throwError('Please upload a valid image format');
      return
    }
    if (file.type && file.type.match(pattern)) {
      if (file.size > 5242880) {
        this.isLoading = false;
        this.errorMessage.throwError("Not able to upload the file because filesize is greater than 5mb")
        return false;
      } else {
        var reader = new FileReader();
        this.businessCardFile = file;
        reader.readAsDataURL(file);
        reader.onload = this._handleReaderLoaded.bind(this);
        console.log('base 64', reader.onload);

      }
    } else {
      data.value = "";
      this.errorMessage.throwError("Please upload a valid file");
      return false;
    }
  }

  private businessCardFile: File;
  _handleReaderLoaded(e) {
    this.imageSrc = null;
    let reader = e.target;
    console.log('Card reader data---->', reader)
    let imgSrc = reader.result;
    console.log('imageSrc--->', this.imageSrc);
    let response: any;
    this.isLoading = true;
    this.fileService.base64to_ocr(imgSrc).subscribe((res) => {
      this.isLoading = false;
      let data = (typeof (res) == "string") ? JSON.parse(res) : ''
      this.uploadFileAPICall(this.businessCardFile, data);
    });
  }
  private retry = 0;
  private uploadFileAPICall(file: File, response: any): void {
    const formData: FormData = new FormData();
    formData.append('file', file);
    this.isLoading = true;
    this.fileService.filesToUploadDocument64([formData]).subscribe((res) => { 
      this.isLoading = false;
      if (res) {
        console.log('res-->', res)
        var data = "data:" + res[0].ResponseObject.MimeType + ";base64," + res[0].ResponseObject.Base64String;
        this.businessCardUrl = res[0].ResponseObject.Url;
        this.imageSrc = data;
        this.businessCardFile = undefined;
        this.autoSaveChangedData(true);
        if (response) {
          if (this.isReplace == true) {
            if (response.Result.Content[0].name.length > 0) {
              this.newCustomerContactForm1.patchValue({ firstName: response.Result.Content[0].name[0] });
            }
            if (response.Result.Content[0].name.length > 0) {
              this.newCustomerContactForm1.patchValue({ lastName: response.Result.Content[0].name[1] });
            }
            if (response.Result.Content[0].designation.length > 0) {
              this.newCustomerContactForm1.patchValue({ designation: response.Result.Content[0].designation[0] });
            }
            if (response.Result.Content[0].email.length > 0) {
              this.newCustomerContactForm1.patchValue({ emailAddress: response.Result.Content[0].email[0] });
            }
            if (response.Result.Content[0].number.length > 0) {
              const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
                {
                  ContactNo: contactInfo,
                  ContactType: 1,
                  MapGuid: "",
                }
              ));
              const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
              this.newCustomerContactForm1.setControl('contacts', phoneNumberFormArray);
            }
            if (response.Result.Content[0].address.length > 0) {
              this.newCustomerContactForm1.patchValue({ address1: response.Result.Content[0].address[0] });
            }
          } else {
            if (this.newCustomerContactForm1.controls.firstName.value) {
              this.newCustomerContactForm1.patchValue({ firstName: this.newCustomerContactForm1.controls.firstName.value });
            } else {
              this.newCustomerContactForm1.patchValue({ firstName: response.Result.Content[0].name[0] })
            }
            if (this.newCustomerContactForm1.controls.lastName.value) {
              this.newCustomerContactForm1.patchValue({ lastName: this.newCustomerContactForm1.controls.lastName.value });
            } else {
              this.newCustomerContactForm1.patchValue({ lastName: response.Result.Content[0].name[1] });
            }
            if (this.newCustomerContactForm1.controls.designation.value) {
              this.newCustomerContactForm1.patchValue({ designation: this.newCustomerContactForm1.controls.designation.value });
            } else {
              this.newCustomerContactForm1.patchValue({ designation: response.Result.Content[0].designation[0] });
            }
            if (this.newCustomerContactForm1.controls.emailAddress.value) {
              this.newCustomerContactForm1.patchValue({ emailAddress: this.newCustomerContactForm1.controls.emailAddress.value });
            } else {
              this.newCustomerContactForm1.patchValue({ emailAddress: response.Result.Content[0].email[0] });
            }
            if (this.newCustomerContactForm1.controls.address1.value) {
              this.newCustomerContactForm1.patchValue({ address1: this.newCustomerContactForm1.controls.address1.value });
            } else {
              this.newCustomerContactForm1.patchValue({ address1: response.Result.Content[0].address[0] });
            }
            console.log("business phone", this.newCustomerContactForm1.controls.contacts.value)
            if (response.Result.Content[0].number.length > 0) {
              const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
                {
                  ContactNo: contactInfo,
                  ContactType: 1,
                  MapGuid: "",
                }
              ));
              const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
              this.newCustomerContactForm1.setControl('contacts', phoneNumberFormArray);
            }
          }

          this.phoneContactType.forEach(element => {
            if (element.Id === 2) {
              this.newCustomerContactForm1.patchValue({
                phoneType: element.Id
              })
              return;
            }
          });
        } 
      }
    },error => {this.isLoading = false;})



    // this.fileService.filesToUpload([formData]).subscribe(fileUpload => {
    //   if (fileUpload) {
    //     this.isLoading = false;
    //     console.log("image upload done from service", fileUpload);
    //     this.imageSrc = fileUpload.toString()
    //     this.businessCardUrl = this.imageSrc;
    //     this.autoSaveChangedData(true);
    //     console.log('imageSrc-->', this.imageSrc);
    //     this.retry = 0;
    //     this.businessCardFile = undefined;
    //     //this condition is for fatching the business card data
    //     if (response) {
    //       if (this.isReplace == true) {
    //         if (response.Result.Content[0].name.length > 0) {
    //           this.newCustomerContactForm1.patchValue({ firstName: response.Result.Content[0].name[0] });
    //         }
    //         if (response.Result.Content[0].name.length > 0) {
    //           this.newCustomerContactForm1.patchValue({ lastName: response.Result.Content[0].name[1] });
    //         }
    //         if (response.Result.Content[0].designation.length > 0) {
    //           this.newCustomerContactForm1.patchValue({ designation: response.Result.Content[0].designation[0] });
    //         }
    //         if (response.Result.Content[0].email.length > 0) {
    //           this.newCustomerContactForm1.patchValue({ emailAddress: response.Result.Content[0].email[0] });
    //         }
    //         if (response.Result.Content[0].number.length > 0) {
    //           const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
    //             {
    //               ContactNo: contactInfo,
    //               ContactType: 1,
    //               MapGuid: "",
    //             }
    //           ));
    //           const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
    //           this.newCustomerContactForm1.setControl('contacts', phoneNumberFormArray);
    //         }
    //         if (response.Result.Content[0].address.length > 0) {
    //           this.newCustomerContactForm1.patchValue({ address1: response.Result.Content[0].address[0] });
    //         }
    //       } else {
    //         if (this.newCustomerContactForm1.controls.firstName.value) {
    //           this.newCustomerContactForm1.patchValue({ firstName: this.newCustomerContactForm1.controls.firstName.value });
    //         } else {
    //           this.newCustomerContactForm1.patchValue({ firstName: response.Result.Content[0].name[0] })
    //         }
    //         if (this.newCustomerContactForm1.controls.lastName.value) {
    //           this.newCustomerContactForm1.patchValue({ lastName: this.newCustomerContactForm1.controls.lastName.value });
    //         } else {
    //           this.newCustomerContactForm1.patchValue({ lastName: response.Result.Content[0].name[1] });
    //         }
    //         if (this.newCustomerContactForm1.controls.designation.value) {
    //           this.newCustomerContactForm1.patchValue({ designation: this.newCustomerContactForm1.controls.designation.value });
    //         } else {
    //           this.newCustomerContactForm1.patchValue({ designation: response.Result.Content[0].designation[0] });
    //         }
    //         if (this.newCustomerContactForm1.controls.emailAddress.value) {
    //           this.newCustomerContactForm1.patchValue({ emailAddress: this.newCustomerContactForm1.controls.emailAddress.value });
    //         } else {
    //           this.newCustomerContactForm1.patchValue({ emailAddress: response.Result.Content[0].email[0] });
    //         }
    //         if (this.newCustomerContactForm1.controls.address1.value) {
    //           this.newCustomerContactForm1.patchValue({ address1: this.newCustomerContactForm1.controls.address1.value });
    //         } else {
    //           this.newCustomerContactForm1.patchValue({ address1: response.Result.Content[0].address[0] });
    //         }
    //         console.log("business phone", this.newCustomerContactForm1.controls.contacts.value)
    //         if (response.Result.Content[0].number.length > 0) {
    //           const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
    //             {
    //               ContactNo: contactInfo,
    //               ContactType: 1,
    //               MapGuid: "",
    //             }
    //           ));
    //           const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
    //           this.newCustomerContactForm1.setControl('contacts', phoneNumberFormArray);
    //         }
    //       }

    //       this.phoneContactType.forEach(element => {
    //         if (element.Id === 2) {
    //           this.newCustomerContactForm1.patchValue({
    //             phoneType: element.Id
    //           })
    //           return;
    //         }
    //       });
    //     } 
    //     // else {
    //     //   this.errorMessage.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?")
    //     // }
    //   } (error) => {
    //     this.isLoading = false;
    //     if (this.retry == 3) {
    //       this.errorMessage.throwError(error);
    //     } else {
    //       this.uploadFileAPICall(file, response);
    //     }
    //   }
    // }, err => {
    //   this.isLoading = false;
    //   if (this.retry == 3) {
    //     this.errorMessage.throwError(err);
    //   } else {
    //     this.uploadFileAPICall(file, response);
    //   }
    // });;


  }



  replaceBusinessCardImg() {
    const dialogRef = this.dialog.open(replaceImgComponentcontact,
      {
        disableClose: true,
        width: '396px',
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.isReplace = res;
      }
    })
  }
  deleteBusinessCard($event) {
    this.img = true;
    const dialogRef = this.dialog.open(deleteImgComponentcontact,
      {
        disableClose: true,
        width: '396px',
        data: { image: this.imageSrc }
      });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("res", res);
      if (res) {
        this.imageSrc = null;
        document.getElementById('image').removeAttribute('src');
        document.getElementById('image').setAttribute("src", null);
        this.isReplace = true;
      }
    })
  }

  //-------------file upload finish---------

  contactTypeChanges($event) {
    console.log('Value -->', $event.target.value)
    let contactType = $event.target.value
    if (contactType == '') {
      this.newCustomerContactForm1.controls['phoneNumber'].reset()
    }
  }
  contactTypeChangesMobile($event) {
    console.log('Value -->', $event.target.value)
    let contactType = $event.target.value
    if (contactType == '') {
      this.newCustomerContactForm1.controls['phoneNumber'].reset()
    }
  }
  contactTypeChangesWeb(value) {
    console.log('Value -->', value)
    let contactType = value
    if (contactType == '') {
      this.newCustomerContactForm1.controls['phoneNumber'].reset()
    }
  }

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }
  stepone() {
    this.leadinfo = true;
    this.dealinfo = false;
    this.twoactive = false;
    // this.marketingInformation();
    this.service.windowScroll();
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

  phoneValidation: boolean = false;
  steptwo() {
    console.log("this.newCustomerContactForm1", this.newCustomerContactForm1);
    // this.newCustomerContactForm1.value.referenceMode = ''
    if (this.selectedAccountName === undefined) {
      this.newCustomerContactForm1.patchValue({ accountName: '' })
    }
    console.log(this.newCustomerContactForm1.value.contacts)
    this.newCustomerContactForm1.value.contacts.forEach(element => {
      if (element.ContactType != "" && element.ContactNo == "") {
        this.phoneValidation = true
      } else {
        this.phoneValidation = false
      }
    })
    if (this.newCustomerContactForm1.valid && this.phoneValidation == false) {
      this.leadinfo = false;
      this.dealinfo = true;
    } if (!this.newCustomerContactForm1.valid && this.phoneValidation == false) {
      this.service.validateAllFormFields(this.newCustomerContactForm1);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
    this.service.windowScroll();
  }

  ClearRedisCache() {
    this.service.SetRedisCacheData("empty", 'L2O_CREATE_CONTACT').subscribe(res => console.log(res))
  }

  ngOnDestroy(): void {
    this.meetingService.customerContactAccountFromMeeting = undefined
    this.contactService.AbridgedInfo = undefined

  }

  opencreate() {
    const dialogRef = this.dialog.open(createpopComponent,
      {
        disableClose: true,
        width: '396px',
      })
    dialogRef.componentInstance.data = this.newCustomerContactForm1.value.firstName + ' ' + this.newCustomerContactForm1.value.lastName;
    dialogRef.afterClosed().subscribe(res => {
      this.errorMessage.throwError(this.savePopUpShow);
    });
  }

  openduplicatepop(): void {
    const dialogRef = this.dialog.open(errorpopcomponent, {
      disableClose: true,
      width: '400px',
      data: this.EmailChecksConatctGuild
    });

    dialogRef.afterClosed().subscribe(x => {
      console.log("View To Detail");
      this.router.navigateByUrl('/contacts/Contactdetailslanding/contactDetailsChild');
    })
  }
  openCopyPopup(res) {
    const dialogRef = this.dialog.open(copyAddressComponent,
      {
        disableClose: true,
        width: '396px',
        data: res
      });
    dialogRef.afterClosed().subscribe(res => {
      this.newCustomerContactForm1.patchValue({ country: "" });
      this.newCustomerContactForm1.patchValue({ City: "" });
      this.newCustomerContactForm1.patchValue({ stateProvince: "" });
      this.newCustomerContactForm1.patchValue({ address1: "" });
      this.newCustomerContactForm1.patchValue({ address2: "" });
      this.newCustomerContactForm1.patchValue({ zipPostalCode: "" });
      console.log(res);
      if (res == 'ok') {
        if (this.accountNameAddressCopy != undefined) {
          this.countryStateCityAutoPopulate();
        }
      }
    });
  }

}

@Component({
  selector: 'app-replace-img',
  templateUrl: './replace-img.html',
  styleUrls: ['./create-contact.component.scss']
})
export class replaceImgComponentcontact implements OnInit {
  constructor(
    public service: DataCommunicationService, public dialogRef: MatDialogRef<replaceImgComponentcontact>) { }

  ngOnInit() {
  }
  replaceInformation() {
    console.log("replace Information click");
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(true);
  }
  retailInformation() {
    console.log("Retail information click")
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(false);
  }

}

@Component({
  selector: 'app-delete-img',
  templateUrl: './delete-img.html',
})
export class deleteImgComponentcontact {
  img = true;
  img1 = true;
  constructor(public dialogRef: MatDialogRef<createpopComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
}

@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
  styleUrls: ['./create-contact.component.scss']
})
export class cancelpopComponent implements OnInit {
  constructor(
    public routingState: RoutingState,
    public router: Router,
    public contactService: ContactService,
    @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
  }

}

@Component({
  selector: 'create-pop',
  templateUrl: './create-pop.html',
})
export class createpopComponent {
  data: any;
  constructor(public router: Router,
    public routingState: RoutingState,
    public dialogRef: MatDialogRef<createpopComponent>) {
  }
  onOkClick() {
    this.dialogRef.close();
    console.log(this.routingState.getPreviousUrl());
    if (this.routingState.getTwoPreviousUrl().includes('/activities/newmeeting')) {
      this.router.navigate(['../activities/newmeeting'])
    } else {
      this.router.navigate(['../contacts']);
    }
  }
}

@Component({
  selector: 'social-popup',
  templateUrl: './social-pop.html',
  styleUrls: ['./create-contact.component.scss']
})
export class socialpopComponent implements OnInit {

  validatesocialMediaForm: FormGroup;                                                               // this is two way data binding from popup
  showError: boolean = false;
  constructor(public dialogRef: MatDialogRef<socialpopComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public contactService: ContactService,
    private fb: FormBuilder, ) { }
  ngOnInit() {
    this.CreateSocialMediaDetails();
  }
  CreateSocialMediaDetails() {
    this.validatesocialMediaForm = this.fb.group({
      twitterUrl: [this.data.socialData, null],
    });
  }
  saveSocial() {
    console.log('social media form', this.validatesocialMediaForm.controls);
    if (this.data.isTwitter === true) {
      if (this.validatesocialMediaForm.value.twitterUrl === "") {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
        return;
      }
      if (this.validatesocialMediaForm.value.twitterUrl.length > 0) {
        let twitterValue = this.validatesocialMediaForm.value.twitterUrl.trim()
        if (twitterValue === "") {
          this.showError = true
          return;
        }
      }
      if (this.validatesocialMediaForm.value.twitterUrl.trim().length > 0) {
        var regexp = /^http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/i;
        if (regexp.test(this.validatesocialMediaForm.value.twitterUrl)) {
          let json = { url: this.validatesocialMediaForm.value.twitterUrl, isTwitter: this.data.isTwitter }
          this.dialogRef.close(json);
          this.showError = false
        } else {
          this.showError = true
        }
      }
      else {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
      }
    } else {
      if (this.validatesocialMediaForm.value.twitterUrl === "") {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
        return;
      }
      if (this.validatesocialMediaForm.value.twitterUrl.length > 0) {
        let twitterValue = this.validatesocialMediaForm.value.twitterUrl.trim()
        if (twitterValue === "") {
          this.showError = true
          return;
        }
      }
      if (this.validatesocialMediaForm.value.twitterUrl.trim().length > 0) {
        var regexp = /^(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;;
        regexp.ignoreCase;
        if (regexp.test(this.validatesocialMediaForm.value.twitterUrl)) {
          let json = { url: this.validatesocialMediaForm.value.twitterUrl, isTwitter: this.data.isTwitter }
          this.dialogRef.close(json);
          this.showError = false
        } else {
          this.showError = true
        }
      }
      else {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
      }
    }
  }

}
@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.html',
})
export class deleteprofilecontactComponent {
  img = true;
  img1 = true;
  constructor(public dialogRef: MatDialogRef<createpopComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
}
@Component({
  selector: 'app-error-pop',
  templateUrl: './Error-pop.html',
  styleUrls: ['./create-contact.component.scss']
})
export class errorpopcomponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<createpopComponent>, public router: Router, @Inject(MAT_DIALOG_DATA) public data) { }
  ViewToDetail() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.data;
  }

}


/***********Copy address popup********** */
@Component({
  selector: 'app-copy-address',
  templateUrl: './copy-address-pop.html',
  styleUrls: ['./create-contact.component.scss']
})
export class copyAddressComponent implements OnInit {
  constructor(
    public routingState: RoutingState,
    public router: Router,
    public contactService: ContactService,
    public dialogRef: MatDialogRef<copyAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }
  ngOnInit() {
    console.log("copyAddressComponent", this.data);
  }

}