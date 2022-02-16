import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContractsService } from '@app/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class PendingComponent implements OnInit {
  tableTotalCount: number;

  constructor(private contractService: ContractsService, private router: Router,public dialog:MatDialog) { }

  pendingRequestTab = [];
  ngOnInit() {
    var orginalArray = this.contractService.getPendingRequest();
    orginalArray.subscribe((x: any[]) => {
      this.pendingRequestTab = x;
      this.tableTotalCount = x.length;
    });
  }

  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {

      case 'convertOpportunity': {
        return of('nurture Trigger');
      }

      case 'OpportunityName': {
        this.router.navigate(['/opportunity/opportunityview/overview']);
      }
    }
  }
 
  openNote() {
  
    const dialogRef = this.dialog.open(NotepopPending, {
      width: '450px'
  
    });
  }
  
}
@Component({
  selector: 'Note-popup',
  templateUrl: './Notepopup.html'
})

export class NotepopPending {
}
