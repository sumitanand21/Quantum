import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OpportunitiesService, DataCommunicationService, OrderService } from '@app/core';

@Component({
  selector: 'app-approvepopup',
  templateUrl: './approvepopup.component.html',
  styleUrls: ['./approvepopup.component.scss']
})
export class ApprovepopupComponent implements OnInit {
  approveReason = "";
  Payload: any = '';
 // bgcolorblue : boolean = false;
  date = new Date()
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ApprovepopupComponent>, public orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any,public projectService: OpportunitiesService, public service: DataCommunicationService) {
    console.log('reject pop ups', this.data)
  }

  ngOnInit() {
  }

  // textAreaEmpty(){
  //   if (this.approveReason.trim() != "") {
  //     this.bgcolorblue = true;
  //     console.log(this.approveReason);
  //   }
  //   else {
  //     this.bgcolorblue = false;
  //   }
  // }

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.approveReason,
      data: "BFM_Approval"
    }
      this.service.loaderhome = true;
    console.log("pop up data", this.data.parentPage)
    if (this.data.parentPage == "order approval" && returnObj.flag == 'YES' && this.data.data.StatusId == '184450000') {
       this.service.loaderhome = true;
      if (this.data.data.nonWTFlag == true) {
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": returnObj.reason,
          "approvaltype": this.data.data.ApprovalType,
          "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.data.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": "",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": "systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid": this.data.data.CommundaProcessId,
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        this.orderService.submitDMApproval(this.Payload).subscribe((resDMOrderApproval: any) => {
          if(!resDMOrderApproval.has_more){
               this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order approved successfully");
              this.dialogRef.close(returnObj);
          }
        },
          err=> {
              this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
              this.dialogRef.close(returnObj);
       
        })
      }
      else if (this.data.data.nonWTFlag == false) {
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason":  returnObj.reason,
          "approvaltype": this.data.data.ApprovalType,
          "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.data.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": "",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": "systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid": this.data.data.CommundaProcessId,
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        this.orderService.submitDMApproval(this.Payload).subscribe((resDmOrderApproval: any) => {
           if(!resDmOrderApproval.has_more){
              this.service.loaderhome = false;
             this.projectService.displayMessageerror("Order approved successfully");
              
              this.dialogRef.close(returnObj);
          }
        },
           err=> {
             this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
              this.dialogRef.close(returnObj);
        })
      }


    }
    if (this.data.parentPage == "order approval" && returnObj.flag == 'YES' && this.data.data.ApprovalTpyeId == '184450005') {
       this.service.loaderhome = true;
      if (this.data.data.nonWTFlag == true) {
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason":  returnObj.reason,
          "approvaltype": this.data.data.ApprovalType,
          //"isWT": this.data.data.nonWTFlag == true ? "Yes" : "No",
            "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.data.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason":"",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": this.data.role == "DM" ? "systemusers" : "sapdm",
          "ownerid": this.data.data.ownerId,
          "processinstanceid": this.data.data.CommundaProcessId,
          "onholdreason": "",
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        this.orderService.saveForeClosureDm(this.Payload).subscribe((resforeclosureOrderApproval: any) => {
          if(!resforeclosureOrderApproval.has_more){
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Foreclosure Approved by DM");
              this.dialogRef.close(returnObj);
          }
          else {
              this.service.loaderhome = false;
             this.projectService.displayMessageerror(resforeclosureOrderApproval.status);
              this.dialogRef.close(returnObj);
          }
          console.log("resAdhOrderApproval", resforeclosureOrderApproval)
        })
      } else if (this.data.data.nonWTFlag == false) {
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": returnObj.reason,
          "approvaltype": this.data.data.ApprovalType,
         // "isWT": this.data.data.nonWTFlag == true ? "Yes" : "No",
           "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType": this.data.data.isSigned == true ? "Clean Order" : 'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason":"",
          "resubmissionreason": "",
          "statuscode": "Approve",
          "entity": this.data.role == "DM" ? "sapdm" : "sapdm",
          "ownerid": this.data.data.ownerId,
          "processinstanceid": this.data.data.CommundaProcessId,
          "onholdreason": "",
        }
        this.Payload = payloads;
        console.log('payload', JSON.parse(JSON.stringify(this.Payload)));
        this.orderService.saveForeClosureDm(this.Payload).subscribe((resforeclosureOrderApproval: any) => {
           if(!resforeclosureOrderApproval.has_more){
               this.service.loaderhome = false;
              this.projectService.displayMessageerror("Foreclosure Approved by DM");
              this.dialogRef.close(returnObj);
          }
        },
          err=> {
             this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
            this.dialogRef.close(returnObj);
        })


      }
      
    }
    if(returnObj.flag =='NO'){
       this.service.loaderhome = false;
      this.dialogRef.close(returnObj);
    }
    if (this.data.data_condition == "BFM_Approval" && returnObj.flag == 'YES') {
      this.dialogRef.close(returnObj);
        this.service.loaderhome = false;
    }
    
    //this.dialogRef.close(returnObj);
  }
}
