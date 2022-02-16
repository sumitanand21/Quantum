import { Component, Inject, OnInit, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewChecked, Pipe, PipeTransform  } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AddIpService, opportunityAdvnBSSolutionHeaders, opportunityAdvnBSSolutionNames } from '@app/core/services/add-ip.service';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { OpportunitiesService,OrderService} from '@app/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  serviceLineBSDetails, serviceLineBSnterface,
  IpandServiceLineSL, IpandHolmesInterface, IpDetails, IPInterface,
  creditAllocationDetails, creditAllocationInterface, creditServiceLineInterface,
  solutionsInterface, solutionDetails
} from './../../../../../../core/models/allopportunity.model';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { additionalipDeletecomponent, OpenipDeletecomponent } from '../../../ip-additional-details/ip-additional-details.component';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { ServicelinepopupComponent } from '@app/shared/components/single-table/sprint4Modal/servicelinepopup/servicelinepopup.component';


// import { OpenipDeletecomponent, additionalipDeletecomponent } from '../../../ip-additional-details/ip-additional-details.component';

// import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-business-solution',
  templateUrl: './business-solution.component.html',
  styleUrls: ['./business-solution.component.scss']
})
export class BusinessSolutionComponent implements OnInit {
 
  //Lookupdata
  arrowkeyLocation = 0;
  accountdetails = [];
  headerdb = [
    {
      name: 'type',
      title: 'Type'
    },
    {
      name: 'name',
      title: 'Name'
    },
    {
      name: 'owner',
      title: 'Owner'
    }
  ];

  @ViewChild('myForm') public userFrm: NgForm;

  serviceLineLoader: boolean = false;
  IpLoader: boolean = false;
  solutionLoader: boolean = false;
  creditAllocationLoader: boolean = false;

  disableOnRoleBSPanel = false;
  disableOnRoleBSSL = false;
  disableOnRoleBSIp = true;
  userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  disableOnRoleBSSolution = false;
  disableOnRoleBSCA = false;
  disableReadOnly=true; 
  isMultipleSLBDM=false;
  isPreSales=false;
  isPPS=false;
  IsIPOwner = false;
  OpportunityId: string = this.projectService.getSession("opportunityId"); // for others
  fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
  OpportunityStatus = this.projectService.getSession("opportunityStatus");
  CurrencySymbol = this.projectService.getSession('currencySymbol');
  oppCreatedDate = this.projectService.getSession('createdDate');
  currentState = this.projectService.getSession('currentState') ? this.projectService.getSession('currentState').toString() : '';
  currentDate :any;
  timeDiff :any;
  VerticalId = this.projectService.getSession('verticalId');
  RegionId = this.projectService.getSession('regionId');
  sbuId = this.projectService.getSession('sbuId');
  geoId = this.projectService.getSession('GeoId');
  IsAppirio=this.projectService.getSession('IsAppirio')?this.projectService.getSession('IsAppirio'):false;

  IsAppirioFlag=this.projectService.getSession('IsAppirioFlag')?this.projectService.getSession('IsAppirioFlag'):false;
  IsPricingId:string;
  pageSize = 10;
  defaultpageNumber = 1;
  OdatanextLink = null;
  totalRecordCount = 0;
  SearchTypeHomesBDM = "184450001"
  SearchTypeSolutionBDM = "184450000"
  AllianceSearchType = 6;
  NewAgeSearchType = 15;
  getSonutionNameType = 5;
  panelOpenState2: boolean = true;
  panelOpenState4: boolean = true;
  panelOpenState5: boolean = true;
  // panelOpenState6: boolean = true;
  panelOpenState2readonly: boolean = true;
  panelOpenState3readonly: boolean = true;
  panelOpenState4readonly: boolean = true;
  panelOpenState5readonly: boolean = true;
  panelOpenState6readonly: boolean = true;
  panelOpenState3: boolean = true;
  //Table Details Variable for Business Solution Panel
  businessSOlutionData: any[] = [];
  CIOValue = 184450000;
  FMGValue = 184450001;
  HRValue = 184450002;
  AgileValue = 184450003;
  OverALLSavedTCV: any = "";
  OverALLSavedTCVData: any = "";
  CIS = "CLOUD & INFRASTRUCTURE SERVICES (CIS)";
  CRS = "CYBERSECURITY & RISK SERVICES (CRS)";
  //Table Details Variable for Business Solution Panel
  //Table Details Variable for CA
  creditAllocationdataDetails: creditAllocationDetails[] = [];
  creditAllocationSLDD: creditServiceLineInterface[] = [];
  creditTypeDD = [];
  newCADataCount: number = 0;
  //Table Details Variable for CA Ends

  //Table Details Variable for Solutions
  SolutionDetails: solutionDetails[] = [];
  InfluenceTypeDD = [];
  serviceTypeDD = [];
  solutionTypeDD = [];
  newsolDataCount: number = 0;
  //Table Details Variable for Solutions End

  //Table Details Variable for IP
  IpDetails: IpDetails[] = []
  IpandServiceLinelDD: IpandServiceLineSL[] = [];
  newIpDataCount: number = 0;
  //Table Details Variable for Ip End
  //Table Details Variable for BS SL
  newBSSLDataCount: number = 0;
  BSSLDetails: serviceLineBSDetails[] = [];
  BSDualCreditDD = [];
  isRegionChange=false;
  tcvPopupData = [];
  BasetcvPopupData=[];
  tcvPopupObjSave : any = {};
  

  //Mandatory Field check flag for save
  saveFlag = false;
  //Table Details Variable for BS SL End
  constructor(public router: Router,
    public dialog: MatDialog,
    public addIPservice: AddIpService,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    private cdRef: ChangeDetectorRef,
    private EncrDecr: EncrDecrService,
    private orderService: OrderService,
    public daService: DigitalAssistantService) {
    this.saveBusinessSolution = this.saveBusinessSolution.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveBusinessSolution);
    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit);
  }

  ngOnInit() {
    console.log("princingId",this.IsPricingId);
    console.log("princingId");
    
    this.getBusinessSolutionPanelData(this.OpportunityId);
    this.getIpandserviceLineData();
    this.getDualCreditData();
    this.getInfluenceTypeData();
    this.getServiceTypeData();
    this.getSolutionTypeData();
    this.getTcvPopupData();

    // this.daService.iframePage = 'OPP_DIFFERENCE';
    // let bodyDA = {
    //   accountGuid: this.projectService.getSession("accountid"),
    //   opportunityGuid: this.OpportunityId,
    //   page: 'OPP_DIFFERENCE'
    // };
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
    console.log("IsAppirio",this.IsAppirio);
    console.log("oppcreatedate",this.oppCreatedDate)
    this.oppCreatedDate = Number(new Date(this.oppCreatedDate));
    this.currentDate = Number(new Date());

    this.timeDiff = (this.currentDate - this.oppCreatedDate)  / 36e5;
    console.log("diff in date",this.timeDiff)

  }

  openTCVcomparison()
  {
    this.service.loaderhome = true;
      this.projectService.getDataForComparison(this.OpportunityId,this.IsPricingId).subscribe((res)=>
    {
        if (res && res.IsError == false)
        {
          this.service.loaderhome = false;
          if(res.ResponseObject)
          {
             const dialogRef = this.dialog.open(ServicelinepopupComponent,
              {
                width: '580px',
              });
              dialogRef.componentInstance.popup_data = res.ResponseObject;
          } 
        }
        else
        {
           this.projectService.displayerror("Internal server error occured");
           this.service.loaderhome = false;
        }
    })
    
  }

  subscription;
  subscriptionMoreOptions;
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



  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.saveBusinessSolution, true);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit, true);
  }

  getSolutionTypeData() {
    this.projectService.getSolutionType().subscribe(res => {
      this.solutionTypeDD = (res && res.ResponseObject) ? res.ResponseObject : [];

    }, err => {
      this.solutionTypeDD = [];
    });
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
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

  getBusinessSolutionPanelData(OppId) {
    debugger;
    // this.getserviceLineCAData(this.OpportunityId);
    this.serviceLineLoader = true;
    this.IpLoader = true;
    this.solutionLoader = true;
    // this.creditAllocationLoader = true;
    this.service.loaderhome = true;
    // this.hideBSSolution = this.projectService.getSession('isSimpleOpportunity')?projectService.getSession('isSimpleOpportunity'):false
    // *ngIf= "!(projectService.getSession('isSimpleOpportunity')?projectService.getSession('isSimpleOpportunity'):false)"

    if (this.OpportunityStatus == 1 && this.projectService.getSession('ordercreated') == false && this.currentState != "184450004") {
      if (this.fullAccessSessionCheck == true) {
        this.disableOnRoleBSPanel = false;
        this.disableOnRoleBSSL = false;
        this.disableOnRoleBSIp= false;
        this.disableOnRoleBSSolution = false;
        this.disableOnRoleBSCA = false;
        this.disableReadOnly=true;
        this.isMultipleSLBDM=true;
        this.createBusinessSolutionData();
      } else {
        this.projectService.accessModifyApi(this.projectService.getSession('AdvisorOwnerId'), localStorage.getItem('userEmail')).subscribe(response => {
          if (response && response.ResponseObject) {
             this.projectService.setSession('roleObj', response.ResponseObject);
            if (response.ResponseObject.FullAccess == true) {
              this.disableOnRoleBSPanel = false;
              this.disableOnRoleBSSL = false;
              this.disableOnRoleBSIp = false;
              this.disableOnRoleBSSolution = false;
              this.disableOnRoleBSCA = false;
              this.disableReadOnly=true;
              this.isMultipleSLBDM=true;
            }


            else if (response.ResponseObject.IsIPOwner || response.ResponseObject.IsMultipleSLBDM || response.ResponseObject.PartialAccess ||
              (response.ResponseObject.UserRoles.IsPreSaleAndRole && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)) {
              if(response.ResponseObject.IsMultipleSLBDM)
              {
                this.isMultipleSLBDM=true;   
                this.disableOnRoleBSIp = true;             
              }
              if(response.ResponseObject.IsIPOwner)
              {
                this.IsIPOwner=true;
                this.disableOnRoleBSIp = true;
              }
              if(response.ResponseObject.UserRoles.IsPreSaleAndRole && response.ResponseObject.IsGainAccess)
              {
                this.isPreSales=true;
                this.disableOnRoleBSIp = false;
              }
              if(response.ResponseObject.UserRoles.IsPpsFunction && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)
              {
                this.isPPS=true;
                this.disableOnRoleBSIp = true;
              }
              if(response.ResponseObject.UserRoles.IsSaleSLFunction && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)
              {
                this.disableOnRoleBSIp = true;
              }
              this.disableOnRoleBSPanel = true;
              this.disableOnRoleBSSL = true;              
              this.disableOnRoleBSSolution = false;
              this.disableOnRoleBSCA = true;
              this.disableReadOnly=true;
            } else {
              this.disableOnRoleBSPanel = true;
              this.disableOnRoleBSSL = true;
              this.disableOnRoleBSIp = true;
              this.disableOnRoleBSSolution = true;
              this.disableOnRoleBSCA = true;
              this.disableReadOnly=true;
              this.disableReadOnly=false;
            }
          } else {
            this.disableOnRoleBSPanel = true;
            this.disableOnRoleBSSL = true;
            this.disableOnRoleBSIp = true;
            this.disableOnRoleBSSolution = true;
            this.disableOnRoleBSCA = true;
            this.disableReadOnly=false;
          }
          this.createBusinessSolutionData();
        }, err => {
          this.disableOnRoleBSPanel = true;
          this.disableOnRoleBSSL = true;
          this.disableOnRoleBSIp = true;
          this.disableOnRoleBSSolution = true;
          this.disableOnRoleBSCA = true;
          this.disableReadOnly=false;
          this.createBusinessSolutionData();
        })
      }
    } else {
      this.disableOnRoleBSPanel = true;
      this.disableOnRoleBSSL = true;
      this.disableOnRoleBSIp = true;
      this.disableOnRoleBSSolution = true;
      this.disableOnRoleBSCA = true;
      this.disableReadOnly=false;
      this.createBusinessSolutionData();
    }
  }


  serviceLineLength = 0;
  createBusinessSolutionData() {
    debugger;
    // this.OverALLSavedTCV = "";
    let OBJ = {
      Sltcv: "",
      OverallTcv: "",
      IpTcv: "",
      TCVCalculation: false,
      CIO: false,
      FMG: false,
      HR: false,
      Agile: false,
      TransactionCurrencyIdFormattedValue: "",
      TransactionCurrencyIdValue: "",
      opportunityid: this.OpportunityId,
      FunctionInvolved: [],
      CIOFunctionLead: "",
      CIOFunctionLeadName: "",
      CIOFunctionLeadEmail: "",
      WiproValue: "",
      CIODealPercentage: "",
      TransactionCurrencyId: "",
      TransactionCurrencyIdName: "",
      WiproSimpleDeal: false,
      RFI: null,
      Implpletmented: null,
      proposalTypeCheck: ""
    }
    this.projectService.getBusinessSolutions(this.OpportunityId).subscribe(res => {
      console.log("BSDATA1", res);
      if(res.ResponseObject && res.ResponseObject.WiproServiceLineDtls) {
        this.serviceLineLength = res.ResponseObject.WiproServiceLineDtls.length;
        res.ResponseObject.WiproServiceLineDtls.forEach((item,i) => {
          item.index = i + 1;
        })
      }
      console.log("BSDATA2", res);
      if (res && res.ResponseObject && res.ResponseObject.OppBSP) {
        if(res.ResponseObject.WiproServiceLineDtls.length>1 && this.OpportunityStatus == 1 && this.currentState != "184450004")
        {
            let advisorOwnerId = this.projectService.getSession("AdvisorOwnerId");
            this.projectService.accessModifyApi(advisorOwnerId,localStorage.getItem('userEmail')).subscribe((response) => {
                console.log("sdsdd",response);
                this.projectService.setSession('IsPreSaleAndRole', response.ResponseObject.UserRoles.IsPreSaleAndRole)
                this.projectService.setSession('IsGainAccess', response.ResponseObject.IsGainAccess)
                this.projectService.setSession('FullAccess', response.ResponseObject.FullAccess);
                this.projectService.setSession('roleObj', response.ResponseObject);
                if (response && response.ResponseObject) {
            if (response.ResponseObject.FullAccess == true) {
              this.disableOnRoleBSPanel = false;
              this.disableOnRoleBSSL = false;
              this.disableOnRoleBSIp = false;
              this.disableOnRoleBSSolution = false;
              this.disableOnRoleBSCA = false;
              this.disableReadOnly=true;
              this.isMultipleSLBDM=true;
            }


            else if (response.ResponseObject.IsIPOwner || response.ResponseObject.IsMultipleSLBDM || response.ResponseObject.PartialAccess ||
              (response.ResponseObject.UserRoles.IsPreSaleAndRole && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)) {
            
               if(response.ResponseObject.IsMultipleSLBDM)
              {
                this.isMultipleSLBDM=true;   
                this.disableOnRoleBSIp = true;             
              }
              if(response.ResponseObject.IsIPOwner)
              {
                this.IsIPOwner=true;
                this.disableOnRoleBSIp = true;
              }
              if(response.ResponseObject.UserRoles.IsPreSaleAndRole && response.ResponseObject.IsGainAccess)
              {
                this.isPreSales=true;
                this.disableOnRoleBSIp = false;
              }
              if(response.ResponseObject.UserRoles.IsPpsFunction && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)
              {
                this.isPPS=true;
                this.disableOnRoleBSIp = true;
              }
              if(response.ResponseObject.UserRoles.IsSaleSLFunction && response.ResponseObject.IsGainAccess && response.ResponseObject.PartialAccess)
              {
                this.disableOnRoleBSIp = true;
              }
              this.disableOnRoleBSPanel = true;
              this.disableOnRoleBSSL = true;
              this.disableOnRoleBSSolution = false;
              this.disableOnRoleBSCA = true;
              this.disableReadOnly=true;
            } else {
              this.disableOnRoleBSPanel = true;
              this.disableOnRoleBSSL = true;
              this.disableOnRoleBSIp = true;
              this.disableOnRoleBSSolution = true;
              this.disableOnRoleBSCA = true;
              this.disableReadOnly=true;
              this.disableReadOnly=false;
            }
          } else {
            this.disableOnRoleBSPanel = true;
            this.disableOnRoleBSSL = true;
            this.disableOnRoleBSIp = true;
            this.disableOnRoleBSSolution = true;
            this.disableOnRoleBSCA = true;
            this.disableReadOnly=false;
          }

            });
        }
        OBJ.RFI = res.ResponseObject.OppBSP.RFI;
        OBJ.proposalTypeCheck = res.ResponseObject.OppBSP.ProposalType;
        this.isRegionChange = res.ResponseObject.OppBSP.isRegionChange?res.ResponseObject.OppBSP.isRegionChange:false;
        OBJ.Implpletmented = res.ResponseObject.OppBSP.Implpletmented;
        OBJ.OverallTcv = res.ResponseObject.OppBSP.OverallTcv ? (parseFloat(res.ResponseObject.OppBSP.OverallTcv).toFixed(2)).toString() : "";
        this.OverALLSavedTCVData = OBJ.OverallTcv;
        OBJ.IpTcv = res.ResponseObject.OppBSP.IpTcv ? (parseFloat(res.ResponseObject.OppBSP.IpTcv).toFixed(2)).toString() : "";
        OBJ.Sltcv = res.ResponseObject.OppBSP.Sltcv ? (parseFloat(res.ResponseObject.OppBSP.Sltcv).toFixed(2)).toString() : "";
        OBJ.TransactionCurrencyIdFormattedValue = res.ResponseObject.OppBSP.TransactionCurrencyIdFormattedValue;
        OBJ.TransactionCurrencyIdValue = res.ResponseObject.OppBSP.TransactionCurrencyIdValue;
        OBJ.opportunityid = this.OpportunityId
        OBJ.CIOFunctionLead = res.ResponseObject.OppBSP.CIOFunctionLead;
        OBJ.CIOFunctionLeadName = res.ResponseObject.OppBSP.CIOFunctionLeadName;
        OBJ.CIOFunctionLeadEmail = res.ResponseObject.OppBSP.CIOFunctionLeadEmail;
        OBJ.WiproValue = res.ResponseObject.OppBSP.WiproValue ? (parseFloat(res.ResponseObject.OppBSP.WiproValue).toFixed(2)).toString() : "";
        OBJ.CIODealPercentage = res.ResponseObject.OppBSP.CIODealPercentage ? (parseFloat(res.ResponseObject.OppBSP.CIODealPercentage).toFixed(2)).toString() : "";
        OBJ.TCVCalculation = res.ResponseObject.OppBSP.CalculationMethod;
        OBJ.TransactionCurrencyId = res.ResponseObject.OppBSP.TransactionCurrencyId;
        OBJ.TransactionCurrencyIdName = res.ResponseObject.OppBSP.TransactionCurrencyIdName;
        OBJ.WiproSimpleDeal = res.ResponseObject.OppBSP.WiproSimpleDeal;
        this.IsPricingId=res.ResponseObject.OppBSP.PricingId?res.ResponseObject.OppBSP.PricingId:'';
        OBJ.FunctionInvolved = (res.ResponseObject.OppBSP.FunctionInvolved) ? res.ResponseObject.OppBSP.FunctionInvolved : [];
        OBJ.FunctionInvolved.forEach(funcInv => {
          if (funcInv.Value == this.CIOValue) {
            OBJ.CIO = true;
          } else if (funcInv.Value == this.FMGValue) {
            OBJ.FMG = true;
          }
          else if (funcInv.Value == this.HRValue) {
            OBJ.HR = true;
          }
          else if (funcInv.Value == this.AgileValue) {
            OBJ.Agile = true;
          }
        });
      }
      this.businessSOlutionData[0] = Object.assign({}, OBJ);
      this.overalltcvComma=(this.businessSOlutionData[0].OverallTcv)?((parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")):"00.00";
      //this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.getBusinessSolutionsTableData(res);
      // this.service.loaderhome=false;
    }, err => {
      this.businessSOlutionData[0] = Object.assign({}, OBJ);
      this.getBusinessSolutionsTableData(null);
      this.projectService.displayerror(err.status);
      // this.service.loaderhome=false;
    });

  }

  getTcvPopupData()
  {
      this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        console.log("After sortingdar",this.BasetcvPopupData)
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : this.businessSOlutionData[0].OverallTcv;
      })

      console.log("BASETCVCCC",this.OverALLSavedTCV)

     this.tcvPopupData=     [{

            "createdon": "2020-03-13T11:05:52Z",

            "WiproChangeoccurred": "Others",

            "WiproChangepercentage": "0.00",

            "WiproOpportunityid_value": "1793fb88-1a65-ea11-a83f-000d3aa058cb",

            "WiproReason": "Opportunity has created",

            "WiproTcvauditlogid": "1e93fb88-1a65-ea11-a83f-000d3aa058cb",

            "WiproUpdatedTCV": 1000000

        },

        {

            "createdon": "2020-03-13T11:08:39Z",

            "WiproChangeoccurred": "Duration changed",

            "WiproChangepercentage": "9900.00",

            "WiproOpportunityid_value": "1793fb88-1a65-ea11-a83f-000d3aa058cb",

            "WiproReason": "test 1",

            "WiproTcvauditlogid": "b1729cfd-1a65-ea11-a83f-000d3aa058cb",

            "WiproUpdatedTCV": 100000000

        },

        {

            "createdon": "2020-03-13T11:10:25Z",

            "WiproChangeoccurred": "Correction",

            "WiproChangepercentage": "99900.00",

            "WiproOpportunityid_value": "1793fb88-1a65-ea11-a83f-000d3aa058cb",

            "WiproReason": "test 2",

            "WiproTcvauditlogid": "6d05ba3b-1b65-ea11-a83f-000d3aa058cb",

            "WiproUpdatedTCV": 100000000000

        }]
     console.log("before sorting",this.tcvPopupData)
      this.tcvPopupData.sort(function(a, b){
        return a.createdon-b.createdon
     })
     

     console.log("after sorting",this.tcvPopupData)
  }

  navigatetobusinesssolutionsearch() {
    // let dialogRef = this.dialog.open(OpenBusinessSolution, {
    //   width: "900px"
    //   });
    this.openDialogDelete("You will be navigated to business solution search page and all your unsaved data will be lost, please ensure that you have saved your changes before clicking on confirm", "Confirm", "Alert").subscribe(res => {
      if (res == 'save') {
      //  this.projectService.setSession("WTFlag", false);
            this.projectService.setSession("SMData",{WTFlag:false,type:'BS'});
        // commented as new popups are added as per new requirement
        this.router.navigate(['/opportunity/businesssolutionsearch']);
        // let dialogRef = this.dialog.open(OpenBusinessSolution, {
        //   width: "900px"
        //   });
      }
    });

  }

  OnBSPanelSLTCVChange(sltcvValue) {
    let tempSLTCVValue: any = sltcvValue;
    this.businessSOlutionData[0].Sltcv = tempSLTCVValue ? tempSLTCVValue.toString() : "";
  }

  overalltcvComma="";
  OnBSPanelSLTCVBlur(sltcvValue) {
    debugger;
    console.log("sltcvValue",sltcvValue);
    let tempSLTCVValue: any = sltcvValue;
     console.log("tempSLTCVValue",tempSLTCVValue);
    this.businessSOlutionData[0].Sltcv = tempSLTCVValue ? parseFloat(tempSLTCVValue).toFixed(2).toString() : "";
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
    
    this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Value this.overalltcvComma", this.overalltcvComma);
    for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
      if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
        let tempTCVPerc = this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv ? this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv : "0.00";
        this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv = (this.businessSOlutionData[0].Sltcv) ? ((parseFloat(this.businessSOlutionData[0].Sltcv) * parseFloat(tempTCVPerc)) / 100).toFixed(2).toString() : "";
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
      } else {
        let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00" && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
        this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
      }

    }

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

  getBusinessSolutionsTableData(res) {
    let smartsearchObj = this.projectService.getSession("smartsearchData");
    let smartsearchSL = (smartsearchObj && smartsearchObj.ServiceLineList) ? smartsearchObj.ServiceLineList : []
    let smartsearchIP = (smartsearchObj && smartsearchObj.IP) ? smartsearchObj.IP : []
    let smartsearchSol = (smartsearchObj && smartsearchObj.solutionList) ? smartsearchObj.solutionList : []
    if (res) {
      smartsearchSL.push.apply(smartsearchSL, (res.ResponseObject && res.ResponseObject.WiproServiceLineDtls) ? res.ResponseObject.WiproServiceLineDtls : []);
      smartsearchIP.push.apply(smartsearchIP, (res.ResponseObject && res.ResponseObject.WiproAllIPDetails) ? res.ResponseObject.WiproAllIPDetails : []);
      smartsearchSol.push.apply(smartsearchSol, (res.ResponseObject && res.ResponseObject.WiproBusinessSolutionDtls) ? res.ResponseObject.WiproBusinessSolutionDtls : []);
      this.createSLStructure(smartsearchSL);
      this.createIpStructure(smartsearchIP);
      this.createSolutionStructure(smartsearchSol);
      // this.createcreditAllocationStructure((res.ResponseObject && res.ResponseObject.CreditAllocationsDetails) ? res.ResponseObject.CreditAllocationsDetails : []);
      this.projectService.clearSession("smartsearchData");
    } else {
      this.createSLStructure(smartsearchSL);
      this.createIpStructure(smartsearchIP);
      this.createSolutionStructure(smartsearchSol);
      // this.createcreditAllocationStructure([]);
      this.projectService.clearSession("smartsearchData");
    }
  }

  //**************************************************************Service Line Methods Starts***************************************************/

  createSLStructure(BSSLoriginalDetails) {
    this.service.loaderhome = true;
    this.BSSLDetails = [];
    let BSSLlength = BSSLoriginalDetails.length;
    for (let i = 0; i < BSSLoriginalDetails.length; i++) {
      let cloudTCV = 0;
      let OrderBSSLoriginalDetails: any = {};
      OrderBSSLoriginalDetails.WiproOpportunityServicelineDetailId = BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId ? BSSLoriginalDetails[i].WiproOpportunityServicelineDetailId : "";
      OrderBSSLoriginalDetails.WiproServicelineidValue = BSSLoriginalDetails[i].WiproServicelineidValue ? BSSLoriginalDetails[i].WiproServicelineidValue : "";
      OrderBSSLoriginalDetails.WiproServicelineidValueName = BSSLoriginalDetails[i].WiproServicelineidValueName ? BSSLoriginalDetails[i].WiproServicelineidValueName : "";
      OrderBSSLoriginalDetails.WiproPracticeId = BSSLoriginalDetails[i].WiproPracticeId ? BSSLoriginalDetails[i].WiproPracticeId : "";
      OrderBSSLoriginalDetails.WiproPracticeName = BSSLoriginalDetails[i].WiproPracticeName ? BSSLoriginalDetails[i].WiproPracticeName : "";
      OrderBSSLoriginalDetails.WiproSubpracticeid = BSSLoriginalDetails[i].WiproSubpracticeid ? BSSLoriginalDetails[i].WiproSubpracticeid : "";
      OrderBSSLoriginalDetails.WiproSubpracticeName = BSSLoriginalDetails[i].WiproSubpracticeName ? this.getSymbol(BSSLoriginalDetails[i].WiproSubpracticeName) : "";
      OrderBSSLoriginalDetails.WiproSlbdmidValueName = BSSLoriginalDetails[i].WiproSlbdmidValueName ? BSSLoriginalDetails[i].WiproSlbdmidValueName : "";
      OrderBSSLoriginalDetails.WiproSlbdmid = BSSLoriginalDetails[i].WiproSlbdmid ? BSSLoriginalDetails[i].WiproSlbdmid : "";
      OrderBSSLoriginalDetails.WiproPercentageOftcv = BSSLoriginalDetails[i].WiproPercentageOftcv ? (parseFloat(BSSLoriginalDetails[i].WiproPercentageOftcv).toFixed(2)).toString() : "";
      OrderBSSLoriginalDetails.TransactioncurrencyidValue = this.businessSOlutionData[0].TransactionCurrencyId;
      OrderBSSLoriginalDetails.index = BSSLoriginalDetails[i].index;
      if(BSSLoriginalDetails[i].WiproEstsltcv)
      {
        OrderBSSLoriginalDetails.isAccepted =true ;
        OrderBSSLoriginalDetails.WiproEstsltcv = BSSLoriginalDetails[i].WiproEstsltcv ? (parseFloat(BSSLoriginalDetails[i].WiproEstsltcv).toFixed(2)).toString() : "";
      }
      else
      {
        OrderBSSLoriginalDetails.isAccepted =false ;
        OrderBSSLoriginalDetails.WiproEstsltcv = BSSLoriginalDetails[i].TaggedTCV ? (parseFloat(BSSLoriginalDetails[i].TaggedTCV).toFixed(2)).toString() : "";
      }
      OrderBSSLoriginalDetails.checkforAppirio = BSSLoriginalDetails[i].SFDCoppsluniqueid ? BSSLoriginalDetails[i].SFDCoppsluniqueid : "";
      OrderBSSLoriginalDetails.Cloud = BSSLoriginalDetails[i].Cloud ? JSON.parse(BSSLoriginalDetails[i].Cloud) : false;
      OrderBSSLoriginalDetails.wiproTaggedStatus = BSSLoriginalDetails[i].wiproTaggedStatus ? JSON.parse(BSSLoriginalDetails[i].wiproTaggedStatus) : false;
      OrderBSSLoriginalDetails.TaggedTCV = BSSLoriginalDetails[i].TaggedTCV ? parseFloat(BSSLoriginalDetails[i].TaggedTCV) : "";
      OrderBSSLoriginalDetails.WiproEngagementModel = BSSLoriginalDetails[i].WiproEngagementModel ? BSSLoriginalDetails[i].WiproEngagementModel : "";
      OrderBSSLoriginalDetails.WiproEngagementModelName = BSSLoriginalDetails[i].WiproEngagementModelName ? BSSLoriginalDetails[i].WiproEngagementModelName : "";
      OrderBSSLoriginalDetails.WiproDualCredit = BSSLoriginalDetails[i].WiproDualCredit ? BSSLoriginalDetails[i].WiproDualCredit : "";
      OrderBSSLoriginalDetails.WiproDualCreditName = BSSLoriginalDetails[i].WiproDualCreditName ? BSSLoriginalDetails[i].WiproDualCreditName : "";
      OrderBSSLoriginalDetails.OpportunityId = this.OpportunityId;
      OrderBSSLoriginalDetails.SLCAID = BSSLoriginalDetails[i].SLCAID ? BSSLoriginalDetails[i].SLCAID : "";
      OrderBSSLoriginalDetails.statecode = 0;
      OrderBSSLoriginalDetails.AdditionalServiceLinesDetails=BSSLoriginalDetails[i].AdditionalServiceLinesDetails?BSSLoriginalDetails[i].AdditionalServiceLinesDetails:{};
      OrderBSSLoriginalDetails.AdditionalServiceLinesCloudDetails = BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails ? (BSSLoriginalDetails[i].AdditionalServiceLinesCloudDetails.map(it=> {
        cloudTCV = cloudTCV + (it.WiproValue ? parseFloat(it.WiproValue) : 0);
         return Object.assign({ ...it, CloudStatecode: 0, CloudDetailid: '' })
      })) : [];
      let SLPractice = [];
      let SLSubPracticeDD = [];
      let SLslBDMDD = [];
      let selectedSLBDM = (BSSLoriginalDetails[i].WiproSlbdmidValueName && BSSLoriginalDetails[i].WiproSlbdmid) ? (new Array(Object.assign({
        'SysGuid': BSSLoriginalDetails[i].WiproSlbdmid,
        'Name': BSSLoriginalDetails[i].WiproSlbdmidValueName,
        'EmailID': '',
        'Id': BSSLoriginalDetails[i].WiproSlbdmid
      }))) : [];
      let EngagementModelDD = [];
      this.checkMandatoryCloud(OrderBSSLoriginalDetails, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, BSSLlength);
      // if(i == BSSLlength-1)
      // {
      //   this.service.loaderhome = false;
      // } 
  }
   
    if (BSSLlength == 0) {
      this.serviceLineLoader = false;
    }
  }


  checkMandatoryCloud(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength) {
    let obj = {
      ServiceLineID: BSSLoriginalDetailsObj.WiproServicelineidValue,
      PracticeID: BSSLoriginalDetailsObj.WiproPracticeId,
      SubPracticeID: BSSLoriginalDetailsObj.WiproSubpracticeid
    }
    let cloudFlag = false;
    // if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId) {
      this.projectService.getCloudDetails(obj).subscribe(res => {
        cloudFlag = (res.ResponseObject && res.ResponseObject.WiproClouddetailsrequired) ? res.ResponseObject.WiproClouddetailsrequired : false;
        this.getSLPracticeDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      }, err => {
        this.getSLPracticeDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      });
    // } else {
    //   this.getSLPracticeDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
    // }
  }

  getSLPracticeDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag) {
    if (BSSLoriginalDetailsObj.WiproServicelineidValue) {
      this.projectService.getIpPractice(BSSLoriginalDetailsObj.WiproServicelineidValue).subscribe(res => {
        SLPractice = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      }, err => {
        this.getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);

      });

    } else {
      if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId != "") {
        this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      } else {
        this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);

      }

    }
  }



  getEngagementModelDD(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag) {
    this.projectService.getEngagementModelData(BSSLoriginalDetailsObj.WiproServicelineidValue).subscribe(res => {
      EngagementModelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.getBSSLSubPracticeandSLBDM(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
    }, err => {
      this.getBSSLSubPracticeandSLBDM(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);

    });
  }


  getBSSLSubPracticeandSLBDM(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag) {
         
        if (BSSLoriginalDetailsObj.WiproServicelineidValue && BSSLoriginalDetailsObj.WiproPracticeId) {
          this.projectService.getSLSubPractice(BSSLoriginalDetailsObj.WiproPracticeId).subscribe(res => {
            SLSubPracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
           SLSubPracticeDD.forEach(item => {
              (item.Name) ? item.Name = this.getSymbol(item.Name) : 'NA';
            })
            if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId != "") {
              this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
            } else {
              this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
            }
          },
            err => {
              if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId != "") {
                this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
              } else {
                this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
              }
            });

    } else {
      if (BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId != "") {
        this.PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      } else {
        this.PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD, selectedSLBDM,cloudTCV, i, SLlength, cloudFlag);
      }
    }

    // if(i == SLlength -1)
    // {
    //   this.service.loaderhome = false;
    // }

  }  

  PushToBSSLArray(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag) {

    let DisableSLPracSP = (BSSLoriginalDetailsObj.WiproSlbdmid && BSSLoriginalDetailsObj.WiproSlbdmidValueName) ? false : false;
    this.BSSLDetails.push(Object.assign({}, new serviceLineBSDetails(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM, false, false, cloudFlag, DisableSLPracSP,cloudTCV,

      "BSSLName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSPracticeName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSSubPracticeName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSSlBDMName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSPercTCVName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSSLTCVName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSCloudName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSEngagementName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId,
      "BSDualCreditName" + i + "SavedData" + BSSLoriginalDetailsObj.WiproOpportunityServicelineDetailId)));

    if (i == (SLlength - 1)) {
      this.serviceLineLoader = false;
      this.service.loaderhome = false;
      console.log("asd", this.BSSLDetails);
      if(this.isRegionChange)
      {
         this.openDialogDelete("Region has been changed.Kindly add new SLBDM", "Ok", "Region Change").subscribe(res => {
          if (res == 'save') {
           
          }
        });
      }
    }
  }


  PushToBSSLArrayForSmartSearch(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM,cloudTCV, i, SLlength, cloudFlag) {
    let BSSLnamelength = this.BSSLDetails.length + 1;
    this.newBSSLDataCount = this.newBSSLDataCount + 1;
    let DisableSLPracSP = (BSSLoriginalDetailsObj.WiproSlbdmid && BSSLoriginalDetailsObj.WiproSlbdmidValueName) ? false : false;
    this.BSSLDetails.push(Object.assign({}, new serviceLineBSDetails(BSSLoriginalDetailsObj, SLPractice, SLSubPracticeDD, SLslBDMDD, EngagementModelDD,selectedSLBDM, false, true, cloudFlag, DisableSLPracSP,cloudTCV,

      "BSSLName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSubPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSlBDMName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPercTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSLTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSCloudName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSEngagementName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSDualCreditName" + this.newBSSLDataCount + "NewData" + BSSLnamelength)));
    if (i == (SLlength - 1)) {
      this.serviceLineLoader = false;
      this.service.loaderhome = false;
    }
  }

  navigatetoBSSLCloud(ServiceLIneData, i, showCloud) {
    debugger;
    this.projectService.setSession("SLObjForCloud", { });
      console.log("servicelinedata",ServiceLIneData);
      // this.router.navigate(['/opportunity/servicelineadditionaldetails']);
      let servicelineName = ServiceLIneData.WiproServicelineidValueName;
      let tempBSpracticeDD = this.BSSLDetails[i].SlpracticeDD.filter(it => it.SysGuid == ServiceLIneData.WiproPracticeId);
      let practiceName = tempBSpracticeDD.length > 0 ? tempBSpracticeDD[0].Name : "";
      let tempBSSubPracticeDD = this.BSSLDetails[i].SlSubpracticeDD.filter(it => it.SubPracticeId == ServiceLIneData.WiproSubpracticeid);
      let subPracticeName = tempBSSubPracticeDD.length > 0 ? tempBSSubPracticeDD[0].Name : "";
      let dialogRef = this.dialog.open(OpenServiceline, {
        width: "1000px",
        data:{ servicelineName: servicelineName, practiceName: practiceName, subPracticeName: subPracticeName,currencySymbol: this.CurrencySymbol,Details: ServiceLIneData, OverAllTCV: this.businessSOlutionData[0].OverallTcv,TransactionCurrencyId: this.businessSOlutionData[0].TransactionCurrencyId, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, ShowCloud: showCloud}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("result",result);
        if(result.additionServicelineDetails)
        {
          this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesDetails=result.additionServicelineDetails;
        }       
        if (result && result.cloudData) {
          this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails = result.cloudData;          

          this.BSSLDetails[i].CloudTCV  =  result.cloudTCV ? parseFloat(result.cloudTCV) : 0;
          let cloudDataLength=result.cloudData.filter((it)=>it.CloudStatecode==0).length;
          console.log("length",cloudDataLength);
          if(cloudDataLength == 0){

            this.BSSLDetails[i].BSServiceLine.Cloud = false;
          }
          else {
            this.BSSLDetails[i].BSServiceLine.Cloud = true;
          }
        }else{
          this.BSSLDetails[i].CloudTCV  =  0;
        }
      });

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

  getBSSLPracticeData(ServiceLIneData, i) {
    this.BSSLDetails[i].SlSubpracticeDD = [];
    this.BSSLDetails[i].SlSLBDMDD = [];
    this.BSSLDetails[i].BSServiceLine.WiproPracticeId = "";
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    this.BSSLDetails[i].selectedSLBDM = [];
    this.BSSLDetails[i].BSServiceLine.WiproDualCredit = "";
    this.BSSLDetails[i].BSServiceLine.WiproDualCreditName= "";
    this.BSSLDetails[i].BSServiceLine.WiproEngagementModel = "";
    if (ServiceLIneData.WiproServicelineidValue) {
      this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName = (this.IpandServiceLinelDD.filter(it => it.SysGuid == ServiceLIneData.WiproServicelineidValue))[0].Name;
      this.projectService.getIpPractice(ServiceLIneData.WiproServicelineidValue).subscribe(res => {
        this.BSSLDetails[i].SlpracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (this.BSSLDetails[i].SlpracticeDD.length == 0) {
          // if (this.BSSLDetails[i].BSServiceLine.WiproOpportunityServicelineDetailId) {
            this.cloudDetailsApi(i);
          // }
          this.getBSSLSlBDMData(ServiceLIneData, i, "");
        }

      },
        err => {
          this.BSSLDetails[i].SlpracticeDD = [];
        });

      this.projectService.getEngagementModelData(ServiceLIneData.WiproServicelineidValue).subscribe(res => {
        this.BSSLDetails[i].EngagementModelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      },
        err => {
          this.BSSLDetails[i].EngagementModelDD = [];
        });
    }
    else {
      this.BSSLDetails[i].SlpracticeDD = [];
      this.BSSLDetails[i].EngagementModelDD = [];
      this.BSSLDetails[i].BSServiceLine.WiproServicelineidValueName = "";
    }
  }


  getBSSLSubPracticeData(ServiceLIneData, i) {
    debugger;
    let index=0;
    this.BSSLDetails[i].SlSLBDMDD = [];
    this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid = "";
    if(!this.disableOnRoleBSSL)
    { 
      this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
      this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    }    
    console.log("api drop",this.BSSLDetails[i].SlpracticeDD);
    console.log("api drop",this.BSSLDetails[i].BSServiceLine.WiproPracticeId);
    for(let j=0;j<this.BSSLDetails[i].SlpracticeDD.length;j++){
      if(this.BSSLDetails[i].BSServiceLine.WiproPracticeId==this.BSSLDetails[i].SlpracticeDD[j].SysGuid)
      {
        index=j;
        this.BSSLDetails[i].BSServiceLine.WiproPracticeName = this.BSSLDetails[i].SlpracticeDD[index].Name;
      }
    }
    console.log("api drop",this.BSSLDetails[i].SlpracticeDD[index].Name);
    
    this.BSSLDetails[i].selectedSLBDM = [];
    if (ServiceLIneData.WiproServicelineidValue && ServiceLIneData.WiproPracticeId) {
      this.projectService.getSLSubPractice(ServiceLIneData.WiproPracticeId).subscribe(res => {
        this.BSSLDetails[i].SlSubpracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.BSSLDetails[i].SlSubpracticeDD.forEach(item => {
              (item.Name) ? item.Name = this.getSymbol(item.Name) : 'NA';
            })
        if (this.BSSLDetails[i].SlSubpracticeDD.length == 0) {
          // if (this.BSSLDetails[i].BSServiceLine.WiproOpportunityServicelineDetailId) {
            this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = "";
            this.cloudDetailsApi(i)
          // }
          if(!this.disableOnRoleBSSL)
          {
            this.getBSSLSlBDMData(ServiceLIneData, i, "");
          }
         
        }

      },
        err => {
          this.BSSLDetails[i].SlSubpracticeDD = [];
        });
    }
    else {
      this.BSSLDetails[i].SlSubpracticeDD = [];
    }
  }

  mandatoryCloudCheck(ServiceLIneData, i) {
      let index=0;
      console.log("event",this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid)
      console.log("event",this.BSSLDetails[i].SlSubpracticeDD)
      
    // if (this.BSSLDetails[i].BSServiceLine.WiproOpportunityServicelineDetailId) {
      this.cloudDetailsApi(i)
      for(let j=0;j<this.BSSLDetails[i].SlSubpracticeDD.length;j++){
          if(this.BSSLDetails[i].BSServiceLine.WiproSubpracticeid == this.BSSLDetails[i].SlSubpracticeDD[j].SubPracticeId)
          {
            index=j;
          }
      }
      this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = this.BSSLDetails[i].SlSubpracticeDD[index].Name;
    // }
    // this.BSSLDetails[i].BSServiceLine.WiproSubpracticeName = event.source._elementRef.nativeElement.textContent;
    if(!this.disableOnRoleBSSL){
      this.getBSSLSlBDMData(ServiceLIneData, i, "");
    }
    
  }

  // getBSSLSlBDMData(ServiceLIneData, i) {
  //   this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
  //   this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
  //   this.projectService.getSLSLBDM(ServiceLIneData.WiproServicelineidValue, ServiceLIneData.WiproPracticeId, ServiceLIneData.WiproSubpracticeid).subscribe(res => {
  //     this.BSSLDetails[i].SlSLBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
  //     if (this.BSSLDetails[i].SlSLBDMDD.length == 1) {
  //       this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = this.BSSLDetails[i].SlSLBDMDD[0].SysGuid;
  //       this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = this.BSSLDetails[i].SlSLBDMDD[0].Name;
  //       this.BSSLDetails[i].BSServiceLine.SLCAID = Math.random().toString(36).substring(2);
  //       this.addDefaultcredit(this.BSSLDetails[i].SlSLBDMDD[0], ServiceLIneData, i, this.BSSLDetails[i].BSServiceLine.SLCAID);
  //     }
  //   },
  //     err => {
  //       this.BSSLDetails[i].SlSLBDMDD = [];
  //     });

  // }

  getBSSLSlBDMData(ServiceLIneData, i, searchValue) {
    debugger;
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
    this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
    this.BSSLDetails[i].selectedSLBDM = [];
    this.addIPservice.getSLBDMDropDownList1(ServiceLIneData.WiproServicelineidValue, ServiceLIneData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.BSSLDetails[i].SlSLBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];

      if (this.BSSLDetails[i].SlSLBDMDD.length == 1) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = this.BSSLDetails[i].SlSLBDMDD[0].SysGuid;
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = this.BSSLDetails[i].SlSLBDMDD[0].Name;
        this.BSSLDetails[i].BSServiceLine.SLCAID = Math.random().toString(36).substring(2);
        this.addDefaultcredit(this.BSSLDetails[i].SlSLBDMDD[0], ServiceLIneData, i, this.BSSLDetails[i].BSServiceLine.SLCAID);
      }
      if(res && res.IsError == false && res.ResponseObject && res.ResponseObject.length<1){
        this.projectService.displayMessageerror("No records found for SL BDM! could you raise a helpline ticket")
      }
    },
      err => {
        this.BSSLDetails[i].SlSLBDMDD = [];
      });

  }

  OnChangegetBSSLSlBDMData(ServiceLIneData, i, searchValue) {
    this.BSSLDetails[i].BSServiceLine.SLBDMLoaderSL=true;
    this.addIPservice.getSLBDMDropDownList1(ServiceLIneData.WiproServicelineidValue, ServiceLIneData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.BSSLDetails[i].BSServiceLine.SLBDMLoaderSL=false;
      this.BSSLDetails[i].SlSLBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.BSSLDetails[i].BSServiceLine.SLBDMLoaderSL=false;
        this.BSSLDetails[i].SlSLBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    debugger;
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
      if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
        let defaultCAIndex = this.creditAllocationdataDetails.findIndex((element, ind) => {
          return (element.creditAllocation.WiproIsDefault == true && element.creditAllocation.SLCAID == this.BSSLDetails[i].BSServiceLine.SLCAID);
        });
        if (defaultCAIndex >= 0) {
          // this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          // this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = "";
          // this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = "";
          //ask sumit about the change
          this.creditAllocationdataDetails[defaultCAIndex].bdmDD = [];
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMId = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
          this.creditAllocationdataDetails[defaultCAIndex].creditAllocation.ServicelineBDMName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
          this.creditAllocationdataDetails[defaultCAIndex].selectedCABDM = [{ Name: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "", SysGuid: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "", EmailID: '', Id: (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "" }];
        }

      }

    } else {

      if (!this.BSSLDetails[i].selectedSLBDM.some(res => res.SysGuid == rowData.WiproSlbdmid && res.Name == rowData.WiproSlbdmidValueName)) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
        this.BSSLDetails[i].selectedSLBDM = [];
        if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
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

  }

  getSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
debugger;
    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServicelineidValue, rowData.WiproPracticeId, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
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

  BSSLbdmNameclose(ServiceLIneData, i, event) {
    let id = 'advanceBSSLSLBDMSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.BSSLDetails[i].SLSLBDMSwitchName = false;
      this.OdatanextLink = null;
      if (!this.BSSLDetails[i].selectedSLBDM.some(res => res.SysGuid == ServiceLIneData.WiproSlbdmid && res.Name == ServiceLIneData.WiproSlbdmidValueName)) {
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmid = "";
        this.BSSLDetails[i].BSServiceLine.WiproSlbdmidValueName = "";
        this.BSSLDetails[i].selectedSLBDM = [];
        if (this.BSSLDetails[i].BSServiceLine.SLCAID) {
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
  }


  checkForBSSLCloud(ServiceLIneData, i, disabled) {
    console.log("disabled",disabled);
    if(!(this.IsAppirio && ServiceLIneData.checkforAppirio.length>0))
    {
      if (disabled == false && (this.disableOnRoleBSSL == false || (this.isMultipleSLBDM && this.userGuid==ServiceLIneData.WiproSlbdmid) || this.isPreSales)) {
            if (ServiceLIneData.Cloud == false) {
              if ((ServiceLIneData.AdditionalServiceLinesCloudDetails).length <= 0) {
                setTimeout(() => {
                  this.BSSLDetails[i].BSServiceLine.Cloud = false;
                })
                this.navigatetoBSSLCloud(ServiceLIneData, i, true);
                //this.projectService.displayMessageerror("There are no cloud details present for " + this.converIndextoString(i) + " row of service lines table, Please add the cloud then proceed with the action");
              } else {
                setTimeout(() => {
                  this.BSSLDetails[i].BSServiceLine.Cloud = true;
                })
                this.navigatetoBSSLCloud(ServiceLIneData, i, true);
              }
            }
            else
            {
              console.log("data",this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails);
             this.openDialogDelete("Cloud details will be removed on Save of SL details.", "Confirm", "Delete Cloud").subscribe(res => {
             if (res == 'save') {
              this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails.map((it)=>it.CloudStatecode=1);
              console.log("data after delete",this.BSSLDetails[i].BSServiceLine.AdditionalServiceLinesCloudDetails);
              this.projectService.displayMessageerror("Cloud details have been deleted");
            }
            else{
              this.BSSLDetails[i].BSServiceLine.Cloud = true;
            }
            });     
              
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
    console.log("seldataSLBDm", this.BSSLDetails[i].selectedSLBDM);
    if (!this.BSSLDetails[i].BSServiceLine.SLCAID) {
      this.BSSLDetails[i].BSServiceLine.SLCAID = Math.random().toString(36).substring(2);
      this.addDefaultcredit(selectedData, ServiceLIneData, i, this.BSSLDetails[i].BSServiceLine.SLCAID);

    } else {

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


  }

  tempCADD: any = [];
  addDefaultcredit(selectedData, ServiceLIneData, i, SLCAID) {
    console.log("selected", selectedData);
    let tempBSSLDetails = this.BSSLDetails.filter(it => it.BSServiceLine.SLCAID);
    console.log("selecte123d", this.BSSLDetails);
    this.tempCADD = [];
    tempBSSLDetails.forEach((it, index, selfSL) => {
      if (it.BSServiceLine.WiproServicelineidValue) {

        if (index == selfSL.findIndex((item) => (item.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue))) {
          let tempBSPractice = tempBSSLDetails.filter(itprac => itprac.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue);

          let tempPracticeDD = [];
          tempBSPractice.forEach((itpracobj, index, selfPrac) => {
            if (itpracobj.BSServiceLine.WiproPracticeId) {
              if (index == selfPrac.findIndex((itemprac) => itemprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId)) {
                let tempSubPractice = tempBSPractice.filter(itsubprac => itsubprac.BSServiceLine.WiproServicelineidValue == itpracobj.BSServiceLine.WiproServicelineidValue && itsubprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId);
                let filteredPractice: any = itpracobj.SlpracticeDD.filter(filprac => filprac.SysGuid == itpracobj.BSServiceLine.WiproPracticeId);
                let practiceOBJName = (filteredPractice.length > 0) ? filteredPractice[0].Name : "";

                let tempSubPracticeDD = [];
                tempSubPractice.forEach((itsubpracobj, index, selfsubprac) => {

                  if (itsubpracobj.BSServiceLine.WiproSubpracticeid) {
                    if (index == selfsubprac.findIndex((itemsubprac) => itemsubprac.BSServiceLine.WiproSubpracticeid == itsubpracobj.BSServiceLine.WiproSubpracticeid)) {
                      let filteredSubPractice: any = itsubpracobj.SlSubpracticeDD.filter(filsubprac => filsubprac.SubPracticeId == itsubpracobj.BSServiceLine.WiproSubpracticeid);
                      let subpracticeOBJName = (filteredSubPractice.length > 0) ? filteredSubPractice[0].Name : "";
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


    this.creditAllocationSLDD = this.tempCADD.map(res => {
      return {
        ServicelineId: res.ServicelineId,
        ServicelineIdName: res.ServicelineIdName,
        ErrorResponse: ""
      }
    })

    this.creditAllocationdataDetails.forEach(res => {
      if (!res.creditAllocation.WiproIsDefault) {
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
          }
        }
      }
    })















    console.log("asd", this.tempCADD);
    this.service.loaderhome = true;
    let newCreditDetails: creditAllocationInterface = {
      SLCAID: SLCAID,
      ServicelineId: ServiceLIneData.WiproServicelineidValue,
      PracticeId: ServiceLIneData.WiproPracticeId,
      SubPracticeId: ServiceLIneData.WiproSubpracticeid,
      ServicelineBDMId: ServiceLIneData.WiproSlbdmid,
      ServicelineBDMName: ServiceLIneData.WiproSlbdmidValueName,
      WiproIsDefault: true,
      WiproTypeId: 184450000,
      WiproValue: "0",
      WiproOpportunityCreditAllocationID: "",
      Contribution: "100.00",
      WiproOpportunityId: this.OpportunityId,
      statecode: 0
    }
    let PracticeName = ServiceLIneData.WiproPracticeId ? (this.BSSLDetails[i].SlpracticeDD.filter(it => it.SysGuid == ServiceLIneData.WiproPracticeId)[0].Name) : "";
    let SubpracticeName = ServiceLIneData.WiproSubpracticeid ? (this.BSSLDetails[i].SlSubpracticeDD.filter(it => it.SubPracticeId == ServiceLIneData.WiproSubpracticeid)[0].Name) : "";
    let tempCAPracticeDD = ServiceLIneData.WiproPracticeId ? ([{ PracticeIdName: PracticeName, PracticeId: ServiceLIneData.WiproPracticeId, ErrorResponse: "" }]) : [];
    let tempCASubPracticeDD = ServiceLIneData.WiproSubpracticeid ? ([{ SubPracticeIdName: SubpracticeName, SubPracticeId: ServiceLIneData.WiproSubpracticeid, ErrorResponse: "" }]) : [];
    let tempCASLBDMDD = [];
    let tempselectedCABDM = [{ SysGuid: ServiceLIneData.WiproSlbdmid, Name: ServiceLIneData.WiproSlbdmidValueName, EmailID: '', Id: ServiceLIneData.WiproSlbdmid }];
    let namelength = this.creditAllocationdataDetails.length + 1;
    this.newCADataCount = this.newCADataCount + 1;
    this.creditAllocationdataDetails.unshift(Object.assign({}, new creditAllocationDetails(newCreditDetails, tempCASLBDMDD, tempCAPracticeDD, tempCASubPracticeDD, tempselectedCABDM, false, true,
      "CredetType" + this.newCADataCount + "NewData" + namelength,
      "BDM" + this.newCADataCount + "NewData" + namelength,
      "SL" + this.newCADataCount + "NewData" + namelength,
      "Practice" + this.newCADataCount + "NewData" + namelength,
      "SubPractice" + this.newCADataCount + "NewData" + namelength,
      "Value" + this.newCADataCount + "NewData" + namelength,
      "Contribution" + this.newCADataCount + "NewData" + namelength)));
    this.BSSLDetails[i].DisableSLPracSP = false;
    this.service.loaderhome = false;
  }

  OnBSPercTCVChange(ServiceLIneData, i) {
    let tempTCV: any = ServiceLIneData.WiproPercentageOftcv.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = tempTCV ? tempTCV[0].toString() : "";
  }

  OnBSPercTCVBlur(ServiceLIneData, i) {
    let tempTCV: any = ServiceLIneData.WiproPercentageOftcv.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
    if (tempTCV) {
      if (tempTCV[0] <= 100 && tempTCV[0] > 0) {
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = (this.businessSOlutionData[0].Sltcv) ? ((parseFloat(this.businessSOlutionData[0].Sltcv) * parseFloat(tempTCV[0])) / 100).toFixed(2).toString() : "";
      }
      else {
        this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
        this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
        this.projectService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100 for the " + this.converIndextoString(i) + " row of service lines table");
      }

    } else {
      this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = "";
    }
  }

  OnBSSLTCVChange(ServiceLIneData, i) {
    debugger;
    console.log("SLTCV", ServiceLIneData.WiproEstsltcv);
    let tempSLTCVValue: any = ServiceLIneData.WiproEstsltcv;
    this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = tempSLTCVValue ?tempSLTCVValue: "";
  }


  OnBSSLTCVBlur(ServiceLIneData, i) {
    let tempSLTCVValue: any = ServiceLIneData.WiproEstsltcv;
    this.BSSLDetails[i].BSServiceLine.WiproEstsltcv = tempSLTCVValue ? parseFloat(tempSLTCVValue).toFixed(2).toString() : "";
    if (!ServiceLIneData.WiproDualCredit) {
      let sumofSLTCV: any = this.BSSLDetails.reduce(function (prevVal, elem) {
        if (!(elem.BSServiceLine.WiproDualCredit)) {
          let SLTCV: any;
          if(elem.BSServiceLine.wiproTaggedStatus==false && elem.BSServiceLine.TaggedTCV>0)
          { 
              SLTCV = 0;
          }
          else
          {
              SLTCV= (elem.BSServiceLine.WiproEstsltcv.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
          }          
          return prevVal + (SLTCV ? parseFloat(SLTCV[0]) : 0);
        } else {
          return prevVal;
        }
      }, 0);
      this.businessSOlutionData[0].Sltcv = parseFloat(sumofSLTCV).toFixed(2).toString();
      this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();

      this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      console.log("Value this.overalltcvComma2", this.overalltcvComma);
      for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
        if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
          let tempSliTCV: any = (this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].Sltcv != '0.00' && this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) ? ((parseFloat(this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) * 100) / parseFloat(this.businessSOlutionData[0].Sltcv)).toString() : "";
          this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv = tempSliTCV ? parseFloat(tempSliTCV).toFixed(2).toString() : "";
        }
      }

      for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
        if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
          let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != '0.00' && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
          this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
        } else {
          let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != '0.00' && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
          this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
        }

      }
    }

  }



  TCVChangeonDulaCredit(ServiceLIneData, i) {
    
    if (!ServiceLIneData.WiproDualCredit) {
      console.log("dfffdgdfg",ServiceLIneData);
      this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = "";
      this.resetSLTCVandOverAllTCV();
    } else {
      this.BSSLDetails[i].BSServiceLine.WiproPercentageOftcv = "";
      let selectedDualCredit = [];
      selectedDualCredit = this.BSDualCreditDD.filter(item => item.Id == ServiceLIneData.WiproDualCredit);
      if(selectedDualCredit.length > 0 ) {
        this.BSSLDetails[i].BSServiceLine.WiproDualCreditName = selectedDualCredit[0].Name;
      }
      this.resetSLTCVandOverAllTCV();
    }
  }




  addNewSL() {
    this.saveFlag = false;
    this.service.loaderhome = true;
    let BSSLObj: serviceLineBSnterface = {
      wiproTaggedStatus: false,
      SLCAID: "",
      statecode: 0,
      OpportunityId: this.OpportunityId,
      Cloud: false,
      WiproDualCredit: "",
      WiproDualCreditName:"",
      WiproEngagementModel: "",
      WiproEngagementModelName: "",
      WiproEstsltcv: "",
      TaggedTCV:0,
      isAccepted:true,
      WiproOpportunityServicelineDetailId: "",
      WiproPercentageOftcv: "",
      TransactioncurrencyidValue:this.businessSOlutionData[0].TransactionCurrencyId,
      checkforAppirio:"",
      WiproPracticeId: "",
      WiproPracticeName:"",
      WiproServicelineidValue: "",
      WiproServicelineidValueName: "",
      WiproSlbdmidValueName: "",
      WiproSlbdmid: "",
      WiproSubpracticeid: "",
      WiproSubpracticeName:"",
      AdditionalServiceLinesDetails: [],
      AdditionalServiceLinesCloudDetails: [],
      SLBDMLoaderSL:false,
      index: 0
    };
    let BSSLnamelength = this.BSSLDetails.length + 1;
    this.newBSSLDataCount = this.newBSSLDataCount + 1;


    this.BSSLDetails.unshift(Object.assign({}, new serviceLineBSDetails(BSSLObj, [], [], [], [],[], false, false, false, false,0,

      "BSSLName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSubPracticeName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSlBDMName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSPercTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSSLTCVName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSCloudName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSEngagementName" + this.newBSSLDataCount + "NewData" + BSSLnamelength,
      "BSDualCreditName" + this.newBSSLDataCount + "NewData" + BSSLnamelength)));

       this.BSSLDetails.forEach((item,index) => {
        item.BSServiceLine.index = index + 1;
      })
      this.BSSLDetails = this.BSSLDetails.concat([]);
    this.service.loaderhome = false;
  }

  acceptServiceLine(ServiceLIneData, searchText, i)
  {
     this.BSSLDetails[i].BSServiceLine.isAccepted=true;
     this.BSSLDetails[i].BSServiceLine.wiproTaggedStatus=true;
     let overAllTcv=parseFloat(this.businessSOlutionData[0].OverallTcv) + parseFloat(this.BSSLDetails[i].BSServiceLine.WiproEstsltcv);
     this.businessSOlutionData[0].Sltcv=parseFloat(this.businessSOlutionData[0].Sltcv) + parseFloat(this.BSSLDetails[i].BSServiceLine.WiproEstsltcv);
     this.businessSOlutionData[0].OverallTcv=overAllTcv;
     this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     for(var k=0;k<this.BSSLDetails.length;k++)
     {
       if(!(!this.BSSLDetails[k].BSServiceLine.WiproEstsltcv && this.BSSLDetails[k].BSServiceLine.isAccepted==false))
       {
        this.BSSLDetails[k].BSServiceLine.WiproPercentageOftcv=((parseFloat(this.BSSLDetails[k].BSServiceLine.WiproEstsltcv) * 100)/overAllTcv).toFixed(2).toString();
       }
     }
  }

  rejectServiceLine(ServiceLIneData, searchText, i)  
  { 
    let saveObject = { OppBSP: {}, WiproBusinessSolutionDtls: [], WiproAllIPDetails: [], WiproServiceLineDtls: [], CreditAllocationsDetails: [] };
    
    for(let index=0;index<this.BSSLDetails.length;index++)
    {
      let BSSLObj = this.BSSLDetails[i].BSServiceLine;
      if(index == i)
      {
        BSSLObj.statecode = 1;
      }
      saveObject.WiproServiceLineDtls.push(BSSLObj);
    }
    // this.BSSLDetails.splice(i, 1);
    this.service.loaderhome = true;

    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {
      if (res && res.IsError == false) {
        this.service.loaderhome = false;
        console.log("rejected successfully");
         this.getBusinessSolutionPanelData(this.OpportunityId);
      } else {
        this.service.loaderhome = false;
        this.projectService.throwError(res.Message);
      }
    }, err => {
      this.service.loaderhome = false;
       this.projectService.displayerror("Error Occured While Saving data");
    }) 
   

  }
 
  deletBSSLValidation(ServiceLIneData, searchText, i) {
    debugger;
    if (this.BSSLDetails.length <= 1) {
      this.projectService.displayMessageerror("Single service line cannot be deleted.");
      return;
    }
    else {


      this.businessSOlutionData[0].OverallTcv = (parseFloat(this.businessSOlutionData[0].OverallTcv) - parseFloat(ServiceLIneData.WiproEstsltcv)).toString();
      if (ServiceLIneData.WiproOpportunityServicelineDetailId) {
        if (ServiceLIneData.WiproServicelineidValueName == this.CIS && ServiceLIneData.WiproDualCredit == "") {
          let dualFilterdCRSData: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CRS && it.BSServiceLine.WiproDualCredit != "" && it.BSServiceLine.WiproOpportunityServicelineDetailId);
          if (dualFilterdCRSData.length > 0) {
            let nonDualCISData: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CIS && it.BSServiceLine.WiproDualCredit == "" && it.BSServiceLine.WiproOpportunityServicelineDetailId);
            if (nonDualCISData.length > 1) {
              this.checksaveOBJonSLdelete(ServiceLIneData, searchText, i);
            } else {
              this.projectService.displayMessageerror("Please add Cloud & Infrastructure Services (CIS) service line as Non Dual Credit for Dual-Credit Reason: CIS - CRS Dual Credit");
              return;
            }
          } else {
            this.checksaveOBJonSLdelete(ServiceLIneData, searchText, i);
          }
        } else if (ServiceLIneData.WiproServicelineidValueName == this.CRS && ServiceLIneData.WiproDualCredit == "") {
          let dualFilterdCISData: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CIS && it.BSServiceLine.WiproDualCredit != "" && it.BSServiceLine.WiproOpportunityServicelineDetailId);
          if (dualFilterdCISData.length > 0) {
            let nonDualCRSData: any = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CRS && it.BSServiceLine.WiproDualCredit == "" && it.BSServiceLine.WiproOpportunityServicelineDetailId);
            if (nonDualCRSData.length > 1) {
              this.checksaveOBJonSLdelete(ServiceLIneData, searchText, i);
            } else {
              this.projectService.displayMessageerror("Please add Cybersecurity & Risk Services (CRS) service line as Non Dual Credit for Dual-Credit Reason: CIS - CRS Dual Credit");
              return;
            }
          } else {
            this.checksaveOBJonSLdelete(ServiceLIneData, searchText, i);
          }
        } else {
          this.checksaveOBJonSLdelete(ServiceLIneData, searchText, i);
        }
      } else {
            if (ServiceLIneData.SLCAID)
             {
                this.deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i);
              }
              else {
                this.BSSLDetails.splice(i, 1);
                this.resetSLTCVandOverAllTCV();
              }
      }
    }
  }

  deleteSLandCreditAllocationIfnotsaved(ServiceLIneData, i) {
    let filterdelBSSLDetailsLength = this.BSSLDetails.filter(it => it.BSServiceLine.SLCAID && it.BSServiceLine.WiproServicelineidValue == ServiceLIneData.WiproServicelineidValue &&
      it.BSServiceLine.WiproPracticeId == ServiceLIneData.WiproPracticeId && it.BSServiceLine.WiproSubpracticeid == ServiceLIneData.WiproSubpracticeid).length;
    if (filterdelBSSLDetailsLength > 1) {
      let index = this.creditAllocationdataDetails.findIndex((element, ind) => {
        return (element.creditAllocation.SLCAID == ServiceLIneData.SLCAID && element.creditAllocation.WiproIsDefault == true);
      });
      this.creditAllocationdataDetails.splice(index, 1);
      this.BSSLDetails.splice(i, 1);
      this.resetSLTCVandOverAllTCV();
      this.projectService.throwError("Service line deleted successfully");
    } else {
      for (let ca = this.creditAllocationdataDetails.length - 1; ca >= 0; ca--) {
        if (this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId == ServiceLIneData.WiproServicelineidValue &&
          this.creditAllocationdataDetails[ca].creditAllocation.PracticeId == ServiceLIneData.WiproPracticeId && this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId == ServiceLIneData.WiproSubpracticeid) {
          if (this.creditAllocationdataDetails[ca].creditAllocation.WiproOpportunityCreditAllocationID && this.creditAllocationdataDetails[ca].creditAllocation.WiproIsDefault == false) {
            this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId = "";
            this.creditAllocationdataDetails[ca].creditAllocation.PracticeId = "";
            this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId = "";
            this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMId = "";
            this.creditAllocationdataDetails[ca].creditAllocation.ServicelineBDMName = "";
            this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = "";
            this.creditAllocationdataDetails[ca].creditAllocation.Contribution = "";
          } else {
            this.creditAllocationdataDetails.splice(ca, 1);
          }
        }
      }
      this.BSSLDetails.splice(i, 1);
      let tempBSSLDetails = this.BSSLDetails.filter(it => it.BSServiceLine.SLCAID);
      this.tempCADD = [];
      tempBSSLDetails.forEach((it, index, selfSL) => {
        if (it.BSServiceLine.WiproServicelineidValue) {

          if (index == selfSL.findIndex((item) => (item.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue))) {
            let tempBSPractice = tempBSSLDetails.filter(itprac => itprac.BSServiceLine.WiproServicelineidValue == it.BSServiceLine.WiproServicelineidValue);

            let tempPracticeDD = [];
            tempBSPractice.forEach((itpracobj, index, selfPrac) => {
              if (itpracobj.BSServiceLine.WiproPracticeId) {
                if (index == selfPrac.findIndex((itemprac) => itemprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId)) {
                  let tempSubPractice = tempBSPractice.filter(itsubprac => itsubprac.BSServiceLine.WiproServicelineidValue == itpracobj.BSServiceLine.WiproServicelineidValue && itsubprac.BSServiceLine.WiproPracticeId == itpracobj.BSServiceLine.WiproPracticeId);
                  let filteredPractice: any = itpracobj.SlpracticeDD.filter(filprac => filprac.SysGuid == itpracobj.BSServiceLine.WiproPracticeId);
                  let practiceOBJName = (filteredPractice.length > 0) ? filteredPractice[0].Name : "";

                  let tempSubPracticeDD = [];
                  tempSubPractice.forEach((itsubpracobj, index, selfsubprac) => {

                    if (itsubpracobj.BSServiceLine.WiproSubpracticeid) {
                      if (index == selfsubprac.findIndex((itemsubprac) => itemsubprac.BSServiceLine.WiproSubpracticeid == itsubpracobj.BSServiceLine.WiproSubpracticeid)) {
                        let filteredSubPractice: any = itsubpracobj.SlSubpracticeDD.filter(filsubprac => filsubprac.SubPracticeId == itsubpracobj.BSServiceLine.WiproSubpracticeid);
                        let subpracticeOBJName = (filteredSubPractice.length > 0) ? filteredSubPractice[0].Name : "";
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


      this.creditAllocationSLDD = this.tempCADD.map(res => {
        return {
          ServicelineId: res.ServicelineId,
          ServicelineIdName: res.ServicelineIdName,
          ErrorResponse: ""
        }
      })

      this.creditAllocationdataDetails.forEach(res => {
        if (!res.creditAllocation.WiproIsDefault) {
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
            }
          }
        }
      })

      this.resetSLTCVandOverAllTCV();
      this.projectService.throwError("Service line deleted successfully");
    }
  }
  checksaveOBJonSLdelete(ServiceLIneData, searchText, i) {
    debugger;
    let totalsolutionvalueAllianceSum = 0;
    let totalsolutionvalueNewAgeSum = 0;
    let totalsolutionvalueSolutionSum = 0;
    let totalTCVPerc = 0;
    let totalDualCIS = 0;
    let totalCRSDual = 0;
    let totalNonDualCIS = 0;
    let totalCRSNonDual = 0;
    let totalSLTCV = 0;
    let totalContributionVericalGeo = 0;
    let VerticalGeo = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let tempSLTCV = '';
    if(ServiceLIneData.wiproTaggedStatus==false && ServiceLIneData.TaggedTCV>0 && ServiceLIneData.isAccepted==false )
    {
       tempSLTCV = parseFloat(this.businessSOlutionData[0].Sltcv).toFixed(2).toString();
    }  
    else
    {
      tempSLTCV = ((this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0) - (ServiceLIneData.WiproEstsltcv ? parseFloat(ServiceLIneData.WiproEstsltcv) : 0)).toFixed(2).toString();
    }      
    let SLTCV = (this.businessSOlutionData[0].TCVCalculation == true || ServiceLIneData.WiproDualCredit) ? this.businessSOlutionData[0].Sltcv : tempSLTCV;
    let OverAllTCV: any = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (SLTCV ? parseFloat(SLTCV) : 0)).toFixed(2);
    
      for (let sl = 0; sl < this.BSSLDetails.length; sl++)
      {
        if(!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) 
        {
          this.BSSLDetails.splice(sl, 1);         
        }
      }  
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
       if(!this.IpDetails[ip].IP.IpName && !this.IpDetails[ip].IP.WiproServiceline && !this.IpDetails[ip].IP.WiproAmcvalue && !this.IpDetails[ip].IP.WiproLicenseValue)
       {
         this.IpDetails.splice(ip,1);
       }
     }   
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
       if(!this.SolutionDetails[sol].solutions.WiproType && !this.SolutionDetails[sol].solutions.WiproAccountname && !this.SolutionDetails[sol].solutions.WiproValue)
       {
         this.SolutionDetails.splice(sol,1);
       }
     } 
        let saveObject = { OppBSP: {}, WiproBusinessSolutionDtls: [], WiproAllIPDetails: [], WiproServiceLineDtls: [], CreditAllocationsDetails: [] };

    for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
      if (!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus == false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV > 0 && this.BSSLDetails[sl].BSServiceLine.isAccepted == false && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId)
      {
        this.projectService.displayMessageerror("Please accept/reject the service line in" + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproPracticeId && this.BSSLDetails[sl].SlpracticeDD.length != 0 && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid && this.BSSLDetails[sl].SlpracticeDD.length != 0 && this.BSSLDetails[sl].SlSubpracticeDD.length != 0 && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if ((!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproSlbdmidValueName) && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please fill SL BDM data in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00") && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == false && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00") && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00") && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00") && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel and it should be greater than 0");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please select engagement model in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (this.BSSLDetails[sl].cloudFlag && !this.BSSLDetails[sl].CloudDisabled && !this.BSSLDetails[sl].BSServiceLine.Cloud && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        // this.projectService.displayMessageerror("Please select cloudFlag in " + this.converIndextoString(sl) + " row of service lines table");
        this.projectService.displayMessageerror("Cloud section is mandatory for " + this.BSSLDetails[sl].BSServiceLine.WiproPracticeName + " and " + this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeName + " combination.Please click on cloud and update the cloud Details");
        return;
      }
      else if (this.BSSLDetails[sl].BSServiceLine.Cloud && parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv)<this.BSSLDetails[sl].CloudTCV && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        this.projectService.displayMessageerror("Please note that SL TCV value cannot be lesser than cloud TCV value in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      } 
      else if (this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId && this.BSSLDetails.filter(res =>
        res.BSServiceLine.WiproOpportunityServicelineDetailId != this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId &&
        res.BSServiceLine.WiproServicelineidValue == this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && res.BSServiceLine.WiproPracticeId == this.BSSLDetails[sl].BSServiceLine.WiproPracticeId &&
        res.BSServiceLine.WiproSubpracticeid == this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of service line, practice and sub practice is present for " + this.converIndextoString(sl) + " row in service lines table");
        return;
      }
      else {
        if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
      if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus==false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV>0)
            { 
            
             totalSLTCV = totalSLTCV +0;
             totalTCVPerc = totalTCVPerc +0;
             if(this.BSSLDetails[sl].BSServiceLine.isAccepted)
             {
                totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
                totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
               this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus=true;
             }
            }
          else
          {
             totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
          }
          if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CIS) {
            totalNonDualCIS = totalNonDualCIS + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
          } else if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CRS) {
            totalCRSNonDual = totalCRSNonDual + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
          }
        } else if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
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
        if (BSSLDataObj.WiproDualCredit == "") {
          if (this.businessSOlutionData[0].TCVCalculation == false) {
            let tempSliTCV: any = (SLTCV && BSSLDataObj.WiproEstsltcv) ? ((parseFloat(BSSLDataObj.WiproEstsltcv) * 100) / parseFloat(SLTCV)).toString() : "";
            BSSLDataObj.WiproPercentageOftcv = tempSliTCV ? parseFloat(tempSliTCV).toFixed(2) : "";
          }
        } else {
          BSSLDataObj.WiproPercentageOftcv = null;
        }
        BSSLDataObj.statecode = (BSSLDataObj.WiproOpportunityServicelineDetailId == ServiceLIneData.WiproOpportunityServicelineDetailId) ? 1 : BSSLDataObj.statecode;
        // BSSLDataObj.AdditionalServiceLinesDetails = null;
        // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
        // BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
        if(BSSLDataObj.wiproTaggedStatus==false && BSSLDataObj.TaggedTCV>0 && BSSLDataObj.isAccepted==false)
          {
             BSSLDataObj.WiproEstsltcv=null;
          }
          else
          {
             BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          }
        SLData.push(Object.assign({}, BSSLDataObj));
      }
    }
    if (this.BSSLDetails.length > 0 && totalSLTCV != parseFloat(SLTCV) && this.businessSOlutionData[0].TCVCalculation == false) {
      console.log("tcv", totalSLTCV);
       console.log("tcv", parseFloat(SLTCV));
      this.projectService.displayMessageerror("Total sum of SL TCV in service lines table should be equal to revised SL TCV which is " + SLTCV + " excluding the " + this.converIndextoString(i) + " row of service lines table");
      return;
    }
    else if (this.BSSLDetails.length > 0 && totalTCVPerc != 100 && this.businessSOlutionData[0].TCVCalculation == true && totalSLTCV != parseFloat(SLTCV)) {
      this.projectService.displayMessageerror("Total sum of % of TCV in service lines table should be equal to 100 % of SL TCV of business solution panel " + " excluding the " + this.converIndextoString(i) + " row of service lines table");
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
      saveObject.WiproServiceLineDtls = SLData;
    }



    for (let ip = 0; ip < this.IpDetails.length; ip++) {
      if (!this.IpDetails[ip].IP.IpName || !this.IpDetails[ip].IP.IpId) {
        this.projectService.displayMessageerror("Please fill IP data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if ((!this.IpDetails[ip].IP.WiproModuleName || !this.IpDetails[ip].IP.WiproModuleValue) && this.IpDetails[ip].ModuleDisabled == false) {
        this.projectService.displayMessageerror("Please fill module data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if ((!this.IpDetails[ip].IP.WiproAmcvalue || this.IpDetails[ip].IP.WiproAmcvalue == "0.00") && (!this.IpDetails[ip].IP.WiproLicenseValue || this.IpDetails[ip].IP.WiproLicenseValue == "0.00")) {
        this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table and it should be greater than 0");
        return;
      } 
             else if ( this.IpDetails[ip].IP.WiproCloud && (((this.IpDetails[ip].IP.WiproAmcvalue?parseFloat(this.IpDetails[ip].IP.WiproAmcvalue):0) + (this.IpDetails[ip].IP.WiproLicenseValue?parseFloat(this.IpDetails[ip].IP.WiproLicenseValue):0))<this.IpDetails[ip].CloudTCV)) {
          this.projectService.displayMessageerror("Please note AMC value or license value cannot be lesser that Cloud TCV value in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
      else if (this.IpDetails[ip].AcceptIpDisable == false && this.IpDetails[ip].AcceptIpUI == false) {
        this.projectService.displayMessageerror("Please accept/reject IP in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if (this.IpDetails[ip].HolmesDisable == false && !this.IpDetails[ip].IP.WiproHolmesbdmID && !this.IpDetails[ip].IP.WiproHolmesbdmName) {
        this.projectService.displayMessageerror("Please fill holmes BDM data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if (this.IpDetails.filter(res => res.IP.IpName == this.IpDetails[ip].IP.IpName && res.IP.IpId == this.IpDetails[ip].IP.IpId && res.IP.WiproModuleName == this.IpDetails[ip].IP.WiproModuleName && res.IP.WiproModuleValue == this.IpDetails[ip].IP.WiproModuleValue).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
        return;
      } else {
        let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
        // BSIpDataObj.WiproAcceptip = !this.IpDetails[ip].IP.WiproOpportunityIpId  ?true: this.IpDetails[ip].AcceptIPfrombackend;
        BSIpDataObj.WiproAcceptip = this.IpDetails[ip].AcceptIPfrombackend;
        // BSIpDataObj.AdditionalSLDetails = null;
        // BSIpDataObj.CloudDetails = null;
        BSIpDataObj.WiproAmcvalue = BSIpDataObj.WiproAmcvalue ? parseFloat(BSIpDataObj.WiproAmcvalue).toFixed(2) : null;
        BSIpDataObj.WiproLicenseValue = BSIpDataObj.WiproLicenseValue ? parseFloat(BSIpDataObj.WiproLicenseValue).toFixed(2) : null;
        IpData.push(Object.assign({}, BSIpDataObj));
      }
    }
    saveObject.WiproAllIPDetails = IpData;
    console.log("ddd",this.SolutionDetails);
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (!this.SolutionDetails[sol].solutions.WiproType) {
        this.projectService.displayMessageerror("Please select type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (!this.SolutionDetails[sol].solutions.WiproAccountname || !this.SolutionDetails[sol].solutions.WiproAccountNameValue) {
        this.projectService.displayMessageerror("Please fill name in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" &&(!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
        this.projectService.displayMessageerror("Please fill Owner in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }else if ((!this.SolutionDetails[sol].solutions.WiproPercentageOfTCV || this.SolutionDetails[sol].solutions.WiproPercentageOfTCV == "0.00") && (!this.SolutionDetails[sol].solutions.WiproValue || this.SolutionDetails[sol].solutions.WiproValue == "0.00")) {
        this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table and it should be greater than 0");
        return;
      }
      else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && (!this.SolutionDetails[sol].solutions.WiproSolutionBDMName || !this.SolutionDetails[sol].solutions.WiproSolutionBDMName)) {
        this.projectService.displayMessageerror("Please fill solution BDM data in " + this.converIndextoString(sol) + " row of solution table");
        return;
      } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && !this.SolutionDetails[sol].solutions.WiproInfluenceType) {
        this.projectService.displayMessageerror("Please select influence type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && this.SolutionDetails[sol].solutions.WiproInfluenceType != "184450001" && !this.SolutionDetails[sol].solutions.WiproServiceType) {
        this.projectService.displayMessageerror("Please select service type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (this.SolutionDetails.filter(res => res.solutions.WiproType == this.SolutionDetails[sol].solutions.WiproType && res.solutions.WiproAccountname == this.SolutionDetails[sol].solutions.WiproAccountname && res.solutions.WiproAccountNameValue == this.SolutionDetails[sol].solutions.WiproAccountNameValue && res.solutions.WiproInfluenceType == this.SolutionDetails[sol].solutions.WiproInfluenceType && res.solutions.WiproServiceType == this.SolutionDetails[sol].solutions.WiproServiceType).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of type and name is present for " + this.converIndextoString(sol) + " row in solution table");
        return;
      } 
      else if(this.SolutionDetails[sol].solutions.WiproType == "184450000" && !this.SolutionDetails[sol].solutions.DealRegistration)
      {
        this.projectService.displayMessageerror("Please fill Deal Registration details for " + this.converIndextoString(sol) + " row in solution table");
        return;
      }
      else {
        if (this.SolutionDetails[sol].solutions.WiproType == "184450000") {
          totalsolutionvalueAllianceSum = totalsolutionvalueAllianceSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450002") {
          totalsolutionvalueNewAgeSum = totalsolutionvalueNewAgeSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450001") {
          totalsolutionvalueSolutionSum = totalsolutionvalueSolutionSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
        BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
        BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
        SolutionData.push(Object.assign({}, BSsolutionDataObj));
      }
    }
    if (totalsolutionvalueAllianceSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of alliance value should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else if (totalsolutionvalueNewAgeSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of new age business partner value should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else if (totalsolutionvalueSolutionSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of solution value should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else {
      saveObject.WiproBusinessSolutionDtls = SolutionData;
    }


    for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
      if (this.BSSLDetails[sl].BSServiceLine.WiproOpportunityServicelineDetailId != ServiceLIneData.WiproOpportunityServicelineDetailId) {
        let childCreditAllocation = this.creditAllocationdataDetails.reduce((prevVal, elem) => {
          if (ServiceLIneData.SLCAID != elem.creditAllocation.SLCAID && this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == elem.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == elem.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == elem.creditAllocation.SubPracticeId) {
            prevVal = prevVal ? prevVal : 0
            let contribution: any = (elem.creditAllocation.Contribution.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
            return prevVal + (contribution ? parseFloat(contribution[0]) : 0);
          } else {
            return prevVal;
          }
        }, 0);
        if (childCreditAllocation != 100 && this.creditAllocationdataDetails.filter(it => this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == it.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == it.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == it.creditAllocation.SubPracticeId).length > 0) {
          this.projectService.displayMessageerror("Total sum of contribution percentage in credit allocation table that belongs to " + this.converIndextoString(sl) + " row in service lines table is not 100%");
          return;
        }
      }
    }
      this.openDialogDelete("Do you want to delete this Service line", "Confirm", "Delete service line").subscribe(res => {
      if (res == 'save') {
        let CurrencyValueinDollars = 0;
        this.projectService.getCurrencyStatus(this.businessSOlutionData[0].TransactionCurrencyId).subscribe(currency => {
          if (currency && currency.ResponseObject.length) {
            let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
            CurrencyValueinDollars = (OverAllTCV && currencyMultiplier) ? (parseFloat(OverAllTCV) / currencyMultiplier) : 0;
            if (CurrencyValueinDollars > 50000) {
               if(CurrencyValueinDollars > 99999999999)
                {
                  this.projectService.displayMessageerror("Overall TCV should be less than 99,999,999,999 USD")
                }
                else
                {
                   if (this.businessSOlutionData[0].WiproSimpleDeal == true) {
                    this.openDialogDelete("You have entered TCV more than 50K USD. This opportunity will be converted from simple to normal.", "Confirm", "Convert to normal opportunity?").subscribe(res => {
                      if (res == 'save') {
                        this.saveBusinessSolutionDataOnSLDelete(saveObject, ServiceLIneData, searchText, i, OverAllTCV, false, CurrencyValueinDollars);
                      }
                    });
                    } else {
                      this.saveBusinessSolutionDataOnSLDelete(saveObject, ServiceLIneData, searchText, i, OverAllTCV, false, CurrencyValueinDollars);
                    }
                }

            } else {
              this.saveBusinessSolutionDataOnSLDelete(saveObject, ServiceLIneData, searchText, i, OverAllTCV, this.businessSOlutionData[0].WiproSimpleDeal, CurrencyValueinDollars);
            }
          }
        });

      }
    });

  }




  saveBusinessSolutionDataOnSLDelete(saveObject, ServiceLIneData, searchText, i, OverAllTCV, simpleDeal, CurrencyValueinDollars) {
    let selectedCIO = (this.businessSOlutionData[0].CIO == true) ? this.CIOValue.toString() : "";
    let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
    let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
    let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
    let selectedFunction = (selectedCIO + selectedFMG + selectedHR + selectedAgile).replace(/^,/, '');


    let OppBSPDetails = {
      opportunityid: this.OpportunityId,
      CIODealPercentage: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO) ? parseFloat(this.businessSOlutionData[0].CIODealPercentage).toFixed(2) : null,
      CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
      WiproValue: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO && OverAllTCV && OverAllTCV != "0.00") ? (((parseFloat(this.businessSOlutionData[0].CIODealPercentage) * parseFloat(OverAllTCV)) / 100).toFixed(2).toString()) : null,
      FunctionInvolvedValue: selectedFunction,
      CalculationMethod: this.businessSOlutionData[0].TCVCalculation,
      WiproSimpleDeal: simpleDeal,
      WiproRemarks: ""
    }
    saveObject.OppBSP = Object.assign({}, OppBSPDetails);
    let OverALLTCVPercChnage = 0;
    let OverAllTCVDifference = 0;

    this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : parseFloat(this.OverALLSavedTCVData);
    OverAllTCVDifference = parseFloat(this.businessSOlutionData[0].OverallTcv)  - parseFloat(this.OverALLSavedTCV);
    console.log("diff",OverAllTCVDifference);
    if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
      OverALLTCVPercChnage = OverAllTCV ? parseFloat(OverAllTCV) : 0.00;
    } else {
      OverALLTCVPercChnage = (((OverAllTCV ? parseFloat(OverAllTCV) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
      console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
    }

     if(OverALLTCVPercChnage !== 0)
      {
          let obj ={
            "TCVAuditId": "",
            "Name": "",
            "ChangeOccurred": "",
            "ChangePercentage": OverALLTCVPercChnage,
            "OpportunityId": this.OpportunityId,
            "Reason": "",
            "EstimatedSlTcv":this.businessSOlutionData[0].OverallTcv,
            "ChangeTCV" : OverAllTCVDifference
        }

        saveObject.TCVDetails = obj;
      }

     debugger;
     if (((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && (CurrencyValueinDollars < 25000000 && CurrencyValueinDollars >=1000000) && this.timeDiff >24) || ((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars >= 25000000) && this.timeDiff > 24) {
        this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

          this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage,OverAllTCVDifference).subscribe(result => {

            // if (result) {
            //   if (result.error == "saved") {

               
            //   } else if (res.error == "CRMerror") {
            //     this.projectService.throwError(res.message);
            //   }
            //   else if (res.error == "APIerror") {
            //     this.projectService.displayMessageerror(res.message);
            //   }
            // }

             saveObject.TCVDetails = this.tcvPopupObjSave;
             this.saveBusinessSolutionData(saveObject, simpleDeal);

          });
        });


    } else {
      this.saveonBSSLDelete(saveObject, ServiceLIneData, searchText, i, simpleDeal);
    }
    })
    
  }

  saveonBSSLDelete(saveObject, ServiceLIneData, searchText, i, simpleDeal) {
    this.service.loaderhome = true;
    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {
      if (res && res.IsError == false) {
        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.setWTFlag();
        this.projectService.throwError("Service line deleted successfully");
        this.projectService.setproceedtonormal(simpleDeal);
        // this.projectService.stageSave();
        this.getBusinessSolutionPanelData(this.OpportunityId);
      } else {
        this.service.loaderhome = false;
        this.projectService.throwError(res.Message);
      }
    }, err => {
      this.service.loaderhome = false;
       this.projectService.displayerror("Error Occured While Saving data");
    })
  }

  resetSLTCVandOverAllTCV() {
    let sumofSLTCV: any = this.BSSLDetails.reduce(function (prevVal, elem) {
      if (!(elem.BSServiceLine.WiproDualCredit)) {
        let SLTCV: any = (elem.BSServiceLine.WiproEstsltcv.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
        return prevVal + (SLTCV ? parseFloat(SLTCV[0]) : 0);
      } else {
        return prevVal;
      }
    }, 0);
    this.businessSOlutionData[0].Sltcv = parseFloat(sumofSLTCV).toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();

    this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Value this.overalltcvComma", this.overalltcvComma);
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
        this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
      }
    }

    for (let sli = 0; sli < this.BSSLDetails.length; sli++) {
      if (!(this.BSSLDetails[sli].BSServiceLine.WiproDualCredit)) {
        let tempSliTCV: any = (this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].Sltcv != "0.00" && this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) ? ((parseFloat(this.BSSLDetails[sli].BSServiceLine.WiproEstsltcv) * 100) / parseFloat(this.businessSOlutionData[0].Sltcv)).toString() : "";
        this.BSSLDetails[sli].BSServiceLine.WiproPercentageOftcv = tempSliTCV ? parseFloat(tempSliTCV).toFixed(2).toString() : "";
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
      } else {
        let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00" && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
        this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
      }

    }
  }

  //**************************************************************Service Line Methods Ends***************************************************/
  //**************************************************************IP Methods Starts***************************************************/
  iPTablelength;
  createIpStructure(IporiginalDetails) {
    this.service.loaderhome = true;
    this.IpDetails = [];
    let IPlength = IporiginalDetails.length;
    this.iPTablelength = IPlength;

    for (let i = 0; i < IporiginalDetails.length; i++) {
      let cloudTCV = 0;
      let OrderIporiginalDetails: any = {};
      OrderIporiginalDetails.TaggedamcValue = IporiginalDetails[i].TaggedamcValue ? IporiginalDetails[i].TaggedamcValue : "";
      OrderIporiginalDetails.TaggedLicenseValue = IporiginalDetails[i].TaggedLicenseValue ? IporiginalDetails[i].TaggedLicenseValue : "";
      OrderIporiginalDetails.WiproAcceptip = IporiginalDetails[i].WiproAcceptip ? JSON.parse(IporiginalDetails[i].WiproAcceptip) : false;
    
      OrderIporiginalDetails.WiproCloud = IporiginalDetails[i].WiproCloud ? JSON.parse(IporiginalDetails[i].WiproCloud) : false;
      OrderIporiginalDetails.WiproHolmesbdmID = (IporiginalDetails[i].WiproOpportunityIpId && IporiginalDetails[i].WiproHolmesbdmID) ? IporiginalDetails[i].WiproHolmesbdmID : "";
      OrderIporiginalDetails.WiproHolmesbdmName = (IporiginalDetails[i].WiproOpportunityIpId && IporiginalDetails[i].WiproHolmesbdmName) ? IporiginalDetails[i].WiproHolmesbdmName : "";
      OrderIporiginalDetails.WiproSlbdmName = IporiginalDetails[i].WiproSlbdmName ? IporiginalDetails[i].WiproSlbdmName : "";
      OrderIporiginalDetails.WiproSlbdmValue = IporiginalDetails[i].WiproSlbdmValue ? IporiginalDetails[i].WiproSlbdmValue : "";
      OrderIporiginalDetails.IpId = IporiginalDetails[i].IpId ? IporiginalDetails[i].IpId : "";
      OrderIporiginalDetails.WiproCurrency = this.businessSOlutionData[0].TransactionCurrencyId;
      if(!IporiginalDetails[i].WiproLicenseValue && !IporiginalDetails[i].WiproAmcvalue)
      {
         OrderIporiginalDetails.WiproLicenseValue = IporiginalDetails[i].TaggedLicenseValue ? (parseFloat(IporiginalDetails[i].TaggedLicenseValue).toFixed(2)).toString() : "";
      }
      else
      {
         OrderIporiginalDetails.WiproLicenseValue = IporiginalDetails[i].WiproLicenseValue ? (parseFloat(IporiginalDetails[i].WiproLicenseValue).toFixed(2)).toString() : "";
        
      }
       if(!IporiginalDetails[i].WiproLicenseValue && !IporiginalDetails[i].WiproAmcvalue)
      {
        OrderIporiginalDetails.WiproAmcvalue = IporiginalDetails[i].TaggedamcValue ? (parseFloat(IporiginalDetails[i].TaggedamcValue).toFixed(2)).toString() : "";
        
      }
      else
      {
        OrderIporiginalDetails.WiproAmcvalue = IporiginalDetails[i].WiproAmcvalue ? (parseFloat(IporiginalDetails[i].WiproAmcvalue).toFixed(2)).toString() : "";
      }
      OrderIporiginalDetails.WiproModuleValue = (IporiginalDetails[i].WiproOpportunityIpId && IporiginalDetails[i].WiproModuleValue) ? IporiginalDetails[i].WiproModuleValue : "";
      OrderIporiginalDetails.WiproModuleName = (IporiginalDetails[i].WiproOpportunityIpId && IporiginalDetails[i].WiproModuleName) ? IporiginalDetails[i].WiproModuleName : "";
      OrderIporiginalDetails.IpName = IporiginalDetails[i].IpName ? IporiginalDetails[i].IpName : "";
      OrderIporiginalDetails.WiproOpportunityIdValue = this.OpportunityId;
      OrderIporiginalDetails.WiproOpportunityIpId = IporiginalDetails[i].WiproOpportunityIpId ? IporiginalDetails[i].WiproOpportunityIpId : "";
      OrderIporiginalDetails.WiproPractice = IporiginalDetails[i].WiproPractice ? IporiginalDetails[i].WiproPractice : "";
      OrderIporiginalDetails.WiproPracticeName = IporiginalDetails[i].WiproPracticeName ? IporiginalDetails[i].WiproPracticeName : ""
      OrderIporiginalDetails.WiproServiceline = IporiginalDetails[i].WiproServiceline ? IporiginalDetails[i].WiproServiceline : "";
       OrderIporiginalDetails.WiproServicelineName = IporiginalDetails[i].WiproServicelineName ? IporiginalDetails[i].WiproServicelineName : "";
      // OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? IporiginalDetails[i].AdditionalSLDetails : [];
      // OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it=>{
      //   cloudTCV = cloudTCV + (it.WiproValue ? parseFloat(it.WiproValue) : 0);
      //   return Object.assign({},it);
      // })) : [];
       OrderIporiginalDetails.AdditionalSLDetails = IporiginalDetails[i].AdditionalSLDetails ? (IporiginalDetails[i].AdditionalSLDetails.map(it => {
          return Object.assign({ ...it, statecode: 0 })
        })
        ) : [];
        OrderIporiginalDetails.CloudDetails = IporiginalDetails[i].CloudDetails ? (IporiginalDetails[i].CloudDetails.map(it => {
          cloudTCV = cloudTCV + (it.WiproValue ? parseFloat(it.WiproValue) : 0);
          return Object.assign({ ...it, CloudStatecode: 0, CloudDetailid: '' })
        })
        ) : [];
      OrderIporiginalDetails.statecode = 0;
      OrderIporiginalDetails.WiproModuleContactId = IporiginalDetails[i].WiproModuleContactId ? IporiginalDetails[i].WiproModuleContactId : "";
      OrderIporiginalDetails.WiproModuleContactIdName = IporiginalDetails[i].WiproModuleContactIdName ? IporiginalDetails[i].WiproModuleContactIdName : "";
      OrderIporiginalDetails.WiproSolutionOwnerName = IporiginalDetails[i].WiproSolutionOwnerName ? IporiginalDetails[i].WiproSolutionOwnerName : "";
      OrderIporiginalDetails.WiproSolutionOwnerId = IporiginalDetails[i].WiproSolutionOwnerId ? IporiginalDetails[i].WiproSolutionOwnerId : "";
      let AcceptIpUI = false;
      let AcceptIpDisable = true;
      let AcceptIPfrombackend = true;
      if (OrderIporiginalDetails.WiproAcceptip == false && OrderIporiginalDetails.WiproOpportunityIpId != "") {
        // for disable
        AcceptIpDisable = false;
        /// for checkbox
        AcceptIpUI = false;
        // for color
        AcceptIPfrombackend = true;
      } else if (OrderIporiginalDetails.WiproAcceptip == true && OrderIporiginalDetails.WiproOpportunityIpId != "") {
        if (OrderIporiginalDetails.TaggedamcValue || OrderIporiginalDetails.TaggedLicenseValue) {
          AcceptIpDisable = true;
          AcceptIpUI = true;
          AcceptIPfrombackend = true;
        } else {
          AcceptIpDisable = true;
          AcceptIpUI = false;
          AcceptIPfrombackend = true;
        }
      }

      // let HolmesDisabled = (IporiginalDetails[i].WiproHolmesbdmID && IporiginalDetails[i].WiproHolmesbdmName) ? false : true;
      // let ModuleDisabled = (IporiginalDetails[i].WiproModuleValue && IporiginalDetails[i].WiproModuleName) ? false : true;
      let HolmesDisabled = !IporiginalDetails[i].WiproOpportunityIpId ? (IporiginalDetails[i].disableHolmesBDM ? false : true) : ((IporiginalDetails[i].WiproHolmesbdmID && IporiginalDetails[i].WiproHolmesbdmName) ? false : true);
      let ModuleDisabled = !IporiginalDetails[i].WiproOpportunityIpId ? (IporiginalDetails[i].disableModule ? false : true) : ((IporiginalDetails[i].WiproModuleValue && IporiginalDetails[i].WiproModuleName) ? false : true);

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

      let IpNameDD = [];
      let selectedHomesBDM = (OrderIporiginalDetails.WiproHolmesbdmID && OrderIporiginalDetails.WiproHolmesbdmName) ? [{ Id: OrderIporiginalDetails.WiproHolmesbdmID, Name: OrderIporiginalDetails.WiproHolmesbdmName, SysGuid: OrderIporiginalDetails.WiproHolmesbdmID, EmailID: '' }] : [];
      let IpHolmesDD = [];
      let ModuleDD = [];
      let PracticeDD = [];
      let slBDMDD = [];

      this.getIpPracticeandSLBDM(OrderIporiginalDetails, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, IPlength);

    }

  
    if (IPlength == 0) {
      this.IpLoader = false;
    }


  }

  getIpPracticeandSLBDM(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength) {

    if (IporiginalDetailsObj.WiproServiceline) {
      this.projectService.getIpPractice(IporiginalDetailsObj.WiproServiceline).subscribe(res => {
        PracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (IporiginalDetailsObj.WiproOpportunityIpId != "") {

          this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);
        } else {
          this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);

        }
      },
        err => {
          if (IporiginalDetailsObj.WiproOpportunityIpId != "") {

            this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);
          } else {
            this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);

          }
        });
    } else {
      if (IporiginalDetailsObj.WiproOpportunityIpId != "") {

        this.PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);
      } else {
        this.PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength);

      }
    }

  }



  PushToIpArray(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength) {
    this.IpDetails.push(Object.assign({}, new IpDetails(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM, false, false, false, false, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend, false,ModuleDisabled, HolmesDisabled,cloudTCV,

      "IPName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpModuleName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpSLName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpPracticeName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpSLBDMName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpLicenceValueName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpAMCValueName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpCloudName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpAcceptIpName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId,
      "IpHomesBDMName" + i + "SavedData" + IporiginalDetailsObj.WiproOpportunityIpId)));

    if (i == (Iplength - 1)) {
      this.IpLoader = false;
    }
  }


  PushToIpArrayForSmartSearch(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM,cloudTCV, i, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend,ModuleDisabled, HolmesDisabled, Iplength) {
    let Ipnamelength = this.IpDetails.length + 1;
    this.newIpDataCount = this.newIpDataCount + 1;
    this.IpDetails.push(Object.assign({}, new IpDetails(IporiginalDetailsObj, IpNameDD, ModuleDD, PracticeDD, slBDMDD, IpHolmesDD,selectedIP,selectedModule,selectedIPSLBDM,selectedHomesBDM, false, false, false, false, AcceptIpUI, AcceptIpDisable, AcceptIPfrombackend, false,ModuleDisabled, HolmesDisabled,cloudTCV,

      "IPName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpModuleName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPracticeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLBDMName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpLicenceValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAMCValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpCloudName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAcceptIpName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpHomesBDMName" + this.newIpDataCount + "NewData" + Ipnamelength)));

    if (i == (Iplength - 1)) {
      this.IpLoader = false;
    }
  }

  opentcvpopupnew() {
    debugger
    const dialogRef = this.dialog.open(OpenTcvpopupcomponent,
      {
        width: '900px'
      });
  }


  navigatetoIPCloud(IpData, i, showIpCloud,HolmesDisable) {
    debugger;
    // commented as new popup is added as per requirement
   
     this.projectService.setSession("IPObjForCloud", { Details: IpData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, ShowIpCloud: showIpCloud });
      // this.router.navigate(['/opportunity/ipadditionaldetails']);
      const dialogRef = this.dialog.open(OpenIP,
        {
          width: '900px',
           data: {Details: IpData, OverAllTCV: this.businessSOlutionData[0].OverallTcv,TransactionCurrencyId: this.businessSOlutionData[0].TransactionCurrencyId, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, ShowIpCloud: showIpCloud, disableOnRoleBSIp: this.disableOnRoleBSIp,HolmesDisable:HolmesDisable }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.IpDetails[i].IP.CloudDetails = result.cloudData;
          this.IpDetails[i].IP.TaggedamcValue=result.perceptionData.TaggedamcValue;
          this.IpDetails[i].IP.TaggedLicenseValue=result.perceptionData.TaggedLicenseValue;
          this.IpDetails[i].CloudTCV  =  result.cloudTCV ? parseFloat(result.cloudTCV) : 0;
           this.IpDetails[i].IP.AdditionalSLDetails = result.additionalIpData ? result.additionalIpData : [];
           let cloudDataLength=result.cloudData.filter((it)=>it.CloudStatecode==0).length;
          if(cloudDataLength == 0){

            this.IpDetails[i].IP.WiproCloud = false;
          }
          else {
            this.IpDetails[i].IP.WiproCloud = true;
          }
        }else{
          this.IpDetails[i].CloudTCV  = 0;
        }
      });

 
  }
  getIpPracticeData(IpData, i) {
    debugger;
    this.IpDetails[i].IpslBDMDD = [];
    this.IpDetails[i].IP.WiproPractice = "";
    this.IpDetails[i].IP.WiproSlbdmValue = "";
    this.IpDetails[i].IP.WiproSlbdmName = "";
    this.IpDetails[i].selectedIPSLBDM = [];
    if (IpData.WiproServiceline) {
      let selectedSL = [];
      selectedSL = this.IpandServiceLinelDD.filter(item => item.SysGuid == IpData.WiproServiceline);
      if(selectedSL.length > 0) {
        this.IpDetails[i].IP.WiproServicelineName = selectedSL[0].Name;
      }
      else {
        this.IpDetails[i].IP.WiproServicelineName = "";
      }
      this.projectService.getIpPractice(IpData.WiproServiceline).subscribe(res => {
        this.IpDetails[i].IppracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (this.IpDetails[i].IppracticeDD.length == 0) {
          this.getIpSlBDMData(IpData, i, "");
        }
      },
        err => {
          this.IpDetails[i].IppracticeDD = [];
        });
    }
    else {
      this.IpDetails[i].IppracticeDD = [];
    }
  }

  checkForCloud(IpData, i, disabled,HolmesDisable) {
    console.log("asd", IpData.WiproCloud);
    if (disabled == false && (this.disableOnRoleBSIp == false || (this.IsIPOwner && this.userGuid==IpData.WiproSolutionOwnerId) || (this.isPPS && this.userGuid==IpData.WiproSolutionOwnerId) ||this.userGuid==IpData.WiproHolmesbdmID )) {
      if (IpData.WiproCloud == false) {
        if ((IpData.CloudDetails).length <= 0) {
          setTimeout(() => {
            this.IpDetails[i].IP.WiproCloud = false;
          })
          this.navigatetoIPCloud(IpData, i, true,HolmesDisable);
          //this.projectService.displayMessageerror("There are no cloud details present for " + this.converIndextoString(i) + " row of IP table, Please add the cloud then proceed with the action");
        } else {
          setTimeout(() => {
            this.IpDetails[i].IP.WiproCloud = true;
          })
          this.navigatetoIPCloud(IpData, i, true,HolmesDisable);
        }
      }
      else
      {
        this.openDialogDelete("Cloud details will be removed on Save of IP details.", "Confirm", "Delete Cloud").subscribe(res => {
        if (res == 'save') {
        this.IpDetails[i].IP.CloudDetails.map((it)=>it.CloudStatecode=1);
        this.projectService.displayMessageerror("Cloud details have been deleted");
      }
      else
      {
        this.IpDetails[i].IP.WiproCloud = true;
      }
        });
      }
    }
  }

  checkAMCValue(IpData, i) {
    let tempAMC: any = IpData.WiproAmcvalue;
    this.IpDetails[i].IP.WiproAmcvalue = tempAMC ? tempAMC : "";
  }

  checkLicenceValue(IpData, i) {

    let tempLicenceValue: any = IpData.WiproLicenseValue;
    this.IpDetails[i].IP.WiproLicenseValue = tempLicenceValue ? tempLicenceValue: "";

  }

  sumIpTCVLV(IpData, i) {
    let tempLicenceValue: any = IpData.WiproLicenseValue;
    this.IpDetails[i].IP.WiproLicenseValue = tempLicenceValue ? parseFloat(tempLicenceValue).toFixed(2).toString() : "";
    let sumofIPTCV: any = this.IpDetails.reduce(function (prevVal, elem) {
      let WiproAMC: any = (elem.IP.WiproAmcvalue.toString().match(/^[0-9]+(\.[0-9]*){0,1}$/g));
      let LicenceValue: any = (elem.IP.WiproLicenseValue.toString().match(/^[0-9]+(\.[0-9]*){0,1}$/g));
      return prevVal + (LicenceValue ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC ? parseFloat(WiproAMC[0]) : 0);
    }, 0);
    this.businessSOlutionData[0].IpTcv = sumofIPTCV.toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
    this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Value this.overalltcvComma", this.overalltcvComma);

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
      } else {
        let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
        this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
      }

    }

  }

  sumIpTCVAMC(IpData, i) {
    let tempAMC: any = IpData.WiproAmcvalue;
    this.IpDetails[i].IP.WiproAmcvalue = tempAMC ? parseFloat(tempAMC).toFixed(2).toString() : "";
    let sumofIPTCV: any = this.IpDetails.reduce(function (prevVal, elem) {
      let WiproAMC: any = (elem.IP.WiproAmcvalue.toString().match(/^[0-9]+(\.[0-9]*){0,1}$/g));
      let LicenceValue: any = (elem.IP.WiproLicenseValue.toString().match(/^[0-9]+(\.[0-9]*){0,1}$/g));
      return prevVal + (LicenceValue ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC ? parseFloat(WiproAMC[0]) : 0);
    }, 0);
    this.businessSOlutionData[0].IpTcv = sumofIPTCV.toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
    this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Value this.overalltcvComma", this.overalltcvComma);
    
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
      } else {
        let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
        this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
      }

    }

  }



  getIpSlBDMData(IpData, i, searchValue) {
    debugger;
    this.IpDetails[i].IP.WiproSlbdmValue = "";
    this.IpDetails[i].IP.WiproSlbdmName = "";
    this.IpDetails[i].selectedIPSLBDM = [];
    let selectedPractice = [];
    selectedPractice = this.IpDetails[i].IppracticeDD.filter(item => item.SysGuid == IpData.WiproPractice);
      if(selectedPractice.length > 0) {
        this.IpDetails[i].IP.WiproPracticeName = selectedPractice[0].Name;
      }
      else {
        this.IpDetails[i].IP.WiproPracticeName = "";
      }
    this.addIPservice.getSLBDMDropDownList1(IpData.WiproServiceline, IpData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
       if(res && res.IsError == false && res.ResponseObject && res.ResponseObject.length<1){
        this.projectService.displayMessageerror("No records found for SL BDM! could you raise a helpline ticket")
      }
      this.IpDetails[i].IpslBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      if (this.IpDetails[i].IpslBDMDD.length == 1) {
        this.IpDetails[i].IP.WiproSlbdmValue = this.IpDetails[i].IpslBDMDD[0].SysGuid;
        this.IpDetails[i].IP.WiproSlbdmName = this.IpDetails[i].IpslBDMDD[0].Name;
      }
    },
      err => {
        this.IpDetails[i].IpslBDMDD = [];
      });

  }

  OnChangegetBSIPSlBDMData(IpData, i, searchValue) {
    this.IpDetails[i].IP.IPSLBDMLoader=true;
    this.addIPservice.getSLBDMDropDownList1(IpData.WiproServiceline, IpData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, searchValue, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.IpDetails[i].IP.IPSLBDMLoader=false;
      this.IpDetails[i].IpslBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IP.IPSLBDMLoader=false;
        this.IpDetails[i].IpslBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }


  getIPSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    debugger;
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
debugger;
    this.addIPservice.getSLBDMDropDownList1(rowData.WiproServiceline, rowData.WiproPractice, this.sbuId, this.geoId, this.VerticalId, this.RegionId, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
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
    this.IpDetails[i].IP.IPAccountLoader=true;

    this.addIPservice.getIPDropDownList(null, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      console.log("IP1", res);
      this.IpDetails[i].IP.IPAccountLoader=false;
      this.IpDetails[i].IpNameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IP.IPAccountLoader=false;
        this.IpDetails[i].IpNameDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  getIPDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
     console.log("ip lookup more1--------",this.OdatanextLink);
    this.addIPservice.getIPDropDownList(null, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.lookupdata.nextLink).subscribe(res => {
      console.log("ip lookup more12--------");
      console.log("ip lookup more",res);
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
        console.log("ip lookup more123--------",err);
        this.OdatanextLink = null;
        this.totalRecordCount = 0;
        this.lookupdata.pageNo = this.defaultpageNumber;
        this.lookupdata.TotalRecordCount = this.totalRecordCount;
        this.lookupdata.nextLink = this.OdatanextLink;
        this.lookupdata.tabledata = [];
        this.lookupdata.isLoader = false;
      });
       console.log("ip lookup more12345--------");
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
    this.IpDetails[i].IP.IPModuleLoader=true;
    this.addIPservice.getIPModuleDropDownList(IpData.IpId, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.IpDetails[i].IP.IPModuleLoader=false;
      this.IpDetails[i].IpModuleDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        this.IpDetails[i].IP.IPModuleLoader=false;
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
    this.IpDetails[i].IP.IPHolmesBDMLoader=true;
    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(IpData.IpId, this.SearchTypeHomesBDM, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.IpDetails[i].IP.IPHolmesBDMLoader=false;
      this.IpDetails[i].IpHolmesDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
         this.IpDetails[i].IP.IPHolmesBDMLoader=false;
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
    this.saveFlag = false;
    this.service.loaderhome = true;
    let IPObj: IPInterface = {
      TaggedamcValue: "",
      TaggedLicenseValue: "",
      WiproAcceptip: false,
      WiproAmcvalue: "",
      WiproCloud: false,
      WiproHolmesbdmID: "",
      WiproHolmesbdmName: "",
      WiproSlbdmValue: "",
      WiproSlbdmName: "",
      IpId: "",
      WiproLicenseValue: "",
      WiproModuleValue: "",
      WiproModuleName: "",
      IpName: "",
      WiproOpportunityIdValue: this.OpportunityId,
      WiproOpportunityIpId: "",
      WiproCurrency:this.businessSOlutionData[0].TransactionCurrencyId,
      WiproPractice: "",
      WiproPracticeName: "",
      WiproServiceline: "",
      WiproServicelineName: "",
      AdditionalSLDetails: [],
      CloudDetails: [],
      statecode: 0,
      WiproModuleContactId: "",
      WiproModuleContactIdName: "",
      IPAccountLoader:false,
      IPModuleLoader:false,
      IPSLBDMLoader:false,
      IPHolmesBDMLoader:false
    };
    let Ipnamelength = this.IpDetails.length + 1;
    this.newIpDataCount = this.newIpDataCount + 1;

    this.IpDetails.unshift(Object.assign({}, new IpDetails(IPObj, [], [], [], [], [], [], [], [], [], false, false, false, false, false, true, true, false,true, true,0,

      "IPName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpModuleName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpPracticeName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpSLBDMName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpLicenceValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAMCValueName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpCloudName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpAcceptIpName" + this.newIpDataCount + "NewData" + Ipnamelength,
      "IpHomesBDMName" + this.newIpDataCount + "NewData" + Ipnamelength)));
    this.service.loaderhome = false;
    console.log(this.IpDetails);
  }

  deletBSIpValidation(IpData, searchText, i) {


    if (IpData.WiproOpportunityIpId) {
      this.businessSOlutionData[0].OverallTcv = (parseFloat(this.businessSOlutionData[0].OverallTcv) - (parseFloat(IpData.WiproLicenseValue) + parseFloat(IpData.WiproAmcvalue))).toString();

      this.checksaveOBJonIPdelete(IpData, searchText, i);
    }
    else {
          this.IpDetails.splice(i, 1);
          this.resetIPTCVandOverAllTCV();
    }

  }

  checksaveOBJonIPdelete(IpDeleteableData, searchText, i) {
    let totalsolutionvalueAllianceSum = 0;
    let totalsolutionvalueNewAgeSum = 0;
    let totalsolutionvalueSolutionSum = 0;
    let totalTCVPerc = 0;
    let totalDualCIS = 0;
    let totalCRSDual = 0;
    let totalNonDualCIS = 0;
    let totalCRSNonDual = 0;
    let totalSLTCV = 0;
    let totalContributionVericalGeo = 0;
    let VerticalGeo = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let IPTCV = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) - ((IpDeleteableData.WiproAmcvalue ? parseFloat(IpDeleteableData.WiproAmcvalue) : 0) + (IpDeleteableData.WiproLicenseValue ? parseFloat(IpDeleteableData.WiproLicenseValue) : 0))).toFixed(2).toString();
    let OverAllTCV: any = ((this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0) + (IPTCV ? parseFloat(IPTCV) : 0)).toFixed(2).toString();

    let saveObject = { OppBSP: {}, WiproBusinessSolutionDtls: [], WiproAllIPDetails: [], WiproServiceLineDtls: [], CreditAllocationsDetails: [] };
   
      for (let sl = 0; sl < this.BSSLDetails.length; sl++)
      {
        if(!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) 
        {
          this.BSSLDetails.splice(sl, 1);         
        }
      }  
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
       if(!this.IpDetails[ip].IP.IpName && !this.IpDetails[ip].IP.WiproServiceline && !this.IpDetails[ip].IP.WiproAmcvalue && !this.IpDetails[ip].IP.WiproLicenseValue)
       {
         this.IpDetails.splice(ip,1);
       }
     }   
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
       if(!this.SolutionDetails[sol].solutions.WiproType && !this.SolutionDetails[sol].solutions.WiproAccountname && !this.SolutionDetails[sol].solutions.WiproValue)
       {
         this.SolutionDetails.splice(sol,1);
       }
     } 
    for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
      
      if (!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue) {
        this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
       else if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus == false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV > 0 && this.BSSLDetails[sl].BSServiceLine.isAccepted == false)
      {
        this.projectService.displayMessageerror("Please accept/reject the service line in" + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproPracticeId && this.BSSLDetails[sl].SlpracticeDD.length != 0) {
        this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid && this.BSSLDetails[sl].SlpracticeDD.length != 0 && this.BSSLDetails[sl].SlSubpracticeDD.length != 0) {
        this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproSlbdmidValueName) {
        this.projectService.displayMessageerror("Please fill SL BDM data in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) {
        this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == false && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
        this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
        this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
        return;
      }
      else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
        this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel and it should be greater than 0");
        return;
      }
      else if (!this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel) {
        this.projectService.displayMessageerror("Please select engagement model in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (this.BSSLDetails[sl].cloudFlag && !this.BSSLDetails[sl].CloudDisabled && !this.BSSLDetails[sl].BSServiceLine.Cloud) {
        // this.projectService.displayMessageerror("Please select cloudFlag in " + this.converIndextoString(sl) + " row of service lines table");
        this.projectService.displayMessageerror("Cloud section is mandatory for " + this.BSSLDetails[sl].BSServiceLine.WiproPracticeName + " and " + this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeName + " combination.Please click on cloud and update the cloud Details");
        return;
      }
      else if (this.BSSLDetails[sl].BSServiceLine.Cloud && parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv)<this.BSSLDetails[sl].CloudTCV) {
        this.projectService.displayMessageerror("Please note that SL TCV value cannot be lesser than cloud TCV value in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
      else if (this.BSSLDetails.filter(res =>
        res.BSServiceLine.WiproServicelineidValue == this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && res.BSServiceLine.WiproPracticeId == this.BSSLDetails[sl].BSServiceLine.WiproPracticeId &&
        res.BSServiceLine.WiproSubpracticeid == this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of service line, practice and sub practice is present for " + this.converIndextoString(sl) + " row in service lines table");
        return;
      } else {
        if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "") {
           if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus==false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV>0)
            { 
            
             totalSLTCV = totalSLTCV +0;
             totalTCVPerc = totalTCVPerc +0;
             if(this.BSSLDetails[sl].BSServiceLine.isAccepted)
             {
               totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
               totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
               this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus=true;
             }
            }
          else
          {
             totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
          }
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
        // BSSLDataObj.AdditionalServiceLinesDetails = null;
        // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
        BSSLDataObj.WiproPercentageOftcv = BSSLDataObj.WiproPercentageOftcv ? parseFloat(BSSLDataObj.WiproPercentageOftcv).toFixed(2) : null;
        // BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
        if(BSSLDataObj.wiproTaggedStatus==false && BSSLDataObj.TaggedTCV>0 && BSSLDataObj.isAccepted==false)
          {
             BSSLDataObj.WiproEstsltcv=null;
          }
          else
          {
             BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          }
        SLData.push(Object.assign({}, BSSLDataObj));
      }
    }
    if (this.BSSLDetails.length <= 0) {
      this.projectService.displayMessageerror("Atleast one service line is mandatory to add");
      return;
    }
    else if (this.BSSLDetails.length > 0 && totalTCVPerc != 100 && this.businessSOlutionData[0].TCVCalculation == true && totalSLTCV != this.businessSOlutionData[0].Sltcv) {
      this.projectService.displayMessageerror("Total sum of % of TCV in service lines table should be equal to 100 % of SL TCV of business solution panel");
      return;
    }
    else if (this.BSSLDetails.length > 0 && totalSLTCV != this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].TCVCalculation == false) {

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
      saveObject.WiproServiceLineDtls = SLData;
    }

    for (let ip = 0; ip < this.IpDetails.length; ip++) {
      if ((!this.IpDetails[ip].IP.IpName || !this.IpDetails[ip].IP.IpId) && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
        this.projectService.displayMessageerror("Please fill IP data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if ((!this.IpDetails[ip].IP.WiproModuleName || !this.IpDetails[ip].IP.WiproModuleValue) && this.IpDetails[ip].ModuleDisabled == false && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
        this.projectService.displayMessageerror("Please fill module data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if ((!this.IpDetails[ip].IP.WiproAmcvalue || this.IpDetails[ip].IP.WiproAmcvalue == "0.00") && (!this.IpDetails[ip].IP.WiproLicenseValue || this.IpDetails[ip].IP.WiproLicenseValue == "0.00") && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
        this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table and it should be greater than 0");
        return;
      }
      else if ( this.IpDetails[ip].IP.WiproCloud && (((this.IpDetails[ip].IP.WiproAmcvalue?parseFloat(this.IpDetails[ip].IP.WiproAmcvalue):0) + (this.IpDetails[ip].IP.WiproLicenseValue?parseFloat(this.IpDetails[ip].IP.WiproLicenseValue):0))<this.IpDetails[ip].CloudTCV) && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
          this.projectService.displayMessageerror("Please note AMC value or license value cannot be lesser that Cloud TCV value in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
      else if (this.IpDetails[ip].AcceptIpDisable == false && this.IpDetails[ip].AcceptIpUI == false && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
        this.projectService.displayMessageerror("Please accept/reject IP in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if (this.IpDetails[ip].HolmesDisable == false && (!this.IpDetails[ip].IP.WiproHolmesbdmID || !this.IpDetails[ip].IP.WiproHolmesbdmName) && this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId) {
        this.projectService.displayMessageerror("Please fill holmes BDM data in " + this.converIndextoString(ip) + " row of IP table");
        return;
      }
      else if (this.IpDetails[ip].IP.WiproOpportunityIpId != IpDeleteableData.WiproOpportunityIpId && this.IpDetails.filter(res => res.IP.WiproOpportunityIpId != this.IpDetails[ip].IP.WiproOpportunityIpId && res.IP.IpName == this.IpDetails[ip].IP.IpName && res.IP.IpId == this.IpDetails[ip].IP.IpId && res.IP.WiproModuleName == this.IpDetails[ip].IP.WiproModuleName && res.IP.WiproModuleValue == this.IpDetails[ip].IP.WiproModuleValue).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
        return;
      } else {
        let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
        BSIpDataObj.statecode = (BSIpDataObj.WiproOpportunityIpId == IpDeleteableData.WiproOpportunityIpId) ? 1 : BSIpDataObj.statecode;
        // BSIpDataObj.WiproAcceptip = !this.IpDetails[ip].IP.WiproOpportunityIpId  ?true: this.IpDetails[ip].AcceptIPfrombackend;
        BSIpDataObj.WiproAcceptip = this.IpDetails[ip].AcceptIPfrombackend;
        // BSIpDataObj.AdditionalSLDetails = null;
        // BSIpDataObj.CloudDetails = null;
        BSIpDataObj.WiproAmcvalue = BSIpDataObj.WiproAmcvalue ? parseFloat(BSIpDataObj.WiproAmcvalue).toFixed(2) : null;
        BSIpDataObj.WiproLicenseValue = BSIpDataObj.WiproLicenseValue ? parseFloat(BSIpDataObj.WiproLicenseValue).toFixed(2) : null;
        IpData.push(Object.assign({}, BSIpDataObj));
      }
    }
    saveObject.WiproAllIPDetails = IpData;
    console.log("ddd",this.SolutionDetails);
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (!this.SolutionDetails[sol].solutions.WiproType) {
        this.projectService.displayMessageerror("Please select type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (!this.SolutionDetails[sol].solutions.WiproAccountname || !this.SolutionDetails[sol].solutions.WiproAccountNameValue) {
        this.projectService.displayMessageerror("Please fill name in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" &&(!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
        this.projectService.displayMessageerror("Please fill Owner in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
       else if ((!this.SolutionDetails[sol].solutions.WiproPercentageOfTCV || this.SolutionDetails[sol].solutions.WiproPercentageOfTCV == "0.00") && (!this.SolutionDetails[sol].solutions.WiproValue || this.SolutionDetails[sol].solutions.WiproValue == "0.00")) {
        this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table and it should be greater than 0");
        return;
      }
      else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && (!this.SolutionDetails[sol].solutions.WiproSolutionBDMName || !this.SolutionDetails[sol].solutions.WiproSolutionBDMName)) {
        this.projectService.displayMessageerror("Please fill solution BDM data in " + this.converIndextoString(sol) + " row of solution table");
        return;
      } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && !this.SolutionDetails[sol].solutions.WiproInfluenceType) {
        this.projectService.displayMessageerror("Please select influence type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && this.SolutionDetails[sol].solutions.WiproInfluenceType != "184450001" && !this.SolutionDetails[sol].solutions.WiproServiceType) {
        this.projectService.displayMessageerror("Please select service type in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }
      else if (this.SolutionDetails.filter(res => res.solutions.WiproType == this.SolutionDetails[sol].solutions.WiproType && res.solutions.WiproAccountname == this.SolutionDetails[sol].solutions.WiproAccountname && res.solutions.WiproAccountNameValue == this.SolutionDetails[sol].solutions.WiproAccountNameValue && res.solutions.WiproInfluenceType == this.SolutionDetails[sol].solutions.WiproInfluenceType && res.solutions.WiproServiceType == this.SolutionDetails[sol].solutions.WiproServiceType).length > 1) {
        this.projectService.displayMessageerror("Duplicate combination of type and name is present for " + this.converIndextoString(sol) + " row in solution table");
        return;
      } 
      else if(this.SolutionDetails[sol].solutions.WiproType == "184450000" && !this.SolutionDetails[sol].solutions.DealRegistration)
      {
        this.projectService.displayMessageerror("Please fill Deal Registration details for " + this.converIndextoString(sol) + " row in solution table");
        return;
      }
      else {
        if (this.SolutionDetails[sol].solutions.WiproType == "184450000") {
          totalsolutionvalueAllianceSum = totalsolutionvalueAllianceSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450002") {
          totalsolutionvalueNewAgeSum = totalsolutionvalueNewAgeSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450001") {
          totalsolutionvalueSolutionSum = totalsolutionvalueSolutionSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
        }
        let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
        BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
        BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
        SolutionData.push(Object.assign({}, BSsolutionDataObj));
      }
    }
    if (totalsolutionvalueAllianceSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of alliance value should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else if (totalsolutionvalueNewAgeSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of new age business value partner should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else if (totalsolutionvalueSolutionSum > OverAllTCV) {
      this.projectService.displayMessageerror("Total sum of solution value should be equal to or less than revised overall TCV " + OverAllTCV);
      return;
    }
    else {
      saveObject.WiproBusinessSolutionDtls = SolutionData;
    }


    this.openDialogIpDelete("This will delete the IP record", "Confirm", "Delete IP").subscribe(res => {
      // remarks
      if (res && res.action) {
        if (res.action == "save") {
          let remarks = res.remarks;
          let CurrencyValueinDollars = 0;
          this.projectService.getCurrencyStatus(this.businessSOlutionData[0].TransactionCurrencyId).subscribe(currency => {
            if (currency && currency.ResponseObject) {
              let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
              CurrencyValueinDollars = (OverAllTCV && currencyMultiplier) ? (parseFloat(OverAllTCV) / currencyMultiplier) : 0;

              if (CurrencyValueinDollars > 50000) {
                if(CurrencyValueinDollars > 99999999999)
                {
                  this.projectService.displayMessageerror("Overall TCV should be less than 99,999,999,999 USD")
                }
                else
                {
                   if (this.businessSOlutionData[0].WiproSimpleDeal == true) {
                    this.openDialogDelete("You have entered TCV more than 50K USD. This opportunity will be converted from simple to normal.", "Confirm", "Convert to normal opportunity?").subscribe(res => {
                      if (res == 'save') {
                        this.saveBusinessSolutionDataOnIPDelete(saveObject, IpDeleteableData, searchText, i, OverAllTCV, false, remarks, CurrencyValueinDollars);
                      }
                    });
                } else {
                  this.saveBusinessSolutionDataOnIPDelete(saveObject, IpDeleteableData, searchText, i, OverAllTCV, false, remarks, CurrencyValueinDollars);
                }
                }
               

              } else {
                this.saveBusinessSolutionDataOnIPDelete(saveObject, IpDeleteableData, searchText, i, OverAllTCV, this.businessSOlutionData[0].WiproSimpleDeal, remarks, CurrencyValueinDollars);
              }
            }
          });

        }
      }
    });

  }

  saveBusinessSolutionDataOnIPDelete(saveObject, IpData, searchText, i, OverAllTCV, simpleDeal, remarks, CurrencyValueinDollars) {
    let selectedCIO = (this.businessSOlutionData[0].CIO == true) ? this.CIOValue.toString() : "";
    let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
    let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
    let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
    let selectedFunction = (selectedCIO + selectedFMG + selectedHR + selectedAgile).replace(/^,/, '');

    //      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
    //       for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

    //   if(this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue ==    this.creditAllocationdataDetails[ca].creditAllocation.ServicelineId &&
    //    this.BSSLDetails[sl].BSServiceLine.WiproPracticeId ==  this.creditAllocationdataDetails[ca].creditAllocation.PracticeId &&
    //     this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == this.creditAllocationdataDetails[ca].creditAllocation.SubPracticeId){

    //    this.creditAllocationdataDetails[ca].creditAllocation.WiproValue= this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv    ; 
    //    }


    //       }
    //     }   
    //        for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {

    //        if(this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001'){
    //    this.creditAllocationdataDetails[ca].creditAllocation.WiproValue    =  OverAllTCV
    //     }
    // }

    let OppBSPDetails = {
      opportunityid: this.OpportunityId,
      CIODealPercentage: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO) ? parseFloat(this.businessSOlutionData[0].CIODealPercentage).toFixed(2) : null,
      CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
      WiproValue: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO && OverAllTCV && OverAllTCV != "0.00") ? (((parseFloat(this.businessSOlutionData[0].CIODealPercentage) * parseFloat(OverAllTCV)) / 100).toFixed(2).toString()) : null,
      FunctionInvolvedValue: selectedFunction,
      CalculationMethod: this.businessSOlutionData[0].TCVCalculation,
      WiproSimpleDeal: simpleDeal,
      WiproRemarks: remarks
    }
    saveObject.OppBSP = Object.assign({}, OppBSPDetails);
    let OverALLTCVPercChnage = 0;
    let OverAllTCVDifference = 0;
     this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : parseFloat(this.OverALLSavedTCVData);
    OverAllTCVDifference = parseFloat(this.businessSOlutionData[0].OverallTcv)  - parseFloat(this.OverALLSavedTCV);
    console.log("diff",OverAllTCVDifference);
    if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
      OverALLTCVPercChnage = OverAllTCV ? parseFloat(OverAllTCV) : 0.00;
    } else {
      OverALLTCVPercChnage = (((OverAllTCV ? parseFloat(OverAllTCV) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
      console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
    }

     if(OverALLTCVPercChnage !== 0)
      {
          let obj ={
            "TCVAuditId": "",
            "Name": "",
            "ChangeOccurred": "",
            "ChangePercentage": OverALLTCVPercChnage,
            "OpportunityId": this.OpportunityId,
            "Reason": "",
            "EstimatedSlTcv":this.businessSOlutionData[0].OverallTcv,
            "ChangeTCV" : OverAllTCVDifference
        }

        saveObject.TCVDetails = obj;
      }

     debugger;
     if (((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && (CurrencyValueinDollars < 25000000 && CurrencyValueinDollars >=1000000) && this.timeDiff >24) || ((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars >= 25000000) && this.timeDiff > 24) {
        this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

          this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage,OverAllTCVDifference).subscribe(result => {

            // if (result) {
            //   if (result.error == "saved") {

               
            //   } else if (res.error == "CRMerror") {
            //     this.projectService.throwError(res.message);
            //   }
            //   else if (res.error == "APIerror") {
            //     this.projectService.displayMessageerror(res.message);
            //   }
            // }

             saveObject.TCVDetails = this.tcvPopupObjSave;
             this.saveBusinessSolutionData(saveObject, simpleDeal);

          });
        });


    } else {
      this.saveonBSIpDelete(saveObject, IpData, searchText, i, simpleDeal);
    }


     });
    
  }



  saveonBSIpDelete(saveObject, IpData, searchText, i, simpleDeal) {
    this.service.loaderhome = true;
    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {
      if (res && res.IsError == false) {
        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.setWTFlag();
        this.projectService.throwError("IP deleted successfully");
        this.projectService.setproceedtonormal(simpleDeal);
        // this.projectService.stageSave();
        this.getBusinessSolutionPanelData(this.OpportunityId);
      } else {
        this.service.loaderhome = false;
        this.projectService.throwError(res.Message);
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror("Error Occured While Saving data");
    })
  }


  resetIPTCVandOverAllTCV() {
    let sumofIPTCV: any = this.IpDetails.reduce(function (prevVal, elem) {
      let WiproAMC: any = (elem.IP.WiproAmcvalue.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
      let LicenceValue: any = (elem.IP.WiproLicenseValue.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
      return prevVal + (LicenceValue ? parseFloat(LicenceValue[0]) : 0) + (WiproAMC ? parseFloat(WiproAMC[0]) : 0);
    }, 0);
    this.businessSOlutionData[0].IpTcv = sumofIPTCV.toFixed(2).toString();
    this.businessSOlutionData[0].OverallTcv = ((this.businessSOlutionData[0].IpTcv ? parseFloat(this.businessSOlutionData[0].IpTcv) : 0) + (this.businessSOlutionData[0].Sltcv ? parseFloat(this.businessSOlutionData[0].Sltcv) : 0)).toFixed(2).toString();
    
    this.overalltcvComma=(parseFloat(this.businessSOlutionData[0].OverallTcv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Value this.overalltcvComma", this.overalltcvComma);
  
    for (let ca = 0; ca < this.creditAllocationdataDetails.length; ca++) {
      if (this.creditAllocationdataDetails[ca].creditAllocation.WiproTypeId == '184450001') {
        this.creditAllocationdataDetails[ca].creditAllocation.WiproValue = this.businessSOlutionData[0].OverallTcv;
      }
    }

    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
      if (this.SolutionDetails[sol].solutions.WiproPercentage == true) {
        let tempSolValue: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproPercentageOfTCV) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toString() : "";
        this.SolutionDetails[sol].solutions.WiproValue = tempSolValue ? parseFloat(tempSolValue).toFixed(2).toString() : "";
      } else {
        let tempSolTCV: any = (this.businessSOlutionData[0].OverallTcv && this.SolutionDetails[sol].solutions.WiproValue) ? ((parseFloat(this.SolutionDetails[sol].solutions.WiproValue) * 100) / parseFloat(this.businessSOlutionData[0].OverallTcv)).toString() : "";
        this.SolutionDetails[sol].solutions.WiproPercentageOfTCV = tempSolTCV ? parseFloat(tempSolTCV).toFixed(2).toString() : "";
      }

    }
  }


  //**************************************************************IP Methods Ends***************************************************/




  //**************************************************************Solution Methods Starts***************************************************/
  createSolutionStructure(solutionorignalDetails) {
    this.service.loaderhome = true;
    this.SolutionDetails = []
    let solutionlength = solutionorignalDetails.length;
    for (let i = 0; i < solutionorignalDetails.length; i++) {
      let OrdersolutionorignalDetails: any = {};
      OrdersolutionorignalDetails.OwnerIdValue = solutionorignalDetails[i].OwnerIdValue ? solutionorignalDetails[i].OwnerIdValue : "";
      OrdersolutionorignalDetails.OwnerIdValueName = solutionorignalDetails[i].OwnerIdValueName ? solutionorignalDetails[i].OwnerIdValueName : "";
      OrdersolutionorignalDetails.WiproAccountNameValue = solutionorignalDetails[i].WiproAccountNameValue ? solutionorignalDetails[i].WiproAccountNameValue : "";
      OrdersolutionorignalDetails.WiproInfluenceType = solutionorignalDetails[i].WiproInfluenceType ? solutionorignalDetails[i].WiproInfluenceType : "";
      OrdersolutionorignalDetails.selectedInfluenceType = solutionorignalDetails[i].WiproInfluenceType ? solutionorignalDetails[i].WiproInfluenceType : "";
      OrdersolutionorignalDetails.DealRegistration = solutionorignalDetails[i].DealRegistration ? solutionorignalDetails[i].DealRegistration : "";
      if(solutionorignalDetails[i].DealRegistration && (solutionorignalDetails[i].DealRegistration.IsDealRegistered == true || solutionorignalDetails[i].DealRegistration.IsDealRegistered == false))
      {
       OrdersolutionorignalDetails.DealRegistration.IsDealRegistered = solutionorignalDetails[i].DealRegistration.IsDealRegistered.toString();
      }
      OrdersolutionorignalDetails.WiproInfluenceTypeName = solutionorignalDetails[i].WiproInfluenceTypeName ? solutionorignalDetails[i].WiproInfluenceTypeName : "";
      OrdersolutionorignalDetails.WiproAccountname = solutionorignalDetails[i].WiproAccountname ? solutionorignalDetails[i].WiproAccountname : "";
      OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId = solutionorignalDetails[i].WiproOpportunitySolutionDetailId ? solutionorignalDetails[i].WiproOpportunitySolutionDetailId : "";
      OrdersolutionorignalDetails.WiproPercentage = solutionorignalDetails[i].WiproPercentage ? JSON.parse(solutionorignalDetails[i].WiproPercentage) : false;
      OrdersolutionorignalDetails.WiproPercentageOfTCV = solutionorignalDetails[i].WiproPercentageOfTCV ? (parseFloat(solutionorignalDetails[i].WiproPercentageOfTCV).toFixed(2)).toString() : "";
      OrdersolutionorignalDetails.WiproServiceType = solutionorignalDetails[i].WiproServiceType ? solutionorignalDetails[i].WiproServiceType : "";
      OrdersolutionorignalDetails.WiproServiceTypeName = solutionorignalDetails[i].WiproServiceTypeName ? solutionorignalDetails[i].WiproServiceTypeName : "";
      OrdersolutionorignalDetails.WiproSolutionBDMValue = solutionorignalDetails[i].WiproSolutionBDMValue ? solutionorignalDetails[i].WiproSolutionBDMValue : "";
      OrdersolutionorignalDetails.WiproSolutionBDMName = solutionorignalDetails[i].WiproSolutionBDMName ? solutionorignalDetails[i].WiproSolutionBDMName : "";
      OrdersolutionorignalDetails.WiproType = solutionorignalDetails[i].WiproType ? solutionorignalDetails[i].WiproType : "";
      OrdersolutionorignalDetails.WiproCurrency =this.businessSOlutionData[0].TransactionCurrencyId
      OrdersolutionorignalDetails.WiproTypeName = solutionorignalDetails[i].WiproTypeName ? solutionorignalDetails[i].WiproTypeName : "";
      OrdersolutionorignalDetails.WiproValue = solutionorignalDetails[i].WiproValue ? (parseFloat(solutionorignalDetails[i].WiproValue).toFixed(2)).toString() : "";
      OrdersolutionorignalDetails.WiproOpportunityId = this.OpportunityId
      OrdersolutionorignalDetails.statecode = 0;
      OrdersolutionorignalDetails.showOrangeBorderFlagSolution =false;
      OrdersolutionorignalDetails.accountNameLoaderSolution = false;
      OrdersolutionorignalDetails.accountOwnerLoaderSolution = false;
      OrdersolutionorignalDetails.solutionBDMLoaderSolution = false;
      let nameDD = [];
      let solBDMDD = [];
      let ownerDD=[];
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
        OwnerIdValue: OrdersolutionorignalDetails.OwnerIdValue,
        OwnerName: OrdersolutionorignalDetails.OwnerIdValueName,
        Id: OrdersolutionorignalDetails.OwnerIdValue
      }] : [];

      let selectedSolBDM = (OrdersolutionorignalDetails.WiproSolutionBDMValue && OrdersolutionorignalDetails.WiproSolutionBDMName) ? [{
        Name: OrdersolutionorignalDetails.WiproSolutionBDMName,
        SysGuid: OrdersolutionorignalDetails.WiproSolutionBDMValue,
        EmailID: '',
        Id: OrdersolutionorignalDetails.WiproSolutionBDMValue
      }] : [];
      if (OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId != "") {
        this.PushToSolutionArray(OrdersolutionorignalDetails, nameDD, solBDMDD, ownerDD,selectedSolName, selectedOwnerName,selectedSolBDM, i, solutionlength);
      }
      else {
        this.PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD, solBDMDD, ownerDD,selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength);
      }
      //  this.service.loaderhome=false;
    }
    
    if (solutionlength == 0) {
      this.solutionLoader = false;
      // this.service.loaderhome=false;
    }
  }

  PushToSolutionArray(OrdersolutionorignalDetails, nameDD, solBDMDD, ownerDD,selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength) {
    this.SolutionDetails.push(Object.assign({}, new solutionDetails(OrdersolutionorignalDetails, nameDD, solBDMDD,ownerDD,selectedSolName,selectedOwnerName, selectedSolBDM, false, false,false,
      "solType" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solName" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solOwner" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solPerc" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solTCV" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solValue" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solBDM" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solInf" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId,
      "solST" + i + "SavedData" + OrdersolutionorignalDetails.WiproOpportunitySolutionDetailId)));
    if (i == (solutionlength - 1)) {
      this.solutionLoader = false;
    }
  }

  PushToSolutionArrayForSmartSearch(OrdersolutionorignalDetails, nameDD, solBDMDD,ownerDD, selectedSolName,selectedOwnerName, selectedSolBDM, i, solutionlength) {
    let solnamelength = this.SolutionDetails.length + 1;
    this.newsolDataCount = this.newsolDataCount + 1;
    this.SolutionDetails.push(Object.assign({}, new solutionDetails(OrdersolutionorignalDetails, nameDD, solBDMDD,ownerDD, selectedSolName,selectedOwnerName, selectedSolBDM, false, false,false,
      "solType" + this.newsolDataCount + "NewData" + solnamelength,
      "solName" + this.newsolDataCount + "NewData" + solnamelength,
      "solOwner" + this.newsolDataCount + "NewData" + solnamelength,
      "solPerc" + this.newsolDataCount + "NewData" + solnamelength,
      "solTCV" + this.newsolDataCount + "NewData" + solnamelength,
      "solValue" + this.newsolDataCount + "NewData" + solnamelength,
      "solBDM" + this.newsolDataCount + "NewData" + solnamelength,
      "solInf" + this.newsolDataCount + "NewData" + solnamelength,
      "solST" + this.newsolDataCount + "NewData" + solnamelength)));
    if (i == (solutionlength - 1)) {
      this.solutionLoader = false;
    }
  }

  getnamearray(solutionData, i) {
    console.log("type",this.SolutionDetails[i])
     console.log("type 1",solutionData)
    if (solutionData.WiproType == '184450001') {
      this.SolutionDetails[i].nameDD = [];
      this.SolutionDetails[i].selectedSolName = [];
      this.SolutionDetails[i].solutions.WiproAccountname = "";
      this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
      this.SolutionDetails[i].solutions.OwnerIdValueName = "";
      this.SolutionDetails[i].solutions.OwnerIdValue = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
      this.SolutionDetails[i].solutionBDMDD = [];
      this.SolutionDetails[i].selectedSolBDM = [];
      this.SolutionDetails[i].solutions.WiproInfluenceType = "";
      this.SolutionDetails[i].solutions.WiproServiceType = "";
      this.SolutionDetails[i].solutions.WiproValue = "";
      this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";

    } else {
      this.SolutionDetails[i].nameDD = [];
      this.SolutionDetails[i].selectedSolName = [];
      this.SolutionDetails[i].solutions.WiproAccountname = "";
      this.SolutionDetails[i].solutions.WiproAccountNameValue = "";
      this.SolutionDetails[i].solutions.OwnerIdValueName = "";
      this.SolutionDetails[i].solutions.OwnerIdValue = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
      this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
      this.SolutionDetails[i].solutionBDMDD = [];
      this.SolutionDetails[i].selectedSolBDM = [];
      console.log("type change",this.SolutionDetails[i].solutions.WiproOpportunitySolutionDetailId);
      if(! this.SolutionDetails[i].solutions.WiproOpportunitySolutionDetailId)
      {
        this.SolutionDetails[i].solutions.WiproInfluenceType = "";
        this.SolutionDetails[i].solutions.WiproServiceType = "";
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
      }
      
    }

    var selectedSolType = [];
    selectedSolType = this.solutionTypeDD.filter(item => item.Id == solutionData.WiproType);
    if(selectedSolType.length > 0) {
      this.SolutionDetails[i].solutions.WiproTypeName = selectedSolType[0].Name;
    }
    else {
      this.SolutionDetails[i].solutions.WiproTypeName = '';
    }
  }

  resetServiceType(solutionData, i) {
    if (solutionData.WiproInfluenceType == '184450001') {
      this.SolutionDetails[i].solutions.WiproServiceType = "";
    }
    var selectedInfType = [];
    selectedInfType = this.InfluenceTypeDD.filter(item => item.Id == solutionData.WiproInfluenceType);
    if(selectedInfType.length > 0) {
      this.SolutionDetails[i].solutions.WiproInfluenceTypeName = selectedInfType[0].Name;
    }
    else {
      this.SolutionDetails[i].solutions.WiproInfluenceTypeName = '';
    }
    
  }

  setServiceTypeName(solutionData, i) {
    var selectedServiceType = [];
    selectedServiceType = this.serviceTypeDD.filter(item => item.Id == solutionData.WiproServiceType);
    if(selectedServiceType.length > 0) {
      this.SolutionDetails[i].solutions.WiproServiceTypeName = selectedServiceType[0].Name;
    }
    else {
      this.SolutionDetails[i].solutions.WiproServiceTypeName = '';
    }
    
  }

  setEngagementModelName(slData, i) {
    var selectedEngModel = [];
    selectedEngModel = slData.EngagementModelDD.filter(item => item.Id == slData.BSServiceLine.WiproEngagementModel);
    if(selectedEngModel.length > 0) {
      this.BSSLDetails[i].BSServiceLine.WiproEngagementModelName = selectedEngModel[0].Name;
    }
    else {
      this.BSSLDetails[i].BSServiceLine.WiproEngagementModelName = '';
    }
    
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
  getSolOwnerNameDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    let obj={
        "Guid":rowData.WiproAccountNameValue,
        "SearchText":"",
        "PageSize":10,
        "RequestedPageNumber":emittedevt.currentPage
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     {
         this.SolutionDetails[i].ownerDD = (res && res.ResponseObject) ? res.ResponseObject : [];
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

  getSolNameDataPushToLookUpforSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPDropDownList(this.getSonutionNameType, emittedevt.objectRowData.searchKey, this.pageSize, emittedevt.currentPage, this.OdatanextLink).subscribe(res => {
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
     }
     else
     {   
        this.SolutionDetails[i].solutions.OwnerIdValue = '';
        this.SolutionDetails[i].solutions.OwnerIdValueName ='';
        let obj={
          "Guid": emittedevt.selectedData[0].AccountId,
          "SearchText":'',
          "PageSize":10,
          "RequestedPageNumber":1 
      }
      this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
      { 
        if(res.TotalRecordCount==1)
        {
            console.log("ssss",res);
            this.SolutionDetails[i].solutions.OwnerIdValue = res.ResponseObject[0].SysGuid;
            this.SolutionDetails[i].solutions.OwnerIdValueName = res.ResponseObject[0].Name;
            // this.SolutionDetails[i].ownerDD = res.ResponseObject;
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

      }
    }

  }
    OnCloseOfSolOwnerNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.SolutionDetails[i].solOwnerSwitch = false;
    this.OdatanextLink = null;
    if (emittedevt) {
      this.SolutionDetails[i].solutions.OwnerIdValue = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].SysGuid : "";
      this.SolutionDetails[i].solutions.OwnerIdValueName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData[0].Name : "";
      
      this.SolutionDetails[i].selectedOwnerName = (emittedevt.selectedData.length > 0) ? emittedevt.selectedData.map(it => { return Object.assign({}, it) }) : [];


    } else {

      if (!this.SolutionDetails[i].selectedSolName.some(res => res.AccountId == rowData.WiproAccountNameValue && res.AccountName == rowData.WiproAccountname)) {
        
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
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
  getSolOwnerNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt)
  {
    let obj={
        "Guid":rowData.WiproAccountNameValue,
        "SearchText":emittedevt.objectRowData.searchKey,
        "PageSize":10,
        "RequestedPageNumber":1 
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

  getSolNameDataOnsearchSolution(rowData, controlName, lookUpDD, selecteddata, value, i, emittedevt) {
    this.addIPservice.getIPDropDownList(this.getSonutionNameType, emittedevt.objectRowData.searchKey, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
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

  getOwnerArray(solution,index,searchText)
  {
    this.SolutionDetails[index].solutions.accountOwnerLoaderSolution=true;
    this.SolutionDetails[index].ownerDD=[];
     let obj={
        "Guid":solution.WiproAccountNameValue,
        "SearchText":searchText,
        "PageSize":10,
        "RequestedPageNumber":1 
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     {
         console.log("Res",res);
         this.SolutionDetails[index].solutions.accountOwnerLoaderSolution=false;
         this.SolutionDetails[index].ownerDD = (res && res.ResponseObject) ? res.ResponseObject : [];       
         this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
         this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
     })
  }

  appendOwnername(selectedData,solutions,i){
    // selectedData, solutionData, i
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
    this.SolutionDetails[i].solutions.accountNameLoaderSolution=true;
    this.addIPservice.getIPDropDownList(this.getSonutionNameType, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
     
        this.SolutionDetails[i].solutions.accountNameLoaderSolution=false;
        this.SolutionDetails[i].nameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
     
    },
      err => {
        this.SolutionDetails[i].solutions.accountNameLoaderSolution=false;
        this.SolutionDetails[i].nameDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });

  }

  setnamearrayDataonType(solutionData, i, searchText, searchType) {
    this.SolutionDetails[i].solutions.accountNameLoaderSolution=true;
    this.addIPservice.getSolNameAllianceandNewAgeDropDownList(searchType, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.SolutionDetails[i].solutions.accountNameLoaderSolution=false;
      this.SolutionDetails[i].nameDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
      this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
    },
      err => {
        // this.SolutionDetails[i].solutions.accountNameLoaderSolution=false;
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
    this.getsolutionBDMArray(solutionData,i,'');
    }
    else
    {   
      this.SolutionDetails[i].solutions.OwnerIdValue = '';
      this.SolutionDetails[i].solutions.OwnerIdValueName = '';
      let obj={
        "Guid": selectedData.AccountId,
        "SearchText":'',
        "PageSize":10,
        "RequestedPageNumber":1 
     }
     this.addIPservice.getSolOwnerNameAllianceandNewAgeDropDownList(obj).subscribe(res=>
     { 
       if(res.TotalRecordCount==1)
       {
          console.log("ssss",res);
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
      }
    }
    // data.bdmNameSwitch = false;
  }
solOwnerNameclose(solutionData, i, event){
    // event.relatedTarget
    let id = 'advanceSolutionNameSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.SolutionDetails[i].solOwnerSwitch = false;
      this.OdatanextLink = null;
      console.log("sadsad",this.SolutionDetails[i].selectedOwnerName);
      if (!this.SolutionDetails[i].selectedOwnerName.some(res => res.AccountId == solutionData.WiproAccountNameValue && res.AccountName == solutionData.WiproAccountname)) {
        this.SolutionDetails[i].solutions.OwnerIdValue = "";
        this.SolutionDetails[i].solutions.OwnerIdValueName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMName = "";
        this.SolutionDetails[i].solutions.WiproSolutionBDMValue = "";
        this.SolutionDetails[i].nameDD = [];
        this.SolutionDetails[i].selectedSolName = [];
        this.SolutionDetails[i].solutionBDMDD = [];
        this.SolutionDetails[i].selectedSolBDM = [];
      }
    }
}

  getsolutionBDMArray(solutionData, i, searchText) {

    this.SolutionDetails[i].solutions.solutionBDMLoaderSolution=true;
    this.addIPservice.getIPHolmesandSolutionBDMDropDownList(solutionData.WiproAccountNameValue, this.SearchTypeSolutionBDM, searchText, this.pageSize, this.defaultpageNumber, null).subscribe(res => {
      this.SolutionDetails[i].solutions.solutionBDMLoaderSolution=false;
      if(res.ResponseObject.length > 0)
      {
        this.SolutionDetails[i].solutionBDMDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        this.totalRecordCount = (res && res.TotalRecordCount) ? res.TotalRecordCount : 0;
        this.OdatanextLink = (res && res.OdatanextLink) ? res.OdatanextLink : null;
      }
      else
      {
        this.generateSolutionBDM(i);
      }
    },
      err => {
        this.SolutionDetails[i].solutions.solutionBDMLoaderSolution=false;
        this.SolutionDetails[i].solutionBDMDD = [];
        this.totalRecordCount = 0;
        this.OdatanextLink = null;
      });
  }

  generateSolutionBDM(i)
  {
    let solBDMArray = [];
    let solBDMObj = {
      "SysGuid" : this.SolutionDetails[i].solutions.OwnerIdValue,
      "Name" : this.SolutionDetails[i].solutions.OwnerIdValueName,
      "EmailID" :""
    }
    
    solBDMArray.push(solBDMObj)
    this.SolutionDetails[i].solutionBDMDD = solBDMArray;
    this.SolutionDetails[i].solutions.WiproSolutionBDMName = this.SolutionDetails[i].solutions.OwnerIdValueName;
    this.SolutionDetails[i].solutions.WiproSolutionBDMValue = this.SolutionDetails[i].solutions.OwnerIdValue;

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

  appendsolutionBDM(selectedData, solutionData, i) {
    console.log("selected",selectedData);
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


  checkTCVPerc(solutionData, i) {
    let tempTCV: any = solutionData.WiproPercentageOfTCV.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? tempTCV.toString() : "";
  }

  checkTCVPercBlur(solutionData, i) {
    let tempTCV: any = solutionData.WiproPercentageOfTCV.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.SolutionDetails[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV).toFixed(2).toString() : "";
    if (tempTCV) {
      if (tempTCV <= 100 && tempTCV > 0) {
        this.SolutionDetails[i].solutions.WiproValue = (this.businessSOlutionData[0].OverallTcv) ? ((parseFloat(this.businessSOlutionData[0].OverallTcv) * parseFloat(tempTCV)) / 100).toFixed(2).toString() : "";
      }
      else {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.projectService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100 for the " + this.converIndextoString(i) + " row of solution table");
      }

    } else {
      this.SolutionDetails[i].solutions.WiproValue = "";
    }
  }

  checkSolValueBlur(solutionData, i) {
  
    let tempValue: any = solutionData.WiproValue;
    this.SolutionDetails[i].solutions.WiproValue = tempValue ? parseFloat(tempValue).toFixed(2).toString() : "";
    if (tempValue) {
      let tempTCV: any = (this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? ((parseFloat(tempValue) * 100) / (parseFloat(this.businessSOlutionData[0].OverallTcv))) : "";
      if (tempTCV <= 100 && tempTCV > 0) {
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = parseFloat(tempTCV).toFixed(2).toString();
        this.SolutionDetails[i].solutions.showOrangeBorderFlagSolution=false;
      } else {
        this.SolutionDetails[i].solutions.showOrangeBorderFlagSolution=true;
        this.SolutionDetails[i].solutions.WiproValue = "";
        this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
        this.projectService.displayMessageerror("Solution value should not be greater than overall TCV in business solution panel for the " + this.converIndextoString(i) + " row of solution table");
      }

      // }

    } else {
      this.SolutionDetails[i].solutions.WiproPercentageOfTCV = "";
    }
  }

  checkSolValue(solutionData, i) {
    this.saveFlag=false;
    let tempValue: any = solutionData.WiproValue;
    this.SolutionDetails[i].solutions.WiproValue = tempValue ? tempValue : "";
  }




  addsolution() {
    this.saveFlag = false;
    this.service.loaderhome = true;
    let newSolutionDetails: solutionsInterface = {
      OwnerIdValue: "",
      OwnerIdValueName: "",
      WiproAccountNameValue: "",
      WiproInfluenceType: "",
      WiproInfluenceTypeName: "",
      selectedInfluenceType:"",
      WiproAccountname: "",
      WiproOpportunitySolutionDetailId: "",
      WiproPercentage: false,
      WiproPercentageOfTCV: "",
      WiproCurrency:this.businessSOlutionData[0].TransactionCurrencyId,
      WiproServiceType: "",
      WiproServiceTypeName: "",
      WiproSolutionBDMValue: "",
      WiproSolutionBDMName: "",
      WiproType: "",
      WiproTypeName: "",
      WiproValue: "",
      WiproOpportunityId: this.OpportunityId,
      statecode: 0,
      showOrangeBorderFlagSolution:false,
      accountNameLoaderSolution:false,
      accountOwnerLoaderSolution:false,
      solutionBDMLoaderSolution:false,
      DealRegistration:{}
    }
    let solnamelength = this.SolutionDetails.length + 1;
    this.newsolDataCount = this.newsolDataCount + 1;
    this.SolutionDetails.unshift(Object.assign({}, new solutionDetails(newSolutionDetails, [], [],[],[],[], [], false, false,false,
      "solType" + this.newsolDataCount + "NewData" + solnamelength,
      "solName" + this.newsolDataCount + "NewData" + solnamelength,
      "solOwner" + this.newsolDataCount + "NewData" + solnamelength,
      "solPerc" + this.newsolDataCount + "NewData" + solnamelength,
      "solTCV" + this.newsolDataCount + "NewData" + solnamelength,
      "solValue" + this.newsolDataCount + "NewData" + solnamelength,
      "solBDM" + this.newsolDataCount + "NewData" + solnamelength,
      "solInf" + this.newsolDataCount + "NewData" + solnamelength,
      "solST" + this.newsolDataCount + "NewData" + solnamelength)));
    this.service.loaderhome = false;
  }

  deleteBSSolutionValidation(solutionData, searchText, i) {
    debugger;
    if (solutionData.WiproOpportunitySolutionDetailId) {
      this.checksaveOBJonSolutiondelete(solutionData, searchText, i);
    }
    else {
      this.SolutionDetails.splice(i, 1);
    }
  }


  checksaveOBJonSolutiondelete(solutionDeleteData, searchText, i) {
    debugger;
    let totalsolutionvalueAllianceSum = 0;
    let totalsolutionvalueNewAgeSum = 0;
    let totalsolutionvalueSolutionSum = 0;
    let totalTCVPerc = 0;
    let totalDualCIS = 0;
    let totalCRSDual = 0;
    let totalNonDualCIS = 0;
    let totalCRSNonDual = 0;
    let totalSLTCV = 0;
    let totalContributionVericalGeo = 0;
    let VerticalGeo = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let saveObject = { OppBSP: {}, WiproBusinessSolutionDtls: [], WiproAllIPDetails: [], WiproServiceLineDtls: [], CreditAllocationsDetails: [] };
    if(this.businessSOlutionData[0].OverallTcv > 999999999999.99)
    {
       this.projectService.displayMessageerror("Over all TCV should not be greater than 12 digits");
    }
    else
    {
      for (let sl = 0; sl < this.BSSLDetails.length; sl++)
      {
        if(!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) 
        {
          this.BSSLDetails.splice(sl, 1);         
        }
      }  
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
       if(!this.IpDetails[ip].IP.IpName && !this.IpDetails[ip].IP.WiproServiceline && !this.IpDetails[ip].IP.WiproAmcvalue && !this.IpDetails[ip].IP.WiproLicenseValue)
       {
         this.IpDetails.splice(ip,1);
       }
     }   
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
       if(!this.SolutionDetails[sol].solutions.WiproType && !this.SolutionDetails[sol].solutions.WiproAccountname && !this.SolutionDetails[sol].solutions.WiproValue)
       {
         this.SolutionDetails.splice(sol,1);
       }
     } 
      if (this.disableOnRoleBSSL == false) {
      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
        if (!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue) {
          this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
         else if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus == false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV > 0 && this.BSSLDetails[sl].BSServiceLine.isAccepted == false)
        {
          this.projectService.displayMessageerror("Please accept/reject the service line in" + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproPracticeId && this.BSSLDetails[sl].SlpracticeDD.length != 0) {
          this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid && this.BSSLDetails[sl].SlpracticeDD.length != 0 && this.BSSLDetails[sl].SlSubpracticeDD.length != 0) {
          this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproSlbdmidValueName) {
          this.projectService.displayMessageerror("Please fill SL BDM data in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == false && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel and it should be greater than 0");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel) {
          this.projectService.displayMessageerror("Please select engagement model in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (this.BSSLDetails[sl].cloudFlag && !this.BSSLDetails[sl].CloudDisabled && !this.BSSLDetails[sl].BSServiceLine.Cloud) {
          // this.projectService.displayMessageerror("Please select cloudFlag in " + this.converIndextoString(sl) + " row of service lines table");
          this.projectService.displayMessageerror("Cloud section is mandatory for " + this.BSSLDetails[sl].BSServiceLine.WiproPracticeName + " and " + this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeName + " combination.Please click on cloud and update the cloud Details");
          return;
        }
        else if (this.BSSLDetails[sl].BSServiceLine.Cloud && parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv)<this.BSSLDetails[sl].CloudTCV) {
        this.projectService.displayMessageerror("Please note that SL TCV value cannot be lesser than cloud TCV value in " + this.converIndextoString(sl) + " row of service lines table");
        return;
      }
        else if (this.BSSLDetails.filter(res =>
          res.BSServiceLine.WiproServicelineidValue == this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && res.BSServiceLine.WiproPracticeId == this.BSSLDetails[sl].BSServiceLine.WiproPracticeId &&
          res.BSServiceLine.WiproSubpracticeid == this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of service line, practice and sub practice is present for " + this.converIndextoString(sl) + " row in service lines table");
          return;
        } else {
          if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "") {
           if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus==false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV>0)
            { 
            
             totalSLTCV = totalSLTCV +0;
             totalTCVPerc = totalTCVPerc +0;
             if(this.BSSLDetails[sl].BSServiceLine.isAccepted)
             {
               totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
               totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
               this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus=true;
             }
            }
          else
          {
            totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
            totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
          }
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
          // BSSLDataObj.AdditionalServiceLinesDetails = null;
          // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
          BSSLDataObj.WiproPercentageOftcv = BSSLDataObj.WiproPercentageOftcv ? parseFloat(BSSLDataObj.WiproPercentageOftcv).toFixed(2) : null;
          // BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          if(BSSLDataObj.wiproTaggedStatus==false && BSSLDataObj.TaggedTCV>0 && BSSLDataObj.isAccepted==false)
          {
             BSSLDataObj.WiproEstsltcv=null;
          }
          else
          {
             BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          }
          SLData.push(Object.assign({}, BSSLDataObj));
        }
        // if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus==false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV>0)
        //     { 
            
        //      totalSLTCV = totalSLTCV +0;
        //      totalTCVPerc = totalTCVPerc +0;
        //      if(this.BSSLDetails[sl].BSServiceLine.isAccepted)
        //      {
        //        this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus=true;
        //      }
        //     }
      }
      if (this.BSSLDetails.length <= 0) {
        this.projectService.displayMessageerror("Atleast one service line is mandatory to add");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalTCVPerc != 100 && this.businessSOlutionData[0].TCVCalculation == true && totalSLTCV != this.businessSOlutionData[0].Sltcv) {
        this.projectService.displayMessageerror("Total sum of % of TCV in service lines table should be equal to 100 % of SL TCV of business solution panel");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalSLTCV != this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].TCVCalculation == false) {

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
        saveObject.WiproServiceLineDtls = SLData;
      }
    }

    if (this.disableOnRoleBSIp == false) {
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
        if (!this.IpDetails[ip].IP.IpName || !this.IpDetails[ip].IP.IpId) {
          this.projectService.displayMessageerror("Please fill IP data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproModuleName || !this.IpDetails[ip].IP.WiproModuleValue) && this.IpDetails[ip].ModuleDisabled == false) {
          this.projectService.displayMessageerror("Please fill module data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproAmcvalue || this.IpDetails[ip].IP.WiproAmcvalue == "0.00") && (!this.IpDetails[ip].IP.WiproLicenseValue || this.IpDetails[ip].IP.WiproLicenseValue == "0.00")) {
          this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table and it should be greater than 0");
          return;
        } 
        else if ( this.IpDetails[ip].IP.WiproCloud && (((this.IpDetails[ip].IP.WiproAmcvalue?parseFloat(this.IpDetails[ip].IP.WiproAmcvalue):0) + (this.IpDetails[ip].IP.WiproLicenseValue?parseFloat(this.IpDetails[ip].IP.WiproLicenseValue):0))<this.IpDetails[ip].CloudTCV)) {
          this.projectService.displayMessageerror("Please note AMC value or license value cannot be lesser that Cloud TCV value in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails[ip].AcceptIpDisable == false && this.IpDetails[ip].AcceptIpUI == false) {
          this.projectService.displayMessageerror("Please accept/reject IP in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails[ip].HolmesDisable == false && !this.IpDetails[ip].IP.WiproHolmesbdmID && !this.IpDetails[ip].IP.WiproHolmesbdmName) {
          this.projectService.displayMessageerror("Please fill holmes BDM data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails.filter(res => res.IP.IpName == this.IpDetails[ip].IP.IpName && res.IP.IpId == this.IpDetails[ip].IP.IpId && res.IP.WiproModuleName == this.IpDetails[ip].IP.WiproModuleName && res.IP.WiproModuleValue == this.IpDetails[ip].IP.WiproModuleValue).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
          return;
        } else {
          let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
          // BSIpDataObj.WiproAcceptip = !this.IpDetails[ip].IP.WiproOpportunityIpId  ?true: this.IpDetails[ip].AcceptIPfrombackend;
          BSIpDataObj.WiproAcceptip = this.IpDetails[ip].AcceptIPfrombackend;
          // BSIpDataObj.AdditionalSLDetails = null;
          // BSIpDataObj.CloudDetails = null;
          BSIpDataObj.WiproAmcvalue = BSIpDataObj.WiproAmcvalue ? parseFloat(BSIpDataObj.WiproAmcvalue).toFixed(2) : null;
          BSIpDataObj.WiproLicenseValue = BSIpDataObj.WiproLicenseValue ? parseFloat(BSIpDataObj.WiproLicenseValue).toFixed(2) : null;
          IpData.push(Object.assign({}, BSIpDataObj));
        }
      }
      saveObject.WiproAllIPDetails = IpData;
    }
console.log("ddd",this.SolutionDetails);
    if (this.disableOnRoleBSSolution == false) {
      for (let sol = 0; sol < this.SolutionDetails.length; sol++) {

        if (!this.SolutionDetails[sol].solutions.WiproType && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please select type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        }
        else if ((!this.SolutionDetails[sol].solutions.WiproAccountname || !this.SolutionDetails[sol].solutions.WiproAccountNameValue) && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please fill name in " + this.converIndextoString(sol) + " row of solution table");
          return;
        } 
        else if (this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId && this.SolutionDetails[sol].solutions.WiproType != "184450001" &&(!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
        this.projectService.displayMessageerror("Please fill Owner in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }else if ((!this.SolutionDetails[sol].solutions.WiproPercentageOfTCV || this.SolutionDetails[sol].solutions.WiproPercentageOfTCV == "0.00") && (!this.SolutionDetails[sol].solutions.WiproValue || this.SolutionDetails[sol].solutions.WiproValue == "0.00") && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table and it should be greater than 0");
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && (!this.SolutionDetails[sol].solutions.WiproSolutionBDMName || !this.SolutionDetails[sol].solutions.WiproSolutionBDMName) && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please fill solution BDM data in " + this.converIndextoString(sol) + " row of solution table");
          return;
        } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && !this.SolutionDetails[sol].solutions.WiproInfluenceType && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please select influence type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && this.SolutionDetails[sol].solutions.WiproInfluenceType != "184450001" && !this.SolutionDetails[sol].solutions.WiproServiceType && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
          this.projectService.displayMessageerror("Please select service type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId && this.SolutionDetails.filter(res => res.solutions.WiproOpportunitySolutionDetailId != this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId && res.solutions.WiproType == this.SolutionDetails[sol].solutions.WiproType && res.solutions.WiproAccountname == this.SolutionDetails[sol].solutions.WiproAccountname && res.solutions.WiproAccountNameValue == this.SolutionDetails[sol].solutions.WiproAccountNameValue && res.solutions.WiproInfluenceType == this.SolutionDetails[sol].solutions.WiproInfluenceType && res.solutions.WiproServiceType == this.SolutionDetails[sol].solutions.WiproServiceType).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of type and name is present for " + this.converIndextoString(sol) + " row in solution table");
          return;
        }
        else if(this.SolutionDetails[sol].solutions.WiproType == "184450000" && !this.SolutionDetails[sol].solutions.DealRegistration)
      {
        this.projectService.displayMessageerror("Please fill Deal Registration details for " + this.converIndextoString(sol) + " row in solution table");
        return;
      }
         else {
          if (this.SolutionDetails[sol].solutions.WiproType == "184450000" && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
            totalsolutionvalueAllianceSum = totalsolutionvalueAllianceSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450002" && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
            totalsolutionvalueNewAgeSum = totalsolutionvalueNewAgeSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId != solutionDeleteData.WiproOpportunitySolutionDetailId) {
            totalsolutionvalueSolutionSum = totalsolutionvalueSolutionSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
          BSsolutionDataObj.statecode = (this.SolutionDetails[sol].solutions.WiproOpportunitySolutionDetailId == solutionDeleteData.WiproOpportunitySolutionDetailId) ? 1 : BSsolutionDataObj.statecode
          BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
          BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
          SolutionData.push(Object.assign({}, BSsolutionDataObj));
        }
      }
      if (totalsolutionvalueAllianceSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of alliance value should be equal to or less than overall TCV");
        return;
      }
      else if (totalsolutionvalueNewAgeSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of new age business partner value should be equal to or less than overall TCV");
        return;
      }
      else if (totalsolutionvalueSolutionSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of solution value should be equal to or less than overall TCV");
        return;
      }
      else {
        saveObject.WiproBusinessSolutionDtls = SolutionData;
      }
    }
  
    for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
      let childCreditAllocation = this.creditAllocationdataDetails.reduce((prevVal, elem) => {
        if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == elem.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == elem.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == elem.creditAllocation.SubPracticeId) {
          prevVal = prevVal ? prevVal : 0
          let contribution: any = (elem.creditAllocation.Contribution.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
          return prevVal + (contribution ? parseFloat(contribution[0]) : 0);
        } else {
          return prevVal;
        }
      }, 0);
      if (childCreditAllocation != 100 && this.creditAllocationdataDetails.filter(it => this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue == it.creditAllocation.ServicelineId && this.BSSLDetails[sl].BSServiceLine.WiproPracticeId == it.creditAllocation.PracticeId && this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid == it.creditAllocation.SubPracticeId).length > 0) {
        this.projectService.displayMessageerror("Total sum of contribution percentage in credit allocation table that belongs to " + this.converIndextoString(sl) + " row in service lines table is not 100%");
        return;
      }
    }
    this.openDialogDelete("Do you wish to delete this solution", "Confirm", "Delete solution").subscribe(res => {
      if (res == 'save') {
        let CurrencyValueinDollars = 0;

        this.projectService.getCurrencyStatus(this.businessSOlutionData[0].TransactionCurrencyId).subscribe(currency => {
          if (currency && currency.ResponseObject) {
            let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
            CurrencyValueinDollars = (this.businessSOlutionData[0].OverallTcv && currencyMultiplier) ? (parseFloat(this.businessSOlutionData[0].OverallTcv) / currencyMultiplier) : 0;
            if (CurrencyValueinDollars > 50000) {
              console.log("cvid",CurrencyValueinDollars)
               if(CurrencyValueinDollars > 99999999999)
                {
                  this.projectService.displayMessageerror("Overall TCV should be less than 99,999,999,999 USD")
                }
                else
                {
                   if (this.businessSOlutionData[0].WiproSimpleDeal == true) {
                    this.openDialogDelete("You have entered TCV more than 50K USD. This opportunity will be converted from simple to normal.", "Confirm", "Convert to normal opportunity?").subscribe(res => {
                      if (res == 'save') {
                        this.saveBusinessSolutionDataOnSolutionDelete(saveObject, solutionDeleteData, searchText, i, false, CurrencyValueinDollars);
                      }
                    });
              }
              else {
                this.saveBusinessSolutionDataOnSolutionDelete(saveObject, solutionDeleteData, searchText, i, false, CurrencyValueinDollars);
              }
                }
            

            } else {
              this.saveBusinessSolutionDataOnSolutionDelete(saveObject, solutionDeleteData, searchText, i, this.businessSOlutionData[0].WiproSimpleDeal, CurrencyValueinDollars);
            }
          }
        });

      }
    });
    }
   


  }


  saveBusinessSolutionDataOnSolutionDelete(saveObject, solutionData, searchText, i, simpleDeal, CurrencyValueinDollars) {
    debugger;
    if (this.disableOnRoleBSPanel == false) {
      let selectedCIO = (this.businessSOlutionData[0].CIO == true) ? this.CIOValue.toString() : "";
      let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
      let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
      let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
      let selectedFunction = (selectedCIO + selectedFMG + selectedHR + selectedAgile).replace(/^,/, '');


      let OppBSPDetails = {
        opportunityid: this.OpportunityId,
        CIODealPercentage: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO) ? parseFloat(this.businessSOlutionData[0].CIODealPercentage).toFixed(2) : null,
        CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
        WiproValue: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO && this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? (((parseFloat(this.businessSOlutionData[0].CIODealPercentage) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toFixed(2).toString()) : null,
        FunctionInvolvedValue: selectedFunction,
        CalculationMethod: this.businessSOlutionData[0].TCVCalculation,
        WiproRemarks: "",
        WiproSimpleDeal: simpleDeal
      }
      saveObject.OppBSP = Object.assign({}, OppBSPDetails);
      let OverALLTCVPercChnage = 0;
      let OverAllTCVDifference = 0;
       this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : parseFloat(this.OverALLSavedTCVData);
      OverAllTCVDifference = parseFloat(this.businessSOlutionData[0].OverallTcv)  - parseFloat(this.OverALLSavedTCV);
      console.log("diff",OverAllTCVDifference);
      if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
        OverALLTCVPercChnage = this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00;
      } else {
        OverALLTCVPercChnage = (((this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
        console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
      }

      if(OverALLTCVPercChnage !== 0)
      {
          let obj ={
            "TCVAuditId": "",
            "Name": "",
            "ChangeOccurred": "",
            "ChangePercentage": OverALLTCVPercChnage,
            "OpportunityId": this.OpportunityId,
            "Reason": "",
            "EstimatedSlTcv":this.businessSOlutionData[0].OverallTcv,
            "ChangeTCV" : OverAllTCVDifference
        }

        saveObject.TCVDetails = obj;
      }

     debugger;
     if (((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && (CurrencyValueinDollars < 25000000 && CurrencyValueinDollars >=1000000) && this.timeDiff >24) || ((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars >= 25000000) && this.timeDiff > 24) {
        this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

          this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage,OverAllTCVDifference).subscribe(result => {

            // if (result) {
            //   if (result.error == "saved") {

               
            //   } else if (res.error == "CRMerror") {
            //     this.projectService.throwError(res.message);
            //   }
            //   else if (res.error == "APIerror") {
            //     this.projectService.displayMessageerror(res.message);
            //   }
            // }

             saveObject.TCVDetails = this.tcvPopupObjSave;
             this.saveBusinessSolutionData(saveObject, simpleDeal);

          });
        });

      } else {
        this.saveonBSSolutionDelete(saveObject, solutionData, searchText, i, simpleDeal);
      }
       });
      
    } else {
      this.saveonBSSolutionDelete(saveObject, solutionData, searchText, i, simpleDeal);
    }
  }

  saveonBSSolutionDelete(saveObject, solutionData, searchText, i, simpleDeal) {
    debugger;
    this.service.loaderhome = true;
    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {

      if (res && res.IsError == false) {
        let advisorOwnerId = this.projectService.getSession("AdvisorOwnerId");
        this.projectService.accessModifyApi(advisorOwnerId, localStorage.getItem('userEmail')).subscribe(res => {
          this.projectService.setSession('IsPreSaleAndRole', res.ResponseObject.UserRoles.IsPreSaleAndRole)
          this.projectService.setSession('IsGainAccess', res.ResponseObject.IsGainAccess)
          this.projectService.setSession('FullAccess', res.ResponseObject.FullAccess);
          this.projectService.setSession('roleObj', res.ResponseObject);
          console.log("role access", res.ResponseObject)
          // this.projectService.stageSave();

        })
        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.setWTFlag();
        this.projectService.throwError("Solution deleted successfully");
        this.projectService.setproceedtonormal(simpleDeal);
        // this.projectService.stageSave();
        this.getBusinessSolutionPanelData(this.OpportunityId);
      } else {
        this.service.loaderhome = false;
        this.projectService.throwError(res.Message);
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror("Error Occured While Saving data");
    })
  }


  saveBusinessSolutionDataOnCreditAllocationDelete(saveObject, creditData, i, simpleDeal, CurrencyValueinDollars) {
    let selectedCIO = (this.businessSOlutionData[0].CIO == true) ? this.CIOValue.toString() : "";
    let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
    let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
    let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
    let selectedFunction = (selectedCIO + selectedFMG + selectedHR + selectedAgile).replace(/^,/, '');

    let OppBSPDetails = {
      opportunityid: this.OpportunityId,
      CIODealPercentage: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO) ? parseFloat(this.businessSOlutionData[0].CIODealPercentage).toFixed(2) : null,
      CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
      WiproValue: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO && this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? (((parseFloat(this.businessSOlutionData[0].CIODealPercentage) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toFixed(2).toString()) : null,
      FunctionInvolvedValue: selectedFunction,
      CalculationMethod: this.businessSOlutionData[0].TCVCalculation,
      WiproSimpleDeal: simpleDeal,
      WiproRemarks: ""
    }
    saveObject.OppBSP = Object.assign({}, OppBSPDetails);
    let OverALLTCVPercChnage = 0;
    let OverAllTCVDifference = 0;
    this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : parseFloat(this.OverALLSavedTCVData);
    OverAllTCVDifference = parseFloat(this.businessSOlutionData[0].OverallTcv)  - parseFloat(this.OverALLSavedTCV);
    console.log("diff",OverAllTCVDifference);
    if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
      OverALLTCVPercChnage = this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00;
    } else {
      OverALLTCVPercChnage = (((this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
      console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
    }

     if(OverALLTCVPercChnage !== 0)
      {
          let obj ={
            "TCVAuditId": "",
            "Name": "",
            "ChangeOccurred": "",
            "ChangePercentage": OverALLTCVPercChnage,
            "OpportunityId": this.OpportunityId,
            "Reason": "",
            "EstimatedSlTcv":this.businessSOlutionData[0].OverallTcv,
            "ChangeTCV" : OverAllTCVDifference
        }

        saveObject.TCVDetails = obj;
      }

     debugger;
     if (((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && (CurrencyValueinDollars < 25000000 && CurrencyValueinDollars >=1000000) && this.timeDiff >24) || ((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars >= 25000000) && this.timeDiff > 24) {
        this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

          this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage,OverAllTCVDifference).subscribe(result => {

            // if (result) {
            //   if (result.error == "saved") {

               
            //   } else if (res.error == "CRMerror") {
            //     this.projectService.throwError(res.message);
            //   }
            //   else if (res.error == "APIerror") {
            //     this.projectService.displayMessageerror(res.message);
            //   }
            // }

             saveObject.TCVDetails = this.tcvPopupObjSave;
             this.saveBusinessSolutionData(saveObject, simpleDeal);

          });
        });

   
    } else {
      this.saveonBSCADelete(saveObject, creditData, i, simpleDeal);
    }
    });
    
  }

  saveonBSCADelete(saveObject, creditData, i, simpleDeal) {
    this.service.loaderhome = true;
    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {
      if (res && res.IsError == false) {
        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.projectService.throwError("Credit allocation deleted successfully");
        this.projectService.setproceedtonormal(simpleDeal);
        // this.projectService.stageSave();
        this.getBusinessSolutionPanelData(this.OpportunityId);
      } else {
        this.service.loaderhome = false;
        this.projectService.throwError(res.Message);
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror("Error Occured While Saving data");
    })
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

  saveBusinessSolution() {
    let CurrencyValueinDollars = 0;
    this.saveFlag = true;
    let totalsolutionvalueAllianceSum = 0;
    let totalsolutionvalueNewAgeSum = 0;
    let totalsolutionvalueSolutionSum = 0;
    let totalTCVPerc = 0;
    let totalDualCIS = 0;
    let totalCRSDual = 0;
    let totalNonDualCIS = 0;
    let totalCRSNonDual = 0;
    let totalSLTCV = 0;
    let totalContributionVericalGeo = 0;
    let VerticalGeo = false;
    let SLData = [];
    let SolutionData = [];
    let IpData = [];
    let creditAllocation = [];
    let saveObject = { OppBSP: {}, WiproBusinessSolutionDtls: [], WiproAllIPDetails: [], WiproServiceLineDtls: [], CreditAllocationsDetails: [] };
      if(this.isRegionChange)
      {
         saveObject.OppBSP["isRegionChange"] = false;
      }
      for (let sl = 0; sl < this.BSSLDetails.length; sl++)
      {
        if(!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) 
        {
          this.BSSLDetails.splice(sl, 1);         
        }
      }  
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
       if(!this.IpDetails[ip].IP.IpName && !this.IpDetails[ip].IP.WiproServiceline && !this.IpDetails[ip].IP.WiproAmcvalue && !this.IpDetails[ip].IP.WiproLicenseValue)
       {
         this.IpDetails.splice(ip,1);
       }
     }   
    for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
       if(!this.SolutionDetails[sol].solutions.WiproType && !this.SolutionDetails[sol].solutions.WiproAccountname && !this.SolutionDetails[sol].solutions.WiproValue)
       {
         this.SolutionDetails.splice(sol,1);
       }
     } 
      if (this.disableOnRoleBSSL == false || this.isMultipleSLBDM || this.isPreSales) {
      console.log("weewrew",this.BSSLDetails);
      for (let sl = 0; sl < this.BSSLDetails.length; sl++) {
       
         if (!this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue) {
          this.projectService.displayMessageerror("Please select service line in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
         else if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus == false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV > 0 && this.BSSLDetails[sl].BSServiceLine.isAccepted == false)
        {
          this.projectService.displayMessageerror("Please accept/reject the service line in" + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproPracticeId && this.BSSLDetails[sl].SlpracticeDD.length != 0) {
          this.projectService.displayMessageerror("Please select practice in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid && this.BSSLDetails[sl].SlpracticeDD.length != 0 && this.BSSLDetails[sl].SlSubpracticeDD.length != 0) {
          this.projectService.displayMessageerror("Please select sub practice in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproSlbdmid || !this.BSSLDetails[sl].BSServiceLine.WiproSlbdmidValueName) {
          this.projectService.displayMessageerror("Please fill SL BDM data in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv || this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill % of TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == false && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill Est. SL TCV data in " + this.converIndextoString(sl) + " row of service lines table and it should be greater than 0");
          return;
        }
        else if (this.businessSOlutionData[0].TCVCalculation == true && this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "" && (!this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv || this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv == "0.00")) {
          this.projectService.displayMessageerror("Please fill SL TCV data in business solution panel and it should be greater than 0");
          return;
        }
        else if (!this.BSSLDetails[sl].BSServiceLine.WiproEngagementModel) {
          this.projectService.displayMessageerror("Please select engagement model in " + this.converIndextoString(sl) + " row of service lines table");
          return;
        }
        else if (this.BSSLDetails[sl].cloudFlag && !this.BSSLDetails[sl].CloudDisabled && !this.BSSLDetails[sl].BSServiceLine.Cloud) {
          // this.projectService.displayMessageerror("Please select cloudFlag in " + this.converIndextoString(sl) + " row of service lines table");
           this.projectService.displayMessageerror("Cloud section is mandatory for " + this.BSSLDetails[sl].BSServiceLine.WiproPracticeName + " and " + this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeName + " combination.Please click on cloud and update the cloud Details");
          return;
        }
        else if (this.BSSLDetails[sl].BSServiceLine.Cloud && parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv)<this.BSSLDetails[sl].CloudTCV) {
        this.projectService.displayMessageerror("Please note that SL TCV value cannot be lesser than cloud TCV value in " + this.converIndextoString(sl) + " row of service lines table");
        return;
        }

        else if (this.BSSLDetails.filter(res =>
          res.BSServiceLine.WiproServicelineidValue == this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValue && res.BSServiceLine.WiproPracticeId == this.BSSLDetails[sl].BSServiceLine.WiproPracticeId &&
          res.BSServiceLine.WiproSubpracticeid == this.BSSLDetails[sl].BSServiceLine.WiproSubpracticeid).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of service line, practice and sub practice is present for " + this.converIndextoString(sl) + " row in service lines table");
          return;
        }
        else {

          if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit == "") {
              if(this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus==false && this.BSSLDetails[sl].BSServiceLine.TaggedTCV>0)
              { 
              
              totalSLTCV = totalSLTCV +0;
              totalTCVPerc = totalTCVPerc +0;
                  if(this.BSSLDetails[sl].BSServiceLine.isAccepted)
                  {
                    totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
                    totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
                    this.BSSLDetails[sl].BSServiceLine.wiproTaggedStatus=true;
                  }
              }
              else
              {
                totalSLTCV = totalSLTCV + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
                totalTCVPerc = totalTCVPerc + ((this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproPercentageOftcv) : 0);
              }
            
              if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CIS) {
                totalNonDualCIS = totalNonDualCIS + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
              } 
              else if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CRS) {
                totalCRSNonDual = totalCRSNonDual + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
              }
          } //end of if
          else if (this.BSSLDetails[sl].BSServiceLine.WiproDualCredit != "") 
          {
              if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CIS) 
              {
                totalDualCIS = totalDualCIS + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
                let DualCRSFiltered = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CRS && it.BSServiceLine.WiproDualCredit == "");
                if (DualCRSFiltered.length <= 0) {
                  this.projectService.displayMessageerror("Please add Cybersecurity & Risk Services (CRS) service line as non dual credit for dual-credit reason: CIS - CRS dual credit for " + this.converIndextoString(sl) + " row in service lines table");
                  return;
                }
              } 
              else if (this.BSSLDetails[sl].BSServiceLine.WiproServicelineidValueName == this.CRS)
              {
                totalCRSDual = totalCRSDual + ((this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) ? parseFloat(this.BSSLDetails[sl].BSServiceLine.WiproEstsltcv) : 0);
                let DualCISFiltered = this.BSSLDetails.filter(it => it.BSServiceLine.WiproServicelineidValueName == this.CIS && it.BSServiceLine.WiproDualCredit == "");
                if (DualCISFiltered.length <= 0) {
                  this.projectService.displayMessageerror("Please add Cloud & Infrastructure Services (CIS) service line as non dual credit for dual-credit reason: CIS - CRS dual credit for " + this.converIndextoString(sl) + " row in service lines table");
                  return;
                }
             }
          } //end of else if
          let BSSLDataObj = Object.assign({}, this.BSSLDetails[sl].BSServiceLine);
          // BSSLDataObj.AdditionalServiceLinesDetails = null;
          // BSSLDataObj.AdditionalServiceLinesCloudDetails = null;
          if(BSSLDataObj.wiproTaggedStatus==false && BSSLDataObj.TaggedTCV>0 && BSSLDataObj.isAccepted==true)
          {
             BSSLDataObj.WiproPercentageOftcv=null;
          }
          BSSLDataObj.WiproPercentageOftcv = BSSLDataObj.WiproPercentageOftcv ? parseFloat(BSSLDataObj.WiproPercentageOftcv).toFixed(2) : null;
          // BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          if(BSSLDataObj.wiproTaggedStatus==false && BSSLDataObj.TaggedTCV>0 && BSSLDataObj.isAccepted==false)
          {
             BSSLDataObj.WiproEstsltcv=null;
          }
          else
          {
             BSSLDataObj.WiproEstsltcv = BSSLDataObj.WiproEstsltcv ? parseFloat(BSSLDataObj.WiproEstsltcv).toFixed(2) : null;
          }
          SLData.push(Object.assign({}, BSSLDataObj));
        } // end of else
      } // end of for

      if (this.BSSLDetails.length <= 0) {
        this.projectService.displayMessageerror("Atleast one service line is mandatory to add");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalTCVPerc != 100 && this.businessSOlutionData[0].TCVCalculation == true && totalSLTCV != this.businessSOlutionData[0].Sltcv) {
        console.log("tcv",totalTCVPerc);
        this.projectService.displayMessageerror("Total sum of % of TCV in service lines table should be equal to 100 % of SL TCV of business solution panel");
        return;
      }
      else if (this.BSSLDetails.length > 0 && totalSLTCV != this.businessSOlutionData[0].Sltcv && this.businessSOlutionData[0].TCVCalculation == false) {
        console.log('sltcvsltcvsltcv', this.BSSLDetails.length, totalSLTCV, this.businessSOlutionData[0].Sltcv, this.businessSOlutionData[0].TCVCalculation);
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
        saveObject.WiproServiceLineDtls = SLData;
        console.log("saveobj",saveObject);
      }
    } //end of if

  
    if (this.disableOnRoleBSIp == false || this.isPPS || this.IsIPOwner) {
      for (let ip = 0; ip < this.IpDetails.length; ip++) {
        if (!this.IpDetails[ip].IP.IpName || !this.IpDetails[ip].IP.IpId) {
          this.projectService.displayMessageerror("Please fill IP data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproModuleName || !this.IpDetails[ip].IP.WiproModuleValue) && this.IpDetails[ip].ModuleDisabled == false) {
          this.projectService.displayMessageerror("Please fill module data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if ((!this.IpDetails[ip].IP.WiproAmcvalue || this.IpDetails[ip].IP.WiproAmcvalue == "0.00") && (!this.IpDetails[ip].IP.WiproLicenseValue || this.IpDetails[ip].IP.WiproLicenseValue == "0.00")) {
          this.projectService.displayMessageerror("Please fill either of the license value or	AMC value in " + this.converIndextoString(ip) + " row of IP table and it should be greater than 0");
          return;
        } 
           else if ( this.IpDetails[ip].IP.WiproCloud && (((this.IpDetails[ip].IP.WiproAmcvalue?parseFloat(this.IpDetails[ip].IP.WiproAmcvalue):0) + (this.IpDetails[ip].IP.WiproLicenseValue?parseFloat(this.IpDetails[ip].IP.WiproLicenseValue):0))<this.IpDetails[ip].CloudTCV)) {
          this.projectService.displayMessageerror("Please note AMC value or license value cannot be lesser that Cloud TCV value in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails[ip].AcceptIpDisable == false && this.IpDetails[ip].AcceptIpUI == false) {
          this.projectService.displayMessageerror("Please accept/reject IP in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails[ip].HolmesDisable == false && (!this.IpDetails[ip].IP.WiproHolmesbdmID || !this.IpDetails[ip].IP.WiproHolmesbdmName)) {
          this.projectService.displayMessageerror("Please fill holmes BDM data in " + this.converIndextoString(ip) + " row of IP table");
          return;
        }
        else if (this.IpDetails.filter(res => res.IP.IpName == this.IpDetails[ip].IP.IpName && res.IP.IpId == this.IpDetails[ip].IP.IpId && res.IP.WiproModuleName == this.IpDetails[ip].IP.WiproModuleName && res.IP.WiproModuleValue == this.IpDetails[ip].IP.WiproModuleValue).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
          return;
        } else {
          let BSIpDataObj = Object.assign({}, this.IpDetails[ip].IP);
          // BSIpDataObj.WiproAcceptip = !this.IpDetails[ip].IP.WiproOpportunityIpId  ?true: this.IpDetails[ip].AcceptIPfrombackend;
          BSIpDataObj.WiproAcceptip = this.IpDetails[ip].AcceptIPfrombackend;
          // BSIpDataObj.AdditionalSLDetails = null;
          // BSIpDataObj.CloudDetails = null;
          BSIpDataObj.WiproAmcvalue = BSIpDataObj.WiproAmcvalue ? parseFloat(BSIpDataObj.WiproAmcvalue).toFixed(2) : null;
          BSIpDataObj.WiproLicenseValue = BSIpDataObj.WiproLicenseValue ? parseFloat(BSIpDataObj.WiproLicenseValue).toFixed(2) : null;
          IpData.push(Object.assign({}, BSIpDataObj));
        }
      }
      saveObject.WiproAllIPDetails = IpData;
    }
console.log("ddd",this.SolutionDetails);
    if (this.disableOnRoleBSSolution == false) {
      for (let sol = 0; sol < this.SolutionDetails.length; sol++) {
        if (!this.SolutionDetails[sol].solutions.WiproType) {
          this.projectService.displayMessageerror("Please select type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        }
        else if (!this.SolutionDetails[sol].solutions.WiproAccountname || !this.SolutionDetails[sol].solutions.WiproAccountNameValue) {
          this.projectService.displayMessageerror("Please fill name in " + this.converIndextoString(sol) + " row of solution table");
          return;
        } 
        else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" &&(!this.SolutionDetails[sol].solutions.OwnerIdValue || !this.SolutionDetails[sol].solutions.OwnerIdValueName)) {
        this.projectService.displayMessageerror("Please fill Owner in " + this.converIndextoString(sol) + " row of solution table");
        return;
      }else if ((!this.SolutionDetails[sol].solutions.WiproPercentageOfTCV || this.SolutionDetails[sol].solutions.WiproPercentageOfTCV == "0.00") && (!this.SolutionDetails[sol].solutions.WiproValue || this.SolutionDetails[sol].solutions.WiproValue == "0.00")) {
          this.projectService.displayMessageerror("Please fill either of the % of TCV or value in " + this.converIndextoString(sol) + " row of solution table and it should be greater than 0");
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType == "184450001" && (!this.SolutionDetails[sol].solutions.WiproSolutionBDMName || !this.SolutionDetails[sol].solutions.WiproSolutionBDMName)) {
          this.projectService.displayMessageerror("Please fill solution BDM data in " + this.converIndextoString(sol) + " row of solution table");
          return;
        }
        else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && !this.SolutionDetails[sol].solutions.WiproInfluenceType) {
          this.projectService.displayMessageerror("Please select influence type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        } else if (this.SolutionDetails[sol].solutions.WiproType != "184450001" && this.SolutionDetails[sol].solutions.WiproInfluenceType != "184450001" && !this.SolutionDetails[sol].solutions.WiproServiceType) {
          this.projectService.displayMessageerror("Please select service type in " + this.converIndextoString(sol) + " row of solution table");
          return;
        }
        else if (this.SolutionDetails.filter(res => res.solutions.WiproType == this.SolutionDetails[sol].solutions.WiproType && res.solutions.WiproAccountname == this.SolutionDetails[sol].solutions.WiproAccountname && res.solutions.WiproAccountNameValue == this.SolutionDetails[sol].solutions.WiproAccountNameValue && res.solutions.WiproInfluenceType == this.SolutionDetails[sol].solutions.WiproInfluenceType && res.solutions.WiproServiceType == this.SolutionDetails[sol].solutions.WiproServiceType).length > 1) {
          this.projectService.displayMessageerror("Duplicate combination of type and name is present for " + this.converIndextoString(sol) + " row in solution table");
          return;
        }
        else if(this.SolutionDetails[sol].solutions.WiproType == "184450000" && !this.SolutionDetails[sol].solutions.DealRegistration.IsDealRegistered)
      {
        this.projectService.displayMessageerror("Please fill Deal Registration details for " + this.converIndextoString(sol) + " row in solution table");
        return;
      }
         else {
          if (this.SolutionDetails[sol].solutions.WiproType == "184450000") {
            totalsolutionvalueAllianceSum = totalsolutionvalueAllianceSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450002") {
            totalsolutionvalueNewAgeSum = totalsolutionvalueNewAgeSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          else if (this.SolutionDetails[sol].solutions.WiproType == "184450001") {
            totalsolutionvalueSolutionSum = totalsolutionvalueSolutionSum + parseFloat(this.SolutionDetails[sol].solutions.WiproValue);
          }
          let BSsolutionDataObj = Object.assign({}, this.SolutionDetails[sol].solutions);
          BSsolutionDataObj.WiproPercentageOfTCV = BSsolutionDataObj.WiproPercentageOfTCV ? parseFloat(BSsolutionDataObj.WiproPercentageOfTCV).toFixed(2) : null;
          BSsolutionDataObj.WiproValue = BSsolutionDataObj.WiproValue ? parseFloat(BSsolutionDataObj.WiproValue).toFixed(2) : null;
          SolutionData.push(Object.assign({}, BSsolutionDataObj));
        }
      }
      if (totalsolutionvalueAllianceSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of alliance value should be equal to or less than overall TCV");
        return;
      }
      else if (totalsolutionvalueNewAgeSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of new age business partner value should be equal to or less than overall TCV");
        return;
      }
      else if (totalsolutionvalueSolutionSum > this.businessSOlutionData[0].OverallTcv) {
        this.projectService.displayMessageerror("Total sum of solution value should be equal to or less than overall TCV");
        return;
      } else {
        saveObject.WiproBusinessSolutionDtls = SolutionData;
      }
    }

    console.log("save obj",saveObject);
    this.projectService.getCurrencyStatus(this.businessSOlutionData[0].TransactionCurrencyId).subscribe(currency => {
      if (currency && currency.ResponseObject && currency.ResponseObject.length) {
        let currencyMultiplier = parseFloat(currency.ResponseObject[0].Name);
        CurrencyValueinDollars = (this.businessSOlutionData[0].OverallTcv && currencyMultiplier) ? (parseFloat(this.businessSOlutionData[0].OverallTcv) / currencyMultiplier) : 0;
        if (CurrencyValueinDollars > 50000) {
          if(CurrencyValueinDollars > 99999999999)
          {
            this.projectService.displayMessageerror("Overall TCV should be less than 99,999,999,999 USD")
          }
          else
          {
            if (this.businessSOlutionData[0].WiproSimpleDeal == true) {
            this.openDialogDelete("You have entered TCV more than 50K USD. This opportunity will be converted from simple to normal.", "Confirm", "Convert to normal opportunity?").subscribe(res => {
              if (res == 'save') {
                this.checkTCVChangeOnSave(saveObject, false, CurrencyValueinDollars);
              }
            });
          } else {
            this.checkTCVChangeOnSave(saveObject, false, CurrencyValueinDollars);
          }
          }
          
        } else {
          this.checkTCVChangeOnSave(saveObject, this.businessSOlutionData[0].WiproSimpleDeal, CurrencyValueinDollars);
        }
      }
    });

   
  }

  checkTCVChangeOnSave(saveObject, simpleDeal, CurrencyValueinDollars) {
    console.log("currencyvalueindollar",this.businessSOlutionData[0].OverallTcv);
    console.log("basetcv",this.BasetcvPopupData)
    console.log("TCV",this.OverALLSavedTCVData);

    if (this.disableOnRoleBSPanel == false) {
      let OverALLTCVPercChnage = 0;
      let OverAllTCVDifference = 0;
       this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

        this.BasetcvPopupData = res.ResponseObject;
        console.log("Before sortingdar",this.BasetcvPopupData)
        this.BasetcvPopupData.sort(function(a, b){
            return a.createdon-b.createdon;
        })
        console.log("After sortingdar",this.BasetcvPopupData)
        this.OverALLSavedTCV = this.BasetcvPopupData.length > 0 ?this.BasetcvPopupData[this.BasetcvPopupData.length -1 ].WiproUpdatedTCV : parseFloat(this.OverALLSavedTCVData);
      OverAllTCVDifference = parseFloat(this.businessSOlutionData[0].OverallTcv)  - parseFloat(this.OverALLSavedTCV);
      console.log("diff",OverAllTCVDifference);
      if (!this.OverALLSavedTCV || this.OverALLSavedTCV == "0.00") {
        OverALLTCVPercChnage = this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00;
      } else {
        OverALLTCVPercChnage = (((this.businessSOlutionData[0].OverallTcv ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0.00) - this.OverALLSavedTCV) / this.OverALLSavedTCV) * 100;
        console.log("OverALLTCVPercChnage", OverALLTCVPercChnage);
      }

     if(OverALLTCVPercChnage !== 0)
      {
          let obj ={
            "TCVAuditId": "",
            "Name": "",
            "ChangeOccurred": "",
            "ChangePercentage": OverALLTCVPercChnage,
            "OpportunityId": this.OpportunityId,
            "Reason": "",
            "EstimatedSlTcv":this.businessSOlutionData[0].OverallTcv,
            "ChangeTCV" : OverAllTCVDifference
        }

        saveObject.TCVDetails = obj;
      }

     debugger;
     if (((OverALLTCVPercChnage >= 20 || OverALLTCVPercChnage <= -20) && (CurrencyValueinDollars < 25000000 && CurrencyValueinDollars >=1000000) && this.timeDiff >24) || ((OverALLTCVPercChnage >= 10 || OverALLTCVPercChnage <= -10) && CurrencyValueinDollars >= 25000000) && this.timeDiff > 24) {
        this.projectService.getBusinessSolutionTCVPopUp(this.OpportunityId).subscribe(res => {

          this.opentcvpopup(((!res || !res.ResponseObject) ? [] : res.ResponseObject), OverALLTCVPercChnage,OverAllTCVDifference).subscribe(result => {

            // if (result) {
            //   if (result.error == "saved") {

               
            //   } else if (res.error == "CRMerror") {
            //     this.projectService.throwError(res.message);
            //   }
            //   else if (res.error == "APIerror") {
            //     this.projectService.displayMessageerror(res.message);
            //   }
            // }

             saveObject.TCVDetails = this.tcvPopupObjSave;
             this.saveBusinessSolutionData(saveObject, simpleDeal);

          });
        });
      } else {
        this.saveBusinessSolutionData(saveObject, simpleDeal);
      }

      })
      
      
      
    } else {
      this.saveBusinessSolutionData(saveObject, simpleDeal);
    }
  }

  setWTFlag()
  {
    this.orderService.getWTstatus({
                OrderOrOpportunityId: this.OpportunityId,
                IsOrderCheckNonBPO: false
              }).subscribe((WTResponse : any) => {
                var WTflag = false;
                if(!WTResponse.IsError && WTResponse.ResponseObject[0]) {
                  WTflag = WTResponse.ResponseObject[0].IsWT;
                }
                this.orderService.setNonWTstatus({
                  Guid: this.OpportunityId,
                  Flag: !WTflag,
                  IsProceedToClose: true
                }).subscribe(NotWTResponse => {
                  console.log('NotWTResponse', NotWTResponse);
                  this.projectService.stageSave();
                });
              });
  }


  saveBusinessSolutionData(saveObject, simpleDeal) {

    if (this.disableOnRoleBSPanel == false) {
      let selectedCIO = (this.businessSOlutionData[0].CIO == true) ? this.CIOValue.toString() : "";
      let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
      let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
      let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
      let selectedFunction = (selectedCIO + selectedFMG + selectedHR + selectedAgile).replace(/^,/, '');

      console.log("saveobj", saveObject);
      let OppBSPDetails = {
        opportunityid: this.OpportunityId,
        CIODealPercentage: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO) ? parseFloat(this.businessSOlutionData[0].CIODealPercentage).toFixed(2) : null,
        CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
        WiproValue: (this.businessSOlutionData[0].CIODealPercentage && selectedCIO && this.businessSOlutionData[0].OverallTcv && this.businessSOlutionData[0].OverallTcv != "0.00") ? (((parseFloat(this.businessSOlutionData[0].CIODealPercentage) * parseFloat(this.businessSOlutionData[0].OverallTcv)) / 100).toFixed(2).toString()) : null,
        FunctionInvolvedValue: selectedFunction,
        CalculationMethod: this.businessSOlutionData[0].TCVCalculation,
        WiproSimpleDeal: simpleDeal,
        WiproRemarks: ""
      }
      saveObject.OppBSP = Object.assign({}, OppBSPDetails);
    }

    let RFI = (this.businessSOlutionData[0].RFI) ? parseFloat(this.businessSOlutionData[0].RFI) : 0;
    let Implpletmented = (this.businessSOlutionData[0].Implpletmented) ? parseFloat(this.businessSOlutionData[0].Implpletmented) : 0;;
    let OverAllTCVRFIcheck = (this.businessSOlutionData[0].OverallTcv) ? parseFloat(this.businessSOlutionData[0].OverallTcv) : 0;
    let proposalTypeCheck = (this.businessSOlutionData[0].proposalTypeCheck) ? (this.businessSOlutionData[0].proposalTypeCheck) : "";
    this.service.loaderhome = true;
    console.log("saveobj", saveObject);
    this.projectService.saveBusinessSolution(saveObject).subscribe(res => {
      if (res && res.IsError == true) {
        this.projectService.throwError(res.Message);
        this.service.loaderhome = false;
      } else {
        // this.service.loaderhome = false;
        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.projectService.setproceedtonormal(simpleDeal);
        // this.projectService.stageSave();
        this.setWTFlag();
        this.getBusinessSolutionPanelData(this.OpportunityId);
        if (OverAllTCVRFIcheck > Implpletmented && proposalTypeCheck == 184450001) {
          this.projectService.throwError('Data saved successfully, Please note that overall TCV is greater than Empanelment value');
        }
        else if (OverAllTCVRFIcheck > RFI && proposalTypeCheck == 184450003) {
          this.projectService.throwError('Data saved successfully, Please note that overall TCV is greater than RFI value');
        }
        else {
          this.projectService.throwError('Data saved successfully');
        }
      }
    }, err => {
      this.service.loaderhome = false;
      this.projectService.displayerror("Error Occured While Saving data");
    })
  }

  opentcvpopup(POpUpdata, OverALLTCVPercChnage,OverAllTCVDifference) {
    let dialogRef = this.dialog.open(OpenTcvpopupcomponent, {
      width: "900px",
      data: { OppId: this.OpportunityId, TCVChangedetails: POpUpdata, TCVPercChnage: OverALLTCVPercChnage,OverAllTCVDifference:OverAllTCVDifference, overAllTcv: this.businessSOlutionData[0].OverallTcv }
    });

    return dialogRef.afterClosed().pipe(map(result => {
     
      this.tcvPopupObjSave = result["popupObj"];
        
      console.log("sobj",this.tcvPopupObjSave)
      this.getTcvPopupData();
      return result;
    }));
  }

  openciopopupforEdit()
  {
     console.log("pop up value",this.businessSOlutionData[0])
     if (this.disableOnRoleBSPanel == false) {
        //  this.businessSOlutionData[0].CIO = false;
          // this.businessSOlutionData[0].CIODealPercentage = "";
          // this.businessSOlutionData[0].WiproValue = "";
        if (this.projectService.currentState != "184450000") {
          let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
          let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
          let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
          let FunctionInvolved = this.CIOValue.toString() + selectedFMG + selectedHR + selectedAgile;
          console.log("asd", FunctionInvolved);
          const dialogRef = this.dialog.open(Openciopopupcomponent,
            {
              width: '350px',
              data: {
                OppId: this.OpportunityId,
                CIODealPercentage: this.businessSOlutionData[0].CIODealPercentage,
                overAllTCV: this.businessSOlutionData[0].OverallTcv,
                CIOFunctionLeadName: this.businessSOlutionData[0].CIOFunctionLeadName,
                CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
                CIOFunctionLeadEmail: this.businessSOlutionData[0].CIOFunctionLeadEmail,
                WiproValue: this.businessSOlutionData[0].WiproValue,
                FunctionInvolved: FunctionInvolved,
                CalculationMethod: this.businessSOlutionData[0].TCVCalculation
              }
            });

          dialogRef.afterClosed().subscribe(result => {
            console.log("result",result)
            if (result) {
              if (result.action == "saved") {
                // this.projectService.displayMessageerror("CIO details saved successfully");
                this.businessSOlutionData[0].CIODealPercentage = result.CIOObj.CIODealPercentage;
                this.businessSOlutionData[0].WiproValue = result.CIOObj.WiproValue;
                setTimeout(() => {
                  this.businessSOlutionData[0].CIO = true;
                })
              } else {
                setTimeout(() => {
                  // this.businessSOlutionData[0].CIO = false;
                })
              }
            } else {
              setTimeout(() => {
                // this.businessSOlutionData[0].CIO = false;
              })
            }
          });
        } else {
          setTimeout(() => {
            this.businessSOlutionData[0].CIO = true;
            this.businessSOlutionData[0].CIODealPercentage = "";
            this.businessSOlutionData[0].WiproValue = "";
          })
        }
     
    }
  }
  openciopopup(CIOFlag) {
    console.log("pop up value",this.businessSOlutionData[0])
    if (this.disableOnRoleBSPanel == false) {
      if (CIOFlag == false) {
        if (this.projectService.currentState != "184450000") {
          let selectedFMG = (this.businessSOlutionData[0].FMG == true) ? ("," + this.FMGValue.toString()) : "";
          let selectedHR = (this.businessSOlutionData[0].HR == true) ? ("," + this.HRValue.toString()) : "";
          let selectedAgile = (this.businessSOlutionData[0].Agile == true) ? ("," + this.AgileValue.toString()) : "";
          let FunctionInvolved = this.CIOValue.toString() + selectedFMG + selectedHR + selectedAgile;
          console.log("asd", FunctionInvolved);
          const dialogRef = this.dialog.open(Openciopopupcomponent,
            {
              width: '350px',
              data: {
                OppId: this.OpportunityId,
                CIODealPercentage: this.businessSOlutionData[0].CIODealPercentage,
                overAllTCV: this.businessSOlutionData[0].OverallTcv,
                CIOFunctionLeadName: this.businessSOlutionData[0].CIOFunctionLeadName,
                CIOFunctionLead: this.businessSOlutionData[0].CIOFunctionLead,
                CIOFunctionLeadEmail: this.businessSOlutionData[0].CIOFunctionLeadEmail,
                WiproValue: this.businessSOlutionData[0].WiproValue,
                FunctionInvolved: FunctionInvolved,
                CalculationMethod: this.businessSOlutionData[0].TCVCalculation
              }
            });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              if (result.action == "saved") {
                // this.projectService.displayMessageerror("CIO details saved successfully");
                this.businessSOlutionData[0].CIODealPercentage = result.CIOObj.CIODealPercentage;
                this.businessSOlutionData[0].WiproValue = result.CIOObj.WiproValue;
                setTimeout(() => {
                  this.businessSOlutionData[0].CIO = true;
                })
              } else {
                setTimeout(() => {
                  this.businessSOlutionData[0].CIO = false;
                })
              }
            } else {
              setTimeout(() => {
                this.businessSOlutionData[0].CIO = false;
              })
            }
          });
        } else {
          setTimeout(() => {
            this.businessSOlutionData[0].CIO = true;
            this.businessSOlutionData[0].CIODealPercentage = "";
            this.businessSOlutionData[0].WiproValue = "";
          })
        }
      } else {
        setTimeout(() => {
          this.businessSOlutionData[0].CIO = false;
          this.businessSOlutionData[0].CIODealPercentage = "";
          this.businessSOlutionData[0].WiproValue = "";
        })

      }
    }
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
    casesensitive:false,
    isLoader: false
  };

  //  selectedLookupData(controlName) {
  //     switch(controlName) {
  //       case  'BSSLSLBDM' : {
  //         return (this.selectedleadslinked.length > 0) ? this.selectedleadslinked : []
  //       }

  //     }
  //   }
  openadvancetabsSearch(rowData, controlName, lookUpDD, selecteddata, value, i) {
    console.log("data for lookup",selecteddata);
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
    this.lookupdata.casesensitive = true;
    this.lookupdata.isLoader = false;
    console.log("LookUpData", this.OdatanextLink);
    //  if(!(this.lookupdata.inputValue==null) && this.lookupdata.TotalRecordCount==0){
    //   this.lookupdata.TotalRecordCount=1;
    //   console.log("LookUpDatainside", this.lookupdata);
    // }
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
        console.log("loadMore", this.OdatanextLink);
        if (controlName == 'BSSLSLBDM') {
          this.getSLBDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
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
        // else if (controlName == 'BSCASLBDM') {
        //   this.getCABDMDataPushToLookUp(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        // }


      }
      else if (x.action == 'search') {
        console.log("search", x);
        this.OdatanextLink = null;
        if (controlName == 'BSSLSLBDM') {
          this.getSLBDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
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
        else if (controlName == 'BSIPHolmesBDM') {
          this.getIPHolmesBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionName') {
          this.getSolNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSIPSolutionBDM') {
          this.getSolSolutionBDMeDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        else if (controlName == 'BSSolutionOwnerName') {
          this.getSolOwnerNameDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        }
        // else if (controlName == 'BSCASLBDM') {
        //   this.getCABDMDataOnsearch(rowData, controlName, lookUpDD, selecteddata, value, i, x);
        // }

      }



    });


    dialogRef.afterClosed().subscribe(result => {
      this.totalRecordCount = 0;
      console.log("BDMClose", result);
      if (controlName == 'BSSLSLBDM') {
        this.OnCloseOfBSSLBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
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
      else if (controlName == 'BSIPHolmesBDM') {
        this.OnCloseOfIPHolmesBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSSolutionName') {
        this.OnCloseOfSolNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSIPSolutionBDM') {
        this.OnCloseOfSolSolutionBDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      else if (controlName == 'BSSolutionOwnerName') {
        this.OnCloseOfSolOwnerNamePopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      }
      this.arrowkeyLocation = 0;
      // else if (controlName == 'BSCASLBDM') {
      //   this.OnCloseOfCABDMPopUp(rowData, controlName, lookUpDD, selecteddata, value, i, result);
      // }
    });
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    if (this.userFrm.dirty) {
      this.service.dirtyflag = true;
    }
    else {
      this.service.dirtyflag = false;
    }

    if (this.serviceLineLoader == false && this.IpLoader == false && this.solutionLoader == false && this.creditAllocationLoader == false) {
     
     this.service.loaderhome = false;
      this.serviceLineLoader = false;
      this.IpLoader = false;
      this.solutionLoader = false;
      this.creditAllocationLoader = false;
    }


  }

  // clearSelectedIp(index)
  // {
  //   this.IpDetails[index].IP.IpName ="";
  //   this.IpDetails[index].selectedIP =[{}];
  // }

  // clearSelectedSLBDM(index)
  // {
  //   this.BSSLDetails[index].BSServiceLine.WiproSlbdmidValueName = "";
  //   this.BSSLDetails[index].BSServiceLine.WiproSlbdmid = "";
  // }

  // clearSelectedIpModule(index)
  // {
  //      this.IpDetails[index].IP.WiproModuleValue ="";
  //      this.IpDetails[index].IP.WiproModuleName = "";
  // }
  
  // clearSelectedIpSLBDM(index)
  // {
  //    this.IpDetails[index].IP.WiproSlbdmName = "";
  //    this.IpDetails[index].IP.WiproSlbdmValue = "";
  // }

  // clearSelectedIpHolmesBDM(index)
  // {
  //      this.IpDetails[index].IP.WiproHolmesbdmID = "";     
  //      this.IpDetails[index].IP.WiproHolmesbdmName = "";
  // }

  // clearSelectedSolutionName(index)
  // {
  //   this.SolutionDetails[index].solutions.WiproAccountNameValue = "";
  //   this.SolutionDetails[index].solutions.WiproAccountname = "";
  //   this.SolutionDetails[index].solutions.OwnerIdValueName = "";
  //   this.SolutionDetails[index].solutions.OwnerIdValue = "";
  // }

  // clearSelectedSolutionOwner(index)
  // {
  //   this.SolutionDetails[index].solutions.OwnerIdValueName = "";
  //   this.SolutionDetails[index].solutions.OwnerIdValue = "";
  // }
  
  // clearSelectedSolutionBDM(index)
  // {
  //   this.SolutionDetails[index].solutions.OwnerIdValueName = "";
  //   this.SolutionDetails[index].solutions.OwnerIdValue = "";
  // }

  clearSelectedItem(index,title)
  {

    switch (title)
    {
       case 'SLBDM':
       {
         this.BSSLDetails[index].BSServiceLine.WiproSlbdmidValueName = "";
         this.BSSLDetails[index].BSServiceLine.WiproSlbdmid = "";
         return;
       }
       case 'IPAccount':
       {
         this.IpDetails[index].IP.IpName ="";
         this.IpDetails[index].selectedIP =[{}];
         return;
       }
        case 'IPModule':
       {
         this.IpDetails[index].IP.WiproModuleValue ="";
         this.IpDetails[index].IP.WiproModuleName = "";
         return;
       }
       case 'IpSLBDM':
       {
         this.IpDetails[index].IP.WiproSlbdmName = "";
         this.IpDetails[index].IP.WiproSlbdmValue = "";
         return;
       }
       case 'IpHolmesBDM':
       {
          this.IpDetails[index].IP.WiproHolmesbdmID = "";     
          this.IpDetails[index].IP.WiproHolmesbdmName = "";
          return;
       }
       case 'solutionAccount':
       {
          if(this.SolutionDetails[index].solutions.WiproType !== 184450001)
          {
            this.SolutionDetails[index].solutions.WiproAccountNameValue = "";
            this.SolutionDetails[index].solutions.WiproAccountname = "";
            this.SolutionDetails[index].solutions.OwnerIdValueName = "";
            this.SolutionDetails[index].solutions.OwnerIdValue = "";
            return;
          }
          else
          {
            this.SolutionDetails[index].solutions.WiproAccountNameValue = "";
            this.SolutionDetails[index].solutions.WiproAccountname = "";
            this.SolutionDetails[index].solutions.OwnerIdValueName = "";
            this.SolutionDetails[index].solutions.OwnerIdValue = "";
            this.SolutionDetails[index].solutions.WiproSolutionBDMValue = "";
            this.SolutionDetails[index].solutions.WiproSolutionBDMName = "";
          }
       }
      case 'solutionOwner':
       {
          if(this.SolutionDetails[index].solutions.WiproType !== 184450001)
          {
            this.SolutionDetails[index].solutions.OwnerIdValueName = "";
            this.SolutionDetails[index].solutions.OwnerIdValue = "";
          }         
          return;
       }
      case 'solutionBDM':
       {
          this.SolutionDetails[index].solutions.WiproSolutionBDMValue = "";
          this.SolutionDetails[index].solutions.WiproSolutionBDMName = "";
          return;
        }
    }
    
      
    this.SolutionDetails[index].solutions.WiproSolutionBDMValue = "";
    this.SolutionDetails[index].solutions.WiproSolutionBDMName = "";
  }

  

  deletserline() {
    const dialogRef = this.dialog.open(deleteserviceLine1,
      {
        width: '350px'
      });
  }

  deleteippopup() {

    const dialogRef = this.dialog.open(deleteIP1,
      {
        width: '350px'
      });
  }

  editData(solutionData,i)
  {
    console.log("dsf",solutionData)
   if(solutionData.DealRegistration.IsDealRegistered == "true")
   {
      this.dealRegistered(solutionData,i,"edit");
   }
   else
   {
     this.dealNotRegistered(solutionData,i,"edit");
   }
  }

  changeDealRegistered(solutionData,i,e)
  {
    if(e.value == "true")
    {
       this.dealRegistered(solutionData,i,"create");
    }
    else
    {
       this.dealNotRegistered(solutionData,i,"create");
    }
  }

  dealRegistered(solutionData , i,eve){



    const dialogRef = this.dialog.open(dealRegisteredYesPopup, {
      width: '920px',
      data:{solutionObj : solutionData,eve : eve}
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log("res",result);
        if (result.action == "saved") {
          this.SolutionDetails[i].solutions.DealRegistration = result.dealDetails;
          this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = result.dealDetails.IsDealRegistered.toString();
          console.log("hhh",result)
        }
         else if(result.action == "cancel")
        {
          if(!result.dealDetails.DealRegistrationId)
          {
             this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = "";
          }
        }
        else
        {
          if(!result.dealDetails.DealRegistrationId)
          {
             this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = "";
          }
        }
      });
  } 

   dealNotRegistered(solutionData , i,eve){
    const dialogRef = this.dialog.open(dealRegisteredNoPopup, {
      width: '650px',
      data:{solutionObj : solutionData,eve : eve}
    });
    dialogRef.afterClosed().subscribe(result => {

      console.log("res",result);
        if (result.action == "saved") {
          this.SolutionDetails[i].solutions.DealRegistration = result.dealDetails;
          this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = result.dealDetails.IsDealRegistered.toString();
          console.log("hhh",result)
        }
        else if(result.action == "cancel")
        {
          if(!result.dealDetails.DealRegistrationId)
          {
             this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = "";
          }
        }
        else
        {
          if(!result.dealDetails.DealRegistrationId)
          {
             this.SolutionDetails[i].solutions.DealRegistration.IsDealRegistered = "";
          }
        }
      });
  }

}




@Component({
  selector: 'tcvpopup',
  templateUrl: './tcv-popup.html',
})

export class OpenTcvpopupcomponent implements OnInit {
  tcvRemarks: boolean;
  tcvDetails: boolean;
  TCVChangesdetails: any = [];
  OppId: string = "";
  Reason: string = "";
  TCVPerc: string = '';
  selectedChanged = "";
  ChangeOccuredDD = [];
  overallTCV = '';
  tcvDifference = 0;
  tcvPopupObj : any = {};


  constructor(public dialogRef: MatDialogRef<OpenTcvpopupcomponent>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService) { }
  ngOnInit() {
    debugger;
    this.projectService.getChangeOccured().subscribe(res => {
      this.ChangeOccuredDD = (res && res.ResponseObject) ? res.ResponseObject : [];
    }, err => {
      this.ChangeOccuredDD = [];
    });
    this.TCVPerc = this.data.TCVPercChnage ? this.data.TCVPercChnage.toFixed(2) : ''
    this.TCVChangesdetails = this.data.TCVChangedetails ? this.data.TCVChangedetails : [];
    this.tcvDifference = this.data.OverAllTCVDifference;
    this.OppId = this.data.OppId ? this.data.OppId : '';
    this.tcvRemarks = true;
    this.tcvDetails = false;
    this.overallTCV = this.data.overAllTcv;
    console.log("tcv",this.overallTCV)
  }

  changeTCVPerc(TCVValue) {
    let tempTCV: any = TCVValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    if (tempTCV) {
      if (tempTCV[0] <= 100 && tempTCV[0] >= 0) {
        this.TCVPerc = tempTCV[0].toString()
      }
      else {
        this.TCVPerc = "";
        this.projectService.displayMessageerror("% of TCV should be greater than equal to 0 and less than equal to 100");
      }
    } else {
      this.TCVPerc = "";
    }
  }

  TCVPercBlur(TCVValue) {
    let tempTCV: any = TCVValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.TCVPerc = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
  }

  additionalInfo1() {
    this.tcvRemarks = true;
    this.tcvDetails = false;
  }
  servicevalue1() {
    this.tcvDetails = true;
    this.tcvRemarks = false;
  }

  saveTCVPopUP() {
    debugger
    if (!this.selectedChanged) {
      this.projectService.displayMessageerror("Please select the change occurred");
      return;
    }
    else if (!this.Reason.trim()) {
      this.projectService.displayMessageerror("Please provide reason for change");
      return;
    }
    else {
      let saveObj = {
        "TCVAuditId": "",
        "Name": "",
        "ChangeOccurred": this.selectedChanged,
        "ChangePercentage": parseFloat(parseFloat(this.TCVPerc).toFixed(2)),
        "OpportunityId": this.OppId,
        "Reason": this.Reason,
        "EstimatedSlTcv":parseFloat(parseFloat(this.overallTCV).toFixed(2)),
        "ChangeTCV" : this.tcvDifference

      }

      this.tcvPopupObj = saveObj;
      console.log("saveobj",this.tcvPopupObj)
     
      this.dialogRef.close({ error: "saved", message: "TCV data saved successfully" , popupObj : this.tcvPopupObj});
    
    }
  }

}

@Component({
  selector: 'deal-registered-yes-popup',
  templateUrl: './deal-registered-yes-popup.html',
  styleUrls: ['../order/order.component.scss']
})
export class dealRegisteredYesPopup {
   registrationStatus : any;
  registrationStatusReason :any;
  registrationDetails:any;

  OpportunityId: string = this.projectService.getSession("opportunityId"); 

  constructor(public dialogRef: MatDialogRef<dealRegisteredYesPopup>, @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public addIPservice: AddIpService,public projectService : OpportunitiesService ){}
  ngOnInit()
  {
    this.getRegistrationStatus();
    this.getRegistrationStatusReason();

    console.log("this.data",this.data)

    
   if(this.data.solutionObj.DealRegistration && (this.data.solutionObj.DealRegistration.IsDealRegistered == true || this.data.solutionObj.DealRegistration.IsDealRegistered == "true") && this.data.eve == "edit")
   {
     this.registrationDetails = this.data.solutionObj.DealRegistration
   }
   else
   {
    this.registrationDetails = {
                        "DealRegistrationId": "",
                        "IsDealRegistered": true,
                        "OpportunityId": this.OpportunityId,
                        "SolutionId": "",
                        "PartnerPortalId": "",
                        "RegisteredValue": 0,
                        "RegistrationStatus": "",
                        "RegistrationStatusName": "",
                        "RegistrationStatusReason": "",
                        "RegistrationStatusReasonName": "",
                        "Remarks": "",
                        "Statecode": 0
        }
   }
    
  }
  
  getRegistrationStatus()
  {
    this.addIPservice.getRegistrationStatusForAlliance().subscribe((res)=>
    {
      this.registrationStatus = res.ResponseObject; 
    })
  }

  getRegistrationStatusReason()
  {
    this.addIPservice.getRegistrationStatusReasonForAlliance(true).subscribe((res)=>
    {
      this.registrationStatusReason = res.ResponseObject; 
    })
  }

  changeStatus()
  {
    
  }
  
 

 cancel()
 {
   this.dialogRef.close({ action: "cancel", dealDetails: this.registrationDetails });
 }
  
 saveData()
 {
    if(!this.registrationDetails.RegistrationStatus)
   {
     this.projectService.displayMessageerror("Please select Registration Status.")
   }
   else if(!this.registrationDetails.RegistrationStatusReason)
   {
     this.projectService.displayMessageerror("Please select Status reason.")
   }
   else if(!this.registrationDetails.PartnerPortalId)
   {
     this.projectService.displayMessageerror("Please fill partner portal ID.")
   }

   else if(!this.registrationDetails.RegisteredValue)
   {
     this.projectService.displayMessageerror("Please fill Registered value.")
   }

   else if(this.registrationDetails.RegistrationStatusReason == 184450004 && !this.registrationDetails.Remarks)
   {
     this.projectService.displayMessageerror("Please fill Remarks.")
   }
   else
   {
    this.dialogRef.close({ action: "saved", dealDetails: this.registrationDetails });
   }
  }
}






@Component({
  selector: 'deal-registered-no-popup',
  templateUrl: './deal-registered-no-popup.html',
  styleUrls: ['../order/order.component.scss']
})
export class dealRegisteredNoPopup {
  registrationStatusReason :any;
  registrationDetails:any;
  OpportunityId: string = this.projectService.getSession("opportunityId"); 

  constructor(public dialogRef: MatDialogRef<dealRegisteredNoPopup>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,public addIPservice: AddIpService,public projectService : OpportunitiesService){}
  ngOnInit()
  {
    this.getRegistrationStatusReason();

   if(this.data.solutionObj.DealRegistration && (this.data.solutionObj.DealRegistration.IsDealRegistered == false || this.data.solutionObj.DealRegistration.IsDealRegistered == "false") && this.data.eve == "edit")
   {
     this.registrationDetails = this.data.solutionObj.DealRegistration
   }
   else
   {  
    this.registrationDetails = {
                        "DealRegistrationId": "",
                        "IsDealRegistered": false,
                        "OpportunityId": this.OpportunityId,
                        "SolutionId": "",   
                        "RegistrationStatusReason": "",
                        "RegistrationStatusReasonName": "",
                        "Remarks": "",
                        "Statecode": 0
    }
   }
  }

  getRegistrationStatusReason()
  {
    this.addIPservice.getRegistrationStatusReasonForAlliance(true).subscribe((res)=>
    {
      this.registrationStatusReason = res.ResponseObject; 
    })
  }

  cancel()
  {
     this.dialogRef.close({ action: "cancel", dealDetails: this.registrationDetails });
  }
  
 saveData()
 { 
  if(!this.registrationDetails.RegistrationStatusReason)
   {
     this.projectService.displayMessageerror("Please select Status Reason.")
   }
   
   else if(this.registrationDetails.RegistrationStatusReason == 184450004 && !this.registrationDetails.Remarks)
   {
     this.projectService.displayMessageerror("Please fill Remarks.")
   }
   else
   {
    this.dialogRef.close({ action: "saved", dealDetails: this.registrationDetails });
   }
 }
}

@Component({
  selector: 'ciopopup',
  templateUrl: './ciopopup.html',
  styleUrls: ['./business-solution.component.scss']


})
export class Openciopopupcomponent implements OnInit {
  CurrencySymbol = this.projectService.getSession('currencySymbol');
  constructor(public dialogRef: MatDialogRef<Openciopopupcomponent>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService) { }

  ngOnInit() {

    this.calculateWiproValue(this.data.CIODealPercentage);
  }
  calculateWiproValue(WiproPerc) {
    debugger;
    let tempPerc: any = WiproPerc.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    if (tempPerc) {
      if (tempPerc[0] >= 0 && tempPerc[0] <= 100) {
        this.data.CIODealPercentage = tempPerc[0];
        this.data.WiproValue = (this.data.CIODealPercentage && this.data.overAllTCV && this.data.overAllTCV != "0.00") ? (((parseFloat(this.data.CIODealPercentage) * parseFloat(this.data.overAllTCV)) / 100).toFixed(2).toString()) : "";
      } else {
        this.data.WiproValue = "";
        this.data.CIODealPercentage = "";
        this.projectService.displayMessageerror("Percentage of deal supported should be greater than 0 and less than equal to 100");
      }
    } else {
      this.data.WiproValue = "";
      this.data.CIODealPercentage = "";
    }
  }
  blurWiproPerc(WiproPerc) {
    let tempPerc: any = WiproPerc.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    if (tempPerc) {
      if (tempPerc[0] > 0) {
        this.data.CIODealPercentage = parseFloat(tempPerc[0]).toFixed(2).toString();
        this.data.WiproValue = (this.data.CIODealPercentage && this.data.overAllTCV && this.data.overAllTCV != "0.00") ? (((parseFloat(this.data.CIODealPercentage) * parseFloat(this.data.overAllTCV)) / 100).toFixed(2).toString()) : "";
      } else {
        this.data.WiproValue = "";
        this.data.CIODealPercentage = "";
        this.projectService.displayMessageerror("Percentage of deal supported should be greater than 0 and less than equal to 100");
      }
    } else {
      this.data.WiproValue = "";
      this.data.CIODealPercentage = "";
    }
  }
  returnvalue() {

    if (!this.data.CIODealPercentage || this.data.CIODealPercentage == "0.00") {
      this.projectService.displayMessageerror("Please provide percentage of deal supported");
      return;
    } else if (!this.data.WiproValue || this.data.WiproValue == "0.00") {
      this.projectService.displayMessageerror("Please provide the overall TCV to save the CIO and it should be greater than 0");
      return;
    }
    // else if (!this.data.CIOFunctionLeadName || !this.data.CIOFunctionLead) {
    //   this.projectService.displayMessageerror("Function lead should be there to save CIO details");
    //   return;
    // }
    else {
      let saveOBjectCIO = {
        opportunityid: this.data.OppId,
        CIODealPercentage: parseFloat(this.data.CIODealPercentage).toFixed(2),
        CIOFunctionLead: this.data.CIOFunctionLead,
        WiproValue: parseFloat(this.data.WiproValue).toFixed(2),
        FunctionInvolvedValue: this.data.FunctionInvolved,
        CalculationMethod: this.data.CalculationMethod
      }
      this.dialogRef.close({ action: "saved", CIOObj: saveOBjectCIO });
      // this.projectService.saveCIOData(saveOBjectCIO).subscribe(res => {
      //   if (res && res.IsError == true) {
      //     this.projectService.displayMessageerror(res.Message);

      //   } else {

      //   }
      // }, err => {
      //   this.projectService.displayerror(err.status);
      // })


    }

  }
}


@Component({
  selector: 'ip',
  templateUrl: './deleteip-popup.html',
})
export class deleteIP1 {
  panelOpenState;
  remarks = "";
  constructor(public dialogRef: MatDialogRef<deleteIP1>, @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService) { }

  returnvalue() {
    if (!this.remarks.trim()) {
      this.projectService.displayMessageerror("Please provide the remarks for deleting this IP");
      return;
    } else {
      this.dialogRef.close({ action: 'save', remarks: this.remarks });
    }

  }


}

@Component({
  selector: 'serviceline',
  templateUrl: './deleteserviceline-popup.html',
})
export class deleteserviceLine1 {
  panelOpenState;
  constructor(public dialogRef: MatDialogRef<deleteserviceLine1>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  returnvalue() {
    this.dialogRef.close('save');
  }

}

@Component({
  selector: 'serviceline',
  templateUrl: './businesssolution-popup.html',
  styleUrls: ['./business-solution.component.scss']
})
export class OpenBusinessSolution {
  constructor(public dialogRef: MatDialogRef<OpenBusinessSolution>, public router: Router) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

// added new popups as per new requirement starts here 11Jul
@Component({
  selector: 'ip',
  templateUrl: './ip-popup.html',
  styleUrls: ['./business-solution.component.scss']

})
export class OpenIP {
  negativeregex : any = new RegExp(/^-?\d*\.?\d{0,2}$/, "g");
  positiveregex : any = new RegExp(/^\d*\.?\d{0,2}$/, "g");
  acceptNegative = false;
  errorBorderVariable: boolean = false;
  orderCreatedCheck: boolean = false;
  Competitortab = true;
  Teambuildingtab = false;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  ipCloud_data: any = [];
  additionalIpData: any = [];
  serviceProvider: any = [];
  cloudDetailsIp: any = [];
  additionalIpDataForTable: any = {};
  cloudTCV = 0;
  ipObj: any = {}
  userAccessAPI: any = {}
  disableUserAccessIP: boolean = true;
  disableUserAccessIPforcloud: boolean = true;
  userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
  fullAccessSessionCheck: boolean = false;
  errorFlag: boolean = false;
  accessSaveButton: boolean = false;
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  opportunityName;
  finalTCVValue;
  IPTCV;
  IPTCVForComparison;
  opportunityStatusCheck;
  tempCloudArray: any = [];
  overAllTCV;
  currencySymbol = this.projectService.getSession('currencySymbol');

  tempAdditionalIpData: any = [];
  cloudData: any = [];
  tempCloudData: any = [];
  perceptionData:any={
    "TaggedamcValue":0,
    "TaggedLicenseValue":0
  };
  
  IsAppirioFlag=this.projectService.getSession('IsAppirioFlag')?this.projectService.getSession('IsAppirioFlag'):false;
  
  constructor(public dialogRef: MatDialogRef<OpenIP>, public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private EncrDecr: EncrDecrService,public service: DataCommunicationService, public projectService: OpportunitiesService) {
  }

  table_data = [
    { first_data: "IP", second_data: "",title:"IP" },
    { first_data: "Module", second_data: "",title:"Module" },
    { first_data: `TCV (${this.currencySymbol})`, second_data: "",title:"TCV" },
    { first_data: `IP TCV (${this.currencySymbol})`, second_data: "",title:"IP TCV" },
    { first_data: `Est license value (${this.currencySymbol})`, second_data: "",title:"Est license value"},
    { first_data: `Est AMC Value (${this.currencySymbol})`, second_data: "",title:"Est AMC Value"},
    { first_data: "Owner", second_data: "",title:"Owner"},
    { first_data: "Module contact", second_data: "",title:"Module contact" }
  ]

  ngOnInit() {
    debugger;
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.ipObj = this.projectService.getSession('IPObjForCloud')
    console.log("this.ipObj", this.data.Details)
    let IPtcvValue = Number(this.data.Details.WiproAmcvalue)+Number(this.data.Details.WiproLicenseValue);
    this.IPTCVForComparison =Number(this.data.Details.WiproAmcvalue)+Number(this.data.Details.WiproLicenseValue);
    this.IPTCV = IPtcvValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.overAllTCV = this.data.OverAllTCV;
    if (this.data.ShowIpCloud) {
      this.dDatabasebtn = true;
      this.wiproDatabsebtn = false;
      // this.getCloudValue();
    }
    else {
      this.dDatabasebtn = false;
      this.wiproDatabsebtn = true;
      // this.getAdditionalIpInfo();
    }
      this.additionalIpData = {
      FrontEndID: Math.random().toString(36).substring(2),
      WiproadditionalSolutionValue: "",
      WiproadditionalValueOfTCV: "",
      WiprocustomizationComments: "",
      WiproCustomizationValue: "",
      WiproImplementationComments: "",
      WiproImplementationValue: "",
      WiproProfessionaServicesComments: "",
      WiproProfessionalServicesValue: "",
      TransactionCurrencyIdValue: this.data.TransactionCurrencyId,
      statecode: 0,
      WiproOpportunityIpAdditionaInfoid: "",
      WiproAbsolutevalue:""
    } 

      if (this.data && typeof this.data == 'object') {
      this.table_data[0].second_data = this.data.Details.IpName;
      this.table_data[1].second_data = this.data.Details.WiproModuleName;
      this.table_data[2].second_data = this.data.OverAllTCV.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.table_data[3].second_data = this.IPTCV;
      this.table_data[4].second_data = this.data.Details.TaggedLicenseValue?this.data.Details.TaggedLicenseValue:0;
      this.table_data[5].second_data = this.data.Details.TaggedamcValue?this.data.Details.TaggedamcValue:0;
      this.table_data[6].second_data =this.data.Details.WiproSolutionOwnerName;
      this.table_data[7].second_data =  this.data.Details.WiproModuleContactIdName;

    }
    this.perceptionData.TaggedamcValue=this.data.Details.TaggedamcValue;
    this.perceptionData.TaggedLicenseValue=this.data.Details.TaggedLicenseValue;

    
    this.tempAdditionalIpData = JSON.parse(JSON.stringify(this.data.Details.AdditionalSLDetails));
    this.tempAdditionalIpData.map(it => {
      it.FrontEndID = Math.random().toString(36).substring(2);
    })
    if (typeof this.tempAdditionalIpData.filter(it => it.statecode != 1)[0] === 'object') {
      this.additionalIpData = Object.assign({}, this.tempAdditionalIpData.filter(it => it.statecode != 1)[0]);
    }
    
    if(this.additionalIpData.WiproadditionalValueOfTCV)
    {
      this.additionalIpData.WiproAbsolutevalue= (( this.additionalIpData.WiproadditionalSolutionValue * this.overAllTCV) /100).toFixed(2);
      if(this.additionalIpData.WiproadditionalSolutionValue=="0.00"){
        this.additionalIpData.WiproadditionalSolutionValue="00.00";
      }
    }
    else
    {
      this.additionalIpData.WiproadditionalSolutionValue= (( this.additionalIpData.WiproAbsolutevalue * 100) / this.overAllTCV).toFixed(2);
      if(this.additionalIpData.WiproadditionalSolutionValue=="0.00"){
        this.additionalIpData.WiproadditionalSolutionValue="00.00";
      }
    }

    console.log("this.table_data", this.additionalIpData);

    if (this.data.Details.CloudDetails && this.data.Details.CloudDetails.length > 0) {
      this.tempCloudData = JSON.parse(JSON.stringify(this.data.Details.CloudDetails));
      this.tempCloudData.map(it => {
        it.FrontEndID = Math.random().toString(36).substring(2);
        if(it.WiproRemarks == undefined)
        {
          it.WiproRemarks = "";
        }
      })
      this.cloudData = this.tempCloudData.filter(it => it.CloudStatecode != 1);
    }
    this.calculateCloudValue(false);
    console.log("this.ipObj", this.data)
    this.userAccessAPI = this.projectService.getSession('roleObj') || {}
    this.fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    this.orderCreatedCheck = this.projectService.getSession('ordercreated') == true;

    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {
      console.log("check", this.userGuid==this.data.Details.WiproSolutionOwnerId)
      console.log("check1", this.userGuid)
      console.log("check2", this.userAccessAPI)
      
      if(!this.IsAppirioFlag)
      {
          if (this.userAccessAPI.FullAccess || this.fullAccessSessionCheck) {
            this.disableUserAccessIP = false;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
          else if(this.userAccessAPI.PartialAccess && (this.userAccessAPI.IsIPOwner || this.userAccessAPI.UserRoles.IsPreSaleAndRole ||  this.userAccessAPI.UserRoles.IsPpsFunction))
          {
            this.disableUserAccessIP = true;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
          else
          {
              this.disableUserAccessIP = true;
              this.accessSaveButton = false;
              this.disableUserAccessIPforcloud=true;
          }
      }
     
    }
    else {
      this.disableUserAccessIP = true;
      this.accessSaveButton = false;
      this.disableUserAccessIPforcloud=true;
    }
    //Drop Down API call
   this.getDropDownData();
   
  
  }

   getDropDownData()
    {
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

   setIPCloudName(i,selectedId,fieldname) {
     console.log("index",this.cloudData);
      console.log("selectedId",selectedId.value);
       console.log("fieldname",fieldname);
       let selectedValue=selectedId.value;
    if (fieldname == 'WiproFunction') {
      let functionSelect: any = this.FunctionList.filter(it => it.Id == selectedValue);
      this.cloudData[i].Function = (functionSelect.length > 0) ? functionSelect[0].Name : "";
    } else if (fieldname == 'WiproCategory') {
      let categorySelect: any = this.CategoryList.filter(it => it.Id == selectedValue);
      this.cloudData[i].Category = (categorySelect.length > 0) ? categorySelect[0].Name : "";
    }
    else if (fieldname == 'WiproServiceProvider') {
      let serviceSelect: any = this.ServiceProviderList.filter(it => it.Id == selectedValue);
      this.cloudData[i].ServiceProvider = (serviceSelect.length > 0) ? serviceSelect[0].Name : "";
    }
    else if (fieldname == 'WiproTechnology') {
      let technologySelect: any = this.TechnologyList.filter(it => it.Id == selectedValue);
      this.cloudData[i].Technology = (technologySelect.length > 0) ? technologySelect[0].Name : "";
    }

    console.log("sdadsad",this.cloudData[i]);

  }

   additionalInfo() {
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {
      if(!this.IsAppirioFlag)
      {
          if (this.userAccessAPI.FullAccess || this.fullAccessSessionCheck) {
            this.disableUserAccessIP = false;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
           else if(this.userAccessAPI.PartialAccess && (this.userAccessAPI.IsIPOwner || this.userAccessAPI.UserRoles.IsPreSaleAndRole ||  this.userAccessAPI.UserRoles.IsPpsFunction))
          {
            this.disableUserAccessIP = true;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
          else
          {
              this.disableUserAccessIP = true;
              this.accessSaveButton = false;
              this.disableUserAccessIPforcloud=true;
          }
      }
     
    }
    else {
      this.disableUserAccessIP = true;
      this.accessSaveButton = false;
      this.disableUserAccessIPforcloud = true;
    }
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
        // this.userIPCloudFrm.form.markAsDirty();
        if (this.additionalIpData.WiproOpportunityIpAdditionaInfoid) {
          let i = this.tempAdditionalIpData.findIndex(it => it.WiproOpportunityIpAdditionaInfoid == this.additionalIpData.WiproOpportunityIpAdditionaInfoid);
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
          WiproadditionalSolutionValue: "",
          WiproadditionalValueOfTCV: "",
          WiprocustomizationComments: "",
          WiproCustomizationValue: "",
          WiproImplementationComments: "",
          WiproImplementationValue: "",
          WiproProfessionaServicesComments: "",
          WiproProfessionalServicesValue: "",
          TransactionCurrencyIdValue: this.data.TransactionCurrencyId,
          statecode: 0,
          WiproOpportunityIpAdditionaInfoid: "",
          WiproAbsolutevalue:""
        }
      }
    })
  }
  finalTCVValue2="0.00";
  calculateCloudValue(disableShow) {
    console.log("final value",this.finalTCVValue)
    this.cloudTCV = 0;
    this.finalTCVValue = 0;
    for (let i = 0; i < this.cloudData.length; i++) {
      const tcvValue = Number(this.cloudData[i].WiproValue);
      if (tcvValue) {
        this.cloudTCV += tcvValue;
      }
    }
    if (!disableShow) {
      this.finalTCVValue = parseFloat(this.cloudTCV.toString().replace(/\B(?=(\d{12})+(?!\d))/g, ",")).toFixed(2);
    }
    this.finalTCVValue2= (parseFloat(this.finalTCVValue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("finalTCVValue", this.finalTCVValue);
    console.log("finalTCVValue2", this.finalTCVValue2);

  }

  addIpCloud() {
    this.cloudData.unshift({
      FrontEndID: Math.random().toString(36).substring(2),
      WiproFunction: "",
      WiproCategory: "",
      WiproServiceProvider: "",
      WiproTechnology: "",
      WiproOpenSource: "",
      WiproValue: "",
      WiproRemarks: "",
      CloudStatecode: 0,
      Function: "",
      Category: "",
      ServiceProvider: "",
      Technology: "",
      WiproOpportunityCloudDetailid: "",
      TransactionCurrencyIdValue:this.data.TransactionCurrencyId,
      newRow:true
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
    let cloudValue = clouddata.WiproValue ;
    cloudValue = (cloudValue.toString()).replace(",","");
    let firstval :any = cloudValue.substr(0,event.target.selectionStart)
    let secondval : any = cloudValue.substr(event.target.selectionStart)
    let tempNewValue : any = firstval + event.key + secondval;
    let newValue: any = this.acceptNegative ? tempNewValue.match(this.negativeregex) : tempNewValue.match(this.positiveregex);
      if (newValue) {
      return true;
    } else {
      return false;
    }
  }

  goBack() {
    window.history.back();
  }

  tabone() {
    this.Competitortab = true;
    this.Teambuildingtab = false;
  }
  tabtwo() {
    this.Competitortab = false;
    this.Teambuildingtab = true;
  }

 
  getCloudValue() {
    this.errorBorderVariable = false;
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {
      if(this.IsAppirioFlag)
      {
          if (this.userAccessAPI.FullAccess || this.fullAccessSessionCheck) {
            this.disableUserAccessIP = false;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
          else if(this.userAccessAPI.PartialAccess && (this.userAccessAPI.IsIPOwner || this.userAccessAPI.UserRoles.IsPreSaleAndRole ||  this.userAccessAPI.UserRoles.IsPpsFunction))
          {
            this.disableUserAccessIP = true;
            this.accessSaveButton = true;
            this.disableUserAccessIPforcloud = false;
          }
          else
          {
              this.disableUserAccessIP = true;
              this.accessSaveButton = false;
              this.disableUserAccessIPforcloud=true;
          }
      }
  
    }
    else {
      this.disableUserAccessIP = true;
      this.accessSaveButton = false;
      this.disableUserAccessIPforcloud = true;
    }

    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
    let obj = {
      "Guid": this.ipObj.Details.WiproOpportunityIpId
    }
    this.projectService.getCloudDetailsIp(obj).subscribe(cloudData => {
      console.log("cloudData", cloudData.ResponseObject)
      this.ipCloud_data = [];
      if (!cloudData.IsError) {
        if (cloudData.ResponseObject) {
          this.ipCloud_data = cloudData.ResponseObject;
          for (var i = 0; i < this.ipCloud_data.length; i++) {
            for (var j = 0; j < this.FunctionList.length; j++) {
              if (this.ipCloud_data[i].WiproFunction == this.FunctionList[j].Id) {
                this.ipCloud_data[i].WiproFunctionName = this.FunctionList[j].Name;

              }
            }
          }
          for (var i = 0; i < this.ipCloud_data.length; i++) {
            for (var j = 0; j < this.CategoryList.length; j++) {
              if (this.ipCloud_data[i].WiproCategory == this.CategoryList[j].Id) {
                this.ipCloud_data[i].WiproCategoryName = this.CategoryList[j].Name;

              }
            }
          }
          for (var i = 0; i < this.ipCloud_data.length; i++) {
            for (var j = 0; j < this.ServiceProviderList.length; j++) {
              if (this.ipCloud_data[i].WiproServiceProvider == this.ServiceProviderList[j].Id) {
                this.ipCloud_data[i].WiproServiceProviderName = this.ServiceProviderList[j].Name;

              }
            }
          }
          for (var i = 0; i < this.ipCloud_data.length; i++) {
            for (var j = 0; j < this.TechnologyList.length; j++) {
              if (this.ipCloud_data[i].WiproTechnology == this.TechnologyList[j].Id) {
                this.ipCloud_data[i].WiproTechnologyName = this.TechnologyList[j].Name;

              }
            }
          }
          this.tempCloudArray = cloudData.ResponseObject.map(it => Object.assign({}, it));
        }
        console.log("this.ipCloud_data", this.ipCloud_data)
        this.ipCloud_data.unshift(
          {
            createNew: true,
            WiproCategory: "",
            WiproFunction: "",
            WiproOpenSource: "",
            WiproRemarks: "",
            WiproServiceProvider: "",
            WiproTechnology: "",
            WiproValue: "",
            modifiedData: false,
            WiproOpportunityCloudDetailid: ""
          }
        )


        this.calculateCloudValue(false);
      }
      else {
        this.projectService.displayMessageerror(cloudData.Message);
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      })
  }

  deleteIpCloudRecord(index) {
    let data = this.ipCloud_data[index];
    if (data.createNew) {
      // delete the row from ui since the condition states this is newly created data
      this.ipCloud_data.splice(index, 1)
      this.projectService.displayMessageerror("Data deleted successfully!!")
      this.calculateCloudValue(false)
    } else {
      // the data needs to deleted through api since the same is fetched from server
      let obj = {
        "SearchText": "cloud",
        "Guid": this.ipCloud_data[index].WiproOpportunityCloudDetailid

      }
      this.projectService.deleteIpAdditionDetails(obj).subscribe(res => {
        if (res.IsError == false) {
          this.projectService.displayMessageerror("Data deleted successfully!!")
          this.getCloudValue()
        }
        else {
          this.projectService.displayMessageerror("Unable to delete data please try again")
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        })
    }
  }
 updateIpAdditionalDetails(e, keyName) {
    if (keyName == 'WiproadditionalSolutionValue') {
      if (Number(e.target.value) > 100 || (!Number(e.target.value))) {
        this.projectService.displayMessageerror("Percentage of additional solution value should be greater than 0 and less than equal to 100");
        this.additionalIpData.WiproadditionalSolutionValue = "";
        this.additionalIpData.WiproAbsolutevalue = "";
        this.errorFlag = true;

      }
      else {
        let Value = e.target ? e.target.value : "";
        let calulatedValue = this.overAllTCV * Value / 100;
        this.additionalIpData.WiproAbsolutevalue = calulatedValue.toFixed(2);
        this.additionalIpData['WiproAbsolutevalue'] = calulatedValue.toFixed(2);
      }
    }
    if (keyName == 'WiproAbsolutevalue') {
      if (Number(e.target.value) > Number(this.overAllTCV)) {
        this.projectService.displayMessageerror("Absolute value cannot be greater than TCV value:" + (this.overAllTCV))
      }
      else {
        let Value = e.target ? e.target.value : "";
        let calulatedValue = Value / this.overAllTCV * 100;
        this.additionalIpData.WiproadditionalSolutionValue = calulatedValue.toFixed(2);
        this.additionalIpData['WiproadditionalSolutionValue'] = calulatedValue.toFixed(2);
      }
    }
    if (!this.errorFlag) {
      this.additionalIpData[keyName] = e.target ? e.target.value : e.checked;
    }
    console.log("this.additionalIpData", this.additionalIpData)
  }
confirmdelete(index, cloudData) {
    const dialogRef = this.dialog.open(OpenipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // this.userIPCloudFrm.form.markAsDirty();
        if (cloudData.WiproOpportunityCloudDetailid) {
        
          let i = this.tempCloudData.findIndex(it => it.WiproOpportunityCloudDetailid == cloudData.WiproOpportunityCloudDetailid);
          this.cloudData.splice(index, 1);
          this.calculateCloudValue(false)
          if (i >= 0) {
            this.tempCloudData[i].CloudStatecode = 1;
          }
        } else {
         
          let i = this.tempCloudData.findIndex(it => it.FrontEndID == cloudData.FrontEndID && !it.WiproOpportunityCloudDetailid);
          this.cloudData.splice(index, 1);
          this.calculateCloudValue(false)
          if (i >= 0) {
            this.tempCloudData.splice(i, 1);
          }
        }
      }
    })
  }
   saveData() {
    debugger;
    if (this.wiproDatabsebtn) {
      console.log("dsdfdsf",this.table_data);
      this.perceptionData.TaggedLicenseValue=this.table_data[4].second_data;
      this.perceptionData.TaggedamcValue=this.table_data[5].second_data;
      // this.userIPCloudFrm.form.markAsDirty();
      if (this.additionalIpData.WiproOpportunityIpAdditionaInfoid) {
        let i = this.tempAdditionalIpData.findIndex(it => it.WiproOpportunityIpAdditionaInfoid == this.additionalIpData.WiproOpportunityIpAdditionaInfoid);
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
      this.dialogRef.close();
    }
    else {
      // this.clouddirtyflag = this.userIPCloudFrm.dirty;
      console.log("cloud data",this.cloudData);
      if(this.cloudData.length){
      for(let index=0;index<this.cloudData.length;index++)
      {
        let item = this.cloudData[index];
        if (!item.WiproFunction) {
          this.projectService.displayMessageerror("Please select function in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.WiproCategory) {
          this.projectService.displayMessageerror("Please select category in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.WiproServiceProvider) {
          this.projectService.displayMessageerror("Please select service provider in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.WiproTechnology) {
          this.projectService.displayMessageerror("Please select technology in " + this.converIndextoString(index) + " row of IP cloud");
          return;
        }
        else if (!item.WiproValue || item.WiproValue == "0.00") {
          this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(index) + " row of IP cloud and it should be greater than 0");
          return;
        }
        else if (item.WiproOpenSource && !item.WiproRemarks.trim()) {
           console.log("cloud data3",this.cloudData);
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
          this.dialogRef.close();
        }
      }
    }
    else{
      this.projectService.displayMessageerror("Kindly enter the cloud details");
    }
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
    console.log("update value",updatedValue);
    if (keyName == 'WiproValue') {
      if (!Number(updatedValue)) {
        this.cloudData[index][keyName] = "";
        this.calculateCloudValue(false)
        this.projectService.displayMessageerror("Cloud Value Cannot be 0")
        return;
      }
    console.log("pavithra1",this.IPTCVForComparison);
      let slTcv = Number(this.IPTCVForComparison);
      console.log("pavithra",slTcv);
      if (!slTcv) {
        this.cloudData[index][keyName] = "";
        this.projectService.displayMessageerror("Cloud TCV value cannot be greater than IP TCV value")
        this.cloudData[index].modifiedData = true;
        this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);
        return;
      }
      this.calculateCloudValue(true);
      if (slTcv < this.cloudTCV) {
        this.cloudData[index][keyName] = "";
        this.projectService.displayMessageerror("Cloud TCV value cannot be greater than IP TCV value")
        this.calculateCloudValue(false);
        this.cloudData[index].modifiedData = true;
        this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);
        return;
      };

      this.cloudData[index][keyName] = e.target.value;
      this.calculateCloudValue(false);
    }
    let data = this.cloudData[index];
    this.cloudData[index][keyName] = updatedValue;
    this.cloudData[index].modifiedData = true;
    if (this.cloudData[index].newRow != true)
      this.cloudData[index].CloudStatecode = 0;
    this.cloudData[index].isValid = this.validateMandatoryFields(this.cloudData[index]);

  }
  validateMandatoryFields(data) {
    let validData = true;
    let mandatoryFields = [
      "WiproCategory", "WiproFunction", "WiproServiceProvider",
      "WiproTechnology", "WiproValue"];
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
    // console.log("Clouddirty", this.userIPCloudFrm.dirty);
    // if (this.userIPCloudFrm.dirty) {
    //   this.clouddirtyflag = true;
    // }
  }

  ngOnDestroy() {
    console.log('this.tempAdditionalIpData', this.tempAdditionalIpData);
    this.tempCloudData.map(it => {
      delete it.FrontEndID;
      delete it.newRow;
      delete it.isValid;
      delete it.modifiedData;
    })

    this.tempAdditionalIpData.map(it => {
      delete it.FrontEndID;
    })
    console.log('this.this.tempCloudData', this.tempCloudData);
    this.dialogRef.close({ "cloudTCV": this.finalTCVValue, "additionalIpData": this.tempAdditionalIpData, "cloudData": this.tempCloudData ,"perceptionData":this.perceptionData})
  } 
  

}





@Component({
  selector: 'servicelinepopup',
  templateUrl: './serviceline-popup.html',
  styleUrls: ['./business-solution.component.scss']
})
export class OpenServiceline {
// data:{Details: ServiceLIneData, OverAllTCV: this.businessSOlutionData[0].OverallTcv, SLTCV: this.businessSOlutionData[0].Sltcv, IPTCV: this.businessSOlutionData[0].IpTcv, ShowCloud: showCloud}
  // dummy variable for showing orange border.
  @ViewChild('mySLCloudForm') public userSLCloudFrm: NgForm;
  errorBorderVariable: boolean = false;
  orderCreatedCheck: boolean = false;
  clouddirtyflag = false;
  Competitortab = true;
  Teambuildingtab = false;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  additionServicelineDetails: any = {};
  positiveregex : any = new RegExp(/^(\d{0,12})(\.\d{0,2})?$/, "g");
  negativeregex : any = new RegExp(/^(-?|\d{0,1})(\d{0,11})(\.\d{0,2})?$/, "g");
  acceptNegative = false;
  serviceLineCloud_data: any = [];
  serviceProvider: any = [];
  Sltcvinput='';
  cloudTCV = "0.00";
  finalTCVValue;
  SLTCV;
  serviceLineObj: any = {};
  roleObj:any={};
  saveServiceLineInput: any = [{
    "OppServiceLineId": "",
    "SLTCVInput": ""
  }];
  disableAccessPermission: boolean = true
  disableAccessPermissionCloud: boolean = true
  userAccessRightsFromAPI: any = {}
  slbdmOwnerCheck: boolean = false;
  isTeamBuilderUser: boolean = false;
  fullAccessSessionCheck: boolean = false;
  accessSaveButton: boolean = false;
  slbdmId;
  userGuid;
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  opportunityName;
  opportunityStatusCheck;
  tempCloudArray: any = [];
  currencySymbol;
  //isLoading :boolean=false;

  savedcloudSLData: any[] = [];
  cloudSLData: any[] = [];
  AdditionalServiceLinesDetails: any = {};
  TcvForComparison;
 
  IsAppirioFlag=this.projectService.getSession('IsAppirioFlag')?this.projectService.getSession('IsAppirioFlag'):false;
  
  IsAppirioServiceLine=false;
  IsAppirioSession=this.projectService.getSession('IsAppirio')?this.projectService.getSession('IsAppirio'):false;
  uniqueId=this.data.Details.checkforAppirio?this.data.Details.checkforAppirio:'';

  constructor(public dialogRef: MatDialogRef<OpenServiceline>, @Inject(MAT_DIALOG_DATA) public data: any, public service: DataCommunicationService, private EncrDecr: EncrDecrService, public projectService: OpportunitiesService, public dialog: MatDialog) {
  }

  ngOnInit() {
    debugger;

    console.log("ss",this.data.Details);
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.currencySymbol = (this.data.currencySymbol ? this.data.currencySymbol : 'NA');
    this.serviceLineObj =  (this.data.Details ? this.data.Details : {});


    this.roleObj=this.projectService.getSession('roleObj');
    console.log("roleOb",this.roleObj);
    console.log("sessiomn",this.data.Details.checkforAppirio);
    
    this.IsAppirioServiceLine=(this.uniqueId.length>0 && this.IsAppirioSession);
    console.log("sessiomn1",this.IsAppirioServiceLine);
     this.savedcloudSLData = this.data.Details.AdditionalServiceLinesCloudDetails.map((addColumn) => {
      let newColumn = Object.assign({}, addColumn);
      newColumn.FrontEndID = Math.random().toString(36).substring(2);
      if(addColumn.WiproRemarks == undefined)
      {
          newColumn.WiproRemarks = "";
      }
      return newColumn;
    });
    this.cloudSLData = this.savedcloudSLData.filter(cloud => cloud.CloudStatecode != 1).map((it) => {
      this.cloudTCV = ((this.cloudTCV ? parseFloat(this.cloudTCV) : 0) + (it.WiproValue ? parseFloat(it.WiproValue) : 0)).toFixed(2);
      return Object.assign({}, it)
    });
    this.cloudTCV2= (parseFloat(this.cloudTCV).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if(this.data.Details.AdditionalServiceLinesDetails.ServiceLineAdditionalDtls)
    {
       console.log("sdasd1",this.data.Details.AdditionalServiceLinesDetails);
      if(this.data.Details.AdditionalServiceLinesDetails.ServiceLineAdditionalDtls.length)
      {       
        this.Sltcvinput=this.data.Details.AdditionalServiceLinesDetails.ServiceLineAdditionalDtls[0].WiproSltcvinput?this.data.Details.AdditionalServiceLinesDetails.ServiceLineAdditionalDtls[0].WiproSltcvinput:'';
        this.AdditionalServiceLinesDetails=this.data.Details.AdditionalServiceLinesDetails;
      } 
      else
      {
         this.AdditionalServiceLinesDetails={
         "ServiceLine": this.data.servicelineName,
          "Practice": this.data.practiceName,
          "SubPractice": this.data.subPracticeName,
          "ServiceLineAdditionalDtls": [
            {
               "WiproOpportunitySlAdditionalInformationid": "",
                "WiprosldurationinMonths": 0,
                "WiproSltcvinput": 0,
                "WiproSlyear1acv": 0,
                "TransactionCurrencyidValue": this.data.TransactionCurrencyId,
                "WiproSubpracticeName": this.data.subPracticeName,
            }
          ]
       }
      }     
    }
    else
    {
       console.log("sdasd2",this.data.Details.AdditionalServiceLinesDetails);
        this.AdditionalServiceLinesDetails={
         "ServiceLine": this.data.servicelineName,
          "Practice": this.data.practiceName,
          "SubPractice": this.data.subPracticeName,
          "ServiceLineAdditionalDtls": [
            {
               "WiproOpportunitySlAdditionalInformationid": "",
                "WiprosldurationinMonths": 0,
                "WiproSltcvinput": 0,
                "WiproSlyear1acv": 0,
                "TransactionCurrencyidValue": this.data.TransactionCurrencyId,
                "WiproSubpracticeName": this.data.subPracticeName,
            }
          ]
       }
    }

    this.getAllDropDownData();
    if (this.data.ShowCloud) {
      this.dDatabasebtn = true;
      this.wiproDatabsebtn = false;
      this.getCloudValue();
    }
    else {
      this.dDatabasebtn = false;
      this.wiproDatabsebtn = true;
      this.getAdditionalInfo();

    }

    console.log("this.clouddta", this.cloudSLData)
    console.log("this.serviceLineObj", this.serviceLineObj)
    let sltcvValue = this.serviceLineObj.WiproEstsltcv;
    this.SLTCV = sltcvValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    console.log("this.sltcv",sltcvValue);
    this.TcvForComparison=sltcvValue;
    this.slbdmId = this.serviceLineObj.WiproSlbdmid;
    this.userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    this.orderCreatedCheck = this.projectService.getSession('ordercreated') == true;
    this.fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
    console.log("sdsd",this.projectService.getSession('roleObj'));
    console.log("appirio cjeck",this.IsAppirioServiceLine)
   
    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {
      if (((this.slbdmId == this.userGuid && this.roleObj.PartialAccess) || this.roleObj.UserRoles.IsHelpRoleFullAccess) && this.IsAppirioFlag == false && this.IsAppirioServiceLine == false) {
        this.slbdmOwnerCheck = true;
        this.disableAccessPermission = false;
        this.accessSaveButton = true;
      }
    }
    else {
      this.slbdmOwnerCheck = false;
      this.disableAccessPermission = true;
      this.accessSaveButton = false;
    }
  }
    //Drop Down API call

     getAllDropDownData() {
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
      console.log("currency",this.data.TransactionCurrencyId)
    this.cloudSLData.unshift(
      {
        FrontEndID: Math.random().toString(36).substring(2),
        WiproCategory: "",
        Category: "",
        WiproFunction: "",
        Function: "",
        WiproRemarks: "",
        WiproOpensource: false,
        WiproServiceprovider: "",
        WiproTechnology: "",
        WiproValue: "",
        WiproOpportunityCloudDetailid: "",
        CloudStatecode: 0,       
        ServiceProvider: "",
        Technology: "",
        TransactionCurrencyidValue:this.data.TransactionCurrencyId
      }
    );
  }

    deletecompetitor(cloudData, i) {
    this.userSLCloudFrm.form.markAsDirty();
    if (cloudData.WiproOpportunityCloudDetailid) {
      let index = this.savedcloudSLData.findIndex(it => it.WiproOpportunityCloudDetailid == cloudData.WiproOpportunityCloudDetailid);
      this.cloudSLData.splice(i, 1);
      if (index >= 0) {
        this.savedcloudSLData[index].CloudStatecode = 1;
      }
    } else {
      let index = this.savedcloudSLData.findIndex(it => it.FrontEndID == cloudData.FrontEndID && !it.WiproOpportunityCloudDetailid);
      this.cloudSLData.splice(i, 1);
      if (index >= 0) {
        this.savedcloudSLData.splice(index, 1);
      }
    }
    let sumofValue = 0;
    for(let index = 0;index < this.cloudSLData.length;index++)
    {
      const tcvValue = Number(this.cloudSLData[index].WiproValue);
      if (tcvValue) {
        sumofValue += tcvValue;
      }
    }
    console.log("summ",sumofValue);
    this.cloudTCV = sumofValue.toString();
  }

  oninputOfValue(clouddata, i, event) {
    if ((event.charCode == 46 && !clouddata.WiproValue.includes('.')) || (event.charCode >= 48 && event.charCode <= 57)) {
      return true;
    } else {
      return false;
    }
  }

  cloudTCV2="0.00";
  onValueBlur(clouddata, i) {
    let tempvalue: any = clouddata.WiproValue;
    let tempdecimalVal: any = tempvalue ? parseFloat(tempvalue).toFixed(2).toString() : "";
    this.cloudSLData[i].WiproValue = tempdecimalVal;
    let sumofValue: any = this.cloudSLData.reduce(function (prevVal, elem) {
      let val: any = (elem.WiproValue.toString()).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
      return prevVal + (val ? parseFloat(val[0]) : 0);
    }, 0);
    console.log("sum value",sumofValue);
    console.log("sum value",this.TcvForComparison);
     
    if (sumofValue > parseFloat(this.TcvForComparison)) {
      this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value");
      this.cloudSLData[i].WiproValue = tempdecimalVal = "";
    } else {
      this.cloudTCV = sumofValue;
      this.cloudTCV2= (parseFloat(this.cloudTCV).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      console.log("this.cloudTCV check2", this.cloudTCV2);
      if (this.cloudSLData[i].WiproValue == '0.00') {
        this.cloudSLData[i].WiproValue = tempdecimalVal = "";
        this.projectService.displayMessageerror("Value provided in " + this.converIndextoString(i) + " row of service line cloud should be greater than 0");
      }
    }
  }

  saveSLCloud()
  {

    if(this.dDatabasebtn)
    {
      let buildSavedDataArray = [];
      if(this.cloudSLData.length){      
          for (let i = 0; i < this.cloudSLData.length; i++) {
            if (!this.cloudSLData[i].WiproFunction) {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please select function in " + this.converIndextoString(i) + " row of service line cloud");
              return;
            } else if (!this.cloudSLData[i].WiproCategory) {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please select category in " + this.converIndextoString(i) + " row of service line cloud");
              return;
            } else if (!this.cloudSLData[i].WiproServiceprovider) {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please select service provider in " + this.converIndextoString(i) + " row of service line cloud");
              return;
            }
            else if (!this.cloudSLData[i].WiproTechnology) {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please select technology in " + this.converIndextoString(i) + " row of service line cloud");
              return;
            }
            else if (!this.cloudSLData[i].WiproValue || this.cloudSLData[i].WiproValue == "0.00") {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please provide value in " + this.converIndextoString(i) + " row of service line cloud and it should be greater than 0");
              return;
            }
            else if (!this.cloudSLData[i].WiproRemarks.trim() && this.cloudSLData[i].WiproOpensource == true) {
              this.errorBorderVariable=true;
              this.projectService.displayMessageerror("Please provide remarks in " + this.converIndextoString(i) + " row of service line cloud");
              return;
            }
            else {
              let SaveOBJ = Object.assign({}, this.cloudSLData[i]);
              buildSavedDataArray.push(SaveOBJ);
            }
          }}
    else{
      this.projectService.displayMessageerror("Kindly enter the cloud details");
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
          this.dialogRef.close();
    }
    else
    {
      console.log("wewrwer",this.AdditionalServiceLinesDetails)
      this.AdditionalServiceLinesDetails.ServiceLineAdditionalDtls[0].WiproSltcvinput=parseFloat(this.Sltcvinput);
      this.projectService.displayMessageerror("Data added successfully");
      // this.dialogRef.close();
      console.log("wewrwer",this.AdditionalServiceLinesDetails)
    }
    
    //  this.clouddirtyflag = this.userSLCloudFrm.dirty;
    
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
    // console.log("Clouddirty", this.userSLCloudFrm.dirty);
    // if (this.userSLCloudFrm.dirty) {
    //   this.clouddirtyflag = true;
    // }
  }

  ngOnDestroy() {
    debugger;
    this.dialogRef.close({
      "cloudTCV": this.cloudTCV, "clouddirtyflag": this.clouddirtyflag,
      "cloudData": this.savedcloudSLData.map((addColumn) => {
        let newColumn = Object.assign({}, addColumn);
        delete newColumn.FrontEndID;
        return newColumn;
      }),
      "additionServicelineDetails":this.AdditionalServiceLinesDetails
    })
  }

  getAdditionalInfo() {
    debugger;
    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {      
      if (((this.slbdmId == this.userGuid && this.roleObj.PartialAccess) || this.roleObj.UserRoles.IsHelpRoleFullAccess) && this.IsAppirioFlag ==false && this.IsAppirioServiceLine == false){
        this.slbdmOwnerCheck = true;
        this.disableAccessPermission = false;
        this.accessSaveButton = true;
      }
      else
      {
        this.slbdmOwnerCheck = false;
        this.disableAccessPermission = true;
        this.accessSaveButton = false;
      }
    }
    else {
      this.slbdmOwnerCheck = false;
      this.disableAccessPermission = true;
      this.accessSaveButton = false;
    }
  }
  


  calculateCloudValue(disableShow) {
    debugger;
    this.cloudTCV = "0";
    this.finalTCVValue = 0;
    for (let i = 0; i < this.serviceLineCloud_data.length; i++) {
      const tcvValue = Number(this.serviceLineCloud_data[i].WiproValue);
      if (tcvValue) {
        this.cloudTCV += tcvValue;
      }
    }
    //this.cloudTCV = parseFloat(this.cloudTCV).toFixed(2);
    if (!disableShow) {
      this.finalTCVValue = parseFloat(this.cloudTCV.toString().replace(/\B(?=(\d{15})+(?!\d))/g, ",")).toFixed(2);
    }
  }
  goBack() {
    window.history.back();
  }
  tabone() {
    this.Competitortab = true;
    this.Teambuildingtab = false;
  }
  tabtwo() {
    this.Competitortab = false;
    this.Teambuildingtab = true;
  }

  additionalInfo() {
    this.getAdditionalInfo();
    // this.accessSaveButton = false;
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
    // if (this.slbdmId == this.userGuid) {
    //   this.accessSaveButton = true;
    // }
  }
  
 
  checkDecimalValue(data, index, keyName) {

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
  
   getCloudValue() {
    debugger;
    this.errorBorderVariable = false;
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
    this.userAccessRightsFromAPI = this.projectService.getSession('roleObj') || {}
    this.fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    console.log("this.userAccessRightsFromAPI", this.userAccessRightsFromAPI)
    if (this.userAccessRightsFromAPI.PartialAccess && this.userAccessRightsFromAPI.IsTeamBuilderSection) {
      this.isTeamBuilderUser = true;
    }
    if (this.opportunityStatusCheck == 1 && !this.orderCreatedCheck) {
      if ((this.userAccessRightsFromAPI.FullAccess || (this.userAccessRightsFromAPI.PartialAccess &&this.slbdmId == this.userGuid) || this.isTeamBuilderUser || this.fullAccessSessionCheck) && this.IsAppirioFlag == false && this.IsAppirioServiceLine == false) {
        this.disableAccessPermissionCloud = false;
        this.accessSaveButton = true;
      }
    }
    else {
      this.disableAccessPermissionCloud = true;
      this.accessSaveButton = false;
    }
  }
 

}
// added new popups as per new requirement ends here

@Pipe({ name: "orderByIndex" })
export class OrderrByIndexPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if(value && value.length > 0) {
      value.sort(function(a, b) {
        console.log("inside sort funtion", value, "a ",a," b",b);
        var c = a.BSServiceLine.index;
       var d = b.BSServiceLine.index;
       if(c > d) {
         return 1
       }
       else if(d > c) {
         return -1
       } 
       else {
         return 0
       }
      //  return c-d;
   });
   return value;
    }
    console.log('records ',value, 'args ',args)

  }
   
}

