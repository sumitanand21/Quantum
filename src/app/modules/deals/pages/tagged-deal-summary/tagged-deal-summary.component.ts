import {
  Component,
  OnInit,
  Inject,
  Input,
  ElementRef,
  ViewChild
} from "@angular/core";
import { DataCommunicationService, ErrorMessage } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { DialogData } from "@app/modules/opportunity/pages/renewal-opportunity/renewal-opportunity.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDatepickerInputEvent
} from "@angular/material";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { ExistingListAction } from "@app/core/state/actions/deals.actions";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import * as _moment from "moment";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DealAccess } from "@app/core/state/selectors/deals/deal-access.selectors";
@Component({
  selector: "app-tagged-deal-summary",
  templateUrl: "./tagged-deal-summary.component.html",
  styleUrls: ["./tagged-deal-summary.component.scss"]
})
export class TaggedDealSummaryComponent implements OnInit {
  @ViewChild("dealName") dealName;
  oppID: any;
  summary = [];
  selected: string;
  oppSummery: FormGroup;
  isLoading: boolean = false;
  taggedSummery: any;
  opportunityId: any;
  isCancel: boolean = false;
  togglecontent: boolean;
  datafound: any;
  userInfo: any;
  currencyType: any = 1;
  showCreate: boolean = false;
  endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate());
  minDate = new Date();
  constructor(
    public service: DataCommunicationService,
    public store: Store<AppState>,
    private route: ActivatedRoute,
    public el: ElementRef,
    public _error: ErrorMessage,
    private fb: FormBuilder,
    private _dealService: dealService,
    private validateService: ValidateforNullnUndefined,
    private dialog: MatDialog,
    private encrDecrService: EncrDecrService,
    private dealJson: DealJsonService,
    public router: Router,
    public activeRoute: ActivatedRoute
  ) {
    this.oppSummery = this.fb.group({
      dealName: [""],
      dealSubissionDate: [""],
      dealCurrency: [""]
    });
  }
  returnUrl: any;
  returnHomeUrl: any;
  ngOnInit() {
    this.returnUrl = this.activeRoute.snapshot.params["returnsummeryUrl"];
    this.returnHomeUrl = this.activeRoute.snapshot.params["returnhomeUrl"];
    this.store.pipe(select(DealAccess)).subscribe(
      res => {
        console.log("Deal access", res);
        if (res.dealaccess) {
          res.dealaccess.map(x => {
            if (x.ControlName == "btnCreateDeal") {
              this.showCreate = x.InVisible;
            }
          });
        } else {
          console.log("Navigate--> You dont have access");
        //  this.router.navigateByUrl("/deals/deal/existing");
        }
      },
      error => {
        console.log("Navigate--> You dont have access");
      //  this.router.navigateByUrl("/deals/deal/existing");
      }
    );
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    console.log("User info-->", this.userInfo);
    const getOppId = localStorage.getItem("OppId");
    let StoreoppId;
    getOppId != null
      ? (StoreoppId = this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        getOppId,
        "DecryptionDecrip"
      ))
      : null;
    this._dealService.oppData.subscribe(oppIDRes => {
      console.log(oppIDRes, "oppIDResoppIDRes");
      this.oppID = oppIDRes;
    });
    this.oppID != undefined
      ? (this.opportunityId = this.oppID)
      : (this.opportunityId = JSON.parse(StoreoppId));
    this.oppID != undefined
      ? (this.togglecontent = true)
      : (this.togglecontent = false);
    //  console.log(StoreoppId,"StoreoppId")
    //  console.log(this.oppID,"this.oppID")
    if (this.validateService.validate(this.opportunityId)) {
      console.log(this.opportunityId, "macha r");
      let obj = {
        SalesorderGUID: this.opportunityId.isamedmentnumber == "No" ? ""  : this.opportunityId.orderId,
        AccountGUID: this.opportunityId.AccountGUID,
        OppNameOppNumber: this.opportunityId.isamedmentnumber == "No" ? this.opportunityId.opportunityNumber : "",
        OpportunityIpId: this.opportunityId.isamedmentnumber == "No" ? this.opportunityId.OpportunityIpId : "",
        OppOrOrd:this.opportunityId.isamedmentnumber == "No" ? "O" : "A"
      };
      this.isLoading = true;
      this._dealService.getTaggedSummary(obj).subscribe(
        res => {
          console.log(res, "summery...");
          console.log(JSON.stringify(res), "summery...");
          this.isLoading = false;
          if (!res.IsError) {
            this.getMappedSummary(res.ResponseObject);
            this.getDropdownNData("1");
            this.getCache();
            this.datafound = res;
            this.taggedSummery = res.ResponseObject;
          } else {
            this._error.throwError(res.Message);
          }
        },
        error => {
          this.isLoading = false;
          console.log("Error-->", error);
        }
      );
    }
  }
  gobackdeal() {
    this.router.navigateByUrl(this.returnUrl);
  }
  goToHome() {
    this.router.navigateByUrl(this.returnHomeUrl);
  }
  getMappedSummary(obj: any) {
    this.summary = [
      {
        label: obj.IsAmmendment == true ? "Order name" : "Opp name",
        content: this.validateService.validate(obj.IsAmmendment == true ? obj.OrderName :obj.OpportunityName)
          ? (obj.IsAmmendment == true ? obj.OrderName :obj.OpportunityName)
          : "-"
      },
      {
        label: "Account",
        content: this.validateService.validate(obj.Account.Name)
          ? obj.Account.Name
          : "-"
      },
      {
        label: "Group client code",
        content: this.validateService.validate(obj.GroupClientCode)
          ? obj.GroupClientCode
          : "-"
      },
      {
        label: "TCV",
        content: this.validateService.validate(obj.TransactionCurrencyValue)
          ? obj.TransactionCurrencyValue
          : "-"
      },
      {
        label: "Trace currency",
        content: this.validateService.validate(obj.CurrencyCode)
          ? obj.CurrencyCode
          : "-"
      },
      {
        label: "Group client",
        content: this.validateService.validate(obj.GroupClient)
          ? obj.GroupClient
          : "-"
      },
      {
        label: "ACV",
        content: this.validateService.validate(obj.ACV)
          ? obj.ACV
          : "-"
      },
      {
        label: "SBU",
        content: this.validateService.validate(obj.Sbu.Name)
          ? obj.Sbu.Name
          : "-"
      },
      {
        label: "Opportunity owner",
        content: this.validateService.validate(obj.OpportunityOwnerName)
          ? obj.OpportunityOwnerName
          : "-"
      },
      {
        label: "Vertical",
        content: this.validateService.validate(obj.Vertical.Name)
          ? obj.Vertical.Name
          : "-"
      },
      {
        label: "Company",
        content: this.validateService.validate(obj.CompanyName)
          ? obj.CompanyName
          : "-"
      },
      {
        label: "Company code",
        content: this.validateService.validate(obj.CompanyCode)
          ? obj.CompanyCode
          : "-"
      },
      {
        label: "Deal owner",
        content: this.validateService.validate(this.userInfo.EmployeeName)
          ? this.userInfo.EmployeeName.replace(/ *\([^)]*\) */g, "")
          : "-"
      },
      {
        label: "Product opportunity",
        content: this.validateService.validate(obj.ProductOpportunity)
          ? obj.ProductOpportunity
          : "-"
      }
    ];
  }
  dealCurrencyList: any;
  getDropdownNData(event) {
    console.log(event, "checking event");
    let dealCurrencyInput = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      Params: {
        MaxCount: "500"
      },
      Items: {
        Search: "",
        SearchCode: ""
      },
      spParams: {
        Status: "Y"
      }
    };
    this.oppSummery.controls.dealCurrency.setValue("");
    this._dealService.getDealCurrencyList(dealCurrencyInput).subscribe(
      res => {
        console.log(res, "checking res");
        const outResponse = res.Output;
        if (outResponse.ReturnFlag == "S") {
          this.dealCurrencyList = [{}];
          console.log("event-->", event);
          event == "1"
            ? (this.dealCurrencyList = outResponse.sc)
            : (this.dealCurrencyList = outResponse.nsc);
          console.log("this.dealCurrencyList--->", this.dealCurrencyList);
          this.oppSummery.controls.dealCurrency.setValue(this.oppSummery.value.dealCurrency)
        }
      },
      error => {
        console.log("Error--->", error);
      }
    );
  }
  selectedCurrency: string = 'Select Deal Currency';;
  SelectCurrency(currency) {
    console.log(currency, "currency..")
    console.log(this.dealCurrencyList, "this.dealCurrencyList ")
    const currencyObj = this.dealCurrencyList.filter((element) => {
      return currency.value == element.CurrencyCode
    })[0]
    this.selectedCurrency = 'Selected' + currencyObj.CurrencyName
    console.log(currencyObj, "currencyName")
  }
  createDeal() {
    this.oppSummery.controls.dealName.value != null &&
      this.oppSummery.controls.dealName.value != ""
      ? this.oppSummery.controls.dealName.setErrors(null)
      : this.oppSummery.controls.dealName.setErrors({ required: true });
    this.oppSummery.controls.dealSubissionDate.value != null &&
      this.oppSummery.controls.dealSubissionDate.value != ""
      ? this.oppSummery.controls.dealSubissionDate.setErrors(null)
      : this.oppSummery.controls.dealSubissionDate.setErrors({
        required: true
      });
    this.oppSummery.controls.dealCurrency.value != null &&
      this.oppSummery.controls.dealCurrency.value != ""
      ? this.oppSummery.controls.dealCurrency.setErrors(null)
      : this.oppSummery.controls.dealCurrency.setErrors({ required: true });
    if (this.oppSummery.valid) {
      if (!this.datafound.IsError) {
        const dialogRef = this.dialog.open(DealCreate, {
          width: "396px",
          data: {
            summery: this.taggedSummery,
            trace: this.oppSummery.controls.dealCurrency.value
          }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.saveDeal();
          }
        });
      } else {
        this._error.throwError("Please Search with a valid OpportunityNumber");
      }
    } else {
      this._error.throwError("Please Enter Mandatory Fields");
      this.scrollTo(this.dealName.nativeElement);
    }
  }
  scrollTo(element: Element) {
    if (element) {
      window.scroll({
        behavior: "smooth",
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - 150
      });
    }
  }

  saveDeal() {
    var obj = {};
    (obj["User"] = {
      EmployeeId: this.userInfo.EmployeeId,
      EmployeeName: this.userInfo.EmployeeName,
      EmployeeNumber: this.userInfo.EmployeeNumber,
      EmployeeMail: this.userInfo.EmployeeMail
    }),
      (obj["Params"] = {
        MaxCount: "500"
      });
    obj["Items"] = [{ Search: "", SearchCode: "" }];

    if (this.fileName != null && this.fileName != "") {
      this.taggedSummery.Doc_Name = this.fileName
        .split(".")
        .slice(0, -1)
        .join(".");
    }
    this.taggedSummery.Doc_Url = this.docurl;
    console.log(this.taggedSummery, "this.taggedSummery");
    let createobj = {
      Guid: this.taggedSummery.OpportunityId,
      OpportunityGuid: this.taggedSummery.OpportunityId,
      OrderGuid: this.taggedSummery.OrderID,
      Doc_Name: this.taggedSummery.Doc_Name,
      Doc_Url: this.taggedSummery.Doc_Url,
      Number: this.taggedSummery.wipro_baseorderno,
      OpportunityNumber: this.taggedSummery.OpportunityNumber,
      OpportunityName: this.taggedSummery.OpportunityName,
      Owner: this.taggedSummery.OpportunityOwnerName,
      OwnerADID: this.taggedSummery.OpportunityOwnerAdId,
      OpportunityOwner: this.taggedSummery.OpportunityOwnerName,
      TraceOppID:this.taggedSummery.OpportunityNumber,
      OrderOwner: "",
      BUName: "",
      VerticalName: this.taggedSummery.Vertical.Name,
      VerticalCode: this.taggedSummery.Vertical.Code,
      AccountName: this.taggedSummery.Account.Name,
      GroupCustomerCode: this.taggedSummery.GroupClientCode,
      GroupCustomerName: this.taggedSummery.GroupCustomerName,
      CustomerCode: "",
      Status: this.taggedSummery.StatusName,
      ActiveStatus: "",
      ApprovalStage: null,
      Currency: this.taggedSummery.TransactionCurrencyValue,
      TCV: this.taggedSummery.EstimatedTCVvalue,
      ACV: this.taggedSummery.ACVvalue,
      EngagementType: null,
      TransCurrencyCode: this.taggedSummery.TransactionCurrencyValue,
      IsContinental: "0",
      CreatedDate: this.taggedSummery.CreatedOn,
      CompanyCode: this.taggedSummery.CompanyCode,
      CompanyName: this.taggedSummery.CompanyName,
      SBUCode: this.taggedSummery.Sbu.Code,
      DealCurrencyCode: this.oppSummery.controls.dealCurrency.value,
      DealHeaderName: this.oppSummery.controls.dealName.value,
      OppOwnerAdId: this.taggedSummery.OpportunityOwnerAdId,
      OppOwnerEmail: this.taggedSummery.OpportunityOwnerEmail,
      ExpectedSubmissionDate: _moment(
        new Date(this.oppSummery.controls.dealSubissionDate.value)
      ).format("MM/DD/YYYY"),
      OppOwnerID: this.taggedSummery.OpportunityOwnerId,
      OrderOwnerID: "",
      OppOrOrd: this.taggedSummery.IsAmmendment == false ? "O" : "A",
      AmendmentNo: this.taggedSummery.AmendmentNo,
      DealCheckParams: {
        hidOppId: "1",
        hidAmendNo: "0",
        OppidAmendNoExist: this.taggedSummery.IsDealExists == true ? "Y" : "N",
        ExistingPricingId: this.taggedSummery.PricingId,
        hidGroupCustomer: "0",
        hidvertical: "1",
        ReturnMessage: "",
        ReturnCode: "",
        Message: ""
      },
      Islatam: this.taggedSummery.IsLatamDeal,
      IsAgile: this.taggedSummery.IsAgile,
      IsProduct: this.taggedSummery.IsProduct,
      IsMEDeal: this.taggedSummery.IsMEDeal === "Y" ? 1 : 0,
      IsATCO: this.taggedSummery.IsATCO,
      IsAppirio: this.taggedSummery.IsAppirio,
      DealStatus: "DO"
    };
    obj["CreateDealParameters"] = createobj;
    this.isLoading = true;
    console.log(JSON.stringify(obj));
    this._dealService.createDeal(obj).subscribe(
      res => {
        if (res.ReturnFlag == "S") {
          const Output = JSON.parse(res.Output);
          if (Output.ReturnFlag == "S") {
            this.isLoading = false;
            this._error.throwError("Deal Created Successfully");
            let obj = {
              DealOwnerEmailId: Output.Doemailid,
              OptionId: Output.OptionID,
              dealHeadernumber: Output.DealHeaderNumber,
              dealName: Output.Dealname,
              id: Output.DealId,
              oppID: Output.TraceOppID,
              pricingId: Output.PricingId,
              status: Output.Dealstatus,
              vertical: Output.Vertical
            };
            let encryptData = this.encrDecrService.set(
              "EncryptionEncryptionEncryptionEn",
              JSON.stringify(obj),
              "DecryptionDecrip"
            );
            sessionStorage.setItem(
              "DealName",
              this.oppSummery.controls.dealName.value
            );
            sessionStorage.setItem("Dealoverview", encryptData);
            this.isCancel = true;
            this.deleteCache();
            this.getExistingdeals();
          } else {
            this.isLoading = false;
            this._error.throwError(Output.ReturnMessage);
          }
        } else {
          this.isLoading = false;
          this._error.throwError(
            "There was error while processing of your request. A mail has been sent to the administrator informing about the same. We sincerely regret the inconvenience caused."
          );
        }
      },
      error => {
        this.isLoading = false;
        console.log("Error-->", error);
      }
    );
  }
  getExistingdeals() {
    this.isLoading = true;
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
    this._dealService.getExistingDeals(inputData).subscribe(
      res => {
        if (res) {
          this.isLoading = false;
          if (res.ReturnCode == "S") {
            this.router.navigateByUrl("/deals/existingTabs/overview");
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
          this.isLoading = false;
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        console.log("Error-->", error);
      }
    );
  }
  docurl: any;
  fileName: string;
  selectedFile: string;
  alreadyexist: boolean = false;
  fileUpload(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      console.log(file, "file..........");
      if (!this.validateFile(file.name)) {
        this._error.throwError("Unsupported file format");
        return false;
      } else {
        if (this.alreadyexist) {
          const dialogRef = this.dialog.open(AttachDealRFPComponent, {
            width: "396px",
            data: {
              showattachpop: true,
              filedata: { file: file, filename: file.name }
            }
          });
          dialogRef.afterClosed().subscribe(response => {
            if (response) {
              this.uploaddocument(file);
            }
          });
        } else {
          this.uploaddocument(file);
        }
      }
    }
  }
  uploaddocument(file) {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    this.fileName = file.name;
    this.isLoading = true;
    this._dealService.uploadRPF(formData).subscribe(
      res => {
        if (!res.IsError) {
          this.isLoading = false;
          this.docurl = res;
          this.selectedFile = file.name;
          this.alreadyexist = true;
          this._error.throwError("File Uploaded Successfully");
        } else {
          this.isLoading = false;
          this._error.throwError(res.Message);
        }
      },
      err => {
        this.isLoading = false;
        console.log("Error--->");
      }
    );
  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (
      ext.toLowerCase() == "docx" ||
      ext.toLowerCase() == "pdf" ||
      ext.toLowerCase() == "pptx" ||
      ext.toLowerCase() == "xlsx"
    ) {
      return true;
    } else {
      return false;
    }
  }
  getCache() {
    let key = "CreateDeal" + "|" + this.opportunityId.opportunityNumber;
    console.log("Keeeey", key)
    this.service.GetRedisCacheData(key).subscribe((Res) => {
      if (Res.IsError == false) {
        console.log('Values', Res)
        if (Res.ResponseObject) {
          let response: any = JSON.parse(Res.ResponseObject)
          response.dealName ? this.oppSummery.controls.dealName.setValue(response.dealName) : null;
          response.dealSubissionDate ? this.oppSummery.controls.dealSubissionDate.setValue(response.dealSubissionDate) : null;
          response.dealCurrency ? this.oppSummery.controls.dealCurrency.setValue(response.dealCurrency) : null
          response.currencyType ? this.currencyType = response.currencyType : this.currencyType = 1;
        }
      }
    })

  }
  setCache(formValues) {
    console.log('Values', formValues)
    formValues.currencyType = this.currencyType;
    let key = "CreateDeal" + "|" + this.opportunityId.opportunityNumber;
    this.service.deleteRedisCacheData(key).subscribe((Res) => {
      if (Res.IsError == false) {
        this.service.SetRedisCacheData(formValues, key).subscribe((Res) => {
          console.log('Values', Res)
        });
      }
    })

  }
  deleteCache() {
    let key = "CreateDeal" + "|" + this.opportunityId.opportunityNumber;
    console.log("Keeeey", key)
    this.service.deleteRedisCacheData(key).subscribe((Res) => {
    })
  }
  ngOnDestroy() {
    if (!this.isCancel) {
      this.setCache(this.oppSummery.value);
    }
    console.log('Destroyed')
  }
}
@Component({
  selector: "create-popup",
  templateUrl: "./create-popup.html",
  styleUrls: ["./tagged-deal-summary.component.scss"]
})
export class DealCreate {
  dealpresent: boolean;
  tracecurrency: boolean;
  latemgeography: boolean;
  hidecontent: boolean;
  constructor(
    public dialogRef: MatDialogRef<DealCreate>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const filledparametrs: any = data;
    console.log(filledparametrs, "filledparametrs");
    filledparametrs.summery.IsDealExists == true
      ? (this.dealpresent = true)
      : (this.dealpresent = false);
    filledparametrs.summery.CurrencyCode != filledparametrs.trace
      ? (this.tracecurrency = true)
      : (this.tracecurrency = false);
    filledparametrs.summery.IsLatamDeal == true
      ? (this.latemgeography = true)
      : (this.latemgeography = false);
    let content = [];
    content.push(this.dealpresent, this.tracecurrency, this.latemgeography);
    if (
      content.every(element => {
        return element == false;
      })
    ) {
      this.hidecontent = false;
    } else {
      this.hidecontent = true;
    }
  }
}

/****************   upload popup start        **************/

@Component({
  selector: "uploadtag-pop",
  templateUrl: "./uploadtagPop.html"
})
export class uploadtagPop {
  constructor(public dialogRef: MatDialogRef<uploadtagPop>) { }
}

/****************** upload popup END  */
@Component({
  selector: "alertdocument",
  templateUrl: "./attachmentpopup.html",
  styleUrls: ["./tagged-deal-summary.component.scss"]
})
export class AttachDealRFPComponent {
  documentexist: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AttachDealRFPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const element: any = data;
    this.documentexist = element.showattachpop;
  }
  replacedocument() {
    let uploadNewDoc: boolean = true;
    this.dialogRef.close(uploadNewDoc);
  }
}
