import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { ExistingAccountPopupComponent } from '@app/shared/modals/existing-account-popup/existing-account-popup.component';
import { ExistingReservePopupComponent } from '@app/shared/modals/existing-reserve-popup/existing-reserve-popup.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { MatSnackBar } from '@angular/material';
import { AccountListService, AccountHeaders, AccountAdvNames } from '@app/core/services/accountList.service';
import { CBUActivateComponent } from './modals/cbu-activate/cbu-activate.component';
import { AllianceAddComponent } from './modals/add-alliance/add-alliance.component';
import { AddActiveCompetitorComponent } from './modals/add-active-competitor/add-active-competitor.component';
import { AddAnalystRelationsComponent } from './modals/add-analyst-relations/add-analyst-relations.component';
import { RequestSapCodeComponent } from './modals/request-sap-code/request-sap-code.component';
import { SwapPopupComponent } from '@app/shared/modals/swap-popup/swap-popup.component';
import { SwapCreatePopupComponent } from '@app/shared/modals/swap-create-popup/swap-create-popup.component';
import { count } from 'rxjs/operators';
import { ValidationService } from '@app/shared/services';
import { Store } from '@ngrx/store';
import { farmingRequestsclear } from '@app/core/state/actions/farming-account.action';
import { AppState } from '@app/core/state';

@Component({
  selector: 'app-helpdesk-account-creation',
  templateUrl: './helpdesk-account-creation.component.html',
  styleUrls: ['./helpdesk-account-creation.component.scss']
})
export class HelpdeskAccountCreationComponent implements OnInit {
  isLoading: boolean;
  overviewTab = true;
  allianceTab = false;
  accountTab = false;
  CustomerTab = false;
  accountDetails: any;
  creditDetails: any;
  ownershipDetails: any;
  engageDetails: any;
  // varaibles added for AOT FIX start 
  swappingDetails: any;
  allSwapableAccount;
  areaPopOver: boolean = false;
  isSearchLoader: boolean = false;
  showTooltip: boolean;
  wiproaccounts: any;
  wiprodb: any;
  accountcreationobj = {};
  submitted;
  formError = true;
  isActivityGroupSearchLoading: boolean;
  allFalse = true;
  isError: any = {
    'Type': true,
    'Legalentityname': true,
    'accountname': true,
    'Owner': true,
    'currency': true,
    'SBU': false,
    'Vertical': false,
    // 'SubVertical':false,
    'Geo': false,
    'Region': false,
    'CountryReference': false,
    'swapAccountfield': false,
    'alternativeOwner': false,
    'alternativeSwapAccount': false,
  };
  otherFieldsvalidation = false;
  // Variable added for AOT FIX end 
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
    'ParentAccount': [],
    'UltimateParentaccount': [],
    'accountClassification': [],
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
    'MarketRisk': [],
    'AccountCategory': [],
    'TerritoryFlag': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    'IsGovAccount': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    'IsNewAgeBusiness': [{ 'Id': true, 'Value': 'Yes' }, { 'Id': false, 'Value': 'No' }],
    "currency": [],
    'SBU': [],
    'Vertical': [],
    'Privateequaitity': [],
  }
  AccountAttribute: any = [];
  customerDetailsDropdown: any = {
    'Currency': []
  };
  vendorDropdown: any = {
    'AdvisoryRAnalyst': [],
    'RelationShipType': []
  };
  validatorsArray = { 'WebsiteUrl': true, 'Email': true };
  ownerNonModifAttr = ['accountname', 'governmentaccount', 'proposedaccounttype', 'proposedclassification', 'DUNSID', 'parentaccount', 'ultimateparent', 'owner', 'accounttype', 'geography', 'region', 'country', 'subdivision', 'city', 'sbu', 'vertical', 'subvertical', 'cbu', 'newclassification', 'accountcategory'];
  SBUNonModifAttr = ['accountname', 'DUNSID', 'governmentaccount', 'parentaccount', 'proposedclassification', 'ultimateparent', 'address', 'proposedaccounttype', 'accountcategory', 'territoryflag', 'geography', 'region', 'country', 'subdivision', 'city', 'sbu', 'vertical', 'subvertical'];
  CSONonModifAttr = ['accountid', 'DUNSID', 'accountname', 'parentaccount', 'ultimateparent', 'governmentaccount'];
  apprvalArr: any = [];
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}';
  accountCompetitors: any = [];
  sub_and_vertical: any[];
  huntingRatio: any;
  accountData: any;
  location_temp: any = [];
  arrowkeyLocation: number = 0;
  ownerShipHistoryArray: any = [];
  advisory: any = [];
  ownerdata: any;
  IsGovAccount: boolean = false;
  IsNewagebusiness: boolean = false;
  iswapaccount: boolean = false;
  isaltswapaccount: boolean = false;
  disableswaptoggle: boolean = true;
  disablealtswaptoggle: boolean = true;
  althuntingRatio;
  isloadmore: boolean;
  dnbdata: any;
  indexvalue: any;
  advLookupCurrency;
  advSub_and_vertical;
  advlocation_temp;
  IsPrivateEquityOwned: boolean = false;
  isactive: boolean = false;
  parentflag: any = false;
  parentdetails: any;
  // detailsTabs = { 'overviewTab': true, 'accountTab': false, 'CustomerTab': false, 'allianceTab': false };
  constructor(public userdat: DataCommunicationService,
    private router: Router,
    public dialog: MatDialog,
    public masterApi: S3MasterApiService,
    private snackBar: MatSnackBar,
    public validate: ValidationService,
    private store: Store<AppState>,
    public accountListService: AccountListService,
    private el: ElementRef
  ) { }
  ngOnInit() {
    this.getwiproaccounts(this.searchpayload)
    this.GetProposedAccountType();
    this.GetProposedAccountClassification();
    // this.GetAccountCategory();
    this.GetAccountType();
    this.GetMarketRisk();
    this.getLifeCycleStage();
    this.getRevenueCategory();
    this.getGrowthCategory();
    this.getCoverageLevel();
    this.getAccountRelationShipStaatus();
    this.getEntity();
    this.getownershiptype();
    this.getRelationShipType();
    this.accountDetails = [
      {
        accountName: 'Legal entity name',
        fkey: 'Legalentityname',
        camunda_key: 'accountname',
        Id: '',
        record: '',
        // values: data.Name ? this.accountListService.getSymbol(data.Name) : '',
        // old_val: data.Name ? this.accountListService.getSymbol(data.Name) : '',
        control: 'searchinput',
        isDisabled: false,
        comment: '',
        AttributeName: "name",
        tooltip: "The legal entity name of the account. Will be fetched from D&B where available",
        isRequired: true,
        placeholder: 'Enter legal entity name'
      }, {
        accountName: 'Account name',
        fkey: 'accountname',
        camunda_key: 'accountid',
        record: '',
        // Id: this.SysGuidid,
        // values: data.Number ? data.Number : '',
        // old_val: data.Number ? data.Number : '',
        // control: (this.getAttributeId("number")) ? 'input' : 'disabledinput',
        control: 'input',
        isDisabled: true,
        comment: '',
        AttributeName: "number",
        isRequired: true,
        placeholder: 'Enter account name',
        tooltip: 'Name given to the account within CRM, should ideally be same as the legal entity name.'
      },
      {
        accountName: 'Account type',
        fkey: 'Type',
        camunda_key: 'accounttype',
        Id: '',//(this.userdat.validateKeyInObj(data, ['Type', 'Id'])) ? data.Type.Id : '',
        values: '',//(this.userdat.validateKeyInObj(data, ['Type', 'Value'])) ? data.Type.Value : '',
        // old_val: (this.userdat.validateKeyInObj(data, ['Type', 'Value'])) ? data.Type.Value : '',
        // control: (this.getAttributeId('type_value')) ? 'dropdown' : 'disabledinput',
        control: 'dropdown',
        isDisabled: false,
        comment: '',
        AttributeName: "type_value",
        minlimit: -1000000000000000,
        maxlimit: 1000000000000000,
        datatype: 'number',
        isRequired: true,
      },
      {
        accountName: 'Account classification',
        fkey: 'accountClassification',
        camunda_key: 'legalentity',
        Id: '', //184450003,
        // values: data.LegalEntity ? this.accountListService.getSymbol(data.LegalEntity) : '',
        // old_val: data.LegalEntity ? this.accountListService.getSymbol(data.LegalEntity) : '',
        // control: (this.getAttributeId('legalentity')) ? 'input' : 'disabledinput',
        control: 'dropdown',
        isDisabled: false,
        comment: '',
        AttributeName: "legalentity",
        minlimit: -1000000000000000,
        maxlimit: 1000000000000000,
        datatype: 'string',
        tooltip: "The legal entity name of the account. Will be fetched from D&B where available"
      },
      {
        accountName: 'Proposed account type',
        fkey: 'ProposedAccountType',
        camunda_key: 'proposedaccounttype',
        Id: '',// (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Id'])) ? data.ProposedAccountType.Id : '',
        values: '',//(this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Value'])) ? data.ProposedAccountType.Value : '',
        // old_val: (this.userdat.validateKeyInObj(data, ['ProposedAccountType', 'Value'])) ? data.ProposedAccountType.Value : '',
        // control: (this.getAttributeId('proposedaccounttype_value')) ? 'dropdown' : 'disabledinput',
        control: 'dropdown',
        isDisabled: false,
        comment: '',
        AttributeName: "proposedaccounttype_value",
        minlimit: -1000000000000000,
        maxlimit: 1000000000000000,
        datatype: 'number'
      }, {
        accountName: 'Proposed Account Classification',
        fkey: 'Proposedaccountclassification',
        camunda_key: 'parentaccount',
        Id: '',// (this.userdat.validateKeyInObj(data, ['ParentAccount', 'SysGuid'])) ? data.ParentAccount.SysGuid : '',
        values: '',// (this.userdat.validateKeyInObj(data, ['ParentAccount', 'Name'])) ? this.accountListService.getSymbol(data.ParentAccount.Name) : '',
        // old_val: (this.userdat.validateKeyInObj(data, ['ParentAccount', 'Name'])) ? this.accountListService.getSymbol(data.ParentAccount.Name) : '',
        // control: (this.getAttributeId('parentaccount_name')) ? 'searchinput' : 'disabledinput',
        control: 'dropdown',
        isDisabled: false,
        comment: '',
        AttributeName: "parentaccount_name",
      },
      {
        accountName: 'Duns number',
        fkey: 'DUNSID',
        camunda_key: 'DUNSID',
        // Id: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Id'])) ? data.DUNSID.SysGuid : '',
        // values: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
        // old_val: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
        // // control: 'disabledinput', //input
        // control: (this.getAttributeId('dunsid')) ? 'input' : 'disabledinput',
        control: 'disabledinput',
        isDisabled: true,
        comment: '',
        AttributeName: "dunsid",
        tooltip: "Defines the Unique Number from Duns and Bradstreet for each legal entity"
      },
      {
        accountName: 'Parent account',
        fkey: 'ParentAccount',
        camunda_key: 'DUNSID',
        record: '',
        isAdvanceLookup: true,
        Id: '',// (this.userdat.validateKeyInObj(data, ['DUNSID', 'Id'])) ? data.DUNSID.SysGuid : '',
        values: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
        // // control: 'disabledinput', //input
        // control: (this.getAttributeId('dunsid')) ? 'input' : 'disabledinput',
        control: 'searchinput',
        isDisabled: false,
        comment: '',
        AttributeName: "dunsid",

      },
      {
        accountName: 'Parent’s duns number',
        fkey: 'ParentDUNSID',
        camunda_key: 'DUNSID',
        // Id: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Id'])) ? data.DUNSID.SysGuid : '',
        // values: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
        // old_val: (this.userdat.validateKeyInObj(data, ['DUNSID', 'Name'])) ? this.accountListService.getSymbol(data.DUNSID.Name) : '',
        // // control: 'disabledinput', //input
        // control: (this.getAttributeId('dunsid')) ? 'input' : 'disabledinput',
        control: 'disabledinput',
        isDisabled: true,
        comment: '',
        AttributeName: "dunsid"
      },
      {
        accountName: 'Ultimate Parent Account ',
        fkey: 'UltimateParentaccount',
        camunda_key: 'accountid',
        Id: '',
        values: '',
        // old_val: data.Number ? data.Number : '',
        // control: (this.getAttributeId("number")) ? 'input' : 'disabledinput',
        control: 'disabledinput',
        isDisabled: true,
        comment: '',
        AttributeName: "number"
      },
      {
        accountName: 'Ultimate Parent’s Duns number',
        fkey: 'ultparentDUNSID',
        camunda_key: 'accountid',
        // Id: this.SysGuidid,
        // values: 2019,
        // old_val: data.Number ? data.Number : '',
        // control: (this.getAttributeId("number")) ? 'input' : 'disabledinput',
        control: 'disabledinput',
        isDisabled: true,
        comment: '',
        AttributeName: "number"
      },
      {
        accountName: 'Private equity owned entity',
        fkey: 'PrivateEquityOwnedEntity',
        camunda_key: 'accountid',
        control: 'radiobutton',
        isDisabled: false,
        comment: '',
        AttributeName: "PrivateEquityOwnedEntity",
        values: false
      },
      {
        accountName: 'Private equity account',
        fkey: 'Privateequaitity',
        camunda_key: 'accountid',
        payloadKey : 'PrivateEquityAccount',
        control: 'disabledinput',
        isDisabled: true,
        isRequired : false,
        comment: '',
        AttributeName: "Privateequaitity",
        isAdvanceLookup: true,
        Id: '',
        values: '',
        record: ''
      },
    ];
    this.ownershipDetails = [
      {
        name: 'SBU',
        fkey: 'SBU',
        camunda_key: 'sbu',
        payloadKey: 'sbu',
        // Id: (this.userdat.validateKeyInObj(data, ['SBU', 'Id'])) ? data.SBU.Id : '',
        record: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['SBU', 'Name'])) ? data.SBU.Name : '',
        editname: 'SBU',
        editrecord: 'SBU',
        control: 'searchinput', // searchinput
        // control: (this.getAttributeId('sbu_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: true,
        comment: '',
        AttributeName: "sbu_name",
        isRequired: true,
        isOpened: false
      }, {
        name: 'Vertical', //feb-18 Rupali
        fkey: 'Vertical',
        camunda_key: 'vertical',
        payloadKey: 'Vertical',
        // Id: (this.userdat.validateKeyInObj(data, ['Vertical', 'Id'])) ? data.Vertical.Id : '',
        record: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['Vertical', 'Name'])) ? data.Vertical.Name : '',
        editname: 'Vertical',
        editrecord: 'Vertical',
        control: 'searchinput', // searchinput
        // control: (this.getAttributeId('vertical_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: true,
        comment: '',
        AttributeName: "vertical_name",
        isRequired: true,
        isOpened: false
      }, {
        name: 'Sub vertical',
        fkey: 'SubVertical',
        camunda_key: 'subvertical',
        payloadKey: 'SubVertical',
        // Id: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Id'])) ? data.SubVertical.Id : '',
        record: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['SubVertical', 'Name'])) ? data.SubVertical.Name : '',
        editname: 'Sub vertical',
        editrecord: 'Sub vertical',
        // control: 'disabledinput', // searchinput
        // control: (this.getAttributeId('subvertical_name')) ? 'searchinput' : 'disabledinput',
        control: 'searchinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "subvertical_name",
        isRequired: false,
        isOpened: false
      },
      {
        name: 'Account delivery head',
        fkey: 'DeliveryManagerADHVDH',
        camunda_key: '',
        payloadKey: '',
        Id: '',
        record: '',
        value: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['DeliveryManagerADHVDH', 'FullName'])) ? data.DeliveryManagerADHVDH['FullName'] : '',
        editname: 'Account delivery head',
        editrecord: '',
        control: 'input', // searchinput
        // control: (this.getAttributeId('deliverymanageradhvdh_value')) ? 'input' : 'disabledinput',
        isAdvanceLookup: false,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "deliverymanageradhvdh_value",
      },
      {//chethana july 3rd split adh/vdh
        name: 'Vertical delivery head',
        fkey: 'VDH',
        camunda_key: '',
        payloadKey: '',
        Id: '',
        record: '',
        value: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['VDH', 'FullName'])) ? data.VDH['FullName'] : '',
        editname: 'Vertical delivery head',
        editrecord: '',
        // control: (this.getAttributeId('vdh_fullname')) ? 'input' : 'disabledinput',
        control: 'input',
        isAdvanceLookup: false,
        isComment: true,
        comment: '',
        isDisabled: false,
        AttributeName: 'vdh_fullname'
      },
      {//Kunal August 31st
        name: 'Account delivery manager',
        fkey: 'ADM',
        camunda_key: '',
        payloadKey: '',
        Id: '',
        record: '',
        value: '',
        // old_val: (this.userdat.validateKeyInObj(data, ['ADM', 'FullName'])) ? data.ADM['FullName'] : '',
        editname: 'Account delivery manager',
        editrecord: '',
        // control: (this.getAttributeId('adm_fullname')) ? 'input' : 'disabledinput',
        control: 'input',
        isAdvanceLookup: false,
        isComment: true,
        comment: '',
        isDisabled: false,
        AttributeName: 'adm_fullname'
      },
      // {
      //   name: 'Standby account owner',
      //   fkey: 'StandByAccountOwner',
      //   camunda_key: 'standbyaccountowner',
      //   // Id: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'SysGuid'])) ? data.StandByAccountOwner.SysGuid : '',
      //   // record: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'FullName'])) ? data.StandByAccountOwner.FullName : '',
      //   // old_val: (this.userdat.validateKeyInObj(data, ['StandByAccountOwner', 'FullName'])) ? data.StandByAccountOwner.FullName : '',
      //   editname: 'Standby account owner',
      //   editrecord: '',
      //   comment: '',
      //   control: 'searchinput',
      //   // control: (this.getAttributeId('standbyaccountowner_fullname')) ? 'searchinput' : 'disabledinput',
      //   // control: (this.getAttributeId('standbyaccountowner_fullname')) ? 'searchinput' : ((this.roleType == 3 && this.standByAccountOwner) ? 'searchinput' : 'disabledinput'),
      //   isAdvanceLookup: false,
      //   isComment: true,
      //   isDisabled: false,
      //   AttributeName: "standbyaccountowner_fullname",
      // }, 
      {
        name: 'Geo',
        fkey: 'Geo',
        camunda_key: 'geography',
        payloadKey: 'Geo',
        // Id: (data.Geo && data.Geo.SysGuid && data.Geo.SysGuid != 'NA') ? data.Geo.SysGuid : '',
        record: '',
        // old_val: (data.Geo && data.Geo.Name) ? data.Geo.Name : '',
        editname: 'Geo',
        editrecord: '',
        // control: (this.getAttributeId('geo_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        control: 'searchinput', //searchinput
        isDisabled: true,
        comment: '',
        AttributeName: "geo_name",
        isRequired: true,
        isOpened: false
      }, {
        name: 'Region',
        fkey: 'Region',
        camunda_key: 'region',
        payloadKey: 'Region',
        // Id: (data.Region && data.Region.SysGuid) ? data.Region.SysGuid : '',
        record: '',
        // old_val: (data.Region && data.Region.Name) ? data.Region.Name : '',
        editname: 'Region',
        editrecord: 'India',
        control: 'searchinput',
        // control: (this.getAttributeId('address_region_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_region_name",
        isRequired: true,
        isOpened: false
      },
      {
        name: 'Country',
        fkey: 'CountryReference',
        camunda_key: 'countryreference',
        payloadKey: 'CountryReference',
        // Id: (data.Region && data.CountryReference.SysGuid) ? data.CountryReference.SysGuid : '',
        record: '',
        // old_val: (data.CountryReference && data.CountryReference.Name) ? data.CountryReference.Name : '',
        editname: 'Country',
        editrecord: 'India',
        control: 'searchinput',
        // control: (this.getAttributeId('address_country_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_country_name",
        isRequired: true,
        isOpened: false
      },//chethana added as per Nov 26th vd kindly bind accordingly
      {
        name: 'Country sub-division',
        fkey: 'CountrySubDivisionReference',
        camunda_key: 'state',
        payloadKey: 'CountrySubDivisionReference',
        // Id: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.SysGuid) ? data.CountrySubDivisionReference.SysGuid : '',
        record: '',
        // old_val: (data.CountrySubDivisionReference && data.CountrySubDivisionReference.Name) ? data.CountrySubDivisionReference.Name : '',
        editname: 'Country sub-division',
        editrecord: 'India',
        control: 'searchinput',
        // control: (this.getAttributeId('address_state_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_state_name",
        isOpened: false
      },//chethana added as per Nov 26th vd kindly bind accordingly
      {
        name: 'City region',
        fkey: 'CityRegionReference',
        camunda_key: 'CityRegionReference',
        payloadKey: 'CityRegionReference',
        // Id: (data.CityRegionReference && data.CityRegionReference.SysGuid) ? data.CityRegionReference.SysGuid : '',
        record: '',
        // old_val: (data.CityRegionReference && data.CityRegionReference.Name) ? data.CityRegionReference.Name : '',
        editname: 'City region',
        editrecord: 'India',
        control: 'searchinput',
        // control: (this.getAttributeId('address_city_name')) ? 'searchinput' : 'disabledinput',
        isAdvanceLookup: true,
        isComment: true,
        isDisabled: false,
        comment: '',
        AttributeName: "address_city_name",
        isOpened: false
      }

    ];
    this.engageDetails = [{
      name: 'Account category',
      fkey: 'AccountCategory',
      camunda_key: 'accountcategory',
      Id: '',// this.userdat.validateKeyInObj(data, ['AccountCategory', 'Id']) ? data.AccountCategory.Id : '',
      vals: '',//(this.userdat.validateKeyInObj(data, ['AccountCategory', 'Value'])) ? data.AccountCategory.Value : '',
      record: '',
      // old_val: (this.userdat.validateKeyInObj(data, ['AccountCategory', 'Value'])) ? data.AccountCategory.Value : '',
      editname: 'Account category',
      editvals: 'India',
      control: 'dropdown',
      // control: (this.getAttributeId('accountcategory_value')) ? 'dropdown' : 'disabledinput',
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
      Id: false,//(data.IsGovAccount) ? true : false,
      // vals: (data.IsGovAccount) ? 'Yes' : 'No',
      // old_val: (data.IsGovAccount) ? 'Yes' : 'No',
      editname: 'Government account',
      editvals: 'India',
      control: 'radiobutton',
      // control: (this.getAttributeId('isgovaccount')) ? 'radiobutton' : 'disabledradiobutton',
      isDisabled: false,
      isComment: true,
      comment: '',
      AttributeName: "isgovaccount",
    }, {
      name: 'New age business',
      fkey: 'IsNewAgeBusiness',
      camunda_key: 'newagebusinessacc',
      Id: false, //(data.IsNewAgeBusiness) ? true : false,
      // vals: (data.IsNewAgeBusiness) ? 'Yes' : 'No',
      // old_val: (data.IsNewAgeBusiness) ? 'Yes' : 'No',
      editname: 'New age business',
      editvals: 'India',
      control: 'radiobutton',
      // control: (this.getAttributeId('isnewagebusiness')) ? 'radiobutton' : 'disabledradiobutton',
      isComment: false,
      isDisabled: false,
      comment: '',
      AttributeName: "isnewagebusiness",
      tooltip: "Marks the account as a New Age Business account to keep focus on these accounts. New Age Businesses are accounts which could be potential unicorns, and could soon be your top customers."
    },
    {
      name: 'Pursued opportunity scope/tenure/other remarks',
      fkey: 'PursuedopportunityRemarks',
      camunda_key: 'pursuedopportunityremarks',
      Id: '',
      // vals: data.PursuedopportunityRemarks || '',
      // old_val: data.PursuedopportunityRemarks || '',
      editname: 'Pursued opportunity scope/tenure/other remarks',
      editvals: 'India',
      control: 'textarea',
      // control: (this.getAttributeId('pursuedopportunityscoperemarks')) ? 'textarea' : 'disabledinput',
      isDisabled: false,
      isComment: false,
      comment: '',
      AttributeName: "pursuedopportunityscoperemarks",
      minlimit: -1000000000000000,
      maxlimit: 1000000000000000,
      datatype: 'string'
    }];
    this.creditDetails = [{
      // creditname: 'Credit (Delinquency) score',
      creditname: 'Market risk score',
      fkey: 'MarketRisk',
      camunda_key: 'marketrisk',
      Id: '',// data.MarketRisk && data.MarketRisk.Id ? data.MarketRisk.Id : '',
      // vals: data.MarketRisk && data.MarketRisk.Value ? data.MarketRisk.Value : '',
      // old_val: data.CreditScore ? data.CreditScore : '',
      // editcreditname: 'Credit (Delinquency) score',
      editcreditname: ' Market risk score',
      editcreditvals: '',
      control: 'dropdown', ////input
      // control: (this.getAttributeId('marketrisk')) ? 'dropdown' : 'disabledinput',
      isDisabled: false,
      comment: '',
      datatype: 'number',
      maxlength: 14,
      minlimit: 1,
      maxlimit: 900,
      AttributeName: "marketrisk",
      tooltip: "D&B's Marketing risk scores predict the likelihood of a firm paying in a severely delinquent manner (90+ days past terms) over the next 12 months"
    }
    ];

    this.swappingDetails = [

      {
        fkey: 'Owner',
        payloadKey: 'Owner',
        record: '',
        control: 'search',
        AttributeName: 'Owner',
        required: true,
        optionsSwitch: false,
        value: '',
        OwnerSource: '',
        placeholder: 'Search Owner',
        isRequired: true,
      },
      {
        control: 'toggleSwitch',
        fkey: 'swapaccount',
        AttributeName: 'Swap account',
        value: this.iswapaccount,
        tooltip: "Select an account that can be swapped with this Account request. Required if the Account owner's hunting ratio is >=8. A swap account is a Hunting account already present in Account master that needs to be moved out to make way for a new Hunting account. This is done to maintain the Hunting ratio for an Account owner"
      },
      {
        control: 'openPopup',
        fkey: 'swapAccountfield',
        payloadKey: 'swpaccount',
        AttributeName: 'Select account',
        value: '',
        record: '',
        required: false,
        placeholder: 'Select account to swap with',
        isdisable: false

      },

      {
        control: 'toggleSwitch',
        fkey: 'altswapaccount',
        AttributeName: 'Swap with alternate account owner',
        value: this.isaltswapaccount,
        tooltip: "If account for the requestor hunter cannot be swapped; then SE SPOC can swap account from some other hunter within SBU, to maintain the hunting ratio at BU level"
      },

      {
        control: 'search',
        fkey: 'alternativeOwner',
        payloadKey: 'alternativeOwner',
        record: '',
        AttributeName: ' Select alternative account owner',
        required: true,
        optionsSwitch: false,
        value: '',
        OwnerSource: this.customerContact,
        placeholder: 'Search alternative account owner'
      },
      {
        control: 'openPopup',
        fkey: 'alternativeSwapAccount',
        payloadKey: 'altswpaccount',
        AttributeName: 'Select alternative account',
        value: '',
        required: false,
        placeholder: 'Select account to swap with',
        isdisable: false

      },

    ]

  }
  showOverview() {
    this.overviewTab = true;
    this.allianceTab = false;
    this.accountTab = false;
    this.CustomerTab = false;
  }
  showAlliance() {
    this.overviewTab = false;
    this.allianceTab = true;
    this.accountTab = false;
    this.CustomerTab = false;
  }
  showAccount() {
    this.accountTab = true;
    this.overviewTab = false;
    this.allianceTab = false;
    this.CustomerTab = false;
  }
  showCustomer() {
    this.accountTab = false;
    this.overviewTab = false;
    this.allianceTab = false;
    this.CustomerTab = true;
  }

  getSbuByName(event, searchKey) {
    // console.log(dataArray);
    // dataArray[i]['message'] = '';
    // dataArray[i].data = [];

    this.sub_and_vertical = [];
    this.accountOverviewDropdown.SBU = [];
    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let subVerticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SubVertical');
    // if (searchKey == '' || event.type == 'keyup') {
    //   // this.clearFormValue(dataArray, formName, 'vertical');
    //   // this.clearFormValue(dataArray, formName, 'subvertical');
    //   // this.isActivityGroupSearchLoading = false;
    //   this.ownershipDetails[subIndex]['Id'] = '';
    //   this.ownershipDetails[verticalIndex]['Id'] = '';
    //   this.ownershipDetails[subVerticalIndex]['Id'] = '';
    //   let id = ['sbu', 'Vertical', 'SubVertical'];
    //   this.clearids(id)
    //   this.ownershipDetails[verticalIndex]['record'] = '';
    //   this.ownershipDetails[subVerticalIndex]['record'] = '';

    //   console.log(this.ownershipDetails);
    // }
    this.isActivityGroupSearchLoading = true;
    let sbubyname = this.masterApi.getSBUByName(searchKey)
    sbubyname.subscribe((res: any) => {
      this.sub_and_vertical = [];
      this.accountOverviewDropdown.SBU = [];
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        console.log("sbu response", res.ResponseObject)
        this.accountOverviewDropdown.SBU = res.ResponseObject;
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;

    })

    console.log("accountdetailes array", this.accountDetails)
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
    // if (searchKey == '' || event.type == 'keyup') {
    //   this.ownershipDetails[verticalIndex]['Id'] = '';
    //   this.ownershipDetails[subVerticalIndex]['Id'] = '';
    //   let id = ['Vertical', 'SubVertical'];
    //   this.clearids(id)
    //   this.ownershipDetails[subVerticalIndex]['record'] = '';
    // }
    this.isActivityGroupSearchLoading = true;

    if (this.ownershipDetails[subIndex]['Id'])
      // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
      vertical = this.masterApi.getVerticalbySBUID(this.ownershipDetails[subIndex]['Id'], searchKey)
    else
      vertical = this.masterApi.SearchVerticalAndSBU(searchKey)
    // let vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], searchKey)
    vertical.subscribe((res: any) => {
      this.sub_and_vertical = [];
      this.accountOverviewDropdown.Vertical = [];
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.advSub_and_vertical = res.ResponseObject;
        this.sub_and_vertical = res.ResponseObject;
        if (this.ownershipDetails[subIndex]['Id']) {
          // this.sub_and_vertical = res.ResponseObject;
          this.accountOverviewDropdown.Vertical = res.ResponseObject;
        }
        else {
          this.sub_and_vertical = res.ResponseObject;
          this.accountOverviewDropdown.Vertical = [];

          this.ownershipDetails[subIndex]['Id'] = '';
          // this.ownershipDetails[verticalIndex]['Id'] = '';
          let id = ['SubVertical'];
          this.clearids(id)
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
  }

  getSubVerticalByVertical(event, searchKey) {
    let subvertical;
    this.sub_and_vertical = [];
    this.accountOverviewDropdown.SubVertical = [];

    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let subVerticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SubVertical');

    // if (searchKey == '' || event.type == 'keyup') {
    //   this.ownershipDetails[subVerticalIndex]['Id'] = '';
    //   this.ownershipDetails[subVerticalIndex]['record'] = '';
    //   let id = ['SubVertical'];
    //   this.clearids(id)
    // }
    this.isActivityGroupSearchLoading = true;
    if (this.ownershipDetails[verticalIndex]['Id'])
      subvertical = this.masterApi.getSubVerticalByVertical(this.ownershipDetails[verticalIndex]['Id'], searchKey);
    else
      subvertical = this.masterApi.SearchAllBySubVertical(searchKey);
    subvertical.subscribe((res: any) => {
      this.sub_and_vertical = [];
      this.accountOverviewDropdown.SubVertical = [];
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.advSub_and_vertical = res.ResponseObject;
        this.sub_and_vertical = res.ResponseObject;
        if (this.ownershipDetails[verticalIndex]['Id']) {
          this.accountOverviewDropdown.SubVertical = res.ResponseObject;
        }
        else {


          // this.ownershipDetails[subIndex]['Id'] = '';
          // this.ownershipDetails[verticalIndex]['Id'] = '';

          // this.ownershipDetails[subIndex]['record'] = '';
          // this.ownershipDetails[verticalIndex]['record'] = '';

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


  }
  appendowner(item, arr) {
    switch (arr.fkey) {
      case 'Owner':
        {
          let ownerindex = this.swappingDetails.findIndex((obj => obj.fkey == 'Owner'))
          this.swappingDetails[ownerindex].record = item.FullName;
          this.accountcreationobj['Owner'] = item.SysGuid;
          return;
        }
      case 'alternativeOwner':
        {
          let altownerindex = this.swappingDetails.findIndex((obj => obj.fkey == 'alternativeOwner'))
          this.swappingDetails[altownerindex].record = item.FullName;
          this.accountcreationobj['alternativeOwner'] = item.SysGuid;
          return;
        }
    }
    console.log("owner data", item)
  }
  appendcurrency(item, arr) {
    switch (arr.fkey) {
      case 'currency':
        {
          let currencyindex = this.CustomDetails.findIndex((obj => obj.fkey == 'currency'))
          this.CustomDetails[currencyindex].record = this.getSymbol(item.Desc);
          this.accountcreationobj['currency'] = item.Id;
          this.isError['currency'] = false;
          return;
        }
    }
    console.log("owner data", item)
  }

  getPosts(formName, arr, option, key, dk, ind) {
    // debugger;
    arr.Id = option.SysGuid || option.Id;
    // arr[key] = option[dk];
    arr[key] = this.getdecodevalue(option[dk]);
    arr['prevValue']= arr[key];
    console.log(arr, option);
    console.log(this.sub_and_vertical, ind, key, this.location_temp);
    let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
    let geoIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Geo');
    let regionIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Region');
    let countryIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
    let stateIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountrySubDivisionReference');
    let clearArr = []
    let id = []
    switch (arr.fkey) {
      case 'SBU':
        {
          this.accountcreationobj['sbu'] = arr.Id;
          this.isError['SBU'] = false;
          clearArr = ['Vertical', 'SubVertical'];
          //  clearArr = ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          this.isError['SBU'] = false;
          id = ['Vertical', 'SubVertical'];
          this.clearids(id)
          return;
        }
      case 'Vertical':
        {
          // debugger;

          clearArr = ['SubVertical'];
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          this.isError['SBU'] = false;
          this.isError['Vertical'] = false;
          id = ['SubVertical'];
          this.clearids(id)
          this.accountcreationobj['Vertical'] = arr.Id;
          // if(option.isExists){
          //   this.isError['SubVertical'] = true;
          //   this.ownershipDetails['SubVertical']['isRequired'] = true;
          // }
          // else{
          //   this.isError['own_editable.fkey '] = false;
          //   this.ownershipDetails['SubVertical']['isRequired'] = false;
          // }
          this.accountcreationobj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
          this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
          this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';
          this.ownershipDetails[subIndex]['prevValue']  = this.ownershipDetails[subIndex]['record'];
          return;
        }
      case 'SubVertical':
        {
          this.isError['SBU'] = false;
          this.isError['Vertical'] = false;
          this.accountcreationobj['SubVertical'] = arr.Id;
          if (this.accountcreationobj['sbu'] == '') {
            this.accountcreationobj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
            this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
            this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';
            this.ownershipDetails[subIndex]['prevValue']  = this.ownershipDetails[subIndex]['record'];
          }

          this.accountcreationobj['Vertical'] = this.sub_and_vertical[ind]['Vertical']['Id'] || this.sub_and_vertical[ind]['Vertical']['SysGuid'] || '';



          this.ownershipDetails[verticalIndex]['Id'] = this.sub_and_vertical[ind]['Vertical']['Id'] || this.sub_and_vertical[ind]['Vertical']['SysGuid'] || '';
          this.ownershipDetails[verticalIndex]['record'] = this.sub_and_vertical[ind]['Vertical']['FullName'] || this.sub_and_vertical[ind]['Vertical']['Name'] || '';
          this.ownershipDetails[verticalIndex]['prevValue']  = this.ownershipDetails[verticalIndex]['record'];
          return;
        }
      case 'Geo':
        {
          clearArr = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
          id = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
          this.clearids(id)
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          this.accountcreationobj['Geo'] = arr.Id
          this.isError['Geo'] = false;
          return;
        }
      case 'Region':
        {
          clearArr = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          id = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
          this.clearids(id)
          this.accountcreationobj['Region'] = arr.Id;
          this.isError['Geo'] = false;
          this.isError['Region'] = false;
          if (this.location_temp && this.location_temp.length > 0) {
            this.accountcreationobj['Geo'] = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';

            this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
            console.log(this.ownershipDetails[geoIndex]);
            
            this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
   

          }
          return;
        }
      case 'CountryReference':
        {
          clearArr = ['CountrySubDivisionReference', 'CityRegionReference'];
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          id = ['CountrySubDivisionReference', 'CityRegionReference'];
          this.clearids(id)
          this.isError['Geo'] = false;
          this.isError['Region'] = false;
          this.isError['CountryReference'] = false;
          this.accountcreationobj['CountryReference'] = arr.Id
          if (this.location_temp && this.location_temp.length > 0) {
            this.accountcreationobj['Geo'] = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.accountcreationobj['Region'] = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';

            this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';


            this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
            this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';

            this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
            this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
     
            console.log(this.ownershipDetails[geoIndex]);
          }
          return;
        }
      case 'CountrySubDivisionReference':
        {
          clearArr = ['CityRegionReference'];
          this.clearHirarchyData(formName, clearArr, key, arr.fkey);
          id = ['CityRegionReference'];
          this.clearids(id)
          this.isError['Geo'] = false;
          this.isError['Region'] = false;
          this.isError['CountryReference'] = false;
          this.accountcreationobj['CountrySubDivisionReference'] = arr.Id;
          if (this.location_temp && this.location_temp.length > 0) {
            this.accountcreationobj['Geo'] = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.accountcreationobj['Region'] = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
            this.accountcreationobj['CountryReference'] = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';


            this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';


            this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
            this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';


            this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
            this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Country']['Name'] || this.location_temp[ind]['Country']['FullName'] || '';

            this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
            this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
            this.ownershipDetails[countryIndex]['prevValue'] = this.ownershipDetails[countryIndex][key];
            console.log(this.ownershipDetails[geoIndex]);
          }
          return;
        }
      case 'CityRegionReference':
        {
          this.accountcreationobj['CityRegionReference'] = arr.Id;
          if (this.location_temp && this.location_temp.length > 0) {
            this.accountcreationobj['Geo'] = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.accountcreationobj['Region'] = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
            this.accountcreationobj['CountryReference'] = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
            this.accountcreationobj['CountrySubDivisionReference'] = this.location_temp[ind]['State']['SysGuid'] || this.location_temp[ind]['State']['Id'] || '';

            this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
            this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
            this.isError['Geo'] = false;

            this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
            this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';
            this.isError['Region'] = false;

            this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
            this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Country']['Name'] || this.location_temp[ind]['Country']['FullName'] || '';
            this.isError['CountryReference'] = false;

            this.ownershipDetails[stateIndex].Id = this.location_temp[ind]['State']['SysGuid'] || this.location_temp[ind]['State']['Id'] || '';
            this.ownershipDetails[stateIndex][key] = this.location_temp[ind]['State']['Name'] || this.location_temp[ind]['State']['FullName'] || '';

            this.ownershipDetails[geoIndex]['prevValue'] = this.ownershipDetails[geoIndex][key];
            this.ownershipDetails[regionIndex]['prevValue'] = this.ownershipDetails[regionIndex][key];
            this.ownershipDetails[countryIndex]['prevValue'] = this.ownershipDetails[countryIndex][key];
            this.ownershipDetails[stateIndex]['prevValue'] = this.ownershipDetails[stateIndex][key];
            console.log(this.ownershipDetails[geoIndex]);
          }
          return;
        }
      case 'ParentAccount':
        {
          this.accountcreationobj['ParentAccount'] = arr.Id
          let parInd = this.accountDetails.findIndex(ow => ow.fkey == 'ParentAccount');
          this.accountDetails[parInd].record = this.getSymbol(arr['record']);
          this.getultimateparentbyparent(this.accountcreationobj['ParentAccount'])
          return;
        }
      case 'currency':
        {
          this.accountcreationobj['currency'] = arr.Id;
          this.isError['currency'] = false;
          return;
        }
      case 'Owner':
        {
          this.accountcreationobj['Owner'] = arr.Id;
          this.getHuntingCount('Owner', arr.Id, this.accountcreationobj['CountryReference']);
          this.getAllSwapAccount(arr.Id, this.accountcreationobj['CountryReference']);
          this.isError['Owner'] = false;
          return;
        }
      case 'alternativeOwner':
        {
          this.accountcreationobj['alternativeOwner'] = arr.Id;
          this.getHuntingCount('alternativeOwner', arr.Id, this.accountcreationobj['CountryReference']);
          this.getAltSwapAccount(arr.Id, this.accountcreationobj['CountryReference'], this.accountcreationobj['sbu'])
          return;
        }
      case 'Privateequaitity':
        {
          this.accountcreationobj['PrivateEquityAccount'] = arr.Id;
          this.isError['PrivateEquityAccount'] = false;
        }
    }
    // if(arr['fkey'] == 'ParentAccount'){
    //   console.log('came here',arr);
    //   let parInd = this.accountDetails.findIndex(ow => ow.fkey == 'ParentAccount');
    //   this.accountDetails[parInd].Id = arr['Id'];
    //   this.getultimteparentbyid(this.accountDetails[parInd].Id);
    // }
    // this.clearChildAdvanceSearch(arr, option.fkey, key);


    // if (this.sub_and_vertical && this.sub_and_vertical.length > 0) {

    //   let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
    //   let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');

    //   switch (arr.fkey) {
    //     case 'Vertical':
    //       {
    //         this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
    //         this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';
    //         return;
    //       }
    //     case 'SubVertical':
    //       {
    //         this.ownershipDetails[subIndex]['Id'] = this.sub_and_vertical[ind]['SBU']['Id'] || this.sub_and_vertical[ind]['SBU']['SysGuid'] || '';
    //         this.ownershipDetails[subIndex]['record'] = this.sub_and_vertical[ind]['SBU']['FullName'] || this.sub_and_vertical[ind]['SBU']['Name'] || '';

    //         this.ownershipDetails[verticalIndex]['Id'] = this.sub_and_vertical[ind]['Vertical']['Id'] || this.sub_and_vertical[ind]['Vertical']['SysGuid'] || '';
    //         this.ownershipDetails[verticalIndex]['record'] = this.sub_and_vertical[ind]['Vertical']['FullName'] || this.sub_and_vertical[ind]['Vertical']['Name'] || '';
    //         return;
    //       }
    //   }
    // }
    // if (this.location_temp && this.location_temp.length > 0) {


    //   let geoIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Geo');
    //   let regionIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Region');
    //   let countryIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
    //   let stateIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountrySubDivisionReference');

    //   console.log(arr.fkey, geoIndex);
    //   switch (arr.fkey) {
    //     case 'Region':
    //       {
    //         this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
    //         this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';
    //         console.log(this.ownershipDetails[geoIndex]);
    //         return;
    //       }
    //     case 'CountryReference':
    //       this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
    //       this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';

    //       this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
    //       this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';

    //       console.log(this.ownershipDetails[geoIndex]);
    //       return;
    //     case 'CountrySubDivisionReference':
    //       this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
    //       this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';

    //       this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
    //       this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';

    //       this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
    //       this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';

    //       console.log(this.ownershipDetails[geoIndex]);
    //       return;
    //     case 'CityRegionReference':
    //       this.ownershipDetails[geoIndex].Id = this.location_temp[ind]['Geo']['SysGuid'] || this.location_temp[ind]['Geo']['Id'] || '';
    //       this.ownershipDetails[geoIndex][key] = this.location_temp[ind]['Geo']['Name'] || this.location_temp[ind]['Geo']['FullName'] || '';

    //       this.ownershipDetails[regionIndex].Id = this.location_temp[ind]['Region']['SysGuid'] || this.location_temp[ind]['Region']['Id'] || '';
    //       this.ownershipDetails[regionIndex][key] = this.location_temp[ind]['Region']['Name'] || this.location_temp[ind]['Region']['FullName'] || '';

    //       this.ownershipDetails[countryIndex].Id = this.location_temp[ind]['Country']['SysGuid'] || this.location_temp[ind]['Country']['Id'] || '';
    //       this.ownershipDetails[countryIndex][key] = this.location_temp[ind]['Country']['Name'] || this.location_temp[ind]['Country']['FullName'] || '';

    //       this.ownershipDetails[stateIndex].Id = this.location_temp[ind]['State']['SysGuid'] || this.location_temp[ind]['State']['Id'] || '';
    //       this.ownershipDetails[stateIndex][key] = this.location_temp[ind]['State']['Name'] || this.location_temp[ind]['State']['FullName'] || '';

    //       console.log(this.ownershipDetails[geoIndex]);
    //       return;
    //   }
    // }
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

  selectedvalue(data) {
    //  debugger
    console.log("selected data", data)
    switch (data.fkey) {
      case 'Type':
        //debugger;
        this.accountcreationobj['Accounttype'] = data.Id
        let index1 = this.accountDetails.findIndex(own => own.fkey == 'accountClassification');
        this.accountDetails[index1]['Id'] = '';
        let index = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
        this.engageDetails[index]['Id'] = '';
        this.accountcreationobj['Accountclassification'] = '';
        this.accountcreationobj['AccountCategory'] = '';
        this.GetAccountClassificationByType(this.accountcreationobj['Accounttype']);
        this.accountOverviewDropdown.AccountCategory = [];
        this.Getaccountcategorybytypeandclassification(this.accountcreationobj['Accounttype'], '')
        if (data.Id != '') {
          this.isError['Type'] = false
        }
        if (data.Id == 3 || data.Id == 12 || data.Id == 1) {
          this.otherFieldsvalidation = true;
          let arr = ['SBU', 'Vertical', 'Geo', 'Region', 'CountryReference'];
          arr.forEach(item => {
            if (item != 'SBU' && !this.accountcreationobj[item]) {
              this.isError[item] = true;
            }
            else {
              if (item == 'SBU') {
                this.accountcreationobj['sbu'] ? this.isError['SBU'] = false : this.isError['SBU'] = false;
              }
              this.isError[item] = false;
            }
          })
          // this.isError['SBU'] = true;
          // this.isError['Vertical'] = true;
          // this.isError['Geo'] = true;
          // this.isError['Region'] = true;
          // this.isError['CountryReference'] = true;
        }
        else {
          this.otherFieldsvalidation = false;
          this.isError['SBU'] = false;
          this.isError['Vertical'] = false;
          this.isError['Geo'] = false;
          this.isError['Region'] = false;
          this.isError['CountryReference'] = false;
        }
        return;
      case 'accountClassification':
        let index2 = this.engageDetails.findIndex(own => own.fkey == 'AccountCategory');
        this.engageDetails[index2]['Id'] = '';
        this.accountcreationobj['AccountCategory'] = ''
        this.accountcreationobj['Accountclassification'] = data.Id
        this.Getaccountcategorybytypeandclassification(this.accountcreationobj['Accounttype'], this.accountcreationobj['Accountclassification'])
        return;
      case 'ProposedAccountType':
        this.accountcreationobj['ProposedAccountType'] = data.Id
        return;
      case 'Proposedaccountclassification':
        this.accountcreationobj['Proposedaccountclassification'] = data.Id
        return;
      case 'MarketRisk':
        this.accountcreationobj['MarketRisk'] = data.Id
        return;
      case 'AccountCategory':
        this.accountcreationobj['AccountCategory'] = data.Id
        return;
      case 'LifeCycleStage':
        this.accountcreationobj['LifeCycleStage'] = data.Id
        return;
      case 'RevenueCategory':
        this.accountcreationobj['RevenueCategory'] = data.Id
        return;
      case 'GrowthCategory':
        this.accountcreationobj['GrowthCategory'] = data.Id
        return;
      case 'CoverageLevel':
        this.accountcreationobj['CoverageLevel'] = data.Id
        return;
      case 'RelationShipStatus':
        this.accountcreationobj['RelationShipStatus'] = data.Id
        return;
      case 'EntityType':
        this.accountcreationobj['EntityType'] = data.Id
        return;
      case 'OwnershipType':
        this.accountcreationobj['OwnershipType'] = data.Id
        return;
      case 'RelationShipType':
        this.accountcreationobj['RelationShipType'] = data.Id
        return;
    }

  }
  getClassforOwner(key) {
    if (key == 'Owner') {
      if (this.huntingRatio >= 8 && this.huntingRatio != undefined && this.huntingRatio != '') {
        return 'customized-input1';
      }
      else if (this.huntingRatio < 8 && this.huntingRatio != undefined && this.huntingRatio != '') {
        return 'customized-input2';
      }
      else if (this.huntingRatio === 0) {
        return 'customized-input2';
      }
      else { }
    }
    else if (key == 'alternativeOwner') {
      if (this.althuntingRatio >= 8 && this.althuntingRatio != undefined && this.althuntingRatio != '') {
        return 'customized-input1';
      }
      else if (this.althuntingRatio < 8 && this.althuntingRatio != undefined && this.althuntingRatio != '') {
        return 'customized-input2';
      }
      else if (this.althuntingRatio === 0) {
        return 'customized-input2';
      }
      else { }
    }
    else { }
  }
  getparentaccount(event, keyword) {
    this.isActivityGroupSearchLoading = true;
    let parentaccount = this.masterApi.getparentaccount(keyword)
    parentaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      console.log("parentaccount ", res)
      this.accountOverviewDropdown.ParentAccount = res.ResponseObject;
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
    })
  }
  getdata(fkey) {
    if (fkey == 'accountname') {
      let ind = this.accountDetails.findIndex((obj => obj.fkey == 'accountname'))
      let value = this.accountDetails[ind].record
      if (!this.accountcreationobj['UltimateParentaccount']) {
        let ind1 = this.accountDetails.findIndex((obj => obj.fkey == 'UltimateParentaccount'))
        this.accountDetails[ind1].values = value
      }

    }
    if (fkey == 'Legalentityname') {
      let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Legalentityname'))
      let value = this.accountDetails[ind].record
      let ind1 = this.accountDetails.findIndex((obj => obj.fkey == 'accountname'))
      this.accountDetails[ind1].record = value
      if (!value) {
        this.isError['accountname'] = true
      }
      else {
        this.isError['accountname'] = false
      }
    }
  }

  getultimateparentbyparent(id) {
    this.masterApi.getUltimateParentByParent(id).subscribe((res: any) => {
      // test the load
      console.log("response of ultimate parent by parent", res.ResponseObject);
      if (!res.IsError) {
        let ind = this.accountDetails.findIndex((obj => obj.fkey == 'UltimateParentaccount'))
        this.accountDetails[ind].values = res.ResponseObject[0].UltimateParentAccount.Name
        this.accountcreationobj['UltimateParentaccount'] = res.ResponseObject[0].UltimateParentAccount.SysGuid
        console.log("ultimate patrent sysguid", this.accountcreationobj['UltimateParentaccount'])
        // this.accountOverviewDropdown.UltimateParentaccount = res.ResponseObject[0].UltimateParentAccount.Name
      }

    });
  }


  getHuntingCount(fkey, SysGuid, CountryGuid) {
    this.masterApi.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        if (fkey == 'Owner') {
          this.huntingRatio = res['ResponseObject'];
          console.log(this.huntingRatio);
          if (this.huntingRatio <= 0) {
            this.disableswaptoggle = true;
          } else {
            if (this.huntingRatio > 8) {
              this.disablealtswaptoggle = false;
            }
            else {
              this.disablealtswaptoggle = true;
            }
            this.disableswaptoggle = false;
          }
        }
        if (fkey == 'alternativeOwner') {
          this.althuntingRatio = res['ResponseObject'];
          console.log(this.althuntingRatio);
          if (this.althuntingRatio <= 0) {
            this.disablealtswaptoggle = true;
          }
        }
      }
    });
  }

  getcurrency(event) {
    this.isActivityGroupSearchLoading = true;
    let getcurrencyaccount = this.masterApi.getcurrencyaccount(event);
    getcurrencyaccount.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        console.log("getcurrency data", res.ResponseObject)
        this.accountOverviewDropdown.currency = res.ResponseObject;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        this.advLookupCurrency = res.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Desc) });
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
    });
    // }
  }
  getGeo(event, keyword) {
    this.accountOverviewDropdown.Region = [];
    this.accountOverviewDropdown.Geo = [];
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.isActivityGroupSearchLoading = true;
    let getGeo = this.masterApi.getgeobyname(keyword)
    getGeo.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      this.accountOverviewDropdown.Geo = res.ResponseObject
    })
    this.accountOverviewDropdown.Region = [];
    this.accountOverviewDropdown.Geo = [];
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    if (keyword == "" || event.type == 'keyup') {
      // this.clearHirarchyData(this.ownershipDetails, ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record', 'Geo');
    }

    if (keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record', 'Geo');
      }

      let postObj = {
        key: 'geo', keyword: keyword,
        parentsIds: []
      };
      this.isActivityGroupSearchLoading = true;
      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        this.isActivityGroupSearchLoading = false;
        console.log("regionByGeo", result);
        this.accountOverviewDropdown.Region = [];
        this.accountOverviewDropdown.Geo = [];
        this.accountOverviewDropdown.CountryReference = [];
        this.accountOverviewDropdown.CountrySubDivisionReference = [];
        if (!result.IsError && result.ResponseObject) {
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
          this.accountOverviewDropdown.Geo = result.ResponseObject;
        }
      });
    }
  }
  RegionByGeo(event, keyword) {
    this.accountOverviewDropdown.Region = [];
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CityRegionReference = [];
    this.isActivityGroupSearchLoading = true;
    // if (this.accountcreationobj['Geo'] != '') {
    //   let regionbygeo = this.masterApi.getregionbygeo(this.accountcreationobj['Geo'], keyword)
    //   regionbygeo.subscribe((res: any) => {
    //     this.isActivityGroupSearchLoading = false;
    //     this.accountOverviewDropdown.Region = res.ResponseObject
    //   })
    // }
    this.location_temp = [];
    this.accountOverviewDropdown.Region = [];
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record', 'Region');
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
        this.isActivityGroupSearchLoading = false;
        console.log("regionByGeo", result);
        if (!result.IsError && result.ResponseObject) {
          this.accountOverviewDropdown.Region = [];
          this.accountOverviewDropdown.CountryReference = [];
          this.accountOverviewDropdown.CountrySubDivisionReference = [];
          this.accountOverviewDropdown.CityRegionReference = [];
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
  CountryByRegion(event, keyword) {
    // this.accountOverviewDropdown.CountryReference = [];
    // this.accountOverviewDropdown.CountrySubDivisionReference = [];
    // this.accountOverviewDropdown.CityRegionReference=[];
    // let countrybyregion = this.masterApi.CountryByRegion( this.accountcreationobj['Region'],keyword)
    // countrybyregion.subscribe((res:any) => {
    //   this.accountOverviewDropdown.CountryReference = res.ResponseObject
    // })
    let regionindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'Region');
    this.accountOverviewDropdown.CountryReference = [];
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CityRegionReference = [];
    this.isActivityGroupSearchLoading = true;
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'], 'record', 'CountryReference');
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
        this.isActivityGroupSearchLoading = false;
        if (!result.IsError && result.ResponseObject) {
          this.accountOverviewDropdown.CountryReference = [];
          this.accountOverviewDropdown.CountrySubDivisionReference = [];
          this.accountOverviewDropdown.CityRegionReference = [];
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
          this.advlocation_temp = result.ResponseObject;
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
  CountrySubDivisionByCountry(event, keyword) {
    // this.accountOverviewDropdown.CountrySubDivisionReference = [];
    // this.accountOverviewDropdown.CityRegionReference=[];
    // let statebycountry = this.masterApi.getStateByCountry( this.accountcreationobj['CountryReference'],keyword)
    // statebycountry.subscribe((res:any) => {
    //   this.accountOverviewDropdown.CountrySubDivisionReference = res.ResponseObject
    // })
    console.log(keyword, event);
    this.accountOverviewDropdown.CountrySubDivisionReference = [];
    this.accountOverviewDropdown.CityRegionReference = [];
    let countryindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
    
    this.isActivityGroupSearchLoading = true;
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {
    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CountrySubDivisionReference', 'CityRegionReference'], 'record', 'CountrySubDivisionReference');
      }

      let postObj = {
        key: 'state', keyword: keyword,
        parentsIds: {
          'country': countryindex != -1 && this.ownershipDetails[countryindex].Id ? this.ownershipDetails[countryindex].Id : ''
        }
      };

      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      orginalArray.subscribe(result => {
        this.isActivityGroupSearchLoading = false;
        console.log("regionByGeo", result);
        if (!result.IsError && result.ResponseObject) {
          this.accountOverviewDropdown.CountrySubDivisionReference = [];
          this.accountOverviewDropdown.CityRegionReference = [];
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
          this.advlocation_temp = result.ResponseObject;
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
  CityByState(event, keyword) {
    // this.accountOverviewDropdown.CityRegionReference=[];
    // let statebycountry = this.masterApi.getCityByState( this.accountcreationobj['CountrySubDivisionReference'],keyword)
    //  statebycountry.subscribe((res:any) => {
    //   this.accountOverviewDropdown.CityRegionReference = res.ResponseObject
    // })
    this.accountOverviewDropdown.CityRegionReference = [];
    let countryindex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountryReference');
    let CountrySubDivisionReferenceIndex = this.ownershipDetails.findIndex(ow => ow.fkey == 'CountrySubDivisionReference');
    this.isActivityGroupSearchLoading = true;
    if (!this.userdat.searchFieldValidator(keyword) && keyword != '') {

    }
    else {
      if (keyword == "" || event.type == 'keyup') {
        // this.clearHirarchyData(this.ownershipDetails, ['CityRegionReference'], 'record', 'CityRegionReference');
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
        this.accountOverviewDropdown.CityRegionReference = [];
        this.isActivityGroupSearchLoading = false;
        console.log("regionByGeo", result);

        if (!result.IsError && result.ResponseObject) {
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';

          this.advlocation_temp = result.ResponseObject;
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
  isgovernament(event, data) {
    console.log("fkey", data.fkey, event)
    switch (data.fkey) {
      case 'IsGovAccount':
        {
          this.IsGovAccount = event.value
          return;
        }
      case 'IsNewAgeBusiness':
        {
          this.IsNewagebusiness = event.value
          return;
        }
    }
  }
  privateequitityowned(event, data) {
    console.log("fkey", data.fkey, event)
    this.IsPrivateEquityOwned = event.value
    console.log("account details", this.accountDetails);

    if (event.value == false) {
      let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Privateequaitity'))
      this.accountDetails[ind].isDisabled = true;
      this.accountDetails[ind].isRequired = false;
      this.accountDetails[ind].record = ''
      this.accountDetails[ind].control = 'disabledinput'
      this.accountcreationobj['PrivateEquityAccount'] = ''
      this.isactive = false;
    }
    if (event.value == true) {
      let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Privateequaitity'))
      this.accountDetails[ind].isDisabled = false;
      this.accountDetails[ind].isRequired = true;
      this.accountDetails[ind].control = 'searchinput';
      this.isactive = true
    }

  }
  getprivateequitity(value) {
    debugger
    let reqbody = {
      "SearchText": value,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    let privateequaitity = this.masterApi.privateequaitity(reqbody)
    privateequaitity.subscribe((result: any) => {
      console.log("privatedata", result)
      // this.ownerdata = result.ResponseObject;
      this.accountOverviewDropdown['Privateequaitity'] = result.ResponseObject;
      this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      // console.log("privatedata", this.ownerdata)
    })
  }
  swapaccount(event, item) {
    console.log("swap account", event, item)
    if (item.fkey == 'swapaccount') {
      this.iswapaccount = event.checked
      console.log(this.iswapaccount)
      if (this.iswapaccount == true) {
        this.isError['swapAccountfield'] = true;
        this.isaltswapaccount = false;
        this.isError['alternativeOwner'] = false;
        this.isError['alternativeSwapAccount'] = false;
      }
      else {
        this.isError['swapAccountfield'] = false;
      }
    }
    else if (item.fkey == 'altswapaccount') {
      this.isaltswapaccount = event.checked
      if (this.isaltswapaccount == true) {
        this.isError['alternativeOwner'] = true;
        this.isError['alternativeSwapAccount'] = true;
        this.isError['swapAccountfield'] = false;
      }
      else {
        this.isError['alternativeOwner'] = false;
        this.isError['alternativeSwapAccount'] = false;
      }
    }
    if (!this.iswapaccount) {
      let ind = this.swappingDetails.findIndex((obj => obj.fkey == 'swapAccountfield'));
      this.swappingDetails[ind].record = '';
      this.accountcreationobj['swpaccount'] = '';
      this.isError['swapAccountfield'] = false;
    }
    if (!this.isaltswapaccount) {
      let ind = this.swappingDetails.findIndex((obj => obj.fkey == 'alternativeOwner'));
      this.swappingDetails[ind].record = '';
      let ind1 = this.swappingDetails.findIndex((obj => obj.fkey == 'alternativeSwapAccount'));
      this.swappingDetails[ind1].record = '';
      this.accountcreationobj['altswpaccount'] = '';
      this.accountcreationobj['alternativeOwner'] = '';
      this.isError['alternativeOwner'] = false;
      this.isError['alternativeSwapAccount'] = false;

    }

  }
  getaccountowner(value, type) {
    this.accountOverviewDropdown[type] = [];
    this.isActivityGroupSearchLoading = true;
    let accountowner = this.masterApi.AccountOwnerSearch(value)
    accountowner.subscribe((result: any) => {
      console.log("ownerdata", result)
      this.isActivityGroupSearchLoading = false;
      // this.ownerdata = result.ResponseObject;
      this.accountOverviewDropdown[type] = result.ResponseObject;
      this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      // console.log("ownerdat", this.ownerdata)
    })

  }
  getaltaccountowner(value, type) {
    this.accountOverviewDropdown[type] = [];
    this.isActivityGroupSearchLoading = true;
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": '',
      "SearchText": value,
      "Guid": this.accountcreationobj['sbu'] || '' //Pass SBU Guid here
    }
    const accountowner = this.masterApi.AlternateOwnerSearch(reqbody);
    // let accountowner = this.masterApi.AccountOwnerSearch(value)
    accountowner.subscribe((result: any) => {
      this.isActivityGroupSearchLoading = false;
      console.log("alt ownwr data", result)
      console.log("alt ownwr data2", result.ResponseObject)
      console.log("accountowner data", this.accountcreationobj['Owner'])
      const filteredresponse = result.ResponseObject.filter(val => {
        console.log("QQQQQQQQQ", val)

        return val.SysGuid !== this.accountcreationobj['Owner'];

      });
      // this.ownerdata = result.ResponseObject;
      console.log("filteredresponse", filteredresponse)
      this.accountOverviewDropdown[type] = filteredresponse;
      this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
      // console.log("ownerdat", this.ownerdata)
    })

  }
  // appendcustomer(item)
  // {
  //   debugger
  //   console.log("selected owner",item)
  // }

  keyWordSearch(event, keyword, fkey) {
    console.log(fkey);
    switch (fkey) {
      case 'SBU':
        this.getSbuByName(event, keyword);
        return;
      case 'Geo':
        this.getGeo(event, keyword);
        return;
      case 'Region':
        this.RegionByGeo(event, keyword);
        return;
      case 'CountryReference':
        this.CountryByRegion(event, keyword);
        return;
      case 'CountrySubDivisionReference':
        this.CountrySubDivisionByCountry(event, keyword);
        return;
      case 'CityRegionReference':
        this.CityByState(event, keyword);
        return;
      case 'ParentAccount':
        this.getparentaccount(event, keyword);
        return;
      case 'Owner':
        this.getaccountowner(keyword, 'Owner');
        return;
      case 'alternativeOwner':
        this.getaltaccountowner(keyword, 'alternativeOwner');
        return;
      case 'Vertical':
        this.getVerticalbySBUID(event, keyword);
        return;
      case 'SubVertical':
        this.getSubVerticalByVertical(event, keyword);
        return;
      case 'currency':
        this.getcurrency(keyword);
        return;
      case 'Privateequaitity':
        this.getprivateequitity(keyword)
        return;

    }


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
  getSymbol(data) {
    // console.log(data)
    // return this.accountListService.getSymbol(data);
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
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
          Id: data.Duns || '',
          Country: data.Country || '',
          City: data.City || '',
          Zipcode: data.ZipCode || '',
          Address: data.Address1 || '',
        }
      })
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

    const getaccounts = this.masterApi.SearchAccountInDNB(obj);
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
        this.Accountlookupdata.Norecordfoundtext = "Ensure that you have typed correct legal entity name"
      }
    });
  }


  restrictspace(fkey, e,modelvalue) {
    console.log("restrict space", e,"modelvalue",modelvalue)
    debugger;
    switch (fkey) {
      case 'Legalentityname':
        {
          let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Legalentityname'))
          console.log("legalentitih index", ind)
          let value = this.accountDetails[ind].record
         let data = value.trim()
         let data1 = modelvalue.trim()
          if (!data1.length)
          {
            e.target.value = '';
            this.accountDetails[ind].record = '';
           // e.preventDefault();
    
          }
           
          return;
        }
      case 'accountname':
        {
          let ind = this.accountDetails.findIndex((obj => obj.fkey == 'accountname'))
          console.log("legalentitih index", ind)
          let value = this.accountDetails[ind].record
          let data1 = modelvalue.trim()
          if (!data1.length)
          {
            e.target.value = '';
            this.accountDetails[ind].record = '';
           // e.preventDefault();
    
          }
          return;
        }
    }

  }

  // restrictspace1(e, value) {
  //   debugger
  //   console.log("restrict space", e)
  //   switch (value) {
  //     case 'legalentity':
  //       {
  //         if (e.which === 32 && !this.AccDetailsForm.value.legalentity.length)
  //           e.preventDefault();
  //         return;
  //       }
  //     case 'accountname':
  //       {
  //         this.AccDetailsForm.get('accountDetailName').valueChanges.subscribe(val => {
  //           if (val.trim() === "") {
  //             debugger
  //             this.AccDetailsForm.get('accountDetailName').patchValue('', { emitEvent: false })
  //           }
  //         })
  //         return;
  //       }
  //     case 'phone':
  //       {
  //         this.AccDetailsForm.get('phonenumber').valueChanges.subscribe(val => {
  //           if (val.trim() === "") {
  //             this.AccDetailsForm.get('phonenumber').patchValue('', { emitEvent: false })
  //           }
  //         })
  //         return;
  //       }
  //   }

  // }
  dnbdetailsbydunsid(id) {
    this.isLoading = true;
    const dnbdetails = this.masterApi.DNBDetailsByDunsId(id);
    dnbdetails.subscribe((res: any) => {
      if (!res.IsError && res.ResponseObject) {
        this.isLoading = false;
        // this.leadinfo = false;
        console.log("dnb account details ", res.ResponseObject);
        this.dnbdata = res.ResponseObject;

        //  this.editablefields = true;
        this.dnbbinding(this.dnbdata);

      }
      else if (res.IsError) {
        this.isLoading = false;
        console.log(" add error response ", res)
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }

    }, error => {
      this.isLoading = false;
      //   this.editablefields = false;
    });

  }
  clearformdata() {
    this.accountDetails.forEach((item) => {
      let val = item.fkey
      let ind = this.accountDetails.findIndex((obj => obj.fkey == val))
      this.accountDetails[ind].record = ''
      if (val == 'DUNSID' || 'ParentDUNSID' || 'ultparentDUNSID' || 'UltimateParentaccount') {
        this.accountDetails[ind].values = ''
      }
    });
    this.ownershipDetails.forEach((item) => {
      let val = item.fkey
      console.log("valu of fkey", val)
      let ind = this.ownershipDetails.findIndex((obj => obj.fkey == val))
      console.log("index value of account details ", ind)
      this.ownershipDetails[ind].record = ''
    });
    this.CustomDetails.forEach((item) => {
      let val = item.fkey
      console.log("valu of fkey", val)
      let ind = this.CustomDetails.findIndex((obj => obj.fkey == val))
      this.CustomDetails[ind].vals = ''
      if (val == "currency")
        this.CustomDetails[ind].record = ''

      console.log("index value of account details ", ind)
    });

    this.addressDetails.forEach((item) => {
      let val = item.fkey
      console.log("valu of fkey", val)
      let ind = this.addressDetails.findIndex((obj => obj.fkey == val))
      console.log("index value of account details ", ind)
      this.addressDetails[ind].vals = ''
    });
    this.trendsAnalysis.forEach((item) => {
      let val = item.fkey
      console.log("valu of fkey", val)
      let ind = this.trendsAnalysis.findIndex((obj => obj.fkey == val))
      console.log("index value of account details ", ind)
      this.trendsAnalysis[ind].vals = ''
    });
    this.IsPrivateEquityOwned = false
    let id = ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference', 'sbu', 'Vertical', 'SubVertical', 'ParentAccount', 'UltimateParentaccount', 'parentdunsname', 'DNBParentDuns', 'parentsdunsid', 'UltimateParentaccount', 'ultimateparentdunsname', 'DNBUltimateParentDuns', 'ultimateparentsdunsid', 'PrivateEquityAccount'];
    this.clearids(id)

    let ind = this.accountDetails.findIndex((obj => obj.fkey == 'Privateequaitity'))
    this.accountDetails[ind].isDisabled = true
    this.accountDetails[ind].control = 'disabledinput'
  }
  getindexvalue(arr, fkey) {
    this.indexvalue = arr.findIndex((obj => obj.fkey == fkey))
    console.log("index of array", this.indexvalue)
  }
  dnbbinding(data) {
    this.clearformdata()
    console.log("dnb data", data)

    // accout detailes page dnb data 
    if (data.Name != '' && data.Name != undefined) {
      this.getindexvalue(this.accountDetails, 'accountname')
      this.accountDetails[this.indexvalue].record = data.Name
      this.getindexvalue(this.accountDetails, 'Legalentityname')
      this.accountDetails[this.indexvalue].record = data.Name
      this.isError['Legalentityname'] = false;
      this.isError['accountname'] = false;
    }
    // if(data.LegalEntity != '' && data.LegalEntity != undefined)
    // {
    //   debugger

    // }
    if (data.DUNSID != '' && data.DUNSID != undefined) {
      this.getindexvalue(this.accountDetails, 'DUNSID')
      this.accountDetails[this.indexvalue].values = data.DUNSID.Name
      this.accountcreationobj['DUNSID'] = data.DUNSID.SysGuid
    }

    // parent and ultimate account binding 
    if (data.ParentAccount && data.ParentAccount.DNBParent) {
      this.getindexvalue(this.accountDetails, 'ParentAccount')
      this.accountDetails[this.indexvalue].record = data.ParentAccount.DNBParent
      this.accountcreationobj['parentdunsname'] = data.ParentAccount.DNBParent;
    }
    if (data.ParentAccount && data.ParentAccount.Name) {
      this.getindexvalue(this.accountDetails, 'ParentAccount')
      this.accountDetails[this.indexvalue].record = data.ParentAccount.DNBParent
      this.accountcreationobj['ParentAccount'] = data.ParentAccount.SysGuid;
    }
    if (data.ParentAccount && data.ParentAccount.DNBParentDuns) {
      // this.AccDetailsForm.controls['parentsdunsnumber'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.ParentAccount.DNBParentDuns) ? dnbaccountdetails.ParentAccount.DNBParentDuns : '');
      this.getindexvalue(this.accountDetails, 'ParentDUNSID')
      this.accountDetails[this.indexvalue].values = data.ParentAccount.DNBParentDuns
      this.accountcreationobj['DNBParentDuns'] = data.ParentAccount.DNBParentDuns

    }
    if (data.ParentAccount && data.ParentAccount.DUNSID) {
      this.getindexvalue(this.accountDetails, 'ParentDUNSID')
      this.accountDetails[this.indexvalue].values = data.ParentAccount.DUNSID.Name
      this.accountcreationobj['parentsdunsid'] = data.ParentAccount.DUNSID.SysGuid;
    }


    if (data.UltimateParentAccount && data.UltimateParentAccount.DNBUltimateParent) {
      this.getindexvalue(this.accountDetails, 'UltimateParentaccount')
      this.accountDetails[this.indexvalue].values = data.UltimateParentAccount.DNBUltimateParent
      this.accountcreationobj['ultimateparentdunsname'] = data.UltimateParentAccount.DNBUltimateParent;
    }

    if (data.UltimateParentAccount && data.UltimateParentAccount.Name) {
      this.getindexvalue(this.accountDetails, 'UltimateParentaccount')
      this.accountDetails[this.indexvalue].values = data.UltimateParentAccount.DNBUltimateParent
      this.accountcreationobj['UltimateParentaccount'] = data.UltimateParentAccount.SysGuid;
    }

    if (data.UltimateParentAccount && data.UltimateParentAccount.DNBUltimateParentDuns) {
      // this.AccDetailsForm.controls['ultimateparentsdunsnumber'].setValue((dnbaccountdetails.ParentAccount && dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns) ? dnbaccountdetails.UltimateParentAccount.DNBUltimateParentDuns : '');
      this.getindexvalue(this.accountDetails, 'ultparentDUNSID')
      this.accountDetails[this.indexvalue].values = data.UltimateParentAccount.DNBUltimateParentDuns
      this.accountcreationobj['DNBUltimateParentDuns'] = data.UltimateParentAccount.DNBUltimateParentDuns

    }
    if (data.UltimateParentAccount && data.UltimateParentAccount.DUNSID) {
      this.getindexvalue(this.accountDetails, 'ultparentDUNSID')
      this.accountDetails[this.indexvalue].values = data.UltimateParentAccount.DUNSID.Name
      this.accountcreationobj['ultimateparentsdunsid'] = data.UltimateParentAccount.DUNSID.SysGuid;
    }

    // if (data.UltimateParentAccount && data.UltimateParentAccount.DUNSID) {
    //   this.getindexvalue(this.accountDetails,'Number')
    //   this.accountDetails[this.indexvalue].values = data.UltimateParentAccount.DUNSID.Name
    //    this.accountcreationobj['ultimateparentsdunsid'] = data.UltimateParentAccount.DUNSID.SysGuid;
    //  }
    // company detailes dnb binding start  here 
    if (data.Currency != '' && data.Currency != undefined && data.Currency.Value !=undefined) {
      this.getindexvalue(this.CustomDetails, 'currency')
      this.CustomDetails[this.indexvalue].record = data.Currency.Value
      this.accountcreationobj['currency'] = data.Currency.Id
      this.isError['currency'] = false;
    }
    if (data.Contact != '' && data.Contact != undefined) {
      this.getindexvalue(this.CustomDetails, 'Contact')
      this.CustomDetails[this.indexvalue].vals = data.Contact.ContactNo
    }
    if (data.WebsiteUrl != '' && data.WebsiteUrl != undefined) {
      this.getindexvalue(this.CustomDetails, 'WebsiteUrl')
      this.CustomDetails[this.indexvalue].vals = data.WebsiteUrl
    }
    if (data.Email != '' && data.Email != undefined) {
      this.getindexvalue(this.CustomDetails, 'Email')
      this.CustomDetails[this.indexvalue].vals = data.Email
    }
    if (data.HeadQuarters != '' && data.HeadQuarters != undefined) {
      this.getindexvalue(this.CustomDetails, 'HeadQuarters')
      this.CustomDetails[this.indexvalue].vals = data.HeadQuarters
    }
    if (data.SicDescription != '' && data.SicDescription != undefined) {
      this.getindexvalue(this.CustomDetails, 'SIC')
      this.CustomDetails[this.indexvalue].vals = data.SicDescription
    }
    if (data.BusinessDescription != '' && data.BusinessDescription != undefined) {
      this.getindexvalue(this.CustomDetails, 'BusinessDescription')
      this.CustomDetails[this.indexvalue].vals = data.BusinessDescription
    }


    //address data binding

    if (data.Address != '' && data.Address != undefined) {
      debugger
      if (data.Address.Address1 != '' && data.Address.Address1 != undefined) {
        this.getindexvalue(this.addressDetails, 'Address1')
        this.addressDetails[this.indexvalue].vals = data.Address.Address1
      }
      if (data.Address.CityString != '' && data.Address.CityString != undefined) {
        this.getindexvalue(this.addressDetails, 'City')
        this.addressDetails[this.indexvalue].vals = data.Address.CityString
      }
      if (data.Address.CountryString != '' && data.Address.CountryString != undefined) {
        this.getindexvalue(this.addressDetails, 'Country')
        this.addressDetails[this.indexvalue].vals = data.Address.CountryString
      }
      if (data.Address.ZipCode != '' && data.Address.ZipCode != undefined) {
        this.getindexvalue(this.addressDetails, 'ZipCode')
        this.addressDetails[this.indexvalue].vals = data.Address.ZipCode
      }
      if (data.Address.Geo != '' && data.Address.Geo != undefined) {
        this.getindexvalue(this.ownershipDetails, 'Geo')
        this.ownershipDetails[this.indexvalue].record = data.Address.Geo.Name
        this.accountcreationobj['Geo'] = data.Address.Geo.SysGuid

      }
      if (data.Address.Region != '' && data.Address.Region != undefined) {
        this.getindexvalue(this.ownershipDetails, 'Region')
        this.ownershipDetails[this.indexvalue].record = data.Address.Region.Name
        this.accountcreationobj['Region'] = data.Address.Region.SysGuid

      }
      if (data.Address.Country != '' && data.Address.Country != undefined) {
        this.getindexvalue(this.ownershipDetails, 'CountryReference')
        this.ownershipDetails[this.indexvalue].record = data.Address.Country.Name
        this.accountcreationobj['CountryReference'] = data.Address.Country.SysGuid
      }

    }


    // treands and analysis binding starts here 

    if (data.FortuneRanking != '' && data.FortuneRanking != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'Forbes1000Rank')
      this.trendsAnalysis[this.indexvalue].vals = data.FortuneRanking
    }
    if (data.GrossProfit != '' && data.GrossProfit != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'Priofit')
      this.trendsAnalysis[this.indexvalue].vals = data.GrossProfit
    }
    if (data.EmployeeCount != '' && data.EmployeeCount != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'Employees')
      this.trendsAnalysis[this.indexvalue].vals = data.EmployeeCount
    }
    if (data.Revenue != '' && data.Revenue != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'Revenue')
      this.trendsAnalysis[this.indexvalue].vals = data.Revenue
    }
    if (data.OperatingMargin != '' && data.OperatingMargin != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'OperatingMargin')
      this.trendsAnalysis[this.indexvalue].vals = data.OperatingMargin
    }

    if (data.MarketValue != '' && data.MarketValue != undefined) {
      this.getindexvalue(this.trendsAnalysis, 'MarketValue')
      this.trendsAnalysis[this.indexvalue].vals = data.MarketValue
    }
    if (data.ReturnOnEquity != '' && data.ReturnOnEquity != undefined) {
      debugger
      this.getindexvalue(this.trendsAnalysis, 'ReturnOnEquity')
      this.trendsAnalysis[this.indexvalue].vals = data.ReturnOnEquity
    }

  }
  searchpayload = {
    SearchText: '',
    PageSize: 10,
    OdatanextLink: '',
    RequestedPageNumber: 1
  };
  getcountrycode(event) {
    const countrydetails = this.masterApi.getcountrycode(event)
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
        this.Accountlookupdata.Norecordfoundtext = "No Record Found in Dnb you can choose custom account creation "
      }
      else if (res.IsError) {
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
        //  this.Accountlookupdata.Norecordfoundtext = 'No Record found.ensure that you have typed correct leagl entity name.'
      }
      console.log("wipro accouts", this.wiproaccounts);
    })
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
  // shared D&B database popup
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
    IsCustomProspect: true,
    IsHorizontalScroll:true 
    // IsCustom: true
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
      // this.lookupdata.tabledata = [
      //   { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
      //   { AccountName: 'Alibaba.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Prospect', Owner: 'Rahul Dudeja', Region: 'India' },
      //   { AccountName: 'Amazon.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Rahul  Jain', Region: 'USA' },
      //   { AccountName: 'Apple.india', Number: 'AC8090219392', Vertical: 'MFG', Type: 'Prospect', Owner: 'Ravu Kumar', Region: 'USA' },
      //   { AccountName: 'Alibaba.china', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'China' },
      //   { AccountName: 'Google.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
      //   { AccountName: 'Tesla.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' },
      //   { AccountName: 'Alphabet.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'India' },
      //   { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' }
      // ]

    })

    dialogRef.afterClosed().subscribe((data) => {
      this.Accountlookupdata.tabledata = [];
      this.Accountlookupdata.headerdata = [
        { name: 'AccountName', title: 'Account name' },
        { name: 'Number', title: 'Number' },
        { name: 'Vertical', title: 'Vertical' },
        { name: 'Type', title: 'Type' },
        { name: 'Owner', title: 'Owner' },
        { name: 'Region', title: 'Region' },]
      console.log("afterclose data emitted", data)
      debugger;
      this.searchpayload = {
        SearchText: '',
        PageSize: 10,
        OdatanextLink: '',
        RequestedPageNumber: 1
      };
      if (data.action == 'route') {
        console.log("iscustom is true")
        //  fkey: 'Legalentityname',
        let index = this.accountDetails.findIndex((obj => obj.fkey == 'Legalentityname'))
        this.accountDetails[index].control = 'input'
        this.accountDetails[index].placeholder = 'Enter legal entity name'

        this.clearformdata()
        this.isactive = false

        this.parentflag = localStorage.getItem('parentflag')
        this.parentdetails = JSON.parse(localStorage.getItem('parentdetailes'))
        if (this.parentflag) {
          let index = this.accountDetails.findIndex((obj => obj.fkey == 'ParentAccount'))
          this.accountDetails[index].record = this.parentdetails.parentaccountname
          this.accountcreationobj['ParentAccount'] = this.parentdetails.parentsysguid
          let index1 = this.accountDetails.findIndex((obj => obj.fkey == 'UltimateParentaccount'))
          this.accountDetails[index1].values = this.parentdetails.ultimateparentname
          this.accountcreationobj['UltimateParentaccount'] = this.parentdetails.ultimateparentguid
          console.log("parent account details @@@@@@@@@@@@@@@", this.parentdetails)

        }
        console.log("index", this.accountDetails[index])
      }

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

          this.accountcreationobj['ParentAccount'] = res.parentsysguid
          let ind = this.accountDetails.findIndex((obj => obj.fkey == 'ParentAccount'))
          this.accountDetails[ind].record = res.parentaccountname;
          this.getultimateparentbyparent(this.accountcreationobj['ParentAccount'])

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
        console.log("prospectdata", data.selectedData[0])
        // this.isprospectexist = true
        // this.prospectSysGuid = data.selectedData[0].Id
        // this.accountCreationObj['prospectaccount'] = this.prospectSysGuid
        // localStorage.setItem('prospectaccountid', this.prospectSysGuid)
        // getprospectid() {
        //   this.accountListService.getProspectGuid().subscribe((res: any) => {
        //     this.prospectsysguid = res;
        //     this.getprospectdetails(this.prospectsysguid);
        //   });
        // }
        this.getprospectdetails(data.selectedData[0].Id)
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
              { name: 'Address', title: 'Address' },]
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
        // 'SysGuid': this.loggedUser
      }

    };
    //  this.accountCreationObj['prospectid'] = id 
    console.log('prospectid', id)
    this.accountListService.getAccountOverviewDetails(reqbody).subscribe((res: any) => {
      console.log("prospects account data recived", res);
      if (!res.IsError && res.ResponseObject) {
        this.isLoading = false;
        //   this.leadinfo = false;
        //   this.prospectaccountdata = res.ResponseObject;
        // console.log("dnb account details ", res.ResponseObject);
        //    this.editablefields = true;
        // this.prospectAccountDetails(this.prospectaccountdata);
      }
    });
  }

  //api binding for proposedaccount type 

  GetProposedAccountType() {
    let proposedaccounttype = this.masterApi.GetProposedAccountType()
    proposedaccounttype.subscribe(data => {
      console.log("getproposedaccounttype", data)
      this.accountOverviewDropdown.ProposedAccountType = data.ResponseObject
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", this.accountData)
    })
  }
  GetProposedAccountClassification() {
    let proposedaccountclassification = this.masterApi.GetProposedAccountClassification()
    proposedaccountclassification.subscribe(data => {
      console.log("getproposedaccountclassification data", data)
      this.accountOverviewDropdown.Proposedaccountclassification = data.ResponseObject;
    })
  }
  GetAccountType() {
    let accountTypeDropdown = [];
    let accounttype = this.masterApi.GetAccountType()
    accounttype.subscribe(data => {
      console.log("account type", data)
      data.ResponseObject.filter(x => {
        if (x.Id != 2) {
          accountTypeDropdown.push(x)
        }
      });
      console.log(accountTypeDropdown);
      // this.accountOverviewDropdown.Type = data.ResponseObject
      this.accountOverviewDropdown.Type = accountTypeDropdown;
    })
  }
  GetAccountClassificationByType(id) {
    let accountclassificationbytype = this.masterApi.GetAccountClassificationByType(id, '')
    accountclassificationbytype.subscribe(data => {
      console.log("accountclassificationbytype", data)
      this.accountOverviewDropdown.accountClassification = data.ResponseObject
    })
  }
  Getaccountcategorybytypeandclassification(id, classificationid) {
    let accountcategorybytypeandclassification = this.masterApi.getCategoryByTypeandClassification(id, '', classificationid)
    accountcategorybytypeandclassification.subscribe(data => {
      console.log("accountclassificationbytype", data)
      this.accountOverviewDropdown.AccountCategory = data.ResponseObject
    })
  }

  goback() {
    this.router.navigate(['/accounts/accountlist/farming']);
    localStorage.removeItem('parentdetailes');
    localStorage.removeItem('parentflag');
  }
  // GetAccountCategory()
  // {
  //   let proposedaccountclassification = this.masterApi.GetAccountCategory()
  //   proposedaccountclassification.subscribe(data => {console.log("GetAccountCategory data",data)
  //   this.accountOverviewDropdown.AccountCategory = data.ResponseObject
  // }) 
  // }
  GetMarketRisk() {
    let proposedaccountclassification = this.masterApi.GetMarketRisk()
    proposedaccountclassification.subscribe(data => {
      console.log("GetAccountCategory data", data)
      this.accountOverviewDropdown.MarketRisk = data.ResponseObject
    })
  }
  // Account structure related apis //////////////////////////
  getLifeCycleStage() {
    this.masterApi.GetAccountLifeCycleStage().subscribe(result => {
      console.log("AccountLifeCycleStage", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.LifeCycleStage = result.ResponseObject;
      }
    });
  }
  getRevenueCategory() {
    this.masterApi.GetRevenueCategory().subscribe(result => {
      console.log("RevenueCategor", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.RevenueCategory = result.ResponseObject;
      }
    });
  }

  getGrowthCategory() {
    this.masterApi.GetGrowthCategory().subscribe(result => {
      console.log("GrowthCategory", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.GrowthCategory = result.ResponseObject;
      }
    });
  }
  getCoverageLevel() {
    this.masterApi.GetCoverageLevel().subscribe(result => {
      console.log("CoverageLevel", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.CoverageLevel = result.ResponseObject;
      }
    });
  }
  getAccountRelationShipStaatus() {
    this.masterApi.GetAccountRelationShipStatus().subscribe(result => {
      console.log("AccountRelationShipStatus", result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.RelationShipStatus = result.ResponseObject;
      }
    });
  }
  getEntity() {
    this.masterApi.getEntityType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.EntityType = result.ResponseObject;
      }
    })
  }
  getownershiptype() {
    this.masterApi.getProspectOwnerShipType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.accountREDropdown.OwnershipType = result.ResponseObject;
      }
    })
  }
  getRelationShipType() {
    this.masterApi.GetAccountRelationShipType().subscribe(result => {
      console.log("relationship type", result);
      if (!result.IsError && result.ResponseObject) {
        this.vendorDropdown.RelationShipType = result.ResponseObject;
      }
    });
  }

  // Account structure  tab data start
  sapdetailsdata = [{
    'SAPCustomerName': 'Customer name',
    'SAPCustomerNumber': '0842809384929',
    'SAPCompanyCode': '208030985',
    'SAPGeo': 'Geo name',
    'SAPGroupCustomerName': 'Group name',
    'Extended': '00',
    'CreatedOn': '00',

  },
  {
    'SAPCustomerName': 'Customer name',
    'SAPCustomerNumber': '0842809384929',
    'SAPCompanyCode': '208030985',
    'SAPGeo': 'Geo name',
    'SAPGroupCustomerName': 'Group name',
    'Extended': '00',
    'CreatedOn': '00',
  },
  {
    'SAPCustomerName': 'Customer name',
    'SAPCustomerNumber': '0842809384929',
    'SAPCompanyCode': '208030985',
    'SAPGeo': 'Geo name',
    'SAPGroupCustomerName': 'Group name',
    'Extended': '00',
    'CreatedOn': '00',
  },
  ];

  Accstructure = [{
    name: 'Account life cycle stage',
    fkey: 'LifeCycleStage',
    camunda_key: 'lifecyclestage',
    Id: '',// (this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Id'])) ? data.LifeCycleStage.Id : null,//'',
    vals: '',// (this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Value'])) ? data.LifeCycleStage.Value : '',
    old_val: '',//(this.userdat.validateKeyInObj(data, ['LifeCycleStage', 'Value'])) ? data.LifeCycleStage.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
    AttributeName: "lifecyclestage_value",
    comment: '',
    minlimit: -1000000000000000,
    maxlimit: 100000000000000,
    datatype: 'number'
  }, {
    name: ' Revenue category ($Mn) ',
    fkey: 'RevenueCategory',
    camunda_key: 'revenueinmn',
    Id: '',// (this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Id'])) ? data.RevenueCategory.Id : null,
    vals: '',//(this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Value'])) ? data.RevenueCategory.Value : '',
    old_val: '',//(this.userdat.validateKeyInObj(data, ['RevenueCategory', 'Value'])) ? data.RevenueCategory.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
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
    Id: '',// (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Id'])) ? data.GrowthCategory.Id : null,
    vals: '',// (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Value'])) ? data.GrowthCategory.Value : '',
    old_val: '',// (this.userdat.validateKeyInObj(data, ['GrowthCategory', 'Value'])) ? data.GrowthCategory.Value : '',

    control: 'dropdown',
    isDisabled: false,
    isComment: false,
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
    Id: '',//(this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Id'])) ? data.CoverageLevel.Id : null,
    vals: '',// (this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Value'])) ? data.CoverageLevel.Value : '',
    old_val: '',// (this.userdat.validateKeyInObj(data, ['CoverageLevel', 'Value'])) ? data.CoverageLevel.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
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
    Id: '',// (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Id'])) ? data.RelationShipStatus.Id : null,
    vals: '',// (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Value'])) ? data.RelationShipStatus.Value : '',
    old_val: '',// (this.userdat.validateKeyInObj(data, ['RelationShipStatus', 'Value'])) ? data.RelationShipStatus.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
    comment: '',
    AttributeName: "relationshipstatus_value",
  },
  // {
  //   name: 'Organization type',
  //   fkey: 'OwnershipType',
  //   camunda_key: 'organizationtype',
  //   Id:'',// (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Id'])) ? data.OrganizationType.Id : null,
  //   vals:'',// (this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',
  //   old_val: '',//(this.userdat.validateKeyInObj(data, ['OrganizationType', 'Value'])) ? data.OrganizationType.Value : '',

  //   isDisabled: false,
  //   control: 'dropdown' ,
  //   isComment: false,
  //   comment: '',
  //   AttributeName: "organizationtype_value",
  // },
  //chethana added entity type Aug 30th
  {
    name: 'Entity type',
    fkey: 'EntityType',
    camunda_key: 'entitytype',
    Id: '',// (this.userdat.validateKeyInObj(data, ['EntityType', 'Id'])) ? data.EntityType.Id : null,
    vals: '',//(this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',
    old_val: '',// (this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
    comment: '',
    AttributeName: "entitytype_value",
    tooltip: "The types Subsidiary and Branch must always have a Parent account."
  },
  {
    name: 'Ownership Type',
    fkey: 'OwnershipType',
    camunda_key: 'entitytype',
    Id: '',// (this.userdat.validateKeyInObj(data, ['EntityType', 'Id'])) ? data.EntityType.Id : null,
    vals: '',//(this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',
    old_val: '',// (this.userdat.validateKeyInObj(data, ['EntityType', 'Value'])) ? data.EntityType.Value : '',

    isDisabled: false,
    control: 'dropdown',
    isComment: false,
    comment: '',
    AttributeName: "entitytype_value",
    tooltip: "The Ownership Type indicates the type of legal or structural entity of the CRM account"

  }];
  // Account structure tab data end 

  // customer details tab data start 
  CustomDetails = [{
    name: 'Currency',
    fkey: 'currency',
    camunda_key: 'currency',
    payloadKey: 'currency',
    Id: '',
    vals: '',
    old_val: '',
    record: '',
    isAdvanceLookup: true,
    //control: 'disabledinput',
    control: 'searchinput',
    datatype: 'string',
    isComment: false,
    isDisabled: false,
    AttributeName: "currency_value",
    comment: '',
    isRequired: true,
  }, {
    name: 'Website',
    fkey: 'WebsiteUrl',
    camunda_key: 'websiteurl',
    Id: '',
    vals: '',
    old_val: '',
    record: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    isValid: true,
    comment: '',
    datatype: 'string',
    maxlength: 200,
    AttributeName: "websiteurl",
  }, {
    name: 'Main phone',
    fkey: 'Contact',
    camunda_key: 'mainphone',
    Id: '',
    vals: '',
    old_val: '',
    record: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'number',
    minlimit: 1,
    maxlimit: 10000000000000000000,
    maxlength: 20,
    AttributeName: "contact_contactno",
  },
  { //chethana july 3rd added email id
    name: 'Email ID',
    fkey: 'Email',
    camunda_key: 'email',
    Id: '',
    vals: '',
    old_val: '',
    record: '',
    isAdvanceLookup: false,
    // control: 'input',
    control: 'input',
    isComment: false,
    isValid: true,
    isDisabled: false,
    comment: '',
    datatype: 'string',
    maxlength: 100,
    AttributeName: "email",
  },
  {
    name: 'Headquarters name',
    fkey: 'HeadQuarters',
    camunda_key: '',
    Id: '',
    vals: '',
    old_val: '',
    record: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "headquarters",
  },
  {
    name: 'Standard Industry Classification (SIC)',
    fkey: 'SIC',
    camunda_key: 'sic',
    Id: '',
    vals: '',
    old_val: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'string',
    maxlength: 2000,
    AttributeName: "sic_name",
  }, {
    name: 'Stock exchange',
    fkey: 'StockExchange',
    camunda_key: 'stockexchange',
    Id: '',
    vals: '',
    old_val: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "stockexchange",
  }, {
    name: 'Stock symbol',
    fkey: 'StockSymbol',
    camunda_key: 'stocksymbol',
    Id: '',
    vals: '',
    old_val: '',
    isAdvanceLookup: false,
    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "stocksymbol",
  },

  {
    name: 'Business description',
    fkey: 'BusinessDescription',
    camunda_key: 'businessdescription',
    Id: '',
    vals: '',
    old_val: '',
    isAdvanceLookup: false,
    // control: 'input',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'string',
    maxlength: 2000,
    AttributeName: "businessdescription",
  }
  ];

  // Address details tab start 
  addressDetails = [{
    name: 'Street1',
    fkey: 'Address1',
    camunda_key: 'address1',
    Id: '',
    vals: '',
    old_val: '',

    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "addresss_address1",
  }, {
    name: 'Street2',
    fkey: 'Address2',
    camunda_key: 'address2',
    Id: '',
    vals: '',
    old_val: '',

    // control: 'disabledinput',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "addresss_address2",
  },
  {
    name: 'City region',
    fkey: 'City',
    camunda_key: 'city',
    Id: '',
    vals: '',
    old_val: '',
    isAdvanceLookup: true,
    control: 'input',
    // control: (this.getAttributeId('address_citystring')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "address_citystring",
  },
  {
    name: 'Country sub-division',
    fkey: 'SubDivision',
    camunda_key: 'subdivision',
    Id: '',//(data.Address && data.Address.SubDivision && data.Address.SubDivision.SysGuid) ? data.Address.SubDivision.SysGuid : '',
    vals: '',
    old_val: '',
    isAdvanceLookup: true,
    control: 'input',
    // control: (this.getAttributeId('addresss_subdivision_name')) ? 'input' : 'disabledinput',
    isDisabled: true,
    isComment: false,
    comment: '',
    AttributeName: "addresss_subdivision_name",
  },
  {
    name: 'Zip code',
    fkey: 'ZipCode',
    camunda_key: '',
    Id: '',
    vals: '',
    old_val: '',

    control: 'input',
    // control: (this.getAttributeId('addresss_zipcode')) ? 'input' : 'disabledinput',
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
    camunda_key: 'country',
    Id: '',//(data.Address && data.Address.Country && data.Address.Country.SysGuid) ? data.Address.Country.SysGuid : '',
    vals: '',// (data.Address && data.Address.Country && data.Address.Country.Name) ? data.Address.Country.Name : '',
    old_val: '',// (data.Address && data.Address.Country && data.Address.Country.Name) ? data.Address.Country.Name : '',
    isAdvanceLookup: true,
    control: 'input',
    // control: (this.getAttributeId('address_countrystring')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "address_countrystring",
  }
  ];

  // Address details tab end 

  // Key financials start 
  table_headkey = [{
    'tablehead': 'Financial year',
    'name': 'FinancialYear'
  },
  {
    'tablehead': 'Revenues($M)',
    'name': 'Revenue'
  },
  {
    'tablehead': 'OM(%)',
    'name': 'OperatingMargin'
  },
  {
    'tablehead': 'Market cap($M)',
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

  // key finanacials end 

  // trend analysis start 
  trendsAnalysis = [{

    name: 'Company brief',
    fkey: 'CompanyBrief',
    camunda_key: '',
    vals: '',//(data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('CompanyBrief') != -1) ? true : false) ? data.TrendsNAnalysis.CompanyBrief : '',
    // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyBrief) ? data.TrendsNAnalysis.CompanyBrief : '-',
    old_val: '',// (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyBrief) ? data.TrendsNAnalysis.CompanyBrief : '',

    control: 'input',
    // control: (this.getAttributeId('trendsnanalysis_companybrief')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "trendsnanalysis_companybrief",
  }, {
    name: 'No of CBUs that can outsource',
    fkey: 'NoOfCBU',
    camunda_key: '',
    vals: '',// (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('NoOfCBU') != -1) ? true : false) ? data.TrendsNAnalysis.NoOfCBU : '',
    // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.NoOfCBU) ? data.TrendsNAnalysis.NoOfCBU : '-',
    old_val: '',// (data.TrendsNAnalysis && data.TrendsNAnalysis.NoOfCBU) ? data.TrendsNAnalysis.NoOfCBU : '',

    control: 'input',
    //control: (this.getAttributeId('trendsnanalysis_noofcbu')) ? 'input' : 'disabledinput',
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
    vals: '',// (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Forbes1000Rank') != -1) ? true : false) ? data.TrendsNAnalysis.Forbes1000Rank : '',
    // valsd : (data.TrendsNAnalysis && (data.TrendsNAnalysis.Forbes1000Rank==0)? 0:(data.TrendsNAnalysis && data.TrendsNAnalysis.Forbes1000Rank && (data.TrendsNAnalysis.Forbes1000Rank!=0))? data.TrendsNAnalysis.Forbes1000Rank :'' ),
    old_val: '',// (data.TrendsNAnalysis && data.TrendsNAnalysis.Forbes1000Rank) ? data.TrendsNAnalysis.Forbes1000Rank : '',

    control: 'input',
    // control: (this.getAttributeId('trendsnanalysis_forbes1000rank')) ? 'input' : 'disabledinput',
    isComment: false,
    comment: '',
    isDisabled: false,
    AttributeName: "trendsnanalysis_forbes1000rank",
    datatype: 'number',
    minlimit: 1,
    maxlimit: 1000,
    maxlength: 4,
  }, {
    name: 'Profits (In $Mn)',
    fkey: 'Priofit',
    camunda_key: 'grossprofit',
    vals: '',//(data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('Priofit') != -1) ? true : false) ? data.TrendsNAnalysis.Priofit : '',
    // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.Priofit) ? data.TrendsNAnalysis.Priofit : '-',
    old_val: '',//(data.TrendsNAnalysis && data.TrendsNAnalysis.Priofit) ? data.TrendsNAnalysis.Priofit : '',

    control: 'input',
    // control: (this.getAttributeId('trendsnanalysis_profit')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "trendsnanalysis_profit",
    datatype: 'float',
    minlimit: -100000000000,
    maxlimit: 100000000000,
    maxlength: 16,
  }, {
    name: 'Company news',
    fkey: 'CompanyNews',
    camunda_key: '',
    vals: '',// (data.TrendsNAnalysis && (arr.length > 0 && arr.indexOf('CompanyNews') != -1) ? true : false) ? data.TrendsNAnalysis.CompanyNews : '',

    // vals: (data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',
    old_val: '',//(data.TrendsNAnalysis && data.TrendsNAnalysis.CompanyNews) ? data.TrendsNAnalysis.CompanyNews : '',

    control: 'input',
    //control: (this.getAttributeId('trendsnanalysis_companynews')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "trendsnanalysis_companynews",
  },

  {
    name: 'Employees',
    fkey: 'Employees',
    camunda_key: 'employees',
    Id: '',
    vals: '',// data.EmployeeCount ? data.EmployeeCount : '',
    old_val: '',//data.EmployeeCount ? data.EmployeeCount : '',
    control: 'input',
    isComment: false,
    isDisabled: false,
    comment: '',
    AttributeName: "employeecount",
  },
  {
    name: 'Revenue (in $Mn)',
    fkey: 'Revenue',
    camunda_key: '',
    vals: '',// data.Revenue ? data.Revenue : '',
    old_val: '',//data.Revenue ? data.Revenue : '',

    control: 'input',
    //control: (this.getAttributeId('revenue')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'float',
    AttributeName: "revenue",
  },
  {
    name: 'Operating Margin (%)',
    fkey: 'OperatingMargin',
    camunda_key: '',
    Id: '',
    vals: '',// data.OperatingMargin ? data.OperatingMargin : '',
    old_val: '',// data.OperatingMargin ? data.OperatingMargin : '',

    control: 'input',
    // control: (this.getAttributeId('operatingmargin')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'float',
    AttributeName: "operatingmargin",
  },
  {
    name: 'Market value',
    fkey: 'MarketValue',
    camunda_key: '',
    Id: '',
    vals: '',//data.MarketValue ? data.MarketValue : '',
    old_val: '',// data.MarketValue ? data.MarketValue : '',

    control: 'input',
    //control: (this.getAttributeId('marketvalue')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'float',
    AttributeName: "marketvalue",
  },
  {
    name: 'Return on Equity',
    fkey: 'ReturnOnEquity',
    camunda_key: '',
    Id: '',
    vals: '',
    old_val: '',//data.ReturnOnEquity ? data.ReturnOnEquity : '',

    control: 'input',
    //control: (this.getAttributeId('returnonequity')) ? 'input' : 'disabledinput',
    isComment: false,
    isDisabled: false,
    comment: '',
    datatype: 'float',
    AttributeName: "returnonequity",
  }
  ];

  // trend analysis end 

  // IT landscape start 
  LandIT = [{
    name: 'IT landscape',
    fkey: 'ITLandScape',
    camunda_key: '',
    vals: '',// (data.ITLandScape) ? data.ITLandScape : '',
    old_val: '',//(data.ITLandScape) ? data.ITLandScape : '',

    control: 'input',
    // control: (this.getAttributeId('itlandscape')) ? 'input' : 'disabledinput',
    isComment: false,
    comment: '',
    isDisabled: false,
    AttributeName: "itlandscape",
  }];

  // IT landscape end 

  // CBU start 

  CustomerBusinessUnit: any = {
    'tableHead': [
      { title: 'Customer business unit' },
      { title: 'Status' },
      { title: 'Buyer Org' }],
    'record': [
    ]
  };

  CustomerBusinessUnitdata = []

  // CBU end 

  // Add customer business unit popup call start 
  openAddCBUActivatePopup() {
    const dialogRef = this.dialog.open(CBUActivateComponent,
      {
        disableClose: true,
        width: '450px'
      });
    dialogRef.afterClosed().subscribe(result => {

      if (result != '' && result != undefined) {
        this.CustomerBusinessUnitdata.push(result)
        console.log("cbu popup result", result)
      }
    })
  }
  deleteCBU(data, i) {
    debugger
    console.log("cbu delete data", data);

    if (i > -1) {
      this.CustomerBusinessUnitdata.splice(i, 1)

    }
  }


  // Account relationship 
  vendorDetails = [{
    name: 'Relationship Type',
    fkey: 'RelationShipType',
    camunda_key: '',
    Id: '',
    value: '',
    vals: '',
    old_val: '',
    isDisabled: false,
    control: 'dropdown',
    comment: '',
    AttributeName: "relationshiptype_value"
  }]

  // RelationShipType = [
  //   {Id:'0', Value:'strategic'},
  //   {Id:'1', Value:'strategic'},
  //   {Id:'2', Value:'Preferred'},
  //   {Id:'3', Value:'Vendor Pool'},
  //   {Id:'4', Value:'Niche Provider'},
  //   {Id:'5', Value:'Minor Vendor'},
  //   {Id:'6', Value:'No Business'},
  // ]

  panelOpenState: boolean;
  accountAlliancePanel: boolean = true;
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

  // Add alliance table data start 
  table_headalli = [
    { tablehead: 'Alliance' },
    // {tablehead : 'Customer Contact'}
  ]
  table_data = [
    // { name: 'Name 1', contact: 'Vijay Kumar' },
    // { name: 'Name 2', contact: 'Akash Anand' },
    // { name: 'Name 3', contact: 'Yogesh Jawalia' },
    // { name: 'Name 4', contact: 'Ravi Kumar' },
    // { name: 'Name 5', contact: 'Rajesh Kumar' }
  ]
  // Add alliance table data end 

  // Add competitor table data start 
  accountCompetitors1 = [
    // { Name: 'Name 1' },
    // { Name: 'Name 2' },
    // { Name: 'Name 3' },

  ]


  // Add competitor table data end 

  // Add allaince popup call start 
  // Add allaince popup call start 
  // Add allaince popup call start 
  OpenaddAlliancepopup() //chethana april 30th add alliance
  {
    this.editable = true;
    const dialogRef = this.dialog.open(AllianceAddComponent,
      {
        disableClose: true,
        width: '450px',
        data: { SeletectedData: this.table_data }
      });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("reslult", result)
        if (result && result.SysGuid && result.Name) {
          if (this.table_data && this.table_data.findIndex(td => td.SysGuid && (td.SysGuid.trim()).toLowerCase() == (result.SysGuid.trim()).toLowerCase()) == -1) {



            this.table_data.push(result);

          }
          else {
            this.snackBar.open("`" + result.Name + "`" + " is already added", '', {
              duration: 3000
            });
          }
        }
        // this.table_data.push(result)
      }
    })

  }

  deleteAlliance(data, i) {
    console.log("cbu delete data", data);
    if (i > -1) {
      this.table_data.splice(i, 1)
    }
  }

  // Add allaince popup call end 
  // Add allaince popup call end 
  // Add allaince popup call end 

  // Add Active competitor popup call start 
  // Add Active competitor popup call start 
  // Add Active competitor popup call start 
  OpenaddActiveCompetitorepopup() {

    this.editable1 = true;
    const dialogRef = this.dialog.open(AddActiveCompetitorComponent,
      {
        disableClose: true,
        width: '450px',
        data: { SeletectedData: this.table_data }

      });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("competitiore data", result)
        // this.accountCompetitors1.push(result)
        if (result) {
          console.log("reslult", result)
          if (result && result.Competitor.SysGuid && result.Name) {
            if (this.accountCompetitors1 && this.accountCompetitors1.findIndex(td => td.Competitor.SysGuid && (td.Competitor.SysGuid.trim()).toLowerCase() == (result.Competitor.SysGuid.trim()).toLowerCase()) == -1) {



              this.accountCompetitors1.push(result);

            }
            else {
              this.snackBar.open("`" + result.Name + "`" + " is already added", '', {
                duration: 3000
              });
            }
          }
          // this.table_data.push(result)
        }
      }
    })

  }
  deleteCompetitore(data, i) {
    console.log("cbu delete data", data);
    if (i > -1) {
      this.accountCompetitors1.splice(i, 1)
    }
  }

  // Add Active competitor popup call end 

  // open analyst relation popup call start 
  OpenAnalystRelationpopup() {
    this.editable2 = true;
    const dialogRef = this.dialog.open(AddAnalystRelationsComponent,
      {
        disableClose: true,
        width: '450px',
        data: { SeletectedData: this.table_data }

      });
    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      //   console.log("advisory ", result)
      //   this.advisory.push(result)
      // }
      if (result) {
        console.log("reslult", result)
        if (result && result.SysGuid && result.Name) {
          if (this.advisory && this.advisory.findIndex(td => td.SysGuid && (td.SysGuid.trim()).toLowerCase() == (result.SysGuid.trim()).toLowerCase()) == -1) {
            this.advisory.push(result);
          }
          else {
            this.snackBar.open("`" + result.Name + "`" + " is already added", '', {
              duration: 3000
            });
          }
        }
        // this.table_data.push(result)
      }
    })

  }
  deleteadvisory(data, i) {
    if (i > -1) {
      this.advisory.splice(i, 1)
    }
  }
  // open analyst relation popup call end 


  // New SAP customer code popup start 
  OpenSAPCustomerCodepopup() {
    this.editable = true;
    const dialogRef = this.dialog.open(RequestSapCodeComponent, {
      disableClose: true
    });

  }
  // New SAP customer code popup end 

  // Swapping details Alternative swap account popup start 
  allaltSwapableAccount = [
    { SysGuid: 0, Name: 'Account name 1', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
    { SysGuid: 1, Name: 'Account name 2', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
    { SysGuid: 2, Name: 'Account name 3', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
    { SysGuid: 3, Name: 'Account name 4', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
    { SysGuid: 4, Name: 'Account name 5', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
    { SysGuid: 5, Name: 'Account name 6', Number: 'Account number', LastActiveOpportunity: '12/03/19', LastOpenOrder: '11/04/19', LastActiveDone: '12/12/2017', LastInvoiceRaised: '12/04/19' },
  ];

  OpenSwap(val) {
    if (val == 'Select alternative account') {
      this.AltSwapAccountOpen()
    }
    else if (val == 'Select account') {
      this.SwapAccountOpen()
    }
  }
  AltSwapAccountOpen() {
    const dialogRef = this.dialog.open(SwapPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: { allSwapableAccount: this.allaltSwapableAccount }
      });
    dialogRef.afterClosed().subscribe(res => {
      console.log("alternaterswapdata", res)
      this.accountcreationobj['altswpaccount'] = res.SysGuid;
      let index = this.swappingDetails.findIndex((obj => obj.fkey == 'alternativeSwapAccount'))
      this.swappingDetails[index].record = res.Name
      if (this.swappingDetails[index].record) this.isError['alternativeSwapAccount'] = false;
      else this.isError['swapAccountfield'] = true;
    })


    // dialogRef.afterClosed().subscribe(

    //  () => { this.dialog.open(SwapCreatePopupComponent,
    //     {
    //       disableClose: true,
    //       width: '380px',
    //       data: {
    //         account1: 'account1',
    //         account2: 'account2'
    //       }

    //     });
    //   }
    // )

  }

  settextvalue(fkey) {
    let result
    const index = this.ownershipDetails.findIndex((obj => obj.fkey == fkey))
    const index1 = this.CustomDetails.findIndex((obj => obj.fkey == fkey))
    const index2 = this.accountDetails.findIndex((obj => obj.fkey == fkey))
    const index3 = this.addressDetails.findIndex((obj => obj.fkey == fkey))
    const index4 = this.trendsAnalysis.findIndex((obj => obj.fkey == fkey))
    const index5 = this.LandIT.findIndex((obj => obj.fkey == fkey))
    const index6 = this.engageDetails.findIndex((obj => obj.fkey == fkey))

    if (index != -1) {
      result = this.ownershipDetails[index].record
    }
    else if (index1 != -1) {
      result = this.CustomDetails[index1].vals
    }
    else if (index2 != -1) {
      result = this.accountDetails[index2].record
    }
    else if (index3 != -1) {
      result = this.addressDetails[index3].vals
    }
    else if (index4 != -1) {
      result = this.trendsAnalysis[index4].vals
    }
    else if (index5 != -1) {
      result = this.LandIT[index5].vals
    }
    else if (index6 != -1) {
      result = this.engageDetails[index6].vals
    }
    console.log("result of text", result)

    return result;
  }
  removeSeletecedValue(formName, arr, key) {
    // arr.Id = '';
    // arr[key] = '';
    console.log(arr);
    let id = [];
    let clearArr = [];
    switch (arr.fkey) {
      case 'Geo':
        id = ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        clearArr = ['Geo', 'Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'Region':
        id = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        clearArr = ['Region', 'CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'CountryReference':
        id = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        clearArr = ['CountryReference', 'CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'CountrySubDivisionReference':
        id = ['CountrySubDivisionReference', 'CityRegionReference'];
        clearArr = ['CountrySubDivisionReference', 'CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'CityRegionReference':
        id = ['CityRegionReference'];
        clearArr = ['CityRegionReference'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'SBU':
        clearArr = ['SBU', 'Vertical', 'SubVertical'];
        id = ['sbu', 'Vertical', 'SubVertical'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'Vertical':
        clearArr = ['Vertical', 'SubVertical'];
        id = ['Vertical', 'SubVertical'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'SubVertical':
        clearArr = ['SubVertical'];
        id = ['SubVertical'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.clearids(id)
        return;
      case 'Currency':
        clearArr = ['Currency'];
        this.isError['currency'] = true;
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);

        return;
      case 'ParentAccount':
        id = ['ParentAccount', 'UltimateParentaccount'];
        this.clearids(id)
        let ind = this.accountDetails.findIndex((obj => obj.fkey == 'ParentAccount'))
        this.accountDetails[ind].record = ''
        let ind1 = this.accountDetails.findIndex((obj => obj.fkey == 'UltimateParentaccount'))
        this.accountDetails[ind1].values = ''
        clearArr = ['ParentAccount', 'UltimateParentaccount'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        return;
      case 'UltimateParentAccount':
        clearArr = ['UltimateParentAccount'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        return;
      case 'currency':
        clearArr = ['currency'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.isError['currency'] = true;
        this.accountcreationobj['currency'] = '';

        return;
      case 'Owner':
        clearArr = ['Owner', 'swapAccountfield', 'alternativeOwner', 'alternativeSwapAccount'];
        this.accountcreationobj['Owner'] = '';
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.huntingRatio = undefined;
        this.althuntingRatio = undefined;
        this.isError['Owner'] = true;
        this.iswapaccount = false;
        this.isaltswapaccount = false;
        this.isError['swapAccountfield'] = false;
        this.isError['alternativeOwner'] = false;
        this.isError['alternativeSwapAccount'] = false;
        this.accountcreationobj['alternativeOwner'] = '';
        return;
      case 'Privateequaitity':
        clearArr = ['Privateequaitity'];
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        this.accountcreationobj['PrivateEquityAccount'] = ''
        this.isError['PrivateEquityAccount'] = true;
        return;
      case 'alternativeOwner':
        clearArr = ['alternativeOwner', 'alternativeSwapAccount'];
        this.accountcreationobj['alternativeOwner'] = '';
        this.althuntingRatio = undefined;
        // this.isaltswapaccount = false;
        this.clearHirarchyData(formName, clearArr, key, arr.fkey);
        if (this.isaltswapaccount) {
          this.isError['alternativeOwner'] = true;
          this.isError['alternativeSwapAccount'] = true;
        }
        else {
          this.isError['alternativeOwner'] = false;
          this.isError['alternativeSwapAccount'] = false;
        }
        return;
    }
  }

  getultimteparentbyid(id) {
    console.log('came here too');
    console.log(id);
    let upInd = this.accountDetails.findIndex(ow => ow.fkey == 'UltimateParentAccount');
    this.masterApi.getUltimateParentByParent(id).subscribe((res: any) => {
      console.log("response of ultimate parent by parent", res.ResponseObject);
      if (!res.IsError) {
        // this.prospectAccForm.controls['ultimateparent'].setValue(this.getSymbol(res.ResponseObject[0].UltimateParentAccount.Name))
        this.accountDetails[upInd].Id = res.ResponseObject[0].UltimateParentAccount.SysGuid;
        this.accountDetails[upInd].values = res.ResponseObject[0].UltimateParentAccount.Name;
      }
    });
  }
  clearHirarchyData(arr, keys, lable, fkey) {
    console.log(arr, keys, lable);
    this.accountcreationobj[fkey] = '';
    keys.forEach(key => {
      let ind = arr.findIndex(ow => ow.fkey == key);
      arr[ind].Id = '';
      arr[ind].prevValue = '';
      arr[ind][lable] = '';
      if (this.otherFieldsvalidation == true && (fkey == 'SBU' || fkey == 'Vertical' || fkey == 'Geo' || fkey == 'Region' || fkey == 'CountryReference')) {
        this.isError[fkey] = true;
      }
      else if (fkey == 'SubVertical' || fkey == 'CountrySubDivisionReference' || fkey == 'CityRegionReference') {

      }
      else {
        if (this.isError.hasOwnProperty(fkey)) {
          this.isError[fkey] = false;
        }
        else { }
      }
    });
    console.log(arr);

  }
  clearids(data) {
    console.log("ids", data)
    data.forEach((item) => {
      console.log("svdddddddddddddddddddddddddddddddddddddd", item)
      this.accountcreationobj[item] = ''

    });

    //     let i= 0
    //     for( i= 0; data.length ;i++)
    //     {
    // console.log("dataclear",data[i])
    //     }
  }
  getError(value, key) {
    console.log(value);
    if (this.isError.hasOwnProperty(key)) {
      console.log(value);
      if (typeof value === 'object') {
        if (value !== null) {
          this.isError[key] = false;
        }
        else {
          this.isError[key] = true;
        }
      }
      else {
        if (value.length > 0) {
          this.isError[key] = false;
        }
        else {
          this.isError[key] = true;
        }
      }
    }
  }
  postobj() {
    // this.isError['CityRegionReference'] = false;
    // this.isError['CountrySubDivisionReference'] = false;
    this.submitted = true;
    this.allFalse = true;
    for (var i in this.isError) {
      if (this.isError[i] === true) {
        this.allFalse = false;
        break;
      }
    }

    if (this.isError.Type == true || this.isError.Legalentityname == true || this.isError.accountname == true || this.isError.Owner == true || this.isError.SBU == true || this.isError.Vertical == true
      || this.isError.Geo == true || this.isError.Region == true || this.isError.CountryReference == true || this.isError.swapAccountfield == true || this.isError.alternativeOwner == true || this.isError.alternativeSwapAccount == true) {
      this.showOverview()
    }
    else if (this.isError.currency == true) {
      this.showCustomer();
    }
    console.log(this.allFalse);
    if (this.allFalse) {
      console.log("address details", this.addressDetails)
      console.log("customer details", this.CustomDetails)
      console.log("trendsAnalysis details", this.trendsAnalysis)
      console.log("LandIT details", this.LandIT)

      //debugger;
      let obj = {
        "Name": this.settextvalue('accountname'),
        "LegalEntity": this.settextvalue('Legalentityname'),
        "Type": {
          "Id": this.accountcreationobj['Accounttype']
        },
        "AccountClassification": {
          "Id": this.accountcreationobj['Accountclassification']
        },
        "ProposedAccountType": {
          "Id": this.accountcreationobj['ProposedAccountType']
        },
        "ProposedAccountClassification": {
          "Id": this.accountcreationobj['Proposedaccountclassification']
        },
        "DUNSID": {
          "SysGuid": this.accountcreationobj['DUNSID']
        },
        "ParentAccount":
        {
          "SysGuid": this.accountcreationobj['ParentAccount'],
          "DNBParent": this.accountcreationobj['parentdunsname'],
          "DNBParentDuns": this.accountcreationobj['DNBParentDuns'],
          "DUNSID": {
            "SysGuid": this.accountcreationobj['parentsdunsid']
          }
        },
        "UltimateParentAccount":
        {
          "SysGuid": this.accountcreationobj['UltimateParentaccount'],
          "DNBUltimateParent": this.accountcreationobj['ultimateparentdunsname'],
          "DNBUltimateParentDuns": this.accountcreationobj['DNBUltimateParentDuns'],
          "DUNSID":
          {
            "SysGuid": this.accountcreationobj['ultimateparentsdunsid']
          }
        },
        "IsPrivateEquityOwned": this.IsPrivateEquityOwned,
        "PrivateEquityOwned":
        {
          "SysGuid": this.accountcreationobj['PrivateEquityAccount']
        },
        "DeliveryManagerADHVDH": {
          "FullName": this.settextvalue('DeliveryManagerADHVDH')
        },
        "VDH": {
          "FullName": this.settextvalue('VDH')
        },
        "ADM": {
          "FullName": this.settextvalue('ADM')
        },
        "SBU": {
          "Id": this.accountcreationobj['sbu']
        },
        "Vertical": {
          "Id": this.accountcreationobj['Vertical']
        },
        "SubVertical": {
          "Id": this.accountcreationobj['SubVertical']
        },
        "Geo": {
          "SysGuid": this.accountcreationobj['Geo']
        },
        "Region": {
          "SysGuid": this.accountcreationobj['Region']
        },
        "CountryReference": {
          "SysGuid": this.accountcreationobj['CountryReference']
        },
        "CityRegionReference": {
          "SysGuid": this.accountcreationobj['CityRegionReference']
        },
        "Owner": {
          "SysGuid": this.accountcreationobj['Owner']
        },
        "AlternateAccountOwner": { "SysGuid": this.accountcreationobj['alternativeOwner'] },
        "SwapAccount": { "SysGuid": this.accountcreationobj['swpaccount'] },
        "AlternateSwapAccount": { "SysGuid": this.accountcreationobj['altswpaccount'] },
        "isSwapAccount": this.iswapaccount,
        "IsAlternateSwapAccount": this.isaltswapaccount,
        "MarketRisk": {
          "Id": this.accountcreationobj['MarketRisk']
        },
        "AccountCategory": {
          "Id": this.accountcreationobj['AccountCategory']
        },
        "IsGovAccount": this.IsGovAccount,
        "IsNewAgeBusiness": this.IsNewagebusiness,
        "PursuedopportunityRemarks": this.settextvalue('PursuedopportunityRemarks'),
        "LifeCycleStage": {
          "Id": this.accountcreationobj['LifeCycleStage']
        },
        "RevenueCategory": {
          "Id": this.accountcreationobj['RevenueCategory']
        },
        "GrowthCategory": {
          "Id": this.accountcreationobj['GrowthCategory']
        },
        "CoverageLevel": {
          "Id": this.accountcreationobj['CoverageLevel']
        },
        "RelationShipStatus": {
          "Id": this.accountcreationobj['RelationShipStatus']
        },
        "OwnershipType": {
          "Id": this.accountcreationobj['OwnershipType']
        },
        "EntityType": {
          "Id": this.accountcreationobj['EntityType']
        },
        "Currency": {
          "Id": this.accountcreationobj['currency']
        },
        "WebsiteUrl": this.settextvalue('WebsiteUrl'),
        "Contact": {
          "ContactNo": this.settextvalue('Contact')
        },
        "Email": this.settextvalue('Email'),
        "BusinessDescription": this.settextvalue('BusinessDescription'),
        "HeadQuarters": this.settextvalue('HeadQuarters'),
        "SIC": {
          "Name": this.settextvalue('SIC')
        },
        "StockExchange": this.settextvalue('StockExchange'),
        "StockSymbol": this.settextvalue('StockSymbol'),
        "Address": {
          "Address1": this.settextvalue('Address1'),
          "Address2": this.settextvalue('Address2'),
          "City": {
            "Name": this.settextvalue('City')
          },
          "State_Province": this.settextvalue('SubDivision'),
          "ZipCode": this.settextvalue('ZipCode'),
          "Country": {
            "Name": this.settextvalue('Country')
          },
          "State": {
            "SysGuid": this.accountcreationobj['CountrySubDivisionReference']
          }
        },
        "TrendsNAnalysis": {
          "CompanyBrief": this.settextvalue('CompanyBrief'),
          "NoOfCBU": this.settextvalue('NoOfCBU'),
          "Forbes1000Rank": this.settextvalue('Forbes1000Rank'),
          "Priofit": this.settextvalue('Priofit'),
          "CompanyNews": this.settextvalue('CompanyNews'),
        },
        "EmployeeCount": this.settextvalue('Employees'),
        "Revenue": this.settextvalue('Revenue'),
        "OperatingMargin": this.settextvalue('OperatingMargin'),
        "MarketValue": this.settextvalue('MarketValue'),
        "ReturnOnEquity": this.settextvalue('ReturnOnEquity'),
        "ITLandScape": this.settextvalue('ITLandScape'),
        "RelationShipType": {
          "Id": this.accountcreationobj['RelationShipType']
        },
        "CustomerBusinessUnit": this.CustomerBusinessUnitdata,
        "AccountAlliance": this.table_data,
        "ActiveAccountCompetitors": this.accountCompetitors1,
        "AdvisoryRAnalystList": this.advisory,
      }
      console.log("final request", obj)
      this.HelpdeskAccountCreation(obj)
    }
    else {
      console.log(this.allFalse, this.isError)
    }


    setTimeout(() => {
      const invalidElements = this.el.nativeElement.querySelector('input.error,mat-select.error');
      if (invalidElements) {
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidElements.focus();
      }
    }, 100)
    // if(invalidElements){
    // invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // invalidElements.focus();
    // }

  }
  ngOnDestroy() {
    localStorage.removeItem('parentdetailes');
    localStorage.removeItem('parentflag');
  }
  HelpdeskAccountCreation(reqbody) {
    this.isLoading = true;
    console.log("final request boday", reqbody)
    let helpdeskaccountcreate = this.accountListService.HelpdeskAccountCreation(reqbody)
    helpdeskaccountcreate.subscribe((res: any) => {
      console.log("helpdesk account response", res)
      if (!res.IsError) {
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
        this.isLoading = false;
        this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
        this.router.navigate(['/accounts/accountlist/farming']);
      }
      else if (res.IsError) {
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
        this.isLoading = false;
      }
    })

  }

  getAllSwapAccount(ownerid, countryId) {
    // if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    const swapaccount = this.masterApi.getswapaccount(ownerid, countryId);
    swapaccount.subscribe((res: any) => {
      // console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allSwapableAccount = res.ResponseObject;
      else this.allSwapableAccount = [];
    });
  }
  getAltSwapAccount(ownerid, countryId, sbuId) {
    const swapaccount = this.masterApi.getaltswapaccount(ownerid, countryId, sbuId);
    swapaccount.subscribe((res: any) => {
      // this.OwnDetailsForm.controls['altswapaccount'].setValue(''); // selected swap account should be empty on calling API. ** KKN **
      // this.accountCreationObj['alternateswapaccount'] = '';
      // this.accountCreationObj['requesttype'] = this.userdat.searchFieldValidator(this.accountCreationObj['alternateswapaccount']) ? 3 : 1;

      // console.log("swapaccount data", res.ResponseObject)
  
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
      {
        this.allaltSwapableAccount = res.ResponseObject;    
      }        
      else 
      {
        this.allaltSwapableAccount = [];
      }
    });
  }
  // Swapping details Alternative swap account popup end 

  // Select account popup start 
  SwapAccountOpen() {
    const dialogRef = this.dialog.open(SwapPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: { allSwapableAccount: this.allSwapableAccount }
      });
    dialogRef.afterClosed().subscribe(res => {
      console.log("swapaccoutdata", res)
      this.accountcreationobj['swpaccount'] = res.SysGuid;
      let index = this.swappingDetails.findIndex((obj => obj.fkey == 'swapAccountfield'))
      this.swappingDetails[index].record = res.Name;
      if (this.swappingDetails[index].record) this.isError['swapAccountfield'] = false;
      else this.isError['swapAccountfield'] = true;

    })
  }
  // Select account popup end 


  // OVERVIEW TAB STATIC DATA start 
  customerNameSwitch: boolean;
  OwnerName: string;
  customerNameclose() {
    this.customerNameSwitch = false;
  }

  customerContact = [
    { id: 0, FullName: 'Kanika Tuteja', Email: 'KanikaTuteja@wipro.com' },
    { id: 1, FullName: 'Anubhav Jain', Email: 'AnubhavJain@wipro.com' },
    { id: 2, FullName: 'Kanika Tuteja', Email: 'KanikaTuteja@wipro.com' },
    { id: 3, FullName: 'Anubhav Jain', Email: 'AnubhavJain@wipro.com' }
  ]

  appendcustomer(item) {
    this.OwnerName = item.FullName;
    this.customerNameSwitch = false;
  }

  alternativeownerSwitch: boolean;

  alternativeowner = [
    { id: 0, FullName: 'Kanika Tuteja', Email: 'KanikaTuteja@wipro.com' },
    { id: 1, FullName: 'Anubhav Jain', Email: 'AnubhavJain@wipro.com' },
    { id: 2, FullName: 'Kanika Tuteja', Email: 'KanikaTuteja@wipro.com' },
    { id: 3, FullName: 'Anubhav Jain', Email: 'AnubhavJain@wipro.com' }
  ];
  AltOwnerName: string;
  alternativeownerClose() {
    this.alternativeownerSwitch = false;
  }
  appendAltOwner(item) {
    this.alternativeownerSwitch = false;
    this.AltOwnerName = item.FullName;
  }



  // OVERVIEW TAB STATIC DATA end 
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

  // getCommonData(controlName) {
  //   let subIndex = this.ownershipDetails.findIndex(own => own.fkey == 'SBU');
  //   let verticalIndex = this.ownershipDetails.findIndex(own => own.fkey == 'Vertical');
  //   switch (controlName) {
  //     case 'SBU':
  //       return { SbuId: '' }
  //     case 'Vertical':
  //       return { SbuId: this.ownershipDetails[subIndex]['Id'] || '' }
  //     case 'SubVertical':
  //       return { verticalId: this.ownershipDetails[verticalIndex]['Id'] || '' }

  //   }
  //   // return {
  //   //   guid: '',
  //   // }
  // }
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
  openadvancetabs(formArray, controlName, initalLookupData, value, valkey, typeOfBlock): void {
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
    // debugger;
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

  getdecodevalue(data) {
    if (data) {
      return this.accountListService.getSymbol(data);
    } else {
      return '';
    }

  }
  autoCompleteClose(item, optionsSwitch?) {
    optionsSwitch ? item['optionsSwitch'] = false : item['isOpened'] = false;
  }
  AppendParticularInputFun(formArray, selectedData, controlName, valkey, typeOfBlock) {
    // console.log(formArray,controlName,valkey);
    let selectedDataId = this.accountOverviewDropdown[controlName].findIndex(res => res.Name == selectedData[0].Name);
    if (selectedData) {
      // let accountDetailsId = this.accountDetails.findIndex(own => own.fkey == controlName);
      if (typeOfBlock === 'accountDetail') {
        let accountDetailsId = this.accountDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(formArray, this.accountDetails[accountDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      }
      else if (typeOfBlock === 'ownershipDetails') {
        let ownershipDetailsId = this.ownershipDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(formArray, this.ownershipDetails[ownershipDetailsId], selectedData[0], valkey, 'Name', selectedDataId)
      }
      else if (typeOfBlock === 'swappingDetails') {
        let swappingDetailsId = this.swappingDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(formArray, this.swappingDetails[swappingDetailsId], selectedData[0], valkey, 'FullName', selectedDataId)
      } else {
        let CustomDetailsId = this.CustomDetails.findIndex(own => own.fkey == controlName);
        this.getPosts(formArray, this.CustomDetails[CustomDetailsId], selectedData[0], valkey, 'Desc', selectedDataId)
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
  getFocus() {
    this.isLoading = true;

    setTimeout(() => {

      this.isLoading = false;
      let index = this.accountDetails.findIndex((obj => obj.fkey == 'Legalentityname'))
      //  console.log("this.accountDetails[index].control------"+this.accountDetails[index].control); 
      if (this.accountDetails[index].control === 'searchinput') {
        document.getElementById("ConversationNamee0").focus();
      } else {
        document.getElementById("account_name0").focus();
      }


      window.scrollTo(0, 0);
    }, 1000);
  }

}