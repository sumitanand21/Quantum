import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-manual-checks',
  templateUrl: './manual-checks.component.html',
  styleUrls: ['./manual-checks.component.scss']
})
export class ManualChecksComponent implements OnInit {
 
  constructor() { }
  manualchecks = [
    {
      "question":"Contracting entity",
      "status":"Pending",
      "sow":"View Contract",
    },
    {
      "question":"Resource checks",
      "status":"Pending",
      "sign":"View Resources",
    }
  ]
  ngOnInit() {
  }
}
