import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Router } from '@angular/router';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
@Component({
  selector: 'app-existing-account-popup',
  templateUrl: './existing-account-popup.component.html',
  styleUrls: ['./existing-account-popup.component.scss']
})
export class ExistingAccountPopupComponent implements OnInit {
  SysGuid: string = '';
  parentaccountname: string = '';
  parentaccountdetailes: any
  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<ExistingAccountPopupComponent>,
    public dialog: MatDialog, public accservive: DataCommunicationService,
    public listservice: AccountListService,
    public master3Api: S3MasterApiService,
    private EncrDecr: EncrDecrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("data from the ", data)
    this.SysGuid = (data.data && !data.data.Id) ? data.data : (data.data && data.data.Id) ? data.data.Id : '';
    this.parentaccountname = data.data && data.data.AccountName ? data.data.AccountName : '';
    // let obj = { 'route_from': 'modif_req', 'Id': data.data.SysGuid }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))
    // this.listservice.setUrlParamsInStorage('assign_ref', this.SysGuid);
    this.listservice.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': this.SysGuid });

  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  childaccount() {
    this.parentaccountdetailes = { "parentsysguid": this.SysGuid, "parentaccountname": this.parentaccountname, "parentflag": 'true' }
    this.listservice.sendparentaccountdetails(this.parentaccountdetailes)
    console.log("ghvghv:::::::::::::::", this.parentaccountdetailes)
    this.getultimateparentbyparent(this.SysGuid)
  }
  getultimateparentbyparent(id) {
    this.master3Api.getUltimateParentByParent(id).subscribe((res: any) => {
      // test the load
      console.log("response of ultimate parent by parent", res.ResponseObject);
      if (!res.IsError) {
        this.parentaccountdetailes['ultimateparentguid'] = res.ResponseObject[0].UltimateParentAccount.SysGuid;
        this.parentaccountdetailes['ultimateparentname'] = res.ResponseObject[0].UltimateParentAccount.Name;
        // this.prospectAccForm.controls['ultimateparent'].setValue(this.getSymbol(res.ResponseObject[0].UltimateParentAccount.Name))
        // this.accountCreationObj['ultimateparent'] = res.ResponseObject[0].UltimateParentAccount.SysGuid;
      }
      localStorage.setItem('parentdetailes', JSON.stringify(this.parentaccountdetailes))
      localStorage.setItem('parentflag', 'true')
      this.dialogRef.close(this.parentaccountdetailes)
    //  this.router.navigate(['/accounts/createnewaccount'])

    })
  }

  // childaccountexist(){
  //   this.router.navigate(['/accounts/createnewaccount'])
  //   this.dialogRef.close(this.parentaccountdetailes)
  // }

  ngOnInit() {
  }

}
