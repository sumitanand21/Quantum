import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { DataCommunicationService, OnlineOfflineService } from "@app/core";
import { Store, select } from "@ngrx/store";
import { ErrorMessage } from "@app/core/services/error.services";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AppState } from "@app/core/state";
import {
  ModuleListAction,
  calculateDeals
} from "@app/core/state/actions/deals.actions";
import { dealService } from "@app/core/services/deals.service";
import { DialogData } from "@app/modules/opportunity/pages/renewal-opportunity/renewal-opportunity.component";
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  FormArray,
  FormControl
} from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { selectAllModules } from "@app/core/state/selectors/deals/deals-module.selector";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Subscription, Subject } from "rxjs";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { Router } from "@angular/router";
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: { dateInput: "MMM-YYYY" },
  display: {
    dateInput: "MMM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@Component({
  selector: "app-deal-module",
  templateUrl: "./deal-module.component.html",
  styleUrls: ["./deal-module.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DealModuleComponent implements OnInit, OnDestroy {
  panelOpenState;
  panelOpenState2;
  Adddealmodule: FormGroup;
  SelectedModuleOwner: any = [];
  showaddModule: boolean = false;
  Nameedited: boolean = false;
  edited = true;
  moduleListTable: any = [];
  moduleName: string;
  issaveLoader: boolean = false;
  showModules: boolean;
  moduleListInput: any;
  getmoduleinfoinput: any;
  moduleHeaderDetails: any;
  userInfo: any;
  noRecordFound: boolean = false;
  rlsDropdownInput: any;
  showAddModuleBtn: boolean = false;
  DropDownMasters: Object;
  isLoading: boolean = false;
  selectedmoduleOwnerName: string = "";
  originUrl: string = "";
  endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate());
  minDate = new Date();
  combinedResponse$: Subscription = new Subscription();
  pastDealEnable$: Subscription = new Subscription();
  constructor(
    public service: DataCommunicationService,
    public el: ElementRef,
    public _error: ErrorMessage,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public store: Store<AppState>,
    private deals: dealService,
    public router: Router,
    public encrDecrService: EncrDecrService,
    public onlineOfflineService: OnlineOfflineService,
    public messageService: MessageService
  ) {
    this.Adddealmodule = this.fb.group({
      project_start_date: new FormControl(""),
      moduleName: [""],
      serviceLines: new FormArray([]),
      moduleOwner: new FormArray([]),
      copymodule: new FormControl(false),
      copymodulename: [""]
    });
    this.pastDealEnable$ = this.messageService.getPastDealEnable().subscribe(res => {
      console.log('past deal subscription response-->', res)
      this.originUrl = res.originUrl;
    });
  }
  async ngOnInit() {
    // this.onFormChange();
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    let fillmanageparmsInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("getFillManageParameters"),
      "DecryptionDecrip"
    );
    const paramsinfo = JSON.parse(fillmanageparmsInfo);
    paramsinfo.Output.ValidationFlag.btnAddModule.Visible == "true"
      ? (this.showAddModuleBtn = true)
      : (this.showAddModuleBtn = false); 
    this.combinedResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(async res => {
        console.log(res, "res...");
        if (res.ModuleList != undefined) {
          this.moduleHeaderDetails = res.ModuleList[1].Output;
          this.getModuleList(res.ModuleList[0]);
          this.getmoduleinfo(res.ModuleList[1]);
          this.getRLSDropdowndata(res.ModuleList[2]);
          this.getCache();
        } else {
          if (this.moduleHeaderDetails != undefined) {
            this.getinputparams();
            let moduleuserinput = this.moduleListInput;
            let getmoduleinfo = this.getmoduleinfoinput;
            let rlsdropdown = this.rlsDropdownInput;
            this.getModuleInfo(moduleuserinput, getmoduleinfo, rlsdropdown);
          } else {
            this.router.navigate(["/deals/existingTabs/overview"]);
          }
        }
      });
    //  offline
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getModuleListCacheData();
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.issaveLoader = false;
          this.getModuleList(CacheResponse.data[0]);
          this.getmoduleinfo(CacheResponse.data[1]);
          this.getRLSDropdowndata(CacheResponse.data[2]);
          this.getCache();
        }
      } else {
        this.getinputparams();
        let moduleuserinput = this.moduleListInput;
        let getmoduleinfo = this.getmoduleinfoinput;
        let rlsdropdown = this.rlsDropdownInput;
        this.getModuleInfo(moduleuserinput, getmoduleinfo, rlsdropdown);
      }
    }
  }
  getCache() {
    let key = `CreateModule-${this.moduleHeaderDetails.MasterData.DealId}`;
    this.service.GetRedisCacheData(key).subscribe(
      Res => {
        this.isLoading = true;
        if (Res.IsError == false) {
          this.isLoading = false;
          console.log("Values", Res);
          if (Res.ResponseObject) {
            this.addModule();
            let response: any = JSON.parse(Res.ResponseObject);
            console.log("response from get cache-->", response);
            response.moduleName
              ? this.Adddealmodule.controls["moduleName"].setValue(
                  response.moduleName
                )
              : null,
              response.project_start_date
                ? this.Adddealmodule.controls["project_start_date"].setValue(
                    response.project_start_date
                  )
                : null,
              response.moduleOwner
                ? this.Adddealmodule.setControl(
                    "moduleOwner",
                    this.fb.array(response.moduleOwner || [])
                  )
                : [],
              response.copymodule
                ? this.Adddealmodule.controls["copymodule"].setValue(
                    response.copymodule
                  )
                : false;
            this.Adddealmodule.setControl("serviceLines", new FormArray([]));
            const control = <FormArray>this.Adddealmodule.controls.serviceLines;
            response.serviceLines.map(item => {
              control.push(
                this.fb.group({
                  status: item.status,
                  lines: item.lines
                })
              );
            });
            this.SelectedModuleOwner = response.moduleOwner.map(x => x.owners);
          }
        }
      },
      () => {
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
      }
    );
  }
  setCache(formValues) {
    console.log("Values", formValues);
    console.log("this.selectedModuleOWner", this.SelectedModuleOwner);
    let key = `CreateModule-${this.moduleHeaderDetails.MasterData.DealId}`;
    this.service.deleteRedisCacheData(key).subscribe(
      Res => {
        console.log("Delete Res-->", Res);
        if (Res.IsError == false) {
          this.service.SetRedisCacheData(formValues, key).subscribe(
            Res => {
              console.log("Values", Res);
            },
            () => {
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
            }
          );
        }
      },
      () => {
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
      }
    );
  }
  deleteCache() {
    let key = `CreateModule-${this.moduleHeaderDetails.MasterData.DealId}`;
    this.service.deleteRedisCacheData(key).subscribe(
      Res => {
        console.log(Res);
      },
      () => {
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
      }
    );
  }
  getinputparams() {
    this.moduleListInput = {
      User: {
        EmployeeNumber: this.userInfo.EmployeeId,
        EmployeeName: this.userInfo.EmployeeName,
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeMail: this.userInfo.EmployeeMail,
        ClientIP: ""
      },
      MasterData: {
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        DealId: this.moduleHeaderDetails.MasterData.DealId
      }
    };
    this.rlsDropdownInput = {
      UserInfo: {
        EmpID: this.userInfo.EmployeeId,
        EmpName: this.userInfo.EmployeeName,
        Adid: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpNo: this.userInfo.EmployeeId
      },
      MasterDataRLS: {
        currecyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
        dealid: this.moduleHeaderDetails.MasterData.DealId,
        dealno: null,
        dealversion: null,
        moduleid: null,
        moduleno: null,
        moduleversion: null,
        optionid: this.moduleHeaderDetails.MasterData.OptionId,
        optionno: this.moduleHeaderDetails.MasterData.OptionNumber,
        optionversion: this.moduleHeaderDetails.MasterData.OptionVersionId,
        passthroughtype: null,
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        rlsid: "",
        rlsno: "",
        RLSType: null,
        rlsversion: "",
        traceoppid: this.moduleHeaderDetails.MasterData.TraceOppId
      },
      PassThroughObject: {}
    };
    this.getmoduleinfoinput = {
      UserInfo: {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId
      },
      MasterData: {
        PricingId: this.moduleHeaderDetails.MasterData.PricingId,
        TraceOppId: this.moduleHeaderDetails.MasterData.TraceOppId,
        DealId: this.moduleHeaderDetails.MasterData.DealId,
        DealHeaderNumber: this.moduleHeaderDetails.MasterData.DealHeaderNumber,
        DealVersionId: this.moduleHeaderDetails.MasterData.DealVersionId,
        DealHeaderName: this.moduleHeaderDetails.MasterData.DealHeaderName,
        DOEmailId: this.moduleHeaderDetails.MasterData.DOEmailId,
        ModuleCount: this.moduleHeaderDetails.MasterData.ModuleCount,
        ModuleOwnerEmailId: "",
        ModuleBFMEmailId: "",
        ModulePSPOCEmailId: "",
        ModuleId: "",
        ModuleVersionId: "",
        ModuleName: "",
        ModuleStatusCode: "",
        OptionId: this.moduleHeaderDetails.MasterData.OptionId,
        OptionNumber: this.moduleHeaderDetails.MasterData.OptionNumber,
        OptionName: this.moduleHeaderDetails.MasterData.OptionName,
        OptionVersionId: this.moduleHeaderDetails.MasterData.OptionVersionId,
        OptionStatusCode: this.moduleHeaderDetails.MasterData.OptionStatusCode,
        RLSId: "",
        RLSVersionId: "",
        SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
        MachineIp: this.moduleHeaderDetails.MasterData.MachineIp,
        GroupCode: "",
        RoleId: "",
        CurrencyCode: this.moduleHeaderDetails.MasterData.CurrencyCode,
        MsaRequired: "0"
      }
    };
  }
  
  getModuleInfo(moduleuserinput, getmoduleinfo, rlsdropdown) {
    this.isLoading = true;
    this.deals
      .getAllModuleDetails(moduleuserinput, getmoduleinfo, rlsdropdown)
      .subscribe(res => {
        this.getModuleList(res[0]);
        this.getmoduleinfo(res[1]);
        this.getRLSDropdowndata(res[2]);
        this.store.dispatch(new ModuleListAction({ ModuleList: res }));
        this.isLoading = false;
      });
  }
  LoadManageModule: any;
  getModuleList(res) {
    if (res) {
      if (res.ReturnFlag == "S") {
        if (res.Output.length > 0) {
          this.moduleListTable = [];
          this.LoadManageModule = res;
          this.moduleListTable = res.Output.map(x => {
            x.edited = true;
            x.nameedited = false;
            return x;
          });
          this.showModules = true;
          this.noRecordFound = false;
          this.sendMessage(false);
        } else {
          this.moduleListTable = [];
          this.showModules = false;
          this.noRecordFound = true;
          this.sendMessage(true);
        }
      } else {
        this._error.throwError(res.ReturnMessage);
      }
    }
  }
  sendMessage(booleanval: boolean) {
   this.pastDealEnable$ = this.messageService.getPastDealEnable().subscribe(res => {
      console.log('past deal subscription response-->', res)
      this.originUrl = res.originUrl;
      if (res.originUrl.includes('pastDeal') || res.originUrl.includes('rlsView')) {
        this.messageService.sendMessage(false);
      } else {
        this.messageService.sendMessage(booleanval);
      }
    });
  }
  moduleTableInfo: any = [];
  submissiondates: any = [];
  LoadManageDeal: any;
  getmoduleinfo(res) {
    if (res) {
      if (res.ReturnFlag == "S") {
        this.LoadManageDeal = [];
        this.LoadManageDeal = res;
        this.DropDownMasters = res.Output.DropDownMasters;
        if (res.Output.ModuleList.length > 0) {
          this.submissiondates = [];
          this.moduleTableInfo = [];
          this.moduleTableInfo = res.Output.ModuleList;
          this.moduleTableInfo.map(item => {
            console.log(item, "item....");
            if (item.ProjectStartDate != "") {
              var months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ];
              let getMonth = months.indexOf(
                item.ProjectStartDate.split("-")[0]
              );
              let getYear: number = JSON.parse(
                item.ProjectStartDate.split("-")[1]
              );
              this.submissiondates.push({
                date: moment(new Date(getYear, getMonth, 1))
              });
            } else {
              this.submissiondates.push({ date: "" });
            }
            console.log(this.submissiondates, "this.submissiondates");
          });
        } else {
          this.moduleTableInfo = [];
          this.submissiondates = [];
        }
      } else {
        this._error.throwError(res.ReturnMessage);
      }
    }
  }
  dropdownList: any;
  getRLSDropdowndata(res) {
    if (res.ReturnFlag == "S") {
      this.dropdownList = res;
      this.issaveLoader = false;
    } else {
      this.dropdownList = [{}];
      this._error.throwError("No Service Lines Found");
      this.issaveLoader = false;
    }
  }
  invalidstartdate: boolean;
  editModule(data, index) {
    if (!data.edited) {
      const basicinfo = this.moduleListTable;
      const sub_date = _moment(this.submissiondates[index].date).format(
        "MMM/YYYY"
      );
      if (this.submissiondates[index].date != null) {
        const editSelected = {
          UserInfo: {
            EmpName: this.userInfo.EmployeeName,
            AdId: this.userInfo.EmployeeId,
            EmpEmail: this.userInfo.EmployeeMail,
            EmpID: this.userInfo.EmployeeId,
            EmpNo: this.userInfo.EmployeeId
          },
          ChangeModPSD: {
            ModuleID: basicinfo[index].ModuleHeader.ModuleID,
            ProjectStartDate:
              sub_date.split("/")[0] + "-" + sub_date.split("/")[1]
          }
        };
        this.issaveLoader = true;
        this.deals.editDealModule(editSelected).subscribe(
          response => {
            //  const response = JSON.parse(res);
            if (response) {
              if (response.ReturnFlag == "S") {
                data.edited = !data.edited;
                this.LoadManageDeal.Output.DropDownMasters = this.DropDownMasters;
                this.LoadManageDeal.Output.ModuleList[index].ProjectStartDate =
                  sub_date.split("/")[0] + "-" + sub_date.split("/")[1];
                let editres = [
                  this.LoadManageModule,
                  this.LoadManageDeal,
                  this.dropdownList
                ];
                this.store.dispatch(
                  new ModuleListAction({ ModuleList: editres })
                );
                this._error.throwError(response.ReturnMessage);
                this.issaveLoader = false;
              } else {
                this.issaveLoader = false;
                console.log("Error--->");
              }
            }
          },
          error => {
            this.issaveLoader = false;
            console.log("Error", error);
          }
        );
      } else {
        this.invalidstartdate = true;
      }
    } else {
      data.edited = !data.edited;
    }
  }
  validatestartdate(event) {
    event != null
      ? (this.invalidstartdate = false)
      : (this.invalidstartdate = true);
  }
  minModuleOwners(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      var count = 0;
      formArray.controls.map(control => {
        control.value.status == true ? (count = count + 1) : 0;
      });
      return count >= min ? null : { required: true };
    };
    return validator;
  }
  saveexpand: boolean = true;
  saveModule(ev) {
    this.Adddealmodule.controls.moduleName.value != null &&
    this.Adddealmodule.controls.moduleName.value != ""
      ? this.Adddealmodule.controls.moduleName.setErrors(null)
      : this.Adddealmodule.controls.moduleName.setErrors({ required: true });
    const servicelines = this.Adddealmodule.controls.serviceLines.value;
    const selectedlineIds = servicelines.filter(v => v.status !== false);
    const selectedServiceList = selectedlineIds.map(item => item.lines);
    const start_date = _moment(
      this.Adddealmodule.controls.project_start_date.value
    ).format("MMM/YYYY");
    console.log(this.Adddealmodule.controls.project_start_date.value);
    if (
      this.Adddealmodule.valid &&
      selectedServiceList.length > 0 &&
      this.SelectedModuleOwner.length > 0
    ) {
      this.issaveLoader = true;
      this.deleteCache();
      var obj = {};
      obj["UserInfo"] = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId
      };
      obj["MasterData"] = this.LoadManageDeal.Output.MasterData;
      obj["ManageInfo"] = this.LoadManageDeal.Output.ManageInfo;
      obj["AddModuleInput"] = {
        ModuleName: this.Adddealmodule.controls.moduleName.value,
        ProjectStartDate:
          start_date.split("/")[0] != "Invalid date"
            ? start_date.split("/")[0] + "-" + start_date.split("/")[1]
            : "",
        MachineIp: this.LoadManageDeal.Output.MasterData.MachineIp,
        DealHeaderId: this.LoadManageDeal.Output.MasterData.DealId,
        ModuleOwner: {
          EmployeeNumber: this.SelectedModuleOwner[0].AdId,
          EmployeeName: this.SelectedModuleOwner[0].FullName,
          EmployeeMail: this.SelectedModuleOwner[0].Email,
          EmployeeId: this.SelectedModuleOwner[0].AdId,
          Status: "",
          ClientIP: ""
        },
        ServiceLines: selectedServiceList
      };
      // this.issaveLoader = true;

      this.deals.saveNewDealModule(obj).subscribe(
        res => {
          if (res.ReturnFlag == "S") {
            if (res.Output.ReturnFlag == "S") {
              this.saveexpand = false;
              this.getinputparams();
              const moduleuserinput = this.moduleListInput;
              this.SelectedModuleOwner = [];
              this.Adddealmodule.controls.project_start_date.setValue(null);
              this.Adddealmodule.controls.moduleName.setValue(null);
              this.Adddealmodule.controls.moduleName.setValue(null);
              this.Adddealmodule.setControl("moduleOwner", new FormArray([]));
              this.Adddealmodule.setControl("serviceLines", new FormArray([]));
              this.deals
                .getDealModuleList(moduleuserinput)
                .subscribe(manageres => {
                  res.Output.DropDownMasters = this.DropDownMasters;
                  this.LoadManageDeal = res;
                  this.LoadManageModule = manageres;
                  let updatestore = [
                    this.LoadManageModule,
                    this.LoadManageDeal,
                    this.dropdownList
                  ];
                  this.store.dispatch(
                    new ModuleListAction({ ModuleList: updatestore })
                  );
                  this.store.dispatch(
                    new calculateDeals({ calculateDeal: undefined })
                  );
                  this.deleteaddModule();
                  this._error.throwError("Module Created Successfully");
                  this.issaveLoader = false;
                });
            } else {
              this._error.throwError(res.ReturnMessage);
              this.issaveLoader = false;
            }
          } else {
            this._error.throwError(res.ReturnMessage);
            this.issaveLoader = false;
          }
        },
        error => {
          this.issaveLoader = false;
          console.log("Error", error);
        }
      );
    } else {
      selectedServiceList.length > 0
        ? this.Adddealmodule.controls["serviceLines"].setErrors(null)
        : this.Adddealmodule.controls["serviceLines"].setErrors({
            required: true
          });
      this.SelectedModuleOwner.length > 0
        ? this.Adddealmodule.controls["moduleOwner"].setErrors(null)
        : this.Adddealmodule.controls["moduleOwner"].setErrors({
            required: true
          });
      this.service.validateAllFormFields(this.Adddealmodule);
    }
    ev.stopPropagation();
  }
  rlsDropdownList: any;
  addModule() {
    this.showaddModule = true;
    this.noRecordFound = false;
    this.saveexpand = true;
    const dropdown = this.dropdownList.Output.Group1.RLSServiceLine;
    console.log(dropdown, "dropdowndata.Group1.RLSServiceLine");
    this.moduleListTable.length > 0 ? (this.showModules = true) : "";
    if (dropdown.length > 0 && dropdown != undefined) {
      this.rlsDropdownList =  dropdown.sort(function(a, b){
                   
        if(a.ServiceLineName.toLowerCase() < b.ServiceLineName.toLowerCase()){
          return -1
        }
        else if(a.ServiceLineName.toLowerCase() > b.ServiceLineName.toLowerCase()){
          return 1
        }
        else{
          return 0;
        }
      });
      console.log(dropdown,"dropdown..")
    //  this.rlsDropdownList = dropdown;
      this.Adddealmodule.setControl("serviceLines", new FormArray([]));
      const control = <FormArray>this.Adddealmodule.controls.serviceLines;
      dropdown.map(item => {
        item.Selected = true;
        control.push(
          this.fb.group({
            status: false,
            lines: item
          })
        );
      });
    } else {
      this._error.throwError("No Service Lines Found");
    }
  }

  onFormChange() {
    this.Adddealmodule.valueChanges.subscribe(res => {
      console.log("res==>", res);
      this.setCache(res);
    });
  }

  deleteaddModule(event?) {
    event ? event.preventDefault() : "";
    console.log("1111111111");
    this.showaddModule = false;
    console.log("222222222");
    this.Adddealmodule.reset();
    console.log("33333333333");
    this.Adddealmodule.controls.copymodule.setValue(false);
    console.log("4444444444444");
    this.Adddealmodule.controls.copymodulename.setValue("");
    console.log("55555555555");
    this.Adddealmodule.setControl("moduleOwner", new FormArray([]));
    console.log("666666666666");
    this.Adddealmodule.controls.project_start_date.setErrors(null);
    console.log("777777777777");
    this.moduleListTable.length > 0
      ? (this.showModules = true)
      : (this.noRecordFound = true);
    console.log("88888888888888");
    this.deleteCache();
  }

  OpenCoOwners(index) {
    const dialogRef = this.dialog.open(coOwnerspopComponent, {
      width: "396px",
      data: {
        index: index,
        loadManageTable: this.moduleListTable,
        loadDealTable: this.moduleTableInfo
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != "" && res != undefined) {
        this.issaveLoader = true;
        this.deals.addCowonerInfo(res.object).subscribe((result: any) => {
          if (result.ReturnFlag == "S") {
            this.moduleTableInfo[res.index].ModuleTeam =
              result.Output.ModuleTeamMemberList;
            this.LoadManageDeal.Output.ModuleList[res.index].ModuleTeam =
              result.Output.ModuleTeamMemberList;
            let editres = [
              this.LoadManageModule,
              this.LoadManageDeal,
              this.dropdownList
            ];
            this.store.dispatch(new ModuleListAction({ ModuleList: editres }));
            this._error.throwError(result.Output.ReturnMessage);
            this.issaveLoader = false;
          } else {
            this.issaveLoader = false;
            this._error.throwError(result.ReturnMessage);
          }
        });
      }
    });
  }
  OpenModuleOwners() {
    const dialogRef = this.dialog.open(ModulepopComponent, {
      width: "396px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != "" && result != undefined) {
        if (result.length > 0) {
          console.log("result-->", result);
          this.SelectedModuleOwner = result;
          this.Adddealmodule.setControl("moduleOwner", new FormArray([]));
          result.map((o, i) => {
            console.log("o-->", o);
            o.Selected = true;
            (this.Adddealmodule.controls.moduleOwner as FormArray).push(
              this.fb.group({ status: false, owners: o })
            );
          });
          console.log("this.Adddealmodule-->", this.Adddealmodule.value);
          this.setCache(this.Adddealmodule.value);
        }
      }
    });
  }
  deleteOwner() {
    this.Adddealmodule.setControl("moduleOwner", new FormArray([]));
    this.SelectedModuleOwner = [];
    this.setCache(this.Adddealmodule.value);
  }

  revertpop(index) {
    const dialogRef = this.dialog.open(modulePopUpComponent, {
      width: "396px",
      data: {
        getRevAction: true,
        getrevert: this.LoadManageDeal.Output,
        index: index
      }
    });
    dialogRef.afterClosed().subscribe(obj => {
      if (obj != "" && obj != undefined) {
        this.issaveLoader = true;
        this.deals.revertMod(obj).subscribe(
          (res: any) => {
            if (res.ReturnFlag == "S") {
              if (res.Output.ReturnFlag == "S") {
                this.getinputparams();
                const moduleuserinput = this.moduleListInput;
                this.deals
                  .getDealModuleList(moduleuserinput)
                  .subscribe(manageres => {
                    res.Output.DropDownMasters = this.DropDownMasters;
                    this.LoadManageDeal = res;
                    this.LoadManageModule = manageres;
                    let updatestore = [
                      this.LoadManageModule,
                      this.LoadManageDeal,
                      this.dropdownList
                    ];
                    this.store.dispatch(
                      new ModuleListAction({ ModuleList: updatestore })
                    );
                    this.store.dispatch(
                      new calculateDeals({ calculateDeal: undefined })
                    );
                    this._error.throwError(
                      "SUCCESS: Module reverted successfully"
                    );
                    this.issaveLoader = false;
                    this.deals.UpdateExistingDealsStore();
                  });
              } else {
                this._error.throwError(res.Output.ReturnMessage);
                this.issaveLoader = false;
              }
            } else {
              this.issaveLoader = false;
              console.log("Error-->");
            }
          },
          error => {
            this.issaveLoader = false;
            console.log("Error", error);
          }
        );
      }
    });
  }
  getAction: boolean;
  moduledelete(index) {
    console.log("inside module delete..");
    const dialogRef = this.dialog.open(modulePopUpComponent, {
      width: "396px",
      data: {
        getAction: true,
        getdeleted: this.LoadManageDeal.Output,
        index: index
      }
    });
    dialogRef.afterClosed().subscribe(resobj => {
      if (resobj != "" && resobj != undefined) {
        this.issaveLoader = true;
        this.deals.deleteDealModule(resobj).subscribe(
          res => {
            if (res.ReturnFlag == "S") {
              this.deals.UpdateExistingDealsStore();
              let encrypteddata = this.encrDecrService.set(
                "EncryptionEncryptionEncryptionEn",
                JSON.stringify(res),
                "DecryptionDecrip"
              );
              sessionStorage.setItem("LoadManageModule", encrypteddata);
              this.LoadManageModule.Output.splice(index, 1);
              this.LoadManageDeal.Output.ModuleList.splice(index, 1);
              let response = [
                this.LoadManageModule,
                this.LoadManageDeal,
                this.dropdownList
              ];
              this.store.dispatch(
                new ModuleListAction({ ModuleList: response })
              );
              this.store.dispatch(
                new calculateDeals({ calculateDeal: undefined })
              );
              this.LoadManageDeal.Output.ModuleList.length == 0
                ? (this.showaddModule = false)
                : "";
              this._error.throwError("Module Deleted Succesfully");
              this.issaveLoader = false;
              if (res.Output.ModuleList.length == 0) {
                this.sendMessage(true);
              }
            } else {
              this._error.throwError(res.ReturnMessage);
              this.issaveLoader = false;
            }
          },
          error => {
            this.issaveLoader = false;
          }
        );
      }
    });
  }
  dropdownSelectedModule: string = "Select Module";
  SelectCopyModule(event) {
    this.dropdownSelectedModule =
      "Selected" +
      this.LoadManageDeal.Output.ModuleList[event.value].ModuleName;
  }
  copyToggle() {
    this.Adddealmodule.controls.moduleName.setErrors(null);
    this.Adddealmodule.controls.serviceLines.setErrors(null);
    this.Adddealmodule.controls.moduleOwner.setErrors(null);
    this.Adddealmodule.controls.copymodulename.setErrors(null);
    this.Adddealmodule.controls.project_start_date.setErrors(null);
  }
  copymodule(e) {
    console.log(this.SelectedModuleOwner, "this.SelectedModuleOwner");
    console.log("this.Adddealmodule-->", this.Adddealmodule);
    this.Adddealmodule.controls.moduleName.value != null &&
    this.Adddealmodule.controls.moduleName.value != ""
      ? this.Adddealmodule.controls.moduleName.setErrors(null)
      : this.Adddealmodule.controls.moduleName.setErrors({ required: true });
    this.Adddealmodule.controls.copymodulename.value.toString() != ""
      ? this.Adddealmodule.controls.copymodulename.setErrors(null)
      : this.Adddealmodule.controls.copymodulename.setErrors({
          required: true
        });
    if (this.Adddealmodule.valid) {
      const servicelines = this.Adddealmodule.controls.serviceLines.value;
      const selectedlineIds = servicelines.filter(v => v.status !== false);
      const selectedServiceList = selectedlineIds.map(item => item.lines);
      const start_date = _moment(
        this.Adddealmodule.controls.project_start_date.value
      ).format("MMM/YYYY");
      const dialogRef = this.dialog.open(modulePopUpComponent, {
        width: "396px",
        data: {
          getAction: false,
          serviceLines: selectedServiceList,
          project_start_date:
            start_date != "Invalid date"
              ? start_date.split("/")[0] + "-" + start_date.split("/")[1]
              : "",
          getCopied: this.LoadManageDeal.Output,
          index: this.Adddealmodule.controls.copymodulename.value,
          moduleOwner:
            this.SelectedModuleOwner.length > 0 ? this.SelectedModuleOwner : "",
          moduleName: this.Adddealmodule.controls.moduleName.value
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response != "" && response != undefined) {
          this.issaveLoader = true;
          this.deals.copyDealModule(response).subscribe(
            res => {
              if (res.ReturnFlag == "S") {
                if (res.Output.ReturnFlag == "S") {
                  this.deleteCache();
                  this.getinputparams();
                  const moduleuserinput = this.moduleListInput;
                  this.SelectedModuleOwner = [];
                  this.deals
                    .getDealModuleList(moduleuserinput)
                    .subscribe(manageres => {
                      this.LoadManageDeal.Output.ModuleList =
                        res.Output.ModuleList;
                      this.LoadManageModule = manageres;
                      let updatestore = [
                        this.LoadManageModule,
                        this.LoadManageDeal,
                        this.dropdownList
                      ];
                      this.store.dispatch(
                        new ModuleListAction({ ModuleList: updatestore })
                      );
                      this.deleteaddModule();
                      this._error.throwError(res.Output.ReturnMessage);
                      this.issaveLoader = false;
                    });
                } else {
                  this._error.throwError(res.Output.ReturnMessage);
                  this.issaveLoader = false;
                }
              } else {
                this.issaveLoader = false;
                this._error.throwError(res.ReturnMessage);
                console.log("Error-->");
              }
            },
            error => {
              this.issaveLoader = false;
              console.log("Error", error);
            }
          );
        }
      });
    } else {
      console.log("Form is not valid-->");
      this.saveexpand = true;
      this.panelOpenState = true;
      e.stopPropagation();
    }
  }
  invalidmodulename: boolean = false;
  renamemodule(index, modulename) {
    if (modulename != null && modulename != "") {
      const basicinfo = this.LoadManageDeal.Output;
      const obj = {};
      (obj["UserInfo"] = {
        EmpName: this.userInfo.EmployeeName,
        AdId: this.userInfo.EmployeeId,
        EmpEmail: this.userInfo.EmployeeMail,
        EmpID: this.userInfo.EmployeeId,
        EmpNo: this.userInfo.EmployeeId
      }),
        (obj["MasterData"] = basicinfo.MasterData);
      obj["pUpdateModInput"] = {
        ModuleId: basicinfo.ModuleList[index].ModuleID,
        ModuleName: modulename,
        CustomerModuleName: ""
      };
      this.issaveLoader = true;
      this.deals.renameModuleName(obj).subscribe(
        (res: any) => {
          if (res.ReturnFlag == "S") {
            if (res.Output.ReturnFlag == "S") {
              const moduleuserinput = this.moduleListInput;
              this.LoadManageModule.Output[
                index
              ].MasterData.ModuleName = modulename;
              this.LoadManageModule.Output[
                index
              ].ModuleHeader.ModuleName = modulename;
              res.Output.DropDownMasters = this.DropDownMasters;
              this.LoadManageDeal = res;
              let updatestore = [
                this.LoadManageModule,
                this.LoadManageDeal,
                this.dropdownList
              ];
              this.store.dispatch(
                new ModuleListAction({ ModuleList: updatestore })
              );
              this.store.dispatch(
                new calculateDeals({ calculateDeal: undefined })
              );
              this._error.throwError(res.Output.ReturnMessage);
              this.issaveLoader = false;
            } else {
              this._error.throwError(res.Output.ReturnMessage);
              this.issaveLoader = false;
            }
          } else {
            this.issaveLoader = false;
            console.log("Error-->");
          }
        },
        error => {
          this.issaveLoader = false;
          console.log("Error", error);
        }
      );
    } else {
      this.issaveLoader = false;
      this.invalidmodulename = true;
    }
  }
  checkvalidname(modulename) {
    if (modulename.target.value.length > 0) {
      this.invalidmodulename = false;
    } else {
      this.invalidmodulename = true;
    }
  }
  ngOnDestroy() {
    this.combinedResponse$.unsubscribe();
    this.pastDealEnable$.unsubscribe();
  }
}

@Component({
  selector: "co-owners-popup",
  templateUrl: "./co-owners-popup.html",
  styleUrls: ["./deal-module.component.scss"]
})
export class coOwnerspopComponent implements OnInit {
  coOwerForm: FormGroup;
  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;
  iscoOwnersSearchLoading: boolean = false;
  userInfo: any;
  arrowkeyLocation = 0;
  constructor(
    public dialogRef: MatDialogRef<coOwnerspopComponent>,
    public store: Store<AppState>,
    private deals: dealService,
    public _error: ErrorMessage,
    public fb: FormBuilder,
    public encrDecrService: EncrDecrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.coOwerForm = this.fb.group({
      customerName: [""]
    });
  }

  ngOnInit(): void {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
  }
  customerNameclose() {
    this.customerNameSwitch = false;
  }

  appendcustomer(item: any, i) {
    //  this.customerName = item.EmployeeName;
    this.selectedCustomer = [];
    this.selectedCustomer.push(item);
    this.coOwerForm.patchValue({
      customerName: ""
    });
    this.customerNameSwitch = false;
  }
  deleteSelectedUser(index) {
    this.selectedCustomer = [];
    this.customerName = "";
  }
  customerContact: {}[] = [];
  selectedCustomer: any = [];
  addCoOwner() {
    var ownerbasicinfo: any = [];
    const getModuleInfo: any = this.data;
    var obj = {};
    const index = getModuleInfo.index;

    obj["User"] = {
      EmployeeId: this.userInfo.EmployeeId,
      EmployeeName: this.userInfo.EmployeeName,
      EmployeeNumber: this.userInfo.EmployeeNumber,
      EmployeeMail: this.userInfo.EmployeeMail,
      ClientIP: ""
    };
    (obj["MasterData"] = getModuleInfo.loadManageTable[index].MasterData),
      (obj["ModuleHeader"] = getModuleInfo.loadManageTable[index].ModuleHeader),
      (obj["DealHeader"] = getModuleInfo.loadManageTable[index].DealHeader);
    obj["Module"] = {
      DealHeaderID: getModuleInfo.loadDealTable[index].DealHeaderID,
      ModuleID: getModuleInfo.loadDealTable[index].ModuleID,
      OptionID: getModuleInfo.loadDealTable[index].OptionID,
      ModuleOwnerEmailId:
        getModuleInfo.loadManageTable[index].ModuleHeader.ModuleOwnerEmailID,
      ModuleTeamEmailID:
        getModuleInfo.loadManageTable[index].ModuleHeader.ModuleTeamEmailID
    };
    obj["Employee"] = {
      EmployeeNumber: this.selectedCustomer[0].AdId,
      EmployeeName: this.selectedCustomer[0].FullName,
      EmployeeMail: this.selectedCustomer[0].Email,
      EmployeeId: this.selectedCustomer[0].AdId
    };

    this.dialogRef.close({ object: obj, index: index });
  }
  couserSearchMethod(event) {
    console.log(this.coOwerForm.controls.customerName.value);
    let searchInformation =
      this.coOwerForm.controls.customerName.value == null ||
      this.coOwerForm.controls.customerName.value == ""
        ? "a"
        : this.coOwerForm.controls.customerName.value;
    this.deals.searchWiproEmployees(searchInformation).subscribe(
      async response => {
        let res = await response;
        this.iscoOwnersSearchLoading = true;
        this.customerContact = [];
        if (!res.IsError) {
          console.log(res, "res is coming..");
          this.customerContact = res.ResponseObject;
          this.iscoOwnersSearchLoading = false;
        } else {
          console.log("no.........");
          this.customerContact = [];
          // this._error.throwError(
          //   '"Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"'
          // );
        }
        console.log(res, ".//////////////////");
      });
  }
}

@Component({
  selector: "module-owner-popup",
  templateUrl: "./module-owner-popup.html",
  styleUrls: ["./deal-module.component.scss"]
})
export class ModulepopComponent implements OnInit {
  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;
  isDealOwnersSearchLoading: boolean = false;
  moduleOwerForm: FormGroup;
  dealOverview: any;
  arrowkeyLocation = 0;
  constructor(
    public dialogRef: MatDialogRef<ModulepopComponent>,
    public fb: FormBuilder,
    private deals: dealService,
    public _error: ErrorMessage,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.moduleOwerForm = this.fb.group({
      customerName: [""]
    });
  }
  ngOnInit() {}
  userSearchMethod(event) {
    console.log(this.moduleOwerForm.controls.customerName.value); 
    let searchInformation =
      this.moduleOwerForm.controls.customerName.value == null ||
      this.moduleOwerForm.controls.customerName.value == ""
        ? "a"
        : this.moduleOwerForm.controls.customerName.value;
    this.deals.searchWiproEmployees(searchInformation).subscribe(
      async response => {
        let res = await response;
        this.isDealOwnersSearchLoading = true;
        this.modulecustomerContact = [];
        if (!res.IsError) {
          console.log(res, "res is coming..");
          this.modulecustomerContact = res.ResponseObject;
          this.isDealOwnersSearchLoading = false;
        } else {
          console.log("no.........");
          this.modulecustomerContact = [];
          // this._error.throwError(
          //   '"Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"'
          // );
        }
        console.log(res, ".//////////////////");
      });
  }
  customerNameclose() {
    this.customerNameSwitch = false;
  }
  appendmodulecustomer(item: any, i) {
    this.customerName = item.FullName;
    console.log("item",item);
    this.selectedModuleCustomer = [];
    this.selectedModuleCustomer.push(item);
    this.moduleOwerForm.patchValue({
      customerName: ""
    });
    this.customerNameSwitch = false;
  }
  deleteSelectedUser(index) {
    this.selectedModuleCustomer = [];
    this.customerName = "";
  }
  modulecustomerContact: {}[] = [];

  selectedModuleCustomer: any = [];
  addModuleOwner() {
    if (this.selectedModuleCustomer.length > 0) {
      this.dialogRef.close(this.selectedModuleCustomer);
    }
  }
}
@Component({
  selector: "deal-pop",
  templateUrl: "./deal-popup.html",
  styleUrls: ["./deal-module.component.scss"]
})
export class modulePopUpComponent {
  showpopup: any;
  showrevrt: boolean;
  issaveLoader: boolean = false;
  userInfo: any;
  revertmodulename: string;
  copyMsg: any;
  deletename: string;
  constructor(
    public dialogRef: MatDialogRef<modulePopUpComponent>,
    public _error: ErrorMessage,
    public service: DataCommunicationService,
    private deals: dealService,
    public encrDecrService: EncrDecrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );

    this.userInfo = JSON.parse(userInfo);
    const element: any = data;
    this.showpopup = element.getAction;
    console.log(element, "element this.copyMsg");
    console.log(element.getAction, "element this.copyMsg");
    console.log(this.showpopup, "showpopup this.copyMsg");
    this.copyMsg = element;
    element.getAction == true
      ? (this.deletename =
          element.getdeleted.ModuleList[element.index].ModuleName)
      : "";
    element.getRevAction != undefined
      ? (this.showrevrt = element.getRevAction)
      : (this.showrevrt = false);
    element.getRevAction != undefined
      ? (this.revertmodulename =
          element.getrevert.ModuleList[element.index].ModuleName)
      : "";
  }
  copySelected() {
    const basicinfo: any = this.data;
    const record: any = basicinfo.getCopied;
    var obj = {};
    var statusObj = {};

    obj["UserInfo"] = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeId
    };
    obj["MasterData"] = record.MasterData;
    obj["ManageInfo"] = record.ManageInfo;

    obj["CopyModuleInput"] = {
      ModuleName: basicinfo.moduleName,
      MachineIp: record.MasterData.MachineIp,
      DealHeaderId: record.ModuleList[basicinfo.index].DealHeaderID,
      ProjectStartDate:
        basicinfo.project_start_date != ""
          ? basicinfo.project_start_date
          : record.ModuleList[basicinfo.index].ProjectStartDate,
      ModuleOwner: {
        Status: "",
        ClientIP: "",
        EmployeeId:
          basicinfo.moduleOwner != "" ? basicinfo.moduleOwner[0].AdId : "",
        EmployeeMail:
          basicinfo.moduleOwner != "" ? basicinfo.moduleOwner[0].Email : "",
        EmployeeName:
          basicinfo.moduleOwner != "" ? basicinfo.moduleOwner[0].FullName : "",
        EmployeeNumber:
          basicinfo.moduleOwner != "" ? basicinfo.moduleOwner[0].AdId : ""
      },
      ServiceLines:
        basicinfo.serviceLines.length > 0
          ? basicinfo.serviceLines
          : record.ModuleList[basicinfo.index].ServiceLines,
      ExistingModuleID: record.ModuleList[basicinfo.index].ModuleID
    };
    this.dialogRef.close(obj);
  }
  deleteSelected() {
    const basicinfo: any = this.data;
    const record: any = basicinfo.getdeleted;
    var obj = {};
    obj["UserInfo"] = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeId
    };
    obj["MasterData"] = record.MasterData;
    (obj["Module"] = {
      ModuleId: record.ModuleList[basicinfo.index].ModuleID,
      ModuleName: record.ModuleList[basicinfo.index].ModuleName,
      ModuleStatusCode: record.ModuleList[basicinfo.index].ModuleStatus
    }),
      (obj["AuditLogData"] = {
        AuditLog: [
          {
            Id: record.ModuleList[basicinfo.index].ModuleID,
            TableName: "Module",
            ColumnName: "ModuleName",
            OldValue: record.ModuleList[basicinfo.index].ModuleName,
            NewValue: ""
          }
        ]
      });
    this.dialogRef.close(obj);
  }
  revertSelected() {
    const basicinfo: any = this.data;
    const record: any = basicinfo.getrevert;
    var obj = {};
    obj["UserInfo"] = {
      EmpName: this.userInfo.EmployeeName,
      AdId: this.userInfo.EmployeeId,
      EmpEmail: this.userInfo.EmployeeMail,
      EmpID: this.userInfo.EmployeeId,
      EmpNo: this.userInfo.EmployeeId
    };
    obj["MasterData"] = record.MasterData;
    obj["Module"] = {
      ModuleId: record.ModuleList[basicinfo.index].ModuleID,
      ModuleName: record.ModuleList[basicinfo.index].ModuleName,
      ModuleStatusCode: record.ModuleList[basicinfo.index].ModuleStatus
    };
    this.dialogRef.close(obj);
  }
}
