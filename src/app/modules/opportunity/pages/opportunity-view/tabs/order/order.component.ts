
import {
  Component, Inject, OnInit, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef,
  HostListener, Input, AfterViewChecked, OnDestroy
} from '@angular/core';
import { OpportunitiesService, DataCommunicationService, OrderService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material';
import { Router, NavigationStart } from '@angular/router';
import { UploadInput, UploadFile, UploadOutput, UploaderOptions } from 'ngx-uploader';
import { deleteIP1, deleteserviceLine1, Openciopopupcomponent, OpenTcvpopupcomponent, OpenIP, OpenServiceline } from '../business-solution/business-solution.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { SearchpoaHoldersComponent } from './../../../../pages/searchpoa-holders/searchpoa-holders.component';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from "rxjs";
import { FileUploadService } from '@app/core/services/file-upload.service';
import { catchError, map } from "rxjs/operators";
import { of } from 'rxjs/observable/of';
import { AddIpService, opportunityAdvnBSSolutionHeaders, opportunityAdvnBSSolutionNames } from '@app/core/services/add-ip.service';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  IpandServiceLineSL, IpandHolmesInterface,
  creditServiceLineInterface, OrderserviceLineBSDetails, OrderserviceLineBSnterface,
  OrderIpDetails, OrderIPInterface,
  OrdercreditAllocationDetails, OrdercreditAllocationInterface,
  OrdersolutionsInterface, OrdersolutionDetails
} from './../../../../../../core/models/allopportunity.model';
import { RemindbfmPopupComponent } from '../../modals/remindbfm-popup/remindbfm-popup.component';
import { CancelPopupComponent } from '../../modals/cancel-popup/cancel-popup.component';
import { OpenipDeletecomponent, additionalipDeletecomponent } from '../../../ip-additional-details/ip-additional-details.component';
import { OrderApprovalStage, OrderModificationRequestStatus, orderApprovalType, orderTypeId, opportunityTypeId, FileUpload, negativeEnum } from '../order/orderenum';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { OrderRejectmodifiedPopupComponent } from '../../modals/order-rejectmodified-popup/order-rejectmodified-popup.component';
import { environment as env } from '@env/environment';
import 'rxjs/add/observable/of';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { TargetLocator } from 'selenium-webdriver';
import { securedealpopup, integratedDealPopup } from '../../opportunity-view.component';
import { EnvService } from '@app/core/services/env.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  @ViewChild('myOrderForm') public userOrderFrm: NgForm;
  // @ViewChild('target') public elm: ElementRef;
  setNullValue = null;
  EmailListArray: any = [];
  filetoadd = [];
filess = [];
fileNames = [];
dealYes = true;
dealNo = false;
contractFileName: any = [];
  maxlengthValue: number = 17;
  maxDecimalValue = 999999999999.99;
  minDecimalValue = -99999999999.99;
  maxDecimalValueDisplay = 100000000000.00;
  minDecimalValueDisplay = -10000000000.00;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  // negativeregex: any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  // positiveregex: any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  acceptNegative: boolean = false;
  IsDirectAmendment: boolean;
  oppamendd: boolean = false;
  directAmendment: boolean = false;
  disableSubmitForLost: boolean = false;
  acceptNegativeContribution: boolean = false;
  noSLBDMOrEngagement: boolean = false;
  OMPercentage: any = 0;
  DPSDealCreatedOn: any = null;
  DealCreationCutoffDate: any = new Date(2019, 10, 11); // 11- Nov - 2019
  PricingUpdateOn: any = "";
  IsPricingIdSynced: boolean = false;
  DPSSyncAlertMessage: any = "";
  Wipro_SalesOrderId: any = null;
  projectStartDate: any = "";
  projectEndDate: any = "";
  contractSignedDate: any = "";
  ContrcatSigned: any = null;
  savedSignedDate: any = "";
  savedAuthorization: any = true;
  savedContractSigned: any = false;
  ExpectedSignedDateChangeCount: any = 0;
  FirstEnteredExpectedSignedDate: any = "";
  minStartDate = new Date(1945, 0, 1);
  minEndDate = new Date(1945, 0, 1);
  MinOrderTCV: any = "";
  domainurl: any = "";
  IsIndiaSBU = false;
  IsAppirioPureDeal = false;
  PricingId = "";
  showSubmit = false;
  showDualCreditButton = false;
  showWTCRS = false;
  showWTCIS = false;
  showTolerence = false;
  showTolerenceInLimit = false;
  showInvoice = false;
  showForClosure = false;
  ErrorDisplay = false;
  datePipe = new DatePipe('en-US');
  currentDate = new Date().toISOString();
  pricingDPSId = '';
  serviceLineLoader: boolean = true;
  IpLoader: boolean = true;
  solutionLoader: boolean = true;
  creditAllocationLoader: boolean = true;
  Projectionvalue = "";
  ProjectionvalueOverView = "";
  showModification = false;
  showModificationOverView = false;
  disableonApproverDate = false;
  disableOverviewOnPendingWithBFM = false;
  disableOnRoleOverwiew = true;
  disableOnRoleBSPanel = true;
  disableOnRoleBSSL = true;
  disableOnRoleBSIp = true;
  disableOnRoleBSSolution = true;
  disableOnRoleBSCA = true;
  isSearchLoader = false;
  ModificationRequestPendingwithBFM = OrderModificationRequestStatus.ModificationRequestPendingwithBFM;
  approvalStageEnableAllarray = [
    OrderApprovalStage.ApprovedbyADH_VDH_SDH,
    OrderApprovalStage.RejectedbyBFM,
    OrderApprovalStage.RejectedByDM,
    OrderApprovalStage.RejectedByADH_VDH_SDH,
    OrderApprovalStage.OnHoldByBFM,
    OrderApprovalStage.ForeclosureRequestRejectedbyDM,
    OrderApprovalStage.InvoicingRequestRejectedbyBFM,
    OrderApprovalStage.InvoicingRequestApprovedbyBFM,
    OrderApprovalStage.YettobeSubmitted,
  ];
  ApprovedDate = '';
  approvalStageID: any = "";
  ModificationStatus: any = "";
  OrderCamundaProcessId: any = "";
  ModificationCamundaProcessId: any = "";
  ModificationId = "";
  ModificationName = "";
  ModificationRequestStatus = "";
  fileDataArray: any = [];
  OBAllocationAction: any = "";
  OBAllocationRejectReason: any = "";
  ModificationOBAllocation = false;
  OpportunityId: string = this.projectService.getSession("opportunityId"); // for others
  fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
  OpportunityStatus = this.projectService.getSession("opportunityStatus");
  IsAmendment = this.projectService.getSession("IsAmendment");
  CurrencySymbol = "NA"
  CurrencyId = '';
  DealHeaderID = null;
  VerticalId = this.projectService.getSession('verticalId');
  RegionId = this.projectService.getSession('regionId');
  sbuId = this.projectService.getSession('sbuId');
  geoId = this.projectService.getSession('GeoId');
  AccountId = this.projectService.getSession('accountid');
  UserID = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  pageSize = 10;
  defaultpageNumber = 1;
  OdatanextLink = null;
  totalRecordCount = 0;
  SearchTypeHomesBDM = "184450001"
  SearchTypeSolutionBDM = "184450000"
  AllianceSearchType = 6;
  NewAgeSearchType = 15;
  getSolutionNameType = 5;
  SearchType = 7;
  WTFlag = false;
  originalWTFlag = false;
  OrderId = this.projectService.getSession("orderId") ? this.projectService.getSession("orderId") : '';

  amendmentCreationDetails: any = {};
  ParentOrderIdForAmendment = "";
  WiproIsAmendmentLessthan250k: any = false;
  amendmentRemarks: any = null;
  OrderNumber = "";
  OrderCreatedDetails: any = "";
  oppowner: any;
  //Table Details Variable for Business Solution Panel
  allServiceLineDD: any = [];
  allPracticeDD: any = [];
  allSubPracticeDD: any = [];

  businessSOlutionData: any[] = [];
  OverALLSavedTCV: any = "";
  CIS = "CLOUD & INFRASTRUCTURE SERVICES (CIS)";
  CRS = "CYBERSECURITY & RISK SERVICES (CRS)";
  ACS = "ACS";
  //delete Array
  deleteCreditAllocationArray: OrdercreditAllocationDetails[] = [];
  deleteSolutionArray: OrdersolutionDetails[] = [];
  deleteIPArray: OrderIpDetails[] = [];
  deleteServiceLIneArray: OrderserviceLineBSDetails[] = [];
  creditAllocationdataDetails: OrdercreditAllocationDetails[] = [];
  creditAllocationSLDD: creditServiceLineInterface[] = [];
  creditTypeDD = [];
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
  //Table Details Variable for BS SL End

  orderstatus = false;
  selectedAll: boolean;
  isDisabled = false;
  isDisabled1 = false;
  radioval = true;
  panelOpenState1: boolean = false;
  panelOpenState2: boolean = false;
  panelOpenState3: boolean = true;
  panelOpenState4: boolean = true;
  panelOpenState5: boolean = true;
  panelOpenState6: boolean = true;
  panelOpenState7: boolean = true;

  mandatoryFields: any = [];
  validation_window = false;
  fileuploaded = false;
  files: UploadFile[];
  meetingName;
  orderOverviewArray = [];

  wiproContactArray = [];
  wiproLinkedAGPArray = [];
  selectedAllip: boolean;
  selectedAllcredit: boolean;
  selectedAllsol: boolean;

  updatedStage: string = "";
  textshown: boolean = false;

  sapCustomerCodeArr: any = [];
  dataHeader: any;
  currencyCodeArr: any = [];
  contractCurrencyCodeArr: any = [];
  verticalCodeArr: any = [];
  advisorCodeArr: any = [];
  orders: any = [];
  classifications: any = [];
  pricingTypes: any = [];
  CountryArray: any = [];
  countryList: any = [];
  countryName = '';
  countrySysGuid = '';
  disableAccessPermission = true;
  // order overview variables
  selectedReasonValue: any = [];
  modifiedSaveData: any;
  modifiedOrderSaveArray: any = [];
  modifiedOrderPODetails: any = [];
  SalesorderID: any;
  OrderDetails: any;
  CurrentOrderDetails: any;
  CurrentOrderDetailsId: any
  ChangeOrderDetails: any;
  Reasons: any;
  RejectionReason: any;

  stateList: any = [];
  cityList: any = [];
  subDivisions: any = [];
  cityRegions: any = [];

  IsICMAccount: boolean = true;

  defaultValue: any = {
    advisorName: '',
    currency: '',
    sapCode: '',
    country: '',
    verticalOwner: '',
    POAName: '',
    orderType: '',
    ClassificationName: "",
    ApprovalStage: '',
    Wipro_ContractCurrency: '',
    orderNumber: '',
    projectStartDate: '',
    projectEndDate: '',
    countryDetails: {
      contractingCountryId: null,
      state: null,
      contractingCity: null
    }
  };

  signedMinDateVal: any = new Date();
  signedMaxDateVal: any = new Date();
  savedContractingCountryId:any = '';
  orderOverviewObj: any = {
    OrderBookingId: null,
    OpportunityId: null,
    Name: null,
    AccountId: null,
    ClassificationId: null,
    SAPCustomerCode: null,
    StartDate: null,
    EndDate: null,
    CurrencyId: null,
    ContractingCountryId: null,
    CountrySubDivisionState: null,
    CityRegion: null,
    VerticalSalesOwnerId: null,
    AdvisorId: null,
    PriceLevelId: null,
    AdvisorContactId: null,
    AdvisorOwnerId: null,
    OrderTypeId: null,
    OwnerId: null,
    Authorization: null,
    SOWSigned: null,
    PurchaseOrderSigned: null,
    SOWSignedDate: null,
    PurchaseOrderSignedDate: null,
    POAHolderId: null,
    SOWTCV: null,
    OrderTCV: null,
    OpportunityTCV: null,
    TCVDifferenceReason: null,
    TCVDifferenceAmount: null,
    Wipro_ContractCurrency: null,
    NonWTFlag: null,
    DeleteCountrySubDivisionState: null,
    DeleteCityRegion: null,
    OldWipro_ContractCurrency: null,
    DeletePOAHolderId: null,
    IsSubmit: false,
    CrmReferenceNumber: null,
    DelayReason: null,
  }

  orderOverviewValidationValue = {
    OrderBookingId: false,
    OpportunityId: false,
    Name: false,
    AccountId: false,
    PriceLevelId: false,
    CurrencyId: false,
    AdvisorId: false,
    AdvisorContactId: false,
    AdvisorOwnerId: false,
    OrderTypeId: false,
    SAPCustomerCode: false,
    ClassificationId: false,
    StartDate: false,
    EndDate: false,
    ContractingCountryId: false,
    VerticalSalesOwnerId: false,
    OwnerId: false,
    Authorization: false,
    SOWSigned: false,
    SOWTCV: false,
    OrderTCV: false,
    OpportunityTCV: false,
    PurchaseOrderSignedDate: false,
    PurchaseOrderSigned: false,
    CountrySubDivisionState: false,
    CityRegion: false,
    SOWSignedDate: false,
    POAHolderId: false,
    TCVDifferenceReason: false,
    TCVDifferenceAmount: false,
    Wipro_ContractCurrency: false,
    NonWTFlag: false,
    DeleteCountrySubDivisionState: false,
    DeleteCityRegion: false,
    OldWipro_ContractCurrency: false,
    DeletePOAHolderId: false,
    IsSubmit: false,
    poDetails: false,
  }
  orderOverviewValidationMsg = {
    CurrencyId: 'Currency',
    AdvisorId: 'Advisor',
    SAPCustomerCode: 'SAP customer code',
    ClassificationId: 'Order classification',
    StartDate: 'Project start date',
    EndDate: 'Project end date',
    ContractingCountryId: 'Contracting country',
    VerticalSalesOwnerId: 'Vertical sales owner',
    SOWSigned: 'Contract signed',
    PurchaseOrderSigned: 'Contract signed',
    SOWTCV: 'Contract TCV',
    PurchaseOrderSignedDate: 'Expected PO/SOW signed date',
    SOWSignedDate: 'Expected PO/SOW signed date',
    PricingTypeId: 'Pricing type',
    CountrySubDivisionState: 'Country sub-division',
    CityRegion: 'City region',
    POAHolderId: 'POA',
    Wipro_ContractCurrency: 'Contract TCV currency',
    TCVDifferenceAmount: 'TCV Difference',
    poDetails: 'Fill PO Details',
    Authorization: 'Authorization Type'
  }

  approvalLog: any = [];


  NocurrencyMultiplier: any = null;
  currencyMismatch = false;
  viewContractNavigate;

  dispalySignedDate;

  regexStr = '^[0-9]*$';
  opportunityData: any;
  orderCreated = false;
  LOIrawFile: any;

  //upload contract
  UploadContract: any = {
    ContractTitle: '',
    ContractNotes: '',
    UploadContractFiles: [],
    UploadedUrl: '',
  }
  //narendra
  orderOverviewValid = true;
  // ends here
  orderApprovalStatus = {
    WT: false,
    signed: false
  }

  delayReasonData = '';
  showDelayReasonTab: boolean = false;

  POAOrder: string = '';
  POANaming: string = 'POA';
  ICMParentOpportunityId: any = "";


  clickmes = false;
  toggleComment() {
    this.clickmes = !this.clickmes;
  }

  // role  base
  OrderOwnerRole: boolean = false;
  BFMRole: boolean = false;
  CanCreateAmendment: boolean = false;
  Pendingwithdealowner: OrderApprovalStage;

accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  constructor(
    public envr : EnvService,
    public dialog: MatDialog,
    private fileService: FileUploadService,
    public service: DataCommunicationService,
    private _fb: FormBuilder, private el: ElementRef, public orderService: OrderService,
    public projectService: OpportunitiesService, public router: Router,
    public daService: DigitalAssistantService, 
    public cdRef: ChangeDetectorRef, 
    private EncrDecr: EncrDecrService, 
    public addIPservice: AddIpService,
    public assistantGlobalService: AssistantGlobalService) {

    this.saveBusinessSolution = this.saveBusinessSolution.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveBusinessSolution);

    let x = JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', 'IoDosr0vZsE2WJgF7Cl4/w==', 'DecryptionDecrip'))
    console.log("xasdasda", x);
  }


  subscription;
  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }

  ngOnInit() {
    if (this.projectService.getSession('opportunityStatus') == 184450000) {
      this.disableSubmitForLost = true;
      console.log("sauravs", this.disableSubmitForLost)
    }
    else {
      this.disableSubmitForLost = false;
    }

  console.log("sauravpayload",this.projectService.getSession("orderId"));

    //DA api code start saurav

    let obj =
    {
      "Guid": this.OrderId,
    }
    this.orderService.getUserId(obj).subscribe(userID => {
      console.log("useridresponse", userID)
      console.log(this.OrderId, "orderresponse")

      if (!userID.IsError && userID.ResponseObject.UserIds.length > 0) {

        let userIDArr = userID.ResponseObject;

        this.orderService.getEmailId(userIDArr).subscribe(emailID => {
          console.log("emailidresponse", emailID)
          if (!emailID.IsError && emailID.ResponseObject.length > 0) {
            emailID.ResponseObject.map(data => {
              this.EmailListArray.push(data.InternalEmailAddress);
            })
            console.log("EmailListArray", this.EmailListArray)
            //DA api code end


            // this.daService.iframePage = 'OPP_DETAILS_ORDER';
            let bodyDA = {
              id : this.projectService.getSession("orderId"),
              accountGuid: this.projectService.getSession("accountid"),
              page: 'END_SALES_CYCLE',
              OpportunityID: this.projectService.getSession('opportunityId'),
              emailListArray: this.EmailListArray
            };
            this.assistantGlobalService.setEmails(bodyDA);
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
    console.log("order stage", this.projectService.getSession('currentState'));
    console.log("simple stage", this.projectService.getSession('isSimpleOpportunity'))
    this.resetonassign();
    this.getIpandserviceLineData();
    this.getDualCreditData();
    this.getInfluenceTypeData();
    this.getServiceTypeData();
    this.getSolutionTypeData();
    this.getCreditTypeData();
    // this.pricingType();
    this.selectReason();
    this.meetingName = localStorage.getItem('meetingName');

    this.projectService.orderstatus = true;

    this.projectService.uploadHidden = true;

    this.orderOverviewInit();

    this.orderOverviewArray = [
      {
        ordertype: 'New', classification: 'NEW', customercode: 'SAP9393949', startDate: '12-Jun-19',
        endDate: '12-Jul-20', currency: 'USD', contractingcountry: 'Austria', subdivision: 'Vienna',
        region: 'Dobling', salesowner: 'Anubhav Jain', Advisor: 'Kinshuk Bose', Pricingtype: 'T & M',
        authtype: 'SOW', contractsign: 'Yes', signtype: '12-Jul-20', POA: 'Ajay devgan'
      }
    ];


  }

  // goBack() {
  //   window.history.back();
  // }
  resetonassign() {
    this.projectService.getorderassign().subscribe(res => {
      if (res.orderassigned) {
        this.checkforAmendmentOrder();
      }
    });
  }

  selectReason() {
    this.orderService.getReason().subscribe((response: any) => {
      console.log("reasons api", response);
      this.selectedReasonValue = (response && response.ResponseObject) ? response.ResponseObject : [];

    }, err => {
      this.selectedReasonValue = [];
    })
  }
  // el1: HTMLElement;
  //testing scrolltobottom-pritika
  focusInto;
  readComment(i) {
    setTimeout(function () {
      let customId = "action" + i;
      this.focusInto = <HTMLElement>document.getElementById(customId);
      this.focusInto.scrollIntoView({ block: 'center', })
    }, 1000);


  }



  // open re-submission order and confirm order popup starts

  openOrderResubmitPopup() {
    if (this.opportunityData.ApprovalStageId == OrderApprovalStage.OnHoldByBFM) {
      this.submitOrderObj['showDH'] = false;
      this.submitOrderObj['showBFM'] = false;
    }
    if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM) {
      this.submitOrderObj['showDH'] = false;
      this.submitOrderObj['showBFM'] = true;
    }
    if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
      this.submitOrderObj['showDH'] = true;
      this.submitOrderObj['showBFM'] = true;
    }
    const dialogRef = this.dialog.open(ReSubmissionOrderPopup, {
      width: '520px',
      data: this.submitOrderObj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.flag = 'YES' && (this.opportunityData.ApprovalTypeId == orderApprovalType.Order || this.opportunityData.ApprovalTypeId == orderApprovalType.Amendment || this.opportunityData.ApprovalTypeId == orderApprovalType.NegativeAmendmentApproval)) {
          this.service.loaderhome = true;
          console.log("owner resubmission reason is", result.reason);
          let payload = {
            orderID: this.opportunityData.OrderBookingId,
            approvalreason: "",
            approvaltype: this.opportunityData.ApprovalType,
            decisiondate: this.currentDate,
            onholdreason: "",
            rejectionreason: "",
            resubmissionreason: result.reason,
            orderType: this.ContrcatSigned == true ? "Clean Order" : "OAR",
            isWT: this.orderApprovalStatus.WT ? "Yes" : "No",
            statuscode: "Approve",
            entity: this.orderApprovalStatus.WT ? "systemusers" : "systemusers",
            ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
            processinstanceid: this.opportunityData.CamundaProcessId
          }
           if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
            payload['DH'] = result && result.submitObj && result.submitObj.DH ? result.submitObj.DH : {};
            payload['BFM'] = result && result.submitObj && result.submitObj.BFM ? result.submitObj.BFM : {};
          }
          if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM) {
            payload['BFM'] = result && result.submitObj && result.submitObj.BFM ? result.submitObj.BFM : {};
          }
          console.log("payload is", payload)
          this.orderService.salesOrderReviewByOwner(payload).subscribe(res => {
            if (!res.IsError) {
              this.service.loaderhome = false;
              console.log("order re submission response is", res);
              if (this.approvalStageID == OrderApprovalStage.OnHoldByBFM) {
                this.projectService.displayMessageerror("On-hold removed successfully, the order is pending with BFM now");
              } else {
                this.projectService.displayMessageerror("Resubmitted the order successfully");
              }

              // this.projectService.setordersubmit(true);
              this.checkforAmendmentOrder();
              this.projectService.setordersave(true);
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }
        else if (result.flag = 'YES' && this.opportunityData.ApprovalTypeId == orderApprovalType.ConfirmedOrderApproval) {
          if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM) {
            let payload = {
              orderID: this.opportunityData.OrderBookingId,
              approvaltype: "Confirmed Order Approval",
              orderType: this.ContrcatSigned == true ? "Clean Order" : "OAR",
              resubmissionreason: result.reason,
              isWT: this.orderApprovalStatus.WT ? "Yes" : "No",
              BFM: result && result.submitObj && result.submitObj.BFM ? result.submitObj.BFM : {
                "bfmId": "",
                "entity": ""
              }
            };

            this.orderService.submitConfirmOrderApproval(payload).subscribe((resOfConfirmOrder: any) => {
              console.log("resOfConfirmOrder", resOfConfirmOrder);
              if (!resOfConfirmOrder.has_more) {

                this.service.loaderhome = false;
                this.projectService.displayMessageerror("Confirmed order resubmitted successfully");
                this.checkforAmendmentOrder();
                this.projectService.setordersave(true);

              }
            },
              err => {
                this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
              })
          } else {
            this.service.loaderhome = true;
            let payload = {
              "orderID": this.opportunityData.OrderBookingId,
              "approvalreason": "",
              "approvaltype": this.opportunityData.ApprovalType,
              "isWT": this.orderApprovalStatus.WT ? "Yes" : "No",
              "orderType": this.ContrcatSigned == true ? "Clean Order" : "OAR",
              "decisiondate": this.currentDate,
              "onholdreason": "",
              "rejectionreason": "",
              "resubmissionreason": result.reason,
              "ownerid": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              "entity": this.orderApprovalStatus.WT ? "systemusers" : "systemusers",
              "statuscode": "Approve",
              "processinstanceid": this.opportunityData.CamundaProcessId
            }
              if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
              payload['DH'] = result && result.submitObj && result.submitObj.DH ? result.submitObj.DH : {};
              payload['BFM'] = result && result.submitObj && result.submitObj.BFM ? result.submitObj.BFM : {};
            }
            if (this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM) {
              payload['BFM'] = result && result.submitObj && result.submitObj.BFM ? result.submitObj.BFM : {};
            }
            console.log("confirm order resub payload is", payload)
            this.orderService.confirmOrderReviewByOwner(payload).subscribe(res => {
              if (!res.IsError) {
                this.service.loaderhome = false;
                console.log("Confirm order re submission response is", res);
                if (this.approvalStageID == OrderApprovalStage.OnHoldByBFM) {
                  this.projectService.displayMessageerror("On-hold removed successfully, the order is pending with BFM now");
                } else {
                  this.projectService.displayMessageerror("Confirmed order resubmitted successfully");
                }

                this.checkforAmendmentOrder();
                this.projectService.setordersave(true);
              }
              else {
                this.service.loaderhome = false;
                this.projectService.displayMessageerror(res.Message);
              }
            },
              err => {
                this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
              });
          }
        }

      }
    });
  }


  // open re-submission order and confirm order popup ends

  //---------------------------------------Start Neha code------------------------------------------------------------//

  //----this function is To Get All Active Teams for BFM for WT Opportunity//
  async getTeamOfActive(popup, isconfirmOrderApproval) {
    console.log("this.opportunityData", this.opportunityData);
    console.log("this.orderOverviewObj", this.orderOverviewObj);

    let getSbuid = this.projectService.getSession('sbuId');
    const payload = {
      "OrderOrOpportunityId": this.opportunityData.OrderBookingId,
      "IsOrderCheckNonBPO": "true"

    }
    await this.orderService.getAllActiveTeamBfmWt(payload).subscribe((activeteamBfmWt: any) => {
      this.submitOrderObj['finanaceTeamForNonWt'] = activeteamBfmWt.ResponseObject
      if (this.opportunityData.ApprovalStageId == OrderApprovalStage.OnHoldByBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
        this.getAdhBdhForWt(popup);
        return;
      }
      console.log("activeteamBfmWt", activeteamBfmWt, payload);
      if (!activeteamBfmWt.IsError) {
        this.submitOrderObj['finanaceTeamForNonWt'] = activeteamBfmWt.ResponseObject
        if (isconfirmOrderApproval == true) {
          this.approvalPopUp(this.submitOrderObj, isconfirmOrderApproval);
        } else {
          this.activeDmTeamAccount(popup);
        }
      }

    });
  }


  //-----This function is To Get All Active Account DM Teams by Account ID ----//
  async activeDmTeamAccount(popup) {
    // let oppGuid;
    // if (this.orderOverviewObj.OrderTypeId != 184450006 && this.orderOverviewObj.OrderTypeId != 184450002 && this.orderOverviewObj.OrderTypeId != 184450004) {
    //   oppGuid = this.opportunityData.OpportunityId;
    // } else {
    //   oppGuid = this.opportunityData.ParentOpportunityId;
    // }

    const payload = {
      "OpportunityId": this.opportunityData.ParentOpportunityId
    }
    await this.orderService.getActiveAccountDmTeam(payload).subscribe((activeDmAccount: any) => {
      console.log("activeDmAccount", activeDmAccount, payload);
      if (!activeDmAccount.IsError) {
        let displayDMWt = ""
        this.submitOrderObj['activeDmTeamAccountDetails'] = activeDmAccount.ResponseObject;
        this.submitOrderObj['activeDmTeamAccountDetails'].forEach((it, index) => {

          if (index == 0) {
            displayDMWt = it.ApproverName
          } else {
            displayDMWt = displayDMWt + ", " + it.ApproverName;
          }

        })
        this.submitOrderObj['displayDMWt'] = displayDMWt;
        this.getAdhBdhForWt(popup);
      }

    })
  }
  async getAdhBdhForWt(popup) {
    console.log("this.opportunityData", this.opportunityData);
    console.log("this.orderOverviewObj", this.orderOverviewObj);
    // let oppGuid = '';
    // if (this.orderOverviewObj.OrderTypeId == '184450002' || this.orderOverviewObj.OrderTypeId == '184450004' || this.orderOverviewObj.OrderTypeId == 184450006) {
    //   oppGuid = this.opportunityData.ParentOpportunityId
    // } else {
    //   oppGuid = this.opportunityData.OpportunityId
    // }
    const Payload = {
      "OpportunityId": this.opportunityData.ParentOpportunityId
    }
    await this.orderService.getAdhBdhForWtOpportunity(Payload).subscribe((resOfAdhBdh: any) => {
      console.log("resOfAdhBdh", resOfAdhBdh, Payload)
      let AdhBdhOpportunity: any = [];
      let adhBdhName: any;
      AdhBdhOpportunity = resOfAdhBdh.ResponseObject
      if (!resOfAdhBdh.IsError) {
        this.submitOrderObj['getAdhBdhForWt'] = AdhBdhOpportunity;
        if (this.opportunityData.ApprovalStageId == OrderApprovalStage.OnHoldByBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
          this.openOrderResubmitPopup();
          return;
        }
        if (popup == "approval") {
          this.approvalPopUp(this.submitOrderObj, null);
        }
        if (popup == 'invoice') {
          this.requestinvoicepopup(this.submitOrderObj)
        } if (popup == 'foreclosure') {
          this.requestpopup(this.submitOrderObj)
        }
      }

    }

    )

  }
  async finanaceTeamForNonWt(popup, isconfirmOrderApproval) {
    const Payload = {
      "OrderOrOpportunityId": this.opportunityData.OrderBookingId,
      "IsOrderCheckNonBPO": "true"

    }
    await this.orderService.getAllActiveTeamBfmForNWt(Payload).subscribe((resOfFinanceNwt: any) => {
      console.log("resOfFinanceNwt", resOfFinanceNwt, Payload)
      let activeNameOfFinanceNwt = [];
      activeNameOfFinanceNwt = resOfFinanceNwt.ResponseObject;
      if (!resOfFinanceNwt.IsError) {
        this.submitOrderObj['finanaceTeamForNonWt'] = activeNameOfFinanceNwt
        if (this.opportunityData.ApprovalStageId == OrderApprovalStage.OnHoldByBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
          this.getAdhBdhForWt(popup);
          return;
        }
        if (isconfirmOrderApproval == true) {
          this.approvalPopUp(this.submitOrderObj, isconfirmOrderApproval);
        } else {
          this.DmNAMeForNonWt(popup);
        }


      }

    })

  }
  async DmNAMeForNonWt(popup) {
    const Payload = {
      'AccountId': this.opportunityData.Account.SysGuid
    }
    await this.orderService.getActiveAccountDmTeamForNwt(Payload).subscribe((resOfNwtDmTeam: any) => {
      console.log("resOfNwtDmTeam", resOfNwtDmTeam, Payload)
      let activeDmTeamForNwt = [];
      activeDmTeamForNwt = resOfNwtDmTeam.ResponseObject;
      if (!resOfNwtDmTeam.IsError) {
        this.submitOrderObj['DmNAMeForNonWt'] = activeDmTeamForNwt
      }
      this.getAdhBdhForWt(popup)
    })

  }

  submitConfirmOrderApproval(bfm: any) {
    this.service.loaderhome = true;
    let payload = {
      orderID: this.OrderId,
      approvaltype: "Confirmed Order Approval",
      orderType: this.ContrcatSigned == true ? "Clean Order" : 'OAR',
      isWT: this.originalWTFlag ? 'Yes' : 'No',
      "BFM": bfm
    }
    this.orderService.submitConfirmOrderApproval(payload).subscribe((resOfConfirmOrder: any) => {
      console.log("resOfConfirmOrder", resOfConfirmOrder);
      this.service.loaderhome = false;
      this.projectService.displayMessageerror("Confirmed order submitted successfully");
      this.checkforAmendmentOrder();
      this.projectService.setordersave(true);


    },
      err => {
        this.service.loaderhome = false;
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
        this.projectService.displayerror(err.status);
      })
  }

  // submitOrder() {



  // }

  //****************************************************************Start of Sumit Code********************************************//


  ngOnDestroy(): void {
    if (this.orderService.amendmentInProcess == false) {
      this.projectService.clearSession("smartsearchData");
    }
    this.eventSubscriber(this.service.subscription, this.saveBusinessSolution, true);
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
      this.getBusinessSolutionPanelData(this.OpportunityId);
    }, err => {
      this.getBusinessSolutionPanelData(this.OpportunityId);
    })
  }

  //Modification Flow Starts
  changeProjection(Projectionvalue) {
    this.OverALLSavedTCV = "";
    let OBJ = {
      Sltcv: "",
      OverallTcv: "",
      IpTcv: "",
      TCVCalculation: false,
      opportunityid: this.OpportunityId,
    }
    this.businessSOlutionData[0] = Object.assign({}, OBJ);
    if (Projectionvalue == 1) {
      this.getDatabasedOnMopdificationId(this.ModificationId, false);
    } else if (Projectionvalue == 2) {
      this.getDatabasedONOrder(this.OrderId);
    }
  }

  changeProjectionOverView(ProjectionvalueOverView) {
    if (ProjectionvalueOverView == 1) {
      this.showModificationOverView = true;
    } else if (ProjectionvalueOverView == 2) {
      this.showModificationOverView = false;
    }
  }
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
            AttachmentId: it.AttachmentId,
            StateCode: 0
          })
        }) : [];
      }, err => {
        this.fileDataArray = [];
      })
    }
  }

  emptyReason(action, attributeType) {
    if (action == '184450000') {
      let index = this.modifiedOrderSaveArray.findIndex(it => it.AttributeType == attributeType);
      if (index >= 0) {
        this.modifiedOrderSaveArray[index].RejectionReason = '';
      }
      if (attributeType == 4) {
        let indexofSignedDate = this.modifiedOrderSaveArray.findIndex(it => it.AttributeType == 7);
        if (indexofSignedDate >= 0) {
          this.modifiedOrderSaveArray[indexofSignedDate].Action = action;
          this.modifiedOrderSaveArray[indexofSignedDate].RejectionReason = '';
        }
        let indexofPOAHolder = this.modifiedOrderSaveArray.findIndex(it => it.AttributeType == 10);
        if (indexofPOAHolder >= 0) {
          this.modifiedOrderSaveArray[indexofPOAHolder].Action = action;
          this.modifiedOrderSaveArray[indexofPOAHolder].RejectionReason = '';
        }
      }

    } else {
      if (attributeType == 4) {
        let indexofSignedDate = this.modifiedOrderSaveArray.findIndex(it => it.AttributeType == 7);
        if (indexofSignedDate >= 0) {
          this.modifiedOrderSaveArray[indexofSignedDate].Action = action;
        }
        let indexofPOAHolder = this.modifiedOrderSaveArray.findIndex(it => it.AttributeType == 10);
        if (indexofPOAHolder >= 0) {
          this.modifiedOrderSaveArray[indexofPOAHolder].Action = action;
        }
      }
    }
  }

  disableAction(attributeType) {
    if ((attributeType == 10 || attributeType == 7) && (this.modifiedOrderSaveArray.some(it => it.AttributeType == 4 && it.ChangeOrderDetails == 'SOW') == true)) {
      return true;
    }
    else if (attributeType == 7 && (this.modifiedOrderSaveArray.some(it => it.AttributeType == 4 && it.ChangeOrderDetails == 'PO') == true)) {
      return true;
    } else {
      return false;
    }
  }

  checkModificationDetails() {
    this.ModificationId = "";
    this.ModificationName = "";
    this.ModificationRequestStatus = "";
    this.ModificationCamundaProcessId = "";
    this.fileDataArray = [];
    this.modifiedOrderSaveArray = [];
    this.modifiedOrderPODetails = [];
    const payload = {
      SalesOrderId: this.OrderId
    }
    this.service.loaderhome = true;
    this.orderService.getModificationDetails(payload).subscribe((response: any) => {

      this.ModificationId = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].ModificationRequestId) ? response.ResponseObject[0].ModificationRequestId : "";
      this.ModificationName = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].Name) ? response.ResponseObject[0].Name : "";
      this.ModificationRequestStatus = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].ModificationRequestStatus) ? response.ResponseObject[0].ModificationRequestStatus : "";
      this.ModificationCamundaProcessId = (response.ResponseObject && response.ResponseObject.length > 0 && response.ResponseObject[0].OrderModificationCamundaId) ? response.ResponseObject[0].OrderModificationCamundaId : "";
      this.getDatabasedOnMopdificationId(this.ModificationId, true);
      this.getDocuments();
    },
      err => {
        this.getDatabasedOnMopdificationId(this.ModificationId, true);
      })

  }

  getDatabasedOnMopdificationId(ModificationId, ModifycreateOverview) {
    this.service.loaderhome = true;
    this.orderService.getOrderOBAllocationModificationDetails(this.OrderId, ModificationId, this.WTFlag).subscribe(res => {
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false;
      this.showWTCIS = (res && res.ResponseObject && res.ResponseObject.showWTCIS) ? res.ResponseObject.showWTCIS : false;
      this.showWTCRS = (res && res.ResponseObject && res.ResponseObject.showWTCRS) ? res.ResponseObject.showWTCRS : false;
      this.ModificationOBAllocation = (res && res.ResponseObject && res.ResponseObject.ServiceLineModificationDetails && res.ResponseObject.ServiceLineModificationDetails.length > 0) ? true : false;
      this.businessSOlutionData[0].Sltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
      this.businessSOlutionData[0].IpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
      this.businessSOlutionData[0].OverallTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
      this.OverALLSavedTCV = this.businessSOlutionData[0].OverallTcv;
      let tempmodificationOverview = (!res || !res.ResponseObject || !res.ResponseObject.lstOverviewModifyOrderDetails) ? [] : (res.ResponseObject.lstOverviewModifyOrderDetails);
      let modifyPOData: any = (!res || !res.ResponseObject || !res.ResponseObject.POModificationDetails) ? [] : (res.ResponseObject.POModificationDetails);
      if (ModifycreateOverview == true) {
        this.createModifyOverview(tempmodificationOverview, modifyPOData);
      }

      let apiSLDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.ServiceLineModificationDetails) ? [] : (res.ResponseObject.ServiceLineModificationDetails);
      let apiIPDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.IPModificationDetails) ? [] : res.ResponseObject.IPModificationDetails;
      let apiSolutionDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.SolutionModificationDetails) ? [] : res.ResponseObject.SolutionModificationDetails;
      let apicreditAllocationDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.CreditAllocationModificationDetails) ? [] : res.ResponseObject.CreditAllocationModificationDetails;
      this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);
    }, err => {
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }


  //Modification Flow Ends
  getBusinessSolutionPanelData(OppId) {
    this.serviceLineLoader = true;
    this.IpLoader = true;
    this.solutionLoader = true;
    this.creditAllocationLoader = true;
    this.service.loaderhome = true;
    let currentDate: any = new Date();
    let ApprovedDateDays = 0;
    if (this.ApprovedDate) {
      let approvedDate: any = new Date(this.ApprovedDate)
      let diffTime = Math.abs(approvedDate - currentDate);
      ApprovedDateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    let UserID = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.showModification = false;
    this.showModificationOverView = false;
    this.disableonApproverDate = false;
    this.disableOnRoleOverwiew = true;
    this.disableOnRoleBSPanel = true;
    this.disableOnRoleBSSL = true;
    this.disableOnRoleBSIp = true;
    this.disableOnRoleBSSolution = true;
    this.disableOnRoleBSCA = true;
    this.showSubmit = false;
    this.showInvoice = false;
    this.showForClosure = false;
    this.showDualCreditButton = false;
    this.showWTCRS = false;
    this.showWTCIS = false;
    this.disableOverviewOnPendingWithBFM = false;

    if (this.OrderId) {
      this.orderService.RoleBasedAccesssOrder(this.OrderId, UserID).subscribe(res => {


        this.CanCreateAmendment = (res && res.ResponseObject && res.ResponseObject.CanCreateAmendment ? res.ResponseObject.CanCreateAmendment : false);
        this.OrderOwnerRole = (res && res.ResponseObject && res.ResponseObject.OrderOwnerRole ? res.ResponseObject.OrderOwnerRole : false);
        this.BFMRole = (res && res.ResponseObject && res.ResponseObject.BFMRole ? res.ResponseObject.BFMRole : false);


        if ((this.OrderOwnerRole == true || this.BFMRole == true || this.CanCreateAmendment == true) && this.IsAppirioPureDeal == false) {


          if (this.ParentOrderIdForAmendment) {
            if (this.ParentOrderIdForAmendment && this.orderOverviewObj.OrderTypeId != 184450006) {
              this.disableOnRoleOverwiew = false;
              this.disableOnRoleBSPanel = false;
              this.disableOnRoleBSSL = false;
              this.disableOnRoleBSIp = false;
              this.disableOnRoleBSSolution = false;
              this.disableOnRoleBSCA = false;
            }
          }
          else if (this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {
            this.showModification = true;
            this.showModificationOverView = true;
            this.Projectionvalue = "1";
            this.ProjectionvalueOverView = "1";
          }
          else if (this.BFMRole == true && this.approvalStageID == OrderApprovalStage.PendingWithBFM && this.orderOverviewObj.OrderTypeId != 184450006) {
            this.disableOnRoleOverwiew = false;
            this.disableOverviewOnPendingWithBFM = true;
          }
          else if (this.OrderOwnerRole == true) {
            debugger;
            if (this.approvalStageEnableAllarray.some(it => it == this.approvalStageID) == true) {
              if (this.orderOverviewObj.OrderTypeId == 184450006) {
                if (OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) {
                  if (OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || this.orderOverviewObj.OrderTypeId == 184450001) {
                    this.showInvoice = false;
                    this.showForClosure = true;
                  } else {
                    this.showInvoice = true;
                    this.showForClosure = true;
                  }

                } else {
                  this.showSubmit = true;
                }
              } else {
                this.disableOnRoleOverwiew = false;
                this.disableOnRoleBSPanel = false;
                this.disableOnRoleBSSL = false;
                this.disableOnRoleBSIp = false;
                this.disableOnRoleBSSolution = false;
                this.disableOnRoleBSCA = false;
                if (OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) {
                  if (OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || this.orderOverviewObj.OrderTypeId == 184450001) {
                    this.showInvoice = false;
                    this.showForClosure = true;
                  } else {
                    this.showInvoice = true;
                    this.showForClosure = true;
                  }
                } else {
                  if (this.ApprovalType == orderApprovalType.ConfirmedOrderApproval && OrderApprovalStage.OnHoldByBFM != this.approvalStageID) {
                    this.showSubmit = false;
                  } else {
                    this.showSubmit = true;
                  }

                }
              }
            }
            else if ((OrderApprovalStage.ApprovedbyBFM == this.approvalStageID || OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID) && ApprovedDateDays <= 3) {
              this.disableOnRoleBSSL = false;
              this.disableOnRoleBSIp = false;
              this.disableonApproverDate = true;
            }
            else if (OrderApprovalStage.ApprovedbyBFM != this.approvalStageID && OrderApprovalStage.InvoicingRequestApprovedbyBFM != this.approvalStageID && OrderApprovalStage.ForeclosureRequestApprovedbyDM != this.approvalStageID) {
              this.disableOnRoleBSSL = false;
              this.disableOnRoleBSIp = false;
              this.disableonApproverDate = true;
            }
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
    this.openDialogDelete("You will be navigated to order search page and all your unsaved data will be lost, please ensure that you have saved your changes before clicking on confirm", "Confirm", "Alert").subscribe(res => {
      if (res == 'save') {
        this.orderService.amendmentInProcess = true;
        this.projectService.setSession("SMData", { WTFlag: this.WTFlag, type: 'ORDER' });
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

    this.onOBTCVChangeDiff(this.businessSOlutionData[0].OverallTcv);
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

  }

  getBusinessSolutionsTableData(OppId) {
    this.ModificationOBAllocation = false;
    this.ModificationId = "";
    this.ModificationName = "";
    this.ModificationRequestStatus = "";
    this.fileDataArray = [];

    if (!this.OrderId && !this.WTFlag) {
      this.getDatabasedONOpportunity(OppId);
    }
    else if (!this.OrderId && this.WTFlag) {
      this.getDatabasedONDPS(OppId);
    }
    else if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {
      this.checkModificationDetails();
    }
    else {
      this.getDatabasedONOrder(this.OrderId);
    }

  }

  getDatabasedONOrder(orderId) {
    // let IsNegativeAmendment = (this.amendmentCreationDetails && this.amendmentCreationDetails.WiproAmendmentType == 184450006) ? true : false;
    let amendmenttype = this.amendmentCreationDetails && this.amendmentCreationDetails.WiproAmendmentType ? this.amendmentCreationDetails.WiproAmendmentType : null;
    this.orderService.getOrderOBAllocationDetails(orderId, this.WTFlag, amendmenttype).subscribe(res => {
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false
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
      this.OrderId = this.ParentOrderIdForAmendment ? "" : orderId;
      this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);
    }, err => {
      this.OrderId = this.ParentOrderIdForAmendment ? "" : orderId;
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }


  getDatabasedONDPS(OppId) {

    this.orderService.getOrderOBAllocationDPSDetails(this.OpportunityId, this.OrderId, this.pricingDPSId, this.orderOverviewObj.VerticalSalesOwnerId, this.defaultValue.verticalOwner).subscribe(res => {
      console.log("getDatabasedONDPS", res.ResponseObject);
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false
      this.showWTCIS = (res && res.ResponseObject && res.ResponseObject.showWTCIS) ? res.ResponseObject.showWTCIS : false;
      this.showWTCRS = (res && res.ResponseObject && res.ResponseObject.showWTCRS) ? res.ResponseObject.showWTCRS : false;
      this.businessSOlutionData[0].Sltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
      this.businessSOlutionData[0].IpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
      this.businessSOlutionData[0].OverallTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
      this.OverALLSavedTCV = this.businessSOlutionData[0].OverallTcv;
      let dps_data = res.ResponseObject;

      this.defaultValue.currency = (dps_data && dps_data.CurrencyName) ? this.getSymbol(dps_data.CurrencyName) : '';
      this.orderOverviewObj.CurrencyId = (dps_data && dps_data.TransactionCurrencyId) ? dps_data.TransactionCurrencyId : '';
      this.selectedCurrencyObj.Name = this.defaultValue.currency;
      this.selectedCurrencyObj.Id = this.orderOverviewObj.CurrencyId;
      this.orderOverviewObj.OrderTCV = (dps_data && dps_data.PricingTCV) ? (parseFloat(dps_data.PricingTCV)).toFixed(2) : '0.00';
      this.CurrencyId = (dps_data && dps_data.TransactionCurrencyId) ? dps_data.TransactionCurrencyId : '';
      this.CurrencySymbol = (dps_data && dps_data.CurrencySymbol) ? this.getSymbol(dps_data.CurrencySymbol) : 'NA';
      this.DealHeaderID = (dps_data && dps_data.DealHeaderID) ? dps_data.DealHeaderID : null;
      this.OMPercentage = (dps_data && dps_data.OMPercentage) ? dps_data.OMPercentage : 0;
      this.getTCVdifference(this.orderOverviewObj.SOWTCV);

      let apiSLDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.ServiceLineDetails || !res.ResponseObject.ServiceLineDetails.orderServicelineDetails) ? [] : res.ResponseObject.ServiceLineDetails.orderServicelineDetails;
      let apiIPDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.OrderIPDetails || !res.ResponseObject.OrderIPDetails.orderIPDetail) ? [] : res.ResponseObject.OrderIPDetails.orderIPDetail;
      let apiSolutionDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.Solutions || !res.ResponseObject.Solutions.order_Solution) ? [] : res.ResponseObject.Solutions.order_Solution;
      let apicreditAllocationDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.CreaditAllocations || !res.ResponseObject.CreaditAllocations) ? [] : res.ResponseObject.CreaditAllocations;

      this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);
    }, err => {
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }

  getDatabasedONOpportunity(OppId) {

    this.orderService.getOrderOpportunityBSDetails(OppId, this.orderOverviewObj.VerticalSalesOwnerId, this.defaultValue.verticalOwner).subscribe((res: any) => {
      console.log("temp", this.tempCADD);
      this.showDualCreditButton = (res && res.ResponseObject && res.ResponseObject.showAddDualCredit) ? res.ResponseObject.showAddDualCredit : false
      this.showWTCIS = (res && res.ResponseObject && res.ResponseObject.showWTCIS) ? res.ResponseObject.showWTCIS : false;
      this.showWTCRS = (res && res.ResponseObject && res.ResponseObject.showWTCRS) ? res.ResponseObject.showWTCRS : false;
      this.businessSOlutionData[0].Sltcv = (res && res.ResponseObject && res.ResponseObject.OrderSltcv) ? res.ResponseObject.OrderSltcv : '0.00'
      this.businessSOlutionData[0].IpTcv = (res && res.ResponseObject && res.ResponseObject.OrderIpTcv) ? res.ResponseObject.OrderIpTcv : '0.00'
      this.businessSOlutionData[0].OverallTcv = (res && res.ResponseObject && res.ResponseObject.OrderOverallTcv) ? res.ResponseObject.OrderOverallTcv : '0.00'
      this.OverALLSavedTCV = this.businessSOlutionData[0].OverallTcv;

      let apiSLDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.WiproServiceLineDtls) ? [] : res.ResponseObject.WiproServiceLineDtls;
      let apiIPDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.WiproAllIPDetails) ? [] : res.ResponseObject.WiproAllIPDetails;
      let apiSolutionDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.WiproBusinessSolutionDtls) ? [] : res.ResponseObject.WiproBusinessSolutionDtls;
      let apicreditAllocationDetails: any = (!res || !res.ResponseObject || !res.ResponseObject.CreditAllocationsDetails) ? [] : res.ResponseObject.CreditAllocationsDetails;

      this.checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails);
    }, err => {
      this.checkDuplicateSmartSearch([], [], [], []);
      this.projectService.displayerror(err.status);
    });
  }

  checkDuplicateSmartSearch(apiSLDetails, apiIPDetails, apiSolutionDetails, apicreditAllocationDetails) {

    let smartsearchObj = this.projectService.getSession("smartsearchData");
    if (smartsearchObj && smartsearchObj.type != 'ORDER') {
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

    // let tempSLDetails: any = smartsearchSL.map(it => { return Object.assign({}, it) })
    // let tempIPDetails: any = smartsearchIP.map(it => { return Object.assign({}, it) });
    // let tempSolutionDetails: any = smartsearchSol.map(it => { return Object.assign({}, it) });
    // let tempcreditAllocationDetails: any = smartsearchCreditAllocation.map(it => { return Object.assign({}, it) });
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

  SLTCVPercCalculation(SLPercTCV, SLTCVValue) {
    if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006) {
      let tempSliTCV: any = (this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].Sltcv != '0.00' && SLTCVValue) ? ((parseFloat(SLTCVValue) * 100) / parseFloat(this.businessSOlutionData[0].Sltcv)).toString() : "";
      return tempSliTCV ? parseFloat(tempSliTCV).toFixed(2) : "";
    } else {
      return SLPercTCV ? parseFloat(SLPercTCV).toFixed(2) : "";
    }
  }

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
      OrderBSSLoriginalDetails.WiproOpportunityServicelineOrderDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineOrderDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineOrderDetailId : ""
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
      OrderBSSLoriginalDetails.WiproPercentageOftcv = this.SLTCVPercCalculation(BSSLoriginalDetails[i].WiproPercentageOftcv, BSSLoriginalDetails[i].WiproEstsltcv);
      OrderBSSLoriginalDetails.WiproEstsltcv = BSSLoriginalDetails[i].WiproEstsltcv ? (parseFloat(BSSLoriginalDetails[i].WiproEstsltcv).toFixed(2)).toString() : "";
      OrderBSSLoriginalDetails.Cloud = BSSLoriginalDetails[i].Cloud ? JSON.parse(BSSLoriginalDetails[i].Cloud) : false;
      OrderBSSLoriginalDetails.WiproEngagementModel = BSSLoriginalDetails[i].WiproEngagementModel ? BSSLoriginalDetails[i].WiproEngagementModel : "";
      OrderBSSLoriginalDetails.WiproEngagementModelName = BSSLoriginalDetails[i].WiproEngagementModelName ? BSSLoriginalDetails[i].WiproEngagementModelName : "";
      OrderBSSLoriginalDetails.WiproDualCredit = BSSLoriginalDetails[i].WiproDualCredit ? BSSLoriginalDetails[i].WiproDualCredit : "";
      OrderBSSLoriginalDetails.WiproDualCreditName = BSSLoriginalDetails[i].WiproDualCreditName ? BSSLoriginalDetails[i].WiproDualCreditName : "";

      if (this.ParentOrderIdForAmendment) {
        OrderBSSLoriginalDetails.statecode = 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];
      }
      else if (this.WTFlag == false && !this.OrderId) {
        OrderBSSLoriginalDetails.statecode = 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];
      }
      else if (this.WTFlag == true && !this.OrderId) {
        OrderBSSLoriginalDetails.statecode = 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];
        let temppercSlTCV: any = ((!BSSLoriginalDetails[i].WiproDualCredit) && this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].Sltcv != '0.00' && BSSLoriginalDetails[i].WiproEstsltcv) ? ((parseFloat(BSSLoriginalDetails[i].WiproEstsltcv) * 100) / parseFloat(this.businessSOlutionData[0].Sltcv)).toString() : "";
        OrderBSSLoriginalDetails.WiproPercentageOftcv = temppercSlTCV ? parseFloat(temppercSlTCV).toFixed(2) : "";

      }
      else if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {
        OrderBSSLoriginalDetails.statecode = (BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId) ? 2 : 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId : "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 2 })
        })
        ) : [];
      }
      else {
        OrderBSSLoriginalDetails.statecode = (BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId) ? 2 : 0;
        OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId : "";
        OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 2, OrderCloudDetailsId: '' })
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
    this.projectService.getCloudDetails(obj).subscribe(res => {
      cloudFlag = (res.ResponseObject && res.ResponseObject.WiproClouddetailsrequired) ? res.ResponseObject.WiproClouddetailsrequired : false;
      this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
    }, err => {
      this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn);
    });
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

  PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,selectedSLPricingType, cloudTCV, i, SLlength, cloudFlag, tempSLId, addedByDualCreditbtn) {
    this.BSSLDetails.push(Object.assign({}, new OrderserviceLineBSDetails(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD,[], EngagementModelDD, selectedSLBDM,selectedSLPricingType, false,false, false, cloudFlag, addedByDualCreditbtn, cloudTCV,
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
    if (!CloudDisabled) {
      let servicelineName = ServiceLIneData.WiproServicelineidValueName;
      let tempBSpracticeDD = this.BSSLDetails[i].SlpracticeDD.filter(it => it.SysGuid == ServiceLIneData.WiproPracticeId);
      let practiceName = tempBSpracticeDD.length > 0 ? tempBSpracticeDD[0].Name : "";
      let tempBSSubPracticeDD = this.BSSLDetails[i].SlSubpracticeDD.filter(it => it.SubPracticeId == ServiceLIneData.WiproSubpracticeid);
      let subPracticeName = tempBSSubPracticeDD.length > 0 ? tempBSSubPracticeDD[0].Name : "";
      let dialogRef = this.dialog.open(OrderOpenServiceline, {
        width: "900px",
        data: { type: 'order', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, servicelineName: servicelineName, practiceName: practiceName, subPracticeName: subPracticeName, Details: ServiceLIneData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, WTFlag: this.WTFlag, disableOnRoleBSSL: this.disableOnRoleBSSL }
      });

      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (result) {
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

  disableBSServiceLine(BSSLdata, SLData) {
    if (!SLData.IsVisible) {
      return true;
    } else {
      if (BSSLdata.addedByDualCreditbtn && SLData.Name != this.CIS && SLData.Name != this.CRS) {
        return true;
      } else if (BSSLdata.addedByDualCreditbtn && SLData.Name == this.CIS && this.showWTCIS == false) {
        return true;
      } else if (BSSLdata.addedByDualCreditbtn && SLData.Name == this.CRS && this.showWTCRS == false) {
        return true;
      } else {
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
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
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
    this.cloudDetailsApi(i)
    this.changeCreditAllocationOnSLChange(ServiceLIneData, i);
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
      this.BSSLDetails[i].SlSLBDMDD = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
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
      this.BSSLDetails[i].SlSLBDMDD = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
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
        let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
          return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
        });
        if (defaultCAIndex >= 0) {
          this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          this.creditAllocationdataDetails[defaultCAIndex].selectedCABDM = [];
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = "";
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = "";
        }


      }
    }

  }



  getSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {

    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServicelineidValue, rowData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      let SLBDMresp = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? ([{
        'SysGuid': this.selectedVSOObj.Id,
        'Name': this.selectedVSOObj.Name,
        'EmailID': this.selectedVSOObj.EmailID,
        'Id': this.selectedVSOObj.Id
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
        let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
          return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
        });
        if (defaultCAIndex >= 0) {
          this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = "";
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = "";
        }


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

    this.BSSLDetails.unshift(Object.assign({}, new OrderserviceLineBSDetails(BSSLObj, [],[],[] ,[], [], [], [], false,false, false, false, true, 0,
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
  }

  deletBSSLValidation(ServiceLIneData, searchText, i) {
    if (this.BSSLDetails.length <= 1) {
      this.projectService.displayMessageerror("Single service line cannot be deleted.");
      return;
    }
    else {
      this.openDialogDelete("If you delete service line, Related Multiple BDM record will delete. Are you sure you want to delete record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be deleted from the Opportunity and Order Booking screens", "Confirm", "Delete service line").subscribe(res => {
        if (res == 'save') {
          if (ServiceLIneData.WiproOpportunityServicelineDetailId) {
            this.deleteServiceLIneArray.push(Object.assign({}, this.BSSLDetails[i]));
          }
          this.BSSLDetails.splice(i, 1);
          this.deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i);
        }
      });
    }

  }

  deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i) {
    let newcreditAllocation: any = [];
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.SLCAID == ServiceLIneData.SLCAID && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == true) {
        if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
          this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      }
      else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && it.BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.PracticeId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && it.BSServiceLine.WiproPracticeId == this.creditAllocationdataDetails[ca].creditAllocation.PracticeId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
            this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
          }
        } else {
          newcreditAllocation.push(Object.assign({}, this.creditAllocationdataDetails[ca]));
        }
      } else if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
        if (this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValue == this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId).length == 0) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID) {
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
    if (ServiceLIneData.WiproOpportunityServicelineDetailId) {
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

    this.onOBTCVChangeDiff(this.businessSOlutionData[0].OverallTcv);
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

      if (this.ParentOrderIdForAmendment) {
        OrderIporiginalDetails.statecode = 0;
        OrderIporiginalDetails.WiproOpportunityIpId = "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 0, OrderIPId: '', wipro_orderipadditionaldetailid: '', OrderIpAdditionalDetailsId: '' })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];
      }
      else if (this.WTFlag == false && !this.OrderId) {
        OrderIporiginalDetails.statecode = 0;
        OrderIporiginalDetails.WiproOpportunityIpId = "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 0, OrderIPId: '', wipro_orderipadditionaldetailid: '', OrderIpAdditionalDetailsId: '' })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];

      }
      else if (this.WTFlag == true && !this.OrderId) {
        OrderIporiginalDetails.statecode = 0;
        OrderIporiginalDetails.WiproOpportunityIpId = "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 0, OrderIPId: '', wipro_orderipadditionaldetailid: '', OrderIpAdditionalDetailsId: '' })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailsID: '', OrderCloudDetailsId: '' })
        })
        ) : [];

      }
      else if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {

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
        OrderIporiginalDetails.statecode = (IporiginalDetails[i].WiproOpportunityIpId) ? 2 : 0;
        OrderIporiginalDetails.WiproOpportunityIpId = IporiginalDetails[i].WiproOpportunityIpId ? IporiginalDetails[i].WiproOpportunityIpId : "";
        OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 2, OrderIPId: OrderIporiginalDetails.WiproOpportunityIpId, OrderIpAdditionalDetailsId: '' })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.Value ? parseFloat(it.Value) : 0);
          return Object.assign({ ...it, CloudStatecode: 2, OrderCloudDetailsId: '' })
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
          IsVisible: obj.IsVisible,
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

  PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, cloudTCV, i, ModuleDisabled, HolmesDisabled, Iplength, tempWiproOpportunityIpId) {
    this.IpDetails.push(Object.assign({}, new OrderIpDetails(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD,[], IpHolmesDD, selectedIP, selectedModule, selectedIPSLBDM,selectedIPPricingType, selectedHomesBDM, false,false, false, false, false, false, ModuleDisabled, HolmesDisabled, cloudTCV,
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
      data: { type: 'order', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: solutionData, disableOnRoleBSSolution: this.disableOnRoleBSSolution }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.SolutionDetails[i].solutions.DealRegistrationYes = result.DealRegistrationYes;
      }
    });
  }
  OrderdealNotRegistered(solutionData,i){
    let dialogRef = this.dialog.open(OrderdealRegisteredNoPopup, {
      width: '650px',
      data: { type: 'order', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: solutionData, disableOnRoleBSSolution: this.disableOnRoleBSSolution }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.SolutionDetails[i].solutions.DealRegistrationNo = result.DealRegistrationNo;
      }
    });
  }


  navigatetoIPCloud(IpData, i, CloudDisabled) {
    // commented as new popup is added as per requirement
    if (!CloudDisabled) {
      const dialogRef = this.dialog.open(OrderOpenIP,
        {
          width: '900px',
          data: { type: 'order', acceptNegative: this.acceptNegative, currencySymbol: this.CurrencySymbol, Details: IpData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, WTFlag: this.WTFlag, disableOnRoleBSIp: this.disableOnRoleBSIp }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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
      this.IpDetails[i].IpslBDMDD = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
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
      this.IpDetails[i].IpslBDMDD = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !searchValue && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
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
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? ([{
        'SysGuid': this.selectedVSOObj.Id,
        'Name': this.selectedVSOObj.Name,
        'EmailID': this.selectedVSOObj.EmailID,
        'Id': this.selectedVSOObj.Id
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

  IpNameclose(IpData, i, event) {
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
    this.IpDetails.unshift(Object.assign({}, new OrderIpDetails(IPObj, [],[],[], [], [], [], [], [], [], [], [],false, false, false, false, false, false, true, true, 0,
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
  }

  deletBSIpValidation(IpData, searchText, i) {

    this.openDialogDelete("Do you wish to delete this IP", "Confirm", "Delete IP").subscribe(res => {
      if (res == 'save') {
        if (IpData.WiproOpportunityIpId) {
          this.deleteIPArray.push(Object.assign({}, this.IpDetails[i]));
        }
        this.IpDetails.splice(i, 1);
        this.resetIPTCVandOverAllTCV();
        if (IpData.WiproOpportunityIpId) {
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

    this.onOBTCVChangeDiff(this.businessSOlutionData[0].OverallTcv);
  }


  //**************************************************************IP Methods Ends***************************************************/




  //**************************************************************Solution Methods Starts***************************************************/

  SolPercCalculation(SolPercTCV, SolValue) {
    if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006) {
      let tempTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? ((parseFloat(SolValue) * 100) / (parseFloat(this.businessSOlutionData[0].OverallTcv))) : "";
      return tempTCV ? parseFloat(tempTCV).toFixed(2) : "";
    } else {
      return SolPercTCV ? parseFloat(SolPercTCV).toFixed(2) : "";
    }
  }


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
      OrdersolutionorignalDetails.WiproPercentageOfTCV = this.SolPercCalculation(solutionorignalDetails[i].WiproPercentageOfTCV, solutionorignalDetails[i].WiproValue);
      OrdersolutionorignalDetails.WiproServiceType = solutionorignalDetails[i].WiproServiceType ? solutionorignalDetails[i].WiproServiceType : "";
      OrdersolutionorignalDetails.WiproSolutionBDMValue = solutionorignalDetails[i].WiproSolutionBDMValue ? solutionorignalDetails[i].WiproSolutionBDMValue : "";
      OrdersolutionorignalDetails.WiproSolutionBDMName = solutionorignalDetails[i].WiproSolutionBDMName ? solutionorignalDetails[i].WiproSolutionBDMName : "";
      OrdersolutionorignalDetails.WiproType = solutionorignalDetails[i].WiproType ? solutionorignalDetails[i].WiproType : "";
      OrdersolutionorignalDetails.WiproValue = solutionorignalDetails[i].WiproValue ? (parseFloat(solutionorignalDetails[i].WiproValue).toFixed(2)).toString() : "";
      OrdersolutionorignalDetails.WiproTypeName = solutionorignalDetails[i].WiproTypeName ? solutionorignalDetails[i].WiproTypeName : "";
      OrdersolutionorignalDetails.WiproInfluenceTypeName = solutionorignalDetails[i].WiproInfluenceTypeName ? solutionorignalDetails[i].WiproInfluenceTypeName : "";
      OrdersolutionorignalDetails.WiproServiceTypeName = solutionorignalDetails[i].WiproServiceTypeName ? solutionorignalDetails[i].WiproServiceTypeName : "";
      OrdersolutionorignalDetails.IsDealRegistered = solutionorignalDetails[i].IsDealRegistered;


      if (this.ParentOrderIdForAmendment) {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = "";
        OrdersolutionorignalDetails.statecode = 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
      }
      else if (this.WTFlag == false && !this.OrderId) {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = "";
        OrdersolutionorignalDetails.statecode = 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
      }
      else if (this.WTFlag == true && !this.OrderId) {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = "";
        OrdersolutionorignalDetails.statecode = 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it, Statecode: 0, DealRegistrationId: '', OrderDealRegistrationId: '' })
        });
      }
      else if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = solutionorignalDetails[i].WiproOpportunitySolutionDetailId ? solutionorignalDetails[i].WiproOpportunitySolutionDetailId : "";
        OrdersolutionorignalDetails.statecode = (OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId) ? 2 : 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it })
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it })
        });
      }
      else {
        OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = solutionorignalDetails[i].WiproOpportunitySolutionDetailId ? solutionorignalDetails[i].WiproOpportunitySolutionDetailId : "";
        OrdersolutionorignalDetails.statecode = (OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId) ? 2 : 0;
        OrdersolutionorignalDetails.DealRegistrationYes = solutionorignalDetails[i].DealRegistrationYes.map(it => {
          return Object.assign({ ...it, OrderDealRegistrationId: '' })
        });
        OrdersolutionorignalDetails.DealRegistrationNo = solutionorignalDetails[i].DealRegistrationNo.map(it => {
          return Object.assign({ ...it, OrderDealRegistrationId: '' })
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
        this.PushToSolutionArray(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, i, solutionlength);
      }
      else {
        this.PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, i, solutionlength);
      }

    }

    if (solutionlength == 0) {
      this.solutionLoader = false;
    }
  }

  PushToSolutionArray(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, i, solutionlength) {
    this.SolutionDetails.push(Object.assign({}, new OrdersolutionDetails(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, false, false, false,
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

  PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, i, solutionlength) {
    let solnamelength = this.SolutionDetails.length + 1;
    this.newsolDataCount = this.newsolDataCount + 1;
    this.SolutionDetails.push(Object.assign({}, new OrdersolutionDetails(OrdersolutionorignalDetails, nameDD, ownerDD, solBDMDD, selectedSolName, selectedOwnerName, selectedSolBDM, false, false, false,
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
      if (this.SolutionDetails[i].solutions.WiproType == '184450001') {
        this.SolutionDetails[i].solutions.OwnerIdValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerIdValue : "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].OwnerName : "";
        if (emittedevt.selectedData.length > 0 && emittedevt.selectedData[0].OwnerIdValue && emittedevt.selectedData[0].OwnerName) {
          this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({
            'SysGuid': emittedevt.selectedData[0].OwnerIdValue,
            'Name': emittedevt.selectedData[0].OwnerName,
            'EmailID': '',
            'Id': emittedevt.selectedData[0].OwnerIdValue
          }));
        } else {
          this.SolutionDetails[i].selectedOwnerName = [];
        }

      }
      else {
        this.SolutionDetails[i].solutions.OwnerIdValue = '';
        this.SolutionDetails[i].solutions.OwnerIdValueName = '';
        this.SolutionDetails[i].selectedOwnerName = [];
        let obj = {
          "Guid": emittedevt.selectedData[0].AccountId,
          "SearchText": '',
          "PageSize": this.pageSize,
          "RequestedPageNumber": this.defaultpageNumber
        }
        this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res => {
          if (res.TotalRecordCount == 1) {
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
    let obj = {
      "Guid": rowData.WiproAccountNameValue,
      "SearchText": emittedevt.objectRowData.searchKey,
      "PageSize": this.pageSize,
      "RequestedPageNumber": emittedevt.currentPage
    }
    this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res => {
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

  getSolOwnerNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    let obj = {
      "Guid": rowData.WiproAccountNameValue,
      "SearchText": emittedevt.objectRowData.searchKey,
      "PageSize": this.pageSize,
      "RequestedPageNumber": this.defaultpageNumber
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


  getOwnerArray(solution, index, searchText) {
    let obj = {
      "Guid": solution.WiproAccountNameValue,
      "SearchText": searchText,
      "PageSize": this.pageSize,
      "RequestedPageNumber": this.defaultpageNumber
    }
    this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res => {
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

  appendOwnername(selectedData, solutions, i) {
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

    if (this.SolutionDetails[i].solutions.WiproType == '184450001') {
      this.SolutionDetails[i].solutions.OwnerIdValue = selectedData.OwnerIdValue;
      this.SolutionDetails[i].solutions.OwnerIdValueName = selectedData.OwnerName;
      this.SolutionDetails[i].selectedOwnerName = new Array(Object.assign({
        'SysGuid': (selectedData.OwnerIdValue) ? selectedData.OwnerIdValue : '',
        'Name': (selectedData.OwnerName) ? selectedData.OwnerName : '',
        'EmailID': '',
        'Id': (selectedData.OwnerIdValue) ? selectedData.OwnerIdValue : ''
      }));
    }
    else {
      this.SolutionDetails[i].solutions.OwnerIdValue = '';
      this.SolutionDetails[i].solutions.OwnerIdValueName = '';
      this.SolutionDetails[i].selectedOwnerName = [];
      let obj = {
        "Guid": selectedData.AccountId,
        "SearchText": '',
        "PageSize": this.pageSize,
        "RequestedPageNumber": this.defaultpageNumber
      }
      this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res => {
        if (res.TotalRecordCount == 1) {
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

  solOwnerclose(solutionData, i, event) {
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
    this.SolutionDetails.unshift(Object.assign({}, new OrdersolutionDetails(newSolutionDetails, [], [], [], [], [], [], false, false, false,
      "solType" + this.newsolDataCount + "NewData" + solnamelength,
      "solName" + this.newsolDataCount + "NewData" + solnamelength,
      "solOwner" + this.newsolDataCount + "NewData" + solnamelength,
      "solPerc" + this.newsolDataCount + "NewData" + solnamelength,
      "solTCV" + this.newsolDataCount + "NewData" + solnamelength,
      "solValue" + this.newsolDataCount + "NewData" + solnamelength,
      "solBDM" + this.newsolDataCount + "NewData" + solnamelength,
      "solInf" + this.newsolDataCount + "NewData" + solnamelength,
      "solST" + this.newsolDataCount + "NewData" + solnamelength,
      "solDealPricing" + this.newsolDataCount + "NewData" + solnamelength,
      )));
    this.service.loaderhome = false;
  }

  deleteBSSolutionValidation(solutionData, searchText, i) {

    this.openDialogDelete("Do you wish to delete this solution", "Confirm", "Delete solution").subscribe(res => {
      if (res == 'save') {
        if (solutionData.WiproOpportunitySolutionDetailId) {
          this.deleteSolutionArray.push(Object.assign({}, this.SolutionDetails[i]))
        }
        this.SolutionDetails.splice(i, 1);
        if (solutionData.WiproOpportunitySolutionDetailId) {
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

      if (this.ParentOrderIdForAmendment) {
        OrderCreditAllocationsDetailsObj.statecode = 0
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = "";
      }
      else if (this.WTFlag == false && !this.OrderId) {
        OrderCreditAllocationsDetailsObj.statecode = 0
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = "";

      }
      else if (this.WTFlag == true && !this.OrderId) {
        OrderCreditAllocationsDetailsObj.statecode = 0;
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = "";

      }
      else if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM) {
        OrderCreditAllocationsDetailsObj.statecode = (CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID) ? 2 : 0;
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID ? CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID : "";

      }
      else {
        OrderCreditAllocationsDetailsObj.statecode = (CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID) ? 2 : 0;
        OrderCreditAllocationsDetailsObj.WiproOpportunityCreditAllocationID = CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID ? CreditAllocationsDetails[i].WiproOpportunityCreditAllocationID : "";
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
      this.creditAllocationdataDetails[i].creditAllocation.WiproValue = "";
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
      this.creditAllocationdataDetails[i].bdmDD = (SLBDMresp.length == 0 && !SearchText && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !SearchText && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
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
      this.creditAllocationdataDetails[i].bdmDD = (SLBDMresp.length == 0 && !SearchText && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ?
        ([{
          'SysGuid': this.selectedVSOObj.Id,
          'Name': this.selectedVSOObj.Name,
          'EmailID': this.selectedVSOObj.EmailID,
          'Id': this.selectedVSOObj.Id
        }]) : SLBDMresp;
      this.totalRecordCount = (SLBDMresp.length == 0 && !SearchText && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
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
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? ([{
        'SysGuid': this.selectedVSOObj.Id,
        'Name': this.selectedVSOObj.Name,
        'EmailID': this.selectedVSOObj.EmailID,
        'Id': this.selectedVSOObj.Id
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
      this.totalRecordCount = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? 1 : ((res && res.TotalRecordCount) ? res.TotalRecordCount : 0);
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (SLBDMresp.length == 0 && !emittedevt.objectRowData.searchKey && this.orderOverviewObj.VerticalSalesOwnerId && this.defaultValue.verticalOwner) ? ([{
        'SysGuid': this.selectedVSOObj.Id,
        'Name': this.selectedVSOObj.Name,
        'EmailID': this.selectedVSOObj.EmailID,
        'Id': this.selectedVSOObj.Id
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
  }

  deletecredit(creditData, i) {
    let tempselectedCA: any = Object.assign({}, creditData);
    this.openDialogDelete("Do you wish to delete this credit allocation", "Confirm", "Delete credit allocation").subscribe(res => {
      if (res == 'save') {
        if (tempselectedCA.WiproOpportunityCreditAllocationID) {
          this.deleteCreditAllocationArray.push(Object.assign({}, this.creditAllocationdataDetails[i]));
        }
        this.creditAllocationdataDetails.splice(i, 1);
        if (tempselectedCA.WiproOpportunityCreditAllocationID) {
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
    }, 500)


  }

  orderrejectpopup(action) {
    if (action == 'Approved') {
      this.OBAllocationAction = 'Approved';
      this.OBAllocationRejectReason = '';
    } else {
      let dialogRef = this.dialog.open(OrderRejectmodifiedPopupComponent, {
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.OBAllocationAction = 'Rejected';
          this.OBAllocationRejectReason = result;
        } else {
          this.OBAllocationAction = '';
          this.OBAllocationRejectReason = '';
        }
      });
    }

  }

  saveModifyApproveReject() {
    let saveObjectArr = [];
    for (let i = 0; i < this.modifiedOrderSaveArray.length; i++) {
      if (!this.modifiedOrderSaveArray[i].Action) {
        this.projectService.displayMessageerror("Please approve or reject all the modification details");
        this.scrolltoMandatoryField();
        return;
      }
      else if (this.modifiedOrderSaveArray[i].Action == '184450001' && !this.modifiedOrderSaveArray[i].RejectionReason) {
        this.projectService.displayMessageerror("Please provide reason for all the rejected modification details");
        this.scrolltoMandatoryField();
        return;
      }
      else {
        saveObjectArr.push(Object.assign({
          recordId: this.modifiedOrderSaveArray[i].OverviewModificationID,
          status: (this.modifiedOrderSaveArray[i].Action == 184450000) ? 'Approved' : 'Rejected',
          reason: this.modifiedOrderSaveArray[i].RejectionReason
        }));
      }
    }

    if (!this.OBAllocationAction && this.ModificationOBAllocation) {
      this.projectService.displayMessageerror("Please approve or reject OB allocation modification details");
      return;
    } else {

      if (saveObjectArr.length > 0 || (this.OBAllocationAction && this.ModificationOBAllocation)) {
        this.submitNonSAPModification(saveObjectArr);
      }
      else {
        this.projectService.displayMessageerror("No data is available for approval");
      }

    }

  }

  submitNonSAPModification(saveObjectArr) {
    let OBAllicationStatus = (this.ModificationOBAllocation && this.OBAllocationAction) ? (this.OBAllocationAction == 'Approved' ? 'Approved' : 'Rejected') : '';
    let OverViewStatus = (saveObjectArr.length > 0) ? (saveObjectArr.every(it => it.status == 'Approved') ? 'Approved' : (saveObjectArr.every(it => it.status == 'Rejected') ? 'Rejected' : 'Partially Approved')) : "";
    let overallStatus: any = "";
    if (OverViewStatus && OBAllicationStatus) {
      overallStatus = (OverViewStatus == 'Approved' && OBAllicationStatus == 'Approved') ? 184450001 : ((OverViewStatus == 'Rejected' && OBAllicationStatus == 'Rejected') ? 184450002 : 184450003);
    } else if (OverViewStatus && !OBAllicationStatus) {
      overallStatus = (OverViewStatus == 'Approved') ? 184450001 : ((OverViewStatus == 'Rejected') ? 184450002 : 184450003);
    } else if (!OverViewStatus && OBAllicationStatus) {
      overallStatus = (OBAllicationStatus == 'Approved') ? 184450001 : 184450002;
    }
    let saveOBj = {
      orderID: this.OrderId,
      orderModificationID: this.ModificationId,
      approvaltype: "Modified Order",
      orderType: "Clean Order",
      decisiondate: new Date().toISOString(),
      isWT: (this.originalWTFlag == true) ? 'Yes' : 'No',
      ownerid: this.UserID,
      entity: "systemusers",
      projections: { status: this.ModificationOBAllocation ? this.OBAllocationAction : '', reason: this.ModificationOBAllocation ? this.OBAllocationRejectReason : '' },
      processinstanceid: this.ModificationCamundaProcessId,
      Records: saveObjectArr,
      overallStatus: overallStatus,
    }
    this.service.loaderhome = true;
    this.orderService.submitModifiedApprovalNonSAP(saveOBj).subscribe(res => {
      if (res && res.data && res.data.length > 0) {
        if (overallStatus == 184450001) {
          this.projectService.throwError('Order modification request approved by BFM');
        } else if (overallStatus == 184450002) {
          this.projectService.throwError('Order modification request rejected by BFM');
        } else if (overallStatus == 184450003) {
          this.projectService.throwError('Order modification request partially approved by BFM');
        }
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
      } else {
        this.projectService.throwError("Server error occured");
      }
      this.service.loaderhome = false;
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
  }

  saveBusinessSolution(onSubmit?, popUp?) {
    if (this.orderOverviewObj.OrderTypeId != 184450006) {
      if (this.WiproIsAmendmentLessthan250k == true) {
        if (this.CurrencyId && this.orderOverviewObj.OrderTCV != 0) {
          this.projectService.getCurrencyStatus(this.CurrencyId).subscribe(currency => {
            if (currency && currency.ResponseObject && currency.ResponseObject.length > 0) {
              let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
              let OrderTCVInDollars = (this.orderOverviewObj.OrderTCV && currencyMultiplier) ? (parseFloat(this.orderOverviewObj.OrderTCV) / currencyMultiplier) : 0;
              if (OrderTCVInDollars > 250000) {
                this.projectService.displayMessageerror('OBTCV can not be greater than $250 K');
              } else {
                this.saveBusinessSolutionValidation(onSubmit, popUp);
              }

            }
            else {
              this.projectService.displayMessageerror('No currency multiplier is available');
            }


          },
            err => {
              this.projectService.displayerror(err.status);
            });

        }
        else {
          this.saveBusinessSolutionValidation(onSubmit, popUp);
        }

      }
      else {
        this.saveBusinessSolutionValidation(onSubmit, popUp);
      }
    } else {
      this.SaveStructureForNegativeAmendment(onSubmit, popUp);
    }

  }

  SaveStructureForNegativeAmendment(onSubmit, popUp) {
    this.noSLBDMOrEngagement = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let saveObject = { CurrencyId: this.orderOverviewObj.CurrencyId, SalesOrderId: this.OrderId, OpportunityId: this.OpportunityId, SolutionAlliance: [], IP: [], Serviceline: [], CreditAllocation: [] };
    for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
      let BSSLDataObj = Object.assign({}, this.BSSLDetails[sl].BSServiceLine);
      if (!BSSLDataObj.WiproSlbdmid || !BSSLDataObj.WiproEngagementModel) {
        this.noSLBDMOrEngagement = true;
      }
      BSSLDataObj.WiproPercentageOftcv = BSSLDataObj.WiproPercentageOftcv ? parseFloat(BSSLDataObj.WiproPercentageOftcv).toFixed(2) : null;
      BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
      SLData.push(Object.assign({
        Cloud: BSSLDataObj.Cloud,
        WiproDualCredit: BSSLDataObj.WiproDualCredit,
        WiproEngagementModel: BSSLDataObj.WiproEngagementModel,
        WiproOpportunityServicelineDetailId: BSSLDataObj.WiproOpportunityServicelineDetailId,
        WiproPercentageOftcv: BSSLDataObj.WiproPercentageOftcv,
        WiproPracticeId: BSSLDataObj.WiproPracticeId,
        WiproSubpracticeid: BSSLDataObj.WiproSubpracticeid,
        WiproSlbdmid: BSSLDataObj.WiproSlbdmid,
        WiproSlbdmidValueName: BSSLDataObj.WiproSlbdmidValueName,
        PricingTypeId: BSSLDataObj.PricingTypeId,
        WiproServicelineidValue: BSSLDataObj.WiproServicelineidValue,
        WiproServicelineidValueName: BSSLDataObj.WiproServicelineidValueName,
        WiproEstsltcv: BSSLDataObj.WiproEstsltcv,
        statecode: BSSLDataObj.statecode,
        wiproorderid: BSSLDataObj.wiproOrderid,
        ServiceLineCloudDetails: BSSLDataObj.AdditionalServiceLinesCloudDetails.map(it => {
          let tempSLCloud = Object.assign({}, it);
          delete tempSLCloud.OrderCloudDetailsId
          return tempSLCloud;
        })
      }));
    }

    saveObject.Serviceline = SLData;


    for (let ip = 0; ip < this.IpDetails.length; ip++) {
      let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
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
        PricingTypeId: BSIpDataObj.PricingTypeId,
        ordersipsID: BSIpDataObj.WiproOpportunityIpId,
        wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid: BSIpDataObj.CloudDetails.map(it => {
          let tempIPCloud = Object.assign({}, it);
          delete tempIPCloud.OrderCloudDetailsId;
          return tempIPCloud;
        }),
        wipro_orderipadditionaldetail: BSIpDataObj.AdditionalSLDetails.map(it => {
          let tempAddIPdetails = Object.assign({}, it);
          delete tempAddIPdetails.OrderIpAdditionalDetailsId;
          return tempAddIPdetails
        }),
        statecode: BSIpDataObj.statecode
      }));
    }
    saveObject.IP = IpData;

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
      let tempdealRegistrationId = BSsolutionDataObj.DealRegistrationYes[0].DealRegistrationId ?  BSsolutionDataObj.DealRegistrationYes[0].DealRegistrationId : 
      (BSsolutionDataObj.DealRegistrationNo[0].DealRegistrationId ? BSsolutionDataObj.DealRegistrationNo[0].DealRegistrationId : "");
      BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
      BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
      SolutionData.push(Object.assign({
        OwnerIdValue: BSsolutionDataObj.OwnerIdValue,
        OwnerIdValueName: BSsolutionDataObj.OwnerIdValueName,
        WiproAccountNameValue: BSsolutionDataObj.WiproAccountNameValue,
        WiproInfluenceType: BSsolutionDataObj.WiproInfluenceType,
        WiproAccountname: BSsolutionDataObj.WiproAccountname,
        WiproOpportunitySolutionDetailId: BSsolutionDataObj.WiproOpportunitySolutionDetailId,
        WiproPercentage: BSsolutionDataObj.WiproPercentage,
        WiproPercentageOfTCV: BSsolutionDataObj.WiproPercentageOfTCV,
        WiproServiceType: BSsolutionDataObj.WiproServiceType,
        WiproSolutionBDMValue: BSsolutionDataObj.WiproSolutionBDMValue,
        WiproSolutionBDMName: BSsolutionDataObj.WiproSolutionBDMName,
        WiproType: BSsolutionDataObj.WiproType,
        WiproValue: BSsolutionDataObj.WiproValue,
        wiproorderid: BSsolutionDataObj.wiproOrderid,
        statecode: BSsolutionDataObj.statecode,
        DealRegistration: BSsolutionDataObj.WiproType == '184450000' ? 
        (BSsolutionDataObj.IsDealRegistered === true ? (BSsolutionDataObj.DealRegistrationYes.map(it => {
          return Object.assign({
            DealRegistrationId : it.DealRegistrationId,
            IsDealRegistered : true,
            SolutionId : it.SolutionId,
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
            DealRegistrationId : it.DealRegistrationId,
            IsDealRegistered : false,
            SolutionId : it.SolutionId,
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
        ) :  (tempdealRegistrationId ? (BSsolutionDataObj.DealRegistrationNo.map(it => {
          return Object.assign({
            DealRegistrationId : tempdealRegistrationId,
            IsDealRegistered : it.IsDealRegistered,
            SolutionId : it.SolutionId,
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
      
    }

    saveObject.SolutionAlliance = SolutionData;


    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      let BScreditAllocationDataObj = Object.assign({}, this.creditAllocationdataDetails[ca].creditAllocation);
      BScreditAllocationDataObj.WiproValue = BScreditAllocationDataObj.WiproValue ? parseFloat(BScreditAllocationDataObj.WiproValue).toFixed(2) : null;
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
        WiproOpportunityCreditAllocationID: BScreditAllocationDataObj.WiproOpportunityCreditAllocationID,
        IsDefault: BScreditAllocationDataObj.WiproIsDefault,
        statecode: BScreditAllocationDataObj.statecode
      }));
    }

    saveObject.CreditAllocation = creditAllocation;

    this.saveBusinessSolutionData(saveObject, onSubmit, popUp);


  }

  saveBusinessSolutionValidation(onSubmit?, popUp?) {
    this.ErrorDisplay = true;
    this.noSLBDMOrEngagement = false;
    if (this.OrderId && this.BFMRole == true && this.ModificationStatus == this.ModificationRequestPendingwithBFM && !onSubmit && !this.ParentOrderIdForAmendment) {
      this.saveModifyApproveReject()
    }
    else {
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
      let saveObject = { CurrencyId: this.orderOverviewObj.CurrencyId, SalesOrderId: this.OrderId, OpportunityId: this.OpportunityId, SolutionAlliance: [], IP: [], Serviceline: [], CreditAllocation: [] };
      if (this.orderOverviewValidation(onSubmit) == false) {
        this.scrolltoMandatoryField();
        return;
      }
      else if (this.businessSOlutionData[0].Sltcv > this.maxDecimalValue) {
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
      else if (this.acceptNegative && this.MinOrderTCV && this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv < 0 && parseFloat(this.businessSOlutionData[0].OverallTcv) < parseFloat(this.MinOrderTCV)) {
        this.projectService.displayMessageerror("Total Order Value cannot be less than " + this.MinOrderTCV + ", Please provide serviceline and IP value accordingly");
        return;
      }
      else {
        for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
          if (!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel) {
            this.noSLBDMOrEngagement = true;
          }
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
          else if (!this.BSSLDetails[sl].BSServiceLine.PricingTypeId) {
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
            BSSLDataObj.AdditionalServiceLinesCloudDetails = (BSSLDataObj.Cloud == false) ? BSSLDataObj.AdditionalServiceLinesCloudDetails.filter(it => {
              if (it.CloudDetailsID) {
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
              WiproOpportunityServicelineDetailId: BSSLDataObj.WiproOpportunityServicelineDetailId,
              WiproPercentageOftcv: BSSLDataObj.WiproPercentageOftcv,
              WiproPracticeId: BSSLDataObj.WiproPracticeId,
              WiproSubpracticeid: BSSLDataObj.WiproSubpracticeid,
              WiproSlbdmid: BSSLDataObj.WiproSlbdmid,
              WiproSlbdmidValueName: BSSLDataObj.WiproSlbdmidValueName,
              PricingTypeId : BSSLDataObj.PricingTypeId ,
              WiproServicelineidValue: BSSLDataObj.WiproServicelineidValue,
              WiproServicelineidValueName: BSSLDataObj.WiproServicelineidValueName,
              WiproEstsltcv: BSSLDataObj.WiproEstsltcv,
              statecode: BSSLDataObj.statecode,
              wiproorderid: BSSLDataObj.wiproOrderid,
              ServiceLineCloudDetails: BSSLDataObj.AdditionalServiceLinesCloudDetails.map(it => {
                let tempSLCloud = Object.assign({}, it);
                delete tempSLCloud.OrderCloudDetailsId
                return tempSLCloud;
              })
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
              WiproOpportunityServicelineDetailId: deleteSLOBJ.WiproOpportunityServicelineDetailId,
              WiproPercentageOftcv: deleteSLOBJ.WiproPercentageOftcv,
              WiproPracticeId: deleteSLOBJ.WiproPracticeId,
              WiproSubpracticeid: deleteSLOBJ.WiproSubpracticeid,
              WiproSlbdmid: deleteSLOBJ.WiproSlbdmid,
              WiproSlbdmidValueName: deleteSLOBJ.WiproSlbdmidValueName,
              PricingTypeId : deleteSLOBJ.PricingTypeId ,
              WiproServicelineidValue: deleteSLOBJ.WiproServicelineidValue,
              WiproServicelineidValueName: deleteSLOBJ.WiproServicelineidValueName,
              WiproEstsltcv: deleteSLOBJ.WiproEstsltcv,
              statecode: 1,
              wiproorderid: deleteSLOBJ.wiproOrderid,
              ServiceLineCloudDetails: deleteSLOBJ.AdditionalServiceLinesCloudDetails.filter(it=> it.CloudDetailsID).map(it => {
                let tempSLCloud = Object.assign({}, it);
                tempSLCloud.CloudStatecode = 1;
                delete tempSLCloud.OrderCloudDetailsId
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
          }
          else if(!this.IpDetails[ip].IP.PricingTypeId){
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
            BSIpDataObj.CloudDetails = (BSIpDataObj.WiproCloud == false) ? BSIpDataObj.CloudDetails.filter(it => {
              if (it.CloudDetailsID) {
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
              PricingTypeId: BSIpDataObj.PricingTypeId ,
              ordersipsID: BSIpDataObj.WiproOpportunityIpId,
              wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid: BSIpDataObj.CloudDetails.map(it => {
                let tempIPCloud = Object.assign({}, it);
                delete tempIPCloud.OrderCloudDetailsId;
                return tempIPCloud;
              }),
              wipro_orderipadditionaldetail: BSIpDataObj.AdditionalSLDetails.map(it => {
                let tempAddIPdetails = Object.assign({}, it);
                delete tempAddIPdetails.OrderIpAdditionalDetailsId;
                return tempAddIPdetails
              }),
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
            PricingTypeId : deleteIPOBJ.PricingTypeId ,
            ordersipsID: deleteIPOBJ.WiproOpportunityIpId,
            wipro_wipro_ordersip_wipro_orderclouddetails_ordersipid: deleteIPOBJ.CloudDetails.filter(it=> it.CloudDetailsID).map(it => {
              let tempIPCloud = Object.assign({}, it);
              tempIPCloud.CloudStatecode = 1;
              delete tempIPCloud.OrderCloudDetailsId
              return tempIPCloud;
            }),
            wipro_orderipadditionaldetail: deleteIPOBJ.AdditionalSLDetails.filter(it=> it.wipro_orderipadditionaldetailid).map(it => {
              let tempAddIPdetails = Object.assign({}, it);
              tempAddIPdetails.statecode = 1;
              delete tempAddIPdetails.OrderIpAdditionalDetailsId;
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
          else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && (!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
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
            BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
            BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
            SolutionData.push(Object.assign({
              OwnerIdValue: BSsolutionDataObj.OwnerIdValue,
              OwnerIdValueName: BSsolutionDataObj.OwnerIdValueName,
              WiproAccountNameValue: BSsolutionDataObj.WiproAccountNameValue,
              WiproInfluenceType: BSsolutionDataObj.WiproInfluenceType,
              WiproAccountname: BSsolutionDataObj.WiproAccountname,
              WiproOpportunitySolutionDetailId: BSsolutionDataObj.WiproOpportunitySolutionDetailId,
              WiproPercentage: BSsolutionDataObj.WiproPercentage,
              WiproPercentageOfTCV: BSsolutionDataObj.WiproPercentageOfTCV,
              WiproServiceType: BSsolutionDataObj.WiproServiceType,
              WiproSolutionBDMValue: BSsolutionDataObj.WiproSolutionBDMValue,
              WiproSolutionBDMName: BSsolutionDataObj.WiproSolutionBDMName,
              WiproType: BSsolutionDataObj.WiproType,
              WiproValue: BSsolutionDataObj.WiproValue,
              wiproorderid: BSsolutionDataObj.wiproOrderid,
              statecode: BSsolutionDataObj.statecode,
              DealRegistration: BSsolutionDataObj.WiproType == '184450000' ? 
        (BSsolutionDataObj.IsDealRegistered === true ? (BSsolutionDataObj.DealRegistrationYes.map(it => {
          return Object.assign({
            DealRegistrationId : it.DealRegistrationId,
            IsDealRegistered : true,
            SolutionId : it.SolutionId,
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
            DealRegistrationId : it.DealRegistrationId,
            IsDealRegistered : false,
            SolutionId : it.SolutionId,
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
        ) :  (tempdealRegistrationId ? (BSsolutionDataObj.DealRegistrationNo.map(it => {
          return Object.assign({
            DealRegistrationId : tempdealRegistrationId,
            IsDealRegistered : it.IsDealRegistered,
            SolutionId : it.SolutionId,
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
            saveObject.SolutionAlliance.push(Object.assign({
              OwnerIdValue: deleteSolOBJ.OwnerIdValue,
              OwnerIdValueName: deleteSolOBJ.OwnerIdValueName,
              WiproAccountNameValue: deleteSolOBJ.WiproAccountNameValue,
              WiproInfluenceType: deleteSolOBJ.WiproInfluenceType,
              WiproAccountname: deleteSolOBJ.WiproAccountname,
              WiproOpportunitySolutionDetailId: deleteSolOBJ.WiproOpportunitySolutionDetailId,
              WiproPercentage: deleteSolOBJ.WiproPercentage,
              WiproPercentageOfTCV: deleteSolOBJ.WiproPercentageOfTCV,
              WiproServiceType: deleteSolOBJ.WiproServiceType,
              WiproSolutionBDMValue: deleteSolOBJ.WiproSolutionBDMValue,
              WiproSolutionBDMName: deleteSolOBJ.WiproSolutionBDMName,
              WiproType: deleteSolOBJ.WiproType,
              WiproValue: deleteSolOBJ.WiproValue,
              wiproorderid: deleteSolOBJ.wiproOrderid,
              statecode: 1,
              DealRegistration: (tempdeletedealRegistrationId ? (deleteSolOBJ.DealRegistrationNo.map(it => {
          return Object.assign({
            DealRegistrationId : tempdeletedealRegistrationId,
            IsDealRegistered : it.IsDealRegistered,
            SolutionId : it.SolutionId,
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
              WiproOpportunityCreditAllocationID: BScreditAllocationDataObj.WiproOpportunityCreditAllocationID,
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
              WiproOpportunityCreditAllocationID: deleteCAOBJ.WiproOpportunityCreditAllocationID,
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
            return;
          }
        }

        this.saveBusinessSolutionData(saveObject, onSubmit, popUp);
      }
    }
  }

  checkCurrencyOnSave(saveObject, onSubmit?, popUp?) {
    let CurrencyValueinDollars = 0;
    this.projectService.getCurrencyStatus(this.CurrencyId).subscribe(currency => {
      if (currency && currency.ResponseObject && currency.ResponseObject.length > 0) {
        let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
        CurrencyValueinDollars = (this.businessSOlutionData[0].OverallTcv && currencyMultiplier) ? (parseFloat(this.businessSOlutionData[0].OverallTcv) / currencyMultiplier) : 0;
        this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars, onSubmit, popUp);
      } else {
        this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars, onSubmit, popUp);
      }
    }, err => {
      this.saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars, onSubmit, popUp);
    });
  }

  saveBusinessSolutionDataOnSave(saveObject, CurrencyValueinDollars, onSubmit?, popUp?) {
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
              this.saveBusinessSolutionData(saveObject, onSubmit, popUp);
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
      this.saveBusinessSolutionData(saveObject, onSubmit, popUp);
    }
  }


  saveBusinessSolutionData(saveObject, onSubmit?, popUp?) {

    let ordercreated = this.OrderId ? true : false;
    this.service.loaderhome = true;
    console.log("saveOBJ1", saveObject);
    console.log("saveOBJ1string", JSON.stringify(saveObject));
    console.log("OverviewOBJstring", JSON.stringify(this.orderOverviewObj));
    let saveOrderObj = Object.assign({}, this.orderOverviewObj);
    if (this.ParentOrderIdForAmendment) {
      Object.assign(saveOrderObj, this.amendmentCreationDetails);
    } else {
      saveOrderObj.ParentOrderId = this.Wipro_SalesOrderId ? this.Wipro_SalesOrderId : null;
      saveOrderObj.WiproIsAmendmentLessthan250k = this.WiproIsAmendmentLessthan250k ? this.WiproIsAmendmentLessthan250k : false;
    }

    saveOrderObj.OrderTypeId = saveOrderObj.OrderTypeId ? saveOrderObj.OrderTypeId : null;
    saveOrderObj.ClassificationId = saveOrderObj.ClassificationId ? saveOrderObj.ClassificationId : null;
    saveOrderObj.SOWTCV = saveOrderObj.SOWTCV ? saveOrderObj.SOWTCV : null;
    saveOrderObj.Wipro_ContractCurrency = saveOrderObj.Wipro_ContractCurrency ? saveOrderObj.Wipro_ContractCurrency : null;
    saveOrderObj.OldWipro_ContractCurrency = (saveOrderObj.OldWipro_ContractCurrency == saveOrderObj.Wipro_ContractCurrency) ? null : saveOrderObj.OldWipro_ContractCurrency;
    saveOrderObj.POAHolderId = saveOrderObj.POAHolderId ? saveOrderObj.POAHolderId : null;
    saveOrderObj.DeletePOAHolderId = (saveOrderObj.DeletePOAHolderId == saveOrderObj.POAHolderId) ? null : saveOrderObj.DeletePOAHolderId;

    saveOrderObj.CountrySubDivisionState = saveOrderObj.CountrySubDivisionState ? saveOrderObj.CountrySubDivisionState : null;
    saveOrderObj.CityRegion = saveOrderObj.CityRegion ? saveOrderObj.CityRegion : null;
    saveOrderObj.DeleteCountrySubDivisionState = (saveOrderObj.DeleteCountrySubDivisionState == saveOrderObj.CountrySubDivisionState) ? null : saveOrderObj.DeleteCountrySubDivisionState;
    saveOrderObj.DeleteCityRegion = (saveOrderObj.DeleteCityRegion == saveOrderObj.CityRegion) ? null : saveOrderObj.DeleteCityRegion;

    saveOrderObj.OrderBookingId = this.ParentOrderIdForAmendment ? null : saveOrderObj.OrderBookingId;
    saveOrderObj.OpportunityId = this.ParentOrderIdForAmendment ? null : saveOrderObj.OpportunityId;
    saveOrderObj.IsICMAccount = (this.IsICMAccount === false) ? false : true;
    saveOrderObj.PricingId = this.PricingId ? this.PricingId : null;
    saveOrderObj.DPSDealCreatedOn = this.DPSDealCreatedOn ? this.DPSDealCreatedOn : null;
    saveOrderObj.DealId = this.DealHeaderID ? this.DealHeaderID : null;
    saveOrderObj.OMPercentage = this.OMPercentage ? this.OMPercentage : 0;
    if (this.ContrcatSigned == true && this.IsICMAccount == false) {
      if (((OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) && this.ContrcatSigned == true) || (this.ApprovalType == orderApprovalType.ConfirmedOrderApproval && OrderApprovalStage.PendingWithBFM != this.approvalStageID && OrderApprovalStage.OnHoldByBFM != this.approvalStageID)) {
        if (this.UploadContract.UploadContractFiles.length == 0 || !this.UploadContract.ContractTitle) {
          this.projectService.displayMessageerror('Please upload the contract given by customer');
          this.service.loaderhome = false;
          return;
        }
      }
      saveOrderObj.ContractTitle = this.UploadContract.ContractTitle;
      saveOrderObj.ContractNotes = this.UploadContract.ContractNotes;
    }
    if (this.IsPricingIdSynced == true) {
      saveOrderObj.IsPricingIdSynced = false;
    }

    // let isSubmitFlag = false;
    // if (!onSubmit) {
    //   if (!this.BFMRole) {
    //     if (this.IsICMAccount) {
    //       if (((OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) && this.ContrcatSigned) || (this.ApprovalType == orderApprovalType.ConfirmedOrderApproval && OrderApprovalStage.PendingWithBFM != this.approvalStageID && OrderApprovalStage.ApprovedbyBFM != this.approvalStageID)) {
    //         isSubmitFlag = true;
    //       }
    //     }
    //   } else {
    //     if (OrderApprovalStage.PendingWithBFM == this.approvalStageID) {
    //       if (this.IsICMAccount) {
    //         if (this.orderOverviewObj.Authorization != this.savedAuthorization) {
    //           isSubmitFlag = true;
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   isSubmitFlag = true;
    // }

    let isSubmitFlag = false;
    if (!onSubmit) {
      if (this.IsICMAccount) {
        if (this.BFMRole && OrderApprovalStage.PendingWithBFM == this.approvalStageID && this.orderOverviewObj.Authorization != this.savedAuthorization) {
          isSubmitFlag = true;
        }
        else if (((OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) && this.ContrcatSigned) || (this.ApprovalType == orderApprovalType.ConfirmedOrderApproval && OrderApprovalStage.PendingWithBFM != this.approvalStageID && OrderApprovalStage.ApprovedbyBFM != this.approvalStageID)) {
          isSubmitFlag = true;
        }
      }
    } else {
      isSubmitFlag = true;
    }


    saveOrderObj.IsSubmit = isSubmitFlag;
    this.orderService.orderOverviewSave(saveOrderObj).subscribe((res: any) => {
      debugger;
      console.log("save order payload", this.orderOverviewObj)
      if (!res.IsError) {
        this.submitOrderObj['flagWarning'] = res.ResponseObject.flagWarning;
        if (!this.OrderId) {
          this.validation_window = false;
          this.orderOverviewObj.OrderBookingId = res.ResponseObject.OrderBookingId ? res.ResponseObject.OrderBookingId : '';
          this.OrderNumber = res.ResponseObject.OrderNumber ? res.ResponseObject.OrderNumber : '';
          this.OrderId = res.ResponseObject.OrderBookingId ? res.ResponseObject.OrderBookingId : '';
          this.OpportunityId = (res.ResponseObject.OpportunityId) ? (res.ResponseObject.OpportunityId) : ''
          this.orderCreated = true;
          this.projectService.ProceedQualify = false;
          this.projectService.ordercreatesuccess = true;
          this.projectService.setSession('ordercreated', true);

          let CLoseoppPayload =
          {
            "OpportunityId": this.OpportunityId,
            "OwnerId": this.oppowner,
            "WiproPipelinestage": 184450004
          }
          console.log(CLoseoppPayload, 'closeopportunitypayload')
          this.projectService.saveOpportunityData(CLoseoppPayload).subscribe(saveobj => {
            if (!saveobj.IsError) {
              console.log(saveobj, 'closeopportunitypayload')
              this.projectService.setSession('currentState', saveobj.ResponseObject.PipelineStage ? saveobj.ResponseObject.PipelineStage.toString() : "");
              this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === saveobj.ResponseObject.PipelineStage);
            }


          },
            err => {
              this.projectService.displayerror(err.status);
            });
        }
        else {
          this.validation_window = false;
          this.OrderNumber = res.ResponseObject.OrderNumber ? res.ResponseObject.OrderNumber : '';
          this.OrderId = res.ResponseObject.OrderBookingId ? res.ResponseObject.OrderBookingId : '';
          this.OpportunityId = (res.ResponseObject.OpportunityId) ? (res.ResponseObject.OpportunityId) : ''
          this.orderCreated = true;
        }

        saveObject.SalesOrderId = res.ResponseObject.OrderBookingId;
        if (this.ParentOrderIdForAmendment) {
          this.ParentOrderIdForAmendment = "";
          this.amendmentCreationDetails = {};
          this.orderService.newAmendmentDetails = "";
          this.orderService.parentOrderId = "";
          this.IsAmendment = true;
          this.projectService.setSession('IsAmendment', true);
          this.projectService.setSession('orderId', this.OrderId);
          this.projectService.setSession('orderName', res.ResponseObject.OrderName ? res.ResponseObject.OrderName : '');
          this.projectService.setSession('opportunityId', this.OpportunityId);
          this.projectService.setSession('opportunityName', res.ResponseObject.OpportunityName ? res.ResponseObject.OpportunityName : '');
        }

        //set OPP ID and name in session


        // Order LOI Upload

        if (!this.ContrcatSigned) {
          let body = {
            "SalesOrderId": res.ResponseObject.OrderBookingId ? res.ResponseObject.OrderBookingId : '',
            "Authorization": true,
            "Wipro_LetterofIntentReceivedDate": this.loiReceivedDate ? this.loiReceivedDate : null,
            "Wipro_ExpectedSOWDate": this.loiValidity ? this.loiValidity : null,
            "Wipro_RevenueAccrueableValue": this.loiValue ? this.loiValue : null,
            "Wipro_LetterofIntentCurrency": null,
            "Wipro_OARFlag": "true",
            "LOIAttachment": this.loiAttachedDocuments.filter(res => !res.AttachmentId)
          }

          this.orderService.updateOrderLOIDetails(body).subscribe(uploadLetterofIntentDetail => {
            console.log(uploadLetterofIntentDetail);
            this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
          }, err => {
            this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
            console.log(err);
          });

        } else {
          if (this.ContrcatSigned == true && this.IsICMAccount == false) {
            let filteredContract = this.UploadContract.UploadContractFiles.filter(it => !it.AttachmentId);
            if (filteredContract.length > 0) {
              let contractsaveObj = {
                SalesOrderId: this.OrderId,
                LOIAttachment: filteredContract.map(it => {
                  return Object.assign({
                    UploadFileName: it.UploadFileName,
                    UploadedUrl: it.UploadedUrl,
                    UniqueKey: it.UniqueKey,
                  })
                })
              }

              this.orderService.saveAttachmentsOrderContracts(contractsaveObj).subscribe(uploaderPOdetails => {
                this.savePODetailsOnOrderSave(saveObject, onSubmit, popUp, ordercreated);
              }, err => {
                this.savePODetailsOnOrderSave(saveObject, onSubmit, popUp, ordercreated);
                console.log(err);
              });



            } else {
              this.savePODetailsOnOrderSave(saveObject, onSubmit, popUp, ordercreated);
            }



          } else {
            this.savePODetailsOnOrderSave(saveObject, onSubmit, popUp, ordercreated);
          }
        }

      }
      else {
        if (res.ResponseObject != null && (onSubmit || (this.approvalStageID == OrderApprovalStage.ApprovedbyADH_VDH_SDH && this.ContrcatSigned == true))) {
          this.service.loaderhome = false;
          if (res.ResponseObject.flagWarning == true) {
            console.log("flag is", res.ResponseObject.flagWarning);
            if(this.approvalStageID == OrderApprovalStage.ApprovedbyADH_VDH_SDH && this.ContrcatSigned == true){
            onSubmit = true;
            }
            this.submitOrderObj['flagWarning'] = res.ResponseObject.flagWarning;
            if(this.orderOverviewObj.Authorization){
            this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
            }else{
              this.savePODetailsOnOrderSave(saveObject, onSubmit, popUp, ordercreated);
            }

            // const dialogRef = this.dialog.open(ContractPopup, {
            //   width: '550px',
            //   data: {
            //     WarningMsg: res.ResponseObject.WarningMessage
            //   }
            // });
          }
        } else {
          this.service.loaderhome = false;
          this.projectService.throwError(res.Message);
        }

      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
  }


  savePODetailsOnOrderSave(saveObject, onSubmit?, popUp?, ordercreated?) {
    if (this.orderOverviewObj.Authorization == false && this.ContrcatSigned == true && this.poDetailsData && this.poDetailsData.length > 0) {

      let PODetails: any = this.poDetailsData.map(po => {
        return Object.assign({
          Wipro_POTableId: po.Wipro_POTableId ? po.Wipro_POTableId : null,
          Wipro_Remarks: po.Wipro_Remarks,
          Wipro_Name: null,
          Wipro_PONumber: po.Wipro_PONumber,
          Wipro_SignedDate: this.getIsoDateFormat(po.Wipro_SignedDate),
          POValue: po.POValue ? po.POValue : null,
          POCurrency: po.POCurrency ? po.POCurrency : '',
          POCurrencyId: po.POCurrencyId ? po.POCurrencyId : '',
          // Wipro_AccountNumber: po.AccountId? po.AccountId : '',
          Wipro_StartDate: po.Wipro_StartDate ? this.getIsoDateFormat(po.Wipro_StartDate) : '',
          Wipro_EndDate: po.Wipro_EndDate ? this.getIsoDateFormat(po.Wipro_EndDate) : '',
          Wipro_POIssuanceDate: po.Wipro_POIssuanceDate ? this.getIsoDateFormat(po.Wipro_POIssuanceDate) : '',
          Wipro_ValuewithoutTax: po.Wipro_ValuewithoutTax ? po.Wipro_ValuewithoutTax : '',
        })
      })
      const payload = {
        OrderId: this.OrderId,
        PODetails: PODetails
      }
      console.log("SavePOdetails", payload);
      this.orderService.savePOdetails(payload).subscribe(uploaderPOdetails => {
        console.log("UploadSavePOdetails",uploaderPOdetails);
        this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
      }, err => {
        this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
        console.log(err);
      });
    } else {
      this.saveOBAllocationOnSave(saveObject, onSubmit, popUp, ordercreated);
    }
  }

  saveOBAllocationOnSave(saveObject, onSubmit?, popUp?, ordercreated?) {
    console.log("saveOBJ", saveObject);
    console.log("saveOBJ1", JSON.stringify(saveObject));
    saveObject.OpportunityId = this.OpportunityId;
    //OB Allocation Save
    this.orderService.saveOBAllocation(saveObject).subscribe((response: any) => {
      if (response && response.IsError == true) {
        this.projectService.throwError(response.Message);
        this.service.loaderhome = false;
      } else {
        this.projectService.clearSession("smartsearchData");
        this.userOrderFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.service.loaderhome = false;
        if (onSubmit) {
          this.checkWTFlagChange(this.OrderId, onSubmit, popUp, null);
        } else {
          if (ordercreated == true) {
            this.projectService.displayMessageerror('Order updated successfully ' + this.OrderNumber);
          } else {
            this.projectService.displayMessageerror('Order created successfully ' + this.OrderNumber);
          }


          if (((OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) && this.ContrcatSigned == true) || (this.opportunityData.ApprovalTypeId == orderApprovalType.ConfirmedOrderApproval && OrderApprovalStage.RejectedbyBFM == this.approvalStageID)) {
            this.checkWTFlagChange(this.OrderId, null, 'approval', true);

          } else {
            this.checkWTFlagChange(this.OrderId, null, null, null);
          }
        }
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    })
  }

  setNonWTFlag(orderId, onSubmit, popUp, submit) {
    let payload = {
      Guid: orderId,
      Flag: (this.originalWTFlag == true) ? false : true,
      IsProceedToClose: false
    }

    this.orderService.setNonWTstatus(payload).subscribe((res: any) => {
      console.log("setNonWT", res);
      this.reloadOrderOnSave(orderId, onSubmit, popUp, submit);
    },
      err => {
        this.reloadOrderOnSave(orderId, onSubmit, popUp, submit);
      });
  }

  checkWTFlagChange(orderId, onSubmit, popUp, submit) {
    let payload = {
      OrderOrOpportunityId: orderId,
      IsOrderCheckNonBPO: true
    }
    this.service.loaderhome = true;
    this.orderService.getWTstatus(payload).subscribe((res: any) => {
      this.originalWTFlag = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
      this.setNonWTFlag(orderId, onSubmit, popUp, submit);
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
      this.checkforAmendmentOrder();
      this.projectService.setordersave(true);
    });
  }


  reloadOrderOnSave(orderId, onSubmit, popUp, submit) {
    if (!onSubmit && !submit) {
      this.service.loaderhome = false;
      this.checkforAmendmentOrder();
      this.projectService.setordersave(true);
    } else {
      this.checkpricingIdforWT(orderId, onSubmit, popUp, submit);
    }
  }




  checkpricingIdforWT(orderId, onSubmit, popUp, submit) {

    if (this.originalWTFlag == false || this.orderOverviewObj.OrderTypeId == 184450006) {
      this.service.loaderhome = false;
      this.navigateToSubmit(onSubmit, popUp, submit);
    } else {
      if (popUp == 'foreclosure' || popUp == 'invoice') {
        this.service.loaderhome = false;
        this.navigateToSubmit(onSubmit, popUp, submit);
        return;
      }

      let bookingIdPayload = {
        Guid: orderId
      }
      this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
        this.PricingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingId) ? orderDetails.ResponseObject.PricingId : "";
        this.service.loaderhome = false;
        if (this.PricingId || this.ContrcatSigned == false ) {
          this.navigateToSubmit(onSubmit, popUp, submit);
        }
         else {

          // this.checkforAmendmentOrder();
          // this.projectService.setordersave(true);
          // this.projectService.displayMessageerror("Order/Amendment can't be submitted for approval as Approved pricing ID is not tagged against it");
          let dialogRef = this.dialog.open(securedealpopup, {
            width: '350px',
            data: { pricingIdAvail: false }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.checkforAmendmentOrder();
            this.projectService.setordersave(true);

          });
        }
      }, err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
      });
    }
  }

  // checkpricingIdforWT(orderId, onSubmit, popUp, submit) {

  //       let payload = {
  //         OrderOrOpportunityId: orderId,
  //         IsOrderCheckNonBPO: true
  //       }
  //       this.service.loaderhome = true;
  //       this.orderService.getWTstatus(payload).subscribe((res: any) => {
  //         this.originalWTFlag = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
  //         if (this.originalWTFlag == false || this.orderOverviewObj.OrderTypeId == 184450006) {
  //           this.service.loaderhome = false;
  //           this.navigateToSubmit(onSubmit, popUp, submit);
  //         } else {

  //           let bookingIdPayload = {
  //             Guid: orderId
  //           }
  //           this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
  //             this.PricingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingId) ? orderDetails.ResponseObject.PricingId : "";
  //             this.service.loaderhome = false;
  //             if (this.PricingId) {
  //               this.navigateToSubmit(onSubmit, popUp, submit);
  //             } else {
  //               this.checkforAmendmentOrder();
  //               this.projectService.setordersave(true);
  //               this.projectService.displayMessageerror("Order/Amendment can't be submitted for approval as Approved pricing ID is not tagged against it");
  //             }
  //           }, err => {
  //             this.service.loaderhome = false;
  //             this.projectService.displayerror(err.status);
  //             this.checkforAmendmentOrder();
  //             this.projectService.setordersave(true);
  //           });
  //         }
  //       }, err => {
  //         this.service.loaderhome = false;
  //         this.projectService.displayerror(err.status);
  //         this.checkforAmendmentOrder();
  //         this.projectService.setordersave(true);
  //       });
  //     }

  navigateToSubmit(onSubmit, popUp, submit) {
    // if (onSubmit) {
    this.openSubmitOrderClick(popUp, submit);
    // } else if (submit) {
    //   this.submitOrder();
    // }
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
    if (this.userOrderFrm.dirty) {
      this.service.dirtyflag = true;
    }
    else {
      this.service.dirtyflag = false;
    }

    if (this.serviceLineLoader == false && this.IpLoader == false && this.solutionLoader == false && this.creditAllocationLoader == false) {
      this.serviceLineLoader = true;
      this.IpLoader = true;
      this.solutionLoader = true;
      this.creditAllocationLoader = true;
      this.service.loaderhome = false;

      if (this.IsPricingIdSynced == true && this.OrderOwnerRole == true) {
        let DPSMessage: any = this.DPSSyncAlertMessage ? this.DPSSyncAlertMessage : 'New approved pricing values have synced to OB Allocation, Please validate sales order details';
        this.projectService.displayMessageerror(DPSMessage);
      }
    }


  }










  //**************************************************************End of Sumit Code*************************************************************//

  //**************************************************************OverView Lookup start*************************************************************//
  advanceLookUpSearch(lookUpData) {
    debugger;
    let selecteddata = [];
    console.log("open", lookUpData);
    let labelName = lookUpData.labelName;

    selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
    switch (labelName) {
      case 'SAPCode': {
        this.openadvanceOverViewSearch('SAPCode', this.sapCustomerCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
      case 'VSO': {
        this.openadvanceOverViewSearch('VSO', this.verticalCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
      case 'Advisor': {
        this.openadvanceOverViewSearch('Advisor', this.advisorCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
      case 'Contractingcountry': {
        this.openadvanceOverViewSearch('Contractingcountry', this.CountryArray, selecteddata, lookUpData.inputVal);
        return
      }
      case 'Currency': {
        this.openadvanceOverViewSearch('Currency', this.currencyCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
      case 'ContractCurrency': {
        this.openadvanceOverViewSearch('ContractCurrency', this.currencyCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
    }
  }

  openadvanceOverViewSearch(controlName, lookUpDD, selecteddata, value) {
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


    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });


    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      console.log(x)
      if (x.action == 'loadMore') {
        console.log("loadMore", x);
        if (controlName == 'SAPCode') {
          this.getSapCodeDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'VSO') {
          this.getVSODataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Advisor') {
          this.getAdvisorDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Contractingcountry') {
          this.getCountryDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Currency') {
          this.getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'ContractCurrency') {
          this.getConrtactCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }


      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'SAPCode') {
          this.getSapCodeOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'VSO') {
          this.getVSOOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Advisor') {
          this.getAdvisorOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Contractingcountry') {
          this.getCountryOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'Currency') {
          this.getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
        else if (controlName == 'ContractCurrency') {
          this.getConrtactCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }


      }



    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'SAPCode') {
        this.OnCloseOfSapCodePopUp(controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'VSO') {
        this.OnCloseOfVSOPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'Advisor') {
        this.OnCloseOfAdvisorPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'Contractingcountry') {
        this.OnCloseOfCountryPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'Currency') {
        this.OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
      else if (controlName == 'ContractCurrency') {
        this.OnCloseOfConrtactCurrencyPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
    });
  }
  //**************************************************************OverView Lookup End*************************************************************//

  submitOrderObj = {};


  openSubmitOrderClick(popup, isconfirmOrderApproval) {
    if (this.orderOverviewObj.OrderTypeId == 184450006 && this.BFMRole == true) {
      this.approveNegativeAmend();
    }
    else {
      // If order is on-hold by a bfm, order owner again resubmit the order code starts
      // if (this.opportunityData.ApprovalStageId == OrderApprovalStage.OnHoldByBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedbyBFM || this.opportunityData.ApprovalStageId == OrderApprovalStage.RejectedByADH_VDH_SDH) {
      //   this.openOrderResubmitPopup();
      // }
      // If order is on-hold by a bfm, order owner Pagain resubmit the order code ends

      // else
       if ((this.orderApprovalStatus.WT) && (popup === 'foreclosure' || popup === 'invoice' || popup === 'approval')) {

        this.submitOrderObj['signedStatus'] = (this.ContrcatSigned == true) ? 'Yes' : 'No';
        this.submitOrderObj['status'] = this.orderApprovalStatus;
        this.submitOrderObj['orderType'] = popup;
        this.submitOrderObj['opportunityData'] = this.opportunityData
        this.getTeamOfActive(popup, isconfirmOrderApproval);
      } else if ((!this.orderApprovalStatus.WT) && (popup === 'foreclosure' || popup === 'invoice' || popup === 'approval')) {

        this.submitOrderObj['signedStatus'] = (this.ContrcatSigned == true) ? 'Yes' : 'No';
        this.submitOrderObj['orderType'] = popup;
        this.submitOrderObj['status'] = this.orderApprovalStatus;
        this.submitOrderObj['opportunityData'] = this.opportunityData
        this.finanaceTeamForNonWt(popup, isconfirmOrderApproval);
      }
    }
  }
  //negative amendemnt direct approval
  approveNegativeAmend() {
    const approvalPayload = {
      "StatusCode": negativeEnum.StatusCode,
      "ApprovalType": orderApprovalType.NegativeAmendmentApproval,
      "DecisionDate": this.currentDate,//current date  
      "ApprovalStage": OrderApprovalStage.ApprovedbyBFM,
      "OrderId": this.OrderId,//order booking id
      "OwnerShip": negativeEnum.OwnerShip,
      "ApprovalUser": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'), //logged in user id
    }
    console.log("negativeapproval", approvalPayload);
    this.orderService.approveNegativeAmend(approvalPayload).subscribe((res: any) => {
      this.service.loaderhome = false;
      this.projectService.displayMessageerror("Order auto approved successfully")
      this.checkforAmendmentOrder();
      this.projectService.setordersave(true);
    });

  }

  approvalPopUp(data, isconfirmOrderApproval) {
    data['orderId'] = this.orderOverviewObj.OrderBookingId;
    data['approvaltype'] = this.opportunityData.ApprovalType;
    data['tcvErrorMessage'] = false;
    data['crmReferenceNumber'] = this.orderOverviewObj.CrmReferenceNumber;
    data['isconfirmOrderApproval'] = isconfirmOrderApproval ? true : false;
    if (this.WTFlag && (this.currencyMismatch || this.showTolerence)) {
      data['tcvErrorMessage'] = true;
    }

    if (isconfirmOrderApproval) {
      if (this.WTFlag) {
        data['disableBFMFlag'] = true;
      } else {
        // if (this.opportunityData.IsDOPServiceLine) {
        //   data['disableBFMFlag'] = true;
        // }
      }
    }


    data['isAmendment'] = this.IsAmendment ? this.IsAmendment : false;
    data['mismatchData'] = this.noSLBDMOrEngagement;
    const dialogRef = this.dialog.open(SubmitOrderPopup, {
      width: '520px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.isconfirmOrderApproval) {
        this.submitConfirmOrderApproval(data.bfm);
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
      }
      else if (data && data.setWT) {
        let requestBody = {
          "Guid": this.orderOverviewObj.OrderBookingId
        }
        this.orderService.getStatusForRetag(requestBody).subscribe((ris: any) => {
          if (!ris.IsError) {
            if (ris && !ris.ResponseObject) {
              const approvalRef = this.dialog.open(integratedDealPopup,
                {
                  width: '350px',
                  data: {
                    message: "This order will be auto approved from DM in 5 minutes."
                  }
                });
              approvalRef.afterClosed().subscribe((ris) => {
                this.checkforAmendmentOrder();
                this.projectService.setordersave(true);
              })
            } else {
              this.checkforAmendmentOrder();
              this.projectService.setordersave(true);
            }
          } else {
            this.projectService.displayMessageerror(ris.message);
            this.checkforAmendmentOrder();
            this.projectService.setordersave(true);
          }
        })


      }
      else {
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
      }

    });
  }
  requestpopup(data) {
    const dialogRef = this.dialog.open(Requestpopup, {
      width: '400px',
      data: data
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.checkforAmendmentOrder();
      this.projectService.setordersave(true);
    })
  }

  requestinvoicepopup(data) {
    const payload = {
      "OrderOrOpportunityId": this.opportunityData.OrderBookingId
    }

    this.orderService.getBFMUsersForRequestInvoice(payload).subscribe((activeteamBfmWt: any) => {
      console.log("request invoice bfm", activeteamBfmWt)
      if (activeteamBfmWt.ResponseObject && activeteamBfmWt.ResponseObject.length > 0) {
        data['finanaceTeamForNonWt'] = activeteamBfmWt.ResponseObject;
        const dialogRef = this.dialog.open(Requestinvoicepopup, {
          width: '400px',
          data: data
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.checkforAmendmentOrder();
          this.projectService.setordersave(true);
        })
      }

    }, err => {
      this.projectService.displayMessageerror('Error occured while fetching BFM list');
    });



  }

  contractStatus: boolean;



  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });
  }

  // /*
  // **************** Orderover View starts here ****************************************
  // **************** Orderover View fn(), includes save update and validations *********
  // **************** fn() for getting data from pop-up class ***************************
  // */

  // orderover view init fn()
  orderOverviewInit() {
    this.orderType();
    this.classification();
    this.checkforAmendmentOrder();
    this.orderStatus();
    this.getAmendmentDetails();
    this.approvalStatusEnum();
    this.deleteSuccessPoDetails();
    // this.getOppData();
  }

  ModifyOrderApproval: any = orderApprovalType.Modified_Order;
  InvoicingApproval;
  ForeclosureApproval;
  ConfirmOrderApproval;
  NegativeAmendmentApproval;
  OrderApproval;

  approvedByDM;
  pendingWithDM;
  rejectedByDM;
  approvedByBFM;
  pendingWithBFM;
  onHoldByBFM;
  rejectedByBFM;
  approvedByADH_VDH;
  rejectedByADH_VDH;
  pendingWithADH_VDH;
  onHoldWithADH_VDH;
  InvoicingPendingWithBFM;
  InvoicingApprovedByBFM;
  InvoicingRejectedByBFM;
  ForeClosurePendingWithDM;
  ForeClosureApprovedByDM;
  ForeClosureRejectedByDM;
  pendingWithICTeam;
  approvedByICTeam;
  rejectedByICTeam;
  oppDataIsSimpleDeal: any = false;

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

  deleteSuccessPoDetails() {
    this.orderService.deleteSuccessPoDetails().subscribe(res => {
      if (res.data) {
        let maxPOsignedDateArr = res.data.map(date => date.Wipro_SignedDate ? new Date(date.Wipro_SignedDate) : null);
        let maxPOsignedDate: any = new Date(Math.max.apply(null, maxPOsignedDateArr));
        this.contractSignedDate = maxPOsignedDate ? maxPOsignedDate : '';
        if (!this.contractSignedDate) {
          this.changeContractSignedDate('');
        } else {
          this.changeContractSignedDate(this.contractSignedDate);
        }
      }
    });
  }

  // mandatoryFeildsStatus() {
  //   if (this.projectService.getSession('currentState') == '184450003' || this.projectService.getSession('isSimpleOpportunity')) {
  //     let fields: any = [];
  //     this.validation_window = true;
  //     setTimeout(() => {
  //       let requiredElements = this.el.nativeElement.querySelectorAll('select[required], input[required], textarea[required]');
  //       console.log(requiredElements);
  //       if (requiredElements.length) {
  //         requiredElements.forEach(ele => {
  //           if (ele.form) {
  //             let str = ele.form.innerText.trim();
  //             str = str.split('*');
  //             str = str[0];
  //             let obj = {
  //               status: false,
  //               element: str
  //             }
  //             if (!ele.value) {
  //               obj.status = false;
  //               fields.push(obj);
  //             } else {
  //               obj.status = true;
  //               fields.push(obj);
  //             }
  //           }
  //         });
  //         this.mandatoryFields = fields.filter((item, index) => {
  //           return index === fields.findIndex(obj => {
  //             return JSON.stringify(obj) === JSON.stringify(item);
  //           });
  //         });
  //       }
  //       console.log(this.mandatoryFields);
  //     }, 0);
  //   } else {
  //     this.validation_window = false;
  //   }
  // }

  approvalStatusEnum() {
    this.approvedByDM = OrderApprovalStage.ApprovedbyDM;
    this.pendingWithDM = OrderApprovalStage.PendingWithDM;
    this.rejectedByDM = OrderApprovalStage.RejectedByDM;
    this.approvedByBFM = OrderApprovalStage.ApprovedbyBFM;
    this.pendingWithBFM = OrderApprovalStage.PendingWithBFM;
    this.onHoldByBFM = OrderApprovalStage.OnHoldByBFM;
    this.rejectedByBFM = OrderApprovalStage.RejectedbyBFM;
    this.approvedByADH_VDH = OrderApprovalStage.ApprovedbyADH_VDH_SDH;
    this.rejectedByADH_VDH = OrderApprovalStage.RejectedByADH_VDH_SDH;
    this.pendingWithADH_VDH = OrderApprovalStage.PendingWithADH_VDH_SDH;
    this.Pendingwithdealowner = OrderApprovalStage.Pendingwithdealowner;
    this.onHoldWithADH_VDH = OrderApprovalStage.OnHoldByADH_VDH_SDH;
    this.InvoicingPendingWithBFM = OrderApprovalStage.InvoicingRequestPendingwithBFM;
    this.InvoicingApprovedByBFM = OrderApprovalStage.InvoicingRequestApprovedbyBFM;
    this.InvoicingRejectedByBFM = OrderApprovalStage.InvoicingRequestRejectedbyBFM;
    this.ForeClosurePendingWithDM = OrderApprovalStage.ForeclosureRequestPendingwithDM;
    this.ForeClosureApprovedByDM = OrderApprovalStage.ForeclosureRequestApprovedbyDM;
    this.ForeClosureRejectedByDM = OrderApprovalStage.ForeclosureRequestRejectedbyDM;
    this.pendingWithICTeam = OrderApprovalStage.PendingwithICTeam;
    this.approvedByICTeam = OrderApprovalStage.ApprovedbyICTeam;
    this.rejectedByICTeam = OrderApprovalStage.RejectedbyICTeam;
    this.OrderApproval = orderApprovalType.Order;
    this.InvoicingApproval = orderApprovalType.Invoicing;
    this.ForeclosureApproval = orderApprovalType.Foreclosure;
    this.ConfirmOrderApproval = orderApprovalType.ConfirmedOrderApproval;
    this.NegativeAmendmentApproval = orderApprovalType.NegativeAmendmentApproval;

  }

  viewModificationDetails(modificationId) {
    this.projectService.setSession('orderModificationId', modificationId);
    this.projectService.setSession('disableall', true);
    this.router.navigate(['/opportunity/orderactions/modifyorder']);
  }


  reminderCommentPopup(reminderheader: string, remindercontext: string, reminderplaceHolder: string, remindErerrorMessage: string): Observable<any> {
    let dialogRef = this.dialog.open(reminderCommentPopup, {
      width: "460px",
      data: {
        Header: reminderheader,
        Context: remindercontext,
        PlaceHolder: reminderplaceHolder,
        errorMessage: remindErerrorMessage
      }
    });

    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }

  openExpediatePopUp(approvalLogObj, index) {

    this.reminderCommentPopup("Are you sure you want to remind BFM to approve the modified order details?", "Reminder reason*", "Enter your comment", "Please provide the reminder reason").subscribe(res => {
      // remarks
      if (res && res.action) {
        if (res.action == "save") {
          this.ModifiedApprovalExpedite(approvalLogObj, index, res.remarks);

        }
      }
    });

  }

  ModifiedApprovalExpedite(approvalLogObj, index, remarks) {
    let expediteCount: any = approvalLogObj.ExpediteRequestCount + 1;
    let saveObj = {
      Guid: approvalLogObj.OrderModificationRequestId,
      PageSize: expediteCount,
      Remarks: remarks
    }
    this.service.loaderhome = true;
    this.orderService.submitModifiedApprovalExpedite(saveObj).subscribe(res => {
      if (res && !res.IsError && res.ResponseObject == true) {
        this.projectService.throwError('A reminder has been sent to the approving team');
        this.approvalLog[index].ExpediteRequestCount = expediteCount;
      } else {
        this.projectService.throwError("Server error occured");
      }
      this.service.loaderhome = false;
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
  }


  cancelModification(approvalLogObj) {
    let currentDate = new Date();
    let saveObj = {
      orderID: this.orderOverviewObj.OrderBookingId,
      orderModificationID: approvalLogObj.OrderModificationRequestId,
      approvaltype: "Modified Order",
      orderType: "Clean Order",
      decisiondate: currentDate.toISOString(),
      isWT: this.originalWTFlag == true ? "Yes" : "No",
      ownerid: this.UserID,
      entity: "systemusers",
      overallStatus: 184450004,
      processinstanceid: approvalLogObj.CamundaProcessId
    }
    this.service.loaderhome = true;
    this.orderService.submitModifiedApprovalNonSAP(saveObj).subscribe(res => {
      if (res && res.data && res.data.length > 0) {
        this.projectService.throwError('Order modification cancelled successfully');
        this.checkforAmendmentOrder();
        this.projectService.setordersave(true);
      } else {
        this.projectService.throwError("Server error occured");
      }
      this.service.loaderhome = false;
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
  }

  approvalLogApproveArray = [
    OrderApprovalStage.ApprovedbyDM,
    OrderApprovalStage.ApprovedbyBFM,
    OrderApprovalStage.ApprovedbyADH_VDH_SDH,
    OrderApprovalStage.InvoicingRequestApprovedbyBFM,
    OrderApprovalStage.ForeclosureRequestApprovedbyDM,
    OrderApprovalStage.ApprovedbyICTeam,
  ];

  approvalLogRejectArray = [
    OrderApprovalStage.RejectedByDM,
    OrderApprovalStage.RejectedbyBFM,
    OrderApprovalStage.RejectedByADH_VDH_SDH,
    OrderApprovalStage.InvoicingRequestRejectedbyBFM,
    OrderApprovalStage.ForeclosureRequestRejectedbyDM,
    OrderApprovalStage.RejectedbyICTeam,
  ];

  approvallogOnHoldByBFM = OrderApprovalStage.OnHoldByBFM;

  ModificationPendingwithBFM = OrderModificationRequestStatus.ModificationRequestPendingwithBFM;
  ModificationApprovedbyBFM = OrderModificationRequestStatus.ModificationRequestApprovedbyBFM;
  ModificationRejectedbyBFM = OrderModificationRequestStatus.ModificationRequestRejectedbyBFM;
  ModificationPartiallyApprovedbyBFM = OrderModificationRequestStatus.ModificationRequestPartiallyApprovedbyBFM;
  ModificationCancelled = OrderModificationRequestStatus.ModificationRequestCancelled;

  approvalLogOnHoldArray = [
    OrderApprovalStage.OnHoldByBFM,
    OrderApprovalStage.OnHoldByADH_VDH_SDH
  ];

  approvalLogPendingArray = [
    OrderApprovalStage.PendingWithDM,
    OrderApprovalStage.PendingWithBFM,
    OrderApprovalStage.PendingWithADH_VDH_SDH,
    OrderApprovalStage.InvoicingRequestPendingwithBFM,
    OrderApprovalStage.ForeclosureRequestPendingwithDM,
    OrderApprovalStage.PendingwithICTeam,
    OrderApprovalStage.Pendingwithdealowner
  ];


  getOrderApprovalLog(orderBookingId: string) {
    // this.service.loaderhome = true;
    let requestBody = {
      SalesOrderId: orderBookingId
    }
    this.orderService.getOrderApprovalLog(requestBody).subscribe(res => {
      // this.service.loaderhome = false;
      if (!res.IsError) {
        this.approvalLog = res && res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject.map(it => {
          let WiproOrderApprovalStage = it.WiproOrderApprovalStage ? it.WiproOrderApprovalStage : "";
          let ModificationRequestStatusId = it.ModificationRequestStatusId ? it.ModificationRequestStatusId : "";
          let WiproApprovalType = it.WiproApprovalType ? it.WiproApprovalType : "";
          let WiproAging: any = "";
          let DaysDiff: any = 0;
          // let timeDiff: any = 0;
          let date1: any = it.WiproDecisionDate ? new Date(it.WiproDecisionDate) : "";
          let date2: any = it.CreatedOn ? new Date(it.CreatedOn) : "";
          let date3: any = new Date();
          if ((this.ModifyOrderApproval == WiproApprovalType && ModificationRequestStatusId != this.ModificationPendingwithBFM) || this.approvalLogApproveArray.some(it => it == WiproOrderApprovalStage) == true || this.approvalLogRejectArray.some(it => it == WiproOrderApprovalStage) == true || this.approvallogOnHoldByBFM == WiproOrderApprovalStage) {
            if (date1 && date2) {
              // timeDiff = date1 - date2;
              DaysDiff = this.dateDiffInDays(date1, date2);
            }
            WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          } else if ((this.ModifyOrderApproval == WiproApprovalType && ModificationRequestStatusId == this.ModificationPendingwithBFM) || this.approvalLogPendingArray.some(it => it == WiproOrderApprovalStage) == true) {
            if (date2) {
              // timeDiff = date3 - date2;
              DaysDiff = this.dateDiffInDays(date3, date2);
            }
            WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          } else {
            WiproAging = it.WiproAging ? it.WiproAging : '0';
          }
          let approvalLogObj = {
            SalesOrderId: it.SalesOrderId ? it.SalesOrderId : "",
            CreatedOn: it.CreatedOn ? it.CreatedOn : "",
            WiproOnHoldReason: it.WiproOnHoldReason ? it.WiproOnHoldReason : "",
            WiproDecisionDate: it.WiproDecisionDate ? it.WiproDecisionDate : "",
            WiproOwnershipDisplay: it.WiproOwnershipDisplay ? it.WiproOwnershipDisplay : "",
            WiproOrderApprovalStageDisplay: it.WiproOrderApprovalStageDisplay ? it.WiproOrderApprovalStageDisplay : "",
            WiproOrderApprovalStage: it.WiproOrderApprovalStage ? it.WiproOrderApprovalStage : "",
            CreatedBy: it.CreatedBy ? it.CreatedBy : "",
            WiproResubmissionReason: it.WiproResubmissionReason ? it.WiproResubmissionReason : "",
            WiproAging: WiproAging,
            OpportunityId: it.OpportunityId ? it.OpportunityId : "",
            OpportunityIdName: it.OpportunityIdName ? it.OpportunityIdName : "",
            WiproApprovalReason: it.WiproApprovalReason ? it.WiproApprovalReason : "",
            WiproApprovalType: it.WiproApprovalType ? it.WiproApprovalType : "",
            WiproApprovalTypeDisplay: it.WiproApprovalTypeDisplay ? it.WiproApprovalTypeDisplay : "",
            WiproRejectionReason: it.WiproRejectionReason ? it.WiproRejectionReason : "",
            WiproApproval: it.WiproApproval ? it.WiproApproval : "",
            OnHoldReasonDisplay: it.OnHoldReasonDisplay ? it.OnHoldReasonDisplay : "",
            OrderModificationRequestId: it.OrderModificationRequestId ? it.OrderModificationRequestId : "",
            CamundaProcessId: it.CamundaProcessId ? it.CamundaProcessId : "",
            ExpediteRequestCount: it.ExpediteRequestCount ? parseInt(it.ExpediteRequestCount) : 0,
            ModificationRequestStatusId: it.ModificationRequestStatusId ? it.ModificationRequestStatusId : "",
            ModificationRequestStatus: it.ModificationRequestStatus ? it.ModificationRequestStatus : "",
            showlogPending: ((WiproApprovalType == this.ModifyOrderApproval && this.ModificationPendingwithBFM == ModificationRequestStatusId) || (WiproApprovalType != this.ModifyOrderApproval && (this.approvalLogPendingArray.some(it => it == WiproOrderApprovalStage) == true))) ? true : false,
            showlogApproval: ((WiproApprovalType == this.ModifyOrderApproval && this.ModificationApprovedbyBFM == ModificationRequestStatusId) || (WiproApprovalType != this.ModifyOrderApproval && (this.approvalLogApproveArray.some(it => it == WiproOrderApprovalStage)) == true)) ? true : false,
            showlogOnHold: (WiproApprovalType != this.ModifyOrderApproval && (this.approvalLogOnHoldArray.some(it => it == WiproOrderApprovalStage)) == true) ? true : false,
            showlogReject: ((WiproApprovalType == this.ModifyOrderApproval && this.ModificationRejectedbyBFM == ModificationRequestStatusId) || (WiproApprovalType != this.ModifyOrderApproval && (this.approvalLogRejectArray.some(it => it == WiproOrderApprovalStage)) == true)) ? true : false
          }
          return Object.assign({}, approvalLogObj)
        }) : [];

        console.log("approvalLog", this.approvalLog);
      } else {
        this.projectService.displayMessageerror(res.Message);
      }
    }, err => {
      this.approvalLog = [];
      // this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    });
  }

  dateDiffInDays(a: any, b: any) {
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }

  // checking WT/Non-WT
  checkWT(salesOrderId, isOrderCreated) {
    const payload = {
      OrderOrOpportunityId: salesOrderId,
      IsOrderCheckNonBPO: isOrderCreated
    }
    this.orderService.getWTstatus(payload).subscribe((res: any) => {
      this.orderApprovalStatus.WT = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
      this.originalWTFlag = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
      console.log("checkwtorder", this.originalWTFlag);
      this.projectService.setSession('checkwtorder', this.originalWTFlag);


      if (isOrderCreated == false) {
        this.getoppOverviewdetails();
      } else {
        this.setOrderOverviewVal();
      }
      this.orderOverviewObj.NonWTFlag = !this.originalWTFlag;
    }, err => {
      if (isOrderCreated == false) {
        this.getoppOverviewdetails();
      } else {
        this.setOrderOverviewVal();
      }


    });
  }




  getAmendmentDetails() {
    this.service.loaderhome = true;
    this.orderService.getAmendmentDetails().subscribe((amendmentDetail: any) => {
      this.ParentOrderIdForAmendment = amendmentDetail.data.ParentOrderId;
      this.OrderId = amendmentDetail.data.ParentOrderId;
      this.amendmentRemarks = amendmentDetail.data.WiproAmendmentRemarks;
      this.amendmentCreationDetails = Object.assign({}, amendmentDetail.data);
      this.checkforAmendmentOrder(true);
    }, err => {
      console.log("adss");
    });
  }




  // open the POA holders pop-up
  NavigateToPOHeader() {
    const dialogRef = this.dialog.open(SearchpoaHoldersComponent, {
      width: '1820px',
      data: {
        signedDate : this.contractSignedDate ? this.getIsoDateFormat(this.contractSignedDate) : ''
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.orderOverviewObj.POAHolderId = (res && res.length > 0) ? res[0].id : null;
        this.defaultValue.POAName = (res && res.length > 0) ? res[0].POAName : '';
        this.orderOverviewValidationValue.POAHolderId = false;
      }
    }, err => console.log(err));
  }

  LOIUploadAvail = false;

  getOrderAttachments(orderId) {
    if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType != 184450006) {
      this.loiValue = '';
      this.loiReceivedDate = '';
      this.loiValidity = '';
      this.loiAttachedDocuments = [];
      this.UploadContract.ContractTitle = '';
      this.UploadContract.ContractNotes = '';
      this.UploadContract.UploadContractFiles = [];
    }
    else {
      // For LOI
      const payload = {
        Id: orderId,
        SearchText: FileUpload.letterOfIntent
      };
      this.orderService.getOrderAttachments(payload).subscribe((orderAttachment: any) => {
        console.log("getdocloi",orderAttachment)
        if (orderAttachment && orderAttachment.ResponseObject) {
          this.loiAttachedDocuments = orderAttachment.ResponseObject.filter(it => it.UniqueKey == FileUpload.letterOfIntent);
          this.loiAttachedDocuments = this.loiAttachedDocuments.map(it => { return Object.assign({ ...it, AttachmentId: (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006 ? null : it.AttachmentId) }) });
        }
      }, err => {
        console.log(err);
      });

      // For get Upload contract

      let uploadContractPayload = {
        Id: orderId,
        SearchText: FileUpload.uploadAttachments
      };
      this.orderService.getOrderAttachments(uploadContractPayload).subscribe((contractAttachment: any) => {
         console.log("getdoccont",contractAttachment)
        if (contractAttachment && contractAttachment.ResponseObject) {
          this.UploadContract.UploadContractFiles = contractAttachment.ResponseObject.filter(it => it.UniqueKey == FileUpload.uploadAttachments);
          this.UploadContract.UploadContractFiles = this.UploadContract.UploadContractFiles.map(it => { return Object.assign({ ...it, AttachmentId: (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006 ? null : it.AttachmentId) }) });
        } else {
          this.UploadContract.UploadContractFiles = [];
        }
      }, err => {
        this.UploadContract.UploadContractFiles = [];
        console.log(err);
      });
    }
  }

//new loi  saurav
downloFile(i) {
   console.log("sdsdf",this.loiAttachedDocuments[i].DownloadFileName);
   let arr = [
     {
       "Name" : this.loiAttachedDocuments[i].DownloadFileName
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


  //new upload contract  saurav

downloadFile(i) {
   console.log("sdsdf",this.UploadContract.UploadContractFiles.DownloadFileName);
   let arr = [
     {
       "Name" : this.UploadContract.UploadContractFiles[i].DownloadFileName
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



  // fileChangeEvent(e) {
  //      this.service.loaderhome = true;
  //   let filess = [].slice.call(e.target.filess);
  //   let uploadingFileList = [];
  //   // let fileNames = [];
  //   if (filess.length > 0) {
  //     filess.forEach(res => {
  //       let file: File = res;
  //       let canditionAction = this.fileValidation(file)
  //       switch (canditionAction) {
  //         case 'FileSize': {
  //           this.projectService.throwError("Not able to upload the file because filesize is greater than 5mb.");
  //              this.service.loaderhome = false;
  //           break;
  //         }
  //         case 'InvalidFormat': {
  //           this.projectService.throwError("File format not supported!")
  //             this.service.loaderhome = false;
  //           break;
  //         }
  //         case 'FileExist': {
  //           this.projectService.throwError("File is already exist!")
  //            this.service.loaderhome = false;
  //           break;
  //         }
  //         case 'Upload': {
  //           const fd: FormData = new FormData();
  //           fd.append('file', file);
  //           this.fileNames.push(file.name)
  //           uploadingFileList.push(fd)
  //           this.service.filesList.push(file);
  //           this.filetoadd.push(fd);
  //           this.filess.push(file);
  //           this.service.filename= file.name;
  //           this.orderService.fileListToInsert.push(fd); 
  //           this.service.loaderhome = false;   
  //           break;
  //         }
  //       }
  //     })
  //     // this.fileUplaod(uploadingFileList, fileNames)
  //   }
  // }


  //  fileValidation(file) {
  //   if (file.size > 15728640) {
  //     return 'FileSize'
  //   }
  //   if (!this.accept.includes(file.type)) {
  //     return 'InvalidFormat'
  //   }
  //   if (this.service.filesList.length == 0) {
  //     if (this.accept.includes(file.type)) {
  //       return 'Upload'
  //     }
  //     if (!this.accept.includes(file.type)) {
  //       return 'InvalidFormat'
  //     }
  //   }
  //   if (this.service.filesList.length > 0) {
  //     let index = this.service.filesList.findIndex(k => k.Name == file.name);
  //     if (index === -1) {
  //       if (this.accept.includes(file.type)) {
  //         return 'Upload'
  //       }
  //     } else {
  //       return 'FileExist'
  //     }
  //   }
  // }

  // checking order created or not
  checkOrderBookingId() {
    this.service.loaderhome = true;
    this.ErrorDisplay = false;
    this.approvalStageID = "";
    this.ModificationStatus = "";
    this.ApprovedDate = "";
    this.OrderCamundaProcessId = "";
    const payload = {
      Id: this.getOpportunityId()
    };
    this.orderService.checkOrderBookingId(payload).subscribe((bookingId: any) => {
      if (!bookingId.IsError) {
        if (bookingId.ResponseObject.length) {
          this.OrderId = bookingId.ResponseObject[0].SalesOrderId ? bookingId.ResponseObject[0].SalesOrderId : '';
          this.projectService.setSession('orderId', this.OrderId);
          this.getSalesOrderOverviewDetails(bookingId.ResponseObject[0].SalesOrderId);
        } else {
          this.OrderId = "";
          this.checkWT(this.OpportunityId, false);
        }
      }
    }, err => {
      this.checkWT(this.OpportunityId, false);
    })
  }

  private loiValue = '';
  private loiReceivedDate = '';
  private loiValidity = '';
  private loiAttachedDocuments = [];

  //upload contract
  private contractNotes = '';
  private contractTitle = '';
  private contractAttachedDocuments = [];
  //end

  getSalesOrderOverviewDetails(OrderId) {
    const bookingIdPayload = {
      Guid: OrderId,
      FilterSearchText: this.orderService.newAmendmentDetails.WiproAmendmentType
    }
    if (this.ParentOrderIdForAmendment) {
      this.approvalLog = [];
    } else {
      this.getOrderApprovalLog(OrderId);
    }

    this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      console.log("order created", orderDetails);
      this.approvalStageID = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
      this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
      this.ApprovedDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
      this.OrderCamundaProcessId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.CamundaProcessId) ? orderDetails.ResponseObject.CamundaProcessId : '';
      this.IsIndiaSBU = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsIndiaSBU) ? orderDetails.ResponseObject.IsIndiaSBU : false;
      this.PricingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingId && !this.ParentOrderIdForAmendment) ? orderDetails.ResponseObject.PricingId : "";
      this.IsAppirioPureDeal = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsAppirioPureDeal) ? orderDetails.ResponseObject.IsAppirioPureDeal : false;
      this.DPSDealCreatedOn = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.DPSDealCreatedOn && !this.ParentOrderIdForAmendment) ? orderDetails.ResponseObject.DPSDealCreatedOn : null;
      this.POAOrder = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
      this.ICMParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';
      this.IsDirectAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsDirectAmendment) ? orderDetails.ResponseObject.IsDirectAmendment : '';

      // Letter of Intent
      debugger;
      // if (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.LetterofIntentUploaded) {
      this.loiValue = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Wipro_RevenueAccrueableValue ? orderDetails.ResponseObject.Wipro_RevenueAccrueableValue : '';
      this.loiReceivedDate = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.LetterofIntentReceivedDate ? orderDetails.ResponseObject.LetterofIntentReceivedDate : '';
      this.loiValidity = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.LetterofIntentValidity ? orderDetails.ResponseObject.LetterofIntentValidity : '';
      // }
      // Ends : Letter of intent

      if (this.approvalStageID == OrderApprovalStage.ApprovedbyBFM) {
        this.projectService.modifyordervalue = true;

      } else {
        this.projectService.modifyordervalue = false;

      }


      this.checkWT(this.OrderId, true);
      this.OrderCreatedDetails = orderDetails.ResponseObject;
      this.orderOverviewObj.OrderBookingId = orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId;
      this.orderCreated = true;
      this.opportunityData = orderDetails.ResponseObject;
      this.getOrderAttachments(this.orderOverviewObj.OrderBookingId);
      this.getOrderPOdetails();

    }, err => {
      this.opportunityData = null;
      this.approvalStageID = "";
      this.ModificationStatus = "";
      this.ApprovedDate = "";
      this.OrderCamundaProcessId = "";
      this.checkWT(this.OrderId, true);
    });
  }



  orderStatus() {
    this.projectService.orderstatus = true;
    this.projectService.editProject = true;
  }


  // @return opportunity id
  getOpportunityId(): string {
    let opportunityId = this.projectService.getSession('opportunityId');
    return opportunityId;
  }


  currencyCode(data) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.currencyCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.currencyCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }


  selectedValueCurrency(selectedData) {

    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.currency = selectedData.Name;
      this.orderOverviewObj.CurrencyId = selectedData.Id;
      this.CurrencyId = selectedData.Id;
      this.CurrencySymbol = selectedData.Type;
      this.selectedCurrencyObj = Object.assign({}, selectedData);
      this.orderOverviewValidationValue.CurrencyId = false;
    } else {
      this.defaultValue.currency = '';
      this.orderOverviewObj.CurrencyId = '';
      this.CurrencyId = '';
      this.CurrencySymbol = 'NA';
      this.selectedCurrencyObj = Object.assign({ Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" });
    }
    this.OdatanextLink = null;
    this.getTCVdifference(this.orderOverviewObj.SOWTCV)

  }


  getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.OdatanextLink = null;
    if (emittedevt) {

      this.defaultValue.currency = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.CurrencyId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.CurrencyId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.CurrencySymbol = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Type : "NA";
      this.selectedCurrencyObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
      this.orderOverviewValidationValue.CurrencyId = false;
      this.getTCVdifference(this.orderOverviewObj.SOWTCV)

    } else {
      if (this.selectedCurrencyObj.Name != this.defaultValue.currency || this.selectedCurrencyObj.Id != this.orderOverviewObj.CurrencyId) {
        this.defaultValue.currency = "";
        this.orderOverviewObj.CurrencyId = "";
        this.CurrencyId = "";
        this.CurrencySymbol = "NA";
        this.selectedCurrencyObj = { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
        this.getTCVdifference(this.orderOverviewObj.SOWTCV)
      }
    }

  }

  getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  selectedConrtactCurrency(selectedData) {

    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.Wipro_ContractCurrency = selectedData.Name;
      this.orderOverviewObj.Wipro_ContractCurrency = selectedData.Id;
      this.selectedContractCurrencyObj = Object.assign({}, selectedData);

    } else {
      this.defaultValue.Wipro_ContractCurrency = '';
      this.orderOverviewObj.Wipro_ContractCurrency = '';
      this.selectedContractCurrencyObj = Object.assign({ Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" });

    }
    this.OdatanextLink = null;
    this.orderOverviewValidationValue.Wipro_ContractCurrency = false;
    this.getTCVdifference(this.orderOverviewObj.SOWTCV)
  }


  getConrtactCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfConrtactCurrencyPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.OdatanextLink = null;
    if (emittedevt) {

      this.defaultValue.Wipro_ContractCurrency = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.Wipro_ContractCurrency = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedContractCurrencyObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
      this.orderOverviewValidationValue.Wipro_ContractCurrency = false;
      this.getTCVdifference(this.orderOverviewObj.SOWTCV);
    } else {
      if (this.selectedContractCurrencyObj.Name != this.defaultValue.Wipro_ContractCurrency || this.selectedContractCurrencyObj.Id != this.orderOverviewObj.Wipro_ContractCurrency) {
        this.defaultValue.Wipro_ContractCurrency = "";
        this.orderOverviewObj.Wipro_ContractCurrency = "";
        this.selectedContractCurrencyObj = { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
        this.getTCVdifference(this.orderOverviewObj.SOWTCV);
      }
    }

  }

  getConrtactCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }


  // @return account id
  getAccountId(): string {
    let accountId = this.projectService.getSession('accountid');
    return accountId;
  }

  // @return vertical id
  getVerticalId(): string {
    let verticalId = this.projectService.getSession('verticalId');
    return verticalId;
  }


  SAPdataHeader = { name: 'Name', Id: 'Id' };
  selectedSAPCodeObj: any = { Id: "", Name: "", WiproSapCustomerNumber: '', WiproSapCompanyCode: '' };

  VSOdataHeader = { name: 'Name', Id: 'Id' };
  selectedVSOObj: any = { Id: "", Name: "", EmailID: '' };

  AdvisordataHeader = { name: 'Name', Id: 'Id' };
  selectedAdvisorObj: any = { Id: "", Name: "", accountOwner: '' };

  CurrencydataHeader = { name: 'Name', Id: 'Id' };
  selectedCurrencyObj: any = { Id: "", Name: "", Type: '', SysNumber: "", IsoCurrencyCode: "" };

  selectedContractCurrencyObj: any = { Id: "", Name: "", Type: '', SysNumber: "", IsoCurrencyCode: "" };


  ContractingCounrtrydataHeader = { name: 'Name', Id: 'Id' };
  selectedCountryObj: any = { Id: "", Name: "", RegionName: '', GeoName: "" };

  sapCustomerCode(data) {
    console.log("sapCustomerCode", data);
    this.isSearchLoader = true;
    this.addIPservice.getSapCodeDataOrder(this.AccountId, data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.sapCustomerCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.sapCustomerCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });

  }

  selectedSapCode(selectedData) {

    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.sapCode = selectedData.Name;
      this.orderOverviewObj.SAPCustomerCode = selectedData.Id;
      this.selectedSAPCodeObj = Object.assign({}, selectedData);
      this.orderOverviewValidationValue.SAPCustomerCode = false;
    } else {
      this.defaultValue.sapCode = '';
      this.orderOverviewObj.SAPCustomerCode = '';
      this.selectedSAPCodeObj = { Id: "", Name: "", WiproSapCustomerNumber: '', WiproSapCompanyCode: '' };
    }

    this.OdatanextLink = null;
  }
  opendelaypop(): void {
    const dialogRef = this.dialog.open(delaypopcomponent, {
      width: '400px',
    });
  }

  openDelayMessage: boolean = false;
  showDelayErrorFlag: boolean = false;
  cancelDelayReason: any;
  savedis: boolean = false;

  openDelayReason() {
    this.openDelayMessage = !this.openDelayMessage;
    this.cancelDelayReason = this.opportunityData.DelayReason ? this.opportunityData.DelayReason : this.delayReasonData;
    this.savedis = true;
  }

  saveDelayReason() {
    if (this.delayReasonData.trim() == '' || this.delayReasonData.trim() == null) {
      this.openDelayMessage = true;
      this.showDelayErrorFlag = true;
    }
    else {
      this.openDelayMessage = false;
      this.showDelayErrorFlag = false;
      this.orderOverviewObj.DelayReason = this.delayReasonData;
      this.cancelDelayReason = this.delayReasonData;
    }
  }


  closeDelayReason() {
    this.openDelayMessage = false;
    this.delayReasonData = this.cancelDelayReason;
  }

  changeDelayReasonData() {
    this.showDelayErrorFlag = false;
    this.savedis = false;

  }

  getSapCodeDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getSapCodeDataOrder(this.AccountId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfSapCodePopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.OdatanextLink = null;
    if (emittedevt) {

      this.defaultValue.sapCode = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.SAPCustomerCode = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedSAPCodeObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", WiproSapCustomerNumber: '', WiproSapCompanyCode: '' };
      this.orderOverviewValidationValue.SAPCustomerCode = false;
    } else {
      if (this.selectedSAPCodeObj.Name != this.defaultValue.sapCode || this.selectedSAPCodeObj.Id != this.orderOverviewObj.SAPCustomerCode) {
        this.defaultValue.sapCode = "";
        this.orderOverviewObj.SAPCustomerCode = "";
        this.selectedSAPCodeObj = { Id: "", Name: "", WiproSapCustomerNumber: '', WiproSapCompanyCode: '' };

      }
    }

  }

  getSapCodeOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getSapCodeDataOrder(this.AccountId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }


  getCountry(data) {
    this.isSearchLoader = true;
    this.addIPservice.getCountryDetailsOrder(data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.CountryArray = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.currencyCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  getStates(CountryId) {
    if (CountryId) {
      let payload = {
        Id: CountryId
      }
      this.orderService.getStates(payload).subscribe((res: any) => {
        this.subDivisions = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (this.subDivisions.length == 0) {
          this.orderOverviewValidationValue.CountrySubDivisionState = false;
          this.orderOverviewValidationValue.CityRegion = false;
        } else {
          this.orderOverviewValidationValue.CityRegion = false;
        }
      }, err => {
        this.subDivisions = [];
        this.orderOverviewValidationValue.CountrySubDivisionState = false;
        this.orderOverviewValidationValue.CityRegion = false;
      });
    } else {
      this.subDivisions = [];
      this.orderOverviewValidationValue.CountrySubDivisionState = false;
      this.orderOverviewValidationValue.CityRegion = false;
    }
  }

  selectedContractingCountry(selectedData) {
    this.orderOverviewValidationValue.CountrySubDivisionState = false;
    this.orderOverviewValidationValue.CityRegion = false;
    this.orderOverviewObj.CountrySubDivisionState = "";
    this.orderOverviewObj.CityRegion = "";
    this.subDivisions = [];
    this.cityRegions = [];
    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.country = selectedData.Name;
      this.orderOverviewObj.ContractingCountryId = selectedData.Id;
      this.selectedCountryObj = Object.assign({}, selectedData);
      this.orderOverviewValidationValue.ContractingCountryId = false;
      this.getStates(this.orderOverviewObj.ContractingCountryId);
    } else {
      this.defaultValue.country = '';
      this.orderOverviewObj.ContractingCountryId = '';
      this.selectedCountryObj = Object.assign({ Id: "", Name: "", GeoName: "", RegionName: "" });
    }
    this.OdatanextLink = null;

  }


  getCountryDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCountryDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfCountryPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {


    this.OdatanextLink = null;
    if (emittedevt) {
      this.orderOverviewValidationValue.CountrySubDivisionState = false;
      this.orderOverviewValidationValue.CityRegion = false;
      this.defaultValue.country = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.ContractingCountryId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedCountryObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", GeoName: "", RegionName: "" };
      this.orderOverviewValidationValue.ContractingCountryId = false;
      this.orderOverviewObj.CountrySubDivisionState = "";
      this.orderOverviewObj.CityRegion = "";
      this.subDivisions = [];
      this.cityRegions = [];
      this.getStates(this.orderOverviewObj.ContractingCountryId);
    } else {
      if (this.selectedCountryObj.Name != this.defaultValue.country || this.selectedCountryObj.Id != this.orderOverviewObj.ContractingCountryId) {
        this.orderOverviewValidationValue.CountrySubDivisionState = false;
        this.orderOverviewValidationValue.CityRegion = false;
        this.defaultValue.country = "";
        this.orderOverviewObj.ContractingCountryId = "";
        this.selectedCountryObj = { Id: "", Name: "", GeoName: "", RegionName: "" };
        this.orderOverviewObj.CountrySubDivisionState = "";
        this.orderOverviewObj.CityRegion = "";
        this.subDivisions = [];
        this.cityRegions = [];

      }
    }

  }

  getCountryOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCountryDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  onSubDivisionChange(StateId, defaultLoad?) {
    this.orderOverviewValidationValue.CountrySubDivisionState = false;
    this.orderOverviewValidationValue.CityRegion = false;
    if (!defaultLoad) {
      this.orderOverviewObj.CityRegion = "";
    }
    if (StateId) {
      let payload = {
        Id: StateId ? StateId : null
      };
      this.orderService.getCity(payload).subscribe((res: any) => {
        this.cityRegions = (res && res.ResponseObject) ? res.ResponseObject : [];
      }, err => {
        this.cityRegions = [];
      })
    } else {
      this.cityRegions = [];
    }
  }

  onSelectCityRegion(selectedcityRegion?) {
    this.orderOverviewValidationValue.CityRegion = false;
  }

  verticalCode(data) {
    this.isSearchLoader = true;
    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.verticalCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.verticalCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  selectedVSO(selectedData) {
    let oldSelectedOBJ = Object.assign({}, this.selectedVSOObj);
    this.OdatanextLink = null;
    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.verticalOwner = selectedData.Name;
      this.orderOverviewObj.VerticalSalesOwnerId = selectedData.Id;
      this.selectedVSOObj = Object.assign({}, selectedData);
      this.orderOverviewValidationValue.VerticalSalesOwnerId = false;
    } else {
      console.log("selectedDataSAP", selectedData);
      this.defaultValue.verticalOwner = "";
      this.orderOverviewObj.VerticalSalesOwnerId = "";
      this.selectedVSOObj = Object.assign({ Id: "", Name: "", EmailID: "" });
    }

    this.changeVSOInOBAllocation(oldSelectedOBJ);
  }

  changeVSOInOBAllocation(oldSelectedOBJ) {
    for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
      if (this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid && this.BSSLDetails[sli].BSServiceLine.WiproSlbdmidValueName) {
        if (this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid == oldSelectedOBJ.Id && this.BSSLDetails[sli].BSServiceLine.WiproSlbdmidValueName == oldSelectedOBJ.Name) {
          this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid = this.selectedVSOObj.Id;
          this.BSSLDetails[sli].BSServiceLine.WiproSlbdmidValueName = this.selectedVSOObj.Name;
          this.BSSLDetails[sli].selectedSLBDM = (this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid && this.BSSLDetails[sli].BSServiceLine.WiproSlbdmidValueName) ? (new Array(Object.assign({
            SysGuid: this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid,
            Name: this.BSSLDetails[sli].BSServiceLine.WiproSlbdmidValueName,
            EmailID: this.selectedVSOObj.EmailID,
            Id: this.BSSLDetails[sli].BSServiceLine.WiproSlbdmid
          }))) : [];
        }
      }
    }

    for (let ip = 0; ip < this.IpDetails.length; ip++) {
      if (this.IpDetails[ip].IP.WiproSlbdmValue && this.IpDetails[ip].IP.WiproSlbdmName) {
        if (this.IpDetails[ip].IP.WiproSlbdmValue == oldSelectedOBJ.Id && this.IpDetails[ip].IP.WiproSlbdmName == oldSelectedOBJ.Name) {
          this.IpDetails[ip].IP.WiproSlbdmValue = this.selectedVSOObj.Id;
          this.IpDetails[ip].IP.WiproSlbdmName = this.selectedVSOObj.Name;
          this.IpDetails[ip].selectedIPSLBDM = (this.IpDetails[ip].IP.WiproSlbdmValue && this.IpDetails[ip].IP.WiproSlbdmName) ? (new Array(Object.assign({
            SysGuid: this.IpDetails[ip].IP.WiproSlbdmValue,
            Name: this.IpDetails[ip].IP.WiproSlbdmName,
            EmailID: this.selectedVSOObj.EmailID,
            Id: this.IpDetails[ip].IP.WiproSlbdmValue
          }))) : [];
        }
      }
    }

    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001' && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == true) {
        this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId = this.selectedVSOObj.Id;
        this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName = this.selectedVSOObj.Name;
        this.creditAllocationdataDetails[ca].selectedCABDM = (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId && this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName) ? [{
          SysGuid: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId,
          Name: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName,
          EmailID: this.selectedVSOObj.EmailID,
          Id: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId
        }] : [];
      } else {
        if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId && this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId == oldSelectedOBJ.Id && this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName == oldSelectedOBJ.Name) {
            this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId = this.selectedVSOObj.Id;
            this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName = this.selectedVSOObj.Name;
            this.creditAllocationdataDetails[ca].selectedCABDM = (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId && this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName) ? (new Array(Object.assign({
              SysGuid: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId,
              Name: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName,
              EmailID: this.selectedVSOObj.EmailID,
              Id: this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId
            }))) : [];
          }
        }
      }
    }
  }

  getVSODataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfVSOPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.OdatanextLink = null;
    let oldSelectedOBJ = Object.assign({}, this.selectedVSOObj);
    if (emittedevt) {

      this.defaultValue.verticalOwner = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.VerticalSalesOwnerId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedVSOObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", EmailID: "" };
      this.orderOverviewValidationValue.VerticalSalesOwnerId = false;
      this.changeVSOInOBAllocation(oldSelectedOBJ);
    } else {
      if (this.selectedVSOObj.Name != this.defaultValue.verticalOwner || this.selectedVSOObj.Id != this.orderOverviewObj.VerticalSalesOwnerId) {
        this.defaultValue.verticalOwner = "";
        this.orderOverviewObj.VerticalSalesOwnerId = "";
        this.selectedVSOObj = { Id: "", Name: "", EmailID: "" };
        this.changeVSOInOBAllocation(oldSelectedOBJ);

      }
    }

  }

  getVSOOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getVerticalOwnerDetailsOrder(this.sbuId, this.geoId, this.RegionId, this.AccountId, this.VerticalId, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  advisorCode(data) {
    this.isSearchLoader = true;
    this.addIPservice.getAllianceFinderDataOrder(data.searchValue, this.SearchType, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.advisorCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.advisorCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  selectedValueAdvisor(selectedData) {
    if (Object.keys(selectedData).length > 0) {
      this.defaultValue.advisorName = selectedData.Name;
      this.orderOverviewObj.AdvisorId = selectedData.Id;
      this.selectedAdvisorObj = Object.assign({}, selectedData);
      this.orderOverviewValidationValue.AdvisorId = false;

    } else {
      this.defaultValue.advisorName = '';
      this.orderOverviewObj.AdvisorId = '';
      this.selectedAdvisorObj = Object.assign({ Id: "", Name: "", accountOwner: "" });

    }
    this.OdatanextLink = null;


  }


  getAdvisorDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getAllianceFinderDataOrder(emittedevt.objectRowData.searchKey, this.SearchType, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  OnCloseOfAdvisorPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {

    this.OdatanextLink = null;
    if (emittedevt) {

      this.defaultValue.advisorName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.orderOverviewObj.AdvisorId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedAdvisorObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", accountOwner: "" };
      this.orderOverviewValidationValue.AdvisorId = false;
    } else {
      if (this.selectedAdvisorObj.Name != this.defaultValue.advisorName || this.selectedAdvisorObj.Id != this.orderOverviewObj.AdvisorId) {
        this.defaultValue.advisorName = "";
        this.orderOverviewObj.AdvisorId = "";
        this.selectedAdvisorObj = { Id: "", Name: "", accountOwner: "" };

      }
    }

  }

  getAdvisorOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getAllianceFinderDataOrder(emittedevt.objectRowData.searchKey, this.SearchType, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  viewContracts() {
    let opportunityId = this.projectService.getSession('opportunityId');
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


    this.viewContractNavigate = contractIcer + "/WebResources/icm_ContractListings.html?Data=entity%3Dsalesorder%26accountid%3D" + this.orderOverviewObj.OrderBookingId + "%26OrderId%3D" +
      this.orderOverviewObj.OrderBookingId + "%26record_Name%3D" + this.defaultValue.orderNumber + "%26OppId%3D" + (opportunityId ? opportunityId : this.ICMParentOpportunityId) + "%26userid%3D" +
      this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') + "%26app%3Dsalesportal%26navurl%3Dorder"
    console.log('test123', this.viewContractNavigate);
  }


  checkforAmendmentOrder(amendmentInprocess?) {
    this.orderService.amendmentInProcess = false;
    if (this.orderService.parentOrderId && !amendmentInprocess) {
      this.ParentOrderIdForAmendment = this.orderService.newAmendmentDetails.ParentOrderId;
      this.OrderId = this.orderService.newAmendmentDetails.ParentOrderId;
      this.amendmentRemarks = this.orderService.newAmendmentDetails.WiproAmendmentRemarks;
      this.amendmentCreationDetails = Object.assign({}, this.orderService.newAmendmentDetails);
      if (this.IsAmendment == true) {
        this.getSalesOrderOverviewDetails(this.OrderId);
      } else {
        this.getOpportunityContractDetails();
      }

    }
    else if (this.IsAmendment == true) {
      this.getSalesOrderOverviewDetails(this.OrderId);
    } else {
      this.getOpportunityContractDetails();
    }

  }

  // get contract details
  getOpportunityContractDetails() {
    this.service.loaderhome = true;
    const payload = {
      Guid: this.getOpportunityId()
    };
    this.orderService.getOpportunityContractDetails(payload)
      .subscribe((res: any) => {
        if (!res.IsError) {
          let response = res.ResponseObject;
          this.pricingDPSId = (res && res.ResponseObject && res.ResponseObject.Wipro_PricingId) ? res.ResponseObject.Wipro_PricingId : '';
          this.checkOrderBookingId();
          console.log('contract details: ', res);
        } else {
          this.pricingDPSId = '';
          this.checkOrderBookingId();
        }
      }, err => {
        this.pricingDPSId = '';
        this.checkOrderBookingId();
      });
  }

  // get order overview details
  getoppOverviewdetails() {
    const payload = {
      OppId: this.getOpportunityId(),
      IsDataForOrder: true
    };
    this.orderService.getoppOverviewdetails(payload)
      .subscribe((res: any) => {
        this.oppowner = res.ResponseObject.OppOwner.SysGuid;
        this.IsIndiaSBU = (res && res.ResponseObject && res.ResponseObject.IsIndiaSBU) ? res.ResponseObject.IsIndiaSBU : false;
        this.PricingId = (res && res.ResponseObject && res.ResponseObject.PricingId) ? res.ResponseObject.PricingId : "";
        this.DPSDealCreatedOn = (res && res.ResponseObject && res.ResponseObject.DPSDealCreatedOn && !this.ParentOrderIdForAmendment) ? res.ResponseObject.DPSDealCreatedOn : null;
        this.opportunityData = res.ResponseObject;
        this.setOrderOverviewVal();
        console.log("select date", res.ResponseObject, this.orderOverviewObj, this.orderOverviewObj.StartDate);
      },
        (err: Error) => {
          this.opportunityData = null;
          this.setOrderOverviewVal();
          console.log(err);
        });
  }

  date = new FormControl(new Date());


  ApprovalType: any = ""
  setOrderOverviewVal() {
    let tempDPSDealCreatedOn = this.DPSDealCreatedOn ? new Date(this.DPSDealCreatedOn) : "";
    this.WTFlag = (this.originalWTFlag == true && this.PricingId && (!tempDPSDealCreatedOn || (tempDPSDealCreatedOn >= this.DealCreationCutoffDate))) ? true : false;
    this.orderOverviewObj.OpportunityId = this.OpportunityId;
    this.getOppData();
    if (this.opportunityData) {
      this.Wipro_SalesOrderId = this.opportunityData.Wipro_SalesOrderId ? this.opportunityData.Wipro_SalesOrderId : null;
      this.PricingUpdateOn = this.opportunityData.PricingUpdateOn ? this.opportunityData.PricingUpdateOn : "";
      this.IsPricingIdSynced = this.opportunityData.IsPricingIdSynced ? this.opportunityData.IsPricingIdSynced : false;
      this.DPSSyncAlertMessage = this.opportunityData.DPSSyncAlertMessage ? this.opportunityData.DPSSyncAlertMessage : "";

      let orderType = this.opportunityData.OpportunityTypeId ? parseInt(this.opportunityData.OpportunityTypeId) : this.opportunityData.OrderTypeId ? parseInt(this.opportunityData.OrderTypeId) : '';
      //opp amendement changes for pricing type
      if (this.opportunityData.OpportunityTypeId == '184450001' || this.opportunityData.OpportunityTypeId == '184450000') {
        this.oppamendd = true;
        console.log("oppamendd", this.oppamendd);
        this.projectService.setSession("oppamendd", this.oppamendd);
      }

      this.orderOverviewObj.OrderTypeId = this.amendmentCreationDetails && Object.keys(this.amendmentCreationDetails).length > 0 ? parseInt(this.amendmentCreationDetails.WiproAmendmentType) : orderType;
      this.defaultValue.orderType = this.amendmentCreationDetails && Object.keys(this.amendmentCreationDetails).length > 0 ? this.amendmentCreationDetails.WiproAmendmentType : orderType;
      this.acceptNegative = (this.orderOverviewObj.OrderTypeId == 184450002 || this.orderOverviewObj.OrderTypeId == 184450004 || this.orderOverviewObj.OrderTypeId == 184450006) ? true : false;
      if (this.ParentOrderIdForAmendment) {
        this.ApprovalType = "";
        this.WiproIsAmendmentLessthan250k = this.amendmentCreationDetails.WiproIsAmendmentLessthan250k ? this.amendmentCreationDetails.WiproIsAmendmentLessthan250k : false;
        this.MinOrderTCV = this.opportunityData.OrderTCV ? (this.opportunityData.OrderTCV > 0 ? (parseFloat("-" + this.opportunityData.OrderTCV)).toFixed(2) : (parseFloat(this.opportunityData.OrderTCV)).toFixed(2)) : '0.00'
        this.minStartDate = (this.opportunityData.StartDate) ? new Date(this.opportunityData.StartDate) : new Date(1945, 0, 1);
        this.minEndDate = this.minStartDate;
        //for Start and end date amentment creation
        if (this.amendmentCreationDetails.WiproAmendmentType == 184450001 || this.amendmentCreationDetails.WiproAmendmentType == 184450000 || this.amendmentCreationDetails.WiproAmendmentType == 184450004) {
          this.orderOverviewObj.StartDate = null;
          this.projectStartDate = '';
          this.orderOverviewObj.EndDate = null;
          this.projectEndDate = '';
        } else if (this.amendmentCreationDetails.WiproAmendmentType == 184450002 || this.amendmentCreationDetails.WiproAmendmentType == 184450006) {
          this.orderOverviewObj.StartDate = this.orderCreated == false ? this.opportunityData.wipro_engagementstartdate ? this.opportunityData.wipro_engagementstartdate : null : this.opportunityData.StartDate;
          this.projectStartDate = this.orderCreated == false ? this.opportunityData.wipro_engagementstartdate ? this.opportunityData.wipro_engagementstartdate : '' : this.opportunityData.StartDate;
          this.orderOverviewObj.EndDate = this.orderCreated == false ? this.opportunityData.wipro_engagementenddate ? this.opportunityData.wipro_engagementenddate : null : this.opportunityData.EndDate;
          this.projectEndDate = this.orderCreated == false ? this.opportunityData.wipro_engagementenddate ? this.opportunityData.wipro_engagementenddate : '' : this.opportunityData.EndDate;
        }

        if (this.amendmentCreationDetails.WiproAmendmentType == 184450001 || this.amendmentCreationDetails.WiproAmendmentType == 184450000 || this.amendmentCreationDetails.WiproAmendmentType == 184450004 || this.amendmentCreationDetails.WiproAmendmentType == 184450002) {
          //authorization and contract signed
          this.orderOverviewObj.Authorization = (Object.keys(this.opportunityData).some(it => it == 'Authorization')) ? this.opportunityData.Authorization : true;
          if (this.orderOverviewObj.Authorization == true) {
            this.orderOverviewObj.SOWSigned = true;
            this.ContrcatSigned = this.orderOverviewObj.SOWSigned;
            this.savedAuthorization = true;
            this.savedContractSigned = this.ContrcatSigned;
          } else {
            this.orderOverviewObj.PurchaseOrderSigned = true;
            this.ContrcatSigned = this.orderOverviewObj.PurchaseOrderSigned;
            this.savedAuthorization = false;
            this.savedContractSigned = this.ContrcatSigned;

          }
          //authorization and contract signed End
          // set contract signed date
          this.orderOverviewObj.SOWSignedDate = null;
          this.orderOverviewObj.PurchaseOrderSignedDate = null;
          let signedDate: any = "";
          this.ExpectedSignedDateChangeCount = 0;
          this.FirstEnteredExpectedSignedDate = '';
          this.contractSignedDate = (signedDate) ? signedDate : '';
          this.savedSignedDate = this.contractSignedDate;
          // set contract signed date End
          //set selectedContractCurrency Object
          this.defaultValue.Wipro_ContractCurrency = '';
          this.orderOverviewObj.Wipro_ContractCurrency = '';
          this.orderOverviewObj.OldWipro_ContractCurrency = null;
          this.selectedContractCurrencyObj.Name = this.defaultValue.Wipro_ContractCurrency;
          this.selectedContractCurrencyObj.Id = this.orderOverviewObj.Wipro_ContractCurrency;
          //set selectedContractCurrency Object End

          this.orderOverviewObj.SOWTCV = '';
          this.showDelayReasonTab = false;
          this.delayReasonData = '';
          this.orderOverviewObj.DelayReason = '';
          this.opportunityData.DelayReason = '';


        } else if (this.amendmentCreationDetails.WiproAmendmentType == 184450006) {
          //authorization and contrcat signed
          this.orderOverviewObj.Authorization = (Object.keys(this.opportunityData).some(it => it == 'Authorization')) ? this.opportunityData.Authorization : true;
          if (this.orderOverviewObj.Authorization == true) {
            this.orderOverviewObj.SOWSigned = this.opportunityData.SOWSigned ? this.opportunityData.SOWSigned : false;
            this.ContrcatSigned = this.orderOverviewObj.SOWSigned;
            this.savedAuthorization = true;
            this.savedContractSigned = this.ContrcatSigned;
          } else {
            this.orderOverviewObj.PurchaseOrderSigned = this.opportunityData.PurchaseOrderSigned ? this.opportunityData.PurchaseOrderSigned : false;
            this.ContrcatSigned = this.orderOverviewObj.PurchaseOrderSigned;
            this.savedAuthorization = false;
            this.savedContractSigned = this.ContrcatSigned;
          }
          //authorization and contrcat signed End 
          // set contract signed date
          this.orderOverviewObj.SOWSignedDate = this.opportunityData.SOWSignedDate ? this.opportunityData.SOWSignedDate : null;
          this.orderOverviewObj.PurchaseOrderSignedDate = this.opportunityData.PurchaseOrderSignedDate ? this.opportunityData.PurchaseOrderSignedDate : null;
          let signedDate: any = this.orderOverviewObj.SOWSignedDate ? this.orderOverviewObj.SOWSignedDate : this.orderOverviewObj.PurchaseOrderSignedDate;
          this.ExpectedSignedDateChangeCount = 0;
          this.FirstEnteredExpectedSignedDate = '';
          this.contractSignedDate = (signedDate) ? signedDate : '';
          this.savedSignedDate = this.contractSignedDate;
          // set contract signed date End
          //set selectedContractCurrency Object
          this.defaultValue.Wipro_ContractCurrency = (this.opportunityData.Wipro_ContractCurrency && this.opportunityData.Wipro_ContractCurrency.Name) ? (this.getSymbol(this.opportunityData.Wipro_ContractCurrency.Name)) : '';
          this.orderOverviewObj.Wipro_ContractCurrency = (this.opportunityData.Wipro_ContractCurrency && this.opportunityData.Wipro_ContractCurrency.SysGuid) ? this.opportunityData.Wipro_ContractCurrency.SysGuid : '';
          this.orderOverviewObj.OldWipro_ContractCurrency = this.orderOverviewObj.Wipro_ContractCurrency ? this.orderOverviewObj.Wipro_ContractCurrency : null;
          this.selectedContractCurrencyObj.Name = this.defaultValue.Wipro_ContractCurrency;
          this.selectedContractCurrencyObj.Id = this.orderOverviewObj.Wipro_ContractCurrency;
          //set selectedContractCurrency Object End

          this.orderOverviewObj.SOWTCV = (Object.keys(this.opportunityData).some(it => it == 'SOWTCV') && this.opportunityData.SOWTCV) ? (this.opportunityData.SOWTCV > 0 ? (parseFloat("-" + this.opportunityData.SOWTCV)).toFixed(2) : (parseFloat(this.opportunityData.SOWTCV)).toFixed(2)) : '';

        }



      }
      else {

        this.ApprovalType = this.opportunityData.ApprovalTypeId ? this.opportunityData.ApprovalTypeId : ""

        this.WiproIsAmendmentLessthan250k = this.opportunityData.WiproIsAmendmentLessthan250k ? this.opportunityData.WiproIsAmendmentLessthan250k : false;
        this.MinOrderTCV = this.opportunityData.ParentOrderTCV ? (this.opportunityData.ParentOrderTCV > 0 ? (parseFloat("-" + this.opportunityData.ParentOrderTCV)).toFixed(2) : (parseFloat(this.opportunityData.ParentOrderTCV)).toFixed(2)) : '0.00'
        this.minStartDate = (this.opportunityData.ParentOrderProjectStartDate) ? new Date(this.opportunityData.ParentOrderProjectStartDate) : new Date(1945, 0, 1);
        this.minEndDate = this.minStartDate;
        //Project start date & Project end date Normal scenario 
        this.orderOverviewObj.StartDate = this.orderCreated == false ? this.opportunityData.wipro_engagementstartdate ? this.opportunityData.wipro_engagementstartdate : null : this.opportunityData.StartDate;
        this.projectStartDate = this.orderCreated == false ? this.opportunityData.wipro_engagementstartdate ? this.opportunityData.wipro_engagementstartdate : '' : this.opportunityData.StartDate;
        this.orderOverviewObj.EndDate = this.orderCreated == false ? this.opportunityData.wipro_engagementenddate ? this.opportunityData.wipro_engagementenddate : null : this.opportunityData.EndDate;
        this.projectEndDate = this.orderCreated == false ? this.opportunityData.wipro_engagementenddate ? this.opportunityData.wipro_engagementenddate : '' : this.opportunityData.EndDate;
        this.orderOverviewObj.Authorization = (Object.keys(this.opportunityData).some(it => it == 'Authorization')) ? this.opportunityData.Authorization : true;

        if (this.orderOverviewObj.Authorization == true) {
          this.orderOverviewObj.SOWSigned = this.opportunityData.SOWSigned ? this.opportunityData.SOWSigned : false;
          this.ContrcatSigned = this.orderOverviewObj.SOWSigned;
          this.savedAuthorization = true;
          this.savedContractSigned = this.ContrcatSigned;
        } else {
          this.orderOverviewObj.PurchaseOrderSigned = this.opportunityData.PurchaseOrderSigned ? this.opportunityData.PurchaseOrderSigned : false;
          this.ContrcatSigned = this.orderOverviewObj.PurchaseOrderSigned;
          this.savedAuthorization = false;
          this.savedContractSigned = this.ContrcatSigned;
        }

        // set contract signed date
        this.orderOverviewObj.SOWSignedDate = this.opportunityData.SOWSignedDate ? this.opportunityData.SOWSignedDate : null;
        this.orderOverviewObj.PurchaseOrderSignedDate = this.opportunityData.PurchaseOrderSignedDate ? this.opportunityData.PurchaseOrderSignedDate : null;
        let signedDate: any = this.orderOverviewObj.SOWSignedDate ? this.orderOverviewObj.SOWSignedDate : this.orderOverviewObj.PurchaseOrderSignedDate;
        this.ExpectedSignedDateChangeCount = this.opportunityData.ExpectedSignedDateChangeCount ? this.opportunityData.ExpectedSignedDateChangeCount : 0;
        this.FirstEnteredExpectedSignedDate = this.opportunityData.FirstEnteredExpectedSignedDate ? this.opportunityData.FirstEnteredExpectedSignedDate : '';
        this.contractSignedDate = (signedDate) ? signedDate : '';
        this.savedSignedDate = this.contractSignedDate;

        //set selectedContractCurrency Object
        this.defaultValue.Wipro_ContractCurrency = (this.opportunityData.Wipro_ContractCurrency && this.opportunityData.Wipro_ContractCurrency.Name) ? (this.getSymbol(this.opportunityData.Wipro_ContractCurrency.Name)) : '';
        this.orderOverviewObj.Wipro_ContractCurrency = (this.opportunityData.Wipro_ContractCurrency && this.opportunityData.Wipro_ContractCurrency.SysGuid) ? this.opportunityData.Wipro_ContractCurrency.SysGuid : '';
        this.orderOverviewObj.OldWipro_ContractCurrency = this.orderOverviewObj.Wipro_ContractCurrency ? this.orderOverviewObj.Wipro_ContractCurrency : null;
        this.selectedContractCurrencyObj.Name = this.defaultValue.Wipro_ContractCurrency;
        this.selectedContractCurrencyObj.Id = this.orderOverviewObj.Wipro_ContractCurrency;
        //set selectedContractCurrency Object End

        this.orderOverviewObj.SOWTCV = (Object.keys(this.opportunityData).some(it => it == 'SOWTCV')) ? (this.opportunityData.SOWTCV ? ((parseFloat(this.opportunityData.SOWTCV)).toFixed(2)) : '') : '';

        this.amendmentRemarks = this.opportunityData.WiproAmendmentRemarks ? this.opportunityData.WiproAmendmentRemarks : null;


      }
      // this.defaultValue.countryDetails.state = typeof this.opportunityData.State == 'object' ? this.opportunityData.State.SysGuid : this.opportunityData.State;
      // console.log("gdf", this.defaultValue.countryDetails.state)

      // Subbu Changes
      this.orderOverviewObj.CrmReferenceNumber = this.opportunityData.CRMReference ? this.opportunityData.CRMReference : null;
      //this.defaultValue.ClassificationId = parseInt(this.opportunityData.ClassificationId);
      this.orderOverviewObj.ClassificationId = this.opportunityData.ClassificationId ? parseInt(this.opportunityData.ClassificationId) : "";

      this.delayReasonData = this.opportunityData.DelayReason ? this.opportunityData.DelayReason : ''
      this.showDelayReasonTab = this.opportunityData.DelayReason ? true : false;
      console.log("show delay", this.showDelayReasonTab)

      //set SAP Code Object
      this.defaultValue.sapCode = this.opportunityData.SapCode ? this.opportunityData.SapCode.Name ? this.opportunityData.SapCode.Name : '' : '';
      this.orderOverviewObj.SAPCustomerCode = this.opportunityData.SapCode ? this.opportunityData.SapCode.SysGuid ? this.opportunityData.SapCode.SysGuid : '' : '';
      this.selectedSAPCodeObj.Name = this.defaultValue.sapCode;
      this.selectedSAPCodeObj.Id = this.orderOverviewObj.SAPCustomerCode;

      //Project start date & Project end date amendment scenario 

      //upload contract get

      this.UploadContract.ContractTitle = (this.opportunityData.ContractTitle && !this.ParentOrderIdForAmendment) ? this.opportunityData.ContractTitle : '';
      this.UploadContract.ContractNotes = (this.opportunityData.ContractNotes && !this.ParentOrderIdForAmendment) ? this.opportunityData.ContractNotes : '';
      this.IsICMAccount = (Object.keys(this.opportunityData).some(it => it == 'IsICMAccount')) ? this.opportunityData.IsICMAccount : true;
      //upload contract ends





      //set ContractingCountry  Object
      this.defaultValue.country = this.opportunityData.Country ? this.opportunityData.Country.Name ? this.opportunityData.Country.Name : '' : '';
      this.orderOverviewObj.ContractingCountryId = this.opportunityData.Country ? this.opportunityData.Country.SysGuid ? this.opportunityData.Country.SysGuid : '' : '';
      this.selectedCountryObj.Name = this.defaultValue.country;
      this.selectedCountryObj.Id = this.orderOverviewObj.ContractingCountryId;
      //set ContractingCountry Object End



      //set VSO Object
      this.defaultValue.verticalOwner = this.opportunityData.VerticalSalesOwner ? this.opportunityData.VerticalSalesOwner.Name ? this.opportunityData.VerticalSalesOwner.Name : '' : '';
      this.orderOverviewObj.VerticalSalesOwnerId = this.opportunityData.VerticalSalesOwner ? this.opportunityData.VerticalSalesOwner.SysGuid ? this.opportunityData.VerticalSalesOwner.SysGuid : '' : '';
      this.selectedVSOObj.Name = this.defaultValue.verticalOwner;
      this.selectedVSOObj.Id = this.orderOverviewObj.VerticalSalesOwnerId;
      this.selectedVSOObj.EmailID = this.opportunityData.VerticalSalesOwner ? this.opportunityData.VerticalSalesOwner.EmailID ? this.opportunityData.VerticalSalesOwner.EmailID : '' : '';
      //set VSO Object End

      //set Advisor Object
      this.defaultValue.advisorName = this.opportunityData.AdvisorName ? this.opportunityData.AdvisorName.Name ? this.opportunityData.AdvisorName.Name : '' : '';
      this.orderOverviewObj.AdvisorId = this.opportunityData.AdvisorName ? this.opportunityData.AdvisorName.SysGuid ? this.opportunityData.AdvisorName.SysGuid : '' : '';
      this.selectedAdvisorObj.Name = this.defaultValue.advisorName;
      this.selectedAdvisorObj.Id = this.orderOverviewObj.AdvisorId;
      //set Advisor Object End

      if ((!this.OrderId && this.WTFlag) == false) {
        //set Currency Object
        this.defaultValue.currency = (this.opportunityData.Currency && this.opportunityData.Currency.Name) ? (this.getSymbol(this.opportunityData.Currency.Name)) : '';
        this.orderOverviewObj.CurrencyId = (this.opportunityData.Currency && this.opportunityData.Currency.SysGuid) ? this.opportunityData.Currency.SysGuid : '';
        this.CurrencyId = this.orderOverviewObj.CurrencyId;
        this.CurrencySymbol = (this.opportunityData.Currency && this.opportunityData.Currency.Type) ? (this.getSymbol(this.opportunityData.Currency.Type)) : '';
        this.selectedCurrencyObj.Name = this.defaultValue.currency;
        this.selectedCurrencyObj.Id = this.orderOverviewObj.CurrencyId;
        //set Currency Object End
        if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails && this.amendmentCreationDetails.WiproAmendmentType != 184450006) {
          let OrderTCV: any = "";
          this.orderOverviewObj.OrderTCV = OrderTCV ? (parseFloat(OrderTCV)).toFixed(2) : '0.00'
          this.orderOverviewObj.TCVDifferenceAmount = '0.00';
          this.OMPercentage = 0;
        } else if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails && this.amendmentCreationDetails.WiproAmendmentType == 184450006) {
          let OrderTCV: any = this.opportunityData.OrderTCV ? this.opportunityData.OrderTCV : this.opportunityData.OpportunityTCV;
          this.orderOverviewObj.OrderTCV = OrderTCV ? (OrderTCV > 0 ? (parseFloat("-" + OrderTCV)).toFixed(2) : (parseFloat(OrderTCV)).toFixed(2)) : '0.00'
          this.orderOverviewObj.TCVDifferenceAmount = this.opportunityData.TCVDifferenceAmount ? this.opportunityData.TCVDifferenceAmount : '0.00';
          this.OMPercentage = 0;
        } else {
          let OrderTCV: any = this.opportunityData.OrderTCV ? this.opportunityData.OrderTCV : this.opportunityData.OpportunityTCV;
          this.orderOverviewObj.OrderTCV = OrderTCV ? (parseFloat(OrderTCV)).toFixed(2) : '0.00'
          this.orderOverviewObj.TCVDifferenceAmount = this.opportunityData.TCVDifferenceAmount ? this.opportunityData.TCVDifferenceAmount : '0.00';
          this.OMPercentage = this.opportunityData.OMPercentage ? this.opportunityData.OMPercentage : 0;
        }

        this.getTCVdifference(this.orderOverviewObj.SOWTCV)
      }



      this.orderOverviewObj.POAHolderId = this.opportunityData.POAHolderId ? this.opportunityData.POAHolderId : null;
      this.orderOverviewObj.DeletePOAHolderId = this.orderOverviewObj.POAHolderId;
      this.defaultValue.POAName = this.opportunityData.POAHolder ? this.opportunityData.POAHolder : '';

      this.orderOverviewObj.OpportunityTCV = this.opportunityData.OpportunityTCV ? this.opportunityData.OpportunityTCV : null



      // this.defaultValue.ApprovalStage = this.opportunityData.ApprovalStage ? this.opportunityData.ApprovalStage : '';
      this.orderOverviewObj.AccountId = this.opportunityData.Account ? this.opportunityData.Account.SysGuid ? this.opportunityData.Account.SysGuid : '' : '';
      this.orderOverviewObj.Name = this.opportunityData.name ? this.opportunityData.name : '';
      this.defaultValue.orderNumber = this.opportunityData.OrderNumber;

      this.orderService.sendOrderDetails(this.opportunityData);

      if (this.ContrcatSigned == false) {
        this.signedDateValidation();
      }
      else {
        this.signedMinDateVal = '';
        this.signedMaxDateVal = new Date();
      }





      // subbu change



      console.log("order number", this.defaultValue.orderNumber)
      if (this.opportunityData.Country) {
        this.defaultValue.country = this.opportunityData.Country.Name ? this.opportunityData.Country.Name : "";
        this.orderOverviewObj.ContractingCountryId = this.opportunityData.Country.SysGuid ? this.opportunityData.Country.SysGuid : "";
        this.selectedCountryObj = Object.assign({ Id: this.orderOverviewObj.ContractingCountryId, Name: this.defaultValue.country, GeoName: "", RegionName: "" });
         this.savedContractingCountryId = this.orderOverviewObj.ContractingCountryId;

        //getState API
        this.getStates(this.orderOverviewObj.ContractingCountryId);

      } else {
        this.defaultValue.country = "";
        this.orderOverviewObj.ContractingCountryId = "";
        this.subDivisions = [];
        this.selectedCountryObj = Object.assign({ Id: "", Name: "", GeoName: "", RegionName: "" });
       this.savedContractingCountryId = "";
      }
      

      if (this.opportunityData.State) {
        if (typeof this.opportunityData.State == 'object') {
          this.orderOverviewObj.CountrySubDivisionState = this.opportunityData.State.SysGuid ? this.opportunityData.State.SysGuid : "";
        } else {
          this.orderOverviewObj.CountrySubDivisionState = this.opportunityData.State ? this.opportunityData.State : "";
        }
        this.orderOverviewObj.DeleteCountrySubDivisionState = (this.orderOverviewObj.CountrySubDivisionState && !this.ParentOrderIdForAmendment) ? this.orderOverviewObj.CountrySubDivisionState : null;
        this.onSubDivisionChange(this.orderOverviewObj.CountrySubDivisionState, true);
      } else {
        this.orderOverviewObj.DeleteCountrySubDivisionState = null;
        this.orderOverviewObj.CountrySubDivisionState = "";
        this.cityRegions = [];
      }

      if (this.opportunityData.ContractingCity) {
        if (typeof this.opportunityData.ContractingCity == 'object') {
          this.orderOverviewObj.CityRegion = this.opportunityData.ContractingCity.SysGuid ? this.opportunityData.ContractingCity.SysGuid : "";
        } else {
          this.orderOverviewObj.CityRegion = this.opportunityData.ContractingCity ? this.opportunityData.ContractingCity : "";
        }
        this.orderOverviewObj.DeleteCityRegion = (this.orderOverviewObj.CityRegion && !this.ParentOrderIdForAmendment) ? this.orderOverviewObj.CityRegion : null;
      } else {
        this.orderOverviewObj.DeleteCityRegion = null;
        this.orderOverviewObj.CityRegion = "";
      }
      // this.mandatoryFeildsStatus();
      this.getSLPracSubpracData();
    } else {
      this.getSLPracSubpracData();
    }
    this.getOrderIcmValues();

  }

  getOrderIcmValues(){
      let payload= {
        "OpportunityId": this.OpportunityId,
        "OrderBookingId": this.opportunityData.OrderBookingId,
      }
      console.log("dataicm", payload);
      this.orderService.getOrderIcmValues(payload).subscribe((res: any) =>{
       console.log("resobjectfor", res.ResponseObject);
       console.log("orderOverviewObj.Authorization", this.orderOverviewObj.Authorization);
       if(!res.IsError){
       this.projectStartDate = res.ResponseObject.StartDate ? res.ResponseObject.StartDate : this.projectStartDate;
       this.projectEndDate = res.ResponseObject.EndDate ? res.ResponseObject.EndDate : this.projectEndDate;
       if(this.orderOverviewObj.Authorization == true){
          this.contractSignedDate = res.ResponseObject.SOWSignedDate ? res.ResponseObject.SOWSignedDate : this.contractSignedDate;
       }else{
        this.contractSignedDate = res.ResponseObject.PurchaseOrderSignedDate ? res.ResponseObject.PurchaseOrderSignedDate : this.contractSignedDate;
       }
       this.orderOverviewObj.ContractingCountryId = res.ResponseObject.Country.SysGuid ? res.ResponseObject.Country.SysGuid : this.orderOverviewObj.ContractingCountryId;
       this.defaultValue.country = res.ResponseObject.Country.Name ? res.ResponseObject.Country.Name : this.defaultValue.country;
       }
      }),err => {
        this.projectService.displayerror(err.status);
      }

  }

  // Get order Type dropdown
  orderType() {
    this.orderService.getOrderType()
      .subscribe((res: any) => {
        this.orders = (res && res.ResponseObject) ? res.ResponseObject : [];
        console.log('orders type', this.orders);
        // this.orderOverviewObj.OrderTypeId = res.ResponseObject[0].Id;
        console.log("order type is", this.orderOverviewObj.OrderTypeId)
      }, err => {
        this.orders = [];
        console.log(err)
      });
  }
  //Modified order save
  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  modifypodetailspopup() {

    const dialogRef = this.dialog.open(poDetailspopup, {
      width: '920px',
      data: {
        orderId: this.OrderId,
        poDetailsData: (this.modifiedOrderPODetails.length > 0) ? this.modifiedOrderPODetails.map(it => { return Object.assign({}, it) }) : [],
        readOnly: true,
        currencyId: this.orderOverviewObj.CurrencyId,
        currencyName: this.defaultValue.currency,
        acceptNegative: this.acceptNegative
      }
    });
  }

  createModifyOverview(ModifyOverView, modifyPOData) {
    this.modifiedOrderPODetails = modifyPOData.length > 0 ? modifyPOData.map(it => {
      let poObject = {
        POTableModificationId: it.POTableModificationId ? it.POTableModificationId : "", // Row id or primary key of the record
        OrderModificationId: it.OrderModificationId ? it.OrderModificationId : "",
        Wipro_OrderId: it.Wipro_OrderId ? it.Wipro_OrderId : "",
        Wipro_PONumber: it.Wipro_PONumber ? it.Wipro_PONumber : "",
        Wipro_OrderPOTableId: it.Wipro_OrderPOTableId ? it.Wipro_OrderPOTableId : "", // This is order PO details reference id. If user adding new PO from order modification then it will blank/empty
        Wipro_SignedDate: it.Wipro_SignedDate ? it.Wipro_SignedDate : "",
        Wipro_SignedDateUTC: it.Wipro_SignedDateUTC ? new Date(it.Wipro_SignedDateUTC) : "",
        Wipro_Remarks: it.Wipro_Remarks ? it.Wipro_Remarks : "",
        StateCode: 2,
        POValue: it.POValue ? it.POValue : "",
        POCurrency: it.POCurrency ? it.POCurrency : "",
        POCurrencyId: it.POCurrencyId ? it.POCurrencyId : ""
      }
      return poObject;
    }) : [];
    ModifyOverView.sort((a, b) => (a.AttributeType > b.AttributeType) ? 1 : ((b.AttributeType > a.AttributeType) ? -1 : 0));

    this.modifiedOrderSaveArray = ModifyOverView.filter(it => {
      it.Reasons = (it.Reasons && it.Reasons != 0) ? it.Reasons : '';
      it.Action = (it.Action) ? it.Action : '';
      if (it.AttributeType > 10) {
        return false;
      }
      else {
        if (it.AttributeType == 2 || it.AttributeType == 3 || it.AttributeType == 7) {
          it.CurrentOrderDetails = it.CurrentOrderDetails ? this.datePipe.transform(it.CurrentOrderDetails, 'dd-MMM-yyyy') : "";
          it.ChangeOrderDetails = it.ChangeOrderDetails ? this.datePipe.transform(it.ChangeOrderDetails, 'dd-MMM-yyyy') : "";
          console.log("current order details", it.CurrentOrderDetails);
        } else if (it.AttributeType == 4) {
          it.CurrentOrderDetails = it.CurrentOrderDetails == "True" ? 'SOW' : 'PO';
          it.ChangeOrderDetails = it.ChangeOrderDetails == "True" ? 'SOW' : 'PO';
        }
        return true;
      }

    });
    console.log("sorted", this.modifiedOrderSaveArray);
  }

  // Get Classification dropdown
  classification() {
    this.orderService.getClassification()
      .subscribe((res: any) => {
        this.classifications = (res && res.ResponseObject) ? res.ResponseObject : [];
        console.log("clasification", this.classifications)
      }, err => {
        this.classifications = [];
        console.log(err)
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

  // // country list API start
  // CountryList(List?) {
  //   this.CountryArray = [];
  //   this.dataHeader = {
  //     name: 'name'
  //   };
  //   this.countryList.map((res: any, data) => {
  //     const resData = Object.assign({
  //       name: res.Name,
  //       SysGuid: res.SysGuid
  //     }, res);
  //     this.CountryArray.push(resData);

  //   });
  // }

  // // Get Contracting country, Country sub-division(state) and City
  // getAccountRelatedFields() {
  //   const payload = {
  //     AccountId: this.getAccountId(),
  //     UserGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
  //   };
  //   this.orderService.getAccountRelatedFields(payload)
  //     .subscribe((res: any) => {
  //       if (!res.IsError) {
  //     this.countryList = (res && res.ResponseObject && res.ResponseObject.Country)?res.ResponseObject.Country:[];
  //         this.stateList = (res && res.ResponseObject && res.ResponseObject.State)?res.ResponseObject.State:[];
  //         this.cityList =  (res && res.ResponseObject && res.ResponseObject.City)?res.ResponseObject.City:[];
  //         const resData = {
  //           name: this.countryList[0].Name,
  //           SysGuid: this.countryList[0].SysGuid
  //         };
  //       }
  //     }, err => console.log(err));
  // }



  checkDelayReason(contractSignedDateVal) {
    // let data1: any = new Date(this.orderOverviewObj.StartDate);
    let data1: any = new Date();
    let data2: any = new Date(contractSignedDateVal);
    var diff1: any = data1 - data2;
    var DaysDiff: any = diff1 / (1000 * 3600 * 24);
    if (DaysDiff > 7) {
      // this.opendelaypop();
      const dialogRef = this.dialog.open(delaypopcomponent, {
        width: '400px',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("delay ref", result);
        if (result) {
          if (result.flag == 'Yes' && result.reasonFlag == true) {
            this.delayReasonData = result.reason;
            this.setContractSignedDate(contractSignedDateVal);
            this.orderOverviewObj.DelayReason = result.reason;
            this.showDelayReasonTab = true;
            // this.orderOverviewValidationValue.SOWSignedDate = false;
          }
          else {
            this.contractSignedDate = '';
            this.setContractSignedDate(this.contractSignedDate);
            this.orderOverviewObj.DelayReason = null;
          }
        }
      })
    }
    else {
      this.setContractSignedDate(contractSignedDateVal);
      this.orderOverviewObj.DelayReason = null;
      this.showDelayReasonTab = false;
    }
  }

  changeContractSignedDate(ContrcatSignedDate) {
    if (this.ContrcatSigned == true && ContrcatSignedDate) {
      this.checkDelayReason(ContrcatSignedDate);
    } else {
      this.setContractSignedDate(ContrcatSignedDate)
    }
  }

  setContractSignedDate(ContrcatSignedDate) {
    if (ContrcatSignedDate) {
      this.orderOverviewValidationValue.PurchaseOrderSignedDate = false;
      this.orderOverviewValidationValue.SOWSignedDate = false;
      this.orderOverviewValidationValue.poDetails = false;
    }
    if (this.orderOverviewObj.Authorization == true && this.ContrcatSigned == true) {
      //For SOW and Yes
      this.orderOverviewObj.SOWSignedDate = ContrcatSignedDate ? this.getIsoDateFormat(ContrcatSignedDate) : null;
    }
    else if (this.orderOverviewObj.Authorization == true && this.ContrcatSigned == false) {
      //For SOW and NO
      this.orderOverviewObj.SOWSignedDate = ContrcatSignedDate ? this.getIsoDateFormat(ContrcatSignedDate) : null;
    }
    else if (this.orderOverviewObj.Authorization == false && this.ContrcatSigned == true) {
      //For PO and Yes
      this.orderOverviewObj.PurchaseOrderSignedDate = ContrcatSignedDate ? this.getIsoDateFormat(ContrcatSignedDate) : null;
    }
    else if (this.orderOverviewObj.Authorization == false && this.ContrcatSigned == false) {
      //For PO and NO
      this.orderOverviewObj.PurchaseOrderSignedDate = ContrcatSignedDate ? this.getIsoDateFormat(ContrcatSignedDate) : null;
    }
  }

  changeAuthOrContSigned(type) {
    this.orderOverviewObj.SOWSigned = null;
    this.orderOverviewObj.PurchaseOrderSigned = null;
    this.orderOverviewObj.PurchaseOrderSignedDate = null;
    this.orderOverviewObj.SOWSignedDate = null;
    this.orderOverviewValidationValue.PurchaseOrderSignedDate = false;
    this.orderOverviewValidationValue.SOWSignedDate = false;
    this.orderOverviewValidationValue.poDetails = false;
    this.orderOverviewValidationValue.Authorization = (type == 'auth') ? false : this.orderOverviewValidationValue.Authorization
    this.orderOverviewValidationValue.SOWSigned = (type == 'signed') ? false : this.orderOverviewValidationValue.SOWSigned
    this.orderOverviewValidationValue.PurchaseOrderSigned = (type == 'signed') ? false : this.orderOverviewValidationValue.PurchaseOrderSigned
    if (this.orderOverviewObj.Authorization == true && this.ContrcatSigned == true) {
      //For SOW and Yes
      this.orderOverviewObj.SOWSigned = true;
      this.contractSignedDate = (this.savedAuthorization && this.savedContractSigned) ? this.savedSignedDate : "";
      this.orderOverviewObj.SOWSignedDate = this.contractSignedDate ? this.getIsoDateFormat(this.contractSignedDate) : null;
      this.orderOverviewObj.POAHolderId = this.opportunityData.POAHolderId ? this.opportunityData.POAHolderId : null;
      this.defaultValue.POAName = this.opportunityData.POAHolder ? this.opportunityData.POAHolder : '';
      this.orderOverviewObj.SOWTCV = "";
      this.orderOverviewObj.Wipro_ContractCurrency = "";
      this.defaultValue.Wipro_ContractCurrency = "";
      this.selectedContractCurrencyObj = Object.assign({ Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" });
      this.contrcatSignedYes();
      this.getOrderIcmValues();
    }
    else if (this.orderOverviewObj.Authorization == true && this.ContrcatSigned == false) {
      //For SOW and NO
      this.orderOverviewObj.SOWSigned = false;
      this.contractSignedDate = ((this.savedAuthorization == true && this.savedContractSigned == false) || (this.ExpectedSignedDateChangeCount > 1)) ? this.savedSignedDate : "";
      this.orderOverviewObj.SOWSignedDate = this.contractSignedDate ? this.getIsoDateFormat(this.contractSignedDate) : null;
      this.contrcatsignedNo();
    }
    else if (this.orderOverviewObj.Authorization == false && this.ContrcatSigned == true) {
      //For PO and Yes
      if (this.poDetailsData.length > 0) {
        let maxPOsignedDate = this.getMaxDate(this.poDetailsData, 'Wipro_SignedDate');
        this.contractSignedDate = maxPOsignedDate ? new Date(maxPOsignedDate) : '';
        let sumOfPOValue = this.poDetailsData.map(item => item.POValue).reduce((a, c) => { return a + c });
        this.orderOverviewObj.SOWTCV = sumOfPOValue ? parseFloat(sumOfPOValue).toFixed(2) : '';
        this.orderOverviewObj.Wipro_ContractCurrency = this.poDetailsData[0].POCurrencyId ? this.poDetailsData[0].POCurrencyId : '';
        this.defaultValue.Wipro_ContractCurrency = this.poDetailsData[0].POCurrency ? this.poDetailsData[0].POCurrency : '';
        this.selectedContractCurrencyObj = Object.assign({ Id: this.orderOverviewObj.Wipro_ContractCurrency, Name: this.defaultValue.Wipro_ContractCurrency, Type: '', SysNumber: "", IsoCurrencyCode: "" });
        this.getTCVdifference(this.orderOverviewObj.SOWTCV);
      } else {
        this.contractSignedDate = '';
        this.orderOverviewObj.SOWTCV = "";
        this.orderOverviewObj.Wipro_ContractCurrency = "";
        this.defaultValue.Wipro_ContractCurrency = "";
        this.selectedContractCurrencyObj = Object.assign({ Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" });
        this.getTCVdifference(this.orderOverviewObj.SOWTCV);
      }
      this.orderOverviewObj.PurchaseOrderSigned = true;
      this.orderOverviewObj.PurchaseOrderSignedDate = this.contractSignedDate ? this.getIsoDateFormat(this.contractSignedDate) : null;
      this.orderOverviewValidationValue.Wipro_ContractCurrency = false;
      this.contrcatSignedYes();
      this.getOrderIcmValues();
    }
    else if (this.orderOverviewObj.Authorization == false && this.ContrcatSigned == false) {
      //For PO and NO
      this.orderOverviewObj.PurchaseOrderSigned = false;
      this.contractSignedDate = ((this.savedAuthorization == false && this.savedContractSigned == false) || (this.ExpectedSignedDateChangeCount > 1)) ? this.savedSignedDate : "";
      this.orderOverviewObj.PurchaseOrderSignedDate = this.contractSignedDate ? this.getIsoDateFormat(this.contractSignedDate) : null;
      this.contrcatsignedNo();
    }
  }

  contrcatsignedNo() {
    this.orderOverviewObj.POAHolderId = null;
    this.defaultValue.POAName = '';
    this.orderOverviewValidationValue.Wipro_ContractCurrency = false;
    this.orderOverviewObj.SOWTCV = "";
    this.defaultValue.Wipro_ContractCurrency = "";
    this.orderOverviewObj.Wipro_ContractCurrency = "";
    this.selectedContractCurrencyObj = Object.assign({ Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" });
    this.signedDateValidation();
    this.getTCVdifference(this.orderOverviewObj.SOWTCV);
  }

  contrcatSignedYes() {
    this.signedMinDateVal = '';
    this.signedMaxDateVal = new Date();
  }


  // signedDateValidation() {
  //   // let maxDate: any = new Date();
  //   if (this.projectStartDate) {
  //     let currentDate = new Date();
  //     let ExtendedCurrentDate = new Date(new Date().setDate(currentDate.getDate() + 30));
  //     let projectStartDate = new Date(this.projectStartDate);
  //     let ExtendedPSD = new Date(new Date().setDate(projectStartDate.getDate() + 30));
  //     let FirstEnteredExpectedSignedDate: any = this.FirstEnteredExpectedSignedDate ? new Date(this.FirstEnteredExpectedSignedDate) : '';
  //     // if (!this.OrderId) {
  //     //   this.signedMinDateVal = projectStartDate;
  //     //   maxDate.setDate(projectStartDate.getDate() + 30);
  //     //   this.signedMaxDateVal = new Date(maxDate);
  //     // } else {
  //       let OverAllmaxsignedDate: any = new Date();
  //       if (FirstEnteredExpectedSignedDate) {
  //         OverAllmaxsignedDate = new Date(new Date().setDate(FirstEnteredExpectedSignedDate.getDate() + 120));
  //       } else {
  //         OverAllmaxsignedDate = "";
  //       }
  //       if (projectStartDate < currentDate) {
  //         this.signedMinDateVal = currentDate;
  //         if (OverAllmaxsignedDate && (ExtendedCurrentDate > OverAllmaxsignedDate)) {
  //           this.signedMaxDateVal = new Date(OverAllmaxsignedDate);
  //         } else {
  //           // maxDate.setDate(currentDate.getDate() + 30);
  //           this.signedMaxDateVal = new Date(ExtendedCurrentDate);
  //         }
  //       } else {
  //         this.signedMinDateVal = projectStartDate;
  //         if (OverAllmaxsignedDate && (ExtendedPSD > OverAllmaxsignedDate)) {
  //           this.signedMaxDateVal = new Date(OverAllmaxsignedDate);
  //         } else {
  //           // maxDate.setDate(projectStartDate.getDate() + 30);
  //           this.signedMaxDateVal = new Date(ExtendedPSD);
  //         }

  //       }
  //     // }
  //   }
  // }

  signedDateValidation() {
    if (this.projectStartDate) {
      let currentDate = new Date();
      let projectStartDate = new Date(this.projectStartDate);
      let ExtendedPSD = new Date(new Date(projectStartDate).setDate(projectStartDate.getDate() + 30));
      let FirstEnteredExpectedSignedDate: any = this.FirstEnteredExpectedSignedDate ? new Date(this.FirstEnteredExpectedSignedDate) : '';
      let OverAllmaxsignedDate: any = FirstEnteredExpectedSignedDate ? (new Date(new Date(FirstEnteredExpectedSignedDate).setDate(FirstEnteredExpectedSignedDate.getDate() + 120))) : "";
      // this.signedMinDateVal = OverAllmaxsignedDate && (projectStartDate > OverAllmaxsignedDate) ? OverAllmaxsignedDate : projectStartDate;
      this.signedMinDateVal = currentDate;
      if (OverAllmaxsignedDate && (ExtendedPSD > OverAllmaxsignedDate)) {
        this.signedMaxDateVal = new Date(OverAllmaxsignedDate);
      } else {
        this.signedMaxDateVal = new Date(ExtendedPSD);
      }
    }
  }



  poDetailsData: any = [];
  podetailspopup() {
  console.log("poaccount", this.opportunityData.Account);
    const dialogRef = this.dialog.open(poDetailspopup, {
      width: '920px',
      data: {
        orderId: this.OrderId,
        poDetailsData: (this.poDetailsData.length > 0) ? this.poDetailsData.map(it => { return Object.assign({}, it) }) : [],
        readOnly: this.disableOnRoleOverwiew,
        currencyId: this.orderOverviewObj.CurrencyId,
        currencyName: this.defaultValue.currency,
        acceptNegative: this.acceptNegative
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("naren", res.PODetails);
      if (res.flag = 'Yes' && res && res.PODetails && res.PODetails.length > 0) {
        this.orderOverviewValidationValue.poDetails = false;
        this.poDetailsData = res.PODetails.map(it => { return Object.assign({}, it) });
        let maxPOsignedDate = this.getMaxDate(this.poDetailsData, 'Wipro_SignedDate');
        let polist = res.PODetails.map(item => parseFloat(item.POValue));
        let sumOfPOValue = polist.reduce((a, c = 0) => { return a + c });
        this.orderOverviewObj.SOWTCV = sumOfPOValue ? parseFloat(sumOfPOValue).toFixed(2) : '';
        this.orderOverviewObj.Wipro_ContractCurrency = res.PODetails[0].POCurrencyId ? res.PODetails[0].POCurrencyId : '';
        this.defaultValue.Wipro_ContractCurrency = res.PODetails[0].POCurrency ? res.PODetails[0].POCurrency : '';
        this.selectedContractCurrencyObj = Object.assign({ Id: this.orderOverviewObj.Wipro_ContractCurrency, Name: this.defaultValue.Wipro_ContractCurrency, Type: '', SysNumber: "", IsoCurrencyCode: "" });
        this.getTCVdifference(this.orderOverviewObj.SOWTCV);

        if (maxPOsignedDate) {
          this.contractSignedDate = new Date(maxPOsignedDate);
          this.changeContractSignedDate(maxPOsignedDate);
        } else {
          this.contractSignedDate = '';
          this.changeContractSignedDate(this.contractSignedDate);
        }
      } else {
        this.poDetailsData = [];
        this.contractSignedDate = '';
        this.changeContractSignedDate(this.contractSignedDate);
      }
    })
  }

  getMaxDate(dateData, signedDate) {
    let maxPOsignedDateArr = dateData.map(date => date[signedDate] ? new Date(date[signedDate]) : null);
    let maxPOsignedDate: any = new Date(Math.max.apply(null, maxPOsignedDateArr));
    return maxPOsignedDate;
  }



  //clear po details

  getOrderPOdetails(clear?) {
    if (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType != 184450006) {
      this.poDetailsData = [];
    }
    else {
      const payload = {
        Id: this.orderOverviewObj.OrderBookingId

      }
      console.log("GetOrderPOdetailsP", payload);
      this.orderService.getOrderPOdetails(payload).subscribe((res: any) => {
        if (!res.IsError && res.ResponseObject.length) {
          console.log("GetOrderPOdetailsR", res.ResponseObject);
          this.poDetailsData = res.ResponseObject.map(it => {
            return Object.assign({
              ...it,
              Wipro_POTableId: (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006 ? null : it.Wipro_POTableId),
              POValue: (this.ParentOrderIdForAmendment && this.amendmentCreationDetails.WiproAmendmentType == 184450006 && it.POValue > 0 ? ("-" + it.POValue) : it.POValue)
            })
          });
        } else {
          this.poDetailsData = [];
        }
      });
    }

  }

  // delete all PO details if contract is not signed and authorization is true
  deleteAllPoDeatails(deletePoObject) {
    console.log(deletePoObject);
    deletePoObject.map((delPo: any, i) => {
      if (delPo.Wipro_POTableId) {
        let payload = {
          Wipro_POTableId: delPo.Wipro_POTableId,
          StateCode: 1
        };
        this.orderService.deletePODetails(payload).subscribe((del: any) => {
          if (!del.IsError) {
            this.contractSignedDate = '';
            console.log('PO details Deleted Successfully');
          }
        }, err => console.log(err));
      }
      if ((i + 1) == deletePoObject.length) {
        this.projectService.displayMessageerror('All PO Details Deleted');
        this.poDetailsData = [];
      }
    });
  }

  oninputOfContractTCVValue(oldValue, event) {
    this.orderOverviewValidationValue.SOWTCV = false;

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

  getTCVdifference(val) {
    this.orderOverviewValidationValue.SOWTCV = false;
    this.NocurrencyMultiplier = null;
    let SOWTCV: any = this.acceptNegative ? val.match(this.negativeregex) : val.match(this.positiveregex);
    this.orderOverviewObj.SOWTCV = SOWTCV && SOWTCV.length > 0 && SOWTCV[0] && !this.isNaNCheck(SOWTCV[0]) && SOWTCV[0] != 0 ? parseFloat(SOWTCV[0]).toFixed(2) : "";
    if (this.orderOverviewObj.Wipro_ContractCurrency && this.CurrencyId && this.orderOverviewObj.Wipro_ContractCurrency != this.CurrencyId) {
      this.orderOverviewObj.TCVDifferenceAmount = '0.00';
      this.currencyMismatch = true;
      this.showTolerence = false;
      this.showTolerenceInLimit = false;
    } else {
      this.currencyMismatch = false;
      if (this.orderOverviewObj.Wipro_ContractCurrency && this.CurrencyId && this.orderOverviewObj.Wipro_ContractCurrency == this.CurrencyId) {
        this.orderOverviewObj.TCVDifferenceAmount = (this.orderOverviewObj.OrderTCV && this.orderOverviewObj.SOWTCV) ? ((parseFloat(this.orderOverviewObj.OrderTCV) - parseFloat(this.orderOverviewObj.SOWTCV)).toFixed(2)) : '0.00';
        this.showTolerence = false;
        this.showTolerenceInLimit = false;
        // this.checkTolerenceonChange();
      } else {
        this.orderOverviewObj.TCVDifferenceAmount = '0.00';
        this.showTolerence = false;
        this.showTolerenceInLimit = false;
      }


    }
    this.projectService.setSession('orderTcvDiff', this.orderOverviewObj.TCVDifferenceAmount);
  }


  checkTolerenceonChange() {
    this.NocurrencyMultiplier = null;
    this.showTolerence = false;
    this.showTolerenceInLimit = false;
    if (!this.currencyMismatch && this.CurrencyId && this.orderOverviewObj.Wipro_ContractCurrency && this.orderOverviewObj.SOWTCV) {
      if (parseFloat(this.orderOverviewObj.TCVDifferenceAmount) == 0) {
        this.showTolerence = false;
        this.showTolerenceInLimit = false;
      } else if (this.orderOverviewObj.PricingTypeId == 184450002 || this.orderOverviewObj.PricingTypeId == 184450005 || this.orderOverviewObj.PricingTypeId == 184450003 || this.orderOverviewObj.PricingTypeId == 184450007) {
        this.showTolerence = true;
        this.showTolerenceInLimit = false;
      }
      else if (this.orderOverviewObj.PricingTypeId == 184450006) {
        let onepercOfOBTCV = (this.orderOverviewObj.OrderTCV) ? ((parseFloat(this.orderOverviewObj.OrderTCV)) * (1 / 100)) : 0;
        if (this.orderOverviewObj.TCVDifferenceAmount > onepercOfOBTCV) {
          this.showTolerence = true;
          this.showTolerenceInLimit = false;
        } else {
          this.projectService.getCurrencyStatus(this.CurrencyId).subscribe(currency => {
            if (currency && currency.ResponseObject && currency.ResponseObject.length > 0 && currency.ResponseObject[0].Name) {
              let currencyMultiplier = currency.ResponseObject[0].Name ? parseFloat(currency.ResponseObject[0].Name) : null;
              let differenceInDollars: any = (this.orderOverviewObj.TCVDifferenceAmount && currencyMultiplier) ? (parseFloat(this.orderOverviewObj.TCVDifferenceAmount) / currencyMultiplier) : 0;
              let toleranceLimit = 1000;  //In USD
              if (differenceInDollars > toleranceLimit) {
                this.showTolerence = true;
                this.showTolerenceInLimit = false;
              } else {
                this.showTolerence = false;
                this.showTolerenceInLimit = true;
              }
            } else {
              this.projectService.displayMessageerror('No currency multiplier is available');
              this.NocurrencyMultiplier = 1;
            }
          },
            err => {
              this.projectService.displayMessageerror('No currency multiplier is available');
              this.NocurrencyMultiplier = 1;
            });
        }

      }

    }

  }


  onOBTCVChangeDiff(OverAllTCV) {
    this.orderOverviewObj.OrderTCV = OverAllTCV;
    this.getTCVdifference(this.orderOverviewObj.SOWTCV);

  }



  // checkToleranceLimit(onSubmit?) {

  //   if (onSubmit && !this.currencyMismatch && this.ContrcatSigned == true && this.orderOverviewObj.PricingTypeId == 184450006 && this.NocurrencyMultiplier == 1) {
  //     this.projectService.displayMessageerror('No currency multiplier is available');
  //     return false;
  //   }
  //   else if (this.WTFlag || !onSubmit || this.ContrcatSigned == false) {
  //     return true
  //   } else if (this.currencyMismatch) {
  //     this.projectService.displayMessageerror('Order can’t be submitted for Approval as there is mismatch of currency between Order TCV & Contract TCV');
  //     return false;
  //   } else if (this.showTolerence) {
  //     this.projectService.displayMessageerror('Order cannot be submitted for approval till Order TCV and Contract TCV matches');
  //     return false;
  //   } else {
  //     return true;
  //   }

  // }

  checkToleranceLimit(onSubmit?) {


    if (this.WTFlag || !onSubmit || this.ContrcatSigned == false) {
      return true
    } else if (this.currencyMismatch) {
      this.projectService.displayMessageerror('Order can’t be submitted for Approval as there is mismatch of currency between Order TCV & Contract TCV');
      return false;
    } else {
      return true;
    }

  }


  setStartDate(projectStartDate) {
    if (this.projectEndDate && projectStartDate) {
      if (new Date(projectStartDate) > new Date(this.projectEndDate)) {
        this.projectStartDate = '';
        this.orderOverviewObj.EndDate = null;
        this.projectService.displayMessageerror('Start date should not be greater than end date');
      }
    }
    this.minEndDate = projectStartDate ? new Date(projectStartDate) : new Date();
    this.orderOverviewValidationValue.StartDate = false;
    this.orderOverviewObj.StartDate = projectStartDate ? this.getIsoDateFormat(projectStartDate) : null;
    if (this.ContrcatSigned == false) {
      this.signedDateValidation();
    }
    else {
      this.signedMinDateVal = '';
      this.signedMaxDateVal = new Date();
    }
  }

  setEndDate(projectEndDate) {
    if (this.projectStartDate && projectEndDate) {
      if (new Date(this.projectStartDate) > new Date(projectEndDate)) {
        setTimeout(() => {
          this.projectEndDate = '';
          this.orderOverviewObj.EndDate = null;
          this.projectService.displayMessageerror('End date should not be less than start date');
        });

      } else {
        this.orderOverviewValidationValue.EndDate = false;
        this.orderOverviewObj.EndDate = projectEndDate ? this.getIsoDateFormat(projectEndDate) : null;
      }
    } else {
      this.orderOverviewValidationValue.EndDate = false;
      this.orderOverviewObj.EndDate = projectEndDate ? this.getIsoDateFormat(projectEndDate) : null;
    }
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

  setOrderName(orderTypeId) {
    this.orderOverviewValidationValue.OrderTypeId = false;
    let selectedOrderType = this.orders.filter(it => it.Id == orderTypeId);
    this.defaultValue.orderType = selectedOrderType.length > 0 ? selectedOrderType[0].Name : '';
  }

  setClassificationName(ClassificationId) {
    this.orderOverviewValidationValue.ClassificationId = false;
    let selectedClassificationType = this.classifications.filter(it => it.Id == ClassificationId);
    this.defaultValue.ClassificationName = selectedClassificationType.length > 0 ? selectedClassificationType[0].Name : '';
  }


  getIsoDateFormat(date) {
    const getDate = new Date(date);
    const setDate = new Date(getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000));
    return setDate.toISOString();
  }

  validateDealPopUp(solutionData, sol){
    if(solutionData.IsDealRegistered === true){
      for(let i =0 ;i< solutionData.DealRegistrationYes.length; i++){
        let dealyesObj = Object.assign({},solutionData.DealRegistrationYes[i]);
        if(!dealyesObj.RegistrationStatus || !dealyesObj.RegistrationStatusReason || !dealyesObj.RegisteredValue || !dealyesObj.PartnerPortalId || (!dealyesObj.Remarks && dealyesObj.RegistrationStatusReason == '184450004')){
          this.projectService.displayMessageerror("Please add alliance deal registered details for " + this.converIndextoString(sol) + " row of solution table");
          return true;
        }
      }

    }else if(solutionData.IsDealRegistered === false){
      for(let i =0 ;i< solutionData.DealRegistrationNo.length; i++){
        let dealNoObj = Object.assign({},solutionData.DealRegistrationNo[i]);
        if(!dealNoObj.RegistrationStatusReason || (!dealNoObj.Remarks && dealNoObj.RegistrationStatusReason == '184450004')){
          this.projectService.displayMessageerror("Please add alliance deal registered details for " + this.converIndextoString(sol) + " row of solution table");
          return true;
        }
      }
    }

     return false;
  }

  nonValidKey = '';

  // feilds, tolerance limit, LOI validation
  orderOverviewValidation(onSubmit?) {
    this.nonValidKey = '';
    this.orderOverviewValid = true;
    if (!this.feildsValidation(onSubmit)) {
      if (this.nonValidKey == 'poDetails') {
        this.projectService.displayMessageerror(this.orderOverviewValidationMsg[this.nonValidKey]);
      } else {
        this.projectService.displayMessageerror(this.orderOverviewValidationMsg[this.nonValidKey] + ' is a mandatory field');
      }
      this.nonValidKey = '';
    } else if (onSubmit && this.IsICMAccount == false && this.ContrcatSigned == true && (this.UploadContract.UploadContractFiles.length == 0 || !this.UploadContract.ContractTitle)) {
      this.orderOverviewValid = false;
      this.projectService.displayMessageerror('Please upload the contract given by customer');
    }
    else if (!this.ContrcatSigned && (this.loiAttachedDocuments.length >= 1 && !this.loiValue)) {
      this.orderOverviewValid = false;
      this.projectService.displayMessageerror('Upload Letter of Intent');
    }
    else if (!this.checkToleranceLimit(onSubmit)) {
      this.orderOverviewValid = false;
    }
    return this.orderOverviewValid;
  }

  mandatoryCountryCheck(countryName) {
    let tempcountryName = countryName ? countryName.toUpperCase() : '';
    if(tempcountryName == "INDIA" || tempcountryName == "UNITED KINGDOM" || tempcountryName == "USA"
    || tempcountryName == "UK" || tempcountryName == "UNITED STATES") {
      return true;
    }
    else {
      return false;
    }
  }

  // orderover view feilds validations
  feildsValidation(onsubmit?) {
    debugger
    const nonMandatoryFeilds = [
      'OrderBookingId', 'PriceLevelId',
      'AdvisorContactId', 'AdvisorOwnerId', 'OwnerId', 'OrderTCV', 'OrderTypeId', 'AccountId', 'Name', 'OpportunityId',
      'OpportunityTCV', 'TCVDifferenceReason', 'ClassificationId', 'TCVDifferenceAmount',
      'DeleteCountrySubDivisionState', 'DeleteCityRegion', 'OldWipro_ContractCurrency', 'DeletePOAHolderId', 'IsSubmit', 'NonWTFlag', 'CrmReferenceNumber', 'DelayReason']

    this.orderOverviewValidationMsg.SOWSignedDate = this.ContrcatSigned == true ? 'Signed date' : 'Expected PO/SOW signed date';
    this.orderOverviewValidationMsg.PurchaseOrderSignedDate = this.ContrcatSigned == true ? 'Signed date' : 'Expected PO/SOW signed date';
    if (!onsubmit) {
      if (!(((OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.approvalStageID || OrderApprovalStage.ApprovedbyADH_VDH_SDH == this.approvalStageID || OrderApprovalStage.InvoicingRequestRejectedbyBFM == this.approvalStageID || OrderApprovalStage.ForeclosureRequestRejectedbyDM == this.approvalStageID) && this.ContrcatSigned))) {
        nonMandatoryFeilds.push('POAHolderId');
      }
    }
    if(this.mandatoryCountryCheck(this.defaultValue.country) == false && this.subDivisions.length) {
      nonMandatoryFeilds.push('CountrySubDivisionState');
    }
    else if (!this.subDivisions.length ) {
      nonMandatoryFeilds.push('CountrySubDivisionState');
    }
    if(this.mandatoryCountryCheck(this.defaultValue.country) == false && this.cityRegions.length) {
      nonMandatoryFeilds.push('CityRegion');
    }
    else if (!this.cityRegions.length) {
      nonMandatoryFeilds.push('CityRegion');
    }
    if (this.oppDataIsSimpleDeal) {
      nonMandatoryFeilds.push('AdvisorId');
    }
    if (this.orderOverviewObj.Authorization == true) {
      if (this.ContrcatSigned == false) {
        nonMandatoryFeilds.push('Wipro_ContractCurrency');
        nonMandatoryFeilds.push('SOWTCV');
        nonMandatoryFeilds.push('POAHolderId');
        this.orderOverviewObj.POAHolderId = null;
        this.defaultValue.POAName = '';
      }
      nonMandatoryFeilds.push('PurchaseOrderSignedDate');
      nonMandatoryFeilds.push('PurchaseOrderSigned');
    }

    if (this.orderOverviewObj.Authorization == false) {

      if (this.ContrcatSigned == false || (this.ContrcatSigned == true && this.poDetailsData.length > 0)) {
        nonMandatoryFeilds.push('Wipro_ContractCurrency');
        nonMandatoryFeilds.push('SOWTCV');
      }
      nonMandatoryFeilds.push('SOWSignedDate');
      nonMandatoryFeilds.push('SOWSigned');
      nonMandatoryFeilds.push('POAHolderId');
    }
    Object.keys(this.orderOverviewObj).map(key => {
      if (this.orderOverviewValid) {
        if (!nonMandatoryFeilds.includes(key)) {
          if (key == 'PurchaseOrderSignedDate' && this.orderOverviewObj.Authorization == false && this.ContrcatSigned == true && this.poDetailsData.length == 0) {
            this.orderOverviewValid = false;
            this.orderOverviewValidationValue.poDetails = true;
            this.nonValidKey = 'poDetails';
          }
          else if (this.orderOverviewObj[key] == null || this.orderOverviewObj[key] == undefined) {
            this.orderOverviewValid = false;
            console.log("nonValidKey", key);
            console.log("nonValidKeyData1", this.orderOverviewObj[key]);
            this.orderOverviewValidationValue[key] = true;
            this.nonValidKey = key;
          }
          else if (this.orderOverviewObj[key] === '') {
            this.orderOverviewValid = false;
            console.log("nonValidKey", key);
            console.log("nonValidKeyData2", this.orderOverviewObj[key]);
            this.orderOverviewValidationValue[key] = true;
            this.nonValidKey = key;
          }
        }
      }
    });
    return this.orderOverviewValid;
  }



  // call upload LOI details pop-up class
  LOIfiles = ["filename1", "filename2", "filename1", "filename2", "filename1", "filename2"];
  openUploadLOIPopup() {
    const dialogRef = this.dialog.open(UploadLOIPopup, {
      width: '550px',
      position: { top: '100px' },
      data: {
        signedDate: this.contractSignedDate ? this.contractSignedDate : '',
        startDate: this.projectStartDate ? this.projectStartDate : '',
        loiValue: this.loiValue,
        loiReceivedDate: this.loiReceivedDate,
        loiValidity: this.loiValidity,
        loiAttachedDocuments: this.loiAttachedDocuments
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      debugger;
      if (res) {
        this.loiAttachedDocuments = res.loiAttachedDocuments;
        this.loiValidity = res.loiValidity;
        this.loiReceivedDate = res.loiReceivedDate;
        this.loiValue = res.loiValue;
      }
    })
  }


  deleteLOIFile(fileDetails: any, index: any) {
    if (fileDetails.AttachmentId) {
      let body = {
        "ListOrderModificationAttachment": [
          {
            "StateCode": 1,
            "AttachmentId": fileDetails.AttachmentId
          }
        ]
      };

      this.service.loaderhome = true;
      this.orderService.deleteLOIAttachments(body).subscribe((res: any) => {
        if (res.ResponseObject) {
          this.loiAttachedDocuments.splice(index, 1);
        } else {
          this.projectService.displayerror('Oops!!! An error has occured in deleting file.');
        }
        this.service.loaderhome = false;

      }, err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      })
    } else {
      this.loiAttachedDocuments.splice(index, 1);
    }

  }



  // upload contract saurav starts  //



  openUploadContractPopup() {
    const dialogRef = this.dialog.open(UploadContractpopComponent, {
      width: '550px',
      position: { top: '100px' },
      data: this.UploadContract
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("fileres", res);
      if (res) {
        this.UploadContract = res
      }
    })
  }


  // delete contract attachments
  deleteContractattachments(fileDetails: any, index: any) {
    if (fileDetails.AttachmentId) {
      let payload = {
        "ListOrderModificationAttachment": [
          {
            "AttachmentId": fileDetails.AttachmentId,
            "StateCode": 1
          }
        ]
      };

      this.service.loaderhome = true;
      this.orderService.deleteAttachments(payload).subscribe((res: any) => {
        if (res.ResponseObject && res.IsError == false) {
          this.UploadContract.UploadContractFiles.splice(index, 1);
          this.projectService.displayMessageerror(' File Deleted Successfully');
        }
        else {
          this.projectService.displayMessageerror(' An error has occured in deleting file.');
        }
        this.service.loaderhome = false;

      }, err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      })
    } else {
      this.UploadContract.UploadContractFiles.splice(index, 1);
      this.projectService.displayMessageerror('File Deleted Successfully');
    }

  }

  //upload contract saurav end //



  openSubmitOrderPopup(popup) {
    this.saveBusinessSolution(true, popup);

  }


  // *********************** Order Overview ends here *************************** //




  openUploadSOWPopup() {
    const dialogRef = this.dialog.open(UploadSOWPopup, {
      width: '610px'
    });
  }

  openLinkActivityPopup() {
    const dialogRef = this.dialog.open(LinkActivityPopup, {
      width: '396px',
      data: 'TEST'
    });
  }


  approval_data = [
    {
      Initiatedon: "27-May-20", Initiatedby: "Pradeep Kumar", BFM: "Rahul Dudeja",
      Status: "Pending by BFM", Aging: "03 days", Actiondate: "27-May-20"
    },
    {
      Initiatedon: "21-May-20", Initiatedby: "Pradeep Kumar", BFM: "Ranjith Ravi",
      Status: "Foreclosed by DM", Aging: "03 days", Actiondate: "30-Jun-20"
    },
    {
      Initiatedon: "03-Jun-20", Initiatedby: "Anubhav Jain", BFM: "Kinshuk Bose",
      Status: "On-hold by BFM", Aging: "04 days", Actiondate: "07-Jun-20"
    },
    {
      Initiatedon: "27-May-20", Initiatedby: "Pradeep Kumar", BFM: "Rahul Dudeja",
      Status: "Approved by DM", Aging: "03 days", Actiondate: "27-May-20"
    }
  ]
  // service line tab starts here
  serviceline_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addserviceline() {
    this.serviceline_data.push(
      {
        "id": (this.serviceline_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deleteserviceline(id) {
    this.serviceline_data = this.serviceline_data.filter(x => x.id != id)
  }
  selectAll() {


    for (var i = 0; i < this.serviceline_data.length; i++) {
      this.serviceline_data[i].isCheccked = this.selectedAll;
    }
  }
  checkIfAllSelected(index) {

    var count = 0;
    for (var i = 0; i < this.serviceline_data.length; i++) {
      if (this.serviceline_data[i].isCheccked == true) {
        count++;
      }
      if (this.serviceline_data.length == count) {
        this.selectedAll = true;
      }
      else {
        this.selectedAll = false;
      }
    }
  }
  // service line tab ends here

  // IP tab starts here
  ip_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addip() {
    this.ip_data.push(
      {
        "id": (this.ip_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deleteip(id) {
    this.ip_data = this.ip_data.filter(x => x.id != id)
  }
  selectAllip() {


    for (var i = 0; i < this.ip_data.length; i++) {
      this.ip_data[i].isCheccked = this.selectedAllip;
    }
  }
  checkIfAllSelectedip(index) {

    var count = 0;
    for (var i = 0; i < this.ip_data.length; i++) {
      if (this.ip_data[i].isCheccked == true) {
        count++;
      }
      if (this.ip_data.length == count) {
        this.selectedAllip = true;
      }
      else {
        this.selectedAllip = false;
      }
    }
  }
  // IP tab ends here

  // solution tab starts here
  sol_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addsol() {
    this.sol_data.push(
      {
        "id": (this.sol_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deletesol(id) {
    this.sol_data = this.sol_data.filter(x => x.id != id)
  }
  selectAllsol() {


    for (var i = 0; i < this.sol_data.length; i++) {
      this.sol_data[i].isCheccked = this.selectedAllsol;
    }
  }
  checkIfAllSelectedsol(index) {

    var count = 0;
    for (var i = 0; i < this.sol_data.length; i++) {
      if (this.sol_data[i].isCheccked == true) {
        count++;
      }
      if (this.sol_data.length == count) {
        this.selectedAllsol = true;
      }
      else {
        this.selectedAllsol = false;
      }
    }
  }
  // solution tab ends here

  // credit tab starts here
  credit_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]


  selectAllcredit() {


    for (var i = 0; i < this.credit_data.length; i++) {
      this.credit_data[i].isCheccked = this.selectedAllcredit;
    }
  }
  checkIfAllSelectedcredit(index) {

    var count = 0;
    for (var i = 0; i < this.credit_data.length; i++) {
      if (this.credit_data[i].isCheccked == true) {
        count++;
      }
      if (this.credit_data.length == count) {
        this.selectedAllcredit = true;
      }
      else {
        this.selectedAllcredit = false;
      }
    }
  }
  // credit tab ends here


  deletserline() {
    const dialogRef = this.dialog.open(deleteserviceLine1,
      {
        width: '350px'
      });
  }

  deleteippopup() {
    debugger;
    const dialogRef = this.dialog.open(deleteIP1,
      {
        width: '350px'
      });
  }

}


// Upload Sow popup starts
@Component({
  selector: 'uploadsow-popup',
  templateUrl: './uploadsowpopup.html',
  styleUrls: ['./order.component.scss']
})
export class UploadSOWPopup {


  newArr = [{ name: '' }];
  wiproContactArray = [];

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadSOWPopup>,
    public router: Router,
    public projectService: OpportunitiesService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });
  }

  steptwo() {
    this.newArr.push({ name: '' });
  }

  deleteRow(index: number): void {
    this.newArr.splice(index, 1);
  }

  openUploaDocumentPopup() {
    const dialogRef = this.dialog.open(UploadDocumentPopup, {
      width: '610px'
    });
  }
}
// upload sow popup ends


// Upload document popup starts
@Component({
  selector: 'uploaddocument-popup',
  templateUrl: './uploaddocumentpopup.html',
  styleUrls: ['./order.component.scss']
})
export class UploadDocumentPopup {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  fileExtension: any;
  rawFile: any;

  constructor(public dialogRef: MatDialogRef<UploadDocumentPopup>, @Inject(MAT_DIALOG_DATA) public data: any, public service: DataCommunicationService,
    public projectService: OpportunitiesService) {
    this.options = { concurrency: 1, maxUploads: null };
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = this.humanizeBytes;
    this.reset();
  }

  reset() {
    this.files = [];
    this.service.filesList = [];
  }

  onUploadOutput(output: UploadOutput): void {
    console.log("uploader", output);
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: 'https://ngx-uploader.com/upload',
        method: 'POST',
        data: { foo: 'bar' }
      };
      this.uploadInput.emit(event);
    }

    else if (output.type === 'start') {

    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {

    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {

    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
      this.service.filesList = this.service.filesList.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {

    }
    else if (output.type === 'done') {
      this.service.loaderhome = true;
      try {
        let file = output.file.nativeFile;
        let fileExtension = (output.file.name) ? (output.file.name.split('.').pop()) : '';
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (file: any) => {
          let arrayBuffer: any = reader.result;
          let uint = new Uint8Array(arrayBuffer);
          let bytes = []
          for (let i = 0; i < 4; i++) {
            bytes.push(uint[i].toString(16))
          }
          let hex = bytes.join('').toUpperCase()
          hex = hex.slice(0, 4);
          console.log("hex", hex);

          if (fileExtension == "exe" || fileExtension == "lib" || fileExtension == "manifest" || hex == "4D5A") {

            this.projectService.displayMessageerror(fileExtension + " file is not allowed");
            this.service.filesList = [];
            this.files = [];
            this.rawFile = undefined;
          } else {
            output.file.sub = fileExtension;
            this.files[0] = output.file;
            this.service.filesList[0] = output.file;
            this.rawFile = output.file.nativeFile;
          }
          this.service.loaderhome = false;
        }
      } catch (e) {
        this.projectService.displayMessageerror("Error while uploading file");
        this.files = [];
        this.service.filesList = [];
        this.rawFile = undefined;
        this.service.loaderhome = false;
      }
    }
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
    let removeId = this.service.filesList[id].id;
    this.uploadInput.emit({ type: 'remove', id: removeId });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  onNoClick(): void {
    this.dialogRef.close({ rawFile: this.rawFile });
  }
  clickDisable() {
    this.projectService.uploadHidden = !this.projectService.uploadHidden;
    this.onNoClick();
  }

}
// Upload documents popup ends


// Link activity popup starts
@Component({
  selector: 'linkactivity-popup',
  templateUrl: './linkactivitypopup.html',
  styleUrls: ['./order.component.scss']
})
export class LinkActivityPopup {

  wiproContactArray = [];
  meetingname;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<LinkActivityPopup>,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService) { }
  ngOninit() {
    debugger
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectname(val) {
    this.projectService.uploadStatusChange(val);
  }
  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });
  }

}

// link activity popup ends

// Submit-Order popup starts

@Component({
  selector: 'submitorder-popup',
  templateUrl: './submitorderpopup.html',
  styleUrls: ['./order.component.scss']
})
export class SubmitOrderPopup implements OnInit {
  meetingname;
  BFM_Data = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private EncrDecr: EncrDecrService,
    public dialogRef: MatDialogRef<SubmitOrderPopup>,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService, public orderService: OrderService) {
    console.log('submitpopup ', this.data);
    if (this.data.status.WT) {
      let dmIdStr = { UserId: this.data.finanaceTeamForNonWt };
      if (data.activeDmTeamAccountDetails) {
        this.approvalPayload['DM'] = this.data.activeDmTeamAccountDetails.map(it => {
          return Object.assign({
            dmId: it.ApproverId,
            entity: 'sapdms'
          });
        });
      }
    }
  }

  ngOnInit() {
    if (this.data.finanaceTeamForNonWt.length == 1) {
      this.BFM_Data = this.data.finanaceTeamForNonWt[0].systemuserid;
      this.selectedValueofOrderApproval(this.BFM_Data, 'bfmId');
    }
   }
  onNoClick(): void {
    this.dialogRef.close();
  }


  //************************************Start Neha Code***************************************** */
  //this function is for submitting order approval of poup//
  confrirmOrderStatus: boolean = true;
  openOrderApprovalPopup() {
    if (!this.data.isconfirmOrderApproval) {
      if (this.data.opportunityData.ApprovalStageId == "3" || this.data.opportunityData.ApprovalStageId == "9" || this.data.opportunityData.ApprovalStageId == "10"
        || this.data.opportunityData.ApprovalStageId == "11" || this.data.opportunityData.ApprovalStageId == "12"
        || this.data.opportunityData.ApprovalStageId == "14" || this.data.opportunityData.ApprovalStageId == "184450003") {
        this.service.loaderhome = true;
        if (this.data.signedStatus == "Yes") {
          this.confrirmOrderStatus = false;
          let payload = {
            orderID: this.data.orderId,
            approvaltype: "Confirmed Order Approval",
            orderType: this.data.signedStatus == "Yes" ? "Clean Order" : 'OAR',
            isWT: this.data.status.WT ? 'Yes' : 'No',
            "BFM": {
              "bfmId": "",
              "entity": ""
            }
          }

          this.orderService.submitConfirmOrderApproval(payload).subscribe((resOfConfirmOrder: any) => {
            console.log("resOfConfirmOrder", resOfConfirmOrder);
            if (!resOfConfirmOrder.has_more) {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Confirmed order submitted successfully");
              this.projectService.setordersubmit(true);
              this.dialogRef.close();
            }
          },
            err => {
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            })
        } else {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please select contract as signed");
        }
      }
      if (this.data.opportunityData.ApprovalStageId == "15" || this.data.opportunityData.ApprovalStageId == "6" || this.data.opportunityData.ApprovalStageId == "5"
        || this.data.opportunityData.ApprovalStageId == "14" || this.data.opportunityData.ApprovalStageId == "4" || this.data.opportunityData.ApprovalStageId == "11") {
        this.service.loaderhome = true;
        let payload = this.approvalPayload;
        console.log("payload", payload);
        if (!this.approvalPayload.DM || this.approvalPayload.DM.length == 0) {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please select the delivery manager");

        }
        else if (!this.approvalPayload.BFM || Object.keys(this.approvalPayload.BFM).length <= 0) {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please select the BFM value");
        } else if ((!this.approvalPayload.DH || Object.keys(this.approvalPayload.DH).length <= 0) && (this.data.signedStatus !== "Yes")) {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please select the ADH/VDH/SDH");
        }
        else {
          if (this.data.status.WT) {
            this.service.loaderhome = false;
              if (this.data.flagWarning && this.data.signedStatus == "Yes") {
                this.UpdateOrderPendingWithContract();
              }
              if (this.data.tcvErrorMessage) {
              this.UpdateOrderPendingWithDealOwner();
            } else {
              this.submitOrderForApprovalCammunda();
            }
          } else {
            this.submitOrderForApprovalCammunda();
          }

        }
      }
    } else {
      if (!this.approvalPayload.BFM || Object.keys(this.approvalPayload.BFM).length <= 0) {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Please select the BFM value");
      } else {
        this.dialogRef.close({
          isconfirmOrderApproval: true,
          bfm: this.approvalPayload.BFM
        });
      }
    }
  }

  UpdateOrderPendingWithContract() {
    const body = {
      "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      "OrderId": this.data.orderId
    };
    this.orderService.UpdateOrderPendingWithContract(body).subscribe(res => {
      if (res && !res.IsError && res.ResponseObject) {
        this.projectService.displayMessageerror("Order updated for pending with contract")
        //this.submitOrderForApprovalCammunda(res.ResponseObject.ApprovalLogId);
      } else {
        this.projectService.displayMessageerror("Error occurred while updating order for pending contract");
      }
    },
      err => {
        this.projectService.displayMessageerror("Error occurred while updating order for pending contract");
      })
  }


  UpdateOrderPendingWithDealOwner() {
    const body = {
      "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      "OrderId": this.data.orderId
    };
    this.orderService.UpdateOrderPendingWithDealOwner(body).subscribe(res => {
      if (res && !res.IsError && res.ResponseObject) {
        this.submitOrderForApprovalCammunda(res.ResponseObject.ApprovalLogId);
      } else {
        this.projectService.displayMessageerror("Error occurred while updating order for deal owner");
      }
    },
      err => {
        this.projectService.displayMessageerror("Error occurred while updating order for deal owner");
      })
  }


  submitOrderForApprovalCammunda(ApprovalLogId?) {
    let payload = this.approvalPayload;
    if (this.data.tcvErrorMessage) {
      payload.tcvMismatch = "Yes";
    }
    payload.crmReferenceNumber = this.data.crmReferenceNumber;


    this.orderService.submitOrderApproval(payload).subscribe((submitOrderApprovalRes: any) => {
      console.log("submitOrderApprovalRes", submitOrderApprovalRes, payload)
      if (!submitOrderApprovalRes.has_more) {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Order submitted successfully for approval");
        this.projectService.setordersubmit(true);
        if (this.data.status.WT) {
          this.dialogRef.close({
            setWT: true
          });
        }
        else {
          this.dialogRef.close();
        }
      }
    },
      err => {
        if (this.data.status.WT && this.data.tcvErrorMessage) {
          const body = {
            Id: ApprovalLogId
          }
          this.orderService.DeleteOrderApprovalLog(body).subscribe(resData => {
            if (resData && !resData.IsError) {
              // do nothing as of now
            } else {
              this.projectService.displayMessageerror("An internal error occured");
            }
          },
            err => {
              this.projectService.displayMessageerror("An internal error occured");
            })
        }

        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });
  }



  inputIdObj = {
    dmId: '',
    bfmId: '',
    dhId: ''
  }

  approvalPayload: any = {
    orderID: this.data.orderId,
    approvaltype: this.data.approvaltype ? this.data.approvaltype : "Order Approval",
    orderType: this.data.signedStatus == "Yes" ? "Clean Order" : 'OAR',
    isWT: this.data.status.WT ? 'Yes' : 'No',
    "DM": [],
    "BFM": {},
    "DH": {}
  };

  selectedValueofOrderApproval(value, key) {
    this.inputIdObj[key] = value;

    console.log("invoice data", this.data);
    if (this.data.orderType == "approval") {
      if (key == 'dhId') {
        if (value == "") {
          this.approvalPayload.DH = {}
        } else {
          this.approvalPayload.DH = {
            "dhId": this.inputIdObj.dhId ? this.inputIdObj.dhId : null,
            "entity": 'sapdms',
          }
        }
      }
      else if (key == 'dmId') {
        if (value == "") {
          this.approvalPayload.DM = []
        } else {
          this.approvalPayload.DM = [{
            "dmId": this.inputIdObj.dmId ? this.inputIdObj.dmId : null,
            "entity": this.data.status.WT ? 'sapdms' : 'systemusers',
          }]
        }
      }
      else if (key == 'bfmId') {
        this.approvalPayload.BFM = {
          "bfmId": this.inputIdObj.bfmId ? this.inputIdObj.bfmId : null,
          "entity": this.data.status.WT ? 'teams' : 'systemusers',
          // "entity": this.data.status.WT ? 'teams' : this.data.opportunityData.IsDOPServiceLine ? 'teams' : 'systemusers',
        }
      }

      if (this.data.opportunityData.OrderTypeId == '184450006') {
        this.approvalPayload.approvaltype = 'Negative Amendment Approval';
      } else if (this.data.isAmendment) {
        this.approvalPayload.approvaltype = 'Amendment Approval';
      }

      console.log('payload', JSON.parse(JSON.stringify(this.approvalPayload)));

    }

  }
}

//************************************End Neha Code***************************************** */




// Submit-Order popup ends

// contract popup ends here
@Component({
  selector: 'contract-popup',
  templateUrl: './contractpopup.html',
  styleUrls: ['./order.component.scss']
})
export class ContractPopup {
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContractPopup>,
    @Inject(MAT_DIALOG_DATA) public data,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService) {
    console.log("contract popup data", data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// contract popup ends here

// podetails ends here
@Component({
  selector: 'podetails-popup',
  templateUrl: './podetailspopup.html',
  styleUrls: ['./order.component.scss']
})
export class poDetailspopup implements OnDestroy {
  popup_data = [];
  savePOdetails = [];
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  // negativeregex: any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  // positiveregex: any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  submitFlag = false;
  readOnlyFlag = false;
  signedMinDate = new Date(1945, 0, 1);
  signedMaxDate = new Date();
  deleteActionPerformed = false;
  acceptNegative: any;
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<poDetailspopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    private orderService: OrderService,
    public addIPservice: AddIpService) {
    this.readOnlyFlag = data.readOnly;
    this.dateValidation();
  }

  oninputOfPOValue(oldValue, event) {
    let sumOfPOValue = this.popup_data.map(item => item.POValue).reduce((a, c = 0) => { return parseFloat(a) + parseFloat(c) });
    const temp = sumOfPOValue ? parseFloat(sumOfPOValue).toFixed(2) : '';


    const regexstring = `^(\\d{0,12})(\\.\\d{0,2})?$`;
    const regex: RegExp = new RegExp(regexstring);


    if (!temp.match(regex)) {
      this.projectService.displayMessageerror("Max length of the Sum of all POs has to be 12 digits and 2 decimals");
    }
    // const tempVal = oldValue ? oldValue.toString() : '';
    // if (tempVal.length == 17) {
    //   return false;
    // }

    // if ((this.data.acceptNegative && event.charCode == 45 && !tempVal.includes('-')) || (event.charCode == 46 && !tempVal.includes('.')) || (event.charCode >= 48 && event.charCode <= 57)) {
    //   return true;
    // } else {
    //   return false;
    // }

    // let firstval: any = tempVal.substr(0, event.target.selectionStart)
    // let secondval: any = tempVal.substr(event.target.selectionStart)
    // let tempNewValue: any = firstval + event.key + secondval;
    // let newValue: any = this.data.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    // if (newValue) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  ngOnInit() {
    debugger;
    this.savePOdetails = this.data.poDetailsData.map((addColumn) => {
      return Object.assign({
        FrontEndID: Math.random().toString(36).substring(2),
        Wipro_POTableId: addColumn.Wipro_POTableId ? addColumn.Wipro_POTableId : null,
        Wipro_Remarks: addColumn.Wipro_Remarks ? addColumn.Wipro_Remarks : null,
        Wipro_Name: null,
        Wipro_PONumber: addColumn.Wipro_PONumber ? addColumn.Wipro_PONumber : null,
        Wipro_SignedDate: addColumn.Wipro_SignedDate ? new Date(addColumn.Wipro_SignedDate) : null,
        POValue: addColumn.POValue ? addColumn.POValue : null,
        Wipro_StartDate: addColumn.Wipro_StartDate ? new Date(addColumn.Wipro_StartDate) : '',
        Wipro_EndDate: addColumn.Wipro_EndDate ? new Date(addColumn.Wipro_EndDate) : '',
        Wipro_ValuewithoutTax: addColumn.Wipro_ValuewithoutTax ? addColumn.Wipro_ValuewithoutTax : '',
        Wipro_POIssuanceDate: addColumn.Wipro_POIssuanceDate ? new Date(addColumn.Wipro_POIssuanceDate) : '',
        POCurrency: addColumn.POCurrency ? addColumn.POCurrency : '',
        POCurrencyId: addColumn.POCurrencyId ? addColumn.POCurrencyId : '',
        selectedCurrencyObj: {
          Id: addColumn.POCurrencyId ? addColumn.POCurrencyId : '',
          Name: addColumn.POCurrency ? addColumn.POCurrency : '',
          Type: '',
          SysNumber: "",
          IsoCurrencyCode: ""
        },
      });
    });

    console.log(this.savePOdetails);

    this.popup_data = this.savePOdetails.map((it) => {
      return Object.assign({}, it);
    });
  }



  ngOnDestroy() {
    if (this.deleteActionPerformed) {
      this.dialogRef.close({
        "PODetails": this.popup_data.map((addColumn) => {
          let newColumn = Object.assign({}, addColumn);
          delete newColumn.FrontEndID;
          return newColumn;
        })
      });
    }
  }

  deletePoDetails(PODetailObj, i) {
    if (this.popup_data.length <= 1 && this.popup_data.some(it => it.FrontEndID == PODetailObj.FrontEndID)) {
      this.projectService.displayMessageerror("Single PO details can not deleted");
    }
    else {
      if (PODetailObj.Wipro_POTableId) {
        this.service.loaderhome = true;
        let payload = { Wipro_POTableId: PODetailObj.Wipro_POTableId, StateCode: 1 };
        this.orderService.deletePODetails(payload).subscribe((del: any) => {
          if (!del.IsError) {
            this.deleteActionPerformed = true;
            this.service.loaderhome = false;
            let index = this.savePOdetails.findIndex(it => it.Wipro_POTableId == PODetailObj.Wipro_POTableId);
            if (index >= 0) {
              this.savePOdetails.splice(index, 1);
            }
            this.popup_data.splice(i, 1);
            this.projectService.displayMessageerror("PO details deleted successfully");
          }
        }, err => {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror(err.status)
        });
      }
      else {
        let index = this.savePOdetails.findIndex(it => it.FrontEndID == PODetailObj.FrontEndID && !it.Wipro_POTableId);
        if (index >= 0) {
          this.savePOdetails.splice(index, 1);
        }
        this.popup_data.splice(i, 1);
        this.projectService.displayMessageerror("PO details deleted successfully");
      }
    }
  }

  addpopupbtn() {
    let newPODetails = {
      FrontEndID: Math.random().toString(36).substring(2),
      Wipro_POTableId: null,
      Wipro_Remarks: null,
      Wipro_Name: null,
      Wipro_PONumber: null,
      Wipro_SignedDate: null,
      POValue: null,
      POCurrency: this.data.currencyName ? this.data.currencyName : '',
      POCurrencyId: this.data.currencyId ? this.data.currencyId : '',
      selectedCurrencyObj: {
        Id: this.data.currencyId ? this.data.currencyId : '',
        Name: this.data.currencyName ? this.data.currencyName : '',
        Type: '',
        SysNumber: "",
        IsoCurrencyCode: ""
      },
      Wipro_StartDate: null,
      Wipro_EndDate: null,
      Wipro_POIssuanceDate: null,
      Wipro_ValuewithoutTax: null,      

    }
    this.popup_data.unshift(Object.assign({}, newPODetails));
  }
  diferentCurrenciesFlag = false;
  diferentAccountNumberFlag = false;

  savePODetailsFunc() {
    this.submitFlag = true;
    this.diferentCurrenciesFlag = false;
    console.log("dateee", this.popup_data[0].Wipro_StartDate)
    console.log("datee1", this.getIsoDateFormat(this.popup_data[0].Wipro_StartDate));
    // this.diferentAccountNumberFlag = false;
    let buildSavedDataArray = [];
    for (let i = 0; i < this.popup_data.length; i++) {
      if (!this.popup_data[i].Wipro_PONumber && !this.popup_data[i].Wipro_SignedDate && !this.popup_data[i].POCurrencyId && !this.popup_data[i].POValue) {
        this.projectService.displayMessageerror("Please enter the PO details");
        return;
      } else if (!this.popup_data[i].Wipro_PONumber) {
        this.projectService.displayMessageerror("Please enter the PO number");
        return;
      }else if (!this.popup_data[i].POValue) {
        this.projectService.displayMessageerror("Please enter the PO value");
        return;
      }else if (!this.popup_data[i].Wipro_StartDate) {
        this.projectService.displayMessageerror("Please enter the PO start date");
        return;
      }else if (!this.popup_data[i].Wipro_EndDate) {
        this.projectService.displayMessageerror("Please enter the PO end date");
        return;
      }else if (!this.popup_data[i].Wipro_ValuewithoutTax) {
        this.projectService.displayMessageerror("Please enter the PO value with tax");
        return;
      }else if (!this.popup_data[i].Wipro_POIssuanceDate) {
        this.projectService.displayMessageerror("Please enter the PO issuance date");
        return;
      }else if (!this.popup_data[i].Wipro_SignedDate) {
        this.projectService.displayMessageerror("Please enter the PO signed date");
        return;
      } else if (!this.popup_data[i].POCurrencyId) {
        this.projectService.displayMessageerror("Please enter the PO currency");
        return;
      }

      else if (this.popup_data.filter(it => it.Wipro_PONumber.trim() == this.popup_data[i].Wipro_PONumber.trim()).length > 1) {
        this.projectService.displayMessageerror("PO details with same PO number are not allowed");
        return;
      } else if (this.popup_data.filter(it => it.POCurrencyId == this.popup_data[i].POCurrencyId).length != this.popup_data.length) {
        this.diferentCurrenciesFlag = true;
        this.projectService.displayMessageerror("PO details with multiple currencies are not allowed");
        return;
      }

      else {
        let SaveOBJ = Object.assign({}, this.popup_data[i]);
        buildSavedDataArray.push(SaveOBJ);
      }
    }

    let sumOfPOValue = this.popup_data.map(item => item.POValue).reduce((a, c = 0) => { return parseFloat(a) + parseFloat(c) });
    const temp = sumOfPOValue ? parseFloat(sumOfPOValue).toFixed(2) : '';


    const regexstring = `^(-?\\d{0,11})(\\.\\d{0,2})?$`;
    const regex: RegExp = new RegExp(regexstring);


    if (!temp.match(regex)) {
      this.projectService.displayMessageerror("Max length of the Sum of all POs has to be 11 digits and 2 decimals");
      return;
    }

    for (let savearr = 0; savearr < buildSavedDataArray.length; savearr++) {
      let index = this.savePOdetails.findIndex(it => it.FrontEndID == buildSavedDataArray[savearr].FrontEndID);
      if (index >= 0) {
        this.savePOdetails[index] = Object.assign({}, buildSavedDataArray[savearr]);
      } else {
        this.savePOdetails.push(Object.assign({}, buildSavedDataArray[savearr]));
      }
    }


    this.submitFlag = false;
    this.dialogRef.close({

      "PODetails": this.popup_data.map((addColumn) => {
        let newColumn = Object.assign({}, addColumn);
        delete newColumn.FrontEndID;
        return newColumn;
      })
    });
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
    this.signedMaxDate = new Date();
  }

  getIsoDateFormat(date) {
    const getDate = new Date(date);
    const setDate = new Date(
      getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000)
    );
    return setDate.toISOString();
  }



  CurrencydataHeader = { name: 'Name', Id: 'Id' };
  selectedCurrencyObj: any = { Id: "", Name: "", Type: '', SysNumber: "", IsoCurrencyCode: "" };
  currencyCodeArr: any = [];
  lookupdata: any = {};
  pageSize = 10;
  defaultpageNumber = 1;
  OdatanextLink = null;
  totalRecordCount = 0;
  isSearchLoader = false;
  disableOnRoleOverwiew = true;
  defaultCurrency: any;
  currencyId: any;
 
  selectedValueCurrency(selectedData, podetl) {
    console.log("selectedDataSAP", selectedData);
    this.OdatanextLink = null;
    podetl.POCurrency = selectedData.Name;
    podetl.POCurrencyId = selectedData.Id;
    podetl.selectedCurrencyObj = Object.assign({}, selectedData);
    console.log(this.popup_data);
  }



  openadvanceOverViewSearch(controlName, lookUpDD, selecteddata, value, poindex) {
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


    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      console.log(x)
      if (x.action == 'loadMore') {
        console.log("loadMore", x);
        if (controlName == 'Currency') {
          this.getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'Currency') {
          this.getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'Currency') {
        this.OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, result, poindex);
      }
     });

  }

  getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }



  OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, emittedevt, poindex) {
    this.OdatanextLink = null;
    debugger;
    if (emittedevt) {

      let temp = this.popup_data[poindex];
      temp.selectedCurrencyObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
      temp.POCurrencyId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      temp.POCurrency = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";

    } else {
      if (this.selectedCurrencyObj.Name != this.defaultCurrency || this.selectedCurrencyObj.Id != this.currencyId) {
        this.defaultCurrency = "";
        this.currencyId = "";
        this.selectedCurrencyObj = { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
      }
    }

  }

  getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  advanceLookUpSearch(lookUpData, index) {
    let selecteddata = [];
    console.log("open", lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'Currency': {
        selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
        this.openadvanceOverViewSearch('Currency', this.currencyCodeArr, selecteddata, lookUpData.inputVal, index);
        return
      }
    }
  }



  currencyCode(data) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.currencyCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.currencyCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }





  /******************autocomplete code end ****************** */


}
// podetails ends here

// request popup starts from here

@Component({
  selector: 'request-popup',
  templateUrl: './requestforclosure.html',
  styleUrls: ['./order.component.scss']
})
export class Requestpopup {
  foreClosureReason: any = "";
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<Requestpopup>, public orderService: OrderService, public projectService: OpportunitiesService,
    public service: DataCommunicationService, public router: Router, private EncrDecr: EncrDecrService,
  ) {
    if (this.data.status.WT) {

      let dmIdStr = { UserId: this.data.finanaceTeamForNonWt };
      this.approvalPayload['DM'] = this.data.activeDmTeamAccountDetails.map(it => {
        return Object.assign({
          dmId: it.ApproverId,
          entity: 'sapdms'
        });
      });
    }
    console.log("data", this.data)
  }
  approvalPayload: any = {
    orderID: this.data.opportunityData.OrderBookingId,
    approvaltype: "Order Foreclosure",
    reasonForForeclosure: "",
    orderType: 'OAR',
    isWT: this.data.status.WT ? 'Yes' : 'No',
    "DM": [],
  };
  openOrderApprovalPopup() {
    this.approvalPayload.reasonForForeclosure = this.foreClosureReason
    this.service.loaderhome = true;
    console.log("Helllo everyone");
    let payload = this.approvalPayload;
    if (this.data.signedStatus == "No") {
      if (!this.approvalPayload.DM || this.approvalPayload.DM.length == 0) {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Please select the Delivery manager");

      } else if (this.foreClosureReason == "") {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Please provide the Reason for foreclosure");
      }
      else {
        this.orderService.submitForeclosureRequest(payload).subscribe((submitForeClosureRequest: any) => {
          console.log("submitForeClosureRequest", submitForeClosureRequest)
          if (!submitForeClosureRequest.has_more) {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror("Initiate foreclosure successfully");
            this.dialogRef.close();
          }
        },
          err => {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror(err.message);
          })
      }
    } else {
      this.projectService.displayMessageerror("Please select contract as Signed");
    }
  }
  inputIdObj = {
    dmId: '',
    bfmId: '',
    dhId: ''
  }


  selectedValueofOrderApproval(value, key) {
    this.inputIdObj[key] = value;
    console.log("invoice data", this.data);
    if (this.data.orderType == "foreclosure") {
      if (key == 'dmId') {
        this.approvalPayload.DM = [{
          "dmId": this.inputIdObj.dmId ? this.inputIdObj.dmId : null,
          "entity": this.data.status.WT ? 'sapdms' : 'systemusers',

        }]
      }

    }


  }
  onNoClick(): void {
    console.log("request pop ")
    this.dialogRef.close();
  }
}

// request popup ends here

// requestinvoce popup starts from here.

@Component({
  selector: 'requestinvoice-popup',
  templateUrl: './requestinvoice.html',
  styleUrls: ['./order.component.scss']
})
export class Requestinvoicepopup {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data, public orderService: OrderService,
    public dialogRef: MatDialogRef<Requestinvoicepopup>,
    public service: DataCommunicationService, public projectService: OpportunitiesService
  ) {
    console.log("invoice popup", this.data)
  }
  inputIdObj = {
    dmId: '',
    bfmId: '',
    dhId: ''
  }
  approvalPayload: any = {
    orderID: this.data.opportunityData.OrderBookingId,
    approvaltype: "Invoicing Approval",
    orderType: 'OAR',
    isWT: this.data.status.WT ? 'Yes' : 'No',
    "BFM": {},
  };
  openOrderApprovalPopup() {
    console.log("Helllo everyone");
    const payload = this.approvalPayload;
    this.service.loaderhome = true;
    if (this.data.signedStatus == "No") {
      if (!this.approvalPayload.BFM || Object.keys(this.approvalPayload.BFM).length <= 0) {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Please select the BFM value");
      } else {
        this.orderService.submitInvoiceRequest(payload).subscribe((invoiceRes: any) => {
          console.log("invoiceRes", invoiceRes)
          if (!invoiceRes.has_more) {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror("Invoicing Request initiated successfully");
            this.dialogRef.close();
          }
        },
          err => {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror(err.message);
          })
      }
    } else {
      this.projectService.displayMessageerror("Please select contract as Signed");
    }

  }


  selectedValueofOrderApproval(value, key) {
    this.inputIdObj[key] = value;
    console.log("invoice data", this.data);
    if (this.data.orderType == "invoice") {
      if (key == 'bfmId') {
        this.approvalPayload.BFM = {
          "bfmId": this.inputIdObj.bfmId ? this.inputIdObj.bfmId : null,
          // "entity": this.data.status.WT ? 'teams' : 'systemusers',
          "entity": 'systemusers',
        }
      }
      console.log('payload', JSON.parse(JSON.stringify(this.approvalPayload)));
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

// requestinvoice popup ends here.

// Order-Approval popup starts

@Component({
  selector: 'orderapproval-popup',
  templateUrl: './orderapprovalpopup.html',
  styleUrls: ['./order.component.scss']
})
export class OrderApprovalPopup {

  orderstatus;
  constructor(public dialogRef: MatDialogRef<OrderApprovalPopup>,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    public router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  orderStatus() {
    this.projectService.orderstatus = true;
    this.projectService.editProject = true;
    this.onNoClick();
  }
}

// Order-Approval popup ends


// re-submission order popup starts

@Component({
  selector: 'resumbissionorder-popup',
  templateUrl: './resubmissionorder-popup.html',
  styleUrls: ['./order.component.scss']
})
export class ReSubmissionOrderPopup {
  BFM_Data = '';
  constructor(public dialogRef: MatDialogRef<ReSubmissionOrderPopup>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    public router: Router) {
    console.log('resubmitpopup ', this.data);
    if (this.data.status.WT) {
      let dmIdStr = { UserId: this.data.finanaceTeamForNonWt };
      if (data.activeDmTeamAccountDetails) {
        this.approvalPayload['DM'] = this.data.activeDmTeamAccountDetails.map(it => {
          return Object.assign({
            dmId: it.ApproverId,
            entity: 'sapdms'
          });
        });
      }
    }
  }

  reSubmissionReason = "";

  ngOnInit() {
    if (this.data.finanaceTeamForNonWt.length == 1) {
      this.BFM_Data = this.data.finanaceTeamForNonWt[0].systemuserid;
      this.selectedValueofOrderApproval(this.BFM_Data, 'bfmId');
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(flag) { 
     if (this.data.showBFM && (!this.approvalPayload.BFM || Object.keys(this.approvalPayload.BFM).length <= 0)) {
      this.service.loaderhome = false;
      this.projectService.displayMessageerror("Please select the BFM value");
      return;
    } else if (this.data.showDH && (!this.approvalPayload.DH || Object.keys(this.approvalPayload.DH).length <= 0) && (this.data.signedStatus !== "Yes")) {
      this.service.loaderhome = false;
      this.projectService.displayMessageerror("Please select the ADH/VDH/SDH");
      return;
    }
    if (flag == "YES") {
      let returnObj = {
        flag: flag,
        reason: this.reSubmissionReason,
        submitObj: this.approvalPayload
      }
      if (returnObj.reason && returnObj.reason.trim() != '') {
        this.dialogRef.close(returnObj);
      }
    } else
      this.dialogRef.close();
  }
  inputIdObj = {
    dmId: '',
    bfmId: '',
    dhId: ''
  }

  approvalPayload: any = {
    orderID: this.data.orderId,
    approvaltype: this.data.approvaltype ? this.data.approvaltype : "Order Approval",
    orderType: this.data.signedStatus == "Yes" ? "Clean Order" : 'OAR',
    isWT: this.data.status.WT ? 'Yes' : 'No',
    "DM": [],
    "BFM": {},
    "DH": {}
  };

  selectedValueofOrderApproval(value, key) {
    this.inputIdObj[key] = value;

    console.log("invoice data", this.data);
    if (this.data.orderType == "approval") {
      if (key == 'dhId') {
        if (value == "") {
          this.approvalPayload.DH = {}
        } else {
          this.approvalPayload.DH = {
            "dhId": this.inputIdObj.dhId ? this.inputIdObj.dhId : null,
            "entity": 'sapdms',
          }
        }
      }
      else if (key == 'dmId') {
        if (value == "") {
          this.approvalPayload.DM = []
        } else {
          this.approvalPayload.DM = [{
            "dmId": this.inputIdObj.dmId ? this.inputIdObj.dmId : null,
            "entity": this.data.status.WT ? 'sapdms' : 'systemusers',
          }]
        }
      }
      else if (key == 'bfmId') {
        this.approvalPayload.BFM = {
          "bfmId": this.inputIdObj.bfmId ? this.inputIdObj.bfmId : null,
          "entity": this.data.status.WT ? 'teams' : 'systemusers',
          // "entity": this.data.status.WT ? 'teams' : this.data.opportunityData.IsDOPServiceLine ? 'teams' : 'systemusers',
        }
      }

      if (this.data.opportunityData.OrderTypeId == '184450006') {
        this.approvalPayload.approvaltype = 'Negative Amendment Approval';
      } else if (this.data.isAmendment) {
        this.approvalPayload.approvaltype = 'Amendment Approval';
      }

      console.log('payload', JSON.parse(JSON.stringify(this.approvalPayload)));

    }

  }
}
// upload-LOI popup starts

@Component({
  selector: 'uploadLOI-popup',
  templateUrl: './uploadLOI.html',
  styleUrls: ['./order.component.scss']
})
export class UploadLOIPopup {

  @ViewChild('onlyNumber') private onlyNumber: ElementRef;

  dataHeader: any;
  currencyCodeArr: any = [];
  currentDate = new Date();
  rawFile: any;
  letterofIntentDetails = {
    SalesOrderId: '',
    AttachmentId: null,
    Wipro_LetterofIntentReceivedDate: '',
    Wipro_ExpectedSOWDate: '',
    Wipro_RevenueAccrueableValue: '',
    Wipro_LetterofIntentCurrency: '',
    Wipro_OARFlag: false,
    LOIAttachment: {
      UploadFileName: '',
      UploadedUrl: '',
      UniqueKey: ''
    }
  }

  CurrencydataHeader = { name: 'Name', Id: 'Id' };
  selectedCurrencyObj: any = { Id: "", Name: "", Type: '', SysNumber: "", IsoCurrencyCode: "" };

  lookupdata: any = {};
  pageSize = 10;
  defaultpageNumber = 1;
  OdatanextLink = null;
  totalRecordCount = 0;
  isSearchLoader = false;
  disableOnRoleOverwiew = true;
  defaultCurrency: any;
  currencyId: any;
  signedMinDate = new Date();
  signedMaxDate = new Date();
  receivedSigneMaxDate = new Date();
  receivedSigneMinDate = new Date(1945, 0, 1);
  getDateFromOrder: Date;
  oppData: any;


  public loiValue;
  public receivedDate;
  public loiValidity;
  public attachmentDocs = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadLOIPopup>,
    public router: Router,
    public projectService: OpportunitiesService,
    private el: ElementRef,
    private fileService: FileUploadService,
    private orderService: OrderService,
    public addIPservice: AddIpService,
    public service: DataCommunicationService) {
    debugger;
    if (data) {
      this.loiValue = data.loiValue ? (+data.loiValue).toFixed(2) : '';
      this.receivedDate = data.loiReceivedDate;
      this.loiValidity = data.loiValidity;
      this.attachmentDocs = JSON.parse(JSON.stringify(data.loiAttachedDocuments));
    }


  }

  
  

  // inputClicked(event) {
  //   console.log(event, "\n", "File names", event.target.files.length)
  //    let file: File = event.target.files;
  //    const fd: FormData = new FormData();
  //       fd.append('file', file);
  //   let uploadingSameFile = false;
  //   for (var i = 0; i < event.target.files.length; i++) {
  //     if (this.attachmentDocs.filter(res => res.UploadFileName == event.target.files[i].name).length == 0) {
  //       this.saveFiletoRepo(fd,length);
  //     } else {
  //       uploadingSameFile = true;
  //     }

  //   }
  //   if (uploadingSameFile) {
  //     this.projectService.displayMessageerror('Same files cannot be uploaded. Please delete and try again');
  //   }
  //   // upload the files to blob and 
  //   console.log("Files : ", this.attachmentDocs)
  // }

  oninputOfLOIValue(value, event) {
    if ((event.charCode == 46 && !value.includes('.')) || (event.charCode >= 48 && event.charCode <= 57)) {
      return true;
    } else {
      return false;
    }
  }
//saurav loi code starts 

saveFileTOBlo(evt) {
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
          if (fileExtension == "exe" || fileExtension == "lib" || fileExtension == "manifest" || hex == "4D5A") {
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
  
  saveFiletoRepo(filedetails: any,file,index,length) {
    let fileToUpload = [];
    fileToUpload.push(filedetails)
    this.service.loaderhome = true;
    this.fileService.filesToUploadDocument64(fileToUpload).subscribe((res: any) => {
       let SeqLoiName = res[0].ResponseObject.Name;
      let UploadFileName =file.name;
      if (res) {
        let resLoiName = {
           DownloadFileName : SeqLoiName
        }
        let fileDetails = {
          UploadFileName: UploadFileName,
          UploadedUrl:res[0].ResponseObject.Url,
          UniqueKey: FileUpload.letterOfIntent,
          AttachmentId: null,
          StateCode: 0
        }
        console.log("sauLOI", res);
        this.attachmentDocs.push(Object.assign({}, fileDetails ,resLoiName));
         let length = this.attachmentDocs.length - 1;
        // let count = 0;
        for (var i = 0; i <= length; i++) {
          for (var j = i + 1; j <= length; j++) {
            if (this.attachmentDocs[i].UploadFileName === this.attachmentDocs[j].UploadFileName) {
              this.attachmentDocs.splice(j, 1);
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
   console.log("sdsdf",this.attachmentDocs[i].DownloadFileName);
   let arr = [
     {
       "Name" : this.attachmentDocs[i].DownloadFileName
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

//saurav loi code starts 

  deleteFile(fileDetails: any, index: any) { //loi delete
    if (fileDetails.AttachmentId) {
      let body = {
        "ListOrderModificationAttachment": [
          {
            "StateCode": 1,
            "AttachmentId": fileDetails.AttachmentId
          }
        ]
      };

      this.service.loaderhome = true;
      this.orderService.deleteLOIAttachments(body).subscribe((res: any) => {
        if (res.ResponseObject) {
          this.attachmentDocs.splice(index, 1);
        } else {
          this.projectService.displayerror('Oops!!! An error has occured in deleting file.');
        }
        this.service.loaderhome = false;

      }, err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      })
    } else {
      this.attachmentDocs.splice(index, 1);
    }

  }

  saveLOI() {
    if (this.loiValue && this.loiValidity == '') {

      this.projectService.displayMessageerror("Please mention LOI/LOE validity date");
    } else {
      if (this.attachmentDocs && this.attachmentDocs.length > 0) {
        if (this.loiValue) {
          this.dialogRef.close({
            loiValue: this.loiValue,
            loiReceivedDate: this.receivedDate,
            loiValidity: this.loiValidity,
            loiAttachedDocuments: this.attachmentDocs
          });
        } else {
          this.projectService.displayMessageerror('Please enter the mandatory fields');
        }
      } else {
        this.dialogRef.close({
          loiValue: this.loiValue,
          loiReceivedDate: this.receivedDate,
          loiValidity: this.loiValidity,
          loiAttachedDocuments: [],
        });
      }
    }
  }

  onValueBlur(evt) {
    let tempvalue: any = evt.target.value.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    let tempdecimalVal: any = tempvalue ? parseFloat(tempvalue[0]).toFixed(2).toString() : "";
    this.letterofIntentDetails.Wipro_RevenueAccrueableValue = tempdecimalVal;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedValueCurrency(selectedData) {
    console.log("selectedDataSAP", selectedData);
    this.OdatanextLink = null;
    this.defaultCurrency = selectedData.Name;
    this.currencyId = selectedData.Id;
    this.selectedCurrencyObj = Object.assign({}, selectedData);
    this.getLOIInput(selectedData.SysGuid, 'Wipro_LetterofIntentCurrency', 'Id');
  }

  getLOIInput(evt, key, type?) {
    if (type === 'date') {
      this.letterofIntentDetails[key] = this.getIsoDateFormat(evt.value._d);
    } else {
      this.letterofIntentDetails[key] = evt;
    }
  }

  openadvanceOverViewSearch(controlName, lookUpDD, selecteddata, value) {
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


    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      console.log(x)
      if (x.action == 'loadMore') {
        console.log("loadMore", x);
        if (controlName == 'Currency') {
          this.getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, x);
        }
      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'Currency') {
          this.getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, x);
        }
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'Currency') {
        this.OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, result);
      }
    });

  }





  getCurrencyDataPushToLookUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = emittedevt.currentPage;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata.push.apply(this.lookupdata.tabledata, (res && res.ResponseObject) ? res.ResponseObject : [])
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }



  OnCloseOfCurrencyPopUp(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.OdatanextLink = null;
    if (emittedevt) {

      this.defaultCurrency = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      this.currencyId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Id : "";
      this.selectedCurrencyObj = (emittedevt.selectedData.length > 0) ? Object.assign(emittedevt.selectedData[0]) : { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
      this.getLOIInput(this.currencyId, 'Wipro_LetterofIntentCurrency', 'Id');

    } else {
      if (this.selectedCurrencyObj.Name != this.defaultCurrency || this.selectedCurrencyObj.Id != this.currencyId) {
        this.defaultCurrency = "";
        this.currencyId = "";
        this.selectedCurrencyObj = { Id: "", Name: "", Type: "", SysNumber: "", IsoCurrencyCode: "" };
        this.getLOIInput(this.currencyId, 'Wipro_LetterofIntentCurrency', 'Id');
      }
    }

  }

  getCurrencyOnsearch(controlName, lookUpDD, selecteddata, value, emittedevt) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.lookupdata.pageNo = this.defaultpageNumber;
      this.lookupdata.TotalRecordCount = this.totalRecordCount;
      this.lookupdata.nextLink = this.OdatanextLink;
      this.lookupdata.tabledata = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.lookupdata.isLoader = false;
      this.isSearchLoader = false;
    },
      err => {
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = null;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
        this.isSearchLoader = false;
      });
  }

  advanceLookUpSearch(lookUpData) {
    let selecteddata = [];
    console.log("open", lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'Currency': {
        selecteddata = (Object.keys(lookUpData.selectedData).length > 0) ? (lookUpData.selectedData.Id ? new Array(lookUpData.selectedData) : []) : [];
        this.openadvanceOverViewSearch('Currency', this.currencyCodeArr, selecteddata, lookUpData.inputVal);
        return
      }
    }
  }



  currencyCode(data) {
    this.isSearchLoader = true;
    this.addIPservice.getCurrencyDetailsOrder(data.searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.currencyCodeArr = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      this.isSearchLoader = false;
    },
      err => {
        this.currencyCodeArr = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
        this.isSearchLoader = false;
      });
  }

  getIsoDateFormat(date) {
    const getDate = new Date(date);
    const setDate = new Date(getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000));
    return setDate.toISOString();
  }

  openUploaDocumentPopup() {
    console.log("save loi");
    console.log({
      loiValue: this.loiValue,
      receivedDate: this.receivedDate,
      loiValidity: this.loiValidity,
      attachmentDocs: this.attachmentDocs
    })

  }

  // LOI validations
  LOIvalidation() {
    let loiUploadValid = true;
    let nonMandatoryFeilds = ['SalesOrderId', 'Wipro_OARFlag', 'UniqueKey', 'UploadedUrl', 'UploadFileName', 'AttachmentId'];
    Object.keys(this.letterofIntentDetails).map(loikey => {
      if (!nonMandatoryFeilds.includes(loikey)) {
        if (loiUploadValid) {
          if (this.letterofIntentDetails[loikey] === '') {
            loiUploadValid = false;
            console.log(loikey);
          }
          if (loikey === 'LOIAttachment') {
            Object.keys(this.letterofIntentDetails[loikey]).map(LOIAttachmentKey => {
              if (!nonMandatoryFeilds.includes(LOIAttachmentKey)) {
                if (this.letterofIntentDetails[loikey][LOIAttachmentKey] === '') {
                  loiUploadValid = false;
                }
              }
            });
          }
        }
      }
    })
    return loiUploadValid;
  }

}

@Component({
  selector: 'orderservicelinepopup',
  templateUrl: './orderserviceline-popup.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderOpenServiceline {
  @ViewChild('mySLCloudForm') public userSLCloudFrm: NgForm;
  maxlengthValue: number = 17;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  // negativeregex: any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  // positiveregex: any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  acceptNegative = false;
  type = '';
  CurrencySymbol = 'NA';
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  cloudSLData: any[] = [];
  savedcloudSLData: any[] = [];
  opportunityName = "";
  SLTCV = '0.00';
  WTFlag: boolean = false;
  disableOnRoleBSSL: boolean = false;
  cloudTCV: any = "0.00";
  clouddirtyflag = false;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OrderOpenServiceline>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService, public orderService: OrderService,
    public service: DataCommunicationService) { }

  ngOnInit() {
    this.type = this.data.type ? this.data.type : '';
    debugger;
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.CurrencySymbol = (this.data.currencySymbol ? this.data.currencySymbol : 'NA');
    this.acceptNegative = (this.data.acceptNegative ? this.data.acceptNegative : false);
    this.SLTCV = this.data.Details.WiproEstsltcv ? this.data.Details.WiproEstsltcv : "0.00";
    this.WTFlag = this.data.WTFlag;
    this.disableOnRoleBSSL = this.data.disableOnRoleBSSL;
    this.savedcloudSLData = this.data.Details.AdditionalServiceLinesCloudDetails.map((addColumn) => {
      let newColumn = Object.assign({}, addColumn);
      newColumn.FrontEndID = Math.random().toString(36).substring(2);
      return newColumn;
    });
    this.cloudSLData = this.savedcloudSLData.filter(cloud => cloud.CloudStatecode != 1).map((it) => {
      this.cloudTCV = ((this.cloudTCV ? parseFloat(this.cloudTCV) : 0) + (it.Value ? parseFloat(it.Value) : 0)).toFixed(2);
      return Object.assign({}, it)
    });
    console.log("dataSLClouddetails", this.cloudSLData);
    console.log("dataSLCloud", this.data);
    console.log("OPPNAme", this.opportunityName);
    this.getAllDropDownData();
  }

  getAllDropDownData() {
    //Drop Down API call
    this.projectService.getFunction().subscribe(FunctionData => {
      if (!FunctionData.IsError) {
        this.FunctionList = FunctionData.ResponseObject;
        console.log("Function", this.FunctionList);
      }
      else {
        this.projectService.displayMessageerror(FunctionData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })
    this.projectService.getCategory().subscribe(CategoryData => {
      if (!CategoryData.IsError) {
        this.CategoryList = CategoryData.ResponseObject;
        console.log("CategoryList", this.CategoryList);
      }
      else {
        this.projectService.displayMessageerror(CategoryData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })


    this.projectService.getServiceProvider().subscribe(ServiceProviderData => {
      if (!ServiceProviderData.IsError) {
        this.ServiceProviderList = ServiceProviderData.ResponseObject;
        console.log("ServiceProviderList", this.ServiceProviderList);
      }
      else {
        this.projectService.displayMessageerror(ServiceProviderData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })
    this.projectService.getTechnology().subscribe(TechnologyData => {
      if (!TechnologyData.IsError) {
        this.TechnologyList = TechnologyData.ResponseObject;
        console.log("TechnologyList", this.TechnologyList);
      }
      else {
        this.projectService.displayMessageerror(TechnologyData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })

  }

  setSLCloudName(fieldname, selectedId, i) {
    if (fieldname == 'function') {
      let functionSelect: any = this.FunctionList.filter(it => it.Id == selectedId);
      this.cloudSLData[i].Function = (functionSelect.length > 0) ? functionSelect[0].Name : "";
    } else if (fieldname == 'category') {
      let categorySelect: any = this.CategoryList.filter(it => it.Id == selectedId);
      this.cloudSLData[i].Category = (categorySelect.length > 0) ? categorySelect[0].Name : "";
    }
    else if (fieldname == 'service') {
      let serviceSelect: any = this.ServiceProviderList.filter(it => it.Id == selectedId);
      this.cloudSLData[i].ServiceProvider = (serviceSelect.length > 0) ? serviceSelect[0].Name : "";
    }
    else if (fieldname == 'technology') {
      let technologySelect: any = this.TechnologyList.filter(it => it.Id == selectedId);
      this.cloudSLData[i].Technology = (technologySelect.length > 0) ? technologySelect[0].Name : "";
    }

  }

  addServiceLineCloud() {
    this.cloudSLData.unshift(
      {
        FrontEndID: Math.random().toString(36).substring(2),
        CategoryId: "",
        Functionid: "",
        Remarks: "",
        ServiceProviderId: "",
        WiproRemarks: "",
        WiproServiceprovider: "",
        TechnologyId: "",
        Value: "",
        CloudDetailsID: "",
        OrderCloudDetailsId: "",
        OpenSource: false,
        CloudStatecode: 0,
        Function: "",
        Category: "",
        ServiceProvider: "",
        Technology: "",
        Name: "",
        cloudtype: 1
      }
    );
  }

  deletecompetitor(cloudData, i) {
    const dialogRef = this.dialog.open(OpenipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true){
    this.userSLCloudFrm.form.markAsDirty();
    if (cloudData.CloudDetailsID || cloudData.OrderCloudDetailsId) {
      let index = this.savedcloudSLData.findIndex(it => it.FrontEndID == cloudData.FrontEndID);
      this.cloudSLData.splice(i, 1);
      if (index >= 0) {
        this.savedcloudSLData[index].CloudStatecode = 1;
      }
      let typetext = this.type == 'order' ? 'order' : 'modification';
      this.projectService.displayMessageerror("Data added for deletion successfully, please save the "+typetext);
    } else {
      let index = this.savedcloudSLData.findIndex(it => it.FrontEndID == cloudData.FrontEndID && !it.CloudDetailsID);
      this.cloudSLData.splice(i, 1);
      if (index >= 0) {
        this.savedcloudSLData.splice(index, 1);
      }
      this.projectService.displayMessageerror("Data deleted successfully");
    }

    let sumofValue: any = this.cloudSLData.reduce((prevVal, elem) => {
      let val: any = this.acceptNegative ? (elem.Value.toString()).match(this.negativeregex) : (elem.Value.toString()).match(this.positiveregex);
      return prevVal + (val && val.length > 0 && val[0] && !this.isNaNCheck(val[0]) ? parseFloat(val[0]) : 0);
    }, 0);
    this.cloudTCV = sumofValue;
  }
})
  }


  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  oninputOfValue(clouddata, i, event) {
    let firstval: any = clouddata.Value.substr(0, event.target.selectionStart)
    let secondval: any = clouddata.Value.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  onValueBlur(clouddata, newValue, i) {
    let tempvalue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    let tempdecimalVal: any = tempvalue && tempvalue.length > 0 && tempvalue[0] && !this.isNaNCheck(tempvalue[0]) ? parseFloat(tempvalue[0]).toFixed(2).toString() : "";
    this.cloudSLData[i].Value = tempdecimalVal;
    let sumofValue: any = this.cloudSLData.reduce((prevVal, elem) => {
      let val: any = this.acceptNegative ? (elem.Value.toString()).match(this.negativeregex) : (elem.Value.toString()).match(this.positiveregex);
      return prevVal + (val && val.length > 0 && val[0] && !this.isNaNCheck(val[0]) ? parseFloat(val[0]) : 0);
    }, 0);

    if (sumofValue > parseFloat(this.SLTCV)) {
      this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value");
      this.cloudSLData[i].Value = "";
      let sumofValue: any = this.cloudSLData.reduce((prevVal, elem) => {
        let val: any = this.acceptNegative ? (elem.Value.toString()).match(this.negativeregex) : (elem.Value.toString()).match(this.positiveregex);
        return prevVal + (val && val.length > 0 && val[0] && !this.isNaNCheck(val[0]) ? parseFloat(val[0]) : 0);
      }, 0);
      this.cloudTCV = sumofValue ? parseFloat(sumofValue).toFixed(2) : '0.00';
    } else {
      this.cloudTCV = sumofValue ? parseFloat(sumofValue).toFixed(2) : '0.00';
      if (this.cloudSLData[i].Value == '0.00') {
        this.cloudSLData[i].Value = "";
        if (this.acceptNegative == false) {
          this.projectService.displayMessageerror("Value provided in " + this.converIndextoString(i) + " row of service line cloud should be greater than 0");
        } else {
          this.projectService.displayMessageerror("Value provided in " + this.converIndextoString(i) + " row of service line cloud should not be equal to 0");
        }

      }
    }
  }



  saveSLCloud() {
    this.clouddirtyflag = this.userSLCloudFrm.dirty;
    let buildSavedDataArray = [];
    for (let i = 0; i < this.cloudSLData.length; i++) {
      if (!this.cloudSLData[i].Functionid) {
        this.projectService.displayMessageerror("Please select function in " + this.converIndextoString(i) + " row of service line cloud");
        return;
      } else if (!this.cloudSLData[i].CategoryId) {
        this.projectService.displayMessageerror("Please select category in " + this.converIndextoString(i) + " row of service line cloud");
        return;
      } else if (!this.cloudSLData[i].ServiceProviderId) {
        this.projectService.displayMessageerror("Please select service provider in " + this.converIndextoString(i) + " row of service line cloud");
        return;
      }
      else if (!this.cloudSLData[i].TechnologyId) {
        this.projectService.displayMessageerror("Please select technology in " + this.converIndextoString(i) + " row of service line cloud");
        return;
      }
      else if (!this.cloudSLData[i].Value || this.cloudSLData[i].Value == "0.00") {
        if (this.acceptNegative == false) {
          this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(i) + " row of service line cloud and it should be greater than 0");
        } else {
          this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(i) + " row of service line cloud");
        }
        return;
      }
      else if (!this.cloudSLData[i].Remarks && this.cloudSLData[i].OpenSource == true) {
        this.projectService.displayMessageerror("Please provide remarks in " + this.converIndextoString(i) + " row of service line cloud");
        return;
      }
      else {
        let SaveOBJ = Object.assign({}, this.cloudSLData[i]);
        buildSavedDataArray.push(SaveOBJ);
      }
    }

    for (let savearr = 0; savearr < buildSavedDataArray.length; savearr++) {
      let index = this.savedcloudSLData.findIndex(it => it.FrontEndID == buildSavedDataArray[savearr].FrontEndID);
      if (index >= 0) {
        this.savedcloudSLData[index] = Object.assign({}, buildSavedDataArray[savearr]);
      } else {
        this.savedcloudSLData.push(Object.assign({}, buildSavedDataArray[savearr]));
      }
    }

    this.projectService.displayMessageerror("Data added successfully");
  }

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

  ngAfterViewChecked() {
    console.log("Clouddirty", this.userSLCloudFrm.dirty);
    if (this.userSLCloudFrm.dirty) {
      this.clouddirtyflag = true;
    }
  }

  ngOnDestroy() {
    let sumofValue: any = this.savedcloudSLData.reduce((prevVal, elem) => {
      if (elem.CloudStatecode != 1) {
        let val: any = this.acceptNegative ? (elem.Value.toString()).match(this.negativeregex) : (elem.Value.toString()).match(this.positiveregex);
        return prevVal + (val && val.length > 0 && val[0] && !this.isNaNCheck(val[0]) ? parseFloat(val[0]) : 0);
      } else {
        return prevVal + 0
      }
    }, 0);
    this.cloudTCV = sumofValue ? parseFloat(sumofValue).toFixed(2) : '0.00';
    this.dialogRef.close({
      "cloudTCV": this.cloudTCV, "clouddirtyflag": this.clouddirtyflag,
      "cloudData": this.savedcloudSLData.map((addColumn) => {
        let newColumn = Object.assign({}, addColumn);
        delete newColumn.FrontEndID;
        return newColumn;
      })
    })
  }
}

@Component({
  selector: 'orderipepopup',
  templateUrl: './orderip-popup.html',
  styleUrls: ['./order.component.scss']
})
export class OrderOpenIP {
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrderOpenIP>,
    public service: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService) {

  }
  @ViewChild('myIPCloudForm') public userIPCloudFrm: NgForm;
  maxlengthValue: number = 17;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  // negativeregex: any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  // positiveregex: any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  type='';
  acceptNegative = false;
  clouddirtyflag = false;
  disableOnRoleBSIp = false;
  panelOpenState2;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  CurrencySymbol = 'NA';
  IPTCV;
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  additionalIpData = {
    FrontEndID: "",
    wipro_ordernumber: "",
    wipro_additionalsolutionvalue: "",
    wipro_additionalvalueoftcv: "",
    wipro_customizationcomments: "",
    wipro_customizationvalue: "",
    wipro_implementationcomment: "",
    wipro_implementationvalues: "",
    wipro_percentageoftcv: "",
    wipro_professionalservicescomment: "",
    wipro_professionalservicesvalues: "",
    wipro_transactioncurrencyid: "",
    wipro_name: "",
    statecode: 0,
    OrderIPId: "",
    wipro_orderipadditionaldetailid: "",
    OrderIpAdditionalDetailsId: "",
  }

  tempAdditionalIpData: any = [];
  cloudData: any = [];
  tempCloudData: any = [];
  finalTCVValue: any = '0.00';
  table_data = [
    { "first_data": "IP", "second_data": "" },
    { "first_data": "Module", "second_data": "" },
    { "first_data": "TCV (" + (this.data.currencySymbol ? this.data.currencySymbol : 'NA') + ")", "second_data": "" },
    { "first_data": "IP TCV (" + (this.data.currencySymbol ? this.data.currencySymbol : 'NA') + ")", "second_data": "0.00" },
    { "first_data": "Est license value(" + (this.data.currencySymbol ? this.data.currencySymbol : 'NA') + ")", "second_data": "0.00" },
    { "first_data": "Est AMC Value (" + (this.data.currencySymbol ? this.data.currencySymbol : 'NA') + ")", "second_data": "0.00" },
    { "first_data": "Owner", "second_data": "" },
    { "first_data": "Module contact", "second_data": "" }
  ]

  ngOnInit() {
    this.type = this.data.type ? this.data.type : '';
    this.CurrencySymbol = (this.data.currencySymbol ? this.data.currencySymbol : 'NA');
    this.acceptNegative = (this.data.acceptNegative ? this.data.acceptNegative : false);
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;
    this.disableOnRoleBSIp = this.data.disableOnRoleBSIp;
    this.additionalIpData = {
      FrontEndID: Math.random().toString(36).substring(2),
      wipro_ordernumber: "",
      wipro_additionalsolutionvalue: "",
      wipro_additionalvalueoftcv: "",
      wipro_customizationcomments: "",
      wipro_customizationvalue: "",
      wipro_implementationcomment: "",
      wipro_implementationvalues: "",
      wipro_percentageoftcv: "",
      wipro_professionalservicescomment: "",
      wipro_professionalservicesvalues: "",
      wipro_transactioncurrencyid: "",
      wipro_name: "",
      statecode: 0,
      OrderIPId: "",
      wipro_orderipadditionaldetailid: "",
      OrderIpAdditionalDetailsId: "",
    }

    let IPtcvValue = ((this.data.Details.WiproAmcvalue ? parseFloat(this.data.Details.WiproAmcvalue) : 0) + (this.data.Details.WiproLicenseValue ? parseFloat(this.data.Details.WiproLicenseValue) : 0)).toFixed(2);
    this.IPTCV = IPtcvValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if (this.data && typeof this.data == 'object') {
      this.table_data[0].second_data = this.data.Details.IpName;
      this.table_data[1].second_data = this.data.Details.WiproModuleName;
      this.table_data[2].second_data = this.data.OverAllTCV;
      this.table_data[3].second_data = this.IPTCV;
      this.table_data[4].second_data = this.data.Details.WiproLicenseValue;
      this.table_data[5].second_data = this.data.Details.WiproAmcvalue;
      this.table_data[6].second_data = "";
      this.table_data[7].second_data = "";

    }
    console.log("this.table_data", this.table_data);
    this.tempAdditionalIpData = JSON.parse(JSON.stringify(this.data.Details.AdditionalSLDetails));
    this.tempAdditionalIpData.map(it => {
      it.FrontEndID = Math.random().toString(36).substring(2);
    })
    if (typeof this.tempAdditionalIpData.filter(it => it.statecode != 1)[0] === 'object') {
      this.additionalIpData = Object.assign({}, this.tempAdditionalIpData.filter(it => it.statecode != 1)[0]);

    }

    if (this.data.Details.CloudDetails && this.data.Details.CloudDetails.length > 0) {
      this.tempCloudData = JSON.parse(JSON.stringify(this.data.Details.CloudDetails));
      this.tempCloudData.map(it => {
        it.FrontEndID = Math.random().toString(36).substring(2);
      })
      this.cloudData = this.tempCloudData.filter(it => it.CloudStatecode != 1);
    }
    this.finalTCVValue = parseFloat(this.calculateCloudValue()).toFixed(2);
    ;
    //Drop Down API call
    this.projectService.getFunction().subscribe(FunctionData => {
      if (!FunctionData.IsError) {
        this.FunctionList = FunctionData.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(FunctionData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })


    this.projectService.getCategory().subscribe(CategoryData => {
      if (!CategoryData.IsError) {
        this.CategoryList = CategoryData.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(CategoryData.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      })


    this.projectService.getServiceProvider().subscribe(ServiceProviderData => {
      if (!ServiceProviderData.IsError) {
        this.ServiceProviderList = ServiceProviderData.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(ServiceProviderData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })
    this.projectService.getTechnology().subscribe(TechnologyData => {
      if (!TechnologyData.IsError) {
        this.TechnologyList = TechnologyData.ResponseObject;
      }
      else {
        this.projectService.displayMessageerror(TechnologyData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })
  }

  setIPCloudName(fieldname, selectedId, i) {
    if (fieldname == 'function') {
      let functionSelect: any = this.FunctionList.filter(it => it.Id == selectedId);
      this.cloudData[i].Function = (functionSelect.length > 0) ? functionSelect[0].Name : "";
    } else if (fieldname == 'category') {
      let categorySelect: any = this.CategoryList.filter(it => it.Id == selectedId);
      this.cloudData[i].Category = (categorySelect.length > 0) ? categorySelect[0].Name : "";
    }
    else if (fieldname == 'service') {
      let serviceSelect: any = this.ServiceProviderList.filter(it => it.Id == selectedId);
      this.cloudData[i].ServiceProvider = (serviceSelect.length > 0) ? serviceSelect[0].Name : "";
    }
    else if (fieldname == 'technology') {
      let technologySelect: any = this.TechnologyList.filter(it => it.Id == selectedId);
      this.cloudData[i].Technology = (technologySelect.length > 0) ? technologySelect[0].Name : "";
    }

  }


  additionalInfo() {
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
  }
  servicevalue() {
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
  }

  ipadditionaldelete() {
    const dialogRef = this.dialog.open(additionalipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.userIPCloudFrm.form.markAsDirty();
        if (this.additionalIpData.wipro_orderipadditionaldetailid || this.additionalIpData.OrderIpAdditionalDetailsId) {
          let i = this.tempAdditionalIpData.findIndex(it => it.FrontEndID == this.additionalIpData.FrontEndID);
          if (i != -1) {
            this.tempAdditionalIpData[i].statecode = 1;
          }

        }
        else {
          let i = this.tempAdditionalIpData.findIndex(it => it.FrontEndID == this.additionalIpData.FrontEndID);
          if (i != -1) {
            this.tempAdditionalIpData.splice(i, 1);
          }
        }
        this.additionalIpData = {
          FrontEndID: Math.random().toString(36).substring(2),
          wipro_ordernumber: "",
          wipro_additionalsolutionvalue: "",
          wipro_additionalvalueoftcv: "",
          wipro_customizationcomments: "",
          wipro_customizationvalue: "",
          wipro_implementationcomment: "",
          wipro_implementationvalues: "",
          wipro_percentageoftcv: "",
          wipro_professionalservicescomment: "",
          wipro_professionalservicesvalues: "",
          wipro_transactioncurrencyid: "",
          wipro_name: "",
          statecode: 0,
          OrderIPId: "",
          wipro_orderipadditionaldetailid: "",
          OrderIpAdditionalDetailsId: "",
        }
      }
    })
  }

  calculateCloudValue() {
    let cloudTCV: any = 0;
    for (let i = 0; i < this.cloudData.length; i++) {
      const tcvValue = Number(this.cloudData[i].Value);
      if (tcvValue) {
        cloudTCV += tcvValue;
      }
    }
    return cloudTCV ? cloudTCV : 0;

  }

  OutputcalculateCloudValue() {
    let cloudTCV: any = 0;
    for (let i = 0; i < this.tempCloudData.length; i++) {
      const tcvValue = Number(this.tempCloudData[i].Value);
      if (tcvValue && this.tempCloudData[i].CloudStatecode != 1) {
        cloudTCV += tcvValue;
      }
    }
    return cloudTCV ? cloudTCV : 0;

  }

  addIpCloud() {
    this.cloudData.unshift({
      FrontEndID: Math.random().toString(36).substring(2),
      Functionid: "",
      CategoryId: "",
      ServiceProviderId: "",
      TechnologyId: "",
      OpenSource: "",
      Value: "",
      Remarks: "",
      CloudStatecode: 0,
      Function: "",
      Category: "",
      ServiceProvider: "",
      Technology: "",
      Name: "",
      cloudtype: 2,
      CloudDetailsID: "",
      OrderCloudDetailsId: "",
      newRow: true
    });

  }

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

  oninputOfIpValue(clouddata, i, event) {
    let cloudValue = clouddata.Value;
    cloudValue = (cloudValue.toString()).replace(",", "");
    let firstval: any = cloudValue.substr(0, event.target.selectionStart)
    let secondval: any = cloudValue.substr(event.target.selectionStart)
    let tempNewValue: any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
    if (newValue) {
      return true;
    } else {
      return false;
    }
  }



  confirmdelete(index, cloudData) {
    const dialogRef = this.dialog.open(OpenipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.userIPCloudFrm.form.markAsDirty();
        if (cloudData.CloudDetailsID || cloudData.OrderCloudDetailsId) {
          let i = this.tempCloudData.findIndex(it => it.FrontEndID == cloudData.FrontEndID);
          this.cloudData.splice(index, 1);
          if (i >= 0) {
            this.tempCloudData[i].CloudStatecode = 1;
          }
          let typetext = this.type == 'order' ? 'order' : 'modification';
          this.projectService.displayMessageerror("Data added for deletion successfully, please save the "+typetext);
        } else {
          let i = this.tempCloudData.findIndex(it => it.FrontEndID == cloudData.FrontEndID && !it.CloudDetailsID);
          this.cloudData.splice(index, 1);
          if (i >= 0) {
            this.tempCloudData.splice(i, 1);
          }
          this.projectService.displayMessageerror("Data deleted successfully");
        }
        this.finalTCVValue = parseFloat(this.calculateCloudValue()).toFixed(2);
      }
    })
  }
  saveData() {
    debugger;
    if (this.wiproDatabsebtn) {
      this.userIPCloudFrm.form.markAsDirty();
      if (this.additionalIpData.wipro_orderipadditionaldetailid) {
        let i = this.tempAdditionalIpData.findIndex(it => it.wipro_orderipadditionaldetailid == this.additionalIpData.wipro_orderipadditionaldetailid);
        if (i != -1) {
          this.tempAdditionalIpData[i] = Object.assign({}, this.additionalIpData);
        }
      }
      else {
        let i = this.tempAdditionalIpData.findIndex(it => it.FrontEndID == this.additionalIpData.FrontEndID);
        if (i != -1) {
          this.tempAdditionalIpData[i] = Object.assign({}, this.additionalIpData);
        }
        else {
          this.tempAdditionalIpData.push(Object.assign({}, this.additionalIpData));
        }
      }
      this.projectService.displayMessageerror("Data added successfully");
    }
    else {
      this.clouddirtyflag = this.userIPCloudFrm.dirty;
      this.cloudData.map((item, index) => {
        if (!item.Functionid) {
          this.projectService.displayMessageerror("Please select function in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.CategoryId) {
          this.projectService.displayMessageerror("Please select category in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.ServiceProviderId) {
          this.projectService.displayMessageerror("Please select service provider in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.TechnologyId) {
          this.projectService.displayMessageerror("Please select technology in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.Value || item.Value == "0.00") {
          if (this.acceptNegative == false) {
            this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(index) + " row of IP cloud and it should be greater than 0");
          } else {
            this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(index) + " row of IP cloud");
          }
          return;
        }
        else if (item.OpenSource && !item.Remarks) {
          this.projectService.displayMessageerror("Please provide remarks in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else {
          let i = this.tempCloudData.findIndex(it => it.FrontEndID == item.FrontEndID);
          if (i != -1) {
            this.tempCloudData[i] = Object.assign({}, item);
          }
          else {
            this.tempCloudData.push(Object.assign({}, item));
          }
          this.projectService.displayMessageerror("Data added successfully");
        }

      })
    }
  }

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
  updateCloudValue(index, e, keyName) {
    let updatedValue
    if (e.target) {
      updatedValue = JSON.parse(JSON.stringify(e.target.value));
    } else {
      updatedValue = e.checked;
    }
    if (keyName == 'Value') {
      this.cloudData[index][keyName] = updatedValue;
      if (!Number(updatedValue)) {
        this.cloudData[index][keyName] = "";
        this.projectService.displayMessageerror("Cloud Value Cannot be 0")
        return;
      }

      let slTcv = Number(this.data.IPTCV);
      if (!slTcv) {
        this.cloudData[index][keyName] = "";
        this.projectService.displayMessageerror("Cloud TCV value cannot be greater than IP TCV value")
        this.cloudData[index].modifiedData = true;
        this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);
        this.finalTCVValue = parseFloat(this.calculateCloudValue()).toFixed(2);
        return;
      }
      if (slTcv < this.calculateCloudValue()) {
        this.cloudData[index][keyName] = "";
        this.projectService.displayMessageerror("Cloud TCV value cannot be greater than IP TCV value")
        this.finalTCVValue = parseFloat(this.calculateCloudValue()).toFixed(2);
        this.cloudData[index].modifiedData = true;
        this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);
        return;
      };

      this.cloudData[index][keyName] = updatedValue ? parseFloat(updatedValue).toFixed(2) : "";
      this.finalTCVValue = parseFloat(this.calculateCloudValue()).toFixed(2);
    } else {
      this.cloudData[index][keyName] = updatedValue;
    }
    this.cloudData[index].modifiedData = true;
    if (this.cloudData[index].newRow != true)
      this.cloudData[index].CloudStatecode = 2;
    this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);

  }
  validateMandatoryFields(data) {
    let validData = true;
    let mandatoryFields = [
      "CategoryId", "Functionid", "ServiceProviderId",
      "TechnologyId", "Value"];
    if (data.WiproOpenSource) {
      validData = data.WiproRemarks ? true : false;
    }

    if (validData) {
      for (let i = 0; i < mandatoryFields.length; i++) {
        if (!data[mandatoryFields[i]]) {
          validData = false;
          break;
        }
      }
    }

    return validData;
  }

  ngAfterViewChecked() {
    console.log("Clouddirty", this.userIPCloudFrm.dirty);
    if (this.userIPCloudFrm.dirty) {
      this.clouddirtyflag = true;
    }
  }

  ngOnDestroy() {
    console.log('this.tempAdditionalIpData', this.tempAdditionalIpData);
    this.tempCloudData.map(it => {
      delete it.FrontEndID;
      delete it.newRow;
      delete it.isValid;
      delete it.modifiedData;
    })

    this.finalTCVValue = parseFloat(this.OutputcalculateCloudValue()).toFixed(2);

    this.tempAdditionalIpData.map(it => {
      delete it.FrontEndID;
    })
    console.log('this.this.tempCloudData', this.tempCloudData);
    this.dialogRef.close({ "cloudTCV": this.finalTCVValue, "clouddirtyflag": this.clouddirtyflag, "additionalIpData": this.tempAdditionalIpData, "cloudData": this.tempCloudData })
  }


}

@Component({
  selector: 'orderdeal-registered-yes-popup',
  templateUrl: './orderdeal-registered-yes-popup.html',
  styleUrls: ['./order.component.scss']
})
export class OrderdealRegisteredYesPopup implements OnInit {
  @ViewChild('myDealYesForm') public userDealYesFrm: NgForm;
  RegistrationReason = [];
  RegistrationStatus = [];
  savedDealYesData = [];
  displayDealYesData = [];
  dealYesdirtyflag = false;
  CurrencySymbol = 'NA';
  acceptNegative = false;
  disableOnRoleBSSolution = false;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OrderdealRegisteredYesPopup>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService, public orderService: OrderService,
  public service: DataCommunicationService){
  }

  ngOnInit(){
    this.disableOnRoleBSSolution = (this.data.disableOnRoleBSSolution ? this.data.disableOnRoleBSSolution : false);
    this.CurrencySymbol = (this.data.currencySymbol ? this.data.currencySymbol : 'NA');
    this.acceptNegative = (this.data.acceptNegative ? this.data.acceptNegative : false);
    this.savedDealYesData = this.data.Details.DealRegistrationYes.map((addColumn) => {
      let newColumn = Object.assign({}, addColumn);
      newColumn.FrontEndID = Math.random().toString(36).substring(2);
      return newColumn;
    });
    this.displayDealYesData = this.savedDealYesData.map((it) => {
     return Object.assign({}, it)
    });
    this.getRegistrationStatus();
    this.getRegistrationReason();
  }

  getRegistrationStatus(){
    this.orderService.getOrderDealRegistrationStatus().subscribe(res=> { 
      this.RegistrationStatus = res && res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject : [];
    },err=>{
      this.RegistrationStatus = [];
    })
  }

  getRegistrationReason(){
    this.orderService.getOrderDealRegistrationReason(true).subscribe(res=> { 
      this.RegistrationReason = res && res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject : [];
    },err=>{
      this.RegistrationReason = [];
    })
  }

  checkMandateRemarks(){
    return this.displayDealYesData.some(it=> it.RegistrationStatusReason == '184450004');
  }

  setDealYesName(fieldname, selectedId, i) {
    if (fieldname == 'status') {
      let statusSelect: any = this.RegistrationStatus.filter(it => it.Id == selectedId);
      this.displayDealYesData[i].RegistrationStatusName = (statusSelect.length > 0) ? statusSelect[0].Name : "";
    } else if (fieldname == 'reason') {
      let reasonSelect: any = this.RegistrationReason.filter(it => it.Id == selectedId);
      this.displayDealYesData[i].RegistrationStatusReasonName = (reasonSelect.length > 0) ? reasonSelect[0].Name : "";
    }

  }

  onRegValueBlur(clouddata, newValue, i) {
    let tempvalue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    let tempdecimalVal: any = tempvalue && tempvalue.length > 0 && tempvalue[0] && !this.isNaNCheck(tempvalue[0]) ? parseFloat(tempvalue[0]).toFixed(2).toString() : "";
    this.displayDealYesData[i].RegisteredValue = tempdecimalVal;

  }

  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  saveDealYesData(){
    for (let i = 0; i < this.displayDealYesData.length; i++) {
      if (!this.displayDealYesData[i].RegistrationStatus) {
        this.projectService.displayMessageerror("Please select registration status");
        return;
      } else if (!this.displayDealYesData[i].RegistrationStatusReason) {
        this.projectService.displayMessageerror("Please select status reason");
        return;
      } else if (!this.displayDealYesData[i].PartnerPortalId) {
        this.projectService.displayMessageerror("Please provide partner portal Id");
        return;
      }
      else if (!this.displayDealYesData[i].RegisteredValue || this.displayDealYesData[i].RegisteredValue == "0.00") {
        if (this.acceptNegative == false) {
          this.projectService.displayMessageerror("Please provide registered value and it should be greater than 0");
        } else {
          this.projectService.displayMessageerror("Please provide registered value");
        }
        return;
      }else if(this.displayDealYesData[i].RegistrationStatusReason == '184450004' && !this.displayDealYesData[i].Remarks){
        this.projectService.displayMessageerror("Please provide remarks");
        return;
      }
      else {
        let SaveOBJ = Object.assign({}, this.displayDealYesData[i]);
        this.savedDealYesData = new Array(Object.assign({}, SaveOBJ));
      }
    }
    this.dealYesdirtyflag = this.userDealYesFrm.dirty
    this.projectService.displayMessageerror("Data added successfully");
    this.dialogRef.close();
  }
  
  ngAfterViewChecked() {
    console.log("dealYesdirty", this.userDealYesFrm.dirty);
    if (this.userDealYesFrm.dirty) {
      // this.dealYesdirtyflag = true;
    }
  }

  ngOnDestroy() {
    this.dialogRef.close({
      "dealYesdirtyflag": this.dealYesdirtyflag,
      "DealRegistrationYes": this.savedDealYesData.map((addColumn) => {
        let newColumn = Object.assign({}, addColumn);
        delete newColumn.FrontEndID;
        return newColumn;
      })
    })
  }
}
@Component({
  selector: 'orderdeal-registered-no-popup',
  templateUrl: './orderdeal-registered-no-popup.html',
  styleUrls: ['./order.component.scss']
})
export class OrderdealRegisteredNoPopup implements OnInit {
  @ViewChild('myDealNoForm') public userDealNoFrm: NgForm;
  RegistrationReason = [];
  RegistrationStatus = [];
  savedDealNoData = [];
  displayDealNoData = [];
  dealNodirtyflag = false;
  CurrencySymbol = 'NA';
  acceptNegative = false;
  disableOnRoleBSSolution = false;
  positiveregex: any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex: any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OrderdealRegisteredNoPopup>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService, public orderService: OrderService,
  public service: DataCommunicationService){}

  ngOnInit(){
    this.disableOnRoleBSSolution = (this.data.disableOnRoleBSSolution ? this.data.disableOnRoleBSSolution : false);
    this.CurrencySymbol = (this.data.currencySymbol ? this.data.currencySymbol : 'NA');
    this.acceptNegative = (this.data.acceptNegative ? this.data.acceptNegative : false);
    this.savedDealNoData = this.data.Details.DealRegistrationNo.map((addColumn) => {
      let newColumn = Object.assign({}, addColumn);
      newColumn.FrontEndID = Math.random().toString(36).substring(2);
      return newColumn;
    });
    this.displayDealNoData = this.savedDealNoData.map((it) => {
     return Object.assign({}, it)
    });
    this.getRegistrationReason();
  }


  getRegistrationReason(){
    this.orderService.getOrderDealRegistrationReason(false).subscribe(res=> { 
      this.RegistrationReason = res && res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject : [];
    },err=>{
      this.RegistrationReason = [];
    })
  }

  setDealYesName(fieldname, selectedId, i) {
  if (fieldname == 'reason') {
      let reasonSelect: any = this.RegistrationReason.filter(it => it.Id == selectedId);
      this.displayDealNoData[i].RegistrationStatusReasonName = (reasonSelect.length > 0) ? reasonSelect[0].Name : "";
    }

  }

  onRegValueBlur(clouddata, newValue, i) {
    let tempvalue: any = this.acceptNegative ? newValue.match(this.negativeregex) : newValue.match(this.positiveregex);
    let tempdecimalVal: any = tempvalue && tempvalue.length > 0 && tempvalue[0] && !this.isNaNCheck(tempvalue[0]) ? parseFloat(tempvalue[0]).toFixed(2).toString() : "";
    this.displayDealNoData[i].RegisteredValue = tempdecimalVal;

  }

  isNaNCheck(data) {
    return isNaN(parseFloat(data));
  }

  saveDealNoData(){
    for (let i = 0; i < this.displayDealNoData.length; i++) {
    if (!this.displayDealNoData[i].RegistrationStatusReason) {
        this.projectService.displayMessageerror("Please select status reason");
        return;
      }
     else if (this.displayDealNoData[i].RegistrationStatusReason == '184450004' && !this.displayDealNoData[i].Remarks) {
        this.projectService.displayMessageerror("Please provide remarks");
        return;
      }
      else {
        let SaveOBJ = Object.assign({}, this.displayDealNoData[i]);
        this.savedDealNoData = new Array(Object.assign({}, SaveOBJ));
      }
    }
    this.dealNodirtyflag = this.userDealNoFrm.dirty
    this.projectService.displayMessageerror("Data added successfully");
    this.dialogRef.close();
  }
  
  ngAfterViewChecked() {
    console.log("dealNodirty", this.userDealNoFrm.dirty);
    if (this.userDealNoFrm.dirty) {
      // this.dealNodirtyflag = true;
    }
  }

  ngOnDestroy() {
    this.dialogRef.close({
      "dealNodirtyflag": this.dealNodirtyflag,
      "DealRegistrationNo": this.savedDealNoData.map((addColumn) => {
        let newColumn = Object.assign({}, addColumn);
        delete newColumn.FrontEndID;
        return newColumn;
      })
    })
  }
}


@Component({
  selector: 'app-delay-pop',
  templateUrl: './delay-calenderpop.html',
  styleUrls: ['./order.component.scss']

})
export class delaypopcomponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<delaypopcomponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  delayReason = '';
  delayReasonFlag: boolean = false;
  showErrorFlag: boolean = false;
  bgcolorblue: boolean = false;

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.delayReason,
      reasonFlag: this.delayReasonFlag
    }
    returnObj.reasonFlag = this.delayReason.trim() ? true : false;
    this.delayReasonFlag = this.delayReason.trim() ? true : false;
    if (returnObj.flag == 'Yes') {
      if (this.delayReasonFlag) {
        this.dialogRef.close(returnObj);
        this.showErrorFlag = false;
      }
      else {
        this.showErrorFlag = true;
      }
    }
    else {
      this.dialogRef.close(returnObj);
      this.delayReason = '';
    }

    console.log("objd", this.delayReason)
  }

  changeDelayReason() {
    if (this.delayReason.trim() != "") {
      this.bgcolorblue = true;
      this.showErrorFlag = false;
    }
    else {
      this.bgcolorblue = false;
    }
  }

}


//upload contract popup
@Component({
  selector: 'app-uploadContract-pop',
  templateUrl: './upload-contract-pop.html',
  styleUrls: ['./order.component.scss']
})
export class UploadContractpopComponent implements OnInit {

  //upload contract
  UploadContract: any = {
    ContractTitle: '',
    ContractNotes: '',
    UploadContractOldFIles: [],
    UploadContractNewFIles: []
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadContractpopComponent>,
    public router: Router,
    public projectService: OpportunitiesService,
    private el: ElementRef,
    private fileService: FileUploadService,
    private orderService: OrderService,
    public addIPservice: AddIpService,
    public service: DataCommunicationService) {
  }

  ngOnInit() {
    this.UploadContract.ContractTitle = this.data.ContractTitle;
    this.UploadContract.ContractNotes = this.data.ContractNotes;
    this.UploadContract.UploadContractOldFIles = this.data.UploadContractFiles;
  }

  saveFileTOBlob(evt) {
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
          if (fileExtension == "exe" || fileExtension == "lib" || fileExtension == "manifest" || hex == "4D5A") {
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
            this.saveContactToRepo(fd,file, index, length);
          }
          console.log("file upload")

        }
      }
    }
  }

  
  saveContactToRepo(filedetails: any,file, index, length) {

    let fileToUpload = [];
    fileToUpload.push(filedetails)
    this.fileService.filesToUploadDocument64(fileToUpload).subscribe((res: any) => {
      let UploadFileName = file.name;
       let RespName = res[0].ResponseObject.Name;
       console.log("resname", res[0].ResponseObject.Name);
      if (res) {
        let resDetails = {
          DownloadFileName : RespName
        }
        let fileDetails = {
          UploadFileName: UploadFileName,
          UploadedUrl: res[0].ResponseObject.Url,
          UniqueKey: "901",
          AttachmentId: null,
          StateCode: 0
        }
        //this.contractFileName = res[0].ResponseObject.Name;
        console.log("rescont", res);
       
        console.log("resurl",res[0].ResponseObject.Url);
        this.UploadContract.UploadContractNewFIles.push(Object.assign({}, fileDetails,resDetails));
        let length = this.UploadContract.UploadContractNewFIles.length - 1;
        // let count = 0;
        for (var i = 0; i <= length; i++) {
          for (var j = i + 1; j <= length; j++) {
            if (this.UploadContract.UploadContractNewFIles[i].UploadFileName === this.UploadContract.UploadContractNewFIles[j].UploadFileName) {
              this.UploadContract.UploadContractNewFIles.splice(j, 1);
              length--;
              this.projectService.displayMessageerror('Files which were repeated are removed');
              // count++;
            }
          }
        }

      }
      else {
        this.projectService.displayMessageerror(UploadFileName + 'file upload failed');
      }

      if (index == length) {
        this.service.loaderhome = false;
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
    })
  }

  //save contract attachments
  repeatFlag: boolean = false;
  saveAttachments() {
    let count = 0;
    if (!this.UploadContract.ContractTitle) {
      this.projectService.displayMessageerror('Please provide contract title');
    } else if (this.UploadContract.UploadContractOldFIles.length == 0 && this.UploadContract.UploadContractNewFIles.length == 0) {
      this.projectService.displayMessageerror('Please upload a file');
    }
    else {
      let length = this.UploadContract.UploadContractNewFIles.length - 1;
      let length1 = this.UploadContract.UploadContractOldFIles.length - 1;

      for (var i = 0; i <= length; i++) {
        for (var j = 0; j <= length1; j++) {
          if (this.UploadContract.UploadContractNewFIles[i].UploadFileName === this.UploadContract.UploadContractOldFIles[j].UploadFileName) {
            this.UploadContract.UploadContractOldFIles.splice(j, 1);
            length1--;
            this.repeatFlag = true;
            count++;
          }
        }
      }



      if (this.UploadContract.UploadContractNewFIles.length > 0) {
        this.UploadContract.UploadContractOldFIles.push.apply(this.UploadContract.UploadContractOldFIles, this.UploadContract.UploadContractNewFIles);
      }
      let UploadContractDetails = Object.assign({
        ContractTitle: this.UploadContract.ContractTitle,
        ContractNotes: this.UploadContract.ContractNotes,
        UploadContractFiles: this.UploadContract.UploadContractOldFIles
      })
      this.dialogRef.close(UploadContractDetails);

      if (count > 0) {
        this.projectService.displayMessageerror('Contract uploaded successfully and ' + count + ' files were removed due to repetition ');
      }
      else {
        this.projectService.displayMessageerror('Contract uploaded successfully');
      }
    }
  }
}
// Upload Remainder comment popup starts
@Component({
  selector: 'reminderCommentPopup',
  templateUrl: './reminderCommentPopup.html',
  styleUrls: ['./order.component.scss']
})
export class reminderCommentPopup implements OnInit {
  Header: any = "";
  Context: any = "";
  PlaceHolder: any = "";
  remarks = "";
  errorMessage = "";
  constructor(public dialogRef: MatDialogRef<reminderCommentPopup>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService) { }

  ngOnInit() {
    this.Header = this.data.Header;
    this.Context = this.data.Context;
    this.PlaceHolder = this.data.PlaceHolder;
    this.errorMessage = this.data.errorMessage;
  }

  returnvalue() {
    if (!this.remarks.trim()) {
      this.projectService.displayMessageerror(this.errorMessage);
      return;
    } else {
      this.dialogRef.close({ action: 'save', remarks: this.remarks });
    }

  }

}
// Upload Remainder comment popup ends

