import {
  Component, Inject, OnInit, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef,
  HostListener, Input, AfterViewChecked
} from '@angular/core';
import { OpportunitiesService, DataCommunicationService, OrderService } from '@app/core';
import { Router } from '@angular/router';
import { AnimationMetadataType } from '@angular/animations';
// import { MatDialog } from '@angular/material/dialog/typings/dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { SearchpoaHoldersComponent } from './../../pages/searchpoa-holders/searchpoa-holders.component';
import { environment as env } from '@env/environment';
import { FileUploader } from 'ng2-file-upload';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { deleteIP1, deleteserviceLine1, Openciopopupcomponent, OpenTcvpopupcomponent, OpenIP, OpenServiceline } from './../opportunity-view/tabs/business-solution/business-solution.component';
import {
  IpandServiceLineSL, IpandHolmesInterface,
  creditServiceLineInterface, OrderserviceLineBSDetails, OrderserviceLineBSnterface,
  OrderIpDetails, OrderIPInterface,
  OrdercreditAllocationDetails, OrdercreditAllocationInterface,
  OrdersolutionsInterface, OrdersolutionDetails
} from './../../../../core/models/allopportunity.model';

import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder
} from "@angular/forms";
import { OrderOpenServiceline, OrderOpenIP, OrderdealRegisteredYesPopup, OrderdealRegisteredNoPopup } from "./../opportunity-view/tabs/order/order.component"
import { AddIpService, opportunityAdvnBSSolutionHeaders, opportunityAdvnBSSolutionNames } from '@app/core/services/add-ip.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { OrderApprovalStage, OrderModificationRequestStatus, orderApprovalType, orderTypeId, opportunityTypeId } from './../opportunity-view/tabs/order/orderenum';
import { EnvService } from '@app/core/services/env.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-modifyorder',
  templateUrl: './modifyorder.component.html',
  styleUrls: ['./modifyorder.component.scss']
})
export class ModifyorderComponent implements OnInit {
  //Table Details Variable for BS SL by sumit Start
  sowdetails = false;
  podetailsval = false;
  public uploader: FileUploader = new FileUploader({ url: URL });
  fileDataArray = [];
  Modificationdirty = false;
  dealYes = true;
  dealNo = false;
  @ViewChild('myModifyForm') public userModifyFrm: NgForm;
  @ViewChild('myModifyOverviewForm') public userModifyOverviewFrm: NgForm;
  defaultMinDate: any = new Date(1945, 0, 1);
  minEndDate: any = new Date();
  maxEndDate: any = new Date();
  minSignedEndDate: any = new Date(1945, 0, 1);
  maxSignedEndDate: any = new Date();
  DealCreationCutoffDate: any = new Date(2019, 10, 11); // 11- Nov - 2019
  maxDecimalValue = 999999999999.99;
  minDecimalValue = -99999999999.99;
  maxDecimalValueDisplay = 1000000000000.00;
  minDecimalValueDisplay = -100000000000.00;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  // negativeregex: any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  // positiveregex: any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  acceptNegative: boolean = false;
  acceptNegativeContribution: boolean = false;
  salesOrderTypeId: any = "";
  PricingUpdateOn: any = "";
  DPSDealCreatedOn: any = "";
  ErrorDisplay = false;
  ModificationId = '';
  showDualCreditButton = false;
  showWTCRS = false;
  showWTCIS = false;
  ModificationName = "";
  ModificationRequestStatus = "";
  contactNameSwitch4: boolean = false;
  contactNameSwitch1: boolean = false;
  contactNameSwitch2: boolean = false;


  panelOpenState1: boolean = false;
  panelOpenState2: boolean = false;
  panelOpenState3: boolean = true;
  panelOpenState4: boolean = true;
  panelOpenState5: boolean = true;
  panelOpenState6: boolean = true;
  panelOpenState7: boolean = true;

  serviceLineLoader: boolean = true;
  IpLoader: boolean = true;
  solutionLoader: boolean = true;
  creditAllocationLoader: boolean = true;
  disableOnRoleOverwiew = true;
  disableOnRoleBSPanel = true;
  disableOnRoleBSSL = true;
  disableOnRoleBSIp = true;
  disableOnRoleBSSolution = true;
  disableOnRoleBSCA = true;
  disableEndDate = true;
  disableAll = this.projectService.getSession("disableall") || false;
  // OpportunityId: string = "e7508ec5-3975-e911-a830-000d3aa058cb";//for credited allocation
  // OpportunityId: string = "11750929-197d-e911-a831-000d3aa058cb"; // for others
  OpportunityId: string = this.projectService.getSession("opportunityId"); // for others
  fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
  OpportunityStatus = this.projectService.getSession("opportunityStatus");
  IsAmendment = this.projectService.getSession("IsAmendment");
  // CurrencySymbol = this.projectService.getSession('currencySymbol');
  // CurrencyId = this.projectService.getSession('currencyId');
  CurrencySymbol = 'NA';
  CurrencyId = '';
  CurrencyName = '';
  ContractCurrencyName = '';
  ContractCurrencyId = '';
  ContractTCV = 0;
  modifiedSOWDate : any = "";
  VerticalId = this.projectService.getSession('verticalId');
  RegionId = this.projectService.getSession('regionId');
  sbuId = this.projectService.getSession('sbuId');
  geoId = this.projectService.getSession('GeoId');
  AccountId = this.projectService.getSession('accountid');
  pageSize = 10;
  defaultpageNumber = 1;
  OdatanextLink = null;
  totalRecordCount = 0;
  SearchTypeHomesBDM = "184450001"
  SearchTypeSolutionBDM = "184450000"
  AllianceSearchType = 6;
  NewAgeSearchType = 15;
  getSolutionNameType = 5;

  WTFlag = false;
  originalWTFlag = false;
  OrderId = this.projectService.getSession("orderId");
  IsSigned: boolean;
  approvalStageID: any = "";
  ModificationStatus: any = "";

  //Table Details Variable for Business Solution Panel
  allServiceLineDD: any = [];
  allPracticeDD: any = [];
  allSubPracticeDD: any = [];

  businessSOlutionData: any[] = [];
  OverALLSavedTCV: any = "";
  CIS = "CLOUD & INFRASTRUCTURE SERVICES (CIS)";
  CRS = "CYBERSECURITY & RISK SERVICES (CRS)";
  ACS = "ACS";
  //Table Details Variable for Business Solution Panel
  //Table Details Variable for CA
  //delete Array
  deleteCreditAllocationArray: OrdercreditAllocationDetails[] = [];
  deleteSolutionArray: OrdersolutionDetails[] = [];
  deleteIPArray: OrderIpDetails[] = [];
  deleteServiceLIneArray: OrderserviceLineBSDetails[] = [];
  creditAllocationdataDetails: OrdercreditAllocationDetails[] = [];
  creditAllocationSLDD: creditServiceLineInterface[] = [];
  creditTypeDD = [];
  pricingTypes = [];
  newCADataCount: number = 0;
  //Table Details Variable for CA Ends

  //Table Details Variable for Solutions
  SolutionDetails: OrdersolutionDetails[] = [];
  InfluenceTypeDD = [];
  serviceTypeDD = [];
  solutionTypeDD = [];
  newsolDataCount: number = 0;
  //Table Details Variable for Solutions End

  //Table Details Variable for IP
  IpDetails: OrderIpDetails[] = []
  IpandServiceLinelDD: IpandServiceLineSL[] = [];
  newIpDataCount: number = 0;
  //Table Details Variable for Ip End
  //Table Details Variable for BS SL
  newBSSLDataCount: number = 0;
  BSSLDetails: OrderserviceLineBSDetails[] = [];
  BSDualCreditDD = [];

  //CreditAllocation SL practice and Subpractice table
  tempCASL: any = [];
  tempCAPractice: any = [];
  tempCASubPractice: any = [];

  tempCADD: any = [];
  //Table Details Variable for BS SL by sumit End




  submitbtn;
  contcountry: string = "";

  SavedSltcv: any = "0.00";
  SavedIpTcv: any = "0.00";
  SavedOverallOrderTcv: any = "0.00";
  OrderSLDetails: any = [];
  OrderIPDetails: any = [];
  OrderSolutionDetails: any = [];
  OrdercreditAllocationDetails: any = [];


  /***********************Start code of saurav************************ */
  SearchType = 7;
  selectedReasonValue: any = [];
  searchedSapVaue: any = ''
  saveOverviewArray: any = ''

  VSOEmailId: any = "";


  defaultmodifyOrderDetailsObj = {

    currentOrderSAPCCName: '',
    currentOrderSAPCCId: '',
    changeOrderSAPCCName: '',
    changeOrderSAPCCId: '',
    selectedSAPCode: [],
    reasonSAPCCId: '',
    SAPCodeStateCode: 0,
    SAPModificationId: '',

    currentOrderPSD: '',
    changeOrderPSD: '',
    reasonPSDId: '',
    PSDStateCode: 0,
    PSDModificationId: '',

    currentOrderPED: '',
    changeOrderPED: '',
    reasonPEDId: '',
    PEDStateCode: 0,
    PEDModificationId: '',

    currentOrderVSOName: '',
    currentOrderVSOId: '',
    changeOrderVSOName: '',
    changeOrderVSOId: '',
    selectedVSO: [],
    resonsOrderVSOId: '',
    VSOStateCode: 0,
    VSODModificationId: '',


    currentOrderAdvisorName: '',
    currentOrderAdvisorId: '',
    changeOrderAdvisorName: '',
    changeOrderAdvisorId: '',
    selectedAdvisor: [],
    resonsOrderAdvisorId: '',
    AdvisorStateCode: 0,
    AdvisorModificationId: '',

    currentOrderPOAHolderName: '',
    currentOrderPOAHolderId: '',
    changeOrderPOAHolderName: '',
    changeOrderPOAHolderId: '',
    resonsOrderPOAHolderId: '',
    POAHolderStateCode: 0,
    POAHolderModificationId: '',

    currentorderAuthorizationName: '',
    currentorderAuthorizationId: '',
    changeOrderAuthorizationId: '',
    changeOrderAuthorizationName: '',
    resonAuthorizationId: '',
    AuthorizationStateCode: 0,
    AuthModificationId: '',

    currentrOrderSOWPOD: '',
    changeOrderSOWPOD: '',
    reasonSOWPOId: '',
    SOWPODStateCode: 0,
    POSOWModificationId: '',

  }


  modifyOrderDetailsObj: any = Object.assign({}, this.defaultmodifyOrderDetailsObj);
  advisorArr: any = [];
  sapCustomerCodeArr: any = [];
  verticalCodeArr: any = [];
  ModifyRequestNumber = "";
  ModificationOBAllocation = false;
  ModificationOverwiew = false;

  oppDataIsSimpleDeal: any = false;
  IsIndiaSBU : any = false;
  //prachi
  OrderNumber: string = '';
  OrderTCV: string = "";
  OrderTypeId: any = "";
  PricingId: any = "";

  //ICM check
  orderBookingId : any = '';
  isICMAccount : any = false;
  changesAuthorization: any = '';
  viewContractNavigate = '';
  ICMParentOpportunityId: any ='';

  constructor( public envr : EnvService,  private fileService: FileUploadService,public router: Router, public service: DataCommunicationService, public dialog: MatDialog, public orderService: OrderService,
    public projectService: OpportunitiesService, public cdRef: ChangeDetectorRef, public addIPservice: AddIpService, private EncrDecr: EncrDecrService) { }




  ngOnInit() {
    this.getIpandserviceLineData();
    this.selectReason();
    this.getDualCreditData();
    this.getInfluenceTypeData();
    this.getServiceTypeData();
    this.getSolutionTypeData();
    this.getCreditTypeData();
    // this.pricingType();
    this.checkIfOrderCreated();
    this.subscribeOnSubmit();
    // this.getOppData();
    // this.getOrderModificationOBAllocation();
    // this.getSalesOrderDetails("5f370b97-98d3-e911-a839-000d3aa058cb");

  }
  //podetails function
  valuechange(authId :  any) {
    //alert(event.value);
  if(authId == "False"){
    let tempModifiedPODetails:any = this.modifiedPODetails.filter(it => it.StateCode != 1).map(it=> {return Object.assign({},it)})
    let maxPOsignedDate:any = tempModifiedPODetails && tempModifiedPODetails.length > 0 ? this.getMaxDate(tempModifiedPODetails, 'Wipro_SignedDateUTC'):"" 
    this.modifyOrderDetailsObj.changeOrderSOWPOD = maxPOsignedDate ? maxPOsignedDate : "" ;
    // let maxPODate: any = maxPOsignedDate ? new Date(maxPOsignedDate) : "";
    // maxPODate = maxPODate ? maxPODate.setHours(0,0,0,0) : "";
    // let currentPODate:any = this.modifyOrderDetailsObj.currentrOrderSOWPOD ? new Date(this.modifyOrderDetailsObj.currentrOrderSOWPOD) : "";
    // currentPODate = currentPODate ? currentPODate.setHours(0,0,0,0) : "";
    // if( maxPODate && maxPODate != currentPODate) {
    //   this.modifyOrderDetailsObj.changeOrderSOWPOD = maxPOsignedDate ? maxPOsignedDate : "" ;
    // } else {
    //   this.modifyOrderDetailsObj.changeOrderSOWPOD = "";
    // }
  }else if(authId == "True"){
    this.modifyOrderDetailsObj.changeOrderSOWPOD = this.modifiedSOWDate ? this.modifiedSOWDate : "" ;
  }else{

    if(this.modifyOrderDetailsObj.currentorderAuthorizationId == "False"){
      let tempModifiedPODetails:any = this.modifiedPODetails.filter(it => it.StateCode != 1).map(it=> {return Object.assign({},it)})
      let maxPOsignedDate:any = tempModifiedPODetails && tempModifiedPODetails.length > 0 ? this.getMaxDate(tempModifiedPODetails, 'Wipro_SignedDateUTC'):"" 
      // if(this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "True"){
      let maxPODate: any = maxPOsignedDate ? new Date(maxPOsignedDate) : "";
      maxPODate = maxPODate ? maxPODate.setHours(0,0,0,0) : "";
      let currentPODate:any = this.modifyOrderDetailsObj.currentrOrderSOWPOD ? new Date(this.modifyOrderDetailsObj.currentrOrderSOWPOD) : "";
      currentPODate = currentPODate ? currentPODate.setHours(0,0,0,0) : "";
      if( maxPODate && maxPODate != currentPODate) {
        this.modifyOrderDetailsObj.changeOrderSOWPOD = maxPOsignedDate ? maxPOsignedDate : "" ;
      } else {
        this.modifyOrderDetailsObj.changeOrderSOWPOD = "";
      }
    }else{
      this.modifyOrderDetailsObj.changeOrderSOWPOD = this.modifiedSOWDate ? this.modifiedSOWDate : "" ;
    }

  }

  }

  //
  subscribeOnSubmit() {
    this.orderService.getSubmitModificationFlag().subscribe(data => {
      if (data == true) {
        this.projectService.clearSession("smartsearchData");
        this.disableOnRoleOverwiew = true;
        this.disableOnRoleBSPanel = true;
        this.disableOnRoleBSSL = true;
        this.disableOnRoleBSIp = true;
        this.disableOnRoleBSSolution = true;
        this.disableOnRoleBSCA = true;
        this.router.navigate(['/opportunity/opportunityview/order'])
      }
      console.log("submit flag is", data)
    });
  }

  messageAlert() {
    this.projectService.displayMessageerror("Start date of an Order cannot be changed. Please create a Negative Amendment for the original order and a Positive Amendment with the new details.");
  }


  getAccountId(): string {
    let accountId = this.projectService.getSession('accountid');
    return accountId;
  }

  getOppData() {
     let oppId = this.ICMParentOpportunityId ? this.ICMParentOpportunityId : this.OpportunityId;
    if (oppId) {
      const payload = {
        OppId: oppId,

      };
      this.orderService.getoppOverviewdetails(payload).subscribe((oppData: any) => {
        if (!oppData.IsError) {
          console.log(oppData.ResponseObject);
          this.oppDataIsSimpleDeal = (oppData && oppData.ResponseObject && oppData.ResponseObject.IsSimpledeal) ? oppData.ResponseObject.IsSimpledeal : false;
        }
      }, err => {
        this.oppDataIsSimpleDeal = false;
      })
    } else {
      this.oppDataIsSimpleDeal = false;
    }
  }

  // SAP customer Code
  getSapValue(searchValue) {
    this.addIPservice.getSapCodeDataOrder(this.AccountId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.sapCustomerCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.sapCustomerCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

    // this.searchedSapVaue=value;
    // this.sapCustomercodeValue();
  }

  selectedSapCode(selectedData) {
    this.contactNameSwitch4 = false;
    this.OdatanextLink = null;
    this.modifyOrderDetailsObj.changeOrderSAPCCName = selectedData.Name;
    this.modifyOrderDetailsObj.changeOrderSAPCCId = selectedData.Id;
    this.modifyOrderDetailsObj.selectedSAPCode = new Array(Object.assign({}, selectedData));

    // this.selectedContact4.push(this.wiproContact4[i])
  }

  getSapCodeDataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.addIPservice.getSapCodeDataOrder(this.AccountId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfSapCodePopUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.contactNameSwitch4 = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.modifyOrderDetailsObj.changeOrderSAPCCName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.modifyOrderDetailsObj.changeOrderSAPCCId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.modifyOrderDetailsObj.selectedSAPCode = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {

      if (!this.modifyOrderDetailsObj.selectedSAPCode.some(res => res.Id == modifyObject.changeOrderSAPCCId && res.Name == modifyObject.changeOrderSAPCCName)) {
        this.modifyOrderDetailsObj.changeOrderSAPCCName = "";
        this.modifyOrderDetailsObj.changeOrderSAPCCId = "";
        this.modifyOrderDetailsObj.selectedSAPCode = [];

      }
    }

  }

  getSapCodeOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {

    this.addIPservice.getSapCodeDataOrder(this.AccountId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  sapClickOutside(event) {
    let id = 'advanceSAPCodeSearch';
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.contactNameSwitch4 = false;
      this.OdatanextLink = null;
      if (!this.modifyOrderDetailsObj.selectedSAPCode.some(res => res.Name == this.modifyOrderDetailsObj.changeOrderSAPCCName && res.Id == this.modifyOrderDetailsObj.changeOrderSAPCCId)) {
        this.modifyOrderDetailsObj.changeOrderSAPCCName = "";
        this.modifyOrderDetailsObj.changeOrderSAPCCId = "";
        this.modifyOrderDetailsObj.selectedSAPCode = [];
      }
    }
  }

  //Vertical Slaes Owner

  getVerticalSalesValue(searchValue) {

    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.verticalCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.verticalCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }

  selectedValueVertical(selectedData) {

    this.contactNameSwitch1 = false;
    this.OdatanextLink = null;
    this.modifyOrderDetailsObj.changeOrderVSOName = selectedData.Name;
    this.modifyOrderDetailsObj.changeOrderVSOId = selectedData.Id;
    this.modifyOrderDetailsObj.selectedVSO = new Array(Object.assign({}, selectedData));
    //this.selectedContact1.push(this.wiproContact1[i])
  }

  getVSODataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfVSOPopUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.contactNameSwitch1 = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.modifyOrderDetailsObj.changeOrderVSOName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.modifyOrderDetailsObj.changeOrderVSOId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.modifyOrderDetailsObj.selectedVSO = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {

      if (!this.modifyOrderDetailsObj.selectedVSO.some(res => res.Id == modifyObject.changeOrderVSOId && res.Name == modifyObject.changeOrderVSOName)) {
        this.modifyOrderDetailsObj.changeOrderVSOName = "";
        this.modifyOrderDetailsObj.changeOrderVSOId = "";
        this.modifyOrderDetailsObj.selectedVSO = [];

      }
    }

  }

  getVSOOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {

    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  verticalClickOutside(event) {

    let id = 'advanceVSOSearch';
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.contactNameSwitch1 = false;
      this.OdatanextLink = null;
      if (!this.modifyOrderDetailsObj.selectedVSO.some(res => res.Name == this.modifyOrderDetailsObj.changeOrderVSOName && res.Id == this.modifyOrderDetailsObj.changeOrderVSOId)) {
        this.modifyOrderDetailsObj.changeOrderVSOName = "";
        this.modifyOrderDetailsObj.changeOrderVSOId = "";
        this.modifyOrderDetailsObj.selectedVSO = [];
      }
    }
  }

  getAdvisorSalesValue(searchValue) {

    this.addIPservice.getAllianceFinderDataOrder(searchValue, this.SearchType, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.advisorArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.advisorArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }





  selectedValueAdvisor(selectedData) {

    this.contactNameSwitch2 = false;
    this.OdatanextLink = null;
    this.modifyOrderDetailsObj.changeOrderAdvisorName = selectedData.Name;
    this.modifyOrderDetailsObj.changeOrderAdvisorId = selectedData.Id;
    this.modifyOrderDetailsObj.selectedAdvisor = new Array(Object.assign({}, selectedData));
    //     //this.selectedContact2.push(this.wiproContact2[i])
  }

  getAdvisorDataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.addIPservice.getAllianceFinderDataOrder(emittedevt.objectRowData.searchKey, this.SearchType, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfAdvisorPopUp(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.contactNameSwitch2 = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.modifyOrderDetailsObj.changeOrderAdvisorName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.modifyOrderDetailsObj.changeOrderAdvisorId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.modifyOrderDetailsObj.selectedAdvisor = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {

      if (!this.modifyOrderDetailsObj.selectedAdvisor.some(res => res.Id == modifyObject.changeOrderAdvisorId && res.Name == modifyObject.changeOrderAdvisorName)) {
        this.modifyOrderDetailsObj.changeOrderAdvisorName = "";
        this.modifyOrderDetailsObj.changeOrderAdvisorId = "";
        this.modifyOrderDetailsObj.selectedAdvisor = [];

      }
    }

  }

  getAdvisorOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, emittedevt) {

    this.addIPservice.getAllianceFinderDataOrder(emittedevt.objectRowData.searchKey, this.SearchType, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  AdvisorNameclose(event) {
    let id = 'advanceAdvisorSearch';
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.contactNameSwitch2 = false;
      this.OdatanextLink = null;
      if (!this.modifyOrderDetailsObj.selectedAdvisor.some(res => res.Name == this.modifyOrderDetailsObj.changeOrderAdvisorName && res.Id == this.modifyOrderDetailsObj.changeOrderAdvisorId)) {
        this.modifyOrderDetailsObj.changeOrderAdvisorName = "";
        this.modifyOrderDetailsObj.changeOrderAdvisorId = "";
        this.modifyOrderDetailsObj.selectedAdvisor = [];
      }
    }
  }

  //Sap customer code//
  // sapCustomercodeValue() {
  //   let body = {
  //     Id: this.getAccountId(),
  //     SearchText: this.searchedSapVaue
  //   }
  //   this.orderService.sapCustomerCode(body).subscribe((res: any) => {
  //     console.log("neha", res, body);
  //     this.sapCustomerCodeArr = (res.ResponseObject) ? res.ResponseObject : [];

  //     console.log(" this.sapCustomerCodeArr", this.sapCustomerCodeArr);

  //   })
  // }

  // @return vertical id
  getVerticalId(): string {
    let verticalId = this.projectService.getSession('verticalId');
    return verticalId;
  }
  // verticalSalesID() {
  //   const payload = {
  //     Id: this.getAccountId(),
  //     Guid: this.getVerticalId(),
  //     SearchText: this.searchedSapVaue
  //   }
  //   // this.orderService.verticalCode(payload).subscribe((res:any)=>{
  //   //   console.log("vertical response",res,payload);

  //   // })
  //   const orginalArray = this.orderService.verticalCode(payload);
  //   orginalArray.subscribe((res: any) => {
  //     console.log("res", res)
  //     this.verticalCodeArr = (res.ResponseObject) ? res.ResponseObject : [];

  //   },
  //     err => {
  //       console.log(err)
  //     });

  // }



  getModificationDetails() {
    const payload = {
      "SalesOrderId": "6c8ef8a9-3b93-e911-a834-000cd3aa058cb"
    }
    this.orderService.getModificationDetails(payload).subscribe((response: any) => {
      console.log("modifiction", response)
    })

  }



  //To select reasons field//
  selectReason() {
    this.orderService.getReason().subscribe((response: any) => {
      console.log("reasons api", response);
      this.selectedReasonValue = (response && response.ResponseObject) ? response.ResponseObject : [];
    }, err => {
      this.selectedReasonValue = [];
    })
  }
  // selectedReason(value) {

  //   console.log("reason selected ", value)
  // }



  getFinancialYearMinandMaxDate(selectedDate) {
    let minDate: any = "";
    let maxDate: any = "";
    if (selectedDate) {
      let tempDate: any = new Date(selectedDate);
      let dateMonth: any = tempDate.getMonth();
      let dateYear: any = tempDate.getFullYear();
      let tempyear: any = "";
      if (dateMonth < 3) {
        tempyear = tempDate.getFullYear() - 1;
        minDate = new Date(tempyear, 3, 1);
        maxDate = new Date(dateYear, 2, 31);

      } else {
        tempyear = tempDate.getFullYear() + 1;
        minDate = new Date(dateYear, 3, 1);
        maxDate = new Date(tempyear, 2, 31);
      }

      return Object.assign({ minDate: minDate, maxDate: maxDate });
    } else {
      return null;
    }



  }

  // POA
  NavigateToPOHeader() {
    let signedDate : any = this.modifyOrderDetailsObj.changeOrderSOWPOD ? this.modifyOrderDetailsObj.changeOrderSOWPOD : this.modifyOrderDetailsObj.currentrOrderSOWPOD;
    const dialogRef = this.dialog.open(SearchpoaHoldersComponent, {
      width: '1820px',
      data: {
        signedDate : signedDate ? this.getIsoDateFormat(signedDate) : ''
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.modifyOrderDetailsObj.changeOrderPOAHolderId = (res && res.length > 0) ? res[0].id : '';
        this.modifyOrderDetailsObj.changeOrderPOAHolderName = (res && res.length > 0) ? res[0].POAName : '';
        
      }
    }, err => console.log(err));
  }

  clearPOAHolder() {
    this.modifyOrderDetailsObj.changeOrderPOAHolderId = "";
    this.modifyOrderDetailsObj.changeOrderPOAHolderName = "";
  }

  sumOfPOValue = 0;
  poEdit = false;
  modifiypodetailspopup() {
    let readExceptDate =  (this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" && this.modifyOrderDetailsObj.changeOrderAuthorizationId == "False")  ? false : true;
    let readOnly =  ((this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "True") || this.modifyOrderDetailsObj.changeOrderAuthorizationId == "False")  ? false : true;
      let poDetailsData: any = this.modifiedPODetails.length > 0 ? this.modifiedPODetails.map(it => { return Object.assign({}, it) }) : this.orderPODetails.map(it => { return Object.assign({}, it) });
        const dialogRef = this.dialog.open(modifiedpodetailspopup, {
          width: '920px',
          data: {
            orderId: this.OrderId,
            poDetailsData: (poDetailsData.length > 0) ? poDetailsData.map(it => { return Object.assign({}, it) }) : [],
            readOnly: this.disableOnRoleOverwiew ? this.disableOnRoleOverwiew : readOnly,
            CurrencyId: this.ContractCurrencyId,
            CurrencyName: this.ContractCurrencyName,
            acceptNegative: this.acceptNegative,
            readExceptDate: this.disableOnRoleOverwiew ? this.disableOnRoleOverwiew : readExceptDate,
            poChange: this.poEdit ? this.poEdit : false,
            minStartDate : this.minSignedEndDate,
            maxStartDate : this.maxSignedEndDate
          }
        });
        dialogRef.afterClosed().subscribe(res => {
         if( res && res.poChange ) {
           this.poEdit = true;
          if ( res && res.PODetails && res.PODetails.length > 0 ) {
            this.modifiedPODetails = res.PODetails.map((it) => {
              let newColumn = Object.assign({}, it);
              // newColumn.Wipro_SignedDateUTC = newColumn.Wipro_SignedDateUTC ? newColumn.Wipro_SignedDateUTC : "" ;
              return newColumn;
            })
            let tempModifiedPODetails = this.modifiedPODetails.filter(it => it.StateCode != 1).map(it=> {return Object.assign({},it)})
            let maxPOsignedDate = tempModifiedPODetails && tempModifiedPODetails.length > 0 ? this.getMaxDate(tempModifiedPODetails, 'Wipro_SignedDateUTC'):"" ;
            
            if(this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "True"){
            let maxPODate: any = maxPOsignedDate ? new Date(maxPOsignedDate) : "";
            maxPODate = maxPODate ? maxPODate.setHours(0,0,0,0) : "";
            let currentPODate:any = this.modifyOrderDetailsObj.currentrOrderSOWPOD ? new Date(this.modifyOrderDetailsObj.currentrOrderSOWPOD) : "";
            currentPODate = currentPODate ? currentPODate.setHours(0,0,0,0) : "";
            if( maxPODate && maxPODate != currentPODate) {
              this.modifyOrderDetailsObj.changeOrderSOWPOD = maxPOsignedDate ? maxPOsignedDate : "" ;
            } else {
              this.modifyOrderDetailsObj.changeOrderSOWPOD = "";
            }
            }else{
              this.modifyOrderDetailsObj.changeOrderSOWPOD = maxPOsignedDate ? maxPOsignedDate : "" ;
            }
            
          
           
          } else  {
            this.modifiedPODetails = [];
            this.modifyOrderDetailsObj.changeOrderSOWPOD = "";
            
          }
         }  else {
           this.poEdit = false;
         } 
          
         
        })
      }
    
      getMaxDate(dateData, signedDate) {
        let maxPOsignedDateArr = dateData.map(date => date[signedDate] ? new Date(date[signedDate]) : null);
        let maxPOsignedDate: any = new Date(Math.max.apply(null, maxPOsignedDateArr));
        return maxPOsignedDate;
      }

      getIsoDateFormat(date) {
        const getDate = new Date(date);
        const setDate = new Date(
          getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000)
        );
        return setDate.toISOString();
      }
      poCount ()
      {
        if(this.modifiedPODetails.length > 0 ) {
          return this.modifiedPODetails.filter(it => it.StateCode != 1).length; 
        
        } else {
          return this.orderPODetails.length;
        }
      }

  modifiedPODetails: any = [];
  orderPODetails: any = [];
  getOverviewOrder() {
    this.disableEndDate = true;
    if (!this.disableAll) {
      this.orderService.getOrderOBAllocationModification(this.OrderId, '').subscribe(res => {
        let tempmodificationOverview = (!res || !res.ResponseObject || !res.ResponseObject.lstOverviewModifyOrderDetails) ? [] : (res.ResponseObject.lstOverviewModifyOrderDetails);
        let orderPOData: any = (!res || !res.ResponseObject || !res.ResponseObject.POModificationDetails) ? [] : (res.ResponseObject.POModificationDetails);
        this.orderPODetails = orderPOData.length > 0 ? orderPOData.map(it => {
          let poObject = {
            POTableModificationId: it.POTableModificationId ? it.POTableModificationId : "" , // Row id or primary key of the record
            OrderModificationId: it.OrderModificationId ? it.OrderModificationId : "",
            Wipro_OrderId: it.Wipro_OrderId ? it.Wipro_OrderId : "",
            Wipro_PONumber: it.Wipro_PONumber ? it.Wipro_PONumber : "",
            Wipro_OrderPOTableId: it.Wipro_OrderPOTableId ? it.Wipro_OrderPOTableId : "" , // This is order PO details reference id. If user adding new PO from order modification then it will blank/empty
            Wipro_SignedDate: it.Wipro_SignedDate ? it.Wipro_SignedDate : "",
            Wipro_SignedDateUTC: it.Wipro_SignedDateUTC ? new Date(it.Wipro_SignedDateUTC) : "",
            Wipro_Remarks: it.Wipro_Remarks ? it.Wipro_Remarks : "",
            StateCode: 0,
            POValue: it.POValue ? it.POValue : "",
            POCurrency: it.POCurrency ? it.POCurrency : "",
            POCurrencyId: it.POCurrencyId ? it.POCurrencyId : "",
            Wipro_StartDate: it.Wipro_StartDate ? new Date(it.Wipro_StartDate) : "",
            Wipro_EndDate: it.Wipro_EndDate ? new Date(it.Wipro_EndDate) : "",
            Wipro_POIssuanceDate: it.Wipro_POIssuanceDate ? new Date(it.Wipro_POIssuanceDate) : "",
            Wipro_ValuewithoutTax: it.Wipro_ValuewithoutTax ? it.Wipro_ValuewithoutTax : "",
          }
          return poObject;
        }) : [];
        tempmodificationOverview.forEach(it => {
          if (it.AttributeType == 1) {
            this.modifyOrderDetailsObj.currentOrderSAPCCName = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            this.modifyOrderDetailsObj.currentOrderSAPCCId = it.CurrentOrderDetailsId ? it.CurrentOrderDetailsId : "";
          }
          else if (it.AttributeType == 2) {
            this.modifyOrderDetailsObj.currentOrderPSD = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
          }
          else if (it.AttributeType == 3) {
            this.modifyOrderDetailsObj.currentOrderPED = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            let PSDArray: any = tempmodificationOverview.filter(att => att.AttributeType == 2);
            let PSD: any = (PSDArray.length > 0 && PSDArray[0].CurrentOrderDetails) ? PSDArray[0].CurrentOrderDetails : "";
            if (PSD && it.CurrentOrderDetails) {
              //max Date
              let oneYearFromPSD = new Date(PSD);
              oneYearFromPSD.setFullYear(oneYearFromPSD.getFullYear() + 1);
              oneYearFromPSD.setDate(oneYearFromPSD.getDate() - 1);
              this.maxEndDate = new Date(oneYearFromPSD);

              //MIn Date
              let onDayFromAfter: any = new Date(PSD);
              this.minEndDate = new Date(onDayFromAfter);
              if (new Date(it.CurrentOrderDetails) <= this.maxEndDate) {
                this.disableEndDate = false;
              }

            }
          }
          else if (it.AttributeType == 4) {
            this.modifyOrderDetailsObj.currentorderAuthorizationName = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            this.modifyOrderDetailsObj.currentorderAuthorizationId = it.CurrentOrderDetailsId ? it.CurrentOrderDetailsId : "";

          }
          else if (it.AttributeType == 5) {
            this.modifyOrderDetailsObj.currentOrderAdvisorName = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            this.modifyOrderDetailsObj.currentOrderAdvisorId = it.CurrentOrderDetailsId ? it.CurrentOrderDetailsId : "";
          }
          else if (it.AttributeType == 6) {
            this.modifyOrderDetailsObj.currentOrderVSOName = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            this.modifyOrderDetailsObj.currentOrderVSOId = it.CurrentOrderDetailsId ? it.CurrentOrderDetailsId : "";
          }
          else if (it.AttributeType == 7) {
            this.modifyOrderDetailsObj.currentrOrderSOWPOD = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            let FYDate: any = this.getFinancialYearMinandMaxDate(it.CurrentOrderDetails);
            this.minSignedEndDate = FYDate ? FYDate.minDate : new Date(1945, 0, 1);
            this.maxSignedEndDate = FYDate && (FYDate.maxDate <= new Date()) ? FYDate.maxDate : new Date();
          }
          else if ( it.AttributeType == 10) {
            this.modifyOrderDetailsObj.currentOrderPOAHolderName = it.CurrentOrderDetails ? it.CurrentOrderDetails : "";
            this.modifyOrderDetailsObj.currentOrderPOAHolderId = it.CurrentOrderDetailsId ? it.CurrentOrderDetailsId : "";
          }

        })
      });
    }
  }
 

  getOverviewModification(OverviewArray,modifyPOData) {
    this.modifiedSOWDate = "";
    this.modifiedPODetails = modifyPOData.length > 0 ? modifyPOData.map(it => {
      let poObject = {
        POTableModificationId: it.POTableModificationId ? it.POTableModificationId : "" , // Row id or primary key of the record
        OrderModificationId: it.OrderModificationId ? it.OrderModificationId : "",
        Wipro_OrderId: it.Wipro_OrderId ? it.Wipro_OrderId : "",
        Wipro_PONumber: it.Wipro_PONumber ? it.Wipro_PONumber : "",
        Wipro_OrderPOTableId: it.Wipro_OrderPOTableId ? it.Wipro_OrderPOTableId : "" , // This is order PO details reference id. If user adding new PO from order modification then it will blank/empty
        Wipro_SignedDate: it.Wipro_SignedDate ? it.Wipro_SignedDate : "",
        Wipro_SignedDateUTC: it.Wipro_SignedDateUTC ? new Date(it.Wipro_SignedDateUTC) : "",
        Wipro_Remarks: it.Wipro_Remarks ? it.Wipro_Remarks : "",
        StateCode: 2,
        POValue: it.POValue ? it.POValue : "",
        POCurrency: it.POCurrency ? it.POCurrency : "",
        POCurrencyId: it.POCurrencyId ? it.POCurrencyId : "",
        Wipro_StartDate: it.Wipro_StartDate ? new Date(it.Wipro_StartDate) : "",
        Wipro_EndDate: it.Wipro_EndDate ? new Date(it.Wipro_EndDate) : "",
        Wipro_POIssuanceDate: it.Wipro_POIssuanceDate ? new Date(it.Wipro_POIssuanceDate) : "",
        Wipro_ValuewithoutTax: it.Wipro_ValuewithoutTax ? it.Wipro_ValuewithoutTax : "",
      }
      return poObject;
    }) : [];
    this.ModificationOverwiew = OverviewArray.length > 0 ? true : false;
    OverviewArray.forEach(it => {
      if (it.AttributeType == 1) {
        this.modifyOrderDetailsObj.changeOrderSAPCCName = it.ChangeOrderDetails ? it.ChangeOrderDetails : "";
        this.modifyOrderDetailsObj.changeOrderSAPCCId = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.reasonSAPCCId = it.Reasons;

        this.modifyOrderDetailsObj.SAPModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.selectedSAPCode = [{ Id: (it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : ""), Name: (it.ChangeOrderDetails ? it.ChangeOrderDetails : ""), WiproSapCustomerNumber: '', WiproSapCompanyCode: '' }];
        this.modifyOrderDetailsObj.SAPCodeStateCode = 2;

      }
      else if (it.AttributeType == 2) {
        this.modifyOrderDetailsObj.changeOrderPSD = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.reasonPSDId = it.Reasons;
        this.modifyOrderDetailsObj.PSDModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.PSDStateCode = 2;

      }
      else if (it.AttributeType == 3) {
        this.modifyOrderDetailsObj.changeOrderPED = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.reasonPEDId = it.Reasons;
        this.modifyOrderDetailsObj.PEDModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.PEDStateCode = 2;
      }
      else if (it.AttributeType == 4) {
        this.modifyOrderDetailsObj.changeOrderAuthorizationId = it.ChangeOrderDetailsId ? ((it.ChangeOrderDetailsId == "False") ? "False" : "True") : "";
        this.modifyOrderDetailsObj.resonAuthorizationId = it.Reasons;
        this.modifyOrderDetailsObj.AuthModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.AuthorizationStateCode = 2;
      }
      else if (it.AttributeType == 5) {
        this.modifyOrderDetailsObj.changeOrderAdvisorName = it.ChangeOrderDetails ? it.ChangeOrderDetails : "";
        this.modifyOrderDetailsObj.changeOrderAdvisorId = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.resonsOrderAdvisorId = it.Reasons;

        this.modifyOrderDetailsObj.AdvisorModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.selectedAdvisor = [{ Id: (it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : ""), Name: (it.ChangeOrderDetails ? it.ChangeOrderDetails : ""), accountOwner: '' }]
        this.modifyOrderDetailsObj.AdvisorStateCode = 2;
      }
      else if (it.AttributeType == 6) {
        this.modifyOrderDetailsObj.changeOrderVSOName = it.ChangeOrderDetails ? it.ChangeOrderDetails : "";
        this.modifyOrderDetailsObj.changeOrderVSOId = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.resonsOrderVSOId = it.Reasons;

        this.modifyOrderDetailsObj.VSODModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.selectedVSO = [{ Id: (it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : ""), Name: (it.ChangeOrderDetails ? it.ChangeOrderDetails : ""), EmailID: '' }]
        this.modifyOrderDetailsObj.VSOStateCode = 2;
      }
      else if (it.AttributeType == 7) {
        this.modifyOrderDetailsObj.changeOrderSOWPOD = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.reasonSOWPOId = it.Reasons;
        this.modifyOrderDetailsObj.POSOWModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.SOWPODStateCode = 2;
      }
      else if (it.AttributeType == 10) {
        this.modifyOrderDetailsObj.changeOrderPOAHolderName = it.ChangeOrderDetails ? it.ChangeOrderDetails : "";
        this.modifyOrderDetailsObj.changeOrderPOAHolderId = it.ChangeOrderDetailsId ? it.ChangeOrderDetailsId : "";
        this.modifyOrderDetailsObj.resonsOrderPOAHolderId = it.Reasons;
        this.modifyOrderDetailsObj.POAHolderModificationId = it.OverviewModificationID ? it.OverviewModificationID : "";
        this.modifyOrderDetailsObj.POAHolderStateCode = 2;
      }


    });
    
  this.changesAuthorization = this.modifyOrderDetailsObj.changeOrderAuthorizationId;
  console.log("authorization", this.changesAuthorization);

    if(this.modifyOrderDetailsObj.changeOrderAuthorizationId != "False" && this.modifiedPODetails.length == 0){
           this.modifiedSOWDate = this.modifyOrderDetailsObj.changeOrderSOWPOD;
    }

  }

  checkModificationDetails() {
    this.ErrorDisplay = false;
    this.ModificationId = "";
    this.ModificationName = "";
    this.ModificationRequestStatus = "";
    this.modifyOrderDetailsObj = Object.assign({}, this.defaultmodifyOrderDetailsObj);
    this.getOverviewOrder();
    if (this.disableAll) {
      this.ModificationId = this.projectService.getSession("orderModificationId") || '';
      this.getBusinessSolutionPanelData(this.OpportunityId);
      this.getDocuments();
    } else {
      const payload = {
        SalesOrderId: this.OrderId//"6c8ef8a9-3b93-e911-a834-000cd3aa058cb"
      }
      this.service.loaderhome = true;
      this.orderService.getModificationDetails(payload).subscribe((response: any) => {

        this.ModificationId = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].ModificationRequestId) ? response.ResponseObject[0].ModificationRequestId : "";
        this.ModificationName = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].Name) ? response.ResponseObject[0].Name : "";
        this.ModificationRequestStatus = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].ModificationRequestStatus) ? response.ResponseObject[0].ModificationRequestStatus : "";
        this.getBusinessSolutionPanelData(this.OpportunityId);
        this.getDocuments();
      },
        err => {
          this.getBusinessSolutionPanelData(this.OpportunityId);
        })
    }

  }


  savePODetailsArray: any=[];
  getOverviewSaveValidation() {
    let Valid = false;
    this.saveOverviewArray = [];
    let currentSOWPODate :any = this.modifyOrderDetailsObj.currentrOrderSOWPOD ? new Date(this.modifyOrderDetailsObj.currentrOrderSOWPOD) : "";
    let currentInHrs : any = currentSOWPODate ? currentSOWPODate.setHours(0,0,0,0) : "";
    let changedSOWDate : any = this.modifyOrderDetailsObj.changeOrderSOWPOD ? new Date(this.modifyOrderDetailsObj.changeOrderSOWPOD) : "";
    let changedInHrs : any = changedSOWDate ? changedSOWDate.setHours(0,0,0,0) : "";
    this.savePODetailsArray = this.changeInPODetails();
    let tempModifiedPODetails: any = this.savePODetailsArray.filter(it => it.StateCode != 1).map(it=> {return Object.assign({},it)})

    let polist = tempModifiedPODetails && tempModifiedPODetails.length > 0 ? tempModifiedPODetails.map(item => parseFloat(item.POValue)) : [];
    this.sumOfPOValue = polist && polist.length > 0 ? polist.reduce((a, c = 0) => { return a + c }) : 0 ;
    if ((!this.modifyOrderDetailsObj.changeOrderSAPCCName || !this.modifyOrderDetailsObj.changeOrderSAPCCId) && this.modifyOrderDetailsObj.reasonSAPCCId) {
      this.projectService.displayMessageerror("Please provide SAP customer code or remove the reason for Modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderSAPCCName && this.modifyOrderDetailsObj.changeOrderSAPCCId) && !this.modifyOrderDetailsObj.reasonSAPCCId) {
      this.projectService.displayMessageerror("Please provide the reason to change sap customer code for Modify order details");
      return Valid;
    } else if (this.modifyOrderDetailsObj.changeOrderSAPCCId && this.modifyOrderDetailsObj.changeOrderSAPCCId == this.modifyOrderDetailsObj.currentOrderSAPCCId) {
      this.projectService.displayMessageerror("Selected sap customer code can not be same as existing sap customer code for Modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderSAPCCName && this.modifyOrderDetailsObj.changeOrderSAPCCId && this.modifyOrderDetailsObj.reasonSAPCCId && this.fileDataArray.length == 0) {
      this.projectService.displayMessageerror("Please upload supporting approval from IC Team for SAP code modification");
      return Valid;
    }



    else if ((!this.modifyOrderDetailsObj.changeOrderPSD) && this.modifyOrderDetailsObj.reasonPSDId) {
      this.projectService.displayMessageerror("Please provide project start date or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderPSD) && !this.modifyOrderDetailsObj.reasonPSDId) {
      this.projectService.displayMessageerror("Please provide the reason to change project start date for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderPSD && this.modifyOrderDetailsObj.changeOrderPSD == this.modifyOrderDetailsObj.currentOrderPSD) {
      this.projectService.displayMessageerror("Selected project start date can not be same as existing project start date for modify order details");
      return Valid;
    }


    else if ((!this.modifyOrderDetailsObj.changeOrderPED) && this.modifyOrderDetailsObj.reasonPEDId) {
      this.projectService.displayMessageerror("Please provide project end date or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderPED) && !this.modifyOrderDetailsObj.reasonPEDId) {
      this.projectService.displayMessageerror("Please provide the reason to change project end date for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderPED && this.modifyOrderDetailsObj.changeOrderPED == this.modifyOrderDetailsObj.currentOrderPED) {
      this.projectService.displayMessageerror("Selected project end date can not be same as existing project end date for modify order details");
      return Valid;
    }


    else if ((!this.modifyOrderDetailsObj.changeOrderVSOName || !this.modifyOrderDetailsObj.changeOrderVSOId) && this.modifyOrderDetailsObj.resonsOrderVSOId) {
      this.projectService.displayMessageerror("Please provide vertical sales owner or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderVSOName && this.modifyOrderDetailsObj.changeOrderVSOId) && !this.modifyOrderDetailsObj.resonsOrderVSOId) {
      this.projectService.displayMessageerror("Please provide the reason to change vertical sales owner for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderVSOId && this.modifyOrderDetailsObj.changeOrderVSOId == this.modifyOrderDetailsObj.currentOrderVSOId) {
      this.projectService.displayMessageerror("Selected vertical sales owner can not be same as existing vertical sales owner for modify order details");
      return Valid;
    }

    else if ((!this.modifyOrderDetailsObj.changeOrderAdvisorName || !this.modifyOrderDetailsObj.changeOrderAdvisorId) && this.modifyOrderDetailsObj.resonsOrderAdvisorId) {
      this.projectService.displayMessageerror("Please provide advisor or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderAdvisorName && this.modifyOrderDetailsObj.changeOrderAdvisorId) && !this.modifyOrderDetailsObj.resonsOrderAdvisorId) {
      this.projectService.displayMessageerror("Please provide the reason to change advisor for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderAdvisorId && this.modifyOrderDetailsObj.changeOrderAdvisorId == this.modifyOrderDetailsObj.currentOrderAdvisorId) {
      this.projectService.displayMessageerror("Selected advisor can not be same as existing advisor for modify order details");
      return Valid;
    }

    else if ((!this.modifyOrderDetailsObj.changeOrderAuthorizationId) && this.modifyOrderDetailsObj.resonAuthorizationId) {
      this.projectService.displayMessageerror("Please provide authorization type or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderAuthorizationId) && !this.modifyOrderDetailsObj.resonAuthorizationId) {
      this.projectService.displayMessageerror("Please provide the reason to change authorization type for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderAuthorizationId && this.modifyOrderDetailsObj.changeOrderAuthorizationId == this.modifyOrderDetailsObj.currentorderAuthorizationId) {
      this.projectService.displayMessageerror("Selected authorization type can not be same as existing authorization type for modify order details");
      return Valid;
    }
    
    else if ( this.modifyOrderDetailsObj.changeOrderAuthorizationId == "False" && tempModifiedPODetails.length == 0 ) {
      this.projectService.displayMessageerror("Please provide PO details");
      return Valid;
    }

    else if (( this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId == "True" ) && (!this.modifyOrderDetailsObj.changeOrderPOAHolderId) ){
      this.projectService.displayMessageerror("POA Holder is mandatory");
      return Valid;
    }
    else if (( this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId == "True" ) && (!this.modifyOrderDetailsObj.resonsOrderPOAHolderId) ){
      this.projectService.displayMessageerror("Please provide the reason to change POA Holder for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "False" ) && (!this.modifyOrderDetailsObj.changeOrderPOAHolderName || !this.modifyOrderDetailsObj.changeOrderPOAHolderId) && this.modifyOrderDetailsObj.resonsOrderPOAHolderId) {
      this.projectService.displayMessageerror("Please provide POA Holder or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "False" ) && (this.modifyOrderDetailsObj.changeOrderPOAHolderName && this.modifyOrderDetailsObj.changeOrderPOAHolderId) && !this.modifyOrderDetailsObj.resonsOrderPOAHolderId) {
      this.projectService.displayMessageerror("Please provide the reason to change POA Holder for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "False" ) && this.modifyOrderDetailsObj.changeOrderPOAHolderId && this.modifyOrderDetailsObj.changeOrderPOAHolderId == this.modifyOrderDetailsObj.currentOrderPOAHolderId) {
      this.projectService.displayMessageerror("Selected POA Holder can not be same as existing POA Holder for modify order details");
      return Valid;
    }
    

    else if ( this.modifyOrderDetailsObj.changeOrderAuthorizationId == "False" && this.sumOfPOValue != this.ContractTCV ) {
      this.projectService.displayMessageerror("Sum of PO values in PO details should be equal to contract TCV "+this.ContractTCV);
      return Valid;
    }
    else if ((!this.modifyOrderDetailsObj.changeOrderSOWPOD) && this.modifyOrderDetailsObj.reasonSOWPOId) {
      this.projectService.displayMessageerror("Please provide SOW/PO Signed date or remove the reason for modify order details");
      return Valid;
    }
    else if ((this.modifyOrderDetailsObj.changeOrderSOWPOD) && !this.modifyOrderDetailsObj.reasonSOWPOId) {
      this.projectService.displayMessageerror("Please provide the reason to change SOW/PO signed date for modify order details");
      return Valid;
    }
    else if (!this.modifyOrderDetailsObj.changeOrderSOWPOD && this.modifyOrderDetailsObj.changeOrderAuthorizationId) {
      this.projectService.displayMessageerror("Please provide SOW/PO signed date as authorization has been changed");
      return Valid;
    }
    else if (!this.modifyOrderDetailsObj.changeOrderAuthorizationId && this.modifyOrderDetailsObj.changeOrderSOWPOD && currentInHrs == changedInHrs) {
      this.projectService.displayMessageerror("Selected SOW/PO signed date can not be same as existing PO/SOW signed date for modify order details");
      return Valid;
    }
    else if (this.modifyOrderDetailsObj.changeOrderSOWPOD && this.modifyOrderDetailsObj.reasonSOWPOId && this.fileDataArray.length == 0) {
      this.projectService.displayMessageerror("Please upload supporting approval for SOW/PO signed date modification");
      return Valid;
    }
    else {
      let saveOverviewObject: any = {};
      if (this.modifyOrderDetailsObj.changeOrderSAPCCName && this.modifyOrderDetailsObj.changeOrderSAPCCId && this.modifyOrderDetailsObj.reasonSAPCCId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.SAPModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderSAPCCId,
          Reasons: this.modifyOrderDetailsObj.reasonSAPCCId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderSAPCCId,
          AttributeType: 1,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.SAPCodeStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderSAPCCName && !this.modifyOrderDetailsObj.changeOrderSAPCCId && !this.modifyOrderDetailsObj.reasonSAPCCId && this.modifyOrderDetailsObj.SAPModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.SAPModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderSAPCCId,
          Reasons: this.modifyOrderDetailsObj.reasonSAPCCId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderSAPCCId,
          AttributeType: 1,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderPSD && this.modifyOrderDetailsObj.reasonPSDId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.PSDModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPSD,
          Reasons: this.modifyOrderDetailsObj.reasonPSDId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPSD,
          AttributeType: 2,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.PSDStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderPSD && !this.modifyOrderDetailsObj.reasonPSDId && this.modifyOrderDetailsObj.PSDModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.PSDModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPSD,
          Reasons: this.modifyOrderDetailsObj.reasonPSDId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPSD,
          AttributeType: 2,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderPED && this.modifyOrderDetailsObj.reasonPEDId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.PEDModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPED ? this.getIsoDateFormat(this.modifyOrderDetailsObj.changeOrderPED) : "",
          Reasons: this.modifyOrderDetailsObj.reasonPEDId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPED,
          AttributeType: 3,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.PEDStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderPED && !this.modifyOrderDetailsObj.reasonPEDId && this.modifyOrderDetailsObj.PEDModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.PEDModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPED ? this.getIsoDateFormat(this.modifyOrderDetailsObj.changeOrderPED) : "",
          Reasons: this.modifyOrderDetailsObj.reasonPEDId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPED,
          AttributeType: 3,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderAuthorizationId && this.modifyOrderDetailsObj.resonAuthorizationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.AuthModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderAuthorizationId,
          Reasons: this.modifyOrderDetailsObj.resonAuthorizationId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentorderAuthorizationId,
          AttributeType: 4,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.AuthorizationStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderAuthorizationId && !this.modifyOrderDetailsObj.resonAuthorizationId && this.modifyOrderDetailsObj.AuthModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.AuthModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderAuthorizationId,
          Reasons: this.modifyOrderDetailsObj.resonAuthorizationId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentorderAuthorizationId,
          AttributeType: 4,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderAdvisorName && this.modifyOrderDetailsObj.changeOrderAdvisorId && this.modifyOrderDetailsObj.resonsOrderAdvisorId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.AdvisorModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderAdvisorId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderAdvisorId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderAdvisorId,
          AttributeType: 5,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.AdvisorStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderAdvisorName && !this.modifyOrderDetailsObj.changeOrderAdvisorId && !this.modifyOrderDetailsObj.resonsOrderAdvisorId && this.modifyOrderDetailsObj.AdvisorModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.AdvisorModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderAdvisorId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderAdvisorId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderAdvisorId,
          AttributeType: 5,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderVSOName && this.modifyOrderDetailsObj.changeOrderVSOId && this.modifyOrderDetailsObj.resonsOrderVSOId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.VSODModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderVSOId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderVSOId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderVSOId,
          AttributeType: 6,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.VSOStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderVSOName && !this.modifyOrderDetailsObj.changeOrderVSOId && !this.modifyOrderDetailsObj.resonsOrderVSOId && this.modifyOrderDetailsObj.VSODModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.VSODModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderVSOId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderVSOId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderVSOId,
          AttributeType: 6,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if (this.modifyOrderDetailsObj.changeOrderSOWPOD && this.modifyOrderDetailsObj.reasonSOWPOId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.POSOWModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderSOWPOD ? this.getIsoDateFormat(this.modifyOrderDetailsObj.changeOrderSOWPOD) : "",
          Reasons: this.modifyOrderDetailsObj.reasonSOWPOId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentrOrderSOWPOD,
          AttributeType: 7,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.SOWPODStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if (!this.modifyOrderDetailsObj.changeOrderSOWPOD && !this.modifyOrderDetailsObj.reasonSOWPOId && this.modifyOrderDetailsObj.POSOWModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.POSOWModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderSOWPOD ? this.getIsoDateFormat(this.modifyOrderDetailsObj.changeOrderSOWPOD) : "",
          Reasons: this.modifyOrderDetailsObj.reasonSOWPOId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentrOrderSOWPOD,
          AttributeType: 7,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      if ( ((this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" && this.modifyOrderDetailsObj.changeOrderAuthorizationId != "False" ) ||( this.modifyOrderDetailsObj.currentorderAuthorizationId == "False" && this.modifyOrderDetailsObj.changeOrderAuthorizationId == "True" ) ) && this.modifyOrderDetailsObj.changeOrderPOAHolderId && this.modifyOrderDetailsObj.resonsOrderPOAHolderId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.POAHolderModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPOAHolderId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderPOAHolderId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPOAHolderId,
          AttributeType: 10,
          RejectionReason: "",
          Action: null,
          StateCode: this.modifyOrderDetailsObj.POAHolderStateCode
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      else if ( this.modifyOrderDetailsObj.POAHolderModificationId) {
        saveOverviewObject = Object.assign({
          OverviewModificationID: this.modifyOrderDetailsObj.POAHolderModificationId,
          OrderDetails: "",
          ChangeOrderDetails: this.modifyOrderDetailsObj.changeOrderPOAHolderId,
          Reasons: this.modifyOrderDetailsObj.resonsOrderPOAHolderId,
          CurrentOrderDetails: this.modifyOrderDetailsObj.currentOrderPOAHolderId,
          AttributeType: 10,
          RejectionReason: "",
          Action: null,
          StateCode: 1
        })
        this.saveOverviewArray.push(saveOverviewObject);
      }
      return true;
    }

      
  }



  /*********************** saurav code end************************ */


  goBack() {
    this.router.navigate(['/opportunity/opportunityview/order'])
    // window.history.back();
  }
  order_table = [
    { orderdetails: '1SAP customer code', currentorderdeatils: 'SAP9393949', changeorderdetails: 'autocomplete', dropdown: 'yes' },
    { orderdetails: 'Project start date', currentorderdeatils: '12-Jun-19', changeorderdetails: 'calander', dropdown: 'yes' },
    { orderdetails: 'Project end date', currentorderdeatils: '12-Jul-20', changeorderdetails: 'calander', dropdown: 'yes' },
    { orderdetails: 'Vertical sales owner', currentorderdeatils: 'Anubhav Jain', changeorderdetails: 'autocomplete', dropdown: 'yes' },
    { orderdetails: 'Advisor', currentorderdeatils: 'Kinshuk Bose', changeorderdetails: 'autocomplete', dropdown: 'yes' },
    { orderdetails: 'Authorization type', currentorderdeatils: 'SOW', changeorderdetails: 'select', dropdown: 'yes' },
    { orderdetails: 'SPW/PO Signed date', currentorderdeatils: '12-Jul-20', changeorderdetails: 'select', dropdown: 'yes' }
  ]


  //****************************************************************Start of Sumit Code********************************************//



  // Generic code for Modification

  checkIfOrderCreated() {
    if (this.OpportunityId) {
      this.getOrderBasedOnOpportunity();
    } else {
      this.getOrderbasedonOrderId();
    }
  }

  getOrderBasedOnOpportunity() {
    const payload = {
      Id: this.OpportunityId
    };
    this.service.loaderhome = true;
    this.orderService.checkOrderBookingId(payload).subscribe((bookingId: any) => {
      if (bookingId.ResponseObject && bookingId.ResponseObject.length > 0) {
        console.log("signed", bookingId);
        // this.orderOverviewObj.OrderBookingId = bookingId.ResponseObject[0].SalesOrderId;
        this.OrderId = bookingId.ResponseObject[0].SalesOrderId;
        this.getOrderbasedonOrderId();

      } else {
        this.OrderId = "";
        this.checkWT(this.OpportunityId, false);
      }
    }, err => {
      this.checkWT(this.OpportunityId, false);
      this.projectService.displayerror(err.status);
    })
  }


  getOrderbasedonOrderId() {
    let bookingIdPayload = {
      Guid: this.OrderId
    }
    this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      console.log("order created1", orderDetails);
      this.approvalStageID = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
      this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
      this.CurrencyName = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Name) ? (this.getSymbol(orderDetails.ResponseObject.Currency.Name)) : '';
      this.CurrencyId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.SysGuid) ? orderDetails.ResponseObject.Currency.SysGuid : '';
      this.CurrencySymbol = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Type) ? (this.getSymbol(orderDetails.ResponseObject.Currency.Type)) : 'NA';
     
      this.ContractCurrencyName = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Wipro_ContractCurrency && orderDetails.ResponseObject.Wipro_ContractCurrency.Name) ? (this.getSymbol(orderDetails.ResponseObject.Wipro_ContractCurrency.Name)) : '';
      this.ContractCurrencyId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Wipro_ContractCurrency && orderDetails.ResponseObject.Wipro_ContractCurrency.SysGuid) ? orderDetails.ResponseObject.Wipro_ContractCurrency.SysGuid : '';
      this.ContractTCV = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.SOWTCV) ? parseFloat(orderDetails.ResponseObject.SOWTCV) : 0;
      
      this.VSOEmailId = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.VerticalSalesOwner ? orderDetails.ResponseObject.VerticalSalesOwner.EmailID ? orderDetails.ResponseObject.VerticalSalesOwner.EmailID : '' : '';
      this.PricingUpdateOn = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingUpdateOn ? orderDetails.ResponseObject.PricingUpdateOn : "";
      this.DPSDealCreatedOn = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.DPSDealCreatedOn) ? orderDetails.ResponseObject.DPSDealCreatedOn : null;
      this.salesOrderTypeId = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId ? orderDetails.ResponseObject.OrderTypeId : "";
      this.acceptNegative = (this.salesOrderTypeId == 184450002 || this.salesOrderTypeId == 184450004 || this.salesOrderTypeId == 184450006) ? true : false;
      this.ICMParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';
      this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
      this.OrderTCV = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTCV) ? (parseFloat(orderDetails.ResponseObject.OrderTCV)).toFixed(2) : '0.00';
      this.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
      this.PricingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingId) ? orderDetails.ResponseObject.PricingId : "";
      this.orderBookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
      this.isICMAccount = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsICMAccount) ? orderDetails.ResponseObject.IsICMAccount : false;
      this.IsIndiaSBU = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsIndiaSBU) ? orderDetails.ResponseObject.IsIndiaSBU : false;
      this.checkWT(this.OrderId, true);
    }, err => {
      this.acceptNegative = false;
      this.checkWT(this.OrderId, true);
    });
  }

  // getSalesOrderDetails(orderId) {

  //   this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
  //     console.log("order created", orderDetails);
  //   });
  // }

  // checking WT/Non-WT
  checkWT(salesOrderId, isOrderCreated) {
    this.getOppData();
    const payload = {
      OrderOrOpportunityId: salesOrderId,
      IsOrderCheckNonBPO: isOrderCreated
    }
    this.orderService.getWTstatus(payload).subscribe((res: any) => {
      this.originalWTFlag = (res.ResponseObject && res.ResponseObject.length > 0) ? res.ResponseObject[0].IsWT : false;
      let tempDPSDealCreatedOn = this.DPSDealCreatedOn ? new Date(this.DPSDealCreatedOn) : "";
      this.WTFlag = (this.originalWTFlag == true && this.PricingId && (!tempDPSDealCreatedOn || (tempDPSDealCreatedOn >= this.DealCreationCutoffDate))) ? true : false;
      this.getSLPracSubpracData();
      console.log("WTFlag", this.WTFlag);
    }, err => {
      this.WTFlag = false;
      this.getSLPracSubpracData();
    });
  }


  ngOnDestroy(): void {
    this.projectService.clearSession("orderModificationId");
    this.projectService.clearSession("disableall");
    if (this.orderService.amendmentInProcess == false) {
      this.projectService.clearSession("smartsearchData");
    }
  }

  getSolutionTypeData() {
    this.projectService.getSolutionType().subscribe(res => {
      this.solutionTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.solutionTypeDD = [];
    });
  }

  getCreditTypeData() {
    this.projectService.getCreditType().subscribe(res => {
      this.creditTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.creditTypeDD = [];
    });
  }

    // Get Pricing type dropdown
    pricingType() {
      this.orderService.getPricingType()
        .subscribe((res: any) => {
          this.pricingTypes = (res && res.ResponseObject) ? res.ResponseObject.map(it => {
            return Object.assign({
              ...it,
              Id: it.Id ? it.Id.toString() : ""
            })
          }) : [];
        }, err => {
          this.pricingTypes = [];
          console.log(err)
        });
    }


  getDualCreditData() {
    this.projectService.getDualCredit().subscribe(res => {
      this.BSDualCreditDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.BSDualCreditDD = [];
    });
  }

  getInfluenceTypeData() {
    this.projectService.getInfluenceType().subscribe(res => {
      this.InfluenceTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.InfluenceTypeDD = [];
    });
  }

  getServiceTypeData() {
    this.projectService.getServiceType().subscribe(res => {
      this.serviceTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.serviceTypeDD = [];
    });
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  getSLPracSubpracData() {
    this.service.loaderhome = true;
    this.orderService.getSLPracSubprac().subscribe(res => {
      // this.allServiceLineDD = (res && res.ResponseObject) ? res.ResponseObject.ServiceLine : [];
      this.allPracticeDD = (res && res.ResponseObject) ? res.ResponseObject.Practices.map(it => {
        it.Name = this.getSymbol(it.Name);
        return it;
      }) : [];
      this.allSubPracticeDD = (res && res.ResponseObject) ? res.ResponseObject.SubPractices.map(it => {
        it.Name = this.getSymbol(it.Name);
        return it;
      }) : [];
      this.checkModificationDetails();
    }, err => {
      this.checkModificationDetails();
    })
  }

  getBusinessSolutionPanelData(OppId) {
    this.serviceLineLoader = true;
    this.IpLoader = true;
    this.solutionLoader = true;
    this.creditAllocationLoader = true;
    this.service.loaderhome = true;

    let UserID = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

    this.disableOnRoleOverwiew = true;
    this.disableOnRoleBSPanel = true;
    this.disableOnRoleBSSL = true;
    this.disableOnRoleBSIp = true;
    this.disableOnRoleBSSolution = true;
    this.disableOnRoleBSCA = true;
    this.showDualCreditButton = false;
    this.showWTCRS = false;
    this.showWTCIS = false;

    console.log("Overview", this.disableOnRoleOverwiew);
    if (this.disableAll) {
      this.createBusinessSolutionData();
    }
    else if (this.OrderId) {
      this.orderService.RoleBasedAccesssOrder(this.OrderId, UserID).subscribe(res => {
        if (res && res.ResponseObject && res.ResponseObject.OrderOwnerRole == true) {
          if (this.ModificationStatus != OrderModificationRequestStatus.ModificationRequestPendingwithBFM) {
            this.disableOnRoleOverwiew = false;
            this.disableOnRoleBSPanel = false;
            this.disableOnRoleBSSL = false;
            this.disableOnRoleBSIp = false;
            this.disableOnRoleBSSolution = false;
            this.disableOnRoleBSCA = false;
          }
        }
        this.createBusinessSolutionData();
      }, err => {
        this.createBusinessSolutionData();
      })
    } else {
      if (this.fullAccessSessionCheck == true) {
        this.disableOnRoleOverwiew = false;
        this.disableOnRoleBSPanel = false;
        this.disableOnRoleBSSL = false;
        this.disableOnRoleBSIp = false;
        this.disableOnRoleBSSolution = false;
        this.disableOnRoleBSCA = false;

      }
      this.createBusinessSolutionData();
    }

  }



  createBusinessSolutionData() {
    this.OverALLSavedTCV = "";
    let OBJ = {
      Sltcv: "",
      OverallTcv: "",
      IpTcv: "",
      TCVCalculation: false,
      opportunityid: this.OpportunityId,
    }
    this.businessSOlutionData[0] = Object.assign({}, OBJ);
    this.getBusinessSolutionsTableData(this.OpportunityId);
  }

  navigatetobusinesssolutionsearch() {
    this.openDialogDelete("You will be navigated to modify order search page and all your unsaved data will be lost, please ensure that you have saved your changes before clicking on confirm", "Confirm", "Alert").subscribe(res => {
      if (res == 'save') {
        this.orderService.amendmentInProcess = true;
        this.projectService.setSession("SMData", { WTFlag: this.WTFlag, type: 'MOD' });
        this.router.navigate(['/opportunity/businesssolutionsearch']);
      }
    });

  }

  toFixedNoRounding(num: any, digits: number) {
    if (num) {
      var parts = String(num).split('.');
      if (digits <= 0) {
        return parts[0];
      } else {
        var fractional = (parts[1] || "0") + "000000000000000000000";
        return parts[0] + "." + fractional.substring(0, digits);
      }
    } else {
      return "";
    }
  }

  OnBSPanelSLTCVChange(oldValue, event) {
    let firstval: any = oldValue.substr(0, event.target.selectionStart)
    let secondval: any = oldValue.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  OnBSPanelSLTCVBlur(sltcvValue) {
    let tempSLTCVValue: any = this.acceptNegative ? sltcvValue.match(this.negativeregex) : sltcvValue.match(this.positiveregex);
    let sumofSLTCV: any = tempSLTCVValue && tempSLTCVValue.length > 0 && tempSLTCVValue[0] && !this.isNaNCheck(tempSLTCVValue[0]) ? parseFloat(tempSLTCVValue[0]).toFixed(2).toString() : "";
    let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
    if (sumofSLTCV > this.maxDecimalValue) {
      this.businessSOlutionData[0].Sltcv = "";
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
      this.projectService.displayMessageerror("SL TCV in business solution panel should be less than " + this.maxDecimalValueDisplay);
    }
    else if (sumofSLTCV < this.minDecimalValue) {
      this.businessSOlutionData[0].Sltcv = "";
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
      this.projectService.displayMessageerror("SL TCV in business solution panel should be greater than " + this.minDecimalValueDisplay);
    }
    else if (totalTCV > this.maxDecimalValue) {
      this.businessSOlutionData[0].Sltcv = "";
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " on change of SL TCV");
    }
    else if (totalTCV < this.minDecimalValue) {
      this.businessSOlutionData[0].Sltcv = "";
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " on change of SL TCV");
    } else {
      this.businessSOlutionData[0].Sltcv = sumofSLTCV;
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
      let totalsumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
        if (!(elem.BSServiceLine.WiproDualCredit)) {
          let tempTCVPerc: any = elem.BSServiceLine.WiproPercentageOftcv ? elem.BSServiceLine.WiproPercentageOftcv : 0;
          let SLTCV: any = (sumofSLTCV) ? ((parseFloat(sumofSLTCV) * parseFloat(tempTCVPerc)) / 100) : 0;
          return prevVal + parseFloat(SLTCV);
        } else {
          return prevVal;
        }
      }, 0);

      if (parseFloat(totalsumofSLTCV) > this.maxDecimalValue) {
        for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
          if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
            this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv = "";
            this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv = "";
          }
        }
        this.projectService.displayMessageerror("Total sum of Est. SL TCV in service line table should be less than " + this.maxDecimalValueDisplay + " for the given % of TCV");
      }
      else if (parseFloat(totalsumofSLTCV) < this.minDecimalValue) {
        for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
          if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
            this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv = "";
            this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv = "";
          }
        }
        this.projectService.displayMessageerror("Total sum of Est. SL TCV in service line table should be greater than " + this.minDecimalValueDisplay + " for the given % of TCV");
      }

    }

    for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
      if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
        let tempTCVPerc: any = this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv ? this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv : "";
        let tempSLTCV: any = (this.businessSOlutionData[0].Sltcv && tempTCVPerc) ? ((parseFloat(this.businessSOlutionData[0].Sltcv) * parseFloat(tempTCVPerc)) / 100) : ""
        this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv = tempSLTCV ? this.toFixedNoRounding(tempSLTCV, 2) : "";
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != '0.00' && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = (tempSolValue && parseFloat(tempSolValue) >= this.minDecimalValue && parseFloat(tempSolValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) ? parseFloat(tempSolValue).toFixed(2).toString() : "";
        if (!this.SolutionDetails[sol].solutions.WiproValue) {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = ""
        }
      } else {
        if (parseFloat(this.SolutionDetails[sol].solutions.WiproValue) >= this.minDecimalValue && parseFloat(this.SolutionDetails[sol].solutions.WiproValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) {
          let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00" && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
        } else {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = "";
          this.SolutionDetails[sol].solutions.WiproValue = "";
        }
      }

    }
    this.calculateCAValue();

  }

  openDialogDelete(msg: string, buttonText: string, headerText: string): Observable<string> {
    let dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: { message: msg, buttonText: buttonText, Header: headerText }
    });

    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }

  openDialogIpDelete(msg: string, buttonText: string, headerText: string): Observable<any> {
    let dialogRef = this.dialog.open(deleteIP1, {
      width: "350px",
      data: { message: msg, buttonText: buttonText, Header: headerText }
    });

    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }

  getIpandserviceLineData() {
    let obj = {
      "Guid": this.sbuId,
    }
    this.projectService.getIpServiceLineUpdated(obj).subscribe(res => {
      this.IpandServiceLinelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
    }, err => {
      this.IpandServiceLinelDD = [];
    });

    // this.projectService.getIpServiceLine().subscribe(res => {
    //   this.IpandServiceLinelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
    // }, err => {
    //   this.IpandServiceLinelDD = [];
    // });
  }

  getBusinessSolutionsTableData(OppId) {

    this.ModificationOBAllocation = false;
    this.ModificationOverwiew = false;
    if (this.ModificationId) {
      this.getDatabasedOnMopdificationId(this.ModificationId);
    } else {
      this.getDatabasedONOrder(this.OrderId);

    }
    this.getSavedOrderDetails(this.OrderId);

  }

  getSavedOrderDetails(orderId) {
    this.OrderSLDetails = [];
    this.OrderIPDetails = [];
    this.OrderSolutionDetails = [];
    this.OrdercreditAllocationDetails = [];
    this.SavedSltcv = "0.00";
    this.SavedIpTcv = "0.00";
    this.SavedOverallOrderTcv = "0.00";
    this.orderService.getOrderOBAllocationDetails(orderId, this.WTFlag).subscribe(res => {
      this.SavedSltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
      this.SavedIpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
      this.SavedOverallOrderTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
      let savedSLOBJ: any = (!res || !res.ResponseObject || !res.ResponseObject.ServiceLineDetails || !res.ResponseObject.ServiceLineDetails.orderServicelineDetails) ? [] : res.ResponseObject.ServiceLineDetails.orderServicelineDetails;
      let savedIPObj: any = (!res || !res.ResponseObject || !res.ResponseObject.OrderIPDetails || !res.ResponseObject.OrderIPDetails.orderIPDetail) ? [] : res.ResponseObject.OrderIPDetails.orderIPDetail;
      let savedSolObj: any = (!res || !res.ResponseObject || !res.ResponseObject.Solutions || !res.ResponseObject.Solutions.order_Solution) ? [] : res.ResponseObject.Solutions.order_Solution;
      let savedCAObj: any = (!res || !res.ResponseObject || !res.ResponseObject.CreaditAllocations || !res.ResponseObject.CreaditAllocations.AllocationsDatas) ? [] : res.ResponseObject.CreaditAllocations.AllocationsDatas;


      for (var sl = 0; sl < savedSLOBJ.length; sl++) {
        let BSSLDataObj: any = Object.assign({}, savedSLOBJ[sl]);
        // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
        BSSLDataObj.AdditionalServiceLinesCloudDetails = BSSLDataObj.AdditionalServiceLinesCloudDetails ? BSSLDataObj.AdditionalServiceLinesCloudDetails.map(it => {
          return Object.assign({
            CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
            Functionid: it.Functionid ? parseInt(it.Functionid) : "",
            ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
            TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
            OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
            Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
            Remarks: it.Remarks ? it.Remarks : "",
          })
        }) : BSSLDataObj.AdditionalServiceLinesCloudDetails;
        this.OrderSLDetails.push(Object.assign({
          WiproServicelineidValue: BSSLDataObj.WiproServicelineidValue,
          WiproPracticeId: BSSLDataObj.WiproPracticeId,
          WiproSubpracticeid: BSSLDataObj.WiproSubpracticeid,
          WiproSlbdmid: BSSLDataObj.WiproSlbdmid,
          WiproPercentageOftcv: BSSLDataObj.WiproPercentageOftcv,
          WiproEstsltcv: BSSLDataObj.WiproEstsltcv,
          Cloud: BSSLDataObj.Cloud,
          WiproEngagementModel: BSSLDataObj.WiproEngagementModel,
          WiproDualCredit: BSSLDataObj.WiproDualCredit,
          AdditionalServiceLinesCloudDetails: BSSLDataObj.AdditionalServiceLinesCloudDetails
        }));

      }

      for (var ip = 0; ip < savedIPObj.length; ip++) {

        let BSIpDataObj = Object.assign({}, savedIPObj[ip]);
        BSIpDataObj.CloudDetails = BSIpDataObj.CloudDetails ? BSIpDataObj.CloudDetails.map(it => {
          return Object.assign({
            Functionid: it.Functionid ? parseInt(it.Functionid) : "",
            CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
            ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
            TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
            OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
            Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
            Remarks: it.Remarks ? it.Remarks : "",
          });
        }) : BSIpDataObj.CloudDetails;

        BSIpDataObj.AdditionalSLDetails = BSIpDataObj.AdditionalSLDetails ? BSIpDataObj.AdditionalSLDetails.map(it => {
          return Object.assign({
            wipro_implementationcomment: it.wipro_implementationcomment ? it.wipro_implementationcomment : "",
            wipro_implementationvalues: it.wipro_implementationvalues ? it.wipro_implementationvalues : "",
            wipro_customizationcomments: it.wipro_customizationcomments ? it.wipro_customizationcomments : "",
            wipro_customizationvalue: it.wipro_customizationvalue ? it.wipro_customizationvalue : "",
            wipro_professionalservicescomment: it.wipro_professionalservicescomment ? it.wipro_professionalservicescomment : "",
            wipro_professionalservicesvalues: it.wipro_professionalservicesvalues ? it.wipro_professionalservicesvalues : "",

          });
        }) : BSIpDataObj.AdditionalSLDetails;

        this.OrderIPDetails.push(Object.assign({
          IpId: BSIpDataObj.IpId,
          WiproModuleValue: BSIpDataObj.WiproModuleValue,
          WiproServiceline: BSIpDataObj.WiproServiceline,
          WiproPractice: BSIpDataObj.WiproPractice,
          WiproSlbdmValue: BSIpDataObj.WiproSlbdmValue,
          WiproCloud: BSIpDataObj.WiproCloud,
          WiproAmcvalue: BSIpDataObj.WiproAmcvalue,
          WiproLicenseValue: BSIpDataObj.WiproLicenseValue,
          WiproHolmesbdmID: BSIpDataObj.WiproHolmesbdmID,
          CloudDetails: BSIpDataObj.CloudDetails,
          AdditionalSLDetails: BSIpDataObj.AdditionalSLDetails,
        }));

      }

      for (var sol = 0; sol < savedSolObj.length; sol++) {
        let BSsolutionDataObj = Object.assign({}, savedSolObj[sol]);
        this.OrderSolutionDetails.push(Object.assign({
          WiproType: BSsolutionDataObj.WiproType,
          WiproAccountNameValue: BSsolutionDataObj.WiproAccountNameValue,
          OwnerIdValue: BSsolutionDataObj.OwnerIdValue,
          WiproPercentage: BSsolutionDataObj.WiproPercentage,
          WiproPercentageOfTCV: BSsolutionDataObj.WiproPercentageOfTCV,
          WiproValue: BSsolutionDataObj.WiproValue,
          WiproSolutionBDMValue: BSsolutionDataObj.WiproSolutionBDMValue,
          WiproInfluenceType: BSsolutionDataObj.WiproInfluenceType,
          WiproServiceType: BSsolutionDataObj.WiproServiceType,
          IsDealRegistered : BSsolutionDataObj.IsDealRegistered,
          DealRegistrationYes : BSsolutionDataObj.DealRegistrationYes,
          DealRegistrationNo : BSsolutionDataObj.DealRegistrationNo,
        }));
      }

      for (var ca = 0; ca < savedCAObj.length; ca++) {
        let BScreditAllocationDataObj = Object.assign({}, savedCAObj[ca]);
        this.OrdercreditAllocationDetails.push(Object.assign({
          WiproTypeId: BScreditAllocationDataObj.WiproTypeId,
          ServicelineId: BScreditAllocationDataObj.ServicelineId,
          PracticeId: BScreditAllocationDataObj.PracticeId,
          SubPracticeId: BScreditAllocationDataObj.SubPracticeId,
          ServicelineBDMId: BScreditAllocationDataObj.ServicelineBDMId,
          WiproValue: BScreditAllocationDataObj.WiproValue,
          Contribution: BScreditAllocationDataObj.Contribution,
          WiproIsDefault: BScreditAllocationDataObj.WiproIsDefault,
        }));
      }
    }, err => {
      this.OrderSLDetails = [];
      this.OrderIPDetails = [];
      this.OrderSolutionDetails = [];
      this.OrdercreditAllocationDetails = [];
    });
  }

  getDatabasedONOrder(orderId) {

    this.orderService.getOrderOBAllocationDetails(orderId, this.WTFlag).subscribe(res => {
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false;
      this.showWTCIS = (res && res.ResponseObject && res.ResponseObject.showWTCIS) ? res.ResponseObject.showWTCIS : false;
      this.showWTCRS = (res && res.ResponseObject && res.ResponseObject.showWTCRS) ? res.ResponseObject.showWTCRS : false;
      this.businessSOlutionData[0].Sltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
      this.businessSOlutionData[0].IpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
      this.businessSOlutionData[0].OverallTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
      this.OverALLSavedTCV = this.businessSOlutionData[0].OverallTcv;

      let apiSLDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.ServiceLineDetails || !res.ResponseObject.ServiceLineDetails.orderServicelineDetails) ? [] : res.ResponseObject.ServiceLineDetails.orderServicelineDetails;
      let apiIPDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.OrderIPDetails || !res.ResponseObject.OrderIPDetails.orderIPDetail) ? [] : res.ResponseObject.OrderIPDetails.orderIPDetail;
      let apiSolutionDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.Solutions || !res.ResponseObject.Solutions.order_Solution) ? [] : res.ResponseObject.Solutions.order_Solution;
      let apicreditAllocationDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.CreaditAllocations || !res.ResponseObject.CreaditAllocations.AllocationsDatas) ? [] : res.ResponseObject.CreaditAllocations.AllocationsDatas;


      this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);
    }, err => {
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }


  getDatabasedOnMopdificationId(ModificationId) {
    this.orderService.getOrderOBAllocationModificationDetails(this.OrderId, ModificationId, this.WTFlag).subscribe(res => {
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false;
      this.showWTCIS = (res && res.ResponseObject && res.ResponseObject.showWTCIS) ? res.ResponseObject.showWTCIS : false;
      this.showWTCRS = (res && res.ResponseObject && res.ResponseObject.showWTCRS) ? res.ResponseObject.showWTCRS : false;
      this.ModifyRequestNumber = (res && res.ResponseObject && res.ResponseObject.OrderModificationRequestNumber) ? res.ResponseObject.OrderModificationRequestNumber : '';
      let tempmodificationOverview = (!res || !res.ResponseObject || !res.ResponseObject.lstOverviewModifyOrderDetails) ? [] : (res.ResponseObject.lstOverviewModifyOrderDetails);
      let modifyPOData: any = (!res || !res.ResponseObject || !res.ResponseObject.POModificationDetails) ? [] : (res.ResponseObject.POModificationDetails);
      this.getOverviewModification(tempmodificationOverview,modifyPOData);
      if ((res && res.ResponseObject && res.ResponseObject.ServiceLineModificationDetails && res.ResponseObject.ServiceLineModificationDetails.length > 0) || this.disableAll) {
        this.ModificationOBAllocation = (res && res.ResponseObject && res.ResponseObject.ServiceLineModificationDetails && res.ResponseObject.ServiceLineModificationDetails.length > 0) ? true : false;
        this.businessSOlutionData[0].Sltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
        this.businessSOlutionData[0].IpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
        this.businessSOlutionData[0].OverallTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
        this.OverALLSavedTCV = this.businessSOlutionData[0].OverallTcv;

        let apiSLDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.ServiceLineModificationDetails) ? [] : res.ResponseObject.ServiceLineModificationDetails;
        let apiIPDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.IPModificationDetails) ? [] : res.ResponseObject.IPModificationDetails;
        let apiSolutionDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.SolutionModificationDetails) ? [] : res.ResponseObject.SolutionModificationDetails;
        let apicreditAllocationDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.CreditAllocationModificationDetails) ? [] : res.ResponseObject.CreditAllocationModificationDetails;


        this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);

      } else {
        this.getDatabasedONOrder(this.OrderId);
      }
    }, err => {
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }


  checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails) {

    let smartsearchObj = this.projectService.getSession("smartsearchData");
    if (smartsearchObj && smartsearchObj.type != 'MOD') {
      smartsearchObj = null;
      this.projectService.clearSession("smartsearchData");
    }

    let nonDuplicateSmartsearchSL = (smartsearchObj && smartsearchObj.ServiceLineList) ? smartsearchObj.ServiceLineList.filter(it => {

      if (apiSLDetails.some(Slapi => Slapi.ServicelineId == it.WiproServicelineidValue && Slapi.PracticeId == it.WiproPracticeId && Slapi.SubPracticeId == it.WiproSubpracticeid) == true) {
        return false;
      } else {
        return true;
      }
    }) : [];
    let smartsearchCreditAllocation: any = [];
    let smartsearchSL = (nonDuplicateSmartsearchSL && nonDuplicateSmartsearchSL.length > 0) ? (nonDuplicateSmartsearchSL.map((it) => {
      let uniqueSLCAID = Math.random().toString(36).substring(2);
      smartsearchCreditAllocation.push(Object.assign({
        wiproOrderid: '',
        WiproOpportunityId: '',
        statecode: 0,
        WiproOpportunityCreditAllocationID: "",
        WiproOrderCreditAllocationID: "",
        SLCAID: uniqueSLCAID,
        WiproIsDefault: true,
        WiproTypeId: 184450000,
        WiproTypeName: 'Service Line',
        ServicelineId: it.WiproServicelineidValue,
        ServicelineName: it.WiproServicelineidValueName,
        PracticeId: it.WiproPracticeId,
        PracticeName: it.WiproPracticeName,
        SubPracticeId: it.WiproSubpracticeid,
        SubPracticeName: it.WiproSubpracticeName,
        ServicelineBDMId: it.WiproSlbdmid,
        ServicelineBDMName: it.WiproSlbdmidValueName,
        WiproValue: it.WiproEstsltcv,
        Contribution: '100.00'
      }));
      return Object.assign({
        Cloud: it.Cloud,
        SLCAID: uniqueSLCAID,
        WiproDualCredit: it.WiproDualCredit,
        WiproEngagementModel: it.WiproEngagementModel,
        WiproOpportunityServicelineDetailId: it.WiproOpportunityServicelineDetailId,
        WiproOpportunityServicelineOrderDetailId: '',
        WiproPercentageOftcv: it.WiproPercentageOftcv,
        WiproPracticeId: it.WiproPracticeId,
        WiproSubpracticeid: it.WiproSubpracticeid,
        WiproSlbdmid: it.WiproSlbdmid,
        WiproSlbdmidValueName: it.WiproSlbdmidValueName,
        WiproServicelineidValue: it.WiproServicelineidValue,
        WiproServicelineidValueName: it.WiproServicelineidValueName,
        WiproEstsltcv: it.WiproEstsltcv,
        AdditionalServiceLinesCloudDetails: [],
        OpportunityId: '',
        statecode: 0,
        wiproOrderid: '',
        WiproPracticeName: it.WiproPracticeName,
        WiproSubpracticeName: it.WiproSubpracticeName,
        WiproEngagementModelName: it.WiproEngagementModelName,
        WiproDualCreditName: it.WiproDualCreditName,
      })
    })) : []

    let smartsearchIP = (smartsearchObj && smartsearchObj.IP) ? (smartsearchObj.IP.map((it) => {
      return Object.assign({
        OpportunityId: '',
        wiproOrderid: '',
        statecode: 0,
        WiproAmcvalue: it.WiproAmcvalue,
        WiproCloud: it.WiproCloud,
        WiproHolmesbdmID: it.WiproHolmesbdmID,
        WiproHolmesbdmName: it.WiproHolmesbdmName,
        WiproSlbdmName: it.WiproSlbdmName,
        WiproSlbdmValue: it.WiproSlbdmValue,
        IpId: it.IpId,
        WiproLicenseValue: it.WiproLicenseValue,
        WiproModuleValue: it.WiproModuleValue,
        WiproModuleName: it.WiproModuleName,
        IpName: it.IpName,
        WiproOpportunityIpId: it.WiproOpportunityIpId,
        OrderIpId: '',
        WiproPractice: it.WiproPractice,
        WiproServiceline: it.WiproServiceline,
        WiproServicelineName: it.WiproServicelineName,
        WiproPracticeName: it.WiproPracticeName,
        AdditionalSLDetails: [],
        CloudDetails: [],
        disableHolmesBDM: it.disableHolmesBDM,
        disableModule: it.disableModule
      })
    })) : []

    let smartsearchSol = (smartsearchObj && smartsearchObj.solutionList) ? (smartsearchObj.solutionList.map((it) => {
      return Object.assign({
        OwnerIdValue: it.OwnerIdValue,
        OwnerIdValueName: it.OwnerIdValueName,
        WiproAccountNameValue: it.WiproAccountNameValue,
        WiproInfluenceType: it.WiproInfluenceType,
        WiproAccountname: it.WiproAccountname,
        WiproOpportunitySolutionDetailId: it.WiproOpportunitySolutionDetailId,
        OrderSolutionId: '',
        WiproPercentage: it.WiproPercentage,
        WiproPercentageOfTCV: it.WiproPercentageOfTCV,
        WiproServiceType: it.WiproServiceType,
        WiproSolutionBDMValue: it.WiproSolutionBDMValue,
        WiproSolutionBDMName: it.WiproSolutionBDMName,
        WiproType: it.WiproType,
        WiproValue: it.WiproValue,
        OpportunityId: '',
        statecode: 0,
        wiproOrderid: '',
        WiproTypeName: it.WiproTypeName,
        WiproInfluenceTypeName: it.WiproInfluenceTypeName,
        WiproServiceTypeName: it.WiproServiceTypeName,
        IsDealRegistered : "",
      DealRegistrationYes : [{
        DealRegistrationId: "",
        OrderDealRegistrationId : "",
        IsDealRegistered: "",
        SolutionId: "",
        PartnerPortalId: "",
        RegisteredValue: "",
        RegistrationStatus: "",
        RegistrationStatusName: "",
        RegistrationStatusReason: "",
        RegistrationStatusReasonName: "",
        Remarks: "",
        Statecode:  0,
    }],
      DealRegistrationNo : [{
        DealRegistrationId: "",
        OrderDealRegistrationId : "",
        IsDealRegistered: "",
        SolutionId: "",
        PartnerPortalId: "",
        RegisteredValue: "",
        RegistrationStatus: "",
        RegistrationStatusName: "",
        RegistrationStatusReason: "",
        RegistrationStatusReasonName: "",
        Remarks: "",
        Statecode:  0,
    }]

      })
    })) : []

    if (smartsearchSL.length > 0 || smartsearchIP.length > 0 || smartsearchSol.length > 0) {
      this.userModifyFrm.form.markAsDirty();
    }

    smartsearchSL.push.apply(smartsearchSL, apiSLDetails);
    smartsearchIP.push.apply(smartsearchIP, apiIPDetails);
    smartsearchSol.push.apply(smartsearchSol, apiSolutionDetails);
    smartsearchCreditAllocation.push.apply(smartsearchCreditAllocation, apicreditAllocationDetails);

    this.createCreditAllocationDropDown(smartsearchSL, smartsearchIP, smartsearchSol, smartsearchCreditAllocation);
  }

  createCreditAllocationDropDown(tempSLDetails, tempIPDetails, tempSolutionDetails, tempcreditAllocationDetails) {
    let tempBSSLDetails = tempSLDetails.filter(it => it.SLCAID);
    this.tempCADD = [];
    tempBSSLDetails.forEach((it, index, selfSL) => {
      if (it.WiproServicelineidValue) {

        if (index == selfSL.findIndex((item) => (item.WiproServicelineidValue == it.WiproServicelineidValue))) {
          let tempBSPractice = tempBSSLDetails.filter(itprac => itprac.WiproServicelineidValue == it.WiproServicelineidValue);

          let tempPracticeDD = [];
          tempBSPractice.forEach((itpracobj, index, selfPrac) => {
            if (itpracobj.WiproPracticeId) {
              if (index == selfPrac.findIndex((itemprac) => itemprac.WiproPracticeId == itpracobj.WiproPracticeId)) {
                let tempSubPractice = tempBSPractice.filter(itsubprac => itsubprac.WiproServicelineidValue == itpracobj.WiproServicelineidValue && itsubprac.WiproPracticeId == itpracobj.WiproPracticeId);
                let filterpractice: any = this.allPracticeDD.filter(filprac => filprac.Id == itpracobj.WiproPracticeId);
                let practiceOBJName = (filterpractice.length > 0) ? filterpractice[0].Name : "";

                let tempSubPracticeDD = [];
                tempSubPractice.forEach((itsubpracobj, index, selfsubprac) => {

                  if (itsubpracobj.WiproSubpracticeid) {
                    if (index == selfsubprac.findIndex((itemsubprac) => itemsubprac.WiproSubpracticeid == itsubpracobj.WiproSubpracticeid)) {
                      let filterSubpractice: any = this.allSubPracticeDD.filter(filsubprac => filsubprac.Id == itsubpracobj.WiproSubpracticeid);
                      let subpracticeOBJName = (filterSubpractice.length > 0) ? filterSubpractice[0].Name : "";
                      tempSubPracticeDD.push(Object.assign({ SubPracticeIdName: subpracticeOBJName, SubPracticeId: itsubpracobj.WiproSubpracticeid }));

                    }
                  }
                })

                tempPracticeDD.push(Object.assign({ PracticeIdName: practiceOBJName, PracticeId: itpracobj.WiproPracticeId, CASubPracticeDD: tempSubPracticeDD }));

              }



            }
          })

          this.tempCADD.push(Object.assign({ ServicelineId: it.WiproServicelineidValue, ServicelineIdName: it.WiproServicelineidValueName, CAPracticeDD: tempPracticeDD }));

        }



      }
    })

    this.creditAllocationSLDD = this.tempCADD.map(res => {
      return {
        ServicelineId: res.ServicelineId,
        ServicelineIdName: res.ServicelineIdName,
        ErrorResponse: ""
      }
    })

    this.createSLStructure(tempSLDetails);
    this.createIpStructure(tempIPDetails);
    this.createSolutionStructure(tempSolutionDetails);
    this.createcreditAllocationStructure(tempcreditAllocationDetails);
  }

  //**************************************************************Service Line Methods Starts***************************************************/

  createSLStructure(BSSLoriginalDetails) {
    this.BSSLDetails = [];
    this.deleteServiceLIneArray = [];
    let BSSLlength = BSSLoriginalDetails.length;
    for (let i = 0; i < BSSLoriginalDetails.length; i++) {
      debugger;
      let cloudTCV: any = 0;
      let OrderBSSLoriginalDetails: any = {};
      let tempSLId = BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId : "";
      OrderBSSLoriginalDetails.wiproOrderid = this.OrderId
      OrderBSSLoriginalDetails.OpportunityId = this.OpportunityId;
      OrderBSSLoriginalDetails.WiproOpportunityServicelineOrderDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineOrderDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineOrderDetailId : "";
      OrderBSSLoriginalDetails.SLCAID = BSSLoriginalDetails[i].SLCAID ? BSSLoriginalDetails[i].SLCAID : "";
      OrderBSSLoriginalDetails.WiproServicelineidValue = BSSLoriginalDetails[i].WiproServicelineidValue ? BSSLoriginalDetails[i].WiproServicelineidValue : "";
      OrderBSSLoriginalDetails.WiproServicelineidValueName = BSSLoriginalDetails[i].WiproServicelineidValueName ? BSSLoriginalDetails[i].WiproServicelineidValueName : "";
      OrderBSSLoriginalDetails.WiproPracticeId = BSSLoriginalDetails[i].WiproPracticeId ? BSSLoriginalDetails[i].WiproPracticeId : "";
      OrderBSSLoriginalDetails.WiproPracticeName = BSSLoriginalDetails[i].WiproPracticeName ? BSSLoriginalDetails[i].WiproPracticeName : "";
      OrderBSSLoriginalDetails.WiproSubpracticeid = BSSLoriginalDetails[i].WiproSubpracticeid ? BSSLoriginalDetails[i].WiproSubpracticeid : "";
      OrderBSSLoriginalDetails.WiproSubpracticeName = BSSLoriginalDetails[i].WiproSubpracticeName ? BSSLoriginalDetails[i].WiproSubpracticeName : "";
      OrderBSSLoriginalDetails.WiproSlbdmidValueName = BSSLoriginalDetails[i].WiproSlbdmidValueName ? BSSLoriginalDetails[i].WiproSlbdmidValueName : "";
      OrderBSSLoriginalDetails.WiproSlbdmid = BSSLoriginalDetails[i].WiproSlbdmid ? BSSLoriginalDetails[i].WiproSlbdmid : "";
      OrderBSSLoriginalDetails.PricingTypeId = BSSLoriginalDetails[i].PricingTypeId ? BSSLoriginalDetails[i].PricingTypeId : "";
      OrderBSSLoriginalDetails.PricingTypeName = BSSLoriginalDetails[i].PricingTypeName ? BSSLoriginalDetails[i].PricingTypeName : "";
      OrderBSSLoriginalDetails.WiproPercentageOftcv = BSSLoriginalDetails[i].WiproPercentageOftcv ? (parseFloat(BSSLoriginalDetails[i].WiproPercentageOftcv).toFixed(2)).toString() : "";
      OrderBSSLoriginalDetails.WiproEstsltcv = BSSLoriginalDetails[i].WiproEstsltcv ? (parseFloat(BSSLoriginalDetails[i].WiproEstsltcv).toFixed(2)).toString() : "";
      OrderBSSLoriginalDetails.Cloud = BSSLoriginalDetails[i].Cloud ? JSON.parse(BSSLoriginalDetails[i].Cloud) : false;
      OrderBSSLoriginalDetails.WiproEngagementModel = BSSLoriginalDetails[i].WiproEngagementModel ? BSSLoriginalDetails[i].WiproEngagementModel : "";
      OrderBSSLoriginalDetails.WiproEngagementModelName = BSSLoriginalDetails[i].WiproEngagementModelName ? BSSLoriginalDetails[i].WiproEngagementModelName : "";
      OrderBSSLoriginalDetails.WiproDualCredit = BSSLoriginalDetails[i].WiproDualCredit ? BSSLoriginalDetails[i].WiproDualCredit : "";
      OrderBSSLoriginalDetails.WiproDualCreditName = BSSLoriginalDetails[i].WiproDualCreditName ? BSSLoriginalDetails[i].WiproDualCreditName : "";

      if (this.ModificationId && this.ModificationOBAllocation) {
        OrderBSSLoriginalDetails.statecode = (BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId) ? 2 : 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId : "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 2 })
        })
        ) : [];
      }
      else {
        OrderBSSLoriginalDetails.statecode = 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '' })
        })
        ) : [];

      }

      let SLPractice = (OrderBSSLoriginalDetails.WiproServicelineidValue) ? (this.allPracticeDD.filter(it => it.ServiceLineId == OrderBSSLoriginalDetails.WiproServicelineidValue).map(obj => {
        return Object.assign({
          SysGuid: obj.Id,
          Name: obj.Name,
          IsVisible: obj.IsVisible,
        })
      })) : [];
      if(OrderBSSLoriginalDetails.WiproPracticeId){
        if(SLPractice.some(it=> it.SysGuid == OrderBSSLoriginalDetails.WiproPracticeId) == false){
          let tempPractice = this.allPracticeDD.filter(it => it.Id == OrderBSSLoriginalDetails.WiproPracticeId);
          if( tempPractice.length > 0){
            SLPractice.push(Object.assign({
              SysGuid: tempPractice[0].Id,
              Name: tempPractice[0].Name,
              IsVisible: false,
            }))
          }
        }
      }
      let SLSubPracticeDD = (OrderBSSLoriginalDetails.WiproServicelineidValue && OrderBSSLoriginalDetails.WiproPracticeId) ? (this.allSubPracticeDD.filter(it => it.PracticeId == OrderBSSLoriginalDetails.WiproPracticeId).map(obj => {
        return Object.assign({ SubPracticeId: obj.Id, Name: obj.Name, IsVisible: obj.IsVisible, })

      })) : [];
      if(OrderBSSLoriginalDetails.WiproSubpracticeid){
        if(SLSubPracticeDD.some(it=> it.SubPracticeId == OrderBSSLoriginalDetails.WiproSubpracticeid) == false){
          let tempSubPractice = this.allSubPracticeDD.filter(it => it.Id == OrderBSSLoriginalDetails.WiproSubpracticeid);
          if( tempSubPractice.length > 0){
            SLSubPracticeDD.push(Object.assign({
              SubPracticeId: tempSubPractice[0].Id,
              Name: tempSubPractice[0].Name,
              IsVisible: false,
            }))
          }
        }
      }
      let SLslBDMDD = [];
      let selectedSLBDM = (OrderBSSLoriginalDetails.WiproSlbdmidValueName && OrderBSSLoriginalDetails.WiproSlbdmid) ? (new Array(Object.assign({
        'SysGuid': OrderBSSLoriginalDetails.WiproSlbdmid,
        'Name': OrderBSSLoriginalDetails.WiproSlbdmidValueName,
        'EmailID': '',
        'Id': OrderBSSLoriginalDetails.WiproSlbdmid
      }))) : [];
      let selectedSLPricingType = (OrderBSSLoriginalDetails.PricingTypeName && OrderBSSLoriginalDetails.PricingTypeId) ? (new Array(Object.assign({
        'SysGuid': OrderBSSLoriginalDetails.PricingTypeId,
        'Name': OrderBSSLoriginalDetails.PricingTypeName,
        'Code': '',
        'Id': OrderBSSLoriginalDetails.PricingTypeId
      }))) : [];
      let EngagementModelDD = [];
      let addedByDualCreditbtn = (this.WTFlag && BSSLoriginalDetails[i].WiproDualCredit && (BSSLoriginalDetails[i].WiproServicelineidValueName == this.CIS || BSSLoriginalDetails[i].WiproServicelineidValueName == this.CRS)) ? true : false;
      this.checkMandatoryCloud(OrderBSSLoriginalDetails, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, BSSLlength, tempSLId, addedByDualCreditbtn);

    }

    if (BSSLlength == 0) {
      this.serviceLineLoader = false;
    }
  }

  checkMandatoryCloud(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, tempSLId, addedByDualCreditbtn) {
    let obj = {
      ServiceLineID: BSSLoriginalDetailsObj.WiproServicelineidValue,
      PracticeID: BSSLoriginalDetailsObj.WiproPracticeId,
      SubPracticeID: BSSLoriginalDetailsObj.WiproSubpracticeid
    }
    let cloudFlag = false;
    // if (tempSLId) {
    this.projectService.getCloudDetails(obj).subscribe(res => {
      cloudFlag = (res.ResponseObject && res.ResponseObject.WiproClouddetailsrequired) ? res.ResponseObject.WiproClouddetailsrequired : false;
      this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
    }, err => {
      this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
    });
    // } else {
    //   this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, i, SLlength, cloudFlag, tempSLId);
    // }
  }

  getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn) {
    if (BSSLoriginalDetailsObj.WiproServicelineidValue) {
      this.projectService.getEngagementModelData(BSSLoriginalDetailsObj.WiproServicelineidValue).subscribe(res => {
        EngagementModelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (tempSLId != "") {
          this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
        } else {
          this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
        }
      }, err => {
        if (tempSLId != "") {
          this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
        } else {
          this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
        }
      });
    } else {
      if (tempSLId != "") {
        this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
      } else {
        this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
      }

    }
  }

  // getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag) {

  // }

  // getBSSLSubPracticeandSLBDM(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag) {

  //   if (BSSLoriginalDetailsObj.WiproServicelineidValue && BSSLoriginalDetailsObj.WiproPracticeId) {
  //     this.projectService.getSLSubPractice(BSSLoriginalDetailsObj.WiproPracticeId).subscribe(res => {
  //       SLSubPracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //       this.getSLSLBDMData(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag);
  //     },
  //       err => {
  //         if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId != "") {
  //           this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag);
  //         } else {
  //           this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag);
  //         }
  //       });
  //   } else {
  //     this.getSLSLBDMData(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag);
  //   }

  // }

  // getSLSLBDMData(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag, tempSLId) {
  //   this.projectService.getSLSLBDM(BSSLoriginalDetailsObj.WiproServicelineidValue, BSSLoriginalDetailsObj.WiproPracticeId, BSSLoriginalDetailsObj.WiproSubpracticeid).subscribe(res => {
  //     SLslBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //     if (tempSLId != "") {
  //       this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag, tempSLId);
  //     } else {
  //       this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag, tempSLId);
  //     }
  //   },
  //     err => {
  //       if (tempSLId != "") {
  //         this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag, tempSLId);
  //       } else {
  //         this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, i, SLlength, cloudFlag, tempSLId);
  //       }

  //     });
  // }

  PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn) {
    this.BSSLDetails.push(Object.assign({}, new OrderserviceLineBSDetails(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD,[], EngagementModelDD, selectedSLBDM,selectedSLPricingType,false, false, false, cloudFlag, addedByDualCreditbtn, cloudTCV,
      "BSSLName" + i + "SavedData" + tempSLId,
      "BSPracticeName" + i + "SavedData" + tempSLId,
      "BSSubPracticeName" + i + "SavedData" + tempSLId,
      "BSSlBDMName" + i + "SavedData" + tempSLId,
      "BSPercTCVName" + i + "SavedData" + tempSLId,
      "BSSLTCVName" + i + "SavedData" + tempSLId,
      "BSCloudName" + i + "SavedData" + tempSLId,
      "BSPricingTypeName" + i + "SavedData" + tempSLId,
      "BSEngagementName" + i + "SavedData" + tempSLId,
      "BSDualCreditName" + i + "SavedData" + tempSLId)));

    if (i == (SLlength - 1)) {
      this.serviceLineLoader = false;
    }
  }

  PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn) {
    let BSSLnamelength = this.BSSLDetails.length + 1;
    this.newBSSLDataCount = this.newBSSLDataCount + 1;
    this.BSSLDetails.push(Object.assign({}, new OrderserviceLineBSDetails(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD,[], EngagementModelDD, selectedSLBDM,selectedSLPricingType,false, false, false, cloudFlag, addedByDualCreditbtn, cloudTCV,
      "BSSLName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSubPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSlBDMName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPercTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSLTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSCloudName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPricingTypeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSEngagementName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSDualCreditName" + this.newBSSLDataCount + "NewData" + BSSLnamelength)));
    if (i == (SLlength - 1)) {
      this.serviceLineLoader = false;
    }
  }

  navigatetoBSSLCloud(ServiceLIneData, i, CloudDisabled) {

    // WiproServicelineidValue
    if (!CloudDisabled) {
      let servicelineName = ServiceLIneData.WiproServicelineidValueName;
      let tempBSpracticeDD = this.BSSLDetails[i].SlpracticeDD.filter(it => it.SysGuid == ServiceLIneData.WiproPracticeId);
      let practiceName = tempBSpracticeDD.length > 0 ? tempBSpracticeDD[0].Name : "";
      let tempBSSubPracticeDD = this.BSSLDetails[i].SlSubpracticeDD.filter(it => it.SubPracticeId == ServiceLIneData.WiproSubpracticeid);
      let subPracticeName = tempBSSubPracticeDD.length > 0 ? tempBSSubPracticeDD[0].Name : "";
      // this.projectServic/e.setSession("SLObjForCloud", { WTFlag: this.WTFlag, disableOnRoleBSSL: this.disableOnRoleBSSL, Details: ServiceLIneData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv });
      // this.router.navigate(['/opportunity/servicelineadditionaldetails']);
      let dialogRef = this.dialog.open(OrderOpenServiceline, {
        width: "900px",
        data: { type: 'mod', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, servicelineName: servicelineName, practiceName: practiceName, subPracticeName: subPracticeName, Details: ServiceLIneData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, WTFlag: this.WTFlag, disableOnRoleBSSL: this.disableOnRoleBSSL }
      });

      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (result) {
          if (result.clouddirtyflag == true) {
            this.userModifyFrm.form.markAsDirty();
          }
          this.BSSLDetails[i].CloudTCV = result.cloudTCV ? parseFloat(result.cloudTCV) : 0;
          this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails = result.cloudData ? result.cloudData : [];
          if (this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails.filter(it => it.CloudStatecode != 1).length == 0) {
            this.BSSLDetails[i].BSServiceLine.Cloud = false;
          } else {
            this.BSSLDetails[i].BSServiceLine.Cloud = true;
          }
        } else {
          this.BSSLDetails[i].BSServiceLine.Cloud = false;
          this.BSSLDetails[i].CloudTCV = 0;
        }
      });
    } else {
      this.projectService.displayMessageerror("Please save this service line then proceed with the action");
    }
  }

  cloudDetailsApi(i) {
    let obj = {
      ServiceLineID: this.BSSLDetails[i].BSServiceLine.WiproServicelineidValue,
      PracticeID: this.BSSLDetails[i].BSServiceLine.WiproPracticeId,
      SubPracticeID: this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid
    }

    // if (this.BSSLDetails[i].BSServiceLine.WiproOpportunityServicelineDetailId) {
    this.projectService.getCloudDetails(obj).subscribe(res => {
      if (!res.IsError) {

        if (res.ResponseObject.WiproClouddetailsrequired) {
          this.BSSLDetails[i].cloudFlag = true;
        }
        else {
          this.BSSLDetails[i].cloudFlag = false;
        }
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, err => {
      this.projectService.displayerror(err.status);
    });
    // }
  }
  usercheckServiceLineChange(ServiceLIneData, i, practiceDD) {
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if ((defaultCA.length > 0 && defaultCA[0].creditAllocation.ServicelineId)) {
      this.openDialogDelete("If you change service line, Related Multiple BDM record will delete. Are you sure you want to change record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be deleted from the Order Booking screens", "Confirm", "Alert").subscribe(res => {
        if (res == 'save') {
          this.changeServiceLine(ServiceLIneData, i, practiceDD);
        } else {
          this.BSSLDetails[i].BSServiceLine.WiproServicelineidValue = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.ServicelineId : '';
        }
      });
    } else {
      this.changeServiceLine(ServiceLIneData, i, practiceDD);
    }
  }


  disableBSServiceLine(BSSLdata,SLData){
    if(!SLData.IsVisible){
      return true;
    }else{
      if(BSSLdata.addedByDualCreditbtn && SLData.Name != this.CIS && SLData.Name != this.CRS){
        return true;
      }else if(BSSLdata.addedByDualCreditbtn && SLData.Name == this.CIS && this.showWTCIS == false){
        return true;
      }else if(BSSLdata.addedByDualCreditbtn && SLData.Name == this.CRS && this.showWTCRS == false){
        return true;
      }else{
        return false;
      }
    }
  }

  getBSSLPracticeData(ServiceLIneData, i) {
    let practiceDD = [];
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if (ServiceLIneData.WiproServicelineidValue) {
      practiceDD = this.allPracticeDD.filter(it => it.ServiceLineId == ServiceLIneData.WiproServicelineidValue);
      if (practiceDD.length > 0) {
        this.usercheckServiceLineChange(ServiceLIneData, i, practiceDD);
      } else {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == ServiceLIneData.WiproServicelineidValue).length > 1) {
          this.projectService.displayMessageerror("Duplicate service line already exist");
          setTimeout(() => {
            this.BSSLDetails[i].BSServiceLine.WiproServicelineidValue = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.ServicelineId : '';
            this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.ServicelineName : '';
          });
        } else {
          this.usercheckServiceLineChange(ServiceLIneData, i, practiceDD);
        }
      }
    } else {
      this.usercheckServiceLineChange(ServiceLIneData, i, practiceDD);
    }
  }

  changeServiceLine(ServiceLIneData, i, practiceDD) {
    let resetOverAllTCV = false;
    this.BSSLDetails[i].SlSubpracticeDD = [];
    this.BSSLDetails[i].SlSLBDMDD = [];
    this.BSSLDetails[i].BSServiceLine.WiproPracticeId = "";
    this.BSSLDetails[i].BSServiceLine.WiproPracticeName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = "";
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    this.BSSLDetails[i].selectedSLBDM = [];
    this.BSSLDetails[i].BSServiceLine.WiproEngagementModel = "";
    this.BSSLDetails[i].BSServiceLine.WiproEngagementModelName = "";
    if (ServiceLIneData.WiproServicelineidValue) {
      this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName = (this.IpandServiceLinelDD.filter(it => it.SysGuid == ServiceLIneData.WiproServicelineidValue))[0].Name;
      if (this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName != this.CIS && this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName != this.CRS) {
        resetOverAllTCV = ServiceLIneData.WiproDualCredit ? true : false;
        this.BSSLDetails[i].BSServiceLine.WiproDualCredit = "";
        this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = "";
        if (ServiceLIneData.WiproEstsltcv && resetOverAllTCV) {
          let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
            if (!(elem.BSServiceLine.WiproDualCredit)) {
              let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
              return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
            } else {
              return prevVal;
            }
          }, 0);

          let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
          if (sumofSLTCV > this.maxDecimalValue) {
            this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
            this.projectService.displayMessageerror("SL TCV  in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
          }
          else if (sumofSLTCV < this.minDecimalValue) {
            this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
            this.projectService.displayMessageerror("SL TCV  in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
          }
          else if (totalTCV > this.maxDecimalValue) {
            this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
            this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
          }
          else if (totalTCV < this.minDecimalValue) {
            this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
            this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
          }
        }
      }
      this.BSSLDetails[i].SlpracticeDD = practiceDD.map(obj => {
        return Object.assign({
          SysGuid: obj.Id,
          Name: obj.Name,
          IsVisible: obj.IsVisible
        })
      });
      if (this.BSSLDetails[i].SlpracticeDD.length == 0) {
        this.cloudDetailsApi(i);
        this.getBSSLSlBDMData(ServiceLIneData, i, "", resetOverAllTCV);
      } else {
        this.deleteCreditAllocationOnSLChange(ServiceLIneData, i, resetOverAllTCV);
        this.BSSLDetails[i].cloudFlag = false;
      }
      this.projectService.getEngagementModelData(ServiceLIneData.WiproServicelineidValue).subscribe(res => {
        this.BSSLDetails[i].EngagementModelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      },
        err => {
          this.BSSLDetails[i].EngagementModelDD = [];
        });
    }
    else {
      resetOverAllTCV = ServiceLIneData.WiproDualCredit ? true : false;
      this.BSSLDetails[i].SlpracticeDD = [];
      this.BSSLDetails[i].EngagementModelDD = [];
      this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName = "";
      this.BSSLDetails[i].BSServiceLine.WiproDualCredit = "";
      this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = "";
      if (ServiceLIneData.WiproEstsltcv && resetOverAllTCV) {
        let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
          if (!(elem.BSServiceLine.WiproDualCredit)) {
            let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
            return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
          } else {
            return prevVal;
          }
        }, 0);

        let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
        if (sumofSLTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (sumofSLTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
      }
      this.deleteCreditAllocationOnSLChange(ServiceLIneData, i, resetOverAllTCV);
    }
  }


  deleteCreditAllocationOnSLChange(ServiceLIneData, i, resetOverAllTCV?) {
    let newcreditAllocation: any = [];
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

      if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else {
        newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
      }
    }

    this.creditAllocationdataDetails = newcreditAllocation.map(it => { return Object.assign({}, it) });
    if (defaultCA.length > 0) {
      let cadefaultindex = this.creditAllocationdataDetails.findIndex(it => it.creditAllocation.SLCAID == defaultCA[0].creditAllocation.SLCAID && it.creditAllocation.WiproIsDefault == true);

      if (cadefaultindex >= 0) {
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineId = ServiceLIneData.WiproServicelineidValue;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineName = this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.PracticeId = this.BSSLDetails[i].BSServiceLine.WiproPracticeId;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.PracticeName = this.BSSLDetails[i].BSServiceLine.WiproPracticeName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.SubPracticeId = this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.SubPracticeName = this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineBDMId = this.BSSLDetails[i].BSServiceLine.WiproSlbdmid;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineBDMName = this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.WiproValue = (ServiceLIneData.WiproEstsltcv) ? ServiceLIneData.WiproEstsltcv : "";
        this.creditAllocationdataDetails[cadefaultindex].selectedCABDM = [{ SysGuid: this.BSSLDetails[i].BSServiceLine.WiproSlbdmid, Name: this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName, EmailID: '', Id: this.BSSLDetails[i].BSServiceLine.WiproSlbdmid }];
      }

    }

    if (resetOverAllTCV) {
      this.resetSLTCVandOverAllTCV();
    }
    this.createCASLPracSubPracDD();


  }


  createCASLPracSubPracDD() {
    let tempBSSLDetails = this.BSSLDetails.map(it => { return Object.assign({}, it) });
    this.tempCADD = [];


    //loop through each row of SL
    tempBSSLDetails.forEach((it, index, selfSL) => {
      if (it.BSServiceLine.WiproServicelineidValue) {

        if (index == selfSL.findIndex((item) => (item.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue))) {

          // get all practice for selected service line
          let tempBSPractice = tempBSSLDetails.filter(itprac => itprac.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue);
          let tempPracticeDD = [];
          tempBSPractice.forEach((itpracobj, index, selfPrac) => {
            if (itpracobj.BSServiceLine.WiproPracticeId) {
              if (index == selfPrac.findIndex((itemprac) => itemprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId)) {
                // get all Subpractice for selected service line and practice
                let tempSubPractice = tempBSPractice.filter(itsubprac => itsubprac.BSServiceLine.WiproServicelineidValue == itpracobj.BSServiceLine.WiproServicelineidValue && itsubprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId);
                let filteredpractice: any = itpracobj.SlpracticeDD.filter(filprac => filprac.SysGuid == itpracobj.BSServiceLine.WiproPracticeId);
                let practiceOBJName = (filteredpractice.length > 0) ? filteredpractice[0].Name : "";
                let tempSubPracticeDD = [];
                tempSubPractice.forEach((itsubpracobj, index, selfsubprac) => {
                  if (itsubpracobj.BSServiceLine.WiproSubpracticeid) {
                    if (index == selfsubprac.findIndex((itemsubprac) => itemsubprac.BSServiceLine.WiproSubpracticeid == itsubpracobj.BSServiceLine.WiproSubpracticeid)) {
                      let filteredsubpractice: any = itsubpracobj.SlSubpracticeDD.filter(filsubprac => filsubprac.SubPracticeId == itsubpracobj.BSServiceLine.WiproSubpracticeid);
                      let subpracticeOBJName = (filteredsubpractice.length > 0) ? filteredsubpractice[0].Name : "";
                      tempSubPracticeDD.push(Object.assign({ SubPracticeIdName: subpracticeOBJName, SubPracticeId: itsubpracobj.BSServiceLine.WiproSubpracticeid }));

                    }
                  }
                })
                tempPracticeDD.push(Object.assign({ PracticeIdName: practiceOBJName, PracticeId: itpracobj.BSServiceLine.WiproPracticeId, CASubPracticeDD: tempSubPracticeDD }));
              }
            }
          })
          this.tempCADD.push(Object.assign({ ServicelineId: it.BSServiceLine.WiproServicelineidValue, ServicelineIdName: it.BSServiceLine.WiproServicelineidValueName, CAPracticeDD: tempPracticeDD }));
        }
      }
    })

    debugger;
    this.creditAllocationSLDD = this.tempCADD.map(res => {
      return {
        ServicelineId: res.ServicelineId,
        ServicelineIdName: res.ServicelineIdName,
        ErrorResponse: ""
      }
    })

    this.creditAllocationdataDetails.forEach(res => {
      debugger;
      // if (!res.creditAllocation.WiproIsDefault) {
      if (res.creditAllocation.ServicelineId) {
        let tempPracticeCADD: any = this.tempCADD.filter(sl => sl.ServicelineId == res.creditAllocation.ServicelineId);
        let practiceCADD: any = (tempPracticeCADD.length > 0) ? tempPracticeCADD[0].CAPracticeDD : [];
        res.practiceDD = practiceCADD.map(pracCA => { return { PracticeIdName: pracCA.PracticeIdName, PracticeId: pracCA.PracticeId, ErrorResponse: "" } });
        if (res.creditAllocation.PracticeId) {
          let tempsubPracticeCADD: any = practiceCADD.filter(prac => prac.PracticeId == res.creditAllocation.PracticeId);
          let subPracticeCADD: any = (tempsubPracticeCADD.length > 0) ? tempsubPracticeCADD[0].CASubPracticeDD : [];
          res.subPracticeDD = subPracticeCADD.map(subPracCA => {
            return {
              SubPracticeId: subPracCA.SubPracticeId,
              SubPracticeIdName: subPracCA.SubPracticeIdName, ErrorResponse: ""
            }
          });
        } else {
          res.subPracticeDD = [];
        }
      } else {
        res.practiceDD = [];
      }
    })
  }



  usercheckPracticeChange(ServiceLIneData, i, subPracticeDD) {
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if ((defaultCA.length > 0 && defaultCA[0].creditAllocation.PracticeId)) {
      this.openDialogDelete("If you change Practice, Related Multiple BDM record will delete. Are you sure you want to change record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be deleted from the Order Booking screens", "Confirm", "Alert").subscribe(res => {
        if (res == 'save') {
          this.changePractice(ServiceLIneData, i, subPracticeDD);
        } else {
          this.BSSLDetails[i].BSServiceLine.WiproPracticeId = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.PracticeId : '';
        }
      });
    } else {
      this.changePractice(ServiceLIneData, i, subPracticeDD);
    }
  }

  checkActivePractice(practiceDD) {
    let practiceLength: any = practiceDD.filter(it => it.Name != this.ACS && it.IsVisible == true).length;
    return practiceLength;

  }

  checkActiveSubPractice(subPracticeDD) {
    let subPracticeLength: any = subPracticeDD.filter(it => it.IsVisible == true).length;
    return subPracticeLength;

  }

  getBSSLSubPracticeData(ServiceLIneData, i) {
    let subPracticeDD = [];
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if (ServiceLIneData.WiproPracticeId) {
      subPracticeDD = this.allSubPracticeDD.filter(it => it.PracticeId == ServiceLIneData.WiproPracticeId);
      if (subPracticeDD.length > 0) {
        this.usercheckPracticeChange(ServiceLIneData, i, subPracticeDD);
      } else {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == ServiceLIneData.WiproServicelineidValue && it.BSServiceLine.WiproPracticeId == ServiceLIneData.WiproPracticeId).length > 1) {
          this.projectService.displayMessageerror("Duplicate service line and Practice combination already exist");
          setTimeout(() => {
            this.BSSLDetails[i].BSServiceLine.WiproPracticeId = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.PracticeId : '';
            this.BSSLDetails[i].BSServiceLine.WiproPracticeName = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.PracticeName : '';
          });
        } else {
          this.usercheckPracticeChange(ServiceLIneData, i, subPracticeDD);
        }
      }
    } else {
      this.usercheckPracticeChange(ServiceLIneData, i, subPracticeDD);
    }


  }

  changePractice(ServiceLIneData, i, subPracticeDD) {
    this.BSSLDetails[i].SlSLBDMDD = [];
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = "";
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    this.BSSLDetails[i].selectedSLBDM = [];
    if (ServiceLIneData.WiproServicelineidValue && ServiceLIneData.WiproPracticeId) {
      let tempSLPractice = this.BSSLDetails[i].SlpracticeDD.filter(it => it.SysGuid == ServiceLIneData.WiproPracticeId);
      this.BSSLDetails[i].BSServiceLine.WiproPracticeName = (tempSLPractice.length > 0) ? tempSLPractice[0].Name : "";
      this.BSSLDetails[i].SlSubpracticeDD = subPracticeDD.map(obj => {
        return Object.assign({ SubPracticeId: obj.Id, Name: obj.Name, IsVisible: obj.IsVisible })

      });
      this.getBSSLSlBDMData(ServiceLIneData, i, "");
      if (this.BSSLDetails[i].SlSubpracticeDD.length == 0) {
        this.cloudDetailsApi(i)
      } else {
        this.BSSLDetails[i].cloudFlag = false;
      }
    }
    else {
      this.BSSLDetails[i].BSServiceLine.WiproPracticeName = "";
      this.BSSLDetails[i].SlSubpracticeDD = [];
      this.deleteCreditAllocationOnSLChange(ServiceLIneData, i);
    }
  }

  changeCreditAllocationOnSLChange(ServiceLIneData, i) {
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

      if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId).length == 0) {
          this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId = "";
          this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeName = "";
          this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = "";
        }
      }
    }


    if (defaultCA.length > 0) {
      let cadefaultindex = this.creditAllocationdataDetails.findIndex(it => it.creditAllocation.SLCAID == defaultCA[0].creditAllocation.SLCAID && it.creditAllocation.WiproIsDefault == true);

      if (cadefaultindex >= 0) {
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineId = ServiceLIneData.WiproServicelineidValue;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineName = this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.PracticeId = this.BSSLDetails[i].BSServiceLine.WiproPracticeId;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.PracticeName = this.BSSLDetails[i].BSServiceLine.WiproPracticeName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.SubPracticeId = this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.SubPracticeName = this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineBDMId = this.BSSLDetails[i].BSServiceLine.WiproSlbdmid;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.ServicelineBDMName = this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName;
        this.creditAllocationdataDetails[cadefaultindex].creditAllocation.WiproValue = (ServiceLIneData.WiproEstsltcv) ? ServiceLIneData.WiproEstsltcv : "";
        this.creditAllocationdataDetails[cadefaultindex].selectedCABDM = [{ SysGuid: this.BSSLDetails[i].BSServiceLine.WiproSlbdmid, Name: this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName, EmailID: '', Id: this.BSSLDetails[i].BSServiceLine.WiproSlbdmid }];
      }

    }

    this.createCASLPracSubPracDD();


  }

  mandatoryCloudCheck(ServiceLIneData, i) {
    let tempSlSubPrac = this.BSSLDetails[i].SlSubpracticeDD.filter(it => it.SubPracticeId == ServiceLIneData.WiproSubpracticeid);
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = (tempSlSubPrac.length > 0) ? tempSlSubPrac[0].Name : "";
    // if (this.BSSLDetails[i].BSServiceLine.WiproOpportunityServicelineDetailId) {
    this.cloudDetailsApi(i)
    this.changeCreditAllocationOnSLChange(ServiceLIneData, i);
    // }
    // this.getBSSLSlBDMData(ServiceLIneData, i, "");
  }

  changeCAonSubpracticeChange

  usercheckSubPracticeChange(ServiceLIneData, i) {
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if ((defaultCA.length > 0 && defaultCA[0].creditAllocation.SubPracticeId)) {
      this.openDialogDelete("If you change Sub practice, Related Multiple BDM record will change. Are you sure you want to change record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be changed from the Order Booking screens", "Confirm", "Alert").subscribe(res => {
        if (res == 'save') {
          this.mandatoryCloudCheck(ServiceLIneData, i);
        } else {
          this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.SubPracticeId : '';
        }
      });
    } else {
      this.mandatoryCloudCheck(ServiceLIneData, i);
    }
  }

  duplicateSubPracticeCheck(ServiceLIneData, i) {
    let defaultCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.SLCAID == ServiceLIneData.SLCAID && it.creditAllocation.WiproIsDefault == true).map(ca => { return Object.assign({}, ca) });
    if (ServiceLIneData.WiproSubpracticeid) {
      if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == ServiceLIneData.WiproServicelineidValue && it.BSServiceLine.WiproPracticeId == ServiceLIneData.WiproPracticeId && it.BSServiceLine.WiproSubpracticeid == ServiceLIneData.WiproSubpracticeid).length > 1) {
        setTimeout(() => {
          this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.SubPracticeId : '';
          this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = (defaultCA.length > 0) ? defaultCA[0].creditAllocation.SubPracticeName : '';
        })
        this.projectService.displayMessageerror("Duplicate service line and Practice and Sub practice combination already exist");
      } else {
        this.usercheckSubPracticeChange(ServiceLIneData, i);
      }
    } else {
      this.usercheckSubPracticeChange(ServiceLIneData, i);
    }


  }


  calculateCAValue() {
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

      if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
        this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
      }
      else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId) {
        let selectedBSSL = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId);
        if (selectedBSSL.length > 0) {
          this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = selectedBSSL[0].BSServiceLine.WiproEstsltcv;
        }
      }
      else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId) {
        let selectedBSSL = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.SlSubpracticeDD.length == 0);
        if (selectedBSSL.length > 0) {
          this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = selectedBSSL[0].BSServiceLine.WiproEstsltcv;
        }
      }
      else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId) {
        let selectedBSSL = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.SlpracticeDD.length == 0);
        if (selectedBSSL.length > 0) {
          this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = selectedBSSL[0].BSServiceLine.WiproEstsltcv;
        }
      }
    }
  }

  // calculateCAValueVericalGeo() {
  //   for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

  //     if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
  //       this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
  //     }
  //   }
  // }

  setEngagementModelName(ServiceLIneData, i) {
    let tempSlEngagementModel = this.BSSLDetails[i].EngagementModelDD.filter(it => it.Id == ServiceLIneData.WiproEngagementModel);
    this.BSSLDetails[i].BSServiceLine.WiproEngagementModelName = (tempSlEngagementModel.length > 0) ? tempSlEngagementModel[0].Name : "";
  }

  getBSSLSlBDMData(ServiceLIneData, i, searchValue, resetOverAllTCV?) {
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    this.BSSLDetails[i].selectedSLBDM = [];
    this.addIPservice.getSLBDMDropDownList1(ServiceLIneData.WiproServicelineidValue, ServiceLIneData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.BSSLDetails[i].SlSLBDMDD = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      if (this.BSSLDetails[i].SlSLBDMDD.length == 1) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = this.BSSLDetails[i].SlSLBDMDD[0].SysGuid;
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = this.BSSLDetails[i].SlSLBDMDD[0].Name;
        this.BSSLDetails[i].selectedSLBDM = new Array(Object.assign({}, this.BSSLDetails[i].SlSLBDMDD[0]));
      }
      this.deleteCreditAllocationOnSLChange(ServiceLIneData, i, resetOverAllTCV);
    },
      err => {
        this.BSSLDetails[i].SlSLBDMDD = [];
        this.deleteCreditAllocationOnSLChange(ServiceLIneData, i, resetOverAllTCV);
      })
  }


  OnChangegetBSSLSlBDMData(ServiceLIneData, i, searchValue) {
    this.addIPservice.getSLBDMDropDownList1(ServiceLIneData.WiproServicelineidValue, ServiceLIneData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.BSSLDetails[i].SlSLBDMDD = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.BSSLDetails[i].SlSLBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServicelineidValue, rowData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  OnCloseOfBSSLBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.BSSLDetails[i].SLSLBDMSwitchName = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.BSSLDetails[i].selectedSLBDM = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];
      // if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
      let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
        return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
      });
      if (defaultCAIndex >= 0) {
        this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
        this.creditAllocationdataDetails[defaultCAIndex].selectedCABDM = [{
          Name: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "",
          SysGuid: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "", EmailID: '', Id: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : ""
        }];
        this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
        this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      }
    } else {

      if (!this.BSSLDetails[i].selectedSLBDM.some(res => res.SysGuid == rowData.WiproSlbdmid && res.Name == rowData.WiproSlbdmidValueName)) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
        this.BSSLDetails[i].selectedSLBDM = [];
        // if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
        let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
          return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
        });
        if (defaultCAIndex >= 0) {
          this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          this.creditAllocationdataDetails[defaultCAIndex].selectedCABDM = [];
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = "";
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = "";
        }

        // }

      }
    }

  }



  getSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServicelineidValue, rowData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? ([{
        'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
        'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
        'EmailID': this.VSOEmailId,
        'Id': this.modifyOrderDetailsObj.currentOrderVSOId
      }]) : SLBDMresp;
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  BSSLbdmNameclose(ServiceLIneData, i, event) {
    let id = 'advanceBSSLSLBDMSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.BSSLDetails[i].SLSLBDMSwitchName = false;
      this.OdatanextLink = null;
      if (!this.BSSLDetails[i].selectedSLBDM.some(res => res.SysGuid == ServiceLIneData.WiproSlbdmid && res.Name == ServiceLIneData.WiproSlbdmidValueName)) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
        this.BSSLDetails[i].selectedSLBDM = [];
        // if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
        let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
          return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
        });
        if (defaultCAIndex >= 0) {
          this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = "";
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = "";
        }

        // }

      }
    }
  }


  checkForBSSLCloud(ServiceLIneData, i, disabled) {
    if (disabled == false && this.disableOnRoleBSSL == false) {
      if (ServiceLIneData.Cloud == false) {
        if ((ServiceLIneData.AdditionalServiceLinesCloudDetails.filter(it => it.CloudStatecode != 1)).length <= 0) {
          setTimeout(() => {
            this.BSSLDetails[i].BSServiceLine.Cloud = false;
          })
          this.projectService.displayMessageerror("There are no cloud details present for " + this.converIndextoString(i) + " row of service lines table, Please add the cloud then proceed with the action");
        } else {
          setTimeout(() => {
            this.BSSLDetails[i].BSServiceLine.Cloud = true;
          })

        }
      }
    }
  }


  changeBSSLBDMData(selectedData, ServiceLIneData, i) {
    this.BSSLDetails[i].SLSLBDMSwitchName = false;
    this.OdatanextLink = null;
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = selectedData.SysGuid;
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = selectedData.Name;
    this.BSSLDetails[i].selectedSLBDM = new Array(Object.assign({}, selectedData));
    let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
      return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
    });
    if (defaultCAIndex >= 0) {
      this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
      this.creditAllocationdataDetails[defaultCAIndex].selectedCABDM = [{ Name: selectedData.Name, SysGuid: selectedData.SysGuid, EmailID: '', Id: selectedData.SysGuid }];
      this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = selectedData.SysGuid;
      this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = selectedData.Name;
    }


  }

  OnChangegetBSSLPricingTypeData(ServiceLIneData, i, searchValue) {
    this.addIPservice.getPricingTypeList(searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
    
      this.BSSLDetails[i].SlPricingTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.BSSLDetails[i].SlPricingTypeDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getSLPricingTypeDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getPricingTypeList(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  OnCloseOfBSSLPricingTypePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.BSSLDetails[i].SLPricingTypeSwitchName = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.BSSLDetails[i].BSServiceLine.PricingTypeName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.BSSLDetails[i].BSServiceLine.PricingTypeId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.BSSLDetails[i].selectedSLPricingType = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {
      if (!this.BSSLDetails[i].selectedSLPricingType.some(res => res.Name == rowData.PricingTypeName && res.SysGuid == rowData.PricingTypeId)) {
        this.BSSLDetails[i].BSServiceLine.PricingTypeName = "";
        this.BSSLDetails[i].BSServiceLine.PricingTypeId = "";
        this.BSSLDetails[i].selectedSLPricingType = [];

      }
    }
  }



  getSLPricingTypeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getPricingTypeList(emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  BSSLPricingTypeNameclose(ServiceLIneData, i, event) {
    let id = 'advanceBSSLPricingTypeSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.BSSLDetails[i].SLPricingTypeSwitchName = false;
      this.OdatanextLink = null;
      if (!this.BSSLDetails[i].selectedSLPricingType.some(res => res.SysGuid == ServiceLIneData.PricingTypeId && res.Name == ServiceLIneData.PricingTypeName)) {
        this.BSSLDetails[i].BSServiceLine.PricingTypeId = "";
        this.BSSLDetails[i].BSServiceLine.PricingTypeName = "";
        this.BSSLDetails[i].selectedSLPricingType = [];
      }
    }
  }

  changeBSSLPricingTypeData(selectedData, ServiceLIneData, i) {
    this.BSSLDetails[i].SLPricingTypeSwitchName = false;
    this.OdatanextLink = null;
    this.BSSLDetails[i].BSServiceLine.PricingTypeId = selectedData.SysGuid;
    this.BSSLDetails[i].BSServiceLine.PricingTypeName = selectedData.Name;
    this.BSSLDetails[i].selectedSLPricingType = new Array(Object.assign({}, selectedData));
  }



  OnBSPercTCVChange(ServiceLIneData, i, event) {

    let firstval: any = ServiceLIneData.WiproPercentageOftcv.substr(0, event.target.selectionStart)
    let secondval: any = ServiceLIneData.WiproPercentageOftcv.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;

    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  OnBSPercTCVBlur(ServiceLIneData, newValue, i) {
    if (this.acceptNegative == false) {
      let tempTCV: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
      if (tempTCV && tempTCV.length > 0 && tempTCV[0] && !this.isNaNCheck(tempTCV[0])) {
        if (tempTCV[0] <= 100 && tempTCV[0] > 0) {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
          let tempCalSLTCV: any = (this.businessSOlutionData[0].Sltcv) ? ((parseFloat(this.businessSOlutionData[0].Sltcv) * parseFloat(tempTCV[0])) / 100) : "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = tempCalSLTCV ? this.toFixedNoRounding(tempCalSLTCV, 2) : "";
          let sumofperc: any = this.BSSLDetails.reduce((prevVal, elem) => {
            if (!(elem.BSServiceLine.WiproDualCredit)) {
              let SLTCVperc: any = this.acceptNegative ? (elem.BSServiceLine.WiproPercentageOftcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproPercentageOftcv.toString()).match(this.positiveregex);
              return prevVal + (SLTCVperc && SLTCVperc.length > 0 && SLTCVperc[0] && !this.isNaNCheck(SLTCVperc[0]) ? parseFloat(SLTCVperc[0]) : 0);
            } else {
              return prevVal;
            }
          }, 0);
          if (parseFloat(sumofperc) > 100.05) {
            this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
            this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
            this.projectService.displayMessageerror("Total % of TCV should not be greater than 100%");
          }

        }
        else {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100 for the" + this.converIndextoString(i) + " row of service lines table");
        }

      } else {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
      }

      this.calculateCAValue();
    } else {
      this.OnBSPercTCVNegativeBlur(ServiceLIneData, newValue, i);
    }
  }

  OnBSPercTCVNegativeBlur(ServiceLIneData, newValue, i) {
    let tempTCV: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    if (tempTCV && tempTCV.length > 0 && !this.isNaNCheck(tempTCV[0])) {
      let tempSLTCV: any = (this.businessSOlutionData[0].Sltcv) ? ((parseFloat(this.businessSOlutionData[0].Sltcv) * parseFloat(tempTCV[0])) / 100).toFixed(2).toString() : "";
      if (!tempSLTCV) {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
      }
      else if (parseFloat(tempSLTCV) > this.maxDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("Est. SL TCV calculation for the given % of TCV should be less than " + this.maxDecimalValueDisplay + " for the" + this.converIndextoString(i) + " row of service lines table");
      } else if (parseFloat(tempSLTCV) < this.minDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("Est. SL TCV calculation for the given % of TCV should be greater than " + this.minDecimalValueDisplay + " for the" + this.converIndextoString(i) + " row of service lines table");
      }
      else {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = tempSLTCV;
        let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
          if (!(elem.BSServiceLine.WiproDualCredit)) {
            let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
            return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
          } else {
            return prevVal;
          }
        }, 0);

        let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
        if (sumofSLTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given % of TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (sumofSLTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given % of TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given % of TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given % of TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
      }
    } else {
      this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
      this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
    }

    this.calculateCAValue();
  }

  OnBSSLTCVChange(ServiceLIneData, i, event) {
    let firstval: any = ServiceLIneData.WiproEstsltcv.substr(0, event.target.selectionStart)
    let secondval: any = ServiceLIneData.WiproEstsltcv.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }

  }

  OnBSSLTCVBlur(ServiceLIneData, newValue, i) {
    let tempSLTCVValue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = tempSLTCVValue && tempSLTCVValue.length > 0 && tempSLTCVValue[0] && !this.isNaNCheck(tempSLTCVValue[0]) ? parseFloat(tempSLTCVValue[0]).toFixed(2).toString() : "";
    if (!ServiceLIneData.WiproDualCredit) {
      let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
        if (!(elem.BSServiceLine.WiproDualCredit)) {
          let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
          return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
        } else {
          return prevVal;
        }
      }, 0);

      let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
      if (sumofSLTCV > this.maxDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("SL TCV  in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
      }
      else if (sumofSLTCV < this.minDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("SL TCV  in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
      }
      else if (totalTCV > this.maxDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
      }
      else if (totalTCV < this.minDecimalValue) {
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
      }
      this.resetSLTCVandOverAllTCV()
    } else {
      this.calculateCAValue();
    }

  }

  TCVChangeonDulaCredit(ServiceLIneData, i) {
    if (!ServiceLIneData.WiproDualCredit) {
      this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = "";
      if (ServiceLIneData.WiproEstsltcv) {
        let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
          if (!(elem.BSServiceLine.WiproDualCredit)) {
            let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
            return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
          } else {
            return prevVal;
          }
        }, 0);

        let totalTCV: any = (this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (sumofSLTCV ? parseFloat(sumofSLTCV) : 0);
        if (sumofSLTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (sumofSLTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("SL TCV  in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV > this.maxDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
        else if (totalTCV < this.minDecimalValue) {
          this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
          this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given Est. SL TCV in " + this.converIndextoString(i) + " row of service lines table");
        }
      }
      this.resetSLTCVandOverAllTCV();
    } else {
      let tempSlDualCredit = this.BSDualCreditDD.filter(it => it.Id == ServiceLIneData.WiproDualCredit);
      this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = (tempSlDualCredit.length > 0) ? tempSlDualCredit[0].Name : "";
      this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
      this.resetSLTCVandOverAllTCV();
    }
  }

  addNewDualCreditSL() {
    this.service.loaderhome = true;
    let BSSLnamelength = this.BSSLDetails.length + 1;
    this.newBSSLDataCount = this.newBSSLDataCount + 1;
    let namelength = this.creditAllocationdataDetails.length + 1;
    this.newCADataCount = this.newCADataCount + 1;
    let uniqueSLCAID = Math.random().toString(36).substring(2);
    let BSSLObj: OrderserviceLineBSnterface = {
      wiproOrderid: this.OrderId,
      OpportunityId: this.OpportunityId,
      statecode: 0,
      SLCAID: uniqueSLCAID,
      Cloud: false,
      WiproDualCredit: 184450005,
      WiproEngagementModel: "",
      WiproEstsltcv: "",
      WiproOpportunityServicelineDetailId: "",
      WiproOpportunityServicelineOrderDetailId: "",
      WiproPercentageOftcv: "",
      WiproPracticeId: "",
      WiproServicelineidValue: "",
      WiproServicelineidValueName: "",
      WiproSlbdmidValueName: "",
      WiproSlbdmid: "",
      PricingTypeId : "",
      PricingTypeName : "",
      WiproSubpracticeid: "",
      WiproPracticeName: '',
      WiproSubpracticeName: '',
      WiproEngagementModelName: '',
      WiproDualCreditName: 'CIS-CRS Dual credit',
      AdditionalServiceLinesCloudDetails: []
    };

    let newCreditDetails: OrdercreditAllocationInterface = {
      SLCAID: uniqueSLCAID,
      ServicelineId: "",
      PracticeId: "",
      SubPracticeId: "",
      ServicelineBDMId: "",
      ServicelineBDMName: "",
      WiproIsDefault: true,
      WiproTypeId: 184450000,
      WiproValue: "",
      WiproOpportunityCreditAllocationID: "",
      WiproOrderCreditAllocationID: "",
      Contribution: "100.00",
      WiproOpportunityId: this.OpportunityId,
      wiproOrderid: this.OrderId,
      statecode: 0,
      WiproTypeName: 'Service Line',
      ServicelineName: "",
      PracticeName: "",
      SubPracticeName: "",
    };

    this.BSSLDetails.unshift(Object.assign({}, new OrderserviceLineBSDetails(BSSLObj, [], [],[],[], [], [], [],false, false, false, false, true, 0,
      "BSSLName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSubPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSlBDMName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPercTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSLTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSCloudName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPricingTypeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSEngagementName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSDualCreditName" + this.newBSSLDataCount + "NewData" + BSSLnamelength)));


    this.creditAllocationdataDetails.unshift(Object.assign({}, new OrdercreditAllocationDetails(newCreditDetails, [], [], [], [], false,
      "CredetType" + this.newCADataCount + "NewData" + namelength,
      "BDM" + this.newCADataCount + "NewData" + namelength,
      "SL" + this.newCADataCount + "NewData" + namelength,
      "Practice" + this.newCADataCount + "NewData" + namelength,
      "SubPractice" + this.newCADataCount + "NewData" + namelength,
      "Value" + this.newCADataCount + "NewData" + namelength,
      "Contribution" + this.newCADataCount + "NewData" + namelength)));
    this.service.loaderhome = false;
    this.userModifyFrm.form.markAsDirty();
  }



  addNewSL() {
    this.service.loaderhome = true;
    let BSSLnamelength = this.BSSLDetails.length + 1;
    this.newBSSLDataCount = this.newBSSLDataCount + 1;
    let namelength = this.creditAllocationdataDetails.length + 1;
    this.newCADataCount = this.newCADataCount + 1;
    let uniqueSLCAID = Math.random().toString(36).substring(2);

    let BSSLObj: OrderserviceLineBSnterface = {
      wiproOrderid: this.OrderId,
      OpportunityId: this.OpportunityId,
      statecode: 0,
      SLCAID: uniqueSLCAID,
      Cloud: false,
      WiproDualCredit: "",
      WiproEngagementModel: "",
      WiproEstsltcv: "",
      WiproOpportunityServicelineDetailId: "",
      WiproOpportunityServicelineOrderDetailId: "",
      WiproPercentageOftcv: "",
      WiproPracticeId: "",
      WiproServicelineidValue: "",
      WiproServicelineidValueName: "",
      WiproSlbdmidValueName: "",
      WiproSlbdmid: "",
      PricingTypeId : "",
      PricingTypeName : "",
      WiproSubpracticeid: "",
      WiproPracticeName: '',
      WiproSubpracticeName: '',
      WiproEngagementModelName: '',
      WiproDualCreditName: '',
      AdditionalServiceLinesCloudDetails: []
    };

    let newCreditDetails: OrdercreditAllocationInterface = {
      SLCAID: uniqueSLCAID,
      ServicelineId: "",
      PracticeId: "",
      SubPracticeId: "",
      ServicelineBDMId: "",
      ServicelineBDMName: "",
      WiproIsDefault: true,
      WiproTypeId: 184450000,
      WiproValue: "",
      WiproOpportunityCreditAllocationID: "",
      WiproOrderCreditAllocationID: "",
      Contribution: "100.00",
      WiproOpportunityId: this.OpportunityId,
      wiproOrderid: this.OrderId,
      statecode: 0,
      WiproTypeName: 'Service Line',
      ServicelineName: "",
      PracticeName: "",
      SubPracticeName: "",
    };

    this.BSSLDetails.unshift(Object.assign({}, new OrderserviceLineBSDetails(BSSLObj, [],[],[], [], [], [], [], false,false, false, false, false, 0,
      "BSSLName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSubPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSlBDMName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPercTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSLTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSCloudName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPricingTypeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSEngagementName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSDualCreditName" + this.newBSSLDataCount + "NewData" + BSSLnamelength)));


    this.creditAllocationdataDetails.unshift(Object.assign({}, new OrdercreditAllocationDetails(newCreditDetails, [], [], [], [], false,
      "CredetType" + this.newCADataCount + "NewData" + namelength,
      "BDM" + this.newCADataCount + "NewData" + namelength,
      "SL" + this.newCADataCount + "NewData" + namelength,
      "Practice" + this.newCADataCount + "NewData" + namelength,
      "SubPractice" + this.newCADataCount + "NewData" + namelength,
      "Value" + this.newCADataCount + "NewData" + namelength,
      "Contribution" + this.newCADataCount + "NewData" + namelength)));
    this.service.loaderhome = false;
    this.userModifyFrm.form.markAsDirty();
  }

  deletBSSLValidation(ServiceLIneData, searchText, i) {
    if (this.BSSLDetails.length <= 1) {
      this.projectService.displayMessageerror("Single service line cannot be deleted.");
      return;
    }
    else {
      this.openDialogDelete("If you delete service line, Related Multiple BDM record will delete. Are you sure you want to delete record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be deleted from the Opportunity and Order Booking screens", "Confirm", "Delete service line").subscribe(res => {
        if (res == 'save') {
          if (ServiceLIneData.WiproOpportunityServicelineDetailId || ServiceLIneData.WiproOpportunityServicelineOrderDetailId) {
            this.deleteServiceLIneArray.push(Object.assign({}, this.BSSLDetails[i]));
          }
          this.BSSLDetails.splice(i, 1);
          this.userModifyFrm.form.markAsDirty();
          this.deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i);
        }
      });
    }

  }

  deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i) {
    let newcreditAllocation: any = [];
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.SLCAID == ServiceLIneData.SLCAID && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == true) {
        if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
          this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      }
      else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID || this.creditAllocationdataDetails[ca].creditAllocation.WiproOrderCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else {
        newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
      }

    }


    this.creditAllocationdataDetails = newcreditAllocation.map(it => { return Object.assign({}, it) });
    this.createCASLPracSubPracDD();
    this.resetSLTCVandOverAllTCV();
    if (ServiceLIneData.WiproOpportunityServicelineDetailId || ServiceLIneData.WiproOpportunityServicelineOrderDetailId) {
      this.projectService.throwError("Service line added for deletion successfully, please save the data");
    } else {
      this.projectService.throwError("Service line deleted successfully");
    }



  }






  resetSLTCVandOverAllTCV() {
    let sumofSLTCV: any = this.BSSLDetails.reduce((prevVal, elem) => {
      if (!(elem.BSServiceLine.WiproDualCredit)) {
        let SLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
        return prevVal + (SLTCV && SLTCV.length > 0 && SLTCV[0] && !this.isNaNCheck(SLTCV[0]) ? parseFloat(SLTCV[0]) : 0);
      } else {
        return prevVal;
      }
    }, 0);
    this.businessSOlutionData[0].Sltcv = parseFloat(sumofSLTCV).toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();

    for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
      if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
        let tempSliTCV: any = (this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].Sltcv != "0.00" && this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) ? ((parseFloat(this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) * 100) / parseFloat(this.businessSOlutionData[0].Sltcv)).toString() : "";
        this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv = tempSliTCV ? parseFloat(tempSliTCV).toFixed(2).toString() : "";
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != '0.00' && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = (tempSolValue && parseFloat(tempSolValue) >= this.minDecimalValue && parseFloat(tempSolValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) ? parseFloat(tempSolValue).toFixed(2).toString() : "";
        if (!this.SolutionDetails[sol].solutions.WiproValue) {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = ""
        }
      } else {
        if (parseFloat(this.SolutionDetails[sol].solutions.WiproValue) >= this.minDecimalValue && parseFloat(this.SolutionDetails[sol].solutions.WiproValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) {
          let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00" && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
        } else {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = "";
          this.SolutionDetails[sol].solutions.WiproValue = "";
        }
      }

    }

    this.calculateCAValue();
  }

  //**************************************************************Service Line Methods Ends***************************************************/
  //**************************************************************IP Methods Starts***************************************************/

  createIpStructure(IporiginalDetails) {
    this.IpDetails = [];
    this.deleteIPArray = [];
    let IPlength = IporiginalDetails.length;
    for (let i = 0; i < IporiginalDetails.length; i++) {
      let cloudTCV: any = 0;
      let OrderIporiginalDetails: any = {};
      let tempWiproOpportunityIpId = IporiginalDetails[i].WiproOpportunityIpId ? IporiginalDetails[i].WiproOpportunityIpId : "";
      OrderIporiginalDetails.OpportunityId = this.OpportunityId;
      OrderIporiginalDetails.wiproOrderid = this.OrderId;
      OrderIporiginalDetails.OrderIpId = IporiginalDetails[i].OrderIpId ? IporiginalDetails[i].OrderIpId : "";
      OrderIporiginalDetails.WiproAmcvalue = IporiginalDetails[i].WiproAmcvalue ? (parseFloat(IporiginalDetails[i].WiproAmcvalue).toFixed(2)).toString() : "";
      OrderIporiginalDetails.WiproCloud = IporiginalDetails[i].WiproCloud ? JSON.parse(IporiginalDetails[i].WiproCloud) : false;
      OrderIporiginalDetails.WiproHolmesbdmID = IporiginalDetails[i].WiproHolmesbdmID ? IporiginalDetails[i].WiproHolmesbdmID : "";
      OrderIporiginalDetails.WiproHolmesbdmName = IporiginalDetails[i].WiproHolmesbdmName ? IporiginalDetails[i].WiproHolmesbdmName : "";
      OrderIporiginalDetails.WiproSlbdmName = IporiginalDetails[i].WiproSlbdmName ? IporiginalDetails[i].WiproSlbdmName : "";
      OrderIporiginalDetails.WiproSlbdmValue = IporiginalDetails[i].WiproSlbdmValue ? IporiginalDetails[i].WiproSlbdmValue : "";
      OrderIporiginalDetails.PricingTypeId = IporiginalDetails[i].PricingTypeId ? IporiginalDetails[i].PricingTypeId : "";
      OrderIporiginalDetails.PricingTypeName = IporiginalDetails[i].PricingTypeName ? IporiginalDetails[i].PricingTypeName : "";
      OrderIporiginalDetails.IpId = IporiginalDetails[i].IpId ? IporiginalDetails[i].IpId : "";
      OrderIporiginalDetails.WiproLicenseValue = IporiginalDetails[i].WiproLicenseValue ? (parseFloat(IporiginalDetails[i].WiproLicenseValue).toFixed(2)).toString() : "";
      OrderIporiginalDetails.WiproModuleValue = IporiginalDetails[i].WiproModuleValue ? IporiginalDetails[i].WiproModuleValue : "";
      OrderIporiginalDetails.WiproModuleName = IporiginalDetails[i].WiproModuleName ? IporiginalDetails[i].WiproModuleName : "";
      OrderIporiginalDetails.IpName = IporiginalDetails[i].IpName ? IporiginalDetails[i].IpName : "";
      OrderIporiginalDetails.WiproPractice = IporiginalDetails[i].WiproPractice ? IporiginalDetails[i].WiproPractice : "";
      OrderIporiginalDetails.WiproServiceline = IporiginalDetails[i].WiproServiceline ? IporiginalDetails[i].WiproServiceline : "";
      OrderIporiginalDetails.WiproModuleContactId = IporiginalDetails[i].WiproModuleContactId ? IporiginalDetails[i].WiproModuleContactId : "";
      OrderIporiginalDetails.WiproModuleContactIdName = IporiginalDetails[i].WiproModuleContactIdName ? IporiginalDetails[i].WiproModuleContactIdName : "";
      OrderIporiginalDetails.WiproServicelineName = IporiginalDetails[i].WiproServicelineName ? IporiginalDetails[i].WiproServicelineName : "";
      OrderIporiginalDetails.WiproPracticeName = IporiginalDetails[i].WiproPracticeName ? IporiginalDetails[i].WiproPracticeName : "";

      if (this.ModificationId && this.ModificationOBAllocation) {
        OrderIporiginalDetails.statecode = (IporiginalDetails[i].WiproOpportunityIpId) ? 2 : 0;
        OrderIporiginalDetails.WiproOpportunityIpId = IporiginalDetails[i].WiproOpportunityIpId ? IporiginalDetails[i].WiproOpportunityIpId : "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 2, OrderIPId: OrderIporiginalDetails.WiproOpportunityIpId })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 2 })
        })
        ) : [];
      }
      else {
        OrderIporiginalDetails.statecode = 0;
        OrderIporiginalDetails.WiproOpportunityIpId = "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 0, OrderIPId: '', wipro_orderipadditionaldetailid: '' })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '' })
        })
        ) : [];
      }

      let HolmesDisabled = IporiginalDetails[i].disableHolmesBDM ? IporiginalDetails[i].disableHolmesBDM : false;
      let ModuleDisabled = IporiginalDetails[i].disableModule ? IporiginalDetails[i].disableModule : false;
      let selectedIP = (OrderIporiginalDetails.IpId && OrderIporiginalDetails.IpName) ? [
        {
          name: OrderIporiginalDetails.IpName,
          productid: OrderIporiginalDetails.IpId,
          ProductTypeCodeName: '',
          productcode: HolmesDisabled ? '' : '4',
          OwnerIdValue: '',
          OwnerName: '',
          ModuleCount: ModuleDisabled ? 0 : 1,
          Id: OrderIporiginalDetails.IpId
        }
      ] : [];



      let selectedModule = (OrderIporiginalDetails.IpId && OrderIporiginalDetails.WiproModuleValue && OrderIporiginalDetails.WiproModuleName) ? [{
        WiproProductModuleId: OrderIporiginalDetails.WiproModuleValue,
        ModuleName: OrderIporiginalDetails.WiproModuleName,
        OwnerId: OrderIporiginalDetails.WiproModuleContactId,
        OwnerName: OrderIporiginalDetails.WiproModuleContactIdName,
        Id: OrderIporiginalDetails.WiproModuleValue
      }] : [];


      let selectedIPSLBDM = (OrderIporiginalDetails.WiproSlbdmName && OrderIporiginalDetails.WiproSlbdmValue) ? (new Array(Object.assign({
        SysGuid: OrderIporiginalDetails.WiproSlbdmValue,
        Name: OrderIporiginalDetails.WiproSlbdmName,
        EmailID: '',
        Id: OrderIporiginalDetails.WiproSlbdmValue
      }))) : [];

      let selectedIPPricingType = (OrderIporiginalDetails.PricingTypeName && OrderIporiginalDetails.PricingTypeId) ? (new Array(Object.assign({
        SysGuid: OrderIporiginalDetails.PricingTypeId,
        Name: OrderIporiginalDetails.PricingTypeName,
        Code: '',
        Id: OrderIporiginalDetails.PricingTypeId
      }))) : [];

      let IpNameDD = [];
      let selectedHomesBDM = (OrderIporiginalDetails.WiproHolmesbdmID && OrderIporiginalDetails.WiproHolmesbdmName) ? [{ Id: OrderIporiginalDetails.WiproHolmesbdmID, Name: OrderIporiginalDetails.WiproHolmesbdmName, SysGuid: OrderIporiginalDetails.WiproHolmesbdmID, EmailID: '' }] : [];
      let IpHolmesDD = [];
      let ModuleDD = [];
      let PracticeDD = (OrderIporiginalDetails.WiproServiceline) ? (this.allPracticeDD.filter(it => it.ServiceLineId == OrderIporiginalDetails.WiproServiceline).map(obj => {
        return Object.assign({
          SysGuid: obj.Id,
          Name: obj.Name,
          IsVisible: obj.IsVisible
        })
      })) : [];
      if(OrderIporiginalDetails.WiproPractice){
        if(PracticeDD.some(it=> it.SysGuid == OrderIporiginalDetails.WiproPractice) == false){
          let tempPractice = this.allPracticeDD.filter(it => it.Id == OrderIporiginalDetails.WiproPractice);
          if( tempPractice.length > 0){
            PracticeDD.push(Object.assign({
              SysGuid: tempPractice[0].Id,
              Name: tempPractice[0].Name,
              IsVisible: false,
            }))
          }
        }
      }
      let slBDMDD = [];

      if (tempWiproOpportunityIpId != "") {
        this.PushToIpArray(OrderIporiginalDetails, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, cloudTCV, i, ModuleDisabled, HolmesDisabled, IPlength, tempWiproOpportunityIpId);
      } else {
        this.PushToIpArrayForSmartSearch(OrderIporiginalDetails, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, cloudTCV, i, ModuleDisabled, HolmesDisabled, IPlength, tempWiproOpportunityIpId);
      }

    }


    if (IPlength == 0) {
      this.IpLoader = false;
    }
  }

  // getIpPracticeandSLBDM(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength) {

  //   if (IporiginalDetailsObj.WiproServiceline) {
  //     this.projectService.getIpPractice(IporiginalDetailsObj.WiproServiceline).subscribe(res => {
  //       PracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //       this.getLoadIPSLBDMData(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength);
  //     },
  //       err => {
  //         if (IporiginalDetailsObj.WiproOpportunityIpId != "") {
  //           this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength);
  //         } else {
  //           this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength);
  //         }
  //       });
  //   } else {
  //     if (IporiginalDetailsObj.WiproOpportunityIpId != "") {
  //       this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength);
  //     } else {
  //       this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength);
  //     }
  //   }

  // }

  // getLoadIPSLBDMData(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength, tempWiproOpportunityIpId) {
  //   this.projectService.getIpSLBDM(IporiginalDetailsObj.WiproServiceline, IporiginalDetailsObj.WiproPractice).subscribe(res => {
  //     slBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //     if (tempWiproOpportunityIpId != "") {
  //       this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength, tempWiproOpportunityIpId);
  //     } else {
  //       this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength, tempWiproOpportunityIpId);
  //     }
  //   },
  //     err => {
  //       if (tempWiproOpportunityIpId != "") {
  //         this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength, tempWiproOpportunityIpId);
  //       } else {
  //         this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, i, HolmesDisabled, Iplength, tempWiproOpportunityIpId);
  //       }
  //     });
  // }

  PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, cloudTCV, i, ModuleDisabled, HolmesDisabled, Iplength, tempWiproOpportunityIpId) {
    this.IpDetails.push(Object.assign({}, new OrderIpDetails(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD,[], IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, false, false,false, false, false, false, ModuleDisabled, HolmesDisabled, cloudTCV,
      "IPName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpModuleName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpSLName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpPracticeName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpSLBDMName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpPricingTypeName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpLicenceValueName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpAMCValueName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpCloudName" + i + "SavedData" + tempWiproOpportunityIpId,
      "IpHomesBDMName" + i + "SavedData" + tempWiproOpportunityIpId)));

    if (i == (Iplength - 1)) {
      this.IpLoader = false;
    }
  }

  PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, cloudTCV, i, ModuleDisabled, HolmesDisabled, Iplength, tempWiproOpportunityIpId) {
    let Ipnamelength = this.IpDetails.length + 1;
    this.newIpDataCount = this.newIpDataCount + 1;
    this.IpDetails.push(Object.assign({}, new OrderIpDetails(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD,[], IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, false,false, false, false, false, false, ModuleDisabled, HolmesDisabled, cloudTCV,
      "IPName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpModuleName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPracticeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLBDMName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPricingTypeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpLicenceValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAMCValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpCloudName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpHomesBDMName" + this.newIpDataCount + "NewData" + Ipnamelength)));

    if (i == (Iplength - 1)) {
      this.IpLoader = false;
    }
  }


  DealPricingChange(solutionData,i){
    if(solutionData.IsDealRegistered === true){
    this.OrderdealRegistered(solutionData,i);
    }else if(solutionData.IsDealRegistered === false){
    this.OrderdealNotRegistered(solutionData,i);
    }
      }
    
      OrderdealRegistered(solutionData,i){
        let dialogRef = this.dialog.open(OrderdealRegisteredYesPopup, {
          width: '920px',
          data: { type: 'mod', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: solutionData, disableOnRoleBSSolution: this.disableOnRoleBSSolution }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.dealYesdirtyflag == true) {
              this.userModifyFrm.form.markAsDirty();
            }
            this.SolutionDetails[i].solutions.DealRegistrationYes = result.DealRegistrationYes;
          }
        });
      }
      OrderdealNotRegistered(solutionData,i){
        let dialogRef = this.dialog.open(OrderdealRegisteredNoPopup, {
          width: '650px',
          data: { type: 'mod', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: solutionData, disableOnRoleBSSolution: this.disableOnRoleBSSolution }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.dealNodirtyflag == true) {
              this.userModifyFrm.form.markAsDirty();
            }
            this.SolutionDetails[i].solutions.DealRegistrationNo = result.DealRegistrationNo;
          }
        });
      }

  navigatetoIPCloud(IpData, i, CloudDisabled) {

    // commented as new popup is added as per requirement
    if (!CloudDisabled) {
      // this.projectService.setSession("IPObjForCloud", { Details: IpData, OverAllTCV: this.OverALLSavedTCV });
      // this.router.navigate(['/opportunity/ipadditionaldetails']);
      const dialogRef = this.dialog.open(OrderOpenIP,
        {
          width: '900px',
          data: { type: 'mod', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: IpData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, WTFlag: this.WTFlag, disableOnRoleBSIp: this.disableOnRoleBSIp }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.clouddirtyflag == true) {
            this.userModifyFrm.form.markAsDirty();
          }
          this.IpDetails[i].CloudTCV = result.cloudTCV ? parseFloat(result.cloudTCV) : 0;
          this.IpDetails[i].IP.CloudDetails = result.cloudData ? result.cloudData : [];
          this.IpDetails[i].IP.AdditionalSLDetails = result.additionalIpData ? result.additionalIpData : [];
          if (this.IpDetails[i].IP.CloudDetails.filter(it => it.CloudStatecode != 1).length == 0) {
            this.IpDetails[i].IP.WiproCloud = false;
          } else {
            this.IpDetails[i].IP.WiproCloud = true;
          }
        } else {
          this.IpDetails[i].IP.WiproCloud = false;
          this.IpDetails[i].CloudTCV = 0;
        }
      });

    } else {
      this.projectService.displayMessageerror("Please save this IP then proceed with the action");
    }
  }
  getIpPracticeData(IpData, i) {
    this.IpDetails[i].IpslBDMDD = [];
    this.IpDetails[i].IP.WiproPractice = "";
    this.IpDetails[i].IP.WiproPracticeName = "";
    this.IpDetails[i].IP.WiproSlbdmValue = "";
    this.IpDetails[i].IP.WiproSlbdmName = "";
    this.IpDetails[i].selectedIPSLBDM = [];
    if (IpData.WiproServiceline) {
      let tempIpSL = this.IpandServiceLinelDD.filter(it => it.SysGuid == IpData.WiproServiceline);
      this.IpDetails[i].IP.WiproServicelineName = (tempIpSL.length > 0) ? tempIpSL[0].Name : "";
      this.IpDetails[i].IppracticeDD = this.allPracticeDD.filter(it => it.ServiceLineId == IpData.WiproServiceline).map(obj => {
        return Object.assign({
          SysGuid: obj.Id,
          Name: obj.Name,
          IsVisible: obj.IsVisible,
        })
      });

      if (this.IpDetails[i].IppracticeDD.length == 0) {
        this.getIpSlBDMData(IpData, i, "");
      }


    }
    else {
      this.IpDetails[i].IP.WiproServicelineName = "";
      this.IpDetails[i].IppracticeDD = [];
    }
  }


  checkForCloud(IpData, i, disabled) {
    console.log("asd", IpData.WiproCloud);
    if (disabled == false && this.disableOnRoleBSIp == false) {
      if (IpData.WiproCloud == false) {
        if ((IpData.CloudDetails.filter(it => it.CloudStatecode != 1)).length <= 0) {
          setTimeout(() => {
            this.IpDetails[i].IP.WiproCloud = false;
          })
          this.projectService.displayMessageerror("There are no cloud details present for " + this.converIndextoString(i) + " row of IP table, Please add the cloud then proceed with the action");
        } else {
          setTimeout(() => {
            this.IpDetails[i].IP.WiproCloud = true;
          })

        }
      }
    }
  }

  checkAMCValue(IpData, i, event) {
    let firstval: any = IpData.WiproAmcvalue.substr(0, event.target.selectionStart)
    let secondval: any = IpData.WiproAmcvalue.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }

  }

  checkLicenceValue(IpData, i, event) {
    let firstval: any = IpData.WiproLicenseValue.substr(0, event.target.selectionStart)
    let secondval: any = IpData.WiproLicenseValue.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  sumIpTCVLV(IpData, newValue, i) {
    let tempLicenceValue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    this.IpDetails[i].IP.WiproLicenseValue = tempLicenceValue && tempLicenceValue.length > 0 && tempLicenceValue[0] && !this.isNaNCheck(tempLicenceValue[0]) ? parseFloat(tempLicenceValue[0]).toFixed(2).toString() : "";
    let sumofIPTCV: any = this.IpDetails.reduce((prevVal, elem) => {
      let WiproAMC: any = this.acceptNegative ? (elem.IP.WiproAmcvalue.toString()).match(this.negativeregex) : (elem.IP.WiproAmcvalue.toString()).match(this.positiveregex);
      let LicenceValue: any = this.acceptNegative ? (elem.IP.WiproLicenseValue.toString()).match(this.negativeregex) : (elem.IP.WiproLicenseValue.toString()).match(this.positiveregex);
      return prevVal + (LicenceValue && LicenceValue.length > 0 && LicenceValue[0] && !this.isNaNCheck(LicenceValue[0]) ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC && WiproAMC.length > 0 && WiproAMC[0] && !this.isNaNCheck(WiproAMC[0]) ? parseFloat(WiproAMC[0]) : 0);
    }, 0);

    let totalTCV: any = (sumofIPTCV ? parseFloat(sumofIPTCV) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0);

    if (sumofIPTCV > this.maxDecimalValue) {
      this.IpDetails[i].IP.WiproLicenseValue = "";
      this.projectService.displayMessageerror("IP TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given license value in " + this.converIndextoString(i) + " row of ip table");
    } else if (sumofIPTCV < this.minDecimalValue) {
      this.IpDetails[i].IP.WiproLicenseValue = "";
      this.projectService.displayMessageerror("IP TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given license value in " + this.converIndextoString(i) + " row of ip table");
    } else if (totalTCV > this.maxDecimalValue) {
      this.IpDetails[i].IP.WiproLicenseValue = "";
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given license value in " + this.converIndextoString(i) + " row of ip table");
    } else if (totalTCV < this.minDecimalValue) {
      this.IpDetails[i].IP.WiproLicenseValue = "";
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given license value in " + this.converIndextoString(i) + " row of ip table");
    }

    this.resetIPTCVandOverAllTCV();
    // this.calculateCAValueVericalGeo();
  }

  sumIpTCVAMC(IpData, newValue, i) {
    let tempAMC: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    this.IpDetails[i].IP.WiproAmcvalue = tempAMC && tempAMC.length > 0 && tempAMC[0] && !this.isNaNCheck(tempAMC[0]) ? parseFloat(tempAMC[0]).toFixed(2).toString() : "";
    let sumofIPTCV: any = this.IpDetails.reduce((prevVal, elem) => {
      let WiproAMC: any = this.acceptNegative ? (elem.IP.WiproAmcvalue.toString()).match(this.negativeregex) : (elem.IP.WiproAmcvalue.toString()).match(this.positiveregex);
      let LicenceValue: any = this.acceptNegative ? (elem.IP.WiproLicenseValue.toString()).match(this.negativeregex) : (elem.IP.WiproLicenseValue.toString()).match(this.positiveregex);
      return prevVal + (LicenceValue && LicenceValue.length > 0 && LicenceValue[0] && !this.isNaNCheck(LicenceValue[0]) ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC && WiproAMC.length > 0 && WiproAMC[0] && !this.isNaNCheck(WiproAMC[0]) ? parseFloat(WiproAMC[0]) : 0);
    }, 0);

    let totalTCV: any = (sumofIPTCV ? parseFloat(sumofIPTCV) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0);

    if (sumofIPTCV > this.maxDecimalValue) {
      this.IpDetails[i].IP.WiproAmcvalue = "";
      this.projectService.displayMessageerror("IP TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the given AMC value in " + this.converIndextoString(i) + " row of ip table");
    } else if (sumofIPTCV < this.minDecimalValue) {
      this.IpDetails[i].IP.WiproAmcvalue = "";
      this.projectService.displayMessageerror("IP TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given AMC value in " + this.converIndextoString(i) + " row of ip table");
    } else if (totalTCV > this.maxDecimalValue) {
      this.IpDetails[i].IP.WiproAmcvalue = "";
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be less than " + this.maxDecimalValueDisplay + " for the AMC license value in " + this.converIndextoString(i) + " row of ip table");
    } else if (totalTCV < this.minDecimalValue) {
      this.IpDetails[i].IP.WiproAmcvalue = "";
      this.projectService.displayMessageerror("Overall TCV in business solution panel should be greater than " + this.minDecimalValueDisplay + " for the given AMC value in " + this.converIndextoString(i) + " row of ip table");
    }

    this.resetIPTCVandOverAllTCV();
    // this.calculateCAValueVericalGeo();

  }

  onIPPracticeChange(IpData, i) {
    if (IpData.WiproPractice) {
      this.getIpSlBDMData(IpData, i, "");
    } else {
      this.IpDetails[i].IP.WiproSlbdmValue = "";
      this.IpDetails[i].IP.WiproSlbdmName = "";
      this.IpDetails[i].selectedIPSLBDM = [];
      this.IpDetails[i].IpslBDMDD = [];
    }
  }


  getIpSlBDMData(IpData, i, searchValue) {
    this.IpDetails[i].IP.WiproSlbdmValue = "";
    this.IpDetails[i].IP.WiproSlbdmName = "";
    this.IpDetails[i].selectedIPSLBDM = [];
    let tempIPpractice = this.IpDetails[i].IppracticeDD.filter(it => it.SysGuid == IpData.WiproPractice);
    this.IpDetails[i].IP.WiproPracticeName = (tempIPpractice.length > 0) ? tempIPpractice[0].Name : "";
    this.addIPservice.getSLBDMDropDownList1(IpData.WiproServiceline, IpData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.IpDetails[i].IpslBDMDD = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      if (this.IpDetails[i].IpslBDMDD.length == 1) {
        this.IpDetails[i].IP.WiproSlbdmValue = this.IpDetails[i].IpslBDMDD[0].SysGuid;
        this.IpDetails[i].IP.WiproSlbdmName = this.IpDetails[i].IpslBDMDD[0].Name;
        this.IpDetails[i].selectedIPSLBDM = new Array(Object.assign({}, this.IpDetails[i].IpslBDMDD[0]));
      }
    },
      err => {
        this.IpDetails[i].IpslBDMDD = [];
      });

  }

  OnChangegetBSIPSlBDMData(IpData, i, searchValue) {
    this.addIPservice.getSLBDMDropDownList1(IpData.WiproServiceline, IpData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.IpDetails[i].IpslBDMDD = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !searchValue && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IpslBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getIPSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServiceline, rowData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfBSIPSLBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.IpDetails[i].IpSLBDMNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {

      this.IpDetails[i].IP.WiproSlbdmValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.IpDetails[i].IP.WiproSlbdmName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.IpDetails[i].selectedIPSLBDM = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {

      if (!this.IpDetails[i].selectedIPSLBDM.some(res => res.SysGuid == rowData.WiproSlbdmValue && res.Name == rowData.WiproSlbdmName)) {
        this.IpDetails[i].IP.WiproSlbdmValue = "";
        this.IpDetails[i].IP.WiproSlbdmName = "";
        this.IpDetails[i].selectedIPSLBDM = [];

      }
    }

  }

  getIPSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServiceline, rowData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? ([{
        'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
        'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
        'EmailID': this.VSOEmailId,
        'Id': this.modifyOrderDetailsObj.currentOrderVSOId
      }]) : SLBDMresp;
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  IpSlbdmclose(IpData, i, event) {
    // event.relatedTarget
    let id = 'advanceIPSLBDMSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.IpDetails[i].IpSLBDMNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.IpDetails[i].selectedIPSLBDM.some(res => res.SysGuid == IpData.WiproSlbdmValue && res.Name == IpData.WiproSlbdmName)) {
        this.IpDetails[i].IP.WiproSlbdmValue = "";
        this.IpDetails[i].IP.WiproSlbdmName = "";
        this.IpDetails[i].selectedIPSLBDM = [];
      }
    }
    // data.bdmNameSwitch = false;
  }

  changeIpSlBDMData(selectedData, IpData, i) {
    this.IpDetails[i].IpSLBDMNameSwitch = false;
    this.OdatanextLink = null;
    this.IpDetails[i].IP.WiproSlbdmValue = selectedData.SysGuid;
    this.IpDetails[i].IP.WiproSlbdmName = selectedData.Name;
    this.IpDetails[i].selectedIPSLBDM = new Array(Object.assign({}, selectedData));
  }


  OnChangegetBSIPPricingTypeData(IpData, i, searchValue) {
    this.addIPservice.getPricingTypeList(searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
    
      this.IpDetails[i].IPPricingTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IPPricingTypeDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getIPPricingTypeDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getPricingTypeList(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  OnCloseOfBSIPPricingTypePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.IpDetails[i].IPPricingTypeSwitchName = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.IpDetails[i].IP.PricingTypeName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.IpDetails[i].IP.PricingTypeId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.IpDetails[i].selectedIPPricingType = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {
      if (!this.IpDetails[i].selectedIPPricingType.some(res => res.Name == rowData.PricingTypeName && res.SysGuid == rowData.PricingTypeId)) {
        this.IpDetails[i].IP.PricingTypeName = "";
        this.IpDetails[i].IP.PricingTypeId = "";
        this.IpDetails[i].selectedIPPricingType = [];

      }
    }
  }



  getIPPricingTypeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getPricingTypeList(emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  BSIPPricingTypeNameclose(IpData, i, event) {
    let id = 'advanceBSIPPricingTypeSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.IpDetails[i].IPPricingTypeSwitchName = false;
      this.OdatanextLink = null;
      if (!this.IpDetails[i].selectedIPPricingType.some(res => res.SysGuid == IpData.PricingTypeId && res.Name == IpData.PricingTypeName)) {
        this.IpDetails[i].IP.PricingTypeId = "";
        this.IpDetails[i].IP.PricingTypeName = "";
        this.IpDetails[i].selectedIPPricingType = [];
      }
    }
  }

  changeBSIPPricingTypeData(selectedData, IpData, i) {
    this.IpDetails[i].IPPricingTypeSwitchName = false;
    this.OdatanextLink = null;
    this.IpDetails[i].IP.PricingTypeId = selectedData.SysGuid;
    this.IpDetails[i].IP.PricingTypeName = selectedData.Name;
    this.IpDetails[i].selectedIPPricingType = new Array(Object.assign({}, selectedData));
  }


  setpricingTypeSL(ServiceLIneData,i) {
    let selectedPricingType = this.pricingTypes.filter(it => it.Id == ServiceLIneData.PricingTypeId);
    this.BSSLDetails[i].BSServiceLine.PricingTypeName = selectedPricingType.length > 0 ? selectedPricingType[0].Name : '';
    // this.checkTolerenceonChange();
  }

  setpricingTypeIP(IpData,i) {
    let selectedPricingType = this.pricingTypes.filter(it => it.Id == IpData.PricingTypeId);
    this.IpDetails[i].IP.PricingTypeName = selectedPricingType.length > 0 ? selectedPricingType[0].Name : '';
    // this.checkTolerenceonChange();
  }


  IpNameclose(IpData, i, event) {
    // event.relatedTarget
    console.log("Nameevent", event);
    let id = 'advanceIPSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.IpDetails[i].IpNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.IpDetails[i].selectedIP.some(res => res.productid == IpData.IpId && res.name == IpData.IpName)) {
        this.IpDetails[i].IP.IpName = "";
        this.IpDetails[i].IP.IpId = "";
        this.IpDetails[i].IP.WiproModuleName = "";
        this.IpDetails[i].IP.WiproModuleValue = "";
        this.IpDetails[i].IP.WiproHolmesbdmID = "";
        this.IpDetails[i].IP.WiproHolmesbdmName = "";
        this.IpDetails[i].IP.WiproModuleContactId = "";
        this.IpDetails[i].IP.WiproModuleContactIdName = "";
        this.IpDetails[i].IpModuleDD = [];
        this.IpDetails[i].IpHolmesDD = [];
        this.IpDetails[i].selectedIP = [];
        this.IpDetails[i].selectedModule = [];
        this.IpDetails[i].selectedHomesBDM = [];
        this.IpDetails[i].HolmesDisable = true;
        this.IpDetails[i].ModuleDisabled = true;
      }
    }
    // data.bdmNameSwitch = false;
  }

  getIpNameData(IpData, searchText, i) {

    this.addIPservice.getIPDropDownList(null, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      console.log("IP1", res);
      this.IpDetails[i].IpNameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IpNameDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  getIPDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPDropDownList(null, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfIPPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.IpDetails[i].IpNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      let productCode = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].productcode : "";
      let ModuleCount = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].ModuleCount : 0;
      this.IpDetails[i].IP.IpName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].name : "";
      this.IpDetails[i].IP.IpId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].productid : "";
      this.IpDetails[i].selectedIP = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];
      this.IpDetails[i].HolmesDisable = (productCode == "4") ? false : true;
      this.IpDetails[i].ModuleDisabled = (ModuleCount > 0) ? false : true;
      this.IpDetails[i].IP.WiproModuleName = "";
      this.IpDetails[i].IP.WiproModuleValue = "";
      this.IpDetails[i].selectedModule = [];
      this.IpDetails[i].selectedHomesBDM = [];
      this.IpDetails[i].IP.WiproModuleContactId = "";
      this.IpDetails[i].IP.WiproModuleContactIdName = "";
      this.IpDetails[i].IP.WiproHolmesbdmID = "";
      this.IpDetails[i].IP.WiproHolmesbdmName = "";
      this.IpDetails[i].IpModuleDD = [];
      this.IpDetails[i].IpHolmesDD = [];

    } else {

      if (!this.IpDetails[i].selectedIP.some(res => res.productid == rowData.IpId && res.name == rowData.IpName)) {
        this.IpDetails[i].IP.IpName = "";
        this.IpDetails[i].IP.IpId = "";
        this.IpDetails[i].selectedIP = [];
        this.IpDetails[i].HolmesDisable = true;
        this.IpDetails[i].ModuleDisabled = true;
        this.IpDetails[i].IP.WiproModuleName = "";
        this.IpDetails[i].IP.WiproModuleValue = "";
        this.IpDetails[i].selectedModule = [];
        this.IpDetails[i].selectedHomesBDM = [];
        this.IpDetails[i].IP.WiproModuleContactId = "";
        this.IpDetails[i].IP.WiproModuleContactIdName = "";
        this.IpDetails[i].IP.WiproHolmesbdmID = "";
        this.IpDetails[i].IP.WiproHolmesbdmName = "";
        this.IpDetails[i].IpModuleDD = [];
        this.IpDetails[i].IpHolmesDD = [];

      }
    }


  }

  getIPDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getIPDropDownList(null, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  changeIpNameData(selectedData, IpData, i) {
    this.IpDetails[i].IpNameSwitch = false;
    this.OdatanextLink = null;
    this.IpDetails[i].IP.IpName = selectedData.name;
    this.IpDetails[i].IP.IpId = selectedData.productid;
    this.IpDetails[i].selectedIP = new Array(Object.assign({}, selectedData));
    this.IpDetails[i].IP.WiproModuleName = "";
    this.IpDetails[i].IP.WiproModuleValue = "";
    this.IpDetails[i].selectedModule = [];
    this.IpDetails[i].selectedHomesBDM = [];
    this.IpDetails[i].IP.WiproModuleContactId = "";
    this.IpDetails[i].IP.WiproModuleContactIdName = "";
    this.IpDetails[i].IP.WiproHolmesbdmID = "";
    this.IpDetails[i].IP.WiproHolmesbdmName = "";
    this.IpDetails[i].IpModuleDD = [];
    this.IpDetails[i].IpHolmesDD = [];
    this.IpDetails[i].HolmesDisable = (selectedData.productcode == "4") ? false : true;
    this.IpDetails[i].ModuleDisabled = (selectedData.ModuleCount > 0) ? false : true;
  }



  getIpModuleData(IpData, searchText, i) {
    this.addIPservice.getIPModuleDropDownList(IpData.IpId, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.IpDetails[i].IpModuleDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IpModuleDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }


  IpModuleclose(IpData, i, event) {
    // event.relatedTarget
    let id = 'advanceIPModuleSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.IpDetails[i].IpModuleNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.IpDetails[i].selectedModule.some(res => res.ModuleName == IpData.WiproModuleName && res.WiproProductModuleId == IpData.WiproModuleValue)) {
        this.IpDetails[i].IP.WiproModuleName = "";
        this.IpDetails[i].IP.WiproModuleValue = "";
        this.IpDetails[i].IP.WiproModuleContactId = "";
        this.IpDetails[i].IP.WiproModuleContactIdName = "";
        this.IpDetails[i].IpModuleDD = [];
        this.IpDetails[i].selectedModule = [];
      }
    }
  }

  getIPModuleDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPModuleDropDownList(rowData.IpId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfIPModulePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.IpDetails[i].IpModuleNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {

      this.IpDetails[i].IP.WiproModuleName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].ModuleName : "";
      this.IpDetails[i].IP.WiproModuleValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].WiproProductModuleId : "";
      this.IpDetails[i].IP.WiproModuleContactId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerId : "";
      this.IpDetails[i].IP.WiproModuleContactIdName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerName : "";
      this.IpDetails[i].selectedModule = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];


    } else {
      if (!this.IpDetails[i].selectedModule.some(res => res.ModuleName == rowData.WiproModuleName && res.WiproProductModuleId == rowData.WiproModuleValue)) {
        this.IpDetails[i].IP.WiproModuleName = "";
        this.IpDetails[i].IP.WiproModuleValue = "";
        this.IpDetails[i].IP.WiproModuleContactId = "";
        this.IpDetails[i].IP.WiproModuleContactIdName = "";
        this.IpDetails[i].selectedModule = [];

      }
    }

  }

  getIPModuleDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getIPModuleDropDownList(rowData.IpId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  changeIpModuleData(selectedData, IpData, i) {
    this.IpDetails[i].IpModuleNameSwitch = false;
    this.OdatanextLink = null;
    this.IpDetails[i].IP.WiproModuleName = selectedData.ModuleName;
    this.IpDetails[i].IP.WiproModuleValue = selectedData.WiproProductModuleId;
    this.IpDetails[i].IP.WiproModuleContactId = selectedData.OwnerId;
    this.IpDetails[i].IP.WiproModuleContactIdName = selectedData.OwnerName;
    this.IpDetails[i].selectedModule = new Array(Object.assign({}, selectedData));
  }

  IpHolmesBDMclose(IpData, i, event) {
    // event.relatedTarget
    let id = 'advanceIPHolmesBDmSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.IpDetails[i].IpHolmesbdmNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.IpDetails[i].selectedHomesBDM.some(res => res.SysGuid == IpData.WiproHolmesbdmID && res.Name == IpData.WiproHolmesbdmName)) {
        this.IpDetails[i].IP.WiproHolmesbdmName = "";
        this.IpDetails[i].IP.WiproHolmesbdmID = "";
        this.IpDetails[i].IpHolmesDD = [];
        this.IpDetails[i].selectedHomesBDM = [];
      }
    }
    // data.bdmNameSwitch = false;
  }

  changeIpHolmesBDMData(selectedData, IpData, i) {
    this.IpDetails[i].IpHolmesbdmNameSwitch = false;
    this.OdatanextLink = null;
    this.IpDetails[i].IP.WiproHolmesbdmName = selectedData.Name;
    this.IpDetails[i].IP.WiproHolmesbdmID = selectedData.SysGuid;
    this.IpDetails[i].selectedHomesBDM = new Array(Object.assign({}, selectedData));
  }

  getIpHolmesData(IpData, searchText, i) {

    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(IpData.IpId, this.SearchTypeHomesBDM, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.IpDetails[i].IpHolmesDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IpHolmesDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }


  getIPHolmesBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(rowData.IpId, this.SearchTypeHomesBDM, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfIPHolmesBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.IpDetails[i].IpHolmesbdmNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {

      this.IpDetails[i].IP.WiproHolmesbdmName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.IpDetails[i].IP.WiproHolmesbdmID = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.IpDetails[i].selectedHomesBDM = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];

    } else {
      if (!this.IpDetails[i].selectedHomesBDM.some(res => res.Name == rowData.WiproHolmesbdmName && res.SysGuid == rowData.WiproHolmesbdmID)) {
        this.IpDetails[i].IP.WiproHolmesbdmName = "";
        this.IpDetails[i].IP.WiproHolmesbdmID = "";
        this.IpDetails[i].selectedHomesBDM = [];

      }
    }

  }

  getIPHolmesBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(rowData.IpId, this.SearchTypeHomesBDM, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }






  addNewIP() {
    this.service.loaderhome = true;
    let IPObj: OrderIPInterface = {
      OpportunityId: this.OpportunityId,
      wiproOrderid: this.OrderId,
      statecode: 0,
      WiproAmcvalue: "",
      WiproCloud: false,
      WiproHolmesbdmID: "",
      WiproHolmesbdmName: "",
      WiproSlbdmValue: "",
      WiproSlbdmName: "",
      PricingTypeId : "",
      PricingTypeName : "",
      IpId: "",
      WiproLicenseValue: "",
      WiproModuleValue: "",
      WiproModuleName: "",
      IpName: "",
      WiproOpportunityIpId: "",
      OrderIpId: "",
      WiproPractice: "",
      WiproServiceline: "",
      AdditionalSLDetails: [],
      CloudDetails: [],
      WiproModuleContactId: "",
      WiproModuleContactIdName: "",
      WiproServicelineName: "",
      WiproPracticeName: "",
    };
    let Ipnamelength = this.IpDetails.length + 1;
    this.newIpDataCount = this.newIpDataCount + 1;
    this.IpDetails.unshift(Object.assign({}, new OrderIpDetails(IPObj, [],[],[], [], [], [], [], [], [], [], [], false,false, false, false, false, false, true, true, 0,
      "IPName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpModuleName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPracticeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLBDMName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPricingTypeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpLicenceValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAMCValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpCloudName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpHomesBDMName" + this.newIpDataCount + "NewData" + Ipnamelength)));
    this.service.loaderhome = false;
    this.userModifyFrm.form.markAsDirty();
  }

  deletBSIpValidation(IpData, searchText, i) {

    this.openDialogDelete("Do you wish to delete this IP", "Confirm", "Delete IP").subscribe(res => {
      if (res == 'save') {
        if (IpData.WiproOpportunityIpId || IpData.OrderIpId) {
          this.deleteIPArray.push(Object.assign({}, this.IpDetails[i]));
        }
        this.IpDetails.splice(i, 1);
        this.userModifyFrm.form.markAsDirty();
        this.resetIPTCVandOverAllTCV();
        if (IpData.WiproOpportunityIpId || IpData.OrderIpId) {
          this.projectService.throwError("IP added for deletion successfully, please save the data");
        } else {
          this.projectService.throwError("IP deleted successfully");
        }

      }
    });
  }

  resetIPTCVandOverAllTCV() {
    let sumofIPTCV: any = this.IpDetails.reduce((prevVal, elem) => {
      let WiproAMC: any = this.acceptNegative ? (elem.IP.WiproAmcvalue.toString()).match(this.negativeregex) : (elem.IP.WiproAmcvalue.toString()).match(this.positiveregex);
      let LicenceValue: any = this.acceptNegative ? (elem.IP.WiproLicenseValue.toString()).match(this.negativeregex) : (elem.IP.WiproLicenseValue.toString()).match(this.positiveregex);
      return prevVal + (LicenceValue && LicenceValue.length > 0 && LicenceValue[0] && !this.isNaNCheck(LicenceValue[0]) ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC && WiproAMC.length > 0 && WiproAMC[0] && !this.isNaNCheck(WiproAMC[0]) ? parseFloat(WiproAMC[0]) : 0);
    }, 0);
    this.businessSOlutionData[0].IpTcv = sumofIPTCV.toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();


    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
        this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != '0.00' && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = (tempSolValue && parseFloat(tempSolValue) >= this.minDecimalValue && parseFloat(tempSolValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) ? parseFloat(tempSolValue).toFixed(2).toString() : "";
        if (!this.SolutionDetails[sol].solutions.WiproValue) {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = ""
        }
      } else {
        if (parseFloat(this.SolutionDetails[sol].solutions.WiproValue) >= this.minDecimalValue && parseFloat(this.SolutionDetails[sol].solutions.WiproValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) {
          let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00" && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
        } else {
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = "";
          this.SolutionDetails[sol].solutions.WiproValue = "";
        }
      }

    }

  }


  //**************************************************************IP Methods Ends***************************************************/




  //**************************************************************Solution Methods Starts***************************************************/
  createSolutionStructure(solutionorignalDetails) {
    this.SolutionDetails = []
    this.deleteSolutionArray = [];
    let solutionlength = solutionorignalDetails.length;
    for (let i = 0; i < solutionorignalDetails.length; i++) {

      let OrdersolutionorignalDetails: any = {};
      OrdersolutionorignalDetails.WiproOpportunityId = this.OpportunityId;
      OrdersolutionorignalDetails.wiproOrderid = this.OrderId;
      OrdersolutionorignalDetails.OrderSolutionId = solutionorignalDetails[i].OrderSolutionId ? solutionorignalDetails[i].OrderSolutionId : "";
      OrdersolutionorignalDetails.OwnerIdValue = solutionorignalDetails[i].OwnerIdValue ? solutionorignalDetails[i].OwnerIdValue : "";
      OrdersolutionorignalDetails.OwnerIdValueName = solutionorignalDetails[i].OwnerIdValueName ? solutionorignalDetails[i].OwnerIdValueName : "";
      OrdersolutionorignalDetails.WiproAccountNameValue = solutionorignalDetails[i].WiproAccountNameValue ? solutionorignalDetails[i].WiproAccountNameValue : "";
      OrdersolutionorignalDetails.WiproInfluenceType = solutionorignalDetails[i].WiproInfluenceType ? solutionorignalDetails[i].WiproInfluenceType : "";
      OrdersolutionorignalDetails.WiproAccountname = solutionorignalDetails[i].WiproAccountname ? solutionorignalDetails[i].WiproAccountname : "";
      OrdersolutionorignalDetails.WiproPercentage = solutionorignalDetails[i].WiproPercentage ? JSON.parse(solutionorignalDetails[i].WiproPercentage) : false;
      OrdersolutionorignalDetails.WiproPercentageOfTCV = solutionorignalDetails[i].WiproPercentageOfTCV ? (parseFloat(solutionorignalDetails[i].WiproPercentageOfTCV).toFixed(2)).toString() : "";
      OrdersolutionorignalDetails.WiproServiceType = solutionorignalDetails[i].WiproServiceType ? solutionorignalDetails[i].WiproServiceType : "";
      OrdersolutionorignalDetails.WiproSolutionBDMValue = solutionorignalDetails[i].WiproSolutionBDMValue ? solutionorignalDetails[i].WiproSolutionBDMValue : "";
      OrdersolutionorignalDetails.WiproSolutionBDMName = solutionorignalDetails[i].WiproSolutionBDMName ? solutionorignalDetails[i].WiproSolutionBDMName : "";
      OrdersolutionorignalDetails.WiproType = solutionorignalDetails[i].WiproType ? solutionorignalDetails[i].WiproType : "";
      OrdersolutionorignalDetails.WiproValue = solutionorignalDetails[i].WiproValue ? (parseFloat(solutionorignalDetails[i].WiproValue).toFixed(2)).toString() : "";
      OrdersolutionorignalDetails.WiproTypeName = solutionorignalDetails[i].WiproTypeName ? solutionorignalDetails[i].WiproTypeName : "";
      OrdersolutionorignalDetails.WiproInfluenceTypeName = solutionorignalDetails[i].WiproInfluenceTypeName ? solutionorignalDetails[i].WiproInfluenceTypeName : "";
      OrdersolutionorignalDetails.WiproServiceTypeName = solutionorignalDetails[i].WiproServiceTypeName ? solutionorignalDetails[i].WiproServiceTypeName : "";
      OrdersolutionorignalDetails.IsDealRegistered = solutionorignalDetails[i].IsDealRegistered;

      if (this.ModificationId && this.ModificationOBAllocation) {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = solutionorignalDetails[i].WiproOpportunitySolutionDetailId ? solutionorignalDetails[i].WiproOpportunitySolutionDetailId : "";
        OrdersolutionorignalDetails.statecode = (OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId) ? 2 : 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it})
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it})
        });   
      }
      else {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = "";
        OrdersolutionorignalDetails.statecode = 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: ''})
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: ''})
        });
      }

      let nameDD = [];
      let ownerDD = [];
      let solBDMDD = [];

      let selectedSolName = (OrdersolutionorignalDetails.WiproAccountname && OrdersolutionorignalDetails.WiproAccountNameValue) ? [{
        AccountName: OrdersolutionorignalDetails.WiproAccountname,
        AccountId: OrdersolutionorignalDetails.WiproAccountNameValue,
        ProductTypeCodeName: '',
        productcode: '',
        SysNumber: '',
        OwnerIdValue: OrdersolutionorignalDetails.OwnerIdValue,
        OwnerName: OrdersolutionorignalDetails.OwnerIdValueName,
        Id: OrdersolutionorignalDetails.WiproAccountNameValue
      }] : [];

      let selectedOwnerName = (OrdersolutionorignalDetails.OwnerIdValue && OrdersolutionorignalDetails.OwnerIdValueName) ? [{
        EmailID: '',
        SysGuid: OrdersolutionorignalDetails.OwnerIdValue,
        Name: OrdersolutionorignalDetails.OwnerIdValueName,
        Id: OrdersolutionorignalDetails.OwnerIdValue
      }] : [];

      let selectedSolBDM = (OrdersolutionorignalDetails.WiproSolutionBDMValue && OrdersolutionorignalDetails.WiproSolutionBDMName) ? [{
        Name: OrdersolutionorignalDetails.WiproSolutionBDMName,
        SysGuid: OrdersolutionorignalDetails.WiproSolutionBDMValue,
        EmailID: '',
        Id: OrdersolutionorignalDetails.WiproSolutionBDMValue
      }] : [];
      if (OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId != "") {
        this.PushToSolutionArray(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength);
      }
      else {
        this.PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength);
      }

    }

    if (solutionlength == 0) {
      this.solutionLoader = false;
    }
  }

  PushToSolutionArray(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength) {
    this.SolutionDetails.push(Object.assign({}, new OrdersolutionDetails(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName,selectedSolBDM, false, false,false,
      "solType" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solName" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solOwner" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solPerc" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solTCV" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solValue" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solBDM" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solInf" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solST" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solDealPricing" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId)));
    if (i == (solutionlength - 1)) {
      this.solutionLoader = false;
    }
  }

  PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength) {
    let solnamelength = this.SolutionDetails.length + 1;
    this.newsolDataCount = this.newsolDataCount + 1;
    this.SolutionDetails.push(Object.assign({}, new OrdersolutionDetails(OrdersolutionorignalDetails, nameDD,ownerDD, solBDMDD, selectedSolName,selectedOwnerName,selectedSolBDM, false, false,false,
      "solType" + this.newsolDataCount + "NewData" + solnamelength,
      "solName" + this.newsolDataCount + "NewData" + solnamelength,
      "solOwner" + this.newsolDataCount + "NewData" + solnamelength,
      "solPerc" + this.newsolDataCount + "NewData" + solnamelength,
      "solTCV" + this.newsolDataCount + "NewData" + solnamelength,
      "solValue" + this.newsolDataCount + "NewData" + solnamelength,
      "solBDM" + this.newsolDataCount + "NewData" + solnamelength,
      "solInf" + this.newsolDataCount + "NewData" + solnamelength,
      "solST" + this.newsolDataCount + "NewData" + solnamelength,
      "solDealPricing" + this.newsolDataCount + "NewData" + solnamelength)));
    if (i == (solutionlength - 1)) {
      this.solutionLoader = false;
    }
  }

  getnamearray(solutionData, i) {
    let tempWiproType = this.solutionTypeDD.filter(it => it.Id == solutionData.WiproType);
    this.SolutionDetails[i].solutions.WiproTypeName = (tempWiproType.length > 0) ? tempWiproType[0].Name : "";
    if (solutionData.WiproType == '184450001') {
      this.SolutionDetails[i].nameDD = [];
      this.SolutionDetails[i].selectedSolName = [];
      this.SolutionDetails[i].solutions.WiproAccountname = "";
      this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
      this.SolutionDetails[i].ownerDD = [];
      this.SolutionDetails[i].selectedOwnerName = [];
      this.SolutionDetails[i].solutions.OwnerIdValueName = "";
      this.SolutionDetails[i].solutions.OwnerIdValue = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
      this.SolutionDetails[i].solutionBDMDD = [];
      this.SolutionDetails[i].selectedSolBDM = [];
      this.SolutionDetails[i].solutions.WiproInfluenceType = "";
      this.SolutionDetails[i].solutions.WiproInfluenceTypeName = "";
      this.SolutionDetails[i].solutions.WiproServiceType = "";
      this.SolutionDetails[i].solutions.WiproServiceTypeName = "";

    } else {
      this.SolutionDetails[i].nameDD = [];
      this.SolutionDetails[i].selectedSolName = [];
      this.SolutionDetails[i].solutions.WiproAccountname = "";
      this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
      this.SolutionDetails[i].ownerDD = [];
      this.SolutionDetails[i].selectedOwnerName = [];
      this.SolutionDetails[i].solutions.OwnerIdValueName = "";
      this.SolutionDetails[i].solutions.OwnerIdValue = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
      this.SolutionDetails[i].solutionBDMDD = [];
      this.SolutionDetails[i].selectedSolBDM = [];
    }
  }

  resetServiceType(solutionData, i) {
    let tempInfType = this.InfluenceTypeDD.filter(it => it.Id == solutionData.WiproInfluenceType);
    this.SolutionDetails[i].solutions.WiproInfluenceTypeName = (tempInfType.length > 0) ? tempInfType[0].Name : "";
    if (solutionData.WiproInfluenceType == '184450001') {
      this.SolutionDetails[i].solutions.WiproServiceType = "";
      this.SolutionDetails[i].solutions.WiproServiceTypeName = "";
    }
  }

  setServiceType(solutionData, i) {
    let tempserviceType = this.serviceTypeDD.filter(it => it.Id == solutionData.WiproServiceType);
    this.SolutionDetails[i].solutions.WiproServiceTypeName = (tempserviceType.length > 0) ? tempserviceType[0].Name : "";
  }


  getSolNameDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    if (rowData.WiproType == '184450001') {
      this.getSolNameDataPushToLookUpforSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
    else if (rowData.WiproType == '184450000') {
      this.getSolNameDataPushToLookUpforType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, this.AllianceSearchType);
    } else if (rowData.WiproType == '184450002') {
      this.getSolNameDataPushToLookUpforType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, this.NewAgeSearchType);
    }
  }

  getSolNameDataPushToLookUpforSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPDropDownList(this.getSolutionNameType, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  getSolNameDataPushToLookUpforType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, searchType) {
    this.addIPservice.getSolNameAllianceandNewAgeDropDownList(searchType, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfSolNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.SolutionDetails[i].solNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.SolutionDetails[i].solutions.WiproAccountname = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].AccountName : "";
      this.SolutionDetails[i].solutions.WiproAccountNameValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].AccountId : "";
      if(this.SolutionDetails[i].solutions.WiproType=='184450001'){
        this.SolutionDetails[i].solutions.OwnerIdValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerIdValue : "";
         this.SolutionDetails[i].solutions.OwnerIdValueName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerName : "";
         if(emittedevt.selectedData.length > 0 && emittedevt.selectedData[0].OwnerIdValue && emittedevt.selectedData[0].OwnerName){
          this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({
            'SysGuid': emittedevt.selectedData[0].OwnerIdValue,
            'Name': emittedevt.selectedData[0].OwnerName,  
            'EmailID': '',
            'Id': emittedevt.selectedData[0].OwnerIdValue}));
         }else{
          this.SolutionDetails[i].selectedOwnerName = [];
         }
        
        }
        else
        {   
           this.SolutionDetails[i].solutions.OwnerIdValue = '';
           this.SolutionDetails[i].solutions.OwnerIdValueName ='';
           this.SolutionDetails[i].selectedOwnerName =[];
           let obj={
             "Guid": emittedevt.selectedData[0].AccountId,
             "SearchText":'',
             "PageSize":this.pageSize, 
             "RequestedPageNumber":this.defaultpageNumber 
         }
         this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
         { 
           if(res.TotalRecordCount==1)
           {
               this.SolutionDetails[i].solutions.OwnerIdValue = res.ResponseObject[0].SysGuid;
               this.SolutionDetails[i].solutions.OwnerIdValueName = res.ResponseObject[0].Name;
               this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({}, res.ResponseObject[0]));
           }       
         })
        }
      
     
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
      this.SolutionDetails[i].selectedSolBDM = [];
      this.SolutionDetails[i].solutionBDMDD = [];
      this.SolutionDetails[i].selectedSolName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];


    } else {

      if (!this.SolutionDetails[i].selectedSolName.some(res => res.AccountId == rowData.WiproAccountNameValue && res.AccountName == rowData.WiproAccountname)) {
        this.SolutionDetails[i].solutions.WiproAccountname = "";
        this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
        this.SolutionDetails[i].selectedSolBDM = [];
        this.SolutionDetails[i].solutionBDMDD = [];
        this.SolutionDetails[i].selectedSolName = [];
        this.SolutionDetails[i].selectedOwnerName = [];

      }
    }

  }

  getSolNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    if (rowData.WiproType == '184450001') {
      this.getSolNameDataOnsearchSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
    else if (rowData.WiproType == '184450000') {
      this.getSolNameDataOnsearchType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, this.AllianceSearchType);
    } else if (rowData.WiproType == '184450002') {
      this.getSolNameDataOnsearchType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, this.NewAgeSearchType);
    }
  }

  getSolNameDataOnsearchSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPDropDownList(this.getSolutionNameType, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  getSolNameDataOnsearchType(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt, searchType) {
    this.addIPservice.getSolNameAllianceandNewAgeDropDownList(searchType, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  getSolOwnerNameDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    let obj={
        "Guid":rowData.WiproAccountNameValue,
        "SearchText":emittedevt.objectRowData.searchKey,
        "PageSize":this.pageSize,
        "RequestedPageNumber":emittedevt.currentPage
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     {
         this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.lookupdata.pageNo = emittedevt.currentPage;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
        this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
     })
  }

  getSolOwnerNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt)
  {
    let obj={
        "Guid":rowData.WiproAccountNameValue,
        "SearchText":emittedevt.objectRowData.searchKey,
        "PageSize":this.pageSize,
        "RequestedPageNumber":this.defaultpageNumber
     }

     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfSolOwnerNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.SolutionDetails[i].solOwnerSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.SolutionDetails[i].solutions.OwnerIdValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.SolutionDetails[i].solutions.OwnerIdValueName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";

      this.SolutionDetails[i].selectedOwnerName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];


    } else {

      if (!this.SolutionDetails[i].selectedOwnerName.some(res => res.SysGuid == rowData.OwnerIdValue && res.Name == rowData.OwnerIdValueName)) {
        
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
        this.SolutionDetails[i].selectedOwnerName = [];

      }
    }

  }


  getOwnerArray(solution,index,searchText)
  {
     let obj={
        "Guid":solution.WiproAccountNameValue,
        "SearchText":searchText,
        "PageSize":this.pageSize,
        "RequestedPageNumber":this.defaultpageNumber 
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     {
         this.SolutionDetails[index].ownerDD = (res && res.ResponseObject) ? res.ResponseObject : [];       
         this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
         this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
     },
     err => {
       this.SolutionDetails[index].ownerDD = [];
       this.totalRecordCount = 0;
       this.OdatanextLink = null;
     })
  }

  appendOwnername(selectedData,solutions,i){
    this.SolutionDetails[i].solOwnerSwitch = false;
    this.OdatanextLink = null;
    this.SolutionDetails[i].solutions.OwnerIdValue = selectedData.SysGuid;
    this.SolutionDetails[i].solutions.OwnerIdValueName = selectedData.Name;
    this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({}, selectedData));
  }


  getnameArrayDataonType(solutionData, i, searchText) {
    if (solutionData.WiproType == '184450001') {
      this.setnamearrayDataonSolution(solutionData, i, searchText);
    }
    else if (solutionData.WiproType == '184450000') {
      this.setnamearrayDataonType(solutionData, i, searchText, this.AllianceSearchType);
    } else if (solutionData.WiproType == '184450002') {
      this.setnamearrayDataonType(solutionData, i, searchText, this.NewAgeSearchType);
    }
  }

  setnamearrayDataonSolution(IpData, i, searchText) {
    this.addIPservice.getIPDropDownList(this.getSolutionNameType, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.SolutionDetails[i].nameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.SolutionDetails[i].nameDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  setnamearrayDataonType(solutionData, i, searchText, searchType) {
    this.addIPservice.getSolNameAllianceandNewAgeDropDownList(searchType, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.SolutionDetails[i].nameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.SolutionDetails[i].nameDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  appendsolutionname(selectedData, solutionData, i) {
    this.SolutionDetails[i].solNameSwitch = false;
    this.OdatanextLink = null;
    this.SolutionDetails[i].solutions.WiproAccountname = selectedData.AccountName;
    this.SolutionDetails[i].solutions.WiproAccountNameValue = selectedData.AccountId;
    if(this.SolutionDetails[i].solutions.WiproType=='184450001')
    {
    this.SolutionDetails[i].solutions.OwnerIdValue = selectedData.OwnerIdValue;
    this.SolutionDetails[i].solutions.OwnerIdValueName = selectedData.OwnerName;
    this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({
    'SysGuid': (selectedData.OwnerIdValue) ? selectedData.OwnerIdValue : '',
    'Name': (selectedData.OwnerName) ? selectedData.OwnerName : '',  
    'EmailID': '',
    'Id': (selectedData.OwnerIdValue) ? selectedData.OwnerIdValue : ''})); 
    }
    else
    {   
      this.SolutionDetails[i].solutions.OwnerIdValue = '';
      this.SolutionDetails[i].solutions.OwnerIdValueName = '';
      this.SolutionDetails[i].selectedOwnerName = [];
      let obj={
        "Guid": selectedData.AccountId,
        "SearchText":'',
        "PageSize":this.pageSize,
        "RequestedPageNumber":this.defaultpageNumber
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     { 
       if(res.TotalRecordCount==1)
       {
          this.SolutionDetails[i].solutions.OwnerIdValue = res.ResponseObject[0].SysGuid;
          this.SolutionDetails[i].solutions.OwnerIdValueName = res.ResponseObject[0].Name;
          this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({}, res.ResponseObject[0]));          
       }       
     })
    }
    this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
    this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
    this.SolutionDetails[i].selectedSolBDM = [];
    this.SolutionDetails[i].solutionBDMDD = [];
    this.SolutionDetails[i].selectedSolName = new Array(Object.assign({}, selectedData));
  }

  solNameclose(solutionData, i, event) {
    // event.relatedTarget
    let id = 'advanceSolutionNameSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.SolutionDetails[i].solNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.SolutionDetails[i].selectedSolName.some(res => res.AccountId == solutionData.WiproAccountNameValue && res.AccountName == solutionData.WiproAccountname)) {
        this.SolutionDetails[i].solutions.WiproAccountname = "";
        this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
        this.SolutionDetails[i].nameDD = [];
        this.SolutionDetails[i].selectedSolName = [];
        this.SolutionDetails[i].solutionBDMDD = [];
        this.SolutionDetails[i].selectedSolBDM = [];
        this.SolutionDetails[i].selectedOwnerName = [];
      }
    }
  }

  solOwnerclose(solutionData, i, event){
    // event.relatedTarget
    let id = 'advanceSolutionOwnerNameSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.SolutionDetails[i].solOwnerSwitch = false;
      this.OdatanextLink = null;
      if (!this.SolutionDetails[i].selectedOwnerName.some(res => res.SysGuid == solutionData.OwnerIdValue && res.Name == solutionData.OwnerIdValueName)) {
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
        this.SolutionDetails[i].ownerDD = [];
        this.SolutionDetails[i].selectedOwnerName = [];
      }
    }
}

  getsolutionBDMArray(solutionData, i, searchText) {

    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(solutionData.WiproAccountNameValue, this.SearchTypeSolutionBDM, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let solSLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.SolutionDetails[i].solutionBDMDD = (solSLBDMresp.length == 0 && !searchText && this.SolutionDetails[i].solutions.OwnerIdValue && this.SolutionDetails[i].solutions.OwnerIdValueName) ?
        ([{
          'SysGuid': this.SolutionDetails[i].solutions.OwnerIdValue,
          'Name': this.SolutionDetails[i].solutions.OwnerIdValueName,
          'EmailID': "",
          'Id': this.SolutionDetails[i].solutions.OwnerIdValue
        }]) : solSLBDMresp;
      this.totalRecordCount = (solSLBDMresp.length == 0 && !searchText && this.SolutionDetails[i].solutions.OwnerIdValue && this.SolutionDetails[i].solutions.OwnerIdValueName) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;

    },
      err => {
        this.SolutionDetails[i].solutionBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }


  getSolSolutionBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(rowData.WiproAccountNameValue, this.SearchTypeSolutionBDM, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      // this.lookupdata.tabledata = ((res && res.ResponseObject) ? res.ResponseObject : [])+this.lookupdata.tabledata;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfSolSolutionBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.SolutionDetails[i].solbdmNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.SolutionDetails[i].selectedSolBDM = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];
    } else {
      if (!this.SolutionDetails[i].selectedSolBDM.some(res => res.Name == rowData.WiproSolutionBDMName && res.SysGuid == rowData.WiproSolutionBDMValue)) {
        this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
        this.SolutionDetails[i].selectedSolBDM = [];

      }
    }

  }

  getSolSolutionBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(rowData.WiproAccountNameValue, this.SearchTypeSolutionBDM, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let solSLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (solSLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && rowData.OwnerIdValue && rowData.OwnerIdValueName) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (solSLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && rowData.OwnerIdValue && rowData.OwnerIdValueName) ? ([{
        'SysGuid': rowData.OwnerIdValue,
        'Name': rowData.OwnerIdValueName,
        'EmailID': "",
        'Id': rowData.OwnerIdValue
      }]) : solSLBDMresp;
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }
  appendsolutionBDM(selectedData, solutionData, i) {
    this.SolutionDetails[i].solbdmNameSwitch = false;
    this.OdatanextLink = null;
    this.SolutionDetails[i].solutions.WiproSolutionBDMName = selectedData.Name;
    this.SolutionDetails[i].solutions.WiproSolutionBDMValue = selectedData.SysGuid;
    this.SolutionDetails[i].selectedSolBDM = new Array(Object.assign({}, selectedData));
  }

  solutionBDMclose(solutionData, i, event) {
    // event.relatedTarget
    let id = 'advanceSolutionBDMSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.SolutionDetails[i].solbdmNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.SolutionDetails[i].selectedSolBDM.some(res => res.SysGuid == solutionData.WiproSolutionBDMValue && res.Name == solutionData.WiproSolutionBDMName)) {
        this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
        this.SolutionDetails[i].solutionBDMDD = [];
        this.SolutionDetails[i].selectedSolBDM = [];
      }
    }
  }


  checkTCVPerc(solutionData, i, event) {
    let firstval: any = solutionData.WiproPercentageOfTCV.substr(0, event.target.selectionStart)
    let secondval: any = solutionData.WiproPercentageOfTCV.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  checkTCVPercBlur(solutionData, newValue, i) {
    if (this.acceptNegative == false) {
      let tempTCV: any = newValue.match(this.positiveregex);
      if (tempTCV && tempTCV.length > 0 && tempTCV[0] && !this.isNaNCheck(tempTCV[0])) {
        if (tempTCV[0] <= 100 && tempTCV[0] > 0) {
          this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
          this.SolutionDetails[i].solutions.WiproValue = (this.businessSOlutionData[0].OverallTcv) ? ((parseFloat(this.businessSOlutionData[0].OverallTcv) * parseFloat(tempTCV[0])) / 100).toFixed(2).toString() : "";
        }
        else {
          this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
          this.SolutionDetails[i].solutions.WiproValue = "";
          this.projectService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100 for the" + this.converIndextoString(i) + " row of solution table");
        }

      } else {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.SolutionDetails[i].solutions.WiproValue = "";
      }
    } else {
      this.checkTCVPercnegativeBlur(solutionData, newValue, i);
    }
  }

  checkTCVPercnegativeBlur(solutionData, newValue, i) {
    let tempTCV: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
    if (tempTCV) {
      let tempWiproValue = (this.businessSOlutionData[0].OverallTcv) ? ((parseFloat(this.businessSOlutionData[0].OverallTcv) * parseFloat(tempTCV[0])) / 100).toFixed(2).toString() : "";
      if (!tempWiproValue) {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
        this.SolutionDetails[i].solutions.WiproValue = "";
      }
      else if (parseFloat(tempWiproValue) > this.maxDecimalValue) {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.projectService.displayMessageerror("Solution value calculation for the given % of TCV should be less than " + this.maxDecimalValueDisplay + " for the" + this.converIndextoString(i) + " row of solution table");
      } else if (parseFloat(tempWiproValue) < this.minDecimalValue) {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.projectService.displayMessageerror("Solution value calculation for the given % of TCV should be greater than " + this.minDecimalValueDisplay + " for the" + this.converIndextoString(i) + " row of solution table");
      }
      else {
        if (parseFloat(tempWiproValue) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) {
          this.SolutionDetails[i].solutions.WiproValue = tempWiproValue;
        }
        else {
          this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
          this.SolutionDetails[i].solutions.WiproValue = "";
          this.projectService.displayMessageerror("Solution value calculation for the given % of TCV should not be greater than overall TCV in business solution panel for the" + this.converIndextoString(i) + " row of solution table");
        }
      }
    } else {
      this.SolutionDetails[i].solutions.WiproValue = "";
    }
  }

  checkSolValueBlur(solutionData, newValue, i) {
    let tempValue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    if (tempValue && tempValue.length > 0 && tempValue[0] && !this.isNaNCheck(tempValue[0])) {
      if (parseFloat(tempValue[0]) <= parseFloat(this.businessSOlutionData[0].OverallTcv)) {
        this.SolutionDetails[i].solutions.WiproValue = tempValue ? parseFloat(tempValue[0]).toFixed(2).toString() : "";
        let tempTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? ((parseFloat(tempValue[0]) * 100) / (parseFloat(this.businessSOlutionData[0].OverallTcv))) : "";
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV).toFixed(2) : "0.00";
      } else {
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.projectService.displayMessageerror("Solution value should not be greater than overall TCV in business solution panel for the" + this.converIndextoString(i) + " row of solution table");
      }

    } else {
      this.SolutionDetails[i].solutions.WiproValue = "";
      this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
    }
  }

  checkSolValue(solutionData, i, event) {
    let firstval: any = solutionData.WiproValue.substr(0, event.target.selectionStart)
    let secondval: any = solutionData.WiproValue.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }





  addsolution() {
    this.service.loaderhome = true;
    let newSolutionDetails: OrdersolutionsInterface = {
      OwnerIdValue: "",
      OwnerIdValueName: "",
      WiproAccountNameValue: "",
      WiproInfluenceType: "",
      WiproAccountname: "",
      WiproOpportunitySolutionDetailId: "",
      OrderSolutionId: "",
      WiproPercentage: false,
      WiproPercentageOfTCV: "",
      WiproServiceType: "",
      WiproSolutionBDMValue: "",
      WiproSolutionBDMName: "",
      WiproType: "",
      WiproValue: "",
      WiproOpportunityId: this.OpportunityId,
      wiproOrderid: this.OrderId,
      statecode: 0,
      WiproTypeName: "",
      WiproInfluenceTypeName: "",
      WiproServiceTypeName: "",
      IsDealRegistered : "",
      DealRegistrationYes : [{
        DealRegistrationId: "",
        OrderDealRegistrationId : "",
        IsDealRegistered: "",
        SolutionId: "",
        PartnerPortalId: "",
        RegisteredValue: "",
        RegistrationStatus: "",
        RegistrationStatusName: "",
        RegistrationStatusReason: "",
        RegistrationStatusReasonName: "",
        Remarks: "",
        Statecode:  0,
    }],
      DealRegistrationNo : [{
        DealRegistrationId: "",
        OrderDealRegistrationId : "",
        IsDealRegistered: "",
        SolutionId: "",
        PartnerPortalId: "",
        RegisteredValue: "",
        RegistrationStatus: "",
        RegistrationStatusName: "",
        RegistrationStatusReason: "",
        RegistrationStatusReasonName: "",
        Remarks: "",
        Statecode:  0,
    }],
    }
    let solnamelength = this.SolutionDetails.length + 1;
    this.newsolDataCount = this.newsolDataCount + 1;
    this.SolutionDetails.unshift(Object.assign({}, new OrdersolutionDetails(newSolutionDetails, [],[], [], [], [],[], false, false,false,
      "solType" + this.newsolDataCount + "NewData" + solnamelength,
      "solName" + this.newsolDataCount + "NewData" + solnamelength,
      "solOwner" + this.newsolDataCount + "NewData" + solnamelength,
      "solPerc" + this.newsolDataCount + "NewData" + solnamelength,
      "solTCV" + this.newsolDataCount + "NewData" + solnamelength,
      "solValue" + this.newsolDataCount + "NewData" + solnamelength,
      "solBDM" + this.newsolDataCount + "NewData" + solnamelength,
      "solInf" + this.newsolDataCount + "NewData" + solnamelength,
      "solST" + this.newsolDataCount + "NewData" + solnamelength,
      "solDealPricing" + this.newsolDataCount + "NewData" + solnamelength)));
    this.service.loaderhome = false;
    this.userModifyFrm.form.markAsDirty();
  }

  deleteBSSolutionValidation(solutionData, searchText, i) {

    this.openDialogDelete("Do you wish to delete this solution", "Confirm", "Delete solution").subscribe(res => {
      if (res == 'save') {
        if (solutionData.WiproOpportunitySolutionDetailId || solutionData.OrderSolutionId) {
          this.deleteSolutionArray.push(Object.assign({}, this.SolutionDetails[i]))
        }
        this.SolutionDetails.splice(i, 1);
        this.userModifyFrm.form.markAsDirty();
        if (solutionData.WiproOpportunitySolutionDetailId || solutionData.OrderSolutionId) {
          this.projectService.throwError("Solution added for deletion successfully, please save the data");
        } else {
          this.projectService.throwError("Solution deleted successfully");
        }

      }
    });
  }




  //**************************************************************Solution Methods Ends***************************************************/


  //**************************************************************Craete Allocation Methods Starts***************************************************/


  createcreditAllocationStructure(CreditAllocationsDetails) {
    this.creditAllocationdataDetails = [];
    this.deleteCreditAllocationArray = [];
    let creditAllocationlength = CreditAllocationsDetails.length;
    for (let i = 0; i < CreditAllocationsDetails.length; i++) {

      let OrderCreditAllocationsDetailsObj: any = {};
      let tempcreditAId = CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID ? CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID : "";
      OrderCreditAllocationsDetailsObj.WiproOrderCreditAllocationID = CreditAllocationsDetails[i].WiproOrderCreditAllocationID ? CreditAllocationsDetails[i].WiproOrderCreditAllocationID : "";
      OrderCreditAllocationsDetailsObj.SLCAID = CreditAllocationsDetails[i].SLCAID ? CreditAllocationsDetails[i].SLCAID : "";
      OrderCreditAllocationsDetailsObj.wiproOrderid = this.OrderId
      OrderCreditAllocationsDetailsObj.WiproOpportunityId = this.OpportunityId;
      OrderCreditAllocationsDetailsObj.ServicelineId = CreditAllocationsDetails[i].ServicelineId ? CreditAllocationsDetails[i].ServicelineId : "";
      OrderCreditAllocationsDetailsObj.PracticeId = CreditAllocationsDetails[i].PracticeId ? CreditAllocationsDetails[i].PracticeId : "";
      OrderCreditAllocationsDetailsObj.SubPracticeId = CreditAllocationsDetails[i].SubPracticeId ? CreditAllocationsDetails[i].SubPracticeId : "";
      OrderCreditAllocationsDetailsObj.ServicelineBDMId = CreditAllocationsDetails[i].ServicelineBDMId ? CreditAllocationsDetails[i].ServicelineBDMId : "";
      OrderCreditAllocationsDetailsObj.ServicelineBDMName = CreditAllocationsDetails[i].ServicelineBDMName ? CreditAllocationsDetails[i].ServicelineBDMName : "";
      OrderCreditAllocationsDetailsObj.WiproTypeId = CreditAllocationsDetails[i].WiproTypeId ? CreditAllocationsDetails[i].WiproTypeId : "";
      OrderCreditAllocationsDetailsObj.WiproValue = CreditAllocationsDetails[i].WiproValue ? parseFloat(CreditAllocationsDetails[i].WiproValue).toFixed(2) : "";
      OrderCreditAllocationsDetailsObj.WiproIsDefault = CreditAllocationsDetails[i].WiproIsDefault ? JSON.parse(CreditAllocationsDetails[i].WiproIsDefault) : false;
      OrderCreditAllocationsDetailsObj.Contribution = CreditAllocationsDetails[i].Contribution ? (parseFloat(CreditAllocationsDetails[i].Contribution).toFixed(2)) : "";
      OrderCreditAllocationsDetailsObj.WiproTypeName = CreditAllocationsDetails[i].WiproTypeName ? CreditAllocationsDetails[i].WiproTypeName : "";
      OrderCreditAllocationsDetailsObj.ServicelineName = CreditAllocationsDetails[i].ServicelineName ? CreditAllocationsDetails[i].ServicelineName : "";
      OrderCreditAllocationsDetailsObj.PracticeName = CreditAllocationsDetails[i].PracticeName ? CreditAllocationsDetails[i].PracticeName : "";
      OrderCreditAllocationsDetailsObj.SubPracticeName = CreditAllocationsDetails[i].SubPracticeName ? CreditAllocationsDetails[i].SubPracticeName : "";

      if (this.ModificationId && this.ModificationOBAllocation) {
        OrderCreditAllocationsDetailsObj.statecode = (CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID) ? 2 : 0;
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID ? CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID : "";

      }
      else {
        OrderCreditAllocationsDetailsObj.statecode = 0;
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = "";
      }

      let selectedCABDM = (OrderCreditAllocationsDetailsObj.ServicelineBDMId && OrderCreditAllocationsDetailsObj.ServicelineBDMName) ? [{
        SysGuid: OrderCreditAllocationsDetailsObj.ServicelineBDMId,
        Name: OrderCreditAllocationsDetailsObj.ServicelineBDMName,
        EmailID: '',
        Id: OrderCreditAllocationsDetailsObj.ServicelineBDMId
      }] : [];
      let Bdm = [];
      let practicetempCADD: any = (OrderCreditAllocationsDetailsObj.ServicelineId) ? (this.tempCADD.filter(sl => sl.ServicelineId == OrderCreditAllocationsDetailsObj.ServicelineId)) : [];
      let practiceCADD: any = (practicetempCADD.length > 0) ? practicetempCADD[0].CAPracticeDD : [];
      let PracticeDD = (OrderCreditAllocationsDetailsObj.ServicelineId) ? (practiceCADD.map(pracCA => { return { PracticeIdName: pracCA.PracticeIdName, PracticeId: pracCA.PracticeId, ErrorResponse: "" } })) : [];

      let SubPracticetempDD: any = (OrderCreditAllocationsDetailsObj.PracticeId) ? (practiceCADD.filter(prac => prac.PracticeId == OrderCreditAllocationsDetailsObj.PracticeId)) : [];
      let SubPracticeCADD: any = (SubPracticetempDD.length > 0) ? SubPracticetempDD[0].CASubPracticeDD : [];
      let SubPracticeDD = (OrderCreditAllocationsDetailsObj.PracticeId) ? (SubPracticeCADD.map(subPracCA => {
        return {
          SubPracticeId: subPracCA.SubPracticeId,
          SubPracticeIdName: subPracCA.SubPracticeIdName, ErrorResponse: ""
        }
      })) : [];

      this.pushCAarray(OrderCreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, selectedCABDM, i, creditAllocationlength, tempcreditAId);
    }

    if (creditAllocationlength == 0) {
      this.creditAllocationLoader = false;
    }
  }

  // getCAPracticeData(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength) {
  //   if (CreditAllocationsDetailsObj.ServicelineId) {
  //     this.projectService.getPracticeCA(this.OpportunityId, CreditAllocationsDetailsObj.ServicelineId).subscribe(res => {
  //       PracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //       if (CreditAllocationsDetailsObj.ServicelineId && CreditAllocationsDetailsObj.PracticeId) {
  //         this.projectService.getSubPracticeCA(this.OpportunityId, CreditAllocationsDetailsObj.ServicelineId, CreditAllocationsDetailsObj.PracticeId).subscribe(res => {
  //           SubPracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //           this.pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength);
  //         },
  //           err => {
  //             this.pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength);
  //           });
  //       } else {
  //         this.pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength);
  //       }

  //     },
  //       err => {
  //         this.pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength);
  //       });
  //   } else {
  //     this.pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, i, calength);
  //   }
  // }

  pushCAarray(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, selectedCABDM, i, calength, tempcreditAId) {
    this.creditAllocationdataDetails.push(Object.assign({}, new OrdercreditAllocationDetails(CreditAllocationsDetailsObj, Bdm, PracticeDD, SubPracticeDD, selectedCABDM, false,
      "CredetType" + i + "SavedData" + tempcreditAId,
      "BDM" + i + "SavedData" + tempcreditAId,
      "SL" + i + "SavedData" + tempcreditAId,
      "Practice" + i + "SavedData" + tempcreditAId,
      "SubPractice" + i + "SavedData" + tempcreditAId,
      "Value" + i + "SavedData" + tempcreditAId,
      "Contribution" + i + "SavedData" + tempcreditAId)));
    if (i == (calength - 1)) {
      this.creditAllocationLoader = false;
    }
  }

  // getserviceLineCAData(OppId) {
  //   this.projectService.getserviceLineCA(OppId).subscribe(res => {
  //     this.creditAllocationSLDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //   },
  //     err => {
  //       this.creditAllocationSLDD = [];
  //     });
  // }


  getPracticeCAData(creditData, i) {
    this.creditAllocationdataDetails[i].subPracticeDD = [];
    this.creditAllocationdataDetails[i].creditAllocation.PracticeId = "";
    this.creditAllocationdataDetails[i].creditAllocation.PracticeName = "";
    this.creditAllocationdataDetails[i].creditAllocation.SubPracticeId = "";
    this.creditAllocationdataDetails[i].creditAllocation.SubPracticeName = "";
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = "";
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = "";
    this.creditAllocationdataDetails[i].bdmDD = [];
    this.creditAllocationdataDetails[i].selectedCABDM = [];
    if (creditData.ServicelineId) {
      let tempCAPrac: any = this.tempCADD.filter(sl => sl.ServicelineId == creditData.ServicelineId);
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineName = (tempCAPrac.length > 0) ? (tempCAPrac[0].ServicelineIdName) : "";
      let practiceCADD: any = (tempCAPrac.length > 0) ? (tempCAPrac[0].CAPracticeDD) : [];
      let practiceCADDObjArr: any = (practiceCADD.length > 0) ? (practiceCADD.map(pracCA => { return { PracticeIdName: pracCA.PracticeIdName, PracticeId: pracCA.PracticeId, ErrorResponse: "" } })) : [];
      this.creditAllocationdataDetails[i].practiceDD = practiceCADDObjArr;
      if (practiceCADDObjArr == 0) {
        let selectedBSSL: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == creditData.ServicelineId);
        this.creditAllocationdataDetails[i].creditAllocation.WiproValue = (selectedBSSL.length > 0) ? ((selectedBSSL[0].BSServiceLine.WiproEstsltcv) ? selectedBSSL[0].BSServiceLine.WiproEstsltcv : "") : "";
      } else {
        this.creditAllocationdataDetails[i].creditAllocation.WiproValue = "";
      }
    }
    else {
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineName = "";
      this.creditAllocationdataDetails[i].creditAllocation.WiproValue = "";
      this.creditAllocationdataDetails[i].practiceDD = [];
    }
  }

  getSubPracticeCAData(creditData, i) {
    this.creditAllocationdataDetails[i].creditAllocation.SubPracticeId = "";
    this.creditAllocationdataDetails[i].creditAllocation.SubPracticeName = "";
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = "";
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = "";
    this.creditAllocationdataDetails[i].bdmDD = [];
    this.creditAllocationdataDetails[i].selectedCABDM = [];
    if (creditData.ServicelineId && creditData.PracticeId) {
      let tempCASL: any = this.tempCADD.filter(sl => sl.ServicelineId == creditData.ServicelineId);
      let practiceCADD: any = (tempCASL.length > 0) ? (tempCASL[0].CAPracticeDD) : [];
      let temppracCASL: any = practiceCADD.filter(prac => prac.PracticeId == creditData.PracticeId);
      this.creditAllocationdataDetails[i].creditAllocation.PracticeName = (temppracCASL.length > 0) ? (temppracCASL[0].PracticeIdName) : '';
      let subPracticeCADD: any = (temppracCASL.length > 0) ? (temppracCASL[0].CASubPracticeDD) : [];
      let subPracticeCADDObjArr: any = (subPracticeCADD.length > 0) ? (subPracticeCADD.map(pracCA => { return { SubPracticeIdName: pracCA.SubPracticeIdName, SubPracticeId: pracCA.SubPracticeId, ErrorResponse: "" } })) : [];
      this.creditAllocationdataDetails[i].subPracticeDD = subPracticeCADDObjArr;
      if (subPracticeCADDObjArr == 0) {
        let selectedBSSL: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == creditData.ServicelineId && it.BSServiceLine.WiproPracticeId == creditData.PracticeId);
        this.creditAllocationdataDetails[i].creditAllocation.WiproValue = (selectedBSSL.length > 0) ? ((selectedBSSL[0].BSServiceLine.WiproEstsltcv) ? selectedBSSL[0].BSServiceLine.WiproEstsltcv : "") : "";
      } else {
        this.creditAllocationdataDetails[i].creditAllocation.WiproValue = "";
      }
    }
    else {
      this.creditAllocationdataDetails[i].creditAllocation.PracticeName = "";
      this.creditAllocationdataDetails[i].subPracticeDD = [];
    }
  }

  changeSubpracticeCAData(creditData, i) {
    let tempSubPracCA = this.creditAllocationdataDetails[i].subPracticeDD.filter(it => it.SubPracticeId == creditData.SubPracticeId);
    this.creditAllocationdataDetails[i].creditAllocation.SubPracticeName = (tempSubPracCA.length > 0) ? tempSubPracCA[0].SubPracticeIdName : "";
    // this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = "";
    // this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = "";
    // this.creditAllocationdataDetails[i].bdmDD = [];
    // this.creditAllocationdataDetails[i].selectedCABDM = [];
    let selectedBSSL: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == creditData.ServicelineId && it.BSServiceLine.WiproPracticeId == creditData.PracticeId && it.BSServiceLine.WiproSubpracticeid == creditData.SubPracticeId);
    this.creditAllocationdataDetails[i].creditAllocation.WiproValue = (selectedBSSL.length > 0) ? ((selectedBSSL[0].BSServiceLine.WiproEstsltcv) ? selectedBSSL[0].BSServiceLine.WiproEstsltcv : "") : "";
  }


  checkContributionPercBlur(creditData, newValue, i) {
    let tempContribution: any = newValue.match(this.positiveregex);
    if (tempContribution && tempContribution.length > 0 && tempContribution[0] && !this.isNaNCheck(tempContribution[0])) {
      if (tempContribution[0] > 100 || tempContribution[0] < 0) {
        this.creditAllocationdataDetails[i].creditAllocation.Contribution = "";
        this.projectService.displayMessageerror("Percentage contribution value should be between 0 and 100");
      } else {
        this.creditAllocationdataDetails[i].creditAllocation.Contribution = tempContribution ? parseFloat(tempContribution[0]).toFixed(2) : "";
        if (creditData.WiproTypeId == '184450000') {
          let allSimilarSLCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.ServicelineId == creditData.ServicelineId &&
            it.creditAllocation.PracticeId == creditData.PracticeId &&
            it.creditAllocation.SubPracticeId == creditData.SubPracticeId);
          if (allSimilarSLCA.length == 2 && creditData.ServicelineId) {
            let index = this.creditAllocationdataDetails.findIndex((it, index) => it.creditAllocation.ServicelineId == creditData.ServicelineId &&
              it.creditAllocation.PracticeId == creditData.PracticeId &&
              it.creditAllocation.SubPracticeId == creditData.SubPracticeId && index != i);
            if (index >= 0) {
              this.creditAllocationdataDetails[index].creditAllocation.Contribution = (100 - parseFloat(tempContribution[0])).toFixed(2);
            }
          }
        } else if (creditData.WiproTypeId == '184450001') {
          let allSimilarVerticalCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.WiproTypeId == 184450001);
          if (allSimilarVerticalCA.length == 2) {
            let index = this.creditAllocationdataDetails.findIndex((it, index) => it.creditAllocation.WiproTypeId == 184450001 && index != i);
            if (index >= 0) {
              this.creditAllocationdataDetails[index].creditAllocation.Contribution = (100 - parseFloat(tempContribution[0])).toFixed(2);
            }
          }
        }
      }
    } else {
      this.creditAllocationdataDetails[i].creditAllocation.Contribution = "";
    }
  }

  checkContributionPerc(creditData, i, event) {
    let firstval: any = creditData.Contribution.substr(0, event.target.selectionStart)
    let secondval: any = creditData.Contribution.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }

  }



  assignBDMData(creditData, i) {
    let tempWiproType = this.creditTypeDD.filter(it => it.Id == creditData.WiproTypeId);
    this.creditAllocationdataDetails[i].creditAllocation.WiproTypeName = (tempWiproType.length > 0) ? tempWiproType[0].Name : '';
    this.creditAllocationdataDetails[i].bdmDD = [];
    this.creditAllocationdataDetails[i].selectedCABDM = [];
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = '';
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = '';
    this.creditAllocationdataDetails[i].creditAllocation.WiproValue = "";
    if (creditData.WiproTypeId == '184450001') {
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineId = "";
      this.creditAllocationdataDetails[i].creditAllocation.PracticeId = "";
      this.creditAllocationdataDetails[i].creditAllocation.SubPracticeId = "";
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineName = "";
      this.creditAllocationdataDetails[i].creditAllocation.PracticeName = "";
      this.creditAllocationdataDetails[i].creditAllocation.SubPracticeName = "";
      this.creditAllocationdataDetails[i].practiceDD = [];
      this.creditAllocationdataDetails[i].subPracticeDD = [];
      this.creditAllocationdataDetails[i].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
    }
  }

  getCABDMData(creditData, i, SearchText) {
    debugger;
    if (creditData.WiproTypeId == '184450000') {
      this.getCASLBDMData(creditData, i, SearchText);
    }
    else if (creditData.WiproTypeId == '184450001') {
      this.getCAVerticalBDMData(creditData, i, SearchText);
    }
  }


  getCASLBDMData(creditData, i, SearchText) {
    this.addIPservice.getSLBDMDropDownList1(creditData.ServicelineId, creditData.PracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, SearchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.creditAllocationdataDetails[i].bdmDD = (SLBDMresp.length == 0 && !SearchText && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !SearchText && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.creditAllocationdataDetails[i].bdmDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  getCAVerticalBDMData(creditData, i, SearchText) {
    this.addIPservice.getCAVearticalBDMDropDownList(this.VerticalId, this.RegionId, SearchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.creditAllocationdataDetails[i].bdmDD = (SLBDMresp.length == 0 && !SearchText && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ?
        ([{
          'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
          'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
          'EmailID': this.VSOEmailId,
          'Id': this.modifyOrderDetailsObj.currentOrderVSOId
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !SearchText && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.creditAllocationdataDetails[i].bdmDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getCABDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    if (rowData.WiproTypeId == '184450000') {
      this.getCASLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
    else if (rowData.WiproTypeId == '184450001') {
      this.getCAVerticalBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
  }

  getCASLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getSLBDMDropDownList1(rowData.ServicelineId, rowData.PracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  getCAVerticalBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getCAVearticalBDMDropDownList(this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  OnCloseOfCABDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.creditAllocationdataDetails[i].bdmNameSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.creditAllocationdataDetails[i].selectedCABDM = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];
    } else {

      if (!this.creditAllocationdataDetails[i].selectedCABDM.some(res => res.SysGuid == rowData.ServicelineBDMId && res.Name == rowData.ServicelineBDMName)) {
        this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = ""
        this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = ""
        this.creditAllocationdataDetails[i].selectedCABDM = [];
        this.creditAllocationdataDetails[i].bdmDD = [];

      }
    }

  }

  getCABDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    if (rowData.WiproTypeId == '184450000') {
      this.getCASLBDMOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
    else if (rowData.WiproTypeId == '184450001') {
      this.getCAVerticalBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt);
    }
  }

  getCASLBDMOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getSLBDMDropDownList1(rowData.ServicelineId, rowData.PracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? ([{
        'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
        'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
        'EmailID': this.VSOEmailId,
        'Id': this.modifyOrderDetailsObj.currentOrderVSOId
      }]) : SLBDMresp;
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }

  getCAVerticalBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getCAVearticalBDMDropDownList(this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.modifyOrderDetailsObj.currentOrderVSOName && this.modifyOrderDetailsObj.currentOrderVSOId) ? ([{
        'SysGuid': this.modifyOrderDetailsObj.currentOrderVSOId,
        'Name': this.modifyOrderDetailsObj.currentOrderVSOName,
        'EmailID': this.VSOEmailId,
        'Id': this.modifyOrderDetailsObj.currentOrderVSOId
      }]) : SLBDMresp;
      this.lookupdata.isLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
  }


  bdmNameclose(creditData, i, event) {
    let id = 'advanceCABDMSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.creditAllocationdataDetails[i].bdmNameSwitch = false;
      this.OdatanextLink = null;
      if (!this.creditAllocationdataDetails[i].selectedCABDM.some(res => res.SysGuid == creditData.ServicelineBDMId && res.Name == creditData.ServicelineBDMName)) {
        this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = "";
        this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = "";
        this.creditAllocationdataDetails[i].bdmDD = [];
        this.creditAllocationdataDetails[i].selectedCABDM = [];
      }
    }
  }

  changeBDMData(selectedData, creditData, i) {
    this.creditAllocationdataDetails[i].bdmNameSwitch = false;
    this.OdatanextLink = null;
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMId = selectedData.SysGuid;
    this.creditAllocationdataDetails[i].creditAllocation.ServicelineBDMName = selectedData.Name;
    this.creditAllocationdataDetails[i].selectedCABDM = new Array(Object.assign({}, selectedData));

  }



  addcredit() {
    this.service.loaderhome = true;
    let newCreditDetails: OrdercreditAllocationInterface = {
      SLCAID: "",
      ServicelineId: "",
      PracticeId: "",
      SubPracticeId: "",
      ServicelineBDMId: "",
      ServicelineBDMName: "",
      WiproIsDefault: false,
      WiproTypeId: "",
      WiproValue: "",
      WiproOpportunityCreditAllocationID: "",
      WiproOrderCreditAllocationID: "",
      Contribution: "",
      WiproOpportunityId: this.OpportunityId,
      wiproOrderid: this.OrderId,
      statecode: 0,
      WiproTypeName: "",
      ServicelineName: "",
      PracticeName: "",
      SubPracticeName: "",
    }
    let namelength = this.creditAllocationdataDetails.length + 1;
    this.newCADataCount = this.newCADataCount + 1;
    this.creditAllocationdataDetails.unshift(Object.assign({}, new OrdercreditAllocationDetails(newCreditDetails, [], [], [], [], false,
      "CredetType" + this.newCADataCount + "NewData" + namelength,
      "BDM" + this.newCADataCount + "NewData" + namelength,
      "SL" + this.newCADataCount + "NewData" + namelength,
      "Practice" + this.newCADataCount + "NewData" + namelength,
      "SubPractice" + this.newCADataCount + "NewData" + namelength,
      "Value" + this.newCADataCount + "NewData" + namelength,
      "Contribution" + this.newCADataCount + "NewData" + namelength)));
    this.service.loaderhome = false;
    this.userModifyFrm.form.markAsDirty();
  }


  // deletecredit(creditData, i) {
  //   this.openDialogDelete("Do you wish to delete this credit allocation", "Confirm", "Delete credit allocation").subscribe(res => {
  //     if (res == 'save') {
  //       if (creditData.WiproOpportunityCreditAllocationID) {
  //         if (creditData.WiproTypeId == '184450001') {
  //           this.checksaveOBJonCAdelete(creditData, i);
  //         }
  //         else if (creditData.WiproTypeId == '184450000' && this.creditAllocationdataDetails.filter(it => it.creditAllocation.WiproOpportunityCreditAllocationID != "" && (it.creditAllocation.ServicelineId == creditData.ServicelineId) && (it.creditAllocation.PracticeId == creditData.PracticeId) && (it.creditAllocation.SubPracticeId == creditData.SubPracticeId)).length == 1) {
  //           if (this.BSSLDetails.filter(sl => sl.BSServiceLine.WiproServicelineidValue == creditData.ServicelineId && sl.BSServiceLine.WiproPracticeId == creditData.PracticeId && sl.BSServiceLine.WiproSubpracticeid == creditData.SubPracticeId).length == 0) {
  //             this.checksaveOBJonCAdelete(creditData, i);
  //           } else {
  //             this.projectService.throwError("Credit allocation connot be delete as it's the only credit allocation left that belongs to service line");
  //           }
  //         } else {
  //           if (creditData.WiproTypeId == '184450000' && this.BSSLDetails.filter(sl => sl.BSServiceLine.WiproServicelineidValue == creditData.ServicelineId && sl.BSServiceLine.WiproPracticeId == creditData.PracticeId && sl.BSServiceLine.WiproSubpracticeid == creditData.SubPracticeId && sl.BSServiceLine.WiproSlbdmidValueName == creditData.ServicelineBDMName && sl.BSServiceLine.WiproSlbdmid == creditData.ServicelineBDMId).length == 0) {
  //             this.checksaveOBJonCAdelete(creditData, i);
  //           } else {
  //             this.projectService.throwError("Credit allocation connot be delete as the combination of service line, practice,subpractice and BDM exist in service line table");
  //           }
  //         }
  //       }
  //       else {
  //         this.creditAllocationdataDetails.splice(i, 1);
  //         this.projectService.throwError("Credit allocation deleted successfully");
  //       }
  //     }
  //   });

  // }
  deletecredit(creditData, i) {
    let tempselectedCA: any = Object.assign({}, creditData);
    this.openDialogDelete("Do you wish to delete this credit allocation", "Confirm", "Delete credit allocation").subscribe(res => {
      if (res == 'save') {
        if (tempselectedCA.WiproOpportunityCreditAllocationID || tempselectedCA.WiproOrderCreditAllocationID) {
          this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[i]));
        }
        this.creditAllocationdataDetails.splice(i, 1);
        this.userModifyFrm.form.markAsDirty();
        if (tempselectedCA.WiproOpportunityCreditAllocationID || tempselectedCA.WiproOrderCreditAllocationID) {
          this.projectService.throwError("Credit allocation added for deletion successfully, please save the data");
        } else {
          this.projectService.throwError("Credit allocation deleted successfully");
        }
        this.setContributionDefault(tempselectedCA);
      }
    });

  }

  setContributionDefault(tempselectedCA) {
    if (tempselectedCA.WiproTypeId == '184450001') {
      let filteredVerticalCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.WiproTypeId == '184450001');
      if (filteredVerticalCA.length == 1 && filteredVerticalCA[0].creditAllocation.WiproIsDefault) {
        let index = this.creditAllocationdataDetails.findIndex(it => it.creditAllocation.WiproTypeId == '184450001');
        if (index >= 0) {
          this.creditAllocationdataDetails[index].creditAllocation.Contribution = "100.00";
        }
      }
    } else if (tempselectedCA.WiproTypeId == '184450000') {
      let filteredSLCA: any = this.creditAllocationdataDetails.filter(it => it.creditAllocation.ServicelineId == tempselectedCA.ServicelineId && it.creditAllocation.PracticeId == tempselectedCA.PracticeId && it.creditAllocation.SubPracticeId == tempselectedCA.SubPracticeId);
      if (filteredSLCA.length == 1 && filteredSLCA[0].creditAllocation.WiproIsDefault) {
        let index = this.creditAllocationdataDetails.findIndex(it => it.creditAllocation.ServicelineId == tempselectedCA.ServicelineId && it.creditAllocation.PracticeId == tempselectedCA.PracticeId && it.creditAllocation.SubPracticeId == tempselectedCA.SubPracticeId);
        if (index >= 0) {
          this.creditAllocationdataDetails[index].creditAllocation.Contribution = "100.00";
        }
      }
    }

  }


  //**************************************************************Craete Allocation Methods Ends***************************************************/
  converIndextoString(index) {
    index = index + 1;
    if (index == 1) {
      return '1st';
    }
    else if (index == 2) {
      return '2nd';
    }
    else if (index == 3) {
      return '3rd';
    }
    else {
      return index + 'th';
    }
  }

  scrolltoMandatoryField() {
    setTimeout(() => {
      let element: any = document.getElementsByClassName('orangeborder')[0];

      if (element) {
        element.focus();
        window.scroll({
          behavior: 'smooth',
          left: 0,
          top: element.getBoundingClientRect().top + window.scrollY - 150
        });
      }
      // console.log(t.id)
      // document.getElementById(t.id).focus()
      // document.getElementById(t.id).blur()
      // x[y.name].IsError = true;
    }, 500)


  }
  
  changeInPODetails() {
    let saveModPO: any = [];
    
    if ( this.modifyOrderDetailsObj.currentorderAuthorizationId == "True" )  {
      // for SOW
      if (this.modifyOrderDetailsObj.changeOrderAuthorizationId == "" ) {
        for( var i = 0;i<this.modifiedPODetails.length; i++ )
        {
          if ( this.modifiedPODetails[i].POTableModificationId ) {
            let saveObject= Object.assign({},this.modifiedPODetails[i]);
            saveObject.StateCode = 1;
            saveModPO.push(Object.assign({},saveObject));

          }
        }
      } else if ( this.modifyOrderDetailsObj.changeOrderAuthorizationId == "False" )  {
        saveModPO = this.modifiedPODetails.map(it => {return Object.assign({},it)})
      }
    } else {
      // for PO
      if (this.modifyOrderDetailsObj.changeOrderAuthorizationId == "" ) {
        if ( this.modifyOrderDetailsObj.changeOrderSOWPOD ){
          saveModPO = this.modifiedPODetails.map(it => {return Object.assign({},it)})
        } else {
          for( var i = 0;i<this.modifiedPODetails.length; i++ )
          {
            if ( this.modifiedPODetails[i].POTableModificationId ) {
              let saveObject= Object.assign({},this.modifiedPODetails[i]);
              saveObject.StateCode = 1;
              saveModPO.push(Object.assign({},saveObject));
  
            }
          }
        }
              } else if ( this.modifyOrderDetailsObj.changeOrderAuthorizationId == "True" )  {
                for( var i = 0;i<this.modifiedPODetails.length; i++ )
                {
                  if ( this.modifiedPODetails[i].POTableModificationId || this.modifiedPODetails[i].Wipro_OrderPOTableId ) {
                    let saveObject= Object.assign({},this.modifiedPODetails[i]);
                    saveObject.StateCode = 1;
                    saveModPO.push(Object.assign({},saveObject));
        
                  }
                }
              }
    }
    return saveModPO && saveModPO.length > 0 ? saveModPO : [];
  }

  changeInOBAllocation() {

    //For Sl
    if (this.BSSLDetails.length == this.OrderSLDetails.length) {
      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
        let SLObject: any = this.BSSLDetails[sl].BSServiceLine;

        let filteredSlData = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == SLObject.WiproServicelineidValue &&
          it.BSServiceLine.WiproPracticeId == SLObject.WiproPracticeId &&
          it.BSServiceLine.WiproSubpracticeid == SLObject.WiproSubpracticeid &&
          it.BSServiceLine.WiproSlbdmid == SLObject.WiproSlbdmid &&
          it.BSServiceLine.WiproPercentageOftcv == SLObject.WiproPercentageOftcv &&
          it.BSServiceLine.WiproEstsltcv == SLObject.WiproEstsltcv &&
          it.BSServiceLine.Cloud == SLObject.Cloud &&
          it.BSServiceLine.PricingTypeId == SLObject.PricingTypeId &&
          it.BSServiceLine.WiproEngagementModel == SLObject.WiproEngagementModel &&
          it.BSServiceLine.WiproDualCredit == SLObject.WiproDualCredit);

        let filteredsavedSL: any = this.OrderSLDetails.filter(it => it.WiproServicelineidValue == SLObject.WiproServicelineidValue &&
          it.WiproPracticeId == SLObject.WiproPracticeId &&
          it.WiproSubpracticeid == SLObject.WiproSubpracticeid &&
          it.WiproSlbdmid == SLObject.WiproSlbdmid &&
          it.WiproPercentageOftcv == SLObject.WiproPercentageOftcv &&
          it.WiproEstsltcv == SLObject.WiproEstsltcv &&
          it.Cloud == SLObject.Cloud &&
          it.PricingTypeId == SLObject.PricingTypeId &&
          it.WiproEngagementModel == SLObject.WiproEngagementModel &&
          it.WiproDualCredit == SLObject.WiproDualCredit)

        if (filteredsavedSL.length == 1) {
          let SLObjectCloud = SLObject.AdditionalServiceLinesCloudDetails.filter(it => it.CloudStatecode != 1);

          if (SLObjectCloud.length == filteredsavedSL[0].AdditionalServiceLinesCloudDetails.length) {

            for (let slcl = 0; slcl < SLObjectCloud.length; slcl++) {
              let CloudObj = SLObjectCloud[slcl];
              let filteredsavedCloud = filteredsavedSL[0].AdditionalServiceLinesCloudDetails.filter(it =>
                it.CategoryId == CloudObj.CategoryId &&
                it.Functionid == CloudObj.Functionid &&
                it.ServiceProviderId == CloudObj.ServiceProviderId &&
                it.TechnologyId == CloudObj.TechnologyId &&
                it.OpenSource == CloudObj.OpenSource &&
                it.Value == CloudObj.Value &&
                it.Remarks == CloudObj.Remarks)

              let filteredCloudObj = SLObjectCloud.filter(it =>
                it.CategoryId == CloudObj.CategoryId &&
                it.Functionid == CloudObj.Functionid &&
                it.ServiceProviderId == CloudObj.ServiceProviderId &&
                it.TechnologyId == CloudObj.TechnologyId &&
                it.OpenSource == CloudObj.OpenSource &&
                it.Value == CloudObj.Value &&
                it.Remarks == CloudObj.Remarks)
              if (filteredsavedCloud.length != filteredCloudObj.length) {
                return true;
              }
            }

          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    } else {
      return true;
    }

    //for IP
    if (this.IpDetails.length == this.OrderIPDetails.length) {
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
        let IPObject: any = this.IpDetails[ip].IP;
        let filteredIpData: any = this.IpDetails.filter(it =>
          it.IP.IpId == IPObject.IpId &&
          it.IP.WiproModuleValue == IPObject.WiproModuleValue &&
          it.IP.WiproServiceline == IPObject.WiproServiceline &&
          it.IP.WiproPractice == IPObject.WiproPractice &&
          it.IP.WiproSlbdmValue == IPObject.WiproSlbdmValue &&
          it.IP.PricingTypeId == IPObject.PricingTypeId &&
          it.IP.WiproCloud == IPObject.WiproCloud &&
          it.IP.WiproAmcvalue == IPObject.WiproAmcvalue &&
          it.IP.WiproLicenseValue == IPObject.WiproLicenseValue &&
          it.IP.WiproHolmesbdmID == IPObject.WiproHolmesbdmID);

        let filteredsavedIP: any = this.OrderIPDetails.filter(it =>
          it.IpId == IPObject.IpId &&
          it.WiproModuleValue == IPObject.WiproModuleValue &&
          it.WiproServiceline == IPObject.WiproServiceline &&
          it.WiproPractice == IPObject.WiproPractice &&
          it.WiproSlbdmValue == IPObject.WiproSlbdmValue &&
          it.PricingTypeId == IPObject.PricingTypeId &&
          it.WiproCloud == IPObject.WiproCloud &&
          it.WiproAmcvalue == IPObject.WiproAmcvalue &&
          it.WiproLicenseValue == IPObject.WiproLicenseValue &&
          it.WiproHolmesbdmID == IPObject.WiproHolmesbdmID);

        if (filteredsavedIP.length == 1) {
          let IPObjectCloud = IPObject.CloudDetails.filter(it => it.CloudStatecode != 1);
          let IPObjectAdditionalDetails = IPObject.AdditionalSLDetails.filter(it => it.statecode != 1);

          if (IPObjectCloud.length == filteredsavedIP[0].CloudDetails.length) {

            for (let ipcl = 0; ipcl < IPObjectCloud.length; ipcl++) {
              let IpCloudObj = IPObjectCloud[ipcl];
              let filteredCloudObj: any = IPObjectCloud.filter(it =>
                it.CategoryId == IpCloudObj.CategoryId &&
                it.Functionid == IpCloudObj.Functionid &&
                it.ServiceProviderId == IpCloudObj.ServiceProviderId &&
                it.TechnologyId == IpCloudObj.TechnologyId &&
                it.OpenSource == IpCloudObj.OpenSource &&
                it.Value == IpCloudObj.Value &&
                it.Remarks == IpCloudObj.Remarks)

              let filteredsavedCloud: any = filteredsavedIP[0].CloudDetails.filter(it =>
                it.CategoryId == IpCloudObj.CategoryId &&
                it.Functionid == IpCloudObj.Functionid &&
                it.ServiceProviderId == IpCloudObj.ServiceProviderId &&
                it.TechnologyId == IpCloudObj.TechnologyId &&
                it.OpenSource == IpCloudObj.OpenSource &&
                it.Value == IpCloudObj.Value &&
                it.Remarks == IpCloudObj.Remarks)
              if (filteredsavedCloud.length != filteredCloudObj.length) {
                return true;
              }
            }

            for (let ipadd = 0; ipadd < IPObjectAdditionalDetails.length; ipadd++) {
              let IpAddObj = IPObjectAdditionalDetails[ipadd];
              let filteredAddObj: any = IPObjectAdditionalDetails.filter(it =>
                it.wipro_implementationcomment == IpAddObj.wipro_implementationcomment &&
                it.wipro_implementationvalues == IpAddObj.wipro_implementationvalues &&
                it.wipro_customizationcomments == IpAddObj.wipro_customizationcomments &&
                it.wipro_customizationvalue == IpAddObj.wipro_customizationvalue &&
                it.wipro_professionalservicescomment == IpAddObj.wipro_professionalservicescomment &&
                it.wipro_professionalservicesvalues == IpAddObj.wipro_professionalservicesvalues)

              let filteredsavedAdd: any = filteredsavedIP[0].AdditionalSLDetails.filter(it =>
                it.wipro_implementationcomment == IpAddObj.wipro_implementationcomment &&
                it.wipro_implementationvalues == IpAddObj.wipro_implementationvalues &&
                it.wipro_customizationcomments == IpAddObj.wipro_customizationcomments &&
                it.wipro_customizationvalue == IpAddObj.wipro_customizationvalue &&
                it.wipro_professionalservicescomment == IpAddObj.wipro_professionalservicescomment &&
                it.wipro_professionalservicesvalues == IpAddObj.wipro_professionalservicesvalues)

              if (filteredsavedAdd.length != filteredAddObj.length) {
                return true;
              }
            }

          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    } else {
      return true;
    }

    if (this.SolutionDetails.length == this.OrderSolutionDetails.length) {
      for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
        let SolObject: any = this.SolutionDetails[sol].solutions;

        let filteredSavedSol: any = this.OrderSolutionDetails.filter(it =>
          it.WiproType == SolObject.WiproType &&
          it.WiproAccountNameValue == SolObject.WiproAccountNameValue &&
          it.OwnerIdValue == SolObject.OwnerIdValue &&
          it.WiproPercentage == SolObject.WiproPercentage &&
          it.WiproPercentageOfTCV == SolObject.WiproPercentageOfTCV &&
          it.WiproValue == SolObject.WiproValue &&
          it.WiproSolutionBDMValue == SolObject.WiproSolutionBDMValue &&
          it.WiproInfluenceType == SolObject.WiproInfluenceType &&
          it.WiproServiceType == SolObject.WiproServiceType &&
          it.IsDealRegistered === SolObject.IsDealRegistered)

        let filteredSolData: any = this.SolutionDetails.filter(it =>
          it.solutions.WiproType == SolObject.WiproType &&
          it.solutions.WiproAccountNameValue == SolObject.WiproAccountNameValue &&
          it.solutions.OwnerIdValue == SolObject.OwnerIdValue &&
          it.solutions.WiproPercentage == SolObject.WiproPercentage &&
          it.solutions.WiproPercentageOfTCV == SolObject.WiproPercentageOfTCV &&
          it.solutions.WiproValue == SolObject.WiproValue &&
          it.solutions.WiproSolutionBDMValue == SolObject.WiproSolutionBDMValue &&
          it.solutions.WiproInfluenceType == SolObject.WiproInfluenceType &&
          it.solutions.WiproServiceType == SolObject.WiproServiceType &&
          it.solutions.IsDealRegistered === SolObject.IsDealRegistered)

        if (filteredSavedSol.length == 1) {
          if(SolObject.IsDealRegistered === true){
            let SolObjectDealYes = SolObject.DealRegistrationYes.map(it=> { return Object.assign({},it) });
            if (SolObjectDealYes.length == filteredSavedSol[0].DealRegistrationYes.length) {

              for (let soldYes = 0; soldYes < SolObjectDealYes.length; soldYes++) {
                let dealYesObj = SolObjectDealYes[soldYes];
                let filteredsavedDealYes = filteredSavedSol[0].DealRegistrationYes.filter(it =>
                  it.PartnerPortalId == dealYesObj.PartnerPortalId &&
                  it.RegisteredValue == dealYesObj.RegisteredValue &&
                  it.RegistrationStatus == dealYesObj.RegistrationStatus &&
                  it.RegistrationStatusReason == dealYesObj.RegistrationStatusReason &&
                  it.Remarks == dealYesObj.Remarks)
  
                let filteredDealYesObj = SolObjectDealYes.filter(it =>
                  it.PartnerPortalId == dealYesObj.PartnerPortalId &&
                  it.RegisteredValue == dealYesObj.RegisteredValue &&
                  it.RegistrationStatus == dealYesObj.RegistrationStatus &&
                  it.RegistrationStatusReason == dealYesObj.RegistrationStatusReason &&
                  it.Remarks == dealYesObj.Remarks)
                if (filteredsavedDealYes.length != filteredDealYesObj.length) {
                  return true;
                }
              }
          }else{
            return true;
          }
          }else if(SolObject.IsDealRegistered === false){

            let SolObjectDealNo = SolObject.DealRegistrationNo.map(it=> { return Object.assign({},it) });
            if (SolObjectDealNo.length == filteredSavedSol[0].DealRegistrationNo.length) {

              for (let soldNo = 0; soldNo < SolObjectDealNo.length; soldNo++) {
                let dealNoObj = SolObjectDealNo[soldNo];
                let filteredsavedDealNo = filteredSavedSol[0].DealRegistrationNo.filter(it =>
                  it.PartnerPortalId == dealNoObj.PartnerPortalId &&
                  it.RegisteredValue == dealNoObj.RegisteredValue &&
                  it.RegistrationStatus == dealNoObj.RegistrationStatus &&
                  it.RegistrationStatusReason == dealNoObj.RegistrationStatusReason &&
                  it.Remarks == dealNoObj.Remarks)
  
                let filteredDealNoObj = SolObjectDealNo.filter(it =>
                  it.PartnerPortalId == dealNoObj.PartnerPortalId &&
                  it.RegisteredValue == dealNoObj.RegisteredValue &&
                  it.RegistrationStatus == dealNoObj.RegistrationStatus &&
                  it.RegistrationStatusReason == dealNoObj.RegistrationStatusReason &&
                  it.Remarks == dealNoObj.Remarks)
                if (filteredsavedDealNo.length != filteredDealNoObj.length) {
                  return true;
                }
              }
          }else{
            return true;
          }
          }
        }else{
          return true;
        }
      }
    } else {
      return true;
    }

    if (this.creditAllocationdataDetails.length == this.OrdercreditAllocationDetails.length) {
      for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
        let CAObject: any = this.creditAllocationdataDetails[ca].creditAllocation;
        let filteredSavedCA: any = this.OrdercreditAllocationDetails.filter(it =>
          it.WiproTypeId == CAObject.WiproTypeId &&
          it.ServicelineId == CAObject.ServicelineId &&
          it.PracticeId == CAObject.PracticeId &&
          it.SubPracticeId == CAObject.SubPracticeId &&
          it.ServicelineBDMId == CAObject.ServicelineBDMId &&
          it.WiproValue == CAObject.WiproValue &&
          it.Contribution == CAObject.Contribution &&
          it.WiproIsDefault == CAObject.WiproIsDefault)

        let filteredCAData: any = this.creditAllocationdataDetails.filter(it =>
          it.creditAllocation.WiproTypeId == CAObject.WiproTypeId &&
          it.creditAllocation.ServicelineId == CAObject.ServicelineId &&
          it.creditAllocation.PracticeId == CAObject.PracticeId &&
          it.creditAllocation.SubPracticeId == CAObject.SubPracticeId &&
          it.creditAllocation.ServicelineBDMId == CAObject.ServicelineBDMId &&
          it.creditAllocation.WiproValue == CAObject.WiproValue &&
          it.creditAllocation.Contribution == CAObject.Contribution &&
          it.creditAllocation.WiproIsDefault == CAObject.WiproIsDefault)
        if (filteredSavedCA.length != filteredCAData.length) {
          return true;
        }
      }
    } else {
      return true;
    }

    return false;
  }

  validateDealPopUp(solutionData, sol){
    if(solutionData.IsDealRegistered === true){
      for(let i =0 ;i< solutionData.DealRegistrationYes.length; i++){
        let dealyesObj = Object.assign({},solutionData.DealRegistrationYes[i]);
        if(!dealyesObj.RegistrationStatus || !dealyesObj.RegistrationStatusReason || !dealyesObj.RegisteredValue || !dealyesObj.PartnerPortalId){
          this.projectService.displayMessageerror("Please add alliance deal registered details for " + this.converIndextoString(sol) + " row of solution table");
          return true;
        }
      }

    }else if(solutionData.IsDealRegistered === false){
      for(let i =0 ;i< solutionData.DealRegistrationNo.length; i++){
        let dealNoObj = Object.assign({},solutionData.DealRegistrationNo[i]);
        if(!dealNoObj.RegistrationStatusReason || !dealNoObj.Remarks){
          this.projectService.displayMessageerror("Please add alliance deal registered details for " + this.converIndextoString(sol) + " row of solution table");
          return true;
        }
      }
    }

     return false;
  }


  saveBusinessSolution() {
    this.ErrorDisplay = true;
    let totalsolutionvalueAllianceSum = 0;
    let totalsolutionvalueNewAgeSum = 0;
    let totalsolutionvalueSolutionSum = 0;
    let solutionvalueAlliance: any = false;
    let solutionvalueNewAge: any = false;
    let solutionvalueSolution: any = false;
    let totalTCVPerc: any = 0;
    let totalDualCIS = 0;
    let totalCRSDual = 0;
    let totalNonDualCIS = 0;
    let totalCRSNonDual = 0;
    let totalSLTCV: any = 0;
    let totalContributionVericalGeo = 0;
    let VerticalGeo = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let saveObject = {
      Name: this.ModificationName,
      ModificationRequestId: this.ModificationId,
      ModificationRequestStatus: this.ModificationRequestStatus,
      FinanceTeamId: "",
      SalesOrderId: this.OrderId,
      OpportunityId: this.OpportunityId,
      IsWT: this.originalWTFlag,
      SolutionAlliance: [],
      IP: [],
      Serviceline: [],
      CreditAllocation: [],
      OrderOverviewModifications: [],
      OrderPOModification: [],
    };
    if (this.getOverviewSaveValidation() == false) {
      this.scrolltoMandatoryField();
      return;
    } else {
      saveObject.OrderOverviewModifications = this.saveOverviewArray.map(it => Object.assign({}, it));   
      saveObject.OrderPOModification = this.savePODetailsArray.map(it => {
        
        let savePOObj = Object.assign({
          POTableModificationId : it.POTableModificationId ? it.POTableModificationId : "" ,
          OrderModificationId   : this.ModificationId ? this.ModificationId : "" ,
          Wipro_Name            : this.ModificationName ? this.ModificationName : "" ,
          Wipro_OrderId         : this.OrderId ,
          Wipro_PONumber        : it.Wipro_PONumber ? it.Wipro_PONumber : "" ,
          Wipro_OrderPOTableId  : it.Wipro_OrderPOTableId ? it.Wipro_OrderPOTableId : "" ,
          Wipro_Remarks         : it.Wipro_Remarks ? it.Wipro_Remarks : "" ,
          Wipro_SignedDateUTC   : it.Wipro_SignedDateUTC ? this.getIsoDateFormat(it.Wipro_SignedDateUTC) : "" ,
          StateCode             : it.StateCode ,
          POValue               : it.POValue ?  it.POValue : "" ,
          POCurrencyId          : it.POCurrencyId ? it.POCurrencyId : "" , 
          Wipro_StartDate       : it.Wipro_StartDate ? this.getIsoDateFormat(it.Wipro_StartDate) : "",
          Wipro_EndDate         : it.Wipro_EndDate ? this.getIsoDateFormat(it.Wipro_EndDate) : "",
          Wipro_POIssuanceDate  : it.Wipro_POIssuanceDate ? this.getIsoDateFormat(it.Wipro_POIssuanceDate) : "",
          Wipro_ValuewithoutTax : it.Wipro_ValuewithoutTax ? it.Wipro_ValuewithoutTax : "",
         })

         return savePOObj;
         
        });
      
    }
    
    
    if (this.businessSOlutionData[0].Sltcv > this.maxDecimalValue) {
      this.projectService.displayMessageerror("SL TCV value in business solution panel should be less than " + this.maxDecimalValueDisplay);
      return;
    }
    else if (this.businessSOlutionData[0].Sltcv < this.minDecimalValue) {
      this.projectService.displayMessageerror("SL TCV value in business solution panel should be greater than " + this.minDecimalValueDisplay);
      return;
    }
    else if (this.businessSOlutionData[0].IpTcv > this.maxDecimalValue) {
      this.projectService.displayMessageerror("IP TCV value in business solution panel should be less than " + this.maxDecimalValueDisplay);
      return;
    }
    else if (this.businessSOlutionData[0].IpTcv < this.minDecimalValue) {
      this.projectService.displayMessageerror("IP TCV value in business solution panel should be greater than " + this.minDecimalValueDisplay);
      return;
    }
    else if (this.businessSOlutionData[0].OverallTcv > this.maxDecimalValue) {
      this.projectService.displayMessageerror("Overall TCV value in business solution panel should be less than " + this.maxDecimalValueDisplay);
      return;

    }
    else if (this.businessSOlutionData[0].OverallTcv < this.minDecimalValue) {
      this.projectService.displayMessageerror("Overall TCV value in business solution panel should be greater than " + this.minDecimalValueDisplay);
      return;
    }
    else if (this.businessSOlutionData[0].OverallTcv != this.SavedOverallOrderTcv) {
      this.projectService.displayMessageerror("Overall TCV should be equal to order TCV which is " + this.SavedOverallOrderTcv);
      return;
    }
    else {
      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
        if (!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue) {
          this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproPracticeId && this.checkActivePractice(this.BSSLDetails[sl].SlpracticeDD) != 0) {
          this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid && this.checkActivePractice(this.BSSLDetails[sl].SlpracticeDD) != 0 && this.checkActiveSubPractice(this.BSSLDetails[sl].SlSubpracticeDD) != 0) {
          this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.WTFlag && (!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproSlbdmidValueName)) {
          this.projectService.displayMessageerror("Please fill SL BDM data in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv)) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table");
          } else {
            this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table as Est. SL TCV should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table as Est. SL TCV is mandatory and cannot be 0");
          }

          this.scrolltoMandatoryField();
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == false && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.BSSLDetails[sl].cloudFlag && !this.BSSLDetails[sl].CloudDisabled && !this.BSSLDetails[sl].BSServiceLine.Cloud) {
          this.projectService.displayMessageerror("Please select cloudFlag in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.BSSLDetails[sl].BSServiceLine.Cloud && parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) < this.BSSLDetails[sl].CloudTCV) {
          this.projectService.displayMessageerror("Please note that SL TCV value cannot be lesser than cloud TCV value in" + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.PricingTypeId ) {
          this.projectService.displayMessageerror("Please select pricing type in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.WTFlag && !this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel) {
          this.projectService.displayMessageerror("Please select engagement model in " + this.converIndextoString(sl) + " row of service lines table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.BSSLDetails.filter(res =>
          res.BSServiceLine.WiproServicelineidValue == this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && res.BSServiceLine.WiproPracticeId == this.BSSLDetails[sl].BSServiceLine.WiproPracticeId &&
          res.BSServiceLine.WiproSubpracticeid == this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of service line, practice, sub practice and SL BDM is present for " + this.converIndextoString(sl) + " row in service lines table");
          return;
        } else {

          if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "") {
            totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
            if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CIS) {
              totalNonDualCIS = totalNonDualCIS + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            } else if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CRS) {
              totalCRSNonDual = totalCRSNonDual + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            }
          } else if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "") {
            if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CIS) {
              totalDualCIS = totalDualCIS + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
              let DualCRSFiltered = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CRS && it.BSServiceLine.WiproDualCredit == "");
              if (DualCRSFiltered.length <= 0) {
                this.projectService.displayMessageerror("Please add Cybersecurity & Risk Services (CRS) service line as non dual credit for dual-credit reason: CIS - CRS dual credit for " + this.converIndextoString(sl) + " row in service lines table");
                return;
              }
            } else if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CRS) {
              totalCRSDual = totalCRSDual + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
              let DualCISFiltered = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CIS && it.BSServiceLine.WiproDualCredit == "");
              if (DualCISFiltered.length <= 0) {
                this.projectService.displayMessageerror("Please add Cloud & Infrastructure Services (CIS) service line as non dual credit for dual-credit reason: CIS - CRS dual credit for " + this.converIndextoString(sl) + " row in service lines table");
                return;
              }
            }
          }
          let BSSLDataObj = Object.assign({}, this.BSSLDetails[sl].BSServiceLine);
          // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
          BSSLDataObj.AdditionalServiceLinesCloudDetails = (BSSLDataObj.Cloud == false) ? BSSLDataObj.AdditionalServiceLinesCloudDetails.filter(it => {
            if (it.CloudDetailsID || it.OrderCloudDetailsId) {
              it.CloudStatecode = 1;
              return true;
            }
          }) : BSSLDataObj.AdditionalServiceLinesCloudDetails;
          BSSLDataObj.WiproPercentageOftcv = BSSLDataObj.WiproPercentageOftcv ? parseFloat(BSSLDataObj.WiproPercentageOftcv).toFixed(2) : null;
          BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          SLData.push(Object.assign({
            Cloud: BSSLDataObj.Cloud,
            WiproDualCredit: BSSLDataObj.WiproDualCredit,
            WiproEngagementModel: BSSLDataObj.WiproEngagementModel,
            OrderServicelineDetailModificationId: BSSLDataObj.WiproOpportunityServicelineDetailId,
            WiproOpportunityServicelineDetailId: BSSLDataObj.WiproOpportunityServicelineOrderDetailId,
            WiproPercentageOftcv: BSSLDataObj.WiproPercentageOftcv,
            WiproPracticeId: BSSLDataObj.WiproPracticeId,
            WiproSubpracticeid: BSSLDataObj.WiproSubpracticeid,
            WiproSlbdmid: BSSLDataObj.WiproSlbdmid,
            WiproSlbdmidValueName: BSSLDataObj.WiproSlbdmidValueName,
            PricingTypeId : BSSLDataObj.PricingTypeId,
            ServicelineId: BSSLDataObj.WiproServicelineidValue,
            WiproServicelineidValueName: BSSLDataObj.WiproServicelineidValueName,
            WiproEstsltcv: BSSLDataObj.WiproEstsltcv,
            statecode: BSSLDataObj.statecode,
            wiproorderid: BSSLDataObj.wiproOrderid,
            ServiceLineCloudDetails: BSSLDataObj.AdditionalServiceLinesCloudDetails
          }));
        }
      }
      let totalTCVtempPerc: any = totalTCVPerc ? parseFloat(totalTCVPerc).toFixed(2) : '0.00';
      let totalSLTCVtemp: any = totalSLTCV ? parseFloat(totalSLTCV).toFixed(2) : '0.00';
      if (this.BSSLDetails.length <= 0) {
        this.projectService.displayMessageerror("Atleast one service line is mandatory to add");
        return;
      }
      else if (this.BSSLDetails.length > 0 && !this.acceptNegative && this.businessSOlutionData[0].TCVCalculation == true && (parseFloat(totalTCVtempPerc) > 100.05 || parseFloat(totalTCVtempPerc) < 99.95)) {
        this.projectService.displayMessageerror("Total sum of % of TCV in service lines table should be equal to 100 % of SL TCV of business solution panel");
        return;
      } else if (this.BSSLDetails.length > 0 && parseFloat(totalSLTCVtemp) != this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].TCVCalculation == true) {

        this.projectService.displayMessageerror("Total sum of SL TCV in service lines table should be equal to SL TCV of business solution panel");
        return;
      }
      else if (this.BSSLDetails.length > 0 && parseFloat(totalSLTCVtemp) != this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].TCVCalculation == false) {

        this.projectService.displayMessageerror("Total sum of SL TCV in service lines table should be equal to SL TCV of business solution panel");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalDualCIS > totalCRSNonDual) {
        this.projectService.displayMessageerror("CIS - CRS Dual Credit: Dual Credit revenue cannot be greater than non overlapped revenue with Cybersecurity & Risk Services (CRS) Service Line");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalCRSDual > totalNonDualCIS) {
        this.projectService.displayMessageerror("CIS - CRS Dual Credit: Dual Credit revenue cannot be greater than non overlapped revenue with Cloud & Infrastructure Services (CIS) Service Line");
        return;
      }
      else {
        saveObject.Serviceline = SLData;
        this.deleteServiceLIneArray.forEach(it => {
          let deleteSLOBJ = Object.assign({}, it.BSServiceLine);
          saveObject.Serviceline.push(Object.assign({
            Cloud: deleteSLOBJ.Cloud,
            WiproDualCredit: deleteSLOBJ.WiproDualCredit,
            WiproEngagementModel: deleteSLOBJ.WiproEngagementModel,
            OrderServicelineDetailModificationId: deleteSLOBJ.WiproOpportunityServicelineDetailId,
            WiproOpportunityServicelineDetailId: deleteSLOBJ.WiproOpportunityServicelineOrderDetailId,
            WiproPercentageOftcv: deleteSLOBJ.WiproPercentageOftcv,
            WiproPracticeId: deleteSLOBJ.WiproPracticeId,
            WiproSubpracticeid: deleteSLOBJ.WiproSubpracticeid,
            WiproSlbdmid: deleteSLOBJ.WiproSlbdmid,
            WiproSlbdmidValueName: deleteSLOBJ.WiproSlbdmidValueName,
            PricingTypeId : deleteSLOBJ.PricingTypeId,
            ServicelineId: deleteSLOBJ.WiproServicelineidValue,
            WiproServicelineidValueName: deleteSLOBJ.WiproServicelineidValueName,
            WiproEstsltcv: deleteSLOBJ.WiproEstsltcv,
            statecode: 1,
            wiproorderid: deleteSLOBJ.wiproOrderid,
            ServiceLineCloudDetails: deleteSLOBJ.AdditionalServiceLinesCloudDetails.filter(it=> it.CloudDetailsID || it.OrderCloudDetailsId).map(it => {
              let tempSLCloud = Object.assign({}, it);
              tempSLCloud.CloudStatecode = 1;
              return tempSLCloud;
            })
          }))
        });
      }


      for (let ip = 0; ip < this.IpDetails.length; ip++) {
        if (!this.IpDetails[ip].IP.IpName || !this.IpDetails[ip].IP.IpId) {
          this.projectService.displayMessageerror("Please fill IP data in " + this.converIndextoString(ip) + " row of IP table");
          this.scrolltoMandatoryField();
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproModuleName || !this.IpDetails[ip].IP.WiproModuleValue) && this.IpDetails[ip].ModuleDisabled == false) {
          this.projectService.displayMessageerror("Please fill module data in " + this.converIndextoString(ip) + " row of IP table");
          this.scrolltoMandatoryField();
          return;
        }else if(!this.IpDetails[ip].IP.PricingTypeId){
          this.projectService.displayMessageerror("Please fill pricing type in " + this.converIndextoString(ip) + " row of IP table");
          this.scrolltoMandatoryField();
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproAmcvalue || this.IpDetails[ip].IP.WiproAmcvalue == "0.00") && (!this.IpDetails[ip].IP.WiproLicenseValue || this.IpDetails[ip].IP.WiproLicenseValue == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.IpDetails[ip].IP.WiproCloud && (((this.IpDetails[ip].IP.WiproAmcvalue ? parseFloat(this.IpDetails[ip].IP.WiproAmcvalue) : 0) + (this.IpDetails[ip].IP.WiproLicenseValue ? parseFloat(this.IpDetails[ip].IP.WiproLicenseValue) : 0)) < this.IpDetails[ip].CloudTCV)) {
          this.projectService.displayMessageerror("Please note sum of AMC value and license value cannot be lesser that Ip TCV value " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails[ip].HolmesDisable == false && (!this.IpDetails[ip].IP.WiproHolmesbdmID || !this.IpDetails[ip].IP.WiproHolmesbdmName)) {
          this.projectService.displayMessageerror("Please fill holmes BDM data in " + this.converIndextoString(ip) + " row of IP table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.IpDetails.filter(res => res.IP.IpName == this.IpDetails[ip].IP.IpName && res.IP.IpId == this.IpDetails[ip].IP.IpId && res.IP.WiproModuleName == this.IpDetails[ip].IP.WiproModuleName && res.IP.WiproModuleValue == this.IpDetails[ip].IP.WiproModuleValue).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
          return;
        } else {
          let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
          // BSIpDataObj.AdditionalSLDetails = null;
          // BSIpDataObj.CloudDetails = null;
          BSIpDataObj.CloudDetails = (BSIpDataObj.WiproCloud == false) ? BSIpDataObj.CloudDetails.filter(it => {
            if (it.CloudDetailsID || it.OrderCloudDetailsId) {
              it.CloudStatecode = 1;
              return true;
            }
          }) : BSIpDataObj.CloudDetails;
          BSIpDataObj.WiproAmcvalue = BSIpDataObj.WiproAmcvalue ? parseFloat(BSIpDataObj.WiproAmcvalue).toFixed(2) : null;
          BSIpDataObj.WiproLicenseValue = BSIpDataObj.WiproLicenseValue ? parseFloat(BSIpDataObj.WiproLicenseValue).toFixed(2) : null;
          IpData.push(Object.assign({
            wipro_acceptip: false,
            wipro_amcvalue: BSIpDataObj.WiproAmcvalue,
            wipro_cloud: BSIpDataObj.WiproCloud,
            wipro_holmesbdm: BSIpDataObj.WiproHolmesbdmID,
            wipro_licensevalue: BSIpDataObj.WiproLicenseValue,
            wipro_module: BSIpDataObj.WiproModuleValue,
            wipro_ip: BSIpDataObj.IpId,
            wipro_modulecontact: BSIpDataObj.WiproModuleContactId,
            wipro_name: "",
            wipro_orderid: BSIpDataObj.wiproOrderid,
            wipro_practice: BSIpDataObj.WiproPractice,
            wipro_serviceline: BSIpDataObj.WiproServiceline,
            wipro_slbdm: BSIpDataObj.WiproSlbdmValue,
            PricingTypeId : BSIpDataObj.PricingTypeId,
            ordersipsID: BSIpDataObj.WiproOpportunityIpId,
            OrderIpId: BSIpDataObj.OrderIpId,
            wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid: BSIpDataObj.CloudDetails,
            wipro_orderipadditionaldetail: BSIpDataObj.AdditionalSLDetails,
            statecode: BSIpDataObj.statecode
          }));
        }
      }
      saveObject.IP = IpData;
      this.deleteIPArray.forEach(it => {
        let deleteIPOBJ = Object.assign({}, it.IP);
        saveObject.IP.push(Object.assign({
          wipro_acceptip: false,
          wipro_amcvalue: deleteIPOBJ.WiproAmcvalue,
          wipro_cloud: deleteIPOBJ.WiproCloud,
          wipro_holmesbdm: deleteIPOBJ.WiproHolmesbdmID,
          wipro_licensevalue: deleteIPOBJ.WiproLicenseValue,
          wipro_module: deleteIPOBJ.WiproModuleValue,
          wipro_ip: deleteIPOBJ.IpId,
          wipro_modulecontact: deleteIPOBJ.WiproModuleContactId,
          wipro_name: "",
          wipro_orderid: deleteIPOBJ.wiproOrderid,
          wipro_practice: deleteIPOBJ.WiproPractice,
          wipro_serviceline: deleteIPOBJ.WiproServiceline,
          wipro_slbdm: deleteIPOBJ.WiproSlbdmValue,
          PricingTypeId : deleteIPOBJ.PricingTypeId,
          ordersipsID: deleteIPOBJ.WiproOpportunityIpId,
          OrderIpId: deleteIPOBJ.OrderIpId,
          wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid: deleteIPOBJ.CloudDetails.filter(it=> it.CloudDetailsID || it.OrderCloudDetailsId).map(it => {
            let tempIPCloud = Object.assign({}, it);
            tempIPCloud.CloudStatecode = 1;
            return tempIPCloud;
          }),
          wipro_orderipadditionaldetail: deleteIPOBJ.AdditionalSLDetails.filter(it=> it.wipro_orderipadditionaldetailid || it.OrderIpAdditionalDetailsId).map(it => {
            let tempAddIPdetails = Object.assign({}, it);
            tempAddIPdetails.statecode = 1;
            return tempAddIPdetails
          }),
          statecode: 1
        }))
      });


      for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
        if (!this.SolutionDetails[sol].solutions.WiproType) {
          this.projectService.displayMessageerror("Please select type in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.SolutionDetails[sol].solutions.WiproAccountname || !this.SolutionDetails[sol].solutions.WiproAccountNameValue) {
          this.projectService.displayMessageerror("Please fill name in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        } 
        else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" &&(!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
          this.projectService.displayMessageerror("Please fill Owner in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        }
        else if ((!this.SolutionDetails[sol].solutions.WiproPercentageOfTCV || this.SolutionDetails[sol].solutions.WiproPercentageOfTCV == "0.00") && (!this.SolutionDetails[sol].solutions.WiproValue || this.SolutionDetails[sol].solutions.WiproValue == "0.00")) {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table");
          }
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && (!this.SolutionDetails[sol].solutions.WiproSolutionBDMName || !this.SolutionDetails[sol].solutions.WiproSolutionBDMName)) {
          this.projectService.displayMessageerror("Please fill solution BDM data in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && !this.SolutionDetails[sol].solutions.WiproInfluenceType) {
          this.projectService.displayMessageerror("Please select influence type in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && this.SolutionDetails[sol].solutions.WiproInfluenceType != "184450001" && !this.SolutionDetails[sol].solutions.WiproServiceType) {
          this.projectService.displayMessageerror("Please select service type in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450000" && this.SolutionDetails[sol].solutions.IsDealRegistered === "") {
          this.projectService.displayMessageerror("Please select deal registered in " + this.converIndextoString(sol) + " row of solution table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450000" && this.validateDealPopUp(this.SolutionDetails[sol].solutions,sol) == true) {
          return;
        }
        else if (this.SolutionDetails.filter(res => res.solutions.WiproType == this.SolutionDetails[sol].solutions.WiproType && res.solutions.WiproAccountname == this.SolutionDetails[sol].solutions.WiproAccountname && res.solutions.WiproAccountNameValue == this.SolutionDetails[sol].solutions.WiproAccountNameValue).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of type and name is present for " + this.converIndextoString(sol) + " row in solution table");
          return;
        } else {
          if (this.SolutionDetails[sol].solutions.WiproType == "184450000") {
            totalsolutionvalueAllianceSum = totalsolutionvalueAllianceSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
            solutionvalueAlliance = true;
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450002") {
            totalsolutionvalueNewAgeSum = totalsolutionvalueNewAgeSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
            solutionvalueNewAge = true;
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450001") {
            totalsolutionvalueSolutionSum = totalsolutionvalueSolutionSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
            solutionvalueSolution = true;
          }
          let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
          let tempdealRegistrationId = BSsolutionDataObj.DealRegistrationYes[0].DealRegistrationId ?  BSsolutionDataObj.DealRegistrationYes[0].DealRegistrationId : 
      (BSsolutionDataObj.DealRegistrationNo[0].DealRegistrationId ? BSsolutionDataObj.DealRegistrationNo[0].DealRegistrationId : "");

      let tempOrderdealRegistrationId = BSsolutionDataObj.DealRegistrationYes[0].OrderDealRegistrationId ?  BSsolutionDataObj.DealRegistrationYes[0].OrderDealRegistrationId : 
      (BSsolutionDataObj.DealRegistrationNo[0].OrderDealRegistrationId ? BSsolutionDataObj.DealRegistrationNo[0].OrderDealRegistrationId : "");

          BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
          BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
          SolutionData.push(Object.assign({
            OwnerIdValue: BSsolutionDataObj.OwnerIdValue,
            OwnerIdValueName: BSsolutionDataObj.OwnerIdValueName,
            WiproAccountNameValue: BSsolutionDataObj.WiproAccountNameValue,
            WiproInfluenceType: BSsolutionDataObj.WiproInfluenceType,
            WiproAccountname: BSsolutionDataObj.WiproAccountname,
            WiproOpportunitySolutionDetailId: BSsolutionDataObj.WiproOpportunitySolutionDetailId,
            OrderSolutionId: BSsolutionDataObj.OrderSolutionId,
            WiproPercentage: BSsolutionDataObj.WiproPercentage,
            WiproPercentageOfTCV: BSsolutionDataObj.WiproPercentageOfTCV,
            WiproServiceType: BSsolutionDataObj.WiproServiceType,
            WiproSolutionBDMValue: BSsolutionDataObj.WiproSolutionBDMValue,
            WiproSolutionBDMName: BSsolutionDataObj.WiproSolutionBDMName,
            WiproType: BSsolutionDataObj.WiproType,
            WiproValue: BSsolutionDataObj.WiproValue,
            wiproorderid: BSsolutionDataObj.wiproOrderid,
            statecode: BSsolutionDataObj.statecode,
            OrderModDealRegistration: BSsolutionDataObj.WiproType == '184450000' ? 
        (BSsolutionDataObj.IsDealRegistered === true ? (BSsolutionDataObj.DealRegistrationYes.map(it => {
          return Object.assign({
            ModDealRegistrationId : it.DealRegistrationId,
            OrderDealRegistrationId : it.OrderDealRegistrationId,
            IsDealRegistered : true,
            OrderSolutionId : BSsolutionDataObj.OrderSolutionId,
            ModSolutionId : it.SolutionId,
            PartnerPortalId : it.PartnerPortalId,
            RegisteredValue : it.RegisteredValue,
            RegistrationStatus : it.RegistrationStatus,
            RegistrationStatusName : it.RegistrationStatusName,
            RegistrationStatusReason : it.RegistrationStatusReason,
            RegistrationStatusReasonName : it.RegistrationStatusReasonName,
            Remarks : it.Remarks,
            Statecode : it.DealRegistrationId ? 2 : 0
          });
        }) ) : (BSsolutionDataObj.DealRegistrationNo.map(it => {
          return Object.assign({
            ModDealRegistrationId : it.DealRegistrationId,
            OrderDealRegistrationId : it.OrderDealRegistrationId,
            IsDealRegistered : false,
            OrderSolutionId : BSsolutionDataObj.OrderSolutionId,
            ModSolutionId : it.SolutionId,
            PartnerPortalId : it.PartnerPortalId,
            RegisteredValue : it.RegisteredValue,
            RegistrationStatus : it.RegistrationStatus,
            RegistrationStatusName : it.RegistrationStatusName,
            RegistrationStatusReason : it.RegistrationStatusReason,
            RegistrationStatusReasonName : it.RegistrationStatusReasonName,
            Remarks : it.Remarks,
            Statecode : it.DealRegistrationId ? 2 : 0
          });
        }) )
        ) :  (tempdealRegistrationId || tempOrderdealRegistrationId ? (BSsolutionDataObj.DealRegistrationNo.map(it => {
          return Object.assign({
            ModDealRegistrationId : it.DealRegistrationId,
            OrderDealRegistrationId : it.OrderDealRegistrationId,
            IsDealRegistered : it.IsDealRegistered,
            OrderSolutionId : BSsolutionDataObj.OrderSolutionId,
            ModSolutionId : it.SolutionId,
            PartnerPortalId : it.PartnerPortalId,
            RegisteredValue : it.RegisteredValue,
            RegistrationStatus : it.RegistrationStatus,
            RegistrationStatusName : it.RegistrationStatusName,
            RegistrationStatusReason : it.RegistrationStatusReason,
            RegistrationStatusReasonName : it.RegistrationStatusReasonName,
            Remarks : it.Remarks,
            Statecode : 1
          });
        }) ) : [])
          }));
        }
      }
      if (solutionvalueAlliance == true && totalsolutionvalueAllianceSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of alliance type should be equal to or less than overall TCV of business solution panel");
        return;
      }
      else if (solutionvalueAlliance == true && totalsolutionvalueAllianceSum < this.minDecimalValue) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of alliance type should be greater than " + this.minDecimalValueDisplay);
        return;
      }
      else if (solutionvalueNewAge == true && totalsolutionvalueNewAgeSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of new age business partner type should be equal to or less than overall TCV of business solution panel");
        return;
      }
      else if (solutionvalueNewAge == true && totalsolutionvalueNewAgeSum < this.minDecimalValue) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of new age business partner type should be greater than " + this.minDecimalValueDisplay);
        return;
      }
      else if (solutionvalueSolution == true && totalsolutionvalueSolutionSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of solution type should be equal to or less than overall TCV of business solution panel");
        return;
      }
      else if (solutionvalueSolution == true && totalsolutionvalueSolutionSum < this.minDecimalValue) {
        this.projectService.displayMessageerror("Total sum of solution value in solution table that is of solution type should be greater than " + this.minDecimalValueDisplay);
        return;
      }
      else {
        saveObject.SolutionAlliance = SolutionData;
        this.deleteSolutionArray.forEach(it => {
          let deleteSolOBJ = Object.assign({}, it.solutions);
          let tempdeletedealRegistrationId = deleteSolOBJ.DealRegistrationYes[0].DealRegistrationId ?  deleteSolOBJ.DealRegistrationYes[0].DealRegistrationId : 
      (deleteSolOBJ.DealRegistrationNo[0].DealRegistrationId ? deleteSolOBJ.DealRegistrationNo[0].DealRegistrationId : "");

      let tempdeleteOrderdealRegistrationId = deleteSolOBJ.DealRegistrationYes[0].OrderDealRegistrationId ?  deleteSolOBJ.DealRegistrationYes[0].OrderDealRegistrationId : 
      (deleteSolOBJ.DealRegistrationNo[0].OrderDealRegistrationId ? deleteSolOBJ.DealRegistrationNo[0].OrderDealRegistrationId : "");

          saveObject.SolutionAlliance.push(Object.assign({
            OwnerIdValue: deleteSolOBJ.OwnerIdValue,
            OwnerIdValueName: deleteSolOBJ.OwnerIdValueName,
            WiproAccountNameValue: deleteSolOBJ.WiproAccountNameValue,
            WiproInfluenceType: deleteSolOBJ.WiproInfluenceType,
            WiproAccountname: deleteSolOBJ.WiproAccountname,
            WiproOpportunitySolutionDetailId: deleteSolOBJ.WiproOpportunitySolutionDetailId,
            OrderSolutionId: deleteSolOBJ.OrderSolutionId,
            WiproPercentage: deleteSolOBJ.WiproPercentage,
            WiproPercentageOfTCV: deleteSolOBJ.WiproPercentageOfTCV,
            WiproServiceType: deleteSolOBJ.WiproServiceType,
            WiproSolutionBDMValue: deleteSolOBJ.WiproSolutionBDMValue,
            WiproSolutionBDMName: deleteSolOBJ.WiproSolutionBDMName,
            WiproType: deleteSolOBJ.WiproType,
            WiproValue: deleteSolOBJ.WiproValue,
            wiproorderid: deleteSolOBJ.wiproOrderid,
            statecode: 1,
            OrderModDealRegistration: (tempdeletedealRegistrationId || tempdeleteOrderdealRegistrationId? (deleteSolOBJ.DealRegistrationNo.map(it => {
              return Object.assign({
                ModDealRegistrationId : tempdeletedealRegistrationId,
                OrderDealRegistrationId : tempdeleteOrderdealRegistrationId,
                IsDealRegistered : it.IsDealRegistered,
                OrderSolutionId : deleteSolOBJ.OrderSolutionId,
                ModSolutionId : it.SolutionId,
                PartnerPortalId : it.PartnerPortalId,
                RegisteredValue : it.RegisteredValue,
                RegistrationStatus : it.RegistrationStatus,
                RegistrationStatusName : it.RegistrationStatusName,
                RegistrationStatusReason : it.RegistrationStatusReason,
                RegistrationStatusReasonName : it.RegistrationStatusReasonName,
                Remarks : it.Remarks,
                Statecode : 1
              });
            }) ) : [])
          }))
        });
      }



      for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
        if (!this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId) {
          this.projectService.displayMessageerror("Please select credit type in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && !this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId) {
          this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && !this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].practiceDD.length != 0) {
          this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        } else if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && !this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId && this.creditAllocationdataDetails[ca].subPracticeDD.length != 0) {
          this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.WTFlag && (!this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName || !this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId)) {
          this.projectService.displayMessageerror("Please fill BDM data in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.WTFlag && this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001' && (!this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName || !this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId)) {
          this.projectService.displayMessageerror("Please fill BDM data in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (this.WTFlag && !this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault && this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && (!this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName || !this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId)) {
          this.projectService.displayMessageerror("Please fill BDM data in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.creditAllocationdataDetails[ca].creditAllocation.Contribution || this.creditAllocationdataDetails[ca].creditAllocation.Contribution == '0.00') {
          this.projectService.displayMessageerror("Please fill contribution data in " + this.converIndextoString(ca) + " row of credit allocation table");
          this.scrolltoMandatoryField();
          return;
        }
        else if (!this.WTFlag && this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && this.creditAllocationdataDetails.filter(res =>
          res.creditAllocation.WiproTypeId == this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId &&
          res.creditAllocation.ServicelineBDMName == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName &&
          res.creditAllocation.ServicelineBDMId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId &&
          res.creditAllocation.ServicelineId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId &&
          res.creditAllocation.PracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId &&
          res.creditAllocation.SubPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId
        ).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of credit type, BDM, service line, practice and sub practice is present for " + this.converIndextoString(ca) + " row in credit allocation table");
          return;
        }
        else if (this.WTFlag && !this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault && this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && this.creditAllocationdataDetails.filter(res =>
          res.creditAllocation.WiproTypeId == this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId &&
          res.creditAllocation.ServicelineBDMName == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName &&
          res.creditAllocation.ServicelineBDMId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId &&
          res.creditAllocation.ServicelineId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId &&
          res.creditAllocation.PracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId &&
          res.creditAllocation.SubPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId
        ).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of credit type, BDM, service line, practice and sub practice is present for " + this.converIndextoString(ca) + " row in credit allocation table");
          return;
        }
        else if (this.WTFlag && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault && this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId && this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001' && this.creditAllocationdataDetails.filter(res =>
          res.creditAllocation.WiproTypeId == this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId &&
          res.creditAllocation.ServicelineBDMName == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName &&
          res.creditAllocation.ServicelineBDMId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId &&
          res.creditAllocation.ServicelineId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId &&
          res.creditAllocation.PracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId &&
          res.creditAllocation.SubPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId
        ).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of credit type, BDM, service line, practice and sub practice is present for " + this.converIndextoString(ca) + " row in credit allocation table");
          return;
        }
        else if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001' && this.creditAllocationdataDetails.filter(res =>
          res.creditAllocation.WiproTypeId == this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId &&
          res.creditAllocation.ServicelineBDMName == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName &&
          res.creditAllocation.ServicelineBDMId == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId
        ).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of credit type, BDM is present for " + this.converIndextoString(ca) + " row in credit allocation table");
          return;
        }
        else {
          let EstSLTCVSumValue: any = 0;
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
            totalContributionVericalGeo = totalContributionVericalGeo + parseFloat(this.creditAllocationdataDetails[ca].creditAllocation.Contribution);
            EstSLTCVSumValue = this.businessSOlutionData[0].OverallTcv;
            VerticalGeo = true;
          } else if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId != '184450001') {
            EstSLTCVSumValue = this.BSSLDetails.reduce((prevVal, elem) => {
              if (elem.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && elem.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId &&
                elem.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId) {
                prevVal = prevVal ? prevVal : 0
                let EstSLTCV: any = this.acceptNegative ? (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.negativeregex) : (elem.BSServiceLine.WiproEstsltcv.toString()).match(this.positiveregex);
                return prevVal + (EstSLTCV && EstSLTCV.length > 0 && EstSLTCV[0] && !this.isNaNCheck(EstSLTCV[0]) ? parseFloat(EstSLTCV[0]) : 0);
              } else {
                return prevVal;
              }
            }, 0);

          }

          let BScreditAllocationDataObj = Object.assign({}, this.creditAllocationdataDetails[ca].creditAllocation);
          if (BScreditAllocationDataObj.WiproTypeId != '184450001') {
            if (this.BSSLDetails.filter(it => BScreditAllocationDataObj.ServicelineId == it.BSServiceLine.WiproServicelineidValue && BScreditAllocationDataObj.PracticeId == it.BSServiceLine.WiproPracticeId && BScreditAllocationDataObj.SubPracticeId == it.BSServiceLine.WiproSubpracticeid).length == 0) {
              BScreditAllocationDataObj.statecode = 1;
            }
          }
          BScreditAllocationDataObj.WiproValue = EstSLTCVSumValue ? parseFloat(EstSLTCVSumValue).toFixed(2) : null;
          BScreditAllocationDataObj.Contribution = BScreditAllocationDataObj.Contribution ? parseFloat(BScreditAllocationDataObj.Contribution).toFixed(2) : null;
          creditAllocation.push(Object.assign({
            wiproorderid: BScreditAllocationDataObj.wiproOrderid,
            PracticeId: BScreditAllocationDataObj.PracticeId,
            ServicelineId: BScreditAllocationDataObj.ServicelineId,
            SubPracticeId: BScreditAllocationDataObj.SubPracticeId,
            ServicelineBDMId: BScreditAllocationDataObj.ServicelineBDMId,
            ServicelineBDMName: BScreditAllocationDataObj.ServicelineBDMName,
            WiproTypeId: BScreditAllocationDataObj.WiproTypeId,
            WiproValue: BScreditAllocationDataObj.WiproValue,
            Contribution: BScreditAllocationDataObj.Contribution,
            OrderCreditAllocationModificationId: BScreditAllocationDataObj.WiproOpportunityCreditAllocationID,
            WiproOpportunityCreditAllocationID: BScreditAllocationDataObj.WiproOrderCreditAllocationID,
            IsDefault: BScreditAllocationDataObj.WiproIsDefault,
            statecode: BScreditAllocationDataObj.statecode
          }));
        }

      }
      if (VerticalGeo && totalContributionVericalGeo != 100) {
        this.projectService.displayMessageerror("Total sum of contribution for credit type vertical/Geo should be equal to 100 in credit allocation table");
        return;
      } else {
        saveObject.CreditAllocation = creditAllocation;
        this.deleteCreditAllocationArray.forEach(it => {
          let deleteCAOBJ = Object.assign({}, it.creditAllocation);
          saveObject.CreditAllocation.push(Object.assign({
            wiproorderid: deleteCAOBJ.wiproOrderid,
            PracticeId: deleteCAOBJ.PracticeId,
            ServicelineId: deleteCAOBJ.ServicelineId,
            SubPracticeId: deleteCAOBJ.SubPracticeId,
            ServicelineBDMId: deleteCAOBJ.ServicelineBDMId,
            ServicelineBDMName: deleteCAOBJ.ServicelineBDMName,
            WiproTypeId: deleteCAOBJ.WiproTypeId,
            WiproValue: deleteCAOBJ.WiproValue,
            Contribution: deleteCAOBJ.Contribution,
            OrderCreditAllocationModificationId: deleteCAOBJ.WiproOpportunityCreditAllocationID,
            WiproOpportunityCreditAllocationID: deleteCAOBJ.WiproOrderCreditAllocationID,
            IsDefault: deleteCAOBJ.WiproIsDefault,
            statecode: 1
          }))
        });
      }

      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
        let childCreditAllocation = this.creditAllocationdataDetails.reduce((prevVal, elem) => {
          if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == elem.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == elem.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == elem.creditAllocation.SubPracticeId) {
            prevVal = prevVal ? prevVal : 0
            let contribution: any = (elem.creditAllocation.Contribution.toString()).match(this.positiveregex);
            return prevVal + (contribution && contribution.length > 0 && contribution[0] && !this.isNaNCheck(contribution[0]) ? parseFloat(contribution[0]) : 0);
          } else {
            return prevVal;
          }
        }, 0);
        if (childCreditAllocation != 100 && this.creditAllocationdataDetails.filter(it => this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == it.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == it.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == it.creditAllocation.SubPracticeId).length > 0) {
          this.projectService.displayMessageerror("Percentage contribution value for same combination of Serviceline-Practice-SubPractice is " + childCreditAllocation + "%. Please make sure to make it equal to 100%");
          // this.projectService.displayMessageerror("Total sum of contribution percentage in credit allocation table that belongs to " + this.converIndextoString(sl) + " row in service lines table is not 100%");
          return;
        }
      }

      if (this.changeInOBAllocation() == true) {
        this.saveBusinessSolutionData(saveObject);
      } else {
        if (this.ModificationOBAllocation) {
          this.deleteModificationOBAllocation(saveObject)
        } else if (saveObject.OrderOverviewModifications.length > 0) {
          this.saveOnlyOverview(saveObject);
        } else {
          this.projectService.displayMessageerror("No data has been changed for modification");
          this.ErrorDisplay = false;
          this.scrolltoMandatoryField();
          return;
        }
      }



    }

  }

  saveOnlyOverview(saveObject) {
    saveObject.Serviceline = [];
    saveObject.IP = [];
    saveObject.SolutionAlliance = [];
    saveObject.CreditAllocation = [];
    this.saveBusinessSolutionData(saveObject);
  }

  deleteModificationOBAllocation(saveObject) {
    let servicelinearray = saveObject.Serviceline.filter(it => it.OrderServicelineDetailModificationId);
    saveObject.Serviceline = servicelinearray.map(it => {
      let tempSl = Object.assign({}, it);
      tempSl.statecode = 1
      let CloudSLArray = tempSl.ServiceLineCloudDetails.filter(it => it.CloudDetailsID)
      tempSl.ServiceLineCloudDetails = CloudSLArray.map(slcl => {
        let tempSlCloud = Object.assign({}, slcl);
        tempSlCloud.CloudStatecode = 1;
        return tempSlCloud
      })
      return tempSl
    });

    let Iparray = saveObject.IP.filter(it => it.ordersipsID);
    saveObject.IP = Iparray.map(it => {
      let tempIp = Object.assign({}, it);
      tempIp.statecode = 1
      let CloudIpArray = tempIp.wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid.filter(it => it.CloudDetailsID);
      tempIp.wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid = CloudIpArray.map(ipcl => {
        let tempIpCloud = Object.assign({}, ipcl);
        tempIpCloud.CloudStatecode = 1;
        return tempIpCloud
      })
      let AdditionalIpArray = tempIp.wipro_orderipadditionaldetail.filter(it => it.wipro_orderipadditionaldetailid)
      tempIp.wipro_orderipadditionaldetail = AdditionalIpArray.map(ipadd => {
        let tempIpAdditional = Object.assign({}, ipadd);
        tempIpAdditional.statecode = 1;
        return tempIpAdditional
      })
      return tempIp
    });

    let solutionarray = saveObject.SolutionAlliance.filter(it => it.WiproOpportunitySolutionDetailId);
    saveObject.SolutionAlliance = solutionarray.map(it => {
      let tempSol = Object.assign({}, it);
      tempSol.statecode = 1
      let DealArray = tempSol.OrderModDealRegistration.filter(it => it.ModDealRegistrationId)
      tempSol.OrderModDealRegistration = DealArray.length > 0 ? DealArray.map(deal => {
        let tempSolDeal = Object.assign({},deal);
        tempSolDeal.Statecode = 1;
        return tempSolDeal
      }) : [];
      return tempSol
    });

    let CAarray = saveObject.CreditAllocation.filter(it => it.OrderCreditAllocationModificationId);
    saveObject.CreditAllocation = CAarray.map(it => {
      let tempCA = Object.assign({}, it);
      tempCA.statecode = 1
      return tempCA
    });

    this.saveBusinessSolutionData(saveObject);


  }

  checkCurrencyOnSave(saveObject) {
    let CurrencyValueinDollars = 0;
    this.projectService.getCurrencyStatus(this.CurrencyId).subscribe(currency => {
      if (currency && currency.ResponseObject) {
        let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
        CurrencyValueinDollars = (this.businessSOlutionData[0].OverallTcv && currencyMultiplier) ? (parseFloat(this.businessSOlutionData[0].OverallTcv) / currencyMultiplier) : 0;
        this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars);
      } else {
        this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars);
      }
    }, err => {
      this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars);
    });
  }

  saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars) {
    let OverALLTCVPercChnage = 0;
    if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
      OverALLTCVPercChnage = this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00;
    } else {
      OverALLTCVPercChnage = (((this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
      console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
    }

    if (((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars <= 25000000) || ((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && CurrencyValueinDollars > 25000000)) {
      this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage).subscribe(res => {

          if (res) {
            if (res.error == "saved") {
              this.saveBusinessSolutionData(saveObject);
            } else if (res.error == "CRMerror") {
              this.projectService.throwError(res.message);
            }
            else if (res.error == "APIerror") {
              this.projectService.displayMessageerror(res.message);
            }
          }

        });
      }, err => console.log(err));
    } else {
      this.saveBusinessSolutionData(saveObject);
    }
  }

  saveBusinessSolutionData(saveObject) {

    this.service.loaderhome = true;
    console.log("saveOBJ1", saveObject);
    console.log("saveOBJ1string", JSON.stringify(saveObject));
    //OB Allocation Save
    this.orderService.saveModifyOBAllocation(saveObject).subscribe((response: any) => {
      if (response && response.IsError == false) {
        this.ModificationId = (response && response.ResponseObject) ? (response.ResponseObject) : "";
        this.projectService.clearSession("smartsearchData");
        if (this.fileDataArray.some(it => it.AttachmentId == "") == true && this.ModificationId) {
          this.projectService.throwError('Data saved successfully');
          this.SaveDocumentsDetails();
        } else {
          this.userModifyFrm.form.markAsPristine();
          this.userModifyOverviewFrm.form.markAsPristine(); 
          this.poEdit = false;
          this.Modificationdirty = false;
          this.checkIfOrderCreated();
          this.projectService.throwError('Data saved successfully');
        }
      } else {
        this.service.loaderhome = false;
        if (response && response.Message) {
          this.projectService.throwError(response.Message);
        } else {
          this.projectService.throwError('Error while saving');
        }
      }

    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    })

  }

  opentcvpopup(POpUpdata, OverALLTCVPercChnage) {

    let dialogRef = this.dialog.open(OpenTcvpopupcomponent, {
      width: "900px",
      data: { OppId: this.OpportunityId, TCVChangedetails: POpUpdata, TCVPercChnage: OverALLTCVPercChnage }
    });

    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }


  lookupdata: any = {
    tabledata: [],
    recordCount: this.pageSize,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false,
  };

  //  selectedLookupData(controlName) {
  //     switch(controlName) {
  //       case  'BSSLSLBDM' : {
  //         return (this.selectedleadslinked.length > 0) ? this.selectedleadslinked : []
  //       }

  //     }
  //   }
  openadvancetabsSearch(rowData, controlName, lookUpDD, selecteddata, value, i) {
    this.lookupdata.controlName = controlName;
    this.lookupdata.pageNo = this.defaultpageNumber;
    this.lookupdata.TotalRecordCount = this.totalRecordCount;
    this.lookupdata.nextLink = this.OdatanextLink;
    this.lookupdata.headerdata = opportunityAdvnBSSolutionHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnBSSolutionNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnBSSolutionNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnBSSolutionNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = selecteddata;
    this.lookupdata.tabledata = lookUpDD;
    this.lookupdata.isLoader = false;
    console.log("LookUpData", this.lookupdata);
    // this.projectService.getLookUpFilterData({ dropDownData:lookUpDD , controlName: controlName, isService: false, useFullData: null }).subscribe(res => {


    // })


    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });


    dialogRef.componentInstance.modelEmiter.subscribe((x) => {


      debugger
      console.log(x)
      if (x.action == 'loadMore') {
        console.log("loadMore", x);
        if (controlName == 'BSSLSLBDM') {
          this.getSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSLPricingType') {
          this.getSLPricingTypeDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPIP') {
          this.getIPDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPModule') {
          this.getIPModuleDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPSLBDM') {
          this.getIPSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPPricingType') {
          this.getIPPricingTypeDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPHolmesBDM') {
          this.getIPHolmesBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionName') {
          this.getSolNameDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionOwnerName') {
          this.getSolOwnerNameDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPSolutionBDM') {
          this.getSolSolutionBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSCASLBDM') {
          this.getCABDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }


      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'BSSLSLBDM') {
          this.getSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSLPricingType') {
          this.getSLPricingTypeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPIP') {
          this.getIPDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPModule') {
          this.getIPModuleDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPSLBDM') {
          this.getIPSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPPricingType') {
          this.getIPPricingTypeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPHolmesBDM') {
          this.getIPHolmesBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionName') {
          this.getSolNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionOwnerName') {
          this.getSolOwnerNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPSolutionBDM') {
          this.getSolSolutionBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSCASLBDM') {
          this.getCABDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }

      }



    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'BSSLSLBDM') {
        this.OnCloseOfBSSLBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSSLPricingType') {
        this.OnCloseOfBSSLPricingTypePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPIP') {
        this.OnCloseOfIPPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPModule') {
        this.OnCloseOfIPModulePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPSLBDM') {
        this.OnCloseOfBSIPSLBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPPricingType') {
        this.OnCloseOfBSIPPricingTypePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPHolmesBDM') {
        this.OnCloseOfIPHolmesBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSSolutionName') {
        this.OnCloseOfSolNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSSolutionOwnerName') {
        this.OnCloseOfSolOwnerNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPSolutionBDM') {
        this.OnCloseOfSolSolutionBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSCASLBDM') {
        this.OnCloseOfCABDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
    });
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    if (this.userModifyFrm.dirty || this.userModifyOverviewFrm.dirty) {
      this.Modificationdirty = true;
    }
    else {
      this.Modificationdirty = false;
    }

    if (this.serviceLineLoader == false && this.IpLoader == false && this.solutionLoader == false && this.creditAllocationLoader == false) {
      this.serviceLineLoader = true;
      this.IpLoader = true;
      this.solutionLoader = true;
      this.creditAllocationLoader = true;
      this.service.loaderhome = false;
    }



  }










  //**************************************************************End of Sumit Code*************************************************************//

  //**************************************************************OverView Lookup start*************************************************************//


  openadvanceOverViewSearch(modifyObject, controlName, lookUpDD, selecteddata, value) {
    this.lookupdata.controlName = controlName;
    this.lookupdata.pageNo = this.defaultpageNumber;
    this.lookupdata.TotalRecordCount = this.totalRecordCount;
    this.lookupdata.nextLink = this.OdatanextLink;
    this.lookupdata.headerdata = opportunityAdvnBSSolutionHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnBSSolutionNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnBSSolutionNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnBSSolutionNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = selecteddata;
    this.lookupdata.tabledata = lookUpDD;
    this.lookupdata.isLoader = false;
    console.log("LookUpData", this.lookupdata);
    // this.projectService.getLookUpFilterData({ dropDownData:lookUpDD , controlName: controlName, isService: false, useFullData: null }).subscribe(res => {


    // })


    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });


    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      console.log(x)
      if (x.action == 'loadMore') {
        console.log("loadMore", x);
        if (controlName == 'SAPCode') {
          this.getSapCodeDataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'VSO') {
          this.getVSODataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Advisor') {
          this.getAdvisorDataPushToLookUp(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }


      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'SAPCode') {
          this.getSapCodeOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'VSO') {
          this.getVSOOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Advisor') {
          this.getAdvisorOnsearch(modifyObject, controlName, lookUpDD, selecteddata, value, x);
        }


      }



    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'SAPCode') {
        this.OnCloseOfSapCodePopUp(modifyObject, controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'VSO') {
        this.OnCloseOfVSOPopUp(modifyObject, controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'Advisor') {
        this.OnCloseOfAdvisorPopUp(modifyObject, controlName, lookUpDD, selecteddata, value, result);
      }
    });
  }
  //**************************************************************OverView Lookup End*************************************************************//


  //**************************************************************Upload Start by Saurav*************************************************************//

  getDocuments() {
    this.fileDataArray = [];
    if (this.ModificationId) {
      const payload = {
        OrderModificationRequestId: this.ModificationId,
      }

      this.orderService.getDocuments(payload).subscribe((res: any) => {
        this.fileDataArray = (res && res.ResponseObject && res.ResponseObject.ListOrderModificationAttachment) ? res.ResponseObject.ListOrderModificationAttachment.map(it => {
          return Object.assign({
            UploadFileName: it.UploadFileName,
            UploadedUrl: it.UploadedUrl,
            UniqueKey: it.UniqueKey,
            AttachmentId: it.AttachmentId ? it.AttachmentId : "",
            StateCode: 0
          })
        }) : [];
      }, err => {
        this.fileDataArray = [];
      })
    }
  }


  deleteDocuments(fileObject, index) {
    if (!fileObject.AttachmentId) {
      this.fileDataArray.splice(index, 1);
      this.projectService.throwError('File deleted successfully');
    } else {
      let deleteObj = Object.assign({}, fileObject);
      deleteObj.StateCode = 1;
      let deletearray = new Array(deleteObj);
      let payload = {
        OrderModificationRequestId: this.ModificationId,
        ListOrderModificationAttachment: deletearray
      }
      this.orderService.uploadDocuments(payload).subscribe((response: any) => {
        if (response && response.IsError == true) {
          this.projectService.throwError(response.Message);

        } else {
          this.fileDataArray.splice(index, 1)
          this.projectService.throwError('File deleted successfully');
        }

      }, err => {
        this.projectService.displayerror(err.status);
      })
    }
  }


  SaveDocumentsDetails() {
    const payload = {
      OrderModificationRequestId: this.ModificationId,
      ListOrderModificationAttachment: this.fileDataArray.filter(it => it.AttachmentId == "")
    }
    this.orderService.uploadDocuments(payload).subscribe((response: any) => {
      if (response && response.IsError == true) {
        this.userModifyFrm.form.markAsPristine();
        this.userModifyOverviewFrm.form.markAsPristine();
        this.poEdit = false;
        this.Modificationdirty = false;
        this.checkIfOrderCreated();
        this.projectService.throwError(response.Message);
      } else {
        this.userModifyFrm.form.markAsPristine();
        this.userModifyOverviewFrm.form.markAsPristine();
        this.poEdit = false;
        this.Modificationdirty = false;
        this.checkIfOrderCreated();
      }
    }, err => {
      this.userModifyFrm.form.markAsPristine();
      this.userModifyOverviewFrm.form.markAsPristine();
      this.poEdit = false;
      this.Modificationdirty = false;
      this.checkIfOrderCreated();
      this.projectService.displayerror(err.status);
    })
  }

   public fileOverBase(evt) {
    if (evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      debugger;
      let length = (evt.target.files.length - 1);
      for (var i = 0; i <= length; i++) {
        let index = i;
        this.service.loaderhome = true;
        let file: File = evt.target.files[i];

        const fd: FormData = new FormData();
        fd.append('file', file);
        let fileExtension = (file.name) ? (file.name.split('.').pop()) : '';
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (evt: any) => {
          let arrayBuffer: any = reader.result;
          let uint = new Uint8Array(arrayBuffer);
          let bytes = []
          for (let j = 0; j < 4; j++) {
            bytes.push(uint[j].toString(16))
          }
          let hex = bytes.join('').toUpperCase()
          hex = hex.slice(0, 4);
          console.log("hex", hex);
          if (fileExtension == "exe" || fileExtension == "bin" || fileExtension == "sig" || fileExtension == "pak" || hex == "4D5A") {
            if (index == length) {
              this.service.loaderhome = false;
            }
            this.projectService.displayMessageerror(fileExtension + " is not allowed");
          }
          else if (file.size > 15728640) {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror('uploded file is greater than 15 mb');
          }
          else {
            this.saveFiletoRepo(fd,file, index, length);
          }
          console.log("file upload")

        }
      }
    }
  }
  saveFiletoRepo(filedetails: any,file,index, length) {
      let fileToUpload = [];
    fileToUpload.push(filedetails)
    this.service.loaderhome = true;
    this.fileService.filesToUploadDocument64(fileToUpload).subscribe((res: any) => {
           let SeqLoiName = res[0].ResponseObject.Name;
      let UploadFileName = file.name;
      if (res) {
         let resModName = {
           DownloadFileName : SeqLoiName
        }
        let fileDetails = {
          UploadFileName: UploadFileName,
          UploadedUrl: res[0].ResponseObject.Url,
          UniqueKey: "897",
          AttachmentId: "",
          StateCode: 0
        }
        console.log("sauModify", res);
        this.fileDataArray.push(Object.assign({}, fileDetails,resModName));
       let length = this.fileDataArray.length - 1;
        // let count = 0;
        for (var i = 0; i <= length; i++) {
          for (var j = i + 1; j <= length; j++) {
            if (this.fileDataArray[i].UploadFileName === this.fileDataArray[j].UploadFileName) {
              this.fileDataArray.splice(j, 1);
              length--;
              this.projectService.displayMessageerror('Files which were repeated are removed');
              // count++;
            }
          }
        }
      }
      this.service.loaderhome = false;

    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    })
  }

  downloaFile(i) {
   console.log("sdsdf",this.fileDataArray[i].DownloadFileName);
   let arr = [
     {
       "Name" : this.fileDataArray[i].DownloadFileName
     }];
   
    this.fileService.filesToDownloadDocument64(arr).subscribe((res) =>{
      // this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.service.Base64Download(res);
        })
      } else {
        //  this.ErrorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{
      // this.isLoading = false;
    })
  }
      // public fileOverBase(): void {
  //   if (this.uploader.queue.length > 0) {
  //     let filedetails = Object.assign({}, this.uploader.queue[0]);
  //     this.uploader.queue = [];
  //     console.log("file", filedetails);
  //     let file: any = filedetails.file.rawFile;
  //     let fileExtension = (filedetails.file.name) ? (filedetails.file.name.split('.').pop()) : '';
  //     let reader = new FileReader();
  //     reader.readAsArrayBuffer(file);
  //     reader.onload = (file: any) => {
  //       let arrayBuffer: any = reader.result;
  //       let uint = new Uint8Array(arrayBuffer);
  //       let bytes = []
  //       for (let i = 0; i < 4; i++) {
  //         bytes.push(uint[i].toString(16))
  //       }
  //       let hex = bytes.join('').toUpperCase()
  //       hex = hex.slice(0, 4);
  //       console.log("hex", hex);
  //       if (fileExtension == "exe" || fileExtension == "bin" || fileExtension == "sig" || fileExtension == "pak" || hex == "4D5A") {
  //         this.projectService.displayMessageerror(fileExtension + " file is not allowed");
  //       } else {
  //         this.saveFiletoRepo(filedetails);
  //       }
  //       // this.fileUploadQueue[ind] = file[0];
  //       console.log("file upload")

  //     }
  //   }
  // }
  
  viewContracts() {
    
   let  contractIcer =  this.envr.authConfig.url;
    console.log("sauravcontract" ,contractIcer);
   
    // if (window.document.location.origin == "https://quantumpuat-soe.wipro.com") {
    //   var domainurl = "https://quantumput.wipro.com"
    // }
    // else if (window.document.location.origin == "https://quantumqa-soe.wipro.com") {
    //   var domainurl = "https://quantumqatwo.wipro.com"
    // }

    // else if (window.document.location.origin == "https://quantumuat-soe.wipro.com") {
    //   var domainurl = "https://quantumutwo.wipro.com"
    // }


    this.viewContractNavigate = contractIcer + "/WebResources/icm_ContractListings.html?Data=entity%3Dsalesorder%26accountid%3D" + this.orderBookingId + "%26OrderId%3D" +
      this.orderBookingId + "%26record_Name%3D" + this.OrderNumber + "%26OppId%3D" + (this.OpportunityId ? this.OpportunityId : this.ICMParentOpportunityId) + "%26userid%3D" +
      this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') + "%26app%3Dsalesportal%26navurl%3Dorder"
    console.log('test123', this.viewContractNavigate);
  }


  ValidateContractStatus(){
      let authorizationId: boolean = false;
    if(this.changesAuthorization == 'False'){
      authorizationId = false;
    }else{
      authorizationId = true;
    } let requestPayload = {  
      "OrderBookingId": this.orderBookingId,
      "OpportunityId": this.OpportunityId,
      "Authorization": authorizationId 
    }
    console.log("requestPayload", requestPayload);
    this.orderService.contractStatus(requestPayload).subscribe((data : any) => {
      console.log("icm api", data);
      if(!data.IsError){
        if(data.ResponseObject.flagWarning){
          this.projectService.displayMessageerror(data.ResponseObject.WarningMessage); 
        }else{
          this.openSubmitPopUp();
        }
      }else{
        this.projectService.displayMessageerror(data.Message);
      }
    }),err => {
      this.projectService.displayerror(err.status);
    }
  



    // let authorizationId: boolean = false;
    // if(this.isICMAccount && this.changesAuthorization){ 
     
    //   if(this.changesAuthorization == 'False'){
    //     authorizationId = false;
    //   }else{
    //     authorizationId = true;
    //   }
    //   console.log("vpi", authorizationId);
    //   let requestPayload = {  
    //     "OrderBookingId": this.orderBookingId,
    //     "OpportunityId": this.OpportunityId,
    //     "Authorization": authorizationId 
    //   }
    //   console.log("requestPayload", requestPayload);
    //   this.orderService.contractStatus(requestPayload).subscribe((data : any) => {
    //     console.log("icm api", data);
    //     if(!data.IsError){
    //       if(data.ResponseObject.flagWarning){
    //         this.projectService.displayMessageerror(data.ResponseObject.WarningMessage); 
    //       }else{
    //         this.onsubmit();
    //       }
    //     }else{
    //       this.projectService.displayMessageerror(data.Message);
    //     }
         
    //   })
    // }else{
    //     this.onsubmit();
    // } 
  }





  //**************************************************************Upload End by Saurav*************************************************************//

  onsubmit() {
    if (!this.ModificationOBAllocation && !this.ModificationOverwiew) {
      this.projectService.displayMessageerror("No data has been changed for modification");
    } 
    else if ((this.modifyOrderDetailsObj.SAPModificationId) && this.fileDataArray.some(it => it.AttachmentId != "") == false) {
      this.projectService.displayMessageerror("Please upload supporting approval from IC Team for SAP code modification and save the data");
    }
    else if ((this.modifyOrderDetailsObj.POSOWModificationId) && this.fileDataArray.some(it => it.AttachmentId != "") == false) {
      this.projectService.displayMessageerror("Please upload supporting approval for SOW/PO signed date modification and save the data");
    }
    else if (this.Modificationdirty == true || this.poEdit == true) {
      this.openDialogDelete("You have unsaved changes! If you submit all your unsaved changes will be lost.", "OK", "Alert").subscribe(res => {
        if (res == 'save') {
          if(this.isICMAccount && this.changesAuthorization){
          this.ValidateContractStatus(); 
          }else{
          this.openSubmitPopUp();
          }
        }
      });
     }
    else {
      if(this.isICMAccount && this.changesAuthorization){
        this.ValidateContractStatus(); 
        }else{
      this.openSubmitPopUp();
        }
    }
  }

  openSubmitPopUp() {
    const dialogRef = this.dialog.open(openImpactPopup, {
      width: '600px',
      data: {
        orderId: this.OrderId,
        IsWT: this.WTFlag,
        ModificationId: this.ModificationId,
        ModificationReqNo: this.ModifyRequestNumber,
        SapFieldName: this.modifyOrderDetailsObj.SAPModificationId ? true : false,
        NonSapFieldName: (this.modifyOrderDetailsObj.PSDModificationId || this.modifyOrderDetailsObj.PEDModificationId || this.modifyOrderDetailsObj.AuthModificationId ||
          this.modifyOrderDetailsObj.AdvisorModificationId || this.modifyOrderDetailsObj.VSODModificationId || this.modifyOrderDetailsObj.POSOWModificationId) ? true : false
      }
    });
  }

}



@Component({
  selector: 'impact-popup',
  templateUrl: './impactpopup.html',
  styleUrls: ['./modifyorder.component.scss']
})
export class openImpactPopup {
  goBack() {
    // this.router.navigate(['/opportunity/opportunityview/order'])
    // window.history.back();
  }
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("popup data is", this.data)
  }
  ngOninit() { }

  onAccept() {
    const dialogRef = this.dialog.open(openSubmitPopup, {
      width: '400px',
      data: this.data
    });
    console.log("data..", this.data)
  }
}

@Component({
  selector: 'submit-popup',
  templateUrl: './submitpopup.html',
  styleUrls: ['./modifyorder.component.scss']
})
export class openSubmitPopup {
  orderModificationSubmitFlag: boolean = false;
  goBack() {
    // this.router.navigate(['/opportunity/opportunityview/order'])
    // window.history.back();
  }
  constructor(public router: Router, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public orderService: OrderService,
    public projectService: OpportunitiesService, public loaderService: DataCommunicationService) { }
  ngOninit() { }

  submitforModification() {
    //Submit for IC approval
    // if (this.data.SapFieldName == true) {
    //   this.loaderService.loaderhome = true;
    //   let payload = {
    //     orderID: this.data.orderId,
    //     orderModificationID: this.data.ModificationId,
    //     approvaltype: "Modified Order",
    //     orderType: "Clean Order",
    //     isWT: this.data.IsWT ? "Yes" : "No",
    //     fieldName: "sapcustomercode"
    //   }
    //   console.log("ic approval payload is", payload);
    //   this.orderService.submitForOrderModification(payload).subscribe((res: any) => {
    //     if (!res.has_more) {
    //       this.loaderService.loaderhome = false;
    //       this.orderModificationSubmitFlag = true;
    //       console.log("order modification sub res is", res)
    //       this.projectService.displayMessageerror("Order modification request submitted for IC approval successfully");
    //       this.orderService.setSubmitModificationFlag(this.orderModificationSubmitFlag)
    //     }
    //     else {
    //       this.loaderService.loaderhome = false;
    //       this.projectService.displayMessageerror(res.status);
    //     }
    //     err => {
    //       this.loaderService.loaderhome = false;
    //       this.projectService.displayerror(err.status)
    //     }
    //   });
    // }

    //Submit for BFM approval
    // if (this.data.NonSapFieldName == true) {
    this.loaderService.loaderhome = true;
    let payload = {
      orderID: this.data.orderId,
      orderModificationID: this.data.ModificationId,
      approvaltype: "Modified Order",
      orderType: "Clean Order",
      isWT: this.data.IsWT ? "Yes" : "No",
      // fieldName: "others"
    }
    console.log("submit order payload is", payload);
    this.orderService.submitForOrderModification(payload).subscribe((res: any) => {
      if (!res.has_more) {
        this.loaderService.loaderhome = false;
        this.orderModificationSubmitFlag = true;
        console.log("order modification sub res is", res)
        this.projectService.displayMessageerror("Order modification request submitted successfully");
        this.orderService.setSubmitModificationFlag(this.orderModificationSubmitFlag);
        // window.history.back();
      }
      else {
        this.loaderService.loaderhome = false;
        this.projectService.displayMessageerror(res.status);
      }
    }, err => {
      this.loaderService.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
    // }
  }
}
// modifiedpodetailspopup starts here
@Component({
  selector: 'modifiedpodetails-popup',
  templateUrl: './modifiedpodetailspopup.html',
  styleUrls: ['../opportunity-view/tabs/order/order.component.scss']
})
export class modifiedpodetailspopup {
  savedPOdetails: any = [];
  displayPODetails: any = [] ;
  submitFlag = false;
  readOnlyFlag = false;
  signedMinDate = new Date(1945, 0, 1);
  signedMaxDate = new Date();
  acceptNegative: any = false;
  contractCurrencyName = "";
  contractCurrencyId = "";
  readExceptDate = false;
  @ViewChild('myPOModifyForm') public userPOModifyFrm: NgForm;
  poChange = false;

  constructor(public dialog: MatDialog,
    public cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<modifiedpodetailspopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    private orderService: OrderService,
    public addIPservice: AddIpService) {
    this.readOnlyFlag = data.readOnly;
    this.readExceptDate = data.readExceptDate;
    this.acceptNegative = data.acceptNegative;
    this.poChange = data.poChange;
    // this.dateValidation();
  }

  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  oninputOfPOValue(newValue, i) {
    
    
   this.displayPODetails[i].POValue = newValue && !this.isNaNCheck(newValue) ? parseFloat(newValue).toFixed(2) : "" ;

  }

  ngOnInit() {
    debugger;
    if( this.poChange ) {
      this.userPOModifyFrm.form.markAsDirty();
    }
    this.signedMinDate = new Date(this.data.minStartDate);
    this.signedMaxDate = new Date(this.data.maxStartDate);
    this.contractCurrencyId = this.data.CurrencyId;
    this.contractCurrencyName = this.data.CurrencyName
    this.savedPOdetails = this.data.poDetailsData.map((it) => {
      return Object.assign({
        FrontEndID: Math.random().toString(36).substring(2),
        POTableModificationId: it.POTableModificationId ? it.POTableModificationId : "" , // Row id or primary key of the record
        OrderModificationId: it.OrderModificationId ? it.OrderModificationId : "",
        Wipro_OrderId: it.Wipro_OrderId ? it.Wipro_OrderId : "",
        Wipro_PONumber: it.Wipro_PONumber ? it.Wipro_PONumber : "",
        Wipro_OrderPOTableId: it.Wipro_OrderPOTableId ? it.Wipro_OrderPOTableId : "" , // This is order PO details reference id. If user adding new PO from order modification then it will blank/empty
        Wipro_SignedDate: it.Wipro_SignedDate ? it.Wipro_SignedDate : "",
        Wipro_SignedDateUTC: it.Wipro_SignedDateUTC ? it.Wipro_SignedDateUTC : "",
        Wipro_Remarks: it.Wipro_Remarks ? it.Wipro_Remarks : "",
        StateCode: it.StateCode ? it.StateCode : 0,
        POValue: it.POValue ? it.POValue : "",
        POCurrency: it.POCurrency ? it.POCurrency : "",
        POCurrencyId: it.POCurrencyId ? it.POCurrencyId : "",
        Wipro_StartDate: it.Wipro_StartDate ? it.Wipro_StartDate : "",
        Wipro_EndDate: it.Wipro_EndDate ? it.Wipro_EndDate : "",
        Wipro_POIssuanceDate: it.Wipro_POIssuanceDate ? it.Wipro_POIssuanceDate : "",
        Wipro_ValuewithoutTax: it.Wipro_ValuewithoutTax ? it.Wipro_ValuewithoutTax : "",
      });
    });

    console.log(this.savedPOdetails);
    this.displayPODetails = this.savedPOdetails.filter(it => it.StateCode != 1).map((it) => {
      
      return Object.assign({}, it)
    });
    
  }

  addPODetails() {
    let newPODetails = {
      FrontEndID: Math.random().toString(36).substring(2),
      POTableModificationId: "", // Row id or primary key of the record
      OrderModificationId:  "",
      Wipro_OrderId:  "",
      Wipro_PONumber:  "",
      Wipro_OrderPOTableId:  "" , // This is order PO details reference id. If user adding new PO from order modification then it will blank/empty
      Wipro_SignedDate: "",
      Wipro_SignedDateUTC:  "",
      Wipro_Remarks:  "",
      StateCode:  0,
      POValue:  "",
      POCurrency: this.contractCurrencyName ? this.contractCurrencyName : "",
      POCurrencyId: this.contractCurrencyId ? this.contractCurrencyId : "",
      Wipro_StartDate: "",
      Wipro_EndDate: "",
      Wipro_POIssuanceDate: "",
      Wipro_ValuewithoutTax: ""
    }
    this.displayPODetails.unshift(Object.assign({}, newPODetails));
    this.userPOModifyFrm.form.markAsDirty();
  }

  deletePODetails(POData, i) {
    if ( POData.POTableModificationId && this.displayPODetails.filter(it => it.POTableModificationId ).length == 1) {
      this.projectService.displayMessageerror("Single saved PO details cannot be deleted");
    }
    else {
      this.userPOModifyFrm.form.markAsDirty();
    if (POData.POTableModificationId || POData.Wipro_OrderPOTableId) {
      let index = this.savedPOdetails.findIndex(it => it.FrontEndID == POData.FrontEndID);
      this.displayPODetails.splice(i, 1);
      if (index >= 0) {
        this.savedPOdetails[index].StateCode = 1;
      }
      this.projectService.displayMessageerror("PO details added for deletion successfully, please save the modification");
    } else {
      let index = this.savedPOdetails.findIndex(it => it.FrontEndID == POData.FrontEndID && !it.POTableModificationId);
      this.displayPODetails.splice(i, 1);
      if (index >= 0) {
        this.savedPOdetails.splice(index, 1);
      }
      this.projectService.displayMessageerror("PO details deleted successfully");
    }
  }
  
  }

  ngOnDestroy() {
    
      this.dialogRef.close({
        "PODetails": this.savedPOdetails.map((addColumn) => {
          let newColumn = Object.assign({}, addColumn);
          delete newColumn.FrontEndID;
          return newColumn;
        }), poChange: this.poChange
      });
  
  }

  ngAfterViewChecked() {
    
    this.cdRef.detectChanges();
    if (this.userPOModifyFrm.dirty) {
      this.poChange = true;
    }
    



  }

  savePODetailsFunc() {
    this.submitFlag = true;
    
    let buildSavedDataArray = [];
    for (let i = 0; i < this.displayPODetails.length; i++) {
      if (!this.displayPODetails[i].Wipro_PONumber && !this.displayPODetails[i].Wipro_SignedDate && !this.displayPODetails[i].POCurrencyId && !this.displayPODetails[i].POValue) {
        this.projectService.displayMessageerror("Please enter the PO details");
        return;
      } else if (!this.displayPODetails[i].Wipro_PONumber) {
        this.projectService.displayMessageerror("Please enter the PO number");
        return;
      } else if (!this.displayPODetails[i].Wipro_SignedDateUTC) {
        this.projectService.displayMessageerror("Please enter the PO signed date");
        return;
      } else if (!this.displayPODetails[i].POCurrencyId) {
        this.projectService.displayMessageerror("Please enter the PO currency");
        return;
      } else if (!this.displayPODetails[i].POValue) {
        this.projectService.displayMessageerror("Please enter the PO value");
        return;
      }else if (!this.displayPODetails[i].Wipro_StartDate) {
      this.projectService.displayMessageerror("Please enter the PO start date");
      return;
      }else if (!this.displayPODetails[i].Wipro_EndDate) {
      this.projectService.displayMessageerror("Please enter the PO end date");
      return;
      }else if (!this.displayPODetails[i].Wipro_ValuewithoutTax) {
      this.projectService.displayMessageerror("Please enter the PO value with tax");
      return;
      }else if (!this.displayPODetails[i].Wipro_POIssuanceDate) {
      this.projectService.displayMessageerror("Please enter the PO issuance date");
      return;
      }
      else if (this.displayPODetails[i].POValue && parseFloat(this.displayPODetails[i].POValue) == 0) {
        this.projectService.displayMessageerror("PO value cannot be equal to zero");
        return;
      }
      else if (this.displayPODetails.filter(it => it.Wipro_PONumber.trim() == this.displayPODetails[i].Wipro_PONumber.trim()).length > 1) {
        this.projectService.displayMessageerror("PO details with same PO number are not allowed");
        return;
      } 

      else {
        let SaveOBJ = Object.assign({}, this.displayPODetails[i]);
        buildSavedDataArray.push(SaveOBJ);
      }
    }

    for (let savearr = 0; savearr < buildSavedDataArray.length; savearr++) {
      let index = this.savedPOdetails.findIndex(it => it.FrontEndID == buildSavedDataArray[savearr].FrontEndID);
      if (index >= 0) {
        this.savedPOdetails[index] = Object.assign({}, buildSavedDataArray[savearr]);
      } else {
        this.savedPOdetails.push(Object.assign({}, buildSavedDataArray[savearr]));
      }
    }


    this.submitFlag = false;
    
    this.projectService.displayMessageerror("PO details added successfully");
  }
  //  POCancel(){
  //          this.dialogRef.close({

  //       "PODetails": this.popup_data.map((addColumn) => {
  //         let newColumn = Object.assign({}, addColumn);
  //         delete newColumn.FrontEndID;
  //         return newColumn;
  //       })
  //     });
  //     }

  dateValidation() {
    const minDate = new Date();
    const maxDate = new Date();
    this.signedMaxDate = new Date();
  }

 

  getIsoDateFormat(date) {
    let getDate = new Date(date);

    let setDate = new Date(
      getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000)
    );
    return setDate.toISOString();
  }



}
// modifiedpodetailspopup ends here

