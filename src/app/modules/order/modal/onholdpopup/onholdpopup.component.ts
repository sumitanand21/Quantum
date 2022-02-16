import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '@app/core/services/order.service';

@Component({
  selector: 'app-onholdpopup',
  templateUrl: './onholdpopup.component.html',
  styleUrls: ['./onholdpopup.component.scss']
})
export class OnholdpopupComponent implements OnInit {

  wipro_holdreason = []
  onHoldReason = "";
  reasonId = "";
  bgcolorblue : boolean = false;  
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OnholdpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public orderService:OrderService) { 

    }

  ngOnInit() {
    this.getOnHoldReasonData();
  }

  getOnHoldReasonData(){
    this.orderService.getOnHoldReasons().subscribe((reasons:any) =>{
      if(!reasons.IsError){
        this.wipro_holdreason = reasons.ResponseObject;
        console.log("data", this.wipro_holdreason)
      }
    },
    err =>{
      console.log(err)
    })
  }

  changeOnHoldReason(evnt) {
    this.reasonId = evnt.target.value;
    console.log(this.reasonId)
  }

  textAreaEmpty(){
    if (this.onHoldReason.trim() != "") {
      this.bgcolorblue = true;
      console.log(this.onHoldReason);
    }
    else {
      this.bgcolorblue = false;
    }
  }

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.onHoldReason,
      reasonId : this.reasonId
    }
    this.dialogRef.close(returnObj);
  }
}
