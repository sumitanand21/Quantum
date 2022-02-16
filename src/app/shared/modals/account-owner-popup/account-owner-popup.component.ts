import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MasterApiService } from '@app/core';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';

@Component({
  selector: 'app-account-owner-popup',
  templateUrl: './account-owner-popup.component.html',
  styleUrls: ['./account-owner-popup.component.scss']
})
export class AccountOwnerPopupComponent implements OnInit {
  customerContact: any = [];
  selectedCustomer: any;
  isActivityGroupSearchLoading: boolean;
  constructor(
    public dialogRef: MatDialogRef<AccountOwnerPopupComponent>,
    public dialog: MatDialog,
    public accservive: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterApi: MasterApiService,
    public master3Api: S3MasterApiService) {
    console.log("called ==================================================> ");

  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  close = false;
  /****************** customer contact autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;

  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }
  SearchAccountOwner(customerName) {
    console.log(customerName);
    this.isActivityGroupSearchLoading = true;
    this.customerContact = [];
    // this.master3Api.SearchUser(customerName).subscribe(result => {    
    this.master3Api.AccountOwnerSearch(customerName).subscribe(result => {
      this.isActivityGroupSearchLoading = false;
      console.log(result);
      if (!result.IsError && result.ResponseObject) {
        this.customerContact = result.ResponseObject.map(val => {
          let initials = val.FullName.split(" ");
          console.log("initals", initials);
          return {
            SysGuid: val.SysGuid,
            FullName: val.FullName,
            Initials: initials.length == 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
            Designation: val.Designation
          }
        });
        if (result.ResponseObject.length == 0)
          this.customerContact['message'] = "No record found";
      } else {
        this.customerContact['message'] = "No record found";
      }
      // if(!result.IsError && result.Res)
      // this.customerContact= result.
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.customerContact = [];
    })
  }
  appendcustomer(item: any) {
    this.customerName = item.FullName;
    this.selectedCustomer = item;
    // this.selectedCustomer.push(item);
    // this.customerContact=this.customerContact.filter((x:any)=>x.index!=item.index);
    // this.customerContact = this.customerContact.filter(x => x.index != this.customerContact[i].index );
  }

  // customerContact :any[] = [

  //   { index:0,contact:'Anubhav Jain',designation:'Pre Sales Head',initials:'AJ',value:true},
  //   { index:1,contact:'Kanika Tuteja',designation:'Pre Sales Head',initials:'KT',value:false},
  //   { index:2,contact:'Pankaj Jiii',designation:'Pre Sales Head',initials:'AJ',value:false},
  //   { index:3,contact:'Rahul Tripathi',designation:'Pre Sales Head',initials:'KT',value:false},
  //   { index:4,contact:'Anubhav Jain',designation:'Pre Sales Head',initials:'AJ',value:true},
  //   { index:5,contact:'Kanika Tuteja',designation:'Pre Sales Head',initials:'KT',value:false}
  // ]

  // selectedCustomer: {}[] = [];


  /****************** customer contact autocomplete code end ****************** */

  closeDiv(item: any) {
    //this.close=true;
    // console.log(this.selectedCustomer);
    // this.customerContact.push(item);
    // this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index != item.index);

  }
  closepop() {
    this.dialogRef.close(this.selectedCustomer);
  }
  ngOnInit() {
  }
}
