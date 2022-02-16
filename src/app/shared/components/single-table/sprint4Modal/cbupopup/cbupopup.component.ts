import { Component, OnInit,Inject } from '@angular/core';
import { OpportunitiesService} from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cbupopup',
  templateUrl: './cbupopup.component.html',
  styleUrls: ['./cbupopup.component.scss']
})
export class CBUpopupComponent implements OnInit {
CbuName :string="";
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CBUpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public projectService: OpportunitiesService) { }

  ngOnInit() {
  }
addcbu(){
if(this.CbuName){
let obj={
    "CbuName": this.CbuName,
    "AccGuid": this.data.accountID,

}
this.projectService.addCBU(obj).subscribe(result=>{
  debugger;
  if(!result.IsError){
    console.log(result);
  this.dialogRef.close(result);
}
else{
  this.dialogRef.close(result); 
}
})
}
else{
  this.projectService.displayMessageerror("Please enter the mandatory field")
}
}
}
