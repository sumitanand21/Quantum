import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { OrderService } from '@app/core/services/order.service';
import { opportunityTypeId } from '../../tabs/order/orderenum';

@Component({
  selector: 'app-newresidual',
  templateUrl: './newresidual.component.html',
  styleUrls: ['./newresidual.component.scss']
})
export class NewresidualComponent implements OnInit {
  currencySymbol: any;
  oppDetails: any;
  residualOppName = '';
  residualOppTCV = '';

  constructor(public dialog: MatDialog, public orderService: OrderService, public dialogRef: MatDialogRef<NewresidualComponent>,
    public opportunityService: OpportunitiesService, public service: DataCommunicationService) { }

  ngOnInit() {
    this.getOppViewDetails();
    this.currencySymbol = this.opportunityService.getSession('currencySymbol');
    let oppOrdTcvDiff = this.opportunityService.getSession('orderTcvDiff');
    if (oppOrdTcvDiff) {
      if (oppOrdTcvDiff != '0.00') {
        if (!isNaN(oppOrdTcvDiff) && (+oppOrdTcvDiff) > 0) {
          this.residualOppTCV = oppOrdTcvDiff;
        }
      }
    }
  }



  onSave(flag) {
    let returnObj = {
      flag: flag
    }

    if (returnObj.flag == 'Yes') {
      if (this.residualOppName != '' && this.residualOppTCV != '') {
        if (!this.opportunityService.getSession('orderId')) {
          this.opportunityService.displayMessageerror("Didnt find any order for this opportunity. Please create an order before creating a residual opportunity");
          return;
        }
        this.dialogRef.close(returnObj);
        this.service.loaderhome = true;
        let payload = {
          PrimaryOppId: this.opportunityService.getSession('opportunityId'),
          IsResidual: true,
          ResidualTCV: this.residualOppTCV,
          ResidualOpportunityName: this.residualOppName,
          OppType: this.oppDetails.OpportunityTypeId,
          PrimaryOrderGuid: this.opportunityService.getSession('orderId')
        }
        this.orderService.createResidualOpportunity(payload).subscribe((res: any) => {
          let residual_data = res.ResponseObject
          if (res.IsError == false) {
            this.service.loaderhome = false;
            // this.dialogRef.close(returnObj);
            const dialogRef = this.dialog.open(residualcreatedpopup, {
              width: '480px',
              data: {
                residualOppNumber: residual_data.OpportunityNumber,
                // oppTCV: this.oppDetails.OpportunityTCVDisplay,
                // oppTCV: residual_data.OpportunityTCVDisplay,
                oppTCV: this.currencySymbol + ' ' + this.numberWithCommas(this.residualOppTCV),
                parentOpp: this.oppDetails.OpportunityNumber + ' - ' + this.oppDetails.name,
              }
            });
          }
          else {
            this.service.loaderhome = false;
            //  this.dialogRef.close(returnObj);
            this.opportunityService.displayMessageerror(res.Message);
          }
        },
          err => {
            this.service.loaderhome = false;
            //  this.dialogRef.close(returnObj);
            this.opportunityService.displayerror(err.status);
          })
      }
      else {
        this.opportunityService.displayMessageerror("Please enter the mandatory fields");
      }
    }

  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getOppViewDetails() {
    this.service.loaderhome = true;
    let payload = {
      OppId: this.opportunityService.getSession('opportunityId')
    }
    this.orderService.getoppOverviewdetails(payload).subscribe((res: any) => {
      if (res.IsError == false) {
        this.service.loaderhome = false;
        this.oppDetails = res.ResponseObject;
        console.log("...", this.getSymbol(this.oppDetails.OpportunityTCVDisplay))
      }
      else {
        this.service.loaderhome = false;
        this.opportunityService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      })
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  // residualcreated() {
  //   if(this.residualOppName != '' && this.residualOppTCV != ''){
  //   this.service.loaderhome = true;
  //   let payload = {
  //     PrimaryOppId: this.opportunityService.getSession('opportunityId'),
  //     IsResidual: true,
  //     ResidualTCV: this.residualOppTCV,
  //     ResidualOpportunityName: this.residualOppName,
  //     OppType: this.oppDetails.OpportunityTypeId
  //   }
  //   this.orderService.createResidualOpportunity(payload).subscribe((res: any) => {
  //     let residual_data = res.ResponseObject
  //     if (res.IsError == false) {
  //       this.service.loaderhome = false;
  //       const dialogRef = this.dialog.open(residualcreatedpopup, {
  //         width: '480px',
  //         data: {
  //           residualOppNumber: residual_data.OpportunityNumber,
  //           // oppTCV: this.oppDetails.OpportunityTCVDisplay,
  //           oppTCV: residual_data.OpportunityTCVDisplay,
  //           parentOpp: this.oppDetails.OpportunityNumber + ' - ' + this.oppDetails.name,
  //         }
  //       });
  //     }
  //     else {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror(res.Message);
  //     }
  //   },
  //     err => {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayerror(err.status);
  //     })
  // }
  // else {
  //   this.opportunityService.displayMessageerror("Please enter the mandatory fields")
  // }
  // }

}


@Component({
  selector: 'app-residual',
  templateUrl: './residualcreatedpopup.html',
  styleUrls: ['./newresidual.component.scss']
})
export class residualcreatedpopup {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
