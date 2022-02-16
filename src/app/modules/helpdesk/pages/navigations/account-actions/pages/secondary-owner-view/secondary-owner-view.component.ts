import { Component, OnInit, Inject ,HostListener} from '@angular/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatExpansionModule,
  MatSnackBar
} from '@angular/material';
@Component({
  selector: 'app-secondary-owner-view',
  templateUrl: './secondary-owner-view.component.html',
  styleUrls: ['./secondary-owner-view.component.scss']
})
export class SecondaryOwnerViewComponent implements OnInit {
  accountName;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private EncrDecr: EncrDecrService, public accountListService: AccountListService,private dialogRef: MatDialogRef<SecondaryOwnerViewComponent>) {
    if (data) {
      this.SecondaryOwnersList = data;
    }
    this.accountName = this.accountListService.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  // getdecodevalue(data) {
  //   return this.accountListService.getSymbol(data);
  // }

  totalOwners: number = 4

  SecondaryOwnersList = [];

  // {id:0, name:'Ranjit'},
  // {id:1, name:'Shubham gupta'},
  // {id:2, name:'Shahil Chaturvedi'},
  // {id:3, name:'Purva Kothari'},
  // {id:4, name:'John Doe'},
  // {id:5, name:'Michell'},
  // {id:6, name:'Rajeev Jain'},


}
