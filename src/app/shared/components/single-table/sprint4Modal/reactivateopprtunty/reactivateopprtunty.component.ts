import { Component, OnInit ,Inject} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService, DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reactivateopprtunty',
  templateUrl: './reactivateopprtunty.component.html',
  styleUrls: ['./reactivateopprtunty.component.scss']
})
export class ReactivateopprtuntyComponent implements OnInit {
  panelOpenState;
  opportunityName;
opportunityId;

  constructor(   public service: DataCommunicationService,public router: Router,public dialogRef: MatDialogRef<ReactivateopprtuntyComponent>,public dialog: MatDialog, public DataCommunicationService   :DataCommunicationService ,
      @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService) { 
debugger;
    this.opportunityId =  data.data.OpportunityId
    this.opportunityName =  data.data.OpportunityName
  }

  closeIcon(){

  this.dialogRef.close('close');
}

  ngOnInit() {
  }
confirm(){
     let body= { "Id" : this.opportunityId }
        this.service.loaderhome = true
       this.allopportunities.reopenSavee(body).subscribe(response => {
             if( !response.IsError){
             if(response.Message=="success"){
        this.allopportunities.displayMessageerror("Opportunity reactivated successfully");
       
         this.allopportunities.setSession('opportunityStatus', "1");  
            this.dialogRef.close('save');
        //  if (this.router.url !== '/opportunity/allopportunity'){
        //   window.location.reload();
        //  }
             }
             else{
       this.allopportunities.displayMessageerror(response.Message);
             }
         }

        else{
       this.allopportunities.displayMessageerror(response.Message);
       }
       this.service.loaderhome = false
     },
       err => {
       this.service.loaderhome = false    
     this.allopportunities.displayerror(err.status);
  }
  );


}

}
