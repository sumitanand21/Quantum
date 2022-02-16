import { Component, OnInit, ElementRef, HostListener, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
// import { DataCommunicationService } from '@app/core';
import { AccountService, AccountAdvnNames, AccountNameListAdvnHeaders } from '@app/core/services/account.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
// raviteja popups
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService, websiteValidator } from '@app/shared/services/validation.service';
import { AccountOwnerPopupComponent } from '@app/shared/modals/account-owner-popup/account-owner-popup.component';
import { ConfirmSubmitPopupComponent } from '@app/shared/modals/confirm-submit-popup/confirm-submit-popup.component';
import { SwapPopupComponent } from '@app/shared/modals/swap-popup/swap-popup.component';
import { SwapCreatePopupComponent } from '@app/shared/modals/swap-create-popup/swap-create-popup.component';
import { SearchAccountPopupComponent } from '@app/shared/modals/search-account-popup/search-account-popup.component';
import { SearchAccountDataBasePopupComponent } from '@app/shared/modals/search-account-DataBase-popup/search-account-DataBase-popup.component';
import { CancelNoYesPopupComponent } from '@app/shared/modals/cancel-no-yes-popup/cancel-no-yes-popup.component';
import { AppState } from '@app/core/state';
/* Master API import */
import { MasterApiService } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { activeRequestsclear } from '@app/core/state/actions/Creation-History-List.action';
import { farmingRequestsclear } from '@app/core/state/actions/farming-account.action';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { ExistingAccountPopupComponent } from '@app/shared/modals/existing-account-popup/existing-account-popup.component';
//import { PerformAction } from '@ngrx/store-devtools/src/actions';
import { ExistingReservePopupComponent } from '@app/shared/modals/existing-reserve-popup/existing-reserve-popup.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
// import { MastermasterApi } from '@app/core/services/master-api.service';
// import { MyOpenLeadsService, LeadCustomErrorMessages, leadAdvnHeaders, leadAdvnNames } from '@app/core/services/myopenlead.service';


@Component({
  selector: 'app-create-new-account',
  templateUrl: './create-new-account.component.html',
  styleUrls: ['./create-new-account.component.scss']
})
export class CreateNewAccountComponent implements OnInit {
  isLoading: boolean = false;
  existingRatio: any;
  loggedUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  leadinfo = false;
  greenborder = true;
  dealinfo = false;
  twoactive = false;
  ownerdetails = false;
  editablefields = false;
  account: number = 4;
  editablefields1 = false;
  seletedValue = "Browse";
  resultData: any;
  butDisabled: boolean = true;
  alternativeownerSwitch: boolean;
  alternativeowner = [];
  OwnDetailsForm: FormGroup;
  AccDetailsForm: FormGroup;
  formsData: any;
  submitted = false;
  huntingRatio: any;
  altHuntingRatio: any;
  accountCreationObj = {};
  createDropdown: any = { 'Currency': [], 'entity': [], 'ownershipTypes': [] };
  growthCatagoryvalue: any;
  coveragelevelvalue: any;
  revenueCatagoryvalue: any;
  parentaccount: any = [];
  UparentNameSwitch: boolean = false;
  parentNameSwitch: boolean = false;
  parentName: any;
  ultimateParentName: any;
  country1NameSwitch: boolean;
  country1Name: any;
  countryId: any;
  countrybyname: any;
  statebyname: any;
  Sbudata: any = [];
  SbuId: any;
  verticaldata: any = [];
  verticalId: any;
  subverticaldata: any = [];
  advancesubverticaldata: any = [];
  financialyeardata: any = [];
  FinacialName: any;
  FinacialNameSwitch: boolean = false;
  geo: any;
  dunsnumber: any
  dunsNumberSwitch: boolean = false;
  // parentsdunsnumber: any;
  roleType: any;
  // ultimateParentsDunsnumber: any;
  emailFormat = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}";
  phoneFormat = "[0-9]{10}$";
  // websiteFormat = "[A-Za-z0-9_@./#&+-]+\\.[A-Za-z0-9_@./#&+-]$";
  urlFormat = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  showConversation: boolean = false;
  Conversation: string = '';
  ConversationNameSwitch: boolean = true;
  postActionCode: number = 0;
  firstFormSubmitted: boolean = false;
  overallStatus: number = 184450009;
  selected_cur: string = '';
  currencyLists = { '1': '$', '2': '€', '3': '₹' };
  sub_and_vertical: any = [];
  allSwapableAccount: any = [];
  dnbtoken: any;
  dnbresult: any;
  accountdetails: any;
  isActivityGroupSearchLoading: boolean;
  location_temp: any = [];
  createDropDown: any = {
    geography: [],
    region: [],
    state: [],
    city: [],
    finanacialyear: [],
    country: [],
    advanceLookupRegion: [],
    advanceLookupState: [],
    advanceLookupCity: [],
    advanceLookupCountry: []
  };
  searchAccount1: any;
  searchAltAccount: any
  cityCountryValid: boolean = false;
  owner: any;
  parentflag: any = false;
  parentaccountdetailes: any;
  parentaccountname: any;
  subscription: Subscription;
  ConversationNameSwitchlead: boolean = false;
  arrowkeyLocation = 0;
  accountNameSource: Array<any>;
  conversationNameSwitchAccountName: boolean = false;
  accountNameField: any;
  isAccountNameSearchLoading: boolean;
  IsChildAccountName: boolean = false;
  customValidators = { 'owner': true, 'sbu': true, 'vertical': true, 'subvertical': true, 'geography': true, 'region': true, 'country': true, 'state': false, 'city': false };
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    pageNo: 1,
    nextLink: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    Guid: '',
    casesensitive: true

  };
  ownername: any;
  ParentAccountSelected: any;
  sendAccountNameToAdvance: any = [];
  IsModuleSwitch;
  showFirstForm: boolean;
  AccountSelected: any;
  leadSourceSelected: any;
  leadSourceId: any;
  leadSrcName: any;
  sendParentAccountNameToAdvance: any = [];
  sendUltimateAccountAdvance: any = [];
  ultimateParentAccountSelected: any;
  sendOwnerToAdvance: any = [];
  ownerAccountSelected: any;
  altOwnerAccountSelected: any;
  AltOwnerName = '';
  sendSbuToAdvance: any = [];
  sbuAccountSelected: any;
  sendVerticalToAdvance: any = [];
  verticalSelected: any;
  sendSubVerticaltoAdvance: any = [];
  subVerticalSelected: any;
  sendCurrencytoAdvance: any = [];
  currencySelected: any;
  currencyaccount;
  sendGeographytoAdvance: any = [];
  geographySelected: any;
  sendRegiontoAdvance: any = [];
  regionSelected: any;
  sendCountrytoAdvance: any = [];
  countrySelected: any;
  sendSatetoAdvance: any = [];
  stateSelected: any;
  sendCitytoAdvance: any = [];
  sendAltOwnerToAdvance = [];
  altownerAccountSelected = [];
  allaltSwapableAccount = [];
  citySelected: any;
  currencyNameSwitch: any;
  draftSysGuid: any;
  draftDetails: any;
  IsSubVerticalExist: boolean = true;
  account2: any;
  account1: any;
  advancelookupVertical: any = [];
  TempLeadDetails;
  IsOwner: any;
  showmessage: boolean = true;
  accountownername: any;
  draftownername: any;
  advanceLookupCurrency;
  ParentAccountNameData: any = '';
  ultimateParentAccountName;
  CurrencyData = '';
  SbuName = '';
  geoName; any = '';
  OwnerName = '';
  regionName: any = '';
  stateName = '';
  cityNameField = '';
  countryNameField: any = '';
  VerticalName = '';
  SubverticalName = '';
  clusterdata: any;
  cluster: any;
  isclusterexist: boolean = false;
  wiproaccounts: any;
  wiprodb: any;
  accountname: any;
  countryname: any;
  pincode: any;
  parentdetailes: any;
  prospectAccForm: any;
  clusterSelected: any;
  clustertoAdvLookup: any = [];
  ClusterName = '';
  ultimateparentaccountnameData;
  prospectaccountdata: any;
  prospectSysGuid: any;
  isprospectexist: boolean = false;
  cityexists: any;
  draftcountry: any;
  subverticalexists: any;
  prospectcountry: any;
  prospectcityexist: any;
  isloadmore: boolean;
  constructor(public dialog: MatDialog,
    public location: Location,
    public accservive: DataCommunicationService,
    public el: ElementRef,
    private _fb: FormBuilder,
    public userdat: DataCommunicationService,
    // private masterApi: MasterApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private EncrDecr: EncrDecrService,
    public validate: ValidationService,
    public accountListService: AccountListService,
    private store: Store<AppState>,
    public master3Api: S3MasterApiService,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService
  ) {
    // this.subscription = this.accountListService.getparentaccountdetails().subscribe(res => {
    //   // console.log("subject res", JSON.stringify(res))
    //   this.parentaccountname = res.parentaccountname;
    //   this.AccDetailsForm.controls['parentaccount'].setValue(res.parentaccountname);
    //   this.accountCreationObj['parentaccount'] = res.parentsysguid || '';
    // });
  }

  get accOwnerSwap() { return this.OwnDetailsForm.controls; }
  get accForm() { return this.AccDetailsForm.controls; }

  ngOnInit() {

    this.draftSysGuid = localStorage.getItem('draftId');
    this.prospectSysGuid = localStorage.getItem('prospectaccountid')
    if (this.draftSysGuid) {
      this.accountListService.draftDetails(this.draftSysGuid).subscribe((res) => {
        // console.log("draft detaisls", res);
        this.draftDetails = res.ResponseObject;
        this.accountDetails(this.draftDetails);
      });
    }
    else if (this.prospectSysGuid) {
      // this.leadinfo = true;
      //  this.getAutoSaveData();
      this.getprospectdetails(this.prospectSysGuid)
      this.accountCreationObj['prospectaccount'] = this.prospectSysGuid
      this.isprospectexist = true
    }
    else {
      this.leadinfo = true;
    }

    this.IsOwner = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('Isownerexist'), 'DecryptionDecrip');
    this.accountownername = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('username'), 'DecryptionDecrip');
    this.roleType = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip');
    if (this.roleType === 1)
      this.overallStatus = 184450009;
    else if (this.roleType === 2)
      this.overallStatus = 184450002;
    else if (this.roleType === 3)
      this.overallStatus = 184450000; //as per the disscussion with santosh we are changing status code from 02 t0 00
    // this.getCurrency();
    this.getEntity();
    this.ownersTypes();
    this.getgrowthcategory();
    this.getcoveragelevel();
    this.GetRevenueCategory();
    //  this.getdnbtoken();

    this.accountCreationObj['newagebusiness'] = false;
    this.accountCreationObj['governementaccount'] = false;
    this.accountCreationObj['isswapaccount'] = false;
    this.OwnDetailsForm = this._fb.group({
      // owner: ['', Validators.required],
      sbu: ['', Validators.required],
      vertical: ['', Validators.required],
      subvertical: ['', Validators.required],
      geography: ['', Validators.required],
      region: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      opportunity: ['', Validators.required],
      finanacialyear: [''],
      // country: ['', Validators.required],
      country: ['', Validators.required],
      isswapaccount: [''],
      swapaccount: [''],
      growthcategory: [''],
      revenuecategory: [''],
      newagebusiness: [''],
      governementaccount: [''],
      owner: ['', Validators.required],
      cluster: [''],
      // requesttype: [''],
      // ultimateparentsdunsid: [''],
      coveragelevel: [''],
      currency: [''],
      alternateaccountowner: [''],
      alternateswapaccount: [''],
      isalternateswapaccount: ['']
    });
    this.OwnDetailsForm.controls['swapaccount'].disable();
    this.OwnDetailsForm.controls['isswapaccount'].disable();
    this.OwnDetailsForm.controls['cluster'].disable();
    this.OwnDetailsForm.controls['alternateswapaccount'].disable();
    this.OwnDetailsForm.controls['alternateaccountowner'].disable();
    this.OwnDetailsForm.controls['isalternateswapaccount'].disable();
    this.AccDetailsForm = this._fb.group({
      // accName: ['', Validators.required],
      city: [''],
      country: [''],
      phonenumber: ['', Validators.required],
      // phonenumber: ['', [Validators.required, Validators.pattern(this.phoneFormat), Validators.minLength(10), Validators.maxLength(10)]],
      //   email: [''],
      email: ['', [Validators.pattern(this.emailFormat)]],
      //  email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailFormat)]],
      businessdescription: [''],
      currency: ['', Validators.required],
      ownershiptype: ['', Validators.required],
      // parentaccount: ['']
      dunsnumber: [''],
      parentsdunsnumber: [''],
      ultimateparentsdunsnumber: [''],
      parentaccount: [''],
      ultimateparent: [''],
      name: [''],
      legalentity: [''],
      headquarters: [''],
      countrycode: [''],
      sicdescription: [''],
      stockindexmembership: [''],
      tickersymbol: [''],
      fortune: [''],
      profits: [''],
      revenue: [''],
      operatingmargins: [''],
      marketvalue: [''],
      returnonequity: [''],
      entitytype: [''],
      Marketrisk: [''],
      website: ['', [Validators.pattern(this.urlFormat)]],
      dunsid: [''],
      address: [''],
      employees: [''],
      accountDetailName: [],
      // owner: ['', Validators.required],
    });

    this.AccDetailsForm.get('legalentity').valueChanges.subscribe(val => {
      if (val.trim() === "") {
        this.AccDetailsForm.get('legalentity').patchValue('', { emitEvent: false })
      }
    })

    this.formsData = {
      owner: ''
    };
    this.OwnDetailsForm.controls.swapaccount.disable();
    this.getwiproaccounts('')
  }
  // keyPress(event: any) {
  //   const pattern = /^[0-9-+()]*$/;

  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode !== 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }

  Inputdata(data) {
    return data.target.value = data.target.value.replace(/[^!@#^$%&*()?><',:-;-=_+{}|\[\]\\\/ 0-9.]/, '');
  }
  setSelectedValuedata(data) {
    this.ParentAccountNameData = this.AccDetailsForm.controls['parentaccount'].value ? this.AccDetailsForm.controls['parentaccount'].value : '';
    this.SbuName = (data.SBU && data.SBU.Name) ? data.SBU.Name : '';
    this.geoName = (data.Geo && data.Geo.Name) ? data.Geo.Name : '';
    this.regionName = (data.Address && data.Address.Region.Name) ? data.Address.Region.Name : '';
    this.stateName = (data.Address && data.Address.State.Name) ? data.Address.State.Name : '';
    this.cityNameField = (data.Address && data.Address.City.Name) ? data.Address.City.Name : '';
    this.countryNameField = (data.Address && data.Address.Country.Name) ? data.Address.Country.Name : '';
    this.VerticalName = (data.Vertical && data.Vertical.Name) ? data.Vertical.Name : '';
    this.SubverticalName = (data.SubVertical && data.SubVertical.Name) ? data.SubVertical.Name : '';
    // this.ClusterName = '';
  }
  accountDetails(data) {
    this.leadinfo = false;
    this.dealinfo = false;
    // this.ownerdetails = false;
    this.twoactive = false;
    this.editablefields = true;

    this.AccDetailsForm.patchValue({

      legalentity: (data && data.LegalEntity) ? this.getSymbol(data.LegalEntity) : '',
      accountDetailName: (data && data.Name) ? this.getSymbol(data.Name) : '',
      dunsnumber: (data && data.DUNSID.Name) ? this.getSymbol(data.DUNSID.Name) : '',
      // parentaccount: (data.ParentAccount && data.ParentAccount.Name) ? data.ParentAccount.Name :'',
      // parentsdunsnumber:(data && data.DNBParentDuns )? data.DNBParentDuns:'',
      //  ultimateparent: (data.UltimateParentAccount && data.UltimateParentAccount.Name)?data.UltimateParentAccount.Name :'',
      //  ultimateparentsdunsnumber:(data && data.DNBUltimateParentDuns )? data.DNBUltimateParentDuns:'',
      headquarters: (data && data.HeadQuarters) ? data.HeadQuarters : '',
      address: data.Address.Address1,
      country: (data.Address && data.Address.CountryString) ? data.Address.CountryString : '',
      city: (data.Address && data.Address.CityString) ? data.Address.CityString : '',
      countrycode: (data.Address && data.Address.CountryCode) ? data.Address.CountryCode : '',
      phonenumber: (data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '',
      website: data.WebsiteUrl,
      email: (data && data.Email) ? data.Email : '',
      businessdescription: (data && data.BusinessDescription) ? data.BusinessDescription : '',
      employees: data.EmployeeCount,
      sicdescription: (data && data.SicDescription) ? data.SicDescription : '',
      stockindexmembership: data.StockIndexMemberShip,
      tickersymbol: data.TickerSymbol,
      currency: (data.Currency && data.Currency.Value) ? data.Currency.Value : '',
      fortune: data.FortuneRanking,
      profits: data.GrossProfit,
      revenue: data.Revenue,
      operatingmargins: data.OperatingMargin,
      marketvalue: data.MarketValue,
      returnonequity: data.ReturnOnEquity,
      entitytype: data.EntityType.Id,
      creditscore: data.CreditScore,
      ownershiptype: (data.OwnershipType && data.OwnershipType.Id) ? data.OwnershipType.Id : '',
    });

    this.OwnDetailsForm.patchValue({
      growthcategory: (data.GrowthCategory && data.GrowthCategory.Id) ? data.GrowthCategory.Id : '',
      coveragelevel: (data.CoverageLevel && data.CoverageLevel.Id) ? data.CoverageLevel.Id : '',
      revenuecategory: (data.RevenueCategory && data.RevenueCategory.Id) ? data.RevenueCategory.Id : '',
      sbu: (data.SBU && data.SBU.Name) ? data.SBU.Name : '',
      vertical: (data.Vertical && data.Vertical.Name) ? data.Vertical.Name : '',
      subvertical: (data.SubVertical && data.SubVertical.Name) ? data.SubVertical.Name : '',
      geography: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
      region: (data.Address && data.Address.Region.Name) ? data.Address.Region.Name : '',
      country: (data.Address && data.Address.Country.Name) ? data.Address.Country.Name : '',
      state: (data.Address && data.Address.State.Name) ? data.Address.State.Name : '',
      city: (data.Address && data.Address.City.Name) ? data.Address.City.Name : '',
      opportunity: (data && data.PursuedopportunityRemarks) ? data.PursuedopportunityRemarks : '',
      //owner:(data.City && data.City.Name) ? data.City.Name : '',
      swapaccount: (data.SwapAccount && data.SwapAccount.Name) ? data.SwapAccount.Name : '',
      alternateaccountowner: (data.AlternateAccountOwner && data.AlternateAccountOwner.FullName) ? data.AlternateAccountOwner.FullName : '',
      alternateswapaccount: (data.AlternateSwapAccount && data.AlternateSwapAccount.Name) ? data.AlternateSwapAccount.Name : '',
      isalternateswapaccount: data.IsAlternateSwapAccount ? data.IsAlternateSwapAccount : false,
      // governementaccount:data.IsGovAccount,
      // newagebusiness:data.IsNewAgeBusiness,
      isswapaccount: data.isSwapAccount,
    });
    if (data.ParentAccount && data.ParentAccount.DNBParent) {
      this.AccDetailsForm.controls['parentaccount'].setValue((data.ParentAccount && data.ParentAccount.DNBParent) ? this.getSymbol(data.ParentAccount.DNBParent) : '');
      this.accountCreationObj['parentdunsname'] = data.ParentAccount.DNBParent;
    }
    if (data.ParentAccount && data.ParentAccount.Name) {
      this.AccDetailsForm.controls['parentaccount'].setValue((data.ParentAccount && data.ParentAccount.Name) ? this.getSymbol(data.ParentAccount.Name) : '');
      this.accountCreationObj['parentaccount'] = data.ParentAccount.SysGuid;
    }
    if (data.ParentAccount && data.ParentAccount.DUNSID) {
      this.AccDetailsForm.controls['parentsdunsnumber'].setValue((data.ParentAccount && data.ParentAccount.DUNSID) ? this.getSymbol(data.ParentAccount.DUNSID.Name) : '');
      this.accountCreationObj['parentsdunsid'] = data.ParentAccount.DUNSID.SysGuid;
    }

    if (data.ParentAccount && data.ParentAccount.DNBParentDuns) {
      this.AccDetailsForm.controls['parentsdunsnumber'].setValue((data.ParentAccount && data.ParentAccount.DNBParentDuns) ? this.getSymbol(data.ParentAccount.DNBParentDuns) : '');
      this.accountCreationObj['parentsdunsnumber'] = data.ParentAccount.DNBParentDuns;
    }
    if (data.UltimateParentAccount && data.UltimateParentAccount.DNBUltimateParent) {
      this.AccDetailsForm.controls['ultimateparent'].setValue((data.UltimateParentAccount && data.UltimateParentAccount.DNBUltimateParent) ? this.getSymbol(data.UltimateParentAccount.DNBUltimateParent) : '');
      this.accountCreationObj['ultimateparentdunsname'] = data.UltimateParentAccount.DNBUltimateParent;
    }

    if (data.UltimateParentAccount && data.UltimateParentAccount.Name) {
      this.AccDetailsForm.controls['ultimateparent'].setValue((data.UltimateParentAccount && data.UltimateParentAccount.Name) ? this.getSymbol(data.UltimateParentAccount.Name) : '');
      this.accountCreationObj['ultimateparent'] = data.UltimateParentAccount.SysGuid;
    }
    if (data.UltimateParentAccount && data.UltimateParentAccount.DUNSID) {
      this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue((data.UltimateParentAccount && data.UltimateParentAccount.DUNSID) ? this.getSymbol(data.UltimateParentAccount.DUNSID.Name) : '');
      this.accountCreationObj['ultimateparentsdunsid'] = data.UltimateParentAccount.DUNSID.SysGuid;
    }
    if (data.UltimateParentAccount && data.UltimateParentAccount.DNBUltimateParentDuns) {
      this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue((data.ParentAccount && data.UltimateParentAccount.DNBUltimateParentDuns) ? this.getSymbol(data.UltimateParentAccount.DNBUltimateParentDuns) : '');
      this.accountCreationObj['ultimateparentsduns'] = data.UltimateParentAccount.DNBUltimateParentDuns;
    }
    if (data.Currency && data.Currency.Value) {
      this.AccDetailsForm.controls['currency'].setValue(data.Currency ? this.getSymbol(data.Currency.Value) : '');
      this.accountCreationObj['currency'] = data.Currency.Id;
      this.CurrencyData = data.Currency.Value;
    }
    this.accountCreationObj['currency'] = data.Currency.Id || '';
    this.accountCreationObj['governementaccount'] = data.IsGovAccount;
    this.accountCreationObj['newagebusiness'] = data.IsNewAgeBusiness;
    this.accountCreationObj['sbu'] = data.SBU.Id;
    this.accountCreationObj['vertical'] = data.Vertical.Id;
    this.IsSubVerticalExist = data.Vertical.IsSubVerticalExist;
    //this.IsSubVerticalExist = (data.Vertical && data.Vertical.IsSubVerticalExist) ?  data.Vertical.IsSubVerticalExist : true;
    this.accountCreationObj['subvertical'] = data.SubVertical.Id;
    this.accountCreationObj['geography'] = data.Geo.SysGuid;
    this.accountCreationObj['region'] = data.Address.Region.SysGuid;
    this.accountCreationObj['country'] = data.Address.Country.SysGuid;
    this.accountCreationObj['state'] = data.Address.State.SysGuid;
    this.accountCreationObj['city'] = data.Address.City.SysGuid;
    this.accountCreationObj['swapaccount'] = data.SwapAccount.SysGuid;
    this.accountCreationObj['owner'] = data.Owner.SysGuid;
    this.accountCreationObj['alternateaccountowner'] = data.AlternateAccountOwner.SysGuid;
    this.accountCreationObj['alternateswapaccount'] = data.AlternateSwapAccount.SysGuid;
    this.accountCreationObj['isalternateswapaccount'] = data.IsAlternateSwapAccount;
    this.draftownername = data.Owner.FullName;
    this.cityexists = data.Address.State.isExists;
    this.draftcountry = data.Address.Country.Name.toLowerCase();
    if (!(this.draftcountry === "india" || this.draftcountry === "united kingdom" || this.draftcountry === "united states" || this.draftcountry === "usa" || this.draftcountry === "us")) {
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.get('state').updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.get('city').updateValueAndValidity();
    } else {
      this.customValidators['state'] = true;
      // this.customValidators['city'] = true;
      // this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      // this.OwnDetailsForm.controls['city'].updateValueAndValidity();
      this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
    }
    if (this.cityexists) {
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
    }

    if (this.accountCreationObj['owner'] && this.accountCreationObj['country']) {
      this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      this.getHuntingCount(this.accountCreationObj['owner'], '');
      this.getExistingCount(this.accountCreationObj['owner']);

    } else {

    }
    if (data.isSwapAccount && this.accountCreationObj['swapaccount']) {
      this.OwnDetailsForm.controls['swapaccount'].enable();
      this.OwnDetailsForm.get('swapaccount').setValidators([Validators.required]);
    }
    this.setSelectedValuedata(data);
  }

  patchvalue(VALUES: any) {

  }
  selected_currency() {
    this.selected_cur = this.currencyLists['' + this.OwnDetailsForm.value.currency + ''];
  }
  allowNumbersOnly(e) {
    const code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
  getCurrency() {
    this.master3Api.getCurrency().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.createDropdown.Currency = result.ResponseObject;
      }

    });
  }
  getEntity() {
    this.master3Api.getEntityType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.createDropdown.entity = result.ResponseObject;
      }
    });
  }
  ownersTypes() {
    this.master3Api.getProspectOwnerShipType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.createDropdown.ownershipTypes = result.ResponseObject;
      }
    });
  }
  getgrowthcategory() {
    this.master3Api.GetGrowthCategory().subscribe(res => {
      if (!res.IsError && res.ResponseObject) {
        this.growthCatagoryvalue = res.ResponseObject;
        if (res.ResponseObject.length === 0)
          this.growthCatagoryvalue['message'] = 'No record found';
      }
      else {
        this.growthCatagoryvalue['message'] = 'No record found';
      }
      // console.log("growth category reaponse", this.growthCatagoryvalue);
    });
  }

  removerelatedfields(data) {
    switch (data) {
      case 'geography':
        {
          const temp = ['geography', 'region', 'country', 'state', 'city'];
          this.clearPostObject(this.accountCreationObj, temp);
          this.clearFormFiled(temp, this.OwnDetailsForm);
          this.removeSeletecedValue('OwnDetailsForm', 'geography', 'geography');
          break;
        }

      case 'region':
        {
          const temp = ['region', 'country', 'state', 'city'];
          this.clearPostObject(this.accountCreationObj, temp);
          this.clearFormFiled(temp, this.OwnDetailsForm);
          this.removeSeletecedValue('OwnDetailsForm', 'region', 'region');

          break;
        }

      case 'country':
        {
          const temp = ['geography', 'region', 'country', 'state', 'city'];
          this.clearPostObject(this.accountCreationObj, temp);
          this.clearFormFiled(temp, this.OwnDetailsForm);
          this.removeSeletecedValue('OwnDetailsForm', 'country', 'country');
          this.OwnDetailsForm.controls['state'].enable();
          this.OwnDetailsForm.controls['city'].enable();
          break;
        }
      case 'state':
        {
          const temp = ['state', 'city'];
          this.clearPostObject(this.accountCreationObj, temp);
          this.clearFormFiled(temp, this.OwnDetailsForm);
          //this.OwnDetailsForm.controls['city'].enable();
          this.removeSeletecedValue('OwnDetailsForm', 'state', 'state')
          break;
        }
      case 'city':
        debugger
        this.removeSeletecedValue('OwnDetailsForm', 'city', 'city');
        break;
      case 'subvertical':
        this.removeSeletecedValue('OwnDetailsForm', 'subvertical', 'subvertical');
        break;
      case 'vertical':
        this.removesubVertical(''); this.removeSeletecedValue('OwnDetailsForm', 'vertical', 'vertical');
        break;
      case 'sbu':
        this.disablecluster();
        this.removesubVertical('');
        this.clearVerSubVerical('');
        this.removeSeletecedValue('OwnDetailsForm', 'sbu', 'sbu');
        break;
      case 'city':
        this.removeSeletecedValue('OwnDetailsForm', 'city', 'city');
        break;
      case 'cluster':
        this.removeSeletecedValue('OwnDetailsForm', 'cluster', 'cluster');
        break;
    }
  }
  getcoveragelevel() {
    this.master3Api.GetCoverageLevel().subscribe(res => {
      if (!res.IsError && res.ResponseObject) {
        this.coveragelevelvalue = res.ResponseObject;
        // console.log("coveragelevel,", this.coveragelevelvalue)
        if (res.ResponseObject.length === 0)
          this.coveragelevelvalue['message'] = 'No record found';
      }
      else {
        this.coveragelevelvalue['message'] = 'No record found';
      }
    })
  }
  GetRevenueCategory() {
    this.master3Api.GetRevenueCategory().subscribe(res => {
      if (!res.IsError && res.ResponseObject) {
        this.revenueCatagoryvalue = res.ResponseObject;
        if (res.ResponseObject.length === 0)
          this.revenueCatagoryvalue['message'] = 'No record found';
      }
      else {
        this.revenueCatagoryvalue['message'] = 'No record found';
      }
      // console.log("revenue catagory response", this.revenueCatagoryvalue)
    });
  }
  getdunsnumber(event) {
    this.dunsnumber = [];

    const dunsnumber = this.master3Api.getdunsnumber(event);
    dunsnumber.subscribe((res: any) => {
      // console.log("dunsnumber response", res.ResponseObject);
      if (!res.IsError && res.ResponseObject) {
        if (event !== '') {
          this.dunsnumber = res.ResponseObject;
        } else {
          this.dunsnumber = this.getTenRecords(res.ResponseObject);
        }
        // console.log("response of hhhhhhhhhhhh", this.dunsnumber);

        if (res.ResponseObject.length === 0) {
          this.dunsnumber['message'] = 'No record found';
        }
      } else {
        this.dunsnumber['message'] = 'No record found';
      }
    });
    // }
  }

  //  D & B token api method 
  // getdnbtoken()
  // {
  //     this.master3Api.getdnbtoken().subscribe((res :any) => {
  //     console.log(" dnb token ", res.ResponseObject);
  //     this.dnbtoken = res.ResponseObject.access_token
  //     localStorage.setItem('dNBToken',this.dnbtoken)
  //   },
  //   error => console.log("error ::: ", error))
  // }


  // accountDetails(data) {
  //   this.AccDetailsForm.patchValue({
  //     phonenumber: data.Contact.ContactNo,
  //     email: data.Email,
  //     businessdescription: data.BusinessDescription,
  //     currency: data.Currency.Id,
  //     ownershiptype: data.OwnershipType.Id,
  //     parentaccount: data.ParentAccount.Name,
  //     ultimateparent: data.UltimateParentAccount.Name,
  //     name: data.Name,
  //     headquarters: data.HeadQuarters,
  //     countrycode: data.Address.CountryCode,
  //     country: data.Address.CountryString,
  //     city: data.Address.CityString,
  //     sicdescription: data.SicDescription,
  //     stockindexmembership: data.StockIndexMemberShip,
  //     tickersymbol: data.TickerSymbol,
  //     fortune: data.FortuneRanking,
  //     profits: data.GrossProfit,
  //     revenue: data.Revenue,
  //     operatingmargins: data.OperatingMargin,
  //     marketvalue: data.MarketValue,
  //     returnonequity: data.ReturnOnEquity,
  //     entitytype: data.EntityType.Id,
  //     creditscore: data.CreditScore,
  //     website: data.WebsiteUrl,
  //     address: data.Address.Address1,
  //     employees: data.EmployeeCount,
  //     // quarter: '',
  //     // owner: ['', Validators.required],
  //   });
  //   this.accountCreationObj['parentaccount'] = data.ParentAccount.SysGuid || '';
  //   this.accountCreationObj['ultimateparent'] = data.UltimateParentAccount.SysGuid || '';
  // }
  getFocus() {
    this.isLoading = true;

    setTimeout(() => {
      window.scrollTo(0, 0);
      this.isLoading = false;
      document.getElementById("LegalEntity").focus();
    }, 1000);
  }
  appendduns(item) {
    console.log(item);
    // this.parentName = item.Name;
    this.AccDetailsForm.controls['dunsnumber'].setValue(item.Name);
    // console.log("formvalue", this.AccDetailsForm.controls['dunsnumber'].setValue(item.Name))
    this.accountCreationObj['dunsid'] = item.SysGuid || '';
  }
  appendAccountName(value, item) {
    this.AccountSelected = item;
    this.sendAccountNameToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.leadSourceSelected = item;
    this.leadSourceId = item.SysGuid;
    this.leadSrcName = item.Name;

    this.AccDetailsForm.patchValue({
      accountDetailName: value
    });
    this.conversationNameSwitchAccountName = false;
  }
  appenddunNumber(value, item) {
    this.leadSourceSelected = item;
    this.leadSourceId = item.SysGuid;
    this.leadSrcName = item.Name;

    this.AccDetailsForm.patchValue({
      accountDetailName: value
    });
    this.conversationNameSwitchAccountName = false;


  }

  LeadSourceclose() {
    this.conversationNameSwitchAccountName = false;
    // if (this.leadSourceId == undefined) {
    //   this.AccDetailsForm.patchValue({
    //     accountDetailName: ''
    //   })
    // }
  }
  dunsnumberclose() {
    this.dunsNumberSwitch = false;
  }

  // getparentaccount(event) {

  //   // if (event !== '') {
  //   // this.master3Api.getparentaccount(event).subscribe((res: any) => {
  //   //   console.log("parent account rsponse ", res.ResponseObject)
  //   //   if (!res.IsError && res.ResponseObject) {
  //   //     this.parentaccount = res.ResponseObject;
  //   //     if (res.ResponseObject.length == 0) {
  //   //       this.OwnDetailsForm.controls['parentaccount'].setValue('');
  //   //       this.parentaccount['message'] = 'No record found';
  //   //     }
  //   //   }
  //   //   else {
  //   //     this.OwnDetailsForm.controls['parentaccount'].setValue('');
  //   //     this.parentaccount['message'] = 'No record found';
  //   //   }
  //   // });
  //   if (this.parentNameSwitch) {
  //     this.parentaccount = [];
  //     this.isAccountNameSearchLoading = true;
  //     this.master3Api.getparentaccount(this.AccDetailsForm.value.parentaccount).subscribe((res: any) => {
  //       // console.log("parent account rsponse ", res.ResponseObject);
  //       if (!res.IsError && res.ResponseObject) {
  //         this.lookupdata.TotalRecordCount = res.TotalRecordCount;
  //         if (event !== '') {
  //           this.parentaccount = res.ResponseObject;
  //         } else {
  //           this.parentaccount = this.getTenRecords(res.ResponseObject);
  //         }
  //         if (res.ResponseObject.length === 0) {
  //           this.AccDetailsForm.controls['parentaccount'].setValue('');
  //           this.parentaccount['message'] = 'No record found';
  //         }
  //       } else {
  //         this.AccDetailsForm.controls['parentaccount'].setValue('');
  //         this.parentaccount['message'] = 'No record found';
  //       }
  //     }, error => {
  //       this.isAccountNameSearchLoading = false;
  //       this.parentaccount = [];
  //     });
  //   } else {
  //     this.isAccountNameSearchLoading = false;
  //     this.parentaccount = [];
  //   }
  //   // }
  // }
  getparentaccount(value) {
    // debugger;
    this.parentaccount = [];
    this.accountCreationObj['parentaccount'] = '';
    // if (!this.userdat.searchFieldValidator(event)) {
    //   event = '';
    // }
    // if (this.userdat.searchFieldValidator(event)) {
    this.isActivityGroupSearchLoading = true;
    //  this.loader = true;
    const getparentaccount = this.master3Api.getparentaccount(value);
    getparentaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      // console.log("parent account rsponse ", res.ResponseObject);
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (!res.IsError && res.ResponseObject) {
        // this.parentaccount = res.ResponseObject;
        // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        if (res.ResponseObject.length === 0) {
          // this.prospectAccForm.controls['parentaccount'].setValue('');
          this.parentaccount = [];
          this.parentaccount['message'] = 'No record found';
        } else {
          this.parentaccount = res.ResponseObject;
          // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        }
      } else {
        // this.prospectAccForm.controls['parentaccount'].setValue('');
        this.parentaccount = [];
        this.parentaccount['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.parentaccount = [];
      this.parentaccount['message'] = 'No record found';
    });
    // }
  }
  getUltimateparentaccount(event) {

    // if (event !== '') {
    // this.master3Api.getparentaccount(event).subscribe((res: any) => {
    //   console.log("parent account rsponse ", res.ResponseObject)
    //   if (!res.IsError && res.ResponseObject) {
    //     this.parentaccount = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.OwnDetailsForm.controls['parentaccount'].setValue('');
    //       this.parentaccount['message'] = 'No record found';
    //     }
    //   }
    //   else {
    //     this.OwnDetailsForm.controls['parentaccount'].setValue('');
    //     this.parentaccount['message'] = 'No record found';
    //   }
    // });
    if (this.UparentNameSwitch) {
      this.parentaccount = [];
      this.isAccountNameSearchLoading = true;
      this.master3Api.getparentaccount(this.AccDetailsForm.value.ultimateparent).subscribe((res: any) => {
        // console.log("parent account rsponse ", res.ResponseObject)
        if (!res.IsError && res.ResponseObject) {
          // this.getTenRecords
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (event !== '') {
            this.parentaccount = res.ResponseObject;
          } else {
            this.parentaccount = this.getTenRecords(res.ResponseObject);
          }

          if (res.ResponseObject.length === 0) {
            // this.AccDetailsForm.controls['ultimateparent'].setValue('');
            this.parentaccount['message'] = 'No record found';
          }
        } else {
          // this.AccDetailsForm.controls['ultimateparent'].setValue('');
          this.parentaccount['message'] = 'No record found';
        }
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.parentaccount = [];
      });
    } else {
      this.isAccountNameSearchLoading = false;
      this.parentaccount = [];
    }
    // }
  }
  UparentNameclose() {
    this.UparentNameSwitch = false;
  }
  parentNameclose() {
    this.parentNameSwitch = false;
  }
  appendUltParent(value, item) {
    console.log(item);
    // this.ultimateParentName = item.Name;   
    this.ultimateParentAccountName = this.getSymbol(item.Name);
    this.sendUltimateAccountAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.ultimateParentAccountSelected = item;
    this.AccDetailsForm.controls['ultimateparent'].setValue(this.getSymbol(item.Name));
    this.accountCreationObj['ultimateparent'] = item.SysGuid || '';
    // console.log("ultimate parent number sysguid ", this.accountCreationObj['ultimateparent']);
    if (this.accountCreationObj['ultimateparent'] !== '') {
      const ultimateParentsDunsid = this.master3Api.getultimateparentsdnusid(this.accountCreationObj['parentaccount']);
      ultimateParentsDunsid.subscribe((res: any) => {
        // console.log("parentsdunsid ", res.ResponseObject);
        const ultimate_DNUS = res.ResponseObject.Name;
        this.accountCreationObj['ultimateparentsdunsid'] = res.ResponseObject.SysGuid || '';
        this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue(ultimate_DNUS);
        // console.log("this.ultimateParentsDunsnumber ::::::::::::::", this.ultimateParentsDunsnumber);
      });
    }

  }
  appendparent(value, item, flag?) {
    console.log(item);
    // this.parentName = item.Name;
    this.ParentAccountNameData = this.getSymbol(item.Name);
    this.ParentAccountSelected = item;
    this.sendParentAccountNameToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    // this.sendGeographytoAdvance.push({ ...item, Id: item.SysGuid });
    // this.geographySelected = item;
    // sendGeographytoAdvance:any  = [];
    // geographySelected :any =  [];
    // this.ParentAccountName = item.Name;
    this.AccDetailsForm.controls['parentaccount'].setValue(this.getSymbol(item.Name));
    // this.AccDetailsForm.controls['employees'].setValue(item.Number);
    this.accountCreationObj['parentaccount'] = item.SysGuid || '';
    this.getultimateparentbyparent(item.SysGuid);
  }

  getultimateparentbyparent(id) {
    this.master3Api.getUltimateParentByParent(id).subscribe((res: any) => {
      // test the load
      console.log("response of ultimate parent by parent", res.ResponseObject)
      if (!res.IsError) {
        this.AccDetailsForm.controls['ultimateparent'].setValue(res.ResponseObject[0].UltimateParentAccount.Name)
        this.accountCreationObj['ultimateparent'] = res.ResponseObject[0].UltimateParentAccount.SysGuid
      }
    })
  }
  country1Nameclose() {
    this.country1NameSwitch = false;
  }
  FinacialNameclose() {
    this.FinacialNameSwitch = false;
  }
  disableStateAndCity(item, isExists) {
    if (item && !isExists) {
      this.OwnDetailsForm.controls['state'].disable();
      this.OwnDetailsForm.controls['city'].disable();
    } else {
      this.OwnDetailsForm.controls['state'].enable();
      this.OwnDetailsForm.controls['city'].enable();
    }
  }

  DACountryandGeo: any;
  appendcountry1(item, index, advFlag) {
    let i;
    if (advFlag) {
      this.disableStateAndCity(item, item.isExists);
      i = index;
    } else {
      if (item.Country) {
        this.disableStateAndCity(item, item.Country.isExists);
        i = this.location_temp.findIndex(x => x.Country.SysGuid === item.SysGuid);
      } else {
        this.disableStateAndCity(item, item.isExists);
        i = this.location_temp.findIndex(x => x.SysGuid === item.SysGuid);
      }
      // i = this.createDropDown['country'].findIndex(x => x.Id ? x.Id : x.SysGuid === item.Id ? item.Id : item.SysGuid);
    }
    this.sendCountrytoAdvance.push({ ...item, Id: item.SysGuid });
    this.countrySelected = item;
    const cityControl = this.OwnDetailsForm.get('city');
    this.countryNameField = item.Name;
    this.DACountryandGeo = this.location_temp.filter(x => x.Country.SysGuid == item.SysGuid);
    this.daChatApiCall();
    // console.log(cityControl);
    console.log(cityControl.errors);
    // console.log(cityControl.setValidators);
    // let formField = ['state', 'city'];
    // let temp = ['country', 'state', 'city'];

    // this.clearPostObject(this.accountCreationObj, temp);
    // this.clearFormFiled(formField, this.OwnDetailsForm);
    const formField = ['state', 'city'];
    const temp = ['state', 'city'];
    this.clearPostObject(this.accountCreationObj, temp);
    this.clearFormFiled(formField, this.OwnDetailsForm);
    const stateControl = this.OwnDetailsForm.get('state');
    const counryName = item.Name.toLowerCase();
    if (!(counryName === "india" || counryName === "united kingdom" || counryName === "united states" || counryName === "usa" || counryName === "us")) {
      cityControl.setValidators([]);
      stateControl.setValidators([]);
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
      // cityControl.errors.required = false;
      // cityControl.clearValidators();
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.get('state').updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.get('city').updateValueAndValidity();
    } else {
      this.customValidators['state'] = true;
      this.customValidators['city'] = true;
      // cityControl.errors.required = true;
      // this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      // this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      cityControl.setValidators([Validators.required]);
      cityControl.updateValueAndValidity();
      stateControl.setValidators([Validators.required]);
      stateControl.updateValueAndValidity();

    }
    this.OwnDetailsForm.controls['country'].setValue(item.Name);
    this.accountCreationObj['country'] = item.SysGuid || '';

    if (this.accountCreationObj['country']) {
      this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
      this.regionName = this.location_temp[i]['Region'].Name;

    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.geoName = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    }

  }
  getcluster(event) {
    const cluster = this.master3Api.getcluster(this.OwnDetailsForm.controls['sbu'].value, event)
    cluster.subscribe((res: any) => {
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (res.ResponseObject.length === 0) {
        this.clusterdata = [];
        this.cluster['message'] = 'No record found';
      } else {
        this.clusterdata = res.ResponseObject;
      }
      console.log("clusterdata", res);
    });
  }
  clearVerSubVerical(event) {
    if (event === '') {
      this.accountCreationObj['vertical'] = '';
      this.OwnDetailsForm.controls['vertical'].setValue('');
      this.accountCreationObj['subvertical'] = '';
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      this.OwnDetailsForm.controls['sbu'].setValue('');
      this.accountCreationObj['sbu'] = '';
      this.IsSubVerticalExist = true;
    }
  }
  daChatApiCall() {
    if (this.sbuAccountSelected != undefined && this.DACountryandGeo != undefined) {
      let body = {
        'ProspectGuid': this.draftSysGuid,
        "GEOGuid": this.DACountryandGeo[0].Geo.SysGuid,
        "SBUGuid": (this.sbuAccountSelected.Id) ? this.sbuAccountSelected.Id : this.sbuAccountSelected.SysGuid,
        "CountryGuid": this.DACountryandGeo[0].Country.SysGuid
      }
      this.accountListService.GetChatUserList(body).subscribe(res => {
        if (!res.IsError) {
          let emailIds = []
          res.ResponseObject.forEach(data => {
            if (data.Email) {
              emailIds.push(data.Email)
              // this.daService.iframePage = 'ACCOUNT_CREATE_MODIFICATION';
              let bodyDA = {
                id : this.draftSysGuid,
                page: 'ACCOUNT_CREATE_MODIFICATION',
                emailListArray: emailIds,
              };
              this.assistantGlobalService.setEmails(bodyDA);
              // this.daService.postMessageData = bodyDA;
              // this.daService.postMessage(bodyDA);
            }
          })
        } else {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
        }
      }, error => {

      })
    }
  }
  appendcontactSBU(value, item) {
    this.clearVerSubVerical('');
    // sendSbuToAdvance:any = [];
    // sbuAccountSelected :any;
    this.SbuName = item.Name;
    this.sendSbuToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.sbuAccountSelected = item;
    this.daChatApiCall();
    // console.log("sbu event", item)
    // this.contactSBU = item.Name;
    // this.SbuId = item.Id
    this.OwnDetailsForm.controls['sbu'].setValue(item.Name);
    // console.log("sbuisdd", this.SbuId);
    this.accountCreationObj['sbu'] = item.Id || '';
    //this.selectedContact8.push(this.wiproContactSBU[i])
    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || (this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE")) {
      this.enablecluster();
    }
    else this.disablecluster();
  }
  appendcluster(item) {
    this.ClusterName = item.Name;
    this.clustertoAdvLookup.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.clusterSelected = item;
    // return this.clustertoAdvLookup = [], this.clusterSelected = [];
    this.OwnDetailsForm.controls['cluster'].setValue(item.Name);
    this.accountCreationObj['cluster'] = item.Id || '';
  }
  disablecluster() {
    this.OwnDetailsForm.controls['cluster'].setValue('');
    this.accountCreationObj['cluster'] = '';
    this.OwnDetailsForm.controls['cluster'].disable();
    this.isclusterexist = false;
    this.ClusterName = ''
  }
  enablecluster() {
    this.OwnDetailsForm.controls['cluster'].enable();
    this.isclusterexist = true;
  }

  appendvertical(value, item, index) {
    // this.removesubVertical('');
    let ind;
    if (index) {
      ind = index;
      // this.IsSubVerticalExist = item.IsSubVerticalExist;
    } else {
      // this.IsSubVerticalExist = item.Vertical.IsSubVerticalExist;
      ind = this.verticaldata.findIndex(x => x.Id === item.Id);
    }
    this.IsSubVerticalExist = item.IsSubVerticalExist;
    this.sendVerticalToAdvance.push({ ...item, Id: item.Id });
    this.verticalSelected = item;
    this.OwnDetailsForm.controls['vertical'].setValue(item.Name);
    this.VerticalName = item.Name;
    this.accountCreationObj['vertical'] = item.Id || '';

    if (item.IsSubVerticalExist == true && item.SubVertical != undefined) {
      this.OwnDetailsForm.controls['subvertical'].setValue(item.SubVertical.Name);
      this.accountCreationObj['subvertical'] = item.SubVertical.Id || '';
      this.SubverticalName = item.SubVertical.Name;
      this.sendSubVerticaltoAdvance.push({ ...item, Id: item.Id });
      this.subVerticalSelected = item;
    } else {
      this.accountCreationObj['subvertical'] = '';
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      this.SubverticalName = '';
    }
    if (this.IsSubVerticalExist) {
      this.OwnDetailsForm.get('subvertical').setValidators([Validators.required]);
      this.OwnDetailsForm.get('subvertical').updateValueAndValidity();
      // console.log(" this.OwnDetailsForm", this.OwnDetailsForm)
      // this.customValidators['subvertical'] = true;
    } else {
      this.OwnDetailsForm.get('subvertical').setValidators([]);
      this.OwnDetailsForm.get('subvertical').updateValueAndValidity();
      // console.log(" this.OwnDetailsForm", this.OwnDetailsForm)
      //  this.customValidators['subvertical'] = false;
    }

    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) {
      this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
      this.SbuName = this.sub_and_vertical[ind]['SBU']['Name'];
    }
    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || (this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE")) {
      this.enablecluster();
    }
    else {
      this.disablecluster();
    }
  }

  appendsubvertical(value, item, index) {
    let ind;
    if (index) {
      ind = index;
    } else {
      ind = this.subverticaldata.findIndex(x => x.Id === item.Id);
    }
    this.sendSubVerticaltoAdvance.push({ ...item, Id: item.Id });
    this.subVerticalSelected = item;
    this.SubverticalName = item.Name;
    // console.log(this.sub_and_vertical);
    // sendSubVerticaltoAdvance:any=[];
    // subVerticalSelected :any;
    this.OwnDetailsForm.controls['subvertical'].setValue(item.Name);
    this.accountCreationObj['subvertical'] = item.Id || '';

    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) {
      this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
      this.SbuName = this.sub_and_vertical[ind]['SBU']['Name'];
    }
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Id'])) this.accountCreationObj['vertical'] = this.sub_and_vertical[ind]['Vertical']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Name'])) {
      this.VerticalName = this.sub_and_vertical[ind]['Vertical']['Name']
      this.OwnDetailsForm.controls['vertical'].setValue(this.sub_and_vertical[ind]['Vertical']['Name']);
    }
    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || (this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE")) {
      this.enablecluster();
    }
    else {
      this.disablecluster();
    }
  }
  appendFinacialyear(item) {
    // this.FinacialName = item.Name;
    this.OwnDetailsForm.controls['finanacialyear'].setValue(item.Name);
    this.accountCreationObj['finanacialyear'] = item.SysGuid || '';

    // this.selectedFinacial.push(this.wiproFinacial[i])
  }
  appendregion(item, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.location_temp.findIndex(x => x.SysGuid === item.SysGuid);
      // i = this.createDropDown['region'].findIndex(x => x.Id ? x.Id : x.SysGuid === item.Id ? item.Id : item.SysGuid);
    }
    this.sendRegiontoAdvance.push({ ...item, Id: item.SysGuid });
    this.regionSelected = item;
    this.regionName = item.Name;
    console.log(this.location_temp);

    this.OwnDetailsForm.controls['region'].setValue(item.Name);
    this.accountCreationObj['region'] = item.SysGuid || '';

    const temp = ['country', 'state', 'city'];
    const formField = ['country', 'state', 'city'];
    this.clearPostObject(this.accountCreationObj, temp);
    this.clearFormFiled(formField, this.OwnDetailsForm);

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
      this.geoName = this.location_temp[i]['Geo'].Name;
    }

  }
  appendgeo(item) {
    this.sendGeographytoAdvance.push({ ...item, Id: item.SysGuid });
    this.geographySelected = item;
    this.geoName = item.Name;
    this.OwnDetailsForm.controls['geography'].setValue(item.Name);
    this.accountCreationObj['geography'] = item.SysGuid || '';
    const formField = ['region', 'country', 'state', 'city'];
    const temp = ['region', 'country', 'state', 'city'];
    this.clearPostObject(this.accountCreationObj, temp);
    this.clearFormFiled(formField, this.OwnDetailsForm);
  }
  getaccountowner(event) {
    if (event === '') {
      this.onOwnercleared();
    }
    this.greenborder = !this.greenborder;
    // if (event !== '') {
    const financialyear = this.master3Api.AccountOwnerSearch(event);
    financialyear.subscribe((res: any) => {
      // console.log("owner", res.ResponseObject);

      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (event !== '') {
          this.customerContact = res.ResponseObject;
        } else {
          this.customerContact = this.getTenRecords(res.ResponseObject);
        }
        // if (res.ResponseObject.length == 0) {
        //   this.OwnDetailsForm.controls['owner'].setValue('');
        //   // this.financialyeardata['message'] = 'No record found';
        // }
      } else {
        this.OwnDetailsForm.controls['owner'].setValue('');
        //this.financialyeardata['message'] = 'No record found';
      }
    });
    // if (event !== '') {

    //   var accountowner = this.apiservice.getaccountowner(event)
    //   accountowner.subscribe((res: any) => {
    //     console.log("account owner response ", res.ResponseObject)
    //     this.customerContact = res.ResponseObject;
    //   })
    // }
    // else {
    //   this.customerContact = []
    // }
  }
  getAltAccOwner(event) {
    if (event === '') {
      this.onAltOwnercleared();
    }
    console.log("shcsdhc", event);
    this.greenborder = !this.greenborder;
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": '',
      "SearchText": event,
      "Guid": this.accountCreationObj['sbu'] || '' //Pass SBU Guid here
    }
    const altowner = this.master3Api.AlternateOwnerSearch(reqbody);
    altowner.subscribe(res => {
      console.log(res);
      let res2;
      let ownerList = [];
      if (!res.IsError && res.ResponseObject) {
        res2 = Object.assign({}, ...res);
        res.ResponseObject.filter(listitem => {
          if (listitem.SysGuid != this.accountCreationObj['owner']) {
            ownerList.push(listitem);
          };
        });
        res2.ResponseObject = ownerList;
        console.log(res2);
      }
      if (!res2.IsError && res2.ResponseObject) {
        this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
        this.lookupdata.nextLink = (res2.OdatanextLink) ? res2.OdatanextLink : '';
        if (event !== '') {
          this.alternativeowner = res2.ResponseObject;
        } else {
          this.alternativeowner = this.getTenRecords(res2.ResponseObject);
        }
      } else {
        // this.OwnDetailsForm.controls['altowner'].setValue('');
      }
    })
  }

  onOwnercleared() {
    this.huntingRatio = undefined;
    this.accountCreationObj['owner'] = '';
    // this.accountCreationObj['owner'] = '';
    this.accountCreationObj['isswapaccount'] = false;
    this.altHuntingRatio = undefined;
    this.accountCreationObj['swapaccount'] = '';
    this.OwnDetailsForm.controls['swapaccount'].setValue('');
    this.OwnDetailsForm.get('swapaccount').setValidators([]);
    this.OwnDetailsForm.get('swapaccount').disable();
    this.accountCreationObj['isalternateswapaccount'] = false;
    this.accountCreationObj['alternateaccountowner'] = '';
    this.accountCreationObj['alternateswapaccount'] = '';
    this.OwnDetailsForm.controls['alternateaccountowner'].setValue('');
    this.OwnDetailsForm.get('alternateaccountowner').setValidators([]);
    this.OwnDetailsForm.get('alternateaccountowner').disable();
    this.OwnDetailsForm.controls['alternateswapaccount'].setValue('');
    this.OwnDetailsForm.get('alternateswapaccount').setValidators([]);
    this.OwnDetailsForm.get('alternateswapaccount').disable();
    this.OwnDetailsForm.controls['isalternateswapaccount'].setValue(false);
  }
  onAltOwnercleared() {
    debugger;
    this.altHuntingRatio = undefined;
    this.accountCreationObj['alternateaccountowner'] = '';
    this.accountCreationObj['alternateswapaccount'] = '';
    this.OwnDetailsForm.get('alternateswapaccount').disable();
    this.OwnDetailsForm.controls['alternateaccountowner'].setValue('');
    this.OwnDetailsForm.controls['alternateswapaccount'].setValue('');
  }
  // appendState(item, index) {
  //   let i;
  //   if (index) {
  //     i = index;
  //   } else {
  //     i = this.createDropDown['state'].findIndex(x => x.Id === item.Id);
  //   }
  //   this.sendSatetoAdvance.push({ ...item, Id: item.SysGuid });
  //   this.stateSelected = item;

  //   this.OwnDetailsForm.controls['state'].setValue(item.Name);
  //   this.accountCreationObj['state'] = item.SysGuid || '';

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) {
  //     this.accountCreationObj['country'] = this.location_temp[i]['Country'].SysGuid;
  //     if (this.accountCreationObj['country']) {
  //       this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
  //       // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
  //     }
  //   }
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) {
  //     let counryName = (this.location_temp[i]['Country'].Name).toLowerCase();
  //     let countryFlag = counryName === "usa" || counryName === "india" || counryName === "uk";
  //     if (countryFlag) {
  //       this.cityCountryValid = countryFlag;
  //     }
  //     this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
  //   }

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);

  // }
  // appendcity1(item, index) {
  //   let i;
  //   if (index) {
  //     i = index;
  //   } else {
  //     i = this.createDropDown['city'].findIndex(x => x.Id === item.Id);
  //   }
  //   this.sendCitytoAdvance.push({ ...item, Id: item.SysGuid });
  //   this.citySelected = item;
  //   this.OwnDetailsForm.controls['city'].setValue(item.Name);
  //   this.accountCreationObj['city'] = item.SysGuid || '';

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'SysGuid'])) this.accountCreationObj['state'] = this.location_temp[i]['State'].SysGuid;
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'Name'])) this.OwnDetailsForm.controls['state'].setValue(this.location_temp[i]['State'].Name);

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) {
  //     this.accountCreationObj['country'] = this.location_temp[i]['Country'].SysGuid;
  //     if (this.accountCreationObj['country']) {
  //       this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
  //       // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
  //     }
  //   }
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) {

  //     let counryName = (this.location_temp[i]['Country'].Name).toLowerCase();
  //     let countryFlag = counryName === "usa" || counryName === "india" || counryName === "uk";
  //     if (countryFlag) {
  //       this.cityCountryValid = countryFlag;
  //     }
  //     this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
  //   }

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);

  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
  //   if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);

  // }
  disabelCity(item, isExists) {
    if (item && !isExists) {
      this.OwnDetailsForm.controls['city'].disable();
    } else {
      this.OwnDetailsForm.controls['city'].enable();
    }
  }
  appendState(item, index, advFlag) {

    let i;
    if (advFlag) {
      i = index;
      this.disabelCity(item, item.isExists)
    } else {
      if (item.State) {
        this.disabelCity(item, item.State.isExists)
        i = this.location_temp.findIndex(x => x.State.SysGuid === item.State.SysGuid);
      } else {
        this.disabelCity(item, item.isExists)
        i = this.location_temp.findIndex(x => x.SysGuid === item.SysGuid);
      }

      // i = this.createDropDown['state'].findIndex(x => x.Id ? x.Id : x.SysGuid === item.Id ? item.Id : item.SysGuid);
    }
    this.sendSatetoAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.stateSelected = item;
    this.stateName = item.Name;
    this.OwnDetailsForm.controls['state'].setValue(item.Name);
    this.accountCreationObj['state'] = item.SysGuid || '';
    const cityControl = this.OwnDetailsForm.get('city');
    const stateControl = this.OwnDetailsForm.get('state');
    const countryVal = this.OwnDetailsForm.controls['country'].value.toLowerCase();;
    console.log(countryVal);
    // this.customValidators['state'] = true;
    // stateControl.setValidators([Validators.required]);
    const formFiled = ['city'];
    const temp = ['city'];
    this.clearFormFiled(formFiled, this.OwnDetailsForm);
    this.clearPostObject(this.accountCreationObj, temp);
    let countryName = this.OwnDetailsForm.controls['country'].value.toLowerCase();
    if (!(countryName === "india" || countryName === "united kingdom" || countryName === "united states" || countryName === "usa" || countryName === "us")) {
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.get('state').updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.get('city').updateValueAndValidity();
    } else {
      this.customValidators['state'] = true;
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
      this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();

    }

    if (this.accountCreationObj['state'] && !item.isExists) {
      // console.log("indsdfgfffffffffffffffffffg");
      this.OwnDetailsForm.controls['city'].disable();
      this.customValidators['city'] = false;
      cityControl.setValidators([]);
      cityControl.updateValueAndValidity();
    } else if (this.accountCreationObj['state'] && item.isExists && (countryName === "india" || countryName === "united kingdom" || countryName === "united states" || countryName === "usa" || countryName === "us")) {
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['city'].enable();
      cityControl.setValidators([Validators.required]);
      cityControl.updateValueAndValidity();
      this.customValidators['state'] = true;
      stateControl.setValidators([Validators.required]);
      stateControl.updateValueAndValidity();
    }
    // else{
    //    this.customValidators['city'] = false;
    //   cityControl.setValidators([]);
    //   this.customValidators['state'] = false;
    //   stateControl.setValidators([]);
    // }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) {
      this.accountCreationObj['country'] = this.location_temp[i]['Country'].SysGuid;
      if (this.accountCreationObj['country']) {
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
        // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) {
      const counryName = (this.location_temp[i]['Country'].Name).toLowerCase();
      this.countryNameField = counryName;
      // let countryFlag = counryName == "india" || counryName == "united kingdom" || counryName == "united states" || counryName == "usa" || counryName == "us";
      // if (countryFlag) {
      //   this.cityCountryValid = countryFlag;
      // }

      // if (!(counryName == "india" || counryName == "united kingdom" || counryName == "united states" || counryName == "usa" || counryName == "us")) {
      //   this.customValidators['city'] = false;
      //   cityControl.setValidators([]);
      //   cityControl.updateValueAndValidity();
      // }
      // else {
      //   this.customValidators['city'] = true;
      //   cityControl.setValidators([Validators.required]);
      //   cityControl.updateValueAndValidity();
      // }
      this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
      this.regionName = this.location_temp[i]['Region'].Name;

    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
      this.geoName = this.location_temp[i]['Geo'].Name;
    }

  }
  appendcity1(item, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      if (item.City) {
        i = this.location_temp.findIndex(x => x.City.SysGuid === item.City.SysGuid);
      } else {
        i = this.location_temp.findIndex(x => x.SysGuid === item.SysGuid);
      }

    }

    this.sendCitytoAdvance.push({ ...item, Id: item.SysGuid });
    this.citySelected = item;
    this.OwnDetailsForm.controls['city'].setValue(item.Name);
    this.accountCreationObj['city'] = item.SysGuid || '';
    this.cityNameField = item.Name;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'SysGuid'])) this.accountCreationObj['state'] = this.location_temp[i]['State'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'Name'])) {
      this.OwnDetailsForm.controls['state'].setValue(this.location_temp[i]['State'].Name);
      this.stateName = this.location_temp[i]['State'].Name;
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) {
      this.accountCreationObj['country'] = this.location_temp[i]['Country'].SysGuid;
      if (this.accountCreationObj['country']) {
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
        // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) {

      const counryName = (this.location_temp[i]['Country'].Name).toLowerCase();
      this.countryNameField = counryName;
      // let countryFlag = counryName === "usa" || counryName === "india" || counryName === "uk";
      // if (countryFlag) {
      //   this.cityCountryValid = countryFlag;
      // }
      const stateControl = this.OwnDetailsForm.get('state');
      const cityControl = this.OwnDetailsForm.get('city');
      if (!(counryName === "india" || counryName === "united kingdom" || counryName === "united states" || counryName === "usa" || counryName === "us")) {
        stateControl.setValidators([]);
        this.customValidators['state'] = false;
      }
      else {
        stateControl.setValidators([Validators.required]);
        this.customValidators['state'] = true;
        cityControl.setValidators([Validators.required]);
        this.customValidators['city'] = true;
      }

      this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
      this.regionName = this.location_temp[i]['Region'].Name;
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.countryNameField = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    }

  }
  setGovtAc(e) {
    this.OwnDetailsForm.controls['governementaccount'].setValue(e.value);
    this.accountCreationObj['governementaccount'] = e.value;
  }
  setBussiness(e) {
    this.OwnDetailsForm.controls['newagebusiness'].setValue(e.value);
    this.accountCreationObj['newagebusiness'] = e.value;
  }
  isSwapAccount(e) {
    this.searchAccount1 = e.checked;
    this.OwnDetailsForm.controls['isswapaccount'].setValue(e.checked);
    this.accountCreationObj['isswapaccount'] = e.checked;
    if (e.checked) {
      // console.log("value of e.checked", e.checked);
      this.OwnDetailsForm.controls['swapaccount'].enable();
      this.OwnDetailsForm.get('swapaccount').setValidators([Validators.required]);
      this.OwnDetailsForm.controls['swapaccount'].updateValueAndValidity();
      this.OwnDetailsForm.controls['isalternateswapaccount'].disable();
      this.OwnDetailsForm.controls['alternateaccountowner'].disable();
      this.OwnDetailsForm.controls['alternateswapaccount'].disable();
      this.accountCreationObj['isalternateswapaccount'] = false;
      this.altHuntingRatio = undefined;
      this.OwnDetailsForm.controls['isalternateswapaccount'].setValue(false);
      this.OwnDetailsForm.controls['alternateaccountowner'].setValue('');
      this.OwnDetailsForm.controls['alternateswapaccount'].setValue('');
      this.accountCreationObj['alternateswapaccount'] = '';
      this.accountCreationObj['alternateaccountowner'] = '';
    }
    else {
      if (this.huntingRatio >= 8) this.OwnDetailsForm.controls['isalternateswapaccount'].enable();
      else this.OwnDetailsForm.controls['isalternateswapaccount'].disable();
      this.accountCreationObj['swapaccount'] = '';
      this.OwnDetailsForm.controls['swapaccount'].setValue('');
      this.OwnDetailsForm.controls['swapaccount'].disable();
      this.searchAccount1 = 'false';
      this.OwnDetailsForm.get('swapaccount').clearValidators();
    }
  }
  isAltSwapAccount(e) {
    console.log("isaltswapaccount value is ", this.OwnDetailsForm.controls['isaltswapaccount'])
    this.searchAltAccount = e.checked;
    this.OwnDetailsForm.controls['isalternateswapaccount'].setValue(e.checked);
    this.accountCreationObj['isalternateswapaccount'] = e.checked;
    if (!e.checked) {
      this.accountCreationObj['alternateaccountowner'] = '';
      this.OwnDetailsForm.controls['alternateaccountowner'].setValue('');
      this.OwnDetailsForm.controls['alternateaccountowner'].disable();
      this.OwnDetailsForm.get('alternateaccountowner').clearValidators();
      this.accountCreationObj['alternateswapaccount'] = '';
      this.OwnDetailsForm.controls['alternateswapaccount'].setValue('');
      this.OwnDetailsForm.controls['alternateswapaccount'].disable();
      this.OwnDetailsForm.get('alternateswapaccount').clearValidators();
    }
    else {
      if (!this.accountCreationObj['altowner']) {
        this.altHuntingRatio = undefined;
      }
      console.log('value of e.checked', e.checked);
      this.OwnDetailsForm.controls['alternateaccountowner'].enable();
      this.OwnDetailsForm.get('alternateaccountowner').setValidators([Validators.required]);
      this.OwnDetailsForm.get('alternateswapaccount').setValidators([Validators.required]);
    }
  }
  assignClassforAltOwner() {
    console.log(this.altHuntingRatio);
    if (this.altHuntingRatio && this.altHuntingRatio >= 8) {
      return 'customized-input1'
    }
    else if (this.altHuntingRatio && this.altHuntingRatio < 8) {
      return 'customized-input2'
    }
    else { }
  }
  appendcontact4(item) {
    // this.contactName4 = item.Name;
    // this.stateId = item.SysGuid;
    this.OwnDetailsForm.controls['state'].setValue(item.Name);
    // console.log("sbuisdd", this.SbuId);
    this.accountCreationObj['state'] = item.SysGuid;
  }
  // appendcontact3(value: string, i) {
  //   this.contactName3 = value;
  //   this.selectedContact3.push(this.wiproContact3[i])
  // }
  getregionbygeo(event) {

    this.createDropDown['region'] = [];
    this.location_temp = [];
    let region;
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['region', 'country', 'state', 'city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
      this.getAllSwapAccount(this.accountCreationObj['owner'], '');
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (event === '') {
        const temp = ['region', 'country', 'state', 'city'];
        const formField = ['country', 'state', 'city'];
        this.clearPostObject(this.accountCreationObj, temp);
        this.clearFormFiled(formField, this.OwnDetailsForm);
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }

      if (this.userdat.searchFieldValidator(this.accountCreationObj['geography']))
        region = this.master3Api.getregionbygeo(this.accountCreationObj['geography'], event);
      else
        region = this.master3Api.GetAllByRegion(event);
      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("geobyreagion response", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (this.userdat.searchFieldValidator(this.accountCreationObj['geography'])) {
            this.createDropDown.advanceLookupRegion = res.ResponseObject;
            if (event) {
              this.createDropDown.region = res.ResponseObject;
            } else {
              this.createDropDown.region = this.getTenRecords(res.ResponseObject);
            }

          }
          else {
            const formField1 = ['geography'];
            // this.clearPostObject(this.accountCreationObj, formField1);
            // this.clearFormFiled(formField1, this.OwnDetailsForm);
            this.location_temp = res.ResponseObject;
            this.createDropDown.region = [];
            this.createDropDown.advanceLookupRegion = res.ResponseObject;
            res.ResponseObject.map(data => {
              this.createDropDown.region.push(data.Region);
            });
          }
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            // this.clearPostObject(this.accountCreationObj, temp);
            this.createDropDown.region = [];
            this.createDropDown.advanceLookupRegion = [];
            this.createDropDown.region['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormFiled(temp, this.OwnDetailsForm);
          // this.clearPostObject(this.accountCreationObj, temp);
          this.createDropDown.region = [];
          this.createDropDown.advanceLookupRegion = [];
          this.createDropDown.region['message'] = 'No record found';
        }
      }, error => {
        // this.clearFormFiled(temp, this.OwnDetailsForm);
        this.isActivityGroupSearchLoading = false;
        this.createDropDown['region'] = [];
        this.createDropDown.advanceLookupRegion = [];
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.createDropDown['region']['message'] = 'No record found';
      });
    }

  }
  geoId(geoId: any, value: any) {
    throw new Error("Method not implemented.");
  }
  CountryByRegion(event) {
    let countrybyregion;
    this.location_temp = [];
    this.createDropDown['country'] = [];
    this.createDropDown['advanceLookupCountry'] = [];
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['country', 'state', 'city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
      this.getAllSwapAccount(this.accountCreationObj['owner'], '');
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (event === '') {
        const formField = ['state', 'city'];
        const temp = ['country', 'state', 'city'];
        // this.clearPostObject(this.accountCreationObj, temp);
        // this.clearFormFiled(formField, this.OwnDetailsForm);
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }

      // if (this.userdat.searchFieldValidator(this.accountCreationObj['region']))
      //   countrybyregion = this.master3Api.CountryByRegion(this.accountCreationObj['region'], event);
      // else
      countrybyregion = this.master3Api.GetAllByCountry(event);
      countrybyregion.subscribe((res: any) => {
        // console.log("countryby geo", res.ResponseObject);
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // if (this.userdat.searchFieldValidator(this.accountCreationObj['region'])) {
          //   this.createDropDown['advanceLookupCountry'] = res.ResponseObject;
          //   if (event) {
          //     this.createDropDown['country'] = res.ResponseObject;
          //   } else {
          //     this.createDropDown['country'] = this.getTenRecords(res.ResponseObject);
          //   }

          // }
          // else {
          this.location_temp = res.ResponseObject;
          const temp1 = ['geography', 'region'];
          // this.clearPostObject(this.accountCreationObj, temp1);
          // this.clearFormFiled(temp1, this.OwnDetailsForm);
          this.createDropDown['country'] = [];
          this.createDropDown['advanceLookupCountry'] = res.ResponseObject;
          res.ResponseObject.map(data => {
            this.createDropDown['country'].push(data.Country);
          });
          // }
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            // this.clearPostObject(this.accountCreationObj, temp);
            this.createDropDown['country'] = [];
            this.createDropDown['advanceLookupCountry'] = [];
            this.createDropDown['country']['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormFiled(temp, this.OwnDetailsForm);

          // this.clearPostObject(this.accountCreationObj, temp);
          this.createDropDown['country'] = [];
          this.createDropDown['advanceLookupCountry'] = [];
          this.createDropDown['country']['message'] = 'No record found';
        }
      }, error => {
        // this.clearFormFiled(temp, this.OwnDetailsForm);

        this.isActivityGroupSearchLoading = false;
        this.createDropDown['country'] = [];
        this.createDropDown['advanceLookupCountry'] = [];
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.createDropDown['country']['message'] = 'No record found';
      });
    }

  }
  getStateByCountry(event) {
    let statebycountry;
    this.location_temp = [];
    this.createDropDown['state'] = [];
    this.createDropDown['advanceLookupState'] = [];

    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['state', 'city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
    }
    else {

      this.isActivityGroupSearchLoading = true;
      // if (event === '') {
      //   const formFiled = ['city'];
      //   const temp = ['state', 'city'];
      //   // this.clearFormFiled(formFiled, this.OwnDetailsForm);
      //   // this.clearPostObject(this.accountCreationObj, temp);
      // }

      if (this.userdat.searchFieldValidator(this.accountCreationObj['country']))
        statebycountry = this.master3Api.getStateByCountry(this.accountCreationObj['country'], event);
      else
        statebycountry = this.master3Api.GetAllByState(event);

      statebycountry.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("satateby country response ", res.ResponseObject);

        // this condition should be check at the time of selection of country from dropdown. kkn
        // res.ResponseObject.forEach(val => {
        //   let countryFlag = val.Country.Name === "USA" || val.Country.Name === "INDIA" || val.Country.Name === "UK";
        //   console.log(countryFlag);
        //   if(countryFlag){
        //     console.log("Name :::"+ countryFlag)
        //     this.cityCountryValid = countryFlag;
        //   }
        // });
        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (this.userdat.searchFieldValidator(this.accountCreationObj['country'])) {
            this.createDropDown['advanceLookupState'] = res.ResponseObject;
            this.location_temp = res.ResponseObject;
            if (event) {
              this.createDropDown['state'] = res.ResponseObject;
            } else {
              this.createDropDown['state'] = this.getTenRecords(res.ResponseObject);
            }
          }
          else {
            this.location_temp = res.ResponseObject;
            const temp1 = ['geography', 'region', 'country'];
            // this.clearPostObject(this.accountCreationObj, temp1);
            // this.clearFormFiled(temp1, this.OwnDetailsForm);
            this.createDropDown['state'] = [];
            this.createDropDown['advanceLookupState'] = res.ResponseObject;
            res.ResponseObject.map(data => {
              this.createDropDown['state'].push(data.State);
            });
          }
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            // this.clearPostObject(this.accountCreationObj, temp);
            this.createDropDown['state'] = [];
            this.createDropDown['advanceLookupState'] = [];
            this.createDropDown['state']['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormFiled(temp, this.OwnDetailsForm);
          // this.clearPostObject(this.accountCreationObj, temp);
          this.createDropDown['state'] = [];
          this.createDropDown['advanceLookupState'] = [];
          this.createDropDown['state']['message'] = 'No record found';
        }
      }, error => {
        // this.clearFormFiled(temp, this.OwnDetailsForm);
        this.isActivityGroupSearchLoading = false;
        this.createDropDown['country'] = [];
        this.createDropDown['advanceLookupCountry'] = [];
        this.createDropDown['advanceLookupState'] = [];
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.createDropDown['country']['message'] = 'No record found';
      });
    }


  }
  getCityByState(event) {
    // if (val == '') {
    //   this.assignmentObj['City'] = {};
    // }
    const cityControl = this.OwnDetailsForm.get('city');
    cityControl.setValidators([Validators.required]);
    this.cityCountryValid = true;
    this.location_temp = [];
    //  this.wiproCity1 = [];
    this.createDropDown['city'] = [];
    this.createDropDown['advanceLookupCity'] = [];
    let citybyname;
    // if (val && val.length > 0) {
    //   if (this.assignmentObj['State'].Id != '' && this.assignmentObj['State'].Id != undefined && this.assignmentObj['State'].Id != null)
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
    }
    else {
      this.isActivityGroupSearchLoading = true;
      const temp = ['city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      if (this.userdat.searchFieldValidator(this.accountCreationObj['state']))
        citybyname = this.master3Api.getCityByState(this.accountCreationObj['state'], event);
      else
        citybyname = this.master3Api.GetAllByCity(event);
      citybyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("city by satate response", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        // this condition should be check at the time of selection of country from dropdown. kkn
        // res.ResponseObject.forEach(val => {
        //   let countryFlag = val.Country.Name === "USA" || val.Country.Name === "INDIA" || val.Country.Name === "UK";
        //   console.log(countryFlag);
        //   if(countryFlag){
        //     console.log("Name :::"+ countryFlag)
        //     this.cityCountryValid = countryFlag;
        //   }
        // });

        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (this.userdat.searchFieldValidator(this.accountCreationObj['state'])) {
            this.createDropDown['advanceLookupCity'] = res.ResponseObject;
            this.location_temp = res.ResponseObject;
            if (event) {
              this.createDropDown['city'] = res.ResponseObject;
            } else {
              this.createDropDown['city'] = this.getTenRecords(res.ResponseObject);
            }
            // this.createDropDown['city'] = res.ResponseObject;
          }
          else {
            const temp1 = ['geography', 'region', 'country', 'state'];
            // this.clearPostObject(this.accountCreationObj, temp1);
            // this.clearFormFiled(temp1, this.OwnDetailsForm);
            this.createDropDown['city'] = [];
            this.createDropDown['advanceLookupCity'] = res.ResponseObject;
            this.location_temp = res.ResponseObject;
            res.ResponseObject.map(data => {
              this.createDropDown['city'].push(data.City);
            });
          }
          if (res.ResponseObject.length === 0) {
            if (this.OwnDetailsForm.value.country.toLowerCase() === "india" || this.OwnDetailsForm.value.country.toLowerCase() === "united kingdom" || this.OwnDetailsForm.value.country.toLowerCase() === "united states" || this.OwnDetailsForm.value.country.toLowerCase() === "usa" || this.OwnDetailsForm.value.country.toLowerCase() === "us") {
              if (this.createDropDown['city'] && this.createDropDown['city'].length <= 0) {
                cityControl.setValidators(null);
                this.cityCountryValid = false;
              }
              else {
                cityControl.setValidators([Validators.required]);
                this.cityCountryValid = true;
              }
            }
            else {
              cityControl.setValidators([Validators.required]);
              this.cityCountryValid = true;
            }

            // this.assignmentObj['City'] = {};
            this.createDropDown['city'] = [];
            this.createDropDown['advanceLookupCity'] = [];
            this.createDropDown['city']['message'] = 'No record found';
          }
        }
        else {
          // this.assignmentObj['City'] = {};
          this.createDropDown['city'] = [];
          this.createDropDown['advanceLookupCity'] = [];
          this.createDropDown['city']['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown['city'] = [];
        this.createDropDown['advanceLookupCity'] = [];
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.createDropDown['city']['message'] = 'No record found';
      })
    }
  }
  // sbu by name 
  // getSbuByName(event) {
  //   if (event !== '') {
  //     let sbubyname = this.master3Api.getSBUByName(event)
  //     sbubyname.subscribe((res: any) => {
  //       console.log("sbuby name response", res.ResponseObject);
  //       if (!res.IsError && res.ResponseObject) {
  //         this.Sbudata = res.ResponseObject;
  //         if (res.ResponseObject.length == 0) {
  //           this.OwnDetailsForm.controls['sbu'].setValue('');
  //           this.Sbudata['message'] = 'No record found';
  //         }
  //       }
  //       else {
  //         this.OwnDetailsForm.controls['sbu'].setValue('');
  //         this.Sbudata['message'] = 'No record found';
  //       }

  //     })
  //   }
  // }
  getSbuByName(event) {
    this.Sbudata = [];
    // this.removeVerticalAndSbuverticalData(event, false);

    this.IsSubVerticalExist = true;
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      this.contactSBUclose();
      // this.OwnDetailsForm.controls['sbu'].setValue('');
      // this.accountCreationObj['sbu'] = '';
    }
    else {
      this.isActivityGroupSearchLoading = true;
      // if (event !== '') {
      const sbubyname = this.master3Api.getSBUByName(event)
      sbubyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        console.log("sbuby name response", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          this.Sbudata = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            this.Sbudata = [];
            this.Sbudata['message'] = 'No record found';
          }
        }
        else {
          // this.OwnDetailsForm.controls['sbu'].setValue('');
          this.Sbudata = [];
          this.Sbudata['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.Sbudata = [];
      });
    }
  }

  // vertical  by passing sbuid
  // getVerticalbySBUID(event) {
  //   if (event !== '') {
  //     let vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], event)
  //     vertical.subscribe((res: any) => {
  //       console.log("verticalby sbuid ", res.ResponseObject);
  //       if (!res.IsError && res.ResponseObject) {
  //         this.verticaldata = res.ResponseObject;
  //         if (res.ResponseObject.length == 0) {
  //           this.OwnDetailsForm.controls['vertical'].setValue('');
  //           this.verticaldata['message'] = 'No record found';
  //         }
  //       }
  //       else {
  //         this.OwnDetailsForm.controls['vertical'].setValue('');
  //         this.verticaldata['message'] = 'No record found';
  //       }
  //     })
  //   }
  // }
  // getVerticalbySBUID(event) {
  //   this.sub_and_vertical = [];
  //   this.verticaldata = [];
  //   let vertical;
  //   if (event !== '') {
  //     if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
  //       vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], event)
  //     else
  //       vertical = this.master3Api.SearchVerticalAndSBU(event)

  //     vertical.subscribe((res: any) => {
  //       console.log("verticalby sbuid ", res.ResponseObject);
  //       if (!res.IsError && res.ResponseObject) {
  //         if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined) {
  //           this.verticaldata = res.ResponseObject;
  //         } else {
  //           this.sub_and_vertical = res.ResponseObject;
  //           this.accountCreationObj['sbu'] = '';
  //           this.OwnDetailsForm.controls['sbu'].setValue('');
  //           this.subverticaldata = [];
  //           // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
  //           res.ResponseObject.map(data => {
  //             this.subverticaldata.push(data.Vertical);
  //           });
  //           console.log(this.subverticaldata);
  //         }

  //         if (res.ResponseObject.length == 0) {
  //           this.OwnDetailsForm.controls['vertical'].setValue('');
  //           this.verticaldata['message'] = 'No record found';
  //         }
  //       }
  //       else {
  //         this.OwnDetailsForm.controls['vertical'].setValue('');
  //         this.verticaldata['message'] = 'No record found';
  //       }

  //     })
  //   }
  // }

  getVerticalbySBUID(event) {
    this.sub_and_vertical = [];
    this.isActivityGroupSearchLoading = true;
    this.verticaldata = [];
    this.advancelookupVertical = [];
    // if (event === '') {
    //   this.accountCreationObj['subvertical'] = '';
    //   this.OwnDetailsForm.controls['subvertical'].setValue('');
    //   this.accountCreationObj['vertical'] = '';
    //   this.OwnDetailsForm.controls['vertical'].setValue('');
    // }

    //  this.IsSubVerticalExist = true;

    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      // if (event == '') {
      this.contactNameclose();
      // this.accountCreationObj['sbu'] = '';
      // this.accountCreationObj['subvertical'] = '';
      // this.accountCreationObj['vertical'] = '';
      // // this.OwnDetailsForm.controls['sbu'].setValue('');
      // this.OwnDetailsForm.controls['subvertical'].setValue('');
      // this.OwnDetailsForm.controls['vertical'].setValue('');
    }
    else {
      let vertical;
      // if (event !== '') {
      if (this.userdat.searchFieldValidator(this.accountCreationObj['sbu']))
        // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
        vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], event)
      else
        vertical = this.master3Api.SearchVerticalAndSBU(event)

      vertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("verticalby sbuid ", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.accountCreationObj['sbu'])) {
            this.advancelookupVertical = res.ResponseObject;
            this.verticaldata = res.ResponseObject;
          } else {
            this.sub_and_vertical = res.ResponseObject;
            // this.accountCreationObj['sbu'] = '';
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            this.verticaldata = [];
            this.advancelookupVertical = res.ResponseObject;
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            res.ResponseObject.map(data => {
              this.verticaldata.push(data.Vertical);
            });

            console.log(this.verticaldata);
          }

          if (res.ResponseObject.length === 0) {
            // this.OwnDetailsForm.controls['vertical'].setValue('');
            this.verticaldata = [];
            this.advancelookupVertical = [];
            this.verticaldata['message'] = 'No record found';
          }
        }
        else {
          // this.OwnDetailsForm.controls['vertical'].setValue('');
          this.advancelookupVertical = [];
          this.verticaldata = [];
          this.verticaldata['message'] = 'No record found';
        }

      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.verticaldata = [];
        this.advancelookupVertical = [];
      });
    }
  }
  getSubVerticalByVertical(event) {
    this.subverticaldata = [];
    this.sub_and_vertical = [];
    this.advancesubverticaldata = [];
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      // if (event == '') {
      // this.accountCreationObj['sbu'] = '';
      // this.accountCreationObj['subvertical'] = '';
      // this.accountCreationObj['vertical'] = '';
      // this.OwnDetailsForm.controls['sbu'].setValue('');
      // this.OwnDetailsForm.controls['subvertical'].setValue('');
      // this.OwnDetailsForm.controls['vertical'].setValue('');
    }
    else {
      let subvertical;
      // console.log(this.accountCreationObj['vertical']);
      this.isActivityGroupSearchLoading = true;

      if (this.userdat.searchFieldValidator(this.accountCreationObj['vertical']))

        subvertical = this.master3Api.getSubVerticalByVertical(this.accountCreationObj['vertical'], event);
      else
        subvertical = this.master3Api.SearchAllBySubVertical(event);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        console.log("response for subvertical", res.ResponseObject);

        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (this.userdat.searchFieldValidator(this.accountCreationObj['vertical'])) {
            this.advancesubverticaldata = res.ResponseObject;
            this.subverticaldata = res.ResponseObject;
          }
          else {
            this.sub_and_vertical = res.ResponseObject;
            // this.accountCreationObj['sbu'] = '';
            // this.accountCreationObj['vertical'] = '';
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            // this.OwnDetailsForm.controls['vertical'].setValue('');
            this.subverticaldata = [];
            this.advancesubverticaldata = res.ResponseObject;
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            res.ResponseObject.map(data => {
              this.subverticaldata.push(data.SubVertical);
            });
            console.log(this.subverticaldata);
          }
          if (res.ResponseObject.length === 0) {
            // this.OwnDetailsForm.controls['subvertical'].setValue('');
            this.subverticaldata = [];
            this.advancesubverticaldata = [];
            this.subverticaldata['message'] = 'No record found';
          }
        }
        else {
          // this.OwnDetailsForm.controls['subvertical'].setValue('');
          this.subverticaldata = [];
          this.advancesubverticaldata = [];
          this.subverticaldata['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.subverticaldata = [];
        this.advancesubverticaldata = [];
        this.subverticaldata['message'] = 'No record found';
      });
    }
  }

  getFinancialYear(event) {
    if (event !== '') {
      const financialyear = this.master3Api.getFinancialYear(event);
      financialyear.subscribe((res: any) => {
        // console.log("response for finacial year ", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          this.financialyeardata = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            this.OwnDetailsForm.controls['finanacialyear'].setValue('');
            this.financialyeardata['message'] = 'No record found';
          }
        }
        else {
          this.OwnDetailsForm.controls['finanacialyear'].setValue('');
          this.financialyeardata['message'] = 'No record found';
        }
      });
    }
  }

  clearPostObject(postObj: any, emptyableObj) {
    // clear post object
    emptyableObj.forEach((element: any) => {
      postObj[element] = '';
    });
  }
  clearFormFiled(formField: any, FormName) {
    // clear form field data
    formField.forEach((element: any) => {
      if (!this.accountCreationObj[element] && typeof this.accountCreationObj[element] !== 'boolean')
        FormName.controls[element].setValue('');
    });
    //       //   this.sbuArray.push(element.SBU);
  }
  getGeo(event) {

    // this.wiproContact2 = [];
    this.createDropDown['geography'] = [];
    let orginalArray;
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['geography', 'region', 'country', 'state', 'city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
      this.getAllSwapAccount(this.accountCreationObj['owner'], '');
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (event === '') {
        const temp = ['geography', 'region', 'country', 'state', 'city'];
        const formField = ['region', 'country', 'state', 'city'];
        // this.clearPostObject(this.accountCreationObj, temp);
        // this.clearFormFiled(formField, this.OwnDetailsForm);
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }

      orginalArray = this.master3Api.getgeobyname(event);
      orginalArray.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          // this.wiproContact2 = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (event) {
            this.createDropDown['geography'] = res.ResponseObject;
          } else {
            this.createDropDown['geography'] = this.getTenRecords(res.ResponseObject);
          }

          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            this.createDropDown['geography'] = [];
            // this.OwnDetailsForm.controls['geography'].setValue('');
            this.createDropDown['geography']['message'] = 'No record found';
            // this.wiproContact2['message'] = 'No record found';
          }
        }
        else {
          // this.OwnDetailsForm.controls['geography'].setValue('');
          // this.clearFormFiled(temp, this.OwnDetailsForm);
          this.createDropDown['geography'] = [];
          // this.OwnDetailsForm.controls['geography'].setValue('');
          this.createDropDown['geography']['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        // this.clearFormFiled(temp, this.OwnDetailsForm);
        this.createDropDown['geography'] = [];
        // this.OwnDetailsForm.controls['geography'].setValue('');
        this.createDropDown['geography']['message'] = 'No record found';
      });
    }
  }

  // OpenAccountProspectOwner() {
  //   this.greenborder = !this.greenborder;
  //   const dialogRef = this.dialog.open(OpenProspectAccountOwner,
  //     {
  //       width: '380px'
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log("result of pop up ", result, "result of 1 ", result[0].contact);
  //       this.formsData.owner = result[0].contact;
  //     }
  //   });
  // }
  goBack() {
    //this.location.back();
    this.router.navigate(['/accounts/accountcreation/activerequest']);
    localStorage.removeItem('parentdetailes');
    localStorage.removeItem('parentflag');
  }
  stepone() {
    if (this.AccDetailsForm.value.legalentity) {
      this.leadinfo = false;
      this.dealinfo = false;
      // this.ownerdetails = false;
      this.twoactive = false;
      this.editablefields = true;
      this.AccDetailsForm.controls['currency'].setValue(this.getSymbol(this.CurrencyData));
    }
  }
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // this.AccDetailsForm
  // this.OwnDetailsForm
  // this.accountCreationObj
  postObjValidator(obj) {
    // const keys = Object.keys(obj);
    // keys.map(function (k) {
    //   if (typeof obj[k] !== 'boolean') {
    //     if (!obj[k])
    //       delete obj[k];
    //   }
    // });
    return obj;
  }
  setPostObj(postActionCode) {
    /* 184450000=> for approval pending with sbu (RoleType: 1),  184450005=> for Draft (RoleType: 1) ==> */
    /* 184450001=> for approval pending with CSO (RoleType: 2),  184450005=> for Draft (RoleType: 2) ==> */

    const obj = {
      'odslegalentityname': this.AccDetailsForm.value.legalentity || '',
      'parentaccount': this.accountCreationObj['parentaccount'] || '',
      'ultimateparent': this.accountCreationObj['ultimateparent'] || '',
      'headquarters': this.AccDetailsForm.value.headquarters || '',
      'countrycode': this.AccDetailsForm.value.countrycode || '',
      'citystring': this.AccDetailsForm.value.city || '',
      'countrystring': this.AccDetailsForm.value.country || '',
      'state': this.accountCreationObj['state'] || '',
      'phonenumber': this.AccDetailsForm.value.phonenumber || '',
      'email': this.AccDetailsForm.value.email || '',
      'businessdescription': this.AccDetailsForm.value.businessdescription || '',
      'sicdescription': this.AccDetailsForm.value.sicdescription || '',
      'stockindexmembership': this.AccDetailsForm.value.stockindexmembership || '',
      'tickersymbol': this.AccDetailsForm.value.tickersymbol || '',
      'currency': this.accountCreationObj['currency'] || '',
      'fortune': parseFloat(this.AccDetailsForm.value.fortune) || '',
      'profits': parseFloat(this.AccDetailsForm.value.profits) || '',
      'revenue': parseFloat(this.AccDetailsForm.value.revenue) || '',
      'operatingmargins': parseFloat(this.AccDetailsForm.value.operatingmargins) || '',
      // do not remove + from the next line, it keep marketvalue as number before assigning to payload
      'marketvalue': parseFloat(this.AccDetailsForm.value.marketvalue) || '',
      'returnonequity': parseFloat(this.AccDetailsForm.value.returnonequity) || '',
      'entitytype': this.AccDetailsForm.value.entitytype || '',
      'marketrisk': this.accountCreationObj['marketrisk'] || '',
      'isswapaccount': (this.accountCreationObj['swapaccount']) ? this.OwnDetailsForm.value.isswapaccount : false,
      'swapaccount': (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccount'] : '',
      // 'swapaccount': this.accountCreationObj['swapaccount'] || '',
      'growthcategory': this.OwnDetailsForm.value.growthcategory || '',
      'revenuecategory': this.OwnDetailsForm.value.revenuecategory || '',
      'cluster': this.accountCreationObj['cluster'] || '',
      'sbu': this.accountCreationObj['sbu'] || '',
      'newagebusiness': this.accountCreationObj['newagebusiness'] || false,
      'governementaccount': this.accountCreationObj['governementaccount'] || false,
      'vertical': this.accountCreationObj['vertical'] || '',
      'subvertical': this.accountCreationObj['subvertical'] || '',
      'city': this.accountCreationObj['city'] || '',
      'remarks': this.OwnDetailsForm.controls.opportunity.value,
      'country': this.accountCreationObj['country'] || '',
      'region': this.accountCreationObj['region'] || '',
      'geography': this.accountCreationObj['geography'] || '',
      'website': this.AccDetailsForm.value.website || '',
      'ownershiptype': this.AccDetailsForm.value.ownershiptype || '',
      'dunsid': this.accountCreationObj['dunsid'] || '', // this.AccDetailsForm.value.dunsid 
      'owner': this.accountCreationObj['owner'] || '',
      'prospectnumber': '',
      'name': this.AccDetailsForm.value.accountDetailName || '',
      'requesttype': (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isalternateswapaccount) ? 3 : 1,  // 1 for create account 2,3 for swap account chanked
      // 'prospecttype': 2, // hunting
      'finanacialyear': this.accountCreationObj['finanacialyear'] || '',
      'coveragelevel': this.OwnDetailsForm.value.coveragelevel ? this.OwnDetailsForm.value.coveragelevel.toString() : '',
      'employees': this.AccDetailsForm.value.employees || '',
      'address': this.AccDetailsForm.value.address || '',
      'statuscode': postActionCode,
      // 'prospectid': this.accountCreationObj['prospectid'] || '' ,
      'swapaccountcomment': (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccountcomment'] : '',  //this.swapaccountcomment,
      // 'swapaccountcomment': this.accountCreationObj['swapaccountcomment'] || '',// come from popup
      'ultimateparentsdunsid': this.accountCreationObj['ultimateparentsdunsid'] || '',
      'parentsdunsid': this.accountCreationObj['parentsdunsid'] || '',
      'parentsdunsnumber': this.accountCreationObj['parentsdunsnumber'] || '',
      'parentdunsname': this.accountCreationObj['parentdunsname'] || '',
      'ultimateparentdunsname': this.accountCreationObj['ultimateparentdunsname'] || '',
      'ultimateparentsduns': this.accountCreationObj['ultimateparentsduns'] || '',
      'createby': this.loggedUser || '',
      // "currencyaccount": this.accountCreationObj['currencyaccount'] || ''
      'isalternateswapaccount': (this.accountCreationObj['isalternateswapaccount']) ? this.OwnDetailsForm.value.isalternateswapaccount : false,
      'alternateswapaccount': (this.OwnDetailsForm.value.alternateswapaccount) ? this.accountCreationObj['alternateswapaccount'] : '',
      'alternateaccountowner': this.accountCreationObj['alternateaccountowner'] || '',
      'approvedaccount': this.accountCreationObj['prospectaccount'] || '',
      'isprospect': this.isprospectexist
      //this.accountCreationObj['isprospect']
    };

    // console.log(obj);
    // console.log(JSON.stringify(JSON.parse(obj)));
    const postObj = this.postObjValidator(obj);
    //postObj['prospectid'] = '';
    return postObj;
  }
  restrictspace1(e, value) {
    debugger
    console.log("restrict space", e)
    switch (value) {
      case 'legalentity':
        {
          if (e.which === 32 && !this.AccDetailsForm.value.legalentity.length)
            e.preventDefault();
          return;
        }
      case 'accountname':
        {
          this.AccDetailsForm.get('accountDetailName').valueChanges.subscribe(val => {
            if (val.trim() === "") {
              debugger
              this.AccDetailsForm.get('accountDetailName').patchValue('', { emitEvent: false })
            }
          })
          return;
        }
      case 'phone':
        {
          this.AccDetailsForm.get('phonenumber').valueChanges.subscribe(val => {
            if (val.trim() === "") {
              this.AccDetailsForm.get('phonenumber').patchValue('', { emitEvent: false })
            }
          })
          return;
        }
    }

  }
  creataAccount(postObj) {

    this.isLoading = true;
    this.accountListService.createAccount(postObj).subscribe((result: any) => {
      console.log(result);
      this.isLoading = true;
      if (result['status'] === 'success') {
        const obj: any = {
          'SysGuid': result.data[0].prospectid,
          'ProcessGuid': result.data[0].processinstanceid
        };
        this.accountListService.UpdateCamundatoCRM(obj).subscribe(res => {
          console.log(res);
          this.router.navigate(['/accounts/accountcreation/activerequest']);
          this.clearAutoSaveDate();
        });

        this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
        this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
        this.snackBar.open(result.data[0].Status, '', {
          duration: 5000
        });
      }
      else {
        this.snackBar.open(result['Message'], '', {
          duration: 3000
        });
      }
    }, error => {
      this.isLoading = false;
    });
  }
  saveData(act) {
    console.log(this.accountCreationObj);
    console.log(this.AccDetailsForm.dirty);
    console.log(this.OwnDetailsForm.invalid);

  }
  saveToDraft(messStatus) {
    const requestpayload = this.setPostObj(this.postActionCode);
    // console.log("Next", requestpayload);

    const obj = {
      SysGuid: this.draftSysGuid ? this.draftSysGuid : '', // first time, it will be empty. Once the sysguid available, need to paas that
      Name: requestpayload.name,
      LegalEntity: requestpayload.odslegalentityname,
      DUNSID: {
        'SysGuid': requestpayload.dunsid
      },
      ParentAccount: {
        DUNSID: {
          'SysGuid': requestpayload.parentsdunsid
        },
        DNBParentDuns: requestpayload.parentsdunsnumber,
        SysGuid: requestpayload.parentaccount,
        DNBParent: requestpayload.parentdunsname
      },
      UltimateParentAccount: {
        DUNSID: {
          'SysGuid': requestpayload.ultimateparentsdunsid
        },
        DNBUltimateParentDuns: requestpayload.ultimateparentsduns,
        SysGuid: requestpayload.ultimateparent,
        DNBUltimateParent: requestpayload.ultimateparentdunsname
      },
      HeadQuarters: requestpayload.headquarters,
      Address: {
        CountryCode: requestpayload.countrycode,
        Address1: requestpayload.address,
        CityString: requestpayload.citystring,
        CountryString: requestpayload.countrystring,
        State: {
          'SysGuid': requestpayload.state
        },
        Country: {
          'SysGuid': requestpayload.country
        },
        City: {
          'SysGuid': requestpayload.city
        }

      },
      Contact: {
        ContactNo: requestpayload.phonenumber,
      },
      WebsiteUrl: requestpayload.website,
      Email: requestpayload.email,
      BusinessDescription: requestpayload.businessdescription,
      EmployeeCount: requestpayload.employees,
      SicDescription: requestpayload.sicdescription,
      StockIndexMemberShip: requestpayload.stockindexmembership,
      TickerSymbol: requestpayload.tickersymbol,
      Currency: {
        'Id': requestpayload.currency,
      },
      FortuneRanking: requestpayload.fortune,
      GrossProfit: requestpayload.profits,
      Revenue: requestpayload.revenue,
      OperatingMargin: requestpayload.operatingmargins,
      MarketValue: requestpayload.marketvalue,
      ReturnOnEquity: requestpayload.returnonequity,
      EntityType: {
        'Id': requestpayload.entitytype
      },
      MarketRisk: { 'Id': requestpayload.marketrisk },
      //   CreditScore: requestpayload.marketrisk,
      OwnershipType: {
        'Id': requestpayload.ownershiptype
      },
      GrowthCategory: {
        'Id': requestpayload.growthcategory
      },
      CoverageLevel: {
        'Id': requestpayload.coveragelevel
      },
      RevenueCategory: {
        'Id': requestpayload.revenuecategory
      },
      SBU: {
        'Id': requestpayload.sbu
      },
      Vertical: {
        'Id': requestpayload.vertical
      },
      SubVertical: {
        'Id': requestpayload.subvertical
      },
      cluster: {
        'Id': requestpayload.cluster
      },
      Geo: {
        'SysGuid': requestpayload.geography
      },
      Region: {
        'SysGuid': requestpayload.region
      },
      PursuedopportunityRemarks: requestpayload.remarks,
      IsNewAgeBusiness: requestpayload.newagebusiness,
      IsGovAccount: requestpayload.governementaccount,
      Owner: {
        'SysGuid': requestpayload.owner
      },
      isSwapAccount: requestpayload.isswapaccount,
      SwapAccount: {
        'SysGuid': requestpayload.swapaccount
      },
      Prospect:
      {

        SysGuid: this.prospectSysGuid

      }
    };
    //  console.log('data to be posted', obj);
    // this.account1 = obj.Name;

    if (this.AccDetailsForm.invalid) {
      this.firstFormSubmitted = true;
      const invalidElements = this.el.nativeElement.querySelectorAll('mat-select.ng-invalid,select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        for (let i = invalidElements.length - 1; i >= 0; i--) {
          invalidElements[i].focus();
        }
        invalidElements[0].blur();
        this.scrollTo(invalidElements[0]);
      } else {
        this.leadinfo = true;
        this.dealinfo = false;
        // this.editablefields = false;
        // this.ownerdetails = false;
      }
    }

    else {
      this.accountListService.draftCreate(obj).subscribe((result: any) => {
        // console.log("save step1 result", result);
        if (!result.IsError) {
          this.draftSysGuid = result.ResponseObject.SysGuid;
          if (messStatus === 'save') {
            this.snackBar.open(result.Message, '', {
              duration: 5000
            });
          }
          this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
        }

      });

    }



  }
  onSubmit() {

    if (!this.IsSubVerticalExist) {
      this.OwnDetailsForm.controls['subvertical'].setValidators([]);
      this.OwnDetailsForm.get('subvertical').updateValueAndValidity();
    }
    this.submitted = false;
    console.log(this.accountCreationObj);
    console.log(this.AccDetailsForm);
    console.log(this.OwnDetailsForm);
    console.log(this.OwnDetailsForm.invalid);
    // this.openSubmitPopup();
    if (this.OwnDetailsForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,mat-select.ng-invalid,input.ng-invalid');
      console.log(invalidElements);
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // if (invalidElements.length > 0) {
      invalidElements.focus();
      //   // this.scrollTo(invalidElements[0]);
      // }
      return;
    }
    else if (this.searchAccount1 === 'true') {
      this.openSwapSubmitPopup();
    }
    else if (this.accountCreationObj['sbu']) {
      let sbuexist;
      this.accountListService.CheckSBUSESpocs(this.accountCreationObj['sbu'], this.accountCreationObj['geography'], this.accountCreationObj['country']).subscribe(res => {
        // console.log("checksbus", res)
        if (res.ResponseObject) {
          sbuexist = res.ResponseObject;
          // console.log("issbuexist", sbuexist);
          if (sbuexist)
            this.checkFlag();
        }
        else {
          this.snackBar.open(res.Message, '', {
            duration: 3000
          });
        }
      });

    }
  }
  checkFlag() {
    if ((this.roleType === '3' && this.huntingRatio >= 8) || (this.roleType === '2' && this.huntingRatio >= 8)) {
      const dialogRef = this.dialog.open(OpenOverview,
        {
          disableClose: true,
          width: '380px',
          data: {
            'HuntingRatio': this.huntingRatio,
            'ExistingRatio': this.existingRatio,
            'Owner': this.OwnerName,
            'Requesttype': (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isaltswapaccount) ? 'create and swap' : 'Account creation',
            'Status': 'NA'
          }
        });

    }
    else {
      this.openSubmitPopup();
    }
  }
  steptwo() {
    debugger
    console.log(this.accountCreationObj);
    console.log(this.AccDetailsForm);

    if (this.AccDetailsForm.invalid) {
      this.firstFormSubmitted = true;
      const invalidElements = this.el.nativeElement.querySelectorAll('textarea.ng-invalid,mat-select.ng-invalid,input.ng-invalid');
      if (invalidElements.length > 0) {
        // for (let i = invalidElements.length - 1; i >= 0; i--) {
        //   invalidElements[i].focus();
        // }
        invalidElements[0].blur();
        this.scrollTo(invalidElements[0]);
        invalidElements[0].focus();
      } else {
        this.leadinfo = true;
        this.dealinfo = false;
        // this.editablefields = false;
        // this.ownerdetails = false;
      }
    } else {
      const messStatus = "next";
      this.saveToDraft(messStatus);

      this.leadinfo = false;
      this.dealinfo = true;
      this.editablefields = false;
      window.scrollTo(0, 0);
      setTimeout(() => {

        if (this.draftownername) {
          this.OwnDetailsForm.controls['owner'].patchValue(this.draftownername);
        }
        let countryname = this.OwnDetailsForm.controls['country'].value.toLowerCase();
        if (!(countryname === "india" || countryname === "united kingdom" || countryname === "united states" || countryname === "usa" || countryname === "us")) {
          this.OwnDetailsForm.controls['state'].setValidators([]);
          this.OwnDetailsForm.get('state').updateValueAndValidity();
          this.OwnDetailsForm.controls['city'].setValidators([]);
          this.OwnDetailsForm.get('city').updateValueAndValidity();
        } else {
          this.customValidators['state'] = true;
          // this.customValidators['city'] = true;
          // this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
          // this.OwnDetailsForm.controls['city'].updateValueAndValidity();
          this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
          this.OwnDetailsForm.controls['state'].updateValueAndValidity();

          if (this.cityexists) {
            this.customValidators['city'] = true;
            this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
            this.OwnDetailsForm.controls['city'].updateValueAndValidity();
          }
        }
        if (this.IsOwner === 'true') {
          this.OwnDetailsForm.controls['owner'].patchValue(this.accountownername);
          this.accountCreationObj['owner'] = this.loggedUser;
          this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
          this.getHuntingCount(this.accountCreationObj['owner'], '');
          this.getExistingCount(this.accountCreationObj['owner']);
        }
        if (!this.IsSubVerticalExist) {
          this.OwnDetailsForm.get('subvertical').setValidators([]);
          this.customValidators['subvertical'] = false;
        }
        if (!this.prospectcityexist) {
          this.customValidators['city'] = false;
          this.OwnDetailsForm.controls['city'].setValidators([]);
          this.OwnDetailsForm.controls['city'].updateValueAndValidity();
          this.OwnDetailsForm.controls['city'].disable();
        }
        // console.log("form details after 1sec", this.OwnDetailsForm)
      }, 1000);
    }

  }

  /****************** Conversation Name autocomplete code start ****************** */


  openSubmitPopup() {

    const dialogRef = this.dialog.open(ConfirmSubmitPopupComponent,
      {
        disableClose: true,
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log("result from popup", result)
      // if (result.act == 'yes') {
      if (result.act === 'yes') {
        // if (this.roleType == '1') {
        //   this.postActionCode = 184450000;
        // }
        // else if (this.roleType == '2') {
        //   this.postActionCode = 184450001;
        // }
        // else if (this.roleType == '3') {
        //   this.postActionCode = 184450002;
        // }
        // let obj = this.setPostObj(this.postActionCode);
        this.postActionCode = 184450000;
        const requestpayload = {};
        requestpayload['prospect'] = this.setPostObj(this.postActionCode);
        requestpayload['prospect']['swapaccountcomment'] = (this.OwnDetailsForm.value.isswapaccount) ? result : '';
        requestpayload['overall_comments'] = {
          'overallcomments': result['swapaccountcomment'],
          'requestedby': this.loggedUser,
          'status': this.overallStatus
        };
        requestpayload['prospect']['prospectid'] = this.draftSysGuid;
        this.creataAccount(requestpayload);
        //console.log("requestpayload ", requestpayload, this.draftSysGuid)
      }

    });
  }
  SwapAccountOpen() {
    if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    const dialogRef = this.dialog.open(SwapPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: { allSwapableAccount: this.allSwapableAccount }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.seletedValue = result.Account;
        this.OwnDetailsForm.controls['swapaccount'].setValue(this.getSymbol(result.Name));
        this.accountCreationObj['swapaccount'] = result.SysGuid;
        this.searchAccount1 = "true";
        // this.OwnDetailsForm.get('owner').setValue(result.Account);
      }
    });
  }
  AltSwapAccountOpen() {
    console.log('alternateOwner', this.accountCreationObj['alternateaccountowner'])
    if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    const dialogRef = this.dialog.open(SwapPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: { allSwapableAccount: this.allaltSwapableAccount }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.seletedValue = result.Account;
        this.OwnDetailsForm.controls['alternateswapaccount'].setValue(result.Name);
        this.accountCreationObj['alternateswapaccount'] = result.SysGuid;
        this.searchAccount1 = "true";
        // this.OwnDetailsForm.get('owner').setValue(result.Account);
      }
    });
  }

  openSwapSubmitPopup() {
    // debugger
    console.log(this.accountCreationObj);
    console.log(this.AccDetailsForm);
    console.log(this.OwnDetailsForm);
    console.log(this.OwnDetailsForm.invalid);
    this.account2 = this.OwnDetailsForm.controls["swapaccount"].value || this.OwnDetailsForm.controls["alternateswapaccount"].value;
    this.account1 = this.AccDetailsForm.controls["accountDetailName"].value;
    // this.openSubmitPopup();
    if (this.OwnDetailsForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelectorAll('mat-select.ng-invalid,select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        this.scrollTo(invalidElements[0]);
      }
      return;
    }
    else if (this.accountCreationObj['sbu']) {
      let sbuexist;
      this.accountListService.CheckSBUSESpocs(this.accountCreationObj['sbu'], this.accountCreationObj['geography'], this.accountCreationObj['country']).subscribe(res => {
        // console.log("checksbus", res)
        if (res.ResponseObject) {
          sbuexist = res.ResponseObject;
          // console.log("issbuexist", sbuexist);
          if (sbuexist)
            this.checksbu();
        }
        else {
          this.snackBar.open(res.Message, '', {
            duration: 3000
          });
        }
      });

    }

  }
  checksbu() {
    console.log(this.accountCreationObj);
    console.log(this.AccDetailsForm);

    const dialogRef = this.dialog.open(SwapCreatePopupComponent,
      {
        disableClose: true,
        width: '380px',
        data: {
          account1: this.account1,
          account2: this.account2,
        }

      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postActionCode = 184450000;
        const obj = this.setPostObj(this.postActionCode);
        const requestpayload = {};
        requestpayload['prospect'] = this.setPostObj(this.postActionCode);
        requestpayload['prospect']['swapaccountcomment'] = (this.OwnDetailsForm.value.isswapaccount) ? result['swapaccountcomment'] : '';
        requestpayload['overall_comments'] = {
          'overallcomments': result['swapaccountcomment'],
          'requestedby': this.loggedUser,
          'status': this.overallStatus
        };
        requestpayload['prospect']['prospectid'] = this.draftSysGuid;
        this.creataAccount(requestpayload);

        // console.log("requestpayload ", requestpayload)

      }
    });
  }
  openeSearchAccountDataBasePopup() {
    const dialogRef = this.dialog.open(SearchAccountDataBasePopupComponent,
      {
        disableClose: true,
        data: { newAccount: 'yes' }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.isLoading = true;
        this.dnbdetailsbydunsid(result);
        this.leadinfo = false;
        //  this.AccDetailsForm.controls['name'].setValue(result.Name);
        //  console.log(this.AccDetailsForm);
        // this.AccDetailsForm.value.name = result.Name;
        // thi
        // let result1 = {"ResponseObject":{"DUNSID":{"SysGuid":"703103cc-eeb1-e911-a836-000d3aa058cb","Name":"118336031"},"Name":"Wal, Inc.",
        // "Address":{"Address1":"140 Aldrich Ave","CityString":"Warwick","CountryString":"United States","CountryCode":"US"},"Contact":{"ContactNo":"4017515866"},"Email":'',"BusinessDescription":"Corporation","EmployeeCount":"35","SicDescription":"Ret auto/home supplies","FortuneRanking":0,"GrossProfit":0,"Revenue":6373690,"OperatingMargin":0,"MarketValue":0},"IsError":false,"ApiStatusCode":0}
        //this.dnbdata(result)
        console.log(result);
      }

    });
  }

  getcountrycode(event) {
    const countrydetails = this.master3Api.getcountrycode(event)
    countrydetails.subscribe((res: any) => {
      console.log("country code response", res.ResponseObject)
      if (!res.IsError && res.ResponseObject) {
        this.Accountlookupdata.otherDbData.countryvalue = this.getFilterCountryData(res.ResponseObject);
        this.Accountlookupdata.otherDbData.isLoader = false
        console.log("response object", this.Accountlookupdata.otherDbData.countryvalue)
      }
      else if (!res.IsError && res.ResponseObject.length == 0) {
        this.Accountlookupdata.otherDbData.countryvalue = [];
        this.Accountlookupdata.otherDbData.isLoader = false
      }
    });

  }
  searchpayload = {
    SearchText: '',
    PageSize: 10,
    OdatanextLink: '',
    RequestedPageNumber: 1
  };
  getwiproaccounts(event) {


    let wiproaccounts = this.accountListService.existAccountSearch(this.searchpayload).subscribe(res => {
      console.log("response of wipro accounts", res)
      if (!res.IsError && res.ResponseObject.length != 0) {
        this.wiproaccounts = res.ResponseObject;
        this.Accountlookupdata.TotalRecordCount = res.TotalRecordCount;
        this.Accountlookupdata.tabledata = !this.isloadmore ? this.getFilterAccountData(res.ResponseObject) : this.Accountlookupdata.tabledata.concat(this.getFilterAccountData(res.ResponseObject));
        this.Accountlookupdata.isLoader = false;
        this.Accountlookupdata.nextLink = res.OdatanextLink;
      }
      else if (!res.IsError && res.ResponseObject.length == 0) {
        this.Accountlookupdata.TotalRecordCount = res.TotalRecordCount;
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
        this.Accountlookupdata.Norecordfoundtext = "No Record Found"
      }
      else if (res.IsError) {
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
        //  this.Accountlookupdata.Norecordfoundtext = 'No Record found.ensure that you have typed correct leagl entity name.'
      }
      console.log("wipro accouts", this.wiproaccounts);
    })
  }
  getFilterCountryData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          name: data.Desc,
          id: data.Value
        }
      })
    }
  }
  getFilterAccountData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          AccountName: this.getSymbol(data.Name) || '',
          Number: data.Number || '',
          Type: data.Type.Value || '',
          Vertical: data.Vertical.Name || '',
          Owner: data.Owner.FullName || '',
          Region: data.Address.Region.Name || '',
          Id: data.SysGuid || '',
          id: data.Type.Id || '',
          //  SysGuid:data.SysGuid || '',
        }
      })
    }
  }
  getFilterdnbData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          AccountName: this.getSymbol(data.Name) || '',
          DUNS: data.Duns || '',
          Industry: data.Industry || '',
          ParentEquity: data.ParentEquity || '',
          Region: data.Region || '',
          Country: data.Country || '',
          City: data.City || '',
          Zipcode: data.ZipCode || '',
          Address: data.Address1 || '',
          Id: data.Duns || '',
        }
      })
    }
  }
  Accountlookupdata = {
    tabledata: [
    ],
    recordCount: 10,
    headerdata: [
      { name: 'AccountName', title: 'Account name' },
      { name: 'Number', title: 'Number' },
      { name: 'Vertical', title: 'Vertical' },
      { name: 'Type', title: 'Type' },
      { name: 'Owner', title: 'Owner' },
      { name: 'Region', title: 'Region' },

    ],
    Isadvancesearchtabs: true,
    Norecordfoundtext: '',
    controlName: '',
    lookupName: 'Legal entity name',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: '',
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    },
    IsCustom: true,
    IsHorizontalScroll: true

  };

  openeSharedAdvanceLookupPopup() {
    // this.getwiproaccounts('')
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: '952px',
      data: this.Accountlookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((objectdata) => {
      console.log(objectdata);
      this.PerformAction(objectdata)
      this.lookupdata.tabledata = [
        { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
        { AccountName: 'Alibaba.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Prospect', Owner: 'Rahul Dudeja', Region: 'India' },
        { AccountName: 'Amazon.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Rahul  Jain', Region: 'USA' },
        { AccountName: 'Apple.india', Number: 'AC8090219392', Vertical: 'MFG', Type: 'Prospect', Owner: 'Ravu Kumar', Region: 'USA' },
        { AccountName: 'Alibaba.china', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'China' },
        { AccountName: 'Google.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
        { AccountName: 'Tesla.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' },
        { AccountName: 'Alphabet.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'India' },
        { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' }
      ]

    })

    dialogRef.afterClosed().subscribe((data) => {
      debugger
      this.Accountlookupdata.tabledata = [];
      this.Accountlookupdata.headerdata = [
        { name: 'AccountName', title: 'Account name' },
        { name: 'Number', title: 'Number' },
        { name: 'Vertical', title: 'Vertical' },
        { name: 'Type', title: 'Type' },
        { name: 'Owner', title: 'Owner' },
        { name: 'Region', title: 'Region' },]
      console.log("afterclose data emitted", data)
      this.searchpayload = {
        SearchText: '',
        PageSize: 10,
        OdatanextLink: '',
        RequestedPageNumber: 1
      };
      // debugger;
      if ((data.selectedData[0].id === 3) || (data.selectedData[0].id === 12)) {
        const dialogRef1 = this.dialog.open(ExistingAccountPopupComponent,
          {
            disableClose: true,
            width: '380px',
            data: { data: data.selectedData[0] }
          })
        dialogRef1.afterClosed().subscribe(res => {

          console.log("afterclose of the popup", res)
          //this.parentflag = localStorage.getItem('parentflag');///
          this.parentdetailes = JSON.parse(localStorage.getItem('parentdetailes'));
          this.parentaccountname = this.getSymbol(res.parentaccountname);
          this.ultimateparentaccountnameData = this.getSymbol(res.ultimateparentname);
          this.AccDetailsForm.controls['parentaccount'].setValue(this.getSymbol(res.parentaccountname));
          this.accountCreationObj['parentaccount'] = res.parentsysguid || '';
          this.AccDetailsForm.controls['ultimateparent'].setValue(this.getSymbol(res.ultimateparentname));
          this.accountCreationObj['ultimateparent'] = res.ultimateparentguid || '';
        });

      }
      else if (data.selectedData[0].id === 1) {
        const dialogRef2 = this.dialog.open(ExistingReservePopupComponent,
          {
            disableClose: true,
            width: '380px',
            data: { data: data.selectedData[0].Id },
          });
      }
      else if (data.selectedData[0].id === 2) {

        const dialogRef = this.dialog.open(Prospectaccount,
          {
            disableClose: true,
            width: '380px',
            data: { data: data.selectedData[0].Id },
          });
        console.log("prospectdata", data.selectedData[0])
        dialogRef.afterClosed().subscribe(res => {
          debugger
          if (res != '' && res != undefined) {
            localStorage.setItem('prospectaccountid', res)
            console.log("after prospect close", res)
            this.isprospectexist = true
            this.prospectSysGuid = res
            this.accountCreationObj['prospectaccount'] = res
            this.getprospectdetails(res)
          }
        })



        // getprospectid() {
        //   this.accountListService.getProspectGuid().subscribe((res: any) => {
        //     this.prospectsysguid = res;
        //     this.getprospectdetails(this.prospectsysguid);
        //   });
        // }

      }
      else if (data.selectedData[0].DUNS) {
        this.dnbdetailsbydunsid(data.selectedData[0].DUNS)
      }

    });

  }
  PerformAction(objectdata) {
    console.log("emitted data", objectdata)
    switch (objectdata.action) {
      case 'search':
        {
          this.searchpayload = {
            'SearchText': objectdata.objectRowData.searchKey,
            'PageSize': 10,
            'OdatanextLink': '',
            'RequestedPageNumber': 1
          }
          this.Accountlookupdata.tabledata = [];
          this.getwiproaccounts(this.searchpayload)
          return;
        }
      case 'loadMore':
        {
          this.searchpayload = {
            'SearchText': objectdata.objectRowData.searchKey,
            'PageSize': 10,
            'OdatanextLink': this.Accountlookupdata.nextLink,
            'RequestedPageNumber': objectdata.currentPage
          }
          this.isloadmore = true
          this.getwiproaccounts(this.searchpayload)
          return;
        }
      case 'tabSwich':
        {
          this.wiprodb = objectdata.objectRowData.wiprodb
          if (this.wiprodb) {
            this.Accountlookupdata.headerdata = [
              { name: 'AccountName', title: 'Account name' },
              { name: 'Number', title: 'Number' },
              { name: 'Vertical', title: 'Vertical' },
              { name: 'Type', title: 'Type' },
              { name: 'Owner', title: 'Owner' },
              { name: 'Region', title: 'Region' },]
            this.searchpayload = {
              'SearchText': '',
              'PageSize': 10,
              'OdatanextLink': '',
              'RequestedPageNumber': 1
            }
            this.getwiproaccounts(this.searchpayload)
          } else {
            this.Accountlookupdata.tabledata = []
            this.Accountlookupdata.headerdata = [
              { name: 'AccountName', title: 'Name' },
              { name: 'ParentEquity', title: 'Parent Entity' },
              { name: 'Industry', title: 'Industry' },
              { name: 'Region', title: 'Region' },
              { name: 'DUNS', title: 'DUNS' },
              { name: 'Country', title: 'Country' },
              { name: 'City', title: 'City' },
              { name: 'Zipcode', title: 'Zipcode' },
              { name: 'Address', title: 'Address' },
            ]
          }
          return;
        }
      case 'dbAutoSearch':
        {
          // debugger
          this.getcountrycode(objectdata.objectRowData.searchKey)
          return;
        }
      case 'dbSearch':
        {
          //  debugger
          this.getaccountInDNB(objectdata.objectRowData.dbSerachData)
          return;
        }
    }
  }
  getprospectdetails(id) {
    const reqbody = {
      'SysGuid': id,
      'LoggedInUser': {
        'SysGuid': this.loggedUser
      }

    };
    //  this.accountCreationObj['prospectid'] = id 
    console.log('prospectid', id)
    this.accountListService.getAccountOverviewDetails(reqbody).subscribe((res: any) => {
      console.log("prospects account data recived", res);
      if (!res.IsError && res.ResponseObject) {
        this.isLoading = false;
        this.leadinfo = false;
        this.prospectaccountdata = res.ResponseObject;
        // console.log("dnb account details ", res.ResponseObject);
        this.editablefields = true;
        this.prospectAccountDetails(this.prospectaccountdata);
      }
    });
  }
  prospectAccountDetails(data) {
    console.log("prospectdata", data)
    this.AccDetailsForm.controls['legalentity'].setValue(this.getSymbol(data.LegalEntity));
    this.AccDetailsForm.controls['accountDetailName'].setValue(this.getSymbol(data.Name));
    this.AccDetailsForm.controls['email'].setValue(data ? data.Email : '');
    this.AccDetailsForm.controls['website'].setValue(data ? data.WebsiteUrl : '');
    this.AccDetailsForm.controls['phonenumber'].setValue((data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '');
    this.AccDetailsForm.controls['businessdescription'].setValue(data ? data.BusinessDescription : '');
    this.AccDetailsForm.controls['ownershiptype'].setValue(data ? data.OrganizationType.Id : '');
    this.OwnDetailsForm.controls['sbu'].setValue(data.SBU ? data.SBU.Name : '');
    this.OwnDetailsForm.controls['vertical'].setValue(data.Vertical ? data.Vertical.Name : '');
    this.OwnDetailsForm.controls['geography'].setValue(data.Geo ? data.Geo.Name : '');
    this.OwnDetailsForm.controls['region'].setValue(data.Region ? data.Region.Name : '');
    this.OwnDetailsForm.controls['country'].setValue(data.CountryReference ? data.CountryReference.Name : '');
    this.OwnDetailsForm.controls['state'].setValue(data.CountrySubDivisionReference ? data.CountrySubDivisionReference.Name : '');
    this.OwnDetailsForm.controls['city'].setValue(data.CityRegionReference ? data.CityRegionReference.Name : '');
    this.accountCreationObj['sbu'] = data.SBU.Id;
    this.accountCreationObj['vertical'] = data.Vertical.Id;
    this.accountCreationObj['geography'] = data.Geo.SysGuid;
    this.accountCreationObj['region'] = data.Region.SysGuid;
    this.accountCreationObj['country'] = data.CountryReference.SysGuid;
    this.accountCreationObj['state'] = data.CountrySubDivisionReference.SysGuid;
    this.accountCreationObj['city'] = data.CityRegionReference.SysGuid;
    this.IsSubVerticalExist = data.Vertical.IsSubVerticalExist
    this.prospectcityexist = data.CountrySubDivisionReference.isExists
    if (!this.IsSubVerticalExist) {
      this.OwnDetailsForm.get('subvertical').setValidators([]);
      this.OwnDetailsForm.get('subvertical').updateValueAndValidity();
    }
    this.prospectcountry = data.CountryReference.Name.toLowerCase();

    if (!(this.prospectcountry === "india" || this.prospectcountry === "united kingdom" || this.prospectcountry === "united states" || this.prospectcountry === "usa" || this.prospectcountry === "us")) {
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.get('state').updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.get('city').updateValueAndValidity();
    } else {
      this.customValidators['state'] = true;
      this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
    }
    if (this.prospectcityexist) {
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
    } else {
      this.customValidators['city'] = false;
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
    }

  }
  getaccountInDNB(data) {
    const obj = {
      'CustomerAccount': {
        'Name': data.accountname.value,
        'Address': {
          'CountryCode': data.countryvalue.id,
          'ZipCode': data.pincode.value,
        }
      }
    }

    const getaccounts = this.master3Api.SearchAccountInDNB(obj);
    getaccounts.subscribe((res: any) => {
      if (!res.IsError && res.ResponseObject) {
        this.Accountlookupdata.isLoader = false;
        this.Accountlookupdata.TotalRecordCount = 10;
        this.Accountlookupdata.tabledata = this.getFilterdnbData(res.ResponseObject);

      }
      else if (!res.IsError && res.ResponseObject.length == 0) {
        this.Accountlookupdata.TotalRecordCount = res.TotalRecordCount;
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
        this.Accountlookupdata.Norecordfoundtext = "No Record Found in Dnb you can choose custom account creation "
      }
      else if (res.IsError) {
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
        if (res['Message'] == "You have reached your allocated transaction quota.") {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
        }
        else {
          this.Accountlookupdata.Norecordfoundtext = "Ensure that you have typed correct legal entity name"
        }
      }
    });
  }
  dnbdetailsbydunsid(id) {
    this.isLoading = true;
    const dnbdetails = this.master3Api.DNBDetailsByDunsId(id);
    dnbdetails.subscribe((res: any) => {
      if (!res.IsError && res.ResponseObject) {
        this.isLoading = false;
        this.leadinfo = false;
        this.accountdetails = res.ResponseObject;
        // console.log("dnb account details ", res.ResponseObject);
        this.editablefields = true;
        this.dnbdata(this.accountdetails);

      }
      else if (res.IsError) {
        this.isLoading = false;
        // console.log(" add error response ", res)
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }

    }, error => {
      this.isLoading = false;
      //   this.editablefields = false;
    });

  }

  dnbdata(dnbaccountdetails) {
    this.OwnDetailsForm.reset();
    this.AccDetailsForm.reset();
    console.log("dnb ::::::::::::", dnbaccountdetails);
    this.AccDetailsForm.controls['accountDetailName'].setValue(this.getSymbol(dnbaccountdetails.Name));
    this.AccDetailsForm.controls['legalentity'].setValue(dnbaccountdetails.Name);
    this.AccDetailsForm.controls['dunsnumber'].setValue((dnbaccountdetails.DUNSID && dnbaccountdetails.DUNSID.Name) ? dnbaccountdetails.DUNSID.Name : '');
    this.accountCreationObj['dunsid'] = (dnbaccountdetails.DUNSID && dnbaccountdetails.DUNSID.SysGuid) ? dnbaccountdetails.DUNSID.SysGuid : ''

    if (!dnbaccountdetails.ParentAccount) {
      this.AccDetailsForm.controls['ultimateparent'].setValue(dnbaccountdetails.Name);
    }
    // if((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount) == undefined || (dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount) == '')
    // {
    //   this.AccDetailsForm.controls['accountDetailName'].setValue(dnbaccountdetails.Name);
    // }
    if (dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DNBParent) {
      this.AccDetailsForm.controls['parentaccount'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DNBParent) ? dnbaccountdetails.ParentAccount.DNBParent : '');
      this.accountCreationObj['parentdunsname'] = dnbaccountdetails.ParentAccount.DNBParent;
    }
    // else
    // {
    //   // this.AccDetailsForm.controls['parentaccount'].setValue('');
    //   this.AccDetailsForm.patchValue({
    //     parentaccount: ''
    //   });
    //   this.accountCreationObj['parentdunsname'] = '';
    // }
    if (dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.Name) {
      this.AccDetailsForm.controls['parentaccount'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.Name) ? dnbaccountdetails.ParentAccount.Name : '');
      this.accountCreationObj['parentaccount'] = dnbaccountdetails.ParentAccount.SysGuid;
    }
    if (dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DUNSID) {
      this.AccDetailsForm.controls['parentsdunsnumber'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DUNSID) ? dnbaccountdetails.ParentAccount.DUNSID.Name : '');
      this.accountCreationObj['parentsdunsid'] = dnbaccountdetails.ParentAccount.DUNSID.SysGuid;
    }

    if (dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DNBParentDuns) {
      this.AccDetailsForm.controls['parentsdunsnumber'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DNBParentDuns) ? dnbaccountdetails.ParentAccount.DNBParentDuns : '');
      this.accountCreationObj['parentsdunsnumber'] = dnbaccountdetails.ParentAccount.DNBParentDuns;
    }

    if (dnbaccountdetails.Address && dnbaccountdetails.Address.Geo) {
      this.OwnDetailsForm.controls['geography'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.Geo.Name) ? dnbaccountdetails.Address.Geo.Name : '');
      this.accountCreationObj['geography'] = dnbaccountdetails.Address.Geo.SysGuid;
      this.geoName = this.OwnDetailsForm.controls['geography'].value ? this.OwnDetailsForm.controls['geography'].value : '';
    }
    if (dnbaccountdetails.Address && dnbaccountdetails.Address.Region) {
      this.OwnDetailsForm.controls['region'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.Region.Name) ? dnbaccountdetails.Address.Region.Name : '');
      this.accountCreationObj['region'] = dnbaccountdetails.Address.Region.SysGuid;
      this.regionName = this.OwnDetailsForm.controls['region'].value ? this.OwnDetailsForm.controls['region'].value : '';
    }
    if (dnbaccountdetails.Address && dnbaccountdetails.Address.Country) {
      this.OwnDetailsForm.controls['country'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.Country.Name) ? dnbaccountdetails.Address.Country.Name : '');
      this.accountCreationObj['country'] = dnbaccountdetails.Address.Country.SysGuid;
      this.countryNameField = this.OwnDetailsForm.controls['country'].value ? this.OwnDetailsForm.controls['country'].value : '';
    }

    if (dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.DNBUltimateParent) {
      this.AccDetailsForm.controls['ultimateparent'].setValue((dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.DNBUltimateParent) ? dnbaccountdetails.UltimateParentAccount.DNBUltimateParent : '');
      this.accountCreationObj['ultimateparentdunsname'] = dnbaccountdetails.UltimateParentAccount.DNBUltimateParent;
    }

    if (dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.Name) {
      this.AccDetailsForm.controls['ultimateparent'].setValue((dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.Name) ? dnbaccountdetails.UltimateParentAccount.Name : '');
      this.accountCreationObj['ultimateparent'] = dnbaccountdetails.UltimateParentAccount.SysGuid;
    }
    //this.accountCreationObj['ultimateparent']
    if (dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.DUNSID) {
      this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue((dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.DUNSID) ? dnbaccountdetails.UltimateParentAccount.DUNSID.Name : '');
      this.accountCreationObj['ultimateparentsdunsid'] = dnbaccountdetails.UltimateParentAccount.DUNSID.SysGuid;
    }
    if (dnbaccountdetails.UltimateParentAccount && dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns) {
      this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns) ? dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns : '');
      this.accountCreationObj['ultimateparentsduns'] = dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns;
    }
    if (dnbaccountdetails.Currency && dnbaccountdetails.Currency.Value) {
      this.AccDetailsForm.controls['currency'].setValue(dnbaccountdetails.Currency ? dnbaccountdetails.Currency.Value : '');
      this.CurrencyData = dnbaccountdetails.Currency.Value;
      this.accountCreationObj['currency'] = dnbaccountdetails.Currency.Id;
    }
    if (dnbaccountdetails.MarketRisk && dnbaccountdetails.MarketRisk.Value) {
      this.AccDetailsForm.controls['Marketrisk'].setValue(dnbaccountdetails.MarketRisk ? dnbaccountdetails.MarketRisk.Value : '');
      this.accountCreationObj['marketrisk'] = dnbaccountdetails.MarketRisk.Id;
    }
    this.AccDetailsForm.controls['headquarters'].setValue(dnbaccountdetails.HeadQuarters ? dnbaccountdetails.HeadQuarters : '');
    this.AccDetailsForm.controls['countrycode'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.CountryCode) ? dnbaccountdetails.Address.CountryCode : '');
    this.AccDetailsForm.controls['address'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.Address1) ? dnbaccountdetails.Address.Address1 : '');
    this.AccDetailsForm.controls['city'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.CityString) ? dnbaccountdetails.Address.CityString : '');
    this.AccDetailsForm.controls['country'].setValue((dnbaccountdetails.Address && dnbaccountdetails.Address.CountryString) ? dnbaccountdetails.Address.CountryString : '');
    this.AccDetailsForm.controls['phonenumber'].setValue((dnbaccountdetails.Contact && dnbaccountdetails.Contact.ContactNo) ? dnbaccountdetails.Contact.ContactNo : '');
    this.AccDetailsForm.controls['website'].setValue(dnbaccountdetails ? dnbaccountdetails.WebsiteUrl : '');
    // this.AccDetailsForm.controls['email'].setValue(dnbaccountdetails ? dnbaccountdetails.Email : '');
    this.AccDetailsForm.controls['businessdescription'].setValue(dnbaccountdetails ? dnbaccountdetails.BusinessDescription : '');
    this.AccDetailsForm.controls['employees'].setValue(dnbaccountdetails.EmployeeCount ? dnbaccountdetails.EmployeeCount : '');
    this.AccDetailsForm.controls['sicdescription'].setValue(dnbaccountdetails ? dnbaccountdetails.SicDescription : '');
    this.AccDetailsForm.controls['stockindexmembership'].setValue(dnbaccountdetails ? dnbaccountdetails.StockIndexMemberShip : '');
    this.AccDetailsForm.controls['tickersymbol'].setValue(dnbaccountdetails ? dnbaccountdetails.TickerSymbol : '');
    this.AccDetailsForm.controls['fortune'].setValue(dnbaccountdetails.FortuneRanking ? dnbaccountdetails.FortuneRanking.toString() : '');
    this.AccDetailsForm.controls['profits'].setValue(dnbaccountdetails.GrossProfit ? dnbaccountdetails.GrossProfit.toString() : '');
    this.AccDetailsForm.controls['revenue'].setValue(dnbaccountdetails.Revenue ? dnbaccountdetails.Revenue.toString() : '');
    this.AccDetailsForm.controls['operatingmargins'].setValue(dnbaccountdetails.OperatingMargin ? dnbaccountdetails.OperatingMargin.toString() : '');
    this.AccDetailsForm.controls['marketvalue'].setValue(dnbaccountdetails.MarketValue ? dnbaccountdetails.MarketValue.toString() : '');
    this.AccDetailsForm.controls['returnonequity'].setValue(dnbaccountdetails.ReturnOnEquity ? dnbaccountdetails.ReturnOnEquity.toString() : '');
    // this.AccDetailsForm.controls['accountDetailname'].setValue(dnbaccountdetails.Name);
    // this.AccDetailsForm.value.name || ''

    if (!dnbaccountdetails.ownershiptype) {
      this.AccDetailsForm.patchValue({
        ownershiptype: dnbaccountdetails.OwnershipType ? dnbaccountdetails.OwnershipType.Id : '',
      })
    }

    setTimeout(() => {
      this.autoSave();
    }, 500);
    this.ParentAccountNameData = this.AccDetailsForm.controls['parentaccount'].value ? this.AccDetailsForm.controls['parentaccount'].value : '';
  }

  getHuntingCount(SysGuid, CountryGuid) {
    this.master3Api.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        this.huntingRatio = res['ResponseObject'];
        console.log(this.huntingRatio);
        if (this.huntingRatio <= 0) {
          this.OwnDetailsForm.controls['isswapaccount'].disable();
        }
        else {
          this.OwnDetailsForm.controls['isswapaccount'].enable();
          if (this.huntingRatio >= 8) {
            this.OwnDetailsForm.controls['isalternateswapaccount'].enable();
          }
          else {
            this.OwnDetailsForm.controls['isalternateswapaccount'].disable();
          }
        }
      }
    });
  }
  getExistingCount(SysGuid) {
    this.master3Api.ExistingCount(SysGuid).subscribe(res => {
      if (!res['IsError']) {
        this.existingRatio = res['ResponseObject'];
      }
    });
    console.log(this.existingRatio);
  }
  getAltHuntingCount(SysGuid, CountryGuid) {
    this.master3Api.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        this.altHuntingRatio = res['ResponseObject'];
        console.log(this.altHuntingRatio);
        if (this.altHuntingRatio <= 0) {
          this.OwnDetailsForm.controls['isalternateswapaccount'].disable();
        } else {
          this.OwnDetailsForm.controls['isalternateswapaccount'].enable();
        }
      }
    });
  }
  getAllSwapAccount(ownerid, countryId) {
    // if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    const swapaccount = this.master3Api.getswapaccount(ownerid, countryId);
    swapaccount.subscribe((res: any) => {
      console.log("swapaccount data", res.ResponseObject);
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allSwapableAccount = res.ResponseObject;
    });
  }
  getAltSwapAccount(ownerid, countryId, sbuId) {
    const swapaccount = this.master3Api.getaltswapaccount(ownerid, countryId, sbuId);
    swapaccount.subscribe((res: any) => {
      this.OwnDetailsForm.controls['alternateswapaccount'].setValue(''); // selected swap account should be empty on calling API. ** KKN **
      this.accountCreationObj['alternateswapaccount'] = '';
      this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['alternateswapaccount']) ? 3 : 1;

      // console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allaltSwapableAccount = res.ResponseObject;
      else this.allaltSwapableAccount = [];
    });
  }
  // OpenAccountOwner() {
  //   this.greenborder = !this.greenborder;
  //   const dialogRef = this.dialog.open(AccountOwnerPopupComponent,
  //     {
  //       width: '380px'
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result);

  //     if (result) {
  //       // console.log( this.accOwnerSwap);

  //       this.OwnDetailsForm.controls['owner'].setValue(result.FullName);
  //       this.accountCreationObj['owner'] = result.SysGuid;
  //       this.getAllSwapAccount(this.accountCreationObj['owner'], '');

  //       this.getHuntingCount(this.accountCreationObj['owner'], '');

  //       // this.formsData.owner=result[0].contact;

  //       // this.formsData.owner = result[0].contact;
  //     }
  //   });
  // }

  OpenAccountOwner(event) {
    this.greenborder = !this.greenborder;
    // if (event !== '') {
    if (event === '') {
      this.huntingRatio = undefined;
      this.accountCreationObj['owner'] = '';
    }
    const ownername = this.master3Api.AccountOwnerSearch(event);
    ownername.subscribe((res: any) => {
      // console.log("owner", res.ResponseObject);
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (event !== '') {
          this.owner = res.ResponseObject;
        } else {
          this.owner = this.getTenRecords(res.ResponseObject);
        }
        // if (res.ResponseObject.length == 0) {
        //   this.OwnDetailsForm.controls['owner'].setValue('');
        //   // this.financialyeardata['message'] = 'No record found';
        // }
      }
      else {
        this.OwnDetailsForm.controls['owner'].setValue('');
        //this.financialyeardata['message'] = 'No record found';
      }
    });
    // }
  }

  appendcustomer(value, item) {
    this.OwnerName = item.FullName;
    this.sendOwnerToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.ownerAccountSelected = item;
    this.OwnDetailsForm.controls['owner'].setValue(item.FullName);
    this.accountCreationObj['owner'] = item.SysGuid || '';
    this.OwnerName = item.FullName;

    //this.OwnDetailsForm.controls['owner'].setValue(result.FullName);

    this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
    this.getHuntingCount(this.accountCreationObj['owner'], '');
    this.getExistingCount(this.accountCreationObj['owner']);
  }
  appendAltOwner(item) {
    this.altOwnerAccountSelected = item;
    this.AltOwnerName = item.FullName;
    this.sendAltOwnerToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.OwnDetailsForm.controls['alternateaccountowner'].setValue(item.FullName);
    this.accountCreationObj['alternateaccountowner'] = item.SysGuid || '';
    this.OwnDetailsForm.controls['alternateswapaccount'].enable();
    this.getAltSwapAccount(this.accountCreationObj['alternateaccountowner'], this.accountCreationObj['country'], this.accountCreationObj['sbu']);
    this.getAltHuntingCount(this.accountCreationObj['alternateaccountowner'], '');
  }
  ConversationNameclose() {
    this.ConversationNameSwitch = false;
  }

  Conversations: {}[] = [
    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedConversation: {}[] = [];


  /****************** Conversation Name autocomplete code end ****************** */

  /****************** vertical autocomplete code start ****************** */

  showContact: boolean = false;
  contactName: string = '';
  contactNameSwitch: boolean = true;

  contactNameclose() {
    this.contactNameSwitch = false;
  }

  wiproContact: {}[] = [

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact: {}[] = [];

  /****************** vertical autocomplete code end ****************** */

  /************** cluster autocomplete code start  ************************/
  clusterNameSwitch: boolean = true;
  clusterclose() {
    this.clusterNameSwitch = false;
  }

  clusterNameContent: {}[] = [

    { index: 0, contact: 'cluster name 1', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'cluster name 2 ', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'cluster name 3', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'cluster name 4', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  /************* cluster autocomplete code end  */

  /****************** Geo autocomplete code start ****************** */

  showContact2: boolean = false;
  contactName2: string = '';
  contactNameSwitch2: boolean = true;

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }

  wiproContact2: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact2: {}[] = [];

  /****************** Geo  autocomplete code end ****************** */

  /****************** Region autocomplete code start ****************** */

  showContact3: boolean = false;
  contactName3: string = '';
  contactNameSwitch3: boolean = true;

  contactNameclose3() {
    this.contactNameSwitch3 = false;
  }

  wiproContact3: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact3: {}[] = [];

  /****************** Region  autocomplete code end ****************** */

  /****************** state autocomplete code start ****************** */

  showContact4: boolean = false;
  contactName4: string = '';
  contactNameSwitch4: boolean = true;

  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }

  wiproContact4: {}[] = [

    { index: 0, contact: 'abc', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'asas Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'sasa Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact4: {}[] = [];

  /****************** state  autocomplete code end ****************** */

  /****************** SBU autocomplete code start ****************** */

  showContactSBU: boolean = false;
  contactSBU: string = '';
  contactSBUSwitch: boolean = true;

  contactSBUclose() {
    this.contactSBUSwitch = false;
  }

  wiproContactSBU: {}[] = [

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact8: {}[] = [];

  /****************** SBU autocomplete code end ****************** */

  /****************** Sub Vertical autocomplete code start ****************** */

  showContact1: boolean = false;
  contactName1: string = '';
  contactNameSwitch1: boolean = true;

  contactNameclose1() {
    this.contactNameSwitch1 = false;
  }
  appendcontact1(value: string, i) {
    this.contactName1 = value;
    this.selectedContact1.push(this.wiproContact1[i]);
  }
  wiproContact1: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact1: {}[] = [];

  /****************** Sub Vertical  autocomplete code end ****************** */
  /****************** country ownership details autocomplete code start ****************** */
  showCountryOwnership3: boolean = false;
  CountryOwnershipName3: string = '';
  CountryOwnershipNameSwitch3: boolean = true;

  CountryOwnershipNameclose3() {
    this.CountryOwnershipNameSwitch3 = false;
  }
  appendCountryOwnership3(value: string, i) {
    this.CountryOwnershipName3 = value;
    this.selectedCountryOwnership3.push(this.wiproCountryOwnership3[i]);
  }
  wiproCountryOwnership3: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCountryOwnership3: {}[] = [];

  /****************** country ownership details  autocomplete code end ****************** */
  /****************** city autocomplete code start ****************** */

  showCity: boolean = false;
  cityName: string = '';
  cityNameSwitch: boolean = true;

  cityNameclose() {
    this.cityNameSwitch = false;
  }
  appendcity(value: string, i) {
    this.cityName = value;
    this.selectedCity.push(this.wiproCity[i]);
  }
  wiproCity: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCity: {}[] = [];

  /****************** city  autocomplete code end ****************** */

  /****************** city1 edit autocomplete code start ****************** */

  showCity1: boolean = false;
  city1Name: string = '';
  city1NameSwitch: boolean = true;

  city1Nameclose() {
    this.city1NameSwitch = false;
  }

  wiproCity1: {}[] = [

    { index: 0, contact: 'Mysore', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Hassan', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Tumkur', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCity1: {}[] = [];

  /****************** city1 edit  autocomplete code end ****************** */

  /****************** country edit autocomplete code start ****************** */

  showcountry: boolean = false;
  countryName: string = '';
  countryNameSwitch: boolean = true;

  countryNameclose() {
    this.countryNameSwitch = false;
  }
  appendcountry(value: string, i) {
    this.countryName = value;
    this.selectedcountry.push(this.wiprocountry[i]);
  }
  wiprocountry: {}[] = [

    { index: 0, contact: 'India', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'America', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Singapore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'UK', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedcountry: {}[] = [];

  /****************** country edit  autocomplete code end ****************** */

  showCustomer: boolean = false;
  customerName: string = '';
  customerNameSwitch: boolean = true;

  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }
  customerContact: {}[] = [

    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCustomer: {}[] = [];
  //  Select alternative account owner start
  OwnerNameSwitch: boolean = true;
  alternativeownerClose() {
    this.alternativeownerSwitch = false;
  }
  secondaryowner: {}[] = [
    { FullName: 'Rahul jain ', Email: 'rahuljain@wipro.com' },
    { FullName: 'Kanika Tuteja ', Email: 'Kanikatuteja@wipro.com' },
    { FullName: 'Anubhav Jain ', Email: 'Anubhavjain@wipro.com' },
  ]
  //  Select alternative account owner end 
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // localStorage.removeItem('parentdetailes');
    // localStorage.removeItem('parentflag');
    localStorage.removeItem('draftId');
    localStorage.removeItem('prospectaccountid');
    this.draftDetails = {};
  }

  ActivityGoupclose() {
    // this.ConversationNameSwitchlead = false;
    this.parentNameSwitch = false;
    this.OwnDetailsForm.patchValue({
      activityGroup: ''
    });
  }

  callTempSource() {
    // console.log("->>>>>>>>")

    if (this.conversationNameSwitchAccountName) {

      this.isAccountNameSearchLoading = true;
      this.accountNameSource = [];
      this.accountListService.getsearchLookUpList(this.AccDetailsForm.value.accountDetailName).subscribe(res => {
        this.isAccountNameSearchLoading = false;
        if (res.IsError === false) {
          this.accountNameSource = res.ResponseObject;
        } else {
          // this.errPopup.throwError(res.Message);
          this.accountNameSource = [];
        }
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.accountNameSource = [];
      });

    }

  }
  // appendAccountName(value, item, sbuverticalFlag?, AccLinkedFlag?) {
  //   console.log(item);
  //   // this.parentName = item.Name;
  //   this.AccDetailsForm.controls['accountDetailName'].setValue(item.Name);
  //   console.log("formvalue", this.AccDetailsForm.controls['accountDetailName'].setValue(item.Name))
  //   // this.accountCreationObj['dunsid'] = item.SysGuid || '';
  // }

  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    // debugger
    // AccountAdvnNames,AccountNameListAdvnHeaders
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountNameListAdvnHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvnNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    // this.lookupdata.inputValue = this.selectedLookupName(this.lookupdata.controlName);
    const Guid = this.accountCreationObj[controlName] ? this.accountCreationObj[controlName] : '';
    // this.lookupdata.Guid = this.accountCreationObj[controlName] ?  this.accountCreationObj[controlName]  : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null, rowData: headerdata, rowIndex: index, rowLine: line, Guid: Guid, clusterId: this.OwnDetailsForm.controls['sbu'].value }).subscribe(res => {
      this.lookupdata.tabledata = res;
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      // console.log(x)
      if (x['objectRowData'].searchKey !== '' && x.currentPage === 1) {
        this.lookupdata.nextLink = '';
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey !== '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      };
      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData }, clusterId: this.OwnDetailsForm.controls['sbu'].value }).subscribe(res => {
        this.lookupdata.isLoader = false;
        // console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action === 'loadMore') {
          // debugger;
          if (x['objectRowData'].controlName === 'currencyaccount') {
            this.lookupdata.TotalRecordCount = res.ResponseObject.length > 0 ? res.TotalRecordCount : 0;
          } else {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          }
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

          if (x['objectRowData'].controlName === 'subvertical') {
            this.subverticaldata = this.subverticaldata.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } else if (x['objectRowData'].controlName === 'vertical') {
            this.verticaldata = this.verticaldata.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } {
            this.location_temp = this.location_temp.concat(res.ResponseObject);
          }

        } else if (x.action === 'search') {
          // debugger;
          if (x['objectRowData'].controlName === 'currencyaccount') {
            this.lookupdata.TotalRecordCount = res.ResponseObject.length > 0 ? res.TotalRecordCount : 0;
          } else {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          }
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (x['objectRowData'].controlName === 'subvertical') {
            this.subverticaldata = res.ResponseObject;
            this.sub_and_vertical = res.ResponseObject;
          } else if (x['objectRowData'].controlName === 'vertical') {
            this.verticaldata = res.ResponseObject;
            this.sub_and_vertical = res.ResponseObject;
            // this.verticaldata
          } else {
            this.location_temp = res.ResponseObject;
          }

        }
        else if (x.action === 'tabSwich') {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
        }
      });
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result)
        if (result.IsProspectAccount) {
          // this.accountListService.sendProspectAccount = false;
          this.IsModuleSwitch = false;
          this.showFirstForm = true;
          sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createTempData()));
          this.router.navigateByUrl('/activities/prospectAccount');
        } else {
          this.emptyArray(result.controlName);
          this.AppendParticularInputFun(result.selectedData, result.controlName);
        }
      }
    });
  }
  getCommonData() {
    return {
      // guid: '11',
      // isProspect: '11',
      stateId: this.accountCreationObj['state'] ? this.accountCreationObj['state'] : '',
      countryId: this.accountCreationObj['country'] ? this.accountCreationObj['country'] : '',
      regionId: this.accountCreationObj['region'] ? this.accountCreationObj['region'] : '',
      geoId: this.accountCreationObj['geography'] ? this.accountCreationObj['geography'] : '',
      verticalId: this.accountCreationObj['vertical'] ? this.accountCreationObj['vertical'] : '',
      SbuId: this.accountCreationObj['sbu'] ? this.accountCreationObj['sbu'] : '',
      clusterId: this.OwnDetailsForm.controls['sbu'].value ? this.OwnDetailsForm.controls['sbu'].value : ''

    };
  }
  // selectedLookupName(controlName) {
  //   switch (controlName) {
  //     case 'parentaccount': { return this.AccDetailsForm.value.parentaccount ? (this.AccDetailsForm.value.parentaccount === this.getSymbol(this.ParentAccountSelected['Name'])) ? this.AccDetailsForm.value.parentaccount  : this.AccDetailsForm.value.parentaccount : '' };
  //     // case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : [] }
  //     // case 'owner': { return this.OwnDetailsForm.value.owner ? (this.OwnDetailsForm.value.owner === this.ownerAccountSelected['FullName']) ? this.OwnDetailsForm.value.owner : this.OwnDetailsForm.value.owner : '' }
  //     // case 'sbu': { return this.OwnDetailsForm.value.sbu ? (this.OwnDetailsForm.value.sbu === this.sbuAccountSelected['Name']) ? this.OwnDetailsForm.value.sbu : this.OwnDetailsForm.value.sbu : '' }
  //     // case 'vertical': {  return this.OwnDetailsForm.value.vertical ? (this.OwnDetailsForm.value.vertical === this.verticalSelected['Name']) ? this.OwnDetailsForm.value.vertical  : this.OwnDetailsForm.value.vertical : ''    }
  //     // case 'subvertical': { return this.OwnDetailsForm.value.subvertical ? (this.OwnDetailsForm.value.subvertical === this.subVerticalSelected['Name']) ? this.OwnDetailsForm.value.subvertical : this.OwnDetailsForm.value.subvertical : '' }
  //     // case 'currencyaccount': { return this.AccDetailsForm.value.currency ? (this.AccDetailsForm.value.currency === this.sendCurrencytoAdvance['Desc']) ? '' : this.AccDetailsForm.value.currency : '' }
  //     // case 'geography': { return this.OwnDetailsForm.value.geography ? (this.OwnDetailsForm.value.geography === this.geographySelected['Name']) ? this.OwnDetailsForm.value.geography : this.OwnDetailsForm.value.geography : '' }
  //     // case 'region': { return this.OwnDetailsForm.value.region ? (this.OwnDetailsForm.value.region === this.regionSelected['Name']) ? this.OwnDetailsForm.value.region : this.OwnDetailsForm.value.region : '' }
  //     // case 'country': { return this.OwnDetailsForm.value.country ? (this.OwnDetailsForm.value.country === this.countrySelected['Name']) ? this.OwnDetailsForm.value.country : this.OwnDetailsForm.value.country : '' }
  //     // case 'state': { return this.OwnDetailsForm.value.state ? (this.OwnDetailsForm.value.state === this.stateSelected['Name']) ? this.OwnDetailsForm.value.state : this.OwnDetailsForm.value.state : '' }
  //     // case 'city': { return this.OwnDetailsForm.value.city ? (this.OwnDetailsForm.value.city === this.citySelected['Name']) ? this.OwnDetailsForm.value.city : this.OwnDetailsForm.value.city : '' }
  //     // case 'altowner': { return this.OwnDetailsForm.value.altowner ? (this.OwnDetailsForm.value.altowner === this.altOwnerAccountSelected['FullName']) ? this.OwnDetailsForm.value.altowner : this.OwnDetailsForm.value.altowner : '' }
  //     // case 'cluster': { return this.OwnDetailsForm.value.cluster ? (this.OwnDetailsForm.value.cluster === this.clusterSelected['Name']) ?  this.OwnDetailsForm.value.cluster: this.OwnDetailsForm.value.cluster : ''}
  //     default: { return []; }
  //   }
  // }
  // sendGeographytoAdvance:any  = [];
  // geographySelected :any;
  // sendRegiontoAdvance :any  = [];
  // regionSelected:any;
  // sendCountrytoAdvance:any  = [];
  // countrySelected:any;
  // sendSatetoAdvance:any  = [];
  // stateSelected:any;
  // sendCitytoAdvance:any  = [];
  // citySelected:any;
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountNameSource': {
        return this.AccountSelected = [], this.sendAccountNameToAdvance = [];
      }
      case 'parentaccount': {
        return this.ParentAccountSelected = [], this.sendParentAccountNameToAdvance = [];
      }
      case 'ultimateparent': {
        return this.sendUltimateAccountAdvance = [], this.ultimateParentAccountSelected = [];
      }
      case 'sbu': {
        return this.sendSbuToAdvance = [], this.sbuAccountSelected = [];
      }
      case 'owner': {
        return this.sendOwnerToAdvance = [], this.ownerAccountSelected = [];
      }
      case 'vertical': {
        return this.sendVerticalToAdvance = [], this.verticalSelected = [];
      }
      case 'subvertical': {
        return this.sendSubVerticaltoAdvance = [], this.subVerticalSelected = [];
      }
      case 'currencyaccount': {
        return this.sendCurrencytoAdvance = [], this.currencySelected = [];
      }
      case 'geography': {
        return this.sendGeographytoAdvance = [], this.geographySelected = [];
      }
      case 'region': {
        return this.sendRegiontoAdvance = [], this.regionSelected = [];
      }
      case 'country': {
        return this.sendCountrytoAdvance = [], this.countrySelected = [];
      }
      case 'state': {
        return this.sendSatetoAdvance = [], this.stateSelected = [];
      }
      case 'city': {
        return this.sendCitytoAdvance = [], this.citySelected = [];
      }
      case 'cluster': {
        return this.clustertoAdvLookup = [], this.clusterSelected = [];
      }
      case 'altowner': {
        return this.sendAltOwnerToAdvance = [], this.sendAltOwnerToAdvance = [];
      }
      // clusterSelected : any;
      // clustertoAdvLookup : any = [];
    }
  }

  // 'currencyaccount': { name: 'Sub vertical', isCheckbox: false, isAccount: false },
  // 'geography': { name: 'Geo', isCheckbox: false, isAccount: false },
  // 'region': { name: 'Region', isCheckbox: false, isAccount: false },
  // 'country': { name: 'Country', isCheckbox: false, isAccount: false },
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountNameSearch': { return (this.sendAccountNameToAdvance.length > 0) ? this.sendAccountNameToAdvance : [] }
      case 'parentaccount': { return (this.sendParentAccountNameToAdvance.length > 0) ? this.sendParentAccountNameToAdvance : [] }
      case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : [] }
      case 'owner': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : [] }
      case 'sbu': { return (this.sendSbuToAdvance.length > 0) ? this.sendSbuToAdvance : [] }
      case 'vertical': { return (this.sendVerticalToAdvance.length > 0) ? this.sendVerticalToAdvance : [] }
      case 'subvertical': { return (this.sendSubVerticaltoAdvance.length > 0) ? this.sendSubVerticaltoAdvance : [] }
      case 'currencyaccount': { return (this.sendCurrencytoAdvance.length > 0) ? this.sendCurrencytoAdvance : [] }
      case 'geography': { return (this.sendGeographytoAdvance.length > 0) ? this.sendGeographytoAdvance : [] }
      case 'region': { return (this.sendRegiontoAdvance.length > 0) ? this.sendRegiontoAdvance : [] }
      case 'country': { return (this.sendCountrytoAdvance.length > 0) ? this.sendCountrytoAdvance : [] }
      case 'state': { return (this.sendSatetoAdvance.length > 0) ? this.sendSatetoAdvance : [] }
      case 'city': { return (this.sendCitytoAdvance.length > 0) ? this.sendCitytoAdvance : [] }
      case 'cluster': { return (this.clustertoAdvLookup.length > 0) ? this.clustertoAdvLookup : [] }
      case 'altowner': { return (this.sendAltOwnerToAdvance.length > 0) ? this.sendAltOwnerToAdvance : [] }
      default: { return []; }
    }
  }
  // sendCurrencytoAdvance: any = [];
  //   currencySelected: any;
  createTempData() {
    return {
      accountDetailName: this.leadSourceSelected,
      parentaccount: this.ParentAccountSelected,
      ultimateparent: this.ultimateParentAccountSelected,
      owner: this.ownerAccountSelected,
      sbu: this.sbuAccountSelected,
      vertical: this.verticalSelected,
      subvertical: this.subVerticalSelected,
      currencyaccount: this.currencySelected,
      geography: this.geographySelected,
      region: this.regionSelected,
      country: this.countrySelected,
      state: this.stateSelected,
      city: this.citySelected,
      cluster: this.clusterSelected,
      altowner: this.altOwnerAccountSelected,
      // this.altOwnerAccountSelected = item;
      // this.altOwnerName = item.FullName;
      // this.sendAltOwnerToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    };
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

    'accountNameSearch': (data) => { this.appendAccountName(data.Name, data) },
    'parentaccount': (data) => { this.appendparent(data.Name, data) },
    'ultimateparent': (data) => { this.appendUltParent(data.Name, data) },
    'owner': (data) => { this.appendcustomer(data.FullName, data) },
    'sbu': (data) => { this.appendcontactSBU(data.FullName, data), this.removeVerticalAndSbuverticalData('', true, data) },
    'vertical': (data) => { this.appendvertical(data.Name, data, false) },
    'subvertical': (data) => { this.appendsubvertical(data.Name, data, false) },
    'currencyaccount': (data) => { this.appendcurrency(data) },
    'geography': (data) => { this.appendgeo(data) },
    'region': (data) => { this.appendregion(data, '', false) },
    'country': (data) => { this.appendcountry1(data, '', false) },
    'state': (data) => { this.appendState(data, '', false) },
    'city': (data) => { this.appendcity1(data, '', false) },
    'altowner': (data) => { this.appendAltOwner(data) },
    'cluster': (data) => { this.appendcluster(data) },



  }
  removeVerticalAndSbuverticalData(emptyvalue, advanceflag, selectedData?) {
    if (!advanceflag) {
      if (emptyvalue === '') {
        this.accountCreationObj['sbu'] = '';
        this.OwnDetailsForm.controls['sbu'].setValue('');
        this.accountCreationObj['vertical'] = '';
        this.OwnDetailsForm.controls['vertical'].setValue('');
        this.accountCreationObj['subvertical'] = '';
        this.OwnDetailsForm.controls['subvertical'].setValue('');
      }
    } else {
      this.accountCreationObj['vertical'] = '';
      this.OwnDetailsForm.controls['vertical'].setValue('');
      this.accountCreationObj['subvertical'] = '';
      this.OwnDetailsForm.controls['subvertical'].setValue('');
    }
  }
  clearJubk() {
    this.AccDetailsForm.controls['currency'].setValue('');

  }
  clearowner() {
    this.OwnDetailsForm.controls['owner'].setValue('');
  }
  clearaltowner() {
    this.OwnDetailsForm.controls['alternateaccountowner'].setValue('');
  }
  getcurrencyaccount(event) {
    this.parentaccount = [];
    this.accountCreationObj['currencyaccount'] = '';
    // if (!this.userdat.searchFieldValidator(event)) {
    //   event = '';
    // }
    let input = event;
    if (event !== '') {
      // input = event.replace(/ *\([^)]*\) */g, '');
      input = event.replace(/ *\([^]*\) |\([^]*\ */g, '').trim();
    }
    // if (this.userdat.searchFieldValidator(event)) {
    this.isActivityGroupSearchLoading = true;
    // this.loader = true;
    const getcurrencyaccount = this.master3Api.getcurrencyaccount(input);
    getcurrencyaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      // console.log("currency account rsponse ", res.ResponseObject);
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (!res.IsError && res.ResponseObject) {
        // this.lookupdata.TotalRecordCount = res.TotalRecordCount;

        if (res.ResponseObject.length === 0) {
          // this.AccDetailsForm.controls['currency'].setValue('');
          this.currencyaccount = [];
          this.currencyaccount['message'] = 'No record found';
        } else {
          this.advanceLookupCurrency = res.ResponseObject;
          if (event !== '') {
            this.currencyaccount = res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });

            // this.currencyaccount = res.ResponseObject;
          } else {
            this.currencyaccount = this.getTenRecords(res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) }));
          }
        }
      }
      else {
        // this.AccDetailsForm.controls['currency'].setValue('');
        this.currencyaccount = [];
        this.currencyaccount['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.currencyaccount = [];
      this.currencyaccount['message'] = 'No record found';
    });
    // }
  }
  getSymbol(data) {
    // console.log(data)
    return this.accountListService.getSymbol(data);
  }
  appendcurrency(item) {
    this.sendCurrencytoAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.currencySelected = item;
    this.CurrencyData = this.getSymbol(item.Desc);
    // this.getCurencySymbol(item);
    // this.selected_currency();
    this.AccDetailsForm.controls['currency'].setValue(this.getSymbol(item.Desc));
    this.accountCreationObj['currency'] = item.Id || '';
    this.selected_cur = this.currencyLists['' + this.OwnDetailsForm.value.currency + ''];
  }

  getTenRecords(res) {
    // debugger;
    const resdata = res.slice(0, 9);
    return resdata;
  }
  currencyNameclose() {
    this.currencyNameSwitch = false;
  }
  // getCurencySymbol(data) {
  //   const cur = unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  //   // this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
  //   return cur;
  // }

  CreateAutoSave() {
    this.AppendAutoSave();
  }
  AppendAutoSave() {
    this.accservive.SetRedisCacheData(this.createTempDataForAutoSave(), 'createNewAccount').subscribe(res => {
      if (!res.IsError) {
        console.log("SUCESS FULL AUTO SAVE");
      }
    }, error => {
      console.log(error);
    });
  }
  createTempDataForAutoSave() {
    return {
      isAutoSaveData: true,
      accountDetailName: this.AccDetailsForm.value.accountDetailName || '',
      parentaccount: this.AccDetailsForm.value.parentaccount || '',
      ultimateparent: this.AccDetailsForm.value.ultimateparent || '',
      headquarters: this.AccDetailsForm.value.headquarters || '',
      countrycode: this.AccDetailsForm.value.countrycode || '',
      citystring: this.AccDetailsForm.value.city || '',
      countrystring: this.AccDetailsForm.value.country || '',
      state: this.OwnDetailsForm.value.state || '',
      phonenumber: '' + this.AccDetailsForm.value.phonenumber + '' || '',
      email: this.AccDetailsForm.value.email || '',
      businessdescription: this.AccDetailsForm.value.businessdescription || '',
      sicdescription: this.AccDetailsForm.value.sicdescription || '',
      stockindexmembership: this.AccDetailsForm.value.stockindexmembership || '',
      tickersymbol: this.AccDetailsForm.value.tickersymbol || '',
      currency: this.AccDetailsForm.value.currency || '',
      fortune: this.AccDetailsForm.value.fortune || '',
      profits: this.AccDetailsForm.value.profits || '',
      revenue: this.AccDetailsForm.value.revenue || '',
      operatingmargins: this.AccDetailsForm.value.operatingmargins || '',
      marketvalue: this.AccDetailsForm.value.marketvalue || '',
      returnonequity: this.AccDetailsForm.value.returnonequity || '',
      entitytype: this.AccDetailsForm.value.entitytype || '',
      creditscore: this.AccDetailsForm.value.creditscore || '',
      isswapaccount: (this.OwnDetailsForm.value.swapaccount) ? this.OwnDetailsForm.value.isswapaccount : false,
      swapaccount: (this.OwnDetailsForm.value.isswapaccount) ? this.OwnDetailsForm.value.swapaccount : '',

      growthcategory: 1,
      revenuecategory: 4,
      sbu: this.OwnDetailsForm.value.sbu || '',
      newagebusiness: this.accountCreationObj['newagebusiness'] || false,
      governementaccount: this.accountCreationObj['governementaccount'] || false,
      vertical: this.OwnDetailsForm.value.vertical || '',
      subvertical: this.OwnDetailsForm.value.subvertical || '',
      city: this.OwnDetailsForm.value.city || '',
      country: this.OwnDetailsForm.value.country || '',
      region: this.OwnDetailsForm.value.region || '',
      geography: this.OwnDetailsForm.value.geography || '',
      website: this.AccDetailsForm.value.website || '',
      ownershiptype: this.AccDetailsForm.value.ownershiptype || '',
      dunsid: this.AccDetailsForm.value.dunsid || '', // this.AccDetailsForm.value.dunsid 
      owner: this.OwnDetailsForm.value.owner || '',
      prospectnumber: '',
      name: this.AccDetailsForm.value.accountDetailName || '',
      requesttype: (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isalternateswapaccount) ? 3 : 1,  // 1 for create account 2,3 for swap account chanked
      ///  prospecttype: 2, // hunting
      finanacialyear: this.OwnDetailsForm.value.finanacialyear || '',
      coveragelevel: this.OwnDetailsForm.value.coveragelevel || '',
      employees: this.AccDetailsForm.value.employees || '',
      address: this.AccDetailsForm.value.address || '',
      statuscode: this.postActionCode,
      prospecti: '',
      // swapaccountcomment: (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccountcomment'] : '',  //this.swapaccountcomment,
      // "swapaccountcomment": this.accountCreationObj['swapaccountcomment'] || '',// come from popup
      // ultimateparentsdunsid: this.AccDetailsForm.value.ultimateparentsdunsid || '',
      // parentsdunsid: this.AccDetailsForm.value.parentsdunsid || '',
      // parentsdunsnumber: this.AccDetailsForm.value.parentsdunsnumber || '',
      // parentdunsname: this.AccDetailsForm.value.parentdunsname || '',
      // ultimateparentdunsname: this.AccDetailsForm.value.ultimateparentdunsname || '',
      // ultimateparentsduns: this.AccDetailsForm.value.ultimateparentsduns || '',
      dunsnumber: this.AccDetailsForm.value.dunsnumber,
      parentsdunsnumber: this.AccDetailsForm.value.parentsdunsnumber,
      ultimateparentsdunsnumber: this.AccDetailsForm.value.ultimateparentsdunsnumber,
      alternateaccountowner: this.AccDetailsForm.value.alternateaccountowner || '',
      alternateswapaccount: this.AccDetailsForm.value.alternateswapaccount || '',
      isalternateswapaccount: this.AccDetailsForm.value.isalternateswapaccount || false,
      // parentaccount: [''],
      // ultimateparent: [''],
      createby: this.loggedUser || '',
      accountCreationObj:
      {
        parentaccount: this.accountCreationObj['parentaccount'],
        ultimateparent: this.accountCreationObj['ultimateparent'],
        state: this.accountCreationObj['state'],
        currency: this.accountCreationObj['currency'],
        swapaccount: this.accountCreationObj['swapaccount'],
        isswapaccount: this.accountCreationObj['isswapaccount'],
        sbu: this.accountCreationObj['sbu'] || '',
        newagebusiness: this.accountCreationObj['newagebusiness'] || false,
        governementaccount: this.accountCreationObj['governementaccount'] || false,
        vertical: this.accountCreationObj['vertical'] || '',
        subvertical: this.accountCreationObj['subvertical'] || '',
        city: this.accountCreationObj['city'] || '',
        country: this.accountCreationObj['country'] || '',
        region: this.accountCreationObj['region'] || '',
        geography: this.accountCreationObj['geography'] || '',
        website: this.AccDetailsForm.value.website || '',
        dunsid: this.accountCreationObj['dunsid'] || '', // this.AccDetailsForm.value.dunsid 
        owner: this.accountCreationObj['owner'] || '',
        finanacialyear: this.accountCreationObj['finanacialyear'] || '',
        ultimateparentsdunsid: this.accountCreationObj['ultimateparentsdunsid'] || '',
        parentsdunsid: this.accountCreationObj['parentsdunsid'] || '',
        parentsdunsnumber: this.accountCreationObj['parentsdunsnumber'] || '',
        parentdunsname: this.accountCreationObj['parentdunsname'] || '',
        ultimateparentdunsname: this.accountCreationObj['ultimateparentdunsname'] || '',
        ultimateparentsduns: this.accountCreationObj['ultimateparentsduns'] || '',
        alternateaccountowner: this.accountCreationObj['alternateaccountowner'] || '',
        alternateswapaccount: this.accountCreationObj['alternateswapaccount'] || '',
        isalternateswapaccount: this.accountCreationObj['isalternateswapaccount'] || '',
      }


    };

  }
  getAutoSaveData() {
    this.accservive.GetRedisCacheData('createNewAccount').subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject) {
          if (res.ResponseObject !== '') {
            this.TempLeadDetails = JSON.parse(res.ResponseObject);
            this.AppendTheFormData(this.TempLeadDetails);
          } else {
            this.leadinfo = true;
          }
        } else {
          this.leadinfo = true;
        }
      }

    });
  }
  AppendTheFormData(data) {
    this.populateCreateProspectForm(data);
  }
  populateCreateProspectForm(savedData) {
    if (savedData.isAutoSaveData ? savedData.isAutoSaveData : false) {
      this.editablefields = true;
    } else {
      this.leadinfo = true;
    }
    // citystring: this.AccDetailsForm.value.city || '',
    // countrystring: this.AccDetailsForm.value.country || '',
    this.customerName = savedData.owner ? savedData.owner : '';
    this.AccDetailsForm.patchValue({
      ultimateparentsdunsid: savedData.ultimateparentsdunsid || '',
      parentsdunsid: savedData.parentsdunsid || '',
      parentdunsname: savedData.parentdunsname || '',
      ultimateparentdunsname: savedData.ultimateparentdunsname || '',
      ultimateparentsduns: savedData.ultimateparentsduns || '',
      accountDetailName: savedData.accountDetailName,
      city: savedData.citystring,
      country: savedData.countrystring,
      phonenumber: savedData.phonenumber,
      email: savedData.email,
      businessdescription: savedData.businessdescription,
      currency: savedData.currency,
      ownershiptype: savedData.ownershiptype,
      dunsnumber: savedData.dunsnumber,
      parentsdunsnumber: savedData.parentsdunsnumber,
      ultimateparentsdunsnumber: savedData.ultimateparentsdunsnumber,
      parentaccount: savedData.parentaccount,
      ultimateparent: savedData.ultimateparent,
      name: savedData.name,
      headquarters: savedData.headquarters,
      countrycode: savedData.countrycode,
      sicdescription: savedData.sicdescription,
      stockindexmembership: savedData.stockindexmembership,
      tickersymbol: savedData.tickersymbol,
      fortune: savedData.fortune,
      profits: savedData.profits,
      revenue: savedData.revenue,
      operatingmargins: savedData.operatingmargins,
      marketvalue: savedData.marketvalue,
      returnonequity: savedData.returnonequity,
      entitytype: savedData.entitytype,
      creditscore: savedData.creditscore,
      website: savedData.website,
      dunsid: savedData.dunsid,
      address: savedData.address,
      employees: savedData.employees,
      // accountDetailName: savedData.accountDetailName,
      // currency: savedData.currency,
    });
    this.OwnDetailsForm.patchValue({
      sbu: savedData.sbu,
      vertical: savedData.vertical,
      subvertical: savedData.subvertical,
      geography: savedData.geography,
      region: savedData.region,
      state: savedData.state,
      city: savedData.city,
      finanacialyear: savedData.finanacialyear,
      country: savedData.country,
      isswapaccount: savedData.isswapaccount,
      swapaccount: savedData.swapaccount,
      growthcategory: savedData.growthcategory,
      revenuecategory: savedData.revenuecategory,
      newagebusiness: savedData.newagebusiness,
      governementaccount: savedData.governementaccount,
      owner: savedData.owner,
      coveragelevel: savedData.coveragelevel,
      currency: savedData.currency,
      alternateaccountowner: savedData.alternateaccountowner,
      alternateswapaccount: savedData.alternateswapaccount,
      isalternateswapaccount: savedData.isalternateswapaccount
    });

    this.accountCreationObj = {
      parentaccount: savedData.accountCreationObj.parentaccount,
      ultimateparent: savedData.accountCreationObj.ultimateparent,
      state: savedData.accountCreationObj.state,
      currency: savedData.accountCreationObj.currency,
      swapaccount: savedData.accountCreationObj.swapaccount,
      isswapaccount: savedData.accountCreationObj.isswapaccount,
      sbu: savedData.accountCreationObj.sbu || '',
      newagebusiness: savedData.accountCreationObj.newagebusiness || false,
      governementaccount: savedData.accountCreationObj.governementaccount || false,
      vertical: savedData.accountCreationObj.vertical || '',
      subvertical: savedData.accountCreationObj.subvertical || '',
      city: savedData.accountCreationObj.city || '',
      country: savedData.accountCreationObj.country || '',
      region: savedData.accountCreationObj.region || '',
      geography: savedData.accountCreationObj.geography || '',
      website: savedData.accountCreationObj.website || '',
      dunsid: savedData.accountCreationObj.dunsid || '', // this.AccDetailsForm.value.dunsid 
      owner: savedData.accountCreationObj.owner || '',
      finanacialyear: savedData.accountCreationObj.finanacialyear || '',
      ultimateparentsdunsid: savedData.accountCreationObj.ultimateparentsdunsid || '',
      parentsdunsid: savedData.accountCreationObj.parentsdunsid || '',
      parentsdunsnumber: savedData.accountCreationObj.parentsdunsnumber || '',
      parentdunsname: savedData.accountCreationObj.parentdunsname || '',
      ultimateparentdunsname: savedData.accountCreationObj.ultimateparentdunsname || '',
      ultimateparentsduns: savedData.accountCreationObj.ultimateparentsduns || '',
      alternateaccountowner: savedData.alternateaccountowner || '',
      alternateswapaccount: savedData.accountCreationObj.alternateswapaccount || '',
      isalternateswapaccount: savedData.accountCreationObj.isalternateswapaccount,
    };
    const SwapAccountFlag = {
      'checked': savedData.isswapaccount
    };
    const setGovtAcFlag = {
      'checked': savedData.governementaccount
    };
    const setBussinessFlag = {
      'checked': savedData.newagebusiness
    };
    //  this.getAllSwapAccount(savedData.accountCreationObj.owner, savedData.accountCreationObj.country);
    this.isSwapAccount(SwapAccountFlag);
    this.setGovtAc(setGovtAcFlag);
    this.setBussiness(setBussinessFlag);
    this.getHuntingCount(savedData.accountCreationObj.owner, '');
    this.getExistingCount(savedData.accountCreationObj.owner);

  }
  autoSave() {
    setTimeout(() => {
      this.CreateAutoSave();
    }, 500);
  }
  clearAutoSaveDate() {
    this.accountListService.clearAutoSaveData('createNewAccount').subscribe(res => {

      if (!res.IsError) {
        console.log("SUCESSFULLY DELETED AUTO SAVE")
      }
    }, error => {
      console.log(error)
    });
  }
  removeSeletecedValue(FormName, formControlName, accountObjectName) {
    this.accountCreationObj[accountObjectName] = '';
    if (FormName === 'AccDetailsForm') {
      this.AccDetailsForm.controls[formControlName].setValue('');
    } else {
      this.OwnDetailsForm.controls[formControlName].setValue('');
      if (formControlName == 'owner') {
        this.onOwnercleared();
      }
      else {
        if (formControlName == 'alternateaccountowner') {
          this.onAltOwnercleared();
        }
        else { }
      }
    }

    // removeSeletecedValue(FormName, formControlName, accountObjectName) {
    //   this.accountCreationObj[accountObjectName] = '';
    //   if (FormName === 'prospectAccForm') {
    //     this.prospectAccForm.controls[formControlName].setValue('');
    //   } else {
    //     this.OwnDetailsForm.controls[formControlName].setValue('');
    //   }

    // }
  }
  removesubVertical(event) {
    if (event === '') {
      this.accountCreationObj['subvertical'] = '';
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      this.accountCreationObj['vertical'] = '';
      this.OwnDetailsForm.controls['vertical'].setValue('');
    }
  }
  /*****************Advance search popup ends*********************/
}
@Component({
  selector: 'prospect-account',
  templateUrl: './prospectaccount-popup.html',
})

export class Prospectaccount {
  commentpostobject: any = {};
  swapaccountcomment: string = '';
  accountSubmitted: boolean = false;
  prospectdata: any;
  constructor(public dialogRef: MatDialogRef<Prospectaccount>, public accservive: DataCommunicationService,
    public listservice: AccountListService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("paylodaddata for prospect", data)
    this.prospectdata = data.data
    console.log("data@@@@@@@@@@@@@@@@@@@@@@@@@", this.prospectdata);
    this.listservice.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': this.prospectdata });

  }
  @HostListener('window:keyup.esc') onKeyUp() {

  }

  prospectaccount() {
    this.dialogRef.close(this.prospectdata)
    console.log("prospect data", this.prospectdata)
  }


}
// @Component({
//   selector: 'account-owner',
//   templateUrl: './accountowner-popup.html',
// })

// export class OpenProspectAccountOwner {
//   constructor(public dialogRef: MatDialogRef<OpenProspectAccountOwner>, public accservive: DataCommunicationService) { }
//   close = false;
//   /****************** customer contact autocomplete code start ****************** */
//   // Accountowner
//   showCustomer: boolean = false;
//   customerName: string = '';
//   customerNameSwitch: boolean = true;

//   customerNameclose() {

//     // if(this.customerName.length > 0){
//     this.customerNameSwitch = false;
//     // }
//   }
//   // account owner =================
//   appendcustomer(value: string, i) {

//     this.customerName = value;
//     this.selectedCustomer.push(this.customerContact[i])
//   }

//   customerContact: {}[] = [

//     { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
//     { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
//     { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
//     { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
//   ]

//   selectedCustomer: {}[] = [];


//   /****************** customer contact autocomplete code end ****************** */

//   closeDiv(item: any) {
//     //this.close=true;
//     this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index != item.index);
//   }
//   closepop() {

//     this.dialogRef.close(this.selectedCustomer)

//   }

//   ngOnInit() {
//   }
// }