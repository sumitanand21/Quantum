import { Component, OnInit, EventEmitter, Inject, ElementRef } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router } from '@angular/router';
import { OpportunitiesService, opportunityAdvnHeaders, opportunityAdvnNames, OrderService } from '@app/core';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import { LeadsourcePopupComponent } from '@app/shared/components/single-table/sprint4Modal/leadsource-popup/leadsource-popup.component';
import { CBUpopupComponent } from '@app/shared/components/single-table/sprint4Modal/cbupopup/cbupopup.component';
import { SapPopupComponent } from '@app/shared/components/single-table/sprint4Modal/sap-popup/sap-popup.component';
import { deleteserviceLine1 } from '../opportunity-view/tabs/business-solution/business-solution.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-opportunity',
  templateUrl: './new-opportunity.component.html',
  styleUrls: ['./new-opportunity.component.scss'],
  providers: [DatePipe, DecimalPipe]
})

export class NewOpportunityComponent implements OnInit {

  //Flags for UI/CSS change
  addBottomPadding: boolean = false;
  panelOpenState3;
  panelOpenState1;
  panelOpenState2;
  showDivision: boolean = false;
  Creatediv: boolean = false;
  Securediv: boolean = false;
  Qualifydiv: boolean = false;
  Simplediv: boolean = true;
  CreatedivShow: boolean = false;
  CreatedivHidden: boolean = true;
  QualifydivHidden: boolean = true;
  QualifydivShow: boolean = false;
  Pursuithidden: boolean = false;
  Pursuitshow: boolean = true;
  Securehidden: boolean = false;
  Secureshow: boolean = true;
  ServiceDetails: boolean = true;
  NoSelectbtn: boolean = true;
  opportunityName: string = "";
  OpportunityNum: string = "";
  isLoading: boolean = false;
  empFlag: boolean = false;
  empFlagMatch: boolean = false;
  rfiFlagMatch: boolean = false;
  rfiFlag: boolean = false;
  empError: boolean = false;
  rfiError: boolean = false;
  pracAble: boolean = true;
  subPracAble: boolean = true;
  slbAble: boolean = true;
  engAble: boolean = true;
  verticalAble: boolean = true;
  oppRegAble: boolean = true;
  flagSubPactice: boolean = true;
  flagPactice: boolean = false;
  noCityFlag: boolean = true;
  isSearchLoader = false;
  savesuccess: any;
  successMsg: string = "Opportunity created successfully (";
  CreateOpportunityObject: any;
  result;
  action: any;
  engEndselectedDate: string;
  engStartselectedDate: string;
  decisionSelectedDate: string;
  shortlistedselectedDate: string;
  submittedselectedDate: string;
  engEndDate;
  engStartDate;
  shortlistedDate;
  submittedDate;
  decisionDate;
  proposalSubmissionDate;
  proposalSubmissionselectedDate: string;

  proposalSubmissionDateControl = new FormControl();
  minDate = new Date();
  estClosureDate;
  defaultestClosureDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 180);
  endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate()); // + 1080
  interval;

  
  time: string;

  oppNameFlag: boolean = false;
  accNameFlag: boolean = false;
  srcNameFlag: boolean = false;
  linkedLeadErr: boolean = false;
  proNameFlag: boolean = false;
  curNameFlag: boolean = false;
  verNameFlag: boolean = false;
  cbuNameFlag: boolean = false;
  oppRegNameFlag: boolean = false;
  vsoNameFlag: boolean = false;
  serLineFlag: boolean = false;
  pracFlag: boolean = false;
  subPraFlag: boolean = false;
  slBdmFlag: boolean = false;
  enModFlag: boolean = false;
  tcvFlag: boolean = false;
  descriptionFlag: boolean = false;
  viewflag: boolean = false;
  estFlag: boolean = false;
  engStartDateFlag: boolean = false;
  engEndDateFlag: boolean = false;
  submittedDateFlag: boolean = false;
  shortlistedDateFlag: boolean = false;
  proposalDateFlag: boolean = false;
  advNameFlag: boolean = false;
  advContactFlag: boolean = false;
  accOwnerFlag: boolean = false;
  priCustFlag: boolean = false;
  stateNameFlag: boolean = false;
  cityNameFlag: boolean = false;
  sapFlag: boolean = false;
  projDurFlag: boolean = false;
  countryFlag: boolean = false;
  cDMCFlag: boolean = false;
  commonFlag: boolean = false;
  scFlag: boolean = false;
  advFlagVar: boolean = true;
  advNameFlagVar: boolean = true;
  dctFlag: boolean = false;
  dbbFlag: boolean = false;
  errorFlag: boolean = false;
  createNotReq: boolean = true;
  tcvEmpCheck: boolean = false;
  tcvRfiCheck: boolean = false;
  rfiMainCheck: boolean = false;
  empMainCheck: boolean = false;
  tcvSaveCheck: boolean = false;
  wiproPrimaryCustomerContact = [];
  wiproAccountName = [];
  contractingCounrty = [];
  wiproLinkedAGPArray = [];
  serviceLine = [];
  practice = [];
  subPractice = [];
  wiproSlBdm = [];
  engModel = [];
  digBigBets = [];
  serviceLineGuId: string = "";
  serviceLinePracticeId: string = "";
  serviceLineSubPracticeId: string = "";
  verticalValue: string = "";
  oppRegionValue: string = "";
  stageSelected: number = 184450002;
  tcvValue: string;
  locNum: number;
  currencyMultiplier: number;
  textDescription: string = "";
  estRfiValue: string;
  estEmpValue: string;
  bgCgEmd: boolean = false;
  simpleDeal: boolean = false;
  falseValue: boolean = false;
  trueValue: boolean = true;
  projectDuiration: number;
  stateId: string = "";
  cityId: string = "";
  sbuName: string = "";
  sbuMatch: string = "s";
  noAdvisorId: string = "";
  sbuMapGuid;
  geoGuid;
  sbuForSave: string = "";
  geoGuidForSave: string = "";
  digitalBigBetsValue: string = "";
  serviceValue: string = "";
  practiceValue: string = "";
  subPracticeValue: string = "";
  sourceValue = null;
  proposalTypeValue: string = "";
  engagementModelValue: string = "";
  cbuListValue: string = "";
  cbuList = [];
  acVertical = [];
  acRegion = [];
  acCountry = [];
  acState = [];
  acCity = [];
  AdvisorName = [];
  advisorContact = [];
  currency = [];
  customerDMaker = [];
  vertSalesOwner = [];
  advisorOwner = [];
  selectedContact = [];
  sapArray = [];
  srcArray = [];
  leadSourceArray = [];
  proArray = [];
  selecteddecisionContactsForSave: any = [];
  linkedAgpComArray: any = [];
  linkedAgpFilterArray: any = [];
  linkedAgpForSave: any = [];
  detailsFromLead;
  detailsFromAccount;
  fromLeadFlag: boolean = false;
  fromAccountFlag: boolean = false;

  accontObj = { name: 'Name', Id: 'SysGuid' };
  sapObj = { name: 'Name', Id: 'SysGuid' };
  currencyObj = { name: 'Name', Id: 'SysGuid' };
  countObj = { name: 'Name', Id: 'SysGuid' };
  advisorObj = { name: 'Name', Id: 'SysGuid' };
  advisorContactObj = { name: 'Name', Id: 'SysGuid' };
  customerDMContactObj = { name: 'Name', Id: 'SysGuid' };
  primaryCustomerConObj = { name: 'Name', Id: 'SysGuid' };
  linkedAgpHeader = { name: 'Name', Id: 'SysGuid' };
  vertSaOwnDataHeader = { name: 'UserName', Id: 'UserId' };
  countryDataHeader = { name: 'Name', Id: 'SysGuid' };
  slbdmHeaderObj = { name: 'Name', Id: 'SysGuid' };
  dataHeader = { name: 'Name', Id: 'SysGuid' };
  selectedCbuObj: any = { SysGuid: "", Name: "" };
  selectedCbuObjTemp: any = { SysGuid: "", Name: "" };

  // /******************Link leads  autocomplete code start ****************** */
  // showlead: boolean = false;
  // contactlead: string;
  // contactleadSwitch: boolean = true;
  // contactleadclose() {
  //   this.contactleadSwitch = false;
  // }

  // appendlead(value: string, i) {
  //   this.contactlead = value;
  //   this.selectedlead.push(this.leadContact[i])
  // }
  // leadContact: {}[] = [
  //   { index: 0, contact: 'Lead name 01', initials: 'SL', value: true, designation:'Delivery manager' },
  //   { index: 1, contact: 'Lead name 02', initials: 'SL', value: false, designation:'Delivery manager' },
  //   { index: 2, contact: 'Lead name 03', initials: 'SL', value: false, designation:'Delivery manager' },
  //   { index: 3, contact: 'Lead name 04', initials: 'SL', value: false, designation:'Delivery manager' },
  // ]
  // selectedlead: {}[] = [];
  // /****************** Link leads  autocomplete code end ****************** */


  /******************linked AGP  autocomplete code start ****************** */
  contactTag: string;
  contactTagSwitch: boolean = false;
  cityName: string = "";
  stateName: string = "";
  cbuName: string = "";
  //  advance lookup data starts
  sapArrayForLookUp: any = [];
  currencyArrayForLookUp: any = [];
  advisorArrayForLookUp: any = [];
  advisorContactArrayForLookUp: any = [];
  primaryContactArrayForLookUp: any = [];
  verticalSalesArrayForLookUp: any = [];
  slbdmArrayForLookUp: any = [];
  cityArrayForLookUp: any = [];
  stateArrayForLookUp: any = [];
  countryArrayForLookUp: any = [];
  accountArrayForlookup: any = [];
  cbuArrayForLookUp: any = [];
  contactTagclose() {
    this.contactTagSwitch = false;
  }
  OpenCBU() {
    const dialogRef = this.dialog.open(CBUpopupComponent, {
      width: '450px',
      data: { 'accountID': this.detailsId }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res.IsError) {
        console.log("cbu1", res)
        let obj = {
          "Name": res.ResponseObject.CbuName ? res.ResponseObject.CbuName : "",
          "SysGuid": res.ResponseObject.cbuId ? res.ResponseObject.cbuId : ""
        }
        this.selectedCbu(obj);
      }
       else{
        this.projectService.displayMessageerror(res.Message)
      }
    });
  }

  linkedLeadObj = {
    leadType: null,
    leadSourceId: null,
    leadSourceName: '',
    leadSrcDtlId: null,
    leadSrcDtlName: '',
    leadDtlId: null,
    leadDetails: '',
    comments: '',
    originatingLeadId: '',
    originatingLeadName: ''

  }
  showIcon = false;
  openLeadPopup() {
    console.log("linkedLeadObj", this.linkedLeadObj)
    const dialogRef = this.dialog.open(LeadsourcePopupComponent, {
      width: '500px',
      data: { 'leadSource': this.leadSourceArray, 'values': this.linkedLeadObj, 'accountId': this.detailsId, 'disabledFlag': this.fromLeadFlag ? true : false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result from lead popup', result);
        this.linkedLeadObj.leadType = result.leadType;
        this.linkedLeadObj.leadSourceId = result.leadSourceId;
        this.linkedLeadObj.leadSourceName = result.leadSourceName;
        this.linkedLeadObj.leadSrcDtlId = result.leadSrcDtlId;
        this.linkedLeadObj.leadSrcDtlName = result.leadSrcDtlName;
        this.linkedLeadObj.leadDtlId = result.leadDtlId;
        this.linkedLeadObj.leadDetails = result.leadDetails;
        this.linkedLeadObj.comments = result.comments;
        this.linkedLeadObj.originatingLeadId = result.originatingLeadId;
        this.linkedLeadObj.originatingLeadName = result.originatingLeadName;
        this.showIcon = true;
        this.linkedLeadErr = false;
        this.srcNameFlag = false;
         this.appendRedisCache();
      }
    })
  }

  getLeadSource() {
    this.projectService.getLeadSource().subscribe(res => {
      if (!res.IsError) {
        this.leadSourceArray = res.ResponseObject;
        console.log("this.leadSourceArray", this.leadSourceArray);
      }
      else {
        this.leadSourceArray = [];
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadSourceArray = [];
      this.projectService.displayerror(err.status);
    });
  }

  OpenContactPopup() {
    const dialogRef = this.dialog.open(CustomerpopupComponent, {
      width: '800px',
      data: (this.selectedAccObj) ? ({ Name: this.selectedAccObj['Name'], SysGuid: this.selectedAccObj['SysGuid'], isProspect: this.selectedAccObj['isProspect'] }) : ''
    });
    dialogRef.afterClosed().subscribe(res => {
      debugger;
      console.log(res);
      if (res != '') { //&& this.wiproPrimaryCustomerContact.length == 0
        let json = {
          AccountName: "",
          Designation: res['Designation'] ? res['Designation'] : "",
          Name: (res['FName'] + ' ' + res['LName']),
          SysGuid: res['Guid'],
          parentDataOBJ: null,
          statecode: 0
        }
        this.SelectedPrimaryCustomerContact(json);

      }
    })
  }
  appendTag(name, Value) {
    let data = [];
    this.contactTag = "";
    this.linkedAgpFilterArray = this.wiproLinkedAGPArray.filter(x => x.Value == Value)
    if (this.linkedAgpComArray.length > 0) {
      data = this.linkedAgpComArray.filter(y => y.Value == Value)
    }
    if (data.length > 0) {
      this.snackBar.open("Account already selected", this.action, { duration: 5000 });
    }
    else {
      this.linkedAgpComArray.push(this.linkedAgpFilterArray[0])
      let obj = {
        "WiproName": this.linkedAgpFilterArray[0].Name,
        "WiproAGPId": this.linkedAgpFilterArray[0].Value,
        "OppAGPId": ""
      }
      this.linkedAgpForSave.push(obj);
      this.contactTagSwitch = false;
    }
  }


  /****************** linked AGP  autocomplete code end ****************** */

  // ************************* multiple append autocomplete starts here *************************

  contactName: string = "";
  contactNameSwitch: boolean = false;

  oppNameMethod() {
    if (this.opportunityName != "" && this.opportunityName.replace(/\s/g, "").length > 0) {
      this.oppNameFlag = false;
    } 
  }


  proposalMethod(data) {
    this.proNameFlag = false;
    this.errorFlag = false;
    this.estRfiValue = "";
    this.estEmpValue = "";
    this.tcvEmpCheck = false;
    this.tcvRfiCheck = false;
    this.appendRedisCache();
    if (data == "184450001") {
      this.empFlag = true;
      this.empFlagMatch = true;
      this.rfiFlag = false;
      this.rfiFlagMatch = false;
      this.empMainCheck = true;
      this.rfiMainCheck = false;
      this.estRfiValue = '';
    }
    else if (data == "184450003") {
      this.rfiFlag = true;
      this.rfiFlagMatch = true;
      this.empFlag = false;
      this.empFlagMatch = false;
      this.rfiMainCheck = true;
      this.empMainCheck = false;
      this.estEmpValue = '';
    }

    else {
      this.empFlag = false;
      this.rfiFlag = false;
      this.rfiFlagMatch = false;
      this.empFlagMatch = false;
      this.empMainCheck = false;
      this.rfiMainCheck = false;
      this.estRfiValue = '';
      this.estEmpValue = '';
    }
  }
  estChange(data) {
    if (data) {
      this.errorFlag = false;
      this.estFlag = false;
    }
  }

  tcvMethod(data) {
    this.tcvFlag = false;
    this.errorFlag = false;
    if (this.cuId != "") {
      this.locNum = Number(data);
      this.locNum = this.locNum / this.currencyMultiplier;
      this.tcvsaveCheckMethod(this.locNum);

    }
  }

  tcvsaveCheckMethod(data) {
    if (this.simpleDeal && data > 50000 && this.cuId) {
      this.tcvSaveCheck = true;
    }
    else {
      this.tcvSaveCheck = false;
    }
  }

  //decimal check for TCV
  checkDecimalValue(data) {
    if (data) {
      let updatedValue = data.toString().split('.');
      if (updatedValue.length > 2) {
        data = '';
      } else if (updatedValue[1]) {
        let decimalValue = updatedValue[1].substring(0, 2);
        data = `${updatedValue[0]}.${decimalValue}`;
        if (decimalValue.length > 1) {
          return parseFloat(data).toFixed(2);
        }
      } else if (updatedValue.length > 1) {
        data = `${updatedValue[0]}.`;
        return data;
      }
      return data;
    }
    return '';
  }

  genPopMethod() {
      const dialogRef = this.dialog.open(ConvertNormalDealPopup,
      {
        width: '450px',
        data: {
          tcvVal: this.tcvValue,
          currency: this.cuName
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.simpleDeal = false;
        window.scroll(0, 0);
        console.log('simpleDeal', this.simpleDeal);
      }
      else {
        this.simpleDeal = true;
        window.scrollBy(0, 1000);
        console.log('simpleDeal', this.simpleDeal);
      }
    })
  }

  changeSubmissionDate() {
    if (this.proposalSubmissionDate) {
      this.proposalDateFlag = false;
    }
  }

  validateEstDate(e) {
    if(this.proposalSubmissionDate) {
    let proposalSubDate = this.datePipe.transform(this.proposalSubmissionDate, 'yyyy-MM-dd');
    let estDate = this.datePipe.transform(this.estClosureDate, 'yyyy-MM-dd');
    if (estDate) {
      if (proposalSubDate > estDate) {
        this.projectService.displayMessageerror("Proposal submission date cannot be greater than estimated closure date");
        this.proposalSubmissionDate = null;
        this.proposalSubmissionDateControl.setValue(null);
      }
    }
  }
  }
  dateValidationEngStartDate(e) {
    if (this.engStartDate) {
      this.engStartDateFlag = false;
    }
    let startdate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let formEndDate = this.datePipe.transform(this.engEndDate, 'yyyy-MM-dd');
    if (formEndDate) {
      let validatedEngEndtDate = this.datePipe.transform(formEndDate, 'yyyy-MM-dd');
      if (startdate > validatedEngEndtDate) {
        this.projectService.displayMessageerror("Engagement start date cannot be greater than Engagement end date")
        this.engStartDate = "";

      }
    }
  }
  dateValidationEngEndDate(e) {
    if (this.engEndDate) {
      this.engEndDateFlag = false;
    }
    let enddate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let formStartDate = this.datePipe.transform(this.engStartDate, 'yyyy-MM-dd');
    if (formStartDate) {
      let validatedEngStartDate = this.datePipe.transform(formStartDate, 'yyyy-MM-dd');
      if (enddate < validatedEngStartDate) {
        this.projectService.displayMessageerror("Engagement end date cannot be lesser than Engagement start date")
        this.engEndDate = "";
      }
    }
  }

  addCommasEMP(e) {
    // this.estEmpValue = this.estEmpValue.replace(/,/g, "");
    // var num: string = "";
    // var parts = this.estEmpValue.split('.');
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // num = parts.join(".");
    // this.estEmpValue = num;
  }

  addCommasRFI(e) {
    // this.estRfiValue = this.estRfiValue.replace(/,/g, "");
    // var num: string = "";
    // var parts = this.estRfiValue.split('.');
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // num = parts.join(".");
    // this.estRfiValue = num;
  }

  changeShortlistedDate(event) {
    if (this.shortlistedDate) {
      this.shortlistedDateFlag = false;
    }
  }

  changeSubmittedDate(event) {
    if (this.submittedDate) {
      this.submittedDateFlag = false;
    }
  }

  // to delete appended customer starts here
  deleteCustomerContact(data, index) {
    if (data.OppDecisionMakerid != null) {
      let obj = {
        "Id": data.OppDecisionMakerid
      }
      this.projectService.deleteDecisionConatct(obj).subscribe(res => {
        console.log("response", res)
        if (res.IsError == false) {
          this.selectedContact.splice(index, 1);
          if (this.selectedContact.length == 0) {
            this.cDMCFlag = true;
          }
            this.appendRedisCache();
        }
      })

    }
    else {
      this.selectedContact.splice(index, 1);
      if (this.selectedContact.length == 0) {
        this.cDMCFlag = true;
      }
      this.selecteddecisionContactsForSave = this.selecteddecisionContactsForSave.filter(contact => contact.SysGuid != data.SysGuid)
        this.appendRedisCache();
    }
  }

  deleteAgp(item, j) {
    this.linkedAgpComArray.splice(j, 1);
    this.linkedAgpForSave = this.linkedAgpForSave.filter(contact => contact.WiproAGPId != item.Value);

  }
  // to delete appended customer ends here

  // initials starts here
  getInitials(customerDMakerName) {
    var names = customerDMakerName.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }
  // initials ends here


  contactNameclose() {
    this.contactNameSwitch = false;
    this.contactName = "";
  }

  appendcontact(item) {
    debugger;
    this.cDMCFlag = false;
    let data = [];
    this.contactName = "";
    if (this.selectedContact.length > 0) {
      data = this.selectedContact.filter(y => y.SysGuid == item.SysGuid)
    }
    if (data.length > 0) {
      this.snackBar.open("Contact already selected", this.action, { duration: 5000 });
    }
    else {
      this.errorFlag = false;
      let obj1={
        Name:item.Name,
        SysGuid:item.SysGuid,
        Designation:item.Designation
      }
      this.selectedContact.push(obj1)
      this.selecteddecisionContactsForSave = this.selectedContact;
      this.contactNameSwitch = false;
    }
    if (this.selectedContact.length > 0) {
      this.selectedContact = this.selectedContact.map(data => {
        data.Id = data.SysGuid;
        return data;
      });
    }
     this.appendRedisCache();
  }

  // complete object start here
  selectedAccObj: any = { SysGuid: "", Name: "" };
  detailsId: string = "";
  details: string = "";

  selectedSapObj: any = { SysGuid: "", Name: "" };
  sapName: string = "";
  sapId: string = "";

  selectedAccObj1: any = { SysGuid: "", Name: "" };
  detailsId1: string = "";
  details1: string = "";

  adNameSelected: any = { SysGuid: "", Name: "" };
  adNameId: string = "";
  adName: string = "";

  advisorConObj: any = { SysGuid: "", Name: "" };
  adContactId: string = "";
  adContactName: string = "";

  verticalSalesOwObject: any = { UserId: "", UserName: "" };
  verSaOwName: string = "";
  verSaOwId: string = "";

  countryName: string = "";
  countryId: string = "";

  adOwnerName: string = "";
  adOwnerId: string = "";

  cuSelected: any = { SysGuid: "", Name: "" };
  cuName: string = "";
  cuId: string = "";

  CountSelected: any = { SysGuid: "", Name: "" };
  countName: string = "";
  countId: string = "";

  serviceLineObj: {}[] = [];
  decr;
  userGuid;

  //object for slbdm lookup
  selectedSlbdmObj: any = { SysGuid: "", Name: "" };
  slbdmName: string = "";
  slBdValue: string = "";
  // complete object ends here

  //object for city lookup
  selectedCityObj: any = { SysGuid: "", Name: "" };
  selectedStateObj: any = { SysGuid: "", Name: "" };

  fromAutoSave = false;
  constructor(private el: ElementRef, public dialog: MatDialog, public service: DataCommunicationService, public router: Router,
    public projectService: OpportunitiesService, private snackBar: MatSnackBar, private datePipe: DatePipe,
    private EncrDecr: EncrDecrService, private orderService: OrderService) { }

  ngOnInit() {
    this.clearClicked = false;
    this.decr = localStorage.getItem('userID');
    this.userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    console.log('useridIssssss', this.userGuid);
    // this.showHideAccordion(this.simpleDeal);
    //From Lead
    this.detailsFromLead =  JSON.parse(sessionStorage.getItem('CreateOpportunityFromLead'));
    this.detailsFromAccount = this.projectService.getSession('accountDetails');// JSON.parse(sessionStorage.getItem('accountDetails'));
    console.log("this.detailsFromAccount",this.detailsFromAccount);
    console.log("Lead details", this.detailsFromLead)
    if (this.detailsFromLead && Object.keys(this.detailsFromLead).length > 0) {
      this.showHideAccordion(this.simpleDeal);
      this.fromLeadFlag = true;
      this.clickQualify();
      console.log("this.detailsFromLead.Title", this.detailsFromLead.Title)
      this.detailsId = this.detailsFromLead.Account ? this.detailsFromLead.Account.SysGuid : "";

      this.details = this.detailsFromLead.Account ? this.getSymbol(this.detailsFromLead.Account.Name) : "";
      this.selectedAccObj = { SysGuid: this.detailsId, Name: this.details,
      OwnerId: this.detailsFromLead.Account ? this.detailsFromLead.Account.Owner ? this.detailsFromLead.Account.Owner.SysGuid : '' : '',
      OwnerName: this.detailsFromLead.Account ? this.detailsFromLead.Account.Owner ? this.detailsFromLead.Account.Owner.FName : '' : '' }
      
      this.opportunityName = this.detailsFromLead.Title ? this.detailsFromLead.Title : "";
      this.textDescription= this.detailsFromLead.EnquiryDesc ? decodeURIComponent(this.detailsFromLead.EnquiryDesc) : "";
      this.sbuForSave = this.detailsFromLead.SBU ? this.detailsFromLead.SBU.Id : '';
      this.projectService.setSession('sbuStoredValue', this.detailsFromLead.SBU ? this.detailsFromLead.SBU.Name : '');
      console.log("sbuValue on create", this.projectService.getSession('sbuStoredValue'));

      console.log("this.opportunity", this.opportunityName);
      if (this.detailsId) {
        this.SelectedAccountValue(this.selectedAccObj)
      }
      this.verticalValue= this.detailsFromLead.Vertical.Id ? this.detailsFromLead.Vertical.Id : '';
      this.customerDMakerMethod("");
      this.sourceValue = 184450000;
      this.showIcon = true;
      this.linkedLeadObj = {
        leadType: 1,
        leadSourceId: null,
        leadSourceName: '',
        leadSrcDtlId: null,
        leadSrcDtlName: '',
        leadDtlId: null,
        leadDetails: '',
        comments: '',
        originatingLeadId: this.detailsFromLead.LeadGuid ? this.detailsFromLead.LeadGuid : '',
        originatingLeadName: this.detailsFromLead.Title ? this.detailsFromLead.Title : null
      }
      console.log(this.linkedLeadObj,"linkobj")
      if (this.detailsFromLead.Currency) {
        this.cuId = this.detailsFromLead.Currency.Id ? this.detailsFromLead.Currency.Id : '';
        this.cuName = this.detailsFromLead.Currency.Desc ? this.detailsFromLead.Currency.Desc : '';
        this.cuName=this.getSymbol(this.cuName);
      }
      if (this.detailsFromLead.Country) {
        let countrydata = {
          CountryName: this.detailsFromLead.Country.Name ? this.detailsFromLead.Country.Name : '',
          SysGuid: this.detailsFromLead.Country.SysGuid ? this.detailsFromLead.Country.SysGuid : ''
        }
        this.getCountrySelected(countrydata)
      }
      this.estClosureDate = this.detailsFromLead.EstimatedCloseDate ? this.detailsFromLead.EstimatedCloseDate : '';
      if(this.detailsFromLead.ServiceLine && this.detailsFromLead.ServiceLine.length){
       this.serviceValue = this.detailsFromLead.ServiceLine[0].Guid ? this.detailsFromLead.ServiceLine[0].Guid : '';
       this.serviceLineGuId = this.serviceValue;
       if(this.serviceValue){
         this.serviceLineMethod(this.serviceValue);
       }
      console.log(this.serviceValue,"this.serviceValue");
      this.practiceValue=this.detailsFromLead.ServiceLine[0].practice ? this.detailsFromLead.ServiceLine[0].practice.practiceGuid : '';
      if(this.practiceValue){
         this.practiceMethod(this.practiceValue);
       }
      console.log(this.practiceValue,"this.practiceValue");
      if(Object.keys(this.detailsFromLead.ServiceLine[0].SLBDM)){
       this.slbdmName=this.detailsFromLead.ServiceLine[0].SLBDM.Name?this.detailsFromLead.ServiceLine[0].SLBDM.Name:'';
       this.slBdValue=this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid?this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid:'';
      }
      }
    }
    //From lead end


 //Creation from Account
   else if (localStorage.getItem('accountRoute') == '1' ){
      this.detailsFromAccount = this.projectService.getSession('accountDetails');// JSON.parse(sessionStorage.getItem('accountDetails'));
    console.log("this.detailsFromAccount",this.detailsFromAccount);
       if (this.detailsFromAccount && Object.keys(this.detailsFromAccount).length > 0 ) {
     this.showHideAccordion(this.simpleDeal);
    this.detailsFromAccount = this.detailsFromAccount.accountDetails;
    this.detailsId = this.detailsFromAccount.SysGuid;
    this.details = this.getSymbol(this.detailsFromAccount.Name);
    // this.selectedAccObj = { SysGuid: this.detailsId, Name: this.details }

    this.selectedAccObj = { SysGuid: this.detailsId, Name: this.details,
      OwnerId: this.detailsFromAccount.Owner ? this.detailsFromAccount.Owner.SysGuid : '',
      OwnerName: this.detailsFromAccount.Owner ? this.detailsFromAccount.Owner.FullName : '' }

    
    this.fromAccountFlag = true;
    this.SelectedAccountValue(this.selectedAccObj);
    if(this.detailsFromAccount.CustomerBusinessUnit && this.detailsFromAccount.CustomerBusinessUnit.length == 1) {
      this.selectedCbu({ SysGuid:this.detailsFromAccount.CustomerBusinessUnit[0] ? this.detailsFromAccount.CustomerBusinessUnit[0].MapGuid : "", Name: this.detailsFromAccount.CustomerBusinessUnit[0] ? this.detailsFromAccount.CustomerBusinessUnit[0].Name : "" });
    }
     this.verticalValue = this.detailsFromAccount.Vertical ? this.detailsFromAccount.Vertical.Id : '';
     this.sbuForSave = this.detailsFromAccount.SBU ? this.detailsFromAccount.SBU.Id : '';
     this.projectService.setSession('sbuStoredValue', this.detailsFromAccount.SBU ? this.detailsFromAccount.SBU.Name : '');
     console.log("sbuValue on create", this.projectService.getSession('sbuStoredValue'));

     this.verticalMethod(this.verticalValue);
    this.oppRegionValue = this.detailsFromAccount.Region ? this.detailsFromAccount.Region.SysGuid : '';
    this.geoGuidForSave = this.detailsFromAccount.Geo ? this.detailsFromAccount.Geo.SysGuid : '';
    this.oppRegionMethod(this.oppRegionValue);
    if(this.detailsFromAccount.Currency) {
      this.currencyMethodSelect({ SysGuid: this.detailsFromAccount.Currency.Id, Name: this.detailsFromAccount.Currency.Value });
    }
    if(this.detailsFromAccount.CountryReference) {
      this.getCountrySelected({
        CountryName: this.detailsFromAccount.CountryReference.Name, SysGuid:this.detailsFromAccount.CountryReference.SysGuid });
    }
    if(this.detailsFromAccount.CountrySubDivisionReference) {
      this.selectedStateList({ SysGuid: this.detailsFromAccount.CountrySubDivisionReference.SysGuid, Name: this.detailsFromAccount.CountrySubDivisionReference.Name })
    }

    if(this.detailsFromAccount.CityRegionReference) {
      this.selectedCity({ SysGuid: this.detailsFromAccount.CityRegionReference.SysGuid, Name: this.detailsFromAccount.CityRegionReference.Name })
    }
  }
  //End of creation from account
   }

else {
  // this.isLoading = true;
  this.service.GetRedisCacheData('createOpportunity').subscribe(res => {
    debugger
    // this.isLoading = false
    if (!res.IsError) {
      if (res.ResponseObject) {
        this.appendTemplate(JSON.parse(res.ResponseObject));
        }
        }
      });
      this.showHideAccordion(this.simpleDeal);
}
    // digital big bets

    this.projectService.getDigitalBigBets().subscribe((res) => {

      if (!res.IsError) {
        this.digBigBets = res.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });

    // source

    this.projectService.getSource().subscribe((res) => {

      if (!res.IsError) {
        this.srcArray = res.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });

    // proposal type

    this.projectService.getProposalType().subscribe((res) => {

      if (!res.IsError) {
        this.proArray = res.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });

    this.getLeadSource();


  }


  serviceLineMethod(data) {
    this.pracAble = false;
    this.flagPactice = false
    this.engAble = false;
    this.serLineFlag = false;
    this.errorFlag = false;
    console.log("seldata", data);
    this.serviceLineGuId = data;
    this.subPracticeValue = "";
    this.subPractice = [];
    this.practice = [];
    this.practiceValue = "";
    this.slBdValue = "";
    this.wiproSlBdm = [];
    this.engModel = [];
    this.engagementModelValue = "";

    this.slbdmArrayForLookUp = [];
    this.selectedSlbdmObj = { SysGuid: "", Name: "" };
    this.slbdmName = '';
    this.slBdValue = '';
    this.appendRedisCache();
    this.serviceLinePracticeId = '';
    this.projectService.getPractice(data).subscribe((res) => {
      if (!res.IsError) {
        if (res.ResponseObject != null && res.ResponseObject.length > 0) {
          this.practice = res.ResponseObject;
          if(this.fromLeadFlag && this.detailsFromLead.ServiceLine && this.detailsFromLead.ServiceLine.length){
          this.practiceValue=this.detailsFromLead.ServiceLine[0].practice ? this.detailsFromLead.ServiceLine[0].practice.practiceGuid : '';
          if(this.practiceValue){
          this.practiceMethod(this.practiceValue);
          }
        }
          if (this.practice.length == 1) {
            this.practiceValue = this.practice[0].SysGuid;
            this.practiceMethod(this.practiceValue);

          }
          else {
            //cal slbdm lookup without practice id
            if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
              // this.slbdmDisable = false;
              this.reloadSLBDMData();
            }
            else {
              this.slbdmDisable = true;
            }
          }
        }
        else {
          this.projectService.displayMessageerror('Data not found for practice');
          this.flagPactice = true;
          this.flagSubPactice = true;
          this.subPraFlag = false;
          //cal slbdm lookup without practice id
          if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
            // this.slbdmDisable = false;
            this.reloadSLBDMData();
          }
          else {
            this.slbdmDisable = true;
          }
        }

      }
      else {
        this.projectService.displayMessageerror('Error occured in practice');
        //cal slbdm lookup without practice id
        if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
          // this.slbdmDisable = false;
          this.reloadSLBDMData();
        }
        else {
          this.slbdmDisable = true;
        }
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
      //cal slbdm lookup without practice id
      if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
        // this.slbdmDisable = false;
        this.reloadSLBDMData();
      }
      else {
        this.slbdmDisable = true;
      }
    });

    // engModelstarts

    this.projectService.getEngModel(this.serviceValue).subscribe((res) => {
      if (!res.IsError) {
        if (res.ResponseObject != null && res.ResponseObject.length > 0) {

          this.engModel = res.ResponseObject;
        }
        else {
          this.projectService.displayMessageerror('Data not found for Engagement Model,please reselect');
        }

      }
      else {
        this.projectService.displayMessageerror('Error occured in Engagement Model');
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });



  }

  practiceMethod(data) {
    this.subPracAble = false;
    this.flagSubPactice = false;
    this.pracFlag = false;
    console.log("seldata", data);
    this.serviceLinePracticeId = data;
    this.subPracticeValue = "";
    this.subPractice = [];
    this.appendRedisCache();

    this.projectService.getSubPractice(data).subscribe((res) => {
      if (!res.IsError) {
        if (res.ResponseObject != null && res.ResponseObject.length > 0) {
          this.subPractice = res.ResponseObject;
          this.subPractice.forEach(item => {
            (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
          })
          if (this.subPractice.length == 1) {
            this.subPracticeValue = this.subPractice[0].SubPracticeId;
            this.subPracticeMethod(this.subPracticeValue);
          }
        }
        else {
          // this.projectService.displayMessageerror('Data not found for Sub-practice');
          this.flagSubPactice = true;
          this.subPraFlag = false;
        }
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }

    }, (err) => {
      this.projectService.displayerror(err.status);
    });

    //cal slbdm lookup with practice id
    if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
      // this.slbdmDisable = false;
      this.reloadSLBDMData();
    }
    else {
      this.slbdmDisable = true;
    }
  }

  checkForLeadPopup(data) {
    if (data === 184450000 && !this.showIcon) {
      this.linkedLeadObj = {
        leadType: null,
        leadSourceId: null,
        leadSourceName: '',
        leadSrcDtlId: null,
        leadSrcDtlName: '',
        leadDtlId: null,
        leadDetails: '',
        comments: '',
        originatingLeadId: '',
        originatingLeadName: ''
    
      }
      this.openLeadPopup();
    }
  }
  onSourceChange(data) {
    this.srcNameFlag = false;
    this.linkedLeadErr = false;
    this.errorFlag = false;
    if (data != 184450000) {
      this.showIcon = false;
    }
     this.appendRedisCache();
  }


  onDigitalBigBetsChange(data) {
    this.dbbFlag = false;
    this.errorFlag = false;
     this.appendRedisCache();
  }

  projDur(data) {
    this.projDurFlag = false;
    this.errorFlag = false;
    if (data == 0) {
      this.projectDuiration = undefined;
      this.projectService.displayMessageerror('Project Duration cannot be Zero');
    }
  }

  estmRfi(data) {
    if (data == 0) {
      this.estRfiValue = "";
      this.projectService.displayMessageerror('Estimated RFI cannot be Zero');
    }
    else if (0 < data && data <= 9999) {
      this.rfiError = false;
      this.rfiFlagMatch = false;
    }
    else {
      this.rfiError = true;
      this.rfiFlagMatch = false;
    }
    if (this.tcvValue != undefined) {
      if (data <parseFloat(this.tcvValue)) {
        this.rfiMainCheck = false;
      }
    }
  }

  estmEmp(data) {

    if (data == 0) {
      this.estEmpValue = "";
      this.projectService.displayMessageerror('Estimated empanelment cannot be Zero');
    }
    else if (0 < data && data <= 9999) {
      this.empError = false;
      this.empFlagMatch = false;
    }
    else {
      this.empError = true;
      this.empFlagMatch = true;
    }
  }

  trimTCVValue() {
    if(!this.tcvValue) {
      this.tcvValue = "";
    }
    }

  trimRFIValue() {
    if(!this.estRfiValue) {
      this.estRfiValue = '';
    }
    if(!this.estEmpValue) {
      this.estEmpValue = '';
    }
  }
  tcvValidation(e) {
   this.tcvFlag = false;
    if (e.target.value) {
      if (!Number(e.target.value)) {
        this.tcvValue = null;
        e.target.value = "";
        this.tcvFlag = true;
        this.projectService.displayMessageerror("TCV cannot be 0")
      }
    }

    if (this.empMainCheck) {
      if (parseFloat(this.tcvValue) <= parseFloat(this.estEmpValue))
        this.tcvEmpCheck = false;
    }
    else if (this.rfiMainCheck) {
      if (parseFloat(this.tcvValue) <= parseFloat(this.estRfiValue))
        this.tcvRfiCheck = false;
    }
  }

  valueValidationEmpanelment(e) {
    this.empError = false;
    this.empFlagMatch = false;
    debugger;
    var n = parseFloat(e.target.value);
    if (e.target.value) {
      if (!Number(n)) {
        this.estEmpValue = "";
        e.target.value = "";
        this.empError = true;
        this.empFlagMatch = true;
        this.projectService.displayMessageerror("Estimated empanelment cannot be 0")
      }
    }

    if (this.empMainCheck) {
      if (parseFloat(this.tcvValue) <= parseFloat(this.estEmpValue))
        this.tcvEmpCheck = false;
    }
  }
  valueValidationRFI(e) {
    this.rfiError = false;
    this.rfiFlagMatch = false;
    var n = parseFloat(e.target.value);
    debugger;
    if (e.target.value) {
      if (!Number(n)) {
        this.estRfiValue = "";
        e.target.value = "";
        this.rfiError = true;
        this.rfiFlagMatch = true;
        this.projectService.displayMessageerror("Estimated RFI cannot be 0")
      }
    }
    if (this.rfiMainCheck) {
      if (parseFloat(this.tcvValue) <= parseFloat(this.estRfiValue))
        this.tcvRfiCheck = false;
    }
  }

  descMethod() {
    if (this.textDescription != "" && this.textDescription.replace(/\s/g, "").length > 0) {
      this.descriptionFlag = false;
    }
  }


  subPracticeMethod(data) {
    this.slbAble = false;
    this.subPraFlag = false;
    this.serviceLineSubPracticeId = data;
    this.appendRedisCache();
  }



  getAdvisorNameMethod(List) {
    
    let searchText = List.searchValue ? List.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "SearchType": 7,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.AdvisorName = [];
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getAdvisorName(obj).subscribe(response => {
      if (!response.IsError) {
        this.AdvisorName = response.ResponseObject;
        this.AdvisorName.forEach(x => {
          (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
        })
        this.lookupdata.TotalRecordCount = response.TotalRecordCount;
        this.lookupdata.nextLink = response.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }



  getAdvisorNameMethodSelected(SelectedAccount: Object) {
    this.advisorArrayForLookUp = [];
    this.adNameSelected = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.adNameSelected.Id = this.adNameSelected.SysGuid;
    this.adNameId = this.adNameSelected.SysGuid;
    this.adName = this.adNameSelected.Name;
    this.adOwnerName = this.adNameSelected.MapName;
    this.adOwnerId = this.adNameSelected.MapGuid;
    }
    else {
     this.adNameId ="";
    this.adName = "";
    this.adOwnerName = "";
    this.adOwnerId = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.advisorArrayForLookUp.push(SelectedAccount);
    }
    
    this.accOwnerFlag = false;
    if (this.adNameId) {
      this.advFlagVar = false;
      this.adContactName = "";
      this.adContactId = "";
      this.advNameFlag = false;
      let obj = {
        "SearchText": '',
        "Guid": this.adNameId,
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
     this.projectService.getContactList(obj).subscribe(contactList => {
        if (!contactList.IsError) {
          if(contactList.ResponseObject.length == 1) {
            this.advisorContactMethodSelected(contactList.ResponseObject[0]);
          }
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
    else {
      this.advFlagVar = true;
      this.advNameFlag = true;
    }
    if (this.noAdvisorId == this.adNameId) {
      this.advFlagVar = true;
    }
    this.appendRedisCache();
  }

  advanceLookUpSearch(lookUpData) {
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'Sap code': {
        this.selectedSapObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('SapCode', this.sapArray, lookUpData.inputVal);
        return
      }
      case 'Add advisor name': {
        this.adNameSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('AdvisorName', this.AdvisorName, lookUpData.inputVal)
        return
      }
      case 'Currency': {
        this.cuSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Currency', this.currency, lookUpData.inputVal)
        return
      }
      case 'Enter advisor contact': {
        this.advisorConObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('AdvisorContact', this.advisorContact, lookUpData.inputVal)
        return
      }
      case 'Enter primary customer contact': {
        this.selectedAccObj1 = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('PrimaryContact', this.wiproPrimaryCustomerContact, lookUpData.inputVal)
        return
      }
      case 'Enter_Owner': {
        this.verticalSalesOwObject = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Vertical_Owner', this.vertSalesOwner, lookUpData.inputVal)
        return
      }
      case 'SlBdmValue': {
        this.selectedSlbdmObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('SlBdmValue', this.wiproSlBdm, lookUpData.inputVal)
        return
      }
      case 'state': {
        this.selectedStateObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('state', this.acState, lookUpData.inputVal)
        return
      }
      case 'city': {
        this.selectedCityObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('city', this.acCity, lookUpData.inputVal)
        return
      }
      case 'country': {
        this.CountSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Contractingcountry', this.contractingCounrty, lookUpData.inputVal)
        return
      }

      case 'Enter account name': {
        this.selectedAccObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('account', this.wiproAccountName, lookUpData.inputVal)
        return
      }

      case 'Cbu': {
        this.selectedCbuObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('Cbu', this.cbuList, lookUpData.inputVal)
        return
      }
    }
  }
  showRequestSAP = false;
  sapMethod(data) {
    if (this.detailsId) {
      let searchText = data.searchValue ? data.searchValue : '';
      let obj = {
        "SearchText": searchText,
        "Id": this.detailsId,
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getSapCode(obj).subscribe(result => {
        if (!result.IsError) {
          this.sapArray = result.ResponseObject;
          if (this.sapArray.length > 0) {
            this.showRequestSAP = false;
            this.sapCodeDisabled = false;
            this.sapArray.map(data => {
              data.Id = data.SysGuid;
              (data.Name) ? data.Name = this.getSymbol(data.Name) : '-';
            })
          }
          else {
            if (searchText == '') {
              this.showRequestSAP = true;
              this.sapCodeDisabled = true
              this.getSAPCodeDetails();
            }
          }
          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = result.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror(result.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }
    else {
      this.projectService.displayMessageerror('Data not found,please select proper account');
    }
  }

  sapCodeDetails: any;
  getSAPCodeDetails() {
    this.projectService.getSAPCodeDetails({ "AccountId": this.detailsId }).subscribe(res => {
      if (!res.IsError) {
        this.sapCodeDetails = res.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });
  }

  AppointmentId: "";
  sapCodePlaceholder = 'Enter sap code';
  openSAPcode() {
    const dialogRef = this.dialog.open(SapPopupComponent, {
      width: '900px',
      data: this.sapCodeDetails
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.fileList.length > 0) {
          this.projectService.UploadSapCodeDoc({ "AccountId": this.detailsId, "SAPCODEPdfList": result.fileList }).subscribe(res => {
            if (!res.IsError) {
              console.log("appointent id", res);
              this.AppointmentId = res.ResponseObject.AppointmentId;
              let postObj = {
                "AccountId": this.detailsId,
                "AccountName": result.accountDetails.Name,
                "AccountOwner": result.accountDetails.OwnerName,
                "AccountNo": result.accountDetails.AccountNumber,
                "Geography": result.accountDetails.GeoName,
                "Opportunity_Won": "",
                "Vertical": result.accountDetails.VerticalName,
                "UserAddress": result.accountDetails.Address,
                "AppointmentId": this.AppointmentId,
                "Currency": result.accountDetails.TransactionCurrencyName,
                "value": [
                  {
                    "UserType": 3,
                    "UserId": this.userGuid       //Requester
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
                  this.sapCodePlaceholder = 'SAP code creation is in process';
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
        else {

        }

      }
    })
  }
  //advance look up code start
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: 'account',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    nextLink: '',
    selectedRecord: [],
    pageNo: 1,
    isLoader: false,
    casesensitive: false
  };
  IdentifyAppendFunc = {
    'SapCode': (data) => { this.sapSelected(data) },
    'AdvisorName': (data) => { this.getAdvisorNameMethodSelected(data) },
    'Currency': (data) => { this.currencyMethodSelect(data) },
    'AdvisorContact': (data) => { this.advisorContactMethodSelected(data) },
    'PrimaryContact': (data) => { this.SelectedPrimaryCustomerContact(data) },
    'Vertical_Owner': (data) => { this.vertcalSalesOwnMethod(data) },
    'DecisionMakers': (data) => { this.appendcontact(data) },
    'SlBdmValue': (data) => { this.selectedSLBDMValue(data) },
    'city': (data) => { this.selectedCity(data) },
    'state': (data) => { this.selectedStateList(data) },
    'Contractingcountry': (data) => { this.getCountrySelected(data) },
    'account': (data) => { this.SelectedAccountValue(data) },
    'Cbu': (data) => { this.selectedCbu(data) }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'DecisionMakers': {
        return (this.selectedContact.length > 0) ? JSON.parse(JSON.stringify(this.selectedContact)) : []
      }
      case 'SapCode': {
        return (this.sapArrayForLookUp && this.sapArrayForLookUp.length > 0) ? this.sapArrayForLookUp : []
      }
      case 'AdvisorName': {
        return (this.advisorArrayForLookUp && this.advisorArrayForLookUp.length > 0) ? this.advisorArrayForLookUp : []
      }
      case 'Currency': {
        return (this.currencyArrayForLookUp && this.currencyArrayForLookUp.length > 0) ? this.currencyArrayForLookUp : []
      }

      case 'AdvisorContact': {
        return (this.advisorContactArrayForLookUp && this.advisorContactArrayForLookUp.length > 0) ? this.advisorContactArrayForLookUp : []
      }
      case 'PrimaryContact': {
        return (this.primaryContactArrayForLookUp && this.primaryContactArrayForLookUp.length > 0) ? this.primaryContactArrayForLookUp : []
      }
      case 'Vertical_Owner': {
        return (this.verticalSalesArrayForLookUp && this.verticalSalesArrayForLookUp.length > 0) ? this.verticalSalesArrayForLookUp : []
      }

      case 'SlBdmValue': {
        return (this.slbdmArrayForLookUp && this.slbdmArrayForLookUp.length > 0) ? this.slbdmArrayForLookUp : []
      }
      case 'state': {
        return (this.stateArrayForLookUp && this.stateArrayForLookUp.length > 0) ? this.stateArrayForLookUp : []
      }
      case 'city': {
        return (this.cityArrayForLookUp && this.cityArrayForLookUp.length > 0) ? this.cityArrayForLookUp : []
      }
      case 'Contractingcountry': {
        return (this.countryArrayForLookUp && this.countryArrayForLookUp.length > 0) ? this.countryArrayForLookUp : []
      }
      case 'account': {
        return (this.accountArrayForlookup && this.accountArrayForlookup.length > 0) ? this.accountArrayForlookup : []
      }
      case 'Cbu': {
        return (this.cbuArrayForLookUp && this.cbuArrayForLookUp.length > 0) ? this.cbuArrayForLookUp : []
      }
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    debugger
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = opportunityAdvnHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let controlNameLoaded = x.objectRowData.controlName;
      debugger;
      if (x.action == 'loadMore') {
        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink;
          this.lookupdata.recordCount = res.PageSize;
          if (controlNameLoaded == "DecisionMakers") {
            this.customerDMaker = this.lookupdata.tabledata.concat(res.ResponseObject);
          }
        })

      } else if (x.action == 'search') {
        let tempLookupData = this.lookupdata.tabledata;
        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.recordCount = res.PageSize
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          if (controlNameLoaded == "DecisionMakers" && tempLookupData.length > 0) {
            this.customerDMaker = tempLookupData.concat(res.ResponseObject);
          }
          else {
            this.lookupdata.tabledata = res.ResponseObject;
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.AppendParticularInputDataFun(result.selectedData, result.controlName)
      }
    });
  }

  getCommonData() {
    return {
      accountId: this.detailsId,
      serviceLineId: this.serviceLineGuId,
      verticalId: this.verticalValue,
      Vertical: this.verticalValue,
      regionId: this.oppRegionValue,
      Id: this.detailsId,
      RegionidID: this.oppRegionValue,
      CbuId: this.cbuListValue,
      advisorSysGuid: this.adNameId,
      countryId: this.countId,
      stateId: this.stateId,
      sbuGuid: this.sbuForSave,
      geoGuid: this.geoGuidForSave,
      practiceId: this.practiceValue,
      geography: this.geoGuidForSave,
      WiproSbu: this.sbuForSave,
    }
  }

  AppendParticularInputDataFun(selectedData, controlName) {
    switch (controlName) {
      case 'SapCode': { this.sapArrayForLookUp = [] }
      case 'AdvisorName': { this.advisorArrayForLookUp = [] }
      case 'Currency': { this.currencyArrayForLookUp = [] }
      case 'AdvisorContact': { this.advisorContactArrayForLookUp = [] }
      case 'PrimaryContact': { this.primaryContactArrayForLookUp = [] }
      case 'Vertical_Owner': { this.verticalSalesArrayForLookUp = [] }
      case 'SlBdmValue': { this.slbdmArrayForLookUp = [] }
      case 'city': { this.cityArrayForLookUp = [] }
      case 'Contractingcountry': { this.countryArrayForLookUp = [] }
      case 'account': { this.accountArrayForlookup = [] }
      case 'Cbu': { this.cbuArrayForLookUp = [] }
      case 'DecisionMakers': { this.selectedContact = [] }
    }

    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }

  sapSelected(SelectedAccount: Object) {
    this.sapArrayForLookUp = [];
    this.selectedSapObj = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.selectedSapObj.Id = this.selectedSapObj.SysGuid;
      this.sapName = this.selectedSapObj.Name;
    this.sapId = this.selectedSapObj.SysGuid;
    }
    else {
      this.sapName = "";
      this.sapId = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.sapArrayForLookUp.push(SelectedAccount);
    }
    this.appendRedisCache();
    if (this.sapId) {
      this.sapFlag = false;
    }
    else {
      this.sapFlag = true;
    }
  }

  advisorContactMethod(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "Guid": this.adNameId,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
   this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.advisorContact = contactList.ResponseObject
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        this.lookupdata.nextLink = contactList.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(contactList.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }



  advisorContactMethodSelected(SelectedAccount: Object) {
    this.advisorContactArrayForLookUp = [];
    this.advisorConObj = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.adContactId = this.advisorConObj.SysGuid;
      this.adContactName = this.advisorConObj.Name
      this.advisorConObj.Id = this.advisorConObj.SysGuid;
    }
    else {
      this.adContactId = "";
      this.adContactName = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.advisorContactArrayForLookUp.push(SelectedAccount)
    }
    if (this.adContactId) {
      this.advContactFlag = false;
    }
    else {
      this.advContactFlag = true;
    }
     this.appendRedisCache();
  }

  getSymbol(data) {
    data = this.escapeSpecialChars(data);
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  escapeSpecialChars(jsonString) {
    return jsonString.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");

}

  currencyMethod(data) {
    debugger;
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
     this.projectService.getCurrencyData(obj).subscribe(result => {
      if (!result.IsError) {
        this.currency = result.ResponseObject;
        this.currency.forEach(x => {
          (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
          (x.Type) ? x.Type = this.getSymbol(x.Type) : '-';
        })
        this.lookupdata.TotalRecordCount = result.TotalRecordCount;
        this.lookupdata.nextLink = result.OdatanextLink;
        }
      else {
        this.projectService.displayMessageerror(result.Message);
      }
    },
      err => {
       this.projectService.displayerror(err.status);
      })
  }

  currencyMethodSelect(SelectedAccount: Object) {
    this.errorFlag = false;
    this.currencyArrayForLookUp = [];
    this.cuSelected = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.cuSelected.Id = this.cuSelected.SysGuid;
      this.cuName = this.cuSelected.Name;
      this.cuId = this.cuSelected.SysGuid;
    }
    else {
      this.cuName = "";
      this.cuId = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.currencyArrayForLookUp.push(SelectedAccount);
    }
   this.appendRedisCache();
    if (this.cuId) {
      this.curNameFlag = false;
    }
    else {
      this.curNameFlag = true;
    }
    this.projectService.getCurrencyStatus(this.cuId).subscribe(response => {
      if (!response.IsError) {
        this.currencyMultiplier = parseFloat(response.ResponseObject[0].Name);
        this.tcvMethod(this.tcvValue);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });

  }
  //country list API start*
  conCountryMethod(List) {
    let searchText = List.searchValue ? List.searchValue : '';
    var body = {
      "SearchText": searchText,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getCountryList(body).subscribe(Country => {
      if (!Country.IsError) {
        this.contractingCounrty = Country.ResponseObject;
        this.contractingCounrty.map(data => {
          data.Id = data.SysGuid;
          data.Name = data.CountryName;
        })
        this.lookupdata.TotalRecordCount = Country.TotalRecordCount;
        this.lookupdata.nextLink = Country.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(Country.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })


  }
  //country list API end*
showStateMandt = true;
  getCountrySelected(SelectedAccount: Object) {
    this.countryArrayForLookUp = [];
    this.acState = [];
    this.stateName = "";
      this.stateId = "";
      this.stateArrayForLookUp = [];
      this.selectedStateObj = { SysGuid: "", Name: "" };
    this.acCity = [];
    this.cityName = "";
    this.cityId = "";
    this.cityArrayForLookUp = [];
    this.selectedCityObj = { SysGuid: "", Name: "" };
    this.CountSelected = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.CountSelected.Name = this.CountSelected.CountryName;
      this.countName = this.CountSelected.CountryName;
      this.countId = this.CountSelected.SysGuid;
    }
    else {
      this.countName = "";
      this.countId = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.countryArrayForLookUp.push(this.CountSelected)
    }
    this.appendRedisCache();
    if (this.countId) {
      this.countryFlag = false;
      var obj = {
        "SearchText": '',
        "Id": this.countId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getStateList(obj).subscribe(state => {
        if (!state.IsError) {
          this.acState = state.ResponseObject;
          if(this.acState.length > 0) {
            this.acState.map(data => {
              data.Id = data.SysGuid;
            })
            if (this.acState.length == 1) {
              // this.stateId = this.acState[0].SysGuid;
              this.selectedStateList(this.acState[0]);
            }
            this.scFlag = true;
            if (this.countId && (this.countName == "INDIA" || this.countName == "UNITED KINGDOM" || this.countName == "USA"
              || this.countName == "United States" || this.countName == "UK" || this.countName == "India"
              || this.countName == "United Kingdom" || this.countName == "UNITED STATES")) {
              this.showStateMandt = true;
            }
            else {
              this.showStateMandt = false;
              this.stateNameFlag = false;
            }
          }
          else {
            this.scFlag = false;
            this.noCityFlag = true;
            this.stateId = "";
            this.cityId = "";
            this.stateNameFlag = false;
            this.showStateMandt = false;
          }
          
          this.lookupdata.TotalRecordCount = state.TotalRecordCount;
          this.lookupdata.nextLink = state.OdatanextLink;
          }
        else {
          this.projectService.displayMessageerror(state.Message);
           }
      },
        err => {
          this.projectService.displayerror(err.status);
         })
    }
    else {
      this.countryFlag = true;
      this.scFlag = false;
      this.stateNameFlag = false;
      this.showStateMandt = false;
    }
    this.errorFlag = false;

  }

  getStateList(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    var obj = {
      "SearchText": searchText,
      "Id": this.countId,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getStateList(obj).subscribe(state => {
      if (!state.IsError) {
        this.acState = state.ResponseObject;
        this.acState.map(data => {
          data.Id = data.SysGuid;
        })
        // if (this.acState.length == 1) {
        //   this.stateId = this.acState[0].SysGuid;
        // }
        this.lookupdata.TotalRecordCount = state.TotalRecordCount;
        this.lookupdata.nextLink = state.OdatanextLink;
        }
      else {
        this.projectService.displayMessageerror(state.Message);
         }
    },
      err => {
        this.projectService.displayerror(err.status);
       })
  }

  //selected state
  selectedStateList(stateObject: Object) {
    this.stateArrayForLookUp = [];
    this.selectedStateObj = Object.keys(stateObject).length ? stateObject : { SysGuid: "", Name: "" };
    if (stateObject && typeof stateObject === 'object' && Object.keys(stateObject).length) {
      this.stateName = this.selectedStateObj.Name;
    this.stateId = this.selectedStateObj.SysGuid;
    this.selectedStateObj.Id = this.selectedStateObj.SysGuid
    }
    else {
      this.stateName = "";
      this.stateId = "";
    }
    if (Object.keys(stateObject).length) {
      this.stateArrayForLookUp.push(this.selectedStateObj)
    }
     this.appendRedisCache();
    if (this.stateId) {
      this.stateNameFlag = false;
    }
    else {
      this.stateNameFlag = true;
    }
    
    this.acCity = [];
    this.cityName = "";
      this.cityId = "";
      this.cityArrayForLookUp = [];
      this.selectedCityObj = { SysGuid: "", Name: "" };
    //get city list
    var obj = {
      "SearchText": '',
      "Id": this.stateId,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getCityList(obj).subscribe(city => {
      if (!city.IsError) {
        if (city.ResponseObject != null && city.ResponseObject.length > 0) {
          this.acCity = city.ResponseObject;
          this.noCityFlag = false
          // this.cityNameFlag = true;
          if (this.acCity.length == 1) {
            this.selectedCity(this.acCity[0]);
          }
        }
        else {
          this.noCityFlag = true;
          this.cityNameFlag = false
         }
      }
      else {
        this.projectService.displayMessageerror(city.Message);
       }
    },
      err => {
        this.projectService.displayerror(err.status);
        })
  }

  selectedCity(cityObject: Object) {
    debugger;
    this.cityArrayForLookUp = [];
    this.selectedCityObj = Object.keys(cityObject).length ? cityObject : { SysGuid: "", Name: "" };
    if (cityObject && typeof cityObject === 'object' && Object.keys(cityObject).length) {
      this.cityName = this.selectedCityObj.Name;
      this.cityId = this.selectedCityObj.SysGuid;
      this.selectedCityObj.Id = this.selectedCityObj.SysGuid
    }
    else {
      this.cityName = "";
      this.cityId = "";

    }
    if (Object.keys(cityObject).length) {
      this.cityArrayForLookUp.push(this.selectedCityObj)
    }
     this.appendRedisCache();
    if (this.cityId) {
      this.cityNameFlag = false;
    }
    else {
      this.cityNameFlag = true;
    }
  }

  getCityList(data) {
    if (this.stateId) {
      let searchText = data.searchValue ? data.searchValue : '';
      var obj = {
        "SearchText": searchText,
        "Id": this.stateId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.acCity = [];
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getCityList(obj).subscribe(city => {
        if (!city.IsError) {
          this.acCity = city.ResponseObject;
          this.lookupdata.TotalRecordCount = city.TotalRecordCount;
          this.lookupdata.nextLink = city.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror(city.Message);
         }
      },
        err => {
          this.projectService.displayerror(err.status);
           })
    }
  }
  //city api end*
  //DM contact API start*
  customerDMakerMethod(data) {
    debugger;
    let searchText = data.target ? data.target.value : data;
    let obj = {
      "SearchText": searchText,
      "SearchType": 1,
      "Guid": this.detailsId,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
      this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.customerDMaker = contactList.ResponseObject;
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        if (this.fromLeadFlag) {
          if (this.detailsFromLead.CustomerContacts && this.detailsFromLead.CustomerContacts.length) {
            this.detailsFromLead.CustomerContacts.map(data => {
              data.Name=data.FullName;
              data.SysGuid=data.Guid;
              this.appendcontact(data);
            })
          }
        }
      }
      else {
        this.projectService.displayMessageerror('Error occured while fetching data');
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }
  //DM contact API end*

  customerDMakerObj: any = { SysGuid: "", Name: "" };
  customerDMakerName: string = "";
  customerDMakerId: string = "";
  customerDMakerSelected(SelectedAccount: Object) {
    this.customerDMakerObj = SelectedAccount;
    this.customerDMakerId = this.customerDMakerObj.SysGuid
    this.customerDMakerName = this.customerDMakerObj.Name
  }

  verticalSalesOwMethod(data) {
    if (data != "") {
      let searchText = data.searchValue ? data.searchValue : '';
      let obj = {
        "SearchText": searchText,
        "VerticalID": this.verticalValue,
        "RegionidID": this.oppRegionValue,
        "GEOGuid": this.geoGuidForSave,
        "SBUGuid": this.sbuForSave,
        "Guid" : this.detailsId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
        if (!verticalSalesData.IsError) {
          this.vertSalesOwner = verticalSalesData.ResponseObject;
          this.vertSalesOwner.map(data => {
            data.Id = data.UserId;
            data.Name = data.UserName;
          })
          this.lookupdata.TotalRecordCount = verticalSalesData.TotalRecordCount;
          this.lookupdata.nextLink = verticalSalesData.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror(verticalSalesData.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }
  }

  vertcalSalesOwnMethod(SelectedAccount: Object) {
    this.verticalSalesArrayForLookUp = [];
    this.verticalSalesOwObject = Object.keys(SelectedAccount).length ? SelectedAccount : { UserId: "", UserName: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.verSaOwName = this.verticalSalesOwObject.UserName;
    this.verSaOwId = this.verticalSalesOwObject.UserId;
    this.verticalSalesOwObject.Id = this.verticalSalesOwObject.UserId;
    }
    else {
      this.verSaOwName = "";
      this.verSaOwId = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.verticalSalesArrayForLookUp.push(SelectedAccount);
    }
    this.appendRedisCache();
    if (this.verSaOwId) {
      this.vsoNameFlag = false;
    }
    else {
      this.vsoNameFlag = true;
    }
   }

  cbuListMethod(data) {
    this.cbuNameFlag = false;
    this.errorFlag = false;
    this.cbuListValue = data;
  }

  getAccountNameData(data) {
    if (data != "") {
      let body =
        {
          "SearchText": data.searchValue ? data.searchValue : '',
          "PageSize": 10,
          "RequestedPageNumber": 1,
          "OdatanextLink": ""
        }
        this.lookupdata.TotalRecordCount = 0;
      this.projectService.getAccountSearchData(body).subscribe(response => {
        if (!response.IsError) {
          this.wiproAccountName = response.ResponseObject
          this.wiproAccountName.forEach(item => {
            (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
            item.subContent =  [{"AccountNUmber":item.SysNumber},{"OwnerName":item.OwnerName}];
          })
          this.lookupdata.TotalRecordCount = response.TotalRecordCount
          this.lookupdata.nextLink = response.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror('Error occured while fetching data');
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });

    }
  }

  primayCustomerContact(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "Guid": this.detailsId,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.wiproPrimaryCustomerContact = contactList.ResponseObject
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        this.lookupdata.nextLink = contactList.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror('Error occured while fetching data');
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });

  }

  reloadSLBDMData() {
    let body = {
      "SBUGuid": this.sbuForSave,
      "ServiceLineID": this.serviceLineGuId,
      "GEOGuid": this.geoGuidForSave,
      "VerticalID": this.verticalValue,
      "PracticeID": this.practiceValue,
      "RegionidID": this.oppRegionValue,
      "SearchText": "",
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getSLBDMDataAPI(body).subscribe(slbdmList => {
      if (!slbdmList.IsError) {
        this.slbdmDisable = false;
        this.wiproSlBdm = slbdmList.ResponseObject
        if(this.fromLeadFlag && Object.keys(this.detailsFromLead.ServiceLine[0].SLBDM)) {
          this.slbdmName=this.detailsFromLead.ServiceLine[0].SLBDM.Name?this.detailsFromLead.ServiceLine[0].SLBDM.Name:'';
       this.slBdValue=this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid?this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid:'';
        }
        if (this.wiproSlBdm.length == 0) {
          var message = 'No records found for SL BDM! Could you raise a Helpline ticket?';
          this.projectService.displayMessageerror(message);
        }
        else if (this.wiproSlBdm.length == 1) {
          this.slbdmDisable = true;
          this.slBdValue = this.wiproSlBdm[0].SysGuid;
          this.selectedSLBDMValue(this.wiproSlBdm[0]);
        }
        this.lookupdata.TotalRecordCount = slbdmList.TotalRecordCount;
        this.lookupdata.nextLink = slbdmList.OdatanextLink;
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });

  }
  getSLBDMData(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let body = {
      "SBUGuid": this.sbuForSave,
      "ServiceLineID": this.serviceLineGuId,
      "GEOGuid": this.geoGuidForSave,
      "VerticalID": this.verticalValue,
      "PracticeID": this.practiceValue,
      "RegionidID": this.oppRegionValue,
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getSLBDMDataAPI(body).subscribe(slbdmList => {
      if (!slbdmList.IsError) {
        this.wiproSlBdm = slbdmList.ResponseObject
        this.lookupdata.TotalRecordCount = slbdmList.TotalRecordCount;
        this.lookupdata.nextLink = slbdmList.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror('Error occured while fetching data');
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  sapCodeDisabled = true;
  cbuDisabled = true;
  currencyDisabled = true;
  vsoDisabled = true;
  dmakerDisabled = true;
  primaryCustDisabled = true;
  agpDisabled = true;
  slbdmDisable = true;
  slDisabled = true;
  sourceDisabled = true;
  verticalResponse = false;
  regionResponse = false;
  SelectedAccountValue(SelectedAccount) {
    debugger;
    this.errorFlag = false;
    this.advNameFlagVar = false;
    this.selectedAccObj = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.selectedAccObj.Id = this.selectedAccObj.SysGuid;
      this.detailsId = this.selectedAccObj.SysGuid;
      this.details = this.selectedAccObj.Name;
      }
    else {
      this.detailsId = "";
      this.details = "";
    }
    this.accountArrayForlookup = [];
    if (Object.keys(SelectedAccount).length) {
      this.accountArrayForlookup.push(this.selectedAccObj);
    }
    this.cuName = "";
    this.cuId = "";
    this.currencyArrayForLookUp = [];
    this.cuSelected = { SysGuid: "", Name: "" };
    if (this.detailsId) {
      this.appendRedisCache();
      this.cbuDisabled = false;
      this.dmakerDisabled = false;
      this.primaryCustDisabled = false;
      this.agpDisabled = false;
      // this.verticalAble = false;
      this.accNameFlag = false;
      this.oppRegAble = false;
      this.sourceDisabled = false;
      this.currencyDisabled = false;
      if(SelectedAccount && SelectedAccount.CurrencyId)
          this.currencyMethodSelect({ SysGuid: SelectedAccount.CurrencyId, Name: SelectedAccount.CurrencyName ? this.getSymbol(SelectedAccount.CurrencyName) : '-' })
    }
    else {
      this.sapCodeDisabled = true;
      this.cbuDisabled = true;
      this.dmakerDisabled = true;
      this.primaryCustDisabled = true;
      this.agpDisabled = true;
      this.verticalAble = true;
      if(!this.clearClicked)
      {
        this.accNameFlag = true;
      }
       
      this.oppRegAble = true;
      this.sourceDisabled = true;
      this.slDisabled = true;
      this.currencyDisabled = true;
    }
    this.sapName = "";
    this.sapId = "";
    this.selectedSapObj = { SysGuid: "", Name: "" };
    this.acVertical = [];
    this.verticalValue = "";
    this.acRegion = [];
    this.oppRegionValue = "";
    //bug fix
    this.cbuList = [];
    this.cbuListValue = "";
    this.cbuName = "";
    this.selectedCbuObj = { SysGuid: "", Name: "" };
    this.vertSalesOwner = [];
    this.verSaOwName = "";
    this.verSaOwId = "";
    this.detailsId1 = "";
    this.details1 = "";
    this.customerDMaker = [];
    this.selectedContact = [];
    this.viewflag = false;
    this.commonFlag = false;
    this.dctFlag = false;

    //clear source value
    this.sourceValue = null;
    this.linkedLeadErr = false;
    this.showIcon = false;
    
    //clear SL, Practice & Sub-practice selected earlier
    this.serviceValue = "";
    this.serviceLine = [];
    this.subPracticeValue = "";
    this.subPractice = [];
    this.practice = [];
    this.practiceValue = "";
    this.slBdValue = "";
    this.wiproSlBdm = [];
    this.engModel = [];

    this.pracAble = true;
    this.flagPactice = true;
    this.subPracAble = true;
    this.flagSubPactice = true;
    this.engAble = true;
    this.serLineFlag = false;
    this.slDisabled = true;
    this.slbdmDisable = true;
    this.slBdValue = "";
    this.wiproSlBdm = [];
    this.engModel = [];
    this.engagementModelValue = "";

    this.slbdmArrayForLookUp = [];
    this.selectedSlbdmObj = { SysGuid: "", Name: "" };
    this.slbdmName = '';
    this.serviceLinePracticeId = '';
    //bug fix end

    if (this.detailsId) {
      this.projectService.getAccountNameOnSelect(this.detailsId, this.userGuid).subscribe(response => {
        this.wiproLinkedAGPArray = [];
        if (!response.IsError) {
          this.verticalResponse = true;
          if (response.ResponseObject != null) {
            this.acVertical = response.ResponseObject.Vertical;
            this.verticalAble = false;
            if (this.acVertical.length == 1) {
              this.verticalAble = true;
            }
            if (this.acVertical.length == 1 && !this.fromLeadFlag && this.verticalValue =='' && !this.fromAutoSave) {
              this.verticalValue = this.acVertical[0].SysGuid;
              this.verticalMethod(this.verticalValue);
            }
            else{
              if(this.verticalValue && this.fromLeadFlag){
              this.verticalMethod(this.verticalValue);
              }  
            }
            this.sbuName = response.ResponseObject.SBU.SysGuid;
            this.sbuMatch = response.ResponseObject.ENUSBUId;
            this.noAdvisorId = response.ResponseObject.NoAdvisorId;

            this.projectService.setSession('sbuStoredValue',response.ResponseObject.SBU.Name);
            console.log("sbuValue on create", this.projectService.getSession('sbuStoredValue'));

            if (this.sbuName == this.sbuMatch) {

              this.commonFlag = true;
              this.dctFlag = true;
            }
            const sbuids = response.ResponseObject.IndiaSBUId.split(',');
            console.log("sbuids", sbuids)
            for (var i = 0; i < sbuids.length; i++) {
              if (this.sbuName == sbuids[i]) {
                this.viewflag = true;
              }
            }
            this.countryName = response.ResponseObject.Country[0].Name;
            this.countryId = response.ResponseObject.Country[0].SysGuid;
          }
          else {
            this.projectService.displayMessageerror('Data not found for Account Name');
          }

          if(this.verticalResponse && this.regionResponse) {
            this.fromAutoSave = false;
          }
        }
        else {
          this.projectService.displayMessageerror('Error occured while fetching data');
        }
      }, (err) => {
        this.projectService.displayerror(err.status);
      });
      // }
      var obj = {
        "SearchText": "",
        "AccountId": this.detailsId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getCBUData(obj).subscribe(CBUData => {
        if (!CBUData.IsError) {
          if (CBUData.ResponseObject != null && CBUData.ResponseObject.length > 0) {
            this.cbuList = CBUData.ResponseObject;
            this.cbuList.map(data => {
              data.Id = data.SysGuid;
            })
            if (this.cbuList.length == 1) {
              this.selectedCbu(this.cbuList[0]);
            }
          }
          else {
            this.projectService.displayMessageerror('Data not found for CBU');
          }
          this.lookupdata.TotalRecordCount = CBUData.TotalRecordCount;
          this.lookupdata.nextLink = CBUData.OdatanextLink;
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
      //region api start
      this.projectService.getRegionList(this.detailsId).subscribe(regionList => {
        this.acRegion = regionList.ResponseObject ? regionList.ResponseObject : [];
       this.regionResponse = true;
        if (this.acRegion.length == 1 && !this.fromAutoSave) {
          debugger;
          this.oppRegionValue = this.acRegion[0].RegionId;
          this.oppRegionMethod(this.oppRegionValue);
        }
        if(this.verticalResponse && this.regionResponse) {
          this.fromAutoSave = false;
        }
      })
      //regionapi end
      // call sap data
      let obj1 = {
        "SearchText": "",
        "Id": this.detailsId,
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
      this.sapArray = [];
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getSapCode(obj1).subscribe(result => {
        if (!result.IsError) {
          this.sapArray = result.ResponseObject;
          if (this.sapArray.length > 0) {
            this.showRequestSAP = false;
            // this.sapCodeDisabled = false;
            this.sapArray.map(data => {
              data.Id = data.SysGuid;
              (data.Name) ? data.Name = this.getSymbol(data.Name) : '-';
            })
            if (this.sapArray.length == 1) {
              this.sapCodeDisabled = true;
              this.sapSelected(this.sapArray[0]);
            }
            else {
              this.sapCodeDisabled = false;
            }
          }
          else {
            this.showRequestSAP = true;
            this.sapCodeDisabled = true;
            this.getSAPCodeDetails();
          }

          this.lookupdata.TotalRecordCount = result.TotalRecordCount;
          this.lookupdata.nextLink = result.OdatanextLink;
        }
        },
        err => {
          this.projectService.displayerror(err.status);
        })

      this.projectService.getWiproAGPData(this.detailsId).subscribe(response => {

        if (!response.IsError) {
          this.wiproLinkedAGPArray = response.ResponseObject;
        }
      }, (err) => {
        this.projectService.displayerror(err.status);
      });

      //get decision maker data
      let obj2 = {
        "SearchText": '',
        "SearchType": 1,
        "Guid": this.detailsId,
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getContactList(obj2).subscribe(contactList => {
        if (!contactList.IsError) {
          this.customerDMaker = contactList.ResponseObject;
          if (this.customerDMaker.length == 1) {
            this.appendcontact(this.customerDMaker[0]);
          }
          this.lookupdata.nextLink = contactList.OdatanextLink;
          this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });

      let obj3 = {
        "SearchText": '',
        "Guid": this.detailsId,
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getContactList(obj3).subscribe(contactList => {
        if (!contactList.IsError) {
          this.wiproPrimaryCustomerContact = contactList.ResponseObject
          if (this.wiproPrimaryCustomerContact.length == 1) {
            this.SelectedPrimaryCustomerContact(this.wiproPrimaryCustomerContact[0])
          }
          this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
          this.lookupdata.nextLink = contactList.OdatanextLink;
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
  }

  getCBUList(data) {
    debugger;
    if (this.detailsId) {

      let searchText = data.searchValue ? data.searchValue : '';
      var obj = {
        "SearchText": searchText,
        "AccountId": this.detailsId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getCBUData(obj).subscribe(CBUData => {
        if (!CBUData.IsError) {
          this.cbuList = CBUData.ResponseObject;
          this.cbuList.map(data => {
            data.Id = data.SysGuid;
          })
          this.lookupdata.TotalRecordCount = CBUData.TotalRecordCount;
          this.lookupdata.nextLink = CBUData.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror(CBUData.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
      //CBU API end*
    }
    else {
      this.projectService.displayMessageerror('Please select account name');
    }
  }

  selectedCbu(cbuObject: Object) {
    this.cbuArrayForLookUp = [];
    this.selectedCbuObj = Object.keys(cbuObject).length ? cbuObject : { SysGuid: "", Name: "" };
    if (cbuObject && typeof cbuObject === 'object' && Object.keys(cbuObject).length) {
      this.selectedCbuObj.Id = this.selectedCbuObj.SysGuid;
      this.cbuName = this.selectedCbuObj.Name;
    this.cbuListValue = this.selectedCbuObj.SysGuid;
    }
    else {
      this.cbuName = "";
    this.cbuListValue = "";
    }
    if (Object.keys(cbuObject).length) {
      this.cbuArrayForLookUp.push(cbuObject);
    }
     this.appendRedisCache();
    if (this.cbuListValue) {
      this.cbuNameFlag = false;
    }
    else {
      this.cbuNameFlag = true;
    }
    this.errorFlag = false;
  }

  SelectedPrimaryCustomerContact(SelectedAccount: Object) {
   
    this.errorFlag = false;
    this.primaryContactArrayForLookUp = [];
    this.selectedAccObj1 = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.detailsId1 = this.selectedAccObj1.SysGuid;
      this.details1 = this.selectedAccObj1.Name;
      this.selectedAccObj1.Id = this.selectedAccObj1.SysGuid;
    }
    else {
      this.detailsId1 = "";
      this.details1 = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.primaryContactArrayForLookUp.push(SelectedAccount);
    }
    if (this.detailsId1) {
      this.priCustFlag = false;
    }
    else {
      this.priCustFlag = true;
    }

    this.appendRedisCache();
    console.log("Selected Account1", this.selectedAccObj1);
  }

  selectedSLBDMValue(SelectedAccount: Object) {
    this.slbdmArrayForLookUp = [];
    this.selectedSlbdmObj = Object.keys(SelectedAccount).length ? SelectedAccount : { SysGuid: "", Name: "" };
    if (SelectedAccount && typeof SelectedAccount === 'object' && Object.keys(SelectedAccount).length) {
      this.slBdValue = this.selectedSlbdmObj.SysGuid;
      this.slbdmName = this.selectedSlbdmObj.Name;
      this.selectedSlbdmObj.Id = this.selectedSlbdmObj.SysGuid;
    }
    else {
      this.slBdValue = "";
      this.slbdmName = "";
    }
    if (Object.keys(SelectedAccount).length) {
      this.slbdmArrayForLookUp.push(SelectedAccount);
    }

    this.appendRedisCache();
    if (this.slBdValue) {
      this.slBdmFlag = false;
    }
    else {
      this.slBdmFlag = true;
    }
  }

  engMoMethod() {
    this.enModFlag = false;
     this.appendRedisCache();
  }

  verticalMethod(data) {
    this.verNameFlag = false;
    this.sbuMapGuid = this.acVertical.filter(x => x.SysGuid == data);
    if(this.sbuMapGuid.length > 0)
      this.sbuForSave = this.sbuMapGuid[0].MapGuid;
        this.appendRedisCache();
    this.vertSalesOwner = [];
    this.verticalSalesArrayForLookUp = [];
    this.verticalSalesOwObject = { UserId: "", UserName: "" };
    this.verSaOwName = "";
    this.verSaOwId = "";
    this.vsoDisabled = true;
    if (this.detailsId && this.oppRegionValue && this.verticalValue) {
      // this.vsoDisabled = false;
      let obj = {
        "SearchText": "",
        "VerticalID": this.verticalValue,
        "RegionidID": this.oppRegionValue,
        "GEOGuid": this.geoGuidForSave,
        "SBUGuid": this.sbuForSave,
        "Guid": this.detailsId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
        if (!verticalSalesData.IsError) {
          this.vertSalesOwner = verticalSalesData.ResponseObject;
          this.vertSalesOwner.map(data => {
            data.Id = data.UserId;
            data.Name = data.UserName;
          })
          if (this.vertSalesOwner.length == 1) {
            this.vertcalSalesOwnMethod(this.vertSalesOwner[0]);
          }
          else if(this.vertSalesOwner.length == 0) {
            this.vertcalSalesOwnMethod({UserName: this.selectedAccObj.OwnerName, UserId: this.selectedAccObj.OwnerId})
          }
          else {
            this.vsoDisabled = false;
          }
          this.lookupdata.TotalRecordCount = verticalSalesData.TotalRecordCount;
          this.lookupdata.nextLink = verticalSalesData.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror('Error occured,please select proper account');
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }

    this.slDisabled = true;
    this.serviceValue = "";
    this.serviceLine = [];
    this.subPracticeValue = "";
    this.subPractice = [];
    this.practice = [];
    this.practiceValue = "";
    this.slBdValue = "";
    this.wiproSlBdm = [];
    this.engModel = [];
    this.engagementModelValue = "";
    this.serviceLineGuId = "";
    this.projectService.getServiceLine(this.sbuForSave).subscribe((res) => {
      if (!res.IsError) {
        this.slDisabled = false;
        if(this.fromLeadFlag && this.detailsFromLead.ServiceLine && this.detailsFromLead.ServiceLine.length){
          this.serviceValue = this.detailsFromLead.ServiceLine[0].Guid ? this.detailsFromLead.ServiceLine[0].Guid : '';
          this.serviceLineGuId = this.serviceValue;
          this.practiceValue=this.detailsFromLead.ServiceLine[0].practice ? this.detailsFromLead.ServiceLine[0].practice.practiceGuid : '';
          if(Object.keys(this.detailsFromLead.ServiceLine[0].SLBDM)){
            this.slbdmName=this.detailsFromLead.ServiceLine[0].SLBDM.Name?this.detailsFromLead.ServiceLine[0].SLBDM.Name:'';
            this.slBdValue=this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid?this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid:'';
           }
          }
        this.serviceLine = res.ResponseObject;
        this.serviceLine = this.serviceLine.filter(it => it.IsVisible == true);
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });

  }

  oppRegionMethod(data) {
    this.oppRegNameFlag = false;
    this.geoGuid = this.acRegion.filter(x => x.RegionId == data);
    if(this.geoGuid.length > 0) {
      this.geoGuidForSave = this.geoGuid[0].ParentGeographyId;
    }
        this.appendRedisCache();
    this.vertSalesOwner = [];
    this.verticalSalesArrayForLookUp = [];
    this.verticalSalesOwObject = { UserId: "", UserName: "" };
    this.verSaOwName = "";
    this.verSaOwId = "";
    this.vsoDisabled = true;
    this.slbdmArrayForLookUp = [];
    this.selectedSlbdmObj = { SysGuid: "", Name: "" };
    this.slbdmName = '';
    this.slBdValue = '';
    if (this.detailsId && this.oppRegionValue && this.verticalValue) {
      // this.vsoDisabled = false;
      let obj = {
        "SearchText": "",
        "VerticalID": this.verticalValue,
        "RegionidID": this.oppRegionValue,
        "GEOGuid": this.geoGuidForSave,
        "SBUGuid": this.sbuForSave,
        "Guid": this.detailsId,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
        if (!verticalSalesData.IsError) {
          this.vertSalesOwner = verticalSalesData.ResponseObject;
          this.vertSalesOwner.map(data => {
            data.Id = data.UserId;
            data.Name = data.UserName;
          })
          if (this.vertSalesOwner.length == 1) {
            this.vertcalSalesOwnMethod(this.vertSalesOwner[0]);
          }
          else if(this.vertSalesOwner.length == 0) {
            this.vertcalSalesOwnMethod({UserName: this.selectedAccObj.OwnerName, UserId: this.selectedAccObj.OwnerId})
          }
          else {
            this.vsoDisabled = false;
          }
          this.lookupdata.TotalRecordCount = verticalSalesData.TotalRecordCount;
          this.lookupdata.nextLink = verticalSalesData.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror('Error occured,please select proper account');
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }

  
    if (this.serviceLineGuId && this.verticalValue && this.oppRegionValue) {
      // this.slbdmDisable = false;
      this.reloadSLBDMData();
    }
    else {
      this.slbdmDisable = true;
      if(this.fromLeadFlag && this.detailsFromLead.ServiceLine.length && Object.keys(this.detailsFromLead.ServiceLine[0].SLBDM)){
       this.slbdmName=this.detailsFromLead.ServiceLine[0].SLBDM.Name?this.detailsFromLead.ServiceLine[0].SLBDM.Name:'';
       this.slBdValue=this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid?this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid:'';
      }
    }
  }

  clickCreate() {
    this.proposalSubmissionDate = null;
    this.proposalSubmissionDateControl.setValue(null);
    this.ServiceDetails = true;
    this.Creatediv = true;
    this.Securediv = false;
    this.Qualifydiv = false;
    this.Simplediv = false;
    this.CreatedivHidden = false;
    this.CreatedivShow = true;
    this.QualifydivHidden = true;
    this.QualifydivShow = false;
    this.Pursuithidden = false;
    this.Pursuitshow = true;
    this.Securehidden = false;
    this.Secureshow = true;
    this.NoSelectbtn = true;
    this.stageSelected = 184450000;
    this.countName = "";
    this.countId = "";
    this.stateId = "";
    this.cityId = "";
    this.createNotReq = false;
    this.cbuNameFlag = false; // cbu non mandt for create stage
    this.appendRedisCache();
    this.clearErrorFlags();
  }
  clickQualify() {
    this.proposalSubmissionDate = null;
    this.proposalSubmissionDateControl.setValue(null);
    this.NoSelectbtn = true;
    this.Creatediv = false;
    this.Securediv = false;
    this.Qualifydiv = true;
    this.Simplediv = false;
    this.Pursuithidden = false;
    this.Pursuitshow = true;
    this.Securehidden = false;
    this.Secureshow = true;
    this.CreatedivHidden = true;
    this.CreatedivShow = false;
    this.QualifydivHidden = false;
    this.QualifydivShow = true;
    this.ServiceDetails = true;
    this.stageSelected = 184450001;
    this.createNotReq = true;
    if (this.errorFlag) {
      this.cbuNameFlag = true;
    }
     this.appendRedisCache();
     this.clearErrorFlags();
  }


  showHideAccordion(data) {
    console.log("changedata", data);
    this.stageSelected = 184450002;
    if (data == true) {
      this.showDivision = false;
      this.Creatediv = false;
      this.Qualifydiv = false;
      this.Securediv = false;
      this.Simplediv = true;
      this.NoSelectbtn = true;
      this.tcvValue = null;
      this.tcvSaveCheck = false;
      this.ServiceDetails = true;
    } else {
      this.showDivision = true;
      this.Simplediv = false;
      this.ServiceDetails = false;
      this.NoSelectbtn = false;
      this.CreatedivShow = false;
      this.CreatedivHidden = true;
      this.Pursuithidden = false;
      this.Pursuitshow = true;
      this.Securehidden = false;
      this.Secureshow = true;
      this.QualifydivHidden = true;
      this.QualifydivShow = false;
      this.Qualifydiv = false;
    }
    this.clearErrorFlags();
  }
  clickPursuit() {
    this.Creatediv = false;
    this.Qualifydiv = false;
    this.Securediv = false;
    this.Simplediv = true;
    this.CreatedivHidden = true;
    this.CreatedivShow = false;
    this.QualifydivHidden = true;
    this.QualifydivShow = false;
    this.Pursuithidden = true;
    this.Pursuitshow = false;
    this.Securehidden = false;
    this.Secureshow = true;
    this.ServiceDetails = true;
    this.NoSelectbtn = true;
    this.stageSelected = 184450002;
    this.createNotReq = true;
    if (this.errorFlag) {
      this.cbuNameFlag = true;
    }
      this.appendRedisCache();
      this.clearErrorFlags();
  }
  clickSecure() {
    this.Creatediv = false;
    this.Qualifydiv = false;
    this.Simplediv = false;
    this.Securediv = true;
    this.CreatedivHidden = true;
    this.CreatedivShow = false;
    this.QualifydivHidden = true;
    this.QualifydivShow = false;
    this.Pursuithidden = false;
    this.Pursuitshow = true;
    this.Securehidden = true;
    this.Secureshow = false;
    this.ServiceDetails = true;
    this.NoSelectbtn = true;
    this.stageSelected = 184450003;
    this.createNotReq = true;
    if (this.errorFlag) {
      this.cbuNameFlag = true;
    }
     this.appendRedisCache();
     this.clearErrorFlags();
  }

  goBack() {
    let path = this.projectService.getSession('path');
    if(path){
      sessionStorage.removeItem('path');
      this.router.navigate([path]);
    }
    // else if(this.fromLeadFlag) {
    //   this.router.navigate(['/accounts/accountlist/farming'])
    // }
    else
    this.router.navigate(['/opportunity/allopportunity']);
    //  window.history.back();
  }

  openConvertNormalDealPopup(): void {
    const dialogRef = this.dialog.open(ConvertNormalDealPopup, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(val => {
      console.log("Dialog result:", val);
      if (val == 'yes') {

      }
    });
  }
  // scroll to invalid elements starts here
  scrollTo(el: HTMLElement) {
    if (el) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: el.getBoundingClientRect().top + window.scrollY - 150
      })
      setTimeout(() => {
        el.focus();
      }, 1000);
    }
  }
  // scroll to invalid element ends here

  createTemplate() {
    return {
      IsSimpleDeal: this.simpleDeal,
      StageSelected: this.stageSelected,
      OpportunityName: this.opportunityName,
      AccountId: this.detailsId,
      AccountName: this.details,
      SelectedAccount: this.selectedAccObj,
      AccountData: this.wiproAccountName,
      SapId: this.sapId,
      SapName: this.sapName,
      SelectedSap: this.selectedSapObj,
      SapData: this.sapArray,
      SourceId: this.sourceValue,
      SourceData: this.srcArray,
      ShowIcon: this.showIcon,
      LinkedLead: this.linkedLeadObj,
      LeadSourceArray: this.leadSourceArray,
      ProposalTypeId: this.proposalTypeValue,
      ProposalTypeData: this.proArray,
      CurrencyId: this.cuId,
      CurrencyName: this.cuName,
      SelectedCurrency: this.cuSelected,
      CurrencyData: this.currency,
      VerticalId: this.verticalValue,
      VerticalDisabled: this.verticalAble,
      SbuId: this.sbuForSave,
      VerticalData: this.acVertical,
      CBUId: this.cbuListValue,
      CBUName: this.cbuName,
      SelectedCBU: this.selectedCbuObj,
      CBUData: this.cbuList,
      RegionId: this.oppRegionValue,
      GeoGuid: this.geoGuidForSave,
      RegionData: this.acRegion,
      VerticalSalesOwnerId: this.verSaOwId,
      VerticalSalesOwnerName: this.verSaOwName,
      SelectedVerticalSalesOnwer: this.verticalSalesOwObject,
      VsoDisabled: this.vsoDisabled,
      VerticalSalesOnwerData: this.vertSalesOwner,
      DigitalBetsId: this.digitalBigBetsValue,
      DigitalBetsData: this.digBigBets,
      EstimatedClosureDate: this.estClosureDate,
      ProposalSubmissionDate: this.proposalSubmissionDate,
      ProjectDuration: this.projectDuiration,
      CountryId: this.countId,
      CountryName: this.countName,
      SelectedCountry: this.CountSelected,
      CountryData: this.contractingCounrty,
      StateId: this.stateId,
      StateName: this.stateName,
      SelectedState: this.selectedStateObj,
      StateData: this.acState,
      CityId: this.cityId,
      CityName: this.cityName,
      SelectedCity: this.selectedCityObj,
      CityData: this.acCity,
      AdvisorId: this.adNameId,
      AdvisorName: this.adName,
      SelectedAdvisor: this.adNameSelected,
      AdvisorData: this.AdvisorName,
      AdvisorContactId: this.adContactId,
      AdvisorContactName: this.adContactName,
      SelectedAdvisorCon: this.advisorConObj,
      AdvisorContactData: this.advisorContact,
      AdvisorOwnerId: this.adOwnerId,
      AdvisorOwnerName: this.adOwnerName,
      AdvisorOwnerData: this.advisorOwner,
      AdvisorFldsFlag: this.advFlagVar,
      EstimatedRFIValue: this.estRfiValue,
      EstimatedEmpValue: this.estEmpValue,
      Description: this.textDescription,
      SelectedLinkedAGP: this.contactTag,
      LinkedAgpComArray: this.linkedAgpComArray,
      LinkedAGPData: this.wiproLinkedAGPArray,
      SelectedCustomerDecisionMakers: this.selectedContact,
      CustomerDecisionMakersData: this.customerDMaker,
      PrimaryCustomerId: this.detailsId1,
      PrimaryCustomerName: this.details1,
      SelectedPrimaryCustomer: this.selectedAccObj1,
      PrimaryCustomerData: this.wiproPrimaryCustomerContact,
      ServiceLineId: this.serviceValue,
      ServiceLineData: this.serviceLine,
      PracticeId: this.practiceValue,
      PracticeData: this.practice,
      SubPracticeId: this.subPracticeValue,
      SubPracticeData: this.subPractice,
      SLBDMId: this.slBdValue,
      SLBDMName: this.slbdmName,
      SelectedSLBDM: this.selectedSlbdmObj,
      SLBDMData: this.wiproSlBdm,
      EngagementModelId: this.engagementModelValue,
      EngagementModelData: this.engModel,
      TCVValue: this.tcvValue,
      EngagementStartDate: this.engStartDate,
      EngagementEndDate: this.engEndDate,
      SubmittedDate: this.submittedDate,
      ShortlistedDate: this.shortlistedDate,
      DecisionDate: this.decisionDate
    }
  }
  appendTemplate(data) {
    this.fromAutoSave = true;
      this.simpleDeal = data.IsSimpleDeal;
      this.showHideAccordion(this.simpleDeal);
       this.stageSelected = data.StageSelected;
       if(this.stageSelected == 184450000) {
        this.clickCreate();
       }
       else if(this.stageSelected == 184450001) {
        this.clickQualify();
      }
      else if(this.stageSelected == 184450002) {
        this.clickPursuit();
      }
      else if(this.stageSelected == 184450003) {
        this.clickSecure();
      }
       this.opportunityName = data.OpportunityName;
       this.detailsId = data.AccountId;
       this.details = data.AccountName;
       this.selectedAccObj = data.SelectedAccount;
      if(this.detailsId) {
        this.SelectedAccountValue(this.selectedAccObj);
      }
       this.sapId = data.SapId;
       this.sapName = data.SapName;
       this.selectedSapObj = data.SelectedSap;
      if(this.sapId) {
        this.sapSelected(this.selectedSapObj);
      }
       this.sourceValue = data.SourceId;
       this.srcArray = data.SourceData;
       this.showIcon = data.ShowIcon;
       this.linkedLeadObj = data.LinkedLead;
       this.leadSourceArray = data.LeadSourceArray;
       this.proposalTypeValue = data.ProposalTypeId;
       this.proposalMethod(this.proposalTypeValue);
       this.proArray = data.ProposalTypeData;
       this.cuId = data.CurrencyId;
       this.cuName = data.CurrencyName;
       this.cuSelected = data.SelectedCurrency;
      if(this.cuId) {
        this.currencyMethodSelect(this.cuSelected);
      }
       this.verticalValue = data.VerticalId;
       this.verticalAble = data.VerticalDisabled,
       this.sbuForSave = data.SbuId;
      if(this.verticalValue) {
        // this.verticalMethod(this.verticalValue); call service line and assign selected service line
        this.projectService.getServiceLine(this.sbuForSave).subscribe((res) => {
          if (!res.IsError) {
            this.slDisabled = false;
            this.serviceLine = res.ResponseObject;
            this.serviceLine = this.serviceLine.filter(it => it.IsVisible == true);
            this.serviceValue = data.ServiceLineId;
            if(this.serviceValue) {
              this.serviceLineGuId = this.serviceValue;
              this.pracAble = false;
              this.flagPactice = false
                this.engAble = false;
                this.serLineFlag = false;
             //call practice method and assign practice value
             //if practice value is there call for subpractice
             this.projectService.getPractice(this.serviceValue).subscribe((res) => {
              if (!res.IsError) {
                if (res.ResponseObject != null && res.ResponseObject.length > 0) {
                  this.practice = res.ResponseObject;
                  this.practiceValue = data.PracticeId;
                  this.subPracAble = false;
                  this.flagSubPactice = false;
                  this.pracFlag = false;
                  if(this.practiceValue) {
                    this.serviceLinePracticeId = this.practiceValue;
                    this.projectService.getSubPractice(this.practiceValue).subscribe((res) => {
                      if (!res.IsError) {
                        if (res.ResponseObject != null && res.ResponseObject.length > 0) {
                          this.subPractice = res.ResponseObject;
                          this.subPractice.forEach(item => {
                            (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
                          })
                          this.subPracticeValue = data.SubPracticeId;
                          if(this.subPracticeValue) {
                            this.subPracticeMethod(this.subPracticeValue);
                          }
                        }
                        else {
                          this.flagSubPactice = true;
                          this.subPraFlag = false;
                        }
                      }
                      else {
                        this.projectService.displayMessageerror(res.Message);
                      }
                
                    }, (err) => {
                      this.projectService.displayerror(err.status);
                    });
                  }
                }
              }
            }, (err) => {
              this.projectService.displayerror(err.status);
            });
            }
          }
        }, (err) => {
          this.projectService.displayerror(err.status);
        });
       
      }
       this.cbuListValue = data.CBUId;
       this.cbuName = data.CBUName;
       this.selectedCbuObj = data.SelectedCBU;
       if(this.cbuListValue) {
        this.selectedCbu(this.selectedCbuObj);
      }
       this.oppRegionValue = data.RegionId;
       this.geoGuidForSave = data.GeoGuid;
      //  if(this.detailsId && this.oppRegionValue && this.verticalValue) {
      //   this.vsoDisabled = false;
      // }
       this.verSaOwId = data.VerticalSalesOwnerId;
       this.verSaOwName = data.VerticalSalesOwnerName;
       this.verticalSalesOwObject = data.SelectedVerticalSalesOnwer;
       this.vsoDisabled = data.VsoDisabled;

       this.digitalBigBetsValue = data.DigitalBetsId;
       this.digBigBets = data.DigitalBetsData;
       this.estClosureDate = data.EstimatedClosureDate;
       this.proposalSubmissionDate = data.ProposalSubmissionDate;
       this.projectDuiration = data.ProjectDuration;
       this.countId = data.CountryId;
       this.countName = data.CountryName;
       this.CountSelected = data.SelectedCountry;
      if(this.countId) {
        this.getCountrySelected(this.CountSelected);
      }
       this.stateId = data.StateId;
       this.stateName = data.StateName;
       this.selectedStateObj = data.SelectedState;
      if(this.stateId) {
        this.selectedStateList(this.selectedStateObj);
      }
       this.cityId = data.CityId;
       this.cityName = data.CityName;
       this.selectedCityObj = data.SelectedCity;
      if(this.cityId) {
        this.selectedCity(this.selectedCityObj);
      }
       this.adNameId = data.AdvisorId;
       this.adName = data.AdvisorName;
       this.adNameSelected = data.SelectedAdvisor;
      if(this.adNameId) {
        this.getAdvisorNameMethodSelected(this.adNameSelected);
      }
       this.adContactId = data.AdvisorContactId;
       this.adContactName = data.AdvisorContactName;
       this.advisorConObj = data.SelectedAdvisorCon;
      if(this.adContactId) {
        this.advisorContactMethodSelected(this.advisorConObj);
      }
       this.adOwnerId = data.AdvisorOwnerId;
       this.adOwnerName = data.AdvisorOwnerName;
       this.advFlagVar = data.AdvisorFldsFlag;
       this.estRfiValue = data.EstimatedRFIValue;
       this.estEmpValue = data.EstimatedEmpValue;
      this.textDescription = data.Description;
       this.contactTag = data.SelectedLinkedAGP;
       this.linkedAgpComArray = data.LinkedAgpComArray
       this.selectedContact = data.SelectedCustomerDecisionMakers;
       this.selecteddecisionContactsForSave = this.selectedContact;
       this.detailsId1 = data.PrimaryCustomerId;
       this.details1 = data.PrimaryCustomerName;
       this.selectedAccObj1 = data.SelectedPrimaryCustomer;
       if(this.detailsId1) {
         this.SelectedPrimaryCustomerContact(this.selectedAccObj1);
       }

       this.slBdValue = data.SLBDMId;
       this.slbdmName = data.SLBDMName;
       this.selectedSlbdmObj = data.SelectedSLBDM;
      if(this.slBdValue) {
        this.slbdmDisable = false;
        this.selectedSLBDMValue(this.selectedSlbdmObj);
      }
       this.engagementModelValue = data.EngagementModelId;
       this.engModel = data.EngagementModelData;
       this.tcvValue = data.TCVValue;
       this.engStartDate = data.EngagementStartDate;
       this.engEndDate = data.EngagementEndDate;
       this.submittedDate = data.SubmittedDate;
       this.shortlistedDate = data.ShortlistedDate;
       this.decisionDate = data.DecisionDate;
  }

  ClearRedisCache() {
    this.service.SetRedisCacheData("empty", 'createOpportunity').subscribe(res => console.log(res))
    this.service.deleteRedisCacheData('createOpportunity').subscribe(res => console.log(res))
  }

clearClicked = false;
  ClearFormData(buttonType?) {
    this.fromAutoSave = false;
    this.clearClicked = true;
    this.showIcon = false;
    this.simpleDeal = false;
    this.Securediv = false;
    this.showHideAccordion(this.simpleDeal);
    this.opportunityName = '';
    this.detailsId = '';
    this.details = ''
    this.selectedAccObj = { SysGuid: "", Name: "" };
    this.SelectedAccountValue(this.selectedAccObj);
    this.sapId = '';
    this.sapName = '';
    this.selectedSapObj = { SysGuid: "", Name: "" };
    this.sourceValue = null;
    this.linkedLeadObj = {
      leadType: null,
      leadSourceId: null,
      leadSourceName: '',
      leadSrcDtlId: null,
      leadSrcDtlName: '',
      leadDtlId: null,
      leadDetails: '',
      comments: '',
      originatingLeadId: '',
      originatingLeadName: ''
    }
    this.proposalTypeValue = '';
    this.cuId = ''
    this.cuName = '';
    this.cuSelected = { SysGuid: "", Name: "" };
    this.verticalValue = '';
    this.sbuForSave = '';
    this.cbuListValue = '';
    this.cbuName = '';
    this.selectedCbuObj = { SysGuid: "", Name: "" };
    this.oppRegionValue = '';
    this.verSaOwId = '';
    this.verSaOwName = '';
    this.verticalSalesOwObject = { UserId: "", UserName: "" };
    this.digitalBigBetsValue = '';
    this.estClosureDate = null;
    this.proposalSubmissionDate = null;
    this.proposalSubmissionDateControl.setValue(null);
    this.projectDuiration = null;
    this.countId = '';
    this.countName = '';
    this.CountSelected = { SysGuid: "", Name: "" };
    this.stateId = '';
    this.stateName = '';
    this.selectedStateObj = { SysGuid: "", Name: "" };
    this.scFlag = false;
    this.cityId = '';
    this.cityName = '';
    this.selectedCityObj = { SysGuid: "", Name: "" };
    this.noCityFlag = true;
    this.adNameId = '';
    this.adName = '';
    this.adNameSelected = '';
    this.adContactId = '';
    this.adContactName = '';
    this.advisorConObj = { SysGuid: "", Name: "" };
    this.adOwnerId = '';
    this.adOwnerName = '';
    this.advFlagVar = true;
    this.estRfiValue = '';
    this.estEmpValue = '';
    this.textDescription = '';
    this.contactTag = '';
    this.linkedAgpComArray = [];
    this.selectedContact = [];
    this.detailsId1 = '';
    this.details1 = '';
    this.selectedAccObj1 = { SysGuid: "", Name: "" };
    this.serviceValue = '';
    this.practiceValue = '';
    this.subPracticeValue = '';
    this.slBdValue = '';
    this.slbdmName = '';
    this.selectedSlbdmObj = { SysGuid: "", Name: "" };
    this.engagementModelValue = '';
    this.tcvValue = null;
    this.engStartDate = null;
    this.engEndDate = null;
    this.submittedDate = null;
    this.shortlistedDate = null;
    this.decisionDate = null;
    this.clearErrorFlags();
    this.ClearRedisCache();
    if (this.fromLeadFlag) {
      //From Lead
      this.detailsFromLead = JSON.parse(sessionStorage.getItem('CreateOpportunityFromLead'));
      console.log("Lead details", this.detailsFromLead)
      if (this.detailsFromLead && Object.keys(this.detailsFromLead).length > 0) {
        this.showHideAccordion(this.simpleDeal);
        this.fromLeadFlag = true;
        this.clickQualify();
        console.log("this.detailsFromLead.Title", this.detailsFromLead.Title)
        this.detailsId = this.detailsFromLead.Account ? this.detailsFromLead.Account.SysGuid : "";
        this.opportunityName = this.detailsFromLead.Title ? this.detailsFromLead.Title : "";
        this.textDescription = this.detailsFromLead.EnquiryDesc ? this.detailsFromLead.EnquiryDesc : "";
        this.sbuForSave = this.detailsFromLead.SBU ? this.detailsFromLead.SBU.Id : '';
        this.projectService.setSession('sbuStoredValue', this.detailsFromLead.SBU ? this.detailsFromLead.SBU.Name : '');
        console.log("sbuValue on create", this.projectService.getSession('sbuStoredValue'));

        console.log("this.opportunity", this.opportunityName);
        if (this.detailsFromLead.Account) {
          this.SelectedAccountValue(this.detailsFromLead.Account)
        }
        this.verticalValue = this.detailsFromLead.Vertical.Id ? this.detailsFromLead.Vertical.Id : '';
        this.customerDMakerMethod("");
        this.sourceValue = 184450000;
        this.showIcon = true;
        this.linkedLeadObj = {
          leadType: 1,
          leadSourceId: null,
          leadSourceName: '',
          leadSrcDtlId: null,
          leadSrcDtlName: '',
          leadDtlId: null,
          leadDetails: '',
          comments: '',
          originatingLeadId: this.detailsFromLead.LeadGuid ? this.detailsFromLead.LeadGuid : '',
          originatingLeadName: this.detailsFromLead.Title ? this.detailsFromLead.Title : null
        }
        console.log(this.linkedLeadObj, "linkobj")
        if (this.detailsFromLead.Currency) {
          this.cuId = this.detailsFromLead.Currency.Id ? this.detailsFromLead.Currency.Id : '';
          this.cuName = this.detailsFromLead.Currency.Desc ? this.detailsFromLead.Currency.Desc : '';
          this.cuName = this.getSymbol(this.cuName);
        }
        if (this.detailsFromLead.Country) {
          let countrydata = {
            CountryName: this.detailsFromLead.Country.Name ? this.detailsFromLead.Country.Name : '',
            SysGuid: this.detailsFromLead.Country.SysGuid ? this.detailsFromLead.Country.SysGuid : ''
          }
          this.getCountrySelected(countrydata)
        }
        this.estClosureDate = this.detailsFromLead.EstimatedCloseDate ? this.detailsFromLead.EstimatedCloseDate : '';
        if (this.detailsFromLead.ServiceLine && this.detailsFromLead.ServiceLine.length) {
          this.serviceValue = this.detailsFromLead.ServiceLine[0].Guid ? this.detailsFromLead.ServiceLine[0].Guid : '';
          if (this.serviceValue) {
            this.serviceLineMethod(this.serviceValue);
          }
          console.log(this.serviceValue, "this.serviceValue");
          this.practiceValue = this.detailsFromLead.ServiceLine[0].practice ? this.detailsFromLead.ServiceLine[0].practice.practiceGuid : '';
          if (this.practiceValue) {
            this.practiceMethod(this.practiceValue);
          }
          console.log(this.practiceValue, "this.practiceValue");
          if (Object.keys(this.detailsFromLead.ServiceLine[0].SLBDM)) {
            this.slbdmName = this.detailsFromLead.ServiceLine[0].SLBDM.Name ? this.detailsFromLead.ServiceLine[0].SLBDM.Name : '';
            this.slBdValue = this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid ? this.detailsFromLead.ServiceLine[0].SLBDM.bdmidGuid : '';
          }
        }
      }
      //From lead end
    }

    else if(this.fromAccountFlag) {
      this.detailsFromAccount = this.projectService.getSession('accountDetails');
      console.log("this.detailsFromAccount",this.detailsFromAccount);
      if (this.detailsFromAccount && Object.keys(this.detailsFromAccount).length > 0) {
        this.showHideAccordion(this.simpleDeal);
       this.detailsFromAccount = this.detailsFromAccount.accountDetails;
       this.detailsId = this.detailsFromAccount.SysGuid;
       this.details = this.getSymbol(this.detailsFromAccount.Name);
       this.selectedAccObj = { SysGuid: this.detailsId, Name: this.details }
       this.fromAccountFlag = true;
       this.SelectedAccountValue(this.selectedAccObj);
       if(this.detailsFromAccount.CustomerBusinessUnit && this.detailsFromAccount.CustomerBusinessUnit.length == 1) {
         this.selectedCbu({ SysGuid:this.detailsFromAccount.CustomerBusinessUnit[0] ? this.detailsFromAccount.CustomerBusinessUnit[0].MapGuid : "", Name: this.detailsFromAccount.CustomerBusinessUnit[0] ? this.detailsFromAccount.CustomerBusinessUnit[0].Name : "" });
       }
        this.verticalValue = this.detailsFromAccount.Vertical ? this.detailsFromAccount.Vertical.Id : '';
        this.sbuForSave = this.detailsFromAccount.SBU ? this.detailsFromAccount.SBU.Id : '';
        this.projectService.setSession('sbuStoredValue', this.detailsFromAccount.SBU ? this.detailsFromAccount.SBU.Name : '');
        console.log("sbuValue on create", this.projectService.getSession('sbuStoredValue'));


        this.verticalMethod(this.verticalValue);
       this.oppRegionValue = this.detailsFromAccount.Region ? this.detailsFromAccount.Region.SysGuid : '';
       this.geoGuidForSave = this.detailsFromAccount.Geo ? this.detailsFromAccount.Geo.SysGuid : '';
       this.oppRegionMethod(this.oppRegionValue);
       if(this.detailsFromAccount.Currency) {
         this.currencyMethodSelect({ SysGuid: this.detailsFromAccount.Currency.Id, Name: this.detailsFromAccount.Currency.Value });
       }
       if(this.detailsFromAccount.CountryReference) {
         this.getCountrySelected({
           CountryName: this.detailsFromAccount.CountryReference.Name, SysGuid:this.detailsFromAccount.CountryReference.SysGuid });
       }
       if(this.detailsFromAccount.CountrySubDivisionReference) {
         this.selectedStateList({ SysGuid: this.detailsFromAccount.CountrySubDivisionReference.SysGuid, Name: this.detailsFromAccount.CountrySubDivisionReference.Name })
       }
   
       if(this.detailsFromAccount.CityRegionReference) {
         this.selectedCity({ SysGuid: this.detailsFromAccount.CityRegionReference.SysGuid, Name: this.detailsFromAccount.CityRegionReference.Name })
       }
     }
    }
    if(buttonType == 'CLEAR')
    {
       this.snackBar.open('Data cleared successfully', this.action, {
            duration: 2000
          });
    }
      // this.projectService.displayMessageerror('Data cleared successfully');
  }
  appendRedisCache() {
    if(!this.fromAccountFlag && !this.fromLeadFlag) {
      this.service.SetRedisCacheData(this.createTemplate(), 'createOpportunity').subscribe(res => {

        if (!res.IsError) {
          console.log("SUCESS FULL AUTO SAVE")
        }
      }, error => {
        console.log(error)
      })
    }

  }
  OppNameErr = '';
  saveMethod() {
    if(!this.simpleDeal && !this.Creatediv && !this.Securediv && !this.Qualifydiv && !this.Simplediv) {
       this.snackBar.open('Please select stage', this.action, {
            duration: 2000
          });
      // this.projectService.displayMessageerror('Please select stage');
      return;
    }
    this.oppNameFlag = false;
    this.accNameFlag = false;
    this.sapFlag = false;
    this.srcNameFlag = false;
    this.linkedLeadErr = false;
    this.curNameFlag = false;
    this.verNameFlag = false;
    this.cbuNameFlag = false;
    this.oppRegNameFlag = false;
    this.vsoNameFlag = false;
    this.dbbFlag = false;
    this.projDurFlag = false;
    this.countryFlag = false;
    this.stateNameFlag = false;
    this.cityNameFlag = false;
    this.descriptionFlag = false;
    this.cDMCFlag = false;
    this.priCustFlag = false;
    this.serLineFlag = false;
    this.pracFlag = false;
    this.subPraFlag = false;
    this.slBdmFlag = false;
    this.enModFlag = false;
    this.tcvFlag = false;
    this.estFlag = false;
    this.proposalDateFlag = false;
    this.engStartDateFlag = false;
    this.engEndDateFlag = false;
    this.submittedDateFlag = false;
    this.shortlistedDateFlag = false;
    this.proposalDateFlag = false;
    this.accOwnerFlag = false;
    this.advContactFlag = false;
    let invalidElements = this.el.nativeElement.querySelectorAll('input.orangeborder, mat-select.orangeborder,textarea.orangeborder');
    if (invalidElements.length > 0) {
      this.scrollTo(invalidElements[0]);
    }
    else {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
       let invalidElements = this.el.nativeElement.querySelectorAll('input.orangeborder, mat-select.orangeborder,textarea.orangeborder');          
       if (invalidElements.length > 0) {
         clearInterval(this.interval);
         this.scrollTo(invalidElements[0]);
       }
      }, 0);

    }
    let startdate = this.datePipe.transform(this.engStartDate, 'yyyy-MM-dd');
    if (startdate) {
      let engstartdate = new Date(startdate);
      this.engStartselectedDate = engstartdate.toISOString()
    }
    else {
      this.engStartselectedDate = ""
    }


    let enddate = this.datePipe.transform(this.engEndDate, 'yyyy-MM-dd');
    if (enddate) {
      let engenddate = new Date(enddate);
      this.engEndselectedDate = engenddate.toISOString()
    }
    else {
      this.engEndselectedDate = ""
    }


    let submitteddate = this.datePipe.transform(this.submittedDate, 'yyyy-MM-dd');
    if (submitteddate) {
      let subdate = new Date(submitteddate);
      this.submittedselectedDate = subdate.toISOString()
    }
    else {
      this.submittedselectedDate = ""
    }


    let shortlistedddate = this.datePipe.transform(this.shortlistedDate, 'yyyy-MM-dd');
    if (shortlistedddate) {
      let shortdate = new Date(shortlistedddate);
      this.shortlistedselectedDate = shortdate.toISOString()
    }
    else {
      this.shortlistedselectedDate = ""
    }


    let decisionDate = this.datePipe.transform(this.decisionDate, 'yyyy-MM-dd');
    if (decisionDate) {
      let decDate = new Date(decisionDate);
      this.decisionSelectedDate = decDate.toISOString()
    }
    else {
      this.decisionSelectedDate = ""
    }

    this.proposalSubmissionselectedDate = this.datePipe.transform(this.proposalSubmissionDate, 'yyyy-MM-dd');
    if (this.simpleDeal) {
      this.time = this.datePipe.transform(this.estClosureDate, 'yyyy-MM-dd');
      if (this.opportunityName == "" && this.details == "" && this.sapName == "" && !this.sourceValue && this.cbuListValue == "") {
        this.errorFlag = true;
        this.projectService.displayMessageerror('Please enter your details before saving');
      }
      if (this.opportunityName == "" || this.opportunityName.replace(/\s/g, "").length == 0) {
        this.oppNameFlag = true;
        this.OppNameErr = 'Opportunity name is mandatory';
      }
      else if(this.opportunityName == "-") {
        this.oppNameFlag = true;
        this.OppNameErr = 'Please enter valid name';
      }
      if (this.detailsId == "") {
        this.accNameFlag = true;
      }
      if (!this.showRequestSAP && this.sapName == "") {
        this.sapFlag = true;
      }
      if (this.sourceValue == "" || !this.sourceValue) {
        this.srcNameFlag = true;
      }
      else if (this.sourceValue === 184450000 && !this.linkedLeadObj.leadType) {
        this.srcNameFlag = true;
        this.linkedLeadErr = true;
      }
      if (this.cuId == "") {
        this.curNameFlag = true;
      }
      if (this.verticalValue == "" || !this.verticalValue) {
        this.verNameFlag = true;
      }
      if (this.cbuListValue == "" || !this.cbuListValue) {
        this.cbuNameFlag = true;
      }
      if (this.oppRegionValue == "" || !this.oppRegionValue) {
        this.oppRegNameFlag = true;
      }
      if (this.verSaOwId == "" || !this.verSaOwId) {
        this.vsoNameFlag = true;
      }
      if (this.digitalBigBetsValue == "") {
        this.dbbFlag = true;
      }
      if (this.projectDuiration == null) {
        this.projDurFlag = true;
      }
      if (this.countName == "") {
        this.countryFlag = true;
      }
      if (this.stateId == "" && this.scFlag && (this.countId && (this.countName == "INDIA" || this.countName == "UNITED KINGDOM" || this.countName == "USA"
      || this.countName == "United States" || this.countName == "UK" || this.countName == "India"
      || this.countName == "United Kingdom" || this.countName == "UNITED STATES"))) {
        this.stateNameFlag = true;
      }
      if (this.cityId == "" && !this.noCityFlag) {
        this.cityNameFlag = true;
      }
      if (this.textDescription == "" || this.textDescription.replace(/\s/g, "").length == 0) {
        this.descriptionFlag = true;
      }
      if (this.selecteddecisionContactsForSave.length == 0) {
        this.cDMCFlag = true;
      }
      if (this.details1 == "") {
        this.priCustFlag = true;
      }
      if (this.serviceValue == "") {
        this.serLineFlag = true;
      }
      if ((this.practiceValue == "" || !this.practiceValue) && this.flagPactice == false) {
        this.pracFlag = true;
      }
      if ((this.subPracticeValue == "" || !this.subPracticeValue) && this.flagSubPactice == false) {
        this.subPraFlag = true;
      }
      if (this.slBdValue == "" || !this.slBdValue) {
        this.slBdmFlag = true;
      }
      if (this.engagementModelValue == "") {
        this.enModFlag = true;
      }
      if (this.tcvValue == null || this.tcvValue == '' || !this.tcvValue) {
        this.tcvFlag = true;
      }
      if (this.estClosureDate == null) {
        this.estFlag = true;
      }
      if (this.proposalSubmissionDate == null) {
        this.proposalDateFlag = true;
      }
      if (this.tcvSaveCheck) {
        this.genPopMethod();
      }
      if (!this.oppNameFlag && !this.accNameFlag && !this.sapFlag && !this.srcNameFlag && !this.curNameFlag && !this.verNameFlag && !this.cbuNameFlag && !this.oppRegNameFlag && !this.vsoNameFlag && !this.dbbFlag && !this.projDurFlag && !this.countryFlag && !this.stateNameFlag && !this.cityNameFlag && !this.descriptionFlag && !this.cDMCFlag && !this.priCustFlag && !this.serLineFlag && !this.pracFlag && !this.subPraFlag && !this.slBdmFlag && !this.enModFlag && !this.tcvFlag && !this.estFlag && !this.proposalDateFlag && !this.tcvSaveCheck) {
        this.service.loaderhome = true;
        this.serviceLineObj = [{
          WiproEngagementmodel: this.engagementModelValue,
          WiproEstsltcv: this.tcvValue,
          WiproPracticeId: this.practiceValue,
          WiproSubpracticeid: this.subPracticeValue,
          WiproSlbdmid: this.slBdValue,
          WiproServicelineidValue: this.serviceValue
        }];
        this.CreateOpportunityObject =
          {
            OwnerId: this.userGuid,
            WiproSimpledeal: this.simpleDeal,
            WiproPipelinestage: this.stageSelected,
            Name: this.opportunityName,
            DomainTribe: "",
            Chapter: "",
            TargetedArea: "",
            Parentaccountid: this.detailsId,
            WiproSource: this.sourceValue,
            WiproProposaltype: 184450004,// this.proposalTypeValue,
            WiproCurrency: this.cuId,
            WiproVertical: this.verticalValue,
            WiproSubvertical: "",
            WiproCbu: this.cbuListValue,
            WiproContractingcountry: this.countId,
            WiproContractingcity: this.cityId,
            WiproState: this.stateId,
            WiproSbu: this.sbuForSave,
            WiproRegion: this.oppRegionValue,
            WiproGeography: this.geoGuidForSave,
            BigBet: this.digitalBigBetsValue,
            WiproVerticalsalesowner: this.verSaOwId,
            Estimatedclosedate: this.time,
            WiproDurationinmonths: this.projectDuiration,
            WiproProposalsubmissionduedate: this.proposalSubmissionselectedDate,
            WiproAdvisorname: this.adNameId,
            WiproAdvisorcontacts: this.adContactId,
            WiproAdvisorowner: this.adOwnerId,
            WiproIsbgcgemd: this.bgCgEmd,
            WiproEstimatedEmpanelmentValue: '',//this.estEmpValue,
            WiproEstimatedRFIValue: '',//this.estRfiValue,
            WiproScopeOfWork: this.textDescription,
            WiproPrimarycontact: this.detailsId1,
            WiproSapcode: this.sapId,
            WiproLinkedLeadType: this.linkedLeadObj.leadType,
            WiproOriginatingLead: this.linkedLeadObj.originatingLeadId,
            ServiceLines: this.serviceLineObj,
            OppLinkedLeads: [
              {
                "LeadSourceId": this.linkedLeadObj.leadSourceId,
                "LeadSourceDetailsId": this.linkedLeadObj.leadSrcDtlId,
                "CampaignId": this.linkedLeadObj.leadSrcDtlId == 3 || this.linkedLeadObj.leadSrcDtlId == 4 ? this.linkedLeadObj.leadDtlId : '',
                "AccountId": (this.linkedLeadObj.leadSrcDtlId == 2 || this.linkedLeadObj.leadSrcDtlId == 7 || this.linkedLeadObj.leadSrcDtlId == 8) ? this.linkedLeadObj.leadDtlId : '',
                "SysGuid": "",
                "Comments": this.linkedLeadObj.leadSrcDtlId == 5 ? this.linkedLeadObj.comments : '',
                "LeadGuid": ""
              }
            ],

            DecisionMakers: this.selecteddecisionContactsForSave,
            OpportunityAGPs: this.linkedAgpForSave,
            OwnerName: localStorage.getItem('upn'),
            OwnerEmailId: localStorage.getItem('userEmail').replace(/"/g, "")
          }
        this.projectService.saveOpportunityData(this.CreateOpportunityObject).subscribe(res => {
          if (!res.IsError) {
            this.result = res.ResponseObject
            if (res.ResponseObject != null) {
              this.service.loaderhome = false;
              this.OpportunityNum = this.result.OpportunityNumber;
              console.log('final response', this.OpportunityNum);
              this.savesuccess = this.successMsg + this.OpportunityNum + ")";
              this.projectService.setSession('opportunityId', res.ResponseObject.OpportunityId);
              this.projectService.setSession('opportunityName', res.ResponseObject.name);
              this.projectService.setSession('FullAccess', true);
              this.projectService.setSession('IsStaffingInitiated', false);
              this.projectService.setSession('WiproIsAutoClose', false);
              this.projectService.setSession('newOpportunity', true);
              this.projectService.setSession('SuspendCount', true)
              this.projectService.setSession('IsOAR', true)
              this.projectService.setSession('IsAmendment', false);
              this.projectService.setSession('BFMNavagationFlag', false);
              this.projectService.setSession('opportunityStatus', '1');
              this.projectService.clearSession('AdvisorOwnerId')
              this.service.newOpportunities = true;
              this.ClearRedisCache();
              this.orderService.getWTstatus({
                OrderOrOpportunityId: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                IsOrderCheckNonBPO: false
              }).subscribe((WTResponse : any) => {
                var WTflag = false;
                if(!WTResponse.IsError && WTResponse.ResponseObject[0]) {
                  WTflag = WTResponse.ResponseObject[0].IsWT;
                }
                this.orderService.setNonWTstatus({
                  Guid: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                  Flag: !WTflag,
                  IsProceedToClose: true
                }).subscribe(NotWTResponse => {
                  console.log('NotWTResponse', NotWTResponse);
                });
              });
              this.projectService.displayMessageerror(this.savesuccess);
              this.isLoading = true;
              this.router.navigate(['/opportunity/opportunityview/overview']);
            }
            else {
              this.projectService.displayMessageerror('Data not found');
              this.service.loaderhome = false;
            }
          }
          else {
            this.projectService.displayMessageerror('Error occured while saving data');
            this.service.loaderhome = false;
          }
        }, (err) => {
          this.projectService.displayerror(err.status);
          this.service.loaderhome = false;
        })
      }
    }
    else if (this.stageSelected == 184450000) {
      if (this.opportunityName == "" && this.details == "" && this.sapName == "" && this.sourceValue == "") {
        this.errorFlag = true;
        this.projectService.displayMessageerror('Please enter your details before saving');
      }
      if (this.opportunityName == "" || this.opportunityName.replace(/\s/g, "").length == 0) {
        this.oppNameFlag = true;
        this.OppNameErr = 'Opportunity name is mandatory';
      }
      else if(this.opportunityName == "-") {
        this.oppNameFlag = true;
        this.OppNameErr = 'Please enter valid name';
      }
      if (this.detailsId == "") {
        this.accNameFlag = true;
      }
      if (this.sourceValue == "" || !this.sourceValue) {
        this.srcNameFlag = true;
      }
      else if (this.sourceValue === 184450000 && !this.linkedLeadObj.leadType) {
        this.srcNameFlag = true;
        this.linkedLeadErr = true;
      }
      if (this.cuId == "") {
        this.curNameFlag = true;
      }
      if (this.verticalValue == "" || !this.verticalValue) {
        this.verNameFlag = true;
      }
      if (this.oppRegionValue == "" || !this.oppRegionValue) {
        this.oppRegNameFlag = true;
      }
      if (this.verSaOwId == "" || !this.verSaOwId) {
        this.vsoNameFlag = true;
      }
      // else
      if (this.textDescription == "" || this.textDescription.replace(/\s/g, "").length == 0) {
        this.descriptionFlag = true;
      }
      if (this.serviceValue == "") {
        this.serLineFlag = true;
      }
      if ((this.practiceValue == "" || !this.practiceValue) && this.flagPactice == false) {
        this.pracFlag = true;
      }
      if ((this.subPracticeValue == "" || !this.subPracticeValue) && this.flagSubPactice == false) {
        this.subPraFlag = true;
      }
      if (this.slBdValue == "" || !this.slBdValue) {
        this.slBdmFlag = true;

      }
      if (this.engagementModelValue == "") {
        this.enModFlag = true;
      }
      if (this.tcvValue == null || this.tcvValue == '' || !this.tcvValue) {
        this.tcvFlag = true;
      }
      if (!this.oppNameFlag && !this.accNameFlag && !this.srcNameFlag && !this.curNameFlag && !this.verNameFlag && !this.oppRegNameFlag && !this.vsoNameFlag && !this.descriptionFlag && !this.serLineFlag && !this.pracFlag && !this.subPraFlag && !this.slBdmFlag && !this.enModFlag && !this.tcvFlag) {
        this.service.loaderhome = true;
        if (this.estClosureDate) {
          this.time = this.datePipe.transform(this.estClosureDate, 'yyyy-MM-dd');
        }
        else {
          this.time = this.datePipe.transform(this.defaultestClosureDate, 'yyyy-MM-dd');
        }
        this.serviceLineObj = [{
          WiproEngagementmodel: this.engagementModelValue,
          WiproEstsltcv: this.tcvValue,
          WiproPracticeId: this.practiceValue,
          WiproSubpracticeid: this.subPracticeValue,
          WiproSlbdmid: this.slBdValue,
          WiproServicelineidValue: this.serviceValue

        }];
        this.CreateOpportunityObject =
          {
            OwnerId: this.userGuid,
            WiproSimpledeal: this.simpleDeal,
            WiproPipelinestage: this.stageSelected,
            Name: this.opportunityName,
            DomainTribe: "",
            Chapter: "",
            TargetedArea: "",
            Parentaccountid: this.detailsId,
            WiproSource: this.sourceValue,
            WiproProposaltype: '',//this.proposalTypeValue,
            WiproCurrency: this.cuId,
            WiproVertical: this.verticalValue,
            WiproSubvertical: "",
            WiproCbu: this.cbuListValue,
            WiproContractingcountry: this.countId,
            WiproContractingcity: this.cityId,
            WiproState: this.stateId,
            WiproSbu: this.sbuForSave,
            WiproRegion: this.oppRegionValue,
            WiproGeography: this.geoGuidForSave,
            BigBet: this.digitalBigBetsValue,
            WiproVerticalsalesowner: this.verSaOwId,
            Estimatedclosedate: this.time,
            WiproDurationinmonths: this.projectDuiration,
            WiproProposalsubmissionduedate: this.proposalSubmissionselectedDate,
            WiproAdvisorname: this.adNameId,
            WiproAdvisorcontacts: this.adContactId,
            WiproAdvisorowner: this.adOwnerId,
            WiproIsbgcgemd: this.bgCgEmd,
            WiproEstimatedEmpanelmentValue: '',//this.estEmpValue,
            WiproEstimatedRFIValue: '',//this.estRfiValue,
            WiproScopeOfWork: this.textDescription,
            WiproPrimarycontact: this.detailsId1,
            WiproSapcode: "",//this.sapId,
            WiproLinkedLeadType: this.linkedLeadObj.leadType,
            WiproOriginatingLead: this.linkedLeadObj.originatingLeadId,
            ServiceLines: this.serviceLineObj,
            OppLinkedLeads: [
              {
                "LeadSourceId": this.linkedLeadObj.leadSourceId,
                "LeadSourceDetailsId": this.linkedLeadObj.leadSrcDtlId,
                "CampaignId": this.linkedLeadObj.leadSrcDtlId == 3 || this.linkedLeadObj.leadSrcDtlId == 4 ? this.linkedLeadObj.leadDtlId : '',
                "AccountId": (this.linkedLeadObj.leadSrcDtlId == 2 || this.linkedLeadObj.leadSrcDtlId == 7 || this.linkedLeadObj.leadSrcDtlId == 8) ? this.linkedLeadObj.leadDtlId : '',
                "SysGuid": "",
                "Comments": this.linkedLeadObj.leadSrcDtlId == 5 ? this.linkedLeadObj.comments : '',
                "LeadGuid": ""
              }
            ],
            DecisionMakers: this.selecteddecisionContactsForSave,
            OpportunityAGPs: this.linkedAgpForSave,
            OwnerName: localStorage.getItem('upn'),
            OwnerEmailId: localStorage.getItem('userEmail').replace(/"/g, "")
          }
        this.projectService.saveOpportunityData(this.CreateOpportunityObject).subscribe(res => {
          if (!res.IsError) {
            this.result = res.ResponseObject
            if (res.ResponseObject != null) {
              this.service.loaderhome = false;
              this.OpportunityNum = this.result.OpportunityNumber;
              console.log('final response', this.OpportunityNum);
              this.savesuccess = this.successMsg + this.OpportunityNum + ")";
              this.projectService.setSession('opportunityId', res.ResponseObject.OpportunityId);
              this.projectService.setSession('opportunityName', res.ResponseObject.name);
              this.projectService.setSession('FullAccess', true);
              this.projectService.setSession('IsStaffingInitiated', false);
              this.projectService.setSession('WiproIsAutoClose', false);
              this.projectService.setSession('newOpportunity', true);
              this.projectService.setSession('SuspendCount', true)
              this.projectService.setSession('IsOAR', true)
              this.projectService.setSession('SuspendedDuration', true)
              this.projectService.setSession('opportunityStatus', '1');
              this.projectService.setSession('IsAmendment', false);
              this.projectService.setSession('BFMNavagationFlag', false);
              this.projectService.clearSession('AdvisorOwnerId')
              this.service.newOpportunities = true;
              this.ClearRedisCache();
              this.orderService.getWTstatus({
                OrderOrOpportunityId: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                IsOrderCheckNonBPO: false
              }).subscribe((WTResponse : any) => {
                var WTflag = false;
                if(!WTResponse.IsError && WTResponse.ResponseObject[0]) {
                  WTflag = WTResponse.ResponseObject[0].IsWT;
                }
                this.orderService.setNonWTstatus({
                  Guid: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                  Flag: !WTflag,
                  IsProceedToClose: true
                }).subscribe(NotWTResponse => {
                  console.log('NotWTResponse', NotWTResponse);
                });
              });
              this.projectService.displayMessageerror(this.savesuccess);
              this.isLoading = true;

              this.router.navigate(['/opportunity/opportunityview/overview']);
            }
            else {
              this.projectService.displayMessageerror('Data not found');
              this.service.loaderhome = false;
            }
          }
          else {
            this.projectService.displayMessageerror('Error occured while saving data');
            this.service.loaderhome = false;
          }
        }, (err) => {
          this.projectService.displayerror(err.status);
          this.service.loaderhome = false;
        })

      }

    }

    else {
      this.time = this.datePipe.transform(this.estClosureDate, 'yyyy-MM-dd');
      if (this.opportunityName == "" && this.details == "" && this.sapName == "" && this.sourceValue == "" && this.cbuListValue == "") {
        this.errorFlag = true;
        this.projectService.displayMessageerror('Please enter your details before saving');
      }
      if (this.opportunityName == "" || this.opportunityName.replace(/\s/g, "").length == 0) {
        this.oppNameFlag = true;
        this.OppNameErr = 'Opportunity name is mandatory';
      }
      else if(this.opportunityName == "-") {
        this.oppNameFlag = true;
        this.OppNameErr = 'Please enter valid name';
      }
      if (this.detailsId == "") {
        this.accNameFlag = true;
      }
      if (!this.showRequestSAP && this.sapName == "") {
        this.sapFlag = true;
      }
      if (this.sourceValue == "" || !this.sourceValue) {
        this.srcNameFlag = true;
      }
      else if (this.sourceValue === 184450000 && !this.linkedLeadObj.leadType) {
        this.srcNameFlag = true;
        this.linkedLeadErr = true;
      }
      if (this.proposalTypeValue == "") {
        this.proNameFlag = true;
      }
      if (this.cuId == "") {
        this.curNameFlag = true;
      }
      if (this.verticalValue == "" || !this.verticalValue) {
        this.verNameFlag = true;
      }
      if (this.cbuListValue == "" || !this.cbuListValue) {
        this.cbuNameFlag = true;
      }
      if (this.oppRegionValue == "" || !this.oppRegionValue) {
        this.oppRegNameFlag = true;
      }
      if (this.verSaOwId == "" || !this.verSaOwId) {
        this.vsoNameFlag = true;
      }
      if (this.digitalBigBetsValue == "") {
        this.dbbFlag = true;
      }
      if (this.projectDuiration == null) {
        this.projDurFlag = true;
      }
      if (this.countName == "") {
        this.countryFlag = true;
      }
      if (this.stateId == "" && this.scFlag && (this.countId && (this.countName == "INDIA" || this.countName == "UNITED KINGDOM" || this.countName == "USA"
      || this.countName == "United States" || this.countName == "UK" || this.countName == "India"
      || this.countName == "United Kingdom" || this.countName == "UNITED STATES"))) {
        this.stateNameFlag = true;
      }
      if (this.cityId == "" && !this.noCityFlag) {
        this.cityNameFlag = true;
      }
      if (this.adName == "") {
        this.advNameFlag = true;
      }
      if (this.adContactName == "" && this.noAdvisorId != this.adNameId) {
        this.advContactFlag = true;
      }
      if (this.adOwnerName == "") {
        this.accOwnerFlag = true;
      }
      if (this.empFlagMatch) {
        this.empError = true;
      }
      if (this.rfiFlagMatch) {
        this.rfiError = true;
      }
      if (this.empMainCheck) {
        debugger;
        if (parseFloat(this.estEmpValue) < parseFloat(this.tcvValue)) {
          this.tcvEmpCheck = true;
        }
        else {
          // this.empMainCheck = false;
          this.tcvEmpCheck = false;
        }
      }
      if (this.rfiMainCheck) {
        if (parseFloat(this.estRfiValue) < parseFloat(this.tcvValue)) {
          this.tcvRfiCheck = true;
        }
        else {
          // this.rfiMainCheck = false;
          this.tcvRfiCheck = false;
        }
      }
      if (this.textDescription == "" || this.textDescription.replace(/\s/g, "").length == 0) {
        this.descriptionFlag = true;
      }
       if (this.selecteddecisionContactsForSave.length == 0) {
        this.cDMCFlag = true;
      }
      if (this.details1 == "") {
        this.priCustFlag = true;
      }
      if (this.serviceValue == "") {
        this.serLineFlag = true;
      }
       if ((this.practiceValue == "" || !this.practiceValue) && this.flagPactice == false) {
        this.pracFlag = true;
      }
       if ((this.subPracticeValue == "" || !this.subPracticeValue) && this.flagSubPactice == false) {
        this.subPraFlag = true;
      }
      if (this.slBdValue == "" || !this.slBdValue) {
        this.slBdmFlag = true;
      }
       if (this.engagementModelValue == "") {
        this.enModFlag = true;
      }
        if (this.tcvValue == null || this.tcvValue == '' || !this.tcvValue) {
        this.tcvFlag = true;
      }
      if (this.estClosureDate == null) {
        this.estFlag = true;
      }
        if (this.engStartDate == null && this.Securediv) {
        this.engStartDateFlag = true;
      }
       if (this.engEndDate == null && this.Securediv) {
        this.engEndDateFlag = true;
      }
        if (this.submittedDate == null && this.Securediv) {
        this.submittedDateFlag = true;
      }
     if (this.shortlistedDate == null && this.Securediv) {
        this.shortlistedDateFlag = true;
      }
         if (this.proposalSubmissionDate == null && this.stageSelected > 184450001) {
        this.proposalDateFlag = true;
      }
      if (!this.oppNameFlag && !this.accNameFlag && !this.sapFlag && !this.srcNameFlag && !this.proNameFlag && !this.curNameFlag && !this.verNameFlag && !this.cbuNameFlag && !this.oppRegNameFlag && !this.vsoNameFlag && !this.dbbFlag && !this.projDurFlag && !this.countryFlag && !this.stateNameFlag && !this.cityNameFlag && !this.advNameFlag && !this.advContactFlag && !this.accOwnerFlag && !this.empError && !this.rfiError && !this.tcvEmpCheck && !this.tcvRfiCheck && !this.descriptionFlag && !this.cDMCFlag && !this.priCustFlag && !this.serLineFlag && !this.pracFlag && !this.subPraFlag && !this.slBdmFlag && !this.enModFlag && !this.tcvFlag && !this.estFlag && !this.engStartDateFlag && !this.engEndDateFlag && !this.submittedDateFlag && !this.shortlistedDateFlag && !this.proposalDateFlag) {
        this.service.loaderhome = true;
        this.serviceLineObj = [{
          WiproEngagementmodel: this.engagementModelValue,
          WiproEstsltcv: this.tcvValue,
          WiproPracticeId: this.practiceValue,
          WiproSubpracticeid: this.subPracticeValue,
          WiproSlbdmid: this.slBdValue,
          WiproServicelineidValue: this.serviceValue
        }];
        this.CreateOpportunityObject =
          {
            OwnerId: this.userGuid,
            WiproSimpledeal: this.simpleDeal,
            WiproPipelinestage: this.stageSelected,
            Name: this.opportunityName,
            DomainTribe: "",
            Chapter: "",
            TargetedArea: "",
            Parentaccountid: this.detailsId,
            WiproSource: this.sourceValue,
            WiproProposaltype: this.proposalTypeValue,
            WiproCurrency: this.cuId,
            WiproVertical: this.verticalValue,
            WiproSubvertical: "",
            WiproCbu: this.cbuListValue,
            WiproContractingcountry: this.countId,
            WiproContractingcity: this.cityId,
            WiproState: this.stateId,
            WiproSbu: this.sbuForSave,
            WiproRegion: this.oppRegionValue,
            WiproGeography: this.geoGuidForSave,
            BigBet: this.digitalBigBetsValue,
            WiproVerticalsalesowner: this.verSaOwId,
            Estimatedclosedate: this.time,
            WiproDurationinmonths: this.projectDuiration,
            WiproProposalsubmissionduedate: this.proposalSubmissionselectedDate,
            WiproAdvisorname: this.adNameId,
            WiproAdvisorcontacts: this.adContactId,
            WiproAdvisorowner: this.adOwnerId,
            WiproIsbgcgemd: this.bgCgEmd,
            WiproEstimatedEmpanelmentValue: this.estEmpValue,
            WiproEstimatedRFIValue: this.estRfiValue,
            WiproScopeOfWork: this.textDescription,
            WiproPrimarycontact: this.detailsId1,
            WiproSapcode: this.sapId,
            WiproLinkedLeadType: this.linkedLeadObj.leadType,
            WiproOriginatingLead: this.linkedLeadObj.originatingLeadId,
            ServiceLines: this.serviceLineObj,
            OppLinkedLeads: [
              {
                "LeadSourceId": this.linkedLeadObj.leadSourceId,
                "LeadSourceDetailsId": this.linkedLeadObj.leadSrcDtlId,
                "CampaignId": this.linkedLeadObj.leadSrcDtlId == 3 || this.linkedLeadObj.leadSrcDtlId == 4 ? this.linkedLeadObj.leadDtlId : '',
                "AccountId": (this.linkedLeadObj.leadSrcDtlId == 2 || this.linkedLeadObj.leadSrcDtlId == 7 || this.linkedLeadObj.leadSrcDtlId == 8) ? this.linkedLeadObj.leadDtlId : '',
                "SysGuid": "",
                "Comments": this.linkedLeadObj.leadSrcDtlId == 5 ? this.linkedLeadObj.comments : '',
                "LeadGuid": ""
              }
            ],
            DecisionMakers: this.selecteddecisionContactsForSave,
            OpportunityAGPs: this.linkedAgpForSave,
            CloseDecisionDate: this.decisionSelectedDate,
            EngagementEndDate: this.engEndselectedDate,
            EngagementStartDate: this.engStartselectedDate,
            ShortlistedDate: this.shortlistedselectedDate,
            SubmittedDate: this.submittedselectedDate,
            OwnerName: localStorage.getItem('upn'),
            OwnerEmailId: localStorage.getItem('userEmail').replace(/"/g, "")
          }
        this.projectService.saveOpportunityData(this.CreateOpportunityObject).subscribe(res => {
          if (!res.IsError) {
            this.result = res.ResponseObject
            if (res.ResponseObject != null) {
              this.service.loaderhome = false;
              this.OpportunityNum = this.result.OpportunityNumber;
              console.log('final response', this.OpportunityNum);
              this.savesuccess = this.successMsg + this.OpportunityNum + ")";
              this.projectService.setSession('opportunityId', res.ResponseObject.OpportunityId);
              this.projectService.setSession('opportunityName', res.ResponseObject.name);
              this.projectService.setSession('FullAccess', true);
              this.projectService.setSession('IsStaffingInitiated', false);

              this.projectService.setSession('WiproIsAutoClose', false);
              this.projectService.setSession('newOpportunity', true);
              this.projectService.setSession('SuspendCount', true)
              this.projectService.setSession('IsOAR', true)
              this.projectService.setSession('opportunityStatus', '1');
              this.projectService.setSession('IsAmendment', false);
              this.projectService.setSession('BFMNavagationFlag', false);
              this.projectService.clearSession('AdvisorOwnerId')
              this.service.newOpportunities = true;
              this.ClearRedisCache();
              this.orderService.getWTstatus({
                OrderOrOpportunityId: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                IsOrderCheckNonBPO: false
              }).subscribe((WTResponse : any) => {
                var WTflag = false;
                if(!WTResponse.IsError && WTResponse.ResponseObject[0]) {
                  WTflag = WTResponse.ResponseObject[0].IsWT;
                }
                this.orderService.setNonWTstatus({
                  Guid: res.ResponseObject.OpportunityId,//this.OpportunityNum,
                  Flag: !WTflag,
                  IsProceedToClose: true
                }).subscribe(NotWTResponse => {
                  console.log('NotWTResponse', NotWTResponse);
                });
              });
              this.projectService.displayMessageerror(this.savesuccess);
              this.isLoading = true;
              this.router.navigate(['/opportunity/opportunityview/overview']);
            }
            else {
              this.projectService.displayMessageerror('Data not found');
              this.service.loaderhome = false;
            }
          }
          else {
            this.projectService.displayMessageerror('Error occured while saving data');
            this.service.loaderhome = false;
          }
        }, (err) => {
          this.projectService.displayerror(err.status);
          this.service.loaderhome = false;
        })
      }
    }

  }
  openClearPopup() {
    let dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: { 
        message: "Are you sure you want to clear the changes",
        buttonText: "OK",
        Header: "Clear" }
    });

     dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.ClearFormData('CLEAR');
      }
    });
  }

  clearErrorFlags() {
    this.errorFlag = false;
    this.oppNameFlag = false;
    this.accNameFlag = false;
    this.sapFlag = false;
    this.srcNameFlag = false;
    this.linkedLeadErr = false;
    this.curNameFlag = false;
    this.verNameFlag = false;
    this.cbuNameFlag = false;
    this.oppRegNameFlag = false;
    this.vsoNameFlag = false;
    this.dbbFlag = false;
    this.projDurFlag = false;
    this.countryFlag = false;
    this.stateNameFlag = false;
    this.cityNameFlag = false;
    this.descriptionFlag = false;
    this.cDMCFlag = false;
    this.priCustFlag = false;
    this.serLineFlag = false;
    this.pracFlag = false;
    this.subPraFlag = false;
    this.slBdmFlag = false;
    this.enModFlag = false;
    this.tcvFlag = false;
    this.estFlag = false;
    this.proposalDateFlag = false;
    this.engStartDateFlag = false;
    this.engEndDateFlag = false;
    this.submittedDateFlag = false;
    this.shortlistedDateFlag = false;
    this.proposalDateFlag = false;
    this.accOwnerFlag = false;
    this.advContactFlag = false;
    this.rfiError = false;
    this.empError = false;
    this.advNameFlag = false;
    this.proNameFlag = false;
  }
  ngOnDestroy() {
    sessionStorage.removeItem('CreateOpportunityFromLead');
    // sessionStorage.removeItem('accountDetails');
    if(this.fromAccountFlag || this.fromLeadFlag) {
      this.fromLeadFlag = false;
      this.fromAccountFlag = false;
      this.ClearFormData();
    }
  }

}





/****************   upload popup start        **************/

@Component({
  selector: 'attach-popup',
  templateUrl: './attachfile.html',
  styleUrls: ['./new-opportunity.component.scss']
})

export class attachpop {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  fileExtension: any;
  constructor(public dialogRef: MatDialogRef<attachpop>, public service: DataCommunicationService) {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }
  onUploadOutput(output: UploadOutput): void {

    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: 'https://ngx-uploader.com/upload',
        method: 'POST',
        data: { foo: 'bar' }
      };

      this.uploadInput.emit(event);

    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {

      this.files.push(output.file);
      this.service.filesList.push(output.file);

    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {

    }
    this.service.filename = output.file.name;
    this.fileExtension = this.service.filename.split('.').pop();

    output.file.sub = this.fileExtension;

  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'https://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' }
    };

  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  deleteUploadedFile(event) {

    this.files.splice(event, 1);
    this.service.filesList.splice(event, 1);
  }
}


/****************** upload popup END  */

/* Convert to normal deal Popup starts */
@Component({
  selector: 'app-convert-deal',
  templateUrl: '../new-opportunity/convert-deal.html',
})
export class ConvertNormalDealPopup {
  tcvValue = '';
  constructor(public dialogRef: MatDialogRef<ConvertNormalDealPopup>, public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    debugger;
    console.log("dsata", this.data);
    this.tcvValue = this.data.tcvVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  onNoClick(flag) {
    this.dialogRef.close(flag);
  }

  onReachEnd(event, id) {
    document.getElementById(id).click();
  }

  loadMoreEvent() {
  }
}
/* Convert to normal deal Popup starts */
