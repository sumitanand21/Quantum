import { Component, OnInit ,Inject} from '@angular/core';
import { OpportunitiesService} from '@app/core/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-rollbackcomponent',
  templateUrl: './rollbackcomponent.component.html',
  styleUrls: ['./rollbackcomponent.component.scss']
})
export class RollbackcomponentComponent implements OnInit {
  currentStage:string="";
  radioChecked:boolean=false;
  stageID;
   constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<RollbackcomponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public projectService: OpportunitiesService) {

  }

icons = [
  {
    icon: 'assets/images/Create.png',
    iconLabel:'Create',
    value:'184450000'
  },
  {
    icon: 'assets/images/Qualify.png',
    iconLabel:'Qualify',
    value:'184450001'
  },
  {
    // pursuit icon is currently unavailable
    icon: 'assets/images/pursuit.png',
    iconLabel:'Pursuit',
    value:'184450002'
  },
  // {
  //   icon: 'assets/images/secure.png',
  //   iconLabel:'Secure',
  //   value:'184450003'
  // },
]

  ngOnInit() {
  this.currentStage=this.projectService.getSession('currentState');
  switch (this.currentStage) {
      case '184450001': {
       this.icons.splice(1,this.icons.length)
        return
      }
      case '184450002': {
       this.icons.splice(2,this.icons.length)
        return
      }
      case '184450003': {
       this.icons.splice(3,this.icons.length)
        return
      }
  }
}
radioCheckMethod(data){
debugger;
this.radioChecked=true;
this.stageID=data.value;
}
callStageAPI(){
  debugger;
if(this.radioChecked){
this.dialogRef.close(this.stageID)
}
else{
  this.projectService.displayMessageerror("Kindly select the stage for rollback")
}
}
}
