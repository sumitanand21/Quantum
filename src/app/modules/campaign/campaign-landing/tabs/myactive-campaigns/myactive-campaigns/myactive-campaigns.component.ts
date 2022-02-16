import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataCommunicationService, CampaignService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-myactive-campaigns',
  templateUrl: './myactive-campaigns.component.html',
  styleUrls: ['./myactive-campaigns.component.scss']
})
export class MyactiveCampaignsComponent implements OnInit {

  constructor(public userdat :DataCommunicationService,
    public router: Router,
     private fb:FormBuilder,public dialog: MatDialog,
     public campaign:CampaignService
) { }
performTableChildAction(childActionRecieved): Observable<any> {
  var actionRequired = childActionRecieved;
  console.log(actionRequired.action)
  switch (actionRequired.action) {
    case 'tabNavigation':
    {
      this.TabNavigation(childActionRecieved.objectRowData[0]);
      return;
    }
  }
}
TabNavigation(item) {
  switch (item.index) {
    case 0:
      this.router.navigate(['/campaign/AllCampaigns'])
      return
    case 1:
      this.router.navigate(['/campaign/ActiveCampaigns'])
      return
    case 2:
      this.router.navigate(['/campaign/CompletedCampaigns'])
      return
      case 3:
      this.router.navigate(['/campaign/myactiveCampaigns'])
      return
  }
}
campaignTable=[];

ngOnInit(): void {
  var orginalArray = this.campaign.getAll();
  orginalArray.subscribe((x: any[]) => {
    this.campaignTable = x;
  });
}


}
