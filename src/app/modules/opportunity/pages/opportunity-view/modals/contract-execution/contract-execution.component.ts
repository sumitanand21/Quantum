import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '@app/core/services/order.service';
import { OpportunitiesService } from '@app/core';

@Component({
  selector: 'app-contract-execution',
  templateUrl: './contract-execution.component.html',
  styleUrls: ['./contract-execution.component.scss']
})
export class ContractExecutionComponent implements OnInit {
  createdContract: boolean;
  opportunityTCV: any;
  pricingTCV: any;
  differenceTCV: any;
  contractExecuted: any;
  contractExcMsg : boolean = false;
  wtcheck : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContractExecutionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public orderService: OrderService, public opportunityService: OpportunitiesService
  ) { 
    console.log("data1", data)
  }

  ngOnInit(): void {

    if (this.opportunityService.getSession('wtcheckdeal')) {
      this.wtcheck = true;
    }

    this.createdContract = this.data ? this.data.createdContract : true;

    let payload = {
      Guid: this.opportunityService.getSession('opportunityId')
    }
    console.log("hello tcv", payload);
    this.orderService.getOpportunityContractDetails(payload).subscribe((data: any) => {
      console.log("contracting details", data.ResponseObject);
      if (data && data.ResponseObject && data.ResponseObject.CanProceedToClose == false) {
        this.opportunityService.displayMessageerror("Please ensure that the base order of this residual opportunity is Approved by BFM before creating an order here.");
        this.dialogRef.close();
        return;
      }
      let tcvData = data.ResponseObject
      this.opportunityTCV = tcvData.wipro_OverallTCVDisplay ? this.getSymbol(tcvData.wipro_OverallTCVDisplay) : 'NA';
      this.pricingTCV = tcvData.PricingTcvDisplay ? this.getSymbol(tcvData.PricingTcvDisplay) : 'NA';
    this.differenceTCV = tcvData.TCVDifference ? this.getSymbol(tcvData.TCVDifference) : '';
      this.contractExecuted = tcvData.Wipro_ContractExecuted;
      // if(!tcvData.Wipro_ContractExecuted){
      //   this.createdContract = true;
      // }
      // else{
      //   this.createdContract = false;
      // }
    })
    let data =
      {
	Guid: this.opportunityService.getSession('opportunityId')
}
 this.orderService.getoppOverviewdetails(data).subscribe((oppData: any) => {
      if (!oppData.IsError) {
        if(oppData.IsICMAccount == false){
          this.contractExcMsg = true;
        }
       
      }
 });
  }

  navigateToBSP(){
    this.dialogRef.close('navigateToBSP');
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  showcancel(isProceed) {
    this.dialogRef.close(isProceed);
  }

  // onNoClick(btn): void {
  //   if (btn === 'No') {
  //    this.dialogRef.close({btn: false});
  //   } else {
  //     this.dialogRef.close({btn: true});
  //   }
  // }

}
