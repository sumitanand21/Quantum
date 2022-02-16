import { Component, OnInit, Inject } from '@angular/core';
import { OpportunitiesService, OrderService, DataCommunicationService } from '@app/core';
import { OrderApprovalStage, orderApprovalType } from '../../../../../opportunity/pages/opportunity-view/tabs/order/orderenum';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// OPP000001385
@Component({
  selector: 'app-user-declarations',
  templateUrl: './user-declarations.component.html',
  styleUrls: ['./user-declarations.component.scss']
})
export class UserDeclarationsComponent implements OnInit {
  textshown: boolean = false;
  panelOpenState2: boolean = false;

  rowData: any;
  approvalLog = [];
  public propertyName = "ksfdsfjksfsf";

  bfmApprStatus: boolean;
  userdec = [];
  commentme = false;
  Pendingwithdealowner: OrderApprovalStage;
  commentbox() {
    this.commentme = !this.commentme;
  }

  approval_data = [];
  agingData: any;
  approvalStageId;
  approve_BtnDisable: boolean;
  reject_BtnDisable: boolean;

  constructor(public service: DataCommunicationService, public dialog: MatDialog, private opportunityService: OpportunitiesService, private orderService: OrderService) {
    this.rowData = this.opportunityService.getSession('rowData');
    // this.rowData.OrderId = "c67a4f51-f876-e911-a830-000d3aa058cb";
  }
  orderId;
  NonWTFlag;
  approvedByDM;
  pendingWithDM;
  rejectedByDM;
  approvedByBFM;
  pendingWithBFM;
  onHoldByBFM;
  rejectedByBFM;
  approvedByADH_VDH;
  rejectedByADH_VDH;
  pendingWithADH_VDH;
  onHoldWithADH_VDH;
  InvoicingPendingWithBFM;
  InvoicingApprovedByBFM;
  InvoicingRejectedByBFM;
  pendingWithICTeam;
  approvedByICTeam;
  rejectedByICTeam;

  ModifyOrderApproval;
  InvoicingOrder;


  ngOnInit() {
    // this.getOrderApprovalLog();
    // this.getOrderReviewData();
    // this.getBFMVerChecks();
    this.opportunityService.clearSession('dealID');
    this.getBFMApprovalData();
    this.approvalStatusEnum();
  }

  approvalStatusEnum() {
    this.approvedByDM = OrderApprovalStage.ApprovedbyDM;
    this.pendingWithDM = OrderApprovalStage.PendingWithDM;
    this.rejectedByDM = OrderApprovalStage.RejectedByDM;
    this.approvedByBFM = OrderApprovalStage.ApprovedbyBFM;
    this.pendingWithBFM = OrderApprovalStage.PendingWithBFM;
    this.onHoldByBFM = OrderApprovalStage.OnHoldByBFM;
    this.rejectedByBFM = OrderApprovalStage.RejectedbyBFM;
    this.approvedByADH_VDH = OrderApprovalStage.ApprovedbyADH_VDH_SDH;
    this.rejectedByADH_VDH = OrderApprovalStage.RejectedByADH_VDH_SDH;
    this.pendingWithADH_VDH = OrderApprovalStage.PendingWithADH_VDH_SDH;
    this.onHoldWithADH_VDH = OrderApprovalStage.OnHoldByADH_VDH_SDH;
    this.InvoicingPendingWithBFM = OrderApprovalStage.InvoicingRequestPendingwithBFM;
    this.InvoicingApprovedByBFM = OrderApprovalStage.InvoicingRequestApprovedbyBFM;
    this.InvoicingRejectedByBFM = OrderApprovalStage.InvoicingRequestRejectedbyBFM;
    this.pendingWithICTeam = OrderApprovalStage.PendingwithICTeam;
    this.approvedByICTeam = OrderApprovalStage.ApprovedbyICTeam;
    this.rejectedByICTeam = OrderApprovalStage.RejectedbyICTeam;
    this.Pendingwithdealowner = OrderApprovalStage.Pendingwithdealowner;
    this.ModifyOrderApproval = orderApprovalType.Modified_Order;
  }

  getBFMApprovalData() {
    let data = this.opportunityService.getSession('bfm_order_data')
    // this.orderService.bfm_data.subscribe((data:any) =>{
    this.orderId = data.orderBookingId;
    this.approvalStageId = data.approvalStageId;
    this.NonWTFlag = data.nonWTFlag;
    if (this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
      this.approve_BtnDisable = false;
      this.reject_BtnDisable = false
    }
    else {
      this.approve_BtnDisable = true;
      this.reject_BtnDisable = true;
    }

    console.log("order id is", this.orderId);
    this.getOrderReviewData();
    this.getOrderApprovalLog();
    // });
  }
  // <!-- message popover satrts here -->
  clickmes = false;
  toggleComment() {
    // this.index++;
    // console.log(this.index);
    this.clickmes = !this.clickmes;
    // document.getElementsByClassName('popover')[index].classList.toggle('active');
    // document.getElementsByClassName('button-plus')[index].classList.toggle('active');
  }

  // <!-- message popover ends here -->
  getOrderReviewData() {
    this.service.loaderhome = true;
    let requestBody = {
      // Id: "4b9e6c25-e985-e911-a831-000d3aa058cb"
      Id: this.orderId
    }
    this.orderService.getOrderReview(requestBody).subscribe(res => {
      if (!res.IsError) {
        // let checksData = res.ResponseObject.map((data:any) => {
        //   let Obj ={
        //     VerificationCheckId: data.VerificationCheckId,
        //     VerificationCheckName: data.VerificationCheckName,
        //     SalesOrderId: data.SalesOrderId,
        //     Status: data.Status,
        //     StatusId: data.StatusId,
        //     AttributeCommentsId: data.AttributeCommentsId,
        //     CRMOrderValue: data.CRMOrderValue ? this.getSymbol(data.CRMOrderValue) : '-'
        //   }
        //   this.userdec.push(Obj);
        // })
        this.userdec = res.ResponseObject;
        console.log("approvalLog1", this.userdec);
        this.getBFMVerChecks();
      }
      else {
        this.opportunityService.displayMessageerror(res.Message);
      }
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      });
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }


  approveStatus(i) {
    this.service.loaderhome = true;
    let updateCommentObj = {
      WiproEntity: 5,
      SalesOrderId: this.orderId,
      WiproAttributeConfigurationId: this.userdec[i].VerificationCheckId,
      ApprovalComment: this.userdec[i].Comments ? this.userdec[i].Comments : null,
      WiproStatus: 1,
    }
    console.log("payload is", updateCommentObj)
    this.orderService.createCommentApproval(updateCommentObj).subscribe(res => {
      if (!res.IsError) {
        this.service.loaderhome = false;
        this.getOrderReviewData();
        // this.getBFMVerChecks();
      }
      else {
        this.opportunityService.displayMessageerror(res.Message);
      }
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      });
  }

  getBFMVerChecks() {
    this.bfmApprStatus = false;
    for (let i = 0; i < this.userdec.length; i++) {
      if (this.userdec[i].StatusId != 1) {
        this.bfmApprStatus = true;
        break;
      }
    }
    this.orderService.updateBFMStatus(this.bfmApprStatus);
    console.log("bfm approval status is", this.bfmApprStatus)
  }

  rejectStatus(i) {
    this.service.loaderhome = true;
    let updateCommentObj = {
      WiproEntity: 5,
      SalesOrderId: this.orderId,
      WiproAttributeConfigurationId: this.userdec[i].VerificationCheckId,
      ApprovalComment: this.userdec[i].Comments,
      WiproStatus: 2,
      WiproAttributeCommentsId: this.userdec[i].AttributeCommentsId ? this.userdec[i].AttributeCommentsId : null
    }
    this.orderService.createCommentApproval(updateCommentObj).subscribe(res => {
      if (!res.IsError) {
        this.service.loaderhome = false;
        this.getOrderReviewData();
      }
      else {
        this.opportunityService.displayMessageerror(res.Message);
      }
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      });
  }

  cancelComment(i) {
    let removeData = this.userdec;
    removeData.map((data, i) => {
      data.Comments = '';
    });
    this.getData();
  }

  getData() {
    let requestBody = {
      Id: this.orderId
    }
    this.orderService.getOrderReview(requestBody).subscribe(res => {
      if (!res.IsError) {
        this.userdec = res.ResponseObject;
      }
    },
      err => {
        this.opportunityService.displayerror(err.status);
      });
  }





  getOrderApprovalLog() {
    this.service.loaderhome = true;
    let requestBody = {
      SalesOrderId: this.orderId
      // SalesOrderId: "2643445e-bfcc-e911-a836-000d3aa058cb"
    }
    this.orderService.getOrderApprovalLog(requestBody).subscribe(res => {
      this.service.loaderhome = false;
      if (!res.IsError) {
        this.approvalLog = res.ResponseObject;
        console.log("approvalLog", this.approvalLog);
        this.opportunityService.setSession('dealID', res.ResponseObject[0].DealId ? res.ResponseObject[0].DealId.toString() : '');
        this.approvalLog.map(data => {
          const date1: any = new Date(data.WiproDecisionDate);
          const date2: any = new Date(data.CreatedOn);
          const currentDate = new Date();
          const date3: any = new Date(currentDate);
          // var timeDiff: any = date1 - date2;
          var DaysDiff: any = this.dateDiffInDays(date1, date2);
          if (data.WiproOrderApprovalStage == OrderApprovalStage.ApprovedbyDM || data.WiproOrderApprovalStage == OrderApprovalStage.ApprovedbyBFM || data.WiproOrderApprovalStage == OrderApprovalStage.ApprovedbyADH_VDH_SDH
            || data.WiproOrderApprovalStage == OrderApprovalStage.InvoicingRequestApprovedbyBFM || data.WiproOrderApprovalStage == OrderApprovalStage.ApprovedbyICTeam) {
            data.WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          }
          else if (data.WiproOrderApprovalStage == OrderApprovalStage.RejectedByDM || data.WiproOrderApprovalStage == OrderApprovalStage.RejectedbyBFM || data.WiproOrderApprovalStage == OrderApprovalStage.RejectedByADH_VDH_SDH
            || data.WiproOrderApprovalStage == OrderApprovalStage.InvoicingRequestRejectedbyBFM || data.WiproOrderApprovalStage == OrderApprovalStage.RejectedbyICTeam) {
            data.WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          }
          else if (data.WiproOrderApprovalStage == OrderApprovalStage.OnHoldByBFM) {
            data.WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          }
          else if (data.WiproOrderApprovalStage == OrderApprovalStage.PendingWithDM || data.WiproOrderApprovalStage == OrderApprovalStage.PendingWithBFM || data.WiproOrderApprovalStage == OrderApprovalStage.Pendingwithdealowner || data.WiproOrderApprovalStage == OrderApprovalStage.PendingWithADH_VDH_SDH ||
            data.WiproOrderApprovalStage == OrderApprovalStage.InvoicingRequestPendingwithBFM || data.WiproOrderApprovalStage == OrderApprovalStage.PendingwithICTeam) {
            // let timeDiff: any = date3 - date2;
            let DaysDiff: any = this.dateDiffInDays(date3, date2);
            data.WiproAging = DaysDiff ? parseInt(DaysDiff) : "0";
          }
        })
        // this.approvalLog.map(item => {
        //   item.WiproInitiatedOn = new Date(item.WiproInitiatedOn);
        //   item.WiproDecisionDate = new Date(item.WiproDecisionDate);
        //   let temp = this.wipro_orderapprovalstage.filter(it => it.Value === item.WiproOrderApprovalStage);
        //   if (temp && temp.length > 0)
        //     item.WiproOrderApprovalStageDesc = temp[0].Label;
        //   // item.WiproOrderApprovalStageColor = this.wipro_approvaltype.filter(it => it.Value == item.wiproApprovaltype)[0].color;
        // })
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
  dateDiffInDays(a: any, b: any) {
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }
  poNumberpopup() {

    const dialogRef = this.dialog.open(poNumberPopup, {
      width: '620px',
      data: this.orderId
    });
  }
}

@Component({
  selector: 'poNumber-popup',
  templateUrl: './po-number-popup.html',
  styleUrls: ['./user-declarations.component.scss']
})
export class poNumberPopup implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<poNumberPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any, public orderService: OrderService) {

  }
  poNumberArray = [];

  ngOnInit() {
    this.getPODetails();
  }

  getPODetails() {
    let payload = {
      Id: this.data
    }
    this.orderService.getOrderPOdetails(payload).subscribe((response: any) => {
      if (!response.IsError) {
        console.log("data", this.poNumberArray);
        this.poNumberArray = response.ResponseObject;
      }
    },
      err => {
        console.log(err)
      })
  }

}