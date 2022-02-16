import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExistingAccountPopupComponent } from '../existing-account-popup/existing-account-popup.component';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';
import { ExistingReservePopupComponent } from '../existing-reserve-popup/existing-reserve-popup.component';
import { AccountListService } from '@app/core/services/accountList.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-search-account-popup',
  templateUrl: './search-account-popup.component.html',
  styleUrls: ['./search-account-popup.component.scss']
})
export class SearchAccountPopupComponent implements OnInit {
  openDnB: boolean = false;
  loggedUser: string = '';
  isActivityGroupSearchLoading: boolean;
  companyName: string;
  comapnyNamewipro: string;
  showCompany: boolean;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  showCompanySwitch: boolean = true;
  arrowkeyLocation = 0;
  companyDetails: {}[];
  constructor(public accountListService: AccountListService, private EncrDecr: EncrDecrService, public router: Router, public dialogRef: MatDialogRef<SearchAccountPopupComponent>, public dialog: MatDialog, public accservive: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loggedUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

    if (data && data.openDnB) {
      this.openDnB = data.openDnB;

    }
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;

  }
  onNoClick(): void {
    this.dialogRef.close([]);
  }
  wiproDatabsebtclick() {
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
  }
  dDatabasebtnClick() {
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
  }
  ExistingAccount() {
    const dialogRef4 = this.dialog.open(ExistingAccountPopupComponent,
      {
        width: '380px'
      });
  }
  reserveAccount() {
    const dialogRef5 = this.dialog.open(ExistingReservePopupComponent,
      {
        width: '380px'
      });
  }

  companyNameClose() {

    this.showCompanySwitch = false;
  }
  appendName(value: any) {
    console.log(value);

    if (value.Type && (value.Type.Id === 3 || value.Type.Id === 12)) {
      this.dialogRef.close();
      const dialogRef1 = this.dialog.open(ExistingAccountPopupComponent,
        {
          width: '380px',
          data: { data: value.SysGuid }
        });
    } else if (value.Type && value.Type.Id === 1) {
      this.dialogRef.close();
      const dialogRef2 = this.dialog.open(ExistingReservePopupComponent,
        {
          width: '380px',
          data: { data: value.SysGuid }
        });
    } else {
      this.companyName = value.Name;
      console.log(this.companyDetails);
      this.dialogRef.close(value);
    }
  }

  onAccountSearch() {
    const payload = {
      'SearchText': this.companyName,
      PageSize: 10,
      OdatanextLink: '',
      RequestedPageNumber: 1
    }
    let accountSearch;
    this.companyDetails = [];
    this.isActivityGroupSearchLoading = true;
    if (this.openDnB)
      accountSearch = this.accountListService.SearchAccountAndProspect(payload);
    else
      accountSearch = this.accountListService.existAccountSearch(payload);

    accountSearch.subscribe((res) => {
      console.log('in account search...');
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {

        if (res.ResponseObject.length === 0) {
          this.companyDetails = [];
          this.companyDetails['message'] = 'No Results found';
        } else {
          this.companyDetails = res.ResponseObject;
        }

      } else {
        this.companyDetails = [];
        this.companyDetails['message'] = 'No Results found';
      }

    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.companyDetails = [];
      this.companyDetails['message'] = 'No Results found';
    });
  }
 getdecodevalue(data)
  {
    return this.accountListService.getSymbol(data);
  }
}
