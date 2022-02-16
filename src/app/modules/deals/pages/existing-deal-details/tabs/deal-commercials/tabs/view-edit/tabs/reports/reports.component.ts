import { Component, OnInit, OnDestroy } from '@angular/core';
import { DealJsonService } from '@app/core/services/deals/dealjsonservice';
import { DealDropdownService } from '@app/core/services/deals/deal-dropdown.service';
import { ValidateforNullnUndefined } from '@app/core/services/validateforNULLorUndefined.service';
import { dealService } from '@app/core/services/deals.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { selectAllModules } from '@app/core/state/selectors/deals/deals-module.selector';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ErrorMessage } from '@app/core';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  chosenReport: any = 0;
  reportList = [];
  reportSelected: boolean = true;
  chosenType: string = "deal";
  plReportDet: boolean;
  reportype: any = 0;
  peroidtype: boolean = true;
  reportTypeList = ["Deal", "Module"];
  modulename: any = 0;
  periodList = [];
  period: any = 0;
  currencyCode: any = 0;
  currencyList = [];
  currencySelected: boolean = true;
  modDet: boolean = false;
  walkthroughtDet: boolean;
  rookieDet: boolean;
  dumpDet: boolean;
  dealInputData: any;
  ReportNames: any;
  reportsData: any;
  dealOverview: any;
  manageDealOverview: any;
  dealReportForm: FormGroup;
  submittedDealReportForm: boolean = false;
  userInfo: any;
  showReport: boolean = false;
  Parameters: any;
  LoadmoduleList: any;
  showRptViewReportsBtn: boolean;
  moduleResponse$: Subscription = new Subscription();
  combinedResponse$: Subscription = new Subscription();
  moduleHeaderDetails: any;
  iframeLoader: boolean = false;
  isLoading: boolean = false;
  currencyToggle: boolean;
  periodToggle: boolean;

  // DealreportsData: [];
  //PeriodTypeData: [];
  //CurrencyData: [];
  constructor(private jsonservice: DealJsonService,
    private dropdownservice: DealDropdownService,
    private _validate: ValidateforNullnUndefined,
    private deals: dealService,
    private fb: FormBuilder,
    public encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    public _error: ErrorMessage,
    public sanitizer: DomSanitizer) {
    this.dealReportForm = this.fb.group({
      dealReportDataVal: ["", [Validators.required]],
      dealSelectReportlDataVal: ["", [Validators.required]],
      dealModuleNameDataVal: ["", [Validators.required]],
      dealPeriodTypeDataVal: ["", [Validators.required]],
      dealCurrencyDataVal: ["", [Validators.required]]
    });

    this.dealSelectReportlDataVal.valueChanges.subscribe(val => {
      // if (val == '13' || val == '14') {
      //   this.currencyToggle = true;
      //   this.periodToggle = true;
      //   this.dealCurrencyDataVal.clearValidators();
      //   this.dealCurrencyDataVal.updateValueAndValidity();
      //   this.dealPeriodTypeDataVal.patchValue('Quarterly');
      //   this.dealPeriodTypeDataVal.clearValidators();
      //   this.dealPeriodTypeDataVal.updateValueAndValidity();
      //   this.showRptViewReportsBtn = true
      // } else if (val == '') {
      //   this.dealReportForm.disabled
      // } else {
      //   this.currencyToggle = false;
      //   this.periodToggle = false;
      //   this.dealCurrencyDataVal.setValidators([Validators.required]);
      //   this.dealCurrencyDataVal.updateValueAndValidity();
      //   this.dealPeriodTypeDataVal.setValidators([Validators.required]);
      //   this.dealPeriodTypeDataVal.updateValueAndValidity();
      //   this.showRptViewReportsBtn = false
      // }
      let dealstatus = this.dealOverview.status;
      console.log("Status: ", dealstatus)
      if(dealstatus == "Calculated" || dealstatus == "Approved"){
        this.showRptViewReportsBtn = true
        if (val == '13' || val == '14') {
        this.currencyToggle = true;
        this.periodToggle = true;
        this.dealCurrencyDataVal.clearValidators();
        this.dealCurrencyDataVal.updateValueAndValidity();
        this.dealPeriodTypeDataVal.patchValue('Quarterly');
        this.dealPeriodTypeDataVal.clearValidators();
        this.dealPeriodTypeDataVal.updateValueAndValidity();
       }else{
        this.currencyToggle = false
        this.periodToggle = false
        this.dealCurrencyDataVal.setValidators([Validators.required]);
        this.dealCurrencyDataVal.updateValueAndValidity();
        this.dealPeriodTypeDataVal.setValidators([Validators.required]);
        this.dealPeriodTypeDataVal.updateValueAndValidity();
       }
      }else{
        // (val == '13' || val == '14') ? this.showRptViewReportsBtn = true : this.showRptViewReportsBtn = false
        // this.currencyToggle = false;
        // this.periodToggle = false;
        // this.dealCurrencyDataVal.setValidators([Validators.required]);
        // this.dealCurrencyDataVal.updateValueAndValidity();
        // this.dealPeriodTypeDataVal.setValidators([Validators.required]);
        // this.dealPeriodTypeDataVal.updateValueAndValidity();
        if(val == '13' || val == '14'){
          this.currencyToggle = true;
          this.periodToggle = true;
          this.showRptViewReportsBtn = true
          this.dealCurrencyDataVal.clearValidators();
          this.dealCurrencyDataVal.updateValueAndValidity();
          this.dealPeriodTypeDataVal.patchValue('Quarterly');
          this.dealPeriodTypeDataVal.clearValidators();
          this.dealPeriodTypeDataVal.updateValueAndValidity();
        }else{
           this.currencyToggle = false;
           this.periodToggle = false;
           this.showRptViewReportsBtn = false
           this.dealCurrencyDataVal.setValidators([Validators.required]);
           this.dealCurrencyDataVal.updateValueAndValidity();
           this.dealPeriodTypeDataVal.setValidators([Validators.required]);
           this.dealPeriodTypeDataVal.updateValueAndValidity();
        }
      }
    });


  }


  get dealSelectReportlDataVal(): FormControl {
    return this.dealReportForm.get('dealSelectReportlDataVal') as FormControl;
  }

  get dealCurrencyDataVal(): FormControl {
    return this.dealReportForm.get('dealCurrencyDataVal') as FormControl;
  }

  get dealPeriodTypeDataVal(): FormControl {
    return this.dealReportForm.get('dealPeriodTypeDataVal') as FormControl;
  }

  // selectreport() {
  //   switch (this.chosenReport) {
  //     case "PLReport":
  //       this.plReportDet = true;
  //       this.walkthroughtDet = false;
  //       this.rookieDet = false;
  //       this.dumpDet = false;
  //       break;
  //     case "walkthrough":
  //       this.plReportDet = false;
  //       this.walkthroughtDet = true;
  //       this.rookieDet = false;
  //       this.dumpDet = false;
  //       break;
  //     case "rookie":
  //       this.plReportDet = false;
  //       this.walkthroughtDet = false;
  //       this.rookieDet = true;
  //       this.dumpDet = false;
  //       break;
  //     case "dump":
  //       this.plReportDet = false;
  //       this.walkthroughtDet = false;
  //       this.rookieDet = false;
  //       this.dumpDet = true;
  //       break;
  //   }
  // }

  selectType(e) {
    e.target.value == "Deal" ? (this.modDet = false, this.getReportData()) : this.modDet = true;
  }

  // plReport = [
  //   { label: 'Deal name', content: 'Test deal' },
  //   { label: 'Opp Id/Amend No', content: 'OPP0000655456466' },
  //   { label: 'Customer name', content: 'Ringo Steel-New' },
  //   { label: 'Pricing Id', content: 'PR656747487698' },
  //   { label: 'Deal currency', content: 'USD' },
  //   { label: 'Vertical', content: 'Energy' }
  // ]
  // dumpReport = [
  //   { label: 'Time interval period for period', content: 'Yearly' },
  //   { label: 'Billing rate type', content: 'Hourly' },
  //   { label: 'SBU', content: 'ENU' },
  //   { label: 'Vertical', content: 'Energy' },
  //   { label: 'Pricing Id', content: 'PR2016AMFG094011' },
  //   { label: 'Deal name', content: 'Test Deal' },
  //   { label: 'Deal value', content: '16,800' },
  //   { label: 'Currency', content: 'USD' },
  //   { label: 'Contingency%', content: '0.00%' },
  //   { label: 'Opp Id/Amend No', content: 'OPP0000223746590' },
  //   { label: 'Customer name', content: 'Ringo Steel -new' }
  // ]


  // plTable = [
  //   { part: 'Revenue(USD)', trans: '-', y01: '16,800', total: '16,800' },
  //   { part: 'Offshore', trans: '-', y01: '16,800', total: '16,800' },
  //   { part: 'Onsite', trans: '-', y01: '-', total: '-' },
  //   { part: 'Service Passthrough/Reimb', trans: '-', y01: '-', total: '-' },
  //   { part: 'Product passthrough', trans: '-', y01: '-', total: '-' },
  //   { part: 'Service Passthrough/Reimb', trans: '-', y01: '0.02', total: '0.02' }
  // ]

  // dumpTable = [
  //   { type: 'Steady', mod: 'Module1', cust: 'Ringo Steel - New', func: 'Business', seed: 'No', serv: 'MAS', practice: 'ACS' },
  //   { type: 'Steady', mod: 'Module1', cust: 'Ringo Steel - New', func: 'Business', seed: 'No', serv: 'MAS', practice: 'ACS' },
  //   { type: 'Steady', mod: 'Module1', cust: 'Ringo Steel - New', func: 'Business', seed: 'No', serv: 'MAS', practice: 'ACS' },
  //   { type: 'Steady', mod: 'Module1', cust: 'Ringo Steel - New', func: 'Business', seed: 'No', serv: 'MAS', practice: 'ACS' }
  // ]

  // rookieTable = [
  //   { serlyn: 'MAS', other: 'Others', q1: '0.67', q2: '00.00', q3: '00.00', q4: '00.00', q5: '00.00', q6: '00.00', q7: '00.00', total: '0.67' },
  //   { serlyn: 'Consolidated view (All service lines)', other: 'Others', q1: '0.67', q2: '00.00', q3: '00.00', q4: '00.00', q5: '00.00', q6: '00.00', q7: '00.00', total: '0.67' },

  // ]

  // revTable = [
  //   { part: 'Onsite revenue', trans: '-', y01: '-', total: '-' },
  //   { part: 'Onsite rev%', trans: '-', y01: '-', total: '-' },
  //   { part: 'Offshore revenue', trans: '-', y01: '17', total: '17' },
  //   { part: 'Offshore rev%', trans: '-', y01: '100%', total: '100%' },
  //   { part: 'Other service revenue', trans: '-', y01: '-', total: '-' },
  //   { part: 'Product revenue', trans: '-', y01: '-', total: '-' },
  //   { part: 'Total revenue', trans: '-', y01: '17', total: '17' }
  // ]

  // rateTable = [
  //   { part: 'Onsite rate', trans: '-', y01: '-', total: '-' },
  //   { part: 'Offshore rate', trans: '-', y01: '8,400', total: '8,400' }
  // ]

  async ngOnInit() {
    // this.plReportDet = true;
    let dealOverview = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('Dealoverview'), 'DecryptionDecrip');
    this.dealOverview = JSON.parse(dealOverview);
    console.log('deal overview', this.dealOverview)
    let userInfo = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('userInfo'), 'DecryptionDecrip');
    this.userInfo = JSON.parse(userInfo)
    // let manageDealOverview = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('LoadManageDealHeaders'), 'DecryptionDecrip');
    // this.manageDealOverview = JSON.parse(manageDealOverview)
    console.log('manage deal overview--->', this.manageDealOverview);

    this.moduleResponse$ = this.store.pipe(select(selectAllModules)).subscribe(res => {
      console.log('store res-->', res)
      this.manageDealOverview = res.ModuleList[1].Output
    })
    this.combinedResponse$ = this.store
      .pipe(select(selectAllModules))
      .subscribe(async res => {
        console.log("store res-->", res);
        if (res.ModuleList != undefined) {
          this.moduleHeaderDetails = res.ModuleList[1].Output;
          this.LoadmoduleList = res.ModuleList[1].Output.ModuleList
        }
      });

    let fillmanageparmsInfo = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('getFillManageParameters'), 'DecryptionDecrip');
    const paramsinfo = JSON.parse(fillmanageparmsInfo)
    paramsinfo.Output.ValidationFlag.btnViewReports.Visible == 'true' ? (this.showRptViewReportsBtn = true) : (this.showRptViewReportsBtn = false);


    // let header = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('ModuleHeaders'), 'DecryptionDecrip');
    // console.log(header);
    // let dealOverview1 = JSON.parse(header);
    // console.log(dealOverview1[0].ModuleName)
    // this.moduleList.push({
    //   "ModuleID":dealOverview1[0].ModuleID,
    //   "ModuleName":dealOverview1[0].ModuleName
    // })

    //this.getReportData(this.LoadmoduleList);
    const CacheResponse = await this.deals.getModuleListCacheData()
    if (CacheResponse) {
      if (CacheResponse.data.length > 0) {
        console.log(CacheResponse.data[1])
        this.moduleHeaderDetails = CacheResponse.data[1].Output;
        this.LoadmoduleList = CacheResponse.data[1].Output.ModuleList
      }
    }

  }

  get grrForm() {
    return this.dealReportForm.controls;
  }
  getModuleDataReportData(moduleinfo) {
    this.showReport = false
    this.dealInputData =
      {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeId
        },
        MasterData: {
          PricingId: this.dealOverview.pricingId ? (this.dealOverview.pricingId).toUpperCase() : "",
          TraceOppId: this.dealOverview.oppId,
          DealId: this.dealOverview.id,
          DealWonLoss: null,
          DealHeaderNumber: this.manageDealOverview.MasterData.DealHeaderNumber,
          DealVersionId: this.manageDealOverview.MasterData.DealVersionId,
          DealHeaderName: this.manageDealOverview.MasterData.DealHeaderName,
          DealValue: null,
          DOEmailId: this.manageDealOverview.DOEmailId,
          ModuleCount: this.manageDealOverview.ModuleCount,
          ModuleOwnerEmailId: this.ModuleOwnerEmailId(),
          ModuleBFMEmailId: this.ModuleBFMEmailId(),
          ModulePSPOCEmailId: "",
          ModuleId: moduleinfo.ModuleID,
          ModuleNumber: moduleinfo.ModuleNumber,
          ModuleVersionId: moduleinfo.ModuleVersion,
          ModuleName: moduleinfo.ModuleName,
          ModuleStatusCode: moduleinfo.ModuleStatus,
          ServiceLines: null,
          OptionId: this.dealOverview.OptionId,
          OptionNumber: this.manageDealOverview.MasterData.OptionNumber,
          OptionName: this.manageDealOverview.MasterData.OptionName,
          OptionVersionId: this.manageDealOverview.MasterData.OptionVersionId,
          OptionStatusCode: this.moduleHeaderDetails.MasterData.OptionStatusCode,
          DealStatus: null,
          RLSId: null,
          RLSVersionId: null,
          SourcePage: "",
          MachineIp: this.manageDealOverview.MasterData.MachineIp,
          GroupCode: null,
          RoleId: null,
          CurrencyCode: this.manageDealOverview.MasterData.CurrencyCode,
          MsaRequired: "0.0000000000000",
          AmendmentNo: null,
          BFM_PSPOC_Vertical: null,
          ModuleTeamEmailID: null,
          AddModuleVisible: this.manageDealOverview.MasterData.AddModuleVisible,
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
      }
    this.isLoading = true;
    this.deals.getModuleReportData(this.dealInputData).subscribe(res => {
      console.log(res);
      this.reportsData = res.Output
      this.isLoading = false;
      debugger
      this.reportList = this.reportsData.ReportNames;
      this.periodList = this.reportsData.PeriodType;
      this.currencyList = this.reportsData.Currency;
    }, error => {
      console.log('Error', error);
      return null;
    })
  }
  getReportData() {
    this.dealInputData =
      {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeId
        },
        MasterData: {
          PricingId: this.dealOverview.pricingId ? (this.dealOverview.pricingId).toUpperCase() : "",
          TraceOppId: this.dealOverview.oppId,
          DealId: this.dealOverview.id,
          DealWonLoss: null,
          DealHeaderNumber: this.manageDealOverview.MasterData.DealHeaderNumber,
          DealVersionId: this.manageDealOverview.MasterData.DealVersionId,
          DealHeaderName: this.manageDealOverview.MasterData.DealHeaderName,
          DealValue: null,
          DOEmailId: this.manageDealOverview.DOEmailId,
          ModuleCount: this.manageDealOverview.ModuleCount,
          ModuleOwnerEmailId: this.ModuleOwnerEmailId(),
          ModuleBFMEmailId: this.ModuleBFMEmailId(),
          ModulePSPOCEmailId: "",
          ModuleId: null,
          ModuleNumber: null,
          ModuleVersionId: null,
          ModuleName: null,
          ModuleStatusCode: null,
          ServiceLines: null,
          OptionId: this.dealOverview.OptionId,
          OptionNumber: this.manageDealOverview.MasterData.OptionNumber,
          OptionName: this.manageDealOverview.MasterData.OptionName,
          OptionVersionId: this.manageDealOverview.MasterData.OptionVersionId,
          OptionStatusCode: this.moduleHeaderDetails.MasterData.OptionStatusCode,
          DealStatus: null,
          RLSId: null,
          RLSVersionId: null,
          SourcePage: "",
          MachineIp: this.manageDealOverview.MasterData.MachineIp,
          GroupCode: null,
          RoleId: null,
          CurrencyCode: this.manageDealOverview.MasterData.CurrencyCode,
          MsaRequired: "0.0000000000000",
          AmendmentNo: null,
          BFM_PSPOC_Vertical: null,
          ModuleTeamEmailID: null,
          AddModuleVisible: this.manageDealOverview.MasterData.AddModuleVisible,
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
          RookieAndBulgeData: null,
        }
      }
    this.isLoading = true;
    this.deals.getReportsDropDowns(this.dealInputData).subscribe(res => {
      console.log(res);
      if(res.ReturnFlag == 'S'){
        let response = res.Output
        if(response.ReturnFlag == 'S'){
          this.reportsData = res.Output
          this.isLoading = false;
          this.reportList = this.reportsData.ReportNames;
          this.periodList = this.reportsData.PeriodType;
          this.currencyList = this.reportsData.Currency;
          this.isLoading = false;
        }else{
          this.isLoading = false;
          this._error.throwError(response.ReturnMessage)
        }
      }else{
         this.isLoading = false;
         this._error.throwError(res.ReturnMessage)
      }
    }, error => {
      console.log('Error', error);
       this.isLoading = false;
      return null;
    })
  }



  ModuleOwnerEmailId() {
    let moduleOwner = []
    moduleOwner = this.LoadmoduleList.map(x => x.ModuleOwner)
    moduleOwner = moduleOwner.map(x => x.EmployeeMail)
    let json = moduleOwner.join()
    return json
  }

  ModuleBFMEmailId() {
    let moduleBFMEmailId = []
    moduleBFMEmailId = this.LoadmoduleList.map(x => x.ModuleBFM)
    moduleBFMEmailId = moduleBFMEmailId.map(x => x.EmployeeMail)
    let json = moduleBFMEmailId.join()
    return json
  }

  viewreportdata: SafeUrl;
  viewReport() {
    this.submittedDealReportForm = true;
    this.dealReportForm.controls.dealReportDataVal.value == 'Deal' ? (
      this.dealReportForm.controls.dealModuleNameDataVal.clearValidators(),
      this.dealReportForm.controls.dealModuleNameDataVal.updateValueAndValidity())
      : (this.dealReportForm.controls.dealModuleNameDataVal.setValidators([Validators.required]),
        this.dealReportForm.controls.dealModuleNameDataVal.updateValueAndValidity())
    console.log(this.dealReportForm, "this.dealReportForm")
    // if (!this.modDet) {
    //   this.dealReportForm.controls.dealModuleNameDataVal.disable();
    // } else {
    //   this.dealReportForm.controls.dealModuleNameDataVal.enable();
    // }
    if (this.dealReportForm.valid) {
      console.log("successs...", this.dealReportForm.value);
      console.log(this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleVersion);
      console.log(JSON.stringify(this.dealReportForm.controls.dealModuleNameDataVal.value));
      console.log("My Method", this.dealReportForm.controls.dealModuleNameDataVal);
      let dealData = this.manageDealOverview;
      // let DealHeaderId;
      //   dealData.ModuleList.map(x => {
      //     if (x.ModuleID == this.dealReportForm.controls.dealModelDataVal.value) {
      //       DealHeaderId = x.DealHeaderID
      //     }
      //   })
      let input = {
        "spParams":
        {
          "Action": "V",
          "ReportLevel": this.dealReportForm.controls.dealReportDataVal.value == 'Deal' ? "D" : "M",
          "DealHeaderNumber": this.manageDealOverview.MasterData.DealHeaderNumber,
          "OptionNumber": this.manageDealOverview.MasterData.OptionNumber,
          "OptionVersion": this.manageDealOverview.MasterData.OptionVersionId,
          "UserId": this.userInfo.EmployeeId,
          "DealVersion": this.manageDealOverview.MasterData.DealVersionId

        },
        "MasterData": this.dealReportForm.controls.dealReportDataVal.value == 'Deal' ? {} :
          {
            "ModuleID": this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleID,
            "ModuleNumber": this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleNumber,
            "ModuleVersionID": Math.trunc(this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleVersion)
          },

        "DealDetails":
        {
          "DealHeaderId": this.dealOverview.id,
          "OptionId": this.manageDealOverview.MasterData.OptionId


        },
        "ReportAccessBasedOnDeal":
        {
          "ReportId": this.dealReportForm.controls.dealSelectReportlDataVal.value,
        },
        "PeriodType": this.dealReportForm.controls.dealPeriodTypeDataVal.value,
        "Currency": this.dealReportForm.controls.dealCurrencyDataVal.value,
      }
      this.iframeLoader = true;
      this.deals.reportViewReport(input).subscribe(res => {
        if (res.ReturnFlag = 'S') {
          this.iframeLoader = false;
          console.log('Succes response-->', res);
          this.viewreportdata = this.sanitizer.bypassSecurityTrustResourceUrl(res.Output);
          console.log(this.viewreportdata, "this.viewreportdatathis.viewreportdata")
          this.showReport = true;
        }
      })
    } else {
      console.log('>>')
    }
  }
  emailReport() {
    this.submittedDealReportForm = false;
    this.dealReportForm.controls.dealModuleNameDataVal.clearValidators()
    this.dealReportForm.controls.dealModuleNameDataVal.updateValueAndValidity()
    // if (!this.modDet) {
    //   this.dealReportForm.controls.dealModuleNameDataVal.disable();
    // }
    //  else {
    //   this.dealReportForm.controls.dealModuleNameDataVal.enable();
    // }
    if (this.dealReportForm.valid) {

      let input =
      {
        "spParams":
        {
          "Action": "E",
          "ReportLevel": this.dealReportForm.controls.dealReportDataVal.value == 'Deal' ? "D" : "M",
          "DealHeaderNumber": this.manageDealOverview.MasterData.DealHeaderNumber,
          "DealVersion": this.manageDealOverview.MasterData.DealVersionId,
          "OptionNumber": this.manageDealOverview.MasterData.OptionNumber,
          "OptionVersion": this.manageDealOverview.MasterData.OptionVersionId,
          "UserID": this.userInfo.EmployeeId,

        },

        "DealDetails":
        {
          "DealHeaderId": this.dealOverview.id,
          "OptionId": this.manageDealOverview.MasterData.OptionId,
          "DealName": this.dealOverview.dealName,
          "SBU": this.manageDealOverview.ModuleList[0].SBUCode,
          "Vertical": this.dealOverview.vertical,
          "PricingId": this.dealOverview.pricingId,
          "OppId_AmendNo": this.dealOverview.oppID,
          "username": this.userInfo.EmployeeName,
        },
        "MasterData": this.dealReportForm.controls.dealReportDataVal.value == 'Deal' ? {} :
          {
            "ModuleId": this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleID,
            "ModuleNumber": this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleNumber,
            "ModuleVersionId": Math.trunc(this.dealReportForm.controls.dealModuleNameDataVal.value.ModuleVersion)
          },
        "PeriodType": this.dealReportForm.controls.dealPeriodTypeDataVal.value,
        "Currency": this.dealReportForm.controls.dealCurrencyDataVal.value,
        "EmailID": this.userInfo.EmployeeMail

      }
      this.iframeLoader = true;

      this.deals.reportEmailReport(input).subscribe(res => {
        if (res.ReturnFlag = 'S') {
          console.log('Succes response-->', res);
          this.viewreportdata = this.sanitizer.bypassSecurityTrustResourceUrl(res.Output);
          this.iframeLoader = false;
          console.log(this.viewreportdata, "this.viewreportdatathis.viewreportdata")
          this.showReport = true;
        }
      })


    }
  }
  iFrameTempArr = [];
  finishedLoading(event) {
    this.iFrameTempArr.push(event.timeStamp);
    if (this.iFrameTempArr.length >= 2) {
      this.iframeLoader = false;
      //this.iFrameTempArr = [];
    }
    console.log('deal aggregator event iframe', event)
  }
  ngOnDestroy() {
    this.moduleResponse$.unsubscribe()
    this.combinedResponse$.unsubscribe()
  }
}
