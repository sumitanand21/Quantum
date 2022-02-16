import { Component, OnInit, Input } from '@angular/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DigitalApiService } from '../services/digital-api.service';

@Component({
  selector: 'app-assistant-opportunity-list',
  templateUrl: './assistant-opportunity-list.component.html',
  styleUrls: ['./assistant-opportunity-list.component.scss']
})
export class AssistantOpportunityListComponent implements OnInit {
  RecentOpened: boolean = true;
  frequentlyVisited = [];
  recentlyOpened = [];
  @Input() loginUserId: string
  constructor(private DigitalApiService: DigitalApiService) { }

  ngOnInit() {
    this.fetchRecentlyOpened(this.loginUserId)
    this.fetchFrequentlyOpened(this.loginUserId)
  }
  fetchRecentlyOpened(userGiud: string): void {
    let body = {
      "UserGuid": userGiud,//userGiud,
      "appID": "MOST_RECENT_VISITED_OPPORTUNITIES"
    };
    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          console.log(res);
          res.ResponseObject.value.map(val => {
            this.recentlyOpened.push({
              oppID: val['oppnumber'],
              oppName: val['opp@OData.Community.Display.V1.FormattedValue'],
              createdOn: val['oppcreatedon'],
              oppCount: val['oppCount'],
              oppOwner: val['Owner@OData.Community.Display.V1.FormattedValue']
            })
          })
        }
      } else {}
    },
      error => {
        console.log(error)
      });
  }
  onClick() {
    this.RecentOpened = !this.RecentOpened
  }
  fetchFrequentlyOpened(userGiud: string): void {
    let body = {
      "UserGuid": userGiud,//userGiud,
      "appID": "MOST_FREQUENTLY_VISITED_OPPORTUNITIES"
    };
    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          res.ResponseObject.value.map(val => {
            this.frequentlyVisited.push({
              oppID: val.oppNum,
              oppName: val['oppName@OData.Community.Display.V1.FormattedValue'],
              createdOn: '',
              oppCount: val.oppCount,
              oppOwner: val['owner@OData.Community.Display.V1.FormattedValue']
            })
          })
        }
      } else { }
    },
      error => {
        console.log(error)
      });
  }
}
