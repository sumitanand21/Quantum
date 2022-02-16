import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes,DealOverViewAction  } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';
@Injectable()
export class DealOverviewEffects {

  @Effect({ dispatch: false })
  ExistingDeals$ = this.actions$.pipe(
    ofType<DealOverViewAction>(DealsActionTypes.Dealoverview),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearDealoverviewData()
      this.offlineService.addDealOverviewCacheData(this.dealService.DealCacheType.Table, action.payload.dealoverview)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
