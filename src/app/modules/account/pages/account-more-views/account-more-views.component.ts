import { Component, OnInit,HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';

@Component({
  selector: 'app-account-more-views',
  templateUrl: './account-more-views.component.html',
  styleUrls: ['./account-more-views.component.scss']
})
export class AccountMoreViewsComponent implements OnInit {
  AccountCreationActiveRequestsTable=[];
  more_clicked;
  isPin: boolean = true;

  togglePin(){
    this.isPin = !this.isPin;
  }
  constructor(public location:Location,public farmingaccount:AccountService,public router:Router
  ,public dialog: MatDialog,public userdat:DataCommunicationService) { }

  ngOnInit(): void {

    var orginalArray = this.farmingaccount.getAllFarming();
     
    orginalArray.subscribe((x: any[]) => {
   //  console.log(x);
    this.AccountCreationActiveRequestsTable = x;
     
    });
  }
  goBack() {
    this.location.back();
  }
  openCreatePopup() {
    const dialogRef = this.dialog.open(SaveviewPopup,
      {
        disableClose: true,
        width:'380px'
      });
   }

}

@Component({
  selector: 'saveview-popup',
  templateUrl: './saveviewpopup.html',
})

export class SaveviewPopup {
  submitted;
  accOwnerSwap;
  constructor(public dialogRef: MatDialogRef<SaveviewPopup>,public accservive:DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  
     /****************** List name autocomplete code start ****************** */
     showContact4: boolean = false;
     contactName4: string = "";
     contactNameSwitch4: boolean = true;
   
     contactNameclose4() {
       this.contactNameSwitch4 = false;
     }
     appendcontact4(value: string, i) {
       this.contactName4 = value;
       this.selectedContact4.push(this.wiproContact4[i])
     }
     wiproContact4: {}[] = [
   
       { index: 0, contact: 'Wipro new template', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    ]
   
     selectedContact4: {}[] = []; 
     /****************** list name  autocomplete code end ****************** */
}
