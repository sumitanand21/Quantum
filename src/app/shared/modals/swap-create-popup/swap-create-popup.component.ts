import { Component, OnInit ,Inject,HostListener} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountService } from '@app/core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-swap-create-popup',
  templateUrl: './swap-create-popup.component.html',
  styleUrls: ['./swap-create-popup.component.scss']
})
export class SwapCreatePopupComponent implements OnInit {
  accountdetails=[];
  account1;
  account2;
  swapaccountcomment: string = '';
  commentpostobject: any = {};
  constructor(public router: Router, public service:AccountService, public dialogRef: MatDialogRef<SwapCreatePopupComponent>, public dialog:MatDialog,public accservive:DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.account1=data.account1;
      this.account2=data.account2;
    }
    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }
  ngOnInit() {
  }
  PostSwapData(act)
  {
    this.commentpostobject['act'] = act;
    this.commentpostobject['swapaccountcomment'] = this.swapaccountcomment; 
    this.dialogRef.close(this.commentpostobject);
  //   debugger;
  
  //   var orginalArrayget = this.service.getAllCreationActiveRequests();
  //   console.log(orginalArrayget);
  //   orginalArrayget.subscribe((x: any[]) => {
  //   console.log(x);
  //   this.accountdetails = x;
     
  //   var orginalArray = this.service.postAllCreationActiveRequests({
  //     "Name": "Account name " +this.accountdetails.length + 1,
  //     "Number": "-",
  //     "Requesttype":"Create & swap",
  //     "Requestdate":"25/02/2018",
  //     "Swapaccount":"Account name",
  //     "Status": "Approval pending",
  //     "Classification": "Hunting",
  //     "Owner": "Kinshuk Bose",
  //     "Sbu": "PSG",
  //     "Vertical": "Consumer",
  //     "Subvertical" : "Energy",
  //     "Geo":"Singapore",
  //     "isCheccked":false,
  //     "isExpanded":false,
  //     "id":this.accountdetails.length + 1,
  //     "viewBtnVisibility": true,
  //     "reviewBtnVisibility": true,
  //     "rejectBtnVisibility": true,
  //     "approveBtnVisibility": true,
  //     "viewmoreBtnVisibility": true,
  //     "statusclass": "approvalstatus"
  //       });
      
  //   orginalArray.subscribe((x: any) => {
  //   // console.log(x);
  //   this.router.navigate(['/accounts/accountcreation/activerequest']);
  //   });
  
  // });
  }
}
