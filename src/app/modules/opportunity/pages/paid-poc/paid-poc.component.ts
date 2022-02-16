import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog } from '@angular/material';
import { renewalService } from '@app/core/services';
@Component({
  selector: 'app-paid-poc',
  templateUrl: './paid-poc.component.html',
  styleUrls: ['./paid-poc.component.scss']
})
export class PaidPocComponent implements OnInit {
  tableTotalCount: number;

  constructor(public router: Router, public service: DataCommunicationService,public dialog: MatDialog,private renewalsvc: renewalService) { }
  renewal=[];
  ngOnInit() {
    var orginalArray = this.renewalsvc.getAll();
    orginalArray.subscribe((x: any[]) => {
      this.renewal = x;
      this.tableTotalCount = x.length;
    });
  }
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
}
