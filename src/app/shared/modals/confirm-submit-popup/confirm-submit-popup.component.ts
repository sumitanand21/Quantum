import { Component, OnInit , Inject,HostListener} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountService } from '@app/core/services/account.service';

@Component({
  selector: 'app-confirm-submit-popup',
  templateUrl: './confirm-submit-popup.component.html',
  styleUrls: ['./confirm-submit-popup.component.scss']
})
export class ConfirmSubmitPopupComponent implements OnInit {
 accountdetails=[];
 swapaccountcomment:string='';
 commentpostobject: any = {};

  constructor(
    public dialogRef: MatDialogRef<ConfirmSubmitPopupComponent>, public dialog:MatDialog,
    public service:AccountService,public router:Router,public accservive:DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }
  ngOnInit() {
  }


  // goToAccounts(act) {
    

  // }
goToAccounts(act)
{
//his.dialogRef.close(this.swapaccountcomment);
this.commentpostobject['act'] = act;
    this.commentpostobject['swapaccountcomment'] = this.swapaccountcomment; 
    this.dialogRef.close(this.commentpostobject);
  // var orginalArrayget = this.service.getAllCreationActiveRequests();
  // console.log(orginalArrayget);
  // orginalArrayget.subscribe((x: any[]) => {
  // console.log(x);
  // this.accountdetails = x;
   
  // var orginalArray = this.service.postAllCreationActiveRequests({
  //   "Name": "Account name 5",
  //   "Number": "-",
  //   "Requesttype":"New account",
  //   "Requestdate":"25/02/2018",
  //   "Swapaccount":"-",
  //   "Status": "Approval pending with SBU",
  //   "Classification": "Hunting",
  //   "Owner": "Kinshuk Bose",
  //   "Sbu": "PSG",
  //   "Vertical": "Consumer",
  //   "Subvertical" : "Energy",
  //   "Geo":"Singapore",
  //   "isCheccked":false,
  //   "isExpanded":false,
  //   "id":this.accountdetails.length + 1,
  //   "viewBtnVisibility": true,
  //   "reviewBtnVisibility": false,
  //   "rejectBtnVisibility": false,
  //     "approveBtnVisibility": false,
  //     "viewmoreBtnVisibility": false,
  //     "statusclass": "approvalstatus"
  //     },
  //     );
    
  // orginalArray.subscribe((x: any) => {
  // // console.log(x);
  // this.router.navigate(['/accounts/accountcreation/activerequest']);
  // });

// });

}

}

