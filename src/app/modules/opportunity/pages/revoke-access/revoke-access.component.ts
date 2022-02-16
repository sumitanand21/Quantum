import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, allopportunityService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { RevokeaccessPopupComponent } from '@app/shared/components/single-table/sprint4Modal/revokeaccess-popup/revokeaccess-popup.component';

@Component({
  selector: 'app-revoke-access',
  templateUrl: './revoke-access.component.html',
  styleUrls: ['./revoke-access.component.scss']
})
export class RevokeAccessComponent implements OnInit {
  isLoading=false;
  RevokeAccessTable = [];
  tableTotalCount: number;
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  constructor(private allopportunities: allopportunityService,public dataService:DataCommunicationService,public router:Router,public dialog:MatDialog) { }
 
  ngOnInit() {
    var orginalArray = this.allopportunities.getAllRevokeAccess();
    orginalArray.subscribe((x: any[]) => {
      this.RevokeAccessTable = x;
      this.tableTotalCount = x.length;
    });
  }
  goBack() {
    this.router.navigate(['/opportunity/opportunityview/overview'])
  }
  performChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'isrevokeaccess':
        {
          const dialogRef = this.dialog.open(RevokeaccessPopupComponent,
            {
              width: '380px',
            });
            return;
        }
    }
  }
}
