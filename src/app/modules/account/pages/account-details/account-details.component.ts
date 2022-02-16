import { AccountDetails } from './../../../../core/interfaces/get-account-details';
import { ResponseObject } from './../../../../core/state/state.models/CreateCampaign.interface';
import { SapPopupComponent } from './../../../../shared/components/single-table/sprint4Modal/sap-popup/sap-popup.component';
import { Status } from './../../../../core/state/state.models/Lead/myopenleads.interface';
import { AccountListService, AccountHeaders, AccountAdvNames } from './../../../../core/services/accountList.service';
import { HostListener } from '@angular/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { FirstWordPipe } from '@app/shared/pipes/first-word.pipe';
import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AccountService } from '@app/core/services/account.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { MasterApiService } from '@app/core';
import { DatePipe } from '@angular/common'; //CHETHANA july 30th
import { ValidationService } from '@app/shared/services'; // kunal 8th august
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatExpansionModule,
  MatSnackBar
} from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { SearchAccountPopupComponent } from '@app/shared/modals/search-account-popup/search-account-popup.component';
import { farmingAccountAction, farmingRequestsclear } from '@app/core/state/actions/farming-account.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ModificationActiveRequestsClear } from '@app/core/state/actions/modification-active-list.actions';
import { modificationHistoryRequestsClear } from '@app/core/state/actions/modification-history-list.actions';
import { reserveAccountClear } from '@app/core/state/actions/resereve-account-list.actions';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { AddSecondaryOwnersComponent } from './modals/add-secondary-owners/add-secondary-owners.component';
import { RetagOpportunityComponent } from './modals/retag-opportunity/retag-opportunity.component';
import { MultipleReferenceViewComponent } from './modals/multiple-reference-view/multiple-reference-view.component';
import { OpportunitiesService } from '@app/core';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  isEditPermission: boolean = false;
  isReserveAccount: boolean = false;
  IsHelpLineTicket: boolean = false;
  showSapBtn: boolean = false;
  showTooltip: boolean;
  accountType: number;
  accountCategory;
  accountNumber: string;
  loaderStatus: number;
  AttributeComment: any = [];
  loggedin_user: string = '';
  showAssignmentButton: boolean = false;
  isLoading: boolean = false;
  isActivityGroupSearchLoading: boolean = false;
  showContent: boolean; //chethana added asper Nov 26th vd
  accountDetails: any;
  ownershipDetails: any;
  CustomDetails: any;
  addressDetails: any;
  creditDetails: any;
  engageDetails: any;
  Accstructure: any;
  trendsAnalysis: any;
  accountre: any;
  sapDetails: any;
  vendorDetails: any;
  nonEditable = true;
  overviewTab = true;
  allianceTab = false;
  accountTab = false;
  CustomerTab = false;
  CustomerNonEditable = false; //chethana April 1
  editPartCustomer = false;//chethana April 1
  CustomerEditable = false;//chethana April 1
  AccountRENonEditable = true; //chethana April 30th
  AccountREEditable = false;//chethana April 30th
  editPartAccountRE = false;//chethana April 30th
  fixedClass = 'fixedClass1';//chethana Sep 4th
  activeTab = true;//chethana added as per Nov 26th vd
  deactiveTab = false;//chethana added as per Nov 26th vd
  editPart = false;
  accountEdit = true;
  accountCS = false;
  allianceNonEditable = true;
  allianceEditable = false;
  alliance_table: any = [];
  CustomerBusinessUnit: any = { 'tableHead': [], 'record': [] };
  OwnerShipHistory: any = [];
  Assignmentrefdata: any = [];//chethana Aug 30th
  sapdetailsdata: any = [];//chethana Aug 30th
  Campaignhistorydata: any = [];//chethana  as per  Nov 26th VD
  LandIT = [];
  clickmes = false;
  table_headkey: any;
  table_datakey = [];
  table_headcust: any;
  table_datacust: any;
  table_headalli: any;
  table_dataalli: any = [];
  table_dataacc: any;
  table_headacc: any;
  table_dataaccAdvisory: any = [];//chethana 12th june
  table_headaccAdvisory: any;//chethana 12th june
  table_headstrat: any;
  table_datastrat: any;
  SysGuidid: string;
  showAccounts: boolean = false;
  Geo_guid = ''; // for testing kunal
  camundaPostObj: any = {};
  noramlPostObj: any = {};
  noramlPostObj1: any = {};
  verticalName: any;
  roleType: any;
  isOwnerLoggedIn: boolean = false;
  IsHelpDesk;
  userId: any;
  editable_field_comment: any = [];
  non_editablefiled_arr: any = [];
  oldAccountClassification: any = [];
  oldAccountCategory: any = [];
  accountName: string = '';
  accountOwnerGuid: any;
  HasSAPDetails;
  classificationid;
  accountTypechanged: boolean;
  // panelOpenState: boolean = true;
  accountAlliancePanel: boolean = true;
  analystRelationsPanel: boolean = true;
  accountCompetitorsPanel: boolean = true;
  showNews: boolean = true;
  showNewsContent: boolean = false;
  isValidForm: boolean = true;
  camundaApi: boolean = false;
  sapCodeDetails: any;
  AppointmentId;
  currencyName;
  sapCodeDisabled;
  sapCodePlaceholder;
  delCompeteData: any = {};
  validatorsArray = { 'WebsiteUrl': true, 'Email': true, 'HeadQuarters': true };
  accountREDropdown: any = {
    'CoverageLevel': [],
    'GrowthCategory': [],
    'RevenueCategory': [],
    'LifeCycleStage': [],
    'RelationShipStatus': [],
    'OwnershipType': [],
    'EntityType': []
  };
  accountOverviewDropdown: any = {
    'Type': [],
    'ProposedAccountType': [],
    'AccountClassification': [],
    'proposedAccountClassification': [],
    'searchAccount': [],
    'verticalandSBU': [],
    'geographyByName': [],
    'searchUser': [],
    'DeliveryManagerADHVDH': [],
    'Region': [],
    'Geo': [],
    'CountryReference': [],
    'CountrySubDivisionReference': [],
    'CityRegionReference': [],
    'StandByAccountOwner': [],
    'Owner': [],
    'AccountCategory': [],
    'TerritoryFlag': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    'IsGovAccount': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    'IsNewAgeBusiness': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    // "Currency": []
    'ParentAccount': [],
    'UltimateParentAccount': [],
    'MarketRisk': [],
    'advVertical': [],
    'advSubVertical': [],
    'advGeo': [],
    'advCountryReference': [],
    'advCountrySubDivisionReference': [],
    'advCityRegionReference': [],
    'PrivateEquityOwned': []
  }
  DnbUltimateParent;
  DnbParent;
  AccountAttribute: any = [];
  customerDetailsDropdown: any = {
    'Currency': []
  };
  vendorDropdown: any = {
    'AdvisoryRAnalyst': [],
    'RelationShipType': []
  };
  detailsTabs = { 'overviewTab': true, 'accountTab': false, 'CustomerTab': false, 'allianceTab': false };

  backUpData: any = []; // kkn. this is used for assigning the old value, once user click on cancel button. 
  /** Non editable field KKN**/

  ownerNonModifAttr = ['accountname', 'governmentaccount', 'proposedaccounttype', 'proposedclassification', 'DUNSID', 'parentaccount', 'ultimateparent', 'owner', 'accounttype', 'geography', 'region', 'country', 'state', 'city', 'sbu', 'vertical', 'subvertical', 'cbu', 'newclassification', 'accountcategory'];
  SBUNonModifAttr = ['accountname', 'accounttype', 'governmentaccount', 'proposedclassification', 'proposedaccounttype', 'accountcategory', 'newclassification', 'geography', 'region', 'country', 'state', 'city', 'sbu', 'vertical', 'subvertical'];
  // CSONonModifAttr = ['accountid', 'DUNSID', 'accountname', 'parentaccount', 'ultimateparent', 'governmentaccount'];
  CSONonModifAttr = [];
  apprvalArr: any = [];
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}';
  accountCompetitors: any = [];
  sub_and_vertical: any[];
  huntingRatio: any;
  accountData: any;
  location_temp: any = [];
  arrowkeyLocation: number = 0;
  ownerShipHistoryArray: any = [];
  DnbNewsdata: any;
  adhList;
  adhString = '';
  vdhlist;
  vdhString = '';
  admString = '';
  editApicallSuccess = false;
  isPrivateEquityOwned: boolean;
  // the below url is for implementing SSO between Trace/L20 and D&B Hoovers site. DO NOT CHANGE.
  public DnbSsoURL = "https://wipfsuat01.wipro.com/adfs/ls/idpinitiatedsignon.aspx?RelayState=RPID%3Dhttps%253A%252F%252Fdnb.onelogin.com%26RelayState%3D%252Fsaml%252Fproxy%252F680942";
  toggleComment() {

    this.clickmes = !this.clickmes;
    console.log(this.clickmes);

  }

  editReference(id) {
    // let obj = { 'route_from': 'assign_ref', 'Id': id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))
    // this.accountListService.setUrlParamsInStorage('assign_ref',id);
    this.accountListService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': id })
    this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
  }

  formclickOutside1(editable) {
    editable['isOpened'] = false;
  }
  formclickOutside2(companyeditable) {
    companyeditable['isOpened'] = false;
  }
  formclickOutside3(own_editable) {
    own_editable['isOpened'] = false;
  }

  //chethana April 1
  CompanyDetailseEdit = [
    { accountName: 'Currency', values: 'USD', control: 'select' },
    { accountName: 'Website', values: 'www.apple.com', control: 'input' },
    { accountName: 'Main Phone', values: '+80 9894943344', control: 'input' },
    { accountName: 'Headquarters name', values: '', control: 'input' },
    { accountName: 'Standard Industry Classification (SIC)', values: '', control: 'input' },
    { accountName: 'Stock exchange', values: '', control: 'input' },
    { accountName: 'Stock symbol', values: '', control: 'input' },
    { accountName: 'Email id', values: '', control: 'input' },
    { accountName: 'Bussiness Discription', values: '', control: 'input' },
  ]
  AddressDetailseEdit = [
    { accountName: 'Street 1', values: '', control: 'disabledinput' },
    { accountName: 'Street 2', values: '', control: 'disabledinput' },
    { accountName: 'City', values: '', control: 'disabledinput' },
    { accountName: 'Country', values: 'Please select the country', control: 'select' },
    { accountName: 'Country/ Region', values: '', control: 'select' },
    // { accountName: 'City region list', values: '', control: 'editselect' },
    { accountName: 'Country sub-division', values: '', placeholder: 'Enter country sub-division', control: 'input' },
    { accountName: 'State province', values: '', control: 'select' },
    { accountName: 'Zip code', values: '', control: 'disabledinput' },
  ]
  AnalysisDetailseEdit = [
    { accountName: 'Company brief', values: '-', control: 'input' },
    { accountName: 'No of CBUs that can outsource', values: '', control: 'editinput' },
    { accountName: 'Forbes 1000 rank', values: '-', control: 'input' },
    { accountName: 'Gross profits', values: '-', control: 'input' },
    { accountName: 'Company News', values: '-', control: 'input' },
    { accountName: 'Industry Trends', values: '-', control: 'input' },
    { accountName: 'Outlook', values: '-', control: 'editinput' },
    { accountName: 'SWOT', values: '-', control: 'editinput' },
  ]
  landscapeDetailseEdit = [
    { accountName: 'IT landscape', values: '-', control: 'input' },
  ]
  CustBusinessTable = [
    { thead1: 'Active buyer organization', thead2: 'Customer contact', thead4: 'Status', thead5: '' },
  ]
  CustBusinessTable2 = [
    { tbody1: 'Digital', tbody2: 'Deep Shankar', tbody3: 'Manager', tbody4: 'Active', tbody5: '' },
    { tbody1: 'Technology', tbody2: 'Deep Shankar', tbody3: 'Manager', tbody4: 'Deactive', tbody5: '' },
    { tbody1: 'Infrastructure', tbody2: 'Deep Shankar', tbody3: 'Manager', tbody4: 'Active', tbody5: '' },
    { tbody1: 'Cloud', tbody2: 'Deep Shankar', tbody3: 'Manager', tbody4: 'Active', tbody5: '' },
  ]
  //chethana April 1
  advLookupCurrency;
  submitted;
  advSub_and_vertical;
  advlocation_temp;
  constructor(public dialog: MatDialog,
    public userdat: DataCommunicationService,
    public service: AccountService,
    private masterApi: MasterApiService,
    private route: ActivatedRoute,
    public accountListService: AccountListService,
    public master3Api: S3MasterApiService,
    private EncrDecr: EncrDecrService,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe,
    public validate: ValidationService,
    private store: Store<AppState>,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService,
    public projectService: OpportunitiesService,
    private el: ElementRef

  ) {
    // console.log(route);
    // console.log("comment ::", this.AttributeComment)
    // get id from URL. will do after finishing readble view
    //&& route.snapshot.params.id 

    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
    //   this.SysGuidid = route.snapshot.params.id;
    //   //  this.SysGuidid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', route.snapshot.params.id, 'DecryptionDecrip');
    //   localStorage.setItem("accountSysId", aroute.snapshot.params.id);
    // } else {
    //   // this.SysGuidid = '';
    //   this.SysGuidid = localStorage.getItem('accountSysId');
    // }



    // let obj = JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeParams'), 'DecryptionDecrip'));

    let paramsObj = this.accountListService.getSession('routeParams');
    console.log(paramsObj);
    if (paramsObj && paramsObj['Id']) {
      this.SysGuidid = paramsObj['Id'];
      localStorage.setItem('accountSysId', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.SysGuidid, 'DecryptionDecrip'))
      sessionStorage.setItem('accountSysId', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.SysGuidid, 'DecryptionDecrip'))
    } else {
      this.SysGuidid = this.accountListService.getSession('accountid');
      // this.SysGuidid = localStorage.getItem('accountSysId');
    }

    // this.loggedin_user = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
    this.roleType = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip');
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
    console.log(this.IsHelpDesk);

  }
  isToggled(e, edit_ed, key) {
    console.log(e, edit_ed);
    edit_ed.Id = e.value;
    edit_ed[key] = edit_ed.Id ? 'Yes' : 'No';
  }
  getAttributeId(attr) {
    let ind = this.AccountAttribute.findIndex(acc => acc.AttributeName == attr);
    if (ind != -1) return this.AccountAttribute[ind].IsEdit;
    else return false;
  }

  getdateFormat(date) {
    let dateval = 'NA';
    if (date != null && date != undefined && date != '') {
      dateval = this.datePipe.transform(new Date(date), 'dd-MMM-yyyy');
    }
    return dateval;

  }   //CHETHANA july 30th


  getAllAttribute(arr) {
    let allattr = [];
    arr.fromEach(elt => {
      elt.forEach(e => {
        allattr.push(e.accountName || e.name);
      })
    });
  }

  routeToTransition() {

  }
  emailValidator(option, val) {
    if (val) {
      const isValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val);
      this.validatorsArray['Email'] = isValid;
      if (option) option.isValid = isValid;
      return isValid;
    }
    else {
      this.validatorsArray['Email'] = true;
      return true;
    }
  }
  websiteValidator(option, val) {
    if (val) {
      const isValid = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(val);
      this.validatorsArray['WebsiteUrl'] = isValid;
      if (option) option.isValid = isValid;
      return isValid;
    }
    else {
      this.validatorsArray['WebsiteUrl'] = true;
      return true;
    }
  }
  nameValidator(option, val) {
    if (val) {
      // const isValid = /^[A-Za-z]{1,100}$/.test(val);
      const isValid = val.length > 100 ? false : true;
      this.validatorsArray['HeadQuarters'] = isValid;
      if (option) option.isValid = isValid;
      return isValid;
    }
    else {
      this.validatorsArray['HeadQuarters'] = true;
      return true;
    }
  }
  assignAccountDetails(data) {
    this.accountDetails = [{
      accountName: 'Account name',
      fkey: 'Name',
      camunda_key: 'accountname',
      Id: '',
      values: data.Name ? this.accountListService.getSymbol(data.Name) : '',
      old_val: data.Name ? this.accountListService.getSymbol(data.Name) : '',
      control: (this.getAttributeId('name')) ? 'input' : 'disabledinput',
      isDisabled: false,
      comment: '',
      AttributeName: "name",
      tooltip: "Name given to the account within CRM, should ideally be same as the legal entity name.",

      validationKey: false,
      enableMandatory: true,
      validationKeyForAst: false
    }, {
      accountName: 'Account number',
      fkey: 'Number',
      camunda_key: 'accountid',
      Id: this.SysGuidid,
      values: data.Number ? data.Number : '',
      old_val: data.Number ? data.Number : '',
      control: (this.getAttributeId("number")) ? 'input' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "number",
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    },
    {
      accountName: 'Account type',
      fkey: 'Type',
      camunda_key: 'accounttype',
      Id: (this.userdat.validateKeyInObj(data, ['Type', 'Id'])) ? data.Type.Id : '', //184450003,
      values: (this.userdat.validateKeyInObj(data, ['Type', 'Value'])) ? data.Type.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['Type', 'Value'])) ? data.Type.Value : '',
      old_id: (this.userdat.validateKeyInObj(data, ['Type', 'Id'])) ? data.Type.Id : '',
      control: (this.getAttributeId('type_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: false,
      comment: '',
      AttributeName: "type_value",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'number',
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false

    },
    {
      accountName: 'Legal entity name',
      fkey: 'LegalEntity',
      camunda_key: 'legalentity',
      Id: '', //184450003,
      values: data.LegalEntity ? this.accountListService.getSymbol(data.LegalEntity) : '',
      old_val: data.LegalEntity ? this.accountListService.getSymbol(data.LegalEntity) : '',
      control: (this.getAttributeId('legalentity')) ? 'input' : 'disabledinput',
      isDisabled: false,
      comment: '',
      AttributeName: "legalentity",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'string',
      tooltip: "The legal entity name of the account. Will be fetched from D&B where available",
      validationKey: false,
      enableMandatory: true,
      validationKeyForAst: false

    },
    {
      accountName: 'Proposed account type',
      fkey: 'ProposedAccountType',
      camunda_key: 'proposedaccounttype',
      Id: (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Id'])) ? data.ProposedAccountType.Id : '',
      values: (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Value'])) ? data.ProposedAccountType.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Value'])) ? data.ProposedAccountType.Value : '',
      old_id: (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Id'])) ? data.ProposedAccountType.Id : '',
      control: (this.getAttributeId('proposedaccounttype_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: false,
      comment: '',
      AttributeName: "proposedaccounttype_value",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'number',
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    }, {
      accountName: 'Parent account',
      fkey: 'ParentAccount',
      camunda_key: 'parentaccount',
      Id: (this.userdat.validateKeyInObj(data, ['ParentAccount', 'SysGuid'])) ? data.ParentAccount.SysGuid : '',
      values: (this.userdat.validateKeyInObj(data, ['ParentAccount', 'Name'])) ? (data.ParentAccount.Name) : ((this.userdat.validateKeyInObj(data, ['ParentAccount', 'DNBParent'])) ? data.ParentAccount.DNBParent : ''),
      old_val: (this.userdat.validateKeyInObj(data, ['ParentAccount', 'Name'])) ? (data.ParentAccount.Name) : '',
      control: (this.getAttributeId('parentaccount_name')) ? 'searchinput' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "parentaccount_name",
      isAdvanceLookup: true,
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false,
      prevValue: (this.userdat.validateKeyInObj(data, ['ParentAccount', 'Name'])) ? (data.ParentAccount.Name) : ((this.userdat.validateKeyInObj(data, ['ParentAccount', 'DNBParent'])) ? data.ParentAccount.DNBParent : '')
    }, {
      accountName: 'Ultimate parent account',
      fkey: 'UltimateParentAccount',
      camunda_key: 'ultimateparent',
      Id: (this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'SysGuid'])) ? data.UltimateParentAccount.SysGuid : '',
      values: (this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'SysGuid'])) ? (data.UltimateParentAccount.Name) : ((this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'DNBUltimateParent'])) ? data.UltimateParentAccount.DNBUltimateParent : ''),
      old_val: (this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'SysGuid'])) ? (data.UltimateParentAccount.Name) : ((this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'DNBUltimateParent'])) ? data.UltimateParentAccount.DNBUltimateParent : ''),

      // control: 'disabledinput',   //searchinput 
      control: (this.getAttributeId('ultimateparentaccount_name')) ? 'searchinput' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "ultimateparentaccount_name",
      isAdvanceLookup: true,
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false,
      prevValue: (this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'SysGuid'])) ? (data.UltimateParentAccount.Name) : ((this.userdat.validateKeyInObj(data, ['UltimateParentAccount', 'DNBUltimateParent'])) ? data.UltimateParentAccount.DNBUltimateParent : '')
    },
    {
      accountName: 'Account classification',
      fkey: 'AccountClassification',
      camunda_key: 'newclassification',
      Id: (this.userdat.validateKeyInObj(data, ['AccountClassification', 'Id'])) ? data.AccountClassification.Id : '',
      values: (this.userdat.validateKeyInObj(data, ['AccountClassification', 'Value'])) ? data.AccountClassification.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['AccountClassification', 'Value'])) ? data.AccountClassification.Value : '',
      old_id: (this.userdat.validateKeyInObj(data, ['AccountClassification', 'Id'])) ? data.AccountClassification.Id : '',
      // control: 'disabledinput',   //dropdown 
      control: (this.getAttributeId('accountclassification_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "accountclassification_value",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'number',
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    }, //chethana june 28th
    {
      accountName: 'Proposed account classification',
      fkey: 'ProposedAccountClassification',
      camunda_key: 'proposedclassification',
      Id: (this.userdat.validateKeyInObj(data, ['ProposedAccountClassification', 'Id'])) ? data.ProposedAccountClassification.Id : '',
      old_val: (this.userdat.validateKeyInObj(data, ['ProposedAccountClassification', 'Value'])) ? data.ProposedAccountClassification.Value : '',
      old_id: (this.userdat.validateKeyInObj(data, ['ProposedAccountClassification', 'Id'])) ? data.ProposedAccountClassification.Id : '',
      values: (this.userdat.validateKeyInObj(data, ['ProposedAccountClassification', 'Value'])) ? data.ProposedAccountClassification.Value : '',
      // control: 'disabledinput',  //dropdown 
      control: (this.getAttributeId('proposedaccountclassification_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "proposedaccountclassification_value",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'number',
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    }, {
      accountName: 'Duns number',
      fkey: 'DUNSID',
      camunda_key: 'DUNSID',
      Id: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Id'])) ? data.DUNSID.SysGuid : '',
      values: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
      old_val: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',

      // control: 'disabledinput', //input
      control: (this.getAttributeId('dunsid')) ? 'input' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "dunsid",
      tooltip: "Defines the Unique Number from Duns and Bradstreet for each legal entity",
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    },
    {
      accountName: 'Private equity owned entity',
      fkey: 'IsPrivateEquityOwned',
      camunda_key: 'accountid',
      Id: (data.IsPrivateEquityOwned) ? true : false,
      values: (data.IsPrivateEquityOwned) ? 'Yes' : 'No',
      old_val: (data.IsPrivateEquityOwned) ? 'Yes' : 'No',
      control: (this.getAttributeId('isprivatequity')) ? 'radiobutton' : 'disabledradiobutton',
      isDisabled: false,
      comment: '',
      AttributeName: "isprivatequity",
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false
    },
    {
      accountName: 'Private equity account',
      fkey: 'PrivateEquityOwned',
      camunda_key: 'accountid',
      Id: (this.userdat.validateKeyInObj(data, ['PrivateEquityOwned', 'SysGuid'])) ? data.PrivateEquityOwned.SysGuid : '',
      values: (this.userdat.validateKeyInObj(data, ['PrivateEquityOwned', 'Name'])) ? (data.PrivateEquityOwned.Name) : '',
      old_val: (this.userdat.validateKeyInObj(data, ['PrivateEquityOwned', 'Name'])) ? (data.PrivateEquityOwned.Name) : '',
      control: (this.getAttributeId('privateequityAccount') && (data.IsPrivateEquityOwned && data.IsPrivateEquityOwned == true)) ? 'searchinput' : 'disabledinput',
      isDisabled: true,
      comment: '',
      AttributeName: "privateequityAccount",
      isAdvanceLookup: false,
      validationKey: false,
      enableMandatory: false,
      validationKeyForAst: false,
      prevValue: (this.userdat.validateKeyInObj(data, ['PrivateEquityOwned', 'Name'])) ? (data.PrivateEquityOwned.Name) : ''
    },
      // {
      //   accountName: 'Financial year',
      //   fkey: 'Number',
      //   camunda_key: 'accountid',
      //   Id: this.SysGuidid,
      //   values: 2019,
      //   old_val: data.Number ? data.Number : '',
      //   control: (this.getAttributeId("number")) ? 'input' : 'disabledinput',
      //   isDisabled: true,
      //   comment: '',
      //   AttributeName: "number"
      // },

    ];
  }
  assignOwnershipDetails(data) {
    console.log(data);
    this.ownershipDetails = [
      {
        name: 'SBU',
        fkey: 'SBU',
        camunda_key: 'sbu',
        Id: (this.userdat.validateKeyInObj(data, ['SBU', 'Id'])) ? data.SBU.Id : '',
        record: (this.userdat.validateKeyInObj(data, ['SBU', 'Name'])) ? data.SBU.Name : '',
        old_val: (this.userdat.validateKeyInObj(data, ['SBU', 'Name'])) ? data.SBU.Name : '',
        old_id: (this.userdat.validateKeyInObj(data, ['SBU', 'Id'])) ? data.SBU.Id : '',
        editname: 'SBU',
        editrecord: 'SBU',
        // control: 'disabledinput', // searchinput
        control: (this.getAttributeId('sbu_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: true,
        comment: '',
        AttributeName: "sbu_name",
        validationKey: false,
        enableMandatory: true,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (this.userdat.validateKeyInObj(data, ['SBU', 'Name'])) ? data.SBU.Name : '',
      }, {
        name: 'Vertical', //feb-18 Rupali
        fkey: 'Vertical',
        camunda_key: 'vertical',
        Id: (this.userdat.validateKeyInObj(data, ['Vertical', 'Id'])) ? data.Vertical.Id : '',
        record: (this.userdat.validateKeyInObj(data, ['Vertical', 'Name'])) ? data.Vertical.Name : '',
        old_val: (this.userdat.validateKeyInObj(data, ['Vertical', 'Name'])) ? data.Vertical.Name : '',
        old_id: (this.userdat.validateKeyInObj(data, ['Vertical', 'Id'])) ? data.Vertical.Id : '',
        editname: 'Vertical',
        editrecord: 'Vertical',
        // control: 'disabledinput', // searchinput
        control: (this.getAttributeId('vertical_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: true,
        comment: '',
        AttributeName: "vertical_name",
        validationKey: false,
        enableMandatory: true,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (this.userdat.validateKeyInObj(data, ['Vertical', 'Name'])) ? data.Vertical.Name : ''
      }, {
        name: 'Sub vertical',
        fkey: 'SubVertical',
        camunda_key: 'subvertical',
        Id: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Id'])) ? data.SubVertical.Id : '',
        record: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Name'])) ? data.SubVertical.Name : '',
        old_val: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Name'])) ? data.SubVertical.Name : '',
        old_id: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Id'])) ? data.SubVertical.Id : '',
        editname: 'Sub vertical',
        editrecord: 'Sub vertical',
        // control: 'disabledinput', // searchinput
        control: (this.getAttributeId('subvertical_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "subvertical_name",
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Name'])) ? data.SubVertical.Name : '',
      },
      {
        name: 'Standby account owner',
        fkey: 'StandByAccountOwner',
        camunda_key: 'standbyaccountowner',
        Id: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'SysGuid'])) ? data.StandByAccountOwner.SysGuid : '',
        record: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'FullName'])) ? data.StandByAccountOwner.FullName : '',
        old_val: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'FullName'])) ? data.StandByAccountOwner.FullName : '',

        editname: 'Standby account owner',
        editrecord: '',
        comment: '',
        // control: 'searchinput',
        // control: (this.getAttributeId('standbyaccountowner_fullname')) ? 'searchinput' : 'disabledinput',
        control: (this.getAttributeId('standbyaccountowner_fullname')) ? 'searchinput' : ((this.roleType == 3 && this.standByAccountOwner) ? 'searchinput' : 'disabledinput'),
        isAdvanceLookup: false,
        isComment: true,
        isDisabled: false,
        AttributeName: "standbyaccountowner_fullname",
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false,
      }, {
        name: 'Geo',
        fkey: 'Geo',
        camunda_key: 'geography',
        Id: (data.Geo && data.Geo.SysGuid && data.Geo.SysGuid != 'NA') ? data.Geo.SysGuid : '',
        record: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
        old_val: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
        old_id: (data.Geo && data.Geo.SysGuid && data.Geo.SysGuid != 'NA') ? data.Geo.SysGuid : '',
        editname: 'Geo',
        editrecord: '',

        control: (this.getAttributeId('geo_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        // control: 'disabledinput', //searchinput
        isDisabled: true,
        comment: '',
        AttributeName: "geo_name",
        validationKey: false,
        enableMandatory: true,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (data.Geo && data.Geo.Name) ? data.Geo.Name : ''
      }, {
        name: 'Region',
        fkey: 'Region',
        camunda_key: 'region',
        Id: (data.Region && data.Region.SysGuid) ? data.Region.SysGuid : '',
        record: (data.Region && data.Region.Name) ? data.Region.Name : '',
        old_val: (data.Region && data.Region.Name) ? data.Region.Name : '',
        old_id: (data.Region && data.Region.SysGuid) ? data.Region.SysGuid : '',
        editname: 'Region',
        editrecord: 'India',
        // control: 'searchinput', 
        control: (this.getAttributeId('address_region_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_region_name",
        validationKey: false,
        enableMandatory: true,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (data.Region && data.Region.Name) ? data.Region.Name : ''
      },
      {
        name: 'Country',
        fkey: 'CountryReference',
        camunda_key: 'country',
        Id: (data.Region && data.CountryReference.SysGuid) ? data.CountryReference.SysGuid : '',
        record: (data.CountryReference && data.CountryReference.Name) ? data.CountryReference.Name : '',
        old_val: (data.CountryReference && data.CountryReference.Name) ? data.CountryReference.Name : '',
        old_id: (data.Region && data.CountryReference.SysGuid) ? data.CountryReference.SysGuid : '',
        editname: 'Country',
        editrecord: 'India',
        // control: 'searchinput', 
        control: (this.getAttributeId('address_country_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_country_name",
        validationKey: false,
        enableMandatory: true,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (data.CountryReference && data.CountryReference.Name) ? data.CountryReference.Name : ''
      },//chethana added as per Nov 26th vd kindly bind accordingly
      {
        name: 'Country sub-division',
        fkey: 'CountrySubDivisionReference',
        camunda_key: 'state',
        Id: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.SysGuid) ? data.CountrySubDivisionReference.SysGuid : '',
        record: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.Name) ? data.CountrySubDivisionReference.Name : '',
        old_val: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.Name) ? data.CountrySubDivisionReference.Name : '',
        old_id: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.SysGuid) ? data.CountrySubDivisionReference.SysGuid : '',
        editname: 'Country sub-division',
        editrecord: 'India',
        // control: 'searchinput', 
        control: (this.getAttributeId('address_state_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_state_name",
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.Name) ? data.CountrySubDivisionReference.Name : ''
      },//chethana added as per Nov 26th vd kindly bind accordingly
      {
        name: 'City region',
        fkey: 'CityRegionReference',
        camunda_key: 'city',
        Id: (data.CityRegionReference && data.CityRegionReference.SysGuid) ? data.CityRegionReference.SysGuid : '',
        record: (data.CityRegionReference && data.CityRegionReference.Name) ? data.CityRegionReference.Name : '',
        old_val: (data.CityRegionReference && data.CityRegionReference.Name) ? data.CityRegionReference.Name : '',
        old_id: (data.CityRegionReference && data.CityRegionReference.SysGuid) ? data.CityRegionReference.SysGuid : '',
        editname: 'City region',
        editrecord: 'India',
        // control: 'searchinput', 
        control: (this.getAttributeId('address_city_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_city_name",
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false,
        prevValue: (data.CityRegionReference && data.CityRegionReference.Name) ? data.CityRegionReference.Name : ''
      },//chethana added as per Nov 26th vd kindly bind accordingly
      {
        name: 'Account delivery head',
        fkey: 'DeliveryManagerADHVDH',
        camunda_key: 'adh',
        Id: '',
        record: (data.DeliveryManagerADHVDHList && data.DeliveryManagerADHVDHList.length > 0) ? data.DeliveryManagerADHVDHList : [],
        // record: (this.userdat.validateKeyInObj(data, ['DeliveryManagerADHVDH', 'FullName'])) ? data.DeliveryManagerADHVDH['FullName'] : '',
        old_val: (data.DeliveryManagerADHVDHList && data.DeliveryManagerADHVDHList.length > 0) ? data.DeliveryManagerADHVDHList : [],

        editname: 'Account delivery head',
        editrecord: '',
        // control: 'input', // searchinput
        control: (this.getAttributeId('deliverymanageradhvdh_value')) ? 'input' : 'disabledDiv',
        isAdvanceLookup: false,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "deliverymanageradhvdh_value",
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false
      },
      {//chethana july 3rd split adh/vdh
        name: 'Vertical delivery head',
        fkey: 'VDH',
        camunda_key: 'vdh',
        Id: '',
        record: (this.userdat.validateKeyInObj(data, ['VDH', 'FullName'])) ? data.VDH['FullName'] : '',
        old_val: (this.userdat.validateKeyInObj(data, ['VDH', 'FullName'])) ? data.VDH['FullName'] : '',
        editname: 'Vertical delivery head',
        editrecord: '',
        control: (this.getAttributeId('vdh_fullname')) ? 'input' : 'disabledDiv',
        isAdvanceLookup: false,
        isComment: true,
        comment: '',
        isDisabled: false,
        AttributeName: 'vdh_fullname',
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false
      },
      {
        name: 'Account owner',
        fkey: 'Owner',
        camunda_key: 'owner',
        Id: (this.userdat.validateKeyInObj(data, ['Owner', 'SysGuid'])) ? data.Owner.SysGuid : '',
        record: (this.userdat.validateKeyInObj(data, ['Owner', 'FullName'])) ? data.Owner.FullName : '',
        old_val: (this.userdat.validateKeyInObj(data, ['Owner', 'FullName'])) ? data.Owner.FullName : '',
        old_id: (this.userdat.validateKeyInObj(data, ['Owner', 'SysGuid'])) ? data.Owner.SysGuid : '',
        editname: 'Account owner',
        editrecord: 'Kiran Sheth',
        control: (this.getAttributeId('owner_fullname')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        // control: 'popup', 
        isDisabled: false,
        comment: '',
        AttributeName: "owner_fullname",
        validationKey: false,
        enableMandatory: true,
        disablefield: false

        //let ind =  ownershipDetails.findIndex(own => own.fkey == StandByAccountOwner);
        // ownershipDetails[ind]['Id'] = 
        // ownershipDetails[ind]['record'] = 
      },
      {//Kunal August 31st
        name: 'Account delivery manager',
        fkey: 'ADM',
        camunda_key: 'adm',
        Id: '',
        record: (this.userdat.validateKeyInObj(data, ['ADM', 'FullName'])) ? data.ADM['FullName'] : '',
        old_val: (this.userdat.validateKeyInObj(data, ['ADM', 'FullName'])) ? data.ADM['FullName'] : '',
        editname: 'Account delivery manager',
        editrecord: '',
        control: (this.getAttributeId('adm_fullname')) ? 'mutliselectsearchinput' : 'mutliselectsearchinput',
        isAdvanceLookup: false,
        isComment: true,
        comment: '',
        isDisabled: false,
        AttributeName: 'adm_fullname',
        validationKey: false,
        enableMandatory: false,
        validationKeyForAst: false,
        disablefield: false
      },
    ];
  }
  cbuFieldsVisibility(i) {
    if (i <= 1) {
      return true;
    } else {
      return false;
    }
  }
  assignCustomerBusinessUnit(data) {
    this.CustomerBusinessUnit = {
      name: 'CustomerBusinessUnit',
      fkey: 'CustomerBusinessUnit',
      camunda_key: '',
      Id: '',
      // tableHead: ['Customer Business Unit', 'Customer contact', 'Status'], // , 'BDM Name', 'Status'
      tableHead: [{ title: 'Customer Business Unit', name: 'Name', controlType: "text" }, { title: 'Status', name: 'Status', controlType: "text" }, { title: 'BuyerOrg', name: 'BuyerOrg', controlType: "radio" }], // , 'BDM Name', 'Status'
      record: (data.CustomerBusinessUnit) ? data.CustomerBusinessUnit : [],
      old_val: (data.CustomerBusinessUnit) ? data.CustomerBusinessUnit : [],

      editname: 'CustomerBusinessUnit',
      editrecord: 'Customer Business Unit',
      control: 'list',
      comment: '',
      isDisabled: true
    };

  }
  assignCreditDetails(data) {
    this.creditDetails = [{
      // creditname: 'Credit (Delinquency) score',
      creditname: 'Market risk score',
      fkey: 'MarketRisk',
      camunda_key: 'marketrisk',
      Id: data.MarketRisk && data.MarketRisk.Id ? data.MarketRisk.Id : '',
      vals: data.MarketRisk && data.MarketRisk.Value ? data.MarketRisk.Value : '',
      old_val: data.CreditScore ? data.CreditScore : '',

      // editcreditname: 'Credit (Delinquency) score',
      editcreditname: ' Market risk score',
      editcreditvals: '',
      // control: 'disableinput', ////input
      control: (this.getAttributeId('marketrisk')) ? 'dropdown' : 'disabledinput',
      isDisabled: true,
      comment: '',
      datatype: 'number',
      maxlength: 14,
      minlimit: 1,
      maxlimit: 900,
      AttributeName: "marketrisk",
      tooltip: "D&B's Marketing risk scores predict the likelihood of a firm paying in a severely delinquent manner (90+ days past terms) over the next 12 months"
    }

      // {
      //   creditname: 'Credit score commentary',
      //   fkey: 'CreditScoreCommentary',
      //   Id: '',
      //   vals: data.CreditScoreCommentary ? data.CreditScoreCommentary : '-',
      //   editcreditname: 'Credit score commentary',
      //   editcreditvals: '',
      //   control: 'disableinput',
      //   isDisabled: true
      // },
      // {
      //   creditname: 'Legal structure (Partner, Corporation etc.)',
      //   fkey: '',
      //   Id: '',
      //   vals: (data.LegalStructure && data.LegalStructure.Value) ? data.LegalStructure.Value : '-',
      //   editcreditname: 'Legal structure (Partner, Corporation etc.)',
      //   editcreditvals: 'Format 1',
      //   control: 'disableinput',
      //   isDisabled: true
      // },
      //{
      //   creditname: 'Credit score commentary',
      //   fkey: 'CreditScoreCommentary',
      //   Id: '',
      //   vals: data.CreditScoreCommentary ? data.CreditScoreCommentary : '-',
      //   editcreditname: 'Credit score commentary',
      //   editcreditvals: '30',
      //   control: 'disableinput',
      //   isDisabled: true
      // }, {
      //   creditname: 'Failure risk (Financial stress)',
      //   fkey: '',
      //   Id: '',
      //   vals: '-',
      //   editcreditname: 'Failure risk (Financial stress)',
      //   editcreditvals: 'Risk 1',
      //   control: 'disableinput',
      //   isDisabled: true
      // }, {
      //   creditname: 'Legal structure (Partner, Corporation etc.)',
      //   fkey: '',
      //   Id: '',
      //   vals: (data.LegalStructure && data.LegalStructure.Value) ? data.LegalStructure.Value : '-',
      //   editcreditname: 'Legal structure (Partner, Corporation etc.)',
      //   editcreditvals: 'Format 1',
      //   control: 'disableinput',
      //   isDisabled: true
      // }
      //{
      //   creditname: 'Credit score commentary',
      //   fkey: 'CreditScoreCommentary',
      //   Id: '',
      //   vals: data.CreditScoreCommentary ? data.CreditScoreCommentary : '-',
      //   editcreditname: 'Credit score commentary',
      //   editcreditvals: '30',
      //   control: 'disableinput',
      //   isDisabled: true
      // }, {
      //   creditname: 'Failure risk (Financial stress)',
      //   fkey: '',
      //   Id: '',
      //   vals: '-',
      //   editcreditname: 'Failure risk (Financial stress)',
      //   editcreditvals: 'Risk 1',
      //   control: 'disableinput',
      //   isDisabled: true
      // }, {
      //   creditname: 'Legal structure (Partner, Corporation etc.)',
      //   fkey: '',
      //   Id: '',
      //   vals: (data.LegalStructure && data.LegalStructure.Value) ? data.LegalStructure.Value : '-',
      //   editcreditname: 'Legal structure (Partner, Corporation etc.)',
      //   editcreditvals: 'Format 1',
      //   control: 'disableinput',
      //   isDisabled: true
      // }

    ];
  }
  assignEngageDetails(data) {

    this.engageDetails = [{
      name: 'Account category',
      fkey: 'AccountCategory',
      camunda_key: 'accountcategory',
      Id: this.userdat.validateKeyInObj(data, ['AccountCategory', 'Id']) ? data.AccountCategory.Id : '',
      vals: (this.userdat.validateKeyInObj(data, ['AccountCategory', 'Value'])) ? data.AccountCategory.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['AccountCategory', 'Value'])) ? data.AccountCategory.Value : '',
      old_id: this.userdat.validateKeyInObj(data, ['AccountCategory', 'Id']) ? data.AccountCategory.Id : '',
      editname: 'Account category',
      editvals: 'India',
      // control: 'dropdown', 
      control: (this.getAttributeId('accountcategory_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: false,
      isComment: true,
      comment: '',
      AttributeName: "accountcategory_value",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'number'
    },
    // {
    //   name: 'Territory flag',
    //   fkey: 'TerritoryFlag',
    // camunda_key: 'territoryflag',
    //   Id: (data.TerritoryFlag) ? 'Yes' : 'No',
    //   vals: (data.TerritoryFlag) ? 'Yes' : 'No',
    //   editname: 'Territory flag',
    //   editvals: 'India',
    //   // control: 'dropdown',
    //   control: (this.getAttributeId('territoryflag_value')) ? 'dropdown' : 'disabledinput',                                                      
    //   isDisabled: false,
    //   AttributeName:"territoryflag_value",
    // }, 
    {
      name: 'Government account',
      fkey: 'IsGovAccount',
      camunda_key: 'governmentaccount',
      Id: (data.IsGovAccount) ? true : false,
      vals: (data.IsGovAccount) ? 'Yes' : 'No',
      old_val: (data.IsGovAccount) ? 'Yes' : 'No',

      editname: 'Government account',
      editvals: 'India',
      // control: 'dropdown',
      control: (this.getAttributeId('isgovaccount')) ? 'radiobutton' : 'disabledradiobutton',
      isDisabled: false,
      isComment: true,
      comment: '',
      AttributeName: "isgovaccount",
    }, {
      name: 'New age business',
      fkey: 'IsNewAgeBusiness',
      camunda_key: 'newagebusinessacc',
      Id: (data.IsNewAgeBusiness) ? true : false,
      vals: (data.IsNewAgeBusiness) ? 'Yes' : 'No',
      old_val: (data.IsNewAgeBusiness) ? 'Yes' : 'No',

      editname: 'New age business',
      editvals: 'India',
      // control: 'dropdown',
      control: (this.getAttributeId('isnewagebusiness')) ? 'radiobutton' : 'disabledradiobutton',
      isComment: false,
      isDisabled: false,
      comment: '',
      AttributeName: "isnewagebusiness",
      tooltip: 'Marks the account as a New Age Business account to keep focus on these accounts. New Age Businesses are accounts which could be potential unicorns, and could soon be your top customers.'
    },
    {
      name: 'Pursued opportunity scope/tenure/other remarks',
      fkey: 'PursuedopportunityRemarks',
      camunda_key: 'pursuedopportunityremarks',
      Id: '',
      vals: data.PursuedopportunityRemarks || '',
      old_val: data.PursuedopportunityRemarks || '',

      editname: 'Pursued opportunity scope/tenure/other remarks',
      editvals: 'India',
      // control: 'textarea',
      control: (this.getAttributeId('pursuedopportunityscoperemarks')) ? 'textarea' : 'disabledTextArea',
      isDisabled: false,
      isComment: false,
      comment: '',
      AttributeName: "pursuedopportunityscoperemarks",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'string'
    }];
  }
  assignAccstructure(data) {
    this.Accstructure = [{
      name: 'Account life cycle stage',
      fkey: 'LifeCycleStage',
      camunda_key: 'lifecyclestage',
      Id: (this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Id'])) ? data.LifeCycleStage.Id : null,//'',
      vals: (this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Value'])) ? data.LifeCycleStage.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Value'])) ? data.LifeCycleStage.Value : '',

      isDisabled: false,
      control: (this.getAttributeId('lifecyclestage_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      AttributeName: "lifecyclestage_value",
      comment: '',
      minlimit: -1000000000000000,
      maxlimit: 100000000000000,
      datatype: 'number'
    }, {
      name: 'Revenue category ($Mn)',
      fkey: 'RevenueCategory',
      camunda_key: 'revenueinmn',
      Id: (this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Id'])) ? data.RevenueCategory.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Value'])) ? data.RevenueCategory.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Value'])) ? data.RevenueCategory.Value : '',

      isDisabled: false,
      control: (this.getAttributeId('revenuecategory_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      AttributeName: "revenuecategory_value",
      comment: '',
      minlimit: -1000000000000000,
      maxlimit: 100000000000000,
      datatype: 'number',
      tooltip: "The Revenue Category represents the potential annualized run rate for revenue in 18-24 months.It gives an indication of what revenue band account should be in and therefore how we should serve them."
    }, {
      name: 'Growth category (in %)',
      fkey: 'GrowthCategory',
      camunda_key: 'growthcategory',
      Id: (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Id'])) ? data.GrowthCategory.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Value'])) ? data.GrowthCategory.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Value'])) ? data.GrowthCategory.Value : '',

      control: (this.getAttributeId('growthcategory_value')) ? 'dropdown' : 'disabledinput',
      isDisabled: false,
      isComment: true,
      AttributeName: "growthcategory_value",
      comment: '',
      minlimit: -1000000000000000,
      maxlimit: 100000000000000,
      datatype: 'number',
      tooltip: "The Growth Category represents the anticipated revenue growth rate over the next 12 months."
    }, {
      name: 'Coverage level (in %)',
      fkey: 'CoverageLevel',
      camunda_key: 'coveragelevel',
      Id: (this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Id'])) ? data.CoverageLevel.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Value'])) ? data.CoverageLevel.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Value'])) ? data.CoverageLevel.Value : '',

      isDisabled: false,
      control: (this.getAttributeId('coveragelevel_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      AttributeName: "coveragelevel_value",
      comment: '',
      minlimit: -1000000000000000,
      maxlimit: 100000000000000,
      datatype: 'number',
      tooltip: "The Coverage Level represents the allocation of time to the account by the Account owner."
    }, {
      name: 'Relationship status',
      fkey: 'RelationShipStatus',
      camunda_key: 'relationshipstatu',
      Id: (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Id'])) ? data.RelationShipStatus.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Value'])) ? data.RelationShipStatus.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Value'])) ? data.RelationShipStatus.Value : '',

      isDisabled: false,
      control: (this.getAttributeId('relationshipstatus_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      comment: '',
      AttributeName: "relationshipstatus_value",
    },
    // as on 5th Feb, instructed by Ayesha, there will be ownership type instead of organization type
    // changes made by divya
    //  {
    //   name: 'Organization type',
    //   fkey: 'OwnershipType',
    //   camunda_key: 'organizationtype',
    //   Id: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Id'])) ? data.OrganizationType.Id : null,
    //   vals: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',
    //   old_val: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',

    //   isDisabled: false,
    //   control: (this.getAttributeId('organizationtype_value')) ? 'dropdown' : 'disabledinput',
    //   isComment: true,
    //   comment: '',
    //   AttributeName: "organizationtype_value",
    // },
    //chethana added entity type Aug 30th
    {
      name: 'Entity type',
      fkey: 'EntityType',
      camunda_key: 'entitytype',
      Id: (this.userdat.validateKeyInObj(data, ['EntityType', 'Id'])) ? data.EntityType.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',

      isDisabled: false,
      control: (this.getAttributeId('entitytype_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      comment: '',
      AttributeName: "entitytype_value",
      tooltip: "The types Subsidiary and Branch must always have a Parent account."
    },
    {
      name: 'Ownership type',
      fkey: 'OwnershipType',
      camunda_key: 'ownershiptype',
      Id: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Id'])) ? data.OrganizationType.Id : null,
      vals: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',
      isDisabled: false,
      control: (this.getAttributeId('ownershiptype_value')) ? 'dropdown' : 'disabledinput',
      isComment: true,
      comment: '',
      AttributeName: "ownershiptype_value",
      tooltip: "The Ownership Type indicates the type of legal or structural entity of the CRM account."
    }
    ];
  }
  assignCustomDetails(data) {
    this.CustomDetails = [{
      name: 'Currency',
      fkey: 'Currency',
      camunda_key: 'currency',
      Id: this.userdat.validateKeyInObj(data, ['Currency', 'Id']) ? data.Currency.Id : '',
      vals: (this.userdat.validateKeyInObj(data, ['Currency', 'Value'])) ? data.Currency.Value : '',
      old_val: (this.userdat.validateKeyInObj(data, ['Currency', 'Value'])) ? data.Currency.Value : '',
      isAdvanceLookup: true,
      //control: 'disabledinput',
      control: (this.getAttributeId('currency_value')) ? 'searchinput' : 'disabledselect',
      datatype: 'string',
      isComment: true,
      isDisabled: true,
      AttributeName: "currency_value",
      comment: '',
      validationKey: false,
      enableMandatory: true,
      prevValue: (this.userdat.validateKeyInObj(data, ['Currency', 'Value'])) ? data.Currency.Value : '',
    }, {
      name: 'Website',
      fkey: 'WebsiteUrl',
      camunda_key: 'websiteurl',
      Id: '',
      vals: (data.WebsiteUrl) ? data.WebsiteUrl : '',
      old_val: (data.WebsiteUrl) ? data.WebsiteUrl : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('websiteurl')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      isValid: this.websiteValidator(null, data.WebsiteUrl),
      comment: '',
      datatype: 'string',
      maxlength: 200,
      AttributeName: "websiteurl",
      validationKey: false,
      enableMandatory: false
    }, {
      name: 'Main phone',
      fkey: 'Contact',
      camunda_key: 'mainphone',
      Id: '',
      vals: (data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '',
      old_val: (data.Contact && data.Contact.ContactNo) ? data.Contact.ContactNo : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('contact_contactno')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      datatype: 'number',
      minlimit: 1,
      maxlimit: 10000000000000000000,
      maxlength: 20,
      AttributeName: "contact_contactno",
      validationKey: false,
      enableMandatory: false
    },
    { //chethana july 3rd added email id
      name: 'Email ID',
      fkey: 'Email',
      camunda_key: 'email',
      Id: '',
      vals: (data.Email) ? data.Email : '',
      old_val: (data.Email) ? data.Email : '',
      isAdvanceLookup: false,
      // control: 'input',
      control: (this.getAttributeId('email')) ? 'input' : 'disabledinput',
      isComment: false,
      isValid: this.emailValidator(null, data.Email),
      isDisabled: false,
      comment: '',
      datatype: 'string',
      maxlength: 100,
      AttributeName: "email",
      validationKey: false,
      enableMandatory: false
    },
    {
      name: 'Headquarters name',
      fkey: 'HeadQuarters',
      camunda_key: '',
      Id: '',
      vals: (data.HeadQuarters) ? data.HeadQuarters : '',
      old_val: (data.HeadQuarters) ? data.HeadQuarters : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('headquarters')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      isValid: this.nameValidator(null, data.HeadQuarters),
      datatype: 'string',
      maxlength: 100,
      AttributeName: "headquarters",
      validationKey: false,
      enableMandatory: false
    },
    {
      name: 'Standard Industry Classification (SIC)',
      fkey: 'SIC',
      camunda_key: 'sic',
      Id: '',
      vals: (data.SIC && data.SIC.Name) ? data.SIC.Name : '',
      old_val: (data.SIC && data.SIC.Name) ? data.SIC.Name : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('sic_name')) ? 'input' : 'disabledinput',
      isComment: true,
      isDisabled: true,
      comment: '',
      datatype: 'string',
      maxlength: 2000,
      AttributeName: "sic_name",
      validationKey: false,
      enableMandatory: false
    }, {
      name: 'Stock exchange',
      fkey: 'StockExchange',
      camunda_key: 'stockexchange',
      Id: '',
      vals: (data.StockExchange) ? data.StockExchange : '',
      old_val: (data.StockExchange) ? data.StockExchange : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('stockexchange')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "stockexchange",
      validationKey: false,
      enableMandatory: false
    }, {
      name: 'Stock symbol',
      fkey: 'StockSymbol',
      camunda_key: 'stocksymbol',
      Id: '',
      vals: (data.StockSymbol) ? data.StockSymbol : '',
      old_val: (data.StockSymbol) ? data.StockSymbol : '',
      isAdvanceLookup: false,
      // control: 'disabledinput',
      control: (this.getAttributeId('stocksymbol')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "stocksymbol",
      validationKey: false,
      enableMandatory: false
    },

    { //chethana july 3rd added Businessdescription
      name: 'Business description',
      fkey: 'BusinessDescription',
      camunda_key: 'businessdescription',
      Id: '',
      vals: (data.BusinessDescription) ? data.BusinessDescription : '',
      old_val: (data.BusinessDescription) ? data.BusinessDescription : '',
      isAdvanceLookup: false,
      // control: 'input',
      control: (this.getAttributeId('businessdescription')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: false,
      comment: '',
      datatype: 'string',
      maxlength: 2000,
      AttributeName: "businessdescription",
      validationKey: false,
      enableMandatory: false
    }
    ];
    console.log('CustomDetails', this.CustomDetails, data)
  }

  /******************chethana  April 1st ADM  mutliselect start ****************** */

  contactName2: string;
  contactNameSwitch2: boolean;
  getFilterOwnerData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        let initials = data.FullName.split(" ");
        return {
          initials: initials.length == 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          Name: data.FullName,
          SysGuid: data.SysGuid,
          MapGuid: data.MapGuid ? data.MapGuid : "",
          designation: data.Designation,
          email: data.Email,
          adid: data.AdId,
          LinkActionType: data.LinkActionType ? data.LinkActionType : 1
        }
      })
    }
  }
  remove_duplicates_Accounts(b, a) {
    for (let j = 0; j < b.length; j++) {
      for (let i = 0; i < a.length; i++) {
        if (b[j].SysGuid == a[i].SysGuid) {
          a.splice(i, 1);
          // break;
        }
      }
    }
    return a;
  }
  selectedOwner = [];
  wiproContact2: { index: number, contact: string, designation: string, initials: string, value: boolean }[] = [];
  //  wiproContact2: {index:number,contact:string,designation:string,initials:string,value:boolean}[]= [

  //    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //    { index: 2, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //  ];
  appendOwner(item, index) {

    this.selectedOwner.push(this.wiproContact2.find((val) => val.index == index));
    this.contactNameSwitch2 = false;
  }

  adjustHeight() {
    //  this.selectedOwner.length <= 1 ? "return 'mb-180'": this.selectedOwner.length == 2 ? "return 'mb-150'": this.selectedOwner.length == 3 ? "return 'mb-10'":""
    if (this.contactNameSwitch2) {
      switch (this.selectedOwner && this.selectedOwner.length ? this.selectedOwner.length : 0) {
        case 0:
          return 'mb-186'

        case 1:
          return 'mb-110'

        case 2:
          return 'mb-55'

        default:
          return ''
      }
    }
  }

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }

  removeOwner(item) {
    console.log(JSON.stringify(this.selectedOwner) + 'before splice');
    if (item.LinkActionType == 2) {
      let ind = this.selectedOwner.findIndex(ele => ele.SysGuid == item.SysGuid)
      if (ind != -1) {
        this.selectedOwner[ind]['LinkActionType'] = 3;
        console.log(this.selectedOwner);
      }
      else { }
    }
    else this.selectedOwner = this.selectedOwner.filter((value) => value.SysGuid != item.SysGuid);
    console.log(JSON.stringify(this.selectedOwner) + 'after splice');
  }
  findActveAdms() {
    return this.selectedOwner.filter(ele => ele.LinkActionType != 3).length;
  }
  accountOwnerSearch(a) { }



  /****************** chethana  April 1st ADM  mutliselect end ****************** */

  assignAddressDetails(data) {
    this.addressDetails = [{
      name: 'Street1',
      fkey: 'Address1',
      camunda_key: 'address1',
      Id: '',
      vals: (data.Address && data.Address.Address1) ? data.Address.Address1 : '',
      old_val: (data.Address && data.Address.Address1) ? data.Address.Address1 : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('addresss_address1')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "addresss_address1",
    }, {
      name: 'Street2',
      fkey: 'Address2',
      camunda_key: 'address2',
      Id: '',
      vals: (data.Address && data.Address.Address2) ? data.Address.Address2 : '',
      old_val: (data.Address && data.Address.Address2) ? data.Address.Address2 : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('addresss_address2')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "addresss_address2",
    },
    {
      name: 'City region',
      fkey: 'City',
      camunda_key: 'citystring',
      Id: '',
      vals: (data.Address && data.Address.City && data.Address.City.Name) ? data.Address.City.Name : '',
      old_val: (data.Address && data.Address.City && data.Address.City.Name) ? data.Address.City.Name : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('address_citystring')) ? 'input' : 'disabledinput',
      isComment: true,
      isDisabled: true,
      comment: '',
      AttributeName: "address_citystring",
    },
    {
      name: 'Country sub-division',
      fkey: 'SubDivision',
      camunda_key: 'subdivision',
      Id: '',//(data.Address && data.Address.SubDivision && data.Address.SubDivision.SysGuid) ? data.Address.SubDivision.SysGuid : '',
      vals: (data.Address && data.Address.SubDivision && data.Address.SubDivision.Name) ? data.Address.SubDivision.Name : '',
      old_val: (data.Address && data.Address.SubDivision && data.Address.SubDivision.Name) ? data.Address.SubDivision.Name : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('addresss_subdivision_name')) ? 'input' : 'disabledinput',
      isDisabled: true,
      isComment: true,
      comment: '',
      AttributeName: "addresss_subdivision_name",
    },
    {
      name: 'Zip code',
      fkey: 'ZipCode',
      camunda_key: '',
      Id: '',
      vals: (data.Address && data.Address.ZipCode) ? data.Address.ZipCode : '',
      old_val: (data.Address && data.Address.ZipCode) ? data.Address.ZipCode : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('addresss_zipcode')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "addresss_zipcode",
      datatype: 'string',
      minlimit: 100000,
      maxlimit: 999999,
      maxlength: 20,
    }, {
      name: 'Country',
      fkey: 'Country',
      camunda_key: 'countrystring',
      Id: '',//(data.Address && data.Address.Country && data.Address.Country.SysGuid) ? data.Address.Country.SysGuid : '',
      vals: (data.Address && data.Address.Country && data.Address.Country.Name) ? data.Address.Country.Name : '',
      old_val: (data.Address && data.Address.Country && data.Address.Country.Name) ? data.Address.Country.Name : '',

      //  control: 'editselect',
      control: (this.getAttributeId('address_countrystring')) ? 'input' : 'disabledinput',
      isComment: true,
      isDisabled: false,
      comment: '',
      AttributeName: "address_countrystring",
    },
      // {
      //   // name: 'State province',
      //   name: 'Country sub-division',
      //   fkey: 'State_Province',
      //   camunda_key: '',
      //   Id: '',
      //   vals: (data.Address && data.Address.State_Province) ? data.Address.State_Province : '',
      //   old_val: (data.Address && data.Address.State_Province) ? data.Address.State_Province : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('addresss_state_province')) ? 'input' : 'disabledinput',
      //   isDisabled: true,
      //   comment: '',
      //   AttributeName: "addresss_state_province",
      // },
      // {
      //   name: 'City region',
      //   fkey: 'City',
      //   camunda_key: 'city',
      //   Id: (data.Address && data.Address.City && data.Address.City.SysGuid) ? data.Address.City.SysGuid : '',
      //   vals: (data.Address && data.Address.City && data.Address.City.Name) ? data.Address.City.Name : '',
      //   old_val: (data.Address && data.Address.City && data.Address.City.Name) ? data.Address.City.Name : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('address_city_name')) ? 'input' : 'disabledinput',
      //   isDisabled: true,
      //   comment: '',
      //   AttributeName: "address_city_name",
      // }

      //  {
      //   name: 'Country sub-division/state',
      //   fkey: 'SubDivision',
      //   camunda_key: '',
      //   Id: (data.Address && data.Address.SubDivision && data.Address.SubDivision.SysGuid) ? data.Address.SubDivision.SysGuid : '',
      //   vals: (data.Address && data.Address.SubDivision && data.Address.SubDivision.Name) ? data.Address.SubDivision.Name : '',
      //   old_val: (data.Address && data.Address.SubDivision && data.Address.SubDivision.Name) ? data.Address.SubDivision.Name : '',

      //   control: 'editselect',
      //   //control: (this.getAttributeId('addresss_subdivision_name')) ? 'editselect' : 'disabledinput',
      //   isDisabled: false,
      //   comment: '',
      //   AttributeName: "addresss_subdivision_name",
      // },
      // { //chethana july 3rd uncommented city region
      //   name: 'City region',
      //   fkey: 'Region',
      //   camunda_key: 'region',
      //   vals: (data.Address && data.Address.Region && data.Address.Region.Name) ? data.Address.Region.Name : '',
      //   old_val: (data.Address && data.Address.Region && data.Address.Region.Name) ? data.Address.Region.Name : '',
      //   // control: (this.getAttributeId('address_country_name')) ? 'input' : 'disabledinput',

      //   control: 'select',
      //   comment: '',
      // }
      // ,
      //  {
      //   name: 'City Region List/City',
      //   fkey: 'Region',
      //   vals: (data.Address && data.Address.Region.Name) ? data.Address.Region.Name : '-',
      //   control: 'searchinput'
      // }
    ];
  }
  trendAnalysisField(i) {
    if (i <= 5) {
      return true
    } else {
      return false
    }
  }
  assignTrendsAnalysis(data) {
    let arr = [];
    if (data.TrendsNAnalysis)
      arr = Object.keys(data.TrendsNAnalysis);

    console.log(arr, arr.length);

    this.trendsAnalysis = [{

      name: 'Company brief',
      fkey: 'CompanyBrief',
      camunda_key: '',
      vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('CompanyBrief') != -1) ? true : false) ? data.TrendsNAnalysis.CompanyBrief : '',
      // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyBrief) ? data.TrendsNAnalysis.CompanyBrief : '-',
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyBrief) ? data.TrendsNAnalysis.CompanyBrief : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('trendsnanalysis_companybrief')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "trendsnanalysis_companybrief",
    }, {
      name: 'No of CBUs that can outsource',
      fkey: 'NoOfCBU',
      camunda_key: '',
      vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('NoOfCBU') != -1) ? true : false) ? data.TrendsNAnalysis.NoOfCBU.toString() : '',
      // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.NoOfCBU) ? data.TrendsNAnalysis.NoOfCBU : '-',
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.NoOfCBU) ? data.TrendsNAnalysis.NoOfCBU : '',

      // control: 'input',
      control: (this.getAttributeId('trendsnanalysis_noofcbu')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: false,
      comment: '',
      AttributeName: "trendsnanalysis_noofcbu",
      datatype: 'number',
      minlimit: -100000000000,
      maxlimit: 100000000000,
      maxlength: 12,
    }, {
      name: 'Forbes 1000 Rank',
      fkey: 'Forbes1000Rank',
      camunda_key: 'fortuneranking',
      vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Forbes1000Rank') != -1) ? true : false) ? data.TrendsNAnalysis.Forbes1000Rank.toString() : '',
      // valsd : (data.TrendsNAnalysis && (data.TrendsNAnalysis.Forbes1000Rank==0)? 0:(data.TrendsNAnalysis && data.TrendsNAnalysis.Forbes1000Rank && (data.TrendsNAnalysis.Forbes1000Rank!=0))? data.TrendsNAnalysis.Forbes1000Rank :'' ),
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.Forbes1000Rank) ? data.TrendsNAnalysis.Forbes1000Rank : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('trendsnanalysis_forbes1000rank')) ? 'input' : 'disabledinput',
      isComment: false,
      comment: '',
      isDisabled: true,
      AttributeName: "trendsnanalysis_forbes1000rank",
      datatype: 'number',
      minlimit: 1,
      maxlimit: 1000,
      maxlength: 4,
    }, {
      name: 'Gross profits',
      fkey: 'Priofit',
      camunda_key: 'grossprofit',
      vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Priofit') != -1) ? true : false) ? data.TrendsNAnalysis.Priofit.toString() : '',
      // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.Priofit) ? data.TrendsNAnalysis.Priofit : '-',
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.Priofit) ? data.TrendsNAnalysis.Priofit : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('trendsnanalysis_profit')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "trendsnanalysis_profit",
      datatype: 'float',
      minlimit: -100000000000,
      maxlimit: 100000000000,
      maxlength: 16,
    },
    // {
    //   name: 'Company news',
    //   fkey: 'CompanyNews',
    //   camunda_key: '',
    //   vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('CompanyNews') != -1) ? true : false) ? data.TrendsNAnalysis.CompanyNews : '',

    //   // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',
    //   old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',

    //   // control: 'disabledinput',
    //   control: (this.getAttributeId('trendsnanalysis_companynews')) ? 'input' : 'disabledinput',
    //   isComment: false,
    //   isDisabled: true,
    //   comment: '',
    //   AttributeName: "trendsnanalysis_companynews",
    // },
    {
      name: 'External Information',
      fkey: 'CompanyNews',
      camunda_key: '',
      // vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('CompanyNews') != -1) ? true : false) ? data.TrendsNAnalysis.CompanyNews : '',

      // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',

      control: 'link',
      // control: (this.getAttributeId('trendsnanalysis_companynews')) ? 'input' : 'links',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "trendsnanalysis_companynews",
    }, {
      name: 'Industry Trends',
      fkey: 'CompanyNews',
      camunda_key: '',
      vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('IndustryTrends') != -1) ? true : false) ? data.TrendsNAnalysis.IndustryTrends : '',

      // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',
      old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.IndustryTrends) ? data.TrendsNAnalysis.IndustryTrends : '',

      control: 'link',
      // control: (this.getAttributeId('trendsnanalysis_companynews')) ? 'input' : 'disabledinput',
      isComment: false,
      isDisabled: true,
      comment: '',
      AttributeName: "trendsnanalysis_companynews",
    },
      // {
      //   name: 'Country code',
      //   fkey: 'Countrycode',
      //   camunda_key: 'countrycode',
      //   Id: '',
      //   vals: (data.Address && data.Address.CountryCode) ? data.Address.CountryCode : '',
      //   old_val: '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('address_countrycode')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   AttributeName: "address_countrycode",
      // },
      // {
      //   name: 'Employees',
      //   fkey: 'Employees',
      //   camunda_key: 'employees',
      //   Id: '',
      //   vals: data.EmployeeCount ? data.EmployeeCount : '',
      //   old_val: data.EmployeeCount ? data.EmployeeCount : '',
      //   control: (this.getAttributeId('employeecount')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   AttributeName: "employeecount",
      // },
      // {
      //   name: 'Revenue (in $Mn)',
      //   fkey: 'Revenue',
      //   camunda_key: '',
      //   vals: data.Revenue ? data.Revenue : '',
      //   old_val: data.Revenue ? data.Revenue : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('revenue')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   datatype: 'float',
      //   AttributeName: "revenue",
      // },
      // {
      //   name: 'Operating margin (%)',
      //   fkey: 'OperatingMargin',
      //   camunda_key: '',
      //   Id: '',
      //   vals: data.OperatingMargin ? data.OperatingMargin : '',
      //   old_val: data.OperatingMargin ? data.OperatingMargin : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('operatingmargin')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   datatype: 'float',
      //   AttributeName: "operatingmargin",
      // },
      // {
      //   name: 'Market value',
      //   fkey: 'MarketValue',
      //   camunda_key: '',
      //   Id: '',
      //   vals: data.MarketValue ? data.MarketValue : '',
      //   old_val: data.MarketValue ? data.MarketValue : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('marketvalue')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   datatype: 'float',
      //   AttributeName: "marketvalue",
      // },
      // {
      //   name: 'Return on equity',
      //   fkey: 'ReturnOnEquity ',
      //   camunda_key: '',
      //   Id: '',
      //   vals: data.ReturnOnEquity ? data.ReturnOnEquity : '',
      //   old_val: data.ReturnOnEquity ? data.ReturnOnEquity : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('returnonequity')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   isDisabled: true,
      //   comment: '',
      //   datatype: 'float',
      //   AttributeName: "returnonequity",
      // },
      // ,{
      //   name: 'Industry trends',
      //   fkey: 'IndustryTrends',
      //   camunda_key: '',
      //   vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('IndustryTrends') != -1) ? true : false) ? data.TrendsNAnalysis.IndustryTrends : '',
      //   // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.IndustryTrends) ? data.TrendsNAnalysis.IndustryTrends : '-',
      //   old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.IndustryTrends) ? data.TrendsNAnalysis.IndustryTrends : '',

      //   // control: 'disabledinput',
      //   control: (this.getAttributeId('trendsnanalysis_industrytrends')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   comment: '',
      //   isDisabled: true,
      //   AttributeName: "trendsnanalysis_industrytrends",
      // },
      // {
      //   name: 'Outlook',
      //   fkey: 'Outlook',
      //   vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Outlook') != -1) ? true : false) ? data.TrendsNAnalysis.Outlook : '',
      //   // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.Outlook) ? data.TrendsNAnalysis.Outlook : '-',
      //   old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.Outlook) ? data.TrendsNAnalysis.Outlook : '',

      //   // control: 'input',
      //   control: (this.getAttributeId('trendsnanalysis_outlook')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   comment: '',
      //   isDisabled: false,
      //   AttributeName: "trendsnanalysis_outlook",
      // }, {
      //   name: 'SWOT',
      //   fkey: 'Swot',
      //   camunda_key: '',
      //   vals: (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Swot') != -1) ? true : false) ? data.TrendsNAnalysis.Swot : '',
      //   // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.Swot) ? data.TrendsNAnalysis.Swot : '-',
      //   old_val: (data.TrendsNAnalysis && data.TrendsNAnalysis.Swot) ? data.TrendsNAnalysis.Swot : '',

      //   // control: 'input',
      //   control: (this.getAttributeId('trendsnanalysis_swot')) ? 'input' : 'disabledinput',
      //   isComment: false,
      //   comment: '',
      //   isDisabled: false,
      //   AttributeName: "trendsnanalysis_swot",
      // }
    ];
  }
  assignLandIT(data) {
    this.LandIT = [{
      name: 'IT landscape',
      fkey: 'ITLandScape',
      camunda_key: '',
      vals: (data.ITLandScape) ? data.ITLandScape : '',
      old_val: (data.ITLandScape) ? data.ITLandScape : '',

      // control: 'disabledinput',
      control: (this.getAttributeId('itlandscape')) ? 'input' : 'disabledinput',
      isComment: false,
      comment: '',
      isDisabled: false,
      AttributeName: "itlandscape",
    }];

  }
  assignAccountre(data) {
    this.accountre = [{
      name: 'Account life cycle stage',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      comment: '',
      isDisabled: false
    }, {
      name: 'Revenue category ($Mn)',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',
      isDisabled: false,
      control: (this.getAttributeId('revenuecategory_value')) ? 'input' : 'disabledinput',
      comment: '',
      AttributeName: "revenuecategory_value",
    }, {
      name: 'Growth category (in %)',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      comment: '',
      isDisabled: false
    }, {
      name: 'Growth category (in %)',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      comment: '',
      isDisabled: false
    }, {
      name: 'Relationship status',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      comment: '',
      isDisabled: false
    },
    {//chethana july 3rd added Entity type
      name: 'Entity type',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      isDisabled: false,
      control: (this.getAttributeId('entitytype_value')) ? 'dropdown' : 'disabledinput',
      AttributeName: "entitytype_value",
      comment: '',
      minlimit: -100000000000,
      maxlimit: 100000000000,
      datatype: 'number'
    }, {
      name: 'Organization type',
      fkey: '',
      camunda_key: '',
      vals: '',
      old_val: '',

      comment: '',
      isDisabled: false
    }];
  }
  assignSapDetails(data) {
    this.sapDetails = [{
      name: 'SAP group customer number',
      fkey: 'SAPGroupCustomerNumber',
      camunda_key: '',
      vals: (data.SAPDetails && data.SAPDetails.SAPGroupCustomerNumber) ? data.SAPDetails.SAPGroupCustomerNumber : '',
      old_val: (data.SAPDetails && data.SAPDetails.SAPGroupCustomerNumber) ? data.SAPDetails.SAPGroupCustomerNumber : '',

      isDisabled: false,
      control: (this.getAttributeId('sapdetails_sapgroupcustomernumber')) ? 'input' : 'disabledinput',
      comment: '',
      AttributeName: "sapdetails_sapgroupcustomernumber",
    }, {
      name: 'SAP customer code',
      fkey: 'SAPCustomerCode',
      camunda_key: '',
      vals: (data.SAPDetails && data.SAPDetails.SAPCustomerCode) ? data.SAPDetails.SAPCustomerCode : '',
      old_val: (data.SAPDetails && data.SAPDetails.SAPCustomerCode) ? data.SAPDetails.SAPCustomerCode : '',

      isDisabled: false,
      control: (this.getAttributeId('sapdetails_sapcustomercode')) ? 'input' : 'disabledinput',
      comment: '',
      AttributeName: "sapdetails_sapcustomercode",
    }, {
      name: 'SAP customer name',
      fkey: 'SAPCustomerName',
      camunda_key: '',
      vals: (data.SAPDetails && data.SAPDetails.SAPCustomerName) ? data.SAPDetails.SAPCustomerName : '',
      old_val: (data.SAPDetails && data.SAPDetails.SAPCustomerName) ? data.SAPDetails.SAPCustomerName : '',

      isDisabled: false,
      control: (this.getAttributeId('sapdetails_sapcustomername')) ? 'input' : 'disabledinput',
      comment: '',
      AttributeName: "sapdetails_sapcustomername",
    }, {
      name: 'SAP group customer name',
      fkey: 'SAPGroupCustomerName',
      camunda_key: '',
      vals: (data.SAPDetails && data.SAPDetails.SAPGroupCustomerName) ? data.SAPDetails.SAPGroupCustomerName : '',
      old_val: (data.SAPDetails && data.SAPDetails.SAPGroupCustomerName) ? data.SAPDetails.SAPGroupCustomerName : '',

      isDisabled: false,
      control: (this.getAttributeId('sapdetails_sapgroupcustomername')) ? 'input' : 'disabledinput',
      comment: '',
      AttributeName: "sapdetails_sapgroupcustomername",
    }];
  }
  assignVendorDetails(data) {
    this.vendorDetails = [{
      name: 'Relationship type',
      fkey: 'RelationShipType',
      camunda_key: '',
      Id: (data.RelationShipType && data.RelationShipType.Id) ? data.RelationShipType.Id : '',
      vals: (data.RelationShipType && data.RelationShipType.Name) ? data.RelationShipType.Name : '',
      old_val: (data.RelationShipType && data.RelationShipType.Name) ? data.RelationShipType.Name : '',

      // control: 'dropdown',
      isDisabled: false,
      control: (this.getAttributeId('relationshiptype_value')) ? 'dropdown' : 'disabledinput',
      comment: '',
      AttributeName: "relationshiptype_value"
    }
      //  {
      //   // name: 'Advisory/ Analyst relations',
      //   // control: 'searchinput',
      //   fkey: 'AdvisoryRAnalyst',
      //   camunda_key: '',
      //   Id: (data.AdvisoryRAnalyst && data.AdvisoryRAnalyst.SysGuid && data.AdvisoryRAnalyst.SysGuid != 'NA') ? data.AdvisoryRAnalyst.SysGuid : '',
      //   vals: (data.AdvisoryRAnalyst && data.AdvisoryRAnalyst.Name) ? data.AdvisoryRAnalyst.Name : '-',
      //   isDisabled: false,
      //   control: (this.getAttributeId('advisoryranalyst_name')) ? 'searchinput' : 'disabledinput',
      //   AttributeName: "advisoryranalyst_name",
      // }
    ];
  }
  assignKeyFinancials(data) {
    this.table_headkey = [{
      'tablehead': 'Financial year',
      'name': 'FinancialYear'
    },
    {
      'tablehead': 'Revenues',
      'name': 'Revenue'
    },
    {
      'tablehead': 'OM(%)',
      'name': 'OperatingMargin'
    },
    {
      'tablehead': 'Market cap',
      'name': 'MarketCap'
    },
    {
      'tablehead': 'Employees',
      'name': 'Employees'
    },
    // {
    //   'tablehead': 'Earnings per share($M)'
    // },
    {
      'tablehead': 'Return on equity (%)',
      'name': 'ReturnOnEquity'
    },
    {
      'tablehead': 'YOY Revenue growth (%)',
      'name': 'YOYRevenueGrowth'
    }
    ];
    if (data.KeyFinancials && data.KeyFinancials.length > 0) {
      this.table_datakey = [];
      data.KeyFinancials.forEach(element => {
        // if (element.FinancialYear && element.FinancialYear.Name) {
        if (Object.keys(element).length > 0) {
          this.table_datakey.push({
            'FinancialYear': (element.FinancialYear.Name) ? element.FinancialYear.Name : '-',
            'Revenue': (element.Revenue) ? element.Revenue : 0,
            'OperatingMargin': (element.OperatingMargin) ? element.OperatingMargin : 0,
            'MarketCap': (element.MarketCap) ? element.MarketCap : 0,
            'Employees': (element.Employees) ? element.Employees : 0,
            'ReturnOnEquity': (element.ReturnOnEquity) ? element.ReturnOnEquity : 0,
            'YOYRevenueGrowth': (element.YOYRevenueGrowth) ? element.YOYRevenueGrowth : 0,
          });
        }
      });
    }
  }
  standByAccountOwner;
  standByDesignation;
  standByMail;
  standByAdId;
  accountOwner;
  // accountOwnerDesignation;

  populateData(data, status) {

    this.table_data = [];
    this.accountCompetitors = [];
    this.table_dataaccAdvisory = [];

    if (data.Owner) {
      // localStorage.setItem("accountOwnerGuid", data.Owner.SysGuid);
      let accountOwnerGuid = this.EncrDecr.set(
        "EncryptionEncryptionEncryptionEn",
        data.Owner.SysGuid,
        "DecryptionDecrip"
      );
      localStorage.setItem('accountOwnerGuid', accountOwnerGuid);
    }
    this.standByAccountOwner = (data.StandByAccountOwner && data.StandByAccountOwner.FullName) ? data.StandByAccountOwner.FullName : '';
    this.standByDesignation = (data.StandByAccountOwner && data.StandByAccountOwner.Designation) ? data.StandByAccountOwner.Designation : '';
    this.standByMail = (data.StandByAccountOwner && data.StandByAccountOwner.Email) ? data.StandByAccountOwner.Email : '';
    this.standByAdId = (data.StandByAccountOwner && data.StandByAccountOwner.AdId) ? data.StandByAccountOwner.AdId : '';
    this.accountOwner = (data.Owner && data.Owner.FullName) ? data.Owner.FullName : '';
    console.log(data);
    this.OwnerShipHistory = data.OwnerShipHistory;
    this.assignAccountDetails(data);
    this.assignOwnershipDetails(data);
    this.assignCustomerBusinessUnit(data);
    this.assignCreditDetails(data);
    this.assignEngageDetails(data);
    this.assignAccstructure(data);
    this.assignCustomDetails(data);
    this.assignAddressDetails(data);
    this.assignTrendsAnalysis(data);
    this.assignLandIT(data);
    this.assignAccountre(data);
    this.assignSapDetails2(data);
    this.activeReferences(data);
    // this.assignSapDetails(data);
    this.assignVendorDetails(data);
    this.assignKeyFinancials(data);
    console.log("Account Details", data);
    // if (status == 'NEW') {
    this.table_data = [];
    if (data.AccountAlliance && data.AccountAlliance.length > 0) {
      data.AccountAlliance.forEach(element => {
        this.table_data.push({
          "LinkActionType": element.LinkActionType ? element.LinkActionType : 2,
          "SysGuid": element.SysGuid ? element.SysGuid : '',
          "Name": (element.Name) ? element.Name : '',
          'checkbox_clicked1': false,
          'MapGuid': element.MapGuid
          // 'SysGuid': element.SysGuid,
          // 'MapGuid': element.MapGuid,
          // 'alliance': (element.Name) ? element.Name : '',
          // 'contact': (element.CustomerContact && element.CustomerContact.FullName) ? element.CustomerContact.FullName : '',
          // 'checkbox_clicked1': false
        })
      });
    }
    // this.table_data = [{
    //   'alliance': 'Name 1',
    //   'contact': 'Vijay Kumar',
    //   'checkbox_clicked1': false,
    // },
    // {
    //   'alliance': 'Name 2',
    //   'contact': 'Akash Anand',
    //   'checkbox_clicked1': false,
    // },
    // {
    //   'alliance': 'Name 3',
    //   'contact': 'Yogesh Jawalia',
    //   'checkbox_clicked1': false,
    // }];
    // this.alliance_table = [{

    //   'name': 'Akash Anand',
    //   'checkbox_clicked1': false,
    // },
    // {

    //   'name': 'Vijay Kumar',
    //   'checkbox_clicked1': false,
    // },
    // {

    //   'name': 'Yogesh Jawalia',
    //   'checkbox_clicked1': false,
    // }];

    //chethana Aug 30th Assignment reference
    // this.Assignmentrefdata = [{
    //   'tabledata1': '208030985',
    //   'tabledata2': 'Customer name',
    //   'tabledata3': 'SBU name',
    //   'tabledata4': 'Vertical name',
    //   'tabledata5': 'Sub-vertical name',
    //   'tabledata6': 'Group name',
    //   'tabledata7': 'Geo name',
    //   'tabledata8': 'Region',
    //   'tabledata9': 'Yes',
    //   'tabledata10': 'Active',

    // },
    // {
    //   'tabledata1': '208030986',
    //   'tabledata2': 'Customer name',
    //   'tabledata3': 'SBU name',
    //   'tabledata4': 'Vertical name',
    //   'tabledata5': 'Sub-vertical name',
    //   'tabledata6': 'Group name',
    //   'tabledata7': 'Geo name',
    //   'tabledata8': 'Region',
    //   'tabledata9': 'Yes',
    //   'tabledata10': 'Active',
    // },
    // {
    //   'tabledata1': '208030975',
    //   'tabledata2': 'Customer name',
    //   'tabledata3': 'SBU name',
    //   'tabledata4': 'Vertical name',
    //   'tabledata5': 'Sub-vertical name',
    //   'tabledata6': 'Group name',
    //   'tabledata7': 'Geo name',
    //   'tabledata8': 'Region',
    //   'tabledata9': 'Yes',
    //   'tabledata10': 'Active',
    // },
    // ];
    //chethana Aug 30th sap details
    // this.sapdetailsdata = [{
    //   'tabledata1': 'Customer name',
    //   'tabledata2': '0842809384929',
    //   'tabledata3': '208030985',
    //   'tabledata4': 'Geo name',
    //   'tabledata5': 'Group name',
    //   'tabledata6': '00',
    //   'tabledata7': '00',

    // },
    // {
    //   'tabledata1': 'Customer name',
    //   'tabledata2': '0842809384929',
    //   'tabledata3': '208030985',
    //   'tabledata4': 'Geo name',
    //   'tabledata5': 'Group name',
    //   'tabledata6': '00',
    //   'tabledata7': '00',
    // },
    // {
    //   'tabledata1': 'Customer name',
    //   'tabledata2': '0842809384929',
    //   'tabledata3': '208030985',
    //   'tabledata4': 'Geo name',
    //   'tabledata5': 'Group name',
    //   'tabledata6': '00',
    //   'tabledata7': '00',
    // },
    // ];

    // chethana as per new VD Nov 26th campaign history
    // this.Campaignhistorydata = [{
    //   'tabledata1': 'Campaign name 01',
    //   'tabledata2': '214431234',
    //   'tabledata3': 'Juveria Samrin',
    //   'tabledata4': 'Manufacturing',
    //   'tabledata5': 'Completed',
    //   'tabledata6': 'Business',
    //   'tabledata7': 'Duration',
    // },
    // {
    //   'tabledata1': 'Campaign name 02',
    //   'tabledata2': '214431235',
    //   'tabledata3': 'Juveria Samrin',
    //   'tabledata4': 'Manufacturing',
    //   'tabledata5': 'Completed',
    //   'tabledata6': 'Business',
    //   'tabledata7': 'Duration',
    // },
    // {
    //   'tabledata1': 'Campaign name 03',
    //   'tabledata2': '214431236',
    //   'tabledata3': 'Juveria Samrin',
    //   'tabledata4': 'Manufacturing',
    //   'tabledata5': 'Completed',
    //   'tabledata6': 'Business',
    //   'tabledata7': 'Duration',
    // },
    // ];

    this.Campaignhistorydata = [];
    if (data.CampaignHistory && data.CampaignHistory.length > 0) {
      data.CampaignHistory.map(response => {
        this.Campaignhistorydata.push({
          'tabledata1': (response.Name) ? response.Name : '-',
          'tabledata2': (response.Code) ? response.Code : '-',
          'tabledata3': (response.Owner && response.Owner.FullName) ? response.Owner.FullName : '-',
          'tabledata4': (response.SBU && response.SBU.Name) ? response.SBU.Name : '-',
          'tabledata5': (response.CampaignStatus) ? response.CampaignStatus : '-',
          'tabledata6': (response.Activity && response.Activity.Name) ? response.Activity.Name : '-',
          'tabledata7': (response.StartDate) ? response.StartDate : '-',
          'tabledata8': (response.EndDate) ? response.EndDate : '-',
        })
      })
    }

    this.table_headcust = [{
      'tablehead': 'Active buyer organization'
    },
    {
      'tablehead': 'Customer contact'
    }
    ];

    this.table_datacust = [];
    if (data.CustomerBusinessUnit && data.CustomerBusinessUnit.length > 0) {

      data.CustomerBusinessUnit.forEach(element => {
        console.log(element);

        this.table_datacust.push({
          'tabledata1': (element.Name) ? element.Name : '-',
          'tabledata2': (element.CustomerContact && element.CustomerContact.FullName) ? element.CustomerContact.FullName : '-',
          'tabledata3': (element.BDM && element.BDM.FullName) ? element.BDM.FullName : '-',
          'tabledata4': (element.Status && element.Status.Value) ? element.Status.Value : '-'
          // 'tabledata3': (element.BDM && element.BDM.FullName) ? element.BDM.FullName : '-'
        });
      });
    }
    // this.table_datacust = [{
    //   'tabledata1': 'Digital',
    //   'tabledata2': 'Deep Shankar',
    //   'tabledata3': 'Manager'
    // },
    // {
    //   'tabledata1': 'Technology',
    //   'tabledata2': 'Deep Shankar',
    //   'tabledata3': 'Manager'
    // },
    // {
    //   'tabledata1': 'Infrastructure',
    //   'tabledata2': 'Deep Shankar',
    //   'tabledata3': 'Manager'
    // },
    // {
    //   'tabledata1': 'Cloud',
    //   'tabledata2': 'Deep Shankar',
    //   'tabledata3': 'Manager'
    // }
    // ];
    this.table_headalli = [{
      'tablehead': 'Alliance'
    }
      // ,
      // {
      //   'tablehead': 'Customer contact'
      // }
    ];
    this.table_dataalli = [];
    if (data.AccountAlliance && data.AccountAlliance.length > 0) {

      data.AccountAlliance.forEach(element => {
        this.table_dataalli.push({
          'tabledata1': (element.Name) ? element.Name : '-',
          'tabledata2': (element.CustomerContact && element.CustomerContact.FullName) ? element.CustomerContact.FullName : '-'
        })
      });
    }
    // this.table_dataalli = [{
    //   'tabledata1': 'Name 1',
    //   'tabledata2': 'Vijay Kumar'
    // },
    // {
    //   'tabledata1': 'Name 2',
    //   'tabledata2': 'Akash Anand'
    // },
    // {
    //   'tabledata1': 'Name 3',
    //   'tabledata2': 'Vijay Kumar'
    // },

    // ];
    this.table_headacc = [{
      'tablehead': 'Competitor name'
    }
    ];
    this.accountCompetitors = [];
    if (data.ActiveAccountCompetitors && data.ActiveAccountCompetitors.length > 0) {
      // this.table_dataacc = [];

      //  'name': result,
      //       'checkbox_clicked1': false,
      //       'MapGuid': res["ResponseObject"].MapGuid




      data.ActiveAccountCompetitors.forEach(element => {

        this.accountCompetitors.push({

          // let obj = {
          //   "LinkActionType": 1,  //New-1 , Existing-2 , Delete-3
          //   // "SysGuid": this.SysGuidid,
          //   "Competitor": {
          //     "SysGuid": result.Guid
          //   },
          //   "Name": result.Name.trim(),
          //   'checkbox_clicked1': false,
          // };
          "LinkActionType": element.LinkActionType ? element.LinkActionType : 2,  //New-1 , Existing-2 , Delete-3
          'Name': element.Name,
          "Competitor": {
            "SysGuid": element.SysGuid
          },
          'checkbox_clicked1': false,
          'MapGuid': element.MapGuid
        })

        // this.table_dataacc.push({
        //   'tabledata1': (element.Name) ? element.Name : '-'
        // })
      });
    }


    // this.table_dataacc = [{
    //   'tabledata1': 'Name 1'
    // },
    // {
    //   'tabledata1': 'Name 2'
    // },
    // {
    //   'tabledata1': 'Name 3'
    // },

    // ];
    this.table_headaccAdvisory = [{ //chethana 12th june
      'tablehead': 'Name of Advisory/ Analyst'
    }]

    this.table_dataaccAdvisory = [];
    if (data.AdvisoryRAnalystList) {
      data.AdvisoryRAnalystList.forEach((ele) => {
        this.table_dataaccAdvisory.push({
          "LinkActionType": ele.LinkActionType ? ele.LinkActionType : 2,
          "SysGuid": ele.SysGuid,
          "Name": ele.Name,
          'MapGuid': ele.MapGuid
        })
      })
    }

    this.table_headstrat = [{
      'tablehead': 'initiative name'
    },
    {
      'tablehead': 'Description'
    },
    {
      'tablehead': 'Target contact name'
    },
    {
      'tablehead': 'Target role'
    },
    ];//chethana 12th june



    this.table_datastrat = [{
      'tabledata1': 'Develop IoT applications',
      'tabledata2': 'Discovering IoT ecosystem for various domains and develop digital applications.',
      'tabledata3': 'Deep Shankar',
      'tabledata4': 'Manager',
    },
    {
      'tabledata1': 'Develop IoT applications',
      'tabledata2': 'Discovering IoT ecosystem for various domains and develop digital applications.',
      'tabledata3': 'Deep Shankar',
      'tabledata4': 'Business head',
    },
    {
      'tabledata1': 'Develop IoT applications',
      'tabledata2': 'Discovering IoT ecosystem for various domains and develop digital applications.',
      'tabledata3': 'Deep Shankar',
      'tabledata4': 'Manager',
    },
    {
      'tabledata1': 'Develop IoT applications',
      'tabledata2': 'Discovering IoT ecosystem for various domains and develop digital applications.',
      'tabledata3': 'Deep Shankar',
      'tabledata4': 'Business head',
    }
    ];
    // }
  }
  AssignmentrefdataLen = 0;
  activeAssignmentrefdataLen = 0;
  inactiveAssignmentrefdataLen = 0;
  assignSapDetails2(data) {
    this.sapdetailsdata = [];
    Object.assign(this.sapdetailsdata, data.SAPDetailsList);
    console.log('sap data', this.sapdetailsdata);
  }
  activeReferences(data) {
    if (data.AssignmentReference && data.AssignmentReference.length > 0) {
      Object.assign(this.Assignmentrefdata, data.AssignmentReference);
      this.AssignmentrefdataLen = data.AssignmentReference.length;
      // console.log(data.AssignmentReference.filter(ele => ele.Status.Id == 1))
      this.activeAssignmentrefdataLen = data.AssignmentReference.filter(ele => ele.Status.Id == 1).length;
      this.inactiveAssignmentrefdataLen = this.AssignmentrefdataLen - this.activeAssignmentrefdataLen;
      console.log('active references', this.Assignmentrefdata);
    }
  }
  getSAPCodeDetails() {
    this.projectService.getSAPCodeDetails({ "AccountId": this.SysGuidid }).subscribe(res => {
      if (!res.IsError) {
        this.sapCodeDetails = res.ResponseObject;
        console.log(this.sapCodeDetails, "sap")
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });
  }
  createSAP() {
    let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    const dialogRef = this.dialog.open(SapPopupComponent,
      {
        disableClose: true,
        width: '900px',
        data: ({ sapCodeDetails: this.sapCodeDetails, curencyName: this.currencyName, vertical: this.verticalName, route_from: 'accountDetails' })
      }
    );
    // dialogRef.afterClosed().subscribe(result => {
    //   this.isLoading = true;
    //   if (result) {
    //     console.log(result);
    //     let postobj = {
    //       "SysGuid": result.accountDetails.AccountId,
    //       "SAPDetails":
    //       {
    //         "SAPCustomerName": result.customerName,
    //         "SAPCompanyCode": result.companyCode,
    //         "IsSignedMSA": result.IsSignedMSA
    //       },
    //       "Address":
    //       {
    //         "Address1": result.addressOnly,
    //         "ZipCode": result.zipcode,
    //       }
    //     }
    //     this.accountListService.CreateSAPCustomer(postobj).subscribe(result => {
    //       console.log(result);
    //       if (!result.IsError) {
    //         this.isLoading = false;
    //         this.snackBar.open(result.Message, '', {
    //           duration: 5000
    //         });
    //       }
    //     }, error => {
    //       this.isLoading = false;
    //       console.log(error);
    //     })
    //   }
    //   else {
    //     this.isLoading = false;
    //   }
    // })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //if (result.fileList.length > 0) {
        this.projectService.UploadSapCodeDoc({ "AccountId": accountSysId, "SAPCODEPdfList": result.fileList.length ? result.fileList : null }).subscribe(res => {
          if (!res.IsError) {
            console.log("appointent id", res);
            this.AppointmentId = res.ResponseObject.AppointmentId;
            let postObj = {
              "AccountId": accountSysId,
              "AccountName": result.accountDetails.Name,
              "AccountOwner": result.accountDetails.OwnerName,
              "AccountNo": result.accountDetails.AccountNumber,
              "Geography": result.selectedCountry,
              "Opportunity_Won": "No",
              "Vertical": this.verticalName ? this.verticalName : "",
              "Company_Code": result.companyCode,
              "Company_Name": result.companyName,
              "UserAddress": result.address,
              "AppointmentId": this.AppointmentId,
              "Currency": this.currencyName,
              "value": [
                {
                  "UserType": 3,
                  "UserId": this.userId       //Requester
                },
                {
                  "UserType": 3,
                  "UserId": result.accountDetails.OwnerId	   //Account Owner
                }
              ]
            }
            this.projectService.createEmail(postObj).subscribe(res => {
              console.log(res);
              if (!res.IsError) {
                //disable sap code and make it non mandatory
                this.sapCodeDisabled = true;
                this.userdat.GetRedisCacheData('saveOpportunity').subscribe(result => {
                  console.log("redis", result)
                  if (!result.IsError && result.ResponseObject) {
                    console.log("parsed data", JSON.parse(result.ResponseObject))
                    let oppIdFromSession = this.projectService.getSession('opportunityId');
                    let dataFromRedis = JSON.parse(result.ResponseObject);
                    if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                      let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == oppIdFromSession)
                      if (currentOpportunityData.length) {
                        dataFromRedis.map(data => {
                          if (data.opportunityId == oppIdFromSession) {
                            data.IsSapcodeRequested = true;
                          }
                        })
                        this.userdat.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(result => {
                          if (!result.IsError) {
                            console.log("SUCESS FULL AUTO SAVE")
                          }
                        }, error => {
                          console.log(error)
                        })
                      }
                    }
                  }
                })
                this.sapCodePlaceholder = 'SAP code creation is in process';
                this.projectService.displayMessageerror("SAP code requested successfully");
              }
              else {
                this.projectService.displayMessageerror(res.Message);
              }
            }, (err) => {
              this.projectService.displayerror(err.status);
            })
          }
          else {
            this.projectService.displayMessageerror(res.Message);
          }
        }, (err) => {
          this.projectService.displayerror(err.status);
        })
      }
    })
  }
  getCBU(reff) {
    let cbudisplay: string = '';
    let selectedcbu: any = [];
    if (reff['CustomerBusinessUnit']) {

      let data = reff['CustomerBusinessUnit'];
      console.log("dsjncds", data);
      data.map((res) => {
        console.log("dsjngfcds", res);
        if (res['LinkActionType'] == 2) {
          selectedcbu.push(res['Name']);
        }
      });
      console.log("dsjngfhsdvsgcds", selectedcbu);
    }
    cbudisplay = selectedcbu[0] + ((selectedcbu.length == 1) ? '' : ('(+' + (selectedcbu.length - 1) + ')'));
    console.log("sdvghasdv", cbudisplay);
    return cbudisplay;
  }
  validationOnType(v, key, dropdown, dk) {
    console.log('v, key, dropdown, dk' + v + '---' + key + '---' + dropdown + '---' + dk);
    // if (v.Id == 3 || v.Id == 12 || v.Id == 1) {
    // this.otherFieldsvalidation = true;
    let arr = ['SBU', 'Vertical', 'Geo', 'Region', 'CountryReference'];
    this.ownershipDetails.map((ele) => {
      // console.log(ele.fkey);
      // let data = getComparisionValue();
      // console.log('ele'+ele)
      if (ele.enableMandatory) {
        if (ele.control != 'disabledinput') {
          if (v.Id == 3 || v.Id == 12 || v.Id == 1) {
            // if (ele[this.getComparisionValue(ele.control, 'owner')] === '') {

            if (ele['fkey'] === 'SBU' || ele['fkey'] === 'Vertical' || ele['fkey'] === 'Geo' || ele['fkey'] === 'Region' || ele['fkey'] === 'CountryReference') {

              ele['validationKeyForAst'] = true;
            }
            // } else {
            //   ele['validationKey'] = false;
            // }
            // }
            // else {
            //   ele['validationKeyForAst'] = false;
            // }

            // ele.Id = data.Id || data.SysGuid || '';
            // console.log(ele);
            // CustomDetails = CustomDetails + 1;
            // return;
          } else {
            // count = count +1;
            // count = --count ;
            ele['validationKeyForAst'] = false;
            // return;
          }
        }
      }
    });
    // arr.forEach(item => {
    //   if(item != 'SBU' && !this.accountcreationobj[item]){
    //     this.isError[item] = true;
    //   }
    //   else {
    //     if(item == 'SBU'){
    //       this.accountcreationobj['sbu'] ? this.isError['SBU'] = false : this.isError['SBU'] = false ;
    //     }
    //     this.isError[item] = false;
    //   }
    // })
    // this.isError['SBU'] = true;
    // this.isError['Vertical'] = true;
    // this.isError['Geo'] = true;
    // this.isError['Region'] = true;
    // this.isError['CountryReference'] = true;
    // }
    // else {
    // this.otherFieldsvalidation = false;
    // this.isError['SBU'] = false;
    // this.isError['Vertical'] = false;
    // this.isError['Geo'] = false;
    // this.isError['Region'] = false;
    // this.isError['CountryReference'] = false;
    // }
    // this.accountcreationobj['Accounttype'] = data.Id
    // // this.GetAccountClassificationByType(this.accountcreationobj['Accounttype'])
    // //  this.Getaccountcategorybytypeandclassification(this.accountcreationobj['Accounttype'], '')
    //  if(data.Id != '')
    //  {
    //    this.isError['Type'] = false
    //  }
    // if (data.Id == 3 || data.Id == 12 || data.Id == 1) {
    //   this.otherFieldsvalidation = true;
    //   let arr = ['SBU','Vertical','Geo','Region','CountryReference'];
    //   arr.forEach(item => {
    //     if(item != 'SBU' && !this.accountcreationobj[item]){
    //       this.isError[item] = true;
    //     }
    //     else {
    //       if(item == 'SBU'){
    //         this.accountcreationobj['sbu'] ? this.isError['SBU'] = false : this.isError['SBU'] = false ;
    //       }
    //       this.isError[item] = false;
    //     }
    //   })
    //   // this.isError['SBU'] = true;
    //   // this.isError['Vertical'] = true;
    //   // this.isError['Geo'] = true;
    //   // this.isError['Region'] = true;
    //   // this.isError['CountryReference'] = true;
    // }
    // else {
    //   this.otherFieldsvalidation = false;
    //   this.isError['SBU'] = false;
    //   this.isError['Vertical'] = false;
    //   this.isError['Geo'] = false;
    //   this.isError['Region'] = false;
    //   this.isError['CountryReference'] = false;
    // }
    // return;
  }
  selectBoxValue(v, key, dropdown, dk) {
    this.validationOnType(v, key, dropdown, dk);
    if (v.fkey == 'Type') {
      console.log("selected this");
      let ind = dropdown.findIndex(dd => dd.Id == v.Id);
      if (ind != -1)
        v[key] = dropdown[ind][dk];
      if (v[key] == 'Hunting' && this.HasSAPDetails && this.accountType == 1 && this.IsHelpDesk != null && this.IsHelpDesk == 'true') {
        console.log("came here")
        this.openDeactivatePopup('', false, false, true); // do not change the values
      }
      let index1 = this.accountDetails.findIndex(own => own.fkey == 'AccountClassification');
      this.accountDetails[index1]['Id'] = '';
      let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
      this.engageDetails[index]['Id'] = '';
      this.accountOverviewDropdown.AccountCategory = [];
      this.master3Api.GetAccountClassificationByType(dropdown[ind]['Id'], "").subscribe(result => {
        console.log(result);
        console.log(result.ResponseObject);
        if (!result.IsError && result.ResponseObject && result.ResponseObject.length >= 1) {
          this.accountOverviewDropdown.AccountClassification = result.ResponseObject;
          // this.accountOverviewDropdown.AccountCategory = [];
        }
        else if (!result.IsError && result.ResponseObject && result.ResponseObject.length == 0) {
          this.accountOverviewDropdown.AccountClassification = result.ResponseObject;
          // let index = this.accountDetails.findIndex(own => own.fkey == 'AccountClassification');
          // this.accountDetails[index]['values'] = '';
          // this.accountDetails[index]['Id'] = '';
          // this.classificationid = '';
        }
        else { }
      }, error => {
        console.log(error);
      });
      this.getcategory(dropdown[ind]['Id'], '');

    }
    else {
      let ind = dropdown.findIndex(dd => dd.Id == v.Id);
      if (ind != -1)
        v[key] = dropdown[ind][dk];
      if (v.fkey == 'AccountClassification') {
        let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
        let typeInd = this.accountDetails.findIndex(own => own.fkey == 'Type');
        let accounttype = this.accountDetails[typeInd]['Id'];
        this.classificationid = dropdown[ind]['Id'];
        this.engageDetails[index]['Id'] = '';
        this.getcategory(accounttype, this.classificationid)
      }
    }
  }
  getcategory(accounttype, classificationtype) {
    let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
    this.engageDetails[index]['Id'] = '';
    this.accountOverviewDropdown.AccountCategory = [];
    this.master3Api.getCategoryByTypeandClassification(accounttype, "", classificationtype).subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject && result.ResponseObject.length >= 1) {
        this.accountOverviewDropdown.AccountCategory = result.ResponseObject;
        console.log(this.accountOverviewDropdown.AccountCategory)
      }
      else if (!result.IsError && result.ResponseObject && result.ResponseObject.length == 0) {
        this.accountOverviewDropdown.AccountCategory = result.ResponseObject;
        // let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
        // this.engageDetails[index]['values'] = '';
        // this.engageDetails[index]['Id'] = '';
      }
    }, error => {
      console.log(error);
    })
  }
  chekInAttributeArray(arr, key) {
    console.log(arr, key);

    if (arr.indexOf(key) != -1) return true;
    else return false;
  }
  isApprovalAttrComment(AttributeComment, apprvalArr) {
    let flag = false;
    AttributeComment.forEach(at => {
      if (apprvalArr.indexOf(at.attrName) != -1) { flag = true; return flag; }
    });
    return flag;
  }

  // checkForHelpLine() {
  //   let filteredData = [];
  //   this.non_editablefiled_arr = [];
  //   this.editable_field_comment = [];
  //   this.non_editablefiled_arr = this.AttributeComment.filter(attr => attr.control == 'disabledinput');
  //   this.editable_field_comment = this.AttributeComment.filter(attr => attr.control != 'disabledinput');

  //   console.log(this.non_editablefiled_arr);
  //   console.log(this.editable_field_comment);

  //   if (this.roleType == 2) {

  //     if (this.SBUNonModifAttr.indexOf(this.AttributeComment[0]['attrName']) != -1)
  //       this.IsHelpLineTicket = true;
  //     return true;
  //   } else if (this.roleType == 3) {
  //     if (this.CSONonModifAttr.indexOf(this.AttributeComment[0]['attrName']) != -1)
  //       this.IsHelpLineTicket = true;
  //     return true;
  //   } else if (this.isOwnerLoggedIn) {

  //   }
  //   filteredData = this.AttributeComment.filter(attr => attr.control == 'disabledinput');
  //   if (filteredData.length > 0) {
  //     this.IsHelpLineTicket = true;
  //     return true;
  //   }
  //   else false;
  // }
  validateCamundaVals(value) {
    return true;
    // if (value && value != '-' && value != 0) {
    //   let val = value.toString().trim();
    //   if (val != '' && val.toLowerCase() != 'na' && val.length > 0) { return true; }
    //   else { return false; }
    // }
    // else { return false; }
  }

  assignStatus() {
    if (this.roleType == 2) return 184450001;  // sbu
    else if (this.roleType == 3) return 184450006; //cso
    else if (this.isOwnerLoggedIn && this.roleType != 2 && this.roleType != 3) return 184450005; // account owner
  }
  assignStatusCode() {
    if (this.roleType == 2) return 184450001;
    else if (this.roleType == 3) return 184450006;
    else if (this.isOwnerLoggedIn && this.roleType != 2 && this.roleType != 3) return 184450005;
  }
  createAccount() {
    this.router.navigate(["/accounts/accountcreation/createnewaccount"]);
    localStorage.setItem('prospectaccountid', this.SysGuidid);
  }

  buildPostObject(allObject) {

    this.isValidForm = true;

    this.noramlPostObj = {};
    this.noramlPostObj1 = {};
    Object.keys(this.noramlPostObj).forEach(function (key) { delete this.noramlPostObj[key]; });
    Object.keys(this.noramlPostObj1).forEach(function (key) { delete this.noramlPostObj1[key]; });

    console.log(allObject);
    this.IsHelpLineTicket = false;
    console.log(this.isOwnerLoggedIn);
    // this.IsHelpLineTicket = this.checkForHelpLine();
    allObject.forEach((arr, index) => {
      if (arr[0] && arr[0].length > 0) {
        arr[0].forEach((elt, index) => {
          if (!this.IsHelpLineTicket && this.isOwnerLoggedIn && elt[arr[1]] != elt.old_val) {
            if ((this.userdat.searchFieldValidator(elt.camunda_key) && this.chekInAttributeArray(this.apprvalArr, elt.camunda_key)) || (this.userdat.searchFieldValidator(elt.fkey) && this.chekInAttributeArray(this.apprvalArr, elt.key))) {
              this.IsHelpLineTicket = true;
            }
            console.log(this.IsHelpLineTicket);
          }
          if (elt.control != 'disabledinput' && elt.control != 'disabledselect' && elt.control != 'disabledradiobutton' && elt.control != 'disabledDiv') {
            console.log(elt[arr[1]], elt.old_val, this.chekInAttributeArray(this.apprvalArr, elt.camunda_key));

            if (this.roleType != 3 && this.validateCamundaVals(elt.camunda_key) && (elt[arr[1]] != elt.old_val) && this.chekInAttributeArray(this.apprvalArr, elt.camunda_key)) {
              console.log("HERE=====================> ");

              if (this.validateCamundaVals(elt.Id) && (elt.control == 'dropdown' || elt.control == 'searchinput' || elt.control == 'select')) {
                if (elt.datatype && elt.datatype == 'number') {
                  if (elt.fkey == 'Type') this.accountTypechanged = true;
                  else this.accountTypechanged = false;
                  if (elt.fkey == 'SubVertical') console.log("subvertical came here", parseFloat(elt['Id']));
                  this.camundaPostObj['account'][elt.camunda_key] = parseFloat(elt['Id']);
                  // console.log("edited and changes value", elt['Id'], elt['old_id']);
                  if (this.accountType == 2) {
                    this.noramlPostObj[elt.fkey] = parseFloat(elt['Id']);
                    this.noramlPostObj1[elt.fkey] = parseFloat(elt['Id']);
                  }
                  else {
                    this.noramlPostObj1[elt.fkey] = parseFloat(elt['old_id']);
                  }
                }
                else {
                  this.camundaPostObj['account'][elt.camunda_key] = elt['Id'];
                  // console.log("edited and changes value", elt['Id'], elt['old_id'])
                  if (this.accountType == 2) {
                    this.noramlPostObj[elt.fkey] = elt['Id'];
                    this.noramlPostObj1[elt.fkey] = elt['Id'];
                  }
                  else {
                    this.noramlPostObj1[elt.fkey] = elt['old_id'];
                  }
                }
              }
              else {
                if (this.validateCamundaVals(elt[arr[1]])) {
                  if (elt[arr[1]].toLowerCase() == 'yes') {
                    this.camundaPostObj['account'][elt.camunda_key] = true;
                    if (this.accountType == 2) {
                      this.noramlPostObj[elt.fkey] = true;
                      this.noramlPostObj1[elt.fkey] = true;
                    }
                  }
                  else if (elt[arr[1]].toLowerCase() == 'no') {
                    this.camundaPostObj['account'][elt.camunda_key] = false;
                    if (this.accountType == 2) {
                      this.noramlPostObj[elt.fkey] = false;
                      this.noramlPostObj1[elt.fkey] = false;
                    }
                  }
                  else {
                    this.camundaPostObj['account'][elt.camunda_key] = elt[arr[1]];
                    if (this.accountType == 2) {
                      this.noramlPostObj[elt.fkey] = elt[arr[1]];
                      this.noramlPostObj1[elt.fkey] = elt[arr[1]];
                    }
                  }
                  if (this.accountType == 2) {
                    this.noramlPostObj[elt.fkey] = elt[arr[1]];
                    this.noramlPostObj1[elt.fkey] = elt[arr[1]];
                  }
                  else this.noramlPostObj1[elt.fkey] = elt['old_val'];
                }
              }
            }
            // else if (elt[arr[1]] != elt.old_val) {
            else {
              if (this.validateCamundaVals(elt.Id) && (elt.control == 'dropdown' || elt.control == 'searchinput' || elt.control == 'select')) {
                if (elt.datatype && elt.datatype == 'number') {
                  if (elt[arr[1]] != elt.old_val) this.noramlPostObj[elt.fkey] = parseFloat(elt['Id']);
                  this.noramlPostObj1[elt.fkey] = parseFloat(elt['Id']);
                }
                else {
                  if (elt[arr[1]] != elt.old_val) this.noramlPostObj[elt.fkey] = elt['Id'];
                  this.noramlPostObj1[elt.fkey] = elt['Id'];
                }
              }
              else {
                if (this.validateCamundaVals(elt[arr[1]])) {
                  if (elt.datatype && elt.datatype == 'number') {
                    if (elt[arr[1]] != elt.old_val) this.noramlPostObj[elt.fkey] = parseFloat(elt[arr[1]]);
                    this.noramlPostObj1[elt.fkey] = parseFloat(elt[arr[1]]);
                  }
                  else {
                    if (elt[arr[1]] != elt.old_val) this.noramlPostObj[elt.fkey] = elt[arr[1]];
                    this.noramlPostObj1[elt.fkey] = elt[arr[1]];
                  }
                }

              }
            }
            // old data updattion with new changes.

          }
          else {
            // making post object for disabled input. kkn 19th dec
            if (elt.control == 'link') {
            } else {
              if (this.validateCamundaVals(elt.Id) || typeof elt.Id == "boolean") {
                if (elt.datatype && elt.datatype == 'number') {
                  this.noramlPostObj1[elt.fkey] = parseFloat(elt['Id']);
                }
                else {
                  this.noramlPostObj1[elt.fkey] = elt['Id'];
                }
              }
              else {
                if (this.validateCamundaVals(elt[arr[1]])) {
                  if (elt.datatype && elt.datatype == 'number') {
                    this.noramlPostObj1[elt.fkey] = parseFloat(elt[arr[1]]);
                  }
                  else {
                    this.noramlPostObj1[elt.fkey] = elt[arr[1]];
                  }
                }
              }
            }
          }
        })
      }
    });
    // "IsActivate": true,
    // "BuyerOrg": result.BuyerOrg Object.is() Object.toJSON(this.CustomerBusinessUnit.record) == Object.toJSON(this.CustomerBusinessUnit.old_val);
    if (this.CustomerBusinessUnit.record && !(JSON.stringify(this.CustomerBusinessUnit.record) === JSON.stringify(this.backUpData.CustomerBusinessUnit))) {
      this.noramlPostObj[this.CustomerBusinessUnit.fkey] = this.CustomerBusinessUnit.record;
      this.noramlPostObj1[this.CustomerBusinessUnit.fkey] = this.CustomerBusinessUnit.record;
    }
    // if (this.table_data && this.table_data.filter(td => td.LinkActionType == 1).length > 0) {
    if (this.table_data && this.table_data.length > 0) {
      this.noramlPostObj['AccountAlliance'] = this.table_data;
      this.noramlPostObj1['AccountAlliance'] = this.table_data;
    }
    // if (this.accountCompetitors && (this.accountCompetitors.filter(td => td.LinkActionType == 1).length > 0)) {
    if (this.accountCompetitors && this.accountCompetitors.length > 0) {
      this.noramlPostObj['ActiveAccountCompetitors'] = this.accountCompetitors;
      this.noramlPostObj1['ActiveAccountCompetitors'] = this.accountCompetitors;
    }
    // if (this.table_dataaccAdvisory && this.table_dataaccAdvisory.filter(td => td.LinkActionType == 1).length > 0) {
    if (this.table_dataaccAdvisory && this.table_dataaccAdvisory.length > 0) {
      this.noramlPostObj['AdvisoryRAnalystList'] = this.table_dataaccAdvisory;
      this.noramlPostObj1['AdvisoryRAnalystList'] = this.table_dataaccAdvisory;
    }
    if (this.selectedOwner && this.selectedOwner.length > 0) {
      let admOwnerList = []
      this.selectedOwner.map(ele => {
        admOwnerList.push({
          "LinkActionType": ele.LinkActionType,
          "SysGuid": ele.SysGuid,
          "MapGuid": ele.MapGuid,
          "FullName": ele.Name
        });
      });
      console.log("adm list being sent is : ", admOwnerList);
      this.noramlPostObj['AccountADM'] = admOwnerList;
      this.noramlPostObj1['AccountADM'] = admOwnerList;
    }

    console.log(this.camundaPostObj);
    console.log(this.noramlPostObj);
    console.log(this.backUpData.CustomerBusinessUnit, this.CustomerBusinessUnit.record);

    if (((typeof this.noramlPostObj == 'object' && Object.keys(this.noramlPostObj).length > 0) || (typeof this.camundaPostObj['account'] == 'object' && Object.keys(this.camundaPostObj['account']).length > 0) || this.AttributeComment.length > 0) && Object.values(this.validatorsArray).every(char => char == true)) {
      let dialogRef: any;
      if ((this.IsHelpLineTicket || (this.isOwnerLoggedIn && this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr))) && this.accountType != 2) {
        dialogRef = this.dialog.open(Helpline, {
          disableClose: true,
          width: '380px',
          data: { 'accountName': this.accountName }
        });
      }
      else {
        // if (this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr)) {
        dialogRef = this.dialog.open(OpensaveComments, {
          width: '380px',
          data: { 'IsHelpLineTicket': this.IsHelpLineTicket }
        });
      }
      // else { }
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log("After close==============================> ", result);

        if (this.userdat.searchFieldValidator(result)) {

          // if (this.CustomerBusinessUnit.record && this.validateCamundaVals(this.CustomerBusinessUnit.camunda_key)) {
          //   this.camundaPostObj['account'][this.CustomerBusinessUnit.camunda_key] = this.CustomerBusinessUnit.record;
          // }


          // this.camundaPostObj['attribute_comments'] = this.AttributeComment;
          if (this.roleType != 3 && this.accountType != 2) {  // if LoggedInUser is not CSO && account type != Prospect
            if ((typeof this.camundaPostObj['account'] == 'object' && Object.keys(this.camundaPostObj['account']).length > 0) || this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr)) {
              this.camundaPostObj['attribute_comments'] = [];
              // this.camundaApi = true;

              console.log(this.AttributeComment);

              this.AttributeComment.forEach(at => {
                console.log(at);
                if (this.chekInAttributeArray(this.apprvalArr, at.attrName)) {
                  console.log(at.attrName);

                  this.camundaPostObj['attribute_comments'].push({ 'id': at.Guid, 'comment': at.Comments });
                  console.log(this.camundaPostObj['attribute_comments']);
                }
              });


              // this.AttributeComment.forEach(ed => {
              //   if (this.chekInAttributeArray(this.apprvalArr, ed.attrName))
              //     this.camundaPostObj['attribute_comments'][ed.attrName] = ed.Comments;
              // })

              this.camundaPostObj['account']["requestedby"] = this.userId;
              this.camundaPostObj['account']["requesttype"] = 1;
              this.camundaPostObj['account']["name"] = this.accountName || '';
              this.camundaPostObj['account']["accountnumber"] = this.accountNumber || '';
              // this.camundaPostObj['account']["statuscode"] = this.assignStatusCode();
              this.camundaPostObj['account']["isownermodified"] = this.isOwnerLoggedIn;
              this.camundaPostObj['account']['accountid'] = this.SysGuidid;
              if (!this.accountTypechanged) {
                this.camundaPostObj['account']['accounttype'] = this.accountType;
              }
              // this.camundaPostObj['account']['accounttype'] = this.accountType;
              // console.log(this.camundaPostObj);

              this.camundaPostObj["overall_comments"] = {
                "accountid": this.SysGuidid,
                "overallcomments": result,
                "requestedby": this.userId,
                "status": this.assignStatus()
              };
              let editApiCall: boolean;
              console.log("normal post object inside camunda calling", this.noramlPostObj1);
              if (this.accountType != 2 && ((typeof this.noramlPostObj == 'object' && Object.keys(this.noramlPostObj).length > 0) || !this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr))) {
                this.noramlPostObj["Comment"] = result;
                this.noramlPostObj1["Comment"] = result;
                debugger;
                editApiCall = await this.normalSubmit(this.noramlPostObj1);
                if (editApiCall) {
                  this.camundaSubmit(this.camundaPostObj);
                }
              }
              //  this.getAccountDetails();
            }
          }
          console.log(this.noramlPostObj);

          if (this.accountType != 2 && ((typeof this.noramlPostObj == 'object' && Object.keys(this.noramlPostObj).length > 0) || !this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr))) {
            this.noramlPostObj["Comment"] = result;
            this.noramlPostObj1["Comment"] = result;
            // if (this.CustomerBusinessUnit.record && this.validateCamundaVals(this.CustomerBusinessUnit.fkey)) {
            //   this.noramlPostObj[this.CustomerBusinessUnit.fkey] = this.CustomerBusinessUnit.record;
            // }
            if (!this.editApicallSuccess) await this.normalSubmit(this.noramlPostObj1);
            this.editApicallSuccess = false;
          }
          else if (((typeof this.noramlPostObj == 'object' && Object.keys(this.noramlPostObj).length > 0) || this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr)) && this.accountType == 2) {
            this.IsHelpLineTicket = false;
            this.noramlPostObj["Comment"] = result;
            this.noramlPostObj1["Comment"] = result;
            await this.normalSubmit(this.noramlPostObj1);

          }
        }
      })
    }
    else {
      if (!Object.values(this.validatorsArray).every(char => char == true)) {
        this.showCustomer();
        const key = Object.keys(this.validatorsArray).find(key => this.validatorsArray[key] === false);
        this.snackBar.open(key + " is not valid.", '', {
          duration: 3000
        });
        return;
      }
      this.hideOnNoChange();
    }
  }
  submitToCamunda() {
    this.camundaPostObj = {};
    this.camundaPostObj['account'] = {};

    this.noramlPostObj = {};

    let allObject = [
      [this.accountDetails, 'values'],
      [this.ownershipDetails, 'record'],
      [this.creditDetails, 'vals'],
      [this.engageDetails, 'vals'],
      [this.Accstructure, 'vals'],
      [this.CustomDetails, 'vals'],
      [this.addressDetails, 'vals'],
      [this.trendsAnalysis, 'vals'],
      [this.LandIT, 'vals'],
      [this.accountre, 'vals'],
      [this.sapDetails, 'vals'],
      [this.vendorDetails, 'vals']
    ];

    this.buildPostObject(allObject);

  }
  camundaSubmit(camundaPostObj) {
    console.log(camundaPostObj);
    this.isLoading = true;
    this.accountListService.account_modification(camundaPostObj).subscribe(result => {
      // console.log(result);
      // private router: Router,
      // this.isLoading = false;

      if (result.data[0].processInstanceId) {
        this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
        this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }))

        this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
        if (result.data[0].helplineTicketResponse && camundaPostObj['account']["isownermodified"]) {
          this.snackBar.open(result.data[0].helplineTicketResponse, '', {
            duration: 5000
          });
        } else {
          this.snackBar.open(result.data[0].Status, '', {
            duration: 5000
          });
        }
        let obj: any = {
          "SysGuid": result.data[0].modificationrequestid,
          "ProcessGuid": result.data[0].processInstanceId
        }
        this.accountListService.ModificationActiverequest_UpdateCamundatoCRM(obj).subscribe(result => {
          this.isLoading = false;
          // this.router.navigate(['/accounts/accountlist/farming']);
          this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
      }

      // result ==> success
      // this.getAccountDetails();
    }, error => {
      console.log(error);

      this.isLoading = false;
    });
  }
  normalSubmit(noramlPostObj1): Promise<any> {
    console.log(noramlPostObj1);
    this.noramlPostObj1 = noramlPostObj1;
    let obj = {};
    let attrComment = [];
    console.log(this.AttributeComment);

    this.AttributeComment.forEach(at => {
      if (!this.chekInAttributeArray(this.apprvalArr, at.attrName))
        attrComment.push({ 'Guid': at.Guid, 'Comments': at.Comments });
    });
    this.noramlPostObj1['AttributeComment'] = attrComment;
    // console.log(noramlPostObj);

    obj = {
      IsHelpLineTicket: this.IsHelpLineTicket || false,
      "SysGuid": this.SysGuidid || '',
      'LegalEntity': this.noramlPostObj1['LegalEntity'] || '',
      "Name": this.noramlPostObj1['Name'] || '',
      "Type": {
        "Id": this.noramlPostObj1['Type'] || ''
      },
      "ProposedAccountType": {
        "Id": this.noramlPostObj1['ProposedAccountType'] || ''
      },
      "ParentAccount": {
        "SysGuid": this.noramlPostObj1['ParentAccount'] || ''
      },
      "UltimateParentAccount": {
        "SysGuid": this.noramlPostObj1['UltimateParentAccount'] || ''
      },
      "AccountClassification": {
        "Id": this.noramlPostObj1['AccountClassification'] || ''
      },
      "ProposedAccountClassification": {
        "Id": this.noramlPostObj1['ProposedAccountClassification'] || ''
      },
      "SBU": {
        "Id": this.noramlPostObj1['SBU'] || ''
      },
      "Vertical": {
        "Id": this.noramlPostObj1['Vertical'] || ''
      },
      "SubVertical": {
        "Id": this.noramlPostObj1['SubVertical'] || ''
      },
      // "DeliveryManagerADHVDH": {
      //   "FullName": this.noramlPostObj1['DeliveryManagerADHVDH'] || ''
      // },
      // "VDH": {
      //   "FullName": this.noramlPostObj1['VDH'] || ''
      // },
      // "ADM": {
      //   "FullName": this.noramlPostObj1['ADM'] || ''
      // },

      "Owner": {
        "SysGuid": this.noramlPostObj1['Owner'] || ''
      },
      "StandByAccountOwner": {
        "SysGuid": this.noramlPostObj1['StandByAccountOwner'] || ''
      },
      "Geo": {
        "SysGuid": this.noramlPostObj1['Geo'] || ''
      },
      "Region": {
        "SysGuid": this.noramlPostObj1['Region'] || ''
      },
      "CountryReference": {
        "SysGuid": this.noramlPostObj1['CountryReference'] || ''
      },
      "CityRegionReference": {
        "SysGuid": this.noramlPostObj1['CityRegionReference'] || ''
      },
      "CountrySubDivisionReference": {
        "SysGuid": this.noramlPostObj1['CountrySubDivisionReference'] || ''
      },
      "MarketRisk": {
        "Id": this.noramlPostObj1['MarketRisk'] || ''
      },
      "creditdelinquencyscore": this.noramlPostObj1['CreditScore'] || '',
      "AccountCategory": {
        "Id": this.noramlPostObj1['AccountCategory'] || ''
      },
      "IsGovAccount": (this.noramlPostObj1['IsGovAccount'] == "No") ? false : true || '',
      "IsNewAgeBusiness": (this.noramlPostObj1['IsNewAgeBusiness'] == "No") ? false : true || '',
      "IsTerritoryFlag": (this.noramlPostObj1['TerritoryFlag'] == "No") ? false : true || '',
      "LifeCycleStage": {
        "Id": this.noramlPostObj1['LifeCycleStage'] || ''
      },
      "RevenueCategory": {
        "Id": this.noramlPostObj1['RevenueCategory'] || ''
      },
      "GrowthCategory": {
        "Id": this.noramlPostObj1['GrowthCategory'] || ''
      },
      "CoverageLevel": {
        "Id": this.noramlPostObj1['CoverageLevel'] || ''
      },
      "RelationShipStatus": {
        "Id": this.noramlPostObj1['RelationShipStatus'] || ''
      },
      "OwnershipType": {
        "Id": this.noramlPostObj1['OwnershipType'] || ''
      },
      "SAPCustomerCode": this.noramlPostObj1['SAPCustomerCode'] || '',
      "SAPCustomerName": this.noramlPostObj1['SAPCustomerName'] || '',
      "SAPGroupCustomerName": this.noramlPostObj1['SAPGroupCustomerName'] || '',
      "SAPGroupCustomerNumber": this.noramlPostObj1['SAPGroupCustomerNumber'] || '',
      "Currency": {
        "Id": this.noramlPostObj1['Currency'] || ''
      },
      "WebsiteUrl": this.noramlPostObj1['WebsiteUrl'] || '',
      "Contact": {
        "ContactNo": this.noramlPostObj1['Contact'] || ''
      },
      "HeadQuarters": this.noramlPostObj1['HeadQuarters'] || '',
      "SIC": {
        "Name": this.noramlPostObj1['SIC'] || ''
      },
      "StockExchange": this.noramlPostObj1['StockExchange'] || '',
      "StockSymbol": this.noramlPostObj1['StockSymbol'] || '',
      "Address": {
        "Address1": this.noramlPostObj1['Address1'] || '',
        "Address2": this.noramlPostObj1['Address2'] || '',
        "City": {
          "Name": this.noramlPostObj1['City'] || ''
        },
        "State_Province": this.noramlPostObj1['SubDivision'] || '', // sub division ' added on 31st oct. 
        "ZipCode": this.noramlPostObj1['ZipCode'] || '',
        "Country": {
          "Name": this.noramlPostObj1['Country'] || ''
        },
        "State": {
          "SysGuid": this.noramlPostObj1['State'] || ''
        }
      },
      "TrendsNAnalysis": {
        "CompanyBrief": this.noramlPostObj1['CompanyBrief'] || '',
        "NoOfCBU": this.noramlPostObj1['NoOfCBU'] || '',
        "Forbes1000Rank": this.noramlPostObj1['Forbes1000Rank'] || '',
        "Priofit": this.noramlPostObj1['Priofit'] || '',
        "CompanyNews": this.noramlPostObj1['CompanyNews'] || '',
        "IndustryTrends": this.noramlPostObj1['IndustryTrends'] || '',
        "Outlook": this.noramlPostObj1['Outlook'] || '',
        "Swot": this.noramlPostObj1['Swot'] || ''
      },
      "ITLandScape": this.noramlPostObj1['ITLandScape'] || '',
      "AdvisoryRAnalyst": {
        "SysGuid": this.noramlPostObj1['AdvisoryRAnalyst'] || ''
      },
      "RelationShipType": {
        "Id": this.noramlPostObj1['RelationShipType'] || ''
      },
      "EntityType": {
        "Id": this.noramlPostObj1['EntityType'] || ''
      },
      "Comment": this.noramlPostObj1['Comment'] || '',
      "AttributeComment": attrComment || [],
      "BusinessDescription": this.noramlPostObj1['BusinessDescription'] || '',
      "Email": this.noramlPostObj1['Email'] || '',
      "CustomerBusinessUnit": this.noramlPostObj1['CustomerBusinessUnit'] || [],
      "AccountAlliance": this.noramlPostObj1['AccountAlliance'] || [],
      "ActiveAccountCompetitors": this.noramlPostObj1['ActiveAccountCompetitors'] || [],
      "AdvisoryRAnalystList": this.noramlPostObj1['AdvisoryRAnalystList'] || [],
      "EmployeeCount": this.noramlPostObj1['Employees'] || '',
      "CountryCode": this.noramlPostObj1['CountryCode'] || '',
      "Revenue": this.noramlPostObj1['Revenue'] || '',
      "OperatingMargin": this.noramlPostObj1['OperatingMargin'] || '',
      "MarketValue": this.noramlPostObj1['MarketValue'] || '',
      "ReturnOnEquity": +this.noramlPostObj1['"ReturnOnEquity"'] || '',
      "PursuedopportunityRemarks": this.noramlPostObj1['PursuedopportunityRemarks'] || '',
      "AccountADM": this.noramlPostObj1['AccountADM'] || [],
      "IsPrivateEquityOwned": (this.noramlPostObj1['IsPrivateEquityOwned'] == false || this.noramlPostObj1['IsPrivateEquityOwned'] == 'No') ? false : true,
      "PrivateEquityOwned": {
        "SysGuid": this.noramlPostObj1['PrivateEquityOwned'] || ''
      },
    };
    // let keys = Object.keys(obj);
    // console.log(keys);
    // let postObj = {};
    // let val;
    // keys.forEach(k => {
    //   console.log(obj[k]);
    //   if (typeof obj[k] === 'object') {
    //     val = this.userdat.getValueFromNestedObject(obj[k]);
    //     console.log(val);
    //     if (this.userdat.searchFieldValidator(val)) {
    //       console.log(val);
    //       postObj[k] = val;
    //     } else {
    //       delete obj[k];
    //     }
    //   }
    //   else if (!this.userdat.searchFieldValidator(obj[k])) {
    //     delete obj[k];
    //   }
    // });
    // let validatedObj = this.userdat.getValueFromNestedObject(keys);

    // if account created via DNB, then passing dnb parent/ultimate parent values in payload.
    if (this.DnbParent) {
      console.log("has dn  parent", this.DnbParent);
      obj['ParentAccount']['SysGuid'] = '';
      obj['ParentAccount']['DNBParent'] = this.DnbParent;
    }
    if (this.DnbUltimateParent) {
      console.log("has dn ultimate parent", this.DnbUltimateParent);
      obj['UltimateParentAccount']['SysGuid'] = '';
      obj['UltimateParentAccount']['DNBUltimateParent'] = this.DnbUltimateParent;
    }
    console.log(obj);

    if (typeof obj == 'object' && Object.keys(obj).length > 0) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        this.accountListService.AllTabs_Edit(obj).subscribe(result => {
          if (!result.IsError) {
            this.editApicallSuccess = true;
            this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
            // if (!this.camundaApi) {
            this.snackBar.open(result.Message, '', {
              duration: 5000
            });
            // }
            if ((typeof this.camundaPostObj['account'] == 'object' && Object.keys(this.camundaPostObj['account']).length == 0) || !this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr)) {
              // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
              this.isLoading = false;
              if (this.standByChange) {
                this.accountListService.setSession('routeParamsTrasition', { 'route_from': 'acc_trasistion', 'Id': this.SysGuidid });
                // this.router.navigateByUrl('accounts/accounttransition/' + this.SysGuidid)
                this.router.navigate(["/accounts/accounttransition"]);
                this.standByChange = false;
              }
              else
                this.getAccountDetails();
              //   this.router.navigate(['/accounts/accountlist/farming']);
            }
            else {
              if (this.accountType == 2) {
                this.getAccountDetails();
              }
              else this.isLoading = true;
            }
          }
          else {
            this.isLoading = false;
            this.editApicallSuccess = false;
            this.snackBar.open(result.Message, '', {
              duration: 5000
            });
            if (!((typeof this.camundaPostObj['account'] == 'object' && Object.keys(this.camundaPostObj['account']).length == 0) || !this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr))) {
              this.isLoading = true;
            }
          }
          console.log(result);
          resolve(this.editApicallSuccess)
          // this.getAccountDetails();
        }, error => {
          this.isLoading = false;
          this.editApicallSuccess = false;
          this.snackBar.open(error.Message, '', {
            duration: 5000
          });
          if (!((typeof this.camundaPostObj['account'] == 'object' && Object.keys(this.camundaPostObj['account']).length == 0) || !this.isApprovalAttrComment(this.AttributeComment, this.apprvalArr))) {
            this.isLoading = true;
          }
          resolve(this.editApicallSuccess)
        });
      })

    }

  }
  saveRelationShip() {
    this.submitToCamunda();

    // let obj = {
    //   "SysGuid": this.SysGuidid,
    //   "AdvisoryRAnalyst":
    //   { "SysGuid": this.vendorDetails[this.indexFinder(this.vendorDetails, "AdvisoryRAnalyst")].Id },
    //   // "Name": this.vendorDetails[this.indexFinder(this.vendorDetails, "AdvisoryRAnalyst")].vals

    //   "RelationShipType": { 'Id': this.vendorDetails[this.indexFinder(this.vendorDetails, "RelationShipType")].Id }
    // }
    // const dialogRef = this.dialog.open(OpensaveComments, {
    //   width: '380px',
    //   data: { 'IsHelpLineTicket': this.IsHelpLineTicket }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log("After close==============================> ", result);
    //   obj["Comment"] = result;
    //   if (result != '') {
    //     this.master3Api.SaveRelationShips(obj).subscribe(result => {
    //       this.hideEditPart();
    //       console.log(result);
    //     })
    //   }
    // })


  }
  saveAccoutRE() {
    this.submitToCamunda();
    // console.log(this.Accstructure);
    // console.log(this.sapDetails);
    // let postObj = {};
    // postObj["SysGuid"] = this.SysGuidid;
    // this.Accstructure.forEach(elt => {
    //   postObj[elt.fkey] = { "Id": elt.Id };
    // });
    // this.sapDetails.forEach(elt => {
    //   postObj[elt.fkey] = elt.vals;
    // });
    // console.log([postObj]);

    // const dialogRef = this.dialog.open(OpensaveComments, {
    //   width: '380px',
    //   data: { 'IsHelpLineTicket': this.IsHelpLineTicket }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log("After close==============================> ", result);
    //   postObj["Comment"] = result;
    //   if (result != '') {
    //     this.master3Api.SaveAccountRE(postObj).subscribe(result => {
    //       console.log(result);
    //       this.hideEditPart();
    //       this.AccountRENonEditable = true;
    //       this.AccountREEditable = false;
    //       this.editPartAccountRE = false;
    //       this.accountTab = true;
    //     });
    //   }
    // })


  }
  // OpenRequested() {
  //   const dialogRef = this.dialog.open(RequestActivated,
  //     {
  //       width: '380px'
  //     });
  // }
  deleterow(data, i) {
    // this.isLoading = true;
    // this.accountListService.DeLinkAlliance(data.MapGuid).subscribe(result => {
    // this.isLoading = false;
    // this.snackBar.open(result['Message'], '', {
    //   duration: 3000
    // });
    // if (!result.IsError) {
    if (this.table_data[i].MapGuid != "") {
      this.table_data[i].LinkActionType = 3;
    }
    else {
      this.table_data.splice(i, 1);
    }


    // }
    // }, error => { this.isLoading = false; }
    // );
  }
  deleteAnalystrow(data, i) {
    if (this.table_dataaccAdvisory[i].MapGuid != "") {
      this.table_dataaccAdvisory[i].LinkActionType = 3;
    }
    else {
      this.table_dataaccAdvisory.splice(i, 1);
    }
    // this.isLoading = true;
    // this.accountListService.DeLinkAdvisory(data.MapGuid).subscribe(result => {
    // this.isLoading = false;
    // this.snackBar.open(result['Message'], '', {
    //   duration: 3000
    // });
    // if (!result.IsError) {
    // }
    // }, error => { this.isLoading = false; }
    // );
  }
  deleterowalliance(data, i) {
    console.log(data);
    console.log(this.accountCompetitors);
    if (this.accountCompetitors[i].MapGuid != "" && this.accountCompetitors[i].LinkActionType != 1) {
      this.accountCompetitors[i].LinkActionType = 3;
      console.log(data);
    }
    else {
      this.accountCompetitors.splice(i, 1);
      console.log(data);
    }
    // console.log(this.accountCompetitors)
    // if(data)
    // this.delCompeteData = data;
    // this.isLoading = true;
    // this.accountListService.DeLinkCompetitor(data.MapGuid).subscribe(result => {
    // this.isLoading = false;
    // this.snackBar.open(result['Message'], '', {
    // duration: 3000
    // });
    // if (!result.IsError) {
    // } else {

    // }
    // }, error => { this.isLoading = false; }
    // );
  }
  addrow() {
    // open popup modal
    // this.table_data.push(
    //   {
    //     'alliance': 'Name 1',
    //     'contact': 'Vijay Kumar',
    //     'checkbox_clicked1': false,
    //   }
    // )

  }
  addrowalliance() {
    // open popup modal
    // debugger;
    // this.alliance_table.push({
    //   'name': 'Akash Anand',
    // })
  }

  openHelpline() {
    const dialogRef = this.dialog.open(Helpline,
      {

        disableClose: true,
        width: '380px'
      });
  }
  OpenAccountOwnerdetails() {
    //  this.greenborder= !this.greenborder;
    const dialogRef = this.dialog.open(OpenAccountOwnerdetails,
      {

        disableClose: true,
        width: '380px'
      });
  }
  buildPostArray(array, postObj) {
    array.forEach(elt => {


      if (elt.control == 'input') {
        if (elt.fkey == 'DeliveryManagerADHVDH') {
          postObj[elt.fkey] = { "FullName": (elt.vals) ? elt.vals : (elt.values) ? elt.values : elt.record };
        } else {
          postObj[elt.fkey] = (elt.vals) ? elt.vals : (elt.values) ? elt.values : elt.record;
        }
      } else if (elt.control == 'dropdown' || elt.control == 'searchinput' || elt.control == 'select') {
        if (elt.fkey == 'ParentAccount' || elt.fkey == 'UltimateParentAccount' || elt.fkey == 'Geo' || elt.fkey == 'Region' || elt.fkey == 'StandByAccountOwner' || elt.fkey == 'Owner') {
          postObj[elt.fkey] = { "SysGuid": elt.Id };
        } else {
          postObj[elt.fkey] = { "Id": elt.Id };
        }
        if (elt.fkey == 'IsGovAccount' || elt.fkey == "IsNewAgeBusiness" || elt.fkey == 'TerritoryFlag') {
          postObj[elt.fkey] = JSON.parse(elt.Id);
        }
      }
      if (elt.fkey == 'Contact') {
        postObj[elt.fkey] = { "ContactNo": elt.vals };
      }
      if (elt.fkey == 'SIC') {
        postObj[elt.fkey] = { "Name": elt.vals };
      }
    });
    console.log(postObj);
  }
  clearComment(attr) {
    let ind1 = this.AccountAttribute.findIndex(acc => acc.AttributeName == attr.AttributeName);
    let attr_id;
    if (ind1 != -1) {
      attr_id = this.AccountAttribute[ind1].AttributeGuid;
      let ind = this.AttributeComment.findIndex(atr => atr.Guid == attr_id);
      console.log(ind);
      this.AttributeComment.splice(ind, 1);
      console.log(this.AttributeComment);
    }
  }
  savecomments(attr) {
    if (!attr.comment) this.clearComment(attr);
    else {
      console.log(attr);
      let ind1 = this.AccountAttribute.findIndex(acc => acc.AttributeName == attr.AttributeName);
      let attr_id;
      if (ind1 != -1) {
        attr_id = this.AccountAttribute[ind1].AttributeGuid;
        let ind = this.AttributeComment.findIndex(atr => atr.Guid == attr_id);
        console.log(ind);

        if (ind != -1)
          this.AttributeComment[ind]['Comments'] = attr.comment;
        else
          this.AttributeComment.push({ 'Guid': attr_id, 'Comments': attr.comment, 'control': attr.control, 'attrName': attr.camunda_key });
        console.log(this.AttributeComment);
      }
    }

    // camunda Attribute Comments
    // this.build_attribute();
    // this.getAttributeId(attr.);
    // let obj = {
    //   "CustomerAccount": {
    //     "SysGuid": this.SysGuidid   //Account Guid
    //   },
    //   "Comments": savecomments,
    //   "Guid": "1eba9bce-4667-e911-a95a-000d3aa053b9"    //this I will provide in details after modifying details response structure.
    // }

    // this.accountListService.AccountAttributeComment(obj).subscribe(result => {
    //   console.log(result);

    // })
  }
  getComparisionValue(value, typeOfBlock) {
    console.log('value' + value)
    if (value === 'dropdown') {
      return 'Id';
    } else {
      if (typeOfBlock === 'owner') {
        return 'record';
      } else if (typeOfBlock === 'CustomDetails') {
        return 'vals';
      } else {
        return 'values';
      }

    }

  }
  validateCompleteFOrm() {
    const invalidElements = this.el.nativeElement.querySelector('input');
    invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Type'))
    // this.submitted = true;
    let accountDetailCount = 0;
    let OnerShipDetailCount = 0;
    let CustomDetails = 0;
    let totalCount = 0;
    // let index = 0;
    this.accountDetails.map((ele) => {
      // console.log(ele.fkey);
      // let data = getComparisionValue();
      if (ele.enableMandatory) {
        if (ele.control != 'disabledinput') {
          console.log("comaprision value", ele[this.getComparisionValue(ele.control, 'detail')] === '', "dhg")
          if (ele[this.getComparisionValue(ele.control, 'detail')] === '') {
            ele['validationKey'] = true;
            // ele.Id = data.Id || data.SysGuid || '';
            // console.log(ele);
            accountDetailCount = accountDetailCount + 1;
            // return;
          } else {
            // count = count +1;
            // count = --count ;
            ele['validationKey'] = false;
            // return;
          }
        }
      }
    });
    this.ownershipDetails.map((ele) => {
      // console.log(ele.fkey);
      // let data = getComparisionValue();
      if (ele.enableMandatory) {
        if (ele.control != 'disabledinput') {
          if (this.accountDetails[ind]['Id'] == 3 || this.accountDetails[ind]['Id'] == 12 || this.accountDetails[ind]['Id'] == 1 || this.accountDetails[ind]['Id'] == 2) {
            if (ele[this.getComparisionValue(ele.control, 'owner')] === '') {
              ele['validationKey'] = true;
              // ele.Id = data.Id || data.SysGuid || '';
              // console.log(ele);
              OnerShipDetailCount = OnerShipDetailCount + 1;
              // return;
            } else {
              // count = count +1;
              // count = --count ;
              ele['validationKey'] = false;
              // return;
            }
          }
          else {
            ele['validationKey'] = false;
          }
        }
      }
    });
    this.CustomDetails.map((ele) => {
      // console.log(ele.fkey);
      // let data = getComparisionValue();
      if (ele.enableMandatory) {
        if (ele.control != 'disabledinput') {
          if (this.accountDetails[ind]['Id'] !== 2) {
            if (ele[this.getComparisionValue(ele.control, 'CustomDetails')] === '') {
              ele['validationKey'] = true;
              // ele.Id = data.Id || data.SysGuid || '';
              // console.log(ele);
              CustomDetails = CustomDetails + 1;
              // return;
            } else {
              // count = count +1;
              // count = --count ;
              ele['validationKey'] = false;
              // return;
            }
          } else {
            ele['validationKey'] = false;
          }
        }
      }
    });
    // this.creditDetails

    totalCount = accountDetailCount + OnerShipDetailCount + CustomDetails;
    // if( this.showOverview())
    if (accountDetailCount + OnerShipDetailCount !== 0) {
      this.showOverview();
    } else if (CustomDetails !== 0) {
      this.showCustomer();
    }
    if (totalCount === 0) {
      return true;
    } else {
      return false;
    }
    // c
  }
  saveOverview() {
    let isValidation = this.validateCompleteFOrm();
    if (isValidation) {
      this.submitToCamunda();
    }
    setTimeout(() => {
      const invalidElements = this.el.nativeElement.querySelector('input.border-pink,mat-select.border-pink,input.error,mat-select.error');
      if (invalidElements) {
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidElements.focus()
      }
    }, 100)
    // console.log('isValidation----' + isValidation);
    // if ()
    // this.submitToCamunda();
    // let obj = {
    //   "SysGuid": this.SysGuidid,
    //   "Name": this.accountDetails[this.indexFinder(this.accountDetails, 'Name')].vals,
    //   "Type": { "Id": this.accountDetails[this.indexFinder(this.accountDetails, 'Type')].Id },
    //   "ProposedAccountType": { "Id": this.accountDetails[this.indexFinder(this.accountDetails, 'ProposedAccountType')].Id },
    //   "AccountClassification": { "Id": this.accountDetails[this.indexFinder(this.accountDetails, 'AccountClassification')].Id },
    //   "ParentAccount": { "SysGuid": this.accountDetails[this.indexFinder(this.accountDetails, 'ParentAccount')].Id },
    //   "UltimateParentAccount": { "SysGuid": this.accountDetails[this.indexFinder(this.accountDetails, 'UltimateParentAccount')].Id },
    //   "ProposedAccountClassification": { "Id": this.accountDetails[this.indexFinder(this.accountDetails, 'ProposedAccountClassification')].Id },
    //   "SBU": { "Id": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'SBU')].Id },
    //   "Vertical": { "Id": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'Vertical')].Id },
    //   "SubVertical": { "Id": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'SubVertical')].Id },
    //   "DeliveryManagerADHVDH": { "FullName": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'DeliveryManagerADHVDH')].record },
    //   "Geo": { "SysGuid": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'Geo')].Id },
    //   "Region": { "SysGuid": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'Region')].Id },
    //   "StandByAccountOwner": { "SysGuid": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'StandByAccountOwner')].Id },
    //   "creditscore": this.creditDetails[this.indexFinder(this.creditDetails, 'CreditScore')].vals,
    //   "AccountCategory": { "Id": this.engageDetails[this.indexFinder(this.engageDetails, 'AccountCategory')].Id },
    //   "IsGovAccount": JSON.parse(this.engageDetails[this.indexFinder(this.engageDetails, 'IsGovAccount')].Id),
    //   "IsNewAgeBusiness": JSON.parse(this.engageDetails[this.indexFinder(this.engageDetails, 'IsNewAgeBusiness')].Id),
    //   "Owner": { "SysGuid": this.ownershipDetails[this.indexFinder(this.ownershipDetails, 'Owner')].Id }
    // };

    // const dialogRef = this.dialog.open(OpensaveComments, {
    //   width: '380px',
    //   data: { 'IsHelpLineTicket': this.IsHelpLineTicket }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log("After close==============================> ", result);
    //   obj["Comment"] = result;
    //   if (result != '') {
    //     this.master3Api.SaveAccountOverview(obj).subscribe(result => {
    //       console.log(result);
    //       this.hideEditPart();
    //     });
    //   }
    // })
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }
  }
  indexFinder(obj, key) {
    let ind = obj.findIndex(ob => ob.fkey == key);
    return ind;
  }
  customerSave() {

    this.submitToCamunda();
    // let postObj = {};
    // postObj["SysGuid"] = this.SysGuidid;
    // this.buildPostArray(this.CustomDetails, postObj);
    // this.buildPostArray(this.addressDetails, postObj);
    // this.buildPostArray(this.trendsAnalysis, postObj);
    // this.buildPostArray(this.LandIT, postObj);
    // console.log(postObj);


    // let obj = {

    //   "SysGuid": this.SysGuidid,
    //   "Currency": {
    //     "Id": this.CustomDetails[this.indexFinder(this.CustomDetails, 'Currency')].Id
    //   },
    //   "WebsiteUrl": this.CustomDetails[this.indexFinder(this.CustomDetails, 'WebsiteUrl')].vals,
    //   "Contact": {
    //     "ContactNo": this.CustomDetails[this.indexFinder(this.CustomDetails, 'Contact')].vals
    //   },
    //   "HeadQuarters": this.CustomDetails[this.indexFinder(this.CustomDetails, 'HeadQuarters')].vals,
    //   "SIC": {
    //     "Name": this.CustomDetails[this.indexFinder(this.CustomDetails, 'SIC')].vals
    //   },
    //   "StockExchange": this.CustomDetails[this.indexFinder(this.CustomDetails, 'StockExchange')].vals,
    //   "StockSymbol": this.CustomDetails[this.indexFinder(this.CustomDetails, 'StockSymbol')].vals,
    //   "Address": {
    //     "Address1": this.addressDetails[this.indexFinder(this.addressDetails, 'Address1')].vals,
    //     "Address2": this.addressDetails[this.indexFinder(this.addressDetails, 'Address2')].vals,
    //     "City": {
    //       "SysGuid": this.addressDetails[this.indexFinder(this.addressDetails, 'City')].Id,
    //     },
    //     "Country": {
    //       "SysGuid": this.addressDetails[this.indexFinder(this.addressDetails, 'Country')].Id,
    //     },
    //     "Region": {
    //       "SysGuid": '',
    //     },
    //     "State_Province": this.addressDetails[this.indexFinder(this.addressDetails, 'State_Province')].vals,
    //     "ZipCode": this.addressDetails[this.indexFinder(this.addressDetails, 'ZipCode')].vals,
    //   },
    //   "TrendsNAnalysis": {
    //     "CompanyBrief": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'CompanyBrief')].vals,
    //     "NoOfCBU": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'NoOfCBU')].vals,
    //     "Forbes1000Rank": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'Forbes1000Rank')].vals,
    //     "Priofit": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'Priofit')].vals,
    //     "CompanyNews": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'CompanyNews')].vals,
    //     "IndustryTrends": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'IndustryTrends')].vals,
    //     "Outlook": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'Outlook')].vals,
    //     "Swot": this.trendsAnalysis[this.indexFinder(this.trendsAnalysis, 'Swot')].vals,
    //   },
    //   "ITLandScape": this.LandIT[this.indexFinder(this.LandIT, 'ITLandScape')].vals,
    //   "Comment": "Comment"
    // }

    // const dialogRef = this.dialog.open(OpensaveComments, {
    //   width: '380px',
    //   data: { 'IsHelpLineTicket': this.IsHelpLineTicket }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log("After close==============================> ", result);
    //   obj["Comment"] = result;
    //   if (result != '') {
    //     this.master3Api.SaveCustomerDetails(obj).subscribe(result => {
    //       console.log(result);
    //       this.hideEditPart();
    //     })
    //   }
    // })
  }
  ActivateorDeActivateAccountCBU(item) {
    console.log(item);

    let IsActivate = false;
    if (item.Status.Value == 'Deactive' || item.Status.Value == 'Inactive') {
      IsActivate = true; // interchanged the isactive status to send the proper data
    } else if (item.Status.Value == 'Active') {
      IsActivate = false; // interchanged the isactive status to send the proper data
    }
    this.isLoading = true;
    // this.master3Api.ActivateorDeActivateAccountCBU(item.MapGuid, IsActivate).subscribe(result => {
    // console.log(result);
    this.isLoading = false;
    // if (!result['IsError'] && result['ResponseObject']) {
    if (item.Status.Value == 'Deactive' || item.Status.Value == 'Inactive') {
      item.Status.Value = 'Active';
    } else if (item.Status.Value == 'Active') {
      item.Status.Value = 'Inactive';
      // }
    }
    // },
    // error => {
    // this.isLoading = false;
    // });
  }
  // deleteCBU(i) {
  //   this.CustomerBusinessUnit.record.splice(i, 1);
  // }
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
    nextLink: ''
  };

  getCommonData(controlName) {
    const subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    const verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    const geoIdIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Geo');
    const stateIdIndex = this.ownershipDetails.findIndex(own => own.fkey == 'CountrySubDivisionReference');
    const countryIdIndex = this.ownershipDetails.findIndex(own => own.fkey == 'CountryReference');
    const regionIdIdIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Region');

    // switch (controlName) {
    return {
      // case 'SBU':
      //   return { SbuId: '' }
      // case 'Vertical':
      //   return { SbuId: this.ownershipDetails[subIndex]['Id'] || '' }
      // case 'SubVertical':
      //   return { verticalId: this.ownershipDetails[verticalIndex]['Id'] || '' }
      //       case 'Geo':
      //   return { geoId: this.ownershipDetails[geoIdIndex]['Id'] || '' }
      //       case 'Geo':
      //   return { geoId: this.ownershipDetails[geoIdIndex]['Id'] || '' }
      stateId: this.ownershipDetails[stateIdIndex]['Id'] || '',
      countryId: this.ownershipDetails[countryIdIndex]['Id'] || '',
      regionId: this.ownershipDetails[regionIdIdIndex]['Id'] || '',
      geoId: this.ownershipDetails[geoIdIndex]['Id'] || '',
      verticalId: this.ownershipDetails[verticalIndex]['Id'] || '',
      SbuId: this.ownershipDetails[subIndex]['Id'] || ''
    }
    // stateId: this.accountCreationObj['state'] ? this.accountCreationObj['state'] : '',
    // countryId: this.accountCreationObj['country'] ? this.accountCreationObj['country'] : '',
    // regionId: this.accountCreationObj['region'] ? this.accountCreationObj['region'] : '',
    // geoId: this.accountCreationObj['geography'] ? this.accountCreationObj['geography'] : '',
    // verticalId: this.accountCreationObj['vertical'] ? this.accountCreationObj['vertical'] : '',
    // SbuId: this.accountCreationObj['sbu'] ? this.accountCreationObj['sbu'] : '',

    // return {
    //   guid: '',
    // }
  }
  sendAccountOwnerToAdvance = [];
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AccountOwnerSearch': { return (this.sendAccountOwnerToAdvance.length > 0) ? this.sendAccountOwnerToAdvance : [] }
      // case 'StandByAccountOwnerSearch' : { return (this.sendStandByOwnerToAdvance.length > 0) ? this.sendStandByOwnerToAdvance : []}
      // case 'BUContactSearch' : {return (this.sendCBUToAdvance.length > 0) ? this.sendCBUToAdvance : []}
      // case 'AllianceContactSearch' : {return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : []}
      // case 'AdvisoryAnalystSearch' : {return (this.sendAdvisoryToAdvance.length > 0) ? this.sendAdvisoryToAdvance : []}
    }
  }
  getAdvLookupdata(res, controlName) {
    if (controlName === 'Currency') {
      return this.advLookupCurrency;
    } else if (controlName === 'Vertical' || controlName === 'SubVertical') {
      return this.advSub_and_vertical;
    } else if (controlName === 'Region' || controlName === 'CountryReference' || controlName === 'CountrySubDivisionReference' || controlName === 'CityRegionReference') {
      return this.advlocation_temp;
    } else {
      return res;
    }
  }
  openadvancetabs(formArray, controlName, initalLookupData, value, valkey, typeOfBlock?): void {
    console.log(controlName, AccountAdvNames);
    if (!value) {
      // this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = AccountHeaders[controlName]
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    let advLookupdata = this.getAdvLookupdata(initalLookupData, controlName);
    // this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: advLookupdata, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {

      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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
      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(controlName), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (x['objectRowData'].controlName === 'SubVertical') {

            this.accountOverviewDropdown.SubVertical = this.accountOverviewDropdown.SubVertical.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } else if (x['objectRowData'].controlName === 'Vertical') {
            this.accountOverviewDropdown.Vertical = this.accountOverviewDropdown.Vertical.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } else (x['objectRowData'].controlName === 'Region' || x['objectRowData'].controlName === 'CountryReference' || x['objectRowData'].controlName === 'CountrySubDivisionReference' || x['objectRowData'].controlName === 'CityRegionReference')
          {
            this.accountOverviewDropdown[controlName] = this.accountOverviewDropdown[controlName].concat(res.ResponseObject);
            this.location_temp = this.location_temp.concat(res.ResponseObject);
          }
        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          if (x['objectRowData'].controlName === 'SubVertical') {

            this.accountOverviewDropdown.SubVertical = this.accountOverviewDropdown.SubVertical.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } else if (x['objectRowData'].controlName === 'Vertical') {
            this.accountOverviewDropdown.Vertical = this.accountOverviewDropdown.Vertical.concat(res.ResponseObject);
            this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          } else (x['objectRowData'].controlName === 'Region' || x['objectRowData'].controlName === 'CountryReference' || x['objectRowData'].controlName === 'CountrySubDivisionReference' || x['objectRowData'].controlName === 'CityRegionReference')
          {
            this.accountOverviewDropdown[controlName] = this.accountOverviewDropdown[controlName].concat(res.ResponseObject);
            this.location_temp = this.location_temp.concat(res.ResponseObject);
          }
        }
        else if (x.action == "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }

        }

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        // this.emptyArray(result.controlName)
        this.clearChildAdvanceSearch(formArray, controlName, valkey);
        this.AppendParticularInputFun(formArray, result.selectedData, controlName, valkey, typeOfBlock)
      }
    });
  }
  clearChildAdvanceSearch(dataArray, controlName, valkey) {
    //  debugger;
    const verticalIndex = dataArray.findIndex(da => da.fkey == 'Vertical');
    const subverticalIndex = dataArray.findIndex(da => da.fkey == 'SubVertical');
    console.log(dataArray, controlName, valkey, verticalIndex, subverticalIndex);

    switch (controlName) {
      case 'SBU':
        dataArray[verticalIndex][valkey] = '';
        dataArray[verticalIndex].Id = '';
        dataArray[subverticalIndex][valkey] = '';
        dataArray[subverticalIndex].Id = '';
        return;
      case 'Vertical':
        dataArray[subverticalIndex][valkey] = '';
        dataArray[subverticalIndex].Id = '';
        return;
      case 'SubVertical':
        return;
    }
  }

  AppendParticularInputFun(formArray, selectedData, controlName, valkey, typeOfBlock) {
    // console.log(formArray,controlName,valkey);
    let selectedDataId = this.accountOverviewDropdown[controlName].findIndex(res => res.Name == selectedData[0].Name);
    if (selectedData) {
      // let accountDetailsId = this.accountDetails.findIndex(own => own.fkey == controlName);
      if (typeOfBlock === 'accountDetail') {
        let accountDetailsId = this.accountDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(this.accountDetails[accountDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      }
      else if (typeOfBlock === 'ownershipDetails') {
        let ownershipDetailsId = this.ownershipDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(this.ownershipDetails[ownershipDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      }
      // else if (typeOfBlock === 'swappingDetails') {
      //   let swappingDetailsId = this.swappingDetails.findIndex(own => own.fkey == controlName);
      //   this.getPosts(formArray, this.swappingDetails[swappingDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      // }

      else {
        let CustomDetailsId = this.CustomDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(this.CustomDetails[CustomDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      }

      // let CustomDetailsId = this.CustomDetails.findIndex(own => own.fkey == controlName);

      // if (selectedData.length > 0) {
      //   selectedData.forEach(data => {
      //     // console.log(data);
      //     formArray.map((ele) => {
      //       // console.log(ele.fkey);
      //       if (ele.fkey == controlName) {
      //         ele[valkey] = this.getdecodevalue(data.FullName) || this.getdecodevalue(data.Name) || this.getdecodevalue(data.Desc) || '';
      //         ele.Id = data.Id || data.SysGuid || '';
      //         // console.log(ele);
      //         return;
      //       }
      //     })
      //   });
      // }
    }
  }
  // AppendParticularInputFun(formArray, selectedData, controlName, valkey) {
  //   // console.log(formArray,controlName,valkey);
  //   if (selectedData) {
  //     if (selectedData.length > 0) {
  //       selectedData.forEach(data => {
  //         // console.log(data);
  //         formArray.map((ele) => {
  //           // console.log(ele.fkey);
  //           if (ele.fkey == controlName) {
  //             ele[valkey] = this.getdecodevalue(data.FullName) || this.getdecodevalue(data.Name) || this.getdecodevalue(data.Desc) || '';
  //             ele.Id = data.Id || data.SysGuid || '';
  //             // console.log(ele);
  //             return;
  //           }
  //         })
  //       });
  //     }
  //   }
  // }

  OpenaddAlliancepopup() //chethana april 30th add alliance
  {
    this.editable = true;
    const dialogRef = this.dialog.open(OpenaddAlliancepopupcomponent,
      {
        disableClose: true,
        width: '450px',
        data: { SeletectedData: this.table_data }

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result && result.alliance && result.alliance.SysGuid) {
        if (this.table_data && this.table_data.findIndex(td => td.SysGuid && (td.SysGuid.trim()).toLowerCase() == (result.alliance.SysGuid.trim()).toLowerCase()) == -1) {

          let obj = {
            "LinkActionType": 1,   //New-1  ,Existing -2 ,Delete -3
            "SysGuid": result.alliance.SysGuid,
            "Name": result.alliance.Name.trim(),
            'MapGuid': ""
          };
          this.isLoading = true;
          // this.accountListService.AddAlliance(obj).subscribe(res => {
          // debugger;
          this.isLoading = false;
          // console.log(res);
          this.table_dataalli = obj;
          // if (!res["IsError"] && res["ResponseObject"]) {

          //let obj =    { 
          //     "LinkActionType":1,   //New-1  ,Existing -2 ,Delete -3
          //     "Name":"Alliance name pass here",
          //           "SysGuid":"f0c2d032-a011-ea11-a964-000d3aa16502",
          // 'MapGuid': ""

          //  }

          this.table_data.push(obj);

          // this.table_dataalli.push({
          //   'SysGuid':res.ResponseObject.SysGuid,
          //   'MapGuid':res.ResponseObject.MapGuid,
          //   'tabledata1': res.ResponseObject.Name,
          //   'tabledata2': result.contactcampaign.value
          // })
          console.log(this.table_data);
          // }
          // }, error => { this.isLoading = false; });
        }
        else {
          this.snackBar.open("`" + result.alliance.Name + "`" + " is already added", '', {
            duration: 3000
          });
        }
      }
    });
  }

  OpenaddAdvisorypopup() //chethana sep 4th add Advisory start
  {
    this.editable2 = true;
    const dialogRef = this.dialog.open(OpenaddAdvisorypopupcomponent,
      {
        disableClose: true,
        width: '450px',
        data: this.table_dataaccAdvisory
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('res after close', result);
      if (result && result[0].Name && result[0].SysGuid) {
        if (this.table_dataaccAdvisory && this.table_dataaccAdvisory.findIndex(td => td.SysGuid && (td.SysGuid.trim()).toLowerCase() == (result[0].SysGuid.trim()).toLowerCase()) == -1) {
          console.log('The dialog was closed', result);
          let obj = {
            "SysGuid": this.SysGuidid,
            "AdvisoryRAnalystList": []
          };
          // result.map((ele) => {
          //   obj.AdvisoryRAnalystList.push({ "LinkActionType": 1, "SysGuid": ele.SysGuid, "Name": ele.Name })
          // })

          // this.isLoading = true;
          // this.accountListService.AddAdvisoryAnalyst(obj).subscribe(res => {
          // debugger;
          // this.isLoading = false;
          // console.log(res);
          // this.table_dataalli = obj;
          // if (!res["IsError"] && res["ResponseObject"]) {
          result.map((ele) => {
            this.table_dataaccAdvisory.push(
              {
                "LinkActionType": 1,
                "SysGuid": ele.SysGuid,
                "Name": ele.Name,
                "MapGuid": ''
                // 'AdvisoryRAnalystGuid': ele.SysGuid,
                // 'AdvisoryRAnalystName': ele.Name,
                // 'MapGuid': ele.MapGuid
              }
            );
          })

          // "LinkActionType":1,  //New-1 , Existing-2  ,Delete-3
          // "SysGuid":"f0c2d032-a011-ea11-a964-000d3aa16502",
          // "Name":"AdvisoryName"

          // console.log(this.table_data);
          // }
          // }, error => { this.isLoading = false; });
        } else {
          this.snackBar.open("`" + result[0].Name + "`" + " is already added", '', {
            duration: 3000
          });
        }
      }
    });
  }//chethana sep 4th add Advisory end
  checkCompetitor(result) {
    if (this.accountCompetitors && this.accountCompetitors.findIndex(ac => ac.Name && ac.Name.toLowerCase() == (result.Name.trim()).toLowerCase()) == -1) {
      let obj = {
        "LinkActionType": 1,  //New-1 , Existing-2 , Delete-3
        // "SysGuid": this.SysGuidid,
        "Competitor": {
          "SysGuid": result.Guid
        },
        "Name": result.Name.trim(),
        'checkbox_clicked1': false,
      };
      this.accountCompetitors.push(obj);
    }
    else {
      this.snackBar.open(result.Name + " is already added", '', {
        duration: 3000
      });
    }
  }

  OpenaddActivepopup() {
    this.editable1 = true;
    // let dataCompete = this.accountCompetitors.push(this.delCompeteData);
    const dialogRef = this.dialog.open(OpenaddActivepopupcomponent,
      {
        disableClose: true,
        width: '450px',
        data: this.accountCompetitors
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log(this.accountCompetitors);
      if (result) {
        // if (this.accountCompetitors && this.accountCompetitors.findIndex(ac => ac.Name && ac.Name.toLowerCase() == (result.Name.trim()).toLowerCase()) == -1) {
        if (this.accountCompetitors.length > 0) {
          if (this.accountCompetitors && this.accountCompetitors.findIndex(td => td.Competitor.SysGuid && (td.Competitor.SysGuid.trim()).toLowerCase() == (result.Guid.trim()).toLowerCase()) == -1) {
            // for (let i = 0; i <= this.accountCompetitors.length - 1; i++) {
            //   if (this.accountCompetitors[i].Name === result.Name && this.accountCompetitors[i].LinkActionType == 3) {
            let obj = {
              "LinkActionType": 1,  //New-1 , Existing-2 , Delete-3
              // "SysGuid": this.SysGuidid,
              "Competitor": {
                "SysGuid": result.Guid
              },
              "Name": result.Name.trim(),
              'checkbox_clicked1': false,
            };
            this.accountCompetitors.push(obj);
            this.checkCompetitor(result);
            //     break;
            //   } else {
            //     this.checkCompetitor(result);
            //   }
            // }
          } else {
            this.snackBar.open(result.Name + " is already added", '', {
              duration: 3000
            });
          }
          //  else {
          //   this.checkCompetitor(result);
          // }
        } else {
          this.checkCompetitor(result);
        }
        // if(this.accountCompetitors)
        //   let obj = {
        //     "LinkActionType": 1,  //New-1 , Existing-2 , Delete-3
        //     // "SysGuid": this.SysGuidid,
        //     "Competitor": {
        //       "SysGuid": result.Guid
        //     },
        //     "Name": result.Name.trim(),
        //     'checkbox_clicked1': false,
        //   };
        // this.isLoading = true;
        // this.accountListService.AddCompetitor(obj).subscribe(res => {
        // debugger;
        // this.isLoading = false;
        // console.log(res);
        // this.table_dataalli = obj;
        // if (!res["IsError"] && res["ResponseObject"]) {
        // this.snackBar.open(res['Message'], '', {
        // duration: 3000
        // });
        // this.alliance_table.push({
        //   'name': result,
        //   'checkbox_clicked1': false,
        //   'MapGuid': res["ResponseObject"].MapGuid
        // });

        // this.accountCompetitors.push(obj);
        //   {
        //     'name': result.trim(),
        //     'checkbox_clicked1': false,
        //     'MapGuid': ''
        //   }
        // )
        // this.table_dataalli.push({
        //   'SysGuid':res.ResponseObject.SysGuid,
        //   'MapGuid':res.ResponseObject.MapGuid,
        //   'tabledata1': res.ResponseObject.Name,
        //   'tabledata2': result.contactcampaign.value
        // })
        //  console.log(this.table_data);

        //  }
        // }

        // });
        // }

        // else {
        //   this.snackBar.open(result.Name + " is already added", '', {
        //     duration: 3000
        //   });
        // }
      }
    }, error => { this.isLoading = false; });
  }
  /****************** add standby owner  popopup  Aug 29th start***********/
  OpenAddStandbypopup(key) {
    //  this.greenborder= !this.greenborder;
    console.log("sending standby owner", key);
    const dialogRef = this.dialog.open(OpenAddStandbypopupcomponent,
      {
        disableClose: true,
        width: '380px',
        data: {
          'key': key,
          'roleType': this.roleType,
          'SysGuid': this.SysGuidid,
          'standByAccountOwner': key == 'StandByAccountOwner' ? this.standByAccountOwner : this.accountOwner,
          'standByDesignation': key == 'StandByAccountOwner' ? this.standByDesignation : '',
          'Email': key == 'StandByAccountOwner' ? this.standByMail : '',
          'AdId': key == 'StandByAccountOwner' ? this.standByAdId : '',
        }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("response from dialog", res);
        let ind = this.ownershipDetails.findIndex(own => own.fkey == 'Owner');
        this.ownershipDetails[ind]['Id'] = res[0]['SysGuid']
        this.ownershipDetails[ind]['record'] = res[0]['FullName'];
        console.log('ownership details ', this.ownershipDetails[ind]);
      } else {
        console.log("there was some errror");
      }
    })
  }


  /****************** add standby owner  popopup  Aug 29th end***********/
  OpenaddCBUpopup() {
    const dialogRef = this.dialog.open(OpenaddCBUpopupcomponent,
      {
        disableClose: true,
        width: '450px',
        data: { SeletectedData: this.CustomerBusinessUnit }
      });
    dialogRef.afterClosed().subscribe(result => {
      // if (result && result.CustomerContact.Guid && result.Name.FullName) {
      if (result && result.Name.FullName) {
        if (this.CustomerBusinessUnit.record && this.CustomerBusinessUnit.record.findIndex(rc => rc.Name.toLowerCase() == (result.Name.FullName.trim()).toLowerCase()) == -1) {
          console.log('The dialog was closed', this.CustomerBusinessUnit.record, this.CustomerBusinessUnit.record.findIndex(rc => rc.Name == result.Name.FullName));
          // let obj = {
          //   "SysGuid": this.SysGuidid,
          //   "CustomerContact": {
          //     "Guid": result.CustomerContact.Guid,
          //     "FullName": result.CustomerContact.FullName
          //   },
          //   "BDM": {
          //     "Guid": result.BDM.Guid,
          //     "FullName": result.BDM.FullName
          //   },
          //   "Name": result.Name.FullName
          // };

          let obj = {
            "LinkActionType": 1,
            "SysGuid": this.SysGuidid,
            "Name": result.Name.FullName.trim(),
            "IsActivate": true,
            "BuyerOrg": result.BuyerOrg || false
          };
          this.isLoading = true;
          // this.master3Api.AddCBU(obj).subscribe(result => {
          console.log(result);
          this.isLoading = false;
          // obj['Status'] = { 'Id': 1, 'Value': 'Active' };
          // obj['MapGuid'] = result['ResponseObject'].MapGuid;
          this.CustomerBusinessUnit.record.push(obj);
          // }, error => { this.isLoading = false; })
        }
        else {
          this.snackBar.open(result.Name.FullName + " is already added", '', {
            duration: 3000
          });
        }
      }
    }, error => { this.isLoading = false; });
  }

  OpenrejectCBUpopup(i) {

    const dialogRef = this.dialog.open(OpenrejectCBUpopupcomponent,
      {
        disableClose: true,
        width: '450px',
        data: i
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CustomerBusinessUnit.record.splice(result.deletIndex, 1);
        //  this.isLoading = true;
        //this.detectActionValue.emit({ objectRowData: result, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }

  showOverview() {
    this.overviewTab = true;
    this.allianceTab = false;
    this.accountTab = false;
    this.CustomerTab = false;

    // this.nonEditable = true;
    // this.editPart = false;
    // this.CustomerNonEditable = false;//chethana April 1
    // this.CustomerEditable = false;//chethana April 1
    // this.editPartCustomer = false;//chethana April 26
    // this.editPartAccountRE = false;//chethana April 30th
    // this.AccountRENonEditable = false;//chethana April 30th
    // this.AccountREEditable = false;//chethana April 30th

    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }

  }
  showAlliance() {
    this.overviewTab = false;
    this.allianceTab = true;
    this.accountTab = false;
    this.CustomerTab = false;

    // this.allianceNonEditable = true;
    // this.allianceEditable = false;
    // this.CustomerNonEditable = false;//chethana April 1
    // this.CustomerEditable = false;//chethana April 1
    // this.editPartCustomer = false;//chethana April 26
    // this.editPartAccountRE = false;//chethana April 30th
    // this.AccountRENonEditable = false;//chethana April 30th
    // this.AccountREEditable = false;//chethana April 30th
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }
  }
  showAccount() {
    this.accountTab = true;
    this.overviewTab = false;
    this.allianceTab = false;
    this.CustomerTab = false;

    // this.CustomerNonEditable = false;//chethana April 1
    // this.CustomerEditable = false;//chethana April 1
    // this.editPartCustomer = false;//chethana April 26
    // this.AccountRENonEditable = true;//chethana April 30th
    // this.AccountREEditable = false;//chethana April 30th
    // // this.editPartAccountRE = true;//chethana April 30th
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }
  }
  showCustomer() {
    this.accountTab = false;
    this.overviewTab = false;
    this.allianceTab = false;
    this.CustomerTab = true;

    // this.CustomerNonEditable = true; //chethana April 1
    // this.editPartCustomer = false;//chethana April 1
    // this.CustomerEditable = false;//chethana April 1
    // this.AccountRENonEditable = false;//chethana April 30th
    // this.AccountREEditable = false;//chethana April 30th
    // this.editPartAccountRE = false;//chethana April 30th
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }

  }
  // chethana added as per Nov 26th vd
  Activereftabs() {
    this.activeTab = true;
    this.deactiveTab = false;
  }
  // chethana added as per Nov 26th vd
  Deactivetabs() {
    this.activeTab = false;
    this.deactiveTab = true;
  }
  // showVisitedTab(key) {
  //   console.log(this.detailsTabs, this.detailsTabs[key]);
  //   let keys = Object.keys(this.detailsTabs);
  //   console.log(keys);

  //   keys.map(eltKey => {
  //     console.log(eltKey, key, this.detailsTabs[key]);
  //     if (key == eltKey) this.detailsTabs[key] = true;
  //     else this.detailsTabs[key] = false;
  //   });
  // }
  restrictspace1(key, e, data) {
    let data1 = data.trim()
    console.log(data1);
    let ind = this.accountDetails.findIndex((obj => obj.fkey == key));
    console.log("fkey's index", ind)
    if (e.which === 32 && !data.length) {
      this.accountDetails[ind].values = '';
      e.preventDefault();
    }
    else if (!data1.length) {
      e.target.value = '';
      this.accountDetails[ind].values = '';
    }
    return;
  }
  showEditPart() {
    let index1 = this.accountDetails.findIndex(own => own.fkey == 'Type');
    // this.accountDetails[index1]['Id'] = '';
    this.validationOnType(this.accountDetails[index1] ? this.accountDetails[index1] : '', '', '', '');
    console.log(this.accountOverviewDropdown);

    this.nonEditable = false;
    this.editPart = true;


    this.editPartCustomer = true;
    // this.CustomerTab = false;
    this.CustomerEditable = true;
    this.CustomerNonEditable = false;


    this.editPartAccountRE = true;
    // this.accountTab = false;
    this.AccountREEditable = true;
    this.AccountRENonEditable = false;

    this.allianceNonEditable = false;
    this.allianceEditable = true;
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }

  }


  hideEditPart() {
    this.accountOverviewDropdown.AccountCategory = this.oldAccountCategory;
    this.accountOverviewDropdown.AccountClassification = this.oldAccountClassification;

    // this.daService.iframePage = 'ACCOUNT_DETAILS';
    // let bodyDA = {
    //   page: 'ACCOUNT_DETAILS',
    //   accountGuid: this.SysGuidid
    // };
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
    this.AttributeComment = [];
    this.populateData(this.backUpData, 'old');
    // let index1 = this.accountDetails.findIndex(own => own.fkey == 'AccountClassification');
    // this.accountDetails[index1]['Id'] = this.accountDetails[index1]['old_id'];
    // let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
    // this.engageDetails[index]['Id'] = this.engageDetails[index]['old_id'];

    // this.assignAccountDetails(this.backUpData);
    // this.assignOwnershipDetails(this.backUpData);
    // this.assignCreditDetails(this.backUpData);
    // this.assignEngageDetails(this.backUpData);

    // this.populateData(this.backUpData);
    // this.accountDetails.forEach(val => {
    //   val.comment = '';
    // });
    // this.ownershipDetails.forEach(val => {
    //   val.comment = '';
    // });
    // this.engageDetails.forEach(val => {
    //   val.comment = '';
    // });
    // this.creditDetails.forEach(val => {
    //   val.comment = '';
    // })
    this.nonEditable = true;
    this.editPart = false;

    this.editPartCustomer = false;
    // this.CustomerTab = true;
    this.CustomerEditable = false;
    this.CustomerNonEditable = true;

    this.editPartAccountRE = false;
    // this.accountTab = true;
    this.AccountREEditable = false;
    this.AccountRENonEditable = true;

    this.allianceNonEditable = true;
    this.allianceEditable = false;
    if (this.showNewsContent) {
      var that = this;
      setTimeout(() => that.setNewsScroll(), 10);
    }
  }

  hideOnNoChange() {
    this.nonEditable = true;
    this.editPart = false;

    this.editPartCustomer = false;
    // this.CustomerTab = true;
    this.CustomerEditable = false;
    this.CustomerNonEditable = true;

    this.editPartAccountRE = false;
    // this.accountTab = true;
    this.AccountREEditable = false;
    this.AccountRENonEditable = true;

    this.allianceNonEditable = true;
    this.allianceEditable = false;
  }
  showCustomerEditable() {//chethana April 1
    this.editPartCustomer = true;
    this.CustomerTab = false;
    this.CustomerEditable = true;
    this.CustomerNonEditable = false;

  }
  cancelEdit_customerdetails() {
    this.AttributeComment = [];
    this.assignCustomDetails(this.backUpData);
    this.assignAddressDetails(this.backUpData);
    this.assignTrendsAnalysis(this.backUpData);
    // this.assignLandIT(this.backUpData);
    this.assignCustomerBusinessUnit(this.backUpData);

    this.editPartCustomer = false;
    this.CustomerTab = true;
    this.CustomerEditable = false;
    this.CustomerNonEditable = true;
  }//chethana April 1

  showAccountREEditable() {//chethana April 30th
    this.editPartAccountRE = true;
    this.accountTab = false;
    this.AccountREEditable = true;
    this.AccountRENonEditable = false;


  }
  cancelEdit_AccountRE() {
    this.AttributeComment = [];
    this.assignAccstructure(this.backUpData);
    this.assignSapDetails(this.backUpData);
    this.editPartAccountRE = false;
    this.accountTab = true;
    this.AccountREEditable = false;
    this.AccountRENonEditable = true;

  }//chethana April 30th
  showAllianceEditable() {
    this.allianceNonEditable = false;
    this.allianceEditable = true;
  }
  hideAllianceEditable() {
    this.AttributeComment = [];
    this.assignVendorDetails(this.backUpData);
    this.allianceNonEditable = true;
    this.allianceEditable = false;
  }


  myControl = new FormControl();
  options: string[] = ['Ajay Tendulkar', 'Rohit Shetty', 'Ashok Sharma', 'Anil Desai'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    // console.log("this is account details page")
    // this.daService.iframePage = 'ACCOUNT_DETAILS';
    // let bodyDA = {
    //   page: 'ACCOUNT_DETAILS',
    //   accountGuid: this.SysGuidid
    // };
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);

    // this.accountActivationTest();
    this.getAccountDetails();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    //  var data= this.route.paramMap
    // .pipe(map(() => window.history.state)).subscribe(x=>{
    //     if(x.tabIndex)
    //     {
    //       this.showCustomer();
    //     }        
    //   });

    // localStorages.setItem('navCountData', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 2, 'DecryptionDecrip'))
    let navCountData = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', (localStorage.getItem('navCountData') )?localStorage.getItem('navCountData') :'' , 'DecryptionDecrip');
    if (navCountData) {
      this.userdat.setSideBarData('2');
    } else {
      this.userdat.setSideBarData('1');
    }
    // this.userdat.setSideBarData('1');

    this.userdat.getSideBarData().subscribe((res: any) => {
      console.log("tabs 2517", res);
      if (res['tabIndex'] == 1) {
        this.showOverview();
      } else if (res['tabIndex'] == 2) {
        this.showAccount();
        localStorage.removeItem('navCountData');
      } else {
        this.showCustomer();
      }
      // if (res['tabIndex'] == 1) {
      //   this.showOverview();
      // }
      // else {
      //   this.showCustomer();
      // }
    }, (error) => {
      console.log("Error in getting managed log ", error);
    });
    // var data2=  this.router.events.pipe(
    //   filter(e => e instanceof NavigationStart),
    //   map(() => this.router.getCurrentNavigation().extras.state)
    // ).subscribe(x=>console.log("data2",x));
    //console.log(this.router.getCurrentNavigation().extras.state);
    /********************************************************/
    this.getEntity();
    this.getRelationShipType();
    this.getCurrency();
    this.getRevenueCate();
    this.getGrowthCate();
    this.getCoverageLevel();
    this.getLifeCycleStage();
    this.getAccountRelationShipSta();
    this.getProspectOwnerShip();

    // Account overview 
    this.GetAccountType();
    this.GetProposedAccountType();
    this.GetAccountClassification();
    this.GetProposedAccountClassification();
    // this.SearchAccount();
    // this.VerticalandSBU();
    // this.GetGeographyByName();
    // this.RegionByGeo();
    // this.SearchUser();
    this.GetAccountCategory();
    this.GetMarketRiskScore();
    this.getAllADMs('');
    this.accountListService.getCustomerDetail().subscribe(res => {
      // console.log("subject res of account name", JSON.stringify(res))
      this.showCustomer();
    })
    // for create sap customer 
    this.getSAPCodeDetails();
  }
  OpenRequestActivation() {
    // this.accountData.Owner.HuntingRatio = 12;
    this.isLoading = false;
    if (this.accountData.Owner && (this.accountData.Owner.HuntingRatio && this.accountData.Owner.HuntingRatio >= 8 && this.accountData.Owner.SysGuid != this.userId)) {
      const dialogRef = this.dialog.open(OpenOverview,
        {
          width: '380px',
          data: {
            'HuntingRatio': this.accountData.Owner && this.accountData.Owner.HuntingRatio ? this.accountData.Owner.HuntingRatio : 0,
            'Owner': this.accountData.Owner.FullName,
            'OverAllComments': '',
            'Requesttype': this.accountData.Type ? this.accountData.Type.Value : '',
            'Status': this.accountData.Status && this.accountData.Status.Value ? this.accountData.Status.Value : ''
          }
        });
    }
    else {

      const dialogRef = this.dialog.open(RequestActivated,
        {
          width: '380px',
          data: { 'SysGuid': this.SysGuidid, 'accountNumber': this.accountNumber, 'accountName': this.accountName }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'success' || result == 'failed')
          this.isLoading = true;
        else
          this.isLoading = false;
      });

      const dialogSubmitSubscription = dialogRef.componentInstance.submitClicked.subscribe(result => {
        console.log(result);
        this.isLoading = false;
        if (result == 'success') {
          this.store.dispatch(new reserveAccountClear({ ReserveListModel: {} }));
          this.router.navigate(['/accounts/accountmodification/modificationactiverequest']);
        }
        dialogSubmitSubscription.unsubscribe();
      });
    }
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);

    //   if (result == 'success') {
    //     this.isLoading = false;
    //     this.router.navigate(['/accounts/accountmodification/modificationactiverequest']);
    //   }
    //   else if (result == 'error' || result == 'close') {
    //     this.isLoading = false;
    //   }
    // });
  }

  standByChange = false;
  getdecodevalue(data) {
    if (data) {
      return this.accountListService.getSymbol(data);
    } else {
      return '';
    }

  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
  getFocus() {
    this.isLoading = true;
    // window.scrollTo(0,0);
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.isLoading = false;
      document.getElementById("account_name0").focus();
    }, 1000);
  }
  // getFocus()
  // {
  //   setTimeout(() => {
  //     document.getElementById("account_name0").focus();
  //   },100);
  //   // document.getElementById("ConversationNamee0").focus();
  // }
  getAccountDetails() {
    this.isLoading = true;

    this.master3Api.getMessage().subscribe((res) => {
      this.standByAccountOwner = res;
      console.log('standBy from popup', this.standByAccountOwner);

      let ind = this.ownershipDetails.findIndex(own => own.fkey == 'StandByAccountOwner');
      console.log('ownership details ', this.ownershipDetails[ind]);

      this.ownershipDetails[ind]['Id'] = this.standByAccountOwner.Standbyowner.standByOwner.SysGuid
      this.ownershipDetails[ind]['record'] = this.standByAccountOwner.Standbyowner.standByOwner.FullName;
      console.log('ownership details ', this.ownershipDetails[ind]);
      const accountGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
      if (this.ownershipDetails[ind]['record'] != this.ownershipDetails[ind]['old_val']) {
        let obj = {
          'SysGuid': accountGuid,
          'StandByAccountOwner': { 'SysGuid': this.ownershipDetails[ind]['Id'] }
        }
        this.standByChange = true;
        this.updatestandbyowner(obj);
        // this.normalSubmit(obj);
        this.accountListService.setSession('routeParamsTrasition', { 'route_from': 'acc_trasistion', 'Id': this.SysGuidid });
        // this.router.navigateByUrl('accounts/accounttransition/' + this.SysGuidid)
        this.router.navigate(["/accounts/accounttransition"]);
      }
    })

    let obj: any = { 'SysGuid': this.SysGuidid, "LoggedInUser": { 'SysGuid': this.userId } };

    this.accountListService.getAccountOverviewDetails(obj).subscribe(res => {
      // debugger;
      this.isLoading = false;
      console.log(res);
      let data: any = [];
      let Visibilty;
      if (!res.IsError && res.ResponseObject) {
        data = res.ResponseObject;
        // this.huntingRatio =  res.ResponseObject.Owner && res.ResponseObject.Owner.HuntingRatio ? res.ResponseObject.Owner.HuntingRatio : 0;
        // console.log("this is my data",data);
        this.accountData = res.ResponseObject;
        this.selectedOwner = this.getFilterOwnerData(this.accountData.AccountADM) || [];
        this.sendaccountdetailsdata();
        this.AccountAttribute = res.ResponseObject.AccountAttribute;
        this.ownerShipHistoryArray = res.ResponseObject.OwnerShipHistory;
        this.verticalName = res.ResponseObject.Vertical && res.ResponseObject.Vertical.Name ? res.ResponseObject.Vertical.Name : '';
        this.currencyName = res.ResponseObject.Currency.Value;
        this.HasSAPDetails = res.ResponseObject.HasSAPDetails;
        this.accountCategory = res.ResponseObject.AccountCategory && res.ResponseObject.AccountCategory.Id ? res.ResponseObject.AccountCategory.Id : '';
        this.DnbUltimateParent = res.ResponseObject.UltimateParentAccount && res.ResponseObject.UltimateParentAccount.DNBUltimateParent ? res.ResponseObject.UltimateParentAccount.DNBUltimateParent : '';
        this.DnbParent = res.ResponseObject.ParentAccount && res.ResponseObject.ParentAccount.DNBParent ? res.ResponseObject.ParentAccount.DNBParent : '';
        this.DnbNewsdata = res.ResponseObject.DNBNews && (res.ResponseObject.DNBNews.length > 0) ? res.ResponseObject.DNBNews : [];
        this.isPrivateEquityOwned = res.ResponseObject.IsPrivateEquityOwned ? res.ResponseObject.IsPrivateEquityOwned : false;
        //console.log("This is dnb news array",this.DnbNewsdata);
        Visibilty = JSON.stringify(res.ResponseObject.Visibilty);
      }
      this.adhList = this.accountData.DeliveryManagerADHVDHList ? this.accountData.DeliveryManagerADHVDHList : [];
      this.vdhlist = this.accountData.VDHList ? this.accountData.VDHList : [];
      if (this.adhList.length > 0) {
        let adhListname = [];
        this.adhList.map(ele => {
          adhListname.push(ele.FullName);
        });
        console.log(adhListname);
        this.adhString = adhListname.toString().split('"').toString();
      }
      else {
        this.adhString = '-';
      }

      if (this.vdhlist.length > 0) {
        let vdhlistname = [];
        this.vdhlist.map(ele => {
          vdhlistname.push(ele.FullName);
        });
        console.log(vdhlistname);
        this.vdhString = vdhlistname.toString().split('"').toString();
      }
      else {
        this.vdhString = '-';
      }
      if (this.selectedOwner.length > 0) {
        if (this.selectedOwner.length == 1) this.admString = this.selectedOwner[0]['Name'];
        else this.admString = this.selectedOwner[0]['Name'] + "(+" + (this.selectedOwner.length - 1) + ")";
      }
      else {
        this.admString = '-';
      }

      console.log('data.type', data.Type);
      if (this.userdat.validateKeyInObj(data, ['Type', 'Id'])) {
        this.accountType = data.Type.Id;
        localStorage.setItem('accNumRef', "");
        let accountypeLoc = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.accountType, 'DecryptionDecrip');
        localStorage.setItem('accNumRef', accountypeLoc);
        this.accountListService.sendAccountName(this.accountType);
        if (data.Type.Id == 3) {
          this.showAssignmentButton = true;
        }
        if (data.Type.Id == 1 && !data.IsRequestRaised) {
          this.isReserveAccount = true;
        }
        this.master3Api.GetAccountClassificationByType(this.accountType, "").subscribe(result => {
          console.log(result);
          console.log(result.ResponseObject);
          if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 1) {
            this.accountOverviewDropdown.AccountClassification = result.ResponseObject;
            this.oldAccountClassification = result.ResponseObject;
          }
          else if (!result.IsError && result.ResponseObject && result.ResponseObject.length == 1) {
            let index = this.accountDetails.findIndex(own => own.fkey == 'AccountClassification');
            this.accountDetails[index]['values'] = result.ResponseObject[0]['Value'];
            this.accountDetails[index]['Id'] = result.ResponseObject[0]['Id'];
            this.classificationid = result.ResponseObject[0]['Id'] || '';
            this.oldAccountClassification = result.ResponseObject;
          }
        }, error => {
          console.log(error);
        });
        this.classificationid = this.classificationid || '';
        this.master3Api.getCategoryByTypeandClassification(this.accountType, "", this.classificationid).subscribe(result => {
          console.log(result);
          if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 1) {
            this.accountOverviewDropdown.AccountCategory = result.ResponseObject;
            this.oldAccountCategory = result.ResponseObject;
          }
          else if (!result.IsError && result.ResponseObject && result.ResponseObject.length == 1) {
            let index = this.accountDetails.findIndex(own => own.fkey == 'AccountCategory');
            this.accountDetails[index]['values'] = result.ResponseObject[0]['Value'];
            this.accountDetails[index]['Id'] = result.ResponseObject[0]['Id'];
            this.oldAccountCategory = result.ResponseObject;
          }
        }, error => {
          console.log(error);
        });
        let visibiltyType = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', Visibilty, 'DecryptionDecrip');
        localStorage.setItem('Visibilty', visibiltyType);
      }
      // console.log(data.Owner.SysGuid, this.userId);

      if ((data.IsAccess == true && this.roleType != 2 && this.roleType != 3 && this.IsHelpDesk.toLowerCase() == 'false') || this.userdat.validateKeyInObj(data, ['Owner', 'SysGuid']) && data.Owner.SysGuid == this.userId) {
        this.isOwnerLoggedIn = true;
      }
      else {
        this.isOwnerLoggedIn = false;
      }
      //if (this.roleType == 2 || this.roleType == 3 || (this.userdat.validateKeyInObj(data, ['Owner', 'SysGuid']) && data.Owner.SysGuid == this.userId)) {
      //edited by divya on 21st aug  
      if (data.IsAccess == true || (this.userdat.validateKeyInObj(data, ['Owner', 'SysGuid']) && data.Owner.SysGuid == this.userId)) {
        this.isEditPermission = true;
        if (this.userdat.validateKeyInObj(data, ['Type', 'Id']) && (data.Type.Id == 3 || data.Type.Id == 12)) {
          this.showSapBtn = true;
        }
        else {
          this.showSapBtn = false;
        }
      }
      // if (this.userdat.validateKeyInObj(data, ['Type', 'Id']) && (data.Type.Id == 6 || data.Type.Id == 7 || data.Type.Id == 10)) {
      //   this.isEditPermission = false;
      // }

      if (this.isOwnerLoggedIn && this.roleType != 2 && this.roleType != 3) this.apprvalArr = this.ownerNonModifAttr;
      else if (this.roleType == 2) this.apprvalArr = this.SBUNonModifAttr;
      else if (this.roleType == 3) this.apprvalArr = this.CSONonModifAttr;

      this.accountName = data.Name ? this.getdecodevalue(data.Name) : '';
      this.accountNumber = data.Number || '';
      let accountName = this.EncrDecr.set(
        "EncryptionEncryptionEncryptionEn",
        this.accountName,
        "DecryptionDecrip"
      );
      this.accountListService.GetAccountDetailChatUserList({ "AccountGuid": this.SysGuidid }).subscribe(res => {
        console.log("DA Account ", res)
        if (!res.IsError) {
          let emailIds = []
          res.ResponseObject.forEach(data => {
            if (data.Email) {
              emailIds.push(data.Email)
            }
          })
          console.log('Account emails', JSON.stringify(emailIds))
          this.daPostBody(data, emailIds)
        } else {
          this.daPostBody(data, [])
        }
      }, error => {
        this.daPostBody(data, [])
      })
      localStorage.setItem('accountName', accountName);
      sessionStorage.setItem('accountName', accountName);
      this.hideEditPart();
      this.backUpData = JSON.parse(JSON.stringify(data));
      this.populateData(data, 'NEW');
    });
  }

  daPostBody(data, emailIds) {
    this.daService.iframePage = 'ACCOUNT_DETAILS';
    let bodyDA = {
      page: 'ACCOUNT_DETAILS',
      id: this.SysGuidid,
      accountNumber: data.Number || '',
      accountName: this.accountName ? this.accountName : '',
      changeInMarketScore: data.MarketRisk && data.MarketRisk.Value ? data.MarketRisk.Value : '',
      emailListArray: emailIds,
      roleType: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip'),
      IsHelpDesk: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip')
    };
    this.assistantGlobalService.setEmails(bodyDA);
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
  }
  openaccountsearch() {
    const dialogRef = this.dialog.open(SearchAccountPopupComponent,
      {
        width: '380px',
        data: { openDnB: false }
      }
    );
  }
  sendownershiphistory() {
    this.accountListService.getOwnershipHistory(this.ownerShipHistoryArray);
  }
  sendaccountdetailsdata() {
    this.accountListService.getaccountDetailsData(this.accountData);
  }
  updatestandbyowner(obj) {
    this.accountListService.updateStandbyOwnerData(obj).subscribe(res => {
      console.log(res);
      // commented due to bug 63792
      // if (res && res.Message) {
      //   this.snackBar.open(res.Message, '', {
      //     duration: 5000
      //   });
      // }
    })
  }
  getRelationShipType() {
    this.master3Api.GetAccountRelationShipType().subscribe(result => {
      console.log("accountType", result);
      if (!result.IsError && result.ResponseObject) {
        this.vendorDropdown.RelationShipType = result.ResponseObject;
      }
    });
  }
  // Account Overview 
  GetAccountType() {
    this.master3Api.GetAccountType().subscribe(result => {
      console.log("accountType", result);
      if (!result.IsError && result.ResponseObject) {
        if (this.IsHelpDesk != null && this.IsHelpDesk == 'true' && this.accountType == 1) {
          console.log("This is a reserve account");

          this.accountOverviewDropdown.Type = result.ResponseObject.filter(ele => {
            if (ele.Id == 1 || ele.Id == 12 || ele.Id == 3) {
              return ele;
            }
          });
          console.log(this.accountOverviewDropdown.Type);
        }
        else {
          this.accountOverviewDropdown.Type = result.ResponseObject;
          console.log('account type--->', this.accountOverviewDropdown.Type);
        }
      }
    });
  }
  GetProposedAccountType() {
    this.master3Api.GetProposedAccountType().subscribe(result => {
      console.log("proposedAccountType", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.ProposedAccountType = result.ResponseObject;
      }
    });
  }
  GetAccountClassification() {
    this.master3Api.GetAccountClassification().subscribe(result => {
      console.log("accountClassification", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.AccountClassification = result.ResponseObject;
      }
    });
  }
  GetProposedAccountClassification() {
    this.master3Api.GetProposedAccountClassification().subscribe(result => {
      console.log("proposedAccountClassification", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.ProposedAccountClassification = result.ResponseObject;
      }
    });
  }
  SearchAccount(key) {
    this.master3Api.SearchAccount(key).subscribe(result => {
      console.log("searchAccount", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.searchAccount = result.ResponseObject;
      }
    });
  }
  // SeachVerticalandSBU(keyword) {
  //   this.master3Api.SeachVerticalandSBU(keyword).subscribe(result => {
  //     console.log("verticalandSBU", result);
  //     if (!result.IsError && result.ResponseObject) {
  //       this.accountOverviewDropdown.verticalandSBU = result.ResponseObject;
  //     }
  //   });
  // }
  getSbuByName(event, searchKey) {
    console.log(event);

    // console.log(dataArray);
    // dataArray[i]['message'] = '';
    // dataArray[i].data = [];
    this.sub_and_vertical = [];
    this.accountOverviewDropdown.SBU = [];
    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let subVerticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SubVertical');
    if (searchKey == '' || event.type == 'keyup') {
      // this.clearFormValue(dataArray, formName, 'vertical');
      // this.clearFormValue(dataArray, formName, 'subvertical');
      // this.isActivityGroupSearchLoading = false;
      // this.ownershipDetails[subIndex]['Id'] = '';
      // this.ownershipDetails[verticalIndex]['Id'] = '';
      // this.ownershipDetails[subVerticalIndex]['Id'] = '';

      // this.ownershipDetails[verticalIndex]['record'] = '';
      // this.ownershipDetails[subVerticalIndex]['record'] = '';

      console.log(this.ownershipDetails);
    }
    this.isActivityGroupSearchLoading = true;
    let sbubyname = this.master3Api.getSBUByName(searchKey)
    sbubyname.subscribe((res: any) => {
      this.sub_and_vertical = [];
      this.accountOverviewDropdown.SBU = [];
      this.isActivityGroupSearchLoading = false;
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (!res.IsError && res.ResponseObject) {
        this.accountOverviewDropdown.SBU = res.ResponseObject;
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;

    })
  }


  // vertical  by passing sbuid
  getVerticalbySBUID(event, searchKey) {
    let vertical;
    this.sub_and_vertical = [];
    this.accountOverviewDropdown.Vertical = [];

    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let subVerticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SubVertical');

    console.log(this.ownershipDetails);
    console.log(subIndex, verticalIndex, subVerticalIndex);
    if (searchKey == '' || event.type == 'keyup') {
      // this.ownershipDetails[verticalIndex]['Id'] = '';
      // this.ownershipDetails[subVerticalIndex]['Id'] = '';

      // this.ownershipDetails[subVerticalIndex]['record'] = '';
    }


    if (this.ownershipDetails[subIndex]['Id'])
      // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
      vertical = this.master3Api.getVerticalbySBUID(this.ownershipDetails[subIndex]['Id'], searchKey)
    else
      vertical = this.master3Api.SearchVerticalAndSBU(searchKey)
    // let vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], searchKey)
    vertical.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.sub_and_vertical = [];
        this.accountOverviewDropdown.Vertical = [];
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.advSub_and_vertical = res.ResponseObject;
        // this.accountOverviewDropdown.advVertical = res.ResponseObject;
        if (this.ownershipDetails[subIndex]['Id']) {
          this.accountOverviewDropdown.Vertical = res.ResponseObject;
        }
        else {
          this.sub_and_vertical = res.ResponseObject;
          this.accountOverviewDropdown.Vertical = [];

          this.ownershipDetails[subIndex]['Id'] = '';
          // this.ownershipDetails[verticalIndex]['Id'] = '';

          this.ownershipDetails[subIndex]['record'] = '';
          // this.ownershipDetails[verticalIndex]['record'] = '';

          // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
          res.ResponseObject.map(data => {
            this.accountOverviewDropdown.Vertical.push(data.Vertical);
          });
        }
        if (res.ResponseObject.length == 0) {
          this.accountOverviewDropdown.Vertical['message'] = 'No record found';
        }
      }
      else {
        this.accountOverviewDropdown.Vertical['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
    })




    // let vertical;
    // // dataArray[i].data = [];
    // // this.sub_and_vertical = [];
    // // dataArray[i]['message'] = '';
    // if (!this.userdat.searchFieldValidator(searchKey)) {
    //   // this.clearFormValue(dataArray, formName, 'subvertical');
    //   this.isActivityGroupSearchLoading = false;
    //   // this.accountCreationObj['prospect']['vertical'] = '';
    //   // this.accountCreationObj['prospect']['subvertical'] = '';
    // }
    // else {
    //   this.isActivityGroupSearchLoading = true;
    //   if (this.userdat.searchFieldValidator(this.accountCreationObj['prospect']['sbu']))
    //     // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
    //     vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['prospect']['sbu'], searchKey)
    //   else
    //     vertical = this.master3Api.SearchVerticalAndSBU(searchKey)
    //   // let vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], searchKey)
    //   vertical.subscribe((res: any) => {
    //     this.isActivityGroupSearchLoading = false;
    //     if (!res.IsError && res.ResponseObject) {
    //       if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu'])) {
    //         dataArray[i].data = res.ResponseObject;
    //       }
    //       else {
    //         this.sub_and_vertical = res.ResponseObject;
    //         this.accountCreationObj['prospect']['sbu'] = '';
    //         this.clearFormValue(dataArray, formName, 'sbu');
    //         dataArray[i].data = [];
    //         // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
    //         res.ResponseObject.map(data => {
    //           dataArray[i].data.push(data.Vertical);
    //         });
    //       }
    //       if (res.ResponseObject.length == 0) {
    //         this.clearFormValue(dataArray, formName, 'vertical');
    //         dataArray[i]['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.clearFormValue(dataArray, formName, 'vertical');
    //       dataArray[i]['message'] = 'No record found';
    //     }
    //   }, error => {
    //     this.isActivityGroupSearchLoading = false;
    //   })
    // }
  }

  getSubVerticalByVertical(event, searchKey) {
    let subvertical;
    this.sub_and_vertical = [];
    this.accountOverviewDropdown.SubVertical = [];

    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let subVerticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SubVertical');

    if (searchKey == '' || event.type == 'keyup') {
      // this.ownershipDetails[subVerticalIndex]['Id'] = '';
      // this.ownershipDetails[subVerticalIndex]['record'] = '';
    }

    if (this.ownershipDetails[verticalIndex]['Id'])
      subvertical = this.master3Api.getSubVerticalByVertical(this.ownershipDetails[verticalIndex]['Id'], searchKey);
    else
      subvertical = this.master3Api.SearchAllBySubVertical(searchKey);
    subvertical.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.sub_and_vertical = [];
        this.accountOverviewDropdown.SubVertical = [];
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.advSub_and_vertical = res.ResponseObject;
        if (this.ownershipDetails[verticalIndex]['Id']) {

          this.accountOverviewDropdown.SubVertical = res.ResponseObject;
        }
        else {
          this.sub_and_vertical = res.ResponseObject;

          this.ownershipDetails[subIndex]['Id'] = '';
          this.ownershipDetails[verticalIndex]['Id'] = '';

          this.ownershipDetails[subIndex]['record'] = '';
          this.ownershipDetails[verticalIndex]['record'] = '';

          res.ResponseObject.map(data => {
            this.accountOverviewDropdown.SubVertical.push(data.SubVertical);
          });
        }
        if (res.ResponseObject.length == 0) {
          this.accountOverviewDropdown.SubVertical['message'] = 'No record found';
        }
      }
      else {
        this.accountOverviewDropdown.SubVertical['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
    })


    // dataArray[i]['message'] = '';
    // this.sub_and_vertical = [];
    // dataArray[i].data = [];

    // let subvertical;
    // if (!this.accservive.searchFieldValidator(searchKey)) {
    //   this.isActivityGroupSearchLoading = false;
    //   this.accountCreationObj['prospect']['subvertical'] = '';
    //   this.clearFormValue(dataArray, formName, 'subvertical');
    // }
    // else {

    //   // if (searchKey !== '') {
    //   this.isActivityGroupSearchLoading = true;
    //   if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['vertical']))
    //     subvertical = this.master3Api.getSubVerticalByVertical(this.accountCreationObj['prospect']['vertical'], searchKey);
    //   else
    //     subvertical = this.master3Api.SearchAllBySubVertical(searchKey);
    //   subvertical.subscribe((res: any) => {
    //     this.isActivityGroupSearchLoading = false;
    //     if (!res.IsError && res.ResponseObject) {
    //       if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['vertical'])) {
    //         dataArray[i].data = res.ResponseObject;
    //       }
    //       else {
    //         this.sub_and_vertical = res.ResponseObject;
    //         this.accountCreationObj['prospect']['sbu'] = '';
    //         this.accountCreationObj['prospect']['vertical'] = '';

    //         this.clearFormValue(dataArray, formName, 'sbu');
    //         this.clearFormValue(dataArray, formName, 'vertical');
    //         res.ResponseObject.map(data => {
    //           dataArray[i].data.push(data.SubVertical);
    //         });
    //       }
    //       if (res.ResponseObject.length == 0) {
    //         this.clearFormValue(dataArray, formName, 'subvertical');
    //         dataArray[i]['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.clearFormValue(dataArray, formName, 'subvertical');
    //       dataArray[i]['message'] = 'No record found';
    //     }
    //   }, error => {
    //     this.isActivityGroupSearchLoading = false;
    //   })
    // }
  }

  SearchAllianceAccounts(keyword) {
    this.master3Api.SearchAllianceAccounts(keyword).subscribe(result => {
      console.log("verticalandSBU", result);
      if (!result.IsError && result.ResponseObject) {
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.vendorDropdown.AdvisoryRAnalyst = result.ResponseObject;
      }
    });
  }
  // GetGeographyByName(keyword) {
  //   this.master3Api.GetGeographyByName(keyword).subscribe(result => {
  //     console.log("geographyByName", result);
  //     if (!result.IsError && result.ResponseObject) {
  //       this.accountOverviewDropdown.geographyByName = result.ResponseObject;
  //     }
  //   });
  // }
  keyWordSearch(event, keyword, fkey, eventData?) {
    console.log(fkey);
    setTimeout(() => {
      switch (fkey) {
        case 'Geo':
          this.getGeo(event, eventData);
          return;
        case 'Region':
          this.RegionByGeo(event, eventData, fkey);
          return;
        case 'CountryReference':
          this.CountryByRegion(event, eventData, fkey);
          return;
        case 'CountrySubDivisionReference':
          this.StateByCountry(event, eventData, fkey);
          return;
        case 'CityRegionReference':
          this.CityByState(event, eventData, fkey);
          return;
        case 'StandByAccountOwner':
          this.SearchUser(eventData);
          return;
        case 'Owner':
          this.AccountOwnerSearch(eventData);
          return;
        case 'SBU':
          this.getSbuByName(event, eventData);
          return;
        case 'Vertical':
          this.getVerticalbySBUID(event, eventData);
          return;
        case 'SubVertical':
          this.getSubVerticalByVertical(event, eventData);
          return;
        case 'Currency':
          this.getAllCurrency(eventData);
          return;
        case 'ParentAccount':
          this.getParentAccount(eventData);
          return;
        case 'UltimateParentAccount':
          this.getUltimateParentAccount(eventData);
          return;
        case 'PrivateEquityOwned':
          this.getPrivateEquity(eventData);
          return;
      }
    }, 100);


    // if (fkey == 'Region') {
    //   this.RegionByGeo(keyword, fkey);
    // }
    // else if (fkey == 'StandByAccountOwner') {
    //   this.SearchUser(keyword);
    // }
    // else if (fkey == 'Owner') {
    //   this.AccountOwnerSearch(keyword);
    // }
    // else if (fkey == 'Geo') {
    //   this.getGeo(keyword);
    // }
  }
  getCurencySymbol(data) {
    let cur = unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    // this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
    return cur;
  }
  getTenRecords(res) {
    // debugger;
    const resdata = res.slice(0, 9);
    return resdata;
  }

  getAllCurrency(keyword) {
    this.customerDetailsDropdown.Currency = [];
    this.master3Api.getcurrencyaccount(keyword).subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        // this.createDropdown.Currency = result.ResponseObject;
        if (!result.IsError && result.ResponseObject) {
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
          this.advLookupCurrency = result.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) });
          if (keyword !== '') {
            this.customerDetailsDropdown.Currency = result.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) });
          } else {
            this.customerDetailsDropdown.Currency = this.getTenRecords(result.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) }));
          }

          // this.customerDetailsDropdown.Currency = 

          // this.accountOverviewDropdown.Currency = result.ResponseObject;
          // this.accountOverviewDropdown.Currency.map(elt => {
          //   elt['Name'] = this.getCurencySymbol(elt['Desc']);
          // })
        }
      }
    });
  }

  getParentAccount(keyword) {
    this.accountOverviewDropdown.ParentAccount = [];
    this.master3Api.getparentaccount(keyword).subscribe(result => {
      this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        // this.accountOverviewDropdown.ParentAccount = result.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) });;
        this.accountOverviewDropdown.ParentAccount = result.ResponseObject;

      }
      console.log(this.accountOverviewDropdown.ParentAccount);
    })
  }
  getUltimateParentAccount(keyword) {
    this.accountOverviewDropdown.UltimateParentAccount = [];
    this.master3Api.getparentaccount(keyword).subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        // this.accountOverviewDropdown.ParentAccount = result.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) });;
        this.accountOverviewDropdown.UltimateParentAccount = result.ResponseObject;

      }
      console.log(this.accountOverviewDropdown.UltimateParentAccount);
    })
  }
  getultimteparentbyid(id) {
    console.log('came here too');
    console.log(id);
    let upInd = this.accountDetails.findIndex(ow => ow.fkey == 'UltimateParentAccount');
    this.master3Api.getUltimateParentByParent(id).subscribe((res: any) => {
      console.log("response of ultimate parent by parent", res.ResponseObject);
      if (!res.IsError) {
        // this.prospectAccForm.controls['ultimateparent'].setValue(this.getSymbol(res.ResponseObject[0].UltimateParentAccount.Name))
        this.accountDetails[upInd].Id = res.ResponseObject[0].UltimateParentAccount.SysGuid;
        this.accountDetails[upInd].values = res.ResponseObject[0].UltimateParentAccount.Name;
      }
    });
  }

  clearHirarchyData(arr, keys, lable) {
    console.log(arr, keys, lable);

    keys.forEach(key => {
      let ind = arr.findIndex(ow => ow.fkey == key);
      arr[ind].Id = '';
      arr[ind][lable] = '';
    });
    console.log(arr);

  }
  RegionByGeo(event, keyword, fkey) {
    this.location_temp = [];
    this.accountOverviewDropdown.Region = [];
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record');
      }
      let regionindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Geo');

      let postObj = {
        key: 'region', keyword: keyword,
        parentsIds: {
          'geo': regionindex != -1 && this.ownershipDetails[regionindex].Id ? this.ownershipDetails[regionindex].Id : ''
        }
      };

      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        console.log("regionByGeo", result);
        if (!result.IsError && result.ResponseObject) {
          this.location_temp = [];
          this.accountOverviewDropdown.Region = [];
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
          this.advlocation_temp = result.ResponseObject;
          if (regionindex != -1 && this.ownershipDetails[regionindex].Id) {
            /* Assigning data to Region object, search by geo id*/
            this.accountOverviewDropdown.Region = result.ResponseObject;
          }
          else {
            /* Assigning data to Geo on Region search by name*/
            this.location_temp = result.ResponseObject;
            result.ResponseObject.map(data => {
              this.accountOverviewDropdown.Region.push(data.Region);
            });
          }
        }
      });
    }
  }
  getGeo(event, keyword) {
    this.accountOverviewDropdown.Region = [];
    this.accountOverviewDropdown.Geo = [];
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];

    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record');
      }

      let postObj = {
        key: 'geo', keyword: keyword,
        parentsIds: []
      };

      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        console.log("regionByGeo", result);
        this.accountOverviewDropdown.Region = [];
        this.accountOverviewDropdown.Geo = [];
        this.accountOverviewDropdown.CountryReference = [];
        this.accountOverviewDropdown.CountrySubDivisionReference = [];
        if (!result.IsError && result.ResponseObject) {
          this.accountOverviewDropdown.Geo = result.ResponseObject;
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        }
      });
    }
  }

  CountryByRegion(event, keyword, fkey) {
    let regionindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Region');
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CityRegionReference = [];

    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record');
      }

      let postObj = {
        key: 'country', keyword: keyword,
        parentsIds: {
          'region': regionindex != -1 && this.ownershipDetails[regionindex].Id ? this.ownershipDetails[regionindex].Id : ''
        }
      };

      let orginalArray = this.accountListService.getHierarchicalData(postObj);

      orginalArray.subscribe(result => {
        console.log("regionByGeo", result);
        this.accountOverviewDropdown.CountryReference = [];
        this.accountOverviewDropdown.CountrySubDivisionReference = [];
        this.accountOverviewDropdown.CityRegionReference = [];
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.advlocation_temp = result.ResponseObject;
        if (!result.IsError && result.ResponseObject) {
          if (regionindex != -1 && this.ownershipDetails[regionindex].Id) {
            this.accountOverviewDropdown.CountryReference = result.ResponseObject;

          }
          else {
            this.location_temp = result.ResponseObject;
            result.ResponseObject.map(data => {
              this.accountOverviewDropdown.CountryReference.push(data.Country);
            });
          }
        }
      });
    }
  }
  StateByCountry(event, keyword, fkey) {
    console.log(keyword, event);
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CityRegionReference = [];
    let countryindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');

    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {
    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CountrySubDivisionReference', 'CityRegionReference'], 'record');
      }

      let postObj = {
        key: 'state', keyword: keyword,
        parentsIds: {
          'country': countryindex != -1 && this.ownershipDetails[countryindex].Id ? this.ownershipDetails[countryindex].Id : ''
        }
      };

      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        console.log("regionByGeo", result);
        this.accountOverviewDropdown.CountrySubDivisionReference = [];
        this.accountOverviewDropdown.CityRegionReference = [];
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.advlocation_temp = result.ResponseObject;
        if (!result.IsError && result.ResponseObject) {
          // let regionindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
          if (countryindex != -1 && this.ownershipDetails[countryindex].Id) {
            this.accountOverviewDropdown.CountrySubDivisionReference = result.ResponseObject;
          }
          else {
            this.location_temp = result.ResponseObject;
            result.ResponseObject.map(data => {
              this.accountOverviewDropdown.CountrySubDivisionReference.push(data.State);
            });
          }
        }
      });
    }
  }
  CityByState(event, keyword, fkey) {
    this.accountOverviewDropdown.CityRegionReference = [];
    let countryindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
    let CountrySubDivisionReferenceIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountrySubDivisionReference');
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CityRegionReference'], 'record');
      }
      let postObj = {
        key: 'city', keyword: keyword,
        parentsIds: {
          'state': CountrySubDivisionReferenceIndex != -1 && this.ownershipDetails[CountrySubDivisionReferenceIndex].Id ? this.ownershipDetails[CountrySubDivisionReferenceIndex].Id : '',
          'country': countryindex != -1 && this.ownershipDetails[countryindex].Id ? this.ownershipDetails[countryindex].Id : ''
        }
      };
      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        console.log("regionByGeo", result);
        this.accountOverviewDropdown.CityRegionReference = [];
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.advlocation_temp = result.ResponseObject;
        if (!result.IsError && result.ResponseObject) {
          if (CountrySubDivisionReferenceIndex != -1 && this.ownershipDetails[CountrySubDivisionReferenceIndex].Id) {
            this.accountOverviewDropdown.CityRegionReference = result.ResponseObject;
          }
          else {
            this.location_temp = result.ResponseObject;
            result.ResponseObject.map(data => {
              this.accountOverviewDropdown.CityRegionReference.push(data.City);
            });
          }
        }
      });
    }
  }

  SearchUser(keyword) {
    this.accountOverviewDropdown.StandByAccountOwner = [];
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      this.master3Api.AccountOwnerSearch(keyword).subscribe(result => {
        console.log("searchUser", result);
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        if (!result.IsError && result.ResponseObject) {
          if (result.ResponseObject.length != 0) {
            // this.accountOverviewDropdown['StandByAccountOwner']['message'] = 'No record found';
            // }else
            // {
            this.accountOverviewDropdown.StandByAccountOwner = result.ResponseObject;
            // }

          }
        }
      });
      // }
    }

  }
  AccountOwnerSearch(keyword) {
    this.accountOverviewDropdown.Owner = [];
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      this.master3Api.AccountOwnerSearch(keyword).subscribe(result => {
        if (!result.IsError && result.ResponseObject) {
          if (result.ResponseObject.length != 0) {

            this.accountOverviewDropdown.Owner = result.ResponseObject;
            this.lookupdata.TotalRecordCount = result.TotalRecordCount;
            this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
            let json;
            result.ResponseObject.forEach((data) => {
              json = { FullName: data['FullName'], Designation: data['Designation'], Email: data['Email'] ? data['Email'] : 'NA', SysGuid: data['SysGuid'], Id: data['SysGuid'] }
              this.sendAccountOwnerToAdvance.push(json);
            });
          }
        }
      });
    }
  }


  GetAccountCategory() {
    this.master3Api.GetAccountCategory().subscribe(result => {
      console.log("accountCategory", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.AccountCategory = result.ResponseObject;
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      }
    });
  }
  getSymbol(data) {
    // console.log(data)
    if (data) {
      return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }
    else {
      return '';
    }
  }

  GetMarketRiskScore() {
    this.master3Api.GetMarketRisk().subscribe(result => {
      console.log("accountCategory", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountOverviewDropdown.MarketRisk = result.ResponseObject;
      }
    }, error => {
      console.log(error);
    });
  }

  getCurrency() {
    this.master3Api.getCurrency().subscribe(result => {
      console.log("accountCategory", result);
      if (!result.IsError && result.ResponseObject) {
        this.customerDetailsDropdown.Currency = result.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
      }
    });
  }
  //Account Details From Here(Tab- Account Re - AllMethod)

  getRevenueCate() {
    this.master3Api.GetRevenueCategory().subscribe(result => {
      console.log("RevenueCategor", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.RevenueCategory = result.ResponseObject;
      }
    });
  }

  getGrowthCate() {
    this.master3Api.GetGrowthCategory().subscribe(result => {
      console.log("GrowthCategory", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.GrowthCategory = result.ResponseObject;
      }
    });
  }

  getEntity() {
    this.master3Api.getEntityType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.EntityType = result.ResponseObject;
      }
    })
  }
  getCoverageLevel() {
    this.master3Api.GetCoverageLevel().subscribe(result => {
      console.log("CoverageLevel", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.CoverageLevel = result.ResponseObject;

      }
    });
  }


  getLifeCycleStage() {
    this.master3Api.GetAccountLifeCycleStage().subscribe(result => {
      console.log("AccountLifeCycleStage", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.LifeCycleStage = result.ResponseObject;
      }
    });
  }

  getAccountRelationShipSta() {
    this.master3Api.GetAccountRelationShipStatus().subscribe(result => {
      console.log("AccountRelationShipStatus", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.RelationShipStatus = result.ResponseObject;
      }
    });
  }
  getProspectOwnerShip() {
    this.master3Api.getProspectOwnerShipType().subscribe(result => {
      console.log("ProspectOwnerShipType", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.OwnershipType = result.ResponseObject;
      }
    });
  }

  getAllADMs(searchtext) {
    this.wiproContact2 = [];
    console.log("adms searching..")
    let obj = {
      "SearchText": searchtext ? searchtext : '',
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    };
    this.accountListService.getADMs(obj).subscribe(res => {
      console.log(res);
      if (!res.IsError && res.ResponseObject) {
        if (this.selectedOwner && this.selectedOwner.length > 0 && res.ResponseObject.length > 0) {
          const accountName = this.remove_duplicates_Accounts(this.selectedOwner, res.ResponseObject);
          if (this.selectedOwner && this.selectedOwner.length > 0) {
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, accountName));
            if (!this.wiproContact2) {
              this.wiproContact2 = [];
            }
          }

          if (this.selectedOwner && this.selectedOwner.length === 0)
            this.wiproContact2 = this.getFilterOwnerData(accountName);
        } else {
          if (this.selectedOwner && this.selectedOwner.length > 0) {
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, res.ResponseObject));
            if (!this.wiproContact2) {
              this.wiproContact2 = [];
            }
          } else {
            this.wiproContact2 = this.getFilterOwnerData(res.ResponseObject);
            if (!this.wiproContact2) {
              this.wiproContact2 = [];
            }
          }
        }
      }
    });
  }

  getPrivateEquity(value) {
    let reqbody = {
      "SearchText": value,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    let privateEquity = this.master3Api.privateequaitity(reqbody)
    privateEquity.subscribe((result: any) => {
      console.log("privatedata", result)
      this.accountOverviewDropdown['PrivateEquityOwned'] = result.ResponseObject;
      // this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      // this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      // console.log("privatedata", this.ownerdata)
    })
  }

  enablePrivateEquityAccount(event) {
    let ind = this.accountDetails.findIndex((obj => obj.fkey == 'PrivateEquityOwned'));
    console.log(event);
    if (event != null && event != undefined && event.value == false) {
      this.accountDetails[ind].isDisabled = true;
      this.accountDetails[ind].values = '';
      this.accountDetails[ind].Id = '';
      this.accountDetails[ind].control = 'disabledinput';
      this.accountDetails[ind].enableMandatory = false;
      this.isPrivateEquityOwned = false;
    }
    else if (event != null && event != undefined && event.value == true) {
      this.accountDetails[ind].isDisabled = false;
      this.accountDetails[ind].control = 'searchinput';
      this.accountDetails[ind].enableMandatory = true;
      this.isPrivateEquityOwned = true;
    }
    else { }
  }
  selectStructure(stages, item) {
    item.vals = stages.Value;
    item.Id = stages.Id;
  }
  removeSeletecedValue(formName, arr, key) {
    // arr.Id = '';
    // arr[key] = '';
    console.log(arr);

    let clearArr = [];
    switch (arr.fkey) {
      case 'Geo':
        clearArr = ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        this.disableInput(false);
        return;
      case 'Region':
        clearArr = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        this.disableInput(false);
        return;
      case 'CountryReference':
        clearArr = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        this.disableInput(false);
        return;
      case 'CountrySubDivisionReference':
        clearArr = ['CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'CityRegionReference':
        clearArr = ['CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'SBU':
        clearArr = ['SBU', 'Vertical', 'SubVertical'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'Vertical':
        clearArr = ['Vertical', 'SubVertical'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'SubVertical':
        clearArr = ['SubVertical'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'Currency':
        clearArr = ['Currency'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'ParentAccount':
        clearArr = ['ParentAccount', 'UltimateParentAccount'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'UltimateParentAccount':
        clearArr = ['UltimateParentAccount'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'PrivateEquityOwned':
        let ind = this.accountDetails.findIndex(ow => ow.fkey == 'PrivateEquityOwned');
        clearArr = ['PrivateEquityOwned'];
        this.clearHirarchyData(formName, clearArr, key);
        this.accountDetails[ind].values = '';
        this.accountDetails[ind].enableMandatory = true;
        return;
    }
  }
  disableInput(disable) {
    this.ownershipDetails.map((ele) => {
      // console.log(ele.fkey);
      // let data = getComparisionValue();
      // console.log('ele'+ele)
      if (disable) {
        if (ele.fkey === 'CountrySubDivisionReference' || ele.fkey === 'CityRegionReference') {
          ele.disablefield = true
        }
      } else {
        if (ele.fkey === 'CountrySubDivisionReference' || ele.fkey === 'CityRegionReference') {
          ele.disablefield = false
        }
      }


    });
  }
  removeSeletecedValueOnAppend(formName, arr, key) {
    let clearArr = [];
    switch (arr.fkey) {

      case 'Geo':
        clearArr = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'Region':
        clearArr = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'CountryReference':
        clearArr = ['CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'CountrySubDivisionReference':
        clearArr = ['CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      // case 'CityRegionReference':
      //   clearArr = ['CityRegionReference'];
      //   this.clearHirarchyData(formName, clearArr, key);
      //   return;
      case 'SBU':
        clearArr = ['Vertical', 'SubVertical'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
      case 'Vertical':
        clearArr = ['SubVertical'];
        this.clearHirarchyData(formName, clearArr, key);
        return;
    }

  }
  getPosts(arr, option, key, dk, ind) {
    arr.Id = option.SysGuid || option.Id;
    arr[key] = this.getdecodevalue(option[dk]);
    console.log(arr, option);
    console.log(this.sub_and_vertical, ind, key, this.location_temp);
    if (key === 'record') {
      this.removeSeletecedValueOnAppend(this.ownershipDetails, arr, 'record');
    }


    if (this.sub_and_vertical && this.sub_and_vertical.length > 0) {

      let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
      let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');

      switch (arr.fkey) {

        case 'Vertical':
          {


            this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
            this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';
            this.ownershipDetails[subIndex]['prevValue'] = this.ownershipDetails[subIndex]['record'];
            return;
          }
        case 'SubVertical':
          {
            this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
            this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';
            this.ownershipDetails[subIndex]['prevValue'] = this.ownershipDetails[subIndex]['record'];
            this.ownershipDetails[verticalIndex]['Id'] = this.sub_and_vertical[ind]['Vertical']['Id'] || this.sub_and_vertical[ind]['Vertical']['SysGuid'] || '';
            this.ownershipDetails[verticalIndex]['record'] = this.sub_and_vertical[ind]['Vertical']['FullName'] || this.sub_and_vertical[ind]['Vertical']['Name'] || '';
            this.ownershipDetails[verticalIndex]['prevValue'] = this.ownershipDetails[verticalIndex]['record'];
            return;
          }
      }
    }
    if (this.location_temp && this.location_temp.length > 0) {


      let geoIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Geo');
      let regionIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Region');
      let countryIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
      let stateIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountrySubDivisionReference');

      console.log(arr.fkey, geoIndex);
      switch (arr.fkey) {
        case 'Region':
          {

            this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
            this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
            return;
          }
        case 'CountryReference':

          this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
          this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
          this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
          this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
          this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';
          this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
          if (this.location_temp[ind]['Country']['isExists'] === false) {
            this.disableInput(true);
          } else {
            this.disableInput(false);
          }


          return;
        case 'CountrySubDivisionReference':

          this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
          this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
          this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
          this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
          this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';
          this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
          this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
          this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Country']['Name'] || this.location_temp[ind]['Country']['FullName'] || '';
          this.ownershipDetails[countryIndex]['prevValue'] = this.ownershipDetails[countryIndex][key];

          return;
        case 'CityRegionReference':

          this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
          this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
          this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
          this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
          this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';
          this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
          this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
          this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Country']['Name'] || this.location_temp[ind]['Country']['FullName'] || '';
          this.ownershipDetails[countryIndex]['prevValue'] = this.ownershipDetails[countryIndex][key];
          this.ownershipDetails[stateIndex].Id = this.location_temp[ind]['State']['SysGuid'] || this.location_temp[ind]['State']['Id'] || '';
          this.ownershipDetails[stateIndex][key] = this.location_temp[ind]['State']['Name'] || this.location_temp[ind]['State']['FullName'] || '';
          this.ownershipDetails[stateIndex]['prevValue'] = this.ownershipDetails[stateIndex][key];

          return;
      }
    }
    if (arr['fkey'] == 'ParentAccount') {
      console.log('came here', arr);
      let parInd = this.accountDetails.findIndex(ow => ow.fkey == 'ParentAccount');
      this.accountDetails[parInd].Id = arr['Id'];
      this.accountDetails[parInd].values = this.getSymbol(arr['values']);
      this.getultimteparentbyid(this.accountDetails[parInd].Id);
    }
    if (arr['fkey'] == 'PrivateEquityOwned') {
      console.log('came here', arr);
      let parInd = this.accountDetails.findIndex(ow => ow.fkey == 'PrivateEquityOwned');
      this.accountDetails[parInd].Id = arr['Id'];
      this.accountDetails[parInd].values = this.getSymbol(arr['values']);
    }
  }



  //Account Details End from here(tab - AccountRe)
  /********************************************************/
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  editable = false;
  editable1 = false;
  editable2 = false;
  expand(i) {
    if (i == 0) {

      this.editable = false;
    }
    else if (i == 1) {
      this.editable1 = false;
    }
    else if (i == 2) {
      this.editable2 = false;
    }
  }




  /********************************************************/
  table_data: any = [];
  selectedAll: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  selectAll() {

    for (var i = 0; i < this.table_data.length; i++) {
      this.table_data[i].selected = this.selectedAll;
    }
    if (this.selectedAll == true) {
      // console.log(this.table_data.length);
      this.checkboxcounter = this.table_data.length;
      //this.showDemandSelect = true;
    }
    if (this.selectedAll == false) {
      this.checkboxcounter = 0;
      //this.showDemandSelect = false;
    }
  }

  checkIfAllSelected(index) {
    // console.log('selectAllhi');


    if (this.table_data[index].selected == true) {

      this.checkboxcounter++;
      // console.log(this.checkboxcounter);


    }
    if (this.table_data[index].selected == false) {

      this.checkboxcounter--;
      // console.log("add-", this.checkboxcounter);


    }
    if (this.checkboxcounter == 0) {
      //this.showDemandSelect = false;

    }
    else if (this.checkboxcounter > 0) {
      //this.showDemandSelect = true;

    }

    this.selectedAll = this.table_data.every(function (item: any) {
      return item.selected == true;
    })
  }


  selectedAllComp: any;
  checkboxcounterComp: number = 0; selectedCountComp: any = [];
  selectAllComp() {

    for (var i = 0; i < this.alliance_table.length; i++) {
      this.alliance_table[i].selected = this.selectedAllComp;
    }
    if (this.selectedAllComp == true) {
      // console.log(this.alliance_table.length);
      this.checkboxcounterComp = this.alliance_table.length;
      //this.showDemandSelect = true;
    }
    if (this.selectedAllComp == false) {
      this.checkboxcounterComp = 0;
      //this.showDemandSelect = false;
    }
  }

  checkIfAllSelectedComp(index) {
    //console.log('selectAllhi');


    if (this.alliance_table[index].selected == true) {
      this.checkboxcounterComp++;
      // console.log(this.checkboxcounterComp);


    }
    if (this.alliance_table[index].selected == false) {

      this.checkboxcounterComp--;
      // console.log("add-", this.checkboxcounterComp);


    }
    if (this.checkboxcounterComp == 0) {
      //this.showDemandSelect = false;

    }
    else if (this.checkboxcounterComp > 0) {
      //this.showDemandSelect = true;

    }

    this.selectedAllComp = this.alliance_table.every(function (item: any) {
      return item.selected == true;
    })
  }

  reverse: boolean = false;
  key: string;

  namesort(key) {
    this.key = key;
    if (key == 'name') {

      this.reverse = !this.reverse;
    }

  }
  activateCBU(data, i) {
    console.log(data, i);
    console.log(this.CustomerBusinessUnit);
    this.CustomerBusinessUnit.record[i].LinkActionType = 2;
    this.CustomerBusinessUnit.record[i].IsActivate = false;
  }

  openDeactivatePopup(id, IsOpportunitiesTagged, cbudeactivation, sapCodeExists) {

    console.log('in open func')
    const dialogRef1 = this.dialog.open(DeactiveReferencePopup,
      {
        width: '380px',
        data: {
          'cbudeactivation': cbudeactivation,
          'SysGuid': id || '',
          'IsOpportunitiesTagged': IsOpportunitiesTagged,
          'sapCodeExists': sapCodeExists,
        }
      });
    if (cbudeactivation) {
      dialogRef1.afterClosed().subscribe(result => {
        // data.IsActivate = !data.IsActivate
        console.log(result);
      })
    }
    else {
      dialogRef1.afterClosed().subscribe(result => {
        if (result == "success") {
          this.getAccountDetails();
        }
      })
    }

  }

  editAssignementRef(assignId) {
    this.accountListService.setSession('routeParamsRef', { 'route_from': 'acc_ref', 'Id': assignId, 'isEditPermission': this.isEditPermission });
    // this.router.navigate(["/accounts/editreference", assignId]);
    this.router.navigate(["/accounts/editreference"]);
    // this.router.navigate(['/accounts/accountdetails']);
  }

  // add secondary owner popup start 
  AddSecondaryOwnerPopup(data) {
    const dialogRef = this.dialog.open(AddSecondaryOwnersComponent,
      {
        width: '400px',
        data: { accountName: this.accountName, assignData: data, accountOwner: this.accountOwner }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "success")
        this.getAccountDetails();
    })

  }
  // retag-opportunity

  openRetagOpportunityPopup() {
    const dialogRef = this.dialog.open(RetagOpportunityComponent,
      {
        width: '450px'
      });
  }

  openMultipleReferencePopup(key, data) {
    const dialogRef = this.dialog.open(MultipleReferenceViewComponent,
      {
        width: '400px',
        data: {
          data: data,
          key: key
        }
      });
  }
  getOwnershipHistory() {
    console.log("details of ownership", this.ownerShipHistoryArray);
  }

  toggleTooltip(name, state) {
    if (name == 'Government account' && state == 'enter') {
      this.showTooltip = true;
    }
    else if (name == 'Government account' && state == 'leave') {
      this.showTooltip = false;
    }
    else {
      this.showTooltip = false;
    }
  }

  showNewsButton() {
    this.showNews = true;
    this.showNewsContent = false;
  }
  newsScroll;
  NewsContent() {
    this.showNews = false;
    this.showNewsContent = true;
    this.newsScroll = document.getElementById('news').offsetHeight - 150;
  }

  navigateBack() {
    switch (this.userdat.selectedTabValue) {
      case 'My active accounts':
        this.router.navigateByUrl('/accounts/accountlist/allactiveaccounts');
        break;

      case 'All accounts':
        this.router.navigateByUrl('/accounts/accountlist/farming');
        break;

      case 'All advisor accounts':
        this.router.navigateByUrl('/accounts/accountlist/AnalystAdvisor');
        break;

      case 'All alliance accounts':
        this.router.navigateByUrl('/accounts/accountlist/alliance');
        break;

      case 'All reserve accounts':
        this.router.navigateByUrl('/accounts/accountlist/reserve');
        break;

      case 'NA':
        this.router.navigateByUrl('/accounts/accountlist/farming');
        break;

      default:
        this.router.navigateByUrl('/accounts/accountlist/farming');

    }
  }
  setNewsScroll() {
    console.log("taj mahal" + document.getElementById('news').offsetHeight);
    this.newsScroll = document.getElementById('news').offsetHeight - 180;
    console.log("JS offset height " + this.newsScroll)
  }
  ngOnDestroy() {
    this.SysGuidid = '';
    this.userdat.sideTrans = false;
  }


}

@Component({
  selector: 'activate',
  templateUrl: './activate-popup.html',
})

export class RequestActivated {
  @Output() submitClicked = new EventEmitter<any>();
  fieldSubmitted: boolean = false;

  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
  roleType: any = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip');

  isLoading: boolean = false;
  SysGuid: string;
  accountName: any;
  accountNumber: any;
  comment: string = "";
  activationComment: string = '';
  // ReserveAccountActivationReqBody = {
  //   "SysGuid": '',
  //   "Comment": ''
  // }
  constructor(public service: DataCommunicationService, private accountListService: AccountListService,
    private snackBar: MatSnackBar,
    private EncrDecr: EncrDecrService,
    private router: Router, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RequestActivated>) {

    console.log(data);

    // this.ReserveAccountActivationReqBody.SysGuid = data.SysGuid;
  }

  ngOnInit() {
    this.SysGuid = this.data.SysGuid;
    this.accountName = this.data.accountName;
    this.accountNumber = this.data.accountNumber;
  }
  getdecodevalue(data) {
    return this.accountListService.getSymbol(data);
  }
  closePopup() {
    this.dialogRef.close('close');
  }
  assignStatus() {
    if (this.roleType == 2) return 184450001;  // sbu
    else if (this.roleType == 3) return 184450006; //cso
    else if (this.roleType == 1) return 184450000; // account owner
  }

  ReserveRequestActivation(activationComment) {
    // this.isLoading = true;
    this.fieldSubmitted = true;
    if (activationComment) {
      this.dialogRef.close('success');

      // this.ReserveAccountActivationReqBody.Comment = activationComment;
      let obj: any = {
        "account": {
          "accountnumber": this.accountNumber,
          "name": this.accountName,
          "accountid": this.SysGuid,
          "accounttype": 1,
          "requesttype": 4,
          "requestedby": this.userId,
          "isownermodified": false,

        },
        "overall_comments": {
          "accountid": this.SysGuid,
          "overallcomments": activationComment,
          "requestedby": this.userId,
          "status": this.assignStatus()
        },
        'attribute_comments': []
      };


      this.accountListService.account_modification(obj).subscribe(result => {
        // console.log(result);
        // private router: Router,

        if (result.data[0].processInstanceId) {
          // this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
          // if (result.helplineTicketResponse && camundaPostObj['account']["isownermodified"]) {
          //   this.snackBar.open(result.helplineTicketResponse, '', {
          //     duration: 5000
          //   });
          // } else {
          //   this.snackBar.open('ԍodification request sent successfully.ԧ, '', {
          //     duration: 5000
          //   });

          let obj: any = {
            "SysGuid": result.data[0].modificationrequestid,
            "ProcessGuid": result.data[0].processInstanceId
          }
          this.accountListService.ModificationActiverequest_UpdateCamundatoCRM(obj).subscribe(res => {
            console.log("result");
            // this.isLoading = false;
            this.submitClicked.emit('success');
            // this.snackBar.open("Activation request for " + this.accountName + " , " + this.accountNumber + " has been successfully submitted.", '', {
            //   duration: 5000
            // });
            this.snackBar.open(result.data[0].Status, '', {
              duration: 5000
            });

            // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
          }, error => { this.submitClicked.emit('error'); })
        }
        // }
        //  else {
        //   this.isLoading = false;
        // }

        // result ==> success
        // this.getAccountDetails();
      }, error => {
        this.submitClicked.emit('error');
      });
    }
  }

  // obj.reserveAccountActivation.accountid = this.SysGuid;
  // obj.overall_comments.accountid = this.SysGuid;
  // obj.overall_comments.overallcomments = this.activationComment;
  // obj.overall_comments.requestedby = this.userId;

  //   this.accountListService.reserveAccount_activation(obj)
  //     .subscribe(
  //     (data) => {
  //       console.log("account activated", data);
  //       // this.processInstanceid = data.processInstanceId;
  //       // this.ActivationRequestid=data.ActivationRequestid;
  //       let obj2: any = {
  //         "ProcessGuid" :data.processInstanceId,
  //         "SysGuid" : data.ActivationRequestid
  //        };
  //        this.accountListService.ModificationActiverequest_UpdateCamundatoCRM(obj2).subscribe(
  //         (data) => {
  //           console.log("updated to CRM ", data);
  //         },
  //         (error) => {
  //           console.log("Error in Activating account", error);
  //         }
  //       )
  //     },
  //     (error) => {
  //       console.log("Error in Activating account", error);
  //     }
  //     );
  //   this.router.navigate(['/accounts/accountlist/farming']);

  // }

}

@Component({
  selector: 'helpline',
  templateUrl: './helpline-popup.html',
})
export class Helpline {
  overviewComment: string = "";
  fieldSubmitted: boolean = false;
  accountName;
  constructor(public dialogRef: MatDialogRef<Helpline>, public accservive: DataCommunicationService, private accountListService: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.accountName = data.accountName || '';
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  getdecodevalue(data) {
    console.log(data);
    return this.accountListService.getSymbol(data);
  }
  submitComment() {
    this.fieldSubmitted = true;
    if (this.overviewComment) {
      this.dialogRef.close(this.overviewComment);
    }
  }
  closePopUp() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'account-owner',
  templateUrl: './accountowner-popup.html',
})

export class OpenAccountOwnerdetails {
  constructor(public dialogRef: MatDialogRef<OpenAccountOwnerdetails>, public accservive: DataCommunicationService) { }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  close = false;
  /****************** customer contact autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;

  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }

  appendcustomer(value: string, i) {

    this.customerName = value;
    this.selectedCustomer.push(this.customerContact[i])
  }

  customerContact: {}[] = [

    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedCustomer: {}[] = [];


  /****************** customer contact autocomplete code end ****************** */

  closeDiv(item: any) {
    //this.close=true;
    this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index != item.index);
  }

  ngOnInit() {
  }
}
@Component({
  selector: 'save',
  templateUrl: './savecomments-popup.html',
})
export class OpensaveComments {
  overviewComment: string = '';
  IsHelpLineTicket: boolean = false;
  fieldSubmitted: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef1: MatDialogRef<OpensaveComments>,
    public accservive: DataCommunicationService,
    public dialog: MatDialog) {
    this.IsHelpLineTicket = data.IsHelpLineTicket;
    // this.dialogRef1.disableClose = true;
  }
  openHelpline() {
    this.fieldSubmitted = true;
    if (this.overviewComment) {
      this.dialogRef1.close(this.overviewComment);
      //  this.dialogRef1.close('');
      // if (this.IsHelpLineTicket) {
      //   this.dialogRef1.close(this.overviewComment);
      //   const dialogRef = this.dialog.open(Helpline,
      //     {
      //       width: '380px'
      //     });
      // }
    }

  }
  closePopUp() {
    this.dialogRef1.close();
  }
}
/****************** add alliance  popopup  april 30th start***********/
@Component({
  selector: 'addAlliancepopup',
  templateUrl: './addAlliancepopup.html',
  styleUrls: ['./addAlliancestyle.scss']
})

export class OpenaddAlliancepopupcomponent {
  CustomerContact: any = [];
  alliance: boolean = false;
  newAlliance = { alliance: { 'SysGuid': '', 'Name': '' }, contactcampaign: { "Guid": "", "FullName": "" } };
  isActivityGroupSearchLoading: boolean = false;
  allsubmitted: boolean = false;
  allAlliance: any = [];
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
    nextLink: ''
  };
  linkedcampaignSwitch: boolean;
  linkedallinaceSwitch: boolean;
  sendAllianceToAdvance = [];
  selectedcampaign: {}[] = [];
  AllianceToAdvanceSelected = [];
  constructor(public dialogRef: MatDialogRef<OpenaddAlliancepopupcomponent>,
    public router: Router,
    public master3Api: S3MasterApiService,
    private accountListService: AccountListService,
    public dialog: MatDialog,
    public userdat: DataCommunicationService,
    public snackBar: MatSnackBar,
    private EncrDecr: EncrDecrService,
    public masterApi: MasterApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close([]);
  }

  /****************** add alliance autocomplete code start chethana april 30th ****************** */
  addAlliance() {
    console.log(this.newAlliance);
    //this.dialogRef.close(this.newAlliance);
    if (this.newAlliance && this.newAlliance.alliance.Name) {
      this.allsubmitted = false;
      // if (this.newAlliance && this.newAlliance.contactcampaign.Guid && this.newAlliance.alliance.Name) {
      this.dialogRef.close(this.newAlliance);
    } else {
      this.allsubmitted = true;
      // this.snackBar.open("Fields are mandatory", '', {
      //   duration: 3000
      // });
    }
  }
  linkedcampaignClose() {
    this.linkedcampaignSwitch = false;
  }
  // appendcampaign(value: any) {
  //   this.newAlliance['contactcampaign'] = value;
  //   this.newAlliance.contactcampaign.FullName = value.FullName;
  //   this.AllianceToAdvanceSelected = value;
  //   this.sendAllianceToAdvance.push({ ...value, Id: value.Id ? value.Id : value.SysGuid })
  //   // let json = { Name: value['Name'], Designation: value['Designation'], Email: value['Email'], accountName: (value['CustomerAccount'] ? (value['CustomerAccount']['FullName'] ? value['CustomerAccount']['FullName'] : 'NA') : 'NA'), SysGuid: value['Guid'], Id: value['Guid'] }
  //   // this.sendAllianceToAdvance.push(json);
  //   // console.log('sendAlliance to advance', this.sendAllianceToAdvance, value);
  // }
  appendalliance(value: any) {
    this.newAlliance['alliance'] = value;
    this.newAlliance.alliance.Name = value.Name;
    this.AllianceToAdvanceSelected = value;
    this.sendAllianceToAdvance.push({ ...value, Id: value.Id ? value.Id : value.SysGuid })
    // let json = { Name: value['Name'], Designation: value['Designation'], Email: value['Email'], accountName: (value['CustomerAccount'] ? (value['CustomerAccount']['FullName'] ? value['CustomerAccount']['FullName'] : 'NA') : 'NA'), SysGuid: value['Guid'], Id: value['Guid'] }
    // this.sendAllianceToAdvance.push(json);
    // console.log('sendAlliance to advance', this.sendAllianceToAdvance, value);
  }

  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    // let initalLookupData;
    // initalLookupData = this.remove_duplicates_alliance(this.data.SeletectedData, rowinitalLookupData);
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
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

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {

          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // this.lookupdata.tabledata = this.remove_duplicates_alliance(this.data.SeletectedData, this.lookupdata.tabledata);

        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // this.lookupdata.tabledata = this.remove_duplicates_alliance(this.data.SeletectedData, res.ResponseObject);
          // this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // if (this.lookupdata.tabledata.length) {
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // } else {
          //   this.lookupdata.TotalRecordCount = 0;
          // }
        }
        else if (x.action == "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
        }
      })

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.emptyArray(controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
        // this.addAlliance();
      }
    });
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'AllianceContactSearch': {
        return this.AllianceToAdvanceSelected = [], this.sendAllianceToAdvance = []
      }

    }
  }
  getCommonData() {
    return {
      guid: '',
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AllianceContactSearch': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
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

  IdentifyAppendFunc = {
    'AllianceContactSearch': (data) => { this.appendalliance(data) },
  }
  // remove_duplicates_alliance(selectedSysId, allData) {
  //   let data = allData.reduce((accumulator, currentValue) => {
  //     let k = selectedSysId.some(x => x.SysGuid == currentValue.SysGuid);
  //     return k ? accumulator : accumulator.concat(currentValue);
  //   }, []);
  //   return data;
  // }

  // getCustomerContact(keyword) {
  //   console.log(keyword);
  //   this.CustomerContact = [];
  //   // this.CustomerContact['message'] = '';
  //   this.isActivityGroupSearchLoading = true;
  //   let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip');
  //   let Guid = accountSysId ? accountSysId : '';
  //   // let Guid = localStorage.getItem('accountSysId') ? localStorage.getItem('accountSysId') : '';
  //   this.master3Api.getSearchCustomerCompanyContact(keyword, Guid, 'CustomerContact').subscribe(result => {
  //     this.isActivityGroupSearchLoading = false;
  //     console.log(result);
  //     if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 0) {
  //       this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
  //       // this.CustomerContact = result.ResponseObject;
  //       if (this.data.SeletectedData.length > 0) {
  //         this.CustomerContact = this.remove_duplicates_alliance(this.data.SeletectedData, result.ResponseObject);
  //         this.lookupdata.TotalRecordCount = result.TotalRecordCount - this.data.SeletectedData.length;
  //       }
  //       else {
  //         this.CustomerContact = result.ResponseObject;
  //         this.lookupdata.TotalRecordCount = result.TotalRecordCount;
  //       }
  //     }
  //     else {
  //       this.CustomerContact['message'] = ' No record found';
  //     }
  //   }, error => {
  //     this.CustomerContact = [];
  //     this.CustomerContact['message'] = 'No record found';
  //     this.isActivityGroupSearchLoading = false;
  //   });
  // }
  getSearchAllianceAccounts(keyword) {
    this.accountListService.getSearchAllianceAccounts(keyword).subscribe(result => {
      if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 0) {
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.allAlliance = this.getFilterData(result.ResponseObject)
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        if (this.allAlliance.length == 0) {
          this.allAlliance = [];
          this.allAlliance['message'] = 'No record found';
        }
      } else {
        this.allAlliance = [];
        this.allAlliance['message'] = 'No record found';
      }
    }, error => {
      this.allAlliance = [];
      this.allAlliance['message'] = 'No record found';
      console.log(error);
    })
  }

  getFilterData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          Name: this.accountListService.getSymbol(data.Name) || '',
          SysGuid: data.SysGuid || '',
          Number: data.Number || '',
          Owner: data.Owner || '',
          Type: data.Type || '',
        }
      })
    }
  }
  getdecodevalue(data) {
    if (data) {
      return this.accountListService.getSymbol(data);
    } else {
      return '';
    }
  }
  /****************** add alliance autocomplete code end chethana april 30th ****************** */
}
/****************** add alliance  popopup  april 30th end***********/
/****************** add advisory  popopup  sep 4th start***********/
@Component({
  selector: 'addAdvisorypopup',
  templateUrl: './addAdvisorypopup.html',
  styleUrls: ['./addAdvisorypopup.scss']
})
export class OpenaddAdvisorypopupcomponent {
  contactCBU: string = '';
  advisoryData: any;
  linkedCBUSwitch: boolean;
  submitted: boolean = false;
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
    nextLink: ''
  };
  sendAdvisoryToAdvance = [];
  AdvisoryToAdvanceSelected = [];
  CBUContact: any;
  reqBody;
  selectedAnalyst: {}[] = [];
  contactTarget: string;
  linkedTargetSwitch: boolean;
  selectedTarget: {}[] = [];
  AccountName;
  arrowkeyLocation = 0;
  pressedAdd: boolean = false;
  constructor(public dialogRef: MatDialogRef<OpenaddAdvisorypopupcomponent>, public router: Router,
    public masterApi: MasterApiService,
    public dialog: MatDialog,
    public master3Api: S3MasterApiService,
    public userdat: DataCommunicationService,
    public accountListService: AccountListService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.advisoryData = this.data;
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
  // addAdvisoryAnalyst() {
  //   console.log(this.selectedAnalyst);
  //   this.dialogRef.close(this.selectedAnalyst);
  // }
  addAdvisoryAnalyst() {
    console.log(this.contactCBU);
    if (this.selectedAnalyst.length > 0) {
      // this.submitted = false;
      this.dialogRef.close(this.selectedAnalyst);
    } else {
      // this.submitted = true;
      // this.snackBar.open("Select at least one name to proceed", '', {
      //   duration: 3000
      // });
    }
  }
  /******************add advisory CBU autocomplete code  start ****************** */

  linkedCBUClose() {
    this.linkedCBUSwitch = false;
  }

  appendCBU(value: string, i?, advCallBack?, advData?) {
    // debugger;
    // this.contactCBU = value;
    this.contactCBU = value;
    if (!advCallBack) {
      const index = this.CBUContact.findIndex(x => x.SysGuid === advData.SysGuid);
      if (index >= 0) {
        this.selectedAnalyst.push(this.CBUContact[index]);
        this.sendAdvisoryToAdvance.push({ ...advData, Id: advData.SysGuid, SysGuid: advData.SysGuid })
        this.AdvisoryToAdvanceSelected = advData;
      }
    } else {
      this.selectedAnalyst.push(this.CBUContact[i]);
    }

    // let json = [];
    // debugger;
    // this.selectedAnalyst.forEach((item) => {
    //   let json1 = { Name: item['Name'], Number: item['Number'], Owner: item['Owner']['FullName'], Vertical: item['Vertical']['Name'], Region: item['Address']['Region']['Name'], accountType: item['Type']['Value'], SysGuid: item['SysGuid'], Id: item['SysGuid'] }
    //   json.push(json1);
    // })
    // this.sendAdvisoryToAdvance = json;
    console.log('sendAdvisorytoAdvance', this.sendAdvisoryToAdvance);
    console.log('selected adivory', this.selectedAnalyst);
  }
  getCommonData() {
    return {
      guid: '',
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = AccountHeaders[controlName]
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {

      this.lookupdata.tabledata = res
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      };

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.CBUContact = this.lookupdata.tabledata;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // let seleced = [...this.selectedAnalyst, ...this.advisoryData];
          // if (seleced.length) {
          //   this.lookupdata.tabledata = this.remove_duplicates_Advisory_Advance(this.lookupdata.tabledata, seleced);
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - seleced.length;
          //   this.CBUContact = this.lookupdata.tabledata;
          // }
        } else if (x.action == "search") {
          this.lookupdata.tabledata = [];
          // this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.CBUContact = this.lookupdata.tabledata;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // let seleced = [...this.selectedAnalyst, ...this.advisoryData];
          // if (seleced.length) {
          //   this.lookupdata.tabledata = this.remove_duplicates_Advisory_Advance(res.ResponseObject, seleced);
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - seleced.length;
          //   this.CBUContact = this.lookupdata.tabledata;
          // }
        } else if (x.action === "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }

        }

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        this.emptyArray(result.controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
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
  getSymbol(data) {
    // console.log(data)
    if (data) {
      return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    } else {
      return '';
    }
  }
  IdentifyAppendFunc = {
    'AdvisoryAnalystSearch': (data) => { this.appendCBU(data.Name, '', false, data) }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'AdvisoryAnalystSearch': {
        return this.sendAdvisoryToAdvance = [], this.AdvisoryToAdvanceSelected = []
      }
    }
  }
  createTempData() {
    return {
      accountDetailName: this.AdvisoryToAdvanceSelected,
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AdvisoryAnalystSearch': { return (this.sendAdvisoryToAdvance.length > 0) ? this.sendAdvisoryToAdvance : [] }
    }
  }
  // return a;

  // remove_duplicates_Advisory(b, a) {
  //   for (let i = 0; i < a.length; i++) {
  //     for (let j = 0; j < b.length; j++) {
  //       if (a[i].Name == b[j].Name) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  // }
  // remove_duplicates_Advisory_Advance(allData, selectedSysId) {
  //   let data = allData.reduce((accumulator, currentValue) => {
  //     let k = selectedSysId.some(x => x.SysGuid == currentValue.SysGuid);
  //     return k ? accumulator : accumulator.concat(currentValue);
  //   }, []);
  //   return data;
  // }

  searchAdvisoryAnalyst(event) {
    this.reqBody = {
      'SearchText': event ? event : '',
      'PageSize': 10,
      'OdatanextLink': '',
      'RequestedPageNumber': 1

    }
    this.CBUContact = [];
    this.accountListService.getAdvisoryAnalyst(this.reqBody).subscribe((res) => {
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.CBUContact = this.getFilterDataofadvisory(res.ResponseObject);
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        // let seleced = [...this.selectedAnalyst, ...this.advisoryData];
        // if (seleced.length) {
        //   this.CBUContact = this.remove_duplicates_Advisory_Advance(res.ResponseObject, seleced);
        //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - seleced.length;
        // } else {
        //   this.CBUContact = res.ResponseObject;
        //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        // }
      }

    })
  }
  getFilterDataofadvisory(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          Name: this.accountListService.getSymbol(data.Name) || '',
          SysGuid: data.SysGuid || '',
          Number: data.Number || '',
          Owner: data.Owner || '',
          Type: data.Type || '',
        }
      })
    }
  }
  deleteSelectedItem(data, i) {
    this.selectedAnalyst.splice(i, 1);
    this.CBUContact.push(data);
  }
  getdecodevalue(data) {
    if (data) {
      return this.accountListService.getSymbol(data);
    } else {
      return '';
    }

  }
  //  = [

  //   { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
  //   { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  // ]


  /****************** add advisory CBU autocomplete code end chethana sep 4th ****************** */
  /******************add advisory Target Contact autocomplete code  start ****************** */




  linkedTargetClose() {
    this.linkedTargetSwitch = false;
  }
  appendTarget(value: string, i) {

    this.contactTarget = value;
    this.selectedTarget.push(this.TargetContact[i])
  }

  TargetContact: {}[] = [

    { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
    { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  ]




  /****************** add advisory Target Contact autocomplete code end chethana sep 4th ****************** */
  ngOnInit() {
  }
}
/****************** add advisory  popopup  sep 4th end***********/
/****************** add standby owner  popopup  Aug 29th start***********/
@Component({
  selector: 'AddStandbypopup',
  templateUrl: './AddStandbypopup.html',
  // styleUrls: ['./AddStandbystyle.scss']
})
export class OpenAddStandbypopupcomponent {
  roleType;
  SysGuidid;
  standByAccountOwner;
  title1;
  title2;
  key;
  constructor(public dialogRef: MatDialogRef<OpenAddStandbypopupcomponent>, public router: Router,
    public masterApi: MasterApiService,
    public dialog: MatDialog,
    public master3Api: S3MasterApiService,
    public userdat: DataCommunicationService,
    public accountListService: AccountListService, private EncrDecr: EncrDecrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleType = data.roleType;
    this.SysGuidid = data.SysGuid;
    this.key = data.key;
    // this.selectedCustomer = data;
    if (data.standByAccountOwner && data.standByDesignation)
      this.selectedCustomer = [{ 'FullName': data.standByAccountOwner, 'AdId': data.AdId, 'Email': data.Email, 'Designation': data.standByDesignation, 'SysGuidid': data.SysGuid }];
    console.log('selectedStandByOwner', this.selectedCustomer)
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
  /****************** standby owner autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;
  StandByAccountOwner: {}[];
  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }


  sendStandByOwnerToAdvance = [];
  appendcustomer(value, i) {
    this.selectedCustomer = [];
    this.selectedCustomer.push(value);
    this.checkValidation = false;
    this.customerName = value.FullName;
    if (this.selectedCustomer.length >= 1) {
      return;
    }
    this.selectedCustomer.push(this.customerContact[i])
    let json = { FullName: this.selectedCustomer[0]['FullName'], Designation: this.selectedCustomer[0]['Designation'], SysGuid: this.selectedCustomer[0]['SysGuid'], Id: this.selectedCustomer[0]['SysGuid'] }
    this.sendStandByOwnerToAdvance.push(json);
  }



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
    nextLink: ''
  };

  getCommonData() {
    return {
      guid: '',
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'StandByAccountOwnerSearch': { return (this.sendStandByOwnerToAdvance.length > 0) ? this.sendStandByOwnerToAdvance : [] }
    }
  }
  getadvancelookName(name) {
    let newName;
    if (name == 'StandByAccountOwner') {
      newName = 'Standby Account Owner'
    } else {
      newName = 'Account Owner'
    }
    return newName;
  }
  openadvancetabs(controlName, initalLookupData, value, keydata): void {

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = AccountHeaders[controlName]
    this.lookupdata.lookupName = this.getadvancelookName(keydata);
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {

      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
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

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        // this.emptyArray(result.controlName)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }

  AppendParticularInputFun(selectedData, controlName) {

    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.selectedCustomer[0] = data
        });
      }
    }
  }
  customerContact: {}[] = [];
  //  = [

  //   { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedCustomer: {}[] = [];


  /****************** standby owner autocomplete code end ****************** */

  closeDiv(item: any) {

    this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index != item.index);
    this.customerName = "";
  }

  standBySearch() {
    this.checkValidation = false;
    const accountOwnerGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountOwnerGuid'), 'DecryptionDecrip'); //localStorage.getItem("accountOwnerGuid")
    this.SearchUser(this.customerName, accountOwnerGuid);
  }
  SearchUser(keyword, accountOwnerGuid) {
    this.StandByAccountOwner = [];
    // if (!this.userdat.searchFieldValidator(keyword)) {

    // }
    // else {

    this.master3Api.StandByAccountOwnerSearch(keyword, accountOwnerGuid).subscribe(result => {
      console.log("searchUser", result);
      // const filterArray = [];
      // result.ResponseObject.map((i) =>{
      //   if(i.AdId === this.selectedCustomer[0]["AdId"]){
      //     delete result.ResponseObject[i];
      //   }else{
      //     filterArray.push(i)
      //   }
      // })
      if (!result.IsError && result.ResponseObject) {
        this.StandByAccountOwner = result.ResponseObject;
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        this.customerContact = [];
        let RemoveSelectedName;
        if (this.selectedCustomer.length >= 1) {
          RemoveSelectedName = this.selectedCustomer[0]['FullName'] ? this.selectedCustomer[0]['FullName'] : '';
          this.customerContact = result.ResponseObject.filter(item => item.FullName !== RemoveSelectedName);
        } else {
          this.customerContact = result.ResponseObject;
        }


        console.log("object", this.customerContact);

      }
    });
    // }
  }

  checkValidation: boolean;
  startTransition() {
    console.log(this.data.standByAccountOwner);
    if (this.selectedCustomer[0] === undefined && !this.data.standByAccountOwner) {
      return this.checkValidation = true;
    }
    else if (this.data.standByAccountOwner && !this.selectedCustomer[0]) {
      console.log(this.data.SysGuid);
      if (this.data.SysGuid) {
        this.checkValidation = false;
        this.dialogRef.close();
        this.accountListService.setSession('routeParamsTrasition', { 'route_from': 'acc_trasistion', 'Id': this.SysGuidid });
        // this.router.navigateByUrl('accounts/accounttransition/' + this.SysGuidid)
        this.router.navigate(["/accounts/accounttransition"]);
      } else {
        this.checkValidation = true
      }
    }
    else {
      this.master3Api.sendMessage({ 'standByOwner': this.selectedCustomer[0] })
      if (this.selectedCustomer.length > 0) {
        this.checkValidation = false;
        this.dialogRef.close();
        this.accountListService.setSession('routeParamsTrasition', { 'route_from': 'acc_trasistion', 'Id': this.SysGuidid });
        // this.router.navigateByUrl('accounts/accounttransition/' + this.SysGuidid)
        this.router.navigate(["/accounts/accounttransition"]);
      } else {
        this.checkValidation = true
      }
    }
  }
  updateOwer() {
    console.log(this.customerContact);
    this.dialogRef.close(this.selectedCustomer);
  }

  ngOnInit() {
    this.customerName = this.data.standByAccountOwner;
    this.title1 = 'View transition';
    this.title2 = 'Start transition';
  }
}
/****************** add standby owner  popopup  Aug 29th end***********/
/****************** add active  popopup  april 30th start***********/
@Component({
  selector: 'addActivepopup',
  templateUrl: './addActivepopup.html',
  styleUrls: ['./addActivestyle.scss']
})
export class OpenaddActivepopupcomponent {
  CustomerContact: any;
  comp_name: string = '';
  linkedcampaignSwitch: boolean = false;
  Competitor: any = { "Guid": "", "Name": "" };
  competitors: boolean = false;
  activesubmitted: boolean = false;
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
    nextLink: ''
  };
  CompetitorData: any;
  sendCompetitorToAdvance: any = [];
  sendCompetitorToAdvanceSelected: any;
  competitorData: any;

  constructor(public dialogRef: MatDialogRef<OpenaddActivepopupcomponent>,
    public router: Router,
    public masterApi: MasterApiService,
    public accountListService: AccountListService,
    public dialog: MatDialog,
    public userdat: DataCommunicationService,
    public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.competitorData = this.data; }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
  addrowalliance() {
    console.log(this.Competitor);
    // this.dialogRef.close(this.Competitor);

    if (this.Competitor && this.Competitor.Name) {
      this.activesubmitted = false;
      // if (this.newAlliance && this.newAlliance.contactcampaign.Guid && this.newAlliance.alliance.Name) {
      this.dialogRef.close(this.Competitor);
    } else {
      this.activesubmitted = true;
      // this.snackBar.open("Fields are mandatory", '', {
      //   duration: 3000
      // });
    }
  }
  allowAlpha(event) {
    let inputValue = event.which;
    // allow letters and whitespaces only.
    if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
      event.preventDefault();
    }
  }
  appendcampaign(value: any) {
    // this.Competitor = value;
    this.Competitor = { 'Name': value.Name, 'Guid': value.Guid ? value.Guid : value.SysGuid };
    // this.selectedcampaign.push()
    console.log("value", value);
    // this.CompetitorData.CustomerContact.Guid = value.Guid ? value.Guid : value.SysGuid;
    // this.CompetitorData.CustomerContact.FullName = value.Name;
    this.sendCompetitorToAdvance.push({ ...value, Id: value.Guid ? value.Guid : value.SysGuid });
    this.sendCompetitorToAdvanceSelected = value;
  }
  getCustomerContact(keyword) {
    this.CustomerContact = [];
    this.accountListService.SearchCompetitor(keyword).subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        // this.CustomerContact = result.ResponseObject;
        this.CustomerContact = result.ResponseObject;
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      }
    })
  }
  // remove_duplicates(b, a) {
  //   for (let i = 0; i < a.length; i++) {
  //     for (let j = 0; j < b.length; j++) {
  //       if (b[j].Name == a[i].Name) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  // }
  // getCustomerContact(keyword) {
  //   this.CustomerContact = [];
  //   this.accountListService.SearchCompetitor(keyword).subscribe((res) => {
  //     if (!res.IsError && res.ResponseObject) {
  //       this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
  //       if (this.competitorData.length > 0 && res.ResponseObject.length > 0) {
  //         const customerData = this.remove_duplicates_Advisory(this.competitorData, res.ResponseObject);
  //         this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.competitorData.length;
  //         this.CustomerContact = customerData;
  //         this.lookupdata.TotalRecordCount = res.TotalRecordCount;
  //         this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
  //       } else {
  //         this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
  //           this.CustomerContact = res.ResponseObject;
  //           this.lookupdata.TotalRecordCount = res.TotalRecordCount;
  //       }
  //     }

  //   })
  // }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      console.log(res);

      if (res)
        this.lookupdata.tabledata = res;
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
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

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        this.emptyArray(result.controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'Competitor': { return (this.sendCompetitorToAdvance.length > 0) ? this.sendCompetitorToAdvance : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'Competitor': {
        return this.sendCompetitorToAdvance = [], this.sendCompetitorToAdvanceSelected = []
      }


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
  IdentifyAppendFunc = {
    'Competitor': (data) => { this.appendcampaign(data) },
  }

  getCommonData() {
    return {
      guid: '',
    }
  }
}

/****************** add active  popopup  april 30th end***********/
/****************** add CBU  popopup  april 30th start***********/
@Component({
  selector: 'addCBUpopup',
  templateUrl: './addCBUpopup.html',
  styleUrls: ['./addCBUstyle.scss']
})
export class OpenaddCBUpopupcomponent {
  CustomerContacts: any;
  linkedcampaignSwitch: boolean = false;
  linkedcampaignSwitch1: boolean = false;
  isActivityGroupSearchLoading: boolean = false;
  CBUData = { 'Name': { 'Guid': '', 'FullName': '' }, 'BuyerOrg': false, 'CustomerContact': { 'Guid': '', 'FullName': '' }, 'BDM': { 'Guid': '', 'FullName': '' } };
  BDMs: any;
  SelectedData;
  sendCBUToAdvance = [];
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
    nextLink: ''
  };
  contactcampaign: string;
  sendCBUToAdvanceSelected: [];
  pressedAdd: boolean = false;
  constructor(public dialogRef: MatDialogRef<OpenaddCBUpopupcomponent>, public router: Router, public dialog: MatDialog,
    public master3Api: S3MasterApiService, public userdat: DataCommunicationService, public snackBar: MatSnackBar, private EncrDecr: EncrDecrService,
    public masterApi: MasterApiService, private accountListService: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

  // remove_duplicates(b, a) {
  //   for (var i = 0; i < a.length; i++) {
  //     for (var j = 0; j < b.length; j++) {
  //       if (a[i].Name == b[j].CustomerContact.FullName) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  //   // console.log(b);
  //   // console.log(a);

  // }
  getCustomerContact(keyword) {
    console.log(keyword);

    this.CustomerContacts = [];
    // this.CustomerContacts['message'] = '';
    this.isActivityGroupSearchLoading = true;
    // let Guid = localStorage.getItem('accountSysId') ? localStorage.getItem('accountSysId') : '';
    let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    let Guid = accountSysId ? accountSysId : '';
    this.master3Api.getSearchCustomerCompanyContact(keyword, Guid, 'CustomerContact').subscribe(result => {
      console.log(result);
      console.log("this.data" + this.data);
      this.isActivityGroupSearchLoading = false;
      if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 0) {
        // this.lookupdata.TotalRecordCount = result.TotalRecordCount;             
        // if (this.data.SeletectedData.record.length > 0) {
        //   this.CustomerContacts = this.remove_duplicates(this.data.SeletectedData.record, result.ResponseObject);
        //   this.lookupdata.TotalRecordCount = this.CustomerContacts.length;
        // } else {
        this.CustomerContacts = result.ResponseObject;
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
        // }

        // 
      }
      else {
        this.CustomerContacts['message'] = ' No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.CustomerContacts = [];
      this.CustomerContacts['message'] = ' No record found';
    })
  }

  getBDM(keyword) {
    this.BDMs = [];
    //  this.BDMs['message'] = '';
    this.isActivityGroupSearchLoading = true;
    this.master3Api.SearchAccountOwner(keyword).subscribe(result => {
      console.log(result);
      this.isActivityGroupSearchLoading = false;
      if (!result.IsError && result.ResponseObject && result.ResponseObject.length > 0) {
        this.BDMs = result.ResponseObject;
      }
      else {
        this.BDMs['message'] = 'No record found';
      }
    }, error => {
      this.BDMs = [];
      this.isActivityGroupSearchLoading = false;
      this.BDMs['message'] = ' No record found';
    })
  }
  /****************** add CBU autocomplete code start chethana april 30th ****************** */


  linkedcampaignClose() {
    this.linkedcampaignSwitch = false;
  }

  appendCustomerContact(item) {
    console.log(item);

    this.CBUData.CustomerContact.Guid = item.Guid;
    this.CBUData.CustomerContact.FullName = item.FullName;
    this.sendCBUToAdvance.push({ ...item, Id: item.Guid ? item.Guid : item.SysGuid });
    this.sendCBUToAdvanceSelected = item;


  }


  getCommonData() {
    return {
      guid: '',
    }
  }

  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {

      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
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

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // this.lookupdata.tabledata = [];
          // if (this.data.SeletectedData.record.length > 0 && res.ResponseObject.length > 0) {
          //   // this.lookupdata.tabledata = this.remove_duplicates(this.data.SeletectedData.record, res.ResponseObject);
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //   this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          // } else {
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //   this.lookupdata.tabledata = res.ResponseObject;
          // }
          // this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }

        else if (x.action == "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }

        }

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        this.emptyArray(result.controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'BUContactSearch': { return (this.sendCBUToAdvance.length > 0) ? this.sendCBUToAdvance : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'BUContactSearch': {
        return this.sendCBUToAdvance = [], this.sendCBUToAdvanceSelected = []
      }


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
  IdentifyAppendFunc = {
    'BUContactSearch': (data) => { this.appendCustomerContact(data) },
  }
  // AppendParticularInputFun(selectedData, controlName) {

  //   if (selectedData) {
  //     if (selectedData.length > 0) {
  //       selectedData.forEach(data => {
  //         this.CustomerContacts.map((ele) => {
  //           // if (ele.isKeyContact) {
  //           ele.FullName = data.FullName;
  //           this.CBUData.CustomerContact.FullName = data.FullName;
  //           this.CBUData.CustomerContact.Guid = data.Guid;
  //           return;
  //           // }

  //         })
  //       });
  //     }
  //   }
  // }

  appendBDM(item) {
    this.CBUData.BDM.Guid = item.SysGuid;
    this.CBUData.BDM.FullName = item.FullName;
  }
  AddCBU() {
    console.log(this.CBUData);
    // if (this.CBUData && this.CBUData.CustomerContact.Guid && this.CBUData.Name.FullName) {
    if (this.CBUData && this.CBUData.Name.FullName) {
      this.dialogRef.close(this.CBUData);
    } else {
      // this.snackBar.open("Fields are mandatory", '', {
      //   duration: 3000
      // });
    }
  }
  //  appendcampaign(value: string, i) {

  //     this.contactcampaign = value;
  //     this.selectedcampaign.push(this.campaignContact[i])
  //  }

  //  campaignContact: {}[] = [

  //     { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
  //     { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  //  ]

  //  selectedcampaign: {}[] = [];
  //  ////////////////////
  //   contactcampaign1: string;

  //   linkedcampaignSwitch1: boolean;

  //   linkedcampaignClose1() {
  //      this.linkedcampaignSwitch1 = false;
  //   }
  //   appendcampaign1(value: string, i) {

  //      this.contactcampaign1 = value;
  //      this.selectedcampaign1.push(this.campaignContact1[i])
  //   }

  //   campaignContact1: {}[] = [

  //      { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
  //      { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  //   ]

  // selectedcampaign1: {}[] = [];

  /****************** add CBU autocomplete code end chethana april 30th ****************** */
}
// rejectCBUpopup start



@Component({
  selector: 'rejectCBUpopup',
  templateUrl: './rejectCBUpopup.html',
  styleUrls: ['./addCBUstyle.scss']
})

export class OpenrejectCBUpopupcomponent {
  lookupdata = {
    tabledata: [],
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    selectedRecord: [],
    isLoader: false,
    nextLink: ''
  };

  contactcampaign: string;
  sendCBUToAdvanceSelected: [];
  pressedAdd: boolean = false;

  constructor(public dialogRef: MatDialogRef<OpenrejectCBUpopupcomponent>, public router: Router, public dialog: MatDialog,
    public master3Api: S3MasterApiService, public userdat: DataCommunicationService, public snackBar: MatSnackBar, private EncrDecr: EncrDecrService,
    public masterApi: MasterApiService, private accountListService: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

  deleteCBU(i) {
    this.dialogRef.close({ deletIndex: i });

    //this.CustomerBusinessUnit.record.splice(i, 1);

    // this.dialogRef.close();
  }
}

// rejectCBUpopUp end
/****************** add CBU  popopup  april 30th end***********/
@Component({
  selector: 'commentbox',
  templateUrl: './commentbox-popup.html',
})
export class CommentBoxComponent {

  constructor(public service: DataCommunicationService) { }
  ngOnit() {

  }
}


/*******************************************************************/
@Component({
  selector: 'confirm-DeactiveReference',
  templateUrl: './DeactiveReference-popup.html',
  styleUrls: ['./account-details.component.scss']
})

export class DeactiveReferencePopup {

  sysGuid;
  IsOpportunitiesTagged;
  cbudeactivation: boolean;
  sapCodeExists: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public accountListService: AccountListService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DeactiveReferencePopup>) { }
  ngOnInit() {
    this.sysGuid = this.data.SysGuid;
    this.IsOpportunitiesTagged = this.data.IsOpportunitiesTagged;
    this.cbudeactivation = this.data.cbudeactivation;
    this.sapCodeExists = this.data.sapCodeExists
    console.log('sysGuid', this.sysGuid);
  }
  deactivateReference() {
    let body = {
      "SysGuid": this.sysGuid
    }
    this.accountListService.deactivateReference(body).subscribe((res) => {
      console.log('deactivate reference res', res);
      if (!res.IsError) {
        this.snackBar.open(res.Message, '', {
          duration: 5000
        });
        this.dialogRef.close("success");
      }
    })
  }

}

/******************************************************************/




