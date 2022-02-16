import { Component, Inject, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { OpportunitiesService, opportunityAdvnHeaders, opportunityAdvnNames } from '@app/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { CustomerpopupComponent } from '@app/shared/components/customerpopup/customerpopup.component';
import { LeadsourcePopupComponent } from '@app/shared/components/single-table/sprint4Modal/leadsource-popup/leadsource-popup.component';
import { stringify } from 'querystring';
import { CBUpopupComponent } from '@app/shared/components/single-table/sprint4Modal/cbupopup/cbupopup.component';
import { SapPopupComponent } from '@app/shared/components/single-table/sprint4Modal/sap-popup/sap-popup.component';
import { ConvertNormalDealPopup } from '../../../new-opportunity/new-opportunity.component';
import { integratedDealPopup } from '../../opportunity-view.component';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [DatePipe]
})
export class OverviewComponent implements OnInit {
  table_data = [];
  engagement_table_data = [];
  /******************Link leads  autocomplete code start ****************** */
  showlead: boolean = false;
  contactlead: string;
  contactleadSwitch: boolean = true;
  contactleadclose() {
    this.contactleadSwitch = false;
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }


  appendlead(value: string, i) {
    this.contactlead = value;
    this.selectedlead.push(this.leadContact[i])
  }
  leadContact: {}[] = [
    { index: 0, contact: 'Lead name 01', initials: 'SL', value: true, designation: 'Delivery manager' },
    { index: 1, contact: 'Lead name 02', initials: 'SL', value: false, designation: 'Delivery manager' },
    { index: 2, contact: 'Lead name 03', initials: 'SL', value: false, designation: 'Delivery manager' },
    { index: 3, contact: 'Lead name 04', initials: 'SL', value: false, designation: 'Delivery manager' },
  ]
  selectedlead: {}[] = [];
  /****************** Link leads  autocomplete code end ****************** */
  panelOpenState1 = true;
  @ViewChild('overviewForm')
  public userFrm: NgForm;
  overviewForm
  contactName;
  is_edit = true;
  panelOpenState3readonly: boolean = true;
  panelOpenState3: boolean;
  panelOpenState2: boolean;
  validation_window: boolean = false;
  validation_window2: boolean = false;
  validation_window3: boolean = false;
  validation_window4: boolean = false;
  proceedToQualify: boolean = false;
  proceedTopursuit: boolean = false;
  proceedToSecure: boolean = false;
  proceedToClose: boolean = false;
  isSorceLead: boolean = false;
  oppNameFlag: boolean = false;
  geography;
  qualifyForm: FormGroup;
  generalForm: FormGroup;
  persuitForm: FormGroup;
  secureForm: FormGroup;
  closeForm: FormGroup;
  createForm: FormGroup;
  panelMandateFields: boolean = true;
  mandatoryFields: any = [];
  mandatoryFields1: any = [];
  mandatoryFields2: any = [];
  mandatoryFields3: any = [];
  wiproContactArray: any = [];
  serviceLineArray: any = [];
  EmailListArray: any = [];
  //Opportunity overview Declarations start*
  overviewDetailData: any = {};
  CBUList: any = [];
  cbuName: string = "";
  cbuSysGuid: string = "";
  AdvisorData: any = [];
  wiproLinkedAGPArray: any = [];
  verticalList: any = [];
  countryList: any = [];
  regionList: any = [];
  stateList: any = [];
  cityList: any = [];
  opportunityOwnerId;
  //DomainList = [];
  //ChapterList: any = [];
  //TargetList: any = [];
  verticalOwner: any = [];
  ContactListArray: any = [];
  advisorContactArray: any = [];
  CustomerContactArray: any = [];
  dataHeader = { name: 'Name', Id: 'SysGuid' };
  dataHeaderVerticalSalesOwner = { name: 'UserName', Id: 'UserId' };
  dataHeaderCountry = { name: 'CountryName', Id: 'SysGuid' }
  selectedAdvisorName: any = [];
  advisorSysGuid: string = "";
  advisorName: string = "";
  interval;
  AGPName: string = "";
  AGPId: string = "";
  advisorOwner: string = "";
  advisorOwnerMapGuid: string = "";
  SelectedAccountObj: any = { SysGuid: "", Name: "" };
  accountName: string = "";
  accountSysGuid: string = "";
  accountOwner: string = "";
  accountOwnerId: string = "";
  stageValue: string = "";
  AccountNameArray: any = [];
  SelectedCurrencyObj: any = { SysGuid: "", Name: "" };
  redisVerticalOwnerSalesSave: any = { SysGuid: "", Name: "" };
  currencyName: string = "";
  currencySysGuid: string = "";
  CurrencyNameArray: any = [];
  selectedAdvisorContactObj: any = { SysGuid: "", Name: "" };
  advisorContact: string = "";
  advisorContactSysGuid: string = "";
  selectedVerticalSalesOwnerObj: any = { SysGuid: "", Name: "" };
  VerticalSalesOwnerName: string = "";
  VerticalSalesOwnerSysGuid: string = "";
  selectedPrimaryContactObj: any = { SysGuid: "", Name: "" };
  primaryContactName: string = "";
  primaryContactSysGuid: string = "";
  isBgYes: boolean;
  isBgNo: boolean;
  verticalSalesOwnerData: any = [];
  projectState: string = "";
  filteredContactName: any = {};
  filteredAGP: any = {};
  selectedContact: any = [];
  savedDMC: any = [];
  selectedAGPArray: any = [];
  agpFromAPI: any = [];
  createFormErrorCheck: boolean;
  qualifyFormErrorCheck: boolean;
  persuitFormErrorCheck: boolean;
  secureFormErrorCheck: boolean;
  selectedLinkedAGPForSave: any = [];
  updatedStage: string = "";
  closeStage: boolean = false;
  showSapCodeErrorColor: boolean = false;
  currentDate = new Date();
  estimateDateFlagCheck: boolean = false;
  disableVSO: boolean = true;
  maxEstDate = (new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate()));
  decDate = new Date();
  estimatedclosedate: string = "";
  estselectedDate: string;
  proposalSubmissionDate: string = "";
  proposalSubmissionselectedDate: string;
  engStartDate: string = "";
  engStartselectedDate: string;
  engEndDate: string = "";
  engEndselectedDate: string;
  submittedDate: string = "";
  submittedselectedDate: string;
  shortlistedDate: string = "";
  shortlistedselectedDate: string;
  decisionDate: string = "";
  decisionSelectedDate: string;
  sapData: any = [];
  selectedsapCodetObj: any = { SysGuid: "", Name: "" };
  sapArrayForLookUp: any = [];
  advisorArrayForLookUp: any = [];
  currencyArrayForLookUp: any = [];
  cbuArrayForLookUp: any = [];
  advisorContactArrayForLookUp: any = [];
  verticalSalesArrayForLookUp: any = [];
  primaryContactArrayForLookUp: any = [];
  countryArrayForLookUp: any = [];
  stateArrayForLookUp: any = [];
  cityArrayForLookUp: any = [];
  sapCodeName: string = "";
  sapCodeSysGuid: string = "";
  //selectedCountryName: any = [];
  countrySysGuid: string = "";
  countryName: string = "";
  selectedCountryObj: any = { SysGuid: "", Name: "" };
  stateSysGuid: string = "";
  stateName: string = "";
  selectedStateObj: any = { SysGuid: "", Name: "" };
  citySysGuid: string = "";
  cityName: string = "";
  selectedCityObj: any = { SysGuid: "", Name: "" };
  selectedCbuObj: any = { SysGuid: "", Name: "" };
  isMandatoryFlagSC:boolean=false;
  DMC: string = "";
  oldStateValue: string = "";
  oldCityValue: string = "";
  oldCountryValue: string = "";
  oldAdvisorContact: string = "";
  oldAdvisorOwner: string = "";
  oldAdvisorName: string = "";
  oldPrimaryContact: string = "";
  oldSapName:string="";
  maxDate;
  createdDate;
  isLoading: boolean = false;
  proposalTypeValue;
  countryFlag: boolean = false;
  verticalFlag: boolean = false;
  IsSimpleDealFlag: boolean = false;
  action: any;
  //domainValue: string = "";
  //chapterValue: string = "";
  //targetValue: string = "";
  proposaltypeCheck: string = "";
  rfiValue: string = "";
  empanelmentValue: string = "";
  isSearchLoader = false;
  partialAccessPermission: boolean = false;
  fullAccessPermission: boolean = false;
  isAdvisorFunction: boolean = false;
  // IsPreSaleAndRole: boolean = false;
  readOnlyFlag: boolean = false;
  fullAccessSessionCheck: boolean = false;
  roleObject: any = {};
  SourceList: any = [];
  ProposalTypeList: any = [];
  DigitalList: any = [];
  IsSimpleDeal: boolean;
  ENUSBUId;
  IndiaSBUId;
  WiproSbu;
  sbuName;
  showISBgvalue: boolean = false;
  noAdvisorId;
  noAdvisor: boolean = false;
  opportunityStatusCheck;
  orderCreatedCheck: boolean = false;
  isAppirioFromSession: boolean = false;
  noCityFlag: boolean = true;
  sourceflag: boolean = true;
  opportunityId;
  empID;
  OpportunityTCV;
  displayText: string = "";
  description: string = "";
  leadSourceArray: any = [];
  leadType: any = {};
  orginatingDetails: any = {};
  leadSourceDetails: any = [];
  showSAPCode: boolean = false;
  noSapCode: boolean = false;
  userGuid;
  sapCodeDisabled: boolean = false;
  AppointmentId: "";
  sapCodePlaceholder = 'Enter SAP code';
  loadDataFromRedis: boolean = false;
  redisArray: any = [];
  competitorFlag: boolean = false;
  SLFlag: boolean = false;
  IPFlag: boolean = false;
  cloudFlag: boolean = true;
  secureStageOppCreation: boolean = false;
  pursuitStage: boolean = false;
  solesource: boolean = false;
  competitorList: any = [];
  OpportunityTypeId: boolean = true;
  disableVertical: boolean = false;
  IsRegionChange: boolean = false;
  currencyMultiplier: number;
  simpleDealValidation: boolean = false;
  wiproTCV: number;
  opportunityDataForSave: any = {};
  showDASpocAttributes:boolean=false;
  isNonWt:boolean=false;
  DASpocName:string="";
  DASpocId:string="";
  IsDeliverySpocRole:boolean=false;
  //IsDASpocForOpp:boolean=false;
  isHelpDeskRole:boolean=false;
  isEnableDACheckBox:boolean=false;
  IsDaSpocApproval:boolean=false;
  tcvValue;
  DASpocValidationCheck:boolean=false;
  disableQualify:boolean=true;
  disablePursuit:boolean=true;
  disableSecure:boolean=true;
  disableClose:boolean=true;



  //Opportunity overview Declarations end*


  constructor(public dialog: MatDialog,
    public service: DataCommunicationService, private snackBar: MatSnackBar, private router: Router, private EncrDecr: EncrDecrService,
    private _fb: FormBuilder, private el: ElementRef,
    public projectService: OpportunitiesService, private datePipe: DatePipe,
    public daService: DigitalAssistantService, 
    public assistantGlobalService: AssistantGlobalService) {
    // window.onscroll = () => {
    //   if (document.getElementById("arrow_icon")) {
    //     if (window.pageYOffset > 300) {
    //       document.getElementById("arrow_icon").className = "display-block Arrow"
    //     }
    //     else
    //       document.getElementById("arrow_icon").className = "display-none"
    //   }
    // }
    // this.assistantGlobalService.setEmails(['gangadhara'])
    this.saveMethodCall = this.saveMethodCall.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveMethodCall);

       this.validateFormToInitiateSave = this.validateFormToInitiateSave.bind(this);
 this.eventSubscriber2(this.projectService.validateFormForSaveCall, this.validateFormToInitiateSave);
    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit);
    //advisor function
    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber3(this.projectService.overviewSubscription, this.ngOnInit);

  }
  /******************linked AGP  autocomplete code start ****************** */

  showTag: boolean = false;
  contactTagCheck: boolean = false;
  contactTag: string;
  contactTagSwitch: boolean = true;
  OpenCBU() {
    const dialogRef = this.dialog.open(CBUpopupComponent, {
      width: '450px',
      data: { 'accountID': this.accountSysGuid }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res, "result");
      if (!res.IsError) {
        let obj = {
          "Name": res.ResponseObject.CbuName ? res.ResponseObject.CbuName : "",
          "SysGuid": res.ResponseObject.cbuId ? res.ResponseObject.cbuId : ""
        }
        this.selectedCbu(obj);
      }
      else {
        this.projectService.displayMessageerror(res.Message)
      }
    });
  }
  // scroll to invalid elements starts here
  scroll(el) {
    if (el) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: document.getElementById(el.elementId).getBoundingClientRect().top + window.scrollY - 150
      })
      setTimeout(() => {
        document.getElementById(el.elementId).focus();
      }, 1000);
    }
  }
  // scroll to invalid element ends here
  //   scroll(el: HTMLElement) {
  //     alert('hello');
  //     el.scrollIntoView();
  // }
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
  openLeadPopup() {
    this.linkedLeadObj = {
      leadType: this.leadType.SysGuid ? this.leadType.SysGuid : null,
      leadSourceId: this.leadSourceDetails.length && this.leadSourceDetails[0].LeadSourceId ? this.leadSourceDetails[0].LeadSourceId : null,
      leadSourceName: this.leadSourceDetails.length && this.leadSourceDetails[0].LeadSourceName ? this.leadSourceDetails[0].LeadSourceName : '',
      leadSrcDtlId: this.leadSourceDetails.length && this.leadSourceDetails[0].LeadSourceDetailsId ? this.leadSourceDetails[0].LeadSourceDetailsId : null,
      leadSrcDtlName: this.leadSourceDetails.length && this.leadSourceDetails[0].LeadSourceDetailsName ? this.leadSourceDetails[0].LeadSourceDetailsName : '',
      leadDtlId: this.leadSourceDetails.length && this.leadSourceDetails[0].SysLeadId ? this.leadSourceDetails[0].SysLeadId : null,
      leadDetails: this.leadSourceDetails.length && this.leadSourceDetails[0].SysLeadName ? this.leadSourceDetails[0].SysLeadName : '',
      comments: this.leadSourceDetails.length && this.leadSourceDetails[0].SysLeadName ? this.leadSourceDetails[0].SysLeadName : '',
      originatingLeadId: Object.keys(this.orginatingDetails).length && this.orginatingDetails.SysGuid ? this.orginatingDetails.SysGuid : '',
      originatingLeadName: Object.keys(this.orginatingDetails).length && this.orginatingDetails.Name ? this.orginatingDetails.Name : ''
    };
    console.log(this.linkedLeadObj, "ID");
    const dialogRef = this.dialog.open(LeadsourcePopupComponent, {
      width: '500px',
      data: { 'leadSource': this.leadSourceArray, 'values': this.linkedLeadObj, 'accountId': this.accountSysGuid, 'disabledFlag': true }
    });
  }
  oppNameValidation(name) {
    console.log("oppname", name)
    if (name.target.value == "-") {
      this.oppNameFlag = true;
      this.projectService.displayMessageerror('Please enter valid name');
    }
    else {
      this.oppNameFlag = false;
    }
  }
  OpenContactPopup() {
    const dialogRef = this.dialog.open(CustomerpopupComponent, {
      width: '800px',
      data: ({ Name: this.accountName, SysGuid: this.accountSysGuid, isProspect: "" })
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res != '') {
        let obj = {
          "Name": res.FName + res.LName,
          "SysGuid": res.Guid ? res.Guid : ""
        }
        this.selectedPrimaryContact(obj);
        // this.selectedCustomer.push({ FullName: (res['FName'] + ' ' + res['LName']), Designation: res['Designation'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "" });
        // this.sendCustomerToAdvance.push({ FullName: (res['FName'] + ' ' + res['LName']), Designation: res['Designation'], isKeyContact: res['isKeyContact'], Guid: res['Guid'], MapGuid: "", Id: res['Guid'] });
      }
    });
  }
  contactTagclose() {


    this.contactTagSwitch = false;
    this.contactTag = "";

  }
  appendAGP(value: string, agpId) {
    let data = [];
    //this.conv = value;
    this.contactTag = "";
    this.filteredAGP = this.wiproLinkedAGPArray.filter(x => x.Value == agpId)
    if (this.selectedAGPArray.length > 0) {
      data = this.selectedAGPArray.filter(y => y.Value == agpId)
    }
    if (data.length > 0) {
      this.projectService.displayMessageerror("AGP already selected")
    }
    else {
      this.selectedAGPArray.push(this.filteredAGP[0])
      let obj = {
        "WiproName": this.filteredAGP[0].Name,
        "WiproAGPId": this.filteredAGP[0].Value,
        "OppAGPId": ""
      }
      this.selectedLinkedAGPForSave.push(obj);
    }
  }



  // ************************* multiple append autocomplete starts here *************************
  showContact: boolean = false;
  contactNameModel: string = "";
  contactNameSwitch: boolean = true;
  contactNameclose() {
    this.contactNameSwitch = false;
    this.contactNameModel = "";
  }
  appendcontact(item) {
    console.log("contactlist", this.ContactListArray);
    this.DMC = "true";
    let data = [];
    this.contactNameModel = "";
    //this.filteredContactName = this.ContactListArray.filter(x => x.SysGuid == item.SysGuid)
    if (this.selectedContact.length > 0) {
      data = this.selectedContact.filter(y => y.SysGuid == item.SysGuid)
    }
    if (data.length > 0) {
      this.projectService.displayMessageerror("Contact already saved")
    }
    else {
      let obj1 = {
        Name: item.Name,
        SysGuid: item.SysGuid,
        OppDecisionMakerid: item.OppDecisionMakerid,
        Designation: item.Designation
      }
      this.selectedContact.push(obj1)
    }
    if (this.selectedContact.length > 0) {
      this.selectedContact = this.selectedContact.map(data => {
        data.Id = data.SysGuid;
        return data;
      });
    }
    this.AppendRedisCache();
    this.setQualifyForm(this.qualifyForm.value)
  }
  // initials starts here
  getInitials(customerDMakerName) {
    var initials = '';
    if (customerDMakerName) {
      var names = customerDMakerName.split(' ');
      initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
    }
    return initials;
  }
  // initials ends here
  AGPList(data) {
    this.wiproLinkedAGPArray = this.wiproLinkedAGPArray;
  }

  //advisor List API

  AdvisorList(List) {
    let searchText = List.searchValue ? List.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "SearchType": 7,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.projectService.getAdvisorName(obj).subscribe(result => {
      if (!result.IsError) {
        this.AdvisorData = result.ResponseObject
        this.AdvisorData.forEach(x => {
          (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
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
      });
  }
  //advisor List API end*
  //country list API start*
  CountryList(List) {

    let searchText = List.searchValue ? List.searchValue : '';
    var body = {
      "SearchText": searchText,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getCountryList(body).subscribe(Country => {

      if (!Country.IsError) {
        this.countryList = Country.ResponseObject;
        this.countryList.map(data => {
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
    //Country API *end
  }
  //country list API end*
  //sap code  api start*
  getSapData(data) {
    let searchText = data.searchValue ? data.searchValue : '';

    let obj = {
      "SearchText": searchText,
      "Id": this.accountSysGuid,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.projectService.getSapCode(obj).subscribe(result => {
      if (!result.IsError) {
        this.sapData = result.ResponseObject;
        if (this.sapData.length == 1) {
          this.sapData[0].Name=this.getSymbol(this.sapData[0].Name);
          this.selectedSapCode(this.sapData[0]);
          this.AppendRedisCache();
        }
        if (this.sapData.length > 0) {
          this.showSAPCode = false;
          this.noSapCode = false;
          this.sapData.map(data => {
            data.Id = data.SysGuid;
            (data.Name) ? data.Name = this.getSymbol(data.Name) : '-';
          })
        }
        else if (this.overviewDetailData.IsSapcodeRequested) {
          this.sapCodePlaceholder = 'SAP code creation is in process';
          this.sapCodeDisabled = true;
          this.noSapCode = true;
        }
        else {
          this.noSapCode = true;
          this.showSAPCode = true;
          this.getSAPCodeDetails();
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
      }
    )
  }
  sapCodeDetails: any;
  getSAPCodeDetails() {
    this.projectService.getSAPCodeDetails({ "AccountId": this.accountSysGuid }).subscribe(res => {
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

  openSAPcode() {
    console.log(this.sapCodeDetails, "sap")
    const dialogRef = this.dialog.open(SapPopupComponent, {
      width: '900px',
      data: ({ sapCodeDetails: this.sapCodeDetails, curencyName: this.currencyName, vertical: this.overviewDetailData.VerticalName ? this.overviewDetailData.VerticalName : "" })
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //if (result.fileList.length > 0) {
        this.projectService.UploadSapCodeDoc({ "AccountId": this.accountSysGuid, "SAPCODEPdfList": result.fileList.length ? result.fileList : null }).subscribe(res => {
          if (!res.IsError) {
            console.log("appointent id", res);
            this.AppointmentId = res.ResponseObject.AppointmentId;
            let postObj = {
              "AccountId": this.accountSysGuid,
              "AccountName": result.accountDetails.Name,
              "AccountOwner": result.accountDetails.OwnerName,
              "AccountNo": result.accountDetails.AccountNumber,
              "Geography": result.selectedCountry,
              "Opportunity_Won": "No",
              "Vertical": this.overviewDetailData.VerticalName ? this.overviewDetailData.VerticalName : "",
              "Company_Code": result.companyCode,
              "Company_Name": result.companyName,
              "UserAddress": result.address,
              "AppointmentId": this.AppointmentId,
              "Currency": this.currencyName,
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
                this.service.GetRedisCacheData('saveOpportunity').subscribe(result => {
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
                        this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(result => {
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
        //}
        // else {
        //   let postObj = {
        //     "AccountId": this.accountSysGuid,
        //     "AccountName": result.accountDetails.Name,
        //     "AccountOwner": result.accountDetails.OwnerName,
        //     "AccountNo": result.accountDetails.AccountNumber,
        //     "Geography": result.accountDetails.GeoName,
        //     "Opportunity_Won": "",
        //     "Vertical": result.accountDetails.VerticalName,
        //     "UserAddress": result.accountDetails.Address,
        //     "AppointmentId": this.AppointmentId,
        //     "Currency": result.accountDetails.TransactionCurrencyName,
        //     "value": [
        //       {
        //         "UserType": 3,
        //         "UserId": this.userGuid       //Requester
        //       },
        //       {
        //         "UserType": 3,
        //         "UserId": result.accountDetails.OwnerId	   //Account Owner
        //       }
        //     ]
        //   }
        //   this.projectService.createEmail(postObj).subscribe(res => {
        //     console.log(res);
        //     if (!res.IsError) {
        //       //disable sap code and make it non mandatory
        //       this.sapCodeDisabled = true;
        //       this.sapCodePlaceholder = 'SAP code creation is in process';
        //     }
        //     else {
        //       this.projectService.displayMessageerror(res.Message);
        //     }
        //   }, (err) => {
        //     this.projectService.displayerror(err.status);
        //   })
        // }

      }
    })
  }
  //sap code  api end*
  //currency api start*
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
  getCurrency(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getCurrencyData(obj).subscribe(result => {
      if (!result.IsError) {
        this.CurrencyNameArray = result.ResponseObject;
        this.CurrencyNameArray.forEach(x => {
          (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
          (x.Type) ? x.Type = this.getSymbol(x.Type) : '-';
        })
        this.CurrencyNameArray.map(data => {
          data.Id = data.SysGuid;
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
      }
    )
  }
  //currency api end*
  getCBUList(data) {

    let searchText = data.searchValue ? data.searchValue : '';
    var obj = {
      "SearchText": searchText,
      "AccountId": this.accountSysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getCBUData(obj).subscribe(CBUData => {
      if (!CBUData.IsError) {

        this.CBUList = CBUData.ResponseObject;
        this.CBUList.map(data => {
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

  //selected advisor data and auto populate advisor owner
  selectedAdvisorNameObj: any = { SysGuid: "", Name: "" };
  selectedAdvisorOwnerObj: any = { OwnerName: "", OwnerId: "" };
  redisAdvisorOwnerSave: any = { SysGuid: "", Name: "" };
  selectedAdvisor(advisorObject: Object) {
    this.advisorArrayForLookUp = [];
    this.selectedAdvisorNameObj = Object.keys(advisorObject).length ? advisorObject : { SysGuid: "", Name: "" };
    this.selectedAdvisorOwnerObj = Object.keys(advisorObject).length ? advisorObject : { OwnerName: "", OwnerId: "" };
    if (advisorObject && typeof advisorObject === 'object' && Object.keys(advisorObject).length) {
      this.advisorName = this.selectedAdvisorNameObj.Name;
      this.advisorSysGuid = this.selectedAdvisorNameObj.SysGuid;
      this.advisorOwner = this.selectedAdvisorOwnerObj.MapName;
      this.advisorOwnerMapGuid = this.selectedAdvisorOwnerObj.MapGuid;
      this.selectedAdvisorNameObj.Id = this.selectedAdvisorNameObj.SysGuid;
      console.log(this.advisorOwnerMapGuid, "adID")
      this.advisorContact = "";
      this.advisorContactSysGuid = "";
      this.selectedAdvisorContactObj = { SysGuid: "", Name: "" };
    }
    else {
      this.advisorName = "";
      this.advisorSysGuid = "";
      this.advisorOwner = "";
      this.advisorOwnerMapGuid = "";
      this.advisorContact = "";
      this.advisorContactSysGuid = "";
      this.advisorContactArrayForLookUp = [];
      this.selectedAdvisorContactObj = { SysGuid: "", Name: "" };
    }
    if (this.advisorOwnerMapGuid) {
      this.projectService.setSession('AdvisorOwnerId', this.advisorOwnerMapGuid);
    }
    if (Object.keys(advisorObject).length) {
      this.advisorArrayForLookUp.push(this.selectedAdvisorNameObj)
    }
    //when advisor name changes
    if (this.advisorName == "") {
      this.advisorOwner = "";
      this.advisorOwnerMapGuid = "";
    }
    //when advisor name is no advisor
    if (this.noAdvisorId == this.advisorSysGuid) {
      this.noAdvisor = true;
      this.advisorContact = "MakeValid";
      this.advisorContactSysGuid = "";
    }
    else {
      this.noAdvisor = false;
      this.advisorContact = "";
      this.advisorContactSysGuid = "";
      console.log("this.advisorSysGuid", this.advisorSysGuid)
      if (this.advisorSysGuid) {
        this.GetAdvisorContact("");
      }
    }
    this.redisAdvisorOwnerSave = {
      "Name": this.advisorOwner,
      "SysGuid": this.advisorOwnerMapGuid
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  //selected advisor data and advisor owner end
  selectedAdvisorContact(advisorContactObject: Object) {
    this.advisorContactArrayForLookUp = [];
    this.selectedAdvisorContactObj = advisorContactObject;
    if (advisorContactObject && typeof advisorContactObject === 'object' && Object.keys(advisorContactObject).length) {
      this.advisorContact = this.selectedAdvisorContactObj.Name;
      this.advisorContactSysGuid = this.selectedAdvisorContactObj.SysGuid;
      this.selectedAdvisorContactObj.Id = this.selectedAdvisorContactObj.SysGuid;
    }
    else {
      this.advisorContact = "";
      this.advisorContactSysGuid = "";
    }
    if (Object.keys(advisorContactObject).length) {
      this.advisorContactArrayForLookUp.push(this.selectedAdvisorContactObj)
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  //selected AGP
  selectedAGPObj: any = { Value: "", Name: "" };
  selectedAGP(AGPObject: Object) {
    this.selectedAGPObj = AGPObject;
    this.AGPName = this.selectedAGPObj.Name;
    this.AGPId = this.selectedAGPObj.Value;
  }
  //selected country
  selectedCountry(countryObject: Object) {
    this.countryArrayForLookUp = [];
    this.stateArrayForLookUp = [];
    this.cityArrayForLookUp = [];
    this.stateList = [];
    this.cityList = [];
    this.stateName = "";
    this.stateSysGuid = "";
    this.cityName = "";
    this.citySysGuid = "";
    this.selectedStateObj = { SysGuid: "", Name: "" };
    this.selectedCityObj = { SysGuid: "", Name: "" };
    this.selectedCountryObj = Object.keys(countryObject).length ? countryObject : { SysGuid: "", Name: "" };
    if (countryObject && typeof countryObject === 'object' && Object.keys(countryObject).length) {
      this.countryName = this.selectedCountryObj.CountryName;
      this.countrySysGuid = this.selectedCountryObj.SysGuid;
      this.selectedCountryObj.Id = this.selectedCountryObj.SysGuid;
      this.getStateList(this.countrySysGuid);
      if(this.countryName == "INDIA" || this.countryName == "UNITED KINGDOM" || this.countryName == "USA"
      || this.countryName == "United States" || this.countryName == "UK" || this.countryName == "India"
      || this.countryName == "United Kingdom" || this.countryName == "UNITED STATES"){
      this.isMandatoryFlagSC=true;
      }
      else{
      this.isMandatoryFlagSC=false;
      }
    }
    else {
      this.countryName = "";
      this.countrySysGuid = "";
      this.stateName = "";
      this.cityName = "";
      this.citySysGuid = "";
      this.noCityFlag = true;
      this.stateSysGuid = "";
      this.countryFlag = false;
      this.isMandatoryFlagSC=false;
    }
    if (Object.keys(countryObject).length) {
      this.countryArrayForLookUp.push(this.selectedCountryObj);
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  //selected state
  selectedStateList(stateObject: Object) {
    this.stateArrayForLookUp = [];
    this.selectedStateObj = Object.keys(stateObject).length ? stateObject : { SysGuid: "", Name: "" };
    if (stateObject && typeof stateObject === 'object' && Object.keys(stateObject).length) {
      this.stateName = this.selectedStateObj.Name;
      this.stateSysGuid = this.selectedStateObj.SysGuid;
      this.selectedStateObj.Id = this.selectedStateObj.SysGuid;
    }
    else {
      this.stateName = "";
      this.stateSysGuid = "";
    }
    if (Object.keys(stateObject).length) {
      this.stateArrayForLookUp.push(this.selectedStateObj)
    }
    this.cityList = [];
    this.cityName = "";
    this.citySysGuid = "";
    this.selectedCityObj = { SysGuid: "", Name: "" };
    this.getCityList(this.stateSysGuid)
    this.setQualifyForm(this.qualifyForm.value)
  }
  selectedCity(cityObject: Object) {
    this.cityArrayForLookUp = [];
    this.selectedCityObj = Object.keys(cityObject).length ? cityObject : { SysGuid: "", Name: "" };
    if (cityObject && typeof cityObject === 'object' && Object.keys(cityObject).length) {
      this.cityName = this.selectedCityObj.Name;
      this.citySysGuid = this.selectedCityObj.SysGuid;
      this.selectedCityObj.Id = this.selectedCityObj.SysGuid;
    }
    else {
      this.cityName = "";
      this.citySysGuid = "";
    }
    if (Object.keys(cityObject).length) {
      this.cityArrayForLookUp.push(this.selectedCityObj)
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  getStateList(data) {

    let searchText = data.searchValue ? data.searchValue : '';
    var obj = {
      "SearchText": searchText,
      "Id": this.countrySysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getStateList(obj).subscribe(state => {
      if (!state.IsError) {

        this.stateList = state.ResponseObject;
        if (this.stateList.length) {
          this.countryFlag = true;
          this.stateName = "";
        if (this.stateList.length == 1) {
          this.selectedStateList(this.stateList[0]);
          this.AppendRedisCache();
        }
        }
        else {
          this.countryFlag = false;
          this.noCityFlag = true;
          this.stateName = "MakeValid";
          this.cityName = "MakeValid";
        }
        this.setQualifyForm(this.qualifyForm.value);
        this.onChangeHandlerQualifyForm('');
        this.stateList.map(data => {
          data.Id = data.SysGuid;
        })
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
  getStateListOnUserInput(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    var obj = {
      "SearchText": searchText,
      "Id": this.countrySysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getStateList(obj).subscribe(state => {
      if (!state.IsError) {

        this.stateList = state.ResponseObject;
        // if (this.stateList.length) {
        //   this.countryFlag = true;
        //   this.stateName = "";
        // }
        // else {
        //   this.countryFlag = false;
        //   this.noCityFlag = true;
        //   this.stateName = "MakeValid";
        //   this.cityName = "MakeValid";
        // }
        this.setQualifyForm(this.qualifyForm.value)
        this.stateList.map(data => {
          data.Id = data.SysGuid;
        })
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
  selectedVerticalSalesOwner(verticalSalesOwnerObject: Object) {
    this.verticalSalesArrayForLookUp = [];
    this.selectedVerticalSalesOwnerObj = Object.keys(verticalSalesOwnerObject).length ? verticalSalesOwnerObject : { SysGuid: "", Name: "" };;
    if (verticalSalesOwnerObject && typeof verticalSalesOwnerObject === 'object' && Object.keys(verticalSalesOwnerObject).length) {
      this.VerticalSalesOwnerName = this.selectedVerticalSalesOwnerObj.UserName;
      this.VerticalSalesOwnerSysGuid = this.selectedVerticalSalesOwnerObj.UserId;
      this.selectedVerticalSalesOwnerObj.Id = this.selectedVerticalSalesOwnerObj.UserId;
    }
    else {
      this.VerticalSalesOwnerName = "";
      this.VerticalSalesOwnerSysGuid = "";
    }
    if (Object.keys(verticalSalesOwnerObject).length) {
      this.verticalSalesArrayForLookUp.push(this.selectedVerticalSalesOwnerObj);
    }
    this.createForm = this._fb.group({
      ...this.createForm.value,
      verticalSales: [this.VerticalSalesOwnerName, Validators.required],
    })
    this.redisVerticalOwnerSalesSave = {
      "Name": this.VerticalSalesOwnerName,
      "SysGuid": this.VerticalSalesOwnerSysGuid
    }
    this.AppendRedisCache();
  }
  selectedPrimaryContact(primaryContactObject: Object) {
    this.primaryContactArrayForLookUp = [];
    this.selectedPrimaryContactObj = Object.keys(primaryContactObject).length ? primaryContactObject : { SysGuid: "", Name: "" };
    if (primaryContactObject && typeof primaryContactObject === 'object' && Object.keys(primaryContactObject).length) {
      this.primaryContactName = this.selectedPrimaryContactObj.Name;
      this.primaryContactSysGuid = this.selectedPrimaryContactObj.SysGuid;
      this.selectedPrimaryContactObj.Id = this.selectedPrimaryContactObj.SysGuid;
    }
    else {
      this.primaryContactName = "";
      this.primaryContactSysGuid = "";
    }
    if (Object.keys(primaryContactObject).length) {
      this.primaryContactArrayForLookUp.push(this.selectedPrimaryContactObj);
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  selectedSapCode(sapCodeObject: Object) {
    this.sapArrayForLookUp = [];
    this.selectedsapCodetObj = Object.keys(sapCodeObject).length ? sapCodeObject : { SysGuid: "", Name: "" };
    if (sapCodeObject && typeof sapCodeObject === 'object' && Object.keys(sapCodeObject).length) {
      this.selectedsapCodetObj.Id = this.selectedsapCodetObj.SysGuid;
      this.sapCodeName = this.selectedsapCodetObj.Name;
      this.sapCodeSysGuid = this.selectedsapCodetObj.SysGuid;
      this.projectService.setSession("sapName", this.sapCodeName);
    }
    else {
      this.sapCodeName = "";
      this.sapCodeSysGuid = "";
      this.projectService.setSession("sapName", "");
    }
    //In advanced look up select sap code button is enabled-due to which this code was written.
    if (Object.keys(sapCodeObject).length) {
      this.sapArrayForLookUp.push(this.selectedsapCodetObj);
    }
    this.setQualifyForm(this.qualifyForm.value)
  }
  selectedCurrency(currencyObject: Object) {
    this.currencyArrayForLookUp = [];
    this.SelectedCurrencyObj = Object.keys(currencyObject).length ? currencyObject : { SysGuid: "", Name: "" };
    if (currencyObject && typeof currencyObject === 'object' && Object.keys(currencyObject).length) {
      this.SelectedCurrencyObj.Id = this.SelectedCurrencyObj.SysGuid;
      this.currencyName = this.SelectedCurrencyObj.Name;
      this.currencySysGuid = this.SelectedCurrencyObj.SysGuid;
      this.getCurrencyMultiplier();
    }
    else {
      this.currencyName = "";
      this.currencySysGuid = "";
      this.projectService.setSession('tcvValue',"");
    }
    if (Object.keys(currencyObject).length) {
      this.currencyArrayForLookUp.push(currencyObject);
    }
    this.createForm = this._fb.group({
      ...this.createForm.value,
      currency: [this.currencyName, Validators.required],
    })
    this.AppendRedisCache();
  }

  getCurrencyMultiplier() {
    this.projectService.getCurrencyStatus(this.currencySysGuid).subscribe(response => {
      if (!response.IsError) {
        this.currencyMultiplier = parseFloat(response.ResponseObject[0].Name);
        this.tcvValue = this.wiproTCV / this.currencyMultiplier;
        this.projectService.setSession('tcvValue',this.tcvValue);
        if (this.IsSimpleDeal && this.tcvValue > 50000 && this.currencySysGuid) {
          this.simpleDealValidation = true;
        }
        else {
          this.simpleDealValidation = false;
        }
      }
    }, (err) => {
      this.projectService.displayerror(err.status);
    });
  }
  voChange(data) {
    let filteredRegion = this.regionList.filter(x => x.RegionId == data);
    if (filteredRegion.length > 0) {
      if (this.overviewDetailData.Region != data) {
        this.IsRegionChange = true;
      }
      else {
        this.IsRegionChange = false;
      }
      this.geography = filteredRegion[0].ParentGeographyId ? filteredRegion[0].ParentGeographyId : '';
      this.projectService.setSession('GeoId', this.geography);
      this.verticalSalesArrayForLookUp = [];
      this.selectedVerticalSalesOwnerObj = {};
      this.verticalSalesOwnerData = [];
      this.VerticalSalesOwnerName = "";
      this.VerticalSalesOwnerSysGuid = "";
      this.createForm = this._fb.group({
        ...this.createForm.value,
        verticalSales: [this.VerticalSalesOwnerName, Validators.required],
      })
    }
    let filteredVertical = this.verticalList.filter(y => y.SysGuid == data);
    if (filteredVertical.length > 0) {
      this.WiproSbu = filteredVertical[0].MapGuid ? filteredVertical[0].MapGuid : '';
    }
    if (this.overviewDetailData.Vertical && this.overviewDetailData.Region) {
      this.disableVSO = false;
      this.getVerticalSalesOwner('')
    }
    else {
      this.disableVSO = true;
      this.verticalSalesArrayForLookUp = [];
      this.selectedVerticalSalesOwnerObj = {};
      this.VerticalSalesOwnerName = "";
      this.VerticalSalesOwnerSysGuid = "";
      this.createForm = this._fb.group({
        ...this.createForm.value,
        verticalSales: [this.VerticalSalesOwnerName, Validators.required],
      })
    }
    this.redisVerticalOwnerSalesSave = {
      "Name": this.VerticalSalesOwnerName,
      "SysGuid": this.VerticalSalesOwnerSysGuid
    }
    this.AppendRedisCache()
  }
  selectedCbu(cbuObject: Object) {
    this.cbuArrayForLookUp = [];
    this.selectedCbuObj = Object.keys(cbuObject).length ? cbuObject : { SysGuid: "", Name: "" };
    if (cbuObject && typeof cbuObject === 'object' && Object.keys(cbuObject).length) {
      this.cbuName = this.selectedCbuObj.Name;
      this.cbuSysGuid = this.selectedCbuObj.SysGuid;
      this.selectedCbuObj.Id = this.selectedCbuObj.SysGuid;
    }
    else {
      this.cbuName = "";
      this.cbuSysGuid = "";
    }
    this.cbuArrayForLookUp.push(cbuObject);
    this.setQualifyForm(this.qualifyForm.value)
  }
  //Advisor Contacts and primary customer contact API

  GetAdvisorContact(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "Guid": this.advisorSysGuid,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.advisorContactArray = contactList.ResponseObject;
        if (this.advisorContactArray.length == 1) {
          this.selectedAdvisorContact(this.advisorContactArray[0]);
          this.AppendRedisCache();
        }
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        //this.lookupdata.nextLink = contactList.OdatanextLink;

      }
      else {

        this.projectService.displayMessageerror(contactList.Message);
      }
    },
      err => {

        this.projectService.displayerror(err.status);
      });
  }

  GetPrimaryContact(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "Guid": this.accountSysGuid,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.ContactListArray = contactList.ResponseObject
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        //this.lookupdata.nextLink = contactList.OdatanextLink;

      }
      else {

        this.projectService.displayMessageerror(contactList.Message);
      }
    },
      err => {

        this.projectService.displayerror(err.status);
      });
  }
  //Advisor Contacts and primary customer contact end*
  //DM contact API start*
  GetDecisionMakerContactList(data) {
    let searchText = data.target ? data.target.value : data;
    let obj = {
      "SearchText": searchText,
      "SearchType": 1,
      "Guid": this.accountSysGuid,
      "pagesize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.projectService.getContactList(obj).subscribe(contactList => {
      if (!contactList.IsError) {
        this.ContactListArray = contactList.ResponseObject;
        this.lookupdata.TotalRecordCount = contactList.TotalRecordCount;
        //this.lookupdata.nextLink = contactList.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(contactList.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }
  //DM contact API end*
  advanceLookUpSearch(lookUpData) {
    console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'SapCode': {
        this.selectedsapCodetObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('SapCode', this.sapData, lookUpData.inputVal)
        return
      }
      case 'AdvisorName': {
        this.selectedAdvisorNameObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('AdvisorName', this.AdvisorData, lookUpData.inputVal)
        return
      }
      case 'Currency': {
        this.SelectedCurrencyObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Currency', this.CurrencyNameArray, lookUpData.inputVal)
        return
      }
      case 'AdvisorContact': {
        this.selectedAdvisorContactObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('AdvisorContact', this.advisorContactArray, lookUpData.inputVal)
        return
      }
      case 'PrimaryContact': {
        this.selectedPrimaryContactObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('PrimaryContact', this.ContactListArray, lookUpData.inputVal)
        return
      }
      case 'Vertical_Owner': {
        this.selectedVerticalSalesOwnerObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Vertical_Owner', this.verticalSalesOwnerData, lookUpData.inputVal)
        return
      }
      case 'Contractingcountry': {
        this.selectedCountryObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('Contractingcountry', this.countryList, lookUpData.inputVal)
        return
      }
      case 'state': {
        this.selectedStateObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('state', this.stateList, lookUpData.inputVal)
        return
      }
      case 'city': {
        this.selectedCityObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openadvancetabs('city', this.cityList, lookUpData.inputVal)
        return
      }
      case 'Cbu': {
        this.selectedCbuObj = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('Cbu', this.CBUList, lookUpData.inputVal)
        return
      }
    }
  }
  getCityList(data) {
    if (this.stateSysGuid) {

      let searchText = data.searchValue ? data.searchValue : '';
      var obj = {
        "SearchText": searchText,
        "Id": this.stateSysGuid,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.projectService.getCityList(obj).subscribe(city => {
        if (!city.IsError) {

          if (city.ResponseObject != null && city.ResponseObject.length > 0) {
            this.cityList = city.ResponseObject;
            this.noCityFlag = false;
          if (this.cityList.length == 1) {
          this.selectedCity(this.cityList[0]);
          this.AppendRedisCache();
        }

            this.setQualifyForm(this.qualifyForm.value)
            this.cityList.map(data => {
              data.Id = data.SysGuid;
            })
            this.lookupdata.TotalRecordCount = city.TotalRecordCount;
            this.lookupdata.nextLink = city.OdatanextLink;

          }
          else {
            this.noCityFlag = true;
            this.cityName = "MakeValid";
            this.setQualifyForm(this.qualifyForm.value)
          }
          this.onChangeHandlerQualifyForm('');
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
  getCityListOnUserInput(data) {
    if (this.stateSysGuid) {

      let searchText = data.searchValue ? data.searchValue : '';
      var obj = {
        "SearchText": searchText,
        "Id": this.stateSysGuid,
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      }
      this.projectService.getCityList(obj).subscribe(city => {
        if (!city.IsError) {
          this.cityList = city.ResponseObject;
          //this.noCityFlag = false;
          if (city.ResponseObject.length > 0) {
            this.setQualifyForm(this.qualifyForm.value)
            this.cityList.map(data => {
              data.Id = data.SysGuid;
            })
          }
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
  //vertical sales owner API start*
  getVerticalSalesOwner(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "SearchText": searchText,
      "VerticalID": this.overviewDetailData.Vertical,
      "RegionidID": this.overviewDetailData.Region,
      "GEOGuid": this.geography,
      "SBUGuid": this.WiproSbu,
      "Guid": this.accountSysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
      if (!verticalSalesData.IsError) {

        this.verticalSalesOwnerData = verticalSalesData.ResponseObject;
        this.verticalSalesOwnerData.map(data => {
          data.Id = data.SysGuid;
          data.Name = data.UserName;
        })
        if (this.verticalSalesOwnerData.length) {
          if (this.verticalSalesOwnerData.length == 1) {
            this.selectedVerticalSalesOwner(this.verticalSalesOwnerData[0]);
            this.disableVSO = true;
          }
          else {
            this.disableVSO = false;
          }
        }
        else {
          this.disableVSO = true;
          let accountObject = {
            UserName: this.accountOwner,
            UserId: this.accountOwnerId
          }
          this.selectedVerticalSalesOwner(accountObject);
        }
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
  getVerticalSalesOwnerOnUserInput(data) {
      let searchText = data.searchValue ? data.searchValue : '';
      let obj = {
      "SearchText": searchText,
      "VerticalID": this.overviewDetailData.Vertical,
      "RegionidID": this.overviewDetailData.Region,
      "GEOGuid": this.geography,
      "SBUGuid": this.WiproSbu,
      "Guid": this.accountSysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
      }
      this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
        if (!verticalSalesData.IsError) {
        this.verticalSalesOwnerData = verticalSalesData.ResponseObject;
        this.verticalSalesOwnerData.map(data => {
          data.Id = data.SysGuid;
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
  //vertical sales owner API end*
  //on change radiobutton call start*
  isBGradio(event) {
    if (event.value == "yes") {
      this.isBgYes = true;
      this.isBgNo = false;
      this.qualifyForm = this._fb.group({
        ...this.qualifyForm.value,
        isBG: [true, Validators.required],
      })
    }
    else {
      this.isBgYes = false;
      this.isBgNo = true;
      this.qualifyForm = this._fb.group({
        ...this.qualifyForm.value,
        isBG: [false, Validators.required],
      })
    }
  }
changeEvent(e){
  if(e.checked){
 this.IsDaSpocApproval=true;
  }
  else{
this.IsDaSpocApproval=false;
  }
}
  //on change radiobutton call end*
  //delete DMC start*
  deleteCustomerContact(data, index) {
    this.DMC = "true";
    if (data.OppDecisionMakerid != null) {
      let obj = {
        "Id": data.OppDecisionMakerid
      }
      this.projectService.deleteDecisionConatct(obj).subscribe(res => {
        if (res.IsError == false) {
          // this.selectedContact=this.selectedContact.filter(x=>x.SysGuid!=data.SysGuid)
          this.selectedContact.splice(index, 1);
          this.savedDMC.splice(index, 1);
          this.AppendRedisCache();
          this.projectService.displayMessageerror("Contact removed successfully!")
          if (this.selectedContact.length == 0) {
            this.DMC = "";
            this.setQualifyForm(this.qualifyForm.value)
          }
        }
        else {
          this.projectService.displayMessageerror("Unable to delete contact please try again")
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })

    }
    else {
      this.selectedContact.splice(index, 1);
      this.savedDMC.splice(index, 1);
      this.projectService.displayMessageerror("Contact removed successfully!");
      this.AppendRedisCache();
      if (this.selectedContact.length == 0) {
        this.DMC = "";
        this.setQualifyForm(this.qualifyForm.value)
      }
    }

  }
  //delete DMC end*
  deleteAGP(data, index) {
    if (data.OppAGPId != null) {
      let obj = {
        "SearchText": "agp",
        "Guid": data.OppAGPId
      }
      this.projectService.deleteAGP(obj).subscribe(res => {
        if (res.IsError == false) {
          // this.selectedContact=this.selectedContact.filter(x=>x.SysGuid!=data.SysGuid)
          this.selectedAGPArray.splice(index, 1);
          this.AppendRedisCache();
          this.projectService.displayMessageerror("AGP deleted successfully!")
        }
        else {
          this.projectService.displayMessageerror("Unable to delete AGP please try again")
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }
    else {
      this.selectedAGPArray.splice(index, 1);
      this.projectService.displayMessageerror("AGP deleted successfully!")
      this.selectedLinkedAGPForSave = this.selectedLinkedAGPForSave.filter(agp => agp.WiproAGPId != data.Value)
    }
  }
  checkEstDate(e) {
    let dateSelected = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    if (dateSelected) {
      this.estimateDateFlagCheck = false;
    }
  }
  dateValidationShortDate(e) {
    let shortdate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let subdate = this.secureForm.controls['submitteddate'].value;
    if (subdate) {
      let validatedsubdate = this.datePipe.transform(subdate, 'yyyy-MM-dd');
      if (shortdate < validatedsubdate) {
        this.projectService.displayMessageerror("shortlisted date cannot be earlier than submitted date")
        this.secureForm.controls['shortlisteddate'].setValue("")
      }
    }
  }
  dateValidationSubDate(e) {
    let subdate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let shortdate = this.secureForm.controls['shortlisteddate'].value;
    if (shortdate) {
      let validatedshortdate = this.datePipe.transform(shortdate, 'yyyy-MM-dd');
      if (subdate > validatedshortdate) {
        this.projectService.displayMessageerror("submitted date cannot be greater than shortlisted date")
        this.secureForm.controls['submitteddate'].setValue("")
      }
    }
  }
  dateValidationEngStartDate(e) {
    let startdate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let formEndDate = this.secureForm.controls['engagementenddate'].value;
    if (formEndDate) {
      let validatedEngEndtDate = this.datePipe.transform(formEndDate, 'yyyy-MM-dd');
      if (startdate > validatedEngEndtDate) {
        this.projectService.displayMessageerror("Engagement start date cannot be greater than Engagement end date")
        this.secureForm.controls['engagementstartdate'].setValue("")
      }
    }
  }
  dateValidationEngEndDate(e) {
    let enddate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let formStartDate = this.secureForm.controls['engagementstartdate'].value;
    if (formStartDate) {
      let validatedEngStartDate = this.datePipe.transform(formStartDate, 'yyyy-MM-dd');
      if (enddate < validatedEngStartDate) {
        this.projectService.displayMessageerror("Engagement end date cannot be lesser than Engagement start date")
        this.secureForm.controls['engagementenddate'].setValue("")
      }
    }
  }
  validateProposalSubmissionDate(e) {
    let proposalSubDate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let estDate = this.datePipe.transform(this.estimatedclosedate, 'yyyy-MM-dd');
    if (estDate) {
      if (proposalSubDate > estDate) {
        this.projectService.displayMessageerror("Proposal submission date cannot be greater than estimated closure date")
        // this.engEndDate="";
        this.persuitForm.controls['submissionduedate'].setValue("")
      }
    }
  }
    validateEstimatedClosureDate(e) {
    let estDate = this.datePipe.transform(e._d, 'yyyy-MM-dd');
    let proposalSubDate = this.datePipe.transform(this.proposalSubmissionDate, 'yyyy-MM-dd');
    if (proposalSubDate) {
      if (proposalSubDate > estDate) {
        this.projectService.displayMessageerror("Estimated closure date cannot be lesser than Proposal submission date")
        // this.engEndDate="";
        this.qualifyForm.controls['estimatedClosureDate'].setValue("")
      }
    }
  }
  // getting all the form controls

  get form_create() {
    return this.createForm.controls;

  }
  get form_qualify() {
    return this.qualifyForm.controls;
  }
  get form_general() {
    return this.generalForm.controls;
  }
  sourceName: any;
  verticalName: any;
  regionName: any;
  //onchange handler for create form start*
  onChangeHandlerCreateForm(e) {
    this.SourceList.filter(val => {
      if (val.Id === e.value) {
        this.sourceName = val.Name;
      }
    })
    this.verticalList.filter(val => {
      if (val.Id === e.value) {
        this.verticalName = val.Name;
      }
    })
    this.regionList.filter(val => {
      if (val.Id === e.value) {
        this.regionName = val.Name;
      }
    })
  }

  proposalTypeName: any;
  DigitalBigBetsName: any;
  //onchange handler for create form end*
  //Onchangehandles for qualify form start*
  onChangeHandlerQualifyForm(e) {
    this.ProposalTypeList.filter(val => {
      if (val.Id === e) {
        this.proposalTypeName = val.Name;
      }
    })
    this.DigitalList.filter(val => {
      if (val.Id === e.value) {
        this.DigitalBigBetsName = val.Name;
      }
    })
    console.log("DMC", this.DMC)
    let fields: any = [];
    if (this.validation_window) {
      setTimeout(() => {
        let requiredElementsString = '#SapCode,#proposalType,#Cbu,#Contractingcountry,#state,#city,#projectDuration,#AdvisorName,#AdvisorContact,#AdvisorOwner,#PrimaryContact,#contactName,#estDate,#digitalBigBets,#estimatedRFI,#estimatedEmpanelment';
        if (this.noSapCode && !this.sapData.length) {
          requiredElementsString = requiredElementsString.replace("#SapCode,#", "#")
        }
        if(!this.isMandatoryFlagSC && this.countrySysGuid){
        requiredElementsString = requiredElementsString.replace("#state,#city,#", "#")
        }
        console.log(requiredElementsString, "requiredElementsString")
        let requiredElements = this.el.nativeElement.querySelectorAll(requiredElementsString);

        console.log("requiredElements", requiredElements)
        if (requiredElements.length) {
          requiredElements.forEach(ele => {
            // if mat-select, data-label will be executed else innerText
            let str = ele.form ? ele.form.innerText.trim() : ele.attributes["data-label"].nodeValue;
            str = str.split('*');
            str = str[0];
            let obj = {
              status: false,
              element: str,
              elementId: ele.id
            }
            if (ele.tagName == "INPUT") {
              if (ele.form ? !ele.value : !ele.innerText) {
                obj.status = false;
                fields.push(obj);
              } else {
                obj.status = true;
                fields.push(obj);
              }
            }
            else if (ele.tagName == "MAT-SELECT") {
              if (!ele.dataset.matselect) {
                obj.status = false;
                fields.push(obj);
              } else {
                obj.status = true;
                fields.push(obj);
              }
            }

            else {
            }


          });
          console.log("fields", fields)
          let DMdata = fields.findIndex(data => data.element.includes("Customer decision makers"))
          if (DMdata > -1) {
            if (this.DMC) {
              fields[DMdata].status = true;
            }
            else {
              fields[DMdata].status = false;
            }

          }
          //console.log("fields", fields)
          this.mandatoryFields = fields.filter((item, index) => {
            return index === fields.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(item);
            });
          });
          let statusCheck=this.mandatoryFields.filter(data=>!data.status);
          console.log(statusCheck,"starCheck")
          if(statusCheck.length>0){
          this.disableQualify=true;
          }
          else{
            this.disableQualify=false;
          }
        }
      }, 0);
    }
  }
  //Onchangehandles for qualify form end*
  get form_persuit() { return this.persuitForm.controls; }
  //Onchangehandles for persuit form start*
  onChangeHandlerPersuitForm(e) {
    let fields: any = [];
    if (this.validation_window2) {
      setTimeout(() => {
        let requiredElements = this.el.nativeElement.querySelectorAll('#duedate');
        if (requiredElements.length) {
          requiredElements.forEach(ele => {
            let str = ele.form.innerText.trim();
            str = str.split('*');
            str = str[0];
            let obj = {
              status: false,
              element: str,
              elementId: ele.id
            }
            if (!ele.value) {
              obj.status = false;
              fields.push(obj);
            } else {
              obj.status = true;
              fields.push(obj);
            }
          });
          this.mandatoryFields1 = fields.filter((item, index) => {
            return index === fields.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(item);
            });
          });
          let statusCheck=this.mandatoryFields1.filter(data=>!data.status);
          console.log(statusCheck,"starCheck")
          if(statusCheck.length>0){
          this.disablePursuit=true;
          }
          else{
            this.disablePursuit=false;
          }
        }
      }, 0);
    }
  }
  //Onchangehandles for secure form end*
  get form_secure() { return this.secureForm.controls; }
  //Onchangehandles for secure form start*
  onChangeHandlerSecureForm(e) {
    let fields: any = [];
    if (this.validation_window3) {
      setTimeout(() => {
        let requiredElements = this.el.nativeElement.querySelectorAll('#engStartDate,#engEndDate,#shortlistedDate,#submittedDate');
        console.log("req", requiredElements)
        if (requiredElements.length) {
          requiredElements.forEach(ele => {
            let str = ele.form.innerText.trim();
            str = str.split('*');
            str = str[0];
            let obj = {
              status: false,
              element: str,
              elementId: ele.id
            }
            if (!ele.value) {
              obj.status = false;
              fields.push(obj);
            } else {
              obj.status = true;
              fields.push(obj);
            }
          });
          this.mandatoryFields2 = fields.filter((item, index) => {
            return index === fields.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(item);
            });
          });
          let statusCheck=this.mandatoryFields2.filter(data=>!data.status);
          console.log(statusCheck,"starCheck")
          if(statusCheck.length>0){
          this.disableSecure=true;
          }
          else{
            this.disableSecure=false;
          }
        }
      }, 0);
    }
  }
  //Onchangehandles for close form start*
  onChangeHandlerCloseForm(e) {
    let fields: any = [];
    if (this.validation_window4) {
      setTimeout(() => {
        let requiredElements = this.el.nativeElement.querySelectorAll(this.IsSimpleDeal ?
          '#decisiondate,#engStartDate,#engEndDate,#shortlistedDate,#submittedDate' : '#decisiondate');
        this.projectState = this.IsSimpleDeal ? '184450003' : this.projectState;
        console.log(requiredElements);
        if (requiredElements.length) {
          requiredElements.forEach(ele => {
            let str = ele.form.innerText.trim();
            str = str.split('*');
            str = str[0];
            let obj = {
              status: false,
              element: str,
              elementId: ele.id
            }
            if (!ele.value) {
              obj.status = false;
              fields.push(obj);
            } else {
              obj.status = true;
              fields.push(obj);
            }
          });
          this.mandatoryFields3 = fields.filter((item, index) => {
            return index === fields.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(item);
            });
          });
          let statusCheck=this.mandatoryFields3.filter(data=>!data.status);
          console.log(statusCheck,"starCheck")
          if(statusCheck.length>0){
          this.disableClose=true;
          }
          else{
            this.disableClose=false;
          }
        }
      }, 0);
    }
  }
  //Onchangehandles for secure form end*
  get form_close() { return this.closeForm.controls; }
  clearValidationWindows() {
    this.validation_window = false;
    this.validation_window2 = false;
    this.validation_window3 = false;
    this.validation_window4 = false;
    this.proceedToQualify = false;
    this.proceedTopursuit = false;
    this.proceedToSecure = false;
    this.proceedToClose = false;
  }
  setproposalTypeValue(e) {
    this.proposalTypeValue = e ? e : '';
    if (this.proposalTypeValue == 184450003) {
      this.rfiValue = ""
      this.empanelmentValue = "MakeValid";
      this.setQualifyForm(this.qualifyForm.value)
    }
    else if (this.proposalTypeValue == 184450001) {
      this.rfiValue = "MakeValid";
      this.empanelmentValue = "";
      this.setQualifyForm(this.qualifyForm.value)
    }
    else {
      this.rfiValue = "MakeValid";
      this.empanelmentValue = "MakeValid";
      this.setQualifyForm(this.qualifyForm.value);
    }
    if((this.proposalTypeValue != ('184450003' || '184450001')) && this.projectState !=='184450000' && !this.isNonWt ){
      this.showDASpocAttributes=true;
      }
      else{
      this.showDASpocAttributes=false;
    }
    this.projectService.setSession('proposalTypeCheck', this.showDASpocAttributes);
  }
  valueValidation(e) {
    if (e.target.value === "0" && e.target.id == "projectDuration") {
      this.qualifyForm.value.projectDuration = "";
      e.target.value = "";
      this.projectService.displayMessageerror("Project Duration value cannot be 0")
    }
  }
  valueValidationEmpanelment(e) {
    this.empanelmentValue=e.target.value;
    var tempValue = parseFloat(e.target.value);
    if (e.target.value) {
      if (!Number(tempValue)) {
        this.empanelmentValue = ""
        e.target.value = "";
        this.setQualifyForm(this.qualifyForm.value)
        this.projectService.displayMessageerror("Estimated empanelment cannot be 0")
      }
    }
  }
  valueValidationRFI(e) {
    this.rfiValue=e.target.value;
    var tempValue = parseFloat(e.target.value);
    if (e.target.value) {
      if (!Number(tempValue)) {
        this.rfiValue = ""
        e.target.value = "";
        this.setQualifyForm(this.qualifyForm.value)
        this.projectService.displayMessageerror("Estimated RFI cannot be 0")
      }
    }

  }
  competitorFlagChange() {
    this.AppendRedisCache();
    this.router.navigate(['/opportunity/opportunityview/competitor']);
  }
  ngOnInit() {
    //this.ClearRedisCache();
    this.redisArray = [];
    this.isLoading = true;
    this.fullAccessPermission = false;
    this.partialAccessPermission = false;
    this.isAdvisorFunction = false;
    //this.IsPreSaleAndRole = false;
    this.readOnlyFlag = false;
    this.fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    this.orderCreatedCheck = this.projectService.getSession('ordercreated') || false;
    this.isAppirioFromSession = this.projectService.getSession('IsAppirioFlag') || false;
    this.userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    console.log("userGuid", this.userGuid)
    this.roleObject = this.projectService.getSession('roleObj');
    console.log("this.roleObject", this.roleObject)
    this.opportunityId = this.projectService.getSession('opportunityId');
    this.empID = this.projectService.getSession('empId');
    console.log("Decrypted EmpId----->", this.empID);
    this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {
      console.log("redis", res)
      if (!res.IsError && res.ResponseObject) {
        console.log("parsed data", JSON.parse(res.ResponseObject))
        this.redisArray = JSON.parse(res.ResponseObject);
        if (Array.isArray(this.redisArray) && this.redisArray.length > 0) {
          let currentOpportunityData = this.redisArray.filter(data => data.opportunityId == this.opportunityId)
          if (currentOpportunityData.length) {
            if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck && !this.isAppirioFromSession && (currentOpportunityData[0].PipelineStage && currentOpportunityData[0].PipelineStage.toString() !== "184450004") && (currentOpportunityData[0].Account && currentOpportunityData[0].Account.SysGuid)) {

              this.overviewDetailData = currentOpportunityData[0];
              if (!this.overviewDetailData.IsSimpledeal) {
                if (this.overviewDetailData.ProposalType == "MakeValid") {
                  this.overviewDetailData.ProposalType = "";
                  this.overviewDetailData.EstRFIValue = "";
                  this.overviewDetailData.EstEmphalmentValue = "";
                }
              }

              if (this.overviewDetailData && typeof this.overviewDetailData === 'object' && Object.keys(this.overviewDetailData).length) {
                let oppNameChanged=this.projectService.getSession('oppNameChanged');
                if(oppNameChanged){
                this.overviewDetailData.name=this.getSymbol(this.projectService.getSession('opportunityName'));
                this.projectService.setSession('oppNameChanged',false);
                }
                this.loadDataFromRedis = true;
                this.setOpportunityData();
              }
              else {
                this.isLoading = false;
                this.projectService.displayMessageerror("Error while fetching data!")
              }
            }
            else {
              this.loadDataFromRedis = false;
            }
          }
        }
        // else {
        //   this.ClearRedisCache();
        // }
      }
      else {
        this.isLoading = false;
        //this.projectService.displayMessageerror("Error while fetching data!")
      }
      if (!this.loadDataFromRedis) {
        let obj =
          { "OppId": this.projectService.getSession('opportunityId') }
        this.projectService.getOppOverviewDetail(obj).subscribe(overviewData => {
          if (!overviewData.IsError) {
            this.overviewDetailData = overviewData.ResponseObject ? overviewData.ResponseObject : {};
            this.projectService.setSession('SendThankYouNote', this.overviewDetailData.SendThankYouNote ? this.overviewDetailData.SendThankYouNote : false);
            console.log("SendThankYouNote value", this.projectService.getSession("SendThankYouNote"));
            if (this.overviewDetailData && typeof this.overviewDetailData === 'object' && Object.keys(this.overviewDetailData).length) {
              this.setOpportunityData();
            }
            else {
              this.isLoading = false;
              this.projectService.displayMessageerror(overviewData.Message)
            }
          }

          else {
            this.isLoading = false;
            this.projectService.displayMessageerror(overviewData.Message)
          }
        },
          err => {
            this.isLoading = false;
            this.projectService.displayerror(err.status);
          })
      }
    })
    this.callOverviewForm()
    //OPP Overview API end

    //Domain Tribe API
    //   this.projectService.getDomainTribe().subscribe(DomainData => {
    //      if (!DomainData.IsError){
    //     this.DomainList = DomainData.ResponseObject;
    //      }
    //      else{
    //        this.projectService.displayMessageerror(DomainData.Message);
    //      }

    //   },
    //      err => {
    //    this.projectService.displayerror(err.status);
    // })
    //Domain Tribe API *end
    //source API
    this.projectService.getSource().subscribe(SourceData => {
      if (!SourceData.IsError) {
        this.SourceList = SourceData.ResponseObject ? SourceData.ResponseObject : [];
      }
      else {
        this.projectService.displayMessageerror(SourceData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })
    //Proposal type API
    this.projectService.getProposalType().subscribe(ProposalTypeData => {
      if (!ProposalTypeData.IsError) {
        this.ProposalTypeList = ProposalTypeData.ResponseObject ? ProposalTypeData.ResponseObject : [];
      }
      else {
        this.projectService.displayMessageerror(ProposalTypeData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })

    //digital API
    this.projectService.getDigitalBigBets().subscribe(DigitalData => {
      if (!DigitalData.IsError) {
        this.DigitalList = DigitalData.ResponseObject ? DigitalData.ResponseObject : [];
      }
      else {
        this.projectService.displayMessageerror(DigitalData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })


    //this code gets the value has true or false from opp service
    //var _this_test = this;
  
    this.projectService.getEstimatedDateCheck().subscribe(res => {
      console.log("date", res.estdate)
      let date = res.estdate;
      this.qualifyForm.controls['estimatedClosureDate'].setValue(date)
    });
  }

  ngAfterViewChecked() {
    this.service.dirtyflag = false;
  }
  // ValidateForm(form){
  //   if (this[form].invalid) {
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  // }
  //lead pop up lead source drop down api
  //MandatoryPopUpValidation code start
  ValidateMandatoryPopUP(){
    debugger;
    if (this.projectService.ProceedQualify) {
      //const oppStage = this.overviewDetailData.PipelineStage ? this.overviewDetailData.PipelineStage.toString() : '';
      const oppStage = this.projectService.getSession('currentState').toString();
      if (oppStage === '184450000') {
        // current state is create and action is performed for proceed to qualify
        this.proceedToQualify = true;
        if (this['qualifyForm'].invalid) {
          this.validation_window = true;
        }
        else {
          this.validation_window = false;
        }
        this.onChangeHandlerQualifyForm('');
      } else if (oppStage === '184450001') {
        this.proceedTopursuit = true;
        // current state is qualify and action is performed for proceed to pursuit
        // let showSecurePopUp=this.ValidateForm("persuitForm");
        // if(showSecurePopUp){
        if (this['persuitForm'].invalid || !this.competitorFlag) {
          this.validation_window2 = true;
        }
        else {
          this.validation_window2 = false;
        }

        //}
        this.projectService.setSession('showMessage', true);
        this.onChangeHandlerPersuitForm('');
      } else if (oppStage === '184450002') {
        // current state is pursuit and action is performed for proceed to secure
        this.proceedToSecure = true;
        if (this.IsSimpleDeal) {
          this.proceedToClose = true;
          this.projectService.setSession('showMessage', true);
          this.showSapCodeErrorColor = true;
          console.log("sapobject", this.projectService.getSession("sapName"));
          let sapData = this.projectService.getSession("sapName")
          if (!sapData && this.proceedToClose) {
            this.projectService.displayMessageerror("Kindly enter the SAP code")
          }
          if (this['secureForm'].invalid || this['closeForm'].invalid || !this.competitorFlag || this.SLFlag || this.IPFlag) {
            this.validation_window4 = true;
          }
          else {
            this.validation_window4 = false;
          }
          this.onChangeHandlerCloseForm('');
          // this.projectState = '184450003';
        } else {
          if (this['secureForm'].invalid) {
            this.validation_window3 = true;
          }
          else {
            this.validation_window3 = false;
          }
          this.onChangeHandlerSecureForm('');
        }
      } else if (oppStage === '184450003') {
        //console.log('this', this);
        //console.log('_this_test', _this_test);
        // current state is secure and action is performed for proceed to close
        this.proceedToClose = true;
        this.showSapCodeErrorColor = true;
        this.projectService.setSession('showMessage', true);
        if (this['closeForm'].invalid || this.SLFlag || this.IPFlag) {
          this.validation_window4 = true;
        }
        else {
          this.validation_window4 = false;
        }
        console.log("sapobject", this.projectService.getSession("sapName"));
        let sapData = this.projectService.getSession("sapName")
        if (!sapData && this.proceedToClose) {
          this.projectService.displayMessageerror("Kindly enter the SAP code")
        }
        this.onChangeHandlerCloseForm('');
      }
    }
    else {
      this.clearValidationWindows();
      this.projectService.setSession('showMessage', false);
      this.updatedStage = "";
      this.closeStage = false;
      this.showSapCodeErrorColor = false;
      this.projectState = this.overviewDetailData.PipelineStage ? this.overviewDetailData.PipelineStage.toString() : "";
      console.log("updatedstage", this.updatedStage)
    }
  }

  //MandatoryPopUpValidation code end

  //pop up and call save api validation code start
  validateFormToInitiateSave(){
    //const oppStage = this.overviewDetailData.PipelineStage ? this.overviewDetailData.PipelineStage.toString() : '';
    if(this.projectService.ProceedQualify){
    const oppStage = this.projectService.getSession('currentState').toString();
    if (oppStage === '184450000') {
      // current state is create and action is performed for proceed to qualify
      this.proceedToQualify = true;
      if (this['qualifyForm'].invalid) {
        this.validation_window = true;
      }
      else {
        this.validation_window = false;
        this.saveMethodCall();
      }
      this.onChangeHandlerQualifyForm('');
    } else if (oppStage === '184450001') {
      this.proceedTopursuit = true;
      // current state is qualify and action is performed for proceed to pursuit
      // let showSecurePopUp=this.ValidateForm("persuitForm");
      // if(showSecurePopUp){
      if (this['persuitForm'].invalid || !this.competitorFlag) {
        this.validation_window2 = true;
      }
      else {
        this.validation_window2 = false;
        this.saveMethodCall();
      }

      //}
      this.projectService.setSession('showMessage', true);
      this.onChangeHandlerPersuitForm('');
    } else if (oppStage === '184450002') {
      // current state is pursuit and action is performed for proceed to secure
      this.proceedToSecure = true;
      if (this.IsSimpleDeal) {
        this.proceedToClose = true;
        this.projectService.setSession('showMessage', true);
        this.showSapCodeErrorColor = true;
        console.log("sapobject", this.projectService.getSession("sapName"));
        let sapData = this.projectService.getSession("sapName")
        if (!sapData && this.proceedToClose) {
          this.projectService.displayMessageerror("Kindly enter the SAP code")
        }
        if (this['secureForm'].invalid || this['closeForm'].invalid || !this.competitorFlag || this.SLFlag || this.IPFlag) {
          this.validation_window4 = true;
        }
        else {
          this.validation_window4 = false;
          this.saveMethodCall();
        }
        this.onChangeHandlerCloseForm('');
        // this.projectState = '184450003';
      } else {
        if (this['secureForm'].invalid) {
          this.validation_window3 = true;
        }
        else {
          this.validation_window3 = false;
          this.saveMethodCall();
        }
        this.onChangeHandlerSecureForm('');
      }
    } else if (oppStage === '184450003') {
      //console.log('this', this);
      //console.log('_this_test', _this_test);
      debugger;
      // current state is secure and action is performed for proceed to close
      this.proceedToClose = true;
      this.showSapCodeErrorColor = true;
      this.projectService.setSession('showMessage', true);
      if (this['closeForm'].invalid || this.SLFlag || this.IPFlag) {
        this.validation_window4 = true;
      }
      else {
        this.validation_window4 = false;
        this.saveMethodCall();
      }
      console.log("sapobject", this.projectService.getSession("sapName"));
      let sapData = this.projectService.getSession("sapName")
      if (!sapData && this.proceedToClose) {
        this.projectService.displayMessageerror("Kindly enter the SAP code")
      }
      this.onChangeHandlerCloseForm('');
    }
  }
  else{
    this.clearValidationWindows();
    this.projectService.setSession('showMessage', false);
    this.updatedStage = "";
    this.closeStage = false;
    this.showSapCodeErrorColor = false;
    this.projectState = this.overviewDetailData.PipelineStage ? this.overviewDetailData.PipelineStage.toString() : "";
    console.log("updatedstage", this.updatedStage)
  }
}
//pop up and call save api validation code end
  setOpportunityData() {
    console.log("overviewDetailData", this.overviewDetailData);
    console.log("overviewDetailData1", this.overviewDetailData.Account)
    this.isLoading = false;
    this.projectService.setSession("IsAppirioFlag", this.overviewDetailData.IsAppirioFlag ? this.overviewDetailData.IsAppirioFlag : "")
    if (this.loadDataFromRedis) {
      this.IsRegionChange = this.overviewDetailData.IsRegionChange ? this.overviewDetailData.IsRegionChange : false;
    }
    if (this.overviewDetailData.IsAppirioFlag && this.opportunityStatusCheck == 1) {
      this.projectService.displayMessageerror("Edit Opportunity details for an Appirio opportunity is disabled");
    }
    this.opportunityOwnerId = this.overviewDetailData.OppOwner ? this.overviewDetailData.OppOwner.SysGuid : null;
    this.wiproTCV = this.overviewDetailData.OpportunityTCV ? this.overviewDetailData.OpportunityTCV : "";
    if (this.overviewDetailData.OpportunityTypeId && this.overviewDetailData.OpportunityTypeId.toString() === '2') {
      this.OpportunityTypeId = true;
    }
    else {
      this.OpportunityTypeId = false;
    }
    this.projectState = this.overviewDetailData.PipelineStage ? this.overviewDetailData.PipelineStage.toString() : "";
    this.serviceLineArray = this.overviewDetailData.WiproServiceLineDtls ? this.overviewDetailData.WiproServiceLineDtls : [];
        //DA spoc validation code start
        this.isNonWt=this.overviewDetailData.NonWTFlag?this.overviewDetailData.NonWTFlag:false;
        this.IsDeliverySpocRole=this.projectService.getSession('IsDeliverySpocRole');
        this.isHelpDeskRole=this.projectService.getSession('IsHelpDesk');
        let proposaltypeCheckTemp = this.overviewDetailData.ProposalType ? this.overviewDetailData.ProposalType : '';
        if((proposaltypeCheckTemp != ('184450003' || '184450001')) && this.projectState !=='184450000' && !this.isNonWt ){
        this.showDASpocAttributes=true;
        }
        else{
        this.showDASpocAttributes=false;
      }
      this.projectService.setSession('proposalTypeCheck', this.showDASpocAttributes);
        this.DASpocName=this.overviewDetailData.DaSpocName ? this.overviewDetailData.DaSpocName : " ";
        this.DASpocId=this.overviewDetailData.DaSpocId ? this.overviewDetailData.DaSpocId : " ";
        this.projectService.setSession('DaSpocId',this.overviewDetailData.DaSpocId?this.overviewDetailData.DaSpocId : " ");
        this.IsDaSpocApproval=this.overviewDetailData.IsDaSpocApproval ? this.overviewDetailData.IsDaSpocApproval : false;
        this.projectService.setSession('IsDaApprovalFlag',this.IsDaSpocApproval)
        if((this.IsDeliverySpocRole || this.isHelpDeskRole) && (this.userGuid == this.DASpocId)){
          if(this.overviewDetailData.IsDaSpocApproval){
          this.isEnableDACheckBox=false;
          }
          else{
           this.isEnableDACheckBox=true;
          }
        }
        else{
          this.isEnableDACheckBox=false;
        }
        //DA spoc validation code end
    //RoleBase code check start
    if (this.projectService.getSession('opportunityStatus') == 1 && this.projectState !== "184450004" && !this.overviewDetailData.IsAppirioFlag && !this.orderCreatedCheck) {
      if (this.fullAccessSessionCheck) {
        this.fullAccessPermission = true;
      }
      else if (this.roleObject && this.roleObject.PartialAccess) {
        // if (this.roleObject.UserRoles.IsPreSaleAndRole) {
        //   this.IsPreSaleAndRole = true;
        // }
        this.partialAccessPermission = true;
      }
      else if (this.roleObject && this.roleObject.UserRoles && this.roleObject.UserRoles.IsAdvisorFunction) {
        this.isAdvisorFunction = true;
        this.projectService.accessRights();
      }
      else {
        if((this.IsDeliverySpocRole || this.isHelpDeskRole) && (this.userGuid == this.DASpocId)){
         console.log("i am da spoc for his opp");
         this.projectService.accessRights();
        }
        else{
        this.readOnlyFlag = true;
        }
      }
    }
    else {
      this.fullAccessPermission = false;
      this.partialAccessPermission = false;
      this.isAdvisorFunction = false;
      //this.IsPreSaleAndRole = false;
      this.readOnlyFlag = true;
    }
    //RoleBase code check end
    //message for selftagging start
    if (this.roleObject && !this.roleObject.PartialAccess && !this.fullAccessSessionCheck && this.opportunityStatusCheck == 1 && !this.orderCreatedCheck && !this.isAppirioFromSession && this.projectState !== "184450004") {
      if (this.roleObject.AddServiceLine) {
        this.snackBar.open("Please tag yourself as Service line BDM from More Actions (...) --> Add Service line", this.action, {
          duration: 12000
        });
      }
      else if (this.roleObject.AddIP) {
        this.snackBar.open("Please tag yourself as IP owner from More Actions (...) --> Add IP", this.action, {
          duration: 12000
        });
      }
      else if (this.roleObject.AddAlliance) {
        this.snackBar.open("Please tag yourself as Alliance manager from More Actions (...) --> Add alliance", this.action, {
          duration: 12000
        });
      }
      else if (this.roleObject.AddNewAgeBusiness) {
        this.snackBar.open("Please tag yourself as New age business partner from More Actions (...) --> Add new age business partner", this.action, {
          duration: 12000
        });
      }
      else if (this.roleObject.IsTeamBuilderSection) {
        this.snackBar.open("Please tag yourself as team member from Team", this.action, {
          duration: 12000
        });
      }
    }
    //message for selftagging end

    let soleSourceFlag = this.overviewDetailData.solesource ? this.overviewDetailData.solesource : false;
    this.projectService.setSession('soleSourceOverview', this.overviewDetailData.solesource ? this.overviewDetailData.solesource : false);
    console.log("sole source in overview", this.projectService.getSession('soleSourceOverview'));
    if (soleSourceFlag) {
      this.competitorFlag = true;
    }
    else {
      this.competitorList = this.overviewDetailData.OppCompetitorList ? this.overviewDetailData.OppCompetitorList.filter(res => res.Rank && res.Rank > 0) : [];
      console.log("compListOverview", this.competitorList)
      if (this.competitorList.length > 0) {
        this.competitorFlag = true;
      }
      else {
        this.competitorFlag = false;
      }
    }

    this.description = this.overviewDetailData.ScopeOfWork ? this.getSymbol(this.overviewDetailData.ScopeOfWork): "";
    this.selectedAGPArray = this.overviewDetailData.LinkedAGPs ? this.overviewDetailData.LinkedAGPs : [];
        if (this.selectedAGPArray.length > 0) {
      this.selectedAGPArray = this.selectedAGPArray.map(data => {
        data.Name = data.WiproName;
        data.Value=data.WiproAGPId;
        return data;
      });
    }
    this.IsSimpleDeal = this.overviewDetailData.IsSimpledeal ? this.overviewDetailData.IsSimpledeal : false;
    if ('CreateStageDate' in this.overviewDetailData || 'QualifyStageDate' in this.overviewDetailData || 'PursuitStageDate' in this.overviewDetailData) {
      this.secureStageOppCreation = false;
    }
    else {
      this.secureStageOppCreation = true;
    }
    console.log("this.IsSimpleDeal", this.IsSimpleDeal)
    if (this.IsSimpleDeal) {
      this.IsSimpleDealFlag = true;
      this.proposaltypeCheck = "MakeValid";
      this.advisorName = "MakeValid";
      this.advisorContact = "MakeValid";
      this.advisorOwner = "MakeValid";
      this.rfiValue = "MakeValid";
      this.empanelmentValue = "MakeValid";
    }
    else {
      this.IsSimpleDealFlag = false;
      this.proposaltypeCheck = this.overviewDetailData.ProposalType ? this.overviewDetailData.ProposalType : '';
      if (this.overviewDetailData.AdvisorName && Object.keys(this.overviewDetailData.AdvisorName).length) {
        this.selectedAdvisorNameObj = this.overviewDetailData.AdvisorName ? this.overviewDetailData.AdvisorName : { SysGuid: "", Name: "" };
      }
      this.advisorName = this.overviewDetailData.AdvisorName ? this.overviewDetailData.AdvisorName.Name : '';
      this.advisorSysGuid = this.overviewDetailData.AdvisorName ? this.overviewDetailData.AdvisorName.SysGuid : '';
      if (this.selectedAdvisorNameObj) {
        this.selectedAdvisorNameObj.Id = this.selectedAdvisorNameObj.SysGuid;
        this.advisorArrayForLookUp.push(this.selectedAdvisorNameObj)
      }
      this.selectedAdvisorOwnerObj = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName : { OwnerName: "", OwnerId: "" };
      this.redisAdvisorOwnerSave = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName : {};
      this.advisorOwner = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName.Name : '';
      this.advisorOwnerMapGuid = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName.SysGuid : '';

      if (this.overviewDetailData.AdvisorContact && Object.keys(this.overviewDetailData.AdvisorContact).length) {
        this.selectedAdvisorContactObj = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact : { SysGuid: "", Name: "" };
      }


      this.advisorContact = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact.Name : '';
      this.advisorContactSysGuid = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact.SysGuid : '';
      if (this.selectedAdvisorContactObj) {
        this.selectedAdvisorContactObj.Id = this.selectedAdvisorContactObj.SysGuid;
        this.advisorContactArrayForLookUp.push(this.selectedAdvisorContactObj)
      }
      //check for which proposaltype selected and written condition based on that start
      if (this.proposaltypeCheck) {
        if (this.proposaltypeCheck == "184450003") {
          this.rfiValue = this.overviewDetailData.EstRFIValue ? this.overviewDetailData.EstRFIValue : "";
          this.empanelmentValue = "MakeValid";
        }
        else if (this.proposaltypeCheck == "184450001") {
          this.rfiValue = "MakeValid";
          this.empanelmentValue = this.overviewDetailData.EstEmphalmentValue ? this.overviewDetailData.EstEmphalmentValue : "";
        }
        else {
          this.rfiValue = "MakeValid";
          this.empanelmentValue = "MakeValid";
        }
      }
      //condition end
    }
    this.noAdvisorId = this.overviewDetailData.NoAdvisor ? this.overviewDetailData.NoAdvisor : "";
    //console.log("this.noAdvisorId",this.noAdvisorId)
    if (this.IsSimpleDeal == false) {
      if (this.noAdvisorId == this.advisorSysGuid) {
        this.noAdvisor = true;
        this.advisorContact = "MakeValid"
        this.advisorContactSysGuid = ""
        this.advisorOwner = "MakeValid"
      }
      else {
        this.noAdvisor = false;
        if (this.overviewDetailData.AdvisorContact && Object.keys(this.overviewDetailData.AdvisorContact).length) {
          this.selectedAdvisorContactObj = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact : { SysGuid: "", Name: "" };
        }
        this.advisorContact = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact.Name : '';
        this.advisorContactSysGuid = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact.SysGuid : '';
        if (this.selectedAdvisorContactObj) {
          this.selectedAdvisorContactObj.Id = this.selectedAdvisorContactObj.SysGuid;
          this.advisorContactArrayForLookUp.push(this.selectedAdvisorContactObj)
        }

        this.selectedAdvisorOwnerObj = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName : { OwnerName: "", OwnerId: "" };
        this.advisorOwner = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName.Name : '';
        this.advisorOwnerMapGuid = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName.SysGuid : '';
      }
    }
    if (!this.loadDataFromRedis) {
      this.oldAdvisorName = this.overviewDetailData.AdvisorName ? this.overviewDetailData.AdvisorName.SysGuid : '';
      this.oldAdvisorContact = this.overviewDetailData.AdvisorContact ? this.overviewDetailData.AdvisorContact.SysGuid : '';
      this.oldAdvisorOwner = this.overviewDetailData.AdvisorOwnerName ? this.overviewDetailData.AdvisorOwnerName.SysGuid : '';
    }
    else {
      this.oldAdvisorName = this.overviewDetailData.oldAdvisorName ? this.overviewDetailData.oldAdvisorName : '';
      this.oldAdvisorContact = this.overviewDetailData.oldAdvisorContact ? this.overviewDetailData.oldAdvisorContact : '';
      this.oldAdvisorOwner = this.overviewDetailData.oldAdvisorOwner ? this.overviewDetailData.oldAdvisorOwner : '';
    }
    // assing porject state

    this.stageValue = this.getStageValue(this.projectState);
    this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === this.overviewDetailData.PipelineStage);
    console.log("count1", this.projectService.count)

    if (this.projectState == "184450003" || this.IsSimpleDeal) {
      this.projectService.getordersave1().subscribe(res => {
        if (res.closestart) {
          this.projectService.ProceedQualify = true;
        }
        else if (!res.closestart)
          this.projectService.ProceedQualify = false;
      });
    } else {
      //this.projectService.ProceedQualify = false;
    }
    this.projectService.createdDate = this.overviewDetailData.CreatedOn ? this.overviewDetailData.CreatedOn : '';
    console.log("created date", this.overviewDetailData.CreatedOn)
    let cd = new Date(this.overviewDetailData.CreatedOn);
    this.createdDate = new Date(cd)

    this.projectService.statecode = this.overviewDetailData.statecode ? this.overviewDetailData.statecode : '';
    this.projectService.setSession('IsAppirio', this.overviewDetailData.WiproAppirioIsWiproOwned && Object.keys(this.overviewDetailData.WiproAppirioIsWiproOwned).length ? this.overviewDetailData.WiproAppirioIsWiproOwned.SysGuid : '');
    this.projectService.setSession('createdDate', this.overviewDetailData.CreatedOn ? this.overviewDetailData.CreatedOn : '');
    this.projectService.setSession('statecode', this.overviewDetailData.statecode ? this.overviewDetailData.statecode : '');
    this.projectService.setSession('regionId', this.overviewDetailData.Region ? this.overviewDetailData.Region.toString() : "");
    if (this.overviewDetailData.AdvisorOwnerName && Object.keys(this.overviewDetailData.AdvisorOwnerName).length && this.overviewDetailData.AdvisorOwnerName.SysGuid != "") {
      this.projectService.setSession('AdvisorOwnerId', this.overviewDetailData.AdvisorOwnerName.SysGuid)
    }

    this.proposalTypeValue = this.overviewDetailData.ProposalType ? this.overviewDetailData.ProposalType : '';
    this.SelectedAccountObj = this.overviewDetailData.Account ? this.overviewDetailData.Account : { SysGuid: "", Name: "" };
    console.log("this.SelectedAccountObj", this.SelectedAccountObj)
    this.accountName = this.overviewDetailData.Account ? this.overviewDetailData.Account.Name : '';
    this.accountSysGuid = this.overviewDetailData.Account ? this.overviewDetailData.Account.SysGuid : '';
    this.accountOwner = this.overviewDetailData.Account ? this.overviewDetailData.Account.OwnerName : '';
    this.accountOwnerId = this.overviewDetailData.Account ? this.overviewDetailData.Account.OwnerId : '';
    console.log("this.SelectedAccountObj12", this.overviewDetailData.Account.SysGuid);
    console.log("this.SelectedAccountObj13", this.accountSysGuid);

    this.projectService.setSession('geoGuid', this.overviewDetailData.WiproGeography ? this.overviewDetailData.WiproGeography : '');//'97463edf-449a-e811-8130-000d3a803bd6',
    this.projectService.setSession('geoName', '');
    this.projectService.setSession('accountNameOpp', this.accountName);
    this.projectService.setSession('verticalName', this.overviewDetailData.VerticalName ? this.overviewDetailData.VerticalName : '');
    this.projectService.setSession('serviceLineArray',this.serviceLineArray);
    this.projectService.setSession('accountId', this.accountSysGuid);
    this.projectService.setSession('verticleGuid', this.overviewDetailData.Vertical);
    this.projectService.setSession('startDate',this.datePipe.transform(this.currentDate, 'MM/dd/yyyy'));
    this.projectService.setSession('endDate', this.datePipe.transform((new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDate())), 'MM/dd/yyyy'));
    //this.projectService.setSession('sbuName', this.overviewDetailData.WiproSbu ? this.overviewDetailData.WiproSbu : '');
    //this.projectService.setSession( 'emailListArray', this.EmailListArray);
    
    if (this.overviewDetailData.Currency && Object.keys(this.overviewDetailData.Currency).length) {
      this.SelectedCurrencyObj = this.overviewDetailData.Currency ? this.overviewDetailData.Currency : { SysGuid: "", Name: "" };
    }
    if (this.SelectedCurrencyObj) {
      this.SelectedCurrencyObj.Id = this.SelectedCurrencyObj.SysGuid;
      this.currencyArrayForLookUp.push(this.SelectedCurrencyObj)
    }
    this.currencyName = this.overviewDetailData.Currency ? this.getSymbol(this.overviewDetailData.Currency.Name) : '';
    this.currencySysGuid = this.overviewDetailData.Currency ? this.overviewDetailData.Currency.SysGuid : '';
    this.getCurrencyMultiplier();
    this.projectService.setSession('currencyId', this.currencySysGuid);


    if (this.overviewDetailData.CBU && Object.keys(this.overviewDetailData.CBU).length) {
      this.selectedCbuObj = this.overviewDetailData.CBU ? this.overviewDetailData.CBU : { SysGuid: "", Name: "" };
    }
    if (this.selectedCbuObj) {
      this.selectedCbuObj.Id = this.selectedCbuObj.SysGuid;
      this.cbuArrayForLookUp.push(this.selectedCbuObj)
    }
    this.cbuName = this.overviewDetailData.CBU ? this.overviewDetailData.CBU.Name : '';
    this.cbuSysGuid = this.overviewDetailData.CBU ? this.overviewDetailData.CBU.SysGuid : '';

    if (this.overviewDetailData.SapCode && Object.keys(this.overviewDetailData.SapCode).length) {
      this.selectedsapCodetObj = this.overviewDetailData.SapCode ? this.overviewDetailData.SapCode : { SysGuid: "", Name: "" };
    }
    if (this.selectedsapCodetObj && Object.keys(this.selectedsapCodetObj).length) {
      this.selectedsapCodetObj.Id = this.selectedsapCodetObj.SysGuid;
      this.sapArrayForLookUp.push(this.selectedsapCodetObj)
    }

    this.sapCodeName = this.overviewDetailData.SapCode ? this.overviewDetailData.SapCode.Name: "";
    this.sapCodeSysGuid = this.overviewDetailData.SapCode ? this.overviewDetailData.SapCode.SysGuid : "";

    if (this.sapCodeName) {
      this.projectService.setSession("sapName", this.sapCodeName);
    }

    if (this.overviewDetailData.Country && Object.keys(this.overviewDetailData.Country).length) {
      this.selectedCountryObj = this.overviewDetailData.Country ? this.overviewDetailData.Country : { SysGuid: "", Name: "" };
    }
    this.countryName = this.overviewDetailData.Country ? this.overviewDetailData.Country.Name : '';
    this.countrySysGuid = this.overviewDetailData.Country ? this.overviewDetailData.Country.SysGuid : '';
    if (this.selectedCountryObj) {
      this.selectedCountryObj.Id = this.selectedCountryObj.SysGuid
      this.countryArrayForLookUp.push(this.selectedCountryObj)
    }
    if (!this.loadDataFromRedis) {
      this.oldCountryValue = this.overviewDetailData.Country ? this.overviewDetailData.Country.SysGuid : '';
      this.oldStateValue = this.overviewDetailData.State ? this.overviewDetailData.State.SysGuid : "";
      this.oldCityValue = this.overviewDetailData.ContractingCity ? this.overviewDetailData.ContractingCity.SysGuid : "";
      this.oldSapName= this.overviewDetailData.SapCode ? this.overviewDetailData.SapCode.SysGuid : "";
    }
    else {
      this.oldCountryValue = this.overviewDetailData.oldCountryValue ? this.overviewDetailData.oldCountryValue : '';
      this.oldStateValue = this.overviewDetailData.oldStateValue ? this.overviewDetailData.oldStateValue : "";
      this.oldCityValue = this.overviewDetailData.oldCityValue ? this.overviewDetailData.oldCityValue : "";
      this.oldSapName= this.overviewDetailData.oldSapName ? this.overviewDetailData.oldSapName : "";
    }
    //state and city validation code start
    if (this.countrySysGuid) {
       if(this.countryName == "INDIA" || this.countryName == "UNITED KINGDOM" || this.countryName == "USA"
      || this.countryName == "United States" || this.countryName == "UK" || this.countryName == "India"
      || this.countryName == "United Kingdom" || this.countryName == "UNITED STATES"){
      this.isMandatoryFlagSC=true;
      }
      else{
      this.isMandatoryFlagSC=false;
      }
      if (this.overviewDetailData.State && Object.keys(this.overviewDetailData.State).length && this.overviewDetailData.State.SysGuid) {
        this.countryFlag = true;
        this.selectedStateObj = this.overviewDetailData.State ? this.overviewDetailData.State : { SysGuid: "", Name: "" };
        this.stateName = this.overviewDetailData.State ? this.overviewDetailData.State.Name : '';
        this.stateSysGuid = this.overviewDetailData.State ? this.overviewDetailData.State.SysGuid : '';
        if (this.selectedStateObj) {
          this.selectedStateObj.Id = this.selectedStateObj.SysGuid;
          this.stateArrayForLookUp.push(this.selectedStateObj)
        }
        if (this.overviewDetailData.ContractingCity && this.overviewDetailData.ContractingCity.SysGuid) {
          if (this.overviewDetailData.ContractingCity && Object.keys(this.overviewDetailData.ContractingCity).length) {
            this.selectedCityObj = this.overviewDetailData.ContractingCity ? this.overviewDetailData.ContractingCity : { SysGuid: "", Name: "" };;
          }
          this.cityName = this.overviewDetailData.ContractingCity ? this.overviewDetailData.ContractingCity.Name : '';
          this.citySysGuid = this.overviewDetailData.ContractingCity ? this.overviewDetailData.ContractingCity.SysGuid : '';
          if (this.citySysGuid) {
            this.noCityFlag = false;
          }
          else {
            this.cityName = "MakeValid";
            this.noCityFlag = true;
          }
          if (this.selectedCityObj && this.selectedCityObj.SysGuid) {
            this.selectedCityObj.Id = this.selectedCityObj.SysGuid;
            this.cityArrayForLookUp.push(this.selectedCityObj)
          }
        }
        else {
          this.getCityList(this.stateSysGuid)
        }
      }
      else {
        this.getStateList(this.countrySysGuid)
      }
    }


    //state and city validation code end

    this.ENUSBUId = this.overviewDetailData.ENUSBUId ? this.overviewDetailData.ENUSBUId : "";

    this.WiproSbu = this.overviewDetailData.WiproSbu ? this.overviewDetailData.WiproSbu : "";

    if (this.overviewDetailData.IndiaSBUId) {
      const sbuids = this.overviewDetailData.IndiaSBUId.split(',');
      for (var i = 0; i < sbuids.length; i++) {
        if (this.WiproSbu == sbuids[i]) {
          this.showISBgvalue = true;
        }
      }
    }
    if (this.overviewDetailData.Source) {
      this.sourceflag = false;
    }
    else {
      this.sourceflag = true;
    }
    if (this.overviewDetailData.Source == 184450000) {
      this.isSorceLead = true;
      this.getLeadSource()
      this.leadType = this.overviewDetailData.WiproLinkedLeadType ? this.overviewDetailData.WiproLinkedLeadType : {};
      if (this.leadType.SysGuid == 1) {
        this.orginatingDetails = this.overviewDetailData.WiproOriginatingLead ? this.overviewDetailData.WiproOriginatingLead : {};
      }
      else {
        this.leadSourceDetails = this.overviewDetailData.OppLinkedLeads ? this.overviewDetailData.OppLinkedLeads : [];
      }
    }
    else {
      this.isSorceLead = false;
    }
    if (this.overviewDetailData.VerticalSalesOwner && Object.keys(this.overviewDetailData.VerticalSalesOwner).length) {
      this.selectedVerticalSalesOwnerObj = this.overviewDetailData.VerticalSalesOwner ? this.overviewDetailData.VerticalSalesOwner : { SysGuid: "", Name: "" };
      this.redisVerticalOwnerSalesSave = this.overviewDetailData.VerticalSalesOwner ? this.overviewDetailData.VerticalSalesOwner : { SysGuid: "", Name: "" };
    }

    this.VerticalSalesOwnerName = this.overviewDetailData.VerticalSalesOwner ? this.overviewDetailData.VerticalSalesOwner.Name : '';
    this.VerticalSalesOwnerSysGuid = this.overviewDetailData.VerticalSalesOwner ? this.overviewDetailData.VerticalSalesOwner.SysGuid : '';
    if (this.selectedVerticalSalesOwnerObj) {
      this.selectedVerticalSalesOwnerObj.Id = this.selectedVerticalSalesOwnerObj.SysGuid
      this.verticalSalesArrayForLookUp.push(this.selectedVerticalSalesOwnerObj)
    }

    if (this.overviewDetailData.PrimaryContact && Object.keys(this.overviewDetailData.PrimaryContact).length) {
      this.selectedPrimaryContactObj = this.overviewDetailData.PrimaryContact ? this.overviewDetailData.PrimaryContact : { SysGuid: "", Name: "" };
    }
    if (!this.loadDataFromRedis) {
      this.oldPrimaryContact = this.overviewDetailData.PrimaryContact ? this.overviewDetailData.PrimaryContact.SysGuid : '';
    }
    else {
      this.oldPrimaryContact = this.overviewDetailData.oldPrimaryContact ? this.overviewDetailData.oldPrimaryContact : "";
    }
    this.primaryContactName = this.overviewDetailData.PrimaryContact ? this.getSymbol(this.overviewDetailData.PrimaryContact.Name) : '';
    this.primaryContactSysGuid = this.overviewDetailData.PrimaryContact ? this.overviewDetailData.PrimaryContact.SysGuid : '';
    if (this.selectedPrimaryContactObj) {
      this.selectedPrimaryContactObj.Id = this.selectedPrimaryContactObj.SysGuid;
      this.primaryContactArrayForLookUp.push(this.selectedPrimaryContactObj)
    }


    // if (this.overviewDetailData.DomainTribe) {
    //   this.selectedDomain(this.overviewDetailData.DomainTribe)
    // }
    // if (this.overviewDetailData.Chapter) {
    //   this.selectedChapter(this.overviewDetailData.Chapter)
    // }
    if (this.overviewDetailData.IsBgcgemd == true) {
      this.isBgYes = true;
      this.isBgNo = false;
    }
    else {
      this.isBgYes = false;
      this.isBgNo = true;
    }
    this.selectedContact = this.overviewDetailData.DecisionMakers ? this.overviewDetailData.DecisionMakers : [];
    if (this.overviewDetailData.DecisionMakers && this.overviewDetailData.DecisionMakers.length) {
      this.savedDMC = this.overviewDetailData.DecisionMakers.filter(data => data.OppDecisionMakerid != undefined)
    }
    if (this.selectedContact.length > 0) {
      this.selectedContact = this.selectedContact.map(data => {
        data.Id = data.SysGuid;
        data.Name=this.getSymbol(data.Name);
        data.Designation = data.jobtitle;
        return data;
      });
    }

    this.DMC = this.overviewDetailData.DecisionMakers && this.overviewDetailData.DecisionMakers.length > 0 ? "true" : "";

    this.estimatedclosedate = this.overviewDetailData.estimatedclosedate ? this.overviewDetailData.estimatedclosedate : '';
    this.proposalSubmissionDate = this.overviewDetailData.ProposalSubmissionDate ? this.overviewDetailData.ProposalSubmissionDate : "";
    this.engStartDate = this.overviewDetailData.wipro_engagementstartdate ? this.overviewDetailData.wipro_engagementstartdate : "";
    this.engEndDate = this.overviewDetailData.wipro_engagementenddate ? this.overviewDetailData.wipro_engagementenddate : "";
    this.submittedDate = this.overviewDetailData.wipro_submitteddate ? this.overviewDetailData.wipro_submitteddate : "";
    this.shortlistedDate = this.overviewDetailData.wipro_shortlisteddate ? this.overviewDetailData.wipro_shortlisteddate : "";
    this.decisionDate = this.overviewDetailData.wipro_closedecisiondate ? this.overviewDetailData.wipro_closedecisiondate : "";
    //Account Related feilds API
    if (this.projectService.ProceedQualify == true) {
      this.ValidateMandatoryPopUP();
    }
    let accountFeilds = {
      "AccountId": this.accountSysGuid,
      "SearchType": 1,
      "UserGuid": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    }
    this.projectService.getAccountRelatedFiels(accountFeilds).subscribe(accountData => {
      if (!accountData.IsError) {
        this.verticalList = accountData.ResponseObject.Vertical ? accountData.ResponseObject.Vertical : [];
        if (this.verticalList.length == 1) {
          this.disableVertical = true;
          this.sbuName = this.verticalList[0].MapName ? this.verticalList[0].MapName : '';
          this.projectService.setSession('sbuStoredValue',this.sbuName);
        }
        else {
          this.disableVertical = false;
          let selectedVertical = this.verticalList.filter(data => this.overviewDetailData.Vertical == data.SysGuid);
          console.log(selectedVertical, "selectedVertical")
          this.sbuName = selectedVertical[0].MapName ? selectedVertical[0].MapName : '';
          this.projectService.setSession('sbuStoredValue',this.sbuName);
        }
        //this.verticalOwner = accountData.ResponseObject.Owner ? accountData.ResponseObject.Owner : [];
        //DA api to get user id and email id//
        let obj =
          { "OpportunityID": this.projectService.getSession('opportunityId') }
        this.projectService.getUserID_DA(obj).subscribe(userID => {
          console.log(userID, "responseUserid")
          if (!userID.IsError && userID.ResponseObject.UserIds.length > 0) {
            let userIDArray = userID.ResponseObject;
            this.projectService.getEmailID_DA(userIDArray).subscribe(emailID => {
              console.log(emailID, "responseemailid")
              if (!emailID.IsError && emailID.ResponseObject.length > 0) {
                emailID.ResponseObject.map(data => {
                  this.EmailListArray.push(data.InternalEmailAddress);
                })
                console.log("this.EmailListArray", this.EmailListArray)
                //DA api code end
                //this.iframePage = 'OPPORTUNITY_DETAILS';
                let bodyDA = {
                  page: 'OPPORTUNITY_DETAILS',
                  id: this.accountSysGuid,
                  opportunityGuid: this.opportunityId,
                  verticleGuid: this.overviewDetailData.Vertical,
                  startDate: this.datePipe.transform(this.currentDate, 'MM/dd/yyyy'),
                  endDate: this.datePipe.transform((new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDate())), 'MM/dd/yyyy'),
                  sbuGuid: this.WiproSbu,//'c536ff6a-1445-dd11-816d-001a643446e0',
                  sbuName: this.sbuName,
                  geoGuid: this.geography,//'97463edf-449a-e811-8130-000d3a803bd6',
                  geoName: '',
                  accountNameOpp: this.accountName,
                  verticalName: this.overviewDetailData.VerticalName ? this.overviewDetailData.VerticalName : '',
                  serviceLineArray: this.serviceLineArray,
                  emailListArray: this.EmailListArray
                };
                this.assistantGlobalService.setEmails(bodyDA)
                // this.daService.postMessageData = bodyDA;
                // this.daService.postMessage(bodyDA);
              }
            },
              err => {
                this.projectService.displayerror(err.status);

              })
          }
        },
          err => {
            this.projectService.displayerror(err.status);

          })
      }
      else {
        this.projectService.displayMessageerror(accountData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })
    //get regionList API start*
    //mandatory flag check bsp code start
    if (this.IsSimpleDeal || this.projectState.toString() === '184450003') {
      let obj = {
        "Guid": this.opportunityId,
        "IsProceedToClose": true,
        "SendThankYouNote": this.projectService.getSession("SendThankYouNote")
      }
      this.projectService.checkOppMandatoryAttributeOverview(obj).subscribe(result => {
        if (!result.IsError) {
          if (!result.ResponseObject.ValidationFlag) {
            if (result.ResponseObject.SL_ValidationFlag) {
              this.SLFlag = true;
            }
            else {
              this.SLFlag = false;
            }
            if (result.ResponseObject.IP_ValidationFlag) {
              this.IPFlag = true;
            }
            else {
              this.IPFlag = false;
            }
          }
          else {
            this.IPFlag = false;
            this.SLFlag = false;
          }
          let mandateSLArray = this.projectService.getSession("mandatoryArrayForCloud");
          console.log(mandateSLArray, "mandateSLArray")
          let oppSLArrayWithNoCloudData = result.ResponseObject.SeviceLineList;
          for (var x = 0; x < oppSLArrayWithNoCloudData.length; x++) {
            for (var y = 0; y < mandateSLArray.length; y++) {
              if (oppSLArrayWithNoCloudData[x].ServiceLineName == mandateSLArray[y].ServiceLineName && oppSLArrayWithNoCloudData[x].PracticeName == mandateSLArray[y].PracticeName && oppSLArrayWithNoCloudData[x].SubPracticeName == mandateSLArray[y].SubPracticeName) {
                this.cloudFlag = false;
                break;
              }
              else {
                this.cloudFlag = true;
              }
            }
          }
        }
        else {
          this.projectService.displayMessageerror(result.Message);
          //this.isSearchLoader=false
        }
      },
        err => {
          //this.projectService.displayerror(err.status);
          //this.isSearchLoader=false
        })
    }

    //mandatory flag check bsp code end
    this.projectService.getRegionList(this.accountSysGuid).subscribe(regionList => {
      this.regionList = regionList.ResponseObject ? regionList.ResponseObject : [];
      let filteredRegion = this.regionList.filter(data => data.RegionId == this.overviewDetailData.Region);
      if (filteredRegion.length > 0) {
        this.geography = filteredRegion[0].ParentGeographyId ? filteredRegion[0].ParentGeographyId : '';
        this.projectService.setSession('GeoId', this.geography);
        if(this.VerticalSalesOwnerSysGuid){
      let obj = {
      "SearchText": '',
      "VerticalID": this.overviewDetailData.Vertical,
      "RegionidID": this.overviewDetailData.Region,
      "GEOGuid": this.geography,
      "SBUGuid": this.WiproSbu,
      "Guid": this.accountSysGuid,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.projectService.getVerticalsalesOwnerList(obj).subscribe(verticalSalesData => {
      if (!verticalSalesData.IsError) {
        this.verticalSalesOwnerData = verticalSalesData.ResponseObject;
        if (this.verticalSalesOwnerData.length) {
          if (this.verticalSalesOwnerData.length == 1) {
            this.disableVSO = true;
          }
          else {
            this.disableVSO = false;
          }
        }
        else {
          this.disableVSO = true;
        }
      }
      else {

        this.projectService.displayMessageerror(verticalSalesData.Message);
      }
    },
      err => {

        this.projectService.displayerror(err.status);
      })
        }
        else{
        this.getVerticalSalesOwner('');
        }
        
      }
    })


    //get regionList API end*
    //call sap api for that request sap code api
    console.log(this.sapCodeSysGuid, "sapid")

    this.getSapData('');

    //end sap code api
    //Account Related feilds API end*
    this.projectService.getWiproAGPData(this.accountSysGuid).subscribe(AGPData => {
      if (!AGPData.IsError) {
        this.wiproLinkedAGPArray = AGPData.ResponseObject ? AGPData.ResponseObject : [];
        console.log("this.selectedAGPArray", this.selectedAGPArray)
        //commented this code after discussion
        // if (this.selectedAGPArray.length > 0) {
        //   for (var i = 0; i < this.selectedAGPArray.length; i++) {
        //     for (var j = 0; j < this.wiproLinkedAGPArray.length; j++) {
        //       if (this.selectedAGPArray[i].WiproAGPId == this.wiproLinkedAGPArray[j].Value) {
        //         this.selectedAGPArray[i].Name = this.wiproLinkedAGPArray[j].Name
        //         this.selectedAGPArray[i].Value = this.wiproLinkedAGPArray[j].Value
        //       }
        //     }

        //   }
        // }
        // console.log("this.selectedAGPArray1", this.selectedAGPArray)
        //this.isSearchLoader=false
      }
      else {
        this.projectService.displayMessageerror(AGPData.Message);
        //this.isSearchLoader=false
      }
    },
      err => {
        //this.projectService.displayerror(err.status);
        //this.isSearchLoader=false
      })

    this.callOverviewForm()
    if (this.readOnlyFlag) {
      this.table_data = [
        { "heading": "Opportunity name", "content": this.overviewDetailData ? this.getSymbol(this.overviewDetailData.name) : "-", "show": true },
        { "heading": "Account name", "content": this.accountName ? this.accountName : "-", "show": true },
        { "heading": "SAP code", "content": this.sapCodeName ? this.sapCodeName : "-", "show": true },
        { "heading": "Source", "content": this.overviewDetailData.SourceName ? this.overviewDetailData.SourceName : "-", "show": true },
        { "heading": "Proposal type", "content": this.overviewDetailData.SourceDisplay ? this.overviewDetailData.SourceDisplay : "-", "show": this.IsSimpleDealFlag ? false : true },
        { "heading": "Currency", "content": this.currencyName ? this.currencyName : "-", "show": true },
        { "heading": "Vertical", "content": this.overviewDetailData.VerticalName ? this.overviewDetailData.VerticalName : "-", "show": true },
        { "heading": "CBU", "content": this.cbuName ? this.cbuName : "-", "show": true },
        { "heading": "Opportunity region", "content": this.overviewDetailData.RegionName ? this.overviewDetailData.RegionName : "-", "show": true },
        { "heading": "Vertical sales owner", "content": this.VerticalSalesOwnerName ? this.VerticalSalesOwnerName : "-", "show": true },
        { "heading": "Digital big bets", "content": this.overviewDetailData.BigBetName ? this.overviewDetailData.BigBetName : "-", "show": true },
        { "heading": "Estimated closure date", "content": this.estimatedclosedate ? this.datePipe.transform(this.estimatedclosedate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Proposal submission due date", "content": this.overviewDetailData.ProposalSubmissionDate ? this.datePipe.transform(this.overviewDetailData.ProposalSubmissionDate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Project duration (Months)", "content": this.overviewDetailData.DurationInMonth ? this.overviewDetailData.DurationInMonth : "-", "show": true },
        { "heading": "Contracting country", "content": this.countryName ? this.countryName : "-", "show": true },
        { "heading": "State", "content": this.stateName ? this.stateName : "-", "show": this.countryFlag ? true : false },
        { "heading": "City", "content": this.cityName ? this.cityName : "-", "show": this.noCityFlag ? false : true },
        { "heading": "Advisor name", "content": this.advisorName ? this.advisorName : "-", "show": this.IsSimpleDealFlag == false ? true : false },
        { "heading": "Advisor contact", "content": this.advisorContact ? this.advisorContact : "-", "show": this.IsSimpleDealFlag == false && this.noAdvisor == false ? true : false },
        { "heading": "Advisor owner", "content": this.advisorOwner ? this.advisorOwner : "-", "show": this.IsSimpleDealFlag == false && this.noAdvisor == false ? true : false },
        { "heading":"DA SPOC", "content":this.overviewDetailData.DaSpocName?this.overviewDetailData.DaSpocName:"", "show":this.showDASpocAttributes? true:false},
        { "heading":"Proposal review completed", "content":this.overviewDetailData.IsDaSpocApproval && this.overviewDetailData.IsDaSpocApproval ==true ? "Yes" : "No", "show": this.showDASpocAttributes?true:false},
        // { "heading":"Domain tribe", "content":"Own domain" },
        // { "heading":"Chapter", "content":"Chapter1" },
        // { "heading":"Target area", "content":"Banking" },
        { "heading": "Is BG/ CG/ EMD applicable", "content": this.overviewDetailData.IsBgcgemd == true ? "Yes" : "No", "show": this.showISBgvalue ? true : false },
        { "heading": "Estimated Empanelment value", "content": this.empanelmentValue ? this.empanelmentValue : "-", "show": this.proposalTypeValue == 184450001 ? true : false },
        { "heading": "Estimated RFI value", "content": this.rfiValue ? this.rfiValue : "-", "show": this.proposalTypeValue == 184450003 ? true : false }
      ]
      this.engagement_table_data = [
        { "heading": "Engagement start date", "content": this.overviewDetailData.wipro_engagementstartdate ? this.datePipe.transform(this.overviewDetailData.wipro_engagementstartdate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Engagement end date", "content": this.overviewDetailData.wipro_engagementenddate ? this.datePipe.transform(this.overviewDetailData.wipro_engagementenddate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Submitted date", "content": this.overviewDetailData.wipro_submitteddate ? this.datePipe.transform(this.overviewDetailData.wipro_submitteddate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Shortlisted date", "content": this.overviewDetailData.wipro_shortlisteddate ? this.datePipe.transform(this.overviewDetailData.wipro_shortlisteddate, 'dd-MMM-yyyy') : "-", "show": true },
        { "heading": "Customer decision date", "content": this.overviewDetailData.wipro_closedecisiondate ? this.datePipe.transform(this.overviewDetailData.wipro_closedecisiondate, 'dd-MMM-yyyy') : "-", "show": true }
      ]
    }
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
  //lead api end
  getStageValue(stage) {
    switch (stage) {
      case '184450000':
        return "Create Stage";
      case '184450001':
        return "Qualify Stage";
      case '184450002':
        return "Pursuit Stage";
      case '184450003':
        return "Secure Stage";
      case '184450004':
        return "Close Stage";
    }
  }
  //qualifyForm-value assignment and validation start*

  callOverviewForm() {
    this.createForm = this._fb.group({
      opportunityName: [this.overviewDetailData.name?this.getSymbol(this.overviewDetailData.name):"", Validators.required],
      accountName: [this.accountName, Validators.required],
      source: [this.overviewDetailData.Source, Validators.required],
      currency: [this.currencyName, Validators.required],
      vertical: [this.overviewDetailData.Vertical, Validators.required],
      opportunityregion: [this.overviewDetailData.Region, Validators.required],
      description: [this.description, Validators.required],
      verticalSales: [this.VerticalSalesOwnerName, Validators.required],
    })

    this.qualifyForm = this._fb.group({
      proposalType: [this.proposaltypeCheck, Validators.required],
      cbu: [this.cbuName, Validators.required],
      country: [this.countryName, Validators.required],
      state: [this.stateName, Validators.required],
      city: [this.cityName, Validators.required],
      projectDuration: [this.overviewDetailData.DurationInMonth, Validators.required],
      isBG: [this.overviewDetailData.IsBgcgemd, Validators.required],
      advisorName: [this.advisorName, Validators.required],
      advisorContact: [this.advisorContact, Validators.required],
      advisorOwner: [this.advisorOwner, Validators.required],
      primaryContact: [this.primaryContactName, Validators.required],
      SapCode: [this.sapCodeName, Validators.required],
      decisionMakerContacts: [this.DMC, Validators.required],
      estimatedClosureDate: [this.overviewDetailData.estimatedclosedate, Validators.required],
      digitalBigBets: [this.overviewDetailData.BigBet ? this.overviewDetailData.BigBet : "", Validators.required],
      estimatedEmpanelment: [this.empanelmentValue, Validators.required],
      estimatedRFI: [this.rfiValue, Validators.required]
    });

    this.generalForm = this._fb.group({
      linkedAGP: [this.overviewDetailData.LinkedAGPs, Validators.required]
      //linked AGP
    })
    //persuit form check start*
    this.persuitForm = this._fb.group({
      submissionduedate: [this.overviewDetailData.ProposalSubmissionDate, Validators.required],

    });
    //persuit form check end*

    //secureForm form check start*
    this.secureForm = this._fb.group({
      engagementstartdate: [this.overviewDetailData.wipro_engagementstartdate, Validators.required],
      engagementenddate: [this.overviewDetailData.wipro_engagementenddate, Validators.required],
      submitteddate: [this.overviewDetailData.wipro_submitteddate, Validators.required],
      shortlisteddate: [this.overviewDetailData.wipro_shortlisteddate, Validators.required]
    });
    //secureForm form check end*
    this.closeForm = this._fb.group({
      decisiondate: [this.overviewDetailData.wipro_closedecisiondate, Validators.required],
    });

  }
  //qualifyForm-value assignment and validation end*
  setQualifyForm(data) {
    this.qualifyForm = this._fb.group({
      proposalType: [data.proposalType, Validators.required],
      cbu: [this.cbuName, Validators.required],
      country: [this.countryName, Validators.required],
      state: [this.stateName, Validators.required],
      city: [this.cityName, Validators.required],
      projectDuration: [data.projectDuration, Validators.required],
      isBG: [data.isBG, Validators.required],
      advisorName: [this.advisorName, Validators.required],
      advisorContact: [this.advisorContact, Validators.required],
      advisorOwner: [this.advisorOwner, Validators.required],
      primaryContact: [this.primaryContactName, Validators.required],
      SapCode: [this.sapCodeName, Validators.required],
      decisionMakerContacts: [this.DMC, Validators.required],
      estimatedClosureDate: [data.estimatedClosureDate, Validators.required],
      digitalBigBets: [data.digitalBigBets, Validators.required],
      estimatedEmpanelment: [this.empanelmentValue, Validators.required],
      estimatedRFI: [this.rfiValue, Validators.required]
    });
  }
  ValidateSpace(data) {
    console.log(this.description, "data")
    if (data.trim().length == 0) {
      this.description = data.trim();
      this.createForm = this._fb.group({
        ...this.createForm.value,
        description: [this.description, Validators.required],
      })
    }
  }
  //Auto save Implementation code start
  saveObjectTemplate() {
    return {
      opportunityId: this.opportunityId,
      name: this.createForm.value.opportunityName,
      Account: this.SelectedAccountObj,
      SapCode: this.selectedsapCodetObj,
      Source: this.createForm.value.source,
      Currency: this.SelectedCurrencyObj,
      ProposalType: this.qualifyForm.value.proposalType,
      EstRFIValue: this.qualifyForm.value.estimatedRFI,
      EstEmphalmentValue: this.qualifyForm.value.estimatedEmpanelment,
      Vertical: this.createForm.value.vertical,
      CBU: this.selectedCbuObj,
      Region: this.createForm.value.opportunityregion,
      VerticalSalesOwner: this.redisVerticalOwnerSalesSave,
      BigBet: this.qualifyForm.value.digitalBigBets,
      estimatedclosedate: this.estimatedclosedate,
      ProposalSubmissionDate: this.proposalSubmissionDate,
      wipro_engagementstartdate: this.engStartDate,
      wipro_engagementenddate: this.engEndDate,
      wipro_submitteddate: this.submittedDate,
      wipro_shortlisteddate: this.shortlistedDate,
      wipro_closedecisiondate: this.decisionDate,
      IsSimpledeal: this.IsSimpleDeal,
      DurationInMonth: this.qualifyForm.value.projectDuration,
      Country: this.selectedCountryObj,
      State: this.selectedStateObj,
      ContractingCity: this.selectedCityObj,
      AdvisorName: this.selectedAdvisorNameObj,
      AdvisorOwnerName: this.redisAdvisorOwnerSave,
      AdvisorContact: this.selectedAdvisorContactObj,
      ScopeOfWork: this.createForm.value.description,
      PrimaryContact: this.selectedPrimaryContactObj,
      DecisionMakers: this.selectedContact,
      WiproLinkedLeadType: this.leadType,
      WiproOriginatingLead: this.orginatingDetails,
      OppLinkedLeads: this.leadSourceDetails,
      OppOwner: this.opportunityOwnerId,
      PipelineStage: this.overviewDetailData.PipelineStage,
      NoAdvisor: this.noAdvisorId,
      CreatedOn: this.overviewDetailData.CreatedOn,
      statecode: this.overviewDetailData.statecode,
      ENUSBUId: this.ENUSBUId,
      WiproSbu: this.WiproSbu,
      IndiaSBUId: this.IndiaSBUId,
      IsBgcgemd: this.qualifyForm.value.isBG,
      WiproAppirioIsWiproOwned: this.overviewDetailData.WiproAppirioIsWiproOwned ? this.overviewDetailData.WiproAppirioIsWiproOwned : "",
      solesource: this.competitorFlag,
      CreateStageDate: this.overviewDetailData.CreateStageDate,
      QualifyStageDate: this.overviewDetailData.QualifyStageDate,
      PursuitStageDate: this.overviewDetailData.PursuitStageDate,
      SourceName: this.overviewDetailData.SourceName,
      SourceDisplay: this.overviewDetailData.SourceDisplay,
      VerticalName: this.overviewDetailData.VerticalName,
      RegionName: this.overviewDetailData.RegionName,
      BigBetName: this.overviewDetailData.BigBetName,
      OppCompetitorList: this.competitorList,
      IsAppirioFlag: this.overviewDetailData.IsAppirioFlag,
      IsSapcodeRequested: this.overviewDetailData.IsSapcodeRequested,
      OpportunityTypeId: this.overviewDetailData.OpportunityTypeId,
      OpportunityTCV: this.wiproTCV,
      IsRegionChange: this.IsRegionChange,
      oldAdvisorName: this.oldAdvisorName,
      oldAdvisorContact: this.oldAdvisorContact,
      oldAdvisorOwner: this.oldAdvisorOwner,
      oldCountryValue: this.oldCountryValue,
      oldStateValue: this.oldStateValue,
      oldCityValue: this.oldCityValue,
      oldSapName:this.oldSapName,
      oldPrimaryContact: this.oldPrimaryContact,
      SendThankYouNote: this.overviewDetailData.SendThankYouNote,
      WiproServiceLineDtls: this.serviceLineArray,
      OwnerName: this.accountOwner,
      OwnerId: this.accountOwnerId,
      DaSpocName:this.overviewDetailData.DaSpocName,
      DaSpocId:this.overviewDetailData.DaSpocId,
      IsDaSpocApproval:this.IsDaSpocApproval,
      NonWTFlag:this.overviewDetailData.NonWTFlag
      //CreateStageDate:
    }
  }
  AppendRedisCache() {
    let currentArrayObject = this.saveObjectTemplate();
    console.log("currentArrayObject", currentArrayObject)
    let indexOfCurrentObject = this.redisArray.findIndex(x => x.opportunityId == this.opportunityId);
    if (indexOfCurrentObject !== -1) {
      this.redisArray.splice(indexOfCurrentObject, 1);
      if (this.redisArray.length > 4) {
        this.redisArray.shift();
        this.redisArray.push(currentArrayObject);
      }
      else {
        this.redisArray.push(currentArrayObject);
      }
    }
    else {
      if (this.redisArray.length > 4) {
        this.redisArray.shift();
        this.redisArray.push(currentArrayObject);
      }
      else {
        this.redisArray.push(currentArrayObject);
      }
    }
    this.callRedisService();
  }
  callRedisService() {
    console.log(this.redisArray, "redisarray")
    this.service.SetRedisCacheData(this.redisArray, 'saveOpportunity').subscribe(res => {
      if (!res.IsError) {
        console.log("SUCESS FULL AUTO SAVE")
      }
    }, error => {
      console.log(error)
    })
  }
  ClearRedisCache() {
    this.service.SetRedisCacheData("", 'saveOpportunity').subscribe(res => console.log(res))
    this.service.deleteRedisCacheData('saveOpportunity').subscribe(res => console.log(res))
  }
  //Auto save Implementation code end
  public saveMethodCall() {
    this.isLoading = true;
    this.createFormErrorCheck = true;
    if (this.projectState == '184450000') {
      if (this.proceedToQualify) {
        //commented this code because of bug 60590
        // pass both create form and qualify form deatils for validate and submit method
        this.updatedStage = "184450001";
        this.validateAndSubmitFrom('createForm,qualifyForm');

      } else {
        // pass create form form deatils for validate and submit method
        this.estselectedDate = this.datePipe.transform(this.estimatedclosedate, 'yyyy-MM-dd');
        let currentdate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
        if (this.estselectedDate) {
          if (this.estselectedDate < currentdate) {
            this.estimateDateFlagCheck = true;
          }
        }
        if (!this.estimateDateFlagCheck) {
          this.validateAndSubmitFrom('createForm');
          this.updatedStage = "";
        }
        else {
          this.isLoading = false;
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            let invalidElements = this.el.nativeElement.querySelectorAll('input.orangeborder, mat-select.orangeborder,textarea.orangeborder,div.bg-error,form.bg-error');
            if (invalidElements.length > 0) {
              clearInterval(this.interval);
              this.scrollTo(invalidElements[0]);
            }
          }, 0);
        }
      }

    } else if (this.projectState == '184450001') {
      this.qualifyFormErrorCheck = true;
      if (this.proceedTopursuit) {
        // pass both create form,qualify form and pursuit form deatils forvalidate and submit method
        this.updatedStage = "184450002";
        //competitor flag checking
        if (!this.competitorFlag) {
          this.isLoading = false;
          this.projectService.setSession('showMessage', true);
          this.projectService.displayMessageerror("Kindly navigate to competitors to select if the opportunity is sole sourced")
        }
        else {
          this.projectService.setSession('showMessage', false);
          this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm');
        }

      } else {
        // pass both create form and quaify form deatils for validate and submit method
        this.validateAndSubmitFrom('createForm,qualifyForm');
        this.updatedStage = "";
      }

    } else if (this.projectState == '184450002') {
      this.qualifyFormErrorCheck = true;
      this.persuitFormErrorCheck = true;
      if (this.proceedToSecure) {
        // pass both create form,qualify form, pursuit form and secure from deatils for validate and submit method
        if (!this.IsSimpleDealFlag) {
          this.updatedStage = "184450003";
          this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm,secureForm');
        }
        else {
          this.updatedStage = "";
          this.closeStage = true;
          this.showSapCodeErrorColor = true;
          if (!this.competitorFlag) {
            this.isLoading = false;
            this.projectService.setSession('showMessage', true);
            this.projectService.displayMessageerror("Kindly navigate to competitors to select if the opportunity is sole sourced")
          }
          else if (this.overviewDetailData.SendThankYouNote) {
            this.isLoading = false;

            this.projectService.displayMessageerror("Dear user,Kindly enter SLBDM'S in Business solution page service line section")
          }
          else if (this.SLFlag || this.IPFlag) {
            this.isLoading = false;
            this.projectService.displayMessageerror("Kindly navigate to business solution to accept/reject service line or IP")
          }
          else if (!this.cloudFlag) {
            this.isLoading = false;
            this.projectService.displayMessageerror("Kindly navigate to business solution to enter the cloud data")
          }
          else {
            this.projectService.setSession('showMessage', false);
            this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm,secureForm,closeForm');
          }
        }


      } else {
        // pass both create form and quaify form deatils for validate and submit method
        this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm');
        this.updatedStage = "";
      }

    } else if (this.projectState == '184450003') {
      this.qualifyFormErrorCheck = true;
      this.persuitFormErrorCheck = true;
      this.secureFormErrorCheck = true;
      // window 4 need to puut to validate the close form details
      if (this.proceedToClose || this.IsSimpleDealFlag) {
        // pass both create form,qualify form, pursuit form,secure form and close from for validate and submit method
        this.updatedStage = "";
        this.closeStage = true;
        this.showSapCodeErrorColor = true;
        if (!this.competitorFlag) {
          this.isLoading = false;
          this.projectService.setSession('showMessage', true);
          this.projectService.displayMessageerror("Kindly navigate to competitors to select if the opportunity is sole sourced")
        }
        else if (this.overviewDetailData.SendThankYouNote) {
          this.isLoading = false;

          this.projectService.displayMessageerror("Dear user,Kindly enter SLBDM'S in Business solution page service line section")
        }
        else if (this.SLFlag || this.IPFlag) {
          this.isLoading = false;
          this.projectService.displayMessageerror("Kindly navigate to business solution to accept/reject service line or IP")
        }
        else if (!this.cloudFlag) {
          this.isLoading = false;
          this.projectService.displayMessageerror("Kindly navigate to business solution to enter the cloud data")
        }
        else {
          this.projectService.setSession('showMessage', false);
          this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm,secureForm,closeForm');
        }
        //code to check is sap code is entered by user or not:
      } else {
        // pass both create form,qualify form, pursuit form and secure from deatils for validate and submit method
        this.validateAndSubmitFrom('createForm,qualifyForm,persuitForm,secureForm');
        this.updatedStage = "";
      }

    } else if (this.projectState == '184450004') {
      // close state operations yet to be discussed
      this.closeStage = true;
      this.showSapCodeErrorColor = true;
    }
  }
  //sap code validation
  removeSapCodeValidation() {
    this.qualifyForm.removeControl('SapCode');
    //this.qualifyForm.get('SapCode').removeControl('SapCode');
  }
   //state city validation
  removeStateCityValidation(){
    this.qualifyForm.removeControl('state');
    this.qualifyForm.removeControl('city');
  }

  // validationForm for Save
  validateAndSubmitFrom(forms) {
    console.log("sapflag", this.closeStage)
    console.log("sapflag1", this.sapData.length)
    if (!this.closeStage && !this.sapData.length) {
      this.removeSapCodeValidation()
       }
    if(this.countryName && this.countrySysGuid){
      if(this.countryName == "INDIA" || this.countryName == "UNITED KINGDOM" || this.countryName == "USA"
      || this.countryName == "United States" || this.countryName == "UK" || this.countryName == "India"
      || this.countryName == "United Kingdom" || this.countryName == "UNITED STATES"){
      this.isMandatoryFlagSC=true;
      }
      else{
      this.isMandatoryFlagSC=false;
      this.removeStateCityValidation();
      }
    }
    this.estselectedDate = this.datePipe.transform(this.estimatedclosedate, 'yyyy-MM-dd');
    let currentdate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    if (this.estselectedDate) {
      if (this.estselectedDate < currentdate) {
        this.estimateDateFlagCheck = true;
      }
    }
    if (this.isAdvisorFunction) {
      if (this.advisorOwnerMapGuid && this.userGuid == this.advisorOwnerMapGuid && !this.noAdvisor) {
        this.callFormValidationMethod(forms);
      }
      else {
        this.isLoading = false;
        this.projectService.displayMessageerror("Selected advisor owner should match Logged in user")
      }
    }
    else {
      this.callFormValidationMethod(forms);
    }    // this method will take string of received forms with comma as delimiter
    // need to loop through the forms and check for formvalid conditions
    // if all is valid return true else return false

    // below condition is to check all the forms are valid
    // let proceedSubmit = formList.every(function (e) {
    //   return this[e].valid;
    // });


  };
  // scroll to invalid elements starts here
  callFormValidationMethod(forms) {
    // the below method is traditional way to check if above is not supported in cross browser platform
    if(!this.isNonWt && this.showDASpocAttributes && this.tcvValue >=5000000 && !this.IsDaSpocApproval && this.proceedToClose){
    this.DASpocValidationCheck=false;
  }
  else{
    this.DASpocValidationCheck=true;
  }
    const formList = forms.split(',');
    let proceedSubmit = true;
    for (var i = 0; i < formList.length; i++) {
      if (this[formList[i]].invalid) {
        proceedSubmit = false;
        break;
      }
    }

    // proceedSubmit variable will return true if all the received form elements are valid else false
    if (proceedSubmit) {
      this.opportunityDataForSave = this.collectFormData();
      Object.keys(this.opportunityDataForSave).map(data => {
        if (this.opportunityDataForSave[data] == 'MakeValid') { return this.opportunityDataForSave[data] = '' }
        else { return this.opportunityDataForSave[data] }
      });
      if (!this.simpleDealValidation) {
        if(!this.DASpocValidationCheck){
        this.isLoading = false;
        this.reviewPendingPopup();
        }
        else{
        this.callSaveAPI();
        }
      }
      else {
        this.isLoading = false;
        this.simpleDealPopUp();
      }
      // call method for save api and pass the above object
    } else {
      this.isLoading = false;
      this.projectService.displayMessageerror("Please enter the mandatory fields")
      let invalidElements = this.el.nativeElement.querySelectorAll('input.orangeborder, mat-select.orangeborder,textarea.orangeborder,div.bg-error,form.bg-error');
      console.log("invalidElements", invalidElements)
      if (invalidElements.length > 0) {
        this.scrollTo(invalidElements[0]);
      } else {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          let invalidElements = this.el.nativeElement.querySelectorAll('input.orangeborder, mat-select.orangeborder,textarea.orangeborder,div.bg-error,form.bg-error');
          if (invalidElements.length > 0) {
            clearInterval(this.interval);
            this.scrollTo(invalidElements[0]);
          }
        }, 0);
      }
    }
  }
  callSaveAPI() {
    this.projectService.saveOpportunityData(this.opportunityDataForSave).subscribe(saveobj => {
      console.log("saveobj", saveobj.ResponseObject)
      if (saveobj.IsError == false) {
        if (this.redisArray.length > 0) {
          let index = this.redisArray.findIndex(data => data.opportunityId == this.opportunityId);
          if (index !== -1) {
            if (this.redisArray.length == 1) {
              this.ClearRedisCache();
              this.redisArray = [];
            }
            else {
              this.redisArray.splice(index, 1)
              this.callRedisService();
            }
          }
        }
        this.projectState = saveobj.ResponseObject.PipelineStage ? saveobj.ResponseObject.PipelineStage.toString() : "";
        this.IsSimpleDeal = saveobj.ResponseObject.IsSimpledeal ? saveobj.ResponseObject.IsSimpledeal : false;

        if (this.roleObject && this.roleObject.UserRoles && this.roleObject.UserRoles.IsAdvisorFunction) {
          this.projectService.setpartialAccess();
        }
        this.projectService.ProceedQualify = false;
        this.isLoading = false;
        this.projectService.setSession('opportunityName', this.getSymbol(saveobj.ResponseObject.name));
        this.projectService.setSession('showMessage', false);
        this.projectService.stageSave();
        this.clearValidationWindows();
        this.selectedContactForSave = [];
        this.selectedLinkedAGPForSave = [];
        this.sapArrayForLookUp = [];
        this.advisorArrayForLookUp = [];
        this.opportunityDataForSave = {};
        this.currencyArrayForLookUp = [];
        this.cbuArrayForLookUp = [];
        this.advisorContactArrayForLookUp = [];
        this.verticalSalesArrayForLookUp = [];
        this.primaryContactArrayForLookUp = [];
        this.countryArrayForLookUp = [];
        this.stateArrayForLookUp = [];
        this.cityArrayForLookUp = [];
        this.cbuArrayForLookUp = [];
        this.estimateDateFlagCheck = false;
        this.displayText = "";
        this.loadDataFromRedis = false;
        this.IsRegionChange = false;
        //this.projectService.setpartialAccess(true);
        this.ngOnInit();
        this.OpportunityTCV = Number(saveobj.ResponseObject.OpportunityTCV);
        this.proposaltypeCheck = saveobj.ResponseObject.ProposalType ? saveobj.ResponseObject.ProposalType : "";
        this.projectState=saveobj.ResponseObject.PipelineStage ? saveobj.ResponseObject.PipelineStage.toString() : "";
        let rfi = saveobj.ResponseObject.EstRFIValue ? saveobj.ResponseObject.EstRFIValue : "";
        let empanelment = saveobj.ResponseObject.EstEmphalmentValue ? saveobj.ResponseObject.EstEmphalmentValue : "";
        this.opportunityOwnerId=saveobj.ResponseObject.OppOwner ? saveobj.ResponseObject.OppOwner.SysGuid : null;
        if (this.proposaltypeCheck == "184450003" && Number(rfi)) {
          if (rfi < this.OpportunityTCV) {
            this.displayText = "Please note that TCV is greater than RFI value";
          }
        }
        else if (this.proposaltypeCheck == "184450001" && Number(empanelment)) {
          if (empanelment < this.OpportunityTCV) {
            this.displayText = "Please note that TCV is greater than Empanelment value";
          }
        }
        else {
          this.displayText = "";
        }

        if (!this.projectService.initiateObButton) {
          setTimeout(() => {
            this.projectService.displayMessageerror("Data saved successfully!" + ' ' + this.displayText);
          }, 1000);
        }

        if ((this.projectState == '184450003' && this.projectService.restTab == true) || (this.projectState == '184450002' && this.IsSimpleDeal == true && this.projectService.restTab == true)) {


          if (this.proposaltypeCheck == "184450003" || this.proposaltypeCheck == "184450001") {
            //this.projectService.setSession('opportunityStatus','3');

            let CLoseoppPayload =
              {
                "OpportunityId": this.projectService.getSession('opportunityId'),
                "OwnerId": this.opportunityOwnerId,
                "WiproPipelinestage": 184450004
              }
            console.log(CLoseoppPayload, 'closeopportunitypayload overview')
            this.projectService.saveOpportunityData(CLoseoppPayload).subscribe(saveobjOpp => {
              if (!saveobjOpp.IsError) {
                console.log(saveobjOpp, 'closeopportunitypayload')
                //this.projectService.setSession('opportunityStatus','3');
                this.ngOnInit();
                this.projectService.winreasonNavigate1 = true;
                this.projectService.setSession('currentState', saveobjOpp.ResponseObject.PipelineStage ? saveobjOpp.ResponseObject.PipelineStage.toString() : "");
                this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === saveobjOpp.ResponseObject.PipelineStage);
                //won api code start
                let payload =
              {
                "Status": "3",
                "OpportunityId": this.projectService.getSession('opportunityId')
              }

            //getwonOpportunity()
            this.projectService.getwonOpportunity(payload).subscribe(saveobj => {
              if (!saveobj.IsError) {
                // console.log(saveobj, 'closeopportunitypayload2')
                if (saveobj.ResponseObject) {
                  this.projectService.winreasonNavigate2 = true;
                  this.projectService.stageSave();
                  // this.router.navigate(['/opportunity/opportunityview/closereason']);
                }
                else {

                }
              }
            },
              err => {
                this.projectService.displayerror(err.status);
              });
                //won api code end
              }
            },
              err => {
                this.projectService.displayerror(err.status);
              });

            this.projectService.orderpagestart = false;

            // this.router.navigate(['/opportunity/opportunityview/closereason']);
            this.projectService.restTab = false;
            this.projectService.initiateObButton = false;


          }
          else {
            this.projectService.restTab = true;
            this.projectService.orderpagestart = true;
            this.projectService.initiateObButton = false;
            this.router.navigate(['/opportunity/opportunityview/order']);
            this.projectService.setordertab(true);
            this.projectService.initiateObButton = false;

          }


        }

        else {
          this.projectService.orderpagestart = false;
          this.router.navigate(['/opportunity/opportunityview/overview']);
        }
      }
      else {
        this.projectService.displayMessageerror("Error! Unable to save data");
        this.isLoading = false;
      }
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);
      })
  }
  scrollTo(el: HTMLElement) {
    console.log("element", el)
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
  //simple to normal pop up
  simpleDealPopUp() {
    const dialogRef = this.dialog.open(ConvertNormalDealPopup,
      {
        width: '450px',
        data: {
          tcvVal: this.wiproTCV,
          currency: this.currencyName
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.IsSimpleDeal = false;
        this.opportunityDataForSave.WiproSimpledeal = false;
        if(!this.DASpocValidationCheck){
        this.isLoading = false;
       this.reviewPendingPopup();
      }
      else{
        this.isLoading = true;
        this.callSaveAPI();
      }
        //window.scroll(0, 0);
        console.log('simpleDeal', this.IsSimpleDeal);
      }
      else {
        this.IsSimpleDeal = true;
        //window.scrollBy(0, 1000);
        console.log('simpleDeal', this.IsSimpleDeal);
      }
    })
  }

    reviewPendingPopup(){
    const dialogRef = this.dialog.open(integratedDealPopup,
      {
        width: '350px',
        data: {
          message: "Delivery assurance review and approval of opportunity is pending. Please have the required approval to proceed with opportunity closure.”"
        }

      });
  }
  //advance look up code implementation start
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
    isLoader: false,
    casesensitive: false
  };
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'DecisionMakers': {

        // return (this.selectedContact.length > 0) ?  this.selectedContact : []
        return (this.selectedContact.length > 0) ? JSON.parse(JSON.stringify(this.selectedContact)) : []

      }
      case 'SapCode': {
        return (this.sapArrayForLookUp && this.sapArrayForLookUp.length > 0 && this.sapArrayForLookUp[0].SysGuid) ? this.sapArrayForLookUp : []
      }
      case 'AdvisorName': {
        return (this.advisorArrayForLookUp && this.advisorArrayForLookUp.length > 0 && this.advisorArrayForLookUp[0].SysGuid) ? this.advisorArrayForLookUp : []
      }
      case 'Currency': {
        return (this.currencyArrayForLookUp && this.currencyArrayForLookUp.length > 0 && this.currencyArrayForLookUp[0].SysGuid) ? this.currencyArrayForLookUp : []
      }
      case 'AdvisorContact': {
        return (this.advisorContactArrayForLookUp && this.advisorContactArrayForLookUp.length > 0 && this.advisorContactArrayForLookUp[0].SysGuid) ? this.advisorContactArrayForLookUp : []
      }
      case 'PrimaryContact': {
        return (this.primaryContactArrayForLookUp && this.primaryContactArrayForLookUp.length > 0 && this.primaryContactArrayForLookUp[0].SysGuid) ? this.primaryContactArrayForLookUp : []
      }
      case 'Vertical_Owner': {
        return (this.verticalSalesArrayForLookUp && this.verticalSalesArrayForLookUp.length > 0 && this.verticalSalesArrayForLookUp[0].UserId) ? this.verticalSalesArrayForLookUp : []
      }
      case 'Contractingcountry': {
        return (this.countryArrayForLookUp && this.countryArrayForLookUp.length > 0 && this.countryArrayForLookUp[0].SysGuid) ? this.countryArrayForLookUp : []
      }
      case 'state': {
        return (this.stateArrayForLookUp && this.stateArrayForLookUp.length > 0 && this.stateArrayForLookUp[0].SysGuid) ? this.stateArrayForLookUp : []
      }
      case 'city': {
        return (this.cityArrayForLookUp && this.cityArrayForLookUp.length > 0 && this.cityArrayForLookUp[0].SysGuid) ? this.cityArrayForLookUp : []
      }
      case 'Cbu': {
        return (this.cbuArrayForLookUp && this.cbuArrayForLookUp.length > 0 && this.cbuArrayForLookUp[0].SysGuid) ? this.cbuArrayForLookUp : []
      }
    }
  }
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
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
      console.log(x)
      if (x.action == 'loadMore') {

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          pageNo: x.currentPage,
          Id: this.accountSysGuid,
          advisorSysGuid: this.advisorSysGuid,
          Vertical: this.overviewDetailData.Vertical,
          countryId: this.countrySysGuid,
          stateId: this.stateSysGuid,
          RegionidID: this.overviewDetailData.Region,
          CbuId: this.cbuSysGuid,
          geography: this.geography,
          WiproSbu: this.WiproSbu
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink;
          this.lookupdata.recordCount = res.PageSize;
          if (controlNameLoaded == "DecisionMakers") {
            this.ContactListArray = this.lookupdata.tabledata.concat(res.ResponseObject);
          }

        })

      } else if (x.action == 'search') {
        console.log("this.lookupdata.tabledata", this.lookupdata.tabledata)
        let lookupDataTemp = this.lookupdata.tabledata;
        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          //pageNo: this.lookupdata.pageNo
          pageNo: x.currentPage,
          Id: this.accountSysGuid,
          advisorSysGuid: this.advisorSysGuid,
          Vertical: this.overviewDetailData.Vertical,
          countryId: this.countrySysGuid,
          stateId: this.stateSysGuid,
          RegionidID: this.overviewDetailData.Region,
          CbuId: this.cbuSysGuid,
          geography: this.geography,
          WiproSbu: this.WiproSbu
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.recordCount = res.PageSize
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          console.log("contactlist", this.ContactListArray);
          if (controlNameLoaded == "DecisionMakers" && res.ResponseObject.length > 0) {
            this.ContactListArray = lookupDataTemp.concat(res.ResponseObject);
          }
          else {
            this.lookupdata.tabledata = res.ResponseObject;
          }
          console.log("contactlist1", this.ContactListArray);
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
  AppendParticularInputDataFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        if (controlName == 'SapCode') {
          this.selectedsapCodetObj = selectedData[0];
          this.sapCodeName = this.selectedsapCodetObj.Name;
          this.projectService.setSession("sapName", this.sapCodeName);
          this.sapCodeSysGuid = this.selectedsapCodetObj.SysGuid;
          this.sapArrayForLookUp = [];
          this.selectedsapCodetObj.Id = this.selectedsapCodetObj.SysGuid;
          this.sapArrayForLookUp.push(this.selectedsapCodetObj);
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'Currency') {
          this.SelectedCurrencyObj = selectedData[0];
          this.currencyName = this.SelectedCurrencyObj.Name;
          this.currencySysGuid = this.SelectedCurrencyObj.SysGuid;
          this.getCurrencyMultiplier();
          this.currencyArrayForLookUp = [];
          this.SelectedCurrencyObj.Id = this.SelectedCurrencyObj.SysGuid;
          this.currencyArrayForLookUp.push(this.SelectedCurrencyObj);
          this.AppendRedisCache();
          this.createForm = this._fb.group({
            ...this.createForm.value,
            currency: [this.currencyName, Validators.required],
          })
        }
        else if (controlName == 'AdvisorName') {
          this.selectedAdvisorNameObj = selectedData[0];
          this.advisorName = this.selectedAdvisorNameObj.Name;
          this.advisorSysGuid = this.selectedAdvisorNameObj.SysGuid;
          this.selectedAdvisorOwnerObj = selectedData[0];
          this.advisorOwner = this.selectedAdvisorOwnerObj.MapName;
          this.advisorOwnerMapGuid = this.selectedAdvisorOwnerObj.MapGuid;
          this.advisorArrayForLookUp = [];
          this.selectedAdvisorNameObj.Id = this.selectedAdvisorNameObj.SysGuid;
          this.advisorArrayForLookUp.push(this.selectedAdvisorNameObj)
          //when advisor name changes
          if (this.advisorName == "") {
            this.advisorOwner = "";
            this.advisorOwnerMapGuid = "";
          }
          //when advisor name is no advisor
          if (this.noAdvisorId == this.advisorSysGuid) {
            this.noAdvisor = true;
            this.advisorContact = "MakeValid";
            this.advisorContactSysGuid = "";
          }
          else {
            this.noAdvisor = false;
            this.advisorContact = "";
            this.advisorContactSysGuid = "";
          }
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'AdvisorContact') {
          this.advisorContactArrayForLookUp = [];
          this.selectedAdvisorContactObj = selectedData[0];
          this.advisorContact = this.selectedAdvisorContactObj.Name;
          this.advisorContactSysGuid = this.selectedAdvisorContactObj.SysGuid;
          this.selectedAdvisorContactObj.Id = this.selectedAdvisorContactObj.SysGuid;
          this.advisorContactArrayForLookUp.push(this.selectedAdvisorContactObj);
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'PrimaryContact') {
          this.primaryContactArrayForLookUp = [];
          this.selectedPrimaryContactObj = selectedData[0];
          this.primaryContactName = this.selectedPrimaryContactObj.Name;
          this.primaryContactSysGuid = this.selectedPrimaryContactObj.SysGuid;
          this.selectedPrimaryContactObj.Id = this.selectedPrimaryContactObj.SysGuid;
          this.primaryContactArrayForLookUp.push(this.selectedPrimaryContactObj);
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'Vertical_Owner') {
          this.selectedVerticalSalesOwnerObj = selectedData[0];
          this.VerticalSalesOwnerName = this.selectedVerticalSalesOwnerObj.UserName;
          this.VerticalSalesOwnerSysGuid = this.selectedVerticalSalesOwnerObj.UserId;
          this.verticalSalesArrayForLookUp = [];
          this.selectedVerticalSalesOwnerObj.Id = this.selectedVerticalSalesOwnerObj.userId;
          this.verticalSalesArrayForLookUp.push(this.selectedVerticalSalesOwnerObj);
          this.AppendRedisCache();
          this.createForm = this._fb.group({
            ...this.createForm.value,
            verticalSales: [this.VerticalSalesOwnerName, Validators.required],
          })
        }
        else if (controlName == 'Contractingcountry') {

          this.countryArrayForLookUp = [];
          this.stateArrayForLookUp = [];
          this.cityArrayForLookUp = [];
          this.stateList = [];
          this.cityList = [];
          this.stateName = "";
          this.stateSysGuid = "";
          this.cityName = "";
          this.citySysGuid = "";
          this.selectedStateObj = { SysGuid: "", Name: "" };
          this.selectedCityObj = { SysGuid: "", Name: "" };

          this.selectedCountryObj = selectedData[0];
          this.countryName = this.selectedCountryObj.CountryName;
          this.countrySysGuid = this.selectedCountryObj.SysGuid;
          this.selectedCountryObj.Id = this.selectedCountryObj.SysGuid
          this.countryArrayForLookUp.push(this.selectedCountryObj);
             if(this.countryName == "INDIA" || this.countryName == "UNITED KINGDOM" || this.countryName == "USA"
      || this.countryName == "United States" || this.countryName == "UK" || this.countryName == "India"
      || this.countryName == "United Kingdom" || this.countryName == "UNITED STATES"){
      this.isMandatoryFlagSC=true;
      }
      else{
      this.isMandatoryFlagSC=false;
      }
          this.getStateList(this.countrySysGuid)
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'state') {
          this.stateArrayForLookUp = [];
          this.selectedStateObj = selectedData[0];
          this.stateName = this.selectedStateObj.Name;
          this.stateSysGuid = this.selectedStateObj.SysGuid;
          this.selectedStateObj.Id = this.selectedStateObj.SysGuid
          this.stateArrayForLookUp.push(this.selectedStateObj)
          this.cityList = [];
          this.cityName = "";
          this.citySysGuid = "";
          this.selectedCityObj = { SysGuid: "", Name: "" };
          this.getCityList(this.stateSysGuid)
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'city') {
          this.cityArrayForLookUp = [];
          this.selectedCityObj = selectedData[0];
          this.cityName = this.selectedCityObj.Name;
          this.citySysGuid = this.selectedCityObj.SysGuid;
          this.selectedCityObj.Id = this.selectedCityObj.SysGuid
          this.cityArrayForLookUp.push(this.selectedCityObj);
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'Cbu') {
          this.cbuArrayForLookUp = [];
          this.selectedCbuObj = selectedData[0];
          this.cbuName = this.selectedCbuObj.Name;
          this.cbuSysGuid = this.selectedCbuObj.SysGuid;
          this.selectedCbuObj.Id = this.selectedCbuObj.SysGuid;
          this.cbuArrayForLookUp.push(this.selectedCbuObj);
          this.AppendRedisCache();
          this.setQualifyForm(this.qualifyForm.value)
        }
        else if (controlName == 'DecisionMakers') {
          this.selectedContact = [];

          selectedData.forEach(data => {
            this.appendcontact(data);
            this.onChangeHandlerQualifyForm('');
          });
        }
      }
    }
  }
  /*****************Advance search popup ends*********************/
  //remove duplicate data for DMC
  removeDuplicates(array, key) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((el) => (
        el[key] === obj[key]
      ))
    )
  }
  //collectFormData for submit
  selectedContactForSave: any[];
  collectFormData() {
    //code written to remove duplicate data
    console.log("savedmc", this.selectedContactForSave)
    this.selectedContactForSave = this.selectedContact;
    this.selectedContactForSave = this.removeDuplicates(this.selectedContactForSave, 'SysGuid')
    //code written to remove already saved data 
    console.log(this.selectedContact, "savedmc1")
    console.log(this.savedDMC, "savedmc2")
    if (this.selectedContactForSave.length > 0) {
      for (var i = 0; i < this.savedDMC.length; i++) {
        for (var j = 0; j < this.selectedContactForSave.length; j++) {
          if (this.savedDMC[i].OppDecisionMakerid != null) {
            if (this.savedDMC[i].SysGuid == this.selectedContactForSave[j].SysGuid) {
              //below line was to remove already saved data
              this.savedDMC[i].dataPresentForSave = true;
            }

          }
        }

      }
      console.log(this.selectedContact, "savedmc13")
      console.log(this.savedDMC, "savedmc23")
      this.savedDMC.map(data => {
        console.log(this.savedDMC, "dmccheck")
        if (!data.dataPresentForSave) {
          let obj = {
            "SysGuid": data.SysGuid,
            "OppDecisionMakerid": data.OppDecisionMakerid,
            "statecode": 1
          }
          this.selectedContactForSave.push(obj)
        }
      })
    }

    console.log("savedmc", this.selectedContactForSave)
    this.estselectedDate = this.datePipe.transform(this.estimatedclosedate, 'yyyy-MM-dd');
    this.proposalSubmissionselectedDate = this.datePipe.transform(this.proposalSubmissionDate, 'yyyy-MM-dd');
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

    let formObject = {

      "OpportunityId": this.projectService.getSession('opportunityId'),

      "DecisionMakers": this.selectedContactForSave,

      "WiproSimpledeal": this.IsSimpleDeal,

      "IsRegionChange": this.IsRegionChange,

      //"OppLinkedActivity": this.selectedConversationForSave,//send ActivityId  and OpportunityId

      //"OppLinkedLeads": this.selectedLeadForSave,//send SysGuid(opp id) and LeadGuid

      //"DomainTribe": this.createForm.value.domain,

      //"Chapter": this.createForm.value.chapter,

      //"TargetedArea": this.createForm.value.target,

      "Estimatedclosedate": this.estselectedDate,

      "Name": this.createForm.value.opportunityName,

      "BigBet": this.qualifyForm.value.digitalBigBets,

      "OpportunityAGPs": this.selectedLinkedAGPForSave,//for linke AGP

      "OwnerId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),//logged Inuser

      "Parentaccountid": this.accountSysGuid,//account sysguid

      "WiproAdvisorcontacts": this.advisorContactSysGuid,

      "WiproAdvisorname": this.advisorSysGuid,

      "WiproAdvisorowner": this.advisorOwnerMapGuid,

      "WiproCbu": this.cbuSysGuid,

      "WiproContractingcity": this.citySysGuid,

      "WiproContractingcountry": this.countrySysGuid,

      "WiproCurrency": this.currencySysGuid,

      "WiproDurationinmonths": this.qualifyForm.value.projectDuration,

      "WiproEstimatedEmpanelmentValue": this.qualifyForm.value.estimatedEmpanelment,

      "WiproEstimatedRFIValue": this.qualifyForm.value.estimatedRFI,

      "WiproIsbgcgemd": this.qualifyForm.value.isBG,

      "WiproPipelinestage": this.updatedStage,

      "WiproPrimarycontact": this.primaryContactSysGuid,

      "WiproProposalsubmissionduedate": this.proposalSubmissionselectedDate,

      "WiproProposaltype": this.qualifyForm.value.proposalType,

      "WiproRegion": this.createForm.value.opportunityregion,

      "WiproSapcode": this.sapCodeSysGuid,

      "WiproScopeOfWork": this.createForm.value.description,

      "WiproSource": this.createForm.value.source,

      "WiproState": this.stateSysGuid,

      "WiproVertical": this.createForm.value.vertical,

      "WiproVerticalsalesowner": this.VerticalSalesOwnerSysGuid,

      "CloseDecisionDate": this.decisionSelectedDate,

      "EngagementEndDate": this.engEndselectedDate,

      "EngagementStartDate": this.engStartselectedDate,

      "ShortlistedDate": this.shortlistedselectedDate,

      "SubmittedDate": this.submittedselectedDate,

      "OldOppCountry": this.oldCountryValue,

      "OldOppState": this.oldStateValue,

      "OldOppCity": this.oldCityValue,

      "oldAdvisorOwner": this.oldAdvisorOwner,

      "oldAdvisorContact": this.oldAdvisorContact,

      "oldAdvisorName": this.oldAdvisorName,

      "OldOppSapcode":this.oldSapName,

      "primaryContact": this.oldPrimaryContact,

      "WiproSbu": this.WiproSbu,

      "WiproGeography": this.geography,

      "DASpocApproval":this.isEnableDACheckBox?this.IsDaSpocApproval:null

    }

    return formObject;
  }
  subscription;
  subscriptionMoreOptions;
  overviewSubscription;
  validateFormForSaveCall;
  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }

  eventSubscriber1(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionMoreOptions) {
      this.subscriptionMoreOptions.unsubscribe();
    } else {
      this.subscriptionMoreOptions = action.subscribe(() => handler());
    }
  }
  eventSubscriber2(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.validateFormForSaveCall) {
      this.validateFormForSaveCall.unsubscribe();
    } else {
      this.validateFormForSaveCall = action.subscribe(() => handler());
    }
  }
  eventSubscriber3(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.overviewSubscription) {
      this.overviewSubscription.unsubscribe();
    } else {
      this.overviewSubscription = action.subscribe(() => handler());
    }
  }
  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.saveMethodCall, true);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit, true);
    this.eventSubscriber2(this.projectService.validateFormForSaveCall, this.validateFormToInitiateSave, true);
    this.eventSubscriber3(this.projectService.overviewSubscription, this.ngOnInit, true);
    this.projectService.clearSession('sapName');
    this.overviewDetailData = {}
    console.log("redisdata", this.redisArray)
  }
}