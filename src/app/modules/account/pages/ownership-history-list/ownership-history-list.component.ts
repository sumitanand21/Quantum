import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { filter } from 'rxjs/operators';
import { AccountListService } from '@app/core/services/accountList.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-ownership-history-list',
  templateUrl: './ownership-history-list.component.html',
  styleUrls: ['./ownership-history-list.component.scss']
})

export class OwnershipHistoryListComponent implements OnInit {
  isLoading: boolean;
  ownersList: any = [];
  accountName;
  ownershipArray;
  constructor(public userdat: DataCommunicationService,
    private router: Router,
    private accountListService: AccountListService,
    private EncrDecr: EncrDecrService,
  ) {
    this.accountName = this.Getdecodevalue(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));
  }



  ngOnInit() {
    this.accountListService.currentOwnershipArray.subscribe(message => this.ownershipArray = message);
    console.log(this.ownershipArray);

    if (this.ownershipArray.length > 0) {
      this.ownershipArray.map((data) => {
        this.ownersList.push({
          'Ownername': (data.Owner && data.Owner.FullName) ? data.Owner.FullName : '',
          'Emailid': (data.Owner && data.Owner.Email) ? data.Owner.Email : '',
          'Ownershipstartdate': data.StartDate ? this.formatDateData(data.StartDate) : '',
          'Ownershipenddate': data.EndDate ? this.formatDateData(data.EndDate) : '',
        });
      });
    }
  }
  formatDateData(date) {
    if (date) {
      const formatedDate = date.split('-');
      return formatedDate[2] + '-' + formatedDate[1] + '-' + formatedDate[0];
    } else {
      return 'NA';
    }
  }
  goBack() {

    this.router.navigate(['accounts/accountdetails']);

  }
  Getdecodevalue(data) {
    console.log(data);

    return this.accountListService.getSymbol(data);
  }

}