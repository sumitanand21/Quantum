import { Component, OnInit, Inject } from "@angular/core";
import {
  dealService,
  IntellectualHeader
} from "@app/core/services/deals.service";
import { DealCriteriaModel } from "@app/core/models/commercialviewedit.model";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import {
  ErrorMessage,
  OnlineOfflineService,
  ApiServiceDeal5B
} from "@app/core/services";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import {
  DealParameterListAction,
  ModuleListAction,
  calculateDeals,
  ExistingListAction
} from "@app/core/state/actions/deals.actions";
import { DealParameter } from "@app/core/state/selectors/deals/deal-parameter.selectors";
import { Subscription, Observable } from "rxjs";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { EnvService } from "@app/core/services/env.service";

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}
@Component({
  selector: "app-deal-criteria",
  templateUrl: "./deal-criteria.component.html",
  styleUrls: ["./deal-criteria.component.scss"]
})
export class DealCriteriaComponent implements OnInit {
  QaURL = envADAL.sprint5BaseUrl.QaURL;
  moduleIndex: any = 0;
  Flag:boolean = false;
  notValid: boolean = false;
  panelOpenState: boolean = false;
  panelOpenState1: boolean = false;
  panelOpenState2: boolean = false;
  tableTotalCount: number[] = [];
  panelOpenState3: boolean = false;
  panelOpenState4: boolean = false;
  panelOpenState5: boolean = false;
  rlsbtn: boolean = false;
  isPass: boolean = false;
  passthroughbtn: boolean = false;
  intellectualbtn: boolean = false;
  enablePeriod: boolean = false;
  periodTypes: any = [];
  steady: boolean = true;
  showTable: boolean = true;
  transition: boolean;
  edited: boolean = true;
  NotdealOwner: boolean = false;
  isLoading: boolean = false;
  dealCriteria: DealCriteriaModel;
  isrowAdded: boolean = false;
  dealMainJSON: DealCriteriaModel;
  rlsModuleParameters: any;
  dealOverview: any;
  moduleHeaders: any = [];
  rls: boolean = true;
  passthrough: boolean;
  intellectual: boolean;
  productPass: boolean = true;
  servicePass: boolean;
  costPass: boolean;
  displayFlag:string
  discount: boolean = false;
  topLevelButtons: any = [
    "topDeleteVisibility",
    "topCopyVisibility",
    "topEditVisibility",
    "topRefreshVisibility",
    "topPlusVisibility",
    "topMoreVisibility"
  ];
  more: boolean;
  RLSdropdownData: any = {};
  DealRSLdata: any = {};
  paginationPageNo = {
    PageSize: 1000,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: []
  };
  isLoadingRLS: boolean = false;
  Cowners: any = [];
  BillingRateList: any = [];
  billing: any = "";
  period: any = "";
  moreOptionslist: any = [
    { id: 1, name: "Pull Old RLS" },
    { id: 2, name: "Save Existing RLS" },
    { id: 3, name: "Pull Last Saved RLS" },
    { id: 4, name: "Delete" }
  ];
  moduleDetails: any;
  Oldbilling: any = "";
  Oldperiod: any = "";
  userInfo: any;
  modDetails: any;
  oldRLSid: any;
  isLoadingSaveRLS: boolean;
  MainModuleJson: any;
  isCalculate: boolean = true;
  savePeriodbilling: boolean = true;
  RLSdetails2temp2: any;
  RLSdetailstemp1: any;
  RLSdetails: any;
  showRevert: boolean;
  Steadybilling: any = "";
  Steadyperiod: any = "";
  Transitionbilling: any = "";
  Transitionperiod: any = "";
  TempRLStable: any = [];
  GCGCheck: boolean = true;
  tabVisibility: boolean = true;
  buttonDisable: boolean = false;
  subcriberRLS$: Subscription = new Subscription();
  subcriberPass$: Subscription = new Subscription();
  subcriber$: Subscription = new Subscription();
  modulesubscription$: Subscription = new Subscription();
  pastDeal$: Subscription = new Subscription();
  rlsBillingDisable = {isbillingYN : false}
  constructor(
    public dialog: MatDialog,
    private dealService: dealService,
    private router: Router,
    private encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    private dealjsonservice: DealJsonService,
    public _error: ErrorMessage,
    public onlineOfflineService: OnlineOfflineService,
    private _ApiServiceDeal5B: ApiServiceDeal5B,
    public _validate: ValidateforNullnUndefined,
    private message: MessageService
  ) {
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log(
        "Response from subject in deal-criteria component-->",
        message
      );
      if (message.originUrl == "/deals/rlsView") {
        this.tabVisibility = false;
        this.buttonDisable = true;
      } else {
        this.tabVisibility = true;
        this.buttonDisable = false;
      }
    });
  }

  async ngOnInit() {
    if (
      sessionStorage.getItem("Dealoverview") &&
      sessionStorage.getItem("userInfo")
    ) {
      this.dealOverview = JSON.parse(
        this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          sessionStorage.getItem("Dealoverview"),
          "DecryptionDecrip"
        )
      );
      console.log("Deal overview", this.dealOverview);
      let userInfo = this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("userInfo"),
        "DecryptionDecrip"
      );
      this.userInfo = JSON.parse(userInfo);
      this.modulesubscription$ = this.store
        .pipe(select(selectAllModules))
        .subscribe(
          async res => {
            if (res.ModuleList != undefined) {
              this.accRlS = [];
              console.log("Module headers", res.ModuleList[0]);
              this.moduleHeaders = res.ModuleList[0].Output;
              this.MainModuleJson = JSON.stringify(res.ModuleList[0].Output);
              this.modDetails = res.ModuleList[1].Output;
              this.Cowners = res.ModuleList[1].Output.ModuleList;
              this.RLSdetails = res.ModuleList[2];
              this.RLSdetailstemp1 = res.ModuleList[1];
              this.RLSdetails2temp2 = res.ModuleList[0];
              console.log("Module Details", res.ModuleList[1].Output);
              this.getMappedData(this.moduleHeaders);
              if (
                this.modDetails.BindHeaderDetail.Status !== "Open" &&
                this.modDetails.BindHeaderDetail.Status !== "Calculated"
              ) {
                this.buttonDisable = true;
              }
            } else {
              const CacheResponse = await this.dealService.getModuleListCacheData();
              if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                  this.isLoading = false;
                  console.log("Module headers", CacheResponse);
                  this.moduleHeaders = CacheResponse.data[0].Output;
                  this.modDetails = CacheResponse.data[1].Output;
                  this.Cowners = CacheResponse.data[1].Output.ModuleList;
                  this.getMappedData(this.moduleHeaders);
                  if (
                    this.modDetails.BindHeaderDetail.Status !== "Open" &&
                    this.modDetails.BindHeaderDetail.Status !== "Calculated"
                  ) {
                    this.buttonDisable = true;
                  }
                } else {
                  this.router.navigate(["/deals/existingTabs/overview"]);
                }
              } else {
                this.router.navigate(["/deals/existingTabs/overview"]);
              }
            }
          },
          error => {
            this.router.navigate(["/deals/existingTabs/overview"]);
          }
        );
      this.subcriber$ = this.store.pipe(select(DealParameter)).subscribe(
        async res => {
          console.log("Deal Parameters", res);
          if (res.dealparameterList != undefined) {
            this.dealCriteria = res.dealparameterList;
            this.dealMainJSON = res.dealparameterList;
          } else {
            if (this.onlineOfflineService.isOnline) {
              const CacheResponse = await this.dealService.getDealParamsCacheData();
              console.log("CacheResponse-->", CacheResponse);
              if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                  this.isLoading = false;
                  this.dealCriteria = CacheResponse.data;
                  this.dealMainJSON = CacheResponse.data;
                }
              } else {
                this.router.navigate(["/deals/existingTabs/overview"]);
              }
            }
          }
        },
        error => {
          if (this.onlineOfflineService.isOnline) {
            this.router.navigate(["/deals/existingTabs/overview"]);
          }
        }
      );
      if (!this.onlineOfflineService.isOnline) {
        const CacheResponse = await this.dealService.getDealParamsCacheData();
        console.log("CacheResponse-->", CacheResponse);
        if (CacheResponse) {
          if (CacheResponse.data) {
            this.isLoading = false;
            this.dealCriteria = CacheResponse.data;
            this.dealMainJSON = CacheResponse.data;
          }
        }
      }
    }
  }
  /* Save Deal parameter , Rate inflation and Std billing hr */
  SaveManageParams() {
    if (!this.edited) {
      this.isLoading = true;
      let inputParams: any = this.dealCriteria;
      inputParams.UserInfo = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId
      };
      console.log("Cheeeck", inputParams);
      if (inputParams.StandardBillingHours) {
        inputParams.StandardBillingHours.map(
          x => (x.EditStandardBillingHours = x.StandardBillingHours)
        );
      }
      if (inputParams.RateInflations) {
        inputParams.RateInflations.map(
          x => (x.EditRateInflation = x.RateInflation)
        );
      }
      // if (
      //   inputParams.ManageInfo.PaymentTerms == "" ||
      //   inputParams.ManageInfo.PaymentTerms == undefined ||
      //   inputParams.ManageInfo.PaymentTerms == null
      // ) {
      //   inputParams.ManageInfo.PaymentTerms = "0";
      // }
      if (
        inputParams.ManageInfo.VolumeDiscount == "" ||
        inputParams.ManageInfo.VolumeDiscount == undefined ||
        inputParams.ManageInfo.VolumeDiscount == null
      ) {
        inputParams.ManageInfo.VolumeDiscount = "0";
      }
      this.dealCriteria = null;
      // console.log("this.dealCriteria", this.dealCriteria)
      this.isLoading = true;
      if(inputParams.ManageInfo.PaymentTerms !=0  && inputParams.ManageInfo.PaymentTerms !=null){
        this.dealService.saveManageParameter(inputParams).subscribe(
          res => {
            if (res.ReturnFlag == "S") {
              console.log("Res", res);
              this.isLoading = false;
              this.displayFlag = ''
              this._error.throwError(res.Output.ReturnMessage);
              this.dealCriteria = res.Output;
              this.dealMainJSON = res.Output;
              console.log("Deal crit", this.dealCriteria);
              this.store.dispatch(
                new DealParameterListAction({ dealparameterList: res.Output })
              );
              this.store.dispatch(
                new calculateDeals({ calculateDeal: undefined })
              );
             
            } else {
              this.dealCriteria = this.dealMainJSON;
              this.isLoading = false;
              this._error.throwError(res.ReturnMessage);
            }
          },
          error => {
            this.dealCriteria = this.dealMainJSON;
            this.isLoading = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }else{
        this.isLoading = false;
        this.dealCriteria = this.dealMainJSON;
        (inputParams.ManageInfo.PaymentTerms == 0 || 
          inputParams.ManageInfo.PaymentTerms == '0')? this.displayFlag = 'zerodisplay' :
        (inputParams.ManageInfo.PaymentTerms == null || 
         inputParams.ManageInfo.PaymentTerms == undefined || 
         inputParams.ManageInfo.PaymentTerms == "") ? this.displayFlag = 'nulldisplay' : ''
      } 
    }
  }
  /*save module parameter*/
  savemoduleparams(moduleDetails, ind) {
    this.isLoadingRLS = true;
    this.IsDataRLScorrect(moduleDetails, ind, "SAVEMODULEPARAMS").subscribe(
      Response => {
        if (Response.ReturnFlag == "S") {
          let modulePramasInput = {
            User: {
              EmployeeNumber: this.userInfo.EmployeeNumber,
              EmployeeName: this.userInfo.EmployeeName,
              EmployeeId: this.userInfo.EmployeeId,
              EmployeeMail: this.userInfo.EmployeeMail,
              ClientIP: ""
            },
            MasterData: this.moduleHeaders[ind].MasterData,
            DealHeader: this.moduleHeaders[ind].DealHeader,
            ModuleHeader: this.moduleHeaders[ind].ModuleHeader,
            RLSList: this.moduleHeaders[ind].RLSList,
            ModuleParameters: moduleDetails.ModuleParameters,
            SalaryInflation: this.moduleHeaders[ind].SalaryInflation,
            RateInflations: moduleDetails.RateInflations,
            StandardBillingHours: this.moduleHeaders[ind].StandardBillingHours,
            DealParameters: this.moduleHeaders[ind].DealParameters,
            GMBillingRate: moduleDetails.GMBillingRate,
            Validations: this.moduleHeaders[ind].Validations,
            AuditLogData: {
              AuditLog: []
            }
          };
          this.dealService.SaveModuleParams(modulePramasInput).subscribe(
            Res => {
              if (Res.Output.ReturnFlag == "S") {
                this.isLoadingRLS = false;
                this._error.throwError(Res.Output.ReturnMessage);
              } else {
                this.discount = true;
                this.isLoadingRLS = false;
                this._error.throwError(Res.Output.ReturnMessage);
              }
            },
            error => {
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
        } else {
          this.isLoadingRLS = false;
          this._error.throwError(Response.ReturnMessage);
        }
      },
      error => {
        this.isLoadingRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  /*Changing dealCriteria ManageInfo details*/
  dealParamsChanged(Id: number) {
    console.log("Param Id", Id);
    switch (Id) {
      case 1:
        if (this.dealCriteria.ManageInfo.AssetTakeOverYN == "Y") {
          this.dealCriteria.ManageInfo.AssetTakeOverYN = "N";
          this.dealCriteria.ManageInfo.AssetTakeOverValue = "0.00";
        } else {
          this.dealCriteria.ManageInfo.AssetTakeOverYN = "Y";
        }
        break;
      case 2:
        if (this.dealCriteria.ManageInfo.PeopleTakeOverYN == "Y") {
          this.dealCriteria.ManageInfo.PeopleTakeOverYN = "N";
          this.dealCriteria.ManageInfo.PeopleTakeOverValue = "0.00";
        } else {
          this.dealCriteria.ManageInfo.PeopleTakeOverYN = "Y";
        }
        break;
      case 3:
        if (this.dealCriteria.ManageInfo.MsaDiscountYN == "Y") {
          this.dealCriteria.ManageInfo.MsaDiscountYN = "N";
          this.dealCriteria.ManageInfo.MsaDiscount = "0.00";
        } else {
          this.dealCriteria.ManageInfo.MsaDiscountYN = "Y";
        }
        break;
      case 4:
        if (this.dealCriteria.ManageInfo.MsaPaymentTermsYN == "Y") {
          this.dealCriteria.ManageInfo.MsaPaymentTermsYN = "N";
        } else {
          this.dealCriteria.ManageInfo.MsaPaymentTermsYN = "Y";
        }
        break;
      case 5:
        if (this.dealCriteria.ManageInfo.NicheSkillDiscountYN == "Y") {
          this.dealCriteria.ManageInfo.NicheSkillDiscountYN = "N";
          this.dealCriteria.ManageInfo.NicheSkillDiscount = "0.00";
        } else {
          this.dealCriteria.ManageInfo.NicheSkillDiscountYN = "Y";
        }
        break;
      case 6:
        if (this.dealCriteria.ManageInfo.UnBilledRevenueYN == "Y") {
          this.dealCriteria.ManageInfo.UnBilledRevenueYN = "N";
        } else {
          this.dealCriteria.ManageInfo.UnBilledRevenueYN = "Y";
        }
        break;
      case 7:
        if (this.dealCriteria.ManageInfo.BayAreaRateDiscYN == "Y") {
          this.dealCriteria.ManageInfo.BayAreaRateDiscYN = "N";
          this.dealCriteria.ManageInfo.BayAreaRateDiscVal = "0.00";
        } else {
          this.dealCriteria.ManageInfo.BayAreaRateDiscYN = "Y";
        }
        break;
      case 8:
        if (this.dealCriteria.ManageInfo.BayAreaOMDiscYN == "Y") {
          this.dealCriteria.ManageInfo.BayAreaOMDiscYN = "N";
          this.dealCriteria.ManageInfo.BayAreaOMDiscVal = "0.00";
        } else {
          this.dealCriteria.ManageInfo.BayAreaOMDiscYN = "Y";
        }
        break;
      default:
        break;
    }
    // console.log("Checking", this.dealCriteria.ManageInfo);
  }
  /* Generic mmethod where we get,add,delete ,update and More actions for RLS,Passthrough and IP */
  GetModuleDetails(Moduledetails, index, status, isInit) {
    console.log("Module--->", Moduledetails);
    console.log("Deal---->", this.dealOverview);
    console.log("IsSteady", this.accRlS[index].isSteady);
    Moduledetails.GMBillingRate.GMBasedBillRateCalc == 'Y' ? this.rlsBillingDisable.isbillingYN = true : this.rlsBillingDisable.isbillingYN = false
    if (Moduledetails.Opened == false) {
      this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
      this.showTable = false;
      this.isrowAdded = false;
      this.DealRSLdata = {};
      this.moduleIndex = index;
      this.moduleDetails = Moduledetails;
      let user = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      };
      /*Preparing API Inputs for all  actions related to Module,RLS,Passthrough and IP */
      let postRLSInput = this.dealjsonservice.dealRLSInput;
      let postRLSdropdownInput = this.dealjsonservice.dealRLSDropdownInput;
      postRLSInput.UserInfo = postRLSdropdownInput.UserInfo = user;
      postRLSInput.MasterDataRLS.DealHeaderNumber = postRLSInput.MasterDataRLS.dealno = postRLSdropdownInput.MasterDataRLS.dealno = postRLSdropdownInput.MasterDataRLS.DealHeaderNumber = this.dealMainJSON.MasterData.DealHeaderNumber;
      postRLSInput.MasterDataRLS.traceoppid = postRLSdropdownInput.MasterDataRLS.traceoppid = this.dealOverview.oppID;
      postRLSInput.MasterDataRLS.PricingId = postRLSdropdownInput.MasterDataRLS.PricingId = this.dealMainJSON.MasterData.PricingId;
      postRLSInput.MasterDataRLS.dealid = postRLSdropdownInput.MasterDataRLS.dealid = this.dealOverview.id;
      postRLSInput.MasterDataRLS.moduleid = postRLSdropdownInput.MasterDataRLS.moduleid =
        Moduledetails.ModuleHeader.ModuleID;
      postRLSInput.MasterDataRLS.moduleno = postRLSdropdownInput.MasterDataRLS.moduleno =
        Moduledetails.ModuleHeader.ModuleNumber;
      postRLSInput.MasterDataRLS.moduleversion = postRLSdropdownInput.MasterDataRLS.moduleversion =
        Moduledetails.ModuleHeader.ModuleVersion;
      postRLSInput.MasterDataRLS.rlsid = postRLSdropdownInput.MasterDataRLS.rlsid = this
        .accRlS[index].isSteady
        ? this.getRLSID(Moduledetails.RLSList, "Steady State")
        : this.getRLSID(Moduledetails.RLSList, "Transition");
      postRLSInput.MasterDataRLS.rlsno = postRLSdropdownInput.MasterDataRLS.rlsno = this
        .accRlS[index].isSteady
        ? Moduledetails.RLSList[0].RLSNumber
        : Moduledetails.RLSList[1].RLSNumber;
      postRLSInput.MasterDataRLS.rlsversion = postRLSdropdownInput.MasterDataRLS.rlsversion = this
        .accRlS[index].isSteady
        ? Moduledetails.RLSList[0].RLSVersion
        : Moduledetails.RLSList[1].RLSVersion;
      postRLSInput.MasterDataRLS.optionid = postRLSdropdownInput.MasterDataRLS.optionid = this.dealMainJSON.MasterData.OptionId;
      postRLSInput.MasterDataRLS.dealversion = postRLSdropdownInput.MasterDataRLS.dealversion = this.dealMainJSON.MasterData.DealVersionId;
      postRLSInput.MasterDataRLS.optionversion = postRLSdropdownInput.MasterDataRLS.optionversion = this.dealMainJSON.MasterData.OptionVersionId;
      postRLSInput.MasterDataRLS.optionno = postRLSdropdownInput.MasterDataRLS.optionno = this.dealMainJSON.MasterData.OptionNumber;
      postRLSInput.MasterDataRLS.currecyCode = postRLSdropdownInput.MasterDataRLS.currecyCode = this.dealMainJSON.BindHeaderDetail.Currency;
      postRLSInput.MasterDataRLS.RLSType = postRLSdropdownInput.MasterDataRLS.RLSType =
        this.accRlS[index].isSteady == true ? "S" : "T";
      postRLSInput.MasterDataRLS.passthroughtype = this.costPass
        ? "O"
        : this.servicePass
        ? "S"
        : "P";
      if (status == "RLS") {
        if(this.isPass==false)
        {
        this.accRlS[index].RLSeHeader = [];
        this.accRlS[index].rlsTable = [];
        this.accRlS[index].tableTotalCount = 0;
        this.accRlS[index].expanded = true;
        this.accRlS[index].submitted = true;
        this.billing = "";
        this.Oldbilling = "";
        this.period = "";
        this.Oldperiod = "";
        this.getRLS(postRLSdropdownInput, postRLSInput, index, isInit);
        }
      } else if (status == "PASS") {
        this.accRlS[index].RLSeHeader = [];
        this.accRlS[index].rlsTable = [];
        this.accRlS[index].tableTotalCount = 0;
        this.accRlS[index].expanded = true;
        this.accRlS[index].submitted = true;
        this.getPassthrough(postRLSdropdownInput, postRLSInput, index);
      } else if (status == "INTEL") {
        this.accRlS[index].RLSeHeader = [];
        this.accRlS[index].rlsTable = [];
        this.accRlS[index].tableTotalCount = 0;
        this.accRlS[index].expanded = true;
        this.accRlS[index].submitted = true;
        this.getIntelList(postRLSdropdownInput, postRLSInput, index);
      } else if (status == "CP") {
        Moduledetails.Opened = false;
        this.isLoadingRLS = true;
        let user = {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeNumber
        };
        let cpInput = this.dealjsonservice.changePeriodInput;
        cpInput.ChangePeriod.UserInfo = user;
        cpInput.ChangePeriod.MasterData = postRLSInput.MasterDataRLS;
        cpInput.ChangePeriod.Billingratetype = this.billing;
        cpInput.ChangePeriod.PeriodType = this.period;
        cpInput.AuditLogList.AuditLog[0].NewValue = this.period;
        cpInput.AuditLogList.AuditLog[1].NewValue = this.billing;
        this.dealService.ChangePeriod(cpInput).subscribe(
          res => {
            if (res) {
              let Output = res.Output;
              if (res.ReturnFlag == "S") {
                this._error.throwError(Output.Message);
                this.isLoadingRLS = false;
                /*Below code is to update RLS ID in Stroe which we get from above api response*/
                let storeData1: any = this.RLSdetails2temp2;
                let storeData2: any = this.RLSdetailstemp1;
                let storeData3: any = this.RLSdetails;
                this.accRlS[index].isSteady
                  ? (storeData1.Output[index].RLSList[0].RLSId = Output.RLSID)
                  : (storeData1.Output[index].RLSList[1].RLSId = Output.RLSID);
                let resArray = [storeData1, storeData2, storeData3];
                if (this.accRlS[index].isSteady) {
                  Moduledetails.RLSList[0].RLSId = Output.RLSID;
                } else {
                  Moduledetails.RLSList[1].RLSId = Output.RLSID;
                }
                this.store.dispatch(
                  new ModuleListAction({ ModuleList: resArray })
                );
                postRLSInput.MasterDataRLS.rlsid = postRLSdropdownInput.MasterDataRLS.rlsid =
                  Output.RLSID;
              } else {
                this.isLoadingRLS = false;
                this.billing = this.Oldbilling;
                this.period = this.Oldperiod;
                this._error.throwError(
                  "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                );
              }
            }
          },
          error => {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      } else if (status == "PULLoldRLS") {
        let PullRLSinput = {
          UserInfo: user,
          MasterData: postRLSInput.MasterDataRLS,
          PullOldRls: {
            OldRlsId: this.oldRLSid
          }
        };
        this.isLoadingRLS = true;
        this.dealService.PullRLS(PullRLSinput).subscribe(
          Res => {
            if (Res) {
              if (Res.Output.SuccessFlag == "S") {
                console.log(Res.Output.ReturnMsg);
                this.dealService.UpdateExistingDealsStore();
                this.dealService.updateModuleListStore();
                this._error.throwError(Res.Output.Message);
              } else {
                this.isLoadingRLS = false;
                this.accRlS[index].RLSeHeader = this.accRlS[index].RLSeHeader;
                this.accRlS[index].rlsTable = this.accRlS[index].rlsTable;
                this.accRlS[index].tableTotalCount = this.accRlS[
                  index
                ].rlsTable.length;
                this.accRlS[index].expanded = true;
                this.accRlS[index].submitted = true;
                this.showTable = true;
                this._error.throwError(Res.Output.Message);
              }
              console.log("res", Res);
            }
          },
          error => {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      } else if (status == "SaveExistingRLS") {
        this.showTable = true;
        this.isLoadingSaveRLS = true;
        let saveRLSinput = {
          UserInfo: user,
          MasterDataRLS: postRLSInput.MasterDataRLS,
          RLSObject: {}
        };
        this.dealService.SaveExistingRLS(saveRLSinput).subscribe(
          Response => {
            if (Response.Output) {
              this.isLoadingSaveRLS = false;
              this._error.throwError(Response.Output.Message);
            } else {
              this.isLoadingSaveRLS = false;
              this._error.throwError(Response.ReturnMessage);
            }
          },
          error => {
            this.isLoadingSaveRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      } else if (status == "RevokeRLS") {
        this.showTable = true;
        this.isLoadingRLS = true;
        let revokeRLSinput = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            Adid: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeId,
            EmpNo: this.userInfo.EmployeeNumber
          },
          MasterDataRLS: postRLSInput.MasterDataRLS,
          RLSObject: {}
        };
        this.dealService.RevokeRLS(revokeRLSinput).subscribe(
          Res => {
            if (Res) {
              if (Res.ReturnFlag == "S") {
                console.log(Res.Output.ReturnMsg);
                this.dealService.UpdateExistingDealsStore();
                this.dealService.updateModuleListStore();
                this._error.throwError(Res.Output.Message);
              } else {
                this.isLoadingRLS = false;
                this.accRlS[index].RLSeHeader = this.accRlS[index].RLSeHeader;
                this.accRlS[index].rlsTable = this.accRlS[index].rlsTable;
                this.accRlS[index].tableTotalCount = this.accRlS[
                  index
                ].rlsTable.length;
                this.accRlS[index].expanded = true;
                this.accRlS[index].submitted = true;
                this.showTable = true;
                this._error.throwError(Res.Output.Message);
              }
              console.log("res", Res);
            }
          },
          error => {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      } else if (status == "DeleteRLS") {
        this.showTable = true;
        this.DeleteRLS(postRLSInput, index, Moduledetails);
      } else if (status == "RevertRLS") {
        this.isLoadingRLS = true;
        let revertInput = {
          User: {
            EmployeeNumber: this.userInfo.EmployeeNumber,
            EmployeeName: this.userInfo.EmployeeName,
            EmployeeId: this.userInfo.EmployeeId,
            EmployeeMail: this.userInfo.EmployeeMail,
            ClientIP: ""
          },
          MasterData: {
            PricingId: this.dealMainJSON.MasterData.PricingId,
            DealId: this.dealOverview.id,
            DealHeaderNumber: this.dealOverview.dealHeadernumber,
            DealVersionId: this.dealMainJSON.MasterData.DealVersionId,
            OptionId: this.dealMainJSON.MasterData.OptionId,
            OptionNumber: this.dealMainJSON.MasterData.OptionNumber,
            OptionVersionId: this.dealMainJSON.MasterData.OptionVersionId,
            ModuleId: Moduledetails.ModuleHeader.ModuleID,
            ModuleVersionId: Moduledetails.ModuleHeader.ModuleVersion,
            ModuleNumber: Moduledetails.ModuleHeader.ModuleNumber,
            RLSId: this.accRlS[index].isSteady
              ? this.getRLSID(Moduledetails.RLSList, "Steady State")
              : this.getRLSID(Moduledetails.RLSList, "Transition"),
            RLSStatusCode: this.accRlS[index].isSteady
              ? Moduledetails.RLSList[0].RLSStatusCode
              : Moduledetails.RLSList[1].RLSStatusCode,
            SourcePage: ""
          }
        };
        this.dealService.Revertrls(revertInput).subscribe(
          Res => {
            if (Res.ReturnFlag == "S") {
              this.isLoadingRLS = false;
              this._error.throwError(Res.Output.ReturnMessage);
              if (Res.Output.ReturnFlag == "S") {
                this.dealService.UpdateExistingDealsStore();
                this.dealService.updateModuleListStore();
              }
            } else {
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          },
          error => {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    } else {
      this.accRlS[index].RLSeHeader = this.accRlS[index].RLSeHeader;
      this.accRlS[index].rlsTable = this.accRlS[index].rlsTable;
      this.accRlS[index].tableTotalCount = this.accRlS[index].rlsTable.length;
      this.accRlS[index].expanded = true;
      this.accRlS[index].submitted = true;
      this.showTable = true;
      if (this.accRlS[index].ControlRoles) {
        this.ControlRoles(this.accRlS[index].ControlRoles);
      }
    }
  }
  /* get RLS of particular module*/
  // getDealRLSLength:number = 0
  getRLS(postRLSdropdownInput, postRLSInput, index, isInit: boolean) {
    this.isLoadingRLS = true;
    this.dealService
      .getDealRLSdropdownNrlsview(postRLSdropdownInput, postRLSInput)
      .subscribe(
        res => {
          if (res) {
            console.log(res, "Deal rls display res");
            this.isLoadingRLS = false;
            if (res[0].ReturnFlag == "S" && res[1].ReturnFlag == "S") {
              let response = res[1].ModulesRLSData;
              this.DealRSLdata = res[1].ModulesRLSData;
              this.RLSdropdownData = res[0].Output;
              let store = {
                RLSdata: this.DealRSLdata,
                RLSdropdown: this.RLSdropdownData
              };
              console.log("RLS dropdown", this.RLSdropdownData);
              console.log("Deal RLS data", this.DealRSLdata);
              if (this.RLSdropdownData.dropDownData.PeriodType) {
                this.periodTypes = this.RLSdropdownData.dropDownData.PeriodType;
              }
              if (this.RLSdropdownData.dropDownData.BillingRateType) {
                this.BillingRateList = this.RLSdropdownData.dropDownData.BillingRateType;
              }
              if (this.DealRSLdata.SteadyRLSItems) {
                if (
                  this.DealRSLdata.SteadyRLSItems.DisplayHeader.rlsstatusCode ==
                  "RC"
                ) {
                  // this.showRevert = true;
                  this.showRevert = false;
                } else {
                  this.showRevert = false;
                }
              }
              if (this.DealRSLdata.SteadyRLSItems) {
                this.Steadybilling = this.DealRSLdata.SteadyRLSItems.BillingRateSelected;
                this.Steadyperiod = this.DealRSLdata.SteadyRLSItems.PeriodSelected;
                // this.getDealRLSLength = this.DealRSLdata.SteadyRLSItems['prePopulated'].length;
                // console.log(this.getDealRLSLength,"this.getDealRLSLength")
              }
              if (this.DealRSLdata.TransitionRLSItems) {
                this.Transitionbilling = this.DealRSLdata.TransitionRLSItems.BillingRateSelected;
                this.Transitionperiod = this.DealRSLdata.TransitionRLSItems.PeriodSelected;
              }
              if (
                this.DealRSLdata.SteadyRLSItems &&
                this.accRlS[index].isSteady &&
                isInit
              ) {
                this.ControlRoles(
                  this.DealRSLdata.SteadyRLSItems.ControlAccess
                );
                this.accRlS[
                  index
                ].ControlRoles = this.DealRSLdata.SteadyRLSItems.ControlAccess;
                this.billing = this.DealRSLdata.SteadyRLSItems.BillingRateSelected;
                this.Oldbilling = this.DealRSLdata.SteadyRLSItems.BillingRateSelected;
                this.period = this.DealRSLdata.SteadyRLSItems.PeriodSelected;
                this.Oldperiod = this.DealRSLdata.SteadyRLSItems.PeriodSelected;
                if (response.SteadyRLSItems.prePopulated.length > 0) {
                  this.accRlS[index].showAddbutton = false;
                  this.customizeRLSheaders(
                    this.DealRSLdata.SteadyRLSItems,
                    index
                  );
                } else {
                  this.accRlS[index].showAddbutton = true;
                  if (
                    this._validate.validate(this.billing) &&
                    this._validate.validate(this.period)
                  ) {
                    this.accRlS[index].Isbilled = true;
                  } else {
                    this.accRlS[index].Isbilled = false;
                  }
                }
              } else if (
                this.DealRSLdata.SteadyRLSItems &&
                this.accRlS[index].isSteady
              ) {
                this.billing = this.DealRSLdata.SteadyRLSItems.BillingRateSelected;
                this.Oldbilling = this.DealRSLdata.SteadyRLSItems.BillingRateSelected;
                this.period = this.DealRSLdata.SteadyRLSItems.PeriodSelected;
                this.Oldperiod = this.DealRSLdata.SteadyRLSItems.PeriodSelected;
                if (response.SteadyRLSItems.prePopulated.length > 0) {
                  this.accRlS[index].showAddbutton = false;
                  this.ControlRoles(
                    this.DealRSLdata.SteadyRLSItems.ControlAccess
                  );
                  this.accRlS[
                    index
                  ].ControlRoles = this.DealRSLdata.SteadyRLSItems.ControlAccess;
                  this.customizeRLSheaders(
                    this.DealRSLdata.SteadyRLSItems,
                    index
                  );
                } else {
                  this.accRlS[index].showAddbutton = true;
                  if (
                    this._validate.validate(this.billing) &&
                    this._validate.validate(this.period)
                  ) {
                    this.accRlS[index].Isbilled = true;
                  } else {
                    this.accRlS[index].Isbilled = false;
                  }
                }
              } else if (this.DealRSLdata.TransitionRLSItems && !isInit) {
                this.billing = this.DealRSLdata.TransitionRLSItems.BillingRateSelected;
                this.Oldbilling = this.DealRSLdata.TransitionRLSItems.BillingRateSelected;
                this.period = this.DealRSLdata.TransitionRLSItems.PeriodSelected;
                this.Oldperiod = this.DealRSLdata.TransitionRLSItems.PeriodSelected;
                if (
                  this.DealRSLdata.TransitionRLSItems.prePopulated.length > 0
                ) {
                  this.accRlS[index].showAddbutton = false;
                  this.accRlS[index].isSteady = false;
                  this.ControlRoles(
                    this.DealRSLdata.TransitionRLSItems.ControlAccess
                  );
                  this.accRlS[
                    index
                  ].ControlRoles = this.DealRSLdata.TransitionRLSItems.ControlAccess;
                  this.customizeRLSheaders(
                    this.DealRSLdata.TransitionRLSItems,
                    index
                  );
                } else {
                  this.accRlS[index].showAddbutton = true;
                  if (
                    this._validate.validate(this.billing) &&
                    this._validate.validate(this.period)
                  ) {
                    this.accRlS[index].Isbilled = true;
                  } else {
                    this.accRlS[index].Isbilled = false;
                  }
                }
              } else {
                this.accRlS[index].showAddbutton = true;
                if (
                  this._validate.validate(this.billing) &&
                  this._validate.validate(this.period)
                ) {
                  this.accRlS[index].Isbilled = true;
                } else {
                  this.accRlS[index].Isbilled = false;
                }
              }
            } else {
              this.accRlS[index].showAddbutton = true;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          }
        },
        error => {
          this.isLoadingRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
  }
  getPassthrough(postRLSdropdownInput, postRLSInput, index) {
    this.isLoadingRLS = true;
    this.dealService.PassthroughList(postRLSInput).subscribe(
      res => {
        if (res) {
          this.isLoadingRLS = false;
          this.rlsbtn=false;
          this.passthroughbtn=true;
          if (res.ReturnFlag == "S") {
            this.DealRSLdata = res.Output;
            this.ControlRoles(this.DealRSLdata.ControlAccess);
            this.accRlS[index].ControlRoles = this.DealRSLdata.ControlAccess;
            console.log(
              "Pass through data",
              this.DealRSLdata,
              this.accRlS[index]
            );
            if (res.Output.prePopulated.length > 0) {
              this.accRlS[index].showAddbutton = false;
              this.customizeRLSheaders(this.DealRSLdata, index);
            } else {
              this.accRlS[index].showAddbutton = true;
              if (
                this._validate.validate(this.billing) &&
                this._validate.validate(this.period)
              ) {
                this.accRlS[index].Isbilled = true;
              } else {
                this.accRlS[index].Isbilled = false;
              }
            }
          } else {
            this.accRlS[index].showAddbutton = true;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        }
      },
      error => {
        this.isLoadingRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  getIntelList(postRLSdropdownInput, postRLSInput, index) {
    this.isLoadingRLS = true;
    this.showTable = true;
    this.configData = [];
    this.dealService.IPlist(postRLSInput).subscribe(
      Res => {
        if (Res) {
          this.isLoadingRLS = false;
          if (Res.ReturnFlag == "S") {
            console.log("Result", Res);
            console.log("ControlRoles", this.accRlS);
            this.DealRSLdata = Res.Output;
            console.log(this.modDetails.BindHeaderDetail.Status);
            if (
              this.modDetails.BindHeaderDetail.Status == "Approved" ||
              this.modDetails.BindHeaderDetail.Status ==
                "Submitted for Approval"
            ) {
              this.topLevelButtons = [];
            } else {
              this.ControlRoles(this.DealRSLdata.ControlAccess);
            }
            this.accRlS[index].ControlRoles = this.DealRSLdata.ControlAccess;
            if (Res.Output.IPLineItemDataList.IPLineItemData.length > 0) {
              this.accRlS[index].showAddbutton = false;
              this.accRlS[index].RLSeHeader = IntellectualHeader;
              this.configData.IPType = this.getIPTYPEDrop(
                Res.Output.IPMaster.IPTypeData
              );
              this.configData.ProductCode = this.getIPproduct(
                Res.Output.IPMaster.IProductData
              );
              this.configData.ModuleCode = this.getIPmodule(
                Res.Output.IPMaster.IPModuleData
              );
              this.accRlS[index].rlsTable = this.getmappedIP(
                Res.Output.IPLineItemDataList.IPLineItemData
              );
              console.log("Table", this.accRlS[index].rlsTable);
              this.accRlS[index].tableTotalCount = this.accRlS[
                index
              ].rlsTable.length;
            } else {
              this.accRlS[index].showAddbutton = true;
              if (
                this._validate.validate(this.billing) &&
                this._validate.validate(this.period)
              ) {
                this.accRlS[index].Isbilled = true;
              } else {
                this.accRlS[index].Isbilled = false;
              }
            }
          } else {
            this.accRlS[index].showAddbutton = true;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        }
      },
      error => {
        this.accRlS[index].showAddbutton = true;
        this.isLoadingRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  ControlRoles(ControlAccess: any) {
    this.configData.moreData = [];
    this.topLevelButtons = [
      "topDeleteVisibility",
      "topCopyVisibility",
      "topEditVisibility",
      "topRefreshVisibility",
      "topPlusVisibility",
      "topMoreVisibility"
    ];
    let actions = [
      "topDeleteVisibility",
      "topCopyVisibility",
      "topEditVisibility",
      "topRefreshVisibility",
      "topPlusVisibility",
      "topMoreVisibility"
    ];
    let IPactions = [
      "topDeleteVisibility",
      "topEditVisibility",
      "topPlusVisibility",
      "topMoreVisibility"
    ];
    if (this.rlsbtn) {
      if (ControlAccess.SaveRLS == "N") {
        if (this.showRevert) {
          this.topLevelButtons.splice(0, 5);
          this.configData.moreData.push({ id: 5, name: "Revert" });
        } else {
          this.topLevelButtons = [];
        }
      } else {
        this.configData.moreData = this.moreOptionslist;
        this.topLevelButtons = actions;
      }
    } else if (this.passthroughbtn) {
      if (ControlAccess.SavePassthru == "N") {
        this.savePeriodbilling = false;
        if (this.showRevert) {
          this.topLevelButtons.splice(0, 5);
          this.configData.moreData.push({ id: 5, name: "Revert" });
        } else {
          this.topLevelButtons = [];
        }
        this.accRlS[this.moduleIndex].showAddbutton = false;
      } else {
        this.configData.moreData = this.moreOptionslist;
        this.savePeriodbilling = true;
        this.topLevelButtons = actions;
        this.accRlS[this.moduleIndex].showAddbutton = true;
      }
    } else {
      if (ControlAccess.SaveIP == "N") {
        this.savePeriodbilling = false;
        if (this.showRevert) {
          this.topLevelButtons.splice(0, 5);
          this.configData.moreData.push({ id: 5, name: "Revert" });
        } else {
          this.topLevelButtons = [];
        }
        this.accRlS[this.moduleIndex].showAddbutton = false;
      } else {
        this.configData.moreData = this.moreOptionslist;
        this.savePeriodbilling = true;
        this.topLevelButtons = IPactions;
        this.accRlS[this.moduleIndex].showAddbutton = true;
      }
    }
    if (ControlAccess.EditPrd_BillType == "N") {
      this.savePeriodbilling = false;
    } else {
      this.savePeriodbilling = true;
    }
    if (ControlAccess.Calculate == "N") {
      this.isCalculate = false;
    } else {
      this.isCalculate = true;
    }
  }
  DeleteRLS(RLSinput, ind, Moduledetails) {
    this.isLoadingRLS = true;
    this.IsDataRLScorrect(
      this.moduleDetails,
      this.moduleIndex,
      "DELETERLS"
    ).subscribe(
      Response => {
        if (Response.ReturnFlag == "S") {
          let Input = {
            User: {
              EmployeeNumber: this.userInfo.EmployeeNumber,
              EmployeeName: this.userInfo.EmployeeName,
              EmployeeId: this.userInfo.EmployeeId,
              EmployeeMail: this.userInfo.EmployeeMail,
              ClientIP: ""
            },
            MasterData: {
              PricingId: this.dealMainJSON.MasterData.PricingId,
              TraceOppId: this.dealOverview.oppID,
              DealId: this.dealOverview.id,
              DealWonLoss: "",
              DealHeaderNumber: this.dealOverview.dealHeadernumber,
              DealVersionId: this.dealMainJSON.MasterData.DealVersionId,
              DealHeaderName: this.dealMainJSON.MasterData.DealHeaderName,
              DealValue: null,
              DOEmailId: this.dealMainJSON.MasterData.DOEmailId,
              ModuleCount: this.dealMainJSON.MasterData.ModuleCount,
              ModuleOwnerEmailId: null,
              ModuleBFMEmailId: null,
              ModulePSPOCEmailId: null,
              ModuleId: Moduledetails.ModuleHeader.ModuleID,
              ModuleNumber: Moduledetails.ModuleHeader.ModuleNumber,
              ModuleVersionId: Moduledetails.ModuleHeader.ModuleVersion,
              ModuleName: Moduledetails.ModuleHeader.ModuleName,
              ModuleStatusCode: Moduledetails.ModuleHeader.ModuleStatus,
              ServiceLines: null,
              OptionId: this.dealMainJSON.MasterData.OptionId,
              OptionNumber: this.dealMainJSON.MasterData.OptionNumber,
              OptionName: null,
              OptionVersionId: this.dealMainJSON.MasterData.OptionVersionId,
              OptionStatusCode: "OO",
              DealStatus: "OO",
              RLSId: null,
              RLSVersionId: null,
              SourcePage: "",
              MachineIp: null,
              GroupCode: null,
              RoleId: null,
              CurrencyCode: this.dealMainJSON.BindHeaderDetail.Currency,
              MsaRequired: "0.0000000000000",
              AmendmentNo: null,
              BFM_PSPOC_Vertical: null,
              ModuleTeamEmailID: null,
              AddModuleVisible: null,
              AddModuleMessage: null,
              FileName: null,
              FilePath: null,
              lnkbtnDownload: null,
              RLSStatusCode: null,
              CFOApproval: null,
              TreasuryApproval: null,
              CustomerTemplateFileName: null,
              BillingRateType: null,
              ContingencyPerc: null,
              IsLatamDeal: null,
              RookieAndBulgeData: null
            },
            ModuleHeader: Moduledetails.ModuleHeader,
            RLS: {
              RLSId: this.accRlS[ind].isSteady
                ? this.getRLSID(Moduledetails.RLSList, "Steady State")
                : this.getRLSID(Moduledetails.RLSList, "Transition"),
              RLSNumber: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].RLSNumber
                : Moduledetails.RLSList[1].RLSNumber,
              RLSName: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].RLSName
                : Moduledetails.RLSList[1].RLSName,
              RLSStatus: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].RLSStatus
                : Moduledetails.RLSList[1].RLSStatus,
              RLSVersion: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].RLSVersion
                : Moduledetails.RLSList[1].RLSVersion,
              PassThroughType: null,
              RLSStatusCode: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].RLSStatusCode
                : Moduledetails.RLSList[1].RLSStatusCode,
              RLSType: this.accRlS[ind].isSteady ? "S" : "T",
              lnkRLSUploadEnabled: null,
              lnkBFMEditEnabled: null,
              btnRevertEnabled: null,
              imgbtnDeleteRLSEnabled: null,
              isRLSUploadEnabled: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].isRLSUploadEnabled
                : Moduledetails.RLSList[1].isRLSUploadEnabled,
              isBFMEditEnabled: null,
              isRevertEnabled: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].isRevertEnabled
                : Moduledetails.RLSList[1].isRevertEnabled,
              isDeleteRLSEnabled: this.accRlS[ind].isSteady
                ? Moduledetails.RLSList[0].isDeleteRLSEnabled
                : Moduledetails.RLSList[1].isDeleteRLSEnabled
            }
          };
          this.dealService.DeleteRLS(Input).subscribe(
            Response => {
              if (Response.ReturnFlag == "S") {
                if (Response.Output.ReturnFlag == "S") {
                  this.isLoadingRLS = false;
                  this._error.throwError(Response.Output.ReturnMessage);
                  this.dealService.updateModuleListStore();
                } else {
                  this.isLoadingRLS = false;
                  this._error.throwError(Response.Output.ReturnMessage);
                }
              } else {
                this.isLoadingRLS = false;
                this._error.throwError(
                  "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                );
              }
            },
            error => {
              this.accRlS[ind].showAddbutton = true;
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
        } else {
          this.isLoadingRLS = false;
          this._error.throwError(Response.ReturnMessage);
        }
      },
      error => {
        this.accRlS[ind].showAddbutton = true;
        this.isLoadingRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  GmCalculate(moduleDetails, ind) {
    console.log("Gmvalue", moduleDetails.GMBillingRate.GMBasedBillRateCalc);
    console.log("Table data", this.accRlS[ind]);
    console.log(moduleDetails,"moduleDetails")
    moduleDetails.GMBillingRate.GMBasedBillRateCalc == 'Y' ? this.rlsBillingDisable.isbillingYN = true : this.rlsBillingDisable.isbillingYN = false
    this.isLoadingRLS = true;
    let CalculateGMInput = {
      User: {
        EmployeeNumber: this.userInfo.EmployeeNumber,
        EmployeeName: this.userInfo.EmployeeName,
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeMail: this.userInfo.EmployeeMail,
        ClientIP: ""
      },
      MasterData: moduleDetails.MasterData,
      GMBillingRate: moduleDetails.GMBillingRate
    };
    this.IsDataRLScorrect(moduleDetails, ind, "CALCBILLINGRATE").subscribe(
      Response => {
        if (Response.ReturnFlag == "S") {
          this.dealService.CalculateGM(CalculateGMInput).subscribe(
            Res => {
              if (Res.Output.ReturnFlag == "S") {
                this.isLoadingRLS = false;
                this._error.throwError(Res.Output.ReturnMessage);
              } else {
                this.isLoadingRLS = false;
                this._error.throwError(Res.Output.ReturnMessage);
              }
            },
            error => {
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
        } else {
          this.isLoadingRLS = false;
          this._error.throwError(Response.ReturnMessage);
        }
      },
      error => {
        this.isLoadingRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  navigateToCalculate() {
    this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
    this.router.navigateByUrl(
      "/deals/existingTabs/commercial/commlanding/calculate"
    );
  }
  reCalculate(Moduledetails, index, revValue) {
    const dialog = this.dialog.open(saveAlert, {
      width: "350px",
      data: {
        status: "isProceed"
      }
    });
    dialog.afterClosed().subscribe(Res => {
      if (Res) {
        this.IsDataRLScorrect(
          Moduledetails,
          index,
          "RecalculateModuleConfirm"
        ).subscribe(
          Response => {
            if (Response.ReturnFlag == "S") {
              let input = this.dealjsonservice.Re_CalculateModule;
              input.User = {
                EmployeeNumber: this.userInfo.EmployeeNumber,
                EmployeeName: this.userInfo.EmployeeName,
                EmployeeId: this.userInfo.EmployeeId,
                EmployeeMail: this.userInfo.EmployeeMail,
                ClientIP: ""
              };
              input.Calculate = null;
              input.DealHeader = Moduledetails.DealHeader;
              input.DealParameters = Moduledetails.DealParameters;
              input.GMBillingRate = Moduledetails.GMBillingRate;
              input.MasterData = Moduledetails.MasterData;
              input.ModuleHeader = Moduledetails.ModuleHeader;
              input.ModuleParameters = Moduledetails.ModuleParameters;
              input.RLSList = Moduledetails.RLSList;
              input.RateInflations = Moduledetails.RateInflations;
              input.SalaryInflation = Moduledetails.SalaryInflation;
              input.StandardBillingHours = Moduledetails.StandardBillingHours;
              input.TargetRevenue = revValue;
              input.Validations = Moduledetails.Validations;
              this.dealService.Re_CalculateModule(input).subscribe(
                Res => {
                  if (Res.ReturnFlag == "S") {
                    this.isLoadingRLS = false;
                    this._error.throwError(Res.Output.ReturnMessage);
                    this.store.dispatch(
                      new calculateDeals({ calculateDeal: undefined })
                    );
                    Moduledetails.ModuleParameters.ModuleDiscount = Res.Output.ModuleParameters.ModuleDiscount;
                    this.router.navigateByUrl(
                      "/deals/existingTabs/commercial/commlanding/calculate"
                    );
                  } else {
                    this.isLoadingRLS = false;
                    this._error.throwError(
                      "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                    );
                  }
                },
                error => {
                  this.isLoadingRLS = false;
                  this._error.throwError(
                    "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                  );
                }
              );
            } else {
              this.isLoadingRLS = false;
              this._error.throwError(Response.ReturnMessage);
            }
          },
          error => {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    });
  }
  reCalculateDeal(dealParams, revValue) {
    const dialog = this.dialog.open(saveAlert, {
      width: "350px",
      data: {
        status: "isProceed"
      }
    });
    dialog.afterClosed().subscribe(Res => {
      if (Res) {
        this.IsDataRLScorrect(
          dealParams,
          0,
          "RecalculateDealConfirm"
        ).subscribe(
          Response => {
            if (Response.ReturnFlag == "S") {
              this.isLoadingSaveRLS = true;
              let input = this.dealjsonservice.Re_CalculateDeal;
              input.UserInfo = {
                EmpName: this.userInfo.EmployeeName,
                AdId: this.userInfo.EmployeeId,
                EmpEmail: this.userInfo.EmployeeMail,
                EmpID: this.userInfo.EmployeeId,
                EmpNo: this.userInfo.EmployeeNumber
              };
              input.MasterData = dealParams.MasterData;
              input.TargetRevenue = revValue;
              this.dealService.Re_CalculateDeal(input).subscribe(
                Res => {
                  if (Res.ReturnFlag == "S") {
                    this.isLoadingSaveRLS = false;
                    this._error.throwError(Res.Output.ReturnMessage);
                    this.store.dispatch(
                      new calculateDeals({ calculateDeal: undefined })
                    );
                    this.router.navigateByUrl(
                      "/deals/existingTabs/commercial/commlanding/calculate"
                    );
                  } else {
                    this.isLoadingSaveRLS = false;
                    this._error.throwError(
                      "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                    );
                  }
                },
                error => {
                  this.isLoadingSaveRLS = false;
                  this._error.throwError(
                    "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                  );
                }
              );
            } else {
              this.isLoadingSaveRLS = false;
              this._error.throwError(Response.ReturnMessage);
            }
          },
          error => {
            this.isLoadingSaveRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    });
  }
  addCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0].replace(/\D/g, "");
    var x2 = x.length > 1 ? "." + x[1] : "";
    x2 = x2.replace(/(?!-)[^0-9.]/g, "").substring(0, 2);
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return x1 + x2;
  }
  getmappedIP(IPLineItemData: any): any {
    if (IPLineItemData.length > 0) {
      let i = 1;
      IPLineItemData.map(y => {
        for (var prop in y) {
          if (
            prop == "IPType" ||
            prop == "ProductCode" ||
            prop == "ModuleCode"
          ) {
            let obj = {
              id: y[prop],
              name:
                prop == "ProductCode"
                  ? y["ProductName"]
                  : prop == "IPType"
                  ? y["IPTypeName"]
                  : y["IPModuleName"]
            };
            console.log("y--->", y);
            y[prop] = obj;
            y.index = i;
            if (y.DurationDesc == "NA") {
              y.MinNumofDuration = "0";
            } else {
              y.MinNumofDuration = "0.1";
            }
            y.RowEditable = true;
          }
          if (prop == "RevenuePerc") {
            y[prop] = y[prop] == 0 ? 100 : y[prop];
          }
        }
        i = i + 1;
      });
      return IPLineItemData;
    } else {
      let obj: any = {};
      IntellectualHeader.map(x => {
        if (x.controltype == "select") {
          obj[x.name] = {
            id: -1,
            name: ""
          };
        } else {
          obj[x.name] = "";
        }
        x.isCheccked = true;
      });
      let finalarray = [];
      obj.RowEditable = true;
      finalarray.push(obj);
      return finalarray;
    }
  }
  getIPmodule(IPModuleData: any): any {
    if (IPModuleData.length > 0) {
      IPModuleData.map(x => {
        x.id = x.ModuleCode;
        x.name = x.ModuleName;
      });
    }
    return IPModuleData;
  }
  getIPproduct(IProductData: any): any {
    if (IProductData.length > 0) {
      IProductData.map(x => {
        x.id = x.ProductCode;
        x.name = x.ProductName;
      });
    }
    return IProductData;
  }
  getIPTYPEDrop(IPTypeData: any): any {
    if (IPTypeData.length > 0) {
      IPTypeData.map(x => {
        x.id = x.IPTypeCode;
        x.name = x.IPTypeName;
      });
    }
    return IPTypeData;
  }
  /* General method -> customizing headers and pre populated data from API response and assigning to table data */
  customizeRLSheaders(RLSData, ind) {
    console.log("RLSData--->", RLSData);
    let columndata: any = RLSData.columndata;
    this.accRlS[ind].RLSeHeader = [];
    this.accRlS[ind].rlsTable = [];
    this.accRlS[ind].tableTotalCount = 0;
    console.log("Cheeeck", columndata);
    if (
      columndata[0].elementID == "SLNO" ||
      columndata[0].elementID == "PRODUCTSLNO" ||
      columndata[0].elementID == "SERVICESLNO" ||
      columndata[0].elementID == "OTHERCOSTSLNO"
    ) {
      columndata.splice(0, 1);
    }
    let index = 1;
    console.log("Data", this.DealRSLdata.prePopulated);
    console.log("columndata", columndata);
    columndata.map(x => {
      let obj: any = {
        id: index,
        isFilter: false,
        name: x.elementID,
        isFixed: false,
        order: index,
        title: x.name == "Tot exp" ? "Total Experience" : x.name,
        ErrorMessage: "#" + x.name,
        controltype:
          x.elementType == "LBNE"
            ? "label"
            : x.elementType == "TXT"
            ? "text"
            : x.elementType == "DD"
            ? "select"
            : x.elementType == "DD"
            ? "select"
            : x.elementType == "LB"
            ? "text"
            : "text",
        hideFilter: true,
        elementType: x.elementType,
        mandFlag: x.mandFlag,
        validation: "&" + x.elementID,
        IsRequired: x.mandFlag == "Y" ? true : false,
        ValidMsg:
          x.elementType == "DD"
            ? ["please select" + " " + x.name]
            : ["please fill" + " " + x.name]
      };
      if (obj.id == 1) {
        obj.isFixed = true;
      }
      if (this.rlsbtn) {
        console.log("rlsbtn");
        this.GCGCheck = RLSData.GCGCheck;
        if (obj.name == "NOOFRESOURCES") {
          obj.isSum = true;
          obj.controltype = "readonly";
        }
        if (obj.name == "BILLINGRATE") {
          obj.controltype = "number";
           obj.disable = true
        }
        if (obj.name == "STANDARDRATE") {
          obj.controltype = "readonly";
        }
        let periodCheck = obj.name.split("");
        if (periodCheck[0] == "P" && !isNaN(periodCheck[1])) {
          obj.isVar = true;
          obj.controltype = "number";
        }
        if (obj.name == "SUBPRACTICENAME") {
          obj.dependency = "PRACTICENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "PracticeCode";
        }
        if (obj.name == "CITY") {
          obj.dependency = "LOCATIONNAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "LocationCode";
        }
        if (obj.name == "SKILL") {
          obj.dependency = "SUBPRACTICENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingAuto";
          obj.matchingCode = "SubPracticeCode";
        }
        if (obj.name == "GCG_CATNAME") {
          console.log("uuuuuuuuuuuuu");
          console.log("obj", obj);
          obj.isDisable = "!" + obj.name;

          obj.IsRequired = false;
          if (RLSData.GCGCheck == false) {
            obj.controltype = "readonly";
          }
        }
        if (obj.name == "PRACTICENAME") {
          obj.dependency = "SERVICELINENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "ServiceLineCode";
        }
        if (obj.name == "SHIFTNAME") {
          obj.dependency = "SERVICELINENAME";
          obj.cascade = "$" + obj.name; 
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "ServiceLineCode";
        }
        if (obj.name == "EXPCODE") {
          obj.dependency = "BANDCODE";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "BandCode";
        }
        if (obj.name == "ROLE" && RLSData.GCGCheck == false) {
          obj.dependency = "SKILL";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.initalDropLoad = "%" + obj.name;
        }
        if (obj.name == "ROLE" && RLSData.GCGCheck == true) {
          obj.dependency = "SERVICELINENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.initalDropLoad = "%" + obj.name;
        }
        if (obj.name == "BANDCODE") {
          obj.dependency = "ROLE";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.initalDropLoad = "%" + obj.name;
        }
      } else if (this.passthroughbtn) {
        console.log("passthroughbtn");
        this.GCGCheck = RLSData.GCGCheck;
        if (obj.name == "NOOFRESOURCES") {
          obj.isSum = true;
          obj.controltype = "readonly";
        }
        if (
          obj.name == "PRODUCTREIMBURSMENT" ||
          obj.name == "SERVICEREIMBURSMENT" ||
          obj.name == "OTHERCOSTREIMBURSMENT"
        ) {
          obj.controltype = "number";
        }
        if (!this.costPass) {
          if (obj.name == "TYPE") {
            obj.controltype = "readonly";
          }
        }
        if (
          obj.name == "PRODUCTCOST" ||
          obj.name == "SERVICECOST" ||
          obj.name == "OTHERCOSTPERC" ||
          obj.name == "OTHERCOSTMARGIN"
        ) {
          obj.controltype = "readonly";
        }
        if (obj.name == "PRODUCTMARGIN" || obj.name == "SERVICEMARGIN") {
          obj.isCost = true;
          obj.controltype = "number";
        }
        if (obj.id >= 12) {
          obj.isVar = true;
          obj.controltype = "number";
        }
        if (obj.id == 11 && this.costPass) {
          obj.isVar = true;
          obj.controltype = "number";
        }
        if (obj.name == "PRACTICENAME") {
          obj.dependency = "SERVICELINENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "ServiceLineCode";
        }
        if (obj.name == "SUBPRACTICENAME" && RLSData.GCGCheck == true) {
          obj.dependency = "PRACTICENAME";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.matchingCode = "PracticeCode";
        } else if (obj.name == "SUBPRACTICENAME") {
          obj.controltype = "readonly";
        }
        if (obj.name == "OTHERCOSTCATAGORY") {
          obj.dependency = "TYPE";
          obj.cascade = "$" + obj.name;
          obj.controltype = "cascadingDrop";
          obj.initalDropLoad = "%" + obj.name;
        }
      }
      if (x.elementType == "DD") {
        obj.allias = "_" + obj.name;
        if (obj.name == "LANGUAGESKILL") {
          obj.controltype = "autocomplete";
          obj.cascade = "$" + obj.name;
        }
        if (
          obj.name != "BANDCODE" &&
          obj.name != "OTHERCOSTCATAGORY" &&
          obj.name != "ROLE"
        ) {
          this.configData[x.elementID] = [{}];
        }
      }
      console.log(this.accRlS, "this.accRlS");
      console.log(this.accRlS[ind], "this.accRlS");
      this.accRlS[ind].RLSeHeader.push(obj);
      console.log(
        this.accRlS[ind].RLSeHeader,
        "this.accRlS[ind].RLSeHeader.push(obj)"
      );
      index = index + 1;
    });
    console.log("Headeer", this.accRlS[ind].RLSeHeader);
    let i = 1;
    if (
      this.DealRSLdata.SteadyRLSItems ||
      this.DealRSLdata.TransitionRLSItems
    ) {
      console.log(
        "DealRSLdata.SteadyRLSItems || this.DealRSLdata.TransitionRLSItems"
      );
      if (
        this.accRlS[ind].isSteady &&
        this.DealRSLdata.SteadyRLSItems.prePopulated.length > 0
      ) {
        this.DealRSLdata.SteadyRLSItems.prePopulated.map(y => {
          let rlsObj: any = {};
          console.log(
            this.accRlS[ind].RLSeHeader,
            "this.accRlS[ind].RLSeHeader"
          );
          console.log(
            this.DealRSLdata.SteadyRLSItems.prePopulated,
            "this.accRlS[ind].RLSeHeader"
          );
          this.accRlS[ind].RLSeHeader.map(x => {
            y.data.map(j => {
              if(j.elementID=="SEED")
              { 
                if(j.value=="Y")
                j.value="Yes"
                else if(j.value=="N")
                j.value="No"
              }
              
              if (
                j.elementID == x.name &&
                x.controltype != "select" &&
                x.controltype != "autocomplete" &&
                x.controltype != "cascadingDrop" &&
                x.controltype != "cascadingAuto"
              ) {
                rlsObj[j.elementID] = j.value || "";
              } else if (
                j.elementID == x.name &&
                (x.controltype == "select" ||
                  x.controltype == "autocomplete" ||
                  x.controltype == "cascadingDrop" ||
                  x.controltype == "cascadingAuto")
              ) {
                var obj = {
                  id: j.code || -1,
                  name: j.value.split("?").join("") || ""
                  //  "isConsulting" :
                };
                rlsObj[j.elementID] = obj;
                if (x.name == "GCG_CATNAME") {
                  var checkisconsult = this.RLSdropdownData.Group1.RLSSkill.filter(
                    ele => {
                      return rlsObj["SKILL"].name == ele["SkillName"];
                    }
                  )[0];
                  checkisconsult["IsConsulting"] == true
                    ? (rlsObj["!GCG_CATNAME"] = false)
                    : (rlsObj["!GCG_CATNAME"] = true);
                }
              }
            });
            if (!rlsObj[x.name]) {
              rlsObj[x.name] = "";
            }
          });
          rlsObj.index = i;
          rlsObj.id = i;
          rlsObj.RowEditable = true;
          rlsObj.moduleId = this.accRlS[ind].moduleId;
          rlsObj.lidisplayid = y.HiddenParams.lidisplayid;
          rlsObj.rlsno = y.HiddenParams.rlsno;
          console.log("RLS obj", rlsObj);
          this.TempRLStable[ind] = rlsObj;
          this.accRlS[ind].rlsTable.push(rlsObj);
          i = i + 1;
        });
        this.accRlS[ind].tableTotalCount = this.accRlS[ind].rlsTable.length;
        console.log(
          "RLS Table",
          this.accRlS[ind].rlsTable,
          this.accRlS[ind].tableTotalCount
        );
      } else if (
        !this.accRlS[ind].isSteady &&
        this.DealRSLdata.TransitionRLSItems.prePopulated.length > 0
      ) {
        this.DealRSLdata.TransitionRLSItems.prePopulated.map(y => {
          let rlsObj: any = {};
          this.accRlS[ind].RLSeHeader.map(x => {
            y.data.map(j => {
              if (
                j.elementID == x.name &&
                x.controltype != "select" &&
                x.controltype != "autocomplete" &&
                x.controltype != "cascadingDrop" &&
                x.controltype != "cascadingAuto"
              ) {
                rlsObj[j.elementID] = j.value || "";
              } else if (
                j.elementID == x.name &&
                (x.controltype == "select" ||
                  x.controltype == "autocomplete" ||
                  x.controltype == "cascadingDrop" ||
                  x.controltype == "cascadingAuto")
              ) {
                let obj = {
                  id: j.code || -1,
                  name: j.value || ""
                };
                rlsObj[j.elementID] = obj;
                //   if(!this.passthroughbtn)
                //   {
                //   if (x.name == "OTHERCOSTCATAGORY") {
                //     let array = [];
                //     array.push(obj);
                //     this.configData.OTHERCOSTCATAGORY = array;
                //   }
                // }
              }
            });
            if (!rlsObj[x.name]) {
              rlsObj[x.name] = "";
            }
          });
          rlsObj.index = i;
          rlsObj.id = i;
          rlsObj.RowEditable = true;
          rlsObj.moduleId = this.accRlS[ind].moduleId;
          rlsObj.lidisplayid = y.HiddenParams.lidisplayid;
          rlsObj.rlsno = y.HiddenParams.rlsno;
          console.log("RLS obj", rlsObj);
          this.TempRLStable[ind] = rlsObj;
          this.accRlS[ind].rlsTable.push(rlsObj);
          i = i + 1;
        });
        this.accRlS[ind].tableTotalCount = this.accRlS[ind].rlsTable.length;
      } else {
        let obj: any = {};
        this.accRlS[ind].RLSeHeader.map(x => {
          if (
            x.controltype == "select" ||
            x.controltype == "autocomplete" ||
            x.controltype == "cascadingDrop" ||
            x.controltype == "cascadingAuto"
          ) {
            obj[x.name] = {
              id: -1,
              name: ""
            };
          } else {
            obj[x.name] = "";
          }
        });
        obj.index = i;
        obj.id = i;
        obj.RowEditable = true;
        obj.moduleId = this.accRlS[ind].moduleId;
        obj.rlsno = this.accRlS[ind].isSteady
          ? this.moduleDetails.RLSList[0].RLSNumber
          : this.moduleDetails.RLSList[1].RLSNumber;
        this.TempRLStable[ind] = obj;
        this.accRlS[ind].rlsTable.push(obj);
        this.accRlS[ind].tableTotalCount = this.accRlS[ind].rlsTable.length;
        this.accRlS[ind].showAddbutton = false;
      }
    } else if (this.DealRSLdata.prePopulated.length > 0) {
      console.log("DealRSLdata.prePopulated");
      this.DealRSLdata.prePopulated.map(y => {
        let rlsObj: any = {};
        this.accRlS[ind].RLSeHeader.map(x => {
          y.data.map(j => {
            if (
              j.elementID == x.name &&
              x.controltype != "select" &&
              x.controltype != "autocomplete" &&
              x.controltype != "cascadingDrop" &&
              x.controltype != "cascadingAuto"
            ) {
              rlsObj[j.elementID] = j.value || "";
            } else if (
              j.elementID == x.name &&
              (x.controltype == "select" ||
                x.controltype == "autocomplete" ||
                x.controltype == "cascadingDrop" ||
                x.controltype == "cascadingAuto")
            ) {
              let obj = {
                id: j.code || -1,
                name: j.value || ""
              };
              rlsObj[j.elementID] = obj;
              // if (x.name == "OTHERCOSTCATAGORY") {
              //   let array = [];
              //   array.push(obj);
              //   this.configData.OTHERCOSTCATAGORY = array;
              // }
            }
          });
          if (!rlsObj[x.name]) {
            rlsObj[x.name] = "";
          }
        });
        rlsObj.index = i;
        rlsObj.id = i;
        rlsObj.RowEditable = y.HiddenParams.RowEditable == "Y" ? true : false;
        rlsObj.moduleId = this.accRlS[ind].moduleId;
        rlsObj.lidisplayid = y.HiddenParams.lidisplayid;
        rlsObj.rlsno = y.HiddenParams.rlsno;
        console.log("RLS obj", rlsObj);
        this.TempRLStable[ind] = rlsObj;
        this.accRlS[ind].rlsTable.push(rlsObj);
        i = i + 1;
      });
      this.accRlS[ind].tableTotalCount = this.accRlS[ind].rlsTable.length;
    } else {
      console.log("else ..");
      let obj: any = {};
      this.accRlS[ind].RLSeHeader.map(x => {
        if (
          x.controltype == "select" ||
          x.controltype == "autocomplete" ||
          x.controltype == "cascadingDrop" ||
          x.controltype == "cascadingAuto"
        ) {
          obj[x.name] = {
            id: -1,
            name: ""
          };
        } else {
          obj[x.name] = "";
        }
      });
      obj.index = i;
      obj.id = i;
      obj.RowEditable = true;
      obj.moduleId = this.accRlS[ind].moduleId;
      obj.rlsno = this.accRlS[ind].isSteady
        ? this.moduleDetails.RLSList[0].RLSNumber
        : this.moduleDetails.RLSList[1].RLSNumber;
      this.TempRLStable[ind] = obj;
      this.accRlS[ind].rlsTable.push(obj);
      this.accRlS[ind].tableTotalCount = this.accRlS[ind].rlsTable.length;
      this.accRlS[ind].showAddbutton = false;
    }
    this.fillDropdowns();
    this.showTable = true;
  }
  /*General method -> for filling dropdowns */
  fillDropdowns() {
    if (this.rlsbtn) {
      if (
        this.configData.SERVICELINENAME &&
        this.RLSdropdownData.Group1.RLSServiceLine
      ) {
        this.configData.SERVICELINENAME = this.getServiceDrop(
          this.RLSdropdownData.Group1.RLSServiceLine
        );
      }
      if (this.configData.SEED && this.RLSdropdownData.dropDownData.Seed) {
        this.configData.SEED = this.getSeedDrop(
          this.RLSdropdownData.dropDownData.Seed
        );
      }
      // if (this.configData.ROLE && this.RLSdropdownData.dropDownData.Role && this.GCGCheck == true) {
      //   this.configData.ROLE = this.getRoleDrop(this.RLSdropdownData.dropDownData.Role);
      // }
      if (this.configData.SHIFTNAME && this.RLSdropdownData.Group1.RLSShift) {
        this.configData.SHIFTNAME = this.getShiftData(
          this.RLSdropdownData.Group1.RLSShift
        );
      }
      if (
        this.configData.BILLABILITYNAME &&
        this.RLSdropdownData.dropDownData.billability
      ) {
        this.configData.BILLABILITYNAME = this.getBillingDrop(
          this.RLSdropdownData.dropDownData.billability
        );
      }
      if (
        this.configData.LOCATIONNAME &&
        this.RLSdropdownData.dropDownData.location
      ) {
        this.configData.LOCATIONNAME = this.getLocationDrop(
          this.RLSdropdownData.dropDownData.location
        );
      }
      if (
        this.configData.RESOURCEDEPLOYMENTNAME &&
        this.RLSdropdownData.dropDownData.resDeploy
      ) {
        this.configData.RESOURCEDEPLOYMENTNAME = this.getResourceDrop(
          this.RLSdropdownData.dropDownData.resDeploy
        );
      }
      if (
        this.configData.PRACTICENAME &&
        this.RLSdropdownData.Group1.RLSPractice
      ) {
        this.configData.PRACTICENAME = this.getParctiseDrop(
          this.RLSdropdownData.Group1.RLSPractice
        );
      }
      if (
        this.configData.SUBPRACTICENAME &&
        this.RLSdropdownData.Group1.RLSSubPractice
      ) {
        this.configData.SUBPRACTICENAME = this.getSubDrop(
          this.RLSdropdownData.Group1.RLSSubPractice
        );
      }
      // if (this.configData.BANDCODE && this.RLSdropdownData.Group1.RLSBand) {
      //   this.configData.BANDCODE = this.getBandDrop(this.RLSdropdownData.Group1.RLSBand);
      // }
      if (
        this.configData.EXPCODE &&
        this.RLSdropdownData.Group2.RLSExperience
      ) {
        this.configData.EXPCODE = this.getExpDrop(
          this.RLSdropdownData.Group2.RLSExperience
        );
      }
      if (this.configData.CITY && this.RLSdropdownData.Group2.RLSCity) {
        this.configData.CITY = this.getCityDrop(
          this.RLSdropdownData.Group2.RLSCity
        );
      }
      if (
        this.configData.LANGUAGESKILL &&
        this.RLSdropdownData.Group1.RLSLanguageSkill
      ) {
        this.configData.LANGUAGESKILL = this.getLanguageDrop(
          this.RLSdropdownData.Group1.RLSLanguageSkill
        );
      }
      if (this.configData.SKILL && this.RLSdropdownData.Group1.RLSSkill) {
        this.configData.SKILL = this.getSkillDrop(
          this.RLSdropdownData.Group1.RLSSkill
        );
      }
      if (
        this.configData.GCG_CATNAME &&
        this.RLSdropdownData.dropDownData.SkillCategory
      ) {
        console.log(this.configData.SKILL, " this.configData.SKILL");
        this.configData.GCG_CATNAME = this.getSkillCatDrop(
          this.RLSdropdownData.dropDownData.SkillCategory
        );
      }
      if (
        this.configData.IPPRODUCTNAME &&
        this.RLSdropdownData.dropDownData.IPProduct
      ) {
        this.configData.IPPRODUCTNAME = this.getIPProductDrop(
          this.RLSdropdownData.dropDownData.IPProduct
        );
      }
      if (
        this.configData.IPSERVICETYPENAME &&
        this.RLSdropdownData.dropDownData.IPServiceType
      ) {
        this.configData.IPSERVICETYPENAME = this.getIPProductDrop(
          this.RLSdropdownData.dropDownData.IPServiceType
        );
      }
    } else if (this.passthroughbtn) {
      if (
        this.configData.CATEGORYNAME &&
        this.DealRSLdata.dropDownData.category
      ) {
        this.configData.CATEGORYNAME = this.getcategoryDrop(
          this.DealRSLdata.dropDownData.category
        );
      }
      if (
        this.configData.SERVICELINENAME &&
        this.DealRSLdata.dropDownData.serviceLine
      ) {
        this.configData.SERVICELINENAME = this.getpassServiceDrop(
          this.DealRSLdata.dropDownData.serviceLine
        );
      }
      if (
        this.configData.PRACTICENAME &&
        this.DealRSLdata.dropDownData.practice
      ) {
        this.configData.PRACTICENAME = this.getpassPractiseDrop(
          this.DealRSLdata.dropDownData.practice
        );
      }
      if (
        this.configData.SUBPRACTICENAME &&
        this.DealRSLdata.dropDownData.subpractice
      ) {
        this.configData.SUBPRACTICENAME = this.getpassSubPractiseDrop(
          this.DealRSLdata.dropDownData.subpractice
        );
      }
      if (this.configData.TYPE && this.DealRSLdata.dropDownData.type) {
        console.log(this.configData, "this.configData1234");
        console.log(this.DealRSLdata, "this.DealRSLdata1234");
        this.configData.TYPE = this.getpassTypeDrop(
          this.DealRSLdata.dropDownData.type
        );
      }
      if (
        this.configData.COUNTRYNAME &&
        this.DealRSLdata.dropDownData.country
      ) {
        this.configData.COUNTRYNAME = this.getpassCountryDrop(
          this.DealRSLdata.dropDownData.country
        );
      }
      if (
        this.configData.COUNTRYNAME &&
        this.DealRSLdata.dropDownData.country
      ) {
        this.configData.COUNTRYNAME = this.getpassCountryDrop(
          this.DealRSLdata.dropDownData.country
        );
      }
    }
    console.log("Config Data", this.configData);
  }

  Addrow(Moduledetails, ind) {
    this.isrowAdded = true;
    if (this.rlsbtn) {
      switch (true) {
        case this.DealRSLdata.hasOwnProperty("SteadyRLSItems"):
          this.customizeRLSheaders(this.DealRSLdata.SteadyRLSItems, ind);
          this.ControlRoles(this.DealRSLdata.SteadyRLSItems.ControlAccess);
          break;
        case this.DealRSLdata.hasOwnProperty("TransitionRLSItems"):
          this.customizeRLSheaders(this.DealRSLdata.TransitionRLSItems, ind);
          this.ControlRoles(this.DealRSLdata.TransitionRLSItems.ControlAccess);
          break;
        default:
          break;
      }
      this.accRlS[ind].showAddbutton = false;
      this.accRlS[ind].rlsTable.map(x => {
        x.isRowEditable = true;
        x.isCheccked = true;
        x.isNewRow = true;
      });
    } else if (this.passthroughbtn) {
      this.customizeRLSheaders(this.DealRSLdata, ind);
      this.ControlRoles(this.DealRSLdata.ControlAccess);
      this.accRlS[ind].ControlRoles = this.DealRSLdata.ControlAccess;
      this.accRlS[ind].showAddbutton = false;
      this.accRlS[ind].rlsTable.map(x => {
        x.isRowEditable = true;
        x.isCheccked = true;
        x.isNewRow = true;
      });
    } else if (this.intellectualbtn) {
      let input = {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeNumber
        },
        MasterDataRLS: {
          traceoppid: this.dealOverview.oppID,
          dealid: this.dealOverview.id,
          moduleid: Moduledetails.ModuleHeader.ModuleID,
          optionid: this.dealMainJSON.MasterData.OptionId,
          rlsid: this.accRlS[ind].isSteady
            ? this.getRLSID(Moduledetails.RLSList, "Steady State")
            : this.getRLSID(Moduledetails.RLSList, "Transition"),
          dealversion: this.dealMainJSON.MasterData.DealVersionId,
          optionversion: this.dealMainJSON.MasterData.OptionVersionId,
          moduleversion: Moduledetails.ModuleHeader.ModuleVersion,
          rlsversion: this.accRlS[ind].isSteady
            ? Moduledetails.RLSList[0].RLSVersion
            : Moduledetails.RLSList[1].RLSVersion,
          dealno: this.dealOverview.id,
          moduleno: Moduledetails.ModuleHeader.ModuleNumber,
          optionno: this.dealMainJSON.MasterData.OptionNumber,
          rlsno: this.accRlS[ind].isSteady
            ? Moduledetails.RLSList[0].RLSNumber
            : Moduledetails.RLSList[1].RLSNumber,
          passthroughtype: "P",
          RLSType: this.accRlS[ind].isSteady ? "S" : "T",
          PricingId: this.dealMainJSON.MasterData.PricingId,
          DealHeaderNumber: this.dealOverview.dealHeadernumber,
          currecyCode: this.dealMainJSON.BindHeaderDetail.Currency,
          PeriodSelected: this.period,
          BillingRateSelected: this.billing
        }
      };
      this.isLoadingSaveRLS = true;
      this.dealService.AddIpLineItem(input).subscribe(
        Res => {
          if (Res.ReturnFlag == "S") {
            this.isLoadingSaveRLS = false;
            this._error.throwError(Res.Output.Message);
            if (Res.Output.SuccessFlag == "S") {
              this.accRlS[ind].RLSeHeader = IntellectualHeader;
              this.configData.IPType = this.getIPTYPEDrop(
                this.DealRSLdata.IPMaster.IPTypeData
              );
              this.configData.ProductCode = this.getIPproduct(
                this.DealRSLdata.IPMaster.IProductData
              );
              this.configData.ModuleCode = this.getIPmodule(
                this.DealRSLdata.IPMaster.IPModuleData
              );
              this.accRlS[ind].rlsTable = this.getmappedIP(
                Res.Output.IPLineItemDataList.IPLineItemData
              );
              this.ControlRoles(this.DealRSLdata.ControlAccess);
              this.accRlS[ind].ControlRoles = this.DealRSLdata.ControlAccess;
              this.accRlS[ind].rlsTable.map(x => {
                x.isRowEditable = true;
                x.isCheccked = true;
                x.isNewRow = true;
              });
              console.log(
                "Table",
                this.accRlS[ind].rlsTable,
                this.accRlS[ind].RLSeHeader
              );
              this.accRlS[ind].tableTotalCount = this.accRlS[
                ind
              ].rlsTable.length;
              this.accRlS[ind].showAddbutton = false;
            }
          } else {
            this.isLoadingSaveRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        },
        error => {
          this.isLoadingSaveRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
    }
  }
  LoademptyData() {
    let tempNewAddRow = {};
    this.accRlS[this.moduleIndex].RLSeHeader.forEach(element => {
      switch (element.controltype) {
        case "select":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "input":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "autocomplete":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "date":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "label":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "switch":
          {
            tempNewAddRow[element.name] = false;
          }
          break;
        case "cascadingDrop":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "cascadingAuto":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
      }
      if (element.IsRequired) {
        tempNewAddRow[element.validation] = false;
      }
    });
    this.accRlS[this.moduleIndex].rlsTable.push(tempNewAddRow);
    console.log("table data", this.accRlS[this.moduleIndex].rlsTable);
  }
  /*API call to check  RLS correct on click of Add button */
  IsDataRLScorrect(Moduledetails, ind, Action): Observable<any> {
    this.isLoadingRLS = true;
    let input = this.dealjsonservice.IsRLScorrect;
    let user = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    input.UserInfo = user;
    input.Action = Action;
    if (Action != "RecalculateDealConfirm") {
      input.MasterData.DealHeaderNumber = this.dealOverview.dealHeadernumber;
      input.MasterData.TraceOppId = this.dealOverview.oppID;
      input.MasterData.PricingId = this.dealMainJSON.MasterData.PricingId.toUpperCase();
      input.MasterData.DealId = this.dealOverview.id;
      input.MasterData.ModuleId = Moduledetails.ModuleID;
      input.MasterData.ModuleNumber = Moduledetails.ModuleNumber;
      input.MasterData.ModuleVersionId = Moduledetails.ModuleVersion;
      input.MasterData.RLSId = this.accRlS[ind].isSteady
        ? this.getRLSID(Moduledetails.RLSList, "Steady State")
        : this.getRLSID(Moduledetails.RLSList, "Transition");
      input.MasterData.RLSVersionId = this.accRlS[ind].isSteady
        ? Moduledetails.RLSList[0].RLSVersion
        : Moduledetails.RLSList[1].RLSVersion;
      input.MasterData.OptionId = this.dealMainJSON.MasterData.OptionId;
      input.MasterData.DealVersionId = this.dealMainJSON.MasterData.DealVersionId;
      input.MasterData.OptionVersionId = this.dealMainJSON.MasterData.OptionVersionId;
      input.MasterData.OptionNumber = this.dealMainJSON.MasterData.OptionNumber;
    } else {
      input.MasterData = Moduledetails.MasterData;
    }
    return this._ApiServiceDeal5B.post(
      "api/v1/CalculateDealService/IsDataInRLSisCorrect",
      input
    );
  }
  /*General method -> To populate data o toggle of Steady n Transation state */
  showSteadyRtransition(data, index, status) {
    this.showTable = false;
    this.billing = "";
    this.Oldbilling = "";
    this.period = "";
    this.Oldperiod = "";
    if (status == "STD") {
      this.accRlS[index].isSteady = true;
      this.Oldbilling = this.billing = this.Steadybilling;
      this.period = this.Oldperiod = this.Steadyperiod;
      if (this.rlsbtn) {
        if (this.DealRSLdata.SteadyRLSItems) {
          if (this.DealRSLdata.SteadyRLSItems.prePopulated.length > 0) {
            this.ControlRoles(this.DealRSLdata.SteadyRLSItems.ControlAccess);
            this.accRlS[
              index
            ].ControlRoles = this.DealRSLdata.SteadyRLSItems.ControlAccess;
            this.accRlS[index].showAddbutton = false;
            this.customizeRLSheaders(this.DealRSLdata.SteadyRLSItems, index);
          } else {
            this.accRlS[index].showAddbutton = true;
            if (
              this._validate.validate(this.billing) &&
              this._validate.validate(this.period)
            ) {
              this.accRlS[index].Isbilled = true;
            } else {
              this.accRlS[index].Isbilled = false;
            }
          }
        } else {
          this.accRlS[index].showAddbutton = true;
          if (
            this._validate.validate(this.billing) &&
            this._validate.validate(this.period)
          ) {
            this.accRlS[index].Isbilled = true;
          } else {
            this.accRlS[index].Isbilled = false;
          }
        }
      } else if (this.passthroughbtn) {
        data.Opened = false;
        this.GetModuleDetails(this.moduleDetails, index, "PASS", false);
      } else if (this.intellectualbtn) {
        data.Opened = false;
        this.GetModuleDetails(this.moduleDetails, index, "INTEL", false);
      }
    } else {
      this.accRlS[index].isSteady = false;
      this.Oldbilling = this.billing = this.Transitionbilling;
      this.period = this.Oldperiod = this.Transitionperiod;
      if (this.rlsbtn) {
        if (this.DealRSLdata.TransitionRLSItems) {
          if (this.DealRSLdata.TransitionRLSItems.prePopulated.length > 0) {
            this.ControlRoles(
              this.DealRSLdata.TransitionRLSItems.ControlAccess
            );
            this.accRlS[
              index
            ].ControlRoles = this.DealRSLdata.TransitionRLSItems.ControlAccess;
            this.accRlS[index].showAddbutton = false;
            this.customizeRLSheaders(
              this.DealRSLdata.TransitionRLSItems,
              index
            );
          } else {
            this.accRlS[index].showAddbutton = true;
            if (
              this._validate.validate(this.billing) &&
              this._validate.validate(this.period)
            ) {
              this.accRlS[index].Isbilled = true;
            } else {
              this.accRlS[index].Isbilled = false;
            }
          }
        } else {
          this.accRlS[index].showAddbutton = true;
          if (
            this._validate.validate(this.billing) &&
            this._validate.validate(this.period)
          ) {
            this.accRlS[index].Isbilled = true;
          } else {
            this.accRlS[index].Isbilled = false;
          }
        }
      } else if (this.passthroughbtn) {
        data.Opened = false;
        this.GetModuleDetails(this.moduleDetails, index, "PASS", false);
      } else if (this.intellectualbtn) {
        data.Opened = false;
        this.GetModuleDetails(this.moduleDetails, index, "INTEL", false);
      }
    }
  }
  ChangePeriod(moduleDetails) {
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, this.moduleIndex, "CP", false);
  }
  //Below are the methods to modify api response of dropdowns for editable expansion table
  getIPProductDrop(IPProduct: any): any {
    if (IPProduct.length > 0) {
      IPProduct.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return IPProduct;
  }
  getDescDrop(Output: any): any {
    if (Output.length > 0) {
      Output.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return Output;
  }
  getpassCountryDrop(country: any): any {
    if (country.length > 0) {
      country.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return country;
  }
  getpassTypeDrop(type: any): any {
    console.log(type, "type..");
    if (type.length > 0) {
      type.map(x => {
        x.id = x.id;
        x.name = x.label;
        x.matchingCode = x.id;
      });
    }
    return type;
  }
  getpassSubPractiseDrop(subpractice: any): any {
    if (subpractice.length > 0) {
      subpractice.map(x => {
        x.id = x.SubPracticeCode;
        x.name = x.SubPracticeName.split("?").join("");
      });
    }
    return subpractice;
  }
  getpassPractiseDrop(practice: any): any {
    if (practice.length > 0) {
      practice.map(x => {
        x.id = x.PracticeCode;
        x.name = x.PracticeName;
      });
    }
    return practice;
  }
  getcategoryDrop(category: any): any {
    if (category.length > 0) {
      category.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return category;
  }
  getpassServiceDrop(service: any): any {
    if (service.length > 0) {
      service.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return service;
  }
  getSkillDrop(RLSSkill: any): any {
    if (RLSSkill.length > 0) {
      RLSSkill.map(x => {
        x.id = x.SkillCode;
        x.name = x.SkillName;
      });
    }
    return RLSSkill;
  }
  getSkillCatDrop(RLSSkillCat: any): any {
    console.log(RLSSkillCat, "RLSSkillCat");
    if (RLSSkillCat.length > 0) {
      RLSSkillCat.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return RLSSkillCat;
  }
  getLanguageDrop(RLSLanguageSkill: any): any {
    if (RLSLanguageSkill.length > 0) {
      RLSLanguageSkill.map(x => {
        x.id = x.LanguageSkillCode;
        x.name = x.LanguageSkillName;
      });
    }
    return RLSLanguageSkill;
  }
  getCityDrop(RLSCity: any): any {
    if (RLSCity.length > 0) {
      RLSCity.map(x => {
        x.id = x.CityCode;
        x.name = x.CityName;
      });
    }
    return RLSCity;
  }
  getExpDrop(RLSExperience: any): any {
    if (RLSExperience.length > 0) {
      RLSExperience.map(x => {
        x.id = x.ExpCode;
        x.name = x.ExpName;
      });
    }
    return RLSExperience;
  }
  getBandDrop(RLSBand: any): any {
    if (RLSBand.length > 0) {
      RLSBand.map(x => {
        x.id = x.BandCode;
        x.name = x.BandName;
      });
    }
    return RLSBand;
  }
  getSubDrop(RLSSubPractice: any): any {
    if (RLSSubPractice.length > 0) {
      RLSSubPractice.map(x => {
        x.id = x.SubPracticeCode;
        x.name = x.SubPracticeName.split("?").join("");
      });
    }
    return RLSSubPractice;
  }
  getParctiseDrop(RLSPractice: any): any {
    if (RLSPractice.length > 0) {
      RLSPractice.map(x => {
        x.id = x.PracticeCode;
        x.name = x.PracticeName;
      });
    }
    return RLSPractice;
  }
  getResourceDrop(resDeploy: any): any {
    if (resDeploy.length > 0) {
      resDeploy.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return resDeploy;
  }
  getLocationDrop(location: any): any {
    if (location.length > 0) {
      location.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return location;
  }
  getBillingDrop(billability: any): any {
    if (billability.length > 0) {
      billability.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return billability;
  }
  getShiftData(RLSShift: any): any {
    if (RLSShift.length > 0) {
      RLSShift.map(x => {
        x.id = x.ShiftCode;
        x.name = x.ShiftName;
      });
    }
    return RLSShift;
  }
  getRoleDrop(Role: any): any {
    if (Role.length > 0) {
      Role.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return Role;
  }
  getSeedDrop(Seed: any): any {
    if (Seed.length > 0) {
      Seed.map(x => {
        x.id = x.id;
        x.name = x.label;
      });
    }
    return Seed;
  }
  getServiceDrop(RLSServiceLine: any): any {
    if (RLSServiceLine.length > 0) {
      RLSServiceLine.map(x => {
        x.id = x.ServiceLineCode;
        x.name = x.ServiceLineName;
      });
    }
    return RLSServiceLine;
  }
  performTableChildAction(event) {
    console.log("Actions", event);
    console.log("Acc RLS", this.accRlS[this.moduleIndex]);
    console.log("action name", event.action);
    switch (event.action) {
      case "saveAll":
        if (event.objectRowData.length > 0) {
          const dialog = this.dialog.open(saveAlert, {
            width: "350px",
            data: {
              status: this.intellectualbtn ? "isIPSave" : "isSave"
            }
          });
          dialog.afterClosed().subscribe(res => {
            if (res) {
              if (this.rlsbtn || this.passthroughbtn) {
                this.isLoadingRLS = true;
                this.IsDataRLScorrect(
                  this.moduleDetails,
                  this.moduleIndex,
                  "SAVERLS"
                ).subscribe(
                  Response => {
                    if (Response.ReturnFlag == "S") {
                      this.saveRLS(event.objectRowData, "save");
                    } else {
                      this.isLoadingRLS = false;
                      this._error.throwError(Response.ReturnMessage);
                    }
                  },
                  error => {
                    this._error.throwError(
                      "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                    );
                    this.isLoadingRLS = false;
                  }
                );
              } else if (this.intellectualbtn) {
                this.saveRLS(event.objectRowData, "save");
              }
            } else {
              if (this.rlsbtn) {
                this.moduleDetails.Opened = false;
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "RLS",
                  true
                );
              } else if (this.passthroughbtn) {
                this.moduleDetails.Opened = false;
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "PASS",
                  false
                );
              } else if (this.intellectualbtn) {
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "INTEL",
                  false
                );
              }
            }
          });
        }
        break;
      case "InitialLoad":
        if (this.rlsbtn) {
          if (event.objectRowData[0].key == "ROLE") {
            event.objectRowData[0].action = "InitialLoad";
            this.getRolesFromAPI(
              this.moduleDetails,
              this.moduleIndex,
              event.objectRowData
            );
            event.objectRowData[0].data["%ROLE"] = false;
          }
          if (event.objectRowData[0].key == "BANDCODE") {
            event.objectRowData[0].action = "InitialLoad";
            this.getRolesFromAPI(
              this.moduleDetails,
              this.moduleIndex,
              event.objectRowData
            );
            event.objectRowData[0].data["%BANDCODE"] = false;
          }
        }
        if (this.passthroughbtn) {
          event.objectRowData[0].action = "InitialLoad";
          this.getRolesFromAPI(
            this.moduleDetails,
            this.moduleIndex,
            event.objectRowData
          );
          event.objectRowData[0].data["%OTHERCOSTCATAGORY"] = false;
        }
        break;
      case "moreAction":
        if (event.objectRowData[0].id == 1) {
          this.pullOldRLS();
        } else if (event.objectRowData[0].id == "2") {
          this.accRlS[this.moduleIndex].Opened = false;
          this.GetModuleDetails(
            this.moduleDetails,
            this.moduleIndex,
            "SaveExistingRLS",
            false
          );
        } else if (event.objectRowData[0].id == "3") {
          this.accRlS[this.moduleIndex].Opened = false;
          this.GetModuleDetails(
            this.moduleDetails,
            this.moduleIndex,
            "RevokeRLS",
            false
          );
        } else if (event.objectRowData[0].id == "4") {
          const dialog = this.dialog.open(saveAlert, {
            width: "350px",
            data: {
              status: "isDelete"
            }
          });
          dialog.afterClosed().subscribe(res => {
            if (res) {
              this.accRlS[this.moduleIndex].Opened = false;
              this.GetModuleDetails(
                this.moduleDetails,
                this.moduleIndex,
                "DeleteRLS",
                false
              );
            } else {
              if (this.rlsbtn) {
                this.moduleDetails.Opened = false;
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "RLS",
                  true
                );
              } else if (this.passthroughbtn) {
                this.moduleDetails.Opened = false;
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "PASS",
                  false
                );
              } else if (this.intellectualbtn) {
                this.GetModuleDetails(
                  this.moduleDetails,
                  this.moduleIndex,
                  "INTEL",
                  false
                );
              }
            }
          });
        } else if (event.objectRowData[0].id == "5") {
          const dialog = this.dialog.open(saveAlert, {
            width: "350px",
            data: {
              status: "isRevert"
            }
          });
          dialog.afterClosed().subscribe(res => {
            if (res) {
              this.accRlS[this.moduleIndex].Opened = false;
              this.GetModuleDetails(
                this.moduleDetails,
                this.moduleIndex,
                "RevertRLS",
                false
              );
            }
          });
        }
        break;
      case "delete":
        const dialog = this.dialog.open(saveAlert, {
          width: "350px",
          data: {
            status: "isDeleteLine"
          }
        });
        dialog.afterClosed().subscribe(res => {
          if (res) {
            this.accRlS[this.moduleIndex].Opened = false;
            this.saveRLS(event.objectRowData, "deleteline");
          }
        });
        break;
      case "AddIP":
        this.Addrow(this.moduleDetails, this.moduleIndex);
        break;
      case "Skill_changed":
        console.log(this.GCGCheck, "this.GCGCheck");
        if (
          event.objectRowData[0].key == "SERVICELINENAME" &&
          this.GCGCheck == true
        ) {
          console.log("111111111111");
          event.objectRowData[0].action = "Skill_changed";
          this.getRolesFromAPI(
            this.moduleDetails,
            this.moduleIndex,
            event.objectRowData
          );
        } else if (event.objectRowData[0].key == "SKILL") {
          console.log("222222222222");
          event.objectRowData[0].action = "Skill_changed";
          this.getRolesFromAPI(
            this.moduleDetails,
            this.moduleIndex,
            event.objectRowData
          );
        } else if (event.objectRowData[0].key == "TYPE") {
          console.log("3333333333333333");
          event.objectRowData[0].action = "Skill_changed";
          this.getRolesFromAPI(
            this.moduleDetails,
            this.moduleIndex,
            event.objectRowData
          );
        } else if (event.objectRowData[0].key != "SKILL") {
          console.log("44444444444444444");
          event.objectRowData[0].action = "Skill_changed";
          this.getRolesFromAPI(
            this.moduleDetails,
            this.moduleIndex,
            event.objectRowData
          );
        }
        break;
      case "Canceled":
        if (this.rlsbtn) {
          this.moduleDetails.Opened = false;
          this.GetModuleDetails(
            this.moduleDetails,
            this.moduleIndex,
            "RLS",
            false
          );
        } else if (this.passthroughbtn) {
          this.moduleDetails.Opened = false;
          this.GetModuleDetails(
            this.moduleDetails,
            this.moduleIndex,
            "PASS",
            false
          );
        } else if (this.intellectualbtn) {
          this.GetModuleDetails(
            this.moduleDetails,
            this.moduleIndex,
            "INTEL",
            false
          );
        }
        break;
      default:
        break;
    }
  }
  getRolesFromAPI(Moduledetails: any, ind: any, objectRowData: any) {
    var input: any = {
      ToName:
        objectRowData[0].key == "TYPE"
          ? "CostDesc"
          : objectRowData[0].key == "SKILL"
          ? "role"
          : objectRowData[0].action == "InitialLoad" &&
            objectRowData[0].key == "ROLE"
          ? "role"
          : objectRowData[0].action == "Skill_changed" &&
            objectRowData[0].key == "ROLE"
          ? "band"
          : objectRowData[0].action == "InitialLoad" &&
            objectRowData[0].key == "BANDCODE"
          ? "band"
          : objectRowData[0].key == "SERVICELINENAME"
          ? "role"
          : objectRowData[0].key == "OTHERCOSTCATAGORY"
          ? "CostDesc"
          : "",
      MasterDataRLS: {},
      RLSDependentvalue: {}
    };
    input.MasterDataRLS = {
      traceoppid: this.dealOverview.oppID,
      dealid: this.dealOverview.id,
      moduleid: Moduledetails.ModuleHeader.ModuleID,
      optionid: this.dealMainJSON.MasterData.OptionId,
      rlsid: this.accRlS[ind].isSteady
        ? this.getRLSID(Moduledetails.RLSList, "Steady State")
        : this.getRLSID(Moduledetails.RLSList, "Transition"),
      dealversion: this.dealMainJSON.MasterData.DealVersionId,
      optionversion: this.dealMainJSON.MasterData.OptionVersionId,
      moduleversion: Moduledetails.ModuleHeader.ModuleVersion,
      rlsversion: this.accRlS[ind].isSteady
        ? Moduledetails.RLSList[0].RLSVersion
        : Moduledetails.RLSList[1].RLSVersion,
      dealno: this.dealOverview.id,
      moduleno: Moduledetails.ModuleHeader.ModuleNumber,
      optionno: this.dealMainJSON.MasterData.OptionNumber,
      rlsno: this.accRlS[ind].isSteady
        ? Moduledetails.RLSList[0].RLSNumber
        : Moduledetails.RLSList[1].RLSNumber,
      passthroughtype: "P",
      RLSType: this.accRlS[ind].isSteady ? "S" : "T",
      PricingId: this.dealMainJSON.MasterData.PricingId,
      DealHeaderNumber: this.dealOverview.dealHeadernumber,
      currecyCode: this.dealMainJSON.BindHeaderDetail.Currency,
      PeriodSelected: this.period,
      BillingRateSelected: this.billing
    };
    if (
      objectRowData[0].key == "SKILL" ||
      objectRowData[0].key == "ROLE" ||
      objectRowData[0].key == "SERVICELINENAME" ||
      objectRowData[0].key == "BANDCODE"
    ) {
      console.log(objectRowData[0]);
      input.RLSDependentvalue = {
        Servicelinecode: objectRowData[0].data.SERVICELINENAME.id,
        Practicecode:
          objectRowData[0].data.PRACTICENAME.id != -1
            ? objectRowData[0].data.PRACTICENAME.id
            : "0",
        SubPracticecode:
          objectRowData[0].data.SUBPRACTICENAME.id != -1
            ? objectRowData[0].data.SUBPRACTICENAME.id
            : "0",
        Bandcode: "",
        Locationname: "",
        Typecode: "",
        Skillcode: objectRowData[0].data.hasOwnProperty("SKILL")
          ? objectRowData[0].data.SKILL.id != -1
            ? objectRowData[0].data.SKILL.id
            : ""
          : "",
        Rolecode:
          objectRowData[0].key == "ROLE" || objectRowData[0].key == "BANDCODE"
            ? objectRowData[0].data.ROLE.id
            : ""
      };
    } else if (
      objectRowData[0].key == "TYPE" ||
      objectRowData[0].key == "OTHERCOSTCATAGORY"
    ) {
      input.RLSDependentvalue = {
        Servicelinecode: "",
        Practicecode: "",
        SubPracticecode: "",
        Bandcode: "",
        Locationname: "",
        Typecode: objectRowData[0].data.TYPE.id
      };
    }
    this.isLoadingSaveRLS = true;
    this.dealService.getDependentList(input).subscribe(
      Response => {
        console.log(Response, "Response...");
        console.log(objectRowData, "objectRowData...");
        if (Response) {
          this.isLoadingSaveRLS = false;
          if (Response.ReturnFlag == "S") {
            if (
              (objectRowData[0].action == "Skill_changed" &&
                objectRowData[0].key == "ROLE") ||
              (objectRowData[0].action == "InitialLoad" &&
                objectRowData[0].key == "BANDCODE")
            ) {
              objectRowData[0].data.$BANDCODE = this.getBandDrop(
                Response.Output
              );
            } else if (
              objectRowData[0].key == "TYPE" ||
              objectRowData[0].key == "OTHERCOSTCATAGORY"
            ) {
              const Output = Response.Output.filter(item => {
                return item.label != "--Select--";
              });
              console.log(Response.Output, "Output");
              objectRowData[0].data.$OTHERCOSTCATAGORY = this.getDescDrop(
                Output
              );
              // this.configData.OTHERCOSTCATAGORY = this.getDescDrop(Response.Output)
            } else if (
              objectRowData[0].action == "InitialLoad" &&
              objectRowData[0].key == "ROLE"
            ) {
              const Output = Response.Output.filter(function(item) {
                return item.id.trim() != "";
              });
              console.log(Output, "Output");
              objectRowData[0].data.$ROLE = this.getRoleDrop(Output);
            } else if (
              objectRowData[0].key == "SKILL" ||
              objectRowData[0].key == "SERVICELINENAME"
            ) {
              const Output = Response.Output.filter(function(item) {
                return item.id.trim() != "";
              });
              console.log(Output, "Output");
              objectRowData[0].data.$ROLE = this.getRoleDrop(Output);
              // this.configData.ROLE = this.getRoleDrop(Output);
            }
            console.log("Check", this.configData);
          } else {
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        }
      },
      error => {
        this.isLoadingSaveRLS = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  pullOldRLS() {
    const dialog = this.dialog.open(PullRLSPopup, {
      width: "396px"
    });
    dialog.afterClosed().subscribe(Res => {
      console.log("res", Res);
      if (Res) {
        this.oldRLSid = Res;
        this.moduleDetails.Opened = false;
        this.GetModuleDetails(
          this.moduleDetails,
          this.moduleIndex,
          "PULLoldRLS",
          false
        );
      }
    });
  }
  /*Save/Update RLS */
  saveRLS(objData, status) {
    this.isLoadingRLS = true;
    let modDetails = this.moduleDetails;
    console.log("Module details", modDetails);
    console.log("RLS details", objData);
    console.log("acc rls", this.accRlS);
    this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
    let RlSinput: any =
      status == "save"
        ? this.dealjsonservice.saveRLS
        : status == "deleteline"
        ? this.dealjsonservice.DeleteLineRLS
        : null;
    let user = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    objData.forEach(x => {
      x.moduleId = modDetails.ModuleHeader.ModuleID;
    });
    RlSinput.UserInfo = user;
    RlSinput.MasterDataRLS.BillingRateSelected = this.billing;
    RlSinput.MasterDataRLS.PeriodSelected = this.period;
    RlSinput.MasterDataRLS.DealHeaderNumber =
      modDetails.MasterData.DealHeaderNumber;
    RlSinput.MasterDataRLS.PricingId = this.dealMainJSON.MasterData.PricingId.toUpperCase();
    RlSinput.MasterDataRLS.RLSType =
      this.accRlS[this.moduleIndex].isSteady == true ? "S" : "T";
    RlSinput.MasterDataRLS.currecyCode = this.dealMainJSON.BindHeaderDetail.Currency;
    RlSinput.MasterDataRLS.dealid = this.dealOverview.id;
    RlSinput.MasterDataRLS.dealno = modDetails.MasterData.DealHeaderNumber;
    RlSinput.MasterDataRLS.dealversion = this.dealMainJSON.MasterData.DealVersionId;
    RlSinput.MasterDataRLS.moduleid = modDetails.ModuleHeader.ModuleID;
    RlSinput.MasterDataRLS.moduleno = modDetails.ModuleHeader.ModuleNumber;
    RlSinput.MasterDataRLS.moduleversion =
      modDetails.ModuleHeader.ModuleVersion;
    RlSinput.MasterDataRLS.optionid = this.dealMainJSON.MasterData.OptionId;
    RlSinput.MasterDataRLS.optionno = this.dealMainJSON.MasterData.OptionNumber;
    RlSinput.MasterDataRLS.optionversion = this.dealMainJSON.MasterData.OptionVersionId;
    RlSinput.MasterDataRLS.passthroughtype = this.productPass
      ? "P"
      : this.servicePass
      ? "S"
      : this.costPass
      ? "C"
      : "P";
    RlSinput.MasterDataRLS.rlsid = this.accRlS[this.moduleIndex].isSteady
      ? this.getRLSID(modDetails.RLSList, "Steady State")
      : this.getRLSID(modDetails.RLSList, "Transition");
    RlSinput.MasterDataRLS.rlsno = this.accRlS[this.moduleIndex].isSteady
      ? modDetails.RLSList[0].RLSNumber
      : modDetails.RLSList[1].RLSNumber;
    RlSinput.MasterDataRLS.rlsversion = this.accRlS[this.moduleIndex].isSteady
      ? modDetails.RLSList[0].RLSVersion
      : modDetails.RLSList[1].RLSVersion;
    RlSinput.MasterDataRLS.traceoppid = this.dealOverview.oppID;
    if ((this.rlsbtn || this.passthroughbtn) && status == "save") {
      RlSinput.FinalSubmitObject.RLSSubmitFlag = this.rlsbtn ? "Y" : "N";
      RlSinput.FinalSubmitObject.IPSubmitFlag = this.intellectualbtn
        ? "Y"
        : "N";
      RlSinput.FinalSubmitObject.PassthruProductFlag =
        this.passthroughbtn && this.productPass ? "Y" : "N";
      RlSinput.FinalSubmitObject.PassthruServiceFlag =
        this.passthroughbtn && this.servicePass ? "Y" : "N";
      RlSinput.FinalSubmitObject.PassthruOtherCostFlag =
        this.passthroughbtn && this.costPass ? "Y" : "N";
      var RLSsubmitArray: any = this.getRLSsaveOBJ(
        objData,
        RlSinput.FinalSubmitObject,
        RlSinput
      );
      console.log("Finall array", RLSsubmitArray);
      if (this.isrowAdded) {
        RLSsubmitArray.map(x => {
          x.HiddenParams.newRow = true;
        });
      }
      RlSinput.FinalSubmitObject.RLSSubmitObject = this.rlsbtn
        ? RLSsubmitArray
        : [];
      RlSinput.FinalSubmitObject.IPSubmitObject = [];
      RlSinput.FinalSubmitObject.PassthruProductSubmitObject =
        this.passthroughbtn && this.productPass ? RLSsubmitArray : [];
      RlSinput.FinalSubmitObject.PassthruServiceSubmitObject =
        this.passthroughbtn && this.servicePass ? RLSsubmitArray : [];
      RlSinput.FinalSubmitObject.PassthruOtherCostSubmitObject =
        this.passthroughbtn && this.costPass ? RLSsubmitArray : [];
      this.dealService.SaveRLS(RlSinput).subscribe(
        res => {
          if (res.ReturnFlag == "S") {
            if (res.Output) {
              res.Output = JSON.parse(res.Output);
              if (res.Output.SuccessFlag == "S") {
                this.dealService.UpdateExistingDealsStore();
                this.dealService.updateModuleListStore();
                this.isrowAdded = false;
                this._error.throwError(res.Output.Message);
                if (res.Output.RLSError.Warnings.length > 0) {
                  var message: any =
                    "Warning:" +
                    " " +
                    res.Output.RLSError.Warnings[0].WaringsMessage;
                  setTimeout(() => {
                    this._error.throwError(message);
                  }, 1000);
                }
              } else {
                this.isLoadingRLS = false;
                this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
                  this.moduleIndex
                ].rlsTable;
                let checkedRow: [] = this.accRlS[this.moduleIndex].rlsTable.map(
                  x => {
                    if (x.isCheccked == true) {
                      return x;
                    }
                  }
                );
                checkedRow.length > 0
                  ? (this.isrowAdded = true)
                  : (this.isrowAdded = false);
                this.accRlS[this.moduleIndex].rlsTable.map(x => {
                  x.isRowEditable = x.RowEditable == true ? true : false;
                  x.isCheccked = x.isCheccked == true ? true : false;
                  x.isNewRow = true;
                });
                this.accRlS[this.moduleIndex].tableTotalCount = this.accRlS[
                  this.moduleIndex
                ].rlsTable.length;
                this._error.throwError(
                  res.Output.RLSError.Error[0].ErrorMessage
                );
              }
            } else {
              this.isLoadingRLS = false;
              this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
                this.moduleIndex
              ].rlsTable;
              let checkedRow: [] = this.accRlS[this.moduleIndex].rlsTable.map(
                x => {
                  if (x.isCheccked == true) {
                    return x;
                  }
                }
              );
              checkedRow.length > 0
                ? (this.isrowAdded = true)
                : (this.isrowAdded = false);
              this.accRlS[this.moduleIndex].rlsTable.map(x => {
                x.isRowEditable = x.RowEditable == true ? true : false;
                x.isCheccked = x.isCheccked == true ? true : false;
                x.isNewRow = true;
              });
              this.accRlS[this.moduleIndex].tableTotalCount = this.accRlS[
                this.moduleIndex
              ].rlsTable.length;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          } else {
            this.isLoadingRLS = false;
            this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
              this.moduleIndex
            ].rlsTable;
            let checkedRow: [] = this.accRlS[this.moduleIndex].rlsTable.map(
              x => {
                if (x.isCheccked == true) {
                  return x;
                }
              }
            );
            checkedRow.length > 0
              ? (this.isrowAdded = true)
              : (this.isrowAdded = false);
            this.accRlS[this.moduleIndex].rlsTable.map(x => {
              x.isRowEditable = x.RowEditable == true ? true : false;
              x.isCheccked = x.isCheccked == true ? true : false;
              x.isNewRow = true;
            });
            this.accRlS[this.moduleIndex].tableTotalCount = this.accRlS[
              this.moduleIndex
            ].rlsTable.length;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        },
        error => {
          this.isLoadingRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
    } else if (this.intellectualbtn && status == "save") {
      var passthroughSubmit: any = this.getPassOBJ(objData);
      console.log("IP submit obj", passthroughSubmit);
      RlSinput.FinalSubmitObject.IPSubmitFlag = this.intellectualbtn
        ? "Y"
        : "N";
      RlSinput.FinalSubmitObject.IPSubmitObject = passthroughSubmit;
      this.dealService.SaveIP(RlSinput).subscribe(
        Res => {
          if (Res) {
            if (Res.ReturnFlag == "S") {
              this.isrowAdded = false;
              this._error.throwError(Res.Output.Message);
              // this.dealService.UpdateExistingDealsStore();
              // this.dealService.updateModuleListStore();
              if (Res.Output.IPLineItemDataList.IPLineItemData.length > 0) {
                this.accRlS[this.moduleIndex].showAddbutton = false;
                this.isLoadingRLS = false;
                this.accRlS[this.moduleIndex].rlsTable = this.getmappedIP(
                  Res.Output.IPLineItemDataList.IPLineItemData
                );
                console.log("Table", this.accRlS[this.moduleIndex].rlsTable);
                this.accRlS[this.moduleIndex].tableTotalCount = this.accRlS[
                  this.moduleIndex
                ].rlsTable.length;
              } else {
                this.isLoadingRLS = false;
                this.accRlS[this.moduleIndex].showAddbutton = true;
                if (
                  this._validate.validate(this.billing) &&
                  this._validate.validate(this.period)
                ) {
                  this.accRlS[this.moduleIndex].Isbilled = true;
                } else {
                  this.accRlS[this.moduleIndex].Isbilled = false;
                }
              }
            } else {
              this.isLoadingRLS = false;
              this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
                this.moduleIndex
              ].rlsTable;
              this.isrowAdded = true;
              this.accRlS[this.moduleIndex].rlsTable.map(x => {
                x.isRowEditable = true;
                x.isCheccked = true;
                x.isNewRow = true;
              });
              this.accRlS[this.moduleIndex].tableTotalCount = this.accRlS[
                this.moduleIndex
              ].rlsTable.length;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          }
        },
        error => {
          this.isLoadingRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
      console.log("IP array", passthroughSubmit);
    } else if ((this.rlsbtn || this.passthroughbtn) && status == "deleteline") {
      RlSinput.FinalDeleteObject.RLSSubmitFlag = this.rlsbtn ? "Y" : "N";
      RlSinput.FinalDeleteObject.IPSubmitFlag = this.intellectualbtn
        ? "Y"
        : "N";
      RlSinput.FinalDeleteObject.PassthruProductFlag =
        this.passthroughbtn && this.productPass ? "Y" : "N";
      RlSinput.FinalDeleteObject.PassthruServiceFlag =
        this.passthroughbtn && this.servicePass ? "Y" : "N";
      RlSinput.FinalDeleteObject.PassthruOtherCostFlag =
        this.passthroughbtn && this.costPass ? "Y" : "N";
      var RLSsubmitArray: any = this.getDeleteLineObj(objData);
      console.log("Finall array", RLSsubmitArray);
      RlSinput.FinalDeleteObject.RLSSubmitObject = this.rlsbtn
        ? RLSsubmitArray
        : [];
      RlSinput.FinalDeleteObject.PassthruProductSubmitObject =
        this.passthroughbtn && this.productPass ? RLSsubmitArray : [];
      RlSinput.FinalDeleteObject.PassthruServiceSubmitObject =
        this.passthroughbtn && this.servicePass ? RLSsubmitArray : [];
      RlSinput.FinalDeleteObject.PassthruOtherCostSubmitObject =
        this.passthroughbtn && this.costPass ? RLSsubmitArray : [];
      this.dealService.DeleteRLSline(RlSinput).subscribe(
        Response => {
          if (Response.ReturnFlag == "S") {
            this._error.throwError(Response.Output.Message);
            if (Response.Output.SuccessFlag == "S") {
              this.dealService.UpdateExistingDealsStore();
              this.dealService.updateModuleListStore();
            } else {
              this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
                this.moduleIndex
              ].rlsTable;
              this.isrowAdded = true;
              this.accRlS[this.moduleIndex].rlsTable.map(x => {
                x.isRowEditable = true;
                x.isCheccked = true;
                x.isNewRow = true;
              });
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          } else {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        },
        error => {
          this.isLoadingRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
    } else if (this.intellectualbtn && status == "deleteline") {
      RlSinput.FinalDeleteObject.RLSSubmitFlag = this.rlsbtn ? "Y" : "N";
      RlSinput.FinalDeleteObject.IPSubmitFlag = this.intellectualbtn
        ? "Y"
        : "N";
      RlSinput.FinalDeleteObject.PassthruProductFlag =
        this.passthroughbtn && this.productPass ? "Y" : "N";
      RlSinput.FinalDeleteObject.PassthruServiceFlag =
        this.passthroughbtn && this.servicePass ? "Y" : "N";
      RlSinput.FinalDeleteObject.PassthruOtherCostFlag =
        this.passthroughbtn && this.costPass ? "Y" : "N";
      var RLSsubmitArray: any = this.getPassOBJ(objData);
      console.log("Finall array", RLSsubmitArray);
      RlSinput.FinalDeleteObject.RLSSubmitObject = this.rlsbtn
        ? RLSsubmitArray
        : [];
      RlSinput.FinalDeleteObject.IPLIDisplayIDsList = RLSsubmitArray;
      RlSinput.FinalDeleteObject.IPSubmitObject = RLSsubmitArray;
      RlSinput.FinalDeleteObject.PassthruProductSubmitObject =
        this.passthroughbtn && this.productPass ? RLSsubmitArray : [];
      RlSinput.FinalDeleteObject.PassthruServiceSubmitObject =
        this.passthroughbtn && this.servicePass ? RLSsubmitArray : [];
      RlSinput.FinalDeleteObject.PassthruOtherCostSubmitObject =
        this.passthroughbtn && this.costPass ? RLSsubmitArray : [];
      this.dealService.DeleteIPline(RlSinput).subscribe(
        Response => {
          if (Response.ReturnFlag == "S") {
            this._error.throwError(Response.Output.Message);
            if (Response.Output.SuccessFlag == "S") {
              this.dealService.UpdateExistingDealsStore();
              this.dealService.updateModuleListStore();
              // this.Getmoduledeatils(this.moduleDetails, this.moduleIndex, "INTEL", false);
            } else {
              this.accRlS[this.moduleIndex].rlsTable = this.accRlS[
                this.moduleIndex
              ].rlsTable;
              this.isrowAdded = true;
              this.accRlS[this.moduleIndex].rlsTable.map(x => {
                x.isRowEditable = true;
                x.isCheccked = true;
                x.isNewRow = true;
              });
              this.isLoadingRLS = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          } else {
            this.isLoadingRLS = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        },
        error => {
          this.isLoadingRLS = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
    }
  }
  getDeleteLineObj(objData: any): any {
    let finalarray = [];
    objData.map(x => {
      let rlSubmitObj = {
        HiddenParams: {
          lidisplayid: x.lidisplayid,
          rlsno: x.rlsno,
          RowEditable: x.isRowEditable
        }
      };
      finalarray.push(rlSubmitObj);
    });
    return finalarray;
  }
  getPassOBJ(objData: any): any {
    let finalarray = [];
    objData.forEach(function(objectToFilter) {
      let rowData = [];
      var IPobj: any = {};
      for (var prop in objectToFilter) {
        rowData.push(prop);
      }
      if (rowData.length > 0) {
        rowData.forEach(x => {
          let str = x.toString();
          if (
            !str.includes("_") &&
            !str.includes("&") &&
            !str.includes("%") &&
            str != "undefined"
          ) {
            if (
              str == "IPType" ||
              str == "ModuleCode" ||
              str == "ProductCode"
            ) {
              IPobj[x] = objectToFilter[x].id;
              if (str == "IPType") {
                IPobj["SelectedIPTypeCode"] = objectToFilter[x].id;
              } else if (str == "ModuleCode") {
                IPobj["SelectedModuleCode"] = objectToFilter[x].id;
              } else if (str == "ProductCode") {
                IPobj["SelectedProductCode"] = objectToFilter[x].id;
              }
            } else if (
              str != "index" &&
              str != "isCheccked" &&
              str != "SelectedProductCode" &&
              str != "SelectedModuleCode" &&
              str != "SelectedIPTypeCode" &&
              str != "isNewRow" &&
              str != "isRowEditable" &&
              str != "IsRowError"
            ) {
              IPobj[x] = objectToFilter[x];
            }
          }
        });
      }
      finalarray.push(IPobj);
    });
    return finalarray;
  }
  /*Existing Deals Store updating for all actions on RLS*/
  getExistingDeals() {
    var inputData = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      Params: {
        MaxCount: "500"
      },
      Items: [],
      spParams: {}
    };
    this.dealService.getExistingDeals(inputData).subscribe(
      res => {
        if (res) {
          if (res.ReturnCode == "S") {
            this.store.dispatch(
              new ExistingListAction({ existingDealslist: res.Output.DealList })
            );
          } else {
            this._error.throwError(res.ReturnMessage);
          }
        } else {
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      },
      error => {
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        console.log("Error-->", error);
      }
    );
  }
  /*Generic method ->get mapped API input for saving RLS/Passthrough/Intellectual*/
  getRLSsaveOBJ(objData: any, isRLS, RlSinput) {
    console.log(objData, "objData");
    console.log(isRLS, "isRLSisRLS");
    console.log(RlSinput, "RlSinput");
    console.log("DealRSLdata", this.DealRSLdata);
    let finalarray = [];
    this.accRlS.map(function(rls) {
      objData.map(function(objectToFilter) {
        let index = JSON.stringify(objectToFilter.index);
        console.log(index);
        if (rls.moduleId == objectToFilter.moduleId) {
          let rlSubmitObj = {
            HiddenParams: {
              lidisplayid: 0,
              rlsno: "",
              newRow: false
            },
            data: []
          };
          if (isRLS.RLSSubmitFlag == "Y") {
            rlSubmitObj.data.push({
              code: index,
              elementID: "SLNO",
              elementType: "LBNE",
              mandFlag: "N",
              value: index
            });
          } else if (isRLS.PassthruProductFlag == "Y") {
            rlSubmitObj.data.push({
              code: index,
              elementID: "PRODUCTSLNO",
              elementType: "LBNE",
              mandFlag: "N",
              value: index
            });
          } else if (isRLS.PassthruServiceFlag == "Y") {
            rlSubmitObj.data.push({
              code: index,
              elementID: "SERVICESLNO",
              elementType: "LBNE",
              mandFlag: "N",
              value: index
            });
          } else if (isRLS.PassthruOtherCostFlag == "Y") {
            rlSubmitObj.data.push({
              code: index,
              elementID: "OTHERCOSTSLNO",
              elementType: "LBNE",
              mandFlag: "N",
              value: index
            });
          }
          rlSubmitObj.HiddenParams.lidisplayid =
            objectToFilter.lidisplayid || 0;
          rlSubmitObj.HiddenParams.rlsno = objectToFilter.rlsno;
          let rowData = [];
          for (var prop in objectToFilter) {
            rowData.push(prop);
          }
          // console.log('rowData', rowData)
          if (rowData.length > 0) {
            rowData.forEach(x => {
              rls.RLSeHeader.forEach(y => {
                if (
                  x == y.name &&
                  ((!x.includes("$") &&
                    !x.includes("&") &&
                    !x.includes("%") &&
                    !x.includes("_")) ||
                    x == "GCG_CATNAME")
                ) {
                  if (
                    y.controltype == "select" ||
                    y.controltype == "autocomplete" ||
                    y.controltype == "cascadingDrop" ||
                    y.controltype == "cascadingAuto"
                  ) {
                    let Dataobj = {
                      value: objectToFilter[x].name,
                      code:
                        objectToFilter[x].id == -1 ||
                        objectToFilter[x].id == "NA"
                          ? ""
                          : objectToFilter[x].id,
                      elementID: y.name,
                      elementType: y.elementType,
                      mandFlag: y.mandFlag
                    };
                    rlSubmitObj.data.push(Dataobj);
                  } else {
                    let Dataobj = {
                      value: objectToFilter[x],
                      code: objectToFilter[x],
                      elementID: y.name,
                      elementType: y.elementType,
                      mandFlag: y.mandFlag
                    };
                    rlSubmitObj.data.push(Dataobj);
                  }
                }
              });
            });
          }
          finalarray.push(rlSubmitObj);
        }
      });
    });
    return finalarray;
  }
  // reduce(arr)
  // {
  //    arr.map (x=>
  //    {
  //      let str : string = x.ModuleParameters.ModuleDiscount;
  //      let myarr = str.split('.');
  //      str = myarr[0] + '.' + myarr[1].substring(0,2);
  //      x.ModuleParameters.ModuleDiscount = str; 
  //    });
  //    console.log('mod arr',arr);
  //    return arr;
  // }

  regxforDecimal(value) {
    var str = value.toString();
    var regx = /^(\d*\.)?\d+$/gim;
    if (regx.test(str)) {
      console.log("True");
      this.notValid = false;
    } else {
      console.log("False");
      this.notValid = true;
    }
  }
  ChangedGMParams(GMdata, type) {
    if (this.discount) {
      debugger;
      switch (type) {
        case "D1x":
          if (Number(GMdata.DATA) >= 0) {
            GMdata.DATA = Number(GMdata.DATA) - 1;
          }
          break;
        case "D5x":
          if (Number(GMdata.DATA) >= 5) {
            GMdata.DATA = Number(GMdata.DATA) - 5;
          }
          break;
        case "I1x":
          GMdata.DATA = Number(GMdata.DATA) + 1;
          break;
        case "I5x":
          GMdata.DATA = Number(GMdata.DATA) + 5;
          break;
        case "refresh":
          GMdata.DATA = Number(GMdata.MasterData);
          break;
        default:
          break;
      }
    } else {
      return;
    }
  }
  //Co-owner pop up
  OpenOwnersList(moduledetails) {
    // console.log('List',this.Cowners,moduledetails)
    var cownersList = [];
    for (let index = 0; index < this.Cowners.length; index++) {
      if (this.Cowners[index].ModuleID == moduledetails.moduleId) {
        cownersList = this.Cowners[index].ModuleTeam;
      }
    }
    console.log("Co list", cownersList);
    const dialogRef = this.dialog.open(coOwnersPopComponent, {
      width: "396px",
      data: {
        list: cownersList
      }
    });
  }
  //download RLS template
  downloadTemplate() {
    console.log("Downloaded RLS Template-->");
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber,
        DealID: this.dealOverview.id
      }
    };
    this.dealService.downloadFileRLS(input).subscribe(
      res => {
        if (res.ReturnCode == "S") {
          let url = res.Output;
          let a = document.createElement("a");
          a.href = url;
          document.body.appendChild(a);
          a.click();
        } else {
          this._error.throwError(res.ReturnMessage);
        }
      },
      error => {
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  //Set module id to service variable n Navigate to Upload RLS component
  UploadRLS(moduleDetails) {
    console.log("Module", moduleDetails);
    this.dealService.uploadRLSID = moduleDetails.ModuleHeader.ModuleID;
    this.router.navigateByUrl(
      "/deals/existingTabs/commercial/commlanding/uploadRLS"
    );
  }
  savecriteria() {
    console.log(this.dealCriteria, "saved criteria...");
  }
  //Mapping response into dynamic object
  getMappedData(array) {
    console.log(array, "checkout array..");
    let index = 1;
    let i = 0;
    array.map(x => {
      let modulename = x.ModuleHeader.ModuleName.split("(");
      x.title1 = "Module" + " " + x.ModuleHeader.ModuleNumber;
      x.title2 = modulename[0];
      x.title3 = this.Cowners[i].ModuleOwner.EmployeeName;
      x.moduleId = x.ModuleHeader.ModuleID;
      x.expanded = false;
      x.panelOpenState3 = false;
      x.Opened = false;
      x.rlsTable = [];
      x.RLSeHeader = [];
      x.tableTotalCount = 0;
      x.showAddbutton = true;
      x.Isbilled = true;
      x.submitted = false;
      x.isSteady = true;
      this.accRlS.push(x);
      index = index + 1;
      i = i + 1;
    });

    //this.accRlS =  this.reduce(this.accRlS);
    if(this.rlsbtn)
    {
      this.showRLS(this.accRlS[this.moduleIndex],this.moduleIndex);
    }
    else if(this.passthroughbtn)
    { 
      this.showPassthrough(this.accRlS[this.moduleIndex],this.moduleIndex);
    }
  }
  ngOnDestroy() {
    this.subcriber$.unsubscribe();
    this.subcriberRLS$.unsubscribe();
    this.subcriber$.unsubscribe();
    this.subcriberPass$.unsubscribe();
    this.modulesubscription$.unsubscribe();
    this.pastDeal$.unsubscribe();
  }
  /*UI/UX Variables*/

  fields: {}[] = [
    {
      title: "Asset takeover",
      value: "fgfgfhg"
    },
    {
      title: "People takeover"
    },
    {
      title: "MSA discount"
    },
    {
      title: "Payments terms as per MSA"
    },
    {
      title: "Niche skill discount(%)"
    },
    {
      title: "Unbilled revenue"
    },
    {
      title: "Bay area rate discount"
    },
    {
      title: "Bay area OM discount"
    },
    {
      title: "Deal discount(%)"
    },
    {
      title: "Volume discount"
    },
    {
      title: "Payment terms (in days) *"
    }
  ];

  inflation = [1, 2, 3, 4, 5, 6];

  accRlS: any = [];

  mParameters = [1, 2, 3, 4, 5, 6];

  inflationRLS = [1, 2, 3, 4, 5, 6];
  factors: {}[] = [
    {
      price: "GM%",
      classy: "Offshore",
      type: "%"
    },
    {
      price: "GM%",
      classy: "Offshore",
      type: "%"
    }
  ];
  /*UI/UX codes*/
  showRLS(moduleDetails, index) {
    this.rlsbtn = true;
    this.isPass=false;
    this.passthrough = false;
    this.intellectual = false;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "RLS", false);
  }
  showPassthrough(moduleDetails, index) {
    console.log(moduleDetails, "moduleDetails");
    console.log(index, "index");
    this.rlsbtn = false;
    this.isPass=true;
    this.passthrough = true;
    this.intellectual = false;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "PASS", false);
  }
  showIntellectual(moduleDetails, index) {
    this.rlsbtn = false;
    this.isPass=false;
    this.passthrough = false;
    this.intellectual = true;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "INTEL", false);
  }
  showProduct(moduleDetails, index) {
    this.productPass = true;
    this.servicePass = false;
    this.costPass = false;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "PASS", false);
  }
  showServicePass(moduleDetails, index) {
    this.productPass = false;
    this.servicePass = true;
    this.costPass = false;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "PASS", false);
  }
  showCost(moduleDetails, index) {
    this.productPass = false;
    this.servicePass = false;
    this.costPass = true;
    moduleDetails.Opened = false;
    this.GetModuleDetails(moduleDetails, index, "PASS", false);
  }
  getRLSID(RLSlist, state) {
    let rlsid = "";
    RLSlist.map(x => {
      if (state == x.RLSName) {
        rlsid = x.RLSId;
      }
    });
    return rlsid;
  }
  // rls table starts
  rlsTable = [];
  seed: {}[] = [
    { id: 1, name: "Face to Face" },
    { id: 2, name: "Skype" },
    { id: 3, name: "WebEX" }
  ];
  serviceLyn: {}[] = [
    { id: 1, name: "Face to Face" },
    { id: 2, name: "Skype" },
    { id: 3, name: "WebEX" }
  ];
  billability: {}[] = [
    { id: 1, name: "Billable" },
    { id: 2, name: "Billable1" },
    { id: 3, name: "Billable2" }
  ];
  location: {}[] = [
    { id: 1, name: "India-Bangalore" },
    { id: 2, name: "India-Chennai" },
    { id: 3, name: "India-Kochi" }
  ];
  city: {}[] = [
    { id: 1, name: "Bangalore" },
    { id: 2, name: "Chennai" },
    { id: 3, name: "Kochi" }
  ];
  role: {}[] = [
    { id: 1, name: "Roll" },
    { id: 2, name: "Roll1" },
    { id: 3, name: "Roll2" }
  ];
  band: {}[] = [
    { id: 1, name: "Band" },
    { id: 2, name: "Band1" },
    { id: 3, name: "Band2" }
  ];
  totalexp: {}[] = [
    { id: 1, name: "Exp" },
    { id: 2, name: "Exp1" },
    { id: 3, name: "Exp2" }
  ];
  practice: {}[] = [
    { id: 1, name: "Practice" },
    { id: 2, name: "Practice1" },
    { id: 3, name: "Practice2" }
  ];

  // rls table ends

  // product table starts
  productTable = [];
  category: {}[] = [
    { id: 1, name: "Communication link" },
    { id: 2, name: "Communication link1" },
    { id: 3, name: "Communication link2" }
  ];

  servlyn: {}[] = [
    { id: 1, name: "Mas" },
    { id: 2, name: "Mas1" },
    { id: 3, name: "Mas2" }
  ];

  practisepass: {}[] = [
    { id: 1, name: "Microsoft" },
    { id: 2, name: "Microsoft1" },
    { id: 3, name: "Microsoft2" }
  ];

  // product table starts

  // intellectualTable table starts
  intellectualTable = [];
  iptype: {}[] = [
    { id: 1, name: "Focused product all" },
    { id: 2, name: "Focused product all1" },
    { id: 3, name: "Focused product all2" }
  ];
  product: {}[] = [
    { id: 1, name: "Agent recommender" },
    { id: 2, name: "Agent recommender1" },
    { id: 3, name: "Agent recommender2" }
  ];
  module: {}[] = [
    { id: 1, name: "Module name" },
    { id: 2, name: "Module name1" },
    { id: 3, name: "Module name2" }
  ];

  // intellectualTable table ends
  configData: any = {};
}

@Component({
  selector: "coOwnersPop",
  templateUrl: "./coOwnersPop.html"
})
export class coOwnersPopComponent {
  constructor(
    public dialogRef: MatDialogRef<coOwnersPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nameList = this.data.list;
  }

  nameList: {}[] = [];
}
@Component({
  selector: "saveAlert",
  templateUrl: "./saveAlertpop.html",
  styleUrls: ["./deal-criteria.component.scss"]
})
export class saveAlert {
  isDelete: boolean = false;
  isSave: boolean = false;
  isIPSave: boolean = false;
  isDeleteLine: boolean = false;
  isRevert: boolean = false;
  isProceed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<coOwnersPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.status == "isDelete") {
      this.isDelete = true;
      this.isSave = false;
      this.isDeleteLine = false;
      this.isRevert = false;
      this.isProceed = false;
      this.isIPSave = false;
    } else if (this.data.status == "isSave") {
      this.isDelete = false;
      this.isSave = true;
      this.isDeleteLine = false;
      this.isRevert = false;
      this.isProceed = false;
      this.isIPSave = false;
    } else if (this.data.status == "isDeleteLine") {
      this.isDelete = false;
      this.isSave = false;
      this.isDeleteLine = true;
      this.isRevert = false;
      this.isProceed = false;
      this.isIPSave = false;
    } else if (this.data.status == "isRevert") {
      this.isDelete = false;
      this.isSave = false;
      this.isDeleteLine = false;
      this.isRevert = true;
      this.isProceed = false;
      this.isIPSave = false;
    } else if (this.data.status == "isProceed") {
      this.isDelete = false;
      this.isSave = false;
      this.isDeleteLine = false;
      this.isRevert = false;
      this.isProceed = true;
      this.isIPSave = false;
    } else if (this.data.status == "isIPSave") {
      this.isDelete = false;
      this.isSave = false;
      this.isDeleteLine = false;
      this.isRevert = false;
      this.isProceed = false;
      this.isIPSave = true;
    }
  }
}
@Component({
  selector: "app-pull-rls",
  templateUrl: "./rls-popup.html",
  styleUrls: ["./deal-criteria.component.scss"]
})
export class PullRLSPopup {
  /****************** Conversation Name autocomplete code start ****************** */
  showConversation: boolean = false;
  searchBy: number = 1;
  id: any = "";
  pricing: any = "";
  isLoading: boolean = false;
  PricingList: any = [];
  PricingNewList:any = []
  ModuleList: any = [];
  Conversation: string = "";
  ConversationNameSwitch: boolean = true;
  RLSlist: any = [];
  RlsID: any = "";
  moduleId: any = "";
  constructor(
    private dealService: dealService,
    public dialogRef: MatDialogRef<coOwnersPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dealjsonservice: DealJsonService,
    public _error: ErrorMessage
  ) {}
  ngOnInit() {}
  ConversationNameclose() {
    this.ConversationNameSwitch = false;
  }
  appendConversation(value: string) {
    this.Conversation = value;
    this.ConversationNameSwitch = true;
  }
  clear()
  {
    this.id = "" ;
    this.pricing = "" ;
    this.moduleId = "" ;
    this.RlsID = "" ;
    this.PricingList = [];
    this.ModuleList = [];
    this.PricingNewList = [];
  }
  getData() {
    this.isLoading = true;
    let obj = {
      Searchby:
        this.searchBy == 1 
          ? "OppId"
          : this.searchBy == 2
          ? "AmndNo"
          : "PricingID",
      SearchValue: this.id
    };
    this.dealService.PulloldRLSData(obj).subscribe(
      Response => {
        if (Response) {
          console.log("Response", Response);
          this.isLoading = false;
          if (Response.Output.ReturnFlag == "S") {
            this.PricingList = [];
            this.ModuleList = [];
            this.PricingNewList = [];
            this.PricingList = Response.Output.PullOldRLSDataObjectList;
            this.PricingNewList = Response.Output.PullOldRLSDataObjectList.reduce(function(previous, current) {
              var object = previous.filter(object => object.PricingID === current.PricingID);
              if (object.length == 0) {
                previous.push(current);
              }
              return previous;
            }, []);
          } else {
            this._error.throwError(Response.Output.ReturnMsg);
          }
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  populateModule() {
    this.ModuleList = [];
    this.RLSlist = [];
    this.RlsID = "";
    this.moduleId = "";
    this.PricingList.map(x => {
      if (x.PricingID == this.pricing) {
        this.ModuleList.push(x);
      }
    });
  }
  populateRLS() {
    this.RLSlist = [];
    this.RlsID = "";
    this.PricingList.map(x => {
      if (x.PricingID == this.pricing && x.ModuleId == this.moduleId) {
        this.RLSlist.push(x);
      }
    });
  }
  loadLRS(status: boolean) {
    if (status) {
      if (this.RlsID != "") {
        this.dialogRef.close(this.RlsID);
      } else {
        this._error.throwError("Please fill required fields.");
      }
    } else {
      this.dialogRef.close();
    }
  }
  Conversations: {}[] = [
    {
      index: 0,
      contact: "Anubhav Jain",
      designation: "Pre Sales Head",
      initials: "AJ",
      value: true
    },
    {
      index: 1,
      contact: "Kanika Tuteja",
      designation: "Pre Sales Head",
      initials: "KT",
      value: false
    },
    {
      index: 2,
      contact: "Anubhav Jain",
      designation: "Pre Sales Head",
      initials: "AJ",
      value: false
    },
    {
      index: 3,
      contact: "Kanika Tuteja",
      designation: "Pre Sales Head",
      initials: "KT",
      value: false
    }
  ];
  selectedConversation: {}[] = [];

  /****************** Conversation Name autocomplete code end ****************** */
}
