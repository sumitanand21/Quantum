import { Component, OnInit } from '@angular/core';
import { ContractsService } from '@app/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-contract-repository',
  templateUrl: './contract-repository.component.html',
  styleUrls: ['./contract-repository.component.scss']
})
export class ContractRepoComponent implements OnInit {
  tableTotalCount: number;
 

  constructor(private contractService: ContractsService, private router: Router,public dialog:MatDialog) { }

  ContractRepositoryTab = [];
  ngOnInit() {
    var orginalArray = this.contractService.getContractRepository();
    orginalArray.subscribe((x: any[]) => {
      this.ContractRepositoryTab = x;
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
  
    const dialogRef = this.dialog.open(Notepop, {
      width: '450px'
  
    });
  }
  
}
@Component({
  selector: 'Note-popup',
  templateUrl: './Notepopup.html'
})

export class Notepop {
}


