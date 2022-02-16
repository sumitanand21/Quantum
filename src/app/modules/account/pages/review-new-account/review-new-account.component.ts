import { ResponseObject } from './../../../../core/state/state.models/CreateCampaign.interface';
import { Status } from './../../../../core/state/state.models/Lead/unqualifiedLeads.interface';
import { StatusCode } from './../../../../core/interfaces/get-status-code';
import { Store } from '@ngrx/store';
import { activeRequestsclear } from '@app/core/state/actions/Creation-History-List.action';
import { ModificationActiveActions, ModificationActiveRequestsClear } from '@app/core/state/actions/modification-active-list.actions';
import { modificationHistoryRequestsClear } from '@app/core/state/actions/modification-history-list.actions';
import { Component, OnInit, Inject, ElementRef, ViewChild, OnDestroy ,HostListener} from '@angular/core';
import { AccountService, AccountNameListAdvnHeaders, AccountAdvnNames } from '@app/core/services/account.service';
import { Location } from '@angular/common';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { switchMap, debounceTime, map, distinctUntilChanged, tap, toArray } from 'rxjs/operators';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { CampaignService, CampaignHeaders, CampaignAdvNames } from '@app/core/services/campaign.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
} from '@angular/material';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { Router, ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '../../../../../../node_modules/@angular/forms';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MasterApiService } from '@app/core';
import { ValidationService, websiteValidator } from '@app/shared/services';
import { SwapPopupComponent } from '@app/shared/modals/swap-popup/swap-popup.component';
import { AccountOwnerPopupComponent } from '@app/shared/modals/account-owner-popup/account-owner-popup.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AppState } from '@app/core/state';
import { OpenOverview } from '@app/shared/components/single-table/single-table.component';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { SearchAccountDataBasePopupComponent } from '@app/shared/modals/search-account-DataBase-popup/search-account-DataBase-popup.component';
import { reserveAccountAction } from '@app/core/state/actions/resereve-account-list.actions';
import { farmingRequestsclear } from '@app/core/state/actions/farming-account.action';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';

@Component({
  selector: 'app-review-new-account',
  templateUrl: './review-new-account.component.html',
  styleUrls: ['./review-new-account.component.scss']
})
export class ReviewNewAccountComponent implements OnInit, OnDestroy {
  firstLoad : boolean = false;
  maxLength: number =345;
  huntingRatio: any;
  altHuntingratio: any;
  ExistingRatio: any;
  selected_cur: string = '';
  submitted: boolean = false;
  wiproaccounts: any;
  wiprodb: any;
  modificationAttributes: any;
  accordianClass:string = 'mb0';
  OwnerMB:string='mb0';
  borderColorClasses() {
    return this.borderClasses;
  }
  borderClasses = {
    "border-orange": false,
    "border-pink": true
  }
  toggleClasses() {
    this.borderClasses["border-orange"] = !this.borderClasses["border-orange"];
    this.borderClasses["border-pink"] = !this.borderClasses["border-pink"];
  }
  // accountSysId= localStorage.getItem('accountSysId');
  accountMapGuid;
  sbuChanged: boolean;
  isLoading: boolean = false;
  isHunatble: boolean = true;
  ConversationNameSwitch;
  counter: number = 0;
  SysGuidid: string = '';
  route_from: string = 'acc_req';
  accountType = -1;
  accountDetails: any = [];
  accountDetailscount: number = 0;
  AssignmentDetailscount: number = 0;
  accountModificationObj: any = { "account": {}, 'processinstanceid': '', 'attribute_comments': [], 'overall_comments': {} };
  modifStatus:any;
  accreqStatus :any;
  emailFormat = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}";
  phoneFormat = "[0-9]{10}$";
  websiteFormat = "[...]+\.[...]$";

  currencyLists = { '1': '$', '2': '€', '3': '₹' };
  location_temp: any = [];
  // createDropdown: any = { 'Currency': [], 'entitytype': [], 'ownershipTypes': [], 'growthCatagoryValues': [], 'coveragelevelValues': [], 'revenueCatagoryValues': [] };
  growthCatagoryvalue: any;
  growthCatagoryValues: any;
  coveragelevelValues: any;
  // parentaccounts: any;
  revenueCatagoryValues: any;
  regionValues: any;
  countryValues: any;
  geoValues: any[];
  financialyearValues: any;
  subverticalValues: any;
  verticalValues: any;
  sbuValues: any;
  cityValues: any;
  stateValues: any;
  cbuArray: any = [];
  oldCBUArray: any = [];
  totalCBUs: any = [];
  accountCreationObj = {};
  WithoutInputFields_SecondaryDetails: any = [];
  WithoutInputFields_AssignmentDetails: any = [];
  WithoutInputFields_AdditionalDetails: any = [];
  WithoutInputFields_Business: any = [];
  WithoutInputFields_Account_details: any = [];
  WithoutInputFields_AccountOwner: any = [];
  requestedby: string;
  AccountAttribute: any = [];
  SwapAccountComment: string = '';
  ownerComment: string = '';
  loggedin_user: string = '';
  allButtons: any = { 'IsCancel': "Cancel", 'IsSave': "Save", 'IsRework': "Rework", 'IsReject': "Reject", 'IsAccept': "Approve", 'IsSubmit': "Submit" };
  reserveAllButtons: any = { 'IsCancel': "Cancel", 'IsSave': "Save", 'IsRework': "Rework", 'IsReject': "Reject", 'IsAccept': "Activate", 'IsSubmit': "Submit" };
  alternativeAccountOwner = [];
  validButton: any = [];
  ownerAccountDetails = { 'owner': '', 'isswapaccount': false, 'swapaccount': '', 'alternateaccountowner': '', 'alternateswapaccount': '', 'isalternateswapaccount': false };
  NoOfAttrComment = { "Account_details": 0, "Business": 0, "AdditionalDetails": 0, "AssignmentDetails": 0, "AccountOwner": 0, "SecondaryDetails": 0 };
  AttrComment: any = { 'AccountOwner': []  };
  nonValidatorCountry = ["india", "united kingdom", "united states", "usa", "us", "USA"];
  listOfEncodedAttr = ['Name', 'LegalEntity', 'ParentAccount', 'UltimateParentAccount', 'SwapAccount', 'AlternateSwapAccount', 'DUNSID'];

  sub_and_vertical: any = []; // used for reversed order assigning kkn
  allSwapableAccount: any = [];
  altSwapableAccount: any = [];
  reworkStatus: any;
  isSbuChanged: boolean = false;
  isRequesterChanged: boolean = false;
  ischangesprimaryvalue: boolean = false;
  IsHelpDesk ;
  isActivityGroupSearchLoading: boolean;
  AdditionalDetailscount: number = 0;
  accountownercount: number = 0;
  // accountdetaiscount: any;
  businesscount: number = 0;
  accountownercountOne: number = 0;
  accountownercountTwo: number = 0;
  profileForm: any;
  cbuValueInitilize: boolean = false;
  accountOwnerPanel: boolean = false;
  accountDetailsPanel: boolean = false;
  requestHistoryPanel:boolean = true;
  OwnerDetailsInvalid : boolean;
  dunsId : boolean = false;
  //------------------------------------advance lookup ts file starts--------------------------------//
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
    pageNo: 1,
    nextLink: '',
    isLoader: false
  };
  arrowkeyLocation = 0;

  increment() {
    this.counter += 1;
  }
  popoverSubmitData(title, description) {
    this.counter += 1;
    console.log(title, description)
    //popover data submition 
  }
  popoverSubmitDataAdd(title, description) {
    this.counterAdditional_details += 1;
    console.log(title, description)
    //popover data submition 
  }
  popoverSubmitDataBus(title, description) {
    this.counterBusiness_details += 1;
    console.log(title, description)
    //popover data submition 
  }
  popoverSubmitAcc(title, description) {
    this.counterAccount_details += 1;
    console.log(title, description)
    //popover data submition 
  }
  counterAdditional_details: number = 0;
  incrementAdditional_details() {
    this.counterAdditional_details += 1;
  }

  counterBusiness_details: number = 0;
  incrementBusinness() {
    this.counterBusiness_details += 1;
  }
  counterAccount_details: number = 0;
  incrementAccount() {
    this.counterAccount_details += 1;
  }
  counterAssignment_details: number = 0;
  incrementAssignment() {
    this.counterAssignment_details += 1
    this.NoOfAttrComment['AssignmentDetails'] = this.counterAssignment_details;
  }


  getBussinesspopoverTitle(title) {
    if (this.loggedin_user == 'account_requestor') {
      return '';
    }
    else {
      return 'Comments - ' + title;
    }
  }
  checCharLimit(vals, arr) {
    arr.charLeft = arr.maxLimit - vals.length;
    console.log(arr);
  }
  charLimitMessage(arr) {
    return arr.maxLimit != arr.charLeft ? ' (' + arr.charLeft + ' char left)' : '';
  }
  goBack() {
    //this.location.back();
    switch (this.route_from) {
      case 'acc_req': {
        this.router.navigate(["accounts/accountcreation/activerequest"])
        return;
      }

      case 'assign_ref': {
        this.router.navigate(["accounts/assignmentRef/assigactiverequest"])
        return;
      }
      case 'modif_req': {
        this.router.navigate(["accounts/accountmodification/modificationactiverequest"])
        return;
      }
    }
  }
  isSwapAccount(e) {
    // this.AccountOwner.controls['isswapaccount'].setValue(e.checked);
    this.accountCreationObj['prospect']['isswapaccount'] = e.checked;
    this.ownerAccountDetails['isswapaccount'] = e.checked;
    this.accountCreationObj['prospect']['requesttype'] = this.ownerAccountDetails['isswapaccount'] ? 3 : 1;
    if (!e.checked) {
      this.submitted = false;
      this.accountCreationObj['prospect']['swapaccount'] = '';
      this.ownerAccountDetails['swapaccount'] = '';
      this.ownerAccountDetails['isswapaccount'] = false;
    } else {
      this.accountCreationObj['prospect']['alternateaccountowner'] = '';
      this.accountCreationObj['prospect']['alternateswapaccount'] = '';
      this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
      this.ownerAccountDetails['alternateswapaccount'] = '';
      this.ownerAccountDetails['alternateaccountowner'] = '';
      this.ownerAccountDetails['isalternateswapaccount'] = false;
      let altswapind = this.WithoutInputFields_AccountOwner.findIndex(w => w.key == 'isalternateswapaccount');
      this.SecondaryDetails.controls[altswapind].disable();
    }
  }
  isAltSwapAccount(e) {
    console.log(e);
    // this.AccountOwner.controls['isswapaccount'].setValue(e.checked);
    this.accountCreationObj['prospect']['isalternateswapaccount'] = e.checked;
    this.ownerAccountDetails['isalternateswapaccount'] = e.checked;
    this.accountCreationObj['prospect']['requesttype'] = this.ownerAccountDetails['isalternateswapaccount'] ? 3 : 1;
    if (!e.checked) {
      this.submitted = false;
      this.accountCreationObj['prospect']['alternateswapaccount'] = '';
      this.accountCreationObj['prospect']['alternateswapaccount'] = '';
      this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
      this.ownerAccountDetails['alternateaccountowner'] = ''
      this.ownerAccountDetails['alternateswapaccount'] = '';
      this.ownerAccountDetails['isalternateswapaccount'] = false;
      this.altHuntingratio = undefined;
      let ownerind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == 'alternateowner_fullname');
      let swapaccind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == 'alternateswapaccount_name');
    
    } else {
      let ownerind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == 'alternateowner_fullname');
      let swapaccind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == 'alternateswapaccount_name');
      console.log(ownerind, swapaccind);
     
    }
  }

  clickmes = false;
  expandAccordian = false;
  OwnerAccordian = false;
  toggleComment() {
    // this.index++;
    // console.log(this.index);
    this.clickmes = !this.clickmes;
    // document.getElementsByClassName('popover')[index].classList.toggle('active');
    // document.getElementsByClassName('button-plus')[index].classList.toggle('active');
  }

  // AdditionaltoggleComment(val) {
  //   // this.index++;
  //   console.log(val);
  //   debugger
  //   if( ['Entity type','Marketing risk score','Ownership type'].indexOf(val) >= 0){
  //     this.expandAccordian = true;
  //   }
  //   else{
  //   this.expandAccordian = false;
  //   }
  //   this.clickmes = !this.clickmes;

  // }

  checkBottomMargin(item){
     if(['Operating margin (%)','Marketing value','Return on equity'].indexOf(item.title) >=0){
      if(!item.RequestHistoryComments){
          this.accordianClass = 'mb-90'
      }
          if(item.RequestHistoryComments.length > 0){
            this.accordianClass = 'mb-240'
          }
    }

       if(['Entity type', 'Marketing risk score', 'Ownership type'].indexOf(item.title) >=0){
      if(!item.RequestHistoryComments){
          this.accordianClass = 'mb-180'
      }
          if(item.RequestHistoryComments.length > 0){
            this.accordianClass = 'mb-330'
          }
    }
  }
  AdditionalExpandContent(val,item) {
    console.log("value is "+val);
    debugger;
    if(['Stock index membership','Ticker symbol','Currency'].indexOf(val) >=0){ 
      if(item.RequestHistoryComments.length > 0){
        this.accordianClass = 'mb-65'
      }
  }

    if(['Fortune 1000 ranking','Gross profit','Revenue'].indexOf(val) >=0){ 
        if(item.RequestHistoryComments.length > 0){
          this.accordianClass = 'mb-155'
        }
    }


    if(['Operating margin (%)','Marketing value','Return on equity'].indexOf(val) >=0){
       if(!item.RequestHistoryComments && item.charLeft == '2000'){
          this.accordianClass='mb-90'} // mb50
          if(!item.RequestHistoryComments && item.charLeft < '2000'){
            this.accordianClass='mb-90'}  

        if(item.RequestHistoryComments.length > 0){
          this.accordianClass = 'mb-240'
        }
    }
    if(['Entity type', 'Marketing risk score', 'Ownership type'].indexOf(val) >=0){
      if(!item.RequestHistoryComments && item.charLeft == '2000'){
        this.accordianClass='mb-180'} //mb140
        if(!item.RequestHistoryComments && item.charLeft < '2000'){
          this.accordianClass='mb-180'}  

      if(item.RequestHistoryComments.length > 0){
        this.accordianClass = 'mb-330'
      }

    }
    if (['Entity type', 'Marketing risk score', 'Ownership type'].indexOf(val) >= 0) {
      this.expandAccordian = true;
    }
    else {
      this.expandAccordian = false;
    }
    this.clickmes = !this.clickmes;
  }

  AdditionalRestoreContent(val,item) {
     this.accordianClass='mb0'
    if (['Entity type', 'Marketing risk score', 'Ownership type'].indexOf(val) >= 0) {
      this.expandAccordian = false;
    }
    else {
      this.expandAccordian = false;
    }
    this.clickmes = !this.clickmes;
  }

  setHeight(val,item){
    console.log(`setting height ${val} `+ JSON.stringify(item));
      if (['Pursued opportunity scope/tenure/other Remarks', 'Government account', 'New age business'].indexOf(val) >= 0) {
        if(item.RequestHistoryComments.length > 0 && this.route_from!='modif_req'){
              this.OwnerMB = 'mb-85'
        }

        if(item.RequestHistoryComments.length > 0 && !(this.route_from!='modif_req')){
          this.OwnerMB = 'mb-185'
    }
      }

      if (['Country', 'Country sub-division', 'City region'].indexOf(val) >= 0) {
        if(item.RequestHistoryComments.length > 0 && !(this.route_from!='modif_req')){
          this.OwnerMB = 'mb-100'
            }

      }  
  }

  restoreHeight(val,item){
       this.OwnerMB ="mb0"
  }

  //  temp =''
  // OwnertoggleComment(val) {
  //   // this.index++;
  //   if(this.temp === ''){
  //     this.temp = val;
  //   }else if ( this.temp === val){
  //         this.temp = val;
  //   } else if (this.temp != val){
  //     this.temp = val;
  //   }

  //   console.log(val);
  //   debugger
  //   if( this.temp === val){
  //     this.OwnerAccordian = false;
  //     // this.temp = '';
  //   }
  //   else{
  //   if( ['Owner','Select account','Select alternative account owner'].indexOf(val) >= 0){
  //     this.OwnerAccordian = true;
  //   }else{
  //   this.OwnerAccordian = false;
  //   }
  // }
  //   this.clickmes = !this.clickmes;

  // }
  OwnerexpandContent(val) {
    this.OwnerAccordian = true;
    if(val == 'owner' || 'selectAccount' ){
          this.OwnerMB='mb-240'
    }
    if(val =='alternative' || 'alternativeAccount'){
          this.OwnerMB='mb-360'
    }
  }
  

  OwnerrestoreContent(val) {
    this.OwnerMB = 'mb0'
    this.OwnerAccordian = false;
  }

  toggleCommentOwner() {

    let value = (160 + (this.scrollContent.popoverDiv.nativeElement.clientHeight - 160)).toString() + 'px';

    this.clickmes = !this.clickmes;

    document.getElementById("maincontent").style.paddingBottom = value;

  }

  onPopoverHidden() {
    document.getElementById("maincontent").style.paddingBottom = "160px";
  }

  onPopoverHidden1() {
    alert("check the alert")
  }
  showProgressBar;
  progressType = [];
  progressComment;
  secondData;
  lastData;
  CSO3progressComment;
  CSO2progressComment;
  firstComment;
  disableButton;
  reworkCSO = false;
  reworkfirstComment;
  reworksecondComment;
  hidesecondButtonFromSBU = false;
  constructor(private route: ActivatedRoute,
    public service: AccountService,
    public dialog: MatDialog,
    public location: Location,
    public accservive: DataCommunicationService,
    private fb: FormBuilder,
    public accountListService: AccountListService,
    private router: Router,
    private snackBar: MatSnackBar,
    public validate: ValidationService,
    public encrDecrService: EncrDecrService,
    private masterApi: MasterApiService,
    public master3Api: S3MasterApiService,
    private store: Store<AppState>,
    private el: ElementRef,
    public campaignService: CampaignService,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService

  ) {
    console.log(Validators);

    // console.log("route in review component", route);
    // let obj = JSON.parse(this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeParams'), 'DecryptionDecrip'));
    let paramsObj = this.accountListService.getSession('routeParams');
    console.log(paramsObj);

    if (paramsObj && paramsObj['Id']) {
      this.SysGuidid = paramsObj['Id'];
      this.SysGuidid = paramsObj['Id'];
    } else {
      this.SysGuidid = '';
    }
    if (paramsObj && paramsObj['route_from']) {
      this.route_from = paramsObj['route_from'];
    } else {
      this.route_from = '';
    }
    // if (route && route.snapshot && route.snapshot.params) {
    //   if (route.snapshot.params.id) {
    //     this.SysGuidid = route.snapshot.params.id;
    //   } else {
    //     this.SysGuidid = '9df133e7-0568-e911-a95a-000d3aa053b9';
    //   }
    //   if (route.snapshot.params.name) {
    //     this.route_from = route.snapshot.params.name;
    //   }
    //   else {
    //     this.route_from = 'acc_req';
    //   }

    // }
  }

  @ViewChild('myPopoverO1') scrollContent: any;

  /*******************editable with comments data fileds starts here****************** */

  profileFormInit() {
    this.profileForm = this.fb.group({
      SecondaryDetails: this.fb.array([
      ]),
      AssignmentDetails: this.fb.array([
      ]),
      AdditionalDetails: this.fb.array([
      ]),
      Business: this.fb.array([
      ]),
      Account_details: this.fb.array([
      ]),
      // AccountOwner: this.fb.array([
      // ])

    });
  }
  /*******************editablewith comments data fileds ends here****************** */
  ngOnInit() {
    // this.profileFormInit();
    this.isLoading = true;
    this.firstLoad = true;
    console.log("sjahbcsh", this.loggedin_user);
    this.requestedby = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.getDetails(this.route_from);
    this.loggedin_user = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
    this.getdnbtoken();
    this.IsHelpDesk = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
  }
  getdnbtoken() {
    if (!localStorage.getItem('dNBToken')) {
      this.master3Api.getdnbtoken("code").subscribe((res: any) => {
        console.log(" dnb token ", res);
        localStorage.setItem('dNBToken', res.ResponseObject.access_token)
      },
        error => console.log("error ::: ", error));
    }
  }
  customerNameclose() { }

  createAccountOwnerFields(key, value): FormGroup {
    return this.fb.group({
      [key]: [value, Validators.required]
    });
  }
  setAttribueComment(arr, key, val, isCommented, isFromAPI) {
    if (isFromAPI) {
      this.AttrComment[arr][key] = { [key]: val, 'RequestHistoryComments': val, 'isCommented': isCommented };
    }
    else {
      let keys = Object.keys(this.AttrComment[arr]);
      let ind = keys.indexOf(key);
      if (ind == -1)
        this.AttrComment[arr].push({ [key]: val, 'isCommented': isCommented, 'RequestHistoryComments': [] });
      else {
        this.AttrComment[arr][key][key] = val;
        this.AttrComment[arr][key]['isCommented'] = isCommented;
      }
    }
    console.log(this.AttrComment);
  }

  AssignValidatior(attrArray, ind, formArray, setValidator) {
    console.log(attrArray, ind, formArray, setValidator);
    if (setValidator == -1) {
      formArray.at(ind).setValidators([Validators.required]);
      formArray.at(ind).updateValueAndValidity();
      // formArray.controls[ind].setValidators([Validators.required]);
      attrArray[ind].isRequired = true;
    }
    else {
      // formArray.controls[ind].setValidators([]);
      formArray.at(ind).clearValidators();
      formArray.at(ind).updateValueAndValidity();
      attrArray[ind].isRequired = false;
    }
  }

  checkForRequired(attrArray, formArray, ind, key, isInitialTime) {

    let parentIndex = -1;
    let attrIndex = [];
    if (key == 'country') {
      parentIndex = attrArray.findIndex(at => at.key == key);
      if (isInitialTime) {
        if (attrArray[parentIndex].isRequired && this.nonValidatorCountry.indexOf((attrArray[parentIndex].data_content).toLowerCase()) == -1) {
          this.AssignValidatior(attrArray, ind, formArray, 1);
        }
        else {
          this.AssignValidatior(attrArray, ind, formArray, -1);
        }
      } else {
        attrIndex.push(attrArray.findIndex(at => at.key == 'state'));
        attrIndex.push(attrArray.findIndex(at => at.key == 'city'));
        attrIndex.forEach(attrInd => {
          // console.log((formArray.controls[parentIndex].value), this.nonValidatorCountry.indexOf((formArray.controls[parentIndex].value).toLowerCase()));

          let keyInd = (formArray.controls[parentIndex].value) ? this.nonValidatorCountry.indexOf((formArray.controls[parentIndex].value).toLowerCase()) : -1;
          if (keyInd != -1) keyInd = -1;
          else keyInd = 0;
          this.AssignValidatior(attrArray, attrInd, formArray, keyInd);
        })
      }
    }
  }
  buildForm() {

    /*******************editable secondary details with comments data fileds starts here****************** */
    this.WithoutInputFields_SecondaryDetails.forEach((element, index) => {
      if (element.AttributeName) {
        let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
        element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
        element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
        element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
      }

      if (element.key == 'subvertical' && element.data_content && element.data_content.length > 0)
        element.isRequired = true;

      if (element.key == 'city' && element.data_content && element.data_content.length > 0)
        element.isRequired = true;

      if (element.isRequired) {
        this.SecondaryDetails.push(this.fb.control(element.data_content, [Validators.required]));
      }
      else {
        this.SecondaryDetails.push(this.fb.control(element.data_content));
      }

      if (!element['IsEdit'] && element.AttributeName) this.SecondaryDetails.controls[index].disable();
      if (element.key == 'subvertical' && (!element.data_content || element.data_content.length == 0))
        this.SecondaryDetails.controls[index].disable();

      if (element.key == 'state') {
        this.checkForRequired(this.WithoutInputFields_SecondaryDetails, this.SecondaryDetails, index, 'country', true);
      }

      if (element.isRequired && element.key == 'city') {
        this.checkForRequired(this.WithoutInputFields_SecondaryDetails, this.SecondaryDetails, index, 'country', true);
      }

      if (element.key == 'sbu' && this.accountDetails.SBU && this.accountDetails.SBU.Name) {
        let clusterIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'cluster');
       this.getcluster(event, this.accountDetails.SBU.Name, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, clusterIndex,'sbu');
      }
    });
    console.log(this.SecondaryDetails);

    this.NoOfAttrComment['SecondaryDetails'] = this.WithoutInputFields_SecondaryDetails.filter((obj) => obj['RequestHistoryComments']).length;
    // this.accountownercount = this.NoOfAttrComment['SecondaryDetails']

    this.WithoutInputFields_AccountOwner.forEach((element, index) => {
      if (element.AttributeName) {
        let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
        element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
        element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
        element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
        this.setAttribueComment('AccountOwner', element.AttributeName, element['RequestHistoryComments'], false, true);
      }
      // if (element.isRequired) {
      //   this.AccountOwner.push(this.fb.control(element.data_content, [Validators.required]));
      // }
      // else {
      //   this.AccountOwner.push(this.fb.control(element.data_content));
      // }

      // this.AccountOwner.push(this.createAccountOwnerFields(element.key, element.data_content));
      // if (!element['IsEdit'] && element.AttributeName) {
      //   this.AccountOwner.controls[index].disable();
      // }
      // console.log(this.AccountOwner);

    });
    this.NoOfAttrComment['AccountOwner'] = this.WithoutInputFields_AccountOwner.filter((obj) => obj['RequestHistoryComments']).length;
    console.log(this.AttrComment['AccountOwner']);
    this.accountownercount = this.NoOfAttrComment['AccountOwner'] + this.NoOfAttrComment['SecondaryDetails']
    /*******************editable secondary details with comments data fileds ends here****************** */
    /*******************editable Assignment details with comments data fileds starts here****************** */
    if (this.route_from == 'assign_ref') {
      this.WithoutInputFields_AssignmentDetails.forEach((element, index) => {
        if (element.AttributeName) {
          let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
          element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
          element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
          element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
        }
        if (element.key == 'subvertical' && element.data_content && element.data_content.length > 0)
          element.isRequired = true;

        if (element.isRequired) {
          this.AssignmentDetails.push(this.fb.control(element.data_content, [Validators.required]));
        }
        else {
          this.AssignmentDetails.push(this.fb.control(element.data_content));
        }

        if (!element['IsEdit'] && element.AttributeName) this.AssignmentDetails.controls[index].disable();

      });

      this.NoOfAttrComment['AssignmentDetails'] = this.WithoutInputFields_AssignmentDetails.filter((obj) => obj['RequestHistoryComments']).length;
      this.AssignmentDetailscount = this.NoOfAttrComment['AssignmentDetails']
    }
    /*******************editable Assignment details with comments data fileds ends here****************** */
    /*******************editable Additional details with comments data fileds starts here****************** */
    this.WithoutInputFields_AdditionalDetails.forEach((element, index) => {
      if (element.AttributeName) {
        let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
        element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
        element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
        element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
      }

      if (element.isRequired) {
        this.AdditionalDetails.push(this.fb.control(element.data_content, [Validators.required]));
      }
      else {
        this.AdditionalDetails.push(this.fb.control(element.data_content));
      }

      if (!element['IsEdit'] && element.AttributeName) this.AdditionalDetails.controls[index].disable();
    });
    this.NoOfAttrComment['AdditionalDetails'] = this.WithoutInputFields_AdditionalDetails.filter((obj) => obj['RequestHistoryComments']).length;
    this.AdditionalDetailscount = this.NoOfAttrComment['AdditionalDetails']
    /*******************editable Additional details with comments data fileds ends here****************** */
    /*******************editable Business details with comments data fileds starts here****************** */
    this.WithoutInputFields_Business.forEach((element, index) => {
      if (element.AttributeName) {
        let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
        element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
        element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
        element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
      }
      if (element.isRequired) {
        // if (element.AttributeName == 'contact_contactno') {
        //   this.Business.push(this.fb.control(element.data_content, [Validators.required, Validators.pattern(this.phoneFormat), Validators.minLength(10), Validators.maxLength(10)]));
        // }
        if (element.AttributeName == 'email') {
          this.Business.push(this.fb.control(element.data_content, [Validators.email, Validators.pattern(this.emailFormat)]));
        }

        else if (element.AttributeName == 'websiteurl') {
          this.Business.push(this.fb.control(element.data_content, [websiteValidator]));
        }
        else {
          this.Business.push(this.fb.control(element.data_content, [Validators.required]));
        }
      }
      else {
        // if (element.AttributeName == 'contact_contactno') {
        //   this.Business.push(this.fb.control(element.data_content, [Validators.pattern(this.phoneFormat), Validators.minLength(10), Validators.maxLength(10)]));
        // }
        if (element.AttributeName == 'email') {
          this.Business.push(this.fb.control(element.data_content, [Validators.email, Validators.pattern(this.emailFormat)]));
        }
        else if (element.AttributeName == 'websiteurl') {
          this.Business.push(this.fb.control(element.data_content, [websiteValidator]));
        }
        else {
          this.Business.push(this.fb.control(element.data_content));
        }
      }

      if (!element['IsEdit'] && element.AttributeName) this.Business.controls[index].disable();
    });

    console.log(this.Business);
    this.NoOfAttrComment['Business'] = this.WithoutInputFields_Business.filter((obj) => obj['RequestHistoryComments']).length;
    this.businesscount = this.NoOfAttrComment['Business']
    /*******************editable Business details with comments data fileds ends here****************** */
    /*******************editable Account details with comments data fileds starts here****************** */
    this.WithoutInputFields_Account_details.forEach((element, index) => {
      if (element.AttributeName) {
        let ind = this.AccountAttribute.findIndex(atr => atr['AttributeName'] == element.AttributeName);
        element['IsEdit'] = this.AccountAttribute[ind]['IsEdit'];
        element['RequestHistoryComments'] = this.AccountAttribute[ind]['RequestHistoryComments'];
        element['AttributeGuid'] = this.AccountAttribute[ind]['AttributeGuid'];
        // this.setAttribueComment('Account_details',element.key,element['RequestHistoryComments']);
      }

      if (element.isRequired) {
        this.Account_details.push(this.fb.control(element.data_content, [Validators.required]));
      }
      else {
        this.Account_details.push(this.fb.control(element.data_content));
      }

      if (!element['IsEdit'] && element.AttributeName) this.Account_details.controls[index].disable();
    });
    this.NoOfAttrComment['Account_details'] = this.WithoutInputFields_Account_details.filter((obj) => obj['RequestHistoryComments']).length;
    this.accountDetailscount = this.NoOfAttrComment['Account_details'];
    this.isLoading = false;
    this.firstLoad = false;
    /*******************editable Account details with comments data fileds ends here****************** */
  }

  /* get Details accoding to routing and role ** KUNAL ** */

  daChatApiCall(data) {
      let body = {
        'ProspectGuid' : data.SysGuid,
        "GEOGuid" : data.Geo.SysGuid,
        "SBUGuid" : data.SBU.Id ,
        "CountryGuid" : data.Address.Country.SysGuid
      }
      this.accountListService.GetChatUserList(body).subscribe(res => {
        if (!res.IsError) {
          let emailIds = []
          res.ResponseObject.forEach(data => {
            if (data.Email) {
              emailIds.push(data.Email)
              // this.daService.iframePage = 'ACCOUNT_CREATE_MODIFICATION';
              let bodyDA = {
                id : data.SysGuid,
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

  getDetails(route_from) {
    this.profileFormInit();
    /* acc_req: Request coming from Active Account List */
    /* assign_ref: Request coming from Assignment Referecne List */
    /* modif_req: Request coming from active Account Modification List */
    let obj: any = { 'SysGuid': this.SysGuidid, "LoggedInUser": { 'SysGuid': this.requestedby } };
    switch (route_from) {
      case 'acc_req': {
        this.accountListService.ActiverequestsReview(obj).subscribe((result: any) => {
          console.log(result);
          if (!result.IsError && result.ResponseObject) {
            this.daChatApiCall(result.ResponseObject);
            this.accountDetails = result.ResponseObject;
            this.accreqStatus = result.ResponseObject.Status && result.ResponseObject.Status.Id ? result.ResponseObject.Status.Id :'' ;
            if(result.ResponseObject.DUNSID.hasOwnProperty('SysGuid')){
              this.dunsId = true;
            }
            else this.dunsId = false;
            // encoding of name
            this.listOfEncodedAttr.forEach(lr => {
              if (typeof this.accountDetails[lr] === 'object')
                this.accountDetails[lr]['Name'] = (this.accountDetails[lr] && this.accountDetails[lr]['Name']) ? this.getdecodevalue(this.accountDetails[lr]['Name']) : '';
              else
                this.accountDetails[lr] = this.accountDetails[lr] ? this.getdecodevalue(this.accountDetails[lr]) : '';
            });

            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            if (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id']))
              this.accountType = this.accountDetails['Type']['Id'];
            console.log(this.AccountAttribute);
            this.formInitilize('new');
            this.buildPostObject();
            this.createButton();
            this.progressBarUpdate(this.accountDetails, this.loggedin_user, 'Account creation requested');
          }
          else this.isLoading = false;
        }, error => { this.isLoading = false; });
        return;
      }

      case 'assign_ref': {
        this.accountListService.AssignmentReferenceReview(obj).subscribe((result: any) => {
          //this.accountListService.AssignmentReferenceReview('eb0baf06-f289-e911-a834-000d3aa058cb').subscribe((result: any) => {
          console.log(result);
          if (!result.IsError && result.ResponseObject) {
            this.accountDetails = result.ResponseObject;
            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            console.log(this.AccountAttribute);
            if (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id']))
              this.accountType = this.accountDetails['Type']['Id'];
            this.formInitilize('new');
            this.buildPostObject();
            this.createButton();
            this.progressBarUpdateassignment(this.accountDetails, this.loggedin_user, 'Reference account requested');
          }
          else this.isLoading = false;
        }, error => { this.isLoading = false; });
        return;
      }
      case 'modif_req': {
        this.accountListService.ModificationActiveRequestDetails(obj).subscribe((result: any) => {
          console.log(result);
          if (!result.IsError && result.ResponseObject) {
            this.accountDetails = result.ResponseObject;
            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            this.modifStatus = result.ResponseObject.Status && result.ResponseObject.Status.Id ? result.ResponseObject.Status.Id :''
            console.log(this.AccountAttribute);
            if (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id']))
              this.accountType = this.accountDetails['Type']['Id'];
            this.formInitilize('new');
            this.buildPostObject();
            this.createButton();
            this.progressBarUpdate(this.accountDetails, this.loggedin_user, 'Account modification requested');
          }
          else this.isLoading = false;
        }, error => { this.isLoading = false; });
        return;
      }
      default:
        return;
    }
  }
  getdecodevalue(data) {
    console.log(data);

    return this.accountListService.getSymbol(data);
  }
  progressBarUpdateassignment(data, user, firstcomment) {
    // debugger;
    this.firstComment = firstcomment;
    this.progressComment = data.Status.Value;
    this.showProgressBar = true;
  }
  progressBarUpdate(data, user, firstcomment) {
    // debugger;
    this.firstComment = firstcomment;
    // roleType
    console.log("progressBarUpdate" + data);
    if (user === 'sbu') {

      if (data.OverAllComments.length > 0) {
        this.showProgressBar = true;
        if (data.Status.Id === 184450007) { // rework from CSO || CSO login
          this.reworkCSO = true;
          if (data.CreatedBy.Role.RoleType == 2) {
            this.hidesecondButtonFromSBU = true;
            this.reworksecondComment = 'Rework from CSO';
          } else {
            this.reworkfirstComment = data.OverAllComments[1].Status.Value;
            this.reworksecondComment = data.OverAllComments[0].Status.Value;
          }

        }
        else if (data.Status.Id === 184450004) { // rework from CSO 
          this.reworkCSO = true;
          if (data.CreatedBy.Role.RoleType == 2) {
            this.hidesecondButtonFromSBU = true;
            this.reworksecondComment = 'Rework from CSO';
          } else {
            this.reworkfirstComment = "Approved By SPOC";
            this.reworksecondComment = data.OverAllComments[0].Status.Value;
          }


        } else if (data.Status.Id === 184450000) { //Approval pending with SPOc
          this.disableButton = true;
          this.progressComment = data.OverAllComments[0].Status.Value;
        } else if (data.Status.Id === 184450009) { //Approval pending with CSO
          this.disableButton = true;
          this.progressComment = data.OverAllComments[0].Status.Value;
        } else {
          this.progressComment = data.OverAllComments[0].Status.Value;
        }
      }
      else {
        this.showProgressBar = false;
      }
    } else if (user === 'account_requestor') {
      if (data.OverAllComments.length > 0) {
        this.showProgressBar = true;
        if (data.Status.Id === 184450006) { // rework from CSO || CSO login
          this.reworkfirstComment = "Approved By SPOC";
          this.reworksecondComment = data.OverAllComments[0].Status.Value;
          // this.reworkCSO = true;
          // if (data.CreatedBy.Role.RoleType == 1) {
          //   // this.hidesecondButtonFromSBU = true;
          //   this.reworksecondComment = 'Rework from SPOC';
          // } 
          // else {
          //     this.reworkfirstComment = data.OverAllComments[1].Status.Value;
          //     this.reworksecondComment = data.OverAllComments[0].Status.Value;
          //   }
          // }
          // else if (data.Status.Id === 184450004) { // rework from CSO 
          //   this.reworkCSO = true;
          //   if (data.CreatedBy.Role.RoleType == 1) {
          //     // this.hidesecondButtonFromSBU = true;
          //     this.reworksecondComment = 'Rework from SPOC';
          //   } else {
          //     this.reworkfirstComment = "Approved By SPOC";
          //     this.reworksecondComment = data.OverAllComments[0].Status.Value;
          //   }


          // } else if (data.Status.Id === 184450000) { //Approval pending with SPOc
          //   // this.disableButton = true;
          //   this.progressComment = data.OverAllComments[0].Status.Value;
          // } else if (data.Status.Id === 184450009) { //Approval pending with CSO
          //   // this.disableButton = true;
          //   this.progressComment = data.OverAllComments[0].Status.Value;
          // } else {
          // this.progressComment = data.OverAllComments[0].Status.Value;
        } else {
          this.reworkfirstComment = "Approved By SPOC";
          this.reworksecondComment = data.OverAllComments[0].Status.Value;
        }
      } else {
        this.showProgressBar = false;
      }
    } else {
      if (data.OverAllComments.length > 0) {
        // data.OverAllComments.forEach(element => {
        if (data.OverAllComments[0].Status.Id === 184450002 || data.OverAllComments[0].Status.Id === 184450001) {
          this.CSO2progressComment = 'Approved by SPOC';

        } else {
          this.CSO2progressComment = data.OverAllComments[1].Status.Value ? data.OverAllComments[1].Status.Value : data.OverAllComments[0].Status.Value;

        }

        this.CSO3progressComment = data.OverAllComments[0].Status.Value ? data.OverAllComments[0].Status.Value : '';
        // CSO3progressComment = 
        // CSO2progressComment
        // if (element.Status.Id === 184450009 || element.Status.Id == 184450006) {
        //   this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });          
        // } else if(element.Status.Id === 184450002 || element.Status.Id == 184450007) {
        //   this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });   
        // }else
        // {
        //   this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });
        // }
        // });  
        // console.log("progressType" + this.progressType);
        // this.secondData = this.progressType[0].comment ?  this.progressType[0].comment  :'';
        // this.lastData = this.progressType[1].comment ? this.progressType[1].comment :'';
        this.showProgressBar = true;
      } else {
        this.showProgressBar = false;
      }
    }
    // if (data.OverAllComments.length > 0) {
    //   data.OverAllComments.forEach(element => {
    //     if (element.Status.Id === 184450009 || element.Status.Id == 184450006) {
    //       this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });
    //       // this.progressComment = data.OverAllComments[0].Status.Value;
    //     } else {
    //       this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });
    //       // this.progressType.push({ 'id': element.Status.Id, 'comment': element.Status.Value });
    //       // this.progressComment = data.OverAllComments[0].Status.Value;
    //     }
    //   });

    //   console.log("progressType" + this.progressType);
    //   this.showProgressBar = true;
    // } else {
    //   this.showProgressBar = false;
    // }
  }
  createButton() {
    this.validButton = [];
    // arrangement of button accoring to FSD.
    let buttons = [];

    if (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id']) && this.accountDetails['Type']['Id'] == 1)
      buttons = this.reserveAllButtons;
    else buttons = this.allButtons;
    for (var key in buttons) {
      console.log(key, this.accountDetails.ActionButtons[key], this.accountDetails.ActionButtons);

      if (this.accountDetails.ActionButtons[key]) {
        this.validButton.push(buttons['' + key + '']);
      }
    }
  }
  getCurencySymbol(data) {
    let cur = unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    // this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
    return cur;
  }
  // selected_currency(data, id) {
  //   console.log(data, id);

  //   if (data.key == 'currency') {
  //     let ind = data.data.findIndex(d => d.Id == id);
  //     if (ind != -1) {
  //       let cur = unescape(JSON.parse('"' + data.data[ind].Desc + '"')).replace(/\+/g, ' ');
  //       this.selected_cur = cur.substring(cur.lastIndexOf("(") + 1, cur.lastIndexOf(")"));
  //     }
  //   }
  // }

  postObjValidator(obj) {
    // if(this.route_from == 'modif_req' ){
    //   return obj
    // }
    // else {
      // let keys = Object.keys(obj);
      // keys.map(function (k) {
      //   console.log(k);
  
      //   if (typeof obj[k] != 'boolean') {
      //     if (!obj[k])
      //       delete obj[k];
      //     if (obj[k] && obj[k] == 'NA')
      //       delete obj[k];
      //   }
      // })
      return obj;
    // } 
  }
  build_overall_comments(comment, status) {
    let obj = {
      "prospectid": this.accountDetails.SysGuid || '',
      "overallcomments": comment,//(this.accountDetails.OverAllComments && this.accountDetails.OverAllComments[0].Comment) ? this.accountDetails.OverAllComments[0].Comment : '',
      "requestedby": this.requestedby,
      "status": status
    }
    return obj;
  }
  modifOverallComment(comment, status) {
    console.log(comment);
    let obj = {
      "accountid": this.accountDetails.MapGuid || '',
      "overallcomments": comment,//(this.accountDetails.OverAllComments && this.accountDetails.OverAllComments[0].Comment) ? this.accountDetails.OverAllComments[0].Comment : '',
      "requestedby": this.requestedby,
      "status": status
    }
    return obj;
  }
  removeComment(attr, newListItem, array, countName,i?) {

    console.log("deleteid ", attr);
    if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0) {
      const deletedItem = this.accountCreationObj["attribute_comments"].filter(item => item.id !== attr.AttributeGuid);
      this.accountCreationObj["attribute_comments"] = deletedItem;
      console.log("this.accountCreationObj::", this.accountCreationObj["attribute_comments"]);
      newListItem.value = '';
      console.log("newListItem", newListItem);
      // if (this.route_from == 'modif_req')
      //   delete this.accountModificationObj["attribute_comments"][attr.AttributeName];

      attr['isCommented'] = false;
      this.accountCount(array, countName,i);
    }
  }
  removeComment1(key, newListItem, attrName) {
    let arrayOwner = [];
    // if(name === 'owner'){
    //   arrayOwner = this.WithoutInputFields_AccountOwner;
    // } else if(name === 'secondary'){
    //   arrayOwner = [];
    // }
    // removeComment()
    let ind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == key);

    this.removeComment(this.WithoutInputFields_AccountOwner[ind], newListItem, this.WithoutInputFields_AccountOwner, attrName);
  }
  build_attribute_comments(attr, comment, array, countName, index?) {
    // debugger

    console.log(attr, comment);
    console.log("array ", array);
    if (this.accservive.searchFieldValidator(comment)) {
      attr['isCommented'] = true;
      if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
      let ind = this.accountCreationObj["attribute_comments"].findIndex(atr => atr.id == attr.AttributeGuid);
      console.log(ind);

      if (ind != -1)
        this.accountCreationObj["attribute_comments"][ind]['comment'] = comment;
      else
        this.accountCreationObj["attribute_comments"].push({ 'id': attr.AttributeGuid, 'comment': comment });
      // if(this.WithoutInputFields_Account_details[index].isCommented){
      this.accountCount(array, countName, index);
      // }
      // account modification attribute comment
      // if (this.route_from == 'modif_req') {
      //   this.accountModificationObj["attribute_comments"][attr.AttributeName] = comment;
      //   console.log(this.accountModificationObj["attribute_comments"]);
      // }

    } else {
      attr['isCommented'] = false;
    }

    // if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = {};
    // this.accountCreationObj["attribute_comments"][attr] = comment;
  }
  build_attribute_comments1(key, comment) {
    let ind = this.WithoutInputFields_AccountOwner.findIndex(accOw => accOw.AttributeName == key);
    if (ind !== -1) {
      this.setAttribueComment('AccountOwner', key, comment, true, false);
      this.build_attribute_comments(this.WithoutInputFields_AccountOwner[ind], comment, this.WithoutInputFields_AccountOwner, 'AccountOwner', ind);
    }
  }
  build_prospect_obj() {
  
    // debugger;
    this.ownerAccountDetails['owner'] = (this.accountDetails.Owner && this.accountDetails.Owner.FullName) ? this.accountDetails.Owner.FullName : '';
    this.ownerAccountDetails['swapaccount'] = this.accservive.validateKeyInObj(this.accountDetails, ['SwapAccount', 'Name']) ? this.accountDetails.SwapAccount.Name : '';
    this.ownerAccountDetails['isswapaccount'] = this.accountDetails.isSwapAccount ? this.accountDetails.isSwapAccount : false;
    this.ownerAccountDetails['alternateaccountowner'] = (this.accountDetails.AlternateAccountOwner && this.accountDetails.AlternateAccountOwner.FullName) ? this.accountDetails.AlternateAccountOwner.FullName : '';
    this.ownerAccountDetails['alternateswapaccount'] = this.accservive.validateKeyInObj(this.accountDetails, ['AlternateSwapAccount', 'Name']) ? this.accountDetails.AlternateSwapAccount.Name : '';
    this.ownerAccountDetails['isalternateswapaccount'] = this.accountDetails.IsAlternateSwapAccount ? this.accountDetails.IsAlternateSwapAccount : false;
    this.ExistingRatio = (this.accountDetails.Owner && this.accountDetails.Owner.ExistingRatio) ? this.accountDetails.Owner.ExistingRatio : 0;
    if(this.accountDetails.Vertical && this.accountDetails.Vertical.IsSubVerticalExist){
      let subvertivalIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'subvertical');
      this.profileForm.controls['SecondaryDetails']['controls'][subvertivalIndex].enable();
    }
    else {
      let subvertivalIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'subvertical');
      this.profileForm.controls['SecondaryDetails']['controls'][subvertivalIndex].disable();
      // this.accountCreationObj['prospect']['subvertical']=''
    }
    if (this.accountDetails.Owner && this.accountDetails.Owner.HuntingRatio > 0)
      this.isHunatble = false;

    console.log(this.accountDetails, this.ownerAccountDetails);
    /* for input and textbox, take value from formbuilder .. this.AccDetailsForm.value.currency || ''*/
    this.accountCreationObj = {
      "prospect": {
        "prospectid": (this.accountDetails.SysGuid) ? this.accountDetails.SysGuid : '',
        "parentaccount": (this.accountDetails.ParentAccount['SysGuid']) ? this.accountDetails.ParentAccount['SysGuid'] : '',
        "ultimateparent": (this.accountDetails.UltimateParentAccount['SysGuid']) ? this.accountDetails.UltimateParentAccount['SysGuid'] : '',
        "headquarters": (this.accountDetails.HeadQuarters) ? this.accountDetails.HeadQuarters : '',
        "countrycode": (this.accountDetails.Address && this.accountDetails.Address.CountryCode) ? this.accountDetails.Address.CountryCode : '',
        "state": (this.accountDetails.Address && this.accountDetails.Address.State && this.accountDetails.Address.State.SysGuid) ? this.accountDetails.Address.State.SysGuid : '',
        "phonenumber": (this.accountDetails.Contact && this.accountDetails.Contact.ContactNo) ? this.accountDetails.Contact.ContactNo : '',
        "email": (this.accountDetails.Email) ? this.accountDetails.Email : '',
        "businessdescription": (this.accountDetails.BusinessDescription) ? this.accountDetails.BusinessDescription : '',
        "sicdescription": (this.accountDetails.SicDescription) ? this.accountDetails.SicDescription : '',
        "stockindexmembership": (this.accountDetails.StockIndexMemberShip) ? this.accountDetails.StockIndexMemberShip : '',
        "tickersymbol": (this.accountDetails.TickerSymbol) ? this.accountDetails.TickerSymbol : '',
        "currency": (this.accountDetails.Currency && this.accountDetails.Currency.Id) ? this.accountDetails.Currency.Id : '',
        "fortune": (this.accountDetails.FortuneRanking) ? this.accountDetails.FortuneRanking : '',
        "profits": (this.accountDetails.GrossProfit) ? this.accountDetails.GrossProfit : '',
        "revenue": (this.accountDetails.Revenue) ? this.accountDetails.Revenue : '',
        "operatingmargins": (this.accountDetails.OperatingMargin) ? this.accountDetails.OperatingMargin : '',
        "marketvalue": (this.accountDetails.MarketValue) ? this.accountDetails.MarketValue : '',
        "returnonequity": (this.accountDetails.ReturnOnEquity) ? this.accountDetails.ReturnOnEquity : '',
        "entitytype": (this.accountDetails.EntityType && this.accountDetails.EntityType.Id) ? this.accountDetails.EntityType.Id : '',
        "creditscore": (this.accountDetails.CreditScore) ? this.accountDetails.CreditScore : '',
        "isswapaccount": this.accountDetails.isSwapAccount || false,
        "swapaccount": this.accservive.validateKeyInObj(this.accountDetails, ['SwapAccount', 'SysGuid']) ? this.accountDetails.SwapAccount.SysGuid : '',
        "growthcategory": (this.accountDetails.GrowthCategory && this.accountDetails.GrowthCategory.Id) ? this.accountDetails.GrowthCategory.Id : '',
        "revenuecategory": (this.accountDetails.RevenueCategory && this.accountDetails.RevenueCategory.Id) ? this.accountDetails.RevenueCategory.Id : '',
        "sbu": (this.accountDetails.SBU && this.accountDetails.SBU.Id) ? this.accountDetails.SBU.Id : '',
        "cbu": (this.accountDetails.CBU && this.accountDetails.CBU.SysGuid) ? this.accountDetails.CBU.SysGuid : '',
        "newagebusiness": this.accountDetails.IsNewAgeBusiness || false,
        "governementaccount": this.accountDetails.IsGovAccount || false,
        "vertical": (this.accountDetails.Vertical && this.accountDetails.Vertical.Id) ? this.accountDetails.Vertical.Id : '',
        "subvertical": (this.accountDetails.SubVertical && this.accountDetails.SubVertical.Id) ? this.accountDetails.SubVertical.Id : '',
        "city": (this.accountDetails.Address && this.accountDetails.Address.City && this.accountDetails.Address.City.SysGuid) ? this.accountDetails.Address.City.SysGuid : '',
        "country": (this.accountDetails.Address && this.accountDetails.Address.Country && this.accountDetails.Address.Country.SysGuid) ? this.accountDetails.Address.Country.SysGuid : '',
        "region": (this.accountDetails.Address && this.accountDetails.Address.Region && this.accountDetails.Address.Region.SysGuid) ? this.accountDetails.Address.Region.SysGuid : (this.accountDetails.Region && this.accountDetails.Region.SysGuid) ? this.accountDetails.Region.SysGuid : '',
        "geography": (this.accountDetails.Geo && this.accountDetails.Geo.SysGuid) ? this.accountDetails.Geo.SysGuid : '',
        "website": (this.accountDetails.WebsiteUrl) ? this.accountDetails.WebsiteUrl : '',
        "ownershiptype": (this.accountDetails.OwnershipType && this.accountDetails.OwnershipType.Id) ? this.accountDetails.OwnershipType.Id : '',
        "dunsid": (this.accountDetails['DUNSID'] && this.accountDetails['DUNSID']['SysGuid']) ? this.accountDetails['DUNSID']['SysGuid'] : '',
        "cluster": (this.accountDetails['Cluster'] && this.accountDetails['Cluster']['Id']) ? this.accountDetails['Cluster']['Id'] : '',
        "owner": (this.accountDetails.Owner && this.accountDetails.Owner.SysGuid) ? this.accountDetails.Owner.SysGuid : '',
        "prospectnumber": "",
        "name": (this.accountDetails['Name']) ? this.accountDetails['Name'] : '',
        "requesttype": (this.accountDetails.isSwapAccount || this.accountDetails.isalternateswapaccount) ? 3 : 1,
        // "prospecttype": 2, /* Hunting */
        "finanacialyear": (this.accountDetails.FinYear && this.accountDetails.FinYear.SysGuid) ? this.accountDetails.FinYear.SysGuid : '',
        "coveragelevel": (this.accountDetails.CoverageLevel && this.accountDetails.CoverageLevel.Id) ? this.accountDetails.CoverageLevel.Id : '',
        "employees": (this.accountDetails.EmployeeCount) ? this.accountDetails.EmployeeCount : '',
        "address": (this.accountDetails.Address && this.accountDetails.Address.Address1) ? this.accountDetails.Address.Address1 : '',
        "statuscode": (this.accountDetails.Status['Id']) ? this.accountDetails.Status['Id'] : '',
        "swapaccountcomment": (this.accountDetails.swapaccountcomment) ? this.accountDetails.swapaccountcomment : '',
        "parentsdunsid": (this.accountDetails.ParentAccount && this.accountDetails.ParentAccount['DUNSID'] && this.accountDetails.ParentAccount['DUNSID']['SysGuid']) ? this.accountDetails.ParentAccount['DUNSID']['SysGuid'] : '',
        "ultimateparentsdunsid": (this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount['DUNSID'] && this.accountDetails.UltimateParentAccount['DUNSID']['SysGuid']) ? this.accountDetails.UltimateParentAccount['DUNSID']['SysGuid'] : '',
        // "createby": (this.accservive.validateKeyInObj(this.accountDetails, ['CreatedBy', 'SysGuid'])) ? this.accountDetails.CreatedBy.SysGuid : '',
        "createby": this.requestedby || '',
        "citystring": this.accountDetails.Address.CityString ? this.accountDetails.Address.CityString : '',
        "countrystring": this.accountDetails.Address.CountryString ? this.accountDetails.Address.CountryString : '',
        "alternateaccountowner": (this.accountDetails.AlternateAccountOwner && this.accountDetails.AlternateAccountOwner.SysGuid) ? this.accountDetails.AlternateAccountOwner.SysGuid : '',
        "alternateswapaccount": this.accservive.validateKeyInObj(this.accountDetails, ['AlternateSwapAccount', 'SysGuid']) ? this.accountDetails.AlternateSwapAccount.SysGuid : '',
        "isalternateswapaccount": this.accountDetails.IsAlternateSwapAccount || false,
      }
    }
    console.log(this.accountCreationObj);

    return this.accountCreationObj['prospect'];
  }

  buildModificationObject() {
    this.accountModificationObj["account"] = {
      "accountname": this.accountCreationObj['prospect']['name'] || '',
      "name": this.accountCreationObj['prospect']['name'] || '',
      "accountid": this.accountDetails['MapGuid'] || '',
      "accounttype": (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id'])) ? this.accountDetails['Type']['Id'] : '',
      "proposedaccounttype": (this.accservive.validateKeyInObj(this.accountDetails, ['ProposedAccountType', 'Id'])) ? this.accountDetails['ProposedAccountType']['Id'] : '',//this.accountDetails['ProposedAccountType'] || '',
      "parentaccount": this.accountCreationObj['prospect']['parentaccount'] || '',
      "ultimateParent": this.accountCreationObj['prospect']['ultimateparent'] || '',
      "newclassification": (this.accservive.validateKeyInObj(this.accountDetails, ['AccountClassification', 'Id'])) ? this.accountDetails['AccountClassification']['Id'] : '',
      "proposedclassification": (this.accservive.validateKeyInObj(this.accountDetails, ['ProposedAccountClassification', 'Id'])) ? this.accountDetails['ProposedAccountClassification']['Id'] : '',
      "sbu": this.accountCreationObj['prospect']['sbu'] || '',
      "vertical": this.accountCreationObj['prospect']['vertical'] || '',
      "subvertical": this.accountCreationObj['prospect']['subvertical'] || '',
      "cluster": this.accountCreationObj['prospect']['cluster'] || '',
      "adhvdh": (this.accservive.validateKeyInObj(this.accountDetails, ['DeliveryManagerADHVDH', 'FullName'])) ? this.accountDetails['DeliveryManagerADHVDH']['FullName'] : '',
      "geography": this.accountCreationObj['prospect']['geography'] || '',
      "region": this.accountCreationObj['prospect']['region'] || '',
      "creditdelinquencyscore": (this.accountCreationObj['prospect']['creditscore']) ? this.accountCreationObj['prospect']['creditscore'] + "" : '',
      "governmentaccount": this.accountCreationObj['prospect']['governementaccount'] || false,
      "newagebusinessacc": this.accountCreationObj['prospect']['newagebusiness'] || false,
      "city": this.accountCreationObj['prospect']['city'] || '',
      "country": this.accountCreationObj['prospect']['country'] || '',
      "mainphone": this.accountCreationObj['prospect']['phonenumber'] || '',
      "url": '',
      "sic": this.accountCreationObj['prospect']['sicdescription'] || '',
      "stockindexmembership": this.accountCreationObj['prospect']['stockindexmembership'] || '',
      "fortuneranking": this.accountCreationObj['prospect']['fortune'] || '',
      "operatingmargin": this.accountCreationObj['prospect']['operatingmargins'] || '',
      "entitytype": this.accountCreationObj['prospect']['entitytype'] || '',
      "tickersymbol": this.accountCreationObj['prospect']['tickersymbol'] || '',
      "itlandscape": this.accountDetails.itlandscape || '',
      "noofemployees": this.accountCreationObj['prospect']['employees'] || '',
      "marketvalueinmn": this.accountCreationObj['prospect']['marketvalue'] || '',
      "revenueinmn": this.accountCreationObj['revenue'] || '',
      "coveragelevel": this.accountCreationObj['prospect']['coveragelevel'] || '',
      "accountcategory": (this.accservive.validateKeyInObj(this.accountDetails, ['AccountCategory', 'Id'])) ? this.accountDetails['AccountCategory']['Id'] : '',
      "standbyaccountowner": (this.accservive.validateKeyInObj(this.accountDetails, ['StandByAccountOwner', 'Id'])) ? this.accountDetails['StandByAccountOwner']['Id'] : '',
      "countrycode": this.accountCreationObj['prospect']['countrycode'] || '',
      "parentsdunsnumber": this.accountCreationObj['prospect']['parentsdunsid'] || '',
      "address": this.accountCreationObj['prospect']['address'] || '',
      "businessdescription": this.accountCreationObj['prospect']['businessdescription'] || '',
      "websiteurl": this.accountCreationObj['prospect']['website'] || '',
      "grossprofit": this.accountCreationObj['prospect']['profits'] || '',
      "currency": this.accountCreationObj['prospect']['currency'] || '',
      "isswap": this.accountCreationObj['prospect']['isswapaccount'] || false,
      "swapaccount": this.accountCreationObj['prospect']['swapaccount'] || '',
      "isownermodified": false,
      "requestedby": this.requestedby,
      "requesttype": (this.accservive.validateKeyInObj(this.accountDetails, ['Type', 'Id']) != 1) ? 1 : 4,
      "cratedby": this.accountCreationObj['prospect']['cratedby'] || '',
      /**new attribute added from UI */
      "headquarters": this.accountCreationObj['prospect']['headquarters'] || '',
      "citystring": this.accountCreationObj['prospect']['citystring'] || '',
      "countrystring": this.accountCreationObj['prospect']['countrystring'] || '',
      "email": this.accountCreationObj['prospect']['email'] || '',
      "revenue": this.accountCreationObj['prospect']['revenue'] || '',
      "returnonequity": this.accountCreationObj['prospect']['returnonequity'] || '',
      "ownershiptype": this.accountCreationObj['prospect']['ownershiptype'] || '',
      "growthcategory": this.accountCreationObj['prospect']['growthcategory'] || '',
      "revenuecategory": this.accountCreationObj['prospect']['revenuecategory'] || '',
      "state": this.accountCreationObj['prospect']['state'] || '',
      "finanacialyear": this.accountCreationObj['prospect']['finanacialyear'] || '',
      "owner": this.accountCreationObj['prospect']['owner'] || '',
    };
    this.modificationAttributes = { ...this.accountModificationObj["account"] };
    return this.accountModificationObj["account"];
  }
  buildPostObject() {
    this.accountCreationObj["prospect"] = this.build_prospect_obj();
    // this.accountCreationObj["prospect"] = this.postObjValidator(this.build_prospect_obj());
  }
  clearFormValue(formObject, formName, key) {
    let ind = formObject.findIndex(fo => fo.key == key);
    if (ind != -1)
      formName.controls[ind].setValue('');
  }
  /* get API's for binding with select box and search field start kunal*/
  /* select box values, one time call ** START ** KKN ***/
  // getCurrency(dataArray, key) {
  //   console.log(dataArray);
  //   let ind = dataArray.findIndex(dat => dat.key == key);
  //   this.master3Api.getCurrency().subscribe(result => {
  //     console.log(result);
  //     if (!result.IsError && result.ResponseObject) {
  //       // this.createDropdown.Currency = result.ResponseObject;
  //       dataArray[ind].data = result.ResponseObject;
  //       dataArray[ind].data.map(elt => {
  //         elt['Value'] = this.getCurencySymbol(elt['Desc']);
  //       })
  //     }
  //   });
  //   console.log(dataArray);
  // }
  getEntity(dataArray, key) {
    let ind = dataArray.findIndex(dat => dat.key == key);
    this.master3Api.getEntityType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        // this.createDropdown.entitytype = result.ResponseObject;
        dataArray[ind].data = result.ResponseObject;
      }
    })
    // return this.createDropdown.entity;
  }
  getOwnersTypes(dataArray, key) {
    let ind = dataArray.findIndex(dat => dat.key == key);
    this.master3Api.getProspectOwnerShipType().subscribe(result => {
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        // this.createDropdown.ownershipTypes = result.ResponseObject;
        dataArray[ind].data = result.ResponseObject;
      }
    })
    // return this.createDropdown.ownershipTypes;
  }
  getgrowthcategory(dataArray, key) {
    let ind = dataArray.findIndex(dat => dat.key == key);
    this.master3Api.GetGrowthCategory().subscribe(result => {
      if (!result.IsError && result.ResponseObject) {
        // this.createDropdown.growthCatagoryValues = res.ResponseObject;
        dataArray[ind].data = result.ResponseObject;
        //   if (res.ResponseObject.length == 0)
        //     this.growthCatagoryValues['message'] = 'No record found';
        // }
        // else {
        //   this.growthCatagoryValues['message'] = 'No record found';
        // }
        // console.log("growth category reaponse", this.growthCatagoryValues);
      }
    });
    // return this.createDropdown.growthCatagoryValues;
  }
  getcoveragelevel(dataArray, key) {
    let ind = dataArray.findIndex(dat => dat.key == key);
    this.master3Api.GetCoverageLevel().subscribe(result => {
      if (!result.IsError && result.ResponseObject) {
        dataArray[ind].data = result.ResponseObject;
        // this.createDropdown.coveragelevelValues = res.ResponseObject;
        // console.log("coveragelevel,", this.coveragelevelValues)
        //   if (res.ResponseObject.length == 0)
        //     this.coveragelevelValues['message'] = 'No record found';
        // }
        // else {
        //   this.coveragelevelValues['message'] = 'No record found';
      }
    })
    // return this.createDropdown.coveragelevelValues;
  }
  GetRevenueCategory(dataArray, key) {
    let ind = dataArray.findIndex(dat => dat.key == key);
    this.master3Api.GetRevenueCategory().subscribe(result => {
      if (!result.IsError && result.ResponseObject) {
        dataArray[ind].data = result.ResponseObject;
        // this.createDropdown.revenueCatagoryValues = res.ResponseObject;
        //   if (res.ResponseObject.length == 0)
        //     this.revenueCatagoryValues['message'] = 'No record found';
        // }
        // else {
        //   this.revenueCatagoryValues['message'] = 'No record found';
      }
      // console.log("revenue catagory response", this.revenueCatagoryValues)
    })
    // return this.createDropdown.revenueCatagoryValues;
  }

  /* select box values, one time call ** END ** KKN ***/

  /* search filed values, call on keyup ** START ** KKN ***/

  getparentaccount(searchKey, key, formName, dataArray, i) {
    dataArray[i].data = [];
    dataArray[i]['message'] = '';
    if (!this.accservive.searchFieldValidator(searchKey)) {
      this.isActivityGroupSearchLoading = false;
    }
    else {
      this.isActivityGroupSearchLoading = true;
      this.master3Api.getparentaccount(searchKey).subscribe((res: any) => {
        console.log("parent account rsponse ", res.ResponseObject);
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          dataArray[i].data = res.ResponseObject;
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, key);
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, key);
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }

  /* Notes: 
      1. child(Region, Country, state, city) of GEO hirarchy should be get deleted, after entering search key in geo field.
      2. Id's of camunda post object of child(Region, Country, state, city) of GEO hirarchy should be get deleted, after entering search key in geo field.
      3. clearFormValue() method is used ot clear form data of particular field.
      4. accountCreationObj['prospect'][key] = ''; is used ot clear value from camunda post object.
      5. same logic applied for all hirarchy methods.
      6. getHierarchicalData() method is used to call hirachical API's.
          - below attributes is used to call the getHierarcalData() method 
            key: 'geo', -- used for differenciate
             keyword: searchKey, -- entered value in lookup field
              parentsIds: {}  -- used for search child
      */
  getGeo(event, searchKey, formName, dataArray, i) {
    console.log("region", searchKey);
    dataArray[i]['message'] = '';
    dataArray[i].data = [];
    let stateIndex = dataArray.findIndex(da => da.key == 'state');
    let cityIndex = dataArray.findIndex(da => da.key == 'city');

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['geography'] = '';
      this.accountCreationObj['prospect']['region'] = '';
      this.accountCreationObj['prospect']['country'] = '';
      this.accountCreationObj['prospect']['state'] = '';
      this.accountCreationObj['prospect']['city'] = '';

      this.clearFormValue(dataArray, formName, 'region');
      this.clearFormValue(dataArray, formName, 'country');
      this.clearFormValue(dataArray, formName, 'state');
      this.clearFormValue(dataArray, formName, 'city');
      this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
      this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country'], false);
      this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
      this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
    }
    else {
      if (searchKey == '' || event.type == 'keyup') {
        this.accountCreationObj['prospect']['geography'] = '';
        this.accountCreationObj['prospect']['region'] = '';
        this.accountCreationObj['prospect']['country'] = '';
        this.accountCreationObj['prospect']['state'] = '';
        this.accountCreationObj['prospect']['city'] = '';

        this.clearFormValue(dataArray, formName, 'region');
        this.clearFormValue(dataArray, formName, 'country');
        this.clearFormValue(dataArray, formName, 'state');
        this.clearFormValue(dataArray, formName, 'city');
        this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
      this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
        // this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
        // this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country']);
      }
      this.isActivityGroupSearchLoading = true;
      let postObj = { key: 'geo', keyword: searchKey, parentsIds: {} };
      let orginalArray = this.accountListService.getHierarchicalData(postObj);
      // let orginalArray = this.master3Api.getgeobyname(searchKey);
      orginalArray.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          dataArray[i].data = res.ResponseObject;
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'geography');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'geography');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }

  getregionbygeo(event, searchKey, formName, dataArray, i) {
    console.log(this.accountCreationObj['prospect'], event);
    let geoIndex = dataArray.findIndex(da => da.key == 'geography');
    let countryIndex = dataArray.findIndex(da => da.key == 'country');
    let stateIndex = dataArray.findIndex(da => da.key == 'state');
    let cityIndex = dataArray.findIndex(da => da.key == 'city');
    let regionIndex = dataArray.findIndex(da => da.key == 'region');

    console.log("region by geo", searchKey);
    dataArray[i]['message'] = '';
    dataArray[i].data = [];

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['country'] = '';
      this.accountCreationObj['prospect']['state'] = '';
      this.accountCreationObj['prospect']['city'] = '';

      this.clearFormValue(dataArray, formName, 'country');
      this.clearFormValue(dataArray, formName, 'state');
      this.clearFormValue(dataArray, formName, 'city');
      this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
      this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country'], false);
      this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
      this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
    }
    else {
      if (searchKey == '' || event.type == 'keyup') {
        this.accountCreationObj['prospect']['region'] = '';
        this.accountCreationObj['prospect']['country'] = '';
        this.accountCreationObj['prospect']['state'] = '';
        this.accountCreationObj['prospect']['city'] = '';

        this.clearFormValue(dataArray, formName, 'country');
        this.clearFormValue(dataArray, formName, 'state');
        this.clearFormValue(dataArray, formName, 'city');
        this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
      this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
        // this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
        // this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country']);
      }
      this.isActivityGroupSearchLoading = true;
      console.log(this.accountCreationObj['prospect']['geography']);

      let postObj = {
        key: 'region',
        keyword: searchKey,
        parentsIds: {
          'geography': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['geography']) ? this.accountCreationObj['prospect']['geography'] : ''
        }
      };
      let region = this.accountListService.getHierarchicalData(postObj);

      // // this.accservive.searchFieldValidator(this.accountCreationObj['country'])
      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['geography']))
      //   region = this.master3Api.getregionbygeo(this.accountCreationObj['prospect']['geography'], searchKey);

      // else
      //   region = this.master3Api.GetAllByRegion(searchKey);

      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['geography'])) {
            dataArray[i].data = res.ResponseObject;
          }
          else {
            this.accountCreationObj['prospect']['geography'] = '';
            // this.clearFormValue(dataArray, formName, 'geography');
            this.location_temp = res.ResponseObject;
            dataArray[i].data = [];
            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.Region);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'region');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'region');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }
  // geoId(geoId: any, value: any) {
  //   throw new Error("Method not implemented.");
  // }
  CountryByRegion(event, searchKey, formName, dataArray, i) {
    console.log(this.accountCreationObj['prospect']);
    let geoIndex = dataArray.findIndex(da => da.key == 'geography');
    let countryIndex = dataArray.findIndex(da => da.key == 'country');
    let stateIndex = dataArray.findIndex(da => da.key == 'state');
    let cityIndex = dataArray.findIndex(da => da.key == 'city');
    let regionIndex = dataArray.findIndex(da => da.key == 'region');

    dataArray[i]['message'] = '';
    dataArray[i].data = [];

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['country'] = '';
      this.accountCreationObj['prospect']['state'] = '';
      this.accountCreationObj['prospect']['city'] = '';
      this.clearFormValue(dataArray, formName, 'state');
      this.clearFormValue(dataArray, formName, 'city');
      this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
      this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country'], false);
      this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
      this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (searchKey == "" || event.type == 'keyup') {
        this.accountCreationObj['prospect']['country'] = '';
        this.accountCreationObj['prospect']['state'] = '';
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, stateIndex, this.SecondaryDetails, 1);
        this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].disable();
        this.accountCreationObj['prospect']['city'] = '';
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, cityIndex, this.SecondaryDetails, 1);
        this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].disable();
        this.clearFormValue(dataArray, formName, 'state');
        this.clearFormValue(dataArray, formName, 'city');
        this.profileForm.controls['SecondaryDetails']['controls'][stateIndex].enable();
        this.profileForm.controls['SecondaryDetails']['controls'][cityIndex].enable();
        // this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
        // this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country']);
      }
      let postObj = {
        key: 'country',
        keyword: searchKey,
        parentsIds: {
          'region': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['region']) ? this.accountCreationObj['prospect']['region'] : ''
        }
      };
      let countrybyregion = this.accountListService.getHierarchicalData(postObj);


      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['region']))
      //   countrybyregion = this.master3Api.CountryByRegion(this.accountCreationObj['prospect']['region'], searchKey);
      // else
      //   countrybyregion = this.master3Api.GetAllByCountry(searchKey);
      // else if (this.accountCreationObj['state'] !== '' && this.accountCreationObj['state'] !== undefined)
      //   countrybyregion = this.master3Api.getcountryByState(this.accountCreationObj['state'])
      // else
      //   countrybyregion = this.master3Api.getcountryByName(searchKey);
      countrybyregion.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;

        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['region'])) {
            dataArray[i].data = res.ResponseObject;
          } else {
            console.log("countryby geo", res.ResponseObject);
            if (geoIndex != -1 && dataArray[geoIndex].IsEdit) {
              this.accountCreationObj['prospect']['geography'] = '';
              // this.clearFormValue(dataArray, formName, 'geography');
            }
            if (regionIndex != -1 && dataArray[regionIndex].IsEdit) {
              this.accountCreationObj['prospect']['region'] = '';
              // this.clearFormValue(dataArray, formName, 'region');
            }

            // this.accountCreationObj['prospect']['region'] = '';
            // this.clearFormValue(dataArray, formName, 'region');
            // this.accountCreationObj['prospect']['geography'] = '';
            // this.clearFormValue(dataArray, formName, 'geography');

            this.location_temp = res.ResponseObject;
            dataArray[i].data = [];
            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.Country);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'country');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'country');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }

  getStateByCountry(event, searchKey, formName, dataArray, i) {
    let statebycountry;
    console.log(this.accountCreationObj['prospect']);
    let geoIndex = dataArray.findIndex(da => da.key == 'geography');
    let countryIndex = dataArray.findIndex(da => da.key == 'country');
    let stateIndex = dataArray.findIndex(da => da.key == 'state');
    let cityIndex = dataArray.findIndex(da => da.key == 'city');
    let regionIndex = dataArray.findIndex(da => da.key == 'region');
    this.location_temp = [];
    dataArray[i].data = [];
    dataArray[i]['message'] = '';
    console.log(this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['country']));

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['city'] = '';
      this.clearFormValue(dataArray, formName, 'city');
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (searchKey == "" || event.type == 'keyup') {
        this.accountCreationObj['prospect']['state'] = '';
        this.accountCreationObj['prospect']['city'] = '';
        this.clearFormValue(dataArray, formName, 'city');
      }
      let postObj = {
        key: 'state',
        keyword: searchKey,
        parentsIds: {
          'country': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['country']) ? this.accountCreationObj['prospect']['country'] : ''
        }
      };
      statebycountry = this.accountListService.getHierarchicalData(postObj);

      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['country']))
      //   statebycountry = this.master3Api.getStateByCountry(this.accountCreationObj['prospect']['country'], searchKey);
      // else
      //   statebycountry = this.master3Api.GetAllByState(searchKey);

      statebycountry.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          if (res.ResponseObject.length <= 0) this.AssignValidatior(dataArray, stateIndex, formName, 1);
          else this.AssignValidatior(dataArray, stateIndex, formName, -1);

          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['country'])) {
            dataArray[i].data = res.ResponseObject;
          } else {
            this.location_temp = res.ResponseObject;
            console.log(this.location_temp);
            // let temp1 = ['geography', 'region', 'country'];
            if (geoIndex != -1 && dataArray[geoIndex].IsEdit) {
              this.accountCreationObj['prospect']['geography'] = '';
              // this.clearFormValue(dataArray, formName, 'geography');
            }
            if (regionIndex != -1 && dataArray[regionIndex].IsEdit) {
              this.accountCreationObj['prospect']['region'] = '';
              // this.clearFormValue(dataArray, formName, 'region');
            }
            if (countryIndex != -1 && dataArray[countryIndex].IsEdit) {
              this.accountCreationObj['prospect']['country'] = '';
              // this.clearFormValue(dataArray, formName, 'country');
            }
            if (this.location_temp.length > 0 && this.location_temp[0]['Country'] && this.location_temp[0]['Country']['Name'] && this.nonValidatorCountry.indexOf((this.location_temp[0]['Country']['Name']).toLowerCase()) != -1) {
              this.AssignValidatior(dataArray, stateIndex, formName, -1);
              this.AssignValidatior(dataArray, cityIndex, formName, -1);
            }
            else {
              this.AssignValidatior(dataArray, stateIndex, formName, 1);
              this.AssignValidatior(dataArray, cityIndex, formName, 1);
            }
            // this.accountCreationObj['prospect']['region'] = '';
            // this.clearFormValue(dataArray, formName, 'region');
            // this.accountCreationObj['prospect']['geography'] = '';
            // this.clearFormValue(dataArray, formName, 'geography');
            // this.accountCreationObj['prospect']['country'] = '';
            // this.clearFormValue(dataArray, formName, 'country');
            dataArray[i].data = [];
            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.State);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'state');
            dataArray[i].data = [];
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'state');
          dataArray[i].data = [];
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }
  getCityByState(event, searchKey, formName, dataArray, i) {
    console.log(this.accountCreationObj['prospect']);
    let geoIndex = dataArray.findIndex(da => da.key == 'geography');
    let countryIndex = dataArray.findIndex(da => da.key == 'country');
    let stateIndex = dataArray.findIndex(da => da.key == 'state');
    let cityIndex = dataArray.findIndex(da => da.key == 'city');
    let regionIndex = dataArray.findIndex(da => da.key == 'region');

    dataArray[i]['message'] = '';
    let citybyname;
    dataArray[i].data = [];

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
    }
    else {
      if (searchKey == '' || event.type == 'keyup') {
        this.accountCreationObj['prospect']['city'] = '';
      }
      this.isActivityGroupSearchLoading = true;
      let postObj = {
        key: 'city',
        keyword: searchKey,
        parentsIds: {
          'state': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['state']) ? this.accountCreationObj['prospect']['state'] : '',
          'country': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['country']) ? this.accountCreationObj['prospect']['country'] : ''
        }
      };
      citybyname = this.accountListService.getHierarchicalData(postObj);

      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['state']))
      //   citybyname = this.master3Api.getCityByState(this.accountCreationObj['prospect']['state'], searchKey);
      // else
      //   citybyname = this.master3Api.GetAllByCity(searchKey);
      citybyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          if (res.ResponseObject.length <= 0) this.AssignValidatior(dataArray, cityIndex, formName, 1);
          else this.AssignValidatior(dataArray, cityIndex, formName, -1);

          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['state'])) {
            dataArray[i].data = res.ResponseObject;
          }
          else {
            //   let temp1 = ['geography', 'region', 'country', 'state'];
            if (geoIndex != -1 && dataArray[geoIndex].IsEdit) {
              this.accountCreationObj['prospect']['geography'] = '';
              // this.clearFormValue(dataArray, formName, 'geography');
            }
            if (regionIndex != -1 && dataArray[regionIndex].IsEdit) {
              this.accountCreationObj['prospect']['region'] = '';
              // this.clearFormValue(dataArray, formName, 'region');
            }
            if (countryIndex != -1 && dataArray[countryIndex].IsEdit) {
              this.accountCreationObj['prospect']['country'] = '';
              // this.clearFormValue(dataArray, formName, 'country');
            }
            if (stateIndex != -1 && dataArray[stateIndex].IsEdit) {
              this.accountCreationObj['prospect']['state'] = '';
              // this.clearFormValue(dataArray, formName, 'state');
            }
            // if( res.ResponseObject){
            //   if (res.ResponseObject.length > 0) this.AssignValidatior(dataArray, subverticalIndex, formName, -1);
            //   else this.AssignValidatior(dataArray, subverticalIndex, formName, 1);
            // }

            this.location_temp = res.ResponseObject;
            // console.log(this.location_temp.length > 0 ,this.location_temp[0]['Country'] , this.location_temp[0]['Country']['Name'] , this.nonValidatorCountry.indexOf((this.location_temp[0]['Country']['Name']).toLowerCase()));

            if (this.location_temp.length > 0 && this.location_temp[0]['Country'] && this.location_temp[0]['Country']['Name'] && this.nonValidatorCountry.indexOf((this.location_temp[0]['Country']['Name']).toLowerCase()) != -1) {
              this.AssignValidatior(dataArray, stateIndex, formName, -1);
              this.AssignValidatior(dataArray, cityIndex, formName, -1);
            }
            else {
              this.AssignValidatior(dataArray, stateIndex, formName, 1);
              this.AssignValidatior(dataArray, cityIndex, formName, 1);
            }

            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.City);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'city');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'city');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      });
      // citybyname.unsu
    }
  }
  getcluster(event, searchKey, formName, dataArray, i,key) {
    let subIndex = dataArray.findIndex(da => da.key == 'sbu');
    let clusterIndex = dataArray.findIndex(da => da.key == 'cluster');
    let searchText = formName.controls[subIndex].value;
    let swapsbu ;
    if(key != 'sbu'){
      // if (searchKey == "" || event.type=='keyup') {
      //   this.accountCreationObj['prospect']['cluster'] = '';
      // }
      // else{
        console.log('swapping')
        swapsbu = searchText;
        searchText = searchKey;
        searchKey = swapsbu;
     // }
    } else {
      searchText = '';
    }
    let cluster = this.master3Api.getcluster(searchKey,searchText);
    cluster.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        if (res.ResponseObject.length > 0){
          this.AssignValidatior(dataArray, clusterIndex, formName, -1);
          this.profileForm.controls['SecondaryDetails']['controls'][clusterIndex].enable();
        } 
        else {
          this.accountCreationObj['prospect']['cluster'] = '';
          this.AssignValidatior(dataArray, clusterIndex, formName, 1);
          this.profileForm.controls['SecondaryDetails']['controls'][clusterIndex].disable();
        }

        dataArray[i].data = res.ResponseObject;
        if (res.ResponseObject.length == 0) {
          // this.clearFormValue(dataArray, formName, 'sbu');
          dataArray[i]['message'] = 'No record found';
        }
      }
      else {
        // this.clearFormValue(dataArray, formName, 'sbu');
        dataArray[i]['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
    })
  }
  // sbu by name 
  getSbuByName(event, searchKey, formName, dataArray, i) {
    console.log(dataArray);
    dataArray[i]['message'] = '';
    dataArray[i].data = [];

    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.clearFormValue(dataArray, formName, 'vertical');
      this.clearFormValue(dataArray, formName, 'subvertical');
      this.clearFormValue(dataArray, formName, 'cluster');
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['sbu'] = '';
      this.accountCreationObj['prospect']['vertical'] = '';
      this.accountCreationObj['prospect']['subvertical'] = '';
      this.accountCreationObj['prospect']['cluster'] = '';
    }
    else {

      if (searchKey == "" || event.type == 'keyup') {
        this.accountCreationObj['prospect']['sbu'] = '';
        this.accountCreationObj['prospect']['vertical'] = '';
        this.clearFormValue(dataArray, formName, 'vertical');
        this.accountCreationObj['prospect']['subvertical'] = '';
        this.clearFormValue(dataArray, formName, 'subvertical');
        this.clearFormValue(dataArray, formName, 'cluster');
        this.accountCreationObj['prospect']['cluster'] = '';
      }
      this.isActivityGroupSearchLoading = true;
      let postObj = {
        key: 'sbu',
        keyword: searchKey,
        parentsIds: {}
      };
      let sbubyname = this.accountListService.getHierarchicalData(postObj);

      sbubyname.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          dataArray[i].data = res.ResponseObject;
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'sbu');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'sbu');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;

      })
    }
  }


  // vertical  by passing sbuid
  getVerticalbySBUID(event, searchKey, formName, dataArray, i) {
    console.log(event);
    this.lookupdata.TotalRecordCount = 0;
    let vertical;
    let subverticalIndex = dataArray.findIndex(da => da.key == 'subvertical');
    let subIndex = dataArray.findIndex(da => da.key == 'sbu');
    dataArray[i].data = [];
    this.sub_and_vertical = [];
    dataArray[i]['message'] = '';
    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.clearFormValue(dataArray, formName, 'subvertical');
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['vertical'] = '';
      this.accountCreationObj['prospect']['subvertical'] = '';
    }
    else {
      this.isActivityGroupSearchLoading = true;
      if (searchKey == "" || event.type == 'keyup') {
        this.accountCreationObj['prospect']['vertical'] = '';
        this.accountCreationObj['prospect']['subvertical'] = '';
        this.clearFormValue(dataArray, formName, 'subvertical');
      }

      let postObj = {
        key: 'vertical',
        keyword: searchKey,
        parentsIds: { 'sbu': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu']) ? this.accountCreationObj['prospect']['sbu'] : '' }
      };
      vertical = this.accountListService.getHierarchicalData(postObj);


      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu']))
      //   // if (this.accountCreationObj['sbu'] != '' && this.accountCreationObj['sbu'] != null && this.accountCreationObj['sbu'] != undefined)
      //   vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['prospect']['sbu'], searchKey)
      // else if (!this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu']))
      //   vertical = this.master3Api.SearchVerticalAndSBU(searchKey)
      // let vertical = this.master3Api.getVerticalbySBUID(this.accountCreationObj['sbu'], searchKey)
      vertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.AssignValidatior(dataArray, subverticalIndex, formName, 1);

          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu'])) {
            dataArray[i].data = res.ResponseObject;
          }
          else {
            if (subIndex != -1 && dataArray[subIndex].IsEdit) {
              this.sub_and_vertical = res.ResponseObject;
              this.accountCreationObj['prospect']['sbu'] = '';
              // this.clearFormValue(dataArray, formName, 'sbu');
            }
            dataArray[i].data = [];
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.Vertical);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'vertical');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'vertical');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }

  getSubVerticalByVertical(event, searchKey, formName, dataArray, i) {
    this.lookupdata.TotalRecordCount = 0;
    console.log(this.accountCreationObj['prospect']);
    // if (event.key) this.accountCreationObj['prospect']['subvertical'] = '';
    dataArray[i]['message'] = '';
    this.sub_and_vertical = [];
    dataArray[i].data = [];
    let subIndex = dataArray.findIndex(da => da.key == 'sbu');
    let verticalIndex = dataArray.findIndex(da => da.key == 'vertical');
    let subverticalIndex = dataArray.findIndex(da => da.key == 'subvertical');
    let subvertical;
    if (!this.accservive.searchFieldValidator(searchKey) && searchKey != '') {
      this.isActivityGroupSearchLoading = false;
      this.accountCreationObj['prospect']['subvertical'] = '';
      this.clearFormValue(dataArray, formName, 'subvertical');
    }
    else {
      if (searchKey == "" || event.type == 'keyup') {
        this.accountCreationObj['prospect']['subvertical'] = '';
      }

      // if (searchKey !== '') {
      this.isActivityGroupSearchLoading = true;
      let postObj = {
        key: 'subvertical',
        keyword: searchKey,
        parentsIds: {
          'sbu': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['sbu']) ? this.accountCreationObj['prospect']['sbu'] : '',
          'vertical': this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['vertical']) ? this.accountCreationObj['prospect']['vertical'] : ''
        }
      };
      subvertical = this.accountListService.getHierarchicalData(postObj);


      // if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['vertical']))
      //   subvertical = this.master3Api.getSubVerticalByVertical(this.accountCreationObj['prospect']['vertical'], searchKey);
      // else
      //   subvertical = this.master3Api.SearchAllBySubVertical(searchKey);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          if (res.ResponseObject.length > 0) this.AssignValidatior(dataArray, subverticalIndex, formName, -1);
          else this.AssignValidatior(dataArray, subverticalIndex, formName, 1);

          if (this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['vertical'])) {
            dataArray[i].data = res.ResponseObject;
          }
          else {
            this.sub_and_vertical = res.ResponseObject;
            if (subIndex != -1 && dataArray[subIndex].IsEdit) {
              this.accountCreationObj['prospect']['sbu'] = '';
              // this.clearFormValue(dataArray, formName, 'sbu');
            }
            if (verticalIndex != -1 && dataArray[verticalIndex].IsEdit) {
              this.accountCreationObj['prospect']['vertical'] = '';
              // this.clearFormValue(dataArray, formName, 'vertical');
            }

            res.ResponseObject.map(data => {
              dataArray[i].data.push(data.SubVertical);
            });
          }
          if (res.ResponseObject.length == 0) {
            // this.clearFormValue(dataArray, formName, 'subvertical');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          // this.clearFormValue(dataArray, formName, 'subvertical');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }
  getSymbol(data) {
    // console.log(data)
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
  getTenRecords(res) {
    // debugger;
    let resdata = res.slice(0, 9);
    return resdata;
  }
  getCurrencyLookUp(event, searchKey, formName, dataArray, i) {
    dataArray[i]['message'] = '';
    dataArray[i].data = [];
    this.lookupdata.TotalRecordCount = 0;
    if ((!this.accservive.searchFieldValidator(searchKey) && searchKey != "") || event.key) {
      this.accountCreationObj['prospect']['currency'] = '';
    }
    this.isActivityGroupSearchLoading = true;
    let currencyValues = this.master3Api.getcurrencyaccount(searchKey)
    currencyValues.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        if (searchKey !== '') {
          dataArray[i].data = res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) });
          // this.currencyaccount = res.ResponseObject;
        } else {
          dataArray[i].data = this.getTenRecords(res.ResponseObject.map(x => x = { ...x, Desc: this.getSymbol(x.Desc) }));
        }
        dataArray[i].data.map(x => x.Name = x.Desc);
        if (res.ResponseObject.length == 0) {
          // this.clearFormValue(dataArray, formName, 'currency');
          dataArray[i]['message'] = 'No record found';
        }
      }
      else {
        // this.clearFormValue(dataArray, formName, 'currency');
        dataArray[i]['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
    })
  }
  getFinancialYear(searchKey, formName, dataArray, i) {
    // if (searchKey !== '') {
    dataArray[i]['message'] = '';
    dataArray[i].data = [];
    if (!this.accservive.searchFieldValidator(searchKey)) {
      this.accountCreationObj['prospect']['finanacialyear'] = '';
    }
    else {
      this.isActivityGroupSearchLoading = true;
      let financialyear = this.master3Api.getFinancialYear(searchKey)
      financialyear.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError && res.ResponseObject) {
          dataArray[i].data = res.ResponseObject;
          if (res.ResponseObject.length == 0) {
            this.clearFormValue(dataArray, formName, 'finanacialyear');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          this.clearFormValue(dataArray, formName, 'finanacialyear');
          dataArray[i]['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
      })
    }
  }



  //CBU
  getCbu(searchKey, formName, dataArray, i) {
    dataArray[i]['message'] = '';
    dataArray[i].data = [];

    if (!this.accservive.searchFieldValidator(searchKey)) {
      this.accountCreationObj['prospect']['cbu'] = '';
    }
    else {
      let payload = {
        "SearchText": searchKey,
        "Guid": this.accountDetails.MapGuid
      }
      var serachcbuname = this.master3Api.SearchCBU(payload);
      serachcbuname.subscribe((res: any) => {
        if (!res.IsError && res.ResponseObject) {
          dataArray[i].data = res.ResponseObject;
          if (res.ResponseObject.length == 0) {
            this.clearFormValue(dataArray, formName, 'cbu');
            dataArray[i]['message'] = 'No record found';
          }
        }
        else {
          this.clearFormValue(dataArray, formName, 'cbu');
          dataArray[i]['message'] = 'No record found';
        }
      })
    }
  }

  lefttrim(str) {
    if (str == null) return str;
    return str.replace(/^\s+/g, '');
  }
  /* search filed values, call on keyup ** END ** KKN ***/

  /* get API's for binding with select box and search field end kunal*/

  /*******************editable  comments data fileds starts here****************** */
  autocomplete(event, title, index, formControlName, formCName) {
    console.log(title, index, formControlName, formCName);
    if (typeof formControlName.value == 'string') formControlName.value = this.lefttrim(formControlName.value);

    let searchKey = formControlName.value;
    console.log(searchKey, searchKey.length);

    formControlName.setValue(searchKey);
    console.log(searchKey, searchKey.length, formControlName.value);
    switch (title) {
      //editable secondary details starts
      case 'SBU': 
      this.getSbuByName(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      case 'Vertical': this.getVerticalbySBUID(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      case 'Sub-vertical': this.getSubVerticalByVertical(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      case 'Cluster': this.getcluster(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index,'cluster');
        return;
      case 'Region': this.getregionbygeo(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      case 'Country':
        if (formCName == 'Account_details')
          this.CountryByRegion(event, searchKey, this.Account_details, this.WithoutInputFields_Account_details, index);
        else if (formCName == 'SecondaryDetails')
          this.CountryByRegion(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        else if (formCName == 'AssignmentDetails')
          this.CountryByRegion(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Country sub-division':
        if (formCName == 'SecondaryDetails')
          this.getStateByCountry(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        else if (formCName == 'AssignmentDetails')
          this.getStateByCountry(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'City':
        this.getCityByState(event, searchKey, this.Account_details, this.WithoutInputFields_Account_details, index);
        return;
      case 'City region':
        if (formCName == 'SecondaryDetails')
          this.getCityByState(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        else if (formCName == 'AssignmentDetails')
          this.getCityByState(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Geo': this.getGeo(event, searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      case 'Financial year': this.getFinancialYear(searchKey, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, index);
        return;
      //editable secondary details ends 
      //editable Assignment details starts
      case 'Owner': this.WithoutInputFields_AssignmentDetails[index].data = this.wiproContact;
        return;
      case 'SBU': this.getSbuByName(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Geo': this.getGeo(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Sub-vertical': this.getSubVerticalByVertical(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'CBU': this.getCbu(searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Region': this.getregionbygeo(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      // case 'Parent account': this.getparentaccount(searchKey, 'parentaccount', this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
      //   return;
      case 'Vertical': this.getVerticalbySBUID(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'state': this.getStateByCountry(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      // case 'Ultimate parent account': this.getparentaccount(searchKey, 'ultimateparent', this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
      //   return;
      case 'Financial year': this.getFinancialYear(searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'BU': this.WithoutInputFields_AssignmentDetails[index].data = this.wiproContact;
        return;
      case 'Currency': this.getCurrencyLookUp(event, searchKey, this.AdditionalDetails, this.WithoutInputFields_AdditionalDetails, index);
        return;
      // case 'City': this.getCityByState(searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
      //   return;
      //editable Assignment details ends 

      //editable Additional details starts
      //     case 'Stock index membership': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Ticker symbol': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Currency': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Fortune 1000 ranking': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Gross profit': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Revenue': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Operating margin': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Market value': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Return on equity': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //     case 'Credit (Delinquency) Score': this.WithoutInputFields_AdditionalDetails[index].data=this.wiproContact;
      // return; 
      //editable Additional details ends 

      //editable Business details starts
      //     case 'Direct phone': this.WithoutInputFields_Business[index].data=this.wiproContact;
      // return; 
      //     case 'Website URL': this.WithoutInputFields_Business[index].data=this.wiproContact;
      // return; 
      //     case 'Email address': this.WithoutInputFields_Business[index].data=this.wiproContact;
      // return; 
      //     case 'Employees': this.WithoutInputFields_Business[index].data=this.wiproContact;
      // return; 
      //editable Business details ends 

      //editable Account details starts
      //     case 'Headquarters': this.WithoutInputFields_Account_details[index].data=this.wiproContact;
      // return; 
      //     case 'Country code': this.WithoutInputFields_Account_details[index].data=this.wiproContact;
      // return; 
      //     case 'Address': this.WithoutInputFields_Account_details[index].data=this.wiproContact;
      // return;  
      //editable Account details ends 
    }
  }

  autocompleteAssignment(event, title, index, formControlName) {
    if (typeof formControlName.value == 'string') formControlName.value = this.lefttrim(formControlName.value);
    let searchKey = formControlName.value;

    formControlName.setValue(searchKey);
    switch (title) {
      //editable secondary details ends 
      //editable Assignment details starts 
      case 'Owner': this.WithoutInputFields_AssignmentDetails[index].data = this.wiproContact;
        return;
      case 'SBU':
        this.getSbuByName(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Geo': this.getGeo(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Sub-vertical': this.getSubVerticalByVertical(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'CBU': this.getCbu(searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Region': this.getregionbygeo(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Parent account': this.getparentaccount(searchKey, 'parentaccount', this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Vertical': this.getVerticalbySBUID(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Country': this.CountryByRegion(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'State': this.getStateByCountry(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Ultimate parent account': this.getparentaccount(searchKey, 'ultimateparent', this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'Financial year': this.getFinancialYear(searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
      case 'BU': this.WithoutInputFields_AssignmentDetails[index].data = this.wiproContact;
        return;
      case 'City': this.getCityByState(event, searchKey, this.AssignmentDetails, this.WithoutInputFields_AssignmentDetails, index);
        return;
    }
  }
  //editable secondary details starts 
  get SecondaryDetails() {
    return this.profileForm.get('SecondaryDetails') as FormArray;
  }
  // get AccountOwner() {
  //   return this.profileForm.get('AccountOwner') as FormArray;
  // }

  get AccountOwner() { return this.AccountOwner.controls; }

  //editable secondary details ends 
  //editable Assignment details starts 
  get AssignmentDetails() {
    return this.profileForm.get('AssignmentDetails') as FormArray;
  }
  //editable Assignment details ends
  //editable Additional details starts 
  get AdditionalDetails() {
    return this.profileForm.get('AdditionalDetails') as FormArray;
  }
  //editable Additional details ends 
  //editable Business details starts 
  get Business() {
    return this.profileForm.get('Business') as FormArray;
  }
  //editable Business details ends
  //editable Account details starts 
  get Account_details() {
    return this.profileForm.get('Account_details') as FormArray;
  }
  //editable Account details ends    
  /*******************editable comments data fileds ends here****************** */

  /****************** editable comments data fileds autocomplete code start ****************** */

  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = true;

  contactNameclose() {
    this.contactNameSwitch = false;
  }
  ConversationNameclose() {
    this.contactNameSwitch = false;
  }

  appendcontact(value: string, i) {
    this.contactName = value;
    this.selectedContact.push(this.wiproContact[i])
  }
  assignSelectedValue(arr, temp_val, propertyName) {
    // console.log(temp_val);
    // console.log(this.profileForm.controls[propertyName]['controls']);
    // console.log(Object.keys(temp_val));
    // console.log(this.accountCreationObj['prospect']);
    let keys = Object.keys(temp_val);

    // temp_val.forEach((temp, index) => {
    keys.forEach(k => {

      // console.log(k + ' - ' + temp_val[k].Id);
      // console.log(temp_val);
      // console.log(temp_val[index][k]['Name']);
      // console.log(temp_val[index][k]['Id']);
      // console.log(this.accountCreationObj['prospect']);

      this.accountCreationObj['prospect'][k] = temp_val[k]['Id'] || temp_val[k]['SysGuid'] || '';
      if (k == 'country') {
        this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
        this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country'], false);
        // this.getHuntingRatio(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country']);
      }

      let ind1 = arr.findIndex(ar => ar.key == k);
      if (ind1 != -1)
        this.profileForm.controls[propertyName]['controls'][ind1].setValue(temp_val[k]['Name'] || temp_val[k]['FullName'] || '');
      console.log(this.accountCreationObj['prospect'][k]);

    });
    // })
  }

  selectedValue(item, index, propertyName, arr, seleted_ind) {
    // debugger;
    console.log(arr);


    let key = arr[index].key;
    console.log(item, index, seleted_ind, key);
    let val = this.getdecodevalue(item.Name) || this.getdecodevalue(item.FullName) || this.getdecodevalue(item.Desc) || '';
    this.profileForm.controls[propertyName]['controls'][index].setValue(val);
    console.log(this.profileForm.controls[propertyName]['controls'][index]);

    this.accountCreationObj['prospect'][key] = item.Id || item.SysGuid || '';

    let temp_val = {};
    let subvertivalIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'subvertical');
    if (key == 'vertical' && !item.IsSubVerticalExist) {
      this.profileForm.controls[propertyName]['controls'][subvertivalIndex].disable();
      this.accountCreationObj['prospect']['subvertical'] = '';
    } else if(key == 'vertical' && item.IsSubVerticalExist) {
      this.profileForm.controls[propertyName]['controls'][subvertivalIndex].enable();
      this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, subvertivalIndex, this.SecondaryDetails, -1);
    }
    else {}
    if (key == 'sbu') {
      console.log(item.Name);
      let clusterIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'cluster');
      this.getcluster(event, item.Name, this.SecondaryDetails, this.WithoutInputFields_SecondaryDetails, clusterIndex,'sbu');
    } else {
    } 
    // if (this.loggedin_user == 'sbu') {
    //   this.isSbuChanged = true;
    // } else {
    //   this.isSbuChanged = false;
    // }
    this.isRequesterChanged = true;
    if (key == 'country') {
      let stateIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'state');
      let cityIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'city');
      this.checkForRequired(this.WithoutInputFields_SecondaryDetails, this.SecondaryDetails, index, key, false);
      this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
      // this.getHuntingRatio(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country']);
      this.getAllSwapAccount(this.accountCreationObj['prospect']['owner'], this.accountCreationObj['prospect']['country'], false);
      if(item.isExists){
        this.profileForm.controls[propertyName]['controls'][stateIndex].enable();
        this.profileForm.controls[propertyName]['controls'][cityIndex].disable();
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, stateIndex, this.SecondaryDetails, -1);
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails,cityIndex, this.SecondaryDetails, 1);
      }
      else {
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, stateIndex, this.SecondaryDetails, 1);
        this.accountCreationObj['prospect']['state'] = '';
        this.profileForm.controls[propertyName]['controls'][stateIndex].disable();
        this.profileForm.controls[propertyName]['controls'][cityIndex].disable();
      }
    }

    let countryIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'country');
    console.log(this.SecondaryDetails.controls[countryIndex].value, this.nonValidatorCountry.indexOf((this.SecondaryDetails.controls[countryIndex].value).toLowerCase()));
    if (key == 'state' && this.nonValidatorCountry.indexOf((this.SecondaryDetails.controls[countryIndex].value).toLowerCase()) != -1) {
      debugger;
      let cityIndex = this.WithoutInputFields_SecondaryDetails.findIndex(da => da.key == 'city');
      if (item.isExists){
        // this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, cityIndex, this.SecondaryDetails, -1);
        this.profileForm.controls[propertyName]['controls'][cityIndex].enable();
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails,cityIndex, this.SecondaryDetails, -1);
      }
      else{
        this.AssignValidatior(this.WithoutInputFields_SecondaryDetails, cityIndex, this.SecondaryDetails, 1);
        this.profileForm.controls[propertyName]['controls'][cityIndex].disable();
        this.accountCreationObj['prospect']['city'] = '';
      }
    }
    if ((this.sub_and_vertical && this.sub_and_vertical.length > 0) || this.location_temp && this.location_temp.length > 0) {
      switch (key) {
        case 'vertical':
          temp_val = { 'sbu': this.sub_and_vertical[seleted_ind]['SBU'] || [] }
          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
        case 'subvertical':
          temp_val = {
            'sbu': this.sub_and_vertical[seleted_ind]['SBU'] || [],
            'vertical': this.sub_and_vertical[seleted_ind]['Vertical'] || []
          };
          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
        case 'region':
          temp_val =
          {
            'geography': this.location_temp[seleted_ind]['Geo'] || []
          };
          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
        case 'country':
          temp_val =
          {
            'geography': this.location_temp[seleted_ind]['Geo'] || [],
            'region': this.location_temp[seleted_ind]['Region'] || []
          };
          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
        case 'state':
          temp_val =
          {
            'geography': this.location_temp[seleted_ind]['Geo'] || [],
            'region': this.location_temp[seleted_ind]['Region'] || [],
            'country': this.location_temp[seleted_ind]['Country'] || []
          };

          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
        case 'city':
          temp_val =
          {
            'geography': this.location_temp[seleted_ind]['Geo'] || [],
            'region': this.location_temp[seleted_ind]['Region'] || [],
            'country': this.location_temp[seleted_ind]['Country'] || [],
            'state': this.location_temp[seleted_ind]['State'] || []
          };
          this.assignSelectedValue(arr, temp_val, propertyName);
          break;
      }
    }
  }
  wiproContact: {}[] = [

    { id: 0, name: 'Account 1', value: true },
    { id: 1, name: 'Account 2', value: false },
    { id: 2, name: 'Account 3', value: false },
    { id: 3, name: 'Account 4', value: false },
  ]
  //Logged in as account requestor popover starts
  // popupdata: {}[] = [

  //   {
  //     id: 0, title: 'CSO', date: '(12 Jan 2019 at 15:20)',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  //   },
  //   {
  //     id: 1, title: 'SBU', date: '(12 Jan 2019 at 15:20)',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  //   },

  // ]
  //Logged in as account requestor popover ends
  selectedContact: {}[] = [];


  /****************** editable comments data fileds autocomplete code end ****************** */
  accountCount(arr, countName, index?) {
    // debugger;
    // console.log(arr.length+"------"+this.WithoutInputFields_Account_details.length);
    switch (countName) {
      case "accountDetail":
        let count = 0;
        // this.accountDetailscount =1;
        // arr.forEach(val => {
        //   if (val.isCommented) {
        //     count += 1;

        //   }
        // });
        // WithoutInputFields_AdditionalDetails[i]['RequestHistoryComments'] || WithoutInputFields_AdditionalDetails[i]['isCommented']
        // console.log(JSON.stringify(arr[index])+'==========='+JSON.stringify(this.WithoutInputFields_Account_details[index]));
        // console.log(arr[index].key+'==========='+this.WithoutInputFields_Account_details[index].stringfy());
        count = arr.filter((x,i) => { return x.isCommented}).length ;
        console.log("newcount", count);
        if (this.WithoutInputFields_Account_details[index].isCommented) {
          // this.accountDetailscount = this.accountDetailscount + count;
          this.accountDetailscount = count;
        }else{
          this.accountDetailscount = this.accountDetailscount -1;
        }
        // this.priviouscount = this.NoOfAttrComment['Account_details']

        break;
      case "business":
        let countTwo = 0;
        // arr.forEach(val => {
        //   if (val.isCommented) {
        //     countTwo += 1;
        //   }
        // });
        // this.businesscount = countTwo;
         countTwo = arr.filter((x,i) => { return x.isCommented}).length ;
        if (this.WithoutInputFields_Business[index].isCommented) {
          // this.businesscount = this.businesscount +  countTwo;
          this.businesscount = countTwo;
        }else
        {
          this.businesscount = this.businesscount -1;
        }

        break;
      case "AdditionalDetails":
        let count_3 = 0;
        // arr.forEach(val => {
        //   if (val.isCommented) {
        //     count_3 += 1;
        //   }
        // });
        count_3 = arr.filter((x,i) => { return x.isCommented}).length ;
        if(this.WithoutInputFields_AdditionalDetails[index].isCommented) {
          // this.AdditionalDetailscount =this.AdditionalDetailscount + count_3;
          this.AdditionalDetailscount = count_3;
        }else
        {
          this.AdditionalDetailscount = this.AdditionalDetailscount -1;
        }
        break;
      case "AccountOwner":
        let count_4 = 0;
        arr.forEach(val => {
          if (val.isCommented) {
            count_4 += 1;
          }
        });
        this.accountownercountOne = count_4 + this.NoOfAttrComment['AccountOwner'];
        this.accountownercount = this.accountownercountOne + this.accountownercountTwo;
        break;

      case "SecondaryDetails":
        let count_5 = 0;
        arr.forEach(val => {
          if (val.isCommented) {
            count_5 += 1;
          }
        });
        this.accountownercountTwo = count_5 + this.NoOfAttrComment['SecondaryDetails'];
        this.accountownercount = this.accountownercountOne + this.accountownercountTwo;
        break;
      case "AssignmentDetails":
        let count_6 = 0;
        arr.forEach(val => {
          if (val.isCommented) {
            count_6 += 1;
          }
        });
        this.AssignmentDetailscount = this.NoOfAttrComment['AssignmentDetails'] + count_6;
        // this.accountownercount = this.accountownercountOne + this.accountownercountTwo;
        break;
      default:
        break;
    }

  }

  multiSelectFilteredData(data, key, arraydata, control) {
    this.totalCBUs = data;
    this.cbuValueInitilize = true;
    if (this.totalCBUs.length != 0) {
      this.totalCBUs.map((data) => {
        if (data.MapGuid) {
          this.oldCBUArray.push({ 'name': data.Name, 'id': data.SysGuid })
        }
      })
    }
    console.log("these are total cbus", this.totalCBUs);
    let ind = arraydata.findIndex(ar => ar.key == key);
    console.log(data, ind, control);
    console.log(arraydata);

    console.log("multiSelectFilteredData");
    console.log("multiSelectFilteredData");

    let filteredData = [];
    if (control == 'select' && ind != -1) {
      // let cbuIndex = this.WithoutInputFields_AssignmentDetails.findIndex(da => da.key == 'cbu');
      arraydata[ind].data = [];
      data.forEach(element => {
        arraydata[ind].data.push({ 'idChecked': (element.LinkActionType && element.LinkActionType == 2) ? true : false, 'name': element.Name });
        console.log(element);
      });
      // if (arraydata[ind].data[0]) {
      //   this.AssignmentDetails.controls[ind].setValue("non used value, only for validation");
      // }
      // else {
      //   this.AssignmentDetails.controls[ind].setValue('');
      // }
      if (arraydata[ind].data.length == 0) {
        arraydata[ind].data = 'nodata';
      }

      console.log(arraydata);

    }
  }


  selectedValues(values) {
    let filteredCBUs: any = [];
    this.cbuArray = [];
    // console.log("this is my filtercheckbox", this.assignmentObj.CBU);
    // console.log("these are selected CBUs",values);
    // console.log("these are total CBUs",this.totalCBUs);
    values.map((data) => {
      this.totalCBUs.map((ele) => {
        if (data.name == ele.Name) {
          filteredCBUs.push(ele);
        }
      })

    });
    console.log("this is filteredCBUs", filteredCBUs);
    if (filteredCBUs.length != 0) {
      filteredCBUs.map((data) => {
        this.cbuArray.push({ 'id': data.SysGuid, 'name': data.Name });
      })
    }
    console.log("this is new cbu array", this.cbuArray);
    if (this.route_from == 'assign_ref') {
      let cbuIndex = this.WithoutInputFields_AssignmentDetails.findIndex(da => da.key == 'cbu');
      if (this.cbuArray.length > 0) {
        this.AssignmentDetails.controls[cbuIndex].setValue(this.cbuArray[0].id);
      } else {
        this.AssignmentDetails.controls[cbuIndex].setValue('');
      }
    }
  }
  formInitilize(isNew) {
    console.log(this.accountDetails);
    /*******************editable Account details with comments data fileds starts here****************** */
    this.WithoutInputFields_Account_details = [
      { 'fkey': ['LegalEntity'], 'key': 'legalentity', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': false, 'searchbtn': true, "AttributeName": "legalentity", 'comment': '', "title": "Legal entity name","tooltip":"If the legal entity and subsequent details are incorrect, click here to select a new legal entity." ,"data_content": this.accountDetails.LegalEntity ? this.getdecodevalue(this.accountDetails.LegalEntity) : 'NA', "control": 'span' },
      { 'fkey': ['Name'], 'key': 'name', 'datatype': 'string', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, 'attrBtn': true, "AttributeName": "name", 'comment': '', "title": "Account name","tooltip":"Name given to the account within CRM, should ideally be same as the legal entity name." ,"data_content": this.accountDetails.Name ? this.getdecodevalue(this.accountDetails.Name) : 'NA', "control": 'input' },
      { 'fkey': ['DUNSID'], 'key': 'dunsid', 'datatype': 'string', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': false, "AttributeName": "dunsid", 'comment': '', "title": "Duns number ", "tooltip":"Defines the Unique Number from Duns and Bradstreet for each legal entity", "data_content": (this.accountDetails.DUNSID && this.accountDetails.DUNSID['Name']) ? this.accountDetails.DUNSID['Name'] : 'NA', "control": 'span' },
      { 'fkey': ['ParentAccount'], 'key': 'parentaccount', 'datatype': 'string', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': false, "AttributeName": "parentaccount_name", 'comment': '', "title": "Parent's name", "data_content": this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.Name ? this.accountDetails.ParentAccount.Name : this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.DNBParent ? this.getdecodevalue(this.accountDetails.ParentAccount.DNBParent) : 'NA', "control": 'span' },
      { 'fkey': ['UltimateParentAccount'], 'key': 'ultimateparent', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': false, "AttributeName": "ultimateparentaccount_name", 'comment': '', "title": "Ultimate parent's name ", "data_content": this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.Name ? this.accountDetails.UltimateParentAccount.Name : this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.DNBUltimateParent ? this.getdecodevalue(this.accountDetails.UltimateParentAccount.DNBUltimateParent) : 'NA', "control": 'span' },
      { 'fkey': ['HeadQuarters'], 'key': 'headquarters', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': true, "AttributeName": "headquarters", 'comment': '', "title": "Headquarters", "data_content": this.accountDetails.HeadQuarters ? this.accountDetails.HeadQuarters : '', "control": 'input' },
      { 'fkey': ['Address', 'CityString'], 'key': 'citystring', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': true, "AttributeName": "address_citystring", 'comment': '', "title": "City", "data_content": this.accountDetails.Address.CityString ? this.accountDetails.Address.CityString : '', "control": 'input' },
      // { "title": "City ", "data_content": "Appleton", "control": 'autocomplete',"data":[],"datapopup":this.popupdata },
      { 'fkey': ['Address', 'CountryCode'], 'key': 'countrycode', 'datatype': 'string', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': true, "AttributeName": "address_countrycode", 'comment': '', "title": "Country code", "data_content": (this.accountDetails.Address && this.accountDetails.Address.CountryCode) ? this.accountDetails.Address.CountryCode : '', "control": 'input' },
      { 'fkey': ['Address', 'Address1'], 'key': 'address', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'attrBtn': true, "AttributeName": "addresss_address1", 'comment': '', "title": "Address", "data_content": this.accountDetails.Address && this.accountDetails.Address.Address1 ? this.accountDetails.Address.Address1 : '', "control": 'input' },
      { 'fkey': ['Address', 'CountryString'], 'key': 'countrystring', 'datatype': 'string','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'attrBtn': true, 'isAdvanceLookUp': false, "AttributeName": "address_countrystring", 'comment': '', "title": "Country", "data_content": this.accountDetails.Address.CountryString ? this.accountDetails.Address.CountryString : '', "control": 'input' },
      // { "title": "Country", "data_content": " United Kingdom", "control": 'select' },
    ];

    // this.accountCount(this.WithoutInputFields_Account_details);
    /*******************editable Account details  with comments data fileds ends here****************** */
    /*******************editable Business with comments data fileds starts here****************** */
    this.WithoutInputFields_Business = [
      { 'fkey': ['Contact'], 'key': 'phonenumber', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "contact_contactno", 'comment': '', "title": "Direct phone", "data_content": (this.accountDetails.Contact && this.accountDetails.Contact.ContactNo) ? this.accountDetails.Contact.ContactNo : '', "control": 'input' },
      { 'fkey': ['WebsiteUrl'], 'key': 'website', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "websiteurl", 'comment': '', "title": "Website URL", "data_content": this.accountDetails.WebsiteUrl ? this.accountDetails.WebsiteUrl : '', "control": 'input' },
      { 'fkey': ['Email'], 'key': 'email', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "email", 'comment': '', "title": "Email address", "data_content": this.accountDetails.Email ? this.accountDetails.Email : '', "control": 'input' },
      { 'fkey': ['BusinessDescription'], 'key': 'businessdescription', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "businessdescription", 'comment': '', "title": "Business description", "data_content": this.accountDetails.BusinessDescription ? this.accountDetails.BusinessDescription : '', "control": 'textarea' },
      { 'fkey': ['EmployeeCount'], 'key': 'employees', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "employeecount", 'comment': '', "title": "Employees ", "data_content": this.accountDetails.EmployeeCount ? this.accountDetails.EmployeeCount : '', "control": 'input' },
      { 'fkey': ['SicDescription'], 'key': 'sicdescription', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "sicdescription", 'comment': '', "title": "SIC description", "data_content": this.accountDetails.SicDescription ? this.accountDetails.SicDescription : '', "control": 'textarea' },
    ];

    /*******************editable Business  with comments data fileds ends here****************** */
    /*******************editable Additional details with comments data fileds starts here****************** */
    this.WithoutInputFields_AdditionalDetails = [
      { 'fkey': ['StockIndexMemberShip'], 'key': 'stockindexmembership', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "stockindexmembership", 'comment': '', "title": "Stock index membership","tooltip":"This shows the stock market membership for the given stock", "data_content": this.accountDetails.StockIndexMemberShip ? this.accountDetails.StockIndexMemberShip : '', "control": 'input' },
      { 'fkey': ['TickerSymbol'], 'key': 'tickersymbol', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "tickersymbol", 'comment': '', "title": "Ticker symbol","tooltip":"This uniquely identifies publicly traded shares of a particular stock on a particular stock market" ,"data_content": this.accountDetails.TickerSymbol ? this.accountDetails.TickerSymbol : '', "control": 'input' },
      { 'fkey': ['Currency'], 'key': 'currency', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': true, "type": 'string', "AttributeName": "currency_value", 'comment': '', "title": "Currency", "data_content": (this.accountDetails.Currency && this.accountDetails.Currency.Value) ? this.accountDetails.Currency.Value : '', "control": 'autocomplete', "data": [] },
      { 'fkey': ['FortuneRanking'], 'key': 'fortune', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "fortuneranking", 'comment': '', "title": "Fortune 1000 ranking", "data_content": this.accountDetails.FortuneRanking ? this.accountDetails.FortuneRanking : '', "control": 'input' },
      { 'fkey': ['GrossProfit'], 'key': 'profits', 'datatype': 'float','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "grossprofit", 'comment': '', "title": "Gross profit", "data_content": this.accountDetails.GrossProfit ? this.accountDetails.GrossProfit : '', "control": 'input' },
      { 'fkey': ['Revenue'], 'key': 'revenue', 'datatype': 'float', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "revenue", 'comment': '', "title": "Revenue", "data_content": this.accountDetails.Revenue ? this.accountDetails.Revenue : '', "control": 'input' },
      { 'fkey': ['OperatingMargin'], 'key': 'operatingmargins', 'datatype': 'float', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "operatingmargin", 'comment': '', "title": "Operating margin (%)", "data_content": this.accountDetails.OperatingMargin ? this.accountDetails.OperatingMargin : '', "control": 'input' },
      { 'fkey': ['MarketValue'], 'key': 'marketvalue', 'datatype': 'float','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "marketvalue", 'comment': '', "title": "Marketing value", "data_content": this.accountDetails.MarketValue ? this.accountDetails.MarketValue : '', "control": 'input' },
      { 'fkey': ['ReturnOnEquity'], 'key': 'returnonequity', 'datatype': 'float','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "returnonequity", 'comment': '', "title": "Return on equity", "data_content": this.accountDetails.ReturnOnEquity ? this.accountDetails.ReturnOnEquity : '', "control": 'input' },
      { 'fkey': ['EntityType'], 'key': 'entitytype', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isAdvanceLookUp': false, 'isRequired': false, "type": 'number', "AttributeName": "entitytype_value", 'comment': '', "title": "Entity type", "tooltip":"The types Subsidiary and Branch must always have a Parent account.","data_content": (this.accountDetails.EntityType && this.accountDetails.EntityType.Id) ? this.accountDetails.EntityType.Id : '', "control": 'select', "data": [] },
      { 'fkey': ['CreditScore'], 'key': 'creditscore', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "marketrisk", 'comment': '', "title": "Marketing risk score","tooltip":"D&B's Marketing risk scores predict the likelihood of a firm paying in a severely delinquent manner (90+ days past terms) over the next 12 months", "data_content": this.accountDetails.CreditScore ? this.accountDetails.CreditScore : '', "control": 'input' }, //chethana added as per Nov 26th vd
      { 'fkey': ['OwnershipType'], 'key': 'ownershiptype', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isAdvanceLookUp': false, 'isRequired': true, "type": 'number', "AttributeName": "ownershiptype_value", 'comment': '', "title": "Ownership type","tooltip":"The Ownership Type indicates the type of legal or structural entity of the CRM account." , "data_content": (this.accountDetails.OwnershipType && this.accountDetails.OwnershipType.Id) ? this.accountDetails.OwnershipType.Id : '', "control": 'select', "data": [] },

    ];
    /*******************editable Additional details with comments data fileds ends here****************** */
    /*******************editable secondary details with comments data fileds starts here****************** */
    this.WithoutInputFields_SecondaryDetails = [
      { 'fkey': ['GrowthCategory'], 'key': 'growthcategory', 'charLeft': 2000, 'maxLimit': 2000, 'datatype': 'number', 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "growthcategory_value", 'comment': '', "title": "Growth category (in %)", "data_content": (this.accountDetails.GrowthCategory && this.accountDetails.GrowthCategory.Id) ? this.accountDetails.GrowthCategory.Id : '', "control": 'select', "category": 'Growth category', "data": [],"tooltip":'The Growth Category represents the anticipated revenue growth rate over the next 12 months.' },
      { 'fkey': ['CoverageLevel'], 'key': 'coveragelevel', 'charLeft': 2000, 'maxLimit': 2000, 'datatype': 'number', 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'string', "AttributeName": "coveragelevel_value", 'comment': '', "title": " Coverage level (in %)", "data_content": (this.accountDetails.CoverageLevel && this.accountDetails.CoverageLevel.Id) ? this.accountDetails.CoverageLevel.Id : '', "control": 'select', "category": 'Growth category', "data": [],"tooltip":'The Coverage Level represents the allocation of time to the account by the Account owner.' },
      { 'fkey': ['RevenueCategory'], 'key': 'revenuecategory', 'charLeft': 2000, 'maxLimit': 2000, 'datatype': 'number', 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "type": 'number', "AttributeName": "revenuecategory_value", 'comment': '', "title": "Revenue category ($Mn)", "data_content": (this.accountDetails.RevenueCategory && this.accountDetails.RevenueCategory.Id) ? this.accountDetails.RevenueCategory.Id : '', "control": 'select', "category": 'Growth category', "data": [],"tooltip":'The Revenue Category represents the potential annualized run rate for revenue in 18-24 months.It gives an indication of what revenue band account should be in and therefore how we should serve them.' },
      { 'fkey': ['SBU'], 'key': 'sbu', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': true, "AttributeName": "sbu_name", 'comment': '', "title": "SBU", "data_content": (this.accountDetails.SBU && this.accountDetails.SBU.Name) ? this.accountDetails.SBU.Name : '', "control": 'autocomplete', "category": 'PSG', "data": [] },
      { 'fkey': ['Vertical'], 'key': 'vertical', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': true, "AttributeName": "vertical_name", 'comment': '', "title": "Vertical", "data_content": (this.accountDetails.Vertical && this.accountDetails.Vertical.Name) ? this.accountDetails.Vertical.Name : '', "control": 'autocomplete', "category": 'Vertical', "data": [] },
      { 'fkey': ['SubVertical'], 'key': 'subvertical', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': true, "AttributeName": "subvertical_name", 'comment': '', "title": "Sub-vertical", "data_content": (this.accountDetails.SubVertical && this.accountDetails.SubVertical.Name) ? this.accountDetails.SubVertical.Name : '', "control": 'autocomplete', "category": 'Sub-vertical', "data": [] },
      { 'fkey': ['Cluster'], 'key': 'cluster', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "cluster", 'comment': '', "title": "Cluster", "data_content": (this.accountDetails.Cluster && this.accountDetails.Cluster.Value && this.accountDetails.Cluster.Value != 'NA') ? this.accountDetails.Cluster.Value : '', "control": 'autocomplete', "category": 'North Amercia', "data": [] }, //chethana added as per Nov 26th vd
      { 'fkey': ['Geo'], 'key': 'geography', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "geo_name", 'comment': '', "title": "Geo", "data_content": (this.accountDetails.Geo && this.accountDetails.Geo.Name && this.accountDetails.Geo.Name != 'NA') ? this.accountDetails.Geo.Name : '', "control": 'autocomplete', "category": 'North Amercia', "data": [] },
      { 'fkey': ['Address', 'Region'], 'key': 'region', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "address_region_name", 'comment': '', "title": "Region", "data_content": (this.accountDetails.Address.Region && this.accountDetails.Address.Region.Name && this.accountDetails.Address.Region.Name != "NA") ? this.accountDetails.Address.Region.Name : (this.accountDetails.Region && this.accountDetails.Region.Name && this.accountDetails.Region.Name != 'NA') ? this.accountDetails.Region.Name : '', "control": 'autocomplete', "category": 'Region', "data": [] },
      { 'fkey': ['Address', 'Country'], 'key': 'country', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "address_country_name", 'comment': '', "title": "Country", "data_content": (this.accountDetails.Address.Country && this.accountDetails.Address.Country.Name && this.accountDetails.Address.Country.Name != 'NA') ? this.accountDetails.Address.Country.Name : '', "control": 'autocomplete', "data": [] },
      { 'fkey': ['Address', 'State'], 'key': 'state', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "address_state_name", 'comment': '', "title": "Country sub-division", "data_content": (this.accountDetails.Address.State && this.accountDetails.Address.State.Name && this.accountDetails.Address.State.Name != 'NA') ? this.accountDetails.Address.State.Name : '', "control": 'autocomplete', "category": 'California', "data": [] },
      { 'fkey': ['Address', 'City'], 'key': 'city', 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "address_city_name", 'comment': '', "title": "City region", "data_content": (this.accountDetails.Address.City && this.accountDetails.Address.City.Name && this.accountDetails.Address.City.Name != 'NA') ? this.accountDetails.Address.City.Name : '', "control": 'autocomplete', "category": 'Los Angeles', "data": [] },
      // { 'key': 'finanacialyear', 'isCommented': false, 'AttributeName': 'financialyear', 'comment': '', "title": "Financial year", "data_content": (this.accountDetails.FinYear && this.accountDetails.FinYear.Name) ? this.accountDetails.FinYear.Name : '', "control": 'autocomplete', "data": [] },
      { 'fkey': ['PursuedopportunityRemarks'], 'key': 'remarks', 'charLeft': 2000, 'maxLimit': 2000,'datatype': 'string', 'isCommented': false, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "pursuedopportunityscoperemarks", 'comment': '', "title": "Pursued opportunity scope/tenure/other Remarks", "data_content": this.accountDetails.PursuedopportunityRemarks ? this.accountDetails.PursuedopportunityRemarks : '', "control": 'textarea' },//chethana added as per Nov 26th vd
      { 'fkey': ['IsGovAccount'], 'key': 'governementaccount', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'comment': '', "AttributeName": "isgovaccount", "title": "Government account", "data_content": this.accountDetails.IsGovAccount ? this.accountDetails.IsGovAccount : false, "control": 'toggle' },
      { 'fkey': ['IsNewAgeBusiness'], 'key': 'newagebusiness', 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, 'comment': '', "AttributeName": "isnewagebusiness", "title": "New age business", "data_content": this.accountDetails.IsNewAgeBusiness ? this.accountDetails.IsNewAgeBusiness : false, "control": 'toggle' },

    ];
    /*******************editable secondary details with comments data fileds ends here****************** */
    /*******************editable Account owner and other details with comments data fileds starts here****************** */
    this.WithoutInputFields_AccountOwner = [
      { 'fkey': 'Owner', 'key': 'owner', 'datatype': 'number', 'isCommented': false,'charLeft': 2000, 'maxLimit': 2000, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "owner_fullname", 'comment': '', "title": "Owner", "control": 'input', "data": [], "data_content": (this.accountDetails.Owner && this.accountDetails.Owner.FullName) ? this.accountDetails.Owner.FullName : '' },
      { 'fkey': 'isSwapAccount', 'key': 'isswapaccount', 'datatype': 'number', 'isCommented': false,'charLeft': 2000, 'maxLimit': 2000, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "isswapaccount", 'comment': '', "title": "Swap account", "control": 'toggle', "data_content": this.accountDetails.isSwapAccount ? this.accountDetails.isSwapAccount : '' },
      { 'fkey': 'SwapAccount', 'key': 'swapaccount', 'datatype': 'number', 'isCommented': false,'charLeft': 2000, 'maxLimit': 2000, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "swapaccount_name", 'comment': '', "title": "Select swap account", "control": 'input', "data_content": (this.accountDetails.SwapAccount && this.accountDetails.SwapAccount.Name) ? this.getdecodevalue(this.accountDetails.SwapAccount.Name) : '' },
      { 'fkey': 'AlternateAccountOwner', 'key': 'alternateaccountowner', 'datatype': 'number', 'isCommented': false,'charLeft': 2000, 'maxLimit': 2000, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "alternateowner_fullname", 'comment': '', "title": " Alternative Account Owner", "control": 'input', "data": [], "data_content": (this.accountDetails.AlternateAccountOwner && this.accountDetails.AlternateAccountOwner.FullName) ? this.accountDetails.AlternateAccountOwner.FullName : '' },
      { 'fkey': 'IsAlternateSwapAccount', 'key': 'isalternateswapaccount', 'datatype': 'number', 'isCommented': false,'charLeft': 2000, 'maxLimit': 2000, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "isalternateswapaccount", 'comment': '', "title": "Swap alternate account", "control": 'toggle', "data_content": this.accountDetails.IsAlternateSwapAccount ? this.accountDetails.IsAlternateSwapAccount : '' },
      { 'fkey': 'AlternateSwapAccount', 'key': 'alternateswapaccount', 'datatype': 'number', 'isCommented': false, 'charLeft': 2000, 'maxLimit': 2000,'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "alternateswapaccount_name", 'comment': '', "title": "Select swap account", "control": 'input', "data_content": (this.accountDetails.AlternateSwapAccount && this.accountDetails.AlternateSwapAccount.Name) ? this.getdecodevalue(this.accountDetails.AlternateSwapAccount.Name) : '' },
    ];

    /*******************editable Account owner and other details with comments data fileds ends here****************** */
    /*******************editable assignment reference details with comments data fileds starts here****************** */

    if (this.route_from == 'assign_ref') {
      this.accountMapGuid = this.accountDetails.SysGuid ? this.accountDetails.MapGuid : ''
      this.WithoutInputFields_AssignmentDetails = [
        { 'key': 'owner', 'isCommented': false, 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "owner_fullname", 'comment': '', "title": "Owner", "data_content": (this.accountDetails.Owner && this.accountDetails.Owner.FullName) ? this.accountDetails.Owner.FullName : '', "control": 'autocomplete', "data": [] },
        { 'key': 'sbu', 'isCommented': false, 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isRequired': true, 'isAdvanceLookUp': true, "AttributeName": "sbu_name", 'comment': '', "title": "SBU", "data_content": (this.accountDetails.SBU && this.accountDetails.SBU.Name) ? this.accountDetails.SBU.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'vertical', 'isCommented': false, 'datatype': 'number', 'isRequired': true, 'isAdvanceLookUp': true, "AttributeName": "vertical_name", 'comment': '', "title": "Vertical", "data_content": (this.accountDetails.Vertical && this.accountDetails.Vertical.Name) ? this.accountDetails.Vertical.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'subvertical', 'isCommented': false, 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isRequired': false, 'isAdvanceLookUp': true, "AttributeName": "subvertical_name", 'comment': '', "title": "Sub-vertical", "data_content": (this.accountDetails.SubVertical && this.accountDetails.SubVertical.Name) ? this.accountDetails.SubVertical.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'cbu', 'isCommented': false, 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isRequired': true, 'isAdvanceLookUp': false, 'comment': '', "AttributeName": "trendsnanalysis_noofcbu", "title": "CBU", "data_content": '', "control": 'select', "data": [] },
        { 'key': 'geography', 'isCommented': false, 'datatype': 'number', 'charLeft': 2000, 'maxLimit': 2000,'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "geo_name", 'comment': '', "title": "Geo", "data_content": (this.accountDetails.Geo && this.accountDetails.Geo.Name) ? this.accountDetails.Geo.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'region', 'isCommented': false, 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isRequired': true, 'isAdvanceLookUp': false, "AttributeName": "address_region_name", 'comment': '', "title": "Region", "data_content": (this.accountDetails.Region && this.accountDetails.Region.Name) ? this.accountDetails.Region.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'country', 'isCommented': false, 'datatype': 'number','charLeft': 2000, 'maxLimit': 2000, 'isRequired': false, 'isAdvanceLookUp': false, 'AttributeName': 'address_country_name', 'comment': '', "title": "Country", "data_content": (this.accountDetails.Address.Country && this.accountDetails.Address.Country.Name) ? this.accountDetails.Address.Country.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'state', 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "address_state_name", 'comment': '', "title": "State", "data_content": (this.accountDetails.Address.State && this.accountDetails.Address.State.Name) ? this.accountDetails.Address.State.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'city', 'isCommented': false, 'isRequired': false, 'isAdvanceLookUp': false, "AttributeName": "address_city_name", 'comment': '', "title": "City", "data_content": (this.accountDetails.Address.City && this.accountDetails.Address.City.Name) ? this.accountDetails.Address.City.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'parentaccount', 'isCommented': false, "AttributeName": 'parentaccount_name', 'comment': '', "title": "Parent account", "data_content": (this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.Name) ? this.accountDetails.ParentAccount.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'ultimateparent', 'isCommented': false, "AttributeName": "ultimateparentaccount_name", 'comment': '', "title": "Ultimate parent account", "data_content": (this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.Name) ? this.accountDetails.UltimateParentAccount.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'bu', 'comment': '', "title": "BU", "data_content": "BU name", "control": 'autocomplete', "data": [] },
      ];

      this.multiSelectFilteredData(this.accountDetails.CustomerBusinessUnit, 'cbu', this.WithoutInputFields_AssignmentDetails, 'select');
      if (this.accountDetails.MapGuid) {
        this.accountListService.FetchReferenceAccountDetails(this.accountDetails.MapGuid).subscribe(res => {
          if (!res["IsError"] && res["ResponseObject"]) {
            let accountDetails = res["ResponseObject"];
            if (accountDetails) {
              let data = accountDetails;
              if (data.SBU.Id !== this.accountCreationObj['prospect'].sbu) {
                this.sbuChanged = true;
              }
              else {
                this.sbuChanged = false;
              }
              if ((data.SBU.Id !== this.accountCreationObj['prospect'].sbu || data.SubVertical.Id != this.accountCreationObj['prospect'].subvertical ||
                data.Vertical.Id != this.accountCreationObj['prospect'].vertical || data.Geo.SysGuid != this.accountCreationObj['prospect'].geography ||
                data.Region.SysGuid != this.accountCreationObj['prospect'].region || data.Address.Country.SysGuid != this.accountCreationObj['prospect'].country)) {
                this.ischangesprimaryvalue = true;
              } else {
                this.ischangesprimaryvalue = false;
              }
            }
          }
        })
      }
    }

    // this.getHuntingRatio(this.accountDetails.SysGuid);
    this.huntingRatio = (this.accountDetails['Owner'] && this.accountDetails['Owner']['HuntingRatio']) ? this.accountDetails['Owner']['HuntingRatio'] : 0;
    this.ExistingRatio = (this.accountDetails['Owner'] && this.accountDetails['Owner']['ExistingRatio']) ? this.accountDetails['Owner']['ExistingRatio'] : 0;
    this.altHuntingratio = (this.accountDetails['AlternateAccountOwner'] && this.accountDetails['AlternateAccountOwner']['HuntingRatio']) ? this.accountDetails['AlternateAccountOwner']['HuntingRatio'] : 0;
    if (this.accservive.validateKeyInObj(this.accountDetails, ['Owner', 'SysGuid'])) {
      if (this.accservive.validateKeyInObj(this.accountDetails, ['Address', 'Country', 'SysGuid'])) {
        let cc = '';
        cc = this.accountDetails.Address.Country.SysGuid;
        this.getAllSwapAccount(this.accountDetails.Owner.SysGuid, cc, true);
      }
      else {
        this.getAllSwapAccount(this.accountDetails.Owner.SysGuid, '', true);
      }
    }
    // get clustuers by SBU, and make required, in case having clusters for particular SBU. 

    if (isNew = 'new') {
      // this.getCurrency(this.WithoutInputFields_AdditionalDetails, "currency");  // form array name and key of the currency attribute
      this.getEntity(this.WithoutInputFields_AdditionalDetails, "entitytype");
      this.getOwnersTypes(this.WithoutInputFields_AdditionalDetails, 'ownershiptype');
      this.getgrowthcategory(this.WithoutInputFields_SecondaryDetails, 'growthcategory');
      this.getcoveragelevel(this.WithoutInputFields_SecondaryDetails, 'coveragelevel');
      this.GetRevenueCategory(this.WithoutInputFields_SecondaryDetails, 'revenuecategory');
    }
    this.buildForm();
  }
  /*******************editable assignment reference  details with comments data fileds ends here****************** */

  /* Method will called based on button click ** KUANL ***/
  // allButtons: any= {'IsAccept':"Accept",'IsCancel':"Cancel",'IsReject':"Reject",'IsRework':"Rework",'IsSubmit':"Submit"};
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  setSecondryFlag(e, key) {
    console.log(e, key);

    this.accountCreationObj['prospect'][key] = e.value;
    console.log(this.accountCreationObj['prospect'][key]);
  }

  selectedLookupData(controlName, initalLookupData, ind) {
    // switch (controlName) {
    //   case 'AccountSearch': {
    return (initalLookupData.length > 0) ? initalLookupData : []
    // }
    // }

  }
  getCommonData(controlName) {

    switch (controlName) {
      case 'sbu':
        return { SbuId: '' }
      case 'vertical':
        return { SbuId: this.accountCreationObj['prospect']['sbu'] || '' }
      case 'subvertical':
        return { verticalId: this.accountCreationObj['prospect']['vertical'] || '' }

    }
    // return {
    //   Guid: parentId || '',
    //   isProspect: '',
    // }
  }
  // $event,AdditionalDetails,i, AdditionalDetails.controls[i].value

  getParentInSbuHirachy(controlName) {
    let arrayInOrder = ['sbu', 'vertical', 'subvertical'];
    let ind = arrayInOrder.indexOf(controlName);
    if (ind > 0) return this.accountCreationObj['prospect'][arrayInOrder[ind - 1]] || '';
    return '';
  }
  clearChildAdvanceSearch(dataArray, formControlName, controlName) {
    const verticalIndex = dataArray.findIndex(da => da.key == 'vertical');
    const subverticalIndex = dataArray.findIndex(da => da.key == 'subvertical');

    switch (controlName) {
      case 'sbu':
        this.accountCreationObj['prospect']['vertical'] = '';
        this.accountCreationObj['prospect']['subvertical'] = '';
        formControlName.controls[verticalIndex].setValue('');
        formControlName.controls[subverticalIndex].setValue('');
        return;
      case 'vertical':

        this.accountCreationObj['prospect']['subvertical'] = '';
        formControlName.controls[subverticalIndex].setValue('');
        return;
      case 'subvertical':
        return;
    }
  }
  openadvancetabs(formArryName, dataArray, formControlName, formName, ind): void {
    console.log(formArryName);
    console.log(formControlName, formControlName.controls[ind].value, ind);

    // WithoutInputFields_AssignmentDetails[i].key,WithoutInputFields_AssignmentDetails[i].data,AssignmentDetails, i
    let controlName = dataArray[ind].key;
    let parentId = this.getParentInSbuHirachy(controlName);
    let initalLookupData = dataArray[ind].data;
    console.log(controlName, initalLookupData, formControlName.controls[ind].value, parentId);
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountNameListAdvnHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvnNames[controlName]['isAccount'];
    this.lookupdata.inputValue = formControlName.controls[ind].value;
    this.lookupdata.selectedRecord = this.selectedLookupData(controlName, initalLookupData, ind);
    this.accountListService.getLookUpFilterData({ searchKey: formControlName.controls[ind].value, Guid: parentId, data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
      console.log(this.lookupdata.tabledata);

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose:true,
      width: this.accservive.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x);
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination,

      }

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(controlName), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
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
      // debugger
      if (result) {
        console.log(result)
        if (result.IsProspectAccount) {
          this.accservive.sendProspectAccount = false;
          this.router.navigateByUrl('/activities/prospectAccount');
        } else {
          this.clearChildAdvanceSearch(dataArray, formControlName, controlName);
          // dataArray, formControlName, ind
          this.AppendParticularInputFun(result.selectedData, result.selectedIndex, result.controlName, dataArray, formControlName, formName, ind)
        }

      }
    });
  }
  AppendParticularInputFun(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) {
    // debugger
    console.log(selectedData);

    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind)
        });
      }
    }
  }
  IdentifyAppendFunc = {
    // 'participants' : (data)=>{this.appendconversationtag(data)},
    // 'linkedLeads' : (data)=>{this.appendlead(data)},
    // 'linkedOpportunityOrder' : (data)=>{this.appendopportunity(data)},
    'AccountSearch': (selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) => { this.appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) },
    'sbu': (selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) => { this.appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) },
    'vertical': (selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) => { this.appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) },
    'subvertical': (selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) => { this.appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) },
    'currency': (selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) => { this.appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) }
  }

  appendConversation(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind) {
    // let val = eval(formControlName);
    console.log(selectedData, selectedIndex, controlName, dataArray, formControlName, formName, ind);
    if (['sbu', 'vertical', 'subvertical'].indexOf(controlName) != -1) this.sub_and_vertical = selectedData;
    this.selectedValue(selectedData[0], ind, formName, dataArray, selectedIndex);
    // this.selectedValue(selectedData, ind, 'AssignmentDetails', WithoutInputFields_AssignmentDetails, ind);
    // debugger
    // this.campaignService.ValidateAccount(item.SysGuid, item.isProspect).subscribe(res => {
    //   //   if (res.IsError) {
    //   //     this.accountValidation = true;
    //   //     this.accountSysgiudConversation = undefined;
    //   //     this.campaignDetailsForm.patchValue({
    //   //       CompanyName: ""
    //   //     });
    //   //     // this.PopUp.throwError(res.Message)
    //   //   } else {
    //   //     this.accountValidation = false;
    //   //     this.accountSysgiudConversation = item.SysGuid;
    //   //     let json = { SysGuid: item.SysGuid, Name: item.Name, "LinkActionType": 1, isProspect: item.isProspect, Id: item.SysGuid }
    //   //     var object = { "SysGuid": item.SysGuid, "isExist": false, "LinkActionType": 1, isProspect: item.isProspect }
    //   //     this.selectedAccc.push(json);
    //   //     this.acclist.push(object)
    //   //     this.updateHideIf = false;
    //   //     this.isAccountMessage = false;
    //   //     console.log("account dlink", this.selectedAccc)
    //   //     this.campaignDetailsForm.get('SBU').enable();
    //   //     this.accountCompanyName = item.Name;
    //   //     this.campaignDetailsForm.patchValue({
    //   //       CompanyName: item.Name
    //   //     });
    //   //     if(item.isProspect === false) {
    //   //       this.industryAutoPopulate(item.SysGuid);
    //   //     }
    //   //     let SbuReqParam = {
    //   //       Guid: item.SysGuid,
    //   //       isProspect: item.isProspect
    //   //     }
    //   //     this.myOpenLeadService.GetSbuAccountdata(SbuReqParam).subscribe(res => {
    //   //       if (!res.IsError) {
    //   //         if (res.ResponseObject.length > 0 && res.ResponseObject.length < 2) {
    //   //           this.campaignDetailsForm.patchValue({
    //   //             SBU: res.ResponseObject[0].Name
    //   //           })

    //   //           this.getSBUId = res.ResponseObject[0].Id
    //   //           this.campaignDetailsForm.get('SBU').enable();
    //   //           this.campaignDetailsForm.get('SBU').clearValidators();
    //   //           this.campaignDetailsForm.get('SBU').updateValueAndValidity();

    //   //           let VerticalReqParam = {
    //   //             SearchText: "",
    //   //             Guid: res.ResponseObject[0].Id
    //   //           }
    //   //           this.contactLeadService.getsearchVerticalBySbu(VerticalReqParam).subscribe(vertical => {
    //   //             if (!vertical.IsError) {
    //   //               if (res.ResponseObject.length > 0) {
    //   //                 this.campaignDetailsForm.patchValue({
    //   //                   Vertical: res.ResponseObject[0].Name
    //   //                 })
    //   //                 this.getVerticleId = res.ResponseObject[0].Id
    //   //                 this.campaignDetailsForm.get('Vertical').enable();
    //   //                 this.campaignDetailsForm.get('Vertical').clearValidators();
    //   //                 this.campaignDetailsForm.get('Vertical').updateValueAndValidity();
    //   //               }
    //   //             } else {
    //   //               this.PopUp.throwError(res.Message)
    //   //             }
    //   //           })
    //   //         } else {
    //   //           return
    //   //         }
    //   //         console.log("resresres", res)
    //   //       } else {
    //   //         this.PopUp.throwError(res.Message)
    //   //       }
    //   //     })
    //   //   }
    // })
    // this.ConversationNameSwitch = false;
  }
  swapValidation(act) {
    let isInValid = true;
    if ((act != 'Reject' && act != 'Cancel' && this.route_from != 'assign_ref' &&
      (this.AdditionalDetails.invalid || this.Business.invalid || this.SecondaryDetails.invalid || this.Account_details.invalid ||
        (this.ownerAccountDetails['isswapaccount'] && !(this.accservive.searchFieldValidator(this.ownerAccountDetails['swapaccount']))
          || (this.ownerAccountDetails['isalternateswapaccount'] && (!(this.accservive.searchFieldValidator(this.ownerAccountDetails['alternateaccountowner'])) ||
            !this.accservive.searchFieldValidator(this.ownerAccountDetails['alternateswapaccount']))))
      )
      || (act != 'Reject' && this.route_from != 'assign_ref' && act != 'Cancel' && (!this.accountCreationObj['prospect']['owner'] ||
        this.accountCreationObj['prospect']['owner'] == '')))) {
      isInValid = true;
    }
    else {
      isInValid = false;
    }
    return isInValid;
  }
  performAction(act) {
    this.accountDetailsPanel = false;
    this.accountOwnerPanel = false;
    console.log(this.AdditionalDetails.status, act);
    console.log(this.SecondaryDetails.status, this.AssignmentDetails.invalid);
    console.log((this.ownerAccountDetails['owner'].trim()).length);

    console.log(this.WithoutInputFields_SecondaryDetails);
    this.OwnerDetailsInvalid = this.swapValidation(act);
    console.log(this.OwnerDetailsInvalid);
    // this.EditFlag("updating..");
    // this.SecondaryDetails.value.map(ar => { if (typeof ar == 'string') ar.trim(); });
    // this.AdditionalDetails.value.map(ar => { if (typeof ar == 'string') ar.trim(); });
    // this.Business.value.map(ar => { if (typeof ar == 'string') ar.trim(); });
    // this.Account_details.value.map(ar => { if (typeof ar == 'string') ar.trim(); });

    if (this.route_from == 'assign_ref') {
      let cbuIndex = this.WithoutInputFields_AssignmentDetails.findIndex(da => da.key == 'cbu');
      if (this.cbuArray.length > 0) {
        this.AssignmentDetails.controls[cbuIndex].setValue(this.cbuArray[0].id);
      }
      else if (this.totalCBUs.length > 0 && this.cbuArray.length <= 0) {
        this.AssignmentDetails.controls[cbuIndex].setValue(this.oldCBUArray[0].id);
      }
      else {
        console.log("empty value assigned");
        this.AssignmentDetails.controls[cbuIndex].setValue('');
      }
      this.AssignmentDetails.value.map(ar => { if (typeof ar == 'string') ar.trim(); });
    }
    console.log(this.AssignmentDetails.invalid);

 console.log(this.AdditionalDetails.invalid, this.AssignmentDetails.invalid, this.Business.invalid, this.SecondaryDetails.invalid, this.Account_details.invalid, this.OwnerDetailsInvalid);
    if ((act != 'Reject' && act != 'Cancel' && this.route_from != 'assign_ref' &&(this.AdditionalDetails.invalid || this.Business.invalid || this.SecondaryDetails.invalid || this.Account_details.invalid || this.OwnerDetailsInvalid || (this.ownerAccountDetails['isswapaccount'] && !(this.accservive.searchFieldValidator(this.ownerAccountDetails['swapaccount']))))) || (act != 'Reject' && this.route_from != 'assign_ref' && act != 'Cancel' && (!this.accountCreationObj['prospect']['owner'] || this.accountCreationObj['prospect']['owner'] == ''))) {
      // if (this.swapValidation(act)) {
      this.submitted = true;
      if (this.AdditionalDetails.invalid || this.Business.invalid || this.Account_details.invalid) {
        this.accountDetailsPanel = true;
        this.accountOwnerPanel = false;
      }
      else if (this.SecondaryDetails.invalid || !this.accountCreationObj['prospect']['owner'] || this.accountCreationObj['prospect']['owner'] == '') {
        this.accountDetailsPanel = false;
        this.accountOwnerPanel = true;
      }
      else {
        // this.accountDetailsPanel = true;
        // this.accountOwnerPanel = false;
      }

      console.log("fghjkjkhgfds ");
      let invalidElements = this.el.nativeElement.querySelectorAll('select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        // this.scrollTo(invalidElements[0]);
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    else if (act != 'Reject' && act != 'Cancel' && this.AssignmentDetails.invalid && this.route_from == 'assign_ref') {
      this.submitted = true;
      console.log("asdfdfghfg");
      let invalidElements = this.el.nativeElement.querySelectorAll('select.ng-invalid, input.ng-invalid');
      if (invalidElements.length > 0) {
        // this.scrollTo(invalidElements[0]);
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    } else {
      // this.WithoutInputFields_SecondaryDetails.map((element, index,arr) => {
      //   console.log("came to see junk")
      //   let fieldValue = this.SecondaryDetails.controls[index].value;
      //   this.checkForJunkValue(fieldValue,element.title);
      // });
      console.log("asdf ");
      this.assingFormData();
      this.submitted = false;
      switch (act) {
        case 'Approve':
        case 'Activate':
          //console.log("this is approved route case", this.route_from);
          if ((this.loggedin_user == 'sbu' || this.loggedin_user == 'cso') && this.huntingRatio >= 8 && !this.ownerAccountDetails['isswapaccount'] && !this.accountCreationObj['prospect'].isalternateswapaccount && this.route_from == "acc_req") {
            console.log(this.huntingRatio,this.accountCreationObj['prospect'].isswapaccount,this.ownerAccountDetails['isswapaccount'],this.accountCreationObj['prospect'].isalternateswapaccount);
            this.OpenApproveSwap();
          }
          else{
            console.log(this.huntingRatio,this.accountCreationObj['prospect'].isswapaccount,this.ownerAccountDetails['isswapaccount'],this.accountCreationObj['prospect'].isalternateswapaccount);
            this.OpenApproveComments1(act);
          }
          return;
        case 'Cancel':
          this.goBack();
          this.accservive.toastcancel();
          return;
        case 'Reject':
          this.OpenRejectComments1();
          return;
        case 'Rework':
          this.OpenReworkComments1();
          return;
        case 'Submit':
          // if (this.loggedin_user == 'account_requestor')
          if ((this.loggedin_user == 'sbu' || this.loggedin_user == 'cso') && this.huntingRatio >= 8 && !this.accountCreationObj['prospect'].isswapaccount && !this.accountCreationObj['prospect'].isalternateswapaccount && this.route_from == "acc_req") {
            this.OpenApproveSwap();
          } else {
            this.OpenSubmitComments1();
          }
          return;
        case 'Save':
          this.saveAccountData();
          return;
      }
    }
  }
  PerformActionDnB(objectdata) {
    switch (objectdata.action) {
      case 'dbAutoSearch':
        // debugger
        this.getcountrycode(objectdata.objectRowData.searchKey)
        return;
      case 'dbSearch':
        //  debugger
        this.getaccountInDNB(objectdata.objectRowData.dbSerachData)
        return;
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
              'OdatanextLink': "",
              'RequestedPageNumber': 1
            }
            this.getwiproaccounts(this.searchpayload)
          } else {
            this.Accountlookupdata.tabledata = []
            this.Accountlookupdata.headerdata = [
              { name: 'AccountName', title: 'Name' },
              { name: 'ParentEquity', title: 'Parent Entity' },
              { name: 'Industry', title: 'Industry' },
              { name: 'Region', title: 'Region' },]
          }
          return;
        }
    }
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
        // console.log("dnbaccounts response ", res.ResponseObject)

        this.Accountlookupdata.tabledata = this.getFilterdnbData(res.ResponseObject);

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
  getFilterdnbData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          AccountName: this.getdecodevalue(data.Name) || '',
          Number: data.Duns || '',
          Industry: data.Industry || '',
          ParentEquity: data.ParentEquity || '',
          Region: data.Region || '',
          Id: data.Duns || '',
        }
      })
    }
  }
  // k is the key, which is declare in form array and used in camunda post object.
  findAttributeByKey(k) {
    let attr = '';
    let arr = [
      this.WithoutInputFields_Account_details,
      this.WithoutInputFields_Business,
      this.WithoutInputFields_AdditionalDetails,
      this.WithoutInputFields_SecondaryDetails,
      this.WithoutInputFields_AccountOwner];
    arr.forEach(ar => {
      let ind = ar.findIndex(ad => ad.key == k);
      if (ind != -1) {
        attr = ar[ind].AttributeName;
        // console.log(attr);

        return attr;
      }
    });
    return attr;
  }

  EditFlag(message) {
    // debugger;
    this.buildModificationObject();
    let keys = Object.keys(this.accountModificationObj["account"]);
    let attr = { SysGuid: (this.accountDetails.SysGuid) ? this.accountDetails.SysGuid : '' };
    // console.log(keys, this.accountModificationObj["account"]);

    keys.forEach((k, ind) => {
      let attrName = this.findAttributeByKey(k);
      console.log(this.accountModificationObj["account"][ind], this.modificationAttributes[ind]);

      if (this.accountModificationObj["account"][ind] && this.accountModificationObj["account"][ind] != this.modificationAttributes[ind]) {
        if (attrName) attr[attrName] = true;
      }
      else {
        if (attrName) attr[attrName] = false;
      }
      console.log(attr, attrName, k);
    });


    this.accountListService.EditFlag(attr).subscribe(res => {
      this.isLoading = false;
      this.snackBar.open(message, '', {
        duration: 3000
      });
      this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
      this.snackBar.open(message, '', {
        duration: 3000
      });
      this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    })
  }

  /* API for Approve, Reject,Rowork from SBU ** START ** KKN ** */
  validateSbu(obj) {
    console.log(obj);

    this.isLoading = true;
    this.accountListService.validateSbu(obj).subscribe(res => {
      this.isLoading = false;
      console.log(res);

      if (res.status.toLowerCase() == 'success') {

        this.snackBar.open(res.data[0].Status, '', {
          duration: 3000
        });

        // this.accservive.accounttoast(res.data[0].Status);
        this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }))

      }
      else {
          this.snackBar.open(res.message, '', {
            duration: 5000
          });
      }
      // if (obj.statuscode == 184450001)
      //   this.accservive.accounttoast('Successfully Approved');
      // else if (obj.statuscode == 184450004)
      //   this.accservive.accounttoast('Successfully rejected');
      // else if (obj.statuscode == 184450006)
      //   this.accservive.accounttoast('Successfully sent for rework');
      this.router.navigate(['/accounts/accountcreation/activerequest']);
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.snackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  /* API for Approve, Reject,Rowork from SBU * END * KKN ** */

  /* API for Approve, Reject,Rowork from CSO ** START ** KKN ** */
  reviewCso(obj) {
    this.isLoading = true;
    this.accountListService.reviewCso(obj).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
      if (res.status.toLowerCase() == 'success') {
        this.snackBar.open(res.data[0].Status, '', {
          duration: 3000
        });
      }
      else {
          this.snackBar.open(res.message, '', {
            duration: 5000
          });
      }
      // if (obj.statuscode == 184450002)
      //   this.accservive.accounttoast('Successfully Approved');
      // else if (obj.statuscode == 184450004)
      //   this.accservive.accounttoast('Successfully rejected');
      // else if (obj.statuscode == 184450007)
      //   this.accservive.accounttoast('Successfully sent for rework');
      this.router.navigate(['/accounts/accountcreation/activerequest']);
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.snackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  /* API for Approve, Reject,Rowork from CSO ** START ** KKN ** */

  /* API for Submit rework from account requester  ** START ** KKN ** */
  roworkRequest(obj) {
    this.isLoading = true;
    this.accountListService.reworkOnProspect(obj).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      this.store.dispatch(new activeRequestsclear({ ActiveRequestModel: {} }));
      if (res.status.toLowerCase() == 'success') {
        this.snackBar.open(res.data[0].Status, '', {
          duration: 3000
        });
        // this.snackBar.open('Successfully submitted', '', {
        //   duration: 3000
        // });
      }
      // this.accservive.accounttoast('Successfully submitted');
      this.router.navigate(['/accounts/accountcreation/activerequest']);
    }, error => {
      this.isLoading = false;
    });
  }

  /* API for Approve, Reject,Rowork from SBU assign ** START **/
  reference_sbuReview(obj) {
    this.isLoading = true;
    this.accountListService.reference_sbuReview(obj).subscribe(result => {
      this.isLoading = false;
      if (result.status.toLowerCase() == 'success') {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        })
      }
      else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        })
      }
      this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  /* API for Approve, Reject,Rowork from SBU  assign * END **/

  /* API for Approve, Reject,Rowork from CSO  assign ** START */
  reference_reviewCso(obj) {
    this.isLoading = true;
    this.accountListService.reference_reviewCso(obj).subscribe(result => {
      this.isLoading = false;
      if (result.status.toLowerCase() == 'success') {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        })
      }
      else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        })
      }
      this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  reference_reviewGcp(obj) {
    this.isLoading = true;
    this.accountListService.reference_reviewGcp(obj).subscribe(result => {
      this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }))
      if (result.status.toLowerCase() == 'success') {
        this.snackBar.open(result.data[0].Status, '', {
          duration: 3000
        })
      }
      else {
        // let msg = result.message;
        // let msgdisplay = msg.substring((msg.indexOf(':') + 1), (msg.length));
        // this.snackBar.open(msgdisplay, '', {
        this.snackBar.open(result['message'], '', {
          duration: 3000
        })
      }
      this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  modification_validateSbu(obj) {
    this.isLoading = true;
    this.accountListService.modification_validateSbu(obj).subscribe(result => {
      // this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }))
      // if (result.Status) {
      //   this.snackBar.open(result.Status, '', {
      //     duration: 3000
      //   })
      // }
      if (result.status.toLowerCase() == 'success') {
        this.EditFlag(result.data[0].Status);
        // this.snackBar.open(result.data[0].Status, '', {
        //   duration: 3000
        // });
      }
      // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  modification_manualAccountModification(obj) {
    this.isLoading = true;
    this.accountListService.modification_manualAccountModification(obj).subscribe(result => {
      // this.isLoading = false;
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }));

      // if (result.Status) {
      //   this.snackBar.open(result.Status, '', {
      //     duration: 3000
      //   })
      // }
      if (result.status.toLowerCase() == 'success') {
        this.EditFlag(result.data[0].Status);
        // this.snackBar.open(result.data[0].Status, '', {
        //   duration: 3000
        // });
      }
      // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  modification_reviewCso(obj) {
    this.isLoading = true;
    this.accountListService.modification_reviewCso(obj).subscribe(result => {
      this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }));
      this.store.dispatch(new farmingRequestsclear({ FarmingListModel: {} }));
      // this.isLoading = false;
      if (result.status.toLowerCase() == 'success') {
        this.EditFlag(result.data[0].Status);
        // this.snackBar.open(result.data[0].Status, '', {
        //   duration: 3000
        // });
      }
      // if (result.Status) {
      //   this.snackBar.open(result.Status, '', {
      //     duration: 3000
      //   })
      // }
      // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  /* API for  Submit rework from account requester ** START ** KKN ** */

  OpenReworkComments1() {
    // this.assingFormData();
    if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
    console.log(this.accountCreationObj);
    const dialogRef = this.dialog.open(OpenReworkComments, {
      disableClose:true,
      width: '380px'
    });
    dialogRef.afterClosed().subscribe(res => {
      // debugger;
      if (this.accservive.searchFieldValidator(res)) {
        if (this.route_from == 'acc_req') {
          // this.accountCreationObj['prospect'] = this.postObjValidator(this.accountCreationObj['prospect']);
          this.accountCreationObj['prospect'] = this.accountCreationObj['prospect'];
          this.accountCreationObj["processinstanceid"] = this.accountDetails.ProcessGuid || '',
            this.accountCreationObj["ischangerequired"] = true;
          if (this.loggedin_user == "cso") {
            // this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450007));
            this.accountCreationObj["overall_comments"] = this.build_overall_comments(res, 184450007);
            this.accountCreationObj['prospect']["statuscode"] = 184450007;
            this.reviewCso(this.accountCreationObj);
          }
          else if (this.loggedin_user == "sbu") {
            // this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450006));
            this.accountCreationObj["overall_comments"] = this.build_overall_comments(res, 184450006);
            this.accountCreationObj['prospect']["statuscode"] = 184450006;
            this.validateSbu(this.accountCreationObj);
          }
          else { }
        }
        else if (this.route_from == 'assign_ref') {
          if (this.loggedin_user == "cso") {
            this.accountDetails.Comment = res;
            // this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450007));
            this.accountCreationObj["overall_comments"] = this.build_overall_comments(res, 184450007);
            this.reworkStatus = 184450006;
            this.isSbuChanged = false;
            this.reference_reviewCso(this.reviewAssignPayload());
          }
          else if (this.loggedin_user == "sbu") {
            this.accountDetails.Comment = res;
            this.accountCreationObj["overall_comments"] = this.build_overall_comments(res, 184450007);
            // this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450007));
            this.reworkStatus = 184450005;
            this.isSbuChanged = false;
            this.reference_sbuReview(this.reviewAssignPayload());
          }
          else { }
        }
        else if (this.route_from == 'modif_req') {
          // this.accountModificationObj["account"] = this.buildModificationObject();
          this.accountModificationObj["account"] = this.postObjValidator(this.buildModificationObject());
          this.accountModificationObj['processinstanceid'] = this.accountDetails.ProcessGuid || '';
          // this.accountModificationObj["account"]['name'] = this.accountDetails.Name || '';
          this.accountModificationObj["attribute_comments"] = this.accountCreationObj['attribute_comments'];

          if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
            if( this.modifStatus == 184450001){   // pending with CSO 
              this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450004));
              console.log(this.accountModificationObj);
              this.modification_reviewCso(this.accountModificationObj);
          }
          if( this.modifStatus == 184450000){   // pending with SE SPOC
            if (this.accountModificationObj["account"]["accounttype"] == 1) {
              this.accountModificationObj['ischangerequired'] = true;
              this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450003));
              console.log("reserve account rework object", this.accountModificationObj);
              this.modification_validateSbu(this.accountModificationObj);
            }
            else {
              this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450003));
              this.modification_manualAccountModification(this.accountModificationObj);
            }
        }
          }
          else {
            if (this.loggedin_user == "cso") {
              // this.accountModificationObj["overall_comments"] = this.modifOverallComment(res, 184450004);
              this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450004));
              console.log(this.accountModificationObj);
              this.modification_reviewCso(this.accountModificationObj);
            }
            else if (this.loggedin_user == "sbu") {
              if (this.accountModificationObj["account"]["accounttype"] == 1) {
                this.accountModificationObj['ischangerequired'] = true;
                // this.accountModificationObj['overall_comments']['status'] = 184450001;
                // this.accountModificationObj["overall_comments"] = this.modifOverallComment(res, 184450003);
                this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450003));
                console.log("reserve account rework object", this.accountModificationObj);
                // this.validateSbu(this.accountModificationObj);
                this.modification_validateSbu(this.accountModificationObj);
              }
              else {
                // this.accountModificationObj["overall_comments"] = this.modifOverallComment(res, 184450003);
                this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450003));
                this.modification_manualAccountModification(this.accountModificationObj);
              }
            }
            else { }
		  }

         
        }
        else { }
      }
    })
  }
  /* assingFormData method is used for assigning the input, select box, textarea data in API post body.*/
  assingFormData() {
    console.log(this.accountCreationObj);
    /* parseFloat will convert string to number, if input contains decimal it will be float otherwise it will be integer ** KKN** */
    this.WithoutInputFields_SecondaryDetails.forEach((element, index) => {
      if (element.control == 'input' || element.control == 'select' || element.control == 'textarea') {
        if (element.type && element.type == 'number')
          this.accountCreationObj['prospect'][element.key] = this.SecondaryDetails.controls[index].value ? parseFloat(this.SecondaryDetails.controls[index].value) : '';
        else if (element.type && element.type == 'string')
          this.accountCreationObj['prospect'][element.key] = (this.SecondaryDetails.controls[index].value) ? ('' + this.SecondaryDetails.controls[index].value + '') : '';
        else
          this.accountCreationObj['prospect'][element.key] = this.SecondaryDetails.controls[index].value || '';
      }
      if (element.control == 'autocomplete' && !this.accountCreationObj['prospect'][element.key]) {
        this.SecondaryDetails.controls[index].setValue('');
      }
    });
    if (this.route_from == 'assign_ref') {
      this.WithoutInputFields_AssignmentDetails.forEach((element, index) => {
        if (element.key != 'cbu') {
          if (element.control == 'input' || element.control == 'select' || element.control == 'textarea') {
            if (element.type && element.type == 'number')
              this.accountCreationObj['prospect'][element.key] = this.AssignmentDetails.controls[index].value ? parseFloat(this.AssignmentDetails.controls[index].value) : '';
            else
              this.accountCreationObj['prospect'][element.key] = this.AssignmentDetails.controls[index].value || '';
          }
          if (element.control == 'autocomplete' && !this.accountCreationObj['prospect'][element.key]) {
            this.AssignmentDetails.controls[index].setValue('');
          }
        }
      })
    }
    this.WithoutInputFields_AdditionalDetails.forEach((element, index) => {
      if (element.control == 'input' || element.control == 'select' || element.control == 'textarea') {
        if (element.type && element.type == 'number')
          this.accountCreationObj['prospect'][element.key] = this.AdditionalDetails.controls[index].value ? parseFloat(this.AdditionalDetails.controls[index].value) : '';
        else
          this.accountCreationObj['prospect'][element.key] = this.AdditionalDetails.controls[index].value || '';
      }
      if (element.control == 'autocomplete' && !this.accountCreationObj['prospect'][element.key]) {
        this.AdditionalDetails.controls[index].setValue('');
      }
    })
    this.WithoutInputFields_Business.forEach((element, index) => {
      if (element.control == 'input' || element.control == 'select' || element.control == 'textarea') {
        if (element.type && element.type == 'number')
          this.accountCreationObj['prospect'][element.key] = this.Business.controls[index].value ? parseFloat(this.Business.controls[index].value) : '';
        else
          this.accountCreationObj['prospect'][element.key] = this.Business.controls[index].value || '';
      }
      if (element.control == 'autocomplete' && !this.accountCreationObj['prospect'][element.key]) {
        this.Business.controls[index].setValue('');
      }
    })
    this.WithoutInputFields_Account_details.forEach((element, index) => {
      console.log(element, index);
      console.log(this.Account_details.controls[index].value);

      if (element.control == 'input' || element.control == 'select' || element.control == 'textarea') {
        if ((element.type && element.type == 'number') || (element.type && element.datatype == 'number')) {
          this.accountCreationObj['prospect'][element.key] = this.Account_details.controls[index].value ? parseFloat(this.Account_details.controls[index].value) : '';
          this.WithoutInputFields_Account_details[index].data_content = this.Account_details.controls[index].value ? parseFloat(this.Account_details.controls[index].value) : '';
        }
        else {
          console.log(element.key);
          this.accountCreationObj['prospect'][element.key] = this.Account_details.controls[index].value || '';
          this.WithoutInputFields_Account_details[index].data_content = this.Account_details.controls[index].value;
          console.log(this.accountCreationObj['prospect'][element.key]);

        }
      }
      if (element.control == 'autocomplete' && !this.accountCreationObj['prospect'][element.key]) {
        this.Account_details.controls[index].setValue(''); // resetting imcomplete data
      }

    });
  }
  OpenSubmitComments1() {
    if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
    // this.buildPostObject();
    if (this.route_from == 'acc_req') {
      // this.assingFormData();
      this.accountCreationObj['prospect'] = this.postObjValidator(this.accountCreationObj['prospect']);
      this.accountCreationObj["processinstanceid"] = this.accountDetails.ProcessGuid || '',
        console.log(this.accountCreationObj);
      // debugger;
      if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
      if (this.loggedin_user == "sbu") {
        const dialogRef = this.dialog.open(OpenReworkComments, {
          disableClose:true,
          width: '380px'
        });
        dialogRef.afterClosed().subscribe(res => {
          if (this.accservive.searchFieldValidator(res)) {
            // this.buildPostObject();
            this.accountCreationObj["ischangerequired"] = true;
            this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450002));
            this.accountCreationObj['prospect']['statuscode'] = 184450001;
            this.validateSbu(this.accountCreationObj);
          }
        });
      }
      else if (this.loggedin_user == "account_requestor") {
        this.accountCreationObj['prospect']['statuscode'] = 184450000; //184450000 changed to 184450003 as discussed with santosh
        // const dialogRef = this.dialog.open(OpenSubmitComments, {
        const dialogRef = this.dialog.open(OpenSubmitrework, {
          disableClose:true,
          width: '380px'
        });
        dialogRef.afterClosed().subscribe(res => {
          this.accountCreationObj["ischangerequired"] = true;
          this.accountCreationObj["overall_comments"] = { 'status': 184450009, 'requestedby': this.requestedby }; // after discussion with Santosh.
          if (res == 'yes')
            this.roworkRequest(this.accountCreationObj);
        });
      }
    } else if (this.route_from == 'assign_ref') {
      // this.assingFormData();
      console.log(this.accountCreationObj);
      if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
      if (this.loggedin_user == "sbu") {
        const dialogRef = this.dialog.open(OpenReworkComments, {
          disableClose:true,
          width: '380px'
        });
        dialogRef.afterClosed().subscribe(res => {
          console.log(res);
          // if (this.accservive.searchFieldValidator(res)) {
          //   this.buildPostObject();
          //   this.accountCreationObj["ischangerequired"] = true;
          //   this.accountCreationObj["overall_comments"] = this.postObjValidator(this.build_overall_comments(res, 184450002));
          //   this.accountCreationObj['prospect']['statuscode'] = 184450001;
          //   this.validateSbu(this.accountCreationObj);
          // }
          if (res != '') {
            this.reworkStatus = 184450001;
            this.reference_sbuReview(this.reviewAssignPayload());
          }
        });
      }
      else if (this.loggedin_user == "account_requestor") {
        this.accountCreationObj['prospect']['statuscode'] = 184450000; //184450000 changed to 184450003 as discussed with santosh
        const dialogRef = this.dialog.open(OpenSubmitComments, {
          disableClose:true,
          width: '380px'
        });
        dialogRef.afterClosed().subscribe(res => {
          // this.accountCreationObj["ischangerequired"] = true;
          // this.accountCreationObj["overall_comments"] = { 'status': 184450009, 'requestedby': this.requestedby }; // after discussion with Santosh.
          if (res == 'yes') {
            this.reworkStatus = 184450000;
            this.assignManualModification();
          }
        });
      }
    }
    else if (this.route_from == 'modif_req') {
      // this.assingFormData();
      console.log(this.accountCreationObj);
      if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];

      const dialogRef = this.dialog.open(OpenReworkComments, {
        disableClose:true,
        width: '380px'
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        if (this.accservive.searchFieldValidator(res)) {
          this.accountModificationObj["account"] = this.postObjValidator(this.buildModificationObject());

          if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0)
            this.accountModificationObj["attribute_comments"] = this.accountCreationObj["attribute_comments"];
          else
            this.accountModificationObj["attribute_comments"] = [];
          this.accountModificationObj['processinstanceid'] = this.accountDetails.ProcessGuid || '';
          
          if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
            if( this.modifStatus == 184450004){   // Rework from CSO
              this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450001));
            this.modification_manualAccountModification(this.accountModificationObj);
          }
          if( this.modifStatus == 184450003){   // REwork from se spoc
            this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450000));
            this.modification_manualAccountModification(this.accountModificationObj);
        }
          }
          else {
		  }

          if (this.loggedin_user == "sbu") {
            this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450001));
            // this.accountModificationObj["overall_comments"]['overallcomments'] = '';
            this.modification_manualAccountModification(this.accountModificationObj);
          }
          else if (this.loggedin_user == "account_requestor") {
            this.accountModificationObj["overall_comments"] = this.postObjValidator(this.modifOverallComment(res, 184450000));
            // this.accountModificationObj["overall_comments"]['overallcomments'] = '';
            this.modification_manualAccountModification(this.accountModificationObj);
          }

          else { }
        }
      })
    }
  }
  /* Open SearchAccountDataBase ** START ** *chethana*/
  openeSearchAccountDataBasePopup() {
    const dialogRef = this.dialog.open(SearchAccountDataBasePopupComponent,
      {
        disableClose:true,
        // width: '600px',
        data: { newAccount: 'yes' }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result)
        this.dnbdetailsbydunsid(result);
    });
  }
  dnbdetailsbydunsid(id) {
    this.master3Api.DNBDetailsByDunsId(id).subscribe((res: any) => {
      if (!res.IsError && res.ResponseObject) {
        this.isLoading = false;
        this.assignDnbData(res.ResponseObject);
      }
      else if (res.IsError) {
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
      }

    }, error => {
      this.isLoading = false;
    });
  }
  assignDnbData(data) {
    console.log("dnb data", data);
    // const source = {
    //   Name: data.Name || '',
    //   DUNSID: { Name: "" },
    //   ParentAccount: {
    //     Name: data.ParentAccount 
    //   },
    //   UltimateParentAccount: {
    //     Name: ""
    //   },
    //   HeadQuarters: data.HeadQuarters || '',
    //   CityString: "",
    //   Address: { CountryCode: "", Address1: "", CountryString: "" },
    //   Contact: data.Contact || '',
    //   WebsiteUrl: data.WebsiteUrl || '',
    //   Email: data.Email || '',
    //   BusinessDescription: data.BusinessDescription || '',
    //   EmployeeCount: data.EmployeeCount || '',
    //   SicDescription: data.SicDescription || '',
    //   StockIndexMemberShip: "",
    //   TickerSymbol: data.TickerSymbol || '',
    //   Currency: data.Currency1 || '',
    //   FortuneRanking: data.FortuneRanking || '',
    //   GrossProfit: data.GrossProfit || '',
    //   Revenue: data.Revenue || '',
    //   OperatingMargin: data.OperatingMargin || '',
    //   MarketValue: data.MarketValue || '',
    //   ReturnOnEquity: data.ReturnOnEquity || '',
    //   EntityType: {},
    //   CreditScore: data.CreditScore || '',
    //   OwnershipType: ""
    // };
    Object.assign(this.accountDetails, data);
    console.log(this.accountDetails);
    this.profileFormInit();
    this.formInitilize('old');
    this.buildPostObject();
    this.createButton();
  }
  // findAndUpdate(k, data) {
  //   let arr = [
  //     this.WithoutInputFields_Account_details,
  //     this.WithoutInputFields_Business,
  //     this.WithoutInputFields_AdditionalDetails,
  //     this.WithoutInputFields_SecondaryDetails,
  //     this.WithoutInputFields_AccountOwner];
  //   arr.forEach(ar => {
  //     let ind = ar.findIndex(ad => ad.fkey[0] == k);
  //     if (ind != -1) {
  //       if (ar[ind].fkey[1]) {
  //         let res = this.accservive.findObjectByLabel(data, ar[ind].fkey[1]);
  //         console.log(res);

  //         if (res) {
  //           ar[ind].data_content = (ar[ind].control == 'select') ? (res.SysGuid || res.Id || '') : (res.Value || res.Name || res.FullName || '');
  //           this.accountCreationObj['prospect'][ar[ind].key] = res.SysGuid || res.Id || '';
  //         }
  //       }
  //       else {
  //         ar[ind].data_content = (ar[ind].control == 'select') ? (data.SysGuid || data.Id || '') : (data.Value || data.Name || data.FullName || '');
  //         this.accountCreationObj['prospect'][ar[ind].key] = data.SysGuid || data.Id || '';
  //       }
  //     }
  //   })
  // }

  // updtadeValues(data) {
  //   const keys = Object.keys(data);
  //   keys.forEach(k => {
  //     this.findAndUpdate(k, data);
  //   });
  // }
  /* Open SearchAccountDataBase  ** end ** *chethana*/
  /* Open Approve popup, after entering comment API will call ** START ** *KUNAL*/

  OpenApproveComments1(isActivation) {
    let isActivationFlag: boolean = false;
    if (isActivation == "Activate") {
      console.log("whebfh");
      isActivationFlag = true;
    }
    if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
    let nameindex = this.WithoutInputFields_Account_details.findIndex(da => da.key == 'name');
    console.log(this.huntingRatio, this.altHuntingratio, this.ownerAccountDetails['swapaccount'], this.ownerAccountDetails['alternateswapaccount']);
    const dialogRef = this.dialog.open(OpenApproveComments, {
      disableClose:true,
      width: '380px',
      data: {
        isActivation: isActivationFlag,
        route_from: this.route_from,
        loggedin_user: this.loggedin_user,
        accName: this.Account_details.controls[nameindex].value,
        account1: this.getdecodevalue(this.accountDetails.Name) || '',
        account2: (this.ownerAccountDetails['swapaccount'] || this.ownerAccountDetails['alternateswapaccount']) ? (this.ownerAccountDetails['swapaccount'] || this.ownerAccountDetails['alternateswapaccount']) : '',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(this.accountCreationObj);
      console.log(res);
      if (res.action == 'yes') {
        if (this.route_from == 'acc_req') {
          // this.assingFormData();
          let obj = {
            "overall_comments": {
              "prospectid": this.accountDetails.SysGuid,
              "overallcomments": '',
              "requestedby": this.requestedby
            },
            "processinstanceid": this.accountDetails.ProcessGuid || '',
            "ischangerequired": true,
            "prospect": {},
            "attribute_comments": []
          }
          obj['prospect'] = this.accountCreationObj['prospect'];
          // obj['prospect'] = this.postObjValidator(this.accountCreationObj['prospect']);
          // obj['prospect']['name'] = this.accountDetails.Name || '';
          obj['prospect']['accountnumber'] = this.accountDetails.Number || '';
          if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0)
            obj["attribute_comments"] = this.accountCreationObj["attribute_comments"];
          
          if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
             if(this.accreqStatus == 184450001) {
              obj['overall_comments']['status'] = 184450003;
              obj['prospect']['statuscode'] = 184450002;
              this.reviewCso(obj);
             }
             if(this.accreqStatus == 184450000){
              obj['overall_comments']['status'] = 184450002;
              obj['prospect']['statuscode'] = 184450001;
              this.validateSbu(obj);
             }
          }
          else {
            if (this.loggedin_user == "cso") {
              obj['overall_comments']['status'] = 184450003;
              obj['prospect']['statuscode'] = 184450002;
              // obj['prospect']['prospecttype'] = 2;
              this.reviewCso(obj);
            }
            else if (this.loggedin_user == "sbu") {
              obj['overall_comments']['status'] = 184450002;
              obj['prospect']['statuscode'] = 184450001;
              this.validateSbu(obj);
            }
            else { }
          }
        }
        else if (this.route_from == 'assign_ref') {
          let obj = {
            assignmentReference: {
              assignmentReferenceId: ""
            },
            "overall_comments": {
              "assignmentReferenceId": this.accountDetails.SysGuid,
              "overallcomments": '',
              "requestedby": this.requestedby,
              "status": 184450006
            },
            "processinstanceid": this.accountDetails.ProcessGuid || '',
            "ischangerequired": false,
            "attribute_comments": [],
            "requestedby": this.requestedby,
            "isSbuChanged": false
          };
          obj["attribute_comments"] = this.accountCreationObj["attribute_comments"];
          obj['assignmentReference']['assignmentReferenceId'] = this.accountDetails.SysGuid;
          // this.assingFormData();
          if (this.loggedin_user == "cso") {
            this.reworkStatus = 184450003;
            this.reference_reviewCso(this.reviewAssignPayload());
          } else if (this.loggedin_user == "gcp") {
            this.reworkStatus = 184450003;
            this.reference_reviewGcp(this.reviewAssignPayload());
          }
          else if (this.loggedin_user == "sbu") {
            if (this.sbuChanged) {
              obj['overall_comments']['status'] = 184450001;
              obj['status'] = 184450001;
              this.reworkStatus = 184450001;
              this.reference_sbuReview(this.reviewAssignPayload());
            } else {
              obj['overall_comments']['status'] = 184450003;
              obj['status'] = 184450003;
              this.reworkStatus = 184450003;
              this.reference_sbuReview(this.reviewAssignPayload());
            }
          }
          else { }
        }
        else if (this.route_from == 'modif_req') {
          // this.assingFormData();
          let obj = {
            "overall_comments": {
              "accountid": this.accountDetails.MapGuid,
              "overallcomments": isActivation == 'Activate' ? res.comment : '',
              "requestedby": this.requestedby
            },
            "attribute_comments": [],
            "account": {}
          };
          obj["account"] = this.postObjValidator(this.buildModificationObject());
          // obj["account"] = this.buildModificationObject();
          // obj["account"]['name'] = this.accountDetails.Name || '';
          if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0)
            obj["attribute_comments"] = this.accountCreationObj["attribute_comments"]; //this.accountModificationObj["attribute_comments"];
          obj['processinstanceid'] = this.accountDetails.ProcessGuid || '';

          // obj['account']['name'] = this.accountDetails.Name || '';
          obj['account']['accountnumber'] = this.accountDetails.Number || '';

          if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
            if( this.modifStatus == 184450001){   // pending with CSO 
              obj['overall_comments']['status'] = 184450006;
              this.modification_reviewCso(obj);
          }
          if( this.modifStatus == 184450000){   // pending with SE SPOC
            obj['overall_comments']['status'] = 184450001;
            this.modification_reviewCso(obj);
        }
        if( this.modifStatus == 184450005){   // pending with Helpdesk
          obj['overall_comments']['status'] = 184450006;
          this.modification_reviewCso(obj);
      }
          }
          else {
            if (this.loggedin_user == "cso") {
              obj['overall_comments']['status'] = 184450006;
              this.modification_reviewCso(obj);
            }
            else if (this.loggedin_user == "sbu") {
              if (this.accountModificationObj["account"]["accounttype"] == 1) {
                obj['overall_comments']['status'] = 184450001;
                obj['ischangerequired'] = false;
                // this.validateSbu(obj);
                this.modification_validateSbu(obj);
              }
              else {
                obj['overall_comments']['status'] = 184450001;
                this.modification_manualAccountModification(obj);
              }
            }
            else { }
          }
        }
        else { }
      }
    });
  }
  /* Open Approve popup, after entering comment API will call ** END ** *KUNAL*/
  /* Open Reject popup, after entering comment API will call ** START ** *KUNAL*/

  OpenRejectComments1() {
    if (!this.accountCreationObj["attribute_comments"]) this.accountCreationObj["attribute_comments"] = [];
    const dialogRef = this.dialog.open(OpenRejectComments, {
      disableClose:true,
      width: '380px',
      data: { route_from: this.route_from, loggedin_user: this.loggedin_user, accountType: this.accountType }
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("reject comments", res);
      console.log("reject comments", res.comment);

      if (res.action === 'yes') {
        if (this.route_from == 'acc_req') {
          // this.assingFormData();
          let obj = {
            "overall_comments": {
              "prospectid": this.accountDetails.SysGuid,
              "overallcomments": res.comment,
              "requestedby": this.requestedby
            },
            "processinstanceid": this.accountDetails.ProcessGuid || '',
            "ischangerequired": false,
            "prospect": {},
            "attribute_comments": []
          };
          obj['prospect'] = this.accountCreationObj['prospect'];
          // obj['prospect'] = this.postObjValidator(this.accountCreationObj['prospect']);
          obj["attribute_comments"] = this.accountCreationObj["attribute_comments"];
          // obj['prospect']['name'] = this.accountDetails.Name || '';
          obj['prospect']['accountnumber'] = this.accountDetails.Number || '';

          if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0)
            obj["attribute_comments"] = this.accountCreationObj["attribute_comments"];
          
          if( this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
              if(this.accreqStatus == 184450001){
                obj['overall_comments']['status'] = 184450005;
                obj['prospect']['statuscode'] = 184450004;
                this.reviewCso(obj);
              }
              if(this.accreqStatus == 184450000 ){
                obj['overall_comments']['status'] = 184450005;
                obj['prospect']['statuscode'] = 184450004;
                this.validateSbu(obj);
              }
          }
          else {
            if (this.loggedin_user == "cso") {
              obj['overall_comments']['status'] = 184450005;
              obj['prospect']['statuscode'] = 184450004;
              this.reviewCso(obj);
            }
            else if (this.loggedin_user == "sbu") {
              obj['overall_comments']['status'] = 184450005;
              obj['prospect']['statuscode'] = 184450004;
              this.validateSbu(obj);
            }
            else { }
          }
        
        }
        else if (this.route_from == 'assign_ref') {
          // let obj = {
          //   assignmentReference: {
          //     assignmentReferenceId: ""
          //   },
          //   "overall_comments": {
          //     "assignmentReferenceId": this.accountDetails.SysGuid,
          //     "overallcomments": '',
          //     "requestedby": this.requestedby,
          //     "status": 184450004
          //   },
          //   "processinstanceid": this.accountDetails.ProcessGuid || '',
          //   "ischangerequired": false,
          //   "attribute_comments": [],
          //   "requestedby": this.requestedby,
          //   "isSbuChanged": false
          // };
          // obj['assignmentReference']['assignmentReferenceId'] = this.accountDetails.SysGuid;
          if (this.loggedin_user == "cso") {
            this.reworkStatus = 184450004;
            this.reference_reviewCso(this.reviewAssignPayload());
          }
          else if (this.loggedin_user == "sbu") {
            this.reworkStatus = 184450004;
            this.reference_sbuReview(this.reviewAssignPayload());
          } else if (this.loggedin_user == "gcp") {
            this.reworkStatus = 184450004;
            this.reference_reviewGcp(this.reviewAssignPayload());
          }
          else { }
        }
        else if (this.route_from == 'modif_req') {
          // this.assingFormData();
          let obj = {
            "overall_comments": {
              "accountid": this.accountDetails.MapGuid,
              "overallcomments": res.comment,
              "requestedby": this.requestedby
            },
            "attribute_comments": [],
            "account": {}
          };
          obj["account"] = this.buildModificationObject();
          // obj["account"] = this.postObjValidator(this.buildModificationObject());
          // obj['account']['name'] = this.accountDetails.Name || '';
          obj['account']['accountnumber'] = this.accountDetails.Number || '';

          if (this.accountCreationObj["attribute_comments"] && this.accountCreationObj["attribute_comments"].length > 0)
            obj["attribute_comments"] = this.accountCreationObj["attribute_comments"]; //this.accountModificationObj["attribute_comments"];
          obj['processinstanceid'] = this.accountDetails.ProcessGuid || '';
           
          if(this.IsHelpDesk != null && this.IsHelpDesk == 'true'){
            if( this.modifStatus == 184450001){   // pending with CSO 
              obj['overall_comments']['status'] = 184450002;
              this.modification_reviewCso(obj);
          }
          if( this.modifStatus == 184450000){   // pending with SE SPOC
            obj['overall_comments']['status'] = 184450002;
            this.modification_reviewCso(obj);

          if( this.modifStatus == 184450005){   // pending with Helpdesk
              obj['overall_comments']['status'] = 184450002;
              this.modification_reviewCso(obj);
          }
        }
          }
          else {
            if (this.loggedin_user == "cso") {
              obj['overall_comments']['status'] = 184450002;
              this.modification_reviewCso(obj);
            }
            else if (this.loggedin_user == "sbu") {
              if (this.accountModificationObj["account"]["accounttype"] == 1) {
                obj['overall_comments']['status'] = 184450002;
                obj['ischangerequired'] = false;
                // this.validateSbu(obj);
                this.modification_validateSbu(obj);
              }
              else {
                obj['overall_comments']['status'] = 184450002;
                this.modification_manualAccountModification(obj);
              }
            }
            else { }
		  }

        }
        else { }
      }
    });
  }
  OpenApproveSwap() {
    // this.snackBar.open("Hunting ratio is more then 8. Please swap account to process further", '', {
    //   duration: 3000
    // });
    console.log(this.huntingRatio);
    const dialogRef = this.dialog.open(OpenOverview,
      {
        disableClose:true,
        width: '380px',
        data: {
          'HuntingRatio': this.huntingRatio,
          'ExistingRatio': this.ExistingRatio,
          'Owner': this.ownerAccountDetails['owner'],
          'OverAllComments': this.accountDetails.OverAllComments,
          'Requesttype': this.accountCreationObj['prospect']['requesttype'] == 1 ? 'Account creation' : 'create and swap',
          'Status': this.accountDetails.Status.Value
        }
      });
  }
  OpenSavePayload() {
    let dataArray = [];
    if (this.accountCreationObj["attribute_comments"] != undefined) {
      if (this.accountCreationObj["attribute_comments"].length > 0) {
        this.accountCreationObj["attribute_comments"].forEach((res) => {
          dataArray.push({ Guid: res.id, Comments: res.comment });
        })
      }
    }
    if (this.route_from == 'acc_req') {
      console.log("this.accountCreationObj", this.accountCreationObj);
      console.log("this.accountCreationObj", this.accountCreationObj['prospect']);

      let objPayload = {
        "Name" : this.accountCreationObj['prospect']['name'],
        "SysGuid": this.accountCreationObj['prospect'].prospectid,
        "HeadQuarters": this.accountCreationObj['prospect'].headquarters,
        "TickerSymbol": this.accountCreationObj['prospect'].tickersymbol,
        "Address": {
          "CountryCode": this.accountCreationObj['prospect'].countrycode,
          "Address1": this.accountCreationObj['prospect'].address,
          "State": {
            "SysGuid": this.accountCreationObj['prospect'].state ? this.accountCreationObj['prospect'].state : ""
          },
          "City": {
            "SysGuid": this.accountCreationObj['prospect'].city ? this.accountCreationObj['prospect'].city : ""
          },
          "Country": {
            "SysGuid": this.accountCreationObj['prospect'].country ? this.accountCreationObj['prospect'].country : ""
          },
          "Region": {
            "SysGuid": this.accountCreationObj['prospect'].region ? this.accountCreationObj['prospect'].region : ""
          },
          "Geo": {
            "SysGuid": this.accountCreationObj['prospect'].geography ? this.accountCreationObj['prospect'].geography : ""
          },
          "CityString": this.accountCreationObj['prospect'].citystring ? this.accountCreationObj['prospect'].citystring : "",
          "CountryString": this.accountCreationObj['prospect'].countrystring ? this.accountCreationObj['prospect'].countrystring : "",
        },
        "Contact": {
          "ContactNo": this.accountCreationObj['prospect'].phonenumber ? this.accountCreationObj['prospect'].phonenumber : ""
        },
        "WebsiteUrl": this.accountCreationObj['prospect'].website,
        "Email": this.accountCreationObj['prospect'].email,
        "BusinessDescription": this.accountCreationObj['prospect'].businessdescription,
        "EmployeeCount": this.accountCreationObj['prospect'].employees,
        "SicDescription": this.accountCreationObj['prospect'].sicdescription,
        "StockIndexMemberShip": this.accountCreationObj['prospect'].stockindexmembership,
        "Currency": {
          "Id": this.accountCreationObj['prospect'].currency ? this.accountCreationObj['prospect'].currency : ""
        },
        "Cluster" : {
          "Id": this.accountCreationObj['prospect'].cluster ? this.accountCreationObj['prospect'].cluster : ""
        },
        "FortuneRanking": this.accountCreationObj['prospect'].fortune,
        "GrossProfit": this.accountCreationObj['prospect'].profits,
        "Revenue": this.accountCreationObj['prospect'].revenue,
        "OperatingMargin": this.accountCreationObj['prospect'].operatingmargins,
        "MarketValue": this.accountCreationObj['prospect'].marketvalue,
        "ReturnOnEquity": this.accountCreationObj['prospect'].returnonequity,
        "EntityType": {
          "Id": this.accountCreationObj['prospect'].entitytype ? this.accountCreationObj['prospect'].entitytype : ""
        },
        "CreditScore": this.accountCreationObj['prospect'].creditscore,
        "OwnershipType": {
          "Id": this.accountCreationObj['prospect'].ownershiptype ? this.accountCreationObj['prospect'].ownershiptype : ""
        },
        "Owner": {
          "SysGuid": this.accountCreationObj['prospect'].owner ? this.accountCreationObj['prospect'].owner : ""
        },
        "isSwapAccount": this.accountCreationObj['prospect'].isswapaccount,
        "SwapAccount": {
          "SysGuid": this.accountCreationObj['prospect'].swapaccount ? this.accountCreationObj['prospect'].swapaccount : ""
        },
        "SwapComment": this.accountCreationObj['prospect'].swapaccountcomment,
        "GrowthCategory": {
          "Id": this.accountCreationObj['prospect'].growthcategory ? this.accountCreationObj['prospect'].growthcategory : ""
        },
        "CoverageLevel": {
          "Id": this.accountCreationObj['prospect'].coveragelevel ? this.accountCreationObj['prospect'].coveragelevel : ""
        },
        "RevenueCategory": {
          "Id": this.accountCreationObj['prospect'].revenuecategory ? this.accountCreationObj['prospect'].revenuecategory : ""
        },
        "SBU": {
          "Id": this.accountCreationObj['prospect'].sbu ? this.accountCreationObj['prospect'].sbu : ""
        },
        "Vertical": {
          "Id": this.accountCreationObj['prospect'].vertical ? this.accountCreationObj['prospect'].vertical : ""
        },
        "SubVertical": {
          "Id": this.accountCreationObj['prospect'].subvertical ? this.accountCreationObj['prospect'].subvertical : ""
        },
        "FinYear": {
          "SysGuid": this.accountCreationObj['prospect'].finanacialyear ? this.accountCreationObj['prospect'].finanacialyear : ""
        },
        "IsNewAgeBusiness": this.accountCreationObj['prospect'].newagebusiness,
        "IsGovAccount": this.accountCreationObj['prospect'].governementaccount,
        "AttributeComment": dataArray,
        "AlternateAccountOwner": {
          "SysGuid": this.accountCreationObj['prospect'].alternateaccountowner ? this.accountCreationObj['prospect'].alternateaccountowner : ""
        },
        "isAlternateSwapAccount": this.accountCreationObj['prospect'].isalternateswapaccount,
        "AlternateSwapAccount": {
          "SysGuid": this.accountCreationObj['prospect'].alternateswapaccount ? this.accountCreationObj['prospect'].alternateswapaccount : ""
        },
      }
      // return this.postObjValidator(objPayload);
      return objPayload;
    } else if (this.route_from == 'assign_ref') {
      let objPayload = {
        "SysGuid": this.accountCreationObj['prospect'].prospectid,
        "MapGuid": this.accountDetails.MapGuid,
        "Owner": {
          "SysGuid": this.accountCreationObj['prospect'].owner ? this.accountCreationObj['prospect'].owner : ""
        },
        "SBU": {
          "Id": this.accountCreationObj['prospect'].sbu ? this.accountCreationObj['prospect'].sbu : ""
        },
        "Vertical": {
          "Id": this.accountCreationObj['prospect'].vertical ? this.accountCreationObj['prospect'].vertical : ""
        },
        "SubVertical": {
          "Id": this.accountCreationObj['prospect'].subvertical ? this.accountCreationObj['prospect'].subvertical : ""
        },
        "CustomerBusinessUnit": [
          {
            "SysGuid": this.accountCreationObj['prospect'].cbu
          }
        ],
        "ParentAccount": {
          "SysGuid": this.accountCreationObj['prospect'].parentaccount ? this.accountCreationObj['prospect'].parentaccount : ""
        },
        "UltimateParentAccount": {
          "SysGuid": this.accountCreationObj['prospect'].ultimateparent ? this.accountCreationObj['prospect'].ultimateparent : ""
        },
        "Address": {
          "Geo": {
            "SysGuid": this.accountCreationObj['prospect'].geography ? this.accountCreationObj['prospect'].geography : ""
          },
          "Region": {
            "SysGuid": this.accountCreationObj['prospect'].region ? this.accountCreationObj['prospect'].region : ""
          },
          "Country": {
            "SysGuid": this.accountCreationObj['prospect'].country ? this.accountCreationObj['prospect'].country : ""
          },
          "State": {
            "SysGuid": this.accountCreationObj['prospect'].state ? this.accountCreationObj['prospect'].state : ""
          },
          "City": {
            "SysGuid": this.accountCreationObj['prospect'].city ? this.accountCreationObj['prospect'].city : ""
          },

        },
        "IsSecondary": false,
        "AttributeComment": dataArray
      }
      return objPayload;
      // return this.postObjValidator(objPayload);
    }
  }
  reviewAssignPayload() {
    if (this.cbuArray.length == 0) {
      this.cbuArray = this.oldCBUArray;
    }
    let dataArray = [];
    if (this.accountCreationObj["attribute_comments"] != undefined) {
      if (this.accountCreationObj["attribute_comments"].length > 0) {
        this.accountCreationObj["attribute_comments"].forEach((res) => {
          dataArray.push({ Guid: res.id, Comments: res.comment });
        })
      }
    }

    let payload = {
      "assignmentReference": {
        "assignmentReferenceId": this.accountCreationObj['prospect'].prospectid || '', //"f7b4562f-5281-e911-a831-000d3aa058cb",
        "ownerid": this.accountCreationObj['prospect'].owner || '',
        "sbu": this.accountCreationObj['prospect'].sbu || '',
        "subvertical": this.accountCreationObj['prospect'].subvertical || '',
        "vertical": this.accountCreationObj['prospect'].vertical || '',
        // "parentaccount": this.accountCreationObj['prospect'].parentaccount, //"7472AC79-6154-E911-A830-000D3AA058CB",
        "ultimateparent": this.accountCreationObj['prospect'].ultimateparent, //"7472AC79-6154-E911-A830-000D3AA058CB",
        "geography": this.accountCreationObj['prospect'].geography || '',
        "region": this.accountCreationObj['prospect'].region || '', //"3946E494-D59A-E811-8130-000D3A803BD6",
        "country": this.accountCreationObj['prospect'].country || '', //"289EDEE7-0E2D-DF11-871F-02BF0AC9DF07",
        "state": this.accountCreationObj['prospect'].state || '', //"F0EE4376-B173-E911-A830-000D3AA058CB",
        // "city": this.accountCreationObj['prospect'].city, //"92B2D99F-B173-E911-A830-000D3AA058CB",
        "comments": this.accountDetails.Comment || '',
        // "accountid": this.reworkStatus == 184450005 ? '': this.SysGuidid, //"7472AC79-6154-E911-A830-000D3AA058CB",
        "rrquesttpe": 184450000,
        "statuscode": this.reworkStatus,
        // "statuscode": 184450000,
        "CBUCustomerContact": this.accountCreationObj['prospect'].phonenumber || '', //"FF2E9EB9-E576-E911-A830-000D3AA058CB",
        "activebuyerorganization": "Genpact",
        "cbuownerfromwipro": this.accountCreationObj['prospect'].owner || '',
        "isprimary": true,
        "issecondary": false,
        "territoryflag": true,
        "territoryflagid": 1,
        "ischangesprimaryvalue": this.ischangesprimaryvalue || ''
      },
      "attribute_comments": this.accountCreationObj['attribute_comments'],
      // {
      //   "parentaccount": "comment for wipro_parentaccount",
      //   "businessdescription": "comment for wipro_parentaccount",
      //   "noofemployees": "comment for wipro_parentaccount"
      // },
      "processinstanceid": this.accountDetails.ProcessGuid || '',
      "status": this.reworkStatus || '',
      "requestedby": this.requestedby || '', //"E582AA0C-863A-E911-A953-000D3AA053B9",
      "isSbuChanged": this.isSbuChanged || false
    }
    if (this.reworkStatus == 184450000 || this.reworkStatus == 184450001) {
      payload['assignmentReference']['accountid'] = this.accountMapGuid || '';
    }
    if (this.reworkStatus == 184450001 && this.loggedin_user == 'sbu') {
      payload['isSbuChanged'] = true;
    }
    console.log("this is payload", payload);
    payload['assignmentReference'] = payload['assignmentReference'];
    // payload['assignmentReference'] = this.postObjValidator(payload['assignmentReference']);
    payload['assignmentReference']["cbu"] = this.cbuArray; //"733CD4E0-2E76-E911-A830-000D3AA058CB",
    payload['assignmentReference']["oldcbu"] = this.oldCBUArray;
    return payload;
  }

  saveAccountData() {
    if (this.route_from == 'acc_req') {
      // console.log(this.assingFormData());
      // this.assingFormData();
      this.OpenSavePayload();
      console.log("clicked save", this.OpenSavePayload());
      this.isLoading = true;
      this.accountListService.saveOnProspect(this.OpenSavePayload()).subscribe(res => {
        console.log(res.Message);
        this.isLoading = false;
        if (!res.IsError && res.ResponseObject) {
          console.log(res.Message, "message");
          this.snackBar.open(res.Message, '', {
            duration: 3000
          });
          this.getDetails(this.route_from);
          // this.accservive.accounttoast(res.Message);
        }
        // this.router.navigate(['/accounts/accountcreation/activerequest']);
      }, error => {
        this.isLoading = false;
      });
    } else if (this.route_from == 'assign_ref') {
      // this.assingFormData();
      this.OpenSavePayload();
      console.log("clicked assign save", this.OpenSavePayload());
      this.isLoading = true;
      this.accountListService.saveOnAssignRef(this.OpenSavePayload()).subscribe(res => {
        console.log(res.Message);
        this.isLoading = false;
        if (!res.IsError && res.ResponseObject) {
          console.log(res.Message, "message");
          this.snackBar.open(res.Message, '', {
            duration: 3000
          });
          this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
        }
      }, error => {
        this.isLoading = false;
      });
    }
  }
  // checkDataChange(){
  //   if (this.accountDetails.MapGuid) {
  //     this.accountListService.FetchReferenceAccountDetails(this.accountDetails.MapGuid).subscribe(res => {
  //       if (!res["IsError"] && res["ResponseObject"]) {
  //         let accountDetails = res["ResponseObject"];
  //         if(accountDetails){
  //           let data = accountDetails;
  //           if((data.SBU.Id !== this.accountCreationObj['prospect'].sbu || data.SubVertical.Id != this.accountCreationObj['prospect'].subvertical ||
  //           data.Vertical.Id != this.accountCreationObj['prospect'].vertical || data.Geo.SysGuid != this.accountCreationObj['prospect'].geography ||
  //           data.Region.SysGuid != this.accountCreationObj['prospect'].region || data.Address.Country.SysGuid != this.accountCreationObj['prospect'].country)){
  //             return true;
  //           }else{
  //             return false;
  //           }
  //         }
  //       }
  //     })
  //   }

  // }
  assignManualModification() {
    console.log("assignment reference rework", this.reviewAssignPayload());
    this.isLoading = true;
    // if (this.isRequesterChanged) {
    // if (this.checkDataChange()) {
    //   if (this.accountDetails.MapGuid) {
    //   this.accountListService.FetchReferenceAccountDetails(this.accountDetails.MapGuid).subscribe(res => {
    //     if (!res["IsError"] && res["ResponseObject"]) {
    //       let accountDetails = res["ResponseObject"];
    //       if(accountDetails){
    //         let data = accountDetails;
    //         if((data.SBU.Id !== this.accountCreationObj['prospect'].sbu || data.SubVertical.Id != this.accountCreationObj['prospect'].subvertical ||
    //         data.Vertical.Id != this.accountCreationObj['prospect'].vertical || data.Geo.SysGuid != this.accountCreationObj['prospect'].geography ||
    //         data.Region.SysGuid != this.accountCreationObj['prospect'].region || data.Address.Country.SysGuid != this.accountCreationObj['prospect'].country)){
    //           this.ischangesprimaryvalue = true;
    //         }else{
    //           this.ischangesprimaryvalue = false;
    //         }
    //       }
    //     }
    //   })
    // }
    // this.ischangesprimaryvalue = true;
    // }
    this.accountListService.reference_manualAccountModification(this.reviewAssignPayload()).subscribe(res => {
      console.log("assignment reference response", res);
      if (res.Status) {
        this.snackBar.open(res.data[0].Status, '', {
          duration: 3000
        });
      }
      this.isLoading = false;
      this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
    }, error => {
      this.isLoading = false;
    });
  }
  getAllSwapAccount(ownerid, countryId, firstTime) {
    this.allSwapableAccount = [];
    console.log(this.accountCreationObj['prospect']);
    // if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    var swapaccount = this.master3Api.getswapaccount(ownerid, countryId)
    swapaccount.subscribe((res: any) => {

      if (this.accservive.validateKeyInObj(this.accountCreationObj, ['prospect', 'swapaccount']))
        this.accountCreationObj['prospect']['requesttype'] = this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['swapaccount']) ? 3 : 1;
      // this.accountCreationObj['prospect']['swapaccount'] = '';
      if (!firstTime) this.ownerAccountDetails['isswapaccount'] = false;
      // this.accountCreationObj['prospect']['isswapaccount'] = false;
      console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.allSwapableAccount = res.ResponseObject;
    })
  }

  SwapAccountOpen() {

    // if (this.allSwapableAccount.length == 0) {
    //   this.snackBar.open('Don\'t have any account to swap', '', {
    //     duration: 2000
    //   });
    //   this.accountCreationObj['prospect']['isswapaccount'] = false;
    //   this.ownerAccountDetails['isswapaccount'] = false;
    // }
    // else {
    // if (!this.accountCreationObj['prospect']['country']) this.accountCreationObj['prospect']['country'] = '';
    if (this.accountCreationObj['prospect']['isswapaccount'] && this.ownerAccountDetails['isswapaccount']) {
      const dialogRef = this.dialog.open(SwapPopupComponent,
        {
          disableClose:true,
          width: '850px',
          data: { allSwapableAccount: this.allSwapableAccount }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.accountCreationObj['prospect']['swapaccount'] = result.SysGuid;
          this.accountCreationObj['prospect']['requesttype'] = this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['swapaccount']) ? 3 : 1;
          // let ind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'swapaccount');
          // this.AccountOwner.controls['swapaccount'].setValue(result.Name);
          this.ownerAccountDetails['swapaccount'] = result.Name;
        }
      });
      // }
    }
  }

  AltSwapAccountOpen() {
    console.log("values of isswapaccount", this.accountCreationObj['prospect']['isalternateswapaccount'], this.ownerAccountDetails['isalternateswapaccount']);

    if (this.accountCreationObj['prospect']['isalternateswapaccount']) {
      const dialogRef = this.dialog.open(SwapPopupComponent,
        {
          disableClose:true,
          width: '850px',
          data: { allSwapableAccount: this.altSwapableAccount }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.accountCreationObj['prospect']['alternateswapaccount'] = result.SysGuid;
          this.accountCreationObj['prospect']['requesttype'] = this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['alternateswapaccount']) ? 3 : 1;
          // let ind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'swapaccount');
          // this.AccountOwner.controls['swapaccount'].setValue(result.Name);
          this.ownerAccountDetails['alternateswapaccount'] = result.Name;
        }
      });
      // }
    }
  }
  SearchAccountOwner(event) {
debugger
    if (event.type == 'keyup') {
      this.isHunatble = true;
      this.huntingRatio = 0;
      this.accountCreationObj['prospect']['owner'] = '';
      this.ownerAccountDetails['swapaccount'] = '';
      this.accountCreationObj['prospect']['isswapaccount'] = false;
      this.ownerAccountDetails['isswapaccount'] = false;
      let swapind = this.WithoutInputFields_AccountOwner.findIndex(w => w.key == 'isswapaccount');
      this.SecondaryDetails.controls[swapind].disable();
      // let altownerind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'isalternateswapaccount');
      // this.SecondaryDetails.controls[altownerind].disable();
      this.altHuntingratio = undefined;
      this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
      this.accountCreationObj['prospect']['alternateaccountowner'] = '';
      this.accountCreationObj['prospect']['alternateswapaccount'] = '';
      this.ownerAccountDetails['alternateswapaccount'] = '';
      this.ownerAccountDetails['alternateaccountowner'] = '';
      this.ownerAccountDetails['isalternateswapaccount'] = false;
    }

    let ind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'owner');
    // if(ind != -1)
    // this.WithoutInputFields_Account_details[ind].data = [];
    console.log(this.accountCreationObj['prospect']['owner'], this.ownerAccountDetails['owner']);
    this.WithoutInputFields_AccountOwner[ind].data = [];
    this.isActivityGroupSearchLoading = true;
    this.master3Api.AccountOwnerSearch(this.ownerAccountDetails['owner']).subscribe(result => {
      this.isActivityGroupSearchLoading = false;

      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        if(result.ResponseObject.length != 0){  
        this.WithoutInputFields_AccountOwner[ind].data = result.ResponseObject.map(val => {
          let initials = val.FullName.split(" ");
          console.log("initals", initials);
          return {
            SysGuid: val.SysGuid,
            FullName: val.FullName,
            Initials: initials.length == 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
            Designation: val.Designation
          }
        });
      }
       if (result.ResponseObject.length == 0)
          this.WithoutInputFields_AccountOwner[ind].data = [];
      } else {
        this.WithoutInputFields_AccountOwner[ind].data = [];
      }
      // if(!result.IsError && result.Res)
      // this.customerContact= result.
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.WithoutInputFields_AccountOwner[ind].data = [];
    })



  }
  SearcAltAccountOwner(event) {
    if (event === '') {
      this.altHuntingratio = undefined;
      this.accountCreationObj['prospect']['alternateaccountowner'] = '';
      this.accountCreationObj['prospect']['alternateswapaccount'] = '';
      this.ownerAccountDetails['alternateswapaccount'] = '';
    }
    console.log("shcsdhc", event);
    let ind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'alternateaccountowner');
    this.WithoutInputFields_AccountOwner[ind].data = [];
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": event,
      "Guid": this.accountCreationObj['prospect']['sbu'] || '' //Pass SBU Guid here
    }
    const altowner = this.master3Api.AlternateOwnerSearch(reqbody);
    altowner.subscribe(res => {
      console.log(res);
      let res2;
      let ownerList = [];
      if (!res.IsError && res.ResponseObject) {
        res2 = Object.assign({}, ...res);
        res.ResponseObject.filter(listitem => {
          if (listitem.FullName != this.ownerAccountDetails['owner']) {
            ownerList.push(listitem);
          };
        });
        res2.ResponseObject = ownerList;
        console.log(res2);
      }
      if (!res2.IsError && res2.ResponseObject) {
        this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
        if (event !== '') {
          this.alternativeAccountOwner = res2.ResponseObject;
        } else {
          this.alternativeAccountOwner = this.getTenRecords(res2.ResponseObject);
        }
      } else {
        //  this.ownerAccountDetails['alternateaccountowner'].setValue('');
        this.accountCreationObj['prospect']['alternateaccountowner'] = '';
        this.ownerAccountDetails['alternateaccountowner'] = '';
      }
    })
  }
  getIndex(WithoutInputFields_AccountOwner, key) {
    let ind = WithoutInputFields_AccountOwner.findIndex(acc => acc.key == key);
    return ind;
  }
  selectedOwner(item, key) {
    this.accountCreationObj['prospect'][key] = item.Id || item.SysGuid || '';

    this.ownerAccountDetails['owner'] = item.FullName;
    // this.OwnDetailsForm.controls['owner'].setValue(result.FullName);
    this.accountCreationObj['prospect']['owner'] = item.Id || item.SysGuid || '';
    this.getHuntingRatio(item.SysGuid, '');
    this.accountCreationObj['prospect']['swapaccount'] = '';
    this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
    this.ownerAccountDetails['isswapaccount'] = false;
    this.accountCreationObj['prospect']['isswapaccount'] = false;
    console.log(this.accountCreationObj['prospect']['isswapaccount']);

    this.getAllSwapAccount(item.SysGuid, this.accountCreationObj['prospect']['country'], false);
  }
  selectedAlternateOwner(item) {
    this.accountCreationObj['prospect']['alternateaccountowner'] = item.Id || item.SysGuid || '';
    let countryid = this.accountCreationObj['prospect']['country'] || '';
    this.ownerAccountDetails['alternateaccountowner'] = item.FullName;
    // this.OwnDetailsForm.controls['owner'].setValue(result.FullName);
    this.accountCreationObj['prospect']['alternateaccountowner'] = item.Id || item.SysGuid || '';
    this.getAltHuntingRatio(item.SysGuid, countryid);
    this.accountCreationObj['prospect']['alternateswapaccount'] = '';
    this.ownerAccountDetails['alternateswapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
    this.ownerAccountDetails['isalternateswapaccount'] = true;
    this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
    console.log(this.accountCreationObj['prospect']['isalternateswapaccount']);

    this.getAltSwapAccount(item.SysGuid, this.accountCreationObj['prospect']['country'], this.accountCreationObj['prospect']['sbu']);
  }
  getAltHuntingRatio(SysGuid, CountryGuid) {
    // this.isHunatble = true;
    this.master3Api.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        this.altHuntingratio = res['ResponseObject'];
        console.log("altHuntingratio", this.altHuntingratio);
        if (this.altHuntingratio >= 8) {
          this.toggleClasses();
        }
        console.log(this.altHuntingratio);
        let ind = this.WithoutInputFields_AccountOwner.findIndex(w => w.key == 'isalternateswapaccount');
        if (this.altHuntingratio <= 0) {
          // if (ind != -1) this.isHunatble = true;
          this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
          this.ownerAccountDetails['isalternateswapaccount'] = false;
          this.accountCreationObj['prospect']['alternateaccountowner'] = '';
          this.ownerAccountDetails['alternateaccountowner'] = '';
          // this.SecondaryDetails.controls[ind].disable();
        } else {
          // if (ind != -1) 
          // this.isHunatble = false;
          this.accountCreationObj['prospect']['isalternateswapaccount'] = true;
          this.ownerAccountDetails['isalternateswapaccount'] = true;
          // this.SecondaryDetails.controls[ind].enable();
        }
      }
    })
  }
  getAltSwapAccount(ownerid, countryId, sbuId) {
    this.altSwapableAccount = [];
    console.log(this.accountCreationObj['prospect']);
    // if (!this.accountCreationObj['country']) this.accountCreationObj['country'] = '';
    var swapaccount = this.master3Api.getaltswapaccount(ownerid, countryId, sbuId)
    swapaccount.subscribe((res: any) => {

      if (this.accservive.validateKeyInObj(this.accountCreationObj, ['prospect', 'alternateaccountowner']))
        this.accountCreationObj['prospect']['requesttype'] = this.accservive.searchFieldValidator(this.accountCreationObj['prospect']['alternateaccountowner']) ? 3 : 1;
      // this.accountCreationObj['prospect']['swapaccount'] = '';
      // if (!firstTime) this.ownerAccountDetails['isswapaccount'] = false;
      // this.accountCreationObj['prospect']['isswapaccount'] = false;
      console.log("swapaccount data", res.ResponseObject)
      if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
        this.altSwapableAccount = res.ResponseObject;
    })
  }

  OpenAccountOwner() {
    const dialogRef = this.dialog.open(AccountOwnerPopupComponent,
      {
        disableClose:true,
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result) {
        // console.log( this.accOwnerSwap);
        let ind = this.WithoutInputFields_AccountOwner.findIndex(acc => acc.key == 'owner');
        // this.profileForm.controls['AccountOwner']['controls'][ind].setValue(result.FullName);
        this.ownerAccountDetails['owner'] = result.FullName;
        // this.OwnDetailsForm.controls['owner'].setValue(result.FullName);
        this.accountCreationObj['prospect']['owner'] = result.SysGuid;
        this.getHuntingRatio(result.SysGuid, '');
        this.ownerAccountDetails['swapaccount'] = ''; // selected swap account should be empty on calling API. ** KKN **
        this.getAllSwapAccount(result.SysGuid, this.accountCreationObj['prospect']['country'], false);
        // this.formsData.owner=result[0].contact;
        // this.formsData.owner = result[0].contact;
      }
    });
  }
  getHuntingRatio(SysGuid, CountryGuid) {
    this.isHunatble = true;
    this.master3Api.HuntingCount(SysGuid, CountryGuid).subscribe(res => {
      if (!res['IsError']) {
        this.huntingRatio = res['ResponseObject'];
        if (this.huntingRatio >= 2) {
          this.toggleClasses();
        }
        console.log(this.huntingRatio);
        let ind = this.WithoutInputFields_AccountOwner.findIndex(w => w.key == 'isswapaccount');
        let altswapaccountind = this.WithoutInputFields_AccountOwner.findIndex(w => w.key == 'isalternateswapaccount');
        if (this.huntingRatio <= 0) {
          if (ind != -1) this.isHunatble = true;
          this.accountCreationObj['prospect']['isswapaccount'] = false;
          this.ownerAccountDetails['isswapaccount'] = false;
          this.SecondaryDetails.controls[ind].disable();
          this.SecondaryDetails.controls[altswapaccountind].disable();
          this.altHuntingratio = undefined;
          this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
          this.accountCreationObj['prospect']['alternateaccountowner'] = '';
          this.accountCreationObj['prospect']['alternateswapaccount'] = '';
          this.ownerAccountDetails['alternateswapaccount'] = '';
          this.ownerAccountDetails['alternateaccountowner'] = '';
          this.ownerAccountDetails['isalternateswapaccount'] = false;
        } else {
          // if (ind != -1) 
          if (this.huntingRatio < 8) {
            this.SecondaryDetails.controls[altswapaccountind].disable();
            this.altHuntingratio = undefined;
            this.accountCreationObj['prospect']['isalternateswapaccount'] = false;
            this.accountCreationObj['prospect']['alternateaccountowner'] = '';
            this.accountCreationObj['prospect']['alternateswapaccount'] = '';
            this.ownerAccountDetails['alternateswapaccount'] = '';
            this.ownerAccountDetails['alternateaccountowner'] = '';
            this.ownerAccountDetails['isalternateswapaccount'] = false;
          }
          this.isHunatble = false;
          this.accountCreationObj['prospect']['isswapaccount'] = false;
          this.ownerAccountDetails['isswapaccount'] = false;
          this.SecondaryDetails.controls[ind].enable();
        }
      }
    })
  }
  /* Open Reject popup, after entering comment API will call ** END ** *KUNAL*/
  openActivate() {
    const dialogRef = this.dialog.open(openActivate, {
      disableClose:true,
      width: '380px'
    });
  }
  // Submit rework popup chethana july 31 starts
  OpenSubmitrework() {
    const dialogRef = this.dialog.open(OpenSubmitrework, {
      disableClose:true,
      width: '380px'
    });
  }
  /* Expand panel based on condition KKN  start*/
  editable1 = false;
  editable2 = false;
  expand(i) {
    if (i == 1) {
      this.editable1 = false;
    }
    else if (i == 2) {
      this.editable2 = false;
    }
  }

  restrictspace1(e,formarr,data,key) {
    let data1 = data.trim()
    console.log(data1);
    let ind = formarr.findIndex((obj => obj.fkey == key));
    console.log("fkey's index", ind)
    if (e.which === 32 && !data.length){
           this.Account_details.controls[ind].setValue('');
           e.preventDefault();
           return;
    } 
    else if (!data1.length)
     { 
         e.target.value = '';
        this.Account_details.controls[ind].setValue('');
     }
   return;
 }

//  checkForJunkValue(data,key){
//   let index = this.WithoutInputFields_SecondaryDetails.findIndex(el => el.title == key);
//    console.log("checking for junk",data,key,index);
//    switch(key) {
//      case 'SBU':
//        let sbudata = this.WithoutInputFields_SecondaryDetails[index].data.filter(ele => ele.Name == data);
//        if (sbudata.length == 0 && this.submitted) this.SecondaryDetails.controls[index].setValue('');
//        return;
//      case 'Vertical':
//        let verticaldata =this.WithoutInputFields_SecondaryDetails[index].data.filter(ele => ele.Name == data);
//        if (verticaldata.length == 0 && this.submitted) this.SecondaryDetails.controls[index].setValue('');
//        return;
//      case 'Sub-vertical':
//        let subVerticaldata = this.sub_and_vertical.filter(ele => ele.Name == data);
//        if (subVerticaldata.length == 0 && this.submitted) this.SecondaryDetails.controls[index].setValue('');
//        return;
//        case 'Cluster':
//        let clusterData = this.sub_and_vertical.filter(ele => ele.Name == data);
//        if (clusterData.length == 0 && this.submitted) this.SecondaryDetails.controls[index].setValue('');
//        return;
//    }
//  }
  // websiteValidator(val) {
  //   if (val) {
  //     const isValid = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(val);
  //     return isValid;
  //   }
  //   else {
  //     return true;
  //   }
  // }

  // alternativeAccountOwner = [
  //   // {id:'1',FullName:'Rahul Jain'},
  //   // {id:'2',FullName:'Ravi Kumar'},
  //   // {id:'3',FullName:'Rahul Jain'},
  //   // {id:'4',FullName:'Ravi Kumar'}
  // ]

  secondaryOwnerSwap = [
    { id: '1', FullName: 'Rahul Jain' },
    { id: '2', FullName: 'Ravi Kumar' },
    { id: '3', FullName: 'Rahul Jain' },
    { id: '4', FullName: 'Ravi Kumar' }
  ]

  ngOnDestroy() {
    localStorage.removeItem('routeParams');
  }
  /* Expand panel based on condition KKN end*/

  // Submit rework popup chethana july 31 ends
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
        this.Accountlookupdata.tabledata = this.getFilterAccountData(res.ResponseObject);
        this.Accountlookupdata.isLoader = false;
        this.Accountlookupdata.nextLink = res.OdatanextLink;
      }
      else if (!res.IsError && res.ResponseObject.length == 0) {
        this.Accountlookupdata.TotalRecordCount = res.TotalRecordCount;
        this.Accountlookupdata.tabledata = [];
        this.Accountlookupdata.isLoader = false;
      }
      console.log("wipro accouts", this.wiproaccounts);
    })
  }
  getFilterAccountData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        return {
          AccountName: this.getdecodevalue(data.Name) || '',
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
  Accountlookupdata = {
    tabledata: [
      // { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
      // { AccountName: 'Alibaba.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Prospect', Owner: 'Rahul Dudeja', Region: 'India' },
      // { AccountName: 'Amazon.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Rahul  Jain', Region: 'USA' },
      // { AccountName: 'Apple.india', Number: 'AC8090219392', Vertical: 'MFG', Type: 'Prospect', Owner: 'Ravu Kumar', Region: 'USA' },
      // { AccountName: 'Alibaba.china', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'China' },
      // { AccountName: 'Google.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
      // { AccountName: 'Tesla.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' },
      // { AccountName: 'Alphabet.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'India' },
      // { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' }
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
    Isadvancesearchtabs: false,
    controlName: '',
    enableOtherDbOnly:true,
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
    IsCustom: true
  };

  openeSharedAdvanceLookupPopup() {
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose:true,
      width: '952px',
      data: this.Accountlookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x);

      this.PerformActionDnB(x);
      // this.dnbdetailsbydunsid(x);
      this.Accountlookupdata.tabledata = [
        // { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
        // { AccountName: 'Alibaba.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Prospect', Owner: 'Rahul Dudeja', Region: 'India' },
        // { AccountName: 'Amazon.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Rahul  Jain', Region: 'USA' },
        // { AccountName: 'Apple.india', Number: 'AC8090219392', Vertical: 'MFG', Type: 'Prospect', Owner: 'Ravu Kumar', Region: 'USA' },
        // { AccountName: 'Alibaba.china', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'China' },
        // { AccountName: 'Google.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'USA' },
        // { AccountName: 'Tesla.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' },
        // { AccountName: 'Alphabet.india', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Existing', Owner: 'Anubhav Jain', Region: 'India' },
        // { AccountName: 'Alphabet.usa', Number: 'AC8090219392', Vertical: 'Technology', Type: 'Hunting', Owner: 'Anubhav Jain', Region: 'USA' }
      ]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.selectedData && result.selectedData[0].Id)
        this.dnbdetailsbydunsid(result.selectedData[0].Id);
    });
  }
}

@Component({
  selector: 'rework',
  templateUrl: './reworkcomments-popup.html',
})
export class OpenReworkComments {
  subscripton: any;
  actionItem: any;
  reworkComment: string = "";
  mandatoryMessage: string = "";
  constructor(private snackBar: MatSnackBar, public dialogRef: MatDialogRef<OpenReworkComments>) {
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  submitActiveReworkComment() {
    this.mandatoryMessage = "";
    if (this.reworkComment != "") {
      this.dialogRef.close(this.reworkComment);
    } else {
      this.mandatoryMessage = "Additional comments is mandatory.";
      // this.snackBar.open("Comment is mandatory.", '', {
      //   duration: 3000
      // })
    }
  }

}
@Component({
  selector: 'submit',
  templateUrl: './submitcomments-popup.html',
})
export class OpenSubmitComments {
  constructor(public accservive: DataCommunicationService, public location: Location, public dialogRef: MatDialogRef<OpenSubmitComments>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  goBack() {
    this.dialogRef.close('yes');
    this.location.back();
  }

}

@Component({
  selector: 'Approve',
  templateUrl: './Approvecomments-popup.html',
})
export class OpenApproveComments {
  overallcomments: string = '';
  public route_from: string = '';
  loggedin_user: string = '';
  accName: string = '';
  isActivation: string = '';
  account1;
  account2;
  approvalObj = { action: '', comment: '' };
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  constructor(private accountListService: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, public accservive: DataCommunicationService, public dialogRef: MatDialogRef<OpenApproveComments>) {
    
    console.log(data);
    this.route_from = '';

    if (data) {
      this.isActivation = data.isActivation;
      this.route_from = data.route_from;
      this.loggedin_user = data.loggedin_user;
      this.accName = data.accName;
      this.account1 = data.account1 || '';
      this.account2 = data.account2 || '';
    }
  }
  submitComment(act, submitComment) {
    this.approvalObj = { action: act, comment: submitComment };
    this.dialogRef.close(this.approvalObj);
  }
  getdecodevalue(data) {
    return this.accountListService.getSymbol(data);
  }
}

@Component({
  selector: 'Reject',
  templateUrl: './Rejectcomments-popup.html',
})
export class OpenRejectComments {
  overallcomments: string = '';
  route_from: string = '';
  loggedin_user: string = '';
  accountType: string = 'modification';
  rejSubmitted: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, public accservive: DataCommunicationService, public dialogRef: MatDialogRef<OpenRejectComments>) {
    if (data) {
      console.log(data);


      this.route_from = data.route_from;
      this.loggedin_user = data.loggedin_user;
      this.accountType = data.accountType == 1 ? 'activation' : 'modification';
    }
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  submitComment(act, submitComment) {
    if (submitComment != "") {
      let rejectObj = { action: act, comment: submitComment };
      this.dialogRef.close(rejectObj);
     // this.accservive.messageReject();
    } else {
      this.rejSubmitted = true;
      // this.snackBar.open("Comments field is mandatory", '', {
      //   duration: 3000
      // });
    }
  }
}

@Component({
  selector: 'Approve',
  templateUrl: './activate-popup.html',
})
export class openActivate {
  constructor(public accservive: DataCommunicationService,public dialogRef: MatDialogRef<openActivate>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'Submitrework',
  templateUrl: './Submitrework-popup.html',
})
export class OpenSubmitrework {
  constructor(public accservive: DataCommunicationService, public location: Location, public dialogRef: MatDialogRef<OpenSubmitrework>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  goBack() {
    this.location.back();
  }
  submitRework(act) {
    this.dialogRef.close(act);
  }
}