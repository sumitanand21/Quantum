import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { OpportunitiesService } from '@app/core';
@Component({
  selector: 'app-othercompetitor',
  templateUrl: './othercompetitor.component.html',
  styleUrls: ['./othercompetitor.component.scss']
})
export class OthercompetitorComponent implements OnInit {
  otherCompetitorName = '';
  flag=0;
  constructor(public dialogRef: MatDialogRef <OthercompetitorComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any, public opportunityService : OpportunitiesService) {}

  ngOnInit() {

  }
  onNoClick(){
    // if(this.otherCompetitorName == '' || this.otherCompetitorName == null || this.otherCompetitorName == undefined) {
    //   this.opportunityService.displayMessageerror("Name cannot be empty");
    // }
    // else {
      var comments = this.otherCompetitorName.replace(/\s/g, "");
      if(comments.length == 0) {
        this.opportunityService.displayMessageerror("Enter valid competitor name");
      }
      else {
        this.flag=1;
      this.dialogRef.close(this.otherCompetitorName);
      }
    // }
   
    
  }
  onCloseClick(){
    this.dialogRef.close();
  }

  ngDestroy(){
     if(this.flag!=1){
      this.dialogRef.close();
     }
  }

}
