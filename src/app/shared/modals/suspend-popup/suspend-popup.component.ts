import { Component, OnInit ,Inject} from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService, DataCommunicationService } from '@app/core';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'suspend-pop',
  templateUrl: './suspend-pop.html',
   styles:[`
   
.cust_calan {
  input {
      border: 1.5px solid #d8d8d8 !important;
      border-radius: 4px;
      outline: none;
      padding-left: 8px;
      padding: 6px;
  }
  .mat-datepicker-toggle {
      position: absolute;
      right: 10px;
  }
}

.mat-button .mat-button-wrapper>* {
  display: none !important;
}

.mat-calendar-period-button {
  min-width: 0;
  left: 6.8em;
  color: white;
  box-shadow: none !important;
}

.mat-datepicker-content .mat-calendar-next-button,
.mat-datepicker-content .mat-calendar-previous-button {
  box-shadow: none !important;
}

.cal_brdr {
  .mat-form-field-flex {
      background-color: #fff;
      border: 1.5px solid #ccc;
      border-radius: 4px;
  }
  .mat-form-field-appearance-legacy .mat-form-field-infix {
      padding: 0.4375em 0;
      padding-left: 10px;
      padding-right: 5px;
      height: 40px;
  }
  .mat-form-field-infix {
      position: relative;
      border: 0;
      padding: 3px;
  }
  .mdi-calendar-blank:before {
      color: #2f81ff;
      font-size: 20px;
      position: relative;
  }
  .mat-icon-button {
      position: relative;
      outline: none;
  }
  .mat-icon-button:hover {
      box-shadow: none;
  }
  .mat-focused {
      border-color: transparent !important;
  }
}

    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }  
  `]
})


   
export class suspendedpopComponent {
  dateVal='';
  datePipe = new DatePipe("en-US");
  startDate = new Date()
  endDate=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + 90  );
    reviewdate;
    diffInDays;
   suspendRemarks='';
   opportunityId;
opportunityName='';
SuspendStartDate;

NextReviewDate;
Estclosuredate;
suspendcount;
suspenddurationvalue;
prevreviewdate;
prevsuspendDate;
prevdiffInDays;

 constructor(public dialogRef: MatDialogRef<suspendedpopComponent>,public router: Router,public dialog: MatDialog, public DataCommunicationService   :DataCommunicationService ,
      @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService,) { 
 debugger;
 this.opportunityId= data.data.OpportunityId
  this.opportunityName= data.data.OpportunityName?data.data.OpportunityName:""
    this.Estclosuredate=   data.data.Estclosuredate?data.data.Estclosuredate:""
    this.Estclosuredate = new Date(this.Estclosuredate);

    
    this.suspendcount=data.data.SuspendCount
    this.SuspendStartDate=data.data.SuspendStartDate?data.data.SuspendStartDate:""
    this.NextReviewDate=data.data.NextReviewDate?data.data.NextReviewDate:""
    this.suspenddurationvalue=data.data.SuspendedDuration?data.data.SuspendedDuration:0

}
closeIcon(){
  this.dialogRef.close('close');
}


getValidate(){

if(  this.dateVal=='' ||  (/^ *$/.test(this.suspendRemarks))){
  return true;
}
else{
  return false;
}
}

startDatee;
saveSuspend(){
  debugger;;
  this.prevsuspendDate= new Date((this.datePipe.transform(this.SuspendStartDate, "dd-MMM-yyyy")));
  this.prevreviewdate= new Date((this.datePipe.transform(this.NextReviewDate, "dd-MMM-yyyy")));
  this.reviewdate= new Date((this.datePipe.transform(this.dateVal, "dd-MMM-yyyy")));
  this.startDatee = new Date()
  if(this.suspendcount==1){


            var prevdiffInDaysTime =  Math.abs((this.prevreviewdate) - (this.prevsuspendDate) )
              var diffInDaysTime =  Math.abs((this.reviewdate) - (this.startDatee) )
            this.prevdiffInDays = Math.ceil( prevdiffInDaysTime/ ( 1000 * 60 * 60 * 24 ) )
            this.diffInDays = Math.ceil( diffInDaysTime/ ( 1000 * 60 * 60 * 24 ) )
  
  
  //   this.prevdiffInDays = Math.abs(this.prevreviewdate.diff(this.prevsuspendDate, 'days'));
  //  this.diffInDays = Math.abs(this.reviewdate.diff(this.startDate, 'days')); 
   
}



if (     (this.Estclosuredate) < new Date( this.datePipe.transform(this.dateVal, "dd-MMM-yyyy"))){

this.allopportunities.displayMessageerror('Next review date cannot be greater than estimated closure date');

}
else if(this.suspendcount==0 && (  new Date( this.datePipe.transform(this.dateVal, "dd-MMM-yyyy")) ) > 
   new Date(this.datePipe.transform(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + 90  ) ,'dd-MMM-yyyy') ) ){
  this.allopportunities.displayMessageerror('Next review date cannot be more than 90 days from current date'); 
 
 
}else if (this.suspendcount==1 && (this.prevdiffInDays + this.diffInDays)>180) {
 
    this.allopportunities.displayMessageerror('Opportunity can be suspended once for 180 days or twice for with summation of both duration, not more than 180 days ');
  }


else{
  console.log('suspendsuspendsuspend');
let body=
{
	"OpportunityId":  this.opportunityId ,
	"OpportunityStatus": "false", 
	"NextReviewDate": this.datePipe.transform( this.dateVal,"yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'"),
	"StatusCode": "2", 
  "SuspendRemarks": this.suspendRemarks,
  "SuspendStartDate":this.datePipe.transform( this.startDate,"yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'"),
}
  this.DataCommunicationService.loaderhome=true;
       this.allopportunities.saveSuspend(body).subscribe(response => {
         if( !response.IsError){
          if(response.Message=="success"){
         this.allopportunities.setSession('opportunityStatus', "2");  
         this.allopportunities.displayMessageerror('Opportunity suspended successfully'); 
         this.dialogRef.close('save');

          this.allopportunities.moreOptions();
          }
          else{
              this.allopportunities.displayMessageerror(response.Message); 
          }
         }
         else{
     this.allopportunities.displayMessageerror(response.Message);   
         }
      this.DataCommunicationService.loaderhome=false; 
    },
       err => {
           this.DataCommunicationService.loaderhome=false;
    this.allopportunities.displayerror(err.status);
  }
  );
}
}
}
