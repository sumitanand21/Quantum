import { Component, OnInit, OnDestroy } from '@angular/core';
import { DealDropdownService } from '@app/core/services/deals/deal-dropdown.service';
import { dealService } from '@app/core/services/deals.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { selectAllModules } from '@app/core/state/selectors/deals/deals-module.selector';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
@Component({
  selector: 'app-deal-aggregator',
  templateUrl: './deal-aggregator.component.html',
  styleUrls: ['./deal-aggregator.component.scss']
})
export class DealAggregatorComponent implements OnInit, OnDestroy {
  // names:any = ["madhu","anil"];
  dealAgrrForm: FormGroup;
  submittedDealAggrForm = false;
  iframeLoader: boolean = false;
  isLoading: boolean = false;
  showReport: boolean;
  userInfo: any;
  dealOverview: any;
  manageDealOverview: any;
  aggrModuleResponse$: Subscription = new Subscription();
  constructor(private dropdownservice: DealDropdownService,
    public validateserv: DataCommunicationService,
    private deals: dealService,
    public _error: ErrorMessage,
    public sanitizer: DomSanitizer,
    public encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    private fb: FormBuilder) {

  }

  // dealAgrr:FormGroup

  disableParams:boolean=false;
  dealData: any;
  dealInputData: any;
  Dealaggregatorparams: any;
  DealaggregatorparamsData: [];
  ModulenameData: [];
  CurrencyData: [];
  Parameters: any;
  showAViewReportsBtn:boolean=false;
  ngOnInit() {
    let userInfo = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('userInfo'), 'DecryptionDecrip');
    this.userInfo = JSON.parse(userInfo)
    let dealOverview = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('Dealoverview'), 'DecryptionDecrip');
    this.dealOverview = JSON.parse(dealOverview);
    console.log('deal overview',this.dealOverview)
    // let manageDealOverview = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('LoadManageDealHeaders'), 'DecryptionDecrip');
    // this.manageDealOverview = JSON.parse(manageDealOverview)
    // console.log('manage deal overview--->', this.manageDealOverview);
    // let fillmanageparmsInfo = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('getFillManageParameters'), 'DecryptionDecrip');
    // const paramsinfo = JSON.parse(fillmanageparmsInfo)
    // paramsinfo.Output.ValidationFlag.btnViewReports.Visible == 'true'  ? (this.showAViewReportsBtn = true) : (this.showAViewReportsBtn = false);
    this.aggrModuleResponse$ = this.store.pipe(select(selectAllModules)).subscribe(res => {
      console.log('store res-->', res)
      this.manageDealOverview = res.ModuleList[1].Output
    })

    this.dealAgrrForm = this.fb.group({
      dealPeriodTypeDataVal: ["", [Validators.required]],
      dealModelDataVal: [null, [Validators.required]],
      dealRlsTypeDataVal: ["", [Validators.required]],
      dealCurrencyDataVal: [null, [Validators.required]],
      dealPriceElementDataVal: [null, [Validators.required]],
      parameter1: [''],
      parameter2: [''],
      parameter3: [''],
      parameter4: [''],
      parameter5: [''],
      parameter6: [''],
      parameter7: ['']

      // this.DealaggregatorparamsData = this.dealData.DealAggregatorParams;
    });
    this.getDealAggregatorData();
  }
  //convenience getter for easy access to form fields
  get grrForm() {
    return this.dealAgrrForm.controls;
  }
  // onSubmitForm(){
  //   this.submittedDealAggrForm = true;
  //   if(this.dealAgrrForm.invalid){
  //     return false;
  //   }
  // }

  getDealAggregatorData() {
    console.log(this.manageDealOverview)
    let dealData = this.manageDealOverview;
    let DealId = dealData.MasterData.DealId;
    let OptionId = dealData.MasterData.OptionId;
    let DealHeaderNumber = dealData.MasterData.DealHeaderNumber;
    let DealVersionId = dealData.MasterData.DealVersionId;

    console.log("DealId: ", DealId, " OptionId: ", OptionId, "DealHeaderNumber: ", DealHeaderNumber, "DealVersionId: ", DealVersionId)
    this.dealInputData =
      {
        "User": {
          "EmployeeNumber": this.userInfo.EmployeeId,
          "EmployeeName": this.userInfo.EmployeeName,
          "EmployeeId": this.userInfo.EmployeeId,
          "EmployeeMail": this.userInfo.EmployeeMail
        },
        "MasterData": {
          "DealId": DealId,
          "OptionId": OptionId,
          "DealHeaderNumber": DealHeaderNumber,
          "DealVersionId": DealVersionId,
          "RLSId": null,
          "CurrencyCode": "USD",
          "Groupcode": null
        }
      }

      this.isLoading = true;
    this.deals.getDealAggregatorDropDown(this.dealInputData).subscribe(res => {
      console.log(res);
      this.dealData = res.Output
      this.isLoading = false;
      this.DealaggregatorparamsData = this.dealData.DealAggregatorParams;
      this.ModulenameData = this.dealData.ModuleName;
      this.CurrencyData = this.dealData.Currency;
    }, error => {
      console.log('Error', error);
      return null;
    })
    // this.dealData = this.dropdownservice.getDealAggregatorDropDown(this.dealInputData);


  }
  DisableParameters() {
    console.log(this.dealAgrrForm.controls.dealPriceElementDataVal.value);
    if(this.dealAgrrForm.controls.dealPriceElementDataVal.value=="PASSTHRU"){
    this.disableParams=true;
    this.dealAgrrForm.get('parameter1').reset('');
    this.dealAgrrForm.get('parameter2').reset('');
    this.dealAgrrForm.get('parameter3').reset('');
    this.dealAgrrForm.get('parameter4').reset('');
    this.dealAgrrForm.get('parameter5').reset('');
    this.dealAgrrForm.get('parameter6').reset('');
    this.dealAgrrForm.get('parameter7').reset('');
    
    }
    else
    {
      this.disableParams=false;    
    }     
  }
  validateParamsArr = []
  validateParams(){
    this.validateParamsArr = []
    this.validateParamsArr.push(
     this.dealAgrrForm.controls.parameter1.value !="" ? this.dealAgrrForm.controls.parameter1.value : 'param1',
     this.dealAgrrForm.controls.parameter2.value  ? this.dealAgrrForm.controls.parameter2.value : 'param2',
     this.dealAgrrForm.controls.parameter3.value ? this.dealAgrrForm.controls.parameter3.value : 'param3',
     this.dealAgrrForm.controls.parameter4.value ? this.dealAgrrForm.controls.parameter4.value : 'param4',
     this.dealAgrrForm.controls.parameter5.value ? this.dealAgrrForm.controls.parameter5.value : 'param5',
     this.dealAgrrForm.controls.parameter6.value ? this.dealAgrrForm.controls.parameter6.value : 'param6',
     this.dealAgrrForm.controls.parameter7.value ? this.dealAgrrForm.controls.parameter7.value : 'param7'
   )
   console.log(this.validateParamsArr,"validateParamsArrvalidateParamsArr")
   console.log(this.hasDuplicates(this.validateParamsArr))
  }
  hasDuplicates(array) {
    var counts = [];
    for(var i = 0; i <= array.length; i++) {
        if(counts[array[i]] === undefined) {
            counts[array[i]] = 1;
        } else {
            return true;
        }
    }
    return false;
}
  viewreportdata: SafeUrl;
  viewReport() {
    // this.isLoading = true;
    this.submittedDealAggrForm = true;
    if (this.dealAgrrForm.valid) {
        let validateDealParams:boolean = this.hasDuplicates(this.validateParamsArr)
         if(!validateDealParams){
          if ((this.dealAgrrForm.controls.parameter1.value != '' && this.dealAgrrForm.controls.parameter1.value != null ||
          this.dealAgrrForm.controls.parameter2.value != '' && this.dealAgrrForm.controls.parameter2.value != null ||
          this.dealAgrrForm.controls.parameter3.value != '' && this.dealAgrrForm.controls.parameter3.value != null ||
          this.dealAgrrForm.controls.parameter4.value != '' && this.dealAgrrForm.controls.parameter4.value != null ||
          this.dealAgrrForm.controls.parameter5.value != '' && this.dealAgrrForm.controls.parameter5.value != null ||
          this.dealAgrrForm.controls.parameter6.value != '' && this.dealAgrrForm.controls.parameter6.value != null ||
          this.dealAgrrForm.controls.parameter7.value != '' && this.dealAgrrForm.controls.parameter7.value != null && this.dealAgrrForm.controls.dealPriceElementDataVal.value=="RLS")||this.dealAgrrForm.controls.dealPriceElementDataVal.value=="PASSTHRU") {
          let dealData = this.manageDealOverview;
          let ModuleID = dealData.MasterData.ModuleID;
          let OptionId = dealData.MasterData.OptionId;
          let DealHeaderId;
          if(this.dealAgrrForm.controls.dealModelDataVal.value=="ALL")
            DealHeaderId = dealData.ModuleList[0].DealHeaderID
            else
            {
          dealData.ModuleList.map(x => {
            if (x.ModuleID == this.dealAgrrForm.controls.dealModelDataVal.value) {
              DealHeaderId = x.DealHeaderID
            }
          })
            }
  
          console.log(dealData.ModuleList);
          let passinput = {
            "spParams":
            {
              "Action": "DA"
  
            },
            "DealDetails":
            {
              "DealHeaderID": DealHeaderId,
              "OptionId": dealData.MasterData.OptionId,
              "ModuleID": this.dealAgrrForm.controls.dealModelDataVal.value
            },
            "RLSOtherPassThru":
            {
              "PricingElementType": this.dealAgrrForm.controls.dealPriceElementDataVal.value,
            },
  
            "ReportParams":
            {
              "RPTParamValue1": this.dealAgrrForm.controls.parameter1.value,
              "RPTParamValue2": this.dealAgrrForm.controls.parameter2.value,
              "RPTParamValue3": this.dealAgrrForm.controls.parameter3.value,
              "RPTParamValue4": this.dealAgrrForm.controls.parameter4.value,
              "RPTParamValue5": this.dealAgrrForm.controls.parameter5.value,
              "RPTParamValue6": this.dealAgrrForm.controls.parameter6.value,
              "RPTParamValue7": this.dealAgrrForm.controls.parameter7.value
            },
            "RLSType": this.dealAgrrForm.controls.dealRlsTypeDataVal.value,
            "PeriodType": this.dealAgrrForm.controls.dealPeriodTypeDataVal.value,
            "Currency": this.dealAgrrForm.controls.dealCurrencyDataVal.value
          }
          this.iframeLoader = true;
          console.log("clciked view report");
          console.log(JSON.stringify(passinput));
          this.deals.viewAggregateReport(passinput).subscribe((res) => {
            if (res.ReturnFlag = 'S') {
  
              this.viewreportdata = this.sanitizer.bypassSecurityTrustResourceUrl(res.Output);
              //this.viewreportdata = res.Output
              //this.iframeLoader = true;
              this.showReport = true
            }
            console.log(res, "deal aggr res")
          });
  
        } else {
          this._error.throwError('please select atleast one parameter');
          this.iframeLoader = false;
        }
         }else{
          this._error.throwError('Parameters cannot be same.Please select unique values to view the report.');
          this.iframeLoader = false;
         }
    } else {
      this.validateserv.validateAllFormFields(this.dealAgrrForm)
      this.iframeLoader = false;
    }
  }
  
  iFrameTempArr = [];
  finishedLoading(event) {    
    this.iFrameTempArr.push(event.timeStamp);
    if(this.iFrameTempArr.length >= 2) {
      this.iframeLoader = false;
      //this.iFrameTempArr = [];
    }
    console.log('deal aggregator event iframe', event)
  }

  ngOnDestroy() {
    this.aggrModuleResponse$.unsubscribe()
  }

}

