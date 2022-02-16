import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CreateOtherActivityListActionTypes,CreateOtherActivityActionTypes,OtherActivityLists } from '../../actions/createOtherActivity-list.action';
import { OtherActivityModel } from '../../state.models/OtherActivity/OtherActivity-List.interface';
import { OfflineService } from '@app/core/services/offline.services';
@Injectable()
export class OtherListeffects {
    constructor(private actions$: Actions,
        private offlineService : OfflineService) {}
    @Effect({dispatch:false})
    addallCampaignIndexdb$ = this.actions$.pipe(
        ofType<OtherActivityLists>(CreateOtherActivityListActionTypes.OtherActivityList),
        tap(async action => {
        //   await this.offlineService.ClearOtherActivityIndexTableData()
        //   this.offlineService.addAllCampaignCacheData(this.campaign.CampaignChacheType.Table,action.payload.AllCampaignModel,action.payload.count)
        })
    )
}
