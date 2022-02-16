import { Component, OnInit, Input } from '@angular/core';
import { DigitalApiService } from '../services/digital-api.service';

@Component({
  selector: 'app-assistant-account-list',
  templateUrl: './assistant-account-list.component.html',
  styleUrls: ['./assistant-account-list.component.scss']
})
export class AssistantAccountListComponent implements OnInit {
  RecentOpened: boolean = true;
  recentlyOpenedTab = true;
  frequentlyVisited = [];
  recentlyOpened = [];
  isLoadingRecentlyAccounts: boolean = false;
  isLoadingFrequentlyAccounts: boolean = false;
  @Input() loginUserId: string
  constructor(private digitalApiService: DigitalApiService) { }

  ngOnInit() {
    this.fetchRecentlyOpened(this.loginUserId)
    this.fetchFrequentlyOpened(this.loginUserId)
  }

  fetchRecentlyOpened(userGiud: string): void {
    // let body = {
    //   "UserGuid": userGiud,//userGiud,
    //   "appID": "MOST_VISITED_ACCOUNTS"
    // };

    let body = {
      "UserGuid": userGiud
    };
    this.isLoadingRecentlyAccounts = true;
    this.digitalApiService.GetRecentlyVisitedAccounts(body).subscribe(res => {
      console.log(res);
      this.isLoadingRecentlyAccounts = false;
      if (!res.IsError) {
        if (res.ResponseObject) {
          console.log(res);
          res.ResponseObject.map(val => {
            this.recentlyOpened.push({
              accountName: val['AccountName'],
              accountID: val['AccountNumber'],
              AccountOwner: val['AccountOwner']
            })
          })
        }
      } else {

      }
    },
      error => {
        this.isLoadingRecentlyAccounts = false
        console.log(error)
      });
  }


  onClick() {
    this.RecentOpened = !this.RecentOpened
  }
  fetchFrequentlyOpened(userGiud: string): void {
    // let body = {
    //   "UserGuid": userGiud,//userGiud,
    //   "appID": "MOST_FREQUENTLY_ACCOUNTS"
    // };
    let body = {
      "UserGuid": userGiud
    };
    this.isLoadingFrequentlyAccounts = true;
    this.digitalApiService.GetFrequentlyVisitedAccounts(body).subscribe(res => {
      console.log(res);
      this.isLoadingFrequentlyAccounts = false;
      if (!res.IsError) {
        if (res.ResponseObject) {
          res.ResponseObject.map(val => {
            this.frequentlyVisited.push({
              accountID: val['AccountNumber'] || "NA",
              accountName: val["AccountName"] || "NA",
              accountOwner: val['AccountOwner'] || "NA",
              accountCount: val['NumberOfVisits'] || "NA"
            })
          })
        }
      } else {

      }
    },
      error => {
        this.isLoadingFrequentlyAccounts = false;
        console.log(error)
      });
  }


}
