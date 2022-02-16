import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Location } from '@angular/common';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
} from '@angular/material';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { Router, ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { FormArray, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MasterApiService } from '@app/core';
import { ValidationService } from '@app/shared/services';
@Component({
  selector: 'app-view-modification-details',
  templateUrl: './view-modification-details.component.html',
  styleUrls: ['./view-modification-details.component.scss']
})
export class ViewModificationDetailsComponent implements OnInit, OnDestroy {
  butDisabled: boolean = true;
  counter: number = 0;
  SysGuidid: string = '';
  route_from: any;
  accountDetails: any = [];
  CBU: any = [];
  CBUdisplay: string;
  AccountName: any;
  ProposedAccountType: any;
  AccountClassification: any;
  AccountNumber: any;
  // createDropdown: any = { 'Currency': [], 'entitytype': [], 'ownershipTypes': [], 'growthCatagoryValues': [], 'coveragelevelValues': [], 'revenueCatagoryValues': [] };
  UltimateParentAccount: any;
  parentaccount: any;
  ProposedAccountClassification: any;
  DunsNumber: any;
  AccountType: any;
  Region: any;
  ADH_VDH: any;
  Owner: any;
  StandbyAccountOwner: any;
  Geo: any;
  SubVertical: any;
  Vertical: any;
  SBU: any;
  Address: any;
  // CreditDetails: any;
  CreditScore: any;
  CreditScoreCommentary: any;
  LegalStructure: any;
  AccountCategory: any;
  GovermentAccount: any;
  NewAgeBusiness: any;
  accountCreationObj = {};
  WithoutInputFields_Accountdetails: any = [];
  WithoutInputFields_OwnershipDetails: any = [];
  WithoutInputFields_CreditDetails: any = [];
  WithoutInputFields_EngagementDetails: any = [];
  WithoutInputFields_Historyoverview: any = [];
  WithoutInputFields_AssignmentDetails: any = [];

  AccountAttribute: any = [];
  requestedby: string;
  loggedin_user: string = '';
  allButtons: any = [{ Istrue: "" }, { "": "" }, { "": "" }, { "": "" }, { "": "" }];
  validButton: any = [];
  name: any;
  overView: any;
  OverAllComments: any;
  isLoading: boolean = false;
  routerFromAcc:any;
  desp_cntnt: boolean = true;
  cmnts_cntnt: boolean;
  expand_section_cmnt: boolean;

  optionArray: any[];
  @Input() tableName: any;
  title: string;





  increment() {
    this.counter += 1;
  }

  counterOwnership_Details: number = 0;
  incrementOwnership_Details() {
    this.counterOwnership_Details += 1;
  }

  counterCredit_Details: number = 0;
  incrementCredit() {
    this.counterCredit_Details += 1;
  }
  counterAccount_details: number = 0;
  incrementAccount() {
    this.counterAccount_details += 1;
  }
  counterEngagement_Details: number = 0;
  incrementAssignment() {
    this.counterEngagement_Details += 1
  }

  getBussinesspopoverTitle(title) {
    if (this.loggedin_user == 'account_requestor') {
      return '';
    }
    else {
      return 'Comments - ' + title;
    }
  }
  goBack() {
    if(this.routerFromAcc){
      this.router.navigate([this.routerFromAcc])
    }else{
      switch (this.route_from) {
        case 'acc_req': {
          this.router.navigate(["accounts/accountcreation/activerequest"])
          return;
        } case 'assign_ref': {
          this.router.navigate(["accounts/assignmentRef/assigactiverequest"])
          return;
        } case 'modif_req': {
          this.router.navigate(["accounts/accountmodification/modificationactiverequest"])
          return;
        }
      }
    }
  }
  clickmes = false;
  toggleComment() {
    // this.index++;
    // console.log(this.index);
    this.clickmes = !this.clickmes;
    // document.getElementsByClassName('popover')[index].classList.toggle('active');
    // document.getElementsByClassName('button-plus')[index].classList.toggle('active');
  }
  constructor(private route: ActivatedRoute,
    public service: AccountService,
    public dialog: MatDialog,
    public location: Location,
    public accservive: DataCommunicationService,
    private fb: FormBuilder,
    public userdat: DataCommunicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    public validate: ValidationService,
    public encrDecrService: EncrDecrService,
    // private masterApi: MasterApiService,
    public masterS3Api: S3MasterApiService,
    public accountListService: AccountListService,
  ) {
    // this.name = "test";
    console.log(route);

    // let obj = JSON.parse(this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeParams'), 'DecryptionDecrip'));
    // console.log(obj);
    let paramsObj = this.accountListService.getSession('routeParams');
    if (paramsObj && paramsObj['Id']) {
      this.SysGuidid = paramsObj['Id'];
    } else {
      this.SysGuidid = '';
    }
    if (paramsObj && paramsObj['route_from']) {
      this.route_from = paramsObj['route_from'];
    } else {
      this.route_from = '';
    }

    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
    //   this.SysGuidid = route.snapshot.params.id;
    // } else {
    //   this.SysGuidid = '9df133e7-0568-e911-a95a-000d3aa053b9';
    // }
    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.name) {
    //   this.route_from = route.snapshot.params.name;
    // } else {
    //   this.route_from = 'acc_req';
    // }
  }

  /*******************editable with comments data fileds starts here****************** */
  profileForm = this.fb.group({
    OwnershipDetails: this.fb.array([
    ]),
    CreditDetails: this.fb.array([
    ]),
    EngagementDetails: this.fb.array([
    ]),
    Accountdetails: this.fb.array([
    ])
  });
  /*******************editablewith comments data fileds ends here****************** */
  ngOnInit() {


    console.log(this.loggedin_user);
    this.requestedby = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.getDetails(this.route_from);
    this.loggedin_user = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('loggedin_user'), 'DecryptionDecrip');
    this.routerFromAcc = JSON.parse(sessionStorage.getItem("accountCreateRouter"));

  }

  /* get Details accoding to routing and role ** SAI ** */
  getDetails(route_from) {
    /* acc_req: Request coming from Active Account List */
    /* assign_ref: Request coming from Assignment Referecne List */
    /* modif_req: Request coming from active Account Modification List */
    let obj: any = { 'SysGuid': this.SysGuidid, "LoggedInUser": { 'SysGuid': this.requestedby } };
    switch (route_from) {
      case 'acc_req': {
        this.title = "View account details";
        this.accountListService.ActiverequestsReview(obj).subscribe((result: any) => {
          console.log(result);
          if (!result.IsError && result.ResponseObject) {
            this.accountDetails = result.ResponseObject;
            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            console.log(this.AccountAttribute);
            this.formInitilize();
          }
        })
        return;
      }
      case 'assign_ref': {
        this.title = "View reference details";
        this.accountListService.AssignmentReferenceReview(obj).subscribe((result: any) => {
          console.log(result);
          if (!result.IsError && result.ResponseObject) {
            this.accountDetails = result.ResponseObject;
            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            console.log(this.AccountAttribute);
            this.formInitilize();
          }
        })
        return;
      }
      case 'modif_req': {
        this.title = "View modification details";
        this.isLoading = true;
        this.accountListService.ModificationActiveRequestDetails(obj).subscribe((result: any) => {
          console.log("sai getting " + result);
          if (!result.IsError && result.ResponseObject) {
            this.isLoading = false;
            this.accountDetails = result.ResponseObject;
            this.AccountAttribute = result.ResponseObject.AccountAttribute;
            console.log(this.AccountAttribute);
            this.formInitilize();
          }
        })
        return;
      }
      default:
        return;
    }
  }

  getdecodevalue(data)
  {
    return this.accountListService.getSymbol(data);
  }
  formInitilize() {
    console.log("account detais" + this.accountDetails);


    this.overView = [];
    if (this.accountDetails.OverAllComments) {
      if (this.accountDetails.OverAllComments.length > 0) {
        console.log("in ifffff");

        this.overView.push(this.accountDetails.OverAllComments[0]);
      }
    }
    // else{
    //   this.accountDetails.OverAllComments = [];
    // }
    /** Assignment ref data */
    if (this.route_from == 'assign_ref') {
      console.log(this.accountDetails, "this.accountDetails");
      this.CBU = this.accountDetails['CustomerBusinessUnit'];
      let cbuSelected: any = [];
      if (this.CBU.length != 0) {
        this.CBU.map((data) => {
          if (data.MapGuid) {
            cbuSelected.push({ 'Name': data.Name });
          }
        })
      }
      console.log("cbuslected", cbuSelected);
      if (cbuSelected.length != 0) {
        if (cbuSelected.length == 1) {
          this.CBUdisplay = cbuSelected[0]['Name'];
        }
        else {
          this.CBUdisplay = cbuSelected[0]['Name'] + "(+" + ((cbuSelected.length) - 1) + ")";
        }
      }
      else {
        this.CBUdisplay = "No Record Found";
      }

      console.log("this is cbu display", this.CBUdisplay);
      this.WithoutInputFields_AssignmentDetails = [
        { 'key': 'owner', 'isCommented': false, "AttributeName": "owner_fullname", 'comment': '', "title": "Owner", "data_content": (this.accountDetails.Owner && this.accountDetails.Owner.FullName) ? this.accountDetails.Owner.FullName : '', "control": 'autocomplete', "data": [] },
        { 'key': 'sbu', 'isCommented': false, "AttributeName": "sbu_name", 'comment': '', "title": "SBU", "data_content": (this.accountDetails.SBU && this.accountDetails.SBU.Name) ? this.accountDetails.SBU.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'geography', 'isCommented': false, "AttributeName": "geo_name", 'comment': '', "title": "Geo", "data_content": (this.accountDetails.Geo && this.accountDetails.Geo.Name) ? this.accountDetails.Geo.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'subvertical', 'isCommented': false, "AttributeName": "subvertical_name", 'comment': '', "title": "Sub-vertical", "data_content": (this.accountDetails.SubVertical && this.accountDetails.SubVertical.Name) ? this.accountDetails.SubVertical.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'cbu', 'isCommented': false, 'comment': '', "AttributeName": "trendsnanalysis_noofcbu", "title": "CBU", "data_content": this.CBUdisplay, "control": 'autocomplete', "data": [] },
        { 'key': 'region', 'isCommented': false, "AttributeName": "address_region_name", 'comment': '', "title": "Region", "data_content": (this.accountDetails.Region && this.accountDetails.Region.Name) ? this.accountDetails.Region.Name : '', "control": 'autocomplete', "data": [] },
        { 'key': 'parentaccount', 'isCommented': false, "AttributeName": 'parentaccount_name', 'comment': '', "title": "Parent account", "data_content": (this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.Name) ? this.getdecodevalue(this.accountDetails.ParentAccount.Name): '', "control": 'autocomplete', "data": [] },
        { 'key': 'vertical', 'isCommented': false, "AttributeName": "vertical_name", 'comment': '', "title": "Vertical", "data_content": (this.accountDetails.Vertical && this.accountDetails.Vertical.Name) ? this.accountDetails.Vertical.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'state', 'isCommented': false, "AttributeName": "address_state_name", 'comment': '', "title": "State", "data_content": (this.accountDetails.Address.State && this.accountDetails.Address.State.Name) ? this.accountDetails.Address.State.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'country', 'isCommented': false, "AttributeName": "address_country_name", 'comment': '', "title": "Country", "data_content": (this.accountDetails.Address && this.accountDetails.Address['Country'] && this.accountDetails.Address['Country']['Name']) ? this.accountDetails.Address['Country']['Name'] : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'ultimateparent', 'isCommented': false, "AttributeName": "ultimateparentaccount_name", 'comment': '', "title": "Ultimate parent account", "data_content": (this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.Name) ? this.accountDetails.UltimateParentAccount.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'finanacialyear', 'isCommented': false, 'AttributeName': 'financialyear', 'comment': '', "title": "Financial year", "data_content": (this.accountDetails.FinYear && this.accountDetails.FinYear.Name) ? this.accountDetails.FinYear.Name : '', "control": 'autocomplete', "data": [] },
        // { 'key': 'city', 'isCommented': false, "AttributeName": "address_city_name", 'comment': '', "title": "City", "data_content": (this.accountDetails.Address.City && this.accountDetails.Address.City.Name) ? this.accountDetails.Address.City.Name : '', "control": 'autocomplete', "data": [] },
      ];
    }

    /*******************editable Account details with comments data fileds starts here****************** */

    this.WithoutInputFields_Accountdetails = [
      { 'key': 'name', "title": "Account name", "data_content": this.accountDetails.Name ? this.getdecodevalue(this.accountDetails.Name) : '' },//0
      { 'key': 'dunsid', "title": "Duns number ", "data_content": this.accountDetails.DUNSID && this.accountDetails.DUNSID.Name ? this.accountDetails.DUNSID.Name : '' },//1
      { 'key': 'parentaccount', "title": "Parents name", "data_content": this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.Name ? this.getdecodevalue(this.accountDetails.ParentAccount.Name) : this.accountDetails.ParentAccount && this.accountDetails.ParentAccount.DNBParent ? this.getdecodevalue(this.accountDetails.ParentAccount.DNBParent) : '' },//2
      { 'key': 'ultimateparent', "title": "Ultimate parent's name ", "data_content": this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.Name ? this.getdecodevalue(this.accountDetails.UltimateParentAccount.Name) : this.accountDetails.UltimateParentAccount && this.accountDetails.UltimateParentAccount.DNBUltimateParent ? this.getdecodevalue(this.accountDetails.UltimateParentAccount.DNBUltimateParent) : '' },//3
      { 'key': 'proposedaccounttype', "title": "Proposed Account Type's name ", "data_content": this.accountDetails.ProposedAccountType && this.accountDetails.ProposedAccountType.Name ? this.accountDetails.ProposedAccountType.Name : '' },//4
      { 'key': 'accountclassification', "title": "Account Classification", "data_content": this.accountDetails.AccountClassification && this.accountDetails.AccountClassification.Name ? this.accountDetails.AccountClassification.Name : '' },//5
      { 'key': 'accountnumber', "title": "Account Number", "data_content": this.accountDetails.Number ? this.accountDetails.Number : '' },//6
      { 'key': 'proposedaccountclassification', "title": "Proposed Account Classification", "data_content": this.accountDetails.ProposedAccountClassification && this.accountDetails.ProposedAccountClassification.Name ? this.accountDetails.ProposedAccountClassification.Name : '' },//7
      { 'key': 'accounttype', "title": "Account Type", "data_content": this.accountDetails.Type && this.accountDetails.Type.Value ? this.accountDetails.Type.Value : '' },//8
      { 'key': 'legalentity', "title": "Legal entity name", "data_content": this.accountDetails.LegalEntity ? this.getdecodevalue(this.accountDetails.LegalEntity) : '' },//0

    ];
    //OwnershipDetails
    this.WithoutInputFields_OwnershipDetails = [
      { 'key': 'sbu', "title": "SBU", "data_content": this.accountDetails.SBU && this.accountDetails.SBU.Name ? this.accountDetails.SBU.Name : '' },//0
      { 'key': 'adh', "title": "ADH", "data_content": this.accountDetails.DeliveryManagerADHVDH && this.accountDetails.DeliveryManagerADHVDH.FullName ? this.accountDetails.DeliveryManagerADHVDH.FullName : '' },//1
      { 'key': 'vdh', "title": "VDH", "data_content": this.accountDetails.VDH && this.accountDetails.VDH.FullName ? this.accountDetails.VDH.FullName : '' },//2
      { 'key': 'adm', "title": "ADM", "data_content": this.accountDetails.ADM && this.accountDetails.ADM.FullName ? this.accountDetails.ADM.FullName : '' },//3
      { 'key': 'geo', "title": "Geo", "data_content": this.accountDetails.Geo && this.accountDetails.Geo.Name ? this.accountDetails.Geo.Name : '' },//4
      { 'key': 'vertical', "title": "Vertical", "data_content": this.accountDetails.Vertical && this.accountDetails.Vertical.Name && this.accountDetails.Vertical ? this.accountDetails.Vertical.Name : '' },//5
      { 'key': 'accountowner', "title": "Account Owner", "data_content": this.accountDetails.Owner && this.accountDetails.Owner.FullName ? this.accountDetails.Owner.FullName : '' },//6
      { 'key': 'region', "title": "Region", "data_content": this.accountDetails.Address.Region && this.accountDetails.Address.Region.Name ? this.accountDetails.Address.Region.Name : '' },//7
      { 'key': 'subvertical', "title": "Sub Vertical", "data_content": this.accountDetails.SubVertical && this.accountDetails.SubVertical.Name ? this.accountDetails.SubVertical.Name : '' },//8
      { 'key': 'standbyaccountowner', "title": "Standby Account Owner", "data_content": this.accountDetails.StandbyAccountOwner && this.accountDetails.StandbyAccountOwner.Name ? this.accountDetails.StandbyAccountOwner.Name : '' },//9
      { 'key': 'cluster', "title": "Cluster", "data_content": this.accountDetails.Cluster && this.accountDetails.Cluster.Value ? this.accountDetails.Cluster.Value : '' },//10
      { 'key': 'state', "title": "Country sub-division", "data_content": this.accountDetails.Address.State && this.accountDetails.Address.State.Name ? this.accountDetails.Address.State.Name : '' },//11
      { 'key': 'city', "title": "City region", "data_content": this.accountDetails.Address.City && this.accountDetails.Address.City.Name ? this.accountDetails.Address.City.Name : '' },//12
      { 'key': 'country', "title": "Country", "data_content": this.accountDetails.Address.Country && this.accountDetails.Address.Country.Name ? this.accountDetails.Address.Country.Name : '' },//13
    ]
    this.WithoutInputFields_CreditDetails = [
      { 'key': 'creditscore', "title": "Credit (Delinquency) Score", "data_content": this.accountDetails.CreditScore || '' },//0
      { 'key': 'creditscorecommentary', "title": "Credit Score Commentary", "data_content": this.accountDetails.CreditScoreCommentary ? this.accountDetails.CreditScoreCommentary.Name : '' },//1
      { 'key': 'legalstructure', "title": "Legal Structure(Partner, Corporation etc.)", "data_content": this.accountDetails.LegalStructure ? this.accountDetails.LegalStructure.Name : '' },//2

    ]
    this.WithoutInputFields_EngagementDetails = [
      { 'key': 'accountcategory', "title": "Account Category", "data_content": this.accountDetails.AccountCategory && this.accountDetails.AccountCategory.Name ? this.accountDetails.AccountCategory.Name : '' },//0
      { 'key': 'govermentaccount', "title": "Goverment Account", "data_content": this.accountDetails.IsGovAccount ? 'Yes' : 'No' },//1
      { 'key': 'newagebusiness', "title": "New Age Business", "data_content": this.accountDetails.IsNewAgeBusiness ? 'Yes' : 'No' },
      { 'key': 'pursuedopportunityscoperemarks', "title": " Pursued opportunity scope/tenure/other remarks", "data_content": this.accountDetails.PursuedopportunityRemarks ?  this.accountDetails.PursuedopportunityRemarks :'' },
      //2
    ]

    /*******************editable Account details  with comments data fileds ends here****************** */
  }
  ngOnDestroy() {
    localStorage.removeItem('routeParams');
    sessionStorage.removeItem("accountCreateRouter");
  }
}

