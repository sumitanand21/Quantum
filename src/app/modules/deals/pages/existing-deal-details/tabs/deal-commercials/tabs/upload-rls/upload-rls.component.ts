import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from "@angular/material";
import { AppState } from "@app/core/state";
import { Store, select } from "@ngrx/store";
import { ErrorMessage, OnlineOfflineService } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Subscription } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { calculateDeals } from "@app/core/state/actions/deals.actions";

export interface DialogData {
  name: any;
}
@Component({
  selector: "app-upload-rls",
  templateUrl: "./upload-rls.component.html",
  styleUrls: ["./upload-rls.component.scss"]
})
export class UploadRlsComponent implements OnInit, OnDestroy {
  panelOpenState: boolean = false;
  isLoading: boolean = false;
  uploadLoader: boolean = false;
  url: any;
  expanded: boolean = false;
  moduleHeaderArr: any = [];
  uploadData: any = [];
  dealOverview: any;
  UploadList$: Subscription = new Subscription();
  manageDealOverview: any;
  userInfo: any;
  manageModule: any;
  Cowners: any = [];
  rlsValid: any;
  rlsUploadVisibility: any;
  RLSdetails: any;
  RLSdetails2temp2: any;
  RLSdetailstemp1: any;

  constructor(
    public dialog: MatDialog,
    public deals: dealService,
    public input: DealJsonService,
    public fb: FormBuilder,
    public onlineOfflineService: OnlineOfflineService,
    public encrDecrService: EncrDecrService,
    public matSnackBar: MatSnackBar,
    public popUp: ErrorMessage,
    private store: Store<AppState>
  ) {}

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
    // Getting the response from the Store
    this.UploadList$ = this.store.pipe(select(selectAllModules)).subscribe(
      async res => {
        if (res.ModuleList !== undefined) {
          if (res.ModuleList[0].Output != "") {
            this.moduleHeaderArr = res.ModuleList[0].Output.map(
              x => x.ModuleHeader
            );
            this.manageModule = res.ModuleList[0].Output; // Module response
            this.manageDealOverview = res.ModuleList[1].Output; // deal response
            this.RLSdetails = res.ModuleList[2];
            this.RLSdetailstemp1 = res.ModuleList[1];
            this.RLSdetails2temp2 = res.ModuleList[0];
            this.Cowners = this.manageDealOverview.ModuleList;
            console.log("Cowners--->", this.Cowners);
            this.Cowners.map(element => {
              element.statestatus = "1";
              if (this.deals.uploadRLSID != undefined) {
                element.ModuleID == this.deals.uploadRLSID
                  ? (element.expanded = true)
                  : (element.expanded = false);
              } else {
                element.expanded = false;
              }
            });
          } else {
            if (this.onlineOfflineService.isOnline) {
              const CacheResponse = await this.deals.getModuleListCacheData();
              if (CacheResponse) {
                if (CacheResponse.data[0].length > 0) {
                  this.isLoading = false;
                  this.moduleHeaderArr = CacheResponse.data[0].Output.map(
                    x => x.ModuleHeader
                  );
                  this.manageModule = CacheResponse.data[0].Output;
                  this.manageDealOverview = CacheResponse.data[1].Output;
                  this.Cowners = this.manageDealOverview.ModuleList;
                  console.log("Cowners--->", this.Cowners);
                  this.Cowners.map(element => {
                    element.statestatus = "1";
                    if (this.deals.uploadRLSID != undefined) {
                      element.ModuleID == this.deals.uploadRLSID
                        ? (element.expanded = true)
                        : (element.expanded = false);
                    } else {
                      element.expanded = false;
                    }
                  });
                }
              } else {
                this.LoadManageModuleAPI();
              }
            }
          }
        } else {
          if (this.onlineOfflineService.isOnline) {
            const CacheResponse = await this.deals.getModuleListCacheData();
            if (CacheResponse) {
              if (CacheResponse.data.length > 0) {
                this.isLoading = false;
                this.moduleHeaderArr = CacheResponse.data[0].Output.map(
                  x => x.ModuleHeader
                );
                this.manageModule = CacheResponse.data[0].Output;
                this.manageDealOverview = CacheResponse.data[1].Output;
                this.Cowners = this.manageDealOverview.ModuleList;
                console.log("Cowners--->", this.Cowners);
                this.Cowners.map(element => {
                  element.statestatus = "1";
                  if (this.deals.uploadRLSID != undefined) {
                    element.ModuleID == this.deals.uploadRLSID
                      ? (element.expanded = true)
                      : (element.expanded = false);
                  } else {
                    element.expanded = false;
                  }
                });
              }
            } else {
              this.LoadManageModuleAPI();
            }
          }
        }
      },
      () => {
        this.LoadManageModuleAPI();
      }
    );
    // Offline
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getModuleListCacheData();
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.moduleHeaderArr = CacheResponse.data[0].Output.map(
            x => x.ModuleHeader
          );
          this.manageModule = CacheResponse.data[0].Output; 
          this.manageDealOverview = CacheResponse.data[1].Output;
          this.Cowners = this.manageDealOverview.ModuleList;
          this.Cowners.map(element => {
            element.statestatus = "1";
            if (this.deals.uploadRLSID != undefined) {
              element.ModuleID == this.deals.uploadRLSID
                ? (element.expanded = true)
                : (element.expanded = false);
            } else {
              element.expanded = false;
            }
          });
        }
      }
    }
  }
  LoadManageModuleAPI() {
    this.isLoading = true;
    let input = {
      User: this.userInfo,
      MasterData: {
        SourcePage: "",
        PricingId: this.dealOverview.pricingId
          ? this.dealOverview.pricingId.toUpperCase()
          : "",
        DealId: this.dealOverview.id
      }
    };
    this.deals.LoadManageModule(input).subscribe(
      res => {
        if (res.ReturnCode == "S") {
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.popUp.throwError(res.ReturnMessage);
        }
      },
      error => {
        this.isLoading = false;
        this.popUp.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  UploadRLSFiles(e, data, index, status) {
    data.module = this.manageModule;
    data.dealInfo = this.manageDealOverview;
    let fileList: FileList = e.target.files;
    let file: File = fileList[0];
    console.log("111111111")
    if (fileList.length > 0) {
      console.log("222222")
      if (!this.ValidateFile(file.name)) {
        console.log("333333")
        this.uploadLoader = false;
        this.popUp.throwError("Unsupported file format");
        return false;
      } else {
        console.log("444444444")
        if (status == "1" && this.manageModule[index].RLSList[0].RLSId != "") {
          console.log("555555555")
          const dialogRef = this.dialog.open(uploadConfirmationComponent, {
            width: "396px"
          });
          dialogRef.afterClosed().subscribe(response => {
            if (response) {

              this.UploadTemplate(file, data, index, status);
            }
          });
        } else if (
          status == "2" &&
          this.manageModule[index].RLSList[1].RLSId != ""
        ) {
          console.log("666666666")
          const dialogRef = this.dialog.open(uploadConfirmationComponent, {
            width: "396px"
          });
          dialogRef.afterClosed().subscribe(response => {
            if (response) {
              this.UploadTemplate(file, data, index, status);
            }
          });
        } else {     
          console.log("777777")
          this.uploadLoader = true;
          this.UploadTemplate(file, data, index, status);
        }
      }
    }
  }
  UploadTemplate(file, data, index, status) {
    console.log("data-->", data);
    let fd: FormData = new FormData();
    fd.append("userid", this.userInfo.EmployeeId);
    fd.append("file", file);
    this.deals.createExcelUpload(fd).subscribe(
      res => {
        let response = res;
        if (response.SuccessFlag == "S") {
          let input = {
            UserInfo: {
              EmpID: this.userInfo.EmployeeId,
              EmpName: this.userInfo.EmployeeName,
              Adid: this.userInfo.EmployeeId,
              EmpEmail: this.userInfo.EmployeeMail,
              EmpNo: ""
            },
            MasterDataRLS: {
              traceoppid: data.dealInfo.MasterData.TraceOppId,
              dealid: data.DealHeaderID,
              moduleid: data.ModuleID,
              optionid: data.dealInfo.MasterData.OptionId,
              rlsid:
                (status == "1"
                  ? this.manageModule[index].RLSList[0].RLSId
                  : this.manageModule[index].RLSList[1].RLSId) || "0",
              dealversion: data.dealInfo.MasterData.DealVersionId,
              optionversion: data.dealInfo.MasterData.OptionVersionId,
              moduleversion: data.ModuleVersion,
              rlsversion: "1.00",
              dealno: data.dealInfo.MasterData.DealHeaderNumber,
              moduleno: data.ModuleNumber,
              optionno: data.dealInfo.MasterData.OptionNumber,
              rlsno: "",
              passthroughtype: "P",
              RLSType: status == "1" ? "S" : "T",
              PricingId: data.dealInfo.MasterData.PricingId,
              DealHeaderNumber: data.dealInfo.MasterData.DealHeaderNumber,
              currecyCode: data.dealInfo.MasterData.CurrencyCode,
              PeriodSelected: "",
              BillingRateSelected: ""
            },
            FileName: response.FileName
          };
          this.deals.uploadFile(input).subscribe(
            res => {
              if (res.ReturnFlag == "S") {
                console.log(res, "res.......");
                if (res.Output.SuccessFlag == "S") {
                  this.uploadLoader = false;
                  this.popUp.throwError(res.Output.Message);
                  this.store.dispatch(
                    new calculateDeals({ calculateDeal: undefined })
                  );
                  this.deals.UpdateExistingDealsStore();
                  this.deals.updateModuleListStore();
                  if (res.Output.RLSError.Warnings.length > 0) {
                    let message = "";
                    res.Output.RLSError.Warnings.map(x => {
                      message = `Warnings: ${x.WaringsMessage}`;
                    });
                    setTimeout(() => {
                      this.popUp.throwError(message);
                    }, 1000);
                  }
                } else {
                  this.uploadLoader = false;
                  if (res.Output.RLSError.Error[0]) {
                      let i=1;
                      let message="Errors in RLS: ";
                      res.Output.RLSError.Error.map(x=>{
                          message=message+" "+i+") "+x.ErrorMessage+". ";
                          i++;  
                      })
                      this.popUp.throwError(message,7000);
                    }
                   else if (res.Output.PassThruError.Error[0]) {
                    let i=1;
                    let message="Errors in PassThrough: ";
                    res.Output.PassThruError.Error.map(x=>{
                        message=message+" "+i+") "+x.ErrorMessage+". ";
                        i++;  
                    })
                    this.popUp.throwError(message,7000);
                  } else {
                    this.popUp.throwError(res.Output.Message);
                  }
                }
                //   let message="";
                //   if (res.Output.RLSError.Error[0]) {
                //       let i=1;
                //       message="Errors in RLS: ";
                //       res.Output.RLSError.Error.map(x=>{
                //           message=message+" "+i+") "+x.ErrorMessage+". ";
                //           i++;  
                //       })
                //      console.log("RLS",message)
                //     }
                //    if (res.Output.PassThruError.Error[0]) {
                //     let i=1;
                //     if(res.Output.RLSError.Error[0])
                //     message+="Errors in PassThrough: ";
                //     else
                //     message = "Errors in PassThrough: "; 
                //     res.Output.PassThruError.Error.map(x=>{
                //         message=message+" "+i+") "+x.ErrorMessage+". ";
                //         i++;  
                //     })
                    
                //   } else if(res.Output.PassThruError.Error.length==0 && res.Output.RLSError.Error.length==0) {
                //     message = res.Output.Message;
                //   }
                
                //   this.popUp.throwError(message,7000);
                // }
              } else {
                this.uploadLoader = false;
                this.popUp.throwError(res.ReturnMessage);
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
          this.uploadLoader = false;
          this.popUp.throwError(response.ReturnMessage);
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
  ValidateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "xlsx") {
      return true;
    } else {
      return false;
    }
  }
  OpenDownload() {
    let input = {
      UserInfo: {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeNumber,
      DealID: this.dealOverview.id
    }
  }
    this.deals.downloadFileRLS(input).subscribe(
      res => {
        if (res.ReturnCode == "S") {
          this.url = res.Output;
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
      }
    );
  }
  OpenCoOwners(moduledetails) {
    let coOwnersList = [];
    coOwnersList = this.Cowners.filter(
      x => x.ModuleID == moduledetails.ModuleID
    );
    coOwnersList = coOwnersList[0].ModuleTeam;
    console.log("coOwnersList", coOwnersList);
    const dialogRef = this.dialog.open(coOwnersPopupComponent, {
      width: "396px",
      data: coOwnersList
    });
  }
  ngOnDestroy() {
    this.UploadList$.unsubscribe();
  }
}
@Component({
  selector: "upload-confirm",
  templateUrl: "./confirmationPopUp.html",
  styleUrls: ["./upload-rls.component.scss"]
})
export class uploadConfirmationComponent {
  showconfirmpopup: boolean = false;
  constructor(public dialogRef: MatDialogRef<uploadConfirmationComponent>) {
    this.showconfirmpopup = true;
  }
  Upload() {
    this.dialogRef.close(true);
  }
}
@Component({
  selector: "coOwnersPopup",
  templateUrl: "./coOwnersPopup.html",
  styleUrls: ["./upload-rls.component.scss"]
})
export class coOwnersPopupComponent implements OnInit {
  nameList: any;
  constructor(
    public dialogRef: MatDialogRef<coOwnersPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  ngOnInit() {
    this.nameList = this.data;
  }
}
