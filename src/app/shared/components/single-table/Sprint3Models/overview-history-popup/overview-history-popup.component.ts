import { Component, OnInit , Inject, OnDestroy} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountService } from '@app/core/services/account.service';
import { Subscription } from 'rxjs/Subscription';
import { AccountListService } from '@app/core/services/accountList.service';


@Component({
  selector: 'app-overview-history-popup',
  templateUrl: './overview-history-popup.component.html',
  styleUrls: ['./overview-history-popup.component.scss']
})
export class OverviewHistoryPopupComponent implements OnInit {
  historybtn: boolean
  popupData:any;
  subscription: Subscription;
  overviewbtn: boolean;
  statusComment:[]
   constructor(
    public dialogRef: MatDialogRef<OverviewHistoryPopupComponent>, public dialog:MatDialog,
    public userdat: AccountService,
    public accservive:DataCommunicationService ,
    public accListService: AccountListService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("History popup ", this.data);
//let name = this.data.Name;
      // this.subscription = this.accListService.getMessage().subscribe(history => {
      //    this.popupData = history; 
      //    console.log("Popup Data",this.popupData);
      //    this.statusComment = this.popupData.map(data=>
      //    .push(data.OverAllComments));
      //    debugger;
      //   });
     
    }  

  ngOnInit() {
    this.overviewbtn = true;
     this.historybtn = false;



  }

overviewClick(){
  this.overviewbtn = true;
  this.historybtn = false;
}

   historyClick(){
     this.overviewbtn = false;
     this.historybtn = true;
   }

   /*ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();                               
   }*/
}
