import { Component, OnInit, Inject } from "@angular/core";
import { ErrorMessage, OnlineOfflineService } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DialogData } from "@app/modules/opportunity/pages/renewal-opportunity/renewal-opportunity.component";
import {
  DealOverViewAction,
  ModuleListAction,
  DealParameterListAction,
  DealCoOwnerListAction,
  calculateDeals
} from "@app/core/state/actions/deals.actions";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { Subscription } from "rxjs";
import { RoutingState } from "@app/core/services/navigation.service";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import { DealParameter } from "@app/core/state/selectors/deals/deal-parameter.selectors";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { selectdealCoOwners } from "@app/core/state/selectors/deals/dealCoOwners-list.selector";
import { environment } from "@env/environment";
import { DigitalAssistantService } from "@app/core/services/digital-assistant/digital-assistant.service";

@Component({
  selector: "app-deal-overview",
  templateUrl: "./deal-overview.component.html",
  styleUrls: ["./deal-overview.component.scss"]
})
export class DealOverviewComponent implements OnInit {
  edited = true;
  isLoading: boolean = false;
  submitted: boolean = false;
  dealOverview: any = {};
  OvervieweJSON: any = {};
  pricingTypeList: any = [];
  dealtypeList: any = [];
  summary: { label: string; content: any }[];
  matSnackBar: any;
  overview: any;
  url: any;
  userInfo: any;
  dealDetails: any;
  Roleflags: any;
  EmployeeDetails: any;
  arrowkeyLocation = 0;
  disabledealonwer: boolean;
  originUrl: any;
  subcriber$: Subscription = new Subscription();
  subcriberFillmy$: Subscription = new Subscription();
  dealCoOwnersList$: Subscription = new Subscription();
  getFillManageParams$: Subscription = new Subscription();
  pastDealEnable$: Subscription = new Subscription();
  constructor(
    public _error: ErrorMessage,
    public routingState: RoutingState,
    public store: Store<AppState>,
    public messageService: MessageService,
    public jsonservice: DealJsonService,
    public dialog: MatDialog,
    public daService: DigitalAssistantService,
    private _validate: ValidateforNullnUndefined,
    private deals: dealService,
    private encrDecrService: EncrDecrService,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.pastDealEnable$ = this.messageService
      .getPastDealEnable()
      .subscribe(res => {
        this.originUrl = res.originUrl;
        if (this.originUrl.includes("rlsView")) {
          this.messageService.sendDealCoOwnerMessage(true);
        }
      });
  }

  showEdited() {
    this.edited = !this.edited;
    if (this.edited) {
      this.dealOverviewEdit();
    } else {
      if (
        this.OvervieweJSON.ManageInfo.PricingCategoryCode != "0" &&
        this.OvervieweJSON.ManageInfo.PricingCategoryCode != "---Select---" &&
        this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---" &&
        this.OvervieweJSON.ManageInfo.TypeOfDeal != "0"
      ) {
        this.disabledealonwer = true;
      } else {
        this.disabledealonwer = false;
      }
    }
  }

  async ngOnInit() {
    let dealOverview: any = JSON.parse(
      this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("Dealoverview"),
        "DecryptionDecrip"
      )
    );
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    this.dealDetails = dealOverview;
    console.log("User info-->", this.userInfo);
    console.log("Deal overview", dealOverview);
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterData: {
        PricingId: dealOverview.pricingId
          ? dealOverview.pricingId.toUpperCase()
          : "",
        TraceOppId: dealOverview.oppID || "",
        // OpportunityID: "",
        DealId: dealOverview.id,
        DealHeaderNumber: "",
        DealVersionId: "",
        DealHeaderName: "",
        DOEmailId: dealOverview.DealOwnerEmailId || "",
        ModuleCount: "",
        ModuleOwnerEmailId: "",
        ModuleBFMEmailId: "",
        ModulePSPOCEmailId: "",
        ModuleId: "",
        ModuleVersionId: "",
        ModuleName: "",
        ModuleStatusCode: "",
        OptionId: "",
        OptionNumber: "",
        OptionName: "",
        OptionVersionId: "",
        OptionStatusCode: "",
        RLSId: "",
        RLSVersionId: "",
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: "10.20.40.15",
        GroupCode: "",
        RoleId: "",
        CurrencyCode: "",
        MsaRequired: "0"
      }
    };
    this.getFillManageParams$ = this.store
      .pipe(select(DealParameter))
      .subscribe(res => {
        console.log("res-->", res);
        if (res.dealparameterList != undefined) {
          this.Roleflags = res.dealparameterList.ValidationFlag;
        }
      });
    this.dealCoOwnersList$ = this.store
      .pipe(select(selectdealCoOwners))
      .subscribe(
        res => {
          if (res.dealCoOwnersList != undefined) {
            this.EmployeeDetails = res.dealCoOwnersList.EmployeeList;
          } else {
            if (this.onlineOfflineService.isOnline) {
              console.log("inside online--->");
              this.getCoOwners();
            } else {
              console.log("inside offline---->");
              this.getCoOwners();
            }
          }
        },
        () => {
          this.getCoOwners();
        }
      );
    this.subcriber$ = this.store.pipe(select(selectAllModules)).subscribe(
      res => {
        console.log("Deals overview", res);
        if (res.ModuleList != undefined) {
          console.log("100000000000");
          this.OvervieweJSON = res.ModuleList[1].Output;
          this.dealOverview = res.ModuleList[1].Output.BindHeaderDetail;
          this.daService.iframePage = "OPPORTUNITY_DEALS";
          this.pastDealEnable$ = this.messageService
            .getPastDealEnable()
            .subscribe(res => {
              this.originUrl = res.originUrl;
              console.log("past deal subscription response-->", res);
              if (
                res.originUrl.includes("pastDeal") ||
                res.originUrl.includes("rlsView")
              ) {
                if (res.originUrl == '/deals/rlsView') {
                  this.messageService.sendDealCoOwnerMessage(true);
                }
                this.messageService.sendMessage(false);
              } else {
                if (
                  this.OvervieweJSON.BindHeaderDetail.Status !== "Open" &&
                  this.OvervieweJSON.BindHeaderDetail.Status !== "Calculated"
                ) {
                  this.messageService.sendDealCoOwnerMessage(true);
                } else {
                  this.messageService.sendDealCoOwnerMessage(false);
                }
                this.OvervieweJSON.ModuleList.length > 0
                  ? this.messageService.sendMessage(false)
                  : this.messageService.sendMessage(true);
              }
            });
          let bodyDA = {
            SubVerticalAndFunction:
              res.ModuleList[1].Output.SubVerticalAndFunction,
            page: "OPPORTUNITY_DEALS",
            wipro: true
          };
          this.daService.postMessageData = bodyDA;
          this.daService.postMessage(bodyDA);
          if (
            this.OvervieweJSON.ManageInfo.PricingCategoryCode != "0" &&
            this.OvervieweJSON.ManageInfo.PricingCategoryCode !=
              "---Select---" &&
            this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---" &&
            this.OvervieweJSON.ManageInfo.TypeOfDeal != "0"
          ) {
            console.log("200000000000000");
            this.messageService.sendModuleMessage(false);
          } else {
            console.log("30000000000000");
            this.dialog.open(alertPopUpComponent, {
              width: "400px",
              data: { showDealRevert: false }
            });
            this.edited = false
            this.messageService.sendModuleMessage(true);
          }
          this.pricingTypeList =
            res.ModuleList[1].Output.DropDownMasters.CategoryOfPricing;
          this.dealtypeList =
            res.ModuleList[1].Output.DropDownMasters.DealTypes;
          this.mapOutputData();
        } else {
          console.log("400000000000");
          if (this.onlineOfflineService.isOnline) {
            this.dealOverviewSummary(input);
          }
        }
      },
      error => {
        if (this.onlineOfflineService.isOnline) {
          console.log("5000000000000");
          this.dealOverviewSummary(input);
        }
      }
    );
    // Offline
    if (!this.onlineOfflineService.isOnline) {
      this.isLoading = true;
      const CacheResponse = await this.deals.getDealOverviewCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        console.log("60000000000000000");
        if (CacheResponse.data != undefined) {
          console.log("700000000000000");
          this.isLoading = false;
          this.OvervieweJSON = CacheResponse.data;
          this.dealOverview = CacheResponse.data.BindHeaderDetail;
          this.pricingTypeList = CacheResponse.data.CategoryOfPricing;
          this.dealtypeList = CacheResponse.data.DropDownMasters.DealTypes;
          this.mapOutputData();
        } else {
          console.log("80000000000000");
          this.dealOverviewSummary(input);
        }
      } else {
        console.log("90000000000000000");
        this.dealOverviewSummary(input);
      }
    }
  }
  // For getting the Load Manage Deal API
  dealOverviewSummary(Data) {
    this.isLoading = true;
    this.deals.getOverviewSummary(Data).subscribe(
      res => {
        console.log(res);
        if (res.ReturnCode == "S") {
          this.isLoading = false;
          this.OvervieweJSON = res.Output;
          this.dealOverview = res.Output.BindHeaderDetail;
          this.pricingTypeList = res.Output.DropDownMasters.CategoryOfPricing;
          this.dealtypeList = res.Output.DropDownMasters.DealTypes;
          this.messageService.getPastDealEnable().subscribe(res => {
            console.log("past deal subscription response-->", res);
            if (
              res.originUrl.includes("pastDeal") ||
              res.originUrl.includes("rlsView")
            ) {
              this.messageService.sendMessage(false);
            } else {
              this.OvervieweJSON.ModuleList.length > 0
                ? this.messageService.sendMessage(false)
                : this.messageService.sendMessage(true);
            }
          });
          if (
            this.OvervieweJSON.BindHeaderDetail.Status !== "Open" &&
            this.OvervieweJSON.BindHeaderDetail.Status !== "Calculated"
          ) {
            this.messageService.sendDealCoOwnerMessage(true);
          } else {
            this.messageService.sendDealCoOwnerMessage(false);
          }
          if (
            this.OvervieweJSON.ManageInfo.PricingCategoryCode != "0" &&
            this.OvervieweJSON.ManageInfo.PricingCategoryCode !=
              "---Select---" &&
            this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---" &&
            this.OvervieweJSON.ManageInfo.TypeOfDeal != "0"
          ) {
            this.messageService.sendModuleMessage(false);
          } else {
            // this.dialog.open(alertPopUpComponent);
            this.messageService.sendModuleMessage(true);
          }
          // SBU for DA
          if (res.Output.SubVerticalAndFunction) {
            console.log("Inside Sub vertical");
            // console.log(environment.daUrl);
            console.log(res.Output.SubVerticalAndFunction);
            this.daService.iframePage = "OPPORTUNITY_DEALS";
            let bodyDA = {
              SubVerticalAndFunction: res.Output.SubVerticalAndFunction,
              data: {
                SubVerticalAndFunction: res.Output.SubVerticalAndFunction,
                BindHeaderDetail: res.Output.BindHeaderDetail
              },
              page: "OPPORTUNITY_DEALS",
              wipro: true
            };
            this.daService.postMessageData = bodyDA;
            this.daService.postMessage(bodyDA);
            // console.log(environment.daUrl);
            // window.parent.postMessage(
            //   res.Output.SubVerticalAndFunction,
            //   environment.daUrl
            // );
          } else {
            console.log("subVertical and function not available");
          }

          this.mapOutputData();
          this.getFillManageParameters(this.OvervieweJSON, res);
          this.store.dispatch(
            new DealOverViewAction({ dealoverview: res.Output })
          );
        } else {
          this.isLoading = false;
          this._error.throwError(res.ReturnMessage);
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
  dropDownMaster(resArray: any[]) {
    let input = {
      UserInfo: {
        EmpID: this.userInfo.EmployeeId,
        EmpName: this.userInfo.EmployeeName,
        Adid: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterDataRLS: {
        traceoppid: this.dealDetails.oppID || "",
        dealid: this.dealDetails.id,
        moduleid: "",
        optionid: "",
        rlsid: "",
        dealversion: "",
        optionversion: "",
        moduleversion: "",
        rlsversion: "",
        dealno: "",
        moduleno: "",
        optionno: "",
        rlsno: "",
        passthroughtype: "",
        RLSType: "",
        PricingId: this.dealDetails.pricingId
          ? this.dealDetails.pricingId.toUpperCase()
          : "",
        DealHeaderNumber: "",
        currecyCode: ""
      },
      PassThroughObject: {}
    };
    this.deals.RLSdropdownMastert(input).subscribe(
      Res => {
        console.log(Res);
        if (Res) {
          this.isLoading = false;
          resArray[2] = Res;
          this.store.dispatch(new ModuleListAction({ ModuleList: resArray }));
        }
      },
      error => {
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        this.isLoading = false;
      }
    );
  }

  //For getting the Load Manage Module Response
  getLoadManageModule(data, resArray: any[]) {
    let input = {
      User: {
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeName: this.userInfo.EmployeeName,
        ClientIP: "",
        EmployeeMail: this.userInfo.EmployeeMail,
        EmployeeNumber: this.userInfo.EmployeeNumber
      },
      MasterData: {
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        PricingId: data.MasterData.PricingId,
        DealId: data.MasterData.DealId
      }
    };
    // Calling Service to load the manage module
    this.deals.LoadManageModule(input).subscribe(
      res => {
        if (res) {
          resArray[0] = res;
          let input = {
            UserInfo: {
              EmpID: this.userInfo.EmployeeId,
              EmpName: this.userInfo.EmployeeName,
              Adid: this.userInfo.EmployeeId,
              EmpEmail: this.userInfo.EmployeeMail,
              EmpNo: this.userInfo.EmployeeNumber
            },
            MasterDataRLS: {
              traceoppid: this.dealDetails.oppID || "",
              dealid: this.dealDetails.id,
              moduleid: "",
              optionid: "",
              rlsid: "",
              dealversion: "",
              optionversion: "",
              moduleversion: "",
              rlsversion: "",
              dealno: "",
              moduleno: "",
              optionno: "",
              rlsno: "",
              passthroughtype: "",
              RLSType: "",
              PricingId: this.dealDetails.pricingId
                ? this.dealDetails.pricingId.toUpperCase()
                : "",
              DealHeaderNumber: "",
              currecyCode: ""
            },
            PassThroughObject: {}
          };
          this.deals.RLSdropdownMastert(input).subscribe(
            Res => {
              console.log(Res);
              if (Res) {
                this.isLoading = false;
                resArray[2] = Res;
                this.store.dispatch(
                  new ModuleListAction({ ModuleList: resArray })
                );
              }
            },
            error => {
              this.isLoading = false;
            }
          );
        } else {
          this._error.throwError(res.ReturnMessage);
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

  // For Getting the Fill Manage Deal Parameters
  getFillManageParameters(data, result) {
    console.log("data-->", data);
    this.isLoading = true;
    this.subcriberFillmy$ = this.store.pipe(select(DealParameter)).subscribe(
      res => {
        console.log("Deal Parameters", res);
        if (res.dealparameterList == undefined) {
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
              DealStatus: data.MasterData.Status,
              RLSId: null,
              RLSVersionId: null,
              SourcePage: this.originUrl.includes("pastDeal")
                ? "Pastdeals"
                : "",
              MachineIp: data.MasterData.MachineIp,
              GroupCode: null,
              RoleId: null,
              CurrencyCode: data.MasterData.CurrencyCode,
              MsaRequired: null,
              AmendmentNo: null,
              BFM_PSPOC_Vertical: null,
              ModuleTeamEmailID: null,
              AddModuleVisible: "true",
              AddModuleMessage: "",
              FileName: "",
              FilePath: "",
              lnkbtnDownload: null,
              RLSStatusCode: null,
              CFOApproval: "",
              TreasuryApproval: "",
              CustomerTemplateFileName:
                data.MasterData.CustomerTemplateFileName,
              BillingRateType: null,
              ContingencyPerc: null,
              IsLatamDeal: null,
              RookieAndBulgeData: null
            }
          };
          this.deals.getFillManageParams(input1).subscribe(
            res => {
              console.log("Fill Manage Params Role based-->", res);
              if (res.ReturnFlag == "S") {
                if (
                  res.Output.ReturnFlag == "S" ||
                  res.Output.MasterData.OptionStatusCode == "OCALC"
                ) {
                  this.Roleflags = res.Output.ValidationFlag;
                  if (result.Output.ModuleList.length > 0) {
                    let resArray = [];
                    resArray[0] = undefined;
                    resArray[1] = result;
                    resArray[2] = undefined;
                    this.getLoadManageModule(this.OvervieweJSON, resArray);
                  } else {
                    let resArray = [];
                    let moduleArray = {
                      ReturnFlag: "S",
                      ReturnCode: "S",
                      ReturnMessage: "SUCCESS",
                      Output: []
                    };
                    resArray[0] = moduleArray;
                    resArray[1] = result;
                    resArray[2] = undefined;
                    this.dropDownMaster(resArray);
                  }
                  let encryptData = this.encrDecrService.set(
                    "EncryptionEncryptionEncryptionEn",
                    JSON.stringify(res),
                    "DecryptionDecrip"
                  );
                  sessionStorage.setItem(
                    "getFillManageParameters",
                    encryptData
                  );
                  this.store.dispatch(
                    new DealParameterListAction({
                      dealparameterList: res.Output
                    })
                  );
                } else {
                  this.isLoading = false;
                  this._error.throwError(res.Output.ReturnMessage);
                }
              } else {
                this.isLoading = false;
                this._error.throwError(
                  "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                );
              }
            },
            () => {
              this.isLoading = false;
              this._error.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
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
  revertDeal: boolean;
  mapOutputData() {
    if (
      this._validate.validate(this.dealOverview) &&
      this._validate.validate(this.OvervieweJSON)
    ) {
      console.log(this.OvervieweJSON,"this.OvervieweJSON")
      this.OvervieweJSON.ValidationFlag.btnRevertDeal.Visible === "true"
        ? (this.revertDeal = true)
        : (this.revertDeal = false);
      this.summary = [
        { label: "Deal name", content: this.dealOverview.DealName || "-" },
        { label: "Account", content: this.dealOverview.CustomerName || "-" },
        { label: "SBU", content: this.dealOverview.SBU || "-" },
        {
          label: "Opportunity ID/Amendment No.",
          content: this.dealOverview.OppId_AmendNo || "-"
        },
        {
          label: "Opportunity name",
          content: this.dealOverview.OpportunityName || "-"
        },
        {
          label: "Vertical",
          content: this.dealOverview.Vertical.split("?").join(" ") || "-"
        },
        {
          label: "Pricing ID",
          content: this.OvervieweJSON.MasterData.PricingId || "-"
        },
        {
          label: "Deal version no.",
          content: this.OvervieweJSON.MasterData.DealVersionId || "-"
        },
        { label: "Deal BFM", content: this.dealOverview.BFM || "-" },
        {
          label: "Deal spoc",
          content: this.dealOverview.DealSpoc || "-"
        },
        { label: "Deal currency", content: this.dealOverview.Currency || "-" },
        { label: "Deal status", content: this.dealOverview.Status },
        {
          label: "Pricing approval status",
          content: this.dealOverview.PricingApprovalStatus || "-"
        },
        {
          label: "Deal outcome",
          content:
            (this.OvervieweJSON.MasterData.DealWonLoss != "Old Version"
              ? this.OvervieweJSON.MasterData.DealWonLoss
              : "-") || "-"
        },
        {
          label: "Pricing type",
          content:
            (this.OvervieweJSON.ManageInfo.PricingCategoryName != "---Select---"
              ? this.OvervieweJSON.ManageInfo.PricingCategoryName
              : "-") || "-"
        },
        {
          label: "Deal type",
          content:
            (this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---"
              ? this.OvervieweJSON.ManageInfo.TypeOfDeal
              : "-") || "-"
        }
      ];
      this.OvervieweJSON.AuditLogList = {
        AuditLog: [
          {
            Id: this.OvervieweJSON.MasterData.DealId,
            TableName: "DealHeader",
            ColumnName: "Categoryofpricing",
            OldValue: this.OvervieweJSON.ManageInfo.PricingCategoryName,
            NewValue: this.OvervieweJSON.ManageInfo.PricingCategoryName
          },
          {
            Id: this.OvervieweJSON.MasterData.DealId,
            TableName: "DealHeader",
            ColumnName: "TypeofDeal",
            OldValue: this.OvervieweJSON.ManageInfo.TypeOfDeal,
            NewValue: this.OvervieweJSON.ManageInfo.TypeOfDeal
          }
        ]
      };
    }
  }
  resetOverview() {
    this.OvervieweJSON.AuditLogList = {
      AuditLog: [
        {
          Id: this.OvervieweJSON.MasterData.DealId,
          TableName: "DealHeader",
          ColumnName: "Categoryofpricing",
          OldValue: this.OvervieweJSON.ManageInfo.PricingCategoryName,
          NewValue: this.OvervieweJSON.ManageInfo.PricingCategoryName
        },
        {
          Id: this.OvervieweJSON.MasterData.DealId,
          TableName: "DealHeader",
          ColumnName: "TypeofDeal",
          OldValue: this.OvervieweJSON.ManageInfo.TypeOfDeal,
          NewValue: this.OvervieweJSON.ManageInfo.TypeOfDeal
        }
      ]
    };
  }

  dealOverviewEdit() {
    this.submitted = true;
    if (
      this._validate.validate(
        this.OvervieweJSON.AuditLogList.AuditLog[0].NewValue
      ) &&
      this._validate.validate(
        this.OvervieweJSON.AuditLogList.AuditLog[1].NewValue
      )
    ) {
      this.pricingTypeList.map(x => {
        x.PricingCategoryName ==
        this.OvervieweJSON.AuditLogList.AuditLog[0].NewValue
          ? (this.OvervieweJSON.ManageInfo.PricingCategoryCode =
              x.PricingCategoryCode)
          : null;
      });
      // this.OvervieweJSON.ManageInfo.PricingCategoryCode = this.OvervieweJSON.AuditLogList.AuditLog[0].NewValue;
      this.OvervieweJSON.ManageInfo.TypeOfDeal = this.OvervieweJSON.AuditLogList.AuditLog[1].NewValue;
      var input = {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeNumber
        },
        MasterData: this.OvervieweJSON.MasterData,
        ManageInfo: this.OvervieweJSON.ManageInfo,
        AuditLogList: this.OvervieweJSON.AuditLogList
      };
      console.log(input);
      this.isLoading = true;
      this.deals.editOverviewsDetails(input).subscribe(
        res => {
          if (res) {
            this.isLoading = false;
            if (res.ReturnCode == "S") {
              this._error.throwError(res.Output.ReturnMessage);
              this.OvervieweJSON.ManageInfo = res.Output.ManageInfo;
              this.OvervieweJSON.MasterData = res.Output.MasterData;
              this.OvervieweJSON.ValidationFlag = res.Output.ValidationFlag;
              this.OvervieweJSON.BindHeaderDetail = res.Output.BindHeaderDetail;
              this.dealOverview = res.Output.BindHeaderDetail;
              if (
                this.OvervieweJSON.ManageInfo.PricingCategoryCode != "0" &&
                this.OvervieweJSON.ManageInfo.PricingCategoryCode !=
                  "---Select---" &&
                this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---" &&
                this.OvervieweJSON.ManageInfo.TypeOfDeal != "0"
              ) {
                this.disabledealonwer = true;
                this.messageService.sendModuleMessage(false);
              } else {
                this.disabledealonwer = false;
                this.messageService.sendModuleMessage(true);
              }
              this.mapOutputData();
              this.store.dispatch(
                new DealOverViewAction({ dealoverview: this.OvervieweJSON })
              );
            } else {
              this._error.throwError(res.ReturnMessage);
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
    } else {
      this.edited = false;
      if (
        !this._validate.validate(
          this.OvervieweJSON.AuditLogList.AuditLog[0].NewValue
        ) &&
        this.submitted == true
      ) {
        this._error.throwError("Please select pricing type");
      } else {
        this._error.throwError("Please select deal type");
      }
    }
  }

  // For getting the deal co-owners list
  getCoOwners() {
    let input = {
      DealId: this.dealDetails.id,
      OptionId: this.dealDetails.OptionId,
      ModuleId: null,
      RLSId: null,
      TeamType: "DEALTEAM",
      ReturnFlag: null,
      ReturnMessage: null
    };
    this.deals.displayEmployeeDetails(input).subscribe(
      res => {
        console.log("Display Employee Details-->", res);
        if (res.Output.ReturnFlag == "S") {
          this.EmployeeDetails = res.Output.EmployeeList;
          this.store.dispatch(
            new DealCoOwnerListAction({ dealCoOwnersList: res.Output })
          );
        }
      },
      () => {
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  // DA File Download
  daFileDownload() {
    console.log("clicked", this.OvervieweJSON);

    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeNumber
      },
      MasterData: {
        PricingId: this.OvervieweJSON.MasterData.pricingId,
        TraceOppId: this.OvervieweJSON.MasterData.TraceOppId,
        DealId: this.OvervieweJSON.MasterData.DealId,
        DealWonLoss: null,
        DealHeaderNumber: this.OvervieweJSON.MasterData.DealHeaderNumber,
        DealVersionId: this.OvervieweJSON.MasterData.DealVersionId,
        DealHeaderName: this.OvervieweJSON.MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: this.dealOverview.DealOwnerEmailId,
        ModuleCount: this.OvervieweJSON.MasterData.ModuleCount,
        ModuleOwnerEmailId: this.OvervieweJSON.MasterData.ModuleOwnerEmailId,
        ModuleBFMEmailId: this.OvervieweJSON.MasterData.ModuleBFMEmailId,
        ModulePSPOCEmailId: this.OvervieweJSON.MasterData.ModulePSPOCEmailId,
        ModuleId: null,
        ModuleNumber: null,
        ModuleVersionId: null,
        ModuleName: null,
        ModuleStatusCode: null,
        ServiceLines: null,
        OptionId: this.OvervieweJSON.MasterData.OptionId,
        OptionNumber: this.OvervieweJSON.MasterData.OptionNumber,
        OptionName: this.OvervieweJSON.MasterData.OptionName,
        OptionVersionId: this.OvervieweJSON.MasterData.OptionVersionId,
        OptionStatusCode: "OO",
        DealStatus: null,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: "10.203.36.132",
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.OvervieweJSON.MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: "true",
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
    this.deals.daDocumentDownload(input).subscribe(
      res => {
        if (res.ReturnFlag == "S") {
          console.log("Success response-->", res);
          if (this._validate.validate(res.Output.File)) {
            this.url =
              "https://quapi-dev.wipro.com/Allied.DPS.noCore.Api/api/v1/DPSWcfRestService/Download_DAUploadedFiles?PricingId=" +
              this.OvervieweJSON.MasterData.pricingId +
              "&DealId=" +
              this.OvervieweJSON.MasterData.DealId +
              "&FileName=" +
              res.Output.File.FileName;
            this.isLoading = false;
            let a = document.createElement("a");
            a.href = this.url;
            document.body.appendChild(a);
            a.click();
          } else {
            this._error.throwError(res.Output.ReturnMessage);
          }
        } else {
          this._error.throwError(res.ReturnMessage);
        }
      },
      error => {
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.subcriber$.unsubscribe();
    this.subcriberFillmy$.unsubscribe();
    this.dealCoOwnersList$.unsubscribe();
    this.getFillManageParams$.unsubscribe();
    this.pastDealEnable$.unsubscribe();
  }

  edit = [
    { label: "Deal name", placeholder: "01082018_123_syn_test" },
    { label: "Account", placeholder: "Ringo Steel-New" },
    { label: "SBU", placeholder: "FS" },
    { label: "Opportunity ID/Amendment No.", placeholder: "OPP5200142" },
    { label: "Opportunity name", placeholder: "TSSC support" },
    { label: "Vertical", placeholder: "GCSP" },
    { label: "Pricing ID", placeholder: "PR656747487698" },
    { label: "Deal version no.", placeholder: "1" },
    { label: "Deal BFM", placeholder: "-" },
    { label: "Deal spoc", placeholder: "Rajeev G Menon" },
    { label: "Deal currency", placeholder: "AUD" },
    { label: "Deal status", placeholder: "Submitted for approval" },
    { label: "Pricing approval status", placeholder: "In progress" },
    { label: "Deal outcome", placeholder: "-" }
    // { label: 'Pricing type', placeholder: 'Fixed price' },
    // { label: 'Deal type', placeholder: 'Application development' }
  ];

  /****************** linked autocomplete code start ****************** */

  // showdependent: boolean = false;
  // dependent: string;
  // dependentSwitch: boolean = true;

  // dependentclose() {
  //   this.dependentSwitch = false;
  // }
  // appenddependent(value: string, i) {
  //   this.dependent = value;
  //   this.selecteddependent.push(this.dependentArr[i]);
  // }

  // dependentArr: {}[] = [
  //   { index: 0, contact: "Activity_prime_studio_zenith", value: true },
  //   { index: 1, contact: "Activity_enigma_2019", value: false },
  //   { index: 3, contact: "Activity_prime_studio_zenith", value: false },
  //   { index: 4, contact: "Activity_enigma_2019", value: false },
  //   { index: 5, contact: "Activity_prime_studio_zenith", value: false },
  //   { index: 6, contact: "Activity_enigma_2019", value: false }
  // ];

  // selecteddependent: {}[] = [];

  /****************** linked autocomplete code end ****************** */

  /****************** deal owner autocomplete code start ****************** */

  // showdealOwner: boolean = false;
  // DOwner: string = "";
  // DealOwnerSwitch: boolean = true;

  // DealOwnerClose() {

  //   this.DealOwnerSwitch = false;
  // }

  // appendDealOwner(value: string) {

  //   this.DOwner = value;

  //   this.DealOwnerSwitch = true;

  // }

  // DOwners: {}[] = [

  //   { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  //selectedDealOwner: {}[] = [];

  /****************** deal owner autocomplete code end ****************** */

  /****************** co owners autocomplete code start ****************** */
  // coOwner: string;

  //   coOwnerFlag: boolean;

  //   appendOpportunity(value: string, i) {

  //     this.coOwner = value;
  //     this.selectedcoOwner.push(this.coOwnerCollection[i])
  //   }

  //   coOwnerCollection: {}[] = [

  //     { index: 0, contact: 'Singtel opportunity 01 name', initials: 'SO', value: true },
  //     { index: 1, contact: 'Singtel opportunity 02 name', initials: 'SO', value: false },
  //     { index: 2, contact: 'Singtel opportunity 03 name', initials: 'SO', value: false },
  //     { index: 3, contact: 'Singtel opportunity 04 name', initials: 'SO', value: false },
  //   ]

  //   selectedcoOwner: {}[] = [];

  /****************** co owners autocomplete code end ****************** */
  revertDealStatus() {
    const dialogRef = this.dialog.open(alertPopUpComponent, {
      width: "400px",
      data: { showDealRevert: true }
    });
    dialogRef.afterClosed().subscribe(obj => {
      console.log("object-->", obj);
      if (obj == true) {
        let input = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            AdId: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeId,
            EmpNo: this.userInfo.EmployeeNumber
          },
          MasterData: {
            PricingId: this.dealDetails.pricingId
              ? this.dealDetails.pricingId.toUpperCase()
              : "",
            TraceOppId: this.dealDetails.oppID || "",
            // OpportunityID: "",
            DealId: this.dealDetails.id,
            DealHeaderNumber: this.dealDetails.DealHeaderNumber || "",
            DealVersionId: this.OvervieweJSON.MasterData.DealVersionId || "",
            DealHeaderName: this.dealDetails.DealHeaderName || "",
            DOEmailId: this.dealDetails.DealOwnerEmailId || "",
            ModuleCount: "",
            ModuleOwnerEmailId: "",
            ModuleBFMEmailId: "",
            ModulePSPOCEmailId: "",
            ModuleId: "",
            ModuleVersionId: "",
            ModuleName: "",
            ModuleStatusCode: "",
            OptionId: this.dealDetails.OptionId || "",
            OptionNumber: this.dealDetails.OptionNumber || "",
            OptionName: "",
            OptionVersionId:
              this.OvervieweJSON.MasterData.OptionVersionId || "",
            OptionStatusCode: "",
            RLSId: "",
            RLSVersionId: "",
            SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
            MachineIp: "10.20.40.15",
            GroupCode: "",
            RoleId: "",
            CurrencyCode: "",
            MsaRequired: "0"
          }
        };
        this.isLoading = true;
        this.deals.revertdealDetails(input).subscribe(
          (res: any) => {
            if (res) {
              if (res.ReturnCode == "S") {
                this._error.throwError(res.Output.ReturnMessage);
                this.OvervieweJSON.ManageInfo = res.Output.ManageInfo;
                this.OvervieweJSON.MasterData = res.Output.MasterData;
                this.OvervieweJSON.ValidationFlag = res.Output.ValidationFlag;
                this.OvervieweJSON.BindHeaderDetail =
                  res.Output.BindHeaderDetail;
                this.dealOverview = res.Output.BindHeaderDetail;
                if (
                  this.OvervieweJSON.ManageInfo.PricingCategoryCode != "0" &&
                  this.OvervieweJSON.ManageInfo.PricingCategoryCode !=
                    "---Select---" &&
                  this.OvervieweJSON.ManageInfo.TypeOfDeal != "---Select---" &&
                  this.OvervieweJSON.ManageInfo.TypeOfDeal != "0"
                ) {
                  this.disabledealonwer = true;
                  this.messageService.sendModuleMessage(false);
                } else {
                  this.disabledealonwer = false;
                  this.messageService.sendModuleMessage(true);
                }
                this.mapOutputData();
                this.store.dispatch(
                  new DealOverViewAction({ dealoverview: this.OvervieweJSON })
                );
                this.store.dispatch(
                  new calculateDeals({ calculateDeal: undefined })
                );
                this.store.dispatch(
                  new DealParameterListAction({
                    dealparameterList: undefined
                  })
                );
                const newDealId = this.encrDecrService.get(
                  "EncryptionEncryptionEncryptionEn",
                  sessionStorage.getItem("Dealoverview"),
                  "DecryptionDecrip"
                );
                const getdealId = JSON.parse(newDealId);
                getdealId["id"] = res.Output.MasterData["DealId"];
                console.log(newDealId, "newDealId");
                let newencryptData = this.encrDecrService.set(
                  "EncryptionEncryptionEncryptionEn",
                  JSON.stringify(getdealId),
                  "DecryptionDecrip"
                );
                sessionStorage.setItem("Dealoverview", newencryptData);
                this.getFillManageParameters(this.OvervieweJSON, res);
                this.deals.updateModuleListStore();
                this.deals.UpdateExistingDealsStore();
                this.isLoading = false;
              } else {
                this._error.throwError(res.ReturnMessage);
                this.isLoading = false;
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
    });
  }
}

@Component({
  selector: "alert-popup",
  templateUrl: "./Alert-popup.html",
  styleUrls: ["./deal-overview.component.scss"]
})
export class alertPopUpComponent implements OnInit {
  dealRevertDisplay: boolean;
  constructor(
    public dialogRef: MatDialogRef<alertPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const element: any = data;
    this.dealRevertDisplay = element.showDealRevert;
  }
  ngOnInit() {
    console.log("data", this.data);
  }
  revertSelected() {
    this.dialogRef.close(true);
  }
}
