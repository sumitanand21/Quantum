import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { allopportunityService, DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-reopen-approvals',
  templateUrl: './reopen-approvals.component.html',
  styleUrls: ['./reopen-approvals.component.scss']
})
export class ReopenApprovalsComponent implements OnInit {
  tableTotalCount: number;

  constructor(private allopportunities: allopportunityService, private router: Router,public service: DataCommunicationService) { }
  ReopenApprovalTableTab = [];
  ngOnInit() {
    var orginalArray = this.allopportunities.getAllReopenApproval();
    orginalArray.subscribe((x: any[]) => {
      this.ReopenApprovalTableTab = x;
      this.tableTotalCount = x.length;
    });
  }

  // custom-tab-dropdown start
@Input() IsTabList:string;
@Output() selectedValue = new EventEmitter<any>();
@Input() TabValueSelected;
emitSelected(e){
  this.selectedValue.emit(e);
}

// custom-tab-dropdown ends

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
        if(actionRequired.objectRowData[0].statusText == 'Nurtured'){
            this.service.leadNuture = true;
        }
        else{
          this.service.leadNuture = false;
        }
      }
    }
  }

}
