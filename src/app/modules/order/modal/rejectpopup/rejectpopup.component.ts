import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService,OpportunitiesService,DataCommunicationService } from '@app/core';
@Component({
  selector: 'app-rejectpopup',
  templateUrl: './rejectpopup.component.html',
  styleUrls: ['./rejectpopup.component.scss']
})
export class RejectpopupComponent implements OnInit {
  rejectReason = "";
   Payload:any='';
   date=new Date();
   rejectPopUp:boolean=false;
   textValue: string = '';
   bgcolorblue : boolean = false;
   showErrorMsg:boolean = false;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<RejectpopupComponent>,public orderService:OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any, public projectService: OpportunitiesService,public service: DataCommunicationService) { 
console.log("data",this.data)
    }

  ngOnInit() {
  }


textAreaEmpty(){
  this.showErrorMsg = false;
  if (this.rejectReason.trim() != "") {
    this.bgcolorblue = true;
    console.log(this.rejectReason);
  }
  else {
    this.bgcolorblue = false;
  }
}

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.rejectReason,
      data: "BFM_Reject"
    }
     console.log("pop up data",this.data.parentPage);
        // this.service.loaderhome = true;
    if(this.data.parentPage == "order approval" && returnObj.flag=='YES' && this.data.data.StatusId=='184450000'){
      this.service.loaderhome = true;
      if(this.data.data.nonWTFlag==true){
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "",
          "approvaltype": this.data.data.ApprovalType,
           // "approvaltype": "Order Approval",
          "isWT": this.data.data.nonWTFlag==true ?"No":"Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity": "systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
        }
       this.Payload=payloads;
       if( this.Payload.rejectionreason){
         this.orderService.submitDMApproval(this.Payload).subscribe((resDMOrderApproval:any)=>{
             if(!resDMOrderApproval.has_more){
                  this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
    },
    err=>{
        this.service.loaderhome = false;
       this.projectService.displayerror(err.status);
        this.dialogRef.close(returnObj);
    })
      }else{
        this.service.loaderhome = false;
        // this.projectService.displayMessageerror("FIll the Reason Field");
        this.showErrorMsg = true;
      }
      }else if(this.data.data.nonWTFlag==false){
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "Reason for Approval",
          "approvaltype": this.data.data.ApprovalType,
          //"approvaltype": "Order Approval",
         // "isWT": this.data.data.nonWTFlag==true ?"No":"Yes",
            "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate": this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity":"systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
        }
          this.Payload=payloads;
          console.log('payload',JSON.parse(JSON.stringify(this.Payload)));
          if( this.Payload.rejectionreason){
      this.orderService.submitDMApproval(this.Payload).subscribe((resDMOrderApproval:any)=>{
      console.log("resDMOrderApproval",resDMOrderApproval);
       if(!resDMOrderApproval.has_more){
           this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
           
        },
              err=>{
                 this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
                 this.dialogRef.close(returnObj);
              })
          }else{
              this.service.loaderhome = false;
                // this.projectService.displayerror("Fill the Reason Field");
                this.showErrorMsg = true;
          }
      }
    
    }
    if(this.data.parentPage == "order approval" && returnObj.flag=='YES' && this.data.data.ApprovalTpyeId=='184450005'){
      this.service.loaderhome = true;
      if(this.data.data.nonWTFlag==true){
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "Reason for Approval",
          "approvaltype": this.data.data.ApprovalType,
       // "approvaltype" :"Order Foreclosure",
         // "isWT": this.data.data.nonWTFlag==true ?"Yes":"No",
           "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate":this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity":"systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
         "onholdreason": "",
      }
        this.Payload=payloads;
        console.log('payload',JSON.parse(JSON.stringify(this.Payload)));
        if(this.Payload.rejectionreason){
        this.orderService.saveForeClosureDm(this.Payload).subscribe((resforeclosureOrderApproval:any)=>{
        console.log("resAdhOrderApproval",resforeclosureOrderApproval);
         if(!resforeclosureOrderApproval.has_more){
             this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
       },
       err=>{
           this.service.loaderhome = false;
           this.projectService.displayerror(err.status);
            this.dialogRef.close(returnObj);
        })
      }
        else{
           this.service.loaderhome = false;
          //  this.projectService.displayMessageerror("Fill the Reason Field");
          this.showErrorMsg = true;
        }
      }else if(this.data.data.nonWTFlag==false){
         const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "",
          "approvaltype": this.data.data.ApprovalType,
           //"approvaltype" :"Order Foreclosure",
         // "isWT": this.data.data.nonWTFlag==true ?"Yes":"No",
           "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate":this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity":"systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
         "onholdreason": "",
      }
        this.Payload=payloads;
        console.log('payload',JSON.parse(JSON.stringify(this.Payload)));
        if(this.Payload.rejectionreason){
        this.orderService.saveForeClosureDm(this.Payload).subscribe((resforeclosureOrderApproval:any)=>{
        console.log("resAdhOrderApproval",resforeclosureOrderApproval);
        if(!resforeclosureOrderApproval.has_more){
            this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
         
        },
        err=>{
            this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
             this.dialogRef.close(returnObj);
        })
      }else{
        this.service.loaderhome = false;
        // this.projectService.displayMessageerror("Fill the Reason Field");
        this.showErrorMsg = true;
      }
    }
  
  }
  //rejecting for adh
    if(this.data.parentPage == "order approval" && returnObj.flag=='YES' && this.data.data.StatusId=='184450001'){
      this.service.loaderhome = true;
      if(this.data.data.nonWTFlag==true){
        const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "",
          "approvaltype": this.data.data.ApprovalType,
          // "approvaltype" :"Order Foreclosure",
          //"isWT": this.data.data.nonWTFlag==true ?"Yes":"No",
            "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate":this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity":"systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
         "onholdreason": "",
      }
        this.Payload=payloads;
        if(this.Payload.rejectionreason){
        console.log('payload',JSON.parse(JSON.stringify(this.Payload)));
        this.orderService.submitOrderAdhApproval(this.Payload).subscribe((resofAdhBdh:any)=>{
          if(!resofAdhBdh.has_more){
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
          
        console.log("resofAdhBdh",resofAdhBdh)
       },
       err=>{
           this.service.loaderhome = false;
           this.projectService.displayerror(err.status);
           this.dialogRef.close(returnObj);
       })
      }else{
        this.service.loaderhome = false;
          //  this.projectService.displayMessageerror("Fill the Reason Field");
          this.showErrorMsg = true;
      }
      }else if(this.data.data.nonWTFlag==false){
         const payloads = {
          "orderID": this.data.data.orderBookingId,
          "approvalreason": "",
          "approvaltype": this.data.data.ApprovalType,
         //"isWT": this.data.data.nonWTFlag==true ?"Yes":"No",
           "isWT": this.data.data.nonWTFlag == true ? "No" : "Yes",
          "orderType":this.data.data.isSigned==true ?  "Clean Order" :'OAR',
          "decisiondate":this.date.toISOString(),
          "rejectionreason": returnObj.reason,
          "resubmissionreason": "",
          "statuscode": "Reject",
          "entity":"systemusers",
          "ownerid": this.data.data.ownerId,
          "processinstanceid":this.data.data.CommundaProcessId,
         "onholdreason": "",
      }
        this.Payload=payloads;
        console.log('payload',JSON.parse(JSON.stringify(this.Payload)));
        if(this.Payload.rejectionreason){
        this.orderService.submitOrderAdhApproval(this.Payload).subscribe((resofAdhBdh:any)=>{
        console.log("resofAdhBdh",resofAdhBdh);
          if(!resofAdhBdh.has_more){
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order rejected successfully");
              this.dialogRef.close(returnObj);
          }
         
        },
        err=>{
            this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
             this.dialogRef.close(returnObj);
        })
      }else{
        this.service.loaderhome = false;
        // this.projectService.displayMessageerror("Please Fill the Feild");
        this.showErrorMsg = true;
      }
    }
  
  }
  
  if(this.data.data_condition == "BFM_Reject" && returnObj.flag=='YES'){
    this.service.loaderhome = false;
    if(this.rejectReason == '' || this.rejectReason == null){
      this.showErrorMsg = true;
    }
    else {
    this.dialogRef.close(returnObj);
    this.showErrorMsg = false;
    }
  }
    if(returnObj.flag =='NO'){
       this.service.loaderhome = false;
      this.dialogRef.close(returnObj);
    }
  }
 
}
