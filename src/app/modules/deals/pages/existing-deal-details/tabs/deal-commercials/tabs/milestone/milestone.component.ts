import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataCommunicationService } from "@app/core/services/global.service";
import { dealService } from "@app/core/services/deals.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { MatSnackBar } from "@angular/material";
import { ErrorMessage, OnlineOfflineService } from "@app/core/services";
import { Observable, of, Subscription } from "rxjs";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { MilestoneAction } from "@app/core/state/actions/deals.actions";
import { MilestoneDisplay } from "@app/core/state/selectors/deals/milestone.selectors";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";

@Component({
  selector: "app-milestone",
  templateUrl: "./milestone.component.html",
  styleUrls: ["./milestone.component.scss"]
})
export class MilestoneComponent implements OnInit, OnDestroy {
  milestoneTable = [];
  fileData: any;
  selectedFile: any;
  isLoading: boolean = false;
  uploadLoader: boolean = false;
  showAMileStoneUploadBtn: boolean = false;
  showRequestSpocBtn: boolean = false;
  showSubmitAllBtn: boolean = false;
  url: any;
  leadTime: any;
  DSODays: any;
  panelOpenState;
  userInfo: any;
  prePopulated: any;
  moduleHeaderDetails: any;
  LoadmoduleList: any;
  leadDisable: boolean = true;
  uploadedSuccess: boolean = false;
  editButton: boolean = true;
  fillManageParams$: Subscription = new Subscription();
  mileStoneDisplay$: Subscription = new Subscription();
  moduleResponse$: Subscription = new Subscription();
  combinedResponse$: Subscription = new Subscription();

  //service data
  milestonedata1 = [];
  MilestoneRequestBody = {
    PageSize: 10,
    RequestedPageNumber: 1,
    OdatanextLink: ""
  };
  tableTotalCount: number = 0;
  dealOverview: any;
  manageDealOverview: any;
  prepop: any;
  leadTimeObject: any = { value: "" };
  constructor(
    public service: DataCommunicationService,
    private _validate: ValidateforNullnUndefined,
    private userdat: dealService,
    public deals: dealService,
    public encrDecrService: EncrDecrService,
    public matSnackBar: MatSnackBar,
    public milestone: dealService,
    public popUp: ErrorMessage,
    public onlineOfflineService: OnlineOfflineService,
    public store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  //filedownload milestone

  fileDownload() {
    this.isLoading = true;

    let input = {
      filename: "MileStoneUpload.xlsx",
      folderName: "ExcelTemplates"
    };
    this.milestone.downloadFileMilestone(input).subscribe(
      res => {
        if (res.ReturnFlag == "S") {
          console.log("Success response-->", res);
          this.url = res.Output;
          this.isLoading = false;
          let a = document.createElement("a");
          a.href = this.url;
          document.body.appendChild(a);
          a.click();
        } else {
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      error => {
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        this.isLoading = false;
      }
    );
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

    this.moduleResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(res => {
        console.log("store res-->", res);
        this.manageDealOverview = res.ModuleList[1].Output;
        console.log(this.manageDealOverview.BindHeaderDetail.Status)

        let status = this.manageDealOverview.BindHeaderDetail.Status;
        console.log("Status: ", status);
        if(status == 'Approved' || status == 'Submitted for Approval'){
          this.editButton = false;
        }
      });
    this.combinedResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(async res => {
        console.log("store res-->", res);
        if (res.ModuleList != undefined) {
          this.moduleHeaderDetails = res.ModuleList[1].Output;
          this.LoadmoduleList = res.ModuleList[1].Output.ModuleList;
        }
      });
    this.userInfo = JSON.parse(userInfo);
    console.log("User info-->", this.userInfo);
    let fillmanageparmsInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("getFillManageParameters"),
      "DecryptionDecrip"
    );
    const paramsinfo = JSON.parse(fillmanageparmsInfo);
    paramsinfo.Output.ValidationFlag.btnMileStoneUpload.Visible == "true"
      ? (this.showAMileStoneUploadBtn = true)
      : (this.showAMileStoneUploadBtn = false);
    paramsinfo.Output.ValidationFlag.btnRequestSpoc.Visible == "true"
      ? (this.showRequestSpocBtn = true)
      : (this.showRequestSpocBtn = false);
    paramsinfo.Output.ValidationFlag.btnSubmitALL.Visible == "true"
      ? (this.showSubmitAllBtn = true)
      : (this.showSubmitAllBtn = false);

    this.mileStoneDisplay$ = this.store
      .pipe(select(MilestoneDisplay))
      .subscribe(res => {
        console.log(res);
        if (res.MilestoneDisplay) {
          if (res.MilestoneDisplay.length > 0) {
            console.log("inside condition");
            console.log(res.MilestoneDisplay);
            this.milestoneTable = res.MilestoneDisplay;
            this.leadTime = res.leadtime;
            this.DSODays = res.dsodays;
            this.MilestoneRequestBody.PageSize = this.milestoneTable.length;
            this.tableTotalCount = this.milestoneTable.length;
          } else {
            if (this.onlineOfflineService.isOnline) {
              this.milstoneList();
            }
          }
        } else {
          if (this.onlineOfflineService.isOnline) {
            this.milstoneList();
          }
        }
      });
    // offline
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getMilestoneListCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.milestoneTable = CacheResponse.data;
          this.MilestoneRequestBody.PageSize = CacheResponse.data.length;
          this.tableTotalCount = CacheResponse.data.length;
        }
      }
    }

    console.log(this.dealOverview);
  }

  milstoneList() {
    this.isLoading = true;
    let input = {
      MilestoneSubmitData: {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeId
        },
        Dealid: this.dealOverview.id,
        prePopulated: {}
      }
    };
    let originalArray1 = this.userdat.getMileStoneList(input);
    originalArray1.subscribe(x1 => {
      console.log("x1-->", x1);
      this.isLoading = false;
      this.leadTime = x1.Output.Leadtime;
      this.DSODays = x1.Output.DSODays;
      //   this.milestonedata1 = x1;
      console.log(this.DSODays, "dso daysssss");
      this.milestoneTable = this.getMappedData(x1.Output.prePopulated);
      this.milestoneTable;
      console.log(x1.Output.prePopulated);
      this.store.dispatch(
        new MilestoneAction({
          Milestone: this.milestoneTable,
          leadtime: this.leadTime,
          dsodays: this.DSODays
        })
      );
      console.log("originalArray1-->", this.milestoneTable);
    });
  }
  disableleadtime: boolean = true;
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(childActionRecieved);
    actionRequired.objectRowData.editStatus == true ||
    actionRequired.action == "Error"
      ? (this.disableleadtime = false)
      : (this.disableleadtime = true);
    actionRequired.action == "Error" &&
    (this.leadTime == null ||
      this.leadTime == undefined ||
      this.leadTime == "0" ||
      this.leadTime == 0)
      ? this.popUp.throwError("Lead time to pay cannot be blank or Zero")
      : "";
    switch (actionRequired.action) {
      case "saveAll": {
        // if(!this.leadTime){
        //   this.popUp.throwError("LEAD TIME SHOULD NOT BE ZERO");
        //   return;
        // }
        console.log(actionRequired.objectRowData);
        //  this.prepop = this.convertData(actionRequired.objectRowData);
        console.log(this.leadTime, "this.leadTime");
        if (
          this.leadTime != null &&
          this.leadTime != undefined &&
          this.leadTime != undefined &&
          this.leadTime != "0" &&
          this.leadTime != 0
        ) {
          console.log("this.leadTime is correct");
          let prepopdata = [];
          actionRequired.objectRowData.map(element => {
            let convertdata = [];
            let obj = {};
            let Slnoobj = {};
            let Milestoneobj = {};
            let Breakupprec = {};
            let timework = {};
            Slnoobj["value"] = element.id;
            Slnoobj["code"] = element.id;
            Slnoobj["elementID"] = "SLNO";
            Milestoneobj["value"] = element.Milestone ? element.Milestone : "";
            Milestoneobj["code"] = element.Milestone ? element.Milestone : "";
            Milestoneobj["elementID"] = "MILESTONE";
            Breakupprec["value"] = element.breakUp ? element.breakUp : "";
            Breakupprec["code"] = element.breakUp ? element.breakUp : "";
            Breakupprec["elementID"] = "BREAKUPPERCENTAGE";
            timework["value"] = element.Work ? element.Work : "";
            timework["code"] = element.Work ? element.Work : "";
            timework["elementID"] = "TIMEWORK";
            convertdata.push(Slnoobj, Milestoneobj, Breakupprec, timework);
            obj["data"] = convertdata;
            prepopdata.push(obj);
          });
          let input = {
            MilestoneSubmitData: {
              UserInfo: {
                EmpNo: this.userInfo.EmployeeId,
                EmpName: this.userInfo.EmployeeName,
                AdId: this.userInfo.EmployeeId,
                EmpEmail: this.userInfo.EmployeeMail
              },
              Dealid: this.dealOverview.id,
              Optionid: this.dealOverview.OptionId,
              Leadtime: this.leadTime,
              prePopulated: prepopdata
            }
          };
          this.isLoading = true;
          console.log(JSON.stringify(prepopdata));
          console.log(JSON.stringify(input));
          let res = this.userdat.mileStoneDataSave(input);
          res.subscribe(
            x1 => {
              console.log("x1-->", x1);
              this.isLoading = false;
              this.leadTime = x1.Output.Leadtime;
              console.log(this.leadTime, "leaddfghjkAsD");
              this.DSODays = x1.Output.DSODays;
              console.log(this.DSODays, "dso daysssss");
              this.milestoneTable = this.getMappedData(x1.Output.prePopulated);
              if (x1.ReturnCode == "S") {
                console.log("Succes response-->", res);
                let message = x1.Output.ReturnMessage;
                let val;
                this.leadTime = x1.Output.Leadtime;
                this.matSnackBar.open(message, val, {
                  duration: 2000
                });
                this.store.dispatch(
                  new MilestoneAction({
                    Milestone: this.milestoneTable,
                    leadtime: this.leadTime,
                    dsodays: this.DSODays
                  })
                );
              } else {
                this.popUp.throwError(x1.ReturnMessage);
              }
            },
            error => {
              this.popUp.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
        } else {
          console.log("this.leadTime is incorrect");
          this.disableleadtime = false;
          this.popUp.throwError("Lead time to pay cannot be blank or Zero");
        }

        return of("save Trigger");
      }
    }
  }

  getMappedData(response) {
    console.log(response, "response....");
    if (response.length > 0) {
      let Output = [];
      let indexId = 1;
      this.MilestoneRequestBody.PageSize = response.length;
      this.tableTotalCount = response.length;
      response.map((x, index) => {
        let obj = {
          id: x.data[0].value,
          Milestone: x.data[1].value,
          breakUp: x.data[2].value,
          Work: x.data[3].value,
          index: indexId
        };
        Output.push(obj);
        indexId = indexId + 1;
      });
      return Output;
    } else {
      return [{}];
    }
  }

  // file upload
  fileUpload(event: any) {
    let fd: FormData = new FormData();
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      if (this.validateFile(file.name)) {
        if (this.milestoneTable[0].Milestone == "") {
          this.uploadLoader = true;
          fd.append("dealid", this.dealOverview.id);
          fd.append("optionid", this.dealOverview.OptionId);
          fd.append("paymentterms", "0");
          fd.append("userid", this.userInfo.EmployeeId);
          fd.append("filename", file.name);
          fd.append("file", file);
          this.userdat.uploadFileMilestone(fd).subscribe(
            res => {
              if (res.ReturnFlag == "S") {
                console.log("inside if....");
                if (res.Output.ReturnFlag == "S") {
                  this.uploadLoader = false;
                  this.uploadedSuccess = true;
                  this.popUp.throwError(res.Output.ReturnMessage);
                  this.milstoneList();
                } else {
                  this.uploadLoader = false;
                  this.popUp.throwError(res.Output.Errors[0].ErrorMessage + ". " + res.Output.ReturnMessage);
                }
              } else {
                this.uploadLoader = false;
                let message = res.ReturnMessage;
                this.popUp.throwError(res.Errors[0].ErrorMessage + "." + message);
              }
            },
            () => {
              this.uploadLoader = false;
              this.popUp.throwError(
                "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
              );
            }
          );
        } else {
          var dialogRef = this.dialog.open(uploadConfirmPop, {
            width: "360px",
            data: {
              length: this.milestoneTable.length,
              success: this.uploadedSuccess
            }
          });

          dialogRef.afterClosed().subscribe(response => {
            console.log(response, "response....");
            if (response) {
              this.uploadLoader = true;
              fd.append("dealid", this.dealOverview.id);
              fd.append("optionid", this.dealOverview.OptionId);
              fd.append("paymentterms", "0");
              fd.append("userid", this.userInfo.EmployeeId);
              fd.append("filename", file.name);
              fd.append("file", file);
              this.userdat.uploadFileMilestone(fd).subscribe(
                res => {
                  if (res.Output.ReturnFlag == "S") {
                    this.uploadLoader = false;
                    let message = res.Output.ReturnMessage;
                    this.uploadedSuccess = true;
                    this.popUp.throwError(message);
                    this.milstoneList();
                  } else {
                    this.uploadLoader = false;
                    let message = res.Output.ReturnMessage;
                    const errmsg = res.Output.Errors[0].ErrorMessage + "." + message
                    this.popUp.throwError(errmsg);
                  }
                },
                () => {
                  this.uploadLoader = false;
                  this.popUp.throwError(
                    "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
                  );
                }
              );
            }
          });
        }
      } else {
        this.uploadLoader = false;
        this.popUp.throwError(
          "Please select Downloaded Template for Milestone to upload"
        );
      }
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "xlsx") {
      return true;
    } else {
      return false;
    }
  }

  //requestspoc in milestone
  requestSpoc() {
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeName,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId
      },
      MasterData: {
        PricingId: this.dealOverview.pricingId
          ? this.dealOverview.pricingId.toUpperCase()
          : "",
        TraceOppId: this.dealOverview.oppId,
        DealId: this.dealOverview.id,
        DealWonLoss: null,
        DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
        DealVersionId: this.moduleHeaderDetails.MasterData.DealVersionId,
        DealHeaderName: this.moduleHeaderDetails.MasterData.DealHeaderName,
        DealValue: null,
        DOEmailId: this.moduleHeaderDetails.MasterData.DOEmailId,
        ModuleCount: this.moduleHeaderDetails.MasterData.ModuleCount,
        ModuleOwnerEmailId: this.moduleHeaderDetails.MasterData
          .ModuleOwnerEmailID,
        ModuleBFMEmailId: this.moduleHeaderDetails.MasterData.ModuleBFMEmailId,
        ModulePSPOCEmailId: this.moduleHeaderDetails.MasterData
          .ModulePSPOCEmailId,
        ModuleId: this.moduleHeaderDetails.ModuleList[0].ModuleID,
        ModuleNumber: this.moduleHeaderDetails.ModuleList[0].ModuleNumber,
        ModuleVersionId: null,
        ModuleName: this.moduleHeaderDetails.ModuleList[0].ModuleName,
        ModuleStatusCode: this.moduleHeaderDetails.ModuleList[0].ModuleStatus,
        ServiceLines: this.moduleHeaderDetails.ModuleList[0].ServiceLines,
        OptionId: this.moduleHeaderDetails.MasterData.OptionId,
        OptionNumber: this.moduleHeaderDetails.MasterData.OptionNumber,
        OptionName: this.moduleHeaderDetails.MasterData.OptionName,
        OptionVersionId: this.moduleHeaderDetails.MasterData.OptionVersionId,
        OptionStatusCode: this.moduleHeaderDetails.MasterData.OptionStatusCode,
        DealStatus: this.dealOverview.status,
        RLSId: this.moduleHeaderDetails.ModuleList[0].RLSId,
        RLSVersionId: null,
        SourcePage: "",
        MachineIp: this.moduleHeaderDetails.MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.moduleHeaderDetails.MasterData.AddModuleVisible,
        AddModuleMessage: this.moduleHeaderDetails.MasterData.AddModuleVisible,
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
    this.isLoading = true;
    this.deals.requestSpocMilestone(input).subscribe(
      res => {
        this.isLoading = false;
        if (res.Output.ReturnFlag == "S") {
          console.log("Succes response-->", res);
          let message = res.Output.ReturnMessage;
          let val;
          this.matSnackBar.open(message, val, {
            duration: 2000
          });
        } else {
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      error => {
        this.popUp.throwError(error);
      }
    );
  }

  //submit allmilestone
  submitAll() {
    let input = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMailmilestone,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId
      },
      MasterData: {
        PricingId: this.dealOverview.pricingId
          ? this.dealOverview.pricingId.toUpperCase()
          : "",
        TraceOppId: this.dealOverview.oppId,
        DealId: this.dealOverview.id,
        DealWonLoss: null,
        DealHeaderNumber: this.dealOverview.id,
        DealVersionId: this.moduleHeaderDetails.MasterData.DealVersionId,
        DealHeaderName: this.dealOverview.dealName,
        DealValue: null,
        DOEmailId: this.moduleHeaderDetails.MasterData.DOEmailId,
        ModuleCount: this.moduleHeaderDetails.MasterData.ModuleCount,
        ModuleOwnerEmailId: this.moduleHeaderDetails.MasterData
          .ModuleOwnerEmailID,
        ModuleBFMEmailId: null,
        ModulePSPOCEmailId: null,
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
        SourcePage: "",
        MachineIp: this.moduleHeaderDetails.MasterData.MachineIp,
        GroupCode: null,
        RoleId: null,
        CurrencyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        MsaRequired: null,
        AmendmentNo: null,
        BFM_PSPOC_Vertical: null,
        ModuleTeamEmailID: null,
        AddModuleVisible: this.moduleHeaderDetails.MasterData.AddModuleVisible,
        AddModuleMessage: this.moduleHeaderDetails.MasterData.AddModuleMessage,
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
    this.isLoading = true;
    this.deals.submitAllMilestone(input).subscribe(
      res => {
        this.isLoading = false;
        if (res.Output.ReturnCode == "S") {
          console.log("Success response-->", res);
          this.popUp.throwError(res.Output.ReturnMessage);
        } else {
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      error => {
        this.popUp.throwError(error);
      }
    );
  }

  ngOnDestroy() {
    this.mileStoneDisplay$.unsubscribe();
    this.moduleResponse$.unsubscribe();
    this.combinedResponse$.unsubscribe();
  }
}

@Component({
  selector: "upload-confirm",
  templateUrl: "./upload-confirmPopup.html"
})
export class uploadConfirmPop {
  constructor(public dialogRef: MatDialogRef<uploadConfirmPop>) {}
  popupYes() {
    this.dialogRef.close(true);
  }
}
