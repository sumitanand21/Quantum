import { Component, OnInit } from '@angular/core';
import { OpportunitiesService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';

@Component({
  selector: 'app-order-rejectmodified-popup',
  templateUrl: './order-rejectmodified-popup.component.html',
  styleUrls: ['./order-rejectmodified-popup.component.scss']
})
export class OrderRejectmodifiedPopupComponent implements OnInit {
 reason="";
 bgcolorblue: boolean = false;
  constructor(public dialogRef: MatDialogRef<OrderRejectmodifiedPopupComponent>,public projectService: OpportunitiesService) { }

  ngOnInit() {
  }

  onsave(){
    this.reason = this.reason? this.reason.trim():this.reason;
    if(!this.reason){
      this.projectService.displayMessageerror("Please provide reason to reject the modified details");
    }else{
      this.dialogRef.close(this.reason);
    }
  }
  textAreaEmpty() {
    if (this.reason.trim() != "") {
      this.bgcolorblue = true;
    }
    else {
      this.bgcolorblue = false;
    }
  }

}
