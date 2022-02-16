import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-existing-reserve-popup',
  templateUrl: './existing-reserve-popup.component.html',
  styleUrls: ['./existing-reserve-popup.component.scss']
})
export class ExistingReservePopupComponent implements OnInit {
  SysGuid: any;
  IsHelpDesk;
  constructor(
    public dialogRef: MatDialogRef<ExistingReservePopupComponent>, 
    public dialog:MatDialog,
    private EncrDecr: EncrDecrService,
    private accountlistService: AccountListService,
    public accservive:DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.SysGuid = data.data;
      // let obj = { 'route_from': 'modif_req', 'Id':  this.SysGuid }
      // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))
      // this.accountlistService.setUrlParamsInStorage('assign_ref', this.SysGuid);
      this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': this.SysGuid });
  
      console.log("sysguid of reserve sccount",this.SysGuid)
    }
    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }
  ngOnInit() {
    this.IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
  }

}
