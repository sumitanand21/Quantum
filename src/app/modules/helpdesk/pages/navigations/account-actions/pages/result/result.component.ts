import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  reqMergeDetails:any;
  constructor(public accountListServ: AccountListService) { }
  remainingTime: any;
  newDate:any = new Date();
  diffHrs:any;
  diffMins:any;
  mergeDate:any;
  failMessage:any;
  setIntOne:any;
  setIntTwo:any;
  ngOnInit() {
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.mergeReqDetails(reqSysGuid);
  }
  ngOnDestroy() {
    //if (this.setIntOne) {
      clearInterval(this.setIntOne);
    // }
    // if (this.setIntTwo) {
      clearInterval(this.setIntTwo);
    // }
  }
  mergeReqDetails(reqSysGuid) {    
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListServ.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          this.reqMergeDetails = details.ResponseObject;
          // this.remainingTime = this.reqMergeDetails.MergeDate - newDate;
          console.log("SysGuid available", this.reqMergeDetails);
          this.mergeDate = this.reqMergeDetails.MergeDate;
          this.failMessage = this.reqMergeDetails.FailureMessage?this.reqMergeDetails.FailureMessage:"";
          let targetDate:any = new Date(this.reqMergeDetails.MergeDate);
          // let diffMs:any = (targetDate - this.newDate);
          // this.diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
          // this.diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); 
          //let diffMs:any;
          this.setIntOne = setInterval(() => {
            let newDate:any = new Date();
            let diffMs = (targetDate - newDate);
            this.diffHrs =  Math.floor((diffMs % 86400000) / 3600000);
          }, 1000);
          this.setIntTwo = setInterval(() => {
            let newDate:any = new Date();
            let diffMs = (targetDate - newDate);      
            this.diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
          }, 1000);
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
}
