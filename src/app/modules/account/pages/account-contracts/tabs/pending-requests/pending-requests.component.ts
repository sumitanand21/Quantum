import { Component, OnInit, Input ,HostListener} from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { NoteComponent } from '../../account-contracts.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class PendingRequestsComponent implements OnInit {
  PendingRequestTable = [];
  constructor(public activerequest: AccountService,
    public router: Router,
    public encrDecrService: EncrDecrService,
    private accountlistService: AccountListService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    var orginalArray = this.activerequest.getAllPendingRequests();
    orginalArray.subscribe((x: any[]) => {
      this.PendingRequestTable = x;

    });

  }
  openNotePopup() {
    const dialogref = this.dialog.open(NoteComponent,
      {
        disableClose: true,
        width: '440px'
      }
    );
  }
  requestAccesspopup() {
    const dialogref = this.dialog.open(ContractRequestAccesspopup,
      {
        disableClose: true,
        width: '350px'
      }
    );
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    // debugger;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    // let obj = { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.encrDecrService.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {
        console.log(actionRequired);
        // this.accountlistService.setUrlParamsInStorage('acc_req', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id':  actionRequired.objectRowData[0].id })
      
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id':  actionRequired.objectRowData[0].id })
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id':  actionRequired.objectRowData[0].id })         
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'review':
        {
        this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id':  actionRequired.objectRowData[0].id })         
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'editdraft':
        {
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          return;
        }
    }
  }
}

@Component({
  selector: 'requestaccess',
  templateUrl: './requestaccess-popup.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class ContractRequestAccesspopup {
  constructor(public dialogRef: MatDialogRef<ContractRequestAccesspopup>) {
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}
