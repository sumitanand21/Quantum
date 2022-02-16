import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
// import { DealsActionTypes,MilestoneAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';
import { DealsActionTypes, MilestoneAction } from '@app/core/state/actions/deals.actions';



@Injectable()
export class MilestoneListEffects {

  @Effect({ dispatch: false })
  LoadMileStoneList$ = this.actions$.pipe(
    ofType<MilestoneAction>(DealsActionTypes.MilestoneDisplay),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearMilestoneListTableData()
      this.offlineService.addMilestoneListData(this.dealService.DealCacheType.Table, action.payload.Milestone)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
