import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService, OpportunitiesService, DataCommunicationService } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-approvebfm',
  templateUrl: './approvebfm.component.html',
  styleUrls: ['./approvebfm.component.scss']
})
export class ApprovebfmComponent implements OnInit {
  AdhBdhDeatils: any = [];
  selectedAdhVal: any;
  rejectReason = "";
  bgcolorblue: boolean = false;
  Payload: any = '';
  date = new Date()
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ApprovebfmComponent>, public encrDecrService: EncrDecrService, public service: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any, public orderService: OrderService, public projectService: OpportunitiesService) {
    console.log("data", this.data)

  }

  ngOnInit() {
    // *******************************Neha Start Code*************************************************//
    // const Payload:any = {
    //     "OpportunityId": "45b35c49-4784-e911-a831-000d3aa058cb"
    //   }
    // this.orderService.getAdhBdhForWtOpportunity(Payload).subscribe((resAdh:any)=>{
    // console.log("resAdh",resAdh.ResponseObject);
    // this.AdhBdhDeatils=resAdh.ResponseObject;
    // console.log(" this.AdhBdhDeatils", this.AdhBdhDeatils)
    // })
  }
  // adhBdhValue(val){
  //   console.log("val",val);
  //   this.selectedAdhVal=val;

  // }

  textAreaEmpty() {
    if (this.rejectReason.trim() != "") {
      this.bgcolorblue = true;
      console.log(this.rejectReason);
    }
    else {
      this.bgcolorblue = false;
    }
  }

  // ************************************Neha End Code***************************************//
  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.rejectReason
    }
    // *******************************Neha Start Code*************************************************//
    if (this.data.pageStatus == "Aproval ADH order" && flag == 'YES' && this.data.rowData.StatusId == '184450001') {
      this.service.loaderhome = true;
      if (this.data.rowData.nonWTFlag == true) {
        const payloads = {
          "orderID": this.data.rowData.orderBookingId,
          "approvalreason": returnObj.reason,
          "approvaltype": this.data.rowData.ApprovalType,
          // "approvaltype": "Order Approval",
          // "isWT": this.data.rowData.nonWTFlag==true ?"Yes":"No",
          "isWT": this.data.rowData.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.rowData.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": "",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": "systemusers",
          "ownerid": this.data.rowData.ownerId,
          "processinstanceid": this.data.rowData.CommundaProcessId,
          "onholdreason": "",
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        if (this.Payload.approvalreason) {
          this.orderService.submitOrderAdhApproval(this.Payload).subscribe((resOrderAdhApproval: any) => {
            console.log("resOrderAdhApproval", resOrderAdhApproval);
            if (!resOrderAdhApproval.has_more) {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order approved successfully");
              this.dialogRef.close(returnObj);
            }
          },
            err => {
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
              this.dialogRef.close(returnObj);
            })
        } else {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please enter approval reason");
        }
      } else if (this.data.rowData.nonWTFlag == false) {
        const payloads = {
          "orderID": this.data.rowData.orderBookingId,
          "approvalreason": returnObj.reason,
          "approvaltype": this.data.rowData.ApprovalType,
          //"approvaltype": "Order Approval",
          // "isWT": this.data.rowData.nonWTFlag==true ?"Yes":"No",
          "isWT": this.data.rowData.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.rowData.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": "",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": "systemusers",
          "ownerid": this.data.rowData.ownerId,
          "processinstanceid": this.data.rowData.CommundaProcessId,
          "onholdreason": "",
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        if (this.Payload.approvalreason) {
          this.orderService.submitOrderAdhApproval(this.Payload).subscribe((resOrderAdhApproval: any) => {
            console.log("resOrderAdhApproval", resOrderAdhApproval);
            if (!resOrderAdhApproval.has_more) {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order approved successfully");
              this.dialogRef.close(returnObj);
            }

          },
            err => {
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
              this.dialogRef.close(returnObj);
            }
          )
        } else {
          this.service.loaderhome = false;
          this.projectService.displayMessageerror("Please enter approval reason");
        }
      }


      // *******************************Neha End Code*************************************************/
    }
    // this.dialogRef.close(returnObj);
    if (returnObj.flag == 'NO') {
      this.service.loaderhome = false;
      this.dialogRef.close(returnObj);
    }
  }

}
