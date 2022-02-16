import { AccountDetails } from './../../../../core/interfaces/get-account-details';
import { Component, OnInit, ElementRef, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Location, getCurrencySymbol } from '@angular/common';
import { DataCommunicationService } from '@app/core/services/global.service';
import { environment as env } from '@env/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService, websiteValidator } from '@app/shared/services/validation.service';
import { SearchAccountPopupComponent } from '@app/shared/modals/search-account-popup/search-account-popup.component';
import { MasterApiService } from '@app/core/services/master-api.service';
import { AccountOwnerPopupComponent } from '@app/shared/modals/account-owner-popup/account-owner-popup.component';
import { SwapPopupComponent } from '@app/shared/modals/swap-popup/swap-popup.component';
import { SwapCreatePopupComponent } from '@app/shared/modals/swap-create-popup/swap-create-popup.component';
import { faShuttleVan } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { activeRequestsclear } from '@app/core/state/actions/Creation-History-List.action';
import { farmingRequestsclear } from '@app/core/state/actions/farming-account.action';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { AccountAdvnNames, AccountNameListAdvnHeaders } from '@app/core/services/account.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Subscription } from 'rxjs';
import { reserveAccountClear } from '@app/core/state/actions/resereve-account-list.actions';
import { removeSpaces } from '@app/shared/pipes/white-space.validator';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
//import { activeRequestListclear } from '@app/core/state/actions/Creation-History-List.action';

@Component({
  selector: 'app-create-prospect-account',
  templateUrl: './create-prospect-account.component.html',
  styleUrls: ['./create-prospect-account.component.scss']
})
export class CreateProspectAccountComponent implements OnInit {
  del;
  account1;
  account2;
  isLoading: boolean = false;
  selected;
  loader: boolean = false;
  accountInfo = true;
  greenborder = true;
  dealinfo = false;
  twoactive = false;
  ownerdetails = false;
  account: number;
  currencyvalue: any;
  ownershiptypevalue: any;
  entitytypevalue: any;
  growthCatagoryvalue: any;
  coveragelevelvalue: any;
  revenueCatagoryvalue: any;
  Geovalue: any;
  wiproContact2: any;
  countrybygeovalue: any;
  countrybyname: any;
  statebyname: any;
  geo: any;
  geoId: any;
  statevalue: any;
  sbuArray: Array<any> = [];
  countryId: any;
  stateId: any;
  SbuId: any;
  Sbudata: any;
  verticalId: any;
  verticaldata: any;
  subverticaldata: any;
  financialyeardata: any;
  parentaccount: any;
  currencyaccount: any;
  accountownerdata: any;
  seletedValue = 'Browse';
  butDisabled: boolean = true;
  UltimateparentName: any;
  UltimateparentId: any;
  parentNameId: any;
  currencyNameId: any;
  ultimateparentaccount: any;
  countrycode: any;
  contactnumber: any;
  Sicdescription: any;
  subverticalId: any;
  cityId: any;
  regionId: any;
  FinacialyearId: any;
  accountCreationObj = {};
  swapaccountcomment: any;
  postActionCode: number = 0;
  roleType: any;
  allSwapableAccount: any = []; //kunal
  allaltSwapableAccount = [];
  searchAccount1: boolean = false;
  searchAltAccount = false;
  arrowkeyLocation = 0;
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}';
  phoneFormat = '[0-9]{10}$';
  urlFormat = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  prospectAccForm: FormGroup;
  OwnDetailsForm: FormGroup;

  firstFormSubmitted = false;
  submitted = false;
  formsData: any;
  huntingRatio: any;
  altHuntingRatio: any;
  loggedUser: string;
  overallStatus: number = 184450009;
  selected_cur: string = '';
  currencyLists = { '1': '$', '2': '€', '3': '?' };
  sub_and_vertical: any = [];
  isActivityGroupSearchLoading: boolean;
  cityCountryValid: boolean = false;
  subscription: Subscription;
  // payload: any;
  location_temp: any = [];
  createDropDown: any = {
    geography: [],
    region: [],
    state: [],
    city: [],
    // finanacialyear: [],
    country: [],
    advanceLookupRegion: [],
    advanceLookupState: [],
    advanceLookupCity: [],
    advanceLookupCountry: []

  };
  draftDetails: any;
  CurrencyData;
  OwnermandtFiled = ['owner', 'sbu', 'vertical', 'subvertical', 'geography', 'region', 'country', 'state', 'city'];//, 'finanacialyear' remove from Owner mandt Filed
  customValidators = { 'owner': true, 'sbu': true, 'vertical': true, 'subvertical': true, 'geography': true, 'region': true, 'country': true, 'state': false, 'city': false };// 'finanacialyear': true.custome validatore
  ownername: any;
  // altOwnerName: any;
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
  // ownername: any;
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
  sendSbuToAdvance: any = [];
  sbuAccountSelected: any;
  sendVerticalToAdvance: any = [];
  verticalSelected: any;
  sendSubVerticaltoAdvance: any = [];
  subVerticalSelected: any;
  customerContact: any;
  customerNameSwitch;
  sendCurrencytoAdvance: any = [];
  currencySelected: any;
  // currencyaccount;
  sendGeographytoAdvance: any = [];
  geographySelected: any;
  sendRegiontoAdvance: any = [];
  regionSelected: any;
  sendCountrytoAdvance: any = [];
  countrySelected: any;
  sendSatetoAdvance: any = [];
  stateSelected: any;
  sendCitytoAdvance: any = [];
  citySelected: any;
  parentflag: any;
  parentdetailes: any;
  IsSubVerticalExist: boolean = true;
  // currencyNameSwitch :any;
  advancelookupVertical: any = [];
  advancesubverticaldata: any = [];
  createClicked;
  TempLeadDetails;
  customerName: string = '';
  alternateOwner = '';
  IsOwner: any;
  accountownername: string;
  ParentAccountName = '';
  advanceLookupCurrency;
  ultimateParentAccountName = '';
  SbuName = '';
  geoName = '';
  OwnerName = '';
  AltOwnerName = '';
  VerticalName = '';
  SubverticalName = '';
  regionName = '';
  countryFieldName = '';
  stateName = '';
  cityNameField = '';
  prospectaccountdata: any;
  isclusterexist: boolean = false;
  prospectsysguid: any;
  alternativeownerSwitch: boolean;
  alternativeowner = [];
  secondaryownerSwitch: boolean;
  secondaryowner = [];
  sendAltOwnerToAdvance = [];
  altownerAccountSelected = [];
  clusterdata: any;
  cluster: any;
  isSbuSelected: boolean = false;
  ClusterName = '';
  clusterSelected: any;
  clustertoAdvLookup: any = [];
  existingRatio: any;
  constructor(public dialog: MatDialog, public location: Location,
    private _fb: FormBuilder, private el: ElementRef, public validate: ValidationService,
    public userdat: DataCommunicationService,
    // public apiservice: MasterApiService,
    private router: Router,
    private EncrDecr: EncrDecrService,
    private snackBar: MatSnackBar,
    public accountListService: AccountListService,
    public master3Api: S3MasterApiService,
    private store: Store<AppState>,
    public route: ActivatedRoute,
    public service: DataCommunicationService,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService
  ) {  // this.subscription = this.accountListService.getProspectGuid().subscribe(res => {
    //   debugger;
    //   // console.log('subject res', JSON.stringify(res))
    //  console.log('response of the prospect account ',res)
    // });

  }

  // convenience getter for easy access to form fields
  get prosForm() { return this.prospectAccForm.controls; }
  get accOwnerSwap() { return this.OwnDetailsForm.controls; }

  ngOnInit() {
    // const token = localStorage.getItem('token').toString();
    // let data = 'IU+SWaPslGgx8DnZxqYKXQp656DVpncyUzwcCujp3eX5hSnZGh5Tnq9evlqfrMFfSmrpvI8g83HjucJX1PiWF5AUItt/znGfQ1PNErRdSOXn0WMI+DoTazfsxtK7beT05/qWN0dOIwuquVvcaC1/UADFmvQHr8+vG5puqpTRV9stsjeUfayk8XAKbnXPmFHZkFSyINECRmUR48cDGuvJnJSTnNtekqlEHqGfGzzYAcmiJcvzRvJ6R2EXVC3WcD6Xf4FzJ664eC7GLJaAnz5l/q34L3a5M2tQxdIfXJfzFRtTSLanT3GtZgocI/zCoe1sKzBuXrDN4eCHRVi4tjHPmW4wZZ6UZ3BnsGu+ayEWDhnz28xEhSzb1nsK6c7oMqgIxhS2JEeHJaelmoThKapYuIzBZf4+0lb0tY+oJUUKClpa3KyaekG/G7Mdz4roLZAhnDgRSvaDrC9e9P691jifzc5CJYS5+vWVz0yVzVLnrmqHWjgsL33qK0ea2pwGIsR4'
    // const resultVal = this.EncrDecr.get(token.substring(0, 32), data, env.encDecConfig.key);
    //       console.log('Order post method',resultVal);

    // console.log("route && route.snapshot && route.snapshot.params", this.route, this.route.snapshot, this.route.snapshot.params)
    // if (this.route && this.route.snapshot && this.route.snapshot.params) {
    //   if (this.route.snapshot.params.id) {
    //     this.draftSysGuid = this.route.snapshot.params.id;
    //   } else {
    //     // this.draftSysGuid = '9df133e7-0568-e911-a95a-000d3aa053b9';
    //   }

    // }
    // this.accountListService.getparentaccountdetails().subscribe(res =>{
    //   console.log("subject res",JSON.stringify(res))
    //   this.prospectAccForm.controls['parentaccount'].setValue(res.parentaccountname)
    //   this.prospectAccForm.controls['parentaccount'].setValue(res.parentaccountname);
    //   this.accountCreationObj['parentaccount'] = res.parentsysguid || '';
    // })
    // this.getAutoSaveData();
    this.draftSysGuid = localStorage.getItem('draftId');
    if (this.draftSysGuid) {
      this.accountListService.draftDetails(this.draftSysGuid).subscribe((res) => {
        // console.log("draft detaisls", res);
        this.draftDetails = res.ResponseObject;
        this.accountDetails(this.draftDetails);
      });
    }
    else {
      this.getAutoSaveData();
    }


    this.roleType = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip');
    this.loggedUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.IsOwner = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('Isownerexist'), 'DecryptionDecrip');
    this.accountownername = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('username'), 'DecryptionDecrip');
    console.log("roletype", this.roleType);
    // console.log("draftSysGuid", this.draftSysGuid);
    // if (!this.draftSysGuid) {
    if (this.roleType == 1) {
      this.overallStatus = 184450009;
      this.snackBar.open('Please enter Account details manually. Details will be verified by the SBU SE SPOC / GEO SPOC.', '', {
        duration: 5000
      });
    } else if (this.roleType == 2) {
      this.overallStatus = 184450002;
      this.snackBar.open('Please enter account details manually . Details will be verified by the CSO.', '', {
        duration: 5000
      });

    } else if (this.roleType == 3) {
      this.overallStatus = 184450000; //as per the disscussion with santosh we are changing status code from 02 t0 00
      this.snackBar.open('Please enter account details manually.', '', {
        duration: 5000
      });
    }
    // }

    // console.log("status code is ", this.postActionCode)
    this.accountCreationObj['newagebusiness'] = false;
    this.accountCreationObj['governementaccount'] = false;
    this.accountCreationObj['isswapaccount'] = false;
    if (this.accountCreationObj['sbu'] == '') {
      this.isSbuSelected = false;
    }
    else {
      this.isSbuSelected = true;
    }

    /** Form validation starts */
    this.prospectAccForm = this._fb.group({
      // phonenumber: ['', [Validators.required, Validators.pattern(this.phoneFormat), Validators.minLength(10), Validators.maxLength(10)]],
      phonenumber: ['', Validators.required],
      // email: [''],
      email: ['', [Validators.pattern(this.emailFormat)]],
      businessdescription: [''],
      currency: ['', Validators.required],
      ownershiptype: ['', Validators.required],

      // parentaccount: [''],
      parentaccount: [''],
      // currencyaccount: [''],
      ultimateparent: [''],
      name: ['',],
      legalentity: ['', Validators.required],
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
      creditscore: [''],
      // website: ['', [websiteValidator]],
      website: ['', [Validators.pattern(this.urlFormat)]],
      address: [''],
      employees: [''],
      quarter: [''],
      country: [''], //chethana july 8th
      city: [''],
      // owner: ['', Validators.required],
    });
    this.OwnDetailsForm = this._fb.group({
      // owner: ['', Validators.required],
      cluster: [''],
      sbu: ['', Validators.required],
      vertical: ['', Validators.required],
      subvertical: ['', Validators.required],
      geography: ['', Validators.required],
      region: ['', Validators.required],
      state: [''],
      city: [''],
      opportunity: [''],
      // finanacialyear: ['', Validators.required],
      country: ['', Validators.required],
      isswapaccount: [''],
      swapaccount: [''],
      growthcategory: [''],
      revenuecategory: [''],
      newagebusiness: [''],
      governementaccount: [''],
      owner: ['', Validators.required],
      // requesttype: [''],
      // ultimateparentsdunsid: [''],
      coveragelevel: [''],
      altowner: [''],
      altswapaccount: [''],
      isaltswapaccount: [''],
    });
    this.prospectAccForm.get('legalentity').valueChanges.subscribe(val => {
      if (val.trim() === "") {
        this.prospectAccForm.get('legalentity').patchValue('', { emitEvent: false })
      }
    })
    this.prospectAccForm.get('name').valueChanges.subscribe(val => {
      if (val.trim() === "") {
        this.prospectAccForm.get('name').patchValue('', { emitEvent: false })
      }
    })
    this.prospectAccForm.get('phonenumber').valueChanges.subscribe(val => {
      if (val.trim() === "") {
        this.prospectAccForm.get('phonenumber').patchValue('', { emitEvent: false })
      }
    })
    //this.prospectAccForm.get('legalentity').patchValue('', { emitEvent: false });
    this.OwnDetailsForm.controls['swapaccount'].disable();
    this.OwnDetailsForm.controls['isswapaccount'].disable();
    this.OwnDetailsForm.controls['altowner'].disable();
    this.OwnDetailsForm.controls['altswapaccount'].disable();
    this.OwnDetailsForm.controls['isaltswapaccount'].disable();
    this.OwnDetailsForm.controls['cluster'].disable();
    // console.log(this.prospectAccForm);
    /** Form validation ends */
    this.formsData = {
      owner: ''
    };

    this.getCurrency();
    this.getownershiptype();
    this.getEntitytype();
    this.getgrowthcategory();
    this.getcoveragelevel();
    this.GetRevenueCategory();
    this.accountCreationObj['newagebusiness'] = false;
    this.accountCreationObj['governementaccount'] = false;
    //this.GetGeobyName()
    // this.accountActivationTest();
    //debugger
    this.parentflag = localStorage.getItem('parentflag');
    if (this.parentflag === 'true') {
      this.parentdetailes = JSON.parse(localStorage.getItem('parentdetailes'));
      this.prospectAccForm.controls['parentaccount'].setValue(this.getSymbol(this.parentdetailes.parentaccountname));
      this.accountCreationObj['parentaccount'] = this.parentdetailes.parentsysguid || '';
      this.prospectAccForm.controls['ultimateparent'].setValue(this.getSymbol(this.parentdetailes.ultimateparentname));
      this.accountCreationObj['ultimateparent'] = this.parentdetailes.ultimateparentguid || '';
      //   this.prospectAccForm.controls['parentaccount'].setValue(res.parentaccountname);
    }
    this.getprospectid();
  }
  getprospectid() {
    this.accountListService.getProspectGuid().subscribe((res: any) => {
      this.prospectsysguid = res;
      this.getprospectdetails(this.prospectsysguid);
    });
  }

  getprospectdetails(id) {
    const reqbody = {
      'SysGuid': id,
      'LoggedInUser': {
        'SysGuid': this.loggedUser
      }

    };
    this.accountListService.getAccountOverviewDetails(reqbody).subscribe((res: any) => {
      console.log("prospects account data recived", res);
      this.prospectaccountdata = res.ResponseObject;
      this.prospectAccountDetails(this.prospectaccountdata);
    });
  }
  prospectAccountDetails(data) {
    this.prospectAccForm.patchValue({
      name: (data && data.Name) ? data.Name : '',
      email: (data && data.Email) ? data.Email : '',
      website: (data && data.WebsiteUrl) ? data.WebsiteUrl : '',
      ownershiptype: (data.OwnershipType && data.OwnershipType.Id) ? data.OwnershipType.Id : '',
      phonenumber: (data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '',
      businessdescription: (data && data.BusinessDescription) ? data.BusinessDescription : '',
    });
    this.OwnDetailsForm.patchValue({
      vertical: (data.Vertical && data.Vertical.Name) ? data.Vertical.Name : '',
      geography: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
      region: (data.Region && data.Region.Name) ? data.Region.Name : '',
      country: (data.CountryReference && data.CountryReference.Name) ? data.vertical.Name : '',
      state: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.Name) ? data.CountrySubDivisionReference.Name : '',
      city: (data.CityRegionReference && data.CityRegionReference.Name) ? data.CityRegionReference.Name : ''

    });
    this.accountCreationObj['geography'] = data.Geo.SysGuid;
    this.accountCreationObj['region'] = data.Region.SysGuid;
    this.accountCreationObj['country'] = data.CountryReference.SysGuid;
    this.accountCreationObj['state'] = data.CountrySubDivisionReference.SysGuid;
    this.accountCreationObj['city'] = data.CityRegionReference.SysGuid;
  }
  // keyPress(event: any) {
  //   debugger
  //   const pattern = /[^!@#^$%&*()?><',:-;-=_+{}|\[\]\\\/ 0-9.]/;

  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode !== 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }

  Inputdata(data) {
    return data.target.value = data.target.value.replace(/[^!@#^$%&*()?><',:-;-=_+{}|\[\]\\\/ 0-9.]/, '');
  }
  accountDetails(data) {

    this.prospectAccForm.patchValue({
      phonenumber: (data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '',
      email: (data && data.Email) ? data.Email : '',
      businessdescription: (data && data.BusinessDescription) ? data.BusinessDescription : '',
      currency: (data.Currency && data.Currency.Value) ? data.Currency.Value : '',
      ownershiptype: (data.OwnershipType && data.OwnershipType.Id) ? data.OwnershipType.Id : '',
      parentaccount: (data.ParentAccount && data.ParentAccount.Name) ? this.getSymbol(data.ParentAccount.Name) : '',
      // currency: (data.CurrencyAccount && data.CurrencyAccount.Name) ? data.CurrencyAccount.Name : '',
      ultimateparent: (data.UltimateParentAccount && data.UltimateParentAccount.Name) ? this.getSymbol(data.UltimateParentAccount.Name) : '',
      name: (data && data.Name) ? this.getSymbol(data.Name) : '',
      legalentity: (data && data.LegalEntity) ? this.getSymbol(data.LegalEntity) : '',
      headquarters: (data && data.HeadQuarters) ? data.HeadQuarters : '',
      countrycode: (data.Address && data.Address.CountryCode) ? data.Address.CountryCode : '',
      country: (data.Address && data.Address.CountryString) ? data.Address.CountryString : '',
      city: (data.Address && data.Address.CityString) ? data.Address.CityString : '',
      sicdescription: (data && data.SicDescription) ? data.SicDescription : '',
      stockindexmembership: data.StockIndexMemberShip,
      tickersymbol: data.TickerSymbol,
      fortune: data.FortuneRanking,
      profits: data.GrossProfit,
      revenue: data.Revenue,
      operatingmargins: data.OperatingMargin,
      marketvalue: data.MarketValue,
      // profits: this.onLoadChange(data.GrossProfit),
      // revenue: this.onLoadChange(data.Revenue),
      // operatingmargins: this.onLoadChange(data.OperatingMargin),
      // marketvalue: this.onLoadChange(data.MarketValue),
      returnonequity: data.ReturnOnEquity,
      entitytype: data.EntityType.Id,
      creditscore: data.CreditScore,
      website: data.WebsiteUrl,
      address: data.Address.Address1,
      employees: data.EmployeeCount,
      // quarter: '',
      // owner: ['', Validators.required],
    });
    this.accountCreationObj['parentaccount'] = data.ParentAccount.SysGuid || '';
    this.accountCreationObj['currency'] = data.Currency.Id || '';
    this.CurrencyData = (data.Currency && data.Currency.Value) ? data.Currency.Value : '',
      this.accountCreationObj['ultimateparent'] = data.UltimateParentAccount.SysGuid || '';
  }

  // draftDetails() {
  //   this.accountListService.draftDetails(this.draftSysGuid).subscribe((res) => {

  //   })
  // }
  selected_currency() {
    // if (this.prospectAccForm.value.currency == 1 || this.prospectAccForm.value.currency == 2 || this.prospectAccForm.value.currency == 3)
    //   // this.selected_cur = this.currencyLists['' + this.prospectAccForm.value.currency + ''];
    //   this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));

    // else {
    const ind = this.currencyvalue.findIndex(cr => cr.Id === this.prospectAccForm.value.currency);
    if (ind !== -1) {
      // console.log(this.currencyvalue[ind].Desc);
      const cur = this.getCurencySymbol(this.currencyvalue[ind].Desc);
      this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
      // console.log(this.selected_cur);
      // console.log(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
    }
    // }
  }

  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
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
    // console.log("this.draftSysGuid", this.draftSysGuid);

    const payload = {
      'prospectid': this.draftSysGuid || '',
      'name': this.prospectAccForm.value.name || '', // hard code 
      'odslegalentityname': this.prospectAccForm.value.legalentity || '',
      'parentaccount': this.accountCreationObj['parentaccount'] || '',//this.parentNameId,
      // 'currencyaccount': this.accountCreationObj['currencyaccount'] || '',
      'ultimateparent': this.accountCreationObj['ultimateparent'] || '', //this.UltimateparentId,
      'headquarters': this.prospectAccForm.value.headquarters || '',
      'countrycode': this.prospectAccForm.value.countrycode || '',
      'citystring': this.prospectAccForm.value.city || '',
      'countrystring': this.prospectAccForm.value.country || '',
      'address': this.prospectAccForm.value.address || '',
      'phonenumber': this.prospectAccForm.value.phonenumber || '',
      'website': this.prospectAccForm.value.website || '',
      'email': this.prospectAccForm.value.email || '',
      'businessdescription': this.prospectAccForm.value.businessdescription || '',
      'employees': this.prospectAccForm.value.employees || '',
      'sicdescription': this.prospectAccForm.value.sicdescription || '',
      'stockindexmembership': this.prospectAccForm.value.stockindexmembership || '',
      'tickersymbol': this.prospectAccForm.value.tickersymbol || '',
      'currency': this.accountCreationObj['currency'] || '',
      'fortune': parseFloat(this.prospectAccForm.value.fortune) || '',
      'profits': parseFloat(this.prospectAccForm.value.profits) || '',
      'revenue': parseFloat(this.prospectAccForm.value.revenue) || '',
      'operatingmargins': parseFloat(this.prospectAccForm.value.operatingmargins) || '',
      'marketvalue': parseFloat(this.prospectAccForm.value.marketvalue) || '',
      // 'profits': +(this.prospectAccForm.value.profits).replace(/,/g, '') || '',
      // 'revenue': +(this.prospectAccForm.value.revenue).replace(/,/g, '') || '',
      // 'operatingmargins': +(this.prospectAccForm.value.operatingmargins).replace(/,/g, '') || '',
      'returnonequity': parseFloat(this.prospectAccForm.value.returnonequity) || '',
      'entitytype': parseFloat(this.prospectAccForm.value.entitytype) || '',
      'creditscore': parseFloat(this.prospectAccForm.value.creditscore) || '',
      'ownershiptype': parseFloat(this.prospectAccForm.value.ownershiptype) || '',
      'owner': this.accountCreationObj['owner'] || '',//this.formsData.ownerid,
      'isswapaccount': (this.accountCreationObj['swapaccount']) ? this.OwnDetailsForm.value.isswapaccount : false,
      'swapaccount': (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccount'] : '',
      'growthcategory': parseFloat(this.OwnDetailsForm.value.growthcategory) || '',
      'coveragelevel': this.OwnDetailsForm.value.coveragelevel ? this.OwnDetailsForm.value.coveragelevel.toString() : '',
      'revenuecategory': parseFloat(this.OwnDetailsForm.value.revenuecategory) || '',
      'sbu': this.accountCreationObj['sbu'] || '',//this.SbuId,
      'vertical': this.accountCreationObj['vertical'] || '',//this.verticalId,
      'subvertical': this.accountCreationObj['subvertical'] || '', //this.subverticalId,
      'cluster': this.accountCreationObj['cluster'] || '',
      'geography': this.accountCreationObj['geography'] || '',//this.geoId,
      'region': this.accountCreationObj['region'] || '',// this.regionId,
      'country': this.accountCreationObj['country'] || '', // this.countryId,
      'state': this.accountCreationObj['state'] || '',
      'city': this.accountCreationObj['city'] || '',
      'remarks': this.OwnDetailsForm.controls.opportunity.value,
      // 'finanacialyear': this.accountCreationObj['finanacialyear'] || '', // this.FinacialyearId,
      'newagebusiness': this.accountCreationObj['newagebusiness'] || false,
      'governementaccount': this.accountCreationObj['governementaccount'] || false,
      'statuscode': postActionCode,
      'prospectnumber': '',
      'requesttype': (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isaltswapaccount) ? 3 : 1,
      // 'prospecttype': 2, /* hunitng */
      'swapaccountcomment': (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccountcomment'] : '',  //this.swapaccountcomment,
      //   'parentsdunsid': 'a8246c1d-5030-e911-a94f-000d3aa053b9',
      //   'ultimateparentsdunsid': 'a8246c1d-5030-e911-a94f-000d3aa053b9'
      'createby': this.loggedUser || '',
      'alternateaccountowner': this.accountCreationObj['alternateaccountowner'] || '',
      'alternateswapaccount': (this.OwnDetailsForm.value.altswapaccount) ? this.accountCreationObj['alternateswapaccount'] : '',
      'isalternateswapaccount': (this.OwnDetailsForm.value.isaltswapaccount) ? this.accountCreationObj['isalternateswapaccount'] : '',

    };
    console.log(payload);

    const postObj = this.postObjValidator(payload);
    // postObj["prospectid"] = '';
    // console.log();

    return postObj;
    // return this.payload;
  }
  getlegalentitiy(data) {
    console.log("legalentity data", data)
    this.prospectAccForm.controls['name'].setValue(data)
  }

  restrictspace1(e, value) {
    console.log("restrict space", e)
    switch (value) {
      // case 'legalentity':
      //   {
      //     if (e.which === 32 && !this.prospectAccForm.value.legalentity.length)
      //       e.preventDefault();
      //       return;
      //   }
      // case 'accountname':
      //   {
      //     if (e.which === 32 && !this.prospectAccForm.value.name.length)
      //       e.preventDefault();
      //       return;
      //   }
      case 'phone':
        {
          if (e.which === 32 && !this.prospectAccForm.value.phonenumber.length)
            e.preventDefault();
          return;
        }
    }

  }
  getCurencySymbol(data) {
    const cur = unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    // this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
    return cur;
  }
  creataAccount(postObj) {
    /*  Camunda api testing starts
    
        let token = localStorage.getItem('token').toString()
    let encrPayload = this.EncrDecr.set(token.substring(0, 32), JSON.stringify(postObj), "DecryptionDecrip");
    console.log('after encryption---->', encrPayload);
        let encryptedPostObj =this.EncrDecr.set('EncryptionEncryptionEncryptionEn',JSON.stringify(postObj), 'DecryptionDecrip');
        console.log("encryptedPostObj", encryptedPostObj);
        let decryptedpostobj = this.EncrDecr.get('EncryptionEncryptionEncryptionEn',encryptedPostObj, 'DecryptionDecrip');
        console.log("decryptedpostobj", decryptedpostobj);
        
        Camunda api testing ends */

    this.isLoading = true;
    this.accountListService.createAccount(postObj).subscribe((result: any) => {
      // console.log("print result", result);
      this.isLoading = false;
      if (result['status'] === 'success') {
        const obj: any = {
          'SysGuid': result.data[0].prospectid,
          'ProcessGuid': result.data[0].processinstanceid
        };
        this.accountListService.UpdateCamundatoCRM(obj).subscribe(res => {
          // console.log(res);
          this.router.navigate(['/accounts/accountcreation/activerequest']);
          this.clearAutoSaveDate();
        });

        this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
        this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
        this.store.dispatch(new reserveAccountClear({ ReserveListModel: {} }));
        this.snackBar.open(result.data[0].Status, '', {
          duration: 5000
        });
        this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
        this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
        this.store.dispatch(new reserveAccountClear({ ReserveListModel: {} }));

      } else {
        this.isLoading = false;
        this.snackBar.open(result['Message'], '', {
          duration: 3000
        });
      }
    }, error => {
      this.isLoading = false;
    });
  }
  clearAutoSaveDate() {
    let uniqueKey = 'createaccountProspect_' + this.loggedUser;
    this.accountListService.clearAutoSaveData(uniqueKey).subscribe(res => {

      if (!res.IsError) {
        // console.log("SUCESSFULLY DELETED AUTO SAVE")
      }
    }, error => {
      // console.log(error)
    });
  }
  saveData(act) {
    // this.postActionCode = 184450005;
    // call uday 
    //  this.creataAccount(this.setPostObj(this.postActionCode));
  }


  onSubmit() {
    // debugger
    //  window.scrollTo(0, 0);
    console.log(this.OwnDetailsForm);
    console.log(this.accountCreationObj);

    // console.log("pay;oad for custom  ", this.payload);
    this.clearFormFiled(this.OwnermandtFiled, this.OwnDetailsForm);

    if (this.OwnDetailsForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,mat-select.ng-invalid,input.ng-invalid');
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // if (invalidElements.length > 0) {
      invalidElements.focus();
      //   // this.scrollTo(invalidElements[0]);
      // }
      return;
    } else if (this.accountCreationObj['sbu']) {
      let sbuexist;
      this.accountListService.CheckSBUSESpocs(this.accountCreationObj['sbu'], this.accountCreationObj['geography'], this.accountCreationObj['country']).subscribe(res => {
        // console.log("checksbus", res)
        if (res.ResponseObject) {
          sbuexist = res.ResponseObject;
          // console.log("issbuexist", sbuexist);
          if (sbuexist)
            this.checkFlag();
        } else {
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
            // 'Owner': this.accountCreationObj['owner'],
            'Requesttype': (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isaltswapaccount) ? 'create and swap' : 'Account creation',
            // 'swapingrequest': true
            'Status': 'NA'
          }
        });

    }
    else {
      this.openSubmitPopup();
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
  saveToDraft() {
    const requestpayload = this.setPostObj(this.postActionCode);

    // console.log("Next", requestpayload);

    const obj = {
      SysGuid: this.draftSysGuid ? this.draftSysGuid : '', // first time, it will be empty. Once the sysguid available, need to paas that
      Name: requestpayload.name,
      LegalEntity: requestpayload.odslegalentityname,
      ParentAccount: {
        'SysGuid': requestpayload.parentaccount,
        'DUNSID': ''
      },
      CurrencyAccount: {
        'SysGuid': requestpayload.currency,
        'DUNSID': ''
      },
      UltimateParentAccount: {
        'SysGuid': requestpayload.ultimateparent,
        'DUNSID': ''
      },
      HeadQuarters: requestpayload.headquarters,
      Address: {
        CountryCode: requestpayload.countrycode,
        Address1: requestpayload.address,
        City: {
          'SysGuid': '',
        },
        CityString: requestpayload.citystring,
        CountryString: requestpayload.countrystring,
        Country: {
          'SysGuid': '',
        },
        State: {
          'SysGuid': '',
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
      CreditScore: requestpayload.creditscore,
      OwnershipType: {
        'Id': requestpayload.ownershiptype
      }
    };

    // obj['Statuscodes'] = 184450005;
    // console.log("data to be posted", obj);
    this.account1 = obj.Name;

    this.accountListService.draftCreate(obj).subscribe((result: any) => {
      // console.log("save step1 result", result);
      if (!result.IsError) {
        this.draftSysGuid = result.ResponseObject.SysGuid;
        this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
        // this.snackBar.open(result.Message, '', {
        //   duration: 2000
        // })

      }
      // if (!result.IsError){
      //   this.snackBar.open(result.Message, '', {
      //     duration: 2000
      //   })
      // }



    });

  }
  draftSysGuid: any;

  ///--------------------------------api integartion for coustom accout ---------------------------------------------
  getCurrency() {
    this.master3Api.getCurrency().subscribe(res => {
      this.currencyvalue = res.ResponseObject;
      // console.log("currency reaponsr ", this.currencyvalue)
    });
  }
  getownershiptype() {
    this.master3Api.getProspectOwnerShipType().subscribe(res => {
      this.ownershiptypevalue = res.ResponseObject;
      // console.log("ownershiptype", this.ownershiptypevalue)
    });
  }
  getEntitytype() {
    this.master3Api.getEntityType().subscribe(res => {
      this.entitytypevalue = res.ResponseObject;
      // console.log("entitytype", this.entitytypevalue)
    });
  }
  getgrowthcategory() {
    this.master3Api.GetGrowthCategory().subscribe(res => {
      if (!res.IsError && res.ResponseObject) {
        this.growthCatagoryvalue = res.ResponseObject;
        if (res.ResponseObject.length === 0)
          this.growthCatagoryvalue['message'] = 'No record found';
      } else {
        this.growthCatagoryvalue['message'] = 'No record found';
      }

    });
  }
  getcoveragelevel() {
    this.master3Api.GetCoverageLevel().subscribe(res => {
      if (!res.IsError && res.ResponseObject) {
        this.coveragelevelvalue = res.ResponseObject;
        // console.log("coveragelevel,", this.coveragelevelvalue)
        if (res.ResponseObject.length === 0)
          this.coveragelevelvalue['message'] = 'No record found';
      } else {
        this.coveragelevelvalue['message'] = 'No record found';
      }
    });
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
    });
  }
  // GetGeobyName()
  // {
  //   this.apiservice.getGeo().subscribe(res =>
  //     {

  //        this.wiproContact2 = res.ResponseObject
  //        console.log("geo value "  ,this.wiproContact2)
  //     })
  // }

  /////////////////=================api call s===================================

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
      this.OwnDetailsForm.get('city').setValidators([]);
      this.OwnDetailsForm.get('state').setValidators([]);
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
    } else {
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
          this.createDropDown['geography'] = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            this.createDropDown['geography'] = [];
            // this.OwnDetailsForm.controls['geography'].setValue('');
            this.createDropDown['geography']['message'] = 'No record found';
            // this.wiproContact2['message'] = 'No record found';
          }
        } else {
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

  // appendgeo(item) {
  //   console.log("value", item)
  //   this.geo = item.Name;
  //   this.geoId = item.SysGuid;
  //   console.log("value of geo", this.geoId)
  // }
  //==================================directy api for country=====================================
  // getCountryByName(event) {
  //   console.log("countryevent",event)
  //   var countryname = this.apiservice.getCountry();
  //   countryname.subscribe((res : any)  => {
  //     console.log("countrydata ",res.ResponseObject)
  //     this.countrybyname = res.ResponseObject
  //   })
  // } 
  // getStateByName(event)
  // {
  //   console.log("state",event);
  //   var statename = this.apiservice.getStateByName(event.target.value);
  //   statename.subscribe((res : any) => {
  //     console.log("statedata",res.ResponseObject)
  //     this.statebyname = res.ResponseObject
  //   })

  // }
  // getcitybyname()
  // {
  //   var cityname = this.apiservice.getCity();
  //     cityname.subscribe(res=>
  //       {
  //         console.log("cityname",res.ResponseObject)
  //         this.wiproCity1 = res.ResponseObject
  //       })
  // }
  // getsbuandvertical(event)
  // {
  //   this.sbuArray =[]
  //   console.log("this.sbuArray.length ::: ",this.sbuArray.length);
  //  this.apiservice.getsbuandvertical(event.target.value).subscribe((res: any) =>
  //     {
  //       console.log("sbu",res.ResponseObject)
  //       // res.ResponseObject.forEach((element:any) => {
  //       //   this.sbuArray.push(element.SBU);
  //       // });
  //       //const sbuArr = res.ResponseObject;
  //       for(var i = 0; i<res.ResponseObject.length; i++){

  //         this.sbuArray.push(res.ResponseObject[i].SBU)
  //       }
  //       console.log("sbuarray",this.sbuArray)
  //     })
  //   let searchSbuName = event.target.value;
  //   let newSbu = [];
  //   for(var i = 0; i<this.sbuArray.length; i++){
  //         if(this.sbuArray[i].Name.includes(searchSbuName)){
  //           newSbu.push(this.sbuArray[i])
  //         }
  //   }
  // const newSbu = this.sbuArray.filter(val => {
  //   return val.Name === searchSbuName;
  // });
  //     console.log("fggggggggg",newSbu);

  //     this.sbuArray = newSbu;

  // }


  // getvertical(event) {
  //   this.wiproContact = [];
  //   console.log("vertical", event);
  //   if (event.target.value !== '') {
  //     let vertical = this.master3Api.getsbuandvertical(event.target.value);
  //     vertical.subscribe((res: any) => {
  //       console.log("statedata", res.ResponseObject);
  //       if (!res.IsError && res.ResponseObject) {
  //         this.wiproContact = res.ResponseObject;
  //         if (res.ResponseObject.length == 0) {
  //           this.OwnDetailsForm.controls['vertical'].setValue('');
  //           this.wiproContact['message'] = 'No record found';
  //         }
  //       }
  //       else {
  //         this.OwnDetailsForm.controls['vertical'].setValue('');
  //         this.wiproContact['message'] = 'No record found';
  //       }
  //     })
  //   }
  // }

  getregionbygeo(event) {

    // this.OwnDetailsForm.get('city').setValidators([Validators.required]);
    // this.OwnDetailsForm.get('state').setValidators([Validators.required]);
    // this.customValidators['state'] = true;
    // this.customValidators['city'] = true;
    // console.log(this.accountCreationObj);

    this.createDropDown['region'] = [];
    this.location_temp = [];
    let region;
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      const temp = ['region', 'country', 'state', 'city'];
      // this.clearPostObject(this.accountCreationObj, temp);
      // this.clearFormFiled(temp, this.OwnDetailsForm);
      this.getAllSwapAccount(this.accountCreationObj['owner'], '');
      this.OwnDetailsForm.get('city').setValidators([]);
      this.OwnDetailsForm.get('state').setValidators([]);
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;

    } else {
      this.isActivityGroupSearchLoading = true;
      if (event === '') {
        const temp = ['region', 'country', 'state', 'city'];
        const formField = ['country', 'state', 'city'];
        // this.clearPostObject(this.accountCreationObj, temp);
        // this.clearFormFiled(formField, this.OwnDetailsForm);
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }


      if (this.userdat.searchFieldValidator(this.accountCreationObj['geography']))
        region = this.master3Api.getregionbygeo(this.accountCreationObj['geography'], event);
      else
        region = this.master3Api.GetAllByRegion(event);
      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("geobyreagion response", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.accountCreationObj['geography'])) {
            this.createDropDown.region = res.ResponseObject;
            this.createDropDown.advanceLookupRegion = res.ResponseObject;
          } else {
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
        } else {
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
  // appendregion(item) {
  //   this.contactName3 = item.Name;
  //   this.regionId = item.SysGuid
  //   // this.selectedContact3.push(this.wiproContact3[i])
  // }
  CountryByRegion(event) {
    // this.OwnDetailsForm.get('city').setValidators([Validators.required]);
    // this.OwnDetailsForm.get('state').setValidators([Validators.required]);
    // this.customValidators['state'] = true;
    // this.customValidators['city'] = true;

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
      this.OwnDetailsForm.get('city').setValidators([]);
      this.OwnDetailsForm.get('state').setValidators([]);
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
    } else {
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
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          // if (this.userdat.searchFieldValidator(this.accountCreationObj['region'])) {
          //   this.createDropDown['country'] = res.ResponseObject;
          //   this.createDropDown['advanceLookupCountry'] = res.ResponseObject;
          //   // advanceLookupCountry

          // } else {
          this.location_temp = res.ResponseObject;
          const temp1 = ['geography', 'region'];
          // this.clearPostObject(this.accountCreationObj, temp1);
          // this.clearFormFiled(temp1, this.OwnDetailsForm);
          this.createDropDown['country'] = [];
          this.createDropDown['advanceLookupCountry'] = res.ResponseObject;
          res.ResponseObject.map(data => {
            this.createDropDown['country'].push(data.Country);
          });
          //}
          if (res.ResponseObject.length === 0) {
            // this.clearFormFiled(temp, this.OwnDetailsForm);
            // this.clearPostObject(this.accountCreationObj, temp);
            this.createDropDown['country'] = [];
            this.createDropDown['advanceLookupCountry'] = [];
            this.createDropDown['country']['message'] = 'No record found';
          }
        } else {
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
    // debugger
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
      if (event === '') {
        const formFiled = ['city'];
        const temp = ['state', 'city'];
        // this.clearFormFiled(formFiled, this.OwnDetailsForm);
        // this.clearPostObject(this.accountCreationObj, temp);
      }

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
            this.location_temp = res.ResponseObject;
            this.createDropDown['advanceLookupState'] = res.ResponseObject;
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
  onInputChange(data, ctrName) {
    let remComa = data.replace(/,/g, '')
    const formatter = new Intl.NumberFormat().format(remComa);
    return this.prospectAccForm.controls[ctrName].patchValue(formatter);
  }
  onLoadChange(data) {
    return new Intl.NumberFormat().format(data);
  }

  getCityByState(event) {
    // if (val == '') {
    //   this.assignmentObj['City'] = {};
    // }
    const cityControl = this.OwnDetailsForm.get('city');
    // cityControl.setValidators([Validators.required]);
    // this.cityCountryValid = true;
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
    } else {
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
          if (this.userdat.searchFieldValidator(this.accountCreationObj['state'])) {
            this.createDropDown['city'] = res.ResponseObject;
            this.createDropDown['advanceLookupCity'] = res.ResponseObject;
            this.location_temp = res.ResponseObject;

          } else {
            const temp1 = ['geography', 'region', 'country', 'state'];
            // this.clearPostObject(this.accountCreationObj, temp1);
            // this.clearFormFiled(temp1, this.OwnDetailsForm);
            this.createDropDown['city'] = [];
            this.location_temp = res.ResponseObject;
            this.createDropDown['advanceLookupCity'] = res.ResponseObject;
            res.ResponseObject.map(data => {
              this.createDropDown['city'].push(data.City);
            });
          }
          if (res.ResponseObject.length === 0) {
            if (!(this.OwnDetailsForm.value.country.toLowerCase() === 'india' || this.OwnDetailsForm.value.country.toLowerCase() === 'united kingdom' || this.OwnDetailsForm.value.country.toLowerCase() === 'united states' || this.OwnDetailsForm.value.country.toLowerCase() === 'usa' || this.OwnDetailsForm.value.country.toLowerCase() === 'us')) {
              if (this.createDropDown['city'] && this.createDropDown['city'].length <= 0) {
                cityControl.setValidators([]);
                this.customValidators['city'] = false;
                // this.cityCountryValid = false;
              }
              // else {
              //   cityControl.setValidators([Validators.required]);
              //   this.cityCountryValid = true;
              // }
            } else {
              if (this.createDropDown['city'] && this.createDropDown['city'].length > 0) {
                cityControl.setValidators([Validators.required]);
                this.customValidators['city'] = true;
                // this.cityCountryValid = false;
              }
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
      });
    }
  }
  // appendcity1(item) {
  //   this.city1Name = item.Name;
  //   this.cityId = item.SysGuid
  //   //this.selectedCity1.push(this.wiproCity1[i])
  // }
  // sbu by name 
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
  getSbuByName(event) {

    this.Sbudata = [];
    // this.clearVerSubVerical(event);


    // if (!this.userdat.searchFieldValidator(event.target.value)) {
    //event.target.value = '';
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      this.contactSBUclose();
      this.OwnDetailsForm.controls['sbu'].setValue('');

    } else {
      this.isActivityGroupSearchLoading = true;
      // if (event.target.value !== '') {
      const sbubyname = this.master3Api.getSBUByName(event);
      sbubyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("sbuby name response", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          this.Sbudata = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            this.Sbudata = [];
            this.Sbudata['message'] = 'No record found';
          }
        } else {
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
  removesubVertical(event) {
    if (event === '') {
      this.accountCreationObj['subvertical'] = '';
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      this.accountCreationObj['vertical'] = '';
      this.OwnDetailsForm.controls['vertical'].setValue('');
    }
  }
  // vertical  by passing sbuid
  getVerticalbySBUID(event) {
    this.sub_and_vertical = [];
    this.isActivityGroupSearchLoading = true;
    this.verticaldata = [];
    this.advancelookupVertical = [];

    // this.IsSubVerticalExist = true;
    // this.removesubVertical(event);
    if (!this.userdat.searchFieldValidator(event) && event !== '') {
      this.isActivityGroupSearchLoading = false;
      // if (event.target.value == '') {
      this.contactNameclose();
      // this.accountCreationObj['sbu'] = '';
      this.accountCreationObj['subvertical'] = '';
      this.accountCreationObj['vertical'] = '';
      // this.OwnDetailsForm.controls['sbu'].setValue('');
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      this.OwnDetailsForm.controls['vertical'].setValue('');
    } else {
      let vertical;
      // if (event.target.value !== '') {
      if (this.userdat.searchFieldValidator(this.accountCreationObj['sbu']))
        // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
        vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], event);
      else
        vertical = this.master3Api.SearchVerticalAndSBU(event);

      vertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("verticalby sbuid ", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.accountCreationObj['sbu'])) {
            this.verticaldata = res.ResponseObject;
            this.advancelookupVertical = res.ResponseObject;
            // console.log("verticaldata", this.verticaldata)
          } else {
            this.sub_and_vertical = res.ResponseObject;
            this.accountCreationObj['sbu'] = '';
            this.OwnDetailsForm.controls['sbu'].setValue('');
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
        } else {
          // this.OwnDetailsForm.controls['vertical'].setValue('');
          this.verticaldata = [];
          this.advancelookupVertical = [];
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
      // if (event.target.value == '') {
      // this.accountCreationObj['sbu'] = '';
      this.accountCreationObj['subvertical'] = '';
      // this.accountCreationObj['vertical'] = '';
      // this.OwnDetailsForm.controls['sbu'].setValue('');
      this.OwnDetailsForm.controls['subvertical'].setValue('');
      // this.OwnDetailsForm.controls['vertical'].setValue('');
    } else {
      let subvertical;
      // console.log(this.accountCreationObj['vertical']);
      this.isActivityGroupSearchLoading = true;

      if (this.userdat.searchFieldValidator(this.accountCreationObj['vertical']))

        subvertical = this.master3Api.getSubVerticalByVertical(this.accountCreationObj['vertical'], event);
      else
        subvertical = this.master3Api.SearchAllBySubVertical(event);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log("response for subvertical", res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (!res.IsError && res.ResponseObject) {
          if (this.userdat.searchFieldValidator(this.accountCreationObj['vertical'])) {
            this.subverticaldata = res.ResponseObject;
            this.advancesubverticaldata = res.ResponseObject;

          } else {
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
            // console.log(this.subverticaldata);
          }
          if (res.ResponseObject.length === 0) {
            this.OwnDetailsForm.controls['subvertical'].setValue('');
            this.subverticaldata = [];
            this.advancesubverticaldata = [];
            this.subverticaldata['message'] = 'No record found';
          }
        } else {
          this.OwnDetailsForm.controls['subvertical'].setValue('');
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

  getcluster(event) {
    const cluster = this.master3Api.getcluster(this.OwnDetailsForm.controls['sbu'].value, event);
    cluster.subscribe((res: any) => {  
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';   
      if (res.ResponseObject.length === 0) {
        this.clusterdata = [];
        this.cluster['message'] = 'No record found';
      }else
      {
        this.clusterdata = res.ResponseObject;
      }
      console.log("clusterdata", res)
    });
  }


  daChatApiCall() {

    if (this.sbuAccountSelected != undefined && this.DACountryandGeo != undefined) {
      let body = {
        'ProspectGuid' : this.draftSysGuid,
        "GEOGuid" : this.DACountryandGeo[0].Geo.SysGuid,
        "SBUGuid" : (this.sbuAccountSelected.Id) ? this.sbuAccountSelected.Id : this.sbuAccountSelected.SysGuid,
        "CountryGuid" : this.DACountryandGeo[0].Country.SysGuid
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

  appendcontactSBU(item) {
    this.clearVerSubVerical('');
    this.sendSbuToAdvance.push({ ...item, Id: item.Id });
    this.sbuAccountSelected = item;
    this.SbuName = item.Name;
    this.daChatApiCall();
    this.OwnDetailsForm.controls['sbu'].setValue(item.Name);
    this.accountCreationObj['sbu'] = item.Id || '';
    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || (this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE")) {
      this.enablecluster();
    }
    else this.disablecluster();
  }
  appendcluster(item) {
    this.ClusterName = item.Name;
    this.clustertoAdvLookup.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.clusterSelected = item;
    this.OwnDetailsForm.controls['cluster'].setValue(item.Name);
    this.accountCreationObj['cluster'] = item.Id || '';
  }
  disablecluster() {
    console.log("came here")
    this.OwnDetailsForm.controls['cluster'].setValue('');
    this.accountCreationObj['cluster'] = '';
    this.OwnDetailsForm.controls['cluster'].disable();
    this.isclusterexist = false;
  }
  enablecluster() {
    this.OwnDetailsForm.controls['cluster'].enable();
    this.isclusterexist = true;
  }
  appendvertical(item, index, advFlag) {
    this.removesubVertical('');
    let ind;
    if (advFlag) {
      // this.IsSubVerticalExist = item.IsSubVerticalExist;
      ind = index;
    } else {
      // this.IsSubVerticalExist = item.Vertical.IsSubVerticalExist;
      ind = this.verticaldata.findIndex(x => x.Id === item.Id);
    }
    this.IsSubVerticalExist = item.IsSubVerticalExist;
    this.sendVerticalToAdvance.push({ ...item, Id: item.Id });
    this.verticalSelected = item;
    this.OwnDetailsForm.controls['vertical'].setValue(item.Name);

    this.accountCreationObj['vertical'] = item.Id || '';


    if (this.IsSubVerticalExist === true && item.SubVertical != undefined) {
      this.OwnDetailsForm.controls['subvertical'].setValue(item.SubVertical.Name);
      this.accountCreationObj['subvertical'] = item.SubVertical.Id || '';
      this.SubverticalName = item.SubVertical.Name;
      this.sendSubVerticaltoAdvance.push({ ...item, Id: item.Id });
      this.subVerticalSelected = item;
    }
    if (this.IsSubVerticalExist) {
      this.OwnDetailsForm.get('subvertical').setValidators([Validators.required]);
      this.customValidators['subvertical'] = true;
    } else {
      this.OwnDetailsForm.get('subvertical').setValidators([]);
      this.customValidators['subvertical'] = false;
    }
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) {
      this.SbuName = this.sub_and_vertical[ind]['SBU']['Name'];
      this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
    }

    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE")
      this.enablecluster();
    else
      this.disablecluster();
  }

  appendsubvertical(item, index, advFlag) {
    let ind;
    if (advFlag) {
      ind = index;
    } else {
      ind = this.subverticaldata.findIndex(x => x.Id === item.Id);
    }
    this.sendSubVerticaltoAdvance.push({ ...item, Id: item.Id });
    this.subVerticalSelected = item;
    // console.log(this.sub_and_vertical);

    this.OwnDetailsForm.controls['subvertical'].setValue(item.Name);
    this.accountCreationObj['subvertical'] = item.Id || '';

    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Id'])) this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'SBU', 'Name'])) {
      this.SbuName = this.sub_and_vertical[ind]['SBU']['Name'];
      this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
    }


    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Id'])) this.accountCreationObj['vertical'] = this.sub_and_vertical[ind]['Vertical']['Id'];
    if (this.userdat.validateKeyInObj(this.sub_and_vertical, [ind, 'Vertical', 'Name'])) {
      this.VerticalName = this.sub_and_vertical[ind]['Vertical']['Name'];
      this.OwnDetailsForm.controls['vertical'].setValue(this.sub_and_vertical[ind]['Vertical']['Name']);
    }
    if ((this.OwnDetailsForm.controls['sbu'].value === "INDIA PRE") || this.OwnDetailsForm.controls['sbu'].value === "INDIA SRE") {
      this.enablecluster();
    }
    else {
      this.disablecluster();
    }


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
          // this.OwnDetailsForm.controls['city'].enable();
          this.removeSeletecedValue('OwnDetailsForm', 'state', 'state')
          break;
        }
      case 'city':
        this.removeSeletecedValue('OwnDetailsForm', 'city', 'city');
        break;
      case 'sbu':
        this.disablecluster();
        this.removesubVertical('');
        this.clearVerSubVerical('');
        this.removeSeletecedValue('OwnDetailsForm', 'sbu', 'sbu')
        break;
      case 'vertical':
        this.removesubVertical(''); this.removeSeletecedValue('OwnDetailsForm', 'vertical', 'vertical');
        break;
      case 'subvertical':
        this.removeSeletecedValue('OwnDetailsForm', 'subvertical', 'subvertical');
        break;
      case 'cluster':
        this.removeSeletecedValue('OwnDetailsForm', 'cluster', 'cluster');
        break;
    }

  }
  appendgeo(item) {

    this.sendGeographytoAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.geographySelected = item;
    this.geoName = item.Name;
    this.OwnDetailsForm.controls['geography'].setValue(item.Name);
    this.accountCreationObj['geography'] = item.SysGuid || '';
    const formField = ['region', 'country', 'state', 'city'];
    const temp = ['region', 'country', 'state', 'city'];
    this.clearPostObject(this.accountCreationObj, temp);
    this.clearFormFiled(formField, this.OwnDetailsForm);
  }
  appendregion(item, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.location_temp.findIndex(x => x.Region.SysGuid === item.Region.SysGuid);
      // i = this.createDropDown['region'].findIndex(x => x.Id ? x.Id : x.SysGuid === item.Id ? item.Id : item.SysGuid);
    }
    // console.log(this.location_temp);
    this.sendRegiontoAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.regionSelected = item;
    this.regionName = item.Name;
    this.OwnDetailsForm.controls['region'].setValue(item.Name);
    this.accountCreationObj['region'] = item.SysGuid || '';

    const temp = ['country', 'state', 'city'];
    const formField = ['country', 'state', 'city'];
    this.clearPostObject(this.accountCreationObj, temp);
    this.clearFormFiled(formField, this.OwnDetailsForm);

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.geoName = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    }
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
  DACountryandGeo : any;
  appendcountry1(item, index, advFlag) {
    // if (item && !item.isExists) {
    //   this.OwnDetailsForm.controls['state'].disable();
    //   this.OwnDetailsForm.controls['city'].disable();
    // } else {
    //   this.OwnDetailsForm.controls['state'].enable();
    //   this.OwnDetailsForm.controls['city'].enable();
    // }
    let i;
    if (advFlag) {
      i = index;
      this.disableStateAndCity(item, item.isExists);
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
    this.countryFieldName = item.Name;
    const cityControl = this.OwnDetailsForm.get('city');
    this.DACountryandGeo =this.location_temp.filter(x => x.Country.SysGuid == item.SysGuid);
    this.daChatApiCall();
    // console.log(cityControl);
    // console.log(cityControl.errors);
    // console.log(cityControl.setValidators);
    // this.clearStateAndCity(item)
    const stateControl = this.OwnDetailsForm.get('state');
    const counryName = item.Name.toLowerCase();
    if (!(counryName === 'india' || counryName === 'united kingdom' || counryName === 'united states' || counryName === 'usa' || counryName === 'us')) {
      // cityControl.setValidators([]);
      // stateControl.setValidators([]);
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
      // cityControl.errors.required = false;
      // cityControl.clearValidators();
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();

    } else {
      this.customValidators['state'] = true;
      this.customValidators['city'] = true;
      // cityControl.errors.required = true;
      // this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      // this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      // cityControl.setValidators([Validators.required]);
      // stateControl.setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();

    }
    this.OwnDetailsForm.controls['country'].setValue(item.Name);
    this.accountCreationObj['country'] = item.SysGuid || '';

    if (this.accountCreationObj['country']) {
      this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.regionName = this.location_temp[i]['Region'].Name;
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.geoName = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    }
  }
  disabelCity(item,isExists)
  {
    if (item && !item.isExists) {
      this.OwnDetailsForm.controls['city'].disable();
    } else {
      this.OwnDetailsForm.controls['city'].enable();
    }
    
  }
  appendState(item, index, advFlag) {
  
    let i;
    if (advFlag) {
      i = index;
      this.disabelCity(item,item.isExists)
    } else {
      if (item.State) {
        this.disabelCity(item,item.State.isExists)
        i = this.location_temp.findIndex(x => x.State.SysGuid === item.State.SysGuid);
      } else {
        this.disabelCity(item,item.isExists)
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
    this.customValidators['state'] = true;
    stateControl.setValidators([Validators.required]);

    const formFiled = ['city'];
    const temp = ['city'];
    this.clearFormFiled(formFiled, this.OwnDetailsForm);
    this.clearPostObject(this.accountCreationObj, temp);

    let countryname = this.OwnDetailsForm.controls['country'].value.toLowerCase();
    if (!(countryname === 'india' || countryname === 'united kingdom' || countryname === 'united states' || countryname === 'usa' || countryname === 'us')) {
      this.customValidators['state'] = false;
      this.customValidators['city'] = false;
      this.OwnDetailsForm.controls['state'].setValidators([]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
    } else {
      this.customValidators['state'] = true;
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['state'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['state'].updateValueAndValidity();
      this.OwnDetailsForm.controls['city'].setValidators([Validators.required]);
      this.OwnDetailsForm.controls['city'].updateValueAndValidity();
    }
    if (this.accountCreationObj['state'] && !item.isExists) {
      // console.log("indsdfgfffffffffffffffffffg");
      this.OwnDetailsForm.controls['city'].disable();
      this.customValidators['city'] = false;
      cityControl.setValidators([]);
    } else if (this.accountCreationObj['state'] && item.isExists && (countryname === 'india' || countryname === 'united kingdom' || countryname === 'united states' || countryname === 'usa' || countryname === 'us')) {
      this.customValidators['city'] = true;
      this.OwnDetailsForm.controls['city'].enable();
      cityControl.setValidators([Validators.required]);
      this.customValidators['state'] = true;
      stateControl.setValidators([Validators.required]);
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
      // let countryFlag = counryName == "india" || counryName == "united kingdom" || counryName == "united states" || counryName == "usa" || counryName == "us";
      // if (countryFlag) {
      //   this.cityCountryValid = countryFlag;
      // }

      // if (!(counryName == "india" || counryName == "united kingdom" || counryName == "united states" || counryName == "usa" || counryName == "us")) {
      //   this.customValidators['city'] = false;
      //   cityControl.setValidators([]);
      // }
      // else {
      //   this.customValidators['city'] = true;
      //   cityControl.setValidators([Validators.required]);
      // }
      this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.regionName = this.location_temp[i]['Region'].Name;
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.geoName = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
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
    this.cityNameField = item.Name;
    this.OwnDetailsForm.controls['city'].setValue(item.Name);
    this.accountCreationObj['city'] = item.SysGuid || '';

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'SysGuid'])) this.accountCreationObj['state'] = this.location_temp[i]['State'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'State', 'Name'])) {
      this.stateName = this.location_temp[i]['State'].Name;
      this.OwnDetailsForm.controls['state'].setValue(this.location_temp[i]['State'].Name);
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) {
      this.accountCreationObj['country'] = this.location_temp[i]['Country'].SysGuid;
      if (this.accountCreationObj['country']) {
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
        // this.getHuntingCount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
      }
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) {
      this.countryFieldName = (this.location_temp[i]['Country'].Name).toLowerCase();
      const counryName = (this.location_temp[i]['Country'].Name).toLowerCase();
      // let countryFlag = counryName === "usa" || counryName === "india" || counryName === "uk";
      // if (countryFlag) {
      //   this.cityCountryValid = countryFlag;
      // }
      const stateControl = this.OwnDetailsForm.get('state');
      const cityControl = this.OwnDetailsForm.get('city');
      if (!(counryName === 'india' || counryName === 'united kingdom' || counryName === 'united states' || counryName === 'usa' || counryName === 'us')) {
        stateControl.setValidators([]);
        this.customValidators['state'] = false;
      } else {
        stateControl.setValidators([Validators.required]);
        this.customValidators['state'] = true;
        cityControl.setValidators([Validators.required]);
        this.customValidators['city'] = true;
      }

      this.OwnDetailsForm.controls['country'].setValue(this.location_temp[i]['Country'].Name);
    }

    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.accountCreationObj['region'] = this.location_temp[i]['Region'].SysGuid;
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) {
      this.regionName = this.location_temp[i]['Region'].Name;
      this.OwnDetailsForm.controls['region'].setValue(this.location_temp[i]['Region'].Name);
    }
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.accountCreationObj['geography'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) {
      this.geoName = this.location_temp[i]['Geo'].Name;
      this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);
    }
    // if (this.userdat.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.OwnDetailsForm.controls['geography'].setValue(this.location_temp[i]['Geo'].Name);

  }
  // appendFinacialyear(item) {
  //   this.OwnDetailsForm.controls['finanacialyear'].setValue(item.Name);
  //   this.accountCreationObj['finanacialyear'] = item.SysGuid || '';
  // }

  appendparent(item) {
    // this.parentName = item.Name;
    // this.parentNameId = item.SysGuid;
    this.ParentAccountSelected = item;
    this.sendParentAccountNameToAdvance = [{ ...item, Id: item.Id ? item.Id : item.SysGuid }];
    this.prospectAccForm.controls['parentaccount'].setValue(this.getSymbol(item.Name));
    // this.prospectAccForm.controls['employees'].setValue(item.Number);

    this.ParentAccountName = this.getSymbol(item.Name);
    this.accountCreationObj['parentaccount'] = item.SysGuid || '';
    //this.selectedparent.push(this.wiproparent[i])
    this.getultimateparentbyparent(item.SysGuid);
  }

  getultimateparentbyparent(id) {
    this.master3Api.getUltimateParentByParent(id).subscribe((res: any) => {
      // test the load
      console.log("response of ultimate parent by parent", res.ResponseObject);
      if (!res.IsError) {
        this.prospectAccForm.controls['ultimateparent'].setValue(this.getSymbol(res.ResponseObject[0].UltimateParentAccount.Name))
        this.accountCreationObj['ultimateparent'] = res.ResponseObject[0].UltimateParentAccount.SysGuid;
      }

    });
  }
  appendcurrency(item) {
    this.sendCurrencytoAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.currencySelected = item;
    this.CurrencyData = item.Desc;
    // this.parentName = item.Name;
    // this.parentNameId = item.SysGuid;
    this.prospectAccForm.controls['currency'].setValue(item.Desc);
    this.accountCreationObj['currency'] = item.Id || '';
    //this.selectedparent.push(this.wiproparent[i])
  }
  appendultimateparent(item) {
    this.ultimateParentAccountName = item.Name;
    this.ultimateParentAccountSelected = item;
    this.sendUltimateAccountAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.prospectAccForm.controls['ultimateparent'].setValue(item.Name);
    this.accountCreationObj['ultimateparent'] = item.SysGuid || '';
  }

  setGovtAc(e) {
    console.log(e);

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
      console.log('value of e.checked', e.checked);
      this.OwnDetailsForm.controls['swapaccount'].enable();
      this.OwnDetailsForm.get('swapaccount').setValidators([Validators.required]);
      this.OwnDetailsForm.controls['isaltswapaccount'].disable();
      this.OwnDetailsForm.controls['altowner'].disable();
      this.OwnDetailsForm.controls['altswapaccount'].disable();
      this.accountCreationObj['isaltswapaccount'] = false;
      this.altHuntingRatio = undefined;
      this.OwnDetailsForm.controls['isaltswapaccount'].setValue(false);
      this.OwnDetailsForm.controls['altowner'].setValue('');
      this.OwnDetailsForm.controls['altswapaccount'].setValue('');
      this.accountCreationObj['altswapaccount'] = '';
      this.accountCreationObj['altowner'] = '';
    }
    else {
      if (this.huntingRatio >= 8) this.OwnDetailsForm.controls['isaltswapaccount'].enable();
      else this.OwnDetailsForm.controls['isaltswapaccount'].disable();
      this.accountCreationObj['swapaccount'] = '';
      this.OwnDetailsForm.controls['swapaccount'].setValue('');
      this.OwnDetailsForm.controls['swapaccount'].disable();
      this.OwnDetailsForm.get('swapaccount').clearValidators();
    }
  }
  isAltSwapAccount(e) {
    console.log("isaltswapaccount value is ", this.OwnDetailsForm.controls['isaltswapaccount'])
    this.searchAltAccount = e.checked;
    this.OwnDetailsForm.controls['isaltswapaccount'].setValue(e.checked);
    this.accountCreationObj['isalternateswapaccount'] = e.checked;
    if (!e.checked) {
      debugger;
      this.altHuntingRatio = undefined;
      this.accountCreationObj['altowner'] = '';
      this.OwnDetailsForm.controls['altowner'].setValue('');
      this.OwnDetailsForm.controls['altowner'].disable();
      this.OwnDetailsForm.get('altowner').clearValidators();
      this.accountCreationObj['altswapaccount'] = '';
      this.OwnDetailsForm.controls['altswapaccount'].setValue('');
      this.OwnDetailsForm.controls['altswapaccount'].disable();
      this.OwnDetailsForm.get('altswapaccount').clearValidators();
    }
    else {
      if (!this.accountCreationObj['altowner']) {
        this.altHuntingRatio = undefined;
      }
      console.log('value of e.checked', e.checked);
      this.OwnDetailsForm.controls['altowner'].enable();
      this.OwnDetailsForm.get('altowner').setValidators([Validators.required]);
      // this.OwnDetailsForm.controls['altswapaccount'].enable();
      this.OwnDetailsForm.get('altswapaccount').setValidators([Validators.required]);
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
  // getFinancialYear(event) {
  //   if (event.target.value !== '') {
  //     this.isActivityGroupSearchLoading = true;
  //     this.financialyeardata = [];
  //     let financialyear = this.master3Api.getFinancialYear(event.target.value)
  //     financialyear.subscribe((res: any) => {
  //       this.isActivityGroupSearchLoading = false;
  //       console.log("response for finacial year ", res.ResponseObject)
  //       if (!res.IsError && res.ResponseObject) {
  //         this.financialyeardata = res.ResponseObject;
  //         if (res.ResponseObject.length == 0) {

  //           this.financialyeardata = [];
  //           this.financialyeardata['message'] = 'No record found';
  //         }
  //       }
  //       else {

  //         this.financialyeardata = [];
  //         this.financialyeardata['message'] = 'No record found';
  //       }
  //     }, error => {
  //       this.isActivityGroupSearchLoading = false;
  //       this.financialyeardata = [];
  //       this.financialyeardata['message'] = 'No record found';
  //     })
  //   }
  // }
  // appendFinacialyear(item) {
  //   this.FinacialName = item.Name;
  //   this.FinacialyearId = item.SysGuid
  //   // this.selectedFinacial.push(this.wiproFinacial[i])
  // }
  // setBussiness(e) {
  //   this.OwnDetailsForm.controls['newagebusiness'].setValue(e.checked);
  //   this.accountCreationObj['newagebusiness'] = e.checked;
  //   console.log("newagebusiness", this.accountCreationObj['newagebusiness']);

  // }
  // setGovtAc(e) {
  //   this.OwnDetailsForm.controls['governementaccount'].setValue(e.checked);
  //   this.accountCreationObj['governementaccount'] = e.checked;
  //   console.log("governamentaccount", this.accountCreationObj['governementaccount']);

  // }
  // isSwapAccount(e) {
  //   this.OwnDetailsForm.controls['isswapaccount'].setValue(e.checked);
  //   this.accountCreationObj['isswapaccount'] = e.checked;
  //   console.log(this.accountCreationObj['isswapaccount']);

  // }parentaccount
  allowNumbersOnly(e) {
    const code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
  getparentaccount(value) {
    this.parentaccount = [];
    this.accountCreationObj['parentaccount'] = '';
    // if (!this.userdat.searchFieldValidator(event.target.value)) {
    //   event.target.value = '';
    // }
    // if (this.userdat.searchFieldValidator(event.target.value)) {
    this.isActivityGroupSearchLoading = true;
    this.loader = true;
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

  // sdjshsd
  clearJubk() {
    this.prospectAccForm.controls['currency'].setValue('');

  }

  clearowner() {
    this.OwnDetailsForm.controls['owner'].setValue('');
  }
  clearaltowner() {
    this.OwnDetailsForm.controls['altowner'].setValue('');
  }
  getcurrencyaccount(event) {
    this.currencyaccount = [];
    this.accountCreationObj['currency'] = '';
    // if (!this.userdat.searchFieldValidator(event)) {
    //   event = '';
    // }
    let input = event;
    if (event !== '') {
      // input = event.target.value.replace(/ *\([^)]*\) */g, '');
      input = event.replace(/ *\([^]*\) |\([^]*\ */g, '').trim();
    }
    // if (this.userdat.searchFieldValidator(event.target.value)) {
    this.isActivityGroupSearchLoading = true;
    this.loader = true;
    const getcurrencyaccount = this.master3Api.getcurrencyaccount(input);
    getcurrencyaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      this.selected_currency();
      // console.log("currency account rsponse ", res.ResponseObject)
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (!res.IsError && res.ResponseObject) {
        // this.currencyaccount = res.ResponseObject;
        if (res.ResponseObject.length === 0) {
          //  this.prospectAccForm.controls['currency'].setValue('');
          this.currencyaccount = [];
          this.currencyaccount['message'] = 'No record found';
        } else {
          this.advanceLookupCurrency = res.ResponseObject;
          if (event !== '') {
            this.currencyaccount = res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });

          } else {
            this.currencyaccount = this.getTenRecords(res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) }));
          }
        }
      } else {
        //   this.prospectAccForm.controls['currency'].setValue('');
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
  // kdjhgfj
  getSymbol(data) {
    // console.log(data)
    return this.accountListService.getSymbol(data);
  }
  getUltimateParentaccount(event) {
    this.ultimateparentaccount = [];
    this.accountCreationObj['ultimateparent'] = '';
    // if (!this.userdat.searchFieldValidator(event)) {
    //   event = '';
    // }
    // if (this.userdat.searchFieldValidator(event.target.value)) {
    this.isActivityGroupSearchLoading = true;
    this.loader = true;
    const getparentaccount = this.master3Api.getparentaccount(event);
    getparentaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (res.ResponseObject.length === 0) {
          this.prospectAccForm.controls['ultimateparent'].setValue('');
          this.ultimateparentaccount['message'] = 'No record found';
        } else {
          this.ultimateparentaccount = res.ResponseObject;
        }
      } else {
        this.prospectAccForm.controls['ultimateparent'].setValue('');
        this.ultimateparentaccount = [];
        this.ultimateparentaccount['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.ultimateparentaccount = [];
      this.ultimateparentaccount['message'] = 'No record found';
    });
    //}
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopComponent, {
      disableClose: true,
      width: '400px',
      //  data: this.moduleTypeStateData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.createClicked = true;
        //  this.ClearRedisCache()
      } else {
        this.createClicked = false;
      }
    })
  }
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
  ]

  selectedCity: {}[] = [];

  /****************** city  autocomplete code end ****************** */

  /****************** country1 autocomplete code start ****************** */

  showcountry1: boolean = false;
  country1Name: string = '';
  country1NameSwitch: boolean = true;

  country1Nameclose() {
    this.country1NameSwitch = false;
  }

  // wiprocountry1: {}[] = [

  //   { index: 0, contact: 'India', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'America', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Singapore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'UK', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedcountry1: {}[] = [];

  /****************** country1  autocomplete code end ****************** */
  /****************** country autocomplete code start ****************** */

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

  /****************** country  autocomplete code end ****************** */
  /****************** country code autocomplete code start ****************** */

  showcountrycode: boolean = false;
  countrycode1: string = '';
  countrycodeSwitch: boolean = true;

  countrycodeclose() {
    this.countrycodeSwitch = false;
  }
  appendcountrycode(value: string, i) {
    this.countrycode1 = value;
    this.selectedcountry.push(this.wiprocountrycode[i]);
  }
  wiprocountrycode: {}[] = [

    { index: 0, contact: 'India', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'America', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Singapore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'UK', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedcountrycode: {}[] = [];

  /****************** country code autocomplete code end ****************** */
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
  ]

  selectedContact8: {}[] = [];

  /****************** SBU autocomplete code end ****************** */

  /****************** vertical autocomplete code start ****************** */

  showContact: boolean = false;
  contactName: string = '';
  contactNameSwitch: boolean = true;

  contactNameclose() {
    this.contactNameSwitch = false;
  }
  wiproContact: {}[];
  //  = [

  //   { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedContact: {}[] = [];

  /****************** vertical autocomplete code end ****************** */

  /****************** Sub Vertical autocomplete code start ****************** */

  showContact1: boolean = false;
  contactName1: string = '';
  contactNameSwitch1: boolean = true;

  contactNameclose1() {
    this.contactNameSwitch1 = false;
  }
  wiproContact1: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact1: {}[] = [];

  /****************** Sub Vertical  autocomplete code end ****************** */

  /************** cluster autocomplete code start  ************************/
  clusterNameSwitch: boolean = true;
  clusterclose() {
    this.clusterNameSwitch = false;
  }

  // clusterNameContent: {}[] = [

  //   { index: 0, contact: 'cluster name 1', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'cluster name 2 ', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'cluster name 3', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'cluster name 4', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ];

  /************* cluster autocomplete code end  */
  /****************** Geo autocomplete code start ****************** */

  showContact2: boolean = false;
  contactName2: string = '';
  contactNameSwitch2: boolean = true;

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }


  //   = [

  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedContact2: {}[] = [];

  /****************** Geo  autocomplete code end ****************** */
  /****************** Region autocomplete code start ****************** */

  showContact3: boolean = false;
  contactName3: string = '';
  contactNameSwitch3: boolean = true;

  contactNameclose3() {
    this.contactNameSwitch3 = false;
  }
  wiproContact3: {}[];
  // = [

  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedContact3: {}[] = [];

  /****************** Region  autocomplete code end ****************** */

  /****************** state autocomplete code start ****************** */

  showContact4: boolean = false;
  contactName4: string = '';
  contactNameSwitch4: boolean = true;

  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  // appendState(item) {
  //   this.contactName4 = item.Name;
  //   this.stateId   = item.SysGuid;
  //  // this.selectedContact4.push(this.wiproContact4[i])
  // }
  wiproContact4: {}[] = [

    { index: 0, contact: 'abc', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'asas Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'sasa Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact4: {}[] = [];

  /****************** state  autocomplete code end ****************** */
  /****************** city1 edit autocomplete code start ****************** */

  showCity1: boolean = false;
  city1Name: string = '';
  city1NameSwitch: boolean = true;

  city1Nameclose() {
    this.city1NameSwitch = false;
  }

  wiproCity1: {}[]
  //  = [

  //   { index: 0, contact: 'Mysore', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Hassan', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Tumkur', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedCity1: {}[] = [];

  /****************** city1 edit  autocomplete code end ****************** */
  /****************** parent autocomplete code start ****************** */

  showparent: boolean = false;
  parentName: string = '';
  parentNameSwitch: boolean = true;
  currencyNameSwitch: boolean = true;

  parentNameclose() {
    this.parentNameSwitch = false;
  }
  currencyNameclose() {
    this.currencyNameSwitch = false;
  }
  // appendparent(value: string, i) {
  //   this.parentName = value;
  //   this.selectedparent.push(this.wiproparent[i])
  // }
  wiproparent: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedparent: {}[] = [];

  /****************** parent   autocomplete code end ****************** */
  /****************** ultimate parent autocomplete code start ****************** */

  showUparent: boolean = false;
  UparentName: string = '';
  UparentNameSwitch: boolean = true;

  UparentNameclose() {
    this.UparentNameSwitch = false;
  }
  appendUparent(value: string, i) {
    this.UparentName = value;
    this.selectedUparent.push(this.wiproUparent[i]);
  }
  wiproUparent: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedUparent: {}[] = [];

  /******************ultimate  parent   autocomplete code end ****************** */
  /****************** quarter parent autocomplete code start ****************** */

  showquarter: boolean = false;
  quarterName: string = '';
  quarterNameSwitch: boolean = true;

  quarterNameclose() {
    this.quarterNameSwitch = false;
  }
  appendquarter(value: string, i) {
    this.quarterName = value;
    this.selectedquarter.push(this.wiproquarter[i]);
  }
  wiproquarter: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedquarter: {}[] = [];

  /******************quarter  parent   autocomplete code end ****************** */
  /****************** Finacial year autocomplete code start ****************** */

  showFinacial: boolean = false;
  FinacialName: string = '';
  FinacialNameSwitch: boolean = true;

  FinacialNameclose() {
    this.FinacialNameSwitch = false;
  }
  // appendFinacial(value: string, i) {
  //   this.FinacialName = value;
  //   this.selectedFinacial.push(this.wiproFinacial[i])
  // }
  wiproFinacial: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedFinacial: {}[] = [];

  getAllSwapAccount(ownerid, countryId) {
    // if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    const swapaccount = this.master3Api.getswapaccount(ownerid, countryId);
    swapaccount.subscribe((res: any) => {
      this.OwnDetailsForm.controls['swapaccount'].setValue(''); // selected swap account should be empty on calling API. ** KKN **
      this.accountCreationObj['swapaccount'] = '';
      this.accountCreationObj['swapaccount'] = '';
      this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['swapaccount']) ? 3 : 1;

      // console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allSwapableAccount = res.ResponseObject;
      else this.allSwapableAccount = [];
    });
  }
  getAltSwapAccount(ownerid, countryId, sbuId) {
    const swapaccount = this.master3Api.getaltswapaccount(ownerid, countryId, sbuId);
    swapaccount.subscribe((res: any) => {
      this.OwnDetailsForm.controls['altswapaccount'].setValue(''); // selected swap account should be empty on calling API. ** KKN **
      this.accountCreationObj['alternateswapaccount'] = '';
      this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['alternateswapaccount']) ? 3 : 1;

      // console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allaltSwapableAccount = res.ResponseObject;
      else this.allaltSwapableAccount = [];
    });
  }
  /****************** Finacial year   autocomplete code end ****************** */
  SwapAccountOpen() {
    // if (this.allSwapableAccount && this.allSwapableAccount.length == 0)
    //   this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
    // if (this.allSwapableAccount.length == 0) {
    //   this.snackBar.open('Don\'t have any account to swap', '', {
    //     duration: 2000
    //   });
    //   this.OwnDetailsForm.controls['isswapaccount'].setValue(false);
    //   this.accountCreationObj['isswapaccount'] = false;
    // }
    // else {
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
        this.searchAccount1 = true;
        this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['swapaccount']) ? 3 : 1;
        // this.OwnDetailsForm.get('owner').setValue(result.Account);
      } else {

      }
    });
    // }
  }
  AltSwapAccountOpen() {
    const dialogRef = this.dialog.open(SwapPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: { allSwapableAccount: this.allaltSwapableAccount }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.seletedValue = result.Account;
        this.OwnDetailsForm.controls['altswapaccount'].setValue(result.Name);
        this.accountCreationObj['alternateswapaccount'] = result.SysGuid;
        this.searchAccount1 = true;
        this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['alternateswapaccount']) ? 3 : 1;
        // this.OwnDetailsForm.get('owner').setValue(result.Account);
      } else {

      }
    });
    // }
  }


  openSwapSubmitPopup() {

    console.log(this.OwnDetailsForm);
    console.log(this.accountCreationObj);
    // console.log("=====>", this.OwnDetailsForm.controls["swapaccount"].value)
    this.account2 = this.OwnDetailsForm.controls['swapaccount'].value || this.OwnDetailsForm.controls['altswapaccount'].value;
    this.clearFormFiled(this.OwnermandtFiled, this.OwnDetailsForm);
    // console.log("pay;oad for custom  ", this.payload)
    if (this.OwnDetailsForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelector('input.ng-invalid');
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // if (invalidElements.length > 0) {
      //   this.scrollTo(invalidElements[0]);
      // }
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
        } else {
          this.snackBar.open(res.Message, '', {
            duration: 3000
          });
        }
      });
    }



  }
  checksbu() {
    const dialogRef = this.dialog.open(SwapCreatePopupComponent,
      {
        disableClose: true,
        width: '380px',
        data: {
          account1: this.account1,
          account2: this.account2
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.act === 'yes') {
        this.postActionCode = 184450000;
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

        // console.log('requestpayload ', requestpayload, this.draftSysGuid)
      }

    });
    window.scrollTo(0, 0);
  }

  // goBack() {
  //   this.router.navigate(['/accounts/accountcreation/activerequest']);
  //   //this.location.back();
  // }
  openSubmitPopup() {
    const dialogRef = this.dialog.open(ProspectSubmit,
      {
        disableClose: true,
        width: '380px',
        // data: {
        //   dataKey: this.payload
        // }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.act === 'yes') {

        //  this.postActionCode = 184450005;
        // if (this.roleType == '1') {
        //   this.postActionCode = 184450000;
        // }
        // else if (this.roleType == '2') {
        //   this.postActionCode = 184450001;
        // }
        // else if (this.roleType == '3') {
        //   this.postActionCode = 184450000; //as per the disscussion with santosh we are changing status code from 02 t0 00
        // }
        this.postActionCode = 184450000;
        const requestpayload = {};
        requestpayload['prospect'] = this.setPostObj(this.postActionCode);
        requestpayload['prospect']['swapaccountcomment'] = (this.OwnDetailsForm.value.isswapaccount) ? result['swapaccountcomment'] : '';
        requestpayload['overall_comments'] = {
          'overallcomments': result['swapaccountcomment'],
          'requestedby': this.loggedUser,
          'status': this.overallStatus
        };
        requestpayload['prospect']['prospectid'] = this.draftSysGuid;
        // console.log(requestpayload);

        this.creataAccount(requestpayload);
        // console.log('requestpayload ", requestpayload, this.draftSysGuid)
      }

    });

  }
  stepone() {
    this.accountInfo = true;
    this.dealinfo = false;
    this.twoactive = false;
    this.prospectAccForm.controls['currency'].setValue(this.CurrencyData);


  }
  getFocus() {
    this.isLoading = true;

    setTimeout(() => {
      window.scrollTo(0, 0);
      this.isLoading = false;
      document.getElementById("ConversationNamelegal").focus();
    }, 1000);
  }
  steptwo() {
    // console.log("requestpayload", this.payload);
    console.log("formcontrol", this.prospectAccForm);

    // this.payload = {
    //   //   "prospectid": '',
    //   //  // "parentaccount": this.parentNameId,
    //   //   "ultimateparent": this.UltimateparentId,
    //   //   "headquarters": this.prospectAccForm.value.headquarters,
    //   //   //city is requried 
    //     "countrycode": this.requestpayload['countrycode'],
    // }
    //console.log("ssssssssssssss",this.payload)
    if (this.prospectAccForm.invalid) {
      this.firstFormSubmitted = true;
      // console.log("this.prospectAccForm.invalid");
      const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,mat-select.ng-invalid,input.ng-invalid');
      // ,select.ng-invalid,input.ng-invalid
      // console.log("invalid elements test "+invalidElements);
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalidElements.focus();
      // if (invalidElements.length > 0) {
      //   this.scrollTo(invalidElements[0]);
      // }
      return;
    } else {
      this.saveToDraft();
      this.accountInfo = false;
      this.dealinfo = true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        if (this.IsOwner === 'true') {
          this.OwnDetailsForm.controls['owner'].patchValue(this.accountownername);
          this.accountCreationObj['owner'] = this.loggedUser;

        }
        this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
        this.getHuntingCount(this.accountCreationObj['owner'], '');
        this.getExistingCount(this.accountCreationObj['owner']);
        if (!this.IsSubVerticalExist) {
          this.OwnDetailsForm.get('subvertical').setValidators([]);
          this.customValidators['subvertical'] = false;
        }
        // console.log("form details after 1sec", this.OwnDetailsForm)
      }, 1000);
    }
  }

  openeSearchAccountPopup1() {
    //  this.editablefields=true;
    //  this.leadinfo=false;

    const dialogRef = this.dialog.open(SearchAccountPopupComponent,
      {
        disableClose: true,
        width: '380px',
        data: { openDnB: true }
      }
    );
  }


  getHuntingCount(SysGuid, CountryGuid) {
    this.master3Api.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        this.huntingRatio = res['ResponseObject'];
        console.log(this.huntingRatio);
        if (this.huntingRatio <= 0) {
          this.OwnDetailsForm.controls['isswapaccount'].disable();
        } else {
          if (this.huntingRatio >= 8) {
            this.OwnDetailsForm.controls['isaltswapaccount'].enable();
          }
          else {
            this.OwnDetailsForm.controls['isaltswapaccount'].disable();
          }
          this.OwnDetailsForm.controls['isswapaccount'].enable();
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
          this.OwnDetailsForm.controls['isaltswapaccount'].disable();
        } else {
          this.OwnDetailsForm.controls['isaltswapaccount'].enable();
        }
      }
    });
  }

  OpenAccountProspectOwner() {
    this.accountCreationObj['isswapaccount'] = false;
    this.OwnDetailsForm.controls['swapaccount'].disable();
    this.greenborder = !this.greenborder;
    const dialogRef = this.dialog.open(AccountOwnerPopupComponent,
      {
        disableClose: true,
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log( this.accOwnerSwap);
        this.ownername = result.FullName;
        this.OwnDetailsForm.controls['owner'].setValue(result.FullName);
        this.accountCreationObj['owner'] = result.SysGuid;

        this.getHuntingCount(this.accountCreationObj['owner'], '');
        this.getExistingCount(this.accountCreationObj['owner']);
        this.getAllSwapAccount(this.accountCreationObj['owner'], '');
        // this.master3Api.HuntingCount(result.SysGuid).subscribe(res => {
        //   if (!res['IsError']) {
        //     this.huntingRatio = res['ResponseObject'];
        //     if (this.huntingRatio <= 0) {
        //       this.OwnDetailsForm.controls["isswapaccount"].disable();
        //     }
        //     else {
        //       this.OwnDetailsForm.controls["isswapaccount"].enable();
        //     }
        //     console.log(this.huntingRatio);
        //   }
        // })

        // this.formsData.owner=result[0].contact;

        // this.formsData.owner = result[0].contact;
      }
      // if (result) {
      //   console.log("result of pop up ", result, "result of 1 ");
      //   this.formsData.owner = result.FullName;
      //   this.account = result.HuntingRatio;
      //   this.formsData.ownerid = result.SysGuid

      //   console.log("hunting ratio ", this.account, "ownerid", this.formsData.ownerid);


      // }
    });
    // document.getElementById('customerName').focus();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    localStorage.removeItem('parentdetailes');
    localStorage.removeItem('parentflag');
    localStorage.removeItem('draftId');
    this.draftDetails = {};
  }
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    // debugger
    // AccountAdvnNames,AccountNameListAdvnHeaders
    console.log("this.prospectAccForm.value.parentaccount--" + this.prospectAccForm.value.parentaccount);
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountNameListAdvnHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvnNames[controlName]['isAccount'];
    this.lookupdata.inputValue  = value;
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
      // debugger
      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData }, clusterId: this.OwnDetailsForm.controls['sbu'].value }).subscribe(res => {
        // debugger
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

        } else if (x.action === 'tabSwich') {
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
      // clusterId : this.OwnDetailsForm.controls['sbu'].value ? this.OwnDetailsForm.controls['sbu'].value :''
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      // case 'accountNameSource': {
      //   return this.AccountSelected = [], this.sendAccountNameToAdvance = []
      // }
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
      case 'altowner': {
        return this.sendAltOwnerToAdvance = [], this.altownerAccountSelected = [];
      }
      case 'cluster': {
        return this.clustertoAdvLookup = [], this.clusterSelected = [];
      }

    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'parentaccount': { return (this.sendParentAccountNameToAdvance.length > 0) ? this.sendParentAccountNameToAdvance : []; }
      case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : []; }
      case 'owner': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : []; }
      case 'sbu': { return (this.sendSbuToAdvance.length > 0) ? this.sendSbuToAdvance : []; }
      case 'vertical': { return (this.sendVerticalToAdvance.length > 0) ? this.sendVerticalToAdvance : []; }
      case 'subvertical': { return (this.sendSubVerticaltoAdvance.length > 0) ? this.sendSubVerticaltoAdvance : []; }
      case 'currencyaccount': { return (this.sendCurrencytoAdvance.length > 0) ? this.sendCurrencytoAdvance : []; }
      case 'geography': { return (this.sendGeographytoAdvance.length > 0) ? this.sendGeographytoAdvance : []; }
      case 'region': { return (this.sendRegiontoAdvance.length > 0) ? this.sendRegiontoAdvance : []; }
      case 'country': { return (this.sendCountrytoAdvance.length > 0) ? this.sendCountrytoAdvance : []; }
      case 'state': { return (this.sendSatetoAdvance.length > 0) ? this.sendSatetoAdvance : []; }
      case 'city': { return (this.sendCitytoAdvance.length > 0) ? this.sendCitytoAdvance : []; }
      case 'altowner': { return (this.sendAltOwnerToAdvance.length > 0) ? this.sendAltOwnerToAdvance : []; }
      case 'cluster': { return (this.clustertoAdvLookup.length > 0) ? this.clustertoAdvLookup : [] }
      default: { return []; }
    }
  }
  // selectedLookupName(controlName) {
  //   switch (controlName) {
  //     case 'parentaccount': { return this.prospectAccForm.value.parentaccount ? (this.prospectAccForm.value.parentaccount === this.getSymbol(this.ParentAccountSelected['Name'])) ? this.prospectAccForm.value.parentaccount : this.prospectAccForm.value.parentaccount : '' };
  //     // case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : [] }
  //     // case 'owner': { return this.OwnDetailsForm.value.owner ? (this.OwnDetailsForm.value.owner === this.ownerAccountSelected['FullName']) ? this.OwnDetailsForm.value.owner : this.OwnDetailsForm.value.owner : '' }
  //     // case 'sbu': { return this.OwnDetailsForm.value.sbu ? (this.OwnDetailsForm.value.sbu === this.sbuAccountSelected['Name']) ? this.OwnDetailsForm.value.sbu : this.OwnDetailsForm.value.sbu : '' }
  //     // case 'vertical': {  return this.OwnDetailsForm.value.vertical ? (this.OwnDetailsForm.value.vertical === this.verticalSelected['Name']) ? this.OwnDetailsForm.value.vertical : this.OwnDetailsForm.value.vertical : ''    }
  //     // case 'subvertical': { return this.OwnDetailsForm.value.subvertical ? (this.OwnDetailsForm.value.subvertical === this.subVerticalSelected['Name']) ? this.OwnDetailsForm.value.subvertical : this.OwnDetailsForm.value.subvertical : '' }
  //     // case 'currencyaccount': { return this.prospectAccForm.value.currency ? (this.prospectAccForm.value.currency === this.sendCurrencytoAdvance['Desc']) ? this.prospectAccForm.value.currency : this.prospectAccForm.value.currency : '' }
  //     // case 'geography': { return this.OwnDetailsForm.value.geography ? (this.OwnDetailsForm.value.geography === this.geographySelected['Name']) ? this.OwnDetailsForm.value.geography : this.OwnDetailsForm.value.geography : '' }
  //     // case 'region': { return this.OwnDetailsForm.value.region ? (this.OwnDetailsForm.value.region === this.regionSelected['Name']) ? this.OwnDetailsForm.value.region : this.OwnDetailsForm.value.region : '' }
  //     // case 'country': { return this.OwnDetailsForm.value.country ? (this.OwnDetailsForm.value.country === this.countrySelected['Name']) ? this.OwnDetailsForm.value.country : this.OwnDetailsForm.value.country : '' }
  //     // case 'state': { return this.OwnDetailsForm.value.state ? (this.OwnDetailsForm.value.state === this.stateSelected['Name']) ? this.OwnDetailsForm.value.state  : this.OwnDetailsForm.value.state : '' }
  //     // case 'city': { return this.OwnDetailsForm.value.city ? (this.OwnDetailsForm.value.city === this.citySelected['Name']) ? this.OwnDetailsForm.value.city : this.OwnDetailsForm.value.city : '' }
  //     // case 'altowner': { return this.OwnDetailsForm.value.altowner ? (this.OwnDetailsForm.value.altowner === this.altOwnerAccountSelected['FullName']) ? this.OwnDetailsForm.value.altowner : this.OwnDetailsForm.value.altowner : '' }
  //     // case 'cluster': { return this.OwnDetailsForm.value.cluster ? (this.OwnDetailsForm.value.cluster === this.clusterSelected['Name']) ? this.OwnDetailsForm.value.cluster : this.OwnDetailsForm.value.cluster : ''}
  //     default: { return []; }
  //   }
  // }


  createTempData() {
    return {
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
      altowner: this.altownerAccountSelected,
      cluster: this.clusterSelected

    };
  }
  AppendParticularInputFun(selectedData, controlName) {
    // debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data);
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'parentaccount': (data) => { this.appendparent(data) },
    'ultimateparent': (data) => { this.appendultimateparent(data) },
    'owner': (data) => { this.appendcustomer(data) },
    'sbu': (data) => { this.appendcontactSBU(data), this.removeVerticalAndSbuverticalData('', true, data) },
    'vertical': (data) => { this.appendvertical(data, '', false) },
    'subvertical': (data) => { this.appendsubvertical(data, '', false) },
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
  getTenRecords(res) {
    // debugger;
    const resdata = res.slice(0, 9);
    return resdata;
  }
  getaccountowner(event) {
    if (event === '') {
      this.onOwnercleared();
    }

    this.greenborder = !this.greenborder;
    // if (event.target.value !== '') {
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
    // if (event.target.value !== '') {

    //   var accountowner = this.apiservice.getaccountowner(event.target.value)
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
        this.lookupdata.nextLink = (res2.OdatanextLink) ? res2.OdatanextLink : '';
        this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
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
    debugger;
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
    this.OwnDetailsForm.controls['altowner'].setValue('');
    this.OwnDetailsForm.get('altowner').setValidators([]);
    this.OwnDetailsForm.get('altowner').disable();
    this.OwnDetailsForm.controls['altswapaccount'].setValue('');
    this.OwnDetailsForm.get('altswapaccount').setValidators([]);
    this.OwnDetailsForm.get('altswapaccount').disable();
    this.OwnDetailsForm.controls['isaltswapaccount'].setValue(false);
  }
  onAltOwnercleared() {
    this.altHuntingRatio = undefined;
    this.accountCreationObj['alternateaccountowner'] = '';
    // this.OwnDetailsForm.get('altowner').setValidators([]);
    this.accountCreationObj['alternateswapaccount'] = '';
    // this.OwnDetailsForm.get('altswapaccount').setValidators([]);
    this.OwnDetailsForm.get('altswapaccount').disable();
    this.OwnDetailsForm.controls['altowner'].setValue('');
    this.OwnDetailsForm.controls['altswapaccount'].setValue('');
  }

  appendcustomer(item) {
    this.sendOwnerToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.ownerAccountSelected = item;
    this.OwnerName = item.FullName;
    this.OwnDetailsForm.controls['owner'].setValue(item.FullName);
    this.accountCreationObj['owner'] = item.SysGuid || '';

    //this.OwnDetailsForm.controls['owner'].setValue(result.FullName);

    this.getAllSwapAccount(this.accountCreationObj['owner'], this.accountCreationObj['country']);
    this.getHuntingCount(this.accountCreationObj['owner'], '');
    this.getExistingCount(this.accountCreationObj['owner']);
  }
  appendAltOwner(item) {
    this.altOwnerAccountSelected = item;
    this.AltOwnerName = item.FullName;
    this.sendAltOwnerToAdvance.push({ ...item, Id: item.Id ? item.Id : item.SysGuid });
    this.altownerAccountSelected = item;
    this.OwnDetailsForm.controls['altowner'].setValue(item.FullName);
    this.accountCreationObj['alternateaccountowner'] = item.SysGuid || '';


    this.OwnDetailsForm.controls['altswapaccount'].enable();

    this.getAltSwapAccount(this.accountCreationObj['alternateaccountowner'], this.accountCreationObj['country'], this.accountCreationObj['sbu']);
    this.getAltHuntingCount(this.accountCreationObj['alternateaccountowner'], '');
  }
  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }

  CreateAutoSave() {
    this.AppendAutoSave();
  }
  AppendAutoSave() {
    let uniqueKey = 'createaccountProspect_' + this.loggedUser;
    this.service.SetRedisCacheData(this.createTempDataForAutoSave(), uniqueKey).subscribe(res => {
      if (!res.IsError) {
        // console.log("SUCESS FULL AUTO SAVE")
      }
    }, error => {
      console.log(error);
    });
  }
  createTempDataForAutoSave() {
    return {
      name: this.prospectAccForm.value.name || '', // hard code 
      parentaccount: this.prospectAccForm.value.parentaccount || '',//this.parentNameId,
      currency: this.prospectAccForm.value.currency || '',
      ultimateparent: this.prospectAccForm.value.ultimateparent || '', //this.UltimateparentId,
      headquarters: this.prospectAccForm.value.headquarters || '',
      countrycode: this.prospectAccForm.value.countrycode || '',
      citystring: this.prospectAccForm.value.city || '',
      countrystring: this.prospectAccForm.value.country || '',
      address: this.prospectAccForm.value.address || '',
      phonenumber: this.prospectAccForm.value.phonenumber || '',
      website: this.prospectAccForm.value.website || '',
      email: this.prospectAccForm.value.email || '',
      businessdescription: this.prospectAccForm.value.businessdescription || '',
      employees: this.prospectAccForm.value.employees || '',
      sicdescription: this.prospectAccForm.value.sicdescription || '',
      stockindexmembership: this.prospectAccForm.value.stockindexmembership || '',
      tickersymbol: this.prospectAccForm.value.tickersymbol || '',
      // currency: this.prospectAccForm.value.currency || '',
      fortune: parseFloat(this.prospectAccForm.value.fortune) || '',
      profits: parseFloat(this.prospectAccForm.value.profits) || '',
      revenue: parseFloat(this.prospectAccForm.value.revenue) || '',
      // revenue: +(this.prospectAccForm.value.revenue).replace(/,/g, '') || '',
      operatingmargins: parseFloat(this.prospectAccForm.value.operatingmargins) || '',
      marketvalue: parseFloat(this.prospectAccForm.value.marketvalue) || '',
      returnonequity: parseFloat(this.prospectAccForm.value.returnonequity) || '',
      entitytype: parseFloat(this.prospectAccForm.value.entitytype) || '',
      creditscore: parseFloat(this.prospectAccForm.value.creditscore) || '',
      ownershiptype: parseFloat(this.prospectAccForm.value.ownershiptype) || '',
      owner: this.OwnDetailsForm.value.owner || '',//this.formsData.ownerid,
      isswapaccount: (this.OwnDetailsForm.value.isswapaccount) ? this.OwnDetailsForm.value.isswapaccount : false,
      swapaccount: (this.OwnDetailsForm.value.swapaccount) ? this.OwnDetailsForm.value.swapaccount : '',
      growthcategory: parseFloat(this.OwnDetailsForm.value.growthcategory) || '',
      coveragelevel: this.OwnDetailsForm.value.coveragelevel || '',
      revenuecategory: parseFloat(this.OwnDetailsForm.value.revenuecategory) || '',
      sbu: this.OwnDetailsForm.value.sbu || '',
      vertical: this.OwnDetailsForm.value.vertical || '',//this.verticalId,
      subvertical: this.OwnDetailsForm.value.subvertical || '', //this.subverticalId,
      geography: this.OwnDetailsForm.value.geography || '',//this.geoId,
      region: this.OwnDetailsForm.value.region || '',// this.regionId,
      country: this.OwnDetailsForm.value.country || '', // this.countryId,
      state: this.OwnDetailsForm.value.state || '',
      city: this.OwnDetailsForm.value.city || '',
      finanacialyear: this.OwnDetailsForm.value.finanacialyear || '', // this.FinacialyearId,
      newagebusiness: this.OwnDetailsForm.value.newagebusiness || false,
      governementaccount: this.OwnDetailsForm.value.governementaccount || false,
      statuscode: this.postActionCode,
      prospectnumber: '',
      requesttype: (this.OwnDetailsForm.value.isswapaccount || this.OwnDetailsForm.value.isalternateswapaccount) ? 3 : 1,
      //  prospecttype: 2, /* hunitng */
      accountCreationObj: {
        owner: this.accountCreationObj['owner'] || '',//this.formsData.ownerid,
        parentaccount: this.accountCreationObj['parentaccount'] || '',//this.parentNameId,
        currency: this.accountCreationObj['currency'] || '',
        ultimateparent: this.accountCreationObj['ultimateparent'] || '', //this.UltimateparentId,
        sbu: this.accountCreationObj['sbu'] || '',//this.SbuId,
        vertical: this.accountCreationObj['vertical'] || '',//this.verticalId,
        subvertical: this.accountCreationObj['subvertical'] || '', //this.subverticalId,
        geography: this.accountCreationObj['geography'] || '',//this.geoId,
        region: this.accountCreationObj['region'] || '',// this.regionId,
        country: this.accountCreationObj['country'] || '', // this.countryId,
        state: this.accountCreationObj['state'] || '',
        city: this.accountCreationObj['city'] || '',
        finanacialyear: this.accountCreationObj['finanacialyear'] || '', // this.FinacialyearId,
        newagebusiness: this.accountCreationObj['newagebusiness'] || false,
        governementaccount: this.accountCreationObj['governementaccount'] || false,
        // currency: this.accountCreationObj['currency'] || '',
        isswapaccount: (this.accountCreationObj['swapaccount']) ? this.OwnDetailsForm.value.isswapaccount : false,
        swapaccount: (this.OwnDetailsForm.value.isswapaccount) ? this.accountCreationObj['swapaccount'] : '',
      }
    };
  }
  getAutoSaveData() {
    let uniqueKey = 'createaccountProspect_' + this.loggedUser;
    this.service.GetRedisCacheData(uniqueKey).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject) {
          if (res.ResponseObject !== '') {
            this.TempLeadDetails = JSON.parse(res.ResponseObject);
            this.AppendTheFormData(this.TempLeadDetails);
          } else {
          }
        } else {
        }
      }

    })
  }
  AppendTheFormData(data) {
    this.populateCreateProspectForm(data);
  }

  // citystring: this.prospectAccForm.value.city || '',
  // countrystring: this.prospectAccForm.value.country || '',

  populateCreateProspectForm(savedData) {

    // debugger;
    this.customerName = savedData.owner ? savedData.owner : '';
    this.alternateOwner = savedData.alternateaccountOwner ? savedData.alternateaccountOwner : '';
    this.prospectAccForm.patchValue({
      phonenumber: savedData.phonenumber,
      email: savedData.email,
      businessdescription: savedData.businessdescription,

      ownershiptype: savedData.ownershiptype,
      parentaccount: savedData.parentaccount,
      currency: savedData.currency,
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
      address: savedData.address,
      employees: savedData.employees,
      quarter: savedData.quarter,
      country: savedData.countrystring, //chethana july 8th
      city: savedData.citystring,
    });
    this.OwnDetailsForm.patchValue({
      sbu: savedData.sbu,
      vertical: savedData.vertical,
      subvertical: savedData.subvertical,
      geography: savedData.geography,
      region: savedData.region,
      state: savedData.state,
      city: savedData.city,
      country: savedData.country,
      isswapaccount: savedData.isswapaccount,
      swapaccount: savedData.swapaccount,
      growthcategory: savedData.growthcategory,
      revenuecategory: savedData.revenuecategory,
      newagebusiness: savedData.newagebusiness,
      governementaccount: savedData.governementaccount,
      owner: savedData.owner,
      coveragelevel: savedData.coveragelevel,
      alternateOwner: savedData.alternateaccountOwner ? savedData.alternateaccountOwner : ''
    });
    this.accountCreationObj = {
      owner: savedData.accountCreationObj.owner || '',//this.formsData.ownerid,
      parentaccount: savedData.accountCreationObj.parentaccount || '',//this.parentNameId,
      // currencyaccount: savedData.accountCreationObj.currencyaccount || '',
      ultimateparent: savedData.accountCreationObj.ultimateparent || '', //this.UltimateparentId,
      sbu: savedData.accountCreationObj.sbu || '',//this.SbuId,
      vertical: savedData.accountCreationObj.vertical || '',//this.verticalId,
      subvertical: savedData.accountCreationObj.subvertical || '', //this.subverticalId,
      geography: savedData.accountCreationObj.geography || '',//this.geoId,
      region: savedData.accountCreationObj.region || '',// this.regionId,
      country: savedData.accountCreationObj.country || '', // this.countryId,
      state: savedData.accountCreationObj.state || '',
      city: savedData.accountCreationObj.city || '',
      finanacialyear: savedData.accountCreationObj.finanacialyear || '', // this.FinacialyearId,
      newagebusiness: savedData.accountCreationObj.newagebusiness || false,
      governementaccount: savedData.accountCreationObj.governementaccount || false,
      currency: savedData.accountCreationObj.currency || '',
      swapaccount: savedData.accountCreationObj.swapaccount,
      isswapaccount: savedData.accountCreationObj.isswapaccount,
      alternateaccountOwner: savedData.accountCreationObj.alternateaccountOwner
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
  removeSeletecedValue(FormName, formControlName, accountObjectName) {
    this.accountCreationObj[accountObjectName] = '';
    if (FormName === 'prospectAccForm') {
      this.prospectAccForm.controls[formControlName].setValue('');
    } else {
      this.OwnDetailsForm.controls[formControlName].setValue('');
      if (formControlName == 'owner') {
        this.onOwnercleared();
      }
      else {
        if (formControlName == 'altowner') {
          this.onAltOwnercleared();
        }
        else { }
      }
    }
  }

  //  select alternative secondary owner and secondary owner swap account start
  alternativeownerClose() {
    this.alternativeownerSwitch = false;
  }

  secondaryownerClose() {
    this.secondaryownerSwitch = false;
  }
  //  select alternative secondary owner and secondary owner swap account start
  /*****************Advance search popup ends*********************/
}
@Component({
  selector: 'prospect-submit',
  templateUrl: './prospectsubmit-popup.html',
})

export class ProspectSubmit {
  commentpostobject: any = {};
  swapaccountcomment: string = '';
  accountSubmitted: boolean = false;
  constructor(public dialogRef: MatDialogRef<ProspectSubmit>, public accservive: DataCommunicationService) {
    // console.log("paylodaddata",data.dataKey)
    // @Inject(MAT_DIALOG_DATA) public data
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  restrictspace(e) {
    if (e.which === 32 && !this.swapaccountcomment.length)
      e.preventDefault();
  }
  goToAccounts(act) {

    // if(act == 'yes' && this.swapaccountcomment != '')
    if (act == 'yes') {
      this.commentpostobject['act'] = act;
      this.commentpostobject['swapaccountcomment'] = this.swapaccountcomment;
      this.dialogRef.close(this.commentpostobject);
      this.accountSubmitted = false;
    }
    else {
      this.accountSubmitted = true;
    }

  }
}

@Component({
  selector: 'prospect-popup',
  templateUrl: './prospectsearchaccount-popup.html',
})

export class ProspectSubmitPopup {
  constructor(public dialogRef: MatDialogRef<ProspectSubmitPopup>, public dialog: MatDialog, public accservive: DataCommunicationService) { }



  companyName: string;
  showCompany: boolean;
  showCompanySwitch: boolean = true;
  // ExistingAccount()
  // {
  //  const dialogRef = this.dialog.open(ExistingAccount,
  //    {
  //      width:'380px'
  //    }); 
  // }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  companyNameClose() {

    this.showCompanySwitch = false;
  }

  companyDetails: {}[] = [

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1', Existing_account: 'Existing account' },
    { name: "TCS", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Wipro", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' }

  ]

  //   appendName(value:any){
  //   if(value.Existing_account)
  //   {  const dialogRef = this.dialog.open(ExistingAccount,
  //     {
  //       width:'380px'
  //     }); 
  //   }else{
  //     this.companyName = value.name;
  //   }
  // }

}

// @Component({
//   selector: 'existingaccount-popup',
//   templateUrl: './existingaccount-popup.html',
// })

// export class ExistingAccount {
//   constructor(public dialogRef: MatDialogRef<ExistingAccount>) { } 
// }

@Component({
  selector: 'account-owner',
  templateUrl: './accountowner-popup.html',
})

export class OpenProspectAccountOwner {
  constructor(public dialogRef: MatDialogRef<OpenProspectAccountOwner>, public accservive: DataCommunicationService,
    public apiservice: MasterApiService, @Inject(MAT_DIALOG_DATA) public data: any) { }
  close = false;
  /****************** customer contact autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = '';
  customerNameSwitch: boolean = true;
  //accountownerdata:any
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }
  // account owner =================


  appendcustomer(item) {
    // console.log("va;lueccccc", item, "value of i")
    this.customerName = item.FullName;
    this.selectedCustomer = item;
    this.customerContact = item;
  }

  customerContact: {}[]
  // = [

  //   { index:0,contact:'Anubhav Jain',designation:'Pre Sales Head',initials:'AJ',value:true},
  //   { index:1,contact:'Kanika Tuteja',designation:'Pre Sales Head',initials:'KT',value:false},
  //   { index:2,contact:'Anubhav Jain',designation:'Pre Sales Head',initials:'AJ',value:false},
  //   { index:3,contact:'Kanika Tuteja',designation:'Pre Sales Head',initials:'KT',value:false},
  // ]

  selectedCustomer: any;


  /****************** customer contact autocomplete code end ****************** */

  closeDiv(item: any) {
    //this.close=true;
    this.selectedCustomer = item; //this.selectedCustomer.filter((x:any)=>x.index!=item.index);
    console.log("selected customet", this.selectedCustomer);
  }
  closepop() {
    this.dialogRef.close(this.selectedCustomer);

  }

  ngOnInit() {
    console.log("payloddatain popoup", this.data);
  }

}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-popup.html',
  // styleUrls: ['./create-lead.component.scss'],

})
export class cancelpopComponent {
  loggedUser;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public accountListService: AccountListService, public dialogRef: MatDialogRef<cancelpopComponent>, public router: Router, private EncrDecr: EncrDecrService) {
    this.loggedUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  clearAutoSaveDate() {
    const uniqueKey = 'createaccountProspect_' + this.loggedUser;
    this.accountListService.clearAutoSaveData(uniqueKey).subscribe(res => {

      if (!res.IsError) {
        // console.log("SUCESSFULLY DELETED AUTO SAVE")
      }
    }, error => {
      // console.log(error)
    });
  }
  goBack() {
    this.clearAutoSaveDate()
    this.dialogRef.close(true)
    this.router.navigate(['/accounts/accountcreation/activerequest']);
    //this.location.back();
  }
}