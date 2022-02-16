import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  DataCommunicationService,
  ErrorMessage,
  OnlineOfflineService
} from "@app/core";
import { Router } from "@angular/router";
import { dealService } from "@app/core/services/deals.service";
import { MatDialog, MatDialogRef } from "@angular/material/";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { RoutingState } from "@app/core/services/navigation.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { Subscription } from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { AppState } from "@app/core/state";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  DealCoOwnerListAction,
  DealParameterListAction,
  calculateDeals
} from "@app/core/state/actions/deals.actions";
import { DealRoleService } from "@app/core/services/deals/deals-role.service";
import { RefrenceDocStatusService } from "@app/core/services/datacomm/data-comm.service";
import { FacadeService } from "@app/core/services/facade.service";

const config = {
  generalErrMsg:
    "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
};

@Component({
  selector: "app-existing-deal-details",
  templateUrl: "./existing-deal-details.component.html",
  styleUrls: ["./existing-deal-details.component.scss"]
})
export class ExistingDealDetailsComponent implements OnInit, OnDestroy {
  deal: any;
  totalAttachDoc: number = 0;
  previousUrl: any;
  enableCoOwner: boolean = false;
  enableCommercial: boolean = false;
  enableModule: boolean = false;
  subscription$: Subscription = new Subscription();
  moduleSubcription$: Subscription = new Subscription();
  coOwnerSubscription$: Subscription = new Subscription();
  dealName: string;
  AccOverview: boolean = true;
  AccModule: boolean;
  AccCommercials: boolean;
  AccProposal: boolean;
  AccDealTracker: boolean;
  tabVisibility: boolean = false;
  originUrl: string = "";
  pastDealEnable$: Subscription = new Subscription();
  constructor(
    public service: DataCommunicationService,
    public router: Router,
    public dialog: MatDialog,
    private dealService: dealService,
    private encrDecrService: EncrDecrService,
    public routingState: RoutingState,
    public messageService: MessageService,
    public _error: ErrorMessage,
    public dealRoleService: DealRoleService,
    public refrenceDocStatusService: RefrenceDocStatusService, //public state: RouterStateSnapshot
    public facadeService: FacadeService
  ) {
    this.subscription$ = this.messageService.getMessage().subscribe(message => {
      this.enableCommercial = message;
    });
    this.moduleSubcription$ = this.messageService
      .getModuleMessage()
      .subscribe(message => {
        this.enableModule = message;
      });
    this.coOwnerSubscription$ = this.messageService
      .getDealCoOwnerMessage()
      .subscribe(message => {
        this.enableCoOwner = message;
        console.log("co owner boolean-->", this.enableCoOwner);
      });
    this.pastDealEnable$ = this.messageService
      .getPastDealEnable()
      .subscribe(res => {
        console.log("res from behaviour subject-->", res);
        if (
          res.originUrl.includes("pastDeal") ||
          res.originUrl.includes("rlsView")
        ) {
          this.originUrl = res.originUrl;
          this.enableCommercial = false;
          this.tabVisibility = true;
        }
      });
    this.dealName = sessionStorage.getItem("DealName");
  }

  ngOnInit() {
    this.deal = JSON.parse(
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
    this.getTotalAttachDoc();
    console.log("deal overview info-->", this.deal);
    console.log("Previous url-->", this.routingState.getPreviousUrl());
    this.previousUrl = this.routingState.getPreviousUrl();
    this.roleCheck();
  }
  showAccOverview() {
    this.AccOverview = true;
    this.AccModule = false;
    this.AccCommercials = false;
    this.AccProposal = false;
    this.AccDealTracker = false;
  }
  showAccModule() {
    this.AccOverview = false;
    this.AccModule = true;
    this.AccCommercials = false;
    this.AccProposal = false;
    this.AccDealTracker = false;
  }
  showAccCommercials() {
    this.AccOverview = false;
    this.AccModule = false;
    this.AccCommercials = true;
    this.AccProposal = false;
    this.AccDealTracker = false;
    this.pastDealEnable$ = this.messageService
      .getPastDealEnable()
      .subscribe(res => {
        if (res.originUrl.includes("rlsView")) {
          this.router.navigate([
            "/deals/existingTabs/commercial/commlanding/viewEdit/dealCriteria"
          ]);
        } else {
          this.router.navigate([
            "/deals/existingTabs/commercial/commlanding/uploadRLS"
          ]);
        }
      });
  }
  showAccProposal() {
    this.AccOverview = false;
    this.AccModule = false;
    this.AccCommercials = false;
    this.AccProposal = true;
    this.AccDealTracker = false;
  }
  showAccDealTracker() {
    this.AccOverview = false;
    this.AccModule = false;
    this.AccCommercials = false;
    this.AccProposal = false;
    this.AccDealTracker = true;
  }
  getTotalAttachDoc() {
    var inputData = {
      Id: this.deal.id,
      LastRecordId: "0",
      PageSize: 100,
      Parent: 0
    };
    this.dealService.listFolder(inputData).subscribe(res => {
      if (!res.Error) {
        this.refrenceDocStatusService.setBehaviorView(true);
        this.totalAttachDoc = res.ResponseObject.filter(
          x => x.IsFolder === false
        ).length;
      }
    });
  }

  // MORE ACTION STARTS **************
  showContent: boolean = false;

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  // MORE ACTION ENDS *******************

  onAttachDocument() {
    this.router.navigate([
      "/deals/attachedDocs",
      { returnUrl: this.router.routerState.snapshot.url }
    ]);
  }

  // do not delete its required to check role in sprint 5A
  userInfo: any;
  roleCheck() {
    try {
      let payload = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId,
        DealId: this.deal.id
      };
      this.dealService.getDealSpecificRole(payload).subscribe(res => {
        if (res.ReturnFlag == "S") {
          this.dealRoleService.setRole(res);
        }
      });
    } catch {
      console.log(config.generalErrMsg);
      this._error.throwError(config.generalErrMsg);
    }
  }

  navTo() {
    console.log("previous url-->", this.previousUrl);
    if (this.previousUrl.includes("existing")) {
      this.router.navigate(["/deals/deal/existing/"]);
    } else if (this.previousUrl.includes("pastDeal")) {
      this.router.navigate(["/deals/pastDeal"]);
    } else if (this.previousUrl.includes("rlsView")) {
      this.router.navigate(["/deals/rlsView"]);
    } else {
      this.router.navigate(["/deals/deal/existing/"]);
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.moduleSubcription$.unsubscribe();
    this.coOwnerSubscription$.unsubscribe();
  }
  showAssignPop() {
    const dialogRef = this.dialog.open(assignpopComponent, {
      width: "396px"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("Deal co-owner added-->", res);
      }
    });
  }
}

@Component({
  selector: "assign-popup",
  templateUrl: "./assign-popup.html",
  styleUrls: ["./existing-deal-details.component.scss"]
})
export class assignpopComponent implements OnInit, OnDestroy {
  customerName: string = "";
  customerNameSwitch: boolean = true;
  customerContact: any = [];
  selectedCustomerDeal: any = [];
  manageDealHeaders: any;
  employeeNumber: any;
  employeeMail: any;
  employeeId: any;
  userInfo: any;
  AssignDealOwnerForm: FormGroup;
  isDealOwnersSearchLoading: boolean = false;
  combinedResponse$: Subscription = new Subscription();
  isLoading: boolean = false;
  arrowkeyLocation = 0;
  @ViewChild("coOwnerList") coOwnerList: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<assignpopComponent>,
    public deals: dealService,
    public service: DataCommunicationService,
    public encrDecrService: EncrDecrService,
    public fb: FormBuilder,
    public popUp: ErrorMessage,
    public messageService: MessageService,
    public store: Store<AppState>,
    public onlineOfflineService: OnlineOfflineService
  ) {
    this.AssignDealOwnerForm = this.fb.group({
      customerName: [""]
    });
  }

  ngOnInit() {
    this.AssignDealOwner();
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    this.combinedResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(async res => {
        console.log("store res-->", res);
        if (res.ModuleList != undefined) {
          this.manageDealHeaders = res.ModuleList[1].Output;
        } else {
          if (this.onlineOfflineService.isOnline) {
            const CacheResponse = await this.deals.getModuleListCacheData();
            console.log("CacheResponse-->", CacheResponse);
            if (CacheResponse) {
              if (CacheResponse.data[1].length > 0) {
                this.manageDealHeaders = CacheResponse.data[1].Output;
              }
            }
          }
        }
      });
  }
  // Function to load data initially
  userSearchMethod(val) {
    this.customerContact = [];
    this.isDealOwnersSearchLoading = true;
    this.deals.searchWiproEmployees(val).subscribe(
      res => {
        this.isDealOwnersSearchLoading = false;
        if (!res.IsError) {
          this.customerContact = res.ResponseObject;
        } else {
          // this.popUp.throwError(
          //   "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          // );
          this.customerContact = [];
        }
      });
  }
  // Function to check the form value changes
  AssignDealOwner() {
    this.customerContact = [];
    this.isDealOwnersSearchLoading = true;
    this.AssignDealOwnerForm.get("customerName")
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(res => {
        if (res === "") {
          res = "a";
        }
        this.userSearchMethod(res);
      });
  }

  ownerSearchClose() {
    this.customerNameSwitch = false;
  }

  appendDealOwner(item: any) {
    console.log("appended contact-->", item);
    this.selectedCustomerDeal = [];
    this.customerName = item.FullName;
    this.employeeNumber = item.AdId ? item.AdId.substring(2) : "";
    this.employeeMail = item.Email;
    this.employeeId = item.AdId;
    this.selectedCustomerDeal.push(item);
    this.AssignDealOwnerForm.patchValue({
      customerName: ""
    });
    this.customerNameSwitch = false;
  }

  deleteDealOwner() {
    this.customerName = "";
    this.employeeNumber = "";
    this.employeeMail = "";
    this.employeeId = "";
    this.selectedCustomerDeal = [];
    this.customerContact = [];
    this.AssignDealOwnerForm.patchValue({
      customerName: ""
    });
  }

  checkValidation() {
    this.customerName != null && this.customerName != ""
      ? this.AssignDealOwnerForm.controls.customerName.setErrors(null)
      : this.AssignDealOwnerForm.controls.customerName.setErrors({
          required: true
        });
  }

  submit() {
    console.log("Assign deal owner form--->", this.AssignDealOwnerForm);
    this.checkValidation();
    if (this.AssignDealOwnerForm.valid) {
      this.isLoading = true;
      let input = {
        UserInfo: {
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeNumber,
          EmpName: this.userInfo.EmployeeName,
          EmpNo: this.userInfo.EmployeeNumber
        },
        MasterData: {
          PricingId: this.manageDealHeaders.MasterData.PricingId,
          TraceOppId: this.manageDealHeaders.MasterData.TraceOppId,
          DealId: this.manageDealHeaders.MasterData.DealId,
          DealWonLoss: null,
          DealHeaderNumber: this.manageDealHeaders.MasterData.DealHeaderNumber,
          DealVersionId: this.manageDealHeaders.MasterData.DealVersionId,
          DealHeaderName: this.manageDealHeaders.MasterData.DealHeaderName,
          DealValue: null,
          DOEmailId: this.manageDealHeaders.MasterData.DOEmailId,
          ModuleCount: this.manageDealHeaders.MasterData.ModuleCount,
          ModuleOwnerEmailId: this.manageDealHeaders.MasterData
            .ModuleOwnerEmailId,
          ModuleBFMEmailId: this.manageDealHeaders.MasterData.ModuleBFMEmailId,
          ModulePSPOCEmailId: this.manageDealHeaders.MasterData
            .ModulePSPOCEmailId,
          ModuleId: null,
          ModuleNumber: null,
          ModuleVersionId: null,
          ModuleName: null,
          ModuleStatusCode: null,
          ServiceLines: null,
          OptionId: this.manageDealHeaders.MasterData.OptionId,
          OptionNumber: this.manageDealHeaders.MasterData.OptionNumber,
          OptionName: this.manageDealHeaders.MasterData.OptionName,
          OptionVersionId: this.manageDealHeaders.MasterData.OptionVersionId,
          OptionStatusCode: this.manageDealHeaders.MasterData.OptionStatusCode,
          DealStatus: this.manageDealHeaders.BindHeaderDetail.Status,
          RLSId: null,
          RLSVersionId: null,
          SourcePage: "",
          MachineIp: this.manageDealHeaders.MasterData.MachineIp,
          GroupCode: null,
          RoleId: null,
          CurrencyCode: this.manageDealHeaders.MasterData.CurrencyCode,
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
        },
        EmployeeList: [
          {
            EmployeeNumber: this.employeeNumber,
            EmployeeName: this.customerName,
            EmployeeId: this.employeeId,
            EmployeeMail: this.employeeMail
          }
        ]
      };
      this.deals.addDealCoOwner(input).subscribe(
        res => {
          console.log("Response after adding the deal co-owner-->", res);
          if (res.ReturnFlag == "S") {
            if (res.Output.ReturnFlag == "S") {
              this.isLoading = false;
              this.getDealCoOwners();
              this.dialogRef.close();
            } else {
              this.isLoading = false;
              this.popUp.throwError(res.Output.ReturnMessage);
              this.dialogRef.close();
            }
          } else {
            this.isLoading = false;
            this.popUp.throwError(res.ReturnMessage);
            this.dialogRef.close();
          }
        },
        () => {
          this.isLoading = false;
          this.dialogRef.close();
        }
      );
    } else {
      this.isLoading = false;
      this.service.validateAllFormFields(this.AssignDealOwnerForm);
    }
  }

  getDealCoOwners() {
    let input = {
      DealId: this.manageDealHeaders.MasterData.DealId,
      OptionId: this.manageDealHeaders.MasterData.OptionId,
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
          this.store.dispatch(
            new DealCoOwnerListAction({ dealCoOwnersList: res.Output })
          );
          this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
          this.popUp.throwError("Deal co-owner added successfully");
          this.getFillManangeParams(this.manageDealHeaders);
        } else {
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

  getFillManangeParams(data) {
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
        DealStatus: this.manageDealHeaders.BindHeaderDetail.Status,
        RLSId: null,
        RLSVersionId: null,
        SourcePage: "",
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
        if (res.ReturnFlag == "S") {
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
        } else {
          this.isLoading = false;
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

  ngOnDestroy() {
    this.combinedResponse$.unsubscribe();
  }
}
