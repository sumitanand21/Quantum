import { Injectable } from '@angular/core';
import { ApiService } from '@app/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EnvService } from '@app/core/services/env.service';
import { catchError, map, retry } from 'rxjs/operators';

const routes = {
  L2O: 'Catalyst/File/RelativePath',
  ProposalList: 'proposal/list',
  DealTemplate: 'proposal/list',
  wittylistlinkedwitids: 'WittyParrot/ListCategorizedId',
  wittylistKMAssestDocs: 'Opportunity/CategorizedId',
  wittylistwitbyids: 'WittyParrot/ListwithInfoId',
  wittylistlinkedwits: 'WittyParrot/CategorizedId',
  GetRelationshipScore: 'v1/DigitalAssistant/GetRelationshipScore',
  GetLastFiveOrderLinkedToAccount: 'v1/DigitalAssistant/GetLastFiveOrderLinkedToAccount',
  GetLastFiveActivityLinkedToAccount: 'v1/DigitalAssistant/GetLastFiveActivityLinkedToAccount',
  GetLastFiveOpportunitiesLinkedToAccount: 'v1/DigitalAssistant/GetLastFiveOpportunitiesLinkedToAccount',
  ToCheckVerticalSpocUser: 'v1/DigitalAssistant/ToCheckVerticalSpocUser',
  GetHuntingManagerList: 'v1/DigitalAssistant/GetHuntingManagerList',
  GetRecentlyVisitedAccounts: 'v1/DigitalAssistant/GetRecentlyVisitedAccounts',
  GetFrequentlyVisitedAccounts: 'v1/DigitalAssistant/GetFrequentlyVisitedAccounts',
  TeamsIncentivisedUserList: 'v1/DigitalAssistant/Account/TeamsIncentivisedUserList',
  commonApiUrl: 'v1/DigitalAssistant/FetchSearchData'
}

@Injectable({
  providedIn: 'root'
})
export class DigitalApiService {

  constructor(private apiService: ApiService, private http: HttpClient,public envr : EnvService) { }

  commonApi(body) {
    return this.apiService.daPost(routes.commonApiUrl, body)
  }

  GetRecentlyVisitedAccounts(body) {
    return this.apiService.daPost(routes.GetRecentlyVisitedAccounts, body)
  }

  GetFrequentlyVisitedAccounts(body) {
    return this.apiService.daPost(routes.GetFrequentlyVisitedAccounts, body)
  }

  GetLastFiveOrderLinkedToAccount(body) {
    return this.apiService.daPost(routes.GetLastFiveOrderLinkedToAccount, body)
  }

  GetLastFiveOpportunitiesLinkedToAccount(body) {
    return this.apiService.daPost(routes.GetLastFiveOpportunitiesLinkedToAccount, body)
  }

  GetLastFiveActivityLinkedToAccount(body) {
    return this.apiService.daPost(routes.GetLastFiveActivityLinkedToAccount, body)
  }

  fetchRelScore(body: any) {
    return  this.apiService.daPost(routes.GetRelationshipScore, body)
  }
   //order api call start
   fetchTargets(body: any) {
    return this.apiService.daPost(routes.TeamsIncentivisedUserList, body)
  }
   //order api call end

  post_TemplateIdsOpp(payload): Observable<any> {
    return this.apiService.wittyPost(routes.wittylistKMAssestDocs, payload);
  }
  post_SuccessStories2(payload): Observable<any> {
    console.log(payload, "payoad.....")
    //return this.apiService.wittyPost(routes.wittylistwitbyids, payload)
    return this.http.post(this.envr.wittyBaseUrl + routes.wittylistwitbyids, payload).pipe(
        retry(3)
      );
  }


  forLead(body) {
    return this.apiService.daPost(routes.ToCheckVerticalSpocUser, body)
  }

  GetHuntingManagerList(body) {
    return this.apiService.daPost(routes.GetHuntingManagerList, body)
  }
}
