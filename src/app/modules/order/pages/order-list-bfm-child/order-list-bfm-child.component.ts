import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AssignpopupComponent } from '../../modal/assignpopup/assignpopup.component';
import { OnholdpopupComponent } from '../../modal/onholdpopup/onholdpopup.component';
import { ApprovepopupComponent } from '../../modal/approvepopup/approvepopup.component';
import { RejectpopupComponent } from '../../modal/rejectpopup/rejectpopup.component';
import { OpportunitiesService, OrderService } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OrderApprovalStage, orderApprovalType } from '../../../opportunity/pages/opportunity-view/tabs/order/orderenum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-list-bfm-child',
  templateUrl: './order-list-bfm-child.component.html',
  styleUrls: ['./order-list-bfm-child.component.scss']
})
export class OrderListBfmChildComponent implements OnInit {
  systemchecks: boolean;
  userdeclarations: boolean;
  manualchecks: boolean;
  bfm_subscription: any;
  currentDate = new Date().toISOString();

  orderId;
  isNonWT;
  processInstanceId;
  contractSigned;
  approvalType;
  approvalTypeId;
  approvalStage;
  approvalStageId;
  oppertunityName;
  lookup_orderId;
  BFM_onHold_count;

  BFM_ApproveBtn: boolean;
  BFM_RejectBtn: boolean;
  BFM_OnholdBtn: boolean;
  BFM_Onhold_Disable: boolean;
  BFM_reject_Disable: boolean;
  BFM_approve_Disable: boolean = true;


  rowData: any;
  constructor(public router: Router, public service: DataCommunicationService, public dialog: MatDialog, private opportunityService: OpportunitiesService,
    private orderService: OrderService, private EncrDecr: EncrDecrService, public location:Location) {
    this.rowData = this.opportunityService.getSession('rowData');
  }

  ngOnInit() {
    console.log("session..........", this.opportunityService.getSession('orderData'))
    // this.bfm_subscription = this.orderService.getBFMStatus().subscribe(data => {
    //   console.log("bfm btn status is", data);
    //   this.BFM_approve_Disable = data;
    // });
    this.getBFMData();
  }


  getBFMData() {
    let data = this.opportunityService.getSession('bfm_order_data')
    // this.orderService.bfm_data.subscribe(data => {
    console.log("child data is", data);
    this.orderId = data.orderBookingId;
    this.isNonWT = data.nonWTFlag,
      this.processInstanceId = data.CommundaProcessId,
      this.contractSigned = data.isSigned,
      this.approvalType = data.ApprovalType,
      this.approvalTypeId = data.ApprovalTpyeId,
      this.approvalStage = data.approvalStage,
      this.approvalStageId = data.approvalStageId,
      this.oppertunityName = data.OpportunityName,
      this.lookup_orderId = data.OrderId,
      this.BFM_onHold_count = data.BFMOnholdCount
    console.log("child data is..............", this.orderId, this.isNonWT, this.processInstanceId, this.approvalTypeId);
    console.log("onhold count is", this.BFM_onHold_count);
    //  BFM on-hold count disable button validation start here
    // if (this.BFM_onHold_count > 1) {
    //   this.BFM_Onhold_Disable = true;
    // }
    // else {
    //   this.BFM_Onhold_Disable = false;
    // }
    //  BFM on-hold count disable button validation end here

    //  BFM approve, reject and on-hold btns disabled when bfm rejected the order validation start here
    if (this.approvalStageId == OrderApprovalStage.PendingWithBFM && this.isNonWT == false) {
      this.BFM_Onhold_Disable = false;
      this.BFM_reject_Disable = false;
      this.BFM_approve_Disable = true;
      this.bfm_subscription = this.orderService.getBFMStatus().subscribe(data => {
        console.log("bfm btn status is", data);
        this.BFM_approve_Disable = data;
      });
      if (this.BFM_onHold_count > 1) {
        this.BFM_Onhold_Disable = true;
      }
      else {
        this.BFM_Onhold_Disable = false;
      }
    }

    else if (this.approvalStageId == OrderApprovalStage.PendingWithBFM && this.isNonWT == true) {
      this.BFM_Onhold_Disable = false;
      this.BFM_reject_Disable = false;
      this.BFM_approve_Disable = false;
      if (this.BFM_onHold_count > 1) {
        this.BFM_Onhold_Disable = true;
      }
      else {
        this.BFM_Onhold_Disable = false;
      }
    }
    
    else if (this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM){
      this.BFM_reject_Disable = false
      this.BFM_approve_Disable = false;
    }
    else {
      this.BFM_Onhold_Disable = true;
      this.BFM_reject_Disable = true;
      this.BFM_approve_Disable = true;
    }
    //  BFM approve, reject and on-hold btns disabled when bfm rejected the order validation end here

    // BFM approve, reject and on-hold button enable and disable based on ordertype validation starts here
    if (this.approvalTypeId == orderApprovalType.Order) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = true;
    }
    else if (this.approvalTypeId == orderApprovalType.Invoicing) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = false;
    }
    else if (this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = true;
    }
    // BFM approve, reject and on-hold button enable and disable based on ordertype validation end here
    // })
  }

  openassign(): void {
    const dialogRef = this.dialog.open(AssignpopupComponent, {
      width: '450px',
    });
  }

  openonhold(): void {
    const dialogRef = this.dialog.open(OnholdpopupComponent, {
      width: '350px',
      data: {
        data_condition: "Bfm Aprroval",
        OrderId: this.lookup_orderId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // On-hold Order
        if (result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Order && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let onHoldOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: result.reason,
              onholdreasonoptions : result.reasonId,
              rejectionreason: "",
              resubmissionreason: "",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "On-hold",
              processinstanceid: this.processInstanceId,
            }
          console.log("bfm on-hold payload", onHoldOrderPayload)
          // this.orderApproveBFM(onHoldOrderPayload);
          this.service.loaderhome = true;
          this.orderService.reject_onhold_approval_BFMOrder(onHoldOrderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM response is", res);
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror("Order put on on-hold successfully");
              this.router.navigate(['/order'])
              // this.location.back();
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }

        //  On-hold confirm order
        else if (result.flag == 'YES' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let onholdConfirmOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: result.reason,
              onholdreasonoptions : result.reasonId,
              rejectionreason: "",
              resubmissionreason: "",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "On-hold",
              processinstanceid: this.processInstanceId,
            }
          // this.confirmOrderBFM(onholdConfirmOrderPayload);
          this.service.loaderhome = true;
          this.orderService.confirmOrderByBFM(onholdConfirmOrderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM confirm order res is", res);
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror("Confirmed order put on on-hold successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }
      }
    });
  }

  openapprove(): void {
    const dialogRef = this.dialog.open(ApprovepopupComponent, {
      width: '350px',
      data: {
        rowData: this.rowData,
        data_condition: 'BFM_Approval',
        data: {
          OrderId: this.lookup_orderId
        }
      },

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("popup result is", result)
      if (result) {

        // order approval
        if (result.data == 'BFM_Approval' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Order && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let approveOderPayload =
            {
              orderID: this.orderId,
              approvalreason: result.reason,
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: "",
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Approve",
              processinstanceid: this.processInstanceId
            }
          console.log("payload is......", approveOderPayload)
          // this.orderApproveBFM(approveOderPayload);
          this.service.loaderhome = true;
          this.orderService.reject_onhold_approval_BFMOrder(approveOderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM response is", res);
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror("Order approved successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }

        // Invoicing approval
        else if (result.data == 'BFM_Approval' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Invoicing && this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM) {
          let approveInvoicingPayload =
            {
              orderID: this.orderId,
              approvalreason: result.reason,
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "OAR",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: "",
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Approve",
              processinstanceid: this.processInstanceId
            }
          console.log("invoicing payload is", approveInvoicingPayload);
          // this.invoicingBFMApproval(approveInvoicingPayload);
          this.service.loaderhome = true;
          this.orderService.invoicingOrderByBFM(approveInvoicingPayload).subscribe(res => {
            if (!res.IsError) {
              this.service.loaderhome = false;
              console.log("BFM invoicing is", res);
              this.opportunityService.displayMessageerror("Invocing approved successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }

        // Confirm order approval
        else if (result.data == 'BFM_Approval' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let confirmOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: result.reason,
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: "",
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Approve",
              processinstanceid: this.processInstanceId
            }
          console.log("confirm order approval payload", confirmOrderPayload)
          // this.confirmOrderBFM(confirmOrderPayload);
          this.service.loaderhome = true;
          this.orderService.confirmOrderByBFM(confirmOrderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM confirm order res is", res);
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror("Confirm order approved successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }
      }
    });
  }

  openreject(): void {
    debugger;
    const dialogRef = this.dialog.open(RejectpopupComponent, {
      width: '350px',
      data: {
        rowData: this.rowData,
        data_condition: 'BFM_Reject',
        data: {
          OrderId: this.lookup_orderId
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // Reject Order
        if (result.data == 'BFM_Reject' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Order && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let rejectOderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: result.reason,
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Reject",
              processinstanceid: this.processInstanceId
            }
          console.log("rejected payload is", rejectOderPayload)
          // this.orderApproveBFM(rejectOderPayload);
          this.service.loaderhome = true;
          this.orderService.reject_onhold_approval_BFMOrder(rejectOderPayload).subscribe(res => {
            var resetChecksPayload = {
              SalesOrderId: this.orderId
            }
            if (!res.IsError) {
              console.log("BFM response is", res);
              this.service.loaderhome = false;
              this.orderService.resettingBFMVerificationCkecks(resetChecksPayload).subscribe((data: any) => {
                console.log("resetting bfm checks", data)
              });
              this.opportunityService.displayMessageerror("Rejected the order successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }

        // Reject Invoicing
        else if (result.data == 'BFM_Reject' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Invoicing && this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM) {
          let rejectInvoicingPayload = {
            orderID: this.orderId,
            approvalreason: "",
            approvaltype: this.approvalType,
            orderType: this.contractSigned ? "Clean Order" : "OAR",
            isWT: this.isNonWT ? "No" : "Yes",
            decisiondate: this.currentDate,
            onholdreason: "",
            rejectionreason: result.reason,
            resubmissionreason: "",
            ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
            entity: this.isNonWT ? "systemusers" : "systemusers",
            statuscode: "Reject",
            processinstanceid: this.processInstanceId
          }
          console.log("reject invoicing payload is", rejectInvoicingPayload);
          // this.invoicingBFMApproval(rejectInvoicingPayload);
          this.service.loaderhome = true;
          this.orderService.invoicingOrderByBFM(rejectInvoicingPayload).subscribe(res => {
            if (!res.IsError) {
              this.service.loaderhome = false;
              console.log("BFM invoicing is", res);
              this.opportunityService.displayMessageerror("Invoicing rejected successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }

        // Reject Confirm Order
        else if (result.data == 'BFM_Reject' && result.flag == 'YES' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let rejectConformOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: result.reason,
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Reject",
              processinstanceid: this.processInstanceId
            }
          this.service.loaderhome = true;
          // this.confirmOrderBFM(rejectConformOrderPayload);
          this.orderService.confirmOrderByBFM(rejectConformOrderPayload).subscribe(res => {
            var resetChecksPayload = {
              SalesOrderId: this.orderId
            }
            if (!res.IsError) {
              console.log("BFM confirm order res is", res);
              this.service.loaderhome = false;
              this.orderService.resettingBFMVerificationCkecks(resetChecksPayload).subscribe((data: any) => {
                console.log("resetting bfm checks", data)
              });
              this.opportunityService.displayMessageerror("Rejected the confirm order successfully");
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.opportunityService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.opportunityService.displayerror(err.status);
            });
        }
      }
    });
  }



  systemchecks1() {
    this.systemchecks = true;
    this.userdeclarations = false;
    this.manualchecks = false;
  }
  userdeclarations1() {
    this.systemchecks = false;
    this.userdeclarations = true;
    this.manualchecks = false;
  }
  manualchecks1() {
    this.systemchecks = false;
    this.userdeclarations = false;
    this.manualchecks = true;
  }
  goBack() {
    window.history.back();
  }

  updateApprovalComment(obj) {
    this.service.loaderhome = true;
    this.orderService.updateApprovalComment(obj).subscribe(res => {
      this.service.loaderhome = false;
      if (!res.IsError) {

      }
      else {
        this.opportunityService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      });
  }


  // Reject onhold approve by BFM Camunda api call

  // orderApproveBFM(obj) {
  //   this.service.loaderhome = true;
  //   this.orderService.reject_onhold_approval_BFMOrder(obj).subscribe(res => {
  //     if (!res.IsError) {
  //       console.log("BFM response is", res);
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror("Success");
  //       this.router.navigate(['/order'])
  //     }
  //     else {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror(res.Message);
  //     }
  //   },
  //     err => {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayerror(err.status);
  //     });
  // }

  // invoicingBFMApproval(obj) {
  //   this.service.loaderhome = true;
  //   this.orderService.invoicingOrderByBFM(obj).subscribe(res => {
  //     if (!res.IsError) {
  //       this.service.loaderhome = false;
  //       console.log("BFM invoicing is", res);
  //       this.opportunityService.displayMessageerror("Success");
  //       this.router.navigate(['/order'])
  //     }
  //     else {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror(res.Message);
  //     }
  //   },
  //     err => {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayerror(err.status);
  //     });
  // }

  // confirmOrderBFM(obj) {
  //   this.service.loaderhome = true;
  //   this.orderService.confirmOrderByBFM(obj).subscribe(res => {
  //     if (!res.IsError) {
  //       console.log("BFM confirm order res is", res);
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror("Success");
  //       this.router.navigate(['/order'])
  //     }
  //     else {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayMessageerror(res.Message);
  //     }
  //   },
  //     err => {
  //       this.service.loaderhome = false;
  //       this.opportunityService.displayerror(err.status);
  //     });
  // }


}
