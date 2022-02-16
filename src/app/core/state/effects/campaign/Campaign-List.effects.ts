import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import {CampaignActionTypes, CampaignListActionTypes,AllCampaignLists,ActiveCampaignLists,CompletedCampaignLists} from '../../actions/campaign-List.action'
import { CampaignService } from '@app/core/services/campaign.service';
@Injectable()
export class Campaigneffects {
    constructor(private actions$: Actions,private offlineService: OfflineService, private campaign: CampaignService) {}
    @Effect({dispatch:false})
    addallCampaignIndexdb$ = this.actions$.pipe(
        ofType<AllCampaignLists>(CampaignActionTypes.AllCampaignList),
        tap(async action => {
          await this.offlineService.ClearCampaignIndexTableData()
          this.offlineService.addAllCampaignCacheData(this.campaign.CampaignChacheType.Table,action.payload.AllCampaignModel,action.payload.count)
        })
    )
    @Effect({dispatch:false})
    addactiveCampaignIndexdb$ = this.actions$.pipe(
        ofType<ActiveCampaignLists>(CampaignActionTypes.ActiveCampaignList),
        tap(async action => {
          await this.offlineService.ClearActiveCampaignIndexTableData()
          this.offlineService.addActiveCampaignCacheData(this.campaign.CampaignChacheType.Table,action.payload.ActiveCampaignModel,action.payload.count)
        })
    )
    @Effect({dispatch:false})
    addcompletedCampaignIndexdb$ = this.actions$.pipe(
        ofType<CompletedCampaignLists>(CampaignActionTypes.CompletedCampaignList),
        tap(async action => {
          await this.offlineService.ClearCompletedCampaignIndexTableData()
          this.offlineService.addCompletedCampaignCacheData(this.campaign.CampaignChacheType.Table,action.payload.CompletedCampaignModel,action.payload.count)
        })
    )
}