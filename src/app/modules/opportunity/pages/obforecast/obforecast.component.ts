import { Component, OnInit } from '@angular/core';
import { allopportunityService, DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { StaffingInititatedPopupComponent } from '@app/shared/components/single-table/sprint4Modal/staffing-inititated-popup/staffing-inititated-popup.component';

@Component({
  selector: 'app-obforecast',
  templateUrl: './obforecast.component.html',
  styleUrls: ['./obforecast.component.scss']
})
export class OBforecastComponent implements OnInit {

isLoading=false;
OBforecastTable = [];
  tableTotalCount: number;
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  constructor(public dialog:MatDialog, private allopportunities: allopportunityService,public dataService:DataCommunicationService,public router :Router) { }
 
  ngOnInit() {
    var orginalArray = this.allopportunities.getAllobforecast();
    orginalArray.subscribe((x: any[]) => {
      this.OBforecastTable = x;
      this.tableTotalCount = x.length;
    });
  }
  goBack() {
    this.router.navigate(['/opportunity/opportunityview/overview'])
  }
  openInitiateStaffing()
  {
    const dialogRef = this.dialog.open(StaffingInititatedPopupComponent,
      {
        width: '380px',
      });
  }
}
