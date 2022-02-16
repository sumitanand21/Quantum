import { CBU } from './../../../../core/state/state.models/contact-list.interface';
import { toArray } from 'rxjs/operators';
import { Component, Input, ViewChild, ViewChildren, QueryList, ElementRef, Inject,HostListener } from '@angular/core';
import { OnInit, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@app/shared/services/validation.service';
import { AccountOwnerPopupComponent } from '@app/shared/modals/account-owner-popup/account-owner-popup.component';
import { MasterApiService } from '@app/core';
import { ErrorComponent } from '@app/error/error.component';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountService, AccountAdvnNames, AccountNameListAdvnHeaders } from '@app/core/services/account.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';

@Component({
  selector: 'app-create-assignment-reference',
  templateUrl: './create-assignment-reference.component.html',
  styleUrls: ['./create-assignment-reference.component.scss']
})
export class CreateAssignmentReferenceComponent implements OnInit {
  ConversationNameSwitch;
  isDuplicate;
  ischangesprimaryvalue;
  RANumber;
  selectedValue = 'Select';
  formsData: any;
  subVerticals: any = [];
  subverticalExists: boolean;
  regions: any = [];
  country: any = [];
  states: any = [];
  cities: any = [];
  filterCheckBox: any = [];
  totalCBUs: any = [];
  assignRefData: any;
  sub_and_vertical: any = [];
  location_temp: any = [];
  printAsterisk: boolean = true;
  /****************** Assignment reference Array Ak ****************** */
  selectedGeoName: string = '';
  selectedRegionName: string = '';
  selectedCountryName: string = '';
  createDropDown: any = {
    'Owners': [],
    'SBU': [],
    'Vertical': [],
    'SubVertical': [],
    'SearchCBU': [],
    'Geo': [],
    'Region': [],
    'Country': [],
    'City': [],
    'State': [],
    'Parent': [],
    'Ultimate': []
  };

  assignmentObj: any = {
    'Owners': {},
    'SBU': {},
    'Vertical': {},
    'SubVertical': {},
    'CBU': {},
    'Geo': {},
    'Region': {},
    'Country': {},
    'State': {},
    'City': {},
    'Parent': {},
    'Ultimate': {},
    'territoryflag': false,
    'issecondary': false,
    accountName: 'NA',
    accountNumber: 'NA'
  };
  prospectAccForm: FormGroup;
  accOwnerSwapForm: FormGroup;
  SysGuidid: any;
  isActivityGroupSearchLoading: boolean;
  submitted: boolean = false;
  cbuBorderRed: boolean = false;
  userId: string = '';
  existCbu: any = [];
  isLoading: boolean = false;
  accountDetails: any;
  //  = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
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
    Guid: ''

  };
  // ownername: any;
  // ParentAccountSelected: any;
  // sendAccountNameToAdvance: any = [];
  IsModuleSwitch;
  showFirstForm: boolean;
  // AccountSelected: any;
  // leadSourceSelected: any;
  // leadSourceId: any;
  // leadSrcName: any;
  // sendParentAccountNameToAdvance: any = [];
  // sendUltimateAccountAdvance: any = [];
  // ultimateParentAccountSelected: any;
  sendOwnerToAdvance: any = [];
  ownerAccountSelected: any;
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
  citySelected: any;
  wiproContact: any = [];
  selectedContact: any = [];
  showContactSBU: boolean = false;
  contactSBU: string = '';
  //customerNamewner:string='';
  contactSBUSwitch: boolean = true;
  customerName: string = '';
  arrowkeyLocation;
  OwnerName;
  VerticalName;
  SubVerticalName;
  constructor(public dialog: MatDialog,
    public location: Location,
    // public service: DataCommunicationService,
    // public userdat: DataCommunicationService,
    public accservive: DataCommunicationService,
    private _fb: FormBuilder,
    private el: ElementRef,
    private EncrDecr: EncrDecrService,
    // public assignRefData: any,
    public validate: ValidationService,
    private masterApi: MasterApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public accountListService: AccountListService,
    public master3Api: S3MasterApiService,

  ) {
    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
    //   this.SysGuidid = route.snapshot.params.id;
    //   this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    // }
    // let obj = this.accountListService.getUrlParamsInStorage();
    const obj = this.accountListService.getSession('routeParams');
    if (obj && obj['Id']) {
      this.SysGuidid = obj['Id'];
      this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    }
  }
  FetchReferenceAccountDetails() {
    if (this.SysGuidid) {
      this.accountListService.FetchReferenceAccountDetails(this.SysGuidid).subscribe(res => {
        console.log(res);
        if (!res['IsError'] && res['ResponseObject']) {
          this.accountDetails = res['ResponseObject'];
          this.existCbu = res['ResponseObject'] && res['ResponseObject']['CustomerBusinessUnit'] ? res['ResponseObject']['CustomerBusinessUnit'] : [];
          console.log(this.existCbu);

          this.assignmentObj = {
            accountName: res['ResponseObject'].Name,
            accountNumber: res['ResponseObject'].Number,
            // 'Owners': { 'Id': (res['ResponseObject']['Owner'] && res['ResponseObject']['Owner'].SysGuid) ? res['ResponseObject']['Owner'].SysGuid : '', 'Name': (res['ResponseObject']['Owner'] && res['ResponseObject']['Owner'].FullName) ? res['ResponseObject']['Owner'].FullName : '' },
            'Owners': { 'Id': '', 'Name': '' },
            'SBU': { 'Id': (res['ResponseObject']['SBU'] && res['ResponseObject']['SBU'].Id) ? res['ResponseObject']['SBU'].Id : '', 'Name': (res['ResponseObject']['SBU'] && res['ResponseObject']['SBU'].Name) ? res['ResponseObject']['SBU'].Name : '' },
            'Vertical': { 'Id': (res['ResponseObject']['Vertical'] && res['ResponseObject']['Vertical'].Id) ? res['ResponseObject']['Vertical'].Id : '', 'Name': (res['ResponseObject']['Vertical'] && res['ResponseObject']['Vertical'].Name) ? res['ResponseObject']['Vertical'].Name : '' },
            'SubVertical': { 'Id': (res['ResponseObject']['SubVertical'] && res['ResponseObject']['SubVertical'].Id) ? res['ResponseObject']['SubVertical'].Id : '', 'Name': (res['ResponseObject']['SubVertical'] && res['ResponseObject']['SubVertical'].Name) ? res['ResponseObject']['SubVertical'].Name : '' },
            //'CBU': { 'Id': (res['ResponseObject']['CustomerBusinessUnit'] && res['ResponseObject']['CustomerBusinessUnit'].length > 0 && res['ResponseObject']['CustomerBusinessUnit'][0].SysGuid) ? res['ResponseObject']['CustomerBusinessUnit'][0].SysGuid : '', 'Name': (res['ResponseObject']['CustomerBusinessUnit'] && res['ResponseObject']['CustomerBusinessUnit'].length > 0 && res['ResponseObject']['CustomerBusinessUnit'][0].Name) ? res['ResponseObject']['CustomerBusinessUnit'][0].Name : '' },
            'CBU': [],
            'Geo': { 'Id': (res['ResponseObject']['Geo'] && res['ResponseObject']['Geo'].SysGuid) ? res['ResponseObject']['Geo'].SysGuid : '', 'Name': (res['ResponseObject']['Geo'] && res['ResponseObject']['Geo'].Name) ? res['ResponseObject']['Geo'].Name : '' },
            'Region': { 'Id': (res['ResponseObject']['Region'] && res['ResponseObject']['Region']['SysGuid']) ? res['ResponseObject']['Region'].SysGuid : '', 'Name': (res['ResponseObject']['Region'] && res['ResponseObject']['Region'].Name) ? res['ResponseObject']['Region'].Name : '' },
            'Country': { 'Id': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['Country'] && res['ResponseObject']['Address']['Country'].SysGuid) ? res['ResponseObject']['Address']['Country'].SysGuid : '', 'Name': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['Country'] && res['ResponseObject']['Address']['Country'].Name) ? res['ResponseObject']['Address']['Country'].Name : '' },
            'State': { 'Id': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['State'] && res['ResponseObject']['Address']['State'].SysGuid) ? res['ResponseObject']['Address']['State'].SysGuid : '', 'Name': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['State'] && res['ResponseObject']['Address']['State'].Name) ? res['ResponseObject']['Address']['State'].Name : '' },
            'City': { 'Id': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['City'] && res['ResponseObject']['Address']['City'].SysGuid) ? res['ResponseObject']['Address']['City'].SysGuid : '', 'Name': (res['ResponseObject']['Address'] && res['ResponseObject']['Address']['City'] && res['ResponseObject']['Address']['City'].Name) ? res['ResponseObject']['Address']['City'].Name : '' },
            'Parent': { 'Id': (res['ResponseObject']['ParentAccount'] && res['ResponseObject']['ParentAccount'].SysGuid) ? res['ResponseObject']['ParentAccount'].SysGuid : '', 'Name': (res['ResponseObject']['ParentAccount'] && res['ResponseObject']['ParentAccount'].Name) ? res['ResponseObject']['ParentAccount'].Name : '' },
            'Ultimate': { 'Id': (res['ResponseObject']['UltimateParentAccount'] && res['ResponseObject']['UltimateParentAccount'].SysGuid) ? res['ResponseObject']['UltimateParentAccount'].SysGuid : '', 'Name': (res['ResponseObject']['UltimateParentAccount'] && res['ResponseObject']['UltimateParentAccount'].Name) ? res['ResponseObject']['UltimateParentAccount'].Name : '' },
            'issecondary': res['ResponseObject']['issecondary'] || false,
            'territoryflag': res['ResponseObject']['IsTerritoryFlag'] || false
          };
          this.selectedGeoName = this.assignmentObj.Geo.Name;
          this.selectedRegionName = this.assignmentObj.Region.Name;
          this.selectedCountryName = this.assignmentObj.Country.Name;
          this.subVerticals = this.assignmentObj['SubVertical'];
          // console.log('dhghdsc', this.subVerticals);
          if (this.existCbu.length !== 0) {
            return this.existCbu.map((data, i) => {

              // this.filterCheckBox.push({'idChecked':i==0?true:false,'name': data.Name}); 
              this.filterCheckBox.push({ 'idChecked': false, 'name': data.Name });
              this.totalCBUs.push(data);
              // console.log('these are total cbus', this.totalCBUs);
              //console.log('these are total cbus', this.totalCBUs);   
            });
          }
          else {
            this.filterCheckBox['msg'] = 'No Record Found';
            this.assignmentObj['CBU'] = [];
            // console.log('this is cbu when no data', this.assignmentObj['CBU'])
          }
        }
      });
      // console.log('this.assignmentObj', this.assignmentObj);
    }
  }
  // =======
  //   createReferenceForm:FormGroup;
  //   constructor(public dialog: MatDialog, public location:Location, public service : DataCommunicationService,
  //    public userdat : DataCommunicationService,public accservive:DataCommunicationService,private _fb: FormBuilder, private el: ElementRef, public validate: ValidationService) { }
  //   /****************** wipro contact autocomplete code start ****************** */
  // >>>>>>> 8e562c37754dd79e5c2b449928a2fb7ef6288d9b

  showContact: boolean = false;
  contactName: string = '';
  contactNameSwitch: boolean = false;

  contactNameclose() {
    this.contactNameSwitch = false;
  }
  isToggled(event) {

    this.assignmentObj['issecondary'] = event.value;
    // console.log('this is from radio button', this.assignmentObj['issecondary'])
  }
  appendcontact(data, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
      this.selectedContact.push(data);
    } else {
      this.selectedContact.push({
        SysGuid: data.SysGuid,
        contact: data.FullName,
        designation: data.Designation,
        initials: ''
      });
    }
    this.sendOwnerToAdvance.push({ ...data, Id: data.SysGuid });
    this.ownerAccountSelected = data;
    this.assignmentObj['Owners']['Name'] = data.contact || data.Name || '';
    this.assignmentObj['Owners']['Id'] = data.SysGuid;

  }
  openaccountowner() {
    {
      const dialogRef = this.dialog.open(AccountOwnerPopupComponent,
        {
          disableClose:true,
          width: '380px'
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.SysGuid) {
          this.assignmentObj['Owners']['Id'] = result.SysGuid;
          this.assignmentObj['Owners']['Name'] = result.FullName;
        }
      });
    }
  }
  toastcancel() {
    this.snackBar.open('“Successfully Cancelled. ”', '', {
      duration: 5000
    });
  }



  // { index: 0, contact: 'Sini Raphael', designation: 'Marketing head', initials: 'SR', value: true },
  // { index: 1, contact: 'Sinjay Mitra', designation: 'Pre Sales Head', initials: 'SM', value: false },
  // { index: 2, contact: 'Sinoy Roy', designation: 'Pre Sales Head', initials: 'SR', value: false },
  // { index: 3, contact: 'Sini Raphael', designation: 'Pre Sales Head', initials: 'SR', value: false },




  contactSBUclose() {
    this.contactSBUSwitch = false;
  }
  /****************** Start Assignment reference method  : -AK****************** */
  // Owner
  /*********************** */
  // appendcustomerowner(data: any, i) {
  //   this.customerName = data['Name'];
  //   this.assignmentObj['Owners']['Id'] = data['Id'];
  //   console.log(this.assignmentObj);
  //   this.selectedContact.push(this.wiproContact[i])
  //   }

  clearFormData(postObj: any, emptyableObj, clearAll) {
    // clear post object
    emptyableObj.forEach((element: any, index) => {
      if (index === 0 && !clearAll)
        postObj[element]['Id'] = '';
      else
        postObj[element] = [];
    });
  }

  appendcontactSBU(data: any, i) {
    // this.contactSBU = data['Name'];
    // this.assignmentObj.push({'SBU':{'Id':data['Id']}});
    this.assignmentObj['SBU']['Id'] = data['Id'] || '';
    this.assignmentObj['SBU']['Name'] = data['Name'] || '';
  }
  appendcontactvertical(data: any, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.sub_and_vertical.findIndex(x => x.Id ? x.Id : x.SysGuid === data.Id ? data.Id : data.SysGuid);
    }
    this.sendVerticalToAdvance.push({ ...data, Id: data.Id ? data.Id : data.SysGuid });
    this.verticalSelected = data;
    console.log(data, this.sub_and_vertical[i]);
    // this.contact1Name = data['Name'];
    this.assignmentObj['Vertical']['Id'] = data['Id'] || '';
    this.assignmentObj['Vertical']['Name'] = data['Name'] || '';

    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Id'])) this.assignmentObj['SBU']['Id'] = this.sub_and_vertical[i]['SBU']['Id'];
    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Name'])) this.assignmentObj['SBU']['Name'] = this.sub_and_vertical[i]['SBU']['Name'];

    //   this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'] || '';
    // this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
  }


  removeSeletecedValue(FormControlName) {
    this.assignmentObj[FormControlName]['Id'] = '';
    this.assignmentObj[FormControlName]['Name'] = '';

  }
  appendcontactsubvertical(data: any, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.sub_and_vertical.findIndex(x => x.Id ? x.Id : x.SysGuid === data.Id ? data.Id : data.SysGuid);
    }
    // console.log('these are subverticals', this.subVerticals)
    // this.contactName2 = data['Name'];
    console.log(data, this.sub_and_vertical[i]);
    let id;
    this.sendSubVerticaltoAdvance.push({ ...data, Id: data.Id ? data.Id : data.SysGuid });
    this.subVerticalSelected = data;
    // console.log('subverticals', data);
    if (i === -1) {
      this.contactName3 = data['Name'];
      id = this.subVerticals.filter((ele) => ele.Name === data['Name']);

      this.assignmentObj['SubVertical']['Id'] = id[0].SysGuid || id[0].Id || '';
      this.assignmentObj['SubVertical']['Name'] = data['Name'] || '';
    }
    else {
      this.assignmentObj['SubVertical']['Id'] = data['Id'] || '';
      this.assignmentObj['SubVertical']['Name'] = data['Name'] || '';
    }
    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Id'])) this.assignmentObj['SBU']['Id'] = this.sub_and_vertical[i]['SBU']['Id'];
    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Name'])) this.assignmentObj['SBU']['Name'] = this.sub_and_vertical[i]['SBU']['Name'];

    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'Vertical', 'Id'])) this.assignmentObj['Vertical']['Id'] = this.sub_and_vertical[i]['Vertical']['Id'];
    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'Vertical', 'Name'])) this.assignmentObj['Vertical']['Name'] = this.sub_and_vertical[i]['Vertical']['Name'];
  }
  //CBU
  // appendcontactSearchCBU(data: any, i) {
  //   // this.contactNamecbu = data['Name'];
  //   this.clickChangeValue = false;
  //   this.assignmentObj['CBU']['Id'] = data['SysGuid'] || '';
  //   this.assignmentObj['CBU']['Name'] = data['Name'] || '';

  // }
  //GEO
  appendcontactgeo(data: any, i) {
    // this.contactName22 = data['Name'];
    // if (i == -999) {
    //   this.assignmentObj['Geo']['Id'] = data['Id'] || '';
    //   this.assignmentObj['Geo']['Name'] = data['Name'] || '';
    // } else {
    this.assignmentObj['Geo']['Id'] = data['SysGuid'] || '';
    this.assignmentObj['Geo']['Name'] = data['Name'] || '';
    this.selectedGeoName = this.assignmentObj['Geo']['Name'];
    // this.selectedRegionName = '';
    // this.selectedCountryName = '';
    if (this.assignmentObj['Geo']['Id'] === '') {
      this.assignmentObj['Geo']['Name'] = '';
    }
    // }
  }
  //Region
  appendRegionByGeo(data: any, index, advFlag) {
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.location_temp.findIndex(x => x.Region.SysGuid === data.SysGuid);
    }
    let id;
    this.sendRegiontoAdvance.push({ ...data, Id: data.SysGuid });
    this.regionSelected = data;
    console.log('jdhcsjhabcjhsdbcbj', data);
    if (i === -1) {
      this.contactName3 = data['Name'];
      id = this.regions.filter((ele) => {
        return ele.Name === data['Name'];
      });
      this.assignmentObj['Region']['Id'] = id[0].SysGuid || '';
      this.assignmentObj['Region']['Name'] = data['Name'] || '';
      this.selectedRegionName = this.assignmentObj['Region']['Name'];
      if (this.assignmentObj['Region']['Id'] === '') {
        this.assignmentObj['Region']['Name'] === '';
      }
    }
    else {
      this.contactName3 = data['Name'];
      this.assignmentObj['Region']['Id'] = data['SysGuid'] || '';
      this.assignmentObj['Region']['Name'] = data['Name'] || '';
      this.selectedRegionName = this.assignmentObj['Region']['Name'];
      if (this.assignmentObj['Region']['Id'] === '') {
        this.assignmentObj['Region']['Name'] === '';
      }
    }

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.assignmentObj['Geo']['Id'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.assignmentObj['Geo']['Name'] = this.location_temp[i]['Geo'].Name;
    this.selectedGeoName = this.assignmentObj['Geo']['Name'];
  }
  //country
  appendCountryOwnership(data: any, index, advFlag) {
    // console.log(data);
    let i;
    if (advFlag) {
      i = index;
    } else {
      i = this.location_temp.findIndex(x => x.Country.SysGuid === data.SysGuid);
      // i = this.createDropDown['country'].findIndex(x => x.Id ? x.Id : x.SysGuid === data.Id ? data.Id : data.SysGuid);
    }
    this.sendCountrytoAdvance.push({ ...data, Id: data.SysGuid });
    this.countrySelected = data;
    let id;
    if (i === -1) {
      this.contactName3 = data['Name'];
      id = this.country.filter((ele) => {
        return ele.Name === data['Name'];
      });
      this.assignmentObj['Country']['Id'] = id[0].SysGuid || '';
      this.assignmentObj['Country']['Name'] = data['Name'] || '';
      this.selectedCountryName = this.assignmentObj['Country']['Name'];
      if (this.assignmentObj['Country']['Id'] === '') {
        this.assignmentObj['Country']['Name'] === '';
      }
    }
    else {
      // this.CountryOwnershipName3 = data['Name'];
      this.assignmentObj['Country']['Id'] = data['SysGuid'] || '';
      this.assignmentObj['Country']['Name'] = data['Name'] || '';
      this.selectedCountryName = this.assignmentObj['Country']['Name'];
      if (this.assignmentObj['Country']['Id'] === '') {
        this.assignmentObj['Country']['Name'] === '';
      }
    }

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.assignmentObj['Region']['Id'] = this.location_temp[i]['Region'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.assignmentObj['Region']['Name'] = this.location_temp[i]['Region'].Name;
    this.selectedRegionName = this.assignmentObj['Region']['Name'];
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.assignmentObj['Geo']['Id'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.assignmentObj['Geo']['Name'] = this.location_temp[i]['Geo'].Name;
    this.selectedGeoName = this.assignmentObj['Geo']['Name'];

  }
  //StateByCountry
  appendcontactStateByCountry(data: any, i) {
    console.log('this is my data from state', data);
    let id;
    if (i === -1) {
      this.contactName3 = data['Name'];
      console.log('this is the state list', this.states);
      id = this.states.filter((ele) => {
        return ele['Name'] === data['Name'];
      });
      // console.log('ahbxsaxas', id)
      this.assignmentObj['State']['Id'] = id[0]['SysGuid'] || '';
      this.assignmentObj['State']['Name'] = data['Name'] || '';
    }
    else {
      // this.contactName4 = data['Name'];
      this.assignmentObj['State']['Id'] = data['SysGuid'] || '';
      this.assignmentObj['State']['Name'] = data['Name'] || '';
    }

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) this.assignmentObj['Country']['Id'] = this.location_temp[i]['Country'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) this.assignmentObj['Country']['Name'] = this.location_temp[i]['Country'].Name;

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.assignmentObj['Region']['Id'] = this.location_temp[i]['Region'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.assignmentObj['Region']['Name'] = this.location_temp[i]['Region'].Name;

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.assignmentObj['Geo']['Id'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.assignmentObj['Geo']['Name'] = this.location_temp[i]['Geo'].Name;

  }

  //City
  appendCityByState(data: any, i) {
    console.log(data);
    console.log(this.location_temp, i);
    let id;
    if (i === -1) {
      this.contactName3 = data['Name'];
      id = this.cities.filter((ele) => {
        return ele['Name'] === data['Name'];
      });
      this.assignmentObj['City']['Id'] = id[0].SysGuid || '';
      this.assignmentObj['City']['Name'] = data['Name'] || '';
    }
    else {
      // this.cityName = data['Name'];
      this.assignmentObj['City']['Id'] = data['SysGuid'] || '';
      this.assignmentObj['City']['Name'] = data['Name'] || '';
    }
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'State', 'SysGuid'])) this.assignmentObj['State']['Id'] = this.location_temp[i]['State'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'State', 'Name'])) this.assignmentObj['State']['Name'] = this.location_temp[i]['State'].Name;

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Country', 'SysGuid'])) this.assignmentObj['Country']['Id'] = this.location_temp[i]['Country'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Country', 'Name'])) this.assignmentObj['Country']['Name'] = this.location_temp[i]['Country'].Name;

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'SysGuid'])) this.assignmentObj['Region']['Id'] = this.location_temp[i]['Region'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Region', 'Name'])) this.assignmentObj['Region']['Name'] = this.location_temp[i]['Region'].Name;

    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.assignmentObj['Geo']['Id'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.assignmentObj['Geo']['Name'] = this.location_temp[i]['Geo'].Name;

  }
  //parent account
  appendcontactparent(data: any, i) {
    console.log('parent details here', data);
    // this.contactNameacc = data['Name'];
    this.assignmentObj['Parent']['Id'] = data['SysGuid'] || '';
    this.assignmentObj['Parent']['Name'] = data['Name'] || '';

  }
  //ultimate parent account
  appendcontactUltimateParent(data: any, i) {
    console.log('ultimate parent details here', data);
    // this.contactNameUltimate = data['Name'];
    this.assignmentObj['Ultimate']['Id'] = data['SysGuid'] || '';
    this.assignmentObj['Ultimate']['Name'] = data['Name'] || '';

  }


  /****************** Start Assignment reference details Search from here  Ak kk ****************** */

  //Sbu Assignment reference
  //  this.master3Api.GetAllByCity(value);
  //  this.master3Api.GetAllByState(value);
  //   this.master3Api.GetAllByCountry(value);
  //   this.master3Api.GetAllByRegion(value);
  accountOwnerSearch(event) {
    // if (data) {
    this.wiproContact = [];
    this.isActivityGroupSearchLoading = true;
    console.log('req body for owner search in assignment reference', event);
    this.accountListService.getParticipants(event).subscribe((res) => {
      if (!res['isError'] && res.ResponseObject) {

        this.isActivityGroupSearchLoading = false;
        if (res.ResponseObject.length === 0) {
          // this.assignmentObj['Owners'] = {};
          // this.assignmentObj['Owners'] = {};
          this.wiproContact['message'] = 'No record found';
        } else {

          this.wiproContact = this.getFilterData(res.ResponseObject);
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        }
      }
      else {
        this.isActivityGroupSearchLoading = false;
        // this.assignmentObj['Owners'] = {};
        this.wiproContact = [];
        this.wiproContact['message'] = 'No record found';
      }
    }, error => {
      // this.assignmentObj['Owners'] = {};
      this.isActivityGroupSearchLoading = false;
      this.wiproContact = [];
    });
    // } else {
    //   // this.assignmentObj['Owners'] = {};
    //   this.wiproContact = [];
    //   this.wiproContact['message'] = 'No record found';
    // }
  }
  getFilterData(res) {
    if (res.length !== 0) {
      return res.map((data) => {
        const initials = data.FullName.split(' ');
        return {
          initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          contact: data.FullName,
          SysGuid: data.SysGuid,
          designation: data.Designation
        };
      });
    }
  }
  checkSubvertical() {

  }
  searchSBU(val) {
    this.createDropDown.SBU = [];
    this.assignmentObj['Vertical'] = {};
    this.assignmentObj['SubVertical'] = {};
    //this.createDropDown.SBU = [];
    if (!this.accservive.searchFieldValidator(val)) {
      this.isActivityGroupSearchLoading = false;
      this.assignmentObj['SBU'] = {};
    }
    else {
      this.isActivityGroupSearchLoading = true;
      const sbubyname = this.master3Api.getSBUByName(val);
      sbubyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('sbuby name response', res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          this.createDropDown.SBU = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            this.createDropDown.SBU = [];
            this.createDropDown.SBU['message'] = 'No record found';
          }
        }
        else {
          this.createDropDown.SBU = [];
          this.createDropDown.SBU['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.SBU = [];
      });
    }

    // let SbuAPI;
    // if (this.assignmentObj['Vertical'].Id && this.assignmentObj['Vertical'].Id != '')
    //   SbuAPI = this.masterApi.GetSBUbyVertical(this.assignmentObj['Vertical'].Id, val);
    // else
    //   SbuAPI = this.masterApi.getSBUByName(val);
    // SbuAPI.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.SBU = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['SBU'] = {};
    //       this.createDropDown.SBU['message'] = 'No record found';
    //     }
    //     // this.wiproContactSBU = result.re
    //   } else {
    //     this.assignmentObj['SBU'] = {};
    //     this.createDropDown.SBU['message'] = 'No record found';
    //   }
    // })
  }
  VerticalandSBU(event) {
    this.createDropDown.Vertical = [];
    this.isActivityGroupSearchLoading = true;
    this.assignmentObj['SubVertical'] = {};
    this.assignmentObj['SBU'] = {};

    // if (!this.accservive.searchFieldValidator(event.target.value)) {
    //   this.isActivityGroupSearchLoading = false;
    //   // this.assignmentObj['Vertical'] = {};
    // }
    // else {
    this.sub_and_vertical = [];
    let vertical;
    this.createDropDown.Vertical = [];

    // let postObj = {
    //   key: 'subvertical',
    //   keyword: event.target.value,
    //   parentsIds: {
    //     'sbu': this.accservive.searchFieldValidator(this.assignmentObj['SBU']['Id']) ? this.assignmentObj['SBU']['Id'] : '',
    //   }
    // };
    // vertical = this.accountListService.getHierarchicalData(postObj);

    // if (val && val.length > 0) {
    // if (this.assignmentObj['SBU'].Id && this.accservive.searchFieldValidator(this.assignmentObj['SBU'].Id))
    //   vertical = this.master3Api.getVerticalbySBUID(this.assignmentObj['SBU'].Id, val)
    // else
    vertical = this.master3Api.SearchVerticalAndSBU(event);

    vertical.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      console.log('verticalby sbuid ', res.ResponseObject);
      if (!res.IsError && res.ResponseObject) {
        if (res.ResponseObject.length === 0) {
          this.assignmentObj['Vertical'] = {};
          this.createDropDown.Vertical = [];
          this.createDropDown.Vertical['message'] = 'No record found';
        } else {
          this.sub_and_vertical = res.ResponseObject;
          this.assignmentObj['SBU'] = {};
          this.createDropDown.Vertical = [];
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          res.ResponseObject.map(data => {
            this.createDropDown.Vertical.push(data.Vertical);
          });
        }
      }
      else {
        this.assignmentObj['Vertical'] = {};
        this.createDropDown.Vertical = [];
        this.createDropDown.Vertical['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.createDropDown.Vertical = [];
    });
    // }

    // let verAPI;
    // if (this.assignmentObj['SBU'].Id && this.assignmentObj['SBU'].Id != '')
    //   verAPI = this.masterApi.getVerticalbySBUID(this.assignmentObj['SBU'].Id, val);
    // else if (this.assignmentObj['SubVertical'].Id && this.assignmentObj['SubVertical'].Id != '')
    //   verAPI = this.masterApi.getVerticalbySBUID(this.assignmentObj['SubVertical'].Id, val);
    // else
    //   verAPI = this.masterApi.VerticalByName(val);
    // //var sbuname = this.masterApi.VerticalandSBU(this.assignmentObj['SBU'].Id, val);
    // // var sbuname = this.masterApi.VerticalandSBU(this.assignmentObj['SBU'].Id, val);
    // verAPI.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Vertical = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Vertical'] = {};
    //       this.createDropDown.Vertical['message'] = 'No record found';
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Vertical'] = {};
    //     this.createDropDown.Vertical['message'] = 'No record found';
    //   }
    // })
  }
  //SubVertical AND VERTICAL API SAME
  SubVerticalByVertical(val) {
    let subvertical;
    this.createDropDown.SubVertical = [];
    this.sub_and_vertical = [];

    if (!(this.accOwnerSwap.Vertical.touched && this.accOwnerSwap.Vertical.dirty && !this.accOwnerSwap.Vertical.invalid && !this.accOwnerSwap.SubVertical.valid)) {
      // if (!this.accservive.searchFieldValidator(val)) {
      //   this.isActivityGroupSearchLoading = false;
      //   this.assignmentObj['SubVertical'] = {};
      // }
      // else {
      this.isActivityGroupSearchLoading = true;
      if (this.accservive.searchFieldValidator(this.assignmentObj['Vertical'].Id))
        subvertical = this.master3Api.getSubVerticalByVertical(this.assignmentObj['Vertical'].Id, val);
      else
        subvertical = this.master3Api.SearchAllBySubVertical(val);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        console.log('response for subvertical', res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.assignmentObj['Vertical'].Id)) {
            this.createDropDown.SubVertical = res.ResponseObject;
            this.subverticalExists = true;
          }
          else {
            this.sub_and_vertical = res.ResponseObject;
            this.assignmentObj['Vertical'] = {};
            this.assignmentObj['SBU'] = {};
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            // this.accountCreationObj['sbu'] = '';
            // this.accountCreationObj['vertical'] = '';
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            // this.OwnDetailsForm.controls['vertical'].setValue('');
            // this.subverticaldata = [];
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            this.createDropDown.SubVertical = [];
            res.ResponseObject.map(data => {
              this.createDropDown.SubVertical.push(data.SubVertical);
              this.subverticalExists = true;
            });
            console.log(this.createDropDown.SubVertical);
          }
          if (res.ResponseObject.length === 0) {
            // this.assignmentObj['SubVertical'] = {};
            this.createDropDown.SubVertical = [];
            this.subverticalExists = false;
            this.createDropDown.SubVertical['message'] = 'No record found';
          }
        }
        else {
          // this.assignmentObj['SubVertical'] = {};
          this.createDropDown.SubVertical = [];
          this.subverticalExists = false;
          this.createDropDown.SubVertical['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.SubVertical = [];
        this.subverticalExists = false;
        this.createDropDown.SubVertical['message'] = 'No record found';
      });
    }
    // }
    else {
      this.subVerticals = [];
      subvertical = this.master3Api.getSubVerticalByVertical(this.assignmentObj['Vertical'].Id, '').subscribe((res: any) => {
        console.log('response from get subverticalbyvertical ', res);
        if (res.ResponseObject.length !== 0) {
          res.ResponseObject.map(data => {
            this.subVerticals.push(data);
            this.subverticalExists = true;
          });
          if (res.ResponseObject.length === 1) {
            this.subverticalExists = true;
            console.log('dshagdv', this.subVerticals);
            this.assignmentObj['SubVertical']['Id'] = res.ResponseObject[0].Id;
            this.assignmentObj['SubVertical']['Name'] = res.ResponseObject[0].Name;
            // console.log('avsgf', this.assignmentObj['SubVertical']);
          }
        }
        else {
          this.subVerticals = [];
          // this.subverticalExists=false;
          // this.subVerticals['msg'] = 'No record found';         
          // console.log('this is message when response object is empty', this.subVerticals['msg'])
        }
      }, error => {
        console.log('some error occured');
      });

    }
    // console.log('the value of subvertical exists', this.subVerticals.length);
    // let subVerAPI;
    // //let obj = { 'Guid': this.assignmentObj['Vertical'].Id, 'SearchText': val };
    // if (this.assignmentObj['Vertical'].Id && this.assignmentObj['Vertical'].Id != '')
    //   subVerAPI = this.masterApi.getSubVerticalByVertical(this.assignmentObj['Vertical'].Id, val);
    // else
    //   subVerAPI = this.masterApi.SubVerticalName(val);
    // subVerAPI.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.SubVertical = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['SubVertical'] = {};
    //       this.createDropDown.SubVertical['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['SubVertical'] = {};
    //     this.createDropDown.SubVertical['message'] = 'No record found';
    //   }
    // })

  }
  //CBU
  // SearchCBU(val) {
  //   this.createDropDown.SearchCBU = [];
  //   this.clickChangeValue = true;
  //   this.isActivityGroupSearchLoading = false;
  //   if (val && val.length > 0) {
  //     this.isActivityGroupSearchLoading = true;
  //     let payload = {
  //       'SearchText': val,
  //       'Guid': this.SysGuidid
  //     }
  //     var serachcbuname = this.master3Api.SearchCBU(payload);
  //     serachcbuname.subscribe((res: any) => {
  //       this.isActivityGroupSearchLoading = false;
  //       console.log('create Assignment reference details ', res.ResponseObject)
  //       if (!res['isError'] && res.ResponseObject) {
  //         this.createDropDown.SearchCBU = this.getFilterCbuData(res.ResponseObject);
  //         if (res.ResponseObject.length == 0) {
  //           this.assignmentObj['CBU'] = {};
  //           this.createDropDown.SearchCBU['message'] = 'No record found';
  //         }
  //       }
  //       else {
  //         this.assignmentObj['CBU'] = {};
  //         this.createDropDown.SearchCBU = [];
  //         this.createDropDown.SearchCBU['message'] = 'No record found';
  //       }
  //     }, error => {
  //       this.isActivityGroupSearchLoading = false;
  //       this.createDropDown.SearchCBU = [];
  //       this.createDropDown.SearchCBU['message'] = 'No record found';
  //     })
  //   }
  // if(this.existCbu.length == 0){
  //   this.assignmentObj['CBU'] = {};
  //   this.createDropDown.SearchCBU['message'] = 'No record found';
  // }else{
  //   this.createDropDown.SearchCBU = Object.assign([], this.existCbu).filter(
  //       item => item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1
  //   )
  //   if(this.createDropDown.SearchCBU == 0){
  //     this.assignmentObj['CBU'] = {};
  //     this.createDropDown.SearchCBU['message'] = 'No record found';
  //   }else{
  //     if(this.assignmentObj['CBU']['Name'] == '){
  //       this.createDropDown.SearchCBU = [];
  //       // this.createDropDown.SearchCBU['message'] = 'No record found';
  //     }else{
  //       this.createDropDown.SearchCBU = this.getFilterCbuData(this.existCbu);
  //     }
  //   }
  // }
  //}
  // cbu multi-select-checkbox selectedValue starts
  // filterCheckBox: any = [
  //   { name: 'CBU name', idChecked: false }, 
  //   { name: 'Line item 1', idChecked: false },
  //   { name: 'Line item 2', idChecked: false },
  //   { name: 'Line item 3', idChecked: false },
  //   { name: 'Line item 4', idChecked: false },
  //   { name: 'Line item 5', idChecked: false },
  // ];
  // filterCheckBox : any = this.assignmentObj.CBU;


  selectedValues(values) {
    const filteredCBUs: any = [];
    this.assignmentObj['CBU'] = [];
    // console.log('this is my filtercheckbox', this.assignmentObj.CBU);
    // console.log('these are selected CBUs',values);
    // console.log('these are total CBUs',this.totalCBUs);
    values.map((data) => {
      this.totalCBUs.map((ele) => {
        if (data.name === ele.Name) {
          filteredCBUs.push(ele);
        }
      });

    });
    console.log('this is filteredCBUs', filteredCBUs);
    if (filteredCBUs.length !== 0) {
      filteredCBUs.map((data) => {
        this.assignmentObj['CBU'].push({ 'id': data.SysGuid, 'name': data.Name });
      });
    }
    const CBUcontrol = this.accOwnerSwapForm.get('CBU');
    if (this.assignmentObj['CBU'].length <= 0) {
      CBUcontrol.setValidators([Validators.required]);
      CBUcontrol.updateValueAndValidity();
      // console.log('validation in subvertical')
      // subverticall.enable();
    }
    else {
      CBUcontrol.clearValidators();
      CBUcontrol.updateValueAndValidity();
    }
    console.log('this is assignmentObj[cbu]', this.assignmentObj['CBU']);
  }
  // cbu multi-select-checkbox selectedValue ends
  getFilterCbuData(res) {
    if (res.length !== 0) {
      return res.map((data) => {
        const initials = data.Name.split(' ');
        return {
          initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          Name: data.Name,
          SysGuid: data.SysGuid,
        };
      });
    }
  }
  //Geo
  GetGeographyByName(val) {
    if (val === '') {
      this.selectedRegionName = '';
      this.selectedCountryName = '';
    }
    //   this.assignmentObj['Region'] = {};
    //   this.assignmentObj['Country'] = {};
    //   this.assignmentObj['State'] = {};
    //   this.assignmentObj['City'] = {};
    //   this.assignmentObj['Geo'] = {};
    // }
    // console.log('sdssssss', event);
    this.createDropDown.Geo = [];
    let orginalArray;
    const temp = ['Geo', 'Region', 'Country'];
    // , 'State', 'City'];
    // if (!this.accservive.searchFieldValidator(val)) {
    //   this.isActivityGroupSearchLoading = false;
    //   this.clearFormData(this.assignmentObj, temp, true);
    // }
    // else {
    this.isActivityGroupSearchLoading = true;
    this.clearFormData(this.assignmentObj, temp, false);

    orginalArray = this.master3Api.getgeobyname(val);

    // if (this.assignmentObj['Region'].Id != '' && this.assignmentObj['Region'].Id != undefined && this.assignmentObj['Region'].Id != null) {
    //   orginalArray = this.master3Api.getgeobyregion(this.assignmentObj['Region'].Id);
    // }
    // else {
    //   this.assignmentObj['Region'] = {};
    //   this.assignmentObj['Country'] = {};
    //   this.assignmentObj['State'] = {};
    //   this.assignmentObj['City'] = {};

    //   orginalArray = this.master3Api.getgeobyname(val);
    // }
    orginalArray.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {

        if (res.ResponseObject.length === 0) {
          // this.assignmentObj['Geo'] = {};
          this.createDropDown.Geo = [];
          this.createDropDown.Geo['message'] = 'No record found';
        } else {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.createDropDown.Geo = res.ResponseObject;
        }
      }
      else {
        // this.assignmentObj['Geo'] = {};
        this.createDropDown.Geo = [];
        this.createDropDown.Geo['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.createDropDown.Geo = [];
      this.createDropDown.Geo['message'] = 'No record found';
    });
    // }
    // else if (val !== '') {
    //   var geobyreagion = this.master3Api.getgeobyname(val)
    //   geobyreagion.subscribe((res: any) => {
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.Geo = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['Geo'] = {};
    //         this.createDropDown.Geo['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['Geo'] = {};
    //       this.createDropDown.Geo['message'] = 'No record found';
    //     }
    //   })
    // }

    // // var regiongeoname = this.masterApi.RegionByGeo(this.assignmentObj['Geo'].Id, val);
    // var geographyname = this.masterApi.GetGeographyByName(val);
    // geographyname.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Geo = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Geo'] = {};
    //       this.createDropDown.Geo['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Geo'] = {};
    //     this.createDropDown.Geo['message'] = 'No record found';

    //   }
    // })
  }

  //Region
  RegionByGeo(val) {
    if (val === '') {
      this.selectedCountryName = '';
    }
    //   this.assignmentObj['Region'] = {};
    //   this.assignmentObj['Country'] = {};
    //   this.assignmentObj['Country'] = {};
    //   this.assignmentObj['City'] = {};
    // }
    let region;
    this.createDropDown.Region = [];
    this.location_temp = [];
    // console.log('region by geo', event);
    // if (val && val.length > 0) {
    //   if (this.assignmentObj['Geo'].Id != '' && this.assignmentObj['Geo'].Id != undefined && this.assignmentObj['Geo'].Id != null)
    const temp = ['Region', 'Country', 'State', 'City'];
    if (!(this.accOwnerSwap.Geo.touched && this.accOwnerSwap.Geo.dirty && !this.accOwnerSwap.Geo.invalid && !this.accOwnerSwap.Region.valid)) {
      // if (!this.accservive.searchFieldValidator(val)) {
      //   this.isActivityGroupSearchLoading = false;
      //   this.clearFormData(this.assignmentObj, temp, true);
      // }
      // else {
      this.isActivityGroupSearchLoading = true;
      this.clearFormData(this.assignmentObj, temp, false);
      if (this.accservive.searchFieldValidator(this.assignmentObj['Geo'].Id))
        region = this.master3Api.getregionbygeo(this.assignmentObj['Geo'].Id, val);
      else
        region = this.master3Api.GetAllByRegion(val);

      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('geobyreagion response', res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.assignmentObj['Geo'].Id)) {
            this.createDropDown.Region = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          }
          else {
            const formField1 = ['Geo'];
            this.clearFormData(this.assignmentObj, formField1, true);
            this.location_temp = res.ResponseObject;
            this.createDropDown.Region = [];
            res.ResponseObject.map(data => {
              this.createDropDown.Region.push(data.Region);
            });
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          }

          if (res.ResponseObject.length === 0) {
            this.assignmentObj['Region'] = {};
            // this.assignmentObj['Country'] = {};
            // this.assignmentObj['State'] = {};
            // this.assignmentObj['City'] = {};
            this.createDropDown.Region = [];
            this.createDropDown.Region['message'] = 'No record found';
          }
        }
        else {
          this.assignmentObj['Region'] = {};
          // this.assignmentObj['Country'] = {};
          // this.assignmentObj['State'] = {};
          // this.assignmentObj['City'] = {};
          this.createDropDown.Region = [];
          this.createDropDown.Region['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.Region = [];
        this.createDropDown.Region['message'] = 'No record found';
      });
      // }
    }
    else {
      this.regions = [];
      region = this.master3Api.getregionbygeo(this.assignmentObj['Geo'].Id, '').subscribe((res: any) => {
        // console.log('response from get regionbygeo ', res);
        if (res.ResponseObject.length !== 0) {
          res.ResponseObject.map(data => {
            this.regions.push(data);
          });
        }
        else {
          this.regions = [];
          this.regions['msg'] = 'No record found';
          // console.log('this is message when response object is empty', this.regions['msg'])
        }
      }, error => {
        console.log('some error occured');
      });
    }
    // else if (val != '' && this.assignmentObj['Country'].Id != '' && this.assignmentObj['Country'].Id !== undefined && this.assignmentObj['Country'].Id != null) {
    //   var regionbycountry = this.master3Api.getregionbycountry(this.assignmentObj['Country'].Id)
    //   regionbycountry.subscribe((res: any) => {
    //     console.log('regionby country response', res.ResponseObject);
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.Region = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['Region'] = {};
    //         this.assignmentObj['Country'] = {};
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.Region['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['Region'] = {};
    //       this.assignmentObj['Country'] = {};
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //        this.createDropDown.Region = {};
    //       this.createDropDown.Region['message'] = 'No record found';
    //     }
    //   })
    // }
    // else if (val !== '') {

    //   let region = this.master3Api.getregionByName(val)
    //   region.subscribe((res: any) => {
    //     console.log('regionby name response', res.ResponseObject);
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.Region = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['Region'] = {};
    //         this.assignmentObj['Country'] = {};
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.Region = {};
    //         this.createDropDown.Region['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['Region'] = {};
    //       this.assignmentObj['Country'] = {};
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //        this.createDropDown.Region = {};
    //       this.createDropDown.Region['message'] = 'No record found';
    //     }
    //   })
    // }

    //let obj = { 'Guid': this.assignmentObj['Geo'].Id, 'SearchText': val };
    // var regiongeoname = this.masterApi.RegionByGeo(this.assignmentObj['Geo'].Id, val);
    // regiongeoname.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Region = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Region'] = {};
    //       this.createDropDown.Region['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Region'] = {};
    //     this.createDropDown.Region['message'] = 'No record found';
    //   }
    // })
  }
  //Country 
  CountryByRegion(val) {
    // if (val == '') {
    //   this.assignmentObj['State'] = {};
    //   this.assignmentObj['City'] = {};
    //   this.assignmentObj['Country'] = {};
    // }
    // if (val == '') {
    //   // this.assignmentObj['Country'] = {};
    //   // this.assignmentObj['State'] = {};
    //   // this.assignmentObj['City'] = {};

    //   // this.accountCreationObj['country'] = '';
    //   // this.accountCreationObj['state'] = '';
    //   // this.accountCreationObj['city'] = '';
    //   // this.OwnDetailsForm.controls['state'].setValue('');
    //   // this.OwnDetailsForm.controls['city'].setValue('');

    // }
    // this.countrybyname = [];
    let countrybyregion;
    this.createDropDown.Country = [];
    this.location_temp = [];
    // if (val && val.length > 0) {
    //   if (this.assignmentObj['Region'].Id != '' && this.assignmentObj['Region'].Id != undefined && this.assignmentObj['Region'].Id != null)
    const temp = ['Country', 'State', 'City'];
    if (!(this.accOwnerSwap.Geo.touched && this.accOwnerSwap.Geo.dirty && !this.accOwnerSwap.Geo.invalid && !this.accOwnerSwap.Region.invalid && !(this.accOwnerSwap.Country.value === ''))) {
      // console.log('sbdh', this.accOwnerSwap.Country)
      // if (!this.accservive.searchFieldValidator(val)) {
      //   this.isActivityGroupSearchLoading = false;
      //   this.clearFormData(this.assignmentObj, temp, true);
      // }
      // else {
      this.isActivityGroupSearchLoading = true;
      this.clearFormData(this.assignmentObj, temp, false);
      if (this.accservive.searchFieldValidator(this.assignmentObj['Region'].Id))
        countrybyregion = this.master3Api.CountryByRegion(this.assignmentObj['Region'].Id, val);
      // else if(this.assignmentObj['Region']['Name']){
      //    console.log('this is id of region',this.assignmentObj['Region']['Id'] );
      //   countrybyregion = this.master3Api.CountryByRegion(this.assignmentObj['Region']['Id'], '');
      // }
      else
        countrybyregion = this.master3Api.GetAllByCountry(val);
      countrybyregion.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('countryby geo', res.ResponseObject);

        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.assignmentObj['Region'].Id)) {
            this.createDropDown.Country = res.ResponseObject;
          }
          else {
            this.location_temp = res.ResponseObject;
            const temp1 = ['Geo', 'Region'];
            this.clearFormData(this.assignmentObj, temp1, true);
            this.createDropDown.Country = [];
            res.ResponseObject.map(data => {
              this.createDropDown.Country.push(data.Country);
            });
          }
          if (res.ResponseObject.length === 0) {
            this.assignmentObj['Country'] = {};
            // this.assignmentObj['State'] = {};
            // this.assignmentObj['City'] = {};
            this.createDropDown.Country = [];
            this.createDropDown.Country['message'] = 'No record found';
          }
        }
        else {
          this.assignmentObj['Country'] = {};
          // this.assignmentObj['State'] = {};
          // this.assignmentObj['City'] = {};
          this.createDropDown.Country = [];
          this.createDropDown.Country['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.Country = [];
        this.createDropDown.Country['message'] = 'No record found';
      });
    }
    // }
    else {
      this.country = [];
      countrybyregion = this.master3Api.CountryByRegion(this.assignmentObj['Region'].Id, '').subscribe((res: any) => {
        // console.log('response from get countrybyregion ', res);
        if (res.ResponseObject.length !== 0) {
          res.ResponseObject.map(data => {
            this.country.push(data);
          });
        }
        else {
          this.country = [];
          this.country['msg'] = 'No record found';
          // console.log('this is message when response object is empty', this.country['msg'])
        }
      }, error => {
        // console.log('some error occured');
      });
    }
    // else if (val != '' && this.assignmentObj['State'].Id != '' && this.assignmentObj['State'].Id !== undefined && this.assignmentObj['State'].Id != null) {
    //   var countrybystate = this.master3Api.getcountryByState(this.assignmentObj['State'].Id)
    //   countrybystate.subscribe((res: any) => {
    //     console.log('countrybystate', res.ResponseObject);

    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.Country = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['Country'] = {};
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.Country['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['Country'] = {};
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //       this.createDropDown.Country['message'] = 'No record found';
    //     }
    //   })
    // }
    // else if (val != '') {

    //   let countryname = this.master3Api.getcountryByName(val);
    //   countryname.subscribe((res: any) => {
    //     console.log('only country response', res.ResponseObject)
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.Country = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['Country'] = {};
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.Country['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['Country'] = {};
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //       this.createDropDown.Country['message'] = 'No record found';
    //     }
    //   })
    // }


    // console.log(this.assignmentObj['Geo'].Id);
    // let obj = { 'Guid': this.assignmentObj['Geo'].Id, 'SearchText': val };
    // let countrygeoname = this.masterApi.CountryByRegion(this.assignmentObj['Region'].Id, val);
    // countrygeoname.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Country = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Country'] = {};
    //       this.createDropDown.Country['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Country'] = {};
    //     this.createDropDown.Country['message'] = 'No record found';
    //   }
    // })
  }
  //State
  StateByCountry(val) {
    // if (val == '') {
    //   this.assignmentObj['City'] = {};
    //   this.assignmentObj['State'] = {};
    // }
    // if (val == '') {
    //   // this.assignmentObj['State'] = {};
    //   // this.assignmentObj['City'] = {};
    //   // this.accountCreationObj['country'] == '';
    //   // this.accountCreationObj['city'] = '';
    //   // this.accountCreationObj['state'] = '';
    //   // this.OwnDetailsForm.controls['city'].setValue('')
    // }

    // this.statebyname = [];
    let statebycountry;
    this.location_temp = [];
    this.createDropDown.State = [];
    // if (val && val.length > 0) {
    //   if (this.assignmentObj['Country'].Id != '' && this.assignmentObj['Country'].Id !== undefined && this.assignmentObj['Country'].Id != null)
    const temp = ['State', 'City'];
    if (!(this.accOwnerSwap.Geo.touched && this.accOwnerSwap.Geo.dirty && !this.accOwnerSwap.Geo.invalid && !this.accOwnerSwap.Region.invalid && !this.accOwnerSwap.Country.invalid)) {
      if (!this.accservive.searchFieldValidator(val)) {
        this.isActivityGroupSearchLoading = false;
        this.clearFormData(this.assignmentObj, temp, true);
      }
      else {
        this.isActivityGroupSearchLoading = true;
        this.clearFormData(this.assignmentObj, temp, false);
        if (this.accservive.searchFieldValidator(this.assignmentObj['Country'].Id))
          statebycountry = this.master3Api.getStateByCountry(this.assignmentObj['Country'].Id, val);
        else
          statebycountry = this.master3Api.GetAllByState(val);

        statebycountry.subscribe((res: any) => {
          this.isActivityGroupSearchLoading = false;
          // console.log('satateby country response ', res.ResponseObject)
          if (!res.IsError && res.ResponseObject) {
            if (this.accservive.searchFieldValidator(this.assignmentObj['Country'].Id)) {
              this.createDropDown.State = res.ResponseObject;
            }
            else {
              this.location_temp = res.ResponseObject;
              this.createDropDown.State = [];
              const temp1 = ['Geo', 'Region', 'Country'];
              this.clearFormData(this.assignmentObj, temp1, true);
              res.ResponseObject.map(data => {
                this.createDropDown.State.push(data.State);
              });
            }
            if (res.ResponseObject.length === 0) {
              this.assignmentObj['State'] = {};
              // this.assignmentObj['City'] = {};
              // this.createDropDown.State = [];

              this.createDropDown.State['message'] = 'No record found';
            }
          }
          else {
            this.assignmentObj['State'] = {};
            // this.assignmentObj['City'] = {};
            this.createDropDown.State = [];
            this.createDropDown.State['message'] = 'No record found';
          }
        }, error => {
          this.isActivityGroupSearchLoading = false;
          this.createDropDown.State = [];
          this.createDropDown.State['message'] = 'No record found';
        });
      }
    }
    else {
      this.states = [];
      statebycountry = this.master3Api.getStateByCountry(this.assignmentObj['Country'].Id, '').subscribe((res: any) => {
        // console.log('response from get getStateByCountry ', res);
        if (res.ResponseObject.length !== 0) {
          res.ResponseObject.map(data => {
            this.states.push(data);
          });
        }
        else {
          this.states = [];
          this.states['msg'] = 'No record found';
          // console.log('this is message when response object is empty', this.states['msg'])
        }
      }, error => {
        // console.log('some error occured');
      });
    }
    // else if (val != '' && this.assignmentObj['City'].Id != '' || this.assignmentObj['City'].Id == undefined) {
    //   var state = this.master3Api.getstateByName(val)
    //   state.subscribe((res: any) => {
    //     console.log('state response only ', res.ResponseObject)
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.State = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.State['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //       this.createDropDown.State['message'] = 'No record found';
    //     }
    //   })
    // }
    // else if (this.assignmentObj['City'].Id !== '' || this.assignmentObj['City'].Id !== undefined) {
    //   var statebycity = this.master3Api.getstateByCity(this.assignmentObj['City'].Id)
    //   statebycity.subscribe((res: any) => {
    //     console.log('stateby city response', res.ResponseObject);
    //     if (!res.IsError && res.ResponseObject) {
    //       this.createDropDown.State = res.ResponseObject;
    //       if (res.ResponseObject.length == 0) {
    //         this.assignmentObj['State'] = {};
    //         this.assignmentObj['City'] = {};
    //         this.createDropDown.State['message'] = 'No record found';
    //       }
    //     }
    //     else {
    //       this.assignmentObj['State'] = {};
    //       this.assignmentObj['City'] = {};
    //       this.createDropDown.State['message'] = 'No record found';
    //     }
    //   })
    // }

    //let obj = { 'Guid': this.assignmentObj['Country'].Id, 'SearchText': val };
    // var statecountryoname = this.masterApi.getStateByCountry(this.assignmentObj['Country'].Id, val);
    // statecountryoname.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.State = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['State'] = {};
    //       this.createDropDown.State['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['State'] = {};
    //     this.createDropDown.State['message'] = 'No record found';
    //   }
    // })
  }
  //city html code here
  CityByState(val) {
    // if (val == '') {
    //   this.assignmentObj['City'] = {};
    // }
    this.location_temp = [];
    //  this.wiproCity1 = [];
    this.createDropDown.City = [];
    let citybyname;
    // if (val && val.length > 0) {
    //   if (this.assignmentObj['State'].Id != '' && this.assignmentObj['State'].Id != undefined && this.assignmentObj['State'].Id != null)
    const temp = ['City'];
    if (!(this.accOwnerSwap.Geo.touched && this.accOwnerSwap.Geo.dirty && !this.accOwnerSwap.Geo.invalid && !this.accOwnerSwap.Region.invalid && !this.accOwnerSwap.Country.invalid && !this.accOwnerSwap.State.invalid)) {
      if (!this.accservive.searchFieldValidator(val)) {
        this.isActivityGroupSearchLoading = false;
        this.clearFormData(this.assignmentObj, temp, true);
      }
      else {
        this.isActivityGroupSearchLoading = true;
        if (this.accservive.searchFieldValidator(this.assignmentObj['State'].Id))
          citybyname = this.master3Api.getCityByState(this.assignmentObj['State'].Id, val);
        else
          citybyname = this.master3Api.GetAllByCity(val);
        citybyname.subscribe((res: any) => {
          this.isActivityGroupSearchLoading = false;
          // console.log('city by satate response', res.ResponseObject);
          if (!res.IsError && res.ResponseObject) {
            if (this.accservive.searchFieldValidator(this.assignmentObj['State'].Id)) {
              this.createDropDown.City = res.ResponseObject;
            }
            else {
              this.createDropDown.City = [];
              this.location_temp = res.ResponseObject;
              console.log(this.location_temp);
              const temp1 = ['Geo', 'Region', 'Country', 'State'];
              this.clearFormData(this.assignmentObj, temp1, true);
              res.ResponseObject.map(data => {
                this.createDropDown.City.push(data.City);
              });
            }
            if (res.ResponseObject.length === 0) {
              this.assignmentObj['City'] = {};
              this.createDropDown.City = [];
              this.createDropDown.City['message'] = 'No record found';
            }
          }
          else {
            this.assignmentObj['City'] = {};
            this.createDropDown.City = [];
            this.createDropDown.City['message'] = 'No record found';
          }
        }, error => {
          this.isActivityGroupSearchLoading = false;
          this.createDropDown.City = [];
          this.createDropDown.City['message'] = 'No record found';
        });
      }
    }
    else {
      // console.log('this is from dropdown');
      this.cities = [];
      console.log('sysguid of state', this.assignmentObj['State'].Id);
      citybyname = this.master3Api.getCityByState(this.assignmentObj['State'].Id, '').subscribe((res: any) => {
        // console.log('response from get getCityByState ', res);
        if (res.ResponseObject.length !== 0) {
          res.ResponseObject.map(data => {
            this.cities.push(data);
          });
        }
        else {
          this.cities = [];
          this.cities['msg'] = 'No record found';
          // console.log('this is message when response object is empty', this.cities['msg'])
        }
      }, error => {
        // console.log('some error occured');
      });
    }
    // else if (val !== '' && !this.assignmentObj['State'].Id) {
    // let city=  this.master3Api.GetAllByCity(val);
    //   // var city = this.master3Api.getcityByName(val)
    //   // city.subscribe((res: any) => {
    //   //   console.log('city response only', res.ResponseObject);

    //   //   if (!res.IsError && res.ResponseObject) {
    //   //     this.createDropDown.City = res.ResponseObject;
    //   //     if (res.ResponseObject.length == 0) {
    //   //       this.assignmentObj['City'] = {};
    //   //       this.createDropDown.City['message'] = 'No record found';
    //   //     }
    //   //   }
    //   //   else {
    //   //     this.assignmentObj['City'] = {};
    //   //     this.createDropDown.City['message'] = 'No record found';
    //   //   }
    //   // })
    // }

    // // console.log(this.assignmentObj['State'].Id);
    // // let obj = { 'Guid': this.assignmentObj['State'].Id, 'SearchText': val };
    // var serachcitystate = this.masterApi.CityByState(this.assignmentObj['State'].Id, val);
    // serachcitystate.subscribe((res: any) => {
    //   console.log('create Assignment reference details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.City = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['City'] = {};
    //       this.createDropDown.City['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['City'] = {};
    //     this.createDropDown.City['message'] = 'No record found';
    //   }
    // })
  }
  //Parent account
  SearchAccount(val) {
    this.createDropDown.Parent = [];
    if (this.accservive.searchFieldValidator(val)) {
      this.isActivityGroupSearchLoading = true;
      const getparentaccount = this.master3Api.getparentaccount(val);
      getparentaccount.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        // console.log('parent account rsponse ', res.ResponseObject)
        if (!res.IsError && res.ResponseObject) {
          this.createDropDown.Parent = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            this.assignmentObj['Parent'] = {};
            this.createDropDown.Parent = [];
            this.createDropDown.Parent['message'] = 'No record found';
          }
        }
        else {
          this.assignmentObj['Parent'] = {};
          this.createDropDown.Parent = [];
          this.createDropDown.Parent['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.Parent = [];
        this.createDropDown.Parent['message'] = 'No record found';
      });
    } else {
      this.assignmentObj['Parent'] = {};
    }
    // var parentname = this.masterApi.SearchAccount(val);
    // parentname.subscribe((res: any) => {
    //   console.log('parent details ', res.ResponseObject)
    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Parent = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Parent'] = {};
    //       this.createDropDown.Parent['message'] = 'No record found';
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Parent'] = {};
    //     this.createDropDown.Parent['message'] = 'No record found';
    //   }
    // })
  }
  //ultimate account
  UltimateParentAccount(val) {
    this.createDropDown.Ultimate = [];

    if (this.accservive.searchFieldValidator(val)) {
      this.isActivityGroupSearchLoading = true;
      const getparentaccount = this.master3Api.getparentaccount(val);
      getparentaccount.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          this.createDropDown.Ultimate = res.ResponseObject;
          if (res.ResponseObject.length === 0) {
            this.assignmentObj['Ultimate'] = {};
            this.createDropDown.Ultimate = [];
            this.createDropDown.Ultimate['message'] = 'No record found';
          }
        }
        else {
          this.assignmentObj['Ultimate'] = {};
          this.createDropDown.Ultimate = [];
          this.createDropDown.Ultimate['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.createDropDown.Ultimate = [];
        this.createDropDown.Ultimate['message'] = 'No record found';
      })
    } else {
      this.assignmentObj['Ultimate'] = {};
    }
    // var ultimateparentname = this.masterApi.SearchAccount(val);
    // ultimateparentname.subscribe((res: any) => {

    //   if (!res['isError'] && res.ResponseObject) {
    //     this.createDropDown.Ultimate = res.ResponseObject;
    //     if (res.ResponseObject.length == 0) {
    //       this.assignmentObj['Ultimate'] = {};
    //       this.createDropDown.Ultimate['message'] = 'No record found';
    //       console.log('ultimate parent details ', this.createDropDown.Ultimate);
    //       // this.wiproContactSBU = result.re
    //     }
    //   }
    //   else {
    //     this.assignmentObj['Ultimate'] = {};
    //     this.createDropDown.Ultimate['message'] = 'No record found';
    //   }
    // })
  }

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
    // let Guid ='';
    // this.lookupdata.Guid = this.accountCreationObj[controlName] ?  this.accountCreationObj[controlName]  : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null, rowData: headerdata, rowIndex: index, rowLine: line, assignmentRef: true }).subscribe(res => {
      this.lookupdata.tabledata = res;
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose:true,
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
      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData }, assignmentRef: true }).subscribe(res => {
        this.lookupdata.isLoader = false;
        // console.log('resresresresresresresresresresresresresresresresresres', res)
        if (x.action === 'loadMore') {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.location_temp = res.ResponseObject;

        } else if (x.action === 'search') {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.location_temp = res.ResponseObject;
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
        console.log(result);
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
      countryId: this.assignmentObj['Country']['Id'] ? this.assignmentObj['Country']['Id'] : '',
      regionId: this.assignmentObj['Region']['Id'] ? this.assignmentObj['Region']['Id'] : '',
      geoId: this.assignmentObj['Geo']['Id'] ? this.assignmentObj['Geo']['Id'] : '',
      verticalId: this.assignmentObj['Vertical']['Id'] ? this.assignmentObj['Vertical']['Id'] : '',

    };
    //   Owners': {},
    //  'SBU': {},
    //  'Vertical': {},
    //  'SubVertical': {},
    //  'CBU': {},
    //  'Geo': {},
    //  'Region': {},
    //  'Country': {},
  }


  emptyArray(controlName) {
    switch (controlName) {

      // case 'sbu': {
      //   return this.sendSbuToAdvance = [], this.sbuAccountSelected = []
      // }
      case 'Assignmentowner': {
        return this.sendOwnerToAdvance = [], this.ownerAccountSelected = [];
      }
      case 'Assignmentvertical': {
        return this.sendVerticalToAdvance = [], this.verticalSelected = [];
      }
      case 'Assignmentsubvertical': {
        return this.sendSubVerticaltoAdvance = [], this.subVerticalSelected = [];
      }

      case 'Assignmentgeography': {
        return this.sendGeographytoAdvance = [], this.geographySelected = [];
      }
      case 'Assignmentregion': {
        return this.sendRegiontoAdvance = [], this.regionSelected = [];
      }
      case 'Assignmentcountry': {
        return this.sendCountrytoAdvance = [], this.countrySelected = [];
      }

    }
  }


  selectedLookupData(controlName) {
    switch (controlName) {
      case 'Assignmentowner': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : []; }
      // case 'sbu': { return (this.sendSbuToAdvance.length > 0) ? this.sendSbuToAdvance : [] }
      case 'Assignmentvertical': { return (this.sendVerticalToAdvance.length > 0) ? this.sendVerticalToAdvance : []; }
      case 'Assignmentsubvertical': { return (this.sendSubVerticaltoAdvance.length > 0) ? this.sendSubVerticaltoAdvance : []; }
      case 'Assignmentgeography': { return (this.sendGeographytoAdvance.length > 0) ? this.sendGeographytoAdvance : []; }
      case 'Assignmentregion': { return (this.sendRegiontoAdvance.length > 0) ? this.sendRegiontoAdvance : []; }
      case 'Assignmentcountry': { return (this.sendCountrytoAdvance.length > 0) ? this.sendCountrytoAdvance : []; }


      default: { return []; }
    }
  }

  createTempData() {
    return {
      owner: this.ownerAccountSelected,
      // sbu: this.sbuAccountSelected,
      Assignmentvertical: this.verticalSelected,
      Assignmentsubvertical: this.subVerticalSelected,
      Assignmentgeography: this.geographySelected,
      Assignmentregion: this.regionSelected,
      Assignmentcountry: this.countrySelected,
    };
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data);
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'Assignmentowner': (data) => { this.appendcontact(data, '', false); },
    // 'sbu': (data) => { this.appendcontactSBU(data, false), this.removeVerticalAndSbuverticalData('', true, data) },
    'Assignmentvertical': (data) => { this.appendcontactvertical(data, '', false); },
    'Assignmentsubvertical': (data) => { this.appendcontactsubvertical(data, '', false); },
    'Assignmentgeography': (data) => { this.appendcontactgeo(data, false); },
    'Assignmentregion': (data) => { this.appendRegionByGeo(data, '', false); },
    'Assignmentcountry': (data) => { this.appendCountryOwnership(data, '', false); },
  }
  removeVerticalAndSbuverticalData(emptyvalue, advanceflag, selectedData?) {
    if (!advanceflag) {
      if (emptyvalue === '') {
        // this.accountCreationObj['sbu'] = '';
        // this.OwnDetailsForm.controls['sbu'].setValue('');
        // this.accountCreationObj['vertical'] = '';
        // this.OwnDetailsForm.controls['vertical'].setValue('');
        // this.accountCreationObj['subvertical'] = '';
        // this.OwnDetailsForm.controls['subvertical'].setValue('');
      }
    } else {
      // this.accountCreationObj['vertical'] = '';
      // this.OwnDetailsForm.controls['vertical'].setValue('');
      // this.accountCreationObj['subvertical'] = '';
      // this.OwnDetailsForm.controls['subvertical'].setValue('');
    }
  }
  //Assignment reference details Search end here

  wiproContactSBU: {}[] = [

    { index: 0, contact: '123451234', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact8: {}[] = [];



  /****************** SBU autocomplete code end ****************** */
  /****************** vertical autocomplete code start ****************** */

  showContact1: boolean = false;
  contact1Name: string = '';
  contact1NameSwitch: boolean = true;

  contact1Nameclose() {
    this.contact1NameSwitch = false;
  }
  // appendcontact1(value: string, i) {
  //   this.contact1Name = value;
  //   this.selectedContact1.push(this.wiproContact1[i])
  // }
  wiproContact1: {}[] = [

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact1: {}[] = [];

  /****************** vertical autocomplete code end ****************** */
  /****************** Sub Vertical autocomplete code start ****************** */

  showContact2: boolean = false;
  contactName2: string = '';
  contactNameSwitch2: boolean = true;

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }
  // appendcontact2(value: string, i) {
  //   this.contactName2 = value;
  //   this.selectedContact2.push(this.wiproContact2[i])
  // }
  wiproContact2: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact2: {}[] = [];

  /****************** Sub Vertical  autocomplete code end ****************** */

  /****************** Geo autocomplete code start ****************** */

  showContact22: boolean = false;
  contactName22: string = '';
  contactNameSwitch22: boolean = true;

  contactNameclose22() {
    this.contactNameSwitch22 = false;
    this.assignmentObj['Geo']['Name'] = this.selectedGeoName
  }
  // appendcontact22(value: string, i) {
  //   this.contactName22 = value;
  //   this.selectedContact22.push(this.wiproContact22[i])
  // }
  wiproContact22: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact22: {}[] = [];

  /****************** Geo  autocomplete code end ****************** */

  /****************** Region autocomplete code start ****************** */

  showContact3: boolean = false;
  contactName3: string = '';
  contactNameSwitch3: boolean = true;

  contactNameclose3() {
    this.contactNameSwitch3 = false;
    this.assignmentObj['Region']['Name'] = this.selectedRegionName;
  }
  // appendcontact3(value: string, i) {
  //   this.contactName3 = value;
  //   this.selectedContact3.push(this.wiproContact3[i])
  // }
  wiproContact3: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact3: {}[] = [];

  /****************** Region  autocomplete code end ****************** */
  /****************** state autocomplete code start ****************** */

  showContact4: boolean = false;
  contactName4: string = '';
  contactNameSwitch4: boolean = true;

  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  // appendcontact4(value: string, i) {
  //   this.contactName4 = value;
  //   this.selectedContact4.push(this.wiproContact4[i])
  // }
  wiproContact4: {}[] = [

    { index: 0, contact: 'abc', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'asas Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'sasa Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedContact4: {}[] = [];

  /****************** state  autocomplete code end ****************** */
  /****************** city autocomplete code start ****************** */

  showCity: boolean = false;
  cityName: string = '';
  cityNameSwitch: boolean = true;

  cityNameclose() {
    this.cityNameSwitch = false;
  }
  // appendcity(value: string, i) {
  //   this.cityName = value;
  //   this.selectedCity.push(this.wiproCity[i])
  // }
  wiproCity: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Bangalore', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Mumbai', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedCity: {}[] = [];

  /****************** city  autocomplete code end ****************** */
  /****************** country ownership details autocomplete code start ****************** */
  showCountryOwnership3: boolean = false;
  CountryOwnershipName3: string = '';
  CountryOwnershipNameSwitch3: boolean = true;

  CountryOwnershipNameclose3() {
    this.CountryOwnershipNameSwitch3 = false;
    this.assignmentObj['Country']['Name'] = this.selectedCountryName;
  }
  // appendCountryOwnership3(value: string, i) {
  //   this.CountryOwnershipName3 = value;
  //   this.selectedCountryOwnership3.push(this.wiproCountryOwnership3[i])
  // }
  wiproCountryOwnership3: {}[] = [

    { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCountryOwnership3: {}[] = [];

  /****************** country ownership details  autocomplete code end ****************** */
  /****************** cbu autocomplete code start ****************** */

  showContactcbu: boolean = false;
  contactNamecbu: string = '';
  contactNameSwitchcbu: boolean = true;
  clickChangeValue: boolean = false;
  contactNameclosecbu() {
    if (this.clickChangeValue)
      this.assignmentObj['CBU'] = {};
    this.contactNameSwitchcbu = false;
  }
  // appendcontactCBU(value: string, i) {
  //   this.contactNamecbu = value;
  //   // this.selectedContactcbu.push(this.wiproContactcbu[i])
  // }
  // wiproContactcbu: {}[] = [

  //   { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  selectedContactcbu: {}[] = [];

  /****************** cbu  autocomplete code end ****************** */
  /****************** Parent account autocomplete code start ****************** */

  showContactacc: boolean = false;
  contactNameacc: string = '';
  contactNameSwitchacc: boolean = true;

  contactNamecloseacc() {
    this.contactNameSwitchacc = false;
  }
  // appendcontactacc(value: string, i) {
  //   this.contactNameacc = value;
  //   this.selectedContactacc.push(this.wiproContactacc[i])
  // }
  wiproContactacc: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContactacc: {}[] = [];

  /****************** Parent account  autocomplete code end ****************** */
  /******************ultimate Parent account autocomplete code start ****************** */

  showContactUltimate: boolean = false;
  contactNameUltimate: string = '';
  contactNameSwitchUltimate: boolean = true;

  contactNamecloseUltimate() {
    this.contactNameSwitchUltimate = false;
  }
  // appendcontactUltimate(value: string, i) {
  //   this.contactNameUltimate = value;
  //   this.selectedContactUltimate.push(this.wiproContactUltimate[i])
  // }
  wiproContactUltimate: {}[] = [

    { index: 0, contact: 'California', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContactUltimate: {}[] = [];

  /******************ultimate Parent account  autocomplete code end ****************** */
  ngOnInit() {
    this.FetchReferenceAccountDetails();
    console.log(this.assignmentObj);

    this.accOwnerSwapForm = this._fb.group({
      Owners: ['', Validators.required],
      SBU: ['', Validators.required],
      Vertical: ['', Validators.required],
      SubVertical: ['', Validators.required],
      Geo: ['', Validators.required],
      Region: ['', Validators.required],
      State: [''],
      City: [''],
      Country: [''],
      CBU: [''],
      // Parent: [''],
      // Ultimate: [''],
      // ownerShipType: ['', Validators.required]
    });

    this.accOwnerSwapForm.get('Geo').valueChanges.subscribe(res => {
      if (res === '') {
        this.selectedGeoName = '';
        this.assignmentObj['Geo']['Id'] = '';
        this.assignmentObj['Geo']['Name'] = '';
        this.assignmentObj['Region']['Id'] = '';
        this.assignmentObj['Region']['Name'] = '';
        this.assignmentObj['Country']['Id'] = '';
        this.assignmentObj['Country']['Name'] = '';
      }
    });
    this.accOwnerSwapForm.get('Region').valueChanges.subscribe(res => {
      if (res === '') {
        this.selectedRegionName = '';
        this.assignmentObj['Region']['Id'] = '';
        this.assignmentObj['Region']['Name'] = '';
        this.assignmentObj['Country']['Id'] = '';
        this.assignmentObj['Country']['Name'] = '';
      }
    })
    // console.log('sjhbasdghcvdhs', this.existCbu);
    // if (this.existCbu.length != 0) { 
    //   console.log('sjhbasdghcvdhs', this.existCbu);
    //   this.existCbu.forEach(data => {
    //     this.filterCheckBox.push(data);
    //   });
    // }
    // console.log('this is my filterchecklist', this.filterCheckBox);

    this.formsData = {
      Owners: ''
    };

  }
  goBack() {
    this.router.navigate(['/accounts/assignmentRef/assigactiverequest']);
    //this.location.back();
  }

  OpenAccountOwner1() {
    const dialogRef = this.dialog.open(OpenAccountOwner1,
      {
        disableClose:true,
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.accOwnerSwap);
        this.formsData.owner = result[0].contact;
      }

    });
  }

  openSubmitPopup1(obj) {
    const dialogRef = this.dialog.open(ConfirmSubmit1,
      {
        disableClose:true,
        width: '380px',
        data: {
          dataKey: this.assignmentObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = true;
      console.log(result);

      if (this.accservive.searchFieldValidator(result)) {
        obj['comments'] = result;
        obj['requestedby'] = this.userId;
        this.isLoading = true;
        this.accountListService.AssignmentReference(obj).subscribe((result: any) => {
          this.isLoading = false;
          if (result['status'] === 'success') {
            this.snackBar.open(result.data[0].Status, '', {
              duration: 5000
            });
            const obj1: any = {
              'SysGuid': result.data[0].assignmentReferencesid,
              'ProcessGuid': result.data[0].processinstanceid
            };
            this.accountListService.AssignUdateCamunddaCRM(obj1).subscribe(res => {
              console.log(res);
              this.isLoading = false;
              // this.snackBar.open('Assignment reference for ' + this.assignmentObj.accountName + ' , ' + this.assignmentObj.accountNumber + ' has been successfully submitted.', '', {
              //   duration: 5000
              // });
            });

            this.router.navigate(['/accounts/assignmentRef/assigactiverequest']);
          }
          else {
            const Message = result['message'];
            const msg = Message.split(' ').splice(-2);
            if (msg[0] === 'Access' && msg[1] === 'denied') {
              this.snackBar.open('You do not have access to this account.Please gain access for this account to proceed further.', '', {
                duration: 5000
              });
            }
            else {
              this.isLoading = false;
              this.snackBar.open(result.message, '', {
                duration: 5000
              });
            }
          }
        }, error => {
          const Message = error['message'];
          if (Message === ' Access denied') {
            this.isLoading = false;
            this.snackBar.open('You do not have access to this account.Please gain access for this account to proceed further.', '', {
              duration: 5000
            });
          }
          else {
            this.isLoading = false;
            this.snackBar.open(error.message, '', {
              duration: 5000
            });
          }
        });
      } else {
        this.isLoading = false;
        this.snackBar.open(result.message, '', {
          duration: 5000
        });
      }
    })
  }

  // convenience getter for easy access to form fields
  get prosForm() { return this.prospectAccForm.controls; }
  get accOwnerSwap() { return this.accOwnerSwapForm.controls; }
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  setterritoryflag(e) {
    console.log(e, 'KUNAL====================================>');
    this.assignmentObj['territoryflag'] = e.checked;

  }
  setsecondary(e) {
    console.log(e, 'KUNAL====================================>');

    this.assignmentObj['issecondary'] = e.checked;
  }
  postObjValidator(obj) {
    const keys = Object.keys(obj);
    keys.map(function (k) {
      if (typeof obj[k] !== 'boolean') {
        if (!obj[k])
          delete obj[k];
      }
    })
    return obj;
  }

  // checkDataChange(){

  //   if(this.accountDetails){
  //     let data = this.accountDetails;
  //     console.log('this is account details',this.accountDetails);
  //     console.log('this is assign obj',this.assignmentObj);
  //     if(((data.SBU)?data.SBU.Id !== this.assignmentObj['SBU'].Id: false || (data.SubVertical)?data.SubVertical.Id != this.assignmentObj['SubVertical'].Id: false ||
  //     (data.Vertical)?data.Vertical.Id != this.assignmentObj['Vertical'].Id:false || (data.Geo)?data.Geo.SysGuid != this.assignmentObj['Geo'].Id:false ||
  //     (data.Region)?data.Region.SysGuid != this.assignmentObj['Region'].Id:false ||(data.Address.Country.SysGuid)? data.Address.Country.SysGuid != this.assignmentObj['Country'].Id:false) && (this.accOwnerSwapForm.dirty && this.accOwnerSwapForm.touched)){
  //      this.checkDataChanges =true;
  //     }else{
  //       this.checkDataChanges =false;
  //     }
  //   }
  // }
  isDuplicateCheck() {
    const subverticall1 = this.accOwnerSwapForm.get('SubVertical');
    const CBUcontrol = this.accOwnerSwapForm.get('CBU');

    // console.log('this is the control of subvertical', subverticall1)
    // console.log('this subVerticals.length', this.subVerticals, this.createDropDown.SubVertical);
    // console.log('data in subvertical array', this.subVerticals);
    if ((this.subVerticals.length === 0) && (this.createDropDown.SubVertical.length === 0)) {
      this.accOwnerSwapForm.controls['SubVertical'].setValidators([]);
      this.accOwnerSwapForm.controls['SubVertical'].updateValueAndValidity();
      // subverticall1.setValidators([Validators.required]);
      // subverticall1.updateValueAndValidity();
      console.log('else validation in subvertical', subverticall1)
      // subverticall.enable();
    }
    else {
      this.accOwnerSwapForm.controls['SubVertical'].setValidators([Validators.required]);
      this.accOwnerSwapForm.controls['SubVertical'].updateValueAndValidity();
      // subverticall1.setValidators([]);
      // subverticall1.clearValidators();
      // subverticall1.updateValueAndValidity();
      // subverticall.disable();
      console.log('validation in subvertical', subverticall1);
    }

    if (this.assignmentObj['CBU'].length <= 0) {
      CBUcontrol.setValidators([Validators.required]);
      CBUcontrol.updateValueAndValidity();
      // console.log('validation in cbu', CBUcontrol)
      // subverticall.enable();
    }
    else {
      CBUcontrol.clearValidators();
      CBUcontrol.updateValueAndValidity();
    }
    if (this.submitted && this.accOwnerSwap.CBU.errors && this.accOwnerSwap.CBU.errors.required) {
      this.cbuBorderRed = true;
    }
    console.log('create object assignment', this.assignmentObj);

    const obj2 = {
      'SysGuid': this.SysGuidid,
      'Owner': { 'SysGuid': (this.assignmentObj['Owners'].Id !== 'NA') ? this.assignmentObj['Owners'].Id : '' },
      'SBU': { 'Id': (this.assignmentObj['SBU'].Id !== 'NA') ? this.assignmentObj['SBU'].Id : '' },
      'Vertical': { 'Id': (this.assignmentObj['Vertical'].Id !== 'NA') ? this.assignmentObj['Vertical'].Id : '' },
      'SubVertical': { 'Id': (this.assignmentObj['SubVertical'].Id !== 'NA') ? this.assignmentObj['SubVertical'].Id : '' },
      'Geo': { 'SysGuid': (this.assignmentObj['Geo'].Id !== 'NA') ? this.assignmentObj['Geo'].Id : '' },
      'Region': { 'SysGuid': (this.assignmentObj['Region'].Id) !== 'NA' ? this.assignmentObj['Region'].Id : '' },
      'Address': { 'Country': { 'SysGuid': (this.assignmentObj['Country'].Id !== 'NA') ? this.assignmentObj['Country'].Id : '' } },
      'IsSecondary': this.assignmentObj['issecondary'] || false
    };
    const obj: any = {};
    obj['cbu'] = this.assignmentObj['CBU'] ? this.assignmentObj['CBU'] : [];
    if (this.accOwnerSwapForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelectorAll('select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        for (let i = invalidElements.length - 1; i >= 0; i--) {
          invalidElements[i].focus();
        }
        invalidElements[0].blur();
        this.scrollTo(invalidElements[0]);
      }
    }
    else if (obj['cbu'].length === 0) {
      console.log('entered here');
      if (this.totalCBUs.length === 0) {
        console.log('also enetered here');
        this.snackBar.open('“There are no CBUs for this account. Please add CBU before requesting assignment reference for this account”', '', {
          duration: 5000
        });
      }
      else {
        this.snackBar.open('“Please select CBU before requesting assignment reference for this account”', '', {
          duration: 5000
        });
      }
    }
    else {
      this.accountListService.CheckAssignmentDuplication(obj2).subscribe(res => {
        console.log('response from checkduplication', res);
        this.isDuplicate = res['ResponseObject']['isExist'];
        this.RANumber = res['ResponseObject']['RANumber'];
        if (this.isDuplicate) {
          console.log('entered here first1')
          this.snackBar.open('“An assignment reference already exists for this user.Please edit the existing reference. ”', '', {
            duration: 5000
          });
        }
        else {
          // console.log('entered here first2')
          this.onSubmit();
        }
      });
    }
  }


  onSubmit() {
    const subverticall = this.accOwnerSwapForm.get('SubVertical');
    // console.log('this is the control of subvertical', subverticall)
    // console.log('this subVerticals.length', this.subVerticals, this.createDropDown.SubVertical)
    if ((this.subVerticals.length > 0) || (this.createDropDown.SubVertical.length > 0)) {
      subverticall.setValidators([Validators.required]);
      subverticall.updateValueAndValidity();
      // console.log('validation in subvertical', subverticall)
      // subverticall.enable();
    }
    else {
      // subverticall.setValidators([]);
      subverticall.clearValidators();
      subverticall.updateValueAndValidity();
      // subverticall.disable();
      // console.log('else validation in subvertical', subverticall)
    }
    // console.log('create object assignment', this.assignmentObj);


    // console.log('form changes', this.accOwnerSwapForm.dirty ,this.accOwnerSwapForm.touched);
    // let obj = {
    //     'Owners': this.assignmentObj['Owners'].Id || '',
    //     'SBU': this.assignmentObj['SBU'].Id || '',
    //     'Vertical': this.assignmentObj['Vertical'].Id || '',
    //     'SubVertical': this.assignmentObj['SubVertical'].Id || '',
    //     'SearchCBU': this.assignmentObj['SearchCBU'].Id || '',
    //     'Geo': this.assignmentObj['Geo'].Id || '',
    //     'Region': this.assignmentObj['Region'].Id || '',
    //     'Country': this.assignmentObj['Country'].Id || '',
    //     'State': this.assignmentObj['State'].Id || '',
    //     'City': this.assignmentObj['City'].Id || '',
    //     'Parent': this.assignmentObj['Parent'].Id || '',
    //     'Ultimate': this.assignmentObj['Ultimate'].Id || '',
    // }

    // let obj = {
    //   'SysGuid': this.SysGuidid,
    //   'Owner': {
    //     'SysGuid': this.assignmentObj['Owners'].Id || ''
    //   },
    //   'SBU': {
    //     'Id': this.assignmentObj['SBU'].Id || ''
    //   },
    //   'Vertical': {
    //     'Id': this.assignmentObj['Vertical'].Id || ''
    //   },
    //   'SubVertical': {
    //     'Id': this.assignmentObj['SubVertical'].Id || ''
    //   },
    //   'CBU': {
    //     'SysGuid': this.assignmentObj['CBU'].Id || ''
    //   },
    //   'ParentAccount': {
    //     'SysGuid': this.assignmentObj['Parent'].Id || ''
    //   },
    //   'UltimateParentAccount': {
    //     'SysGuid': this.assignmentObj['Ultimate'].Id || ''
    //   },
    //   'Geo': {
    //     'SysGuid': this.assignmentObj['Geo'].Id || ''
    //   },
    //   'Address': {
    //     'Region': {
    //       'SysGuid': this.assignmentObj['Region'].Id || ''
    //     },
    //     'Country': {
    //       'SysGuid': this.assignmentObj['Country'].Id || ''
    //     },
    //     'State': {
    //       'SysGuid': this.assignmentObj['State'].Id || ''
    //     },
    //     'City': {
    //       'SysGuid': this.assignmentObj['City'].Id || ''
    //     }
    //   }
    // }  

    //if value of cbu is not changed, then first cbu in the list will be sent in post object
    // if( this.assignmentObj['CBU'].length == 0 && this.totalCBUs.length>0 ){ 
    //   this.assignmentObj['CBU'] =[];
    //   this.assignmentObj['CBU'].push({'id': this.totalCBUs[0].SysGuid,'name': this.totalCBUs[0].Name});
    // }
    if (this.accountDetails) {
      const data = this.accountDetails;
      console.log('this is account details', this.accountDetails);
      console.log('this is assign obj', this.assignmentObj);
      if ((data.SBU.Id !== this.assignmentObj['SBU'].Id || data.SubVertical.Id !== this.assignmentObj['SubVertical'].Id ||
        data.Vertical.Id !== this.assignmentObj['Vertical'].Id || data.Geo.SysGuid !== this.assignmentObj['Geo'].Id ||
        data.Region.SysGuid !== this.assignmentObj['Region'].Id || data.Address.Country.SysGuid !== this.assignmentObj['Country'].Id)) {
        this.ischangesprimaryvalue = true;
      } else {
        this.ischangesprimaryvalue = false;
      }
    }
    // let ischangesprimaryvalue: boolean = false;
    // if (this.accOwnerSwapForm.dirty && this.accOwnerSwapForm.touched) {
    //   ischangesprimaryvalue = true;
    // }
    // if (this.checkDataChanges) {
    //   ischangesprimaryvalue = true;
    // }
    // else {

    // }
    // console.log('this is cbu when no data in on submit', this.assignmentObj['CBU']);
    const obj = {
      'ownerid': this.assignmentObj['Owners'].Id || '',
      'sbu': this.assignmentObj['SBU'].Id || '',
      'subvertical': this.assignmentObj['SubVertical'].Id || '',
      'cbu': this.assignmentObj['CBU'] || [],
      'oldcbu': [],
      'vertical': this.assignmentObj['Vertical'].Id || '',
      // 'parentaccount': this.assignmentObj['Parent'].Id || '',
      'ultimateparent': this.assignmentObj['Ultimate'].Id || '',
      'parentaccount': '',
      'geography': this.assignmentObj['Geo'].Id || '',
      'region': this.assignmentObj['Region'].Id || '',
      'country': this.assignmentObj['Country'].Id || '',
      'state': '',
      // 'city': this.assignmentObj['City'].Id || '',
      'comments': '',
      'accountid': this.SysGuidid,
      'rrquesttpe': 184450000,
      'statuscode': 184450000,
      'issecondary': this.assignmentObj['issecondary'] || false,
      'territoryflag': this.assignmentObj['territoryflag'] || false,
      'requestedby': '',
      'ischangesprimaryvalue': this.ischangesprimaryvalue
    };
    console.log(obj);
    const postobj = this.postObjValidator(obj);

    if (this.accOwnerSwapForm.invalid) {
      this.submitted = true;
      const invalidElements = this.el.nativeElement.querySelectorAll('select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        for (let i = invalidElements.length - 1; i >= 0; i--) {
          invalidElements[i].focus();
        }
        invalidElements[0].blur();
        this.scrollTo(invalidElements[0]);
      }
    }
    else if (obj['cbu'].length === 0) {
      console.log('entered here');
      if (this.totalCBUs.length === 0) {
        console.log('also enetered here');
        this.snackBar.open('“There are no CBUs for this account. Please add CBU before requesting assignment reference for this account”', '', {
          duration: 5000
        });
      }
      else {
        this.snackBar.open('“Please select CBU before requesting assignment reference for this account”', '', {
          duration: 5000
        });
      }
    }
    else {
      // console.log('this is cbu obj', obj['cbu'])
      this.openSubmitPopup1(postobj);
    }

  }
}

@Component({
  selector: 'account-owner',
  templateUrl: './addaccountowner-popup.html',
})

export class OpenAccountOwner1 {
  constructor(public dialogRef: MatDialogRef<OpenAccountOwner1>, public accservive: DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  close = false;
  /****************** customer contact autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = '';
  customerNameSwitch: boolean = true;

  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }

  // appendcustomer(value: string, i) {

  //   this.customerName = value;
  //   this.selectedCustomer.push(this.customerContact[i])
  // }

  customerContact: {}[] = [

    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ];

  selectedCustomer: {}[] = [];

  assignRefData: any;
  reqRefData: any;
  /****************** customer contact autocomplete code end ****************** */

  closeDiv(item: any) {
    //this.close=true;
    this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index !== item.index);
  }
  closepop() {
    this.dialogRef.close(this.selectedCustomer);
  }

}


@Component({
  selector: 'confirm-submit',
  templateUrl: './confirmreference-popup.html',
})

export class ConfirmSubmit1 {
  // accountdetails = [];
  refcomment: string = '';
  constructor(private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmSubmit1>, public service: DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    console.log('this.data for assignment ref', this.data);
  }
  submitAssignmentRef() {
    if (this.refcomment !== '') {
      this.dialogRef.close(this.refcomment);
    } else {
      this.snackBar.open('Additional comments is mandatory.', '', {
        duration: 3000
      });
    }
  }
  toastcancel1() {
    this.dialogRef.close();
    this.snackBar.open('“Successfully Cancelled. ”', '', {
      duration: 5000
    });
  }
}