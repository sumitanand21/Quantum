import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material/';
import { ISubscription } from 'rxjs/Subscription';
import { Subscription } from 'rxjs';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-account-merge-landing',
  templateUrl: './account-merge-landing.component.html',
  styleUrls: ['./account-merge-landing.component.scss']
})
export class AccountMergeLandingComponent implements OnInit, OnDestroy {
  // subscription: ISubscription;
  subscription: Subscription;
  prevStepValue:any;
  mergeData:any;
  constructor(public snackBar: MatSnackBar, private router: Router, public dialog: MatDialog, public service: DataCommunicationService, private accountListService: AccountListService) {
  }
  accountstepper: any[] = [
    {
      number: 1,
      text: 'Request details',
      status: 'current',
      router: '/helpdesk/accActions/mergelanding/requestdetails'
    },
    {
      number: 2,
      text: 'Source account',
      status: 'inactive',
      router: '/helpdesk/accActions/mergelanding/sourceaccount'
    },
    {
      number: 3,
      text: 'Target account',
      status: 'inactive',
      router: '/helpdesk/accActions/mergelanding/targetaccount'

    },
    {
      number: 4,
      text: 'Preview target account',
      status: 'inactive',
      router: '/helpdesk/accActions/mergelanding/previewaccount'

    },
    {
      number: 5,
      text: 'Merge summary',
      status: 'inactive',
      router: '/helpdesk/accActions/mergelanding/mergesummary'

    },
    {
      number: 6,
      text: 'Result',
      status: 'inactive',
      router: '/helpdesk/accActions/mergelanding/results'

    },

  ]
  ngOnInit() {
    let prevStep:any = localStorage.getItem("RequestStage"); 
    if(prevStep == "" || prevStep == null){
      prevStep = 1;
    }
    this.navigateToStep(prevStep);  
    this.prevStepValue = prevStep;
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.reqDetails(reqSysGuid)
  }
  reqDetails(reqSysGuid) {
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListService.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          this.mergeData = details.ResponseObject;
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
  navigateToStep(prevStep)
  {
    // debugger;
    let steps=this.accountstepper.filter(x => x.number == prevStep)[0]
    this.accountstepper.forEach(x => {
        if (x.number < prevStep) {
          x.status = 'active'
        }
        if (x.number > prevStep) {
          x.status = 'inactive'
        }
        if (prevStep == x.number) {
          x.status = 'current'
          if(prevStep == 6){
            this.noshowlast = false;
          }else{
            this.noshowlast = true;
            if (x.number == this.accountstepper.length - 1) {
              this.IsfinalStep = true;
            }
            else {
              this.IsfinalStep = false;

            }
          }
          
        }

      });
      this.router.navigateByUrl(steps.router);
  }
  ngOnDestroy() {
    localStorage.removeItem("RequestStage");
    localStorage.removeItem("requestedBy");
    localStorage.removeItem("verticalDataId");
    if(this.subscription && !this.subscription.closed)
    this.subscription.unsubscribe();
    // this.subscription.dispose();
    // let data = [];
    // this.accountListService.changeSourceData(data);
  }
  IsfinalStep: boolean = false;
  noshowlast: boolean = true;
  sourceData: any;
  verticalSysGuid: string = "";
  nextstep(steps) {
    let currentItem = this.accountstepper.filter(x => x.status == 'current')[0];
    if (steps.number < currentItem.number) {
      this.navigateToStep(steps.number);
      
    }
    this.noshowlast = true;

  }

  // goback() {
  //   this.router.navigate(['/helpdesk/accActions/mergelanding/requestdetails']);
  // }

  saveNext(){
    this.verticalSysGuid = JSON.parse(localStorage.getItem("verticalDataId"));
    // if(this.accountListService.sourceAccountData){
      this.filterCheckedData()
    // }
    this.sourceData = JSON.parse(localStorage.getItem("mergeDataSave"));  
    let currentItem = this.accountstepper.filter(x => x.status == 'current')[0];
    let currentState = currentItem.number+1;  
    if((this.allData && this.allData.length>0 && this.verticalSysGuid && currentState==3) || (this.sourceData && this.sourceData.targetId && currentState==4) || currentState == 5 || currentState == 6 || currentState == 2){
      this.nextbutton();
    }else{
      this.snackBar.open("Field or account selection is mandatory.", '', {
        duration: 3000
      });
    }
  }
  nextbutton() {
      let currentItem = this.accountstepper.filter(x => x.status == 'current')[0];
      if (currentItem.number == 3 && window.innerWidth < 420) {
        document.getElementById('dummyStepCtrl').focus()
      }
      if (currentItem.number != this.accountstepper.length) {
        let setCurrent = currentItem.number + 1;
        this.accountstepper.forEach(x => {
          if (x.number <= currentItem.number) {
            x.status = 'active'
          }
          if (x.number > currentItem.number) {
            x.status = 'inactive'
          }
          if (setCurrent == x.number) {
            x.status = 'current'
            if (x.number == this.accountstepper.length - 1) {
              this.IsfinalStep = true;
            }
            else {
              this.IsfinalStep = false;

            }
          }
        })
        this.SubmitMergeAccount();
        // currentItem = this.accountstepper.filter(x => x.status == 'current')[0];
        // this.router.navigateByUrl(currentItem.router);
      }

  }
  allData:any = [];
  filterCheckedData(){
     this.subscription = this.accountListService.targetAccData.subscribe((res) => {
      console.log("account landing", res);
      if(res){
        let filteredData = [];
        let checkedData = res;
        if (checkedData) {
          checkedData.map((res: any) => {
              // if(this.allData && this.allData.length>0){
                filteredData.push({ SysGuid: res.SysGuid });
                this.allData = filteredData
              // } else {
              //   this.allData.map((res1) => {
              //     if(res1.SysGuid != res.SysGuid){
              //       filteredData.push({ SysGuid: res.SysGuid });
              //       this.allData = filteredData;
              //     }
              //   })
              // }
            // } else {
            //   filteredData = [];
            // }
          })
        }
      }
    })
      console.log("account subscription", this.subscription);
    
    
  }
  SubmitMergeAccount() {
    // debugger
    let currentItem = this.accountstepper.filter(x => x.status == 'current')[0];
    let currentStep = currentItem.number;
    this.filterCheckedData();
    
    // if(res.vertical && res.checkedData)
    // if(this.accountListService.sourceAccountData){
    //   this.filterCheckedData(this.accountListService.sourceAccountData)
    // }
    this.sourceData = JSON.parse(localStorage.getItem("mergeDataSave"));
    this.verticalSysGuid = JSON.parse(localStorage.getItem("verticalDataId"));
    console.log("subject res", this.sourceData)
    // });
    if (this.sourceData || this.allData || currentStep==5) {
      let currentDate = new Date();
      let savePayload = {
        "SysGuid": localStorage.getItem("accSysGuid"),  //
        "Name": (this.sourceData && this.sourceData.mergeName) ? this.sourceData.mergeName : "",
        "Description": (this.sourceData && this.sourceData.mergeDesc) ? this.sourceData.mergeDesc : "",
        "RequestStage": {
          "Id": currentStep   // send as per stage
        },
        "SourceAccounts": this.allData ? this.allData : [],
        "TargetAccount": {
          "SysGuid": (this.sourceData && this.sourceData.targetId) ? this.sourceData.targetId : ""
        },
        "Vertical": { Id: this.verticalSysGuid ? this.verticalSysGuid : "" },
        "RequestedOn": ((currentStep)==6) ? currentDate:"",
        "CreatedBy":{"SysGuid":localStorage.getItem("requestedBy")}
      }
      console.log(savePayload);
      this.accountListService.saveMergeRequest(savePayload).subscribe((res) => {
        if (!res.IsError) {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
          this.router.navigateByUrl(currentItem.router);
          this.allData = [];
          // this.prevStepValue == res.ResponseObject.RequestStage?res.ResponseObject.RequestStage.Id:this.prevStepValue;
          this.prevStepValue = "";
          // localStorage.removeItem("mergeDataSave");
          // localStorage.removeItem("verticalDataId");
        }
      })
    } else {
      this.snackBar.open("Field or account selection is mandatory.", '', {
        duration: 3000
      });
    }
  }
  openmergepop(): void {
    const dialogRef = this.dialog.open(mergepopComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.nextbutton();
        this.noshowlast = false;
      }
      else {
        this.noshowlast = true;
      }
    });
  }


}
@Component({
  selector: 'app-merge-pop',
  templateUrl: './merge-pop.html',
  styleUrls: ['./account-merge-landing.component.scss']


})
export class mergepopComponent {

  constructor(private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<mergepopComponent>, ) { }
  gotoresults() {
    this.dialogRef.close(true);
  }
}
