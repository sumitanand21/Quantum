import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
  DataCommunicationService,
  ErrorMessage,
  OnlineOfflineService
} from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MatSnackBarConfig
} from "@angular/material";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Observable, Subscription } from "rxjs";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { AppState } from "@app/core/state";
import { Store, select } from "@ngrx/store";
import { calculate } from "@app/core/state/selectors/deals/calculate.selector";
import {
  DealParameterListAction,
  calculateDeals
} from "@app/core/state/actions/deals.actions";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { Router } from "@angular/router";
import { FacadeService } from "@app/core/services/facade.service";
import { MessageService } from "@app/core/services/deals/deals-observables.service";

@Component({
  selector: "app-calculate",
  templateUrl: "./calculate.component.html",
  styleUrls: ["./calculate.component.scss"]
})
export class CalculateComponent implements OnInit, OnDestroy {
  panelOpenState;
  panelOpenState1;
  panelOpenState2;
  panelOpenState3;
  panelOpenState4;
  wcsTable = [];
  DealContractTable = [];
  isLoading: boolean = false;
  isDummyLoader: boolean = false;
  dealCurrencyHeader: string;
  calculationGridData: any;
  calculationListData: any;
  moduleDetails: any;
  benchMarkArray: any;
  dealCalculateInput: any;
  curncy: {}[] = [];
  agencytype: {}[] = [];
  dealOverview: any;
  checked: boolean = true;
  moduleHeaderDetails: any;
  calculateModuleTable: any;
  calculateTableList: any;
  showContent: boolean = false;
  tableVisibility: boolean = true;
  Submit: number = 0;
  Submit1: number = 0;
  validation: any;
  disable: boolean = false;
  calculateDeal$: Subscription = new Subscription();
  combinedResponse$: Subscription = new Subscription();
  getFillManageParams$: Subscription = new Subscription();
  tableTotalCount: number = 0;
  DealContractRequestBody = {
    PageSize: 10,
    RequestedPageNumber: 1,
    OdatanextLink: ""
  };
  tableTotalCountWcs: number = 0;
  WCSRequestBody = {
    PageSize: 10,
    RequestedPageNumber: 1,
    OdatanextLink: ""
  };
  configData = {
    curncy: [],
    agencytype: []
  };
  userInfo: any;
  savedObject: any;
  moduleInfo: any;
  contractorVisibility: boolean = true;
  savedWCSData: any;
  dealOwnerAccess: boolean;
  moduleOwnerAccess: boolean;
  dealTeamAccess: boolean;
  moduleTeamAccess: boolean;
  configSuccess: MatSnackBarConfig = {
    duration: 5000
  };
  calculateDealResponse: any;
  getContractorWCSSalaryResponse: any;
  calculateModuleResponse: any;
  moduleStatus: any;
  role: boolean = false;
  originUrl: string = "";
  pastDeal$: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    public service: DataCommunicationService,
    private deals: dealService,
    public onlineOfflineService: OnlineOfflineService,
    private inputService: DealJsonService,
    public store: Store<AppState>,
    public popUp: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public encrDecrService: EncrDecrService,
    public validate: ValidateforNullnUndefined,
    public router: Router,
    private roleCheck: FacadeService,
    private message: MessageService
  ) {
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log('message inside the calculate-->', message);
      this.originUrl = message.originUrl;
    })  
  }
  async ngOnInit() {
    let dealOverview = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("Dealoverview"),
      "DecryptionDecrip"
    );
    this.dealOverview = JSON.parse(dealOverview);
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    let role = this.roleCheck.dealRoleService
    let moduleOwner = role.moduleOwner.IsRoleMappedToUser
    let moduleTeam = role.dealOwner.IsRoleMappedToUser
    if((moduleOwner || moduleTeam)) {
      this.role = true
    } else {
      this.role = false;
    }
    this.combinedResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(async res => {
        console.log("store res-->", res);
        if (res.ModuleList != undefined) {
          this.moduleInfo = res.ModuleList[0].Output;
          this.moduleHeaderDetails = res.ModuleList[1].Output;
          this.validation = res.ModuleList[1].Output.ValidationFlag;
          let moduleList = res.ModuleList[1].Output.ModuleList;
          if (moduleList.length > 0) {
            let moduleStatus = moduleList[0].Status;
            this.moduleStatus = moduleStatus;
          }
        } else {
          if (this.onlineOfflineService.isOnline) {
            const CacheResponse = await this.deals.getModuleListCacheData();
            console.log("CacheResponse-->", CacheResponse);
            if (CacheResponse != undefined) {
              this.moduleInfo = CacheResponse.data[0].Output;
              if (CacheResponse.data[1].length > 0) {
                this.moduleHeaderDetails = CacheResponse.data[1].Output;
                this.validation = CacheResponse.data[1].Output.ValidationFlag;
                let moduleList = CacheResponse.data[1].Output.ModuleList;
                if (moduleList.length > 0) {
                  let moduleStatus = moduleList[0].Status;
                  this.moduleStatus = moduleStatus;
                }
              }
            }
          }
        }
      });
    if (this.moduleHeaderDetails != undefined) {
      this.calculateDeal$ = this.store.pipe(select(calculate)).subscribe(
        res => {
          console.log("store res for calculate deal-->", res);
          if (res.calculateDeal != undefined) {
            this.isLoading = false;
            console.log("response from the store-->", res.calculateDeal);
            this.calculateTableList = [res.calculateDeal[0]];
            this.calculationGridData = res.calculateDeal[0].Calculate.GridData;
            this.calculateModuleTable = res.calculateDeal[1];
            this.calculateModuleTable.forEach(element => {
              element.isChecked = true;
            });
            if (
              res.calculateDeal[0].ReturnFlag == "S" ||
              res.calculateDeal[0].RLSContractWCSSalary
            ) {
              this.wcsTable = this.GetMappedData(
                res.calculateDeal[0].RLSContractWCSSalary
              );
              this.DealContractTable = this.GetMappedDataForContractor(
                res.calculateDeal[0].RLSContractWCSSalary
              );
            } else {
              this.wcsTable = this.GetMappedData([]);
              this.DealContractTable = this.GetMappedDataForContractor([]);
            }
            this.WCSRequestBody.PageSize = this.wcsTable.length;
            this.tableTotalCountWcs = this.wcsTable.length;
            this.DealContractRequestBody.PageSize = this.DealContractTable.length;
            this.tableTotalCount = this.DealContractTable.length;
          } else {
            if (this.onlineOfflineService.isOnline) {
              this.DealCalculation();
            }
          }
        },
        () => {
          this.DealCalculation();
        }
      );
    } else {
      this.router.navigate(["/deals/existingTabs/overview"]);
    }
    // Offline
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getCalculateCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          console.log("cached response from the db-->", CacheResponse.data);
          this.calculateTableList = [CacheResponse.data[0].Output];
          this.calculationGridData =
            CacheResponse.data[0].Output.Calculate.GridData;
          this.calculateModuleTable =
            CacheResponse.data[1].Output.ModuleCalculatedDataList;
          this.calculateModuleTable.forEach(element => {
            element.isChecked = true;
          });
          this.wcsTable = this.GetMappedData(
            CacheResponse.data[0].Output.RLSContractWCSSalary
          );
          this.DealContractTable = this.GetMappedDataForContractor(
            CacheResponse.data[0].Output.RLSContractWCSSalary
          );
          this.WCSRequestBody.PageSize = this.wcsTable.length;
          this.tableTotalCountWcs = this.wcsTable.length;
          this.DealContractRequestBody.PageSize = this.DealContractTable.length;
          this.tableTotalCount = this.DealContractTable.length;
        }
      }
    }
  }
  GetModuleIds() {
    let Output = [];
    this.moduleHeaderDetails.ModuleList.map(x => {
      if (x.ModuleID) {
        Output.push(x.ModuleID);
        console.log("Output array-->", Output);
      }
    });
    return Output;
  }
  DealCalculation() {
    this.isLoading = true;
    let userInfo = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    this.inputService.calculatedealinput = {
      UserInfo: userInfo,
      MasterData: {
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        TraceOppId: this.dealOverview.oppID,
        DealId: this.dealOverview.id,
        DealWonLoss: null,
        DealHeaderNumber: this.dealOverview.dealHeadernumber,
        DealVersionId: this.moduleHeaderDetails.MasterData.DealVersionId,
        DealHeaderName: this.dealOverview.dealName,
        DealValue: null,
        DOEmailId: this.userInfo.EmployeeMail,
        ModuleCount: this.moduleHeaderDetails.MasterData.ModuleCount,
        ModuleOwnerEmailId: this.moduleHeaderDetails.MasterData
          .ModuleOwnerEmailId,
        ModuleBFMEmailId: this.moduleHeaderDetails.MasterData.ModuleBFMEmailId,
        ModulePSPOCEmailId: this.moduleHeaderDetails.MasterData
          .ModulePSPOCEmailId,
        ModuleId: null,
        ModuleNumber: null,
        ModuleVersionId: null,
        ModuleName: null,
        ModuleStatusCode: null,
        ServiceLines: null,
        OptionId: this.moduleHeaderDetails.MasterData.OptionId,
        OptionNumber: this.moduleHeaderDetails.MasterData.OptionNumber,
        OptionName: this.moduleHeaderDetails.MasterData.OptionName,
        OptionVersionId: this.moduleHeaderDetails.MasterData.OptionVersionId,
        OptionStatusCode: this.moduleHeaderDetails.MasterData.OptionStatusCode,
        DealStatus: this.dealOverview.status,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: this.moduleHeaderDetails.MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.moduleHeaderDetails.MasterData.AddModuleVisible,
        AddModuleMessage: "",
        FileName: "",
        FilePath: "",
        lnkbtnDownload: null,
        RLSStatusCode: null,
        CFOApproval: "",
        TreasuryApproval: "",
        CustomerTemplateFileName: "",
        BillingRateType: null,
        ContingencyPerc: null,
        IsLatamDeal: null,
        RookieAndBulgeData: null
      }
    };
    this.deals.calculateDeal(this.inputService.calculatedealinput).subscribe(
      response => {
        if (response.ReturnCode == "S") {
          console.log("Deal Calculation Success response-->", response);
          let moduleList = response.Output.ModuleList;
          if (moduleList.length > 0) {
            let moduleStatus = moduleList[0].Status;
            this.moduleStatus = moduleStatus;
          }
          this.calculateDealResponse = response.Output;
          this.calculateTableList = [response.Output];
          this.calculationGridData = response.Output.Calculate.GridData;
          if (response.Output.ReturnFlag == "S") {
            // this.deals.UpdateExistingDealsStore();
            // this.deals.updateModuleListStore();
            this.GetModuleCalculationData();
            this.GetFillManangeParams(response.Output);
            this.wcsTable = this.GetMappedData(
              response.Output.RLSContractWCSSalary
            );
            this.DealContractTable = this.GetMappedDataForContractor(
              response.Output.RLSContractWCSSalary
            );
          } else if (
            response.Output.ReturnFlag == "F" &&
            response.Output.RLSContractWCSSalary
          ) {
            // this.deals.UpdateExistingDealsStore();
            // this.deals.updateModuleListStore();
            this.GetModuleCalculationData();
            this.GetFillManangeParams(response.Output);
            this.wcsTable = this.GetMappedData(
              response.Output.RLSContractWCSSalary
            );
            this.DealContractTable = this.GetMappedDataForContractor(
              response.Output.RLSContractWCSSalary
            );
          } else {
            // this.deals.UpdateExistingDealsStore();
            // this.deals.updateModuleListStore();
            this.wcsTable = this.GetMappedData([]);
            this.DealContractTable = this.GetMappedDataForContractor([]);
            this.GetModuleCalculationData();
            this.GetFillManangeParams(this.calculateTableList[0]);
          }
          this.DealContractRequestBody.PageSize = this.DealContractTable.length;
          this.tableTotalCount = this.DealContractTable.length;
          this.WCSRequestBody.PageSize = this.wcsTable.length;
          this.tableTotalCountWcs = this.wcsTable.length;
        } else {
          this.isLoading = false;
          this.popUp.throwError(response.ReturnMessage);
          // this.deals.UpdateExistingDealsStore();
          // this.deals.updateModuleListStore();
          this.GetModuleCalculationData();
          this.GetFillManangeParams(this.calculateTableList[0]);
        }
      },
      () => {
        this.isLoading = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  GetModuleCalculationData() {
    this.inputService.calculateModuleinput = {
      User: this.userInfo,
      ModuleIdsList: {
        ModuleIds: this.GetModuleIds()
      },
      MasterData: {
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        DealId: this.dealOverview.id,
        ModuleId: this.moduleHeaderDetails.ModuleList[0].ModuleID
      },
      GetDealCalculation: false
    };
    this.deals
      .calculateModule(this.inputService.calculateModuleinput)
      .subscribe(
        async res => {
          if (res.ReturnFlag == "S") {
            console.log("Deal Module Calculation Success response-->", res);
            this.calculateModuleResponse = res.Output.ModuleCalculatedDataList;
            this.calculateModuleTable = res.Output.ModuleCalculatedDataList;
            this.calculateModuleTable.forEach(element => {
              element.isChecked = true;
            });
            await this.GetWCSContractorSalaryDetails();
          } else {
            this.popUp.throwError(res.ReturnMessage);
          }
        },
        () => {
          this.popUp.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
  }

  GetWCSContractorSalaryDetails() {
    let userInfo = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    this.inputService.wcsInput = {
      UserInfo: userInfo,
      MasterDataRLS: {
        traceoppid: this.dealOverview.oppID,
        dealid: this.dealOverview.id,
        moduleid: "",
        optionid: this.dealOverview.OptionId,
        rlsid: "",
        dealversion: "",
        optionversion: this.moduleHeaderDetails.MasterData.OptionVersionId,
        moduleversion: "",
        rlsversion: "1.00",
        dealno: this.dealOverview.dealHeadernumber,
        moduleno: "",
        optionno: "",
        rlsno: "",
        passthroughtype: "P",
        RLSType: "S",
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        DealHeaderNumber: this.dealOverview.dealHeadernumber,
        currecyCode: this.dealOverview.Currency
      },
      ModulesInfo: [
        {
          ModuleId: "",
          RLSId: "",
          GMBasedBillRateCalc: "N"
        }
      ]
    };
    if (this.moduleInfo.length > 0) {
      console.log("module info-->", this.moduleInfo);
      var output = [];
      this.moduleInfo.map((x, i) => {
        x["RLSList"].map(element => {
          if (element.RLSId != "") {
            let obj = {};
            obj["ModuleId"] = x.ModuleHeader.ModuleID;
            obj["RLSId"] = element.RLSId;
            obj["GMBasedBillRateCalc"] = x.GMBillingRate.GMBasedBillRateCalc;
            output.push(obj);
          }
        });
      });
      this.inputService.wcsInput.ModulesInfo = output;
    }
    this.deals.getContractorWCSSalary(this.inputService.wcsInput).subscribe(
      res => {
        if (res.ReturnFlag == "S") {
          console.log("success res-->", res);
          this.getContractorWCSSalaryResponse = res.Output;
          let response = [
            this.calculateDealResponse,
            this.calculateModuleResponse,
            this.getContractorWCSSalaryResponse
          ];
          console.log("response for dispatching the store-->", response);
          this.store.dispatch(new calculateDeals({ calculateDeal: response }));
        } else {
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      () => {
        this.isLoading = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  GetFillManangeParams(data) {
    console.log("data-->", data);
    this.isLoading = true;
    let input1 = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterData: {
        PricingId: data.MasterData.PricingId,
        TraceOppId: data.MasterData.TraceOppId,
        DealId: data.MasterData.DealId,
        DealWonLoss: data.MasterData.DealWonLoss,
        DealHeaderNumber: data.MasterData.DealHeaderNumber,
        DealVersionId: data.MasterData.DealVersionId,
        DealHeaderName: data.MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: data.MasterData.DOEmailId,
        ModuleCount: data.MasterData.ModuleCount,
        ModuleOwnerEmailId: data.MasterData.ModuleOwnerEmailId,
        ModuleBFMEmailId: data.MasterData.ModuleBFMEmailId,
        ModulePSPOCEmailId: data.MasterData.ModulePSPOCEmailId,
        ModuleId: null,
        ModuleNumber: null,
        ModuleVersionId: null,
        ModuleName: null,
        ModuleStatusCode: null,
        ServiceLines: null,
        OptionId: data.MasterData.OptionId,
        OptionNumber: data.MasterData.OptionNumber,
        OptionName: data.MasterData.OptionName,
        OptionVersionId: data.MasterData.OptionVersionId,
        OptionStatusCode: data.MasterData.OptionStatusCode,
        DealStatus: this.dealOverview.status,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: data.MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: data.MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: data.MasterData.AddModuleVisible,
        AddModuleMessage: "",
        FileName: "",
        FilePath: "",
        lnkbtnDownload: null,
        RLSStatusCode: null,
        CFOApproval: "",
        TreasuryApproval: "",
        CustomerTemplateFileName: data.MasterData.CustomerTemplateFileName,
        BillingRateType: null,
        ContingencyPerc: null,
        IsLatamDeal: null,
        RookieAndBulgeData: null
      }
    };
    this.deals.getFillManageParams(input1).subscribe(
      res => {
        console.log("res-->", res);
        if (res.Output.ReturnFlag == "S") {
          this.isLoading = false;
          let encryptData = this.encrDecrService.set(
            "EncryptionEncryptionEncryptionEn",
            JSON.stringify(res),
            "DecryptionDecrip"
          );
          sessionStorage.setItem("getFillManageParameters", encryptData);
          this.store.dispatch(
            new DealParameterListAction({ dealparameterList: res.Output })
          );
          this.validation = res.Output.ValidationFlag;
        } else {
          this.isLoading = false;
          this.popUp.throwError(res.Output.ReturnMessage);
        }
      },
      () => {
        this.isLoading = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  performTableChildActionForWCS(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case "empno": {
        return;
      }
      case "GenerateData": {
        this.SaveWCSData(actionRequired);
        return;
      }
    }
  }
  performTableChildActionForContractor(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case "empno": {
        return;
      }
      case "GenerateData": {
        this.SaveContractorData(actionRequired);
        return;
      }
    }
  }
  // MORE ACTION STARTS **************
  contentArray = [
    { className: "mdi mdi-close", value: "Disqualify" },
    { className: "mdi mdi-crop-square", value: "Nurture" }
    // { className: 'mdi mdi-bullhorn', value: 'Request campaign' }
  ];
  additem() {
    // this.showContent = false;
  }
  closeContent() {
    this.showContent = false;
  }
  toggleContent() {
    this.showContent = !this.showContent;
  }
  save() {
    this.Submit++;
  }
  save1() {
    this.Submit1++;
  }
  SaveWCSData(data) {
    console.log("Emitted data while submitting for wcs-->", data);
    this.savedWCSData = data.objectRowData || "";
    let userInfo = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    this.inputService.saveWCSData.UserInfo = userInfo;
    this.inputService.saveWCSData.MasterDataRLS = {
      traceoppid: this.moduleHeaderDetails.MasterData.TraceOppId,
      dealid: this.moduleHeaderDetails.MasterData.DealId,
      moduleid: this.moduleHeaderDetails.ModuleList[0].ModuleID,
      optionid: this.moduleHeaderDetails.MasterData.OptionId,
      rlsid: this.moduleHeaderDetails.ModuleList[0].RLSId,
      dealversion: this.moduleHeaderDetails.MasterData.DealVersionId,
      optionversion: this.moduleHeaderDetails.MasterData.OptionVersionId,
      moduleversion: this.moduleHeaderDetails.ModuleList[0].ModuleVersion,
      rlsversion: "",
      dealno: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
      moduleno: this.moduleHeaderDetails.ModuleList[0].ModuleNumber,
      optionno: this.moduleHeaderDetails.MasterData.OptionNumber,
      rlsno: "",
      passthroughtype: "P",
      RLSType: "S",
      PricingId: this.moduleHeaderDetails.MasterData.PricingId,
      DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
      currecyCode: this.moduleHeaderDetails.MasterData.CurrencyCode
    };
    var rowData = [];
    data.objectRowData.map((item, index) => {
      let obj = {};
      obj[
        "currencyMaster"
      ] = this.inputService.saveWCSData.WCSSalaryList[0].prePopulated[0].currencyMaster;
      obj[
        "ratetypeMaster"
      ] = this.inputService.saveWCSData.WCSSalaryList[0].prePopulated[0].ratetypeMaster;
      obj["HiddenParams"] = item.HiddenParams;
      obj["DisableAgency"] = false;
      obj["DisableEmp"] = true;
      obj["data"] = [
        {
          value: item.id,
          code: item.id,
          elementID: "SLNO",
          colName: "SLNO"
        },
        {
          value: item.empno || "",
          code: item.empno || "",
          elementID: "EMPNO",
          colName: "Employee no"
        },
        {
          value: item.band,
          code: item.band,
          elementID: "BANDCODE",
          colName: "Band"
        },
        {
          value: item.servline,
          code: item.servlineCode,
          elementID: "SERVICELINENAME",
          colName: "Service Line"
        },
        {
          value: item.practice,
          code: item.practiceCode,
          elementID: "PRACTICENAME",
          colName: "Practice"
        },
        {
          value: item.loc,
          code: item.loc,
          elementID: "LOCATIONNAME",
          colName: "Location"
        },
        {
          value: item.agencyrate,
          code: "",
          elementID: "BILLINGRATE",
          colName: "Rate"
        }
      ];
      rowData.push(obj);
    });
    console.log("rowData-->", rowData);
    if (this.moduleInfo.length > 0) {
      console.log("module info-->", this.moduleInfo);
      var outputForWCS = [];
      this.moduleInfo.map((x, i) => {
        x["RLSList"].map(element => {
          if (element.RLSId != "") {
            let obj = {};
            obj["ModuleId"] = x.ModuleHeader.ModuleID;
            obj["RLSId"] = element.RLSId;
            obj["GMBasedBillRateCalc"] = x.GMBillingRate.GMBasedBillRateCalc;
            obj["prePopulated"] = rowData;
            outputForWCS.push(obj);
          }
        });
      });
      console.log("outputForWCS-->", outputForWCS);
      this.inputService.saveWCSData.WCSSalaryList = outputForWCS;
    }
    this.deals.pullContractorWCSSalary(this.inputService.saveWCSData).subscribe(
      res => {
        let output = res.Output;
        console.log("output", output);
        if (
          output.every(x => x.ReturnFlag == "S") ||
          output.some(x => x.ReturnFlag == "S")
        ) {
          console.log("Success response-->", res);
          let successOutput = output.filter(x => x.ReturnFlag == "S");
          let successMessage = [];
          successOutput.map(element => {
            successMessage.push(element.ReturnMessage);
          });
          console.log(successMessage);
          this.popUp.throwError(successMessage[0]);
          this.DealCalculation();
        } else if (output.some(x => x.ReturnFlag == "F")) {
          console.log(output.filter(x => x.ReturnFlag == "F"));
          let returnedOutput = output.filter(x => x.Error);
          let errorMessage = [];
          returnedOutput.map(element => {
            element.Error.map(item => {
              errorMessage.push(item);
            });
          });
          let errorMessages = errorMessage.map(x => x.ErrorMessage);
          this.matSnackBar.openFromComponent(CustomErrorComponent, {
            data: errorMessages,
            ...this.configSuccess
          });
        } else {
          let message = res.Output.filter(x => x.Error);
          let errorMessage = [];
          message.map(element => {
            element.Error.map(item => {
              errorMessage.push(item);
            });
          });
          let errorMessages = errorMessage.map(x => x.ErrorMessage);
          this.matSnackBar.openFromComponent(CustomErrorComponent, {
            data: errorMessages,
            ...this.configSuccess
          });
        }
      },
      () => {
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  SaveContractorData(info) {
    console.log("Emitted data while submitting-->", info);
    this.savedObject = info.objectRowData;
    let userInfo = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber
    };
    this.inputService.saveData.UserInfo = userInfo;
    this.inputService.saveData.MasterDataRLS = {
      traceoppid: this.moduleHeaderDetails.MasterData.TraceOppId,
      dealid: this.moduleHeaderDetails.MasterData.DealId,
      moduleid: this.moduleHeaderDetails.ModuleList[0].ModuleID,
      optionid: this.moduleHeaderDetails.MasterData.OptionId,
      rlsid: this.moduleHeaderDetails.ModuleList[0].RLSId,
      dealversion: this.moduleHeaderDetails.MasterData.DealVersionId,
      optionversion: this.moduleHeaderDetails.MasterData.OptionVersionId,
      moduleversion: this.moduleHeaderDetails.ModuleList[0].ModuleVersion,
      rlsversion: "",
      dealno: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
      moduleno: this.moduleHeaderDetails.ModuleList[0].ModuleNumber,
      optionno: this.moduleHeaderDetails.MasterData.OptionNumber,
      rlsno: "",
      passthroughtype: "P",
      RLSType: "S",
      PricingId: this.moduleHeaderDetails.MasterData.PricingId,
      DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
      currecyCode: this.moduleHeaderDetails.MasterData.CurrencyCode
    };
    var rowData1 = [];
    info.objectRowData.map((item, index) => {
      var obj = {};
      obj[
        "currencyMaster"
      ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].currencyMaster;
      obj[
        "ratetypeMaster"
      ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].ratetypeMaster;
      obj["HiddenParams"] = item.HiddenParams;
      obj["DisableAgency"] = false;
      obj["DisableEmp"] = true;
      if (item.curncy != "-1") {
        obj["data"] = [
          {
            value: item.curncy,
            code: item.curncy,
            elementID: "AGENCYCURRENCY",
            elementType: "DD",
            mandFlag: "N"
          },
          {
            value: item.agencytype,
            code: item.agencytype,
            elementID: "AGENCYRATETYPE",
            elementType: "DD",
            mandFlag: "N"
          },
          {
            value: item.agencyrate,
            code: item.agencyrate,
            elementID: "AGENCYRATE",
            elementType: "TXT",
            mandFlag: "N"
          }
        ];
      } else {
        obj["data"] = [
          {
            value: item.empno || "",
            code: "",
            elementID: "EMPNO",
            elementType: "TXT",
            mandFlag: "N"
          }
        ];
      }
      rowData1.push(obj);
    });
    console.log("rowData-->", rowData1);
    console.log("calculate table list-->", this.calculateTableList[0]);
    if (this.moduleInfo.length > 0) {
      console.log("module info-->", this.moduleInfo);
      var outputInfo = [];
      this.moduleInfo.map((x, i) => {
        x["RLSList"].map(element => {
          if (element.RLSId != "") {
            let obj = {};
            obj["ModuleId"] = x.ModuleHeader.ModuleID;
            obj["RLSId"] = element.RLSId;
            obj["GMBasedBillRateCalc"] = x.GMBillingRate.GMBasedBillRateCalc;
            obj["prePopulated"] = rowData1;
            outputInfo.push(obj);
          }
        });
      });
      console.log("outputInfo-->", outputInfo);
      this.inputService.saveData.ContrSalaryList = outputInfo;
    }
    console.log(
      "Headers sent while saving contractor data-->",
      this.inputService.saveData
    );
    this.deals.pullContractorWCSSalary(this.inputService.saveData).subscribe(
      res => {
        console.log("After pull/save response will be-->", res);
        if (res.ReturnFlag == "S") {
          let output = res.Output[0];
          if (output.ReturnFlag == "S") {
            console.log("Success response-->", res);
            let val;
            this.matSnackBar.open(output.ReturnMessage, val, {
              duration: 2000
            });
            this.DealCalculation();
          } else {
            this.popUp.throwError(output.ReturnMessage);
          }
        }
      },
      () => {
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  Reset(data) {
    const dialogRef = this.dialog.open(resetConfirmationComponent, {
      width: "396px"
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response && data == "ResetWCSData") {
        this.ResetWCSData();
      }
      if (response && data == "ResetContractorData") {
        this.ResetContractorData();
      }
    });
  }
  ResetWCSData() {
    let data = this.savedWCSData;
    if (data != undefined) {
      let userInfo = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      };
      this.inputService.resetWCS.UserInfo = userInfo;
      this.inputService.resetWCS.MasterDataRLS = {
        traceoppid: this.moduleHeaderDetails.MasterData.TraceOppId,
        dealid: this.moduleHeaderDetails.MasterData.DealId,
        moduleid: this.moduleHeaderDetails.ModuleList[0].ModuleID,
        optionid: this.moduleHeaderDetails.MasterData.OptionId,
        rlsid: this.moduleHeaderDetails.ModuleList[0].RLSId,
        dealversion: this.moduleHeaderDetails.MasterData.DealVersionId,
        optionversion: this.moduleHeaderDetails.MasterData.OptionVersionId,
        moduleversion: this.moduleHeaderDetails.ModuleList[0].ModuleVersion,
        rlsversion: "",
        dealno: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
        moduleno: this.moduleHeaderDetails.ModuleList[0].ModuleNumber,
        optionno: this.moduleHeaderDetails.MasterData.OptionNumber,
        rlsno: "",
        passthroughtype: "P",
        RLSType: "S",
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
        currecyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        PeriodSelected: "M",
        BillingRateSelected: "D"
      };
      var resetWCSData = [];
      data.map((item, index) => {
        var obj = {};
        obj[
          "currencyMaster"
        ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].currencyMaster;
        obj[
          "ratetypeMaster"
        ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].ratetypeMaster;
        obj["HiddenParams"] = item.HiddenParams;
        obj["DisableAgency"] = false;
        obj["DisableEmp"] = true;
        obj["data"] = [
          {
            value: item.id,
            code: item.id,
            elementID: "SLNO",
            colName: "SLNO"
          },
          {
            value: item.empno || "",
            code: item.empno || "",
            elementID: "EMPNO",
            colName: "Employee no"
          },
          {
            value: item.band,
            code: item.band,
            elementID: "BANDCODE",
            colName: "Band"
          },
          {
            value: item.servline,
            code: item.servlineCode,
            elementID: "SERVICELINENAME",
            colName: "Service Line"
          },
          {
            value: item.practice,
            code: item.practiceCode,
            elementID: "PRACTICENAME",
            colName: "Practice"
          },
          {
            value: item.loc,
            code: item.loc,
            elementID: "LOCATIONNAME",
            colName: "Location"
          },
          {
            value: item.agencyrate,
            code: "",
            elementID: "BILLINGRATE",
            colName: "Rate"
          }
        ];
        resetWCSData.push(obj);
      });
      console.log("resetWCSData-->", resetWCSData);
      console.log("calculate table list-->", this.calculateTableList[0]);
      if (this.moduleInfo.length > 0) {
        console.log("module info-->", this.moduleInfo);
        var resetOutputForWCS = [];
        this.moduleInfo.map((x, i) => {
          x["RLSList"].map(element => {
            if (element.RLSId != "") {
              let obj = {};
              obj["ModuleId"] = x.ModuleHeader.ModuleID;
              obj["RLSId"] = element.RLSId;
              obj["GMBasedBillRateCalc"] = x.GMBillingRate.GMBasedBillRateCalc;
              obj["prePopulated"] = resetWCSData;
              resetOutputForWCS.push(obj);
            }
          });
        });
        console.log("resetOutputForWCS-->", resetOutputForWCS);
        this.inputService.resetWCS.WCSSalaryList = resetOutputForWCS;
      }
      this.deals.resetContractorWCSSalary(this.inputService.resetWCS).subscribe(
        res => {
          if (res.ReturnFlag == "S") {
            console.log("Success response-->", res);
            this.savedObject = undefined;
            let val;
            this.matSnackBar.open(res.Output[0].ReturnMessage, val, {
              duration: 2000
            });
            this.DealCalculation();
          } else {
            this.savedObject = undefined;
            this.popUp.throwError(res.ReturnMessage);
          }
        },
        () => {
          this.savedObject = undefined;
          this.popUp.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      );
    } else {
      this.DealCalculation();
    }
  }
  ResetContractorData() {
    let data = this.savedObject;
    console.log("data", data);
    if (data != undefined) {
      let userInfo = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      };
      this.inputService.resetContractorWCS.UserInfo = userInfo;
      this.inputService.resetContractorWCS.MasterDataRLS = {
        traceoppid: this.calculateTableList[0].MasterData.TraceOppId,
        dealid: this.calculateTableList[0].MasterData.DealId,
        moduleid: this.calculateTableList[0].ModuleList[0].ModuleID,
        optionid: this.calculateTableList[0].MasterData.OptionId,
        rlsid: this.calculateTableList[0].ModuleList[0].RLSId,
        dealversion: this.calculateTableList[0].MasterData.DealVersionId,
        optionversion: this.calculateTableList[0].MasterData.OptionVersionId,
        moduleversion: this.calculateTableList[0].ModuleList[0].ModuleVersion,
        rlsversion: "",
        dealno: this.calculateTableList[0].MasterData.DealHeaderNumber,
        moduleno: this.calculateTableList[0].ModuleList[0].ModuleNumber,
        optionno: this.calculateTableList[0].MasterData.OptionNumber,
        rlsno: "",
        passthroughtype: "P",
        RLSType: "S",
        PricingId: this.calculateTableList[0].MasterData.PricingId,
        DealHeaderNumber: this.calculateTableList[0].MasterData
          .DealHeaderNumber,
        currecyCode: this.calculateTableList[0].MasterData.CurrencyCode,
        PeriodSelected: "M",
        BillingRateSelected: "D"
      };
      var resetContractorData = [];
      data.map((item, index) => {
        var obj = {};
        obj[
          "currencyMaster"
        ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].currencyMaster;
        obj[
          "ratetypeMaster"
        ] = this.inputService.saveData.ContrSalaryList[0].prePopulated[0].ratetypeMaster;
        obj["HiddenParams"] = item.HiddenParams;
        obj["DisableAgency"] = false;
        obj["DisableEmp"] = true;
        if (item.curncy != "-1") {
          obj["data"] = [
            {
              value: item.curncy,
              code: item.curncy,
              elementID: "AGENCYCURRENCY",
              elementType: "DD",
              mandFlag: "N"
            },
            {
              value: item.agencytype,
              code: item.agencytype,
              elementID: "AGENCYRATETYPE",
              elementType: "DD",
              mandFlag: "N"
            },
            {
              value: item.agencyrate,
              code: item.agencyrate,
              elementID: "AGENCYRATE",
              elementType: "TXT",
              mandFlag: "N"
            }
          ];
        } else {
          obj["data"] = [
            {
              value: item.empno,
              code: "",
              elementID: "EMPNO",
              elementType: "TXT",
              mandFlag: "N"
            }
          ];
        }
        resetContractorData.push(obj);
      });
      console.log("resetContractorData-->", resetContractorData);
      if (this.moduleInfo.length > 0) {
        console.log("module info-->", this.moduleInfo);
        var resetOutputForContractor = [];
        this.moduleInfo.map((x, i) => {
          x["RLSList"].map(element => {
            if (element.RLSId != "") {
              let obj = {};
              obj["ModuleId"] = x.ModuleHeader.ModuleID;
              obj["RLSId"] = element.RLSId;
              obj["GMBasedBillRateCalc"] = x.GMBillingRate.GMBasedBillRateCalc;
              obj["prePopulated"] = resetContractorData;
              resetOutputForContractor.push(obj);
            }
          });
        });
        console.log("resetOutputForContractor-->", resetOutputForContractor);
        this.inputService.resetContractorWCS.ContrSalaryList = resetOutputForContractor;
      }
      this.deals
        .resetContractorWCSSalary(this.inputService.resetContractorWCS)
        .subscribe(
          res => {
            if (res.ReturnFlag == "S") {
              console.log("Success response-->", res);
              let val;
              this.matSnackBar.open(res.Output[0].ReturnMessage, val, {
                duration: 2000
              });
              this.DealCalculation();
            } else {
              this.popUp.throwError(res.ReturnMessage);
            }
          },
          () => {
            this.popUp.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
    } else {
      this.DealCalculation();
    }
  }

  /*Map API reponse for WCS Header*/
  GetMappedData(res) {
    console.log("Mapped API response-->", res);
    let wcsPrePopulated = [];
    let response = res;
    let wcsDisplay = response.map(x => x.WCSDisplay);
    wcsDisplay = wcsDisplay.filter(x => x.WcssalaryVisible == "T");
    console.log("wcsDisplay filtered-->", wcsDisplay);
    wcsDisplay.map(element => {
      element.prePopulated.map(item => {
        wcsPrePopulated.push(item);
      });
    });
    console.log("wcsPrePopulated", wcsPrePopulated);
    if (
      res.length > 0 &&
      wcsDisplay.length > 0 &&
      wcsDisplay.every(x => x.WcssalaryVisible == "T")
    ) {
      this.tableVisibility = true;
      let Output = [];
      let indexId = 1;
      wcsPrePopulated.map(x => {
        console.log("mapped wcs data-->", x);
        let obj = {
          id: this.validate.validate(x.data[0].value) ? x.data[0].value : "NA",
          empno: this.validate.validate(x.data[1].value) ? x.data[1].value : "",
          band: this.validate.validate(x.data[2].value)
            ? x.data[2].value
            : "NA",
          servline: this.validate.validate(x.data[7].value)
            ? x.data[7].value
            : "NA",
          practice: this.validate.validate(x.data[8].value)
            ? x.data[8].value
            : "NA",
          loc: this.validate.validate(x.data[6].value) ? x.data[6].value : "NA",
          agencyrate: this.validate.validate(x.data[10].value)
            ? x.data[10].value
            : "NA",
          HiddenParams: {
            lidisplayid: x.HiddenParams.lidisplayid
          },
          servlineCode: this.validate.validate(x.data[7].code)
            ? x.data[7].code
            : "NA",
          practiceCode: this.validate.validate(x.data[8].code)
            ? x.data[8].code
            : "NA",
          index: indexId
        };
        Output.push(obj);
        indexId = indexId + 1;
      });
      console.log("wcs output-->", Output);
      this.savedWCSData = Output;
      return Output;
    } else {
      this.tableTotalCountWcs = 0;
      this.wcsTable = [];
      this.tableVisibility = false;
      this.savedWCSData = "";
      return [{}];
    }
  }

  /*Map API reponse for Contractor Header*/
  GetMappedDataForContractor(res) {
    console.log("Mapped API response-->", res);
    let contractorPrepopulatedData = [];
    let response = res;
    let ContractSalaryDisplay = response.map(x => x.ContractSalaryDisplay);
    ContractSalaryDisplay = ContractSalaryDisplay.filter(
      x => x.ContractSalaryVisible == "T"
    );
    ContractSalaryDisplay.map(element => {
      element.prePopulated.map(item => {
        contractorPrepopulatedData.push(item);
      });
    });
    if (
      res.length > 0 &&
      ContractSalaryDisplay.length > 0 &&
      ContractSalaryDisplay.every(x => x.ContractSalaryVisible == "T")
    ) {
      this.contractorVisibility = true;
      let contractorDropdownData = ContractSalaryDisplay.map(x => {
        return x.dropDownData;
      });
      let AgencyRateType = contractorDropdownData.map(x => {
        return x.AgencyRateType;
      });
      this.configData.agencytype = AgencyRateType[0].map(x => {
        return {
          id: this.validate.validate(x.id) ? x.id : -1,
          name: x.label
        };
      });
      let Currency = contractorDropdownData.map(x => {
        return x.Currency;
      });
      this.configData.curncy = Currency[0].map(x => {
        return {
          id: this.validate.validate(x.id) ? x.id : -1,
          name: x.label
        };
      });
      let Output = [];
      let indexId = 1;
      contractorPrepopulatedData.map(x => {
        const obj = {
          empno: this.validate.validate(x.data[1].value) ? x.data[1].value : "",
          curncy: this.validate.validate(x.data[10].value)
            ? x.data[10].value
            : "-1",
          agencytype: this.validate.validate(x.data[11].value)
            ? x.data[11].value
            : "-1",
          agencyrate: this.validate.validate(x.data[12].value)
            ? x.data[12].value
            : "",
          band: this.validate.validate(x.data[2].value)
            ? x.data[2].value
            : "NA",
          sercline: this.validate.validate(x.data[7].value)
            ? x.data[7].value
            : "NA",
          practice: this.validate.validate(x.data[8].value)
            ? x.data[8].value
            : "NA",
          index: indexId,
          $curncy: this.validate.validate(x.data[1].value) ? false : true,
          $empno: this.validate.validate(x.data[10].value) ? false : true,
          HiddenParams: {
            lidisplayid: x.HiddenParams.lidisplayid
          }
        };
        if (x.data[1].value == "" && x.data[10].value == "") {
          obj.$curncy = false;
          obj.$empno = false;
        }
        Output.push(obj);
        indexId = indexId + 1;
      });
      console.log("output-->", Output);
      if (Output.every(x => (x = x.curncy != "-1"))) {
        this.savedObject = Output;
      } else {
        this.savedObject = undefined;
      }
      return Output;
    } else {
      this.tableTotalCount = 0;
      this.DealContractTable = [];
      this.contractorVisibility = false;
      this.savedObject = undefined;
      return [{}];
    }
  }
  SelectAll(e) {
    console.log("event from select all-->", e);
    this.checked = e.checked;
    this.calculateModuleTable.forEach(element => {
      element.isChecked = e.checked;
    });
    this.toggleContent();
  }
  SelectOne(e, moduleDataList) {
    console.log("event from select one-->", e);
    moduleDataList.isChecked = e.checked;
    this.checked = this.calculateModuleTable.every(x => x.isChecked);
    this.toggleContent();
  }
  // Function for Submitting the Module
  SubmitModule() {
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      },
      ModuleIdsList: {
        ModuleIds: this.GetModuleIds()
      },
      MasterData: {
        PricingId: this.calculateTableList[0].MasterData.PricingId,
        TraceOppId: this.calculateTableList[0].MasterData.TraceOppId,
        DealId: this.calculateTableList[0].MasterData.DealId,
        DealWonLoss: null,
        DealHeaderNumber: this.calculateTableList[0].MasterData
          .DealHeaderNumber,
        DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
        DealHeaderName: this.calculateTableList[0].MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
        ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
        ModuleOwnerEmailId: null,
        ModuleBFMEmailId: null,
        ModulePSPOCEmailId: null,
        ModuleId: null,
        ModuleNumber: null,
        ModuleVersionId: null,
        ModuleName: null,
        ModuleStatusCode: null,
        ServiceLines: null,
        OptionId: this.calculateTableList[0].MasterData.OptionId,
        OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
        OptionName: this.calculateTableList[0].MasterData.OptionName,
        OptionVersionId: this.calculateTableList[0].MasterData.OptionVersionId,
        OptionStatusCode: this.calculateTableList[0].MasterData
          .OptionStatusCode,
        DealStatus: null,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: this.calculateTableList[0].MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.calculateTableList[0].MasterData
          .AddModuleVisible,
        AddModuleMessage: "",
        FileName: "",
        FilePath: "",
        lnkbtnDownload: null,
        RLSStatusCode: null,
        CFOApproval: "",
        TreasuryApproval: "",
        CustomerTemplateFileName: "",
        BillingRateType: null,
        ContingencyPerc: null,
        IsLatamDeal: null,
        RookieAndBulgeData: null
      },
      AuditLogData: {
        AuditLog: []
      }
    };
    this.isDummyLoader = true;
    this.deals.moduleRLSSubmit(input).subscribe(
      res => {
        console.log("res-->", res);
        if (res.ReturnFlag == "S") {
          this.isDummyLoader = false;
          this.moduleStatus = "Closed";
          this.popUp.throwError(res.Output.ReturnMessage);
          this.deals.UpdateExistingDealsStore();
          this.deals.updateModuleListStore();
          this.GetFillManangeParams(this.calculateTableList[0]);
        } else {
          this.isDummyLoader = false;
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      () => {
        this.isDummyLoader = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  SubmitAll() {
    if (this.calculateTableList[0].MasterData.IsATCO == "Y") {
      this.popUp.throwError(
        "Pricing Approval is not applicable for this deal. Kindly contact Deal BFM/SPOC to proceed further."
      );
    } else {
      this.submitDeal();
    }
  }
  // Function for Submitting the Deal
  submitDeal() {
    if (this.calculateTableList[0].ReturnFlag != "F") {
      {
        let input = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            AdId: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeId,
            EmpNo: this.userInfo.EmployeeNumber
          },
          MasterData: {
            PricingId: this.dealOverview.PricingId,
            TraceOppId: this.dealOverview.oppID,
            DealId: this.dealOverview.id,
            DealWonLoss: null,
            DealHeaderNumber: this.dealOverview.id,
            DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
            DealHeaderName: this.dealOverview.dealName,
            DealValue: null,
            DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
            ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
            ModuleOwnerEmailId: this.calculateTableList[0].MasterData
              .ModuleOwnerEmailID,
            ModuleBFMEmailId: null,
            ModulePSPOCEmailId: null,
            ModuleId: null,
            ModuleNumber: null,
            ModuleVersionId: null,
            ModuleName: null,
            ModuleStatusCode: null,
            ServiceLines: null,
            OptionId: this.calculateTableList[0].MasterData.OptionId,
            OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
            OptionName: this.calculateTableList[0].MasterData.OptionName,
            OptionVersionId: this.calculateTableList[0].MasterData
              .OptionVersionId,
            OptionStatusCode: this.calculateTableList[0].MasterData
              .OptionStatusCode,
            DealStatus: this.dealOverview.status,
            RLSId: null,
            RLSVersionId: null,
            SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
            MachineIp: this.calculateTableList[0].MasterData.MachineIp,
            GroupCode: null,
            RoleId: null,
            CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
            MsaRequired: null,
            AmendmentNo: null,
            BFM_PSPOC_Vertical: null,
            ModuleTeamEmailID: null,
            AddModuleVisible: this.calculateTableList[0].MasterData
              .AddModuleVisible,
            AddModuleMessage: this.calculateTableList[0].MasterData
              .AddModuleMessage,
            FileName: "",
            FilePath: "",
            lnkbtnDownload: null,
            RLSStatusCode: null,
            CFOApproval: "",
            TreasuryApproval: "",
            CustomerTemplateFileName: "",
            BillingRateType: null,
            ContingencyPerc: null,
            IsLatamDeal: null,
            RookieAndBulgeData: null
          }
        };
        this.isDummyLoader = true;
        this.deals.submitAllBenchMark(input).subscribe(
          res => {
            this.isDummyLoader = false;
            switch (true) {
              case res.ReturnFlag == "F":
                this.isDummyLoader = false;
                this.popUp.throwError(res.ReturnMessage);
                break;
              case res.Output.ReturnFlag == "F" &&
                !res.Output.ReturnMessage.includes(
                  "Cannot submit the modules as Deal and Module owner are different"
                ) &&
                !res.Output.ReturnMessage.includes(
                  "Please choose one user from the list provided  below as deal BFM to submit the deal"
                ):
                this.isDummyLoader = false;
                this.popUp.throwError(res.Output.ReturnMessage);
                break;
              case res.Output.ReturnMessage.includes(
                "Please choose one user from the list provided  below as deal BFM to submit the deal"
              ) && res.Output.hasOwnProperty("BFMUsers"):
                this.SubmitForBFMApproval(res);
                break;
              case res.Output.ReturnMessage.includes(
                "Cannot submit the modules as Deal and Module owner are different"
              ):
                this.DealSubmitForApproval();
                break;
              case res.Output.ReturnFlag == "S" &&
                res.Output.hasOwnProperty("BFMUsers"):
                this.SubmitForBFMApproval(res);
                break;
              case res.Output.ReturnFlag == "S" &&
                res.Output.BindHeaderDetail.IsAppirioDeal == "Y":
                this.AppirioDeal();
                break;
              default:
                this.isDummyLoader = false;
                this.popUp.throwError(res.ReturnMessage);
                break;
            }
          },
          () => {
            this.isDummyLoader = false;
            this.popUp.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    } else {
      this.popUp.throwError(this.calculateTableList[0].ReturnMessage);
    }
  }

  SubmitForBFMApproval(data) {
    console.log("data-->", data);
    let BFMUser = data.Output.BFMUsers;
    BFMUser = Object.assign({}, ...BFMUser);
    console.log("BFMUser", BFMUser);
    const dialogRef = this.dialog.open(dealSubPopup, {
      width: "750px",
      data: data.Output.BFMUsers
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("SubmitForApprovalBFMUser res-->", res);
        let input = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            AdId: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeNumber,
            EmpNo: this.userInfo.EmployeeNumber
          },
          MasterData: {
            PricingId: this.calculateTableList[0].MasterData.PricingId,
            TraceOppId: this.calculateTableList[0].MasterData.TraceOppId,
            DealId: this.calculateTableList[0].MasterData.DealId,
            DealWonLoss: null,
            DealHeaderNumber: this.calculateTableList[0].MasterData
              .DealHeaderNumber,
            DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
            DealHeaderName: this.calculateTableList[0].MasterData
              .DealHeaderName,
            DealValue: null,
            DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
            ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
            ModuleOwnerEmailId: this.calculateTableList[0].MasterData
              .ModuleOwnerEmailId,
            ModuleBFMEmailId: "",
            ModulePSPOCEmailId: "",
            ModuleId: null,
            ModuleNumber: null,
            ModuleVersionId: null,
            ModuleName: null,
            ModuleStatusCode: null,
            ServiceLines: null,
            OptionId: this.calculateTableList[0].MasterData.OptionId,
            OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
            OptionName: this.calculateTableList[0].MasterData.OptionName,
            OptionVersionId: this.calculateTableList[0].MasterData
              .OptionVersionId,
            OptionStatusCode: this.calculateTableList[0].MasterData
              .OptionStatusCode,
            DealStatus: null,
            RLSId: null,
            RLSVersionId: null,
            SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
            MachineIp: this.calculateTableList[0].MasterData.MachineIp,
            GroupCode: null,
            RoleId: null,
            CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
            MsaRequired: null,
            AmendmentNo: null,
            BFM_PSPOC_Vertical: null,
            ModuleTeamEmailID: null,
            AddModuleVisible: this.calculateTableList[0].MasterData
              .AddModuleVisible,
            AddModuleMessage: "",
            FileName: "",
            FilePath: "",
            lnkbtnDownload: null,
            RLSStatusCode: null,
            CFOApproval: "",
            TreasuryApproval: "",
            CustomerTemplateFileName: "",
            BillingRateType: null,
            ContingencyPerc: null,
            IsLatamDeal: null,
            RookieAndBulgeData: null
          },
          BFMUser: BFMUser
        };
        this.isDummyLoader = true;
        this.deals.SubmitForApprovalBFMUser(input).subscribe(
          res => {
            console.log("SubmitForApprovalBFMUser", res);
            if (res.ReturnFlag == "S") {
              if (res.Output.ReturnFlag == "S") {
                this.isDummyLoader = false;
               // this.popUp.throwError(res.Output.ReturnMessage);
                 this.popUp.throwError('Submitted successfully for approval');
                // this.DealCalculation();
                this.deals.UpdateExistingDealsStore();
                this.deals.updateModuleListStore();
                this.GetFillManangeParams(this.calculateTableList[0]);
              } else {
                this.isDummyLoader = false;
                this.popUp.throwError(res.Output.ReturnMessage);
              }
            } else {
              this.isDummyLoader = false;
              this.popUp.throwError(res.ReturnMessage);
            }
          },
          () => {
            this.isDummyLoader = false;
            this.popUp.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    });
  }
  DealSubmitForApproval() {
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeNumber,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterData: {
        PricingId: this.calculateTableList[0].MasterData.PricingId,
        TraceOppId: this.calculateTableList[0].MasterData.TraceOppId,
        DealId: this.calculateTableList[0].MasterData.DealId,
        DealWonLoss: null,
        DealHeaderNumber: this.calculateTableList[0].MasterData
          .DealHeaderNumber,
        DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
        DealHeaderName: this.calculateTableList[0].MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
        ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
        ModuleOwnerEmailId: this.calculateTableList[0].MasterData
          .ModuleOwnerEmailId,
        ModuleBFMEmailId: "",
        ModulePSPOCEmailId: this.calculateTableList[0].MasterData
          .ModulePSPOCEmailId,
        ModuleId: null,
        ModuleNumber: null,
        ModuleVersionId: null,
        ModuleName: null,
        ModuleStatusCode: null,
        ServiceLines: null,
        OptionId: this.calculateTableList[0].MasterData.OptionId,
        OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
        OptionName: this.calculateTableList[0].MasterData.OptionName,
        OptionVersionId: this.calculateTableList[0].MasterData.OptionVersionId,
        OptionStatusCode: this.calculateTableList[0].MasterData
          .OptionStatusCode,
        DealStatus: null,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: this.calculateTableList[0].MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
        MsaRequired: "0.0000000000000",
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.calculateTableList[0].MasterData
          .AddModuleVisible,
        AddModuleMessage: "",
        FileName: "",
        FilePath: "",
        lnkbtnDownload: null,
        RLSStatusCode: null,
        CFOApproval: "",
        TreasuryApproval: "",
        CustomerTemplateFileName: "",
        BillingRateType: null,
        ContingencyPerc: null,
        IsLatamDeal: null,
        RookieAndBulgeData: null
      }
    };
    this.deals.DealSubmitForApproval(input).subscribe(
      res => {
        this.isDummyLoader = true;
        switch (true) {
          case res.Output.ReturnFlag == "S" &&
            res.Output.hasOwnProperty("BFMUsers"):
            this.isDummyLoader = false;
            this.SubmitForBFMApproval(res);
            break;
          case res.Output.ReturnFlag == "S" &&
            res.Output.BindHeaderDetail.IsAppirioDeal == "Y":
            this.isDummyLoader = false;
            this.AppirioDeal();
            break;
          case res.Output.ReturnFlag == "F":
            this.popUp.throwError(res.Output.ReturnMessage);
            this.isDummyLoader = false;
            break;
          default:
            this.popUp.throwError(res.ReturnMessage);
            this.isDummyLoader = false;
            break;
        }
      },
      () => {
        this.isDummyLoader = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  AppirioDeal() {
    const dialogRef = this.dialog.open(appirioConfirmationComponent, {
      width: "396px"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("appirioConfirmation res-->", res);
        let input = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            AdId: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeId,
            EmpNo: this.userInfo.EmployeeNumber
          },
          MasterData: {
            PricingId: this.calculateTableList[0].MasterData.PricingId,
            TraceOppId: this.calculateTableList[0].MasterData.TraceOppId,
            DealId: this.calculateTableList[0].MasterData.DealId,
            DealWonLoss: null,
            DealHeaderNumber: this.calculateTableList[0].MasterData
              .DealHeaderNumber,
            DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
            DealHeaderName: this.calculateTableList[0].MasterData
              .DealHeaderName,
            DealValue: null,
            DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
            ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
            ModuleOwnerEmailId: this.calculateTableList[0].MasterData
              .ModuleOwnerEmailId,
            ModuleBFMEmailId: "",
            ModulePSPOCEmailId: "",
            ModuleId: null,
            ModuleNumber: null,
            ModuleVersionId: null,
            ModuleName: null,
            ModuleStatusCode: null,
            ServiceLines: null,
            OptionId: this.calculateTableList[0].MasterData.OptionId,
            OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
            OptionName: this.calculateTableList[0].MasterData.OptionName,
            OptionVersionId: this.calculateTableList[0].MasterData
              .OptionVersionId,
            OptionStatusCode: this.calculateTableList[0].MasterData
              .OptionStatusCode,
            DealStatus: null,
            RLSId: null,
            RLSVersionId: null,
            SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
            MachineIp: this.calculateTableList[0].MasterData.MachineIp,
            GroupCode: null,
            RoleId: null,
            CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
            MsaRequired: null,
            AmendmentNo: null,
            BFM_PSPOC_Vertical: null,
            ModuleTeamEmailID: null,
            AddModuleVisible: this.calculateTableList[0].MasterData
              .AddModuleVisible,
            AddModuleMessage: "",
            FileName: "",
            FilePath: "",
            lnkbtnDownload: null,
            RLSStatusCode: null,
            CFOApproval: "",
            TreasuryApproval: "",
            CustomerTemplateFileName: "",
            BillingRateType: null,
            ContingencyPerc: null,
            IsLatamDeal: null,
            RookieAndBulgeData: null
          }
        };
        this.isDummyLoader = true;
        this.deals.DPSSubmitAppirioDeal(input).subscribe(
          res => {
            this.isDummyLoader = false;
            if (res.Output.ReturnFlag == "S") {
              this.popUp.throwError(res.Output.ReturnMessage);
              // this.DealCalculation();
              this.deals.UpdateExistingDealsStore();
              this.deals.updateModuleListStore();
              this.GetFillManangeParams(this.calculateTableList[0]);
            } else {
              this.popUp.throwError(res.Output.ReturnMessage);
            }
          },
          () => {
            this.isDummyLoader = false;
            this.popUp.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        );
      }
    });
  }
  RequestSpoc() {
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterData: {
        PricingId: this.calculateTableList[0].MasterData.PricingId,
        TraceOppId: this.calculateTableList[0].MasterData.TraceOppId,
        DealId: this.dealOverview.id,
        DealWonLoss: null,
        DealHeaderNumber: this.calculateTableList[0].MasterData
          .DealHeaderNumber,
        DealVersionId: this.calculateTableList[0].MasterData.DealVersionId,
        DealHeaderName: this.calculateTableList[0].MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: this.calculateTableList[0].MasterData.DOEmailId,
        ModuleCount: this.calculateTableList[0].MasterData.ModuleCount,
        ModuleOwnerEmailId: this.calculateTableList[0].MasterData
          .ModuleOwnerEmailID,
        ModuleBFMEmailId: this.calculateTableList[0].MasterData
          .ModuleBFMEmailId,
        ModulePSPOCEmailId: this.calculateTableList[0].MasterData
          .ModulePSPOCEmailId,
        ModuleId: this.calculateTableList[0].ModuleList[0].ModuleID,
        ModuleNumber: this.calculateTableList[0].ModuleList[0].ModuleNumber,
        ModuleVersionId: null,
        ModuleName: this.calculateTableList[0].ModuleList[0].ModuleName,
        ModuleStatusCode: this.calculateTableList[0].ModuleList[0].ModuleStatus,
        ServiceLines: this.calculateTableList[0].ModuleList[0].ServiceLines,
        OptionId: this.calculateTableList[0].MasterData.OptionId,
        OptionNumber: this.calculateTableList[0].MasterData.OptionNumber,
        OptionName: this.calculateTableList[0].MasterData.OptionName,
        OptionVersionId: this.calculateTableList[0].MasterData.OptionVersionId,
        OptionStatusCode: this.calculateTableList[0].MasterData
          .OptionStatusCode,
        DealStatus: this.dealOverview.status,
        RLSId: this.calculateTableList[0].ModuleList[0].RLSId,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: this.calculateTableList[0].MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.calculateTableList[0].MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.calculateTableList[0].MasterData
          .AddModuleVisible,
        AddModuleMessage: this.calculateTableList[0].MasterData
          .AddModuleVisible,
        FileName: "",
        FilePath: "",
        lnkbtnDownload: null,
        RLSStatusCode: null,
        CFOApproval: "",
        TreasuryApproval: "",
        CustomerTemplateFileName: "",
        BillingRateType: null,
        ContingencyPerc: null,
        IsLatamDeal: null,
        RookieAndBulgeData: null
      }
    };
    this.isDummyLoader = true;
    this.deals.requestSPOC(input).subscribe(
      res => {
        if (res.ReturnFlag == "S") {
          if (res.Output.ReturnFlag == "S") {
            this.disable = true;
            this.isDummyLoader = false;
            let message = res.Output.ReturnMessage;
            let val;
            this.matSnackBar.open(message, val, {
              duration: 2000
            });
          } else {
            this.isDummyLoader = false;
            this.popUp.throwError(res.Output.ReturnMessage);
          }
        } else {
          this.isDummyLoader = false;
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      () => {
        this.isDummyLoader = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  ngOnDestroy() {
    this.calculateDeal$.unsubscribe();
    this.combinedResponse$.unsubscribe();
    this.pastDeal$.unsubscribe();
  }
}

@Component({
  selector: "reset-confirm",
  templateUrl: "./resetConfirmation.html",
  styleUrls: ["./calculate.component.scss"]
})
export class resetConfirmationComponent {
  showconfirmpopup: boolean = false;
  constructor(public dialogRef: MatDialogRef<resetConfirmationComponent>) {
    this.showconfirmpopup = true;
  }
}

@Component({
  selector: "appirio-deal-confirm",
  templateUrl: "./appirioConfirm.html",
  styleUrls: ["./calculate.component.scss"]
})
export class appirioConfirmationComponent {
  appirioDealConfirm: boolean = false;
  constructor(public dialogRef: MatDialogRef<appirioConfirmationComponent>) {
    this.appirioDealConfirm = true;
  }
}

@Component({
  selector: "deal-sub-popup",
  templateUrl: "./deal-submission-popup.html",
  styleUrls: ["./calculate.component.scss"]
})
export class dealSubPopup implements OnInit {
  list;
  close = false;
  radioBtnselected = [];
  cardItems = [];
  constructor(
    public dialogRef: MatDialogRef<dealSubPopup>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
  ngOnInit() {
    console.log("data-->", this.data);
    this.cardItems = this.data;
  }
  closeDiv() {
    this.close = true;
  }
}

@Component({
  templateUrl: "custom-error.component.html"
})
export class CustomErrorComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<CustomErrorComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
