import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService } from '@app/core/services/accountlist.service';
@Component({
  selector: 'app-swap-popup',
  templateUrl: './swap-popup.component.html',
  styleUrls: ['./swap-popup.component.scss']
})
export class SwapPopupComponent implements OnInit {
  // ownerid: any;
  // countryId: any;
  list;
  close = false;
  selectedValue: any;
  radioBtnselected: string;

  constructor(public AccountService: AccountListService,public dialogRef: MatDialogRef<SwapPopupComponent>, public dialog: MatDialog, public apiservice: S3MasterApiService, public accservive: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.cardItems = data.allSwapableAccount;    
    // this.ownerid = data.ownerid;
    // this.countryId = data.countryId;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  closeDiv() {
    this.close = true;
  }
  cardItems = [];

  ngOnInit() {
    // this.getswsapaccount();
    // console.log("owneris from ", this.ownerid);

  }
  getSymbol(data) {
    // console.log(data)
    return this.AccountService.getSymbol(data);
  }
  selectedData() {
    this.dialogRef.close(this.selectedValue)
  }
  // getswsapaccount() {
  //   var swapaccount = this.apiservice.getswapaccount(this.ownerid, this.countryId)
  //   swapaccount.subscribe((res: any) => {
  //     console.log("swapaccount data", res.ResponseObject)
  //     if (!res.IsError && res.ResponseObject && res.ResponseObject.length > 0)
  //       this.cardItems = res.ResponseObject;
  //   })
  // }
}
